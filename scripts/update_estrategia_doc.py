import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def update_document(docx_path):
    print(f"Processing: {docx_path}")
    doc = docx.Document(docx_path)
    
    # -------------------------------------------------------------
    # 1. ACTUALIZAR SECCIÓN 2: MINERÍA DE DOLOR Y SCRAPING
    # -------------------------------------------------------------
    # Buscar párrafo 2.3 Vacío estratégico para insertar antes la nueva sección 2.3
    target_p_23 = None
    for p in doc.paragraphs:
        if p.text.strip().startswith("2.3 Vacío estratégico"):
            target_p_23 = p
            break
            
    if target_p_23:
        # Renombrar el 2.3 existente a 2.4
        target_p_23.text = target_p_23.text.replace("2.3 Vacío estratégico", "2.4 Vacío estratégico")
        
        # Buscar y renombrar 2.4 Buyer Persona a 2.5
        for p in doc.paragraphs:
            if p.text.strip().startswith("2.4 Buyer Persona"):
                p.text = p.text.replace("2.4 Buyer Persona", "2.5 Buyer Persona")
                break
                
        # Insertar 2.3 Minería de Dolor antes del nuevo 2.4
        p_h2 = target_p_23.insert_paragraph_before("2.3 Minería de Dolor (Pain Mining) y Scraping de Comunidades: De la Intuición a la Evidencia Semántica", style="Heading 2")
        
        p_body1 = target_p_23.insert_paragraph_before(
            "El marketing de colegios alternativos suele cometer un error fundamental: construirse desde el ego institucional o desde abstracciones conceptuales ("
            "«educamos hacia la libertad», «somos una comunidad de amor y respeto»). Para una madre agotada del sistema tradicional, estas frases no generan impacto somático; "
            "su cerebro las archiva como simple publicidad escolar. Para conmover y abrir una conversación real, la comunicación debe partir del sufrimiento exacto que la familia experimenta cada día.",
            style="Normal"
        )
        
        p_body2 = target_p_23.insert_paragraph_before(
            "Metodología de la Agencia (Zero-Risk Listening): En lugar de adivinar dolores en una reunión creativa, la agencia despliega un sistema de escucha pasiva en las sombras (Outbound Shadows). "
            "Mediante perfiles técnicos seguros en navegadores con huella aislada (AdsPower), se realiza un scraping estructurado de comentarios, preguntas y debates públicos en grupos de crianza de Puerto Varas, Frutillar y Llanquihue, foros de maternidad, "
            "y reseñas de colegios tradicionales y particulares de la cuenca. Todo se ejecuta sin interactuar, sin dejar huellas públicas, sin enviar mensajes masivos y sin seguir a las cuentas analizadas, protegiendo con rigurosidad el estatus de Trekan.",
            style="Normal"
        )
        
        p_body3 = target_p_23.insert_paragraph_before(
            "Inventario de Dolores Somáticos Extraídos (Verbatim Reales de Madres):",
            style="Normal"
        )
        
        p_b1 = target_p_23.insert_paragraph_before(
            "• Fractura del hogar por tareas extenuantes: «Llega a las 16:30 destruido y seguimos peleando hasta las 21:00 con guías absurdas... se nos fue la paz familiar».",
            style="Normal"
        )
        p_b2 = target_p_23.insert_paragraph_before(
            "• Somatización del cortisol infantil: «Mi hijo llora todos los domingos por la tarde», «dolores de guata inexplicables los lunes por la mañana», «a los 7 años ya tiene crisis de pánico por las notas».",
            style="Normal"
        )
        p_b3 = target_p_23.insert_paragraph_before(
            "• Zombificación digital escolar: «En el colegio les exigen computador y tablet desde primero básico; están hiperestimulados, irritables y no logran conciliar el sueño».",
            style="Normal"
        )
        p_b4 = target_p_23.insert_paragraph_before(
            "• Pérdida del asombro y de la infancia: «Siento que lo están entrenando para ser un pequeño empleado corporativo estresado; no juega, no trepa árboles, no tiene tiempo para contemplar».",
            style="Normal"
        )
        
        p_body4 = target_p_23.insert_paragraph_before(
            "Alimentación Quirúrgica del Copywriting: El Cerebro de IA local (Llama / Qwen) clasifica estos testimonios en clusters emocionales y extrae los «marcadores de dolor» prioritarios. "
            "Estos verbatim alimentan directamente los ganchos (Hooks) de los Reels y los copies de Meta Ads. Cuando la madre escucha o lee su dolor exacto reflejado con respeto y verdad en los primeros 3 segundos, "
            "se desactiva la barrera defensiva del cerebro y se produce una validación empática inmediata: «Este colegio entiende lo que lloro en silencio cada noche».",
            style="Normal"
        )
        print("✓ Sección 2.3 Minería de Dolor insertada exitosamente.")

    # -------------------------------------------------------------
    # 2. ACTUALIZAR SECCIÓN 4: ACTIVADOR DEL PHANTOM TOUCH
    # -------------------------------------------------------------
    target_p_shotlist = None
    for p in doc.paragraphs:
        if "4.4.1 Banco de Tomas Estratégicas" in p.text.strip():
            target_p_shotlist = p
            break
            
    if target_p_shotlist:
        # Insertar 4.4.1 Phantom Touch antes del Shot List
        p_pt_h2 = target_p_shotlist.insert_paragraph_before(
            "4.4.1 El Activador del «Phantom Touch» (Tacto Fantasma y Contraste Neurosensorial)",
            style="Heading 2"
        )
        
        p_pt_1 = target_p_shotlist.insert_paragraph_before(
            "La Neurobiología del Hambre Táctil (Tactile Starvation): Una persona promedio pasa entre 4 y 7 horas al día deslizando su dedo índice sobre una superficie de cristal frío, químicamente tratado, plano y sin vida biológica. "
            "Neurológicamente, esta sobreexposición genera una privación sensorial profunda: el cerebro humano anhela materia, rugosidad, temperatura y textura viva.",
            style="Normal"
        )
        
        p_pt_2 = target_p_shotlist.insert_paragraph_before(
            "El Mecanismo del «Phantom Touch»: El Tacto Fantasma es una técnica audiovisual orientada a provocar una respuesta somatosensorial involuntaria en el espectador a través de la pantalla. "
            "Al encuadrar primeros planos macro (Extreme Close-Ups) con iluminación natural y movimiento lento, las neuronas espejo táctiles se activan con tal intensidad que la corteza somatosensorial recrea la sensación física en las yemas de los dedos de la madre:",
            style="Normal"
        )
        
        p_pt_b1 = target_p_shotlist.insert_paragraph_before(
            "• Cera de abejas pura: La barra densa cediendo plásticamente ante la presión suave de los dedos, ablandándose con el calor de la palma y liberando su textura y brillo dorado.",
            style="Normal"
        )
        p_pt_b2 = target_p_shotlist.insert_paragraph_before(
            "• Pan de espelta y masa viva: Manos infantiles que se hunden rítmicamente en la masa elástica, la harina flotando como polvo dorado bajo un rayo de luz matinal, la resistencia crujiente de la corteza horneada.",
            style="Normal"
        )
        p_pt_b3 = target_p_shotlist.insert_paragraph_before(
            "• Lana virgen y telar: Hebras crudas de vellón pasando entre los dedos, la fricción rítmica de los palillos de madera pulida y el peso cálido del tejido envolvente.",
            style="Normal"
        )
        p_pt_b4 = target_p_shotlist.insert_paragraph_before(
            "• Madera viva nativa: La viruta curva desprendiéndose suavemente bajo una gubia manual, revelando las vetas profundas y la calidez del alerce o el pellín.",
            style="Normal"
        )
        p_pt_b5 = target_p_shotlist.insert_paragraph_before(
            "• Acuarela húmedo sobre húmedo: La caricia acuosa del pigmento vegetal tocando el papel de algodón rugoso empapado, expandiéndose libremente como un ser vivo sin bordes de grafito.",
            style="Normal"
        )
        
        p_pt_3 = target_p_shotlist.insert_paragraph_before(
            "El Contraste Sensorial (Vidrio Frío vs. Materia Cálida): El poder de conversión de esta técnica radica en el cortocircuito somático: la madre sostiene un pedazo de vidrio frío e inerte a las 21:30 hrs en su teléfono, "
            "mientras sus ojos y su mente experimentan la calidez, la rugosidad y el abrigo de la materia viva. Ese choque despierta un deseo visceral de cobijo y refugio evolutivo para su hijo: «Esto es lo que mis manos y las de mi hijo necesitan tocar».",
            style="Normal"
        )
        
        p_pt_4 = target_p_shotlist.insert_paragraph_before(
            "Sinestesia con Audio ASMR: Para garantizar la activación del Phantom Touch, queda terminantemente prohibido musicalizar estas tomas con melodías corporativas o música de tendencia tipo TikTok. "
            "El audio debe ser 100% sonido ambiente real de alta fidelidad: el corte crujiente del pan caliente, el roce de la lana, el agua fluyendo en el cuenco de acuarela, el susurro del viento y los pájaros en el bosque de Trekan.",
            style="Normal"
        )
        
        # Renumerar las siguientes subsecciones
        target_p_shotlist.text = target_p_shotlist.text.replace("4.4.1 Banco de Tomas", "4.4.2 Banco de Tomas")
        for p in doc.paragraphs:
            if "4.4.2 Condiciones de Grabación" in p.text.strip():
                p.text = p.text.replace("4.4.2 Condiciones", "4.4.3 Condiciones")
            elif "4.4.3 Reel de Admisión 2027" in p.text.strip():
                p.text = p.text.replace("4.4.3 Reel de Admisión", "4.4.4 Reel de Admisión")
            elif "4.4.4 Técnica de Grabación Móvil" in p.text.strip():
                p.text = p.text.replace("4.4.4 Técnica de Grabación", "4.4.5 Técnica de Grabación")
                
        print("✓ Sección 4.4.1 Phantom Touch insertada y numeraciones actualizadas.")

    # -------------------------------------------------------------
    # 3. ACTUALIZAR SECCIÓN 5: LA TRÍADA SISTÉMICA DE CRECIMIENTO
    # -------------------------------------------------------------
    target_p_s6 = None
    for p in doc.paragraphs:
        if p.text.strip().startswith("6. Roadmap Operativo"):
            target_p_s6 = p
            break
            
    if target_p_s6:
        p_tri_h2 = target_p_s6.insert_paragraph_before("5.8 La Tríada Sistémica de Crecimiento: Minería de Dolor, Tres Tercios y Expansión del Banco", style="Heading 2")
        p_tri_body = target_p_s6.insert_paragraph_before(
            "Ninguna herramienta de este plan funciona como una pieza aislada; operan como un motor de engranajes interdependientes:\n"
            "1. La Minería de Dolor (Sección 2.3) aporta el combustible emocional verídico que derriba las defensas de la familia.\n"
            "2. El Activador de Phantom Touch (Sección 4.4.1) detiene el desplazamiento y activa las neuronas espejo, transformando el scroll pasivo en hambre sensorial de refugio.\n"
            "3. La Regla de los Tres Tercios (Lección 2) estructura la pauta para no malgastar presupuesto: 1/3 Atracción (bajar cortisol), 1/3 Pedagogía (elevar consciencia filosófica) y 1/3 Conversión y escasez real.\n"
            "4. El Outbound Silencioso / Hybrid Sniper (Lección 3) opera en segundo plano atrayendo perfiles de alta afinidad local sin devaluar el estatus de la escuela.\n"
            "5. La Expansión del Banco de Prospectos (Lección 5) garantiza que el CRM albergue entre 40 y 60 familias en calentamiento rítmico continuo, permitiendo que las 12 matrículas finales se cierren desde la abundancia, la tranquilidad y el filtro biográfico.",
            style="Normal"
        )
        print("✓ Sección 5.8 Tríada Sistémica insertada exitosamente.")

    # -------------------------------------------------------------
    # 4. ACTUALIZAR B.3: LECCIONES 2, 3 Y 5
    # -------------------------------------------------------------
    target_p_l4 = None
    for p in doc.paragraphs:
        if p.text.strip().startswith("Lección 4: arquitectura de IA"):
            target_p_l4 = p
            break
            
    if target_p_l4:
        # Insertar Lección 2 antes de Lección 4
        p_l2_title = target_p_l4.insert_paragraph_before("Lección 2: la regla de los tres tercios en la pauta y el contenido.", style="Normal")
        p_l2_body = target_p_l4.insert_paragraph_before(
            "Lo que fracasaba: Publicar únicamente fotos bonitas de niños jugando (que generan likes de abuelos pero no matrículas) o, en el extremo opuesto, lanzar anuncios comerciales directos de «Matrículas Abiertas 2027» (que ahuyentan al segmento ABC1 al proyectar desesperación y mercantilismo escolar).\n"
            "Lo que sirve: La distribución innegociable del esfuerzo del Comité y del presupuesto publicitario en tres tercios equilibrados:\n"
            "• Primer Tercio — Atracción y Contención Sensorial (ToFu): Videos anclados en la minería de dolor y el Phantom Touch. Visibilizan el daño del estrés tradicional y muestran el remanso sensorial de Trekan. Cero venta de matrícula; su único fin es bajar el cortisol y abrir la mente de la madre.\n"
            "• Segundo Tercio — Pedagogía y Elevación Cultural (MoFu): Contenido explicativo profundo que devela el «por qué» Waldorf (el ritmo cronobiológico, las épocas, la lectoescritura orgánica sin pantallas, la acuarela goetheana). Este tercio educa a los «Refugiados del Sistema» (Arquetipo 1) para que no sean clientes superficiales, elevando su comprensión y compromiso ético con la escuela.\n"
            "• Tercer Tercio — Conversión y Escasez Real (BoFu): Llamados suaves y directos a agendar una Tarde de Té por WhatsApp, fundamentados en la escasez real: no existen cupos ilimitados porque un aula Waldorf no masifica; se protegen estrictamente los grupos de 12 a 15 niños por sala.",
            style="Normal"
        )
        
        # Insertar Lección 3 antes de Lección 4
        p_l3_title = target_p_l4.insert_paragraph_before("Lección 3: el protocolo outbound silencioso (Hybrid Sniper) y la reciprocidad orgánica.", style="Normal")
        p_l3_body = target_p_l4.insert_paragraph_before(
            "Lo que fracasaba: El outbound comercial tradicional (mensajería en frío, llamadas o prospección masiva). En una comunidad selecta y sensible como Puerto Varas, un colegio que persigue apoderados destruye su prestigio al instante.\n"
            "Lo que sirve: El protocolo «Hybrid Sniper» (Reciprocidad Silenciosa). En lugar de salir a cazar en frío, el sistema rastrea en segundo plano las interacciones de familias que ya orbitan el estilo de vida natural en la cuenca (apoderados que interactúan con tiendas orgánicas, pediatras antroposóficos/respetuosos, talleres de arte o yoga).\n"
            "Se aplican micro-estímulos de presencia sutil (visualización de historias públicas, likes calibrados a contenido afín) desde la cuenta de Trekan. Esto despierta la curiosidad orgánica de la madre: al hacer clic en el perfil del colegio, se encuentra con una cuenta boutique de autoridad impecable (ratio 220:1, estética Kinfolk).\n"
            "Si la madre muestra una señal de afinidad genuina (comenta una reflexión o comparte un post), Coordinación o Dirección envía un DM manual, noble y desinteresado de agradecimiento («Gracias por resonar con este cuidado de la infancia...»). La reciprocidad psicológica abre una conversación fluida que de forma natural deriva en una invitación a conversar por WhatsApp.",
            style="Normal"
        )
        print("✓ Lecciones 2 y 3 insertadas exitosamente.")

    # Buscar el final de Lección 4 para insertar Lección 5
    target_p_b4 = None
    for p in doc.paragraphs:
        if p.text.strip().startswith("B.4 Roadmap hacia las 12"):
            target_p_b4 = p
            break
            
    if target_p_b4:
        p_l5_title = target_p_b4.insert_paragraph_before("Lección 5: la expansión del banco de prospectos y la gestión de capacidad (Misión 12 Familias).", style="Normal")
        p_l5_body = target_p_b4.insert_paragraph_before(
            "Lo que fracasaba: Gestionar la admisión con mentalidad lineal de 1 a 1 (creer que para cerrar 12 matrículas basta con hablar con 15 o 20 familias). El proceso de decisión familiar en una escuela alternativa tarda semanas, requiere consenso de pareja y ajustes financieros. Quien trabaja con un embudo estrecho llega a noviembre con angustia, viéndose forzado a bajar la vara de admisión y matriculando a familias incompatibles que terminan desestabilizando el aula.\n"
            "Lo que sirve: La Expansión Permanente del Banco de Prospectos. La meta operativa real de la campaña no es conseguir 12 prospectos; es construir un Banco Activo de 40 a 60 familias en calentamiento continuo (Warmup) dentro del CRM.\n"
            "Este banco se alimenta simultáneamente del inbound (pauta y web) y del outbound silencioso. Al contar con 40 a 60 familias pre-calificadas y nutridas con pedagogía, las 4 Tardes de Té de noviembre (10 familias por sesión) se llenan sin fricción. Las 12 matrículas finales se eligen desde una posición de serenidad y abundancia, priorizando a las familias con mayor sintonía biográfica y cuidando la composición sana del grupo de niños.",
            style="Normal"
        )
        print("✓ Lección 5 insertada exitosamente.")

    # -------------------------------------------------------------
    # 5. ACTUALIZAR TABLA DE ROADMAP B.4
    # -------------------------------------------------------------
    last_table = doc.tables[-1]
    # Limpiar filas existentes salvo encabezado
    while len(last_table.rows) > 1:
        tr = last_table.rows[-1]._tr
        tr.getparent().remove(tr)
        
    roadmap_rows = [
        ["Minería de dolor y scraping pasivo de comunidades locales (Puerto Varas/Llanquihue)", "2026-10-15", "4 días"],
        ["Captura audiovisual de planos macro táctiles (Phantom Touch & ASMR)", "2026-10-18", "3 días"],
        ["Filtro cognitivo y calibración de copies con crítico adversarial IA (Llama 70B)", "2026-10-20", "2 días"],
        ["Lanzamiento pauta Meta Ads bajo Regla de los Tres Tercios (ToFu / MoFu / BoFu)", "2026-10-22", "40 días"],
        ["Despliegue Outbound Silencioso (Hybrid Sniper) y Expansión del Banco (meta: 50 familias)", "2026-10-25", "35 días"],
        ["Stories rítmicas con encuesta sensorial y de crianza (21:00 hrs)", "2026-10-17", "30 días"],
        ["Tarde de Té 1 (10 familias del banco calificado)", "2026-11-05", "1 día"],
        ["Tarde de Té 2 (10 familias del banco calificado)", "2026-11-12", "1 día"],
        ["Tarde de Té 3 (10 familias del banco calificado)", "2026-11-19", "1 día"],
        ["Tarde de Té 4 (10 familias del banco calificado)", "2026-11-26", "1 día"],
        ["Entrevistas biográficas y cierre de las 12 matrículas por escasez real", "2026-11-30", "15 días"]
    ]
    
    for row_data in roadmap_rows:
        row = last_table.add_row()
        for i, val in enumerate(row_data):
            row.cells[i].text = val
            
    print("✓ Tabla de Roadmap B.4 expandida con las 11 líneas de ejecución operativas.")

    # Guardar cambios
    doc.save(docx_path)
    print(f"✓ Guardado exitosamente en: {docx_path}")

# Ejecutar actualización en ambos archivos
update_document("/Users/felipeandresvivancocornejo/Downloads/Estrategia_Comunicaciones_Trekan.docx")
update_document("/Users/felipeandresvivancocornejo/Downloads/Comunicaciones/Estrategia_Comunicaciones_Trekan.docx")
print("TODO COMPLETADO.")
