package controllers

import (
	"fmt"
	"net/http"
	"prolapse-server/db"
	"prolapse-server/models"
	"prolapse-server/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateMeeting(c *gin.Context) {
	var meeting models.Meeting
	if err := c.Bind(&meeting); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	if err := db.DB.Create(&meeting).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Created successfully"})
}

func DeleteMeeting(c *gin.Context) {
	var meeting models.Meeting
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		meeting.ID = uint(id)
	}
	if err := db.DB.Delete(&meeting).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Deleted successfully"})
}

func ChangeMeeting(c *gin.Context) {
	var meeting models.Meeting
	if err := c.Bind(&meeting); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		meeting.ID = uint(id)
	}
	if err := db.DB.Save(&meeting).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Changed successfully"})
}

func GetMeetingList(c *gin.Context) {
	target := c.DefaultQuery("lang", "en")
	var meeting []models.Meeting
	if err := db.DB.Find(&meeting).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// translate
	if target == "en" {
		c.JSON(http.StatusOK, meeting)
		return
	}

	// Prepare texts for translation
	texts := make([]string, len(meeting))
	for i, m := range meeting {
		texts[i] = m.Name
	}

	// Translate
	translatedNames := services.TranslateText(target, texts)

	// Update meeting names
	for i := range meeting {
		meeting[i].Name = translatedNames[i]
	}

	c.JSON(http.StatusOK, meeting)
}
