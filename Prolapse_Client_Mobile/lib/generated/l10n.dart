// GENERATED CODE - DO NOT MODIFY BY HAND
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'intl/messages_all.dart';

// **************************************************************************
// Generator: Flutter Intl IDE plugin
// Made by Localizely
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, lines_longer_than_80_chars
// ignore_for_file: join_return_with_assignment, prefer_final_in_for_each
// ignore_for_file: avoid_redundant_argument_values, avoid_escaping_inner_quotes

class S {
  S();

  static S? _current;

  static S get current {
    assert(_current != null,
        'No instance of S was loaded. Try to initialize the S delegate before accessing S.current.');
    return _current!;
  }

  static const AppLocalizationDelegate delegate = AppLocalizationDelegate();

  static Future<S> load(Locale locale) {
    final name = (locale.countryCode?.isEmpty ?? false)
        ? locale.languageCode
        : locale.toString();
    final localeName = Intl.canonicalizedLocale(name);
    return initializeMessages(localeName).then((_) {
      Intl.defaultLocale = localeName;
      final instance = S();
      S._current = instance;

      return instance;
    });
  }

  static S of(BuildContext context) {
    final instance = S.maybeOf(context);
    assert(instance != null,
        'No instance of S present in the widget tree. Did you add S.delegate in localizationsDelegates?');
    return instance!;
  }

  static S? maybeOf(BuildContext context) {
    return Localizations.of<S>(context, S);
  }

  /// `SELECT PURPOSE OF VISIT`
  String get purpose_of_visiting {
    return Intl.message(
      'SELECT PURPOSE OF VISIT',
      name: 'purpose_of_visiting',
      desc: '',
      args: [],
    );
  }

  /// `NEXT`
  String get next {
    return Intl.message(
      'NEXT',
      name: 'next',
      desc: '',
      args: [],
    );
  }

  /// `INFORMATION LEAFLETS`
  String get specialities {
    return Intl.message(
      'INFORMATION LEAFLETS',
      name: 'specialities',
      desc: '',
      args: [],
    );
  }

  /// `Pelvic Floor Prolapse`
  String get pelvic_floor_prolapse {
    return Intl.message(
      'Pelvic Floor Prolapse',
      name: 'pelvic_floor_prolapse',
      desc: '',
      args: [],
    );
  }

  /// `Click for more information`
  String get click_for_more_info {
    return Intl.message(
      'Click for more information',
      name: 'click_for_more_info',
      desc: '',
      args: [],
    );
  }

  /// `Urine Leakage`
  String get urine_leakage {
    return Intl.message(
      'Urine Leakage',
      name: 'urine_leakage',
      desc: '',
      args: [],
    );
  }

  /// `Bladder Pain`
  String get bladder_pain {
    return Intl.message(
      'Bladder Pain',
      name: 'bladder_pain',
      desc: '',
      args: [],
    );
  }

  /// `Laser Treatment`
  String get laser_treatment {
    return Intl.message(
      'Laser Treatment',
      name: 'laser_treatment',
      desc: '',
      args: [],
    );
  }

  /// `Menopause Symptoms`
  String get menopause_symptoms {
    return Intl.message(
      'Menopause Symptoms',
      name: 'menopause_symptoms',
      desc: '',
      args: [],
    );
  }

  /// `Dr. Yair Daykan`
  String get name {
    return Intl.message(
      'Dr. Yair Daykan',
      name: 'name',
      desc: '',
      args: [],
    );
  }

  /// `The Daykan Center for Urogynecology leads by Dr. Yair Daykan, a board-certified OB/GYN and an Urogynecology subspecialist.`
  String get desc1 {
    return Intl.message(
      'The Daykan Center for Urogynecology leads by Dr. Yair Daykan, a board-certified OB/GYN and an Urogynecology subspecialist.',
      name: 'desc1',
      desc: '',
      args: [],
    );
  }

  /// `With extensive knowledge of the birthing process, Dr. Daykan understands the effects childbirth can have on a woman both physically and medically.`
  String get desc2 {
    return Intl.message(
      'With extensive knowledge of the birthing process, Dr. Daykan understands the effects childbirth can have on a woman both physically and medically.',
      name: 'desc2',
      desc: '',
      args: [],
    );
  }

