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
  Package,
  Menu,
  X,
} from "lucide-react";

import Registro from "./components/Registro";
import Login from "./components/Login";
import Perfil from "./components/Perfil";
import Catalogo from "./components/Catalogo";
import RecicladorDashboard from "./components/RecicladorDashboard";
import EncargadoDashboard from "./components/EncargadoDashboard";
import AdminDashboard from "./components/AdminDashboard";
import HistorialEco from "./components/HistorialEco";
import MonitorBotes from "./components/MonitorBotes";
import GestionCatalogo from "./components/GestionCatalogo";

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

  const cerrarVistas = () => {
    setVerCatalogo(false);
    setVerHistorial(false);
    setVerMonitor(false);
    setVerAlmacen(false);
    setMenuOpen(false);
  };

  if (modo === "LOGIN")
    return (
      <div className="min-h-screen bg-green-600 flex items-center justify-center p-4">
        <Toaster position="top-center" richColors />
        <Login alLoguear={loginExitoso} irARegistro={() => setModo("REGISTRO")} />
      </div>
    );

  if (modo === "REGISTRO")
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Toaster position="top-center" richColors />
        <Registro alRegistrar={loginExitoso} irALogin={() => setModo("LOGIN")} />
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

      {/* Overlay para cerrar menú en móvil */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-110 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <button
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={cerrarVistas}
        >
          <div className="bg-green-600 p-1.5 sm:p-2 rounded-xl text-white shadow-lg shadow-green-100">
            <Recycle size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="font-black text-slate-800 text-base sm:text-xl tracking-tighter uppercase hidden xs:block">
            PlastiUsos
          </span>
        </button>

        {/* Info de usuario (tablet/desktop) */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span
            className={`px-2 py-1 rounded-full text-[9px] font-black ${
              usuario?.rol === "RECICLADOR"
                ? "bg-green-100 text-green-700"
                : usuario?.rol === "ENCARGADO"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {usuario?.rol}
          </span>
        </div>

        {/* Menú de usuario */}
        <div className="relative">
          {/* Botón desktop */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hidden sm:flex items-center gap-3 bg-slate-100 p-2 pl-4 rounded-2xl border border-slate-200 hover:bg-white transition-all"
          >
            <span className="text-sm font-bold text-slate-700 max-w-30 truncate">
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

          {/* Botón móvil (hamburger) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden flex items-center gap-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Dropdown menú */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-72 sm:w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-120">
              {/* Header en móvil */}
              <div className="sm:hidden px-6 py-3 border-b border-slate-50 mb-1">
                <p className="font-black text-slate-800 text-sm">{usuario?.nombre}</p>
                <p
                  className={`text-[10px] font-black uppercase mt-1 ${
                    usuario?.rol === "RECICLADOR"
                      ? "text-green-600"
                      : usuario?.rol === "ENCARGADO"
                      ? "text-blue-600"
                      : "text-purple-600"
                  }`}
                >
                  {usuario?.rol}
                </p>
              </div>

              <button
                onClick={() => { setVerPerfil(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Settings size={18} className="text-green-600" /> Mi Perfil
              </button>

              {usuario.rol === "RECICLADOR" && (
                <>
                  <button
                    onClick={() => { setVerHistorial(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                  >
                    <History size={18} className="text-orange-500" /> Huella Ecológica
                  </button>
                  <button
                    onClick={() => { setVerCatalogo(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                  >
                    <ShoppingBag size={18} className="text-blue-500" /> Catálogo
                  </button>
                </>
              )}

              {usuario.rol === "ENCARGADO" && (
                <button
                  onClick={() => { setVerMonitor(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  <LayoutList size={18} className="text-green-600" /> Monitor Ruta
                </button>
              )}

              {usuario.rol === "ADMINISTRADOR" && (
                <button
                  onClick={() => { setVerAlmacen(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  <Package size={18} className="text-blue-600" /> Almacén Eco
                </button>
              )}

              <button
                onClick={salir}
                className="w-full flex items-center gap-3 px-6 py-4 text-xs font-black text-red-500 hover:bg-red-50 border-t mt-1"
              >
                <LogOut size={18} /> Salir
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-350 mx-auto p-4 sm:p-6 lg:p-10">
        {verCatalogo ? (
          <Catalogo usuario={usuario} alRegresar={() => setVerCatalogo(false)} alCanjeExitoso={setUsuario} />
        ) : verHistorial ? (
          <HistorialEco usuario={usuario} alRegresar={() => setVerHistorial(false)} />
        ) : verMonitor ? (
          <MonitorBotes botes={botes} usuarioId={usuario.id} alRegresar={() => setVerMonitor(false)} refrescar={refrescarBotes} />
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
              <AdminDashboard usuario={usuario} irAAlmacen={() => setVerAlmacen(true)} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
