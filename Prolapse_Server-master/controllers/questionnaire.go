package controllers

import (
	"fmt"
	"net/http"
	"prolapse-server/db"
	"prolapse-server/models"
	"prolapse-server/services"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
)

func CreateQuestionnaire(c *gin.Context) {
	var questionnaire models.Questionnaire
	if err := c.Bind(&questionnaire); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	if err := db.DB.Create(&questionnaire).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Created successfully"})
}

func DeleteQuestionnaire(c *gin.Context) {
	var questionnaire models.Questionnaire
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		questionnaire.ID = uint(id)
	}
	if err := db.DB.Delete(&questionnaire).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Deleted successfully"})
}

func ChangeQuestionnaire(c *gin.Context) {
	var questionnaire models.Questionnaire
	if err := c.Bind(&questionnaire); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		questionnaire.ID = uint(id)
	}
	if err := db.DB.Save(&questionnaire).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Changed successfully"})
}

func translateQuestionnaire(target string) {
	var questionnaires []models.Questionnaire
	if err := db.DB.Find(&questionnaires).Error; err != nil {
		fmt.Println(err.Error())
		return
	}

	// Prepare texts for translation
	texts := make([]string, len(questionnaires))
	texts1 := make([]string, len(questionnaires))
	for i, m := range questionnaires {
		texts[i] = m.Name
		texts1[i] = m.Details
	}

	// TranslateText
	translatedNames := services.TranslateText(target, texts)
	translatedNames1 := services.TranslateText(target, texts1)

	// Update meeting names
	for i := range questionnaires {
		questionnaires[i].Name = translatedNames[i]
		questionnaires[i].Details = translatedNames1[i]
	}

	if target == "zh" {
		questionnaires_zh := make([]models.QuestionnaireZh, len(questionnaires))
		for i, q := range questionnaires {
			copier.Copy(&questionnaires_zh[i], &q)
			if err := db.DB.Create(&questionnaires_zh[i]).Error; err != nil {
				fmt.Println(err.Error())
			}
		}
	}

	if target == "he" {
		questionnaires_he := make([]models.QuestionnaireHe, len(questionnaires))
		for i, q := range questionnaires {
			copier.Copy(&questionnaires_he[i], &q)
			if err := db.DB.Create(&questionnaires_he[i]).Error; err != nil {
				fmt.Println(err.Error())
			}
		}
	}
}

func translateQuestion(target string) {
	var questions []models.Question

	if err := db.DB.Find(&questions).Error; err != nil {
		fmt.Println(err.Error())
		return
	}

	// Prepare texts for translation
	texts := make([]string, len(questions))
	texts1 := make([]string, len(questions))
	texts2 := make([]string, len(questions))
	texts3 := make([]string, len(questions))
	for i, m := range questions {
		texts[i] = m.Question
		texts1[i] = m.Options
		texts2[i] = m.OptionNeedValue
		texts3[i] = m.ConditionOption
	}

	// TranslateText
	translatedNames := services.TranslateText(target, texts)
	translatedNames1 := services.TranslateText(target, texts1)
	translatedNames2 := services.TranslateText(target, texts2)
	translatedNames3 := services.TranslateText(target, texts3)

	// Update meeting names
	for i := range questions {
		questions[i].Question = translatedNames[i]
		questions[i].Options = translatedNames1[i]
		questions[i].OptionNeedValue = translatedNames2[i]
		questions[i].ConditionOption = translatedNames3[i]
	}

	if target == "zh" {
		questions_zh := make([]models.QuestionZh, len(questions))
		for i, q := range questions {
			copier.Copy(&questions_zh[i], &q)
			if err := db.DB.Create(&questions_zh[i]).Error; err != nil {
				fmt.Println(err.Error())
			}
		}
	}

	if target == "he" {
		questions_he := make([]models.QuestionHe, len(questions))
		for i, q := range questions {
			copier.Copy(&questions_he[i], &q)
			if err := db.DB.Create(&questions_he[i]).Error; err != nil {
				fmt.Println(err.Error())
			}
		}
	}
}

func AutoTranslate(c *gin.Context) {
	target := c.DefaultQuery("lang", "en")
	translateQuestionnaire(target)
	translateQuestion(target)
	c.JSON(http.StatusOK, gin.H{"msg": "Translate successfully"})
}

