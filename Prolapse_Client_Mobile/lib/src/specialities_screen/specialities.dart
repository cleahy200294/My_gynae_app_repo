import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/generated/l10n.dart';
import 'pdf.dart';
import 'specialite_laser.dart';
import 'specialities_leakage.dart';

class SpecialitiesScreen extends StatefulWidget {
  final String type;
  const SpecialitiesScreen({super.key, required this.type});

  @override
  State<SpecialitiesScreen> createState() => _SpecialitiesState();
}

class _SpecialitiesState extends State<SpecialitiesScreen> {
  late Function(List<dynamic>) changeItems;
  String type = "";

  @override
  void initState() {
    super.initState();
    type = widget.type;
  }

  Map getpdfs(context) {
    return {
      "a": [
        {
          "name": S.of(context).anterior_vaginal_wall,
          "img": "prolapse/1.jpg",
          "pdf": "prolapse/1.pdf"
        },
        {
          "name": S.of(context).posterior_vaginal_wall,
          "img": "prolapse/2.jpg",
          "pdf": "prolapse/2.pdf"
        },
        {
          "name": S.of(context).operations,
          "img": "prolapse/3.jpg",
          "pdf": "prolapse/3.pdf"
        },
        {
          "name": S.of(context).sacrocolpopexy,
          "img": "prolapse/4.jpg",
          "pdf": "prolapse/4.pdf"
        },
        {
          "name": S.of(context).SSLF,
          "img": "prolapse/5.jpg",
          "pdf": "prolapse/5.pdf"
        },
        {
          "name": S.of(context).Colpocleisis,
          "img": "prolapse/6.jpg",
          "pdf": "prolapse/6.pdf"
        },
        {
          "name": S.of(context).womb_prolapse,
          "img": "prolapse/7.jpg",
          "pdf": "prolapse/7.pdf"
        },
      ],
      "b": [
        {
          "name": S.of(context).urinary_incontinence,
          "img": "leakage/1.jpg",
          "page": "leakage"
        },
        {
          "name": S.of(context).botox,
          "img": "leakage/2.jpg",
          "pdf": "leakage/2.pdf"
        },
        {
          "name": S.of(context).synthetic,
          "img": "leakage/3.jpg",
          "pdf": "leakage/3.pdf"
        },
        {
          "name": S.of(context).urethral_bulking,
          "img": "leakage/4.jpg",
          "pdf": "leakage/4.pdf"
        },
      ],
      "c": [
        {
          "name": S.of(context).bladder_pain_syndrome_cystitis,
          "img": "bladder/1.jpg",
          "pdf": "bladder/1.pdf"
        }
      ],
      "d": [
        {
          "name": S.of(context).fotona_vaginal_laser,
          "img": "laser/1.jpg",
          "page": "laser"
        }
      ],
      "e": [
        {
          "name": S.of(context).menopause_leaflet,
          "img": "menopause/1.jpg",
          "pdf": "menopause/1.pdf"
        }
      ],
    };
  }

  @override
  Widget build(BuildContext context) {
    Map pdfs = getpdfs(context);
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
            type == "a"
                ? S.of(context).click_for_more_info
                : type == "b"
                ? S.of(context).urine_leakage
                : type == "c"
                ? S.of(context).bladder_pain
                : type == "d"
                ? S.of(context).laser_treatment
                : S.of(context).menopause_symptoms,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        body: ListView.builder(
            shrinkWrap: true,
            itemCount: pdfs[type].length,
            itemBuilder: (context, index) {
              return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: GestureDetector(
                    onTap: () {
                      if (pdfs[type][index]["pdf"] != null) {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => PdfScreen(
                                    title: pdfs[type][index]["name"],
                                    src:
                                        "assets/images/specialisies/${pdfs[type][index]['pdf']}")));
                      } else if (pdfs[type][index]["page"] == "laser") {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => SpecialitiesLaser(
                                    title: pdfs[type][index]["name"])));
                      } else if (pdfs[type][index]["page"] == "leakage") {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => SpecialitiesLeakage(
                                    title: pdfs[type][index]["name"])));
                      }
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.5),
                            spreadRadius: 2,
                            blurRadius: 3,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Center(
                            child: SizedBox(
                              height: 200,
                              child: AspectRatio(
                                aspectRatio: 1,
                                child: ClipRRect(
                                  borderRadius: const BorderRadius.vertical(
                                    top: Radius.circular(8),
                                  ),
                                  child: Image.asset(
                                    "assets/images/specialisies/${pdfs[type][index]['img']}",
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(
                              pdfs[type][index]["name"],
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ));
            }));
  }
}
