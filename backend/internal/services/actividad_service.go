package services

import (
	"errors"
	"time"

	"github.com/proyecto2025/backend/internal/dtos"
	"github.com/proyecto2025/backend/internal/models"
	"gorm.io/gorm"
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
		Horario:     actividadDTO.Horario,
		Duracion:    actividadDTO.Duracion,
		Cupo:        actividadDTO.Cupo,
		Categoria:   actividadDTO.Categoria,
		ImagenURL:   actividadDTO.ImagenURL,
		Active:      actividadDTO.Active,
		ProfesorID:  actividadDTO.ProfesorID,
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

func (s *ActividadService) UpdateActividad(id uint, actividadDTO dtos.ActividadDTO) (models.Actividad, error) {
	var actividad models.Actividad

	// Buscar incluso si fue borrada lógicamente
	if err := s.DB.Unscoped().First(&actividad, id).Error; err != nil {
		return models.Actividad{}, errors.New("Actividad no encontrada")
	}
	if actividadDTO.ProfesorID != 0 {
		actividad.ProfesorID = actividadDTO.ProfesorID
	}

	// Verificar si fue borrada lógicamente
	if actividad.DeletedAt.Valid {
		return models.Actividad{}, errors.New("No se puede modificar una actividad que fue borrada")
	}

	// Actualizamos solo los campos provistos
	if actividadDTO.Titulo != "" {
		actividad.Titulo = actividadDTO.Titulo
	}
	if actividadDTO.Descripcion != "" {
		actividad.Descripcion = actividadDTO.Descripcion
	}
	if actividadDTO.Dia != "" {
		actividad.Dia = actividadDTO.Dia
	}
	if !actividadDTO.Horario.IsZero() {
		actividad.Horario = actividadDTO.Horario
	}
	if actividadDTO.Duracion > 0 {
		actividad.Duracion = actividadDTO.Duracion
	}
	if actividadDTO.Cupo > 0 {
		actividad.Cupo = actividadDTO.Cupo
	}
	if actividadDTO.Categoria != "" {
		actividad.Categoria = actividadDTO.Categoria
	}
	if actividadDTO.ImagenURL != "" {
		actividad.ImagenURL = actividadDTO.ImagenURL
	}

	actividad.Active = actividadDTO.Active

	// Guardar en la base de datos
	if err := s.DB.Save(&actividad).Error; err != nil {
		return models.Actividad{}, err
	}

	return actividad, nil
}
