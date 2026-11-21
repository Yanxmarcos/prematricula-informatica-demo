# Prematrícula Informática · demo de portafolio

Demostración interactiva de un sistema de prematrícula para la Escuela Profesional de Ingeniería Informática. La aplicación original fue un proyecto académico; esta versión utiliza exclusivamente datos ficticios y **no registra prematrículas reales ni presta un servicio de la universidad**.

## Acceso a la demo

| Perfil | Código | Contraseña |
| --- | --- | --- |
| Estudiante | `0000000001` | `demo2026` |
| Administración | `0000000002` | `demo2026` |

También puedes seleccionar el perfil desde la pantalla de acceso. Estas claves son deliberadamente públicas: no protegen datos reales.

## Funciones

- Estudiante: explorar el período y la malla curricular, seleccionar cursos, registrar una prematrícula de prueba, consultar el historial y editar el perfil ficticio.
- Administración: ver estadísticas, oferta académica, prematrículas, usuarios ficticios, configuración de la demo y descargar reportes de ejemplo.
- «Restablecer demo» elimina las modificaciones guardadas en el navegador.

La demo conserva la selección del visitante en una cookie; no utiliza MySQL ni comparte datos entre visitantes. Las cuentas, los usuarios y el período inicial son fijos. La creación de usuarios y períodos, el cambio de contraseña y la gestión real de sesiones están deshabilitados. Los reportes contienen datos sintéticos.

## Tecnologías

Next.js 16.4.5, React 19, TypeScript, Tailwind CSS, NextAuth, Recharts, jsPDF y SheetJS. El sistema original utilizaba Prisma y MySQL; esta copia de portafolio no los necesita.

## Desarrollo local

1. Instala Node.js 20 o posterior y ejecuta `npm install`.
2. Crea `.env.local` a partir de `.env.example` y asigna un valor aleatorio largo a `NEXTAUTH_SECRET`.
3. Ejecuta `npm run dev` y abre `http://localhost:3000`.
4. Comprueba `npm run typecheck` y `npm run build` antes de desplegar.

## Vercel

Importa **este repositorio limpio**, configura `NEXTAUTH_SECRET` como variable de entorno y despliega. Si Vercel requiere una URL canónica para NextAuth, configura `NEXTAUTH_URL` con el dominio definitivo (`https://prematricula.info`). Verifica primero la URL temporal de Vercel y después añade `prematricula.info` y `www.prematricula.info` en Settings → Domains; aplica en Cloudflare los valores DNS que Vercel indique para el proyecto.

## Autoría y atribución

Proyecto académico original: Yanxmarcos Chan Vásquez y Eliaser Isai Ávila Zamudio. Adaptación de portafolio sobre el proyecto original. La licencia MIT adjunta conserva la atribución a Next.js Templates de la plantilla utilizada.
