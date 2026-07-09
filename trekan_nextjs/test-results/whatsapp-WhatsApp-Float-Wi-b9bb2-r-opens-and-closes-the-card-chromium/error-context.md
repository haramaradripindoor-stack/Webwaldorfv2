# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: whatsapp.spec.ts >> WhatsApp Float Widget Interactions (Tier 2) >> test_whatsapp_trigger_toggle: clicking the trigger opens and closes the card
- Location: tests\whatsapp.spec.ts:21:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Coordinadora de Admisión')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Coordinadora de Admisión')

```

```yaml
- main:
  - navigation:
    - link "Colegio Waldorf Trekan Colegio WaldorfTrekan":
      - /url: /
      - img "Colegio Waldorf Trekan"
      - text: Colegio WaldorfTrekan
    - link "Inicio":
      - /url: /
    - button "Nosotros":
      - text: Nosotros
      - img
    - link "Quiénes Somos":
      - /url: /#quienes-somos
    - link "Pedagogía Waldorf":
      - /url: /#pedagogia
    - link "Recursos Waldorf":
      - /url: /recursos
    - link "Comunidad":
      - /url: /#comunidad
    - link "Actividades":
      - /url: /#actividades
    - link "Noticias":
      - /url: /noticias
    - button "Admisión 2026":
      - text: Admisión 2026
      - img
    - link "Valores y Aranceles":
      - /url: /admision
    - link "Preguntas Frecuentes":
      - /url: /admision#faq
    - link "Arriendo de Salón":
      - /url: /arriendo-salon
    - link "Contacto":
      - /url: /#contacto
    - button "ES"
    - text: "|"
    - button "DE"
    - text: "|"
    - button "EN"
    - button:
      - img
  - img
  - text: Puerto Varas, Chile
  - heading "Dondeelniñocaminaconvoluntad" [level=1]:
    - text: Dondeelniñocaminaconvoluntad
    - img
  - paragraph: Colegio Waldorf Trekan. Un espacio diseñado para que los niños crezcan libres, conscientes y profundamente conectados con su entorno.
  - link "Comenzar el Viaje":
    - /url: "#admision"
    - text: Comenzar el Viaje
    - img
  - text: Descubrir
  - paragraph: Educarnoesllenaruncubo,esencenderunfuego.EnTrekan,respetamoselritmonaturaldecadaniño,cultivandolacabeza,elcorazónylasmanosenperfectaarmonía.
  - heading "El Viaje del Caminante" [level=2]
  - paragraph: Un recorrido por las etapas de desarrollo en la pedagogía Waldorf, acompañando al niño desde su primer encuentro con el mundo.
  - text: Primer Septenio (3-6 años)
  - heading "Jardín de Infantes" [level=3]
  - paragraph: El mundo es bueno. A través del juego libre, la imitación y el ritmo, el niño construye su cuerpo físico y desarrolla la voluntad en un entorno hogareño.
  - text: Segundo Septenio (7-12 años)
  - heading "Enseñanza Básica" [level=3]
  - paragraph: El mundo es bello. Guiados por el maestro de clase y a través del arte, la imaginación y las narraciones, los niños cultivan su mundo emocional y su conexión con el entorno.
  - text: La crisis de los 9 años
  - heading "El Paso del Rubicón" [level=3]
  - paragraph: Un hito emocional profundo. El niño comienza a experimentar su propia individualidad, separándose del mundo que lo rodea. Lo acompañamos con firmeza y amor.
  - text: Transición (13-14 años)
  - heading "Hacia la Adolescencia" [level=3]
  - paragraph: El mundo es verdadero. Despierta el pensamiento lógico y crítico. Los jóvenes buscan comprender el mundo a través de su propio juicio y experimentación.
  - text: Filosofía Trekan
  - heading "Un ecosistema diseñado para florecer." [level=2]
  - img "Aprendizaje Vivencial"
  - text: El Arte de Hacer
  - heading "Aprendizaje Vivencial" [level=3]
  - paragraph: Matemáticas, lenguaje e historia se viven con las manos, el corazón y la mente. No memorizamos, experimentamos.
  - text: Vínculo Profundo
  - heading "Maestro Guía" [level=3]
  - paragraph: Acompaña al niño durante años, creando un refugio seguro.
  - img "Conexión Natural"
  - text: Nuestra Aula
  - heading "Conexión Natural" [level=3]
  - paragraph: Huerta, carpintería y bosque.
  - img "Bloques Temáticos"
  - text: Inmersión Total
  - heading "Bloques Temáticos" [level=3]
  - paragraph: Semanas dedicadas a un solo tema para profundizar verdaderamente.
  - text: Nuestra Tribu
  - heading "Vida Comunitaria" [level=2]
  - paragraph: En Trekan, la comunidad es protagonista. Las familias participan activamente en la construcción del proyecto educativo, porque educar es una tarea de todos.
  - img "Consejo Escolar"
  - img
  - heading "Consejo Escolar" [level=3]
  - paragraph: El corazón administrativo de nuestra comunidad. Un espacio transparente donde apoderados y maestros deciden el futuro del colegio.
  - img "Asambleas Mensuales"
  - img
  - heading "Asambleas Mensuales" [level=3]
  - paragraph: Encuentros regulares donde compartimos el ritmo de las clases, las festividades y cultivamos la fraternidad entre las familias.
  - img "Celebraciones Estacionales"
  - img
  - heading "Celebraciones Estacionales" [level=3]
  - paragraph: Fiestas de la Cosecha, Faroles, Espiral de Adviento. Marcamos el ritmo de la naturaleza celebrando juntos los cambios de ciclo.
  - img "Comisiones de Trabajo"
  - img
  - heading "Comisiones de Trabajo" [level=3]
  - paragraph: Mantenimiento del espacio, bazar, huerto. Las manos de nuestra comunidad construyen y cuidan el entorno de nuestros niños.
  - img "Trimembración Social"
  - img
  - heading "Trimembración Social" [level=3]
  - paragraph: Fomentamos una gestión participativa, horizontal y transparente, uniendo las esferas pedagógica, administrativa y comunitaria.
  - img
  - heading "Calendario de Actividades" [level=2]
  - paragraph: Momentos importantes para nuestra comunidad. ¡Te esperamos!
  - link "Ver calendario completo":
    - /url: /actividades
    - text: Ver calendario completo
    - img
  - heading "Próximas en JUL" [level=3]
  - link "reunion 10JUL Jornada de Evaluación y Análisis Día de trabajo profundo para nuestros maestros. Salida anticipada de los niños (12:00 hrs). Salida 12:00 hrs":
    - /url: /actividades
    - text: reunion 10JUL
    - heading "Jornada de Evaluación y Análisis" [level=4]
    - paragraph: Día de trabajo profundo para nuestros maestros. Salida anticipada de los niños (12:00 hrs).
    - img
    - text: Salida 12:00 hrs
  - link "celebracion 13JUL Vacaciones de Invierno (13 al 31 de Julio) El merecido descanso invernal de mitad de año.":
    - /url: /actividades
    - text: celebracion 13JUL
    - heading "Vacaciones de Invierno (13 al 31 de Julio)" [level=4]
    - paragraph: El merecido descanso invernal de mitad de año.
  - 'link "charla 23JUL EDUVIDA Voz: \"Piaf y Violeta\" Concierto escénico protagonizado por Annie Murath."':
    - /url: /actividades
    - text: charla 23JUL
    - 'heading "EDUVIDA Voz: \"Piaf y Violeta\"" [level=4]'
    - paragraph: Concierto escénico protagonizado por Annie Murath.
  - heading "Voces de la Comunidad" [level=2]
  - paragraph: "\"Nuestra hija recuperó el asombro por aprender.\""
  - paragraph: Familia González
  - img "Familia Silva"
  - paragraph: "\"La conexión con la naturaleza es invaluable.\""
  - paragraph: Familia Silva
  - img "Apoderada de Básica"
  - paragraph: "\"Una comunidad que abraza y sostiene.\""
  - paragraph: Apoderada de Básica
  - img "Apoderado de Media"
  - paragraph: "\"El arte es el corazón del currículo.\""
  - paragraph: Apoderado de Media
  - paragraph: "\"Nuestra hija recuperó el asombro por aprender.\""
  - paragraph: Familia González
  - img "Familia Silva"
  - paragraph: "\"La conexión con la naturaleza es invaluable.\""
  - paragraph: Familia Silva
  - img "Apoderada de Básica"
  - paragraph: "\"Una comunidad que abraza y sostiene.\""
  - paragraph: Apoderada de Básica
  - img "Apoderado de Media"
  - paragraph: "\"El arte es el corazón del currículo.\""
  - paragraph: Apoderado de Media
  - img "Mamá de Jardín"
  - paragraph: "\"Verlos amasar el pan cada semana es mágico.\""
  - paragraph: Mamá de Jardín
  - img "Familia Rojas"
  - paragraph: "\"Aprenden matemáticas tejiendo y cantando.\""
  - paragraph: Familia Rojas
  - img "Apoderado Nuevo"
  - paragraph: "\"No hay notas, hay un profundo respeto por sus ritmos.\""
  - paragraph: Apoderado Nuevo
  - img "Familia de 5° Básico"
  - paragraph: "\"El vínculo con su Maestro Guía es para toda la vida.\""
  - paragraph: Familia de 5° Básico
  - img "Mamá de Jardín"
  - paragraph: "\"Verlos amasar el pan cada semana es mágico.\""
  - paragraph: Mamá de Jardín
  - img "Familia Rojas"
  - paragraph: "\"Aprenden matemáticas tejiendo y cantando.\""
  - paragraph: Familia Rojas
  - img "Apoderado Nuevo"
  - paragraph: "\"No hay notas, hay un profundo respeto por sus ritmos.\""
  - paragraph: Apoderado Nuevo
  - img "Familia de 5° Básico"
  - paragraph: "\"El vínculo con su Maestro Guía es para toda la vida.\""
  - paragraph: Familia de 5° Básico
  - heading "Comunidad Trekan" [level=2]
  - button:
    - img
  - button:
    - img
  - link "Ver todo":
    - /url: /noticias
    - text: Ver todo
    - img
  - article:
    - 'link "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\" El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritm..."':
      - /url: /noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiración-en-el-hogar
      - time
      - 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=3]'
      - paragraph: El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritm...
    - 'link "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\""':
      - /url: /noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiración-en-el-hogar
      - 'img "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\""'
  - article:
    - link "Fiesta de la Luz En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz. ...":
      - /url: /noticias/2026-04-20-fiesta-de-la-luz
      - time
      - heading "Fiesta de la Luz" [level=3]
      - paragraph: En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz. ...
    - link "Fiesta de la Luz":
      - /url: /noticias/2026-04-20-fiesta-de-la-luz
      - img "Fiesta de la Luz"
  - article:
    - 'link "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se uni..."':
      - /url: /noticias/2025-03-05-inauguracion
      - time
      - heading "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [level=3]
      - paragraph: "Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se uni..."
    - link "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan":
      - /url: /noticias/2025-03-05-inauguracion
      - img "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan"
  - article:
    - 'link "Construyendo y Embelleciendo Nuestro Colegio En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir..."':
      - /url: /noticias/2025-02-20-construyendo
      - time
      - heading "Construyendo y Embelleciendo Nuestro Colegio" [level=3]
      - paragraph: "En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir..."
    - link "Construyendo y Embelleciendo Nuestro Colegio":
      - /url: /noticias/2025-02-20-construyendo
      - img "Construyendo y Embelleciendo Nuestro Colegio"
  - link "Ver todas las crónicas":
    - /url: /noticias
    - img
    - text: Ver todas las crónicas
  - text: Nuestro Mundo
  - heading "La Vida en Trekan" [level=2]
  - img "Exploración en la naturaleza"
  - text: Exploración en la naturaleza
  - img "Conexión vivencial"
  - text: Conexión vivencial
  - img "Ritmos y tradiciones"
  - text: Ritmos y tradiciones
  - img "Comunidad en movimiento"
  - text: Comunidad en movimiento
  - img "Aprendizaje en el entorno"
  - text: Aprendizaje en el entorno
  - img "Libertad y asombro"
  - text: Libertad y asombro
  - img "Luz y calidez"
  - text: Luz y calidez Quiénes Somos
  - heading "Nuestro Equipo" [level=2]
  - paragraph: Un grupo de educadores y familias comprometidas con el florecimiento integral de la infancia.
  - img
  - heading "Yabel Painemil" [level=3]
  - paragraph: Docente Intercultural
  - paragraph: Comunicadora Audiovisual, docente intercultural bilingüe, formación Waldorf básica y especialista en Gimnasia Bothmer.
  - img
  - heading "Javiera Ortega" [level=3]
  - paragraph: Profesora General Básica
  - paragraph: Especialista en lenguaje, cursando formación Waldorf.
  - img
  - heading "Hanna Lowen" [level=3]
  - paragraph: Profesora de Inglés
  - paragraph: Enseñanza del inglés con enfoque vivencial y artístico.
  - img
  - heading "Matías Valiente" [level=3]
  - paragraph: Profesor de Carpintería
  - paragraph: Maestro de oficios que guía a los niños en el trabajo con la madera y las manos.
  - img
  - heading "Sofía González Rodríguez" [level=3]
  - paragraph: Profesora de Música
  - paragraph: La música como lenguaje del alma en cada jornada escolar.
  - img
  - heading "Ivonne Parada" [level=3]
  - paragraph: Familia Fundadora · Convivencia Escolar
  - paragraph: Trabajadora Social UV, especialista en convivencia escolar con formación en peritaje social, polivagal y gestalt.
  - img
  - heading "Sleater Martínez" [level=3]
  - paragraph: Familia Fundadora · Educadora de Párvulos
  - paragraph: Cursando formación Waldorf en Fundación Arche.
  - img
  - heading "Felipe Vivanco Cornejo" [level=3]
  - paragraph: Familia Fundadora · Administración
  - paragraph: Administrador Público UV, formación en NICSP, Neurociencias y GYDP. Terapeuta, Escuela Arica.
  - img
  - heading "Gerard Muñoz" [level=3]
  - paragraph: Familia Fundadora · Tecnología
  - paragraph: Ingeniero en Informática.
  - img
  - text: Aporte Comunitario
  - heading "Una comunidad que se sostiene a sí misma." [level=2]
  - paragraph: En Colegio Waldorf Trekan, creemos que el acceso a la educación no debe ser una barrera insuperable. Nuestro modelo de aranceles incluye un componente solidario voluntario que permite becar a familias de nuestra propia comunidad, asegurando diversidad y apoyo mutuo.
  - button "Conocer Valores y Aportes":
    - text: Conocer Valores y Aportes
    - img
  - img
  - text: Tu aporte hace florecer el bosque
  - img "Comunidad Waldorf"
  - heading "¿Cómo funciona?" [level=4]
  - paragraph: Al momento de la matrícula, las familias pueden elegir voluntariamente sumar un Aporte Solidario a su mensualidad. Este fondo va directa y exclusivamente a financiar becas internas.
  - heading "Comencemos el Viaje" [level=2]
  - paragraph: Queremos conocer qué buscas para tu familia y así ofrecerte la experiencia pedagógica ideal.
  - heading "¿Para qué nivel buscas matrícula?" [level=3]
  - button "Jardín y Kínder (3 a 6 años)"
  - button "Educación Básica (1º a 8º)"
  - text: Resuelve tus Dudas
  - heading "Preguntas Frecuentes" [level=2]
  - button "🌱 ¿Qué es la educación Waldorf?" [expanded]:
    - text: 🌱 ¿Qué es la educación Waldorf?
    - img
  - region "🌱 ¿Qué es la educación Waldorf?":
    - paragraph: "La pedagogía Waldorf acompaña el desarrollo integral del niño —mente, corazón y manos— a través de experiencias vivenciales, arte, naturaleza y comunidad. No solo enseñamos contenidos: cultivamos curiosidad, creatividad y voluntad."
  - button "👩‍🏫 ¿Cuántos estudiantes hay por curso?":
    - text: 👩‍🏫 ¿Cuántos estudiantes hay por curso?
    - img
  - button "📝 ¿Cómo es la evaluación?":
    - text: 📝 ¿Cómo es la evaluación?
    - img
  - button "📝 ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc?":
    - text: 📝 ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc?
    - img
  - button "📊 ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC?":
    - text: 📊 ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC?
    - img
  - button "🎨 ¿Hay talleres extracurriculares?":
    - text: 🎨 ¿Hay talleres extracurriculares?
    - img
  - button "🚍 ¿Hay transporte o alimentación disponible?":
    - text: 🚍 ¿Hay transporte o alimentación disponible?
    - img
  - button "🏡 ¿Puedo visitar el colegio antes de postular?":
    - text: 🏡 ¿Puedo visitar el colegio antes de postular?
    - img
  - button "📅 ¿Cuándo puedo postular?":
    - text: 📅 ¿Cuándo puedo postular?
    - img
  - button "💌 ¿Cómo me contacto rápidamente?":
    - text: 💌 ¿Cómo me contacto rápidamente?
    - img
  - text: Hablemos
  - heading "¿Tienes dudas o quieres visitarnos?" [level=2]
  - paragraph: Escríbenos. Nos encanta recibir a nuevas familias, responder preguntas y abrir las puertas de nuestra comunidad.
  - img
  - heading "Dirección" [level=4]
  - paragraph: Las Azaleas 96, Parque Ivian 1 Puerto Varas, Chile
  - img
  - heading "WhatsApp / Teléfono" [level=4]
  - link "+56 9 6776 5106":
    - /url: https://wa.me/56967765106
  - img
  - heading "Correo" [level=4]
  - link "admision@colegiowaldorftrekan.cl":
    - /url: https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web
  - button "Guardar Contacto (vCard)":
    - img
    - text: Guardar Contacto (vCard)
  - heading "Envíanos un mensaje" [level=3]
  - text: Nombre
  - textbox "Tu nombre y apellido"
  - text: Correo Electrónico
  - textbox "tucorreo@ejemplo.com"
  - text: Mensaje
  - textbox "¿En qué te podemos ayudar?"
  - button "Enviar Mensaje":
    - text: Enviar Mensaje
    - img
  - text: Nuestra Casa
  - heading "Dónde Encontrarnos" [level=2]
  - paragraph: Estamos inmersos en la naturaleza del Parque Ivian, un entorno que nutre y cobija el desarrollo de nuestros niños.
  - iframe
  - img
  - heading "Colegio Trekan" [level=3]
  - paragraph: Parque Ivian, Puerto Varas
  - paragraph: Un entorno natural protegido donde el bosque es nuestra principal aula de clases.
  - link "Abrir en Google Maps→":
    - /url: https://www.google.com/maps/search/?api=1&query=Colegio+Waldorf+Trekan+Puerto+Varas
  - heading "Comunidad Activa" [level=2]:
    - img
    - text: Comunidad Activa
  - paragraph: Sigue el día a día de nuestros caminantes en @waldorftrekanpv
  - link "Seguir en Instagram":
    - /url: https://www.instagram.com/waldorftrekanpv/
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - link "Instagram post":
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img "Instagram post"
    - img
  - img "Materiales nobles en pedagogía Waldorf"
  - paragraph: Materia Prima
  - paragraph: En Trekan, no hay plástico. Solo madera viva, lana cruda y ceras naturales que conectan al niño con la verdad del mundo.
  - heading "Sostenibilidad Radical." [level=2]
  - paragraph: La ética no es una asignatura, es el entorno. Desde la arquitectura de nuestro colegio hasta las fibras de los juguetes, cada elemento está diseñado con un respeto absoluto por los ritmos de la naturaleza y el desarrollo humano.
  - heading "100%" [level=3]
  - paragraph: Materiales nobles en el aula parvularia
  - heading "0%" [level=3]
  - paragraph: Pantallas en los primeros dos septenios
  - text: T TREKAN
  - paragraph: Un espacio educativo independiente inspirado en la pedagogía Waldorf, comprometido con el florecimiento libre e íntegro de la infancia en el sur de Chile.
  - link:
    - /url: https://www.instagram.com/waldorftrekanpv/
    - img
  - link:
    - /url: https://www.facebook.com/profile.php?id=61573063135723
    - img
  - heading "Contacto" [level=4]
  - list:
    - listitem:
      - img
      - text: +56 9 6776 5106
    - listitem:
      - img
      - link "admision@colegiowaldorftrekan.cl":
        - /url: https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web
    - listitem:
      - img
      - text: Las Azaleas 96, Parque Ivian 1, Puerto Varas
  - heading "Navegación" [level=4]
  - list:
    - listitem:
      - link "Quiénes Somos":
        - /url: /#quienes-somos
    - listitem:
      - link "Pedagogía Waldorf":
        - /url: /#pedagogia
    - listitem:
      - link "Admisión 2026":
        - /url: /#admision
    - listitem:
      - link "Arriendo de Salón":
        - /url: /arriendo-salon
  - paragraph: © 2026 Colegio Waldorf Trekan - Puerto Varas
  - paragraph: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
  - link "Directorio de Recursos Waldorf y Antroposóficos en Chile":
    - /url: /recursos
