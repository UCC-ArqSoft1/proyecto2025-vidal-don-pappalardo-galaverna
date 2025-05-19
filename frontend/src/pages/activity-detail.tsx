"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
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
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const isAdmin = authService.isAdmin()

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      setLoading(true)
      try {
        // Fetch activity details
        const activityResponse = await activityService.getActivityById(Number(id))
        if (activityResponse.success && activityResponse.data) {
          setActivity(activityResponse.data)
        } else {
          setError(activityResponse.message || "No se pudo cargar la actividad")
          return
        }

        // If user is authenticated, check if they are enrolled
        if (authService.isAuthenticated()) {
          const enrollmentsResponse = await enrollmentService.getUserEnrollments()
          if (enrollmentsResponse.success && enrollmentsResponse.data) {
            const isUserEnrolled = enrollmentsResponse.data.some(
              enrollment => enrollment.actividad_id === Number(id)
            )
            setIsEnrolled(isUserEnrolled)
          }
        }
      } catch (err) {
        setError("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleEnroll = async () => {
    if (!id) return

    if (!authService.isAuthenticated()) {
      toast.info("Debes iniciar sesión para inscribirte")
      navigate("/login")
      return
    }

    setIsEnrolling(true)
    const response = await enrollmentService.enrollInActivity(Number(id))
    setIsEnrolling(false)

    if (response.success) {
      toast.success("¡Te has inscrito con éxito!")
    } else {
      toast.error(response.message || "Error al inscribirse")
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
            <img src={activity.imagen_data || "/placeholder.svg?height=400&width=800"} alt={activity.titulo} />
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
                <span className="activity-detail-info-value">
                  {activity.inscritos} / {activity.cupo} personas
                </span>
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

            {!isAdmin && authService.isAuthenticated() && !isEnrolled && (
              <button 
                onClick={handleEnroll} 
                className="sport-button sport-button-full" 
                disabled={isEnrolling || activity.inscritos >= activity.cupo}
              >
                {isEnrolling ? (
                  <>
                    <span className="sport-spinner mr-2"></span>
                    PROCESANDO...
                  </>
                ) : activity.inscritos >= activity.cupo ? (
                  "CUPO COMPLETO"
                ) : (
                  "INSCRIBIRME"
                )}
              </button>
            )}

            {!isAdmin && authService.isAuthenticated() && isEnrolled && (
              <div className="text-center p-4 bg-green-100 text-green-800 rounded">
                Ya estás inscrito en esta actividad
              </div>
            )}

            {!authService.isAuthenticated() && (
              <button 
                onClick={() => navigate("/login")} 
                className="sport-button sport-button-full"
              >
                INICIAR SESIÓN PARA INSCRIBIRSE
              </button>
            )}
          </div>
        </div>
      </div>
    </SportLayout>
  )
}

export default ActivityDetail
