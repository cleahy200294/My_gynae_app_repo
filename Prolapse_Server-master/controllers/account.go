package controllers

import (
	"fmt"
	"net/http"
	"prolapse-server/db"
	"prolapse-server/models"
	"prolapse-server/services"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func SendCaptcha(c *gin.Context) {
	email := c.PostForm("email")
	if err := services.SendCaptcha(email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Captcha has been send"})
}

func Login(c *gin.Context) {
	var account models.Account
	var claims services.AccountClaims
	// Does it conform to what is defined in models
	if err := c.Bind(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}

	providedPassword := account.Password
	if err := db.DB.Where("email = ? AND role = ?", account.Email, account.Role).First(&account).Error; err != nil || bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(providedPassword)) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or password error"})
		return
	}
	claims.ID = account.ID
	claims.Email = account.Email
	claims.Role = account.Role
	claims.DoctorId = account.DoctorId
	token := services.GenerateToken(&claims)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Register(c *gin.Context) {
	var account models.Account
	// Does it conform to what is defined in models
	if err := c.Bind(&account); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	// Self-service registration may only create patient accounts.
	account.Role = 1
	if err := securePassword(&account); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to secure password"})
		return
	}
	// check captcha
	// captcha := c.PostForm("captcha")
	// if captcha != services.CodeMap[account.Email] {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Captcha error"})
	// 	return
	// }
	// Check whether errors occur during creation
	if err := db.DB.Create(&account).Error; err != nil {
		fmt.Println(err.Error())
		if strings.Contains(err.Error(), "1062") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "The Email ID already exists"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Registered successfully"})
}

// RegisterPrivileged creates doctor or administrator accounts and is only
// exposed behind the administrator role middleware.
func RegisterPrivileged(c *gin.Context) {
	var account models.Account
	if err := c.Bind(&account); err != nil || (account.Role != 2 && account.Role != 3) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A doctor or administrator role is required"})
		return
	}
	if err := securePassword(&account); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to secure password"})
		return
	}
	if err := db.DB.Create(&account).Error; err != nil {
		if strings.Contains(err.Error(), "1062") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "The Email ID already exists"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Account created successfully"})
}

func securePassword(account *models.Account) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(account.Password), bcrypt.DefaultCost)
	if err != nil { return err }
	account.Password = string(hashedPassword)
	return nil
}

func ResetPassword(c *gin.Context) {
	var account models.Account
	// Does it conform to what is defined in models
	if err := c.Bind(&account); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	npassword := account.Password
	// check captcha
	captcha := c.PostForm("captcha")
	if captcha != services.CodeMap[account.Email] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Captcha error"})
		return
	}
	if err := db.DB.Where("email =? ", account.Email).First(&account).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email has not registered"})
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(npassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to secure password"})
		return
	}
	account.Password = string(hashedPassword)
	db.DB.Save(&account)
	c.JSON(http.StatusOK, gin.H{"msg": "Registered successfully"})
}

func CancelAccount(c *gin.Context) {
	account, _ := c.Get("account")
	accountt := account.(*services.AccountClaims)
	fmt.Println(accountt)
	var d_account models.Account
	d_account.ID = accountt.ID

	if err := db.DB.Delete(&d_account).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Delete account failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Delete account successfully"})
}
