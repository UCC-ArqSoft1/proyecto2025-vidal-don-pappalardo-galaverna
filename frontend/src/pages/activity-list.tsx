"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { activityService } from "../services/api"
import { ConfirmDialog } from "../components/ConfirmDialog"
import type { Activity } from "../types"

export const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; activityId: number | null }>({
    isOpen: false,
    activityId: null
  })

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
        await fetchActivities() // Recargar la lista
      } else {
        setError(response.message || "Error al eliminar la actividad")
      }
    } catch (err) {
      setError("Error al eliminar la actividad")
    }
  }

  return (
    <SportLayout>
      <div className="activity-list-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl">Actividades</h1>
          <Link to="/admin/actividades/nueva" className="sport-button">
            NUEVA ACTIVIDAD
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando actividades...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No hay actividades registradas</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg shadow overflow-hidden">
                {activity.imagen_data && (
                  <img
                    src={activity.imagen_data}
                    alt={activity.titulo}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                    }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{activity.titulo}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{activity.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {activity.dia} {activity.horario}
                    </span>
                    <div className="space-x-2">
                      <Link
                        to={`/admin/actividades/${activity.id}/editar`}
                        className="text-primary hover:text-primary-dark"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(activity.id!)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, activityId: null })}
          onConfirm={handleDeleteConfirm}
          title="Eliminar Actividad"
          message="¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer."
          confirmText="Eliminar"
        />
      </div>
    </SportLayout>
  )
}

export default ActivityList 