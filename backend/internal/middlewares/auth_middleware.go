package middlewares

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("mi_clave_secreta_super_segura")

func IsAuthenticated() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("Middleware de autenticación: Verificando token para ruta %s", c.Request.URL.Path)

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			log.Printf("Middleware de autenticación: Falta el header Authorization")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Falta el token"})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		log.Printf("Middleware de autenticación: Token recibido: %s", tokenStr)

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				log.Printf("Middleware de autenticación: Método de firma inválido")
				return nil, jwt.ErrSignatureInvalid
			}
			return jwtSecret, nil
		})

		if err != nil {
			log.Printf("Middleware de autenticación: Error al parsear token: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			c.Abort()
			return
		}

		if !token.Valid {
			log.Printf("Middleware de autenticación: Token no válido")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			c.Abort()
			return
		}

		// Guardar los claims en el contexto
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			log.Printf("Middleware de autenticación: Token válido, claims: %+v", claims)
			c.Set("claims", claims)
		} else {
			log.Printf("Middleware de autenticación: No se pudieron obtener los claims")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			c.Abort()
			return
		}

		c.Next()
	}
}
