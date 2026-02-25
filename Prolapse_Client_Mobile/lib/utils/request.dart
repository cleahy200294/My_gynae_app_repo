import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

const String _baseUrl = 'https://cs1.ucc.ie/yanlin/prolapse';
// const String _baseUrl = '127.0.0.1:8080';

Future<Map<String, dynamic>> get(String path) async {
  final response = await http.get(Uri.parse('$_baseUrl$path'),
      headers: await _getAuthHeaders());
  return _handleResponse(response);
}

Future<List<dynamic>> getList(String path) async {
  final response = await http.get(Uri.parse('$_baseUrl$path'),
      headers: await _getAuthHeaders());
  return _handleResponseList(response);
}

Future<Map<String, dynamic>> post(String path, {Object? body}) async {
  final response = await http.post(Uri.parse('$_baseUrl$path'),
      headers: await _getAuthHeaders(), body: body);
  return _handleResponse(response);
}

Future<Map<String, dynamic>> put(String path, {Object? body}) async {
  final response = await http.put(Uri.parse('$_baseUrl$path'),
      headers: await _getAuthHeaders(), body: body);
  return _handleResponse(response);
}

Future<Map<String, dynamic>> delete(String path) async {
  final response = await http.delete(Uri.parse('$_baseUrl$path'),
      headers: await _getAuthHeaders());
  return _handleResponse(response);
}

Future<Map<String, String>?> _getAuthHeaders() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString('token');

  if (token != null) {
    return {'token': token};
  } else {
    return null;
  }
}

List<dynamic> _handleResponseList(http.Response response) {
  final responseBody = json.decode(response.body);

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return responseBody;
  } else if (response.statusCode == 401) {
    throw Exception(401);
  } else if (responseBody.containsKey('error')) {
    throw Exception('Server error: ${responseBody['error']}');
  } else {
    throw Exception('Failed to fetch http request: ${response.statusCode}');
  }
}

Map<String, dynamic> _handleResponse(http.Response response) {
  final responseBody = json.decode(response.body);

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return responseBody;
  } else if (responseBody.containsKey('error')) {
    throw Exception('Server error: ${responseBody['error']}');
  } else {
    throw Exception('Failed to fetch http request: ${response.statusCode}');
  }
}
