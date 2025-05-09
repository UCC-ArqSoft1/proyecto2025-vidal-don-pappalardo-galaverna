
FROM golang:1.24

# Instalar air
RUN go install github.com/air-verse/air@latest

# Setear directorio de trabajo
WORKDIR /app/backend

# Copiar mod y sum
COPY backend/go.mod ./
COPY backend/go.sum ./
RUN go mod download

# Copiar el código fuente correctamente
COPY backend/ ./

# Establecer punto de inicio
CMD ["air"]