package handlers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/proyecto2025/backend/internal/dtos"
	"github.com/proyecto2025/backend/internal/models"
	"github.com/proyecto2025/backend/internal/services"
	"gorm.io/gorm"
)

type InscripcionHandler struct {
	db      *gorm.DB
	service *services.InscripcionService
}

func NewInscripcionHandler(db *gorm.DB, service *services.InscripcionService) *InscripcionHandler {
	return &InscripcionHandler{
		db:      db,
		service: service,
	}
}

// CrearInscripcion crea una nueva inscripción
func (h *InscripcionHandler) CrearInscripcion(c *gin.Context) {
	log.Printf("Recibida petición POST a /inscripciones/:actividadId")

	// Obtener el ID de la actividad de la URL
	actividadIDStr := c.Param("actividadId")
	log.Printf("ID de actividad: %s", actividadIDStr)

	// Convertir el ID a uint
	actividadID, err := strconv.ParseUint(actividadIDStr, 10, 32)
	if err != nil {
		log.Printf("Error al convertir ID de actividad: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de actividad inválido"})
		return
	}

	// Obtener el ID del usuario del token JWT
	claims, exists := c.Get("claims")
	if !exists {
		log.Printf("No se encontraron claims en el token")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No se pudo obtener la información del usuario"})
		return
	}

	userID := uint(claims.(jwt.MapClaims)["user_id"].(float64))
	log.Printf("ID de usuario: %d", userID)

	// Crear la inscripción
	inscripcion := models.Inscripcion{
		UsuarioID:        userID,
		ActividadID:      uint(actividadID),
		FechaInscripcion: time.Now().Format("2006-01-02 15:04:05"),
	}

	// Verificar si la actividad existe y tiene cupo disponible
	var actividad models.Actividad
	if err := h.db.First(&actividad, actividadID).Error; err != nil {
		log.Printf("Error al buscar actividad: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}
	log.Printf("Actividad encontrada: %+v", actividad)

	// Verificar si hay cupo disponible
	var inscripcionesCount int64
	if err := h.db.Model(&models.Inscripcion{}).Where("actividad_id = ?", actividadID).Count(&inscripcionesCount).Error; err != nil {
		log.Printf("Error al contar inscripciones: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al verificar cupos"})
		return
	}
	log.Printf("Cupos ocupados: %d/%d", inscripcionesCount, actividad.Cupo)

	if inscripcionesCount >= int64(actividad.Cupo) {
		log.Printf("No hay cupos disponibles")
		c.JSON(http.StatusBadRequest, gin.H{"error": "No hay cupos disponibles"})
		return
	}

	// Verificar si el usuario ya está inscrito
	var inscripcionExistente models.Inscripcion
	if err := h.db.Where("usuario_id = ? AND actividad_id = ?", userID, actividadID).First(&inscripcionExistente).Error; err == nil {
		log.Printf("Usuario ya inscrito")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ya estás inscrito en esta actividad"})
		return
	}

	// Crear la inscripción
	if err := h.db.Create(&inscripcion).Error; err != nil {
		log.Printf("Error al crear inscripción: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la inscripción"})
		return
	}
	log.Printf("Inscripción creada exitosamente: %+v", inscripcion)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Inscripción creada exitosamente",
		"data": dtos.InscripcionResponseDTO{
			ID:               inscripcion.ID,
			UsuarioID:        inscripcion.UsuarioID,
			ActividadID:      inscripcion.ActividadID,
			FechaInscripcion: inscripcion.FechaInscripcion,
		},
	})
}

// GetInscripcionesByUsuario obtiene todas las inscripciones del usuario autenticado
func (h *InscripcionHandler) GetInscripcionesByUsuario(c *gin.Context) {
	log.Printf("Recibida petición GET a /inscripciones/usuarios/me")

	// Obtener el ID del usuario del token JWT
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No se pudo obtener la información del usuario"})
		return
	}

	userID := uint(claims.(jwt.MapClaims)["user_id"].(float64))
	log.Printf("Obteniendo inscripciones para usuario: %d", userID)

	var inscripciones []models.Inscripcion
	if err := h.db.Preload("Actividad").Where("usuario_id = ?", userID).Find(&inscripciones).Error; err != nil {
		log.Printf("Error al obtener inscripciones: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las inscripciones"})
		return
	}

	var response []dtos.InscripcionResponseDTO
	for _, i := range inscripciones {
		response = append(response, dtos.InscripcionResponseDTO{
			ID:               i.ID,
			UsuarioID:        i.UsuarioID,
			ActividadID:      i.ActividadID,
			FechaInscripcion: i.FechaInscripcion,
			Actividad:        &i.Actividad,
		})
	}

	c.JSON(http.StatusOK, response)
}

