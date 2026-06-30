# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: whatsapp.spec.ts >> WhatsApp Float Widget (Tier 2) >> test_whatsapp_attention_badge_timer: badge is created and is visible initially
- Location: tests\whatsapp.spec.ts:104:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.wa-badge')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.wa-badge')

```

```yaml
- link "Saltar al contenido principal":
  - /url: "#main-content"
- banner:
  - heading "Colegio Waldorf Trekan" [level=1]
  - paragraph: Educación con el corazón, en armonía con la naturaleza
  - link "Admisión 2026":
    - /url: https://docs.google.com/forms/d/e/1FAIpQLSdXbiojPJFncN94G3AS5huINvHKjpv2xFLcEaMjsHiC8sHYSQ/viewform
  - link "Nuestra Pedagogía":
    - /url: "#quienes-somos"
- navigation:
  - link "Logo Trekan Trekan":
    - /url: index.html
    - img "Logo Trekan"
    - text: Trekan
  - list:
    - listitem:
      - link "Inicio":
        - /url: index.html#inicio
    - listitem:
      - link "Nosotros ▾":
        - /url: index.html#quienes-somos
    - listitem:
      - link "Admisión 2026 ▾":
        - /url: index.html#admission
    - listitem:
      - link "Arriendo de Salón":
        - /url: arriendo-salon.html
    - listitem:
      - link "Contacto":
        - /url: index.html#contacto
    - listitem:
      - link "🇪🇸 ES ▾":
        - /url: "#"
  - link "Conocer el proceso de admisión":
    - /url: /admision.html
    - text: 🌿 Conocer admisión
- heading "Donde el niño camina con voluntad" [level=2]
- paragraph:
  - text: En el corazón de
  - strong: Puerto Varas
  - text: ", nace"
  - strong: Trekan
  - text: ", una comunidad educativa inspirada en la"
  - strong: pedagogía Waldorf
  - text: que acompaña a niñas y niños
  - strong: de 3 a 14 años
  - text: en su desarrollo integral.
- paragraph:
  - strong: Trekan
  - text: significa
  - emphasis: caminante
  - text: "en mapudungun: un ser que decide encaminarse hacia el mundo… y hacia sí mismo."
- link "🌿 Conocer el proceso de admisión":
  - /url: /admision.html
- link "Conócenos":
  - /url: "#quienes-somos"
- heading "Enfoque Pedagógico Waldorf" [level=2]
- paragraph: Inspirados en Rudolf Steiner, entendemos al niño como un ser espiritual en evolución. Nuestra educación armoniza el **pensamiento, el sentir y la voluntad** a través del arte, el ritmo y el movimiento.
- img "Aprendizaje Vivencial"
- text: ✨
- heading "Aprendizaje Vivencial" [level=3]
- paragraph: Matemáticas, lenguaje e historia se viven con las manos, el corazón y la mente.
- img "Maestro Guía"
- text: ✨
- heading "Maestro Guía" [level=3]
- paragraph: Acompaña al niño durante varios años, creando un vínculo profundo y seguro.
- img "Conexión con la Naturaleza"
- text: ✨
- heading "Conexión con la Naturaleza" [level=3]
- paragraph: Huerta, carpintería, salidas al bosque y celebración de las estaciones.
- img "Bloques Temáticos"
- text: ✨
- heading "Bloques Temáticos" [level=3]
- paragraph: "Contenidos integrados: arte, música, manualidades y movimiento."
- heading "Misión, Visión y Equipo" [level=2]
- img "Misión"
- heading "Misión" [level=3]
- paragraph: Formar personas libres, conscientes, creativas y comprometidas con su entorno, mediante una educación que armonice el conocimiento, el arte y la acción.
- img "Visión"
- heading "Visión" [level=3]
- paragraph: Ser una comunidad educativa referente en el sur de Chile, por su capacidad de cultivar el respeto, la belleza y el sentido profundo del aprendizaje.
- img "Valores"
- heading "Valores" [level=3]
- paragraph: Respeto, cuidado del entorno, trabajo colaborativo, diversidad, libertad responsable, verdad y belleza.
- heading "Equipo" [level=3]
- paragraph:
  - strong: "Yabel Painemil:"
  - text: Comunicadora Audiovisual, docente intercultural bilingüe, formación Waldorf básica y especialista en Gimnasia Bothmer.
