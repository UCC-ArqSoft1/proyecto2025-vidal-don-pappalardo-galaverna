"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ActivityForm from "./activity-form"
import CyberLayout from "../components/layout/CyberLayout"
import { activityService } from "../api"
import type { Activity } from "../types"

const EditActivityPage = () => {
  const { id } = useParams<{ id: string }>()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
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
  }, [id])

  const handleUpdate = async (data: Activity) => {
    if (!id) return

    const response = await activityService.updateActivity(Number(id), data)

    if (response.success) {
      alert("¡Actividad actualizada con éxito!")
      navigate("/")
    } else {
      alert(response.message || "Error al actualizar la actividad")
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="cyber-spinner"></div>
        <span className="loading-text">Cargando actividad...</span>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <CyberLayout>
        <div className="error-container">
          <h1 className="error-title neon-text-secondary">ACTIVIDAD NO ENCONTRADA</h1>
          <div className="cyber-divider-secondary error-divider"></div>
          <p className="error-message">{error || "La actividad que intentas editar no existe o ha sido eliminada."}</p>
        </div>
      </CyberLayout>
    )
  }

  return <ActivityForm isEdit initialData={activity} onSubmit={handleUpdate} />
}

export default EditActivityPage
