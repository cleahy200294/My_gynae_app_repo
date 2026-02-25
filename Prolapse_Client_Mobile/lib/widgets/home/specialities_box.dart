import 'package:flutter/material.dart';
import 'package:prolapse_doctor_mobile/src/specialities_screen/specialities.dart';

import '../../generated/l10n.dart';

class SpecialitiesBox extends StatelessWidget {
  const SpecialitiesBox({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 0),
            child: Text(
              S.of(context).specialities,
              style: const TextStyle(
                color: Color(0xff0147a6),
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 18),
          // Add your Card widgets here
          Card(
            color: const Color(0xff0147a6),
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          const SpecialitiesScreen(type: "a")),
                );
              },
              child: ListTile(
                leading: const Icon(
                  Icons.local_hospital,
                  color: Colors.white,
                ),
                title: Padding(
                  padding: const EdgeInsets.only(left: 10),
                  child: Text(
                    S.of(context).pelvic_floor_prolapse,
                    style: const TextStyle(
                      fontSize: 18,
                      color: Colors.white,
                    ),
                  ),
                ),
                contentPadding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                horizontalTitleGap: 0,
                minLeadingWidth: 0,
                trailing: const Icon(
                  Icons.arrow_forward_ios,
                  color: Colors.white,
                ),
                dense: true,
                visualDensity: VisualDensity.compact,
              ),
            ),
          ),
          Card(
            color: const Color(0xff0147a6),
            child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            const SpecialitiesScreen(type: "b")),
                  );
                },
                child: ListTile(
                  leading: const Icon(
                    Icons.opacity,
                    color: Colors.white,
                  ),
                  title: Padding(
                    padding: const EdgeInsets.only(left: 10),
                    child: Text(
                      S.of(context).urine_leakage,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  contentPadding:
                      const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                  horizontalTitleGap: 0,
                  minLeadingWidth: 0,
                  trailing: const Icon(
                    Icons.arrow_forward_ios,
                    color: Colors.white,
                  ),
                  dense: true,
                  visualDensity: VisualDensity.compact,
                )),
          ),
          Card(
              color: const Color(0xff0147a6),
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            const SpecialitiesScreen(type: "c")),
                  );
                },
                child: ListTile(
                  leading: const Icon(
                    Icons.warning,
                    color: Colors.white,
                  ),
                  title: Padding(
                    padding: const EdgeInsets.only(left: 10),
                    child: Text(
                      S.of(context).bladder_pain,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  contentPadding:
                      const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                  horizontalTitleGap: 0,
                  minLeadingWidth: 0,
                  trailing: const Icon(
                    Icons.arrow_forward_ios,
                    color: Colors.white,
                  ),
                  dense: true,
                  visualDensity: VisualDensity.compact,
                ),
              )),
          Card(
              color: const Color(0xff0147a6),
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            const SpecialitiesScreen(type: "d")),
                  );
                },
                child: ListTile(
                  leading: const Icon(
                    Icons.precision_manufacturing,
                    color: Colors.white,
                  ),
                  title: Padding(
                    padding: const EdgeInsets.only(left: 10),
                    child: Text(
                      S.of(context).laser_treatment,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  contentPadding:
                      const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                  horizontalTitleGap: 0,
                  minLeadingWidth: 0,
                  trailing: const Icon(
                    Icons.arrow_forward_ios,
                    color: Colors.white,
                  ),
                  dense: true,
                  visualDensity: VisualDensity.compact,
                ),
              )),
          Card(
              color: const Color(0xff0147a6),
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            const SpecialitiesScreen(type: "e")),
                  );
                },
                child: ListTile(
                  leading: const Icon(
                    Icons.brightness_6,
                    color: Colors.white,
                  ),
                  title: Padding(
                    padding: const EdgeInsets.only(left: 10),
                    child: Text(
                      S.of(context).menopause_symptoms,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  contentPadding:
                      const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                  horizontalTitleGap: 0,
                  minLeadingWidth: 0,
                  trailing: const Icon(
                    Icons.arrow_forward_ios,
                    color: Colors.white,
                  ),
                  dense: true,
                  visualDensity: VisualDensity.compact,
                ),
              )),
        ],
      ),
    );
  }
}
