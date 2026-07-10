export const emailTemplates = [
  {
    id: 'oferta',
    name: 'Promoción Especial',
    description: 'Vende un servicio con descuento.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://www.clinicagap.cl/Logo1.png" }, containerPadding: "30px 20px 10px", width: "150px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#333333" } } },
              { type: "heading", values: { headingType: "h1", text: "🎁 Tienes un beneficio esperando", color: "#00d4a4", textAlign: "center", fontFamily: { label: "Helvetica", value: "Helvetica, Arial, sans-serif" } } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #E5E7EB; font-size: 16px; line-height: 1.6;\">Hola, soy Benjamín León.<br/><br/>La salud proactiva no espera. Por eso, durante las próximas 48 horas, hemos habilitado un descuento exclusivo del <strong>20% en tu próxima evaluación de Enfermería a Domicilio o Entrenamiento de Calistenia</strong>.<br/><br/>Haz clic abajo para asegurar tu cupo antes de que se agoten las horas de esta semana.</p>" } },
              { type: "button", values: { href: { values: { href: "https://www.clinicagap.cl/reservar" } }, text: "Asegurar mi cupo con descuento", backgroundColor: "#00d4a4", color: "#000000", borderRadius: "12px", containerPadding: "30px", padding: "15px 30px", fontWeight: "bold" } }
            ]
          }],
          values: { backgroundColor: "#0A0A10" }
        }],
        values: { backgroundColor: "#000000", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  },
  {
    id: 'recurso',
    name: 'Entrega de Recurso',
    description: 'Para descargas de Lead Magnets.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://www.clinicagap.cl/Logo1.png" }, containerPadding: "30px 20px 10px", width: "150px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#333333" } } },
              { type: "heading", values: { headingType: "h2", text: "📥 Tu guía gratuita está lista", color: "#ffffff", textAlign: "center" } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #9CA3AF; font-size: 16px; line-height: 1.6;\">Gracias por unirte a la comunidad de Clínica GAP.<br/><br/>Como enfermero, mi objetivo es darte las herramientas para que tomes el control de tu recuperación y rendimiento. Haz clic en el botón de abajo para descargar tu material gratuito y empezar a aplicar estos principios hoy mismo.</p>" } },
              { type: "button", values: { href: { values: { href: "https://www.clinicagap.cl/recursos" } }, text: "Descargar Guía Gratuita", backgroundColor: "#3B82F6", borderRadius: "12px", containerPadding: "30px", padding: "15px 30px", fontWeight: "bold" } }
            ]
          }],
          values: { backgroundColor: "#0A0A10" }
        }],
        values: { backgroundColor: "#000000", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  },
  {
    id: 'newsletter',
    name: 'Boletín Informativo',
    description: 'Envía tips de salud y novedades.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://www.clinicagap.cl/Logo1.png" }, containerPadding: "30px 20px 10px", width: "150px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#333333" } } },
              { type: "heading", values: { headingType: "h2", text: "💡 El error que frena tu progreso", color: "#00d4a4", textAlign: "center" } },
              { type: "text", values: { text: "<p style=\"color: #E5E7EB; font-size: 15px; line-height: 1.6; text-align: left; padding: 0 20px;\">Hola,<br/><br/>Esta semana en Puerto Varas hemos visto un patrón recurrente en nuestros pacientes. Muchos asumen que sentir molestias articulares es \"parte del proceso\".<br/><br/><strong>Recuerda: el dolor agudo no es normal; es una señal.</strong><br/><br/>Si quieres profundizar en este tema y aprender a cuidar tus articulaciones mientras entrenas de forma inteligente, lee nuestro último artículo completo preparado por nuestro equipo clínico.</p>" } },
              { type: "button", values: { href: { values: { href: "https://www.clinicagap.cl/blog" } }, text: "Leer el artículo completo", backgroundColor: "#333333", color: "#ffffff", borderRadius: "12px", containerPadding: "30px", padding: "12px 25px", fontWeight: "bold" } }
            ]
          }],
          values: { backgroundColor: "#0A0A10" }
        }],
        values: { backgroundColor: "#000000", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  },
  {
    id: 'recordatorio',
    name: 'Recordatorio Cita',
    description: 'Evita inasistencias de pacientes.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://www.clinicagap.cl/Logo1.png" }, containerPadding: "30px 20px 10px", width: "150px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#333333" } } },
              { type: "heading", values: { headingType: "h2", text: "📅 Confirmación de Atención Clínica", color: "#F59E0B", textAlign: "center" } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #E5E7EB; font-size: 16px; line-height: 1.6;\">Hola, te escribo desde la coordinación de Clínica GAP. Este correo es para confirmar tu próxima atención de enfermería a domicilio.<br/><br/>Nuestro equipo clínico ya está preparando todo el material estéril y el equipamiento necesario para tu visita.<br/><br/><span style=\"color: #9CA3AF; font-size: 14px;\">*Si por algún motivo de fuerza mayor necesitas reagendar, te pedimos que nos avises con al menos 24 hrs de anticipación para poder ayudar a otro paciente que lo necesite.</span></p>" } },
              { type: "button", values: { href: { values: { href: "https://wa.me/56975539913" } }, text: "Confirmar mi atención por WhatsApp", backgroundColor: "#10B981", borderRadius: "12px", containerPadding: "30px", padding: "15px 30px", fontWeight: "bold" } }
            ]
          }],
          values: { backgroundColor: "#0A0A10" }
        }],
        values: { backgroundColor: "#000000", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  },
  {
    id: 'reactivacion',
    name: 'Reactivación',
    description: 'Recupera pacientes antiguos.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://www.clinicagap.cl/Logo1.png" }, containerPadding: "30px 20px 10px", width: "150px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#333333" } } },
              { type: "heading", values: { headingType: "h2", text: "⏳ Ha pasado un tiempo...", color: "#E11D48", textAlign: "center" } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #E5E7EB; font-size: 16px; line-height: 1.6;\">El seguimiento constante es la diferencia entre un alivio temporal y una recuperación definitiva.<br/><br/>Hemos notado que hace un tiempo no revisamos tus avances. Para motivarte a retomar tu proceso y evaluar tus resultados, <strong>te hemos dejado un beneficio especial en tu ficha clínica.</strong><br/><br/>Retomemos el trabajo donde lo dejamos.</p>" } },
              { type: "button", values: { href: { values: { href: "https://www.clinicagap.cl/reservar" } }, text: "Retomar mis sesiones", backgroundColor: "#E11D48", color: "#ffffff", borderRadius: "12px", containerPadding: "30px", padding: "15px 30px", fontWeight: "bold" } }
            ]
          }],
          values: { backgroundColor: "#0A0A10" }
        }],
        values: { backgroundColor: "#000000", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  }
];
