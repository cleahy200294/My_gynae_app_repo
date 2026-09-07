import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:prolapse_doctor_mobile/generated/l10n.dart';
import 'package:prolapse_doctor_mobile/src/home_screen/home.dart';

void main() {
  Widget app(int status, Future<List<dynamic>> Function(String) load) =>
      MaterialApp(
        localizationsDelegates: const [
          S.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate
        ],
        supportedLocales: S.delegate.supportedLocales,
        home: HomeScreen(userStatus: status, loadMeetings: load),
      );

  testWidgets('refreshes visit buttons when profile status arrives later',
      (tester) async {
    final meetings = [
      {'ID': 1, 'name': 'First Meeting', 'type': 1, 'questionnaires': '11'},
      {'ID': 2, 'name': 'Follow-up', 'type': 2, 'questionnaires': '12'},
    ];
    Future<List<dynamic>> load(String _) async => meetings;
    await tester.pumpWidget(app(0, load));
    await tester.pumpAndSettle();
    expect(find.text('First Meeting'), findsOneWidget);
    expect(find.text('Follow-up'), findsNothing);
    await tester.pumpWidget(app(1, load));
    await tester.pumpAndSettle();
    expect(find.text('Follow-up'), findsOneWidget);
    expect(find.text('First Meeting'), findsNothing);
  });

  testWidgets('empty meeting configuration displays a message and retry',
      (tester) async {
    await tester.pumpWidget(app(0, (_) async => []));
    await tester.pumpAndSettle();
    expect(
        find.textContaining('No questionnaires are available'), findsOneWidget);
    expect(find.text('Retry'), findsOneWidget);
    expect(find.byType(CircularProgressIndicator), findsNothing);
  });

  testWidgets('failed loading can be retried successfully', (tester) async {
    var attempts = 0;
    Future<List<dynamic>> load(String _) async {
      if (attempts++ == 0) throw Exception('Offline');
      return [
        {'ID': 1, 'name': 'First Meeting', 'type': 1, 'questionnaires': '11'}
      ];
    }

    await tester.pumpWidget(app(0, load));
    await tester.pumpAndSettle();
    expect(find.textContaining('could not load'), findsOneWidget);
    await tester.ensureVisible(find.text('Retry'));
    await tester.tap(find.text('Retry'));
    await tester.pumpAndSettle();
    expect(find.text('First Meeting'), findsOneWidget);
  });
}
