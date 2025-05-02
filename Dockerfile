FROM golang:1.24

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

WORKDIR /app/cmd/api

RUN GOOS=linux GOARCH=amd64 go build -o /proyecto2025

EXPOSE 8080

CMD ["/proyecto2025"]
