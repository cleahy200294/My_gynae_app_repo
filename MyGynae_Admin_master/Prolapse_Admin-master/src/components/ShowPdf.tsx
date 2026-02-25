import { Button, message, Modal } from 'antd';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { MedicalHistory, PastSurgeries } from '@/utils/enum';
// Use base64 images for reliable PDF rendering in production
import { bar1Base64, bar2Base64 } from '@/assets/imageBase64';
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
import { getQuestion } from '@/api/question';
import { formatAnswer } from './SurveyAnswer';
import { MailOutlined } from '@ant-design/icons';
import { sendPdf } from '@/api/pdf';
import { getQuestionnaireByParentid } from '@/api/questionnaire';

interface Iprops {
  trigger: ReactNode;
  information: any;
  title: string;
  lines: any[];
  newAnswer: any;
  pre: string;
  current: string;
  spre: string;
  scurrent: string;
  meeting: any;
  havePrevious: boolean;
}

const surgical: any = {
  1: 'Anterior repair (without mesh)',
  2: 'Posterior repair',
  3: 'Vaginal hysterectomy',
  4: 'Sacrocolpopexy',
  5: 'Hysteropexy',
  6: 'TVT',
  7: 'Bulking agent',
  8: 'Stress urinary incontinence',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: '20 40',
    fontSize: 11,
    position: 'relative',
  },
  logo1: {
    textAlign: 'right',
    fontSize: 32,
    color: '#015249',
  },
  logo2: {
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'right',
    fontSize: 18,
    color: '#015249',
  },
  subtitleBox: {
    width: '100%',
    borderBottomColor: '#015249',
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    fontSize: 14,
    paddingBottom: 4,
    marginBottom: 14,
    marginTop: 14,
    fontWeight: 'bold',
    color: '#015249',
  },
  personalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  personalBoxList: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '50%',
    paddingBottom: 8,
  },
  label1: {
    width: '40%',
    alignSelf: 'baseline',
    color: '#000',
    marginRight: '2%',
    lineHeight: 1.3,
  },
  desc1: {
    width: '58%',
    color: '#706767',
    lineHeight: 1.3,
    textAlign: 'justify',
  },
  medicalBox: {
    width: '100%',
  },
  medicalBoxList: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingBottom: 8,
  },
  label2: {
    width: '25%',
    alignSelf: 'baseline',
    color: '#000',
    marginRight: '2%',
    lineHeight: 1.3,
  },
  desc2: {
    width: '73%',
    color: '#706767',
    lineHeight: 1.3,
    textAlign: 'justify',
  },
  plotBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  plotBoxList: {
    width: '45%',
    margin: 'auto',
  },
  img1: {
    width: '100%',
  },
  img: {
    width: '90%',
  },
  lineTextBox: {
    marginTop: 6,
    marginBottom: 20,
    padding: '6 12',
    backgroundColor: '#005249',
    borderRadius: 3,
    color: '#fff',
    textAlign: 'justify',
    fontSize: 10,
    lineHeight: 1.5,
  },
  currentBox: {
    width: '100%',
  },
  currentBoxList: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingBottom: 8,
    position: 'relative',
  },
  questionSection: {
    paddingBottom: 8,
  },
  question: {
    color: '#000',
    alignSelf: 'baseline',
    paddingBottom: 8,
  },
  answer: {
    paddingLeft: '16px',
  },
  label3: {
    width: '28%',
    alignSelf: 'baseline',
    color: '#000',
    marginRight: '2%',
    lineHeight: 1.3,
  },
  label6: {
    width: '28%',
    alignSelf: 'baseline',
    color: '#000',
    marginRight: '2%',
    lineHeight: 1.3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  desc3: {
    width: '70%',
    color: '#706767',
    lineHeight: 1.3,
    textAlign: 'justify',
  },
  desc6: {
    width: '69%',
    color: '#706767',
    lineHeight: 1.3,
    textAlign: 'justify',
    marginLeft: '31%',
    marginTop: 8,
  },
  questionTitle: {
    color: '#015249',
    alignSelf: 'baseline',
    paddingBottom: 8,
  },
  clinicalBox: {
    width: '100%',
  },
  clinicalBoxList: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingBottom: 8,
  },
  label4: {
    width: '13%',
    alignSelf: 'baseline',
    color: '#000',
    marginRight: '2%',
    lineHeight: 1.3,
  },
  desc4: {
    width: '85%',
    color: '#706767',
    lineHeight: 1.3,
    textAlign: 'justify',
  },
  sameRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '85%',
    flexWrap: 'wrap',
    margin: 'auto',
  },
  imgBox: {
    width: '45%',
  },
  img2: {
    width: '100%',
  },
  imgtext: {
    width: '100%',
    textAlign: 'center',
    paddingTop: 8,
    color: '#015249',
  },
  treatmentBox: {
    width: '100%',
  },
  treatmentBoxList: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingBottom: 8,
  },
  label5: {
    width: '13%',
    alignSelf: 'baseline',
    color: '#000',
    marginRight: '2%',
    lineHeight: 1.3,
  },
  desc5: {
    width: '85%',
    color: '#706767',
    lineHeight: 1.3,
  },
  prescriptionBox: {
    width: '50%',
    marginLeft: '25%',
    padding: 12,
    borderColor: '#111',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  prescriptionBoxList: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    padding: 4,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#666',
    marginTop: 8,
    marginBottom: 8,
  },
  label7: {
    width: '60%',
    alignSelf: 'baseline',
    color: '#000',
    marginRight: '2%',
    lineHeight: 1.3,
    fontSize: 13,
  },
  desc7: {
    width: '40%',
    textAlign: 'right',
    color: '#706767',
    lineHeight: 1.3,
  },
  label8: {
    width: '50%',
    alignSelf: 'baseline',
    color: '#000',
    marginRight: '2%',
    lineHeight: 1.3,
  },
  desc8: {
    width: '50%',
    textAlign: 'right',
    color: '#706767',
    lineHeight: 1.3,
  },
  desc9: {
    width: '50%',
    textAlign: 'right',
    color: '#000',
    lineHeight: 1.3,
    fontSize: 13,
  },
});

