import {
  getAnswerList,
  getOperativeNotes,
  getPatientInfo,
  OperativeNote,
  savePatientInfo,
} from '@/api/patient';
import { changeAnswer } from '@/api/question';
import { getQuestionnaire } from '@/api/questionnaire';
import SurveyAnswer from '@/components/SurveyAnswer';
import { MedicalHistory, PastSurgeries } from '@/utils/enum';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Result,
  Row,
  Select,
  Space,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'umi';
import {
  EditOutlined,
  FileAddOutlined,
  FilePdfFilled,
  FilePdfOutlined,
  FileProtectOutlined,
  MinusCircleOutlined,
  PlayCircleFilled,
  PlusOutlined,
  SaveOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import styles from './index.less';
import ShowPdf from '@/components/ShowPdf';
import { invalidTime } from '@/utils/util';
import POPQSelectList from './components/POPQSelectList';
import CustomLinePlot from './components/CustomLinePlot';
import ConsentForm from './components/consentform/ConsentForm';
import { getMeeting } from '@/api/meeting';
import ConsentPdf from '@/components/ConsentPdf';
import OperativeNoteModal from './components/OperativeNoteModal';
import OperativeNoteDetailsModal from './components/OperativeNoteDetailsModal';
const { Panel } = Collapse;
const { Option } = Select;

const surgicalList = [
  'None',
  'Anterior repair (without mesh)',
  'Posterior repair',
  'Vaginal hysterectomy',
  'Sacrocolpopexy',
  'Hysteropexy',
  'TVT',
  'Bulking agent',
];

const Ethnic: any = [
  { value: 1, label: 'Asian' },
  { value: 2, label: 'African' },
  { value: 3, label: 'European' },
  { value: 4, label: 'Latin' },
  { value: 5, label: 'North' },
  { value: 6, label: 'Oceanian' },
  { value: 7, label: 'Mix' },
  { value: 8, label: 'Other' },
];

type AnswerList = {
  ID: number;
  accountid: number;
  answer: string;
  popq: number[];
  uterus: number;
  purpose: number;
};

const Patient: React.FC = (props) => {
  const [uterus, setUterus] = useState<number>();
  const [animQuery, setAnimQuery] = useState<string[]>([]);
  const [uterusQuery, setUterusQuery] = useState<number>();
  const [getImageUrl, setGetImageUrl] = useState('');
  const [getSImageUrl, setGetSImageUrl] = useState('');
  const [havePrevious, setHavePrevious] = useState(false);
  const [surgical, setSurgical] = useState('');
  const { id } = useParams<{ id: string }>();
  const [patientInfo, setPatientInfo] = useState<any>({});
  const [questionnaireMap, setQuestionnaireMap] = useState<any>({});
  const actionRef = useRef<ActionType>();
  const [answerDetail, setAnswerDetail] = useState<any>(null);
  const [ifCurrentAnswerDetail, setIfCurrentAnswerDetail] = useState(true);
  const [answerList, setAnswerList] = useState<any[]>([]);
  const [popIndex, setPopIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState('');
  const [preImage, setPreImage] = useState('');
  const [scurrentImage, setSCurrentImage] = useState('');
  const [spreImage, setSPreImage] = useState('');
  const [purpose, setPurpose] = useState<number>(1);
  const [isEditPersonalInformation, setIsEditPersonalInformation] =
    useState(false);
  const [isEditMedicalInformation, setIsEditMedicalInformation] =
    useState(false);
  const [MHOther, setMHOther] = useState('');
  const [PSOther, setPSOther] = useState('');
  const [selectSurgical, setSelectSurgical] = useState(0);
  const [selectPopq, setSelectPopq] = useState<any[]>([]);
  const [consentData, setConsentData] = useState<any>();
  const [meeting, setMeeting] = useState<any>();
  const [operativeNotes, setOperativeNotes] = useState<OperativeNote[]>([]);
  const [selectedOperativeNote, setSelectedOperativeNote] = useState<OperativeNote | null>(null);
  const onAnswerDrawerChange = () => {
    actionRef.current?.reload();
    setAnswerDetail(null);
    setIfCurrentAnswerDetail(false);
  };
  const [consentSubmit, setConsentSubmit] = useState(false);
  useEffect(() => {
    consentSubmit && consentData && form_treatment.submit();
    setConsentSubmit(true);
  }, [consentData]);
  const hasOperativeNote = (answerId: number) => {
    return operativeNotes.some((note) => note.answerId === answerId);
  };

  const columns: ProColumns<AnswerList>[] = [
    {
      title: 'ID',
      dataIndex: 'ID',
      width: 48,
      align: 'center',
    },
    {
      title: 'Purpose',
      dataIndex: 'questionnaireids',
      render: (_, record) => {
        return meeting?.[record.purpose]?.name ?? '-';
      },
    },
    {
      title: 'Submitted Time',
      dataIndex: 'CreatedAt',
      align: 'center',
      render: (text: any) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: 'POP-Q',
      dataIndex: 'popq',
      render: (_, record, index) => (
        <Space>
          <span>{`${record.popq[0] || '-'}${record.popq[1] || '-'}${
            record.popq[2] || '-'
          } / ${record.uterus === 2 ? '-' : record.popq[3] || '-'}${
            record.popq[4] || '-'
          }${record.popq[5] || '-'}`}</span>
          {+record.popq[0] ||
          +record.popq[1] ||
          +record.popq[2] ||
          +record.popq[3] ||
          +record.popq[4] ||
          +record.popq[5] ? (
            <PlayCircleFilled
              onClick={() => {
                if (!record.uterus) {
                  message.error(
                    'Please enter whether the patient have an uterus!',
                  );
                  return;
                }
                setUterusQuery(record.uterus);
                var last = findLast(index);
                if (last) {
                  setAnimQuery([
                    `pl=${+(last.popq[0] || 0)}&pabc=${+(
                      last.popq[1] || 0
                    )}${Math.max(
                      +(last.popq[2] || 0),
                      +(last.popq[3] || 0),
                    )}${+(last.popq[4] || 0)}&pr=${+(last.popq[5] || 0)}`,
                    `l=${+(record.popq[0] || 0)}&abc=${+(record.popq[1] || 0)}${
                      record.uterus === 2
                        ? +(record.popq[2] || 0)
                        : Math.max(
                            +(record.popq[2] || 0),
                            +(record.popq[3] || 0),
                          )
                    }${+(record.popq[4] || 0)}&r=${+(record.popq[5] || 0)}`,
                  ]);
                } else {
                  setAnimQuery([
                    '',
                    `l=${+(record.popq[0] || 0)}&abc=${+(record.popq[1] || 0)}${
                      record.uterus === 2
                        ? +(record.popq[2] || 0)
                        : Math.max(
                            +(record.popq[2] || 0),
                            +(record.popq[3] || 0),
                          )
                    }${+(record.popq[4] || 0)}&r=${+(record.popq[5] || 0)}`,
                  ]);
                }
              }}
            />
          ) : null}
        </Space>
      ),
    },
    {
      title: 'Uterus',
      dataIndex: 'uterus',
      valueEnum: {
        0: { text: '-' },
        1: { text: 'With uterus' },
        2: { text: 'Without uterus' },
      },
    },
    {
      title: 'Surgical Option',
      dataIndex: 'surgical',
      valueEnum: {
        0: { text: '-' },
        1: { text: 'Anterior repair (without mesh)' },
        2: { text: 'Posterior repair' },
        3: { text: 'Vaginal hysterectomy' },
        4: { text: 'Sacrocolpopexy' },
        5: { text: 'Hysteropexy' },
        6: { text: 'TVT' },
        7: { text: 'Bulking agent' },
      },
      render: (text: any, record: any) => (
        <Space>
          <span>{text}</span>
          {(() => {
            var p = text.props;
            var t = p.valueEnum[p.text].text;
            return t !== '-' ? (
              <PlayCircleFilled
                onClick={() => {
                  setSurgical(t.split(' ')[0]);
                }}
              />
            ) : null;
          })()}
          {hasOperativeNote(record.ID) && (
            <Tooltip title="Operative note available">
              <FileProtectOutlined style={{ color: 'red' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Comments',
      dataIndex: 'remark3',
    },
    {
      title: 'Operation',
      valueType: 'option',
      align: 'center',
      fixed: 'right',
      render: (_, record, index) => {
        return [
          <a
            key="view"
            onClick={() => {
              setIfCurrentAnswerDetail(false);
              setAnswerDetail(record);
            }}
          >
            Details
          </a>,
        ];
      },
    },
  ];
  useEffect(() => {
    if (answerList.length) {
      answerList[answerList.length - 1].purpose
        ? setPurpose(answerList[answerList.length - 1].purpose)
        : null;
      var record = answerList[answerList.length - 1];
      var last = findLast(0);
      var animQ;
      setHavePrevious(!!last);
      if (last) {
        animQ = `pl=${+(last.popq[0] || 0)}&pabc=${+(
          last.popq[1] || 0
        )}${Math.max(+(last.popq[2] || 0), +(last.popq[3] || 0))}${+(
          last.popq[4] || 0
        )}&pr=${+(last.popq[5] || 0)}&l=${+(record.popq[0] || 0)}&abc=${+(
          record.popq[1] || 0
        )}${
          record.uterus === 2
            ? +(record.popq[2] || 0)
            : Math.max(+(record.popq[2] || 0), +(record.popq[3] || 0))
        }${+(record.popq[4] || 0)}&r=${+(record.popq[5] || 0)}`;
      } else {
        animQ = `l=${+(record.popq[0] || 0)}&abc=${+(record.popq[1] || 0)}${
          record.uterus === 2
            ? +(record.popq[2] || 0)
            : Math.max(+(record.popq[2] || 0), +(record.popq[3] || 0))
        }${+(record.popq[4] || 0)}&r=${+(record.popq[5] || 0)}`;
      }
      setGetImageUrl(
        `/prolapse-${
          record.uterus === 2 ? 'n' : 'w'
        }u/?${animQ}&shot=true`,
      );
      setGetSImageUrl(
        `/prolapse-tm/?ani=${
          surgicalList[record.surgical].split(' ')[0]
        }&shot=true`,
      );
    }
  }, [answerList]);

  useEffect(() => {
    if (getImageUrl) {
      setCurrentImage('');
      setPreImage('');
    }
  }, [getImageUrl]);

  useEffect(() => {
    if (getSImageUrl) {
      setSCurrentImage('');
      setSPreImage('');
    }
  }, [getSImageUrl]);

  const findLast = (index: number) => {
    var al = [...answerList].reverse();
    if (index === al.length - 1) {
      return null;
    }
    for (var i = index + 1; i < al.length; i++) {
      var record = al[i];
      if (
        +record.popq1 ||
        +record.popq2 ||
        +record.popq3 ||
        +record.popq4 ||
        +record.popq5 ||
        +record.popq6
      ) {
        return record;
      }
    }
    return null;
  };

  const fetchPatientInfo = async () => {
    try {
      const result = await getPatientInfo(id);
      if (!result.error) {
        var formInfo = { ...result };
        formInfo.bmi = parseFloat(
          (formInfo.weight / Math.pow(formInfo.height / 100, 2)).toFixed(2),
        );
        if (invalidTime(formInfo.birthday)) {
          delete formInfo.birthday;
        } else {
          formInfo.birthday = moment(formInfo.birthday);
          formInfo.age = moment(formInfo.birthday).toNow(true) + ' old';
        }
        if (formInfo.children) {
          formInfo.children = JSON.parse(result.children);
        } else {
          formInfo.children = [];
        }
        if (formInfo.pastgynecologysurgery) {
          formInfo.pastgynecologysurgery =
            formInfo.pastgynecologysurgery.split(',');
        }
        if (formInfo.medicalhistory) {
          formInfo.medicalhistory = formInfo.medicalhistory.split(',');
        }
        form_personal.setFieldsValue(formInfo);
        form_medical.setFieldsValue(formInfo);
        setPatientInfo(formInfo);
        setMHOther(formInfo.medicalhistoryother);
        setPSOther(formInfo.pastgynecologysurgeryother);
      }
    } catch (error) {
      message.error('Failed to load patient information');
      console.error('Error fetching patient info:', error);
    }
  };
  const fetchQuestionnaire = async () => {
    try {
      const result = await getQuestionnaire();
      if (!result.error) {
        var results: any = {};
        result.forEach((element: any) => {
          results[element.ID] = element;
        });
        setQuestionnaireMap(results);
      }
    } catch (error) {
      message.error('Failed to load questionnaire data');
      console.error('Error fetching questionnaire:', error);
    }
  };
  const fetchMeeting = async () => {
    try {
      const result = await getMeeting();
      if (!result.error) {
        var resultObj = {} as any;
        result.forEach((item: any) => {
          resultObj[item.ID] = item;
        });
        setMeeting(resultObj);
      }
    } catch (error) {
      message.error('Failed to load meeting data');
      console.error('Error fetching meeting:', error);
    }
  };

  const fetchOperativeNotes = async () => {
    try {
      const result = await getOperativeNotes(parseInt(id));
      if (!result.error) {
        setOperativeNotes(result);
      }
    } catch (error) {
      message.error('Failed to load operative notes');
      console.error('Error fetching operative notes:', error);
    }
  };

  useEffect(() => {
    fetchPatientInfo();
    fetchQuestionnaire();
    fetchMeeting();
    fetchOperativeNotes();
  }, []);

  useEffect(() => {
    patientInfo && questionnaireMap && actionRef.current?.reload();
  }, [patientInfo, questionnaireMap]);

  const resizeBox = () => {
    const boxs = document.querySelectorAll('.cardbox') as any;
    boxs.forEach((box: HTMLDivElement) => {
      box.style.height = box.clientWidth * 0.72 + 'px';
    });
  };

  const receiveMessageFromIndex = (event: any) => {
    // Accept messages from any origin (we control all the code)
    if (typeof event.data !== 'string' || !event.data.includes('|==|')) return;
    var [data, name] = event.data.split('|==|');
    if (name === 'current') {
      setCurrentImage('data:image/png;base64,' + data);
    }
    if (name === 'pre') {
      setPreImage('data:image/png;base64,' + data);
    }
    if (name === 'scurrent') {
      setSCurrentImage('data:image/png;base64,' + data);
    }
    if (name === 'spre') {
      setSPreImage('data:image/png;base64,' + data);
    }
  };

  useEffect(() => {
    resizeBox();
    window.addEventListener('resize', resizeBox);
    window.addEventListener('message', receiveMessageFromIndex, false);
    return () => {
      window.removeEventListener('resize', resizeBox);
      window.removeEventListener('message', receiveMessageFromIndex, false);
    };
  }, []);

  const line1 = useRef();
  const line2 = useRef();
  const line3 = useRef();
  const line4 = useRef();

  const [form_clinical] = useForm();
  const [form_treatment] = useForm();
  const [form_personal] = useForm();
  const [form_medical] = useForm();
  const [form_prescription] = useForm();
  const [form_current] = useForm();
  const [currentRow, setCurrentRow] = useState<any>(null);

  const operativeNoteColumns: ProColumns<OperativeNote>[] = [
    {
      title: 'Surgery Date',
      dataIndex: 'surgeryDate',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => moment(a.surgeryDate).unix() - moment(b.surgeryDate).unix(),
    },
    {
      title: 'Procedure',
      dataIndex: 'procedureType',
      render: (text: number) => surgicalList[text] || '-',
    },
    {
      title: 'Surgeon',
      dataIndex: 'surgeonName',
    },
    {
      title: 'Device S/N',
      dataIndex: 'deviceSerialNumber',
      render: (text: string) => text || '-',
    },
    {
      title: 'Complications',
      dataIndex: 'complications',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: 'Uploaded',
      dataIndex: 'createdAt',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="view"
          onClick={() => window.open(`https://cs1.ucc.ie/~ym5/prolapse/${record.filePath}`)}
        >
          View PDF
        </a>,
        <OperativeNoteDetailsModal
          key="details"
          operativeNote={record}
          trigger={<a>Details</a>}
          onUpdate={fetchOperativeNotes}
          onDelete={fetchOperativeNotes}
        />,
      ],
    },
  ];

  useEffect(() => {
    if (currentRow) {
      setConsentData(
        currentRow.consent ? JSON.parse(currentRow.consent) : null,
      );
      setConsentSubmit(false);
    }
  }, [currentRow]);

  const [newAnswer, setNewAnswer] = useState<any>();
  function disabledDate(current: any) {
    return current && current > moment().endOf('day');
  }
  // Panel button
  const genExtraPersonalInformation = () => (
    <div>
      {!isEditPersonalInformation ? (
        <Tooltip placement="top" title="Edit" className={styles.editButton}>
          <Button
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setIsEditPersonalInformation(true);
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip placement="top" title="Save" className={styles.editButton}>
          <Button
            shape="circle"
            icon={<SaveOutlined />}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              form_personal.submit();
            }}
          />
        </Tooltip>
      )}
    </div>
  );
  const genExtraMedicalInformation = () => (
    <div>
      {!isEditMedicalInformation ? (
        <Tooltip placement="top" title="Edit" className={styles.editButton}>
          <Button
            shape="circle"
            icon={<EditOutlined />}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setIsEditMedicalInformation(true);
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip placement="top" title="Save" className={styles.editButton}>
          <Button
            shape="circle"
            icon={<SaveOutlined />}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              form_medical.submit();
            }}
          />
        </Tooltip>
      )}
    </div>
  );

  const [weightUnit, setWeightUnit] = useState('KG');
  const weightselectAfter = (
    <Select
      defaultValue="KG"
      style={{ width: 100 }}
      onChange={(value: string) => {
        setWeightUnit(value);
        const weight = form_personal.getFieldValue('weight');
        if (weight) {
          if (value === 'KG') {
            form_personal.setFieldsValue({
              weight: +(weight / 2.20462).toFixed(2),
            });
          } else if (value === 'Pound') {
            form_personal.setFieldsValue({
              weight: +(weight * 2.20462).toFixed(2),
            });
          }
        }
      }}
    >
      <Option value="KG">KG</Option>
      <Option value="Pound">Pound</Option>
    </Select>
  );
  const [birthweightUnit, setbirthWeightUnit] = useState('KG');
  const birthWeightselectAfter = (
    <Select
      defaultValue="KG"
      style={{ width: 100 }}
      onChange={(value: string) => {
        setbirthWeightUnit(value);
        const birthWeight = form_personal.getFieldValue('birthWeight');
        if (birthWeight) {
          if (value === 'KG') {
            form_personal.setFieldsValue({
              birthWeight: +(birthWeight / 2.20462).toFixed(2),
            });
          } else if (value === 'Pound') {
            form_personal.setFieldsValue({
              birthWeight: +(birthWeight * 2.20462).toFixed(2),
            });
          }
        }
      }}
    >
      <Option value="KG">KG</Option>
      <Option value="Pound">Pound</Option>
    </Select>
  );
  const saveDataDeal = (values: any) => {
    // if not changed will be delete
    Object.keys(values).forEach((index) => {
      if (values[index] == undefined) {
        delete values[index];
      }
    });
    // change birthday format
    values.birthday = values.birthday.format();
    if (values.children) {
      values.children = JSON.stringify(values.children);
    }
    // kg
    if (weightUnit == 'Pound') {
      values.weight = +(values.weight / 2.20462).toFixed(2);
    }
    if (birthweightUnit == 'Pound') {
      values.birthWeight = +(values.birthWeight / 2.20462).toFixed(2);
    }
    if (values.medicalhistory && values.medicalhistory.includes('11')) {
      values.medicalhistoryother = MHOther;
    }
    if (
      values.pastgynecologysurgery &&
      values.pastgynecologysurgery.includes('4')
    ) {
      values.pastgynecologysurgeryother = PSOther;
    }
  };

  return (
    <PageContainer
      className="detailsBox"
      title={false}
      breadcrumb={{
        routes: [
          {
            path: '/patient',
            breadcrumbName: 'Patient List',
          },
          {
            path: '/patient/details',
            breadcrumbName: patientInfo.firstname
              ? patientInfo.firstname + ' ' + patientInfo.surname
              : 'Patient Details',
          },
        ],
      }}
    >
      <Collapse
        defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
        ghost
      >
        {/* Personal Information */}
        <Panel
          header="Personal Information"
          key="1"
          className={styles.panel}
          extra={genExtraPersonalInformation()}
        >
          <Form
            form={form_personal}
            labelCol={{ xs: 24, sm: 24, md: 24, lg: 24 }}
            labelAlign="left"
            colon={false}
            onValuesChange={(values) => {
              if (values.birthday != undefined) {
                form_personal.setFieldsValue({
                  age: values.birthday.toNow(true) + ' old',
                });
              }
            }}
            onFinish={async (values) => {
              values = { ...patientInfo, ...values };
              saveDataDeal(values);
              // call api
              const result = await savePatientInfo(values);
              if (!result.error) {
                setIsEditPersonalInformation(false);
                fetchPatientInfo();
              }
            }}
          >
            <Row gutter={[16, 0]}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item
                  name="firstname"
                  label="First Name"
                  required={isEditPersonalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditPersonalInformation ? (
                    <Input></Input>
                  ) : (
                    <span>{patientInfo.firstname || '-'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item
                  name="surname"
                  label="Surname"
                  required={isEditPersonalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditPersonalInformation ? (
                    <Input></Input>
                  ) : (
                    <span>{patientInfo.surname || '-'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  required={isEditPersonalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditPersonalInformation ? (
                    <Input disabled style={{ color: '#24378f' }}></Input>
                  ) : (
                    <span>{patientInfo.email || '-'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item
                  name="phone"
                  label="Phone"
                  required={isEditPersonalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditPersonalInformation ? (
                    <Input></Input>
                  ) : (
                    <span>{patientInfo.phone || '-'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item
                  name="birthday"
                  label="Date of Birth"
                  required={isEditPersonalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditPersonalInformation ? (
                    <DatePicker
                      format={'DD/MM/YYYY'}
                      disabledDate={disabledDate}
                      style={{ width: '100%' }}
                    ></DatePicker>
                  ) : (
                    <span>
                      {patientInfo.birthday
                        ? patientInfo.birthday.format('DD/MM/YYYY')
                        : '-'}
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item
                  name="age"
                  label="Age"
                  required={isEditPersonalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditPersonalInformation ? (
                    <Input disabled style={{ color: '#24378f' }}></Input>
                  ) : (
                    <span>{patientInfo.age || '-'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item
                  name="ethnic"
                  label="Ethnic"
                  required={isEditPersonalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditPersonalInformation ? (
                    <Select options={Ethnic}></Select>
                  ) : (
                    <span>
                      {(() => {
                        var data = Ethnic.filter(
                          (item: any) => item.value == patientInfo.ethnic,
                        )[0];
                        return data ? data.label : '-';
                      })()}
                    </span>
                  )}
                </Form.Item>
              </Col>
              {isEditPersonalInformation ? (
                <>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    lg={{ span: 6 }}
                  >
                    <Form.Item
                      name="height"
                      label="Height"
                      required={isEditPersonalInformation}
                      rules={[
                        { required: true, message: 'THIS FIELD IS REQUIRED' },
                      ]}
                    >
                      {isEditPersonalInformation ? (
                        <Input type="number" suffix="CM"></Input>
                      ) : (
                        <span>
                          {patientInfo.height
                            ? patientInfo.height + ' CM'
                            : '-'}
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    lg={{ span: 6 }}
                  >
                    <Form.Item
                      name="weight"
                      label="Weight"
                      required={isEditPersonalInformation}
                      rules={[
                        { required: true, message: 'THIS FIELD IS REQUIRED' },
                      ]}
                    >
                      {isEditPersonalInformation ? (
                        <Input
                          addonAfter={weightselectAfter}
                          type="number"
                        ></Input>
                      ) : (
                        <span>
                          {patientInfo.weight
                            ? patientInfo.weight + ' KG'
                            : '-'}
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                </>
              ) : null}
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item
                  name="bmi"
                  label="BMI"
                  required={isEditPersonalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditPersonalInformation ? (
                    <Input disabled style={{ color: '#24378f' }}></Input>
                  ) : (
                    <span>{patientInfo.bmi || '-'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.List name="children">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item label="Mode of Delivery">
                        {isEditPersonalInformation ? (
                          <>
                            {fields.map((field, index) => (
                              <div
                                key={field.key}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'baseline',
                                }}
                              >
                                <Form.Item key={`childOrder${field.key}`}>
                                  <div className={styles.order}>
                                    {index + 1}
                                  </div>
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  style={{ width: '100%', marginRight: '8px' }}
                                  name={[field.name, 'section']}
                                  key={`section${field.key}`}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'THIS FIELD IS REQUIRED',
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select the way of birth"
                                    options={[
                                      { value: 'Vaginal Delivery' },
                                      { value: 'Cesarean Surgery' },
                                    ]}
                                  />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => remove(field.name)}
                                />
                              </div>
                            ))}
                            <Form.Item style={{ marginBottom: 0 }}>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Child
                              </Button>
                            </Form.Item>
                          </>
                        ) : (
                          <div>
                            {patientInfo.children?.length
                              ? patientInfo.children.map(
                                  (item: any, index: number) => (
                                    <div
                                      key={index}
                                      style={{
                                        marginRight: '1rem',
                                        display: 'inline-block',
                                      }}
                                    >
                                      {index + 1}.{' '}
                                      {item.section == 'Vaginal Delivery'
                                        ? 'VD'
                                        : 'CS'}
                                    </div>
                                  ),
                                )
                              : 'None'}
                          </div>
                        )}
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
              >
                <Form.Item name="birthWeight" label="Maximal Birth Weight">
                  {isEditPersonalInformation ? (
                    <Input
                      addonAfter={birthWeightselectAfter}
                      type="number"
                    ></Input>
                  ) : (
                    <span>
                      {patientInfo.birthWeight
                        ? patientInfo.birthWeight + ' KG'
                        : '-'}
                    </span>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        {/* Medical Information */}
        <Panel
          header="Medical Information"
          key="2"
          className={styles.panel}
          extra={genExtraMedicalInformation()}
        >
          <Form
            form={form_medical}
            labelCol={{ xs: 24, sm: 6, md: 6, lg: 6 }}
            labelAlign="left"
            colon={false}
            onValuesChange={(values) => {
              if (
                values.medicalhistory != undefined &&
                !values.medicalhistory.includes('11')
              ) {
                setMHOther('');
              }
              if (
                values.pastgynecologysurgery != undefined &&
                !values.pastgynecologysurgery.includes('4')
              ) {
                setPSOther('');
              }
            }}
            onFinish={async (values) => {
              values = { ...patientInfo, ...values };
              saveDataDeal(values);
              // call api
              const result = await savePatientInfo(values);
              if (!result.error) {
                setIsEditMedicalInformation(false);
                fetchPatientInfo();
              }
            }}
          >
            <Row gutter={[16, 0]}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <Form.Item
                  name="complaint"
                  label="Main Complaint"
                  required={isEditMedicalInformation}
                  rules={[
                    { required: true, message: 'THIS FIELD IS REQUIRED' },
                  ]}
                >
                  {isEditMedicalInformation ? (
                    <Input.TextArea />
                  ) : (
                    <span>{patientInfo.complaint || 'None'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <Form.Item name="medicalhistory" label="Medical History">
                  {isEditMedicalInformation ? (
                    <Checkbox.Group
                      style={{ width: '100%', marginTop: '10px' }}
                    >
                      <Space size={12} direction="vertical">
                        {Object.keys(MedicalHistory).map((index) =>
                          index === '11' ? (
                            <Checkbox value={index} key={index}>
                              <Input
                                size="middle"
                                placeholder="Other"
                                value={MHOther}
                                onChange={(e) =>
                                  setMHOther(e.currentTarget.value)
                                }
                              ></Input>
                            </Checkbox>
                          ) : (
                            <Checkbox value={index} key={index}>
                              {MedicalHistory[index]}
                            </Checkbox>
                          ),
                        )}
                      </Space>
                    </Checkbox.Group>
                  ) : (
                    <div>
                      {(() => {
                        var result: any = [];
                        if (patientInfo.medicalhistory) {
                          var mhs = patientInfo.medicalhistory.map(
                            (item: string) => +item,
                          );
                          mhs.sort((a: number, b: number) => a - b);
                          result = mhs.map((item: string, index: any) => (
                            <div key={item} className={styles.itemList}>
                              {index + 1 + '. ' + MedicalHistory[item]}
                              {item === '11'
                                ? ': ' + patientInfo.medicalhistoryother
                                : ''}
                            </div>
                          ));
                          return result;
                        } else {
                          return 'None';
                        }
                      })()}
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <Form.Item name="pastsurgery" label="Past Surgery">
                  {isEditMedicalInformation ? (
                    <Input.TextArea />
                  ) : (
                    <span>{patientInfo.pastsurgery || 'None'}</span>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <Form.Item
                  name="pastgynecologysurgery"
                  label="Past Gynecology Surgery"
                >
                  {isEditMedicalInformation ? (
                    <Checkbox.Group
                      style={{ width: '100%', marginTop: '10px' }}
                    >
                      <Space size={12} direction="vertical">
                        {Object.keys(PastSurgeries).map((index) =>
                          index === '4' ? (
                            <Checkbox value={index} key={index}>
                              <Input
                                size="middle"
                                placeholder="Other"
                                value={PSOther}
                                onChange={(e) =>
                                  setPSOther(e.currentTarget.value)
                                }
                              ></Input>
                            </Checkbox>
                          ) : (
                            <Checkbox value={index} key={index}>
                              {PastSurgeries[index]}
                            </Checkbox>
                          ),
                        )}
                      </Space>
                    </Checkbox.Group>
                  ) : (
                    <div>
                      {(() => {
                        var result: any = [];
                        if (patientInfo.pastgynecologysurgery) {
                          var pss = patientInfo.pastgynecologysurgery.map(
                            (item: string) => +item,
                          );
                          pss.sort((a: number, b: number) => a - b);
                          result = pss.map((item: string, index: any) => (
                            <div key={item} className={styles.itemList}>
                              {index + 1 + '. ' + PastSurgeries[item]}
                              {item === '4'
                                ? ': ' + patientInfo.pastgynecologysurgeryother
                                : ''}
                            </div>
                          ));
                          return result;
                        } else {
                          return 'None';
                        }
                      })()}
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <Form.Item name="currentmedication" label="Current Medication">
                  {isEditMedicalInformation ? (
                    <Input.TextArea />
                  ) : (
                    <pre>{patientInfo.currentmedication || 'None'}</pre>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>
        <Panel
          header="Pelvic Floor Questionnaire Scores Plots"
          key="3"
          forceRender
          className={styles.panel}
        >
          {answerList.length ? (
            <Row gutter={[4, 4]}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 6 }}
              >
                <CustomLinePlot
                  pref={line4}
                  type="pgi"
                  answerList={answerList}
                  message="PGI-I: 1-7 points. PGI-S: 1-4 points. PGI-C: 1-7 points. The lower the better."
                />
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 6 }}
              >
                <CustomLinePlot
                  pref={line1}
                  type="khq"
                  answerList={answerList}
                  message="Symptom severity score: 0(best) - 30(worst). Other domain scores: 0(best) - 100(worst)."
                />
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 6 }}
              >
                <CustomLinePlot
                  pref={line2}
                  type="pisq"
                  answerList={answerList}
                  message="PISQ: 0-48 points. The higher the better."
                />
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 6 }}
              >
                <CustomLinePlot
                  pref={line3}
                  type="iciq"
                  answerList={answerList}
                  message="ICIQ-UI: 1-5 (slight), 6-12 (moderate), 13-18 (severe) and 19-21 (very severe)."
                />
              </Col>
            </Row>
          ) : (
            <Result
              className="resultShow"
              icon={<SmileOutlined />}
              title={
                patientInfo.firstname +
                ' ' +
                patientInfo.surname +
                " hasn't filled out the questionnaire."
              }
            />
          )}
        </Panel>
        <Panel
          header="Current Meeting"
          key="4"
          forceRender
          className={styles.panel}
        >
          <Form
            labelCol={{ xs: 24, sm: 24, md: 4 }}
            wrapperCol={{ xs: 24, sm: 24, md: 20 }}
            labelAlign="left"
            form={form_current}
            onFinish={async (value: any) => {
              let row = { ...newAnswer };
              delete row.DeletedAt;
              if (row.popq) {
                row.popq1 = row.popq[0] || '';
                row.popq2 = row.popq[1] || '';
                row.popq3 = row.popq[2] || '';
                row.popq4 = row.popq[3] || '';
                row.popq5 = row.popq[4] || '';
                row.popq6 = row.popq[5] || '';
                delete row.popq;
              }
              var data = { ...row, ...value };
              const result = await changeAnswer(row.ID, data);
              if (!result.error) {
                message.success('changed successfully');
                actionRef.current?.reload();
              }
            }}
          >
            <Form.Item label="Purpose of Visiting">
              <div>{meeting?.[purpose]?.name ?? '-'}</div>
            </Form.Item>
            <Form.Item label="Current Post Operative Status">
              <Button
                onClick={() => {
                  setIfCurrentAnswerDetail(true);
                  setAnswerDetail(answerList[answerList.length - 1]);
                }}
              >
                View Details
              </Button>
            </Form.Item>
            <Form.Item name="remark1" label="Comments">
              <TextArea />
            </Form.Item>
            <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
              <Button
                style={{ padding: '0 16px' }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Panel>
        <Panel
          header="Clinical Examination"
          key="5"
          forceRender
          className={styles.panel}
        >
          <Form
            labelCol={{ xs: 24, sm: 24, md: 4 }}
            wrapperCol={{ xs: 24, sm: 24, md: 20 }}
            labelAlign="left"
            form={form_clinical}
            onFinish={async (value: any) => {
              let row = { ...currentRow };
              delete row.DeletedAt;
              value.popq1 = value.popq[0] || '';
              value.popq2 = value.popq[1] || '';
              value.popq3 = value.popq[2] || '';
              value.popq4 = value.popq[3] || '';
              value.popq5 = value.popq[4] || '';
              value.popq6 = value.popq[5] || '';
              const result = await changeAnswer(row.ID, { ...row, ...value });
              if (!result.error) {
                message.success('changed successfully');
                actionRef.current?.reload();
              }
            }}
          >
            <Form.Item name="ID" label="Meeting">
              <Select
                onChange={(v) => {
                  [...answerList].reverse().forEach((item, index) => {
                    if (item.ID === v) {
                      setCurrentRow(item);
                      form_clinical.setFieldsValue(item);
                      setPopIndex(index);
                      setSelectPopq(item.popq);
                    }
                  });
                }}
                options={[...answerList].reverse().map((item) => {
                  let label;
                  let keys = Object.keys(JSON.parse(item.answer));
                  keys = keys.filter(
                    (key) =>
                      questionnaireMap[key] &&
                      questionnaireMap[key].parentid == 0,
                  );
                  if (keys.join(',') == '10,19,28,29') {
                    label = 'First Meeting';
                  } else {
                    label = 'Follow Up Meeting';
                  }
                  return {
                    value: item.ID,
                    label:
                      label +
                      ' : ' +
                      moment(item.CreatedAt).format('YYYY-MM-DD HH:mm:ss'),
                  };
                })}
              />
            </Form.Item>
            <Form.Item name="uterus" label="Uterus">
              <Select
                onChange={(value) => setUterus(value)}
                options={[
                  { value: 0, label: '-' },
                  { label: 'With Uterus', value: 1 },
                  { label: 'Without Uterus', value: 2 },
                ]}
              />
            </Form.Item>
            <Form.Item label="POP-Q">
              <Row>
                <Col
                  xs={{ span: 22 }}
                  sm={{ span: 22 }}
                  md={{ span: 22 }}
                  lg={{ span: 22 }}
                >
                  <Form.Item name="popq" noStyle>
                    <POPQSelectList
                      uterus={uterus}
                      onChange={(values) => setSelectPopq(values)}
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={{ span: 2 }}
                  sm={{ span: 2 }}
                  md={{ span: 2 }}
                  lg={{ span: 2 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  {selectPopq &&
                  (+selectPopq[0] ||
                    +selectPopq[1] ||
                    +selectPopq[2] ||
                    +selectPopq[3] ||
                    +selectPopq[4] ||
                    +selectPopq[5]) ? (
                    <PlayCircleFilled
                      style={{ fontSize: '1.5rem' }}
                      onClick={() => {
                        if (!uterus) {
                          message.error(
                            'Please enter whether the patient have an uterus!',
                          );
                          return;
                        }
                        setUterusQuery(uterus);
                        var last = findLast(popIndex);
                        if (last) {
                          setAnimQuery([
                            `pl=${+(last.popq[0] || 0)}&pabc=${+(
                              last.popq[1] || 0
                            )}${Math.max(
                              +(last.popq[2] || 0),
                              +(last.popq[3] || 0),
                            )}${+(last.popq[4] || 0)}&pr=${+(
                              last.popq[5] || 0
                            )}`,
                            `l=${+(selectPopq[0] || 0)}&abc=${+(
                              selectPopq[1] || 0
                            )}${
                              uterus === 2
                                ? +(selectPopq[2] || 0)
                                : Math.max(
                                    +(selectPopq[2] || 0),
                                    +(selectPopq[3] || 0),
                                  )
                            }${+(selectPopq[4] || 0)}&r=${+(
                              selectPopq[5] || 0
                            )}`,
                          ]);
                        } else {
                          setAnimQuery([
                            '',
                            `l=${+(selectPopq[0] || 0)}&abc=${+(
                              selectPopq[1] || 0
                            )}${
                              uterus === 2
                                ? +(selectPopq[2] || 0)
                                : Math.max(
                                    +(selectPopq[2] || 0),
                                    +(selectPopq[3] || 0),
                                  )
                            }${+(selectPopq[4] || 0)}&r=${+(
                              selectPopq[5] || 0
                            )}`,
                          ]);
                        }
                      }}
                    />
                  ) : null}
                </Col>
              </Row>
            </Form.Item>
            <Form.Item name="remark2" label="Comments">
              <TextArea />
            </Form.Item>
            <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
              <Button
                style={{ padding: '0 16px' }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Panel>
        <Panel
          header="Treatment Plan"
          key="6"
          forceRender
          className={styles.panel}
        >
          <Form
            labelCol={{ xs: 24, sm: 24, md: 4 }}
            wrapperCol={{ xs: 24, sm: 24, md: 20 }}
            labelAlign="left"
            form={form_treatment}
            onFinish={async (value: any) => {
              let row = { ...currentRow };
              delete row.DeletedAt;
              var data = { ...row, ...value };
              if (consentData) {
                data.consent = JSON.stringify(consentData);
              }
              const result = await changeAnswer(row.ID, data);
              if (!result.error) {
                message.success('changed successfully');
                actionRef.current?.reload();
              }
            }}
            onValuesChange={(values) => {
              if (values.surgical !== undefined) {
                setSelectSurgical(values.surgical);
              }
            }}
          >
            <Form.Item name="ID" label="Meeting">
              <Select
                onChange={(v) => {
                  let result = [...answerList].filter(
                    (item) => item.ID === v,
                  )[0];
                  setCurrentRow(result);
                  setSelectSurgical(result.surgical);
                  form_treatment.setFieldsValue(result);
                }}
                options={[...answerList].reverse().map((item) => {
                  let label;
                  let keys = Object.keys(JSON.parse(item.answer));
                  keys = keys.filter(
                    (key) =>
                      questionnaireMap[key] &&
                      questionnaireMap[key].parentid == 0,
                  );
                  if (keys.join(',') == '10,19,28,29') {
                    label = 'First Meeting';
                  } else {
                    label = 'Follow Up Meeting';
                  }
                  return {
                    value: item.ID,
                    label:
                      label +
                      ' : ' +
                      moment(item.CreatedAt).format('YYYY-MM-DD HH:mm:ss'),
                  };
                })}
              />
            </Form.Item>
            <Form.Item label="Surgical Options">
              <Row>
                <Col
                  xs={{ span: 22 }}
                  sm={{ span: 22 }}
                  md={{ span: 22 }}
                  lg={{ span: 22 }}
                >
                  <Form.Item name="surgical" noStyle>
                    <Select
                      options={[
                        { value: 0, label: 'None' },
                        { value: 1, label: 'Anterior repair (without mesh)' },
                        { value: 2, label: 'Posterior repair' },
                        { value: 3, label: 'Vaginal hysterectomy' },
                        { value: 4, label: 'Sacrocolpopexy' },
                        { value: 5, label: 'Hysteropexy' },
                        { value: 6, label: 'TVT' },
                        { value: 7, label: 'Bulking agent' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={{ span: 2 }}
                  sm={{ span: 2 }}
                  md={{ span: 2 }}
                  lg={{ span: 2 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  {selectSurgical ? (
                    <PlayCircleFilled
                      style={{ fontSize: '1.5rem' }}
                      onClick={() => {
                        setSurgical(surgicalList[selectSurgical].split(' ')[0]);
                      }}
                    />
                  ) : null}
                </Col>
              </Row>
            </Form.Item>
            <Form.Item name="remark3" label="Comments">
              <TextArea />
            </Form.Item>
            {selectSurgical ? (
              <Form.Item label="Consent Form">
                <Space direction="horizontal" size={24}>
                  <ConsentForm
                    surgical={selectSurgical}
                    patientInfo={patientInfo}
                    consentData={consentData}
                    onSave={(data) => {
                      setConsentData(data);
                    }}
                  />
                  {consentData ? (
                    <ConsentPdf
                      trigger={
                        <Button icon={<FilePdfOutlined />}>View PDF</Button>
                      }
                      email={patientInfo.email}
                      consent={consentData}
                      surgical={selectSurgical}
                    />
                  ) : null}
                </Space>
              </Form.Item>
            ) : null}

            <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
              <Button
                style={{ padding: '0 16px' }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Panel>
        <Panel
          header="Prescription"
          key="7"
          forceRender
          className={styles.panel}
        >
          <div className={styles.prescriptionbox}>
            <Card
              hoverable
              bordered
              className={styles.prescription}
              title="MyGynae"
              extra={moment().format('DD/MM/YYYY')}
            >
              <Form
                labelCol={{ span: 6 }}
                form={form_prescription}
                onFinish={async (value: any) => {
                  let row = { ...newAnswer };
                  delete row.DeletedAt;
                  if (row.popq) {
                    row.popq1 = row.popq[0] || '';
                    row.popq2 = row.popq[1] || '';
                    row.popq3 = row.popq[2] || '';
                    row.popq4 = row.popq[3] || '';
                    row.popq5 = row.popq[4] || '';
                    row.popq6 = row.popq[5] || '';
                    delete row.popq;
                  }
                  var data = { ...row, prescription: JSON.stringify(value) };
                  const result = await changeAnswer(row.ID, data);
                  if (!result.error) {
                    message.success('changed successfully');
                    actionRef.current?.reload();
                  }
                }}
              >
                <Form.Item label="Patient Name">
                  {patientInfo.firstname + ' ' + patientInfo.surname}
                </Form.Item>
                <Form.Item
                  label="Px"
                  name="content"
                  rules={[{ required: true, message: 'Please enter content.' }]}
                >
                  <TextArea placeholder="content" />
                </Form.Item>
                <Form.Item label=" " colon={false}>
                  <Row gutter={8}>
                    <Col span={7}>
                      <Form.Item
                        noStyle
                        name="dosage"
                        rules={[
                          { required: true, message: 'Please enter desage.' },
                        ]}
                      >
                        <InputNumber
                          placeholder="dosage"
                          style={{ width: '100%' }}
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        noStyle
                        name="frequency"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter frequency.',
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="frequency"
                          style={{ width: '100%' }}
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        noStyle
                        name="frequencyunit"
                        initialValue="day"
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={[{ value: 'day' }, { value: 'week' }]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label=" " colon={false}>
                  <Row gutter={8}>
                    <Col
                      span={7}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <div>for</div>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        noStyle
                        name="duration"
                        rules={[
                          { required: true, message: 'Please enter duration.' },
                        ]}
                      >
                        <InputNumber
                          placeholder="duration"
                          style={{ width: '100%' }}
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        noStyle
                        name="durationunit"
                        initialValue="weeks"
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={[{ value: 'weeks' }, { value: 'months' }]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                <div style={{ textAlign: 'right', fontSize: 20 }}>
                  Prof. Barry O'Reilly
                </div>
                <div style={{ textAlign: 'center', padding: '4px 0 0' }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </Panel>
        <Panel header="Operative Notes" key="9" className={styles.panel}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <OperativeNoteModal
              patientId={parseInt(id)}
              answerList={answerList}
              trigger={
                <Button type="primary" icon={<FileAddOutlined />}>
                  Upload Operative Note
                </Button>
              }
              onSuccess={fetchOperativeNotes}
            />

            <ProTable
              columns={operativeNoteColumns}
              dataSource={operativeNotes}
              rowKey="ID"
              search={false}
              pagination={false}
              toolBarRender={false}
            />
          </Space>
        </Panel>

        <Panel header="Meeting History" key="8" className={styles.panel}>
          <ProTable
            search={false}
            actionRef={actionRef}
            rowKey="ID"
            columns={columns}
            scroll={{ x: 'max-content' }}
            toolBarRender={false}
            request={async (params = {}) => {
              if (patientInfo.accountid) {
                let result = await getAnswerList(patientInfo.accountid);
                if (!result.error) {
                  result = result.map((item: any) => ({
                    ...item,
                    popq: [
                      item.popq1 != '' ? item.popq1 : undefined,
                      item.popq2 != '' ? item.popq2 : undefined,
                      item.popq3 != '' ? item.popq3 : undefined,
                      item.popq4 != '' ? item.popq4 : undefined,
                      item.popq5 != '' ? item.popq5 : undefined,
                      item.popq6 != '' ? item.popq6 : undefined,
                    ],
                  }));
                  if (!currentRow) {
                    form_clinical.setFieldsValue(result[0]);
                    form_treatment.setFieldsValue(result[0]);
                    setSelectSurgical(result[0].surgical);
                    setPopIndex(0);
                    setUterusQuery(result[0].uterus);
                    setSelectPopq(result[0].popq);
                    setUterus(result[0].uterus);
                    setCurrentRow(result[0]);
                  }
                  if (result[0].prescription) {
                    form_prescription.setFieldsValue(
                      JSON.parse(result[0].prescription),
                    );
                  }
                  setNewAnswer(result[0]);
                  form_current.setFieldsValue(result[0]);
                  setAnswerList([...result].reverse());
                  setTimeout(resizeBox, 50);
                  return {
                    data: result,
                    success: true,
                  };
                }
                return result;
              }
            }}
            pagination={false}
          />
        </Panel>
      </Collapse>

      <Drawer
        open={!!answerDetail}
        onClose={() => {
          setAnswerDetail(null);
          setIfCurrentAnswerDetail(false);
        }}
        width={800}
      >
        {answerDetail ? (
          <SurveyAnswer
            onAnswerDrawerChange={onAnswerDrawerChange}
            ifCurrentAnswerDetail={ifCurrentAnswerDetail}
            answer={answerDetail}
            meeting={meeting?.[answerDetail.purpose]}
            questionnaire={questionnaireMap}
          />
        ) : null}
      </Drawer>
      <Modal
        forceRender
        width={456}
        open={animQuery.length > 0}
        closeIcon={false}
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => {
          setAnimQuery([]);
        }}
      >
        <iframe
          style={{ width: 400, height: 400, borderWidth: 0 }}
          src={`/prolapse-${
            uterusQuery === 1 ? 'w' : 'n'
          }u/?${animQuery[0]}&${animQuery[1]}`}
          title="POP-Q Animation"
          onError={() => {
            message.error('Unable to load animation. The animation server may be unavailable.');
          }}
        ></iframe>
      </Modal>
      <Modal
        forceRender
        width={456}
        open={!!surgical}
        closeIcon={false}
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => {
          setSurgical('');
        }}
      >
        <iframe
          style={{ width: 400, height: 400, borderWidth: 0 }}
          src={`/prolapse-tm/?ani=${surgical}`}
          title="Surgical Animation"
          onError={() => {
            message.error('Unable to load surgical animation. The animation server may be unavailable.');
          }}
        ></iframe>
      </Modal>
      {preImage && currentImage && spreImage && scurrentImage ? (
        <ShowPdf
          newAnswer={newAnswer}
          lines={[line1, line2, line3, line4]}
          havePrevious={havePrevious}
          pre={preImage}
          current={currentImage}
          spre={spreImage}
          scurrent={scurrentImage}
          meeting={meeting?.[+newAnswer?.purpose]}
          trigger={
            <Tooltip title="Generate PDF">
              <Button
                className={styles.fixedbtn}
                size="large"
                type="primary"
                shape="circle"
                icon={<FilePdfFilled />}
              />
            </Tooltip>
          }
          title={`Medical records for ${
            patientInfo.firstname + ' ' + patientInfo.surname
          }`}
          information={patientInfo}
        />
      ) : answerList.length > 0 ? (
        <Tooltip title="PDF generation unavailable - animation server is not responding. Please check network connection or contact support.">
          <Button
            className={styles.fixedbtn}
            size="large"
            type="primary"
            shape="circle"
            icon={<FilePdfFilled />}
            disabled
            onClick={() => {
              message.warning('PDF generation requires animation data which is currently unavailable.');
            }}
          />
        </Tooltip>
      ) : null}
      <iframe style={{ position: 'absolute', left: '-9999px', width: '400px', height: '400px' }} src={getImageUrl} title="Image capture frame" />
      <iframe style={{ position: 'absolute', left: '-9999px', width: '400px', height: '400px' }} src={getSImageUrl} title="Surgical image capture frame" />
    </PageContainer>
  );
};

export default Patient;
