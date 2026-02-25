// ignore_for_file: use_build_context_synchronously

import 'package:prolapse_doctor_mobile/api/user.dart';
import 'package:prolapse_doctor_mobile/src/home_screen/home.dart';
import 'package:prolapse_doctor_mobile/src/start_screen/start.dart';
import 'package:salomon_bottom_bar/salomon_bottom_bar.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../generated/l10n.dart';
import '../my_screen/my.dart';

class BasicScreen extends StatefulWidget {
  const BasicScreen({Key? key}) : super(key: key);

  @override
  State<BasicScreen> createState() => _BasicScreenState();
}

class _BasicScreenState extends State<BasicScreen> {
  int currentIndex = 0;
  int userStatus = 0;

  @override
  void initState() {
    super.initState();
    isLogin();
  }

  void isLogin() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    if (token == null) {
      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const StartScreen()),
          (_) => false);
      return;
    }
    final userInfo = await getUserInfo();
    setState(() {
      userStatus = userInfo["status"];
    });
    if (userInfo['ID'] == 0) {
      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const MyScreen()),
          (_) => false);
    }
  }

  void changePage(int index) {
    setState(() {
      currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pagelist = <Widget>[
      HomeScreen(userStatus: userStatus),
      const MyScreen()
    ];
    return Scaffold(
        // backgroundColor: Color.fromARGB(255, 223, 183, 180),
        // appBar: AppBar(
        //   title: Text('Bubble Bottom Bar Basic'),
        // ),
        body: Center(
          child: pagelist[currentIndex],
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.endDocked,
        bottomNavigationBar: SalomonBottomBar(items: <SalomonBottomBarItem>[
          SalomonBottomBarItem(
              icon: const Icon(Icons.home),
              title: Text(S.of(context).home),
              selectedColor: const Color(0xff0147a6)),
          SalomonBottomBarItem(
              icon: const Icon(Icons.person),
              title: Text(S.of(context).profile),
              selectedColor: const Color(0xff7898ff)),
        ], currentIndex: currentIndex, onTap: changePage));
  }
}
