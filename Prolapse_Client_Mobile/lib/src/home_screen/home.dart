// ignore_for_file: non_constant_identifier_names

import 'package:draggable_home/draggable_home.dart';
import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/api/meeting.dart';
import 'package:prolapse_doctor_mobile/question_data.dart';
import 'package:prolapse_doctor_mobile/src/privacy_screen/privacy.dart';
import 'package:prolapse_doctor_mobile/src/start_screen/start.dart';
import 'package:prolapse_doctor_mobile/widgets/home/header_widget.dart';
import 'package:prolapse_doctor_mobile/widgets/home/purpose_box.dart';
import 'package:prolapse_doctor_mobile/widgets/home/specialities_box.dart';

import '../../generated/l10n.dart';

class HomeScreen extends StatefulWidget {
  final int userStatus;
  final Future<List<dynamic>> Function(String) loadMeetings;
  const HomeScreen(
      {super.key,
      required this.userStatus,
      this.loadMeetings = getMeetingList});

  @override
  State<HomeScreen> createState() => _HomeState();
}

class _HomeState extends State<HomeScreen> {
  List<dynamic> _meetings = [];
  bool _loading = true;
  bool _loadFailed = false;

  // Filter at render time: the profile can arrive after the meeting request.
  List<dynamic> get items => _meetings
      .where((meeting) => widget.userStatus == 0
          ? meeting['type'] == 1
          : widget.userStatus == 1 && meeting['type'] != 1)
      .toList();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _fetchMeetingData();
    });
  }

  Future<void> _fetchMeetingData() async {
    setState(() {
      _loading = true;
      _loadFailed = false;
    });
    try {
      final result = await widget
          .loadMeetings(Localizations.localeOf(context).languageCode);
      if (!mounted) return;
      final firstMeetings = result.where((meeting) => meeting['type'] == 1);
      QuestionData().firstMeetingId =
          firstMeetings.isEmpty ? 0 : firstMeetings.first['ID'];
      setState(() {
        _meetings = result;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      if (e.toString().replaceFirst('Exception: ', '') == '401') {
        Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => const StartScreen()),
            (_) => false);
        return;
      }
      setState(() {
        _loading = false;
        _loadFailed = true;
      });
    }
  }

  Widget _questionnaireAccess() {
    if (_loading) {
      return const Padding(
        padding: EdgeInsets.all(24),
        child: Center(child: CircularProgressIndicator()),
      );
    }
    if (!_loadFailed && items.isNotEmpty) return PurposeBox(items: items);
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(children: [
        Text(S.of(context).questionnaire,
            style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xff0147a6))),
        const SizedBox(height: 12),
        Text(
            _loadFailed
                ? 'We could not load your questionnaires. Please try again.'
                : 'No questionnaires are available for your visit yet. '
                    'Please contact the clinic to arrange them.',
            textAlign: TextAlign.center),
        TextButton.icon(
          onPressed: _fetchMeetingData,
          icon: const Icon(Icons.refresh),
          label: const Text('Retry'),
        ),
      ]),
    );
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
        _questionnaireAccess(),
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
