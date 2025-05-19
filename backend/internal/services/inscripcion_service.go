package services

import (
	"github.com/proyecto2025/backend/internal/models"
	"gorm.io/gorm"
)

type InscripcionService struct {
	db *gorm.DB
}

func NewInscripcionService(db *gorm.DB) *InscripcionService {
	return &InscripcionService{
		db: db,
	}
}

// VerificarCupoDisponible verifica si hay cupo disponible para una actividad
func (s *InscripcionService) VerificarCupoDisponible(actividadID uint) (bool, error) {
	var actividad models.Actividad
	if err := s.db.First(&actividad, actividadID).Error; err != nil {
		return false, err
	}

	var inscripcionesCount int64
	if err := s.db.Model(&models.Inscripcion{}).Where("actividad_id = ?", actividadID).Count(&inscripcionesCount).Error; err != nil {
		return false, err
	}

	return inscripcionesCount < int64(actividad.Cupo), nil
}

// VerificarInscripcionExistente verifica si un usuario ya está inscrito en una actividad
func (s *InscripcionService) VerificarInscripcionExistente(usuarioID, actividadID uint) (bool, error) {
	var count int64
	if err := s.db.Model(&models.Inscripcion{}).Where("usuario_id = ? AND actividad_id = ?", usuarioID, actividadID).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
