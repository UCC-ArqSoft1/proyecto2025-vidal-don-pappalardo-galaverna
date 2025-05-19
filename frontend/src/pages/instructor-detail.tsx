"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { userService } from "../services/api"
import type { Activity } from "../types"

interface Instructor {
  id: number
  nombre: string
  apellido: string
  email: string
}

export const InstructorDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      if (!id) return

      try {
        const response = await userService.getInstructorDetails(parseInt(id))
        if (response.success && response.data?.data) {
          const instructorData = response.data.data.instructor
          if (instructorData) {
            setInstructor(instructorData)
            setActivities(response.data.data.activities || [])
            setError("")
          } else {
            setError("No se encontró la información del instructor")
          }
        } else {
          setError(response.message || "Error al cargar los detalles del instructor")
        }
      } catch (err) {
        setError("Error al cargar los detalles del instructor")
      } finally {
        setLoading(false)
      }
    }

    fetchInstructorDetails()
  }, [id])

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
          <div className="mt-4">
            <button
              onClick={() => navigate("/admin/instructores")}
              className="sport-button"
            >
              Volver a la lista de instructores
            </button>
          </div>
        </div>
      </SportLayout>
    )
  }

  if (!instructor) {
    return (
      <SportLayout>
        <div className="error-container">
          <h1 className="error-title">INSTRUCTOR NO ENCONTRADO</h1>
          <div className="error-divider"></div>
          <p className="error-message">El instructor que buscas no existe o ha sido eliminado.</p>
          <div className="mt-4">
            <button
              onClick={() => navigate("/admin/instructores")}
              className="sport-button"
            >
              Volver a la lista de instructores
            </button>
          </div>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="sport-detail-container">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/instructores")}
            className="sport-button sport-button-outline"
          >
            ← Volver a la lista de instructores
          </button>
        </div>

        <div className="sport-card">
          <div className="activity-detail-header">
            <h1 className="text-4xl mb-4">{instructor.nombre} {instructor.apellido}</h1>
            <div className="activity-detail-badge">
              <span className="sport-badge sport-badge-accent">INSTRUCTOR</span>
            </div>
          </div>

          <div className="activity-detail-image">
            <img src="/placeholder.svg?height=400&width=800" alt={`${instructor.nombre} ${instructor.apellido}`} />
          </div>

          <div className="sport-card">
            <h2 className="text-2xl mb-4">Información de Contacto</h2>
            <div className="sport-divider"></div>
            <div className="activity-detail-info">
              <div className="activity-detail-info-item">
                <span className="activity-detail-info-label">Email</span>
                <span className="activity-detail-info-value">{instructor.email}</span>
              </div>
            </div>
          </div>

          <div className="sport-card mt-6">
            <h2 className="text-2xl mb-4">Actividades Asignadas</h2>
            <div className="sport-divider"></div>
            {activities.length === 0 ? (
              <p className="text-gray-600">Este instructor no tiene actividades asignadas</p>
            ) : (
              <div className="sport-card-grid">
                {activities.map((activity) => (
                  <div key={activity.id} className="sport-card">
                    <div className="sport-card-content">
                      <div className="sport-card-image">
                        <img 
                          src={activity.imagen_data || "/placeholder.svg?height=200&width=400"} 
                          alt={activity.titulo} 
                        />
                        <div className="sport-card-badge">
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

                      <h2 className="sport-card-title">{activity.titulo}</h2>

                      <div className="sport-card-meta">
                        <p>
                          <span className="text-primary font-semibold">HORARIO:</span> {activity.horario}
                        </p>
                        <p>
                          <span className="text-primary font-semibold">DÍA:</span> {activity.dia}
                        </p>
                        <p>
                          <span className="text-primary font-semibold">CUPO:</span> {activity.cupo} personas
                        </p>
                      </div>

                      <div className="sport-card-actions">
                        <Link to={`/detalle/${activity.id}`} className="sport-button sport-button-full">
                          VER DETALLES
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SportLayout>
  )
}

export default InstructorDetail 