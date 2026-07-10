# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scroll.spec.ts >> Navbar & Global Widgets (Tier 1) >> test_vcard_download: click vCard button triggers download
- Location: tests\scroll.spec.ts:46:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForEvent: Test timeout of 60000ms exceeded.
=========================== logs ===========================
waiting for event "download"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - link "Colegio Waldorf Trekan Colegio WaldorfTrekan" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Colegio Waldorf Trekan" [ref=e5]
        - generic [ref=e6]: Colegio WaldorfTrekan
      - generic [ref=e7]:
        - link "Inicio" [ref=e8] [cursor=pointer]:
          - /url: /
        - generic [ref=e9]:
          - button "Nosotros" [ref=e10]:
            - text: Nosotros
            - img [ref=e11]
          - generic [ref=e13]:
            - link "Quiénes Somos" [ref=e14] [cursor=pointer]:
              - /url: /#quienes-somos
            - link "Pedagogía Waldorf" [ref=e15] [cursor=pointer]:
              - /url: /#pedagogia
            - link "Recursos Waldorf" [ref=e16] [cursor=pointer]:
              - /url: /recursos
            - link "Comunidad" [ref=e17] [cursor=pointer]:
              - /url: /#comunidad
            - link "Actividades" [ref=e18] [cursor=pointer]:
              - /url: /#actividades
            - link "Noticias" [ref=e19] [cursor=pointer]:
              - /url: /noticias
        - generic [ref=e20]:
          - button "Admisión 2026" [ref=e21]:
            - text: Admisión 2026
            - img [ref=e22]
          - generic [ref=e24]:
            - link "Valores y Aranceles" [ref=e25] [cursor=pointer]:
              - /url: /admision
            - link "Preguntas Frecuentes" [ref=e26] [cursor=pointer]:
              - /url: /admision#faq
        - link "Arriendo de Salón" [ref=e27] [cursor=pointer]:
          - /url: /arriendo-salon
        - link "Contacto" [ref=e28] [cursor=pointer]:
          - /url: /#contacto
        - generic [ref=e29]:
          - button "ES" [ref=e30]
          - text: "|"
          - button "DE" [ref=e31]
          - text: "|"
          - button "EN" [ref=e32]
      - button [ref=e33]:
        - img [ref=e34]
    - generic [ref=e35]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - img [ref=e41]
          - text: Puerto Varas, Chile
        - heading "Dondeelniñocaminaconvoluntad" [level=1] [ref=e44]:
          - text: Dondeelniñocaminacon
          - generic [ref=e45]:
            - text: voluntad
            - img [ref=e46]
        - paragraph [ref=e48]: Colegio Waldorf Trekan. Un espacio diseñado para que los niños crezcan libres, conscientes y profundamente conectados con su entorno.
        - link "Comenzar el Viaje" [ref=e52] [cursor=pointer]:
          - /url: "#admision"
          - text: Comenzar el Viaje
          - img [ref=e53]
      - generic [ref=e55]: Descubrir
    - paragraph [ref=e57]: Educarnoesllenaruncubo,esencenderunfuego.EnTrekan,respetamoselritmonaturaldecadaniño,cultivandolacabeza,elcorazónylasmanosenperfectaarmonía.
    - generic [ref=e59]:
      - generic [ref=e60]:
        - heading "El Viaje del Caminante" [level=2] [ref=e61]:
          - text: El Viaje del
          - text: Caminante
        - paragraph [ref=e62]: Un recorrido por las etapas de desarrollo en la pedagogía Waldorf, acompañando al niño desde su primer encuentro con el mundo.
      - generic [ref=e64]:
        - generic [ref=e66]:
          - text: Primer Septenio (3-6 años)
          - heading "Jardín de Infantes" [level=3] [ref=e67]
          - paragraph [ref=e68]: El mundo es bueno. A través del juego libre, la imitación y el ritmo, el niño construye su cuerpo físico y desarrolla la voluntad en un entorno hogareño.
        - generic [ref=e70]:
          - text: Segundo Septenio (7-12 años)
          - heading "Enseñanza Básica" [level=3] [ref=e71]
          - paragraph [ref=e72]: El mundo es bello. Guiados por el maestro de clase y a través del arte, la imaginación y las narraciones, los niños cultivan su mundo emocional y su conexión con el entorno.
        - generic [ref=e74]:
          - text: La crisis de los 9 años
          - heading "El Paso del Rubicón" [level=3] [ref=e75]
          - paragraph [ref=e76]: Un hito emocional profundo. El niño comienza a experimentar su propia individualidad, separándose del mundo que lo rodea. Lo acompañamos con firmeza y amor.
        - generic [ref=e78]:
          - text: Transición (13-14 años)
          - heading "Hacia la Adolescencia" [level=3] [ref=e79]
          - paragraph [ref=e80]: El mundo es verdadero. Despierta el pensamiento lógico y crítico. Los jóvenes buscan comprender el mundo a través de su propio juicio y experimentación.
    - generic [ref=e82]:
      - generic [ref=e83]:
        - text: Filosofía Trekan
        - heading "Un ecosistema diseñado para florecer." [level=2] [ref=e84]
      - generic [ref=e85]:
        - generic [ref=e86]:
          - img "Aprendizaje Vivencial" [ref=e87]
          - generic [ref=e88]:
            - text: El Arte de Hacer
            - heading "Aprendizaje Vivencial" [level=3] [ref=e89]
            - paragraph [ref=e90]: Matemáticas, lenguaje e historia se viven con las manos, el corazón y la mente. No memorizamos, experimentamos.
        - generic [ref=e92]:
          - text: Vínculo Profundo
          - heading "Maestro Guía" [level=3] [ref=e93]
          - paragraph [ref=e94]: Acompaña al niño durante años, creando un refugio seguro.
        - generic [ref=e95]:
          - img "Conexión Natural" [ref=e96]
          - generic [ref=e97]:
            - text: Nuestra Aula
            - heading "Conexión Natural" [level=3] [ref=e98]
            - paragraph [ref=e99]: Huerta, carpintería y bosque.
        - generic [ref=e100]:
          - img "Bloques Temáticos" [ref=e101]
          - generic [ref=e102]:
            - text: Inmersión Total
            - heading "Bloques Temáticos" [level=3] [ref=e103]
            - paragraph [ref=e104]: Semanas dedicadas a un solo tema para profundizar verdaderamente.
    - generic [ref=e105]:
      - generic [ref=e106]:
        - text: Nuestra Tribu
        - heading "Vida Comunitaria" [level=2] [ref=e107]:
          - text: Vida
          - text: Comunitaria
        - paragraph [ref=e108]: En Trekan, la comunidad es protagonista. Las familias participan activamente en la construcción del proyecto educativo, porque educar es una tarea de todos.
      - generic [ref=e109]:
        - generic [ref=e111]:
          - img "Consejo Escolar" [ref=e112]
          - generic [ref=e114]:
            - generic [ref=e115]:
              - img [ref=e117]
              - heading "Consejo Escolar" [level=3] [ref=e122]
            - paragraph [ref=e123]: El corazón administrativo de nuestra comunidad. Un espacio transparente donde apoderados y maestros deciden el futuro del colegio.
        - generic [ref=e125]:
          - img "Asambleas Mensuales" [ref=e126]
          - generic [ref=e128]:
            - generic [ref=e129]:
              - img [ref=e131]
              - heading "Asambleas Mensuales" [level=3] [ref=e134]
            - paragraph [ref=e135]: Encuentros regulares donde compartimos el ritmo de las clases, las festividades y cultivamos la fraternidad entre las familias.
        - generic [ref=e137]:
          - img "Celebraciones Estacionales" [ref=e138]
          - generic [ref=e140]:
            - generic [ref=e141]:
              - img [ref=e143]
              - heading "Celebraciones Estacionales" [level=3] [ref=e146]
            - paragraph [ref=e147]: Fiestas de la Cosecha, Faroles, Espiral de Adviento. Marcamos el ritmo de la naturaleza celebrando juntos los cambios de ciclo.
        - generic [ref=e149]:
          - img "Comisiones de Trabajo" [ref=e150]
          - generic [ref=e152]:
            - generic [ref=e153]:
              - img [ref=e155]
              - heading "Comisiones de Trabajo" [level=3] [ref=e157]
            - paragraph [ref=e158]: Mantenimiento del espacio, bazar, huerto. Las manos de nuestra comunidad construyen y cuidan el entorno de nuestros niños.
        - generic [ref=e160]:
          - img "Trimembración Social" [ref=e161]
          - generic [ref=e163]:
            - generic [ref=e164]:
              - img [ref=e166]
              - heading "Trimembración Social" [level=3] [ref=e169]
            - paragraph [ref=e170]: Fomentamos una gestión participativa, horizontal y transparente, uniendo las esferas pedagógica, administrativa y comunitaria.
    - generic [ref=e172]:
      - generic [ref=e173]:
        - generic [ref=e174]:
          - img [ref=e176]
          - heading "Calendario de Actividades" [level=2] [ref=e178]
          - paragraph [ref=e179]: Momentos importantes para nuestra comunidad. ¡Te esperamos!
        - link "Ver calendario completo" [ref=e180] [cursor=pointer]:
          - /url: /actividades
          - text: Ver calendario completo
          - img [ref=e181]
      - generic [ref=e184]:
        - heading "Próximas en JUL" [level=3] [ref=e185]
        - generic [ref=e186]:
          - link "reunion 10JUL Jornada de Evaluación y Análisis Día de trabajo profundo para nuestros maestros. Salida anticipada de los niños (12:00 hrs). Salida 12:00 hrs" [ref=e187] [cursor=pointer]:
            - /url: /actividades
            - generic [ref=e188]:
              - text: reunion
              - generic [ref=e189]: 10JUL
            - generic [ref=e190]:
              - heading "Jornada de Evaluación y Análisis" [level=4] [ref=e191]
              - paragraph [ref=e192]: Día de trabajo profundo para nuestros maestros. Salida anticipada de los niños (12:00 hrs).
            - generic [ref=e194]:
              - img [ref=e195]
              - text: Salida 12:00 hrs
          - link "celebracion 13JUL Vacaciones de Invierno (13 al 31 de Julio) El merecido descanso invernal de mitad de año." [ref=e198] [cursor=pointer]:
            - /url: /actividades
            - generic [ref=e199]:
              - text: celebracion
              - generic [ref=e200]: 13JUL
            - generic [ref=e201]:
              - heading "Vacaciones de Invierno (13 al 31 de Julio)" [level=4] [ref=e202]
              - paragraph [ref=e203]: El merecido descanso invernal de mitad de año.
          - 'link "charla 23JUL EDUVIDA Voz: \"Piaf y Violeta\" Concierto escénico protagonizado por Annie Murath." [ref=e204] [cursor=pointer]':
            - /url: /actividades
            - generic [ref=e205]:
              - text: charla
              - generic [ref=e206]: 23JUL
            - generic [ref=e207]:
              - 'heading "EDUVIDA Voz: \"Piaf y Violeta\"" [level=4] [ref=e208]'
              - paragraph [ref=e209]: Concierto escénico protagonizado por Annie Murath.
    - generic [ref=e210]:
      - heading "Voces de la Comunidad" [level=2] [ref=e212]:
        - text: Voces de la
        - text: Comunidad
      - generic [ref=e213]:
        - generic [ref=e214]:
          - generic [ref=e217]:
            - paragraph [ref=e218]: "\"Nuestra hija recuperó el asombro por aprender.\""
            - paragraph [ref=e219]: Familia González
          - generic [ref=e220]:
            - img "Familia Silva" [ref=e221]
            - generic [ref=e222]:
              - paragraph [ref=e223]: "\"La conexión con la naturaleza es invaluable.\""
              - paragraph [ref=e224]: Familia Silva
          - generic [ref=e225]:
            - img "Apoderada de Básica" [ref=e226]
            - generic [ref=e227]:
              - paragraph [ref=e228]: "\"Una comunidad que abraza y sostiene.\""
              - paragraph [ref=e229]: Apoderada de Básica
          - generic [ref=e230]:
            - img "Apoderado de Media" [ref=e231]
            - generic [ref=e232]:
              - paragraph [ref=e233]: "\"El arte es el corazón del currículo.\""
              - paragraph [ref=e234]: Apoderado de Media
          - generic [ref=e237]:
            - paragraph [ref=e238]: "\"Nuestra hija recuperó el asombro por aprender.\""
            - paragraph [ref=e239]: Familia González
          - generic [ref=e240]:
            - img "Familia Silva" [ref=e241]
            - generic [ref=e242]:
              - paragraph [ref=e243]: "\"La conexión con la naturaleza es invaluable.\""
              - paragraph [ref=e244]: Familia Silva
          - generic [ref=e245]:
            - img "Apoderada de Básica" [ref=e246]
            - generic [ref=e247]:
              - paragraph [ref=e248]: "\"Una comunidad que abraza y sostiene.\""
              - paragraph [ref=e249]: Apoderada de Básica
          - generic [ref=e250]:
            - img "Apoderado de Media" [ref=e251]
            - generic [ref=e252]:
              - paragraph [ref=e253]: "\"El arte es el corazón del currículo.\""
              - paragraph [ref=e254]: Apoderado de Media
        - generic [ref=e255]:
          - generic [ref=e256]:
            - img "Mamá de Jardín" [ref=e257]
            - generic [ref=e258]:
              - paragraph [ref=e259]: "\"Verlos amasar el pan cada semana es mágico.\""
              - paragraph [ref=e260]: Mamá de Jardín
          - generic [ref=e261]:
            - img "Familia Rojas" [ref=e262]
            - generic [ref=e263]:
              - paragraph [ref=e264]: "\"Aprenden matemáticas tejiendo y cantando.\""
              - paragraph [ref=e265]: Familia Rojas
          - generic [ref=e266]:
            - img "Apoderado Nuevo" [ref=e267]
            - generic [ref=e268]:
              - paragraph [ref=e269]: "\"No hay notas, hay un profundo respeto por sus ritmos.\""
              - paragraph [ref=e270]: Apoderado Nuevo
          - generic [ref=e271]:
            - img "Familia de 5° Básico" [ref=e272]
            - generic [ref=e273]:
              - paragraph [ref=e274]: "\"El vínculo con su Maestro Guía es para toda la vida.\""
              - paragraph [ref=e275]: Familia de 5° Básico
          - generic [ref=e276]:
            - img "Mamá de Jardín" [ref=e277]
            - generic [ref=e278]:
              - paragraph [ref=e279]: "\"Verlos amasar el pan cada semana es mágico.\""
              - paragraph [ref=e280]: Mamá de Jardín
          - generic [ref=e281]:
            - img "Familia Rojas" [ref=e282]
            - generic [ref=e283]:
              - paragraph [ref=e284]: "\"Aprenden matemáticas tejiendo y cantando.\""
              - paragraph [ref=e285]: Familia Rojas
          - generic [ref=e286]:
            - img "Apoderado Nuevo" [ref=e287]
            - generic [ref=e288]:
              - paragraph [ref=e289]: "\"No hay notas, hay un profundo respeto por sus ritmos.\""
              - paragraph [ref=e290]: Apoderado Nuevo
          - generic [ref=e291]:
            - img "Familia de 5° Básico" [ref=e292]
            - generic [ref=e293]:
              - paragraph [ref=e294]: "\"El vínculo con su Maestro Guía es para toda la vida.\""
              - paragraph [ref=e295]: Familia de 5° Básico
    - generic [ref=e297]:
      - generic [ref=e298]:
        - heading "Comunidad Trekan" [level=2] [ref=e300]
        - generic [ref=e301]:
          - generic [ref=e302]:
            - button [ref=e303]:
              - img [ref=e304]
            - button [ref=e306]:
              - img [ref=e307]
          - link "Ver todo" [ref=e309] [cursor=pointer]:
            - /url: /noticias
            - text: Ver todo
            - img [ref=e310]
      - generic [ref=e312]:
        - article [ref=e313]:
          - 'link "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\" El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritm..." [ref=e314] [cursor=pointer]':
            - /url: /noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiración-en-el-hogar
            - time
            - 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=3] [ref=e315]'
            - paragraph [ref=e316]: El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritm...
          - generic:
            - 'link "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\""':
              - /url: /noticias/2026-04-29-escuela-para-padres-el-ritmo-y-la-respiración-en-el-hogar
              - 'img "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [ref=e317] [cursor=pointer]'
        - article [ref=e318]:
          - link "Fiesta de la Luz En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz. ..." [ref=e319] [cursor=pointer]:
            - /url: /noticias/2026-04-20-fiesta-de-la-luz
            - time
            - heading "Fiesta de la Luz" [level=3] [ref=e320]
            - paragraph [ref=e321]: En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz. ...
          - generic:
            - link "Fiesta de la Luz":
              - /url: /noticias/2026-04-20-fiesta-de-la-luz
              - img "Fiesta de la Luz" [ref=e322] [cursor=pointer]
        - article [ref=e323]:
          - 'link "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se uni..." [ref=e324] [cursor=pointer]':
            - /url: /noticias/2025-03-05-inauguracion
            - time
            - heading "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [level=3] [ref=e325]
            - paragraph [ref=e326]: "Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se uni..."
          - generic:
            - link "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan":
              - /url: /noticias/2025-03-05-inauguracion
              - img "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [ref=e327] [cursor=pointer]
        - article [ref=e328]:
          - 'link "Construyendo y Embelleciendo Nuestro Colegio En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir..." [ref=e329] [cursor=pointer]':
            - /url: /noticias/2025-02-20-construyendo
            - time
            - heading "Construyendo y Embelleciendo Nuestro Colegio" [level=3] [ref=e330]
            - paragraph [ref=e331]: "En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir..."
          - generic:
            - link "Construyendo y Embelleciendo Nuestro Colegio":
              - /url: /noticias/2025-02-20-construyendo
              - img "Construyendo y Embelleciendo Nuestro Colegio" [ref=e332] [cursor=pointer]
        - link "Ver todas las crónicas" [ref=e334] [cursor=pointer]:
          - /url: /noticias
          - img [ref=e336]
          - text: Ver todas las crónicas
    - generic [ref=e338]:
      - generic [ref=e339]:
        - text: Nuestro Mundo
        - heading "La Vida en Trekan" [level=2] [ref=e340]
      - generic [ref=e341]:
        - generic [ref=e342]:
          - generic [ref=e343]:
            - img "Exploración en la naturaleza"
          - generic [ref=e344]: Exploración en la naturaleza
        - generic [ref=e345]:
          - generic [ref=e346]:
            - img "Conexión vivencial"
          - generic [ref=e347]: Conexión vivencial
        - generic [ref=e348]:
          - generic [ref=e349]:
            - img "Ritmos y tradiciones"
          - generic [ref=e350]: Ritmos y tradiciones
        - generic [ref=e351]:
          - generic [ref=e352]:
            - img "Comunidad en movimiento"
          - generic [ref=e353]: Comunidad en movimiento
        - generic [ref=e354]:
          - generic [ref=e355]:
            - img "Aprendizaje en el entorno"
          - generic [ref=e356]: Aprendizaje en el entorno
        - generic [ref=e357]:
          - generic [ref=e358]:
            - img "Libertad y asombro"
          - generic [ref=e359]: Libertad y asombro
        - generic [ref=e360]:
          - generic [ref=e361]:
            - img "Luz y calidez"
          - generic [ref=e362]: Luz y calidez
    - generic [ref=e363]:
      - generic [ref=e364]:
        - text: Quiénes Somos
        - heading "Nuestro Equipo" [level=2] [ref=e365]
        - paragraph [ref=e366]: Un grupo de educadores y familias comprometidas con el florecimiento integral de la infancia.
      - generic [ref=e367]:
        - generic [ref=e369]:
          - img [ref=e371]
          - generic [ref=e374]:
            - heading "Yabel Painemil" [level=3] [ref=e375]
            - paragraph [ref=e376]: Docente Intercultural
            - paragraph [ref=e377]: Comunicadora Audiovisual, docente intercultural bilingüe, formación Waldorf básica y especialista en Gimnasia Bothmer.
        - generic [ref=e379]:
          - img [ref=e381]
          - generic [ref=e384]:
            - heading "Javiera Ortega" [level=3] [ref=e385]
            - paragraph [ref=e386]: Profesora General Básica
            - paragraph [ref=e387]: Especialista en lenguaje, cursando formación Waldorf.
        - generic [ref=e389]:
          - img [ref=e391]
          - generic [ref=e394]:
            - heading "Hanna Lowen" [level=3] [ref=e395]
            - paragraph [ref=e396]: Profesora de Inglés
            - paragraph [ref=e397]: Enseñanza del inglés con enfoque vivencial y artístico.
        - generic [ref=e399]:
          - img [ref=e401]
          - generic [ref=e405]:
            - heading "Matías Valiente" [level=3] [ref=e406]
            - paragraph [ref=e407]: Profesor de Carpintería
            - paragraph [ref=e408]: Maestro de oficios que guía a los niños en el trabajo con la madera y las manos.
        - generic [ref=e410]:
          - img [ref=e412]
          - generic [ref=e416]:
            - heading "Sofía González Rodríguez" [level=3] [ref=e417]
            - paragraph [ref=e418]: Profesora de Música
            - paragraph [ref=e419]: La música como lenguaje del alma en cada jornada escolar.
        - generic [ref=e421]:
          - img [ref=e423]
          - generic [ref=e425]:
            - heading "Ivonne Parada" [level=3] [ref=e426]
            - paragraph [ref=e427]: Familia Fundadora · Convivencia Escolar
            - paragraph [ref=e428]: Trabajadora Social UV, especialista en convivencia escolar con formación en peritaje social, polivagal y gestalt.
        - generic [ref=e430]:
          - img [ref=e432]
          - generic [ref=e439]:
            - heading "Sleater Martínez" [level=3] [ref=e440]
            - paragraph [ref=e441]: Familia Fundadora · Educadora de Párvulos
            - paragraph [ref=e442]: Cursando formación Waldorf en Fundación Arche.
        - generic [ref=e444]:
          - img [ref=e446]
          - generic [ref=e449]:
            - heading "Felipe Vivanco Cornejo" [level=3] [ref=e450]
            - paragraph [ref=e451]: Familia Fundadora · Administración
            - paragraph [ref=e452]: Administrador Público UV, formación en NICSP, Neurociencias y GYDP. Terapeuta, Escuela Arica.
        - generic [ref=e454]:
          - img [ref=e456]
          - generic [ref=e458]:
            - heading "Gerard Muñoz" [level=3] [ref=e459]
            - paragraph [ref=e460]: Familia Fundadora · Tecnología
            - paragraph [ref=e461]: Ingeniero en Informática.
    - generic [ref=e464]:
      - generic [ref=e465]:
        - generic [ref=e466]:
          - img [ref=e467]
          - text: Aporte Comunitario
        - heading "Una comunidad que se sostiene a sí misma." [level=2] [ref=e472]
        - paragraph [ref=e473]: En Colegio Waldorf Trekan, creemos que el acceso a la educación no debe ser una barrera insuperable. Nuestro modelo de aranceles incluye un componente solidario voluntario que permite becar a familias de nuestra propia comunidad, asegurando diversidad y apoyo mutuo.
        - generic [ref=e474]:
          - button "Conocer Valores y Aportes" [ref=e475]:
            - text: Conocer Valores y Aportes
            - img [ref=e476]
          - generic [ref=e478]:
            - img [ref=e479]
            - text: Tu aporte hace florecer el bosque
      - generic [ref=e481]:
        - generic:
          - img "Comunidad Waldorf"
        - generic [ref=e482]:
          - heading "¿Cómo funciona?" [level=4] [ref=e483]
          - paragraph [ref=e484]: Al momento de la matrícula, las familias pueden elegir voluntariamente sumar un Aporte Solidario a su mensualidad. Este fondo va directa y exclusivamente a financiar becas internas.
    - generic [ref=e486]:
      - generic [ref=e487]:
        - heading "Comencemos el Viaje" [level=2] [ref=e488]
        - paragraph [ref=e489]: Queremos conocer qué buscas para tu familia y así ofrecerte la experiencia pedagógica ideal.
      - generic [ref=e491]:
        - heading "¿Para qué nivel buscas matrícula?" [level=3] [ref=e492]
        - generic [ref=e493]:
          - button "Jardín y Kínder (3 a 6 años)" [ref=e494]
          - button "Educación Básica (1º a 8º)" [ref=e495]
    - generic [ref=e496]:
      - generic [ref=e497]:
        - text: Resuelve tus Dudas
        - heading "Preguntas Frecuentes" [level=2] [ref=e498]
      - generic [ref=e499]:
        - generic [ref=e500]:
          - button "🌱 ¿Qué es la educación Waldorf?" [expanded] [ref=e501]:
            - text: 🌱 ¿Qué es la educación Waldorf?
            - img [ref=e502]
          - region "🌱 ¿Qué es la educación Waldorf?":
            - paragraph [ref=e504]: "La pedagogía Waldorf acompaña el desarrollo integral del niño —mente, corazón y manos— a través de experiencias vivenciales, arte, naturaleza y comunidad. No solo enseñamos contenidos: cultivamos curiosidad, creatividad y voluntad."
        - button "👩‍🏫 ¿Cuántos estudiantes hay por curso?" [ref=e506]:
          - text: 👩‍🏫 ¿Cuántos estudiantes hay por curso?
          - img [ref=e507]
        - button "📝 ¿Cómo es la evaluación?" [ref=e510]:
          - text: 📝 ¿Cómo es la evaluación?
          - img [ref=e511]
        - button "📝 ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc?" [ref=e514]:
          - text: 📝 ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc?
          - img [ref=e515]
        - button "📊 ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC?" [ref=e518]:
          - text: 📊 ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC?
          - img [ref=e519]
        - button "🎨 ¿Hay talleres extracurriculares?" [ref=e522]:
          - text: 🎨 ¿Hay talleres extracurriculares?
          - img [ref=e523]
        - button "🚍 ¿Hay transporte o alimentación disponible?" [ref=e526]:
          - text: 🚍 ¿Hay transporte o alimentación disponible?
          - img [ref=e527]
        - button "🏡 ¿Puedo visitar el colegio antes de postular?" [ref=e530]:
          - text: 🏡 ¿Puedo visitar el colegio antes de postular?
          - img [ref=e531]
        - button "📅 ¿Cuándo puedo postular?" [ref=e534]:
          - text: 📅 ¿Cuándo puedo postular?
          - img [ref=e535]
        - button "💌 ¿Cómo me contacto rápidamente?" [ref=e538]:
          - text: 💌 ¿Cómo me contacto rápidamente?
          - img [ref=e539]
    - generic [ref=e542]:
      - generic [ref=e543]:
        - generic [ref=e544]:
          - text: Hablemos
          - heading "¿Tienes dudas o quieres visitarnos?" [level=2] [ref=e545]
          - paragraph [ref=e546]: Escríbenos. Nos encanta recibir a nuevas familias, responder preguntas y abrir las puertas de nuestra comunidad.
        - generic [ref=e547]:
          - generic [ref=e548]:
            - img [ref=e550]
            - generic [ref=e553]:
              - heading "Dirección" [level=4] [ref=e554]
              - paragraph [ref=e555]:
                - text: Las Azaleas 96, Parque Ivian 1
                - text: Puerto Varas, Chile
          - generic [ref=e556]:
            - img [ref=e558]
            - generic [ref=e560]:
              - heading "WhatsApp / Teléfono" [level=4] [ref=e561]
              - link "+56 9 6776 5106" [ref=e562] [cursor=pointer]:
                - /url: https://wa.me/56967765106
          - generic [ref=e563]:
            - img [ref=e565]
            - generic [ref=e568]:
              - heading "Correo" [level=4] [ref=e569]
              - link "admision@colegiowaldorftrekan.cl" [ref=e570] [cursor=pointer]:
                - /url: https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web
        - button "Guardar Contacto (vCard)" [active] [ref=e572]:
          - img [ref=e573]
          - text: Guardar Contacto (vCard)
      - generic [ref=e577]:
        - heading "Envíanos un mensaje" [level=3] [ref=e578]
        - generic [ref=e579]:
          - generic [ref=e580]:
            - text: Nombre
            - textbox "Tu nombre y apellido" [ref=e581]
          - generic [ref=e582]:
            - text: Correo Electrónico
            - textbox "tucorreo@ejemplo.com" [ref=e583]
          - generic [ref=e584]:
            - text: Mensaje
            - textbox "¿En qué te podemos ayudar?" [ref=e585]
          - button "Enviar Mensaje" [ref=e586]:
            - text: Enviar Mensaje
            - img [ref=e587]
    - generic [ref=e590]:
      - generic [ref=e591]:
        - text: Nuestra Casa
        - heading "Dónde Encontrarnos" [level=2] [ref=e592]
        - paragraph [ref=e593]: Estamos inmersos en la naturaleza del Parque Ivian, un entorno que nutre y cobija el desarrollo de nuestros niños.
      - generic [ref=e594]:
        - iframe [ref=e595]:
          - generic [active] [ref=f1e1]:
            - link "Maps (se abre en una nueva pestaña)" [ref=f1e4] [cursor=pointer]:
              - /url: undefined
              - text: Maps
              - img [ref=f1e6]
            - generic [ref=f1e9]:
              - region "Mapa" [ref=f1e10]
              - iframe [ref=f1e15]:
                
        - generic [ref=e596]:
          - generic [ref=e597]:
            - img [ref=e599]
            - generic [ref=e602]:
              - heading "Colegio Trekan" [level=3] [ref=e603]
              - paragraph [ref=e604]: Parque Ivian, Puerto Varas
          - paragraph [ref=e605]: Un entorno natural protegido donde el bosque es nuestra principal aula de clases.
          - link "Abrir en Google Maps→" [ref=e606] [cursor=pointer]:
            - /url: https://www.google.com/maps/search/?api=1&query=Colegio+Waldorf+Trekan+Puerto+Varas
    - generic [ref=e608]:
      - generic [ref=e609]:
        - generic [ref=e610]:
          - heading "Comunidad Activa" [level=2] [ref=e611]:
            - img [ref=e612]
            - text: Comunidad Activa
          - paragraph [ref=e615]: Sigue el día a día de nuestros caminantes en @waldorftrekanpv
        - link "Seguir en Instagram" [ref=e616] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
      - generic [ref=e618]:
        - link "Instagram post" [ref=e619] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e620]
          - img [ref=e622]
        - link "Instagram post" [ref=e625] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e626]
          - img [ref=e628]
        - link "Instagram post" [ref=e631] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e632]
          - img [ref=e634]
        - link "Instagram post" [ref=e637] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e638]
          - img [ref=e640]
        - link "Instagram post" [ref=e643] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e644]
          - img [ref=e646]
        - link "Instagram post" [ref=e649] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e650]
          - img [ref=e652]
        - link "Instagram post" [ref=e655] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e656]
          - img [ref=e658]
        - link "Instagram post" [ref=e661] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e662]
          - img [ref=e664]
        - link "Instagram post" [ref=e667] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e668]
          - img [ref=e670]
        - link "Instagram post" [ref=e673] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e674]
          - img [ref=e676]
        - link "Instagram post" [ref=e679] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e680]
          - img [ref=e682]
        - link "Instagram post" [ref=e685] [cursor=pointer]:
          - /url: https://www.instagram.com/waldorftrekanpv/
          - img "Instagram post" [ref=e686]
          - img [ref=e688]
    - generic [ref=e692]:
      - generic [ref=e693]:
        - img "Materiales nobles en pedagogía Waldorf" [ref=e694]
        - generic [ref=e695]:
          - paragraph [ref=e696]: Materia Prima
          - paragraph [ref=e697]: En Trekan, no hay plástico. Solo madera viva, lana cruda y ceras naturales que conectan al niño con la verdad del mundo.
      - generic [ref=e698]:
        - heading "Sostenibilidad Radical." [level=2] [ref=e699]:
          - text: Sostenibilidad
          - text: Radical.
        - paragraph [ref=e700]: La ética no es una asignatura, es el entorno. Desde la arquitectura de nuestro colegio hasta las fibras de los juguetes, cada elemento está diseñado con un respeto absoluto por los ritmos de la naturaleza y el desarrollo humano.
        - generic [ref=e701]:
          - generic [ref=e702]:
            - heading "100%" [level=3] [ref=e703]
            - paragraph [ref=e704]: Materiales nobles en el aula parvularia
          - generic [ref=e705]:
            - heading "0%" [level=3] [ref=e706]
            - paragraph [ref=e707]: Pantallas en los primeros dos septenios
    - generic [ref=e708]:
      - generic [ref=e709]:
        - generic [ref=e710]:
          - generic [ref=e711]:
            - generic [ref=e712]: T
            - text: TREKAN
          - paragraph [ref=e713]: Un espacio educativo independiente inspirado en la pedagogía Waldorf, comprometido con el florecimiento libre e íntegro de la infancia en el sur de Chile.
          - generic [ref=e714]:
            - link [ref=e715] [cursor=pointer]:
              - /url: https://www.instagram.com/waldorftrekanpv/
              - img [ref=e716]
            - link [ref=e719] [cursor=pointer]:
              - /url: https://www.facebook.com/profile.php?id=61573063135723
              - img [ref=e720]
        - generic [ref=e722]:
          - heading "Contacto" [level=4] [ref=e723]
          - list [ref=e724]:
            - listitem [ref=e725]:
              - img [ref=e726]
              - text: +56 9 6776 5106
            - listitem [ref=e728]:
              - img [ref=e729]
              - link "admision@colegiowaldorftrekan.cl" [ref=e732] [cursor=pointer]:
                - /url: https://mail.google.com/mail/?view=cm&fs=1&to=admision@colegiowaldorftrekan.cl&su=Contacto%20Sitio%20Web
            - listitem [ref=e733]:
              - img [ref=e734]
              - text: Las Azaleas 96, Parque Ivian 1, Puerto Varas
        - generic [ref=e737]:
          - heading "Navegación" [level=4] [ref=e738]
          - list [ref=e739]:
            - listitem [ref=e740]:
              - link "Quiénes Somos" [ref=e741] [cursor=pointer]:
                - /url: /#quienes-somos
            - listitem [ref=e742]:
              - link "Pedagogía Waldorf" [ref=e743] [cursor=pointer]:
                - /url: /#pedagogia
            - listitem [ref=e744]:
              - link "Admisión 2026" [ref=e745] [cursor=pointer]:
                - /url: /#admision
            - listitem [ref=e746]:
              - link "Arriendo de Salón" [ref=e747] [cursor=pointer]:
                - /url: /arriendo-salon
      - generic [ref=e748]:
        - paragraph [ref=e749]: © 2026 Colegio Waldorf Trekan - Puerto Varas
        - paragraph [ref=e750]: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
        - link "Directorio de Recursos Waldorf y Antroposóficos en Chile" [ref=e751] [cursor=pointer]:
          - /url: /recursos
  - button "Contactar por WhatsApp" [ref=e754]:
    - img [ref=e755]
  - generic [ref=e758]:
    - generic [ref=e759]: ¿Dudas? ¡Pregúntame! 🌱
    - button "Abrir Chat" [ref=e760]:
      - generic [ref=e761]:
        - img [ref=e762]
        - text: Hablemos
      - text: "1"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navbar & Global Widgets (Tier 1)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('test_sticky_nav_rendered: navbar should exist and be fixed', async ({ page }) => {
  9  |     const navbar = page.locator('nav');
  10 |     await expect(navbar).toBeVisible();
  11 |     await expect(navbar).toHaveClass(/fixed/);
  12 |   });
  13 | 
  14 |   test('test_custom_cursor_present: custom cursor element should be in DOM', async ({ page }) => {
  15 |     // CustomCursor component renders a fixed div with z-[9999] and pointer-events-none classes
  16 |     const cursorDot = page.locator('div.fixed.pointer-events-none.z-\\[9999\\]');
  17 |     await expect(cursorDot).toBeAttached();
  18 |   });
  19 | 
  20 |   test('test_chatbot_toggle: chatbot widget triggers open/close', async ({ page }) => {
  21 |     const openChatBtn = page.locator('button[aria-label="Abrir Chat"]');
  22 |     await expect(openChatBtn).toBeVisible();
  23 |     
  24 |     // Click button to open
  25 |     await openChatBtn.click();
  26 |     
  27 |     // Verify lead capture form is now visible
  28 |     const leadFormInput = page.locator('input[placeholder="Tu Nombre"]');
  29 |     await expect(leadFormInput).toBeVisible();
  30 | 
  31 |     // Click close button inside chat header
  32 |     const closeBtn = page.locator('button[aria-label="Cerrar chat"]');
  33 |     await closeBtn.click();
  34 |     await expect(leadFormInput).not.toBeVisible();
  35 |   });
  36 | 
  37 |   test('test_lang_switcher_present: verify language selection buttons exist', async ({ page }) => {
  38 |     const esBtn = page.getByRole('button', { name: 'ES', exact: true });
  39 |     const deBtn = page.getByRole('button', { name: 'DE', exact: true });
  40 |     const enBtn = page.getByRole('button', { name: 'EN', exact: true });
  41 |     await expect(esBtn).toBeVisible();
  42 |     await expect(deBtn).toBeVisible();
  43 |     await expect(enBtn).toBeVisible();
  44 |   });
  45 | 
  46 |   test('test_vcard_download: click vCard button triggers download', async ({ page }) => {
  47 |     const vcardBtn = page.locator('button:has-text("Guardar Contacto (vCard)")');
  48 |     await expect(vcardBtn).toBeVisible();
  49 | 
> 50 |     const downloadPromise = page.waitForEvent('download');
     |                                  ^ Error: page.waitForEvent: Test timeout of 60000ms exceeded.
  51 |     await vcardBtn.click();
  52 |     const download = await downloadPromise;
  53 | 
  54 |     expect(download.suggestedFilename()).toBe('colegio_trekan.vcf');
  55 |   });
  56 | });
  57 | 
  58 | test.describe('Boundaries (Tier 2)', () => {
  59 |   test('test_admission_fields_validation: parentName and childrenAges are required', async ({ page }) => {
  60 |     await page.goto('/admision');
  61 |     const parentName = page.locator('input[name="parentName"]');
  62 |     const childrenAges = page.locator('input[name="childrenAges"]');
  63 |     await expect(parentName).toHaveAttribute('required', '');
  64 |     await expect(childrenAges).toHaveAttribute('required', '');
  65 |   });
  66 | 
  67 |   test('test_past_date_block_in_booking_calendar: date picker blocks past dates', async ({ page }) => {
  68 |     await page.goto('/arriendo-salon');
  69 |     const dateInput = page.locator('input[type="date"]');
  70 |     const todayStr = new Date().toISOString().split('T')[0];
  71 |     await expect(dateInput).toHaveAttribute('min', todayStr);
  72 |   });
  73 | 
  74 |   test('test_guest_limits_in_booking: arriendo-salon displays capacity limit', async ({ page }) => {
  75 |     await page.goto('/arriendo-salon');
  76 |     const capacityText = page.locator('text=hasta 20 personas');
  77 |     await expect(capacityText).toBeVisible();
  78 |   });
  79 | });
  80 | 
```