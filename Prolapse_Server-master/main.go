package main

import (
	"net/http"
	"os"
	"prolapse-server/controllers"
	_ "prolapse-server/db"
	"prolapse-server/services"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(services.CORS())
	router.GET("/api/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status": "ok"}) })
	account := router.Group("/account")
	{
		account.POST("/login", controllers.Login)
		account.POST("/register", controllers.Register)
		account.POST("/reset", controllers.ResetPassword)
		account.POST("/email/captcha", controllers.SendCaptcha)
		account.GET("/doctor/list", controllers.GetDoctorList)
	}
	// The following APIs validates the token
	router.Use(services.JwtVerify)
	accountAdmin := router.Group("/account")
	accountAdmin.POST("/privileged", services.RequireRoles(3), controllers.RegisterPrivileged)
	user := router.Group("/user")
	user.Use(services.RequireRoles(1))
	{
		user.GET("/information", controllers.GetUserInfo)
		user.POST("/information", controllers.SaveUserInfo)
		user.POST("/delete", controllers.CancelAccount)
	}
	survey := router.Group("/survey")
	{
		survey.POST("/questionnaire", services.RequireRoles(3), controllers.CreateQuestionnaire)
		survey.DELETE("/questionnaire/:id", services.RequireRoles(3), controllers.DeleteQuestionnaire)
		survey.PUT("/questionnaire/:id", services.RequireRoles(3), controllers.ChangeQuestionnaire)
		survey.GET("/questionnaire", controllers.GetQuestionnaire)
		survey.GET("/questionnairebyids", controllers.GetQuestionnaireByIDs)
		survey.POST("/question", services.RequireRoles(3), controllers.CreateQuestion)
		survey.DELETE("/question/:id", services.RequireRoles(3), controllers.DeleteQuestion)
		survey.PUT("/question/:id", services.RequireRoles(3), controllers.ChangeQuestion)
		survey.GET("/question/:id", controllers.GetQuestion)
		survey.GET("/translate", services.RequireRoles(3), controllers.AutoTranslate)
	}
	answer := router.Group("/answer")
	{
		answer.POST("/details", services.RequireRoles(1), controllers.CreateAnswer)
		answer.PUT("/details/:id", services.RequireRoles(2, 3), controllers.ChangeAnswer)
		answer.GET("/list/:patientid", controllers.GetAnswerList)
	}
	patient := router.Group("/patient")
	{
		patient.GET("/list", services.RequireRoles(2, 3), controllers.GetPatientList)
		patient.GET("/list/all", services.RequireRoles(3), controllers.GetPatientAllList)
		patient.GET("/list/export", services.RequireRoles(2, 3), controllers.ExportPatientList)
		patient.GET("/information/:id", services.RequireRoles(2, 3), controllers.GetUserInfoById)
		patient.PUT("/information", services.RequireRoles(2, 3), controllers.SaveUserInfoById)
		patient.PUT("/reset/:id", services.RequireRoles(2, 3), controllers.ResetUserWaiting)
		patient.DELETE("/document/remove/:id/:name", services.RequireRoles(2, 3), controllers.RemovePatientDoc)
		patient.POST("/document/upload/:id", services.RequireRoles(2, 3), controllers.UploadPatientDoc)
		patient.POST("/urodynamics/:id", services.RequireRoles(2, 3), controllers.UpdateUrodynamics)
		patient.POST("/predict", services.RequireRoles(2, 3), controllers.PredictPOP)
	}
	doctor := router.Group("/doctor")
	{
		doctor.GET("/list/account", services.RequireRoles(3), controllers.GetDoctorAccountList)
		doctor.POST("/info", services.RequireRoles(2), controllers.SaveDoctorInfo)
		doctor.GET("/info", services.RequireRoles(2), controllers.GetDoctorInfo)
	}
	meeting := router.Group("/meet")
	{
		meeting.POST("/meeting", services.RequireRoles(3), controllers.CreateMeeting)
		meeting.PUT("/meeting/:id", services.RequireRoles(3), controllers.ChangeMeeting)
		meeting.DELETE("/meeting/:id", services.RequireRoles(3), controllers.DeleteMeeting)
		meeting.GET("/meeting", controllers.GetMeetingList)
	}
	pdf := router.Group("/pdf")
	{
		pdf.POST("/send", services.RequireRoles(2, 3), controllers.SendPdf)
	}
	port := os.Getenv("PORT")
	if port == "" { port = "8080" }
	if err := router.Run(":" + port); err != nil { panic(err) }
}
