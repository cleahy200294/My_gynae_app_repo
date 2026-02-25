import { CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import moment from 'moment';
import styles from './style.less';
import { TvtPatientRequest } from '@/api/tvtConsent';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface IProps {
  consentId: number;
  patientInfo: any;
  onComplete: (data: Partial<TvtPatientRequest>) => void;
  onBack: () => void;
  onClose: () => void;
  existingData?: TvtPatientRequest;
  readOnly?: boolean;
}

const TvtPatientRequestForm: FC<IProps> = (props) => {
  const { consentId, patientInfo, onComplete, onBack, onClose, existingData, readOnly = false } =
    props;
  const [form] = Form.useForm();
  const [patientSignature, setPatientSignature] = useState('');
  const [consultantSignature, setConsultantSignature] = useState('');

  const patientCanvasRef = useRef() as any;
  const consultantCanvasRef = useRef() as any;

  useEffect(() => {
    if (existingData) {
      form.setFieldsValue({
        ...existingData,
        patient_signature_date: existingData.patient_signature_date
          ? moment(existingData.patient_signature_date)
          : null,
        consultant_signature_date: existingData.consultant_signature_date
          ? moment(existingData.consultant_signature_date)
          : null,
        mdt_approval_date: existingData.mdt_approval_date
          ? moment(existingData.mdt_approval_date)
          : null,
      });

      if (existingData.patient_signature) {
        setPatientSignature(existingData.patient_signature);
        patientCanvasRef.current?.fromDataURL(existingData.patient_signature, { ratio: 1 });
      }

      if (existingData.consultant_signature) {
        setConsultantSignature(existingData.consultant_signature);
        consultantCanvasRef.current?.fromDataURL(existingData.consultant_signature, { ratio: 1 });
      }
    }
  }, [existingData]);

  const clearPatientSignature = () => {
    patientCanvasRef.current?.clear();
    setPatientSignature('');
  };

  const clearConsultantSignature = () => {
    consultantCanvasRef.current?.clear();
    setConsultantSignature('');
  };

  const handleFinish = (values: any) => {
    if (!patientSignature && !readOnly) {
      message.warn('Patient signature is required');
      return;
    }

    const data: Partial<TvtPatientRequest> = {
      ...values,
      patient_signature: patientSignature,
      patient_signature_date: values.patient_signature_date
        ? values.patient_signature_date.toISOString()
        : new Date().toISOString(),
      consultant_signature: consultantSignature || undefined,
      consultant_signature_date: values.consultant_signature_date
        ? values.consultant_signature_date.toISOString()
        : undefined,
      mdt_approval_date: values.mdt_approval_date
        ? values.mdt_approval_date.toISOString()
        : undefined,
    };

    onComplete(data);
  };

  return (
    <div className={styles.tvtRequestContainer}>
      <div className={styles.header}>
        <Title level={3}>Patient Request for TVT Insertion</Title>
        <CloseCircleOutlined className={styles.closeIcon} onClick={onClose} />
      </div>

      <div className={styles.content}>
        <Alert
          message="Important Notice: HSE Ireland TVT Pause (2018)"
          description="The Health Service Executive (HSE) in Ireland paused the use of transvaginal mesh for stress urinary incontinence in 2018. This form confirms you are aware of this pause and still wish to proceed after being informed of all alternative options."
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Section 1: Patient Confirmations */}
            <div>
              <Title level={4}>Patient Declaration</Title>
              <Paragraph>
                <Text strong>Patient Name:</Text> {patientInfo.firstname} {patientInfo.surname}
                <br />
                <Text strong>Date of Birth:</Text>{' '}
                {patientInfo.birthday?.format('DD/MM/YYYY') || 'N/A'}
              </Paragraph>

              <Divider />

              <Paragraph>
                I confirm the following statements are true (please check all that apply):
              </Paragraph>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Form.Item
                  name="has_debilitating_sui"
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
                      I have debilitating stress urinary incontinence that significantly affects my
                      quality of life
                    </Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="aware_hse_pause_2018"
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
                      I am aware that the HSE Ireland paused the use of vaginal mesh tapes for
                      stress urinary incontinence in 2018
                    </Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="tried_pelvic_floor_exercises"
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
                      I have tried pelvic floor muscle exercises (supervised physiotherapy)
                    </Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="tried_lifestyle_changes"
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
                      I have tried lifestyle modifications (weight loss, fluid management, avoiding
                      heavy lifting)
                    </Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item name="tried_pessary" valuePropName="checked">
                  <Checkbox disabled={readOnly}>
                    <Text>I have tried or been offered a pessary device (if applicable)</Text>
                  </Checkbox>
                </Form.Item>
              </Space>
            </div>

            <Divider />

            {/* Section 2: Alternative Options */}
            <div>
              <Title level={4}>Alternative Surgical Options</Title>
              <Paragraph>
                I have been offered the following alternative surgical procedures and I decline
                them for the reasons discussed with my surgeon:
              </Paragraph>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Form.Item
                  name="declined_colposuspension"
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
                      I decline open or laparoscopic colposuspension (Burch procedure)
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Alternative surgical option with no mesh, but requires abdominal surgery with
                      longer recovery
                    </Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="declined_fascial_sling"
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
                    <Text strong>I decline autologous fascial sling (using my own tissue)</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Alternative using patient's own tissue, no synthetic mesh, but requires
                      additional incision
                    </Text>
                  </Checkbox>
                </Form.Item>
              </Space>
            </div>

            <Divider />

            {/* Section 3: Risk Awareness */}
            <div>
              <Title level={4}>Risk Acknowledgement</Title>
              <Paragraph>
                I understand and accept the following risks associated with TVT/TVT-O:
              </Paragraph>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Form.Item
                  name="aware_success_rate_80_90"
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
                    <Text>Success rate is approximately 80-90% at 1 year</Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="aware_complications_up_to_15"
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
                    <Text>Risk of complications occurs in up to 15% of cases</Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="aware_mesh_exposure"
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
                    <Text>Mesh exposure may occur requiring further surgery</Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="aware_bladder_injury"
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
                    <Text>Risk of bladder or urethral perforation during the procedure</Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="aware_repeat_surgery_possible"
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
                    <Text>I may require repeat surgery for complications or persistent symptoms</Text>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="understand_tvt_risks"
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
                      I understand all risks discussed and still wish to proceed with TVT/TVT-O
                    </Text>
                  </Checkbox>
                </Form.Item>
              </Space>
            </div>

            <Divider />

            {/* Section 4: Additional Notes */}
            <div>
              <Form.Item name="notes" label="Additional Notes (Optional)">
                <TextArea
                  rows={4}
                  placeholder="Any additional comments or concerns..."
                  disabled={readOnly}
                />
              </Form.Item>
            </div>

            <Divider />

            {/* Section 5: Patient Signature */}
            <div className={styles.signatureSection}>
              <Title level={5}>Patient Signature</Title>
              <Paragraph>
                I confirm that I have read and understood this Patient Request form and that all
                the above statements are true.
              </Paragraph>

              <div
                className={styles.signatureCanvas}
                style={{
                  border: '2px solid #d9d9d9',
                  borderRadius: 4,
                  backgroundColor: '#fafafa',
                  marginBottom: 16,
                }}
              >
                <SignatureCanvas
                  ref={patientCanvasRef}
                  canvasProps={{
                    width: 500,
                    height: 150,
                    className: 'signature-canvas',
                  }}
                  onEnd={() => {
                    if (patientCanvasRef.current) {
                      setPatientSignature(patientCanvasRef.current.toDataURL());
                    }
                  }}
                  disabled={readOnly}
                />
              </div>

              {!readOnly && (
                <Button
                  onClick={clearPatientSignature}
                  style={{ marginBottom: 16 }}
                  disabled={!patientSignature}
                >
                  Clear Patient Signature
                </Button>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="patient_signature_date" label="Date">
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabled={readOnly}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Section 6: Consultant Signature */}
            <div className={styles.signatureSection}>
              <Title level={5}>Consultant Declaration</Title>
              <Paragraph>
                I confirm that I have discussed all alternative treatment options with the patient
                and that the patient meets the criteria for TVT insertion. This case requires MDT
                (Multidisciplinary Team) approval.
              </Paragraph>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="consultant_name"
                    label="Consultant Name"
                    rules={[{ required: !readOnly, message: 'Consultant name is required' }]}
                  >
                    <Input placeholder="Dr. [Name]" disabled={readOnly} />
                  </Form.Item>
                </Col>
              </Row>

              <div
                className={styles.signatureCanvas}
                style={{
                  border: '2px solid #d9d9d9',
                  borderRadius: 4,
                  backgroundColor: '#fafafa',
                  marginBottom: 16,
                }}
              >
                <SignatureCanvas
                  ref={consultantCanvasRef}
                  canvasProps={{
                    width: 500,
                    height: 150,
                    className: 'signature-canvas',
                  }}
                  onEnd={() => {
                    if (consultantCanvasRef.current) {
                      setConsultantSignature(consultantCanvasRef.current.toDataURL());
                    }
                  }}
                  disabled={readOnly}
                />
              </div>

              {!readOnly && (
                <Button
                  onClick={clearConsultantSignature}
                  style={{ marginBottom: 16 }}
                  disabled={!consultantSignature}
                >
                  Clear Consultant Signature
                </Button>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="consultant_signature_date" label="Date">
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabled={readOnly}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Section 7: MDT Approval */}
            <div>
              <Title level={5}>MDT (Multidisciplinary Team) Approval</Title>
              <Alert
                message="MDT Approval Required"
                description="This request must be reviewed and approved by the Multidisciplinary Team before proceeding to the final consent form."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="mdt_approved" valuePropName="checked">
                    <Checkbox disabled={!readOnly}>MDT Approved</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="mdt_approval_date" label="MDT Approval Date">
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabled={!readOnly}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="mdt_notes" label="MDT Notes">
                    <TextArea rows={3} placeholder="MDT discussion notes..." disabled={!readOnly} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Action Buttons */}
            {!readOnly && (
              <Row gutter={16} style={{ marginTop: 24 }}>
                <Col>
                  <Button onClick={onBack}>Back to Leaflet</Button>
                </Col>
                <Col>
                  <Button onClick={onClose}>Cancel</Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit" size="large">
                    Save and Continue
                  </Button>
                </Col>
              </Row>
            )}
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default TvtPatientRequestForm;
