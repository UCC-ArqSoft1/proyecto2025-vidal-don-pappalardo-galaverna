package dtos

import (
	"time"

	"github.com/proyecto2025/backend/internal/models"
)

type ProfesorResponseDTO struct {
	ID     uint   `json:"id"`
	Nombre string `json:"nombre"`
}

type ActividadDTO struct {
	Titulo      string    `json:"titulo" binding:"required,max=100"`
	Descripcion string    `json:"descripcion" binding:"max=200"`
	Dia         string    `json:"dia" binding:"required,max=20"`
	Horario     time.Time `json:"horario" binding:"required"`
	Duracion    int       `json:"duracion" binding:"required,min=1"`
	Cupo        int       `json:"cupo" binding:"required,min=1"`
	Categoria   string    `json:"categoria" binding:"required,max=50"`
	ImagenURL   string    `json:"imagen_url" binding:"max=255"`
	Active      bool      `json:"active"`
	ProfesorID  uint      `json:"profesor_id" binding:"required"`
}

type ActividadResponseDTO struct {
	ID          uint                `json:"id"`
	Titulo      string              `json:"titulo"`
	Descripcion string              `json:"descripcion"`
	Dia         string              `json:"dia"`
	Horario     string              `json:"horario"`
	Duracion    int                 `json:"duracion"`
	Cupo        int                 `json:"cupo"`
	Categoria   string              `json:"categoria"`
	ImagenURL   string              `json:"imagen_url"`
	Active      bool                `json:"active"`
	ProfesorID  uint                `json:"profesor_id"`
	Profesor    ProfesorResponseDTO `json:"profesor"`
	CreatedAt   time.Time           `json:"created_at"`
	UpdatedAt   time.Time           `json:"updated_at"`
}

// mapeo porque quiero devovler unicamente los campos id y nombre del profesor
func MapActividadToDTO(a models.Actividad) ActividadResponseDTO {
	return ActividadResponseDTO{
		ID:          a.ID,
		Titulo:      a.Titulo,
		Descripcion: a.Descripcion,
		Dia:         a.Dia,
		Horario:     a.Horario.Format("15:04"), // o el formato que prefieras
		Duracion:    a.Duracion,
		Cupo:        a.Cupo,
		Categoria:   a.Categoria,
		ImagenURL:   a.ImagenURL,
		Active:      a.Active,
		ProfesorID:  a.ProfesorID,
		Profesor: ProfesorResponseDTO{
			ID:     a.Profesor.ID,
			Nombre: a.Profesor.Nombre,
		},
		CreatedAt: a.CreatedAt,
		UpdatedAt: a.UpdatedAt,
	}
}
