package dtos

import "time"

type ActividadDTO struct {
	Titulo      string `json:"titulo" binding:"required,max=100"`
	Descripcion string `json:"descripcion" binding:"max=200"`
	Dia         string `json:"dia" binding:"required,max=20"`
	Horario     string `json:"horario" binding:"required"`
	Duracion    int    `json:"duracion" binding:"required,min=1"`
	Cupo        int    `json:"cupo" binding:"required,min=1"`
	Categoria   string `json:"categoria" binding:"required,max=50"`
	ImagenURL   string `json:"imagen_url" binding:"max=255"`
	Active      bool   `json:"active"`
}

// ActividadResponseDTO representa los datos que se devuelven después de crear una actividad.
type ActividadResponseDTO struct {
	ID          uint      `json:"id"`
	Titulo      string    `json:"titulo"`
	Descripcion string    `json:"descripcion"`
	Dia         string    `json:"dia"`
	Horario     string    `json:"horario"`
	Duracion    int       `json:"duracion"`
	Cupo        int       `json:"cupo"`
	Categoria   string    `json:"categoria"`
	ImagenURL   string    `json:"imagen_url"`
	Active      bool      `json:"active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
