package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/handlers"
	"github.com/proyecto2025/backend/internal/middlewares"
)

func ConfigurarRutasInscripcion(r *gin.Engine, handler *handlers.InscripcionHandler) {
	// Rutas protegidas con JWT
	r.POST("/actividades/:id/inscribirse", middlewares.IsAuthenticated(), handler.CrearInscripcion)
	r.GET("/inscripciones", middlewares.IsAuthenticated(), handler.GetInscripcionesByUsuario)
	r.DELETE("/inscripciones/:id", middlewares.IsAuthenticated(), handler.CancelarInscripcion)
}
