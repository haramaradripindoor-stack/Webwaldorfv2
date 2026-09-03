const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let sock;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // Regla estricta: Deprecado en versiones recientes
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if(qr) {
            console.log('\n[TREKAN] Escanea este código QR con el WhatsApp de Coordinación:\n');
            qrcode.generate(qr, { small: true });
        }

        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexión cerrada. Reconectando...', shouldReconnect);
            if(shouldReconnect) {
                connectToWhatsApp();
            } else {
                console.log('Se cerró la sesión de WhatsApp de forma permanente.');
            }
        } else if(connection === 'open') {
            console.log('\n[TREKAN] WhatsApp conectado exitosamente. El servicio está listo.\n');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if(!msg.message) return;
        
        const sender = msg.key.remoteJid;
        
        // Regla estricta: Ignorar grupos y estados
        if (sender.endsWith('@g.us') || sender.includes('broadcast')) return;
        
        // Regla CERO BOTS:
        // Aquí NO hay auto-respuesta. Solo registramos la entrada si quisieramos,
        // pero Baileys permanece en silencio absoluto.
        console.log(`[AVISO] Mensaje entrante de ${sender}. (Baileys no responderá).`);
    });
}

connectToWhatsApp();

app.post('/api/send-message', async (req, res) => {
    try {
        const { phone, message } = req.body;
        
        if (!phone || !message) {
            return res.status(400).json({ error: 'Faltan parámetros (phone, message)' });
        }
        
        // Format phone to WhatsApp JID format (569... -> 569...@s.whatsapp.net)
        let formattedPhone = phone.toString().replace(/[^0-9]/g, '');
        
        // Asumimos formato chileno (+56). Si empieza con 9 y tiene 9 digitos, le agregamos el 56
        if (formattedPhone.length === 9 && formattedPhone.startsWith('9')) {
            formattedPhone = '56' + formattedPhone;
        } else if (formattedPhone.length === 8) {
            // A veces ponen 8 digitos sin el 9 inicial
            formattedPhone = '569' + formattedPhone;
        }

        if (!formattedPhone.endsWith('@s.whatsapp.net')) {
            formattedPhone = `${formattedPhone}@s.whatsapp.net`;
        }

        await sock.sendMessage(formattedPhone, { text: message });
        
        console.log(`[TREKAN] Mensaje enviado exitosamente a ${phone}`);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error enviando mensaje:', error);
        res.status(500).json({ error: 'Error enviando mensaje' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servicio Baileys corriendo en http://localhost:${PORT}`);
});
