package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/handlers"
	"github.com/proyecto2025/backend/internal/middlewares"
)

func ConfigurarRutasInscripcion(r *gin.Engine, handler *handlers.InscripcionHandler) {
	// Rutas protegidas con JWT
	inscripciones := r.Group("/inscripciones")
	{
		// Obtener inscripciones del usuario autenticado (más específica)
		inscripciones.GET("/usuarios/me", middlewares.IsAuthenticated(), handler.GetInscripcionesByUsuario)

		// Obtener inscripciones de una actividad específica (más específica)
		inscripciones.GET("/actividad/:actividadId", middlewares.IsAuthenticated(), handler.GetInscripcionesByActividad)

		// Obtener todas las inscripciones (solo admin)
		inscripciones.GET("/all", middlewares.IsAuthenticated(), middlewares.IsAdmin(), handler.GetAllInscripciones)

		// Inscribirse a una actividad
		inscripciones.POST("/:actividadId", middlewares.IsAuthenticated(), handler.CrearInscripcion)

		// Obtener una inscripción específica (más genérica)
		inscripciones.GET("/:inscripcionId", middlewares.IsAuthenticated(), handler.GetInscripcionByID)

		// Cancelar una inscripción (más genérica)
		inscripciones.DELETE("/:inscripcionId", middlewares.IsAuthenticated(), handler.CancelarInscripcion)
	}
}
