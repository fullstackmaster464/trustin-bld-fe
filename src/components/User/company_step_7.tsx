import { Button, Form, Image, Input, Row, Select, message, Collapse, Col, Typography, Radio, Checkbox, Tabs, DatePicker, Spin } from "antd";
import UserHeader from "./UserHeader";
import { useCallback, useEffect, useState } from "react";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import { InputText } from "../ui-elements/InputsRepo";
import { Option } from "antd/lib/mentions";
import Mobile from "../../assets/img/Mobile.svg";
import User from "../../assets/img/User_Full.svg";
import Company_gray from "../../assets/img/company_gray.svg";
import CompanySize from "../../assets/img/companySize.svg";
import Job from "../../assets/img/job_gray.svg";
import Role from "../../assets/img/role.svg";
import Flag from "../../assets/img/flag_gray.svg";
import Designation from "../../assets/img/Designation.svg";
import BlueTick from "../../assets/img/blue_tick.svg";
import { getAllCountries } from "../../services/masterData";
import { useLocation, useNavigate } from "react-router-dom";
import { KYBVerificatioStep6, VerificationCompleted } from "../Common/RouteConst";
import { COMPANY_ROLE, DateWithUtcOffset2, KYB_VERIFICATION_STEPS_TITLE, getLocalStorage, setLocalStorage } from "../Common/Constants";
import { fetchKybDetails } from "../../services/admin";
import type { CollapseProps } from 'antd';
import { BoldText, SmallText } from "../ui-elements/TextRepo";
import { updateFinal } from "../../services/user";
import ResponsiveSidebar from "./SidebarResponsiveCompany";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { ViewButton } from "../ui-elements/ButtonRepo";
const { TabPane } = Tabs;

type TargetKey = React.MouseEvent | React.KeyboardEvent | string | any;
interface RepresentativeDetails {
  documentNationality?: string,
  fatf?: number,
  nationality?: string,
  repDocNumber?: string,
  repExpiryDate?: any,
  representativeName?: string,
  roleType?: any,
  sharedOwnership?: boolean
}
interface BasicDetails {
  name?: string,
  email?: string,
  contactNumber?: string,
  callingCode?: string,
  dob?: any,
  country?: string,
  typeOfEntity?: string,
  dateOfCorporation?: any,
  profession?: string,
  placeOfBirth?: string,
  placeOfBirthId?: number,
  gender?: string,
  customerProfession?: number,
  residenceStatus?: number,
  countryofIncorporation?: number
}
interface BeneficialOwnerDetails {
  FirstName?: string,
  MiddleName?: string,
  LastName?: string,
  Gender?: string,
  shareholdingsPercentage?: number,
  designation?: string,
  moduleForSanctionScreening?: string,
  beneficialOwnerDob?: any,
  beneficialOwnerNationality?: string,
}

interface FATCACRSFormDetails {
  kybincorporatedTaxResident: string,
  kybTaxResidencyCountry?: string,
  hasKybTIN?: string,
  kybTinNo?: string,
  kybNoTinReason?: string,
  hasMultipleJurisdictionCompany?: string,
  hasPassiveNFE?: string,
  multipleKybTinNo?: string,
  isAgreeKYBFATCA: boolean,
  kybNumberOfCountry:number|any,
  [key: string]: string | boolean | any;
}

