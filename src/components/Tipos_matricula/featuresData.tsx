import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
	// ==================== 1. TIPOS DE MATRÍCULA POR RENDIMIENTO ACADÉMICO ====================
	{
		id: 1,
		title: "Primera Matrícula",
		category: "Por Rendimiento Académico",
		order: 1,
		paragraph:
			"Registro inicial en un curso sin haber cursado previamente la asignatura. Es la oportunidad principal para cursar y aprobar la materia.",
		details: {
			type: "Primera",
			description: "Sin matrícula previa en el curso",
			condition: "Aplica a todas las asignaturas"
		}
	},
	{
		id: 2,
		title: "Segunda Matrícula",
		category: "Por Rendimiento Académico",
		order: 2,
		paragraph:
			"Cuando el estudiante desaprobó o fue inhabilitado en la primera matrícula del curso. Representa una segunda oportunidad para aprobar la asignatura.",
		details: {
			type: "Segunda",
			description: "Desaprobó o inhabilitó la primera matrícula",
			condition: "Requiere seguimiento académico"
		}
	},
	{
		id: 3,
		title: "Tercera Matrícula",
		category: "Por Rendimiento Académico",
		order: 3,
		paragraph:
			"Corresponde a estudiantes que desaprobaron o inhabilitaron la segunda matrícula. Está limitado a 12 créditos en cursos de línea.",
		details: {
			type: "Tercera",
			description: "Desaprobó o inhabilitó la segunda matrícula",
			condition: "Máximo 12 créditos en cursos de línea"
		}
	},
	{
		id: 4,
		title: "Cuarta Matrícula",
		category: "Por Rendimiento Académico",
		order: 4,
		paragraph:
			"Última oportunidad para aprobar el curso. El estudiante solo puede matricularse en esta asignatura específica, sin posibilidad de llevar otros cursos.",
		details: {
			type: "Cuarta",
			description: "Desaprobó la tercera matrícula",
			condition: "Solo matrícula en ese curso"
		}
	},

	// ==================== 2. TIPOS DE MATRÍCULA POR CRÉDITOS ====================
	{
		id: 5,
		title: "Matrícula Regular",
		category: "Por Créditos",
		order: 5,
		paragraph:
			"Régimen estándar con carga académica equilibrada. Mínimo 12 y máximo 22 créditos. En periodo de verano (2 meses), el máximo es de 10 créditos.",
		details: {
			type: "Regular",
			description: "Mínimo 12 - Máximo 22 créditos",
			condition: "Carga académica normal",
		}
	},
	{
		id: 6,
		title: "Matrícula Especial",
		category: "Por Créditos",
		order: 6,
		paragraph:
			"Para estudiantes con menos de 12 créditos o casos específicos. Incluye tercera matrícula en línea, cuarta matrícula, exámenes de suficiencia o recuperación.",
		details: {
			type: "Especial",
			description: "Menos de 12 créditos",
			condition: "Solicitud al Decanato",
		}
	},
	{
		id: 7,
		title: "Matrícula Excepcional",
		category: "Por Créditos",
		order: 7,
		paragraph:
			"Permite hasta 4 créditos adicionales. Requiere promedio ponderado ≥ 16 en el ciclo anterior o estar en condición de egreso con un solo curso restante.",
		details: {
			type: "Excepcional",
			description: "Máximo 4 créditos adicionales",
			condition: "Promedio ≥ 16 o condición de egreso",
		}
	},

	// ==================== 3. REQUISITOS Y CASOS ESPECIALES ====================
	{
		id: 8,
		title: "Requisitos para Matrícula Excepcional",
		category: "Requisitos y Casos Especiales",
		order: 8,
		paragraph:
			"Los estudiantes pueden acceder a matrícula excepcional si cumplen con al menos uno de estos requisitos: promedio ponderado igual o mayor a 16 en el ciclo anterior, o tener un solo curso de máximo 4 créditos para terminar su carrera.",
		details: {
			type: "Excepcional",
		}
	},
	{
		id: 9,
		title: "Casos de Matrícula Especial",
		category: "Requisitos y Casos Especiales",
		order: 9,
		paragraph:
			"Solicitudes que deben ser presentadas al Decanato para acceder a matrícula especial. Incluye tercera o cuarta matrícula, exámenes de suficiencia o recuperación.",
		details: {
			type: "Especial",
		}
	},
];

export default featuresData;