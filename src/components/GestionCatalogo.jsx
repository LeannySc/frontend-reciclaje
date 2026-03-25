import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Plus,
  Edit3,
  Save,
  X,
  Package,
  Loader2,
  ImagePlus,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

const GestionCatalogo = ({ alRegresar }) => {
  const [productos, setProductos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [datos, setDatos] = useState({
    nombre: "",
    descripcion: "",
    costoPuntos: 0,
    stock: 0,
    imagenUrl: "",
    activo: true,
  });

  const cargarProductos = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/canje/catalogo");
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (editandoId) {
        await axios.put(
          `http://localhost:8080/api/admin/productos/${editandoId}`,
          datos,
        );
        toast.success("Producto Actualizado");
      } else {
        await axios.post("http://localhost:8080/api/admin/productos", datos);
        toast.success("Publicado con éxito");
      }
      setMostrarForm(false);
      setEditandoId(null);
      setDatos({
        nombre: "",
        descripcion: "",
        costoPuntos: 0,
        stock: 0,
        imagenUrl: "",
        activo: true,
      });
      cargarProductos();
    } catch (err) {
      console.error("Fallo técnico en la persistencia:", err); // <-- Aquí usamos la variable 'err'
      toast.error("Error al procesar", {
        description: "Revisa la consola del servidor.",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center mb-10 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={alRegresar}
            className="p-3 bg-white border rounded-2xl hover:bg-slate-50"
          >
            <ChevronLeft />
          </button>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Control Almacén
          </h2>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className={`px-6 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 ${mostrarForm ? "bg-red-500" : "bg-green-600"} text-white`}
        >
          {mostrarForm ? <X /> : <Plus />} {mostrarForm ? "Cerrar" : "Nuevo"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleGuardar}
          className="mx-4 mb-10 p-8 bg-white rounded-[3rem] border shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
        >
          <div className="space-y-4">
            <div className="h-56 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
              {datos.imagenUrl ? (
                <img
                  src={datos.imagenUrl}
                  className="w-full h-full object-cover"
                  alt="prev"
                />
              ) : (
                <ImagePlus size={48} className="text-slate-300" />
              )}
            </div>
            <input
              placeholder="URL de la imagen"
              className="w-full p-4 rounded-xl bg-slate-100 outline-none"
              value={datos.imagenUrl}
              onChange={(e) =>
                setDatos({ ...datos, imagenUrl: e.target.value })
              }
            />
          </div>
          <div className="space-y-4">
            <input
              placeholder="Nombre"
              className="w-full p-4 rounded-xl bg-slate-100 font-bold"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
            />
            <textarea
              placeholder="Descripción"
              rows="3"
              className="w-full p-4 rounded-xl bg-slate-100"
              value={datos.descripcion}
              onChange={(e) =>
                setDatos({ ...datos, descripcion: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Puntos"
                className="w-full p-4 rounded-xl bg-green-50 text-green-700 font-bold"
                value={datos.costoPuntos}
                onChange={(e) =>
                  setDatos({ ...datos, costoPuntos: parseInt(e.target.value) })
                }
              />
              <input
                type="number"
                placeholder="Stock"
                className="w-full p-4 rounded-xl bg-blue-50 text-blue-700 font-bold"
                value={datos.stock}
                onChange={(e) =>
                  setDatos({ ...datos, stock: parseInt(e.target.value) })
                }
              />
            </div>
            <button
              disabled={cargando}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase"
            >
              {cargando ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : editandoId ? (
                "Guardar Cambios"
              ) : (
                "Publicar Ahora"
              )}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white p-6 rounded-[2.5rem] border flex items-center justify-between group shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-6 text-left">
              <img
                src={p.imagenUrl || "https://via.placeholder.com/150"}
                className="w-20 h-20 rounded-[1.8rem] object-cover"
                alt=""
              />
              <div>
                <h4 className="font-black uppercase text-sm">{p.nombre}</h4>
                <p className="text-green-600 font-bold text-[10px] uppercase">
                  {p.costoPuntos} Puntos • {p.stock} Libres
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditandoId(p.id);
                setDatos(p);
                setMostrarForm(true);
              }}
              className="p-4 bg-slate-100 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <Edit3 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionCatalogo;
