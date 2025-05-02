package models

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Nombre      string `gorm:"size:100;not null"`
	Descripcion string
	Usuarios    []Usuario
}
