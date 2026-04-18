import {
  ArrowUpRight,
  ArrowDownLeft,
  Leaf,
  ChevronLeft,
} from "lucide-react";

const HistorialEco = ({ usuario, alRegresar }) => {
  const movimientos = [
    ...(usuario.historialEntrega || []).map((ent) => ({ ...ent, tipo: "ENTREGA" })),
    ...(usuario.canjes || []).map((canje) => ({ ...canje, tipo: "CANJE" })),
  ].sort(
    (a, b) =>
      new Date(b.fechaEntrega || b.fechaPedido) -
      new Date(a.fechaEntrega || a.fechaPedido)
  );

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-right duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={alRegresar}
          className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-xl sm:rounded-full transition-colors flex-shrink-0"
        >
          <ChevronLeft size={26} className="text-slate-800" />
        </button>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tighter">
          Mis Movimientos
        </h2>
      </div>

      {/* LISTA */}
      <div className="space-y-4 sm:space-y-8">
        {movimientos.length > 0 ? (
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden">
            {movimientos.map((mov, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-b-0"
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div
                    className={`p-3 sm:p-4 rounded-full flex-shrink-0 ${
                      mov.tipo === "ENTREGA"
                        ? "bg-green-100 text-green-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {mov.tipo === "ENTREGA" ? (
                      <ArrowDownLeft size={18} className="sm:w-5 sm:h-5" />
                    ) : (
                      <ArrowUpRight size={18} className="sm:w-5 sm:h-5" />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] sm:text-xs tracking-tight">
                      {mov.tipo === "ENTREGA" ? "Depósito de Plástico" : "Canje de Maravilla"}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase truncate">
                      {mov.tipo === "ENTREGA"
                        ? `Estación ${mov.punto?.nombre || "Popayán"}`
                        : mov.producto?.nombre}
                    </p>
                    <span className="text-[9px] sm:text-[10px] text-slate-300 font-bold uppercase italic">
                      {new Date(mov.fechaEntrega || mov.fechaPedido).toLocaleDateString()} · {mov.estado}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  <span
                    className={`text-base sm:text-lg font-black ${
                      mov.tipo === "ENTREGA" ? "text-green-600" : "text-purple-600"
                    }`}
                  >
                    {mov.tipo === "ENTREGA"
                      ? `+${mov.puntosOtorgados}`
                      : `-${mov.producto?.costoPuntos}`}
                  </span>
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    ECO PTS
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-white rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-slate-100">
            <Leaf size={44} className="mx-auto text-slate-200 mb-4" />
            <p className="font-black text-slate-300 uppercase tracking-widest text-xs sm:text-sm">
              Sin movimientos recientes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialEco;
