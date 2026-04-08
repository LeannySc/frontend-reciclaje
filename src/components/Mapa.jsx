import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../fix-leaflet";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import L from "leaflet";

// Componente para actualizar el centro del mapa dinámicamente
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

const Mapa = ({ centroPropuesto, zoomPropuesto = 14, mostrarInfo = true }) => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Centro por defecto: Popayán, Colombia
  const defaultCenter = useMemo(() => centroPropuesto || [2.4419, -76.6063], [centroPropuesto]);
  const defaultZoom = zoomPropuesto;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    axios
      .get("http://127.0.0.1:8080/api/puntos/todos")
      .then((res) => {
        if (isMounted) {
          setPuntos(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error trayendo puntos:", err);
        if (isMounted) {
          setError("No se pudieron cargar los puntos");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Icono personalizado para los marcadores
  const createCustomIcon = (nivelLlenado) => {
    let color = "#22c55e"; // verde - normal
    if (nivelLlenado >= 80) color = "#ef4444"; // rojo - lleno
    else if (nivelLlenado >= 50) color = "#f59e0b"; // amarillo - medio

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        ">
          🗑️
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 z-[1000] bg-slate-100/90 backdrop-blur-sm flex items-center justify-center rounded-[1.5rem]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cargando mapa...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="absolute inset-0 z-[1000] bg-red-50/95 backdrop-blur-sm flex items-center justify-center rounded-[1.5rem] p-6">
          <div className="text-center max-w-xs">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm font-bold text-red-600 uppercase tracking-wider">{error}</p>
            <p className="text-xs text-slate-400 mt-2">Verifica tu conexión o el servidor backend</p>
          </div>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="rounded-[1.5rem] overflow-hidden"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Controles de zoom personalizados */}
        <div className="leaflet-bottom leaflet-right z-[1000]" style={{ position: "absolute", bottom: "20px", right: "20px" }}>
          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Zoom in handled by map instance
              }}
              className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-700 hover:bg-green-50 hover:text-green-600 transition-all font-bold text-xl border border-slate-100"
              style={{ fontSize: "20px" }}
            >
              +
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Zoom out handled by map instance
              }}
              className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-xl border border-slate-100"
              style={{ fontSize: "20px" }}
            >
              −
            </button>
          </div>
        </div>

        <MapUpdater center={defaultCenter} zoom={defaultZoom} />

        {puntos.map((p) => {
          if (!p.latitud || !p.longitud) return null;
          
          return (
            <Marker 
              key={p.id} 
              position={[p.latitud, p.longitud]}
              icon={createCustomIcon(p.nivelLlenado || 0)}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-2xl`}>{(p.nivelLlenado || 0) >= 80 ? "🔴" : (p.nivelLlenado || 0) >= 50 ? "🟡" : "🟢"}</span>
                    <strong className="text-green-700 text-sm">{p.nombre}</strong>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <span>📍</span>
                      <span>{p.direccion || "Ubicación no disponible"}</span>
                    </div>
                    {(p.nivelLlenado !== undefined) && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">Llenado:</span>
                          <span className="font-bold">{p.nivelLlenado}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              p.nivelLlenado >= 80 ? "bg-red-500" : p.nivelLlenado >= 50 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${p.nivelLlenado}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {mostrarInfo && puntos.length > 0 && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hidden sm:block">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">Medio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">Lleno</span>
            </div>
          </div>
        </div>
      )}

      {mostrarInfo && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] sm:hidden">
          <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100">
            <p className="text-[10px] font-bold text-slate-600 text-center">
              {loading ? "Cargando..." : error ? "Error de conexión" : `${puntos.length} estaciones disponibles`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mapa;
