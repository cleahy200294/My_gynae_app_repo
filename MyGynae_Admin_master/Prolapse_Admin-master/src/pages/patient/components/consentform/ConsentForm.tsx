import { CloseCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import styles from './style.less';
import qr1 from '@/assets/qr1.jpg';
import qr2 from '@/assets/qr2.jpg';
import qr3 from '@/assets/qr3.jpg';
import qr4 from '@/assets/qr4.jpg';
import qr5 from '@/assets/qr5.jpg';
import moment from 'moment';

interface Iprops {
  surgical: number;
  patientInfo: any;
  onSave: (data: any) => void;
  consentData: any;
}

const ConsentForm: FC<Iprops> = (props) => {
  const { surgical, patientInfo, onSave, consentData } = props;
  const [signature, setSignature] = useState('');
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  const surgical_name = ((): string => {
    let name = '';
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
  })();

  const name =  surgical_name;
  const isTVT = surgical_name === 'TVT';

  const canvasRef = useRef() as any;

  useEffect(() => {
    if (consentData) {
      const values = { ...consentData };
      if (values.a11) values.a11 = moment(values.a11);
      if (values.a16) values.a16 = moment(values.a16);
      if (values.a24) values.a24 = moment(values.a24);
      form.setFieldsValue(values);
      setSignature(consentData.signature);
      if (consentData.signature) {
        canvasRef.current.fromDataURL(consentData.signature, { ratio: 1 });
      }
    }
  }, [consentData]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{name}</Button>
      <div className={`${styles.container} ${open ? styles.open : ''}`}>
        <CloseCircleOutlined
          className={styles.close}
          onClick={() => setOpen(false)}
        />
        <Form
          form={form}
          className={`${styles.form} consentform`}
          onFinish={async (values) => {
            if (!signature) {
              message.warn('Please signature');
              return;
            }
            setOpen(false);
            onSave({ ...values, signature });
          }}
        >
          {isTVT ? (
            <>
              {/* ==================== SECTION 1: Title + Patient Details (PDF Page 1) ==================== */}
              <h1>Surgical options for Stress Urinary Incontinence</h1>
              <p>
                You are asked to carefully read this information leaflet and consent form to enable you
                to better understand the procedures available to treat your present symptoms. Should you
                require clarification or additional information, please notify your doctor who will discuss
                any questions or concerns you may have. It is a requirement that a consent form be signed
                before carrying out any surgical procedure.
              </p>
              <p>
                This information leaflet talks about each type of surgery: how it is performed, the risks,
                the success rates and how the surgeries compare to each other. If you decide you would
                rather not proceed with surgery please notify your surgeon and other treatment options
                will be discussed with you.
              </p>

              <h2>Patient Details</h2>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <ConsentInput
                    form={form}
                    name="a1"
                    disabled
                    label="First name"
                    value={patientInfo.firstname}
                  />
                </Col>
                <Col span={12}>
                  <ConsentInput
                    form={form}
                    name="a2"
                    disabled
                    label="Last name"
                    value={patientInfo.surname}
                  />
                </Col>
                <Col span={12}>
                  <ConsentInput
                    form={form}
                    name="a3"
                    disabled
                    label="Date of birth"
                    value={patientInfo.birthday.format('DD/MM/yyyy')}
                  />
                </Col>
                <Col span={12}>
                  <ConsentInput form={form} name="a4" label="MRN/Identifier" />
                </Col>
                <Col span={24}>
                  <ConsentInput
                    form={form}
                    name="a5"
                    label="Consultant"
                  />
                </Col>
              </Row>

              {/* ==================== SECTION 2: What is SUI + Non-surgical Options (PDF Pages 2-3) ==================== */}
              <h2>What is stress urinary incontinence?</h2>
              <p>
                Stress urinary incontinence is the leakage of urine during activities such as coughing,
                sneezing, lifting, laughing or exercising. It affects up to 1 in 5 of women.
              </p>
              <p>
                Stress urinary incontinence has many causes including: pregnancy, childbirth, obesity,
                chronic cough, constipation, heavy lifting and genetically inherited factors.
              </p>

              <h2>Non-surgical treatment options</h2>
              <p>
                It is important to have tried conservative non-surgical options prior to considering surgery.
                These include:
              </p>

              <h3>Lifestyle changes</h3>
              <p>
                Weight loss is an effective treatment option for overweight women with stress urinary
                incontinence.
              </p>
              <p>Fluid reduction to 1-1.5 litres per day can improve symptoms.</p>
              <p>
                Absorbent products such as incontinence underwear or pads may provide additional options
                for managing urinary issues for some women.
              </p>

              <h3>Pelvic floor muscle exercises</h3>
              <p>
                Pelvic floor muscle training under the supervision of a specialist physiotherapist can be an
                effective non-surgical option and should be carried out before surgery. Many women who
                have undergone pelvic floor physiotherapy will not require surgery.
              </p>

              <h3>Continence pessaries and garments</h3>
              <p>
                These are devices placed inside the vagina to support the bladder neck and can be effective
                for managing stress urinary incontinence. Some engineered garments pull the pelvic floor
                upwards and can help compress the bladder neck and reduce stress incontinence.
              </p>

              <h3>Duloxetine (medication)</h3>
              <p>
                This is a medication which may improve stress urinary incontinence symptoms. Some side
                effects of the medication are not tolerated by women. It is recommended as a third line
                option, if you do not want or cannot have surgery.
              </p>

              <h3>Do nothing</h3>
              <p>No treatment is always an option.</p>
              <p>
                If non-surgical treatment options have not been successful or are not appropriate/suitable,
                surgical options can be considered.
              </p>

              {/* ==================== SECTION 3: Surgical Options (PDF Page 3) ==================== */}
              <h2>What types of surgery are available?</h2>

              <h3>Midurethral sling operations</h3>
              <p>
                A vaginal operation to stabilise the urethra (waterpipe) using a strip of mesh, sometimes
                called a tape. This mesh is made of synthetic suture material and stays in your body
                permanently.
              </p>
              <ul>
                <li>
                  The retropubic tape operation (TVT) involves making a small incision in your vagina
                  and two small incisions in your lower abdomen just above your pubic bone.
                </li>
                <li>
                  The transobturator tape operation (TVT-O) involves making a small incision in your
                  vagina and two small incisions on your inner thigh on both sides.
                </li>
                <li>
                  Rarely, a sling/tape procedure may be made more complicated because of previous
                  pelvic surgery or radiotherapy to the pelvis.
                </li>
              </ul>
              <p>
                Mesh is a graft material that is woven using medical grade polymer called polypropylene
                which has been widely used as a suture material in all areas of surgery for more than 50
                years and which has an excellent safety profile. This kind of mesh is commonly used for
                abdominal and groin hernia repairs.
              </p>

              <h3>Fascial (natural tissue) sling procedure</h3>
              <p>
                Abdominal procedure (open) to lift the urethra (waterpipe) using a strip of connective
                tissue harvested from your own abdominal wall or from the outside of your thigh. A bikini
                line incision is required to harvest this tissue. A small incision is made in your vagina.
                The strip of tissue is used to lift the urethra (waterpipe) and is attached to your abdomen
                using synthetic stitches. Both permanent and non-permanent sutures can be used.
              </p>

              <h3>Colposuspension procedure</h3>
              <p>
                Abdominal operation (open or key-hole) where synthetic stitches are placed on either side
                of the urethra (waterpipe). Both long-lasting absorbable and permanent sutures can be used.
              </p>

              <h3>Urethral bulking agents</h3>
              <p>
                Vaginal operation where a synthetic 'bulking' material is injected at the bladder neck to
                improve the seal of the bladder so it is harder for urine to leak out. This is carried out
                through a camera called a cystoscope which is passed into the urethra (waterpipe) and
                allows injections to be made.
              </p>

              {/* ==================== SECTION 4: Comparison Tables (PDF Page 4) ==================== */}
              <h2>How do the different types of surgery compare</h2>
              <p>
                Each surgery has different short and long term success rates and as with every surgery can
                be associated with potential complications. The surgical options available to you will be
                affected by previous surgeries you have had, your weight and your medical history.
              </p>
              <p>
                Below you will find tables comparing each procedure. At the end of this leaflet you can
                write down if you have any questions or what your impression of each procedure is. If you
                have other questions about a procedure please ask your surgeon so that you can make an
                informed choice.
              </p>

              <table>
                <tr>
                  <td></td>
                  <td className={styles.bold}>Retropubic midurethral sling</td>
                  <td className={styles.bold}>Fascial sling</td>
                  <td className={styles.bold}>Colposuspension</td>
                  <td className={styles.bold}>Urethral bulking agents</td>
                </tr>
                <tr>
                  <td>How is this procedure performed</td>
                  <td>A small cut is made in the vagina below your urethra (waterpipe) and in your lower abdomen or inner thigh</td>
                  <td>This is an open surgery where a bikini line incision (cut) is made and a small cut is made inside your vagina.</td>
                  <td>This can be done as: an open surgery where a bikini line incision (cut) is made, or keyhole (laparoscopic) surgery - small incisions in your lower abdomen</td>
                  <td>This is carried out using a cystoscope (small camera passed into the urethra)</td>
                </tr>
                <tr>
                  <td>Anaesthesia</td>
                  <td>General, spinal or local anaesthetic with sedation</td>
                  <td>General or spinal anaesthetic</td>
                  <td>General or spinal anaesthetic</td>
                  <td>General, spinal or local anaesthetic with sedation</td>
                </tr>
                <tr>
                  <td>Day case or hospital stay</td>
                  <td>Day case or overnight stay</td>
                  <td>1-3 days in hospital</td>
                  <td>1-2 days in hospital</td>
                  <td>Day case or outpatient</td>
                </tr>
                <tr>
                  <td>Recovery</td>
                  <td>2 weeks</td>
                  <td>6 weeks</td>
                  <td>2-6 weeks</td>
                  <td>1-2 days</td>
                </tr>
              </table>

              <h3>Success rates</h3>
              <table>
                <tr>
                  <td></td>
                  <td className={styles.bold}>Retropubic midurethral sling</td>
                  <td className={styles.bold}>Fascial sling</td>
                  <td className={styles.bold}>Colposuspension</td>
                  <td className={styles.bold}>Urethral bulking agents</td>
                </tr>
                <tr>
                  <td>Short-term</td>
                  <td>80-90% of patients feel their incontinence is either cured or much better</td>
                  <td>80-90% of patients feel their incontinence is either cured or much better</td>
                  <td>80% of patients feel their incontinence is either cured or much better after one year</td>
                  <td>60-70% of patients feel their incontinence is either cured or much better. The effect reduces over time and more than one third of patients require a second injection</td>
                </tr>
                <tr>
                  <td>Long-term (20 years)</td>
                  <td>80-90% satisfaction is maintained</td>
                  <td>70-80% are satisfied with their outcome</td>
                  <td>60-70% are satisfied with their outcome</td>
                  <td></td>
                </tr>
              </table>

              {/* ==================== SECTION 5: Risk Tables (PDF Pages 5-8) ==================== */}
              <h2>Are there any risks?</h2>
              <p>
                The table below is designed to aid you in understanding the risks associated with surgical
                procedures. Risk can be explained using both words or numbers, or both. The table below
                has been recommended as a way of describing risk in healthcare. Further explanation on
                risks in healthcare is outlined by the Royal College of Obstetricians and Gynaecologists
                "Understanding how risk is discussed in healthcare".
              </p>
              <a href="https://www.rcog.org.uk/for-the-public/browse-all-patient-informationleaflets/understanding-how-risk-is-discussed-in-health-care-patient-information-leaflet/">
                https://www.rcog.org.uk/for-the-public/browse-all-patient-informationleaflets/understanding-how-risk-is-discussed-in-health-care-patient-information-leaflet/
              </a>

              <h3>Your individual risk</h3>
              <p>Certain factors can increase your risk profile. Such factors include:</p>
              <ul>
                <li>Medical conditions such as diabetes</li>
                <li>Smoking</li>
                <li>Taking blood thinning medication</li>
                <li>Being overweight</li>
                <li>If you have had previous surgery for prolapse or incontinence</li>
                <li>Previous radiotherapy</li>
              </ul>
              <p>Please discuss your own individual risk with your surgeon.</p>

              <h3>General complications of pelvic surgery</h3>
              <p>All surgical procedures carry risks.</p>
              <p>General complications of pelvic surgery include:</p>
              <ul>
                <li>Injury to internal organs: rare risk of damage to internal organs requiring further surgery - bladder, ureters (kidney tubes), urethra (waterpipe), bowel and blood vessels</li>
                <li>{'Bleeding - major bleeding during or after the surgery is uncommon but may require a blood transfusion in some cases (<1/100). Occasionally a haematoma/collection of blood may occur which may require further surgery or time to resolve'}</li>
                <li>{'Blood clot: a clot in the deep veins of the leg can occur after surgery in 4-5% of women however the majority go unnoticed and resolve spontaneously. Rarely (<1/100) a clot can pass from the leg to the lungs which is very serious. It is very rare for this to cause death but compression stockings and blood thinning injections are provided after major surgery or to high risk women to prevent this'}</li>
                <li>Infection is common with any surgery and antibiotics will be given during the surgery to reduce this risk. Wound infections are uncommon but urinary tract infections are common after surgery</li>
                <li>There are also rare individual risks with a general or spinal anaesthetic which are outlined pre-operatively by the anaesthetist</li>
                <li>Death - very rare.</li>
              </ul>

              <h2>Procedure specific risks</h2>

              <h3>Retropubic and transobturator midurethral sling</h3>
              <table>
                <tr>
                  <td className={styles.bold}>Complication</td>
                  <td className={styles.bold}>Risk</td>
                </tr>
                <tr>
                  <td>Mesh exposure in the vagina</td>
                  <td>Common (1-2/100) risk of mesh becoming infected or rejected resulting in exposure into the vagina. This can happen many years after surgery and can cause bleeding or pain/irritation for you or your partner with sex. This may resolve with local oestrogen therapy or may require partial excision of the mesh</td>
                </tr>
                <tr>
                  <td>Mesh exposure into the bladder or urethra (waterpipe)</td>
                  <td>{'Rare (<1/100). Can occur soon or years after surgery. This can happen if the bladder or urethra are damaged during the surgery and this is not recognised or if the tape migrates years after the surgery. This requires surgery to remove the tape.'}</td>
                </tr>
                <tr>
                  <td>Bladder or urethral injury</td>
                  <td>{'Common (5-10/100). When discovered during the procedure, the trocar/tape is removed and replaced correctly. The bladder is usually drained with a tube for 24 hours to allow the hole in the bladder to heal. No long term issues have been found following this complication. Damage to the urethra (waterpipe) is uncommon (<1/100) but may have long term consequences'}</td>
                </tr>
                <tr>
                  <td>Needing to pass urine more frequently than usual or not reaching the toilet on time</td>
                  <td>New onset urinary frequency and/or associated leakage with urgency is common (5-10/100). This can be treated with bladder retraining and physiotherapy, and some women need medication. If you have pre-existing overactive bladder your urgency and/or associated leakage with urgency may improve or worsen after surgery. Stress incontinence surgery does not cure urgency symptoms or treat bladder pain.</td>
                </tr>
                <tr>
                  <td>Temporary difficulty passing urine (voiding dysfunction)</td>
                  <td>Common (4/100). Women can have problems emptying the bladder fully which is usually resolved in 7-14 days. It may require a short term tube in the bladder (catheter) for a few days. If this persists reoperation may be required to loosen or divide the mesh. Long term voiding dysfunction requiring self-catheterisation for months/years is rare. Long-term voiding dysfunction may be associated with recurrent urinary tract infections.</td>
                </tr>
                <tr>
                  <td>Temporary vaginal/pelvic pain or pain with sex</td>
                  <td>Uncommon (1/100). Women can develop pain and this usually resolves spontaneously with pain relief after 1-2 weeks. Pain rarely persists.</td>
                </tr>
                <tr>
                  <td>Long-term vaginal/pelvic pain or pain with sex</td>
                  <td>Uncommon with retropubic midurethral sling. *Common (5-10/100) with a transobturator tape and can affect the groin and/or inner thigh. This may be as a result of nerve irritation or muscle spasm. Physiotherapy in the form of "trigger point release" may be helpful and referral to a pain specialist may be required. Full or partial removal of the sling may be needed.</td>
                </tr>
              </table>

              <h3>Risks of removing the mesh tape</h3>
              <p>
                It may not be possible to safely and completely remove the mesh implant as it is meant to
                incorporate permanently into your tissues. Complete mesh removal may be associated with
                higher risks of nerve and organ damage and poor outcomes in terms of pain and continence.
                Complete removal of the transobturator mesh tape may not be possible.
              </p>
              <p>
                Referral to a mesh centre (with a multidisciplinary surgical team experienced in mesh
                removal) may be required. Complete removal of the mesh tape may not alleviate all symptoms
                and some symptoms may worsen.
              </p>
              <p>
                Partial and complete removal of mesh tape may cause your stress urinary incontinence to
                return and you may need to consider another surgery for incontinence.
              </p>

              <h3>Fascial sling</h3>
              <table>
                <tr>
                  <td className={styles.bold}>Complication</td>
                  <td className={styles.bold}>Risk</td>
                </tr>
                <tr>
                  <td>Fascial exposure in the vagina</td>
                  <td>{'Uncommon (<1/100). Risk of fascia becoming infected or rejected resulting in exposure into the vagina. This can cause bleeding or pain/irritation with sex. This may require partial excision of the sling.'}</td>
                </tr>
                <tr>
                  <td>Bladder or urethral injury</td>
                  <td>{'Common (5-10/100). When discovered during the procedure, the trocar/tape is removed and replaced correctly. The bladder is usually drained with a tube for 24 hours. Damage to the urethra (waterpipe) is uncommon (<1/100) but may have long term consequences'}</td>
                </tr>
                <tr>
                  <td>Needing to pass urine more frequently than usual or not reaching the toilet on time</td>
                  <td>New onset urinary frequency and/or associated leakage with urgency is very common (10/100). This can be treated with bladder retraining, physiotherapy and some women need medication. If you have pre-existing overactive bladder your urgency and/or associated leakage with urgency may improve or worsen after surgery.</td>
                </tr>
                <tr>
                  <td>Temporary difficulty passing urine (voiding dysfunction)</td>
                  <td>Very common (10/100). Women can have problems emptying the bladder fully which is usually resolved in 6-8 weeks. It may require a short term tube in the bladder (catheter) for a few days or weeks. If this persists you may need to learn to self-catheterise or reoperation may be required. This is a common (5-10/100) long term risk.</td>
                </tr>
                <tr>
                  <td>Vaginal/pelvic pain or pain with sex</td>
                  <td>Common (1/100). Women can develop pain and this usually resolves spontaneously with pain relief after 1-2 weeks. Pain rarely persists and further treatment with physiotherapy, pain management or full or partial removal of the sling may be needed.</td>
                </tr>
                <tr>
                  <td>Wound complications</td>
                  <td>Common (2/100). The abdominal wound can become infected or can open up if the stitches become loose. A collection of blood or fluid may form below the incision. This may need antibiotics and/or drainage. Common (2/100) women can develop pins and needles or numbness around the scar.</td>
                </tr>
                <tr>
                  <td>Hernia</td>
                  <td>Common (up to 10/100). This can happen at the scar at your bikini line and may require further surgery to repair.</td>
                </tr>
              </table>

              <h3>Colposuspension</h3>
              <table>
                <tr>
                  <td className={styles.bold}>Complication</td>
                  <td className={styles.bold}>Risk</td>
                </tr>
                <tr>
                  <td>Bladder or urethral injury</td>
                  <td>{'Uncommon (<1/100). Rarely the stitches placed may erode into the bladder and require removal. Damage to the urethra (waterpipe) is uncommon (<1/100) but may have long term consequences'}</td>
                </tr>
                <tr>
                  <td>Needing to pass urine more frequently than usual or not reaching the toilet on time</td>
                  <td>New onset urinary frequency and/or associated leakage with urgency is very common (15-20/100). This can be treated with bladder retraining, physiotherapy and some women need medication. If you have pre-existing overactive bladder your urgency and/or associated leakage with urgency may improve or worsen after surgery.</td>
                </tr>
                <tr>
                  <td>Temporary difficulty passing urine (voiding dysfunction)</td>
                  <td>Very common (10/100). Women can have problems emptying the bladder fully which is usually resolved in 6-8 weeks. It may require a short term tube in the bladder (catheter). If this persists you may need to learn to self-catheterise. Long-term voiding dysfunction may be associated with recurrent urinary tract infections.</td>
                </tr>
                <tr>
                  <td>Vaginal/pelvic pain or pain with sex</td>
                  <td>Common (1-5/100). Women can develop pain and this usually resolves spontaneously with pain relief after 1-2 weeks. Pain rarely persists and further treatment with physiotherapy, pain management or releasing the stitches may be needed.</td>
                </tr>
                <tr>
                  <td>Wound complications</td>
                  <td>Common. The abdominal wound can become infected or can open up if the stitches become loose. This may need antibiotics and pain relief.</td>
                </tr>
                <tr>
                  <td>Prolapse of the back vaginal wall (rectocele)</td>
                  <td>Very common (15/100). This may present with a bulge or the sensation of something coming down and surgery to repair this may be required.</td>
                </tr>
                <tr>
                  <td>Problems with stitches placed</td>
                  <td>Rare. If the stitches that are used are permanent they can erode through to the bladder or the vaginal wall.</td>
                </tr>
              </table>

              <h3>Urethral bulking agents</h3>
              <table>
                <tr>
                  <td className={styles.bold}>Complication</td>
                  <td className={styles.bold}>Risk</td>
                </tr>
                <tr>
                  <td>Temporary difficulty passing urine (voiding dysfunction)</td>
                  <td>{'Common (<10/100). Women can have problems emptying the bladder and may require a short term tube in the bladder (catheter) for one or two days. It is rarely more prolonged than this. Long term voiding dysfunction is very rare.'}</td>
                </tr>
                <tr>
                  <td>Pain passing urine</td>
                  <td>Common (1/100). Pain or stinging passing urine can occur in the first 24-48 hours. If you develop symptoms of a urinary tract infection you will need antibiotics.</td>
                </tr>
                <tr>
                  <td>Allergy/hypersensitivity to the bulking material</td>
                  <td>{'Uncommon (<1/100). Rare occurrence but may require treatment for hypersensitivity'}</td>
                </tr>
                <tr>
                  <td>Abscess (local infection) or granuloma (cyst like structure)</td>
                  <td>{'Uncommon (<1/100). Rare but may need treatment with antibiotics or excision of the granuloma.'}</td>
                </tr>
                <tr>
                  <td>Need for repeat bulking injection</td>
                  <td>A "top-up" can be required to successfully treat symptoms of stress urinary incontinence. The effect of the bulking material may sometimes reduce with time requiring a second injection.</td>
                </tr>
              </table>

              {/* ==================== SECTION 6: Pre/Post Surgery (PDF Page 9) ==================== */}
              <h2>What preparation is advised before surgery</h2>
              <ul>
                <li>Stopping smoking several weeks before surgery reduces your chances of complications such as infection, blood clots and poor healing and improves your overall health.</li>
                <li>You may need to stop taking blood thinning medication such as Aspirin, Plavix (clopidogrel), warfarin (coumadin) or Xarelto (rivaroxaban) - please inform the consulting doctor if you are taking any of these.</li>
                <li>Try to maintain a healthy weight.</li>
                <li>Optimise your blood sugars if you are diabetic.</li>
                <li>Avoid constipation.</li>
              </ul>

              <h2>What to expect after surgery</h2>
              <p>
                Depending on the surgery you have you may or may not be kept in hospital. Your recovery
                after the surgery will be monitored and it is usual to be allowed to eat and drink. Ward
                staff will monitor the amount of urine you pass and scan your bladder after voiding to
                ensure you are emptying your bladder.
              </p>

              <h3>The first few days/weeks</h3>
              <ul>
                <li>There might be some vaginal bleeding and if you need to wear protection use a sanitary pad, not a tampon.</li>
                <li>You can drive as soon as you can push the pedals and look over your shoulder without discomfort - usually after two or three weeks. You need to check this with your insurance company.</li>
                <li>There is no restriction on undertaking light activities in the first few days if you feel comfortable to do so. After six weeks gradually build up your level of activity. More strenuous tasks and heavy lifting should be avoided for six weeks. After 3 months you can return to your usual level of activity.</li>
                <li>You should refrain from sexual intercourse and inserting any creams or devices into the vagina for 6 weeks following your procedure, unless recommended by your doctor.</li>
                <li>It is important that you avoid constipation by ensuring you drink plenty of fluid and eat fruit, vegetables and roughage (e.g. bran/oats) high in fibre. Laxatives may be required to make your bowels work better.</li>
                <li>Return to work will depend on the type of work you do. Please ask your doctor for his/her opinion and if you require a "Fitness for work" certificate.</li>
              </ul>

              <h3>Pregnancy and childbirth</h3>
              <p>
                It is highly advisable that you wait until your family is complete before considering any
                surgery for stress urinary incontinence. Carrying a pregnancy and having a vaginal delivery
                may increase the risk of failure of your incontinence procedure. If you do become pregnant
                a caesarean section may be recommended for your delivery in order to reduce this risk.
              </p>

              {/* ==================== SECTION 7: Questions + Expectations (PDF Page 10) ==================== */}
              <h2>Questions and Expectations</h2>
              <p>
                Please write down any questions you have below and bring this booklet with you to your
                next appointment with your clinician.
              </p>
              <p>
                Things I would like to know before my operation. Please list below any questions you may
                have, having read this leaflet:
              </p>

              <h3>Please document your expectations of this treatment</h3>
              <p>
                What are you hoping the operation will do? Please describe the symptoms you think this
                surgery will cure or improve.
              </p>
              <Form.Item name="tvt_hopes">
                <Input.TextArea
                  rows={4}
                  placeholder="e.g. less leakage on coughing/exercise, improved quality of life"
                />
              </Form.Item>

              {/* ==================== SECTION 8: Patient Request for TVT (PDF Page 11) ==================== */}
              <h1>Patient Request for TVT Insertion</h1>
              <h3>
                Patient request for retropubic mesh tape (TVT) for the treatment of
                debilitating stress urinary incontinence
              </h3>

              <div className={styles.bgbox} style={{ backgroundColor: '#fff3cd', borderColor: '#ffc107' }}>
                <p>
                  <span className={styles.bold}>Important:</span> This procedure has been put on pause
                  by HSE Ireland since 2018 and is only currently permitted in exceptional circumstances.
                </p>
              </div>

              <p>
                I wish to proceed to the insertion of a TVT retropubic mesh sling to try to help
                my ongoing stress incontinence symptoms. I can confirm that:
              </p>

              <Form.Item name="tvt_patient_confirmations">
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Checkbox value="debilitating">
                        1. I have daily debilitating stress urinary incontinence affecting my physical
                        and mental wellbeing.
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="pause_exceptional">
                        2. I am aware that this procedure has been put on pause by HSE Ireland since 2018
                        and is only currently permitted in exceptional circumstances.
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="lifestyle">3. I have received lifestyle advice.</Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="pfmt">
                        4. I have undertaken supervised pelvic floor muscle training.
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="non_surgical_declined">
                        5. I do not wish to receive any further non-surgical treatments such as
                        physiotherapy, pessary, or vaginal devices as I have considered these
                        and/or not found them to be beneficial.
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="read_all_options">
                        6. I have carefully read and considered all the surgical options available
                        to treat this condition.
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="nice_pda">
                        7. I have received the Patient Decision Aids introduced by NICE for the
                        management of women with Stress urinary incontinence.
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="decline_colpo_fascial">
                        9. I decline to have either a laparoscopic/open colposuspension or an autologous
                        fascial sling. I personally do not accept the risk profile of these procedures.
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="mesh_risk_acceptable">
                        10. I believe that the risk profile of a retropubic mesh tape is more acceptable
                        to me in my own circumstances.
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="type1_polypropylene">
                        11. I understand that the mesh used for a TVT is a type 1 Polypropylene mesh and
                        is permanent and is not intended for removal.
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item name="tvt_bulking_considered" valuePropName="checked">
                <Checkbox>
                  8. I have considered/had a Urethral Bulking agent and do not wish to have this
                  performed/repeated. I understand Urethral Bulking agent would be a minor
                  outpatient procedure.
                </Checkbox>
              </Form.Item>

              {/* ==================== SECTION 9: Risk Acknowledgement + MDT (PDF Page 12) ==================== */}
              <h2>Risk Acknowledgement</h2>
              <p>
                I have received patient Information leaflets (PIL) for the TVT and am aware of
                the following risks:
              </p>
              <ul>
                <li>Cure/improvement rates: 80-90% (a 10-20% failure rate)</li>
                <li>Recurrence of incontinence symptoms: 20-30% over the next 10-20 years</li>
                <li>Infection: less than 5%</li>
                <li>Bleeding: may require further surgery and potential blood transfusion (less than 5%)</li>
                <li>Blood clots in legs (DVT) and lungs (PE): less than 1%</li>
                <li>Injury to nerves, bladder, bowel, and blood vessels: less than 5%</li>
                <li>Chronic pain: less than 5%</li>
                <li>New onset or worsening of overactive bladder symptoms (frequency, urgency, urge leakage): up to 7%</li>
                <li>Difficulty emptying bladder: 5%</li>
                <li>Need for self-catheterisation short and long term: less than 5%</li>
                <li>Exposure of mesh through vaginal wall: up to 5%</li>
                <li>Need for mesh removal due to complications: up to 3%. Complete removal may not be possible and may not resolve mesh-related symptoms.</li>
                <li>Sexual dysfunction: up to 15%, which may include pain during intercourse</li>
              </ul>

              <Form.Item name="tvt_risks_acknowledged" valuePropName="checked">
                <Checkbox>
                  I am fully aware of the success rates and complications of these procedures,
                  and I have had time to understand these. I have carefully read the section on
                  mesh complications and accept these complications.
                </Checkbox>
              </Form.Item>

              <Form.Item name="tvt_adverse_publicity_aware" valuePropName="checked">
                <Checkbox>
                  I am aware of the adverse publicity associated with the use of synthetic
                  vaginal mesh and the concerns raised by campaign groups.
                </Checkbox>
              </Form.Item>

              <h3>MDT Approval Requirement</h3>
              <Form.Item name="tvt_mdt_required" valuePropName="checked">
                <Checkbox>
                  I am aware that it is necessary for my case to be approved by the local
                  Urogynaecology Multidisciplinary team meeting (MDT). This will comply with
                  my ability, as the patient, to exercise my right to informed patient choice.
                </Checkbox>
              </Form.Item>

              {/* ==================== SECTION 10: Irish National Mesh Register (PDF Page 13) ==================== */}
              <h2>Irish National Mesh Register</h2>
              <p>
                I have read the Irish National Mesh Register patient information leaflet and/or had it
                explained to me. I understand the reasons for the Irish National Mesh Register, that it
                aims to record all mesh implants and improve care delivered to patients in Irish hospitals.
              </p>

              <h3>Consent to the Irish National Mesh Register</h3>
              <Form.Item name="tvt_mesh_register" valuePropName="checked">
                <Checkbox>
                  I CONSENT to my details being recorded on the Irish National Mesh Register.
                  I understand that I may withdraw this consent at any time in the future.
                </Checkbox>
              </Form.Item>

              <h3>Mesh Device Information</h3>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <Form.Item name="tvt_device_name" label="Proposed device name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="tvt_device_manufacturer" label="Manufacturer">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              {/* ==================== SECTION 11: Consent Form Sections A-F (PDF Page 14) ==================== */}
              <h2>Consent Form</h2>
              <p>
                This consent must be completed by the doctor with their patient in advance of surgery.
                All sections must be signed.
              </p>

              <h3>Section A: Non-surgical Management Discussion</h3>
              <p>
                My clinician has discussed with me the benefits of non-surgical management of
                stress urinary incontinence including lifestyle interventions, physiotherapy
                and behavioural therapies.
              </p>

              <h3>Section B: Physiotherapy Attendance</h3>
              <Form.Item name="tvt_physio_attended" valuePropName="checked">
                <Checkbox>
                  I have attended a physiotherapist who has explained to me non-surgical options
                  for stress urinary incontinence. My wish is to proceed with surgical intervention.
                </Checkbox>
              </Form.Item>

              <h3>Section C: Urodynamics Attendance</h3>
              <Form.Item name="tvt_urodynamics_attended" valuePropName="checked">
                <Checkbox>
                  I have attended a urodynamics clinic. My wish is to proceed with surgical intervention.
                </Checkbox>
              </Form.Item>

              <h3>Section D: Patient Expectations/Hopes</h3>
              <p>
                What are you hoping the operation will do? Please describe the symptoms you
                think this surgery will cure - please list all:
              </p>
              <p className={styles.bold}>
                (Your response from the "Questions and Expectations" section above will be included here.)
              </p>

              <h3>Section E: Information Leaflet Confirmation</h3>
              <p>
                I confirm I have been given an information leaflet to read at home prior to my surgery
                date. I understand the risks that have been explained and I still wish to proceed with
                surgery.
              </p>

              <h3>Section F: Information Checklist</h3>
              <p>
                I confirm I have had adequate time to study the information provided. I am satisfied with
                the explanation of the procedure and the associated risks and benefits that have been
                discussed with me. I have no further questions.
              </p>
              <Form.Item name="tvt_information_checklist">
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Checkbox value="procedure_outcome">
                        The details of the procedure proposed and the desired outcome
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="alternatives">
                        All available alternatives and their advantages and disadvantages
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="risks_individual">
                        All information on possible risks including my individual risk
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox value="questions_answered">All my questions were answered</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              {/* ==================== SECTION 12: Declarations + Signatures (PDF Page 15) ==================== */}
              <h2>Statement of health professional</h2>
              <ul>
                <li>
                  I am suitably trained and competent and have sufficient knowledge
                  to consent this patient in line with the requirements of my
                  regulatory body.
                </li>
                <li>
                  I have discussed what the treatment is likely to involve, the
                  benefits and risks of this procedure.
                </li>
                <li>
                  I have also discussed the benefits and risks of any available
                  alternative procedures or treatments including no treatment.
                </li>
                <li>I have discussed any particular concerns of this patient.</li>
              </ul>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <ConsentInput form={form} name="a15" label="Signature" />
                </Col>
                <Col span={12}>
                  <ConsentDate name="a16" label="Date" />
                </Col>
                <Col span={12}>
                  <ConsentInput form={form} name="a17" label="Name" />
                </Col>
                <Col span={12}>
                  <ConsentInput form={form} name="a18" label="Job title" />
                </Col>
              </Row>

              <h2>Patient Declaration</h2>
              <p>
                My health professional has presented all the evidence and data on stress urinary
                incontinence surgery. Having read the available literature (PIL) and this form,
                I confirm that I understand the risks and, on the basis of my own wishes, want
                to proceed with the TVT.
              </p>
              <p className={styles.bold}>
                I have the right to change my mind at any time, including after I have signed this form.
              </p>

              <h3>Tick if relevant</h3>
              <Form.Item noStyle name="a25">
                <Checkbox.Group>
                  <Checkbox value="1">
                    I confirm that there is no risk that I could be pregnant. Please
                    inform your responsible healthcare professional and/or your
                    clinical care team on the day of your procedure if you could be
                    pregnant. Please note that a pregnancy test may give a negative
                    result if a pregnancy has occurred within 2 weeks of the test.
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <ConsentInput
                    form={form}
                    name="a23"
                    disabled
                    label="Name (PRINT)"
                    value={patientInfo.firstname + ' ' + patientInfo.surname}
                  />
                </Col>
                <Col span={12}>
                  <ConsentDate
                    form={form}
                    name="a24"
                    label="Date"
                    value={consentData ? consentData.a24 : moment()}
                  />
                </Col>
              </Row>
              <h2>Signature</h2>
              <div className={styles.canvasbox}>
                <SignatureCanvas
                  ref={canvasRef}
                  penColor="black"
                  canvasProps={{
                    width: 480,
                    height: 160,
                    className: styles.canvas,
                  }}
                  onEnd={() => setSignature(canvasRef.current.toDataURL())}
                />
                <Button
                  onClick={() => {
                    canvasRef.current.clear();
                    setSignature('');
                  }}
                >
                  Clear
                </Button>
              </div>
              <div style={{ margin: 32, textAlign: 'center' }}>
                <Button onClick={() => form.submit()} type="primary" size="large">
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* ==================== NON-TVT FORM (unchanged) ==================== */}
              <h1>{name}</h1>
              <p>
                This form should only be used if the patient has capacity to give
                consent. If the patient does not legally have capacity, please use
                an appropriate alternative consent form from your hospital or hub.
              </p>
              <p>
                <span className={styles.bold}>Note to patients:</span> Please note
                it is common NHS practice for a patient's consent to be taken by a
                clinician other than the operating or listing surgeon. This
                clinician will be suitably trained and competent to take your
                consent. They will be referred to as your 'responsible healthcare
                professional' in this form.
              </p>
              <p className={styles.bold}>
                You may have questions before starting, during or after your
                procedure. Contact details are provided for any further queries,
                concerns or if you would like to discuss your treatment further.
              </p>
              <h2>Patient details</h2>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <ConsentInput
                    form={form}
                    name="a1"
                    disabled
                    label="First name"
                    value={patientInfo.firstname}
                  />
                </Col>
                <Col span={12}>
                  <ConsentInput
                    form={form}
                    name="a2"
                    disabled
                    label="Last name"
                    value={patientInfo.surname}
                  />
                </Col>
                <Col span={12}>
                  <ConsentInput
                    form={form}
                    name="a3"
                    disabled
                    label="Date of birth"
                    value={patientInfo.birthday.format('DD/MM/yyyy')}
                  />
                </Col>
                <Col span={12}>
                  <ConsentInput form={form} name="a4" label="Patient identifier" />
                </Col>
                <Col span={24}>
                  <ConsentInput
                    form={form}
                    name="a5"
                    label="Responsible Healthcare Professional"
                  />
                </Col>
                <Col span={24}>
                  <ConsentInput
                    form={form}
                    name="a6"
                    label="Special requirements"
                    sublabel="e.g.,transport, interpreter, assistance"
                  />
                </Col>
                <Col span={24}>
                  <Leaflets />
                </Col>
              </Row>
              <h2>Details of {surgical_name} and repair</h2>
              <table>
                <tr>
                  <td>{surgical_name} and repair procedure</td>
                  <td>
                    {DetailsMap[surgical_name].map(
                      (item: string, index: number) => (
                        <p key={index}>{item}</p>
                      ),
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Extra procedures</td>
                  <td>
                    <Form.Item noStyle name="a7">
                      <Checkbox.Group>
                        <Checkbox value="1">
                          Saprospinous ligament fixation
                        </Checkbox>
                        <p className={styles.indent}>
                          This is where dissolvable stitches (sutures) are used to
                          stitch the top of the vagina (vaginal vault) to the
                          sacrospinous ligament.
                        </p>
                        <Checkbox value="2">Cystourethroscopy and biopsy</Checkbox>
                        <p className={styles.indent}>
                          This is where a small camera is inserted through the tube
                          that connects the bladder to the outside (urethra) to look
                          inside your bladder. A small sample (biopsy) of bladder
                          wall may be taken at the same time, if required.
                        </p>
                      </Checkbox.Group>
                    </Form.Item>
                  </td>
                </tr>
                <tr>
                  <td>
                    Indication for, and purpose of surgery:
                    <span className={styles.sublabel}>(Tick as appropriate)</span>
                  </td>
                  <td>
                    <Form.Item noStyle name="a8">
                      <Checkbox.Group>
                        <Checkbox value="1">Prolapse</Checkbox>
                        <p className={styles.indent}>
                          To treat and reduce the symptoms of prolapse (a bulge in,
                          or coming from the vagina, caused by poor support of the
                          bladder, bowel or womb)
                        </p>
                        <Checkbox value="2">
                          Investigation of lower urinary tract concerns (when
                          cystoscopy and biopsy is also planned)
                        </Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                  </td>
                </tr>
                <tr>
                  <td>
                    Alternatives considered:
                    <span className={styles.sublabel}>(Tick as appropriate)</span>
                  </td>
                  <td>
                    <h3>The patient had a treatment of Nonsurgical management</h3>
                    <Form.Item noStyle name="a9">
                      <Checkbox.Group>
                        <Checkbox value="1">
                          Pelvic floor muscle therapy (PFMT)
                        </Checkbox>
                        <p className={styles.indent}>
                          PFMT is a type of physiotherapy, which uses exercises to
                          strengthen the pelvic floor muscles. Supervised PFMT has
                          been shown to assist with symptoms of prolapse and can
                          reduce mild and moderate prolapse severity. Some people
                          feel they do not need surgical therapy after undergoing
                          PFMT.
                        </p>
                        <Checkbox value="2">Use of pessaries for prolapse</Checkbox>
                        <p className={styles.indent}>
                          Pessaries are plastic/rubber devices that can go into the
                          vagina to try and support the prolapse and reduce its
                          effects. They are not always suitable for all vaginal
                          prolapse.
                        </p>
                      </Checkbox.Group>
                    </Form.Item>
                  </td>
                </tr>
              </table>
              <h2>Additional resources</h2>
              <p>
                Information about Mid-urethral Sling proceedure for Stress Urinary Incontinence
              </p>
              <img src={qr5} alt="" />
              <p>
                Information for you about treatment of uterine or vaginal prolapse –
                British Society of Urogynaecology
              </p>
              <a href="https://bsug.org.uk/pages/for-patients/bsug-patient-information-leaflets/154">
                https://bsug.org.uk/pages/for-patients/bsug-patient-information-leaflets/154
              </a>
              <p>
                Anterior vaginal wall repair without the use of mesh – British
                Society of Urogynaecology
              </p>
              <img src={qr1} alt="" />
              <p>
                Posterior vaginal wall repair without the use of mesh – British
                Society of Urogynaecology
              </p>
              <img src={qr2} alt="" />
              <p>
                Information for you after a vaginal hysterectomy – Royal College of
                Obstetricians and Gynaecologists
              </p>
              <a href="https://patient.concentric.health/info/662t">
                https://patient.concentric.health/info/662t
              </a>
              <p>
                Information for you after a pelvic floor repair – Royal College of
                Obstetricians and Gynaecologists
              </p>
              <a href="https://patient.concentric.health/info/8x8t">
                https://patient.concentric.health/info/8x8t
              </a>
              <p>
                If you do not wish to access the additional patient information
                contained within this consent form digitally, please speak to your
                responsible healthcare professional and they will provide you with
                hard copies. These will be provided in a language and format that
                suits you.
              </p>
              <h2>Anaesthesia</h2>
              <p>
                Anaesthetic is used to allow surgery to take place painlessly. It
                may include medicines that put you to sleep, or those which only
                numb the area being operated on while you remain awake. This can be
                done in various ways and your anaesthetist will advise you on your
                options and talk to you about the risks, complications and benefits
                of your choice. There is no legal requirement to obtain written
                consent for the type of anaesthesia given to a patient; this section
                of the consent form is for your information only.
              </p>
              <p>
                On the day of surgery, an anaesthetist will discuss anaesthetic
                options and risks with you. This is a shared decisionmaking process,
                and you will jointly decide and agree the anaesthetic option that is
                best for you. Please remember that if there are any complications
                during surgery, your anaesthetist may need to alter the type of
                anaesthesia and they will explain this to you during the procedures.
              </p>
              <p>
                For further information about the types of anaesthetic you may
                receive, and potential risks, please see the information below.
              </p>
              <div className={styles.qrbox}>
                <div>
                  <h4>Types</h4>
                  <img src={qr3} alt="" />
                </div>
                <div>
                  <h4>Risks</h4>
                  <img src={qr4} alt="" />
                </div>
                <div>
                  <a href="https://www.rcoa.ac.uk/documents/anaesthesia-explained/types-anaesthesia">
                    https://www.rcoa.ac.uk/documents/anaesthesia-explained/types-anaesthesia
                  </a>
                  <a href="https://www.rcoa.ac.uk/sites/defualt/files/documents/2019-11/Riskinfographics_2019web.pdf">
                    https://www.rcoa.ac.uk/sites/defualt/files/documents/2019-11/Riskinfographics_2019web.pdf
                  </a>
                </div>
              </div>
              <p>
                If you do not wish to access the additional patient information via
                link or QR code, please speak to your responsible healthcare
                professional and they will provide you with a hard copy. These will
                be provided in a language and format that suits you.
              </p>
              <div className={styles.bgbox}>
                <h3>TO BE FILLED OUT BY CLINICIAN ON THE DAY OF SURGERY</h3>
                <Row gutter={16} style={{ marginBottom: 12 }}>
                  <Col span={12}>
                    <ConsentInput
                      form={form}
                      name="a10"
                      label="Name of anaesthetist on the day"
                    />
                  </Col>
                  <Col span={12}>
                    <ConsentDate name="a11" label="Date" />
                  </Col>
                </Row>
                <Form.Item noStyle name="a12">
                  <Checkbox.Group>
                    <Checkbox value="1">
                      <p>
                        I confirm I have discussed the different anaesthetic options
                        with the patient, including risks and benefits, and we have
                        jointly decided the preferred anaesthetic.
                      </p>
                    </Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <p className={styles.bold}>
                  Please note the preferred methods of anaesthesia as discussed
                  between the patient and anaesthetist below:
                </p>
              </div>
              <p>
                You will be told of any additional procedures in addition to those
                described on this form that may become necessary
              </p>
              <div className={styles.bgbox}>
                <Form.Item noStyle name="a13">
                  <Input.TextArea bordered={false} rows={4} />
                </Form.Item>
              </div>
              <p>
                during your treatment. Please list below any procedures
                <span className={styles.bold}>
                  YOU DO NOT WISH TO BE CARRIED OUT
                </span>
                without further discussion.
              </p>
              <h2>Immediate risks (during the procedure)</h2>
              <h4>
                (Your responsible healthcare professional will delete as
                appropriate)
              </h4>
              <table>
                <tr>
                  <td>Expected</td>
                  <td>
                    <p className={styles.bold}>Vaginal bleeding</p>
                    <p>
                      A small amount of bleeding, which is usually less than a
                      mugful of blood, is to be expected.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    Common
                    <div className={styles.sublabel}>(more than 1 in 20)</div>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    Uncommon
                    <div className={styles.sublabel}>(fewer than 1 in 20)</div>
                  </td>
                  <td>
                    <p className={styles.bold}>
                      Perioperative risks (risks around the time of your operation)
                    </p>
                    <p>
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
                    </p>
                    <p className={styles.bold}>Significant bleeding</p>
                    <p>
                      Some bleeding is expected during most procedures; however,
                      significant bleeding may require further treatment. It can
                      usually be dealt with during the procedure, but may lead to a
                      change from the planned procedure, a blood transfusion, or
                      further emergency treatment.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    Rare
                    <div className={styles.sublabel}>(fewer than 1 in 100)</div>
                  </td>
                  <td>
                    <p className={styles.bold}>Compression injury</p>
                    <p>
                      A compression injury describes any damage caused by pressure
                      to tissues such as skin or nerves. This type of injury can
                      occur in the operating theatre as you are lying in one
                      position for several hours. Any areas that are at risk, such
                      as bony prominences, are padded during surgery to reduce the
                      risk of compression injury. If this does occur you may
                      experience numbness or a tingling sensation in the affected
                      area. This is usually temporary.
                    </p>
                    <p className={styles.bold}>Damage to surrounding structures</p>
                    <p>
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
                    </p>
                    <p>
                      If your bladder is injured, you would usually have a catheter
                      inserted for 7–14 days after surgery.
                    </p>
                    <p>
                      There is a risk of any damage not being noticed at the time of
                      surgery. This would lead to symptoms in the days following
                      surgery, and possibly further surgery.
                    </p>
                    <p className={styles.bold}>Blood clots</p>
                    <p>
                      Different techniques are used to reduce the risk of blood
                      clots forming; however, these can still arise during surgery.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    Specific risks to you from your treatment (to be input by your
                    responsible healthcare professional)
                  </td>
                  <td></td>
                </tr>
              </table>
              <h2>
                Early and late risks (in the days, weeks or months after the
                procedure)
              </h2>
              <h4>
                (Your responsible healthcare professional will delete as
                appropriate)
              </h4>
              <table>
                <tr>
                  <td>Expected</td>
                  <td>
                    <p className={styles.bold}>Pain</p>
                    <p>
                      It is normal to have some mild pain or discomfort in the
                      vagina.
                    </p>
                    <p>
                      If a sacrospinous ligament fixation is carried out, pain in
                      the buttock cheek on the side where the ligament is 'fixed'
                      occurs for between 1 and 3 patients out of 20.
                    </p>
                    <p>
                      Pain is common after surgery but again, this may be reduced by
                      a lot of local anaesthesia given during surgery and/or
                      additional regional anaesthetic, such as a spinal anaesthetic
                      extra to the general anaesthetic. The local anaesthetic and
                      spinal anaesthetic tend to last a few hours longer than the
                      general anaesthetic alone allowing a longer pain-free
                      duration.
                    </p>
                    <p>
                      In the days and few weeks after surgery, you may feel some
                      discomfort rather than pain and should be able to carry out
                      routine care of yourself. If you are unable to control the
                      pain, please contact your GP or the hospital to organise
                      appropriate care.
                    </p>
                    <p className={styles.bold}>Vaginal bleeding</p>
                    <p>
                      Vaginal bleeding is when blood is passed from the vagina. Some
                      bleeding should be expected for up to a week after surgery.
                      Pads should be used rather than tampons to reduce the risk of
                      infection. If the bleeding becomes heavier – more like a
                      period – please get in touch with your clinical team as you
                      might have developed an infection or a problem that needs
                      treatment.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    Common
                    <div className={styles.sublabel}>(more than 1 in 20)</div>
                  </td>
                  <td>
                    <p className={styles.bold}>
                      Urinary infection (water infection or cystitis)
                    </p>
                    <p>
                      A urinary tract infection (UTI) is an infection of the urine.
                      It often leads to discomfort when passing urine, and can make
                      you feel like you need to pass urine more often. UTIs just
                      affect your bladder but can sometimes lead to more serious
                      infections, including blood infections (sepsis).
                    </p>
                    <p className={styles.bold}>Vaginal infection</p>
                    <p>
                      The area that has been operated on can become infected with
                      bacteria from your vagina, or because of blood collecting in
                      your vagina behind the stitches.
                    </p>
                    <p>
                      Both urinary and vaginal infections can be managed with
                      antibiotic tablets, but sometimes antibiotics may need to be
                      given through a drip (though a tube inserted into your vein).
                      This may mean you have to stay in hospital. During most
                      operations, some antibiotics are given to reduce the risk of
                      infection anyway.
                    </p>
                    <p className={styles.bold}>Wound complications</p>
                    <p>
                      The risk of developing a wound infection is higher in some
                      patients, including those who are obese, are smokers, and
                      patients with diabetes.
                    </p>
                    <p>
                      If you feel unwell with a high temperature or any signs of
                      infections including, but not limited to those highlighted
                      here, please go to your local Accident & Emergency Department
                      for a review as this may need urgent treatment and admission.
                    </p>
                    <p className={styles.bold}>Urinary symptoms</p>
                    <p>
                      Bladder emptying and overactive bladder symptoms (feeling an
                      urgent need to pass urine) tend to improve after prolapse
                      surgery. However, some bladder symptoms can worsen after
                      surgery:
                    </p>
                    <ul>
                      <li>
                        Stress incontinence symptoms (where urine leaks on coughing,
                        laughing, etc.) worsen in around 1 in 10 people after
                        repairing a prolapse. This is because the prolapse may have
                        caused a kink in the urethra (the tube through which urine
                        is passed). Repairing the prolapse may remove the kink and
                        expose the underlying weakness in the urethra.
                      </li>
                      <li>
                        Bladder emptying problems usually improve after surgery, but
                        some difficulties continue in 1 in 10 patients. You might
                        have more difficulty passing urine in the first 48 hours
                        after prolapse surgery, and this is managed by having a
                        catheter inserted for a few days. The catheter can usually
                        be removed within a week of surgery when normal bladder
                        function has resumed.
                      </li>
                    </ul>
                    <p className={styles.bold}>
                      Recurrence of prolapse symptoms (1 in 3 chance)
                    </p>
                    <p>
                      Symptoms that were initially treated by the procedure may come
                      back and further investigations or treatment may be needed to
                      reduce these symptoms in future. A recurrence of prolapse is
                      seen in 1 in 3 patients. Sometimes, symptoms are not
                      significant enough to consider further surgical treatment, but
                      further prolapse surgery can be done if required.
                    </p>
                    <p className={styles.bold}>Dyspareunia (pain during sex)</p>
                    <p>
                      Most women find that dyspareunia, the medical term for
                      experiencing pain during sex (sexual intercourse), improves
                      after prolapse surgery. Sex should be avoided during the first
                      6 weeks as the area heals. The procedure makes the vagina
                      narrower, and sometimes shorter, so some discomfort should be
                      expected during the following weeks.
                    </p>
                    <p className={styles.bold}>
                      Altered sensation during sexual intercourse (if vaginal wall
                      repair being done for prolapse)
                    </p>
                    <p>
                      Some women report reduced sensation during sex (sexual
                      intercourse) after the operation, or feel that the vagina is
                      too short or too tight. On the other hand, others report that
                      sex is significantly improved after prolapse surgery.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    Uncommon
                    <div className={styles.sublabel}>(fewer than 1 in 20)</div>
                  </td>
                  <td>
                    <p className={styles.bold}>Need for more surgery</p>
                    <p>
                      If there are complications after the operation, you may be
                      advised to have another operation during your hospital stay.
                      This would usually be to treat continued bleeding, to drain a
                      collection of blood or pus at the top of the vagina, or
                      because of wound complications.
                    </p>
                    <p className={styles.bold}>Constipation</p>
                    <p>
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
                    </p>
                    <p className={styles.bold}>Vaginal vault prolapse</p>
                    <p>
                      A vaginal vault prolapse is where the top of the vagina
                      (vaginal vault) drops down into the vaginal canal. If this
                      occurred, you may need a pessary for support (described above)
                      or further surgery.
                    </p>
                    <p className={styles.bold}>Vaginal vault dehiscence</p>
                    <p>
                      A vaginal vault dehiscence is where the line of stitches
                      (sutures) at the top of the vagina come apart. This usually
                      needs emergency surgery to securely re-suture the top of the
                      vagina.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    Rare
                    <div className={styles.sublabel}>(fewer than 1 in 100)</div>
                  </td>
                  <td>
                    <p className={styles.bold}>
                      Blood clots (deep vein thrombosis or pulmonary embolus) (1 in
                      300 chance)
                    </p>
                    <p>
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
                    </p>
                    <p className={styles.bold}>Death</p>
                    <p>
                      There is a risk of dying either as a direct result of the
                      procedure or treatment, or from complications in the following
                      days or weeks. The risk depends on many factors, including
                      your age and any underlying medical problems you may have.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    Specific risks to you from your treatment (to be input by your
                    responsible healthcare professional)
                  </td>
                  <td></td>
                </tr>
              </table>
              <h2>Statement of health professional</h2>
              <ul>
                <li>
                  I am suitably trained and competent and have sufficient knowledge
                  to consent this patient in line with the requirements of my
                  regulatory body.
                </li>
                <li>
                  I have discussed what the treatment is likely to involve, the
                  benefits and risks of this procedure.
                </li>
                <li>
                  I have also discussed the benefits and risks of any available
                  alternative procedures or treatments including no treatment.
                </li>
                <li> have discussed any particular concerns of this patient.</li>
              </ul>
              <Copy name="a14" />
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <ConsentInput form={form} name="a15" label="Signature" />
                </Col>
                <Col span={12}>
                  <ConsentDate name="a16" label="Date" />
                </Col>
                <Col span={12}>
                  <ConsentInput form={form} name="a17" label="Name" />
                </Col>
                <Col span={12}>
                  <ConsentInput form={form} name="a18" label="Job title" />
                </Col>
              </Row>
              <h2>Statement of patient</h2>
              <p>
                Please read this form carefully.If you have any further questions,
                do ask – we are here to help you. You have the right to change your
                mind at any time, including after you have signed this form.
              </p>
              <Row gutter={16}>
                <Col span={8}>
                  <ul>
                    <li>
                      I agree to the course of treatment described on this form.
                    </li>
                    <li>
                      I have had the benefits and possible risks of treatment
                      explained to me.
                    </li>
                    <li>
                      I have had the opportunity to discuss treatment alternatives,
                      including no treatment.
                    </li>
                    <li>
                      I understand that a guarantee cannot be given that a
                      particular person will perform the procedure. The person will,
                      however, have appropriate expertise.
                    </li>
                    <li>
                      I understand I have been/will be given the opportunity to
                      discuss my anaesthetic options with an anaesthetist, and we
                      will jointly decide which option is best for me. I understand
                      that the type of anaesthesia may need to be altered if there
                      are any complications during the procedure.
                    </li>
                    <li>
                      I have been told about additional procedures that are
                      necessary prior to treatment or may become necessary during my
                      treatment. This may include permanent skin marks and
                      photographs to help with treatment planning and
                      identification.
                    </li>
                    <li>
                      I understand that there may be people present for my procedure
                      who are learning, such as junior doctors, medical students,
                      and trainee nurses, and that I may decline to have any of
                      these people present.
                    </li>
                  </ul>
                </Col>
                <Col span={8}>
                  <Form.Item noStyle name="a19">
                    <Checkbox.Group>
                      <Checkbox value="1">
                        I agree that people who are learning, such as junior
                        doctors, medical students and trainee nurses may participate
                        in examinations if supervised by a fully qualified
                        professional.
                      </Checkbox>
                      <Checkbox value="2">
                        I understand that any procedure in addition to those
                        described on this form will only be carried out if it is
                        necessary to save my life or to prevent serious harm to my
                        health.
                      </Checkbox>
                      <Checkbox value="3">
                        I understand that information collected during my procedure/
                        treatment, including images and video, may be used for
                        education, audit and research (which may be published in
                        medical journals). All information will be anonymised and
                        used in a way that I cannot be identified.
                      </Checkbox>
                      <Checkbox value="4">
                        I agree that my health records may be used by authorised
                        members of staff, who are not directly involved in my
                        clinical care, for research approved by a research ethics
                        committee and in compliance with the Data Protection Act
                        (2018).
                      </Checkbox>
                      <Checkbox value="5">
                        I understand that patient specific data will be collected
                        and may be used in the context of providing clinical care,
                        in compliance with the Data Protection Act (2018).
                      </Checkbox>
                      <Checkbox value="6">
                        I confirm that I have read and understood pages 1 to X of
                        the consent form above.
                      </Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <p>
                    Please inform your responsible healthcare professional if you
                    wish to withdraw consent for information use.
                  </p>
                  <h2>
                    Statement of interpreter/ witness
                    <span className={styles.sublabel}>(where appropriate)</span>
                  </h2>
                  <Form.Item noStyle name="a20">
                    <Checkbox.Group>
                      <Checkbox value="1">
                        I have interpreted the information contained in the form to
                        the patient to the best of my abilities and in a way in
                        which I believe they can understand.
                      </Checkbox>
                      <h3>or</h3>
                      <Checkbox value="2">
                        I confirm that the patient is unable to sign but has
                        indicated their consent.{' '}
                      </Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                  <ConsentInput form={form} name="a21" label="name" />
                  <ConsentInput form={form} name="a22" label="Signature" />
                </Col>
              </Row>
              <h3>Tick if relevant</h3>
              <Form.Item noStyle name="a25">
                <Checkbox.Group>
                  <Checkbox value="1">
                    I confirm that there is no risk that I could be pregnant. Please
                    inform your responsible healthcare professional and/or your
                    clinical care team on the day of your procedure if you could be
                    pregnant. Please note that a pregnancy test may give a negative
                    result if a pregnancy has occurred within 2 weeks of the test.
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <ConsentInput
                    form={form}
                    name="a23"
                    disabled
                    label="Name (PRINT)"
                    value={patientInfo.firstname + ' ' + patientInfo.surname}
                  />
                </Col>
                <Col span={12}>
                  <ConsentDate
                    form={form}
                    name="a24"
                    label="Date"
                    value={consentData ? consentData.a24 : moment()}
                  />
                </Col>
              </Row>
              <h2>Signature</h2>
              <div className={styles.canvasbox}>
                <SignatureCanvas
                  ref={canvasRef}
                  penColor="black"
                  canvasProps={{
                    width: 480,
                    height: 160,
                    className: styles.canvas,
                  }}
                  onEnd={() => setSignature(canvasRef.current.toDataURL())}
                />
                <Button
                  onClick={() => {
                    canvasRef.current.clear();
                    setSignature('');
                  }}
                >
                  Clear
                </Button>
              </div>
              <div style={{ margin: 32, textAlign: 'center' }}>
                <Button onClick={() => form.submit()} type="primary" size="large">
                  Submit
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </>
  );
};

export default ConsentForm;

const ConsentInput: FC<{
  label: string;
  name: string;
  form: any;
  value?: string;
  sublabel?: string;
  disabled?: boolean;
}> = (props) => {
  const { label, value, form, sublabel, name, disabled = false } = props;
  useEffect(() => {
    form.setFieldsValue({ [name]: value });
  }, [value]);
  return (
    <div className={styles.inputbox}>
      <div className={styles.label}>
        {label}: <span className={styles.sublabel}>{sublabel}</span>
      </div>
      <div className={styles.input}>
        <Form.Item noStyle name={name}>
          <Input disabled={disabled} bordered={false} />
        </Form.Item>
      </div>
    </div>
  );
};

const ConsentDate: FC<{
  label: string;
  sublabel?: string;
  disabled?: boolean;
  name: string;
  value?: any;
  form?: any;
}> = (props) => {
  const { label, sublabel, name, disabled = false, value, form } = props;
  useEffect(() => {
    value && form && form.setFieldsValue({ [name]: value });
  }, [value]);
  return (
    <div className={styles.inputbox}>
      <div className={styles.label}>
        {label}: <span className={styles.sublabel}>{sublabel}</span>
      </div>
      <div className={styles.input}>
        <Form.Item noStyle name={name}>
          <DatePicker disabled={disabled} bordered={false} />
        </Form.Item>
      </div>
    </div>
  );
};

const Leaflets: FC = () => {
  return (
    <div className={styles.inputbox}>
      <div className={styles.radio}>
        <span className={styles.label}>
          The patient has been given all the leaflets:
        </span>
        <Radio.Group options={['Yes', 'No']} value="Yes"></Radio.Group>
      </div>
    </div>
  );
};

const Copy: FC<{ name: string }> = (props) => {
  return (
    <div className={styles.inputbox}>
      <div className={styles.radio}>
        <span className={styles.label}>
          Copy of consent form accepted by patient:
        </span>
        <Form.Item noStyle name={props.name}>
          <Radio.Group options={['Yes', 'No']}></Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};

export const DetailsMap: any = {
  'Vaginal hysterectomy': [
    `This procedure involves an operation to remove the womb (uterus) and the neck of the womb (cervix) through the vagina without needing to make cuts on the abdomen. You will not be able to get pregnant after this operation.`,
    `The repair may include either an anterior vaginal wall repair, posterior repair, perineorrhaphy or a combination of any of these.`,
    `Pelvic floor repairs require the surgeon to open the vagina with a cut, then use special stitches to support a bulge in, or coming from the vagina, caused by poor support of the bladder, bowel or womb (a prolapse). Further stitches are then used to close the cut.`,
    `An anterior repair is an operation performed within the vagina to treat an anterior (front) vaginal wall prolapse (also known as a cystocoele). A posterior (back) vaginal wall repair is an operation to reinforce the vaginal tissues between the vagina and the rectum (also known as a rectocele).`,
    `A perineorrhaphy involves repairing the damaged part of the perineum (skin between the vagina and anus) immediately below the vagina.`,
    `All of these repairs involve making a cut in the relevant vaginal wall, and reinforcing stitches being put into the supporting tissue. All the sutures are inside the vagina except the perineorrhaphy where some stitches will be outside, on the perineum`,
  ],
  Sacrocolpopexy: [
    `A sacrocolpopexy is an operation to treat a prolapse of the vaginal vault (top of the vagina/front passage) in women who have had a hysterectomy (removal of womb) using a strip of synthetic mesh to lift the top of the vagina and hold it in place.`,
    `The operation is done under general anaesthetic. A general anaesthetic will mean you will be asleep during the entire procedure. • The operation of sacrocolpopexy can be done through an open operation or laparoscopically (keyhole). The open operation is done through a horizontal or bikini-line incision in your lower abdomen (tummy) and for a laparoscopic operation there are 3-4 small incisions on your abdomen (tummy). So far, studies have not shown any difference for successful repair of the prolapse between the two techniques. `,
    `However, there is evidence that the laparoscopic (keyhole) operation may results in less blood loss, fewer wound infections and a shorter hospital stay. The decision about the way in which the surgery is performed depends on a number of factors that your surgeon will discuss with you. Sacrocolpopexy (March 2022) 5 • The vagina is suspended by stitching one end of a strip of synthetic mesh to the top of the vagina with the other end being stitched or stapled (titanium staples) to a prominent part of the sacrum (the sacral promontory). • The mesh remains permanently in the body. • A urinary catheter is often left in place, usually overnight. `,
  ],
  Hysteropexy: [
    `A sacrohysteropexy is an operation to suspend a prolapsed (dropped) uterus (womb) using a strip of synthetic mesh to lift the uterus and hold it in place.`,
    `The operation is done under general anaesthetic. A general anaesthetic will mean you will be asleep during the entire procedure. • The operation of sacrohysteropexy can be done through an open operation or laparoscopically (keyhole). The open operation is done through a horizontal or bikini-line incision in your lower abdomen (tummy) and for a laparoscopic operation there are 3-4 small incisions on your abdomen (tummy). So far, studies have not shown any difference for successful repair of the prolapse between the two Sacrohysteropexy (January 2021) 5 techniques. However, there is evidence that the laparoscopic (keyhole) operation may results in less blood loss, fewer wound infections and a shorter hospital stay. `,
    `The decision about the way in which the surgery is performed depends on a number of factors that your surgeon will discuss with you. • The uterus is suspended by stitching one end of a strip of synthetic mesh to the back of the uterus or around the lower part of the uterus with the other end being stitched or stapled (titanium staples) to a prominent part of the sacrum (the sacral promontory). • The mesh remains permanently in the body. • A urinary catheter is often left in place, usually overnight.`,
  ],
  TVT: [
    `This operation involves placing a piece of synthetic mesh material, like a sling, under your urethra to support it.`,
    `This is a relatively short operation and many patients go home the same day. You will be given a general, spinal or local anaesthetic and/or sedation. The type of anaesthesia will be discussed by your anaesthetist/surgeon and depends on the nature of your surgery, your health as well as your wishes. • A synthetic mesh tape is inserted through a small (1-2 cm) cut in the vagina, to support the urethra (see table). The surgeon then makes 2 smaller cuts just above the pubic area (during a retropubic procedure) or on the inside of both thighs (during a transobturator procedure) and passes the synthetic mesh tape through them. The single-incision* short mesh sling procedure is similar to the transobturator tape but there are no cuts outside the vagina. This procedure uses plastic anchors that can be very difficult to remove and should be used only within a research setting. All mesh tapes are meant to remain in place permanently, i.e. remain inside the body for life. ● A cystoscopy (telescopic examination of the bladder) will be performed.`,
  ],
  'Bulking agent': [
    `Urethral bulking involves the injection of a substance into the walls of the urethra (tube from your bladder through which your bladder empties) at 3 or 4 different sites around the urethra to improve the seal and prevent leakage of urine.`,
    `The procedure can be done under local anaesthetic or general anaesthetic. A general anaesthetic will mean you will be asleep during the entire procedure. • The procedure may be performed in an operating theatre or a treatment room within an outpatient department. • A telescopic camera examination of your bladder and urethra is carried out initially. • The bulking agent is injected into the tissues around the urethra either through the telescope or alongside the telescope.`,
  ],
};
