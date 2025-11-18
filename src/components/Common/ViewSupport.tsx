import { Breadcrumb, Col, Popover, Row, Image, Card } from "antd";
import { SupportHelpList, SupportList } from "./RouteConst";
import DefaultLayout from "../Common/DefaultLayout";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Email from "../../assets/img/Email.svg";
import Phone from "../../assets/img/Phone.svg";
import Nation from "../../assets/img/Nation.svg";
import Individual from "../../assets/img/Individual.svg";
import Country from "../../assets/img/Country.svg";
import { getSupportById, getUserData } from "../../services/admin";
import { useEffect, useState } from "react";
import moment from "moment";
import { getLocalStorage } from "./Constants";


const ViewSupport = ():any => {

  const navigate = useNavigate();
  const [supportDetails,setSupportDetails] = useState<any>([]);
  const [UserData, setUserData] = useState<any>({});
  const [fileData, setFileData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const url = window?.location?.pathname.split("/");
  const id = url[url.length - 2]; // Get the second-to-last segment
  const photoid = url[url.length - 1];
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;

  useEffect(() => {
    fetchSupport();
  }, [])
  
  const fetchSupport = () =>{
    setLoading(true)
    const queryid=parseInt(photoid)
    getSupportById(id,queryid).then((res:any)=>{
        setSupportDetails(res?.data?.response?.[0])
        setFileData(res?.data?.documentSign)
        //fetching user data
        getUserData(res?.data?.response?.[0]?.email).then((response: any) => {
          setUserData(response?.data);
          setCountry(response?.data?.countryAlias);
          setLoading(false);
        });
    })
}

  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
        <DefaultLayout
          page="support"
          loading={loading}
          TitleText="supportlist"
          TitleImage={LeftArrow}
          backtoDashboard={true}
          headerPage={
            <div className="d-flex">
              <Image
                src={LeftArrow}
                preview={false}
                onClick={() => {
                  if (userType === "USER" || userType === "TRUSTEE") {
                    navigate(SupportHelpList);
                  } else {
                    navigate(SupportList);
                  }
                }}
                className="mt-2 cursor"
              />
              <div className="ml-5">
                <b>Support details</b>
                <Breadcrumb separator=">">
                  {/* <Breadcrumb.Item
                    onClick={() => {
                      navigate(Dashboard);
                    }}
                    className="cursor"
                  >
                    Dashboard
                  </Breadcrumb.Item> */}
                  <Breadcrumb.Item className="cursor"
                    onClick={() => {
                      if (userType === "ADMIN") {
                        navigate(SupportList);
                      } else {
                        navigate(SupportHelpList);
                      }
                    }}
                  >
                    Support list
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>View support</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          }
        >
          <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
            <Col xs={24} sm={24} md={24} lg={15} xl={15}>
              <div className="bg-admin-card p-4">
                <Col span={24}>
                  <div className="d-flex">
                    <Col span={24} className="mr-25">
                      <div className="title_white mt-3">
                      {UserData?.name}
                      </div>
                      <hr className="mt-4" />
                    </Col>
                  </div>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <div className="mr-20">
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Email} alt="email" preview={false} />
                          <Popover content= {UserData?.email}>
                          <span className="ml-4 overflowText userinfo cursor">
                             {UserData?.email}
                          </span>
                          </Popover>
                        </div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Phone} alt="phone" preview={false} />
                          <Popover content={UserData?.contactNumber}>
                           <span className="ml-4 overflowText userinfo">
                             {UserData?.contactNumber}
                           </span>
                          </Popover>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <div className="subtext_white mt-3 d-flex">
                        <Image src={Nation} alt="country" preview={false}/>
                        <Popover content={UserData?.countryAlias}>
                           <span className="ml-4 overflowText userinfo">
                             {UserData?.countryAlias}
                           </span>
                          </Popover>
                        <div className="mx-2">
                          <div className="px-1 bluecard-flag">
                          <span>
                        {country ? <span className={`fi fi-${country.toLowerCase()} `} /> 
                        : <Image src={Country}  preview={false}  height={12}
                        width={22}/> }               
                      </span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex w-100 justify-content-between flex-wrap">
                        <div className="subtext_white mt-3 d-flex ">
                          <Image src={Individual} alt="type" preview={false} />
                          <Popover content={UserData?.userType}>
                              <span className="ml-4 overflowText userinfo">
                              {UserData?.userType}
                              </span>
                            </Popover>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </div>
            </Col>
          </Row>
          <div className="titleText mt-4 mb-3">Issue details</div>

          <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
            <Col xs={24} sm={24} md={24} lg={15} xl={15}>
              <Card className="p-4">
                <Row gutter={[16, 16]}>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    className="d-flex my-sm-2"
                  >
                    <div className="mx-3 ">
                      <div className="stepDetails_medium_sub">Title</div>
                      <div className="subText_small fw-400">{supportDetails?.title}</div>
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    className="d-flex my-sm-2"
                  >
                    <div className="mx-3 ">
                      <div className="stepDetails_medium_sub">
                        Type of issue
                      </div>
                      <div className="subText_small fw-400">{supportDetails?.issuename}</div>
                    </div>
                  </Col>
                  <Col
                     xs={24}
                     sm={24}
                     md={12}
                     lg={12}
                     xl={12}
                    className="d-flex my-sm-2"
                  >
                    <div className="mx-3 ">
                      <div className="stepDetails_medium_sub">
                        Create at
                      </div>
                      <div className="subText_small fw-400">{moment(supportDetails?.createAt).format("DD-MMM-YYYY")}</div>
                    </div>
                  </Col>
                  <Col  
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    className="d-flex my-sm-2">
                    <div className="mx-3 ">
                      <div className="stepDetails_medium_sub">Description</div>
                      <div className="subText_small fw-400">
                       {supportDetails?.description || "--"}
                      </div>
                    </div>
                  </Col>
                  {supportDetails?.adminComments && supportDetails?.adminComments?.length > 0 && (
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                      className="d-flex my-sm-2"
                    >
                      <div className="mx-3 ">
                        <div className="stepDetails_medium_sub">Admin Comments</div>
                        <div className="subText_small fw-400">{supportDetails?.adminComments}</div>
                      </div>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          </Row>
          <div className="titleText mt-4 mb-2">Document</div>
         <Image alt="example" src={fileData?.url} height={175} width={200}  preview={true} />
        </DefaultLayout>
      </div>
    </div>
  );
};

export default ViewSupport;
