import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../fix-leaflet"; // Traemos el arreglo de iconos
import { useEffect, useState } from "react";
import axios from "axios";

const Mapa = () => {
  const [puntos, setPuntos] = useState([]);

  useEffect(() => {
    // Conectamos con el endpoint de Java que creamos
    axios
      .get("http://127.0.0.1:8080/api/puntos/todos")
      .then((res) => setPuntos(res.data))
      .catch((err) => console.error("Error trayendo puntos:", err));
  }, []);

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "15px",
        border: "2px solid #2ecc71",
      }}
    >
      <MapContainer
        center={[2.4419, -76.6063]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        // En el mapeo de los puntos dentro del return:
        {puntos.map(
          (p) =>
            // Solo mostramos el marcador si tiene coordenadas
            p.latitud &&
            p.longitud && (
              <Marker key={p.id} position={[p.latitud, p.longitud]}>
                <Popup>
                  <div className="p-2">
                    <strong className="text-green-700">{p.nombre}</strong>{" "}
                    <br />
                    <span className="text-gray-500 text-sm">{p.direccion}</span>
                  </div>
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  );
};

export default Mapa;
