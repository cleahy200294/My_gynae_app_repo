import { deleteOperativeNote, OperativeNote, updateOperativeNote } from '@/api/patient';
import { root } from '@/utils/request';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { ProForm, ProFormDatePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Descriptions, Drawer, message, Popconfirm, Space } from 'antd';
import moment from 'moment';
import { ReactElement, useState } from 'react';

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

interface OperativeNoteDetailsModalProps {
  operativeNote: OperativeNote | null;
  trigger: ReactElement;
  onUpdate: () => void;
  onDelete: () => void;
}

const OperativeNoteDetailsModal: React.FC<OperativeNoteDetailsModalProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleDelete = async () => {
    if (!props.operativeNote) return;

    try {
      const result = await deleteOperativeNote(props.operativeNote.ID);
      if (!result.error) {
        message.success('Operative note deleted successfully');
        setVisible(false);
        props.onDelete();
      } else {
        message.error('Failed to delete operative note');
      }
    } catch (error) {
      message.error('An error occurred while deleting');
      console.error('Delete error:', error);
    }
  };

  const handleUpdate = async (values: any) => {
    if (!props.operativeNote) return false;

    try {
      const updateData = {
        surgeryDate: values.surgeryDate.format('YYYY-MM-DD HH:mm:ss'),
        surgeonName: values.surgeonName,
        complications: values.complications || '',
        deviceSerialNumber: values.deviceSerialNumber || '',
        notes: values.notes || '',
      };

      const result = await updateOperativeNote(props.operativeNote.ID, updateData);

      if (!result.error) {
        message.success('Operative note updated successfully');
        setEditMode(false);
        props.onUpdate();
        return true;
      } else {
        message.error('Failed to update operative note');
        return false;
      }
    } catch (error) {
      message.error('An error occurred while updating');
      console.error('Update error:', error);
      return false;
    }
  };

  const downloadFile = (filePath: string) => {
    const link = document.createElement('a');
    link.href = `${root}/${filePath}`;
    link.download = filePath.split('/').pop() || 'operative_note.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!props.operativeNote) return null;

  return (
    <>
      <span onClick={() => setVisible(true)}>{props.trigger}</span>
      <Drawer
        title={
          <Space>
            <FileProtectOutlined />
            Operative Note Details
          </Space>
        }
        width={600}
        open={visible}
        onClose={() => {
          setVisible(false);
          setEditMode(false);
        }}
        extra={
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => window.open(`${root}/${props.operativeNote?.filePath}`)}
            >
              View PDF
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => props.operativeNote && downloadFile(props.operativeNote.filePath)}
            >
              Download
            </Button>
          </Space>
        }
      >
        {!editMode ? (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Surgery Date">
                {moment(props.operativeNote.surgeryDate).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Surgeon">
                {props.operativeNote.surgeonName}
              </Descriptions.Item>
              <Descriptions.Item label="Procedure">
                {surgicalList[props.operativeNote.procedureType]}
              </Descriptions.Item>
              <Descriptions.Item label="Complications/Outcomes">
                {props.operativeNote.complications || 'None reported'}
              </Descriptions.Item>
              <Descriptions.Item label="Device Serial Number">
                {props.operativeNote.deviceSerialNumber || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Additional Notes">
                {props.operativeNote.notes || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Uploaded">
                {moment(props.operativeNote.createdAt).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
              {props.operativeNote.updatedAt &&
                props.operativeNote.updatedAt !== props.operativeNote.createdAt && (
                  <Descriptions.Item label="Last Updated">
                    {moment(props.operativeNote.updatedAt).format('YYYY-MM-DD HH:mm')}
                  </Descriptions.Item>
                )}
            </Descriptions>

            <Space style={{ marginTop: 24 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setEditMode(true)}
              >
                Edit Metadata
              </Button>
              <Popconfirm
                title="Delete Operative Note"
                description="Are you sure you want to delete this operative note? This action cannot be undone."
                onConfirm={handleDelete}
                okText="Yes, Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </>
        ) : (
          <ProForm
            initialValues={{
              surgeryDate: moment(props.operativeNote.surgeryDate),
              surgeonName: props.operativeNote.surgeonName,
              complications: props.operativeNote.complications,
              deviceSerialNumber: props.operativeNote.deviceSerialNumber,
              notes: props.operativeNote.notes,
            }}
            onFinish={handleUpdate}
            submitter={{
              searchConfig: {
                resetText: 'Cancel',
                submitText: 'Save Changes',
              },
              resetButtonProps: {
                onClick: () => setEditMode(false),
              },
            }}
          >
            <ProFormDatePicker
              name="surgeryDate"
              label="Surgery Date/Time"
              rules={[{ required: true }]}
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
              rules={[{ required: true }]}
            />

            <ProFormTextArea
              name="complications"
              label="Complications/Outcomes"
              fieldProps={{
                rows: 3,
                maxLength: 1000,
                showCount: true,
              }}
            />

            <ProFormText
              name="deviceSerialNumber"
              label="Device Serial Number"
            />

            <ProFormTextArea
              name="notes"
              label="Additional Notes"
              fieldProps={{
                rows: 3,
                maxLength: 1000,
                showCount: true,
              }}
            />
          </ProForm>
        )}
      </Drawer>
    </>
  );
};

export default OperativeNoteDetailsModal;
