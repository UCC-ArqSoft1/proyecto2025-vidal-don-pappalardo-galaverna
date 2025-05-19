"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { userService } from "../services/api"
import type { Activity } from "../types"

interface Instructor {
  id: number
  nombre: string
  apellido: string
  email: string
}

export const InstructorDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      if (!id) return

      try {
        console.log("Fetching instructor details for ID:", id)
        const response = await userService.getInstructorDetails(parseInt(id))
        console.log("API Response:", response)

        // Verificar la estructura exacta de la respuesta
        if (response.success && response.data) {
          console.log("Response data:", response.data)
          if (response.data.instructor) {
            console.log("Setting instructor:", response.data.instructor)
            setInstructor(response.data.instructor)
            setActivities(response.data.activities || [])
            setError("") // Limpiar cualquier error previo
          } else {
            console.log("No instructor data in response")
            setError("No se encontró la información del instructor")
          }
        } else {
          console.log("Error in response:", response.message)
          setError(response.message || "Error al cargar los detalles del instructor")
        }
      } catch (err) {
        console.error("Error fetching instructor:", err)
        setError("Error al cargar los detalles del instructor")
      } finally {
        setLoading(false)
      }
    }

    fetchInstructorDetails()
  }, [id])

  // Log del estado actual
  console.log("Current state:", { instructor, activities, loading, error })

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
          <div className="mt-4">
            <button
              onClick={() => navigate("/admin/instructores")}
              className="text-primary hover:underline"
            >
              Volver a la lista de instructores
            </button>
          </div>
        </div>
      </SportLayout>
    )
  }

  // Verificar si tenemos datos del instructor antes de renderizar
  if (!instructor) {
    return (
      <SportLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>No se encontró la información del instructor</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate("/admin/instructores")}
              className="text-primary hover:underline"
            >
              Volver a la lista de instructores
            </button>
          </div>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/instructores")}
            className="text-primary hover:underline"
          >
            ← Volver a la lista de instructores
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{instructor.nombre} {instructor.apellido}</h1>
            <p className="text-gray-600">{instructor.email}</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Actividades Asignadas</h2>
            {activities.length === 0 ? (
              <p className="text-gray-600">Este instructor no tiene actividades asignadas</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="border rounded p-4">
                    <h3 className="font-medium">{activity.titulo}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.dia} {activity.horario}</p>
                    <p className="text-sm text-gray-600">Cupo: {activity.cupo} personas</p>
                    <div className="mt-2">
                      <Link
                        to={`/admin/actividades/${activity.id}/editar`}
                        className="text-primary hover:underline text-sm"
                      >
                        Ver actividad
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SportLayout>
  )
}

export default InstructorDetail 