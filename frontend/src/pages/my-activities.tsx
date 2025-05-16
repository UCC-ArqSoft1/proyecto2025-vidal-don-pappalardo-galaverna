"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { enrollmentService, authService } from "../api"
import type { Enrollment } from "../types"

const MyActivities = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!authService.isAuthenticated()) {
        setError("Debes iniciar sesión para ver tus actividades")
        setLoading(false)
        return
      }

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
  }, [])

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
        <div className="sport-card my-activities-empty">
          <h2 className="text-2xl mb-4">No tienes actividades</h2>
          <p className="mb-6">Inscríbete en alguna actividad para verla aquí</p>
          <Link to="/" className="sport-button">
            VER ACTIVIDADES
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="my-activity-card">
              <div className="my-activity-content">
                <div className="my-activity-info">
                  <h2 className="my-activity-title">{enrollment.actividad?.titulo || "Actividad"}</h2>
                  <p className="my-activity-date">
                    Fecha de inscripción:{" "}
                    {new Date(enrollment.fechaInscripcion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="my-activity-actions">
                  <Link to={`/detalle/${enrollment.actividadId}`} className="sport-button sport-button-outline">
                    VER DETALLES
                  </Link>
                  <button className="sport-button sport-button-secondary">CANCELAR</button>
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
