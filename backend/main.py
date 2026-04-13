from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from io import BytesIO
from xhtml2pdf import pisa
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import firebase_admin
from firebase_admin import credentials, firestore, storage
from google.cloud import storage as gcp_storage
import time
import os
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader, PdfWriter

def get_db():
    # Inicializa Firebase de forma lazy usando Application Default Credentials (ADC)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(options={
            'storageBucket': 'shaq-brand-bot.firebasestorage.app',
            'projectId': 'shaq-brand-bot'
        })
    return firestore.client()

app = FastAPI(title="Agentes iO Backend")

# Habilitar CORS para desarrollo local (en Cloud Run no aplica al ser mismo origen)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    id_unico: str

@app.post("/api/login")
async def login(request: LoginRequest):
    id_unico = request.id_unico
    
    if not id_unico.isdigit() or len(id_unico) != 6:
        raise HTTPException(status_code=400, detail="El ID debe ser de 6 números exactos")
        
    try:
        db = get_db()
        doc_ref = db.collection('acceso_agentes').document(id_unico)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=401, detail="ID Invalido - Misión Rechazada")
            
        agente_data = doc.to_dict()
        if "id" not in agente_data:
            agente_data["id"] = doc.id
            
        return {"success": True, "agente": agente_data}
    except Exception as e:
        print(f"Error al consultar Firestore: {e}")
        raise HTTPException(status_code=500, detail="Error de conexión con Firestore: " + str(error))

class UpdateRequest(BaseModel):
    id_unico: str
    nombre: str
    apellido: str

@app.post("/api/agente/update")
async def update_agente(request: UpdateRequest):
    try:
        db = get_db()
        doc_ref = db.collection('acceso_agentes').document(request.id_unico)
        
        # Combine name and lastname
        full_name = f"{request.nombre.strip()} {request.apellido.strip()}".strip()
        
        doc_ref.update({
            "nombre": full_name
        })
        
        return {"success": True, "message": "Perfil actualizado", "nombre": full_name}
    except Exception as e:
        print(f"Error actualizando agente: {e}")
        raise HTTPException(status_code=500, detail="Error actualizando perfil: " + str(e))

from fastapi import UploadFile, File, Form

@app.post("/api/agente/foto")
async def upload_agente_foto(id_unico: str = Form(...), file: UploadFile = File(...)):
    try:
        # Validate file
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="El archivo no es una imagen")
            
        # Initialize Google Cloud Storage Client (will use the same credentials configured in the environment)
        # Acceder al bucket configurado por defecto en la inicialización (ADC)
        bucket = firebase_admin.storage.bucket()
        
        # Create a unique filename based on the agent's ID and timestamp to break cache
        file_extension = file.filename.split('.')[-1]
        blob_name = f"perfil_{id_unico}_{int(time.time())}.{file_extension}"
        blob = bucket.blob(blob_name)
        
        # Upload file contents to bucket
        file_contents = await file.read()
        blob.upload_from_string(file_contents, content_type=file.content_type)
        
        # Make public if we want to directly access it from React via URL
        # NOTE: Bucket needs to have fine-grained ACLs enabled for make_public() to work
        # Or you can construct the standard public URL if the whole bucket is public
        blob.make_public()
        public_url = blob.public_url

        # Store URL in Firestore
        db = get_db()
        doc_ref = db.collection('acceso_agentes').document(id_unico)
        doc_ref.set({"foto_url": public_url}, merge=True)
        
        return {"success": True, "message": "Foto de perfil actualizada", "foto_url": public_url}
    
    except Exception as e:
        print(f"Error subiendo foto: {e}")
        raise HTTPException(status_code=500, detail="Error en servidor al procesar foto: " + str(e))

class ApunteRequest(BaseModel):
    id_unico: str
    session_id: str
    contenido: str

@app.post("/api/apunte")
async def save_apunte(request: ApunteRequest):
    try:
        db = get_db()
        doc_ref = db.collection('acceso_agentes').document(request.id_unico).collection('apuntes').document(request.session_id)
        doc_ref.set({
            "contenido": request.contenido,
            "actualizado_en": firestore.SERVER_TIMESTAMP
        }, merge=True)
        return {"success": True, "message": "Apunte guardado"}
    except Exception as e:
        print(f"Error guardando apunte: {e}")
        raise HTTPException(status_code=500, detail="Error guardando apunte: " + str(e))
        
