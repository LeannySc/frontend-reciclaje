import { ShieldCheck, PackageSearch, Bell, AlertTriangle } from "lucide-react";

const EncargadoDashboard = ({ usuario }) => {
  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* INFO DEL PUNTO ASIGNADO */}
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <ShieldCheck
          size={180}
          className="absolute -right-12 -top-12 opacity-10"
        />
        <h3 className="text-green-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
          Administrador de Punto
        </h3>
        <h2 className="text-4xl font-black mb-6 tracking-tighter">
          Estación ID: {usuario.puntoID}
        </h2>
        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30 text-xs font-bold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Operando Ahora
        </div>
      </div>

      {/* COLA DE TRABAJO */}
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center">
        <PackageSearch size={48} className="text-slate-200 mb-4" />
        <h4 className="font-bold text-slate-800">Cola de Verificación</h4>
        <p className="text-slate-400 text-sm max-w-[250px] mt-2">
          Próximamente aquí verás las entregas por pesar con el sensor de carga.
        </p>
        <button className="mt-6 bg-slate-100 text-slate-500 px-6 py-2 rounded-2xl font-bold text-xs uppercase cursor-not-allowed">
          0 pendientes
        </button>
      </div>

      <div className="lg:col-span-2 bg-yellow-50 border border-yellow-100 p-8 rounded-[2rem] flex items-center gap-4 text-yellow-700">
        <AlertTriangle size={32} />
        <div>
          <h5 className="font-bold uppercase text-xs tracking-wider">
            Protocolo de Seguridad
          </h5>
          <p className="text-sm opacity-80">
            Verifica siempre que el usuario haya separado el material
            correctamente antes de VALIDAR el puntaje.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EncargadoDashboard;
