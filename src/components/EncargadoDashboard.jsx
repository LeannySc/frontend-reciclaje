import { useEffect, useState } from "react";
import axios from "axios";
import {
  Truck,
  RotateCcw,
  Loader2,
  ListFilter,
  Activity,
  LayoutList,
  X,
} from "lucide-react";
import Mapa from "./Mapa";
import { toast } from "sonner";

const EncargadoDashboard = ({ usuario }) => {
  const [botes, setBotes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [verLista, setVerLista] = useState(false);

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
        `http://localhost:8080/api/encargado/${puntoId}/Vaciar?encargadoId=${usuario.id}`
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
    <div className="flex flex-col gap-4 sm:gap-6 pb-8 animate-in fade-in duration-700">

      {/* BARRA DE COMANDO */}
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="bg-green-600 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-green-100 flex-shrink-0">
            <Truck size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="text-left">
            <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tighter leading-none italic">
              Logística de Popayán
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
              Operador: {usuario.nombre}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
          {/* Métricas */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-left sm:text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Red</span>
              <span className="text-lg sm:text-xl font-black text-slate-800">
                {botes.length} <small className="text-[9px] text-slate-400">PTS</small>
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Alertas</span>
              <span className={`text-lg sm:text-xl font-black ${botesLlenos > 0 ? "text-red-500 animate-bounce" : "text-green-600"}`}>
                {botesLlenos}
              </span>
            </div>
          </div>

          {/* Botón toggle lista */}
          <button
            onClick={() => setVerLista(!verLista)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-95 border-2 flex-shrink-0
              ${verLista
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-green-600 border-green-600 hover:bg-green-50"
              }`}
          >
            {verLista ? <X size={14} /> : <LayoutList size={14} />}
            <span className="hidden sm:inline">{verLista ? "Cerrar" : "Ver Botes"}</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: MAPA + PANEL */}
      <div className="relative">

        {/* MAPA */}
        <div className={`bg-white rounded-[2rem] sm:rounded-[3rem] overflow-hidden border-[8px] border-white shadow-2xl shadow-slate-200 transition-all duration-500 ${verLista ? "h-[250px] sm:h-[350px] lg:h-[500px]" : "h-[350px] sm:h-[500px] lg:h-[650px]"}`}>
          <Mapa />

          {/* Leyenda */}
          <div className="absolute bottom-4 right-4 z-[1000]">
            <div className="bg-white/90 backdrop-blur-md shadow-xl p-3 rounded-2xl border border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span className="text-[8px] font-black text-slate-500 uppercase">Sana</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
                  <span className="text-[8px] font-black text-slate-500 uppercase">Lleno</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DE BOTES (toggle) */}
        {verLista && (
          <div className="mt-4 bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="p-4 sm:p-6 border-b border-slate-50 flex items-center gap-2">
              <ListFilter size={16} className="text-green-600" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Itinerario de Carga
              </h3>
            </div>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 sm:p-6 max-h-[400px] overflow-y-auto">
                {botes.map((bote) => (
                  <div
                    key={bote.id}
                    className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border transition-all text-left ${
                      bote.nivelLlenado >= 80
                        ? "border-red-400 bg-red-50/30"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-white text-slate-400 px-2 py-0.5 rounded-lg text-[8px] font-black border border-slate-100">
                        ST-0{bote.id}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          bote.nivelLlenado >= 80 ? "bg-red-500 text-white" : "text-slate-500"
                        }`}
                      >
                        {bote.nivelLlenado}%
                      </span>
                    </div>

                    <h4 className="font-black text-slate-800 text-[11px] mb-0.5 uppercase truncate leading-none">
                      {bote.nombre}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-medium mb-3 truncate italic capitalize">
                      {bote.direccion}
                    </p>

                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          bote.nivelLlenado >= 80 ? "bg-red-600" : "bg-green-500"
                        }`}
                        style={{ width: `${bote.nivelLlenado}%` }}
                      />
                    </div>

                    <button
                      onClick={() => manejarVaciado(bote.id)}
                      disabled={bote.nivelLlenado < 80 || cargando}
                      className={`w-full py-3 rounded-xl text-[9px] font-black uppercase flex justify-center items-center gap-2 transition-all active:scale-95
                        ${bote.nivelLlenado >= 80 && !cargando
                          ? "bg-slate-900 text-white hover:bg-black shadow-md"
                          : "bg-white text-slate-300 border border-slate-100"
                        }`}
                    >
                      {cargando ? (
                        <Loader2 size={11} className="animate-spin text-green-500" />
                      ) : (
                        <RotateCcw size={11} />
                      )}
                      {cargando ? "..." : "Recolectar"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncargadoDashboard;
