package services

import (
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"

	"gopkg.in/gomail.v2"
)

var CodeMap = make(map[string]string)

func mailDialer() (*gomail.Dialer, string, error) {
	user := os.Getenv("SMTP_USER")
	password := os.Getenv("SMTP_PASSWORD")
	host := os.Getenv("SMTP_HOST")
	port, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil || user == "" || password == "" || host == "" {
		return nil, "", fmt.Errorf("SMTP configuration is incomplete")
	}
	return gomail.NewDialer(host, port, user, password), user, nil
}

func sendMail(to, subject, body string) error {
	dialer, user, err := mailDialer()
	if err != nil { return err }

	m := gomail.NewMessage()
	m.SetHeader("From", user)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	return dialer.DialAndSend(m)
}

func sendMailWithAttach(to, subject, body, file string) error {
	dialer, user, err := mailDialer()
	if err != nil { return err }

	m := gomail.NewMessage()
	m.SetHeader("From", user)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)
	m.Attach(file)

	return dialer.DialAndSend(m)
}

func SendCaptcha(email string) error {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	code := fmt.Sprintf("%06v", r.Int31n(1000000))
	CodeMap[email] = code
	timer := time.NewTimer(120 * time.Second)
	go func() {
		<-timer.C
		delete(CodeMap, email)
	}()
	body := `
		<div>
			<p>Hello ` + email + `,</p>
			<p>Your captcha is:</p>
			<h2>` + code + `</h2>
			<p></p>
			<p>Best regarts,</p>
			<p>My Pelvic Health Place</p>
		</div>
	`
	return sendMail(email, "Your Captcha", body)
}

func SendPDF(email, subject, file string) error {
	body := `
		<div>
			<p>Hello ` + email + `,</p>
			<p>Please check the attachment.</p>
			<p></p>
			<p>Best regarts,</p>
			<p>My Pelvic Health Place</p>
		</div>
	`
	return sendMailWithAttach(email, subject, body, file)
}
