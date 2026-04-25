import { useState } from "react";
import axios from "axios";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  MapPin,
  Loader2,
  Leaf,
  ShieldCheck,
  ArrowLeft,
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
  const [cargando, setCargando] = useState(false);
  const [paso, setPaso] = useState(1);
  const [codigoPin, setCodigoPin] = useState("");

  const inputStyle =
    "w-full pl-12 pr-4 py-5 bg-white border-2 border-slate-50 rounded-2xl text-slate-900 font-semibold focus:border-green-500 focus:bg-white outline-none transition-all shadow-sm";

  const handleRegistroInicial = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await axios.post(
        `http://localhost:8080/api/identidad/fabricar?rol=${formData.rol}`,
        formData,
      );
      toast.success("¡Datos enviados!", {
        description: "PIN generado en el servidor.",
      });
      setPaso(2);
    } catch (error) {
      toast.error("Fallo en registro", {
        description: "Verifica que el correo sea nuevo.",
      });
    } finally {
      setCargando(false);
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/identidad/verificar?correo=${formData.correo}&codigo=${codigoPin}`,
      );
      if (response.data === true) {
        toast.success("Cuenta verificada con éxito");
        const loginRes = await axios.post(
          "http://localhost:8080/api/identidad/login",
          { correo: formData.correo, contrasena: formData.contrasena },
        );
        alRegistrar(loginRes.data);
      } else {
        toast.error("Código incorrecto");
      }
    } catch (e) {
      toast.error("Error técnico de validación");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-white overflow-hidden shadow-2xl rounded-3xl">
      {/* LADO IZQUIERDO: IMAGEN Y MENSAJE (Copia del estilo del Login) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-20 flex-col justify-between relative overflow-hidden text-left text-white border-r-8 border-green-600">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-3">
          <Leaf className="text-green-500" size={32} />
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            PlastiUsos
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-7xl font-black leading-none mb-8 uppercase italic tracking-tighter">
            ÚNETE A LA <br /> <span className="text-green-500">REVOLUCIÓN</span>{" "}
            <br /> VERDE
          </h1>
          <div className="space-y-4">
            {[
              { t: "Recupera plásticos.", c: "bg-green-600" },
              { t: "Gana maravillas.", c: "bg-green-700" },
              { t: "Salva Popayán.", c: "bg-green-800" },
            ].map((m, i) => (
              <div
                key={i}
                className={`px-6 py-3 rounded-2xl ${m.c} font-black text-xs uppercase tracking-widest inline-block mr-4 shadow-lg`}
              >
                {m.t}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-slate-400">
          <ShieldCheck size={20} className="text-green-600" />
          <p className="text-xs font-bold uppercase tracking-widest">
            Infraestructura de Grado Industrial 4.0
          </p>
        </div>
      </div>

      {/* LADO DERECHO: FORMULARIO DINÁMICO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-right-10 duration-700">
          <button
            onClick={irALogin}
            className="mb-10 text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </button>

          <div className="text-left mb-12">
            <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-2 italic uppercase leading-none">
              {paso === 1 ? "Crear Perfil" : "Verificar PIN"}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
              {paso === 1
                ? "Inicia tu camino hacia la economía circular."
                : "Introduce los 6 dígitos generados por el servidor."}
            </p>
          </div>

          {paso === 1 ? (
            <form
              onSubmit={handleRegistroInicial}
              className="space-y-4 text-left"
            >
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre Completo"
                  className={inputStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  type="password"
                  required
                  placeholder="Contraseña de Seguridad"
                  className={inputStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, contrasena: e.target.value })
                  }
                />
              </div>

              {/* ROL SELECTOR */}
              <div className="p-2 bg-slate-200 rounded-3xl grid grid-cols-2 gap-2 mt-8">
                {["RECICLADOR", "ENCARGADO"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, rol: r })}
                    className={`py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${formData.rol === r ? "bg-green-600 text-white shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {formData.rol === "ENCARGADO" && (
                <div className="relative animate-in slide-in-from-top-2">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500"
                    size={20}
                  />
                  <input
                    type="number"
                    required
                    placeholder="Código Punto de Popayán"
                    className="w-full pl-12 pr-4 py-5 bg-green-50 rounded-2xl font-black text-green-900 border-none outline-none ring-2 ring-green-100"
                    onChange={(e) =>
                      setFormData({ ...formData, puntoID: e.target.value })
                    }
                  />
                </div>
              )}

              <button
                disabled={cargando}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2.2rem] shadow-2xl transition-all active:scale-95 flex justify-center items-center gap-3 mt-8"
              >
                {cargando ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "REGISTRARME EN LA RED"
                )}
              </button>
            </form>
          ) : (
            /* PASO DEL PIN CORREGIDO Y ADAPTADO AL ESTILO ANCHO */
            <form
              onSubmit={handleVerificarCodigo}
              className="space-y-6 animate-in slide-in-from-right duration-500"
            >
              <input
                required
                type="text"
                maxLength="6"
                placeholder="0 0 0 0 0 0"
                className="w-full text-center text-5xl font-black tracking-[0.5em] py-8 bg-white border-4 border-green-50 rounded-[2.5rem] shadow-inner outline-none focus:border-green-600 text-green-600 transition-all"
                onChange={(e) => setCodigoPin(e.target.value)}
              />
              <button
                disabled={cargando}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-6 rounded-[2.2rem] shadow-2xl transition-all"
              >
                {cargando ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "ACTIVAR CUENTA AHORA"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registro;
