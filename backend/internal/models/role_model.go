package models

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Nombre      string    `gorm:"size:100;not null;unique"`
	Descripcion string    `gorm:"size:200"`
	Usuarios    []Usuario `gorm:"foreignKey:RoleID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
}
