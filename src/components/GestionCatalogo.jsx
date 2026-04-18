import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Plus,
  Edit3,
  X,
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
        await axios.put(`http://localhost:8080/api/admin/productos/${editandoId}`, datos);
        toast.success("Producto Actualizado");
      } else {
        await axios.post("http://localhost:8080/api/admin/productos", datos);
        toast.success("Publicado con éxito");
      }
      setMostrarForm(false);
      setEditandoId(null);
      setDatos({ nombre: "", descripcion: "", costoPuntos: 0, stock: 0, imagenUrl: "", activo: true });
      cargarProductos();
    } catch (err) {
      console.error("Fallo técnico:", err);
      toast.error("Error al procesar", { description: "Revisa la consola del servidor." });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 sm:mb-10 px-0 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={alRegresar}
            className="p-2.5 sm:p-3 bg-white border rounded-xl sm:rounded-2xl hover:bg-slate-50 shadow-sm flex-shrink-0"
          >
            <ChevronLeft size={22} />
          </button>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
            Control Almacén
          </h2>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs uppercase flex items-center gap-2 transition-all ${
            mostrarForm ? "bg-red-500" : "bg-green-600"
          } text-white shadow-lg active:scale-95`}
        >
          {mostrarForm ? <X size={16} /> : <Plus size={16} />}
          <span className="hidden sm:inline">{mostrarForm ? "Cerrar" : "Nuevo"}</span>
        </button>
      </div>

      {/* FORMULARIO */}
      {mostrarForm && (
        <form
          onSubmit={handleGuardar}
          className="mx-0 sm:mx-4 mb-6 sm:mb-10 p-5 sm:p-8 bg-white rounded-[2rem] sm:rounded-[3rem] border shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 text-left"
        >
          {/* Columna imagen */}
          <div className="space-y-3 sm:space-y-4">
            <div className="h-44 sm:h-56 bg-slate-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
              {datos.imagenUrl ? (
                <img src={datos.imagenUrl} className="w-full h-full object-cover" alt="prev" />
              ) : (
                <ImagePlus size={40} className="text-slate-300" />
              )}
            </div>
            <input
              placeholder="URL de la imagen"
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-100 outline-none text-sm"
              value={datos.imagenUrl}
              onChange={(e) => setDatos({ ...datos, imagenUrl: e.target.value })}
            />
          </div>

          {/* Columna datos */}
          <div className="space-y-3 sm:space-y-4">
            <input
              placeholder="Nombre del producto"
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-100 font-bold text-sm outline-none"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              required
            />
            <textarea
              placeholder="Descripción"
              rows="3"
              className="w-full p-3 sm:p-4 rounded-xl bg-slate-100 text-sm outline-none resize-none"
              value={datos.descripcion}
              onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-[9px] font-black uppercase text-green-700 ml-1 mb-1 block">Puntos</label>
                <input
                  type="number"
                  className="w-full p-3 sm:p-4 rounded-xl bg-green-50 text-green-700 font-bold text-sm outline-none"
                  value={datos.costoPuntos}
                  onChange={(e) => setDatos({ ...datos, costoPuntos: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-blue-700 ml-1 mb-1 block">Stock</label>
                <input
                  type="number"
                  className="w-full p-3 sm:p-4 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm outline-none"
                  value={datos.stock}
                  onChange={(e) => setDatos({ ...datos, stock: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <button
              disabled={cargando}
              className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black uppercase text-sm active:scale-95 transition-all"
            >
              {cargando ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : editandoId ? "Guardar Cambios" : "Publicar Ahora"}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-0 sm:px-4">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 sm:p-6 rounded-[1.8rem] sm:rounded-[2.5rem] border flex items-center justify-between group shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4 sm:gap-6 text-left overflow-hidden">
              <img
                src={p.imagenUrl || "https://via.placeholder.com/150"}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-[1.2rem] sm:rounded-[1.8rem] object-cover flex-shrink-0"
                alt=""
              />
              <div className="overflow-hidden">
                <h4 className="font-black uppercase text-xs sm:text-sm truncate">{p.nombre}</h4>
                <p className="text-green-600 font-bold text-[10px] uppercase mt-0.5">
                  {p.costoPuntos} Pts · {p.stock} Libres
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditandoId(p.id);
                setDatos(p);
                setMostrarForm(true);
              }}
              className="p-3 sm:p-4 bg-slate-100 text-blue-600 rounded-xl sm:rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex-shrink-0 ml-2"
            >
              <Edit3 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionCatalogo;
