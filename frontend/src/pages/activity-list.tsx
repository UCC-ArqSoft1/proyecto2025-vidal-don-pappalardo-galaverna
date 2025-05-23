"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import SportLayout from "../components/layout/CyberLayout"
import { activityService, authService, userService, enrollmentService } from "../services/api"
import { ConfirmDialog } from "../components/ConfirmDialog"
import type { Activity } from "../types"

export const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [deleteDialog, setDeleteDialog] = useState<{ 
    isOpen: boolean; 
    activityId: number | null;
    hasEnrollments: boolean;
  }>({
    isOpen: false,
    activityId: null,
    hasEnrollments: false
  })
  const isAdmin = authService.isAdmin()
  const isInstructor = authService.isInstructor()
  const currentUser = authService.getCurrentUser()

  const fetchActivities = async () => {
    try {
      let response;
      if (isInstructor && currentUser) {
        // If user is an instructor, get their specific activities
        response = await userService.getInstructorDetails(currentUser.id)
        if (response.success) {
          // Si la respuesta es exitosa, incluso si no hay actividades, no es un error
          setActivities(response.data?.data?.activities || [])
          setError("")
        } else {
          setError(response.message || "Error al cargar actividades")
        }
      } else {
        // Otherwise get all activities
        response = await activityService.getAllActivities()
        if (response.success) {
          // Si la respuesta es exitosa, incluso si no hay actividades, no es un error
          setActivities(response.data || [])
          setError("")
        } else {
          setError(response.message || "Error al cargar actividades")
        }
      }
    } catch (err) {
      setError("Error al cargar actividades")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleDeleteClick = async (activityId: number) => {
    try {
      // Verificar si la actividad tiene inscripciones
      const response = await enrollmentService.getEnrollmentsByActivity(activityId)
      const hasEnrollments = response.success && response.data ? response.data.length > 0 : false
      
      setDeleteDialog({ 
        isOpen: true, 
        activityId,
        hasEnrollments
      })
    } catch (err) {
      toast.error("Error al verificar inscripciones")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.activityId) return

    try {
      const response = await activityService.deleteActivity(deleteDialog.activityId)
      if (response.success && response.data) {
        if (response.data.inscripciones_eliminadas) {
          toast.success(response.data.mensaje)
        } else {
          toast.success("Actividad eliminada exitosamente")
        }
        await fetchActivities()
      } else {
        toast.error(response.message || "Error al eliminar la actividad")
      }
    } catch (err) {
      toast.error("Error al eliminar la actividad")
    } finally {
      setDeleteDialog({ isOpen: false, activityId: null, hasEnrollments: false })
    }
  }

  const filtered = activities.filter(
    (a) =>
      a.titulo.toLowerCase().includes(search.toLowerCase()) || 
      a.categoria.toLowerCase().includes(search.toLowerCase()) ||
      a.horario.toLowerCase().includes(search.toLowerCase())
  )

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
      <div className="home-banner">
        <h1>ACTIVIDADES DEPORTIVAS</h1>
        <p>
          {isInstructor 
            ? "Gestiona tus actividades asignadas como instructor."
            : "Descubre nuestras clases y actividades para mantenerte en forma y saludable."}
        </p>
        <div className="home-banner-pattern"></div>
      </div>

      <div className="home-search">
        <input
          type="text"
          placeholder="Buscar por nombre, categoría o horario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sport-input"
        />
      </div>

      {isAdmin && (
        <div className="mb-6 mt-4">
          <Link to="/nueva-actividad" className="sport-button">
            CREAR NUEVA ACTIVIDAD
          </Link>
        </div>
      )}

      {activities.length === 0 ? (
        <div className="sport-card p-6 text-center">
          <h2 className="text-xl mb-4">No hay actividades disponibles</h2>
          <p className="mb-6">
            {isAdmin 
              ? "Aún no se han creado actividades. ¡Comienza creando una nueva actividad!"
              : "No hay actividades disponibles en este momento. ¡Vuelve más tarde!"}
          </p>
          {isAdmin && (
            <Link to="/nueva-actividad" className="sport-button">
              CREAR NUEVA ACTIVIDAD
            </Link>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="sport-card p-6 text-center">
          <h2 className="text-xl mb-4">No se encontraron actividades</h2>
          <p>Intenta con otra búsqueda o vuelve más tarde.</p>
        </div>
      ) : (
        <div className="sport-card-grid">
          {filtered.map((activity) => (
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
                    <span className="text-primary font-semibold">CUPO:</span> {activity.inscritos} / {activity.cupo} personas
                  </p>
                  <p>
                    <span className="text-primary font-semibold">INSTRUCTOR:</span> {activity.profesor?.nombre || "No asignado"}
                  </p>
                </div>

                <div className="sport-card-actions">
                  <Link to={`/detalle/${activity.id}`} className="sport-button sport-button-full">
                    VER DETALLES
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        to={`/editar-actividad/${activity.id}`}
                        className="sport-button sport-button-outline sport-button-full mt-2"
                      >
                        EDITAR
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(activity.id!)}
                        className="sport-button sport-button-danger sport-button-full mt-2"
                      >
                        ELIMINAR
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Actividad"
        message={deleteDialog.hasEnrollments 
          ? "Esta actividad tiene inscripciones activas. Al eliminarla, todas las inscripciones serán canceladas. ¿Estás seguro de que deseas continuar?"
          : "¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer."}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialog({ isOpen: false, activityId: null, hasEnrollments: false })}
        isDelete={true}
      />
    </SportLayout>
  )
}

export default ActivityList 