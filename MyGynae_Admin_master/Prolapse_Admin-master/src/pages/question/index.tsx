import {
  changeQuestion,
  createQuestion,
  deleteQuestion,
  getQuestion,
} from '@/api/question';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { FC, useRef, useState } from 'react';
import { useLocation, useParams } from 'umi';

interface QuestionInterface {
  ID: number;
  question: string;
  type: string;
  option: string;
  optionneedvalue: string;
  visible: number;
  conditionid: number;
  conditionoption: string;
}

const Question: FC = () => {
  const ref = useRef<ActionType>();
  const [formRef] = useForm();
  const { id } = useParams<{ id: string }>();
  const [isChoose, setIsChoose] = useState(false);
  const [isCondition, setIsCondition] = useState(false);
  const { query } = useLocation() as any;
  const columns: ProColumns<QuestionInterface>[] = [
    {
      title: 'Index',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      dataIndex: 'ID',
      title: 'ID',
      width: 48,
      align: 'center',
    },
    {
      title: 'Question',
      dataIndex: 'question',
      ellipsis: true,
      copyable: true,
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 60,
      align: 'center',
    },
    {
      title: 'Options',
      dataIndex: 'option',
      render: (item: any) =>
        item.split(',').map((ele: any) => <div>{ele}</div>),
      width: 300,
    },
    {
      title: 'Scores',
      dataIndex: 'optionscores',
      render: (item: any) =>
        item.split(',').map((ele: any) => <div>{ele}</div>),
      width: 100,
    },
    {
      title: 'Need Value',
      dataIndex: 'optionneedvalue',
      render: (item: any) =>
        item.split(',').map((ele: any) => <div>{ele}</div>),
      width: 100,
    },
    {
      title: 'Visible',
      dataIndex: 'visible',
      align: 'center',
      valueEnum: {
        0: 'always',
        1: 'condition',
      },
      width: 60,
    },
    {
      title: 'Condition ID',
      dataIndex: 'conditionid',
      width: 100,
      render: (text) => (text == 0 ? '-' : text),
    },
    {
      title: 'Option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => [
        <ModalForm
          width={440}
          form={formRef}
          title="Edit"
          onVisibleChange={(visible) => {
            if (visible) {
              const values: any = { ...record };
              setIsChoose(record.type != 'Input');
              setIsCondition(record.visible == 1);
              if (values.option && typeof values.option == 'string') {
                let scores = values.optionscores
                  ? values.optionscores.split(',')
                  : null;
                values.option = values.option
                  .split(',')
                  .map((item: string, index: number) => ({
                    op: item,
                    score: scores ? scores[index] : null,
                  }));
              }
              if (
                values.optionneedvalue &&
                typeof values.optionneedvalue == 'string'
              ) {
                values.optionneedvalue = values.optionneedvalue
                  .split(',')
                  .map((item: string) => ({ needvalue: item }));
              }
              formRef.setFieldsValue(values);
            }
          }}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values) => {
            values.questionnaireid = id;
            if (values.option) {
              values.optionscores = values.option.map(
                (item: any) => item.score,
              );
              values.option = values.option.map((item: any) => item.op);
            }
            if (values.optionneedvalue) {
              values.optionneedvalue = values.optionneedvalue.map(
                (item: any) => item.needvalue,
              );
            }
            const result = await changeQuestion(record.ID, values);
            if (!result.error) {
              message.success('created successfully');
              ref.current?.reload();
              return true;
            }
            return false;
          }}
          onValuesChange={(values) => {
            const { type, visible } = values;
            if (type != undefined) {
              setIsChoose(type != 'Input');
            }
            if (visible != undefined) {
              setIsCondition(visible == 1);
            }
          }}
          trigger={<a>EDIT</a>}
        >
          <ProFormText
            label="Question"
            name="question"
            rules={[{ required: true }]}
          />
          <ProFormSelect
            label="Type"
            name="type"
            rules={[{ required: true }]}
            options={['Radio', 'Checkbox', 'Input']}
          />
          {isChoose ? (
            <>
              <ProFormList
                label="Options"
                name="option"
                creatorButtonProps={{ creatorButtonText: 'New' }}
                copyIconProps={false}
                deleteIconProps={{ tooltipText: 'delete' }}
              >
                <Space size={12}>
                  <ProFormText name="op" placeholder="Input option" />
                  <ProFormDigit
                    fieldProps={{ precision: 0 }}
                    name="score"
                    placeholder="Input score"
                  />
                </Space>
              </ProFormList>
              <ProFormList
                label="OptionsNeedValue"
                name="optionneedvalue"
                creatorButtonProps={{ creatorButtonText: 'New' }}
                copyIconProps={false}
                deleteIconProps={{ tooltipText: 'delete' }}
              >
                <ProFormText name="needvalue" />
              </ProFormList>
            </>
          ) : null}
          <ProFormSelect
            initialValue={0}
            label="Visible"
            name="visible"
            rules={[{ required: true }]}
            options={[
              { label: 'Always', value: 0 },
              { label: 'Condition', value: 1 },
            ]}
          />
          {isCondition ? (
            <>
              <ProFormText
                label="ConditionID"
                name="conditionid"
                rules={[{ required: true }]}
              />
              <ProFormText
                label="ConditionOption"
                name="conditionoption"
                rules={[{ required: true }]}
              />
            </>
          ) : null}
        </ModalForm>,
        <Popconfirm
          title="Are you Sure?"
          key="delete"
          onConfirm={async () => {
            const result = await deleteQuestion(record.ID);
            if (!result.error) {
              message.success('deleted successfully');
              ref.current?.reload();
            }
          }}
        >
          <a>DELETE</a>
        </Popconfirm>,
        <Popconfirm
          title="Are you Sure?"
          key="copy"
          onConfirm={async () => {
            const values: any = { ...record };
            delete values.ID;
            delete values.CreatedAt;
            delete values.UpdatedAt;
            delete values.DeletedAt;
            const result = await createQuestion(values);
            if (!result.error) {
              message.success('copy successfully');
              ref.current?.reload();
            }
          }}
        >
          <a>COPY</a>
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
            path: '/survey/questionnaire',
            breadcrumbName: 'Questionnaire',
          },
          {
            path: '/survey/question/',
            breadcrumbName: query.name,
          },
        ],
      }}
    >
      <ProTable
        actionRef={ref}
        bordered
        rowKey="ID"
        columns={columns}
        search={false}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <ModalForm
            width={440}
            title="Create"
            onVisibleChange={(visible) => {
              if (visible) {
                setIsChoose(false);
                setIsCondition(false);
              }
            }}
            modalProps={{ destroyOnClose: true }}
            onFinish={async (values) => {
              values.questionnaireid = id;
              if (values.option) {
                values.optionscores = values.option.map(
                  (item: any) => item.score,
                );
                values.option = values.option.map((item: any) => item.op);
              }
              if (values.optionneedvalue) {
                values.optionneedvalue = values.optionneedvalue.map(
                  (item: any) => item.needvalue,
                );
              }
              const result = await createQuestion(values);
              if (!result.error) {
                message.success('created successfully');
                ref.current?.reload();
                return true;
              }
              return false;
            }}
            onValuesChange={(values) => {
              const { type, visible } = values;
              if (type != undefined) {
                setIsChoose(type != 'Input');
              }
              if (visible != undefined) {
                setIsCondition(visible == 1);
              }
            }}
            trigger={
              <Button key="button" icon={<PlusOutlined />} type="primary">
                Create
              </Button>
            }
          >
            <ProFormText
              label="Question"
              name="question"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="Type"
              name="type"
              rules={[{ required: true }]}
              options={['Radio', 'Checkbox', 'Input']}
            />
            {isChoose ? (
              <>
                <ProFormList
                  label="Options"
                  name="option"
                  creatorButtonProps={{ creatorButtonText: 'New' }}
                  copyIconProps={{ tooltipText: 'copy' }}
                  deleteIconProps={{ tooltipText: 'delete' }}
                >
                  <Space size={12}>
                    <ProFormText name="op" placeholder="Input option" />
                    <ProFormDigit
                      fieldProps={{ precision: 0 }}
                      name="score"
                      placeholder="Input score"
                    />
                  </Space>
                </ProFormList>
                <ProFormList
                  label="Options Need Value"
                  name="optionneedvalue"
                  creatorButtonProps={{ creatorButtonText: 'New' }}
                  copyIconProps={{ tooltipText: 'copy' }}
                  deleteIconProps={{ tooltipText: 'delete' }}
                >
                  <ProFormText name="needvalue" />
                </ProFormList>
              </>
            ) : null}
            <ProFormSelect
              initialValue={0}
              label="Visible"
              name="visible"
              rules={[{ required: true }]}
              options={[
                { label: 'Always', value: 0 },
                { label: 'Condition', value: 1 },
              ]}
            />
            {isCondition ? (
              <>
                <ProFormText
                  label="ConditionID"
                  name="conditionid"
                  rules={[{ required: true }]}
                />
                <ProFormText
                  label="ConditionOption"
                  name="conditionoption"
                  rules={[{ required: true }]}
                />
              </>
            ) : null}
          </ModalForm>,
        ]}
        request={async (params = {}) => {
          console.log(params);
          const result = await getQuestion(+id);
          if (!result.error) {
            return {
              data: result,
              success: true,
            };
          }
          return { success: false };
        }}
        pagination={false}
      />
    </PageContainer>
  );
};

export default Question;
