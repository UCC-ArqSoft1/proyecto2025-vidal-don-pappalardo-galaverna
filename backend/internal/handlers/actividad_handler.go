package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/models"
	"gorm.io/gorm"
)

type ActividadHandler struct {
	db *gorm.DB
}

func NewActividadHandler(db *gorm.DB) *ActividadHandler {
	return &ActividadHandler{db: db}
}

// El handler que devuelve todas las actividades
func (h *ActividadHandler) GetAll(c *gin.Context) {
	var actividades []models.Actividad
	if err := h.db.Find(&actividades).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener actividades"})
		return
	}
	c.JSON(http.StatusOK, actividades)
}

func (h *ActividadHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	var actividad models.Actividad

	if err := h.db.First(&actividad, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}

	c.JSON(http.StatusOK, actividad)
}
