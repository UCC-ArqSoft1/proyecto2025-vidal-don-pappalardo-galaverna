package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/proyecto2025/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserHandler struct {
	db       *gorm.DB
	validate *validator.Validate
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{
		db:       db,
		validate: validator.New(),
	}
}

// GetInstructors obtiene todos los usuarios con rol de instructor
func (h *UserHandler) GetInstructors(c *gin.Context) {
	var instructors []models.Usuario

	// Buscar usuarios con rol "instructor" usando las relaciones
	result := h.db.Preload("Role").
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

	// Mapear a una respuesta más simple
	var response []gin.H
	for _, instructor := range instructors {
		response = append(response, gin.H{
			"id":       instructor.ID,
			"nombre":   instructor.Nombre,
			"apellido": instructor.Apellido,
			"email":    instructor.Email,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"data": response,
	})
}

// CreateInstructor crea un nuevo usuario con rol de instructor
func (h *UserHandler) CreateInstructor(c *gin.Context) {
	var instructorDTO struct {
		Nombre   string `json:"nombre" binding:"required"`
		Apellido string `json:"apellido" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&instructorDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validar el DTO
	if err := h.validate.Struct(instructorDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificar si el email ya existe
	var existingUser models.Usuario
	if err := h.db.Where("email = ?", instructorDTO.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El correo electrónico ya está registrado"})
		return
	}

	// Obtener el ID del rol de instructor
	var instructorRole models.Role
	if err := h.db.Where("nombre = ?", "instructor").First(&instructorRole).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener el rol de instructor"})
		return
	}

	// Hashear la contraseña
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(instructorDTO.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al hashear la contraseña"})
		return
	}

	// Crear el nuevo instructor
	instructor := models.Usuario{
		Nombre:       instructorDTO.Nombre,
		Apellido:     instructorDTO.Apellido,
		Email:        instructorDTO.Email,
		PasswordHash: string(hashedPassword),
		RoleID:       instructorRole.ID,
		Active:       true,
	}

	if err := h.db.Create(&instructor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el instructor"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Instructor creado exitosamente",
		"data": gin.H{
			"id":       instructor.ID,
			"nombre":   instructor.Nombre,
			"apellido": instructor.Apellido,
			"email":    instructor.Email,
			"role_id":  instructor.RoleID,
			"active":   instructor.Active,
		},
	})
}

// GetInstructorDetails obtiene los detalles de un instructor específico y sus actividades
func (h *UserHandler) GetInstructorDetails(c *gin.Context) {
	id := c.Param("id")
	var instructor models.Usuario

	// Buscar el instructor y sus actividades usando las relaciones
	result := h.db.Preload("Role").
		Preload("Actividades", "active = ?", true).
		Joins("JOIN roles ON usuarios.role_id = roles.id").
		Where("usuarios.id = ? AND roles.nombre = ?", id, "instructor").
		First(&instructor)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Instructor no encontrado",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"instructor": gin.H{
				"id":       instructor.ID,
				"nombre":   instructor.Nombre,
				"apellido": instructor.Apellido,
				"email":    instructor.Email,
			},
			"activities": instructor.Actividades,
		},
	})
}

// DeleteInstructor elimina un instructor (borrado lógico)
func (h *UserHandler) DeleteInstructor(c *gin.Context) {
	id := c.Param("id")

	// Iniciar transacción
	tx := h.db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al iniciar la transacción"})
		return
	}

	// Buscar el instructor y verificar que es instructor
	var instructor models.Usuario
	if err := tx.Preload("Role").
		Preload("Actividades").
		Where("id = ?", id).
		First(&instructor).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Instructor no encontrado"})
		return
	}

	if instructor.Role.Nombre != "instructor" {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "El usuario no es un instructor"})
		return
	}

	// Verificar si tiene actividades asignadas
	if len(instructor.Actividades) > 0 {
		tx.Rollback()
		c.JSON(http.StatusConflict, gin.H{
			"error": "No se puede eliminar el instructor porque tiene actividades asignadas",
		})
		return
	}

	// Realizar borrado lógico
	instructor.Active = false
	if err := tx.Save(&instructor).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el instructor"})
		return
	}

	// Confirmar la transacción
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al confirmar la transacción"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Instructor eliminado exitosamente",
	})
}
