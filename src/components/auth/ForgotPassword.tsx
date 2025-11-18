import { Col, Form, Input, Row } from "antd";
import "../auth/auth.scss";
import LeftSideStructure from "./leftStructure/LeftSideStructure";
import { MainButtonRound } from "../ui-elements/ButtonRepo";
import Alerts from "../utilities/Alert";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { forgotPassword } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "../Common/Constants";
import { Login, Reset } from "../Common/RouteConst";
import { InputText } from "../ui-elements/InputsRepo";

const ForgotPassword = ():any => {
  const navigate = useNavigate();
  const [error, setError] = useState({ status: false, message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const onFinish = async (values: any) => {
    setBtnLoader(true);
    const params = {
      email:values?.email?.toLowerCase()
    }
    forgotPassword(params)
      .then(async () => {
        setBtnLoader(false);
        navigate(Reset, {
          state: values,
        });
      })
      .catch((err: any) => {
        setBtnLoader(false);
        setError({
          status: true,
          message:
            err?.data?.error?.message?.[0]?.fieldName ===
            "UserNotConfirmedException"
              ? "Please activate your account!"
              : typeof err?.data?.error?.message === "string"
              ? err?.data?.error?.message
              : err?.data?.error?.message?.[0]?.errorMsg,
        });
      });
  };

  const handleChange = () => {
    setError({ status: false, message: "" });
  };
  const goBack = () => {
    navigate(Login);
  };
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);
  return (
    <Row gutter={0} className={Width < 991 ? "t-login login side-div justify-content-center overflowScroll" :'t-login login side-div justify-content-center'}>
      <Col span={12} className="vh-100 side-sec">
        <LeftSideStructure page="forgot" width={Width} />
      </Col>
      <Col span={Width > 991 ? 12 : 24} className={Width > 991 ? "d-table" :'mx-3'}>
      <div className="min-side-div mb-5">
          <LeftSideStructure page="forgot" width={Width}/>
          </div>
        <div className="card bg-white logincard">
          <div>
            <div
              className="d-flex cursor"
              onClick={() => {
                goBack();
              }}
            >
              <ArrowLeftOutlined className="leftarrow" />
              <div className="titleText mx-3">Back to sign in</div>
            </div>
            <div className="formText mt-5">Forgot password</div>
          </div>
          <div className="formSubText mt-2">
            Please enter your email used for registration
          </div>
          <div className="xy-center d-table-cell align-middle">
            <Form className="" scrollToFirstError onFinish={onFinish}>
              {error.status && (
                <Alerts
                  className="px-3 mt-5"
                  showIcon
                  description={
                    error.message || "Something went wrong. Please try again!"
                  }
                  type="error"
                />
              )}
              <InputText
                fieldname="email"
                className="inputField mt-5 w-100"
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
                  prefix={<MailOutlined className="me-3 w-100" />}
                  onChange={handleChange}
                />
              </InputText>
              <div className="d-flex center forgot-password-btn-container">
                <MainButtonRound
                  loading={btnLoader}
                  children="Send OTP"
                  className="w-100 mb-2 mt-3 forgot-password-btn"
                  htmlType="submit"
                  disabled={error.message ? true : false}
                />
              </div>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
