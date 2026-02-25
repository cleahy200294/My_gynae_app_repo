import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/question_data.dart';
import 'package:prolapse_doctor_mobile/src/questionnaire/questionnaire.dart';

import '../../generated/l10n.dart';

class PurposeBox extends StatelessWidget {
  final List<dynamic> items;

  const PurposeBox({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(32),
      child: Column(children: [
        Text(
          S.of(context).purpose_of_visiting,
          style: const TextStyle(
            color: Color(0xff0147a6),
            fontSize: 24.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 18),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: items.length,
          itemBuilder: (context, index) {
            return Padding(
              padding: const EdgeInsets.all(8.0),
              child: ElevatedButton(
                onPressed: () {
                  QuestionData qd = QuestionData();
                  qd.setPurpose(items[index]['ID']);
                  qd.setQuestionnaireIds(items[index]['questionnaires']);
                  qd.resetMap();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const QuestionnaireScreen()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xff0147a6),
                  minimumSize: const Size(double.infinity, 60),
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.all(Radius.circular(10)),
                  ),
                ),
                child: Text(
                  items[index]["name"],
                  style: const TextStyle(
                    fontSize: 18,
                    color: Color(0xffffffff),
                  ),
                ),
              ),
            );
          },
        ),
      ]),
    );
  }
}
