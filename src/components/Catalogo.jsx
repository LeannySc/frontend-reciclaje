import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, ShoppingBag, Package } from "lucide-react";
import { toast } from "sonner";

const Catalogo = ({ usuario, alRegresar, alCanjeExitoso }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/canje/catalogo");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al cargar catálogo:", error);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const realizarCanje = async (productoId, costo) => {
    if (usuario.saldoPuntos < costo) {
      toast.error("Saldo Insuficiente", {
        description: "Recolecta más plástico para este premio.",
      });
      return;
    }

    const direccion = window.prompt("¿A dónde enviamos tu premio?");
    if (!direccion) return;

    setCargando(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/canje/realizar?userId=${usuario.id}&productoId=${productoId}&direccion=${direccion}`
      );

      toast.success("¡Canje Exitoso!", {
        description: `Has obtenido: ${res.data.producto.nombre}`,
      });

      const userRes = await axios.get(
        `http://localhost:8080/api/identidad/${usuario.id}`
      );
      alCanjeExitoso(userRes.data);
      cargarDatos();
    } catch (err) {
      console.error("Detalle técnico del canje:", err);
      toast.error("Error en la reserva", {
        description: "Stock insuficiente o falla de red.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12 text-left text-slate-900">
        <button
          onClick={alRegresar}
          className="p-3 sm:p-4 bg-white hover:bg-slate-900 hover:text-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 transition-all flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none text-slate-800">
            Canjear Maravillas
          </h2>
          <p className="text-green-600 font-bold text-xs sm:text-sm tracking-widest mt-1 uppercase">
            Puntos disponibles · Popayán
          </p>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-slate-50 flex flex-col group transition-all hover:scale-[1.02] overflow-hidden"
          >
            {/* Imagen */}
            <div className="h-44 sm:h-56 bg-slate-50 relative overflow-hidden">
              <img
                src={p.imagenUrl || "https://via.placeholder.com/300"}
                alt={p.nombre}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>

            {/* Info */}
            <div className="p-5 sm:p-8 text-left flex flex-col flex-grow">
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 uppercase italic mb-2 sm:mb-3">
                {p.nombre}
              </h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-5 sm:mb-8 flex-grow leading-relaxed">
                {p.descripcion}
              </p>

              <div className="flex justify-between items-center mb-5 sm:mb-8 border-t pt-4">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">
                    {p.costoPuntos}
                  </span>
                  <span className="text-[10px] font-black text-green-600 uppercase ml-1">
                    Pts
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Package size={13} />
                  <span className="text-[10px] font-black">Stock: {p.stock}</span>
                </div>
              </div>

              <button
                onClick={() => realizarCanje(p.id, p.costoPuntos)}
                disabled={p.stock <= 0 || cargando}
                className={`w-full py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-black text-xs uppercase flex justify-center items-center gap-2 sm:gap-3 transition-all ${
                  p.stock > 0
                    ? "bg-slate-900 text-white hover:bg-black active:scale-95"
                    : "bg-slate-50 text-slate-300 cursor-not-allowed"
                }`}
              >
                <ShoppingBag size={16} />
                {p.stock > 0
                  ? cargando
                    ? "PROCESANDO..."
                    : "LO QUIERO"
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
