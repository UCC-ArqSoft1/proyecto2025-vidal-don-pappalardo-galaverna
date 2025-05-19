"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { userService } from "../services/api"

interface Instructor {
  id: number
  nombre: string
}

export const InstructorList = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await userService.getInstructors()
        if (response.success && response.data) {
          setInstructors(response.data)
        } else {
          setError(response.message || "Error al cargar instructores")
        }
      } catch (err) {
        setError("Error al cargar instructores")
      } finally {
        setLoading(false)
      }
    }

    fetchInstructors()
  }, [])

  return (
    <SportLayout>
      <div className="instructor-list-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl">Instructores</h1>
          <Link to="/admin/instructores/nuevo" className="sport-button">
            NUEVO INSTRUCTOR
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando instructores...</p>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No hay instructores registrados</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">{instructor.nombre}</h3>
                <div className="flex justify-end mt-4">
                  <Link
                    to={`/admin/instructores/${instructor.id}`}
                    className="text-primary hover:text-primary-dark"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SportLayout>
  )
}

export default InstructorList 