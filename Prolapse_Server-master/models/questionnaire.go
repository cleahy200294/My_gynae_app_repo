package models

import (
	"errors"

	"github.com/jinzhu/gorm"
)

type Questionnaire struct {
	gorm.Model
	Name        string `gorm:"not null" form:"name" json:"name"`
	Details     string `gorm:"type:text" form:"details" json:"details"`
	Remark      string `form:"remark" json:"remark"`
	ComputeRule string `gorm:"not null" form:"computerule" json:"computerule"`
	ParentID    uint   `gorm:"not null" form:"parentid" json:"parentid"`
	Skip        uint   `gorm:"not null" form:"skip" json:"skip"`
}

func (q *Questionnaire) BeforeDelete(tx *gorm.DB) (err error) {
	var count int
	tx.Model(&Questionnaire{}).Where("parent_id = ?", q.ID).Count(&count)
	if count > 0 {
		err = errors.New("this questionnaire has its children, please delete them first")
		return
	}
	tx.Where("questionnaire_id = ?", q.ID).Delete(&Question{})
	return
}
