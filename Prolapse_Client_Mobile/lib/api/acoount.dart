import 'package:prolapse_doctor_mobile/utils/request.dart';

Future<Map<String, dynamic>> logIn(Map<String, dynamic> data) async {
  try {
    final response = await post('/account/login', body: {...data, "role": "1"});
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}

Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
  try {
    final response =
        await post('/account/register', body: {...data, "role": "1"});
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}

Future<Map<String, dynamic>> sendCaptcha(String email) async {
  try {
    final response =
        await post('/account/email/captcha', body: {"email": email});
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}

Future<Map<String, dynamic>> resetPassword(Map<String, dynamic> data) async {
  try {
    final response = await post('/account/reset', body: {...data, "role": "1"});
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}

Future<Map<String, dynamic>> deleteAccount() async {
  try {
    final response = await post('/user/delete');
    return response;
  } catch (e) {
    throw Exception(e.toString().replaceFirst('Exception: ', ''));
  }
}
