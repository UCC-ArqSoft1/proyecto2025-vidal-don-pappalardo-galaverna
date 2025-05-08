package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/models"
	"github.com/proyecto2025/backend/internal/dtos"
	"github.com/proyecto2025/backend/internal/services" // Asegúrate de importar el servicio
	"gorm.io/gorm"
)

type ActividadHandler struct {
	db      *gorm.DB
	service *services.ActividadService
}

func NewActividadHandler(db *gorm.DB, service *services.ActividadService) *ActividadHandler {
	return &ActividadHandler{db: db, service: service}
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

func (h *ActividadHandler) CrearActividad(c *gin.Context) {
	var actividadDTO dtos.ActividadDTO

	if err := c.ShouldBindJSON(&actividadDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al crear actividad",
			"details": err.Error(),
		})
		return
	}

	// Llama al servicio para crear la actividad
	actividad, err := h.service.CrearActividad(actividadDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error interno al guardar la actividad",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, actividad)
}