  /// `Dr. Daykan specializes in Female Pelvic floor and Reconstructive Surgery which allows him to restore both form and function to the pelvic floor and vaginal area.`
  String get desc3 {
    return Intl.message(
      'Dr. Daykan specializes in Female Pelvic floor and Reconstructive Surgery which allows him to restore both form and function to the pelvic floor and vaginal area.',
      name: 'desc3',
      desc: '',
      args: [],
    );
  }

  /// ` Dr. Daykan finished his Urogynecology subspeciality at Cork Maternity hospital, Ireland, under the auspices of the European Urogynaecology Association (EUGA).`
  String get desc4 {
    return Intl.message(
      ' Dr. Daykan finished his Urogynecology subspeciality at Cork Maternity hospital, Ireland, under the auspices of the European Urogynaecology Association (EUGA).',
      name: 'desc4',
      desc: '',
      args: [],
    );
  }

  /// `FOLLOW-UP MEETING LOG IN`
  String get follow_login {
    return Intl.message(
      'FOLLOW-UP MEETING LOG IN',
      name: 'follow_login',
      desc: '',
      args: [],
    );
  }

  /// `Welcome To`
  String get welcome {
    return Intl.message(
      'Welcome To',
      name: 'welcome',
      desc: '',
      args: [],
    );
  }

  /// `My Pelvic Health Place`
  String get logo {
    return Intl.message(
      'My Pelvic Health Place',
      name: 'logo',
      desc: '',
      args: [],
    );
  }

  /// `Email`
  String get email {
    return Intl.message(
      'Email',
      name: 'email',
      desc: '',
      args: [],
    );
  }

  /// `Confirm Email`
  String get cemail {
    return Intl.message(
      'Confirm Email',
      name: 'cemail',
      desc: '',
      args: [],
    );
  }

  /// `Please enter confirm email`
  String get enter_cemail {
    return Intl.message(
      'Please enter confirm email',
      name: 'enter_cemail',
      desc: '',
      args: [],
    );
  }

  /// `Password`
  String get password {
    return Intl.message(
      'Password',
      name: 'password',
      desc: '',
      args: [],
    );
  }

  /// `Confirm Password`
  String get cpassword {
    return Intl.message(
      'Confirm Password',
      name: 'cpassword',
      desc: '',
      args: [],
    );
  }

  /// `Please enter confirm password`
  String get enter_cpassword {
    return Intl.message(
      'Please enter confirm password',
      name: 'enter_cpassword',
      desc: '',
      args: [],
    );
  }

  /// `Please enter the same email`
  String get sameemail {
    return Intl.message(
      'Please enter the same email',
      name: 'sameemail',
      desc: '',
      args: [],
    );
  }

  /// `Please enter the same password`
  String get samepass {
    return Intl.message(
      'Please enter the same password',
      name: 'samepass',
      desc: '',
      args: [],
    );
  }

  /// `Enter the captcha`
  String get captcha {
    return Intl.message(
      'Enter the captcha',
      name: 'captcha',
      desc: '',
      args: [],
    );
  }

  /// `New passward`
  String get n_password {
    return Intl.message(
      'New passward',
      name: 'n_password',
      desc: '',
      args: [],
    );
  }

  /// `FIRST MEETING REGISTRATION`
  String get first_meeting {
    return Intl.message(
      'FIRST MEETING REGISTRATION',
      name: 'first_meeting',
      desc: '',
      args: [],
    );
  }

  /// `Already have an account? `
  String get have_account {
    return Intl.message(
      'Already have an account? ',
      name: 'have_account',
      desc: '',
      args: [],
    );
  }

  /// `Forgot password?`
  String get forget_password {
    return Intl.message(
      'Forgot password?',
      name: 'forget_password',
      desc: '',
      args: [],
    );
  }

  /// `FOLLOW-UP MEETING LOG IN`
  String get followup_meeting {
    return Intl.message(
      'FOLLOW-UP MEETING LOG IN',
      name: 'followup_meeting',
      desc: '',
      args: [],
    );
  }

  /// `Don't have an account? `
  String get no_account {
    return Intl.message(
      'Don\'t have an account? ',
      name: 'no_account',
      desc: '',
      args: [],
    );
  }

  /// `RESET PASSWORD`
  String get reset {
    return Intl.message(
      'RESET PASSWORD',
      name: 'reset',
      desc: '',
      args: [],
    );
  }

  /// `I remember the password!`
  String get remember {
    return Intl.message(
      'I remember the password!',
      name: 'remember',
      desc: '',
      args: [],
    );
  }

