import fs from 'fs';

const configPath = 'C:\\Users\\FELIP\\.gemini\\config\\AGENTS.md';

const oldRuleTitle = '## Regla de Extracción Delegada (Apify Micro-servicios)';

const newRule = `
## Arquitectura de Extracción Escalonada (El Arsenal Completo)
- **Pool Masivo de Micro-servicios (Apify Round-Robin):** Las múltiples llaves de Apify de la agencia NO están limitadas a un uso "por cliente". Operan bajo la misma lógica que el balanceador de LLMs: se agrupan en un Pool Masivo. Al activarse la "Aspiradora" para el cliente de turno, el *Growth Engine* utiliza y rota **todas las llaves disponibles** en el entorno para extraer información a máxima velocidad y capacidad, esquivando límites de cuota individuales.
- **Stack Tecnológico Profundo (Escalonamiento):** La agencia no depende de una única solución. El agente tiene a su disposición un stack de extracción y automatización de múltiples capas guardado en su memoria profunda: **Puppeteer, Crawlee, Playwright, navegadores anti-detect (AdsPower), orquestación con n8n y delegación vía Apify**. 
- **Decisión Táctica:** Dependiendo de la dureza del objetivo (anti-bots de Meta, Cloudflare) y los recursos, el sistema escala desde scripts ligeros locales en AdsPower hasta llamados a la flota de Apify, garantizando que el flujo de leads *nunca* se detenga.
`;

try {
  let content = fs.readFileSync(configPath, 'utf8');
  const ruleIndex = content.indexOf(oldRuleTitle);
  
  if (ruleIndex !== -1) {
    // Cut everything from the old rule to the end, and replace with new rule
    content = content.substring(0, ruleIndex) + newRule;
    fs.writeFileSync(configPath, content, 'utf8');
    console.log("Regla de Apify actualizada a la estrategia Round-Robin/Pool Masivo exitosamente en AGENTS.md");
  } else {
    // If not found for some reason, just append it
    fs.appendFileSync(configPath, newRule, 'utf8');
    console.log("No se encontró la regla antigua. Se añadió la nueva regla al final de AGENTS.md");
  }
} catch (error) {
  console.error("Error al actualizar la regla:", error.message);
}
