// src/lib/utils/prematricula-pdf.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CursoPDF {
    codigo: number;
    nombre: string;
    ciclo: number;
    creditos: number;
    numero_vez: number;
    tipo: string;
}

interface PrematriculaPDFData {
    estudiante: string;
    codigo: string;
    tipo_matricula: string;
    promedio: number | null;
    periodo: string;
    total_creditos: number;
    cursos: CursoPDF[];
    creado_en: string;
}

export function generarPDFPrematricula(data: PrematriculaPDFData): void {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // ============================================
    // 1. FECHA DE IMPRESIÓN (esquina superior derecha)
    // ============================================
    const fechaImpresion = new Date().toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de Impresión: ${fechaImpresion}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;

    // ============================================
    // 2. TÍTULO PRINCIPAL
    // ============================================
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA DE PREMATRÍCULA', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    // ============================================
    // 3. INFORMACIÓN DE LA UNIVERSIDAD (todo a la izquierda)
    // ============================================
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ESCUELA PROFESIONAL DE INGENIERÍA INFORMÁTICA', margin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`PERIODO ACADÉMICO: ${data.periodo}`, margin, yPos);
    yPos += 5;
    // const ordenPago = `ORDEN DE PREMATRÍCULA: ${String(data.codigo).padStart(6, '0')}`;
    // doc.text(ordenPago, margin, yPos);
    // yPos += 5;
    doc.text(`CICLO: ${data.cursos.length > 0 ? data.cursos[0]?.ciclo || 'N/A' : 'N/A'}`, margin, yPos);
    yPos += 5;

    // ============================================
    // 4. DATOS DEL ALUMNO (todo a la izquierda)
    // ============================================
    yPos += 4;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL ALUMNO', margin, yPos);
    yPos += 2;

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;

    const valueX = margin + 50;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ALUMNO:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(data.estudiante, valueX, yPos);
    yPos += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('CÓDIGO:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(data.codigo, valueX, yPos);
    yPos += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('TIPO DE PREMATRÍCULA:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(data.tipo_matricula, valueX, yPos);
    yPos += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('PROMEDIO PONDERADO:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(data.promedio?.toFixed(2) || 'N/A', valueX, yPos);
    yPos += 2;

    // Línea separadora
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // ============================================
    // 5. TABLA DE CURSOS
    // ============================================
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CURSOS PREMATRICULADOS', margin, yPos);
    yPos += 4;

    // Preparar datos para la tabla
    const tableHeaders = [['Código', 'Nombre del Curso', 'Ciclo', 'Cred', 'Vez']];
    const tableRows = data.cursos.map(curso => [
        String(curso.codigo),
        curso.nombre,
        String(curso.ciclo),
        String(curso.creditos),
        `${curso.numero_vez}ra`,
    ]);

    autoTable(doc, {
        head: tableHeaders,
        body: tableRows,
        startY: yPos,
        theme: 'striped',
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [0, 0, 0],
            valign: 'middle',
        },
        columnStyles: {
            0: { cellWidth: 25, halign: 'center' },
            1: { cellWidth: 85, halign: 'left' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' },
        },
        styles: {
            overflow: 'linebreak',
            cellPadding: 3,
        },
        tableWidth: contentWidth,
        margin: { left: margin, right: margin },
    });

    // Obtener la posición Y después de la tabla
    const finalY = (doc as any).lastAutoTable?.finalY || (yPos + 20);
    yPos = finalY + 8;

    // ============================================
    // 6. INFORMACIÓN FINAL
    // ============================================
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL DE CRÉDITOS PREMATRICULADOS: ${data.total_creditos}`, margin, yPos);
    yPos += 8;

    // ============================================
    // 7. FECHA DEL DOCUMENTO
    // ============================================
    const fechaDocumento = new Date(data.creado_en).toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`FECHA: ${fechaDocumento}`, margin, yPos);
    yPos += 12;

    // ============================================
    // 8. PIE DE PÁGINA
    // ============================================
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('UNIVERSIDAD NACIONAL DE TRUJILLO', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('ESCUELA PROFESIONAL DE INGENIERÍA INFORMÁTICA', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;

    // Código de documento
    doc.setFontSize(7);
    doc.text('Ficha de Prematrícula - F-PM-001', margin, doc.internal.pageSize.getHeight() - 10);

    // ============================================
    // 9. GENERAR Y DESCARGAR
    // ============================================
    doc.save(`prematricula_${data.codigo}_${data.periodo.replace('/', '_')}.pdf`);
}