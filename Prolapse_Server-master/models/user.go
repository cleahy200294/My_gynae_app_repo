package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	AccountId uint   `gorm:"not null;unique" form:"accountid" json:"accountid"`
	Email     string `gorm:"not null;unique" form:"email" json:"email"`
	// Basic Information
	Firstname   string    `gorm:"not null" form:"firstname" json:"firstname" binding:"required"`
	Surname     string    `gorm:"not null" form:"surname" json:"surname" binding:"required"`
	Birthday    time.Time `gorm:"not null" form:"birthday" json:"birthday" binding:"required"`
	Phone       string    `gorm:"not null" form:"phone" json:"phone" binding:"required"`
	Ethnic      int       `form:"ethnic" json:"ethnic" binding:"required"`
	Height      float64   `gorm:"not null" form:"height" json:"height" binding:"required"`
	Weight      float64   `gorm:"not null" form:"weight" json:"weight" binding:"required"`
	Children    string    `gorm:"not null" form:"children" json:"children"`
	BirthWeight float64   `gorm:"not null" form:"birthWeight" json:"birthWeight"`
	// Medical Information
	MainComplaint              string `gorm:"not null" form:"complaint" json:"complaint"`
	MedicalHistory             string `form:"medicalhistory" json:"medicalhistory"`
	MedicalHistoryOther        string `form:"medicalhistoryother" json:"medicalhistoryother"`
	PastSurgery                string `form:"pastsurgery" json:"pastsurgery"`
	PastGynecologySurgery      string `form:"pastgynecologysurgery" json:"pastgynecologysurgery"`
	PastGynecologySurgeryOther string `form:"pastgynecologysurgeryother" json:"pastgynecologysurgeryother"`
	CurrentMedication          string `form:"currentmedication" json:"currentmedication"`
	// Setting
	IfDoctor int `gorm:"not null" form:"ifdoctor" json:"ifdoctor"`
	// if fill profile
	// 0:  no first meeting 1: have first meeting
	Status int `gorm:"not null" form:"status" json:"status"`
	// 0: not waiting 1: waiting for respond
	Wating      int    `gorm:"not null" form:"wating" json:"wating"`
	Documents   string `form:"documents" json:"documents"`
	Urodynamics string `gorm:"type:text" form:"urodynamics" json:"urodynamics"`
}
