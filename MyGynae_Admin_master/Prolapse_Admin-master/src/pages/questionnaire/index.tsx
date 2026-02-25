import {
  changeQuestionnaire,
  createQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  getQuestionnaireByParentid,
  translate,
} from '@/api/questionnaire';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Alert, Button, message, Popconfirm } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { FC, useEffect, useRef, useState } from 'react';
import { history } from 'umi';

interface QuestionnaireInterface {
  ID: number;
  name: string;
  details: string;
  parentid: number;
}

const computerule = [
  { label: 'No Compute', value: 'no' },
  { label: 'KHQ', value: 'khq' },
  { label: 'PISQ', value: 'pisq' },
  { label: 'ICIQ', value: 'iciq' },
  { label: 'PGI', value: 'pgi' },
];

const Questionnaire: FC = () => {
  const ref = useRef<ActionType>();
  const [formRef] = useForm();
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const columns: ProColumns<QuestionnaireInterface>[] = [
    // {
    //   title: "Index",
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      dataIndex: 'ID',
      title: 'ID',
      width: 48,
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <a
          onClick={() =>
            history.push(`/survey/question/${record.ID}?name=${text}`)
          }
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Details',
      dataIndex: 'details',
      search: false,
      width: 200,
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      search: false,
      width: 160,
    },
    {
      title: 'CanSkip',
      dataIndex: 'skip',
      search: false,
      valueEnum: {
        1: { status: 'success', text: 'yes' },
        0: { status: 'error', text: 'no' },
      },
      width: 60,
    },
    {
      title: 'Compute Rule',
      dataIndex: 'computerule',
      search: false,
      valueEnum: {
        no: { text: 'No Compute' },
        khq: { text: 'KHQ' },
        pisq: { text: 'PISQ' },
        iciq: { text: 'ICIQ' },
        pgi: { text: 'PGI' },
      },
      width: 160,
    },
    {
      title: 'Parent ID',
      dataIndex: 'parentid',
      search: false,
      align: 'center',
      render: (text) => (text == 0 ? '-' : text),
    },
    {
      title: 'Option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() =>
            history.push(`/survey/question/${record.ID}?name=${record.name}`)
          }
        >
          DETAILS
        </a>,
        <a
          key="edit"
          onClick={() =>
            history.push(`/survey/editSurvey/${record.ID}?name=${record.name}`)
          }
        >
          EDIT SURVEY
        </a>,
        <ModalForm
          title="Edit"
          key="edit"
          width={440}
          form={formRef}
          onVisibleChange={(visible) => {
            if (visible) {
              formRef.setFieldsValue(record);
            }
          }}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values) => {
            const result = await changeQuestionnaire(record.ID, values);
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
            label="Compute Rule"
            name="computerule"
            rules={[{ required: true }]}
            options={computerule}
          />
          <ProFormRadio.Group
            label="CanSkip"
            name="skip"
            options={[
              { value: 1, label: 'yes' },
              { value: 0, label: 'no' },
            ]}
          />
          <ProFormTextArea label="Remark" name="remark" />
          <ProFormTextArea label="Details" name="details" />
          <ProFormSelect
            label="Parent"
            name="parentid"
            options={questionnaires}
          />
        </ModalForm>,
        <Popconfirm
          title="Are you Sure?"
          key="delete"
          onConfirm={async () => {
            const result = await deleteQuestionnaire(record.ID);
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
  useEffect(() => {
    (async () => {
      const result = await getQuestionnaireByParentid(0);
      if (!result.error) {
        setQuestionnaires(
          [...result].map((item) => ({
            label: item.name,
            value: item.ID,
          })),
        );
      }
    })();
  }, []);

  return (
    <PageContainer
      title={false}
      breadcrumb={{
        routes: [
          {
            path: '/survey/questionnaire',
            breadcrumbName: 'Questionnaire',
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
          <Button
            onClick={async () => {
              const result = await translate('zh');
              if (!result.error) {
                message.success('translate successfully');
              }
            }}
          >
            Translate Zh
          </Button>,
          <Button
            onClick={async () => {
              const result = await translate('he');
              if (!result.error) {
                message.success('translate successfully');
              }
            }}
          >
            Translate He
          </Button>,
          <ModalForm
            width={440}
            title="Create"
            modalProps={{ destroyOnClose: true }}
            onFinish={async (values) => {
              const result = await createQuestionnaire(values);
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
              label="Compute Rule"
              name="computerule"
              rules={[{ required: true }]}
              options={computerule}
            />
            <ProFormRadio.Group
              label="CanSkip"
              name="skip"
              options={[
                { value: 1, label: 'yes' },
                { value: 0, label: 'no' },
              ]}
            />
            <ProFormTextArea label="Details" name="details" />
            <ProFormTextArea label="Remark" name="remark" />
            <ProFormSelect
              label="Parent"
              name="parentid"
              options={questionnaires}
            />
          </ModalForm>,
        ]}
        request={async (params = {}) => {
          console.log(params);
          const result = await getQuestionnaire(params);
          if (!result.error) {
            return {
              data: result.data,
              total: result.count,
              success: true,
            };
          }
          return { success: false };
        }}
        pagination={{
          pageSize: 5,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};

export default Questionnaire;
