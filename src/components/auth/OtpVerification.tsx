import { Col, Form, Row } from "antd";
import "../auth/auth.scss";
import LeftSideStructure from "./leftStructure/LeftSideStructure";
import { MainButtonRound, ViewButton } from "../ui-elements/ButtonRepo";
import Alerts from "../utilities/Alert";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { resendOtp, verifyOtp } from "../../services/user";
// @ts-ignore
import OTPInput from "otp-input-react";
import { SmallText } from "../ui-elements/TextRepo";
import { useLocation, useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../Common/Constants";
import { Dashboard, Login, VerificationStep1 ,KYBVerificatioStep2} from "../Common/RouteConst";
import { getUserData } from "../../services/admin";

const OtpVerification = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({ status: false, message: "" });
  const [success, setSuccess] = useState({ status: false, message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [resendbtnLoader, setResendBtnLoader] = useState(false);
  const [timer, setTimer] = useState(120);
  const [otp, setOTP] = useState("");
  const [isKycVerified, setIsKycVerified] = useState(true);
  const [kycState, setKycState] = useState("");
  const [otpError, setOtpError] = useState("");
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const location = useLocation();

  useEffect(() => {
    if (otp?.length < 4 && otp != "") {
      setOtpError("Enter Valid code!");
    } else {
      setOtpError("");
    }
  }, [otp]);  
  
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  
  const onFinish = async () => {
    setBtnLoader(true)
    const payload = { ...state, otp }
    verifyOtp(payload)
    .then(async (response: any) => {
        setBtnLoader(false);
      if ([201, 200].includes(response.status)) {
        const authDetails: any = JSON.parse(getLocalStorage("auth")!);
        const updateAuth = {...authDetails , otp: otp}
        setLocalStorage("auth", JSON.stringify(updateAuth));
        if (["ADMIN", "TRUSTEE", "AUTHORIZER", "SENIOR_MANAGMENT","MAKER","CHECKER","SUPPORT_ENGINEER"].includes(userType)) {
          window.location.href = Dashboard;
        } else {
          if (!isKycVerified && kycState === "INITIATED" && userType === "ESCROW_ADVISOR") {
            window.location.href = KYBVerificatioStep2;
          } else if (!isKycVerified && kycState === "INITIATED" && userType !== "ESCROW_ADVISOR") {
            window.location.href = VerificationStep1;
          } else {
            if (location?.state?.redirectUrl) {
              window.location.href = location?.state?.redirectUrl
            }else{
              window.location.href = Dashboard;
            }
          }
        }
      }
    })
    .catch((err: any) => {
        setBtnLoader(false);
        setError({
            status: true,
            message: err?.data?.message?.[0]?.fieldName === "UserNotConfirmedException" ?
                "Please activate your account!" : typeof err?.data?.message === 'string' ? err?.data?.message :
                    err?.data?.message?.[0]?.errorMsg
        });
        setSuccess({ status: false, message: "" })
    });
  };
  const { state } = useLocation();
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
      const payload: object = state;
      resendOtp(payload)
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

  useEffect(() => {
    if (!state?.email || !state?.password) {
      navigate(Login);
    }
    checkKycStatus();
  }, []);

  const goBack = () => {
    navigate(Login);
  };
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const checkKycStatus = () => {
    getUserData(email)
      .then((res) => {
        setIsKycVerified(res?.data?.ekycStatus);
        setKycState(res?.data?.ekycState);
      })
  };

  return (
    <Row gutter={0} className={Width < 991 ? "t-login login side-div justify-content-center overflowScroll" :'t-login login side-div justify-content-center'}>
      <Col span={12} className="side-sec">
        <LeftSideStructure page="otp" width={Width}/>
      </Col>
      <Col span={Width > 991 ? 12 : 24} className={Width > 991 ? "d-table" :'mx-3'}>
      <div className="min-side-div mb-5">
          <LeftSideStructure page="otp" width={Width}/>
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
            <div className="formText mt-5">OTP verification</div>
          </div>
          <div className="formSubText mt-3">
            4 digits OTP has been sent on <span className="email">{email}</span>
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
                OTPLength={4}
                otpType="number"
                className="otpfield mt-5 center"
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

export default OtpVerification;
