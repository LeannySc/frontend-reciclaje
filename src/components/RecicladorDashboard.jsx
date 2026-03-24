import {
  Wallet,
  MapPin,
  Award,
  History,
  TrendingUp,
  ScanQrCode,
  Eye,
  Info,
} from "lucide-react";
import Mapa from "./Mapa";

const RecicladorDashboard = ({ usuario, irACatalogo, irAHistorial }) => {
  // Calculamos puntos de la misma forma industrial
  const puntosTotales =
    usuario.historialEntrega?.reduce(
      (acc, ent) =>
        ent.estado === "VALIDADA" ? acc + ent.puntosOtorgados : acc,
      0,
    ) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* --- SECCIÓN BALANCES (Estilo Nequi Disponible) --- */}
      <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet size={120} className="rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Puntos Disponibles
            </span>
            <Eye size={12} className="opacity-50" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">
              {puntosTotales.toLocaleString()}
            </span>
            <span className="text-green-400 font-bold text-xs uppercase tracking-tighter">
              Eco Pts
            </span>
          </div>
        </div>
      </div>

      {/* --- GRID DE SERVICIOS (Accesos Directos) --- */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={irACatalogo}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-green-50 transition-all group active:scale-95"
        >
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Award size={20} />
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
            Maravillas
          </span>
        </button>

        <button
          onClick={() => alert("Próximamente: Cámara para Scan QR 📸")}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-green-50 transition-all group active:scale-95"
        >
          <div className="bg-green-100 p-3 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
            <ScanQrCode size={20} />
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
            Reciclar
          </span>
        </button>

        <button
          onClick={irAHistorial}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-green-50 transition-all group active:scale-95"
        >
          <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
            <History size={20} />
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
            Movimientos
          </span>
        </button>
      </div>

      {/* --- MAPA FULL SIZE (La Joya Logística) --- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin size={14} className="text-red-500" /> Estaciones Cercanas
          </h3>
          <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 uppercase">
            Popayán Real-Time
          </span>
        </div>

        <div className="h-[450px] bg-white rounded-[2.5rem] shadow-2xl border-8 border-white overflow-hidden relative shadow-slate-200">
          <Mapa />

          {/* Tooltip flotante dentro del mapa */}
          <div className="absolute bottom-6 left-6 right-6 z-[1000] bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white flex items-center gap-4 animate-in slide-in-from-bottom-2">
            <div className="bg-slate-900 text-white p-2 rounded-xl">
              <Info size={16} />
            </div>
            <p className="text-[10px] font-bold text-slate-700 leading-tight">
              Busca los pines azules en el mapa para encontrar puntos de
              recolección disponibles en la ciudad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecicladorDashboard;
