//import { useState, useEffect } from "react";
import axios from "axios";
import { UserCircle, Save, X, Loader2 } from "lucide-react";
import { useState } from "react";

const Perfil = ({ usuario, alActualizar, alCerrar }) => {
  // CLAVE 1: Inicializamos con '' nunca con undefined
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  // CLAVE 2: Asegurar que Axios use la IP 127.0.0.1
  const guardarCambios = async (e) => {
    e.preventDefault();
    if (!usuario?.id) return; // Seguridad: no actualizar si no hay ID

    setCargando(true);
    try {
      const payload = {
        nombre: nombre,
        contrasena: contrasena,
      };

      // Cambiamos a la IP estricta
      const idAUsar = Number(usuario.id); // Aseguramos que sea un número
      const res = await axios.put(
        `http://127.0.0.1:8080/api/identidad/actualizar/${idAUsar}`,
        payload,
      );

      console.log("Respuesta de Java:", res.data);

      if (res.data === true) {
        alert("¡Cambios guardados en la base de datos de Popayán!");
        alActualizar({ ...usuario, nombre });
        alCerrar();
      }
    } catch (err) {
      console.error("Fallo en la conexión:", err);
      alert("El servidor Java no respondió correctamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border-4 border-white transform transition-all scale-100">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-green-100 p-4 rounded-3xl">
            <UserCircle size={40} className="text-green-600" />
          </div>
          <button
            onClick={alCerrar}
            className="text-slate-300 hover:text-red-500 bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-black text-slate-800">Tu Identidad Eco</h2>
        <p className="text-slate-400 text-sm mb-8 font-medium">
          Actualiza tus datos para Popayán
        </p>

        <form onSubmit={guardarCambios} className="space-y-4 text-left">
          <div className="group">
            <label className="text-[10px] font-black text-green-600 uppercase ml-2 mb-1 block">
              Nombre en el sistema
            </label>
            <input
              type="text"
              value={nombre}
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-green-400 focus:bg-white p-4 rounded-2xl font-bold outline-none transition-all text-slate-800"
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="group">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">
              Ajustar contraseña
            </label>
            <input
              type="password"
              value={contrasena} // Mantenemos el control del input
              placeholder="••••••••"
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-green-400 focus:bg-white p-4 rounded-2xl outline-none transition-all text-slate-800"
              onChange={(e) => setContrasena(e.target.value)}
            />
            <p className="text-[10px] text-slate-300 mt-2 pl-2">
              * El cambio será inmediato en la base de datos
            </p>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 active:scale-95 mt-6"
          >
            {cargando ? (
              <Loader2 className="animate-spin" />
            ) : (
              "CONFIRMAR CAMBIOS"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
