import "../auth/auth.scss";
import Email from "../../assets/img/Email_outline.svg";
import lock from "../../assets/img/lock.svg";
import { SmallText } from "../ui-elements/TextRepo";
import { Checkbox, Col, Form, Image, Input, Row, Select, Tooltip, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainButtonRound, ViewButton } from "../ui-elements/ButtonRepo";
import React, { useEffect, useState } from "react";
import Alerts from "../utilities/Alert";
import { InputText } from "../ui-elements/InputsRepo";
import LeftSideStructure from "./leftStructure/LeftSideStructure";
import { getGuestUser, registerUser } from "../../services/user";
import { getAllCountries } from "../../services/masterData";
import { fetchContractDetails } from "../../services/transaction";
import Success from "../../assets/img/success.svg";
import User from "../../assets/img/userHalf.svg"; 
import {
  AuthUserTypes,
  DEFAULT_COUNTRY_CODE,
  LowerCase,
  MobilNumberRegex,
  SpecialCharater,
  UpperCase,
  containNumber,
  emailRegex,
  maximum8Char,
} from "../Common/Constants";
import { Login, Termsandcondition, VerifyEmail } from "../Common/RouteConst";
import PhoneCode from "../Common/PhoneCode";
import { InfoCircleOutlined } from "@ant-design/icons";
import CountryFlag from "../Common/CountryFlag";

const { Option } = Select;