- paragraph:
  - strong: "Javiera Ortega:"
  - text: Profesora General Básica especialista en lenguaje, cursando formación Waldorf.
- paragraph:
  - strong: "Hanna Lowen:"
  - text: Profesora de Inglés.
- paragraph:
  - strong: "Matías Valiente:"
  - text: Profesor de Carpintería.
- paragraph:
  - strong: "Sofía González Rodríguez:"
  - text: Profesora de Música.
- paragraph:
  - strong: "Ivonne Parada:"
  - text: Familia Fundadora. Trabajadora Social UV, especialista en convivencia escolar con formación en peritaje social, polivagal, gestalt.
- paragraph:
  - strong: "Sleater Martínez:"
  - text: Familia Fundadora. Educadora de Párvulos, cursando formación Waldorf en fundación arche.
- paragraph:
  - strong: "Felipe Vivanco Cornejo:"
  - text: Familia Fundadora. Administrador Público UV, con formación en NICSP, Neurociencias, GYDP. Terapeuta, Escuela Arica.
- paragraph:
  - strong: "Gerard Muñoz:"
  - text: Familia Fundadora. Ingeniero en Informática.
- heading "📅 Próximas Actividades" [level=2]
- paragraph: Momentos importantes para nuestra comunidad. ¡Te esperamos!
- text: 29 JUN Celebración
- heading "Feriado San Pedro y San Pablo" [level=3]
- paragraph: Día de descanso.
- paragraph: Un día de pausa y descanso para nuestra comunidad escolar.
- link "Ver calendario":
  - /url: actividades.html
- paragraph: ¿Quieres participar o tienes dudas sobre alguna actividad?
- link "💬 Consultar por WhatsApp":
  - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20las%20próximas%20actividades%20de%20Trekan
- heading "🏡 Vida Comunitaria" [level=2]
- paragraph: En Trekan, la comunidad es protagonista. Las familias participan activamente en la construcción del proyecto educativo.
- text: • Consejo Escolar • Asambleas mensuales • Celebraciones estacionales • Comisiones de trabajo • Talleres para padres • Mantención del espacio
- paragraph:
  - text: Fomentamos una gestión participativa, horizontal y transparente, basada en la
  - strong: trimembración social
  - text: ": pedagógica, administrativa y comunitaria."
- heading "📰 Noticias y Actualidad" [level=2]
- paragraph: Mantente al día con las últimas novedades de nuestra comunidad educativa.
- button "Click para ampliar imagen"
- text: 22 de Abril de 2026
- 'heading "Escuela para Padres: \"El Ritmo y la Respiración en el Hogar\"" [level=3]'
- paragraph: "El otoño nos invita a volver la mirada hacia el interior. En este encuentro de Escuela para Padres, nos reunimos para reflexionar en torno al ritmo diario en el hogar, comprendido como una respiración: momentos de actividad (inhalación) y momentos de descanso (exhalación), que brindan seguridad, contención y calidez a nuestros niños. Durante la jornada se abrió un espacio de diálogo cercano, donde las familias pudieron compartir sus conocimientos, experiencias e inquietudes. A partir de preguntas como ¿qué saben sobre la pedagogía Waldorf?, surgieron diversas reflexiones, dudas e intereses en torno a este enfoque educativo. Asimismo, se abordó el tema del uso de pantallas en la vida cotidiana de los niños, generando una conversación en torno a sus efectos, límites y desafíos dentro del hogar. Este espacio permitió fortalecer el vínculo entre familia y escuela, acogiendo las preguntas e inquietudes de la comunidad, y abriendo caminos para seguir profundizando en estos temas en futuros encuentros."
- button "Ver imagen 1":
  - img "Foto 1"
  - text: 🔍
- button "Ver imagen 2":
  - img "Foto 2"
  - text: 🔍
- button "Ver imagen 3":
  - img "Foto 3"
  - text: 🔍
