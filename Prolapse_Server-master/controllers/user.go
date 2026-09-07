package controllers

import (
	"fmt"
	"net/http"
	"prolapse-server/db"
	"prolapse-server/models"
	"prolapse-server/services"

	"github.com/gin-gonic/gin"
)

func GetUserInfo(c *gin.Context) {
	account, _ := c.Get("account")
	accountt := account.(*services.AccountClaims)
	var user models.User
	if err := db.DB.Where("account_id =?", accountt.ID).First(&user).Error; err != nil {
		user.Email = accountt.Email
		user.AccountId = accountt.ID
		c.JSON(http.StatusOK, gin.H{"information": user})
		return
	}
	c.JSON(http.StatusOK, gin.H{"information": user})
}

func SaveUserInfo(c *gin.Context) {
	var user models.User
	if err := c.Bind(&user); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	account, _ := c.Get("account")
	accountt := account.(*services.AccountClaims)
	user.AccountId = accountt.ID
	user.Email = accountt.Email
	if user.ID == 0 {
		// add
		if err := db.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"msg": "Saved successfully"})
		return
	}
	var user1 models.User
	if err := db.DB.Where("id = ? AND account_id = ?", user.ID, accountt.ID).First(&user1).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Profile does not belong to this account"})
		return
	}
	user.Model = user1.Model
	if user == user1 {
		c.JSON(http.StatusOK, gin.H{"msg": "Saved successfully"})
		return
	}
	if err := db.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Saved successfully"})
}
