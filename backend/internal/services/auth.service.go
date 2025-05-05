package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/proyecto2025/backend/internal/models"
	"gorm.io/gorm"
)

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

func (s *AuthService) CrearRefreshToken(userID uint) (string, error) {
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		return "", err
	}
	token := hex.EncodeToString(tokenBytes)

	refresh := models.RefreshToken{
		Token:     token,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	if err := s.db.Create(&refresh).Error; err != nil {
		return "", err
	}

	return token, nil
}

func (s *AuthService) ValidarYRenovarRefreshToken(token string) (models.Usuario, error) {
	var refresh models.RefreshToken
	if err := s.db.Where("token = ?", token).First(&refresh).Error; err != nil {
		return models.Usuario{}, errors.New("token inválido")
	}

	if time.Now().After(refresh.ExpiresAt) {
		return models.Usuario{}, errors.New("token expirado")
	}

	var usuario models.Usuario
	if err := s.db.First(&usuario, refresh.UserID).Error; err != nil {
		return models.Usuario{}, errors.New("usuario no encontrado")
	}

	return usuario, nil
}
