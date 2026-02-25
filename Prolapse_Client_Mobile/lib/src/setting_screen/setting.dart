// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/api/acoount.dart';
import 'package:prolapse_doctor_mobile/api/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../generated/l10n.dart';
import '../../utils/util.dart';
import '../privacy_screen/privacy.dart';
import '../start_screen/start.dart';

class SettingScreen extends StatefulWidget {
  const SettingScreen({Key? key}) : super(key: key);

  @override
  State<SettingScreen> createState() => _SettingScreen();
}

class _SettingScreen extends State<SettingScreen> {
  String _firstName = "";
  String _surname = "";
  String _email = "";

  void _fetchUserData() async {
    try {
      Map<String, dynamic> result = await getUserInfo();
      setState(() {
        _email = result["email"];
      });
      if (result['ID'] == 0) {
        return;
      }
      setState(() {
        _firstName = result["firstname"];
        _surname = result["surname"];
      });
    } catch (e) {
      showToast(context, e.toString().replaceFirst('Exception: ', ''));
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchUserData();
  }

  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(S.of(context).alert),
          content: Text(S.of(context).alertmessage),
          actions: <Widget>[
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xff91a7f6),
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                ),
              ),
              child: const Text(
                '取消',
                style: TextStyle(
                  fontSize: 18,
                  color: Color(0xffffffff),
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () async {
                try {
                  await deleteAccount();
                  SharedPreferences prefs =
                      await SharedPreferences.getInstance();
                  prefs.clear();
                  Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const StartScreen()),
                      (_) => false);
                } catch (e) {
                  showToast(
                      context, e.toString().replaceFirst('Exception: ', ''));
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xff0147a6),
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                ),
              ),
              child: const Text(
                '确定',
                style: TextStyle(
                  fontSize: 18,
                  color: Color(0xffffffff),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(16, 40, 16, 16),
              decoration: const BoxDecoration(
                color: Color(0xff0147a6),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios),
                    color: Colors.white,
                    onPressed: () => Navigator.pop(context),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    // ignore: prefer_const_literals_to_create_immutables
                    children: [
                      Text(
                        "$_firstName $_surname",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 24,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _email,
                        style: const TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Expanded(
              child: Padding(
                // 添加Padding小部件
                padding: const EdgeInsets.all(16.0), // 设置ListView的外部间距
                child: ListView(
                  children: <Widget>[
                    ListTile(
                      leading:
                          const Icon(Icons.privacy_tip, color: Colors.blue),
                      title: Text(
                        S.of(context).privacy,
                        style: const TextStyle(fontSize: 18),
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const PrivacyPage()),
                        );
                      },
                    ),
                    const Divider(), // 分割线
                    ListTile(
                      leading: const Icon(Icons.person_off, color: Colors.red),
                      title: Text(
                        S.of(context).cancellation,
                        style: const TextStyle(fontSize: 18),
                      ),
                      onTap: _showDeleteConfirmation,
                    ),
                    const Divider(), // 分割线
                    ListTile(
                      leading:
                          const Icon(Icons.exit_to_app, color: Colors.green),
                      title: Text(
                        S.of(context).logout,
                        style: const TextStyle(fontSize: 18),
                      ),
                      onTap: () async {
                        SharedPreferences prefs =
                            await SharedPreferences.getInstance();
                        prefs.clear();
                        Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const StartScreen()),
                            (_) => false);
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ));
  }
}