  /// `KG`
  String get kg {
    return Intl.message(
      'KG',
      name: 'kg',
      desc: '',
      args: [],
    );
  }

  /// `Pound`
  String get pound {
    return Intl.message(
      'Pound',
      name: 'pound',
      desc: '',
      args: [],
    );
  }

  /// `Personal Information`
  String get personal_information {
    return Intl.message(
      'Personal Information',
      name: 'personal_information',
      desc: '',
      args: [],
    );
  }

  /// `Vaginal Delivery`
  String get vaginal_delivery {
    return Intl.message(
      'Vaginal Delivery',
      name: 'vaginal_delivery',
      desc: '',
      args: [],
    );
  }

  /// `Cesarean Surgery`
  String get cesarean_surgery {
    return Intl.message(
      'Cesarean Surgery',
      name: 'cesarean_surgery',
      desc: '',
      args: [],
    );
  }

  /// `Add Child`
  String get add_child {
    return Intl.message(
      'Add Child',
      name: 'add_child',
      desc: '',
      args: [],
    );
  }

  /// `Medical Information`
  String get medical_information {
    return Intl.message(
      'Medical Information',
      name: 'medical_information',
      desc: '',
      args: [],
    );
  }

  /// `SAVE`
  String get save {
    return Intl.message(
      'SAVE',
      name: 'save',
      desc: '',
      args: [],
    );
  }

  /// `First Name`
  String get first_name {
    return Intl.message(
      'First Name',
      name: 'first_name',
      desc: '',
      args: [],
    );
  }

  /// `Surname`
  String get surname {
    return Intl.message(
      'Surname',
      name: 'surname',
      desc: '',
      args: [],
    );
  }

  /// `Phone`
  String get phone {
    return Intl.message(
      'Phone',
      name: 'phone',
      desc: '',
      args: [],
    );
  }

  /// `Date of Birth`
  String get birthday {
    return Intl.message(
      'Date of Birth',
      name: 'birthday',
      desc: '',
      args: [],
    );
  }

  /// `Age`
  String get age {
    return Intl.message(
      'Age',
      name: 'age',
      desc: '',
      args: [],
    );
  }

  /// `Height`
  String get height {
    return Intl.message(
      'Height',
      name: 'height',
      desc: '',
      args: [],
    );
  }

  /// `Weight`
  String get weight {
    return Intl.message(
      'Weight',
      name: 'weight',
      desc: '',
      args: [],
    );
  }

  /// `Mode of Delivery`
  String get mode {
    return Intl.message(
      'Mode of Delivery',
      name: 'mode',
      desc: '',
      args: [],
    );
  }

  /// `Maximal Birth Weight`
  String get birthweight {
    return Intl.message(
      'Maximal Birth Weight',
      name: 'birthweight',
      desc: '',
      args: [],
    );
  }

  /// `Main Complaint`
  String get complaint {
    return Intl.message(
      'Main Complaint',
      name: 'complaint',
      desc: '',
      args: [],
    );
  }

  /// `Medical History (Diseases)`
  String get medical_history {
    return Intl.message(
      'Medical History (Diseases)',
      name: 'medical_history',
      desc: '',
      args: [],
    );
  }

  /// `Other`
  String get other {
    return Intl.message(
      'Other',
      name: 'other',
      desc: '',
      args: [],
    );
  }

  /// `Past Surgery`
  String get surgery {
    return Intl.message(
      'Past Surgery',
      name: 'surgery',
      desc: '',
      args: [],
    );
  }

  /// `Past Gynecology Surgery`
  String get past_surgery {
    return Intl.message(
      'Past Gynecology Surgery',
      name: 'past_surgery',
      desc: '',
      args: [],
    );
  }

  /// `Current Medication`
  String get medication {
    return Intl.message(
      'Current Medication',
      name: 'medication',
      desc: '',
      args: [],
    );
  }

  /// `CM`
  String get cm {
    return Intl.message(
      'CM',
      name: 'cm',
      desc: '',
      args: [],
    );
  }

  /// `Diabetes`
  String get diabetes {
    return Intl.message(
      'Diabetes',
      name: 'diabetes',
      desc: '',
      args: [],
    );
  }

  /// `Heart disease`
  String get heart {
    return Intl.message(
      'Heart disease',
      name: 'heart',
      desc: '',
      args: [],
    );
  }

