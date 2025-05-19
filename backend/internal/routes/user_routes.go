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
	r.GET("/usuarios/instructores/:id", userHandler.GetInstructorDetails)

	// Rutas protegidas
	userRoutes := r.Group("/usuarios")
	userRoutes.Use(middlewares.IsAuthenticated())
	{
		// Rutas que requieren rol de admin
		adminRoutes := userRoutes.Group("")
		adminRoutes.Use(middlewares.IsAdmin())
		{
			adminRoutes.POST("/instructores", userHandler.CreateInstructor)
			adminRoutes.DELETE("/instructores/:id", userHandler.DeleteInstructor)
		}
	}
}
