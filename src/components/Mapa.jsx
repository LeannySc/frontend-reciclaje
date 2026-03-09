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

        {puntos.map((p) => (
          <Marker key={p.id} position={[2.4419, -76.6063]}>
            <Popup>
              <strong>{p.nombre}</strong> <br /> {p.direccion}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Mapa;
