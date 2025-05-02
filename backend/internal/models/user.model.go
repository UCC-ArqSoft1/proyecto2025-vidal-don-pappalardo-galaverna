package models

import "gorm.io/gorm"

type Usuario struct {
	gorm.Model
	Nombre        string `gorm:"size:100;not null"`
	Apellido      string `gorm:"size:100;not null"`
	Email         string `gorm:"size:100;unique;not null"`
	PasswordHash  string `gorm:"size:255;not null"`
	Active        bool
	RoleID        uint
	Role          Role
	Inscripciones []Inscripcion
}
