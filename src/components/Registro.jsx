import { useState } from "react";
import axios from "axios";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  MapPin,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const Registro = ({ alRegistrar, irALogin }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "RECICLADOR",
    puntoID: "",
  });

  // NUEVOS ESTADOS PARA LA HU-01
  const [paso, setPaso] = useState(1); // Paso 1: Datos, Paso 2: PIN
  const [codigoPin, setCodigoPin] = useState("");
  const [cargando, setCargando] = useState(false);

  const inputStyle =
    "w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all";

  // --- PASO 1: REGISTRO INICIAL ---
  const handleRegistroInicial = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Usamos el Factory del backend
      await axios.post(
        `http://localhost:8080/api/identidad/fabricar?rol=${formData.rol}`,
        {
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          puntoID: formData.rol === "ENCARGADO" ? formData.puntoID : null,
        },
      );

      toast.success("¡Datos recibidos!", {
        description:
          "Revisa la consola del backend para obtener tu código PIN.",
      });

      setPaso(2); // Pasamos a la pantalla de ingreso de PIN
    } catch (error) {
      console.error(error);
      toast.error("Error en el registro inicial.");
    } finally {
      setCargando(false);
    }
  };

  // --- PASO 2: VERIFICACIÓN DEL PIN (HU-01 VALIDACIÓN 3) ---
  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Llamamos al nuevo método validarCuenta del backend
      const response = await axios.post(
        `http://localhost:8080/api/identidad/verificar?correo=${formData.correo}&codigo=${codigoPin}`,
      );

      if (response.data === true) {
        toast.success("¡Cuenta activada con éxito!", {
          description: "Ya eres parte de la red PlastiUsos.",
        });

        // Obtenemos los datos finales del usuario verificado para iniciar sesión
        const loginRes = await axios.post(
          "http://localhost:8080/api/identidad/login",
          {
            correo: formData.correo,
            contrasena: formData.contrasena,
          },
        );

        alRegistrar(loginRes.data);
      } else {
        toast.error("Código inválido", {
          description: "El PIN ingresado no coincide.",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error técnico al verificar.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-green-50 max-w-md w-full animate-in fade-in zoom-in duration-500">
      {/* HEADER DINÁMICO */}
      <div className="text-center mb-8">
        <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
          {paso === 1 ? <UserPlus size={32} /> : <Lock size={32} />}
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          {paso === 1 ? "Únete al Cambio" : "Verifica tu Identidad"}
        </h2>
        <p className="text-slate-400 font-medium">
          {paso === 1
            ? "Crea tu cuenta eco-circular"
            : "Hemos generado un PIN de 6 dígitos"}
        </p>
      </div>

      {/* --- FORMULARIO PASO 1 (DATOS) --- */}
      {paso === 1 && (
        <form onSubmit={handleRegistroInicial} className="space-y-4">
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
              placeholder="Contraseña"
              className={inputStyle}
              onChange={(e) =>
                setFormData({ ...formData, contrasena: e.target.value })
              }
            />
          </div>

          {/* SELECTOR DE ROL */}
          <div className="p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`py-3 rounded-xl text-sm font-black transition-all ${formData.rol === "RECICLADOR" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"}`}
              onClick={() => setFormData({ ...formData, rol: "RECICLADOR" })}
            >
              RECICLADOR
            </button>
            <button
              type="button"
              className={`py-3 rounded-xl text-sm font-black transition-all ${formData.rol === "ENCARGADO" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"}`}
              onClick={() => setFormData({ ...formData, rol: "ENCARGADO" })}
            >
              ENCARGADO
            </button>
          </div>

          {formData.rol === "ENCARGADO" && (
            <div className="relative animate-in slide-in-from-top-2 duration-300">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500"
                size={18}
              />
              <input
                type="number"
                required
                placeholder="ID de tu Estación"
                className="w-full pl-12 pr-4 py-4 bg-green-50 border border-green-200 rounded-2xl text-green-900 font-bold"
                onChange={(e) =>
                  setFormData({ ...formData, puntoID: e.target.value })
                }
              />
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3"
          >
            {cargando ? <Loader2 className="animate-spin" /> : "GENERAR CÓDIGO"}
          </button>

          <button
            type="button"
            onClick={irALogin}
            className="w-full text-slate-400 text-sm font-bold mt-2 hover:text-green-600"
          >
            ¿Ya eres parte de PlastiUsos? Entrar aquí
          </button>
        </form>
      )}

      {/* --- FORMULARIO PASO 2 (PIN DE VERIFICACIÓN) --- */}
      {paso === 2 && (
        <form
          onSubmit={handleVerificarCodigo}
          className="space-y-6 animate-in slide-in-from-right duration-500"
        >
          <div>
            <input
              required
              type="text"
              maxLength="6"
              placeholder="PIN DE 6 DÍGITOS"
              className="w-full text-center text-4xl font-black tracking-[0.2em] py-6 bg-slate-50 rounded-3xl border-2 border-slate-100 focus:border-green-500 outline-none"
              onChange={(e) => setCodigoPin(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 active:scale-95"
          >
            {cargando ? (
              <Loader2 className="animate-spin" />
            ) : (
              "ACTIVAR CUENTA ECO"
            )}
          </button>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="text-slate-400 text-sm font-bold hover:text-slate-800 uppercase tracking-tighter"
            >
              Ajustar Datos o Correo
            </button>
            <div className="text-[10px] text-slate-400 font-bold uppercase p-4 bg-slate-50 rounded-xl">
              * El PIN lo encontrarás impreso en los logs del servidor (Fase
              Beta).
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Registro;
