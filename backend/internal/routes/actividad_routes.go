package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/handlers"
)

func ConfigurarRutasActividad(r *gin.Engine, handler *handlers.ActividadHandler) {
	// Definimos la ruta para obtener todas las actividades
	r.GET("/actividades", handler.GetAll)
	r.GET("/actividades/:id", handler.GetByID)

}
