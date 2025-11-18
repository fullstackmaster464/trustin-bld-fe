import {
  Button,
  Form,
  Image,
  // Radio,
  Row,
  Upload,
  message,
  Spin,
  Tooltip,
  Collapse,
  Col,
  Typography
} from "antd";
import UserHeader from "./UserHeader";
import { useEffect, useState } from "react";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import Mobile from "../../assets/img/Mobile.svg";
import User from "../../assets/img/User_Full.svg";
import Doc_large from "../../assets/img/Doc_large.svg";
import PlusUpload from "../../assets/img/PlusUpload.svg";
import Job from "../../assets/img/job_gray.svg";
import InfoImg from "../../assets/img/info.svg";
import BlueTick from "../../assets/img/blue_tick.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import Delete from "../../assets/img/delete.svg";
import Tick from "../../assets/img/circle_orange.svg";
import Role from "../../assets/img/role.svg";
import Pdf from "../../assets/img/pdfview.svg";
import Flag from "../../assets/img/flag_gray.svg";
import Designation from "../../assets/img/Designation.svg";
import { useLocation, useNavigate } from "react-router-dom";
import {
  KYBVerificatioStep5,
  KYBVerificatioStep7
} from "../Common/RouteConst";
import ResponsiveSidebar from "./SidebarResponsiveCompany";
import { COMPANY_ROLE, KYB_VERIFICATION_STEPS_TITLE, acceptedFileExtension, beforeUploadFile, getLocalStorage, setLocalStorage } from "../Common/Constants";
import { deleteFile, deleteMoaDocument, updateFinalV2 } from "../../services/user";
import { fetchKybDetails,  getRiskAssessment, getRiskConfiguration, saveKyc } from "../../services/admin";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import ImagePreviewModal from "../Models/ImagePreviewModal";
import type { CollapseProps } from 'antd';
import type { UploadProps } from 'antd';
import Company_gray from "../../assets/img/company_gray.svg";
import CompanySize from "../../assets/img/companySize.svg";

const { Dragger } = Upload;
const { Paragraph } = Typography;
import PdfPreviewModal from "../Models/PdfPreviewModal";

enum DocumentType {
  RepAddProof = 'repAddProof',
  RepDocFront = 'repDocFront',
  RepDocBack = 'repDocBack',
  BusinessRegProof = 'businessRegProof',
  BusinessAddProof = 'businessAddProof',
  AuthorizationDoc = 'authorizationDoc',
  VATDoc = 'vatDoc',
  OtherDoc = 'otherDoc'
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

const CompanyStep6 = () => {
  // const [form] = Form ? Form.useForm() : [];
  const [form] = Form?.useForm() ?? [];
  // const [form] = Form?.useForm();
  // const [addressFile, setAddressFile] = useState<any>({});
  // const [frontFile, setFrontFile] = useState<any>({});
  // const [backFile, setBackFile] = useState<any>({});
  // const [value, setValue] = useState("NATIONAL_ID");
  // const [regProof, setRegProof] = useState<any>({});
  // const [regAddressProof, setRegAddressProof] = useState<any>({});
  //  const [regProof, setRegProof] = useState<any>({});
  // const [haveuploaddocfront, sethaveuploaddocfront] = useState(0);
  // const [haveuploaddocback, sethaveuploaddocback] = useState(0);
  const [uploadError,setUploadError] = useState<any>({
    docFront:"",
    docBack:"",
    moaDocError:""
  })
  const [uploadLoading, setUploadLoading] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData>();
  // const [haveaddressproof, sethaveaddressproof] = useState(0);
  // const [haveregproof, sethaveregproof] = useState(0);
  const [formTouched, setformTouched] = useState(false)
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const Token = local ? JSON.parse(local)?.token : "";
  
  const navigate = useNavigate();
  const params = useLocation();
  
  
  // const onChange = async (e: any) => {
  //   setValue(e.target?.value);
  //   if ((documentData?.repDocFront?.[0]?.id) && (typeof frontFile == 'string') ? frontFile : frontFile?.file?.name) {
  //     setLoading(true);
  //     await removeDocument(DocumentType.RepDocFront, documentData?.repDocFront?.[0]?.id);
  //     setLoading(false);
  //   }
  //   if (documentData?.repDocBack?.[0]?.id && (typeof backFile == 'string') ? backFile : backFile?.file?.name) {
  //     setLoading(true);
  //     await removeDocument(DocumentType.RepDocBack, documentData?.repDocBack?.[0]?.id);
  //     setLoading(false);
  //   }
  // };
  const [beneficialOwnerDetails, setBeneficialOwnerDetails] = useState<BeneficialOwnerDetails[]>([]);
  const [representativeDetails, setRepresentativeDetails] = useState<RepresentativeDetails>({});
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({});
  const [businessDetails, setBusinessDetails] = useState<any>({});
  // const [authorizationDoc, setAuthorizationDoc] = useState<any>({});
  // const [haveuploaddocauthorizationdoc, sethaveuploaddocauthorizationdoc] = useState(0);
  const [imagePreviewModal, setImagePreviewModal] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  // const [digiScreeningReqObj, setDigiScreeningReqObj] = useState<any>([]);
  const [riskDetails, setRiskDetails] = useState<any>([]);
  const ENTITY_TYPE = JSON.parse(getLocalStorage("auth")!)?.entityType
  const STEP = JSON.parse(getLocalStorage("auth")!)?.step;
  const [fileList, setFileList] = useState<any[]>([]);
  const [moaDoc, setMoaDoc] = useState<string[]>([]);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [vatDoc, setVatDoc] = useState<any>({});
  const [haveuploadVatDoc, sethaveuploadVatDoc] = useState(0);
  const [otherDoc, setOtherDoc] = useState<any>({}); 
  const [haveuploadOtherDoc, sethaveuploadOtherDoc] = useState(0); 

  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 5;
    setLocalStorage('auth',JSON.stringify(localStroragevalue))
    navigate(KYBVerificatioStep5, {
      state: {
        basic: params?.state?.basic,
        representativeDetails: params?.state?.representativeDetails,
        beneficialOwnerDetails: params?.state?.formValues
      }
    });

  }
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  // Upload documents
  // const uploadBusinessAddress = {
  //   name: "file",
  //   headers: {
  //     authorization: `Bearer ${Token}`,
  //   },
  //   action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
  //   beforeUpload: (file: any) => {      
  //     let checkBeforeUpload = beforeUploadFile(file, "MOA")
  //     if(checkBeforeUpload == true){
  //       setUploadError((prevState:any) =>({
  //       ...prevState,
  //       docBack:""
  //       }))
  //       setUploadLoading(true);
  //       setDocumentData({
  //         ...documentData,
  //         businessAddProof: [
  //           {
  //             loading: true,
  //             url: "",
  //           },
  //         ],
  //       });
  //       return true;
  //     }
  //     else{
  //       setUploadError((prevState:any) =>({
  //         ...prevState,
  //         docBack:checkBeforeUpload
  //         })) 
  //       setUploadLoading(false);
  //       return false;
  //     }
  //   },

  //   onChange: (info: any) => {
  //     const { status, response } = info?.file;

  //     if (status !== "uploading") {
  //       setUploadLoading(false);
  //       setDocumentData({
  //         ...documentData,
  //         businessAddProof: [
  //           {
  //             loading: false,
  //           },
  //         ],
  //       });
  //       sethaveaddressproof(info?.fileList?.length ? 1 : 0);
  //     }

