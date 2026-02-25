import "package:prolapse_doctor_mobile/utils/request.dart";

Future<List<dynamic>> getQuestionnaire(int parentId, String lang) async {
  try {
    final response =
        await getList("/survey/questionnaire?parentid=$parentId&lang=$lang");
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}

Future<List<dynamic>> getQuestion(int id, String lang) async {
  try {
    final response = await getList("/survey/question/$id?lang=$lang");
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}

Future<Map<String, dynamic>> answerQuestion(
    int purpose, String answermap, bool agreeable) async {
  try {
    final response = await post('/answer/details', body: {
      "purpose": purpose.toString(),
      "answermap": answermap,
      "agreeable": agreeable ? "1" : "0",
    });
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}

Future<List<dynamic>> getQuestionnaireByIDs(String ids, String lang) async {
  try {
    final response =
        await getList("/survey/questionnairebyids?ids=$ids&lang=$lang");
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}
