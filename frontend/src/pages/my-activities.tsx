"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { enrollmentService, authService } from "../services/api"
import type { Enrollment } from "../types"

const MyActivities = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }

    const fetchEnrollments = async () => {
      setLoading(true)
      const response = await enrollmentService.getUserEnrollments()

      if (response.success && response.data) {
        setEnrollments(response.data)
      } else {
        setError(response.message || "Error al cargar inscripciones")
      }

      setLoading(false)
    }

    fetchEnrollments()
  }, [navigate])

  if (loading) {
    return (
      <SportLayout>
        <div className="flex justify-center items-center h-64">
          <div className="sport-spinner"></div>
        </div>
      </SportLayout>
    )
  }

  if (error) {
    return (
      <SportLayout>
        <div className="error-container">
          <h1 className="error-title">ERROR</h1>
          <div className="error-divider"></div>
          <p className="error-message">{error}</p>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <h1 className="text-3xl mb-6">Mis Actividades</h1>

      {enrollments.length === 0 ? (
        <div className="sport-card p-6 text-center">
          <h2 className="text-2xl mb-4">No tienes actividades</h2>
          <p className="mb-6">Inscríbete en alguna actividad para verla aquí</p>
          <Link to="/" className="sport-button">
            VER ACTIVIDADES
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="sport-card">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{enrollment.actividad?.titulo || "Actividad"}</h2>
                  <span className="text-sm text-gray-400">
                    Inscrito el:{" "}
                    {new Date(enrollment.fecha_inscripcion.replace(" ", "T")).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="sport-divider"></div>

                <div className="flex justify-end gap-4 mt-4">
                  <Link to={`/detalle/${enrollment.id}`} className="sport-button sport-button-outline">
                    VER DETALLES
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SportLayout>
  )
}

export default MyActivities
