package dtos

type InscripcionDTO struct {
	UsuarioID        uint   `json:"usuario_id" binding:"required"`
	ActividadID      uint   `json:"actividad_id" binding:"required"`
	FechaInscripcion string `json:"fecha_inscripcion"`
}

type InscripcionResponseDTO struct {
	ID               uint   `json:"id"`
	UsuarioID        uint   `json:"usuario_id"`
	ActividadID      uint   `json:"actividad_id"`
	FechaInscripcion string `json:"fecha_inscripcion"`
}
