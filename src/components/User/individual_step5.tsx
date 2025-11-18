import { Button, Form, Image, Input, Row, Select, message, Collapse, Col, Typography, Radio, Checkbox, Spin } from "antd";
import UserHeader from "./UserHeader";
import { useEffect, useState } from "react";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import { InputText } from "../ui-elements/InputsRepo";
import Info from "../../assets/img/info.svg";
import BlueTick from "../../assets/img/blue_tick.svg";
import { getAllCountries } from "../../services/masterData";
import { useLocation, useNavigate } from "react-router-dom";
import { KYCVerificatioStep4, VerificationCompleted } from "../Common/RouteConst";
import { KYC_VERIFICATION_STEPS_TITLE, getLocalStorage, setLocalStorage } from "../Common/Constants";
import IndividualResponsiveSidebar from "./SidebarResponsiveIndividual";
import { fetchKybDetails } from "../../services/admin";
import type { CollapseProps } from 'antd';
import { BoldText, SmallText } from "../ui-elements/TextRepo";
import { updateFinal } from "../../services/user";
import address from "../../assets/img/location_gray.svg";
import City from "../../assets/img/building.svg";
import POBOX from "../../assets/img/chat.svg";
import User from "../../assets/img/user.svg";
import Documentdark from "../../assets/img/documentdark.svg";
import { ViewButton } from "../ui-elements/ButtonRepo";


interface BasicDetails {
  name?: string,
  email?: string,
  callingCode?: string,
  contactNumber?: string,
  dob?: any,
  country?: string,
  typeOfEntity?: string,
  dateOfCorporation?: any,
  profession?: string,
  placeOfBirth?: string,
  placeOfBirthId?: string,
  gender?: string,
  customerProfession?: number,
  residenceStatus?: number,
  countryofIncorporation?: number
}

interface FATCACRSFormDetails {
  kycTaxResident: string,
  kycTaxResidencyCountry?: string,
  hasKycTIN?: string,
  kycTinNo?: string,
  hasMultipleTaxResidentKyc?: string,
  isAgreeKYCFATCA: boolean,
  kycNumberOfCountry:any,
  [key: string]: string | boolean | any;
}

