import { createDoctor, getDoctor } from '@/api/doctor';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import md5 from 'md5';
import { useRef } from 'react';

type DoctorInterface = {
  ID: number;
  name: number;
};

const Doctor: React.FC = (props) => {
  const ref = useRef<ActionType>();
  const [formRef] = useForm();

  const columns: ProColumns<DoctorInterface>[] = [
    {
      title: 'ID',
      dataIndex: 'ID',
    },
    {
      title: 'Name',
      dataIndex: 'Email',
    },
  ];

  return (
    <PageContainer
      title={false}
      breadcrumb={{
        routes: [
          {
            path: '/Doctor',
            breadcrumbName: 'Doctor List',
          },
        ],
      }}
    >
      <ProTable
        actionRef={ref}
        bordered
        rowKey="ID"
        columns={columns}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <ModalForm
            width={440}
            title="Create"
            modalProps={{ destroyOnClose: true }}
            onFinish={async (values) => {
              const result = await createDoctor({
                email: values.email,
                password: md5(values.email),
              });
              if (!result.error) {
                message.success('created successfully');
                ref.current?.reload();
                return true;
              }
              return false;
            }}
            trigger={
              <Button key="button" icon={<PlusOutlined />} type="primary">
                Create
              </Button>
            }
          >
            <ProFormText
              label="Email"
              name="email"
              rules={[{ required: true }]}
            />
          </ModalForm>,
        ]}
        request={async () => {
          const result = await getDoctor();
          if (!result.error) {
            return {
              data: result,
              success: true,
            };
          }
          return { success: false };
        }}
        search={false}
        pagination={false}
      />
    </PageContainer>
  );
};

export default Doctor;
