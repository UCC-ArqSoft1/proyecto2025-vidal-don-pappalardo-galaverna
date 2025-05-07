// internal/middlewares/auth_middleware.go
package middlewares

import (
	"net/http"
	"strings"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// ValidarJWT es un middleware que valida el JWT
func ValidarJWT(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtener el token del encabezado Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token no proporcionado"})
			c.Abort()
			return
		}

		// Eliminar el prefijo "Bearer " del encabezado
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token mal formado"})
			c.Abort()
			return
		}

		// Parsear y validar el token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Verificar que el método de firma sea el esperado
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("método de firma inválido")
			}
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido o expirado"})
			c.Abort()
			return
		}

		// Si el token es válido, extraemos los claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			c.Abort()
			return
		}

		// Guardar los datos del usuario en el contexto
		userID := claims["user_id"].(float64) // Convierte a int o uint según tu modelo
		userEmail := claims["email"].(string)

		// Puedes usar estos valores más tarde si los necesitas
		c.Set("user_id", userID)
		c.Set("user_email", userEmail)

		// Deja pasar la solicitud al siguiente manejador
		c.Next()
	}
}
