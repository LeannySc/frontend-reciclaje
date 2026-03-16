import {
  ShieldCheck,
  Users,
  BarChart3,
  Package,
  Trash2,
  Edit,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = ({ usuario }) => {
  const [metricas, setMetricas] = useState({
    totalUsuarios: 0,
    totalKilos: 0,
    stock: [],
  });
  const [listaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    // 1. Cargamos el método verReportes() del UML
    axios
      .get("http://localhost:8080/api/admin/reportes")
      .then((res) => setMetricas(res.data));
    // 2. Cargamos el método gestionarUsuarios() del UML
    axios
      .get("http://localhost:8080/api/admin/gestionar-usuarios")
      .then((res) => setListaUsuarios(res.data));
  }, []);

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      {/* SECCIÓN REPORTES (verReportes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex items-center gap-4">
          <Users className="text-blue-400" size={40} />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Usuarios
            </p>
            <h4 className="text-3xl font-black">{metricas.totalUsuarios}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-green-100 flex items-center gap-4 text-green-700">
          <BarChart3 size={40} />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Kilos Totales
            </p>
            <h4 className="text-3xl font-black">{metricas.totalKilos} KG</h4>
          </div>
        </div>
      </div>

      {/* GESTIÓN DE USUARIOS (gestionarUsuarios) */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden">
        <div className="p-8 border-b flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">
            Panel de Control de Popayán
          </h3>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold">
            ACCESO NIVEL {usuario.nivelPrivilegios}
          </span>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase border-b">
                <th className="p-4">Usuario</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Correo</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaUsuarios.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50 border-b border-slate-50 transition-colors"
                >
                  <td className="p-4 font-bold">{u.nombre}</td>
                  <td className="p-4 text-xs font-medium text-blue-500 italic">
                    {u.rol}
                  </td>
                  <td className="p-4 text-slate-500">{u.correo}</td>
                  <td className="p-4 flex justify-end gap-2 text-slate-300">
                    <button className="hover:text-blue-600">
                      <Edit size={16} />
                    </button>
                    <button className="hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
