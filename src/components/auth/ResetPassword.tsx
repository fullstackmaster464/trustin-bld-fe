import { Button, Col, Form, Image, Input, Modal, Row, Tooltip } from "antd";
import "../auth/auth.scss";
import LeftSideStructure from "./leftStructure/LeftSideStructure";
import { MainButtonRound, ViewButton } from "../ui-elements/ButtonRepo";
import Alerts from "../utilities/Alert";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeftOutlined, InfoCircleOutlined, UnlockOutlined } from "@ant-design/icons";
import { confirmOTP, forgotPassword } from "../../services/user";
// @ts-ignore
import OTPInput from "otp-input-react";
import { SmallText } from "../ui-elements/TextRepo";
import { useLocation, useNavigate } from "react-router-dom";
import SuccessIcon from "../../assets/img/Successpopupicon.svg";
import { Login } from "../Common/RouteConst";
import { InputText } from "../ui-elements/InputsRepo";
import { containNumber, LowerCase, maximum8Char, SpecialCharater, UpperCase } from "../Common/Constants";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({ status: false, message: "" });
  const [success, setSuccess] = useState({ status: false, message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [resendbtnLoader, setResendBtnLoader] = useState(false);
  const [timer, setTimer] = useState(60);
  const [OTP, setOTP] = useState("");
  const [otpError, setOtpError] = useState("")
  const [SuccessModal, setSuccessModal] = useState(false)
  const { state } = useLocation();
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [Height, setHeight] = useState(document?.body?.clientHeight)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({ status: false, message: "", });

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
    setHeight(document?.body?.clientHeight)
  }
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);
  useEffect(()=>{
    if(OTP?.length < 4 && OTP != '' ){
      setOtpError("Enter Valid code!")
    }
    else{
      setOtpError("")
    }
  },[OTP])

  const passwordRulesTooltip = (
    <div>
      <p>Password must contain:</p>
      <ul>
        <li>An uppercase letter</li>
        <li>A lowercase letter</li>
        <li>
          A special character from any one of the following are allowed: !, @, #, $, %, ^, &, -, _
        </li>
        <li>A numeric value</li>
        <li>8 characters</li>
      </ul>
    </div>
  );

  const checkValidation = (e: any) => {
    const password = e.target.value;
    const upperCase = UpperCase;
    const lowerCase = LowerCase;
    const specialChar = SpecialCharater;
    const eightChar = maximum8Char;
    const numeric = containNumber;
    const allowedSpecialChars = /^[A-Za-z0-9!@#$%^&_\-]*$/;
    if (!allowedSpecialChars.test(password)) {
      setPasswordValidation({
        status: false,
        message: 'Only the following special characters are allowed: !, @, #, $, %, ^, &, -, _',
      });
      return;
    }
    if (
      upperCase.test(password) &&
      lowerCase.test(password) &&
      specialChar.test(password) &&
      eightChar.test(password) &&
      numeric.test(password) ||
      password === ""
    ) {
      setPasswordValidation({ status: true, message: "" });
    } else {
      setPasswordValidation({
        status: false,
        message: "Password format incorrect!",
      });
    }
  };
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const onFinish = async (values:any) => {
    
    const params = {
        confirmationCode:OTP,
        email:state?.email,
        password:values?.password
    }
    setBtnLoader(true);
    if (passwordValidation.status === true) {
    confirmOTP(params)
      .then(async () => {
        setBtnLoader(false);
        setSuccessModal(true)
      })
      .catch((err:any) => {
        setBtnLoader(false);
        setOTP('');
        setError({
          status: true,
          message:
            err?.data?.error?.[0]?.fieldName === "UserNotConfirmedException"
              ? "Please activate your account!"
              : typeof err?.data?.error === "string"
              ? err?.data?.error
              : err?.data?.error?.message,
        });
        setSuccess({ status: false, message: "" });
      });
    }else {
      setBtnLoader(false);
    }
  };

  // otp count down function
  const timeOutCallback = useCallback(() => {
    setTimer((currTimer:number) => currTimer - 1);
  }, []);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
    if (timer == 0) {
      setSuccess({ status: false, message: "" });
    }
  }, [timer, timeOutCallback]);

  // Resend opt Handler
  const resendOTP = () => {
    setResendBtnLoader(true)
    setOTP('');
    if (timer === 0) {
      const params = {
        email:state?.email
      }
      forgotPassword(params)
        .then(() => {
          setSuccess({
            status: true,
            message: "OTP has been sent to your email",
          });
      setTimer(60);
      setTimeout(() => {
        setSuccess({
          status: false,
          message: "",
        });
      }, 5000);
      setResendBtnLoader(false)
          setError({ status: false, message: "" });
        })
        .catch((err:any) => {
          setSuccess({ status: false, message: "" });
          setResendBtnLoader(false)
          setError({
            status: true,
            message: err.data?.message.map((e:any) => {
              return `\n${e}`;
            }),
          });
        });
    }
  };

  useEffect(() => {
    if (!state?.email) {
      navigate(Login);
    }
  }, []);

  const goBack = () =>{
    navigate(Login)
  }
  return (
      <Row gutter={0} className={Width < 992 ? "t-login login side-div justify-content-center overflowScroll" :'t-login login side-div justify-content-center'}>
        <Col span={12} className="vh-100 side-sec">
          <LeftSideStructure page="forgot" width={Width} />
        </Col>
        <Col span={Width > 992 ? 12 : 24} className={Width > 992 ? "d-table" :'mx-3'}>
        <div className="min-side-div mb-5">
          <LeftSideStructure page="forgot" width={Width} />
          </div>
          <div className={Height > 800 ? "card bg-white logincard bottom-0" : "card bg-white logincard"}>
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
            <div className="formText mt-5">Reset password</div>
          </div>
            <div className="formSubText mt-3 otpdesc-res">
            OTP is shared on mail, please enter here
            </div>
            <div className="xy-center d-table-cell align-middle">
              <Form
                className="mx-auto justify-content-center auth-form-width"
                scrollToFirstError
                onFinish={onFinish}
              >
                {error.status && (
                  <Alerts
                    className="mb-4 mt-4 "
                    showIcon
                    description={
                      error.message || "Something went wrong. Please try again!"
                    }
                    type="error"
                  />
                )}

                {success.status && (
                  <Alerts
                    className="px-3 mt-4"
                    showIcon
                    description={success.message || "Success!"}
                    type="success"
                  />
                )}
                <OTPInput
                  value={OTP}
                  onChange={setOTP}
                  autoFocus
                  OTPLength={6}
                  otpType="number"
                  // className="otpfield mt-4"
                  className={Width < 500 ? "otpfield mt-4 flex-wrap" :'otpfield mt-4'}
                  disabled={timer < 1 ? true : false}
                />
                <div className="errMsg mb-4">{otpError}</div>
                <div className="d-flex">
             
                </div>

                <SmallText
                  className="fw-400 bold"
                  children={"Didn't received OTP?"}
                  style={{ textAlign: "center" }}
                />
                <SmallText
                  className="user-text otp-message orangeText bold"
                  children={
                    <>
                      {timer ? (
                        <span>
                          {" "}
                          Resend OTP in <span>{timer}</span> seconds
                        </span>
                      ) : (
                        <ViewButton
                          children="Resend"
                          disabled={timer}
                          onClick={() => resendOTP()}
                          loading={resendbtnLoader}
                        />
                      )}
                    </>
                  }
                  style={{ textAlign: "center" }}
                />
                 <InputText
                    fieldname="password"
                    className="inputField mt-5"
                    rules={[
                      { required: true, message: "Password is required!" },
                      {
                        validator(_: any) {
                          if (passwordValidation.status === true) {
                            return Promise.resolve();
                          }
                          return Promise.reject(passwordValidation.message);
                        },
                      },
                    ]}
                  >
                      <span className="">
                    <Input.Password
                      placeholder="Create new password"
                      prefix={<UnlockOutlined className="me-3" />}
                      onChange={(e) => checkValidation(e)}
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                    />
                       <Tooltip
                      title={passwordRulesTooltip}
                      visible={!passwordValidation.status && isPasswordFocused}
                      overlayClassName="custom-tooltip signupTooltip"
                    >
                      <span className="pwd_info">
                        <InfoCircleOutlined />
                      </span>
                    </Tooltip>
                  </span>
                  </InputText>
                   <MainButtonRound
                  loading={btnLoader}
                  children="Submit"
                  className="w-100  my-4"
                  htmlType="submit"
                  disabled={timer < 1 || OTP?.length < 6 ? true : false}
                />
              </Form>
            </div>
          </div>
        </Col>
        <Modal
        open={SuccessModal}
        footer={false}
        closable={false}
        className="modal-box success"
                centered
                width={500}
                onCancel={()=>{setSuccessModal(false); navigate(Login)}}
      >
        <div className="text-center">
        <Image src={SuccessIcon} alt="success" preview={false} className="mt-5" width={Width > 767 ? "auto" : 120} />
       
          <div className="titleText mt-5 mb-3">Password changed successfully!</div>
          <Button className="rounded_blue_outline btn-OK mb-4" onClick={()=>{navigate(Login)}}>Ok</Button>
          </div>
      </Modal>

      </Row>
  );
};

export default ResetPassword;