class PreguntaRequest(BaseModel):
    id_unico: str
    session_id: str
    pregunta: str

@app.post("/api/pregunta")
async def submit_pregunta(request: PreguntaRequest):
    try:
        db = get_db()
        # Save securely in a central `preguntas` collection structured by session
        doc_ref = db.collection('preguntas_conferencia').document(request.session_id).collection('preguntas').document()
        doc_ref.set({
            "id_unico": request.id_unico,
            "pregunta": request.pregunta,
            "creado_en": firestore.SERVER_TIMESTAMP
        })
        return {"success": True, "message": "Pregunta enviada correctamente exitosamente"}
    except Exception as e:
        print(f"Error guardando pregunta: {e}")
        raise HTTPException(status_code=500, detail="Error al procesar tu pregunta: " + str(e))

@app.get("/api/preguntas/{session_id}")
async def get_preguntas(session_id: str, id_unico: str = None):
    try:
        db = get_db()
        preguntas_ref = db.collection('preguntas_conferencia').document(session_id).collection('preguntas')
        
        # Order by created_at descending
        query = preguntas_ref.order_by('creado_en', direction=firestore.Query.DESCENDING)
        
        docs = query.stream()
        preguntas = []
        
        # Cache for agent names to avoid redundant Firestore reads
        nombres_cache = {}

        for doc in docs:
            data = doc.to_dict()
            uid = data.get("id_unico")
            
            # If id_unico is provided as filter, only show that user's questions
            if id_unico and uid != id_unico:
                continue
            
            nombre = "Anónimo"
            if uid:
                if uid in nombres_cache:
                    nombre = nombres_cache[uid]
                else:
                    agente_doc = db.collection('acceso_agentes').document(uid).get()
                    if agente_doc.exists:
                        # Fallback for old records or different naming conventions
                        agente_data = agente_doc.to_dict()
                        nombre = agente_data.get("nombre") or agente_data.get("Nombre") or uid
                    nombres_cache[uid] = nombre
                
            preguntas.append({
                "id": doc.id,
                "pregunta": data.get("pregunta", ""),
                "id_unico": uid,
                "nombre": nombre,
                "respondida": data.get("respondida", False)
            })
            
        return {"success": True, "preguntas": preguntas}
    except Exception as e:
        print(f"Error cargando preguntas: {e}")
        raise HTTPException(status_code=500, detail="Error cargando preguntas: " + str(e))

class EditPreguntaRequest(BaseModel):
    pregunta: str

@app.put("/api/pregunta/{session_id}/{question_id}")
async def edit_pregunta(session_id: str, question_id: str, request: EditPreguntaRequest):
    try:
        db = get_db()
        doc_ref = db.collection('preguntas_conferencia').document(session_id).collection('preguntas').document(question_id)
        doc_ref.update({
            "pregunta": request.pregunta,
            "editado_en": firestore.SERVER_TIMESTAMP
        })
        return {"success": True, "message": "Pregunta editada correctamente"}
    except Exception as e:
        print(f"Error editando pregunta: {e}")
        raise HTTPException(status_code=500, detail="Error editando pregunta: " + str(e))

class ToggleRespondidaRequest(BaseModel):
    respondida: bool

@app.put("/api/pregunta/{session_id}/{question_id}/respondida")
async def toggle_pregunta_respondida(session_id: str, question_id: str, request: ToggleRespondidaRequest):
    try:
        db = get_db()
        doc_ref = db.collection('preguntas_conferencia').document(session_id).collection('preguntas').document(question_id)
        doc_ref.update({
            "respondida": request.respondida
        })
        return {"success": True, "message": "Estado de pregunta actualizado"}
    except Exception as e:
        print(f"Error actualizando estado de pregunta: {e}")
        raise HTTPException(status_code=500, detail="Error actualizando estado de pregunta: " + str(e))


@app.delete("/api/pregunta/{session_id}/{question_id}")
async def delete_pregunta(session_id: str, question_id: str):
    try:
        db = get_db()
        doc_ref = db.collection('preguntas_conferencia').document(session_id).collection('preguntas').document(question_id)
        doc_ref.delete()
        return {"success": True, "message": "Pregunta eliminada correctamente"}
    except Exception as e:
        print(f"Error eliminando pregunta: {e}")
        raise HTTPException(status_code=500, detail="Error eliminando pregunta: " + str(e))

