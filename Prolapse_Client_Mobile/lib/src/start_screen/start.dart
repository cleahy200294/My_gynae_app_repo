// ignore_for_file: use_build_context_synchronously

import 'dart:async';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/api/acoount.dart';
import 'package:prolapse_doctor_mobile/api/user.dart';
import 'package:prolapse_doctor_mobile/src/my_screen/my.dart';
import '../../generated/l10n.dart';
import '../../utils/util.dart';
import '../basic_screen/basic.dart';
import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../privacy_screen/privacy.dart';

class StartScreen extends StatefulWidget {
  const StartScreen({Key? key}) : super(key: key);

  @override
  State<StartScreen> createState() => _StartState();
}

class _StartState extends State<StartScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  String _type = "login";
  //login
  final TextEditingController _loginEmailController = TextEditingController();
  final TextEditingController _loginPasswordController =
      TextEditingController();
  //register
  final TextEditingController _registerEmail1Controller =
      TextEditingController();
  final TextEditingController _registerEmail2Controller =
      TextEditingController();
  final TextEditingController _registerPassword1Controller =
      TextEditingController();
  final TextEditingController _registerPassword2Controller =
      TextEditingController();
  //forget
  int _counter = 60;
  Timer? _timer;
  bool _buttonEnabled = true;
  final TextEditingController _captchaController = TextEditingController();
  final TextEditingController _forgetEmailController = TextEditingController();
  final TextEditingController _forgetPassword1Controller =
      TextEditingController();
  final TextEditingController _forgetPassword2Controller =
      TextEditingController();

  //login
  void _submitForm(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      String md5Password =
          md5.convert(utf8.encode(_loginPasswordController.text)).toString();
      try {
        final result = await logIn(
            {"email": _loginEmailController.text, "password": md5Password});
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', result["token"]);
        final userInfo = await getUserInfo();
        if (userInfo['ID'] == 0) {
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const MyScreen()),
              (_) => false);
        } else {
          Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const BasicScreen()),
              (_) => false);
        }
      } catch (e) {
        showToast(context, e.toString().replaceFirst('Exception: ', ''));
      }
    }
  }

  //register
  void _submitForm1(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      String md5Password = md5
          .convert(utf8.encode(_registerPassword1Controller.text))
          .toString();
      try {
        await register(
            {"email": _registerEmail1Controller.text, "password": md5Password});
        setState(() {
          _type = "login";
        });
      } catch (e) {
        showToast(context, e.toString().replaceFirst('Exception: ', ''));
      }
    }
  }

  //forget
  void _startTimer() {
    _counter = 60;

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_counter > 0) {
          _counter--;
        } else {
          _buttonEnabled = true;
          _timer?.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void captcha() async {
    try {
      await sendCaptcha(_forgetEmailController.text);
    } catch (e) {
      showToast(context, e.toString().replaceFirst('Exception: ', ''));
    }
  }

  void _submitForm2(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      String md5Password =
          md5.convert(utf8.encode(_forgetPassword1Controller.text)).toString();
      try {
        await resetPassword({
          "email": _forgetEmailController.text,
          "password": md5Password,
          "captcha": _captchaController.text
        });
        setState(() {
          _type = "login";
        });
      } catch (e) {
        showToast(context, e.toString().replaceFirst('Exception: ', ''));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(32),
        decoration: const BoxDecoration(
          color: Color(0xff7898ff),
        ),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text(
                S.of(context).logo,
                style: const TextStyle(
                    fontSize: 42,
                    color: Colors.white,
                    fontWeight: FontWeight.bold),
              ),
              SizedBox(
                height: MediaQuery.of(context).size.height * 0.04,
              ),
              // Log In
              _type == "login"
                  ? Container(
                      decoration: BoxDecoration(
                        color: const Color.fromRGBO(255, 255, 255, 1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            SizedBox(
                              height: MediaQuery.of(context).size.height * 0.02,
                            ),
                            Text(
                              S.of(context).follow_login,
                              style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 24,
                                color: Color(0xff0147a6),
                              ),
                            ),
                            SizedBox(
                              height: MediaQuery.of(context).size.height * 0.02,
                            ),
                            TextFormField(
                              controller: _loginEmailController,
                              decoration: InputDecoration(
                                labelText: S.of(context).email,
                              ),
                              style: const TextStyle(
                                fontSize: 18,
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return S.of(context).enteremail;
                                }
                                return null;
                              },
                            ),
                            SizedBox(
                              height: MediaQuery.of(context).size.height * 0.01,
                            ),
                            TextFormField(
                              controller: _loginPasswordController,
                              obscureText: true,
                              decoration: InputDecoration(
                                labelText: S.of(context).password,
                              ),
                              style: const TextStyle(
                                fontSize: 18,
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return S.of(context).enter_password;
                                }
                                return null;
                              },
                            ),
                            SizedBox(
                              height: MediaQuery.of(context).size.height * 0.03,
                            ),
                            RichText(
                              textAlign: TextAlign.right,
                              text: TextSpan(
                                recognizer: TapGestureRecognizer()
                                  ..onTap = () {
                                    setState(() {
                                      _type = "forget";
                                    });
                                  },
                                text: S.of(context).forget_password,
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Color.fromARGB(255, 7, 77, 192),
                                ),
                              ),
                            ),
                            SizedBox(
                              height: MediaQuery.of(context).size.height * 0.03,
                            ),
                            ElevatedButton(
                              onPressed: () => _submitForm(context),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xff0147a6),
                                minimumSize: const Size(double.infinity, 70),
                                shape: const RoundedRectangleBorder(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(10)),
                                ),
                              ),
                              child: Text(
                                S.of(context).login,
                                style: const TextStyle(
                                  fontSize: 20,
                                  color: Color(0xffffffff),
                                ),
                              ),
                            ),
                            SizedBox(
                              height: MediaQuery.of(context).size.height * 0.03,
                            ),
                            RichText(
                              textAlign: TextAlign.center,
                              text: TextSpan(
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Colors.black,
                                ),
                                children: [
                                  TextSpan(
                                    text: S.of(context).no_account,
                                    style: const TextStyle(
                                      color: Color.fromARGB(255, 0, 0, 0),
                                    ),
                                  ),
                                  TextSpan(
                                    recognizer: TapGestureRecognizer()
                                      ..onTap = () {
                                        setState(() {
                                          _type = "register";
                                        });
                                      },
                                    text: S.of(context).register,
                                    style: const TextStyle(
                                      color: Colors.red,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  : _type == "register"
                      ? Container(
                          decoration: BoxDecoration(
                            color: const Color.fromRGBO(255, 255, 255, 1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.02,
                                ),
                                Text(
                                  S.of(context).first_meeting,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 24,
                                    color: Color(0xff0147a6),
                                  ),
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.02,
                                ),
                                TextFormField(
                                  controller: _registerEmail1Controller,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).email,
                                  ),
                                  style: const TextStyle(
                                    fontSize: 18,
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return S.of(context).enteremail;
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.01,
                                ),
                                TextFormField(
                                  controller: _registerEmail2Controller,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).cemail,
                                  ),
                                  style: const TextStyle(
                                    fontSize: 18,
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return S.of(context).enter_cemail;
                                    }
                                    if (value !=
                                        _registerEmail1Controller.text) {
                                      return S.of(context).sameemail;
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.01,
                                ),
                                TextFormField(
                                  controller: _registerPassword1Controller,
                                  obscureText: true,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).password,
                                  ),
                                  style: const TextStyle(
                                    fontSize: 18,
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return S.of(context).enter_password;
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.01,
                                ),
                                TextFormField(
                                  controller: _registerPassword2Controller,
                                  obscureText: true,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).cpassword,
                                  ),
                                  style: const TextStyle(
                                    fontSize: 18,
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return S.of(context).enter_cpassword;
                                    }
                                    if (value !=
                                        _registerPassword1Controller.text) {
                                      return S.of(context).samepass;
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.03,
                                ),
                                RichText(
                                  text: TextSpan(
                                    style: const TextStyle(
                                        color: Colors.black, fontSize: 14),
                                    children: <TextSpan>[
                                      TextSpan(
                                          text: S.of(context).registerprivacy),
                                      TextSpan(
                                        text: S.of(context).privacy,
                                        style:
                                            const TextStyle(color: Colors.blue),
                                        recognizer: TapGestureRecognizer()
                                          ..onTap = () {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                  builder: (context) =>
                                                      const PrivacyPage()),
                                            );
                                          },
                                      ),
                                    ],
                                  ),
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.03,
                                ),
                                ElevatedButton(
                                  onPressed: () => _submitForm1(context),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xff0147a6),
                                    minimumSize:
                                        const Size(double.infinity, 60),
                                    shape: const RoundedRectangleBorder(
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(10)),
                                    ),
                                  ),
                                  child: Text(
                                    S.of(context).register,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      color: Color(0xffffffff),
                                    ),
                                  ),
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.03,
                                ),
                                RichText(
                                  textAlign: TextAlign.center,
                                  text: TextSpan(
                                    style: const TextStyle(
                                      fontSize: 16,
                                      color: Colors.black,
                                    ),
                                    children: [
                                      TextSpan(
                                        text: S.of(context).have_account,
                                        style: const TextStyle(
                                          color: Color.fromARGB(255, 0, 0, 0),
                                        ),
                                      ),
                                      TextSpan(
                                        recognizer: TapGestureRecognizer()
                                          ..onTap = () {
                                            setState(() {
                                              _type = "login";
                                            });
                                          },
                                        text: S.of(context).login,
                                        style: const TextStyle(
                                          color: Colors.red,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.03,
                                ),
                              ],
                            ),
                          ),
                        )
                      : Container(
                          decoration: BoxDecoration(
                            color: const Color.fromRGBO(255, 255, 255, 1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.02,
                                ),
                                Text(
                                  S.of(context).forget,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 24,
                                    color: Color(0xff0147a6),
                                  ),
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.02,
                                ),
                                TextFormField(
                                  controller: _forgetEmailController,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).email,
                                  ),
                                  style: const TextStyle(
                                    fontSize: 18,
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return S.of(context).enteremail;
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.01,
                                ),
                                TextFormField(
                                  controller: _captchaController,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).captcha,
                                    suffixIcon: InkWell(
                                      onTap: _buttonEnabled
                                          ? () {
                                              final validationResult =
                                                  validateEmail(
                                                      _forgetEmailController
                                                          .text);
                                              if (validationResult == null) {
                                                _startTimer();
                                                setState(() {
                                                  _buttonEnabled = false;
                                                });
                                                captcha();
                                              } else {
                                                showToast(
                                                    context, validationResult);
                                              }
                                            }
                                          : null,
                                      child: _buttonEnabled
                                          ? const Icon(
                                              Icons.send,
                                              color: Color(0xff0147a6),
                                            )
                                          : Text(
                                              '$_counter S',
                                              style: const TextStyle(
                                                color: Colors.grey,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                    ),
                                  ),
                                  style: const TextStyle(
                                    fontSize: 18,
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return S.of(context).entercaptcha;
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.01,
                                ),
                                TextFormField(
                                  controller: _forgetPassword1Controller,
                                  obscureText: true,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).n_password,
                                  ),
                                  style: const TextStyle(
                                    fontSize: 18,
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return S.of(context).enter_npass;
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.01,
                                ),
                                TextFormField(
                                  controller: _forgetPassword2Controller,
                                  obscureText: true,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).cpassword,
                                  ),
                                  style: const TextStyle(
                                    fontSize: 18,
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return S.of(context).enter_cpassword;
                                    }
                                    if (value !=
                                        _forgetPassword1Controller.text) {
                                      return S.of(context).samepass;
                                    }
                                    return null;
                                  },
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.03,
                                ),
                                ElevatedButton(
                                  onPressed: () => _submitForm2(context),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xff0147a6),
                                    minimumSize:
                                        const Size(double.infinity, 60),
                                    shape: const RoundedRectangleBorder(
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(10)),
                                    ),
                                  ),
                                  child: Text(
                                    S.of(context).reset,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      color: Color(0xffffffff),
                                    ),
                                  ),
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.03,
                                ),
                                RichText(
                                  textAlign: TextAlign.center,
                                  text: TextSpan(
                                    style: const TextStyle(
                                      fontSize: 16,
                                      color: Colors.black,
                                    ),
                                    children: [
                                      TextSpan(
                                        text: S.of(context).remember,
                                        style: const TextStyle(
                                          color: Color.fromARGB(255, 0, 0, 0),
                                        ),
                                      ),
                                      TextSpan(
                                        recognizer: TapGestureRecognizer()
                                          ..onTap = () {
                                            setState(() {
                                              _type = "login";
                                            });
                                          },
                                        text: S.of(context).login,
                                        style: const TextStyle(
                                          color: Colors.red,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                SizedBox(
                                  height:
                                      MediaQuery.of(context).size.height * 0.03,
                                ),
                              ],
                            ),
                          ),
                        ),
            ],
          ),
        ),
      ),
    );
  }
}
