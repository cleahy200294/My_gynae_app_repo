import { CloseCircleOutlined, FilePdfOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, message, Row, Space, Typography } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import styles from './style.less';
import { TvtLeafletConfirmation } from '@/api/tvtConsent';

const { Title, Paragraph, Text } = Typography;

interface IProps {
  consentId: number;
  patientName: string;
  onComplete: (data: Partial<TvtLeafletConfirmation>) => void;
  onClose: () => void;
  existingData?: TvtLeafletConfirmation;
  readOnly?: boolean;
}

const TvtLeafletViewer: FC<IProps> = (props) => {
  const { consentId, patientName, onComplete, onClose, existingData, readOnly = false } = props;
  const [form] = Form.useForm();
  const [signature, setSignature] = useState('');
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const canvasRef = useRef() as any;

  useEffect(() => {
    if (existingData) {
      form.setFieldsValue({
        understood_procedure: existingData.understood_procedure,
        understood_alternatives: existingData.understood_alternatives,
        understood_risks: existingData.understood_risks,
        understood_recovery: existingData.understood_recovery,
        understood_questions: existingData.understood_questions,
      });
      if (existingData.patient_signature) {
        setSignature(existingData.patient_signature);
        canvasRef.current?.fromDataURL(existingData.patient_signature, { ratio: 1 });
      }
    }
  }, [existingData]);

  const clearSignature = () => {
    canvasRef.current?.clear();
    setSignature('');
  };

  const handleFinish = (values: any) => {
    if (!signature && !readOnly) {
      message.warn('Please provide your signature');
      return;
    }

    const data: Partial<TvtLeafletConfirmation> = {
      understood_procedure: values.understood_procedure,
      understood_alternatives: values.understood_alternatives,
      understood_risks: values.understood_risks,
      understood_recovery: values.understood_recovery,
      understood_questions: values.understood_questions,
      patient_signature: signature,
      confirmed_at: new Date().toISOString(),
    };

    onComplete(data);
  };

  return (
    <div className={styles.tvtLeafletContainer}>
      <div className={styles.header}>
        <Title level={3}>
          <FilePdfOutlined style={{ marginRight: 8 }} />
          SUI Mesh Tapes Information Leaflet
        </Title>
        <CloseCircleOutlined className={styles.closeIcon} onClick={onClose} />
      </div>

      <div className={styles.content}>
        {/* PDF Viewer Section */}
        <div className={styles.pdfSection}>
          <div className={styles.pdfNotice}>
            <Paragraph>
              <strong>Important:</strong> Please read the complete SUI Mesh Tapes Information
              Leaflet carefully before proceeding.
            </Paragraph>
            <Paragraph>
              The leaflet is a joint publication by the British Society of Urogynaecology (BSUG)
              and the Royal College of Obstetricians and Gynaecologists (RCOG).
            </Paragraph>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              size="large"
              href="/documents/sui-mesh-tapes-leaflet.pdf"
              target="_blank"
              onClick={() => setPdfLoaded(true)}
            >
              Open SUI Mesh Tapes Leaflet (16 pages)
            </Button>
          </div>

          {/* Embedded PDF viewer */}
          <div className={styles.pdfEmbed}>
            <iframe
              src="/documents/sui-mesh-tapes-leaflet.pdf"
              width="100%"
              height="800px"
              style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}
              title="SUI Mesh Tapes Information Leaflet"
              onLoad={() => setPdfLoaded(true)}
            />
          </div>
        </div>

        {/* Information Checklist (from Page 16) */}
        <div className={styles.checklistSection}>
          <Title level={4}>
            <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            Information Checklist
          </Title>
          <Paragraph>
            Before proceeding, please confirm that you have read and understood the following
            information from the leaflet:
          </Paragraph>

          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Form.Item
                name="understood_procedure"
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
                    I understand what the TVT/TVT-O procedure involves and why it has been
                    recommended for me
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    (Covers: What is stress urinary incontinence, explanation of terms, how the
                    procedure works)
                  </Text>
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
                    I understand the alternative treatment options available, both surgical and
                    non-surgical
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    (Covers: Pelvic floor exercises, pessaries, other surgical options including
                    colposuspension and fascial sling)
                  </Text>
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="understood_risks"
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
                    I understand the risks and possible complications of the TVT/TVT-O procedure
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    (Covers: Very common, common, uncommon, and rare complications including mesh
                    exposure, chronic pain, voiding difficulties, and need for repeat surgery)
                  </Text>
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="understood_recovery"
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
                    I understand what to expect during recovery and what activities to avoid
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    (Covers: Recovery timeline, activity restrictions, when to seek help, follow-up
                    appointments)
                  </Text>
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="understood_questions"
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
                    I have had the opportunity to ask questions and all my questions have been
                    answered to my satisfaction
                  </Text>
                </Checkbox>
              </Form.Item>

              {/* Signature Section */}
              <div className={styles.signatureSection}>
                <Title level={5}>Patient Signature</Title>
                <Paragraph type="secondary">
                  By signing below, you confirm that you have read and understood the SUI Mesh
                  Tapes Information Leaflet.
                </Paragraph>

                <div
                  className={styles.signatureCanvas}
                  style={{
                    border: '2px solid #d9d9d9',
                    borderRadius: 4,
                    backgroundColor: '#fafafa',
                  }}
                >
                  <SignatureCanvas
                    ref={canvasRef}
                    canvasProps={{
                      width: 500,
                      height: 150,
                      className: 'signature-canvas',
                    }}
                    onEnd={() => {
                      if (canvasRef.current) {
                        setSignature(canvasRef.current.toDataURL());
                      }
                    }}
                    disabled={readOnly}
                  />
                </div>

                {!readOnly && (
                  <Button
                    onClick={clearSignature}
                    style={{ marginTop: 8 }}
                    disabled={!signature}
                  >
                    Clear Signature
                  </Button>
                )}

                <Paragraph style={{ marginTop: 16 }}>
                  <Text strong>Patient Name:</Text> {patientName}
                  <br />
                  <Text strong>Date:</Text> {new Date().toLocaleDateString('en-GB')}
                </Paragraph>
              </div>

              {/* Action Buttons */}
              {!readOnly && (
                <Row gutter={16} style={{ marginTop: 24 }}>
                  <Col>
                    <Button onClick={onClose}>Cancel</Button>
                  </Col>
                  <Col>
                    <Button type="primary" htmlType="submit" size="large">
                      Confirm and Continue to Next Step
                    </Button>
                  </Col>
                </Row>
              )}
            </Space>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default TvtLeafletViewer;
