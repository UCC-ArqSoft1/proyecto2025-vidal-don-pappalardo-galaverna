"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import type { Activity } from "../types"

interface ActivityFormProps {
  isEdit?: boolean
  initialData?: Activity
  onSubmit?: (data: Activity) => void
}

export const ActivityForm = ({ isEdit = false, initialData, onSubmit }: ActivityFormProps) => {
  const navigate = useNavigate()
  const [form, setForm] = useState<Activity>(
    initialData ? {
      ...initialData,
      // Asegurarnos de que instructor sea el ID del profesor
      instructor: initialData.profesor_id?.toString() || "",
      // Mantener los datos de la imagen si existen
      imagen_data: initialData.imagen_data || "",
      imagen_type: initialData.imagen_type || ""
    } : {
      titulo: "",
      descripcion: "",
      dia: "",
      horario: "",
      duracion: 60,
      cupo: 10,
      categoria: "",
      instructor: "",
      imagen_data: "",
      imagen_type: "",
      active: true,
      profesor_id: 0,
    }
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "horario") {
      // Mantener el horario como string HH:mm
      setForm((prev) => ({ ...prev, [name]: value }))
    } else if (name === "instructor") {
      // Convertir el instructor a número y usarlo como profesor_id
      const profesorId = Number(value)
      setForm((prev) => ({ 
        ...prev, 
        instructor: value,
        profesor_id: profesorId 
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // Convertir el archivo a base64
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = event.target.result as string
          setForm((prev) => ({ 
            ...prev, 
            imagen_data: base64String,
            imagen_type: file.type
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      // Asegurarnos de que el horario sea un string HH:mm y que profesor_id sea un número
      const formData = {
        ...form,
        profesor_id: Number(form.instructor)
      }
      onSubmit(formData)
    } else {
      console.log("Form data:", form)
    }
  }

  const handleCancel = () => {
    navigate("/")
  }

  return (
    <SportLayout>
      <div className="activity-form-container">
        <h1 className="text-3xl mb-6">{isEdit ? "Editar Actividad" : "Nueva Actividad"}</h1>

        <div className="activity-form-card">
          <form onSubmit={handleSubmit} className="activity-form">
            <div className="activity-form-grid">
              <div className="activity-form-group">
                <label className="activity-form-label">Título</label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Título de la actividad"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Categoría</label>
                <input
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  placeholder="Ej: yoga, cardio, funcional"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Día</label>
                <input
                  name="dia"
                  value={form.dia}
                  onChange={handleChange}
                  placeholder="Ej: lunes, martes"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Hora</label>
                <input
                  type="time"
                  name="horario"
                  value={form.horario}
                  onChange={handleChange}
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Duración (minutos)</label>
                <input
                  type="number"
                  name="duracion"
                  value={form.duracion}
                  onChange={handleNumberChange}
                  placeholder="Duración en minutos"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Cupo</label>
                <input
                  type="number"
                  name="cupo"
                  value={form.cupo}
                  onChange={handleNumberChange}
                  placeholder="Número de participantes"
                  min={1}
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">ID del Instructor</label>
                <input
                  type="number"
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  placeholder="ID del instructor"
                  required
                  min={1}
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Foto</label>
                <div className="sport-file-input">
                  <input 
                    type="file" 
                    name="photo" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                    id="photo-input"
                  />
                  <label 
                    htmlFor="photo-input" 
                    className="sport-file-input-label cursor-pointer block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors"
                  >
                    {form.imagen_data ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-32 h-32">
                          <img 
                            src={form.imagen_data} 
                            alt="Preview" 
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">Click para cambiar la imagen</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">Click para seleccionar una imagen</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="activity-form-group">
              <label className="activity-form-label">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe la actividad en detalle"
                rows={5}
                required
                className="sport-textarea"
              ></textarea>
            </div>

            <div className="activity-form-actions">
              <button type="button" onClick={handleCancel} className="sport-button sport-button-outline">
                CANCELAR
              </button>
              <button type="submit" className="sport-button">
                {isEdit ? "GUARDAR CAMBIOS" : "CREAR ACTIVIDAD"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SportLayout>
  )
}

export default ActivityForm
