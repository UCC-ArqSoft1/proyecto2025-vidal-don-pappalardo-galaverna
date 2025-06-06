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
        const response = await userService.getInstructorDetails(Number.parseInt(id))
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
        <div className="sport-detail-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="sport-spinner"></div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">CARGANDO INSTRUCTOR</h2>
              <p className="text-gray-600">Obteniendo información del instructor...</p>
            </div>
          </div>
        </div>
      </SportLayout>
    )
  }

  if (error) {
    return (
      <SportLayout>
        <div className="sport-detail-container">
          <div className="error-container max-w-2xl mx-auto text-center py-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-500 text-3xl">⚠</span>
              </div>
              <h1 className="error-title text-3xl mb-4">ERROR</h1>
              <div className="error-divider mx-auto mb-6"></div>
              <p className="error-message text-lg mb-8">{error}</p>
            </div>
            <button onClick={() => navigate("/admin/instructores")} className="sport-button sport-button-outline">
              ← Volver a la lista de instructores
            </button>
          </div>
        </div>
      </SportLayout>
    )
  }

  if (!instructor) {
    return (
      <SportLayout>
        <div className="sport-detail-container">
          <div className="error-container max-w-2xl mx-auto text-center py-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-500 text-3xl">👤</span>
              </div>
              <h1 className="error-title text-3xl mb-4">INSTRUCTOR NO ENCONTRADO</h1>
              <div className="error-divider mx-auto mb-6"></div>
              <p className="error-message text-lg mb-8">El instructor que buscas no existe o ha sido eliminado.</p>
            </div>
            <button onClick={() => navigate("/admin/instructores")} className="sport-button sport-button-outline">
              ← Volver a la lista de instructores
            </button>
          </div>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="sport-detail-container max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <button onClick={() => navigate("/admin/instructores")} className="sport-button sport-button-outline">
            ← Volver a la lista de instructores
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
          {/* Instructor Info - Takes 3 columns on xl screens */}
          <div className="xl:col-span-3">
            <div className="sport-card h-full">
              <div className="activity-detail-header">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Avatar and Name Section */}
                  <div className="lg:col-span-8">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-2xl font-bold">
                          {instructor.nombre.charAt(0)}
                          {instructor.apellido.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-3 leading-tight">
                          {instructor.nombre} {instructor.apellido}
                        </h1>
                        <span className="sport-badge sport-badge-accent text-sm">INSTRUCTOR</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="lg:col-span-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{activities.length}</div>
                        <div className="text-sm text-gray-600">Actividades</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {activities.reduce((total, activity) => total + activity.cupo, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Cupo Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Card - Takes 1 column on xl screens */}
          <div className="xl:col-span-1">
            <div className="sport-card h-full">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border-l-4 border-primary h-full">
                <h3 className="text-lg font-semibold text-primary mb-6">CONTACTO</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm">📧</span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">Email</span>
                    </div>
                    <p className="font-medium text-gray-900 ml-11 break-all">{instructor.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="sport-card">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-primary">Actividades Asignadas</h2>
              <div className="md:justify-self-end">
                <span className="sport-badge sport-badge-secondary">
                  {activities.length} {activities.length === 1 ? "Actividad" : "Actividades"}
                </span>
              </div>
            </div>
            <div className="sport-divider"></div>
          </div>

          {activities.length === 0 ? (
            <div className="grid place-items-center py-16">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-gray-400 text-3xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Sin actividades asignadas</h3>
                <p className="text-gray-500">Este instructor no tiene actividades asignadas actualmente</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="sport-card hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col"
                >
                  <div className="sport-card-content flex flex-col h-full">
                    {/* Activity Header */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="sport-card-title text-xl font-bold leading-tight flex-1">{activity.titulo}</h3>
                        <span
                          className={`sport-badge text-xs font-semibold flex-shrink-0 ${
                            activity.categoria === "yoga"
                              ? "sport-badge-accent"
                              : activity.categoria === "cardio"
                                ? "sport-badge-secondary"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {activity.categoria.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Activity Details Grid */}
                    <div className="flex-1 mb-6">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-12 items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="col-span-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary text-sm">🕒</span>
                            </div>
                          </div>
                          <div className="col-span-10">
                            <p className="text-sm text-gray-600">Horario</p>
                            <p className="font-semibold text-gray-900">{activity.horario}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-12 items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="col-span-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary text-sm">📅</span>
                            </div>
                          </div>
                          <div className="col-span-10">
                            <p className="text-sm text-gray-600">Día</p>
                            <p className="font-semibold text-gray-900">{activity.dia}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-12 items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="col-span-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary text-sm">👥</span>
                            </div>
                          </div>
                          <div className="col-span-10">
                            <p className="text-sm text-gray-600">Cupo</p>
                            <p className="font-semibold text-gray-900">{activity.cupo} personas</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="sport-card-actions mt-auto">
                      <Link
                        to={`/detalle/${activity.id}`}
                        className="sport-button sport-button-full hover:transform hover:scale-105 transition-all duration-200 block text-center"
                      >
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
    </SportLayout>
  )
}

export default InstructorDetail
