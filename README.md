docker build -t proyecto2025 .
docker run -p 8080:8080 proyecto2025

# Proyecto 2025

Este es el proyecto final del curso de Arquitectura de Software.

## Estructura del Proyecto

El proyecto está organizado en dos componentes principales:

- `frontend/`: Contiene la aplicación de interfaz de usuario
- `backend/`: Contiene la API y la lógica del servidor

## Requisitos del Sistema

- Docker y Docker Compose
- Go (para desarrollo)
- MySQL 8.0 (para desarrollo local)

## Instalación y Ejecución

1. Clonar el repositorio
2. Ejecutar el proyecto con Docker:

```bash
docker-compose up --build
```

Los servicios se iniciarán automáticamente:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- Base de datos MySQL: `localhost:3307`

## Arquitectura

### Estructura General
El proyecto utiliza una arquitectura de microservicios con:
- Frontend: React (basado en el directorio frontend)
- Backend: Go (basado en el Dockerfile)
- Base de datos: MySQL 8.0

### Funcionalidades Principales

El proyecto implementa las siguientes funcionalidades principales:

1. **Autenticación y Autorización**
   - Registro de usuarios
   - Login/Logout
   - Gestión de roles (administrador/usuario)

2. **Gestión de Actividades**
   - Creación y edición de actividades
   - Listado de actividades disponibles
   - Búsqueda de actividades por categoría
   - Visualización de detalles de actividades

3. **Sistema de Inscripciones**
   - Inscripción a actividades
   - Gestión de cupos disponibles
   - Listado de inscripciones del usuario
   - Cancelación de inscripciones

4. **Gestión de Usuarios**
   - Perfil de usuario
   - Modificación de datos personales
   - Gestión de roles por parte de administradores

### Arquitectura MVC (Model-View-Controller)

El backend implementa el patrón MVC para organizar la lógica de la aplicación:

#### Ejemplo de Interacción MVC: Inscripción a Actividades

Tomemos como ejemplo el proceso de inscripción a una actividad:

1. **Modelo (Model)**
   - `Actividad`: Representa la estructura de una actividad
   - `Inscripcion`: Maneja las relaciones entre usuarios y actividades
   - `Usuario`: Contiene la información del usuario que se inscribe

2. **Vista (View)**
   - Componente React `ActividadDetail`: Muestra los detalles de la actividad
   - Componente `InscripcionForm`: Formulario para realizar la inscripción
   - Componente `ActividadList`: Lista de actividades disponibles

3. **Controlador (Controller)**
   - `InscripcionHandler`: Maneja las peticiones HTTP relacionadas con inscripciones
     ```go
     func (h *InscripcionHandler) CreateInscripcion(c *gin.Context) {
         var inscripcion models.Inscripcion
         if err := c.ShouldBindJSON(&inscripcion); err != nil {
             c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
             return
         }
         
         // Validar cupos disponibles
         actividad, err := h.service.GetActividad(inscripcion.ActividadID)
         if err != nil || actividad.Cupo <= 0 {
             c.JSON(http.StatusConflict, gin.H{"error": "No hay cupos disponibles"})
             return
         }
         
         // Crear inscripción
         err = h.service.CreateInscripcion(&inscripcion)
         if err != nil {
             c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
             return
         }
         
         // Actualizar cupo de la actividad
         actividad.Cupo--
         err = h.service.UpdateActividad(actividad)
         if err != nil {
             c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
             return
         }
         
         c.JSON(http.StatusOK, inscripcion)
     }
     ```

#### Flujo de Interacción

1. El usuario ve una actividad en el frontend
2. Se hace clic en "Inscribirse"
3. El componente React envía una petición POST a `/api/inscripciones`
4. El controlador `InscripcionHandler` recibe la petición
5. Valida los datos y verifica cupos disponibles
6. Si todo está correcto:
   - Crea la inscripción en la base de datos
   - Actualiza el cupo de la actividad
   - Responde con éxito al frontend
7. El frontend actualiza la interfaz mostrando la inscripción exitosa

Este ejemplo demuestra cómo los componentes MVC trabajan juntos:
- El modelo maneja la estructura de datos
- La vista presenta la interfaz al usuario
- El controlador coordina la lógica de negocio y la comunicación entre los otros componentes

### Relaciones entre Componentes

Los componentes están relacionados de la siguiente manera:
- Los usuarios tienen un rol asignado
- Las actividades tienen cupos limitados
- Los usuarios pueden inscribirse a actividades disponibles
- Las inscripciones tienen una fecha de registro

Para más detalles sobre las relaciones entre las entidades, consultar el diagrama de entidad-relación en el archivo `a.puml` en la raíz del proyecto.

## Desarrollo

Para desarrollar localmente:

1. Instalar dependencias:
```bash
# En el directorio frontend
npm install

# En el directorio backend
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
# Frontend
npm start

# Backend
npm run dev
```

## Base de Datos

La base de datos MySQL se configura automáticamente con Docker Compose. Las credenciales por defecto son:
- Host: `localhost`
- Puerto: `3307`
- Usuario: `proyecto2025`
- Contraseña: `secret`
- Base de datos: `proyecto2025db`

## Licencia

MIT License

## Contribuidores

- Vidal
- Don
- Pappalardo
- Galaverna

## Documentación Adicional

Para más detalles sobre la arquitectura y diseño del sistema, consultar el archivo `a.puml` en la raíz del proyecto.

docker build -t proyecto2025 .
docker run -p 8080:8080 proyecto2025