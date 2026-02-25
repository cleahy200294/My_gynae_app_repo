import { Button, message, Modal, Tabs } from 'antd';
import { FC, memo, ReactNode, useEffect, useState } from 'react';
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

import { qr1Base64, qr2Base64, qr3Base64, qr4Base64 } from '@/assets/imageBase64';
import tvtMeshTapesLeafletPdf from '@/assets/SUI_Mesh_Tapes_Leaflet.pdf';
import tvtPatientRequestPdf from '@/assets/Patient_Request_for_TVT_Insertion.pdf';
import { MailOutlined } from '@ant-design/icons';
import { sendPdf } from '@/api/pdf';
import moment from 'moment';

interface Iprops {
  trigger: ReactNode;
  consent: any;
  email: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: '30 50',
    fontSize: 9,
    position: 'relative',
  },
  titleBox: {},
  title: {
    textAlign: 'center',
    fontSize: 16,
    width: '100%',
    marginTop: 10,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#015249',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 11,
    width: '100%',
    marginBottom: 12,
    color: '#333',
  },
  sectionTitle: {
    width: '100%',
    borderBottomColor: '#015249',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    fontSize: 11,
    paddingBottom: 6,
    marginBottom: 8,
    marginTop: 14,
    fontWeight: 'bold',
    color: '#015249',
  },
  subsectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#015249',
    marginTop: 8,
    marginBottom: 4,
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 6,
  },
  halfRow: {
    flexDirection: 'row',
    width: '48%',
    marginBottom: 6,
  },
  label: {
    width: 120,
    color: '#015249',
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
    color: '#333',
    paddingBottom: 2,
  },
  paragraph: {
    marginBottom: 6,
    lineHeight: 1.4,
    color: '#333',
  },
  boldParagraph: {
    marginBottom: 6,
    lineHeight: 1.4,
    fontWeight: 'bold',
    color: '#000',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ffc107',
    borderStyle: 'solid',
  },
  warningText: {
    color: '#856404',
    fontSize: 9,
  },
  checkbox: {
    fontSize: 10,
    color: '#c00',
    marginRight: 4,
  },
  checkItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  checkText: {
    flex: 1,
    color: '#333',
    lineHeight: 1.4,
  },
  table: {
    width: '100%',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#015249',
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    backgroundColor: '#015249',
    padding: 6,
    color: '#fff',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#015249',
    borderRightStyle: 'solid',
  },
  tableCellLast: {
    padding: 6,
  },
  riskCategory: {
    width: 80,
    backgroundColor: '#e8f4f8',
    fontWeight: 'bold',
    color: '#015249',
  },
  riskDescription: {
    flex: 1,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  signatureBox: {
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
    height: 30,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#666',
  },
  signature: {
    width: 120,
    height: 40,
  },
  bulletList: {
    paddingLeft: 12,
    marginBottom: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 10,
    color: '#015249',
  },
  bulletText: {
    flex: 1,
    color: '#333',
    lineHeight: 1.4,
  },
  qrImage: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  qrBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  link: {
    color: '#0066cc',
    fontSize: 8,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 50,
    fontSize: 8,
    color: '#666',
  },
  // Comparison table styles
  compTableHeader: {
    backgroundColor: '#015249',
    padding: 4,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 7,
    borderRightWidth: 1,
    borderRightColor: '#fff',
    borderRightStyle: 'solid',
  },
  compTableHeaderLast: {
    backgroundColor: '#015249',
    padding: 4,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 7,
  },
  compTableCell: {
    padding: 4,
    fontSize: 7,
    borderRightWidth: 1,
    borderRightColor: '#015249',
    borderRightStyle: 'solid',
    lineHeight: 1.3,
  },
  compTableCellLast: {
    padding: 4,
    fontSize: 7,
    lineHeight: 1.3,
  },
  compTableRowLabel: {
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#015249',
    backgroundColor: '#e8f4f8',
    borderRightWidth: 1,
    borderRightColor: '#015249',
    borderRightStyle: 'solid',
    lineHeight: 1.3,
  },
  // Risk table styles for procedure-specific risks
  riskTableHeader: {
    backgroundColor: '#015249',
    padding: 4,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 8,
  },
  riskTableComplication: {
    width: '30%',
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#015249',
    borderRightWidth: 1,
    borderRightColor: '#015249',
    borderRightStyle: 'solid',
    lineHeight: 1.3,
  },
  riskTableDesc: {
    width: '70%',
    padding: 4,
    fontSize: 7,
    lineHeight: 1.3,
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  numberedBullet: {
    width: 14,
    color: '#015249',
    fontWeight: 'bold',
  },
});

const PageNumber = () => (
  <Text
    style={styles.pageNumber}
    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
    fixed
  />
);

