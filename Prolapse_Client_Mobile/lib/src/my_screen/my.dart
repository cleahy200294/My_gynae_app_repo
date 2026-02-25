// ignore_for_file: avoid_print, use_build_context_synchronously, non_constant_identifier_names

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/api/user.dart';
import 'package:prolapse_doctor_mobile/components/dropdown_list.dart';
import 'package:prolapse_doctor_mobile/src/basic_screen/basic.dart';
import 'package:prolapse_doctor_mobile/utils/util.dart';
import '../setting_screen/setting.dart';

import '../../generated/l10n.dart';

class MyScreen extends StatefulWidget {
  const MyScreen({Key? key}) : super(key: key);

  @override
  State<MyScreen> createState() => _MyState();
}

class _MyState extends State<MyScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  String _email = "";
  String _id = "";
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _surnameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _ageController = TextEditingController();
  final TextEditingController _heightController = TextEditingController();
  final TextEditingController _weightController = TextEditingController();
  final TextEditingController _mainComplaintController =
      TextEditingController();
  final TextEditingController _currentMedicationController =
      TextEditingController();
  final TextEditingController _maximalWeightController =
      TextEditingController();
  final TextEditingController _otherMedicalHistoryController =
      TextEditingController();
  final TextEditingController _pastSurgeryController = TextEditingController();
  final TextEditingController _otherGynecologySurgeryController =
      TextEditingController();

  String _selectedWeightUnit = 'kg';
  String _selectedmaximalWeightUnit = 'kg';
  String _ethnic = '0';
  String _selectedComplaint = 'Feeling of something coming down';

  DateTime _selectedDate = DateTime.now();

  List<int> _medicalHistory = [];
  List<int> _pastGynecologySurgery = [];
  List<dynamic> _children = [];

  void _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      _ageController.text = calculateAge(picked).toString();
    }
  }

  void _fetchUserData() async {
    try {
      Map<String, dynamic> result = await getUserInfo();
      setState(() {
        _email = result["email"];
      });
      if (result['ID'] == 0) {
        return;
      }
      _firstNameController.text = result["firstname"];
      _surnameController.text = result["surname"];
      _phoneController.text = result["phone"];
      _heightController.text = result["height"].toString();
      _weightController.text = result["weight"].toString();
      _maximalWeightController.text = result["birthWeight"].toString();
      _mainComplaintController.text = result["complaint"];
      _pastSurgeryController.text = result["pastsurgery"];
      _otherMedicalHistoryController.text = result["medicalhistoryother"];
      _otherGynecologySurgeryController.text =
          result["pastgynecologysurgeryother"];
      _currentMedicationController.text = result["currentmedication"];
      DateTime dob = DateTime.parse(result["birthday"]);
      _ageController.text = calculateAge(dob).toString();

      setState(() {
        _id = result["ID"].toString();
        _ethnic = result["ethnicity"].toString();
        _selectedDate = dob;
        if (result["children"] != "") {
          _children = json.decode(result["children"]);
        }
        _medicalHistory = result["medicalhistory"] == ""
            ? []
            : (result["medicalhistory"] as String)
                .split(",")
                .map((item) => int.parse(item))
                .toList();
        _pastGynecologySurgery = result["pastgynecologysurgery"] == ""
            ? []
            : (result["pastgynecologysurgery"] as String)
                .split(",")
                .map((item) => int.parse(item))
                .toList();
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

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      try {
        await saveUserInfo({
          "ID": _id,
          "firstname": _firstNameController.text,
          "surname": _surnameController.text,
          "email": _email,
          "phone": _phoneController.text,
          "birthday": _selectedDate.toUtc().toIso8601String(),
          "height": _heightController.text,
          "weight": _selectedWeightUnit == "kg"
              ? _weightController.text
              : lbsToKg(double.parse(_weightController.text))
                  .toStringAsFixed(4),
          "ethnic": _ethnic,
          "children": jsonEncode(_children),
          "birthWeight": _selectedmaximalWeightUnit == "kg"
              ? _maximalWeightController.text
              : lbsToKg(double.parse(_maximalWeightController.text))
                  .toStringAsFixed(4),
          "complaint": _mainComplaintController.text,
          "pastsurgery": _pastSurgeryController.text,
          "medicalhistory": _medicalHistory.join(","),
          "medicalhistoryother": _medicalHistory.contains(11)
              ? _otherMedicalHistoryController.text
              : "",
          "pastgynecologysurgery": _pastGynecologySurgery.join(","),
          "pastgynecologysurgeryother": _pastGynecologySurgery.contains(4)
              ? _otherGynecologySurgeryController.text
              : "",
          "currentmedication": _currentMedicationController.text
        });
        showToast(context, 'Save successfully', 'success');
        Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => const BasicScreen()),
            (_) => false);
      } catch (e) {
        showToast(context, e.toString().replaceFirst('Exception: ', ''));
      }
    }
  }

  static List<dynamic> getMedicalHistory(context) {
    return [
      {'key': 1, 'value': S.of(context).diabetes},
      {'key': 2, 'value': S.of(context).heart},
      {'key': 3, 'value': S.of(context).hypertension},
      {'key': 4, 'value': S.of(context).arthritis},
      {'key': 5, 'value': S.of(context).cancer},
      {'key': 6, 'value': S.of(context).chronic_kidney},
      {'key': 7, 'value': S.of(context).chronic_obstructive_pulmonary},
      {'key': 8, 'value': S.of(context).dementia},
      {'key': 9, 'value': S.of(context).osteoporosis},
      {'key': 10, 'value': S.of(context).stroke},
      {'key': 11, 'value': S.of(context).other},
    ];
  }

  static List<dynamic> getPastSurgeries(context) {
    return [
      {'key': 1, 'value': S.of(context).hysterectomy},
      {'key': 2, 'value': S.of(context).repair},
      {'key': 3, 'value': S.of(context).tape},
      {'key': 4, 'value': S.of(context).other},
    ];
  }

  static List<DropdownMenuItem<String>> getEthnic(context) {
    return [
      DropdownMenuItem<String>(
        value: '0',
        child: Text(S.of(context).select),
      ),
      DropdownMenuItem<String>(
        value: '1',
        child: Text(S.of(context).asian),
      ),
      DropdownMenuItem<String>(
        value: '2',
        child: Text(S.of(context).african),
      ),
      DropdownMenuItem<String>(
        value: '3',
        child: Text(S.of(context).european),
      ),
      DropdownMenuItem<String>(
        value: '4',
        child: Text(S.of(context).latin),
      ),
      DropdownMenuItem<String>(
        value: '5',
        child: Text(S.of(context).north),
      ),
      DropdownMenuItem<String>(
        value: '6',
        child: Text(S.of(context).oceanian),
      ),
      DropdownMenuItem<String>(
        value: '7',
        child: Text(S.of(context).mix),
      ),
      DropdownMenuItem<String>(
        value: '8',
        child: Text(S.of(context).other),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final ethnicItems = getEthnic(context);
    final allowedEthnicValues = ethnicItems
        .map((e) => e.value)
        .whereType<String>()
        .toSet();

    final safeEthnicValue = allowedEthnicValues.contains(_ethnic) ? _ethnic : '0';

    const weightUnitItems = <String>["kg", "pound"];

    return Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.fromLTRB(16, 40, 16, 16),
                decoration: const BoxDecoration(
                  color: Color(0xff0147a6),
                ),
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      // ignore: prefer_const_literals_to_create_immutables
                      children: [
                        Text(
                          "${_firstNameController.text} ${_surnameController.text}",
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
                    const Spacer(), // 添加Spacer Widget
                    IconButton(
                      icon: const Icon(
                        Icons.settings,
                        color: Colors.white,
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const SettingScreen()),
                        );
                      },
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(32),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        S.of(context).personal_information,
                        textAlign: TextAlign.left,
                        style: const TextStyle(
                          color: Color(0xff0147a6),
                          fontSize: 24.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextFormField(
                        controller: _firstNameController,
                        decoration: InputDecoration(
                          labelText: '* ${S.of(context).first_name}',
                        ),
                        validator: (value) {
                          if (value!.isEmpty) {
                            return S.of(context).enterfirst;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _surnameController,
                        decoration: InputDecoration(
                          labelText: '* ${S.of(context).surname}',
                        ),
                        validator: (value) {
                          if (value!.isEmpty) {
                            return S.of(context).entersur;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                          labelText: '* ${S.of(context).phone}',
                        ),
                        validator: (value) {
                          if (value!.isEmpty) {
                            return S.of(context).enterphone;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      InkWell(
                        onTap: () {
                          _selectDate(context);
                        },
                        child: IgnorePointer(
                          child: TextFormField(
                            controller: TextEditingController(
                              text:
                                  '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                            ),
                            decoration: InputDecoration(
                              labelText: '* ${S.of(context).birthday}',
                              suffixIcon: const Icon(Icons.calendar_today),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        enabled: false,
                        controller: _ageController,
                        decoration: InputDecoration(
                          labelText: '* ${S.of(context).age}',
                        ),
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        decoration: InputDecoration(
                          labelText: '* ${S.of(context).ethnic}',
                        ),
                        value: safeEthnicValue,
                        items: ethnicItems,
                        onChanged: (String? newValue) {
                          setState(() {
                            _ethnic = newValue!;
                          });
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return S.of(context).ethnic;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _heightController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText:
                              '* ${S.of(context).height}. (${S.of(context).cm})',
                        ),
                        validator: (value) {
                          if (value!.isEmpty) {
                            return S.of(context).enterweight;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            flex: 2,
                            child: TextFormField(
                              controller: _weightController,
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                                labelText: '* ${S.of(context).weight}',
                              ),
                              validator: (value) {
                                if (value!.isEmpty) {
                                  return S.of(context).enterweight;
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              decoration: const InputDecoration(),
                              value: weightUnitItems.contains(_selectedWeightUnit)
                                  ? _selectedWeightUnit
                                  : weightUnitItems.first,
                              items: weightUnitItems.map((String value) {
                                return DropdownMenuItem<String>(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                              onChanged: (String? newValue) {
                                setState(() {
                                  _selectedWeightUnit = newValue!;
                                });
                                try {
                                  double weight =
                                      double.parse(_weightController.text);

                                  if (newValue == "pound") {
                                    _weightController.text =
                                        kgToLbs(weight).toStringAsFixed(4);
                                  } else {
                                    _weightController.text =
                                        lbsToKg(weight).toStringAsFixed(4);
                                  }
                                } catch (e) {
                                  print('Error: $e');
                                }
                              },
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return S.of(context).enterunit;
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      DropdownList(
                          children: _children,
                          changeChildren: (children) {
                            setState(() {
                              _children = children;
                            });
                          }),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            flex: 2,
                            child: TextFormField(
                              controller: _maximalWeightController,
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                                labelText: S.of(context).birthweight,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              decoration: const InputDecoration(),
                              value: weightUnitItems.contains(_selectedmaximalWeightUnit)
                                  ? _selectedmaximalWeightUnit
                                  : weightUnitItems.first,
                              items: weightUnitItems.map((String value) {
                                return DropdownMenuItem<String>(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                              onChanged: (String? newValue) {
                                setState(() {
                                  _selectedmaximalWeightUnit = newValue!;
                                });
                                try {
                                  double weight = double.parse(
                                      _maximalWeightController.text);

                                  if (newValue == "pound") {
                                    _maximalWeightController.text =
                                        kgToLbs(weight).toStringAsFixed(4);
                                  } else {
                                    _maximalWeightController.text =
                                        lbsToKg(weight).toStringAsFixed(4);
                                  }
                                } catch (e) {
                                  print('Error: $e');
                                }
                              },
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return S.of(context).enterunit;
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 40),
                      Text(
                        S.of(context).medical_information,
                        textAlign: TextAlign.left,
                        style: const TextStyle(
                          color: Color(0xff0147a6),
                          fontSize: 24.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          DropdownButtonFormField<String>(
                            decoration: InputDecoration(
                              labelText: '* ${S.of(context).complaint}',
                            ),
                            value: _selectedComplaint,
                            items: [
                              'Feeling of something coming down',
                              'Leaking of urine',
                              'Recurrent infections',
                              'Frequent or bothersome urination',
                              'Other'
                            ].map((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(value),
                              );
                            }).toList(),
                            onChanged: (String? newValue) {
                              setState(() {
                                _selectedComplaint = newValue!;
                                if (newValue != 'Other') {
                                  _mainComplaintController.text = newValue;
                                }
                              });
                            },
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return S.of(context).entercomplaint;
                              }
                              return null;
                            },
                          ),
                          if (_selectedComplaint == 'Other')
                            Padding(
                              padding: const EdgeInsets.only(top: 16.0),
                              child: TextFormField(
                                decoration: const InputDecoration(
                                  labelText: 'Please specify',
                                ),
                                controller: _mainComplaintController,
                                validator: (value) {
                                  if (_selectedComplaint == 'Other' && (value == null || value.isEmpty)) {
                                    return 'Please enter your complaint';
                                  }
                                  return null;
                                },
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        S.of(context).medical_history,
                      ),
                      ...getMedicalHistory(context).map((option) {
                        return CheckboxListTile(
                          title: option["key"] == 11
                              ? TextField(
                                  controller: _otherMedicalHistoryController,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).other,
                                  ),
                                )
                              : Text(option["value"]),
                          value: _medicalHistory.contains(option["key"]),
                          onChanged: (value) {
                            setState(() {
                              if (value == true) {
                                _medicalHistory.add(option["key"]);
                              } else {
                                _medicalHistory.remove(option["key"]);
                              }
                            });
                          },
                        );
                      }).toList(),
                      const SizedBox(height: 16),
                      TextFormField(
                        decoration: InputDecoration(
                          labelText: S.of(context).surgery,
                        ),
                        maxLines: null,
                        controller: _pastSurgeryController,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        S.of(context).past_surgery,
                      ),
                      ...getPastSurgeries(context).map((option) {
                        return CheckboxListTile(
                          title: option["key"] == 4
                              ? TextField(
                                  controller: _otherGynecologySurgeryController,
                                  decoration: InputDecoration(
                                    labelText: S.of(context).other,
                                  ),
                                )
                              : Text(option["value"]),
                          value: _pastGynecologySurgery.contains(option["key"]),
                          onChanged: (value) {
                            setState(() {
                              if (value == true) {
                                _pastGynecologySurgery.add(option["key"]);
                              } else {
                                _pastGynecologySurgery.remove(option["key"]);
                              }
                            });
                          },
                        );
                      }).toList(),
                      const SizedBox(height: 16),
                      TextFormField(
                        decoration: InputDecoration(
                          labelText: S.of(context).medication,
                        ),
                        maxLines: null,
                        controller: _currentMedicationController,
                      ),
                      const SizedBox(height: 32),
                      ElevatedButton(
                        onPressed: _submitForm,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xff0147a6),
                          minimumSize: const Size(double.infinity, 60),
                          shape: const RoundedRectangleBorder(
                            borderRadius: BorderRadius.all(Radius.circular(10)),
                          ),
                        ),
                        child: Text(
                          S.of(context).save,
                          style: const TextStyle(
                            fontSize: 18,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ));
  }
}
