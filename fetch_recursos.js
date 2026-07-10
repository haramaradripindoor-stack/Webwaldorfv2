process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
fetch('http://www.colegiowaldorftrekan.cl/recursos-waldorf-chile.html')
  .then(r => r.text())
  .then(text => {
    // Buscar la sección o main que contiene el texto de la página
    let match = text.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (!match) match = text.match(/<section[^>]*>([\s\S]*?)<\/section>/i);
    
    if (match) {
        // limpiar HTML tags simples para leer
        console.log(match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 3000));
    } else {
        console.log("No content found");
    }
  });
