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
	if err := s.DB.Preload("Profesor").Preload("Inscripciones").
		Where("active = ?", true).
		Find(&actividades).Error; err != nil {
		return nil, err
	}
	return actividades, nil
}

func (s *ActividadService) CrearActividad(actividadDTO dtos.ActividadDTO) (*models.Actividad, error) {
	// Iniciar transacci?n
	tx := s.DB.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	// Verificar que el profesor existe
	var profesor models.Usuario
	if err := tx.Preload("Role").First(&profesor, actividadDTO.ProfesorID).Error; err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("profesor no encontrado: %v", err)
	}

	// Verificar que el profesor tiene el rol correcto
	if profesor.Role.Nombre != "instructor" {
		tx.Rollback()
		return nil, fmt.Errorf("el usuario no es un instructor")
	}

	// Convertir la imagen base64 a bytes
	imagenData, imagenType, err := dtos.Base64ToImage(actividadDTO.ImagenData)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("error al procesar la imagen: %v", err)
	}

	// Convertir el string de hora a time.Time
	horario, err := dtos.ParseTimeString(actividadDTO.Horario)
	if err != nil {
		tx.Rollback()
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

	if err := tx.Create(&actividad).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Confirmar la transacci?n
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return &actividad, nil
}

// El servicio que elimina una actividad (borrado l?gico)
func (s *ActividadService) DeleteActividad(id uint) (bool, error) {
	// Iniciar transacci?n
	tx := s.DB.Begin()
	if tx.Error != nil {
		return false, tx.Error
	}

	var actividad models.Actividad
	if err := tx.Preload("Inscripciones").First(&actividad, id).Error; err != nil {
		tx.Rollback()
		return false, err
	}

	// Si la actividad ya est? desactivada
	if !actividad.Active {
		tx.Rollback()
		return false, nil
	}

	// Si hay inscripciones, eliminarlas primero (esto se har? en cascada por la relaci?n)
	hadEnrollments := len(actividad.Inscripciones) > 0

	// Actualizar los campos de borrado l?gico
	actividad.Active = false
	actividad.DeletedAt = gorm.DeletedAt{Time: time.Now(), Valid: true}

	if err := tx.Save(&actividad).Error; err != nil {
		tx.Rollback()
		return false, err
	}

	// Confirmar la transacci?n
	if err := tx.Commit().Error; err != nil {
		return false, err
	}

	return hadEnrollments, nil
}

func (s *ActividadService) UpdateActividad(id uint, actividadDTO dtos.ActividadDTO) (*models.Actividad, error) {
	// Iniciar transacci?n
	tx := s.DB.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	var actividad models.Actividad
	if err := tx.Preload("Profesor").First(&actividad, id).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			return nil, errors.New("actividad no encontrada")
		}
		return nil, err
	}

	// Si la actividad est? eliminada l?gicamente
	if !actividad.Active {
		tx.Rollback()
		return nil, errors.New("no se puede actualizar una actividad eliminada")
	}

	// Verificar que el nuevo profesor existe y es instructor
	if actividadDTO.ProfesorID != actividad.ProfesorID {
		var profesor models.Usuario
		if err := tx.Preload("Role").First(&profesor, actividadDTO.ProfesorID).Error; err != nil {
			tx.Rollback()
			return nil, fmt.Errorf("profesor no encontrado: %v", err)
		}

		if profesor.Role.Nombre != "instructor" {
			tx.Rollback()
			return nil, fmt.Errorf("el usuario no es un instructor")
		}
	}

	// Convertir la imagen base64 a bytes si se proporciona una nueva imagen
	if actividadDTO.ImagenData != "" {
		imagenData, imagenType, err := dtos.Base64ToImage(actividadDTO.ImagenData)
		if err != nil {
			tx.Rollback()
			return nil, fmt.Errorf("error al procesar la imagen: %v", err)
		}
		actividad.ImagenData = imagenData
		actividad.ImagenType = imagenType
	}

	// Convertir el string de hora a time.Time
	horario, err := dtos.ParseTimeString(actividadDTO.Horario)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("error al procesar el horario: %v", err)
	}

	// Actualizar los dem?s campos
	actividad.Titulo = actividadDTO.Titulo
	actividad.Descripcion = actividadDTO.Descripcion
	actividad.Dia = actividadDTO.Dia
	actividad.Horario = horario
	actividad.Duracion = actividadDTO.Duracion
	actividad.Cupo = actividadDTO.Cupo
	actividad.Categoria = actividadDTO.Categoria
	actividad.ProfesorID = actividadDTO.ProfesorID

	if err := tx.Save(&actividad).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Confirmar la transacci?n
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return &actividad, nil
}
