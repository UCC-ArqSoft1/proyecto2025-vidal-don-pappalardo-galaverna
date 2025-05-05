"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import CyberLayout from "../components/CyberLayout"
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
    <CyberLayout>
      <div className="login-container">
        <h1 className="text-4xl mb-6 cyber-header neon-text glitch-effect">ACCESO</h1>

        <div className="cyber-card login-card">
          <div className="login-orb-1"></div>
          <div className="login-orb-2"></div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label className="login-form-label">EMAIL</label>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="cyber-input"
              />
            </div>

            <div className="login-form-group">
              <label className="login-form-label">CONTRASEÑA</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="cyber-input"
              />
            </div>

            <button type="submit" className="cyber-button cyber-button-full">
              INICIAR SESIÓN
            </button>
          </form>
        </div>
      </div>
    </CyberLayout>
  )
}

export default Login
