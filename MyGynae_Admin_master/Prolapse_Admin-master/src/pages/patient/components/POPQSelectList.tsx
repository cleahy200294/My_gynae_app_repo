import { Col, Row, Select } from 'antd';

const POPQSelectList: React.FC<{
  uterus?: number;
  value?: number[];
  onChange?: (value: number[]) => void;
}> = (props) => {
  const { uterus, value = [], onChange = () => {} } = props;
  return (
    <Row>
      <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 4 }}>
        <Select
          placeholder="POP-Q1"
          value={value[0]}
          onChange={(v) => {
            value[0] = v;
            onChange([...value]);
          }}
          options={[
            { value: '0' },
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
          ]}
        />
      </Col>
      <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 4 }}>
        <Select
          placeholder="POP-Q2"
          value={value[1]}
          onChange={(v) => {
            value[1] = v;
            onChange([...value]);
          }}
          options={[
            { value: '0' },
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
          ]}
        />
      </Col>
      <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 4 }}>
        <Select
          placeholder="POP-Q3"
          value={value[2]}
          onChange={(v) => {
            value[2] = v;
            onChange([...value]);
          }}
          options={[
            { value: '0' },
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
          ]}
        />
      </Col>
      <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 4 }}>
        <Select
          disabled={uterus == 2}
          placeholder="POP-Q4"
          value={uterus == 2 ? 0 : value[3]}
          onChange={(v) => {
            value[3] = v;
            onChange([...value]);
          }}
          options={[
            { value: '0' },
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
          ]}
        />
      </Col>
      <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 4 }}>
        <Select
          placeholder="POP-Q5"
          value={value[4]}
          onChange={(v) => {
            value[4] = v;
            onChange([...value]);
          }}
          options={[
            { value: '0' },
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
          ]}
        />
      </Col>
      <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 4 }} lg={{ span: 4 }}>
        <Select
          placeholder="POP-Q6"
          value={value[5]}
          onChange={(v) => {
            value[5] = v;
            onChange([...value]);
          }}
          options={[
            { value: '0' },
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
          ]}
        />
      </Col>
    </Row>
  );
};

export default POPQSelectList;
