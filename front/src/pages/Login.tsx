"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import SportLayout from "../components/layout/CyberLayout"
import type { LoginFormData } from "../types"

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log("Login data:", formData)
    // Aquí iría la lógica de autenticación
  }

  return (
    <SportLayout>
      <div className="login-container">
        <h1 className="text-3xl mb-6 text-center">Iniciar Sesión</h1>

        <div className="login-card">
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

            <button type="submit" className="sport-button sport-button-full">
              INICIAR SESIÓN
            </button>
          </form>
        </div>
      </div>
    </SportLayout>
  )
}

export default Login
