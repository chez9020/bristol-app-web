import csv
import sys
import os
import firebase_admin
from firebase_admin import credentials, firestore

# Archivo por defecto si no se pasa uno como argumento
CSV_FILENAME = 'usuarios_ejemplo.csv'
COLLECTION_NAME = 'acceso_agentes'

def initialize_firebase():
    """Inicializa la conexion a Firebase."""
    if not firebase_admin._apps:
        try:
            # Intenta usar las credenciales de entorno con el ID de proyecto explícito
            firebase_admin.initialize_app(options={
                'projectId': 'shaq-brand-bot'
            })
        except Exception as e:
            print(f"Error al inicializar Firebase: {e}")
            print("Asegúrate de haber ejecutado 'gcloud auth application-default login' en tu terminal.")
            sys.exit(1)
    return firestore.client()


def upload_users(csv_path):
    if not os.path.exists(csv_path):
        print(f"Error: No se encontró el archivo '{csv_path}'")
        return

    db = initialize_firebase()
    batch = db.batch()
    
    count = 0
    total = 0
    errors = 0

    print(f"Leyendo archivo: {csv_path}...")
    
    try:
        # Auto-detectar compatibilidad de acentos/codificación guardados por Excel en Windows
        encoding_to_use = 'utf-8-sig'
        try:
            with open(csv_path, mode='r', encoding=encoding_to_use) as test_file:
                test_file.read()
        except UnicodeDecodeError:
            encoding_to_use = 'latin-1' # Común en archivos Excel CSV guardados en Windows español

        with open(csv_path, mode='r', encoding=encoding_to_use) as file:
            reader = csv.DictReader(file)
            
            # Limpiar nombres de columnas (quitar espacios si los hay)
            reader.fieldnames = [name.strip() for name in reader.fieldnames]
            
            # Verificar que existan las columnas clave
            required_cols = {"ID", "Nombre", "Rol"}
            if not required_cols.issubset(set(reader.fieldnames)):
                print(f"Error: El CSV debe contener las columnas exactas: {required_cols}")
                print(f"Columnas encontradas: {reader.fieldnames}")
                return

            for row in reader:
                total += 1
                doc_id = row['ID'].strip()
                nombre = row['Nombre'].strip()
                rol = row['Rol'].strip()

                if not doc_id or len(doc_id) != 6:
                    print(f"Advertencia: Fila {total} ignorada. El ID '{doc_id}' es inválido (deben ser 6 caracteres).")
                    errors += 1
                    continue
                
                # Referencia al documento, que tendrá como nombre de ID los mismos 6 números
                doc_ref = db.collection(COLLECTION_NAME).document(doc_id)
                
                # Datos del documento (foto_url no se envía aquí, será creada en la app)
                agent_data = {
                    "nombre": nombre,
                    "rol": rol
                }
                
                # Usamos set() para crear o sobrescribir si el ID ya existe
                batch.set(doc_ref, agent_data, merge=True)
                count += 1

                # Firebase batch writes tienen un límite de 500 operaciones.
                # Como precaución, escribiremos en la BD en bloques de 400
                if count % 400 == 0:
                    batch.commit()
                    print(f"  -> Se han guardado {count} usuarios...")
                    # Reiniciar el batch para el siguiente bloque
                    batch = db.batch()
            
            # Hacer commit de los que sobraron en la última partición
            if count % 400 != 0:
                batch.commit()

        print("\n=== RESUMEN DE CARGA MASIVA ===")
        print(f"Filas procesadas:  {total}")
        print(f"Usuarios exitosos: {count}")
        print(f"Errores de formato:{errors}")
        print("===============================\n")

    except Exception as e:
        print(f"Error fatal procesando el CSV: {e}")

if __name__ == "__main__":
    # Permite pasar el nombre del archivo csv por terminal, ej: python upload_users.py mis_medicos.csv
    file_path = sys.argv[1] if len(sys.argv) > 1 else CSV_FILENAME
    upload_users(file_path)
