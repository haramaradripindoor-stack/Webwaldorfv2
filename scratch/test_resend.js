const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    try {
        console.log("Enviando correo de prueba con la llave:", process.env.RESEND_API_KEY ? "Cargada" : "Falta");
        const data = await resend.emails.send({
            from: 'Colegio Waldorf Trekan <onboarding@resend.dev>',
            to: 'admision@colegiowaldorftrekan.cl',
            subject: 'Test de API Resend',
            html: '<p>Test</p>'
        });
        console.log("Respuesta de Resend:", data);
    } catch (error) {
        console.error("Error devuelto por Resend:", error);
    }
}

testEmail();
