package models

import (
	"time"
)

type RefreshToken struct {
	ID        uint   `gorm:"primaryKey"`
	Token     string `gorm:"type:varchar(512);uniqueIndex"`
	UserID    uint
	ExpiresAt time.Time
	CreatedAt time.Time
}
