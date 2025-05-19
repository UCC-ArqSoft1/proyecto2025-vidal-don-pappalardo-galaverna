"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import SportLayout from "../components/layout/CyberLayout"
import { enrollmentService, authService } from "../services/api"
import { ConfirmDialog } from "../components/ConfirmDialog"
import type { Enrollment } from "../types"

const MyActivities = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState<boolean>(false)
  const [cancelDialog, setCancelDialog] = useState<{ isOpen: boolean; enrollmentId: number | null }>({
    isOpen: false,
    enrollmentId: null
  })
  const navigate = useNavigate()

  const fetchEnrollments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await enrollmentService.getUserEnrollments()
      if (response.success) {
        setEnrollments(response.data || [])
      } else {
        setError(response.message || "Error al cargar inscripciones")
      }
    } catch (err) {
      setError("Error al cargar las inscripciones")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }

    fetchEnrollments()
  }, [navigate])

  const handleCancelClick = (enrollmentId: number) => {
    setCancelDialog({ isOpen: true, enrollmentId })
  }

  const handleCancelConfirm = async () => {
    if (!cancelDialog.enrollmentId) return

    setIsCancelling(true)
    try {
      const response = await enrollmentService.cancelEnrollment(cancelDialog.enrollmentId)
      if (response.success) {
        toast.success("Inscripción cancelada exitosamente")
        await fetchEnrollments() // Recargar los datos
      } else {
        toast.error(response.message || "Error al cancelar la inscripción")
      }
    } catch (err) {
      toast.error("Error al cancelar la inscripción")
    } finally {
      setIsCancelling(false)
      setCancelDialog({ isOpen: false, enrollmentId: null })
    }
  }

  if (loading) {
    return (
      <SportLayout>
        <div className="flex justify-center items-center h-64">
          <div className="sport-spinner"></div>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <h1 className="text-3xl mb-6">Mis Actividades</h1>

      {error ? (
        <div className="error-container">
          <h1 className="error-title">ERROR</h1>
          <div className="error-divider"></div>
          <p className="error-message">{error}</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="sport-card p-6 text-center">
          <h2 className="text-2xl mb-4">No tienes actividades inscritas</h2>
          <p className="mb-6">Explora nuestras actividades y únete a alguna para comenzar tu entrenamiento</p>
          <Link to="/" className="sport-button">
            VER ACTIVIDADES DISPONIBLES
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="sport-card">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{enrollment.actividad?.titulo || "Actividad"}</h2>
                  <span className="text-sm text-gray-400">
                    Inscrito el:{" "}
                    {new Date(enrollment.fecha_inscripcion.replace(" ", "T")).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="sport-divider"></div>

                <div className="flex justify-end gap-4 mt-4">
                  <Link to={`/detalle/${enrollment.actividad_id}`} className="sport-button sport-button-outline">
                    VER DETALLES
                  </Link>
                  <button
                    onClick={() => handleCancelClick(enrollment.id)}
                    className="sport-button sport-button-danger"
                    disabled={isCancelling}
                  >
                    {isCancelling && cancelDialog.enrollmentId === enrollment.id ? (
                      <>
                        <span className="sport-spinner mr-2"></span>
                        CANCELANDO...
                      </>
                    ) : (
                      "CANCELAR INSCRIPCIÓN"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={cancelDialog.isOpen}
        title="Cancelar Inscripción"
        message="¿Estás seguro que deseas cancelar tu inscripción en esta actividad?"
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelDialog({ isOpen: false, enrollmentId: null })}
        confirmText="Sí, Cancelar"
        cancelText="No, Volver"
        isDelete={true}
      />
    </SportLayout>
  )
}

export default MyActivities