- button "Click para ampliar imagen"
- text: 21 de junio de 2025
- heading "Fiesta de la Luz" [level=3]
- paragraph: En el corazón del invierno, cuando las noches son más largas y la luz del sol escasea, nuestra comunidad se reúne para celebrar la Fiesta de la Luz.
- iframe
- button "Click para ampliar imagen"
- text: 5 de Marzo de 2025
- heading "El inicio de un sueño – Inauguración del Colegio Waldorf Trekan" [level=3]
- paragraph: "Todo comenzó con una pregunta sencilla pero poderosa: ¿Y si nuestros niños pudieran aprender en un lugar donde la naturaleza, el arte y la vida se unieran para educar?"
- button "Ver imagen 1":
  - img "Foto 1"
  - text: 🔍
- button "Ver imagen 2":
  - img "Foto 2"
  - text: 🔍
- iframe
- button "Click para ampliar imagen"
- text: 20 de Febrero de 2025
- heading "Construyendo y Embelleciendo Nuestro Colegio" [level=3]
- paragraph: "En días recientes, nuestra Comisión de Obras y Mantenimiento se reunió con un objetivo claro: dejar nuestro colegio listo y lleno de vida para recibir a nuestras niñas, niños y familias."
- button "Ver imagen 1":
  - img "Foto 1"
  - text: 🔍
- button "Ver imagen 2":
  - img "Foto 2"
  - text: 🔍
- heading "📚 Propuesta Curricular" [level=2]
- paragraph: Nuestro currículo se basa en el desarrollo evolutivo del niño, siguiendo el modelo de Tobias Richter y las bases nacionales, integrando arte, naturaleza y pensamiento.
- text: • Bloques temáticos integrados • Evaluación cualitativa • Portafolios personalizados • Inglés • Música • Artes • Carpintería • Huerta • Euritmia y movimiento
- paragraph: "El aprendizaje no es abstracto: se vive, se siente, se hace. Cada conocimiento se integra con la voluntad del niño."
- heading "Admisión 2026" [level=2]
- heading "Valores 2026" [level=3]
- table:
  - rowgroup:
    - row "Concepto Valor Detalles":
      - columnheader "Concepto"
      - columnheader "Valor"
      - columnheader "Detalles"
  - rowgroup:
    - 'row "Matrícula $500.000 En 2 cuotas: enero y febrero. No reembolsable."':
      - cell "Matrícula":
        - strong: Matrícula
      - cell "$500.000"
      - 'cell "En 2 cuotas: enero y febrero. No reembolsable."'
    - row "Escolaridad Normal $330.000/mes Pago mensual, hasta el día 5 de cada mes.":
      - cell "Escolaridad Normal":
        - strong: Escolaridad Normal
      - cell "$330.000/mes"
      - cell "Pago mensual, hasta el día 5 de cada mes."
    - row "Responsabilidad Social $33.000 adicionales al mes Aporte voluntario que fortalece becas para familias que requieren apoyo.":
      - cell "Responsabilidad Social":
        - strong: Responsabilidad Social
      - cell "$33.000 adicionales al mes"
      - cell "Aporte voluntario que fortalece becas para familias que requieren apoyo."
    - 'row "Cuota de Materiales $160.000 Anual, en 2 cuotas: marzo y junio."':
      - cell "Cuota de Materiales":
        - strong: Cuota de Materiales
      - cell "$160.000"
      - 'cell "Anual, en 2 cuotas: marzo y junio."'
    - row "Cuota de incorporación $330.000 Una sola cuota.":
      - cell "Cuota de incorporación":
        - strong: Cuota de incorporación
      - cell "$330.000"
      - cell "Una sola cuota."
- paragraph:
  - strong: Agradecemos
  - text: a todas las familias que pueden sostener el aporte de
  - emphasis: Responsabilidad Social
  - text: . Cada diferencia contribuye a sostener becas y fortalecer nuestra comunidad educativa inclusiva.
