import os
import requests
import datetime

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
headers = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}

content = """Las noticias de esta semana han sacudido al mundo de la tecnología, pero a nosotros solo nos han confirmado lo que venimos observando en nuestras aulas durante décadas. Meta (la empresa matriz de Facebook e Instagram) ha alcanzado un acuerdo histórico en Estados Unidos, aceptando pagar **18.000 millones de dólares** tras ser acusada por 47 estados de diseñar deliberadamente algoritmos nocivos y adictivos para los niños.

Las medidas que la justicia les está obligando a tomar son reveladoras:
- **Bloqueo de notificaciones en horario escolar.**
- **Modo nocturno obligatorio** (cero acceso de madrugada).
- **Límites estrictos de 2 horas diarias.**
- **Ocultación de "Me gusta"** para mitigar la ansiedad y comparación social.

Para muchas familias, esta intervención judicial es un alivio. Para la neurociencia cognitiva moderna, es una medida urgente frente a la epidemia de hiperestimulación, la sobrecarga de la memoria de trabajo y el secuestro constante de la dopamina en cerebros en pleno desarrollo. 

Pero para las Escuelas Waldorf en todo el mundo, esto es simplemente la confirmación de una verdad que venimos sosteniendo hace 100 años: **la verdadera infancia no ocurre frente a una pantalla brillante, ocurre en el mundo real.**

### La neurociencia le da la razón a la Antroposofía

Cuando Rudolf Steiner estructuró la pedagogía Waldorf, no existían los smartphones. Sin embargo, su comprensión profunda del desarrollo humano dictaba que, durante el primer septenio (0 a 7 años) y gran parte del segundo, las fuerzas vitales del niño deben enfocarse en el desarrollo orgánico, el movimiento, el juego libre y la imitación de un entorno digno.

Hoy, la ciencia moderna llama a esto "neuroplasticidad positiva" y "regulación del sistema nervioso parasimpático". Mientras Silicon Valley tiene que ser forzado por la ley a apagar sus algoritmos durante las mañanas, en el **Colegio Waldorf Trekan** nuestros niños y niñas están inmersos en un entorno biopsicosocial que protege ferozmente su atención.

Están construyendo con madera, corriendo en el bosque, tejiendo, pintando y conectando miradas, no píxeles. Están desarrollando la voluntad y anclando su interocepción (la conexión mente-cuerpo) a través de experiencias táctiles y reales que ninguna aplicación puede replicar.

### Familias, la revolución empieza en la elección del colegio

Sabemos que sostener la crianza en un mundo hiperconectado es agotador. Como padres y madres, constantemente sentimos la presión de la cultura digital empujando la puerta de nuestras casas. Pero no están solos. 

El colegio de tus hijos no debería ser un lugar que agrave el estrés cognitivo o los exponga prematuramente a la ansiedad del rendimiento. Debería ser un refugio evolutivo; un organismo vivo que te acompañe y sostenga fraternamente en la tarea más importante: proteger la infancia.

Esta noticia mundial es un llamado de atención, pero también es una invitación. 

Si buscas un espacio donde se honre el ritmo natural de tus hijos, donde la educación esté diseñada para su cerebro y no para el algoritmo, te estamos esperando.

**Ven a conocer nuestra comunidad.**  
**Proceso de Admisión 2027 abierto.**
"""

payload = {
    "slug": "meta-redes-sociales-pantallas-educacion-waldorf-2027",
    "title": "El CEO de Instagram acaba de aceptar que las pantallas dañan a tus hijos. Nosotros lo sabemos hace 100 años.",
    "excerpt": "Meta deberá pagar 18.000 millones de dólares y apagar notificaciones en horario escolar. Descubre por qué la neurociencia hoy le da la razón a la pedagogía Waldorf frente a la adicción digital infantil.",
    "content": content,
    "image_url": "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&q=80&w=1000",
    "published_at": datetime.datetime.utcnow().isoformat(),
    "meta_keywords": "adicción pantallas niños, meta instagram niños, colegio waldorf puerto varas, educación libre de pantallas, neurociencia y educación waldorf"
}

res = requests.post(f"{url}/rest/v1/noticias", headers=headers, json=payload)
print(res.status_code, res.text)
