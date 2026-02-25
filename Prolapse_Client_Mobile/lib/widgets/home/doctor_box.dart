import 'package:flutter/material.dart';

import '../../generated/l10n.dart';

class DoctorBox extends StatelessWidget {
  const DoctorBox({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          CircleAvatar(
              radius: 70,
              backgroundImage: Image.asset('assets/images/doctor.png').image),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Text(
              S.of(context).name,
              style: const TextStyle(
                color: Color(0xff0147a6),
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      S.of(context).desc1,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Color.fromARGB(255, 32, 32, 32),
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      S.of(context).desc2,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Color.fromARGB(255, 32, 32, 32),
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      S.of(context).desc3,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Color.fromARGB(255, 32, 32, 32),
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      S.of(context).desc4,
                      style: const TextStyle(
                        fontSize: 18,
                        color: Color.fromARGB(255, 32, 32, 32),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