  //     if (status === "done") {
  //       if (response?.statusCode || response?.status === 201 || 200) {
  //         setUploadLoading(false);
  //         setDocumentData({
  //           ...documentData,
  //           businessAddProof: [info?.file?.response?.data],
  //         });
  //         sethaveaddressproof(1);
  //         setRegAddressProof(info?.file?.response?.data?.inputfileid);
  //       }
  //     } else if (status === "error") {
  //       setUploadLoading(false);
  //       setDocumentData({
  //         ...documentData,
  //         businessAddProof: [
  //           {
  //             loading: false,
  //           },
  //         ],
  //       });
  //       sethaveaddressproof(0);
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  // const uploadRegDoc = {
  //   name: "file",
  //   headers: {
  //     authorization: `Bearer ${Token}`,
  //   },
  //   action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
  //   beforeUpload: (file: any) => {
  //     let checkBeforeUpload = beforeUploadFile(file,"")
  //     if(checkBeforeUpload == true){
  //       setUploadLoading(true);
  //       setDocumentData({
  //         ...documentData,
  //         businessRegProof: [
  //           {
  //             loading: true,
  //             url: "",
  //           },
  //         ],
  //       });
  //       setUploadError((prevState:any) =>({
  //         ...prevState,
  //         docFront:""
  //         }))
  //     return true;
  //     }
  //     else{
  //       setUploadLoading(false);
  //       setUploadError((prevState:any) =>({
  //         ...prevState,
  //         docFront:checkBeforeUpload
  //         }))
  //       return false
  //     }
  //   },

  //   onChange: (info: any) => {
  //     const { status, response } = info?.file;

  //     if (status !== "uploading") {
  //       setUploadLoading(false);
  //       setDocumentData({
  //         ...documentData,
  //         businessRegProof: [
  //           {
  //             loading: false,
  //             url: "",
  //           },
  //         ],
  //       });
  //       sethaveregproof(info?.fileList?.length ? 1 : 0);
  //     }

  //     if (status === "done") {
  //       if (response?.statusCode || response?.status === 201 || 200) {
  //         setUploadLoading(false);
  //         setDocumentData({
  //           ...documentData,
  //           businessRegProof: [info?.file?.response?.data],
  //         });
  //         sethaveregproof(1);
  //         setRegProof(info);
  //       }
  //     } else if (status === "error") {
  //       setUploadLoading(false);
  //       setDocumentData({
  //         ...documentData,
  //         businessRegProof: [
  //           {
  //             loading: false,
  //             url: "",
  //           },
  //         ],
  //       });
  //       sethaveregproof(0);
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  // const uploadDoc = {
  //   name: "file",
  //   headers: {
  //     authorization: `Bearer ${Token}`,
  //   },
  //   action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
  //   beforeUpload: (file: any) => {
  //     const isJpgOrPng: boolean =
  //       file.type === "image/jpeg" ||
  //       file.type === "image/jpg" ||
  //       file.type === "image/png" ||
  //       file.type === "application/pdf";
  //     if (!isJpgOrPng) {
  //       message.error("You can only upload Image or PDF file!");
  //       return false;
  //     }
  //     const isLt2M: boolean = file.size / 1024 / 1024 <= 2;
  //     if (!isLt2M) {
  //       message.error("Image must smaller than 2MB!");
  //       return false;
  //     }
  //   },
  //   onChange: (info: any) => {
  //     setUploadLoading(true);
  //     setDocumentData({
  //       ...documentData,
  //       repAddProof: [
  //         {
  //           url: "",
  //           loading: true,
  //         },
  //       ],
  //     });
  //     const { status, response } = info.file;

  //     if (status !== "uploading") {
  //       setUploadLoading(false);
  //     }

