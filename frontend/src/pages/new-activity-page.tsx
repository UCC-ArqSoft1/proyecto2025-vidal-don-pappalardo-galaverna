"use client"

import { useNavigate } from "react-router-dom"
import ActivityForm from "./activity-form"
import { activityService } from "../api"
import type { Activity } from "../types"

const NewActivityPage = () => {
  const navigate = useNavigate()

  const handleCreate = async (data: Activity) => {
    const response = await activityService.createActivity(data)

    if (response.success) {
      alert("¡Actividad creada con éxito!")
      navigate("/")
    } else {
      alert(response.message || "Error al crear la actividad")
    }
  }

  return <ActivityForm onSubmit={handleCreate} />
}

export default NewActivityPage
