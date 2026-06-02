const fs = require('fs');

const filePath = 'src/templates/modals-scripts.html';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `
  <!-- Widget Chatbot Trekan -->
  <style>
    :root {
      --chat-bg: #f5f4ee;
      --chat-user: #2E5E4E;
      --chat-bot: #e8f5e8;
      --chat-border: #e4e8e0;
      --chat-accent: #2E5E4E;
      --chat-accent-hover: #3a7661;
      --chat-ink: #1a2e25;
      --chat-mute: #8a9590;
    }

    .trekan-bot-bubble {
      position: fixed; bottom: 25px; right: 20px; width: 62px; height: 62px;
      border-radius: 50%; background: #fff; padding: 0; cursor: pointer;
      border: 2px solid #2E5E4E;
      box-shadow: 0 6px 20px rgba(46,94,78,0.35), 0 0 0 0 rgba(168,216,185,0.6);
      z-index: 9998; transition: transform 0.25s ease, box-shadow 0.25s ease;
      animation: trekan-bot-pulse 2.5s ease-out infinite;
      overflow: hidden; display: flex; align-items: center; justify-content: center;
    }
    .trekan-bot-bubble img { width: 145%; height: 145%; object-fit: cover; pointer-events: none; }
    .trekan-bot-bubble:hover { transform: scale(1.08); box-shadow: 0 8px 28px rgba(46,94,78,0.5); }
    .trekan-bot-bubble:active { transform: scale(0.95); }
    
    @keyframes trekan-bot-pulse {
      0%   { box-shadow: 0 6px 20px rgba(46,94,78,0.35), 0 0 0 0 rgba(168,216,185,0.6); }
      70%  { box-shadow: 0 6px 20px rgba(46,94,78,0.35), 0 0 0 14px rgba(168,216,185,0); }
      100% { box-shadow: 0 6px 20px rgba(46,94,78,0.35), 0 0 0 0 rgba(168,216,185,0); }
    }
    .trekan-bot-bubble.open { animation: none; }
    
    .trekan-bot-tooltip {
      position: fixed; bottom: 43px; right: 92px; background: #fff; color: #1a2e25;
      padding: 10px 16px; border-radius: 20px 20px 4px 20px;
      font-family: 'Quicksand', sans-serif; font-size: 0.9rem; font-weight: 500;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15); z-index: 9997;
      opacity: 0; transform: translateX(10px);
      transition: opacity 0.35s ease, transform 0.35s ease;
      pointer-events: none; white-space: nowrap;
    }
    .trekan-bot-tooltip.visible { opacity: 1; transform: translateX(0); }
    .trekan-bot-tooltip::after {
      content: ''; position: absolute; right: -6px; bottom: 8px;
      width: 12px; height: 12px; background: #fff; transform: rotate(45deg);
      box-shadow: 2px 2px 3px rgba(0,0,0,0.08);
    }
    
    .trekan-bot-overlay {
      position: fixed; inset: 0; background: rgba(26,46,37,0.4);
      z-index: 9998; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
    }
    .trekan-bot-overlay.visible { opacity: 1; pointer-events: auto; }
    
    .trekan-bot-panel {
      position: fixed; bottom: 100px; right: 25px; width: 400px; height: 620px;
      max-height: calc(100vh - 130px); background: #fff; border-radius: 16px;
      box-shadow: 0 20px 60px rgba(26,46,37,0.25); z-index: 9999;
      display: flex; flex-direction: column; overflow: hidden;
      transform: translateY(20px) scale(0.95); opacity: 0; pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease;
      transform-origin: bottom right; font-family: 'Quicksand', sans-serif;
    }
    .trekan-bot-panel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
    
    .trekan-bot-header {
      background: linear-gradient(135deg, #2E5E4E 0%, #3d7a66 100%);
      color: #fff; padding: 14px 18px; display: flex; align-items: center;
      justify-content: space-between; flex-shrink: 0;
    }
    .trekan-bot-header-info { display: flex; align-items: center; gap: 12px; }
    .trekan-bot-avatar {
      width: 38px; height: 38px; border-radius: 50%; background: #fff;
      display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 3px;
    }
    .trekan-bot-avatar img { width: 145%; height: 145%; object-fit: cover; }
    .trekan-bot-header-text h4 { margin: 0; font-size: 1.05rem; font-weight: 700; line-height: 1.2; }
    .trekan-bot-header-text span { font-size: 0.8rem; opacity: 0.9; display: flex; align-items: center; gap: 5px; }
    .trekan-bot-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 6px rgba(74,222,128,0.5); }
    
    .trekan-bot-header-actions { display: flex; align-items: center; gap: 6px; }
    .trekan-bot-action-btn {
      background: rgba(255,255,255,0.15); border: none; color: #fff;
      width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;
      display: flex; align-items: center; justify-content: center; transition: background 0.2s; font-family: inherit;
    }
    .trekan-bot-action-btn:hover { background: rgba(255,255,255,0.3); }

    /* Native Chat Body */
    .trekan-bot-body {
      flex: 1; overflow-y: auto; background: var(--chat-bg);
      background-image: radial-gradient(ellipse at top left, rgba(46, 94, 78, 0.05), transparent 50%),
                        radial-gradient(ellipse at bottom right, rgba(168, 216, 185, 0.08), transparent 50%);
      padding: 20px 16px 10px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth;
    }
    .trekan-bot-body::-webkit-scrollbar { width: 6px; }
    .trekan-bot-body::-webkit-scrollbar-thumb { background: #d0d5ce; border-radius: 10px; }
    
    .chat-msg { display: flex; gap: 10px; max-width: 88%; animation: chatSlideUp 0.3s ease; }
    @keyframes chatSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .chat-msg.bot { align-self: flex-start; }
    .chat-msg.user { align-self: flex-end; flex-direction: row-reverse; }
    
    .chat-avatar {
      width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0;
      background: var(--white); padding: 2px;
    }
    .chat-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .chat-msg.user .chat-avatar { background: #d4a574; color: white; font-size: 12px; font-weight: 700; padding: 0; }
    
    .chat-bubble {
      padding: 12px 15px; border-radius: 14px; font-size: 0.92rem; line-height: 1.5;
      color: var(--chat-ink); word-wrap: break-word; white-space: pre-wrap;
      box-shadow: 0 2px 5px rgba(0,0,0,0.04);
    }
    .chat-msg.bot .chat-bubble { background: var(--chat-bot); border-bottom-left-radius: 4px; }
    .chat-msg.user .chat-bubble { background: var(--chat-user); color: white; border-bottom-right-radius: 4px; }
    
    .chat-bubble a { color: var(--chat-accent); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
    .chat-msg.user .chat-bubble a { color: #ffe0b3; }
    .chat-bubble ul, .chat-bubble ol { margin: 6px 0 0 18px; }
    .chat-bubble li { margin: 3px 0; }
    
    .chat-source-tag { display: inline-block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em; padding: 1px 6px; border-radius: 4px; margin-right: 6px; vertical-align: 1px; }
    .chat-source-tag.kb { background: #A8D8B9; color: #1a2e25; }
    .chat-source-tag.ai { background: #f5e2c4; color: #8a5a2e; }
    
    .chat-time { font-size: 0.65rem; color: var(--chat-mute); margin-top: 4px; padding: 0 4px; }
    .chat-msg.user .chat-time { text-align: right; }
    
    .chat-typing { display: flex; gap: 4px; padding: 4px; }
    .chat-typing span {
      width: 6px; height: 6px; background: var(--chat-accent); border-radius: 50%;
      animation: chatTypingBounce 1.2s infinite; opacity: 0.6;
    }
    .chat-typing span:nth-child(2) { animation-delay: 0.15s; }
    .chat-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes chatTypingBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
    
    .chat-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px 56px; animation: chatSlideUp 0.4s ease 0.1s both; }
    .chat-chip {
      background: var(--white); border: 1px solid #A8D8B9; color: var(--chat-accent);
      padding: 7px 12px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .chat-chip:hover { background: var(--chat-accent); color: white; border-color: var(--chat-accent); transform: translateY(-1px); }
    
    .trekan-bot-footer { padding: 12px 16px; border-top: 1px solid var(--chat-border); background: var(--white); }
    .chat-input-wrap {
      display: flex; gap: 8px; background: var(--chat-bg); border: 1px solid var(--chat-border);
      border-radius: 24px; padding: 6px 6px 6px 16px; align-items: flex-end; transition: border-color 0.2s;
    }
    .chat-input-wrap:focus-within { border-color: var(--chat-accent); }
    .chat-input {
      flex: 1; border: none; background: transparent; outline: none; font-size: 0.92rem;
      color: var(--chat-ink); padding: 8px 0; resize: none; max-height: 90px; font-family: inherit;
    }
    .chat-input::placeholder { color: var(--chat-mute); }
    .chat-send-btn {
      background: var(--chat-accent); color: white; border: none; border-radius: 50%;
      width: 34px; height: 34px; display: grid; place-items: center; cursor: pointer; transition: 0.2s; flex-shrink: 0;
    }
    .chat-send-btn:hover:not(:disabled) { background: var(--chat-accent-hover); transform: scale(1.05); }
    .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .chat-credit { text-align: center; font-size: 0.65rem; color: var(--chat-mute); margin-top: 8px; font-style: italic; }
    
    @media (max-width: 600px) {
      .trekan-bot-panel { bottom: 0; right: 0; left: 0; width: 100%; height: 100dvh; max-height: 100dvh; border-radius: 0; }
      .trekan-bot-tooltip { bottom: 43px; right: 92px; font-size: 0.85rem; padding: 8px 14px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .trekan-bot-bubble, .chat-msg, .chat-quick-replies { animation: none; }
      .trekan-bot-panel, .trekan-bot-tooltip, .trekan-bot-overlay { transition: opacity 0.15s ease; }
    }
    #cookie-banner.visible ~ .trekan-bot-bubble,
    #cookie-banner.visible ~ .trekan-bot-tooltip { transform: translateY(-80px); transition: transform 0.3s ease; }
  </style>

  <div id="trekan-bot-tooltip" class="trekan-bot-tooltip" aria-hidden="true">¿Tienes dudas? Pregúntame 🌱</div>
  <button id="trekan-bot-bubble" class="trekan-bot-bubble" aria-label="Abrir asistente virtual Trekan" aria-expanded="false" aria-controls="trekan-bot-panel">
    <img src="assets/logo.png" alt="" aria-hidden="true">
  </button>
  <div id="trekan-bot-overlay" class="trekan-bot-overlay" aria-hidden="true"></div>
  <div id="trekan-bot-panel" class="trekan-bot-panel" role="dialog" aria-label="Asistente virtual Trekan" aria-hidden="true">
    <div class="trekan-bot-header">
      <div class="trekan-bot-header-info">
        <div class="trekan-bot-avatar"><img src="assets/logo.png" alt="" aria-hidden="true"></div>
        <div class="trekan-bot-header-text">
          <h4>Asistente Trekan</h4>
          <span><span class="trekan-bot-status-dot"></span> En línea</span>
        </div>
      </div>
      <div class="trekan-bot-header-actions">
        <button class="trekan-bot-action-btn" id="trekan-bot-clear" aria-label="Limpiar chat" title="Limpiar conversación">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <button id="trekan-bot-close" class="trekan-bot-action-btn" aria-label="Cerrar asistente">×</button>
      </div>
    </div>
    
    <div class="trekan-bot-body" id="trekan-bot-messages"></div>
    
    <div class="trekan-bot-footer">
      <div class="chat-input-wrap">
        <textarea class="chat-input" id="trekan-bot-input" rows="1" placeholder="Escríbeme tu consulta..."></textarea>
        <button class="chat-send-btn" id="trekan-bot-send" aria-label="Enviar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12l14-7-7 14-2-5-5-2z"></path>
          </svg>
        </button>
      </div>
      <div class="chat-credit">Colegio Waldorf Trekan · Puerto Varas</div>
    </div>
  </div>

  <script>
    (function() {
      var bubble  = document.getElementById('trekan-bot-bubble');
      var panel   = document.getElementById('trekan-bot-panel');
      var closeBtn = document.getElementById('trekan-bot-close');
      var clearBtn = document.getElementById('trekan-bot-clear');
      var overlay = document.getElementById('trekan-bot-overlay');
      var tooltip = document.getElementById('trekan-bot-tooltip');
      
      var messagesEl = document.getElementById('trekan-bot-messages');
      var inputEl = document.getElementById('trekan-bot-input');
      var sendBtn = document.getElementById('trekan-bot-send');
      
      var hasInteracted = localStorage.getItem('trekan-bot-seen') === '1';
      var conversationHistory = [];

      // Chatbot Constants
      var PROXY_URL = "https://chatbottrekan.vercel.app/api/chat";
      var AI_MODEL = "llama-3.3-70b-versatile";
      var CONFIG = {
        botInitial: "T",
        welcomeMessage: "¡Hola! 🌱 Soy el asistente virtual del <b>Colegio Waldorf Trekan</b>. Puedo contarte sobre nuestra pedagogía, admisión 2026, aranceles, horarios, el arriendo del salón y más. ¿En qué te ayudo hoy?",
        fallbackMessage: "No pude entenderte del todo 🤔. ¿Podrías reformular? También puedes escribirnos por <a href='https://wa.me/56967765106' target='_blank'>WhatsApp</a>.",
        quickReplies: [
          "¿Cuáles son los aranceles 2026?",
          "¿Cómo postulo?",
          "¿Qué es la pedagogía Waldorf?",
          "Arriendo del salón"
        ]
      };
      // Minimal Knowledge Base extracted
      var KNOWLEDGE_BASE = [
        { keywords: ["hola","buenas","buenos dias","buenas tardes","buenas noches","hey","saludos","que tal"], response: "¡Hola! 🌱 Bienvenido a Trekan. ¿En qué te puedo ayudar hoy?" },
        { keywords: ["horario","horarios","jornada","abren","atienden","hora de entrada","hora de salida"], response: "🕗 <b>Jornada escolar:</b> Lunes a Viernes de <b>8:00 a 14:00 hrs</b>." },
        { keywords: ["arancel","aranceles","precio","precios","cuanto cuesta","cuanto vale","matricula","escolaridad","mensualidad","colegiatura"], response: "💰 <b>Aranceles 2026:</b><ul><li><b>Matrícula:</b> $500.000 (2 cuotas, ene+feb, no reembolsable)</li><li><b>Escolaridad:</b> $330.000/mes</li><li><b>Responsabilidad Social:</b> +$33.000/mes (voluntario, ayuda a becas)</li><li><b>Materiales:</b> $160.000/año (2 cuotas, mar+jun)</li><li><b>Incorporación:</b> $330.000 (una sola vez)</li></ul>Hay <b>aranceles diferenciados</b> para familias que lo necesiten 💚" },
        { keywords: ["postular","postulacion","inscribir","inscripcion","admision","como me inscribo","como postulo","quiero postular","matricular"], response: "📝 El proceso de admisión está <b>abierto todo el año</b>, siempre que haya cupos.<br>👉 <a href='https://docs.google.com/forms/d/e/1FAIpQLSdXbiojPJFncN94G3AS5huINvHKjpv2xFLcEaMjsHiC8sHYSQ/viewform' target='_blank'>Postula aquí</a><br>O escríbenos por <a href='https://wa.me/56967765106' target='_blank'>WhatsApp</a> para orientarte." },
        { keywords: ["waldorf","pedagogia","metodologia","metodo educativo","filosofia","enfoque","como ensenan"], response: "🌱 La pedagogía <b>Waldorf</b> acompaña el desarrollo integral del niño —<b>mente, corazón y manos</b>— a través de experiencias vivenciales, arte, naturaleza y comunidad. No solo enseñamos contenidos: cultivamos curiosidad, creatividad y voluntad." },
        { keywords: ["salon","espacio trekan","arriendo","arrendar","alquilar","arrendar espacio"], response: "🏡 <b>Arriendo Espacio Trekan</b> — 25m² para hasta 20 personas, incluye mesas, sillas, cocina equipada, baño y estacionamiento.<ul><li>1-3 hrs: <b>$15.000/hora</b></li><li>4-6 hrs: <b>$13.000/hora</b></li><li>Jornada completa (7h): <b>$66.500</b></li><li>Kit audiovisual: +$25.000</li></ul>Consulta por <a href='https://wa.me/56967765106?text=Hola,%20quiero%20informacion%20sobre%20el%20arriendo%20del%20salon%20Trekan' target='_blank'>WhatsApp</a>." }
      ];

      var SYSTEM_PROMPT = \`Eres el asistente virtual del COLEGIO WALDORF TREKAN, ubicado en Puerto Varas, Chile. Responde SIEMPRE en español, de forma cálida, breve (máximo 4-5 oraciones) y profesional, con el tono cercano de una comunidad educativa Waldorf.

=== INFORMACIÓN DEL COLEGIO ===
IDENTIDAD: Colegio Waldorf Trekan ("Trekan" significa "caminante" en mapudungun). Niños de 3 a 14 años. Las Azaleas 96, Parque Ivian 1, Puerto Varas. www.colegiowaldorftrekan.cl
CONTACTO: WhatsApp: +56 9 6776 5106 | admision@colegiowaldorftrekan.cl | coordinacion@colegiowaldorftrekan.cl | IG: @waldorftrekanpv
HORARIOS: Lunes a Viernes de 8:00 a 14:00 hrs
ARANCELES 2026: Matrícula: $500.000 (2 cuotas). Escolaridad: $330.000/mes. Responsabilidad Social: +$33.000/mes (voluntario). Materiales: $160.000/año. Incorporación: $330.000. Hay aranceles diferenciados.
DEVOLUCIONES: Antes de marzo: 100% escolaridad. Antes del 2° sem: devolución del 2° sem. Matrícula no reembolsable.
ADMISIÓN 2026: Abierta todo el año. Máx 16 niños por curso. Formulario en la web.
PEDAGOGÍA WALDORF: Desarrollo integral: mente, corazón, manos. Evaluación cualitativa (sin notas). Talleres integrados: carpintería, arte, cocina, huerta, etc.
MINEDUC: NO tiene reconocimiento oficial. Rinden Exámenes Libres. Promedio 90% aprueba con buenas notas.
SERVICIOS: NO hay transporte ni alimentación. Seguro escolar opcional (Andes Salud / Clínica Pto Varas).
ARRIENDO ESPACIO: 25m², 20 pers. Tarifas: 1-3h $15.000/hr | 4-6h $13.000/hr | Jornada 7h $66.500 | Kit AV +$25.000
REGLAS: NUNCA inventes precios o fechas. Tono cálido, usa emojis moderados.\`;

      if (!hasInteracted) {
        setTimeout(function() {
          if (!panel.classList.contains('open')) {
            tooltip.classList.add('visible');
            setTimeout(function() { tooltip.classList.remove('visible'); }, 6000);
          }
        }, 5000);
      }

      function openBot() {
        panel.classList.add('open'); bubble.classList.add('open'); overlay.classList.add('visible');
        panel.setAttribute('aria-hidden', 'false'); bubble.setAttribute('aria-expanded', 'true');
        tooltip.classList.remove('visible'); localStorage.setItem('trekan-bot-seen', '1');
        if (messagesEl.children.length === 0) loadHistory();
        setTimeout(function() { inputEl.focus(); }, 300);
      }

      function closeBot() {
        panel.classList.remove('open'); bubble.classList.remove('open'); overlay.classList.remove('visible');
        panel.setAttribute('aria-hidden', 'true'); bubble.setAttribute('aria-expanded', 'false'); bubble.focus();
      }

      bubble.addEventListener('click', function() { panel.classList.contains('open') ? closeBot() : openBot(); });
      closeBtn.addEventListener('click', closeBot);
      overlay.addEventListener('click', closeBot);
      document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && panel.classList.contains('open')) closeBot(); });

      // Chat Logic
      function formatTime(d) { return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }); }

      function renderMessage(text, sender, timestamp, source) {
        var msg = document.createElement('div');
        msg.className = 'chat-msg ' + sender;
        var avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        if (sender === 'bot') {
          avatar.innerHTML = '<img src="assets/logo.png" alt="">';
        } else {
          avatar.textContent = 'Tú';
        }
        var wrap = document.createElement('div');
        var bubbleEl = document.createElement('div');
        bubbleEl.className = 'chat-bubble';
        
        // Remove markdown tags if any
        text = text.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>');

        var prefix = '';
        if (source === 'kb') prefix = '<span class="chat-source-tag kb">INFO</span>';
        else if (source === 'ai') prefix = '<span class="chat-source-tag ai">IA</span>';
        bubbleEl.innerHTML = prefix + text;

        var time = document.createElement('div');
        time.className = 'chat-time';
        time.textContent = timestamp || formatTime(new Date());

        wrap.appendChild(bubbleEl);
        wrap.appendChild(time);
        msg.appendChild(avatar);
        msg.appendChild(wrap);
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }

      function showTyping() {
        var msg = document.createElement('div');
        msg.className = 'chat-msg bot';
        msg.id = 'typingIndicator';
        msg.innerHTML = '<div class="chat-avatar"><img src="assets/logo.png" alt=""></div><div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>';
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
      function hideTyping() { var el = document.getElementById('typingIndicator'); if (el) el.remove(); }

      function renderQuickReplies() {
        var existing = document.querySelector('.chat-quick-replies');
        if (existing) existing.remove();
        var wrap = document.createElement('div');
        wrap.className = 'chat-quick-replies';
        CONFIG.quickReplies.forEach(function(text) {
          var chip = document.createElement('button');
          chip.className = 'chat-chip';
          chip.textContent = text;
          chip.onclick = function() { inputEl.value = text; doSendMessage(); };
          wrap.appendChild(chip);
        });
        messagesEl.appendChild(wrap);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }

      function saveHistory(sender, text, source) {
        var h = JSON.parse(localStorage.getItem('trekan_chat_history') || '[]');
        h.push({ sender: sender, text: text, source: source, time: formatTime(new Date()) });
        if (h.length > 100) h.splice(0, h.length - 100);
        localStorage.setItem('trekan_chat_history', JSON.stringify(h));
      }

      function loadHistory() {
        var h = JSON.parse(localStorage.getItem('trekan_chat_history') || '[]');
        if (h.length === 0) {
          setTimeout(function() {
            renderMessage(CONFIG.welcomeMessage, 'bot');
            saveHistory('bot', CONFIG.welcomeMessage);
            renderQuickReplies();
          }, 300);
        } else {
          h.forEach(function(m) { renderMessage(m.text, m.sender, m.time, m.source); });
          conversationHistory = h.slice(-12).map(function(m) {
            return {
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text.replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim()
            };
          });
        }
      }

      function clearChatHistory() {
        if (confirm('¿Borrar toda la conversación?')) {
          localStorage.removeItem('trekan_chat_history');
          conversationHistory = [];
          messagesEl.innerHTML = '';
          setTimeout(function() {
            renderMessage(CONFIG.welcomeMessage, 'bot');
            saveHistory('bot', CONFIG.welcomeMessage);
            renderQuickReplies();
          }, 200);
        }
      }
      clearBtn.addEventListener('click', clearChatHistory);

      function normalize(text) {
        return text.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[¿?¡!.,;:()"']/g, "").trim();
      }

      function findBestKBResponse(userText) {
        var nUser = normalize(userText);
        var best = null;
        for (var i = 0; i < KNOWLEDGE_BASE.length; i++) {
          var entry = KNOWLEDGE_BASE[i];
          for (var j = 0; j < entry.keywords.length; j++) {
            if (nUser.indexOf(normalize(entry.keywords[j])) !== -1) {
              best = entry; break;
            }
          }
          if (best) break;
        }
        return best ? best.response : null;
      }

      async function callAI(userMessage) {
        var history = conversationHistory.slice(-10);
        var messages = [ { role: "system", content: SYSTEM_PROMPT } ].concat(history, [{ role: "user", content: userMessage }]);
        try {
          var res = await fetch(PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: messages, model: AI_MODEL })
          });
          if (!res.ok) return "⏳ Hubo un pequeño problema al procesar tu mensaje. Escríbenos por WhatsApp.";
          var data = await res.json();
          return data.reply || CONFIG.fallbackMessage;
        } catch (e) {
          return "❌ No pude conectar. Revisa tu internet o escríbenos por WhatsApp.";
        }
      }

      async function doSendMessage() {
        var text = inputEl.value.trim();
        if (!text) return;

        renderMessage(text, 'user');
        saveHistory('user', text);
        conversationHistory.push({ role: "user", content: text });
        inputEl.value = '';
        inputEl.style.height = 'auto';

        var qr = document.querySelector('.chat-quick-replies');
        if (qr) qr.remove();

        showTyping();
        var kbResponse = findBestKBResponse(text);

        if (kbResponse) {
          setTimeout(function() {
            hideTyping();
            renderMessage(kbResponse, 'bot', null, 'kb');
            saveHistory('bot', kbResponse, 'kb');
            conversationHistory.push({ role: "assistant", content: kbResponse.replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim() });
          }, 600);
          return;
        }

        var aiResponse = await callAI(text);
        hideTyping();
        renderMessage(aiResponse, 'bot', null, 'ai');
        saveHistory('bot', aiResponse, 'ai');
        conversationHistory.push({ role: "assistant", content: aiResponse });
      }

      sendBtn.addEventListener('click', doSendMessage);
      inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSendMessage(); }
      });
      inputEl.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 90) + 'px';
      });
    })();
  </script>
`;

const startIndex = content.indexOf('<!-- Widget Chatbot Trekan -->');
const endIndex = content.indexOf('<!-- Cookie Consent Banner -->');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Chatbot updated successfully!');
} else {
  console.error('Could not find boundaries for chatbot replacement.');
}
