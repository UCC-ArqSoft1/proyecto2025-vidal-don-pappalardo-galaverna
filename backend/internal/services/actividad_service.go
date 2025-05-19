package services

import (
	"errors"
	"fmt"
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
	// Convertir la imagen base64 a bytes
	imagenData, imagenType, err := dtos.Base64ToImage(actividadDTO.ImagenData)
	if err != nil {
		return nil, fmt.Errorf("error al procesar la imagen: %v", err)
	}

	// Convertir el string de hora a time.Time
	horario, err := dtos.ParseTimeString(actividadDTO.Horario)
	if err != nil {
		return nil, fmt.Errorf("error al procesar el horario: %v", err)
	}

	// Crear el modelo de actividad
	actividad := models.Actividad{
		Titulo:      actividadDTO.Titulo,
		Descripcion: actividadDTO.Descripcion,
		Dia:         actividadDTO.Dia,
		Horario:     horario,
		Duracion:    actividadDTO.Duracion,
		Cupo:        actividadDTO.Cupo,
		Categoria:   actividadDTO.Categoria,
		ImagenData:  imagenData,
		ImagenType:  imagenType,
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

func (s *ActividadService) UpdateActividad(id uint, actividadDTO dtos.ActividadDTO) (*models.Actividad, error) {
	var actividad models.Actividad
	if err := s.DB.First(&actividad, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.New("actividad no encontrada")
		}
		return nil, err
	}

	// Si la actividad está eliminada lógicamente, no permitir actualización
	if !actividad.Active {
		return nil, errors.New("no se puede actualizar una actividad eliminada")
	}

	// Convertir la imagen base64 a bytes si se proporciona una nueva imagen
	if actividadDTO.ImagenData != "" {
		imagenData, imagenType, err := dtos.Base64ToImage(actividadDTO.ImagenData)
		if err != nil {
			return nil, fmt.Errorf("error al procesar la imagen: %v", err)
		}
		actividad.ImagenData = imagenData
		actividad.ImagenType = imagenType
	}

	// Convertir el string de hora a time.Time
	horario, err := dtos.ParseTimeString(actividadDTO.Horario)
	if err != nil {
		return nil, fmt.Errorf("error al procesar el horario: %v", err)
	}

	// Actualizar los demás campos
	actividad.Titulo = actividadDTO.Titulo
	actividad.Descripcion = actividadDTO.Descripcion
	actividad.Dia = actividadDTO.Dia
	actividad.Horario = horario
	actividad.Duracion = actividadDTO.Duracion
	actividad.Cupo = actividadDTO.Cupo
	actividad.Categoria = actividadDTO.Categoria
	actividad.ProfesorID = actividadDTO.ProfesorID

	if err := s.DB.Save(&actividad).Error; err != nil {
		return nil, err
	}

	return &actividad, nil
}
