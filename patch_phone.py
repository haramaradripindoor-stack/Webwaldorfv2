with open('whatsapp-service/server.js', 'r') as f:
    content = f.read()

phone_logic = """        let formattedPhone = phone.toString().replace(/[^0-9]/g, '');
        
        // Asumimos formato chileno (+56). Si empieza con 9 y tiene 9 digitos, le agregamos el 56
        if (formattedPhone.length === 9 && formattedPhone.startsWith('9')) {
            formattedPhone = '56' + formattedPhone;
        } else if (formattedPhone.length === 8) {
            // A veces ponen 8 digitos sin el 9 inicial
            formattedPhone = '569' + formattedPhone;
        }

        if (!formattedPhone.endsWith('@s.whatsapp.net')) {
            formattedPhone = `${formattedPhone}@s.whatsapp.net`;
        }"""

content = content.replace("""        let formattedPhone = phone.toString().replace(/[^0-9]/g, '');
        if (!formattedPhone.endsWith('@s.whatsapp.net')) {
            formattedPhone = `${formattedPhone}@s.whatsapp.net`;
        }""", phone_logic)

with open('whatsapp-service/server.js', 'w') as f:
    f.write(content)