@app.get("/api/apunte/{id_unico}/pdf")
async def generar_pdf(id_unico: str):
    try:
        db = get_db()
        # Opcional: Traer nombre del agente
        agente_doc = db.collection('acceso_agentes').document(id_unico).get()
        if not agente_doc.exists:
            raise HTTPException(status_code=404, detail="Agente no encontrado")
        nombre_agente = agente_doc.to_dict().get("nombre", "Agente CAMZYOS")

        apuntes_ref = db.collection('acceso_agentes').document(id_unico).collection('apuntes')
        apuntes_docs = apuntes_ref.stream()

        # Armar el HTML (Estilizado oscuro que empate con tu diseño para mantener congruencia)
        html_content = f"""
        <html>
        <head>
            <style>
                @page {{
                    size: letter portrait;
                    margin: 2cm;
                }}
                body {{ 
                    font-family: Helvetica, sans-serif; 
                    color: #fff; 
                    background-color: #2f2016; 
                }}
                h1 {{ 
                    color: #008fb4; 
                    text-align: center; 
                    font-size: 24pt;
                    margin-bottom: 5px;
                }}
                .subtitle {{
                    text-align: center;
                    color: #cbd5e1;
                    font-size: 14pt;
                    margin-bottom: 30px;
                }}
                .agent-info {{
                    font-size: 12pt;
                    border-bottom: 2px solid #008fb4;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                    color: #cbd5e1;
                }}
                .session-title {{ 
                    color: #008fb4;
                    font-size: 16pt;
                    margin-top: 30px;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }}
                .note-content {{ 
                    font-size: 12pt; 
                    line-height: 1.6; 
                    white-space: pre-wrap;
                    background-color: #2a1d15;
                    padding: 15px;
                    border-left: 4px solid #008fb4;
                    color: white;
                }}
            </style>
        </head>
        <body style="background-color: #2f2016;">
            <h1>CAMZYOS 2026</h1>
            <div class="subtitle">Libreta de Apuntes Oficiales</div>
            
            <div class="agent-info">
                <b>Agente CAMZYOS:</b> {nombre_agente}<br/>
                <b>ID de Misión:</b> {id_unico}
            </div>
        """
        
        has_notes = False
        for doc in apuntes_docs:
            has_notes = True
            data = doc.to_dict()
            session_id = doc.id
            contenido = data.get("contenido", "").strip()
            
            # Simple conversion of raw keys to titles just for PDF rendering
            session_title = session_id.replace("_", " ").title()
            
            html_content += f"""
            <div class="session-title">{session_title}</div>
            <div class="note-content">
                {contenido}
            </div>
            """

        if not has_notes:
            html_content += "<div class='note-content'>Aún no hay apuntes guardados en ninguna bitácora.</div>"
            
        html_content += "</body></html>"
        
        # Generar PDF con xhtml2pdf
        pdf_buffer = BytesIO()
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_buffer)
        
        if pisa_status.err:
            raise HTTPException(status_code=500, detail="Error al generar el PDF interno")
            
        pdf_buffer.seek(0)
        
        headers = {
            'Content-Disposition': f'attachment; filename="CAMZYOS_Apuntes_{id_unico}.pdf"'
        }
        
        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generando PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error al generar PDF: {e}")

@app.get("/api/apunte/{id_unico}/{session_id}")
async def get_apunte(id_unico: str, session_id: str):
    try:
        db = get_db()
        doc_ref = db.collection('acceso_agentes').document(id_unico).collection('apuntes').document(session_id)
        doc = doc_ref.get()
        
        if doc.exists:
            return {"success": True, "contenido": doc.to_dict().get("contenido", "")}
        return {"success": True, "contenido": ""}
    except Exception as e:
        print(f"Error leyendo apunte: {e}")
        raise HTTPException(status_code=500, detail="Error leyendo apunte: " + str(e))