  /// `Hypertension`
  String get hypertension {
    return Intl.message(
      'Hypertension',
      name: 'hypertension',
      desc: '',
      args: [],
    );
  }

  /// `Arthritis`
  String get arthritis {
    return Intl.message(
      'Arthritis',
      name: 'arthritis',
      desc: '',
      args: [],
    );
  }

  /// `Cancer`
  String get cancer {
    return Intl.message(
      'Cancer',
      name: 'cancer',
      desc: '',
      args: [],
    );
  }

  /// `Chronic Kidney Disease`
  String get chronic_kidney {
    return Intl.message(
      'Chronic Kidney Disease',
      name: 'chronic_kidney',
      desc: '',
      args: [],
    );
  }

  /// `Chronic Obstructive Pulmonary Disease`
  String get chronic_obstructive_pulmonary {
    return Intl.message(
      'Chronic Obstructive Pulmonary Disease',
      name: 'chronic_obstructive_pulmonary',
      desc: '',
      args: [],
    );
  }

  /// `Dementia, Alzheimer's, and Parkinson's`
  String get dementia {
    return Intl.message(
      'Dementia, Alzheimer\'s, and Parkinson\'s',
      name: 'dementia',
      desc: '',
      args: [],
    );
  }

  /// `Osteoporosis`
  String get osteoporosis {
    return Intl.message(
      'Osteoporosis',
      name: 'osteoporosis',
      desc: '',
      args: [],
    );
  }

  /// `Stroke`
  String get stroke {
    return Intl.message(
      'Stroke',
      name: 'stroke',
      desc: '',
      args: [],
    );
  }

  /// `Hysterectomy (abdominal or Vaginal)`
  String get hysterectomy {
    return Intl.message(
      'Hysterectomy (abdominal or Vaginal)',
      name: 'hysterectomy',
      desc: '',
      args: [],
    );
  }

  /// `Vaginal repair`
  String get repair {
    return Intl.message(
      'Vaginal repair',
      name: 'repair',
      desc: '',
      args: [],
    );
  }

  /// `Vaginal tape/mesh (TVT/ TVT-O)`
  String get tape {
    return Intl.message(
      'Vaginal tape/mesh (TVT/ TVT-O)',
      name: 'tape',
      desc: '',
      args: [],
    );
  }

  /// `Anterior Vaginal Wall Repair without the use of mesh`
  String get anterior_vaginal_wall {
    return Intl.message(
      'Anterior Vaginal Wall Repair without the use of mesh',
      name: 'anterior_vaginal_wall',
      desc: '',
      args: [],
    );
  }

  /// ` Posterior Vaginal Wall Repair without the use of mesh`
  String get posterior_vaginal_wall {
    return Intl.message(
      ' Posterior Vaginal Wall Repair without the use of mesh',
      name: 'posterior_vaginal_wall',
      desc: '',
      args: [],
    );
  }

  /// `Operations to treat Prolapse of the Vaginal Vault (top of the vaigna)`
  String get operations {
    return Intl.message(
      'Operations to treat Prolapse of the Vaginal Vault (top of the vaigna)',
      name: 'operations',
      desc: '',
      args: [],
    );
  }

  /// `Sacrocolpopexy for Vaginal Vault Prolapse`
  String get sacrocolpopexy {
    return Intl.message(
      'Sacrocolpopexy for Vaginal Vault Prolapse',
      name: 'sacrocolpopexy',
      desc: '',
      args: [],
    );
  }

  /// `Sacrospinous ligament fixation (SSLF) for prolapse of the uterus (womb) or prolapse of the vaginal vault`
  String get SSLF {
    return Intl.message(
      'Sacrospinous ligament fixation (SSLF) for prolapse of the uterus (womb) or prolapse of the vaginal vault',
      name: 'SSLF',
      desc: '',
      args: [],
    );
  }

  /// `Colpocleisis (Closing the vagina to treat prolapse)`
  String get Colpocleisis {
    return Intl.message(
      'Colpocleisis (Closing the vagina to treat prolapse)',
      name: 'Colpocleisis',
      desc: '',
      args: [],
    );
  }

  /// `Operations to treat Prolapse of the Uterus (Womb Prolapse)`
  String get womb_prolapse {
    return Intl.message(
      'Operations to treat Prolapse of the Uterus (Womb Prolapse)',
      name: 'womb_prolapse',
      desc: '',
      args: [],
    );
  }

