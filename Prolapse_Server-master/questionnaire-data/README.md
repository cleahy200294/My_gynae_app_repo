# Conditional P-QOL v4

`pqol-v4.json` transcribes the supplied `P-QOL.pdf`: 38 single-choice items in eight sections. The source is the English Version 4 provided in this workspace. Question wording and option order are preserved (including the unusual “Moderately” before “A little” for prolapse impact). The PDF's name/age/date fields are not additional questionnaire items; patient identity belongs to the existing account/profile.

The user's requested routing is separate from the instrument text: show P-QOL only after **Yes** to the existing CSV question “Do you usually have a bulge or something falling out that you can see or feel in the vaginal area?” This reports symptoms; it does not record a diagnosis. The PDF's instruction to complete the form even without prolapse is retained inside the questionnaire and does not override that routing request.

## Preview and install

From `Prolapse_Server-master`:

```sh
go run ./cmd/import-pqol
```

This validates and previews the instrument without connecting to a database. To install into a configured database, set `DB_DSN` securely and run:

```sh
go run ./cmd/import-pqol --parent-id 18 --apply
```

Confirm the target parent ID for the chosen database; 18 was the existing hosted “Pelvic organ prolapse” questionnaire when inspected. The importer locks the parent and uses one transaction. It reuses an exactly matching Yes/No screening question or creates it if missing, creates eight child sections, and gives every P-QOL question a `visible=1` condition pointing to that screening question's actual database ID. It refuses duplicate imports and incompatible existing screening questions; it never overwrites existing questions or creates meeting assignments.

In the admin website's **Meeting** section, include the **parent prolapse questionnaire** in the intended visit (such as First Meeting). Do not select the eight child sections independently: their condition depends on the screening question in the parent. The app fetches the parent and children together. A Yes answer reveals all eight sections; No hides them and excludes their answers from submission.

Deploy the updated mobile code with the data configuration. The importer can use the existing schema. The controller ordering change makes question and section order explicit; deploy that backend change to guarantee source order.

Only English data is supplied here. No translation, PISQ-IR, KHQ, score formula, severity interpretation, or patient records are added. Scores remain disabled (`computerule=no`); the PDF contains no scoring algorithm. This does not restore the other missing question banks or create the missing hosted meeting entries.

## Validation

```sh
go test ./cmd/import-pqol
```

The mobile `test/prolapse_questionnaire_test.dart` builds the actual JSON instrument and checks unanswered/No/Yes/Yes-to-No paths, including exclusion of hidden answers.
