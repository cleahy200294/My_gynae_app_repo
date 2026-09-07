import 'package:flutter_test/flutter_test.dart';
import 'package:prolapse_doctor_mobile/utils/request.dart';

void main() {
  test('uses an HTTPS API endpoint', () {
    final endpoint = Uri.parse(apiBaseUrl);
    expect(endpoint.scheme, 'https');
    expect(endpoint.host, isNotEmpty);
    expect(endpoint.path, isEmpty);
  });
}
