import { useState } from "react";
import {
  Wallet, MapPin, Award, History,
  ScanQrCode, Eye, Info, Navigation,
  MousePointer2, Sparkles, ChevronRight
} from "lucide-react";
import Mapa from "./Mapa";
import EscaneoQR from "./EscaneoQR";
import { toast } from "sonner";

const RecicladorDashboard = ({ usuario, irACatalogo, irAHistorial }) => {
  const [scanneando, setScanneando] = useState(false);

  const puntosTotales = usuario.historialEntrega?.reduce(
    (acc, ent) => (ent.estado === "VALIDADA" ? acc + ent.puntosOtorgados : acc),
    0
  ) || 0;

  const acciones = [
    { label: 'Maravillas', sub: 'Tienda Eco', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50', action: irACatalogo },
    { label: 'Escanear', sub: 'Abrir Cámara', icon: ScanQrCode, color: 'text-green-600', bg: 'bg-green-50', action: () => setScanneando(true) },
    { label: 'Movimientos', sub: 'Historial', icon: History, color: 'text-orange-600', bg: 'bg-orange-50', action: irAHistorial },
    { label: 'Ayuda', sub: 'Guía Pro', icon: Info, color: 'text-purple-600', bg: 'bg-purple-50', action: () => toast.info("Guía: Escanea un bote real") }
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-8">

      {/* === FILA SUPERIOR === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-6">

        {/* WALLET ECO */}
        <div className="sm:col-span-1 xl:col-span-4 bg-slate-900 text-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[180px] sm:min-h-[220px] border-b-8 border-green-600">
          <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-10">
            <Wallet size={100} className="rotate-12 sm:w-[120px] sm:h-[120px]" />
          </div>

          <div className="relative z-10 text-left">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                Billetera Disponible
              </span>
              <Eye size={11} className="opacity-40" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black">{puntosTotales}</h2>
              <span className="text-base sm:text-xl font-bold text-green-400 uppercase italic">pts</span>
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-center bg-white/5 p-3 rounded-2xl backdrop-blur-md mt-4">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-yellow-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Usuario Verificado</span>
            </div>
            <ChevronRight size={13} className="text-slate-500" />
          </div>
        </div>

        {/* ACCESOS RÁPIDOS */}
        <div className="sm:col-span-1 xl:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {acciones.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="bg-white border border-slate-100 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-green-300 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 group active:scale-95 min-h-[100px] sm:min-h-0"
            >
              <div className={`${item.bg} ${item.color} p-3 sm:p-5 rounded-2xl sm:rounded-3xl transition-all group-hover:scale-110 shadow-sm`}>
                <item.icon size={24} strokeWidth={2.5} className="sm:w-8 sm:h-8" />
              </div>
              <div className="flex flex-col leading-tight text-center">
                <span className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-tight">{item.label}</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-tighter hidden sm:block">{item.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* === MAPA + PANEL LATERAL === */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">

        {/* Panel info lateral (arriba en móvil, izquierda en desktop) */}
        <div className="xl:col-span-3 order-2 xl:order-1">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-sm text-left flex flex-col sm:flex-row xl:flex-col gap-4 sm:gap-8 xl:gap-6 xl:min-h-[300px]">
            <div className="flex-1">
              <div className="bg-red-50 w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                <MapPin size={18} className="text-red-500" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tighter leading-tight mb-2 sm:mb-4">
                Estaciones en Popayán
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold leading-relaxed uppercase hidden sm:block">
                Identifica las celdas para activar la tecnología IoT del bote.
              </p>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 flex items-center gap-3 sm:gap-4 hover:bg-green-50 hover:border-green-200 transition-colors cursor-default">
              <div className="bg-white p-2 rounded-xl shadow-sm flex-shrink-0">
                <MousePointer2 size={16} className="text-green-600" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-green-700 uppercase tracking-widest leading-tight">
                Click en PIN <br className="hidden sm:block" /> para info
              </span>
            </div>
          </div>
        </div>

        {/* MAPA */}
        <div className="xl:col-span-9 order-1 xl:order-2 h-[280px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl border-[8px] sm:border-[12px] border-white overflow-hidden relative shadow-slate-200">
          <Mapa />

          {/* Tooltip de navegación */}
          <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xs sm:max-w-sm px-4 sm:px-6">
            <div className="bg-slate-900/90 backdrop-blur-xl p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-white/20 flex items-center gap-3 sm:gap-4 shadow-2xl">
              <div className="bg-green-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl flex-shrink-0">
                <Navigation size={16} className="text-white sm:w-5 sm:h-5" />
              </div>
              <p className="text-[9px] sm:text-[10px] text-white font-bold text-left leading-tight uppercase tracking-tight">
                Vista aérea en tiempo real · red industrial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {scanneando && (
        <EscaneoQR userId={usuario.id} alCerrar={() => setScanneando(false)} />
      )}
    </div>
  );
};

export default RecicladorDashboard;
