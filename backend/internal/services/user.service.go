package services

import (
	"errors"
	"log"

	"github.com/proyecto2025/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService interface {
	CrearUsuario(usuario models.Usuario) (models.Usuario, error)
}

type usuarioService struct {
	db *gorm.DB
}

func NewUsuarioService(db *gorm.DB) UserService {
	return &usuarioService{
		db: db,
	}
}

func (s *usuarioService) CrearUsuario(usuario models.Usuario) (models.Usuario, error) {

	if usuario.Nombre == "" || usuario.Email == "" || usuario.PasswordHash == "" {
		return models.Usuario{}, errors.New("nombre, email y contraseña son campos obligatorios")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(usuario.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error al hashear la contraseña: %v", err)
		return models.Usuario{}, errors.New("error al hashear la contraseña")
	}
	usuario.PasswordHash = string(hashedPassword)

	result := s.db.Create(&usuario)
	if result.Error != nil {
		log.Printf("Error al crear el usuario en la base de datos: %v", result.Error)
		return models.Usuario{}, errors.New("error al crear el usuario en la base de datos")
	}

	return usuario, nil
}
