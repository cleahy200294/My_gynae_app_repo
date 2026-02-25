import { CheckCircleOutlined, CloseCircleOutlined, FileProtectOutlined, LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, Card, message, Modal, Space, Steps, Tag, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import moment from 'moment';
import styles from './style.less';
import {
  createTvtConsent,
  getTvtConsentByAnswer,
  getTvtConsentComplete,
  saveLeafletConfirmation,
  savePatientRequest,
  saveConsentForm,
  updateTvtConsentStatus,
  completeTvtConsent,
  TvtConsent,
  TvtLeafletConfirmation,
  TvtPatientRequest,
  TvtConsentForm,
  TvtConsentComplete,
} from '@/api/tvtConsent';
import TvtLeafletViewer from './TvtLeafletViewer';
import TvtPatientRequestForm from './TvtPatientRequestForm';
import TvtConsentForm from './TvtConsentForm';

const { Step } = Steps;
const { Title, Paragraph, Text } = Typography;

interface IProps {
  patientId: number;
  answerId: number;
  patientInfo: any;
  onClose: () => void;
  onComplete?: () => void;
  existingConsentId?: number;
}

const TvtConsentWorkflow: FC<IProps> = (props) => {
  const { patientId, answerId, patientInfo, onClose, onComplete, existingConsentId } = props;

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [consentData, setConsentData] = useState<TvtConsentComplete | null>(null);
  const [consentId, setConsentId] = useState<number | undefined>(existingConsentId);

  useEffect(() => {
    loadConsentData();
  }, [existingConsentId, answerId]);

  const loadConsentData = async () => {
    setLoading(true);
    try {
      if (existingConsentId) {
        // Load existing consent
        const result = await getTvtConsentComplete(existingConsentId);
        if (!result.error) {
          setConsentData(result);
          setConsentId(result.consent.ID);
          // Set current step based on status
          const step = getStepFromStatus(result.consent.status);
          setCurrentStep(step);
        }
      } else {
        // Check if consent already exists for this answer
        const existing = await getTvtConsentByAnswer(answerId);
        if (!existing.error && existing.ID) {
          const result = await getTvtConsentComplete(existing.ID);
          if (!result.error) {
            setConsentData(result);
            setConsentId(result.consent.ID);
            const step = getStepFromStatus(result.consent.status);
            setCurrentStep(step);
          }
        } else {
          // Create new consent
          const newConsent = await createTvtConsent(patientId, answerId);
          if (!newConsent.error) {
            setConsentId(newConsent.ID);
            setCurrentStep(0);
          } else {
            message.error('Failed to create TVT consent record');
          }
        }
      }
    } catch (error) {
      message.error('Failed to load consent data');
    } finally {
      setLoading(false);
    }
  };

  const getStepFromStatus = (status: string): number => {
    switch (status) {
      case 'started':
        return 0;
      case 'leaflet_completed':
        return 1;
      case 'request_completed':
        return 2;
      case 'consent_completed':
        return 3;
      default:
        return 0;
    }
  };

  const handleLeafletComplete = async (data: Partial<TvtLeafletConfirmation>) => {
    if (!consentId) return;

    setLoading(true);
    try {
      const result = await saveLeafletConfirmation(consentId, data);
      if (!result.error) {
        await updateTvtConsentStatus(consentId, 'leaflet_completed', 2);
        message.success('Information leaflet completed');
        setCurrentStep(1);
        await loadConsentData();
      } else {
        message.error('Failed to save leaflet confirmation');
      }
    } catch (error) {
      message.error('Failed to save leaflet confirmation');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestComplete = async (data: Partial<TvtPatientRequest>) => {
    if (!consentId) return;

    setLoading(true);
    try {
      const result = await savePatientRequest(consentId, data);
      if (!result.error) {
        await updateTvtConsentStatus(consentId, 'request_completed', 3);
        message.success('Patient request form completed');
        setCurrentStep(2);
        await loadConsentData();
      } else {
        message.error('Failed to save patient request');
      }
    } catch (error) {
      message.error('Failed to save patient request');
    } finally {
      setLoading(false);
    }
  };

  const handleConsentFormComplete = async (data: Partial<TvtConsentForm>) => {
    if (!consentId) return;

    setLoading(true);
    try {
      const result = await saveConsentForm(consentId, data);
      if (!result.error) {
        await completeTvtConsent(consentId);
        message.success('TVT consent process completed successfully!');
        setCurrentStep(3);

        Modal.success({
          title: 'TVT Consent Completed',
          content: (
            <div>
              <Paragraph>
                The TVT consent process has been completed successfully. All required signatures
                and confirmations have been collected.
              </Paragraph>
              <Paragraph>
                <Text strong>Patient:</Text> {patientInfo.firstname} {patientInfo.surname}
                <br />
                <Text strong>Completion Date:</Text> {moment().format('DD/MM/YYYY HH:mm')}
              </Paragraph>
            </div>
          ),
          onOk: () => {
            if (onComplete) onComplete();
            onClose();
          },
        });
      } else {
        message.error('Failed to save consent form');
      }
    } catch (error) {
      message.error('Failed to save consent form');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getPatientFullName = () => {
    return `${patientInfo.firstname || ''} ${patientInfo.surname || ''}`.trim();
  };

  if (loading && !consentData) {
    return (
      <div className={styles.tvtWorkflowContainer}>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: 60 }}>
            <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Paragraph style={{ marginTop: 16 }}>Loading TVT consent...</Paragraph>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tvtWorkflowContainer}>
      <div className={styles.content} style={{ maxWidth: 1400 }}>
        <div className={styles.workflowHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0, color: '#fff' }}>
                <FileProtectOutlined style={{ marginRight: 12 }} />
                TVT Consent Process
              </Title>
              <Paragraph style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.85)' }}>
                Patient: {getPatientFullName()} | DOB:{' '}
                {patientInfo.birthday?.format('DD/MM/YYYY') || 'N/A'}
              </Paragraph>
            </div>
            <CloseCircleOutlined
              style={{ fontSize: 28, color: '#fff', cursor: 'pointer' }}
              onClick={onClose}
            />
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* Progress Steps */}
          <Steps current={currentStep} style={{ marginBottom: 32 }}>
            <Step
              title="Information Leaflet"
              description="SUI Mesh Tapes Leaflet"
              icon={
                currentStep > 0 ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : undefined
              }
            />
            <Step
              title="Patient Request"
              description="Request for TVT Insertion"
              icon={
                currentStep > 1 ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : undefined
              }
            />
            <Step
              title="Consent Form"
              description="SUI Consent Form 2023"
              icon={
                currentStep > 2 ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : undefined
              }
            />
            <Step
              title="Complete"
              description="Process Completed"
              icon={
                currentStep === 3 ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : undefined
              }
            />
          </Steps>

          {/* Alert for HSE Pause */}
          <Alert
            message="Important: HSE Ireland TVT Pause (2018)"
            description="The Health Service Executive (HSE) in Ireland paused the use of transvaginal mesh for stress urinary incontinence in 2018. This consent process ensures full informed consent and documentation of alternative options."
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />

          {/* Step Content Cards */}
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Step 0: Leaflet */}
            <Card
              className={`${styles.stepCard} ${currentStep === 0 ? styles.active : ''} ${
                currentStep > 0 ? styles.completed : ''
              }`}
              title={
                <div className={styles.stepHeader}>
                  <div>
                    <span className={`${styles.stepNumber} ${currentStep > 0 ? styles.completed : ''}`}>
                      {currentStep > 0 ? '✓' : '1'}
                    </span>
                    <Text strong>Step 1: SUI Mesh Tapes Information Leaflet</Text>
                  </div>
                  {consentData?.leaflet?.confirmed_at && (
                    <Tag color="success">
                      Completed {moment(consentData.leaflet.confirmed_at).format('DD/MM/YYYY')}
                    </Tag>
                  )}
                </div>
              }
            >
              <Paragraph>
                Review the comprehensive 16-page BSUG/RCOG information leaflet about TVT/TVT-O
                procedures, risks, alternatives, and recovery.
              </Paragraph>
              {currentStep === 0 && (
                <Button
                  type="primary"
                  onClick={() => {
                    // Open leaflet viewer (will be rendered below)
                  }}
                >
                  Start: Read Information Leaflet
                </Button>
              )}
              {currentStep > 0 && (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  Leaflet reviewed and confirmed
                </Tag>
              )}
            </Card>

            {/* Step 1: Patient Request */}
            <Card
              className={`${styles.stepCard} ${currentStep === 1 ? styles.active : ''} ${
                currentStep > 1 ? styles.completed : ''
              }`}
              title={
                <div className={styles.stepHeader}>
                  <div>
                    <span className={`${styles.stepNumber} ${currentStep > 1 ? styles.completed : ''}`}>
                      {currentStep > 1 ? '✓' : '2'}
                    </span>
                    <Text strong>Step 2: Patient Request for TVT Insertion</Text>
                  </div>
                  {consentData?.request?.patient_signature_date && (
                    <Tag color="success">
                      Completed{' '}
                      {moment(consentData.request.patient_signature_date).format('DD/MM/YYYY')}
                    </Tag>
                  )}
                </div>
              }
            >
              <Paragraph>
                Confirm conservative treatment attempts, awareness of HSE pause, and acceptance of
                risks. Requires patient and consultant signatures.
              </Paragraph>
              {currentStep === 1 && (
                <Button type="primary">Continue to Patient Request Form</Button>
              )}
              {currentStep > 1 && (
                <Space>
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Patient request signed
                  </Tag>
                  {consentData?.request?.mdt_approved && (
                    <Tag color="success">MDT Approved</Tag>
                  )}
                </Space>
              )}
            </Card>

            {/* Step 2: Consent Form */}
            <Card
              className={`${styles.stepCard} ${currentStep === 2 ? styles.active : ''} ${
                currentStep > 2 ? styles.completed : ''
              }`}
              title={
                <div className={styles.stepHeader}>
                  <div>
                    <span className={`${styles.stepNumber} ${currentStep > 2 ? styles.completed : ''}`}>
                      {currentStep > 2 ? '✓' : '3'}
                    </span>
                    <Text strong>Step 3: SUI Consent Form 2023</Text>
                  </div>
                  {consentData?.form?.section_a_date && (
                    <Tag color="success">
                      Completed {moment(consentData.form.section_a_date).format('DD/MM/YYYY')}
                    </Tag>
                  )}
                </div>
              }
            >
              <Paragraph>
                Complete the comprehensive consent form with 6 signature sections covering patient
                agreement, professional confirmation, interpreter (if needed), and day-of-procedure
                confirmations.
              </Paragraph>
              {currentStep === 2 && (
                <Button type="primary">Continue to Consent Form</Button>
              )}
              {currentStep > 2 && (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  All sections signed
                </Tag>
              )}
            </Card>

            {/* Step 3: Completion */}
            {currentStep === 3 && (
              <Card className={styles.stepCard} style={{ background: '#f6ffed', borderColor: '#52c41a' }}>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
                  <Title level={3} style={{ color: '#52c41a' }}>
                    TVT Consent Process Completed
                  </Title>
                  <Paragraph>
                    All required documentation has been completed and signed. The patient may now
                    proceed with the TVT procedure pending final pre-operative checks.
                  </Paragraph>
                  <Space style={{ marginTop: 24 }}>
                    <Button type="primary" onClick={onClose}>
                      Close
                    </Button>
                    <Button>Generate PDF Report</Button>
                  </Space>
                </div>
              </Card>
            )}
          </Space>
        </div>

        {/* Render Current Step Component */}
        {currentStep === 0 && consentId && (
          <TvtLeafletViewer
            consentId={consentId}
            patientName={getPatientFullName()}
            onComplete={handleLeafletComplete}
            onClose={onClose}
            existingData={consentData?.leaflet}
            readOnly={consentData?.consent?.status !== 'started'}
          />
        )}

        {currentStep === 1 && consentId && (
          <TvtPatientRequestForm
            consentId={consentId}
            patientInfo={patientInfo}
            onComplete={handleRequestComplete}
            onBack={handleBack}
            onClose={onClose}
            existingData={consentData?.request}
            readOnly={consentData?.consent?.status !== 'leaflet_completed'}
          />
        )}

        {currentStep === 2 && consentId && (
          <TvtConsentForm
            consentId={consentId}
            patientInfo={patientInfo}
            onComplete={handleConsentFormComplete}
            onBack={handleBack}
            onClose={onClose}
            existingData={consentData?.form}
            readOnly={consentData?.consent?.status !== 'request_completed'}
          />
        )}
      </div>
    </div>
  );
};

export default TvtConsentWorkflow;
