// ignore_for_file: non_constant_identifier_names

import 'package:draggable_home/draggable_home.dart';
import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/api/meeting.dart';
import 'package:prolapse_doctor_mobile/question_data.dart';
import 'package:prolapse_doctor_mobile/src/privacy_screen/privacy.dart';
import 'package:prolapse_doctor_mobile/src/start_screen/start.dart';
import 'package:prolapse_doctor_mobile/utils/util.dart';
import 'package:prolapse_doctor_mobile/widgets/home/doctor_box.dart';
import 'package:prolapse_doctor_mobile/widgets/home/header_widget.dart';
import 'package:prolapse_doctor_mobile/widgets/home/purpose_box.dart';
import 'package:prolapse_doctor_mobile/widgets/home/specialities_box.dart';

import '../../generated/l10n.dart';

class HomeScreen extends StatefulWidget {
  final int userStatus;
  const HomeScreen({Key? key, required this.userStatus}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeState();
}

class _HomeState extends State<HomeScreen> {
  List<dynamic> items = [];
  late int userStatus;

  @override
  void initState() {
    super.initState();
    userStatus = widget.userStatus;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      var locale = Localizations.localeOf(context).languageCode;
      _fetchMeetingData(locale);
    });
  }

  @override
  void didUpdateWidget(HomeScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.userStatus != oldWidget.userStatus) {
      setState(() {
        userStatus = widget.userStatus;
      });
    }
  }

  void _fetchMeetingData(locale) async {
    try {
      List<dynamic> result = await getMeetingList(locale);
      List<dynamic> result1 = [];
      for (var element in result) {
        if (element["type"] == 1) {
          QuestionData qd = QuestionData();
          qd.firstMeetingId = element["ID"];
          if (userStatus == 0) {
            result1.add(element);
          }
        } else if (userStatus == 1) {
          result1.add(element);
        }
      }
      setState(() {
        items = result1;
      });
    } catch (e) {
      if (e.toString().replaceFirst('Exception: ', '') == '401') {
        Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => const StartScreen()),
            (_) => false);
        return;
      }
      showToast(context, e.toString().replaceFirst('Exception: ', ''));
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableHome(
      title: Text(
        S.of(context).logo,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      headerWidget: const HeaderWidget(),
      body: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                'Welcome to MyGynae Pelvic Health Centre',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'We look forward to guiding you on your health journey.\n\n'
                'If you are awaiting your first appointment, then please click the "First Meeting" and answer the questions as directed.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
        ),
        PurposeBox(items: items),
        const SpecialitiesBox(),
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Center(
            child: TextButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const PrivacyPage()),
                );
              },
              icon: const Icon(
                Icons.privacy_tip,
                color: Color(0xff0147a6),
              ),
              label: Text(
                S.of(context).privacy,
                style: const TextStyle(
                  fontSize: 16,
                  color: Color(0xff0147a6),
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ),
        ),
      ],
      fullyStretchable: false,
      backgroundColor: Colors.white,
      appBarColor: const Color(0xff0147a6),
    );
  }
}