const TvtConsentPdf: FC<Iprops> = (props) => {
  const { trigger, consent, email } = props;
  const name = 'TVT (Retropubic Mesh Tape) for Stress Urinary Incontinence';

  const [visible, setVisible] = useState(false);

  const document = (
    <Document title={name}>
      {/* ==================== PAGE 1: Title + Patient Details ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Surgical options for Stress Urinary Incontinence</Text>
          <Text style={styles.subtitle}>
            You are asked to carefully read this information leaflet and consent form to enable you
            to better understand the procedures available to treat your present symptoms. Should you
            require clarification or additional information, please notify your doctor who will discuss
            any questions or concerns you may have. It is a requirement that a consent form be signed
            before carrying out any surgical procedure.
          </Text>
          <Text style={styles.paragraph}>
            This information leaflet talks about each type of surgery: how it is performed, the risks,
            the success rates and how the surgeries compare to each other. If you decide you would
            rather not proceed with surgery please notify your surgeon and other treatment options
            will be discussed with you.
          </Text>

          {/* Patient Details */}
          <Text style={styles.sectionTitle}>Patient Details</Text>
          <View style={styles.contentBox}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>First Name:</Text>
              <Text style={styles.value}>{consent.a1 || ' '}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.value}>{consent.a2 || ' '}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{consent.a3 || ' '}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>MRN/Identifier:</Text>
              <Text style={styles.value}>{consent.a4 || ' '}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Consultant:</Text>
              <Text style={styles.value}>{consent.a5 || ' '}</Text>
            </View>
          </View>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 2: What is SUI + Non-surgical Options ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>What is stress urinary incontinence?</Text>
        <Text style={styles.paragraph}>
          Stress urinary incontinence is the leakage of urine during activities such as coughing,
          sneezing, lifting, laughing or exercising. It affects up to 1 in 5 of women.
        </Text>
        <Text style={styles.paragraph}>
          Stress urinary incontinence has many causes including: pregnancy, childbirth, obesity,
          chronic cough, constipation, heavy lifting and genetically inherited factors.
        </Text>

        <Text style={styles.sectionTitle}>Non-surgical treatment options</Text>
        <Text style={styles.paragraph}>
          It is important to have tried conservative non-surgical options prior to considering surgery.
          These include:
        </Text>

        <Text style={styles.subsectionTitle}>Lifestyle changes</Text>
        <Text style={styles.paragraph}>
          Weight loss is an effective treatment option for overweight women with stress urinary
          incontinence.
        </Text>
        <Text style={styles.paragraph}>
          Fluid reduction to 1-1.5 litres per day can improve symptoms.
        </Text>
        <Text style={styles.paragraph}>
          Absorbent products such as incontinence underwear or pads may provide additional options
          for managing urinary issues for some women.
        </Text>

        <Text style={styles.subsectionTitle}>Pelvic floor muscle exercises</Text>
        <Text style={styles.paragraph}>
          Pelvic floor muscle training under the supervision of a specialist physiotherapist can be an
          effective non-surgical option and should be carried out before surgery. Many women who
          have undergone pelvic floor physiotherapy will not require surgery.
        </Text>

        <Text style={styles.subsectionTitle}>Continence pessaries and garments</Text>
        <Text style={styles.paragraph}>
          These are devices placed inside the vagina to support the bladder neck and can be effective
          for managing stress urinary incontinence. Some engineered garments pull the pelvic floor
          upwards and can help compress the bladder neck and reduce stress incontinence.
        </Text>

        <Text style={styles.subsectionTitle}>Duloxetine (medication)</Text>
        <Text style={styles.paragraph}>
          This is a medication which may improve stress urinary incontinence symptoms. Some side
          effects of the medication are not tolerated by women. It is recommended as a third line
          option, if you do not want or cannot have surgery.
        </Text>

        <Text style={styles.subsectionTitle}>Do nothing</Text>
        <Text style={styles.paragraph}>
          No treatment is always an option.
        </Text>

        <Text style={styles.paragraph}>
          If non-surgical treatment options have not been successful or are not appropriate/suitable,
          surgical options can be considered.
        </Text>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 3: Surgical Options ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>What types of surgery are available?</Text>

        <Text style={styles.subsectionTitle}>Midurethral sling operations</Text>
        <Text style={styles.paragraph}>
          A vaginal operation to stabilise the urethra (waterpipe) using a strip of mesh, sometimes
          called a tape. This mesh is made of synthetic suture material and stays in your body
          permanently.
        </Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              The retropubic tape operation (TVT) involves making a small incision in your vagina
              and two small incisions in your lower abdomen just above your pubic bone.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              The transobturator tape operation (TVT-O) involves making a small incision in your
              vagina and two small incisions on your inner thigh on both sides.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Rarely, a sling/tape procedure may be made more complicated because of previous
              pelvic surgery or radiotherapy to the pelvis.
            </Text>
          </View>
        </View>
        <Text style={styles.paragraph}>
          Mesh is a graft material that is woven using medical grade polymer called polypropylene
          which has been widely used as a suture material in all areas of surgery for more than 50
          years and which has an excellent safety profile. This kind of mesh is commonly used for
          abdominal and groin hernia repairs.
        </Text>

        <Text style={styles.subsectionTitle}>Fascial (natural tissue) sling procedure</Text>
        <Text style={styles.paragraph}>
          Abdominal procedure (open) to lift the urethra (waterpipe) using a strip of connective
          tissue harvested from your own abdominal wall or from the outside of your thigh. A bikini
          line incision is required to harvest this tissue. A small incision is made in your vagina.
          The strip of tissue is used to lift the urethra (waterpipe) and is attached to your abdomen
          using synthetic stitches. Both permanent and non-permanent sutures can be used.
        </Text>

        <Text style={styles.subsectionTitle}>Colposuspension procedure</Text>
        <Text style={styles.paragraph}>
          Abdominal operation (open or key-hole) where synthetic stitches are placed on either side
          of the urethra (waterpipe). Both long-lasting absorbable and permanent sutures can be used.
        </Text>

        <Text style={styles.subsectionTitle}>Urethral bulking agents</Text>
        <Text style={styles.paragraph}>
          Vaginal operation where a synthetic 'bulking' material is injected at the bladder neck to
          improve the seal of the bladder so it is harder for urine to leak out. This is carried out
          through a camera called a cystoscope which is passed into the urethra (waterpipe) and
          allows injections to be made.
        </Text>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 4: How do the different types of surgery compare ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>How do the different types of surgery compare</Text>
        <Text style={styles.paragraph}>
          Each surgery has different short and long term success rates and as with every surgery can
          be associated with potential complications. The surgical options available to you will be
          affected by previous surgeries you have had, your weight and your medical history.
        </Text>
        <Text style={styles.paragraph}>
          Below you will find tables comparing each procedure. At the end of this leaflet you can
          write down if you have any questions or what your impression of each procedure is. If you
          have other questions about a procedure please ask your surgeon so that you can make an
          informed choice.
        </Text>

        {/* Comparison Table: How procedure is performed */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <View style={{ width: '16%' }}>
              <Text style={styles.compTableHeader}> </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableHeader}>Retropubic midurethral sling</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableHeader}>Fascial sling</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableHeader}>Colposuspension</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableHeaderLast}>Urethral bulking agents</Text>
            </View>
          </View>

          {/* How is this procedure performed */}
          <View style={styles.tableRow}>
            <View style={{ width: '16%' }}>
              <Text style={styles.compTableRowLabel}>How is this procedure performed</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                A small cut is made in the vagina below your urethra (waterpipe) and in your
                lower abdomen or inner thigh
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                This is an open surgery where a bikini line incision (cut) is made and a small cut
                is made inside your vagina.
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                This can be done as: an open surgery where a bikini line incision (cut) is made, or
                keyhole (laparoscopic) surgery - small incisions in your lower abdomen
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCellLast}>
                This is carried out using a cystoscope (small camera passed into the urethra)
              </Text>
            </View>
          </View>

          {/* Anaesthesia */}
          <View style={styles.tableRow}>
            <View style={{ width: '16%' }}>
              <Text style={styles.compTableRowLabel}>Anaesthesia</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                General, spinal or local anaesthetic with sedation
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                General or spinal anaesthetic
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                General or spinal anaesthetic
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCellLast}>
                General, spinal or local anaesthetic with sedation
              </Text>
            </View>
          </View>

          {/* Hospital stay */}
          <View style={styles.tableRow}>
            <View style={{ width: '16%' }}>
              <Text style={styles.compTableRowLabel}>Day case or hospital stay</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                Day case or overnight stay
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                1-3 days in hospital
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                1-2 days in hospital
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCellLast}>
                Day case or outpatient
              </Text>
            </View>
          </View>

          {/* Recovery */}
          <View style={styles.tableRow}>
            <View style={{ width: '16%' }}>
              <Text style={styles.compTableRowLabel}>Recovery</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>2 weeks</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>6 weeks</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>2-6 weeks</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCellLast}>1-2 days</Text>
            </View>
          </View>
        </View>

        {/* Success Rates Table */}
        <Text style={styles.subsectionTitle}>Success rates</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ width: '16%' }}>
              <Text style={styles.compTableHeader}> </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableHeader}>Retropubic midurethral sling</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableHeader}>Fascial sling</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableHeader}>Colposuspension</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableHeaderLast}>Urethral bulking agents</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{ width: '16%' }}>
              <Text style={styles.compTableRowLabel}>Short-term</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                80-90% of patients feel their incontinence is either cured or much better
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                80-90% of patients feel their incontinence is either cured or much better
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                80% of patients feel their incontinence is either cured or much better after one year
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCellLast}>
                60-70% of patients feel their incontinence is either cured or much better. The effect
                reduces over time and more than one third of patients require a second injection
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{ width: '16%' }}>
              <Text style={styles.compTableRowLabel}>Long-term (20 years)</Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                80-90% satisfaction is maintained
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                70-80% are satisfied with their outcome
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCell}>
                60-70% are satisfied with their outcome
              </Text>
            </View>
            <View style={{ width: '21%' }}>
              <Text style={styles.compTableCellLast}> </Text>
            </View>
          </View>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 5: Understanding Risk + General Complications ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Are there any risks?</Text>
        <Text style={styles.paragraph}>
          The table below is designed to aid you in understanding the risks associated with surgical
          procedures. Risk can be explained using both words or numbers, or both. The table below
          has been recommended as a way of describing risk in healthcare. Further explanation on
          risks in healthcare is outlined by the Royal College of Obstetricians and Gynaecologists
          "Understanding how risk is discussed in healthcare".
        </Text>
        <Text style={styles.link}>
          https://www.rcog.org.uk/for-the-public/browse-all-patient-informationleaflets/understanding-how-risk-is-discussed-in-health-care-patient-information-leaflet/
        </Text>

        <Text style={styles.subsectionTitle}>Your individual risk</Text>
        <Text style={styles.paragraph}>
          Certain factors can increase your risk profile. Such factors include:
        </Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Medical conditions such as diabetes</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Smoking</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Taking blood thinning medication</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Being overweight</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              If you have had previous surgery for prolapse or incontinence
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Previous radiotherapy</Text>
          </View>
        </View>
        <Text style={styles.paragraph}>
          Please discuss your own individual risk with your surgeon.
        </Text>

        <Text style={styles.subsectionTitle}>
          General complications of pelvic surgery
        </Text>
        <Text style={styles.paragraph}>All surgical procedures carry risks.</Text>
        <Text style={styles.paragraph}>General complications of pelvic surgery include:</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Injury to internal organs: rare risk of damage to internal organs requiring further
              surgery - bladder, ureters (kidney tubes), urethra (waterpipe), bowel and blood vessels
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Bleeding - major bleeding during or after the surgery is uncommon but may require a
              blood transfusion in some cases ({'<'}1/100). Occasionally a haematoma/collection of blood
              may occur which may require further surgery or time to resolve
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Blood clot: a clot in the deep veins of the leg can occur after surgery in 4-5% of women
              however the majority go unnoticed and resolve spontaneously. Rarely ({'<'}1/100) a clot can
              pass from the leg to the lungs which is very serious. It is very rare for this to cause
              death but compression stockings and blood thinning injections are provided after major
              surgery or to high risk women to prevent this
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Infection is common with any surgery and antibiotics will be given during the surgery to
              reduce this risk. Wound infections are uncommon but urinary tract infections are common
              after surgery
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              There are also rare individual risks with a general or spinal anaesthetic which are
              outlined pre-operatively by the anaesthetist
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Death - very rare.</Text>
          </View>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 6: Retropubic/Transobturator sling risks ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Procedure specific risks</Text>

        <Text style={styles.subsectionTitle}>
          Retropubic and transobturator midurethral sling
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ width: '30%' }}>
              <Text style={styles.riskTableHeader}>Complication</Text>
            </View>
            <View style={{ width: '70%' }}>
              <Text style={styles.riskTableHeader}>Risk</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Mesh exposure in the vagina</Text>
            <Text style={styles.riskTableDesc}>
              Common (1-2/100) risk of mesh becoming infected or rejected resulting in exposure into
              the vagina. This can happen many years after surgery and can cause bleeding or
              pain/irritation for you or your partner with sex. This may resolve with local oestrogen
              therapy or may require partial excision of the mesh
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Mesh exposure into the bladder or urethra (waterpipe)
            </Text>
            <Text style={styles.riskTableDesc}>
              Rare ({'<'}1/100). Can occur soon or years after surgery. This can happen if the bladder or
              urethra are damaged during the surgery and this is not recognised or if the tape migrates
              years after the surgery. This requires surgery to remove the tape.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Bladder or urethral injury</Text>
            <Text style={styles.riskTableDesc}>
              Common (5-10/100). When discovered during the procedure, the trocar/tape is removed and
              replaced correctly. The bladder is usually drained with a tube for 24 hours to allow the
              hole in the bladder to heal. No long term issues have been found following this
              complication. Damage to the urethra (waterpipe) is uncommon ({'<'}1/100) but may have long
              term consequences
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Needing to pass urine more frequently than usual or not reaching the toilet on time
            </Text>
            <Text style={styles.riskTableDesc}>
              New onset urinary frequency and/or associated leakage with urgency is common
              (5-10/100). This can be treated with bladder retraining and physiotherapy, and some women
              need medication. If you have pre-existing overactive bladder your urgency and/or
              associated leakage with urgency may improve or worsen after surgery. Stress incontinence
              surgery does not cure urgency symptoms or treat bladder pain.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Temporary difficulty passing urine (voiding dysfunction)
            </Text>
            <Text style={styles.riskTableDesc}>
              Common (4/100). Women can have problems emptying the bladder fully which is usually
              resolved in 7-14 days. It may require a short term tube in the bladder (catheter) for a
              few days. If this persists reoperation may be required to loosen or divide the mesh. Long
              term voiding dysfunction requiring self-catheterisation for months/years is rare. Long-term
              voiding dysfunction may be associated with recurrent urinary tract infections.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Temporary vaginal/pelvic pain or pain with sex
            </Text>
            <Text style={styles.riskTableDesc}>
              Uncommon (1/100). Women can develop pain and this usually resolves spontaneously with
              pain relief after 1-2 weeks. Pain rarely persists.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Long-term vaginal/pelvic pain or pain with sex
            </Text>
            <Text style={styles.riskTableDesc}>
              Uncommon with retropubic midurethral sling. *Common (5-10/100) with a transobturator
              tape and can affect the groin and/or inner thigh. This may be as a result of nerve
              irritation or muscle spasm. Physiotherapy in the form of "trigger point release" may be
              helpful and referral to a pain specialist may be required. Full or partial removal of the
              sling may be needed.
            </Text>
          </View>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 7: Mesh Removal Risks + Fascial Sling Risks ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Risks of removing the mesh tape</Text>
        <Text style={styles.paragraph}>
          It may not be possible to safely and completely remove the mesh implant as it is meant to
          incorporate permanently into your tissues. Complete mesh removal may be associated with
          higher risks of nerve and organ damage and poor outcomes in terms of pain and continence.
          Complete removal of the transobturator mesh tape may not be possible.
        </Text>
        <Text style={styles.paragraph}>
          Referral to a mesh centre (with a multidisciplinary surgical team experienced in mesh
          removal) may be required. Complete removal of the mesh tape may not alleviate all symptoms
          and some symptoms may worsen.
        </Text>
        <Text style={styles.paragraph}>
          Partial and complete removal of mesh tape may cause your stress urinary incontinence to
          return and you may need to consider another surgery for incontinence.
        </Text>

        <Text style={styles.subsectionTitle}>Fascial sling</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ width: '30%' }}>
              <Text style={styles.riskTableHeader}>Complication</Text>
            </View>
            <View style={{ width: '70%' }}>
              <Text style={styles.riskTableHeader}>Risk</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Fascial exposure in the vagina</Text>
            <Text style={styles.riskTableDesc}>
              Uncommon ({'<'}1/100). Risk of fascia becoming infected or rejected resulting in exposure
              into the vagina. This can cause bleeding or pain/irritation with sex. This may require
              partial excision of the sling.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Bladder or urethral injury</Text>
            <Text style={styles.riskTableDesc}>
              Common (5-10/100). When discovered during the procedure, the trocar/tape is removed
              and replaced correctly. The bladder is usually drained with a tube for 24 hours. Damage
              to the urethra (waterpipe) is uncommon ({'<'}1/100) but may have long term consequences
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Needing to pass urine more frequently than usual or not reaching the toilet on time
            </Text>
            <Text style={styles.riskTableDesc}>
              New onset urinary frequency and/or associated leakage with urgency is very common
              (10/100). This can be treated with bladder retraining, physiotherapy and some women need
              medication. If you have pre-existing overactive bladder your urgency and/or associated
              leakage with urgency may improve or worsen after surgery.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Temporary difficulty passing urine (voiding dysfunction)
            </Text>
            <Text style={styles.riskTableDesc}>
              Very common (10/100). Women can have problems emptying the bladder fully which is
              usually resolved in 6-8 weeks. It may require a short term tube in the bladder (catheter)
              for a few days or weeks. If this persists you may need to learn to self-catheterise or
              reoperation may be required. This is a common (5-10/100) long term risk.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Vaginal/pelvic pain or pain with sex</Text>
            <Text style={styles.riskTableDesc}>
              Common (1/100). Women can develop pain and this usually resolves spontaneously with
              pain relief after 1-2 weeks. Pain rarely persists and further treatment with
              physiotherapy, pain management or full or partial removal of the sling may be needed.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Wound complications</Text>
            <Text style={styles.riskTableDesc}>
              Common (2/100). The abdominal wound can become infected or can open up if the stitches
              become loose. A collection of blood or fluid may form below the incision. This may need
              antibiotics and/or drainage. Common (2/100) women can develop pins and needles or
              numbness around the scar.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Hernia</Text>
            <Text style={styles.riskTableDesc}>
              Common (up to 10/100). This can happen at the scar at your bikini line and may require
              further surgery to repair.
            </Text>
          </View>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 8: Colposuspension + Urethral bulking risks ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.subsectionTitle}>Colposuspension</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ width: '30%' }}>
              <Text style={styles.riskTableHeader}>Complication</Text>
            </View>
            <View style={{ width: '70%' }}>
              <Text style={styles.riskTableHeader}>Risk</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Bladder or urethral injury</Text>
            <Text style={styles.riskTableDesc}>
              Uncommon ({'<'}1/100). Rarely the stitches placed may erode into the bladder and require
              removal. Damage to the urethra (waterpipe) is uncommon ({'<'}1/100) but may have long
              term consequences
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Needing to pass urine more frequently than usual or not reaching the toilet on time
            </Text>
            <Text style={styles.riskTableDesc}>
              New onset urinary frequency and/or associated leakage with urgency is very common
              (15-20/100). This can be treated with bladder retraining, physiotherapy and some women
              need medication. If you have pre-existing overactive bladder your urgency and/or
              associated leakage with urgency may improve or worsen after surgery.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Temporary difficulty passing urine (voiding dysfunction)
            </Text>
            <Text style={styles.riskTableDesc}>
              Very common (10/100). Women can have problems emptying the bladder fully which is
              usually resolved in 6-8 weeks. It may require a short term tube in the bladder
              (catheter). If this persists you may need to learn to self-catheterise. Long-term voiding
              dysfunction may be associated with recurrent urinary tract infections.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Vaginal/pelvic pain or pain with sex</Text>
            <Text style={styles.riskTableDesc}>
              Common (1-5/100). Women can develop pain and this usually resolves spontaneously with
              pain relief after 1-2 weeks. Pain rarely persists and further treatment with
              physiotherapy, pain management or releasing the stitches may be needed.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Wound complications</Text>
            <Text style={styles.riskTableDesc}>
              Common. The abdominal wound can become infected or can open up if the stitches become
              loose. This may need antibiotics and pain relief.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Prolapse of the back vaginal wall (rectocele)
            </Text>
            <Text style={styles.riskTableDesc}>
              Very common (15/100). This may present with a bulge or the sensation of something
              coming down and surgery to repair this may be required.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Problems with stitches placed</Text>
            <Text style={styles.riskTableDesc}>
              Rare. If the stitches that are used are permanent they can erode through to the bladder
              or the vaginal wall.
            </Text>
          </View>
        </View>

        <Text style={styles.subsectionTitle}>Urethral bulking agents</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ width: '30%' }}>
              <Text style={styles.riskTableHeader}>Complication</Text>
            </View>
            <View style={{ width: '70%' }}>
              <Text style={styles.riskTableHeader}>Risk</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Temporary difficulty passing urine (voiding dysfunction)
            </Text>
            <Text style={styles.riskTableDesc}>
              Common ({'<'}10/100). Women can have problems emptying the bladder and may require a
              short term tube in the bladder (catheter) for one or two days. It is rarely more
              prolonged than this. Long term voiding dysfunction is very rare.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Pain passing urine</Text>
            <Text style={styles.riskTableDesc}>
              Common (1/100). Pain or stinging passing urine can occur in the first 24-48 hours. If
              you develop symptoms of a urinary tract infection you will need antibiotics.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Allergy/hypersensitivity to the bulking material
            </Text>
            <Text style={styles.riskTableDesc}>
              Uncommon ({'<'}1/100). Rare occurrence but may require treatment for hypersensitivity
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>
              Abscess (local infection) or granuloma (cyst like structure)
            </Text>
            <Text style={styles.riskTableDesc}>
              Uncommon ({'<'}1/100). Rare but may need treatment with antibiotics or excision of the
              granuloma.
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.riskTableComplication}>Need for repeat bulking injection</Text>
            <Text style={styles.riskTableDesc}>
              A "top-up" can be required to successfully treat symptoms of stress urinary
              incontinence. The effect of the bulking material may sometimes reduce with time
              requiring a second injection.
            </Text>
          </View>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 9: Pre/Post Surgery + Pregnancy + Questions ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>What preparation is advised before surgery</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Stopping smoking several weeks before surgery reduces your chances of complications
              such as infection, blood clots and poor healing and improves your overall health.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              You may need to stop taking blood thinning medication such as Aspirin, Plavix
              (clopidogrel), warfarin (coumadin) or Xarelto (rivaroxaban) - please inform the
              consulting doctor if you are taking any of these.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Try to maintain a healthy weight.</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Optimise your blood sugars if you are diabetic.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Avoid constipation.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>What to expect after surgery</Text>
        <Text style={styles.paragraph}>
          Depending on the surgery you have you may or may not be kept in hospital. Your recovery
          after the surgery will be monitored and it is usual to be allowed to eat and drink. Ward
          staff will monitor the amount of urine you pass and scan your bladder after voiding to
          ensure you are emptying your bladder.
        </Text>

        <Text style={styles.subsectionTitle}>The first few days/weeks</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              There might be some vaginal bleeding and if you need to wear protection use a sanitary
              pad, not a tampon.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              You can drive as soon as you can push the pedals and look over your shoulder without
              discomfort - usually after two or three weeks. You need to check this with your
              insurance company.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              There is no restriction on undertaking light activities in the first few days if you feel
              comfortable to do so. After six weeks gradually build up your level of activity. More
              strenuous tasks and heavy lifting should be avoided for six weeks. After 3 months you
              can return to your usual level of activity.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              You should refrain from sexual intercourse and inserting any creams or devices into the
              vagina for 6 weeks following your procedure, unless recommended by your doctor.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              It is important that you avoid constipation by ensuring you drink plenty of fluid and
              eat fruit, vegetables and roughage (e.g. bran/oats) high in fibre. Laxatives may be
              required to make your bowels work better.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Return to work will depend on the type of work you do. Please ask your doctor for
              his/her opinion and if you require a "Fitness for work" certificate.
            </Text>
          </View>
        </View>

        <Text style={styles.subsectionTitle}>Pregnancy and childbirth</Text>
        <Text style={styles.paragraph}>
          It is highly advisable that you wait until your family is complete before considering any
          surgery for stress urinary incontinence. Carrying a pregnancy and having a vaginal delivery
          may increase the risk of failure of your incontinence procedure. If you do become pregnant
          a caesarean section may be recommended for your delivery in order to reduce this risk.
        </Text>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 10: Questions + Expectations ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>
          Questions and Expectations
        </Text>
        <Text style={styles.paragraph}>
          Please write down any questions you have below and bring this booklet with you to your
          next appointment with your clinician.
        </Text>
        <Text style={styles.paragraph}>
          Things I would like to know before my operation. Please list below any questions you may
          have, having read this leaflet:
        </Text>
        <View style={styles.numberedItem}>
          <Text style={styles.numberedBullet}>1.</Text>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#ccc', borderBottomStyle: 'solid', height: 20 }} />
        </View>
        <View style={styles.numberedItem}>
          <Text style={styles.numberedBullet}>2.</Text>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#ccc', borderBottomStyle: 'solid', height: 20 }} />
        </View>
        <View style={styles.numberedItem}>
          <Text style={styles.numberedBullet}>3.</Text>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#ccc', borderBottomStyle: 'solid', height: 20 }} />
        </View>

        <Text style={{ ...styles.subsectionTitle, marginTop: 16 }}>
          Please document your expectations of this treatment
        </Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderStyle: 'solid', padding: 8, minHeight: 80, marginBottom: 8 }}>
          <Text style={styles.paragraph}>{consent.tvt_hopes || ' '}</Text>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 11: Patient Request for TVT (11 confirmation points) ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Patient Request for TVT Insertion</Text>
        <Text style={styles.subtitle}>
          Patient request for retropubic mesh tape (TVT) for the treatment of
          debilitating stress urinary incontinence
        </Text>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Important: This procedure has been put on pause by HSE Ireland since 2018
            and is only currently permitted in exceptional circumstances.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          I wish to proceed to the insertion of a TVT retropubic mesh sling to try to help
          my ongoing stress incontinence symptoms. I can confirm that:
        </Text>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('debilitating') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            1. I have daily debilitating stress urinary incontinence affecting my physical
            and mental wellbeing.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('pause_exceptional') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            2. I am aware that this procedure has been put on pause by HSE Ireland since 2018
            and is only currently permitted in exceptional circumstances.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('lifestyle') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>3. I have received lifestyle advice.</Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('pfmt') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            4. I have undertaken supervised pelvic floor muscle training.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.a9?.includes('1') || consent.a9?.includes('2') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            5. I do not wish to receive any further non-surgical treatments such as
            physiotherapy, pessary, or vaginal devices as I have considered these
            and/or not found them to be beneficial.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('read_all_options') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            6. I have carefully read and considered all the surgical options available
            to treat this condition.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('nice_pda') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            7. I have received the Patient Decision Aids introduced by NICE for the
            management of women with Stress urinary incontinence.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_bulking_considered ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            8. I have considered/had a Urethral Bulking agent and do not wish to have this
            performed/repeated. I understand Urethral Bulking agent would be a minor
            outpatient procedure.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('decline_colpo_fascial') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            9. I decline to have either a laparoscopic/open colposuspension or an autologous
            fascial sling. I personally do not accept the risk profile of these procedures.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('mesh_risk_acceptable') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            10. I believe that the risk profile of a retropubic mesh tape is more acceptable
            to me in my own circumstances.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('type1_polypropylene') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            11. I understand that the mesh used for a TVT is a type 1 Polypropylene mesh and
            is permanent and is not intended for removal.
          </Text>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 12: Risk Acknowledgement + MDT ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>
          Risk Acknowledgement
        </Text>
        <Text style={styles.paragraph}>
          I have received patient Information leaflets (PIL) for the TVT and am aware of
          the following risks:
        </Text>

        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Cure/improvement rates: 80-90% (a 10-20% failure rate)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Recurrence of incontinence symptoms: 20-30% over the next 10-20 years
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Infection: less than 5%</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Bleeding: may require further surgery and potential blood transfusion (less than 5%)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Blood clots in legs (DVT) and lungs (PE): less than 1%
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Injury to nerves, bladder, bowel, and blood vessels: less than 5%
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Chronic pain: less than 5%</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              New onset or worsening of overactive bladder symptoms (frequency, urgency,
              urge leakage): up to 7%
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>Difficulty emptying bladder: 5%</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Need for self-catheterisation short and long term: less than 5%
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Exposure of mesh through vaginal wall: up to 5%
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Need for mesh removal due to complications: up to 3%. Complete removal may not be
              possible and may not resolve mesh-related symptoms.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              Sexual dysfunction: up to 15%, which may include pain during intercourse
            </Text>
          </View>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_risks_acknowledged ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            I am fully aware of the success rates and complications of these procedures,
            and I have had time to understand these. I have carefully read the section on
            mesh complications and accept these complications.
          </Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_adverse_publicity_aware ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            I am aware of the adverse publicity associated with the use of synthetic
            vaginal mesh and the concerns raised by campaign groups.
          </Text>
        </View>

        {/* MDT Requirement */}
        <Text style={styles.sectionTitle}>MDT Approval Requirement</Text>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_patient_confirmations?.includes('mdt_required') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            I am aware that it is necessary for my case to be approved by the local
            Urogynaecology Multidisciplinary team meeting (MDT). This will comply with
            my ability, as the patient, to exercise my right to informed patient choice.
          </Text>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 13: Irish National Mesh Register ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Irish National Mesh Register</Text>
        <Text style={styles.paragraph}>
          I have read the Irish National Mesh Register patient information leaflet and/or had it
          explained to me. I understand the reasons for the Irish National Mesh Register, that it
          aims to record all mesh implants and improve care delivered to patients in Irish hospitals.
        </Text>

        <Text style={styles.subsectionTitle}>Consent to the Irish National Mesh Register</Text>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_mesh_register ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            I CONSENT to my details being recorded on the Irish National Mesh Register.
            I understand that I may withdraw this consent at any time in the future.
          </Text>
        </View>

        {/* Mesh Device Information */}
        <Text style={styles.sectionTitle}>Mesh Device Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Device Name:</Text>
          <Text style={styles.value}>{consent.tvt_device_name || ' '}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Manufacturer:</Text>
          <Text style={styles.value}>{consent.tvt_device_manufacturer || ' '}</Text>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 14: Consent Form Sections A-F ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Consent Form</Text>
        <Text style={styles.paragraph}>
          This consent must be completed by the doctor with their patient in advance of surgery.
          All sections must be signed.
        </Text>

        <Text style={styles.subsectionTitle}>
          Section A: Non-surgical Management Discussion
        </Text>
        <Text style={styles.paragraph}>
          My clinician has discussed with me the benefits of non-surgical management of
          stress urinary incontinence including lifestyle interventions, physiotherapy
          and behavioural therapies.
        </Text>
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Patient Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Doctor's Signature</Text>
          </View>
        </View>

        <Text style={styles.subsectionTitle}>Section B: Physiotherapy Attendance</Text>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_physio_attended ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            I have attended a physiotherapist who has explained to me non-surgical options
            for stress urinary incontinence. My wish is to proceed with surgical intervention.
          </Text>
        </View>

        <Text style={styles.subsectionTitle}>Section C: Urodynamics Attendance</Text>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_urodynamics_attended ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            I have attended a urodynamics clinic. My wish is to proceed with surgical intervention.
          </Text>
        </View>

        <Text style={styles.subsectionTitle}>
          Section D: Patient Expectations/Hopes
        </Text>
        <Text style={styles.paragraph}>
          What are you hoping the operation will do? Please describe the symptoms you
          think this surgery will cure - please list all:
        </Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderStyle: 'solid', padding: 8, minHeight: 60, marginBottom: 8 }}>
          <Text style={styles.paragraph}>{consent.tvt_hopes || ' '}</Text>
        </View>

        <Text style={styles.subsectionTitle}>Section E: Information Leaflet Confirmation</Text>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_information_checklist?.includes('procedure_outcome') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            I confirm I have been given an information leaflet to read at home prior to my surgery
            date. I understand the risks that have been explained and I still wish to proceed with
            surgery.
          </Text>
        </View>

        <Text style={styles.subsectionTitle}>Section F: Information Checklist</Text>
        <Text style={styles.paragraph}>
          I confirm I have had adequate time to study the information provided. I am satisfied with
          the explanation of the procedure and the associated risks and benefits that have been
          discussed with me. I have no further questions.
        </Text>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_information_checklist?.includes('procedure_outcome') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            The details of the procedure proposed and the desired outcome
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_information_checklist?.includes('alternatives') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            All available alternatives and their advantages and disadvantages
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_information_checklist?.includes('risks_individual') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            All information on possible risks including my individual risk
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.tvt_information_checklist?.includes('questions_answered') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>All my questions were answered</Text>
        </View>
        <PageNumber />
      </Page>

      {/* ==================== PAGE 15: Declarations + Signatures ==================== */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Statement of Health Professional</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              I am suitably trained and competent and have sufficient knowledge to consent
              this patient in line with the requirements of my regulatory body.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              I have discussed what the treatment is likely to involve, the benefits and
              risks of this procedure.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              I have also discussed the benefits and risks of any available alternative
              procedures or treatments including no treatment.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.bulletText}>
              I have discussed any particular concerns of this patient.
            </Text>
          </View>
        </View>

        <View style={styles.contentBox}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{consent.a17 || ' '}</Text>
          </View>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Job Title:</Text>
            <Text style={styles.value}>{consent.a18 || ' '}</Text>
          </View>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Signature:</Text>
            <Text style={styles.value}>{consent.a15 || ' '}</Text>
          </View>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{consent.a16 ? moment(consent.a16).format('DD/MM/YYYY') : ' '}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Patient Declaration</Text>
        <Text style={styles.paragraph}>
          My health professional has presented all the evidence and data on stress urinary
          incontinence surgery. Having read the available literature (PIL) and this form,
          I confirm that I understand the risks and, on the basis of my own wishes, want
          to proceed with the TVT.
        </Text>

        <Text style={styles.boldParagraph}>
          I have the right to change my mind at any time, including after I have signed this form.
        </Text>

        <View style={styles.checkItem}>
          <Text style={styles.checkbox}>
            {consent.a25?.includes('1') ? 'x' : 'o'}
          </Text>
          <Text style={styles.checkText}>
            I confirm that there is no risk that I could be pregnant.
          </Text>
        </View>

        <View style={styles.contentBox}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>{consent.a23 || (consent.a1 + ' ' + consent.a2) || ' '}</Text>
          </View>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {consent.a24 ? moment(consent.a24).format('DD/MM/YYYY') : ' '}
            </Text>
          </View>
        </View>

        <Text style={styles.subsectionTitle}>Patient Signature</Text>
        {consent.signature ? (
          <Image style={styles.signature} src={consent.signature} />
        ) : (
          <View style={[styles.signatureLine, { width: 200 }]} />
        )}

        {/* MDT Approval Section */}
        <Text style={styles.sectionTitle}>MDT Approval (For Clinical Use)</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Approved to pass to MDT:</Text>
          <Text style={styles.value}> </Text>
        </View>
        <View style={styles.contentBox}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Consultant Name:</Text>
            <Text style={styles.value}> </Text>
          </View>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Signature:</Text>
            <Text style={styles.value}> </Text>
          </View>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}> </Text>
          </View>
        </View>

        {/* Resources */}
        <Text style={styles.sectionTitle}>Additional Resources</Text>
        <Text style={styles.link}>
          BSUG Patient Information: https://bsug.org.uk/pages/for-patients/bsug-patient-information-leaflets/154
        </Text>
        <Text style={styles.link}>
          RCOG Mid-urethral Sling Information: https://www.rcog.org.uk/en/patients/patient-leaflets/mid-urethal-sling-operation-for-stress-urinary-incontinence/
        </Text>
        <PageNumber />
      </Page>
    </Document>
  );

  const [pdf, updatePDF] = usePDF({ document });

  useEffect(() => {
    visible && updatePDF();
  }, [visible]);

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
        width={900}
        open={visible}
        onCancel={() => setVisible(false)}
      >
        <Tabs
          defaultActiveKey="consent"
          items={[
            {
              key: 'consent',
              label: 'TVT Consent PDF',
              children: (
                <PDFViewer
                  style={{
                    width: '100%',
                    height: '600px',
                  }}
                >
                  {document}
                </PDFViewer>
              ),
            },
            {
              key: 'leaflet1',
              label: 'SUI Mesh Tapes Leaflet',
              children: (
                <iframe
                  title="SUI Mesh Tapes Leaflet"
                  src={tvtMeshTapesLeafletPdf}
                  style={{ width: '100%', height: '600px', border: 'none' }}
                />
              ),
            },
            {
              key: 'leaflet2',
              label: 'Patient Request Form',
              children: (
                <iframe
                  title="Patient Request for TVT"
                  src={tvtPatientRequestPdf}
                  style={{ width: '100%', height: '600px', border: 'none' }}
                />
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default memo(TvtConsentPdf);
