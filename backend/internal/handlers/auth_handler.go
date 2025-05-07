// internal/handlers/auth_handler.go
package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/proyecto2025/backend/internal/dtos"
	"github.com/proyecto2025/backend/internal/models"
	"github.com/proyecto2025/backend/internal/services"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

)

// A revisar: Problema de separacion de logica, se deberia crear un repository o servicio para
// interactuar con la base de datos
type AuthHandler struct {
	db          *gorm.DB
	validator   *validator.Validate
	secretKey   string
	authService *services.AuthService
}



func NewAuthHandler(db *gorm.DB, v *validator.Validate, secretKey string) *AuthHandler {
	return &AuthHandler{
		db:          db,
		validator:   v,
		secretKey:   secretKey,
		authService: services.NewAuthService(db),
	}
}
func (h *AuthHandler) Login(c *gin.Context) {
	var loginDTO dtos.LoginDTO

	if err := c.ShouldBindJSON(&loginDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var usuario models.Usuario
	if err := h.db.Where("email = ?", loginDTO.Email).First(&usuario).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "credenciales inválidas"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(usuario.PasswordHash), []byte(loginDTO.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "credenciales inválidas"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": usuario.ID,
		"email":   usuario.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token válido por 24h
	})

	tokenString, err := token.SignedString([]byte(h.secretKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo generar el token"})
		return
	}
	refreshToken, err := h.authService.CrearRefreshToken(usuario.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo generar el refresh token"})
		return
	}

	c.SetCookie("refresh_token", refreshToken, 3600*24*7, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{
		"access_token":  tokenString,
		"refresh_token": refreshToken,
	})
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "refresh token requerido"})
		return
	}

	usuario, err := h.authService.ValidarYRenovarRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": usuario.ID,
		"email":   usuario.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenStr, err := newToken.SignedString([]byte(h.secretKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo generar el token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenStr})

}


func (h *AuthHandler) Register(c *gin.Context) {
	var usuarioDTO dtos.UsuarioDTO

	// Bind the incoming JSON body to the UsuarioDTO struct
	if err := c.ShouldBindJSON(&usuarioDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate the struct with the validator
	if err := h.validator.Struct(usuarioDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the email already exists
	var existingUser models.Usuario
	if err := h.db.Where("email = ?", usuarioDTO.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "el correo electrónico ya está registrado"})
		return
	}

	// Hash the password before saving it
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(usuarioDTO.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo hashear la contraseña"})
		return
	}

	// Create the user model from the DTO
	usuario := models.Usuario{
		Nombre:       usuarioDTO.Nombre,
		Apellido:     usuarioDTO.Apellido,
		Email:        usuarioDTO.Email,
		PasswordHash: string(hashedPassword),
		Active:       usuarioDTO.Active,
		RoleID:       usuarioDTO.RoleID,
	}

	// Call the AuthService to register the user
	nuevoUsuario, err := h.authService.Register(usuario)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Respond with the newly created user
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
