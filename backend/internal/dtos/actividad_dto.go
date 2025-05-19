package dtos

import (
	"encoding/base64"
	"fmt"
	"strings"
	"time"

	"github.com/proyecto2025/backend/internal/models"
)

type ProfesorResponseDTO struct {
	ID     uint   `json:"id"`
	Nombre string `json:"nombre"`
}

type ActividadDTO struct {
	Titulo      string `json:"titulo" binding:"required,max=100"`
	Descripcion string `json:"descripcion" binding:"max=200"`
	Dia         string `json:"dia" binding:"required,max=20"`
	Horario     string `json:"horario" binding:"required"`
	Duracion    int    `json:"duracion" binding:"required,min=1"`
	Cupo        int    `json:"cupo" binding:"required,min=1"`
	Categoria   string `json:"categoria" binding:"required,max=50"`
	ImagenData  string `json:"imagen_data"` // Base64 encoded image data
	ImagenType  string `json:"imagen_type"` // MIME type of the image
	Active      bool   `json:"active"`
	ProfesorID  uint   `json:"profesor_id" binding:"required"`
}

type ActividadResponseDTO struct {
	ID          uint                `json:"id"`
	Titulo      string              `json:"titulo"`
	Descripcion string              `json:"descripcion"`
	Dia         string              `json:"dia"`
	Horario     string              `json:"horario"`
	Duracion    int                 `json:"duracion"`
	Cupo        int                 `json:"cupo"`
	Inscritos   int                 `json:"inscritos"`
	Categoria   string              `json:"categoria"`
	ImagenData  string              `json:"imagen_data"` // Base64 encoded image data
	ImagenType  string              `json:"imagen_type"` // MIME type of the image
	Active      bool                `json:"active"`
	ProfesorID  uint                `json:"profesor_id"`
	Profesor    ProfesorResponseDTO `json:"profesor"`
	CreatedAt   time.Time           `json:"created_at"`
	UpdatedAt   time.Time           `json:"updated_at"`
}

// mapeo porque quiero devovler unicamente los campos id y nombre del profesor
func MapActividadToDTO(a models.Actividad) ActividadResponseDTO {
	var inscritosCount int64
	a.DB.Model(&models.Inscripcion{}).Where("actividad_id = ?", a.ID).Count(&inscritosCount)

	return ActividadResponseDTO{
		ID:          a.ID,
		Titulo:      a.Titulo,
		Descripcion: a.Descripcion,
		Dia:         a.Dia,
		Horario:     a.Horario.Format("15:04"), // o el formato que prefieras
		Duracion:    a.Duracion,
		Cupo:        a.Cupo,
		Inscritos:   int(inscritosCount),
		Categoria:   a.Categoria,
		ImagenData:  ImageToBase64(a.ImagenData, a.ImagenType),
		Active:      a.Active,
		ProfesorID:  a.ProfesorID,
		Profesor: ProfesorResponseDTO{
			ID:     a.Profesor.ID,
			Nombre: a.Profesor.Nombre,
		},
		CreatedAt: a.CreatedAt,
		UpdatedAt: a.UpdatedAt,
	}
}

// Función para convertir una imagen a base64
func ImageToBase64(imageData []byte, mimeType string) string {
	if len(imageData) == 0 {
		return ""
	}
	return fmt.Sprintf("data:%s;base64,%s", mimeType, base64.StdEncoding.EncodeToString(imageData))
}

// Función para convertir base64 a bytes
func Base64ToImage(base64Str string) ([]byte, string, error) {
	if base64Str == "" {
		return nil, "", nil
	}

	// Extraer el tipo MIME y los datos base64
	parts := strings.Split(base64Str, ";base64,")
	if len(parts) != 2 {
		return nil, "", fmt.Errorf("formato base64 inválido")
	}

	mimeType := strings.TrimPrefix(parts[0], "data:")
	data, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, "", err
	}

	return data, mimeType, nil
}

// Función para convertir un string de hora a time.Time
func ParseTimeString(timeStr string) (time.Time, error) {
	// Usar una fecha base (2000-01-01) y agregar la hora
	baseDate := "2000-01-01T"
	timeWithDate := baseDate + timeStr + ":00Z"
	return time.Parse(time.RFC3339, timeWithDate)
}
