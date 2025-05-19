package models

import (
	"time"

	"gorm.io/gorm"
)

type Actividad struct {
	gorm.Model
	Titulo        string        `gorm:"size:100;not null" json:"titulo"`
	Descripcion   string        `gorm:"size:200" json:"descripcion"`
	Dia           string        `gorm:"size:20" json:"dia"`
	Horario       time.Time     `gorm:"type:time" json:"horario"`
	Duracion      int           `json:"duracion"`
	Cupo          int           `json:"cupo"`
	Categoria     string        `gorm:"size:50" json:"categoria"`
	ImagenData    []byte        `gorm:"type:longblob" json:"imagen_data"`
	ImagenType    string        `gorm:"size:50" json:"imagen_type"` // Para guardar el tipo MIME (ej: "image/jpeg")
	Active        bool          `json:"active"`
	Inscripciones []Inscripcion `json:"inscripciones,omitempty"`

	ProfesorID uint    `json:"profesor_id"` // Foreign Key
	Profesor   Usuario `json:"profesor"`    // Relación con Usuario
}
