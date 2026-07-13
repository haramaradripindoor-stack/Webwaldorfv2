import fs from 'fs';

const configPath = 'C:\\Users\\FELIP\\.gemini\\config\\AGENTS.md';

const newRule = `
## Regla de Extracción Delegada (Apify Micro-servicios)
- **Priorización de Apify:** Cuando la agencia requiera extracción masiva e ininterrumpida de redes sociales (ej. Instagram) y se busque evitar bloqueos locales de IP o el agotamiento de cuentas fantasma (burner accounts), el agente debe priorizar la delegación del trabajo a la API de **Apify**.
- **Pool de Cuentas Apify:** La agencia dispone de múltiples llaves API de Apify segmentadas por cliente/proyecto (Trekan, Clínica PV, Haramara, etc.). El agente debe utilizar la llave correspondiente al proyecto (\`APIFY_API_KEY_*\` en \`.env.local\`) para ejecutar los *Actors* de Apify de forma remota.
- **Arquitectura Híbrida:** El script local (\`growth-engine\`) actuará únicamente como orquestador: llamará a la API de Apify, recibirá el JSON limpio de los perfiles extraídos, la IA local (Groq/Llama) los calificará, y finalmente el script orquestador los insertará en la base de datos Supabase del cliente.
`;

try {
  fs.appendFileSync(configPath, newRule, 'utf8');
  console.log("Regla de Apify añadida exitosamente a AGENTS.md");
} catch (error) {
  console.error("Error al añadir la regla:", error.message);
}
