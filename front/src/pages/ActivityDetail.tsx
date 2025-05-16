"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { mockActivities } from "../mock/activities"

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const activity = mockActivities.find((a) => a.id === Number(id))
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false)

  if (!activity) {
    return (
      <SportLayout>
        <div className="error-container">
          <h1 className="error-title">ACTIVIDAD NO ENCONTRADA</h1>
          <div className="error-divider"></div>
          <p className="error-message">La actividad que buscas no existe o ha sido eliminada.</p>
        </div>
      </SportLayout>
    )
  }

  const handleEnroll = () => {
    setIsEnrolling(true)
    // Simulamos una petición
    setTimeout(() => {
      setIsEnrolling(false)
      alert("¡Te has inscrito con éxito!")
    }, 1500)
  }

  return (
    <SportLayout>
      <div className="sport-detail-container">
        <div>
          <div className="activity-detail-header">
            <h1 className="text-4xl mb-4">{activity.title}</h1>
            <div className="activity-detail-badge">
              <span
                className={`sport-badge ${
                  activity.category === "yoga"
                    ? "sport-badge-accent"
                    : activity.category === "cardio"
                      ? "sport-badge-secondary"
                      : ""
                }`}
              >
                {activity.category.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="activity-detail-image">
            <img src={activity.image || "/placeholder.svg?height=400&width=800"} alt={activity.title} />
          </div>

          <div className="sport-card">
            <h2 className="text-2xl mb-4">Descripción</h2>
            <div className="sport-divider"></div>
            <p className="leading-relaxed">{activity.description}</p>
          </div>
        </div>

        <div>
          <div className="sport-card activity-detail-sidebar">
            <h2 className="text-2xl mb-4">Detalles</h2>
            <div className="sport-divider"></div>

            <div className="activity-detail-info">
              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Instructor</span>
                <span className="activity-detail-info-value">{activity.instructor}</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Duración</span>
                <span className="activity-detail-info-value">{activity.duration}</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Cupo</span>
                <span className="activity-detail-info-value">{activity.capacity} personas</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Horario</span>
                <span className="activity-detail-info-value">{activity.schedule}</span>
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
