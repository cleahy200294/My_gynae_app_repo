// import-pqol installs the English P-QOL branch under an existing prolapse
// questionnaire. It previews by default and never changes existing questions.
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"prolapse-server/models"
)

type instrument struct {
	Name              string    `json:"name"`
	Version           string    `json:"version"`
	Language          string    `json:"language"`
	ScreeningQuestion string    `json:"screening_question"`
	TriggerAnswer     string    `json:"trigger_answer"`
	Sections          []section `json:"sections"`
}
type section struct {
	Name      string     `json:"name"`
	Details   string     `json:"details"`
	Questions []question `json:"questions"`
}
type question struct {
	Question string   `json:"question"`
	Options  []string `json:"options"`
}

func readInstrument(path string) (instrument, error) {
	var data instrument
	raw, err := os.ReadFile(path)
	if err != nil {
		return data, err
	}
	if err = json.Unmarshal(raw, &data); err != nil {
		return data, err
	}
	count := 0
	for _, section := range data.Sections {
		if section.Name == "" {
			return data, fmt.Errorf("section name is missing")
		}
		for _, question := range section.Questions {
			if question.Question == "" || len(question.Options) < 2 {
				return data, fmt.Errorf("incomplete question")
			}
			for _, option := range question.Options {
				if option == "" || strings.Contains(option, ",") {
					return data, fmt.Errorf("option cannot be represented by API: %q", option)
				}
			}
			count++
		}
	}
	if data.Language != "en" || data.Version != "4" || data.ScreeningQuestion == "" || data.TriggerAnswer != "Yes" || count != 38 || len(data.Sections) != 8 {
		return data, fmt.Errorf("expected English P-QOL version 4, 38 questions in 8 sections, and a Yes trigger")
	}
	return data, nil
}
func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
func run() error {
	path := flag.String("file", "questionnaire-data/pqol-v4.json", "reviewed instrument JSON")
	parentID := flag.Uint("parent-id", 0, "existing Pelvic organ prolapse questionnaire ID")
	apply := flag.Bool("apply", false, "write the reviewed branch to DB_DSN in one transaction")
	flag.Parse()
	data, err := readInstrument(*path)
	if err != nil {
		return err
	}
	fmt.Printf("P-QOL v4: 38 radio questions in 8 conditional sections; show only when %q = Yes. No scoring.\n", data.ScreeningQuestion)
	if !*apply {
		fmt.Println("Preview only. Use --parent-id ID --apply to install; no database accessed.")
		return nil
	}
	if *parentID == 0 {
		return fmt.Errorf("--parent-id is required")
	}
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		return fmt.Errorf("DB_DSN is required")
	}
	db, err := gorm.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("database connection failed")
	}
	defer db.Close()
	tx := db.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	defer tx.Rollback()
	var parent models.Questionnaire
	if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&parent, *parentID).Error; err != nil {
		return err
	}
	if parent.ParentID != 0 || !strings.Contains(strings.ToLower(parent.Name), "prolapse") {
		return fmt.Errorf("parent must be a top-level prolapse questionnaire")
	}
	const marker = "mygynae:pqol:v4:en"
	var count int
	if err := tx.Model(&models.Questionnaire{}).Where("parent_id = ? AND remark = ?", parent.ID, marker).Count(&count).Error; err != nil {
		return err
	}
	if count != 0 {
		return fmt.Errorf("P-QOL already installed under this parent; refusing to duplicate or overwrite")
	}
	var screens []models.Question
	if err := tx.Where("questionnaire_id = ? AND question = ?", parent.ID, data.ScreeningQuestion).Find(&screens).Error; err != nil {
		return err
	}
	var screen models.Question
	if len(screens) > 1 {
		return fmt.Errorf("multiple screening questions found; resolve before importing")
	}
	if len(screens) == 1 {
		screen = screens[0]
		if screen.Type != "Radio" || screen.Options != "Yes,No" || screen.Visible != 0 {
			return fmt.Errorf("existing screening question has incompatible choices or visibility")
		}
	} else {
		screen = models.Question{QuestionnaireID: parent.ID, Question: data.ScreeningQuestion, Type: "Radio", Options: "Yes,No"}
		if err := tx.Create(&screen).Error; err != nil {
			return err
		}
	}
	for _, section := range data.Sections {
		child := models.Questionnaire{Name: "P-QOL v4 — " + section.Name, Details: section.Details, Remark: marker, ComputeRule: "no", ParentID: parent.ID}
		if err := tx.Create(&child).Error; err != nil {
			return err
		}
		for _, item := range section.Questions {
			q := models.Question{QuestionnaireID: child.ID, Question: item.Question, Type: "Radio", Options: strings.Join(item.Options, ","), Visible: 1, ConditionID: screen.ID, ConditionOption: data.TriggerAnswer}
			if err := tx.Create(&q).Error; err != nil {
				return err
			}
		}
	}
	if err := tx.Commit().Error; err != nil {
		return err
	}
	fmt.Printf("Installed P-QOL under questionnaire %d with screening question %d. Link this parent to a meeting in the admin website.\n", parent.ID, screen.ID)
	return nil
}
