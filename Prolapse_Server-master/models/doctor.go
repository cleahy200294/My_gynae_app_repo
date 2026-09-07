package models

import (
	"github.com/jinzhu/gorm"
)

type Doctor struct {
	gorm.Model
	AccountId uint   `gorm:"not null;unique" form:"accountid" json:"accountid"`
	Email     string `gorm:"not null;unique" form:"email" json:"email"`
	Firstname string `gorm:"not null" form:"firstname" json:"firstname" binding:"required"`
	Title     string `form:"title" json:"title" binding:"required"`
	Midname   string `form:"midname" json:"midname"`
	Surname   string `gorm:"not null" form:"surname" json:"surname" binding:"required"`
}
