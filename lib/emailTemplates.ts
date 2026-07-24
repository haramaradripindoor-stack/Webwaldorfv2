export const emailTemplates = [
  {
    id: 'charla-informativa',
    name: 'Invitación a Charla',
    description: 'Invita a familias nuevas a conocer la pedagogía.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://colegiowaldorftrekan.cl/wp-content/uploads/2023/12/logo-trekan.png" }, containerPadding: "30px 20px 10px", width: "120px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#A3B19B" } } },
              { type: "heading", values: { headingType: "h2", text: "🌿 Descubre una educación con sentido", color: "#2F483A", textAlign: "center", fontFamily: { label: "Georgia", value: "Georgia, serif" } } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #4A4A4A; font-size: 16px; line-height: 1.6; font-family: 'Helvetica', sans-serif;\">Estimada familia,<br/><br/>En la pedagogía Waldorf no solo educamos el intelecto, sino también el corazón y las manos de cada niño. Te invitamos cordialmente a nuestra próxima <strong>Charla Pedagógica para Nuevas Familias</strong>.<br/><br/>Será una instancia hermosa para conversar sobre el desarrollo infantil y cómo acompañamos los ritmos naturales de aprendizaje.</p>" } },
              { type: "button", values: { href: { values: { href: "https://colegiowaldorftrekan.cl/admision" } }, text: "Inscribirse a la Charla", backgroundColor: "#C86240", color: "#ffffff", borderRadius: "8px", containerPadding: "20px", padding: "14px 28px", fontWeight: "bold" } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #A3B19B; font-size: 12px; margin-top: 30px;\">Colegio Waldorf Trekan · Puerto Varas<br/><br/><a href=\"https://www.colegiowaldorftrekan.cl/darse-de-baja\" style=\"color: #A3B19B; text-decoration: underline;\">Darse de baja de nuestra lista</a></p>" } }
            ]
          }],
          values: { backgroundColor: "#F9F8F5" }
        }],
        values: { backgroundColor: "#EBE8E0", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  },
  {
    id: 'boletin-temporada',
    name: 'Boletín de Temporada',
    description: 'Envía novedades sobre los ritmos y festividades.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://colegiowaldorftrekan.cl/wp-content/uploads/2023/12/logo-trekan.png" }, containerPadding: "30px 20px 10px", width: "120px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#A3B19B" } } },
              { type: "heading", values: { headingType: "h2", text: "🍂 El Ritmo del Otoño en la Escuela", color: "#C86240", textAlign: "center", fontFamily: { label: "Georgia", value: "Georgia, serif" } } },
              { type: "text", values: { text: "<p style=\"text-align: left; color: #4A4A4A; font-size: 15px; line-height: 1.6; padding: 0 20px; font-family: 'Helvetica', sans-serif;\">Querida comunidad,<br/><br/>A medida que los días se acortan y la naturaleza comienza a replegarse hacia su interior, en la escuela también acompañamos este proceso de recogimiento.<br/><br/>Nuestros niños están preparando sus faroles con mucha dedicación para iluminar las noches frías que se avecinan. La Fiesta de los Faroles nos recuerda que, incluso en la oscuridad, cada uno de nosotros porta una luz interior.<br/><br/>Lee el artículo completo sobre cómo acompañar el ritmo de esta época en casa.</p>" } },
              { type: "button", values: { href: { values: { href: "https://colegiowaldorftrekan.cl/blog" } }, text: "Leer Reflexión Completa", backgroundColor: "#2F483A", color: "#ffffff", borderRadius: "8px", containerPadding: "20px", padding: "14px 28px", fontWeight: "bold" } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #A3B19B; font-size: 12px; margin-top: 30px;\">Colegio Waldorf Trekan · Puerto Varas<br/><br/><a href=\"https://www.colegiowaldorftrekan.cl/darse-de-baja\" style=\"color: #A3B19B; text-decoration: underline;\">Darse de baja de nuestra lista</a></p>" } }
            ]
          }],
          values: { backgroundColor: "#F9F8F5" }
        }],
        values: { backgroundColor: "#EBE8E0", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  },
  {
    id: 'recordatorio-entrevista',
    name: 'Recordatorio Entrevista',
    description: 'Recordatorio cálido de asistencia a entrevistas.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://colegiowaldorftrekan.cl/wp-content/uploads/2023/12/logo-trekan.png" }, containerPadding: "30px 20px 10px", width: "120px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#A3B19B" } } },
              { type: "heading", values: { headingType: "h2", text: "☕ Confirmación de Encuentro", color: "#2F483A", textAlign: "center", fontFamily: { label: "Georgia", value: "Georgia, serif" } } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #4A4A4A; font-size: 16px; line-height: 1.6; font-family: 'Helvetica', sans-serif;\">Hola,<br/><br/>Te escribimos desde el equipo de acogida del Colegio Waldorf Trekan para recordarte que se acerca nuestra entrevista familiar.<br/><br/>Para nosotros es un momento muy especial conocer a quienes desean formar parte de esta comunidad educativa. Te esperamos con los brazos abiertos y un té cálido.<br/><br/><span style=\"color: #7A7A7A; font-size: 13px;\">Si por alguna razón necesitas reagendar, por favor avísanos respondiendo a este correo para poder reorganizar nuestros ritmos.</span></p>" } },
              { type: "button", values: { href: { values: { href: "https://wa.me/56900000000" } }, text: "Confirmar Asistencia", backgroundColor: "#A3B19B", color: "#2F483A", borderRadius: "8px", containerPadding: "20px", padding: "14px 28px", fontWeight: "bold" } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #A3B19B; font-size: 12px; margin-top: 30px;\">Colegio Waldorf Trekan · Puerto Varas<br/><br/><a href=\"https://www.colegiowaldorftrekan.cl/darse-de-baja\" style=\"color: #A3B19B; text-decoration: underline;\">Darse de baja</a></p>" } }
            ]
          }],
          values: { backgroundColor: "#F9F8F5" }
        }],
        values: { backgroundColor: "#EBE8E0", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  },
  {
    id: 'apertura-admision',
    name: 'Apertura Admisión',
    description: 'Anuncio formal de matrículas abiertas.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://colegiowaldorftrekan.cl/wp-content/uploads/2023/12/logo-trekan.png" }, containerPadding: "30px 20px 10px", width: "120px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#A3B19B" } } },
              { type: "heading", values: { headingType: "h2", text: "🌻 Proceso de Admisión Abierto", color: "#C86240", textAlign: "center", fontFamily: { label: "Georgia", value: "Georgia, serif" } } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #4A4A4A; font-size: 16px; line-height: 1.6; font-family: 'Helvetica', sans-serif;\">Estimada familia,<br/><br/>Con mucha alegría les comunicamos que hemos abierto nuestro proceso de admisión para el próximo ciclo escolar.<br/><br/>Buscamos acoger a familias que resuenen profundamente con nuestra mirada sobre la infancia: un acompañamiento respetuoso, amoroso y conectado con las fuerzas vivas de la naturaleza.</p>" } },
              { type: "button", values: { href: { values: { href: "https://colegiowaldorftrekan.cl/postular" } }, text: "Iniciar Postulación", backgroundColor: "#2F483A", color: "#ffffff", borderRadius: "8px", containerPadding: "20px", padding: "14px 28px", fontWeight: "bold" } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #A3B19B; font-size: 12px; margin-top: 30px;\">Colegio Waldorf Trekan · Puerto Varas<br/><br/><a href=\"https://www.colegiowaldorftrekan.cl/darse-de-baja\" style=\"color: #A3B19B; text-decoration: underline;\">Darse de baja</a></p>" } }
            ]
          }],
          values: { backgroundColor: "#F9F8F5" }
        }],
        values: { backgroundColor: "#EBE8E0", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  },
  {
    id: 'nurturing-comunidad',
    name: 'Mensaje de los Maestros',
    description: 'Mensaje profundo y cálido sobre educación.',
    design: {
      body: {
        rows: [{
          cells: [1],
          columns: [{
            contents: [
              { type: "image", values: { src: { url: "https://colegiowaldorftrekan.cl/wp-content/uploads/2023/12/logo-trekan.png" }, containerPadding: "30px 20px 10px", width: "120px" } },
              { type: "divider", values: { containerPadding: "10px", padding: "10px", width: "100%", border: { borderTopWidth: "1px", borderTopStyle: "solid", borderTopColor: "#A3B19B" } } },
              { type: "heading", values: { headingType: "h2", text: "\"Recibe al niño con reverencia...\"", color: "#2F483A", textAlign: "center", fontFamily: { label: "Georgia", value: "Georgia, serif" } } },
              { type: "text", values: { text: "<p style=\"text-align: left; color: #4A4A4A; font-size: 15px; line-height: 1.6; padding: 0 20px; font-family: 'Helvetica', sans-serif;\"><em>\"...edúcalo con amor y envíalo adelante con libertad.\"</em> - Rudolf Steiner<br/><br/>A ti, que nos leíste hace algún tiempo, queremos enviarte un cálido saludo desde nuestro colegio.<br/><br/>La labor de la crianza en el mundo actual plantea inmensos desafíos. La sobreestimulación y el acelere de los tiempos nos exigen cultivar, más que nunca, espacios de calma, de juego libre y de desarrollo genuino de la voluntad.<br/><br/>Nuestras puertas siguen abiertas si deseas profundizar en este camino con nosotros.</p>" } },
              { type: "button", values: { href: { values: { href: "https://colegiowaldorftrekan.cl" } }, text: "Visitar Nuestra Web", backgroundColor: "#C86240", color: "#ffffff", borderRadius: "8px", containerPadding: "20px", padding: "14px 28px", fontWeight: "bold" } },
              { type: "text", values: { text: "<p style=\"text-align: center; color: #A3B19B; font-size: 12px; margin-top: 30px;\">Colegio Waldorf Trekan · Puerto Varas<br/><br/><a href=\"https://www.colegiowaldorftrekan.cl/darse-de-baja\" style=\"color: #A3B19B; text-decoration: underline;\">Darse de baja</a></p>" } }
            ]
          }],
          values: { backgroundColor: "#F9F8F5" }
        }],
        values: { backgroundColor: "#EBE8E0", fontFamily: { label: "Arial", value: "arial,helvetica,sans-serif" } }
      }
    }
  }
];
