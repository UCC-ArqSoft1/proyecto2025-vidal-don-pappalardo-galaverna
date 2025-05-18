"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { authService } from "../services/api"

interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const response = await authService.login(formData.email, formData.password)

    if (response.success) {
      navigate("/")
    } else {
      setError(response.message || "Error al iniciar sesión")
    }

    setLoading(false)
  }

  return (
    <SportLayout>
      <div className="login-container">
        <h1 className="text-3xl mb-6 text-center">Iniciar Sesión</h1>

        <div className="login-card">
          {error && <div className="error-message mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
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
                "INICIAR SESIÓN"
              )}
            </button>

            <div className="mt-4 text-center">
              <p>
                ¿No tienes una cuenta?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </SportLayout>
  )
}

export default Login
