import {
  changeMeeting,
  createMeeting,
  deleteMeeting,
  getMeeting,
} from '@/api/meeting';
import { getQuestionnaireByParentid } from '@/api/questionnaire';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useRef, useState } from 'react';

type MeetingInterface = {
  ID: number;
  type: number;
  questionnaires: string;
};

const Meeting: React.FC = (props) => {
  const ref = useRef<ActionType>();
  const [formRef] = useForm();
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const result = await getQuestionnaireByParentid(0);
      if (!result.error) {
        setQuestionnaires(
          [...result].map((item) => ({
            label: item.remark ? item.remark : item.name,
            value: item.ID,
          })),
        );
      }
    })();
  }, []);

  const columns: ProColumns<MeetingInterface>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      valueEnum: {
        1: { text: 'First register' },
        2: { text: 'Selection after first' },
      },
    },
    {
      title: 'Questionnaires',
      dataIndex: 'questionnaires',
      render: (_, record) =>
        record.questionnaires
          .split(',')
          .map((id: string) => (
            <div>
              {questionnaires.filter((item) => item.value == id)[0]
                ? questionnaires.filter((item) => item.value == id)[0].label
                : id}
            </div>
          )),
    },
    {
      title: 'Option',
      valueType: 'option',
      render: (_, record) => [
        <ModalForm
          title="Edit"
          key="edit"
          width={440}
          form={formRef}
          onVisibleChange={(visible) => {
            if (visible) {
              formRef.setFieldsValue({
                ...record,
                questionnaires: record.questionnaires
                  .split(',')
                  .map((item) => +item),
              });
            }
          }}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values) => {
            const result = await changeMeeting(record.ID, values);
            if (!result.error) {
              message.success('changed successfully');
              ref.current?.reload();
              return true;
            }
            return false;
          }}
          trigger={<a>EDIT</a>}
        >
          <ProFormText label="Name" name="name" rules={[{ required: true }]} />
          <ProFormSelect
            label="Type"
            name="type"
            rules={[{ required: true }]}
            options={[
              { value: 1, label: 'First register' },
              { value: 2, label: 'Selection after first' },
            ]}
          />
          <ProFormSelect
            mode="multiple"
            label="Questionnaires"
            name="questionnaires"
            options={questionnaires}
          />
        </ModalForm>,
        <Popconfirm
          title="Are you Sure?"
          key="delete"
          onConfirm={async () => {
            const result = await deleteMeeting(record.ID);
            if (!result.error) {
              message.success('deleted successfully');
              ref.current?.reload();
            }
          }}
        >
          <a>DELETE</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      title={false}
      breadcrumb={{
        routes: [
          {
            path: '/meeting',
            breadcrumbName: 'Meeting Lidt',
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
              const result = await createMeeting(values);
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
              label="Name"
              name="name"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="Type"
              name="type"
              rules={[{ required: true }]}
              options={[
                { value: 1, label: 'First register' },
                { value: 2, label: 'Selection after first' },
              ]}
            />
            <ProFormSelect
              label="Questionnaires"
              name="questionnaires"
              options={questionnaires}
              mode="multiple"
            />
          </ModalForm>,
        ]}
        request={async (params = {}) => {
          const result = await getMeeting(params);
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

export default Meeting;
