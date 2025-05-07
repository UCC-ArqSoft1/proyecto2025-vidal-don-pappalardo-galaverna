package main

import (
    "github.com/gin-gonic/gin"
    "github.com/proyecto2025/backend/internal/db"
    "github.com/proyecto2025/backend/internal/handlers"
    "github.com/proyecto2025/backend/internal/routes"
	"github.com/go-playground/validator/v10"
)

func main() {
    db.InitDB()


    // Inicializamos los handlers
    authHandler := handlers.NewAuthHandler(db.DB, validator.New(), "mi_clave_secreta_super_segura")
    actividadHandler := handlers.NewActividadHandler(db.DB)

    // Creamos el router Gin
    r := gin.Default()

    // Configuramos las rutas de autenticación
    routes.ConfigurarRutasAuth(r, authHandler)

    // Configuramos las rutas de actividades
    routes.ConfigurarRutasActividad(r, actividadHandler)

    // Iniciamos el servidor
    r.Run(":8080")
	
}
