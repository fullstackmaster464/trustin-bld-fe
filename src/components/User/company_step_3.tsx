import { Button, Form, Image, Input, Radio, Row, Select, message, Collapse, Col, Typography, DatePicker, Upload, Spin, Tooltip } from "antd";
import UserHeader from "./UserHeader";
import { useEffect, useState } from "react";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import { InputText } from "../ui-elements/InputsRepo";
import { Option } from "antd/lib/mentions";
import Mobile from "../../assets/img/Mobile.svg";
import User from "../../assets/img/User_Full.svg";
import Doc from "../../assets/img/id.svg";
import Role from "../../assets/img/role.svg";
import InfoImg from "../../assets/img/info.svg";
import BlueTick from "../../assets/img/blue_tick.svg";
// import { getAllCountries } from "../../services/masterData";
import { useLocation, useNavigate } from "react-router-dom";
import { KYBVerificatioStep2, KYBVerificatioStep4 } from "../Common/RouteConst";
import ResponsiveSidebar from "./SidebarResponsiveCompany";
import { KYB_VERIFICATION_STEPS_TITLE, OnlyText, acceptedFileExtension, beforeUploadFile, getLocalStorage, setLocalStorage, onlyNumberRegex, DOCUMENT_TYPE, alphanumericRegex, DateWithUtcOffset2 } from "../Common/Constants";
import { 
  deleteFile, 
  // extractTextFromImage, 
  getIdNumberFromDocument, 
  getUserNameFromDocument, 
  getUserNameFromPassport, 
  getUserPassportNumber, 
  // readImageData, 
  updateRepresentative, 
  updateUserName, 
  userKyc } from "../../services/user";
import { fetchKybDetails, getRiskConfiguration, getUserData } from "../../services/admin";
import type { CollapseProps } from 'antd';
import moment from "moment";
import dayjs from "dayjs";
import Tick from "../../assets/img/circle_orange.svg";
import Doc_large from "../../assets/img/Doc_large.svg";
import { CheckCircleOutlined, LoadingOutlined, PercentageOutlined,DownloadOutlined } from "@ant-design/icons";
import Pdf from "../../assets/img/pdfview.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import Delete from "../../assets/img/delete.svg";
import ImagePreviewModal from "../Models/ImagePreviewModal";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import { ViewButton } from "../ui-elements/ButtonRepo";
import LOAFormatFromOnePartnerToAnother from "../../assets/document/LOAFormatFromOnePartnerToAnother.docx"
import LOAFormatRepresentative from '../../assets/document/LOAFormatRepresentative.docx';
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

// interface DocumentData {
//   representativeDoc?: any[] | any;
//   representativeIdDoc?: any[] | any;
// }

// enum DocumentType {
//   RepresentativeDoc = 'representativeDoc',
//   RepresentativeIdDoc = 'representativeIdDoc'
// }
enum DocumentType {
  RepAddProof = 'repAddProof',
  RepDocFront = 'repDocFront',
  RepDocBack = 'repDocBack',
  BusinessRegProof = 'businessRegProof',
  BusinessAddProof = 'businessAddProof',
  AuthorizationDoc = 'authorizationDoc'
}
interface DocumentData {
  repAddProof?: any[] | any;
  repDocFront?: any[] | any;
  repDocBack?: any[] | any;
  businessRegProof?: any[] | any;
  businessAddProof?: any[] | any;
  authorizationDoc?: any[] | any;
}

