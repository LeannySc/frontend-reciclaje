import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ShoppingBag, Package } from "lucide-react";
import { toast } from "sonner";

const Catalogo = ({ usuario, alRegresar, alCanjeExitoso }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/canje/catalogo")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar catálogo:", err));
  }, []);

  const realizarCanje = async (productoId, costo) => {
    // 1. Validación previa de saldo
    if (usuario.saldoPuntos < costo) {
      toast.error("Puntos Insuficientes", {
        description: `Necesitas ${costo} pts para obtener esta maravilla.`,
      });
      return;
    }

    const direccion = window.prompt(
      "¿A dónde enviamos tu recompensa? (Solo Popayán)",
    );
    if (!direccion) return;

    setCargando(true);
    try {
      // 2. Ejecución del canje (Singleton & Observer en Java)
      const res = await axios.post(
        `http://localhost:8080/api/canje/realizar?userId=${usuario.id}&productoId=${productoId}&direccion=${direccion}`,
      );

      toast.success("¡Canje Exitoso!", {
        description: `Has obtenido: ${res.data.producto.nombre}`,
      });

      // 3. Sincronización de Saldo (OBLIGATORIO: Usar await)
      const usuarioRes = await axios.get(
        `http://localhost:8080/api/identidad/${usuario.id}`,
      );
      alCanjeExitoso(usuarioRes.data);
    } catch (err) {
      // SOLUCIÓN AL ERROR DE TU IMAGEN: Usamos 'err' para que el Linter no marque error
      console.error("Fallo técnico en canje:", err);
      toast.error("Fallo en la reserva", {
        description: "El stock podría haberse agotado justo ahora.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={alRegresar}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all shadow-sm group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">
            Maravillas Disponibles
          </h2>
          <p className="text-green-600 font-bold text-sm tracking-widest mt-1">
            Popayán | Canje de Puntos Eco
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 text-left">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col h-full"
          >
            <div className="h-52 bg-slate-100 relative overflow-hidden">
              <img
                src={
                  p.imagenUrl ||
                  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=300"
                }
                alt={p.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-green-600 px-3 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-tighter shadow-lg">
                Disponible
              </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <h4 className="text-2xl font-black text-slate-800 leading-none mb-2 uppercase">
                {p.nombre}
              </h4>
              <p className="text-slate-400 text-xs font-bold mb-6 flex-grow uppercase tracking-tight">
                {p.descripcion}
              </p>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-green-600 leading-none">
                    {p.costoPuntos}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Pts Necesarios
                  </span>
                </div>
                <div className="bg-slate-50 px-3 py-2 rounded-xl flex items-center gap-2 text-slate-500 border border-slate-100">
                  <Package size={12} />
                  <span className="text-[10px] font-black uppercase">
                    Stock: {p.stock}
                  </span>
                </div>
              </div>

              <button
                onClick={() => realizarCanje(p.id, p.costoPuntos)}
                disabled={p.stock <= 0 || cargando}
                className={`w-full py-4 rounded-2xl font-black text-sm flex justify-center items-center gap-3 transition-all active:scale-95 ${
                  p.stock > 0 && !cargando
                    ? "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <ShoppingBag size={18} />
                {p.stock > 0
                  ? cargando
                    ? "RESERVANDO..."
                    : "CANJEAR AHORA"
                  : "AGOTADO"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
