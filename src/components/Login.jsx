import { useState } from "react";
import axios from "axios";
import { LogIn, Mail, Lock, Loader2, ArrowRight, TreeDeciduous, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Login = ({ alLoguear, irARegistro }) => {
  const [datos, setDatos] = useState({ correo: "", contrasena: "" });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const res = await axios.post("http://localhost:8080/api/identidad/login", datos);
      toast.success(`Sincronización exitosa`, {
        description: `Bienvenido de nuevo, ${res.data.nombre}`
      });
      alLoguear(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error de identidad", {
        description: "Las credenciales no coinciden con nuestros registros."
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-slate-50 overflow-hidden text-left">
      
      {/* --- LADO IZQUIERDO: SECCIÓN HERO/BRANDING --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-600 p-16 flex-col justify-between relative overflow-hidden">
        {/* Elementos abstractos de fondo */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-emerald-900/20 rounded-full blur-2xl"></div>

        {/* Logo superior */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-2xl shadow-xl shadow-green-700/20 text-green-600">
            <TreeDeciduous size={28} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter uppercase italic">PlastiUsos</span>
        </div>

        {/* Texto Central Impactante */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[2px] w-12 bg-emerald-300"></div>
            <span className="text-emerald-200 text-xs font-black uppercase tracking-[0.3em]">Economía Circular Popayán</span>
          </div>
          <h1 className="text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 uppercase italic">
            TRANSFORMA <br /> EL <span className="text-emerald-300">MAÑANA</span>
          </h1>
          <p className="text-green-50 text-xl font-medium max-w-md leading-relaxed opacity-90">
            Únete a la plataforma industrial líder en recuperación de polímeros. Gestiona tus puntos y canjea maravillas.
          </p>
        </div>

        {/* Footer del Hero */}
        <div className="relative z-10 flex justify-between items-center text-white/50">
          <span className="text-[10px] font-black uppercase tracking-widest italic">Core Engine v2.0</span>
          <div className="flex gap-4">
             <div className="w-2 h-2 rounded-full bg-white opacity-20"></div>
             <div className="w-2 h-2 rounded-full bg-white opacity-20"></div>
             <div className="w-8 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#6ee7b7]"></div>
          </div>
        </div>
      </div>

      {/* --- LADO DERECHO: ÁREA DE ACCESO --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-10 duration-1000">
          
          <div className="mb-12">
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Iniciar Sesión</h2>
             <p className="text-slate-400 mt-3 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-500" />
                Accede a tu identidad eco-circular
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest group-focus-within:text-green-600 transition-colors">Identificación de Correo</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors" size={20} />
                <input
                  type="email" required placeholder="ejemplo@plastiusos.com"
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl text-slate-900 font-semibold focus:border-green-500 focus:bg-white outline-none transition-all shadow-sm shadow-slate-200/50"
                  onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
                />
              </div>
            </div>

            <div className="group border-b border-slate-100 pb-8">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest group-focus-within:text-green-600 transition-colors">Clave de Seguridad</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors" size={20} />
                <input
                  type="password" required placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl text-slate-900 font-semibold focus:border-green-500 focus:bg-white outline-none transition-all shadow-sm shadow-slate-200/50"
                  onChange={(e) => setDatos({ ...datos, contrasena: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] shadow-2xl transition-all flex justify-center items-center gap-3 active:scale-[0.97] group overflow-hidden relative"
            >
              {cargando ? <Loader2 className="animate-spin" /> : (
                <>
                  <span className="z-10 tracking-widest">ACTIVAR ENTRADA</span>
                  <ArrowRight size={20} className="z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-green-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20"></div>
                </>
              )}
            </button>

            <div className="pt-8 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">¿No eres parte de la transformación?</p>
                <button
                    type="button"
                    onClick={irARegistro}
                    className="mt-2 text-green-600 font-black text-sm hover:text-emerald-700 underline-offset-4 hover:underline decoration-2 transition-all uppercase"
                >
                    Registrarme como Reciclador aquí
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;