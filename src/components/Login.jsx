import { useState } from "react";
import axios from "axios";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Importar Toasts

const Login = ({ alLoguear, irARegistro }) => {
  const [datos, setDatos] = useState({ correo: "", contrasena: "" });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/identidad/login",
        datos,
      );

      // UX Pro: Toast de éxito
      toast.success(`Bienvenido, ${res.data.nombre}`, {
        description: "Accediendo a tu tablero de economía circular",
      });

      setTimeout(() => alLoguear(res.data), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Fallo de Autenticación", {
        description: "Revisa tus credenciales e intenta de nuevo.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-green-50 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
          <LogIn className="text-white" size={30} />
        </div>
        <h2 className="text-3xl font-black text-slate-800">Iniciar Sesión</h2>
        <p className="text-slate-400">Entra a tu cuenta PlastiUsos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="email"
            required
            placeholder="Tu correo"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-slate-900 font-semibold outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
          />
        </div>
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="password"
            required
            placeholder="Tu contraseña"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-slate-900 font-semibold outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setDatos({ ...datos, contrasena: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all flex justify-center items-center gap-3"
        >
          {cargando ? <Loader2 className="animate-spin" /> : "ENTRAR AL PANEL"}
        </button>

        <button
          type="button"
          onClick={irARegistro}
          className="w-full text-slate-400 text-sm font-bold mt-4 hover:text-green-600"
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </form>
    </div>
  );
};

export default Login;
