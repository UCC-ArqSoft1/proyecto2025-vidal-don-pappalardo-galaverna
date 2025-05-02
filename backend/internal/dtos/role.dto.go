package dtos

import "time"

type RoleDTO struct {
	Nombre      string `json:"nombre" binding:"required,max=100"`
	Descripcion string `json:"descripcion"`
}

type RoleResponseDTO struct {
	ID          uint      `json:"id"`
	Nombre      string    `json:"nombre"`
	Descripcion string    `json:"descripcion"`
	CreatedAt   time.Time `json:"created_at"`
}
