package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/proyecto2025/backend/internal/db"
	"github.com/proyecto2025/backend/internal/handlers"
	"github.com/proyecto2025/backend/internal/services"
)

func main() {
	log.Println("Iniciando servidor Terapia-as-a-Service...")

	// 1. Inicializar la base de datos
	db.InitDB()

	// 2. Crear instancia del validador
	validate := validator.New()

	// 3. Crear instancia del servicio de usuario
	userService := services.NewUsuarioService(db.DB)

	// 4. Crear handler con el servicio y el validador
	userHandler := handlers.NewUsuarioHandler(userService, validate)

	// 5. Crear router y configurar rutas
	r := gin.Default()
	handlers.ConfigurarRutasUsuario(r, userHandler)

	// 6. Ejecutar el servidor
	r.Run(":8080")
}
