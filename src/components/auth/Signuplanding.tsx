import "../auth/auth.scss";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Country from "../../assets/img/Country.svg";
import Email from "../../assets/img/Email_outline.svg";
import lock from "../../assets/img/lock.svg";
import { SmallText } from "../ui-elements/TextRepo";
import { Checkbox, Form, Image, Input, Select, Tooltip, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainButtonRound, ViewButton } from "../ui-elements/ButtonRepo";
import React, { useEffect, useState } from "react";
import Alerts from "../utilities/Alert";
import { InputText } from "../ui-elements/InputsRepo";
import { registerUser } from "../../services/user";
import { getAllCountries } from "../../services/masterData";
import { fetchContractDetails } from "../../services/transaction";
import Success from "../../assets/img/success.svg";
import User from "../../assets/img/userHalf.svg"; 
import logo from "../../assets/img/Logo.svg"
import signupLandingImage from "../../assets/img/handshake.png"
import {
  DEFAULT_COUNTRY_CODE,
  LowerCase,
  MobilNumberRegex,
  SpecialCharater,
  UpperCase,
  containNumber,
  emailRegex,
  maximum8Char,
} from "../Common/Constants";
import { Termsandcondition, VerifyEmail, LoginLanding } from "../Common/RouteConst";
import PhoneCode from "../Common/PhoneCode";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Option } = Select;



const useQuery = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const Signuplanding = ():any => {
  const navigate = useNavigate();
  // const enableAdvisor = process.env.ENABLE_ESCROW_ADVISOR === 'true';
  const [countryCodes, setCountryCodes] = useState<any>([]);
  const [callingCode, setCallingCode] = useState<any>("");
  const [error, setError] = useState({ status: false, message: "" });
  // const [phone, setPhone] = useState<string>('');
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
  // const [Width, setWidth] = useState(document?.body?.clientWidth)
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [utmParams, setUtmParams] = useState({});

  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const optionsList = [
    { value: 'Automobile Escrow', label: 'Automobile Escrow' },
    { value: 'Real Estate Escrow', label: 'Real Estate Escrow' },
    { value: 'Broker Escrow', label: 'Broker Escrow' },
    { value: 'Good & Services', label: 'Good & Services' },
    { value: 'Mergers and Acquisitions Escrow', label: 'Mergers and Acquisitions Escrow' },
    { value: 'Venture Capital Funding Escrow', label: 'Venture Capital Funding Escrow' },
    { value: 'E-Commerce Escrow', label: 'E-Commerce Escrow' },
    { value: 'API Integration', label: 'API Integration' },
    { value: 'Checkout Solutions', label: 'Checkout Solutions' },
    { value: 'Others', label: 'Others' },
];

  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    email: '',
    message: '',
    usecase: '',
    countryCode: '',  
    contactno: '', 
    country_code: '',
    countryName: '',
});

const [showSuccess, setShowSuccess] = useState(false);
const [errors, setErrors] = useState({
    name: '',
    email:'',
    phonenumber: '',
    usecase: '',
});

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: '', email:'', phonenumber: '', usecase: '' };
    if (!formData.name) newErrors.name = 'Name is required!';
    if (!formData.email) newErrors.email = 'Email is required!';
    if (!formData.phonenumber) newErrors.phonenumber = 'Phone number is required!';
    if (!formData.usecase) newErrors.usecase = 'Use Case is required!';

    if (newErrors.name || newErrors.email || newErrors.phonenumber || newErrors.usecase) {
        setErrors(newErrors);
        return; 
    }
    setShowSuccess(true);
    const formBody = new FormData();
    for (const key in formData) {
        formBody.append(key, formData[key as keyof typeof formData]);
    }
    fetch("https://script.google.com/macros/s/AKfycbwpkxoOVXl-WevoxGaPkj8fvitxYUnWTsE15A9V7_mOpUqZI5xfGnVTxGNoKeYcM9N1/exec", {
        method: "POST",
        body: formBody,
    })
    .then((response) => response.json())
    .then(() => {
        setFormData({
            name: '',
            phonenumber: '',
            email: '',
            message: '',
            usecase: '',
            countryCode: '',  
            contactno: '', 
            country_code: '',
            countryName: '',
        });
        setTimeout(() => {
            setShowSuccess(false);
        }, 300);
    })
    .catch(() => {
    });
};

