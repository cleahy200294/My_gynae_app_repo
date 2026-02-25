import "package:prolapse_doctor_mobile/utils/request.dart";

Future<List<dynamic>> getMeetingList(String lang) async {
  try {
    final response = await getList('/meet/meeting?lang=$lang');
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}
