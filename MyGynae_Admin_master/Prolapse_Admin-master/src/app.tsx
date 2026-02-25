import { BasicLayoutProps } from '@ant-design/pro-layout';
import { Button } from 'antd';
import Footer from './components/Footer';
import { history } from 'umi';

export const layout = (): BasicLayoutProps => {
  return {
    footerRender: () => <Footer />,
    rightContentRender: () => {
      const token = localStorage.getItem('prol-a-token');
      if (token) {
        return (
          <Button
            type="link"
            onClick={() => {
              localStorage.removeItem('prol-a-token');
              history.push('/login');
            }}
          >
            Sign out
          </Button>
        );
      }
      return (
        <Button
          type="link"
          onClick={() => {
            history.push('/login');
          }}
        >
          Sign in
        </Button>
      );
    },
  };
};
