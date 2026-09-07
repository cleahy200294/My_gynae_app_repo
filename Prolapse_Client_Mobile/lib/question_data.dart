import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/api/questionnaire.dart';

class QuestionData {
  static final QuestionData _instance = QuestionData._internal();
  QuestionData._internal();
  factory QuestionData() {
    return _instance;
  }

  late int purposeId;
  late String questionnaireIds;
  late String lang;
  int firstMeetingId = 0;
  List<dynamic> questionnaires = [];

  void setPurpose(int id) {
    purposeId = id;
  }

  void setQuestionnaireIds(String ids) {
    questionnaireIds = ids;
  }

  void resetMap() {
    questionnaires = [];
  }

  void setContext(BuildContext context) {
    lang = Localizations.localeOf(context).languageCode;
  }

  Future<List<dynamic>> fetchQuestionnaires() async {
    final result = await getQuestionnaireByIDs(questionnaireIds, lang);
    final loaded = <dynamic>[];
    for (final element in result) {
      final id = element['ID'] as int;
      element['questions'] = await fetchQuestions(id);
      element['children'] = await fetchChildren(id);
      loaded.add(element);
    }
    if (loaded.isNotEmpty &&
        !loaded.any((questionnaire) =>
            (questionnaire['questions'] as List).isNotEmpty ||
            (questionnaire['children'] as List)
                .any((child) => (child['questions'] as List).isNotEmpty))) {
      throw StateError('No questions are configured for this visit.');
    }
    // Publish only a complete load so retries cannot duplicate or omit answers.
    questionnaires = loaded;
    return questionnaires;
  }

  Future<List<dynamic>> fetchQuestions(int id) => getQuestion(id, lang);

  Future<List<dynamic>> fetchChildren(int id) async {
    final result = await getQuestionnaire(id, lang);
    for (final element in result) {
      element['questions'] = await fetchQuestions(element['ID'] as int);
    }
    return result;
  }
}
