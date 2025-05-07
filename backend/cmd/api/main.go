package main

import (
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/proyecto2025/backend/internal/db"
	"github.com/proyecto2025/backend/internal/handlers"
	"github.com/proyecto2025/backend/internal/services"
)

func main() {

	db.InitDB()

	validate := validator.New()

	userService := services.NewUsuarioService(db.DB)
	userHandler := handlers.NewUsuarioHandler(userService, validate)

	secretKey := "mi_clave_secreta_super_segura"
	authHandler := handlers.NewAuthHandler(db.DB, validate, secretKey)

	r := gin.Default()

	handlers.ConfigurarRutasUsuario(r, userHandler)

	// Falta hacer: crear un grupo de rutas para las rutas de autenticación en el handler de auth
	r.POST("/login", authHandler.Login)
	r.POST("/refresh-token", authHandler.RefreshToken)

	r.Run(":8080")
	// r.Run(":8080") // Inicia el servidor en el puerto 8080
}