- heading "Aranceles Diferenciados" [level=3]
- paragraph: Si deseas participar en el proyecto pero necesitas un arancel diferenciado, conversaremos contigo con empatía. Evaluaremos tu situación socioeconómica y buscaremos opciones sostenibles, incluso con aporte en labores operativas o iniciativas según tus habilidades.
- heading "Política de Devoluciones" [level=3]
- list:
  - listitem:
    - text: ✓
    - strong: "Antes de marzo:"
    - text: 100% de la escolaridad devuelta.
  - listitem:
    - text: ✓
    - strong: "Después de marzo, antes del 2° semestre:"
    - text: Devolución de la escolaridad del 2° semestre.
  - listitem:
    - text: ✓
    - strong: "Después del 2° semestre:"
    - text: No hay devoluciones.
  - listitem:
    - text: ✓
    - strong: "Matrícula:"
    - text: No reembolsable.
- heading "Seguro Escolar" [level=3]
- paragraph: "No es obligatorio. Opciones disponibles:"
- list:
  - listitem: ✓ Seguro de accidentes – Andes Salud
  - listitem: ✓ Seguro de accidentes – Clínica Puerto Varas
- paragraph:
  - text: Si no contratas seguro, deberás firmar el
  - strong: Mandato Parental sobre atención de urgencia
  - text: al momento de la matrícula.
- heading "Horarios" [level=3]
- paragraph:
  - strong: "Jornada:"
  - text: 8:00 a 14:00 hrs, de lunes a viernes.
- paragraph: Elegir colegio no es una decisión rápida. Te invitamos a conocer cómo es realmente el proceso.
- link "🌿 Conocer el proceso de admisión":
  - /url: /admision.html
