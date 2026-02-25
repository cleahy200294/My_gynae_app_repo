import {
  deletePatientDoc,
  exportPatientList,
  getPatientList,
  getOperativeNotes,
  OperativeNote,
  resetUserWaiting,
} from '@/api/patient';
import { root } from '@/utils/request';
import { CheckOutlined, FileProtectOutlined, UploadOutlined } from '@ant-design/icons';
import { ActionType } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {
  Button,
  FormInstance,
  message,
  Space,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import moment from 'moment';
import { useRef, useState } from 'react';
import { history } from 'umi';
import UrodynamicsModal from './components/UrodynamicsModal';
import OperativeNoteDetailsModal from './components/OperativeNoteDetailsModal';

type PatientList = {
  ID: number;
  accountid: number;
  email: string;
  firstname: string;
  surname: string;
  birthday: string;
  weight: number;
  height: number;
  complaint: string;
  medicalhistory: string;
  pastsurgery: string;
  currentmedication: string;
  documents: string;
  wating: number;
  urodynamics: string;
  operativeNotes?: OperativeNote[];
};

const Patient: React.FC = (props) => {
  const aRef = useRef<ActionType>();
  const fRef = useRef<FormInstance>();
  const [exporting, setExporting] = useState(false);
  const columns: ProColumns<PatientList>[] = [
    {
      title: 'Status',
      dataIndex: 'wating',
      search: false,
      align: 'center',
      valueEnum: {
        '1': { text: '', status: 'Error' },
        '0': { text: '', status: 'Success' },
      },
      render: (text, record) =>
        record.wating ? (
          <Space>
            <Tooltip title="Waiting for Respond" color="red">
              <Button
                style={{ transform: 'scale(0.8)' }}
                type="primary"
                danger
                icon={<CheckOutlined />}
                shape="circle"
                size="small"
                onClick={async () => {
                  const result = await resetUserWaiting(record.ID);
                  if (!result.error) {
                    aRef.current?.reload();
                  }
                }}
              ></Button>
            </Tooltip>
          </Space>
        ) : (
          text
        ),
    },
    {
      title: 'First Name',
      dataIndex: 'firstname',
      align: 'center',
    },
    {
      title: 'Surname',
      dataIndex: 'surname',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      search: false,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      align: 'center',
      search: false,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      search: false,
      render: (_, record) => {
        let duration = moment(record.birthday).toNow(true);
        if (duration.includes('year')) {
          duration = duration.split(' ')[0];
        }
        return duration;
      },
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      search: false,
      render: (_, record) => {
        let bmi = record.weight / Math.pow(record.height / 100, 2);
        return parseFloat(bmi.toFixed(2));
      },
    },
    {
      title: 'Document',
      dataIndex: 'documents',
      search: false,
      render: (_, record) => {
        var doc = record.documents;
        const operativeNotes = record.operativeNotes || [];
        return (
          <Space size={1} wrap>
            {/* Regular documents - Blue tags */}
            {doc
              ? doc.split(' , ').map((item, index) => (
                  <Tag
                    color="blue"
                    closable
                    onClose={() => {
                      deletePatientDoc(record.ID, item.split('/')[1]);
                    }}
                    key={`doc-${index}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      window.open(`${root}/${item}`);
                    }}
                  >
                    {item.split('_')[item.split('_').length - 1]}
                  </Tag>
                ))
              : null}

            {/* Operative notes - Red tags with icon */}
            {operativeNotes.map((note, index) => (
              <OperativeNoteDetailsModal
                key={`op-${index}`}
                operativeNote={note}
                trigger={
                  <Tag
                    color="red"
                    icon={<FileProtectOutlined />}
                    style={{ cursor: 'pointer' }}
                  >
                    OP: {moment(note.surgeryDate).format('MM/DD/YY')}
                  </Tag>
                }
                onUpdate={() => aRef.current?.reload()}
                onDelete={() => aRef.current?.reload()}
              />
            ))}

            {/* Existing document upload button */}
            <Upload
              action={`${root}/patient/document/upload/${record.ID}`}
              headers={{ token: localStorage.getItem('prol-a-token') as any }}
              onChange={(info) => {
                if (info.file.status === 'done') {
                  message.success(
                    `${info.file.name} file uploaded successfully`,
                  );
                  aRef.current?.reload();
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
              showUploadList={false}
            >
              <Button
                size="small"
                shape="circle"
                icon={<UploadOutlined />}
                type="primary"
              ></Button>
            </Upload>
          </Space>
        );
      },
    },
    {
      title: 'Operation',
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => [
        <a
          key="view"
          onClick={() => {
            history.push(`/patient/details/${record.ID}`);
          }}
        >
          Details
        </a>,
        <UrodynamicsModal
          key="uro"
          id={record.ID}
          urodynamics={record.urodynamics}
          reloadTable={() => aRef.current?.reload()}
        >
          <a>Urodynamics</a>
        </UrodynamicsModal>,
      ],
    },
  ];

  return (
    <PageContainer
      title={false}
      breadcrumb={{
        routes: [
          {
            path: '/patient',
            breadcrumbName: 'Patient List',
          },
        ],
      }}
    >
      <ProTable<PatientList>
        actionRef={aRef}
        formRef={fRef}
        columns={columns}
        request={async (params = {}) => {
          const result = await getPatientList(params);
          if (!result.error) {
            var { data, count } = result;
            data = data.map((item: any) => {
              delete item.children;
              console.log(item.ID);
              return item;
            });
            return {
              data: data,
              total: count,
              success: true,
            };
          }
          return { success: false };
        }}
        rowKey="ID"
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 12,
          showSizeChanger: true,
          pageSizeOptions: [6, 12, 24, 48],
        }}
        bordered
        dateFormatter="string"
        headerTitle="Patient List"
        rowSelection={{}}
        tableAlertRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => (
          <Space size={24}>
            <span>
              Have selected {selectedRowKeys.length} items
              <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                Cancel
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRowKeys }) => {
          return (
            <Space size={16}>
              <a
                onClick={async () => {
                  if (exporting) {
                    return;
                  }
                  setExporting(true);
                  message.loading('Exporting...', 0);
                  await exportPatientList(selectedRowKeys);
                  message.destroy();
                  message.info('Exported');
                  setExporting(false);
                }}
              >
                Export
              </a>
            </Space>
          );
        }}
      />
    </PageContainer>
  );
};

export default Patient;
