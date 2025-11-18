import { Button, Form, Image, Input, Row, Select, message, Collapse, Col, Typography, Spin, Upload, Tooltip, DatePicker } from "antd";
import UserHeader from "./UserHeader";
import { useEffect, useState } from "react";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import { InputText } from "../ui-elements/InputsRepo";
import { Option } from "antd/lib/mentions";
import Mobile from "../../assets/img/Mobile.svg";
import address from "../../assets/img/location_gray.svg";
import Job from "../../assets/img/job_gray.svg";
import POBOX from "../../assets/img/chat.svg";
import BlueTick from "../../assets/img/blue_tick.svg";
import User from "../../assets/img/User_Full.svg";
import Company_gray from "../../assets/img/company_gray.svg";
import CompanySize from "../../assets/img/companySize.svg";
import Role from "../../assets/img/role.svg";
import Globe from "../../assets/img/globe_gray.svg";
import InfoImg from "../../assets/img/info.svg";
import Flag from "../../assets/img/flag_gray.svg";
import Designation from "../../assets/img/Designation.svg";
import PhoneCode from '../Common/PhoneCode'
import { useLocation, useNavigate } from "react-router-dom";
import { KYBVerificatioStep4, KYBVerificatioStep6 } from "../Common/RouteConst";
import { COMPANY_ROLE, DEFAULT_COUNTRY_CODE, DateWithUtcOffset2, KYB_VERIFICATION_STEPS_TITLE, MobilNumberRegex, OnlyText, acceptedFileExtension, alphanumericRegex, beforeUploadFile, getLocalStorage, setLocalStorage } from "../Common/Constants";
import ResponsiveSidebar from "./SidebarResponsiveCompany";
import { deleteFile, getCitiesList, getCompanyNameFromDocument, updateKybAddress, userKyc } from "../../services/user";
import { fetchKybDetails } from "../../services/admin";
import type { CollapseProps } from 'antd';
import { getAllCountries } from "../../services/masterData";
import Doc_large from "../../assets/img/Doc_large.svg";
import { CheckCircleOutlined, FileSearchOutlined, LoadingOutlined } from "@ant-design/icons";
import BlueEye from "../../assets/img/blue_eye.svg";
import Delete from "../../assets/img/delete.svg";
import Tick from "../../assets/img/circle_orange.svg"
import Pdf from "../../assets/img/pdfview.svg";
import Doc from "../../assets/img/id.svg";
import ImagePreviewModal from "../Models/ImagePreviewModal";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import dayjs from "dayjs";
import CountryFlag from "../Common/CountryFlag";

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

enum DocumentType {
  RepAddProof = 'repAddProof',
  RepDocFront = 'repDocFront',
  RepDocBack = 'repDocBack',
  BusinessRegProof = 'businessRegProof',
  BusinessAddProof = 'businessAddProof',
  AuthorizationDoc = 'authorizationDoc',
  VATDoc = 'vatDoc',
  OtherDoc = 'otherDoc',
}
interface DocumentData {
  repAddProof?: any[] | any;
  repDocFront?: any[] | any;
  repDocBack?: any[] | any;
  businessRegProof?: any[] | any;
  businessAddProof?: any[] | any;
  authorizationDoc?: any[] | any;
  vatDoc?: any[] | any;
  otherDoc?: any[] | any;
}


