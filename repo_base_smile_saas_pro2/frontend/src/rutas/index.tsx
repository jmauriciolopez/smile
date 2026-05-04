import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ShellAplicacion } from "../componentes/layout/ShellAplicacion";
import { DashboardPage } from "../modulos/dashboard/paginas/DashboardPage";
import { PacientesPage } from "../modulos/pacientes/paginas/PacientesPage";
import { DetallePacientePage } from "../modulos/pacientes/paginas/DetallePacientePage";
import { CasosPage } from "../modulos/casos/paginas/CasosPage";
import { DetalleCasoClinicoPage } from "../modulos/casos/paginas/DetalleCasoClinicoPage";
import { EditorSonrisaPage } from "../modulos/diseno_sonrisa/paginas/EditorSonrisaPage";
import { PresupuestosPage } from "../modulos/presupuestos/paginas/PresupuestosPage";
import { DetallePresupuestoPage } from "../modulos/presupuestos/paginas/DetallePresupuestoPage";
import { SeguimientosPage } from "../modulos/seguimientos/paginas/SeguimientosPage";
import { LoginPage } from "../modulos/autenticacion/paginas/LoginPage";
import { VistaPacientePage } from "../modulos/diseno_sonrisa/paginas/VistaPacientePage";
import SignatureDesignPage from "../modulos/signature_design/paginas/SignatureDesignPage";
import CBCTViewerPage from "../modulos/cbct_viewer/paginas/CBCTViewerPage";
import { CatalogoPlanesPage } from "../modulos/configuracion/paginas/CatalogoPlanesPage";
import { useAutenticacionStore } from "../store/autenticacion.store";

function RutaPrivada() {
  const autenticado = useAutenticacionStore((s) => s.autenticado);
  return autenticado ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/v/:id" element={<VistaPacientePage />} />
      <Route element={<RutaPrivada />}>
        <Route element={<ShellAplicacion />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/pacientes/:id" element={<DetallePacientePage />} />
          <Route path="/casos" element={<CasosPage />} />
          <Route path="/casos/:id" element={<DetalleCasoClinicoPage />} />
          <Route path="/lab" element={<SignatureDesignPage />} />
          <Route path="/radiologia" element={<CBCTViewerPage />} />
          <Route path="/presupuestos" element={<PresupuestosPage />} />
          <Route
            path="/presupuestos/:id"
            element={<DetallePresupuestoPage />}
          />
          <Route path="/seguimientos" element={<SeguimientosPage />} />
          <Route path="/configuracion/planes" element={<CatalogoPlanesPage />} />
        </Route>

        {/* 🎬 EXPERIENCIAS FULLSCREEN (FUERA DEL SHELL) */}
        <Route
          path="/disenos/editor/:casoId"
          element={<EditorSonrisaPage />}
        />
      </Route>
    </Routes>
  );
}
