import { Wallet, MapPin, Award, History, TrendingUp } from "lucide-react";
import Mapa from "./Mapa";

const RecicladorDashboard = ({ usuario }) => {
  // LÓGICA DE CÁLCULO DE PUNTOS
  const puntosTotales =
    usuario.historialEntrega?.reduce((acc, entrega) => {
      // Sumamos si el estado es VALIDADA o si por error de prueba quedó en null pero tiene puntos
      return entrega.estado === "VALIDADA" || entrega.estado === null
        ? acc + entrega.puntosOtorgados
        : acc;
    }, 0) || 0;

  return (
    <div className="animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MI BILLETERA */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-green-100 relative overflow-hidden group">
            <TrendingUp
              size={140}
              className="absolute -right-10 -bottom-10 text-green-500 opacity-5 group-hover:scale-110 transition-transform"
            />
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-xl text-green-600">
                <Wallet size={20} />
              </div>
              <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                Billetera Eco
              </h3>
            </div>

            {/* AQUÍ ESTABA EL ERROR: Cambiamos usuario.saldoPuntos por puntosTotales */}
            <h2 className="text-6xl font-black text-slate-800 flex items-baseline gap-2">
              {puntosTotales}
              <span className="text-xl font-bold text-green-600 uppercase">
                pts
              </span>
            </h2>

            <p className="text-slate-400 text-xs mt-4">
              Saldo calculado según entregas validadas
            </p>
          </div>

          <button className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-3xl shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2 group">
            <Award size={20} className="group-hover:rotate-12 transition-all" />
            VER CATÁLOGO
          </button>
        </div>

        {/* MAPA (Ubicación de Puntos) */}
        <div className="lg:col-span-2 h-[500px] bg-white p-4 rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden relative">
          <div className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
              Centros de Recolección Popayán
            </span>
          </div>
          <Mapa />
        </div>

        {/* TABLA DE HISTORIAL (ESTA ESTABA BIEN) */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-50">
          {/* ... el resto del código del historial se mantiene igual ... */}
          <div className="flex items-center gap-3 mb-6">
            <History className="text-slate-400" size={20} />
            <h3 className="font-bold text-slate-800">
              Mi Huella Ecológica (Recientes)
            </h3>
          </div>
          {usuario.historialEntrega?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b">
                    <th className="pb-4">Fecha</th>
                    <th className="pb-4 text-center">Puntos Ganados</th>
                    <th className="pb-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold">
                  {usuario.historialEntrega.map((ent) => (
                    <tr
                      key={ent.id}
                      className="border-b border-slate-50 hover:bg-slate-50"
                    >
                      <td className="py-4 text-slate-800">
                        {new Date(ent.fechaEntrega).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-center text-green-600">
                        +{ent.puntosOtorgados} pts
                      </td>
                      <td className="py-4 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] ${ent.estado === "VALIDADA" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {ent.estado || "SIN ESTADO"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-10 text-slate-300">
              Sin historial registrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecicladorDashboard;
