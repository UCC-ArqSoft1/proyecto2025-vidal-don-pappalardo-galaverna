package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/proyecto2025/backend/internal/models"

	"github.com/joho/godotenv"
)

var DB *gorm.DB

func InitDB() {

	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system env")
	}

	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		user, pass, host, port, name)

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
		PrepareStmt:                              true,
	})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	DB = database

	err = DB.AutoMigrate(
		&models.Usuario{},
		&models.Role{},
		&models.Actividad{},
		&models.Inscripcion{},
	)
	if err != nil {
		log.Fatalf("Auto migration failed: %v", err)
	}

	log.Println("Database connected and migrated")
}
