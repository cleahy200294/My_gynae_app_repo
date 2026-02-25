import { Button, message, Modal, Tabs } from 'antd';
import { FC, memo, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  PDFViewer,
  Page,
  View,
  Document,
  Text,
  Image,
  StyleSheet,
  usePDF,
} from '@react-pdf/renderer';

// Use base64 images for reliable PDF rendering in production
import { qr1Base64, qr2Base64, qr3Base64, qr4Base64 } from '@/assets/imageBase64';
// TVT supporting leaflets (ensure these PDF files exist under src/assets)
import tvtMeshTapesLeafletPdf from '@/assets/SUI_Mesh_Tapes_Leaflet.pdf';
import tvtPatientRequestPdf from '@/assets/Patient_Request_for_TVT_Insertion.pdf';
import { DetailsMap } from '@/pages/patient/components/consentform/ConsentForm';
import { MailOutlined } from '@ant-design/icons';
import { sendPdf } from '@/api/pdf';
import moment from 'moment';
// Import TVT-specific consent PDF component
import TvtConsentPdf from './TvtConsentPdf';

interface Iprops {
  trigger: ReactNode;
  consent: any;
  surgical: number;
  email: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: '30 60',
    fontSize: 10,
    position: 'relative',
  },
  link1: {
    textAlign: 'left',
    marginBottom: 8,
    color: '#0022ee',
  },
  titleBox: {
    // position: 'absolute',
    // left: 60,
    // top: 60,
    // width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    width: '476',
    marginTop: 12,
    marginBottom: 12,
  },
  subtitleBox: {
    width: 476,
    borderBottomColor: '#999',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    fontSize: 12,
    paddingBottom: 8,
    marginBottom: 10,
    marginTop: 12,
    fontWeight: 'bold',
    color: '#015249',
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 476,
    flexWrap: 'wrap',
  },
  personnalSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 230,
    paddingBottom: 8,
  },
  medicalSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 476,
    paddingBottom: 12,
  },
  threeSection: {
    width: 150,
    paddingBottom: 8,
  },
  label: {
    paddingRight: 6,
    width: 110,
    alignSelf: 'baseline',
    color: '#015249',
  },
  desc: {
    color: '#333',
  },
  img: {
    width: 210,
    height: 150,
  },
  img4: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderBottom: '1px solid #333',
    width: '100%',
    color: '#333',
  },
  label1: {
    paddingRight: 6,
    width: 120,
    color: '#015249',
    alignSelf: 'baseline',
  },
  formSection: {
    width: 476,
    paddingBottom: 12,
  },
  label2: {
    width: 240,
    color: '#015249',
    alignSelf: 'baseline',
  },
  sublabel: {
    color: '#666',
    fontSize: 8,
    marginLeft: 12,
  },
  desc1: {
    color: '#333',
    marginRight: 12,
  },
  tr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 476,
  },
  td: {
    backgroundColor: '#deeaff',
    padding: 8,
    border: '1px solid #004379',
    width: 140,
  },
  td1: {
    backgroundColor: '#deeaff',
    padding: 8,
    border: '1px solid #004379',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  td2: {
    width: '100%',
    marginBottom: 8,
  },
  td3: {
    width: '100%',
    color: '#666',
    fontSize: 9,
    marginBottom: 12,
  },
  qrbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 476,
  },
  linkbox: {
    width: 240,
    marginTop: 20,
  },
  td11: {
    backgroundColor: '#deeaff',
    padding: 8,
    border: '1px solid #004379',
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  checkbox: {
    fontSize: 12,
    color: '#ff0000',
  },
  signature: {
    width: 96,
    height: 32,
    marginTop: 12,
  },
});

