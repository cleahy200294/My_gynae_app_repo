package controllers

import (
	"net/http"
	"os"
	"prolapse-server/services"

	"github.com/gin-gonic/gin"
)

type Pdf struct {
	Subject string `form:"subject" json:"subject" binding:"required"`
	Email   string `form:"email" json:"email" binding:"required"`
}

func SendPdf(c *gin.Context) {
	var pdf Pdf
	// Does it conform to what is defined in models
	if err := c.Bind(&pdf); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Upload pdf file error"})
		return
	}
	if err := os.MkdirAll("pdf", 0700); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to prepare attachment"})
		return
	}
	path := "pdf/" + pdf.Email + " _ " + pdf.Subject + ".pdf"
	c.SaveUploadedFile(file, path)
	if err := services.SendPDF(pdf.Email, pdf.Subject, path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	os.Remove(path)
	c.JSON(http.StatusOK, gin.H{"msg": "Email has been sent"})
}
