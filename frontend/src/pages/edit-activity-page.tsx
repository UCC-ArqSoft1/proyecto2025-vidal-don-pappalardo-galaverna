"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ActivityForm from "./activity-form"
import SportLayout from "../components/layout/CyberLayout"
import { activityService, authService } from "../services/api"
import type { Activity } from "../types"
import { toast } from "react-toastify"

const EditActivityPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar si el usuario está autenticado y es administrador
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }

    if (!authService.isAdmin()) {
      toast.warning("No tienes permisos para editar actividades")
      navigate("/")
      return
    }

    const fetchActivity = async () => {
      if (!id) return

      setLoading(true)
      const response = await activityService.getActivityById(Number(id))

      if (response.success && response.data) {
        setActivity(response.data)
      } else {
        setError(response.message || "No se pudo cargar la actividad")
      }

      setLoading(false)
    }

    fetchActivity()
  }, [id, navigate])

  const handleUpdate = async (data: Activity) => {
    if (!id) return

    const response = await activityService.updateActivity(Number(id), data)

    if (response.success) {
      toast.success("¡Actividad actualizada con éxito!")
      navigate("/")
    } else {
      toast.error(response.message || "Error al actualizar la actividad")
    }
  }

  const handleToggle = async () => {
    if (!id || !activity) return

    const response = await activityService.toggleActivity(Number(id))
    if (response.success && response.data) {
      toast.success(response.data.mensaje)
      // Actualizar el estado local de la actividad
      setActivity(prev => prev ? { ...prev, active: !prev.active } : null)
    } else {
      toast.error(response.message || "Error al cambiar el estado de la actividad")
    }
  }

  if (loading) {
    return (
      <SportLayout>
        <div className="loading-container">
          <div className="sport-spinner"></div>
          <span className="loading-text">Cargando actividad...</span>
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
          <p className="error-message">{error || "La actividad que intentas editar no existe o ha sido eliminada."}</p>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Actividad</h1>
        <button
          onClick={handleToggle}
          className={`sport-button ${activity.active ? 'sport-button-warning' : 'sport-button-success'}`}
        >
          {activity.active ? 'DESACTIVAR' : 'ACTIVAR'} ACTIVIDAD
        </button>
      </div>
      <ActivityForm isEdit initialData={activity} onSubmit={handleUpdate} />
    </SportLayout>
  )
}

export default EditActivityPage
