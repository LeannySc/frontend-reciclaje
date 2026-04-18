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

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* --- SECCIÓN SUPERIOR: SISTEMA DE TARJETAS FLUIDO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 px-2">
        
        {/* WALLET ECO (4/12 en desktop, 100% en móvil) */}
        <div className="xl:col-span-4 bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px] border-b-8 border-green-600 transition-transform hover:scale-[1.01]">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Wallet size={120} className="rotate-12" />
          </div>
          
          <div className="relative z-10 text-left">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Billetera Disponible</span>
              <Eye size={12} className="opacity-40" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl md:text-7xl font-black">{puntosTotales}</h2>
              <span className="text-xl font-bold text-green-400 uppercase italic">pts</span>
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-center bg-white/5 p-3 rounded-2xl backdrop-blur-md">
             <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Usuario Verificado</span>
             </div>
             <ChevronRight size={14} className="text-slate-500" />
          </div>
        </div>

        {/* ACCESOS RÁPIDOS (8/12 en desktop, reordena en móvil) */}
        <div className="xl:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
           {[
             { label: 'Maravillas', sub: 'Tienda Eco', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50', action: irACatalogo },
             { label: 'Escanear', sub: 'Abrir Cámara', icon: ScanQrCode, color: 'text-green-600', bg: 'bg-green-50', action: () => setScanneando(true) },
             { label: 'Movimientos', sub: 'Historial', icon: History, color: 'text-orange-600', bg: 'bg-orange-50', action: irAHistorial },
             { label: 'Información', sub: 'Ayuda Pro', icon: Info, color: 'text-purple-600', bg: 'bg-purple-50', action: () => toast.info("Guía: Escanea un bote real") }
           ].map((item, idx) => (
             <button key={idx} onClick={item.action} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-green-300 transition-all flex flex-col items-center justify-center gap-3 group active:scale-95">
                <div className={`${item.bg} ${item.color} p-5 rounded-3xl transition-all group-hover:scale-110 shadow-sm`}>
                   <item.icon size={32} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.label}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.sub}</span>
                </div>
             </button>
           ))}
        </div>
      </div>

      {/* --- SECCIÓN CENTRAL: MAPA LOGÍSTICO (Usa todo el ancho sobrante) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-2">
        
        {/* Panel lateral de info (Aparece al lado en pantallas grandes, arriba en móvil) */}
        <div className="xl:col-span-3 space-y-4 order-2 xl:order-1 text-left">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between h-full min-h-[300px] xl:min-h-0">
              <div>
                <div className="bg-red-50 w-10 h-10 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin size={20} className="text-red-500" />
                </div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-tight mb-4">Estaciones en Popayán</h3>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6 uppercase">
                  Identifica las celdas azules para activar la tecnología IoT del bote de basura.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4 transition-colors hover:bg-green-50 hover:border-green-200">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <MousePointer2 size={18} className="text-green-600" />
                  </div>
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-widest leading-none">Click en PIN <br/> para info</span>
              </div>
           </div>
        </div>

        {/* MAPA GIANT FULL (9 de 12 columnas en Desktop) */}
        <div className="xl:col-span-9 h-[550px] md:h-[650px] bg-white rounded-[3.5rem] shadow-2xl border-[12px] border-white overflow-hidden relative shadow-slate-200 order-1 xl:order-2">
           <Mapa />
           
           {/* Tooltip de navegación pro */}
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-6">
              <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[2rem] border border-white/20 flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
                  <div className="bg-green-600 p-2.5 rounded-2xl">
                     <Navigation size={20} className="text-white" />
                  </div>
                  <p className="text-[10px] text-white font-bold text-left leading-tight uppercase tracking-tight">
                    Vista aérea en tiempo real conectada a la red industrial de recolección.
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