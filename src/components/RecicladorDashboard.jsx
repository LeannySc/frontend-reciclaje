import { useState } from "react";
import {
  Star, Recycle, Package, Gift, ScanQrCode,
  MapPin, ShoppingBag, History, Info, Leaf,
  TrendingUp, CheckCircle, Clock, XCircle,
  ChevronRight, ArrowRight, Navigation,
} from "lucide-react";
import Mapa from "./Mapa";
import EscaneoQR from "./EscaneoQR";
import { toast } from "sonner";

// Niveles eco gamificados
const NIVELES = [
  { nombre: "Semilla Verde", min: 0, max: 200, emoji: "🌱", color: "bg-gray-400" },
  { nombre: "Brote Ecológico", min: 200, max: 500, emoji: "🌿", color: "bg-green-400" },
  { nombre: "Guerrero Verde", min: 500, max: 1500, emoji: "🌳", color: "bg-green-600" },
  { nombre: "Guardián del Planeta", min: 1500, max: 3000, emoji: "🌍", color: "bg-emerald-600" },
  { nombre: "Leyenda Eco", min: 3000, max: Infinity, emoji: "🏆", color: "bg-amber-500" },
];

const EstadoBadge = ({ estado }) => {
  const cfg = {
    VALIDADA: { label: "Aprobada", icon: CheckCircle, cls: "bg-green-100 text-green-700" },
    aprobado: { label: "Aprobada", icon: CheckCircle, cls: "bg-green-100 text-green-700" },
    PENDIENTE: { label: "Pendiente", icon: Clock, cls: "bg-amber-100 text-amber-700" },
    pendiente: { label: "Pendiente", icon: Clock, cls: "bg-amber-100 text-amber-700" },
    RECHAZADA: { label: "Rechazada", icon: XCircle, cls: "bg-red-100 text-red-600" },
    rechazado: { label: "Rechazada", icon: XCircle, cls: "bg-red-100 text-red-600" },
  }[estado] || { label: estado, icon: Clock, cls: "bg-gray-100 text-gray-600" };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.cls}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
};

