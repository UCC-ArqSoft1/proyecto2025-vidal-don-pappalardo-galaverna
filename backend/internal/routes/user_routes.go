package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/handlers"
	"github.com/proyecto2025/backend/internal/middlewares"
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
