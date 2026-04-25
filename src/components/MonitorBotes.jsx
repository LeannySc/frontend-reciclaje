import {
  Trash2,
  ChevronLeft,
  MapPin,
  RefreshCcw,
  Loader2,
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
        `http://localhost:8080/api/encargado/${puntoId}/Vaciar?encargadoId=${usuarioId}`
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
    <div className="max-w-5xl mx-auto animate-in slide-in-from-right duration-500 pb-16 px-2 sm:px-4">
      {/* HEADER */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <button
          onClick={alRegresar}
          className="p-2.5 sm:p-3 bg-white hover:bg-slate-100 rounded-xl sm:rounded-2xl shadow-sm transition-all border border-slate-100 active:scale-95 flex-shrink-0"
        >
          <ChevronLeft size={22} className="text-slate-800" />
        </button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">
            Misiones de Ruta
          </h2>
          <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1.5 italic">
            Monitor Industrial · Popayán
          </p>
        </div>
      </div>

      {/* GRID DE ESTACIONES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {botes.map((bote) => (
          <div
            key={bote.id}
            className={`bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 border-4 transition-all ${
              bote.nivelLlenado >= 80
                ? "border-red-500 shadow-2xl shadow-red-100"
                : "border-white shadow-xl shadow-slate-200"
            }`}
          >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div
                className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl ${
                  bote.nivelLlenado >= 80
                    ? "bg-red-50 text-red-500"
                    : "bg-slate-50 text-green-600"
                }`}
              >
                <Trash2 size={22} className="sm:w-6 sm:h-6" />
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black uppercase tracking-widest ${bote.nivelLlenado >= 80 ? "text-red-500" : "text-slate-400"}`}>
                  Capacidad:
                </span>
                <h4 className={`text-xl sm:text-2xl font-black ${bote.nivelLlenado >= 80 ? "text-red-600" : "text-slate-800"}`}>
                  {bote.nivelLlenado}%
                </h4>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase mb-1">
              {bote.nombre}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-400 mb-4 sm:mb-6">
              <MapPin size={11} className="text-blue-500 flex-shrink-0" />
              <span className="text-[10px] font-bold uppercase truncate">
                {bote.direccion}
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 sm:h-3 rounded-full overflow-hidden mb-5 sm:mb-8 border border-slate-50 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  bote.nivelLlenado >= 80 ? "bg-red-600" : "bg-green-500"
                }`}
                style={{ width: `${bote.nivelLlenado}%` }}
              />
            </div>

            <button
              onClick={() => manejarVaciado(bote.id)}
              disabled={bote.nivelLlenado < 80 || cargando === bote.id}
              className={`w-full py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[1.8rem] font-black text-[11px] uppercase flex justify-center items-center gap-2 sm:gap-3 transition-all active:scale-95 shadow-lg
                ${bote.nivelLlenado >= 80 && cargando !== bote.id
                  ? "bg-slate-900 text-white hover:bg-black shadow-slate-300"
                  : "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed shadow-none"
                }`}
            >
              {cargando === bote.id ? (
                <Loader2 className="animate-spin text-green-500" size={15} />
              ) : (
                <RefreshCcw size={15} />
              )}
              {bote.nivelLlenado >= 80 ? "LIMPIAR" : "EN OPERATIVO"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitorBotes;
