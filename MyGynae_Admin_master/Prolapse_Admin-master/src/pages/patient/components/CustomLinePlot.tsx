import { Line, LineConfig } from '@ant-design/charts';
import { Alert, Card, Modal } from 'antd';
import moment from 'moment';
import { FC, useState } from 'react';

type Type = 'khq' | 'pisq' | 'iciq' | 'pgi';
interface Iprops {
  answerList: any[];
  type: Type;
  pref: React.Ref<undefined>;
  message: string;
}

const CustomLinePlot: FC<Iprops> = (props) => {
  const { answerList, type, pref, message } = props;
  const data = generateData(type, answerList);
  const config: LineConfig = {
    data,
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    xAxis: { title: { text: 'Meeting Time' } },
    yAxis: { title: { text: generateXText(type) } },
    seriesField: 'category',
    smooth: true,
    label:
      type == 'pgi'
        ? {
            content: (c: any) => {
              if (c.category == 'PGI-I') {
                return c.value == 1
                  ? 'Very much better'
                  : c.value == 2
                  ? 'Much better'
                  : c.value == 3
                  ? 'A little better'
                  : c.value == 4
                  ? 'No change'
                  : c.value == 5
                  ? 'A little worse'
                  : c.value == 6
                  ? 'Much worse'
                  : c.value == 7
                  ? 'Very much worse'
                  : 'None';
              }
              if (c.category == 'PGI-S') {
                return c.value == 1
                  ? 'Normal'
                  : c.value == 2
                  ? 'Mild'
                  : c.value == 3
                  ? 'Moderate'
                  : c.value == 4
                  ? 'Severe'
                  : 'None';
              }
              if (c.category == 'PGI-C') {
                return c.value == 1
                  ? 'A great deal better and a considerable improvement that has made all the difference'
                  : c.value == 2
                  ? 'Better and a definite improvement that has made a real and worthwhile difference'
                  : c.value == 3
                  ? 'Moderately better and a slight but noticeable change'
                  : c.value == 4
                  ? 'Somewhat better but the change has not mode any real difference'
                  : c.value == 5
                  ? 'A little better but no noticeable change'
                  : c.value == 6
                  ? 'Almost the same hardly any change at all'
                  : c.value == 7
                  ? 'No change (or condition has got worse)'
                  : 'None';
              }
            },
          }
        : {},
    point: {
      size: 3,
    },
  };

  const [visible, setVisible] = useState(false);

  return (
    <>
      <Card
        hoverable
        size="small"
        className="plot"
        onClick={() => setVisible(true)}
      >
        <Line
          ref={pref}
          {...config}
          tooltip={false}
          legend={false}
          className="cardbox"
        />
      </Card>
      <Modal
        width={600}
        open={visible}
        cancelButtonProps={{ hidden: true }}
        onOk={() => setVisible(false)}
        closable={false}
      >
        <Line {...config} className="cardbox" />
        <Alert
          type="info"
          style={{ fontSize: 12, padding: 4, margin: '24px 8px' }}
          message={message}
        ></Alert>
      </Modal>
    </>
  );
};

export default CustomLinePlot;

const generateXText = (type: Type): string => {
  let text;
  switch (type) {
    case 'khq':
      text = 'KHQ Score';
      break;
    case 'pisq':
      text = 'PISQ Score';
      break;
    case 'iciq':
      text = 'ICIQ-UI Score';
      break;
    case 'pgi':
      text = 'PGI Score';
      break;
  }
  return text;
};

const generateData = (type: Type, answerList: any[]) => {
  if (type == 'khq') {
    return [
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq1 ? +item.khq1 : undefined,
        category: 'General health perceptions',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq2 ? +item.khq2 : undefined,
        category: 'Incontinence impact',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq3 ? +item.khq3 : undefined,
        category: 'Role limitations',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq4 ? +item.khq4 : undefined,
        category: 'Physical limitations',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq5 ? +item.khq5 : undefined,
        category: 'Social limitations',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq6 ? +item.khq6 : undefined,
        category: 'Personal relationships',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq7 ? +item.khq7 : undefined,
        category: 'Emotions',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq8 ? +item.khq8 : undefined,
        category: 'Sleep/energy',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq9 ? +item.khq9 : undefined,
        category: 'Severity measures',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.khq10 ? +item.khq10 : undefined,
        category: 'Symptom severity',
      })),
    ];
  }
  if (type == 'pgi') {
    return [
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.pgii ? +item.pgii : undefined,
        category: 'PGI-I',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.pgic ? +item.pgic : undefined,
        category: 'PGI-C',
      })),
      ...answerList.map((item) => ({
        time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
        value: item.pgis ? +item.pgis : undefined,
        category: 'PGI-S',
      })),
    ];
  }
  return answerList.map((item) => ({
    time: moment(item.CreatedAt).format('YY-MM-DD hh:mm'),
    value: item[type] ? +item[type] : undefined,
  }));
};
