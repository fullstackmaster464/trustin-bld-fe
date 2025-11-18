import { Button, Form, Image, Input, Row, Select, message, Collapse, Col, Typography, Spin } from "antd";
import UserHeader from "./UserHeader";
import { useEffect, useState } from "react";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import { InputText } from "../ui-elements/InputsRepo";
import { Option } from "antd/lib/mentions";
// import Mobile from "../../assets/img/Mobile.svg";
import PhoneCode from "../Common/PhoneCode";
import address from "../../assets/img/location_gray.svg";
import Info from "../../assets/img/info.svg";
import POBOX from "../../assets/img/chat.svg";
import BlueTick from "../../assets/img/blue_tick.svg";
import { getAllCountries } from "../../services/masterData";
import { useLocation, useNavigate } from "react-router-dom";
import { KYCVerificatioStep2, KYCVerificatioStep4 } from "../Common/RouteConst";
import { DEFAULT_COUNTRY_CODE, KYC_VERIFICATION_STEPS_TITLE, MobilNumberRegex, getLocalStorage, setLocalStorage } from "../Common/Constants";
import IndividualResponsiveSidebar from "./SidebarResponsiveIndividual";
import { getCitiesList, updateKybAddress } from "../../services/user";
import { fetchKybDetails } from "../../services/admin";
import type { CollapseProps } from 'antd';
import { FileSearchOutlined } from "@ant-design/icons";
import CountryFlag from "../Common/CountryFlag";

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

