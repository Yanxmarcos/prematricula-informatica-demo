import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import courses from "./cursos.json";
import { jsPDF } from "jspdf";

// This demo stores only synthetic changes in a browser cookie. There is no shared database.
type State = { enrollment?: any; deleted?: boolean; deletedFixture?: boolean; config?: Record<string, string>; profile?: any };
const cookieName = "prematricula_demo";
const period = { id: 1, semestre: "II", anio: 2026, tipo: "REGULAR", descripcion: "Período de demostración", fecha_inicio: "2026-01-01T00:00:00.000Z", fecha_fin: "2027-12-31T23:59:59.000Z", activo: true };
const types = [
  { id: 1, nombre: "Regular", creditos_max: 22, creditos_min: 12, activo: true },
  { id: 2, nombre: "Especial", creditos_max: 12, creditos_min: 6, activo: true },
  { id: 3, nombre: "Excepcional", creditos_max: 26, creditos_min: 18, activo: true },
];
const defaultConfig = [
  ["CREDITOS_MAX_REGULAR", "22", "number", "Créditos máximos para matrícula regular"],
  ["CREDITOS_MAX_ESPECIAL", "12", "number", "Créditos máximos para matrícula especial"],
  ["CREDITOS_MAX_EXCEPCIONAL", "26", "number", "Créditos máximos para matrícula excepcional"],
  ["CREDITOS_MAX_VERANO", "8", "number", "Créditos máximos en verano"],
  ["PROMEDIO_MINIMO_EXCEPCIONAL", "16", "number", "Promedio mínimo para matrícula excepcional"],
  ["PREMATRICULA_ABIERTA", "true", "boolean", "Permite registrar prematrículas"],
  ["PREMATRICULA_EDITABLE", "true", "boolean", "Permite editar prematrículas"],
].map(([clave, valor, tipo, descripcion]) => ({ clave, valor, tipo, descripcion }));
const student = { id: 1, codigo_estudiante: "0000000001", correo_inst: "alex@example.invalid", nombres: "Alex", apellido_paterno: "Demo", apellido_materno: "", activo: true, rol: { nombre: "estudiante" }, rol_id: 1, creado_en: "2026-01-01T00:00:00.000Z", ultimo_acesso: null };
const admin = { ...student, id: 2, codigo_estudiante: "0000000002", correo_inst: "sam@example.invalid", nombres: "Sam", rol: { nombre: "administrador" }, rol_id: 2 };
const exampleStudent = { ...student, id: 3, codigo_estudiante: "0000000003", correo_inst: "taylor@example.invalid", nombres: "Taylor" };
const fixture = { id: 101, usuario_id: 3, usuario: exampleStudent, periodo: period, periodo_id: 1, tipo_matricula: types[0], tipo_matricula_id: 1, promedio: 15.5, creado_en: "2026-11-01T12:00:00.000Z", cursos: courses.filter(c => c.ciclo === 2).slice(0, 4).map((c, i) => ({ id: i + 1, curso_codigo: c.codigo, numero_vez: 1, curso: c })) };

