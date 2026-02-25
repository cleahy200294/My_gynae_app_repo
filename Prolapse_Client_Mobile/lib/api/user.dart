import "package:prolapse_doctor_mobile/utils/request.dart";

Future<Map<String, dynamic>> getUserInfo() async {
  try {
    final response = await get('/user/information');
    return response["information"];
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}

Future<Map<String, dynamic>> saveUserInfo(Map<String, dynamic> data) async {
  try {
    final response = await post('/user/information', body: data);
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}