const ConsentPdf: FC<Iprops> = (props) => {
  const { trigger, consent, surgical, email } = props;

  // For TVT (surgical == 6), use the dedicated TVT consent PDF component
  if (surgical === 6) {
    return <TvtConsentPdf trigger={trigger} consent={consent} email={email} />;
  }

  const surgical_name = useMemo<string>(() => {
    let name = '';
    if (!surgical) {
      return name;
    }
    if (surgical == 1 || surgical == 2 || surgical == 3) {
      name = 'Vaginal hysterectomy';
    }
    if (surgical == 4) {
      name = 'Sacrocolpopexy';
    }
    if (surgical == 5) {
      name = 'Hysteropexy';
    }
    if (surgical == 6) {
      name = 'TVT';
    }
    if (surgical == 7) {
      name = 'Bulking agent';
    }
    return name;
  }, [surgical]);

  const name = 'Pelvic floor repair ' + surgical_name;

  const [visible, setVisible] = useState(false);

  const document = (
    <Document title={name}>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{'Consent Form: ' + name}</Text>
          <View style={styles.contentBox}>
            <View style={styles.medicalSection}>
              <Text style={styles.desc}>
                This form should only be used if the patient has capacity to
                give consent. If the patient does not legally have capacity,
                please use an appropriate alternative consent form from your
                hospital or hub.
              </Text>
            </View>
            <View style={styles.medicalSection}>
              <Text style={styles.desc}>
                <Text style={styles.bold}>Note to patients:</Text> Please note
                it is common NHS practice for a patient’s consent to be taken by
                a clinician other than the operating or listing surgeon. This
                clinician will be suitably trained and competent to take your
                consent. They will be referred to as your ‘responsible
                healthcare professional’ in this form.
              </Text>
            </View>
            <View style={styles.medicalSection}>
              <Text style={styles.bold}>
                You may have questions before starting, during or after your
                procedure. Contact details are provided for any further queries,
                concerns or if you would like to discuss your treatment further.
              </Text>
            </View>
            <Text style={styles.subtitleBox}>Patient details</Text>
            <View style={styles.personnalSection}>
              <Text style={styles.label1}>First name</Text>
              <Text style={styles.input}>{consent.a1 || ' '}</Text>
            </View>
            <View style={styles.personnalSection}>
              <Text style={styles.label1}>Last name</Text>
              <Text style={styles.input}>{consent.a2 || ' '}</Text>
            </View>
            <View style={styles.personnalSection}>
              <Text style={styles.label1}>Date of birth</Text>
              <Text style={styles.input}>{consent.a3 || ' '}</Text>
            </View>
            <View style={styles.personnalSection}>
              <Text style={styles.label1}>Patient identifier</Text>
              <Text style={styles.input}>{consent.a4 || ' '}</Text>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.label2}>
                Responsible Healthcare Professional
              </Text>
              <Text style={styles.input}>{consent.a5 || ' '}</Text>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.label2}>
                Special requirements
                <Text style={styles.sublabel}>
                  e.g.,transport, interpreter, assistance
                </Text>
              </Text>
              <Text style={styles.input}>{consent.a6 || ' '}</Text>
            </View>
            <View style={styles.medicalSection}>
              <Text style={styles.label2}>
                The patient has been given all the leaflets
              </Text>
              <Text style={styles.desc1}>
                <Text style={styles.checkbox}>x </Text>
                Yes
              </Text>{' '}
              <Text style={styles.desc1}>No</Text>
            </View>
          </View>
          <Text style={styles.subtitleBox}>
            Details of {surgical_name} and repair
          </Text>
          <View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                {surgical_name} and repair procedure
              </Text>
              <View style={styles.td1}>
                {DetailsMap[surgical_name].map(
                  (item: string, index: number) => (
                    <Text style={styles.td2} key={index}>
                      {item}
                    </Text>
                  ),
                )}
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>Extra procedures</Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>
                  {consent.a7 && consent.a7.includes('1') ? (
                    <Text style={styles.checkbox}>x </Text>
                  ) : null}
                  Saprospinous ligament fixation
                </Text>
                <Text style={styles.td3}>
                  This is where dissolvable stitches (sutures) are used to
                  stitch the top of the vagina (vaginal vault) to the
                  sacrospinous ligament.
                </Text>
                <Text style={styles.td2}>
                  {consent.a7 && consent.a7.includes('2') ? (
                    <Text style={styles.checkbox}>x </Text>
                  ) : null}
                  Cystourethroscopy and biopsy
                </Text>
                <Text style={styles.td3}>
                  This is where a small camera is inserted through the tube that
                  connects the bladder to the outside (urethra) to look inside
                  your bladder. A small sample (biopsy) of bladder wall may be
                  taken at the same time, if required.
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Indication for, and purpose of surgery:
                <Text style={styles.sublabel}>(Tick as appropriate)</Text>
              </Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>
                  {consent.a8 && consent.a8.includes('1') ? (
                    <Text style={styles.checkbox}>x </Text>
                  ) : null}
                  Prolapse
                </Text>
                <Text style={styles.td3}>
                  To treat and reduce the symptoms of prolapse (a bulge in, or
                  coming from the vagina, caused by poor support of the bladder,
                  bowel or womb)
                </Text>
                <Text style={styles.td2}>
                  {consent.a8 && consent.a8.includes('2') ? (
                    <Text style={styles.checkbox}>x </Text>
                  ) : null}
                  Investigation of lower urinary tract concerns (when cystoscopy
                  and biopsy is also planned)
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Alternatives considered:
                <Text style={styles.sublabel}>(Tick as appropriate)</Text>
              </Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>Nonsurgical management</Text>
                <Text style={styles.td2}>
                  {consent.a9 && consent.a9.includes('1') ? (
                    <Text style={styles.checkbox}>x </Text>
                  ) : null}
                  Pelvic floor muscle therapy (PFMT)
                </Text>
                <Text style={styles.td3}>
                  PFMT is a type of physiotherapy, which uses exercises to
                  strengthen the pelvic floor muscles. Supervised PFMT has been
                  shown to assist with symptoms of prolapse and can reduce mild
                  and moderate prolapse severity. Some people feel they do not
                  need surgical therapy after undergoing PFMT.
                </Text>
                <Text style={styles.td2}>
                  {consent.a9 && consent.a9.includes('2') ? (
                    <Text style={styles.checkbox}>x </Text>
                  ) : null}
                  Use of pessaries for prolapse
                </Text>
                <Text style={styles.td3}>
                  Pessaries are plastic/rubber devices that can go into the
                  vagina to try and support the prolapse and reduce its effects.
                  They are not always suitable for all vaginal prolapse.
                </Text>
                <Text style={styles.td2}>Alternative surgical options</Text>
                <Text style={styles.td2}>Colpocleisis</Text>
                <Text style={styles.td3}>
                  A colpocleisis is an operation to close the vagina. You will
                  not be able to have vaginal sexual intercourse after this
                  operation. It involves suturing together the front and back
                  wall of the vagina, and if you have a uterus (womb), lifting
                  it up slightly higher in the vagina. This operation is not
                  always possible depending on the type and severity of
                  prolapse. Your surgeon will be able to tell you if your
                  prolapse is suitable for this operation.
                </Text>
                <Text style={styles.td2}>Sacrohysteropexy</Text>
                <Text style={styles.td3}>
                  This is an operation that uses mesh (synthetic or biological)
                  to lift up the uterus (womb) rather than remove it. This is
                  particularly worth considering if you wish to maintain
                  fertility but want treatment for the uterine prolapse.
                  Synthetic mesh is similar to that used in hernia operations
                  and will be covered in a layer of your own tissue called
                  peritoneum. This operation is considered safe, but there is
                  always the risk of mesh exposure and related complications.
                  Your surgeon will be able to tell you more. Leaflets are also
                  available from the British Society of Urogynaecology (BSUG)
                  website, which describe this operation in more detail.
                </Text>
                <Text style={styles.td2}>
                  Vaginal sacrospinous ligament hysteropexy
                </Text>
                <Text style={styles.td3}>
                  This is another operation particularly worth considering if
                  you wish to maintain fertility but want treatment for the
                  uterine prolapse treated. Using dissolvable stitches
                  (sutures), the uterus is lifted up rather than removed. This
                  operation does not use mesh. Instead, the sacrospinous
                  ligament is located via the vagina and stitches are put in it
                  to sew the cervix onto the ligament. The stitches are slowly
                  absorbed over time and they are eventually replaced by scar
                  tissue, which then hopefully supports the vagina or uterus
                </Text>
                <Text style={styles.td2}>Manchester repair</Text>
                <Text style={styles.td3}>
                  The neck of the womb (cervix) is removed and the womb (uterus)
                  is slightly raised using synthetic stitches.
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.link1}>
            https://bsug.org.uk/pages/for-patients/bsug-patient-information-leaflets/154
          </Text>
          <Text style={styles.td2}>
            Anterior vaginal wall repair without the use of mesh – British
            Society of Urogynaecology
          </Text>
          <Image style={styles.img4} src={qr1Base64} />
          <Text style={styles.td2}>
            Posterior vaginal wall repair without the use of mesh – British
            Society of Urogynaecology
          </Text>
          <Image style={styles.img4} src={qr2Base64} />
          <Text style={styles.td2}>
            Information for you after a vaginal hysterectomy – Royal College of
            Obstetricians and Gynaecologists
          </Text>
          <Text style={styles.link1}>
            https://patient.concentric.health/info/662t
          </Text>
          <Text style={styles.td2}>
            Information for you after a pelvic floor repair – Royal College of
            Obstetricians and Gynaecologists
          </Text>
          <Text style={styles.link1}>
            https://patient.concentric.health/info/8x8t
          </Text>
          <Text style={styles.td2}>
            If you do not wish to access the additional patient information
            contained within this consent form digitally, please speak to your
            responsible healthcare professional and they will provide you with
            hard copies. These will be provided in a language and format that
            suits you.
          </Text>
          <Text style={styles.subtitleBox}>Anaesthesia</Text>
          <Text style={styles.td2}>
            Anaesthetic is used to allow surgery to take place painlessly. It
            may include medicines that put you to sleep, or those which only
            numb the area being operated on while you remain awake. This can be
            done in various ways and your anaesthetist will advise you on your
            options and talk to you about the risks, complications and benefits
            of your choice. There is no legal requirement to obtain written
            consent for the type of anaesthesia given to a patient; this section
            of the consent form is for your information only.
          </Text>
          <Text style={styles.td2}>
            On the day of surgery, an anaesthetist will discuss anaesthetic
            options and risks with you. This is a shared decisionmaking process,
            and you will jointly decide and agree the anaesthetic option that is
            best for you. Please remember that if there are any complications
            during surgery, your anaesthetist may need to alter the type of
            anaesthesia and they will explain this to you during the procedures.
          </Text>
          <Text style={styles.td2}>
            For further information about the types of anaesthetic you may
            receive, and potential risks, please see the information below.
          </Text>
          <View style={styles.qrbox}>
            <View>
              <Text>Types</Text>
              <Image style={styles.img4} src={qr3Base64} />
            </View>
            <View>
              <Text>Risks</Text>
              <Image style={styles.img4} src={qr4Base64} />
            </View>
            <View style={styles.linkbox}>
              <Text style={styles.link1}>
                https://www.rcoa.ac.uk/documents/anaesthesia-explained/types-anaesthesia
              </Text>
              <Text style={styles.link1}>
                https://www.rcoa.ac.uk/sites/defualt/files/documents/2019-11/Riskinfographics_2019web.pdf
              </Text>
            </View>
          </View>
          <Text style={styles.td2}>
            If you do not wish to access the additional patient information via
            link or QR code, please speak to your responsible healthcare
            professional and they will provide you with a hard copy. These will
            be provided in a language and format that suits you.
          </Text>
          <Text style={styles.subtitleBox}>
            TO BE FILLED OUT BY CLINICIAN ON THE DAY OF SURGERY
          </Text>
          <View style={styles.formSection}>
            <Text style={styles.label2}>Name of anaesthetist on the day</Text>
            <Text style={styles.input}>{consent.a10 || ' '}</Text>
          </View>
          <View style={styles.formSection}>
            <Text style={styles.label2}>Date</Text>
            <Text style={styles.input}>{consent.a11 ? moment(consent.a11).format('DD/MM/YYYY') : ' '}</Text>
          </View>
          <Text style={styles.td2}>
            {consent.a12 && consent.a12.includes('1') ? (
              <Text style={styles.checkbox}>x </Text>
            ) : null}
            I confirm I have discussed the different anaesthetic options with
            the patient, including risks and benefits, and we have jointly
            decided the preferred anaesthetic.
          </Text>
          <Text style={styles.td2}>
            <Text style={styles.bold}>
              Please note the preferred methods of anaesthesia as discussed
              between the patient and anaesthetist below:
            </Text>
          </Text>
          <Text style={styles.td2}>
            You will be told of any additional procedures in addition to those
            described on this form that may become necessary
          </Text>
          <View style={styles.td11}>{consent.a13 || ' '}</View>
          <Text style={styles.td2}>
            during your treatment. Please list below any procedures
            <Text style={styles.bold}>YOU DO NOT WISH TO BE CARRIED OUT</Text>
            without further discussion.
          </Text>
          <Text style={styles.subtitleBox}>
            Immediate risks (during the procedure)
          </Text>
          <Text style={styles.td2}>
            <Text style={styles.bold}>
              (Your responsible healthcare professional will delete as
              appropriate)
            </Text>
          </Text>
          <View>
            <View style={styles.tr}>
              <Text style={styles.td}>Expected</Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>Vaginal bleeding</Text>
                <Text style={styles.td3}>
                  A small amount of bleeding, which is usually less than a
                  mugful of blood, is to be expected.
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Common
                <Text style={styles.sublabel}>(more than 1 in 20)</Text>
              </Text>
              <View style={styles.td1}> </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Uncommon
                <Text style={styles.sublabel}>(fewer than 1 in 20)</Text>
              </Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>
                  Perioperative risks (risks around the time of your operation)
                </Text>
                <Text style={styles.td3}>
                  With any operation, there is an increased risk of several
                  perioperative complications. These include allergies and risks
                  of having an anaesthetic, which will be discussed with you by
                  an anaesthetist. Other complications include a chest
                  infection, problems with the heart (including a heart attack),
                  stroke, memory problems or worsened kidney function. Any
                  existing medical problems could also get worse. You might need
                  to stay in hospital for longer, or need additional treatment.
                  In some cases, you will need admission to intensive care, and
                  the complications may be lifethreatening.
                </Text>
                <Text style={styles.td2}>Significant bleeding</Text>
                <Text style={styles.td3}>
                  Some bleeding is expected during most procedures; however,
                  significant bleeding may require further treatment. It can
                  usually be dealt with during the procedure, but may lead to a
                  change from the planned procedure, a blood transfusion, or
                  further emergency treatment.
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Rare
                <Text style={styles.sublabel}>(fewer than 1 in 100)</Text>
              </Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>Compression injury</Text>
                <Text style={styles.td3}>
                  A compression injury describes any damage caused by pressure
                  to tissues such as skin or nerves. This type of injury can
                  occur in the operating theatre as you are lying in one
                  position for several hours. Any areas that are at risk, such
                  as bony prominences, are padded during surgery to reduce the
                  risk of compression injury. If this does occur you may
                  experience numbness or a tingling sensation in the affected
                  area. This is usually temporary.
                </Text>
                <Text style={styles.td2}>Damage to surrounding structures</Text>
                <Text style={styles.td3}>
                  Other nearby organs and structures are at risk of being
                  injured during surgery. For this operation there is a risk of
                  injury to the bladder, the ureters – the tubes which carry
                  urine from the kidneys to the bladder, the bowel and to major
                  blood vessels in the area. In the very rare circumstance of
                  significant injury this would usually be repaired immediately
                  and this may need a cystoscopy (camera to look inside the
                  bladder),a larger cut in the tummy (abdomen) and the damaged
                  item repaired. Very rarely, a stoma is needed. This is when a
                  hole is made on the front of your tummy (abdomen) to divert
                  faeces or urine into a bag outside the body.
                </Text>
                <Text style={styles.td3}>
                  If your bladder is injured, you would usually have a catheter
                  inserted for 7–14 days after surgery.
                </Text>
                <Text style={styles.td3}>
                  There is a risk of any damage not being noticed at the time of
                  surgery. This would lead to symptoms in the days following
                  surgery, and possibly further surgery.
                </Text>
                <Text style={styles.td2}>Blood clots</Text>
                <Text style={styles.td3}>
                  Different techniques are used to reduce the risk of blood
                  clots forming; however, these can still arise during surgery.
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Specific risks to you from your treatment (to be input by your
                responsible healthcare professional)
              </Text>
              <View style={styles.td1}>
                <Text> </Text>
              </View>
            </View>
          </View>
          <Text style={styles.subtitleBox}>
            Early and late risks (in the days, weeks or months after the
            procedure)
          </Text>
          <Text style={styles.td2}>
            <Text style={styles.bold}>
              (Your responsible healthcare professional will delete as
              appropriate)
            </Text>
          </Text>
          <View>
            <View style={styles.tr}>
              <Text style={styles.td}>Expected</Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>Pain</Text>
                <Text style={styles.td3}>
                  It is normal to have some mild pain or discomfort in the
                  vagina.
                </Text>
                <Text style={styles.td3}>
                  If a sacrospinous ligament fixation is carried out, pain in
                  the buttock cheek on the side where the ligament is ‘fixed’
                  occurs for between 1 and 3 patients out of 20.
                </Text>
                <Text style={styles.td3}>
                  Pain is common after surgery but again, this may be reduced by
                  a lot of local anaesthesia given during surgery and/or
                  additional regional anaesthetic, such as a spinal anaesthetic
                  extra to the general anaesthetic. The local anaesthetic and
                  spinal anaesthetic tend to last a few hours longer than the
                  general anaesthetic alone allowing a longer pain-free
                  duration.
                </Text>
                <Text style={styles.td3}>
                  In the days and few weeks after surgery, you may feel some
                  discomfort rather than pain and should be able to carry out
                  routine care of yourself. If you are unable to control the
                  pain, please contact your GP or the hospital to organise
                  appropriate care.
                </Text>
                <Text style={styles.td2}>Vaginal bleeding</Text>
                <Text style={styles.td3}>
                  Vaginal bleeding is when blood is passed from the vagina. Some
                  bleeding should be expected for up to a week after surgery.
                  Pads should be used rather than tampons to reduce the risk of
                  infection. If the bleeding becomes heavier – more like a
                  period – please get in touch with your clinical team as you
                  might have developed an infection or a problem that needs
                  treatment.
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Common
                <Text style={styles.sublabel}>(more than 1 in 20)</Text>
              </Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>
                  Urinary infection (water infection or cystitis)
                </Text>
                <Text style={styles.td3}>
                  A urinary tract infection (UTI) is an infection of the urine.
                  It often leads to discomfort when passing urine, and can make
                  you feel like you need to pass urine more often. UTIs just
                  affect your bladder but can sometimes lead to more serious
                  infections, including blood infections (sepsis).
                </Text>
                <Text style={styles.td2}>Vaginal infection</Text>
                <Text style={styles.td3}>
                  The area that has been operated on can become infected with
                  bacteria from your vagina, or because of blood collecting in
                  your vagina behind the stitches.
                </Text>
                <Text style={styles.td3}>
                  Both urinary and vaginal infections can be managed with
                  antibiotic tablets, but sometimes antibiotics may need to be
                  given through a drip (though a tube inserted into your vein).
                  This may mean you have to stay in hospital. During most
                  operations, some antibiotics are given to reduce the risk of
                  infection anyway.
                </Text>
                <Text style={styles.td2}>Wound complications</Text>
                <Text style={styles.td3}>
                  The risk of developing a wound infection is higher in some
                  patients, including those who are obese, are smokers, and
                  patients with diabetes.
                </Text>
                <Text style={styles.td3}>
                  If you feel unwell with a high temperature or any signs of
                  infections including, but not limited to those highlighted
                  here, please go to your local Accident & Emergency Department
                  for a review as this may need urgent treatment and admission.
                </Text>
                <Text style={styles.td2}>Urinary symptoms</Text>
                <Text style={styles.td3}>
                  Bladder emptying and overactive bladder symptoms (feeling an
                  urgent need to pass urine) tend to improve after prolapse
                  surgery. However, some bladder symptoms can worsen after
                  surgery:
                </Text>
                <Text style={styles.td3}>
                  - Stress incontinence symptoms (where urine leaks on coughing,
                  laughing, etc.) worsen in around 1 in 10 people after
                  repairing a prolapse. This is because the prolapse may have
                  caused a kink in the urethra (the tube through which urine is
                  passed). Repairing the prolapse may remove the kink and expose
                  the underlying weakness in the urethra.
                </Text>
                <Text style={styles.td3}>
                  - Bladder emptying problems usually improve after surgery, but
                  some difficulties continue in 1 in 10 patients. You might have
                  more difficulty passing urine in the first 48 hours after
                  prolapse surgery, and this is managed by having a catheter
                  inserted for a few days. The catheter can usually be removed
                  within a week of surgery when normal bladder function has
                  resumed.
                </Text>
                <Text style={styles.td2}>
                  Recurrence of prolapse symptoms (1 in 3 chance)
                </Text>
                <Text style={styles.td3}>
                  Symptoms that were initially treated by the procedure may come
                  back and further investigations or treatment may be needed to
                  reduce these symptoms in future. A recurrence of prolapse is
                  seen in 1 in 3 patients. Sometimes, symptoms are not
                  significant enough to consider further surgical treatment, but
                  further prolapse surgery can be done if required.
                </Text>
                <Text style={styles.td2}>Dyspareunia (pain during sex)</Text>
                <Text style={styles.td3}>
                  Most women find that dyspareunia, the medical term for
                  experiencing pain during sex (sexual intercourse), improves
                  after prolapse surgery. Sex should be avoided during the first
                  6 weeks as the area heals. The procedure makes the vagina
                  narrower, and sometimes shorter, so some discomfort should be
                  expected during the following weeks.
                </Text>
                <Text style={styles.td2}>
                  Altered sensation during sexual intercourse (if vaginal wall
                  repair being done for prolapse)
                </Text>
                <Text style={styles.td3}>
                  Some women report reduced sensation during sex (sexual
                  intercourse) after the operation, or feel that the vagina is
                  too short or too tight. On the other hand, others report that
                  sex is significantly improved after prolapse surgery.
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Uncommon
                <Text style={styles.sublabel}>(fewer than 1 in 20)</Text>
              </Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>Need for more surgery</Text>
                <Text style={styles.td3}>
                  If there are complications after the operation, you may be
                  advised to have another operation during your hospital stay.
                  This would usually be to treat continued bleeding, to drain a
                  collection of blood or pus at the top of the vagina, or
                  because of wound complications.
                </Text>
                <Text style={styles.td2}>Constipation</Text>
                <Text style={styles.td3}>
                  Constipation is when it is difficult to empty your bowels, or
                  if bowel motions are less frequent than usual. Constipation
                  tends to improve after posterior wall prolapse. It can cause
                  pain when opening your bowels, or abdominal pain or
                  discomfort. Drinking plenty of fluids can help to ease any
                  symptoms of constipation. Some suppositories (medication that
                  is inserted into the rectum) can help open your bowels 2 days
                  after surgery. It is important to avoid constipation following
                  surgery to reduce the risk of prolapse occurring again. Your
                  GP may even start you on regular laxatives if they feel your
                  constipation s a problem.
                </Text>
                <Text style={styles.td2}>Vaginal vault prolapse</Text>
                <Text style={styles.td3}>
                  A vaginal vault prolapse is where the top of the vagina
                  (vaginal vault) drops down into the vaginal canal. If this
                  occurred, you may need a pessary for support (described above)
                  or further surgery.
                </Text>
                <Text style={styles.td2}>Vaginal vault dehiscence</Text>
                <Text style={styles.td3}>
                  A vaginal vault dehiscence is where the line of stitches
                  (sutures) at the top of the vagina come apart. This usually
                  needs emergency surgery to securely re-suture the top of the
                  vagina.
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Rare
                <Text style={styles.sublabel}>(fewer than 1 in 100)</Text>
              </Text>
              <View style={styles.td1}>
                <Text style={styles.td2}>
                  Blood clots (deep vein thrombosis or pulmonary embolus) (1 in
                  300 chance)
                </Text>
                <Text style={styles.td3}>
                  Blood clots can form in the veins of the legs (deep vein
                  thrombosis), causing pain and redness in the leg. These are
                  more likely to occur after an operation, when people move
                  around less. These clots can occasionally also travel from the
                  legs to the lung (pulmonary embolus) and can cause problems
                  with breathing. Clots in the leg or lung require treatment
                  such as with blood thinning medications. Your risk of getting
                  a blood clot is reduced by getting moving as soon as you can
                  after an operation. To reduce the risk of clots, you will most
                  likely be advised to wear compression stockings or calf
                  compression pumps and have blood thinning injections following
                  surgery.
                </Text>
                <Text style={styles.td2}>Death</Text>
                <Text style={styles.td3}>
                  There is a risk of dying either as a direct result of the
                  procedure or treatment, or from complications in the following
                  days or weeks. The risk depends on many factors, including
                  your age and any underlying medical problems you may have.
                </Text>
              </View>
            </View>
            <View style={styles.tr}>
              <Text style={styles.td}>
                Specific risks to you from your treatment (to be input by your
                responsible healthcare professional)
              </Text>
              <View style={styles.td1}> </View>
            </View>
          </View>
          <Text style={styles.subtitleBox}>
            Statement of health professional
          </Text>
          <Text style={styles.td2}>
            - I am suitably trained and competent and have sufficient knowledge
            to consent this patient in line with the requirements of my
            regulatory body.
          </Text>
          <Text style={styles.td2}>
            - I have discussed what the treatment is likely to involve, the
            benefits and risks of this procedure.
          </Text>
          <Text style={styles.td2}>
            - I have also discussed the benefits and risks of any available
            alternative procedures or treatments including no treatment.
          </Text>
          <Text style={styles.td2}>
            - have discussed any particular concerns of this patient.
          </Text>
          <View style={styles.medicalSection}>
            <Text style={styles.label2}>
              Copy of consent form accepted by patient
            </Text>
            {consent.a14 && consent.a14.includes('Yes') ? (
              <Text style={styles.checkbox}>x </Text>
            ) : null}
            <Text style={styles.desc1}>Yes</Text>
            {consent.a14 && consent.a14.includes('No') ? (
              <Text style={styles.checkbox}>x </Text>
            ) : null}
            <Text style={styles.desc1}>No</Text>
          </View>
          <View style={styles.contentBox}>
            <View style={styles.personnalSection}>
              <Text style={styles.label}>Signature</Text>
              <Text style={styles.input}>{consent.a15 || ' '}</Text>
            </View>
            <View style={styles.personnalSection}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.input}>{consent.a16 ? moment(consent.a16).format('DD/MM/YYYY') : ' '}</Text>
            </View>
            <View style={styles.personnalSection}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.input}>{consent.a17 || ' '}</Text>
            </View>
            <View style={styles.personnalSection}>
              <Text style={styles.label}>Job title</Text>
              <Text style={styles.input}>{consent.a18 || ' '}</Text>
            </View>
          </View>
          <Text style={styles.subtitleBox}>Statement of patient</Text>
          <Text style={styles.td2}>
            Please read this form carefully.If you have any further questions,
            do ask – we are here to help you. You have the right to change your
            mind at any time, including after you have signed this form.
          </Text>
          <View style={styles.contentBox}>
            <View style={styles.threeSection}>
              <Text style={styles.td2}>
                - I agree to the course of treatment described on this form.
              </Text>
              <Text style={styles.td2}>
                - I have had the benefits and possible risks of treatment
                explained to me.
              </Text>
              <Text style={styles.td2}>
                - I have had the opportunity to discuss treatment alternatives,
                including no treatment.
              </Text>
              <Text style={styles.td2}>
                - I understand that a guarantee cannot be given that a
                particular person will perform the procedure. The person will,
                however, have appropriate expertise.
              </Text>
              <Text style={styles.td2}>
                - I understand I have been/will be given the opportunity to
                discuss my anaesthetic options with an anaesthetist, and we will
                jointly decide which option is best for me. I understand that
                the type of anaesthesia may need to be altered if there are any
                complications during the procedure.
              </Text>
              <Text style={styles.td2}>
                - I have been told about additional procedures that are
                necessary prior to treatment or may become necessary during my
                treatment. This may include permanent skin marks and photographs
                to help with treatment planning and identification.
              </Text>
              <Text style={styles.td2}>
                - I understand that there may be people present for my procedure
                who are learning, such as junior doctors, medical students, and
                trainee nurses, and that I may decline to have any of these
                people present.
              </Text>
            </View>
            <View style={styles.threeSection}>
              <Text style={styles.td2}>
                {consent.a19 && consent.a19.includes('1') ? (
                  <Text style={styles.checkbox}>x </Text>
                ) : null}
                I agree that people who are learning, such as junior doctors,
                medical students and trainee nurses may participate in
                examinations if supervised by a fully qualified professional.
              </Text>
              <Text style={styles.td2}>
                {consent.a19 && consent.a19.includes('2') ? (
                  <Text style={styles.checkbox}>x </Text>
                ) : null}
                I understand that any procedure in addition to those described
                on this form will only be carried out if it is necessary to save
                my life or to prevent serious harm to my health.
              </Text>
              <Text style={styles.td2}>
                {consent.a19 && consent.a19.includes('3') ? (
                  <Text style={styles.checkbox}>x </Text>
                ) : null}
                I understand that information collected during my procedure/
                treatment, including images and video, may be used for
                education, audit and research (which may be published in medical
                journals). All information will be anonymised and used in a way
                that I cannot be identified.
              </Text>
              <Text style={styles.td2}>
                {consent.a19 && consent.a19.includes('4') ? (
                  <Text style={styles.checkbox}>x </Text>
                ) : null}
                I agree that my health records may be used by authorised members
                of staff, who are not directly involved in my clinical care, for
                research approved by a research ethics committee and in
                compliance with the Data Protection Act (2018).
              </Text>
              <Text style={styles.td2}>
                {consent.a19 && consent.a19.includes('5') ? (
                  <Text style={styles.checkbox}>x </Text>
                ) : null}
                I understand that patient specific data will be collected and
                may be used in the context of providing clinical care, in
                compliance with the Data Protection Act (2018).
              </Text>
              <Text style={styles.td2}>
                {consent.a19 && consent.a19.includes('6') ? (
                  <Text style={styles.checkbox}>x </Text>
                ) : null}
                I confirm that I have read and understood pages 1 to X of the
                consent form above.
              </Text>
            </View>
            <View style={styles.threeSection}>
              <Text style={styles.td2}>
                Please inform your responsible healthcare professional if you
                wish to withdraw consent for information use.
              </Text>
              <Text style={styles.td2}>
                Statement of interpreter/ witness
                <Text style={styles.sublabel}>(where appropriate)</Text>
              </Text>
              <Text style={styles.td2}>
                {consent.a20 && consent.a20.includes('1') ? (
                  <Text style={styles.checkbox}>x </Text>
                ) : null}
                I have interpreted the information contained in the form to the
                patient to the best of my abilities and in a way in which I
                believe they can understand.
              </Text>
              <Text style={styles.td2}>or</Text>
              <Text style={styles.td2}>
                {consent.a20 && consent.a20.includes('2') ? (
                  <Text style={styles.checkbox}>x </Text>
                ) : null}
                I confirm that the patient is unable to sign but has indicated
                their consent.
              </Text>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.input}>{consent.a21 || ' '}</Text>
              <Text style={styles.label}>Signature</Text>
              <Text style={styles.input}>{consent.a22 || ' '}</Text>
            </View>
          </View>
          <Text style={styles.td2}>Tick if relevant</Text>
          <Text style={styles.td2}>
            {consent.a25 && consent.a25.includes('1') ? (
              <Text style={styles.checkbox}>x </Text>
            ) : null}
            I confirm that there is no risk that I could be pregnant. Please
            inform your responsible healthcare professional and/or your clinical
            care team on the day of your procedure if you could be pregnant.
            Please note that a pregnancy test may give a negative result if a
            pregnancy has occurred within 2 weeks of the test.
          </Text>
          <View style={styles.contentBox}>
            <View style={styles.personnalSection}>
              <Text style={styles.label}>Name (PRINT)</Text>
              <Text style={styles.input}>{consent.a23 || ' '}</Text>
            </View>
            <View style={styles.personnalSection}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.input}>
                {consent.a24 ? moment(consent.a24).format('DD/MM/YYYY') : ' '}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitleBox}>Signature</Text>
          {consent.signature ? (
            <Image style={styles.signature} src={consent.signature}></Image>
          ) : null}
        </View>
      </Page>
    </Document>
  );

  const [pdf, updatePDF] = usePDF({ document });

  useEffect(() => {
    if (visible) {
      // Delay PDF generation until the modal and document tree are fully mounted
      setTimeout(() => {
        updatePDF();
      }, 0);
    }
  }, [visible, updatePDF]);

  return (
    <>
      <div onClick={() => setVisible((b) => !b)}>{trigger}</div>
      <Modal
        title={
          <>
            {name}
            <Button
              style={{ marginLeft: '16px' }}
              type="primary"
              icon={<MailOutlined />}
              onClick={async () => {
                if (pdf.blob) {
                  const result = await sendPdf({
                    email: email,
                    subject: 'Consent Form: ' + name,
                    file: pdf.blob,
                  });
                  if (!result.error) {
                    message.success('Sent successfully');
                  }
                }
              }}
            >
              Send to Patient
            </Button>
          </>
        }
        footer={''}
        centered
        width={800}
        open={visible}
        onCancel={() => setVisible(false)}
      >
        {surgical_name === 'TVT' ? (
          <Tabs
            defaultActiveKey="consent"
            items={[
              {
                key: 'consent',
                label: 'Consent PDF',
                children: (
                  <PDFViewer
                    style={{
                      width: '100%',
                      height: '500px',
                    }}
                  >
                    {document}
                  </PDFViewer>
                ),
              },
              {
                key: 'leaflet1',
                label: 'Mesh tape leaflet (PDF)',
                children: (
                  <iframe
                    title="Mesh tape leaflet"
                    src={tvtMeshTapesLeafletPdf}
                    style={{ width: '100%', height: '500px', border: 'none' }}
                  />
                ),
              },
              {
                key: 'leaflet2',
                label: 'Patient request form (PDF)',
                children: (
                  <iframe
                    title="Patient request form"
                    src={tvtPatientRequestPdf}
                    style={{ width: '100%', height: '500px', border: 'none' }}
                  />
                ),
              },
            ]}
          />
        ) : (
          <PDFViewer
            style={{
              width: '100%',
              height: '500px',
            }}
          >
            {document}
          </PDFViewer>
        )}
      </Modal>
    </>
  );
};

export default memo(ConsentPdf);
