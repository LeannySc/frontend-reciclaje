import {
  Trash2,
  ChevronLeft,
  MapPin,
  RefreshCcw,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

const MonitorBotes = ({ botes, alRegresar, refrescar, usuarioId }) => {
  const [cargando, setCargando] = useState(null);

  const manejarVaciado = async (puntoId) => {
    setCargando(puntoId);
    try {
      await axios.post(
        `http://localhost:8080/api/encargado/${puntoId}/Vaciar?encargadoId=${usuarioId}`,
      );
      toast.success("Misión de Limpieza", {
        description: "Estación reseteada al 0%",
      });
      refrescar();
    } catch (error) {
      console.error(error);
      toast.error("Fallo de Red", {
        description: "No se pudo sincronizar con el bote.",
      });
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500 pb-20 px-4">
      {/* HEADER ESTILO APP */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={alRegresar}
          className="p-3 bg-white hover:bg-slate-100 rounded-2xl shadow-sm transition-all border border-slate-100 active:scale-95"
        >
          <ChevronLeft size={24} className="text-slate-800" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">
            Misiones de Ruta
          </h2>
          <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mt-2 italic">
            Monitor Industrial de Popayán
          </p>
        </div>
      </div>

      {/* LISTA DE ESTACIONES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {botes.map((bote) => (
          <div
            key={bote.id}
            className={`bg-white rounded-[2.5rem] p-8 border-4 transition-all ${bote.nivelLlenado >= 80 ? "border-red-500 shadow-2xl shadow-red-100 animate-in zoom-in" : "border-white shadow-xl shadow-slate-200"}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`p-4 rounded-3xl ${bote.nivelLlenado >= 80 ? "bg-red-50 text-red-500" : "bg-slate-50 text-green-600"}`}
              >
                <Trash2 size={24} />
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${bote.nivelLlenado >= 80 ? "text-red-500" : "text-slate-400"}`}
                >
                  Capacidad:
                </span>
                <h4
                  className={`text-2xl font-black ${bote.nivelLlenado >= 80 ? "text-red-600" : "text-slate-800"}`}
                >
                  {bote.nivelLlenado}%
                </h4>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 uppercase mb-1">
              {bote.nombre}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-400 mb-6">
              <MapPin size={12} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase truncate">
                {bote.direccion}
              </span>
            </div>

            {/* Barra Pro */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-8 border border-slate-50 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${bote.nivelLlenado >= 80 ? "bg-red-600" : "bg-green-500"}`}
                style={{ width: `${bote.nivelLlenado}%` }}
              ></div>
            </div>

            <button
              onClick={() => manejarVaciado(bote.id)}
              disabled={bote.nivelLlenado < 80 || cargando === bote.id}
              className={`w-full py-5 rounded-[1.8rem] font-black text-[11px] uppercase flex justify-center items-center gap-3 transition-all active:scale-95 shadow-lg
                ${
                  bote.nivelLlenado >= 80 && cargando !== bote.id
                    ? "bg-slate-900 text-white hover:bg-black shadow-slate-300"
                    : "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed shadow-none"
                }`}
            >
              {cargando === bote.id ? (
                <Loader2 className="animate-spin text-green-500" />
              ) : (
                <RefreshCcw size={16} />
              )}
              {bote.nivelLlenado >= 80 ? "COMPLETAR LIMPIEZA" : "EN OPERATIVO"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitorBotes;
