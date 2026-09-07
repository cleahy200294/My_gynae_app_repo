package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"prolapse-server/db"
	"prolapse-server/models"
	"prolapse-server/services"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func CreateAnswer(c *gin.Context) {
	var answer models.Answer

	account, _ := c.Get("account")
	accountt := account.(*services.AccountClaims)
	answer.AccountId = accountt.ID

	// PostForm - get form paramaters
	answerJson := c.PostForm("answermap")
	purpose := c.PostForm("purpose")
	agreeable := c.PostForm("agreeable")
	if answerJson == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}

	// Parse Answer
	answer.Answer = answerJson
	answer.Purpose = purpose
	answer.Agreeable = agreeable
	aMap := make(map[uint]map[uint]string)
	json.Unmarshal([]byte(answerJson), &aMap)

	// Get Questionnaire List
	var questionnaires []models.Questionnaire
	db.DB.Find(&questionnaires)

	// ComputeScore
	computeScore(&questionnaires, &aMap, &answer)

	if err := db.DB.Create(&answer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var user models.User
	db.DB.Where("account_id = ?", accountt.ID).First(&user)
	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please edit your profile first"})
	}
	if user.Status == 0 {
		user.Status = 1
	}
	user.Wating = 1
	if err := db.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Created successfully"})
}

func computeScore(s *[]models.Questionnaire, aMap *map[uint]map[uint]string, ans *models.Answer) {
	for _, x := range *s {
		if x.ComputeRule != "" && x.ComputeRule != "no" {
			answer := (*aMap)[x.ID]
			var questions []models.Question
			var scores []int
			db.DB.Where("questionnaire_id = ?", x.ID).Find(&questions)
			for _, q := range questions {
				if q.Options != "" && q.OptionScores != "" {
					index := pos(strings.Split(q.Options, ","), answer[q.ID])
					if index == -1 {
						scores = append(scores, -1)
					} else {
						score, _ := strconv.Atoi(strings.Split(q.OptionScores, ",")[index])
						scores = append(scores, score)
					}
				} else {
					scores = append(scores, -1)
				}
			}
			switch x.ComputeRule {
			case "khq":
				if x.ID == 19 {
					if scores[0] >= 0 {
						ans.Khq1 = decimal((float64(max(scores[0]-1, 0))) / 4 * 100)
					}
					if scores[1] >= 0 {
						ans.Khq2 = decimal((float64(max(scores[1]-1, 0))) / 3 * 100)
					}
				}
				if x.ID == 20 && sum(scores) >= 0 {
					ans.Khq3 = decimal((float64(max(sum(scores)-len(scores), 0))) / float64(3*len(scores)) * 100)
				}
				if x.ID == 21 && sum(scores) >= 0 {
					ans.Khq4 = decimal((float64(max(sum(scores)-len(scores), 0))) / float64(3*len(scores)) * 100)
				}
				if x.ID == 22 && sum(scores) >= 0 {
					ans.Khq5 = decimal((float64(max(sum(scores)-len(scores), 0))) / float64(3*len(scores)) * 100)
				}
				if x.ID == 23 && sum(scores) >= 0 {
					ans.Khq6 = decimal(float64(sum(scores)) / 4 * 100)
				}
				if x.ID == 24 && sum(scores) >= 0 {
					ans.Khq7 = decimal((float64(max(sum(scores)-len(scores), 0))) / float64(3*len(scores)) * 100)
				}
				if x.ID == 25 && sum(scores) >= 0 {
					ans.Khq8 = decimal((float64(max(sum(scores)-len(scores), 0))) / float64(3*len(scores)) * 100)
				}
				if x.ID == 26 && sum(scores) >= 0 {
					ans.Khq9 = decimal((float64(max(sum(scores)-len(scores), 0))) / float64(3*len(scores)) * 100)
				}
				if x.ID == 27 && sum(scores) >= 0 {
					ans.Khq10 = decimal(float64(sum(scores)))
				}
			case "pisq":
				if sum(scores) >= 0 {
					ans.Pisq = decimal(float64(sum(scores)))
				}
			case "iciq":
				if sum(scores) >= 0 {
					ans.Iciq = decimal(float64(sum(scores)))
				}
			case "pgi":
				if x.ID == 30 && scores[0] >= 0 {
					ans.Pgii = decimal(float64(scores[0]))
				}
				if x.ID == 32 && scores[0] >= 0 {
					ans.Pgic = decimal(float64(scores[0]))
				}
				if x.ID == 33 && scores[0] >= 0 {
					ans.Pgis = decimal(float64(scores[0]))
				}
			}
		}
	}
}

func max(num1 int, num2 int) int {
	if num1 > num2 {
		return num1
	}
	return num2
}

func decimal(value float64) string {
	return fmt.Sprintf("%.2f", value)
}

func pos(s []string, sub string) int {
	for p, v := range s {
		if v == sub {
			return p
		}
	}
	return -1
}

func sum(s []int) int {
	r := 0
	for _, value := range s {
		r += value
	}
	return r
}

func ChangeAnswer(c *gin.Context) {
	var answer models.Answer
	if err := c.Bind(&answer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		answer.ID = uint(id)
	}
	if err := db.DB.Save(&answer).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Changed successfully"})
}

func GetAnswerList(c *gin.Context) {
	var patientid uint
	if id, err := strconv.Atoi(c.Param("patientid")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		patientid = uint(id)
	}
	var answers []models.Answer
	if err := db.DB.Where("account_id = ?", patientid).Order("created_at DESC").Find(&answers).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, answers)
}
