# 🕵️‍♂️ Auditoría de Código: CRUD de Campañas (Admin)

**Archivos analizados:**
- `app/admin/campanas/page.tsx`
- `app/api/campaigns/contacts/route.ts`

---

## 1. Seguridad 🚨

### Vulnerabilidad Crítica: Ausencia de Autenticación/Autorización en la API
- **Problema:** Los métodos `GET`, `POST`, `PUT` y `DELETE` en `route.ts` utilizan el `SUPABASE_SERVICE_ROLE_KEY` (lo cual es correcto para operaciones admin porque evade las políticas de seguridad RLS de la base de datos). Sin embargo, **no hay validación de sesión ni autenticación** en el archivo. 
- **Riesgo:** Cualquier usuario externo que descubra el endpoint `/api/campaigns/contacts` puede listar, crear, alterar o eliminar permanentemente todos los leads y contactos.
- **Solución recomendada:** 
  1. Validar la sesión del usuario directamente en la ruta mediante `@supabase/ssr` (e.g., `const { data: { user } } = await supabase.auth.getUser()`) verificando si tiene rol de admin, **O**
  2. Asegurarse de que el archivo `middleware.ts` en la raíz del proyecto esté bloqueando estrictamente cualquier solicitud hacia `/api/campaigns/*` si no existe una sesión de administrador válida.

### Control de Inyección (SQL Injection / XSS)
- **Aprobado:** Al utilizar Supabase (`.select`, `.update`, `.in`, `.eq`), la librería subyacente maneja el escape de los parámetros, lo que te protege de inyecciones SQL tradicionales.
- **Prevención XSS (Cross-Site Scripting):** En la UI de React `page.tsx`, los campos se renderizan por defecto escapando el HTML, por lo que está protegido. Ten precaución si en el futuro se planea usar `dangerouslySetInnerHTML` en alguna previsualización del dashboard.

---

## 2. Rendimiento (Performance) ⚡

### Cuello de Botella: Fetching y Procesamiento Masivo (Sin Paginación)
- **Problema:** El método `GET` extrae absolutamente todos los registros de `leads_admision` y `chat_leads` sin límite de filas. Luego, itera sobre los arrays para unificar y eliminar duplicados en memoria usando un `Set`.
- **Riesgo:** Esta estrategia funciona bien para unos cientos de correos. Sin embargo, cuando la base de datos crezca a miles o decenas de miles, el consumo de memoria en la función Serverless se disparará (posible timeout), el payload de respuesta JSON será masivo y el navegador del cliente se congelará al intentar renderizar la tabla completa de contactos.
- **Solución recomendada:**
  1. **A nivel de Base de Datos:** Crear una Vista SQL (View) o función RPC (Stored Procedure) en Supabase que haga el `UNION` y el `DISTINCT` directo en Postgres, para evitar cargar la memoria de Node.js.
  2. **A nivel de Frontend/API:** Implementar paginación (offset y limit) y un buscador por servidor, en lugar de manejar todos los registros de golpe en el estado de React.

---

## 3. Mejores Prácticas de Next.js (App Router) y React 🛠️

### Caché Estático Inesperado en Next.js (App Router)
- **Problema:** En el App Router, las funciones `GET()` que no utilizan el objeto `Request` (ni llamadas dinámicas como `cookies()`) pueden ser cacheadas estáticamente durante la fase de *build*. 
- **Riesgo:** Si ocurre el *Static Data Fetching*, el dashboard mostrará información obsoleta (leads que ya fueron eliminados, o falta de nuevos leads) hasta que se recompile la app.
- **Solución:**
  En `app/api/campaigns/contacts/route.ts`, añade al inicio del archivo:
  ```typescript
  export const dynamic = 'force-dynamic';
  ```
  O alternativamente, inyecta `req: Request`: `export async function GET(req: Request) { ... }` (aunque se recomienda `force-dynamic` para mayor claridad).

### Antipatrón en React: `setTimeout` en `useEffect`
- **Problema:** En `page.tsx` línea 134:
  ```typescript
  useEffect(() => {
    const timer = setTimeout(() => { fetchData(); }, 0);
    return () => clearTimeout(timer);
  }, []);
  ```
- **Solución:** Envolver `fetchData` en un timeout de 0ms no es necesario para operaciones asíncronas nativas. Puedes invocar `fetchData()` directamente dentro del `useEffect` para tener un código más limpio.

### Manejo de Tipos Estrictos (TypeScript)
- **Problema:** El uso repetido de `catch (error: any)` es considerado una mala práctica en TS moderno.
- **Solución:** Usar `catch (error: unknown)` y luego chequear con `if (error instanceof Error)` para extraer el `.message` de forma segura.

### Interfaz de Usuario y DOM
- **Aprobado:** El uso de carga dinámica para el editor de email (`next/dynamic` con `ssr: false`) está implementado correctamente para evitar errores de hidratación de objetos tipo *Window*.
- **Aprobado:** Excelentes detalles estéticos al usar Framer Motion para el modal y notificaciones.
