import "../auth/auth.scss";

import { SmallText } from "../ui-elements/TextRepo";
import { Col, Form, Image, Input, Row } from "antd";
import {
  LinkButton,
  MainButtonRound,
  ViewButton,
} from "../ui-elements/ButtonRepo";
import { MailOutlined, UnlockOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Alerts from "../utilities/Alert";
import { InputText } from "../ui-elements/InputsRepo";
import LeftSideStructure from "../auth/leftStructure/LeftSideStructure";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import FormLogo from "../../assets/img/formLogo.svg";
import { loginUser} from "../../services/user";
import { emailRegex,setLocalStorage } from "../Common/Constants";
import { Forgot, OtpVerification, SignUp, Signuplanding,  VerifyEmail } from "../Common/RouteConst";

const Login = ():any => {
  const [error, setError] = useState({ status: false, message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [Height, setHeight] = useState(document?.body?.clientHeight)
  const [Width, setWidth] = useState(document?.body?.clientWidth)
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location?.search);
  const redirectUrl = decodeURIComponent(queryParams.get("redirect") || "");
  const [searchParams] = useSearchParams();
  const [utmParams, setUtmParams] = useState({});

  useEffect(() => {
    const source = searchParams.get("source");
    setUtmParams(prevParams => ({ ...prevParams, source }));
  }, [searchParams]);

  const onFinish = async (data: any) => {
    setBtnLoader(true);
    loginUser({ email: data.email.toLowerCase(), password: data.password })
      .then(async (response: any) => {
        setBtnLoader(false);
        setLocalStorage("auth", JSON.stringify(response.data));
        navigate(OtpVerification, {
          state: { ...response?.data, password: data.password ,redirectUrl},
        });
      })
      .catch((err: any) => {
        setBtnLoader(false);
        if (err?.data?.statusCode === 400 && err?.data?.message?.[0]?.errorMsg == 'Please check your email to activate your account') {
          setIsUserVerified(true);
          setEmail(data.email.toLowerCase())
        }
        setError({
          status: true,
          message:
             err?.data?.statusCode=== 403 && typeof err?.data?.message != "string"
              ?"We kindly ask you to register before proceeding further"
              :err?.data?.message?.[0]?.fieldName === "UserNotConfirmedException"
              ? "Please activate your account! Link has been send on your email"
              : typeof err?.data?.message === "string"
              ? err?.data?.message
              : err?.data?.message?.[0]?.errorMsg,
        });
      });
  };

  const handleChange = () => {
    setError({ status: false, message: "" });
  };
  const setHeightVal = () =>{
    setHeight(document?.body?.clientHeight)
    setWidth(document.body.clientWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", () => {
      setHeightVal();
    });
    return () => window.removeEventListener("resize", setHeightVal);
  }, []);


  const getUtmParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      utmSource: searchParams.get('utm_source'),
      utmMedium: searchParams.get('utm_medium'),
      utmCampaign: searchParams.get('utm_campaign'),
      utmContent: searchParams.get('utm_content')
    };
  };
  useEffect(() => {
    const params = getUtmParams();
    setUtmParams(params); 
  }, []);

  const getSignupUrl=()=>{
    const utmQuery = new URLSearchParams(utmParams).toString();
    const targetUrl = (sourceParam === "signup-landing") ? `${Signuplanding}?${utmQuery}` : SignUp;
    return targetUrl;
  }
  const sourceParam = new URLSearchParams(window.location.search).get("source");
  // const targetUrl = (sourceParam === "signup-landing") ? Signuplanding : getSignupUrl();
 
  

  return (
    <div>
      <Row gutter={0} className={Width < 991 ? "t-login login side-div justify-content-center overflowScroll" :'t-login login side-div justify-content-center'}>
        <Col span={12} className="vh-100 side-sec">
          <LeftSideStructure width={Width} />
        </Col>
        <Col span={Width > 991 ? 12 : 24} className={Width > 991 ? "d-table" :'mx-3'}>
        <div className="min-side-div mb-5">
          <LeftSideStructure width={Width} />
          </div>
          <div className="card bg-white logincard">
            <Image src={FormLogo} height={90} width={77} preview={false} style={{ marginLeft: "-14px" }}/>
            <div className="formText responsive">Welcome!</div>
            <div className="formSubText mt-2 mb-3">
              Please enter your credentials to proceed
            </div>
            <div className="xy-center d-table-cell align-middle">
              <div>
                <Form className="" scrollToFirstError onFinish={onFinish}>
                  {error.status && (
                    <Alerts
                      className="mb-4 px-3 mt-3 responsive"
                      showIcon
                      description={
                        error.message ||
                        "Something went wrong. Please try again!"
                      }
                      type="error"
                    />
                  )}
                  {isUserVerified &&
                    <>
                      <SmallText
                        children={
                          <>
                            {"Please "}
                            <ViewButton
                              children="click here"
                              className="cursor orangeText"
                              onClick={() => { navigate(VerifyEmail, { state: {email} }) }}
                            >
                            </ViewButton>
                            {" to activate your account"}
                          </>
                        }
                        className={Height > 800 ? "text-center create-text mt-5 responsive" : "text-center create-text "}
                      />
                    </>
                  }
                  <InputText
                    fieldname="email"
                    className="inputField mt-3 responsive w-100"
                    rules={[
                      {
                        required: true,
                        message: "Email is required!",
                      },
                      {
                        pattern: emailRegex,
                        message: "Enter valid email!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Email address *"
                      autoFocus
                      prefix={<MailOutlined className="me-3" />}
                      onChange={handleChange}
                    />
                  </InputText>
                  <InputText
                    fieldname="password"
                    className="inputField mt-3 w-100"
                    rules={[
                      {
                        required: true,
                        message: "Password is required!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Password *"
                      prefix={<UnlockOutlined className="me-3" />}
                      onChange={handleChange}
                    />
                  </InputText>
                  <div className="resend-msg-container mb-4">
                    {/* <Checkbox className="mt-2">
                      <SmallText
                        className="formSubText"
                        children={"Remember Me ?"}
                        style={{ textAlign: "start" }}
                      />
                    </Checkbox> */}
                    
                    <Link to={Forgot} className="forgetpassword">
                      <LinkButton children="Forgot Password?" />
                    </Link>
                  </div>

                  <div className="mb-0 button-container signup-res-btn">
                    <MainButtonRound
                      children="Login"
                      className="w-100 mb-2 login-btn"
                      htmlType="submit"
                      loading={btnLoader}
                    />
                  </div>
                  <SmallText
                    children={
                      <>
                        Don’t have account?{" "}
                        <Link to={getSignupUrl()}>
                          <ViewButton
                            children="Create Now"
                            className="orangeText"
                          />
                        </Link>{" "}
                      </>
                    }
                    className={Height > 800 ? "text-center create-text mt-2 pt-3 responsive" : "text-center create-text pt-3"}
                  />
                </Form>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