- heading "❓ Preguntas Frecuentes" [level=2]
- paragraph: Aquí respondemos las consultas más comunes sobre nuestra comunidad educativa.
- list "Preguntas frecuentes":
  - listitem:
    - button "🌱 ¿Qué es la educación Waldorf? +"
    - paragraph: "La pedagogía Waldorf acompaña el desarrollo integral del niño —mente, corazón y manos— a través de experiencias vivenciales, arte, naturaleza y comunidad. No solo enseñamos contenidos: cultivamos curiosidad, creatividad y voluntad."
  - listitem:
    - button "👩 ‍🏫 ¿Cuántos estudiantes hay por curso? +"
    - paragraph: Funcionamos con un máximo de 16 niñas y niños por curso. Este tamaño permite un acompañamiento personalizado y una relación cercana entre estudiantes, docentes y familias.
  - listitem:
    - button "📝 ¿Cómo es la evaluación? +"
    - paragraph: "La evaluación es cualitativa y continua, basada en informes narrativos y portafolios. Observamos el desarrollo integral del niño: su pensamiento, sentimientos, voluntad y habilidades sociales. No usamos notas ni calificaciones, sino retroalimentación detallada que acompaña el proceso de aprendizaje."
  - listitem:
    - button "📝 ¿Qué significa que nuestro establecimiento no tenga reconocimiento oficial del Mineduc? +"
    - paragraph:
      - text: Significa que, la normativa chilena establece que los estudiantes de colegios sin reconocimiento deben rendir
      - strong: Exámenes Libres de Validación de Estudios
      - text: en establecimientos designados por el Mineduc. Al aprobar, reciben sus certificados oficiales de curso o nivel, equivalentes a los de cualquier colegio reconocido. Es responsabilidad de cada familia realizar la inscripción de manera
      - strong: online
      - text: o presencial en el
      - strong: Departamento Provincial de Educación
      - text: por parte del padre/madre/tutor.
    - paragraph:
      - text: "👉 Más información oficial en el sitio del Ministerio de Educación de Chile:"
      - link "Exámenes de Validación de Estudios – Ayuda Mineduc":
        - /url: https://www.ayudamineduc.cl/ficha/examenes-libres-menores-de-18-anos-11
  - listitem:
    - button "📊 ¿Cómo les va a los alumnos Waldorf en los exámenes libres del MINEDUC? +"
    - paragraph:
      - text: Los estudiantes Waldorf en Chile suelen obtener
      - strong: calificaciones de buenas a muy buenas
      - text: en los exámenes libres del Ministerio de Educación. La gran mayoría alcanza promedios superiores al aprobado, y cerca del
      - strong: 90% obtiene notas entre 5,0 y 7,0
      - text: ", lo que corresponde a un desempeño bueno o sobresaliente según la escala chilena."
    - list:
      - listitem:
        - text: Las
        - strong: reprobaciones son prácticamente inexistentes
        - text: en este grupo.
      - listitem:
        - text: El rendimiento suele ser
        - strong: igual o mejor
        - text: que el de estudiantes de otras modalidades alternativas.
      - listitem: Los alumnos logran certificar sus estudios básicos y medios sin dificultades.
    - paragraph:
      - text: Aunque la pedagogía Waldorf no se basa en pruebas tradicionales, los estudiantes cuentan con
      - strong: herramientas sólidas de aprendizaje
      - text: que les permiten enfrentar con éxito las evaluaciones del Estado.
    - paragraph:
      - text: "👉 Puedes leer más en estas fuentes:"
      - link "Estudio sobre educación alternativa (Scielo)":
        - /url: http://www.scielo.org.pe/scielo.php?script=sci_arttext&pid=S1019-94032017000100001
      - text: "|"
      - link "Ciencia Latina":
        - /url: https://ciencialatina.org/index.php/cienciala/article/view/6298
      - text: "|"
      - link "CIPER Chile":
        - /url: https://www.ciperchile.cl/2021/10/08/la-educacion-alternativa-como-un-derecho/
      - text: "|"
      - link "Trinus - Rendimiento Waldorf":
        - /url: https://trinus.org/el-rendimiento-academico-de-los-alumnos-waldorf-segun-pisa-y-otros-estudios/
      - text: "|"
      - link "La Tercera - Generación Waldorf":
        - /url: https://www.latercera.com/noticia/generacion-waldorf/
  - listitem:
    - button "🎨 ¿Hay talleres extracurriculares? +"
    - paragraph: Sí, ofrecemos experiencias en carpintería, arte y manualidades, cocina, música, cuentos, huerta, euritmia y movimiento. Estas actividades están integradas en la jornada escolar, entendiendo que el aprendizaje se vive con todo el ser.
  - listitem:
    - button "🚍 ¿Hay transporte o alimentación disponible? +"
    - paragraph: Actualmente no ofrecemos transporte ni alimentación. Valoramos que las familias puedan acompañar a sus hijos al inicio y término del día. En cuanto a la alimentación, los niños traen su propio almuerzo, y promovemos hábitos saludables y conciencia sobre los alimentos.
  - listitem:
    - button "🏡 ¿Puedo visitar el colegio antes de postular? +"
    - paragraph: ¡Por supuesto! Creemos que la mejor manera de conocer Trekan es viviendo una mañana en nuestra comunidad. Escríbenos por WhatsApp para agendar tu visita.
  - listitem:
    - button "📅 ¿Cuándo puedo postular? +"
    - paragraph: El proceso de admisión está abierto todo el año, siempre que haya cupos disponibles. Te recomendamos postular con anticipación para asegurar tu lugar.
  - listitem:
    - button "💌 ¿Cómo me contacto rápidamente? +"
    - paragraph: Puedes escribirnos directamente a través del botón de WhatsApp que ves en pantalla o usar el formulario "Postula aquí" para que podamos enviarte toda la información.
- heading "📍 En contacto con Trekan" [level=2]
- paragraph: La puerta de Trekan siempre está abierta. Escríbenos — respondemos rápido.
- heading "🏠 Dirección" [level=3]
- paragraph: Las Azaleas 96, Parque Ivian 1 Puerto Varas, Chile
- heading "📞 Teléfono" [level=3]
- paragraph:
  - link "+56 9 6776 5106":
    - /url: tel:+56967765106
- heading "✉️ Correo" [level=3]
- paragraph:
  - link "admision@colegiowaldorftrekan.cl":
    - /url: mailto:admision@colegiowaldorftrekan.cl
- heading "📱 Redes sociales" [level=3]
- link "WhatsApp":
  - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Colegio%20Waldorf%20Trekan
  - img
- link "Instagram":
  - /url: https://www.instagram.com/waldorftrekanpv/
  - img
- link "Facebook":
  - /url: https://www.facebook.com/profile.php?id=61573063135723
  - img
- link "📲 Guardar contacto en el celular":
  - /url: contacto-trekan.vcf