const IndividualStep5 = ():any => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const ENTITY_TYPE = local ? JSON.parse(local!)?.entityType : ""
  const STEP = local ? JSON.parse(local!)?.step : ""
  const [countryCodes, setCountryCodes] = useState([]);
  const [loading, setLoading] = useState(false)
  const params = useLocation();
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({});
  const [addressDetails, setAddressDetails] = useState<any>({});
  const [representativeDetails, setRepresentativeDetails] = useState<any>({});
  const [formValues, setFormValues] = useState<FATCACRSFormDetails>({} as FATCACRSFormDetails);
  const [clicked, setClicked] = useState(false);
  const { Paragraph } = Typography;

  const onFinish = () => {
    if (clicked == false || formValues?.isAgreeKYCFATCA ==false) {
      message.error("Please read and agree!");
      return false;
    }
    setLoading(true)
    updateFinal({
      userAlias: userAlias,
      type: "kycFATCA",
      kycFATCAPayload: formValues,
    }).then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
        localStroragevalue.step = 'done';
        setLocalStorage('auth', JSON.stringify(localStroragevalue))
        navigate(VerificationCompleted);
      }
    })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Something went wrong. Please try again later!");
      });
  };

  useEffect(() => {
    if (ENTITY_TYPE !== 'individual' || STEP !== 5) {
      navigate(-1)
    }
    else {
      setLoading(true)
      getAllCountries()
        .then((response: any) => {
          response
          setCountryCodes(response?.data);
        })

      fetchKybDetails(userAlias)
        .then((res) => {
          const kycFATCAPayload = res?.data?.data?.[0]?.kycFATCAPayload;
          setBasicDetails(res?.data?.data?.[0]?.basic?.[0]);
          setAddressDetails(res?.data?.data?.[0]?.addressDetails?.[0]);
          setRepresentativeDetails(res?.data?.data?.[0]?.representative?.[0]);
          if (kycFATCAPayload) {
            setFormValues(kycFATCAPayload);
            setClicked(kycFATCAPayload.isAgreeKYCFATCA);
            form.setFieldsValue({ ...kycFATCAPayload, isAgreeKYCFATCA: kycFATCAPayload.isAgreeKYCFATCA });
          }
          setLoading(false)
        })
        .catch(() => {
          message.error("Oops! Could not fetch details. Please try again later!");
        });
      window.scrollTo(0, 0);
    }
  }, []);

  const handleCancel = () => {
    setFormValues({} as FATCACRSFormDetails);
    setClicked(false);
    form.resetFields();
  }

  const generateRow = ({ icon, text }: any) => (
    <Col xs={24} className="d-flex align-items-baseline mt-3">
      <Image src={icon} alt="icon" preview={false} className="sidebar-submenu-icons" />
      <Paragraph className="stepDetails_sub mx-2 mb-0">{text}</Paragraph>
    </Col>
  );

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.BASIC_INFORMATION}</div> <Image
            src={BlueTick}
            alt="tick"
            preview={false}
            className="hw-20"
          />
        </span>
      ),
      children: (
        <>
          {generateRow({ icon: Mail, text: email })}
          {generateRow({ icon: Country, text: params?.state?.country ? params?.state?.country : basicDetails?.country })}
          {generateRow({
            icon: Country, text: (params?.state?.callingCode && params?.state?.contactNumber) ? `${params?.state?.callingCode} ${params?.state?.contactNumber}` : `${basicDetails?.callingCode} ${basicDetails?.contactNumber}`
          })}
        </>
      )
    },
    {
      key: '2',
      label: (
        <span >
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.ADDRESS_DETAILS}</div><Image
            src={BlueTick}
            alt="tick"
            preview={false}
            className="hw-20"
          />
        </span>
      ),
      children: (<>
        <Row className="pl-3">
          {generateRow({ icon: address, text: (params?.state?.addressDetails?.address1 && params?.state?.addressDetails?.address2) ? `${params?.state?.addressDetails?.address1},${params?.state?.addressDetails?.address2}` : `${addressDetails?.companyAddress1}, ${addressDetails?.companyAddress2}` })}
          {generateRow({ icon: City, text: params?.state?.addressDetails?.countryCode ? params?.state?.addressDetails?.countryCode : addressDetails?.companyCountry })}
          {generateRow({ icon: POBOX, text: params?.state?.addressDetails?.postalCode ? params?.state?.addressDetails?.postalCode : addressDetails?.postalCode })}
        </Row>
      </>)
    },
    {
      key: '3',
      label: (
        <span >
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div> <Image
            src={BlueTick}
            alt="tick"
            preview={false}
            className="hw-20"
          />
        </span>
      ),
      children: (<>
        <Row className="pl-3">
          {generateRow({ icon: User, text: representativeDetails?.representativeName  })}
          {generateRow({ icon: Documentdark, text: representativeDetails?.repDocNumber })}
          {generateRow({ icon: Country, text: representativeDetails?.documentNationality })}
        </Row>
      </>)
    },
    {
      key: '4',
      label: (
        <span className="step1 activeBtn pl--24px">
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.FATCA_SELF_CERTIFICATION_FORM}</div>
        </span>
      ),
      showArrow:false
    },
  ];

  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 4;
    setLocalStorage('auth', JSON.stringify(localStroragevalue))
    navigate(KYCVerificatioStep4);
  }

  const handleChange = (name: any, value: any) => {
    const dynamicFieldRegex = /^(hasMultipleKycTIN|hasMultipleTaxResidencyKycCountry)_(\d+)$/; 
    const dynamicFieldMatch = name.match(dynamicFieldRegex); 

    if (dynamicFieldMatch) {
      const [, dynamicFieldPrefix, index] = dynamicFieldMatch;
      const dynamicMultipleKybTinNo = `multipleKycTinNo_${index}`;
      const dynamicMultipleKybNoTinReason = `multipleKycNoTinReason_${index}`;
      const updatedFormValues: any = { ...formValues };
      if (dynamicFieldPrefix === 'hasMultipleKycTIN') {
        if (value === 'yes') {
          updatedFormValues[name] = value;
          updatedFormValues[dynamicMultipleKybNoTinReason] = "";
          delete updatedFormValues[dynamicMultipleKybNoTinReason];
        } else if(value === 'no') {
          updatedFormValues[name] = value;
          updatedFormValues[dynamicMultipleKybTinNo] = "";
          delete updatedFormValues[dynamicMultipleKybTinNo];
        }
      } else if (dynamicFieldPrefix === 'hasMultipleTaxResidencyKycCountry') {
        updatedFormValues[name] = value;
      }
      setFormValues(updatedFormValues);
    }else if (name === 'kycTaxResident' && value === 'no') {
      const updatedFormValues:any = { kycTaxResident: 'no' };
      form.resetFields();
      setClicked(false)
      setFormValues(updatedFormValues);
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };
  
  const handleCheckboxChange = (e:any) => {
    const isChecked = e.target.checked;
    setClicked(isChecked);
    handleChange('isAgreeKYCFATCA', isChecked);
  };

  const renderKyCMultipleTaxResidencyFields = () => {
    const { kycNumberOfCountry } = formValues;
    const numCountries = parseInt(kycNumberOfCountry);
  
    if (isNaN(numCountries) || numCountries <= 0) {
      return null;
    }
  
    const fields = [];
    for (let i = 0; i < numCountries; i++) {
      fields.push(
        <>
        <Row className="mb-3" key={`${i}-country`}>
        <div className="pr-25 w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
          <div className="subText_small mb-2 mt-2">Please let us know your other tax residency.<span className="red">*</span> </div>
          <InputText
            fieldname={`hasMultipleTaxResidencyKycCountry_${i}`}
            className="inputField mt-4"
            rules={[{ required: true, message: 'Please select a country' }]}
          >
            <Select placeholder="Select the Country" onChange={(value) => { handleChange(`hasMultipleTaxResidencyKycCountry_${i}`, value) }}
            showSearch allowClear optionFilterProp="children">
              {countryCodes.map((item: any) => (
                <Select.Option key={item?.isoCode} value={item?.name}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </InputText>
        </div>
      </Row>
      <Row key={i} className="mb-3">
          <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
            <div className="subText_small mb-2 mt-2">Do you have a Tax identification number? <span className="red">*</span></div>
            <InputText
              fieldname={`hasMultipleKycTIN_${i}`}
              className="inputField mt-4"
              rules={[{ required: true, message: 'Please select an option' }]}
            >
              <div className="d-flex w-100 px-3">
                <Radio.Group
                  onChange={(e) => handleChange(`hasMultipleKycTIN_${i}`, e.target.value)}
                  value={formValues[`hasMultipleKycTIN_${i}`]}
                >
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </div>
            </InputText>
          </div>
        </Row>
      </>
      );
      if (formValues[`hasMultipleKycTIN_${i}`] === 'yes') {
        fields.push(
          <>
            <Row className="mb-3">
              <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                <div className="subText_small mb-2 mt-2">Tax identification number<span className="red">*</span></div>
                <InputText
                  fieldname={`multipleKycTinNo_${i}`}
                  className="inputField error-input mt-4"
                  rules={[{
                    required: true,
                    message: 'Enter valid TIN (Maximum 5 number)'
                  }]}
                >
                  <Input
                    type="text"
                    placeholder="Enter the TIN"
                    maxLength={50}
                    onChange={(e) => handleChange(`multipleKycTinNo_${i}`, e.target.value)}
                    value={formValues[`multipleKycTinNo_${i}`]}
                  />
                </InputText>
              </div>
            </Row>
          </>
        );
      }
  
      if (formValues[`hasMultipleKycTIN_${i}`] === 'no') {
        fields.push(
          <Row key={`${i}-reason`} className="mb-3">
            <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
              <div className="subText_small mb-2 mt-2">Reason for no TIN Number <span className="red">*</span></div>
              <InputText
                fieldname={`multipleKycNoTinReason_${i}`}
                className="inputField mt-4"
                rules={[{ required: true, message: 'Please enter reason for no TIN' }]}
              >
                <Select placeholder="Select a reason" onChange={(value) => handleChange(`multipleKycNoTinReason_${i}`, value)}>
                  <Select.Option value="countryNotissueTINs">Country/ Jurisdiction does not issue TINs.</Select.Option>
                  <Select.Option value="countryNotRequirToProvideTIN">Country/ Jurisdiction does not require me to provide TIN.</Select.Option>
                  <Select.Option value="unableToObtainTIN">Unable to obtain a TIN.</Select.Option>
                </Select>
              </InputText>
            </div>
          </Row>
        );
      }
    }
  
    return fields;
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
      {ENTITY_TYPE === 'individual' && STEP === 5 ?
        <div>
          <UserHeader step={80} />
          <div className="text-right p-5 formSubText">Step 5/5</div>
          <IndividualResponsiveSidebar step={5} />
          <div className="d-flex center_res">
            <div className="px-5 verification_sidebar">
              <div className="slidebar-step-3-block">
                <Collapse items={items} bordered={false} />
                <div className="step_info d-flex mb-5">
                  <Image src={Info} alt="info" preview={false} className="mb-1" />
                  Address is important for your identification
                </div>
              </div>
            </div>
            <div className="px-5 px-5-res w-100">
              <div className="d-flex step-title">
                <Image
                  src={LeftArrow}
                  className="cursor"
                  alt="arrow"
                  preview={false}
                  onClick={() => {
                    goBack()
                  }}
                />
                <div className="titleText px-5">FATCA Self-Certification Form for Individuals</div>
              </div>
              <Form form={form} scrollToFirstError onFinish={onFinish} className="basic-info-form-block fatca-kyc-min">
                <Row className="mb-3">
                  <div className=" w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                    <div className="subText_small">Are you a Tax resident of any other country other than UAE?<span className="red">*</span></div>
                    <InputText
                      fieldname="kycTaxResident"
                      className="inputField mt-4"
                      rules={[{ required: true, message: 'Please select an option' }]}
                    >
                      <div className="d-flex w-100 px-3">
                        <Radio.Group
                          onChange={(e) => handleChange('kycTaxResident', e.target.value)}
                          value={formValues.kycTaxResident}
                        >
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no" > No </Radio>
                        </Radio.Group>
                      </div>
                    </InputText>
                  </div>
                </Row>

                {formValues.kycTaxResident === 'yes' && (
                  <>
                    <Row className="mb-3">
                      <div className="pr-25 w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                        <div className="subText_small mb-2 mt-2">Tax Residency country<span className="red">*</span> </div>
                        <InputText
                          fieldname="kycTaxResidencyCountry"
                          className="inputField mt-4"
                          rules={[{ required: true, message: 'Please select a country' }]}
                        >
                          <Select placeholder="Select Tax Residency Country" allowClear showSearch onChange={(value) => handleChange('kycTaxResidencyCountry', value)}>
                            {countryCodes.map((item: any) => (
                              <Select.Option key={item?.isoCode} value={item?.name}>
                                {item?.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </InputText>
                      </div>
                    </Row>
                    <Row className="mb-3">
                      <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                        <div className="subText_small mb-2 mt-2">Do you have a Tax identification number? <span className="red">*</span></div>

                        <InputText
                          fieldname="hasKycTIN"
                          className="inputField mt-4"
                          rules={[{ required: true, message: 'Please select an option' }]}
                        >
                          <div className="d-flex w-100 px-3">
                            <Radio.Group
                              onChange={(e) => handleChange('hasKycTIN', e.target.value)}
                              value={formValues.hasKycTIN}
                            >
                              <Radio value="yes">Yes</Radio>
                              <Radio value="no" > No </Radio>
                            </Radio.Group>
                          </div>
                        </InputText>
                      </div>
                    </Row>
                    <Row className="mb-3">
                      {formValues.hasKycTIN === 'yes' && (
                        <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                          <div className="subText_small mb-2 mt-2">Tax identification number<span className="red">*</span></div>
                          <InputText
                            fieldname="kycTinNo"
                            className="inputField mt-4 error-input"
                            rules={[{ required: true, message: 'Please enter TIN' }]}
                          >
                            <Input
                              type="text"
                              placeholder="Enter the TIN"
                              maxLength={50}                              
                              onChange={(e) => handleChange('kycTinNo', e.target.value)}
                            />
                          </InputText>
                        </div>
                      )}
                      {formValues.hasKycTIN === 'no' && (
                        <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                          <div className="subText_small mb-2 mt-2">Reason for no TIN Number <span className="red">*</span></div>
                          <InputText
                            fieldname="kycNoTinReason"
                            className="inputField mt-4"
                            rules={[{ required: true, message: 'Please enter reason for no TIN' }]}
                          >
                            <Select placeholder="Select a Reason" onChange={(value) => handleChange('kycNoTinReason', value)}>
                              <Select.Option value="countryNotissueTINs">Country/ Jurisdiction does not issue TINs.</Select.Option>
                              <Select.Option value="countryNotRequirToProvideTIN">Country/ Jurisdiction does not require me to provide TIN.</Select.Option>
                              <Select.Option value="unableToObtainTIN">Unable to obtain a TIN.</Select.Option>
                            </Select>
                          </InputText>
                        </div>
                      )}
                    </Row>
                    <Row className="mb-3">
                      <div className=" w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                        <div className="subText_small">Do you have multiple Tax Residency?<span className="red">*</span></div>
                        <InputText
                          fieldname="hasMultipleTaxResidentKyc"
                          className="inputField mt-4"
                          rules={[{ required: true, message: 'Please select an option' }]}
                        >
                          <div className="d-flex w-100 px-3">
                            <Radio.Group
                              onChange={(e) => handleChange('hasMultipleTaxResidentKyc', e.target.value)}
                              value={formValues.hasMultipleTaxResidentKyc}
                            >
                              <Radio value="yes">Yes</Radio>
                              <Radio value="no" > No </Radio>
                            </Radio.Group>
                          </div>
                        </InputText>
                      </div>
                    </Row>
                  </>
                )}

                {formValues.hasMultipleTaxResidentKyc === 'yes' && (
                  <>
                    <Row>
                  <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                          <div className="subText_small mb-2 mt-2">How many country?<span className="red">*</span></div>
                          <InputText
                            fieldname="kycNumberOfCountry"
                            className="inputField mt-4"
                            rules={[{ required: true, 
                               message: 'Enter number of country' },
                              ]}
                          >
                            <Select 
                              placeholder="Select number of Country" 
                              onChange={(value) => {handleChange('kycNumberOfCountry', value)}}
                              allowClear
                            >
                              <Select.Option key={1} value={1}> 1 </Select.Option>
                              <Select.Option key={2} value={2}> 2 </Select.Option>
                              <Select.Option key={3} value={3}> 3 </Select.Option>
                            </Select>
                          </InputText>
                        </div> 
                  </Row>
                  {renderKyCMultipleTaxResidencyFields()}
                  </>
                )}
                <Row>
                  <div className="mb-4">
                    <BoldText
                      children={
                        "Please note that it is your responsibility to inform Trustin Limited of any foreign tax liability"
                      }
                      style={{ textAlign: "start", color: "red" }}
                    />
                    <Checkbox
                      className="mt-1"
                      onChange={handleCheckboxChange}
                      checked={clicked}
                    >
                      <SmallText
                        className="formSubText forgetpassword"
                        children={
                          <>
                          I agree to the &nbsp;
                           <ViewButton
                             className="mb-0 ml-2"
                             children=" FATCA & CRS "
                             onClick={() => { window.open('https://mof.gov.ae/fatca-and-crs/', '_blank') }}
                           />
                           &nbsp;
                           declaration
                         </>
                        }
                        style={{ textAlign: "start" }}
                      />
                    </Checkbox>
                    {clicked && formValues?.isAgreeKYCFATCA == false && (
                      <div className="errMsg">Please read and agree!</div>
                    )}
                  </div>
                </Row>
                <Row className="center_res">
                  <div className="d-flex mb-4">
                    <Button className="rounded" htmlType="submit" loading={loading}>
                    Save & Submit
                    </Button>
                    <Button className="rounded_cancel mx-4" onClick={handleCancel}>Reset</Button>
                  </div>
                </Row>
              </Form>
            </div>
          </div>
        </div>
        : ""}
    </div>
  );
};

export default IndividualStep5;
