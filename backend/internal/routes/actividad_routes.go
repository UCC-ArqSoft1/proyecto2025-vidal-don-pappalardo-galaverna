package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/proyecto2025/backend/internal/handlers"
	"github.com/proyecto2025/backend/internal/middlewares"
)

func ConfigurarRutasActividad(r *gin.Engine, handler *handlers.ActividadHandler) {
	
	//rutas protegidas con JWT

	r.GET("/actividades", middlewares.IsAuthenticated(), handler.GetAll)
	r.GET("/actividades/:id", middlewares.IsAuthenticated(), handler.GetByID)
	r.POST("/actividades", middlewares.IsAuthenticated(), middlewares.IsAdmin(), handler.CrearActividad)
	r.DELETE("/actividades/:id", middlewares.IsAuthenticated(), middlewares.IsAdmin(), handler.DeleteActividad)
	r.PATCH("/actividades/:id", middlewares.IsAuthenticated(), middlewares.IsAdmin(), handler.UpdateActividad)

}
