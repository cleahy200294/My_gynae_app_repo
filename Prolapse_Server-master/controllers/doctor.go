package controllers

import (
	"fmt"
	"net/http"
	"prolapse-server/db"
	"prolapse-server/models"
	"prolapse-server/services"

	"github.com/gin-gonic/gin"
)

func GetDoctorAccountList(c *gin.Context) {
	var accounts []models.Account
	if err := db.DB.Where("role = ?", 2).Find(&accounts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, accounts)
}

func GetDoctorList(c *gin.Context) {
	var doctors []models.Doctor
	if err := db.DB.Find(&doctors).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, doctors)
}

func GetDoctorInfo(c *gin.Context) {
	account, _ := c.Get("account")
	accountt := account.(*services.AccountClaims)
	var doctor models.Doctor
	if err := db.DB.Where("account_id =?", accountt.ID).First(&doctor).Error; err != nil {
		doctor.Email = accountt.Email
		doctor.AccountId = accountt.ID
		c.JSON(http.StatusOK, gin.H{"information": doctor})
		return
	}
	c.JSON(http.StatusOK, gin.H{"information": doctor})
}

func SaveDoctorInfo(c *gin.Context) {
	var doctor models.Doctor
	if err := c.Bind(&doctor); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	account, _ := c.Get("account")
	accountt := account.(*services.AccountClaims)
	doctor.AccountId = accountt.ID
	doctor.Email = accountt.Email
	if doctor.ID == 0 {
		// add
		if err := db.DB.Create(&doctor).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"msg": "Saved successfully"})
		return
	}
	var doctor1 models.Doctor
	doctor1.ID = doctor.ID
	db.DB.First(&doctor1)
	doctor.Model = doctor1.Model
	if doctor == doctor1 {
		c.JSON(http.StatusOK, gin.H{"msg": "Saved successfully"})
		return
	}
	if err := db.DB.Save(&doctor).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Saved successfully"})
}
