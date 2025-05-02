FROM golang:1.24

WORKDIR /app

COPY backend/go.mod ./go.mod
COPY backend/go.sum ./go.sum
RUN go mod download

COPY backend/ ./backend/

WORKDIR /app/backend/cmd/api

RUN go build -o /proyecto2025

EXPOSE 8080

CMD ["/proyecto2025"]
