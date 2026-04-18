import { useEffect, useRef } from "react";
import axios from "axios";

const Mapa = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Importamos Leaflet dinámicamente
    import("leaflet").then((L) => {
      // Fix icons para bundlers
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current).setView([2.4419, -76.6063], 14);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Iconos personalizados estilo Figma (HU-10)
      const crearIcono = (color) => L.divIcon({
        className: "",
        html: `<div style="
          background:${color};
          width:26px;height:26px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 2px 10px rgba(0,0,0,0.25)
        "></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -30],
      });

      const iconoVerde = crearIcono("#16a34a");
      const iconoAmbar = crearIcono("#f59e0b");
      const iconoRojo = crearIcono("#ef4444");

      // Cargar puntos del backend
      axios.get("http://localhost:8080/api/puntos/todos")
        .then((res) => {
          res.data.forEach((punto) => {
            if (!punto.latitud || !punto.longitud) return;

            const nivel = punto.nivelLlenado || 0;
            const activo = punto.activo !== false;

            // Color según estado (HU-10: verde/rojo)
            const icono = !activo || nivel >= 80 ? iconoRojo : nivel >= 50 ? iconoAmbar : iconoVerde;
            const colorNivel = nivel >= 80 ? "#ef4444" : nivel >= 50 ? "#f59e0b" : "#16a34a";
            const estadoLabel = !activo ? "🔴 Inactivo" : nivel >= 80 ? "🔴 Lleno" : nivel >= 50 ? "🟡 Medio" : "🟢 Disponible";

            // Popup rico (HU-12: nombre, dirección, plásticos, horario, nivel)
            const tiposPlastico = (punto.tiposPlastico || ["Botellas PET", "Tapas"]).slice(0, 3).join(", ");
            const horario = punto.horario || "Lun-Sáb 8am-6pm";

            const popupHtml = `
              <div style="font-family:system-ui,sans-serif;min-width:230px;padding:4px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                  <div style="width:10px;height:10px;border-radius:50%;background:${colorNivel};flex-shrink:0"></div>
                  <strong style="font-size:13px;color:#111827">${punto.nombre}</strong>
                </div>

                <p style="font-size:11px;color:#6b7280;margin:0 0 10px;display:flex;align-items:center;gap:4px">
                  📍 ${punto.direccion}
                </p>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
                  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:6px">
                    <p style="font-size:9px;color:#9ca3af;text-transform:uppercase;margin:0 0 2px;font-weight:600">Horario</p>
                    <p style="font-size:11px;color:#374151;margin:0;font-weight:500">🕒 ${horario}</p>
                  </div>
                  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:6px">
                    <p style="font-size:9px;color:#9ca3af;text-transform:uppercase;margin:0 0 2px;font-weight:600">Estado</p>
                    <p style="font-size:11px;color:#374151;margin:0;font-weight:600">${estadoLabel}</p>
                  </div>
                </div>

                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:6px;margin-bottom:10px">
                  <p style="font-size:9px;color:#16a34a;text-transform:uppercase;margin:0 0 2px;font-weight:700">Plásticos aceptados</p>
                  <p style="font-size:11px;color:#374151;margin:0">♻️ ${tiposPlastico}</p>
                </div>

                <div style="margin-bottom:6px">
                  <div style="display:flex;justify-content:space-between;font-size:10px;color:#6b7280;margin-bottom:4px">
                    <span style="font-weight:600">Nivel de llenado</span>
                    <span style="color:${colorNivel};font-weight:800">${nivel}%</span>
                  </div>
                  <div style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden">
                    <div style="height:100%;width:${nivel}%;background:${colorNivel};border-radius:4px;transition:width 0.5s"></div>
                  </div>
                </div>

                ${punto.encargado ? `<p style="font-size:10px;color:#9ca3af;margin:6px 0 0">👤 Encargado: ${punto.encargado}</p>` : ""}
              </div>`;

            L.marker([punto.latitud, punto.longitud], { icon: icono })
              .addTo(map)
              .bindPopup(popupHtml, { maxWidth: 280, className: "leaflet-popup-clean" });
          });
        })
        .catch((err) => console.error("Error cargando puntos:", err));
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
          border: 1px solid #e5e7eb;
        }
        .leaflet-popup-tip { background: white !important; }
        .leaflet-control-attribution { font-size: 8px !important; }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
};

export default Mapa;
