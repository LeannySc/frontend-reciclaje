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
import MonitorBotes from "./components/MonitorBotes"; // IMPORTANTE: Crear este archivo

function App() {
  const [usuario, setUsuario] = useState(null);
  const [modo, setModo] = useState("LOGIN");
  const [verPerfil, setVerPerfil] = useState(false);
  const [verCatalogo, setVerCatalogo] = useState(false);
  const [verHistorial, setVerHistorial] = useState(false);
  const [verMonitor, setVerMonitor] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ESTADO GLOBAL DE BOTES PARA EL RECOLECTOR
  const [botes, setBotes] = useState([]);

  // Función para refrescar botes desde cualquier parte
  const refrescarBotes = () => {
    axios
      .get("http://localhost:8080/api/puntos/todos")
      .then((res) => setBotes(res.data))
      .catch(() => console.log("Esperando conexión con la red..."));
  };

  // Efecto de refresco automático si es Encargado
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

      {/* --- NAVBAR DINÁMICO --- */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[110] px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            setVerCatalogo(false);
            setVerHistorial(false);
            setVerMonitor(false);
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
              className={`text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 overflow-hidden animate-in slide-in-from-top-2">
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
                      setVerCatalogo(false);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <History size={18} className="text-orange-500" /> Huella
                    Ecológica
                  </button>
                  <button
                    onClick={() => {
                      setVerCatalogo(true);
                      setVerHistorial(false);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ShoppingBag size={18} className="text-blue-500" /> Ver
                    Maravillas
                  </button>
                </>
              )}

              {usuario.rol === "ENCARGADO" && (
                <button
                  onClick={() => {
                    setVerMonitor(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <LayoutList size={18} className="text-green-600" /> Monitor de
                  Ruta
                </button>
              )}

              <button
                onClick={salir}
                className="w-full flex items-center gap-3 px-6 py-4 text-xs font-black text-red-500 hover:bg-red-50 mt-2 border-t"
              >
                <LogOut size={18} /> Salir del Sistema
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* --- RENDERIZADO DE MÓDULOS --- */}
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
              <EncargadoDashboard
                usuario={usuario}
                botes={botes}
                irAMonitor={() => setVerMonitor(true)}
              />
            )}
            {usuario.rol === "ADMINISTRADOR" && (
              <AdminDashboard usuario={usuario} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
