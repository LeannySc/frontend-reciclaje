import Mapa from "./components/Mapa";
import { Recycle, TrendingUp, Wallet, MapPin, Award } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER TIPO STARTUP */}
      <header className="bg-white border-b border-green-100 p-5 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg shadow-inner">
              <Recycle className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-800">
              PLASTI<span className="text-green-600">USOS</span>
            </h1>
          </div>
          <div className="hidden md:block">
            <span className="text-sm font-medium text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
              📍 Sede Actual: Popayán, Cauca
            </span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PANEL LATERAL IZQUIERDO */}
        <div className="space-y-6">
          {/* TARJETA DE BILLETERA (Tu ID 1 del Backend) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-green-900/10 border border-white hover:border-green-100 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-xl">
                <Wallet className="text-green-600" size={20} />
              </div>
              <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">
                Mi Saldo Eco
              </h3>
            </div>

            <div className="flex flex-col mb-6">
              <div className="flex items-baseline">
                <span className="text-6xl font-black tracking-tight text-slate-800">
                  1920
                </span>
                <span className="ml-2 text-lg font-bold text-green-600">
                  PTS
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Has recolectado{" "}
                <strong className="text-slate-700">15.4 kg</strong> de material
                esta semana.
              </p>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 flex justify-center items-center gap-2 group">
              <Award
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              CANJEAR MARAVILLA
            </button>
          </div>

          {/* TARJETA DE INFO EXTRA */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
            <TrendingUp
              size={80}
              className="absolute -bottom-4 -right-4 opacity-10 rotate-12"
            />
            <h4 className="font-bold text-lg mb-1 italic">Día de Campaña</h4>
            <p className="text-green-100 text-sm opacity-90">
              Hoy tus kilos en el Parque Caldas valen x2.
            </p>
          </div>
        </div>

        {/* CONTENEDOR DEL MAPA (2/3 de la pantalla) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white h-full flex flex-col">
            <div className="flex items-center justify-between mb-5 px-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-green-600" size={24} />
                <h3 className="font-bold text-lg">
                  Puntos de Recogida Cercanos
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Activos ahora: 1
                </span>
              </div>
            </div>

            {/* AREA DEL MAPA - Aseguramos altura para que no se borre */}
            <div className="flex-1 min-h-[500px] bg-slate-50 rounded-[1.8rem] overflow-hidden border border-slate-100 shadow-inner">
              <Mapa />
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER DISCRETO */}
      <footer className="max-w-7xl mx-auto p-10 text-center text-slate-300 text-sm font-medium">
        PLATIUSOS 2025 • PROYECTO UNIVERSITARIO POPAYÁN
      </footer>
    </div>
  );
}

export default App;
