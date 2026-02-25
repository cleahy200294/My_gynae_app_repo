import { CopyrightOutlined } from '@ant-design/icons';

export default () => {

  const currentYear = new Date().getFullYear();

  return (
    <div style={{ textAlign: 'center', fontSize: 12, padding: '12px 0', color: '#999' }}><CopyrightOutlined /> {`${currentYear} Yanlin Mi`}</div>
  );
};
