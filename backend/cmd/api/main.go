package main

import (
	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/db"
	"github.com/proyecto2025/backend/internal/handlers"
	"github.com/proyecto2025/backend/internal/routes"
	"github.com/proyecto2025/backend/internal/services"
	"github.com/go-playground/validator/v10"

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
