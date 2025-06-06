import React, { useState, useEffect } from "react";

interface Instructor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  active?: boolean;
}

const API_URL = "/usuarios/instructores";

const AdminInstructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Instructor>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Error al obtener instructores");
      const result = await res.json();
      setInstructors(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (inst: Instructor) => {
    setShowForm(true);
    setEditingId(inst.id);
    setFormData(inst);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este instructor?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error("Error al eliminar instructor");
        setInstructors(instructors.filter((i) => i.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("token");
      // Solo soportado crear (POST), no editar (PUT)
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
        }),
      });
      if (!res.ok) throw new Error("Error al agregar instructor");
      // El backend responde con { message, data }
      const result = await res.json();
      setInstructors([...instructors, {
        id: result.data.id,
        nombre: result.data.nombre,
        apellido: result.data.apellido,
        email: result.data.email,
        active: result.data.active,
      }]);
      setShowForm(false);
      setFormData({});
      setEditingId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestionar Instructores</h1>
        <button
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          onClick={handleAdd}
        >
          + Agregar Instructor
        </button>
      </div>

      {/* Loading/Error States */}
      {loading ? (
        <div className="text-center py-8">Cargando instructores...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Apellido</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst) => (
                <tr key={inst.id} className="border-b">
                  <td className="py-2 px-4">{inst.nombre}</td>
                  <td className="py-2 px-4">{inst.apellido}</td>
                  <td className="py-2 px-4">{inst.email}</td>
                  <td className="py-2 px-4 flex gap-2 justify-center">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(inst.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Instructor Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            onSubmit={handleFormSubmit}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Editar Instructor" : "Agregar Instructor"}
            </h2>
            <div className="mb-4">
              <label className="block mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
              >
                {editingId ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminInstructors;
