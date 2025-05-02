package models

import "gorm.io/gorm"

type Actividad struct {
	gorm.Model
	Titulo        string `gorm:"size:100;not null"`
	Descripcion   string `gorm:"size:200"`
	Dia           string `gorm:"size:20"`
	Horario       string // Cambiado a string para simplificar el mapeo, considera usar time.Time con formato.
	Duracion      int
	Cupo          int
	Categoria     string `gorm:"size:50"`
	ImagenURL     string `gorm:"size:255"`
	Active        bool
	Inscripciones []Inscripcion
}
