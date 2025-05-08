package services

import (
	"github.com/proyecto2025/backend/internal/dtos"
	"github.com/proyecto2025/backend/internal/models"
	"gorm.io/gorm"
)

type ActividadService struct {
	DB *gorm.DB
}

func (s *ActividadService) CrearActividad(actividadDTO dtos.ActividadDTO) (*models.Actividad, error) {
	// Aquí debes convertir el DTO a un modelo de actividad
	actividad := models.Actividad{
		Titulo:      actividadDTO.Titulo,
		Descripcion: actividadDTO.Descripcion,
		Dia:         actividadDTO.Dia,
		Horario:     actividadDTO.Horario, // Ya es tipo `time.Time`
		Duracion:    actividadDTO.Duracion,
		Cupo:        actividadDTO.Cupo,
		Categoria:   actividadDTO.Categoria,
		ImagenURL:   actividadDTO.ImagenURL,
		Active:      actividadDTO.Active,
	}

	if err := s.DB.Create(&actividad).Error; err != nil {
		return nil, err
	}

	return &actividad, nil
}
