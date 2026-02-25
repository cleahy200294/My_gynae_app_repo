import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/api/questionnaire.dart';
import 'package:prolapse_doctor_mobile/utils/util.dart';

class QuestionData {
  static final QuestionData _instance = QuestionData._internal();
  QuestionData._internal();
  factory QuestionData() {
    return _instance;
  }

  late int purposeId;
  late String questionnaireIds;
  late BuildContext _context;
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
    _context = context;
    lang = Localizations.localeOf(context).languageCode;
  }

  Future<List<dynamic>> fetchQuestionnaires() async {
    try {
      List<dynamic> result =
          await getQuestionnaireByIDs(questionnaireIds, lang);
      for (var element in result) {
        int id = element['ID'];
        element['questions'] = await fetchQuestions(id);
        element['children'] = await fetchChildren(id);
        questionnaires.add(element);
      }
      return questionnaires;
    } catch (e) {
      showToast(_context, e.toString().replaceFirst('Exception: ', ''));
      return [];
    }
  }

  Future<List<dynamic>> fetchQuestions(int id) async {
    try {
      List<dynamic> result = await getQuestion(id, lang);
      return result;
    } catch (e) {
      showToast(_context, e.toString().replaceFirst('Exception: ', ''));
      return [];
    }
  }

  Future<List<dynamic>> fetchChildren(int id) async {
    try {
      List<dynamic> result = await getQuestionnaire(id, lang);
      if (result.isNotEmpty) {
        for (var element in result) {
          int id = element['ID'];
          element['questions'] = await fetchQuestions(id);
        }
      }
      return result;
    } catch (e) {
      showToast(_context, e.toString().replaceFirst('Exception: ', ''));
      return [];
    }
  }
}
