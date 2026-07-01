-- Actualizar la tabla chat_leads para incluir los campos del formulario de Admisión

ALTER TABLE public.chat_leads
ADD COLUMN IF NOT EXISTS apoderado_email TEXT,
ADD COLUMN IF NOT EXISTS apoderado_telefono TEXT,
ADD COLUMN IF NOT EXISTS horario_contacto TEXT,
ADD COLUMN IF NOT EXISTS nino_nombre TEXT,
ADD COLUMN IF NOT EXISTS nino_edad TEXT,
ADD COLUMN IF NOT EXISTS curso_postula TEXT,
ADD COLUMN IF NOT EXISTS postulan_mas_hijos TEXT,
ADD COLUMN IF NOT EXISTS nee TEXT,
ADD COLUMN IF NOT EXISTS nee_detalle TEXT,
ADD COLUMN IF NOT EXISTS ciudad TEXT,
ADD COLUMN IF NOT EXISTS traslado TEXT,
ADD COLUMN IF NOT EXISTS nivel_interes TEXT,
ADD COLUMN IF NOT EXISTS dudas_principales TEXT,
ADD COLUMN IF NOT EXISTS comentarios TEXT;

-- Añadir los nuevos estados para el flujo de admisión (si no están, estado es texto)
-- 'nuevo' -> 'ingreso'
-- 'contactado' -> 'entrevista'
-- 'pagado' -> 'aceptado'
-- (Añadiremos matriculado)
