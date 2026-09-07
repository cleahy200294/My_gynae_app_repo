package services

import (
	"context"
	"fmt"
	"os"
	"strings"

	translate "cloud.google.com/go/translate/apiv3"
	"cloud.google.com/go/translate/apiv3/translatepb"
)

func TranslateText(targetLang string, text []string) []string {
	if len(text) == 1 && text[0] == "" {
		return text
	}
	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	if projectID == "" {
		fmt.Println("GOOGLE_CLOUD_PROJECT is required for translation")
		return nil
	}
	sourceLang := "en"

	var result []string

	// Instantiates a client
	ctx := context.Background()
	client, err := translate.NewTranslationClient(ctx)
	if err != nil {
		fmt.Println("NewTranslationClient", err)
		return result
	}
	defer client.Close()

	// Construct request
	req := &translatepb.TranslateTextRequest{
		Parent:             fmt.Sprintf("projects/%s/locations/global", projectID),
		SourceLanguageCode: sourceLang,
		TargetLanguageCode: targetLang,
		MimeType:           "text/plain",
		Contents:           []string{strings.Join(text, "\n")},
	}

	resp, err := client.TranslateText(ctx, req)
	if err != nil {
		fmt.Println("TranslateText", err)
		return result
	}

	for _, translation := range resp.GetTranslations() {
		rtext := strings.Replace(translation.GetTranslatedText(), "，", ", ", -1)
		rtext1 := strings.Replace(rtext, "、", ", ", -1)
		result = strings.Split(rtext1, "\n")
	}

	fmt.Println(result)

	return result
}
