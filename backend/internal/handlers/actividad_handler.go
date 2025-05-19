package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/proyecto2025/backend/internal/dtos"
	"github.com/proyecto2025/backend/internal/models"
	"github.com/proyecto2025/backend/internal/services" // Asegúrate de importar el servicio
	"gorm.io/gorm"
)

type ActividadHandler struct {
	db       *gorm.DB
	service  *services.ActividadService
	validate *validator.Validate
}

func NewActividadHandler(db *gorm.DB, validate *validator.Validate, service *services.ActividadService) *ActividadHandler {
	return &ActividadHandler{
		db:       db,
		service:  service,
		validate: validate,
	}
}

// El handler que devuelve todas las actividades
func (h *ActividadHandler) GetAll(c *gin.Context) {
	var actividades []models.Actividad
	if err := h.db.Preload("Profesor").Find(&actividades).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener actividades"})
		return
	}

	var response []dtos.ActividadResponseDTO
	for _, a := range actividades {
		response = append(response, dtos.MapActividadToDTO(a, h.db))
	}

	c.JSON(http.StatusOK, response)
}

func (h *ActividadHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	var actividad models.Actividad

	// Cargamos la actividad junto con el profesor
	if err := h.db.Preload("Profesor").First(&actividad, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}

	// Mapear la actividad al DTO
	response := dtos.MapActividadToDTO(actividad, h.db)

	c.JSON(http.StatusOK, response)
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

// El handler que borra una actividad (borrado lógico)
func (h *ActividadHandler) DeleteActividad(c *gin.Context) {
	id := c.Param("id")

	// Convertimos el id a uint
	var parsedID uint
	if _, err := fmt.Sscanf(id, "%d", &parsedID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Llamamos al servicio para borrar la actividad
	err := h.service.DeleteActividad(parsedID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar actividad"})
		}
		return
	}

	// Si no hubo error, respondemos con un mensaje de éxito
	c.JSON(http.StatusOK, gin.H{"mensaje": "Actividad eliminada correctamente"})
}

func (h *ActividadHandler) UpdateActividad(c *gin.Context) {
	var actividadDTO dtos.ActividadDTO
	id := c.Param("id")

	// Convertir el id de string a uint
	parsedID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Verificamos si los datos son válidos
	if err := c.ShouldBindJSON(&actividadDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos de entrada no válidos",
			"details": err.Error(),
		})
		return
	}

	// Validar los datos con el validador de Gin
	if validationErr := h.validate.Struct(actividadDTO); validationErr != nil {
		// Recoger todos los errores de validación para devolverlos en una respuesta clara
		var errorMsgs []string
		for _, err := range validationErr.(validator.ValidationErrors) {
			errorMsgs = append(errorMsgs, fmt.Sprintf("Campo '%s' es inválido: %s", err.Field(), err.Tag()))
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Errores de validación en los campos",
			"details": errorMsgs,
		})
		return
	}

	// Llamamos al servicio para realizar la actualización
	actividad, err := h.service.UpdateActividad(uint(parsedID), actividadDTO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al actualizar la actividad",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, actividad)
}
