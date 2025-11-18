import { Breadcrumb, Card, Col, Image, Row, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/img/leftArrow.svg";
import profileImg from "../../assets/img/profileImg.svg";
import Email from "../../assets/img/Email.svg";
import Phone from "../../assets/img/Phone.svg";
import Nation from "../../assets/img/Nation.svg";
import Individual from "../../assets/img/Individual.svg";
import Company from "../../assets/img/company.svg";
import Globe from "../../assets/img/crossGlobe.svg";
import Job from "../../assets/img/Job.svg";
import Location from "../../assets/img/location.svg";
import Flag from "../../assets/img/flag.svg";
import TabPane from "antd/lib/tabs/TabPane";
import Business from "./Business";
import Representative from "./Representative";
import CheckList from "./CheckList";
import { useState } from "react";
import { Dashboard, KYBManagementList } from "../Common/RouteConst";
import DefaultLayout from "../Common/DefaultLayout";


const KYBDetails = () => {
  const navigate = useNavigate();
  const [Tab, setTab] = useState('business')
  const goBack = () => {
    navigate(KYBManagementList);
  };
  
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="management"
        TitleText="KYB Details"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        loading={false}
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
                      <b> KYB Details</b>
                      <Breadcrumb separator=">">
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
                            navigate(KYBManagementList);
                          }}
                        >
                          Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                          className="cursor"
                          onClick={() => {
                            navigate(KYBManagementList);
                          }}
                        >
                          KYB Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item className="cursor">
                          KYB Details
                        </Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >             
              <Row>
                <Col span={6}>
                  <div className="bg-card-orange p-5">
                    <div className="center ">
                      <Image
                        src={profileImg}
                        className="profileImg"
                        preview={false}
                        alt="profileimg"
                        height={118}
                        width={118}
                      />
                    </div>
                    <div className="title_white center mt-4">Lahari</div>
                    <div className="subtext_white center mt-3">
                      Authorized Representative
                    </div>
                    <div className="ver_center mt-3">
                      <div className="flag px-1">
                        <Image
                          src={Flag}
                          preview={false}
                          height={12}
                          width={22}
                        />
                      </div>
                    </div>
                    <div>
                      <hr className="white_line my-4" />
                    </div>
                    <div className="subtext_white d-flex">
                      <Image src={Email} alt="email" preview={false} />
                      <span className="ml-4 overflowText">
                        Lohari@gmail.com
                      </span>
                    </div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Phone} alt="email" preview={false} />
                      <span className="ml-4 overflowText">0526359855</span>
                    </div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Nation} alt="email" preview={false} />
                      <span className="ml-4 overflowText">UAE</span>
                    </div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Individual} alt="email" preview={false} />
                      <span className="ml-4 overflowText">Individual</span>
                    </div>

                    <div>
                      <hr className="white_line my-4" />
                    </div>
                    <div className="subtext_white center mt-3">
                      Do you own or control 25% or more of the business?
                    </div>
                    <div className="subtext_white my-3">
                      <b>Yes</b>
                    </div>
                  </div>
                </Col>
                <Col span={18}>
                  <div className="px-5">
                    <Card className="kybCard">
                      <div className="titleText">Business details</div>
                      <Row className="my-4">
                        <Col span={12} className="subText">
                          <Image
                            src={Company}
                            alt="company"
                            preview={false}
                            className="px-3"
                          />
                          Lohari Company
                        </Col>
                        <Col span={12} className="subText">
                          <Image
                            src={Job}
                            alt="company"
                            preview={false}
                            className="px-3"
                          />
                          Service Providers
                        </Col>
                      </Row>
                      <Row className="my-4">
                        <Col span={12} className="subText">
                          <Image
                            src={Location}
                            alt="company"
                            preview={false}
                            className="px-3"
                          />
                          116, Building 6
                        </Col>
                        <Col span={12} className="subText">
                          <Image
                            src={Globe}
                            alt="company"
                            preview={false}
                            className="px-3"
                          />
                          www.loharicompany.com
                        </Col>
                      </Row>
                    </Card>
                    <Card className="kybCard mt-4">
                      <div className="titleText">Documents</div>
                      <Row className="mt-4 dashboardTabs">
                        <Tabs
                        onChange={(key)=>{setTab(key)}}
                          defaultActiveKey="business"
                          className="d-none-res tableTab"
                        >
                          <TabPane tab="Business" key="business">
                          </TabPane>
                          <TabPane tab={`Representative`} key="rep"></TabPane>
                          <TabPane tab={`Checklist`} key="check"></TabPane>
                        </Tabs>
                      </Row>
                      {Tab === 'business' ? <div><Business /></div> : ""}
                      {Tab === 'rep' ? <div><Representative /></div> : ""}
                      {Tab === 'check' ? <div><CheckList /></div>:""}
                    </Card>
                  </div>
                </Col>
              </Row>
              </DefaultLayout>
            </div>
            </div>
  );
};

export default KYBDetails;
