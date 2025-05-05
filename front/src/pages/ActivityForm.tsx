"use client"

import type React from "react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import CyberLayout from "../components/CyberLayout"
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
    <CyberLayout>
      <div className="activity-form-container">
        <h1 className="text-4xl mb-8 cyber-header neon-text glitch-effect">
          {isEdit ? "EDITAR ACTIVIDAD" : "NUEVA ACTIVIDAD"}
        </h1>

        <div className="cyber-card activity-form-card">
          <div className="activity-form-orb-1"></div>
          <div className="activity-form-orb-2"></div>

          <form onSubmit={handleSubmit} className="activity-form">
            <div className="activity-form-grid">
              <div className="activity-form-group">
                <label className="activity-form-label">TÍTULO</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Título de la actividad"
                  required
                  className="cyber-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">CATEGORÍA</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Ej: yoga, cardio, funcional"
                  required
                  className="cyber-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">DÍA</label>
                <input
                  name="day"
                  value={form.day}
                  onChange={handleChange}
                  placeholder="Ej: lunes, martes"
                  required
                  className="cyber-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">HORA</label>
                <input
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  placeholder="Ej: 18:00"
                  required
                  className="cyber-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">DURACIÓN</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Ej: 1h, 45min"
                  required
                  className="cyber-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">CUPO</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleNumberChange}
                  placeholder="Número de participantes"
                  min={1}
                  required
                  className="cyber-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">INSTRUCTOR</label>
                <input
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  placeholder="Nombre del instructor"
                  required
                  className="cyber-input"
                />
              </div>

              <div className="activity-form-group">
                <label className="activity-form-label">FOTO</label>
                <div className="cyber-file-input">
                  <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
                  <div className="cyber-file-input-label">
                    {form.photo ? (form.photo as File).name : "Seleccionar imagen"}
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-form-group">
              <label className="activity-form-label">DESCRIPCIÓN</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe la actividad en detalle"
                rows={5}
                required
                className="cyber-textarea"
              ></textarea>
            </div>

            <div className="activity-form-actions">
              <button type="button" className="cyber-button cyber-button-secondary">
                CANCELAR
              </button>
              <button type="submit" className="cyber-button">
                {isEdit ? "GUARDAR CAMBIOS" : "CREAR ACTIVIDAD"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CyberLayout>
  )
}

export default ActivityForm
