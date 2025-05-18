"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ActivityForm from "./activity-form"
import { activityService, authService } from "../services/api"
import type { Activity } from "../types"

const CreateActivity = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar si el usuario está autenticado y es administrador
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }

    if (!authService.isAdmin()) {
      navigate("/")
      alert("No tienes permisos para crear actividades")
      return
    }
  }, [navigate])

  const handleCreate = async (data: Activity) => {
    const response = await activityService.createActivity(data)

    if (response.success) {
      alert("¡Actividad creada con éxito!")
      navigate("/")
    } else {
      alert(response.message || "Error al crear la actividad")
    }
  }

  return <ActivityForm isEdit={false} onSubmit={handleCreate} />
}

export default CreateActivity
