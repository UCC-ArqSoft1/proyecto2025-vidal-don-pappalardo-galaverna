"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { userService } from "../services/api"
import { ConfirmDialog } from "../components/ConfirmDialog"
import type { Instructor } from "../types"

export const InstructorList = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; instructorId: number | null }>({
    isOpen: false,
    instructorId: null
  })

  const fetchInstructors = async () => {
    try {
      const response = await userService.getInstructors()
      if (response.success && response.data) {
        setInstructors(response.data)
      } else {
        setError(response.message || "Error al cargar los instructores")
      }
    } catch (err) {
      setError("Error al cargar los instructores")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstructors()
  }, [])

  const handleDeleteClick = (instructorId: number) => {
    setDeleteDialog({ isOpen: true, instructorId })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.instructorId) return

    try {
      const response = await userService.deleteInstructor(deleteDialog.instructorId)
      if (response.success) {
        await fetchInstructors() // Recargar la lista
      } else {
        setError(response.message || "Error al eliminar el instructor")
      }
    } catch (err) {
      setError("Error al eliminar el instructor")
    }
  }

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
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Instructores</h1>
          <Link
            to="/admin/instructores/nuevo"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Nuevo Instructor
          </Link>
        </div>

        {instructors.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-600">No hay instructores registrados</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instructors.map((instructor) => (
                  <tr key={instructor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{instructor.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{instructor.apellido}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{instructor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/instructores/detalle/${instructor.id}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          Ver detalles
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(instructor.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, instructorId: null })}
          onConfirm={handleDeleteConfirm}
          title="Eliminar Instructor"
          message="¿Estás seguro de que deseas eliminar este instructor? Esta acción no se puede deshacer."
          confirmText="Eliminar"
        />
      </div>
    </SportLayout>
  )
}

export default InstructorList 