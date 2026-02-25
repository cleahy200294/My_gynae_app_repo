import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:prolapse_doctor_mobile/src/basic_screen/basic.dart';
import 'package:prolapse_doctor_mobile/src/start_screen/start.dart';
import 'package:responsive_framework/responsive_framework.dart';
import 'generated/l10n.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
  localizationsDelegates: const [
    S.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ],
  supportedLocales: S.delegate.supportedLocales,
  builder: (context, child) => ResponsiveBreakpoints.builder(
    child: child!,
    breakpoints: const [
      Breakpoint(start: 0, end: 480, name: MOBILE),
      Breakpoint(start: 481, end: 800, name: TABLET),
      Breakpoint(start: 801, end: 1000, name: DESKTOP),
      Breakpoint(start: 1001, end: 2460, name: '4K'),
    ],
  ),
  title: 'MyGynae',
  theme: ThemeData(
    scaffoldBackgroundColor: const Color(0xFFF5F5F5),
  ),
  initialRoute: '/',
  routes: {
    '/login': (context) => const StartScreen(),
    '/': (context) => const BasicScreen(),
  },
);
  }
}
