import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
  MapPin,
  Loader2, // 1. AGREGADO: Importamos el icono del spinner
} from "lucide-react";

const EncargadoDashboard = ({ usuario }) => {
  const [botes, setBotes] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargarEstadoRed = () => {
    axios
      .get("http://localhost:8080/api/puntos/todos")
      .then((res) => setBotes(res.data))
      // 2. CORRECCIÓN: Quitamos el 'err' si no se usa para limpiar el Linter
      .catch(() => console.error("Error al conectar con la red de botes"));
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
      alert(
        "🚛 Punto de recolección vaciado físicamente. El sistema se ha reiniciado.",
      );
      cargarEstadoRed();
    } catch (err) {
      // 3. CORRECCIÓN: Usamos 'err' en un log para que el Linter sea feliz
      console.error("Fallo técnico en la operación:", err);
      alert("Error al vaciar. Revisa la consola del backend.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-700">
      {/* ... (Todo tu código del header anterior está bien) ... */}
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex justify-between items-center relative overflow-hidden shadow-2xl">
        <Truck
          className="absolute -right-10 -bottom-10 text-white opacity-5"
          size={240}
        />
        <div>
          <h3 className="text-green-400 font-black text-xs uppercase tracking-widest mb-2">
            Monitor Logístico de Popayán
          </h3>
          <h2 className="text-4xl font-black">{usuario.nombre}</h2>
          <p className="text-slate-400 mt-2 font-medium">
            Gestionando la red de botes inteligentes
          </p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl border border-white/10 text-center backdrop-blur-md">
          <span className="text-4xl font-black">{botes.length}</span>
          <p className="text-[10px] font-bold uppercase text-slate-300">
            Estaciones <br /> en red
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {botes.map((bote) => (
          <div
            key={bote.id}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 transition-all hover:scale-[1.02]"
          >
            {/* ... (Sección de icono de Mapa y aviso de lleno igual) ... */}
            <div className="flex justify-between items-start mb-6">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <MapPin
                  className={
                    bote.nivelLlenado > 85
                      ? "text-red-500 animate-bounce"
                      : "text-green-600"
                  }
                />
              </div>
              {bote.nivelLlenado > 85 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse uppercase">
                  ¡Lleno!
                </span>
              )}
            </div>

            <h4 className="font-bold text-slate-800 text-lg mb-1">
              {bote.nombre}
            </h4>
            <p className="text-slate-400 text-xs truncate mb-6">
              {bote.direccion}
            </p>

            <div className="w-full bg-slate-100 h-6 rounded-2xl overflow-hidden mb-4 border border-slate-50 p-1">
              <div
                className={`h-full rounded-xl transition-all duration-1000 ${bote.nivelLlenado > 85 ? "bg-gradient-to-r from-red-400 to-red-600" : "bg-gradient-to-r from-green-400 to-green-600"}`}
                style={{ width: `${bote.nivelLlenado}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs font-black uppercase tracking-tight">
              <span className="text-slate-400">Estado: {bote.estadoBote}</span>
              <span
                className={
                  bote.nivelLlenado > 85 ? "text-red-500" : "text-slate-800"
                }
              >
                {bote.nivelLlenado}%
              </span>
            </div>

            <button
              onClick={() => manejarVaciado(bote.id)}
              disabled={bote.nivelLlenado < 80 || cargando}
              className={`mt-8 w-full py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all 
                 ${bote.nivelLlenado >= 80 && !cargando ? "bg-green-600 hover:bg-green-700 text-white shadow-lg" : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"}`}
            >
              {cargando ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <RotateCcw size={16} />
              )}
              {cargando ? "PROCESANDO..." : "RECOGER CARGA"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EncargadoDashboard;