@app.get("/api/constancia/{id_unico}")
async def generar_constancia(id_unico: str):
    """
    Genera la constancia usando un archivo PDF como plantilla.
    Escribe el nombre del agente en una capa transparente y la fusiona
    con la plantilla original (constancia_base.pdf).
    """
    try:
        # 1. Obtener nombre del agente desde Firestore
        db = get_db()
        agente_doc = db.collection('acceso_agentes').document(id_unico).get()
        if not agente_doc.exists:
            raise HTTPException(status_code=404, detail="Agente no encontrado")
        
        agente_data = agente_doc.to_dict()
        nombre_agente = agente_data.get("nombre", "Agente CAMZYOS").upper()

        # 2. Rutas de archivos
        base_dir = os.path.dirname(__file__)
        template_path = os.path.join(base_dir, "constancia_base.pdf")
        
        if not os.path.exists(template_path):
            raise HTTPException(status_code=500, detail="Plantilla PDF no encontrada en el servidor")

        # 3. Crear el PDF con el nombre (capa transparente) usando ReportLab
        packet = BytesIO()
        # Tamaño carta horizontal (landscape) o el que tenga tu PDF original
        page_width, page_height = landscape(A4) 
        can = rl_canvas.Canvas(packet, pagesize=(page_width, page_height))
        
        # Configurar fuente
        font_path = os.path.join(base_dir, "font-bold.ttf")
        font_size = 28
        
        if os.path.exists(font_path):
            from reportlab.pdfbase import pdfmetrics
            from reportlab.pdfbase.ttfonts import TTFont
            pdfmetrics.registerFont(TTFont('CustomFontBold', font_path))
            can.setFont('CustomFontBold', font_size)
        else:
            can.setFont("Helvetica-Bold", font_size)

        # 4. Color y Posicionamiento
        can.setFillColorRGB(1, 1, 1) # BLANCO

        text_width = can.stringWidth(nombre_agente)
        max_width = page_width * 0.65
        if text_width > max_width:
            font_size = font_size * (max_width / text_width)
            can.setFont('CustomFontBold' if os.path.exists(font_path) else 'Helvetica-Bold', font_size)

        # Coordenadas: X es centro de la línea, Y es altura de la línea
        target_x = page_width * 0.50
        target_y = page_height * 0.515 # Ajustado ligeramente hacia arriba
        
        can.drawCentredString(target_x, target_y, nombre_agente)
        can.save()
        packet.seek(0)

        # 5. Fusionar (Merge) con PyPDF
        new_pdf = PdfReader(packet)
        existing_pdf = PdfReader(open(template_path, "rb"))
        output = PdfWriter()

        # Tomamos la primera página de la plantilla
        page = existing_pdf.pages[0]
        # Le encimamos la página que acabamos de crear con el nombre
        page.merge_page(new_pdf.pages[0])
        output.add_page(page)

        # 6. Preparar respuesta
        pdf_output = BytesIO()
        output.write(pdf_output)
        pdf_output.seek(0)

        safe_name = nombre_agente.replace(" ", "_")
        headers = {
            "Content-Disposition": f'attachment; filename="Constancia_CAMZYOS_2026_{safe_name}.pdf"'
        }
        return StreamingResponse(pdf_output, media_type="application/pdf", headers=headers)

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al generar constancia PDF: {str(e)}")



# ── Servir el frontend compilado (Producción y Local) ──────────────────────
_base_dir = os.path.dirname(__file__)
_dist_path = os.path.join(_base_dir, "dist") # Ruta en Docker

# Si no existe en backend/dist, buscamos en el path de desarrollo local
if not os.path.isdir(_dist_path):
    _dist_path = os.path.abspath(os.path.join(_base_dir, "..", "frontend", "dist"))

if os.path.isdir(_dist_path):
    # Servir la carpeta assets con prioridad
    _assets_path = os.path.join(_dist_path, "assets")
    if os.path.isdir(_assets_path):
        app.mount("/assets", StaticFiles(directory=_assets_path), name="assets")

    @app.get("/{full_path:path}", response_class=HTMLResponse, include_in_schema=False)
    async def serve_spa(full_path: str):
        # No interceptar las rutas /api/*
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
            
        # Si el archivo existe físicamente (ej. /logo.png), lo servimos
        file_path = os.path.join(_dist_path, full_path)
        if full_path and os.path.isfile(file_path):
            from fastapi.responses import FileResponse
            return FileResponse(file_path)
            
        # De lo contrario, devolvemos index.html para que React Router maneje la ruta
        index_file = os.path.join(_dist_path, "index.html")
        if os.path.isfile(index_file):
            with open(index_file, "r", encoding="utf-8") as f:
                return HTMLResponse(content=f.read())
        
        raise HTTPException(status_code=404)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
