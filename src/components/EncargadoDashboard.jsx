import { useEffect, useState } from "react";
import axios from "axios";
import {
  Truck,
  RotateCcw,
  Loader2,
  AlertTriangle,
  ListFilter,
  Layers,
  Activity,
  LayoutList,
  CheckCircle2,
  MapPin,
  Trash2,
} from "lucide-react";
import Mapa from "./Mapa";
import { toast } from "sonner";

const EncargadoDashboard = ({ usuario }) => {
  const [botes, setBotes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [verLista, setVerLista] = useState(true);

  const cargarEstadoRed = () => {
    axios
      .get("http://127.0.0.1:8080/api/puntos/todos")
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
      toast.success("Misión de limpieza exitosa", {
        description: "Estación reiniciada correctamente",
      });
      cargarEstadoRed();
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión", {
        description: "No se pudo comunicar con el servidor",
      });
    } finally {
      setCargando(false);
    }
  };

  const botesLlenos = botes.filter((b) => b.nivelLlenado >= 80).length;
  const botesMedios = botes.filter((b) => b.nivelLlenado >= 50 && b.nivelLlenado < 80).length;
  const botesNormales = botes.filter((b) => b.nivelLlenado < 50).length;

  return (
    <div className="relative h-[calc(100vh-140px)] w-full overflow-hidden flex flex-col antialiased bg-slate-50 rounded-[3rem] shadow-inner border-4 border-white">
      {/* --- BARRA DE COMANDO SUPERIOR --- */}
      <div className="bg-white p-6 flex justify-between items-center z-[40] border-b border-slate-100 px-8 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-3 rounded-2xl text-white shadow-lg shadow-green-200">
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

        {/* MÉTRICAS Y BOTÓN DE CONTROL */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Total Puntos
              </span>
              <span className="text-2xl font-black text-slate-800">
                {botes.length}
              </span>
            </div>
            
            <div className="w-[1px] h-10 bg-slate-200"></div>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                <span className="text-lg font-black text-slate-700">{botesNormales}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">OK</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mb-1"></div>
                <span className="text-lg font-black text-slate-700">{botesMedios}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Medio</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mb-1"></div>
                <span className="text-lg font-black text-red-600">{botesLlenos}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Alerta</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setVerLista(!verLista)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 border-2
              ${verLista
                ? "bg-slate-900 text-white border-slate-900 shadow-slate-300"
                : "bg-white text-green-600 border-green-600 shadow-green-100 hover:bg-green-50"
              }`}
          >
            {verLista ? <Activity size={16} /> : <LayoutList size={16} />}
            {verLista ? "Ocultar" : "Ver Lista"}
          </button>
        </div>
      </div>

      <div className="flex-grow flex relative overflow-hidden">
        {/* --- MAPA --- */}
        <div className="flex-grow h-full relative z-0">
          <Mapa mostrarInfo={true} />

          {/* Legend Flotante Minimalista */}
          <div className="absolute bottom-6 right-6 z-[1000] pointer-events-none hidden sm:block">
            <div className="bg-white/95 backdrop-blur-xl shadow-2xl p-4 rounded-[2rem] border border-slate-100 pointer-events-auto">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r pr-4 border-slate-200">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-[9px] font-black text-slate-600 uppercase">
                    Normal
                  </span>
                </div>
                <div className="flex items-center gap-2 border-r pr-4 border-slate-200">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-[9px] font-black text-slate-600 uppercase">
                    Medio
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-slate-600 uppercase">
                    Lleno
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PANEL LATERAL FLY-OUT DERECHO --- */}
        <div
          className={`absolute right-0 top-0 h-full bg-white/98 backdrop-blur-xl z-20 border-l border-slate-200 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
            verLista ? "w-96 opacity-100 shadow-2xl" : "w-0 opacity-0 border-none"
          }`}
        >
          <div className="p-6 h-full flex flex-col min-w-[384px]">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <ListFilter size={18} className="text-green-600" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none text-left">
                Itinerario de Carga
              </h3>
              <span className="ml-auto text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {botes.length} estaciones
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto flex-grow pr-2 text-left custom-scrollbar pb-10">
              {botes.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🗑️</div>
                  <p className="text-sm font-bold text-slate-400 uppercase">Cargando estaciones...</p>
                </div>
              ) : (
                botes
                  .sort((a, b) => (b.nivelLlenado || 0) - (a.nivelLlenado || 0))
                  .map((bote) => (
                    <div
                      key={bote.id}
                      className={`p-5 rounded-[2rem] border transition-all duration-300 group ${
                        bote.nivelLlenado >= 80
                          ? "border-red-200 bg-red-50/50 shadow-lg shadow-red-100"
                          : bote.nivelLlenado >= 50
                          ? "border-yellow-200 bg-yellow-50/30"
                          : "bg-white border-slate-100 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              bote.nivelLlenado >= 80
                                ? "bg-red-100 text-red-600"
                                : bote.nivelLlenado >= 50
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            <Trash2 size={18} />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 text-[11px] uppercase leading-none mb-1">
                              {bote.nombre}
                            </h4>
                            <div className="flex items-center gap-1 text-slate-400">
                              <MapPin size={10} />
                              <p className="text-[9px] font-medium truncate max-w-[180px]">
                                {bote.direccion}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                            bote.nivelLlenado >= 80
                              ? "bg-red-500 text-white"
                              : bote.nivelLlenado >= 50
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {bote.nivelLlenado}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            bote.nivelLlenado >= 80
                              ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                              : bote.nivelLlenado >= 50
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${bote.nivelLlenado}%` }}
                        ></div>
                      </div>

                      <button
                        onClick={() => manejarVaciado(bote.id)}
                        disabled={bote.nivelLlenado < 80 || cargando}
                        className={`w-full py-3.5 rounded-2xl text-[9px] font-black uppercase flex justify-center items-center gap-2 transition-all active:scale-95
                          ${
                            bote.nivelLlenado >= 80 && !cargando
                              ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-black hover:to-slate-900 shadow-lg shadow-slate-300"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                      >
                        {cargando ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <RotateCcw size={12} />
                        )}
                        {cargando ? "Procesando..." : bote.nivelLlenado >= 80 ? "Recolectar Ahora" : "En espera"}
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncargadoDashboard;
