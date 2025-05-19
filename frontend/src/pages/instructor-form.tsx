"use client"

import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { userService } from "../services/api"

interface InstructorFormData {
  nombre: string
  apellido: string
  email: string
  password: string
}

export const InstructorForm = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<InstructorFormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await userService.createInstructor(form)
      if (response.success) {
        navigate("/admin/instructores")
      } else {
        setError(response.message || "Error al crear el instructor")
      }
    } catch (err) {
      setError("Error al crear el instructor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SportLayout>
      <div className="instructor-form-container">
        <h1 className="text-3xl mb-6">Nuevo Instructor</h1>

        <div className="instructor-form-card">
          <form onSubmit={handleSubmit} className="instructor-form">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="instructor-form-grid">
              <div className="instructor-form-group">
                <label className="instructor-form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="sport-input"
                  placeholder="Nombre del instructor"
                />
              </div>

              <div className="instructor-form-group">
                <label className="instructor-form-label">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  className="sport-input"
                  placeholder="Apellido del instructor"
                />
              </div>

              <div className="instructor-form-group">
                <label className="instructor-form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="sport-input"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div className="instructor-form-group">
                <label className="instructor-form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="sport-input"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div className="instructor-form-actions">
              <button
                type="button"
                onClick={() => navigate("/admin/instructores")}
                className="sport-button sport-button-outline"
                disabled={loading}
              >
                CANCELAR
              </button>
              <button type="submit" className="sport-button" disabled={loading}>
                {loading ? "CREANDO..." : "CREAR INSTRUCTOR"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SportLayout>
  )
}

export default InstructorForm 