- button "Contactar por WhatsApp":
  - img
- text: ¿Dudas? ¡Pregúntame! 🌱
- button "Abrir Chat":
  - img
  - text: Hablemos 1
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.beforeEach(async ({ page }) => {
  4  |   await page.goto('/');
  5  |   await page.waitForTimeout(1000); // Hydration safety to prevent clicking before React event handlers attach
  6  | });
  7  | 
  8  | test.describe('WhatsApp Float Widget (Tier 1)', () => {
  9  |   test('test_whatsapp_trigger_rendered: trigger button should exist', async ({ page }) => {
  10 |     const trigger = page.locator('button[aria-label="Contactar por WhatsApp"]');
  11 |     await expect(trigger).toBeVisible();
  12 |   });
  13 | 
  14 |   test('test_whatsapp_closed_initially: card should not be open initially', async ({ page }) => {
  15 |     const card = page.locator('text=Coordinadora de Admisión');
  16 |     await expect(card).not.toBeVisible();
  17 |   });
  18 | });
  19 | 
  20 | test.describe('WhatsApp Float Widget Interactions (Tier 2)', () => {
  21 |   test('test_whatsapp_trigger_toggle: clicking the trigger opens and closes the card', async ({ page }) => {
  22 |     const trigger = page.locator('button[aria-label="Contactar por WhatsApp"]');
  23 |     
  24 |     // Toggle open
  25 |     await trigger.click();
  26 |     const cardHeader = page.locator('text=Coordinadora de Admisión');
> 27 |     await expect(cardHeader).toBeVisible();
     |                              ^ Error: expect(locator).toBeVisible() failed
  28 |     
  29 |     // Check target link exists inside
  30 |     const waLink = page.locator('a:has-text("Abrir Chat en WhatsApp")');
  31 |     await expect(waLink).toBeVisible();
  32 |     const href = await waLink.getAttribute('href');
  33 |     expect(href).toContain('56967765106');
  34 | 
  35 |     // Click close button inside card
  36 |     const closeBtn = page.locator('button[aria-label="Cerrar chat"]');
  37 |     await closeBtn.click();
  38 |     await expect(cardHeader).not.toBeVisible();
  39 |   });
  40 | });
  41 | 
```