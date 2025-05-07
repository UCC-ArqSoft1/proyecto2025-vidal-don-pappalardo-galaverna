package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/proyecto2025/backend/internal/handlers"
)

// Configura las rutas relacionadas con la autenticación
func ConfigurarRutasAuth(r *gin.Engine, authHandler *handlers.AuthHandler) {
    // Rutas relacionadas con la autenticación
    r.POST("/login", authHandler.Login)
    r.POST("/refresh-token", authHandler.RefreshToken)
}
