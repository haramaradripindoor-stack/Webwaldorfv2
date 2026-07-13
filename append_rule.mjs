import fs from 'fs';
import path from 'path';

const configPath = 'C:\\Users\\FELIP\\.gemini\\config\\AGENTS.md';

const newRule = `
## Reglas de Cuentas Fantasma y Scraping Ilimitado (Burner Accounts)
- **Protección del Cliente:** NUNCA utilizar la cuenta oficial del cliente (ej. el Instagram oficial del colegio) para procesos automatizados, extracción de datos, ni para correr el modo "Aspiradora".
- **Cuentas Desechables (Burner):** Todo proceso de extracción masiva en el Growth Engine DEBE usar una cuenta fantasma desechable (ej. \`internoir2@gmail.com\`). 
- **Extracción Agresiva:** La función principal de esta cuenta fantasma es operar al máximo de su capacidad para extraer la mayor cantidad de prospectos posibles sin preocuparse por los *rate limits*. Se utilizará de forma agresiva e ilimitada hasta que la plataforma la detecte y la bloquee ("hasta que la pillen").
- **Continuidad del Negocio:** Cuando la cuenta satélite es baneada, el agente debe entender que esto es parte del diseño esperado. Simplemente se detiene la funcionalidad de esa cuenta específica y se reemplaza por otra nueva en las variables de entorno, sin alterar las estrategias maestras del ecosistema.
`;

fs.appendFileSync(configPath, newRule, 'utf8');
console.log("Regla añadida exitosamente a AGENTS.md");
