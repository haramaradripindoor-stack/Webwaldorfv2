import re

content = """---
title: 'Celebración de Fiestas Patrias: Comunidad, Tradición y Naturaleza en Trekan'
date: '2026-09-22'
excerpt: 'Nuestra comunidad se reunió para celebrar las Fiestas Patrias en torno a la música, el juego libre y la convivencia. Una jornada que reafirma el espíritu Waldorf y el valor de hacer escuela juntos bajo el cielo del sur.'
author: 'Colegio Waldorf Trekan'
category: 'Comunidad'
imageUrl: '/imagenes-web/fiestas-2026/drone_patrias.webp'
---
"""

match = re.search(r'^---\r?\n([\s\S]*?)\r?\n---\r?\n', content)
print(match.group(1))
