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

	// Inicializar los handlers
	authHandler := handlers.NewAuthHandler(db.DB, validator.New(), "mi_clave_secreta_super_segura")
	actividadHandler := handlers.NewActividadHandler(db.DB, actividadService)

	// Crear el router Gin
	r := gin.Default()

	// Configurar rutas de autenticación
	routes.ConfigurarRutasAuth(r, authHandler)

	// Configurar rutas de actividades
	routes.ConfigurarRutasActividad(r, actividadHandler)

	// Iniciar el servidor en el puerto 8080
	r.Run(":8080")
}
