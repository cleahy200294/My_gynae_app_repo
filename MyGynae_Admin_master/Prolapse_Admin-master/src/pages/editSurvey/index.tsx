import Icon, {
  ApartmentOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  CopyOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  MinusSquareOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  ProfileOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Tag,
  Tooltip,
} from 'antd';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import styles from './index.less';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { v4 as uuidv4 } from 'uuid';
import VisualLogic from './components/visualLogic';
const { confirm } = Modal;

const ItemContext = createContext<{ items: any[]; setItems: any }>({
  items: [],
  setItems: null,
});
const SortableItem = SortableElement<{ value: any }>(({ value }: any) => {
  const { items, setItems } = useContext(ItemContext);
  var actions = () => {
    var result = [
      <Tooltip placement="top" title="Duplicate">
        <CopyOutlined
          onClick={() => {
            confirm({
              title: 'Are you sure Duplicate this question?',
              icon: <ExclamationCircleOutlined />,
              okText: 'Yes',
              okType: 'danger',
              cancelText: 'No',
              onOk() {
                var newItems = [...items];
                var copyItem;
                var index = 0;
                for (var i = 0; i < newItems.length; i++) {
                  if (newItems[i].id == value.id) {
                    index = i + 1;
                    copyItem = { ...newItems[i], id: uuidv4() };
                  }
                }
                newItems.splice(index, 0, copyItem);
                setItems(newItems);
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        ></CopyOutlined>
      </Tooltip>,
      <Tooltip placement="top" title="Delete">
        <DeleteOutlined
          onClick={() => {
            confirm({
              title: 'Are you sure delete this question?',
              icon: <ExclamationCircleOutlined />,
              okText: 'Yes',
              okType: 'danger',
              cancelText: 'No',
              onOk() {
                var newItems = [...items];
                for (var i = 0; i < newItems.length; i++) {
                  if (newItems[i].id == value.id) {
                    newItems.splice(i, 1);
                  }
                }
                setItems(newItems);
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        ></DeleteOutlined>
      </Tooltip>,
    ];
    if (value.type != 3) {
      result = [
        <Tooltip placement="top" title="Add Option">
          <PlusCircleOutlined
            onClick={() => {
              var newItems = [...items];
              for (var i = 0; i < newItems.length; i++) {
                if (newItems[i].id == value.id) {
                  console.log(newItems[i].answer);
                  newItems[i].answer.push({
                    id: uuidv4(),
                    atype: 1,
                    content: 'Option',
                  });
                }
              }
              setItems(newItems);
            }}
          ></PlusCircleOutlined>
        </Tooltip>,
        <Tooltip placement="top" title="Add Other">
          <PlusOutlined
            onClick={() => {
              var newItems = [...items];
              for (var i = 0; i < newItems.length; i++) {
                if (newItems[i].id == value.id) {
                  console.log(newItems[i].answer);
                  newItems[i].answer.push({
                    id: uuidv4(),
                    atype: 2,
                    content: 'Other',
                  });
                }
              }
              setItems(newItems);
            }}
          ></PlusOutlined>
        </Tooltip>,
        ...result,
      ];
    }
    return result;
  };
  const deleteAnswer = (id: number, index: number) => {
    var newItems = [...items];
    for (var i = 0; i < newItems.length; i++) {
      if (newItems[i].id == id) {
        if (newItems[i].answer.length <= 1) {
          message.warning('At least one option is required');
        } else {
          newItems[i].answer.splice(index, 1);
          console.log(newItems[i].answer);
        }
      }
    }
    setItems(newItems);
  };
  const changeAnswer = (
    id: number,
    answerId: number,
    text: string,
    tors: number,
  ) => {
    var newItems = [...items];
    for (var i = 0; i < newItems.length; i++) {
      if (newItems[i].id == id) {
        var answer = newItems[i].answer;
        for (var j = 0; j < answer.length; j++) {
          if (answerId == answer[j].id) {
            if (tors == 1) {
              answer[j].content = text;
            } else if (tors == 2) {
              answer[j].score = text;
            }
          }
        }
      }
    }
    setItems(newItems);
  };
  var answer = (content: any, index: number) => {
    if (content.atype == 1) {
      return (
        <Input.Group key={content.id} compact className="answersList">
          <Input
            style={{ width: '70%' }}
            defaultValue={content.content}
            placeholder="Option"
            addonBefore={
              <div
                className={
                  value.type == 1 ? 'ant_radio_inner' : 'ant_checkbox_inner'
                }
              ></div>
            }
            onInput={(e: any) => {
              changeAnswer(value.id, content.id, e.target.value, 1);
            }}
          />
          <Input
            type="number"
            style={{ width: '30%' }}
            defaultValue={content.score}
            placeholder="Score (optional)"
            addonAfter={
              <CloseOutlined
                className="deleteIcon"
                onClick={() => {
                  deleteAnswer(value.id, index);
                }}
              />
            }
            onInput={(e: any) => {
              changeAnswer(value.id, content.id, e.target.value, 2);
            }}
          />
        </Input.Group>
      );
    }
    if (content.atype == 2) {
      return (
        <Input.Group key={content.id} compact className="answersList">
          <div className={styles.inputBox} style={{ width: '70%' }}>
            <div className={styles.line}>
              <span>{content.content}</span>
            </div>
            <Input
              className={styles.textInput}
              defaultValue={content.content}
              placeholder="Option"
              addonBefore={
                <div
                  className={
                    value.type == 1 ? 'ant_radio_inner' : 'ant_checkbox_inner'
                  }
                ></div>
              }
              onInput={(e: any) => {
                changeAnswer(value.id, content.id, e.target.value, 1);
              }}
            />
          </div>
          <Input
            type="number"
            style={{ width: '30%' }}
            defaultValue={content.score}
            placeholder="Score (optional)"
            addonAfter={
              <CloseOutlined
                className="deleteIcon"
                onClick={() => {
                  deleteAnswer(value.id, index);
                }}
              />
            }
            onInput={(e: any) => {
              changeAnswer(value.id, content.id, e.target.value, 2);
            }}
          />
        </Input.Group>
      );
    }
    if (content.atype == 3) {
      return (
        <Input
          disabled
          key={content.id}
          defaultValue={content.content}
          placeholder="Please Enter"
        />
      );
    }
    return '';
  };
  return (
    <Card className="dragquestionList" actions={actions()}>
      <div className="type">
        {value.type == 1 ? (
          <Tag color="blue">Radio</Tag>
        ) : value.type == 2 ? (
          <Tag color="magenta">Multiple Choice</Tag>
        ) : value.type == 3 ? (
          <Tag color="green">Text Input</Tag>
        ) : null}
      </div>
      <div className="title">
        <Input
          className="titleinput"
          addonBefore={'Q ' + (value.index + 1)}
          defaultValue={value.title}
          placeholder="Please Enter Title"
          onInput={(e: any) => {
            var newItems = [...items];
            for (var i = 0; i < newItems.length; i++) {
              if (newItems[i].id == value.id) {
                newItems[i].title = e.target.value;
              }
            }
            setItems(newItems);
          }}
        />
      </div>
      <div className="answers">
        {value.answer.map((content: any, index: number) =>
          answer(content, index),
        )}
      </div>
    </Card>
  );
});

const SortableList = SortableContainer<{ items: any[] }>(({ items }: any) => {
  return (
    <div>
      {items.map((item: any, index: number) => (
        <SortableItem key={item.id} index={index} value={{ ...item, index }} />
      ))}
    </div>
  );
});

const Survey: FC = () => {
  const [isLogicPabel, setIsLogicPabel] = useState(false);
  const [items, setItems] = useState<any[]>([
    {
      id: uuidv4(),
      type: 1,
      title: 'Please Enter Title',
      answer: [
        { id: uuidv4(), atype: 1, content: 'Option', score: '' },
        { id: uuidv4(), atype: 1, content: 'Option', score: '' },
      ],
    },
  ]);
  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    var newItems = arrayMoveImmutable(items, oldIndex, newIndex);
    setItems([...newItems]);
  };

  const addItem = (type: 1 | 2 | 3) => {
    const lists = [...items];
    lists.push({
      id: uuidv4(),
      type,
      title: 'Please Enter Title',
      answer:
        type == 3
          ? [{ id: uuidv4(), atype: 3, content: 'Please Enter ' }]
          : [
              { id: uuidv4(), atype: 1, content: 'Option', score: '' },
              { id: uuidv4(), atype: 1, content: 'Option', score: '' },
            ],
    });
    setItems(lists);
  };
  return (
    <PageContainer
      className={styles.surveyBox}
      title={false}
      breadcrumb={{
        routes: [
          {
            path: '/survey/editSurvey',
            breadcrumbName: 'Edit Survey',
          },
        ],
      }}
    >
      <Row gutter={[16, 0]}>
        <Col
          xs={{ span: 23 }}
          sm={{ span: 23 }}
          md={{ span: 23 }}
          lg={{ span: 23 }}
        >
          {isLogicPabel ? (
            <Card className="surveyContain">
              <VisualLogic></VisualLogic>
            </Card>
          ) : (
            <Card className="surveyContain">
              <div className={styles.topBox}>
                <div className={styles.remark}>
                  Remark: First meeting and General follow-up
                </div>
                <div className={styles.title}>
                  Pelvic Organ Prolapse/Urinary Incontinence Sexual Function
                  Questionnaire (PISQ-12)
                </div>
                <div className={styles.details}>
                  Following is a list of questions about you and your partner’s
                  sex life. All information is strictly confidential. Your
                  answers will be used only to help doctors understands what is
                  important to patients about their sex lives. Please check the
                  box that best answers the question for you. While answering
                  the questions, consider your sexuality over the past six
                  months. Thank you for your help.
                </div>
              </div>
              <div className={styles.bottomBox}>
                <ItemContext.Provider value={{ items, setItems }}>
                  <SortableList
                    distance={20}
                    items={items}
                    onSortEnd={onSortEnd}
                  />
                </ItemContext.Provider>
              </div>
            </Card>
          )}
        </Col>
        <Col
          xs={{ span: 1 }}
          sm={{ span: 1 }}
          md={{ span: 1 }}
          lg={{ span: 1 }}
          className={styles.controlBox}
        >
          <div className={styles.panelBox}>
            {isLogicPabel ? (
              <Tooltip placement="left" title="Edit Panel">
                <Button
                  icon={<DatabaseOutlined />}
                  type="primary"
                  className={styles.button}
                  style={{ background: '#2bd3ba', border: '#2bd3ba' }}
                  onClick={() => {
                    setIsLogicPabel(false);
                  }}
                ></Button>
              </Tooltip>
            ) : (
              <Tooltip placement="left" title="Logic Panel">
                <Button
                  icon={<ApartmentOutlined />}
                  type="primary"
                  className={styles.button}
                  style={{
                    background: '#2bd3ba',
                    border: '#2bd3ba',
                  }}
                  onClick={() => {
                    setIsLogicPabel(true);
                  }}
                ></Button>
              </Tooltip>
            )}
          </div>
          {isLogicPabel ? null : (
            <div className={styles.typeBox}>
              {/* 1 is radio  2 is checkbox 3 is input  */}
              {/* 1 is text 2 is other 3 is input  */}
              <Tooltip placement="left" title="Add Radio Question">
                <Button
                  icon={<CheckCircleOutlined />}
                  className={styles.button}
                  type="primary"
                  style={{ background: '#46637b', border: '#46637b' }}
                  onClick={() => addItem(1)}
                ></Button>
              </Tooltip>
              <Tooltip placement="left" title="Add Multiple Choice Question">
                <Button
                  icon={<CheckSquareOutlined />}
                  className={styles.button}
                  type="primary"
                  style={{ background: '#46637b', border: '#46637b' }}
                  onClick={() => addItem(2)}
                ></Button>
              </Tooltip>
              <Tooltip placement="left" title="Add Text Input Question">
                <Button
                  icon={<MinusSquareOutlined />}
                  className={styles.button}
                  type="primary"
                  style={{ background: '#46637b', border: '#46637b' }}
                  onClick={() => addItem(3)}
                ></Button>
              </Tooltip>
            </div>
          )}
          <div>
            <Tooltip placement="left" title="Save">
              <Button
                icon={<SaveOutlined />}
                type="primary"
                className={styles.button}
                style={{ background: '#e64f4e', border: '#e64f4e' }}
                onClick={() => {
                  console.log(items);
                }}
              ></Button>
            </Tooltip>
          </div>
        </Col>
      </Row>
      {/* </Card> */}
    </PageContainer>
  );
};

export default Survey;