const ShowPdf: FC<Iprops> = (props) => {
  const {
    trigger,
    information,
    title,
    lines,
    newAnswer,
    pre,
    current,
    spre,
    scurrent,
    meeting,
    havePrevious,
  } = props;

  useEffect(() => {
    var questionnaireID = meeting.questionnaires.split(',')[0];
    fetchQuestion(questionnaireID);
    fetchChildren(questionnaireID);
    setQuestionnaireID(questionnaireID);
  }, []);

  const [children, setChildren] = useState<any[]>([]);
  const [childrenQuestions, setChildrenQuestions] = useState<any>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionnaireID, setQuestionnaireID] = useState<any>();

  const fetchQuestion = async (id: number) => {
    const result = await getQuestion(id);
    if (!result.error) {
      setQuestions(result);
    }
  };

  const fetchChildren = async (id: number) => {
    const result = await getQuestionnaireByParentid(id);
    if (!result.error) {
      setChildren(result);
      setChildrenQuestions([]);
      result.forEach(async (item: any) => {
        const result = await getQuestion(item.ID);
        if (!result.error) {
          childrenQuestions[item.ID] = result;
          setChildrenQuestions({ ...childrenQuestions });
        }
      });
    }
  };

  const [visible, setVisible] = useState(false);

  const [line1, line2, line3, line4] = useMemo(() => {
    return [
      lines[0].current.getChart().toDataURL(),
      lines[1].current.getChart().toDataURL(),
      lines[2].current.getChart().toDataURL(),
      lines[3].current.getChart().toDataURL(),
    ];
  }, [lines]);

  const meeting_name = () => {
    let label;
    if (newAnswer.purpose == 1) {
      label = 'First Meeting';
    } else {
      label = 'Follow Up Meeting';
    }
    return (
      label + ' | ' + moment(newAnswer.CreatedAt).format('yyyy-MM-DD HH:mm:ss')
    );
  };

  const prescription = useMemo(() => {
    return newAnswer.prescription ? JSON.parse(newAnswer.prescription) : null;
  }, [newAnswer]);

  const document = (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.logo1}>MyGynae</Text>
          <Text style={styles.logo2}>Professor Barry O Reilly</Text>
          <Text style={styles.subtitleBox}>Personal Information</Text>
          <View style={styles.personalBox}>
            <View style={styles.personalBoxList}>
              <Text style={styles.label1}>First Name</Text>
              <Text style={styles.desc1}>{information.firstname}</Text>
            </View>
            <View style={styles.personalBoxList}>
              <Text style={styles.label1}>Surname</Text>
              <Text style={styles.desc1}>{information.surname}</Text>
            </View>
            <View style={styles.personalBoxList}>
              <Text style={styles.label1}>Email</Text>
              <Text style={styles.desc1}>{information.email || '-'}</Text>
            </View>
            <View style={styles.personalBoxList}>
              <Text style={styles.label1}>Phone</Text>
              <Text style={styles.desc1}>{information.phone || '-'}</Text>
            </View>
            <View style={styles.personalBoxList}>
              <Text style={styles.label1}>Date of Birth</Text>
              <Text style={styles.desc1}>
                {moment(information.birthday).format('yyyy-MM-DD')}
              </Text>
            </View>
            <View style={styles.personalBoxList}>
              <Text style={styles.label1}>Age</Text>
              <Text style={styles.desc1}>
                {(() => {
                  let duration =
                    moment(information.birthday).toNow(true) + ' old';
                  return duration;
                })()}
              </Text>
            </View>
            <View style={styles.personalBoxList}>
              <Text style={styles.label1}>BMI</Text>
              <Text style={styles.desc1}>
                {(() => {
                  let bmi =
                    information.weight / Math.pow(information.height / 100, 2);
                  return parseFloat(bmi.toFixed(2));
                })()}
              </Text>
            </View>
            <View style={styles.personalBoxList}>
              <View style={styles.label1}>
                <Text>Mode of Delivery</Text>
              </View>
              <View style={styles.desc1}>
                <Text>
                  {information.children?.length
                    ? information.children
                        .map(
                          (item: any, index: number) =>
                            index +
                            1 +
                            '. ' +
                            (item.section == 'Vaginal Delivery' ? 'VD' : 'CS'),
                        )
                        .join('  ')
                    : 'None'}
                </Text>
              </View>
            </View>
            <View style={styles.personalBoxList}>
              <Text style={styles.label1}>Maximal Birth Weight</Text>
              <Text style={styles.desc1}>
                {information.birthWeight
                  ? information.birthWeight + ' KG'
                  : '-'}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitleBox}>Medical Information</Text>
          <View style={styles.medicalBox}>
            <View style={styles.medicalBoxList}>
              <Text style={styles.label2}>Main Complaint</Text>
              <Text style={styles.desc2}>
                {information.complaint || 'None'}
              </Text>
            </View>
            <View style={styles.medicalBoxList}>
              <Text style={styles.label2}>Medical History</Text>
              <Text style={styles.desc2}>
                {(() => {
                  var result: any = [];
                  if (information.medicalhistory) {
                    var mhs = information.medicalhistory.map(
                      (item: string) => +item,
                    );
                    mhs.sort((a: number, b: number) => a - b);
                    result = mhs.map(
                      (item: string, index: number) =>
                        `${index + 1 + '. ' + MedicalHistory[item]} ${
                          item == '11'
                            ? ': ' + information.medicalhistoryother
                            : ''
                        }  `,
                    );
                  }
                  return result.length ? result : 'None';
                })()}
              </Text>
            </View>
            <View style={styles.medicalBoxList}>
              <Text style={styles.label2}>Past Surgeries</Text>
              <Text style={styles.desc2}>
                {information.pastsurgery || 'None'}
              </Text>
            </View>
            <View style={styles.medicalBoxList}>
              <Text style={styles.label2}>Past Gynecology Surgeries</Text>
              <Text style={styles.desc2}>
                {(() => {
                  var result: any = [];
                  if (information.pastgynecologysurgery) {
                    var pss = information.pastgynecologysurgery.map(
                      (item: string) => +item,
                    );
                    pss.sort((a: number, b: number) => a - b);
                    result = pss.map(
                      (item: string, index: number) =>
                        `${index + 1 + '. ' + PastSurgeries[item]} ${
                          item == '4'
                            ? ': ' + information.pastgynecologysurgeryother
                            : ''
                        }  `,
                    );
                  }
                  return result.length ? result : 'None';
                })()}
              </Text>
            </View>
            <View style={styles.medicalBoxList}>
              <Text style={styles.label2}>Current Medication</Text>
              <Text style={styles.desc2}>
                {information.currentmedication || 'None'}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitleBox}>
            Pelvic Floor Questionnaire Scores Plots
          </Text>
          <Image src={bar1Base64} style={styles.img1} />
          <Image src={bar2Base64} style={styles.img1} />
          <View style={styles.plotBox}>
            <View style={styles.plotBoxList}>
              <Image style={styles.img} src={line4} />
              <Text style={styles.lineTextBox}>
                PGI-I: 1-7 points. PGI-S: 1-4 points. PGI-C: 1-7 points. The
                lower the better.
              </Text>
            </View>
            <View style={styles.plotBoxList}>
              <Image style={styles.img} src={line1} />
              <Text style={styles.lineTextBox}>
                Symptom severity score: 0(best) - 30(worst). Other domain
                scores: 0(best) - 100(worst).
              </Text>
            </View>
            <View style={styles.plotBoxList}>
              <Image style={styles.img} src={line2} />
              <Text style={styles.lineTextBox}>
                PISQ: 0-48 points. The higher the better.
              </Text>
            </View>
            <View style={styles.plotBoxList}>
              <Image style={styles.img} src={line3} />
              <Text style={styles.lineTextBox}>
                ICIQ-UI: 1-5 (slight), 6-12 (moderate), 13-18 (severe) and 19-21
                (very severe).
              </Text>
            </View>
          </View>
          <Text style={styles.subtitleBox}>Current Meeting</Text>
          <View style={styles.currentBox}>
            <View style={styles.currentBoxList}>
              <Text style={styles.label3}>Purpose of Visiting</Text>
              <Text style={styles.desc3}>{meeting.name}</Text>
            </View>
            <View style={styles.currentBoxList}>
              <Text style={styles.label3}>Comments</Text>
              <Text style={styles.desc3}>{newAnswer.remark1 || 'None'}</Text>
            </View>
            <View style={styles.currentBoxList}>
              <View style={styles.label6}>
                <Text>Current Post Operative Status</Text>
              </View>
              <View style={styles.desc6}>
                {questions
                  ? answerList(
                      questionnaireID,
                      questions,
                      JSON.parse(newAnswer.answer),
                    )
                  : null}
                {children.map((item) => (
                  <View key={item.ID}>
                    <Text style={styles.questionTitle}>{item.name}</Text>
                    {childrenQuestions[item.ID]
                      ? answerList(
                          item.ID,
                          childrenQuestions[item.ID],
                          JSON.parse(newAnswer.answer),
                        )
                      : null}
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.subtitleBox}>Clinical Examination</Text>
          <View style={styles.clinicalBox}>
            <View style={styles.clinicalBoxList}>
              <Text style={styles.label4}>Meeting</Text>
              <Text style={styles.desc4}>{meeting_name()}</Text>
            </View>
            <View style={styles.clinicalBoxList}>
              <Text style={styles.label4}>Uterus</Text>
              <Text style={styles.desc4}>
                {newAnswer.uterus == '1'
                  ? 'With Uterus'
                  : newAnswer.uterus == '2'
                  ? 'Without Uterus'
                  : '-'}
              </Text>
            </View>
            <View style={styles.clinicalBoxList}>
              <Text style={styles.label4}>Comments</Text>
              <Text style={styles.desc4}>{newAnswer.remark2 || 'None'}</Text>
            </View>
            <View style={styles.clinicalBoxList}>
              <Text style={styles.label4}>POP-Q</Text>
              <Text style={styles.desc4}>
                {`${newAnswer.popq1 || '-'}${newAnswer.popq2 || '-'}${
                  newAnswer.popq3 || '-'
                } / ${newAnswer.popq4 || '-'}${newAnswer.popq5 || '-'}${
                  newAnswer.popq6 || '-'
                }`}
              </Text>
            </View>
            <View style={styles.sameRow}>
              <View style={styles.imgBox}>
                <Image style={styles.img2} src={pre} />
                <Text style={styles.imgtext}>
                  {havePrevious ? 'Previous' : 'Normal'}
                </Text>
              </View>
              <View style={styles.imgBox}>
                <Image style={styles.img2} src={current} />
                <Text style={styles.imgtext}>Current</Text>
              </View>
            </View>
          </View>
          <Text style={styles.subtitleBox}>Treatment Plan</Text>
          <View style={styles.treatmentBox}>
            <View style={styles.treatmentBoxList}>
              <Text style={styles.label5}>Meeting</Text>
              <Text style={styles.desc5}>{meeting_name()}</Text>
            </View>
            <View style={styles.treatmentBoxList}>
              <Text style={styles.label5}>Surgical Option</Text>
              <Text style={styles.desc5}>
                {surgical[newAnswer.surgical] || 'None'}
              </Text>
            </View>
            <View style={styles.treatmentBoxList}>
              <Text style={styles.label5}>Comments</Text>
              <Text style={styles.desc5}>{newAnswer.remark3 || 'None'}</Text>
            </View>
            <View style={styles.sameRow}>
              <View style={styles.imgBox}>
                <Image style={styles.img2} src={spre} />
                <Text style={styles.imgtext}>Before</Text>
              </View>
              <View style={styles.imgBox}>
                <Image style={styles.img2} src={scurrent} />
                <Text style={styles.imgtext}>After</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        {prescription ? (
          <>
            <Text style={styles.subtitleBox}>Prescription</Text>
            <View style={styles.prescriptionBox}>
              <View style={styles.prescriptionBoxList}>
                <Text style={styles.label7}>MyGynae</Text>
                <Text style={styles.desc7}>
                  {moment().format('DD/MM/yyyy')}
                </Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.prescriptionBoxList}>
                <Text style={styles.label8}>Patient Name</Text>
                <Text style={styles.desc8}>
                  {information.firstname} {information.surname}
                </Text>
              </View>
              <View style={styles.prescriptionBoxList}>
                <Text style={styles.label8}>Px</Text>
                <Text style={styles.desc8}>{prescription.content}</Text>
              </View>
              <View style={styles.prescriptionBoxList}>
                <Text style={styles.label8}>Dosage</Text>
                <Text style={styles.desc8}>
                  {prescription.dosage} x {prescription.frequency} /{' '}
                  {prescription.frequencyunit}
                </Text>
              </View>
              <View style={styles.prescriptionBoxList}>
                <Text style={styles.label8}>For</Text>
                <Text style={styles.desc8}>
                  {prescription.duration} {prescription.durationunit}
                </Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.prescriptionBoxList}>
                <Text style={styles.label8}></Text>
                <Text style={styles.desc9}>Professor Barry O Reilly</Text>
              </View>
            </View>
          </>
        ) : null}
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
            {title}
            <Button
              style={{ marginLeft: '16px' }}
              type="primary"
              icon={<MailOutlined />}
              onClick={async () => {
                if (pdf.blob) {
                  const result = await sendPdf({
                    email: information.email,
                    subject: title,
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
        <PDFViewer
          style={{
            width: '100%',
            height: '500px',
          }}
        >
          {document}
        </PDFViewer>
      </Modal>
    </>
  );
};

export default ShowPdf;

const answerList = (questionnaireID: any, questions: any[], answers: any) => {
  const answer = answers[questionnaireID];
  const indexMap = (() => {
    const cloneQuestions = [...questions];
    const indexM: any = {};
    cloneQuestions
      .filter((item) => item.visible == 0)
      .forEach((item, index) => {
        indexM[item.ID] = index + 1;
      });
    return indexM;
  })();
  return questions.map((item) =>
    answer[item.ID] ? (
      item.visible == 1 ? (
        <View style={styles.questionSection} key={item.ID}>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>
            {formatAnswer(answer[item.ID], answer[`${item.ID}-extra`])}
          </Text>
        </View>
      ) : (
        <View style={styles.questionSection} key={item.ID}>
          <Text style={styles.question}>
            {indexMap[item.ID]}. {item.question}
          </Text>
          <Text style={styles.answer}>
            {formatAnswer(answer[item.ID], answer[`${item.ID}-extra`])}
          </Text>
        </View>
      )
    ) : null,
  );
};
