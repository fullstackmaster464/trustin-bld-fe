import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  TimePicker,
  Tooltip,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { RegularCustomer } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Email from "../../assets/img/white_email.svg";
import Phone from "../../assets/img/whitePhone.svg";
import Suitcase from "../../assets/img/job_white.svg";
import Clock from "../../assets/img/whiteClock.svg";
import ClockLight from "../../assets/img/clock_light.svg";
import Job from "../../assets/img/job_gray.svg";
import { useEffect, useState } from "react";
import { InputText } from "../ui-elements/InputsRepo";
import {
  clientFeedback,
  scheduleDetails,
  scheduledMeeting,
} from "../../services/transaction";
import moment from "moment";
import { DateWithUtcOffset, enterpriseUserCallsStatus } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";

const RegularCustomDetails = ():any => {
  const navigate = useNavigate();
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [meetingDone, setMeetingDone] = useState(0);
  const [clientInterested, setclientInterested] = useState(0);
  const [startDate, setStartDate] = useState<any>("");
  const [reschedule, setReschedule] = useState(0);
  const [callUserDetails, setCallUserDetails] = useState<any>([]);
  const [Time, setTime] = useState<any>("");
  const [form] = Form.useForm();
  const id = window?.location?.pathname.split("/").pop();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(document?.body?.clientWidth);
  useEffect(() => {
    getOneCallDetails();
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);
  const setWidthVal = () => {
    setScreenWidth(document.body.clientWidth);
  };
  const rescheduleMeet = () => {
    const reqBody = {
      scheduledDate: DateWithUtcOffset(startDate),
      scheduledTime: Time,
      aliasName: id,
      isRescheduled: true,
    };
    scheduledMeeting(reqBody)
      .then(() => {
        setRescheduleModal(false);
        getOneCallDetails();
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later");
      });
  };

  const getOneCallDetails = () => {
    scheduleDetails({ contactAlias: id })
      .then((response) => {
        setCallUserDetails(response?.data?.data[0]);
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later");
      });
  };
  const handleCancel = () => {
    setRescheduleModal(false);
  };
  const { TextArea } = Input;
  const goBack = () => {
    navigate(RegularCustomer);
  };
  const onChange = (_time: any, timeString: string | string[]) => {
    setTime(timeString);
  };
  const handleStartDateChange = (_date: any, dateString: string | string[]) => {
    setStartDate(dateString);
  };

  const meetTermination = (e: any) => {
    const reqBody = { aliasName: id, isMeeting: false, remarks: e.reason };

    clientFeedback(reqBody)
      .then(() => {
        setFormSubmitted(true);
        getOneCallDetails();
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later");
      });
  };

  const cliIntrested = (e: any) => {
    const reqBody = { aliasName: id, isInterested: true, remarks: e.reason };
    clientFeedback(reqBody)
      .then(() => {
        setFormSubmitted(true);
        getOneCallDetails();
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later");
      });
  };
  const cliNotIntrested = (e: any) => {
    const reqBody = { aliasName: id, isInterested: false, remarks: e.reason };
    clientFeedback(reqBody)
      .then(() => {
        setFormSubmitted(true);
        getOneCallDetails();
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later");
      });
  };

  return (
    <div className="scrollbar-container">
        <DefaultLayout
        page="enquiry_regular"
        loading={false}
        TitleText="Schedules Call Details"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        headerPage={
          <div className="d-flex">
            <Image
              src={LeftArrow}
              preview={false}
              onClick={() => {
                goBack();
              }}
              className="mt-2 cursor"
            />
            <div className="ml-5">
              <b>Scheduled Call Details</b>
              <Breadcrumb separator=">">
                {/* <Breadcrumb.Item
                  onClick={() => {
                    navigate(Dashboard);
                  }}
                  className="cursor"
                >
                  Dashboard
                </Breadcrumb.Item> */}
                <Breadcrumb.Item
                  className="cursor"
                  onClick={() => {
                    navigate(RegularCustomer);
                  }}
                >
                  Leads
                </Breadcrumb.Item>
                <Breadcrumb.Item className="cursor">
                  Scheduled Call Details
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
            <Row gutter={25} >
              <Col xs={24} sm={24} md={24} lg={15} xl={15} xxl={15}>
                <div className="bg-admin-card p-5">
                  <Col span={24}>
                    <div className="d-flex">
                      <Col span={24} className="p-0">
                        <div className="mt-3 leads-bluecard-text">
                          {callUserDetails?.firstName +
                            " " +
                            callUserDetails?.lastName}
                        </div>
                        <hr className="mt-4" />
                      </Col>
                      {/* <Col span={5}>
                        <Image
                          src={ProfileImage}
                          alt="profile"
                          preview={false}
                        />
                      </Col> */}
                    </div>
                    <div className="d-flex leads-blue-card">
                      <div className="mr-25">
                        <div className="subtext_white d-flex">
                          <Image src={Email} alt="email" preview={false} />
                          <Tooltip
                          title={callUserDetails?.email || ""}
                            overlayClassName='leads-custom-tooltip'
                          >
                          <span className="ml-4 overflowText-card overflowText">
                            {callUserDetails?.email}
                          </span>
                          </Tooltip>
                        </div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Phone} alt="phone" preview={false} />
                          <span className="ml-4 overflowText-card">
                            {callUserDetails?.contactNumber}
                          </span>
                        </div>
                      </div>
                      <div className='ml-auto'>
                        <div className="subtext_white d-flex">
                          <Image src={Suitcase} alt="country" preview={false} />
                          <Tooltip title={moment(callUserDetails?.requestedDate).format("DD-MMMM-YYYY")}
                                  placement="top" overlayClassName="custom-tooltip"
                                >
                          <span className="mx-2 overflowText overflowText-card">
                            {moment(callUserDetails?.requestedDate).format(
                              "DD-MMMM-YYYY"
                            )}
                          </span>
                          </Tooltip>
                        </div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Clock} alt="type" preview={false} />
                          <Tooltip title={callUserDetails?.requestedTime}
                                  placement="top" overlayClassName="custom-tooltip"
                                >
                          <span className="ml-4 overflowText ">
                            {callUserDetails?.requestedTime}
                          </span>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </Col>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                <Card className="p-4 detailsCard min-height-250">
                  {" "}
                  <div className="titleText mb-4">Scheduled Meeting</div>
                  <div className="mt-2">
                    <Row>
                    <Col xs={24} sm={24} md={12} lg={24} xl={12}>
                      <div className={screenWidth > 767 ? "d-flex" : "d-flex py-2"}>
                        <Image src={Job} alt="company" 
                        className="icon-size"
                        preview={false} />
                        <div className="px-2">
                          {" "}
                          <div className="stepDetails_medium_light titleText fw-400">
                            Scheduled Date
                          </div>
                          <div className="stepDetails_medium titleText  fw-400 ">
                            {moment(callUserDetails?.requestedDate).format(
                              "DD MMMM YYYY"
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>  
                    <Col xs={24} sm={24} md={12} lg={24} xl={12}>
                      <div className={screenWidth > 767 ? "d-flex" : "d-flex py-2"}>
                        <Image
                          src={ClockLight}
                          alt="company"
                          preview={false}
                          className='icon-size'
                        />
                      <div className="px-2">
                        <div className="stepDetails_medium_light titleText  fw-400">
                          Scheduled Time
                        </div>
                        <div className="stepDetails_medium titleText fw-400 ">
                          {callUserDetails?.requestedTime}
                        </div>
                      </div>
                      </div>
                    </Col>
                    </Row>
                    {callUserDetails?.meetingStatus === "" ? (
                      <div className={screenWidth > 385 ? "d-flex my-2" : "d-flex my-2 flex-column align-items-center justify-content-center"}>
                        <Button
                          className="rounded_blue_outline reschedule-btn-2 w-auto"
                          onClick={() => {
                            setRescheduleModal(true);
                          }}
                        >
                          Reschedule
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </Card>
              </Col>
            </Row>
            <Card className=" mt-4 p-4">
              <div className="titleText mb-3">Query</div>
              <div className="d-flex">
                <div className="stepDetails_medium_light fw-400">
                  Query Message
                </div>
                <div className="stepDetails_medium fw-400 px-3">
                  {callUserDetails?.query}
                </div>
              </div>
              <hr className="lightgrayHr my-4" />
              <div className="titleText mb-3">Meeting Status</div>
              <Row>
                <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                  <div className="stepDetails_medium_light my-2 fw-400">
                    Scheduled
                  </div>
                  <div className="stepDetails_medium fw-400">
                    {callUserDetails?.scheduledMeeting}
                  </div>
                </Col>
                <Col  xs={24} sm={24} md={8} lg={6} xl={6}>
                  <div className="stepDetails_medium_light my-2 fw-400">
                    Meeting Done
                  </div>
                  <div className="stepDetails_medium fw-400">
                    {callUserDetails?.meetingStatus == "" ? (
                      <Radio.Group
                        defaultValue={meetingDone}
                        buttonStyle="solid"
                      >
                        <Radio
                          value="1"
                          onClick={() => {
                            setMeetingDone(1);
                          }}
                        >
                          <div className="stepDetails_medium fw-400">Yes</div>
                        </Radio>
                        <Radio
                          value="2"
                          onClick={() => {
                            setMeetingDone(2);
                            setclientInterested(0);
                          }}
                          className="m-0"
                        >
                          <div className="stepDetails_medium fw-400">No</div>
                        </Radio>
                      </Radio.Group>
                    ) : (
                      <Radio.Group buttonStyle="solid">
                        <Radio
                          value="1"
                          disabled
                          defaultChecked={
                            callUserDetails?.meetingStatus == "CANCELLED"
                              ? false
                              : true
                          }
                        >
                          <div className="stepDetails_medium fw-400">Yes</div>
                        </Radio>
                        <Radio
                          value="2"
                          disabled
                          className=""
                          defaultChecked={
                            callUserDetails?.meetingStatus == "CANCELLED"
                              ? true
                              : true
                          }
                        >
                          <div className="stepDetails_medium fw-400">No</div>
                        </Radio>
                      </Radio.Group>
                    )}
                  </div>
                </Col>
                {meetingDone == 1 ? (
                  <Col  xs={24} sm={24} md={8} lg={6} xl={6}>
                    <div className="stepDetails_medium_light my-2 fw-400">
                      Client Interested
                    </div>
                    <div className="stepDetails_medium fw-400">
                      <Radio.Group
                        defaultValue={meetingDone}
                        buttonStyle="solid"
                      >
                        <Radio
                          value="1"
                          onClick={() => {
                            setclientInterested(1);
                          }}
                        >
                          <div className="stepDetails_medium fw-400">Yes</div>
                        </Radio>
                        <Radio
                          value="2"
                          onClick={() => {
                            setclientInterested(2);
                          }}
                          className="m-0"
                        >
                          <div className="stepDetails_medium fw-400">No</div>
                        </Radio>
                      </Radio.Group>
                    </div>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
              {clientInterested == 1 && !formSubmitted ? (
                <div>
                  <div className="stepDetails_medium fw-400 mt-4">
                    Mention Requirements
                  </div>
                  <Form form={form} scrollToFirstError onFinish={cliIntrested}>
                    <InputText
                      fieldname="reason"
                      className="inputField w-100 mt-3 error-input"
                      rules={[
                        {
                          required: true,
                          message: "Requirements is required!",
                        },
                      ]}
                    >
                      <Input placeholder="Please mention all the requirements of client here" />
                    </InputText>
                    <Button
                      key="submit"
                      type="primary"
                      htmlType="submit"
                      className="modal-button mt-4"
                    >
                      Submit
                    </Button>
                  </Form>
                </div>
              ) : meetingDone == 2 && !formSubmitted ? (
                <div>
                  <div className="stepDetails_medium fw-400 mt-4">
                    Termination Reason
                  </div>
                  <Form
                    form={form}
                    scrollToFirstError
                    onFinish={meetTermination}
                  >
                    <InputText
                      fieldname="reason"
                      className="inputField w-100 mt-3 error-input"
                      rules={[
                        {
                          required: true,
                          message: "Termination Reason is required!",
                        },
                      ]}
                    >
                      <Input placeholder="Please mention the termination reason of meeting here" />
                    </InputText>
                    <Button
                      key="submit"
                      type="primary"
                      htmlType="submit"
                      className="modal-button mt-4"
                    >
                      Submit
                    </Button>
                  </Form>
                </div>
              ) : (
                ""
              )}

              {clientInterested == 2 && !formSubmitted ? (
                <div>
                  <div className="stepDetails_medium fw-400 mt-4">Feedback</div>
                  <Form
                    form={form}
                    scrollToFirstError
                    onFinish={cliNotIntrested}
                  >
                    <InputText
                      fieldname="reason"
                      className="inputField w-100 mt-3 error-input"
                      rules={[
                        {
                          required: true,
                          message: "Feedback is required!",
                        },
                      ]}
                    >
                      <Input placeholder="Please enter the reason here why client was not interested" />
                    </InputText>
                    <Button
                      key="submit"
                      type="primary"
                      htmlType="submit"
                      className="modal-button mt-4"
                    >
                      Submit
                    </Button>
                  </Form>
                </div>
              ) : (
                ""
              )}

              {callUserDetails?.meetingStatus != "" ? (
                <div>
                  <hr className="lightgrayHr my-4" />
                  <div className="titleText mb-3">User Feedback</div>
                  <div className="stepDetails_medium_light my-2 fw-400">
                    {enterpriseUserCallsStatus[callUserDetails?.meetingStatus]}
                  </div>
                  <div className="stepDetails_medium fw-400">
                    {callUserDetails?.meetingMessage}
                  </div>
                </div>
              ) : null}
              <Modal
                title={
                  <p className="large-title">Do you want to reschedule?</p>
                }
                className="modal-box"
                open={rescheduleModal}
                footer={false}
                closable={false}
                onCancel={handleCancel}
              >
                <hr className="break-line" />
                <Form form={form} scrollToFirstError onFinish={rescheduleMeet}>
                  <div className="mt-4 mx-3">
                    <p className="stepDetails-popup-text fw-400">
                      If you have missed the meeting you can reschedule it
                    </p>
                  </div>
                  <Radio.Group defaultValue={meetingDone} buttonStyle="solid" className="mx-3">
                    <Radio
                      value="1"
                      onClick={() => {
                        setReschedule(1);
                      }}
                    >
                      <div className="stepDetails_medium fw-400">Yes</div>
                    </Radio>
                    <Radio
                      value="2"
                      onClick={() => {
                        setReschedule(2);
                      }}
                      className="px-4"
                    >
                      <div className="stepDetails_medium fw-400">No</div>
                    </Radio>
                  </Radio.Group>
                  {reschedule == 2 ? (
                    <div className="stepDetails_medium fw-400 mt-4">
                      Comment
                      <TextArea
                        rows={2}
                        placeholder="Write your reason here"
                        className="modalTextArea mt-2 pt-2 "
                      />
                    </div>
                  ) : reschedule == 1 ? (
                    <Row className="mt-4" gutter={{ xs:0, sm: 0, md: 0, lg: 24 }}>
                      <Col  xs={24} sm={24} md={24} lg={12} xl={12}>
                        <InputText
                          fieldname="date"
                          className="filterInputField mb-4 responsiveInput"
                          rules={[
                            {
                              required: true,
                              message: "Date is required!",
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder="Select Date"
                            value={startDate}
                            onChange={(date: any, dateString: string | string[])=>handleStartDateChange(date,dateString)}
                            format={{
                              format: 'DD-MM-YYYY',
                              type: 'mask',
                            }}
                          />
                        </InputText>
                      </Col>
                      <Col  xs={24} sm={24} md={24} lg={12} xl={12}>
                        <InputText
                          fieldname="time"
                          className="filterInputField mb-4 responsiveInput"
                          rules={[
                            {
                              required: true,
                              message: "Time is required!",
                            },
                          ]}
                        >
                          <TimePicker
                            use12Hours
                            format="h:mm a"
                            placeholder="Set Time"
                            onChange={(time: any, timeString:string | string[])=> onChange(time,timeString)}
                            value={Time}
                          />
                        </InputText>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                  <div className={screenWidth > 385 ? "d-flex my-2" : "d-flex my-2 flex-column align-items-center justify-content-center"}>
                    <Button
                      className="rounded reschedule-btn mx-3"
                      htmlType="submit"
                      key="submit"
                    >
                      {reschedule == 2 ? "Submit" : "Reschedule"}
                    </Button>
                    <Button
                      className="rounded_cancel_btn cancel-btn"
                      onClick={() => setRescheduleModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Modal>
            </Card>
            </DefaultLayout>
          </div>
  );
};

export default RegularCustomDetails;
