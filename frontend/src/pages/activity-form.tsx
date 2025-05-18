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
    initialData || {
      titulo: "",
      descripcion: "",
      dia: "",
      horario: "",
      duracion: 60,
      cupo: 10,
      categoria: "",
      instructor: "",
      imagen_url: "",
      active: true,
      profesor_id: 0,
    },
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "horario") {
      // Convertir la hora HH:mm a un objeto Date con la fecha actual
      const [hours, minutes] = value.split(":").map(Number)
      const date = new Date()
      date.setHours(hours, minutes, 0, 0)
      setForm((prev) => ({ ...prev, [name]: date.toISOString() }))
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // En un caso real, aquí subirías la imagen a un servidor y obtendrías la URL
      const file = e.target.files[0]
      const localUrl = URL.createObjectURL(file)
      setForm((prev) => ({ ...prev, imagen_url: localUrl }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      // Asegurarnos de que el horario sea un string ISO y que profesor_id sea un número
      const formData = {
        ...form,
        horario: new Date(form.horario).toISOString(),
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
                  value={form.horario ? new Date(form.horario).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }) : ""}
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
                  <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
                  <div className="sport-file-input-label">
                    {form.imagen_url ? "Imagen seleccionada" : "Seleccionar imagen"}
                  </div>
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