const CompanyStep7 = ():any => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const ENTITY_TYPE = local ? JSON.parse(local!)?.entityType : ""
  const STEP = local ? JSON.parse(local!)?.step : ""
  const [loading, setLoading] = useState(false)
  const params = useLocation();
  
  const [formValues, setFormValues] = useState<FATCACRSFormDetails>({} as FATCACRSFormDetails);
  // const [formValues, setFormValues] = useState<any>();
  const [clicked, setClicked] = useState(false);
  const [beneficialOwnerDetails, setBeneficialOwnerDetails] = useState<BeneficialOwnerDetails[]>([]);
  const [representativeDetails, setRepresentativeDetails] = useState<RepresentativeDetails>({});
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({});
  const [businessDetails, setBusinessDetails] = useState<any>({});
  const [tabs, setTabs] = useState<any>([]);
  const [tab, setTab] = useState<any>(1);
  const [activeTab, setActiveTab] = useState<any>("1");
  const [countryList, setCountryList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const { Paragraph } = Typography;

  const onFinish = () => {
    if (clicked == false || formValues?.isAgreeKYBFATCA == false) {
      message.error("Please read and agree!");
      return false;
    }
    let coltrollersPayload: any = [];
    if (tabs && tabs?.length > 0) {
      const formattedTabs = tabs.map((tab: any) => {
        const { FullName, currentResidenceAddress, birthCountry, controllerDob, country, taxResidenceCountry, hasControllerTIN } = tab;
        if (hasControllerTIN === "yes") {
          return {
            FullName,
            currentResidenceAddress,
            birthCountry,
            controllerDob,
            country,
            taxResidenceCountry,
            hasControllerTIN,
            controllerTinNo: tab.controllerTinNo,
          };
        }
        if (hasControllerTIN === "no") {
          return {
            FullName,
            currentResidenceAddress,
            birthCountry,
            controllerDob,
            country,
            taxResidenceCountry,
            hasControllerTIN,
            controllerNoTinReason: tab.controllerNoTinReason,
          };
        }
        return null;
      }).filter(Boolean);

      coltrollersPayload = formattedTabs;
    }

    const reqBody = {
      userAlias: userAlias,
      type: "kybFATCA",
      kybFATCAPayload: formValues,
      kybFATCAColtrollersPayload: coltrollersPayload?.length > 0 ? coltrollersPayload : null
    }
    
     
    setLoading(true)
    updateFinal(reqBody).then(async (res) => {
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
    if (ENTITY_TYPE !== 'company' || STEP !== 7) {
      navigate(-1)
    }
    else {
      setLoading(true)
      getAllCountries()
        .then((response: any) => {
          response
          setCountryList(response?.data);
        })

      fetchKybDetails(userAlias)
        .then((res) => {
          
          const kybFATCAPayload = res?.data?.data?.[0]?.kybFATCAPayload;
          const kybFATCAColtrollersPayload = res?.data?.data?.[0]?.kybFATCAColtrollersPayload;
          setBeneficialOwnerDetails(res?.data?.data?.[0]?.shareholdersPayload);
          setRepresentativeDetails(res?.data?.data?.[0]?.representative?.[0]);
          setBasicDetails(res?.data?.data?.[0]?.basic?.[0]);
          setBusinessDetails(res?.data?.data?.[0]?.business?.[0]);
          if (kybFATCAPayload) {
            setFormValues(kybFATCAPayload);
            setClicked(kybFATCAPayload.isAgreeKYBFATCA);
            form.setFieldsValue({ ...kybFATCAPayload, isAgreeKYBFATCA: kybFATCAPayload.isAgreeKYBFATCA });
          }
          if (kybFATCAColtrollersPayload?.length > 0) {
            const formattedData = kybFATCAColtrollersPayload.map((item: any, index: any) => ({
              key: (index + 1).toString(),
              label: `Controller ${(index + 1).toString()}`,
              controllerDob: item.controllerDob ? moment.utc(item.controllerDob) : null,
              ...item
            }));

            const tabsValue: { [key: string]: any } = {};

            kybFATCAColtrollersPayload.forEach((item: any, index: any) => {
              Object.entries(item).forEach(([key, value]: any) => {
                if (key == "controllerDob") {
                  tabsValue[`${key}-${index + 1}`] = value ? moment.utc(value) : null;
                } else {
                  tabsValue[`${key}-${index + 1}`] = value.toString();
                }

              });
            });
            form.setFieldsValue({ ...kybFATCAPayload, isAgreeKYBFATCA: kybFATCAPayload.isAgreeKYBFATCA, ...tabsValue });
            setTabs(formattedData)
          }
          setLoading(false)

        }).catch(() => {
          message.error("Oops! Could not fetch details. Please try again later!");
        });
      window.scrollTo(0, 0);
    }
  }, []);
  useEffect(() => {
    if (tabs?.length > 0 && tabs?.length > Number(tab)) {
      addTab()
    }
  }, [tab])


  useEffect(() => {
    if (tabs?.length > 0) {
      addTab()
    }
  }, [])

  const handleCancel = () => {
    setFormValues({} as FATCACRSFormDetails);
    setClicked(false);
    form.resetFields();
    
  }

  const generateRow = ({ icon, text }: any) => (
    <Col xs={24} className="d-flex align-items-center mt-3">
      <Image src={icon} alt="icon" preview={false} className="sidebar-submenu-icons" />
      <Paragraph className="stepDetails_sub mx-2 mb-0">{text}</Paragraph>
    </Col>
  );

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BASIC_INFORMATION}</div><Image src={BlueTick} alt="tick" preview={false} />
        </span>
      ),
      children: (<>
          {generateRow({ icon: Mail, text: email })}
          {generateRow({ icon: Country, text: params?.state?.basic?.country ? params?.state?.basic?.country : basicDetails?.country })}
          {generateRow({ icon: Mobile, text: (params?.state?.basic?.callingCode && params?.state?.basic?.contactNumber) ? `${params?.state?.basic?.callingCode} ${params?.state?.basic?.contactNumber}` : `${basicDetails?.callingCode} ${basicDetails?.contactNumber}` })}
      </>),
    },
    {
      key: '2',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REPRESENTATIVE_OWNERS}</div><Image src={BlueTick} className="h-w-20" alt="tick" preview={false} />
        </span>
      ),
      children: (<>
          {generateRow({ icon: User, text: params?.state?.representativeDetails?.representativeName ? params?.state?.representativeDetails?.representativeName : representativeDetails?.representativeName })}
          {generateRow({ icon: Role, text: params?.state?.representativeDetails?.roleType ? COMPANY_ROLE[params?.state?.representativeDetails?.roleType] : COMPANY_ROLE[representativeDetails?.roleType] })}
          {generateRow({ icon: Flag, text: params?.state?.representativeDetails?.nationality ? params?.state?.representativeDetails?.nationality : representativeDetails?.nationality })}
      </>),
    },

    {
      key: '3',
      label: (
        <span >
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BENEFICIAL_OWNERS}</div><Image src={BlueTick} alt="tick" preview={false} />
        </span>
      ),
      children: (<>
      {/* 
          {beneficialOwnerDetails && beneficialOwnerDetails?.length > 0 ? (<>
            {beneficialOwnerDetails?.map((item: any) => {
              return (
                <>
                  {generateRow({ icon: User, text: item?.FirstName })}
                  {generateRow({ icon: Designation, text: item?.shareholdingsPercentage })}
                </>
              )
            })}
          </>) : (<>
            {params?.state?.formValues?.map((item: any) => {
              return (
                <>
                  {generateRow({ icon: User, text: item?.FirstName })}
                  {generateRow({ icon: Designation, text: item?.shareholdingsPercentage })}
                </>
              )
            })}
          </>)}
 */}

          {params?.state?.shareholdersPayload && params?.state?.shareholdersPayload?.length > 0 ? (<>
              {params?.state?.shareholdersPayload?.map((item: any) => {
                const name = item?.FirstName  ? item.FirstName :  item?.CompnayName ? item.CompnayName : null;
                const percentage = item?.shareholdingsPercentage  ? item.shareholdingsPercentage :  item?.companyShareholdingsPercentage ? item.companyShareholdingsPercentage : null;
                const isCompany = !!item?.CompnayName;
                return (
                  <>
                    {generateRow({ icon: isCompany ? Company_gray : User, text: name })}
                    {generateRow({ icon: isCompany ? CompanySize : Designation, text: `${percentage}%` })}
                  </>
                )
              })}
            </>):
            (<>
                {beneficialOwnerDetails?.map((item: any) => {
                  return (
                    <>
                      {generateRow({ icon: User, text: item?.FirstName })}
                      {generateRow({ icon: Designation, text: item?.shareholdingsPercentage })}
                    </>
                  )
                })}
            </>
         )
            }
      </>),
    },
    {
      key: '4',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BUSINESS_DETAILS}</div><Image src={BlueTick} alt="tick" preview={false} />
        </span>
      ),
      children: (<>
          {generateRow({ icon: Job, text: (params?.state?.business?.businessName) ? params?.state?.business?.businessName : businessDetails?.businessName })}
          {generateRow({ icon: Job, text: (params?.state?.business?.address1 && params?.state?.business?.address2) ? `${params?.state?.business?.address1},${params?.state?.business?.address2}` : `${businessDetails?.companyAddress1},${businessDetails?.companyAddress2}` })}
          {generateRow({ icon: Country, text: (params?.state?.business?.countryCode) ? params?.state?.business?.countryCode : businessDetails?.companyCountry })}
      </>)
    },
    {
      key: '5',
      label: (
        <span className="step1 pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div><Image src={BlueTick} alt="tick" preview={false} />
        </span>
      ),
      showArrow: false,
    },
    {
      key: '6',
      label: (
        <span className="step1 activeBtn pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.FATCA_SELF_CERTIFICATION_FORM}</div>
        </span>
      ),
      showArrow: false
    },
  ];

  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 6;
    setLocalStorage('auth', JSON.stringify(localStroragevalue))
    navigate(KYBVerificatioStep6);
  }

  const handleChange = (name: any, value: any) => {
    const dynamicFieldRegex = /^(hasMultipleKybTIN|anotherjurisdictionCountry)_(\d+)$/; 
    const dynamicFieldMatch = name.match(dynamicFieldRegex); 

    if (dynamicFieldMatch) {
      const [, dynamicFieldPrefix, index] = dynamicFieldMatch;
      const dynamicMultipleKybTinNo = `multipleKybTinNo_${index}`;
      const dynamicMultipleKybNoTinReason = `multipleKybNoTinReason_${index}`;
      const updatedFormValues: any = { ...formValues };
      if (dynamicFieldPrefix === 'hasMultipleKybTIN') {
        if (value === 'yes') {
          updatedFormValues[name] = value;
          updatedFormValues[dynamicMultipleKybNoTinReason] = "";
          delete updatedFormValues[dynamicMultipleKybNoTinReason];
        } else if(value === 'no') {
          updatedFormValues[name] = value;
          updatedFormValues[dynamicMultipleKybTinNo] = "";
          delete updatedFormValues[dynamicMultipleKybTinNo];
        }
      } else if (dynamicFieldPrefix === 'anotherjurisdictionCountry') {
        updatedFormValues[name] = value;
      }
      setFormValues(updatedFormValues);
    }else if (name === 'kybincorporatedTaxResident' && value === 'no') {
      const updatedFormValues: any = { kybincorporatedTaxResident: 'no' };
      form.resetFields();
      setTabs([])
      setClicked(false)
      setFormValues(updatedFormValues);
    } else if (name === 'hasPassiveNFE' && value === 'no') {
      setFormValues({ ...formValues, [name]: value });
      setIsDisabled(true);
      setTab(1)
      setActiveTab("1")
      setTabs([]);
    } else if (name === 'hasPassiveNFE' && value === 'yes') {
      setFormValues({ ...formValues, [name]: value });
      setIsDisabled(false);
      if (tabs?.length == 0) {
        addTab();
      }
    } else if (name === 'hasKybTIN') {
      if (value === 'yes') {
        setFormValues({ ...formValues, kybNoTinReason: "", [name]: value });
      } else {
        setFormValues({ ...formValues, kybTinNo: "", [name]: value });
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleCheckboxChange = (e: any) => {
    const isChecked = e.target.checked;
    setClicked(isChecked);
    handleChange('isAgreeKYBFATCA', isChecked);
  };

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') {
      addTab();
    } else {
      handleRemoveTab(targetKey);
    }
  };
  const onTabChange = (key: string) => {
    setActiveTab(key);
  };
  const addTab = useCallback(() => {
    const newKey = `${tabs?.length + 1}`;
    const newTab: any = {
      key: newKey,
      label: `Controller ${newKey}`,
      children: (
        <></>
      ),
    };
    const existingTabs = JSON.parse(JSON.stringify(tabs));

    const tabExist = existingTabs.filter((item: any) => item.label === newTab.label)

    if (tabExist.length === 0) {
      setTabs([...tabs, newTab]);
    } else {
      setTabs([newTab])
    }
    setTab(newKey)
    setActiveTab(newKey)


  }, [tabs, setActiveTab, setTab, setTabs,tab,activeTab]);

  const handleRemoveTab = async (keyToRemove: string) => {
    if (keyToRemove == "1") {
      message.error("You can't remove default tabs")
    } else {
      const targetIndex = tabs.findIndex((tab: any) => tab.key === keyToRemove);
      const updatedTabs = tabs.filter((tab: any) => tab.key !== keyToRemove);
      if (updatedTabs?.length && keyToRemove === activeTab) {
        const { key } = updatedTabs[targetIndex === updatedTabs?.length ? targetIndex - 1 : targetIndex];
        setActiveTab(key);
      }
      setTabs(updatedTabs);

      form.resetFields(
        [`FullName-${keyToRemove}`,
        `birthCountry-${keyToRemove}`,
        `controllerDob-${keyToRemove}`,
        `currentResidenceAddress-${keyToRemove}`,
        `controllerTinNo-${keyToRemove}`,
        `country-${keyToRemove}`,
        `taxResidenceCountry-${keyToRemove}`,
        `hasControllerTIN-${keyToRemove}`,
        `controllerNoTinReason-${keyToRemove}`
        ]
      )
    
    }
  };

  const handleTabDataChange = (tabKey: string, field: string, value: any) => {
    const updatedTabs = tabs.map((tab: any) => {
      if (tab.key === tabKey) {
        return { ...tab, [field]: value };
      }
      return tab;
    });
    setTabs(updatedTabs);
  };

  const renderKybMultipleJurisdictionFields = () => {
    const { kybNumberOfCountry } = formValues;
    const numCountries = parseInt(kybNumberOfCountry);

    if (isNaN(numCountries) || numCountries <= 0) {
      return null;
    }

    const fields = [];
    for (let i = 0; i < numCountries; i++) {
      fields.push(
        <>
        <Row className="mb-3" key={`${i}-country`}>
        <div className="pr-25 w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
          <div className="subText_small mb-2 mt-2">Please let us know you another jurisdiction if any.<span className="red">*</span> </div>
          <InputText
            fieldname={`anotherjurisdictionCountry_${i}`}
            className="inputField mt-4"
            rules={[{ required: true, message: 'Please select a country' }]}
          >
            <Select placeholder="Select the Country" onChange={(value) => { handleChange(`anotherjurisdictionCountry_${i}`, value) }}
            showSearch allowClear optionFilterProp="children">
              {countryList.map((item: any) => (
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
              fieldname={`hasMultipleKybTIN_${i}`}
              className="inputField mt-4"
              rules={[{ required: true, message: 'Please select an option' }]}
            >
              <div className="d-flex w-100 px-3">
                <Radio.Group
                  onChange={(e) => handleChange(`hasMultipleKybTIN_${i}`, e.target.value)}
                  value={formValues[`hasMultipleKybTIN_${i}`]}
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
      if (formValues[`hasMultipleKybTIN_${i}`] === 'yes') {
        fields.push(
          <>
            <Row className="mb-3">
              <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                <div className="subText_small mb-2 mt-2">Tax identification number<span className="red">*</span></div>
                <InputText
                  fieldname={`multipleKybTinNo_${i}`}
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
                    onChange={(e) => handleChange(`multipleKybTinNo_${i}`, e.target.value)}
                    value={formValues[`multipleKybTinNo_${i}`]}
                  />
                </InputText>
              </div>
            </Row>
          </>
        );
      }

      if (formValues[`hasMultipleKybTIN_${i}`] === 'no') {
        fields.push(
          <Row key={`${i}-reason`} className="mb-3">
            <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
              <div className="subText_small mb-2 mt-2">Reason for no TIN Number <span className="red">*</span></div>
              <InputText
                fieldname={`multipleKybNoTinReason_${i}`}
                className="inputField mt-4"
                rules={[{ required: true, message: 'Please enter reason for no TIN' }]}
              >
                <Select placeholder="Select a Reason" onChange={(value) => handleChange(`multipleKybNoTinReason_${i}`, value)}>
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

  const validateSpecialCharFields = (value: any) => {
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    return Promise.resolve();
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
      {ENTITY_TYPE === 'company' && STEP === 7 ?
        <div>
          <UserHeader step={90} />
          <div className="text-right formSubText p-5">Step 7/7</div>
          <ResponsiveSidebar step={7} />
          <div className="d-flex center_res">
            <div className="px-5 verification_sidebar mb-5">
              <div className="slidebar-step-3-block">
                <Collapse items={items} bordered={false} />
              </div>
            </div>
            <div className="px-5 px-5-res w-half w-100">
              <div className="d-flex step-title">
                <Image src={LeftArrow} alt="arrow" preview={false} className="cursor" onClick={() => { goBack() }} />
                <div className="titleText px-5">FATCA Self-Certification Form for Entity</div>
              </div>
              <Form form={form} scrollToFirstError onFinish={onFinish} className="basic-info-form-block fatca-kyb-min">
                <Row className="mb-3">
                  <div className=" w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                    <div className="subText_small">Are you registered or incorporated Tax resident of any other country other than UAE?<span className="red">*</span></div>
                    <InputText
                      fieldname="kybincorporatedTaxResident"
                      className="inputField mt-4"
                      rules={[{ required: true, message: 'Please select an option' }]}
                    >
                      <div className="d-flex w-100 px-3">
                        <Radio.Group
                          onChange={(e) => handleChange('kybincorporatedTaxResident', e.target.value)}
                          value={formValues?.kybincorporatedTaxResident}
                        >
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no" > No </Radio>
                        </Radio.Group>
                      </div>
                    </InputText>
                  </div>
                </Row>
                {formValues?.kybincorporatedTaxResident === 'yes' && (
                  <>
                    <Row className="mb-3">
                      <div className="pr-25 w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                        <div className="subText_small mb-2 mt-2">Tax Residency country<span className="red">*</span> </div>
                        <InputText
                          fieldname="kybTaxResidencyCountry"
                          className="inputField mt-4"
                          rules={[{ required: true, message: 'Please select a country' }]}
                        >
                          <Select placeholder="Select Tax Residency Country" allowClear onChange={(value) => handleChange('kybTaxResidencyCountry', value)} showSearch optionFilterProp="children">
                            {countryList.map((item: any) => (
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
                          fieldname="hasKybTIN"
                          className="inputField mt-4"
                          rules={[{ required: true, message: 'Please select an option' }]}
                        >
                          <div className="d-flex w-100 px-3">
                            <Radio.Group
                              onChange={(e) => handleChange('hasKybTIN', e.target.value)}
                              value={formValues?.hasKybTIN}
                            >
                              <Radio value="yes">Yes</Radio>
                              <Radio value="no" > No </Radio>
                            </Radio.Group>
                          </div>
                        </InputText>
                      </div>
                    </Row>
                    <Row className="mb-3">
                      {formValues?.hasKybTIN === 'yes' && (
                        <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                          <div className="subText_small mb-2 mt-2">Tax identification number<span className="red">*</span></div>
                          <InputText
                            fieldname="kybTinNo"
                            className="inputField mt-4 error-input"
                            rules={[{ required: true, 
                               message: 'Enter Valid TIN (Maximun 5 number)' }]}
                          >
                            <Input
                              type="text"
                              placeholder="Enter the TIN"
                              maxLength={50}
                              onChange={(e) => handleChange('kybTinNo', e.target.value)}                              
                            />
                          </InputText>
                        </div>
                      )}
                      {formValues?.hasKybTIN === 'no' && (
                        <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                          <div className="subText_small mb-2 mt-2">Reason for no TIN Number <span className="red">*</span></div>
                          <InputText
                            fieldname="kybNoTinReason"
                            className="inputField mt-4"
                            rules={[{ required: true, message: 'Please enter reason for no TIN' }]}
                          >
                            <Select placeholder="Select a Reason" onChange={(value) => handleChange('kybNoTinReason', value)}>
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
                        <div className="subText_small">Do you have multiple Jurisdiction where your company registered?<span className="red">*</span></div>
                        <InputText
                          fieldname="hasMultipleJurisdictionCompany"
                          className="inputField mt-4"
                          rules={[{ required: true, message: 'Please select jurisdiction' }]}
                        >
                          <div className="d-flex w-100 px-3">
                            <Radio.Group
                              onChange={(e) => handleChange('hasMultipleJurisdictionCompany', e.target.value)}
                              value={formValues?.hasMultipleJurisdictionCompany}
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
                {formValues?.hasMultipleJurisdictionCompany === 'yes' && (
                  <>
                  <Row>
                  <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                          <div className="subText_small mb-2 mt-2">How many country?<span className="red">*</span></div>
                          <InputText
                            fieldname="kybNumberOfCountry"
                            className="inputField mt-4"
                            rules={[{ required: true, 
                               message: 'Select number of country' },
                              ]}
                          >
                          <Select allowClear placeholder="Select number of Country" onChange={(value) => {
                            handleChange('kybNumberOfCountry', value)
                          }}>
                            <Select.Option key={1} value={1}> 1 </Select.Option>
                            <Select.Option key={2} value={2}> 2 </Select.Option>
                            <Select.Option key={3} value={3}> 3 </Select.Option>
                          </Select>
                          </InputText>
                        </div> 
                  </Row>
                  <div>
                  {renderKybMultipleJurisdictionFields()}
                  </div>
                  </>
                )}
                {formValues?.hasMultipleKybTIN === 'no' && (
                  <Row className="mb-3">
                    <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                      <div className="subText_small mb-2 mt-2">Reason for no TIN Number <span className="red">*</span></div>
                      <InputText
                        fieldname="multipleKybNoTinReason"
                        className="inputField mt-4"
                        rules={[{ required: true, message: 'Please enter reason for no TIN' }]}
                      >
                        <Select placeholder="Select reason for no TIN Number" onChange={(value) => handleChange('multipleKybNoTinReason', value)}>
                          <Select.Option value="countryNotissueTINs">Country/ Jurisdiction does not issue TINs.</Select.Option>
                          <Select.Option value="countryNotRequirToProvideTIN">Country/ Jurisdiction does not require me to provide TIN.</Select.Option>
                          <Select.Option value="unableToObtainTIN">Unable to obtain a TIN.</Select.Option>
                        </Select>
                      </InputText>
                    </div>
                  </Row>
                )}
                <Row className="mb-3">
                  <div className="w-100-res d-flex flex-wrap align-items-center gap-2 gap-md-3 fatca-form">
                    <div className="subText_small mb-2 mt-2">Are you a Passive NFE?<span className="red">*</span></div>
                    <InputText
                      fieldname="hasPassiveNFE"
                      className="inputField mt-4"
                      rules={[{ required: true, message: 'Please select an option' }]}
                    >
                      <div className="d-flex w-100 px-3">
                        <Radio.Group
                          onChange={(e) => handleChange('hasPassiveNFE', e.target.value)}
                          value={formValues?.hasPassiveNFE}
                        >
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no" > No </Radio>
                        </Radio.Group>
                      </div>
                    </InputText>
                  </div>
                </Row>
                <Row>
                  {formValues?.hasPassiveNFE === 'yes' && (
                    <div className="overflow-auto escrow-tran-card">
                      <Tabs
                        hideAdd
                        onChange={onTabChange}
                        activeKey={activeTab}
                        type="editable-card"
                        onEdit={onEdit}
                        className="custom-tabs overflow-auto"
                      >
                        {tabs && tabs?.map((item: any, index: number) => {
                          return (
                            <TabPane tab={<span>
                              {`Controller ${index + 1}`}
                            </span>} key={item.key}>
                              <div>
                                <Row>
                                  <div className="pr-25 w-100-res" >
                                    <div className="subText_small" > Full name <span className="red" >* </span></div>
                                    <InputText
                                      fieldname={`FullName-${item.key}`}
                                      className="inputField mb-4"
                                      rules={
                                        [
                                          {
                                            required: true,
                                            message: "Enter full name!",
                                          },
                                        ]}
                                    >
                                      <Input
                                        type="text"
                                        placeholder="Enter the full name"
                                        prefix={
                                          < span className="inputGlobe" >
                                            <Image
                                              src={User}
                                              alt="FullName"
                                              className="me-3"
                                              preview={false}
                                            />
                                          </span>
                                        }
                                        maxLength={50}
                                        value={item[`FullName-${item.key}`]}
                                        onChange={e => handleTabDataChange(item.key, 'FullName', e.target.value)}
                                      />
                                    </InputText>
                                  </div>
                                  < div className="w-100-res" >
                                    <div className="subText_small" > Date of birth <span className="red" >* </span></div >
                                    <Form.Item name={`controllerDob-${item.key}`}
                                      className="inputField mb-4"
                                      rules={
                                        [
                                          {
                                            required: true,
                                            message: "Please select date of birth!",
                                          },
                                        ]}
                                    >
                                      <DatePicker
                                        format={{
                                          format: 'DD-MM-YYYY',
                                          type: 'mask',
                                        }}
                                        placeholder="Select date of birth"
                                        className="dob_step"
                                        disabledDate={(current:any) => {
                                          return current > moment().subtract(18, "years");
                                        }}
                                        value={DateWithUtcOffset2((item[`controllerDob-${item.key}`]))}
                                        onChange={(_, dateString: any) => handleTabDataChange(item.key, 'controllerDob', DateWithUtcOffset2(dateString))}

                                      />
                                    </Form.Item>
                                  </div>
                                </Row>
                                <Row>
                                  <div className="pr-25 w-100-res" >
                                    <div className="subText_small" >Current residence address <span className="red" >* </span></div>
                                    <InputText
                                      fieldname={`currentResidenceAddress-${item.key}`}
                                      className="inputField"
                                      rules={
                                        [
                                          {
                                            required: true,
                                            message: "Enter current residence address!",
                                          },
                                          {
                                            validator: async (_: any, value: any) => {
                                              return validateSpecialCharFields(value);
                                            }
                                          },
                                        ]}
                                    >
                                      <Input
                                        type="text"
                                        placeholder="Enter current residence address"
                                        prefix={
                                          < span className="inputGlobe" >
                                            <Image
                                              src={User}
                                              alt="FullName"
                                              className="me-3"
                                              preview={false}
                                            />
                                          </span>
                                        }
                                        maxLength={50}
                                        value={item[`currentResidenceAddress-${item.key}`]}
                                        onChange={e => handleTabDataChange(item.key, 'currentResidenceAddress', e.target.value)}
                                      />
                                    </InputText>
                                  </div>
                                  < div className="w-100-res" >
                                    <div className="subText_small" > Country of Birth < span className="red" >* </span></div >
                                    <InputText
                                      className="country-selection mb-4 selectField"
                                      fieldname={`birthCountry-${item.key}`}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please select birth country!",
                                        },
                                      ]}
                                    >
                                      <Select
                                        className="w-100 before-country-img "
                                        placeholder="Select birth Country"
                                        allowClear
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        showSearch
                                        optionFilterProp="children"
                                        value={item[`birthCountry-${item.key}`]}
                                        onChange={value => handleTabDataChange(item.key, 'birthCountry', value)}
                                      >
                                        {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                                          return (
                                            <Option key={index} value={value.name} >{value.name}</Option>
                                          )
                                        })}
                                      </Select>
                                    </InputText>

                                  </div>
                                </Row>
                                <Row>
                                  <div className="pr-25 w-100-res" >
                                    <div className="subText_small" >Country< span className="red" >* </span></div >
                                    <InputText
                                      className="country-selection mb-4 selectField"
                                      fieldname={`country-${item.key}`}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please select  country!",
                                        },
                                      ]}
                                    >
                                      <Select
                                        className="w-100 before-country-img"
                                        placeholder="Select Country"
                                        allowClear
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        showSearch
                                        optionFilterProp="children"
                                        value={item[`country-${item.key}`]}
                                        onChange={value => handleTabDataChange(item.key, 'country', value)}
                                      >
                                        {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                                          return (
                                            <Option key={index} value={value.name} >{value.name}</Option>
                                          )
                                        })}
                                      </Select>
                                    </InputText>
                                  </div>
                                  <div className="w-100-res" >
                                    <div className="subText_small" > Country of Tax Residence < span className="red" >* </span></div >
                                    <InputText
                                      className="country-selection mb-4 selectField"
                                      fieldname={`taxResidenceCountry-${item.key}`}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please select country of tax residence!",
                                        },
                                      ]}
                                    >
                                      <Select
                                        className="w-100 before-country-img"
                                        placeholder="Select country of tax residence"
                                        allowClear
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        showSearch
                                        optionFilterProp="children"
                                        value={item[`taxResidenceCountry-${item.key}`]}
                                        onChange={value => handleTabDataChange(item.key, 'taxResidenceCountry', value)}
                                      >
                                        {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                                          return (
                                            <Option key={index} value={value.name} >{value.name}</Option>
                                          )
                                        })}
                                      </Select>
                                    </InputText>
                                  </div>
                                </Row>
                                <Row className="radioInput">
                                  <div className="pr-25 w-100-res d-flex flex-wrap flex-column fatca-form">
                                    <div className="subText_small mb-2 mt-2">Do you have a Tax identification number? <span className="red">*</span></div>
                                    <InputText
                                      fieldname={`hasControllerTIN-${item.key}`}
                                      className="inputField"
                                      rules={[{ required: true, message: 'Please select an option' }]}
                                    >
                                      <div className="d-flex w-100 px-3">
                                        <Radio.Group
                                          onChange={e => handleTabDataChange(item.key, 'hasControllerTIN', e.target.value)}
                                          value={item?.hasControllerTIN ? item?.hasControllerTIN : item[`hasControllerTIN-${item.key}`]}
                                        >
                                          <Radio value="yes">Yes</Radio>
                                          <Radio value="no">No</Radio>
                                        </Radio.Group>
                                      </div>
                                    </InputText>
                                  </div>
                                  {(item[`hasControllerTIN-${item.key}`] === 'yes' || item?.hasControllerTIN === 'yes') && (
                                    <div className="w-100-res">
                                      <div className="subText_small mb-2 mt-2">Tax identification number<span className="red">*</span></div>
                                      <InputText
                                        fieldname={`controllerTinNo-${item.key}`}
                                        className="inputField"
                                        rules={[{ required: true, 
                                           message: 'Enter valid TIN (Maximum 5 number)' }]}
                                      >
                                        <Input
                                          type="text"
                                          placeholder="Enter the TIN"
                                          maxLength={50}
                                          prefix={
                                            <span className="inputGlobe">
                                              <Image
                                                src={User}
                                                alt="FullName"
                                                className="me-3"
                                                preview={false}
                                              />
                                            </span>
                                          }
                                          value={item[`controllerTinNo-${item.key}`]}
                                          onChange={e => handleTabDataChange(item.key, 'controllerTinNo', e.target.value)}
                                        />
                                      </InputText>
                                    </div>
                                  )}
                                  {(item[`hasControllerTIN-${item.key}`] === 'no' || item?.hasControllerTIN === 'no') && (
                                    <div className="w-100-res">
                                      <div className="subText_small mb-2 mt-2">Reason for no TIN Number<span className="red">*</span></div>
                                      <InputText
                                        fieldname={`controllerNoTinReason-${item.key}`}
                                        className="inputField mt-4"
                                        rules={[{ required: true, message: 'Please enter reason for no TIN' }]}
                                      >
                                        <Select placeholder="Select a Reason" onChange={(value) => handleTabDataChange(item.key, 'controllerNoTinReason', value)}>
                                          <Select.Option value="countryNotissueTINs">Country/ Jurisdiction does not issue TINs.</Select.Option>
                                          <Select.Option value="countryNotRequirToProvideTIN">Country/ Jurisdiction does not require me to provide TIN.</Select.Option>
                                          <Select.Option value="unableToObtainTIN">Unable to obtain a TIN.</Select.Option>
                                        </Select>
                                      </InputText>
                                    </div>
                                  )}
                                </Row>
                              </div>
                            </TabPane>
                          )
                        }
                        )
                        }
                      </Tabs>
                    </div>
                  )}
                </Row>
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
                    {clicked == false && formValues?.isAgreeKYBFATCA == false && (
                      <div className="errMsg">Please read and agree!</div>
                    )}
                  </div>
                </Row>
                <Row className="center_res">
                  <div className="d-flex mb-5 controller_btn">
                    <Button className="rounded" htmlType="submit" loading={loading}  style={{marginTop:'0px'}}>
                      Save & Submit
                    </Button>
                    <Button className="rounded_cancel mx-4" onClick={handleCancel} style={{marginTop:'0px'}}>Reset</Button>
                    {isDisabled == true &&  formValues?.hasPassiveNFE === 'yes'? (
                    <Button className="rounded disabled" htmlType="button" onClick={addTab} disabled style={{marginTop:'0px'}}>
                      <PlusOutlined />Add More Controller
                    </Button>) : (
                       formValues?.hasPassiveNFE === 'yes' && (
                        <Button className="rounded" htmlType="button" onClick={addTab}  style={{marginTop:'0px'}}>
                          <PlusOutlined />Add More Controller
                        </Button>
                      )
                    )}

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

export default CompanyStep7;
