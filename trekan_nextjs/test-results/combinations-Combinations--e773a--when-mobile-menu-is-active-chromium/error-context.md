# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: combinations.spec.ts >> Combinations & Integration (Tier 3) >> test_combo_mobile_menu_scroll_override: scrolling down does not hide navbar when mobile menu is active
- Location: tests\combinations.spec.ts:48:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#mobile-menu')
    - locator resolved to <button id="mobile-menu" class="menu-toggle" aria-label="Menú de navegación">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    60 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido principal" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e5]:
      - heading "Colegio Waldorf Trekan" [level=1] [ref=e6]
      - paragraph [ref=e7]: Educación con el corazón, en armonía con la naturaleza
      - generic [ref=e8]:
        - link "Admisión 2026" [ref=e9] [cursor=pointer]:
          - /url: https://docs.google.com/forms/d/e/1FAIpQLSdXbiojPJFncN94G3AS5huINvHKjpv2xFLcEaMjsHiC8sHYSQ/viewform
        - link "Nuestra Pedagogía" [ref=e10] [cursor=pointer]:
          - /url: "#quienes-somos"
  - navigation [ref=e11]:
    - generic [ref=e12]:
      - link "Logo Trekan Trekan" [ref=e13] [cursor=pointer]:
        - /url: index.html
        - img "Logo Trekan" [ref=e15]
        - generic [ref=e16]: Trekan
      - list [ref=e17]:
        - listitem [ref=e18]:
          - link "Inicio" [ref=e19] [cursor=pointer]:
            - /url: index.html#inicio
        - listitem [ref=e20]:
          - link "Nosotros ▾" [ref=e21] [cursor=pointer]:
            - /url: index.html#quienes-somos
        - listitem [ref=e22]:
          - link "Admisión 2026 ▾" [ref=e23] [cursor=pointer]:
            - /url: index.html#admission
        - listitem [ref=e24]:
          - link "Arriendo de Salón" [ref=e25] [cursor=pointer]:
            - /url: arriendo-salon.html
        - listitem [ref=e26]:
          - link "Contacto" [ref=e27] [cursor=pointer]:
            - /url: index.html#contacto
        - listitem [ref=e28]:
          - link "🇪🇸 ES ▾" [ref=e29] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e30]: 🇪🇸
            - text: ES ▾
      - link "Conocer el proceso de admisión" [ref=e31] [cursor=pointer]:
        - /url: /admision.html
        - text: 🌿 Conocer admisión
  - generic [ref=e35]:
    - heading "Donde el niño camina con voluntad" [level=2] [ref=e36]
    - paragraph [ref=e37]:
      - text: En el corazón de
      - strong [ref=e38]: Puerto Varas
      - text: ", nace"
      - strong [ref=e39]: Trekan
      - text: ", una comunidad educativa inspirada en la"
      - strong [ref=e40]: pedagogía Waldorf
      - text: que acompaña a niñas y niños
      - strong [ref=e41]: de 3 a 14 años
      - text: en su desarrollo integral.
    - paragraph [ref=e42]:
      - strong [ref=e43]: Trekan
      - text: significa
      - emphasis [ref=e44]: caminante
      - text: "en mapudungun: un ser que decide encaminarse hacia el mundo… y hacia sí mismo."
    - generic [ref=e45]:
      - link "🌿 Conocer el proceso de admisión" [ref=e46] [cursor=pointer]:
        - /url: /admision.html
      - link "Conócenos" [ref=e47] [cursor=pointer]:
        - /url: "#quienes-somos"
  - generic [ref=e49]:
    - heading "Enfoque Pedagógico Waldorf" [level=2] [ref=e50]
    - paragraph [ref=e51]: Inspirados en Rudolf Steiner, entendemos al niño como un ser espiritual en evolución. Nuestra educación armoniza el **pensamiento, el sentir y la voluntad** a través del arte, el ritmo y el movimiento.
    - generic [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]:
          - img "Aprendizaje Vivencial" [ref=e55]
          - generic [ref=e56]: ✨
        - heading "Aprendizaje Vivencial" [level=3] [ref=e57]
        - paragraph [ref=e58]: Matemáticas, lenguaje e historia se viven con las manos, el corazón y la mente.
      - generic [ref=e59]:
        - generic [ref=e60]:
          - img "Maestro Guía" [ref=e61]
          - generic [ref=e62]: ✨
        - heading "Maestro Guía" [level=3] [ref=e63]
        - paragraph [ref=e64]: Acompaña al niño durante varios años, creando un vínculo profundo y seguro.
      - generic [ref=e65]:
        - generic [ref=e66]:
          - img "Conexión con la Naturaleza" [ref=e67]
          - generic [ref=e68]: ✨
        - heading "Conexión con la Naturaleza" [level=3] [ref=e69]
        - paragraph [ref=e70]: Huerta, carpintería, salidas al bosque y celebración de las estaciones.
      - generic [ref=e71]:
        - generic [ref=e72]:
          - img "Bloques Temáticos" [ref=e73]
          - generic [ref=e74]: ✨
        - heading "Bloques Temáticos" [level=3] [ref=e75]
        - paragraph [ref=e76]: "Contenidos integrados: arte, música, manualidades y movimiento."
  - generic [ref=e78]:
    - heading "Misión, Visión y Equipo" [level=2] [ref=e79]
    - generic [ref=e80]:
      - generic [ref=e81]:
        - img "Misión" [ref=e82]
        - generic [ref=e84]:
          - heading "Misión" [level=3] [ref=e85]
          - paragraph [ref=e86]: Formar personas libres, conscientes, creativas y comprometidas con su entorno, mediante una educación que armonice el conocimiento, el arte y la acción.
      - generic [ref=e87]:
        - img "Visión" [ref=e88]
        - generic [ref=e90]:
          - heading "Visión" [level=3] [ref=e91]
          - paragraph [ref=e92]: Ser una comunidad educativa referente en el sur de Chile, por su capacidad de cultivar el respeto, la belleza y el sentido profundo del aprendizaje.
      - generic [ref=e93]:
        - img "Valores" [ref=e94]
        - generic [ref=e96]:
          - heading "Valores" [level=3] [ref=e97]
          - paragraph [ref=e98]: Respeto, cuidado del entorno, trabajo colaborativo, diversidad, libertad responsable, verdad y belleza.
      - generic [ref=e99]:
        - heading "Equipo" [level=3] [ref=e100]
        - paragraph [ref=e101]:
          - strong [ref=e102]: "Yabel Painemil:"
          - text: Comunicadora Audiovisual, docente intercultural bilingüe, formación Waldorf básica y especialista en Gimnasia Bothmer.
        - paragraph [ref=e103]:
          - strong [ref=e104]: "Javiera Ortega:"
          - text: Profesora General Básica especialista en lenguaje, cursando formación Waldorf.
        - paragraph [ref=e105]:
          - strong [ref=e106]: "Hanna Lowen:"
          - text: Profesora de Inglés.
        - paragraph [ref=e107]:
          - strong [ref=e108]: "Matías Valiente:"
          - text: Profesor de Carpintería.
        - paragraph [ref=e109]:
          - strong [ref=e110]: "Sofía González Rodríguez:"
          - text: Profesora de Música.
        - paragraph [ref=e111]:
          - strong [ref=e112]: "Ivonne Parada:"
          - text: Familia Fundadora. Trabajadora Social UV, especialista en convivencia escolar con formación en peritaje social, polivagal, gestalt.
        - paragraph [ref=e113]:
          - strong [ref=e114]: "Sleater Martínez:"
          - text: Familia Fundadora. Educadora de Párvulos, cursando formación Waldorf en fundación arche.
        - paragraph [ref=e115]:
          - strong [ref=e116]: "Felipe Vivanco Cornejo:"
          - text: Familia Fundadora. Administrador Público UV, con formación en NICSP, Neurociencias, GYDP. Terapeuta, Escuela Arica.
        - paragraph [ref=e117]:
          - strong [ref=e118]: "Gerard Muñoz:"
          - text: Familia Fundadora. Ingeniero en Informática.
  - generic [ref=e120]:
    - heading "📅 Próximas Actividades" [level=2] [ref=e121]
    - paragraph [ref=e122]: Momentos importantes para nuestra comunidad. ¡Te esperamos!
    - generic [ref=e123]:
      - generic [ref=e124]:
        - generic [ref=e125]:
          - generic [ref=e126]: "29"
          - generic [ref=e127]: JUN
        - generic [ref=e128]:
          - generic [ref=e129]: Celebración
          - heading "Feriado San Pedro y San Pablo" [level=3] [ref=e130]
          - paragraph [ref=e131]: Día de descanso.
          - paragraph [ref=e133]: Un día de pausa y descanso para nuestra comunidad escolar.
      - link "Ver calendario" [ref=e135] [cursor=pointer]:
        - /url: actividades.html
    - generic [ref=e136]:
      - paragraph [ref=e137]: ¿Quieres participar o tienes dudas sobre alguna actividad?
      - link "💬 Consultar por WhatsApp" [ref=e138] [cursor=pointer]:
        - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20las%20próximas%20actividades%20de%20Trekan
  - generic [ref=e140]:
    - heading "🏡 Vida Comunitaria" [level=2] [ref=e141]
    - paragraph [ref=e142]: En Trekan, la comunidad es protagonista. Las familias participan activamente en la construcción del proyecto educativo.
    - generic [ref=e143]:
      - generic [ref=e144]: • Consejo Escolar
      - generic [ref=e145]: • Asambleas mensuales
      - generic [ref=e146]: • Celebraciones estacionales
      - generic [ref=e147]: • Comisiones de trabajo
      - generic [ref=e148]: • Talleres para padres
      - generic [ref=e149]: • Mantención del espacio
    - paragraph [ref=e150]:
      - text: Fomentamos una gestión participativa, horizontal y transparente, basada en la
      - strong [ref=e151]: trimembración social
      - text: ": pedagógica, administrativa y comunitaria."
  - generic [ref=e153]:
    - heading "📰 Noticias y Actualidad" [level=2] [ref=e154]
    - paragraph [ref=e155]: Mantente al día con las últimas novedades de nuestra comunidad educativa.
    - generic [ref=e156]:
      - generic [ref=e157]:
        - button "Click para ampliar imagen" [ref=e160] [cursor=pointer]
        - generic [ref=e161]:
          - generic [ref=e162]: 22 de Abril de 2026
          - 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=3] [ref=e163]'
          - paragraph [ref=e164]: "El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritmo diario en el hogar, comprendido como una respiración: momentos de actividad (inhalación) y momentos de descanso (exhalación), que brindan seguridad, contención y calidez a nuestros niños. Durante la jornada se abrió un espacio de diálogo cercano, donde las familias pudieron compartir sus conocimientos, experiencias e inquietudes. A partir de preguntas como ¿qué saben sobre la pedagogía Waldorf?, surgieron diversas reflexiones, dudas e intereses en torno a este enfoque educativo. Asimismo, se abordó el tema del uso de pantallas en la vida cotidiana de los niños, generando una conversación en torno a sus efectos, límites y desafíos dentro del hogar. Este espacio permitió fortalecer el vínculo entre familia y escuela, acogiendo las preguntas e inquietudes de la comunidad, y abriendo caminos para seguir profundizando en estos temas en futuros encuentros."
          - generic [ref=e165]:
            - button "Ver imagen 1" [ref=e166] [cursor=pointer]:
              - img "Foto 1" [ref=e168]
              - generic [ref=e169]: 🔍
            - button "Ver imagen 2" [ref=e170] [cursor=pointer]:
              - img "Foto 2" [ref=e172]
              - generic [ref=e173]: 🔍
            - button "Ver imagen 3" [ref=e174] [cursor=pointer]:
              - img "Foto 3" [ref=e176]
              - generic [ref=e177]: 🔍
      - generic [ref=e178]:
        - button "Click para ampliar imagen" [ref=e181] [cursor=pointer]
        - generic [ref=e182]:
          - generic [ref=e183]: 21 de junio de 2025
          - heading "Fiesta de la Luz" [level=3] [ref=e184]
          - paragraph [ref=e185]: En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz.
          - iframe [ref=e187]
      - generic [ref=e188]:
        - button "Click para ampliar imagen" [ref=e191] [cursor=pointer]
        - generic [ref=e192]:
          - generic [ref=e193]: 5 de Marzo de 2025
          - heading "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [level=3] [ref=e194]
          - paragraph [ref=e195]: "Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se unieran para educar?"
          - generic [ref=e196]:
            - button "Ver imagen 1" [ref=e197] [cursor=pointer]:
              - img "Foto 1" [ref=e199]
              - generic [ref=e200]: 🔍
            - button "Ver imagen 2" [ref=e201] [cursor=pointer]:
              - img "Foto 2" [ref=e203]
              - generic [ref=e204]: 🔍
          - iframe [ref=e206]
      - generic [ref=e207]:
        - button "Click para ampliar imagen" [ref=e210] [cursor=pointer]
        - generic [ref=e211]:
          - generic [ref=e212]: 20 de Febrero de 2025
          - heading "Construyendo y Embelleciendo Nuestro Colegio" [level=3] [ref=e213]
          - paragraph [ref=e214]: "En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir a nuestras niñas, niños y familias."
          - generic [ref=e215]:
            - button "Ver imagen 1" [ref=e216] [cursor=pointer]:
              - img "Foto 1" [ref=e218]
              - generic [ref=e219]: 🔍
            - button "Ver imagen 2" [ref=e220] [cursor=pointer]:
              - img "Foto 2" [ref=e222]
              - generic [ref=e223]: 🔍
  - generic [ref=e225]:
    - heading "📚 Propuesta Curricular" [level=2] [ref=e226]
    - paragraph [ref=e227]: Nuestro currículo se basa en el desarrollo evolutivo del niño, siguiendo el modelo de Tobias Richter y las bases nacionales, integrando arte, naturaleza y pensamiento.
    - generic [ref=e228]:
      - generic [ref=e229]: • Bloques temáticos integrados
      - generic [ref=e230]: • Evaluación cualitativa
      - generic [ref=e231]: • Portafolios personalizados
      - generic [ref=e232]: • Inglés
      - generic [ref=e233]: • Música
      - generic [ref=e234]: • Artes
      - generic [ref=e235]: • Carpintería
      - generic [ref=e236]: • Huerta
      - generic [ref=e237]: • Euritmia y movimiento
    - paragraph [ref=e238]: "El aprendizaje no es abstracto: se vive, se siente, se hace. Cada conocimiento se integra con la voluntad del niño."
  - generic [ref=e240]:
    - heading "Admisión 2026" [level=2] [ref=e241]
    - generic [ref=e242]:
      - heading "Valores 2026" [level=3] [ref=e243]
      - table [ref=e245]:
        - rowgroup [ref=e246]:
          - row "Concepto Valor Detalles" [ref=e247]:
            - columnheader "Concepto" [ref=e248]
            - columnheader "Valor" [ref=e249]
            - columnheader "Detalles" [ref=e250]
        - rowgroup [ref=e251]:
          - 'row "Matrícula $500.000 En 2 cuotas: enero y febrero. No reembolsable." [ref=e252]':
            - cell "Matrícula" [ref=e253]:
              - strong [ref=e254]: Matrícula
            - cell "$500.000" [ref=e255]
            - 'cell "En 2 cuotas: enero y febrero. No reembolsable." [ref=e256]'
          - row "Escolaridad Normal $330.000/mes Pago mensual, hasta el día 5 de cada mes." [ref=e257]:
            - cell "Escolaridad Normal" [ref=e258]:
              - strong [ref=e259]: Escolaridad Normal
            - cell "$330.000/mes" [ref=e260]
            - cell "Pago mensual, hasta el día 5 de cada mes." [ref=e261]
          - row "Responsabilidad Social $33.000 adicionales al mes Aporte voluntario que fortalece becas para familias que requieren apoyo." [ref=e262]:
            - cell "Responsabilidad Social" [ref=e263]:
              - strong [ref=e264]: Responsabilidad Social
            - cell "$33.000 adicionales al mes" [ref=e265]
            - cell "Aporte voluntario que fortalece becas para familias que requieren apoyo." [ref=e266]
          - 'row "Cuota de Materiales $160.000 Anual, en 2 cuotas: marzo y junio." [ref=e267]':
            - cell "Cuota de Materiales" [ref=e268]:
              - strong [ref=e269]: Cuota de Materiales
            - cell "$160.000" [ref=e270]
            - 'cell "Anual, en 2 cuotas: marzo y junio." [ref=e271]'
          - row "Cuota de incorporación $330.000 Una sola cuota." [ref=e272]:
            - cell "Cuota de incorporación" [ref=e273]:
              - strong [ref=e274]: Cuota de incorporación
            - cell "$330.000" [ref=e275]
            - cell "Una sola cuota." [ref=e276]
    - paragraph [ref=e278]:
      - strong [ref=e279]: Agradecemos
      - text: a todas las familias que pueden sostener el aporte de
      - emphasis [ref=e280]: Responsabilidad Social
      - text: . Cada diferencia contribuye a sostener becas y fortalecer nuestra comunidad educativa inclusiva.
    - generic [ref=e281]:
      - heading "Aranceles Diferenciados" [level=3] [ref=e282]
      - paragraph [ref=e283]: Si deseas participar en el proyecto pero necesitas un arancel diferenciado, conversaremos contigo con empatía. Evaluaremos tu situación socioeconómica y buscaremos opciones sostenibles, incluso con aporte en labores operativas o iniciativas según tus habilidades.
    - generic [ref=e284]:
      - heading "Política de Devoluciones" [level=3] [ref=e285]
      - list [ref=e286]:
        - listitem [ref=e287]:
          - text: ✓
          - strong [ref=e288]: "Antes de marzo:"
          - text: 100% de la escolaridad devuelta.
        - listitem [ref=e289]:
          - text: ✓
          - strong [ref=e290]: "Después de marzo, antes del 2° semestre:"
          - text: Devolución de la escolaridad del 2° semestre.
        - listitem [ref=e291]:
          - text: ✓
          - strong [ref=e292]: "Después del 2° semestre:"
          - text: No hay devoluciones.
        - listitem [ref=e293]:
          - text: ✓
          - strong [ref=e294]: "Matrícula:"
          - text: No reembolsable.
    - generic [ref=e295]:
      - heading "Seguro Escolar" [level=3] [ref=e296]
      - paragraph [ref=e297]: "No es obligatorio. Opciones disponibles:"
      - list [ref=e298]:
        - listitem [ref=e299]: ✓ Seguro de accidentes – Andes Salud
        - listitem [ref=e300]: ✓ Seguro de accidentes – Clínica Puerto Varas
      - paragraph [ref=e301]:
        - text: Si no contratas seguro, deberás firmar el
        - strong [ref=e302]: Mandato Parental sobre atención de urgencia
        - text: al momento de la matrícula.
    - generic [ref=e303]:
      - heading "Horarios" [level=3] [ref=e304]
      - paragraph [ref=e305]:
        - strong [ref=e306]: "Jornada:"
        - text: 8:00 a 14:00 hrs, de lunes a viernes.
    - generic [ref=e307]:
      - paragraph [ref=e308]: Elegir colegio no es una decisión rápida. Te invitamos a conocer cómo es realmente el proceso.
      - link "🌿 Conocer el proceso de admisión" [ref=e309] [cursor=pointer]:
        - /url: /admision.html
  - generic [ref=e311]:
    - heading "❓ Preguntas Frecuentes" [level=2] [ref=e312]
    - paragraph [ref=e313]: Aquí respondemos las consultas más comunes sobre nuestra comunidad educativa.
    - list "Preguntas frecuentes" [ref=e314]:
      - listitem [ref=e315]:
        - button "🌱 ¿Qué es la educación Waldorf? +" [ref=e316] [cursor=pointer]:
          - generic [ref=e317]: 🌱
          - generic [ref=e318]: ¿Qué es la educación Waldorf?
          - generic [ref=e319]: +
        - paragraph [ref=e320]: "La pedagogía Waldorf acompaña el desarrollo integral del niño —mente, corazón y manos— a través de experiencias vivenciales, arte, naturaleza y comunidad. No solo enseñamos contenidos: cultivamos curiosidad, creatividad y voluntad."
      - listitem [ref=e321]:
        - button "👩 ‍🏫 ¿Cuántos estudiantes hay por curso? +" [ref=e322] [cursor=pointer]:
          - generic [ref=e323]: 👩
          - generic [ref=e324]: ‍🏫 ¿Cuántos estudiantes hay por curso?
          - generic [ref=e325]: +
        - paragraph [ref=e326]: Funcionamos con un máximo de 16 niñas y niños por curso. Este tamaño permite un acompañamiento personalizado y una relación cercana entre estudiantes, docentes y familias.
      - listitem [ref=e327]:
        - button "📝 ¿Cómo es la evaluación? +" [ref=e328] [cursor=pointer]:
          - generic [ref=e329]: 📝
          - generic [ref=e330]: ¿Cómo es la evaluación?
          - generic [ref=e331]: +
        - paragraph [ref=e332]: "La evaluación es cualitativa y continua, basada en informes narrativos y portafolios. Observamos el desarrollo integral del niño: su pensamiento, sentimientos, voluntad y habilidades sociales. No usamos notas ni calificaciones, sino retroalimentación detallada que acompaña el proceso de aprendizaje."
      - listitem [ref=e333]:
        - button "📝 ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc? +" [ref=e334] [cursor=pointer]:
          - generic [ref=e335]: 📝
          - generic [ref=e336]: ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc?
          - generic [ref=e337]: +
        - generic:
          - paragraph [ref=e338]:
            - text: Significa que, la normativa chilena establece que los estudiantes de colegios sin reconocimiento deben rendir
            - strong [ref=e339]: Exámenes Libres de Validación de Estudios
            - text: en establecimientos designados por el Mineduc. Al aprobar, reciben sus certificados oficiales de curso o nivel, equivalentes a los de cualquier colegio reconocido. Es responsabilidad de cada familia realizar la inscripción de manera
            - strong [ref=e340]: online
            - text: o presencial en el
            - strong [ref=e341]: Departamento Provincial de Educación
            - text: por parte del padre/madre/tutor.
          - paragraph [ref=e342]:
            - text: "👉 Más información oficial en el sitio del Ministerio de Educación de Chile:"
            - link "Exámenes de Validación de Estudios – Ayuda Mineduc" [ref=e343] [cursor=pointer]:
              - /url: https://www.ayudamineduc.cl/ficha/examenes-libres-menores-de-18-anos-11
      - listitem [ref=e344]:
        - button "📊 ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC? +" [ref=e345] [cursor=pointer]:
          - generic [ref=e346]: 📊
          - generic [ref=e347]: ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC?
          - generic [ref=e348]: +
        - generic:
          - paragraph [ref=e349]:
            - text: Los estudiantes Waldorf en Chile suelen obtener
            - strong [ref=e350]: calificaciones de buenas a muy buenas
            - text: en los exámenes libres del Ministerio de Educación. La gran mayoría alcanza promedios superiores al aprobado, y cerca del
            - strong [ref=e351]: 90% obtiene notas entre 5,0 y 7,0
            - text: ", lo que corresponde a un desempeño bueno o sobresaliente según la escala chilena."
          - list [ref=e352]:
            - listitem [ref=e353]:
              - text: Las
              - strong [ref=e354]: reprobaciones son prácticamente inexistentes
              - text: en este grupo.
            - listitem [ref=e355]:
              - text: El rendimiento suele ser
              - strong [ref=e356]: igual o mejor
              - text: que el de estudiantes de otras modalidades alternativas.
            - listitem [ref=e357]: Los alumnos logran certificar sus estudios básicos y medios sin dificultades.
          - paragraph [ref=e358]:
            - text: Aunque la pedagogía Waldorf no se basa en pruebas tradicionales, los estudiantes cuentan con
            - strong [ref=e359]: herramientas sólidas de aprendizaje
            - text: que les permiten enfrentar con éxito las evaluaciones del Estado.
          - paragraph [ref=e360]:
            - text: "👉 Puedes leer más en estas fuentes:"
            - link "Estudio sobre educación alternativa (Scielo)" [ref=e361] [cursor=pointer]:
              - /url: http://www.scielo.org.pe/scielo.php?script=sci_arttext&pid=S1019-94032017000100001
            - text: "|"
            - link "Ciencia Latina" [ref=e362] [cursor=pointer]:
              - /url: https://ciencialatina.org/index.php/cienciala/article/view/6298
            - text: "|"
            - link "CIPER Chile" [ref=e363] [cursor=pointer]:
              - /url: https://www.ciperchile.cl/2021/10/08/la-educacion-alternativa-como-un-derecho/
            - text: "|"
            - link "Trinus - Rendimiento Waldorf" [ref=e364] [cursor=pointer]:
              - /url: https://trinus.org/el-rendimiento-academico-de-los-alumnos-waldorf-segun-pisa-y-otros-estudios/
            - text: "|"
            - link "La Tercera - Generación Waldorf" [ref=e365] [cursor=pointer]:
              - /url: https://www.latercera.com/noticia/generacion-waldorf/
      - listitem [ref=e366]:
        - button "🎨 ¿Hay talleres extracurriculares? +" [ref=e367] [cursor=pointer]:
          - generic [ref=e368]: 🎨
          - generic [ref=e369]: ¿Hay talleres extracurriculares?
          - generic [ref=e370]: +
        - paragraph [ref=e371]: Sí, ofrecemos experiencias en carpintería, arte y manualidades, cocina, música, cuentos, huerta, euritmia y movimiento. Estas actividades están integradas en la jornada escolar, entendiendo que el aprendizaje se vive con todo el ser.
      - listitem [ref=e372]:
        - button "🚍 ¿Hay transporte o alimentación disponible? +" [ref=e373] [cursor=pointer]:
          - generic [ref=e374]: 🚍
          - generic [ref=e375]: ¿Hay transporte o alimentación disponible?
          - generic [ref=e376]: +
        - paragraph [ref=e377]: Actualmente no ofrecemos transporte ni alimentación. Valoramos que las familias puedan acompañar a sus hijos al inicio y término del día. En cuanto a la alimentación, los niños traen su propio almuerzo, y promovemos hábitos saludables y conciencia sobre los alimentos.
      - listitem [ref=e378]:
        - button "🏡 ¿Puedo visitar el colegio antes de postular? +" [ref=e379] [cursor=pointer]:
          - generic [ref=e380]: 🏡
          - generic [ref=e381]: ¿Puedo visitar el colegio antes de postular?
          - generic [ref=e382]: +
        - paragraph [ref=e383]: ¡Por supuesto! Creemos que la mejor manera de conocer Trekan es viviendo una mañana en nuestra comunidad. Escríbenos por WhatsApp para agendar tu visita.
      - listitem [ref=e384]:
        - button "📅 ¿Cuándo puedo postular? +" [ref=e385] [cursor=pointer]:
          - generic [ref=e386]: 📅
          - generic [ref=e387]: ¿Cuándo puedo postular?
          - generic [ref=e388]: +
        - paragraph [ref=e389]: El proceso de admisión está abierto todo el año, siempre que haya cupos disponibles. Te recomendamos postular con anticipación para asegurar tu lugar.
      - listitem [ref=e390]:
        - button "💌 ¿Cómo me contacto rápidamente? +" [ref=e391] [cursor=pointer]:
          - generic [ref=e392]: 💌
          - generic [ref=e393]: ¿Cómo me contacto rápidamente?
          - generic [ref=e394]: +
        - paragraph [ref=e395]: Puedes escribirnos directamente a través del botón de WhatsApp que ves en pantalla o usar el formulario "Postula aquí" para que podamos enviarte toda la información.
  - generic [ref=e397]:
    - heading "📍 En contacto con Trekan" [level=2] [ref=e398]
    - paragraph [ref=e399]: La puerta de Trekan siempre está abierta. Escríbenos — respondemos rápido.
    - generic [ref=e400]:
      - generic [ref=e401]:
        - generic [ref=e402]:
          - heading "🏠 Dirección" [level=3] [ref=e403]
          - paragraph [ref=e404]:
            - text: Las Azaleas 96, Parque Ivian 1
            - text: Puerto Varas, Chile
        - generic [ref=e405]:
          - heading "📞 Teléfono" [level=3] [ref=e406]
          - paragraph [ref=e407]:
            - link "+56 9 6776 5106" [ref=e408] [cursor=pointer]:
              - /url: tel:+56967765106
        - generic [ref=e409]:
          - heading "✉️ Correo" [level=3] [ref=e410]
          - paragraph [ref=e411]:
            - link "admision@colegiowaldorftrekan.cl" [ref=e412] [cursor=pointer]:
              - /url: mailto:admision@colegiowaldorftrekan.cl
        - generic [ref=e413]:
          - heading "📱 Redes sociales" [level=3] [ref=e414]
          - generic [ref=e415]:
            - link "WhatsApp" [ref=e416] [cursor=pointer]:
              - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Colegio%20Waldorf%20Trekan
              - img [ref=e417]
            - link "Instagram" [ref=e419] [cursor=pointer]:
              - /url: https://www.instagram.com/waldorftrekanpv/
              - img [ref=e420]
            - link "Facebook" [ref=e422] [cursor=pointer]:
              - /url: https://www.facebook.com/profile.php?id=61573063135723
              - img [ref=e423]
        - link "📲 Guardar contacto en el celular" [ref=e426] [cursor=pointer]:
          - /url: contacto-trekan.vcf
      - generic [ref=e427]:
        - heading "✉️ Escríbenos directamente" [level=3] [ref=e428]
        - generic [ref=e429]:
          - generic [ref=e430]:
            - generic [ref=e431]:
              - generic [ref=e432]: Nombre *
              - textbox "Nombre *" [ref=e433]:
                - /placeholder: Tu nombre
            - generic [ref=e434]:
              - generic [ref=e435]: Email *
              - textbox "Email *" [ref=e436]:
                - /placeholder: tu@email.com
          - generic [ref=e437]:
            - generic [ref=e438]: Teléfono (opcional)
            - textbox "Teléfono (opcional)" [ref=e439]:
              - /placeholder: +56 9 XXXX XXXX
          - generic [ref=e440]:
            - generic [ref=e441]: Asunto *
            - combobox "Asunto *" [ref=e442]:
              - option "Selecciona un tema..." [disabled] [selected]
              - option "Admisión 2026"
              - option "Información general"
              - option "Visita al colegio"
              - option "Arriendo de salón"
              - option "Otro"
          - generic [ref=e443]:
            - generic [ref=e444]: Mensaje *
            - textbox "Mensaje *" [ref=e445]:
              - /placeholder: ¿En qué podemos ayudarte?
          - button "Enviar mensaje →" [ref=e446] [cursor=pointer]
          - paragraph
    - iframe [ref=e448]
    - paragraph [ref=e449]: La puerta de Trekan siempre está abierta.
  - generic [ref=e451]:
    - heading "📸 Síguenos en Instagram" [level=2] [ref=e452]
    - paragraph [ref=e453]:
      - text: El día a día de Trekan en imágenes.
      - link "@waldorftrekanpv" [ref=e454] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
    - generic [ref=e455]:
      - link "Ver Instagram de Waldorf Trekan" [ref=e456] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Comunidad Colegio Waldorf Trekan" [ref=e458]
        - generic [ref=e459]:
          - img [ref=e460]
          - generic [ref=e462]: "@waldorftrekanpv"
      - link "Foto comunidad Trekan" [ref=e463] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Actividad Colegio Waldorf Trekan" [ref=e465]
      - link "Foto comunidad Trekan" [ref=e467] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Niños Colegio Waldorf Trekan" [ref=e469]
      - link "Foto comunidad Trekan" [ref=e471] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Actividad Colegio Waldorf Trekan" [ref=e473]
      - link "Foto comunidad Trekan" [ref=e475] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Comunidad Colegio Waldorf Trekan" [ref=e477]
    - link "Seguir en Instagram" [ref=e480] [cursor=pointer]:
      - /url: https://www.instagram.com/waldorftrekanpv/
      - img [ref=e481]
      - text: Seguir en Instagram
  - contentinfo [ref=e483]:
    - generic [ref=e484]:
      - paragraph [ref=e485]: © 2026 Colegio Waldorf Trekan - Puerto Varas
      - paragraph [ref=e486]: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
      - link "Directorio de Recursos Waldorf y Antroposóficos en Chile" [ref=e488] [cursor=pointer]:
        - /url: recursos-waldorf-chile.html
  - dialog "Contacto WhatsApp":
    - generic:
      - img "Ivonne Parada A."
      - generic:
        - generic: Ivonne Parada A.
        - generic: Coordinadora General
      - button "Cerrar": ✕
    - generic:
      - paragraph: Hola 👋 Escríbeme directamente, con gusto respondo tus preguntas sobre el colegio o agenda tu visita.
      - link "Enviar mensaje":
        - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Colegio%20Waldorf%20Trekan
        - img
        - text: Enviar mensaje
  - button "Contactar por WhatsApp" [ref=e489] [cursor=pointer]:
    - img "WhatsApp Trekan" [ref=e490]
  - generic: ¿Tienes dudas? Pregúntame 🌱
  - button "Abrir asistente virtual Trekan" [ref=e491] [cursor=pointer]:
    - img
  - dialog:
    - generic:
      - generic:
        - generic:
          - img
        - generic:
          - heading [level=4]: Asistente Trekan
          - generic: En línea
      - generic:
        - button:
          - img
        - button: ×
    - generic:
      - generic:
        - textbox:
          - /placeholder: Escríbeme tu consulta...
        - button:
          - img
      - generic: Colegio Waldorf Trekan · Puerto Varas
  - dialog "Aviso de cookies" [ref=e492]:
    - paragraph [ref=e493]:
      - text: 🍪 Usamos cookies para mejorar tu visita.
      - link "Saber más" [ref=e494] [cursor=pointer]:
        - /url: https://policies.google.com/privacy
    - generic [ref=e495]:
      - button "Rechazar" [ref=e496] [cursor=pointer]
      - button "Aceptar" [ref=e497] [cursor=pointer]
  - img [ref=e500]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.beforeEach(async ({ page }) => {
  4  |   await page.goto('/index.html');
  5  | });
  6  | 
  7  | test.describe('Combinations & Integration (Tier 3)', () => {
  8  |   test('test_combo_whatsapp_cookie_banner: WhatsApp trigger shifts up when cookie banner is visible', async ({ page }) => {
  9  |     const banner = page.locator('#cookie-banner');
  10 |     const trigger = page.locator('#waTrigger');
  11 |     
  12 |     // Make the cookie banner visible programmatically (or wait, let's verify if the class visible is added)
  13 |     await page.evaluate(() => {
  14 |       const b = document.getElementById('cookie-banner');
  15 |       if (b) b.classList.add('visible');
  16 |     });
  17 |     
  18 |     // Verify style of trigger has transform translateY(-80px)
  19 |     const transform = await trigger.evaluate(el => window.getComputedStyle(el).transform);
  20 |     // Since transform in getComputedStyle returns matrix(1, 0, 0, 1, 0, -80) for translateY(-80px)
  21 |     expect(transform).toContain('matrix');
  22 |     expect(transform).toContain('-80');
  23 |   });
  24 | 
  25 |   test('test_combo_active_nav_highlighting: scrolling highlights current section link', async ({ page }) => {
  26 |     const pedagogiaSection = page.locator('#pedagogia');
  27 |     const pedagogiaLink = page.locator('a[href="index.html#pedagogia"]').first();
  28 |     
  29 |     // Scroll pedagogia section into view
  30 |     await pedagogiaSection.scrollIntoViewIfNeeded();
  31 |     await page.waitForTimeout(500); // wait for scroll highlight handler
  32 |     
  33 |     await expect(pedagogiaLink).toHaveClass(/active/);
  34 |   });
  35 | 
  36 |   test('test_combo_gallery_scroll_lock: opening image gallery modal locks body scroll', async ({ page }) => {
  37 |     const firstImg = page.locator('.news-image img, .news-gallery-item img, .cms-gallery-thumb img').first();
  38 |     
  39 |     // Click image to open modal
  40 |     await firstImg.click();
  41 |     await page.waitForTimeout(500);
  42 |     
  43 |     // Body should have overflow: hidden
  44 |     const overflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
  45 |     expect(overflow).toBe('hidden');
  46 |   });
  47 | 
  48 |   test('test_combo_mobile_menu_scroll_override: scrolling down does not hide navbar when mobile menu is active', async ({ page }) => {
  49 |     const navbar = page.locator('#navbar');
  50 |     const menuToggle = page.locator('#mobile-menu');
  51 |     const navMenu = page.locator('#nav-menu');
  52 |     
  53 |     // Open mobile menu
> 54 |     await menuToggle.click();
     |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  55 |     await expect(navMenu).toHaveClass(/active/);
  56 |     
  57 |     // Scroll down
  58 |     await page.evaluate(() => window.scrollTo(0, 500));
  59 |     await page.waitForTimeout(500);
  60 |     
  61 |     // Navbar should NOT hide (should not have class 'hide')
  62 |     await expect(navbar).not.toHaveClass(/hide/);
  63 |   });
  64 | });
  65 | 
```