const handleChanges = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
    }));

    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};
const handlePhoneChange = (value: string, data: any) => {
    const phoneWithoutCode = value.replace(data.dialCode, '').trim(); 
    setFormData((prevData) => ({
        ...prevData,
        phonenumber: phoneWithoutCode, 
        countryCode: data.dialCode, 
        countryName: data.countryCode,
    }));
    if (phoneWithoutCode) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            phonenumber: '',
        }));
    }
    if (formData.name === "contactno") {
        setFormData((prevData) => ({
            ...prevData,
            contactno: phoneWithoutCode, 
            country_code: data.dialCode, 
        }));
    }
};
const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
        ...prevData,
        usecase: value, 
    }));
    setErrors((prevErrors) => ({
        ...prevErrors,
        usecase: '',
    }));
};

  

  // const setWidthVal = () =>{
  //   setWidth(document.body.clientWidth);
  // }
  // useEffect(() => {
  //   window.addEventListener("resize", () => {
  //     setWidthVal();
  //   });
  //   return () => window.removeEventListener("resize", setWidthVal);
  // }, []);

  const query: any = useQuery();
  useEffect(() => {
    if (query.get("referrer")) {
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
            userType: userType === 'advisor' ? 'ESCROW_ADVISOR' : 'USER'
          });
          form.setFieldsValue({
            name: response.data.name,
            email: response.data.email,
            countryAlias: response.data.countryAlias,
            contactNumber: response.data.contactNumber,
            userType: userType === 'advisor' ? 'ESCROW_ADVISOR' : 'USER'
          });
          const tmpCallingCode = countryCodes.filter(
            (item: any) => item?.isoCode === response.data.countryAlias
          );
          setCallingCode(tmpCallingCode);
        })
        .catch(() => {
          message?.error(
            "Oops! Could not fetch details. Please try again later!"
          );
        });
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
    if (
      (upperCase.test(password) === true &&
        lowerCase.test(password) === true &&
        specialChar.test(password) === true &&
        eightChar.test(password) === true &&
        numeric.test(password) === true) ||
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
        <li>A special character</li>
        <li>A numeric value</li>
        <li>8 characters</li>
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
    setCallingCode(
      countryCodes.filter((item: any) => item.isoCode === value)[0]?.callingCode
    );
    setError({ status: false, message: "" });
  };
  // const handleCUserTypeChange = (value: number) => {
  //   form.setFieldsValue({
  //     userType: value,
  //   });
  //   setError({ status: false, message: "" });
  // };

  const onFinish = (values: any) => {
    values["email"] = values.email.toLowerCase();
    values["callingCode"] = callingCode;
    values["userType"] = values?.userType ?? "USER";
    // setEmail(values.email.toLowerCase());
    setBtnLoader(true);
    if (passwordValidation.status === true && visible === true) {
      registerUser({ clientAlias: "TRUST", ...values, ...utmParams })
        .then((response: any) => {
          setBtnLoader(false);
          if (response?.data?.statusCode === 201) {
            setRedirectToLogin(true);
            // navigate(VerifySignUp, { state: values["email"] });
            navigate(VerifyEmail, { state: values["email"] });
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

  const getLoginUrl=()=>{
    const utmQuery = new URLSearchParams(utmParams).toString();
    const loginUrl = `${LoginLanding}&${utmQuery}`;
    return loginUrl;
  }
  // const utmQuery = new URLSearchParams(utmParams).toString();
  // const loginUrl = `${LoginLanding}?${utmQuery}`;


  return (
    !redirectToLogin && (
      <div>
      <div>
         <nav className="navbar bg-light">
            <div className="container">
               <a className="navbar-brand p-0 m-0" href="#">
               <img src={logo} alt="Logo" className="d-inline-block align-text-top" style={{width:'152px',height:'auto',objectFit:'contain'}}/>
               </a>
            </div>
         </nav>
         <div className="signup-banner" style={{paddingTop:'60px',paddingBottom:'60px'}}>
            <div className="container">
               <div className="row signuplanding-section">
                  <div className="col-xl-8 col-lg-7 col-md-12">
                     <div className="landingpage-leftdiv mb-4 signup-res-leftidv">
                        <b>
                           <div className="sidebarText mb-4">Powering Safe and Transparent Transactions with TrustIn</div>
                        </b>
                        <p className="text-white signup-description m-0">TrustIn is the UAE&apos;s first digital escrow platform, designed for
                          businesses and individuals. It ensures trust and transparency,
                          backed by regulations and a leading UAE bank for peace of
                          mind. Whether for real estate or business deals, TrustIn
                          provides a seamless experience.
                        </p>
                        <div className="signup-landing-img mb-0 mt-4">
                        <img src={signupLandingImage} alt="signup_landing_img" className="signuplanding-img"/>
                        </div>
                     </div>
                     <div className="landingpage-leftdiv mb-4 mt-0 mt-md-2">
                        <b>
                           <div className="sidebarText mb-4">Secure Your Transactions, Every Step of the Way with TrustIn</div>
                        </b>
                        <p className="text-white signup-description">TrustIn offers a secure, transparent escrow solution for high-stakes transactions, from property sales to business acquisitions.
                        </p>
                     </div>
                     <div className="card mt-3 landingpage-smallcard" style={{ padding: '15px 20px 5px 20px',borderRadius:'24px' }}>
                     <div>
                      {showSuccess && (
                          <div className="alert alert-success d-flex justify-content-start align-items-center" role="alert">
                              <p className="p-0 m-0">Thank you! Your message has been sent successfully.</p>
                          </div>
                      )}
                      <form className="row g-3" onSubmit={handleSubmit} name="contactForm">
                      <div className="col-md-6">
                              <input 
                                  type="text" 
                                  className={`form-control ${errors.name ? 'error-border' : ''}`} 
                                  id="firstName" 
                                  placeholder="yourname" 
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChanges}
                              />
                              {errors.name && <span className="error-text">{errors.name}</span>}
                          </div>

                          <div className="col-md-6">
                              <input 
                                  type="email" 
                                  className={`form-control ${errors.email ? 'error-border' : ''}`} 
                                  id="firstName" 
                                  placeholder="yourname@mail.com" 
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChanges}
                              />
                              {errors.email && <span className="error-text">{errors.email}</span>}
                          </div>
                          <div className="col-md-6">
                              <PhoneInput
                                  country={'ae'}
                                  value={formData.countryCode + formData.phonenumber}
                                  onChange={handlePhoneChange} 
                                  enableSearch
                                  countryCodeEditable={false}
                                  containerStyle={{ width: '100%' }}
                                  inputStyle={{ width: '100%', border: errors.phonenumber ? '1px solid red' : undefined }}
                                  placeholder={"Phone Number"}  
                                  inputProps={{
                                      autoFocus: false
                                  }}
                              />
                              {errors.phonenumber && <span className="error-text">{errors.phonenumber}</span>}
                          </div>
                          <div className="col-md-6 mb-2">
                              <Select
                                  className={`${errors.usecase ? 'error-border user-selectbox' : 'user-selectbox'}`} 
                                  style={{ width: "100%" ,background:'transparent',border:'1px solid #CACACA',borderRadius:'5px'}}
                                  showSearch
                                  placeholder="Use Case" 
                                  optionFilterProp="label"
                                  value={formData.usecase || undefined} 
                                  onChange={handleSelectChange}
                                  options={optionsList.map(option => ({ value: option.value, label: option.label }))}
                              />
                              {errors.usecase && <span className="error-text">{errors.usecase}</span>}
                          </div>
                          <div className="col-12">
                              <button type="submit" className="w-100 mb-2 export-button">Talk to our Escrow Expert</button>
                          </div>
                      </form>
                  </div>
                  </div>
               </div>
               <div className="col-xl-4 col-lg-5 col-md-12">
                  <div className="card mx-auto" style={{ padding: '30px 36px 0px 30px',borderRadius:'24px' }}>
                  <div className="formText mb-3" style={{fontSize:'28px'}}>Create account</div>
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
                     fieldname="name"
                     className="inputField mb-4 w-100"
                     rules={[
                     {
                     required: true,
                     message: "Name is required!",
                     },
                     {
                     // pattern: emailRegex,
                     message: "Enter valid name!",
                     },
                     ]}
                     >
                     <Input
                     placeholder="Full name (as per document)"
                     prefix={
                     <Image src={User} preview={false} className="pe-3" />
                     }
                     disabled={!!userData.name}
                     // onChange={handleChange}
                     />
                     </InputText>
                     <InputText
                     fieldname="email"
                     className="inputField mb-4 w-100"
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
                        className="country-selection mb-4 w-100 inputField signup-res-inputfield"
                        fieldname="countryAlias"
                        
                        rules={[
                          {
                            required: true,
                            message: "Country is required!",
                          },
                        ]}
                      >
                          <span className="global">
                            <Image
                              preview={false}
                              src={Country}
                              alt="country"
                              className="prefix"
                            />
                          </span>
                          <Select
                            placeholder="Select country"
                            onChange={handleCountryChange}
                            className="w-75 h-100"
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
                     {/* {enableAdvisor && <InputText
                     className="country-selection mb-4 w-100"
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
                           className="prefix"
                           />
                     </span>
                     <Select
                        placeholder="Select user type"
                        onChange={handleCUserTypeChange}
                        className="w-100 h-100 pt-1"
                        value={userData.userType}
                        disabled={!!userData.userType}
                        optionFilterProp="children"
                        >
                        <Option key="USER" value="USER" >
                           User
                        </Option>
                        <Option key="ESCROW_ADVISOR" value="ESCROW_ADVISOR" >
                           Escrow Advisor
                        </Option>
                     </Select>
                     </InputText>} */}
                     <Form.Item
                     name="contactNumber"
                     className="inputField w-100"
                     rules={[
                     {
                     validator: validateContactNumber,
                     },
                     ]}
                     >
                     <Input
                     addonBefore={
                     <PhoneCode callingCode={callingCode} />
                     }
                     className="inputField"
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
                     />
                     </Form.Item>
                     {/* 
                     <Form.Item className="country-number mb-4 ">
                        <Input.Group compact>
                           <Input
                           name="callingCode"
                           prefix={
                           <PhoneCode callingCode={callingCode} />
                           }
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
                     className="inputField mb-4 w-100"
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
                           onChange={(e) =>
                        checkValidation(e)}
                        onFocus={handlePasswordFocus}
                        onBlur={handlePasswordBlur}
                        prefix={
                        <Image src={lock} preview={false} className="pe-3" />
                        }
                        />
                        <Tooltip
                        title={passwordRulesTooltip}
                        visible={!passwordValidation.status && isPasswordFocused}
                        overlayClassName="custom-tooltip"
                        >
                        <span className="pwd_info me-2">
                           <InfoCircleOutlined />
                        </span>
                        </Tooltip>
                     </span>
                     </InputText>
                     <InputText
                     fieldname="confirmPassword *"
                     className="inputField mb-1 w-100"
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
                     <span>
                        <Input.Password
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
                     <div className="mb-3">
                        <Checkbox
                           className="mt-1"
                           onChange={(e: object) =>
                           {
                           openTnC(e);
                           }}
                           >
                           <SmallText
                           className="formSubText forgetpassword agreeEscrow"
                           children={
                           <>
                           I agree to your {" "}
                           <ViewButton
                              className="mb-0 escrowTerms"
                              children="Terms & Conditions"
                              onClick={()=>
                           {window.open(Termsandcondition,'_blank')}}
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
                     <div className="mb-0 w-100 d-block">
                        <MainButtonRound
                           children="Sign Up"
                           className="w-100 mb-2 signup-btn signgup-res-btn full-width"
                           htmlType="submit"
                           loading={btnLoader}
                           onClick={() =>
                        {
                        setClicked(true);
                        }}
                        />
                     </div>
                     <div className="signup-term text-center">
                        <SmallText
                        className="user-text text-start mt-3"
                        style={{fontSize:'16px',fontWeight:'400',color:'#232323'}}
                        children={
                        <>
                        Already have account?{" "}
                        <Link  to={getLoginUrl()} className="me-1">
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
            </div>
         </div>
      </div>
   </div>
   </div>
   </div>
      )
  );
};

export default Signuplanding;
