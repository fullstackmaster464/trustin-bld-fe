import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
} from "antd";
// @ts-ignore
import OTPInput from "otp-input-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminProfile} from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import { useCallback, useEffect, useState } from "react";
import { getUserData, updateUserProfile } from "../../services/admin";
import { DEFAULT_COUNTRY_CODE, emailRegex, getLocalStorage, setLocalStorage } from "../Common/Constants";
import SuccessIcon from "../../assets/img/Successpopupicon.svg";
import { InputText } from "../ui-elements/InputsRepo";
import DefaultLayout from "../Common/DefaultLayout";
import { MobilNumberRegex } from "../Common/Constants";
import { AuthTitle, NormalText, SmallText } from "../ui-elements/TextRepo";
import { MainButtonRound, ViewButton } from "../ui-elements/ButtonRepo";
import Alerts from "../utilities/Alert";
import { resendOtp } from "../../services/admin";
import { verifyOtp } from "../../services/user";

const EditAdminProfile = ():any => {
  const navigate = useNavigate();

  const location = useLocation();
  const { disableEmail, disableContact, userUpdate, companyNumber } = location.state || {}; 
  const [UserData, setUserData] = useState<any>({});
  const [Success, setSuccess] = useState<any>({ status: false, message: "" });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [otpModal, setOtpModal] = useState<any>();
  const [timer, setTimer] = useState(60);
  const [otpError, setOtpError] = useState("");
  const [btnLoader, setBtnLoader] = useState<any>(false);
  const [otp, setOTP]= useState<any>("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const UserAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const entityType = JSON.parse(getLocalStorage("auth")!)?.entityType;
  const callingCode = UserData?.callingCode;

  const handleChange = (value: any) => {
    form.setFieldsValue({ email :value });
  };
  const updateMobile = (e: any) => {
    form.setFieldsValue({ mobile: e.target.value });
  };
  
  const generateOTP =  () => {
    const email = form.getFieldValue("email") !==  UserData.email ? form.getFieldValue("email") : null
    const contactNumber = (userUpdate && form.getFieldValue("mobile") ===  UserData.contactNumber) || (!userUpdate && form.getFieldValue("mobile") === companyNumber) ? null : form.getFieldValue("mobile")
    if (!email && !contactNumber) {
      setSuccess({ status: true, message: "Profile updated successfully" })
      setUpdateLoading(false);
      return
    }
    let params: any = {};
    if (entityType === "INDIVIDUAL") {
      params = {
        email: email,
        contactNumber: contactNumber,
        userAlias: UserAlias,
        entityType: entityType
      }
    } else {
      params = {
        email: email,
        contactNumber: userUpdate ? contactNumber : null,
        companyNumber: userUpdate ? null : contactNumber,
        userAlias: UserAlias,
        entityType: entityType
      }
    }

    setOTP("");
    resendOtp(params)
      .then(()=> {
        setLoading(false);
        setTimer(60);
        setOtpModal(true);
      })
      .catch((e) =>{
        setLoading(false);
        if (e?.status === 403) {
          message.error(e?.data?.error.message)
        } else {
          message.error("Error generating OTP. Please try again later")
        }
    })
  }

  const onFinishOtp = async () => {
    setBtnLoader(true)
    const contactNumber = form.getFieldValue("mobile")
    let params: any = {};
    if (entityType === "COMPANY") {
      params = {
        contactNumber: userUpdate ? contactNumber : null,
        companyNumber: userUpdate ? null : contactNumber,
        email: form.getFieldValue("email"),
        userAlias: UserAlias,
        entityType: entityType
      };
    } else {
      params = {
        contactNumber: contactNumber,
        email: form.getFieldValue("email"),
        userAlias: UserAlias,
        entityType: entityType
      };
    }
  try {
    await verifyOtp({
      email: UserData.email,
      otp: otp,
    });

    // setBtnLoader(false);
    setOtpModal(false);

    const localStorageValue = JSON.parse(getLocalStorage('auth')!)
    updateUserProfile(params).then((value) => {
      localStorageValue.token = value.data?.token || localStorageValue.token
      localStorageValue.email = params.email || localStorageValue.email
      setLocalStorage('auth', JSON.stringify(localStorageValue))
    })
    setUpdateLoading(true);
    
    setSuccess({ status: true, message: "Profile updated successfully" });  

    } catch (e: any) {
      if (e?.data?.message === 'Otp Is Invalid') {
        message.error('Invalid otp')
      } else {
        message.error('Error updating profile. Please try again later!')
      }
    } finally {
      setBtnLoader(false)
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (otp?.length < 4 && otp != "") {
      setOtpError("Enter Valid code!");
    } else {
      setOtpError("");
    }
  }, [otp]);  

  const timeOutCallback = useCallback(() => {
    setTimer((currTimer: number) =>  currTimer != 0 ? currTimer - 1 : currTimer);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(timeOutCallback, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [timer, timeOutCallback]);
  
  useEffect(() => {
    const UserEmail = JSON.parse(getLocalStorage("auth")!);
    setLoading(true);
    getUserData(UserEmail?.email).then((response: any) => {
      setLoading(false);
      setUserData(response?.data);
      form.setFieldsValue({
        email: response?.data?.email,
        mobile: companyNumber ?? response?.data?.contactNumber,
      });
      // if (entityType === "COMPANY") {
      //   form.setFieldsValue({
      //     businessName: response?.data?.businessName,
      //     mobile: response?.data?.contactNumber,
      //   });
      // }else{
      //   form.setFieldsValue({
      //     name: response?.data?.name,
      //     mobile: response?.data?.contactNumber,
      //   });
      // }
    });
  }, []);
  const goBack = () => {
    navigate(AdminProfile);
  };
  const closemodal = () => {
    setSuccess({status: true, message: 'Profile updated successfully'});
    navigate(AdminProfile);
  };
  const handleBlur = (e:any) => {
    const newValue = e.target.value;
    const array=newValue.split("")
    let myString =""
    if(array[0]==='0'){
      array.shift()
     myString= array.join('');
     form.setFieldValue("mobile", myString);
    }
  };
  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };
  const validateContactNumber = (_rule: any, value: string) => {
    return new Promise((resolve: any, reject: any) => {
      if (!value) {
        return reject("Mobile number is required!");
      }
  
      const validNumber = value.replace(MobilNumberRegex, '');
      if (callingCode === DEFAULT_COUNTRY_CODE) {
        if (!validNumber.startsWith('5')) {
          return reject("UAE numbers should start with 5");
        }
      }
  
      if (validNumber.length < 7) {
        return reject("Enter valid mobile number!!");
      }
  
      resolve(); 
    });
  }; 
  
  /*const resendOTP = () => {
    setResendBtnLoader(true);
    if (timer === 0) {
      // generateContractOtp(paymentDetails,userAlias)
      //   .then(() => {
      //     setSuccess({
      //       status: true,
      //       message: "OTP has been sent to your email",
      //     });
      //     setTimer(60);
      //     setTimeout(() => {
      //       setSuccess({
      //         status: false,
      //         message: "",
      //       });
      //     }, 5000);
      //     setResendBtnLoader(false);
      //     setError({ status: false, message: "" });
      //   })
      //   .catch((err: any) => {
      //     setSuccess({ status: false, message: "" });
      //     setResendBtnLoader(false);
      //     setError({
      //       status: true,
      //       message: err.data.message
      //     });
      //   });
    }
  };*/

  return (
    <div className="scrollbar-container">
        <DefaultLayout
        page="profile"
        loading={loading}
        TitleText="Edit profile"
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
            <b> Edit profile</b>
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
                  navigate(AdminProfile);
                }}
              >
                Profile
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                Edit profile
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      }
      >

              <Card className="noBorder mt-6 profile-details-card">
                <Row>
                  <Col span={24}>
                    <div className="titleText">Profile details</div>
                    <Form form={form} scrollToFirstError onFinish={generateOTP}>
                <Row className="mt-5" gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                  {entityType && entityType === 'COMPANY' && !userUpdate ? (<>
                    <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                      <div className="stepDetails_medium_light my-2 fw-500">
                      Business Name
                      </div>
                      <div className="stepDetails_medium_light my-2 fw-500">
                        {UserData?.businessName}
                      </div>
                      {/* <InputText
                        fieldname="businessName"
                        className="inputField error-input"
                        rules={[
                          {
                            required: true,
                            message: "Business name is required!",
                          },
                          {
                            whitespace: true,
                            message: "Enter valid business name!",
                          },
                        ]}
                        onChange={(e: object) => {
                          updateName(e);
                        }}
                      >
                        <Input
                          placeholder="Enter your name"
                          className="stepDetails_medium fw-500"
                          value={UserData?.businessName}
                        />
                      </InputText> */}
                    </Col>
                  </>) : (<>
                    <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                      <div className="stepDetails_medium_light my-2 fw-500">
                        Name
                      </div>
                      <div className="stepDetails_medium_light my-2 fw-500">
                        {UserData?.name}
                      </div>
                      {/* <InputText
                        fieldname="name"
                        className="inputField error-input"
                        rules={[
                          {
                            required: true,
                            message: "Name is required!",
                          },
                          {
                            whitespace: true,
                            message: "Enter valid name!",
                          },
                        ]}
                        onChange={(e: object) => {
                          updateName(e);
                        }}
                      >
                        <Input
                          placeholder="Enter your name"
                          className="stepDetails_medium fw-500"
                          value={UserData?.name}
                        />
                      </InputText> */}
                    </Col>
                  
                  </>)}
                    <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                      <div className="stepDetails_medium_light my-2 fw-500">
                        Email address
                      </div>
                        <InputText
                          fieldname="email"
                          className="inputField error-input"
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
                          onChange={(e: any) => {
                            handleChange(e?.target?.value);
                          }}
                        >
                          <Input
                            placeholder="Enter your email address"
                            className="stepDetails_medium fw-500"
                            disabled={disableEmail}
                            value={UserData?.email}
                          />
                        </InputText> 
              
          
                      {/* <div className="stepDetails_medium_light my-2 fw-500">
                        {UserData?.email}
                      </div> */}
             
                    {/* <div className="stepDetails_medium_light my-2 fw-500">
                      {UserData?.email}
                    </div> */}
                  </Col>
                </Row>
                      <Row className="" gutter={{ xs:25, sm: 25, md: 25, lg: 25 }}>
                        <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                          <div className="stepDetails_medium_light my-2 fw-500">
                            Country
                          </div>
                          <div className="stepDetails_medium_light fw-500">
                            {UserData?.countryName}
                          </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                          <div className="stepDetails_medium_light my-2 fw-500">
                            Country code
                          </div>
                          <div className="stepDetails_medium_light fw-500">
                            {UserData?.callingCode}
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-4" gutter={{ xs:25, sm: 25, md: 25, lg: 25 }}>
                        <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                          <div className="stepDetails_medium_light my-2 fw-500">
                            Contact number
                          </div>
                          <InputText
                            fieldname="mobile"
                            className="inputField error-input"
                            rules={[
                              {
                                validator: validateContactNumber
                              },
                            ]}
                            onChange={(e: object) => {
                              updateMobile(e);
                            }}
                           
                          >
                            <Input
                              placeholder="Enter your mobile number"
                              className="stepDetails_medium fw-500"
                              disabled={disableContact}
                              value={companyNumber ?? UserData?.contactNumber}
                              onKeyPress={(e) => {
                                checkNumberInput(e);
                                handleBlur(e);
                              }}
                              maxLength={10}
                              onBlur={handleBlur}
                            />
                          </InputText>
                        </Col>
                      </Row>
                      <Row>
                        <Button
                          key="submit"
                          type="primary"
                          htmlType="submit"
                          className="modal-button mt-5 w-auto"
                          loading={updateLoading}
                        >
                          Update Profile
                        </Button>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </Card>
              </DefaultLayout>
      <Modal
        open={Success.status}
        footer={false}
        closable={false}
        className="modal-box success"
        centered
        width={500}
        onCancel={closemodal}
      >
        <div className="text-center">
          <Image
            src={SuccessIcon}
            alt="success"
            preview={false}
            className="mt-5"
          />

          <div className="titleText mt-5 mb-3">
            Profile details updated successfully
          </div>
          <Button
            className="rounded_blue_outline btn-OK mb-4"
            onClick={() => {
              navigate(AdminProfile);
            }}
          >
            Ok
          </Button>
        </div>
      </Modal>
      <Modal
        open={otpModal}
        onOk={() => setOtpModal(false)}
        onCancel={() => setOtpModal(false)}
        footer={false}
        width={520}
        className="modal-box"
      >
        <>
        <div className="text-center">
          <AuthTitle
            className=" mt-3 mb-0"
            children="OTP verification"
          />

          <NormalText className="formSubText mt-3 text-center"
            children={<>4 digits OTP has been sent on <span className="email">{form.getFieldValue(disableEmail ? "mobile" : "email")}</span></>} />
        </div>
        <Form
          className="mx-auto justify-content-center auth-form-width"
          scrollToFirstError
          onFinish={onFinishOtp}
        >
          
          {Success.status && (
            <Alerts
              className="my-4 px-3"
              showIcon
              description={Success.message || "Success!"}
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
              disabled={otp?.length < 4}
            />
          </div>
          <SmallText
            children={"Didn't received OTP?"}
            style={{ textAlign: "center", paddingTop: "10%" }}
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
                    onClick={() => generateOTP()}
                    />
                )}
              </>
            }
            style={{ textAlign: "center" }}
          />
        </Form>
        </>
      </Modal>
    </div>
  );
};

export default EditAdminProfile;
