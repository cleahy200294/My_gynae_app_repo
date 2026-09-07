package models

import (
	"github.com/jinzhu/gorm"
)

type Account struct {
	gorm.Model
	Email    string `gorm:"not null;unique" form:"email" binding:"required,email"`
	Password string `gorm:"not null" form:"password" json:"-" binding:"required,min=6"`
	Role     int    `gorm:"not null" form:"role" binding:"required"` //1 patient, 2 doctor, 3 admin
	DoctorId uint   `gorm:"not null" form:"doctorid" json:"doctorid"`
}
