import { Col, Layout, Row } from "antd";
import Sidebar from "../Common/sidebar";
import Header from "../Common/header";
import TopNavBar from "../Common/TopNavBar";
import { useEffect, useState } from "react";
import Loader from "../utilities/Loader";
import { USER_TYPE_TEXT, getLocalStorage } from "./Constants";
import { useLocation } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const DefaultLayout = (props: any) => {
  const { page, headerPage, loading,TitleText, TitleImage,backtoDashboard, children } = props;
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const isVerified = JSON.parse(getLocalStorage("auth")!)?.isKycVerified;
  const [collapsed, setCollapsed] = useState(false); 
  const location = useLocation();
  const isAddUserPage = location.pathname === "/add-user";
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };

  useEffect(() => {
    const handleResize = () => setWidthVal();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (  
    <Layout className="no_x_scroll bg-gray">
      <div className="d-flex">
        <div className="custome-burger-sidebar">
          {Width > 991 ? 
          (userType != "USER" && userType !== USER_TYPE_TEXT.ESCROW_ADVISOR) || (userType == "USER" && isVerified) || (userType == USER_TYPE_TEXT.ESCROW_ADVISOR && isVerified) ? <div className="h-100">
            <Sidebar page={page} collapsed={collapsed} setCollapsed={setCollapsed} />
          </div> : "" :
          <div>
            <TopNavBar page={page} TitleText={TitleText} TitleImage={TitleImage} backtoDashboard={backtoDashboard}/>
          </div>
          }
        </div>
        <Row className={collapsed ?"fullWidth custome-burgur-min-width":((userType === "USER" || userType === USER_TYPE_TEXT.ESCROW_ADVISOR) && isVerified !== true)? "fullWidth":"fullWidth custome-burgur-max-width"}>
            <Col span={24}>
              <div className="">
           <div className="p-30">
                 {Width > 991 ? <Header page={headerPage} /> : null}
                 {loading ? (
            <Loader />
          ) : <div className={Width <= 991 ? (isAddUserPage ? "mt-70" : "mt-90") : ""}>{children}</div>}
                </div>
              </div>
            </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default DefaultLayout;
