import {
  Wallet,
  MapPin,
  Award,
  History,
  TrendingUp,
  ScanQrCode,
  Eye,
  Info,
  Recycle,
  Sparkles,
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
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700 pb-10">
      {/* --- SECCIÓN BALANCES (Estilo Nequi Disponible) --- */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Recycle size={200} className="rotate-12" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Puntos Disponibles
                </span>
                <Eye size={12} className="opacity-50" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black tracking-tighter">
                  {puntosTotales.toLocaleString()}
                </span>
                <span className="text-green-400 font-bold text-xs uppercase tracking-tighter">
                  Eco Pts
                </span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Nivel Eco
                </span>
              </div>
              <p className="text-sm font-black mt-1">
                {puntosTotales < 100 ? "🌱 Iniciado" : 
                 puntosTotales < 500 ? "🌿 Activo" : 
                 puntosTotales < 1000 ? "🌳 Experto" : "🌎 Maestro"}
              </p>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="mt-6">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Progreso al siguiente nivel</span>
              <span>{Math.min(100, Math.floor((puntosTotales % 500) / 5))}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (puntosTotales % 500) / 5)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID DE SERVICIOS (Accesos Directos) --- */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={irACatalogo}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center gap-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100/50 hover:border-blue-200 hover:-translate-y-1 transition-all group active:scale-95"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3.5 rounded-2xl text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
            <Award size={22} />
          </div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
            Maravillas
          </span>
        </button>

        <button
          onClick={() => alert("Próximamente: Cámara para Scan QR 📸")}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center gap-3 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-100/50 hover:border-green-200 hover:-translate-y-1 transition-all group active:scale-95"
        >
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3.5 rounded-2xl text-white group-hover:shadow-lg group-hover:shadow-green-500/30 transition-all">
            <ScanQrCode size={22} />
          </div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
            Reciclar
          </span>
        </button>

        <button
          onClick={irAHistorial}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center gap-3 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-100/50 hover:border-orange-200 hover:-translate-y-1 transition-all group active:scale-95"
        >
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3.5 rounded-2xl text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all">
            <History size={22} />
          </div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">
            Movimientos
          </span>
        </button>
      </div>

      {/* --- MAPA FULL SIZE (La Joya Logística) --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-xl">
              <MapPin size={16} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
                Estaciones Cercanas
              </h3>
              <p className="text-[9px] font-medium text-slate-400">
                Encuentra puntos de reciclaje en Popayán
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            En vivo
          </span>
        </div>

        <div className="h-[500px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border-4 border-white overflow-hidden relative">
          <Mapa mostrarInfo={true} />

          {/* Tooltip flotante dentro del mapa */}
          <div className="absolute bottom-6 left-6 right-6 z-[1000] bg-white/95 backdrop-blur-xl p-4 rounded-3xl border border-white/50 shadow-xl hidden sm:flex items-center gap-4 animate-in slide-in-from-bottom-2">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-2.5 rounded-xl shadow-lg">
              <Info size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-700 leading-tight">
                Busca los marcadores en el mapa para encontrar puntos de recolección
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                🟢 Normal • 🟡 Medio • 🔴 Lleno
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ESTADÍSTICAS RÁPIDAS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {[
          { icon: Recycle, label: "Total Entregas", value: usuario.historialEntrega?.length || 0, color: "from-green-500 to-emerald-600" },
          { icon: TrendingUp, label: "Kg Reciclados", value: (usuario.historialEntrega?.reduce((acc, e) => acc + (e.kilos || 0), 0) || 0).toFixed(1), color: "from-blue-500 to-cyan-600" },
          { icon: Award, label: "Canjes Realizados", value: usuario.canjes?.length || 0, color: "from-purple-500 to-pink-600" },
          { icon: Sparkles, label: "Impacto CO₂", value: `${((usuario.historialEntrega?.reduce((acc, e) => acc + (e.kilos || 0), 0) || 0) * 2.1).toFixed(1)} kg`, color: "from-amber-500 to-orange-600" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/30">
            <div className={`bg-gradient-to-br ${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-3`}>
              <stat.icon size={18} />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-black text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecicladorDashboard;
