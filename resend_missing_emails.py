import os
import requests
import json
import re

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
resend_key = os.environ.get('RESEND_API_KEY')

headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json'
}

response = requests.get(
    f"{url}/rest/v1/leads_admision?origen=eq.Formulario%20Completo&order=created_at.desc&limit=5",
    headers=headers
)

leads = response.json()

for lead in leads:
    raw_curso = lead.get('curso_postula', '')
    
    # Parse the raw_curso string
    # Format: curso | Horario: horario | NEE: nee | Ciudad: ciudad | Traslado: traslado | Interés: interes | Saber más: saber | Dudas: dudas
    parts = [p.strip() for p in raw_curso.split('|')]
    
    curso = parts[0] if len(parts) > 0 else 'No especificado'
    
    data = {}
    for p in parts[1:]:
        if ':' in p:
            k, v = p.split(':', 1)
            data[k.strip()] = v.strip()

    html = f"""
        <h2>¡Postulación Formal Completa (Reenviada)! 📝</h2>
        <p>Este es un reenvío del formulario completo de postulación de la base de datos.</p>
        
        <h3>1. Datos del Apoderado:</h3>
        <ul>
          <li><strong>Nombre:</strong> {lead.get('nombre_apoderado')}</li>
          <li><strong>Teléfono:</strong> {lead.get('telefono_apoderado')}</li>
          <li><strong>Email:</strong> {lead.get('email_apoderado')}</li>
          <li><strong>Horario Preferido:</strong> {data.get('Horario', 'No especificado')}</li>
        </ul>
        
        <h3>2. Datos del Postulante:</h3>
        <ul>
          <li><strong>Niño/a:</strong> {lead.get('nombre_nino')}</li>
          <li><strong>Edad:</strong> {lead.get('edad_nino')}</li>
          <li><strong>Curso(s):</strong> {curso}</li>
        </ul>

        <h3>3. Información Adicional Rescatada:</h3>
        <ul>
          <li><strong>NEE:</strong> {data.get('NEE', 'N/A')}</li>
          <li><strong>Ciudad actual:</strong> {data.get('Ciudad', 'N/A')}</li>
          <li><strong>¿Traslado?:</strong> {data.get('Traslado', 'N/A')}</li>
          <li><strong>Nivel de Interés:</strong> {data.get('Interés', 'N/A')}</li>
          <li><strong>Desea saber sobre:</strong> {data.get('Saber más', 'N/A')}</li>
          <li><strong>Dudas o comentarios extras:</strong> {data.get('Dudas', 'Ninguno')}</li>
        </ul>
        
        <br/>
        <p><a href="https://www.colegiowaldorftrekan.cl/admin/admisiones" style="padding: 10px 20px; background-color: #2b4c3b; color: white; text-decoration: none; border-radius: 5px;">Ir al Panel CRM</a></p>
    """

    resend_response = requests.post(
        'https://api.resend.com/emails',
        headers={
            'Authorization': f'Bearer {resend_key}',
            'Content-Type': 'application/json'
        },
        json={
            "from": "Colegio Waldorf Trekan <onboarding@resend.dev>",
            "to": "admision@colegiowaldorftrekan.cl",
            "subject": f"REENVÍO LEAD: {lead.get('nombre_apoderado')} (Admisión 2027)",
            "html": html
        }
    )
    
    print(f"Resent email for {lead.get('nombre_apoderado')}: {resend_response.status_code}")

