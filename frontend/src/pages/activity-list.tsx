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
        setError(response.message || "Error al cargar las actividades")
      }
    } catch (err) {
      setError("Error al cargar las actividades")
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

  if (loading) {
    return (
      <SportLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </SportLayout>
    )
  }

  if (error) {
    return (
      <SportLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Actividades</h1>
          <Link
            to="/admin/actividades/nueva"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Nueva Actividad
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-600">No hay actividades registradas</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Día
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{activity.titulo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.dia}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.horario}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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