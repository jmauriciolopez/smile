import React from "react";
import {
  useSignatureStore,
  type SignatureAsset,
} from "../store/signature-design.store";
import { Card } from "../../../componentes/ui/Card";

export const AssetsPanel: React.FC = () => {
  const { portrait, scanInitial, waxup, setAsset } = useSignatureStore();

  const handleFileUpload = (
    type: "portrait" | "scan_initial" | "waxup",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const asset: SignatureAsset = {
      id: Math.random().toString(36).substring(7),
      type,
      url,
      name: file.name,
    };
    setAsset(type, asset);
  };

  const AssetRow = ({
    title,
    asset,
    type,
    accept,
  }: {
    title: string;
    asset: SignatureAsset | null;
    type: "portrait" | "scan_initial" | "waxup";
    accept: string;
  }) => (
    <div className="group relative rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${asset ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}
          >
            {type === "portrait" ? "👤" : type === "scan_initial" ? "🦷" : "✨"}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-700">{title}</h4>
            <p className="text-[10px] text-slate-400">
              {asset ? asset.name : "Pendiente de carga"}
            </p>
          </div>
        </div>

        <label className="cursor-pointer overflow-hidden rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
          {asset ? "Reemplazar" : "Cargar"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFileUpload(type, e)}
          />
        </label>
      </div>

      {asset && (
        <div className="mt-2 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">
            Activo
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Card titulo="📦 Ingesta de Activos">
      <div className="space-y-3">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Carga los archivos base para la simulación 3D. El sistema alineará
          automáticamente el Wax-up si las coordenadas coinciden con el escaneo
          inicial.
        </p>

        <AssetRow
          title="Retrato Facial"
          asset={portrait}
          type="portrait"
          accept="image/*"
        />
        <AssetRow
          title="Escaneo Inicial (STL)"
          asset={scanInitial}
          type="scan_initial"
          accept=".stl"
        />
        <AssetRow
          title="Wax-up / Diseño (STL)"
          asset={waxup}
          type="waxup"
          accept=".stl"
        />
      </div>
    </Card>
  );
};
