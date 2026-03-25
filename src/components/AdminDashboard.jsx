import {
  ShieldCheck,
  Store,
  Users,
  MapPin,
  BarChart3,
  ChevronRight,
  Settings,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = ({ usuario, irAAlmacen }) => {
  const [metricas, setMetricas] = useState({ totalUsuarios: 0, totalKilos: 0 });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/reportes")
      .then((res) => setMetricas(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-700 pb-20">
      {/* HEADER DE IDENTIDAD - AHORA EN VERDE CIRCULAR */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden mb-10 text-left border-4 border-white/20">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30 text-green-100">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-100">
              Consola de Administración
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black italic tracking-tighter leading-none mb-2">
                ¡Hola,
              </h2>
              <h3 className="text-3xl font-bold opacity-90 text-green-50">
                {usuario?.nombre || "Administrador"}!
              </h3>
            </div>

            <div className="bg-black/20 backdrop-blur-lg px-6 py-4 rounded-3xl border border-white/10 flex gap-8">
              <div>
                <p className="text-[9px] font-black uppercase text-green-200 tracking-widest mb-1">
                  Métricas Ciudad
                </p>
                <p className="text-2xl font-black">
                  {metricas.totalKilos} <span className="text-xs">KG</span>
                </p>
              </div>
              <div className="w-[1px] h-full bg-white/20"></div>
              <div>
                <p className="text-[9px] font-black uppercase text-green-200 tracking-widest mb-1">
                  Estatus
                </p>
                <p className="text-2xl font-black uppercase italic text-emerald-300">
                  Activo
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Adorno visual: Logo de reciclaje gigante de fondo */}
        <ShieldCheck
          size={280}
          className="absolute -right-16 -bottom-16 text-white/5 rotate-12"
        />
      </div>

      <div className="flex items-center justify-between px-6 mb-6">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
          Módulos de Control Maestro
        </p>
        <div className="flex items-center gap-2 text-[9px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <Info size={12} /> SISTEMA BLINDADO
        </div>
      </div>

      {/* --- GRID DE SERVICIOS (COHERENCIA VISUAL) --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {/* CARD: CONTROL DE ALMACEN */}
        <button
          onClick={irAAlmacen}
          className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col items-center gap-4 hover:bg-green-50 transition-all group active:scale-95 hover:border-green-200"
        >
          <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
            <Store size={28} />
          </div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
              Gestionar
            </span>
            <span className="text-[11px] font-black text-green-600 uppercase italic mt-1">
              Almacén Eco
            </span>
          </div>
        </button>

        {/* CARD: USUARIOS */}
        <button className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col items-center gap-4 hover:bg-green-50 transition-all group active:scale-95 hover:border-green-200">
          <div className="bg-green-100 p-4 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
            <Users size={28} />
          </div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
              Comunidad
            </span>
            <span className="text-[11px] font-black text-green-600 uppercase italic mt-1">
              Usuarios
            </span>
          </div>
        </button>

        {/* CARD: PUNTOS FISICOS */}
        <button className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center gap-4 hover:bg-green-50 transition-all group active:scale-95 hover:border-green-200">
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
            <MapPin size={28} />
          </div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
              Botes
            </span>
            <span className="text-[11px] font-black text-green-600 uppercase italic mt-1">
              Estaciones
            </span>
          </div>
        </button>

        {/* CARD: AJUSTES */}
        <button className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col items-center gap-4 hover:bg-slate-100 transition-all group active:scale-95">
          <div className="bg-slate-100 p-4 rounded-2xl text-slate-500 group-hover:bg-slate-800 group-hover:text-white transition-all shadow-sm">
            <Settings size={28} />
          </div>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
              Soporte
            </span>
            <span className="text-[11px] font-black text-slate-400 uppercase italic mt-1">
              Configuración
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
