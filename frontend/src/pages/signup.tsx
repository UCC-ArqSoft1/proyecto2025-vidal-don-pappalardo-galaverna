"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { authService } from "../api"
import type { UserRegistration } from "../types"

const Signup = () => {
  const [formData, setFormData] = useState<UserRegistration>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "confirmPassword") {
      setConfirmPassword(value)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = (): boolean => {
    if (formData.password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    const response = await authService.register(formData)

    if (response.success) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.")
      navigate("/login")
    } else {
      setError(response.message || "Error al registrarse")
    }

    setLoading(false)
  }

  return (
    <SportLayout>
      <div className="login-container">
        <h1 className="text-3xl mb-6 text-center">Crear Cuenta</h1>

        <div className="login-card">
          {error && <div className="error-message mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label className="login-form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="sport-input"
              />
            </div>

            <div className="login-form-group">
              <label className="login-form-label">Apellido</label>
              <input
                type="text"
                name="apellido"
                placeholder="Tu apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="sport-input"
              />
            </div>

            <div className="login-form-group">
              <label className="login-form-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="sport-input"
              />
            </div>

            <div className="login-form-group">
              <label className="login-form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="sport-input"
              />
            </div>

            <div className="login-form-group">
              <label className="login-form-label">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="sport-input"
              />
            </div>

            <button type="submit" className="sport-button sport-button-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="sport-spinner mr-2"></span>
                  PROCESANDO...
                </>
              ) : (
                "REGISTRARME"
              )}
            </button>

            <div className="mt-4 text-center">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Iniciar sesión
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </SportLayout>
  )
}

export default Signup
