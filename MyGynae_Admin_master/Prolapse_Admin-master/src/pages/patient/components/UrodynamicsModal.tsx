import { updateUrodynamics } from '@/api/patient';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Form, Input, Radio, Row, Space } from 'antd';
import { ReactElement, useRef, useState } from 'react';

const UrodynamicsModal: React.FC<{
  urodynamics: string;
  id: number;
  children: ReactElement;
  reloadTable: () => void;
}> = (props) => {
  const fRef = useRef<ProFormInstance>();

  const [yes, setYes] = useState('');

  return (
    <ModalForm
      onOpenChange={(open) => {
        if (open && props.urodynamics) {
          let form = JSON.parse(props.urodynamics);
          fRef.current?.setFieldsValue(form);
          setYes(form.sui);
        } else {
          fRef.current?.resetFields();
        }
      }}
      modalProps={{ maskClosable: false }}
      width={600}
      formRef={fRef}
      trigger={props.children}
      title="Urodynamics Results"
      onFinish={async (data) => {
        if (data) {
          if (data.sui != 'yes' && data.sui_yes) {
            delete data.sui_yes;
          }
          const result = await updateUrodynamics(
            props.id,
            JSON.stringify(data),
          );
          if (!result.error) {
            props.reloadTable();
            return true;
          }
        }
      }}
      layout="horizontal"
      labelCol={{ xs: 24, sm: 24, md: 10 }}
      wrapperCol={{ xs: 24, sm: 24, md: 13 }}
    >
      <ProFormDatePicker label="Date" name="date" style={{ width: '100%' }} />
      <ProFormText
        style={{ width: '100%' }}
        label="Post Void Residual"
        name="residual"
        fieldProps={{ suffix: 'ml' }}
      />
      <ProFormSelect
        style={{ width: '100%' }}
        label="Micturition curve"
        name="curve"
        options={['Normal', 'Prolonged', 'Intermittent', 'Fast']}
      />
      <ProFormText label="Qmax" name="qmax" fieldProps={{ suffix: 'ml/sec' }} />
      <Form.Item label="USI at" name="sui">
        <Radio.Group onChange={(e) => setYes(e.target.value)}>
          <Space direction="vertical" size={12}>
            <Radio value="yes">
              <Space>
                Yes
                {yes == 'yes' ? (
                  <Form.Item noStyle name="sui_yes">
                    <Input prefix="at" suffix="ml" />
                  </Form.Item>
                ) : null}
              </Space>
            </Radio>
            <Radio value="no">No USI identified</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
      <ProFormRadio.Group
        label="DO"
        name="doa"
        options={['Yes', 'No. Stable detrusor']}
      />
      <ProFormRadio.Group
        label="Cough induce DO"
        name="cough"
        options={['Yes', 'No']}
      />
      <ProFormRadio.Group
        label="Poor compliance"
        name="low"
        options={['Yes', 'No']}
      />
      <ProFormRadio.Group
        label="Pain during filling"
        name="pain"
        options={['Yes', 'No']}
      />
      <ProFormText
        label="Maximum Cystometric Capacity"
        name="mmc"
        fieldProps={{ suffix: 'ml' }}
      />
    </ModalForm>
  );
};

export default UrodynamicsModal;
