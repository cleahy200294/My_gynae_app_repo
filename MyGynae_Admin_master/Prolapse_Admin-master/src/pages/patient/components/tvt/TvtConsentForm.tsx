import { CloseCircleOutlined, CheckCircleOutlined, FileProtectOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import moment from 'moment';
import styles from './style.less';
import { TvtConsentForm as TvtConsentFormType } from '@/api/tvtConsent';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

interface IProps {
  consentId: number;
  patientInfo: any;
  onComplete: (data: Partial<TvtConsentFormType>) => void;
  onBack: () => void;
  onClose: () => void;
  existingData?: TvtConsentFormType;
  readOnly?: boolean;
}

const TvtConsentForm: FC<IProps> = (props) => {
  const { consentId, patientInfo, onComplete, onBack, onClose, existingData, readOnly = false } =
    props;
  const [form] = Form.useForm();
  const [currentTab, setCurrentTab] = useState('1');

  // Signature states for each section
  const [sectionASignature, setSectionASignature] = useState('');
  const [sectionBSignature, setSectionBSignature] = useState('');
  const [sectionCSignature, setSectionCSignature] = useState('');
  const [sectionDSignature, setSectionDSignature] = useState('');
  const [sectionESignature, setSectionESignature] = useState('');
  const [sectionFSignature, setSectionFSignature] = useState('');

  // Signature canvas refs
  const sectionACanvasRef = useRef() as any;
  const sectionBCanvasRef = useRef() as any;
  const sectionCCanvasRef = useRef() as any;
  const sectionDCanvasRef = useRef() as any;
  const sectionECanvasRef = useRef() as any;
  const sectionFCanvasRef = useRef() as any;

  useEffect(() => {
    if (existingData) {
      form.setFieldsValue({
        ...existingData,
        section_a_date: existingData.section_a_date ? moment(existingData.section_a_date) : null,
        section_b_date: existingData.section_b_date ? moment(existingData.section_b_date) : null,
        section_c_date: existingData.section_c_date ? moment(existingData.section_c_date) : null,
        section_d_date: existingData.section_d_date ? moment(existingData.section_d_date) : null,
        section_e_date: existingData.section_e_date ? moment(existingData.section_e_date) : null,
        section_f_date: existingData.section_f_date ? moment(existingData.section_f_date) : null,
      });

      // Load signatures
      if (existingData.section_a_signature) {
        setSectionASignature(existingData.section_a_signature);
        sectionACanvasRef.current?.fromDataURL(existingData.section_a_signature, { ratio: 1 });
      }
      if (existingData.section_b_signature) {
        setSectionBSignature(existingData.section_b_signature);
        sectionBCanvasRef.current?.fromDataURL(existingData.section_b_signature, { ratio: 1 });
      }
      if (existingData.section_c_signature) {
        setSectionCSignature(existingData.section_c_signature);
        sectionCCanvasRef.current?.fromDataURL(existingData.section_c_signature, { ratio: 1 });
      }
      if (existingData.section_d_signature) {
        setSectionDSignature(existingData.section_d_signature);
        sectionDCanvasRef.current?.fromDataURL(existingData.section_d_signature, { ratio: 1 });
      }
      if (existingData.section_e_signature) {
        setSectionESignature(existingData.section_e_signature);
        sectionECanvasRef.current?.fromDataURL(existingData.section_e_signature, { ratio: 1 });
      }
      if (existingData.section_f_signature) {
        setSectionFSignature(existingData.section_f_signature);
        sectionFCanvasRef.current?.fromDataURL(existingData.section_f_signature, { ratio: 1 });
      }
    }
  }, [existingData]);

  const clearSignature = (section: string) => {
    switch (section) {
      case 'a':
        sectionACanvasRef.current?.clear();
        setSectionASignature('');
        break;
      case 'b':
        sectionBCanvasRef.current?.clear();
        setSectionBSignature('');
        break;
      case 'c':
        sectionCCanvasRef.current?.clear();
        setSectionCSignature('');
        break;
      case 'd':
        sectionDCanvasRef.current?.clear();
        setSectionDSignature('');
        break;
      case 'e':
        sectionECanvasRef.current?.clear();
        setSectionESignature('');
        break;
      case 'f':
        sectionFCanvasRef.current?.clear();
        setSectionFSignature('');
        break;
    }
  };

  const handleFinish = (values: any) => {
    if (!sectionASignature && !readOnly) {
      message.warn('Section A (Patient Agreement) signature is required');
      setCurrentTab('2');
      return;
    }

    if (!sectionBSignature && !readOnly) {
      message.warn('Section B (Health Professional) signature is required');
      setCurrentTab('2');
      return;
    }

    const data: Partial<TvtConsentFormType> = {
      ...values,
      section_a_signature: sectionASignature,
      section_a_date: values.section_a_date
        ? values.section_a_date.toISOString()
        : undefined,
      section_b_signature: sectionBSignature,
      section_b_date: values.section_b_date
        ? values.section_b_date.toISOString()
        : undefined,
      section_c_signature: sectionCSignature || undefined,
      section_c_date: values.section_c_date
        ? values.section_c_date.toISOString()
        : undefined,
      section_d_signature: sectionDSignature || undefined,
      section_d_date: values.section_d_date
        ? values.section_d_date.toISOString()
        : undefined,
      section_e_signature: sectionESignature || undefined,
      section_e_date: values.section_e_date
        ? values.section_e_date.toISOString()
        : undefined,
      section_f_signature: sectionFSignature || undefined,
      section_f_date: values.section_f_date
        ? values.section_f_date.toISOString()
        : undefined,
    };

    onComplete(data);
  };

  return (
    <div className={styles.tvtConsentFormContainer}>
      <div className={styles.header}>
        <Title level={3}>
          <FileProtectOutlined style={{ marginRight: 8 }} />
          SUI Consent Form 2023 (TVT/TVT-O)
        </Title>
        <CloseCircleOutlined className={styles.closeIcon} onClick={onClose} />
      </div>

      <div className={styles.content}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Tabs activeKey={currentTab} onChange={setCurrentTab} type="card">
            {/* Tab 1: Patient Details & Procedure Information */}
            <TabPane tab="1. Patient Details" key="1">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Alert
                  message="Consent Form Purpose"
                  description="This form should only be used if the patient has capacity to give consent. If the patient does not legally have capacity, please use an appropriate alternative consent form."
                  type="info"
                  showIcon
                />

                <div>
                  <Title level={4}>Patient Details</Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="First Name">
                        <Input value={patientInfo.firstname} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Surname">
                        <Input value={patientInfo.surname} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Date of Birth">
                        <Input
                          value={patientInfo.birthday?.format('DD/MM/YYYY') || 'N/A'}
                          disabled
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="patient_identifier"
                        label="Patient Identifier / Hospital Number"
                      >
                        <Input placeholder="e.g., MRN123456" disabled={readOnly} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                <div>
                  <Title level={4}>Responsible Healthcare Professional</Title>
                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item
                        name="responsible_healthcare_professional"
                        label="Name"
                        rules={[{ required: !readOnly, message: 'This field is required' }]}
                      >
                        <Input placeholder="Dr. [Name]" disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="job_title"
                        label="Job Title"
                        rules={[{ required: !readOnly, message: 'This field is required' }]}
                      >
                        <Input placeholder="Consultant Urogynaecologist" disabled={readOnly} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                <div>
                  <Title level={4}>Procedure Selection</Title>
                  <Form.Item
                    name="selected_procedure"
                    label="Selected TVT Procedure"
                    rules={[{ required: !readOnly, message: 'Please select a procedure' }]}
                  >
                    <Radio.Group disabled={readOnly}>
                      <Space direction="vertical">
                        <Radio value="TVT">
                          <Text strong>TVT (Tension-free Vaginal Tape)</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Retropubic approach - Success rate: 77-90% at 1 year
                          </Text>
                        </Radio>
                        <Radio value="TVT-O">
                          <Text strong>TVT-O (Trans-Obturator Tape)</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Trans-obturator approach - Success rate: 77-90% at 1 year
                          </Text>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Space>
            </TabPane>

            {/* Tab 2: Procedure Understanding & Signatures A-C */}
            <TabPane tab="2. Understanding & Initial Consent" key="2">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={4}>Statement of Understanding</Title>
                  <Paragraph>
                    Please confirm that you understand the following about your procedure:
                  </Paragraph>

                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Form.Item
                      name="understood_procedure_nature"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value || readOnly
                              ? Promise.resolve()
                              : Promise.reject(new Error('This confirmation is required')),
                        },
                      ]}
                    >
                      <Checkbox disabled={readOnly}>
                        <Text strong>
                          I understand the nature and purpose of the procedure and what it will
                          involve
                        </Text>
                      </Checkbox>
                    </Form.Item>

                    <Form.Item
                      name="understood_serious_risks"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value || readOnly
                              ? Promise.resolve()
                              : Promise.reject(new Error('This confirmation is required')),
                        },
                      ]}
                    >
                      <Checkbox disabled={readOnly}>
                        <Text strong>
                          I understand the serious or frequently occurring risks specific to this
                          procedure
                        </Text>
                      </Checkbox>
                    </Form.Item>

                    <Form.Item
                      name="understood_common_risks"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value || readOnly
                              ? Promise.resolve()
                              : Promise.reject(new Error('This confirmation is required')),
                        },
                      ]}
                    >
                      <Checkbox disabled={readOnly}>
                        <Text strong>I understand the common risks of any surgical procedure</Text>
                      </Checkbox>
                    </Form.Item>

                    <Form.Item
                      name="understood_alternatives"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value || readOnly
                              ? Promise.resolve()
                              : Promise.reject(new Error('This confirmation is required')),
                        },
                      ]}
                    >
                      <Checkbox disabled={readOnly}>
                        <Text strong>
                          I understand the alternative treatment options available (surgical and
                          non-surgical)
                        </Text>
                      </Checkbox>
                    </Form.Item>

                    <Form.Item
                      name="understood_no_guarantee"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value || readOnly
                              ? Promise.resolve()
                              : Promise.reject(new Error('This confirmation is required')),
                        },
                      ]}
                    >
                      <Checkbox disabled={readOnly}>
                        <Text strong>
                          I understand that the procedure may not cure my condition and there is no
                          guarantee of success
                        </Text>
                      </Checkbox>
                    </Form.Item>
                  </Space>
                </div>

                <Divider />

                {/* Risk Acknowledgements */}
                <div>
                  <Title level={4}>Specific Risk Acknowledgements</Title>
                  <Paragraph type="secondary">
                    Please confirm you understand the following specific risks:
                  </Paragraph>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item name="acknowledged_bladder_perforation" valuePropName="checked">
                        <Checkbox disabled={readOnly}>Bladder perforation (3-8%)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="acknowledged_mesh_exposure" valuePropName="checked">
                        <Checkbox disabled={readOnly}>Mesh exposure (1-3%)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="acknowledged_chronic_pain" valuePropName="checked">
                        <Checkbox disabled={readOnly}>
                          Chronic pain/dyspareunia ({'<'}3%)
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="acknowledged_voiding_difficulty" valuePropName="checked">
                        <Checkbox disabled={readOnly}>Voiding difficulty (2-15%)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="acknowledged_recurrent_uti" valuePropName="checked">
                        <Checkbox disabled={readOnly}>Recurrent UTI</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="acknowledged_mesh_removal_risk" valuePropName="checked">
                        <Checkbox disabled={readOnly}>Need for mesh removal surgery</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="acknowledged_bowel_perforation" valuePropName="checked">
                        <Checkbox disabled={readOnly}>Bowel perforation (rare)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="acknowledged_success_rate">
                        <Input
                          addonBefore="Success Rate:"
                          placeholder="77-90% at 1 year"
                          disabled={readOnly}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                {/* Irish National Mesh Register */}
                <div>
                  <Title level={4}>Irish National Mesh Register</Title>
                  <Alert
                    message="Mesh Register Consent"
                    description="The Irish National Mesh Register collects anonymous data on all vaginal mesh procedures to monitor safety and outcomes. Your participation helps improve patient care."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />

                  <Form.Item
                    name="mesh_register_consent"
                    label="Do you consent to your data being included in the Irish National Mesh Register?"
                    rules={[{ required: !readOnly, message: 'Please make a selection' }]}
                  >
                    <Radio.Group disabled={readOnly}>
                      <Space direction="vertical">
                        <Radio value={true}>
                          <Text strong>I CONSENT</Text> to my data being included in the register
                        </Radio>
                        <Radio value={false}>
                          <Text strong>I DO NOT CONSENT</Text> to my data being included in the
                          register
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="mesh_register_reason"
                    label="If you do not consent, please provide a reason (optional)"
                  >
                    <TextArea rows={2} disabled={readOnly} />
                  </Form.Item>
                </div>

                <Divider />

                {/* Additional Procedures */}
                <div>
                  <Form.Item name="additional_procedures" label="Additional Procedures (if any)">
                    <TextArea
                      rows={3}
                      placeholder="e.g., Concurrent prolapse repair..."
                      disabled={readOnly}
                    />
                  </Form.Item>

                  <Form.Item name="blood_products_consent" valuePropName="checked">
                    <Checkbox disabled={readOnly}>
                      I consent to the use of blood products if clinically necessary
                    </Checkbox>
                  </Form.Item>
                </div>

                <Divider />

                {/* Interpreter */}
                <div>
                  <Form.Item name="interpreter_used" valuePropName="checked">
                    <Checkbox disabled={readOnly}>An interpreter was used for this consent</Checkbox>
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="interpreter_name" label="Interpreter Name">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="interpreter_id" label="Interpreter ID">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                {/* SECTION A: Patient Agreement */}
                <Card
                  title={
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                      SECTION A: Patient Agreement
                    </span>
                  }
                  style={{ marginBottom: 24 }}
                >
                  <Paragraph>
                    I agree to the procedure described and I confirm that I have had the opportunity
                    to ask questions and all my questions have been answered to my satisfaction.
                  </Paragraph>

                  <div
                    style={{
                      border: '2px solid #d9d9d9',
                      borderRadius: 4,
                      backgroundColor: '#fafafa',
                      marginBottom: 16,
                    }}
                  >
                    <SignatureCanvas
                      ref={sectionACanvasRef}
                      canvasProps={{
                        width: 500,
                        height: 150,
                        className: 'signature-canvas',
                      }}
                      onEnd={() => {
                        if (sectionACanvasRef.current) {
                          setSectionASignature(sectionACanvasRef.current.toDataURL());
                        }
                      }}
                      disabled={readOnly}
                    />
                  </div>

                  {!readOnly && (
                    <Button
                      onClick={() => clearSignature('a')}
                      style={{ marginBottom: 16 }}
                      disabled={!sectionASignature}
                    >
                      Clear Signature
                    </Button>
                  )}

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="section_a_name"
                        label="Patient Name (Print)"
                        rules={[{ required: !readOnly }]}
                      >
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_a_date" label="Date">
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          disabled={readOnly}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* SECTION B: Health Professional Statement */}
                <Card
                  title={
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                      SECTION B: Health Professional Statement
                    </span>
                  }
                  style={{ marginBottom: 24 }}
                >
                  <Paragraph>
                    I confirm that I have explained the procedure to the patient and have answered
                    all questions. I am satisfied that the patient has the capacity to consent to
                    this procedure.
                  </Paragraph>

                  <div
                    style={{
                      border: '2px solid #d9d9d9',
                      borderRadius: 4,
                      backgroundColor: '#fafafa',
                      marginBottom: 16,
                    }}
                  >
                    <SignatureCanvas
                      ref={sectionBCanvasRef}
                      canvasProps={{
                        width: 500,
                        height: 150,
                        className: 'signature-canvas',
                      }}
                      onEnd={() => {
                        if (sectionBCanvasRef.current) {
                          setSectionBSignature(sectionBCanvasRef.current.toDataURL());
                        }
                      }}
                      disabled={readOnly}
                    />
                  </div>

                  {!readOnly && (
                    <Button
                      onClick={() => clearSignature('b')}
                      style={{ marginBottom: 16 }}
                      disabled={!sectionBSignature}
                    >
                      Clear Signature
                    </Button>
                  )}

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="section_b_name"
                        label="Healthcare Professional Name"
                        rules={[{ required: !readOnly }]}
                      >
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="section_b_job_title"
                        label="Job Title"
                        rules={[{ required: !readOnly }]}
                      >
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_b_date" label="Date">
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          disabled={readOnly}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* SECTION C: Interpreter Declaration */}
                <Card
                  title={
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                      SECTION C: Interpreter Declaration (If Applicable)
                    </span>
                  }
                >
                  <Paragraph>
                    I confirm that I have interpreted the information about this procedure to the
                    patient to the best of my ability and in a way which I believe they can
                    understand.
                  </Paragraph>

                  <div
                    style={{
                      border: '2px solid #d9d9d9',
                      borderRadius: 4,
                      backgroundColor: '#fafafa',
                      marginBottom: 16,
                    }}
                  >
                    <SignatureCanvas
                      ref={sectionCCanvasRef}
                      canvasProps={{
                        width: 500,
                        height: 150,
                        className: 'signature-canvas',
                      }}
                      onEnd={() => {
                        if (sectionCCanvasRef.current) {
                          setSectionCSignature(sectionCCanvasRef.current.toDataURL());
                        }
                      }}
                      disabled={readOnly}
                    />
                  </div>

                  {!readOnly && (
                    <Button
                      onClick={() => clearSignature('c')}
                      style={{ marginBottom: 16 }}
                      disabled={!sectionCSignature}
                    >
                      Clear Signature
                    </Button>
                  )}

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="section_c_name" label="Interpreter Name">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_c_interpreter_id" label="Interpreter ID">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_c_date" label="Date">
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          disabled={readOnly}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Space>
            </TabPane>

            {/* Tab 3: Day of Procedure Signatures D-F */}
            <TabPane tab="3. Day of Procedure" key="3">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Alert
                  message="Day of Procedure Confirmation"
                  description="The following sections should be completed on the day of the procedure before surgery begins."
                  type="warning"
                  showIcon
                />

                {/* SECTION D: Patient Confirmation */}
                <Card
                  title={
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                      SECTION D: Patient Confirmation (Day of Procedure)
                    </span>
                  }
                  style={{ marginBottom: 24 }}
                >
                  <Paragraph>
                    I confirm that I still wish to proceed with the TVT/TVT-O procedure and that I
                    have had the opportunity to ask further questions.
                  </Paragraph>

                  <Form.Item name="section_d_questions_answered" valuePropName="checked">
                    <Checkbox disabled={readOnly}>
                      All my questions have been answered to my satisfaction
                    </Checkbox>
                  </Form.Item>

                  <div
                    style={{
                      border: '2px solid #d9d9d9',
                      borderRadius: 4,
                      backgroundColor: '#fafafa',
                      marginBottom: 16,
                    }}
                  >
                    <SignatureCanvas
                      ref={sectionDCanvasRef}
                      canvasProps={{
                        width: 500,
                        height: 150,
                        className: 'signature-canvas',
                      }}
                      onEnd={() => {
                        if (sectionDCanvasRef.current) {
                          setSectionDSignature(sectionDCanvasRef.current.toDataURL());
                        }
                      }}
                      disabled={readOnly}
                    />
                  </div>

                  {!readOnly && (
                    <Button
                      onClick={() => clearSignature('d')}
                      style={{ marginBottom: 16 }}
                      disabled={!sectionDSignature}
                    >
                      Clear Signature
                    </Button>
                  )}

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="section_d_name" label="Patient Name (Print)">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_d_date" label="Date">
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          disabled={readOnly}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* SECTION E: Confirmation of Consent (Surgeon) */}
                <Card
                  title={
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                      SECTION E: Confirmation of Consent (Surgeon - Day of Procedure)
                    </span>
                  }
                  style={{ marginBottom: 24 }}
                >
                  <Paragraph>
                    I confirm that I have discussed the procedure with the patient and I am
                    satisfied that the patient still wishes to proceed and has capacity to consent.
                  </Paragraph>

                  <div
                    style={{
                      border: '2px solid #d9d9d9',
                      borderRadius: 4,
                      backgroundColor: '#fafafa',
                      marginBottom: 16,
                    }}
                  >
                    <SignatureCanvas
                      ref={sectionECanvasRef}
                      canvasProps={{
                        width: 500,
                        height: 150,
                        className: 'signature-canvas',
                      }}
                      onEnd={() => {
                        if (sectionECanvasRef.current) {
                          setSectionESignature(sectionECanvasRef.current.toDataURL());
                        }
                      }}
                      disabled={readOnly}
                    />
                  </div>

                  {!readOnly && (
                    <Button
                      onClick={() => clearSignature('e')}
                      style={{ marginBottom: 16 }}
                      disabled={!sectionESignature}
                    >
                      Clear Signature
                    </Button>
                  )}

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="section_e_name" label="Surgeon Name">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_e_job_title" label="Job Title">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_e_date" label="Date">
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          disabled={readOnly}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* SECTION F: Confirmation of Capacity */}
                <Card
                  title={
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                      SECTION F: Confirmation of Capacity (If Applicable)
                    </span>
                  }
                >
                  <Paragraph>
                    If there are concerns about the patient's capacity to consent, this section
                    should be completed by a senior clinician.
                  </Paragraph>

                  <Form.Item name="section_f_assessment" label="Capacity Assessment">
                    <TextArea
                      rows={4}
                      placeholder="Assessment of patient's capacity to consent..."
                      disabled={readOnly}
                    />
                  </Form.Item>

                  <div
                    style={{
                      border: '2px solid #d9d9d9',
                      borderRadius: 4,
                      backgroundColor: '#fafafa',
                      marginBottom: 16,
                    }}
                  >
                    <SignatureCanvas
                      ref={sectionFCanvasRef}
                      canvasProps={{
                        width: 500,
                        height: 150,
                        className: 'signature-canvas',
                      }}
                      onEnd={() => {
                        if (sectionFCanvasRef.current) {
                          setSectionFSignature(sectionFCanvasRef.current.toDataURL());
                        }
                      }}
                      disabled={readOnly}
                    />
                  </div>

                  {!readOnly && (
                    <Button
                      onClick={() => clearSignature('f')}
                      style={{ marginBottom: 16 }}
                      disabled={!sectionFSignature}
                    >
                      Clear Signature
                    </Button>
                  )}

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="section_f_name" label="Senior Clinician Name">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_f_job_title" label="Job Title">
                        <Input disabled={readOnly} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="section_f_date" label="Date">
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          disabled={readOnly}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Divider />

                <Form.Item name="additional_notes" label="Additional Notes">
                  <TextArea rows={4} placeholder="Any additional notes..." disabled={readOnly} />
                </Form.Item>
              </Space>
            </TabPane>
          </Tabs>

          {/* Action Buttons */}
          {!readOnly && (
            <Row gutter={16} style={{ marginTop: 24, padding: '0 24px' }}>
              <Col>
                <Button onClick={onBack}>Back to Request Form</Button>
              </Col>
              <Col>
                <Button onClick={onClose}>Cancel</Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit" size="large">
                  Complete TVT Consent Process
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </div>
    </div>
  );
};

export default TvtConsentForm;
