import 'package:flutter/material.dart';

class SpecialitiesLaser extends StatelessWidget {
  final String title;
  const SpecialitiesLaser({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
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
            title,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        body: SingleChildScrollView(
          child: Container(
            color: const Color(0xFFFbFbFb),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  Center(
                      child: RichText(
                          text: const TextSpan(
                    text: 'Fotona Vaginal Laser',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ))),
                  const SizedBox(height: 16),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Transvaginal laser treatment is a simple non-surgical procedure, '
                            'mainly aimed to rebuild and restructure damaged tissue of the '
                            'vagina walls through collagen and elastin recovery '
                            'stimulation. These fibres play an essential role in sustaining and '
                            'structuring the vaginal tissue since they are part of its '
                            'shallower layer.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 16),
                  Image.asset('assets/images/specialisies/laser/1.1.jpg'),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text:
                        'Some factors that can cause weakening of vaginal tone',
                    style: TextStyle(
                      fontSize: 18,
                      color: Color(0xFF24378f),
                      fontWeight: FontWeight.bold,
                    ),
                  )),
                  _buildParagraph(
                    'Natural ageing:',
                    'the passing of years inevitably produces collagen loss in every tissue of a woman´s body, including the vaginal wall.',
                  ),
                  _buildParagraph(
                    'Menopause:',
                    'the menopause results in a decrease of hormones, especially oestrogen, which have a direct influence on muscles\' tone, especially in the genital-urinary tract.',
                  ),
                  _buildParagraph(
                    'Childbirth:',
                    'giving birth multiple times can cause stretching of the vaginal muscles, leading to loss of tone.',
                  ),
                  _buildParagraph(
                    'Surgery:',
                    'some surgical procedures can affect the vaginal tissue and cause a decrease in tone.',
                  ),
                  _buildParagraph(
                    'Obesity:',
                    'being overweight can put pressure on the pelvic floor muscles, which can weaken the vaginal tone.',
                  ),
                  _buildParagraph(
                    'Smoking:',
                    'among all the harmful consequences of smoking, the decrease in the amount of oxygen supplied to the skin makes it age between 10 and 20 years prematurely. Obviously, this has a negative affect on the muscle tone and the vagina.',
                  ),
                  _buildParagraph(
                    'Hysterectomy:',
                    'prior hysterectomy can disrupt the function and support of the urethra and bladder, increasing the chances of developing urinary stress incontinence and other associated conditions.',
                  ),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text: 'Possible medical conditions',
                    style: TextStyle(
                      fontSize: 18,
                      color: Color(0xFF24378f),
                      fontWeight: FontWeight.bold,
                    ),
                  )),
                  const SizedBox(height: 16),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'The stretching of the vaginal wall tissue results in straining of collagen and elastin in this area, which can lead to vaginal relaxation syndrome (VRS), stress urinary incontinence (SUI), and pelvic organ prolapse (POP).',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Laser treatment can relieve these conditions or symptoms in women and will restore to the vaginal tissue its original elasticity and contractility. This is especially important for women to maintain a healthy sex life avoiding irritation, lack of lubrication, and/or burning sensation.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text: 'Vaginal relaxation syndrome (VRS)',
                    style: TextStyle(
                      fontSize: 18,
                      color: Color(0xFF24378f),
                      fontWeight: FontWeight.bold,
                    ),
                  )),
                  const SizedBox(height: 16),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Vaginal relaxation syndrome, also known as vaginal laxity, is when the inner diameter of the vagina\'s wall increases. This often leads to a loss of friction for both the woman and her partner, which results in a decrease in sexual satisfaction. This can affect both self confidence and body image.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Vaginal relaxation is most often caused because the vaginal wall was overstretched during childbirth. The condition can increase according to the number of births. It can also be caused by ageing, as well as congenital connective tissue weakness.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Until recently, this condition could only be treated effectively by invasive surgery, with procedures such as anterior vaginal plastic surgery and posterior vaginal plastic surgery. These surgical treatments have had many post operative complications associated with them.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  _buildParagraph(
                    'Treatment:',
                    'ntimaLase® is a unique, Er:YAG laser therapy for incisionless, non-invasive photothermal tightening of the vaginal canal. Clinical studies have shown that IntimaLase is an efficient, easy-to-perform, and safe procedure.',
                  ),
                  const SizedBox(height: 8),
                  Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildUl("Itchy and red genitalia"),
                        _buildUl("Urinary incontinence"),
                        _buildUl("Feeling an urgent need to urinate"),
                        _buildUl("Burning sensation"),
                        _buildUl("Discomfort or bleeding after intercourse"),
                        _buildUl(
                            "Pain during intercourse, due to less lubrication"),
                        _buildUl(
                            "Shortening and tightening of the vaginal canal"),
                      ]),
                  const SizedBox(height: 8),
                  _buildParagraph(
                    'Treatment:',
                    'RenovaLase® is an innovative, unique and non-invasive 2940 nm Er:YAG laser therapy to treat the symptoms of vaginal atrophy. It is based on non-ablative photo-thermal treatment of the vaginal canal.',
                  ),
                  const SizedBox(height: 16),
                  Center(
                      child: Image.asset(
                          'assets/images/specialisies/laser/1.jpg')),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text: 'Stress urinary incontinence (SUI)',
                    style: TextStyle(
                      fontSize: 18,
                      color: Color(0xFF24378f),
                      fontWeight: FontWeight.bold,
                    ),
                  )),
                  const SizedBox(height: 16),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'This condition is characterised by involuntary urine leaks occurring with daily events such as laughing, sneezing, coughing, getting up from a chair or some kind of physical effort like going up and down the stairs, heavy lifting, and jogging.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'This problem appears to be due to the loss of strength of the urethral closure mechanism. Being overweight, ageing, and childbirth are factors that increase the probabilities of developing this condition, by putting more pressure on the bladder during simple activities. This condition can impact the patient\'s daily activities as well as affecting their self-confidence.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  _buildParagraph(
                    'Treatment:',
                    'IncontiLase® is a non-invasive Er:YAG laser therapy for the treatment of mild and moderate stress urinary incontinence, based on non-ablative photothermal stimulation of collagen neogenesis, shrinking and tightening of vaginal tissue and collagen-rich endopelvic fascia, and subsequently greater support to the bladder.',
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ));
  }

  Widget _buildParagraph(String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: '$title ',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            TextSpan(
              text: content,
              style: const TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
            ),
          ],
        ),
        textAlign: TextAlign.justify,
      ),
    );
  }

  Widget _buildUl(String content) {
    return Padding(
      padding: const EdgeInsets.only(top: 4.0),
      child: RichText(
        text: TextSpan(
          children: [
            const TextSpan(
              text: ' •  ',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            TextSpan(
              text: content,
              style: const TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
            ),
          ],
        ),
      ),
    );
  }
}
