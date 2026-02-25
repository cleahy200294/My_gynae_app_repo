import { getQuestion } from '@/api/question';
import { getQuestionnaireByParentid } from '@/api/questionnaire';
import { changeAnswer } from '@/api/question';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Space,
  Steps,
} from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.less';

interface Iprops {
  questionnaire: any;
  answer: any;
  ifCurrentAnswerDetail: boolean;
  meeting: any;
  onAnswerDrawerChange: () => void;
}

const SurveyAnswer: FC<Iprops> = (props) => {
  const {
    questionnaire,
    answer,
    ifCurrentAnswerDetail,
    meeting,
    onAnswerDrawerChange,
  } = props;
  const [current, setCurrent] = useState<number>(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [childrenQuestions, setChildrenQuestions] = useState<any>({});
  const [answerMap, setAnswerMap] = useState<any>(JSON.parse(answer.answer));

  const steps = useMemo(() => {
    if (!answer) {
      return [];
    }
    if (ifCurrentAnswerDetail) {
      return [meeting.questionnaires.split(',')[0]].map(
        (item) => questionnaire[item],
      );
    }
    return (meeting.questionnaires.split(',') as any[]).map(
      (item) => questionnaire[item],
    );
  }, [answer]);

  useEffect(() => {
    if (steps.length) {
      fetchQuestion(steps[current].ID);
      fetchChildren(steps[current].ID);
    }
  }, [steps, current]);

  const fetchChildren = async (id: number) => {
    const result = await getQuestionnaireByParentid(id);
    if (!result.error) {
      setChildren(result);
      setChildrenQuestions([]);
      result.forEach(async (item: any) => {
        const result = await getQuestion(item.ID);
        if (!result.error) {
          childrenQuestions[item.ID] = result;
          setChildrenQuestions({ ...childrenQuestions });
        }
      });
    }
  };

  const fetchQuestion = async (id: number) => {
    const result = await getQuestion(id);
    if (!result.error) {
      setQuestions(result);
    }
  };

  return (
    <>
      {ifCurrentAnswerDetail ? null : (
        <Steps current={current} onChange={(key) => setCurrent(key)}>
          {steps.map((item) => (
            <Steps.Step key={item.ID}></Steps.Step>
          ))}
        </Steps>
      )}
      {steps[current] ? (
        <div className={styles.container}>
          <div className={styles.title1}>{steps[current].name}</div>
          {ifCurrentAnswerDetail ? (
            <Questionnaire
              questions={questions}
              id={steps[current].ID}
              answerMap={answerMap}
              setAnswerMap={setAnswerMap}
            />
          ) : (
            <AnswerList
              questionnaire={steps[current]}
              questions={questions}
              answers={answerMap}
            />
          )}
          {children.map((item) => (
            <div key={item.ID}>
              <div className={styles.smallTitle}>
                <span>{item.name}</span>
              </div>
              {childrenQuestions[item.ID] ? (
                ifCurrentAnswerDetail ? (
                  <Questionnaire
                    questions={childrenQuestions[item.ID]}
                    id={questionnaire[item.ID].ID}
                    answerMap={answerMap}
                    setAnswerMap={setAnswerMap}
                  />
                ) : (
                  <AnswerList
                    questionnaire={questionnaire[item.ID]}
                    questions={childrenQuestions[item.ID]}
                    answers={answerMap}
                  />
                )
              ) : null}
            </div>
          ))}
          {ifCurrentAnswerDetail ? (
            <div className={styles.btnbox}>
              <Button
                type="primary"
                block
                onClick={async () => {
                  delete answer.DeletedAt;
                  const result = await changeAnswer(answer.ID, {
                    ...answer,
                    answer: JSON.stringify(answerMap),
                  });
                  if (!result.error) {
                    message.success('Modify Successful');
                    onAnswerDrawerChange();
                  }
                }}
              >
                Save
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default SurveyAnswer;

const AnswerList: FC<{
  questionnaire: any;
  questions: any[];
  answers: any;
}> = (props) => {
  const { questionnaire, questions, answers } = props;
  const answer = answers[questionnaire.ID];
  const indexMap = useMemo(() => {
    const cloneQuestions = [...questions];
    const indexM: any = {};
    cloneQuestions
      .filter((item) => item.visible == 0)
      .forEach((item, index) => {
        indexM[item.ID] = index + 1;
      });
    return indexM;
  }, [questions]);
  return (
    <Row gutter={[12, 12]}>
      {questions.map((item) =>
        answer[item.ID] ? (
          <Col span={24} key={item.ID}>
            {item.visible == 1 ? (
              <div className={styles.left}>
                <div className={styles.label}>{item.question}</div>
                <div className={styles.left}>
                  {formatAnswer(answer[item.ID], answer[`${item.ID}-extra`])}
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.label}>
                  {indexMap[item.ID]}. {item.question}
                </div>
                <div className={styles.left}>
                  {formatAnswer(answer[item.ID], answer[`${item.ID}-extra`])}
                </div>
              </div>
            )}
          </Col>
        ) : null,
      )}
    </Row>
  );
};

export const formatAnswer = (answer: string | Array<string>, extra: any) => {
  if (!extra) {
    return Array.isArray(answer) ? answer.join(' , ') : answer;
  }
  if (Array.isArray(answer)) {
    answer = answer.map((item) => {
      if (extra[item]) {
        return item + ': ' + extra[item];
      } else {
        return item;
      }
    });
    return answer.join(' , ');
  } else {
    return answer + ' ' + extra[answer];
  }
};

export const sum = (arr: number[]) => {
  return eval(arr.join('+'));
};

const Questionnaire: FC<{
  questions: any[];
  id: number;
  answerMap: any;
  setAnswerMap: (a: any) => void;
}> = (props) => {
  const { questions, id, answerMap, setAnswerMap } = props;
  const [indexMap, setIndexMap] = useState<any>({});
  const [answers, setAnswers] = useState<any>({});

  useEffect(() => {
    const map: any = {};
    [...questions]
      .filter((item) => item.visible == 0)
      .forEach((item, index) => {
        map[item.ID] = index + 1;
      });
    setIndexMap(map);
    setAnswers(answerMap[id] || {});
  }, [questions]);

  useEffect(() => {
    setAnswerMap({ ...answerMap, [id]: answers });
  }, [answers]);

  return (
    <Form labelCol={{ span: 24 }} colon={false}>
      {questions.map((item) =>
        item.visible == 0 ||
        (item.visible == 1 &&
          answerMap[id] &&
          answerMap[id][item.conditionid] == item.conditionoption) ? (
          <Question
            question={item}
            index={item.visible == 0 ? indexMap[item.ID] : null}
            key={item.ID}
            onChangeAnswer={(answer) => {
              setAnswers({ ...answers, [item.ID]: answer });
            }}
            answer={answers[item.ID]}
            onChangeExtra={(answer) => {
              setAnswers({ ...answers, [`${item.ID}-extra`]: answer });
            }}
            extra={answers[`${item.ID}-extra`]}
          />
        ) : null,
      )}
    </Form>
  );
};

interface Qprops {
  question: any;
  index: number;
  onChangeAnswer: (value: any) => void;
  onChangeExtra: (value: any) => void;
  answer: any;
  extra: any;
}

const Question: FC<Qprops> = (props) => {
  const { question, index, answer, onChangeAnswer, extra, onChangeExtra } =
    props;
  const label = index ? `${index}. ${question.question}` : question.question;
  return (
    <div id={`question-${question.ID}`}>
      <Form.Item
        style={{ marginLeft: !index ? 20 : 0 }}
        label={label}
        className={index ? 'index' : ''}
      >
        {question.type == 'Radio' ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Radio.Group
              value={answer}
              onChange={(e) => {
                onChangeAnswer(e.target.value);
              }}
              buttonStyle="solid"
            >
              <Space style={{ display: 'flex', flexWrap: 'wrap' }} size={12}>
                {question.option.split(',').map((item: string) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Radio.Button value={item}>{item}</Radio.Button>
                    {question.optionneedvalue &&
                    question.optionneedvalue.split(',').includes(item) &&
                    answer == item ? (
                      <Input
                        value={extra ? extra[item] : undefined}
                        onChange={(e) =>
                          onChangeExtra({ [item]: e.currentTarget.value })
                        }
                        style={{ width: '200px', marginLeft: 12 }}
                      />
                    ) : null}
                  </div>
                ))}
              </Space>
            </Radio.Group>
          </div>
        ) : question.type == 'Checkbox' ? (
          <Checkbox.Group
            value={answer}
            onChange={(value) => {
              onChangeAnswer(value);
            }}
          >
            <Space style={{ display: 'flex', flexWrap: 'wrap' }} size={12}>
              {question.option.split(',').map((item: string) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Checkbox value={item}>{item}</Checkbox>
                  {question.optionneedvalue &&
                  question.optionneedvalue.split(',').includes(item) &&
                  answer &&
                  answer.includes(item) ? (
                    <Input
                      value={extra ? extra[item] : undefined}
                      onChange={(e) =>
                        onChangeExtra({
                          ...extra,
                          [item]: e.currentTarget.value,
                        })
                      }
                      style={{ width: '200px', marginLeft: 12 }}
                    />
                  ) : null}
                </div>
              ))}
            </Space>
          </Checkbox.Group>
        ) : question.type == 'Input' ? (
          <Input
            value={answer}
            onChange={(e) => onChangeAnswer(e.currentTarget.value)}
          ></Input>
        ) : null}
      </Form.Item>
    </div>
  );
};