const CompanyStep5 = (): any => {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const [callingCode, setCallingCode] = useState("");
  const [loading,setLoading] = useState(false)
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const params:any = useLocation();  
  
  const [countryCodes, setCountryCodes] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [representativeDetails, setRepresentativeDetails] = useState<RepresentativeDetails>({});
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({});
  const [selectedIsoCode, setSelectedIsoCode] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [beneficialOwnerDetails, setBeneficialOwnerDetails] = useState<BeneficialOwnerDetails[]>([]);
  const [fieldClassNames, setFieldClassNames] = useState({
    address1: '',
    address2: '',
    address3: '',
  }); 

  const { Paragraph } = Typography;
  const ENTITY_TYPE = JSON.parse(getLocalStorage("auth")!)?.entityType
  const STEP = JSON.parse(getLocalStorage("auth")!)?.step;
  const companyName = local ? JSON.parse(local)?.companyName : "";
  const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const Token = local ? JSON.parse(local)?.token : "";
  const [uploadLoading, setUploadLoading] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData>();
  const [haveregproof, sethaveregproof] = useState(0);
  const [regProof, setRegProof] = useState<any>({});
  const [formTouched, setformTouched] = useState(false);
  const [uploadError,setUploadError] = useState<any>({
    docFront:"",
    docBack:"",
    moaDocError:""
  });
  const [imagePreviewModal, setImagePreviewModal] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<any>({});
  const [isoCode, setIsoCode] = useState<any>("");
  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 4;
    setLocalStorage('auth',JSON.stringify(localStroragevalue))
    navigate(KYBVerificatioStep4);
  }
  const handleCountryChange = (value: any) => {
    setLoading(true);
    setSelectedIsoCode(value);
    form.setFieldsValue({
      countryCode: value
    });
    const codeFilter: any = countryCodes.filter((item: any) => item?.isoCode === value)
    const callingCode = codeFilter?.[0]?.callingCode ?? ''
    setIsoCode(value)
    setCallingCode(
      callingCode
    );
    if (value) {
      getCitiesList(value)
        .then((response) => {
          if (response?.status === 200) {
            setLoading(false);
            const sortedCitiesList = sort(response.data.citiesList);
            setCitiesList(sortedCitiesList);
          } else {
            setLoading(false);
          }
        })
    }
  };
  const onCitySearch = (searchValue: any)=> {
    getCitiesList(selectedIsoCode, searchValue)
      .then((response) => {
        if (response?.status === 200) {
          setLoading(false);
          const sortedCitiesList = sort(response.data.citiesList);
          setCitiesList(sortedCitiesList);
        } else {
          setLoading(false);
        }
      })
  }
  const handleDateChange = (_date: any,dateString:string | string[]) => { 
    setExpiryDate(dateString);
  }
  const validateBusinessName = (e: any) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    form.setFieldsValue({ businessName: result });
  };
  const validateTypeOfBusiness = (e: any) => {
    const result: string = e.target.value.replace(OnlyText, "");
    form.setFieldsValue({ typeOfBusiness: result });
  };
  const validateNumber = (e: any) => {
    const result: number = e.target.value.replace(MobilNumberRegex, "");
    form.setFieldsValue({ phoneNumber: result });
  };
  const onCityChange = (value:any) =>{
    setSelectedCity(value);
    form.setFieldValue("cityCode",value);
  }
  const onFinish = (values: any) => {
    setLoading(true);

    const reqBody = {
      businessName:values?.businessName?.trim(),
      companyAddress1:values?.address1,
      companyAddress2:values?.address2,
      companyAddress3:values?.address3,
      phoneNumber:values?.phoneNumber,
      companyCity:values?.cityCode,
      companyState:values?.cityCode,
      companyCountry:values?.countryCode,
      postalCode:values?.postalCode,
      type:'business',
      typeOfBusiness:values?.typeOfBusiness,
      userAlias:userAlias,
      websiteUrl:values?.websiteUrl,
      trnNumber:values?.trnNumber,
      tradeLicenseExpiryDate: DateWithUtcOffset2(expiryDate),
      tradeLicenseNumber: values?.tradeLicenseNumber
    }
    updateKybAddress(reqBody)
    .then((res) => {
      setLoading(false);
      if ([201,200].includes(res.status)) {
        const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
        localStroragevalue.step = 6;
        setLocalStorage('auth',JSON.stringify(localStroragevalue))
   
        navigate(KYBVerificatioStep6,{state:{
          basic: params?.state?.basic,
          business:values,
          representativeDetails:params?.state?.representativeDetails,
          beneficialOwnerDetails:params?.state?.shareholders,
          shareholdersPayload : params?.state?.shareholdersPayload,
        }});
      }
    })
    .catch(() => {
      setLoading(false);
        message.error("Oops! Something went wrong. Please try again later!");
    });
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (ENTITY_TYPE !== 'company' || STEP !== 5) {
          navigate(-1);
        } else {
          setLoading(true);
          let selectedCountry =""
          let apiCallsCompleted = 0;
          const totalApiCalls = 3;

          const handleLoadingComplete = () => {
            apiCallsCompleted++;
            if (apiCallsCompleted === totalApiCalls) {
              setLoading(false);
            }
          };

          const kybDetailsPromise = fetchKybDetails(userAlias).then((res) => {
            const business = res.data?.data?.[0]?.business?.[0];
            const documents = res.data?.data?.[0]?.documents?.[0];
            setDocumentData(documents);
            sethaveregproof(documents?.businessRegProof?.[0]?.url ? 1 : 0);
            setRegProof(documents?.businessRegProof?.[0]?.url ? documents?.businessRegProof?.[0]?.fileName : {})
            selectedCountry = business?.companyCountry;
            setSelectedIsoCode(business?.companyCountry);
            setSelectedCity(business?.companyCity);
            setRepresentativeDetails(res.data?.data?.[0]?.representative?.[0]);
            setBeneficialOwnerDetails(res?.data?.data?.[0]?.shareholdersPayload);
            setBasicDetails(res.data?.data?.[0]?.basic?.[0]);
            setExpiryDate(dayjs.utc(business?.tradeLicenseExpiryDate).format("DD-MM-YYYY"));
            form.setFieldsValue({
              businessName: business?.businessName,
              address1: business?.companyAddress1,
              address2: business?.companyAddress2,
              address3: business?.companyAddress3,
              countryCode: business?.companyCountry,
              cityCode: business?.companyCity,
              postalCode: business?.postalCode,
              typeOfBusiness: business?.typeOfBusiness,
              websiteUrl: business?.websiteUrl,
              phoneNumber: business?.phoneNumber,
              trnNumber: business?.trnNumber,
              expiryDate: business?.tradeLicenseExpiryDate
                            ? dayjs.utc(business?.tradeLicenseExpiryDate)
                            : null,
              tradeLicenseNumber: business?.tradeLicenseNumber
            });
    
            if (!form.getFieldValue("phoneNumber")) {
              form.setFieldValue("phoneNumber", params?.state?.contactNumber);
              form.setFieldValue("phonecode", params?.state?.callingCode);
            }
    
            handleLoadingComplete();
            return selectedCountry;
          }).catch(() => {
            setLoading(false);
            throw new Error("Failed to fetch KYB details");
          });
    
          const allCountriesPromise = kybDetailsPromise.then((selectedCountry:any) => {
            return getAllCountries().then((response) => {
              setCountryCodes(response?.data);
              setSelectedIsoCode(selectedCountry);
              response.data.forEach((elem:any) => {
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
          await Promise.all([kybDetailsPromise, allCountriesPromise, citiesListPromise]);
    
          window.scrollTo(0, 0);
        }
      } catch (error) {
        message.error("Oops! Could not fetch details. Please try again later!");
        setLoading(false);
      }
    };

    fetchData();

  }, []);
  
  useEffect(() => {
    const businessName = form.getFieldValue("businessName");
    if (businessName !== companyName || companyName === undefined || companyName == "" || companyName === null) {
      if (businessName) {
        const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
        localStroragevalue.companyName = businessName;
        setLocalStorage('auth', JSON.stringify(localStroragevalue))
      }
    }
  }, [form.getFieldValue("businessName")]);

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
  const handleCancel =()=>{
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
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REPRESENTATIVE_OWNERS}</div><Image src={BlueTick} alt="tick" preview={false} />
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
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BENEFICIAL_OWNERS}</div><Image src={BlueTick} alt="tick" preview={false} />
        </span>
      ),
      children: (<>
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
        <span className="step1 activeBtn pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BUSINESS_DETAILS}</div>
        </span>
      ),
      showArrow:false,
    },
    {
      key: '5',
      label: (
        <span className="pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div>
        </span>
      ),
      showArrow:false,
    },
    {
      key: '6',
      label: (
        <span className="pl--24px">
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
    form.setFieldValue("phoneNumber", newValue);
  };
  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };

  const validatePOBox = (_:any, value:any, callback:any) => {
    if (!value) {
      callback('P.O. box is required!');
    } else if (!/^[0-9]+$/.test(value)) {
      callback('P.O. box should only contain numbers.');
    } else if (value.length < 4) {
      callback('P.O. box should have at least 4 digits.');
    } else if (value.length > 6) {
      callback('P.O. box should have at most 6 digits.');
    } else {
      callback();
    }
  }
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

  const handleInput = (e: any, fieldname: string) => {
    const regex = /^[a-zA-Z0-9\s,\/#?\-\.]*$/; 
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
    }
  };

  const validateSpecialCharFields = (value: any) => {
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    return Promise.resolve();
  };

  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const uploadRegDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file,"")
      if(checkBeforeUpload == true){
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          businessRegProof: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState:any) =>({
          ...prevState,
          docFront:""
          }))
      return true;
      }
      else{
        setUploadLoading(false);
        setUploadError((prevState:any) =>({
          ...prevState,
          docFront:checkBeforeUpload
          }))
        return false
      }
    },

    onChange: (info: any) => {
      const { status} = info?.file ?? { status : ""};

      if (status !== "uploading") {
        setUploadLoading(false);
        setDocumentData({
          ...documentData,
          businessRegProof: [
            {
              loading: false,
              url: "",
            },
          ],
        });
        sethaveregproof(info?.fileList?.length ? 1 : 0);
      }

      if (status === "done") {
        
        if (info?.file?.response?.data?.key) {
          setUploadLoading(true);
          userKyc({
            fileName: info?.file?.response?.data?.key,
            userAlias: userAlias,
          })
            .then(async(res:any) => {
              setDocumentData({
                ...documentData,
                businessRegProof: [info?.file?.response?.data],
              });
              sethaveregproof(1);
              setRegProof(info);
              let finalList = [];
              const filtered = res?.data?.data?.wordList.filter(function (el: any) {
                return el != null;
              });
              finalList = filtered;
              const companyName = finalList && finalList?.length > 0 ? getCompanyNameFromDocument(finalList) : "";
        
              if (companyName) {
                form.setFieldsValue({
                  businessName: companyName
                })
              }else{
                form.setFieldsValue({
                  businessName: ""
                })
              }
              setUploadLoading(false);
            })
            .catch(() => {
              const fileData = info?.file?.response?.data;
              if (fileData) {
                setDocumentData({
                  ...documentData,
                  businessRegProof: [fileData],
                });
                sethaveregproof(1);
                setRegProof(info);
              }
              setUploadLoading(false);
              message.warning("OCR processing failed for this document. Please provide the company name manually.");
            });
        } else {
          setUploadLoading(false);
        }
      } else if (status === "error") {
        setUploadLoading(false);
        setDocumentData({
          ...documentData,
          businessRegProof: [
            {
              loading: false,
              url: "",
            },
          ],
        });
        sethaveregproof(0);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const uploadButton4 = (
    <div>
      {(regProof?.file?.name || typeof regProof == 'string') && (documentData?.businessRegProof?.[0]?.status !== "REJECTED") ? (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}
      <div style={{ marginTop: regProof?.file?.name || typeof regProof == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText_twoLines w-upload">
          {(documentData?.businessRegProof?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof regProof == 'string') ? regProof : regProof?.file?.name ? regProof?.file?.name : "Trade license"
          }
        </div>
      </div>
    </div>
  );
  const removeDocument = async (docType: DocumentType, id: string) => {
    const payload = {
      id,
      userAlias: userAlias,
      docType,
    };
    const addressproof = { ...documentData };
    const url = addressproof[docType][0].url;
    addressproof[docType] = [{ loading: true, url: '' }];
    setDocumentData({ ...addressproof });

    await deleteFile(payload)
      .then((response: any) => {
        if (response?.status === 201 || response?.status === 200) {
          addressproof[docType] = [];
          setDocumentData(addressproof);
          if (DocumentType.BusinessRegProof === docType) {
            sethaveregproof(0);
            setRegProof({});
          }
        }
      })
      .catch(() => {
        addressproof[docType] = [{ loading: false, url }];
        setDocumentData({ ...addressproof });
        message.error('Something went wrong. Please try again!');
      });
  };

  const handleImagePreview = (url: any) => {
    setImagUrl(url);
    setTimeout(() => {
      setImagePreviewModal(true);
    }, 500);
  }

  const handlePDFView =(url:any)=>{
    setImagUrl(url);
    setverifyVisible(true)
  }

  return (
    <div>
      {loading && (
        <div
          className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
        >
          <Spin size="large" className="mainloader"/>
        </div>
      )} 
      {ENTITY_TYPE === 'company' && STEP === 5 ? 
        <div>
        {uploadLoading == true && (
          <div
            className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
          >
            <Spin size="large" className="mainloader"/>
          </div>
        )}
      <UserHeader step={60} />
      <div className="text-right formSubText p-5">Step 5/7</div>
      {/* tabs for responsive */}
      <ResponsiveSidebar step={5} />
      <div className="d-flex center_res">
        <div className="px-5 verification_sidebar mb-5">
          <div className="slidebar-step-3-block">
            <Collapse items={items} bordered={false} />
            <div className="step_info p-50 d-flex mb-5">
              <Image src={InfoImg} alt="info" preview={false} className="mb-1" />
              Address is important for your identification
            </div>
          </div>
        </div>
        <div className="px-5 px-5-res w-half">
          <div className="d-flex step-title">
            <Image src={LeftArrow} alt="arrow" preview={false} className="cursor" onClick={()=>{goBack()}} />
            <div className="titleText  px-3 px-md-5">Business details</div>
          </div>
          <Form form={form} scrollToFirstError onFinish={onFinish} className="basic-info-form-block mb-4">
            <div className="stepDetails_medium">Business documents</div>
            <Row className="mt-4">
              <div className="d-flex w-100">
                <div className="stepDetails_medium upload_address">
                  Trade license
                </div>
              </div>
            </Row>
            <Row className="">
              <div className="mt-4 d-flex flex-column flex-sm-row ml-10-res sub-doc-upload-row trade-licence-proof">
                <div className="doc-block">
                  <Upload
                    disabled={uploadLoading}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    maxCount={1}
                     accept={acceptedFileExtension}
                    {...uploadRegDoc}
                    {...{
                      data: {
                        businessType: "businessRegProof",
                        type: "documents",
                        userAlias: userAlias,
                      },
                    }}
                  >
                    {uploadButton4}
                  </Upload>
                  {regProof?.file?.name || typeof regProof == 'string' ? (
                    <div className="view-delete-res-icon mt-1">
                      {documentData?.businessRegProof?.[0]?.url &&
                        !documentData?.businessRegProof?.[0]?.loading && (
                          documentData?.businessRegProof?.[0]?.url &&
                            documentData?.businessRegProof?.[0]?.url.includes(".pdf") ? (
                            <span className="d-flex endtoend p-1">
                                <div className="blue_text cursor" onClick={() => {handlePDFView(documentData?.businessRegProof?.[0]?.url)}}>
                                      <Image
                                        preview={false}
                                        src={Pdf} alt="view"
                                      /> <span className="px-1" >View</span>
                                </div>
                              {documentData?.businessRegProof?.[0]?.status !==
                                "VERIFIED" && (
                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.BusinessRegProof, documentData?.businessRegProof?.[0]?.id)} className="cursor" />
                                )}
                            </span>
                          ) : (
                            <>
                              <div className="d-flex endtoend p-1">
                                <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.businessRegProof?.[0]?.url) }}>
                                  <Image
                                    preview={false}
                                    src={BlueEye} alt="view"
                                  /> <span className="px-1" >View</span>
                                </div>
                                {documentData?.businessRegProof?.[0]?.status !== "VERIFIED" && (
                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.BusinessRegProof, documentData?.businessRegProof?.[0]?.id)} className="cursor" />
                                )}
                                {documentData?.businessRegProof?.[0]?.status === "VERIFIED" && (
                                  <span className="text-green mb-2 ml-3rem">
                                    <CheckCircleOutlined /> Verified{" "}
                                  </span>
                                )}
                              </div>
                            </>
                          )
                        )}
                      {documentData?.businessRegProof?.[0]?.loading && (
                        <Spin indicator={Loader} className="ml-20" />
                      )}
                    </div>
                  ) : null}

                  {documentData?.businessRegProof?.[0]?.status === "REJECTED" && (
                    <Tooltip title={documentData?.businessRegProof?.[0]?.reason}>
                      <span className="rejectReasonText text-ellipsis mx-0 my-2">
                        Reason : {documentData?.businessRegProof?.[0]?.reason}
                      </span>
                    </Tooltip>
                  )}
                  {haveregproof != 1 && formTouched === true ? <div className="errMsg px-2">Proof required!</div> : ""}
                  <span className="uploaderror ant-form-item-explain-error">{uploadError?.docFront}</span>
                </div>
              </div>
              <div></div>
            </Row>
            <hr className="doc-seprator-line" />
            <Row className="">
              <div className="pr-25  w-100-res">
                <div className="subText_small mb-2 mt-2">Name of company as per trade license<span className="red">*</span></div>
                <InputText
                  fieldname="businessName"
                  className="inputField_large mb-4"
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
                >
                  <Input
                    type="text"
                    placeholder="Enter the name of business"
                    prefix={
                      <span className="inputGlobe hw-18">
                        <Image
                          src={Job}
                          alt="address"
                          className="me-3 "
                          preview={false}
                        />
                      </span>
                    }
                    onChange={validateBusinessName}
                    maxLength={50}
                  />
                </InputText>
              </div>
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">Trade License Number <span className="red">*</span></div>
                <InputText
                  fieldname="tradeLicenseNumber"
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
                      message: "Trade license number is required!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter license number"
                    prefix={
                      <span className="inputGlobe hw-18">
                        <Image
                          src={Doc}
                          alt="license-number"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                  />
                </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25  w-100-res">
                <div className="subText_small mb-2 mt-2">License expiry date <span className="red">*</span></div>
                <Form.Item
                  name="expiryDate"
                  className="inputField"
                  rules={[
                    {
                      required: true,
                      message: "Expiry date is required!",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={handleDateChange}
                    format={{
                      format: 'DD-MM-YYYY',
                      type: 'mask',
                    }}
                    placeholder="Select expiry date"
                    disabledDate={(current:any)=>{
                      return current && current.valueOf() < Date.now()
                    }}
                  />
                </Form.Item>
              </div>
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">Nature of business <span className="red">*</span></div>
                <InputText
                  fieldname="typeOfBusiness"
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
                      message: "Business type is required!",
                    },
                    {
                      whitespace: true,
                      message: "Business type valid address!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter the nature of business"
                    prefix={
                      <span className="inputGlobe hw-18">
                        <Image
                          src={Job}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    onChange={validateTypeOfBusiness}
                    maxLength={50}
                  />
                </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">Website URL</div>
                <InputText
                  fieldname="websiteUrl"
                  className="inputField mb-4"
                >
                  <Input
                    type="text"
                    placeholder="Enter URL"
                    prefix={
                      <span className="inputGlobe hw-18">
                        <Image
                          src={Globe}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                  />
                </InputText>
              </div>
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">
                Building name and flat number or villa number<span className="red">*</span>
                </div>
                <InputText
                  fieldname="address1"
                  className={`inputField mb-4 ${fieldClassNames.address1}`}
                  rules={[
                    {
                      required: true,
                      message: "Building name & flat number/villa number is required!",
                    },
                    {
                      validator: async (_: any, value: any) => {
                        return validateSpecialCharFields(value);
                      }
                    },
                    {
                      whitespace: true,
                      message: "Enter valid address!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Address 1 *"
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
            </Row>
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">
                Street name and nearest landmark<span className="red">*</span>
                  </div>
                <InputText
                  fieldname="address2"
                  className={`inputField mb-4 ${fieldClassNames.address2}`}
                  rules={[
                    {
                      required: true,
                      message: "Street name and nearest landmark is required!",
                    },
                    {
                      validator: async (_: any, value: any) => {
                        return validateSpecialCharFields(value);
                      }
                    },
                    {
                      whitespace: true,
                      message: "Enter valid address!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Address 2 *"
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
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">
                Area name<span className="red">*</span>
                  </div>
                <InputText
                  fieldname="address3"
                  className={`inputField mb-4 ${fieldClassNames.address3}`}
                  rules={[
                    {
                      required: true,
                      message: "Area name is required!",
                    },
                    {
                      validator: async (_: any, value: any) => {
                        return validateSpecialCharFields(value);
                      }
                    },
                    {
                      whitespace: true,
                      message: "Enter valid area name!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Address 3 *"
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
            </Row>
            <Row>
              <div className="pr-25  w-100-res">
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
                      allowClear
                      className="w-75 h-100 pt-1"
                      showSearch
                      optionFilterProp="children"
                    >
                      {countryCodes.map((item: any, index: any) => {
                        return item?.currency?.status == "active" ? (
                          <Option key={index} value={item?.isoCode}>
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
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">Mobile number <span className="red">*</span></div>
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
                    onChange={validateNumber}
                    maxLength={10}
                    onBlur={handleBlur}
                    onKeyPress={(e) => {
                      checkNumberInput(e);
                      handleBlur(e);
                    }}
                  />
                </Form.Item>
              </div>
            </Row>
            <Row>
              <div className="pr-25  w-100-res">
                <div className="subText_small mb-2 mt-2">City <span className="red">*</span></div>
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
                   <span className="global">
                      <FileSearchOutlined className="prefix mt-2"/>
                    </span>
                  <Select
                    showSearch
                    allowClear
                    placeholder="Search for city"
                    className="w-75 h-100 pt-1"
                    onSearch={onCitySearch}
                    onChange={onCityChange}
                    optionFilterProp="children"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    value={selectedCity}
                  >
                    {citiesList.map((city:any, idx:any) => (
                      <Option key={idx} value={city.code}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                </InputText>
              </div>
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">PO Box<span className="red">*</span></div>
                <InputText
                  fieldname="postalCode"
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
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
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">TRN number (Optional)</div>
                <InputText
                  fieldname="trnNumber"
                  className="inputField mb-4"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Enter valid TRN no.!",
                  //   },
                  //   {
                  //     whitespace: true,
                  //     message: "Enter valid TRN no.!",
                  //   },

                  // ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter the TRN number"
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
                    maxLength={15}
                  />
                </InputText>
              </div>
            </Row>
            <Row className="center_res">
              <div className="d-flex">
                {documentData?.businessRegProof && documentData?.businessRegProof?.[0]?.url && documentData?.businessRegProof?.[0]?.status !== "REJECTED"
                  ? (
                    <>
                      <Button className="rounded" htmlType="submit" onClick={() => { setformTouched(true) }} disabled={uploadLoading} loading={loading}>
                        {uploadLoading ? "Please wait..." : "Save & Next"}
                      </Button>
                      <Button className="rounded_cancel mx-4" onClick={handleCancel}>Reset</Button>
                    </>
                  ) : (
                    <>
                      <Button className="rounded disabled loading-submit-btn" loading={uploadLoading}>
                        {uploadLoading ? "Please wait..." : "Save & Next"}
                      </Button>
                      <Button className="rounded_cancel mx-4" onClick={handleCancel}>Reset</Button>
                    </>
                  )
                }
              </div>
            </Row>
          </Form>
        </div>
      </div>
        {/** Image Preview Modal */}
        <ImagePreviewModal
        imagePreviewModal={imagePreviewModal}
        setImagePreviewModal={setImagePreviewModal}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
      <PdfPreviewModal
      isverifyVisible={isverifyVisible}
      setverifyVisible={setverifyVisible}
      imagUrl={imagUrl}
      setImagUrl={setImagUrl}
      />
    </div> : "" }
    </div>
  );
};

export default CompanyStep5;
