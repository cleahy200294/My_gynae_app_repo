package db

import (
	"fmt"
	"os"
	"prolapse-server/models"

	"github.com/jinzhu/gorm"
	// import mysql driver
	_ "github.com/go-sql-driver/mysql"
)

var DB *gorm.DB

// connect to database
func init() {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		panic("DB_DSN is required")
	}
	database, err := gorm.Open("mysql", dsn)
	if err != nil {
		panic(fmt.Sprintf("connect to database: %v", err))
	}
	database.DB().SetMaxIdleConns(2)
	database.DB().SetMaxOpenConns(10)
	database.DB().SetConnMaxLifetime(0)
	// Automatically build table
	if err := database.AutoMigrate(&models.User{}, &models.Doctor{}, &models.Account{}, &models.Question{}, &models.QuestionHe{}, &models.QuestionZh{}, &models.Questionnaire{}, &models.QuestionnaireHe{}, &models.QuestionnaireZh{}, &models.Answer{}, &models.Meeting{}).Error; err != nil {
		panic(fmt.Sprintf("migrate database: %v", err))
	}
	DB = database
}
