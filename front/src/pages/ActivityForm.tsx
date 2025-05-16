"use client"

import type React from "react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import SportLayout from "../components/layout/CyberLayout"
import type { ActivityFormData } from "../types"

interface ActivityFormProps {
  isEdit?: boolean
  initialData?: ActivityFormData
  onSubmit?: (data: ActivityFormData) => void
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ isEdit = false, initialData, onSubmit }) => {
  const [form, setForm] = useState<ActivityFormData>(
    initialData || {
      title: "",
      description: "",
      photo: null,
      day: "",
      time: "",
      duration: "",
      capacity: 0,
      category: "",
      instructor: "",
    },
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, photo: e.target.files?.[0] || null }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(form)
    } else {
      console.log("Form data:", form)
    }
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
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Título de la actividad"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Categoría</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Ej: yoga, cardio, funcional"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Día</label>
                <input
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  placeholder="Ej: lunes, martes"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Hora</label>
                <input
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  placeholder="Ej: 18:00"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Duración</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Ej: 1h, 45min"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Cupo</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleNumberChange}
                  placeholder="Número de participantes"
                  min={1}
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Instructor</label>
                <input
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  placeholder="Nombre del instructor"
                  required
                  className="sport-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">Foto</label>
                <div className="sport-file-input">
                  <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
                  <div className="sport-file-input-label">
                    {form.photo ? (form.photo as File).name : "Seleccionar imagen"}
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-form-group">
              <label className="activity-form-label">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe la actividad en detalle"
                rows={5}
                required
                className="sport-textarea"
              ></textarea>
            </div>

            <div className="activity-form-actions">
              <button type="button" className="sport-button sport-button-outline">
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
