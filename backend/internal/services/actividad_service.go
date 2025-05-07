package services

import (

	"github.com/proyecto2025/backend/internal/models"
	"gorm.io/gorm"
)

type ActividadService struct {
	DB *gorm.DB
}

func NewActividadService(db *gorm.DB) *ActividadService {
	return &ActividadService{DB: db}
}

func (s *ActividadService) ListarActividades() ([]models.Actividad, error) {
	var actividades []models.Actividad
	if err := s.DB.Find(&actividades).Error; err != nil {
		return nil, err
	}
	return actividades, nil
}
