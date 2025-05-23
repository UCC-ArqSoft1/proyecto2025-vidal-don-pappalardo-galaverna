package models

import "gorm.io/gorm"

type Usuario struct {
	gorm.Model
	Nombre        string        `gorm:"size:100;not null"`
	Apellido      string        `gorm:"size:100;not null"`
	Email         string        `gorm:"size:100;unique;not null"`
	PasswordHash  string        `gorm:"size:255;not null"`
	Active        bool          `gorm:"default:true"`
	RoleID        uint          `gorm:"not null"`
	Role          Role          `gorm:"foreignKey:RoleID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
	Inscripciones []Inscripcion `gorm:"foreignKey:UsuarioID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Actividades   []Actividad   `gorm:"foreignKey:ProfesorID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
}
