import { useEffect, useRef, useState } from "react";
import {
  Leaf, ArrowRight, MapPin, Star, Recycle, Gift,
  Users, TreePine, ShieldCheck, Zap, ChevronRight,
  Menu, X, BarChart3,
} from "lucide-react";

// Puntos mock para mostrar en la landing (se reemplazarán con datos reales del backend)
const PUNTOS_MOCK = [
  { id: 1, nombre: "EcoPoint Centro Histórico", direccion: "Calle 5 #4-36, Centro", latitud: 2.4419, longitud: -76.6073, nivelLlenado: 65, activo: true, horario: "Lun-Sáb 8am-6pm", tiposPlastico: ["Botellas PET", "Tapas", "HDPE"] },
  { id: 2, nombre: "ReciclaVerde Bolívar", direccion: "Cra 7 #15-20, Bolívar", latitud: 2.4560, longitud: -76.6012, nivelLlenado: 30, activo: true, horario: "Lun-Dom 7am-8pm", tiposPlastico: ["Botellas PET", "Bolsas", "Film"] },
  { id: 3, nombre: "PuntoEco La Esmeralda", direccion: "Av. Circunvalar #40-12", latitud: 2.4270, longitud: -76.5983, nivelLlenado: 85, activo: true, horario: "Mar-Dom 9am-5pm", tiposPlastico: ["PET", "Vidrio", "Latas"] },
  { id: 4, nombre: "GreenHub Alfonso López", direccion: "Calle 18 #10-50, Alfonso López", latitud: 2.4421, longitud: -76.6180, nivelLlenado: 0, activo: false, horario: "Lun-Vie 8am-4pm", tiposPlastico: ["HDPE", "Poliestireno"] },
  { id: 5, nombre: "EcoStation Las Américas", direccion: "Carrera 9 #28-15, Las Américas", latitud: 2.4330, longitud: -76.6095, nivelLlenado: 45, activo: true, horario: "Lun-Sáb 8am-5pm", tiposPlastico: ["PET", "Cartón", "Papel"] },
  { id: 6, nombre: "ReciclaPunto Tulcán", direccion: "Calle 25 #6-80, Tulcán", latitud: 2.4490, longitud: -76.5950, nivelLlenado: 20, activo: true, horario: "Mar-Dom 8am-6pm", tiposPlastico: ["PET", "Cartón", "Papel", "Electrónicos"] },
];

const STATS = [
  { label: "Recicladores Activos", value: "1,847", icon: Users },
  { label: "Kg Reciclados", value: "45.2t", icon: Recycle },
  { label: "Transacciones", value: "8,920", icon: BarChart3 },
  { label: "CO₂ Evitado (kg)", value: "90,460", icon: TreePine },
];

