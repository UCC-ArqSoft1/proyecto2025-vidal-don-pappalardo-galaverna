"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { activityService, authService } from "../services/api"
import { ConfirmDialog } from "../components/ConfirmDialog"
import type { Activity } from "../types"

export const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; activityId: number | null }>({
    isOpen: false,
    activityId: null
  })
  const isAdmin = authService.isAdmin()

  const fetchActivities = async () => {
    try {
      const response = await activityService.getAllActivities()
      if (response.success && response.data) {
        setActivities(response.data)
      } else {
        setError(response.message || "Error al cargar actividades")
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

  const handleDeleteClick = (activityId: number) => {
    setDeleteDialog({ isOpen: true, activityId })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.activityId) return

    try {
      const response = await activityService.deleteActivity(deleteDialog.activityId)
      if (response.success) {
        await fetchActivities()
      } else {
        setError(response.message || "Error al eliminar la actividad")
      }
    } catch (err) {
      setError("Error al eliminar la actividad")
    } finally {
      setDeleteDialog({ isOpen: false, activityId: null })
    }
  }

  const filtered = activities.filter(
    (a) =>
      a.titulo.toLowerCase().includes(search.toLowerCase()) || 
      a.categoria.toLowerCase().includes(search.toLowerCase())
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
        <p>Descubre nuestras clases y actividades para mantenerte en forma y saludable.</p>
        <div className="home-banner-pattern"></div>
      </div>

      <div className="home-search">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
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

      {filtered.length === 0 ? (
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
        message="¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialog({ isOpen: false, activityId: null })}
        isDelete={true}
      />
    </SportLayout>
  )
}

export default ActivityList 