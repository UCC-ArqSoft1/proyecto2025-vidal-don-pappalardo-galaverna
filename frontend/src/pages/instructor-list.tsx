"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import SportLayout from "../components/layout/CyberLayout"
import { userService } from "../services/api"
import { ConfirmDialog } from "../components/ConfirmDialog"

// Tipo que coincide con lo que devuelve el backend
interface InstructorListItem {
  id: number
  nombre: string
}

export const InstructorList = () => {
  const [instructors, setInstructors] = useState<InstructorListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; instructorId: number | null }>({
    isOpen: false,
    instructorId: null
  })

  const fetchInstructors = async () => {
    try {
      const response = await userService.getInstructors()
      if (response.success) {
        // Asegurarnos de que siempre sea un array, incluso si es vacío
        setInstructors(response.data || [])
        setError("")
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
        toast.success("Instructor eliminado exitosamente")
        await fetchInstructors()
      } else {
        toast.error(response.message || "Error al eliminar el instructor")
      }
    } catch (err) {
      toast.error("Error al eliminar el instructor")
    } finally {
      setDeleteDialog({ isOpen: false, instructorId: null })
    }
  }

  const filtered = instructors.filter(
    (i) =>
      i.nombre.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <SportLayout>
        <div className="flex justify-center items-center h-64">
          <div className="sport-spinner"></div>
        </div>
      </SportLayout>
    )
  }

  if (error) {
    return (
      <SportLayout>
        <div className="error-container">
          <h1 className="error-title">ERROR</h1>
          <div className="error-divider"></div>
          <p className="error-message">{error}</p>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="home-banner">
        <h1>INSTRUCTORES</h1>
        <p>Gestiona el equipo de instructores profesionales que imparten nuestras actividades.</p>
        <div className="home-banner-pattern"></div>
      </div>

      <div className="home-search">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sport-input"
        />
      </div>

      <div className="mb-6 mt-4">
        <Link to="/admin/instructores/nuevo" className="sport-button">
          CREAR NUEVO INSTRUCTOR
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="sport-card p-6 text-center">
          <h2 className="text-xl mb-4">No se encontraron instructores</h2>
          <p>Intenta con otra búsqueda o crea un nuevo instructor.</p>
        </div>
      ) : (
        <div className="sport-card-grid">
          {filtered.map((instructor) => (
            <div key={instructor.id} className="sport-card">
              <div className="sport-card-content">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="sport-card-title">{instructor.nombre}</h2>
                </div>

                <div className="sport-card-actions">
                  <Link to={`/admin/instructores/detalle/${instructor.id}`} className="sport-button sport-button-full">
                    VER DETALLES
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(instructor.id)}
                    className="sport-button sport-button-danger sport-button-full mt-2"
                  >
                    ELIMINAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Instructor"
        message="¿Estás seguro de que deseas eliminar este instructor? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialog({ isOpen: false, instructorId: null })}
        isDelete={true}
      />
    </SportLayout>
  )
}

export default InstructorList 