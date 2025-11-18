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
import { KYCVerificatioStep3, VerificationStep1 } from "../Common/RouteConst";
import { DEFAULT_COUNTRY_CODE, DateWithUtcOffset2, KYC_VERIFICATION_STEPS_TITLE, MobilNumberRegex, getLocalStorage, setLocalStorage } from "../Common/Constants";
import IndividualResponsiveSidebar from "./SidebarResponsiveIndividual";
import { useEffect, useState } from "react";
import { fetchKybDetails,getRiskConfiguration, getUserData } from "../../services/admin";
import { createKyb } from "../../services/user";
import { Option } from "antd/lib/mentions";
import dayjs from "dayjs";
import type { CollapseProps } from 'antd';

const Individual_Step2 = () => {
  const [selectedDate, setSelectedDate] = useState<any>({});
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [callingCode, setCallingCode] = useState("");
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [professionsList, setPropsStatusList] = useState([]);
  const [residenceStatusList, setResidenceStatusList] = useState<any[]>([]);
  const [brithPlaceList, setBrithPlaceList] = useState([]);
  const [professionTypeId, setProfessionTypeId] = useState(0)
  const [residenceStatusTypeId, setResidenceStatusTypeId] = useState(0)
  const ENTITY_TYPE = JSON.parse(getLocalStorage("auth")!)?.entityType
  const STEP = JSON.parse(getLocalStorage("auth")!)?.step;

  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 1;
    setLocalStorage('auth',JSON.stringify(localStroragevalue))
    navigate(VerificationStep1);
  }

  const onFinish = (values: any) => {
    setLoading(true);
    if (values) {
      const riskTypes: any = [];
      const riskItems:any = [];
      let birthPlace:any = "";
      if(form.getFieldValue('customerProfession')) {
          riskTypes.push(professionTypeId)
          riskItems.push(form.getFieldValue('customerProfession'))
      }

      if(form.getFieldValue('residenceStatus')) {
          riskTypes.push(residenceStatusTypeId);
          riskItems.push(form.getFieldValue('residenceStatus'))
      }

      if(form.getFieldValue('placeOfBirthId')) {
         birthPlace = brithPlaceList.find((b:any) => b.id === values?.placeOfBirthId);
      }

      const riskFrmPayload:object = {
            riskTypes,
            riskItems
    };
    const reqBody = {
      userAlias: userAlias,
      type: "basic",
      typeOfEntity: "INDIVIDUAL",
      contactNumber: values?.contactNumber,
      dob: DateWithUtcOffset2(selectedDate),
      placeOfBirth: birthPlace?.riskItem,
      placeOfBirthId: values?.placeOfBirthId,
      gender:values?.gender,
      riskAssessmentFormPayload: riskFrmPayload,
      customerProfession:values?.customerProfession,
      residenceStatus:values?.residenceStatus
    };    
      createKyb(reqBody)
      .then(res => {
        setLoading(false);
        if (res.status === 201 || res.status === 200) {
          const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
          localStroragevalue.step = 3;
          setLocalStorage('auth',JSON.stringify(localStroragevalue))
            navigate(KYCVerificatioStep3,{state:{
              contactNumber:contactNumber,
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
        setContactNumber(res?.data?.contactNumber)
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
    fetchKybDetails(userAlias)
      .then((res) => {
        if (res.data?.data?.[0]?.basic?.[0]) {
          form.setFieldsValue({
            typeOfEntity: res.data?.data?.[0]?.basic?.[0].typeOfEntity,
            dob: res.data?.data?.[0]?.basic?.[0]?.dob ? dayjs(res?.data?.data?.[0]?.basic?.[0]?.dob): "",
            gender:res.data?.data?.[0]?.basic?.[0]?.gender
          });          
          setSelectedDate(dayjs(res?.data?.data?.[0]?.basic?.[0]?.dob).format("DD-MM-YYYY"))
  
          const riskTypeRes:object = ({
            placeOfBirthId: res.data?.data?.[0]?.basic?.[0]?.placeOfBirthId,
            customerProfession: res.data?.data?.[0]?.basic?.[0]?.customerProfession,
            residenceStatus: res.data?.data?.[0]?.basic?.[0]?.residenceStatus,
            countryofIncorporation: res.data?.data?.[0]?.basic?.[0]?.countryofIncorporation,
          })
          getRiskConfigurationDetails(riskTypeRes)
        }else{
          getRiskConfigurationDetails();
        }
      })
  };
  useEffect(() => {
    if(ENTITY_TYPE !== 'individual' || STEP !== 2){
      navigate(-1)
    }
    else{
    getUserDetails();
    window.scrollTo(0, 0);
    }
  }, []);
  const handleCancel =()=>{
    form.resetFields();
  }

  const getRiskConfigurationDetails = (riskTypeRes?: any) => {
    setLoading(true);
    getRiskConfiguration({ RiskCategory: "I" })
      .then((response) => {
        if (response?.data?.status === 201 || response?.data?.status === 200) {
          if (response?.data?.result && response?.data?.result?.length) {
            const result = response?.data?.result
            const custRiskIndex = result.findIndex((d: any) => d?.riskCategory == 'Customer Risk')
            const graphicRiskIndex = result.findIndex((d: any) => d?.riskCategory == 'Geographic Risk')
            if (custRiskIndex > -1) {
              result[custRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Profession') {
                  setProfessionTypeId(r?.id);
                  setPropsStatusList(r?.riskItems || [])
                }
                if (r?.riskType == 'Residence Status') {
                  setResidenceStatusTypeId(r?.id);
                  setResidenceStatusList(r?.riskItems || [])
                }
              })
            }

            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Nationality') {
                  setBrithPlaceList(r?.riskItems || [])
                }
              })
            }
          }
          setLoading(false);
          return riskTypeRes;
        }
      }).then((riskTypeRes: any) => {
        form.setFieldsValue({
          placeOfBirthId: riskTypeRes?.placeOfBirthId,
          customerProfession: riskTypeRes?.customerProfession,
          residenceStatus: riskTypeRes?.residenceStatus
        });
      }).catch((error) => {
        setLoading(false);
        message.error(error?.error?.message ? error?.error?.message : "Something went wrong")
      });
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <span className="step1 activeBtn">
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.BASIC_INFORMATION}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '2',
      label: (
        <span>
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.ADDRESS_DETAILS}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '3',
      label: (
        <span>
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '4',
      label: (
        <span className="step1">
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.FATCA_SELF_CERTIFICATION_FORM}</div>
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
    {ENTITY_TYPE === 'individual' && STEP === 2 ? 
    <div>
      <UserHeader step={20} />
      <div className="text-right formSubText p-5">Step 2/5</div>

      {/* tabs for responsive */}
      <IndividualResponsiveSidebar step={2} />
      <div className="d-flex center_res">
        <div className="px-5 verification_sidebar">
          <div className="slidebar-step-3-block">
            <Collapse items={items} bordered={false} />
          </div>
        </div>
        <div className="px-5 px-5-res kyc-responsive">
          <div className="d-flex step-title">
            <Image
              src={LeftArrow}
              alt="arrow"
              className="cursor"
              preview={false}
              onClick={() => {
                goBack()
              }}
            />
            <div className="titleText px-5">Basic information</div>
          </div>
          <Form form={form} scrollToFirstError onFinish={onFinish} className="basic-info-form-block">
            <Row>
              <div className="pr-25 w-100-res input-form-field">
                <div className="subText_small ">Email address</div>
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
                <div className="subText_small ">Country</div>
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
                <div className="subText_small ">Mobile number <span className="red">*</span></div>
                <Form.Item
                  name="contactNumber"
                  className="inputField"
                  rules={[
                    {
                      validator: validateContactNumber
                    },
                  ]}
                >
                  <Input
                    addonBefore={<PhoneCode callingCode={callingCode} />}
                    className="inputField"
                    placeholder="Mobile number"
                    onChange={(e) => {
                      contactNumberRegex(e);
                    }}
                    maxLength={10}
                    onBlur={handleBlur}
                    onKeyPress={(e) => {
                      checkNumberInput(e);
                      handleBlur(e);
                    }}
                  />
                </Form.Item>
              </div>
              <div className=" w-100-res input-form-field">
                <div className="subText_small">Date of birth <span className="red">*</span></div>
                <Form.Item
                  name="dob"
                  className="inputField "
                  rules={[
                    {
                      required: true,
                      message: "DOB is required!",
                    },
                  ]}
                >
                <DatePicker
                onChange={handleDateChange}
                format={{
                  format: 'DD-MM-YYYY',
                  type: 'mask',
                }}
                placeholder="Select date of birth"
                className="dob_step"
                disabledDate={(current:any) => {
                  return current > dayjs().subtract(18, 'years').endOf('day');                  
                }}                
              />
                </Form.Item>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small ">Gender <span className="red">*</span></div>
                <Form.Item
                  className="mb-4"
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: "Select gender!",
                    },
                  ]}
                >
                  <Select
                    className="w-100"
                    placeholder="Select gender"
                    allowClear
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                  </Select>
                </Form.Item>
             
              </div>
              <div className=" w-100-res">
                <div className="subText_small ">Profession <span className="red">*</span></div>
                <InputText
                  fieldname="customerProfession"
                  rules={[
                    { required: true, message: "Profession is required!" },
                  ]}
                  className="mb-4"
                >
                  <Select
                    allowClear
                    placeholder={"Select profession"}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {professionsList?.length > 0 && professionsList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.id} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small ">UAE Residence Status <span className="red">*</span></div>
                <InputText
                  fieldname="residenceStatus"
                  rules={[
                    { required: true, message: "Resident status is required!" },
                  ]}
                  className="mb-4"
                >
                  <Select
                    allowClear
                    placeholder={"Select resident status"}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {residenceStatusList?.length > 0 && residenceStatusList
                    ?.map((value: any, index: any) => {
                      let label = ''
                      if (value.riskItem == "Resident") {
                        label = "UAE Residents"
                      } else {
                        label = "UAE Non-Residents"
                      }
                      return (
                        <Option key={index} value={value.id} >{label}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </div>
              <div className=" w-100-res">
                <div className="subText_small ">Place of birth <span className="red">*</span></div>
                <InputText
                  fieldname="placeOfBirthId"
                  rules={[
                    { required: true, message: "Birth place is required!" },
                  ]}
                  className="mb-4"
                >
                  <Select
                  allowClear
                    placeholder="Select birth place"
                    showSearch
                    optionFilterProp="children"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {brithPlaceList?.length > 0 && brithPlaceList?.map((value: any, index: any) => {
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
    </div>
    :""}
    </div>
  );
};

export default Individual_Step2;
