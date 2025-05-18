"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { activityService, authService, enrollmentService } from "../services/api"
import type { Activity } from "../types"

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return

      setLoading(true)
      const response = await activityService.getActivityById(Number(id))

      if (response.success && response.data) {
        setActivity(response.data)
      } else {
        setError(response.message || "No se pudo cargar la actividad")
      }

      setLoading(false)
    }

    fetchActivity()
  }, [id])

  const handleEnroll = async () => {
    if (!id) return

    if (!authService.isAuthenticated()) {
      alert("Debes iniciar sesión para inscribirte")
      navigate("/login")
      return
    }

    setIsEnrolling(true)
    const response = await enrollmentService.enrollInActivity(Number(id))
    setIsEnrolling(false)

    if (response.success) {
      alert("¡Te has inscrito con éxito!")
    } else {
      alert(response.message || "Error al inscribirse")
    }
  }

  if (loading) {
    return (
      <SportLayout>
        <div className="flex justify-center items-center h-64">
          <div className="sport-spinner"></div>
        </div>
      </SportLayout>
    )
  }

  if (error || !activity) {
    return (
      <SportLayout>
        <div className="error-container">
          <h1 className="error-title">ACTIVIDAD NO ENCONTRADA</h1>
          <div className="error-divider"></div>
          <p className="error-message">{error || "La actividad que buscas no existe o ha sido eliminada."}</p>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="sport-detail-container">
        <div>
          <div className="activity-detail-header">
            <h1 className="text-4xl mb-4">{activity.titulo}</h1>
            <div className="activity-detail-badge">
              <span
                className={`sport-badge ${
                  activity.categoria === "yoga"
                    ? "sport-badge-accent"
                    : activity.categoria === "cardio"
                      ? "sport-badge-secondary"
                      : ""
                }`}
              >
                {activity.categoria.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="activity-detail-image">
            <img src={activity.imagen_url || "/placeholder.svg?height=400&width=800"} alt={activity.titulo} />
          </div>

          <div className="sport-card">
            <h2 className="text-2xl mb-4">Descripción</h2>
            <div className="sport-divider"></div>
            <p className="leading-relaxed">{activity.descripcion}</p>
          </div>
        </div>

        <div>
          <div className="sport-card activity-detail-sidebar">
            <h2 className="text-2xl mb-4">Detalles</h2>
            <div className="sport-divider"></div>

            <div className="activity-detail-info">
              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Día</span>
                <span className="activity-detail-info-value">{activity.dia}</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Duración</span>
                <span className="activity-detail-info-value">{activity.duracion} minutos</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Cupo</span>
                <span className="activity-detail-info-value">{activity.cupo} personas</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Horario</span>
                <span className="activity-detail-info-value">{activity.horario}</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Instructor</span>
                <span className="activity-detail-info-value">{activity.instructor}</span>
              </div>
            </div>

            <button onClick={handleEnroll} className="sport-button sport-button-full" disabled={isEnrolling}>
              {isEnrolling ? (
                <>
                  <span className="sport-spinner mr-2"></span>
                  PROCESANDO...
                </>
              ) : (
                "INSCRIBIRME"
              )}
            </button>
          </div>
        </div>
      </div>
    </SportLayout>
  )
}

export default ActivityDetail