  /// `What is Urinary incontinence`
  String get urinary_incontinence {
    return Intl.message(
      'What is Urinary incontinence',
      name: 'urinary_incontinence',
      desc: '',
      args: [],
    );
  }

  /// `Botox injections to treat overactive bladder`
  String get botox {
    return Intl.message(
      'Botox injections to treat overactive bladder',
      name: 'botox',
      desc: '',
      args: [],
    );
  }

  /// `Synthetic Vaginal Mesh Tape Procedure for the Surgical Treatment of Stress Urinary Incontinence in Women`
  String get synthetic {
    return Intl.message(
      'Synthetic Vaginal Mesh Tape Procedure for the Surgical Treatment of Stress Urinary Incontinence in Women',
      name: 'synthetic',
      desc: '',
      args: [],
    );
  }

  /// `Urethral Bulking to treat Stress Urinary Incontinence`
  String get urethral_bulking {
    return Intl.message(
      'Urethral Bulking to treat Stress Urinary Incontinence',
      name: 'urethral_bulking',
      desc: '',
      args: [],
    );
  }

  /// `Bladder pain syndrome/interstitial cystitis`
  String get bladder_pain_syndrome_cystitis {
    return Intl.message(
      'Bladder pain syndrome/interstitial cystitis',
      name: 'bladder_pain_syndrome_cystitis',
      desc: '',
      args: [],
    );
  }

  /// `Fotona vaginal laser`
  String get fotona_vaginal_laser {
    return Intl.message(
      'Fotona vaginal laser',
      name: 'fotona_vaginal_laser',
      desc: '',
      args: [],
    );
  }

  /// `Menopause leaflet`
  String get menopause_leaflet {
    return Intl.message(
      'Menopause leaflet',
      name: 'menopause_leaflet',
      desc: '',
      args: [],
    );
  }

  /// `Go Back to Home`
  String get to_home {
    return Intl.message(
      'Go Back to Home',
      name: 'to_home',
      desc: '',
      args: [],
    );
  }

  /// `SKIP`
  String get skip {
    return Intl.message(
      'SKIP',
      name: 'skip',
      desc: '',
      args: [],
    );
  }

  /// `PREV`
  String get prev {
    return Intl.message(
      'PREV',
      name: 'prev',
      desc: '',
      args: [],
    );
  }

  /// `Send Details to My Doctor`
  String get send_details {
    return Intl.message(
      'Send Details to My Doctor',
      name: 'send_details',
      desc: '',
      args: [],
    );
  }

  /// `Home`
  String get home {
    return Intl.message(
      'Home',
      name: 'home',
      desc: '',
      args: [],
    );
  }

  /// `Profile`
  String get profile {
    return Intl.message(
      'Profile',
      name: 'profile',
      desc: '',
      args: [],
    );
  }

  /// `Log out`
  String get logout {
    return Intl.message(
      'Log out',
      name: 'logout',
      desc: '',
      args: [],
    );
  }

