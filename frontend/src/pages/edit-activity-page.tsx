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

  return <ActivityForm isEdit initialData={activity} onSubmit={handleUpdate} />
}

export default EditActivityPage
