"use client"

import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ActivityForm from "./activity-form"
import { activityService } from "../services/api"
import type { Activity } from "../types"

const NewActivityPage = () => {
  const navigate = useNavigate()

  const handleCreate = async (data: Activity) => {
    const response = await activityService.createActivity(data)

    if (response.success) {
      toast.success("¡Actividad creada con éxito!")
      navigate("/")
    } else {
      toast.error(response.message || "Error al crear la actividad")
    }
  }

  return <ActivityForm onSubmit={handleCreate} />
}

export default NewActivityPage
