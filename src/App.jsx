import { useEffect, useState } from "react";
import Registro from "./components/Registro";
import Login from "./components/Login";
import Perfil from "./components/Perfil";
import RecicladorDashboard from "./components/RecicladorDashboard";
import EncargadoDashboard from "./components/EncargadoDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { Recycle, LogOut, Settings } from "lucide-react";
import axios from "axios";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [modo, setModo] = useState("LOGIN");
  const [verPerfil, setVerPerfil] = useState(false);

  useEffect(() => {
    // Intenta cargar al usuario 1 al iniciar para agilizar pruebas
    axios
      .get("http://localhost:8080/api/identidad/1")
      .then((res) => {
        setUsuario(res.data);
        setModo("DASHBOARD");
      })
      .catch((err) => {
        console.error("Detalle del error:", err);
        console.log("No hay sesion iniciada, mostrando login.");
      });
  }, []);

  const loginExitoso = (u) => {
    setUsuario(u);
    setModo("DASHBOARD");
  };

  const salir = () => {
    setUsuario(null);
    setModo("LOGIN");
  };

  // --- VISTAS INICIALES ---
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

  // --- VISTA PRINCIPAL (DASHBOARD PERSONALIZADO POR UML) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {verPerfil && (
        <Perfil
          usuario={usuario}
          alActualizar={(nuevoU) => setUsuario(nuevoU)}
          alCerrar={() => setVerPerfil(false)}
        />
      )}

      {/* NAVBAR GLOBAL */}
      <nav className="bg-white p-5 border-b border-green-100 sticky top-0 z-50 shadow-sm flex justify-between items-center px-10">
        <div className="flex items-center gap-2">
          <Recycle className="text-green-600" />
          <span className="font-black text-slate-800 tracking-tighter uppercase">
            PlastiUsos
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setVerPerfil(true)}
            className="flex items-center gap-1 text-xs font-black uppercase text-slate-500 hover:text-green-600 transition-colors"
          >
            <Settings size={14} /> Perfil
          </button>
          <button
            onClick={salir}
            className="flex items-center gap-1 text-xs font-black uppercase text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </nav>

      {/* CONTENIDO DINÁMICO SEGÚN ROL DEL UML */}
      <main className="max-w-7xl mx-auto p-10">
        {usuario.rol === "RECICLADOR" && (
          <RecicladorDashboard usuario={usuario} />
        )}
        {usuario.rol === "ENCARGADO" && (
          <EncargadoDashboard usuario={usuario} />
        )}
        {usuario.rol === "ADMINISTRADOR" && (
          <div className="bg-white p-20 rounded-[4rem] shadow-xl border-4 border-dashed border-slate-100 text-center">
            <h2 className="text-4xl font-black text-slate-300">
              MODO ADMINISTRADOR
            </h2>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest">
              Lógica de Reportes en construcción 🚧
            </p>
          </div>
        )}
        /Rol administrador en construcción, se muestra placeholder mientras se
        desarrolla la lógica de reportes y gestión de usuarios./
        {usuario.rol === "ADMINISTRADOR" && (
          <AdminDashboard usuario={usuario} />
        )}
      </main>
    </div>
  );
}

export default App;
