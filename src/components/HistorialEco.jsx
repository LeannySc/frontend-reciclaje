import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Leaf,
  Gift,
  ChevronLeft,
} from "lucide-react";

const HistorialEco = ({ usuario, alRegresar }) => {
  // Combinamos entregas y canjes si los hay en el objeto usuario
  const movimientos = [
    ...(usuario.historialEntrega || []).map((ent) => ({
      ...ent,
      tipo: "ENTREGA",
    })),
    ...(usuario.canjes || []).map((canje) => ({ ...canje, tipo: "CANJE" })),
  ].sort(
    (a, b) =>
      new Date(b.fechaEntrega || b.fechaPedido) -
      new Date(a.fechaEntrega || a.fechaPedido),
  );

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-right duration-500">
      {/* HEADER TIPO APP MÓVIL */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={alRegresar}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={28} className="text-slate-800" />
        </button>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
          Mis Movimientos
        </h2>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative mb-8">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Busca por punto o producto..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium text-slate-600"
        />
      </div>

      {/* LISTA DE MOVIMIENTOS */}
      <div className="space-y-8">
        {movimientos.length > 0 ? (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden">
            {movimientos.map((mov, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* ICONO CIRCULAR SEGÚN TIPO */}
                  <div
                    className={`p-4 rounded-full ${mov.tipo === "ENTREGA" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"}`}
                  >
                    {mov.tipo === "ENTREGA" ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 uppercase text-xs tracking-tight">
                      {mov.tipo === "ENTREGA"
                        ? "Depósito de Plástico"
                        : "Canje de Maravilla"}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      {mov.tipo === "ENTREGA"
                        ? `Estación ${mov.punto?.nombre || "Popayán"}`
                        : mov.producto?.nombre}
                    </p>
                    <span className="text-[10px] text-slate-300 font-bold uppercase italic">
                      {new Date(
                        mov.fechaEntrega || mov.fechaPedido,
                      ).toLocaleDateString()}{" "}
                      • {mov.estado}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-lg font-black ${mov.tipo === "ENTREGA" ? "text-green-600" : "text-purple-600"}`}
                  >
                    {mov.tipo === "ENTREGA"
                      ? `+${mov.puntosOtorgados}`
                      : `-${mov.producto?.costoPuntos}`}
                  </span>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    ECO PUNTOS
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <Leaf size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="font-black text-slate-300 uppercase tracking-widest text-sm">
              Sin movimientos recientes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialEco;
