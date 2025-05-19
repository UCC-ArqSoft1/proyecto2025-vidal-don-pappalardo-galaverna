package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserHandler struct {
	db *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{db: db}
}

// GetInstructors obtiene todos los usuarios con rol de instructor
func (h *UserHandler) GetInstructors(c *gin.Context) {
	var instructors []struct {
		ID     uint   `json:"id"`
		Nombre string `json:"nombre"`
	}

	// Buscar usuarios con rol "instructor"
	result := h.db.Table("usuarios").
		Select("usuarios.id, usuarios.nombre").
		Joins("JOIN roles ON usuarios.role_id = roles.id").
		Where("roles.nombre = ?", "instructor").
		Where("usuarios.active = ?", true).
		Find(&instructors)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener instructores",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": instructors,
	})
}
