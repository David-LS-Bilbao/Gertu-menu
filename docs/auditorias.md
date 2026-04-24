# Auditorías — GertuMenu / Local Plate Family

---

## Auditoría 1 — 2026-04-24

### Alcance

Revisión completa del código fuente, dependencias y configuración del proyecto antes de su primera ejecución local.

---

### Informe de acciones realizadas

| Acción | Resultado |
|---|---|
| `npm install` | 492 paquetes instalados correctamente |
| Bug Celiaquía (`src/lib/menuGenerator.ts:88-100`) | Corregido — se extrae `m.conditions` y se añade `conditions.has("celiaquía")` al filtro `noGluten` |
| Título HTML (`index.html`) | Corregido — todas las ocurrencias de "EuskoTrace" reemplazadas por "GertuMenu" |
| Tests (`npm test`) | **1/1 pasado** |
| Build de producción (`npm run build`) | **Sin errores** — 1732 módulos compilados |

---

### Tabla de bugs y errores

| # | Archivo | Severidad | Tipo | Descripción | Estado |
|---|---|---|---|---|---|
| 1 | — | **Crítico** | Entorno | `node_modules` vacío — dependencias sin instalar, la app no arranca | Corregido |
| 2 | `src/lib/menuGenerator.ts:99` | **Alto** | Lógico | `intolerances.has("celiaquía")` busca en el set equivocado — Celiaquía es un `Condition`, no un `Intolerance`, así que el filtro de gluten nunca se activaba para celíacos | Corregido |
| 3 | `index.html:6,21,22` | **Medio** | Branding | Título y metas OG/Twitter decían "EuskoTrace" (nombre viejo del proyecto) en lugar de "GertuMenu" | Corregido |
| 4 | `index.html:2` | **Medio** | Accesibilidad | `<html lang="en">` — la app está íntegramente en español, debería ser `lang="es"` | Pendiente |
| 5 | `src/lib/menuGenerator.ts:143-148` | **Medio** | Lógico | Variedad `"monótono"` suma 0 al cursor, lo que repite exactamente el mismo plato en cada comida y cada día. El label en UI dice "Pocos platos repetidos", que es engañoso | Pendiente |
| 6 | `src/pages/Family.tsx:103-105` | **Bajo** | Rendimiento | `useEffect` que llama a `saveFamily(members)` se dispara en el mount inicial (justo después de cargar de localStorage), haciendo una escritura innecesaria en cada carga de página | Pendiente |
| 7 | `index.html:19` | **Bajo** | Branding | `<meta name="twitter:site" content="@Lovable">` — referencia al nombre de la plataforma de prototipado, no al proyecto | Pendiente |
| 8 | — | **Bajo** | Seguridad | `npm audit` reporta 18 vulnerabilidades (3 bajas, 6 moderadas, 9 altas) en las dependencias instaladas | Pendiente |
| 9 | `src/test/example.test.ts` | **Bajo** | Calidad | El único test existente es un placeholder (`expect(true).toBe(true)`). No hay ninguna cobertura real de la lógica de negocio | Pendiente |

**Resumen**: 3 corregidos, 6 pendientes.

---

### Próximos pasos recomendados

1. **Corregir `lang="es"`** en `index.html` — mejora accesibilidad y SEO, cambio de una línea.
2. **Corregir variedad monótona** en `menuGenerator.ts` — el cursor con incremento 0 repite siempre el mismo plato; revisar si el comportamiento esperado es "pocos repetidos" o "todos iguales".
3. **Verificar la app en el navegador** — ejecutar `npm run dev` y recorrer las 4 rutas (`/`, `/familia`, `/menu`, `/puntos`).
4. **Revisar vulnerabilidades** — ejecutar `npm audit` para evaluar cuáles aplicar sin romper compatibilidad.
5. **Escribir tests reales** — cubrir al menos `generateMenu` (filtros de alérgenos, dietas, Celiaquía) y `sanitizeInput`.
