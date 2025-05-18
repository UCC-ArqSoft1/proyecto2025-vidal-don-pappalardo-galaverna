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
		// Inscribirse a una actividad
		inscripciones.POST("/:actividadId", middlewares.IsAuthenticated(), handler.CrearInscripcion)

		// Obtener inscripciones de una actividad específica
		inscripciones.GET("/actividad/:actividadId", middlewares.IsAuthenticated(), handler.GetInscripcionesByActividad)

		// Obtener inscripciones del usuario autenticado
		inscripciones.GET("/usuarios/me", middlewares.IsAuthenticated(), handler.GetInscripcionesByUsuario)

		// Obtener todas las inscripciones (solo admin)
		inscripciones.GET("/all", middlewares.IsAuthenticated(), middlewares.IsAdmin(), handler.GetAllInscripciones)

		// Obtener una inscripción específica
		inscripciones.GET("/:inscripcionId", middlewares.IsAuthenticated(), handler.GetInscripcionByID)

		// Cancelar una inscripción
		inscripciones.DELETE("/:inscripcionId", middlewares.IsAuthenticated(), handler.CancelarInscripcion)
	}
}