func GetQuestionnaireByIDs(c *gin.Context) {
	target := c.DefaultQuery("lang", "en")
	ids := strings.Split(c.Query("ids"), ",")

	if target == "en" {
		var questionnaires []models.Questionnaire
		if err := db.DB.Find(&questionnaires, ids).Error; err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var result []models.Questionnaire

		for _, id := range ids {
			for _, questionnaire := range questionnaires {
				id, _ := strconv.ParseUint(id, 10, 64)
				if uint64(questionnaire.ID) == id {
					result = append(result, questionnaire)
				}
			}
		}
		c.JSON(http.StatusOK, result)
		return
	}

	if target == "he" {
		var questionnaires_he []models.QuestionnaireHe
		if err := db.DB.Find(&questionnaires_he, ids).Error; err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var result []models.QuestionnaireHe

		for _, id := range ids {
			for _, questionnaire := range questionnaires_he {
				id, _ := strconv.ParseUint(id, 10, 64)
				if uint64(questionnaire.ID) == id {
					result = append(result, questionnaire)
				}
			}
		}
		c.JSON(http.StatusOK, result)
		return
	}

	if target == "zh" {
		var questionnaires_zh []models.QuestionnaireZh
		if err := db.DB.Find(&questionnaires_zh, ids).Error; err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var result []models.QuestionnaireZh

		for _, id := range ids {
			for _, questionnaire := range questionnaires_zh {
				id, _ := strconv.ParseUint(id, 10, 64)
				if uint64(questionnaire.ID) == id {
					result = append(result, questionnaire)
				}
			}
		}
		c.JSON(http.StatusOK, result)
		return
	}

}

func GetQuestionnaire(c *gin.Context) {
	parentID := c.Query("parentid")
	target := c.DefaultQuery("lang", "en")
	ID := c.Query("ID")
	name := c.Query(("name"))
	current, _ := strconv.Atoi(c.Query("current"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))

	if parentID != "" {
		if target == "en" {
			var questionnaires []models.Questionnaire
			if err := db.DB.Where("parent_id = ?", parentID).Order("id asc").Find(&questionnaires).Error; err != nil {
				fmt.Println(err.Error())
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, questionnaires)
			return
		}
		if target == "he" {
			var questionnaires_he []models.QuestionnaireHe
			if err := db.DB.Where("parent_id = ?", parentID).Order("id asc").Find(&questionnaires_he).Error; err != nil {
				fmt.Println(err.Error())
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, questionnaires_he)
			return
		}
		if target == "zh" {
			var questionnaires_zh []models.QuestionnaireZh
			if err := db.DB.Where("parent_id = ?", parentID).Order("id asc").Find(&questionnaires_zh).Error; err != nil {
				fmt.Println(err.Error())
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, questionnaires_zh)
			return
		}
	} else {
		var questionnaires []models.Questionnaire
		questionaireDb := db.DB.Model(&models.Questionnaire{})
		if ID != "" {
			questionaireDb = questionaireDb.Where("id = ?", ID)
		}
		if name != "" {
			questionaireDb = questionaireDb.Where("name like ?", "%"+name+"%")
		}
		if current != 0 && pageSize != 0 {
			var count int32
			questionaireDb.Count(&count)
			questionaireDb.Offset((current - 1) * pageSize).Limit(pageSize).Find(&questionnaires)
			c.JSON(http.StatusOK, gin.H{"count": count, "data": questionnaires})
		} else {
			questionaireDb.Find(&questionnaires)
			c.JSON(http.StatusOK, questionnaires)
		}
	}
}

// -------------------------------------------
func CreateQuestion(c *gin.Context) {
	var question models.Question
	if err := c.Bind(&question); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parameter error"})
		return
	}
	if err := db.DB.Create(&question).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Created successfully"})
}

func DeleteQuestion(c *gin.Context) {
	var question models.Question
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		question.ID = uint(id)
	}
	if err := db.DB.Delete(&question).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Deleted successfully"})
}

func ChangeQuestion(c *gin.Context) {
	var question models.Question
	if err := c.Bind(&question); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		question.ID = uint(id)
	}
	if err := db.DB.Save(&question).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Changed successfully"})
}

func GetQuestion(c *gin.Context) {
	target := c.DefaultQuery("lang", "en")
	var questionnaireid uint
	if id, err := strconv.Atoi(c.Param("id")); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		questionnaireid = uint(id)
	}

	if target == "en" {
		var questions []models.Question
		if err := db.DB.Where("questionnaire_id = ?", questionnaireid).Order("id asc").Find(&questions).Error; err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, questions)
		return
	}
	if target == "he" {
		var questions_he []models.QuestionHe
		if err := db.DB.Where("questionnaire_id = ?", questionnaireid).Order("id asc").Find(&questions_he).Error; err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, questions_he)
		return
	}
	if target == "zh" {
		var questions_zh []models.QuestionZh
		if err := db.DB.Where("questionnaire_id = ?", questionnaireid).Order("id asc").Find(&questions_zh).Error; err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, questions_zh)
		return
	}
}