function readState(req: NextRequest): State {
  try { return JSON.parse(decodeURIComponent(req.cookies.get(cookieName)?.value || "{}")); }
  catch { return {}; }
}
function respond(value: unknown, state?: State, status = 200) {
  const res = NextResponse.json(value, { status });
  if (state) res.cookies.set(cookieName, encodeURIComponent(JSON.stringify(state)), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
function enrollment(state: State) {
  if (!state.enrollment || state.deleted) return null;
  const e = state.enrollment;
  return { id: 102, usuario_id: 1, usuario: student, periodo: period, periodo_id: 1, tipo_matricula: types.find(t => t.id === e.tipo_matricula_id) || types[0], tipo_matricula_id: e.tipo_matricula_id, promedio: e.promedio, creado_en: e.creado_en || new Date().toISOString(), cursos: (e.cursos || []).map((item: any, i: number) => ({ id: i + 10, curso_codigo: item.curso_codigo, numero_vez: item.numero_vez, curso: courses.find(c => c.codigo === item.curso_codigo) })) };
}
function list(state: State) { const own = enrollment(state); return [...(own ? [own] : []), ...(state.deletedFixture ? [] : [fixture])]; }
function summary(p: any) { return { id: p.id, periodo: `${p.periodo.semestre}-${p.periodo.anio}`, tipo_matricula: p.tipo_matricula.nombre, total_creditos: p.cursos.reduce((n: number, c: any) => n + (c.curso?.creditos || 0), 0), total_cursos: p.cursos.length, creado_en: p.creado_en, usuario: p.usuario, promedio: p.promedio, cursos: p.cursos.map((c: any) => ({ codigo: c.curso_codigo, nombre: c.curso?.nombre, numero_vez: c.numero_vez, creditos: c.curso?.creditos, tipo: c.curso?.tipo, ciclo: c.curso?.ciclo })) }; }

export async function handleDemo(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return respond({ error: "No autorizado" }, undefined, 401);
  const path = req.nextUrl.pathname.replace(/^\/api\//, "");
  const method = req.method;
  const state = readState(req);
  const isAdmin = session.user.rol === "administrador";
  if (path.startsWith("admin/") && !isAdmin) return respond({ error: "Sin permisos" }, undefined, 403);
  if (path.startsWith("estudiante/") && !isAdmin && session.user.rol !== "estudiante") return respond({ error: "Sin permisos" }, undefined, 403);
  const body = method === "GET" ? {} : await req.json().catch(() => ({}));
  const params = req.nextUrl.searchParams;

  if (path === "auth/session-track") {
    if ((body as any).reset === true) {
      const res = respond({ success: true });
      res.cookies.delete(cookieName);
      return res;
    }
    return respond({ success: true });
  }
  if (path === "estudiante/dashboard") {
    const own = enrollment(state);
    return respond({ periodo_activo: period, tiene_prematricula: !!own, prematricula_actual: own ? summary(own) : null, historial: own ? [summary(own)] : [], configuracion: { prematricula_abierta: state.config?.PREMATRICULA_ABIERTA !== "false", prematricula_editable: true, creditos_max_regular: 22 } });
  }
  if (path === "estudiante/periodos") {
    const own = enrollment(state);
    return respond({ periodos: [{ ...period, label: "II-2026" }], periodo_activo: { id: 1, semestre: "II", anio: 2026, label: "II-2026" }, tiene_prematricula: !!own, prematricula_existente: own ? { ...summary(own), cursos: summary(own).cursos } : null });
  }
  if (path === "estudiante/malla") return respond(courses);
  if (path.endsWith("tipos-matricula")) return respond(types);
  if (path === "estudiante/historial") { const own = enrollment(state); return respond(own ? [summary(own)] : []); }
  if (path === "estudiante/prematricula" && method === "POST") {
    if (isAdmin) return respond({ error: "Accede con el perfil estudiante para registrar una prematrícula." }, undefined, 403);
    const input = body as any;
    const selectedType = types.find(t => t.id === input.tipo_matricula_id);
    if (!Array.isArray(input.cursos) || !input.cursos.length || input.cursos.length > 10 || !selectedType || input.periodo_id !== 1 || typeof input.promedio !== "number" || input.promedio < 0 || input.promedio > 20 || input.cursos.some((c: any) => !courses.some(x => x.codigo === c.curso_codigo) || !Number.isInteger(c.numero_vez) || c.numero_vez < 1 || c.numero_vez > 4) || new Set(input.cursos.map((c: any) => c.curso_codigo)).size !== input.cursos.length) return respond({ error: "Selección de cursos inválida" }, undefined, 400);
    const credits = input.cursos.reduce((sum: number, c: any) => sum + (courses.find(x => x.codigo === c.curso_codigo)?.creditos || 0), 0);
    if (credits > selectedType.creditos_max || credits < selectedType.creditos_min) return respond({ error: `Selecciona entre ${selectedType.creditos_min} y ${selectedType.creditos_max} créditos.` }, undefined, 400);
    if (selectedType.nombre === "Excepcional" && input.promedio < 16) return respond({ error: "La matrícula excepcional requiere promedio mínimo de 16." }, undefined, 400);
    state.enrollment = { ...input, creado_en: new Date().toISOString() }; state.deleted = false;
    return respond({ success: true, message: "Prematrícula demo registrada", data: enrollment(state) }, state);
  }
  if (path === "estudiante/perfil" || path === "admin/perfil") {
    if (method === "PUT") state.profile = { ...(body as object) };
    return respond({ ...(isAdmin ? admin : student), ...state.profile }, method === "PUT" ? state : undefined);
  }
  if (path === "estudiante/cambiar-password") return respond({ error: "Las claves de demostración son públicas y no se pueden cambiar." }, undefined, 400);
  if (path === "admin/periodos") return method === "GET" ? respond([period]) : respond({ error: "Los períodos son fijos en esta demo." }, undefined, 400);
  if (path.startsWith("admin/periodos/")) return method === "GET" ? respond(period) : respond({ error: "Los períodos son fijos en esta demo." }, undefined, 400);
  if (path === "admin/dashboard") {
    const enrollments = list(state); const credit = enrollments.reduce((n, p) => n + summary(p).total_creditos, 0);
    const counts = courses.filter(c => c.ciclo === 2).map(c => ({ codigo: c.codigo, nombre: c.nombre, total: enrollments.filter(p => p.cursos.some((x: any) => x.curso_codigo === c.codigo)).length }));
    return respond({ periodo_activo: period, total_estudiantes: enrollments.length, total_cursos: enrollments.reduce((n,p) => n + p.cursos.length, 0), total_creditos: credit, promedio_creditos: enrollments.length ? credit / enrollments.length : 0, por_ciclo: [{ ciclo: 2, total: enrollments.length }], por_tipo_matricula: [{ tipo: "Regular", total: enrollments.length }], top_cursos: counts.slice(0,5), bottom_cursos: [...counts].reverse().slice(0,5) });
  }
  if (path === "admin/prematriculas") {
    let data = list(state);
    if (params.get("search")) { const q = params.get("search")!.toLowerCase(); data = data.filter(p => JSON.stringify(p.usuario).toLowerCase().includes(q)); }
    if (params.get("tipo_matricula_id")) data = data.filter(p => p.tipo_matricula_id === Number(params.get("tipo_matricula_id")));
    return respond(data);
  }
  if (/^admin\/prematriculas\/\d+$/.test(path)) {
    const id = Number(path.split("/").pop());
    if (method === "DELETE") { if (id === 102) state.deleted = true; else if (id === 101) state.deletedFixture = true; else return respond({ error: "No encontrada" }, undefined, 404); return respond({ success: true }, state); }
    return list(state).find(p => p.id === id) ? respond(list(state).find(p => p.id === id)) : respond({ error: "No encontrada" }, undefined, 404);
  }
  if (path === "admin/oferta") {
    const enrollments = list(state);
    let data = courses.map(c => { const selected = enrollments.filter(p => p.cursos.some((x: any) => x.curso_codigo === c.codigo)); return { ...c, total_estudiantes: selected.length, porcentaje: enrollments.length ? 100 * selected.length / enrollments.length : 0, repeticiones: 0, porcentaje_repeticion: 0 }; });
    if (params.get("ciclo")) data = data.filter(c => c.ciclo === Number(params.get("ciclo")));
    if (params.get("tipo")) data = data.filter(c => c.tipo === params.get("tipo"));
    if (params.get("search")) data = data.filter(c => c.nombre.toLowerCase().includes(params.get("search")!.toLowerCase()) || String(c.codigo).includes(params.get("search")!));
    if (params.get("top") === "sin-demanda") data = data.filter(c => c.total_estudiantes === 0);
    else data.sort((a,b) => params.get("top") === "bottom" ? a.total_estudiantes - b.total_estudiantes : b.total_estudiantes - a.total_estudiantes);
    return respond(data);
  }
  if (path === "admin/configuracion") {
    if (method === "PUT") { for (const item of (Array.isArray(body) ? body : [])) if (defaultConfig.some(c => c.clave === item.clave)) (state.config ||= {})[item.clave] = String(item.valor); return respond({ success: true }, state); }
    return respond(defaultConfig.map(c => ({ ...c, valor: state.config?.[c.clave] ?? c.valor })));
  }
  if (path === "admin/maintenance") return respond({ maintenance_mode: false, maintenance_ips: "", message: "El modo mantenimiento no se aplica en la demo." });
  if (path === "admin/usuarios") {
    if (method !== "GET") return respond({ error: "Los usuarios son fijos en la demo." }, undefined, 400);
    return respond([student, admin, exampleStudent].map(u => ({ ...u, rol: u.rol.nombre })).filter(u => !params.get("search") || JSON.stringify(u).toLowerCase().includes(params.get("search")!.toLowerCase())));
  }
  if (path.startsWith("admin/usuarios/")) return respond({ error: "Los usuarios son fijos en la demo." }, undefined, 400);
  if (path === "admin/sesiones") return respond([]);
  if (path.startsWith("admin/sesiones/") || path === "admin/clean-sessions") return respond({ message: "No hay sesiones almacenadas en la demo." });
  if (path === "admin/reportes") {
    const type = params.get("tipo") || "excel";
    const report = params.get("reporte") || "resumen-general";
    const entries = list(state);
    const courseRows = courses.map(c => ({ Curso: c.nombre, Ciclo: c.ciclo, Estudiantes: entries.filter(p => p.cursos.some((item: any) => item.curso_codigo === c.codigo)).length }));
    let rows: Record<string, string | number>[];
    if (report === "por-ciclo") rows = [...new Set(courses.map(c => c.ciclo))].map(ciclo => ({ Ciclo: ciclo, Estudiantes: entries.filter(p => p.cursos.some((item: any) => item.curso?.ciclo === ciclo)).length }));
    else if (report === "por-periodo") rows = [{ Periodo: "II-2026", Estudiantes: entries.length }];
    else if (report === "por-tipo-matricula") rows = types.map(t => ({ Tipo: t.nombre, Estudiantes: entries.filter(p => p.tipo_matricula_id === t.id).length }));
    else if (report === "cursos-mayor-demanda") rows = courseRows.sort((a,b) => b.Estudiantes - a.Estudiantes).slice(0, 10);
    else if (report === "cursos-menor-demanda") rows = courseRows.sort((a,b) => a.Estudiantes - b.Estudiantes).slice(0, 10);
    else if (report === "cursos-sin-demanda") rows = courseRows.filter(c => c.Estudiantes === 0);
    else if (report === "matriculas-especiales") rows = entries.filter(p => p.tipo_matricula_id !== 1).map(p => ({ Estudiante: p.usuario.nombres, Tipo: p.tipo_matricula.nombre }));
    else if (report === "matriculas-repetidas") rows = entries.filter(p => p.cursos.some((c: any) => c.numero_vez > 1)).map(p => ({ Estudiante: p.usuario.nombres, Cursos: p.cursos.length }));
    else rows = [{ Periodo: "II-2026", Estudiantes: entries.length, Cursos: courses.length, Nota: "Datos ficticios de demostración" }];
    if (!rows.length) rows = [{ Resultado: "Sin registros en los datos de demostración" }];
    if (type === "pdf") {
      const pdf = new jsPDF();
      pdf.setFontSize(15); pdf.text(`Reporte demo: ${report}`, 14, 20);
      pdf.setFontSize(9); pdf.text("Datos ficticios. No es un documento institucional.", 14, 29);
      rows.slice(0, 45).forEach((row, i) => pdf.text(Object.values(row).join(" | ").slice(0, 100), 14, 40 + i * 5));
      return new NextResponse(pdf.output("arraybuffer"), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${report}.pdf"` } });
    }
    const cell = (value: string | number) => {
      const safe = /^[=+\-@]/.test(String(value)) ? `'${value}` : String(value);
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const csv = "\uFEFF" + [Object.keys(rows[0]).map(cell).join(","), ...rows.map(row => Object.values(row).map(cell).join(","))].join("\r\n");
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${report}.csv"` } });
  }
  return respond({ error: "Función no disponible en la demo." }, undefined, 404);
}
