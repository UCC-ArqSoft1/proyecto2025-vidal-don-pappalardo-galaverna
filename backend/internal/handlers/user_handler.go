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
