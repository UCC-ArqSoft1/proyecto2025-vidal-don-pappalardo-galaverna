import type React from "react"
import { Link } from "react-router-dom"
import CyberLayout from "../components/CyberLayout"
import type { UserActivity } from "../types"

// Simulación de actividades del usuario
const userActivities: UserActivity[] = [
  { id: 1, name: "Spinning Intensivo", date: "2023-06-15", time: "18:00" },
  { id: 2, name: "Funcional Express", date: "2023-06-17", time: "19:30" },
]

const MyActivities: React.FC = () => {
  return (
    <CyberLayout>
      <h1 className="text-4xl mb-8 cyber-header neon-text glitch-effect">MIS ACTIVIDADES</h1>

      {userActivities.length === 0 ? (
        <div className="cyber-card my-activities-empty">
          <h2 className="text-2xl mb-4">No tienes actividades</h2>
          <p className="mb-6">Inscríbete en alguna actividad para verla aquí</p>
          <Link to="/" className="cyber-button">
            VER ACTIVIDADES
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userActivities.map((activity) => (
            <div key={activity.id} className="cyber-card my-activity-card">
              <div className="my-activity-orb"></div>

              <div className="my-activity-content">
                <div className="my-activity-info">
                  <h2 className="my-activity-title neon-text">{activity.name}</h2>
                  <p className="my-activity-date">
                    {new Date(activity.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    - {activity.time}
                  </p>
                </div>

                <div className="my-activity-actions">
                  <Link to={`/detalle/${activity.id}`} className="cyber-button cyber-button-secondary">
                    VER DETALLES
                  </Link>
                  <button className="cyber-button">CANCELAR</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CyberLayout>
  )
}

export default MyActivities
