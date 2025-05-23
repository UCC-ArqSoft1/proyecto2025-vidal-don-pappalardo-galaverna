package models

import (
	"time"

	"gorm.io/gorm"
)

type Inscripcion struct {
	gorm.Model
	UsuarioID        uint      `gorm:"not null"`
	Usuario          Usuario   `gorm:"foreignKey:UsuarioID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ActividadID      uint      `gorm:"not null"`
	Actividad        Actividad `gorm:"foreignKey:ActividadID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	FechaInscripcion time.Time `gorm:"not null;default:CURRENT_TIMESTAMP"`
}
