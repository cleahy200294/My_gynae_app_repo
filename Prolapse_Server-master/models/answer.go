package models

import (
	"github.com/jinzhu/gorm"
)

type Answer struct {
	gorm.Model
	AccountId   uint   `gorm:"not null" form:"accountid" json:"accountid"`
	Answer      string `gorm:"not null;type:text" form:"answer" json:"answer"`
	ConsentForm string `gorm:"not null;type:text" form:"consent" json:"consent"`
	Agreeable   string `gorm:"not null" form:"agreeable" json:"agreeable"`

	// purpose
	Purpose string `form:"purpose" json:"purpose"`

	// doctor add
	Popq1    string `form:"popq1" json:"popq1"`
	Popq2    string `form:"popq2" json:"popq2"`
	Popq3    string `form:"popq3" json:"popq3"`
	Popq4    string `form:"popq4" json:"popq4"`
	Popq5    string `form:"popq5" json:"popq5"`
	Popq6    string `form:"popq6" json:"popq6"`
	Surgical int    `form:"surgical" json:"surgical"`
	Uterus   int    `form:"uterus" json:"uterus"`
	Remark   string `form:"remark1" json:"remark1"`
	Remark2  string `form:"remark2" json:"remark2"`
	Remark3  string `form:"remark3" json:"remark3"`

	// questionnaire score
	Khq1  string `form:"khq1" json:"khq1"`
	Khq2  string `form:"khq2" json:"khq2"`
	Khq3  string `form:"khq3" json:"khq3"`
	Khq4  string `form:"khq4" json:"khq4"`
	Khq5  string `form:"khq5" json:"khq5"`
	Khq6  string `form:"khq6" json:"khq6"`
	Khq7  string `form:"khq7" json:"khq7"`
	Khq8  string `form:"khq8" json:"khq8"`
	Khq9  string `form:"khq9" json:"khq9"`
	Khq10 string `form:"khq10" json:"khq10"`
	Pisq  string `form:"pisq" json:"pisq"`
	Iciq  string `form:"iciq" json:"iciq"`
	Pgii  string `form:"pgii" json:"pgii"`
	Pgic  string `form:"pgic" json:"pgic"`
	Pgis  string `form:"pgis" json:"pgis"`

	Prescription string `form:"prescription" json:"prescription"`
}
