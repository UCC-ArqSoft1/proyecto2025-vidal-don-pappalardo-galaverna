FROM golang:1.24

WORKDIR /app

# Copiar los archivos de go.mod y go.sum
COPY backend/go.mod ./
COPY backend/go.sum ./    
RUN go mod download

# Copiar el código fuente
COPY backend/ ./backend
COPY cmd/api/ ./cmd/api

# Construir el binario
WORKDIR /app/cmd/api
RUN GOOS=linux GOARCH=amd64 go build -o /app/proyecto2025

# Exponer puerto y definir el binario de arranque
EXPOSE 8080
CMD ["/app/proyecto2025"]