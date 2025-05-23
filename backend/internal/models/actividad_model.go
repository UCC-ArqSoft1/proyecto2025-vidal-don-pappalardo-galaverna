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
	Duracion      int           `gorm:"not null" json:"duracion"`
	Cupo          int           `gorm:"not null" json:"cupo"`
	Categoria     string        `gorm:"size:50" json:"categoria"`
	ImagenData    []byte        `gorm:"type:longblob" json:"imagen_data"`
	ImagenType    string        `gorm:"size:50" json:"imagen_type"` // Para guardar el tipo MIME (ej: "image/jpeg")
	Active        bool          `gorm:"default:true" json:"active"`
	ProfesorID    uint          `gorm:"not null" json:"profesor_id"`
	Profesor      Usuario       `gorm:"foreignKey:ProfesorID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"profesor"`
	Inscripciones []Inscripcion `gorm:"foreignKey:ActividadID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"inscripciones,omitempty"`
}
