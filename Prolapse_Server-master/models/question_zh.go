package models

import (
	"github.com/jinzhu/gorm"
)

type QuestionZh struct {
	gorm.Model
	QuestionnaireID uint   `gorm:"not null" form:"questionnaireid" json:"questionnaireid"`
	Question        string `gorm:"not null" form:"question" json:"question"`
	Type            string `gorm:"not null" form:"type" json:"type"`
	Options         string `gorm:"type:text" form:"option" json:"option"`
	OptionScores    string `form:"optionscores" json:"optionscores"`
	OptionNeedValue string `form:"optionneedvalue" json:"optionneedvalue"`
	Visible         int    `gorm:"not null" form:"visible" json:"visible"`
	ConditionID     uint   `form:"conditionid" json:"conditionid"`
	ConditionOption string `form:"conditionoption" json:"conditionoption"`
}