  /// `Delete account`
  String get cancellation {
    return Intl.message(
      'Delete account',
      name: 'cancellation',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your first name`
  String get enterfirst {
    return Intl.message(
      'Please enter your first name',
      name: 'enterfirst',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your surname`
  String get entersur {
    return Intl.message(
      'Please enter your surname',
      name: 'entersur',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your phone number`
  String get enterphone {
    return Intl.message(
      'Please enter your phone number',
      name: 'enterphone',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your height`
  String get enterheight {
    return Intl.message(
      'Please enter your height',
      name: 'enterheight',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your weight`
  String get enterweight {
    return Intl.message(
      'Please enter your weight',
      name: 'enterweight',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your Email`
  String get enteremail {
    return Intl.message(
      'Please enter your Email',
      name: 'enteremail',
      desc: '',
      args: [],
    );
  }

  /// `Please select a weight unit`
  String get enterunit {
    return Intl.message(
      'Please select a weight unit',
      name: 'enterunit',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your main complaint`
  String get entercomplaint {
    return Intl.message(
      'Please enter your main complaint',
      name: 'entercomplaint',
      desc: '',
      args: [],
    );
  }

  /// `Questionnaire`
  String get questionnaire {
    return Intl.message(
      'Questionnaire',
      name: 'questionnaire',
      desc: '',
      args: [],
    );
  }

  /// `Please answer all the questions before proceeding.`
  String get all_question {
    return Intl.message(
      'Please answer all the questions before proceeding.',
      name: 'all_question',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your password`
  String get enter_password {
    return Intl.message(
      'Please enter your password',
      name: 'enter_password',
      desc: '',
      args: [],
    );
  }

  /// `LOG IN`
  String get login {
    return Intl.message(
      'LOG IN',
      name: 'login',
      desc: '',
      args: [],
    );
  }

  /// `SIGN UP`
  String get register {
    return Intl.message(
      'SIGN UP',
      name: 'register',
      desc: '',
      args: [],
    );
  }

  /// `FORGET PASSWORD`
  String get forget {
    return Intl.message(
      'FORGET PASSWORD',
      name: 'forget',
      desc: '',
      args: [],
    );
  }

  /// `Please enter the correct captcha`
  String get entercaptcha {
    return Intl.message(
      'Please enter the correct captcha',
      name: 'entercaptcha',
      desc: '',
      args: [],
    );
  }

  /// `Please enter your new password`
  String get enter_npass {
    return Intl.message(
      'Please enter your new password',
      name: 'enter_npass',
      desc: '',
      args: [],
    );
  }

  /// `Success`
  String get success {
    return Intl.message(
      'Success',
      name: 'success',
      desc: '',
      args: [],
    );
  }

  /// `Your details have been sent to your doctor.`
  String get has_sent {
    return Intl.message(
      'Your details have been sent to your doctor.',
      name: 'has_sent',
      desc: '',
      args: [],
    );
  }

  /// `Ethnic`
  String get ethnic {
    return Intl.message(
      'Ethnic',
      name: 'ethnic',
      desc: '',
      args: [],
    );
  }

  /// `Asian`
  String get asian {
    return Intl.message(
      'Asian',
      name: 'asian',
      desc: '',
      args: [],
    );
  }

  /// `African`
  String get african {
    return Intl.message(
      'African',
      name: 'african',
      desc: '',
      args: [],
    );
  }

  /// `European`
  String get european {
    return Intl.message(
      'European',
      name: 'european',
      desc: '',
      args: [],
    );
  }

  /// `Latin American`
  String get latin {
    return Intl.message(
      'Latin American',
      name: 'latin',
      desc: '',
      args: [],
    );
  }

  /// `North American`
  String get north {
    return Intl.message(
      'North American',
      name: 'north',
      desc: '',
      args: [],
    );
  }

  /// `Oceanian`
  String get oceanian {
    return Intl.message(
      'Oceanian',
      name: 'oceanian',
      desc: '',
      args: [],
    );
  }

  /// `Mixed`
  String get mix {
    return Intl.message(
      'Mixed',
      name: 'mix',
      desc: '',
      args: [],
    );
  }

  /// `Please select`
  String get select {
    return Intl.message(
      'Please select',
      name: 'select',
      desc: '',
      args: [],
    );
  }

  /// `Privacy Policy`
  String get privacy {
    return Intl.message(
      'Privacy Policy',
      name: 'privacy',
      desc: '',
      args: [],
    );
  }

  /// `Warning`
  String get alert {
    return Intl.message(
      'Warning',
      name: 'alert',
      desc: '',
      args: [],
    );
  }

  /// `Are you sure you want to delete your account? This action cannot be undone.`
  String get alertmessage {
    return Intl.message(
      'Are you sure you want to delete your account? This action cannot be undone.',
      name: 'alertmessage',
      desc: '',
      args: [],
    );
  }

  /// `By registering, you agree to our `
  String get registerprivacy {
    return Intl.message(
      'By registering, you agree to our ',
      name: 'registerprivacy',
      desc: '',
      args: [],
    );
  }
}

class AppLocalizationDelegate extends LocalizationsDelegate<S> {
  const AppLocalizationDelegate();

  List<Locale> get supportedLocales {
    return const <Locale>[
      Locale.fromSubtags(languageCode: 'en'),
      Locale.fromSubtags(languageCode: 'he'),
      Locale.fromSubtags(languageCode: 'zh'),
    ];
  }

  @override
  bool isSupported(Locale locale) => _isSupported(locale);
  @override
  Future<S> load(Locale locale) => S.load(locale);
  @override
  bool shouldReload(AppLocalizationDelegate old) => false;

  bool _isSupported(Locale locale) {
    for (var supportedLocale in supportedLocales) {
      if (supportedLocale.languageCode == locale.languageCode) {
        return true;
      }
    }
    return false;
  }
}