const useQuery = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const Signup = ():any => {
  const navigate = useNavigate();
  const enableAdvisor = process.env.ENABLE_ESCROW_ADVISOR === 'true';
  const [countryCodes, setCountryCodes] = useState<any>([]);
  const [callingCode, setCallingCode] = useState<any>("");
  const [isoCode, setIsoCode] = useState<any>("");
  const [error, setError] = useState({ status: false, message: "" });
  const [passwordValidation, setPasswordValidation] = useState({
    status: false,
    message: "",
  });
  // const [message, setMessage] = useState<any>("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [clicked, setClicked] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [changeError] = useState({
    message: "",
    status: false,
  });
  const [Width, setWidth] = useState(document?.body?.clientWidth)
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [utmParams, setUtmParams] = useState({});
  const [usertooltipVisible, setUserTooltipVisible] = useState(false);

  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);
  const query: any = useQuery();
  useEffect(() => {
    if (query.get("referrer") && countryCodes.length > 0) {
      if(query.size == 2){
      const referrer = query?.get("referrer").split("/")
      
        const contractAlias = referrer[1];
        const userType = referrer[2];
        fetchContractDetails(contractAlias,userType)
          .then((response: any) => {
            setUserData({
              name: response.data.name,
              email: response.data.email.toLowerCase(),
              countryAlias: response.data.countryAlias,
              contactNumber: response.data.contactNumber,
              projectId: response.data.projectId,
              transactionType: response.data.transactionType,
              userType: userType === 'advisor' ? 'ESCROW_ADVISOR' : 'USER'
            });
            form.setFieldsValue({
              name: response.data.name,
              email: response.data.email,
              countryAlias: response.data.countryAlias,
              contactNumber: response.data.contactNumber,
              projectId: response.data.projectId,
              transactionType: response.data.transactionType,
              userType: userType === 'advisor' ? 'ESCROW_ADVISOR' : 'USER'
            });
            const tmpCallingCode = countryCodes.filter(
              (item: any) => item?.isoCode === response.data.countryAlias
            );
            setCallingCode(tmpCallingCode?.[0]?.callingCode);
          })
          .catch(() => {
            message?.error(
              "Oops! Could not fetch details. Please try again later!"
            );
          });
        } else {
          const referrer = query?.get("referrer");
          console.log("referrer",referrer);
          getGuestUser(referrer).
           then((response)=>{
            console.log("response",response);
            setUserData({
              name: response.data.name,
              email: response.data.email.toLowerCase(),
              countryAlias: response.data.countryAlias,
              contactNumber: response.data.contactNumber,
              projectId: response.data.projectId,
              transactionType: response.data.transactionType,
              userType: 'USER'
            });
            form.setFieldsValue({
              name: response.data.name,
              email: response.data.email,
              countryAlias: response.data.countryAlias,
              contactNumber: response.data.contactNumber,
              projectId: response.data.projectId,
              transactionType: response.data.transactionType,
              userType: 'USER'
            });
          });
        }
    }
  }, [countryCodes]);


  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };
  const validateNumber = (e:any) => {
    const result: number = e.target.value.replace(MobilNumberRegex, "");
    form.setFieldValue("mobile", result);
  };
  const handleBlur = (e:any) => {
    let newValue = e.target.value;
    if(newValue.startsWith('0')){
        newValue = newValue.substring(1);
       }
    form.setFieldValue("contactNumber", newValue);
  };
  const openTnC = (e: any) => {
    setClicked(true);
    setVisible(e?.target?.checked);
  };
  const checkMatch = (e:any) =>{
    if(e?.target?.value == form.getFieldValue("password") ){
      setPasswordsMatch(true)
    }
    else{
      setPasswordsMatch(false)
    }
  }
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
  const userRulesTooltip = (
    <div>
      <p>User:</p>
      <ul>
      <li>
       <p className="m-0">if you're directly</p>
       <p className="m-0">buying or selling</p>
      </li>
      </ul>
      <p>Escrow Advisor:</p>
      <ul>
        <li> 
          <p className="m-0">if you're a broker</p>
          <p className="m-0">facilitating the</p>
          <p className="m-0">transaction between</p>
          <p className="m-0">both parties</p>
        </li>
      </ul>
    </div>
  );
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };
  useEffect(() => {
    getAllCountries()
      .then((response: any) => {
        setCountryCodes(response?.data);
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
  }, []);

  const handleChange = () => {
    setError({ status: false, message: "" });
  };

  const handleCountryChange = (value: number) => {
    form.setFieldsValue({
      // callingCode: countryCodes.filter((item: any) => item.isoCode === value)[0]
      //   ?.callingCode,
      countryAlias: value,
    });
    setIsoCode(value)
    setCallingCode(
      countryCodes.filter((item: any) => item.isoCode === value)[0]?.callingCode
    );
    setError({ status: false, message: "" });
  };
  const handleCUserTypeChange = (value: number) => {
    form.setFieldsValue({
      userType: value,
    });
    setError({ status: false, message: "" });
  };

  const onFinish = (values: any) => {
    const model = {...values};
    model["email"] = model.email.toLowerCase();
    model["callingCode"] = callingCode;
    
    if(values?.userType === AuthUserTypes.ESCROW_ADVISOR){
      model["userType"] = AuthUserTypes.ESCROW_ADVISOR;
    } else {
      model["userType"] = AuthUserTypes.USER;
    }
    
    console.log("values==>",values);
    console.log("model==>",model);
 
    // setEmail(model.email.toLowerCase());
    setBtnLoader(true);
    if (passwordValidation.status === true && visible === true) {
      registerUser({ clientAlias: "TRUST", ...model, ...utmParams })
        .then((response: any) => {
          setBtnLoader(false);
          if (response?.data?.statusCode === 201) {
            setRedirectToLogin(true);
            // navigate(VerifySignUp, { state: model["email"] });
            navigate(VerifyEmail, { 
              state: { 
                email: model.email, 
                autoLoginAfterVerify: true, 
                redirectUrl: undefined 
              } 
            });
          } else {
            setError({ status: true, message: response?.data?.message });
          }
        })
        .catch((error: any) => {
          setBtnLoader(false);
          setError({ status: true, message: error?.data?.message });
        });
    } else {
      setBtnLoader(false);
    }
  };

  // const contactNumberRegex = (e: any) => {
  //   const result = e.target.value.replace(MobilNumberRegex, "");
  //   form.setFieldsValue({ contactNumber: result });
  // };
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
  return (
    !redirectToLogin && (
      <Row gutter={0} className={Width < 992 ? "t-login login side-div justify-content-center overflowScroll" :'t-login login side-div justify-content-center'}>
        <Col span={12} className="vh-100 side-sec">
          <LeftSideStructure width={Width} />
        </Col>
        <Col span={Width > 991 ? 12 : 24} className={Width > 991 ? "d-table" :'mx-3'}>
          <div className="min-side-div mb-5">
            <LeftSideStructure width={Width} />
          </div>
          <div className= {enableAdvisor ? "card bg-white logincard pt-2" : "card bg-white logincard"}>
            <div className="formText mb-3 create-res-text" style={{fontSize:'28px'}}>Create an account</div>
            <div>
              <Form
                form={form}
                // className="mx-auto justify-content-center auth-form-width"
                scrollToFirstError
                initialValues={{ name: userData?.name }}
                onFinish={onFinish}
              >
                {error.status && (
                  <Alerts
                    className="mb-4 px-3"
                    showIcon
                    description={
                      error.message || "Something went wrong. Please try again!"
                    }
                    type="error"
                  />
                )}
                {changeError.status && query.get("referrer") && (
                  <Alerts
                    className="mb-4 px-3"
                    showIcon
                    description={
                      changeError.message ||
                      "Something went wrong. Please try again!"
                    }
                    type="error"
                  />
                )}
                
                <InputText
                  fieldname="email"
                  className="inputField mb-4 w-100 signup-res-inputfield"
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
                    placeholder="Email address"
                    prefix={
                      <Image src={Email} preview={false} className="pe-3" />
                    }
                    disabled={!!userData.email}
                    onChange={handleChange}
                  />
                </InputText>

                <InputText
                  className="country-selection mb-4 w-100 inputField signup-res-inputfield select-country-pl-38px"
                  fieldname="countryAlias"
                  
                  rules={[
                    {
                      required: true,
                      message: "Country is required!",
                    },
                  ]}
                >
                  <CountryFlag isoCode={isoCode}/>
                  <Select
                    placeholder="Select country"
                    onChange={handleCountryChange}
                    className="w-75 h-100 align-items-center"
                    value={userData?.countryAlias}
                    disabled={!!userData?.countryAlias}
                    showSearch
                    optionFilterProp="children"
                    allowClear
                  >
                     {countryCodes.map((item: any, index: number) => {
                      return item?.currency?.status == "active" ? (
                        <Option key={index} value={item?.isoCode}>
                          {item?.name}
                        </Option>
                      ) : null;
                    })} 
                     {/* <Option key="UAE" value="UAE" >
                      UNITED ARAB EMIRATES
                    </Option> */}
                  </Select>
                </InputText>
                {enableAdvisor && <InputText
                  className="country-selection mb-4 w-100 inputField pl-38px signup-res-inputfield"
                  fieldname="userType"
                  rules={[
                    {
                      required: true,
                      message: "User type is required!",
                    },
                  ]}
                >
                  <span className="global">
                    <Image
                      preview={false}
                      src={User}
                      alt="userType"
                      className="prefix mb-1"
                    />
                  </span>
                  <Select
                    placeholder="Select user type"
                    onChange={handleCUserTypeChange}
                    className="w-75 h-100 pt-1"
                    value={userData.userType}
                    disabled={!!userData.userType}
                    optionFilterProp="children"
                    onFocus={() => setUserTooltipVisible(true)}
                   onBlur={() => setUserTooltipVisible(false)} 
                  >
                     <Option key="USER" value="USER" >
                      User
                    </Option>
                    <Option key="ESCROW_ADVISOR" value="ESCROW_ADVISOR" >
                      Escrow Advisor
                    </Option>
                  </Select>
                  <Tooltip
                      title={userRulesTooltip}
                      visible={usertooltipVisible}
                      overlayClassName="custom-tooltip"
                    >
                      <span className="pwd_info">
                        <InfoCircleOutlined />
                      </span>
                    </Tooltip>
                </InputText>}


                  <InputText
                  fieldname="projectId"
                  className="inputField mb-4 w-100 signup-res-inputfield"
                  rules={[
                    {
                      required: true,
                      message: "ProjectID is required!",
                    }
                  ]}
                >
                  <Input placeholder="Project Id"   disabled={!!userData.projectId}/>
                </InputText>


                   <InputText
                  fieldname="transactionType"
                  className="inputField mb-4 w-100 signup-res-inputfield"
                  rules={[
                    {
                      required: true,
                      message: "Transaction Type is required!",
                    }
                  ]}
                >
                  <Input placeholder="Transaction Type"   disabled={!!userData.transactionType}/>
                </InputText>


                <Form.Item
                  name="contactNumber"
                  className="inputField w-100 signup-res-inputfield"
                  rules={[
                    {
                      validator: validateContactNumber,
                    },
                  ]}
                >
                  <Input
                    addonBefore={<PhoneCode callingCode={callingCode} />}
                    className="inputField w-100"
                    placeholder="Mobile number"
                    onKeyPress={(e) => {
                      checkNumberInput(e);
                      handleBlur(e);
                    }}
                    onChange={(e) => {
                      validateNumber(e);
                    }}
                    maxLength={10}
                    onBlur={handleBlur}
                    disabled={!!userData?.contactNumber}

                  />
                </Form.Item>

                {/* <Form.Item className="country-number mb-4 ">
                  <Input.Group compact>
                    <Input
                      name="callingCode"
                      prefix={<PhoneCode callingCode={callingCode} />}
                      disabled
                      className="w-25 p-1"
                    />
                    <Form.Item
                      noStyle
                      name="contactNumber"
                      rules={[
                        {
                          required: true,
                          message: "Mobile number is required!",
                        },
                        {
                          pattern: /[1234567890]\d{8}$/,
                          message: "Please enter a valid mobile number!",
                        },
                      ]}
                      className="mt-4"
                    >
                      <Input
                        className="w-75 h-100 ml-6 p-3"
                        placeholder="Mobile number"
                        maxLength={15}
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item> */}
                <InputText
                  fieldname="password"
                  className="inputField mb-4 w-100 signup-res-inputfield"
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
                      placeholder="Password"
                      onChange={(e) => checkValidation(e)}
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                      prefix={<Image src={lock} preview={false} className="pe-3" />}
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
                <InputText
                  fieldname="confirmPassword *"
                  className="inputField mb-1 w-100 mb-2"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    {
                      validator(_: any, value: any) {
                        const password = form.getFieldValue("password");
                        const confirm_password =
                          form.getFieldValue("confirmPassword *");
                        if (confirm_password) {
                          if (value === password) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              "The passwords does not match!"
                            );
                          }
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                   <span> <Input.Password
                    placeholder="Confirm password"
                    prefix={
                      <Image src={lock} preview={false} className="pe-3" />
                    }
                    onChange={(e:any)=>{checkMatch(e)}}
                  />
                  <span>
                    {passwordsMatch &&
                    form.getFieldValue("confirmPassword") !== "" ? (
                      <span className="pwd_info">
                        {" "}
                        <Image
                          src={Success}
                          height={16}
                          width={16}
                          preview={false}
                        />
                      </span>
                    ) : (
                      ""
                    )}
                    </span>
                    </span>
                </InputText>
                <div className="mb-3 checkbox-text">
                  <Checkbox
                    className="mt-1"
                    onChange={(e: object) => {
                      openTnC(e);
                    }}
                  >
                    <SmallText
                      className="formSubText forgetpassword agreeEscrow"
                      children={
                        <>
                          I agree to TrustIn&apos;s {" "}
                          <ViewButton
                            className="mb-0 escrowTerms"
                            children="Terms & Conditions"
                            onClick={()=>{window.open(Termsandcondition,'_blank')}}
                          />
                        </>
                      }
                      style={{ textAlign: "start" }}
                    />
                  </Checkbox>
                  {clicked && !visible ? (
                    <div className="errMsg">Please read and agree!</div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mb-0 center button-container signup-res-btn">
                  <MainButtonRound
                    children="Sign Up"
                    className="w-100 mb-2 signup-btn"
                    htmlType="submit"
                    loading={btnLoader}
                    onClick={() => {
                      setClicked(true);
                    }}
                  />
                </div>
                <div className="signup-term text-center">
                  <SmallText
                    className="user-text text-center mt-1"
                    children={
                      <>
                        Already have account?{" "}
                        <Link to={Login} className="me-1">
                          <ViewButton
                            children="Sign In "
                            className="orangeText"
                          />
                        </Link>
                      </>
                    }
                  />
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      )
  );
};

export default Signup;
