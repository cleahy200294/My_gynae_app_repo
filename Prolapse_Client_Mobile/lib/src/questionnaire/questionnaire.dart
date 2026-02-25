import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/api/questionnaire.dart';
import 'package:prolapse_doctor_mobile/question_data.dart';
import 'package:prolapse_doctor_mobile/src/questionnaire/question.dart';
import 'package:prolapse_doctor_mobile/utils/util.dart';

import '../../generated/l10n.dart';
import '../success_screen/success.dart';

class QuestionnaireScreen extends StatefulWidget {
  const QuestionnaireScreen({super.key});

  @override
  State<QuestionnaireScreen> createState() => _QuestionnaireState();
}

class _QuestionnaireState extends State<QuestionnaireScreen> {
  final GlobalKey _stepperKey = GlobalKey();
  QuestionData qd = QuestionData();

  int _currentStep = 0;
  List<Step> steps = [];
  List<GlobalKey<QuestionState>> questionKeys = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      initQuestionnaires();
    });
  }

  void initQuestionnaires() async {
    qd.setContext(context);
    await qd.fetchQuestionnaires();
    questionKeys = List.generate(
        qd.questionnaires.length, (index) => GlobalKey<QuestionState>());

    setState(() {
      steps = _buildSteps(qd.questionnaires);
    });
  }

  List<Step> _buildSteps(List<dynamic> questionnaires) {
    List<Step> result = [];
    for (int i = 0; i < questionnaires.length; i++) {
      var questionnaire = questionnaires[i];
      result.add(Step(
        title: Text(questionnaire["name"]),
        isActive: _currentStep == i,
        content: Question(
          key: questionKeys[i],
          questions: questionnaire["questions"],
          childrenQuestionnaires: questionnaire["children"],
        ),
      ));
    }
    return result;
  }

  void _toNext() async {
    if (_currentStep < steps.length - 1) {
      setState(() {
        _currentStep += 1;
        steps = _buildSteps(qd.questionnaires);
      });
      await Future.delayed(const Duration(milliseconds: 100));
      if (_stepperKey.currentContext != null) {
        Scrollable.ensureVisible(
          _stepperKey.currentContext!,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    } else {
      // Generate answers data and send to doctor
      Map<String, dynamic> formattedAnswers = _generateFormattedAnswers();
      // Call your HTTP request function here to send the formattedAnswers to the server.
      try {
        await answerQuestion(qd.purposeId, json.encode(formattedAnswers), true);
        // ignore: use_build_context_synchronously
        Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => const SuccessPage()),
            (_) => false);
      } catch (e) {
        showToast(context, e.toString().replaceFirst('Exception: ', ''));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xff0147a6),
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios),
            color: Colors.white,
            onPressed: () => Navigator.pop(context),
          ),
          title: Text(
            S.of(context).questionnaire,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        floatingActionButton: qd.purposeId != qd.firstMeetingId &&
                qd.questionnaires.isNotEmpty &&
                qd.questionnaires[_currentStep]["skip"] == 1
            ? FloatingActionButton(
                onPressed: () {
                  _toNext();
                },
                child: Text(
                  S.of(context).skip,
                  style: const TextStyle(color: Color(0xff0147a6)),
                ))
            : null,
        body: Theme(
          data: ThemeData(
            elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xff0147a6), // 设置按钮颜色为蓝色
              ),
            ),
          ),
          child: steps.isEmpty
              ? Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  // ignore: prefer_const_literals_to_create_immutables
                  children: [
                    const Center(child: CircularProgressIndicator()),
                  ],
                )
              : Stepper(
                  key: _stepperKey,
                  steps: steps,
                  currentStep: _currentStep,
                  onStepTapped: (int step) {},
                  onStepContinue: () async {
                    GlobalKey<QuestionState> currentQuestionKey =
                        questionKeys[_currentStep];
                    if (!currentQuestionKey.currentState!
                        .allQuestionsAnswered()) {
                      showToast(context, S.of(context).all_question);

                      GlobalKey? firstUnansweredQuestionKey = currentQuestionKey
                          .currentState!
                          .findFirstUnansweredQuestion();
                      if (firstUnansweredQuestionKey != null) {
                        // Add a delay before scrolling to ensure the GlobalKey has a non-null context.
                        await Future.delayed(const Duration(milliseconds: 100));
                        if (firstUnansweredQuestionKey.currentContext != null) {
                          Scrollable.ensureVisible(
                            firstUnansweredQuestionKey.currentContext!,
                            alignment: 0.2,
                            duration: const Duration(milliseconds: 500),
                            curve: Curves.easeInOut,
                          );
                        }
                      }
                      return;
                    }
                    _toNext();
                  },
                  onStepCancel: () {
                    if (_currentStep > 0) {
                      setState(() {
                        _currentStep -= 1;
                        steps = _buildSteps(qd.questionnaires);
                      });
                    }
                  },
                  controlsBuilder:
                      (BuildContext context, ControlsDetails details) {
                    return Row(
                      children: <Widget>[
                        TextButton(
                          onPressed: details.onStepCancel,
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 18),
                            foregroundColor: Colors.black54, // 修改按钮文本颜色
                          ),
                          child: Text(S.of(context).prev),
                        ),
                        const SizedBox(width: 8.0), // 为按钮添加间距
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xff0147a6),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 18),
                            shape: const RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(10)),
                            ),
                          ),
                          onPressed: details.onStepContinue,
                          child: Text(
                            _currentStep == steps.length - 1
                                ? S.of(context).send_details
                                : S.of(context).next,
                            style: const TextStyle(
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
        ));
  }

  Map<String, dynamic> _generateFormattedAnswers() {
    Map<String, dynamic> result = {};

    // Iterate through all questionnaires
    for (int i = 0; i < questionKeys.length; i++) {
      GlobalKey<QuestionState> key = questionKeys[i];
      List<dynamic> questionnaires = qd.questionnaires;
      int questionnaireId = questionnaires[i]['ID'];

      // Get the answers for the parent questionnaire
      Map<int, dynamic> answers =
          key.currentState != null ? key.currentState!.answers : {};

      Map<String, dynamic> allAnswers = {};
      for (var answer in answers.entries) {
        allAnswers[answer.key.toString()] = answer.value;
      }

      // Iterate through the child questionnaires
      List<dynamic> childQuestionnaires = questionnaires[i]['children'];
      for (int j = 0; j < childQuestionnaires.length; j++) {
        int childQuestionnaireId = childQuestionnaires[j]['ID'];
        List<dynamic> qs = childQuestionnaires[j]["questions"];
        List<String> qids = [];
        for (var element in qs) {
          qids.add(element["ID"].toString());
        }
        // Store the answers for the child questionnaire
        Map<String, dynamic> childAnswers = {};
        allAnswers.forEach((questionId, answer) {
          if (qids.contains(questionId)) {
            childAnswers[questionId] = answer;
          }
        });

        // Remove child answers from the parent answers
        childAnswers.forEach((questionId, _) {
          allAnswers.remove(questionId);
        });

        // Add the child answers to the result
        if (childAnswers.isNotEmpty) {
          result[childQuestionnaireId.toString()] = childAnswers;
        }
      }

      // Add the remaining parent answers to the result
      if (allAnswers.isNotEmpty) {
        result[questionnaireId.toString()] = allAnswers;
      }
    }

    return result;
  }
}