// GetInscripcionesByActividad obtiene todas las inscripciones de una actividad específica
func (h *InscripcionHandler) GetInscripcionesByActividad(c *gin.Context) {
	log.Printf("Recibida petición GET a /inscripciones/actividad/:actividadId")

	actividadIDStr := c.Param("actividadId")
	actividadID, err := strconv.ParseUint(actividadIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de actividad inválido"})
		return
	}

	// Verificar que la actividad existe
	var actividad models.Actividad
	if err := h.db.First(&actividad, actividadID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}

	var inscripciones []models.Inscripcion
	if err := h.db.Preload("Usuario").Where("actividad_id = ?", actividadID).Find(&inscripciones).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las inscripciones"})
		return
	}

	var response []dtos.InscripcionResponseDTO
	for _, i := range inscripciones {
		response = append(response, dtos.InscripcionResponseDTO{
			ID:               i.ID,
			UsuarioID:        i.UsuarioID,
			ActividadID:      i.ActividadID,
			FechaInscripcion: i.FechaInscripcion,
			Usuario:          &i.Usuario,
		})
	}

	c.JSON(http.StatusOK, response)
}

// GetAllInscripciones obtiene todas las inscripciones (solo admin)
func (h *InscripcionHandler) GetAllInscripciones(c *gin.Context) {
	log.Printf("Recibida petición GET a /inscripciones/all")

	var inscripciones []models.Inscripcion
	if err := h.db.Preload("Usuario").Preload("Actividad").Find(&inscripciones).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las inscripciones"})
		return
	}

	var response []dtos.InscripcionResponseDTO
	for _, i := range inscripciones {
		response = append(response, dtos.InscripcionResponseDTO{
			ID:               i.ID,
			UsuarioID:        i.UsuarioID,
			ActividadID:      i.ActividadID,
			FechaInscripcion: i.FechaInscripcion,
			Usuario:          &i.Usuario,
			Actividad:        &i.Actividad,
		})
	}

	c.JSON(http.StatusOK, response)
}

// GetInscripcionByID obtiene una inscripción específica
func (h *InscripcionHandler) GetInscripcionByID(c *gin.Context) {
	log.Printf("Recibida petición GET a /inscripciones/:inscripcionId")

	inscripcionIDStr := c.Param("inscripcionId")
	inscripcionID, err := strconv.ParseUint(inscripcionIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de inscripción inválido"})
		return
	}

	// Obtener el ID del usuario del token JWT
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No se pudo obtener la información del usuario"})
		return
	}

	userID := uint(claims.(jwt.MapClaims)["user_id"].(float64))
	roleID := uint(claims.(jwt.MapClaims)["role_id"].(float64))

	var inscripcion models.Inscripcion
	if err := h.db.Preload("Usuario").Preload("Actividad").First(&inscripcion, inscripcionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inscripción no encontrada"})
		return
	}

	// Verificar que el usuario es el dueño de la inscripción o es admin
	if inscripcion.UsuarioID != userID && roleID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes permiso para ver esta inscripción"})
		return
	}

	c.JSON(http.StatusOK, dtos.InscripcionResponseDTO{
		ID:               inscripcion.ID,
		UsuarioID:        inscripcion.UsuarioID,
		ActividadID:      inscripcion.ActividadID,
		FechaInscripcion: inscripcion.FechaInscripcion,
		Usuario:          &inscripcion.Usuario,
		Actividad:        &inscripcion.Actividad,
	})
}

// CancelarInscripcion cancela una inscripción
func (h *InscripcionHandler) CancelarInscripcion(c *gin.Context) {
	log.Printf("Recibida petición DELETE a /inscripciones/:inscripcionId")

	inscripcionIDStr := c.Param("inscripcionId")
	inscripcionID, err := strconv.ParseUint(inscripcionIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de inscripción inválido"})
		return
	}

	// Obtener el ID del usuario del token JWT
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No se pudo obtener la información del usuario"})
		return
	}

	userID := uint(claims.(jwt.MapClaims)["user_id"].(float64))
	roleID := uint(claims.(jwt.MapClaims)["role_id"].(float64))

	// Verificar que la inscripción existe y pertenece al usuario o es admin
	var inscripcion models.Inscripcion
	if err := h.db.First(&inscripcion, inscripcionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inscripción no encontrada"})
		return
	}

	if inscripcion.UsuarioID != userID && roleID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes permiso para cancelar esta inscripción"})
		return
	}

	// Eliminar la inscripción
	if err := h.db.Delete(&inscripcion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al cancelar la inscripción"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Inscripción cancelada exitosamente"})
}
