import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:prolapse_doctor_mobile/src/questionnaire/question.dart';

void main() {
  testWidgets('P-QOL appears only for Yes and hidden responses are excluded',
      (tester) async {
    final source = jsonDecode(
        File('../Prolapse_Server-master/questionnaire-data/pqol-v4.json')
            .readAsStringSync());
    final key = GlobalKey<QuestionState>();
    var id = 100;
    final children = <dynamic>[];
    for (final section in source['sections']) {
      children.add({
        'ID': id++,
        'name': 'P-QOL v4 — ${section['name']}',
        'details': section['details'],
        'questions': [
          for (final q in section['questions'])
            {
              'ID': id++,
              'question': q['question'],
              'type': 'Radio',
              'option': (q['options'] as List).join(','),
              'visible': 1,
              'conditionid': 28,
              'conditionoption': 'Yes',
            }
        ],
      });
    }
    await tester.pumpWidget(MaterialApp(
        home: Scaffold(
            body: Question(
      key: key,
      questions: [
        {
          'ID': 28,
          'question': source['screening_question'],
          'type': 'Radio',
          'option': 'Yes,No',
          'visible': 0
        }
      ],
      childrenQuestionnaires: children,
    ))));
    expect(find.text('P-QOL v4 — General health'), findsNothing);
    expect(key.currentState!.allQuestionsAnswered(), isFalse);
    await tester.tap(find.text('No'));
    await tester.pump();
    expect(key.currentState!.allQuestionsAnswered(), isTrue);
    expect(key.currentState!.visibleAnswers, {28: 'No'});
    await tester.tap(find.text('Yes'));
    await tester.pump();
    expect(find.text('P-QOL v4 — General health'), findsOneWidget);
    expect(key.currentState!.allQuestionsAnswered(), isFalse);
    await tester.tap(find.text('Very good'));
    await tester.pump();
    expect(key.currentState!.visibleAnswers.length, 2);
    await tester.tap(find.text('No'));
    await tester.pump();
    expect(find.text('P-QOL v4 — General health'), findsNothing);
    expect(key.currentState!.allQuestionsAnswered(), isTrue);
    expect(key.currentState!.visibleAnswers, {28: 'No'});
    expect(tester.takeException(), isNull);
  });
}
