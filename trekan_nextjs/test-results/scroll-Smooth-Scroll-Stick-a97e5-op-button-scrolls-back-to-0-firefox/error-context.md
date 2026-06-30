# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scroll.spec.ts >> Smooth Scroll & Sticky Nav (Tier 2) >> test_back_to_top_behavior: click back-to-top button scrolls back to 0
- Location: tests\scroll.spec.ts:50:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.back-to-top')
    - locator resolved to <button class="back-to-top" aria-label="Volver arriba">↑</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button aria-expanded="false" id="trekan-bot-bubble" class="trekan-bot-bubble" aria-controls="trekan-bot-panel" aria-label="Abrir asistente virtual Trekan">…</button> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button aria-expanded="false" id="trekan-bot-bubble" class="trekan-bot-bubble" aria-controls="trekan-bot-panel" aria-label="Abrir asistente virtual Trekan">…</button> intercepts pointer events
    - retrying click action
      - waiting 100ms
    31 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <button aria-expanded="false" id="trekan-bot-bubble" class="trekan-bot-bubble" aria-controls="trekan-bot-panel" aria-label="Abrir asistente virtual Trekan">…</button> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido principal" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e4]:
    - generic [ref=e6]:
      - heading "Colegio Waldorf Trekan" [level=1] [ref=e7]
      - paragraph [ref=e8]: Educación con el corazón, en armonía con la naturaleza
      - generic [ref=e9]:
        - link "Admisión 2026" [ref=e10] [cursor=pointer]:
          - /url: https://docs.google.com/forms/d/e/1FAIpQLSdXbiojPJFncN94G3AS5huINvHKjpv2xFLcEaMjsHiC8sHYSQ/viewform
        - link "Nuestra Pedagogía" [ref=e11] [cursor=pointer]:
          - /url: "#quienes-somos"
  - navigation [ref=e12]:
    - generic [ref=e13]:
      - link "Logo Trekan Trekan" [ref=e14] [cursor=pointer]:
        - /url: index.html
        - img "Logo Trekan" [ref=e16]
        - generic [ref=e17]: Trekan
      - list [ref=e18]:
        - listitem [ref=e19]:
          - link "Inicio" [ref=e20] [cursor=pointer]:
            - /url: index.html#inicio
        - listitem [ref=e21]:
          - link "Nosotros ▾" [ref=e22] [cursor=pointer]:
            - /url: index.html#quienes-somos
        - listitem [ref=e23]:
          - link "Admisión 2026 ▾" [ref=e24] [cursor=pointer]:
            - /url: index.html#admission
        - listitem [ref=e25]:
          - link "Arriendo de Salón" [ref=e26] [cursor=pointer]:
            - /url: arriendo-salon.html
        - listitem [ref=e27]:
          - link "Contacto" [ref=e28] [cursor=pointer]:
            - /url: index.html#contacto
        - listitem [ref=e29]:
          - link "🇪🇸 ES ▾" [ref=e30] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e31]: 🇪🇸
            - text: ES ▾
      - link "Conocer el proceso de admisión" [ref=e32] [cursor=pointer]:
        - /url: /admision.html
        - text: 🌿 Conocer admisión
  - generic [ref=e36]:
    - heading "Donde el niño camina con voluntad" [level=2] [ref=e37]
    - paragraph [ref=e38]:
      - text: En el corazón de
      - strong [ref=e39]: Puerto Varas
      - text: ", nace"
      - strong [ref=e40]: Trekan
      - text: ", una comunidad educativa inspirada en la"
      - strong [ref=e41]: pedagogía Waldorf
      - text: que acompaña a niñas y niños
      - strong [ref=e42]: de 3 a 14 años
      - text: en su desarrollo integral.
    - paragraph [ref=e43]:
      - strong [ref=e44]: Trekan
      - text: significa
      - emphasis [ref=e45]: caminante
      - text: "en mapudungun: un ser que decide encaminarse hacia el mundo… y hacia sí mismo."
    - generic [ref=e46]:
      - link "🌿 Conocer el proceso de admisión" [ref=e47] [cursor=pointer]:
        - /url: /admision.html
      - link "Conócenos" [ref=e48] [cursor=pointer]:
        - /url: "#quienes-somos"
  - generic [ref=e50]:
    - heading "Enfoque Pedagógico Waldorf" [level=2] [ref=e51]
    - paragraph [ref=e52]: Inspirados en Rudolf Steiner, entendemos al niño como un ser espiritual en evolución. Nuestra educación armoniza el **pensamiento, el sentir y la voluntad** a través del arte, el ritmo y el movimiento.
    - generic [ref=e53]:
      - generic [ref=e54]:
        - generic [ref=e55]:
          - img "Aprendizaje Vivencial" [ref=e56]
          - generic [ref=e57]: ✨
        - heading "Aprendizaje Vivencial" [level=3] [ref=e58]
        - paragraph [ref=e59]: Matemáticas, lenguaje e historia se viven con las manos, el corazón y la mente.
      - generic [ref=e60]:
        - generic [ref=e61]:
          - img "Maestro Guía" [ref=e62]
          - generic [ref=e63]: ✨
        - heading "Maestro Guía" [level=3] [ref=e64]
        - paragraph [ref=e65]: Acompaña al niño durante varios años, creando un vínculo profundo y seguro.
      - generic [ref=e66]:
        - generic [ref=e67]:
          - img "Conexión con la Naturaleza" [ref=e68]
          - generic [ref=e69]: ✨
        - heading "Conexión con la Naturaleza" [level=3] [ref=e70]
        - paragraph [ref=e71]: Huerta, carpintería, salidas al bosque y celebración de las estaciones.
      - generic [ref=e72]:
        - generic [ref=e73]:
          - img "Bloques Temáticos" [ref=e74]
          - generic [ref=e75]: ✨
        - heading "Bloques Temáticos" [level=3] [ref=e76]
        - paragraph [ref=e77]: "Contenidos integrados: arte, música, manualidades y movimiento."
  - generic [ref=e79]:
    - heading "Misión, Visión y Equipo" [level=2] [ref=e80]
    - generic [ref=e81]:
      - generic [ref=e82]:
        - img "Misión" [ref=e83]
        - generic [ref=e85]:
          - heading "Misión" [level=3] [ref=e86]
          - paragraph [ref=e87]: Formar personas libres, conscientes, creativas y comprometidas con su entorno, mediante una educación que armonice el conocimiento, el arte y la acción.
      - generic [ref=e88]:
        - img "Visión" [ref=e89]
        - generic [ref=e91]:
          - heading "Visión" [level=3] [ref=e92]
          - paragraph [ref=e93]: Ser una comunidad educativa referente en el sur de Chile, por su capacidad de cultivar el respeto, la belleza y el sentido profundo del aprendizaje.
      - generic [ref=e94]:
        - img "Valores" [ref=e95]
        - generic [ref=e97]:
          - heading "Valores" [level=3] [ref=e98]
          - paragraph [ref=e99]: Respeto, cuidado del entorno, trabajo colaborativo, diversidad, libertad responsable, verdad y belleza.
      - generic [ref=e100]:
        - heading "Equipo" [level=3] [ref=e101]
        - paragraph [ref=e102]:
          - strong [ref=e103]: "Yabel Painemil:"
          - text: Comunicadora Audiovisual, docente intercultural bilingüe, formación Waldorf básica y especialista en Gimnasia Bothmer.
        - paragraph [ref=e104]:
          - strong [ref=e105]: "Javiera Ortega:"
          - text: Profesora General Básica especialista en lenguaje, cursando formación Waldorf.
        - paragraph [ref=e106]:
          - strong [ref=e107]: "Hanna Lowen:"
          - text: Profesora de Inglés.
        - paragraph [ref=e108]:
          - strong [ref=e109]: "Matías Valiente:"
          - text: Profesor de Carpintería.
        - paragraph [ref=e110]:
          - strong [ref=e111]: "Sofía González Rodríguez:"
          - text: Profesora de Música.
        - paragraph [ref=e112]:
          - strong [ref=e113]: "Ivonne Parada:"
          - text: Familia Fundadora. Trabajadora Social UV, especialista en convivencia escolar con formación en peritaje social, polivagal, gestalt.
        - paragraph [ref=e114]:
          - strong [ref=e115]: "Sleater Martínez:"
          - text: Familia Fundadora. Educadora de Párvulos, cursando formación Waldorf en fundación arche.
        - paragraph [ref=e116]:
          - strong [ref=e117]: "Felipe Vivanco Cornejo:"
          - text: Familia Fundadora. Administrador Público UV, con formación en NICSP, Neurociencias, GYDP. Terapeuta, Escuela Arica.
        - paragraph [ref=e118]:
          - strong [ref=e119]: "Gerard Muñoz:"
          - text: Familia Fundadora. Ingeniero en Informática.
  - generic [ref=e121]:
    - heading "📅 Próximas Actividades" [level=2] [ref=e122]
    - paragraph [ref=e123]: Momentos importantes para nuestra comunidad. ¡Te esperamos!
    - generic [ref=e124]:
      - generic [ref=e125]:
        - generic [ref=e126]:
          - generic [ref=e127]: "29"
          - generic [ref=e128]: JUN
        - generic [ref=e129]:
          - generic [ref=e130]: Celebración
          - heading "Feriado San Pedro y San Pablo" [level=3] [ref=e131]
          - paragraph [ref=e132]: Día de descanso.
          - paragraph [ref=e134]: Un día de pausa y descanso para nuestra comunidad escolar.
      - link "Ver calendario" [ref=e136] [cursor=pointer]:
        - /url: actividades.html
    - generic [ref=e137]:
      - paragraph [ref=e138]: ¿Quieres participar o tienes dudas sobre alguna actividad?
      - link "💬 Consultar por WhatsApp" [ref=e139] [cursor=pointer]:
        - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20las%20próximas%20actividades%20de%20Trekan
  - generic [ref=e141]:
    - heading "🏡 Vida Comunitaria" [level=2] [ref=e142]
    - paragraph [ref=e143]: En Trekan, la comunidad es protagonista. Las familias participan activamente en la construcción del proyecto educativo.
    - generic [ref=e144]:
      - generic [ref=e145]: • Consejo Escolar
      - generic [ref=e146]: • Asambleas mensuales
      - generic [ref=e147]: • Celebraciones estacionales
      - generic [ref=e148]: • Comisiones de trabajo
      - generic [ref=e149]: • Talleres para padres
      - generic [ref=e150]: • Mantención del espacio
    - paragraph [ref=e151]:
      - text: Fomentamos una gestión participativa, horizontal y transparente, basada en la
      - strong [ref=e152]: trimembración social
      - text: ": pedagógica, administrativa y comunitaria."
  - generic [ref=e154]:
    - heading "📰 Noticias y Actualidad" [level=2] [ref=e155]
    - paragraph [ref=e156]: Mantente al día con las últimas novedades de nuestra comunidad educativa.
    - generic [ref=e157]:
      - generic [ref=e158]:
        - button "Click para ampliar imagen" [ref=e161] [cursor=pointer]
        - generic [ref=e162]:
          - generic [ref=e163]: 22 de Abril de 2026
          - 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=3] [ref=e164]'
          - paragraph [ref=e165]: "El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritmo diario en el hogar, comprendido como una respiración: momentos de actividad (inhalación) y momentos de descanso (exhalación), que brindan seguridad, contención y calidez a nuestros niños. Durante la jornada se abrió un espacio de diálogo cercano, donde las familias pudieron compartir sus conocimientos, experiencias e inquietudes. A partir de preguntas como ¿qué saben sobre la pedagogía Waldorf?, surgieron diversas reflexiones, dudas e intereses en torno a este enfoque educativo. Asimismo, se abordó el tema del uso de pantallas en la vida cotidiana de los niños, generando una conversación en torno a sus efectos, límites y desafíos dentro del hogar. Este espacio permitió fortalecer el vínculo entre familia y escuela, acogiendo las preguntas e inquietudes de la comunidad, y abriendo caminos para seguir profundizando en estos temas en futuros encuentros."
          - generic [ref=e166]:
            - button "Ver imagen 1" [ref=e167] [cursor=pointer]:
              - img "Foto 1" [ref=e169]
              - generic [ref=e170]: 🔍
            - button "Ver imagen 2" [ref=e171] [cursor=pointer]:
              - img "Foto 2" [ref=e173]
              - generic [ref=e174]: 🔍
            - button "Ver imagen 3" [ref=e175] [cursor=pointer]:
              - img "Foto 3" [ref=e177]
              - generic [ref=e178]: 🔍
      - generic [ref=e179]:
        - button "Click para ampliar imagen" [ref=e182] [cursor=pointer]
        - generic [ref=e183]:
          - generic [ref=e184]: 21 de junio de 2025
          - heading "Fiesta de la Luz" [level=3] [ref=e185]
          - paragraph [ref=e186]: En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz.
          - iframe [ref=e188]:
            
      - generic [ref=e189]:
        - button "Click para ampliar imagen" [ref=e192] [cursor=pointer]
        - generic [ref=e193]:
          - generic [ref=e194]: 5 de Marzo de 2025
          - heading "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [level=3] [ref=e195]
          - paragraph [ref=e196]: "Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se unieran para educar?"
          - generic [ref=e197]:
            - button "Ver imagen 1" [ref=e198] [cursor=pointer]:
              - img "Foto 1" [ref=e200]
              - generic [ref=e201]: 🔍
            - button "Ver imagen 2" [ref=e202] [cursor=pointer]:
              - img "Foto 2" [ref=e204]
              - generic [ref=e205]: 🔍
          - iframe [ref=e207]:
            
      - generic [ref=e208]:
        - button "Click para ampliar imagen" [ref=e211] [cursor=pointer]
        - generic [ref=e212]:
          - generic [ref=e213]: 20 de Febrero de 2025
          - heading "Construyendo y Embelleciendo Nuestro Colegio" [level=3] [ref=e214]
          - paragraph [ref=e215]: "En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir a nuestras niñas, niños y familias."
          - generic [ref=e216]:
            - button "Ver imagen 1" [ref=e217] [cursor=pointer]:
              - img "Foto 1" [ref=e219]
              - generic [ref=e220]: 🔍
            - button "Ver imagen 2" [ref=e221] [cursor=pointer]:
              - img "Foto 2" [ref=e223]
              - generic [ref=e224]: 🔍
  - generic [ref=e226]:
    - heading "📚 Propuesta Curricular" [level=2] [ref=e227]
    - paragraph [ref=e228]: Nuestro currículo se basa en el desarrollo evolutivo del niño, siguiendo el modelo de Tobias Richter y las bases nacionales, integrando arte, naturaleza y pensamiento.
    - generic [ref=e229]:
      - generic [ref=e230]: • Bloques temáticos integrados
      - generic [ref=e231]: • Evaluación cualitativa
      - generic [ref=e232]: • Portafolios personalizados
      - generic [ref=e233]: • Inglés
      - generic [ref=e234]: • Música
      - generic [ref=e235]: • Artes
      - generic [ref=e236]: • Carpintería
      - generic [ref=e237]: • Huerta
      - generic [ref=e238]: • Euritmia y movimiento
    - paragraph [ref=e239]: "El aprendizaje no es abstracto: se vive, se siente, se hace. Cada conocimiento se integra con la voluntad del niño."
  - generic [ref=e241]:
    - heading "Admisión 2026" [level=2] [ref=e242]
    - generic [ref=e243]:
      - heading "Valores 2026" [level=3] [ref=e244]
      - table [ref=e246]:
        - rowgroup [ref=e247]:
          - row "Concepto Valor Detalles" [ref=e248]:
            - columnheader "Concepto" [ref=e249]
            - columnheader "Valor" [ref=e250]
            - columnheader "Detalles" [ref=e251]
        - rowgroup [ref=e252]:
          - 'row "Matrícula $500.000 En 2 cuotas: enero y febrero. No reembolsable." [ref=e253]':
            - cell "Matrícula" [ref=e254]:
              - strong [ref=e255]: Matrícula
            - cell "$500.000" [ref=e256]
            - 'cell "En 2 cuotas: enero y febrero. No reembolsable." [ref=e257]'
          - row "Escolaridad Normal $330.000/mes Pago mensual, hasta el día 5 de cada mes." [ref=e258]:
            - cell "Escolaridad Normal" [ref=e259]:
              - strong [ref=e260]: Escolaridad Normal
            - cell "$330.000/mes" [ref=e261]
            - cell "Pago mensual, hasta el día 5 de cada mes." [ref=e262]
          - row "Responsabilidad Social $33.000 adicionales al mes Aporte voluntario que fortalece becas para familias que requieren apoyo." [ref=e263]:
            - cell "Responsabilidad Social" [ref=e264]:
              - strong [ref=e265]: Responsabilidad Social
            - cell "$33.000 adicionales al mes" [ref=e266]
            - cell "Aporte voluntario que fortalece becas para familias que requieren apoyo." [ref=e267]
          - 'row "Cuota de Materiales $160.000 Anual, en 2 cuotas: marzo y junio." [ref=e268]':
            - cell "Cuota de Materiales" [ref=e269]:
              - strong [ref=e270]: Cuota de Materiales
            - cell "$160.000" [ref=e271]
            - 'cell "Anual, en 2 cuotas: marzo y junio." [ref=e272]'
          - row "Cuota de incorporación $330.000 Una sola cuota." [ref=e273]:
            - cell "Cuota de incorporación" [ref=e274]:
              - strong [ref=e275]: Cuota de incorporación
            - cell "$330.000" [ref=e276]
            - cell "Una sola cuota." [ref=e277]
    - paragraph [ref=e279]:
      - strong [ref=e280]: Agradecemos
      - text: a todas las familias que pueden sostener el aporte de
      - emphasis [ref=e281]: Responsabilidad Social
      - text: . Cada diferencia contribuye a sostener becas y fortalecer nuestra comunidad educativa inclusiva.
    - generic [ref=e282]:
      - heading "Aranceles Diferenciados" [level=3] [ref=e283]
      - paragraph [ref=e284]: Si deseas participar en el proyecto pero necesitas un arancel diferenciado, conversaremos contigo con empatía. Evaluaremos tu situación socioeconómica y buscaremos opciones sostenibles, incluso con aporte en labores operativas o iniciativas según tus habilidades.
    - generic [ref=e285]:
      - heading "Política de Devoluciones" [level=3] [ref=e286]
      - list [ref=e287]:
        - listitem [ref=e288]:
          - text: ✓
          - strong [ref=e289]: "Antes de marzo:"
          - text: 100% de la escolaridad devuelta.
        - listitem [ref=e290]:
          - text: ✓
          - strong [ref=e291]: "Después de marzo, antes del 2° semestre:"
          - text: Devolución de la escolaridad del 2° semestre.
        - listitem [ref=e292]:
          - text: ✓
          - strong [ref=e293]: "Después del 2° semestre:"
          - text: No hay devoluciones.
        - listitem [ref=e294]:
          - text: ✓
          - strong [ref=e295]: "Matrícula:"
          - text: No reembolsable.
    - generic [ref=e296]:
      - heading "Seguro Escolar" [level=3] [ref=e297]
      - paragraph [ref=e298]: "No es obligatorio. Opciones disponibles:"
      - list [ref=e299]:
        - listitem [ref=e300]: ✓ Seguro de accidentes – Andes Salud
        - listitem [ref=e301]: ✓ Seguro de accidentes – Clínica Puerto Varas
      - paragraph [ref=e302]:
        - text: Si no contratas seguro, deberás firmar el
        - strong [ref=e303]: Mandato Parental sobre atención de urgencia
        - text: al momento de la matrícula.
    - generic [ref=e304]:
      - heading "Horarios" [level=3] [ref=e305]
      - paragraph [ref=e306]:
        - strong [ref=e307]: "Jornada:"
        - text: 8:00 a 14:00 hrs, de lunes a viernes.
    - generic [ref=e308]:
      - paragraph [ref=e309]: Elegir colegio no es una decisión rápida. Te invitamos a conocer cómo es realmente el proceso.
      - link "🌿 Conocer el proceso de admisión" [ref=e310] [cursor=pointer]:
        - /url: /admision.html
  - generic [ref=e312]:
    - heading "❓ Preguntas Frecuentes" [level=2] [ref=e313]
    - paragraph [ref=e314]: Aquí respondemos las consultas más comunes sobre nuestra comunidad educativa.
    - list "Preguntas frecuentes" [ref=e315]:
      - listitem [ref=e316]:
        - button "🌱 ¿Qué es la educación Waldorf? +" [ref=e317] [cursor=pointer]:
          - generic [ref=e318]: 🌱
          - generic [ref=e319]: ¿Qué es la educación Waldorf?
          - generic [ref=e320]: +
        - paragraph [ref=e321]: "La pedagogía Waldorf acompaña el desarrollo integral del niño —mente, corazón y manos— a través de experiencias vivenciales, arte, naturaleza y comunidad. No solo enseñamos contenidos: cultivamos curiosidad, creatividad y voluntad."
      - listitem [ref=e322]:
        - button "👩 ‍🏫 ¿Cuántos estudiantes hay por curso? +" [ref=e323] [cursor=pointer]:
          - generic [ref=e324]: 👩
          - generic [ref=e325]: ‍🏫 ¿Cuántos estudiantes hay por curso?
          - generic [ref=e326]: +
        - paragraph [ref=e327]: Funcionamos con un máximo de 16 niñas y niños por curso. Este tamaño permite un acompañamiento personalizado y una relación cercana entre estudiantes, docentes y familias.
      - listitem [ref=e328]:
        - button "📝 ¿Cómo es la evaluación? +" [ref=e329] [cursor=pointer]:
          - generic [ref=e330]: 📝
          - generic [ref=e331]: ¿Cómo es la evaluación?
          - generic [ref=e332]: +
        - paragraph [ref=e333]: "La evaluación es cualitativa y continua, basada en informes narrativos y portafolios. Observamos el desarrollo integral del niño: su pensamiento, sentimientos, voluntad y habilidades sociales. No usamos notas ni calificaciones, sino retroalimentación detallada que acompaña el proceso de aprendizaje."
      - listitem [ref=e334]:
        - button "📝 ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc? +" [ref=e335] [cursor=pointer]:
          - generic [ref=e336]: 📝
          - generic [ref=e337]: ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc?
          - generic [ref=e338]: +
        - generic:
          - paragraph [ref=e339]:
            - text: Significa que, la normativa chilena establece que los estudiantes de colegios sin reconocimiento deben rendir
            - strong [ref=e340]: Exámenes Libres de Validación de Estudios
            - text: en establecimientos designados por el Mineduc. Al aprobar, reciben sus certificados oficiales de curso o nivel, equivalentes a los de cualquier colegio reconocido. Es responsabilidad de cada familia realizar la inscripción de manera
            - strong [ref=e341]: online
            - text: o presencial en el
            - strong [ref=e342]: Departamento Provincial de Educación
            - text: por parte del padre/madre/tutor.
          - paragraph [ref=e343]:
            - text: "👉 Más información oficial en el sitio del Ministerio de Educación de Chile:"
            - link "Exámenes de Validación de Estudios – Ayuda Mineduc" [ref=e344] [cursor=pointer]:
              - /url: https://www.ayudamineduc.cl/ficha/examenes-libres-menores-de-18-anos-11
      - listitem [ref=e345]:
        - button "📊 ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC? +" [ref=e346] [cursor=pointer]:
          - generic [ref=e347]: 📊
          - generic [ref=e348]: ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC?
          - generic [ref=e349]: +
        - generic:
          - paragraph [ref=e350]:
            - text: Los estudiantes Waldorf en Chile suelen obtener
            - strong [ref=e351]: calificaciones de buenas a muy buenas
            - text: en los exámenes libres del Ministerio de Educación. La gran mayoría alcanza promedios superiores al aprobado, y cerca del
            - strong [ref=e352]: 90% obtiene notas entre 5,0 y 7,0
            - text: ", lo que corresponde a un desempeño bueno o sobresaliente según la escala chilena."
          - list [ref=e353]:
            - listitem [ref=e354]:
              - text: Las
              - strong [ref=e355]: reprobaciones son prácticamente inexistentes
              - text: en este grupo.
            - listitem [ref=e356]:
              - text: El rendimiento suele ser
              - strong [ref=e357]: igual o mejor
              - text: que el de estudiantes de otras modalidades alternativas.
            - listitem [ref=e358]: Los alumnos logran certificar sus estudios básicos y medios sin dificultades.
          - paragraph [ref=e359]:
            - text: Aunque la pedagogía Waldorf no se basa en pruebas tradicionales, los estudiantes cuentan con
            - strong [ref=e360]: herramientas sólidas de aprendizaje
            - text: que les permiten enfrentar con éxito las evaluaciones del Estado.
          - paragraph [ref=e361]:
            - text: "👉 Puedes leer más en estas fuentes:"
            - link "Estudio sobre educación alternativa (Scielo)" [ref=e362] [cursor=pointer]:
              - /url: http://www.scielo.org.pe/scielo.php?script=sci_arttext&pid=S1019-94032017000100001
            - text: "|"
            - link "Ciencia Latina" [ref=e363] [cursor=pointer]:
              - /url: https://ciencialatina.org/index.php/cienciala/article/view/6298
            - text: "|"
            - link "CIPER Chile" [ref=e364] [cursor=pointer]:
              - /url: https://www.ciperchile.cl/2021/10/08/la-educacion-alternativa-como-un-derecho/
            - text: "|"
            - link "Trinus - Rendimiento Waldorf" [ref=e365] [cursor=pointer]:
              - /url: https://trinus.org/el-rendimiento-academico-de-los-alumnos-waldorf-segun-pisa-y-otros-estudios/
            - text: "|"
            - link "La Tercera - Generación Waldorf" [ref=e366] [cursor=pointer]:
              - /url: https://www.latercera.com/noticia/generacion-waldorf/
      - listitem [ref=e367]:
        - button "🎨 ¿Hay talleres extracurriculares? +" [ref=e368] [cursor=pointer]:
          - generic [ref=e369]: 🎨
          - generic [ref=e370]: ¿Hay talleres extracurriculares?
          - generic [ref=e371]: +
        - paragraph [ref=e372]: Sí, ofrecemos experiencias en carpintería, arte y manualidades, cocina, música, cuentos, huerta, euritmia y movimiento. Estas actividades están integradas en la jornada escolar, entendiendo que el aprendizaje se vive con todo el ser.
      - listitem [ref=e373]:
        - button "🚍 ¿Hay transporte o alimentación disponible? +" [ref=e374] [cursor=pointer]:
          - generic [ref=e375]: 🚍
          - generic [ref=e376]: ¿Hay transporte o alimentación disponible?
          - generic [ref=e377]: +
        - paragraph [ref=e378]: Actualmente no ofrecemos transporte ni alimentación. Valoramos que las familias puedan acompañar a sus hijos al inicio y término del día. En cuanto a la alimentación, los niños traen su propio almuerzo, y promovemos hábitos saludables y conciencia sobre los alimentos.
      - listitem [ref=e379]:
        - button "🏡 ¿Puedo visitar el colegio antes de postular? +" [ref=e380] [cursor=pointer]:
          - generic [ref=e381]: 🏡
          - generic [ref=e382]: ¿Puedo visitar el colegio antes de postular?
          - generic [ref=e383]: +
        - paragraph [ref=e384]: ¡Por supuesto! Creemos que la mejor manera de conocer Trekan es viviendo una mañana en nuestra comunidad. Escríbenos por WhatsApp para agendar tu visita.
      - listitem [ref=e385]:
        - button "📅 ¿Cuándo puedo postular? +" [ref=e386] [cursor=pointer]:
          - generic [ref=e387]: 📅
          - generic [ref=e388]: ¿Cuándo puedo postular?
          - generic [ref=e389]: +
        - paragraph [ref=e390]: El proceso de admisión está abierto todo el año, siempre que haya cupos disponibles. Te recomendamos postular con anticipación para asegurar tu lugar.
      - listitem [ref=e391]:
        - button "💌 ¿Cómo me contacto rápidamente? +" [ref=e392] [cursor=pointer]:
          - generic [ref=e393]: 💌
          - generic [ref=e394]: ¿Cómo me contacto rápidamente?
          - generic [ref=e395]: +
        - paragraph [ref=e396]: Puedes escribirnos directamente a través del botón de WhatsApp que ves en pantalla o usar el formulario "Postula aquí" para que podamos enviarte toda la información.
  - generic [ref=e398]:
    - heading "📍 En contacto con Trekan" [level=2] [ref=e399]
    - paragraph [ref=e400]: La puerta de Trekan siempre está abierta. Escríbenos — respondemos rápido.
    - generic [ref=e401]:
      - generic [ref=e402]:
        - generic [ref=e403]:
          - heading "🏠 Dirección" [level=3] [ref=e404]
          - paragraph [ref=e405]:
            - text: Las Azaleas 96, Parque Ivian 1
            - text: Puerto Varas, Chile
        - generic [ref=e406]:
          - heading "📞 Teléfono" [level=3] [ref=e407]
          - paragraph [ref=e408]:
            - link "+56 9 6776 5106" [ref=e409] [cursor=pointer]:
              - /url: tel:+56967765106
        - generic [ref=e410]:
          - heading "✉️ Correo" [level=3] [ref=e411]
          - paragraph [ref=e412]:
            - link "admision@colegiowaldorftrekan.cl" [ref=e413] [cursor=pointer]:
              - /url: mailto:admision@colegiowaldorftrekan.cl
        - generic [ref=e414]:
          - heading "📱 Redes sociales" [level=3] [ref=e415]
          - generic [ref=e416]:
            - link "WhatsApp" [ref=e417] [cursor=pointer]:
              - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Colegio%20Waldorf%20Trekan
              - img [ref=e418]
            - link "Instagram" [ref=e420] [cursor=pointer]:
              - /url: https://www.instagram.com/waldorftrekanpv/
              - img [ref=e421]
            - link "Facebook" [ref=e423] [cursor=pointer]:
              - /url: https://www.facebook.com/profile.php?id=61573063135723
              - img [ref=e424]
        - link "📲 Guardar contacto en el celular" [ref=e427] [cursor=pointer]:
          - /url: contacto-trekan.vcf
      - generic [ref=e428]:
        - heading "✉️ Escríbenos directamente" [level=3] [ref=e429]
        - generic [ref=e430]:
          - generic [ref=e431]:
            - generic [ref=e432]:
              - generic [ref=e433]: Nombre *
              - textbox "Nombre *" [ref=e434]:
                - /placeholder: Tu nombre
            - generic [ref=e435]:
              - generic [ref=e436]: Email *
              - textbox "Email *" [ref=e437]:
                - /placeholder: tu@email.com
          - generic [ref=e438]:
            - generic [ref=e439]: Teléfono (opcional)
            - textbox "Teléfono (opcional)" [ref=e440]:
              - /placeholder: +56 9 XXXX XXXX
          - generic [ref=e441]:
            - generic [ref=e442]: Asunto *
            - combobox "Asunto *" [ref=e443]:
              - option "Selecciona un tema..." [disabled] [selected]
              - option "Admisión 2026"
              - option "Información general"
              - option "Visita al colegio"
              - option "Arriendo de salón"
              - option "Otro"
          - generic [ref=e444]:
            - generic [ref=e445]: Mensaje *
            - textbox "Mensaje *" [ref=e446]:
              - /placeholder: ¿En qué podemos ayudarte?
          - button "Enviar mensaje →" [ref=e447] [cursor=pointer]
          - paragraph
    - iframe [ref=e449]:
      
    - paragraph [ref=e450]: La puerta de Trekan siempre está abierta.
  - generic [ref=e452]:
    - heading "📸 Síguenos en Instagram" [level=2] [ref=e453]
    - paragraph [ref=e454]:
      - text: El día a día de Trekan en imágenes.
      - link "@waldorftrekanpv" [ref=e455] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
    - generic [ref=e456]:
      - link "Ver Instagram de Waldorf Trekan" [ref=e457] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Comunidad Colegio Waldorf Trekan" [ref=e459]
        - generic [ref=e460]:
          - img [ref=e461]
          - generic [ref=e463]: "@waldorftrekanpv"
      - link "Foto comunidad Trekan" [ref=e464] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Actividad Colegio Waldorf Trekan" [ref=e466]
      - link "Foto comunidad Trekan" [ref=e468] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Niños Colegio Waldorf Trekan" [ref=e470]
      - link "Foto comunidad Trekan" [ref=e472] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Actividad Colegio Waldorf Trekan" [ref=e474]
      - link "Foto comunidad Trekan" [ref=e476] [cursor=pointer]:
        - /url: https://www.instagram.com/waldorftrekanpv/
        - img "Comunidad Colegio Waldorf Trekan" [ref=e478]
    - link "Seguir en Instagram" [ref=e481] [cursor=pointer]:
      - /url: https://www.instagram.com/waldorftrekanpv/
      - img [ref=e482]
      - text: Seguir en Instagram
  - contentinfo [ref=e484]:
    - generic [ref=e485]:
      - paragraph [ref=e486]: © 2026 Colegio Waldorf Trekan - Puerto Varas
      - paragraph [ref=e487]: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
      - link "Directorio de Recursos Waldorf y Antroposóficos en Chile" [ref=e489] [cursor=pointer]:
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
  - button "Contactar por WhatsApp" [ref=e490] [cursor=pointer]:
    - img "WhatsApp Trekan" [ref=e491]
  - generic: ¿Tienes dudas? Pregúntame 🌱
  - button "Abrir asistente virtual Trekan" [ref=e492] [cursor=pointer]:
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
  - dialog "Aviso de cookies" [ref=e493]:
    - paragraph [ref=e494]:
      - text: 🍪 Usamos cookies para mejorar tu visita.
      - link "Saber más" [ref=e495] [cursor=pointer]:
        - /url: https://policies.google.com/privacy
    - generic [ref=e496]:
      - button "Rechazar" [ref=e497] [cursor=pointer]
      - button "Aceptar" [ref=e498] [cursor=pointer]
  - button "Volver arriba" [ref=e499] [cursor=pointer]: ↑
  - img [ref=e502]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.beforeEach(async ({ page }) => {
  4   |   await page.goto('/index.html');
  5   | });
  6   | 
  7   | test.describe('Smooth Scroll & Sticky Nav (Tier 1)', () => {
  8   |   test('test_scroll_progress_rendered: progress bar should exist', async ({ page }) => {
  9   |     const progress = page.locator('#scroll-progress');
  10  |     await expect(progress).toBeAttached();
  11  |   });
  12  | 
  13  |   test('test_sticky_nav_rendered: navbar should exist', async ({ page }) => {
  14  |     const navbar = page.locator('#navbar');
  15  |     await expect(navbar).toBeVisible();
  16  |   });
  17  | 
  18  |   test('test_back_to_top_present: back-to-top button should be appended to body', async ({ page }) => {
  19  |     const btn = page.locator('.back-to-top');
  20  |     await expect(btn).toBeAttached();
  21  |   });
  22  | 
  23  |   test('test_nav_anchors_present: verify scroll anchors are rendered', async ({ page }) => {
  24  |     const anchors = page.locator('a[href^="#"]');
  25  |     const count = await anchors.count();
  26  |     expect(count).toBeGreaterThanOrEqual(1);
  27  |   });
  28  | 
  29  |   test('test_lang_switcher_present: verify language selection dropdown is rendered', async ({ page }) => {
  30  |     const dropdown = page.locator('.lang-dropdown');
  31  |     await expect(dropdown).toBeVisible();
  32  |   });
  33  | });
  34  | 
  35  | test.describe('Smooth Scroll & Sticky Nav (Tier 2)', () => {
  36  |   test('test_scroll_offset_navigation: clicking anchor navigates and offsets for navbar', async ({ page }) => {
  37  |     const anchor = page.locator('a[href="index.html#pedagogia"]');
  38  |     
  39  |     // We scroll down using the anchor click
  40  |     await anchor.click();
  41  |     
  42  |     // Wait for scroll to stabilize
  43  |     await page.waitForTimeout(1000);
  44  |     
  45  |     // Check scroll position is roughly matching the target element's top position minus navbar offset
  46  |     const scrollY = await page.evaluate(() => window.scrollY);
  47  |     expect(scrollY).toBeGreaterThan(0);
  48  |   });
  49  | 
  50  |   test('test_back_to_top_behavior: click back-to-top button scrolls back to 0', async ({ page }) => {
  51  |     const btn = page.locator('.back-to-top');
  52  |     
  53  |     // Scroll down first
  54  |     await page.evaluate(() => window.scrollTo(0, 500));
  55  |     await page.waitForTimeout(500);
  56  |     
  57  |     // Check it's visible now
  58  |     await expect(btn).toBeVisible();
  59  |     
  60  |     // Click back to top
> 61  |     await btn.click();
      |               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  62  |     await page.waitForTimeout(1000);
  63  |     
  64  |     const scrollY = await page.evaluate(() => window.scrollY);
  65  |     expect(scrollY).toBe(0);
  66  |   });
  67  | 
  68  |   test('test_scroll_progress_update: progress bar width updates on scroll', async ({ page }) => {
  69  |     const progress = page.locator('#scroll-progress');
  70  |     
  71  |     // Initial scroll progress width
  72  |     const initialWidth = await progress.evaluate(el => el.style.width);
  73  |     
  74  |     // Scroll down
  75  |     await page.evaluate(() => window.scrollTo(0, 1000));
  76  |     await page.waitForTimeout(500);
  77  |     
  78  |     const finalWidth = await progress.evaluate(el => el.style.width);
  79  |     expect(finalWidth).not.toBe(initialWidth);
  80  |   });
  81  | 
  82  |   test('test_navbar_hide_scroll_down: scrolling down past 300px hides navbar', async ({ page }) => {
  83  |     const navbar = page.locator('#navbar');
  84  |     
  85  |     // Scroll down past 300px
  86  |     await page.evaluate(() => {
  87  |       window.scrollTo(0, 500);
  88  |     });
  89  |     // Wait for throttled scroll handler
  90  |     await page.waitForTimeout(500);
  91  |     
  92  |     await expect(navbar).toHaveClass(/hide/);
  93  |   });
  94  | 
  95  |   test('test_navbar_show_scroll_up: scrolling back up reveals navbar', async ({ page }) => {
  96  |     const navbar = page.locator('#navbar');
  97  |     
  98  |     // Scroll down first
  99  |     await page.evaluate(() => window.scrollTo(0, 500));
  100 |     await page.waitForTimeout(500);
  101 |     await expect(navbar).toHaveClass(/hide/);
  102 |     
  103 |     // Scroll up
  104 |     await page.evaluate(() => window.scrollTo(0, 100));
  105 |     await page.waitForTimeout(500);
  106 |     
  107 |     await expect(navbar).not.toHaveClass(/hide/);
  108 |   });
  109 | });
  110 | 
```