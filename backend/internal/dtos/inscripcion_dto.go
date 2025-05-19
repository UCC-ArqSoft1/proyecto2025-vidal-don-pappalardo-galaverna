package dtos

import "github.com/proyecto2025/backend/internal/models"

type InscripcionDTO struct {
	UsuarioID        uint   `json:"usuario_id" binding:"required"`
	ActividadID      uint   `json:"actividad_id" binding:"required"`
	FechaInscripcion string `json:"fecha_inscripcion"`
}

// InscripcionResponseDTO representa la respuesta de una inscripción
type InscripcionResponseDTO struct {
	ID               uint              `json:"id"`
	UsuarioID        uint              `json:"usuario_id"`
	ActividadID      uint              `json:"actividad_id"`
	FechaInscripcion string            `json:"fecha_inscripcion"`
	Usuario          *models.Usuario   `json:"usuario,omitempty"`
	Actividad        *models.Actividad `json:"actividad,omitempty"`
}
