package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/proyecto2025/backend/internal/models"

	"github.com/joho/godotenv"
)

var DB *gorm.DB

// intenta conectarse varias veces a la base de datos
func tryConnect(dsn string, maxRetries int) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	for i := 1; i <= maxRetries; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			DisableForeignKeyConstraintWhenMigrating: true,
			PrepareStmt:                              true,
		})
		if err == nil {
			log.Println("✅ Conexión a base de datos exitosa")
			return db, nil
		}

		log.Printf("⚠️  Intento %d/%d fallido: %v. Reintentando en 3 segundos...", i, maxRetries, err)
		time.Sleep(3 * time.Second)
	}

	return nil, fmt.Errorf("❌ Falló la conexión a la base de datos después de %d intentos: %w", maxRetries, err)
}

// initRoles crea los roles básicos si no existen
func initRoles(db *gorm.DB) error {
	roles := []models.Role{
		{
			Nombre:      "admin",
			Descripcion: "Administrador del sistema",
		},
		{
			Nombre:      "instructor",
			Descripcion: "Instructor de actividades",
		},
	}

	for _, role := range roles {
		var existingRole models.Role
		result := db.Where("nombre = ?", role.Nombre).First(&existingRole)
		if result.Error != nil {
			if err := db.Create(&role).Error; err != nil {
				return fmt.Errorf("error al crear rol %s: %v", role.Nombre, err)
			}
			log.Printf("✅ Rol %s creado", role.Nombre)
		}
	}

	return nil
}

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("🔍 No se encontró archivo .env, se usarán variables de entorno del sistema")
	}

	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		user, pass, host, port, name)

	database, err := tryConnect(dsn, 10) // hasta 10 intentos
	if err != nil {
		log.Fatalf("❌ Error al conectar con la base de datos: %v", err)
	}

	DB = database

	err = DB.AutoMigrate(
		&models.Usuario{},
		&models.Role{},
		&models.Actividad{},
		&models.Inscripcion{},
		&models.RefreshToken{},
	)
	if err != nil {
		log.Fatalf("❌ AutoMigrate falló: %v", err)
	}

	// Inicializar roles básicos
	if err := initRoles(DB); err != nil {
		log.Fatalf("❌ Error al inicializar roles: %v", err)
	}

	log.Println("✅ Base de datos conectada y migrada")
}
