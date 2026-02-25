import 'package:flutter/material.dart';

class SpecialitiesLeakage extends StatelessWidget {
  final String title;
  const SpecialitiesLeakage({super.key, required this.title});

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
                    text: 'What is Urinary incontinence',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ))),
                  const SizedBox(height: 16),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'In Ireland, up to one-third of the population suffers from urinary incontinence. This article explains everything you need to understand about this condition.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text: 'What is Urinary incontinence?',
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
                            'Urinary incontinence is a condition of unintentional passing of urine. It\'s a common problem thought to affect millions of people around the world and is commonly undertreated. It is estimated that nearly 50 percent of adult women experience urinary incontinence, and only 40% percent of symptomatic community-dwelling women seek care.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'The main risk factors for urinary incontinence are:',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildUl(
                            "Age-Prevalence and severity of urinary incontinence increase with age"),
                        _buildUl(
                            "Obesity-Prevalence and severity of urinary incontinence increase with BMI"),
                        _buildUl(
                            "Parity-Pregnancy itself increase the risk for urinary incontinence"),
                        _buildUl(
                            "Mode of delivery- women with vaginal delivery are at higher risk for stress urinary incontinence compared to cesarian section"),
                        _buildUl("Family history"),
                        _buildUl(
                            "Ethnicity/race -Higher prevalence in non-Hispanic White women compared with African American women"),
                      ]),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'There are several types of urinary incontinence, but the main three types including:',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildUl(
                            "Stress urinary incontinence (SUI) - urine leaks out at times when your bladder is under pressure; for example, when you laugh, cough, or perform physical exercise."),
                        _buildUl(
                            "Urge urinary incontinence - when you feel a sudden, intense urge to void, accompanied by involuntary leakage of urine"),
                        _buildUl(
                            "Mix urinary incontinence - a mixture of both stress and urge urinary incontinence"),
                      ]),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text:
                        'What are the possible causes urge urinary incontinence?',
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
                            'Neurological disorders, diabetes mellitus, some medications, acute urinary tract infections, abnormalities of the bladder or outflow of the urinary system, cognitive deficiencies caused by aging.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text:
                        'What are the possible causes for stress urinary incontinence?',
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
                            'The leading cause of this condition is the weakening of the pelvic floor muscles, which support the bladder, among other pelvic structures. When these muscles become weak, anything capable of increasing the pressure outside the bladder can lead to urine leakage. A secondary reason for this type of incontinence is the weakening of the urinary sphincter, the muscle in charge of controlling the release of urine.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text: 'So, how would we treat urinary incontinence?',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'It depends on what the cause is, and it is very important to make a correct diagnosis often with urodynamic testing in order to treat appropriately.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text: 'Non-surgical treatments:',
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
                            'The current initial treatment for all types of urinary incontinence includes lifestyle interventions, losing weight and cutting down on caffeine and alcohol, physical therapies, scheduled voiding regimes, and behavioural therapies. In particular, pelvic floor muscle training (Kegel exercises) is recommended as first-line therapy for stress urinary incontinence.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Before starting any medical treatment, it is essential to rule out other conditions that may be attributed to this condition. Some medications (Antihistamines, Analgetic and sedative, Diuretics, Antidepressants, and antiparkinsonian medications) can contribute to urinary incontinence, so knowing our patient\'s medical history is a preliminary step in treating this condition. We routinely elicit alcohol and caffeine intake habits as they have been associated with exacerbating urinary incontinence due to its stimulant and diuretic effects. We must always rule out urinary tract infection as a cause for urgency and urinary frequency.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'A new non-surgical option for stress urinary incontinence is laser therapy. IncontiLase® is a non-invasive Er:YAG laser therapy for the treatment of mild and moderate stress urinary incontinence, based on non-ablative photothermal stimulation of collagen neogenesis, shrinking and tightening of vaginal mucosa tissue and collagen-rich endopelvic fascia, and subsequently causing greater support to the bladder',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text: 'Drug treatments:',
                    style: TextStyle(
                      fontSize: 18,
                      color: Color(0xFF24378f),
                      fontWeight: FontWeight.bold,
                    ),
                  )),
                  _buildParagraph(
                    'Urge incontinence',
                    'The option of drug treatment is considered mainly for overactive bladder. These medications help relax the bladder\'s muscle tissue and are also helpful for diminishing existing symptoms and urge incontinence episodes. However, these can produce a series of annoying side effects that can aggravate bladder symptoms.',
                  ),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Antimuscarinic agents and Beta-3 adrenergic agonist drugs are the two main options for the treatment of urge symptoms. Both classes can be used for single-agent treatment or used together for combination treatment.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildUl(
                            "Antimuscarinic drugs - These agents block muscarinic receptor stimulation by acetylcholine and reduce smooth muscle contraction of the bladder. Such blockade during bladder storage results in increased bladder capacity and decreased urgency. Examples of drugs in that big group family are- Fesoterodine (Toviaz), Solifenacin (Vesitrim), Darifenacin (Emselex). There are also patch and gel options. Common adverse effects include dry mouth, dry eye, and constipation."),
                        _buildUl(
                            "Beta-3 adrenergic agonist drugs — Mirabegron (Betmiga) is working by stimulating the receptors in the bladder responsible for smooth muscle relaxation. The main advantage of this drug is the reduced side effect which increases the tolerance for this treatment."),
                      ]),
                  const SizedBox(height: 16),
                  RichText(
                      text: const TextSpan(
                    text: 'Surgical treatments:',
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
                            'Surgical procedures for stress urinary incontinence (SUI) include retropubic suspension (eg Burch), pubovaginal sling, transurethral bulking therapy and mid-urethral slings. The commonest procedures for SUI until recently were the mid urethral slings which are currently “on pause” in this country but widely available globally at this stage. The mid-urethral slings include the TVT (tension-free vaginal tape) consists of placing a synthetic mesh around the urethra of the patient, increasing the positive pressure around the structures that allow urine to flow. The other procedure, the TOT (trans-obturator tape), consists of placing a permanent tape under the urethra. The purpose is basically the same as the TVT. The success rates of the surgical procedures are between 82% and 96%. While these treatments help to reduce the symptoms of urinary incontinence, these rarely completely cure them. However, after surgery, the patient will be able to have an almost normal life, at least more than before. The other option is an injectable urethral bulking agent, which is often reserved for women who cannot tolerate or wish to defer surgery.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'In case of urge urinary incontinence, Botox injections to the bladder can be helpful. Other surgical methods include placing a thin wire close to the sacral nerves responsible for stimulating the bladder, sending electrical impulses, and improving the symptoms. This wire can be placed temporarily or indefinitely until the condition is resolved. Other surgeries are based on the increase of the bladder capacity or the removal and replacement of the bladder with a prosthesis.',
                        style:
                            TextStyle(fontSize: 16, color: Color(0xFF3a3a3a)),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Quality of life is not a matter of privilege- you can change your life, and you can start it today!',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      )),
                  const SizedBox(height: 8),
                  RichText(
                      textAlign: TextAlign.justify,
                      text: const TextSpan(
                        text:
                            'Life change modifications are highly recommended and helpful in these cases due to their lack of side effects, accessible applications, and positive results.',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      )),
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
