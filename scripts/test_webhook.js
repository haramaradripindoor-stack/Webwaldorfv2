const http = require('http');

const payload = JSON.stringify({
  object: "instagram",
  entry: [{
    id: "17841470279792011",
    time: Date.now(),
    messaging: [{
      sender: { id: "TEST_USER_ID_123" },
      recipient: { id: "17841470279792011" },
      message: { text: "Hola soy María, busco información de cupos para 2do básico para mi hija Sofía." }
    }]
  }]
});

const req = http.request('http://localhost:3000/api/meta/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`RESPONSE: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`Error de conexión (probablemente el servidor no está corriendo): ${e.message}`);
});

req.write(payload);
req.end();
