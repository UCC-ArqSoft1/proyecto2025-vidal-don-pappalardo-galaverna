package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/proyecto2025/backend/internal/db"
	"github.com/proyecto2025/backend/internal/handlers"
	"github.com/proyecto2025/backend/internal/routes"
	"github.com/proyecto2025/backend/internal/services"
)

func main() {
	// Iniciar base de datos
	db.InitDB()

	// Crear el servicio de actividad
	actividadService := &services.ActividadService{DB: db.DB}

	// Crear el validador
	validate := validator.New()

	// Inicializar los handlers
	authHandler := handlers.NewAuthHandler(db.DB, validate, "mi_clave_secreta_super_segura")
	actividadHandler := handlers.NewActividadHandler(db.DB, validate, actividadService)

	// Crear el router Gin
	r := gin.Default()

	// Configurar CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60, // 12 hours
	}))

	// Configurar rutas de autenticación
	routes.ConfigurarRutasAuth(r, authHandler)

	// Configurar rutas de actividades
	routes.ConfigurarRutasActividad(r, actividadHandler)

	// ----------------------
	// SWAGGER CONFIGURACIÓN
	// ----------------------

	// Servir los archivos de Swagger UI desde /docs/
	r.Static("/docs", "./static/swagger-ui/dist")

	// Servir el archivo swagger.json
	r.GET("/swagger.json", func(c *gin.Context) {
		c.File("./swagger/swagger.json")
	})

	// ----------------------

	r.Run(":8080")
}
