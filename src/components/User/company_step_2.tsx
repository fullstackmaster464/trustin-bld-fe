import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Row,
  Select,
  message,
  Collapse,
  Spin
} from "antd";
import UserHeader from "./UserHeader";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import { InputText } from "../ui-elements/InputsRepo";
import PhoneCode from "../Common/PhoneCode";
import { useNavigate } from "react-router-dom";
import { KYBVerificatioStep3, VerificationStep1 } from "../Common/RouteConst";
import { KYB_VERIFICATION_STEPS_TITLE, MobilNumberRegex, getLocalStorage, setLocalStorage, DateWithUtcOffset, USER_TYPE_TEXT, DEFAULT_COUNTRY_CODE } from "../Common/Constants";
import { useEffect, useState } from "react";
import { fetchKybDetails, getRiskConfiguration, getUserData } from "../../services/admin";
import { createKyb } from "../../services/user";
import ResponsiveSidebar from "./SidebarResponsiveCompany";
import dayjs from "dayjs";
import { Option } from "antd/lib/mentions";
import type { CollapseProps } from 'antd';

const CompanyStep2 = () => {
  const [selectedDate, setSelectedDate] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [callingCode, setCallingCode] = useState("");
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [professionsList, setPropsStatusList] = useState([]);
  const [residenceStatusList, setResidenceStatusList] = useState([]);
  const [professionTypeId, setProfessionTypeId] = useState(0)
  const [residenceStatusTypeId, setResidenceStatusTypeId] = useState(0)
  const [countryofIncorporationTypeId, setCountryofIncorporationTypeId] = useState(0)
  const [countryofIncorporationTypeList, setCountryofIncorporationTypeList] = useState([]);
  const ENTITY_TYPE = JSON.parse(getLocalStorage("auth")!)?.entityType
  const STEP = JSON.parse(getLocalStorage("auth")!)?.step;
  const userType = local? JSON.parse(local)?.userType : "";

  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 1;
    setLocalStorage('auth',JSON.stringify(localStroragevalue))
    navigate(VerificationStep1);
  }

  const onFinish = (values: any) => {
    setLoading(true)
    if (values) {
      const riskTypes = [];
      const riskItems = [];

      if (form.getFieldValue('customerProfession')) {
        riskTypes.push(professionTypeId)
        riskItems.push(form.getFieldValue('customerProfession'))
      }

      if (form.getFieldValue('residenceStatus')) {
        riskTypes.push(residenceStatusTypeId);
        riskItems.push(form.getFieldValue('residenceStatus'))
      }

      if (form.getFieldValue('countryofIncorporation')) {
        riskTypes.push(countryofIncorporationTypeId)
        riskItems.push(form.getFieldValue('countryofIncorporation'))
      }

      const riskFrmPayload: object = {
        riskTypes,
        riskItems
      };
      const reqBody = {
        userAlias: userAlias,
        type: "basic",
        typeOfEntity: "COMPANY",
        contactNumber: values?.contactNumber,
        dob: DateWithUtcOffset(selectedDate),
        riskAssessmentFormPayload: riskFrmPayload,
        customerProfession:values?.customerProfession,
        residenceStatus:values?.residenceStatus,
        countryofIncorporation:values?.countryofIncorporation
      };
      
      createKyb(reqBody)
      .then(res => {
        setLoading(false);
        if (res.status === 201 || res.status === 200) {
          const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
          localStroragevalue.step = 3;
          setLocalStorage('auth',JSON.stringify(localStroragevalue))
            navigate(KYBVerificatioStep3,{state:{
              contactNumber:values?.contactNumber,
              country:country,
              callingCode:callingCode
            }});
          }
      })
      .catch(() => {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later!");
      });
    }
  };
  const contactNumberRegex = (e: any) => {
    const result: number = e.target.value.replace(MobilNumberRegex, "");
    form.setFieldsValue({ contactNumber: result });
  };

  const handleDateChange = (_date: any,dateString:string | string[]) => { 
      setSelectedDate(dateString);
  }

  const getUserDetails = () => {
    getUserData(email)
      .then((res) => {
        // setUserDetails(res?.data);
        setCountry(res?.data?.countryAlias);
        setCallingCode(res?.data?.callingCode);
        form.setFieldValue("contactNumber", res?.data?.contactNumber);
        // setContactNumber(res?.data?.contactNumber)
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
    fetchKybDetails(userAlias)
      .then((res) => {
        if (res.data?.data?.[0]?.basic?.[0]) {
          form.setFieldsValue({
            typeOfEntity: res.data?.data?.[0]?.basic?.[0].typeOfEntity,
            dob: res.data?.data?.[0]?.basic?.[0]?.dob ? dayjs(res.data?.data?.[0]?.basic?.[0]?.dob): "",
          });
          setSelectedDate(dayjs(res.data?.data?.[0]?.basic?.[0]?.dob).format("DD-MM-YYYY"))
          const riskTypeRes:object = ({
            customerProfession: res.data?.data?.[0]?.basic?.[0]?.customerProfession,
            residenceStatus: res.data?.data?.[0]?.basic?.[0]?.residenceStatus,
            countryofIncorporation: res.data?.data?.[0]?.basic?.[0]?.countryofIncorporation,
          })
          getRiskConfigurationDetails(riskTypeRes)
        }else{
          getRiskConfigurationDetails();
        }
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
  };
  const handleCancel =()=>{
    form.resetFields();
  }
  useEffect(() => {
    if(ENTITY_TYPE !== 'company' || STEP !== 2){
      navigate(-1)
    }
    else{
    getUserDetails();
    window.scrollTo(0, 0);
    }
  }, []);
  const getRiskConfigurationDetails = (riskTypeRes?: any) => {
    setLoading(true);
    getRiskConfiguration({ RiskCategory: "C" })
      .then((response) => {
        if (response?.data?.status === 201 || response?.data?.status === 200) {
          if (response?.data?.result && response?.data?.result?.length) {
            const result = response?.data?.result
            const custRiskIndex = result.findIndex((d: any) => d?.riskCategory == 'Customer Risk')
            const graphicRiskIndex = result.findIndex((d: any) => d?.riskCategory == 'Geographic Risk')
            if (custRiskIndex > -1) {
              result[custRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Legal Status of the Entity') {
                  setProfessionTypeId(r?.id);
                  setPropsStatusList(r?.riskItems || [])
                }
                if (r?.riskType == 'Nature of Business') {
                  setResidenceStatusTypeId(r?.id);
                  setResidenceStatusList(r?.riskItems || [])
                }
              })
            }

            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Country of Incorporation') {
                  setCountryofIncorporationTypeId(r?.id)
                  setCountryofIncorporationTypeList(r?.riskItems || [])
                }
              })
            }
          }else{
            throw (response?.data?.response?.error)
          }
          setLoading(false);
          return riskTypeRes;
        }
      }).then((riskTypeRes: any) => {
        form.setFieldsValue({
          customerProfession: riskTypeRes?.customerProfession,
          residenceStatus: riskTypeRes?.residenceStatus,
          countryofIncorporation: riskTypeRes?.countryofIncorporation,
        });
      }).catch((error) => {
        setLoading(false);
        message.error( error?.message ? error?.message:error?.error?.message ? error?.error?.message : "Something went wrong")
      });
  }

  
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <span className="step1 activeBtn">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BASIC_INFORMATION}</div>
        </span>
      ),
      showArrow:false
    },
    {
      key: '2',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REPRESENTATIVE_OWNERS}</div>
        </span>
      ),
      showArrow:false
    },
    {
      key: '3',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BENEFICIAL_OWNERS}</div>
        </span>
      ),
      showArrow:false
    },
    {
      key: '4',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BUSINESS_DETAILS}</div>
        </span>
      ),
      showArrow:false
    },
    {
      key: '5',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div>
        </span>
      ),
      showArrow:false
    },
    {
      key: '6',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.FATCA_SELF_CERTIFICATION_FORM}</div>
        </span>
      ),
      showArrow:false
    },
  ];
  const handleBlur = (e:any) => {
    let newValue = e.target.value;
    if(newValue.startsWith('0')){
        newValue = newValue.substring(1);
       }
    form.setFieldValue("contactNumber", newValue);
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

  return (
    <div>
      {loading && (
        <div
          className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
        >
          <Spin size="large" className="mainloader"/>
        </div>
      )} 
      {ENTITY_TYPE === 'company' && STEP === 2 ? 
      <div>
      <UserHeader step={15} />
      <div className="text-right formSubText p-5">Step 2/7</div>
      <ResponsiveSidebar step={2} />
      <div className="d-flex center_res">
        <div className="px-5 verification_sidebar">
          <div className="">
            <Collapse items={items} bordered={false} />
          </div>
        </div>
        <div className="px-5 px-5-res info-form-block kyb-responsive">
          <div className="d-flex">
          { userType !== USER_TYPE_TEXT.ESCROW_ADVISOR  && (
            <Image
              src={LeftArrow}
              alt="arrow"
              preview={false}
              className="cursor"
              onClick={() => {
                goBack()
              }}
            />
          )}
            <div className={`titleText ${userType !== USER_TYPE_TEXT.ESCROW_ADVISOR ? "px-5" : ""} `}>Basic information</div>
          </div>
          <Form form={form} scrollToFirstError onFinish={onFinish} className="basic-info-form-block"
          >
            <Row>
              <div className="pr-25 w-100-res input-form-field">
                <div className="subText_small">Email address</div>
                <InputText className="inputField">
                  <Input
                    placeholder={email}
                    disabled
                    prefix={
                      <span className="inputGlobe">
                        <Image src={Mail} className="me-3" preview={false} />
                      </span>
                    }
                  />
                </InputText>
              </div>
              <div className=" w-100-res input-form-field">
                <div className="subText_small">Country</div>
                <InputText className="inputField">
                  <Input
                    placeholder={country}
                    disabled
                    prefix={
                      <span className="inputGlobe">
                       {country ? <span className={`fi fi-${country.toLowerCase()} `} /> 
                        : <Image src={Country} className="me-3" preview={false} /> }
                      </span>
                    }
                  />
                </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res input-form-field">
                <div className="subText_small">Mobile number <span className="red">*</span></div>
                <Form.Item
                  name="contactNumber"
                  className="inputField"
                  rules={[
                    {
                      validator: validateContactNumber,
                    },
                  ]}
                >
                  <Input
                    addonBefore={<PhoneCode callingCode={callingCode} />}
                    className="inputField"
                    placeholder="Mobile number"
                    maxLength={10}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      contactNumberRegex(e);
                    }}
                    onKeyPress={(e) => {
                      checkNumberInput(e);
                      handleBlur(e);
                    }}
                  />
                </Form.Item>
              </div>
              <div className=" w-100-res input-form-field">
                <div className="subText_small ">Establishment date <span className="red">*</span></div>
                <Form.Item
                  name="dob"
                  className="inputField"
                  rules={[
                    {
                      required: true,
                      message: "Establishment date is required!",
                    },
                  ]}
                >
                  <DatePicker
                  format={{
                    format: 'DD-MM-YYYY',
                    type: 'mask',
                  }}
                placeholder="Select establishment date"
                className="dob_step"
                onChange={handleDateChange}
                disabledDate={(current:any)=>{
                  return current && current.valueOf() > Date.now()
                }}              
              />
                </Form.Item>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res input-form-field">
                <div className="subText_small">Business type <span className="red">*</span></div>
                <InputText
                  fieldname="customerProfession"
                  rules={[
                    { required: true, message: "Business type is required!" },
                  ]}
                  className="mb-4"
                >
                  <Select
                    allowClear
                    placeholder={"Select business type"}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    showSearch
                    optionFilterProp="children"
                  >
                    {professionsList?.length > 0 && professionsList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.id} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </div>
              <div className=" w-100-res input-form-field">
                <div className="subText_small">Business domain <span className="red">*</span></div>
                <InputText
                  fieldname="residenceStatus"
                  rules={[
                    { required: true, message: "Business domain is required!" },
                  ]}
                  className="mb-4"
                >
                  <Select
                    allowClear
                    placeholder={"Business domain status"}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    showSearch
                    optionFilterProp="children"
                  >
                    {residenceStatusList?.length > 0 && residenceStatusList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.id} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </div>
            </Row>
            <Row>
              <div className=" w-100-res input-form-field">
                <div className="subText_small">Country of incorporation <span className="red">*</span></div>
                <InputText
                  fieldname="countryofIncorporation"
                  rules={[
                    { required: true, message: "Country of incorporation is required!" },
                  ]}
                  className="mb-4"
                >
                  <Select
                    placeholder="Select country of incorporation"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {countryofIncorporationTypeList?.length > 0 && countryofIncorporationTypeList?.map((value: any, index: any) => {
                        return (
                          <Option key={index} value={value.id} >{value.riskItem}</Option>
                        )
                    })}
                  </Select>
                </InputText>
              </div>
            </Row>
            <Row className="center_res">
              <div className="d-flex step-control-btn">
                <Button className="rounded" htmlType="submit" loading={loading}>
                  Save & Next
                </Button>
                <Button className="rounded_cancel mx-4" onClick={handleCancel}>Reset</Button>
              </div>
            </Row>
          </Form>

        </div>
      </div>
    </div>: ""}
    </div>
  );
};

export default CompanyStep2;
