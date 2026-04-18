import { useState } from "react";
import {
  CheckCircle, Clock, XCircle, Recycle,
  Star, Filter, ChevronLeft, Gift, Leaf,
} from "lucide-react";

const estadoConfig = {
  VALIDADA: { label: "Aprobada", icon: CheckCircle, cls: "bg-green-100 text-green-700" },
  aprobado: { label: "Aprobada", icon: CheckCircle, cls: "bg-green-100 text-green-700" },
  PENDIENTE: { label: "Pendiente", icon: Clock, cls: "bg-amber-100 text-amber-700" },
  pendiente: { label: "Pendiente", icon: Clock, cls: "bg-amber-100 text-amber-700" },
  RECHAZADA: { label: "Rechazada", icon: XCircle, cls: "bg-red-100 text-red-600" },
  rechazado: { label: "Rechazada", icon: XCircle, cls: "bg-red-100 text-red-600" },
  entregado: { label: "Entregado", icon: CheckCircle, cls: "bg-blue-100 text-blue-700" },
};

const EstadoBadge = ({ estado }) => {
  const cfg = estadoConfig[estado] || { label: estado, icon: Clock, cls: "bg-gray-100 text-gray-500" };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.cls}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
};

const HistorialEco = ({ usuario, alRegresar }) => {
  const [tab, setTab] = useState("entregas");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const entregas = usuario?.historialEntrega || [];
  const canjes = usuario?.canjes || [];

  const totalPuntosGanados = entregas
    .filter((e) => e.estado === "VALIDADA" || e.estado === "aprobado")
    .reduce((s, e) => s + (e.puntosOtorgados || 0), 0);
  const totalPuntosCanjeados = canjes.reduce((s, c) => s + (c.producto?.costoPuntos || 0), 0);

  const entregasFiltradas = entregas.filter((e) =>
    estadoFiltro === "todos" ? true : e.estado === estadoFiltro
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-400 pb-10">

      {/* HEADER */}
      <div className="mb-6 sm:mb-8 flex items-center gap-3">
        <button onClick={alRegresar} className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">Historial de Actividad</h1>
          <p className="text-gray-500 text-sm mt-0.5">Registro completo de tus entregas y canjes</p>
        </div>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Entregas", value: entregas.length, icon: Recycle, cls: "bg-green-50 border-green-100 text-green-700" },
          { label: "Pts Ganados", value: totalPuntosGanados.toLocaleString(), icon: Star, cls: "bg-amber-50 border-amber-100 text-amber-700" },
          { label: "Canjes", value: canjes.length, icon: Gift, cls: "bg-purple-50 border-purple-100 text-purple-700" },
          { label: "Pts Canjeados", value: totalPuntosCanjeados.toLocaleString(), icon: Star, cls: "bg-red-50 border-red-100 text-red-600" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-2xl border p-4 ${s.cls.split(" ").slice(0, 2).join(" ")}`}>
              <Icon className={`w-5 h-5 mb-2 ${s.cls.split(" ")[2]}`} />
              <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* TABS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { id: "entregas", label: `Entregas (${entregas.length})` },
            { id: "canjes", label: `Canjes (${canjes.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "border-b-2 border-green-600 text-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* FILTRO DE ESTADO (solo entregas) */}
        {tab === "entregas" && (
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            {["todos", "VALIDADA", "PENDIENTE", "RECHAZADA"].map((e) => (
              <button
                key={e}
                onClick={() => setEstadoFiltro(e)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  estadoFiltro === e ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {e === "todos" ? "Todos" : estadoConfig[e]?.label || e}
              </button>
            ))}
          </div>
        )}

        {/* LISTA ENTREGAS */}
        {tab === "entregas" && (
          <div className="divide-y divide-gray-50">
            {entregasFiltradas.length === 0 ? (
              <div className="py-14 text-center text-gray-400">
                <Leaf className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No hay entregas con este filtro</p>
              </div>
            ) : entregasFiltradas.map((ent, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <Recycle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-semibold">
                      Entrega en {ent.punto?.nombre || `Punto #${ent.puntoId || i + 1}`}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <EstadoBadge estado={ent.estado} />
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400 text-xs">{ent.fechaEntrega?.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-bold shrink-0 ${
                  ent.estado === "VALIDADA" || ent.estado === "aprobado" ? "text-green-600" : "text-gray-400"
                }`}>
                  {ent.estado === "VALIDADA" || ent.estado === "aprobado" ? `+${ent.puntosOtorgados}` : "—"} pts
                </span>
              </div>
            ))}
          </div>
        )}

        {/* LISTA CANJES */}
        {tab === "canjes" && (
          <div className="divide-y divide-gray-50">
            {canjes.length === 0 ? (
              <div className="py-14 text-center text-gray-400">
                <Gift className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No has realizado canjes aún</p>
              </div>
            ) : canjes.map((canje, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {canje.producto?.imagenUrl
                      ? <img src={canje.producto.imagenUrl} alt="" className="w-full h-full object-cover" />
                      : <Gift className="w-5 h-5 text-purple-600" />
                    }
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-semibold">{canje.producto?.nombre || "Premio"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <EstadoBadge estado={canje.estado} />
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400 text-xs">{canje.fechaPedido?.slice(0, 10)}</span>
                    </div>
                    {canje.direccionEntrega && (
                      <p className="text-gray-400 text-xs mt-0.5">📍 {canje.direccionEntrega}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm font-bold text-red-500 shrink-0">
                  -{canje.producto?.costoPuntos || 0} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialEco;
