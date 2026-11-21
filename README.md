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
- Administración: ver estadísticas, oferta académica, prematrículas, usuarios ficticios, configuración de la demo y descargar reportes de ejemplo en CSV o PDF.
- «Restablecer demo» elimina las modificaciones guardadas en el navegador.

La demo conserva la selección del visitante en una cookie; no utiliza MySQL ni comparte datos entre visitantes. Las cuentas, los usuarios y el período inicial son fijos. La creación de usuarios y períodos, el cambio de contraseña y la gestión real de sesiones están deshabilitados. Los reportes contienen datos sintéticos.

## Tecnologías

Next.js 16.4.5, React 19, TypeScript, Tailwind CSS, NextAuth, Recharts y jsPDF. El sistema original utilizaba Prisma y MySQL; esta copia de portafolio no los necesita.

## Desarrollo local

1. Instala Node.js 20 o posterior y ejecuta `npm install`.
2. Crea `.env.local` a partir de `.env.example` y asigna un valor aleatorio largo a `NEXTAUTH_SECRET`.
3. Ejecuta `npm run dev` y abre `http://localhost:3000`.
4. Comprueba `npm run typecheck` y `npm run build` antes de desplegar.

## Vercel

Importa **este repositorio limpio** (la carpeta `.portfolio-public` es la raíz del proyecto, no el repositorio original). En Vercel configura `NEXTAUTH_SECRET` con un valor aleatorio largo y estable para todos los despliegues. Vercel puede proporcionar la URL automáticamente si está activada la exposición de variables del sistema; si usas un dominio propio, configura `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL` con la URL HTTPS definitiva. No uses `http://localhost:3000` en Vercel. Comprueba el inicio de sesión de ambos perfiles en la URL desplegada antes de compartirla.

## Autoría y atribución

Proyecto académico original: Yanxmarcos Chan Vásquez y Eliaser Isai Ávila Zamudio. Adaptación de portafolio sobre el proyecto original. La licencia MIT adjunta conserva la atribución a Next.js Templates de la plantilla utilizada.
