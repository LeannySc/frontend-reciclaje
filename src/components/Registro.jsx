import { useState } from "react";
import axios from "axios";
import { UserPlus, Mail, Lock, User, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner"; // UX Profesional

const Registro = ({ alRegistrar, irALogin }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "RECICLADOR",
    puntoID: "",
  });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Ajuste técnico: enviamos el Rol en la URL para que el Factory lo intercepte
      const response = await axios.post(
        `http://localhost:8080/api/identidad/fabricar?rol=${formData.rol}`,
        {
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          puntoID: formData.rol === "ENCARGADO" ? formData.puntoID : null,
        },
      );

      toast.success("¡Cuenta Creada!", {
        description: "Ya eres parte de la red PlastiUsos — Popayán",
      });

      setTimeout(() => alRegistrar(response.data), 1500);
    } catch (error) {
      console.error(error); // Ahora sí usamos 'error' para el log técnico
      toast.error("Error en la Fábrica de Usuarios", {
        description: "El correo ya existe o el punto es inválido.",
      });
    } finally {
      setCargando(false);
    }
  };

  const inputStyle =
    "w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all";

  // EL RETURN DEBE ESTAR AQUÍ, FUERA DEL HANDLE SUBMIT
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-green-50 max-w-md w-full animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="text-green-600" size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          Únete al Cambio
        </h2>
        <p className="text-slate-400 font-medium">
          Crea tu identidad eco-circular
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* INPUTS BÁSICOS */}
        <div className="relative">
          <User
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            required
            placeholder="Tu Nombre Real"
            className={inputStyle}
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
        </div>

        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="email"
            required
            placeholder="tu@correo.com"
            className={inputStyle}
            value={formData.correo}
            onChange={(e) =>
              setFormData({ ...formData, correo: e.target.value })
            }
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
            placeholder="Contraseña de Seguridad"
            className={inputStyle}
            value={formData.contrasena}
            onChange={(e) =>
              setFormData({ ...formData, contrasena: e.target.value })
            }
          />
        </div>

        {/* SELECTOR DE ROLES */}
        <div className="p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`py-3 rounded-xl text-sm font-black transition-all ${
              formData.rol === "RECICLADOR"
                ? "bg-white text-green-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setFormData({ ...formData, rol: "RECICLADOR" })}
          >
            SOY CIUDADANO
          </button>
          <button
            type="button"
            className={`py-3 rounded-xl text-sm font-black transition-all ${
              formData.rol === "ENCARGADO"
                ? "bg-white text-green-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setFormData({ ...formData, rol: "ENCARGADO" })}
          >
            SOY OPERADOR
          </button>
        </div>

        {/* CONDICIONAL ENCARGADO */}
        {formData.rol === "ENCARGADO" && (
          <div className="relative animate-in slide-in-from-top-2 duration-300">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500"
              size={18}
            />
            <input
              type="number"
              required
              placeholder="Código del Punto de Popayán"
              className="w-full pl-12 pr-4 py-4 bg-green-50 border border-green-200 rounded-2xl text-green-900 font-bold placeholder:text-green-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={formData.puntoID}
              onChange={(e) =>
                setFormData({ ...formData, puntoID: e.target.value })
              }
            />
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 active:scale-95 mt-6 disabled:opacity-50"
        >
          {cargando ? <Loader2 className="animate-spin" /> : "ACTIVAR CUENTA"}
        </button>

        <button
          type="button"
          onClick={irALogin}
          className="w-full text-slate-400 text-sm font-bold mt-2 hover:text-green-600"
        >
          ¿Ya eres parte de PlastiUsos? Entrar aquí
        </button>
      </form>
    </div>
  );
};

export default Registro;
