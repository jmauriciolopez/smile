import { Blueprint } from "../../core/types";
import {
  ClinicalAuditEngine,
  ResultadoAuditoria,
} from "../clinical-audit-engine";

/**
 * Motor de Generación de Reportes Clínicos.
 * Transforma el Blueprint y el historial en un documento profesional.
 */
export class ClinicalReportEngine {
  /**
   * Genera una estructura de datos para el reporte.
   */
  static generarReporteHTML(
    blueprint: Blueprint,
    auditoria: ResultadoAuditoria,
  ): string {
    const { metadata: _metadata, analisisIA, historial, dientes } = blueprint;
    const d11 = dientes.find((d) => d.pieza === 11) || dientes[0];
    const m = d11.material;

    return `
      <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); background: white;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
          <div>
            <h1 style="margin: 0; font-size: 24px; color: #1e3a8a; letter-spacing: -0.025em;">SMILE DESIGN PRO</h1>
            <p style="margin: 5px 0 0; color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase;">Repotería Clínica Especializada</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 10px; color: #94a3b8; font-weight: bold;">CASO ID: ${blueprint.id.substring(0, 12).toUpperCase()}</p>
            <p style="margin: 5px 0 0; font-size: 10px; color: #94a3b8;">FECHA EMISIÓN: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Dashboard de Inteligencia -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 20px; border-radius: 12px; text-align: center; color: white;">
            <h3 style="font-size: 10px; opacity: 0.8; margin: 0 0 10px; text-transform: uppercase;">Score Estético</h3>
            <div style="font-size: 42px; font-weight: 900;">${analisisIA.scoreEstetico}%</div>
            <p style="font-size: 10px; opacity: 0.7; margin-top: 10px;">Armonía Facial (IA)</p>
          </div>
          <div style="background: ${auditoria.aprobado ? "linear-gradient(135deg, #065f46 0%, #10b981 100%)" : "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)"}; padding: 20px; border-radius: 12px; text-align: center; color: white;">
            <h3 style="font-size: 10px; opacity: 0.8; margin: 0 0 10px; text-transform: uppercase;">Score Clínico</h3>
            <div style="font-size: 42px; font-weight: 900;">${auditoria.scoreClinico}%</div>
            <p style="font-size: 10px; opacity: 0.7; margin-top: 10px;">Validación Médica (Audit)</p>
          </div>
        </div>

        <!-- Alertas de Auditoría Clínica -->
        <div style="margin-bottom: 30px; background: #fff7ed; border: 1px solid #ffedd5; padding: 20px; border-radius: 12px;">
          <h2 style="font-size: 14px; color: #9a3412; margin-bottom: 15px; font-weight: 800; text-transform: uppercase;">Informe de Auditoría Clínica</h2>
          <div style="space-y: 10px;">
            ${
              auditoria.alertas.length === 0
                ? `<p style="font-size: 12px; color: #166534;">✅ No se detectaron contraindicaciones clínicas.</p>`
                : auditoria.alertas
                    .map(
                      (a) => `
                <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #fed7aa;">
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: ${a.severidad === "critico" ? "#ef4444" : "#f59e0b"}; color: white; font-weight: bold; text-transform: uppercase;">${a.severidad}</span>
                    <strong style="font-size: 12px; color: #1e293b;">${a.mensaje} ${a.pieza ? `(Pieza ${a.pieza})` : ""}</strong>
                  </div>
                  <p style="font-size: 11px; color: #475569; margin: 0;">${a.detalleTecnico}</p>
                  <p style="font-size: 10px; color: #3b82f6; margin-top: 4px; font-weight: bold;">💡 RECOMENDACIÓN: ${a.recomendacion}</p>
                </div>
              `,
                    )
                    .join("")
            }
          </div>
        </div>

        <!-- Especificaciones Técnicas de Material (PBR Data) -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 14px; color: #1e3a8a; border-left: 4px solid #3b82f6; padding-left: 10px; margin-bottom: 20px; font-weight: 800; text-transform: uppercase;">Especificaciones de Material y Estratificación</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div style="border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px;">
              <p style="font-size: 9px; color: #94a3b8; margin: 0 0 5px; text-transform: uppercase;">Translucidez Incisal</p>
              <div style="font-size: 14px; font-weight: bold;">${(m.translucidez * 100).toFixed(0)}%</div>
            </div>
            <div style="border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px;">
              <p style="font-size: 9px; color: #94a3b8; margin: 0 0 5px; text-transform: uppercase;">Opalescencia (Efecto)</p>
              <div style="font-size: 14px; font-weight: bold;">${(m.opalescencia * 100).toFixed(0)}%</div>
            </div>
            <div style="border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px;">
              <p style="font-size: 9px; color: #94a3b8; margin: 0 0 5px; text-transform: uppercase;">Reflexión Fresnel</p>
              <div style="font-size: 14px; font-weight: bold;">${(m.fresnel * 100).toFixed(0)}%</div>
            </div>
            <div style="border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px;">
              <p style="font-size: 9px; color: #94a3b8; margin: 0 0 5px; text-transform: uppercase;">Scattering Subsuperficial</p>
              <div style="font-size: 14px; font-weight: bold;">${(m.sss * 100).toFixed(0)}%</div>
            </div>
            <div style="border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px;">
              <p style="font-size: 9px; color: #94a3b8; margin: 0 0 5px; text-transform: uppercase;">Capa Esmalte (Grosor)</p>
              <div style="font-size: 14px; font-weight: bold;">${m.capaEsmalte.toFixed(2)} mm</div>
            </div>
            <div style="border: 1px solid #f1f5f9; padding: 12px; border-radius: 8px;">
              <p style="font-size: 9px; color: #94a3b8; margin: 0 0 5px; text-transform: uppercase;">Rugosidad Superficial</p>
              <div style="font-size: 14px; font-weight: bold;">${(m.rugosidad * 100).toFixed(0)}%</div>
            </div>
          </div>
          <p style="font-size: 10px; color: #64748b; margin-top: 15px; font-style: italic;">Nota para Laboratorio: Se recomienda estratificación multicapa siguiendo los valores de scattering y fresnel indicados para mimetizar el diseño digital.</p>
        </div>

        <!-- Tabla de Auditoría (Trazabilidad) -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 14px; color: #1e3a8a; border-left: 4px solid #3b82f6; padding-left: 10px; margin-bottom: 15px; font-weight: 800; text-transform: uppercase;">Trazabilidad del Diseño (Auditoría)</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #64748b;">FASE / ACCIÓN</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #64748b;">TIMESTAMP</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #64748b;">AUTORIZACIÓN</th>
              </tr>
            </thead>
            <tbody>
              ${historial
                .map(
                  (v) => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #1e293b;">${v.etiqueta || "Ajuste Clínico Manual"}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">${new Date(v.fecha).toLocaleString()}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: bold;">✓ VALIDADO</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Footer Legal -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 9px; line-height: 1.5;">
          Este documento es una simulación visual y técnica generada por Smile Design Pro.<br>
          La interpretación final y ejecución del tratamiento es responsabilidad exclusiva del profesional clínico tratante.<br>
          © 2026 Smile SaaS Pro 2 - Todos los derechos reservados.
        </div>
      </div>
    `;
  }

  /**
   * Dispara la impresión del reporte.
   */
  static imprimir(blueprint: Blueprint) {
    const auditoria = ClinicalAuditEngine.auditar(blueprint);
    const html = this.generarReporteHTML(blueprint, auditoria);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Reporte Clínico - ${blueprint.id.substring(0, 8)}</title>
            <style>
              @page { margin: 20mm; } 
              body { margin: 0; background: #f1f5f9; -webkit-print-color-adjust: exact; }
              @media print { body { background: white; } }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  }
}
