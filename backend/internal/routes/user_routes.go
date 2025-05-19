package routes

import (
	"proyecto2025-vidal-don-pappalardo-galaverna/internal/handlers"
	"proyecto2025-vidal-don-pappalardo-galaverna/internal/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupUserRoutes(r *gin.Engine, db *gorm.DB) {
	userHandler := handlers.NewUserHandler(db)

	// Rutas públicas
	r.GET("/usuarios/instructores", userHandler.GetInstructors)

	// Rutas protegidas
	userRoutes := r.Group("/usuarios")
	userRoutes.Use(middlewares.IsAuthenticated())
	{
		// Aquí irían otras rutas de usuarios protegidas
	}
}
