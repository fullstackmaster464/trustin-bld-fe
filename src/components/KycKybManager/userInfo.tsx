import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Image,
  Modal,
  Popover,
  Radio,
  Row,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Dashboard, UserList, UserManagementList } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Email from "../../assets/img/Email.svg";
import Phone from "../../assets/img/Phone.svg";
import Nation from "../../assets/img/Nation.svg";
import Individual from "../../assets/img/Individual.svg";
import Flag from "../../assets/img/flag.svg";
import Job from "../../assets/img/job_gray.svg";
import Doc from "../../assets/img/grayDoc.svg";
import Customer from "../../assets/img/customer.svg";
import WhiteReject from "../../assets/img/white_reject.svg";
import WhiteTick from "../../assets/img/white_tick.svg";
import sidebarUser from "../../assets/img/gray_user.svg";
import { useEffect, useState } from "react";
import { NormalText } from "../ui-elements/TextRepo";
import moment from "moment";
import { downloadKybDetails, fetchKybDetails, getuserDetail } from "../../services/admin";
import {
  DOCUMENT_TYPE,
  USER_TYPE_TEXT,
  getLocalStorage,
} from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
// @ts-ignore
import multiDownload from "multi-download";
const UserInfo = ():any => {
  const navigate = useNavigate();
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadOption, setDownloadOption] = useState(3);
  const [form] = Form.useForm();
  const [userDetails, setUserDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [KycData, setKycData] = useState<any>({});
  const userAlias = window?.location?.pathname.split("/").pop();
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };

  useEffect(() => {
    setLoading(true)
    getuserDetail(userAlias).then((res: any) => {
      setUserDetails(res?.data?.data?.userDetails);
    });

    fetchKybDetails(userAlias)
      .then((response) => {
        const data = response?.data?.data?.[0];
        setKycData(data);
        setLoading(false)
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later!");
      });
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);

  }, []);

  const downloadData = () =>{
    console.log(downloadOption);
  }

  const handleModalCancel = () => {
    setDownloadModal(false);
    form.resetFields();
  };

  const goBack = () => {
    navigate(UserManagementList);
  };
  const downloadUserDetails = () => {
    const files =[];
    const data = KycData?.documents?.[0];
    if (data?.repDocFront?.[0]?.url) {
      files.push(data?.repDocFront?.[0]?.url);
    }
    if (data?.repDocBack?.[0]?.url) {
      files.push(data?.repDocBack?.[0]?.url);
    }
    if (data?.repAddProof?.[0]?.url) {
      files.push(data?.repAddProof?.[0]?.url);
    }
    if (data?.businessAddProof?.[0]?.url) {
      files.push(data?.businessAddProof?.[0]?.url);
    }
    if (data?.businessRegProof?.[0]?.url) {
      files.push(data?.businessRegProof?.[0]?.url);
    }
    if (data?.authorizationDoc?.[0]?.url) {
      files.push(data?.authorizationDoc?.[0]?.url);
    }
    setLoader(true);
    if ( downloadOption == 1) {
      downloadKybDetails(userAlias).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "UserDetails.xlsx");
        document.body.appendChild(link);
        link.click();
        setDownloadModal(false);
        setLoader(false);
      });
    }
    if (downloadOption == 2) {
      multiDownload(files);
      setDownloadModal(false);
      setLoader(false);
    }
    if(downloadOption == 3){
      downloadKybDetails(userAlias).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "UserDetails.xlsx");
        document.body.appendChild(link);
        link.click();
        setDownloadModal(false);
        setLoader(false);
      });
      multiDownload(files);
    }
  };
  return (
    <div className="m-main-body-section scrollbar-container">

           <DefaultLayout
        page="user_management"
        loading={loading}
        TitleText="User Information"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        headerPage={
          <div className={Width > 767 ? "d-flex " :"d-flex gap-2"}>
                  <Image
                    src={LeftArrow}
                    preview={false}
                    onClick={() => {
                      goBack();
                    }}
                    className="mt-2 cursor"
                  />
                  <div className="ml-5">
                    <b> User information</b>
                    {userType !== "ESCROW_ADVISOR" ? 
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
                          navigate(UserManagementList);
                        }}
                      >
                        Management
                      </Breadcrumb.Item>
                      <Breadcrumb.Item
                        className="cursor"
                        onClick={() => {
                          navigate(UserManagementList);
                        }}
                      >
                        User management
                      </Breadcrumb.Item>
                      <Breadcrumb.Item className="cursor">
                        User information
                      </Breadcrumb.Item>
                    </Breadcrumb> : <Breadcrumb separator=">">
                      <Breadcrumb.Item
                        onClick={() => {
                          navigate(Dashboard);
                        }}
                        className="cursor"
                      >
                        Dashboard
                      </Breadcrumb.Item>
                      <Breadcrumb.Item
                        className="cursor"
                        onClick={() => {
                          navigate(UserList);
                        }}
                      >
                        User list
                      </Breadcrumb.Item>
                      <Breadcrumb.Item className="cursor">
                        User information
                      </Breadcrumb.Item>
                    </Breadcrumb>}
                  </div>
                </div>
              }
      >
            <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} >
              <Col xs={24} sm={24} md={24} lg={15} xl={15}>
                <div className="bg-admin-card p-4" >
                  <Col span={24}>
                    <div className="d-flex">
                      <Col span={24} className="mr-25">
                        <div className="title_white mt-3">
                          {userDetails?.name}
                        </div>
                        <hr className="mt-4" />
                      </Col>
                    </div>
                    <Row gutter={[16,16]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <div className="mr-20">
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Email} alt="email" preview={false} />
                          <Popover content={userDetails?.email}>
                          <span className="ml-4 overflowText userinfo cursor">
                            {userDetails?.email}
                          </span>
                          </Popover>
                        </div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Phone} alt="phone" preview={false} />
                          <Popover content={userDetails?.contactNumber}>
                           <span className="ml-4 overflowText userinfo">
                             {userDetails?.contactNumber}
                           </span>
                          </Popover>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <div className="subtext_white mt-3 d-flex">
                          <Image src={Nation} alt="country" preview={false} />
                          <Popover content={userDetails?.countryAlias}>
                           <span className="mx-2 overflowText userinfo">
                             {userDetails?.countryAlias}
                           </span>
                          </Popover>
                          <div className="mx-2">
                            <div className="flag px-1">
                              <Image
                                src={Flag}
                                preview={false}
                                height={12}
                                width={22}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex w-100 justify-content-between flex-wrap">
                          <div className= "subtext_white mt-3 d-flex ">
                            <Image src={Individual} alt="type" preview={false} />
                            <Popover content={userDetails?.platformUserType == "self"
                                ? "Individual"
                                : "Company"}>
                              <span className="mx-2 overflowText userinfo">
                                {userDetails?.platformUserType == "self"
                                ? "Individual"
                                : "Company"}
                              </span>
                            </Popover>
                          </div>
                          <Button
                            className="downloadCard mt-2"
                               onClick={() => {
                                setDownloadModal(true);
                              }}
                          >
                            Download
                          </Button>
                        </div>
                    </Col>
                    </Row>
                  </Col>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={9} xl={9} className="bg-admin-card-col8">
                <Card className="p-4 detailsCard">
                  {" "}
                  <div className="titleText">Other details</div>
                  <div className="subText mt-4 d-flex">
                    <Image src={Customer} alt="company" preview={false} className="other-details-img" />
                    <Popover content={USER_TYPE_TEXT[userDetails?.userType]+" "+"( Customer Type )"}>
                    <div className="px-3 overflowText userinfo cursor">
                      {USER_TYPE_TEXT[userDetails?.userType]} 
                      <span className="px-1 stepDetails_sub">
                      ( Customer type )
                    </span>
                    </div>
                    </Popover>
                  </div>
                  <div className="subText mt-3 d-flex">
                    <Image src={Job} alt="company" preview={false} className="other-details-img"/>
                    <Popover content={moment(userDetails?.createAt).format("DD-MM-YYYY") +" "+"( Added On )"}>
                    <div className="px-3 overflowText userinfo cursor">
                      {moment(userDetails?.createAt).format("DD-MM-YYYY")}
                      <span className="px-1 stepDetails_sub">( Added on )</span>
                    </div>
                    </Popover>
                  </div>
                  <div className="subText mt-3 d-flex">
                    <Image src={Job} alt="company" preview={false} className="other-details-img"/>
                    <Popover content={moment(userDetails?.updatedAt).format("DD-MM-YYYY") +" "+" ( Last update On )"}>
                    <div className="px-3 overflowText userinfo cursor">
                      {moment(userDetails?.updatedAt).format("DD-MM-YYYY")}
                      <span className="px-1 stepDetails_sub">
                      ( Last update on )
                    </span>
                    </div>
                    </Popover>
                  </div>
                </Card>
              </Col>
            </Row>
            <div className="titleText mt-4 mb-3">KYC details</div>
            <Card className="p-4">
              <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} >
                <Col xs={24} sm={24} md={12} lg={12} xl={5} className="d-flex my-sm-2">
                  <Image src={sidebarUser} alt="user" preview={false} className="kyc-details-img"/>
                  <div className="mx-3 ">
                    <div className="stepDetails_medium_sub">
                      Name on document
                    </div>
                    <div className="subText_small fw-400">
                      {KycData?.representative?.[0]?.representativeName || "NA"}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={5} className="d-flex my-sm-2">
                  <Image src={Doc} alt="user" preview={false} className="kyc-details-img"/>
                  <div className="mx-3">
                    <div className="stepDetails_medium_sub">Document</div>
                    <div className="subText_small fw-400">
                      {DOCUMENT_TYPE[KycData?.documents?.[0]?.repDocType] ||
                        "NA"}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={5} className="d-flex my-sm-2">
                  <Image src={Doc} alt="user" preview={false} className="kyc-details-img"/>
                  <div className="mx-3">
                    <div className="stepDetails_medium_sub">
                      Document id number
                    </div>
                    <div className="subText_small fw-400">
                      {KycData?.representative?.[0]?.repDocNumber || "NA"}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={5} className="d-flex my-sm-2">
                  <Image src={Job} alt="user" preview={false} className="kyc-details-img"/>
                  <div className="mx-3">
                    <div className="stepDetails_medium_sub">Expiry date</div>
                    <div className="subText_small fw-400">
                      {KycData?.representative?.[0]?.repExpiryDate
                        ? moment(
                            KycData?.representative?.[0]?.repExpiryDate
                          ).format("DD-MM-YYYY")
                        : "NA"}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={4} className="verified-btn-block">
                {KycData?.kybStatus == "VERIFIED" ? (
                  <div className="d-flex mt-2 verified py-1 px-3">
                    <Image src={WhiteTick} alt="user" preview={false} className="kyc-details-img"/>
                    <div className="px-2">Verified</div>
                  </div>
                ) : (
                  <div className="d-flex mt-2 not-verified py-1 px-2">
                    <Image src={WhiteReject} alt="user" preview={false} className="kyc-details-img"/>
                    <div className="px-1">Not verified</div>
                  </div>
                )}
                </Col>
              </Row>
            </Card>
            </DefaultLayout>
      <Modal
        open={downloadModal}
        footer={false}
        className="classification-modal"
        title={
          <span className="change-client-classification ml-4">
            Download all KYC information
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <div className="stepDetails fw-400 mx-3 py-2 modal-word-wrap">
          <p>Choose which data you want to download now?</p>
        </div>
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          scrollToFirstError
          onFinish={downloadData}
        >
          <Radio.Group defaultValue="3" buttonStyle="solid" className="mx-3">
            <Row>
              <Radio
                value="1"
                onChange={(e) => setDownloadOption(e.target.value)}
              >
                <NormalText children="Download information" />
              </Radio>
            </Row>
            <Row>
              <Radio
                value="2"
                onChange={(e) => setDownloadOption(e.target.value)}
              >
                <NormalText children="Download attached files" />
              </Radio>
            </Row>
            <Row>
              <Radio
                value="3"
                onChange={(e) => setDownloadOption(e.target.value)}
              >
                <NormalText children="Download Above Both" />
              </Radio>
            </Row>
          </Radio.Group>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
              loading={loader}
                onClick={() => {
                  downloadUserDetails();
                }}
            >
              Download
            </Button>
            <Button
              key="cancel"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserInfo;
