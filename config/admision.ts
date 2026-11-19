/**
 * INVARIANTE ARQUITECTÓNICO DE ADMISIÓN (Single Source of Truth)
 * 
 * Este módulo centraliza de forma atómica y determinista el año y los estados
 * de la campaña de admisión del Colegio Waldorf Trekan.
 * 
 * Erradica discrepancias de SEO, snippets desactualizados de Googlebot y
 * errores de prospección externa.
 */

// Override maestro (garantiza exactitud operativa)
const MANUAL_ACTIVE_YEAR = 2027;

function resolveAdmissionsYear(): number {
  if (MANUAL_ACTIVE_YEAR) {
    return MANUAL_ACTIVE_YEAR;
  }
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1 (enero) a 12 (diciembre)
  
  // En Chile el ciclo escolar inicia en marzo. Desde agosto (mes 8) la campaña
  // activa pasa a ser la del año siguiente.
  return currentMonth >= 8 ? currentYear + 1 : currentYear;
}

const activeYearNum = resolveAdmissionsYear();
const nextYearNum = activeYearNum + 1;

export const ADMISION_CONFIG = {
  activeYear: String(activeYearNum),
  nextYear: String(nextYearNum),
  activeYearNumber: activeYearNum,
  title: `Admisión ${activeYearNum}`,
  badge: `Admisión ${activeYearNum}`,
  status: 'Abierta',
  statusDescription: `Proceso de Admisión ${activeYearNum} Abierto`,
  vacantesNotice: `El Colegio Waldorf Trekan cuenta con vacantes limitadas para la admisión ${activeYearNum}.`,
  emailSubject: `Postulación Proceso de Admisión ${activeYearNum} - Colegio Waldorf Trekan`,
  whatsappIntro: `Hola, deseo consultar por vacantes e información para la Admisión ${activeYearNum}.`,
  systemPromptNotice: `- Admisión ${activeYearNum}: El proceso se encuentra oficialmente ABIERTO para Jardín Infantil y Enseñanza Básica. Toda respuesta y recomendación a familias debe referenciar estrictamente la Admisión ${activeYearNum}.`,
} as const;

export default ADMISION_CONFIG;
