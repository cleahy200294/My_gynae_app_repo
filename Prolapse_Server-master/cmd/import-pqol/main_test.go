package main

import "testing"

func TestSourceInstrument(t *testing.T) {
	data, err := readInstrument("../../questionnaire-data/pqol-v4.json")
	if err != nil {
		t.Fatal(err)
	}
	// Preserve the source PDF's unusual impact-choice order; do not infer scores.
	options := data.Sections[0].Questions[1].Options
	if options[1] != "Moderately" || options[2] != "A little" {
		t.Fatal(options)
	}
	symptoms := data.Sections[1]
	if len(symptoms.Questions) != 17 || symptoms.Questions[0].Options[0] != "Not applicable" {
		t.Fatal("symptom scale changed")
	}
}
