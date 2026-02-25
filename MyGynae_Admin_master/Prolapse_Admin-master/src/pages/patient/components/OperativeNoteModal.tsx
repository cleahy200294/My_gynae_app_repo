import { uploadOperativeNote } from '@/api/patient';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, message, Upload, Button } from 'antd';
import moment from 'moment';
import { ReactElement, useRef } from 'react';

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

interface OperativeNoteModalProps {
  patientId: number;
  answerList: any[];
  trigger: ReactElement;
  onSuccess: () => void;
}

const OperativeNoteModal: React.FC<OperativeNoteModalProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  return (
    <ModalForm
      title="Upload Operative Note"
      width={700}
      formRef={formRef}
      trigger={props.trigger}
      modalProps={{ maskClosable: false }}
      onOpenChange={(open) => {
        if (!open) {
          formRef.current?.resetFields();
        }
      }}
      onFinish={async (values) => {
        try {
          const formData = new FormData();

          // Add file
          if (values.file && values.file[0]) {
            formData.append('file', values.file[0].originFileObj);
          } else {
            message.error('Please upload a PDF file');
            return false;
          }

          // Add metadata
          formData.append('patientId', props.patientId.toString());
          formData.append('answerId', values.answerId.toString());
          formData.append('surgeryDate', values.surgeryDate.format('YYYY-MM-DD HH:mm:ss'));
          formData.append('surgeonName', values.surgeonName);
          formData.append('procedureType', values.procedureType.toString());
          formData.append('complications', values.complications || '');
          formData.append('deviceSerialNumber', values.deviceSerialNumber || '');
          formData.append('notes', values.notes || '');

          const result = await uploadOperativeNote(formData);

          if (!result.error) {
            message.success('Operative note uploaded successfully');
            props.onSuccess();
            return true;
          } else {
            message.error(result.error || 'Upload failed');
            return false;
          }
        } catch (error) {
          message.error('An error occurred while uploading');
          console.error('Upload error:', error);
          return false;
        }
      }}
      layout="horizontal"
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
    >
      <ProFormSelect
        name="answerId"
        label="Surgical Procedure"
        rules={[{ required: true, message: 'Please select a surgical procedure' }]}
        options={props.answerList
          .filter((a) => a.surgical > 0)
          .map((a) => ({
            value: a.ID,
            label: `${surgicalList[a.surgical]} - ${moment(a.CreatedAt).format('YYYY-MM-DD')}`,
          }))}
        fieldProps={{
          onChange: (value) => {
            const answer = props.answerList.find((a) => a.ID === value);
            if (answer) {
              formRef.current?.setFieldsValue({
                procedureType: answer.surgical,
                surgeryDate: moment(answer.CreatedAt),
              });
            }
          },
        }}
      />

      <ProFormDatePicker
        name="surgeryDate"
        label="Surgery Date/Time"
        rules={[{ required: true, message: 'Please select surgery date' }]}
        fieldProps={{
          showTime: true,
          format: 'YYYY-MM-DD HH:mm',
          disabledDate: (current) => {
            return current && current > moment().endOf('day');
          },
        }}
        width="lg"
      />

      <ProFormText
        name="surgeonName"
        label="Surgeon Name"
        rules={[{ required: true, message: 'Please enter surgeon name' }]}
        placeholder="Dr. Name"
      />

      <Form.Item label="Procedure Type" shouldUpdate>
        {(form) => {
          const procedureType = form.getFieldValue('procedureType');
          return <span>{surgicalList[procedureType] || 'Please select a surgical procedure'}</span>;
        }}
      </Form.Item>

      <Form.Item name="procedureType" hidden>
        <input type="hidden" />
      </Form.Item>

      <Form.Item
        name="file"
        label="PDF File"
        rules={[{ required: true, message: 'Please upload a PDF file' }]}
      >
        <Upload
          beforeUpload={(file) => {
            const isPdf = file.type === 'application/pdf';
            const isLt10M = file.size / 1024 / 1024 < 10;

            if (!isPdf) {
              message.error('You can only upload PDF files!');
              return Upload.LIST_IGNORE;
            }
            if (!isLt10M) {
              message.error('PDF must be smaller than 10MB!');
              return Upload.LIST_IGNORE;
            }
            return false; // prevent auto upload
          }}
          maxCount={1}
          accept=".pdf"
        >
          <Button>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <ProFormTextArea
        name="complications"
        label="Complications/Outcomes"
        placeholder="Describe any complications or outcomes"
        fieldProps={{
          rows: 3,
          maxLength: 1000,
          showCount: true,
        }}
      />

      <ProFormText
        name="deviceSerialNumber"
        label="Device Serial Number"
        placeholder="Enter serial number if applicable"
      />

      <ProFormTextArea
        name="notes"
        label="Additional Notes"
        placeholder="Any additional notes"
        fieldProps={{
          rows: 3,
          maxLength: 1000,
          showCount: true,
        }}
      />
    </ModalForm>
  );
};

export default OperativeNoteModal;
