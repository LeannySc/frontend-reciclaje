import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "sonner";
import {
  Recycle,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronDown,
  ShoppingBag,
  History,
  LayoutList,
  Package, // <-- IMPORTADO AHORA
} from "lucide-react";

// Componentes
import Registro from "./components/Registro";
import Login from "./components/Login";
import Perfil from "./components/Perfil";
import Catalogo from "./components/Catalogo";
import RecicladorDashboard from "./components/RecicladorDashboard";
import EncargadoDashboard from "./components/EncargadoDashboard";
import AdminDashboard from "./components/AdminDashboard";
import HistorialEco from "./components/HistorialEco";
import MonitorBotes from "./components/MonitorBotes";
import GestionCatalogo from "./components/GestionCatalogo"; // Sincronizado

function App() {
  const [usuario, setUsuario] = useState(null);
  const [modo, setModo] = useState("LOGIN");
  const [verPerfil, setVerPerfil] = useState(false);
  const [verCatalogo, setVerCatalogo] = useState(false);
  const [verHistorial, setVerHistorial] = useState(false);
  const [verMonitor, setVerMonitor] = useState(false);
  const [verAlmacen, setVerAlmacen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [botes, setBotes] = useState([]);

  const refrescarBotes = () => {
    axios
      .get("http://localhost:8080/api/puntos/todos")
      .then((res) => setBotes(res.data))
      .catch(() => console.log("Conectando con red..."));
  };

  useEffect(() => {
    if (usuario?.rol === "ENCARGADO") {
      refrescarBotes();
      const interval = setInterval(refrescarBotes, 5000);
      return () => clearInterval(interval);
    }
  }, [usuario]);

  const loginExitoso = (u) => {
    setUsuario(u);
    setModo("DASHBOARD");
  };

  const salir = () => {
    setUsuario(null);
    setModo("LOGIN");
    setVerPerfil(false);
    setVerCatalogo(false);
    setVerHistorial(false);
    setVerMonitor(false);
    setVerAlmacen(false);
  };

  if (modo === "LOGIN")
    return (
      <div className="h-screen bg-green-600 flex items-center justify-center p-4">
        <Toaster position="top-center" richColors />
        <Login
          alLoguear={loginExitoso}
          irARegistro={() => setModo("REGISTRO")}
        />
      </div>
    );

  if (modo === "REGISTRO")
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-4">
        <Toaster position="top-center" richColors />
        <Registro
          alRegistrar={loginExitoso}
          irALogin={() => setModo("LOGIN")}
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Toaster position="top-center" richColors />
      {verPerfil && (
        <Perfil
          usuario={usuario}
          alActualizar={setUsuario}
          alCerrar={() => setVerPerfil(false)}
        />
      )}

      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[110] px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            setVerCatalogo(false);
            setVerHistorial(false);
            setVerMonitor(false);
            setVerAlmacen(false);
          }}
        >
          <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg shadow-green-100">
            <Recycle size={24} />
          </div>
          <span className="font-black text-slate-800 text-xl tracking-tighter uppercase">
            PlastiUsos
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 bg-slate-100 p-2 pl-4 rounded-2xl border border-slate-200 hover:bg-white transition-all"
          >
            <span className="text-sm font-bold text-slate-700">
              {usuario?.nombre}
            </span>
            <div className="bg-slate-900 p-2 rounded-xl text-white">
              <UserIcon size={16} />
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 animate-in slide-in-from-top-2">
              <button
                onClick={() => {
                  setVerPerfil(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Settings size={18} className="text-green-600" /> Mi Perfil
              </button>

              {usuario.rol === "RECICLADOR" && (
                <>
                  <button
                    onClick={() => {
                      setVerHistorial(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                  >
                    <History size={18} className="text-orange-500" /> Huella
                    Ecológica
                  </button>
                  <button
                    onClick={() => {
                      setVerCatalogo(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                  >
                    <ShoppingBag size={18} className="text-blue-500" /> Catálogo
                  </button>
                </>
              )}

              {usuario.rol === "ENCARGADO" && (
                <button
                  onClick={() => {
                    setVerMonitor(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  <LayoutList size={18} className="text-green-600" /> Monitor
                  Ruta
                </button>
              )}

              {usuario.rol === "ADMINISTRADOR" && (
                <button
                  onClick={() => {
                    setVerAlmacen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  <Package size={18} className="text-blue-600" /> Almacén Eco
                </button>
              )}

              <button
                onClick={salir}
                className="w-full flex items-center gap-3 px-6 py-4 text-xs font-black text-red-500 hover:bg-red-50 border-t"
              >
                <LogOut size={18} /> Salir
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6 lg:p-10">
        {verCatalogo ? (
          <Catalogo
            usuario={usuario}
            alRegresar={() => setVerCatalogo(false)}
            alCanjeExitoso={setUsuario}
          />
        ) : verHistorial ? (
          <HistorialEco
            usuario={usuario}
            alRegresar={() => setVerHistorial(false)}
          />
        ) : verMonitor ? (
          <MonitorBotes
            botes={botes}
            usuarioId={usuario.id}
            alRegresar={() => setVerMonitor(false)}
            refrescar={refrescarBotes}
          />
        ) : verAlmacen ? (
          <GestionCatalogo alRegresar={() => setVerAlmacen(false)} />
        ) : (
          <div className="animate-in fade-in duration-700">
            {usuario.rol === "RECICLADOR" && (
              <RecicladorDashboard
                usuario={usuario}
                irACatalogo={() => setVerCatalogo(true)}
                irAHistorial={() => setVerHistorial(true)}
              />
            )}
            {usuario.rol === "ENCARGADO" && (
              <EncargadoDashboard usuario={usuario} botes={botes} />
            )}
            {usuario.rol === "ADMINISTRADOR" && (
              <AdminDashboard
                usuario={usuario}
                irAAlmacen={() => setVerAlmacen(true)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