- heading "✉️ Escríbenos directamente" [level=3]
- text: Nombre *
- textbox "Nombre *":
  - /placeholder: Tu nombre
- text: Email *
- textbox "Email *":
  - /placeholder: tu@email.com
- text: Teléfono (opcional)
- textbox "Teléfono (opcional)":
  - /placeholder: +56 9 XXXX XXXX
- text: Asunto *
- combobox "Asunto *":
  - option "Selecciona un tema..." [disabled] [selected]
  - option "Admisión 2026"
  - option "Información general"
  - option "Visita al colegio"
  - option "Arriendo de salón"
  - option "Otro"
- text: Mensaje *
- textbox "Mensaje *":
  - /placeholder: ¿En qué podemos ayudarte?
- button "Enviar mensaje →"
- paragraph
- iframe
- paragraph: La puerta de Trekan siempre está abierta.
- heading "📸 Síguenos en Instagram" [level=2]
- paragraph:
  - text: El día a día de Trekan en imágenes.
  - link "@waldorftrekanpv":
    - /url: https://www.instagram.com/waldorftrekanpv/
- link "Ver Instagram de Waldorf Trekan":
  - /url: https://www.instagram.com/waldorftrekanpv/
  - img "Comunidad Colegio Waldorf Trekan"
  - img
  - text: "@waldorftrekanpv"
- link "Foto comunidad Trekan":
  - /url: https://www.instagram.com/waldorftrekanpv/
  - img "Actividad Colegio Waldorf Trekan"
- link "Foto comunidad Trekan":
  - /url: https://www.instagram.com/waldorftrekanpv/
  - img "Niños Colegio Waldorf Trekan"
- link "Foto comunidad Trekan":
  - /url: https://www.instagram.com/waldorftrekanpv/
  - img "Actividad Colegio Waldorf Trekan"
- link "Foto comunidad Trekan":
  - /url: https://www.instagram.com/waldorftrekanpv/
  - img "Comunidad Colegio Waldorf Trekan"
- link "Seguir en Instagram":
  - /url: https://www.instagram.com/waldorftrekanpv/
  - img
  - text: Seguir en Instagram
- contentinfo:
  - paragraph: © 2026 Colegio Waldorf Trekan - Puerto Varas
  - paragraph: Construyendo comunidad, educación y voluntad. Todos los derechos reservados.
  - link "Directorio de Recursos Waldorf y Antroposóficos en Chile":
    - /url: recursos-waldorf-chile.html
- dialog "Contacto WhatsApp":
  - img "Ivonne Parada A."
  - text: Ivonne Parada A. Coordinadora General
  - button "Cerrar": ✕
  - paragraph: Hola 👋 Escríbeme directamente, con gusto respondo tus preguntas sobre el colegio o agenda tu visita.
  - link "Enviar mensaje":
    - /url: https://wa.me/+56967765106?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20el%20Colegio%20Waldorf%20Trekan
    - img
    - text: Enviar mensaje
- button "Contactar por WhatsApp":
  - img "WhatsApp Trekan"
- button "Abrir asistente virtual Trekan"
- dialog "Aviso de cookies":
  - paragraph:
    - text: 🍪 Usamos cookies para mejorar tu visita.
    - link "Saber más":
      - /url: https://policies.google.com/privacy
  - button "Rechazar"
  - button "Aceptar"
