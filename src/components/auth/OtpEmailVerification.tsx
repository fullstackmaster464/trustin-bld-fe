import { Col, Form, Row } from "antd";
import "../auth/auth.scss";
import LeftSideStructure from "./leftStructure/LeftSideStructure";
import { MainButtonRound, ViewButton } from "../ui-elements/ButtonRepo";
import Alerts from "../utilities/Alert";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getUserEmail, reSendVerificationCode, verifyEmailLogin } from "../../services/user";
// @ts-ignore
import OTPInput from "otp-input-react";
import { SmallText } from "../ui-elements/TextRepo";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Dashboard } from "../Common/RouteConst";
import { setLocalStorage } from "../Common/Constants";



const OtpEmailVerification = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({ status: false, message: "" });
  const [success, setSuccess] = useState({ status: false, message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [resendbtnLoader, setResendBtnLoader] = useState(false);
  const [timer, setTimer] = useState(120);
  const [otp, setOTP] = useState("");
  const [otpError, setOtpError] = useState("");
  const [email, setEmail] = useState("");
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const { state } = useLocation();
  const { userAlias } = useParams();
  useEffect(() => {
    if (otp?.length < 6 && otp != "") {
      setOtpError("Enter Valid code!");
    } else {
      setOtpError("");
    }
  }, [otp]);

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  useEffect(() => {
    if (userAlias) {
      getUserEmail(userAlias)
      .then(async (response: any) => {
        if (response?.data?.statusCode === 200) {
          setEmail(response?.data?.data?.email)
        } 
      })
      .catch(() => {
        setBtnLoader(false);
      });
    }
  }, [userAlias]);

  const resolvedEmail = state?.email || email;

  const onFinish = async () => {
    if (!resolvedEmail) {
      setError({ status: true, message: "Missing email. Please retry." });
      return;
    }
    if (otp.length !== 6) {
      setError({ status: true, message: "Please enter 6-digit OTP." });
      return;
    }

    setBtnLoader(true);
    try {
      const response: any = await verifyEmailLogin({ email: resolvedEmail, otp });
      setBtnLoader(false);

      if (response?.data?.statusCode === 200) {
        setLocalStorage("auth", JSON.stringify(response.data));
        setSuccess({ status: true, message: "Email verified. Logging you in..." });
        window.location.href = Dashboard;
        return;
      }

      setError({
        status: true,
        message: response?.data?.message || "Verification failed. Please try again.",
      });
    } catch (err: any) {
      setBtnLoader(false);
      setError({
        status: true,
        message:
          err?.data?.message?.[0]?.fieldName === "UserNotConfirmedException"
            ? "Please activate your account!"
            : typeof err?.data?.message === "string"
            ? err?.data?.message
            : err?.data?.message?.[0]?.errorMsg || "Verification failed. Please try again!",
      });
      setSuccess({ status: false, message: "" });
    }
  };

  const timeOutCallback = useCallback(() => {
    setTimer((currTimer: number) => currTimer - 1);
  }, []);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
    if (timer == 0) {
      setSuccess({ status: false, message: "" });
    }
  }, [timer, timeOutCallback]);

  const resendOTP = () => {
    setResendBtnLoader(true);
    if (timer === 0) {
    setOTP("");
      const emailValue = state?.email || email
      const payload: object = { email:emailValue , type: "secure" };
      reSendVerificationCode(payload)
        .then(() => {
          setSuccess({
            status: true,
            message: "OTP has been sent to your email",
          });
          setTimer(120);
          setTimeout(() => {
            setSuccess({
              status: false,
              message: "",
            });
          }, 5000);
          setResendBtnLoader(false);
          setError({ status: false, message: "" });
        })
        .catch((err: any) => {
          setSuccess({ status: false, message: "" });
          setResendBtnLoader(false);
          setError({
            status: true,
            message: err.data?.message.map((e: any) => {
              return `\n${e}`;
            }),
          });
        });
    }
  };

  const goBack = () => {
    navigate("/");
  };


  return (
    <Row gutter={0} className={Width < 991 ? "t-login login side-div justify-content-center overflowScroll" :'t-login login side-div justify-content-center'}>
      <Col span={12} className="vh-100 side-sec">
        <LeftSideStructure page="otp" width={Width} />
      </Col>
      <Col span={Width > 991 ? 12 : 24} className={Width > 991 ? "d-table" : 'mx-3'}>
        <div className="min-side-div mb-5">
          <LeftSideStructure page="otp" width={Width} />
        </div>
        <div className="card bg-white logincard">
          <div>
            {" "}
            <ArrowLeftOutlined
              className="leftarrow"
              onClick={() => {
                goBack();
              }}
            />
            <div className="formText mt-5">Email verification</div>
          </div>
          <div className="formSubText mt-3">
            6 digits OTP has been sent on <span className="email">{state?.email || email}</span>
          </div>
          <div className="xy-center d-table-cell align-middle">
            <Form
              className="mx-auto justify-content-center auth-form-width"
              scrollToFirstError
              onFinish={onFinish}
            >
              {error.status && (
                <Alerts
                  className="my-4 px-3"
                  showIcon
                  description={
                    error.message || "Something went wrong. Please try again!"
                  }
                  type="error"
                />
              )}

              {success.status && (
                <Alerts
                  className="my-4 px-3"
                  showIcon
                  description={success.message || "Success!"}
                  type="success"
                />
              )}
              <OTPInput
                value={otp}
                onChange={setOTP}
                autoFocus
                OTPLength={6}
                otpType="number"
                className={Width < 500 ? "otpfield mt-4 flex-wrap" :'otpfield mt-4'}
                // disabled={timer < 1 ? true : false}
              />
              <div className="errMsg mb-4">{otpError}</div>
              <div className="d-flex">
                <MainButtonRound
                  loading={btnLoader}
                  children="Verify"
                  className="w-100 mb-2 signup-btn"
                  htmlType="submit"
                  disabled={timer < 1 || otp?.length < 4}
                />
              </div>

              <SmallText
                className="newacc"
                children={"Didn't received OTP?"}
                style={{ textAlign: "center" }}
              />
              <SmallText
                className="user-text otp-message orangeText"
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
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default OtpEmailVerification;
