package models

import (
	"gorm.io/gorm"
	"time"
)

type Actividad struct {
	gorm.Model
	Titulo        string        `gorm:"size:100;not null" json:"titulo"`
	Descripcion   string        `gorm:"size:200" json:"descripcion"`
	Dia           string        `gorm:"size:20" json:"dia"`
	Horario       time.Time     `gorm:"type:time" json:"horario"`  // Cambio aquí
	Duracion      int           `json:"duracion"`
	Cupo          int           `json:"cupo"`
	Categoria     string        `gorm:"size:50" json:"categoria"`
	ImagenURL     string        `gorm:"size:255" json:"imagen_url"`
	Active        bool          `json:"active"`
	Inscripciones []Inscripcion `json:"inscripciones,omitempty"`

}
