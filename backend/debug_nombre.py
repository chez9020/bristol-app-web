"""Script de diagnóstico: Lee el nombre de un agente desde Firestore."""
import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase (usando ADC - Application Default Credentials)
if not firebase_admin._apps:
    firebase_admin.initialize_app(options={
        'storageBucket': 'shaq-brand-bot.firebasestorage.app',
        'projectId': 'shaq-brand-bot'
    })

db = firestore.client()

# Cambia este ID por el que quieres probar
ID_PRUEBA = "715762"

doc = db.collection('acceso_agentes').document(ID_PRUEBA).get()

if doc.exists:
    data = doc.to_dict()
    print(f"\n✅ Documento encontrado: {ID_PRUEBA}")
    print(f"   nombre = '{data.get('nombre', '(campo vacío)')}'")
    print(f"   Todos los campos: {data}")
else:
    print(f"\n❌ No existe el documento '{ID_PRUEBA}' en acceso_agentes")
