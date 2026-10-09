const fs = require('fs');

let routeContent = fs.readFileSync('app/api/meta/webhook/route.ts', 'utf8');

const oldPrompt = `Eres el Asistente del Colegio Waldorf Trekan.
Lee el mensaje del usuario y extrae la información en JSON estricto.
Trata de inferir si están preguntando por un curso específico (ej. "1ro básico"). Si no, pon "Por consultar".
REGLA ESTRICTA DE PRIVACIDAD: NUNCA incluyas nombres propios de adultos o niños en el resumen. Limítate estrictamente a reportar la intención de la consulta, la edad o el curso de interés.
Formato:
{
  "curso_postula": "El curso o 'Por consultar'",
  "resumen": "Resumen del mensaje en máximo 8 palabras",
  "respuesta_sugerida": "Una respuesta breve (1-2 oraciones) cálida y estilo Waldorf para enviar al papá agradeciendo su contacto y diciendo que un humano le escribirá pronto con más detalles."
}`;

const newPrompt = `Eres el Asistente del Colegio Waldorf Trekan.
Lee el mensaje del usuario y extrae la información en JSON estricto.
Trata de inferir si están preguntando por un curso específico (ej. "1ro básico"). Si no, pon "Por consultar".
Extrae el nombre del apoderado y del niño/a si los mencionan explícitamente en el mensaje. Si no se mencionan, pon "No proporcionado".
Formato:
{
  "nombre_apoderado": "Nombre del adulto o 'No proporcionado'",
  "nombre_nino": "Nombre del niño/a o 'No proporcionado'",
  "curso_postula": "El curso o 'Por consultar'",
  "resumen": "Resumen del mensaje en máximo 8 palabras"
}`;

routeContent = routeContent.replace(oldPrompt, newPrompt);

// Actualizar también la inserción en Supabase
const oldInsert = `nombre_apoderado: 'IG User: ' + senderId, 
      email_apoderado: 'No proporcionado',
      telefono_apoderado: 'No proporcionado',
      nombre_nino: 'Por consultar',`;

const newInsert = `nombre_apoderado: iaResult.nombre_apoderado && iaResult.nombre_apoderado !== 'No proporcionado' ? iaResult.nombre_apoderado : 'IG User: ' + senderId, 
      email_apoderado: 'No proporcionado',
      telefono_apoderado: 'No proporcionado',
      nombre_nino: iaResult.nombre_nino || 'Por consultar',`;

routeContent = routeContent.replace(oldInsert, newInsert);

fs.writeFileSync('app/api/meta/webhook/route.ts', routeContent);
console.log("Archivo route.ts actualizado con éxito para capturar nombres.");
