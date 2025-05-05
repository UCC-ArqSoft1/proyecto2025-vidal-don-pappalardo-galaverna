"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ActivityForm from "./ActivityForm"
import CyberLayout from "../components/CyberLayout"
import type { ActivityFormData } from "../types"

// Simulación de datos iniciales
const mockData: Record<string, ActivityFormData> = {
  "1": {
    title: "Funcional",
    description:
      "Clase intensa de entrenamiento funcional que combina ejercicios de fuerza, resistencia y coordinación para mejorar tu condición física general.",
    photo: null,
    day: "lunes",
    time: "18:00",
    duration: "1h",
    capacity: 20,
    category: "funcional",
    instructor: "Juan",
  },
}

const EditActivityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activity, setActivity] = useState<ActivityFormData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simula fetch
    setLoading(true)
    setTimeout(() => {
      if (id && mockData[id]) {
        setActivity(mockData[id])
      }
      setLoading(false)
    }, 1000)
  }, [id])

  const handleUpdate = (data: ActivityFormData) => {
    console.log("Actualizar actividad:", id, data)
    // Aquí iría el PUT a tu backend
    setTimeout(() => {
      alert("¡Actividad actualizada con éxito!")
      navigate("/")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="cyber-spinner"></div>
        <span className="loading-text">Cargando actividad...</span>
      </div>
    )
  }

  if (!activity) {
    return (
      <CyberLayout>
        <div className="error-container">
          <h1 className="error-title neon-text-secondary">ACTIVIDAD NO ENCONTRADA</h1>
          <div className="cyber-divider-secondary error-divider"></div>
          <p className="error-message">La actividad que intentas editar no existe o ha sido eliminada.</p>
        </div>
      </CyberLayout>
    )
  }

  return <ActivityForm isEdit initialData={activity} onSubmit={handleUpdate} />
}

export default EditActivityPage
