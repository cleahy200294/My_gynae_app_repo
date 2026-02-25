import 'package:flutter/material.dart';

class TextSizeUtil {
  static const double _baseScreenWidth = 375.0; // 基准屏幕宽度
  static const double _baseFontSize = 14.0; // 基准字体大小

  static double setSp(BuildContext context, double fontSize) {
    double scaleWidth = MediaQuery.of(context).size.width / _baseScreenWidth;
    return fontSize * scaleWidth;
  }
}

void showToast(BuildContext context, String message, [String? type]) {
  OverlayEntry overlayEntry = OverlayEntry(builder: (context) {
    return TopToast(message: message, type: type);
  });

  Overlay.of(context).insert(overlayEntry);

  Future.delayed(const Duration(seconds: 3)).then((value) {
    overlayEntry.remove();
  });
}

class TopToast extends StatelessWidget {
  final String message;
  final String? type;

  const TopToast({super.key, required this.message, this.type});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Container(
        alignment: Alignment.topCenter,
        child: Padding(
          padding: const EdgeInsets.only(top: 50.0),
          child: Card(
            color: type == "success" ? Colors.green : Colors.red,
            elevation: 4.0,
            child: Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Text(
                message,
                style: const TextStyle(color: Colors.white, fontSize: 16.0),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

RegExp emailReg = RegExp(
  r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+",
);

String? validateEmail(String? value) {
  if (value == null || value.isEmpty) {
    return 'Please enter your email address';
  }
  if (!emailReg.hasMatch(value)) {
    return 'Please enter a valid email address';
  }

  return null;
}

double kgToLbs(double kg) {
  return kg * 2.2046226218;
}

double lbsToKg(double lbs) {
  return lbs / 2.2046226218;
}

int calculateAge(DateTime birthDate) {
  DateTime currentDate = DateTime.now();
  int age = currentDate.year - birthDate.year;
  int month1 = currentDate.month;
  int month2 = birthDate.month;

  if (month2 > month1) {
    age--;
  } else if (month1 == month2) {
    int day1 = currentDate.day;
    int day2 = birthDate.day;
    if (day2 > day1) {
      age--;
    }
  }
  return age;
}
