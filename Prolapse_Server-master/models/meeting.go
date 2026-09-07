package models

import (
	"github.com/jinzhu/gorm"
)

type Meeting struct {
	gorm.Model
	Name           string `gorm:"not null" form:"name" json:"name" binding:"required"`
	Type           int    `gorm:"not null" form:"type" json:"type" binding:"required"`
	Questionnaires string `gorm:"not null" form:"questionnaires" json:"questionnaires" binding:"required"`
}
