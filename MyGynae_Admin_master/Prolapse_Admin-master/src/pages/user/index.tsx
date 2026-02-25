import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-form';
import { Button, Card, Col, Form, Row, Space } from 'antd';
import { FC } from 'react';
import md5 from 'md5';
import { history } from 'umi';
import styles from './index.less';
import { logIn } from '@/api/account';
const reg =
  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

const Login: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.cover}></div>
      <Row className={styles.bannerBox}>
        <Col
          xs={{ span: 20, offset: 2 }}
          sm={{ span: 16, offset: 4 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 10, offset: 7 }}
        >
          <div className={`${styles.boxCard} cardBox`}>
            <div className={styles.title1}>MyGynae Admin</div>
            <Form
              onFinish={async (values) => {
                values.password = md5(values.password);
                const result = await logIn(values);
                if (!result.error) {
                  localStorage.setItem('prol-a-token', result.token);
                  history.replace('/');
                }
              }}
            >
              <ProFormText
                fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
                placeholder="Username"
                name="email"
                rules={[
                  { pattern: reg, message: 'Please enter correct Email ID' },
                  { required: true, message: 'THIS FIELD IS REQUIRED' },
                ]}
              />
              <ProFormText.Password
                fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                placeholder="Password"
                name="password"
                rules={[{ required: true, message: 'THIS FIELD IS REQUIRED' }]}
              />
              <button type="submit" className={styles.button}>
                Login
              </button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
