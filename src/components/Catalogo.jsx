import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ArrowLeft, Star, Search, Package, X, ShoppingBag, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const CATEGORIAS = ["Todas", "Hogar", "Cocina", "Jardín", "Oficina", "Cuidado Personal"];

const Catalogo = ({ usuario, alRegresar, alCanjeExitoso }) => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [modalProducto, setModalProducto] = useState(null);
  const [canjeExitoso, setCanjeExitoso] = useState(false);
  const [cargando, setCargando] = useState(false);

  const puntosDisponibles = usuario?.saldoPuntos ||
    (usuario?.historialEntrega || []).filter(e => e.estado === "VALIDADA").reduce((a, e) => a + e.puntosOtorgados, 0);

  const cargarDatos = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/canje/catalogo");
      setProductos(res.data);
    } catch { console.error("Error cargando catálogo"); }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // HU-18: Solo mostrar productos activos al reciclador
  const productosFiltrados = productos.filter((p) => {
    const activo = p.activo !== false; // si no tiene campo activo, se muestra
    const matchBusqueda = p.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = categoria === "Todas" || p.categoria === categoria;
    return activo && matchBusqueda && matchCat;
  });

  const puedeCanjear = (costo) => puntosDisponibles >= costo;

  const realizarCanje = async () => {
    if (!modalProducto) return;
    if (!puedeCanjear(modalProducto.costoPuntos)) {
      toast.error("Saldo insuficiente", { description: "Recolecta más plástico para este premio." });
      return;
    }
    const direccion = window.prompt("¿A dónde enviamos tu premio?");
    if (!direccion) return;

    setCargando(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/canje/realizar?userId=${usuario.id}&productoId=${modalProducto.id}&direccion=${direccion}`
      );
      setCanjeExitoso(true);
      toast.success("¡Canje Exitoso!", { description: `Has obtenido: ${res.data.producto?.nombre}` });
      setTimeout(async () => {
        setCanjeExitoso(false);
        setModalProducto(null);
        const userRes = await axios.get(`http://localhost:8080/api/identidad/${usuario.id}`);
        alCanjeExitoso(userRes.data);
        cargarDatos();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Error en la reserva", { description: "Stock insuficiente o falla de red." });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">

      {/* HEADER */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={alRegresar} className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">Catálogo de Premios</h1>
            <p className="text-gray-500 text-sm mt-0.5">Canjea tus puntos por productos eco-amigables</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 self-start sm:self-auto">
          <Star className="w-5 h-5 text-green-600 fill-green-600" />
          <div>
            <span className="text-green-800 text-sm font-bold">{puntosDisponibles.toLocaleString()}</span>
            <span className="text-green-600 text-xs ml-1">puntos disponibles</span>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  categoria === cat ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-semibold">No hay productos disponibles</p>
          <p className="text-gray-300 text-sm mt-1">Prueba con otra búsqueda o categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {productosFiltrados.map((producto) => {
            const puede = puedeCanjear(producto.costoPuntos);
            return (
              <div
                key={producto.id}
                onClick={() => setModalProducto(producto)}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all ${
                  !puede ? "opacity-70 border-gray-100" : "border-gray-100 hover:border-green-200"
                }`}
              >
                <div className="h-40 sm:h-48 bg-gray-50 overflow-hidden relative">
                  <img
                    src={producto.imagenUrl || "https://via.placeholder.com/300x300/f0fdf4/16a34a?text=Eco"}
                    alt={producto.nombre}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {producto.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">AGOTADO</span>
                    </div>
                  )}
                  {!puede && producto.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Puntos insuf.
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h4 className="text-gray-900 font-semibold text-sm truncate">{producto.nombre}</h4>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{producto.descripcion}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                      <span className="text-green-700 font-bold text-sm">{producto.costoPuntos}</span>
                      <span className="text-green-500 text-xs">pts</span>
                    </div>
                    <span className="text-gray-300 text-xs">Stock: {producto.stock}</span>
                  </div>
                  <button
                    className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                      puede && producto.stock > 0
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {producto.stock <= 0 ? "Agotado" : puede ? "Canjear" : "Sin puntos"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE DETALLE/CANJE */}
      {modalProducto && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => { if (!cargando) setModalProducto(null); }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-52 bg-gray-100 relative">
              <img
                src={modalProducto.imagenUrl || "https://via.placeholder.com/400x300/f0fdf4/16a34a?text=Eco"}
                alt={modalProducto.nombre}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setModalProducto(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <div className="p-6">
              {canjeExitoso ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">¡Canje Exitoso!</h3>
                  <p className="text-gray-500 text-sm mt-1">Tu premio está en camino</p>
                </div>
              ) : (
                <>
                  <h3 className="text-gray-900 text-xl font-bold">{modalProducto.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{modalProducto.descripcion}</p>

                  <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-green-600 fill-green-600" />
                      <span className="text-green-700 font-bold text-lg">{modalProducto.costoPuntos} pts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500 text-sm">Stock: {modalProducto.stock}</span>
                    </div>
                  </div>

                  {!puedeCanjear(modalProducto.costoPuntos) && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-amber-700 text-xs font-semibold">
                        Te faltan {modalProducto.costoPuntos - puntosDisponibles} puntos para este premio.
                        ¡Sigue reciclando!
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setModalProducto(null)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={realizarCanje}
                      disabled={!puedeCanjear(modalProducto.costoPuntos) || modalProducto.stock <= 0 || cargando}
                      className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {cargando ? "Procesando..." : "Confirmar Canje"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
