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
      // 1. Ejecutamos el canje en LOCAL
      const res = await axios.post(
        `http://localhost:8080/api/canje/realizar?userId=${usuario.id}&productoId=${productoId}&direccion=${direccion}`,
      );

      // 2. AHORA SÍ el Toast tiene los datos (res.data)
      toast.success("¡Canje Exitoso!", {
        description: `Has obtenido: ${res.data.producto.nombre}`,
      });

      // 3. Sincronizamos localmente
      const userRes = await axios.get(
        `http://localhost:8080/api/identidad/${usuario.id}`,
      );
      alCanjeExitoso(userRes.data);
      cargarDatos();
    } catch (err) {
      // Usamos el log para que el Linter de VS Code no de error de variable no usada
      console.error("Detalle técnico del canje:", err);
      toast.error("Error en la reserva", {
        description: "Stock insuficiente o falla de red.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    // ... tu JSX del catálogo se mantiene igual ...
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Botón Volver y Header */}
      <div className="flex items-center gap-6 mb-12 text-left text-slate-900">
        <button
          onClick={alRegresar}
          className="p-4 bg-white hover:bg-slate-900 hover:text-white rounded-2xl shadow-sm border border-slate-100 transition-all"
        >
          <ArrowLeft />
        </button>
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-slate-800">
            Canjear Maravillas
          </h2>
          <p className="text-green-600 font-bold text-sm tracking-widest mt-1 uppercase">
            Puntos disponibles para Popayán
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-[3rem] shadow-xl border border-slate-50 flex flex-col group transition-all hover:scale-105 overflow-hidden"
          >
            <div className="h-56 bg-slate-50 relative overflow-hidden">
              <img
                src={p.imagenUrl || "https://via.placeholder.com/300"}
                alt={p.nombre}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="p-8 text-left flex flex-col flex-grow">
              <h4 className="text-2xl font-black text-slate-800 uppercase italic mb-3">
                {p.nombre}
              </h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-8 flex-grow leading-relaxed">
                {p.descripcion}
              </p>
              <div className="flex justify-between items-center mb-8 border-t pt-4">
                <div>
                  <span className="text-3xl font-black text-slate-800">
                    {p.costoPuntos}
                  </span>
                  <span className="text-[10px] font-black text-green-600 uppercase ml-1">
                    Pts
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Package size={14} />
                  <span className="text-[10px] font-black">
                    Stock: {p.stock}
                  </span>
                </div>
              </div>
              <button
                onClick={() => realizarCanje(p.id, p.costoPuntos)}
                disabled={p.stock <= 0 || cargando}
                className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase flex justify-center items-center gap-3 transition-all ${p.stock > 0 ? "bg-slate-900 text-white hover:bg-black" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}
              >
                <ShoppingBag size={18} />
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
