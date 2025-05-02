package dtos

import "time"

type UsuarioDTO struct {
	Nombre       string `json:"nombre" binding:"required,max=100"`
	Apellido     string `json:"apellido" binding:"required,max=100"`
	Email        string `json:"email" binding:"required,email,max=100"`
	PasswordHash string `json:"password" binding:"required,min=8"`
	Active       bool   `json:"active"`
	RoleID       uint   `json:"role_id" binding:"required"`
}

type UsuarioResponseDTO struct {
	ID        uint      `json:"id"`
	Nombre    string    `json:"nombre"`
	Apellido  string    `json:"apellido"`
	Email     string    `json:"email"`
	Active    bool      `json:"active"`
	RoleID    uint      `json:"role_id"`
	CreatedAt time.Time `json:"created_at"`
}
