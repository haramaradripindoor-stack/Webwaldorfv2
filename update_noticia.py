import os
import requests
import datetime

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
headers = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}

content = """El acuerdo histórico alcanzado por Meta en Estados Unidos incluye límites de uso, restricciones nocturnas, cambios en las notificaciones y nuevas medidas de protección para adolescentes. Más allá de la tecnología, el debate plantea una pregunta fundamental: ¿qué necesita realmente un niño para desarrollarse?

Las noticias recientes sobre tecnología nos obligan a reflexionar sobre lo que observamos cotidianamente en el desarrollo infantil. Meta (la empresa matriz de Facebook e Instagram) ha alcanzado un acuerdo de hasta 18.000 millones de dólares con una coalición de estados y territorios de Estados Unidos, relacionado con acusaciones sobre el impacto de sus plataformas en los menores.

Las medidas de este acuerdo incluyen acciones concretas:
- **Límite de aproximadamente 2 horas diarias** para adolescentes.
- **Bloqueo nocturno** entre medianoche y 6:00 am.
- **Reducción de notificaciones** durante el horario escolar.
- **Ocultación de "Me gusta"** para mitigar la comparación social.
- **Nuevas medidas de verificación de edad.**

Para muchas familias, esta intervención judicial representa un alivio. Décadas después de que Rudolf Steiner desarrollara su pedagogía, la investigación actual sobre desarrollo infantil, atención y uso de medios digitales ha generado nuevas preguntas sobre cómo la exposición temprana y prolongada a las pantallas puede afectar los hábitos de atención, el sueño, el comportamiento y el bienestar de niños y adolescentes.

### ¿Qué tiene que ver esto con la educación Waldorf?

La pedagogía Waldorf no nació como una respuesta a los teléfonos móviles ni a las redes sociales. Nació mucho antes. Sin embargo, su énfasis en el juego libre, el movimiento, la experiencia artística, el contacto con la naturaleza, las actividades manuales y las relaciones humanas adquiere una nueva relevancia en un mundo en el que la infancia está cada vez más expuesta a estímulos digitales.

La pregunta no es simplemente si una pantalla es "buena" o "mala". La pregunta es qué experiencias necesita un niño en cada etapa de su desarrollo y cuánto espacio dejamos para que esas experiencias ocurran. 

Mientras las regulaciones intentan apagar los estímulos digitales en horario escolar, en el **Colegio Waldorf Trekan** nuestros niños y niñas están inmersos en un entorno que respeta orgánicamente su atención. Están construyendo con madera, corriendo en el bosque, tejiendo, pintando y conectando miradas, no píxeles.

### Una elección consciente para las Familias

Para las familias, la pregunta no es solamente cuánto tiempo pasan sus hijos frente a una pantalla. También es qué están dejando de experimentar durante ese tiempo.

En Trekan buscamos que la infancia tenga espacio para el movimiento, la imaginación, el contacto con la naturaleza, el trabajo manual, el juego y los vínculos humanos. No como una nostalgia del pasado, sino como una elección consciente frente a los desafíos del presente.

Si estás buscando una educación que ponga a la infancia y su desarrollo integral en el centro, te invitamos a conocer nuestra comunidad.

**[Conoce nuestro Proceso de Admisión 2027 aquí](/admision)**

---
**Fuentes y Referencias:**
- [Reuters: Meta alcanza acuerdo de 18 mil millones sobre adicción a redes en menores](https://www.reuters.com/business/meta-reaches-18-billion-settlements-over-childrens-social-media-addiction-2026-08-26/)
- [AP News: Medidas de seguridad y límites nocturnos en Instagram](https://apnews.com/article/8229962dac997f1b1557ce341c71b39d)
- [Fiscalía General (tn.gov): Detalles del acuerdo estatal con Meta](https://www.tn.gov/attorneygeneral/news/2026/8/26/pr26-33.html)
"""

payload = {
    "title": "Meta limita las redes sociales para adolescentes: una pregunta que la educación Waldorf lleva décadas planteando",
    "excerpt": "El acuerdo histórico alcanzado por Meta en EE.UU. restringe el uso de redes en menores. Más allá de la tecnología, el debate plantea una pregunta fundamental: ¿qué necesita realmente un niño para desarrollarse?",
    "content": content
}

# Find the article id
res_get = requests.get(f"{url}/rest/v1/noticias?slug=eq.meta-redes-sociales-pantallas-educacion-waldorf-2027", headers=headers)
articles = res_get.json()
if articles:
    article_id = articles[0]['id']
    res_patch = requests.patch(f"{url}/rest/v1/noticias?id=eq.{article_id}", headers=headers, json=payload)
    print(res_patch.status_code, "Updated!")
else:
    print("Article not found!")