  //     if (status === "done") {
  //       if (response?.statusCode || response?.status === 201 || 200) {
  //         setUploadLoading(false);
  //         if (validateFile(info)) {
  //           setAddressFile(info);
  //         }
  //       }
  //       if (info.file.response.data.key) {
  //         setDocumentData({
  //           ...documentData,
  //           repAddProof: [info?.file?.response?.data],
  //         });
  //       }
  //     } else if (status === "error") {
  //       setUploadLoading(false);
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };
  // const uploadFrontDoc = {
  //   name: "file",
  //   headers: {
  //     authorization: `Bearer ${Token}`,
  //   },
  //   action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
  //   beforeUpload: (file: any) => {
  //     const isJpgOrPng: boolean =
  //       file.type === "image/jpeg" ||
  //       file.type === "image/jpg" ||
  //       file.type === "image/png" ||
  //       file.type === "application/pdf";
  //     if (!isJpgOrPng) {
  //       message.error("You can only upload Image or PDF file!");
  //       return false;
  //     }
  //     const isLt2M: boolean = file.size / 1024 / 1024 <= 2;
  //     if (!isLt2M) {
  //       message.error("Image must smaller than 2MB!");
  //       return false;
  //     }
  //   },
  //   onChange: (info: any) => {
  //     setUploadLoading(true);
  //     setDocumentData({
  //       ...documentData,
  //       repDocFront: [
  //         {
  //           url: "",
  //           loading: true,
  //         },
  //       ],
  //     });
  //     const { status } = info.file;
  //     if (status !== "uploading") {
  //       sethaveuploaddocfront(info.fileList?.length ? 1 : 0);
  //     }
  //     if (status === "done") {
  //       sethaveuploaddocfront(1);
  //       if (info?.file?.response?.data?.key) {
  //         userKyc({
  //           fileName: info?.file?.response?.data?.key,
  //           userAlias: userAlias,
  //         })
  //           .then((res) => {
  //             setUploadLoading(false);
  //             setDocumentData({
  //               ...documentData,
  //               repDocFront: [info?.file?.response?.data],
  //             });
  //             let finalList = [];
  //             let filtered = res?.data?.data?.wordList.filter(function (el: any) {
  //               return el != null;
  //             });
  //             finalList = filtered;
  //             for (var i = 1; i < filtered?.length; i++) {
  //               if (filtered[i].includes("-")) {
  //                 var getDocNo = filtered[i]
  //                   .split("-")
  //                   .toString()
  //                   .replace(",", "")
  //                   .replace(",", "")
  //                   .replace(",", "");
  //                 finalList.push(getDocNo);
  //               }
  //             }
  //             // setFrontDocData(finalList);
  //             if (validateFile(info)) {
  //               setFrontFile(info);
  //             }
  //           })
  //           .catch(() => {
  //             setUploadLoading(false);
  //           });
  //       } else {
  //         setUploadLoading(false);
  //       }
  //     } else if (status === "error") {
  //       setUploadLoading(false);
  //       sethaveuploaddocfront(0);
  //       setDocumentData({
  //         ...documentData,
  //         repDocFront: [
  //           {
  //             loading: false,
  //             url: "",
  //           },
  //         ],
  //       });
  //       message.error(`${info.file.name} file upload failed.`);
  //     } else if (status === "removed") {
  //       sethaveuploaddocfront(0);
  //       setUploadLoading(false);
  //     }
  //   },
  // };
  // const uploadBackDoc = {
  //   name: "file",
  //   headers: {
  //     authorization: `Bearer ${Token}`,
  //   },
  //   action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
  //   beforeUpload: (file: any) => {
  //     const isJpgOrPng: boolean =
  //       file.type === "image/jpeg" ||
  //       file.type === "image/jpg" ||
  //       file.type === "image/png" ||
  //       file.type === "application/pdf";
  //     if (!isJpgOrPng) {
  //       message.error("You can only upload Image or PDF file!");
  //       return false;
  //     }
  //     const isLt2M: boolean = file.size / 1024 / 1024 <= 2;
  //     if (!isLt2M) {
  //       message.error("Image must smaller than 2MB!");
  //       return false;
  //     }
  //   },
  //   onChange: (info: any) => {
  //     setUploadLoading(true);
  //     setDocumentData({
  //       ...documentData,
  //       repDocBack: [
  //         {
  //           loading: true,
  //           url: "",
  //         },
  //       ],
  //     });
  //     const { status } = info.file;
  //     if (status !== "uploading") {
  //       sethaveuploaddocback(info.fileList?.length ? 1 : 0);
  //       setDocumentData({
  //         ...documentData,
  //         repDocBack: [
  //           {
  //             loading: false,
  //           },
  //         ],
  //       });
  //     }
  //     if (status === "done") {
  //       sethaveuploaddocback(1);
  //       if (info?.file?.response?.data?.key) {
  //         userKyc({
  //           fileName: info?.file?.response?.data?.key,
  //           userAlias: userAlias,
  //         })
  //           .then((res) => {
  //             setUploadLoading(false);
  //             setDocumentData({
  //               ...documentData,
  //               repDocBack: [info?.file?.response?.data],
  //             });
  //             let finalList = [];
  //             let filtered = res?.data?.data?.wordList.filter(function (el: any) {
  //               return el != null;
  //             });
  //             finalList = filtered;
  //             // Get document no. since the number is seperated by '-'
  //             for (var i = 1; i < filtered?.length; i++) {
  //               if (filtered[i].includes("-")) {
  //                 var getDocNo = filtered[i]
  //                   .split("-")
  //                   .toString()
  //                   .replace(",", "")
  //                   .replace(",", "")
  //                   .replace(",", "");
  //                 finalList.push(getDocNo);
  //               }
  //             }
  //             // setBackDocData(finalList);
  //             if (validateFile(info)) {
  //               setBackFile(info);
  //             }
  //           })
  //           .catch(() => {
  //             setUploadLoading(false);
  //           });
  //       } else {
  //         setUploadLoading(false);
  //       }
  //     } else if (status === "error") {
  //       setUploadLoading(false);
  //       setDocumentData({
  //         ...documentData,
  //         repDocBack: [
  //           {
  //             loading: false,
  //           },
  //         ],
  //       });
  //       sethaveuploaddocback(0);
  //       message.error(`${info.file.name} file upload failed.`);
  //     } else if (status === "removed") {
  //       sethaveuploaddocback(0);
  //       setUploadLoading(false);
  //     }
  //   },
  // };

  // const uploadAuthorizationDoc = {
  //   name: "file",
  //   headers: {
  //     authorization: `Bearer ${Token}`,
  //   },
  //   action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
  //   beforeUpload: (file: any) => {
  //     const isJpgOrPng: boolean =
  //       file.type === "image/jpeg" ||
  //       file.type === "image/jpg" ||
  //       file.type === "image/png" ||
  //       file.type === "application/pdf";
  //     if (!isJpgOrPng) {
  //       message.error("You can only upload Image or PDF file!");
  //       return false;
  //     }
  //     const isLt2M: boolean = file.size / 1024 / 1024 <= 2;
  //     if (!isLt2M) {
  //       message.error("Image must smaller than 2MB!");
  //       return false;
  //     }
  //   },
  //   onChange: (info: any) => {
  //     setUploadLoading(true);
  //     setDocumentData({
  //       ...documentData,
  //       authorizationDoc: [
  //         {
  //           url: "",
  //           loading: true,
  //         },
  //       ],
  //     });
  //     const { status, response } = info?.file;
  //     if (status !== "uploading") {
  //       setUploadLoading(false);
  //       sethaveuploaddocauthorizationdoc(info.fileList?.length ? 1 : 0);
  //     }
  //     if (status === "done") {
  //       if (response?.statusCode || response?.status === 201 || 200) {
  //         setUploadLoading(false);
  //         sethaveuploaddocauthorizationdoc(1);
  //         if (validateFile(info)) {
  //           setAuthorizationDoc(info);
  //         }
  //       }
  //       if (info.file.response.data.key) {
  //         setDocumentData({
  //           ...documentData,
  //           authorizationDoc: [info?.file?.response?.data],
  //         });
  //       }
  //     } else if (status === "error") {
  //       setUploadLoading(false);
  //       sethaveuploaddocauthorizationdoc(0);
  //       setDocumentData({
  //         ...documentData,
  //         authorizationDoc: [
  //           {
  //             loading: false,
  //           },
  //         ],
  //       });
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  const onFinish = () => {    
    
   

    if (
      // haveregproof == 1 &&
      // haveaddressproof == 1 
      (fileList && fileList?.length > 0)
      // &&
      // haveuploaddocfront == 1 &&
      // haveuploaddocback == 1
    ) {
       
      updateFinalV2({
        userAlias: userAlias,
        type: "submit",
        // repDocType: "NATIONAL_ID",
        CustomerType : ENTITY_TYPE == 'company' ? 'C' : 'I'
      })
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            // setLoading(true);
            // await getDigiScreening(digiScreeningReqObj);

            const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
            localStroragevalue.step = 7;
            setLocalStorage('auth',JSON.stringify(localStroragevalue))
            navigate(KYBVerificatioStep7,{state:{
              basic: params?.state?.basic,
              business:params?.state?.business,
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
    }
  };

  // const uploadButton = (
  //   <div>
  //     {(frontFile?.file?.name || typeof frontFile == 'string') && (documentData?.repDocFront?.[0]?.status !== "REJECTED") ? (
  //       <div className="endtoend mt-3">
  //         <div></div>
  //         <Image
  //           src={Tick}
  //           alt="circle"
  //           className="tick_upload"
  //           preview={false}
  //         />
  //       </div>
  //     ) : null}
  //     <div style={{ marginTop: typeof frontFile == 'string' || frontFile?.file?.name ? -12 : 27 }}>
  //       <Image src={Doc_large} alt="passport" preview={false} />
  //       <div className="mt-3 subText_xs overflowText w-upload">
  //         {(documentData?.repDocFront?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
  //           : (typeof frontFile == 'string') ? frontFile : frontFile?.file?.name
  //             ? frontFile?.file?.name
  //             : DOCUMENT_TYPE[value] + " front"
  //         }
  //       </div>
  //     </div>
  //   </div>
  // );

  // const uploadButton1 = (
  //   <div>
  //     {(backFile?.file?.name || typeof backFile == 'string') && (documentData?.repDocBack?.[0]?.status !== "REJECTED") ? (
  //       <div className="endtoend mt-3">
  //         <div></div>
  //         <Image
  //           src={Tick}
  //           alt="circle"
  //           className="tick_upload"
  //           preview={false}
  //         />
  //       </div>
  //     ) : null}
  //     <div style={{ marginTop: typeof backFile == 'string' || backFile?.file?.name ? -12 : 27 }}>
  //       <Image src={Doc_large} alt="passport" preview={false} />
  //       <div className="mt-3 subText_xs overflowText w-upload">
  //         {(documentData?.repDocBack?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
  //           : (typeof backFile == 'string') ? backFile : backFile?.file?.name
  //             ? backFile?.file?.name
  //             : DOCUMENT_TYPE[value] + " back"
  //         }
  //       </div>
  //     </div>
  //   </div>
  // );

  // const uploadButton2 = (
  //   <div>
  //     {(addressFile?.file?.name || typeof addressFile == 'string') && (documentData?.repAddProof?.[0]?.status !== "REJECTED") ? (
  //       <div className="endtoend mt-3">
  //         <div></div>
  //         <Image
  //           src={Tick}
  //           alt="circle"
  //           className="tick_upload"
  //           preview={false}
  //         />
  //       </div>
  //     ) : null}
  //     <div style={{ marginTop: addressFile?.file?.name || typeof addressFile == 'string' ? -12 : 27 }}>
  //       <Image src={Doc_large} alt="passport" preview={false} />
  //       <div className="mt-3 subText_xs overflowText w-upload">
  //         {(documentData?.repAddProof?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
  //           : (typeof addressFile == 'string') ? addressFile : addressFile?.file?.name ? addressFile?.file?.name : "Address proof"
  //         }
  //       </div>
  //     </div>
  //   </div>
  // );

  // const uploadButton4 = (
  //   <div>
  //     {(regProof?.file?.name || typeof regProof == 'string') && (documentData?.businessRegProof?.[0]?.status !== "REJECTED") ? (
  //       <div className="endtoend mt-3">
  //         <div></div>
  //         <Image
  //           src={Tick}
  //           alt="circle"
  //           className="tick_upload"
  //           preview={false}
  //         />
  //       </div>
  //     ) : null}
  //     <div style={{ marginTop: regProof?.file?.name || typeof regProof == 'string' ? -12 : 27 }}>
  //       <Image src={Doc_large} alt="passport" preview={false} />
  //       <div className="mt-3 subText_xs overflowText w-upload">
  //         {(documentData?.businessRegProof?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
  //           : (typeof regProof == 'string') ? regProof : regProof?.file?.name ? regProof?.file?.name : "Trade licence"
  //         }
  //       </div>
  //     </div>
  //   </div>
  // );

  // const uploadButton5 = (
  //   <div>
  //     {(regAddressProof?.file?.name || typeof regAddressProof == 'string') && (documentData?.businessAddProof?.[0]?.status !== "REJECTED") ? (
  //       <div className="endtoend mt-3">
  //         <div></div>
  //         <Image
  //           src={Tick}
  //           alt="circle"
  //           className="tick_upload"
  //           preview={false}
  //         />
  //       </div>
  //     ) : null}
  //     <div style={{ marginTop: typeof regAddressProof == 'string' || regAddressProof?.file?.name ? -12 : 27 }}>
  //       <Image src={Doc_large} alt="passport" preview={false} />
  //       <div className="mt-3 subText_xs overflowText w-upload">
  //         {(documentData?.businessAddProof?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
  //           :  (typeof regAddressProof == 'string') ? regAddressProof : regAddressProof?.file?.name ? regAddressProof?.file?.name : "MOA"
  //         }
  //       </div>
  //     </div>
  //   </div>
  // );

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
            // case DocumentType.RepAddProof:
            //   setAddressFile({});
            //   break;
            // case DocumentType.RepDocFront:
            //   sethaveuploaddocfront(0);
            //   setFrontFile({});
            //   break;
            // case DocumentType.RepDocBack:
            //   sethaveuploaddocback(0);
            //   setBackFile({});
            //   break;
            // case DocumentType.AuthorizationDoc:
            //   sethaveuploaddocauthorizationdoc(0);
            //   setAuthorizationDoc({});
            //   break;
            // case DocumentType.BusinessRegProof:
              // sethaveregproof(0);
              // setRegProof({});
              // break;
            // case DocumentType.BusinessAddProof:
            //   sethaveaddressproof(0);
            //   setRegAddressProof({});
            //   break;
            case DocumentType.VATDoc:
              sethaveuploadVatDoc(0);
              setVatDoc({});
              break;
            case DocumentType.OtherDoc:
              sethaveuploadOtherDoc(0);
              setOtherDoc({});
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

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);

  useEffect(() => {
    if(ENTITY_TYPE !== 'company' || STEP !== 6){
      navigate(-1)
    }
    else{
      setLoading(true);
    fetchKybDetails(userAlias)
      .then((res) => {
        setLoading(false);
        const documents = res.data?.data?.[0]?.documents?.[0];
        // let representative = res.data?.data?.[0]?.representative?.[0];
        setBeneficialOwnerDetails(res?.data?.data?.[0]?.shareholdersPayload);
        setRepresentativeDetails(res?.data?.data?.[0]?.representative?.[0]);
        setBasicDetails(res?.data?.data?.[0]?.basic?.[0]);
        setBusinessDetails(res?.data?.data?.[0]?.business?.[0]);
        if (documents) {
          setDocumentData(documents);
          // setValue(documents?.repDocType)
          // sethaveuploaddocfront(documents?.repDocFront?.[0]?.url ? 1 : 0);
          // sethaveuploaddocback(documents?.repDocBack?.[0]?.url ? 1 : 0);
          // sethaveaddressproof(documents?.businessAddProof?.[0]?.url ? 1 : 0);
          // sethaveregproof(documents?.businessRegProof?.[0]?.url ? 1 : 0);
          // setRegProof(documents?.businessRegProof?.[0]?.url ? documents?.businessRegProof?.[0]?.fileName : {})
          // setRegAddressProof(documents?.businessAddProof?.[0]?.url ? documents?.businessAddProof?.[0]?.fileName : {})
          // setFrontFile(documents?.repDocFront?.[0]?.url ? documents?.repDocFront?.[0]?.fileName : {})
          // setBackFile(documents?.repDocBack?.[0]?.url ? documents?.repDocBack?.[0]?.fileName : {})
          // setAddressFile(documents?.repAddProof?.[0]?.url ? documents?.repAddProof?.[0]?.fileName : {})
          // setAuthorizationDoc(documents?.authorizationDoc?.[0]?.url ? documents?.authorizationDoc?.[0]?.fileName : {});
          // sethaveuploaddocauthorizationdoc(documents?.authorizationDoc?.[0]?.url ? 1 : 0);
          // form?.setFieldsValue({
          //   repSameAddress: documents?.repSameAddress,
          //   repDocType: documents?.repDocType,
          //   docType: documents?.repDocType,
          //   docName: representative?.representativeName,
          //   docNumber: representative?.repDocNumber,
          //   expiryDate: representative?.repExpiryDate
          //     ? moment(representative?.repExpiryDate)
          //     : null,
          //   documentNationality: representative?.documentNationality
          // });
          
          
          setVatDoc(documents?.vatDoc?.[0]?.url ? documents?.vatDoc?.[0]?.fileName : {});
          sethaveuploadVatDoc(documents?.vatDoc?.[0]?.url ? 1 : 0);
          setOtherDoc(documents?.otherDoc?.[0]?.url ? documents?.otherDoc?.[0]?.fileName : {});
          sethaveuploadOtherDoc(documents?.otherDoc?.[0]?.url ? 1 : 0);
 

          setFileList(res?.data?.data?.[0]?.moaDocuments);
          setMoaDoc(res?.data?.data?.[0]?.moaDoc)
        }
        // if (res?.data?.data[0]?.basic?.length > 0 && (res?.data?.data[0]?.basic[0]?.name !== undefined || res?.data?.data[0]?.basic[0]?.name !== "") && (res?.data?.data[0]?.basic[0]?.typeOfEntity !== undefined || res?.data?.data[0]?.basic[0]?.typeOfEntity !== "")) {
          // const shareHoldersData = res?.data?.data?.[0]?.shareholdersPayload;
          // const shareholdersPayload = shareHoldersData.map((item: any) => {
          //   return {
          //     FirstName: item.FirstName,
          //     MiddleName: item.MiddleName,
          //     LastName: item.LastName,
          //     Gender: item.Gender,
          //     DOB: item.beneficialOwnerDob,
          //     Nationality: item.beneficialOwnerNationality
          //   };
          // });
          // const reqObj: Object = {
          //   CustomerType: "C",
          //   LastName: res?.data?.data?.[0]?.business?.[0]?.businessName,
          //   DOB: res?.data?.data[0]?.basic[0]?.dob ? res?.data?.data[0]?.basic[0]?.dob : "",
          //   PlaceOfBirth: res?.data?.data[0]?.basic[0]?.placeOfBirth ? res?.data?.data[0]?.basic[0]?.placeOfBirth : "",
          //   Nationality:res?.data?.data[0]?.representative?.[0]?.nationality?res?.data?.data[0]?.representative?.[0]?.nationality:"",
          //   Datasets: ['ALL'],
          //   digiScreeningType:"with_share_holder",
          //   shareholders:shareholdersPayload,
          //   ShareHolderOptions: { 
          //     "Threshold": 80, 
          //     "Datasets": [ 
          //         "ALL" 
          //     ] 
          // } 
          // }
          // setDigiScreeningReqObj(reqObj);
        // }
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Could not fetch details. Please try again later!");
      });
    getRiskConfiguration({ RiskCategory: "C" })
      .then((response) => {
        setRiskDetails(response?.data?.result)
      })
      .catch((error) => {
        message.error(error?.message ? error?.message : error);
      })
      window.scrollTo(0, 0);
    }
  }, []);

  // const getDigiScreening = async (reqObj: Object) => {
  //   try {
  //     const response = await getKyc(reqObj);

  //     if (response?.data?.status === 201 || 200) {
  //       const reqbody = {
  //         userAlias: userAlias,
  //         digiScreeningPayload: response?.data?.data?.digiScreeningPayload,
  //         ...response?.data?.data?.data
  //       }
  //       setLoading(false)
  //       await saveDigiScreening(reqbody);
  //     } else {
  //       throw (response)
  //     }
  //   } catch (error: any) {
  //     setLoading(false)
  //     message.error(error?.data?.error?.message ? error?.data?.error?.message : error?.message ? error?.message : error?.data?.error)
  //   }
  // }

  // const saveDigiScreening = async (reqbody: Object, type?: string) => {
    const saveDigiScreening = async (reqbody: object, type?: string) => {
    saveKyc(reqbody)
      .then(async (response) => {
        if (response?.data?.kycDetails?.status === 201 || response?.data?.kycDetails?.status === 200) {

          if (type == "risk_save") {
            setLoading(false);
            const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
            localStroragevalue.step = 7;
            setLocalStorage('auth',JSON.stringify(localStroragevalue))
            navigate(KYBVerificatioStep7,{state:{
              basic: params?.state?.basic,
              business:params?.state?.business,
              representativeDetails:params?.state?.representativeDetails,
              beneficialOwnerDetails:params?.state?.shareholders
            }});
          } else {
            await saveRiskAssessment();
          }
        }
      })
      .catch((error) => {
        setLoading(false)
        message.error(error?.data?.error ? error?.data?.error : "Something went wrong");
      });
  }

  const saveRiskAssessment = async () => {
    try {
      setLoading(true)
      const response = await fetchKybDetails(userAlias);

      if (response?.data?.data[0]?.basic?.length > 0 &&  (response?.data?.data[0]?.basic[0]?.typeOfEntity !== undefined || response?.data?.data[0]?.basic[0]?.typeOfEntity !== "")) {

        const reqObj = {
          reqType: "risk_assessment",
          RiskCategory: "C",
          CustomerName: response?.data?.data?.[0]?.representative?.[0]?.representativeName,
          CustomerId: response?.data?.data[0]?.digiScreeningPayload?.CustomerId,
          digiScreeningPayload: response?.data?.data[0]?.digiScreeningPayload,
          MainNationality: response?.data?.data?.[0]?.representative?.[0]?.nationality,
          caseId: response?.data?.data[0]?.kybInfo[0]?.caseId,
          isMatched: response?.data?.data[0]?.kybInfo[0]?.isMatched,
          matchScore: response?.data?.data[0]?.kybInfo[0]?.matchScore,
          highestScoringResult: response?.data?.data[0]?.kybInfo[0]?.highestScoringResult,
          shareholdersPayload: response?.data?.data[0]?.shareholdersPayload,
          shareholders:response?.data?.data[0]?.shareholders
        }
        const riskAssessmentFormPayload = response?.data?.data[0]?.riskAssessmentFormPayload;
        let riskDetails2 = riskDetails;
        if (riskDetails2?.length == 0) {
          const riskDetails1 = await getRiskConfiguration({ RiskCategory: "C" })
          if (riskDetails1?.data?.status === 200 || riskDetails1?.data?.status === 201) {
            riskDetails2 = riskDetails1?.data?.result
          }
        }

        if (riskDetails2?.length > 0) {
          const riskTypeList: any = [];

          riskAssessmentFormPayload?.riskTypes?.forEach((riskTypeId: any) => {
            const riskType = riskDetails2
              ?.flatMap((riskCategory: any) => riskCategory.riskTypes)
              ?.find((rt: any) => rt.id === riskTypeId);

            if (riskType) {
              const riskItemList = riskAssessmentFormPayload?.riskItems
                ?.map((riskItemId: any) => {
                  const riskItem = riskType.riskItems.find((ri: any) => ri.id === riskItemId);
                  return riskItem ? { Id: riskItem.id.toString() } : null;
                })
                ?.filter((item: any) => item !== null);

              if (riskItemList.length > 0) {
                riskTypeList.push({
                  Id: riskType.id.toString(),
                  RiskItemList: riskItemList,
                });
              }
            }
          });

          if (riskTypeList?.length) {
            const riskReqObj = {
              RiskTypeList: riskTypeList,
              RiskCategory: "C",
              CustomerId: response?.data?.data[0]?.digiScreeningPayload?.CustomerId,
              CustomerName: response?.data?.data?.[0]?.representative?.[0]?.representativeName,
              MainNationality: response?.data?.data?.[0]?.representative?.[0]?.nationality,
            }
            const riskAssesment = await getRiskAssessment(riskReqObj)

            if (riskAssesment?.data?.statusCode === 201 || riskAssesment?.data?.statusCode === 200) {
              const reqBoday = {
                userAlias: userAlias,
                riskAssessmentPayload: riskReqObj,
                riskAssessment: riskAssesment?.data?.user,
                riskAssessmentFormPayload: response?.data?.data[0]?.riskAssessmentFormPayload,
                customerId: response?.data?.data[0]?.digiScreeningPayload?.CustomerId,
                ...reqObj
              }
              await saveDigiScreening(reqBoday, "risk_save");
            }
          }
        } else {
          setLoading(false);
          message.error("Oops! Could not fetch details. Please try again later!");
        }
      } else {
        setLoading(false);
        throw (response)
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error?.error?.message ? error?.error?.message : "Oops! Could not fetch details. Please try again later!");
    }

  }

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
          {generateRow({ icon: Mobile, text: (params?.state?.basic?.callingCode && params?.state?.basic?.contactNumber) ? `${params?.state?.basic?.callingCode} ${params?.state?.basic?.contactNumber}` : `${basicDetails?.callingCode} ${basicDetails?.contactNumber}`})}
      </>),
    },
    {
      key: '2',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REPRESENTATIVE_OWNERS}</div><Image src={BlueTick} className="h-w-20" alt="tick" preview={false}/>
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
        <span className="step1 activeBtn pl--24px">
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

  const uploadVatDoc = {
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
          vatDoc: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState:any) =>({
          ...prevState,
          vatDoc:""
          }))
      return true;
      }
      else{
        setUploadLoading(false);
        setUploadError((prevState:any) =>({
          ...prevState,
          vatDoc:checkBeforeUpload
          }))
        return false
      }
    },
    onChange: (info: any) => {
      setUploadLoading(true);
      setDocumentData({
        ...documentData,
        vatDoc: [
          {
            url: "",
            loading: true,
          },
        ],
      });
      // const { status, response } = info?.file;
      const { status, response } = info?.file ?? {};
      if (status !== "uploading") {
        setUploadLoading(false);
        sethaveuploadVatDoc(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        if ((response?.statusCode === 201 || response?.statusCode === 200) || (response?.status === 201 || response?.status === 200)) {
          setUploadLoading(false);
          sethaveuploadVatDoc(1);
          setVatDoc(info);
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            vatDoc: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        sethaveuploadVatDoc(0);
        setDocumentData({
          ...documentData,
          vatDoc: [
            {
              loading: false,
            },
          ],
        });
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const uploadVATButton = (
    <div>
      {(vatDoc?.file?.name || typeof vatDoc == 'string') && (documentData?.vatDoc?.[0]?.status !== "REJECTED") ? (
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

      <div style={{ marginTop: vatDoc?.file?.name || typeof vatDoc == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.vatDoc?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof vatDoc == 'string') ? vatDoc : vatDoc?.file?.name ? vatDoc?.file?.name : "VAT documents"
          }
        </div>
      </div>
    </div>
  );

  const uploadOtherDoc = {
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
          otherDoc: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState:any) =>({
          ...prevState,
          otherDoc:""
          }))
      return true;
      }
      else{
        setUploadLoading(false);
        setUploadError((prevState:any) =>({
          ...prevState,
          otherDoc:checkBeforeUpload
          }))
        return false
      }
    },
    onChange: (info: any) => {
      setUploadLoading(true);
      setDocumentData({
        ...documentData,
        otherDoc: [
          {
            url: "",
            loading: true,
          },
        ],
      });
      // const { status, response } = info?.file;
      const { status, response } = info?.file ?? {};
      if (status !== "uploading") {
        setUploadLoading(false);
        sethaveuploadOtherDoc(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        if (response?.statusCode === 201 || response?.statusCode === 200 || response?.status === 201 || response?.status === 200)  {
          setUploadLoading(false);
          sethaveuploadOtherDoc(1);
          setOtherDoc(info);
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            otherDoc: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        sethaveuploadOtherDoc(0);
        setDocumentData({
          ...documentData,
          otherDoc: [
            {
              loading: false,
            },
          ],
        });
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };


  const uploadOtherDocButton = (
    <div>
      {(otherDoc?.file?.name || typeof otherDoc == 'string') && (documentData?.otherDoc?.[0]?.status !== "REJECTED") ? (
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

      <div style={{ marginTop: otherDoc?.file?.name || typeof otherDoc == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.otherDoc?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof otherDoc == 'string') ? otherDoc : otherDoc?.file?.name ? otherDoc?.file?.name : "Other documents"
          }
        </div>
      </div>
    </div>
  );
  

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    headers: { authorization: `Bearer ${Token}`, },
    data: {
      businessType: "moaDocProof",
      type: "documents",
      userAlias: userAlias,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: async (file: any, fileListToUpload: any) => {
      const totalFiles = fileList?.length + fileListToUpload?.length;
      if (totalFiles > 5) {
        message.error('You can only upload a maximum of 5 files.');
        setUploadLoading(false); 
        return false
      }

      const checkBeforeUpload = beforeUploadFile(file, "MOA")
      if (checkBeforeUpload == true) {
        setUploadLoading(true);
        setUploadError((prevState: any) => ({
          ...prevState,
          moaDocError: ""
        }))
        return true;
      }
      else {
        setUploadLoading(false);
        setUploadError((prevState: any) => ({
          ...prevState,
          moaDocError: checkBeforeUpload
        }))
        return false
      }
    },

    onChange: async (info) => {
      const { status, response } = info.file;
      if (status !== 'uploading') {
        setUploadLoading(false);
      }
      if (status === 'done') {
        setUploadLoading(false);
        if ([201, 200].includes(response?.statusCode)) {
          const updatedFileList = [...fileList, response?.data];
          setFileList(updatedFileList);
          const updatedMoa = [...(moaDoc || []), String(response?.data?.id)];
          setMoaDoc(updatedMoa);

          setUploadLoading(false);
        } else {
          setUploadLoading(false);
        }
        setUploadLoading(false);
      } else if (status === 'error') {
        setUploadLoading(false);
        setFileList([...fileList]);
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    // onDrop(e) {
    // console.log('Dropped files', e.dataTransfer.files);
    // },
  };

  const removeMoaDocument = async (id: string) => {
    setUploadLoading(true);
    const filteredMoaDocumentList = fileList && fileList?.filter((elem: any) => elem?.id !== id);
    setFileList(filteredMoaDocumentList);
    const filteredMoaDoc = (moaDoc || []).filter((doc: any) => doc !== String(id));
    const updatedMoaDoc = filteredMoaDoc.length > 0
      ? filteredMoaDoc
      : filteredMoaDocumentList.map(item => String(item.id));
    setMoaDoc(updatedMoaDoc)


    const reqObj = {
      id: id,
      userAlias: userAlias,
      docType: "moaDocProof",
      moaDoc: updatedMoaDoc
    }

    await deleteMoaDocument(reqObj)
      .then(async (response: any) => {
        if (response?.status === 201 || response?.status === 200) {
          setUploadLoading(false);
        }
      }).catch(() => {
        setUploadLoading(false);
        message.error('Something went wrong. Please try again!');
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
      {ENTITY_TYPE === 'company' && STEP === 6 ? 
      <div>
      {uploadLoading == true && (
        <div
          className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
        >
          <Spin size="large" className="mainloader"/>
        </div>
      )}
      <UserHeader step={75} />
      <div className="text-right formSubText pe-5 ps-5 pt-5 pb-0">Step 6/7</div>
      <ResponsiveSidebar step={6} />
      <div className="d-flex center_res">
        <div className="px-5 verification_sidebar mb-5">
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
        <div className="px-5 px-5-res w-100">
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
            <div className="titleText  px-3 px-md-5">Required documents</div>
          </div>
          <Form form={form} scrollToFirstError onFinish={onFinish} 
          className={Width > 768 ? "basic-info-form-block mt-5" : "basic-info-form-block mt-0"}>
            {/* <div className="stepDetails_medium">Business documents</div>
                <Row className="mt-4">
                  <div className="d-flex w-100">
                    <div className="stepDetails_medium upload_address">
                      Trade license
                    </div>
                  </div>
                </Row> */}
            <Row className="">
              <div className="d-flex flex-column flex-sm-row ml-10-res sub-doc-upload-row">
                <div className="doc-block">
                  {/* <Upload
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
                    <div className="view-delete-doc-icon">
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
                  <span className="uploaderror ant-form-item-explain-error">{uploadError?.docFront}</span> */}
                </div>
                <div className="doc-block">
              

                  {/* <Upload
                    disabled={uploadLoading}
                    maxCount={1}
                     accept={acceptedFileExtension}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    {...uploadBusinessAddress}
                    {...{
                      data: {
                        businessType: "businessAddProof",
                        type: "documents",
                        userAlias: userAlias,
                      },
                    }}
                  >
                    {uploadButton5}
                  </Upload>
                  {regAddressProof?.file?.name || typeof regAddressProof == 'string' ? (
                    <div>
                      {documentData?.businessAddProof?.[0]?.url &&
                        !documentData?.businessAddProof?.[0]?.loading && (
                          documentData?.businessAddProof?.[0]?.url &&
                            documentData?.businessAddProof?.[0]?.url.includes(".pdf") ? (
                            <span className="d-flex endtoend p-1">
                                <div className="blue_text cursor" onClick={() => {handlePDFView(documentData?.businessAddProof?.[0]?.url)}}>
                                      <Image
                                        preview={false}
                                        src={Pdf} alt="view"
                                      /> <span className="px-1" >View</span>
                                </div>
                              {documentData?.businessAddProof?.[0]?.status !==
                                "VERIFIED" && (
                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.BusinessAddProof, documentData?.businessAddProof?.[0]?.id)} className="cursor" />
                                )}
                            </span>
                          ) : (
                            <>
                              <div className="d-flex endtoend p-1">
                                <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.businessAddProof?.[0]?.url) }}>
                                  <Image
                                    preview={false}
                                    src={BlueEye} alt="view"
                                  /> <span className="px-1" >View</span>
                                </div>
                                {documentData?.businessAddProof?.[0]?.status !== "VERIFIED" && (
                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.BusinessAddProof, documentData?.businessAddProof?.[0]?.id)} className="cursor" />
                                )}
                                {documentData?.businessAddProof?.[0]?.status === "VERIFIED" && (
                                  <span className="text-green mb-2 ml-3rem">
                                    <CheckCircleOutlined /> Verified{" "}
                                  </span>
                                )}
                              </div>
                            </>
                          )
                        )}
                      {documentData?.businessAddProof?.[0]?.loading && (
                        <Spin indicator={Loader} className="ml-20" />
                      )}
                    </div>
                  ) : null}
                  <div>
                    {documentData?.businessAddProof?.[0]?.status === "REJECTED" && (
                      <Tooltip title={documentData?.businessAddProof?.[0]?.reason}>
                        <span className="rejectReasonText text-ellipsis mx-0 my-2">
                          Reason : {documentData?.businessAddProof?.[0]?.reason}
                        </span>
                      </Tooltip>
                    )}
                  </div>
                  <span className="uploaderror ant-form-item-explain-error">{uploadError?.docBack}</span> */}
                </div>
              </div>
            </Row>
            {/* <hr className="doc-seprator-line" /> */}
                <Row className={Width > 768 ? "mt-4" : "mt-4"}>
                  <div className="d-flex w-100">
                    <div className="stepDetails_medium upload_address mb-2">
                      MOA
                    </div>
                  </div>
                </Row>
                <Row>
                  <div className="w-100">
                    <div className={ "d-flex gap-5 flex-wrap moa-doc-list"}>
                      <>
                        {fileList && fileList?.map((singleFile: any) => {
                          const isPDF = singleFile?.url?.includes('.pdf');
                          const isLoading = singleFile?.loading;
                          
                          return (
                            <div key={singleFile?.id}>
                              {singleFile?.url && !isLoading && (
                                <ul className="moa-doc-list-ul mb-0">
                                  <li key={singleFile?.id} className="moa-document-image-block subText_xs">
                                    <div>
                                      {(singleFile?.file?.name || singleFile?.fileName  || typeof singleFile == 'object') && (singleFile?.status !== "REJECTED") ? (
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
                                      <div style={{ marginTop: typeof singleFile == 'object' || singleFile?.file?.name ? -12 : 27 }}>
                                        <Image src={Doc_large} alt="passport" preview={false} />
                                        <div className="mt-3 subText_xs overflowText w-upload">
                                          {(singleFile?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
                                            : (typeof singleFile == 'object') ? singleFile?.fileName || singleFile?.inputfileid: singleFile?.file?.name ? singleFile?.file?.name : singleFile?.inputfileid ? singleFile?.inputfileid : "MOA"
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  <span className="d-flex endtoend p-1">
                                    <div className="blue_text cursor" onClick={() => (isPDF ? handlePDFView(singleFile.url) : handleImagePreview(singleFile?.url))}>
                                      <Image preview={false} src={isPDF ? Pdf : BlueEye} alt="view" />
                                      <span className="px-1">View</span>
                                    </div>
                                    {singleFile?.status !== 'VERIFIED' && (
                                      <Image
                                        src={Delete}
                                        alt="Delete"
                                        preview={false}
                                        onClick={() => removeMoaDocument(singleFile.id)}
                                        className="cursor moa-doc-delete-icon"
                                      />
                                    )}
                                    {singleFile?.status === 'VERIFIED' && (
                                      <span className="text-green mb-2 ml-3rem">
                                        <CheckCircleOutlined /> Verified
                                      </span>
                                    )}
                                  </span>
                                </ul>
                              )}
                              {isLoading && (
                                <Spin indicator={Loader} className="ml-20" />
                              )}
                              {singleFile?.status === 'REJECTED' && (
                                <Tooltip title={singleFile?.reason}>
                                  <span className="rejectReasonText text-ellipsis d-block mx-0 my-2">Reason: {singleFile?.reason}</span>
                                </Tooltip>
                              )}
                            </div>
                          );
                        })}
                         {fileList?.length < 5 && (
                        <div>  
                          <Dragger {...props} className="moa-document d-block">
                          <div>
                            <div className="endtoend mt-3">
                              <div></div>

                            </div>
                            <div style={{ marginTop: (fileList && fileList?.length > 0 || typeof fileList === 'object') ? -12 : 27 }}>
                              <Image src={PlusUpload} alt="passport" preview={false} />
                              <div className="mt-3 subText_xs overflowText w-upload">
                                {fileList?.some((file: any) => file.status === 'REJECTED') ? (
                                  <span className="rejectReasonText">Re-upload</span>
                                ) : (
                                  "MOA"
                                )}
                              </div>
                            </div>
                          </div>
                        </Dragger>
                          {uploadError?.moaDocError && uploadError?.moaDocError !== undefined && uploadError?.moaDocError !== '' && (
                            <span className="uploaderror ant-form-item-explain-error">{uploadError?.moaDocError}</span>
                          )}
                        </div>)}
                      </>
                    </div>
                
                  </div>
                </Row>
                
            {/* <div className="stepDetails_medium">Representative documents</div>
            <div className="doc-upload-row">
              <div>
                <Row className="mt-4">
                  <div className="d-flex w-100">
                    <Radio.Group onChange={onChange} value={value} >
                      <Radio value="NATIONAL_ID" className="mx-4">
                        National id
                      </Radio>
                      <Radio value="PASSPORT" disabled>Passport</Radio>
                    </Radio.Group>
                  </div>
                </Row>
                <Row>
                  <div>
                    <div className="d-flex doc-upload-block sub-doc-upload-row">
                      <div className="doc-block">
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
                        {documentData?.repDocFront?.[0]?.status === "REJECTED" && (
                          <Tooltip title={documentData?.repDocFront?.[0]?.reason}>
                            <span className="rejectReasonText text-ellipsis mx-0 my-2">
                              Reason : {documentData?.repDocFront?.[0]?.reason}
                            </span>
                          </Tooltip>
                        )}
                        {haveuploaddocfront != 1 && formTouched === true ? <div className="errMsg px-2">Proof Required!</div> : ""}
                      </div>
                      <div className="doc-block">
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
                        {documentData?.repDocBack?.[0]?.status === "REJECTED" && (
                          <Tooltip title={documentData?.repDocBack?.[0]?.reason}>
                            <span className="rejectReasonText text-ellipsis mx-0 my-2">
                              Reason : {documentData?.repDocBack?.[0]?.reason}
                            </span>
                          </Tooltip>
                        )}
                      {haveuploaddocback != 1 && formTouched === true ? <div className="errMsg mx-4 px-2">Proof required!</div> : ""}
                      </div>
                    </div>
                  </div>
                </Row>
              </div>
              <div >
                <div className="mt-4">
                  <div className="d-flex w-100">
                    <div className="stepDetails_medium upload_address">
                      Address proof (optional)
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
                        {documentData?.repAddProof?.[0]?.status === "REJECTED" && (
                          <Tooltip title={documentData?.repAddProof?.[0]?.reason}>
                            <span className="rejectReasonText text-ellipsis mx-0 my-2">
                              Reason : {documentData?.repAddProof?.[0]?.reason}
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
              <div>
                <Row className="mt-4">
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
                                    <div className="blue_text cursor" onClick={() => {handlePDFView(documentData?.authorizationDoc?.[0]?.url)}}>
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

                      {documentData?.authorizationDoc?.[0]?.status === "REJECTED" && (
                        <Tooltip title={documentData?.authorizationDoc?.[0]?.reason}>
                          <span className="rejectReasonText text-ellipsis mx-0 my-2">
                            Reason :  {documentData?.authorizationDoc?.[0]?.reason}
                          </span>
                        </Tooltip>
                      )}
                      {haveuploaddocauthorizationdoc != 1 && formTouched === true ? <div className="errMsg px-2">Authorization document required!</div> : ""}
                    </div>
                  </div>
                </Row>
              </div>
            </div> */}

             


                <hr className="doc-seprator-line" />
                <div className="stepDetails_medium">VAT & others</div>
                <div className="doc-upload-row vat-other-doc-upload">
                  <div>
                    <Row className="mt-4">
                      <div className="d-flex w-100">
                        <div className="stepDetails_medium upload_address">
                          VAT document
                        </div>
                      </div>
                    </Row>
                    <Row>
                      <div className={Width > 768 ? "d-flex upload-docs" : "d-flex upload-docs"}>
                        <div className="upload_address doc-block">
                          <Upload
                            disabled={uploadLoading}
                            listType="picture-card"
                            className="avatar-uploader"
                            accept={acceptedFileExtension}
                            maxCount={1}
                            showUploadList={false}
                            {...uploadVatDoc}
                            {...{
                              data: {
                                businessType: "vatDoc",
                                type: "documents",
                                userAlias: userAlias,
                              },
                            }}
                          >
                            {uploadVATButton}
                          </Upload>
                          {vatDoc?.file?.name || typeof vatDoc == 'string' ? (
                            <div className="view-delete-doc-icon">
                              {documentData?.vatDoc?.[0]?.url &&
                                !documentData?.vatDoc?.[0]?.loading && (
                                  documentData?.vatDoc?.[0]?.url &&
                                    documentData?.vatDoc?.[0]?.url.includes(".pdf") ? (
                                    <span className="d-flex endtoend px-2">
                                      <div className="blue_text cursor" onClick={() => { handlePDFView(documentData?.vatDoc?.[0]?.url) }}>
                                        <Image
                                          preview={false}
                                          src={Pdf} alt="view"
                                        /> <span className="px-1" >View</span>
                                      </div>
                                      {documentData?.vatDoc?.[0]?.status !==
                                        "VERIFIED" && (
                                          <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.VATDoc, documentData?.vatDoc?.[0]?.id)} className="cursor" />
                                        )}
                                    </span>
                                  ) : (
                                    <>
                                      <div className="d-flex endtoend px-2">
                                        <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.vatDoc?.[0]?.url) }}>
                                          <Image
                                            preview={false}
                                            src={BlueEye} alt="view"
                                          /> <span className="px-1" >View</span>
                                        </div>
                                        {documentData?.vatDoc?.[0]?.status !== "VERIFIED" && (
                                          <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.VATDoc, documentData?.vatDoc?.[0]?.id)} className="cursor" />
                                        )}
                                        {documentData?.vatDoc?.[0]?.status === "VERIFIED" && (
                                          <span className="text-green mb-2 ml-3rem">
                                            <CheckCircleOutlined /> Verified
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )
                                )}
                              {documentData?.vatDoc?.[0]?.loading && (
                                <Spin indicator={Loader} className="ml-20" />
                              )}
                             
                            </div>
                          ) : null}
                          <div>
                            {documentData?.vatDoc?.[0]?.status === "REJECTED" && (
                              <Tooltip title={documentData?.vatDoc?.[0]?.reason}>
                                <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                  Reason :  {documentData?.vatDoc?.[0]?.reason}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                             <span className="uploaderror ant-form-item-explain-error">{uploadError?.vatDoc}</span>
                          {haveuploadVatDoc != 1 && formTouched === true ?"" : ""}
                        </div>
                      </div>
                    </Row>
                  </div>
                  <div>
                  </div>
                  <div>
                    <Row className="mt-4">
                      <div className="d-flex w-100">
                        <div className="stepDetails_medium upload_address">
                          Other document
                        </div>
                      </div>
                    </Row>
                    <Row>
                      <div className="d-flex upload-docs">
                        <div className="upload_address doc-block">
                          <Upload
                            disabled={uploadLoading}
                            listType="picture-card"
                            className="avatar-uploader"
                            accept={acceptedFileExtension}
                            maxCount={1}
                            showUploadList={false}
                            {...uploadOtherDoc}
                            {...{
                              data: {
                                businessType: "otherDoc",
                                type: "documents",
                                userAlias: userAlias,
                              },
                            }}
                          >
                            {uploadOtherDocButton}
                          </Upload>
                          {otherDoc?.file?.name || typeof otherDoc == 'string' ? (
                            <div className="view-delete-doc-icon">
                              {documentData?.otherDoc?.[0]?.url &&
                                !documentData?.otherDoc?.[0]?.loading && (
                                  documentData?.otherDoc?.[0]?.url &&
                                    documentData?.otherDoc?.[0]?.url.includes(".pdf") ? (
                                    <span className="d-flex endtoend px-2">
                                      <div className="blue_text cursor" onClick={() => { handlePDFView(documentData?.otherDoc?.[0]?.url) }}>
                                        <Image
                                          preview={false}
                                          src={Pdf} alt="view"
                                        /> <span className="px-1" >View</span>
                                      </div>
                                      {documentData?.otherDoc?.[0]?.status !==
                                        "VERIFIED" && (
                                          <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.OtherDoc, documentData?.otherDoc?.[0]?.id)} className="cursor" />
                                        )}
                                    </span>
                                  ) : (
                                    <>
                                      <div className="d-flex endtoend px-2">
                                        <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.otherDoc?.[0]?.url) }}>
                                          <Image
                                            preview={false}
                                            src={BlueEye} alt="view"
                                          /> <span className="px-1" >View</span>
                                        </div>
                                        {documentData?.otherDoc?.[0]?.status !== "VERIFIED" && (
                                          <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.OtherDoc, documentData?.otherDoc?.[0]?.id)} className="cursor" />
                                        )}
                                        {documentData?.otherDoc?.[0]?.status === "VERIFIED" && (
                                          <span className="text-green mb-2 ml-3rem">
                                            <CheckCircleOutlined /> Verified
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )
                                )}
                              {documentData?.otherDoc?.[0]?.loading && (
                                <Spin indicator={Loader} className="ml-20" />
                              )}
                            </div>
                          ) : null}
                          <div>
                            {documentData?.otherDoc?.[0]?.status === "REJECTED" && (
                              <Tooltip title={documentData?.otherDoc?.[0]?.reason}>
                                <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                  Reason :  {documentData?.otherDoc?.[0]?.reason}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                            <span className="uploaderror ant-form-item-explain-error">{uploadError?.otherDoc}</span>
                          {haveuploadOtherDoc != 1 && formTouched === true ? "" : ""}
                        </div>
                      </div>
                    </Row>
                  </div>

                 


                </div>
            <Row className="">
              <div className="d-flex my-4 step-control-btn">
                {
                // (regProof?.file || typeof regProof === 'string') && (regAddressProof?.file || typeof regAddressProof === 'string') 
                // && (frontFile?.file || typeof frontFile === 'string') && (backFile?.file || typeof backFile === 'string')  && (authorizationDoc?.file || typeof authorizationDoc === 'string') 
               (fileList && fileList?.length > 0)
                && (
                  // documentData?.businessRegProof?.[0]?.status !== "REJECTED" &&
                  documentData?.businessAddProof?.[0]?.status !== "REJECTED" )
                  //&&
                  // documentData?.repDocFront?.[0]?.status !== "REJECTED" &&
                  // documentData?.repDocBack?.[0]?.status !== "REJECTED" &&
                  // documentData?.authorizationDoc?.[0]?.status !== "REJECTED")
                   ?
                  <Button className="rounded" htmlType="submit" onClick={() => { setformTouched(true) }} disabled={uploadLoading} loading={loading}>{uploadLoading ? "Please wait..." : "Save & Next"}</Button>
                  : <Button className="rounded disabled loading-submit-btn" loading={uploadLoading}>{uploadLoading ? "Please wait..." : "Save & Next"}</Button>}
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

export default CompanyStep6;
