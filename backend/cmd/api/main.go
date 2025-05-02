package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/db"
)

// @title TaaS API
// @version 1.0
// @description API de Terapia-as-a-Service para manejo de usuarios, conductores, pasajeros y vehículos.
// @host localhost:8080
// @BasePath /api
func main() {
	log.Println("Iniciando servidor Terapia-as-a-Service...")

	db.InitDB()

	r := gin.Default()

	r.Run(":8080")
}