const PASOS = [
  { paso: "01", icon: Recycle, title: "Recolecta y Separa", desc: "Separa tus residuos reciclables en casa: plástico, vidrio, cartón, metal y electrónicos.", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { paso: "02", icon: MapPin, title: "Encuentra un Punto", desc: "Ubica el punto de recolección más cercano en Popayán y lleva tus materiales.", color: "bg-green-50 text-green-600 border-green-200" },
  { paso: "03", icon: Star, title: "Gana Puntos", desc: "Pesa tus materiales y acumula puntos según el tipo y cantidad entregada.", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { paso: "04", icon: Gift, title: "Canjea Premios", desc: "Usa tus puntos para obtener productos eco-amigables del catálogo.", color: "bg-purple-50 text-purple-600 border-purple-200" },
];

const MATERIALES = [
  { icono: "🧴", nombre: "Plástico PET", pts: 15, color: "bg-blue-100 text-blue-700" },
  { icono: "📦", nombre: "Cartón", pts: 10, color: "bg-amber-100 text-amber-700" },
  { icono: "🫙", nombre: "Vidrio", pts: 8, color: "bg-green-100 text-green-700" },
  { icono: "🥫", nombre: "Metal / Lata", pts: 20, color: "bg-gray-100 text-gray-700" },
  { icono: "📄", nombre: "Papel", pts: 5, color: "bg-yellow-100 text-yellow-700" },
  { icono: "💻", nombre: "Electrónicos", pts: 50, color: "bg-purple-100 text-purple-700" },
];

const BENEFICIOS = [
  { icon: TreePine, title: "Impacto Ambiental Real", desc: "Cada kg reciclado reduce hasta 2kg de CO₂ en la atmósfera de Popayán." },
  { icon: ShieldCheck, title: "Sistema Verificado", desc: "Transacciones validadas por encargados certificados en cada punto." },
  { icon: Zap, title: "Puntos Instantáneos", desc: "Acumulas puntos en tiempo real al aprobar cada entrega." },
  { icon: Users, title: "Comunidad Verde", desc: "Únete a miles de recicladores comprometidos con el planeta." },
];

// Mapa interactivo con Leaflet vanilla
function MapaLanding() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Importamos Leaflet dinámicamente para evitar SSR
    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([2.4419, -76.6063], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Icono personalizado tipo gota
      const crearIcono = (color, pulsar = false) => L.divIcon({
        className: "",
        html: `
          <div style="position:relative">
            ${pulsar ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${color};opacity:0.25;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite"></div>` : ""}
            <div style="
              width:32px;height:32px;border-radius:50% 50% 50% 0;
              background:${color};transform:rotate(-45deg);
              border:3px solid white;
              box-shadow:0 3px 14px rgba(0,0,0,0.3)
            "></div>
          </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      const iconoVerde = crearIcono("#16a34a");
      const iconoAmbar = crearIcono("#f59e0b");
      const iconoRojo = crearIcono("#ef4444", true);

      // Intentar cargar del backend, fallback a mock
      const cargarPuntos = (puntos) => {
        puntos.forEach((p) => {
          if (!p.latitud || !p.longitud) return;
          const nivel = p.nivelLlenado || 0;
          const activo = p.activo !== false;
          const colorNivel = nivel >= 80 ? "#ef4444" : nivel >= 50 ? "#f59e0b" : "#16a34a";
          const icono = !activo || nivel >= 80 ? iconoRojo : nivel >= 50 ? iconoAmbar : iconoVerde;
          const estado = !activo ? "🔴 Inactivo" : nivel >= 80 ? "🔴 Lleno" : nivel >= 50 ? "🟡 Medio" : "🟢 Disponible";

          const popup = `
            <div style="font-family:system-ui,sans-serif;min-width:220px;padding:4px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <div style="width:10px;height:10px;border-radius:50%;background:${colorNivel};flex-shrink:0"></div>
                <strong style="font-size:13px;color:#111827">${p.nombre}</strong>
              </div>
              <p style="font-size:11px;color:#6b7280;margin:0 0 8px">📍 ${p.direccion}</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:5px">
                  <p style="font-size:9px;color:#9ca3af;margin:0 0 2px;font-weight:700;text-transform:uppercase">Horario</p>
                  <p style="font-size:11px;color:#374151;margin:0">🕒 ${p.horario || "Lun-Sáb 8am-6pm"}</p>
                </div>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:5px">
                  <p style="font-size:9px;color:#9ca3af;margin:0 0 2px;font-weight:700;text-transform:uppercase">Estado</p>
                  <p style="font-size:11px;font-weight:700;color:#374151;margin:0">${estado}</p>
                </div>
              </div>
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:6px;margin-bottom:8px">
                <p style="font-size:9px;color:#16a34a;margin:0 0 2px;font-weight:700;text-transform:uppercase">♻️ Acepta</p>
                <p style="font-size:11px;color:#374151;margin:0">${(p.tiposPlastico || []).slice(0,3).join(", ")}</p>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;font-size:10px;color:#6b7280;margin-bottom:3px">
                  <span style="font-weight:600">Nivel de llenado</span>
                  <span style="color:${colorNivel};font-weight:800">${nivel}%</span>
                </div>
                <div style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden">
                  <div style="height:100%;width:${nivel}%;background:${colorNivel};border-radius:4px"></div>
                </div>
              </div>
            </div>`;

          L.marker([p.latitud, p.longitud], { icon: icono })
            .addTo(map)
            .bindPopup(popup, { maxWidth: 270 });
        });
      };

      // Intentar backend primero
      fetch("http://localhost:8080/api/puntos/todos")
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then(cargarPuntos)
        .catch(() => cargarPuntos(PUNTOS_MOCK)); // fallback a mock
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}

const Landing = ({ irALogin, irARegistro }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        .leaflet-popup-content-wrapper { border-radius:16px!important; box-shadow:0 10px 40px rgba(0,0,0,.15)!important; border:1px solid #e5e7eb; padding:0!important; }
        .leaflet-popup-content { margin:0!important; padding:12px 14px!important; }
        .leaflet-popup-tip { background:white!important; }
        .leaflet-control-attribution { font-size:8px!important; }
      `}</style>

      {/* ══════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════ */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm shadow-green-200">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-green-800 font-bold text-lg tracking-tight">PlastiUsos</span>
            </div>

            {/* Nav desktop */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 font-medium">
              <a href="#mapa" className="hover:text-green-700 transition-colors">Puntos de Reciclaje</a>
              <a href="#como-funciona" className="hover:text-green-700 transition-colors">¿Cómo Funciona?</a>
              <a href="#materiales" className="hover:text-green-700 transition-colors">Materiales</a>
            </div>

            {/* CTAs desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={irALogin}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={irARegistro}
                className="px-4 py-2 text-sm font-semibold bg-green-600 text-white hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-200"
              >
                Registrarme
              </button>
            </div>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 shadow-lg">
            <a href="#mapa" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-600 hover:text-green-700">Puntos de Reciclaje</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-600 hover:text-green-700">¿Cómo Funciona?</a>
            <a href="#materiales" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-600 hover:text-green-700">Materiales</a>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button onClick={irALogin} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">
                Iniciar Sesión
              </button>
              <button onClick={irARegistro} className="flex-1 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700">
                Registrarme
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════
          HERO — MAPA COMO PROTAGONISTA
      ══════════════════════════════════════════════ */}
      <section id="mapa" className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-0">

          {/* Texto del hero */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-5">
              <Leaf className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700 text-xs font-semibold tracking-wide">Plataforma de Reciclaje · Popayán, Cauca</span>
            </div>
            <h1 className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Recicla, Gana Puntos y{" "}
              <span className="text-green-600">Cuida el Planeta</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-6">
              Convierte tus residuos reciclables en recompensas reales. Entrega materiales en los puntos de Popayán,
              acumula puntos y canjéalos por productos eco-amigables.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={irARegistro}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-green-200 text-sm sm:text-base"
              >
                Comenzar Ahora <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={irALogin}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
              >
                Ya tengo cuenta
              </button>
            </div>
          </div>

          {/* MAPA — EL PROTAGONISTA */}
          <div className="rounded-t-3xl overflow-hidden border border-gray-200 border-b-0 shadow-2xl shadow-gray-200">

            {/* Barra superior del mapa */}
            <div className="bg-white px-4 sm:px-5 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-700">Red de Puntos en Tiempo Real · Popayán</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />
                  <span>Disponible ({PUNTOS_MOCK.filter(p => p.activo && p.nivelLlenado < 80).length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                  <span>Medio ({PUNTOS_MOCK.filter(p => p.nivelLlenado >= 50 && p.nivelLlenado < 80).length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <span>Lleno/Inactivo ({PUNTOS_MOCK.filter(p => !p.activo || p.nivelLlenado >= 80).length})</span>
                </div>
              </div>
            </div>

            {/* Mapa Leaflet */}
            <div className="h-[340px] sm:h-[460px] lg:h-[540px] bg-gray-100 relative">
              <MapaLanding />

              {/* Overlay hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                <div className="bg-slate-900/85 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  Haz clic en un marcador para ver horario, plásticos aceptados y nivel de llenado
                </div>
              </div>
            </div>

            {/* Barra inferior — CTA dentro del mapa */}
            <div className="bg-green-700 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-white text-sm font-medium">
                ♻️ <strong>{PUNTOS_MOCK.filter(p => p.activo).length} puntos activos</strong> esperan tu reciclaje en Popayán
              </p>
              <button
                onClick={irARegistro}
                className="inline-flex items-center gap-2 bg-white hover:bg-green-50 text-green-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                Registrarme Gratis <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BANNER
      ══════════════════════════════════════════════ */}
      <section className="bg-green-700 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center text-white">
                  <Icon className="w-6 h-6 mx-auto mb-1.5 text-green-300" />
                  <div className="text-2xl sm:text-3xl font-extrabold">{stat.value}</div>
                  <div className="text-green-200 text-xs sm:text-sm mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CÓMO FUNCIONA
      ══════════════════════════════════════════════ */}
      <section id="como-funciona" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">¿Cómo Funciona?</span>
            <h2 className="text-gray-900 text-2xl sm:text-3xl font-extrabold mt-2">
              4 Pasos para Reciclar y Ganar
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              El proceso es simple, rápido y completamente trazable desde tu teléfono.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {PASOS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.paso} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="text-gray-100 text-5xl font-black absolute top-4 right-5 select-none">{s.paso}</div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 transition-transform group-hover:scale-110 ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2 text-sm sm:text-base">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MATERIALES ACEPTADOS
      ══════════════════════════════════════════════ */}
      <section id="materiales" className="bg-green-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Materiales Aceptados</span>
            <h2 className="text-gray-900 text-2xl sm:text-3xl font-extrabold mt-2">¿Qué puedes reciclar?</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Puntos por kg entregado según tipo de material</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {MATERIALES.map((m) => (
              <div key={m.nombre} className="bg-white rounded-2xl p-4 sm:p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="text-3xl sm:text-4xl mb-2 transition-transform group-hover:scale-110">{m.icono}</div>
                <h4 className="text-gray-800 text-xs sm:text-sm font-semibold mb-1.5">{m.nombre}</h4>
                <div className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${m.color}`}>
                  {m.pts} pts/kg
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BENEFICIOS
      ══════════════════════════════════════════════ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-gray-900 text-2xl sm:text-3xl font-extrabold">¿Por qué PlastiUsos?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {BENEFICIOS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:border-green-200 hover:bg-green-50 transition-all group">
                  <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2 text-sm sm:text-base">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl shadow-green-200 relative overflow-hidden">
            {/* Decoración */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />

            <div className="relative z-10">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
                Empieza a Reciclar Hoy
              </h2>
              <p className="text-green-200 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Únete a nuestra comunidad de recicladores en Popayán y comienza a ganar puntos por cuidar el planeta.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={irARegistro}
                  className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 px-7 py-3.5 rounded-xl font-bold transition-colors shadow-lg text-sm sm:text-base"
                >
                  Crear mi Cuenta Gratis <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={irALogin}
                  className="inline-flex items-center gap-2 bg-green-500/30 hover:bg-green-500/40 text-white border border-white/30 px-7 py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base"
                >
                  Ya tengo cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">PlastiUsos</span>
              </div>
              <p className="text-green-300 text-sm leading-relaxed">
                Transformamos el reciclaje en recompensas. Juntos construimos un Popayán más limpio y sostenible.
              </p>
            </div>
            <div>
              <h4 className="text-green-200 mb-3 font-semibold text-sm">Plataforma</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li><button onClick={irALogin} className="hover:text-white transition-colors">Dashboard</button></li>
                <li><a href="#mapa" className="hover:text-white transition-colors">Puntos de Recolección</a></li>
                <li><button onClick={irALogin} className="hover:text-white transition-colors">Catálogo de Premios</button></li>
                <li><button onClick={irALogin} className="hover:text-white transition-colors">Mis Transacciones</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-green-200 mb-3 font-semibold text-sm">Materiales</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li>Plástico PET</li>
                <li>Cartón y Papel</li>
                <li>Vidrio</li>
                <li>Metales</li>
                <li>Electrónicos</li>
              </ul>
            </div>
            <div>
              <h4 className="text-green-200 mb-3 font-semibold text-sm">Contacto</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li>info@plastiusos.co</li>
                <li>+57 (2) 820 1234</li>
                <li>Lun - Sáb: 8am - 6pm</li>
                <li>Popayán, Cauca</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-6 text-center text-sm text-green-400">
            © 2025 PlastiUsos Popayán. Todos los derechos reservados. Hecho con 💚 por el planeta.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
