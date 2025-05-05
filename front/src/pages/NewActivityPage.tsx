"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import ActivityForm from "./ActivityForm"
import type { ActivityFormData } from "../types"

const NewActivityPage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreate = (data: ActivityFormData) => {
    console.log("Crear actividad:", data)
    // Aquí iría el POST a tu backend
    setTimeout(() => {
      alert("¡Actividad creada con éxito!")
      navigate("/")
    }, 1500)
  }

  return <ActivityForm onSubmit={handleCreate} />
}

export default NewActivityPage
