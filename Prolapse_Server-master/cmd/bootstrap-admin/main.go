package main

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"os"
	"prolapse-server/db"
	"prolapse-server/models"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	email := os.Getenv("ADMIN_EMAIL")
	password := os.Getenv("ADMIN_PASSWORD")
	if email == "" || password == "" {
		panic("ADMIN_EMAIL and ADMIN_PASSWORD are required")
	}

	var existing models.Account
	if !db.DB.Where("email = ?", email).First(&existing).RecordNotFound() {
		panic("refusing to overwrite an existing account")
	}

	// The current web client sends an MD5 digest over TLS. Retain protocol
	// compatibility while storing only a salted bcrypt digest in MySQL.
	digest := md5.Sum([]byte(password))
	clientPassword := hex.EncodeToString(digest[:])
	storedPassword, err := bcrypt.GenerateFromPassword([]byte(clientPassword), bcrypt.DefaultCost)
	if err != nil {
		panic(fmt.Sprintf("secure initial password: %v", err))
	}

	account := models.Account{
		Email:    email,
		Password: string(storedPassword),
		Role:     3,
	}
	if err := db.DB.Create(&account).Error; err != nil {
		panic(fmt.Sprintf("create administrator: %v", err))
	}
	fmt.Println("initial administrator created")
}