const CompanyStep3 = ():any => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // const [countryCodes, setCountryCodes] = useState([]);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const local:any = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const Token = local ? JSON.parse(local)?.token : "";
  const params = useLocation();
  const ENTITY_TYPE = JSON.parse(getLocalStorage("auth")!)?.entityType
  const STEP = JSON.parse(getLocalStorage("auth")!)?.step;
  const userName = local ? JSON.parse(local)?.name : "";
  const UserEmail = JSON.parse(getLocalStorage("auth")!)?.email;
  const [uploadError,setUploadError] = useState<any>({
    emiratesFront:"",
    emiratesBack:"",
    address:"",
    authorization:""
  })

  const { Paragraph } = Typography;

  const [basicDetails, setBasicDetails] = useState<BasicDetails>({});
  // const [selectedIsoCode, setSelectedIsoCode] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [birthDate, setBirthDate] = useState<any>({});
  const [docExpiryDate, setDocExpiryDate] = useState<any>({});
  const [documentData, setDocumentData] = useState<DocumentData>();
  const [formTouched, setformTouched] = useState(false);
  // const [representativeDoc, setRepresentativeDoc] = useState<any>({});
  // const [representativeIdDoc, setRepresentativeIdDoc] = useState<any>({});
  const [uploadLoading, setUploadLoading] = useState(false);
  // const [haveUploadRepresentativeDoc, setHaveUploadRepresentativeDoc] = useState(0);
  // const [haveUploadRepresentativeIdDoc, setHaveUploadRepresentativeIdDoc] = useState(0);
  const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [imagePreviewModal, setImagePreviewModal] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const [businessControlValue, setBusinessControlValue] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [frontFile, setFrontFile] = useState<any>({});
  const [backFile, setBackFile] = useState<any>({});
  const [addressFile, setAddressFile] = useState<any>({});
  const [authorizationDoc, setAuthorizationDoc] = useState<any>({});
  const [authorizationToggle, setAuthorizationToggle] = useState(false);

  const [haveuploaddocfront, sethaveuploaddocfront] = useState(0);
  const [haveuploaddocback, sethaveuploaddocback] = useState(0);
  // const [haveaddressproof, sethaveaddressproof] = useState(0);
  const [haveuploaddocauthorizationdoc, sethaveuploaddocauthorizationdoc] = useState(0);
  const [representativeShareData, setRepresentativeShareData] = useState(0);
  const [nationalityId, setNationalityId] = useState("NATIONAL_ID");
  const [corporateShareholder, setCorporateShareholder] = useState(false);
  const [companyShareholdingPercentageData, setCompanyShareholdingPercentageData] = useState(0);
  const [country, setCountry] = useState("");
  const [selectedNationality, setSelectedNationality] = useState<string | null>(null);


  const onChange = (e: any) => {
    setValue(e.target.value);
    if (e.target.value === true) {
      setAuthorizationToggle(false);
      setBusinessControlValue("Yes");
    } else {
      setAuthorizationToggle(true);
      setBusinessControlValue("No");
    }
    form.validateFields(['representativeShare']);
  };
  const onChangeCorporateShareholder = (e: any) => {
    setCorporateShareholder(e?.target?.value);
  };

  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 2;
    setLocalStorage('auth',JSON.stringify(localStroragevalue))
    navigate(KYBVerificatioStep2);
  }

  // const handleCountryChange = (value: string) => {
  //   setSelectedIsoCode(value);
  //   form.setFieldsValue({
  //     nationality: value,
  //   });
  // };
  const handleRole = (value: string) => {
    setSelectedRole(value);
    form.setFieldsValue({
      roleType: value,
    });
  };
  const handleRhareholdingsPercentage = (value: any) => {
    setRepresentativeShareData(value);
    form.setFieldsValue({
      representativeShare: value,
    });
  }
  const handleCompanyShareholdingPercentage = (value: any) => {
    setCompanyShareholdingPercentageData(value);
    form.setFieldsValue({ companyShareholdingPercentage: value });
  }
  const onFinish = async(values: any) => { 
    
  
    setLoading(true) 
    const reqBody = {
      type: "representative",
      userAlias: userAlias,
      representativeName: values?.representativeName,
      nationality: values?.nationality,
      sharedOwnership: value,
      roleType: values?.roleType,
      representativeShare: values?.representativeShare,
      representativeDob: DateWithUtcOffset2(birthDate),
      repDocExpiryDate: DateWithUtcOffset2(docExpiryDate),
      repDocType: nationalityId,
      repDocNumber: values?.repDocNumber,
      isCorporateShareholder:corporateShareholder,
      companyShareholdingPercentage:companyShareholdingPercentageData,
      // documentAccuracyPercentage:accuracy
    }

    const reqObj = {
      userAlias: userAlias,
      name: values?.representativeName,
    }
    if (value && documentData?.authorizationDoc?.[0]?.id) {
      try {
        await removeDocument(DocumentType.AuthorizationDoc, documentData?.authorizationDoc?.[0]?.id);
        setLoading(false);
      } catch (error) {
        message.error("There was an issue removing the old authorization document. Please try again.");
        setLoading(false);
      }

    }

    updateUserName(reqObj).then((response) => {
      if ([200, 201].includes(response?.status) && response?.data?.affected > 0) {
        updateRepresentative(reqBody)
          .then((res) => {
            setLoading(false);
            if (res.status === 201 || res.status === 200) {
              const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
                localStroragevalue.step = 4;
                setLocalStorage('auth', JSON.stringify(localStroragevalue))
                navigate(KYBVerificatioStep4, {
                  state: {
                    formValues: values,
                    basic: params?.state
                  }
                });
            }
          })
          .catch(() => {
            setLoading(false);
            message.error("Oops! Something went wrong. Please try again later!");
          });
      }
    }).catch(() => {
      setLoading(false);
        message.error("Oops! Something went wrong. Please try again later!");
    });

  };
  const validateName = (e: any) => {
    const result: string = e.target.value.replace(OnlyText, "");
    form.setFieldsValue({ representativeName: result });
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.name = result;
    setLocalStorage('auth',JSON.stringify(localStroragevalue))
  };
  const validateDocNumber = (e:any) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    form.setFieldsValue({ repDocNumber: result });
  }

  const handleDateChange = (_date: any, dateString: string | string[]) => {
    setBirthDate(dateString);
  }
  const handleExpiryDateChange = (_date: any, dateString: string | string[]) => {
    setDocExpiryDate(dateString)
  }
  const fetchData = async () => {
    if(ENTITY_TYPE !== 'company' || STEP !== 3){
      navigate(-1)
    }
    else{
    setLoading(true);
    // getAllCountries()
    //   .then((response: any) => {
    //     setCountryCodes(response?.data);
    //   })
    await getRiskConfigurationDetails();
    fetchKybDetails(userAlias)
      .then((res) => {
        const representative = res.data?.data?.[0]?.representative?.[0];
        const documents = res.data?.data?.[0]?.documents?.[0];
        setBasicDetails(res.data?.data?.[0]?.basic?.[0]);
        setSelectedNationality(representative?.nationality); 

        // setSelectedIsoCode(representative?.nationality);
        setSelectedRole(representative?.roleType);
        setBirthDate(dayjs.utc(res?.data?.data?.[0]?.representative?.[0]?.representativeDob).format("DD-MM-YYYY"));
        setDocExpiryDate(dayjs.utc(res?.data?.data?.[0]?.representative?.[0]?.repExpiryDate).format("DD-MM-YYYY"));
        // setDocumentData({ representativeDoc: res?.data?.data?.[0]?.representative?.[0]?.representativeDoc , representativeIdDoc: res?.data?.data?.[0]?.representative?.[0]?.representativeIdDoc});
        // setRepresentativeDoc(res?.data?.data?.[0]?.representative?.[0].representativeDoc?.[0]?.url ? res.data?.data?.[0]?.representative?.[0]?.representativeDoc?.[0]?.fileName : {});
        // setRepresentativeIdDoc(res?.data?.data?.[0]?.representative?.[0].representativeIdDoc?.[0]?.url ? res?.data?.data?.[0]?.representative?.[0]?.representativeIdDoc?.[0]?.fileName : {});
        // setHaveUploadRepresentativeDoc(res?.data?.data?.[0]?.representative?.[0]?.representativeDoc?.[0]?.url ? 1 : 0);
        // setHaveUploadRepresentativeIdDoc(res?.data?.data?.[0]?.representative?.[0]?.representativeIdDoc?.[0]?.url ? 1 : 0);
        
        form.setFieldsValue({
          representativeName: representative?.representativeName,
          nationality: representative?.nationality,
          businessControlValue: representative?.sharedOwnership ? representative?.sharedOwnership : false,
          representativeDob: representative?.representativeDob ? dayjs.utc(representative?.representativeDob) : "",
          repDocExpiryDate: representative?.repExpiryDate ? dayjs.utc(representative?.repExpiryDate) : "",
          repDocNumber: representative?.repDocNumber,
          roleType: representative?.roleType,
          representativeShare: representative?.representativeShare,
          isCorporateShareholder: representative?.isCorporateShareholder ? representative?.isCorporateShareholder : false,
          companyShareholdingPercentage:representative?.companyShareholdingPercentage,
        });
        setCorporateShareholder(representative?.isCorporateShareholder ? representative?.isCorporateShareholder : false)
        setCompanyShareholdingPercentageData(representative?.companyShareholdingPercentage)
        handleRole(representative?.roleType)
        setValue(representative?.sharedOwnership ? representative?.sharedOwnership : false)
        setBusinessControlValue(representative?.sharedOwnership && representative?.sharedOwnership === true ? "Yes" : "No")
        setAuthorizationToggle(representative?.sharedOwnership && representative?.sharedOwnership === true ? false : true)
  
        if (documents) {
          setDocumentData(documents);
          setNationalityId(documents?.repDocType ? documents?.repDocType : "NATIONAL_ID")
          sethaveuploaddocfront(documents?.repDocFront?.[0]?.url ? 1 : 0);
          sethaveuploaddocback(documents?.repDocBack?.[0]?.url ? 1 : 0);
          // sethaveaddressproof(documents?.businessAddProof?.[0]?.url ? 1 : 0);
          setFrontFile(documents?.repDocFront?.[0]?.url ? documents?.repDocFront?.[0]?.fileName : {})
          setBackFile(documents?.repDocBack?.[0]?.url ? documents?.repDocBack?.[0]?.fileName : {})
          setAddressFile(documents?.repAddProof?.[0]?.url ? documents?.repAddProof?.[0]?.fileName : {})
          setAuthorizationDoc(documents?.authorizationDoc?.[0]?.url ? documents?.authorizationDoc?.[0]?.fileName : {});
          sethaveuploaddocauthorizationdoc(documents?.authorizationDoc?.[0]?.url ? 1 : 0);
        }
        setLoading(false)
      })
      .catch(() => {
        message.error("Oops! Could not fetch details. Please try again later!");
      });
      window.scrollTo(0, 0);
    }
  }

  useEffect(() => {
    fetchData(); 
    }, []);
  const handleCancel =()=>{
    form.resetFields();
  }

  useEffect(() => {
    if (userName === undefined || userName == "" || userName === null) {
      const docName = form.getFieldValue("representativeName");
      if (docName) {
        const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
        localStroragevalue.name = docName;
        setLocalStorage('auth',JSON.stringify(localStroragevalue))
      }
    }
  }, [form.getFieldValue("representativeName")]);

  useEffect(() => {
    getUserData(UserEmail)
      .then((response: any) => {
        setCountry(response?.data?.countryName);
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later!");
      });
  }, []);

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
          {generateRow({ icon: Country, text: params?.state?.country ? params?.state?.country : basicDetails?.country })}
          {generateRow({ icon: Mobile, text: (params?.state?.callingCode && params?.state?.basic?.contactNumber) ? `${params?.state?.callingCode} ${params?.state?.contactNumber} ` : `${basicDetails?.callingCode} ${basicDetails?.contactNumber}` })}
      </>),
    },
    {
      key: '2',
      label: (
        <span className="step1 activeBtn pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REPRESENTATIVE_OWNERS}</div>
        </span>
      ),
      showArrow: false
    },
    {
      key: '3',
      label: (
        <span className="pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BENEFICIAL_OWNERS}</div>
        </span>
      ),
      showArrow: false
    },
    {
      key: '4',
      label: (
        <span className="pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BUSINESS_DETAILS}</div>
        </span>
      ),
      showArrow: false
    },
    {
      key: '5',
      label: (
        <span className="pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div>
        </span>
      ),
      showArrow: false,
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
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  // const uploadRepresentativeDoc = {
  //   name: "file",
  //   headers: {
  //     authorization: `Bearer ${Token}`,
  //   },
  //   action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
  //   beforeUpload: (file: any) => {
  //     const isJpgOrPng: boolean = ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type);
  //     const isLt2M: boolean = file.size / 1024 / 1024 <= 2;

  //     if (!isJpgOrPng) {
  //       message.error("You can only upload Image or PDF file!");
  //       return false;
  //     }

  //     if (!isLt2M) {
  //       message.error("Image must be smaller than 2MB!");
  //       return false;
  //     }

  //     return true;
  //   },
  //   onChange: (info: any) => {
  //     setUploadLoading(true);
  //     setLoading(true);
  //     setDocumentData({
  //       ...documentData,
  //       representativeDoc: [{ url: "", loading: true }],
  //     });

  //     const { status, response } = info.file;

  //     if (status !== "uploading") {
  //       setUploadLoading(false);
  //       setLoading(false);
  //       setHaveUploadRepresentativeDoc(info.fileList?.length ? 1 : 0);
  //     }

  //     if (status === "done") {
  //       if ([200, 201].includes(response?.statusCode || response?.status)) {
  //         setUploadLoading(false);
  //         setLoading(false);
  //         setHaveUploadRepresentativeDoc(1);

  //         if (validateFile(info)) {
  //           setRepresentativeDoc(info);
  //         }
  //       }

  //       if (info.file.response?.data.key) {
  //         setDocumentData({
  //           ...documentData,
  //           representativeDoc: [info.file.response.data],
  //         });
  //       }
  //     } else if (status === "error") {
  //       setUploadLoading(false);
  //       setLoading(false);
  //       setHaveUploadRepresentativeDoc(0);
  //       setDocumentData({
  //         ...documentData,
  //         representativeDoc: [{ loading: false }],
  //       });
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  const validateFile = (file: any) => {
    const data = file.file;
    const isLt5M: boolean = data.size / 1024 / 1024 <= 5;

    return isLt5M;
  };

  // const uploadButton = (
  //   <div>
  //     {(representativeDoc?.file?.name || typeof representativeDoc === 'string') && documentData?.representativeDoc?.[0]?.status !== "REJECTED" && (
  //       <div className="endtoend mt-3">
  //         <div></div>
  //         <Image
  //           src={Tick}
  //           alt="circle"
  //           className="tick_upload"
  //           preview={false}
  //         />
  //       </div>
  //     )}

  //     <div style={{ marginTop: (representativeDoc?.file?.name || typeof representativeDoc === 'string') ? -12 : 27 }}>
  //       <Image src={Doc_large} alt="passport" preview={false} />
  //       <div className="mt-3 subText_xs overflowText w-upload">
  //         {documentData?.representativeDoc?.[0]?.status === "REJECTED" ? (
  //           <span className="rejectReasonText">Re-upload</span>
  //         ) : typeof representativeDoc === 'string' ? (
  //           representativeDoc
  //         ) : representativeDoc?.file?.name ? (
  //           representativeDoc?.file?.name
  //         ) : (
  //           "Representative documents"
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
 
  // const uploadButton1 = (
  //   <div>
  //     {(representativeIdDoc?.file?.name || typeof representativeIdDoc === 'string') && documentData?.representativeIdDoc?.[0]?.status !== "REJECTED" && (
  //       <div className="endtoend mt-3">
  //         <div></div>
  //         <Image
  //           src={Tick}
  //           alt="circle"
  //           className="tick_upload"
  //           preview={false}
  //         />
  //       </div>
  //     )}

  //     <div style={{ marginTop: (representativeIdDoc?.file?.name || typeof representativeIdDoc === 'string') ? -12 : 27 }}>
  //       <Image src={Doc_large} alt="passport" preview={false} />
  //       <div className="mt-3 subText_xs overflowText w-upload">
  //         {documentData?.representativeIdDoc?.[0]?.status === "REJECTED" ? (
  //           <span className="rejectReasonText">Re-upload</span>
  //         ) : typeof representativeIdDoc === 'string' ? (
  //           representativeIdDoc
  //         ) : representativeIdDoc?.file?.name ? (
  //           representativeIdDoc?.file?.name
  //         ) : (
  //           "Representative Id documents"
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
  // const uploadRepresentativeIdDoc = {
  //   name: "file",
  //   headers: {
  //     authorization: `Bearer ${Token}`,
  //   },
  //   action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
  //   beforeUpload: (file: any) => {
  //     const isJpgOrPng: boolean = ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type);
  //     const isLt2M: boolean = file.size / 1024 / 1024 <= 2;

  //     if (!isJpgOrPng) {
  //       message.error("You can only upload Image or PDF file!");
  //       return false;
  //     }

  //     if (!isLt2M) {
  //       message.error("Image must be smaller than 2MB!");
  //       return false;
  //     }

  //     return true;
  //   },
  //   onChange: (info: any) => {
  //     setUploadLoading(true);
  //     setLoading(true);
  //     setDocumentData({
  //       ...documentData,
  //       representativeIdDoc: [{ url: "", loading: true }],
  //     });

  //     const { status, response } = info.file;

  //     if (status !== "uploading") {
  //       setUploadLoading(false);
  //       setLoading(false);
  //       setHaveUploadRepresentativeIdDoc(info.fileList?.length ? 1 : 0);
  //     }

  //     if (status === "done") {
  //       if ([200, 201].includes(response?.statusCode || response?.status)) {
  //         setUploadLoading(false);
  //         setLoading(false);
  //         setHaveUploadRepresentativeIdDoc(1);

  //         if (validateFile(info)) {
  //           setRepresentativeIdDoc(info);
  //         }
  //       }

  //       if (info.file.response?.data.key) {
  //         setDocumentData({
  //           ...documentData,
  //           representativeIdDoc: [info.file.response.data],
  //         });
  //       }
  //     } else if (status === "error") {
  //       setUploadLoading(false);
  //       setLoading(false);
  //       setHaveUploadRepresentativeIdDoc(0);
  //       setDocumentData({
  //         ...documentData,
  //         representativeIdDoc: [{ loading: false }],
  //       });
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };


  // const removeDocument = async (docType: DocumentType, id: string) => {
  //   const payload = {
  //     id,
  //     userAlias: userAlias,
  //     docType,
  //   };

  //   let addressproof = { ...documentData };
  //   const url = addressproof[docType][0].url;

  //   addressproof[docType] = [{ loading: true, url: '' }];
  //   setDocumentData({ ...addressproof });
  //   setLoading(true);
  //   await deleteFile(payload)
  //     .then((response: any) => {
  //       if (response?.status === 201 || response?.status === 200) {
  //         setLoading(false);
  //         addressproof[docType] = [];
  //         setDocumentData(addressproof);
  //         if (docType == DocumentType.RepresentativeDoc) {
  //           setHaveUploadRepresentativeDoc(0);
  //           setRepresentativeDoc({});
  //         }else if (docType == DocumentType.RepresentativeIdDoc) {
  //           setHaveUploadRepresentativeIdDoc(0);
  //           setRepresentativeIdDoc({});
  //         }
  //       }
  //     }).catch(() => {
  //       setLoading(false);
  //       addressproof[docType] = [{ loading: false, url }];
  //       setDocumentData({ ...addressproof });
  //       message.error('Something went wrong. Please try again!');
  //     });
  // };

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
  const getRiskConfigurationDetails = async () => {
    setLoading(true);
    await getRiskConfiguration({ RiskCategory: "C" })
      .then((response) => {
        if (response?.data?.status === 201 || response?.data?.status === 200) {
          setLoading(false);
          if (response?.data?.result && response?.data?.result?.length) {
            const result = response?.data?.result
            const graphicRiskIndex = result.findIndex((d: any) => d.riskCategory == 'Geographic Risk')
            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes']?.map((r: any) => {
                if (r?.riskType == 'Nationality Partner 1') {
                  setCountryList(r?.riskItems || []);
                }
              })
            }
            return result
          }
        }
      }).catch((error) => {
        setLoading(false);
        message.error(error?.error?.message ? error?.error?.message : "Something went wrong");
      });
  }

  const uploadDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "")
      if(checkBeforeUpload == true){
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          repAddProof: [
            {
              url: "",
              loading: true,
            },
          ],
        });
        setUploadError((prevState:any) =>({
          ...prevState,
          address:""
          })) 
      return true;
      }
      else{
        setUploadLoading(false);
        setUploadError((prevState:any) =>({
          ...prevState,
          address:checkBeforeUpload
          })) 
        return false
      }
    },
    onChange: (info: any) => {
      const { status, response } = info.file;

      if (status !== "uploading") {
        setUploadLoading(false);
      }

      if (status === "done") {
        if (response?.statusCode || response?.status === 201 || response?.status === 200) {
          setUploadLoading(false);
          if (validateFile(info)) {
            setAddressFile(info);
          }
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            repAddProof: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  // const validatePassportText = (text: string): boolean => {
  //   return text.toLowerCase().includes('passport');
  // };
  // const [accuracy, setAccuracy] = useState<any>(0);
  // function parseEmiratesIDText(text: string): any {
  //   const NAME = "Name";
  //   const NATIONALITY = "United Arab Emirates";
  //   const lines = text.split('\n');
  //   const idNumber = lines.find((line: any) => line.includes("784")) || '';
  //   const nameLine = lines.find((line: any) => line.includes(NAME)) || '';
  //   const nationality = lines.find((line: any) => line.includes(NATIONALITY)) || '';

  //   return {
  //     idNumber: [idNumber.trim()],
  //     name: nameLine.trim(),
  //     nationality: [nationality.trim()]
  //   };
  // }
  // const validateEmiratIDText = (text: any): boolean => {
  //   const data = parseEmiratesIDText(text);

  //   const EXPECTED_ID_NUMBER = "784";
  //   const NAME_INDICATORS = ["Name:", "Name :"];
  //   const EXPECTED_NATIONALITY = "United Arab Emirates";

  //   const isIDNumberValid = data.idNumber.some((id: any) => id.includes(EXPECTED_ID_NUMBER));
  //   const isNameValid = NAME_INDICATORS.some((validName: any) => data.name.includes(validName));
  //   const isNationalityValid = data.nationality.some((nat: any) => nat.includes(EXPECTED_NATIONALITY));

  //   const validChecksCount = [isIDNumberValid, isNameValid, isNationalityValid].filter(Boolean).length;
  //   return validChecksCount >= 2;
  // }

  const uploadFrontDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: async (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "")
      // if (!file || file.type !== "application/pdf") { 
      //   if (nationalityId == "PASSPORT") {
      //     setUploadLoading(true);
      //     const imageData = await readImageData(file);
      //     const extractedText = await extractTextFromImage(imageData);
      //     setAccuracy(extractedText?.averageAccuracy);
      //     const isPassport = validatePassportText(extractedText?.text);
      //     if (!isPassport) {
      //       setUploadLoading(false);
      //       message.error('Please upload a valid passport document.');
      //       return Upload.LIST_IGNORE; // Prevent upload
      //     }
      //   }
      //   if (nationalityId === "EMIRATES_ID" || nationalityId === "NATIONAL_ID") {
      //     setUploadLoading(true);
      //     const extractedText = await extractTextFromImage(file);
      //     setAccuracy(extractedText?.averageAccuracy);
      //     const isEmiratesId = validateEmiratIDText(extractedText?.text);
      //     if (!isEmiratesId) {
      //       setUploadLoading(false);
      //       message.error('Please upload a valid emirates id document.');
      //       return Upload.LIST_IGNORE; // Prevent upload
      //     }
      //   }
      // }
      if (checkBeforeUpload) {
        setUploadError((prevState: any) => ({
          ...prevState,
          emiratesFront:""
        }))
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          repDocFront: [
            {
              url: "",
              loading: true,
            },
          ],
        });
        return true;
      } else{
        setUploadError((prevState:any) =>({
          ...prevState,
          emiratesFront:checkBeforeUpload
        }))
        setUploadLoading(false);
        return false;
      }
    },
    onChange: (info: any) => {   
      const { status } = info.file;
      if (status !== "uploading") {
        sethaveuploaddocfront(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        sethaveuploaddocfront(1);
        if (info?.file?.response?.data?.key) {
          userKyc({
            fileName: info?.file?.response?.data?.key,
            userAlias: userAlias,
          })
            .then((res) => {
              setUploadLoading(false);
              setDocumentData({
                ...documentData,
                repDocFront: [info?.file?.response?.data],
              });
              let finalList = [];
              const filtered = res?.data?.data?.wordList.filter(function (el: any) {
                return el != null;
              });
              finalList = filtered;
              for (let i = 1; i < filtered?.length; i++) {
                if (filtered[i].includes("-")) {
                  const getDocNo = filtered[i]
                    .split("-")
                    .toString()
                    .replace(",", "")
                    .replace(",", "")
                    .replace(",", "");
                  finalList.push(getDocNo);
                }
              }
              // setFrontDocData(finalList);
              let name;
              let docId;
              if (value == "PASSPORT") {
                name = finalList && finalList?.length > 0 ? getUserNameFromPassport(finalList) : "";
                docId = finalList && finalList?.length > 0 ? getUserPassportNumber(finalList) : "";
              } else {
                name = finalList && finalList?.length > 0 ? getUserNameFromDocument(finalList) : "";
                docId = finalList && finalList?.length > 0 ? getIdNumberFromDocument(finalList) : "";
              }
              if (name) {
                form.setFieldsValue({
                  docName: name
                })
              }else{
                form.setFieldsValue({
                  docName: ""
                })
              }
              if (docId) {
                form.setFieldsValue({
                  docNumber: docId
                })
              }else{
                form.setFieldsValue({
                  docNumber: ""
                })
              }
              if (validateFile(info)) {
                setFrontFile(info);
              }
            })
            .catch(() => {
              setUploadLoading(false);
            });
        } else {
          setUploadLoading(false);
        }
      } else if (status === "error") {
        setUploadLoading(false);
        sethaveuploaddocfront(0);
        setDocumentData({
          ...documentData,
          repDocFront: [
            {
              loading: false,
              url: "",
            },
          ],
        });
        message.error(`${info.file.name} file upload failed.`);
      } else if (status === "removed") {
        sethaveuploaddocfront(0);
        setUploadLoading(false);
      }
    },
  };
  const uploadBackDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: async (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "")
      // if (!file || file.type !== "application/pdf") {
      //   if (nationalityId == "PASSPORT") {
      //     setUploadLoading(true);
      //     const imageData = await readImageData(file);
      //     const extractedText = await extractTextFromImage(imageData);
      //     setAccuracy(extractedText?.averageAccuracy);
      //     const isPassport = validatePassportText(extractedText?.text);
      //     if (!isPassport) {
      //       setUploadLoading(false);
      //       message.error('Please upload a valid passport document.');
      //       return Upload.LIST_IGNORE; // Prevent upload
      //     }
      //   }
      //   if (nationalityId === "EMIRATES_ID" || nationalityId === "NATIONAL_ID") {
      //     setUploadLoading(true);
      //     const extractedText = await extractTextFromImage(file);
      //     setAccuracy(extractedText?.averageAccuracy);
      //     const isEmiratesId = validateEmiratIDText(extractedText?.text);
      //     if (!isEmiratesId) {
      //       setUploadLoading(false);
      //       message.error('Please upload a valid emirates id document.');
      //       return Upload.LIST_IGNORE; // Prevent upload
      //     }
      //   }
      // }
      if(checkBeforeUpload == true){
        setUploadLoading(true)
        setDocumentData({
          ...documentData,
          repDocBack: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState:any) =>({
          ...prevState,
          emiratesBack:""
          })) 
  
      return true;
      }
      else{
        setUploadError((prevState:any) =>({
          ...prevState,
          emiratesBack:checkBeforeUpload
          })) 
        setUploadLoading(false);
        return false;
      }
    },
    onChange: (info: any) => {
      const { status } = info.file;
      if (status !== "uploading") {
        sethaveuploaddocback(info.fileList?.length ? 1 : 0);
        setDocumentData({
          ...documentData,
          repDocBack: [
            {
              loading: false,
            },
          ],
        });
      }
      if (status === "done") {
        sethaveuploaddocback(1);
        if (info?.file?.response?.data?.key) {
          userKyc({
            fileName: info?.file?.response?.data?.key,
            userAlias: userAlias,
          })
            .then((res) => {
              setUploadLoading(false);
              setDocumentData({
                ...documentData,
                repDocBack: [info?.file?.response?.data],
              });
              let finalList = [];
              const filtered = res?.data?.data?.wordList.filter(function (el: any) {
                return el != null;
              });
              finalList = filtered;
              // Get document no. since the number is seperated by '-'
              for (let i = 1; i < filtered?.length; i++) {
                if (filtered[i].includes("-")) {
                  const getDocNo = filtered[i]
                    .split("-")
                    .toString()
                    .replace(",", "")
                    .replace(",", "")
                    .replace(",", "");
                  finalList.push(getDocNo);
                }
              }
              // setBackDocData(finalList);
              if (validateFile(info)) {
                setBackFile(info);
              }
            })
            .catch(() => {
              setUploadLoading(false);
            });
        } else {
          setUploadLoading(false);
        }
      } else if (status === "error") {
        setUploadLoading(false);
        setDocumentData({
          ...documentData,
          repDocBack: [
            {
              loading: false,
            },
          ],
        });
        sethaveuploaddocback(0);
        message.error(`${info.file.name} file upload failed.`);
      } else if (status === "removed") {
        sethaveuploaddocback(0);
        setUploadLoading(false);
      }
    },
  };

  const uploadAuthorizationDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "")
      if(checkBeforeUpload == true){
        setUploadLoading(true);
        setDocumentData({
        ...documentData,
        authorizationDoc: [
          {
            url: "",
            loading: true,
          },
        ],
      });
        setUploadError((prevState:any) =>({
          ...prevState,
          authorization:""
          })) 
  
      return true;
      }
      else{
        setUploadError((prevState:any) =>({
          ...prevState,
          authorization:checkBeforeUpload
          })) 
        setUploadLoading(false);
        return false;
      }
    },
    onChange: (info: any) => {
      const status = info?.file?.status;
      const response = info?.file?.response;
      if (status !== "uploading") {
        setUploadLoading(false);
        sethaveuploaddocauthorizationdoc(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        if (response?.statusCode || response?.status === 201 || response?.status === 200) {
          setUploadLoading(false);
          sethaveuploaddocauthorizationdoc(1);
          if (validateFile(info)) {
            setAuthorizationDoc(info);
          }
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            authorizationDoc: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        sethaveuploaddocauthorizationdoc(0);
        setDocumentData({
          ...documentData,
          authorizationDoc: [
            {
              loading: false,
            },
          ],
        });
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  
  const uploadButton = (
    <div>
      {(frontFile?.file?.name || typeof frontFile == 'string') && (documentData?.repDocFront?.[0]?.status !== "REJECTED") ? (
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
      <div style={{ marginTop: typeof frontFile == 'string' || frontFile?.file?.name ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.repDocFront?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof frontFile == 'string') ? frontFile : frontFile?.file?.name
              ? frontFile?.file?.name
              :  DOCUMENT_TYPE[nationalityId] + " front"
          }
        </div>
      </div>
    </div>
  );

  const uploadButton1 = (
    <div>
      {(backFile?.file?.name || typeof backFile == 'string') && (documentData?.repDocBack?.[0]?.status !== "REJECTED") ? (
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
      <div style={{ marginTop: typeof backFile == 'string' || backFile?.file?.name ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.repDocBack?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof backFile == 'string') ? backFile : backFile?.file?.name
              ? backFile?.file?.name
              :  DOCUMENT_TYPE[nationalityId] + " back"
          }
        </div>
      </div>
    </div>
  );

  const uploadButton2 = (
    <div>
      {(addressFile?.file?.name || typeof addressFile == 'string') && (documentData?.repAddProof?.[0]?.status !== "REJECTED") ? (
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
      <div style={{ marginTop: addressFile?.file?.name || typeof addressFile == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.repAddProof?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof addressFile == 'string') ? addressFile : addressFile?.file?.name ? addressFile?.file?.name : "Address proof"
          }
        </div>
      </div>
    </div>
  );
  const uploadButton3 = (
    <div>
      {(authorizationDoc?.file?.name || typeof authorizationDoc == 'string') && (documentData?.authorizationDoc?.[0]?.status !== "REJECTED") ? (
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

      <div style={{ marginTop: authorizationDoc?.file?.name || typeof authorizationDoc == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.authorizationDoc?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof authorizationDoc == 'string') ? authorizationDoc : authorizationDoc?.file?.name ? authorizationDoc?.file?.name : "Authorization documents"
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

          switch (docType) {
            case DocumentType.RepAddProof:
              setAddressFile({});
              break;
            case DocumentType.RepDocFront:
              sethaveuploaddocfront(0);
              setFrontFile({});
              break;
            case DocumentType.RepDocBack:
              sethaveuploaddocback(0);
              setBackFile({});
              break;
            case DocumentType.AuthorizationDoc:
              sethaveuploaddocauthorizationdoc(0);
              setAuthorizationDoc({});
              break;
            default:
              break;
          }
        }
      })
      .catch(() => {
        addressproof[docType] = [{ loading: false, url }];
        setDocumentData({ ...addressproof });
        message.error('Something went wrong. Please try again!');
      });
  };

  useEffect(() => {
      if (
        basicDetails.countryofIncorporation !== 116869 && (selectedNationality && selectedNationality.toUpperCase() !== "UNITED ARAB EMIRATES")
      ) {
        setNationalityId("PASSPORT");
      } else {
        setNationalityId("NATIONAL_ID");
      }
  }, [selectedNationality, basicDetails]);


  const handleNationalityRadioChange = async (selectedValue: any) => {
    setNationalityId(selectedValue);
    if ((documentData?.repDocFront?.[0]?.id) && (typeof frontFile == 'string') ? frontFile : frontFile?.file?.name) {
      setLoading(true);
      await removeDocument(DocumentType.RepDocFront, documentData?.repDocFront?.[0]?.id);
      setLoading(false);
    }
    if (documentData?.repDocBack?.[0]?.id && (typeof backFile == 'string') ? backFile : backFile?.file?.name) {
      setLoading(true);
      await removeDocument(DocumentType.RepDocBack, documentData?.repDocBack?.[0]?.id);
      setLoading(false);
    }
  };

  const downloadFile = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
  }
  const percentageValidator = (_:any, value:any) => {
    if (!value) {
      return Promise.reject("Shareholdings percentage is required!");
    }
    if (!onlyNumberRegex.test(value)) {
      return Promise.reject("Enter valid shareholdings percentage!");
    }
    const percentage = parseFloat(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return Promise.reject("Enter a percentage between 0 and 100.");
    }
    const representativeShare  = parseFloat(form.getFieldValue('representativeShare')) || 0;
    if (percentage + representativeShare > 100) {
      return Promise.reject("The sum of company shareholding percentage and representative share cannot exceed 100%.");
    }
  
    return Promise.resolve();
  };
  return (
    <>
    <div>
    {loading && (
        <div
          className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
        >
          <Spin size="large" className="mainloader"/>
        </div>
      )} 
       {ENTITY_TYPE === 'company' && STEP === 3 ? 
      <div>
          {uploadLoading == true && (
        <div
          className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
        >
          <Spin size="large" className="mainloader"/>
        </div>
      )}
      <UserHeader step={30} />
      <div className="text-right formSubText p-5">Step 3/7</div>

      <ResponsiveSidebar step={3} />
      <div className="d-flex center_res">
        <div className="px-5 verification_sidebar">
          <div className="slidebar-step-3-block">
            <Collapse items={items} bordered={false} />
            <div className="step_info p-50 d-flex mb-5">
              <Image src={InfoImg} alt="info" preview={false} className="mb-1" />
              <div>
                <div className="step">Tips for taking pictures</div>
                <div className="mt-2 step4">(Size upto 5mb)</div>
                <div className="mt-2 step4">Jpg, jpeg, png, pdf format</div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 px-5-res">
          <div className="d-flex step-title">
            <Image
              src={LeftArrow}
              alt="arrow"
              preview={false}
              className="cursor"
              onClick={() => {
                goBack()
              }}
            />
            <div className="titleText px-3 px-md-5">Representative & owners</div>
          </div>
          <Form scrollToFirstError onFinish={onFinish} form={form} className="basic-info-form-block">
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">
                  Representative name <span className="red">*</span>
                </div>
                <InputText
                  fieldname="representativeName"
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
                      message: " Representative name is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid address!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter the name"
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={User}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                    onChange={(e) => validateName(e)}
                  />
                </InputText>
              </div>

              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">Nationality <span className="red">*</span></div>
                <InputText
                  className="country-selection mb-4"
                  fieldname="nationality"
                  rules={[
                    {
                      required: true,
                      message: "Nationality is required!",
                    },
                  ]}
                >
                  {/* <span className="global">
                    <Image
                      preview={false}
                      src={Flag}
                      alt="nationality"
                      className="prefix"
                    />
                  </span> */}
                  {/* <Select
                    placeholder="Select nationality"
                    onChange={handleCountryChange}
                    value={selectedIsoCode}
                    showSearch
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {countryCodes.map((item: any, index: any) => {
                      return item?.currency?.status == "active" ? (
                        <Option key={index} value={item?.isoCode}>
                          {item?.name}
                        </Option>
                      ) : null;
                    })}
                  </Select> */}
                      <Select
                        className="w-100 before-country-img"
                        placeholder="Select nationality"
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        showSearch
                        optionFilterProp="children"
                        onChange={(value) => {
                        setSelectedNationality(value);
                      }}
                      >
                        {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                          return (
                            <Option key={index} value={value.riskItem} >{value.riskItem}</Option>
                          )
                        })}
                      </Select>
                </InputText>
              </div>
            </Row>

            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">Role <span className="red">*</span></div>
                <InputText
                  className="country-selection mb-4 pl-38px"
                  fieldname="roleType"
                  rules={[
                    {
                      required: true,
                      message: "Role is required!",
                    },
                  ]}
                >
                  <span className="global">
                    <Image
                      preview={false}
                      src={Role}
                      alt="country"
                      className="prefix"
                    />
                  </span>
                  <Select
                    value={selectedRole}
                    onChange={handleRole}
                    placeholder="Select role"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Select.Option value="DIRECTOR">Director</Select.Option>
                    <Select.Option value="AUTHORIZED_REPRESENTIVE">
                      Authorized representative
                    </Select.Option>
                    <Select.Option value="BENEFICIAL_OWNER">
                      Beneficial owner
                    </Select.Option>
                  </Select>
                </InputText>
              </div>
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">
                  Do you own or control 25% or more of the business? <span className="red">*</span>
                </div>
                <InputText
                      fieldname="businessControlValue"
                      className="inputField"
                      rules={[{ required: true, message: 'Please select an option' }]}
                    >
                <Radio.Group
                  onChange={onChange}
                  value={value}
                  className="mt-3 mb-4 ml-3"
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false} className="mx-4">
                    No
                  </Radio>
                </Radio.Group>
                </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res input-form-field">
                <div className="subText_small ">Date of birth <span className="red">*</span></div>
                <Form.Item
                  name="representativeDob"
                  className="inputField"
                  rules={[
                    {
                      required: true,
                      message: "DOB is required!",
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
                    onChange={handleDateChange}
                    disabledDate={(current:any) => {
                      return current > moment().subtract(18, "years");
                    }}
                  />
                </Form.Item>
              </div>
              <div className="w-100-res  input-form-field">
                <div className="subText_small">Percentage of shareholdings?<span className="red">*</span>
                </div>
                <InputText
                  fieldname={`representativeShare`}
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
                      message: "Shareholdings percentage is required!",
                    },
                    {
                      pattern: onlyNumberRegex,
                      message: "Enter valid shareholdings percentage!",
                    },
                    {
                      validator(_: any, value: string) {
                        if (parseFloat(value) < 0) {
                          return Promise.reject("Enter valid percentage percent!");
                        } else if(parseFloat(value) >100){
                          return Promise.reject("Percentage can not be more than 100%");
                        } 
                        else if (parseFloat(value) >= 25 && businessControlValue === "No") {
                          return Promise.reject("Percentage can not be more than 24%");
                        } else if(parseFloat(value) <=24 && businessControlValue === "Yes"){
                          return Promise.reject("Percentage can not be less than 25%");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="of shareholdings"
                    maxLength={6}
                    onInput={(e: any) => {
                      if (e.target.value.length > 6)
                        e.target.value = e.target.value.slice(
                          0,
                          e.target.maxLength
                        );
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                      }
                    }}
                    prefix={
                      <span className="inputGlobe">
                        <PercentageOutlined />
                      </span>
                    }
                    value={representativeShareData}
                    onChange={(e: any) => handleRhareholdingsPercentage(e.target.value)}
                  />
                </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">
                Is any corporate or entity holding any share ? <span className="red">*</span>
                </div>
                <InputText
                  fieldname="isCorporateShareholder"
                  className="inputField"
                  rules={[{ required: true, message: 'Please select an option' }]}
                >
                  <Radio.Group
                    onChange={onChangeCorporateShareholder}
                    value={corporateShareholder}
                    className="mt-3 mb-4 ml-3"
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false} className="mx-4">
                      No
                    </Radio>
                  </Radio.Group>
                </InputText>
              </div>
              {corporateShareholder && (<>
                <div className="w-100-res">
                <div className="subText_small">Percentage of shareholdings?<span className="red">*</span>
                </div>
                <InputText
                  fieldname={`companyShareholdingPercentage`}
                  className="inputField mt-3"
                  rules={[
                    { validator: percentageValidator }
                  ]}
                >
                  <Input
                    placeholder="of shareholdings"
                    maxLength={6}
                    onInput={(e: any) => {
                      if (e.target.value.length > 6)
                        e.target.value = e.target.value.slice(
                          0,
                          e.target.maxLength
                        );
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                      }
                    }}
                    prefix={
                      <span className="inputGlobe">
                        <PercentageOutlined />
                      </span>
                    }
                    value={companyShareholdingPercentageData}
                    onChange={(e: any) => handleCompanyShareholdingPercentage(e.target.value)}
                  />
                </InputText>
              </div>
              </>)}
            </Row>
            <Row>
              <div className="pr-25 w-100-res input-form-field">
                <div className="subText_small ">ID Expiry Date  <span className="red">*</span></div>
                <Form.Item
                  name="repDocExpiryDate"
                  className="inputField"
                  rules={[
                    {
                      required: true,
                      message: "Expiry date is required!",
                    },
                  ]}
                >
                  <DatePicker
                    format={{
                    format: 'DD-MM-YYYY',
                    type: 'mask',
                  }}
                    placeholder="Select expiry date"
                    className="dob_step"
                    onChange={handleExpiryDateChange}
                    disabledDate={(current:any) => {
                      return current < moment();
                    }}
                  />
                </Form.Item>
              </div>
              <div className="w-100-res input-form-field" >
                <div className="subText_small">
                   ID Number <span className="red">*</span>
                </div>
                <InputText
                  fieldname="repDocNumber"
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
                      message: "ID number is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid ID number!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter ID number"
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={Doc}
                          alt="document-number"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                    onChange={(e) => validateDocNumber(e)}
                  />
                </InputText>
              </div>
            </Row>
            <hr className="doc-seprator-line" />
            {/* <Row>
  <p>
    {selectedNationality
      ? `Selected Nationality: ${selectedNationality}`
      : "No nationality selected."}
  </p>

  {selectedNationality?.toLowerCase() === "United Arab Emirates" ? (
    <p>National ID</p>
  ) : (
    <p>Passport</p>
  )}
</Row> */}


            <Row className="mt-4">
              <div className="d-flex w-100">
                <Radio.Group onChange={async(e:any)=>{handleNationalityRadioChange(e?.target?.value)}} className="d-flex justify-content-between" value={nationalityId} >

                {/* {basicDetails?.countryofIncorporation === 116869 || 
              (!selectedNationality  || selectedNationality.toUpperCase() === "UNITED ARAB EMIRATES") ? (
                <> */}
                  <Radio value="NATIONAL_ID" className="me-4">National ID</Radio>
                  <Radio value="PASSPORT">Passport</Radio>
                {/* </>
              // ) : (
              //   <Radio value="PASSPORT">Passport</Radio>
              // )} */}

                </Radio.Group>
              </div>
            </Row>
            {(country !== "United Arab Emirates" && (nationalityId === "NATIONAL_ID" || nationalityId === "EMIRATES_ID")) && (
              <div className="card text-bg-light mt-4">
                <div className="card-body">
                  <p className="subText_xs mb-0">
                    All company representatives, owners, 
                    and shareholders must upload attested passports.
                    The identification documentation provided should be certified as a true copy of 
                    the original document by any one of the following: a) registered lawyer, b) registered notary, 
                    c) chartered accountant, d) government ministry, e) post office, f) police officer or g) an embassy or consulate.
                  </p>
                </div>
              </div>
            )}
            {(country !== "United Arab Emirates" && nationalityId === "PASSPORT") && (
              <div className="card text-bg-light mt-4">
                <div className="card-body">
                  <p className="subText_xs mb-0">
                    The identification documentation provided should be certified as a true copy of 
                    the original document by any one of the following: a) registered lawyer, b) registered notary, 
                    c) chartered accountant, d) government ministry, e) post office, f) police officer or g) an embassy or consulate.
                  </p>
                </div>
              </div>
            )}
            <Row className="d-flex doc-upload-block sub-doc-upload-row">
                <Row >
                    <div className="doc-block mx-2 responsive-block">
                      <Row>
                        <div className="d-flex w-100 mb-4">
                          <div className="stepDetails_medium upload_address mb-2">
                          {DOCUMENT_TYPE[nationalityId] +" front"} 
                          </div>
                        </div>
                      </Row>
                      <div>
                        <Upload
                          disabled={uploadLoading}
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          maxCount={1}
                          accept={acceptedFileExtension}
                          {...uploadFrontDoc}
                          {...{
                            data: {
                              businessType: "repDocFront",
                              type: "documents",
                              userAlias: userAlias,
                              repDocType: value,
                            },
                          }}
                        >
                          {uploadButton}
                        </Upload>
                        {frontFile?.file?.name || typeof frontFile == 'string' ? (
                          <div>
                            {documentData?.repDocFront?.[0]?.url &&
                              !documentData?.repDocFront?.[0]?.loading && (
                                documentData?.repDocFront?.[0]?.url &&
                                  documentData?.repDocFront?.[0]?.url.includes(".pdf") ? (
                                  <span className="d-flex endtoend p-1">
                                    <div className="blue_text cursor" onClick={() => {handlePDFView(documentData?.repDocFront?.[0]?.url)}}>
                                      <Image
                                        preview={false}
                                        src={Pdf} alt="view"
                                      /> <span className="px-1" >View</span>
                                    </div>
                                    {documentData?.repDocFront?.[0]?.status !==
                                      "VERIFIED" && (
                                        <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepDocFront, documentData?.repDocFront?.[0]?.id)} className="cursor" />
                                      )}
                                  </span>
                                ) : (
                                  <>
                                    <div className="d-flex endtoend p-1">
                                      <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.repDocFront?.[0]?.url) }}>
                                        <Image
                                          preview={false}
                                          src={BlueEye} alt="view"
                                        /> <span className="px-1" >View</span>
                                      </div>
                                      {documentData?.repDocFront?.[0]?.status !== "VERIFIED" && (
                                        <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepDocFront, documentData?.repDocFront?.[0]?.id)} className="cursor" />
                                      )}
                                      {documentData?.repDocFront?.[0]?.status === "VERIFIED" && (
                                        <span className="text-green mb-2 ml-3rem">
                                          <CheckCircleOutlined /> Verified{" "}
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )
                              )}
                            {documentData?.repDocFront?.[0]?.loading && (
                              <Spin indicator={Loader} className="ml-20" />
                            )}
                          </div>
                        ) : null}
                        <div>
                          {documentData?.repDocFront?.[0]?.status === "REJECTED" && (
                            <Tooltip title={documentData?.repDocFront?.[0]?.reason}>
                              <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                Reason : {documentData?.repDocFront?.[0]?.reason}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                        {haveuploaddocfront != 1 && formTouched === true ? <div className="errMsg px-2">Proof Required!</div> : ""}
                        <span className="uploaderror ant-form-item-explain-error">{uploadError?.emiratesFront}</span>
                      </div>
                    </div>
                    <div className="doc-block mx-2">
                      <Row>
                        <div className="d-flex w-100 mb-4">
                          <div className="stepDetails_medium upload_address mb-2">
                            {DOCUMENT_TYPE[nationalityId] +" back"} 
                          </div>
                        </div>
                      </Row> 
                      <div className="fixed-height">
                        <Upload
                          disabled={uploadLoading}
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          maxCount={1}
                          accept={acceptedFileExtension}
                          {...uploadBackDoc}
                          {...{
                            data: {
                              businessType: "repDocBack",
                              type: "documents",
                              userAlias: userAlias,
                              repDocType: value,
                            },
                          }}
                        >
                          {uploadButton1}
                        </Upload>
                        {backFile?.file?.name || typeof backFile == 'string' ? (
                          <div>
                            {documentData?.repDocBack?.[0]?.url &&
                              !documentData?.repDocBack?.[0]?.loading && (
                                documentData?.repDocBack?.[0]?.url &&
                                  documentData?.repDocBack?.[0]?.url.includes(".pdf") ? (
                                  <span className="d-flex endtoend p-1">
                                    <div className="blue_text cursor" onClick={() => {handlePDFView(documentData?.repDocBack?.[0]?.url)}}>
                                      <Image
                                        preview={false}
                                        src={Pdf} alt="view"
                                      /> <span className="px-1" >View</span>
                                    </div>
                                    {documentData?.repDocBack?.[0]?.status !==
                                      "VERIFIED" && (
                                        <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepDocBack, documentData?.repDocBack?.[0]?.id)} className="cursor" />
                                      )}
                                  </span>
                                ) : (
                                  <>
                                    <div className="d-flex endtoend p-1">
                                      <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.repDocBack?.[0]?.url) }}>
                                        <Image
                                          preview={false}
                                          src={BlueEye} alt="view"
                                        /> <span className="px-1" >View</span>
                                      </div>
                                      {documentData?.repDocBack?.[0]?.status !== "VERIFIED" && (
                                        <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepDocBack, documentData?.repDocBack?.[0]?.id)} className="cursor" />
                                      )}
                                      {documentData?.repDocBack?.[0]?.status === "VERIFIED" && (
                                        <span className="text-green mb-2 ml-3rem">
                                          <CheckCircleOutlined /> Verified
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )
                              )}
                            {documentData?.repDocBack?.[0]?.loading && (
                              <Spin indicator={Loader} className="ml-20" />
                            )}
                          </div>
                        ) : null}
                        <div>
                          {documentData?.repDocBack?.[0]?.status === "REJECTED" && (
                            <Tooltip title={documentData?.repDocBack?.[0]?.reason}>
                              <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                Reason : {documentData?.repDocBack?.[0]?.reason}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      {haveuploaddocback != 1 && formTouched === true ? <div className="errMsg mx-4 px-2">Proof required!</div> : ""}
                      <span className="uploaderror ant-form-item-explain-error">{uploadError?.emiratesBack}</span>
                      </div>
                    </div>
                  </Row>
                <div className="mx-2">
                <div>
                  <div className="d-flex ml-2 w-100">
                    <div className="stepDetails_medium upload_address">
                      Address proof
                    </div>
                  </div>
                  <Row>
                    <div className="d-flex doc-upload-block">
                      <div className="upload_address doc-block">
                        <Upload
                          disabled={uploadLoading}
                          listType="picture-card"
                          className="avatar-uploader"
                          accept={acceptedFileExtension}
                          maxCount={1}
                          showUploadList={false}
                          {...uploadDoc}
                          {...{
                            data: {
                              businessType: "repAddProof",
                              type: "documents",
                              userAlias: userAlias,
                              repSameAddress: false,
                            },
                          }}
                        >
                          {uploadButton2}
                        </Upload>
                        {addressFile?.file?.name || typeof addressFile == 'string' ? (
                          <div>
                            {documentData?.repAddProof?.[0]?.url &&
                              !documentData?.repAddProof?.[0]?.loading && (
                                documentData?.repAddProof?.[0]?.url &&
                                  documentData?.repAddProof?.[0]?.url.includes(".pdf") ? (
                                  <span className="d-flex endtoend p-1">
                                    <div className="blue_text cursor" onClick={() => {handlePDFView(documentData?.repAddProof?.[0]?.url)}}>
                                      <Image
                                        preview={false}
                                        src={Pdf} alt="view"
                                      /> <span className="px-1" >View</span>
                                    </div>
                                    {documentData?.repAddProof?.[0]?.status !==
                                      "VERIFIED" && (
                                        <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepAddProof, documentData?.repAddProof?.[0]?.id)} className="cursor" />
                                      )}
                                  </span>
                                ) : (
                                  <>
                                    <div className="d-flex endtoend p-1">
                                      <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.repAddProof?.[0]?.url) }}>
                                        <Image
                                          preview={false}
                                          src={BlueEye} alt="view"
                                        /> <span className="px-1" >View</span>
                                      </div>
                                      {documentData?.repAddProof?.[0]?.status !== "VERIFIED" && (
                                        <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepAddProof, documentData?.repAddProof?.[0]?.id)} className="cursor" />
                                      )}
                                      {documentData?.repAddProof?.[0]?.status === "VERIFIED" && (
                                        <span className="text-green mb-2 ml-3rem">
                                          <CheckCircleOutlined /> Verified
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )
                              )}
                            {documentData?.repAddProof?.[0]?.loading && (
                              <Spin indicator={Loader} className="ml-20" />
                            )}
                          </div>
                        ) : null}
                        <div>
                          {documentData?.repAddProof?.[0]?.status === "REJECTED" && (
                            <Tooltip title={documentData?.repAddProof?.[0]?.reason}>
                              <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                Reason : {documentData?.repAddProof?.[0]?.reason}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                        <span className="uploaderror ant-form-item-explain-error">{uploadError?.address}</span>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
              {(businessControlValue === "No" && authorizationToggle) &&
                (<>
                  <div className="mx-2">
                    <Row>
                      <div className="d-flex w-100">
                        <div className="stepDetails_medium upload_address">
                          Authorization document
                        </div>
                      </div>
                    </Row>
                    <Row>
                      <div className="d-flex doc-upload-block">
                        <div className="upload_address doc-block">
                          <Upload
                            disabled={uploadLoading}
                            listType="picture-card"
                            className="avatar-uploader"
                            accept={acceptedFileExtension}
                            maxCount={1}
                            showUploadList={false}
                            {...uploadAuthorizationDoc}
                            {...{
                              data: {
                                businessType: "authorizationDoc",
                                type: "documents",
                                userAlias: userAlias,
                              },
                            }}
                          >
                            {uploadButton3}
                          </Upload>
                          {authorizationDoc?.file?.name || typeof authorizationDoc == 'string' ? (
                            <div>
                              {documentData?.authorizationDoc?.[0]?.url &&
                                !documentData?.authorizationDoc?.[0]?.loading && (
                                  documentData?.authorizationDoc?.[0]?.url &&
                                    documentData?.authorizationDoc?.[0]?.url.includes(".pdf") ? (
                                    <span className="d-flex endtoend p-1">
                                      <div className="blue_text cursor" onClick={() => { handlePDFView(documentData?.authorizationDoc?.[0]?.url) }}>
                                        <Image
                                          preview={false}
                                          src={Pdf} alt="view"
                                        /> <span className="px-1" >View</span>
                                      </div>
                                      {documentData?.authorizationDoc?.[0]?.status !==
                                        "VERIFIED" && (
                                          <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.AuthorizationDoc, documentData?.authorizationDoc?.[0]?.id)} className="cursor" />
                                        )}
                                    </span>
                                  ) : (
                                    <>
                                      <div className="d-flex endtoend p-1">
                                        <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.authorizationDoc?.[0]?.url) }}>
                                          <Image
                                            preview={false}
                                            src={BlueEye} alt="view"
                                          /> <span className="px-1" >View</span>
                                        </div>
                                        {documentData?.authorizationDoc?.[0]?.status !== "VERIFIED" && (
                                          <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.AuthorizationDoc, documentData?.authorizationDoc?.[0]?.id)} className="cursor" />
                                        )}
                                        {documentData?.authorizationDoc?.[0]?.status === "VERIFIED" && (
                                          <span className="text-green mb-2 ml-3rem">
                                            <CheckCircleOutlined /> Verified
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )
                                )}
                              {documentData?.authorizationDoc?.[0]?.loading && (
                                <Spin indicator={Loader} className="ml-20" />
                              )}
                            </div>
                          ) : null}
                          <div>
                            {documentData?.authorizationDoc?.[0]?.status === "REJECTED" && (
                              <Tooltip title={documentData?.authorizationDoc?.[0]?.reason}>
                                <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                  Reason :  {documentData?.authorizationDoc?.[0]?.reason}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                          {haveuploaddocauthorizationdoc != 1 && formTouched === true ? <div className="errMsg px-2">Authorization document required!</div> : ""}
                          <span className="uploaderror ant-form-item-explain-error">{uploadError?.authorization}</span>
                        </div>
                      </div>
                    </Row>
                  </div>
                </>)
              }
            <Col xs={24} sm={20} md={20} lg={20} className="flex-column">
              <hr className="doc-seprator-line" />
              <Col>
                <ViewButton
                  className="mb-0 mx-2"
                  children=" Example file for owner authorization letter "
                  onClick={() => downloadFile(LOAFormatRepresentative, "LOA-Format for representative.docx")}
                />
                <DownloadOutlined />
              </Col>
              <Col>
                <ViewButton
                  className="mb-0 mx-2"
                  children=" Example file for authorization letter "
                  onClick={() => downloadFile(LOAFormatFromOnePartnerToAnother, "LOA-Format for one partner to another.docx")}
                />
                <DownloadOutlined />
              </Col>
            </Col>
            <Col>
              <div className="d-flex step-control-btn">
                  {/* {((representativeDoc?.file || typeof representativeDoc === 'string') || (businessControlValue === "No"  || selectedRole === "AUTHORIZED_REPRESENTIVE"))  && (representativeIdDoc?.file || typeof representativeIdDoc === 'string')? (
                    <Button
                      className="rounded"
                      htmlType="submit"
                      onClick={() => setformTouched(true)}
                      disabled={uploadLoading}
                      loading={loading}
                    >
                      {uploadLoading ? "Please wait..." : "Save & Next"}
                    </Button>
                  ) : (
                    <Button
                      className="rounded disabled loading-submit-btn"
                      loading={uploadLoading}
                      disabled
                    >
                      {uploadLoading ? "Please wait..." : "Save & Next"}
                    </Button>
                  )} */}
                      {(businessControlValue === "No") ?
                        (<>
                          <div className="d-flex my-4 step-control-btn">
                            {((addressFile?.file || typeof addressFile === 'string') && documentData?.repAddProof?.[0]?.status !== "REJECTED")
                              && (frontFile?.file || typeof frontFile === 'string') && (backFile?.file || typeof backFile === 'string')
                              && (authorizationDoc?.file || typeof authorizationDoc === 'string') && (
                                documentData?.repDocFront?.[0]?.status !== "REJECTED" &&
                                documentData?.repDocBack?.[0]?.status !== "REJECTED" &&
                                documentData?.authorizationDoc?.[0]?.status !== "REJECTED") ?
                              <Button className="rounded" htmlType="submit" onClick={() => { setformTouched(true) }} disabled={uploadLoading} loading={loading}>{uploadLoading ? "Please wait..." : "Save & Next"}</Button>
                              : <Button className="rounded disabled loading-submit-btn" loading={uploadLoading}>{uploadLoading ? "Please wait..." : "Save & Next"}</Button>}
                          <Button className="rounded_cancel mx-4" onClick={handleCancel}>Reset</Button>
                          </div>
                        </>) : (<>
                          <div className="d-flex my-4 step-control-btn">
                            {((addressFile?.file || typeof addressFile === 'string') && documentData?.repAddProof?.[0]?.status !== "REJECTED")
                              && (frontFile?.file || typeof frontFile === 'string') && (backFile?.file || typeof backFile === 'string') && (
                              documentData?.repDocFront?.[0]?.status !== "REJECTED" &&
                              documentData?.repDocBack?.[0]?.status !== "REJECTED"
                            ) ?
                              <Button className="rounded" htmlType="submit" onClick={() => { setformTouched(true) }} disabled={uploadLoading} loading={loading}>{uploadLoading ? "Please wait..." : "Save & Next"}</Button>
                              : <Button className="rounded disabled loading-submit-btn" loading={uploadLoading}>{uploadLoading ? "Please wait..." : "Save & Next"}</Button>}
                          <Button className="rounded_cancel mx-4" onClick={handleCancel}>Reset</Button>
                          </div>
                        </>)
                      }
                       </div>
            </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div> : "" }
    </div>
      {/** Image Preview Modal */}
      <ImagePreviewModal
        imagePreviewModal={imagePreviewModal}
        setImagePreviewModal={setImagePreviewModal}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
        {/** Pdf Preview Modal */}
      <PdfPreviewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
    </>
  );
};

export default CompanyStep3;