// Mini bar chart con SVG puro
function MiniBarChart({ data }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-20 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-green-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: "2px" }}
            title={`${d.label}: ${d.value} pts`}
          />
          <span className="text-[9px] text-gray-400 font-medium truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const RecicladorDashboard = ({ usuario, irACatalogo, irAHistorial }) => {
  const [scanneando, setScanneando] = useState(false);

  const entregas = usuario?.historialEntrega || [];
  const canjes = usuario?.canjes || [];

  const puntosDisponibles = usuario?.saldoPuntos ||
    entregas.filter((e) => e.estado === "VALIDADA").reduce((acc, e) => acc + (e.puntosOtorgados || 0), 0);

  const kgTotal = entregas.reduce((acc, e) => acc + (e.kilosEntregados || e.peso || 0), 0);
  const entregasAprobadas = entregas.filter((e) => e.estado === "VALIDADA").length;
  const canjesRealizados = canjes.length;

  // Nivel eco
  const nivelActual = NIVELES.find((n) => puntosDisponibles >= n.min && puntosDisponibles < n.max) || NIVELES[0];
  const siguienteNivel = NIVELES[NIVELES.indexOf(nivelActual) + 1];
  const progreso = siguienteNivel
    ? Math.round(((puntosDisponibles - nivelActual.min) / (siguienteNivel.min - nivelActual.min)) * 100)
    : 100;

  // Datos para el chart (últimas 6 entregas agrupadas por mes simulado)
  const chartData = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"].map((mes, i) => ({
    label: mes,
    value: entregas.length > 0 ? Math.round((entregas[i]?.puntosOtorgados || 0)) : Math.floor(Math.random() * 200),
  }));

  // Movimientos recientes (entregas + canjes mezclados)
  const movimientosRecientes = [
    ...entregas.slice(0, 3).map((e) => ({ ...e, tipo: "entrega", fecha: e.fechaEntrega })),
    ...canjes.slice(0, 2).map((c) => ({ ...c, tipo: "canje", fecha: c.fechaPedido })),
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">

      {/* GREETING */}
      <div>
        <h1 className="text-gray-900 text-2xl sm:text-3xl font-bold">
          ¡Hola, {usuario?.nombre?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Resumen de tu actividad de reciclaje en Popayán</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Puntos Disponibles", value: puntosDisponibles.toLocaleString(),
            sub: "+280 esta semana", icon: Star, iconBg: "bg-green-500", cardBg: "bg-green-50 border-green-100",
          },
          {
            label: "Kg Reciclados", value: `${kgTotal || 0} kg`,
            sub: "Total acumulado", icon: Recycle, iconBg: "bg-blue-500", cardBg: "bg-blue-50 border-blue-100",
          },
          {
            label: "Entregas Realizadas", value: entregas.length,
            sub: `${entregasAprobadas} aprobadas`, icon: Package, iconBg: "bg-amber-500", cardBg: "bg-amber-50 border-amber-100",
          },
          {
            label: "Canjes Realizados", value: canjesRealizados,
            sub: "Premios obtenidos", icon: Gift, iconBg: "bg-purple-500", cardBg: "bg-purple-50 border-purple-100",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-2xl p-4 sm:p-5 border ${stat.cardBg}`}>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-gray-600 text-xs sm:text-sm mt-0.5 font-medium">{stat.label}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* CHART + QUICK ACTIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Mini chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 font-semibold">Actividad Reciente</h3>
            <span className="text-green-600 text-sm flex items-center gap-1 font-medium">
              <TrendingUp className="w-4 h-4" /> +18% vs mes anterior
            </span>
          </div>
          <MiniBarChart data={chartData} />
          <div className="mt-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm opacity-80" />
            <span className="text-xs text-gray-500">Puntos ganados por mes</span>
          </div>
        </div>

        {/* Quick actions + Eco level */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h3 className="text-gray-900 font-semibold mb-4">Acciones Rápidas</h3>
          <div className="space-y-2.5">
            {[
              { label: "Buscar Punto de Entrega", emoji: "📍", bg: "bg-blue-50 hover:bg-blue-100", action: () => toast.info("Mira el mapa abajo") },
              { label: "Canjear mis Puntos", emoji: "🎁", bg: "bg-purple-50 hover:bg-purple-100", action: irACatalogo },
              { label: "Ver mis Entregas", emoji: "📋", bg: "bg-green-50 hover:bg-green-100", action: irAHistorial },
              { label: "Escanear Bote QR", emoji: "📷", bg: "bg-amber-50 hover:bg-amber-100", action: () => setScanneando(true) },
            ].map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                className={`w-full flex items-center justify-between p-3 rounded-xl ${action.bg} transition-colors group text-left`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{action.emoji}</span>
                  <span className="text-gray-700 text-sm font-medium">{action.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>
            ))}
          </div>

          {/* Eco Level */}
          <div className="mt-5 bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{nivelActual.emoji}</span>
              <span className="text-green-800 text-sm font-semibold">Nivel: {nivelActual.nombre}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-700" style={{ width: `${progreso}%` }} />
            </div>
            <p className="text-green-600 text-xs mt-1.5">
              {siguienteNivel
                ? `${puntosDisponibles} / ${siguienteNivel.min} pts para "${siguienteNivel.nombre}"`
                : "¡Nivel máximo alcanzado! 🏆"
              }
            </p>
          </div>
        </div>
      </div>

      {/* TRANSACCIONES + TABLA MATERIALES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Últimas transacciones */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 font-semibold">Últimas Transacciones</h3>
            <button onClick={irAHistorial} className="text-green-600 text-sm flex items-center gap-1 hover:text-green-700 font-medium">
              Ver todas <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {movimientosRecientes.length > 0 ? movimientosRecientes.map((mov, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    mov.tipo === "entrega" ? "bg-green-100" : "bg-purple-100"
                  }`}>
                    {mov.tipo === "entrega"
                      ? <Recycle className="w-4 h-4 text-green-600" />
                      : <Gift className="w-4 h-4 text-purple-600" />
                    }
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">
                      {mov.tipo === "entrega" ? `Entrega #${mov.id}` : `Canje: ${mov.producto?.nombre || "Premio"}`}
                    </p>
                    <p className="text-gray-400 text-xs">{mov.fecha?.slice(0, 10)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <EstadoBadge estado={mov.estado} />
                  <span className={`text-sm font-bold ${mov.tipo === "entrega" ? "text-green-600" : "text-red-500"}`}>
                    {mov.tipo === "entrega" ? `+${mov.puntosOtorgados || 0}` : `-${mov.producto?.costoPuntos || 0}`} pts
                  </span>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-gray-400">
                <Leaf className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sin transacciones aún. ¡Empieza a reciclar!</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de puntos por material */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h3 className="text-gray-900 font-semibold mb-4">Puntos por Material</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icono: "🧴", nombre: "PET", pts: 15 },
              { icono: "📦", nombre: "Cartón", pts: 10 },
              { icono: "🫙", nombre: "Vidrio", pts: 8 },
              { icono: "🥫", nombre: "Metal", pts: 20 },
              { icono: "📄", nombre: "Papel", pts: 5 },
              { icono: "💻", nombre: "E-waste", pts: 50 },
            ].map((m) => (
              <div key={m.nombre} className="text-center p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-2xl mb-1">{m.icono}</div>
                <p className="text-gray-700 text-xs font-medium">{m.nombre}</p>
                <p className="text-green-600 text-sm font-bold">{m.pts} pts/kg</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAPA INTERACTIVO (HU-10) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-gray-900 font-semibold">Puntos de Recolección · Popayán</h3>
            <p className="text-gray-500 text-xs mt-0.5">Haz clic en un marcador para ver detalles y nivel de llenado</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-green-600 rounded-full" /> Disponible
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full" /> Lleno
            </div>
          </div>
        </div>
        <div className="h-[300px] sm:h-[400px] lg:h-[480px]">
          <Mapa />
        </div>
        <div className="px-5 py-3 bg-slate-900 flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-xl flex-shrink-0">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-white/80 font-medium uppercase tracking-wide">
            Vista en tiempo real · Red industrial de recolección Popayán
          </p>
        </div>
      </div>

      {scanneando && <EscaneoQR userId={usuario.id} alCerrar={() => setScanneando(false)} />}
    </div>
  );
};

export default RecicladorDashboard;