- img
```

# Test source

```ts
  7   |       const waTrigger = document.getElementById('waTrigger');
  8   |       if (waTrigger && !waTrigger.classList.contains('floating-whatsapp')) {
  9   |         waTrigger.classList.add('floating-whatsapp');
  10  |         observer.disconnect();
  11  |       }
  12  |     });
  13  |     observer.observe(document.documentElement, { childList: true, subtree: true });
  14  |   });
  15  |   await page.goto('/index.html');
  16  | });
  17  | 
  18  | test.describe('WhatsApp Float Widget (Tier 1)', () => {
  19  |   test('test_whatsapp_trigger_rendered: trigger button should exist', async ({ page }) => {
  20  |     const trigger = page.locator('#waTrigger');
  21  |     await expect(trigger).toBeVisible();
  22  |   });
  23  | 
  24  |   test('test_whatsapp_card_rendered: card widget should exist', async ({ page }) => {
  25  |     const card = page.locator('#waCard');
  26  |     await expect(card).toBeAttached();
  27  |   });
  28  | 
  29  |   test('test_whatsapp_closed_initially: card should not be open initially', async ({ page }) => {
  30  |     const card = page.locator('#waCard');
  31  |     await expect(card).not.toHaveClass(/open/);
  32  |   });
  33  | 
  34  |   test('test_whatsapp_target_links: redirection link should have correct phone number', async ({ page }) => {
  35  |     const waLink = page.locator('.wa-card-btn');
  36  |     const href = await waLink.getAttribute('href');
  37  |     expect(href).toContain('wa.me/+56967765106');
  38  |   });
  39  | 
  40  |   test('test_whatsapp_avatar_rendered: coordinator avatar should be rendered', async ({ page }) => {
  41  |     const img = page.locator('.wa-card-logo');
  42  |     await expect(img).toBeVisible();
  43  |   });
  44  | });
  45  | 
  46  | test.describe('WhatsApp Float Widget (Tier 2)', () => {
  47  |   test('test_whatsapp_trigger_toggle: clicking the trigger opens and closes the card', async ({ page }) => {
  48  |     const trigger = page.locator('#waTrigger');
  49  |     const card = page.locator('#waCard');
  50  |     
  51  |     // Toggle open
  52  |     await trigger.click();
  53  |     await expect(card).toHaveClass(/open/);
  54  |     
  55  |     // Toggle close
  56  |     await trigger.click();
  57  |     await expect(card).not.toHaveClass(/open/);
  58  |   });
  59  | 
  60  |   test('test_whatsapp_close_btn: close button click should hide the card', async ({ page }) => {
  61  |     const trigger = page.locator('#waTrigger');
  62  |     const card = page.locator('#waCard');
  63  |     const closeBtn = page.locator('.wa-card-close');
  64  |     
  65  |     // Open
  66  |     await trigger.click();
  67  |     await expect(card).toHaveClass(/open/);
  68  |     
  69  |     // Click close
  70  |     await closeBtn.click();
  71  |     await expect(card).not.toHaveClass(/open/);
  72  |   });
  73  | 
  74  |   test('test_whatsapp_escape_dismiss: escape key should close the WhatsApp card', async ({ page }) => {
  75  |     const trigger = page.locator('#waTrigger');
  76  |     const card = page.locator('#waCard');
  77  |     
  78  |     // Open
  79  |     await trigger.click();
  80  |     await expect(card).toHaveClass(/open/);
  81  |     
  82  |     // Press Escape
  83  |     await page.keyboard.press('Escape');
  84  |     await expect(card).not.toHaveClass(/open/);
  85  |   });
  86  | 
  87  |   test('test_whatsapp_outside_dismiss: clicking outside the widget should not close by default unless configured or handled', async ({ page }) => {
  88  |     const trigger = page.locator('#waTrigger');
  89  |     const card = page.locator('#waCard');
  90  |     
  91  |     // Open
  92  |     await trigger.click();
  93  |     await expect(card).toHaveClass(/open/);
  94  |     
  95  |     // Click outside on body
  96  |     await page.locator('body').click({ position: { x: 5, y: 5 } });
  97  |     
  98  |     // Note: The WhatsApp widget does not have outside-click listener in local script (only chatbot has it).
  99  |     // Let's verify that it stays open, or closes if implemented. In our script, outside click closes dropdown and navMenu, but not waCard.
  100 |     // Thus we expect it to stay open (which is correct behavior for waCard).
  101 |     await expect(card).toHaveClass(/open/);
  102 |   });
  103 | 
  104 |   test('test_whatsapp_attention_badge_timer: badge is created and is visible initially', async ({ page }) => {
  105 |     // Check that the badge exists
  106 |     const badge = page.locator('.wa-badge');
> 107 |     await expect(badge).toBeVisible();
      |                         ^ Error: expect(locator).toBeVisible() failed
  108 |     await expect(badge).toHaveText('Escríbenos');
  109 |   });
  110 | });
  111 | 
```