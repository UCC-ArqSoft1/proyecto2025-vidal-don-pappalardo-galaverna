package models

import "gorm.io/gorm"

type Inscripcion struct {
	gorm.Model
	UsuarioID        uint
	Usuario          Usuario
	ActividadID      uint
	Actividad        Actividad
	FechaInscripcion string //Considerar time.Time
}
