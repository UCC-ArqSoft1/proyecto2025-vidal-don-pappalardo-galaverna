"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import CyberLayout from "../components/CyberLayout"
import { mockActivities } from "../mock/activities"

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const activity = mockActivities.find((a) => a.id === Number(id))
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false)

  if (!activity) {
    return (
      <CyberLayout>
        <div className="error-container">
          <h1 className="error-title neon-text-secondary">ACTIVIDAD NO ENCONTRADA</h1>
          <div className="cyber-divider-secondary error-divider"></div>
          <p className="error-message">La actividad que buscas no existe o ha sido eliminada.</p>
        </div>
      </CyberLayout>
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
    <CyberLayout>
      <div className="cyber-detail-container">
        <div>
          <div className="activity-detail-header">
            <h1 className="text-4xl mb-4 cyber-header neon-text">{activity.title}</h1>
            <div className="activity-detail-badge">
              <span
                className={`cyber-badge ${
                  activity.category === "yoga"
                    ? "cyber-badge-accent"
                    : activity.category === "cardio"
                      ? "cyber-badge-secondary"
                      : ""
                }`}
              >
                {activity.category.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="activity-detail-image">
            <img src={activity.image || "/placeholder.svg?height=400&width=800"} alt={activity.title} />
            <div className="activity-detail-image-overlay"></div>
          </div>

          <div className="cyber-card">
            <h2 className="text-2xl mb-4 neon-text">DESCRIPCIÓN</h2>
            <div className="cyber-divider"></div>
            <p className="leading-relaxed">{activity.description}</p>
          </div>
        </div>

        <div>
          <div className="cyber-card activity-detail-sidebar">
            <h2 className="text-2xl mb-4 neon-text">DETALLES</h2>
            <div className="cyber-divider"></div>

            <div className="activity-detail-info">
              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">INSTRUCTOR</span>
                <span className="activity-detail-info-value">{activity.instructor}</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">DURACIÓN</span>
                <span className="activity-detail-info-value">{activity.duration}</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">CUPO</span>
                <span className="activity-detail-info-value">{activity.capacity} personas</span>
              </div>

              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">HORARIO</span>
                <span className="activity-detail-info-value">{activity.schedule}</span>
              </div>
            </div>

            <button onClick={handleEnroll} className="cyber-button cyber-button-full" disabled={isEnrolling}>
              {isEnrolling ? (
                <>
                  <span className="cyber-spinner mr-2"></span>
                  PROCESANDO...
                </>
              ) : (
                "INSCRIBIRME"
              )}
            </button>
          </div>
        </div>
      </div>
    </CyberLayout>
  )
}

export default ActivityDetail
