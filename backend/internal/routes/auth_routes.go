package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/proyecto2025/backend/internal/handlers"
)

// Configura las rutas relacionadas con la autenticación
func ConfigurarRutasAuth(r *gin.Engine, authHandler *handlers.AuthHandler) {
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/login", authHandler.Login)
		authGroup.POST("/refresh-token", authHandler.RefreshToken)
		authGroup.POST("/register", authHandler.Register)
        r.POST("/auth/logout", authHandler.Logout)
	}
}
//hola 