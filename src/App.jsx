import { useState } from "react";
import Registro from "./components/Registro";
import Login from "./components/Login";
import Perfil from "./components/Perfil";
import Mapa from "./components/Mapa";
import { Recycle, LogOut, Settings, Wallet, MapPin } from "lucide-react";

function App() {
  const [usuario, setUsuario] = useState(null); // Billetera de usuario
  const [modo, setModo] = useState("LOGIN"); // LOGIN, REGISTRO, DASHBOARD
  const [verPerfil, setVerPerfil] = useState(false);

  // Manejo de Iniciar Sesion (UML)
  const loginExitoso = (u) => {
    setUsuario(u);
    setModo("DASHBOARD");
  };

  // Manejo de Cerrar Sesion (UML)
  const salir = () => {
    setUsuario(null);
    setModo("LOGIN");
  };

  // RENDER CONDICIONAL DE VISTAS
  if (modo === "LOGIN")
    return (
      <div className="h-screen bg-green-600 flex items-center justify-center bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/double-bubble-outline.png')] p-4">
        <Login
          alLoguear={loginExitoso}
          irARegistro={() => setModo("REGISTRO")}
        />
      </div>
    );

  if (modo === "REGISTRO")
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-4">
        <Registro
          alRegistrar={loginExitoso}
          irALogin={() => setModo("LOGIN")}
        />
      </div>
    );

  // VISTA FINAL: EL DASHBOARD CON MAPA
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {verPerfil && (
        <Perfil
          usuario={usuario}
          alActualizar={(nuevoU) => setUsuario(nuevoU)}
          alCerrar={() => setVerPerfil(false)}
        />
      )}

      <nav className="bg-white p-5 border-b border-green-100 sticky top-0 z-50 shadow-sm flex justify-between items-center px-10">
        <div className="flex items-center gap-2">
          <Recycle className="text-green-600" />
          <span className="font-black text-slate-800 tracking-tighter">
            PLASTIUSOS
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setVerPerfil(true)}
            className="flex items-center gap-1 text-xs font-black uppercase text-slate-500 hover:text-green-600"
          >
            <Settings size={14} /> Perfil
          </button>
          <button
            onClick={salir}
            className="flex items-center gap-1 text-xs font-black uppercase text-red-500"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Wallet size={12} /> Mi Billetera
            </h3>
            <div className="text-2xl font-bold mt-2 text-slate-800 line-clamp-1">
              {usuario.nombre}
            </div>
            <div className="text-7xl font-black text-slate-800 mt-2 flex items-baseline gap-2">
              {usuario.saldoPuntos ?? 0}{" "}
              <span className="text-xl text-green-600 uppercase font-black">
                pts
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-[2.5rem] h-[550px] overflow-hidden shadow-2xl shadow-green-900/10 border-4 border-white">
          <Mapa />
        </div>
      </main>
    </div>
  );
}

export default App;
