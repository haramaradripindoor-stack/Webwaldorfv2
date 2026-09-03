with open('whatsapp-service/server.js', 'r') as f:
    content = f.read()

# Add global state variables
if "let currentStatus = 'disconnected';" not in content:
    content = content.replace("let sock;", "let sock;\nlet currentStatus = 'disconnected';\nlet currentQr = null;")

# Update status in connection.update
qr_logic = """        if(qr) {
            currentQr = qr;
            currentStatus = 'qr';
            console.log('\n[TREKAN] Escanea este código QR con el WhatsApp de Coordinación:\n');
            qrcode.generate(qr, { small: true });
        }"""
content = content.replace("""        if(qr) {
            console.log('\\n[TREKAN] Escanea este código QR con el WhatsApp de Coordinación:\\n');
            qrcode.generate(qr, { small: true });
        }""", qr_logic)

close_logic = """        if(connection === 'close') {
            currentStatus = 'disconnected';
            currentQr = null;
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;"""
content = content.replace("""        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;""", close_logic)

open_logic = """        } else if(connection === 'open') {
            currentStatus = 'connected';
            currentQr = null;
            console.log('\\n[TREKAN] WhatsApp conectado exitosamente. El servicio está listo.\\n');
        }"""
content = content.replace("""        } else if(connection === 'open') {
            console.log('\\n[TREKAN] WhatsApp conectado exitosamente. El servicio está listo.\\n');
        }""", open_logic)

# Add GET /api/status endpoint
status_endpoint = """
app.get('/api/status', (req, res) => {
    res.json({ status: currentStatus, qr: currentQr });
});

app.post('/api/send-message',"""
if "app.get('/api/status'" not in content:
    content = content.replace("app.post('/api/send-message',", status_endpoint)

with open('whatsapp-service/server.js', 'w') as f:
    f.write(content)
print("Backend Patched")
