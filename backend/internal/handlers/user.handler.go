package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/proyecto2025/backend/internal/dtos"
	"github.com/proyecto2025/backend/internal/models"
	"github.com/proyecto2025/backend/internal/services"
)

type UsuarioHandler struct {
	usuarioService services.UserService
	validator      *validator.Validate
}

func NewUsuarioHandler(usuarioService services.UserService, validator *validator.Validate) *UsuarioHandler {
	return &UsuarioHandler{
		usuarioService: usuarioService,
		validator:      validator,
	}
}

func (h *UsuarioHandler) CrearUsuario(c *gin.Context) {

	var usuarioDTO dtos.UsuarioDTO

	if err := c.ShouldBindJSON(&usuarioDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.validator.Struct(usuarioDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usuario := models.Usuario{
		Nombre:       usuarioDTO.Nombre,
		Apellido:     usuarioDTO.Apellido,
		Email:        usuarioDTO.Email,
		PasswordHash: usuarioDTO.PasswordHash,
		Active:       usuarioDTO.Active,
		RoleID:       usuarioDTO.RoleID,
	}

	nuevoUsuario, err := h.usuarioService.CrearUsuario(usuario)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // Devuelve el error del servicio
		return
	}

	// 6. Devolver el usuario creado (sin la contraseña hasheada)
	c.JSON(http.StatusCreated, gin.H{
		"id":         nuevoUsuario.ID,
		"nombre":     nuevoUsuario.Nombre,
		"apellido":   nuevoUsuario.Apellido,
		"email":      nuevoUsuario.Email,
		"active":     nuevoUsuario.Active,
		"role_id":    nuevoUsuario.RoleID,
		"created_at": nuevoUsuario.CreatedAt,
	})
}

func ConfigurarRutasUsuario(router *gin.Engine, usuarioHandler *UsuarioHandler) {

	usuariosGroup := router.Group("/usuarios")
	{
		usuariosGroup.POST("/", usuarioHandler.CrearUsuario)
	}
}