const IndividualStep3 = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const local = getLocalStorage("auth");
  if (!local) {
    navigate('/login'); 
    return;
  }
  const parsedLocal = JSON.parse(local);
  const email = parsedLocal?.email || "";
  const userAlias = parsedLocal?.userAlias || "";
  const ENTITY_TYPE = parsedLocal?.entityType || "";
  const STEP = parsedLocal?.step || "";

  const [countryCodes, setCountryCodes] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [callingCode, setCallingCode] = useState("");
  const [isoCode, setIsoCode] = useState<any>("");
  const [loading,setLoading] = useState(false)
  const params = useLocation();
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({});
  const [selectedIsoCode, setSelectedIsoCode] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [fieldClassNames, setFieldClassNames] = useState({
    address1: '',
    address2: '',
    address3: '',
  }); 

  const { Paragraph } = Typography;

  const onFinish = (values: any) => {
    setLoading(true)
    const reqBody = {
      type: "individualAddress",
      address1: values?.address1,
      address2: values?.address2,
      address3: values?.address3,
      cityCode: values?.cityCode,
      countryCode: values?.countryCode,
      stateCode: values?.cityCode,
      postalCode: values?.postalCode,
      phoneNumber: values?.phoneNumber,
      userAlias:userAlias
    }
    updateKybAddress(reqBody)
    .then((res) => {
      setLoading(false);
      if (res.status === 201 || res.status === 200) {
        const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
        localStroragevalue.step = 4;
        setLocalStorage('auth',JSON.stringify(localStroragevalue))

        navigate(KYCVerificatioStep4,{state:{
          formValues:values,
          basic: params?.state
        }});
      }
    })
    .catch(() => {
      setLoading(false);
      message.error("Oops! Something went wrong. Please try again later!");
    });
  };

  const onCityChange = (option:any) =>{
    setSelectedCity(option);
    form.setFieldValue("cityCode",option);
  }
  const handleCountryChange = (value: any) => {
    setSelectedIsoCode(value);
    form.setFieldsValue({
      countryCode: value,
      cityCode: undefined,
    });
    setSelectedCity(''); 
    const codeFilter:any = countryCodes.filter((item:any) => item?.isoCode === value)
    const callingCode = codeFilter[0]?.callingCode
    setIsoCode(value)
    setCallingCode(
      callingCode
    );
    if (value) {
      setLoading(true);
      getCitiesList(value)
        .then((response) => {
          if (response?.status === 200) {
            setLoading(false);
            const sortedCitiesList = sort(response.data.citiesList);
            setCitiesList(sortedCitiesList);
          }
        })
    }
    
  };
  const sort = (arrayList: any) => {
    return arrayList.sort(function (a:any, b:any) {
      if (!a.name && a.code === "FLOOR 13 02") {
        a.name = a.code;
      }
      if (!b.name && b.code === "FLOOR 13 02") {
        b.name = b.code;
      }
      if (a?.name > b?.name) return 1;
      if (a?.name < b?.name) return -1;
      return 0;
    });
  };
  const validateNumber = (e: any) => {
    const result: number = e.target.value.replace(MobilNumberRegex, "");
    form.setFieldsValue({ phoneNumber: result });
  };

  const validateSpecialCharFields = (value: any) => {
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (ENTITY_TYPE !== 'individual' || STEP !== 3) {
          navigate(-1)
        } else {
          setLoading(true)
          let selectedCountry = "";
          let apiCallsCompleted = 0;
          const totalApiCalls = 3;

          const handleLoadingComplete = () => {
            apiCallsCompleted++;
            if (apiCallsCompleted === totalApiCalls) {
              setLoading(false);
            }
          };
          setCallingCode(params?.state?.callingCode);
          const kycDetailsPromise = fetchKybDetails(userAlias)
            .then((res) => {
              const individual = res.data?.data?.[0]?.addressDetails?.[0];
              setBasicDetails(res.data?.data?.[0]?.basic?.[0]);
              selectedCountry = individual?.companyCountry;
              // let countryCode = '';
              if (individual) {
                form.setFieldsValue({
                  address1: individual?.companyAddress1,
                  address2: individual?.companyAddress2,
                  address3: individual?.companyAddress3,
                  countryCode: individual?.companyCountry,
                  cityCode: individual?.companyCity,
                  postalCode: individual?.postalCode,
                  phoneNumber: individual.phoneNumber,
                  // phoneCode:'+971'
                });
                // countryCode = individual?.companyCountry;
                // setSelectedIsoCode(individual?.companyCountry);
                // setSelectedCity(individual?.companyCity);
              }
             
              if (!form.getFieldValue("phoneNumber")) {
                form.setFieldValue("phoneNumber", params?.state?.contactNumber);
                form.setFieldValue("phonecode", params?.state?.callingCode)
              }
              handleLoadingComplete();
              return selectedCountry;
            })
            .catch(() => {
              message.error("Oops! Could not fetch details. Please try again later!");
            });
            
          const allCountriesPromise = kycDetailsPromise.then((selectedCountry: any) => {
            return getAllCountries().then((response) => {
              setCountryCodes(response?.data);
              setSelectedIsoCode(selectedCountry);
              response.data.forEach((elem: any) => {
                if (elem.isoCode === selectedCountry) {
                  setCallingCode(elem.callingCode);
                }
              });
              handleLoadingComplete();
              return selectedCountry;
            }).catch(() => {
              setLoading(false);
              throw new Error("Failed to fetch all countries");
            });
          });

          const citiesListPromise = allCountriesPromise.then((selectedCountry) => {
            if (selectedCountry) {
              return getCitiesList(selectedCountry).then((cityResponse) => {
                if (cityResponse?.status === 200) {
                  const sortedCitiesList = sort(cityResponse.data.citiesList);
                  setCitiesList(sortedCitiesList);
                }
                handleLoadingComplete();
              }).catch(() => {
                setLoading(false);
                throw new Error("Failed to fetch cities list");
              });
            } else {
              handleLoadingComplete();
            }
          });

          await Promise.all([kycDetailsPromise, allCountriesPromise, citiesListPromise]);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        message.error("Oops! Could not fetch details. Please try again later!");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const onCitySearch = (searchValue: any)=> {
    getCitiesList(selectedIsoCode, searchValue)
      .then((response) => {
        if (response?.status === 200) {
          const sortedCitiesList = sort(response.data.citiesList);
          setCitiesList(sortedCitiesList);
        }
      })
  }
  const handleCancel =()=>{
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
      children: (<>
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
        <span className="step1 activeBtn pl--24px">
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.ADDRESS_DETAILS}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '3',
      label: (
        <span className="pl--24px">
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '4',
      label: (
        <span className="step1 pl--24px">
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
    form.setFieldValue("phoneNumber", newValue);
  };
  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };
  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 2;
    setLocalStorage('auth',JSON.stringify(localStroragevalue))
    navigate(KYCVerificatioStep2);
  }

  const validatePOBox = (_: any, value: any, callback: any) => {
    if (value && !/^[0-9]+$/.test(value)) {
      callback('P.O. box should only contain numbers.');
    } else if (value && value.length < 4) {
      callback('P.O. box should have at least 4 digits.');
    } else if (value && value.length > 6) {
      callback('P.O. box should have at most 6 digits.');
    } else {
      callback();
    }
  };

  const handleInput = (e: any, fieldname: string) => {
    const regex = /^[A-Za-z0-9,\- ]*$/; 
    const currentValue = e.target.value;
    const lastChar = currentValue.slice(-1);
  
    if (!regex.test(lastChar)) {
      e.preventDefault();
      setFieldClassNames(prevClassNames => ({
        ...prevClassNames,
        [fieldname]: 'inputField'
      }));
    } else {
      setFieldClassNames(prevClassNames => ({
        ...prevClassNames,
        [fieldname]: ''
      }));
      e.target.value = currentValue.replace(/[^A-Za-z0-9,\- ]/g, '');
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
          {ENTITY_TYPE === 'individual' && STEP === 3 ? 
        <div>
      <UserHeader step={40} />
      <div className="text-right p-5 formSubText">Step 3/5</div>
      <IndividualResponsiveSidebar step={3} />
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
        <div className="px-5 px-5-res">
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
            <div className="titleText px-5">Address details</div>
          </div>
          <Form form={form} scrollToFirstError onFinish={onFinish} className="basic-info-form-block">
            <Row className="">
              <div className="pr-25  w-100-res">
                <div className="subText_small mb-2 mt-2">
                Building name and flat number <span className="red">*</span>
                </div>
                <InputText
                  fieldname="address1"
                  className={`inputField mb-4 ${fieldClassNames.address1}`}
                  rules={[
                    {
                      required: true,
                      message: "Building name and flat number is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid address!",
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
                    placeholder="Building name and flat number"
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={address}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                    onInput={(e) => handleInput(e, 'address1')}
                  />
                </InputText>
              </div>
              <div className=" w-100-res">
                <div className="subText_small mb-2 mt-2">Street name and nearest landmark <span className="red">*</span></div>
                <InputText
                  fieldname="address2"
                  className={`inputField mb-4 ${fieldClassNames.address2}`}
                  rules={[
                    {
                      required: true,
                      message: "Street name and nearest landmark is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid address!",
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
                    placeholder="Street name and nearest landmark"
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={address}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                    onInput={(e) => handleInput(e, 'address2')}
                  />
                </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">
                Area name <span className="red">*</span>
                  </div>
                <InputText
                  fieldname="address3"
                  className={`inputField mb-4 ${fieldClassNames.address3}`}
                  rules={[
                    {
                      required: true,
                      message: " Area name is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid  area name!",
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
                    placeholder="Area name"
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={address}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                    onInput={(e) => handleInput(e, 'address3')}
                  />
                </InputText>
              </div>
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">Country <span className="red">*</span></div>
                  <InputText
                    className="country-selection mb-4"
                    fieldname="countryCode"
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
                      value={selectedIsoCode}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      allowClear
                      className="w-75 h-100 pt-1"
                      showSearch
                      optionFilterProp="children"
                    >
                      {countryCodes.map((item:any, idx: number) => {
                      return item?.currency?.status == "active" ? (
                        <Option key={idx.toString()} value={item?.isoCode}>
                          {item?.name}
                        </Option>
                      ) : null;
                    })}
                      {/* <Option key="AE" value="AE" >
                      UNITED ARAB EMIRATES
                      </Option> */}
                    </Select>
                  </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">Mobile number<span className="red">*</span></div>
                  <Form.Item
                    name="phoneNumber"
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
                      onChange={(e) => {
                        validateNumber(e);
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
              <div className="  w-100-res" style={{position:'relative'}}>
                <div className="subText_small mb-2 mt-2">City <span className="red">*</span>
                <span className="global-search-city-icon">
                      <FileSearchOutlined />
                    </span> 
                </div>
                <InputText
                  fieldname="cityCode"
                  className="inputField mb-4 country-selection"
                  rules={[
                    {
                      required: true,
                      message: "City is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid city!",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    onSearch={onCitySearch}
                    optionFilterProp="children"
                    placeholder="Search for city"
                    className="w-75 h-100 pt-1"
                    onChange={onCityChange}
                    value={selectedCity}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {citiesList.map((city:any, idx:number) => (
                      <Option key={idx.toString()} value={city.code}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                </InputText>
              </div>
            </Row>
            <Row>
              {/* <div className="pr-25  w-100-res">
                <div className="subText_small mb-2 mt-2">City</div>
                <InputText
                  fieldname="cityCode"
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
                      message: "City is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid city!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select City"
                    onChange={onCityChange}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {citiesList.map((city:any) => (
                      <Option key="cities" value={city.code}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                </InputText>
              </div> */}
              <div className=" w-100-res">
                <div className="subText_small mb-2 mt-2">PO Box (Optional)</div>
                <InputText
                  fieldname="postalCode"
                  className="inputField mb-4"
                  rules={[
                    {
                      validator: validatePOBox,
                    },
                    {
                      whitespace: true,
                      message: "Enter valid postal no.!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter the PO Box"
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={POBOX}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={6}
                  />
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

export default IndividualStep3;
