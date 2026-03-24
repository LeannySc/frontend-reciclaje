import { useEffect, useState } from "react";
import axios from "axios";
import {
  Truck,
  RotateCcw,
  Loader2,
  AlertTriangle,
  ListFilter,
  Layers,
  Activity, // Logo nuevo para el botón
  LayoutList,
  CheckCircle2,
} from "lucide-react";
import Mapa from "./Mapa";
import { toast } from "sonner";

const EncargadoDashboard = ({ usuario }) => {
  const [botes, setBotes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [verLista, setVerLista] = useState(true);

  const cargarEstadoRed = () => {
    axios
      .get("http://localhost:8080/api/puntos/todos")
      .then((res) => setBotes(res.data))
      .catch((error) => console.error("Error en la red:", error));
  };

  useEffect(() => {
    cargarEstadoRed();
    const interval = setInterval(cargarEstadoRed, 5000);
    return () => clearInterval(interval);
  }, []);

  const manejarVaciado = async (puntoId) => {
    setCargando(true);
    try {
      await axios.post(
        `http://localhost:8080/api/encargado/${puntoId}/Vaciar?encargadoId=${usuario.id}`,
      );
      toast.success("Misión de limpieza exitosa");
      cargarEstadoRed();
    } catch (err) {
      console.error(err);
      toast.error("Error al conectar con la base");
    } finally {
      setCargando(false);
    }
  };

  const botesLlenos = botes.filter((b) => b.nivelLlenado >= 80).length;

  return (
    <div className="relative h-[calc(100vh-140px)] w-full overflow-hidden flex flex-col antialiased bg-slate-50 rounded-[3rem] shadow-inner border-4 border-white">
      {/* --- BARRA DE COMANDO SUPERIOR (Botón incluido aquí) --- */}
      <div className="bg-white p-6 flex justify-between items-center z-[40] border-b border-slate-100 px-10 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="bg-green-600 p-3 rounded-2xl text-white shadow-lg shadow-green-100">
            <Truck size={24} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none italic">
              Logística de Popayán
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Operador: {usuario.nombre}
            </p>
          </div>
        </div>

        {/* METRICAS Y BOTÓN DE CONTROL */}
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest">
              Estado Red
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-slate-800">
                {botes.length}{" "}
                <small className="text-[10px] text-slate-400">PUNTOS</small>
              </span>
              <span
                className={`text-xl font-black ${botesLlenos > 0 ? "text-red-500 animate-bounce" : "text-green-600"}`}
              >
                {botesLlenos}{" "}
                <small className="text-[10px] text-slate-400 uppercase">
                  Alertas
                </small>
              </span>
            </div>
          </div>

          {/* BOTÓN NUEVO: Fuera del mapa, pequeño y bonito */}
          <button
            onClick={() => setVerLista(!verLista)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 border-2
                ${
                  verLista
                    ? "bg-slate-900 text-white border-slate-900 shadow-slate-200"
                    : "bg-white text-green-600 border-green-600 shadow-green-50 hover:bg-green-50"
                }`}
          >
            {verLista ? <Activity size={16} /> : <LayoutList size={16} />}
            {verLista ? "Ocultar Monitor" : "Ver Lista de Botes"}
          </button>
        </div>
      </div>

      <div className="flex-grow flex relative overflow-hidden">
        {/* --- MAPA TOTALMENTE LIMPIO --- */}
        <div className="flex-grow h-full relative z-0">
          <Mapa />

          {/* Legend Flotante Minimalista */}
          <div className="absolute bottom-6 right-6 z-[1000] pointer-events-none hidden sm:block">
            <div className="bg-white/80 backdrop-blur-md shadow-2xl p-4 rounded-[2rem] border border-slate-100 pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border-r pr-3 border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase">
                    Red Sana
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase">
                    Bote Lleno
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PANEL LATERAL FLY-OUT DERECHO --- */}
        <div
          className={`absolute right-0 top-0 h-full bg-white/95 backdrop-blur-sm z-20 border-l border-slate-200 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${verLista ? "w-80 opacity-100 shadow-2xl" : "w-0 opacity-0 border-none"}`}
        >
          <div className="p-6 h-full flex flex-col min-w-[320px]">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-50 pb-4">
              <ListFilter size={18} className="text-green-600" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none text-left">
                Itinerario de Carga
              </h3>
            </div>

            <div className="space-y-4 overflow-y-auto flex-grow pr-2 text-left custom-scrollbar pb-10">
              {botes.map((bote) => (
                <div
                  key={bote.id}
                  className={`p-6 rounded-[2.2rem] border transition-all duration-300 ${bote.nivelLlenado >= 80 ? "border-red-400 bg-red-50/20" : "bg-slate-50 border-slate-100 shadow-sm"}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-white text-slate-400 px-2 py-0.5 rounded-lg text-[8px] font-black border border-slate-100">
                      ST-0{bote.id}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded-full ${bote.nivelLlenado >= 80 ? "bg-red-500 text-white" : "text-slate-500"}`}
                    >
                      {bote.nivelLlenado}%
                    </span>
                  </div>
                  <h4 className="font-black text-slate-800 text-[11px] mb-1 uppercase truncate leading-none">
                    {bote.nombre}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-medium mb-5 truncate leading-none italic capitalize">
                    {bote.direccion}
                  </p>

                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mb-6">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${bote.nivelLlenado >= 80 ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "bg-green-500"}`}
                      style={{ width: `${bote.nivelLlenado}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => manejarVaciado(bote.id)}
                    disabled={bote.nivelLlenado < 80 || cargando}
                    className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase flex justify-center items-center gap-2 transition-all active:scale-95
                      ${bote.nivelLlenado >= 80 && !cargando ? "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-300" : "bg-white text-slate-300 border border-slate-100"}`}
                  >
                    {cargando ? (
                      <Loader2
                        size={12}
                        className="animate-spin text-green-500"
                      />
                    ) : (
                      <RotateCcw size={12} />
                    )}
                    {cargando ? "Ejecutando..." : "Recolectar"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncargadoDashboard;
