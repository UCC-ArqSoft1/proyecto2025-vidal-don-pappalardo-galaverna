package services

import (
	"github.com/proyecto2025/backend/internal/dtos"
	"github.com/proyecto2025/backend/internal/models"
	"gorm.io/gorm"
	"time"
	
)

type ActividadService struct {
	DB *gorm.DB
}


// El servicio que devuelve todas las actividades
func (s *ActividadService) GetAll() ([]models.Actividad, error) {
    var actividades []models.Actividad
    if err := s.DB.Where("active = ?", true).Find(&actividades).Error; err != nil {
        return nil, err
    }
    return actividades, nil
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

// El servicio que elimina una actividad (borrado lógico)
func (s *ActividadService) DeleteActividad(id uint) error {
    var actividad models.Actividad

    // Buscar la actividad por ID
    if err := s.DB.First(&actividad, id).Error; err != nil {
        return err // Si no se encuentra, devuelve el error
    }

    // Si la actividad ya está desactivada (borrada lógicamente)
    if !actividad.Active {
        return nil // Si ya está borrada, no hacemos nada y devolvemos nil (borrado lógico)
    }

    // Actualizamos los campos de borrado lógico
    actividad.Active = false
    actividad.DeletedAt = gorm.DeletedAt{Time: time.Now(), Valid: true}

    // Guardamos la actividad con los cambios
    if err := s.DB.Save(&actividad).Error; err != nil {
        return err // Si hay algún error al guardar, lo devolvemos
    }

    return nil // Todo salió bien
}
