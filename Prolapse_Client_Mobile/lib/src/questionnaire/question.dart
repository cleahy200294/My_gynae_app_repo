import 'package:flutter/material.dart';

class Question extends StatefulWidget {
  final List<dynamic> questions;
  final List<dynamic> childrenQuestionnaires;

  const Question({
    Key? key,
    required this.questions,
    required this.childrenQuestionnaires,
  }) : super(key: key);

  @override
  QuestionState createState() => QuestionState();
}

class QuestionState extends State<Question> {
  List<dynamic> questions = [];
  List<dynamic> childrenQuestionnaires = [];
  Map<int, GlobalKey> questionKeys = {};

  @override
  void initState() {
    super.initState();
    questions = widget.questions;
    childrenQuestionnaires = widget.childrenQuestionnaires;
  }

  Map<int, dynamic> answers = {};

  GlobalKey? findFirstUnansweredQuestion() {
    List<dynamic> allQuestions = questions +
        childrenQuestionnaires.expand((c) => c['questions']).toList();

    for (var questionData in allQuestions) {
      int questionId = questionData['ID'];
      if (_shouldDisplayQuestion(questionData) && answers[questionId] == null) {
        return questionKeys[questionId];
      }
    }
    return null;
  }

  bool allQuestionsAnswered() {
    List<dynamic> allQuestions = questions +
        childrenQuestionnaires.expand((c) => c['questions']).toList();

    for (var questionData in allQuestions) {
      int questionId = questionData['ID'];
      if (_shouldDisplayQuestion(questionData) && answers[questionId] == null) {
        return false;
      }
    }
    return true;
  }

  bool _shouldDisplayQuestion(Map<String, dynamic> questionData) {
    if (questionData['visible'] == 0) {
      return true;
    }

    if (questionData['visible'] == 1 &&
        answers[questionData['conditionid']] ==
            questionData['conditionoption']) {
      return true;
    }

    return false;
  }

  Widget _buildRadioQuestion(Map<String, dynamic> questionData) {
    int questionId = questionData['ID'];
    List<String> options = questionData['option'].split(',');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: options.map((option) {
        return InkWell(
          onTap: () {
            setState(() {
              answers[questionId] = option;
            });
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 4.0),
            child: Row(
              children: [
                Radio<String>(
                  value: option,
                  groupValue: answers[questionId],
                  onChanged: (String? value) {
                    setState(() {
                      answers[questionId] = value;
                    });
                  },
                ),
                Expanded(child: Text(option)),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCheckboxQuestion(Map<String, dynamic> questionData) {
    int questionId = questionData['ID'];
    List<String> options = questionData['option'].split(',');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: options.map((option) {
        return InkWell(
          onTap: () {
            setState(() {
              answers[questionId] ??= [];
              if (answers[questionId]!.contains(option)) {
                answers[questionId]!.remove(option);
              } else {
                answers[questionId]!.add(option);
              }
            });
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 4.0),
            child: Row(
              children: [
                Checkbox(
                  value: answers[questionId]?.contains(option) ?? false,
                  onChanged: (bool? value) {
                    setState(() {
                      answers[questionId] ??= [];
                      if (value == true) {
                        answers[questionId]!.add(option);
                      } else {
                        answers[questionId]!.remove(option);
                      }
                    });
                  },
                ),
                Expanded(child: Text(option)),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildQuestion(Map<String, dynamic> questionData, int questionNumber) {
    final int questionId = questionData['ID'];
    final String questionType = questionData['type'];
    final String questionText = questionData['question'];
    final bool displayQuestion = _shouldDisplayQuestion(questionData);

    GlobalKey questionKey = questionKeys[questionId] ?? GlobalKey();
    questionKeys[questionId] = questionKey;

    List<Widget> questionWidgets = [
      Text(
        '$questionNumber. $questionText',
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 16,
          color: Colors.black54,
        ),
      ),
    ];

    if (questionType == 'Input') {
      questionWidgets.add(
        TextField(
          decoration: const InputDecoration(labelText: 'Answer'),
          onChanged: (String value) {
            setState(() {
              answers[questionId] = value;
            });
          },
        ),
      );
    } else if (questionType == 'Radio') {
      questionWidgets.add(_buildRadioQuestion(questionData));
    } else if (questionType == 'Checkbox') {
      questionWidgets.add(_buildCheckboxQuestion(questionData));
    }

    return Offstage(
      offstage: !displayQuestion,
      key: questionKey,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: questionWidgets,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    int questionNumber = 1;
    return SingleChildScrollView(
      child: Column(
        children: List<Widget>.generate(questions.length, (index) {
          Widget questionWidget =
              _buildQuestion(questions[index], questionNumber);
          if (_shouldDisplayQuestion(questions[index])) {
            questionNumber += 1;
          }
          return questionWidget;
        })
          ..addAll(childrenQuestionnaires.map((childQuestionnaire) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 16.0),
                  child: Text(
                    childQuestionnaire['name'],
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: Colors.blue,
                    ),
                  ),
                ),
                ...List<Widget>.generate(childQuestionnaire['questions'].length,
                    (index) {
                  Widget questionWidget = _buildQuestion(
                      childQuestionnaire['questions'][index], questionNumber);
                  if (_shouldDisplayQuestion(
                      childQuestionnaire['questions'][index])) {
                    questionNumber += 1;
                  }
                  return questionWidget;
                }),
              ],
            );
          })),
      ),
    );
  }
}
