import { MailOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tabs,
  Tooltip,
  Typography,
  UploadProps
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import { Option } from "antd/lib/mentions";
import TabPane from "antd/lib/tabs/TabPane";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { useNavigate } from "react-router-dom";
import Country from "../../assets/img/Country.svg";
import LeftArrow from "../../assets/img/leftArrow.svg";
import PlusUpload from "../../assets/img/PlusUpload.svg";
import ReceivedData from '../../assets/img/recived_data.svg';
import SendData from '../../assets/img/send_data.svg';
import User from "../../assets/img/User_Full.svg";
import infoIcon from "../../assets/img/informIcon.svg"
import { fetchSellerVrfnDetails, finishSupplier, finishsupplierverifydoc, kybverification, updateSupplier } from "../../services/cheque";
import RiskAssesmentCard from "../Admin/RiskAssesmentCard";
import { beforeUploadFile, COMMON_DATA_SETS_ARR, CORPORATES_DATA_SETS_ARR, DateWithUtcOffset, getLocalStorage, isValidValue, KYC_KYB_COMMENT_TEXT_LIMIT } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
import { Dashboard, SelllerManagementList } from "../Common/RouteConst";
import SubApproverDetails from "../Common/SubApproverDetails";
import DisputePdfViewModal from "../Models/DisputePdfViewModal";
import { PrimaryOutLineButton, SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import { InputText } from "../ui-elements/InputsRepo";
const { Text } = Typography;
// import BlueEye from "../../assets/img/blueEye.svg";
import download from "../../assets/img/Download.svg";
import { getRiskConfiguration } from "../../services/admin";
import PDFPreview from "../Common/PdfPreviewIcon";

const SupplierGuestDetails = ():any => {
  
  const navigate = useNavigate();
  
  const [CommentModal, setCommentModal] = useState(false);
  const [CommentModalReject, SetCommentModalReject] = useState(false); 
  const [modalTitle, setModalTitle] = useState("");
  const [loader, setLoader] = useState(false);
  const [comment, setComment] = useState("");
  const [ApproveModal, setApproveModal] = useState(false);
  const [RejectModal, setRejectModal] = useState(false);
  const [dropDownValue, setDropDownValue] = useState<any>(1);
  const userAlias = window?.location?.pathname.split("/").pop();
  const currentUserAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const name = JSON.parse(getLocalStorage("auth")!)?.name;
  const [supplierDetails, setSeller] = useState<any>({});
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadedFile, setuploadedFile] = useState<any>();
  const [fileList, setFileList] = useState<any[]>([]);
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const local = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); 
  const [commentForm] = Form.useForm(); 
  const [professionTypeId, setProfessionTypeId] = useState(0)
  const [professionTypeList, setProfessionTypeList] = useState([])
  const [residenceStatusTypeId, setResidenceStatusTypeId] = useState(0);
  const [residenceStatusList, setResidenceStatusList] = useState([]);
  const [businessNatureTypeId, setBusinessNatureTypeId] = useState([]);
  const [businessNatureList, setBusinessNatureList] = useState([]);
  const [disable, setDisable] = useState<boolean>(false);
  
  const [nameAndIdVerification, setNameAndIdVerification] = useState(false);
  const [validDocumentVerification, setValidDocumentVerification] =  useState(false);
  const [amlScreening, setAmlScreening] = useState(false);
  const [adverseMedia, setAdverseMedia] = useState(false);
  const [checkboxComment, setCheckboxComment] = useState<any>({});
  const [checkboxCommentApprover, setCheckboxCommentApprover] = useState<any>({});
  // const [successModal, setSuccessModal] = useState(false);
  const [PoliticallyPerson, setPoliticallyPerson] = useState(false);
  const [otherComment, setOtherComment] = useState<boolean>(false);
 
  const [uploadLoading, setUploadLoading] = useState(false);
  const [validDocumentVerificationComment, setValidDocumentVerificationComment] = useState<any>();
  const [amlScreeningComment, setAmlScreeningComment] = useState<any>();
  const [adverseMediaComment, setAdverseMediaComment] = useState<any>();
  const [nameAndIdVerificationComment, setNameAndIdVerificationComment] = useState<any>();
  const [otherCommentAndNotesComment, setOtherCommentAndNotesComment] = useState<any>();
  const [politicallyExposedPersonComment, setPoliticallyExposedPersonComment] = useState<any>();
  
  const isApprover = ['TRUSTEE','MAKER'].includes(userType);
  
  const [kybInfo, setKybInfo] = useState<any>({});
  const [digiScreeningPayload, setDigiScreeningPayload] = useState<any>({});
  const [riskAssessment, setRiskAssessment] = useState({});
  const [searchAgianKybModal, setSearchAgianKybModal] =useState<boolean>(false);
  const datasetsOptions = [...COMMON_DATA_SETS_ARR, ...CORPORATES_DATA_SETS_ARR];
  const [datasetValue, setDatasetValue] = useState<any>([]);
  const [searchAgainForm] = Form.useForm(); 
  const [countryList, setCountryList] = useState([]);
  const [countryofIncorporationTypeId, setCountryofIncorporationTypeId] = useState(0); 
  const [incoporationCountryList, setIncoporationCountryList] = useState([]);
  const [fatfList, setFatfList] = useState([]);
  const [fatfTypeId, setFatfTypeId] = useState(0);
  const [searchAgainResponse, setSearchAgainResponse] = useState<any>({});

  const [imagUrl, setImagUrl] = useState<any>("");
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [viewModal, setViewModal] =useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<any>();
  const [specialErrors, setSpecialErrors] = useState<Record<string, boolean>>({});
  

  
  // const validateTypeOfBusiness = (e: any) => {
  //   const result: string = e.target.value.replace(OnlyText, "");
  //   form.setFieldsValue({ typeOfBusiness: result });
  // };


  const validateCommentField = (
    value: any,
    fieldName: string,
    setSpecialErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    if (!value || value.trim() === '') {
      setSpecialErrors(prev => ({ ...prev, [fieldName]: false }));
      return Promise.resolve();
    }
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value))  {
      setSpecialErrors(prev => ({ ...prev, [fieldName]: true }));
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    setSpecialErrors(prev => ({ ...prev, [fieldName]: false }));
    if (value.length < 20) {
      return Promise.reject(new Error("Please enter minimum 20 characters"));
    }
    return Promise.resolve();
  };

  const validatePopupCommentFields = (value: any) => {
    if (!value || value.trim() === '') {
      return Promise.reject(new Error("Please add some comment!"));
    }
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    if (value.length < 20) {
      return Promise.reject(new Error("Please enter minimum 20 characters"));
    }
    return Promise.resolve();
  };
  
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  useEffect(() => {
    getSellerDetails();
  }, []);

  const onEntityChange = async (entityType : string)=>{
    const entity = entityType == "COMPANY" ? "C" : "I";
    await getRiskConfigurationDetails(entity);
    form.setFieldsValue({
      countryofIncorporation : null,
      natureofBusiness : null,
      profession : null,
      residenceStatus : null,
    })
    setSelectedDate(null);
  }

  const getRiskData = async (data : any)=> {
     const entityType = data.typeOfEntity == "COMPANY" ? "C" : "I";
      await getRiskConfigurationDetails(entityType);
  } 


  const onSellerData = async (userAlias : string)=> {
    
        const response  = await fetchSellerVrfnDetails(userAlias);
        const data = response.data.res;
        setKybInfo(data.kybInfo[0]);
        setDigiScreeningPayload(data?.digiScreeningPayload);
        setRiskAssessment(data?.riskAssessment);
        setSeller(data); 
        form.setFieldsValue({
          docName: data.name,
          email: data.email,
          ContractNumber: data.contactnumber,
          Nationality: data.country_name ? data.country_name : data.countryalias,
          sellerNationality: data?.sellerNationalityName?data?.sellerNationalityName: data.sellerNationality,
          dob: data?.dob ? dayjs(data.dob) : null,
          typeOfBusiness : data.typeOfBusiness,
          typeOfEntity : data.typeOfEntity,
          CustomerType :  data.typeOfEntity == "COMPANY" ? "C" : "I",
          
          profession : Number(data?.profession) || null,   //C
          countryofIncorporation : data?.countryofIncorporation || null, //C
          

          natureofBusiness : data?.natureofBusiness || null, //I
          residenceStatus : data?.residenceStatus || null,   //I
          
        })
        if(data?.dob){
          setSelectedDate(dayjs(data.dob).format("DD-MM-YYYY"))
        }
        if(data?.professionTypeId){
          setProfessionTypeId(data.professionTypeId);
        }
        if(data?.residenceStatusTypeId){
          setResidenceStatusTypeId(data.residenceStatusTypeId);
        }
        if (data && data.digiScreeningPayload) {
          setFormValues(searchAgainForm,data?.digiScreeningPayload)
        }
        setSearchAgainResponse({
          highestScoringResult : data?.highestScoringResult,
          caseId : data.caseId,
          customerId : data.customerId,
          isMatched : data.isMatched,
          digiScreeningPayload: data.digiScreeningPayload,
          riskAssessmentPayload: data.riskPayLoad,
          riskAssessment: data.riskAssesment,
          professionTypeId : data.professionTypeId,
          residenceStatusTypeId : data.residenceStatusTypeId,
          customerProfession : data.customerProfession,
          residenceStatus : data.residenceStatus,
          fatf : data.fatf
        })
        const comments = {
          amlScreening: data?.adminComments?.amlScreeningComment,
          adverseMedia: data?.adminComments?.adverseMediaComment,
          nameAndIdVerification: data?.adminComments?.nameAndIdVerificationComment,
          validDocumentVerification: data?.adminComments?.validDocumentVerificationComment,
          otherCommentAndNotes: data?.adminComments?.otherCommentAndNotes,
          PoliticallyExposedPersonComment: data?.adminComments?.PoliticallyExposedPersonComment,
            
        };
        
        setCheckboxComment(comments);
        // approver comments
        const commentsApprover = {
          amlScreening: data?.approverComments?.amlScreeningComment,
          adverseMedia: data?.approverComments?.adverseMediaComment,
          nameAndIdVerification:
            data?.approverComments?.nameAndIdVerificationComment,
          validDocumentVerification:
            data?.approverComments?.validDocumentVerificationComment,
          otherCommentAndNotes: data?.approverComments?.otherCommentAndNotes,
          PoliticallyExposedPersonComment: data?.approverComments?.PoliticallyExposedPersonComment,
        };
   
        if (data.verifiedRole === "TRUSTEE"  || data.authVerifiedRole === "AUTHORIZER") {
          setDisable(false);
           if (data?.approverComments && userType === "TRUSTEE") {
            setValidDocumentVerification(!!data?.approverComments?.validDocumentVerificationComment)
            setNameAndIdVerification(!!data?.approverComments?.nameAndIdVerificationComment)
            setAmlScreening(!!data?.approverComments?.amlScreeningComment)
            setAdverseMedia(!!data?.approverComments?.adverseMediaComment)
            setPoliticallyPerson(!!data?.approverComments?.PoliticallyExposedPersonComment)
            setOtherComment(!!data?.approverComments?.otherCommentAndNotes)
          }else if (data?.adminComments && (userType === "AUTHORIZER" || userType === "ADMIN")) {
            setValidDocumentVerification(!!data?.adminComments?.validDocumentVerificationComment);
            setNameAndIdVerification(!!data?.adminComments?.nameAndIdVerificationComment);
            setAmlScreening(!!data?.adminComments?.amlScreeningComment);
            setAdverseMedia(!!data?.adminComments?.adverseMediaComment);
            setPoliticallyPerson(!!data?.adminComments?.PoliticallyExposedPersonComment);
            setOtherComment(!!data?.adminComments?.otherCommentAndNotes);
          }
          // setDropDownValue(0)
        }

          setDropDownValue(data?.riskRating);
        
          setCheckboxCommentApprover(commentsApprover);
          // set approver comments
          setApproverComments(commentsApprover)
 
        
          if(data.uploadedDocuments && data.uploadedDocuments.length) {
            const docs = [];
            data.uploadedDocuments.forEach((documents: any) => {
              if(userType == 'TRUSTEE'){
                documents.status = documents.isCompliance ? "VERIFIED" : "REJECTED";
              } else {
                documents.status = documents.verified;
              }
              docs.push(documents);
            });
            setFileList(data.uploadedDocuments);
          } 

          return data;
  }
 
  const getSellerDetails  = async () => {
    setLoading(true);

    if(userAlias){
      const data = await onSellerData(userAlias);
      getRiskData(data);
    }

    // fetchSellerVrfnDetails(userAlias).then(async (response: any) => {

          
    //     const data = response.data.res;
    //     const entityType = data.typeOfEntity == "COMPANY" ? "C" : "I";
    //     await getRiskConfigurationDetails(entityType);

    //     setKybInfo(data.kybInfo[0]);
    //     setDigiScreeningPayload(data?.digiScreeningPayload);
    //     setRiskAssessment(data?.riskAssessment);
    //     setSeller(data); 
    //     form.setFieldsValue({
    //       docName: data.name,
    //       email: data.email,
    //       ContractNumber: data.contactnumber,
    //       Nationality: data.country_name ? data.country_name : data.countryalias,
    //       dob: data?.dob ? dayjs(data.dob) : null,
    //       typeOfBusiness : data.typeOfBusiness,
    //       typeOfEntity : data.typeOfEntity,
    //       CustomerType :  data.typeOfEntity == "COMPANY" ? "C" : "I",
          
    //       profession : Number(data?.profession) || null,   //C
    //       countryofIncorporation : data?.countryofIncorporation || null, //C
          

    //       natureofBusiness : data?.natureofBusiness || null, //I
    //       residenceStatus : data?.residenceStatus || null,   //I
          
    //     })
    //     if(data?.dob){
    //       setSelectedDate(dayjs(data.dob).format("DD-MM-YYYY"))
    //     }
    //     if(data?.professionTypeId){
    //       setProfessionTypeId(data.professionTypeId);
    //     }
    //     if(data?.residenceStatusTypeId){
    //       setResidenceStatusTypeId(data.residenceStatusTypeId);
    //     }
    //     if (data && data.digiScreeningPayload) {
    //       setFormValues(searchAgainForm,data?.digiScreeningPayload)
    //     }
    //     setSearchAgainResponse({
    //       highestScoringResult : data?.highestScoringResult,
    //       caseId : data.caseId,
    //       customerId : data.customerId,
    //       isMatched : data.isMatched,
    //       digiScreeningPayload: data.digiScreeningPayload,
    //       riskAssessmentPayload: data.riskPayLoad,
    //       riskAssessment: data.riskAssesment,
    //       professionTypeId : data.professionTypeId,
    //       residenceStatusTypeId : data.residenceStatusTypeId,
    //       customerProfession : data.customerProfession,
    //       residenceStatus : data.residenceStatus,
    //       fatf : data.fatf
    //     })
    //     const comments = {
    //       amlScreening: data?.adminComments?.amlScreeningComment,
    //       adverseMedia: data?.adminComments?.adverseMediaComment,
    //       nameAndIdVerification:
    //         data?.adminComments?.nameAndIdVerificationComment,
    //       validDocumentVerification:
    //         data?.adminComments?.validDocumentVerificationComment,
    //         otherCommentAndNotes: data?.adminComments?.otherCommentAndNotes,
    //     };
        
    //     setCheckboxComment(comments);
    //     // approver comments
    //     const commentsApprover = {
    //       amlScreening: data?.approverComments?.amlScreeningComment,
    //       adverseMedia: data?.approverComments?.adverseMediaComment,
    //       nameAndIdVerification:
    //         data?.approverComments?.nameAndIdVerificationComment,
    //       validDocumentVerification:
    //         data?.approverComments?.validDocumentVerificationComment,
    //       otherCommentAndNotes: data?.approverComments?.otherCommentAndNotes,
    //       PoliticallyExposedPersonComment: data?.approverComments?.PoliticallyExposedPersonComment,
    //     };
   
    //     if ((data.verifiedRole === "TRUSTEE" && userType === "TRUSTEE") || (data.verifiedRole === "AUTHORIZER")) {
    //       setDisable(false);
    //       setValidDocumentVerification(!!data?.approverComments?.validDocumentVerificationComment)
    //       setNameAndIdVerification(!!data?.approverComments?.nameAndIdVerificationComment)
    //       setAmlScreening(!!data?.approverComments?.amlScreeningComment)
    //       setAdverseMedia(!!data?.approverComments?.adverseMediaComment)
    //       setPoliticallyPerson(!!data?.approverComments?.PoliticallyExposedPersonComment)
    //       setOtherComment(!!data?.approverComments?.otherCommentAndNotes)
    //       // setDropDownValue(0)
    //     }

    //       setDropDownValue(data?.riskRating);
        
    //       setCheckboxCommentApprover(commentsApprover);
    //       // set approver comments
    //       setApproverComments(commentsApprover)
 
        
    //       if(data.uploadedDocuments && data.uploadedDocuments.length) {
    //         const docs = [];
    //         data.uploadedDocuments.forEach((documents: any) => {
    //           if(userType == 'TRUSTEE'){
    //             documents.status = documents.isCompliance ? "VERIFIED" : "REJECTED";
    //           } else {
    //             documents.status = documents.verified;
    //           }
    //           docs.push(documents);
    //         });
    //         setFileList(data.uploadedDocuments);
    //       }
    //       setLoading(false);
    //   },()=>{
    //     setLoading(false);
    //       message.error("Something went wrong.")
    //   });
  }

  const openApproveModal = () => {
    setApproveModal(true);
  };

  const openRejectModal = () => {
    setRejectModal(true);
  };

  const goBack = () => {
    // navigate();
    navigate(SelllerManagementList);
  };
  
  const downloadFile = (url: string | undefined) => {
    if (!url) return; 
    const link = document.createElement("a");
    link.href = url; 
    link.setAttribute("download", "file"); 
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link); 
  };
  
  
  const handleModalCancel = () => { 
    setCommentModal(false);
    setApproveModal(false);
    setRejectModal(false); 
    SetCommentModalReject(false);
    form.resetFields(["comment"])
    commentForm.resetFields(["comment"])
    setComment("");
  };

  const handleComment = (event: any) => {
    setComment(event.target.value);
  };

  // const handleInput = (e:any) => {
  //   const regex = /^[A-Za-z,.\- ]*$/; 
  //   const currentValue = e.target.value;
  //   if (!regex.test(currentValue)) {
  //     e.preventDefault();
  //     e.target.value = currentValue.slice(0, -1); 
  //   } 
  //   // else {
  //   //   adjustHeight("validDocumentVerification", currentValue);
  //   // }
  // };

  const handleDropdownChange = (e: any) => {
    setDropDownValue(e?.target?.value);
    if(disable){
      openClassificationModal();
      form.setFieldValue("title", e.target.value);
    }
  };
  const openClassificationModal = () => { 
  };
  
  const propss: UploadProps = {
    name: 'file',
    multiple: true,
    maxCount:10,
    headers: { authorization: `Bearer ${Token}`, },
    data: {
      businessType: "moaDocProof",
      type: "documents",
      userAlias: userAlias,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/supplier-verification/uploadDocument",
    beforeUpload: async (file: any, fileListToUpload: any) => {
      const totalFiles = fileList?.length + fileListToUpload?.length;
      if (totalFiles > 10) {
        message.error('You can only upload a maximum of 10 files.');
        return false
      }

      const checkBeforeUpload = beforeUploadFile(file,"Document")
      if (checkBeforeUpload == true) {
        setLoader(true);
        return true;
      }
      else {
        setLoader(false);
        return false
      }
    },

    onChange: async (info) => {
      const { status, response } = info.file;
      if (status !== 'uploading') {
        setLoader(false);
      }
      if (status === 'done') {
        setLoader(false); 
        if ([201, 200].includes(response?.statusCode)) {
          setuploadedFile(response?.data);
          setLoader(false);
        } else {
          setLoader(false);
        }
        setLoader(false);
      } else if (status === 'error') {
        setLoader(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };


  const verifySupplier = (type: string) => { 
    if(!(userType === 'AUTHORIZER' || userType === 'TRUSTEE')){
      message.warning(`You don't have rights.`);
      return;
    }
    if(type == "approved" && !supplierDetails?.customerId){
      message.warning(`Digiscreening verification pending.`);
      return;
    }
    
    setLoading(true);
      const adminCompanyComments = {
        adverseMediaComment: checkboxComment.adverseMedia,
        amlScreeningComment: checkboxComment.amlScreening,
        nameAndIdVerificationComment: checkboxComment.nameAndIdVerification,
        PoliticallyExposedPersonComment:
          checkboxComment?.PoliticallyExposedPersonComment,
        validDocumentVerificationComment:
          checkboxComment.validDocumentVerification,
          otherCommentAndNotes:checkboxComment.otherCommentAndNotes,
      }
      const approverCompanyComments = {
        adverseMediaComment: checkboxCommentApprover.adverseMedia,
        amlScreeningComment: checkboxCommentApprover.amlScreening,
        nameAndIdVerificationComment:
          checkboxCommentApprover.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentApprover.validDocumentVerification,
        PoliticallyExposedPersonComment:
          checkboxCommentApprover?.PoliticallyExposedPersonComment,
          otherCommentAndNotes:checkboxCommentApprover.otherCommentAndNotes,
      }
      let status = "PENDING"

      if(type == 'rejected'){
        status = 'REJECTED';
      }else if(userType == 'AUTHORIZER' && type == 'approved'){
        status = 'VERIFIED';
      }
   

      
    let reqBody:any = {
      userAlias: userAlias,
      kybStatus: status,
      validDocumentVerification:
        validDocumentVerification === undefined
          ? supplierDetails?.validDocumentVerification === true
            ? true
            : false
          : validDocumentVerification,
     
      // Checkbox textarea values
      adminComments: adminCompanyComments,
      approverComments: approverCompanyComments,
    };

    if (userType === "TRUSTEE") {
      reqBody = {
        ...reqBody,
        trusteeKybStatus: status === 'PENDING' || false,
        isTrusteeKybRejected: status === 'REJECTED' || false
      } 
    }
    
    if (isApprover) {
      reqBody.trusteeComment = comment;
    } else {
      reqBody.comment = comment;
    }

    reqBody.documents = fileList.map((a,i)=> {
      const keyName  = `documentid_${i}`;
      return  { [keyName] : a.id, document: a.document , expirydate : a.expirydate }}
    );
     
    if(userType === "TRUSTEE"){
      reqBody.verifiedName = name;
      reqBody.verifiedRole = userType;
      reqBody.verifiedTime = new Date();
    }else {
      reqBody.authVerifiedName = name;
      reqBody.authVerifiedRole = userType;
      reqBody.authVerifiedTime = new Date();
    }
    reqBody.riskRating = dropDownValue;

    if(supplierDetails.uploadedDocuments.map((a: any)=>a.status).includes("REJECTED") && type != 'rejected'){
      setLoading(false);
      handleModalCancel();
      message.warning("Seller documents are rejected.");
      return;
    }
 
    finishSupplier(userAlias, reqBody)
        .then((res: any) => {
          setLoading(false);
          if (res?.status === 201 || res?.status == 200) {
            // setSuccessModal(true);
            handleModalCancel();
            navigate(SelllerManagementList);
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later");
        });
  };

  const isAllChecklistChecked = () => {
    return (
      validDocumentVerification &&
      nameAndIdVerification &&
      amlScreening &&
      adverseMedia &&
      PoliticallyPerson &&
      otherComment   
    );
  };

  const checkCommentsCheckbox = (id:any) =>{
    switch (id) {
      case "validDocumentVerification":
        setValidDocumentVerification(true)
        break;
      case "nameAndIdVerification":
        setNameAndIdVerification(true)
        break;
      case "amlScreening":
        setAmlScreening(true)
        break;
      case "adverseMedia":
        setAdverseMedia(true)
        break;
      case "PoliticallyExposedPersonComment":
        setPoliticallyPerson(true)
        break;
      case "otherCommentAndNotes":
        setOtherComment(true)
        break;
                    
      default:
        break;
    }

  }

  const adjustHeight = (id: string, value: string) => {
    if(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)){
    // const element = document.getElementById(id)!;
    // element.style.height = "1px";
    // element.style.height = 25 + element.scrollHeight + "px";
    const comments = { ...checkboxComment };
    comments[id] = value;
    setCheckboxComment(comments);
    checkCommentsCheckbox(id)
    }
  };

  const adjustHeightForApprover = (id: string, value: string) => {
    if(userType === 'TRUSTEE' || userType === 'MAKER'){
    // const element = document.getElementById(id+'Approver')!;
    // element.style.height = "1px";
    // element.style.height = 25 + element.scrollHeight + "px";
    const comments = { ...checkboxCommentApprover };
    comments[id] = value;
    setCheckboxCommentApprover(comments);
    checkCommentsCheckbox(id)
    }
  };

  const setApproverComments = (data: any) => {
    setValidDocumentVerificationComment({
      data: data?.validDocumentVerification, 
      loaded: true
    })
    setAmlScreeningComment({
      data: data?.amlScreening, 
      loaded: true
    })
    setAdverseMediaComment({
      data: data?.adverseMedia, 
      loaded: true
    })
    setNameAndIdVerificationComment({
      data: data?.nameAndIdVerification, 
      loaded: true
    })
    setOtherCommentAndNotesComment({
      data: data?.otherCommentAndNotes, 
      loaded: true
    })
    setPoliticallyExposedPersonComment({
      data: data?.PoliticallyExposedPersonComment, 
      loaded: true
    })
  }
  
  const handleReject = async () => {
    let obj;
    if(userType == 'TRUSTEE'){
      obj = {
        [(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER'].includes(userType)) ? 'reason' : 'approverReason']: comment,
        id : file,
        isCompliance : false, 
        approverVerifyRole : userType,
        approverVerifiedBy : currentUserAlias,
        approverName : name,
        supplierAlias : userAlias
      };
    } else {
      obj = {
        reason: comment,
        id : file,
        name : name, 
        verified : "REJECTED",
        verifyRole : userType,
        verifiedBy : currentUserAlias,
        supplierAlias : userAlias
      };
    }

    const resp = await finishsupplierverifydoc(obj);
    if (resp.status === 200 || resp.status === 201) {
      handleModalCancel();
      if(userAlias){
        onSellerData(userAlias);
      }
      // getKycdetails("upload");
    }
  };
  
  const handleApprove = async () => {
    
    let obj;
    if(userType == 'TRUSTEE'){
      obj = { 
        id : file,
        approverReason : comment,
        isCompliance : true,
        approverVerifyRole : userType,
        approverVerifiedBy : currentUserAlias,
        approverName : name,
        supplierAlias : supplierDetails.userAlias
      };
    } else {
      obj = {
        reason: comment,
        id : file,
        name : name,
        verified : "VERIFIED",
        verifyRole : userType,
        verifiedBy : currentUserAlias,
        supplierAlias : supplierDetails.userAlias
      };
    }
    
      
    const resp = await finishsupplierverifydoc(obj);
    
    if (resp.status === 200 || resp.status === 201) {
      
      if(userType == 'AUTHORIZER'){
        fetchSellerVrfnDetails(userAlias)
          .then(async (response: any) => {
          const data = response.data.res;
          
          if(data?.authVerifiedRole && data?.authVerifiedName){ //if seller is already approved (in expired case)
            const authVerification = data?.uploadedDocuments.filter((doc :any)=> doc.verified == "VERIFIED");
            
            if(authVerification.length == data?.uploadedDocuments.length) {
              updateSupplier(userAlias, { kybStatus : "VERIFIED" })
              .then((res: any) => {
                setLoading(false);
                if (res?.status === 201 || res?.status == 200) {
                  handleModalCancel();
                  // navigate(SelllerManagementList);
                  if(userAlias){
                    onSellerData(userAlias);
                  }
                }
              })
              .catch(() => {
                handleModalCancel();
                setLoading(false);
                message.error("Oops! Something went wrong. Please try again later");
              });
            }else{
              handleModalCancel();
              if(userAlias){
                  onSellerData(userAlias);  
              }
            }
          } else {
            handleModalCancel();
            if(userAlias)
              onSellerData(userAlias);
          }
        });
      } else {
        handleModalCancel();
        if(userAlias)
          onSellerData(userAlias);
      }
    }
  };
  
  // const onDeleteDocs = (file : any) => {
    
  //   let reqBody : any = {};
  //   reqBody["documents"] = []; 
  //   const updatedFileList = fileList;
  //   const ind = updatedFileList.findIndex((a: any)=>a.id == file.id);
  //   updatedFileList.splice(ind,1);
    
  //   reqBody["documents"] = updatedFileList.map((a:any,i:number) => {
  //     const keyNme = `documentid_${i}`;
  //     return  { [keyNme] : a.id , document : a.document};
  //   });
  //   updateKyb(userAlias,reqBody)
  //       .then((res: any) => { 
  //         getSellerDetails();
  //       })
  //       .catch(() => {
  //         message.error("Oops! Something went wrong. Please try again later");
  //       });
  // }
  
  const onUploadDocument = () => {
    if(!text){
      message.error("Please enter document name");
      return;
    }else if(!uploadedFile){
      message.error("Please select file");
      return;
    }
    const reqBody : any = {};
    
    reqBody["documents"] = [];
    
    reqBody["documents"] = fileList.map((a:any,i:number)=> {
      const keyNme = `documentid_${i}`;
      return  { [keyNme] : a.id , document : a.document , expirydate : a.expirydate};
    });
    const keyNme = `documentid_${fileList.length}`;
    if(!reqBody["documents"]) reqBody["documents"] = [];
    const datas = { [keyNme] : uploadedFile.id , document : text};
    reqBody["documents"].push(datas);
    setFileList([...fileList, {...uploadedFile,document : text}]);
    setUploadModal(false);
 
    finishSupplier(userAlias,reqBody)
        .then(() => {
          setUploadModal(false);
          setText('');
          setuploadedFile(null);
        })
        .catch(() => { 
          message.error("Oops! Something went wrong. Please try again later");
        });
  }

  const getRiskConfigurationDetails = async(entityType : string) => {
  setLoading(true);

  setCountryofIncorporationTypeId(0);
  setIncoporationCountryList([]);
  setResidenceStatusTypeId(0);
  setResidenceStatusList([]);
  setBusinessNatureList([]);

  await getRiskConfiguration({ RiskCategory: entityType })
    .then((response) => {


      if (response?.data?.status === 201 || response?.data?.status === 200) {
        setLoading(false);
         // setRiskDetails(response?.data?.result);
        if (response?.data?.result && response?.data?.result?.length) {
          const result = response?.data?.result;
          const custRiskIndex = result.findIndex((d: any) => d?.riskCategory == 'Customer Risk')
          const graphicRiskIndex = result.findIndex((d:any) => d.riskCategory == 'Geographic Risk')

          if(entityType == 'C'){
            if (custRiskIndex > -1) {
              result[custRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Nature of Business') {
                  setBusinessNatureTypeId(r?.id);
                  setBusinessNatureList(r?.riskItems || [])
                }
              })
            }
            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes']?.map((r:any) => {
                if (r?.riskType == 'Is any of the above country subject to increased monitoring by FATF') {
                  setFatfTypeId(r?.id)
                  setFatfList(r?.riskItems || [])
                }
                if (r?.riskType == 'Nationality Partner 1') {
                  setCountryList(r?.riskItems || []);
                }
                if (r?.riskType == 'Country of Incorporation') {
                  setCountryofIncorporationTypeId(r?.id)
                  setIncoporationCountryList(r?.riskItems || []);
                }
              })
            }
          } else {
            if (custRiskIndex > -1) {
              result[custRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Profession') {

                  setProfessionTypeId(r?.id);
                  setProfessionTypeList(r?.riskItems || [])
                }
                if (r?.riskType == 'Residence Status') {
                  setResidenceStatusTypeId(r?.id);
                  setResidenceStatusList(r?.riskItems || [])
                }
              })
            }
            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes']?.map((r:any) => {
                if (r?.riskType == 'Nationality') {
                  setCountryList(r?.riskItems || []);
                }
              })
            }
          }
          if (fatfList.length === 0) {
            result.forEach((category: any) => {
              category['riskTypes']?.forEach((r: any) => {
                if (r?.riskType.toLowerCase().includes('fatf')) {
                  setFatfTypeId(r?.id);
                  setFatfList(r?.riskItems || []);
                }
              });
            });
          }
          return result
        }
      }
    }).catch((error) => {
      setLoading(false);
      message.error(error?.error?.message ? error?.error?.message : "Something went wrong");
    });
}

  const handleDateChange = (date: dayjs.Dayjs | null, dateString:string | string[]) => {
    if (date && !date.isValid()) {
        message.error('Please enter a valid date');
        return;
      }
    setSelectedDate(dateString);
  }

  const normalize = (str: string) => str?.toLowerCase().replace(/\s+/g, " ").trim();

  // Find best match from countryList
  const findCountryMatch = (input: string, list: any[]) => {
    const normalizedInput = normalize(input);

    // Try exact match ignoring case
    const exact = list.find(
      (c) => normalize(c.riskItem) === normalizedInput
    );
    
    if (exact && exact?.riskItem) return exact.riskItem;

    // Try partial match (for things like Russia vs Russian Federation)
    const partial = list.find(
      (c) => normalize(c.riskItem).includes(normalizedInput) || normalizedInput.includes(normalize(c.riskItem))
    );
    
    if (partial && partial?.riskItem) return partial.riskItem;

    return input; // fallback to original
  };


  const onFinish = async (values: any) => {

    const riskTypes = [];
    const riskItems = []; 

    if(values.typeOfEntity == "COMPANY"){
      if (form.getFieldValue('countryofIncorporation')) {
        riskTypes.push(countryofIncorporationTypeId);
        riskItems.push(form.getFieldValue('countryofIncorporation'));
      }
      if (form.getFieldValue('natureofBusiness')) {
        riskTypes.push(businessNatureTypeId);
        riskItems.push(form.getFieldValue('natureofBusiness'));
      }
    } else {

      if(form.getFieldValue('profession')){
        riskTypes.push(professionTypeId)
        riskItems.push(form.getFieldValue('profession'))
      }

      if(form.getFieldValue('residenceStatus')){
        riskTypes.push(residenceStatusTypeId);
        riskItems.push(form.getFieldValue('residenceStatus'))
      }
    }
     
    const riskFrmPayload: object = {
      riskTypes,
      riskItems
    };  

    const Nationality = findCountryMatch(values.Nationality, countryList);
    //Nationality = values.Nationality; // old code
    
    const reqbody: any = {
      representativeName: values.docName,
      documentNationality: Nationality,
      Datasets: ['ALL'],
      userAlias: userAlias,
      residenceStatus: values.residenceStatus,
      dob: selectedDate ? DateWithUtcOffset(selectedDate) : null,
      typeOfEntity: values.typeOfEntity,
      typeOfBusiness: values.typeOfEntity,
      riskAssessmentFormPayload: riskFrmPayload,
    };
    

    if(values.typeOfEntity == 'COMPANY'){
      reqbody["CustomerType"] = "C";
      reqbody["natureofBusiness"] = values.natureofBusiness;
      reqbody["natureofBusinessTypeId"] = businessNatureTypeId;

      reqbody["countryofIncorporationTypeId"] = countryofIncorporationTypeId;
      reqbody["countryofIncorporation"] = values.countryofIncorporation;
    }else{
      reqbody["CustomerType"] = "I";
      reqbody["type"] = "with_company";
      reqbody["profession"] = values.profession;
      reqbody["professionTypeId"] = professionTypeId;

      reqbody["residenceStatusTypeId"] = residenceStatusTypeId;
      reqbody["residenceStatus"] = values.residenceStatus;

    }
    
    
    await getKybverificationAndSaveDetails(reqbody);
  }
 
 
  const generateColumn = (label:string, value:any) =>(
    <Col xs={24} sm={12} md={12} lg={4}>
    <Space direction="vertical">
      <Text type="secondary"> <b>{label}</b></Text>
      <Text> <b>{value ?? "---"}</b> </Text>
    </Space>
  </Col>
  );
 
  const setFormValues = (formInstance:any, payload:any) => {
    const formValues = {
      Threshold: parseInt(payload?.Threshold),
      CustomerType: payload?.CustomerType,
      LastName: payload?.LastName,
      FirstName: payload?.FirstName,
      MiddleName: payload?.MiddleName,
      Datasets: payload?.Datasets,
      Nationality: payload?.Nationality,
      PlaceOfBirth: payload?.PlaceOfBirth,
      CustomerIdNumber: payload?.CustomerIdNumber,
      CustomerIdExpiry: payload?.CustomerIdExpiry,
      Gender: payload?.Gender,
      MatchCategory: payload?.MatchCategory,
      CompanyCode: payload?.CompanyCode,
      dob: payload?.DOB ? dayjs(payload?.DOB) : "",
    };
  
    formInstance.setFieldsValue(formValues);
  };

  const getAndSaveSearchAgainDetails = async (values: any) => {
    setLoading(true);


    let reqbody : any = {};
    if(form.getFieldValue("typeOfEntity") == "COMPANY"){
      reqbody = { CustomerType: "C", type: "with_company", reqType: "search_again" };
    }else if(form.getFieldValue("typeOfEntity") == "INDIVIDUAL"){
      reqbody = { CustomerType: "I", reqType: "search_again" };
    }else{
      message.warning("Validation failed");
      return;
    }

    if (values.dob !== undefined) {
      const dob = dayjs(values.dob).format("DD-MM-YYYY");
      reqbody.DOB = dob == "Invalid date" ? "" : dob;
    }
    if (values.Threshold !== undefined) {
      reqbody.Threshold = parseInt(values.Threshold);
    }
    if (values.FirstName !== undefined) {
      reqbody.FirstName = values.FirstName;
    }
    if (values.LastName !== undefined) {
      reqbody.LastName = values.LastName;
    }
    if (values.MiddleName !== undefined) {
      reqbody.MiddleName = values.MiddleName;
    }
    if (values.Nationality !== undefined) {
      reqbody.Nationality=values.Nationality;
    }
    if (values.PlaceOfBirth !== undefined) {
      reqbody.PlaceOfBirth = values.PlaceOfBirth;
    }
    if (values.CustomerIdNumber !== undefined) {
      reqbody.CustomerIdNumber = values.CustomerIdNumber;
    }
    if (values.CustomerIdExpiry !== undefined) {
      reqbody.CustomerIdExpiry = values.CustomerIdExpiry;
    }
    if (values.MatchCategory !== undefined) {
      reqbody.MatchCategory = values.MatchCategory;
    }
    if (values.CompanyCode !== undefined) {
      reqbody.CompanyCode = values.CompanyCode;
    }
   
    if (datasetValue !== undefined || datasetValue?.length > 0 || values?.Datasets?.length > 0) {
      reqbody.Datasets = values?.Datasets?.length > 0 ? values?.Datasets : ['ALL'];
    
    }
    if (userAlias !== undefined) {
      reqbody.userAlias = userAlias;
    }
    if (values.fatf !== undefined) {
      reqbody.fatfTypeId = fatfTypeId;
      reqbody.fatf  = values.fatf
    }

    if (supplierDetails.riskAssessmentFormPayload !== undefined) {
      reqbody.riskAssessmentFormPayload = supplierDetails.riskAssessmentFormPayload;
    }

    await getKybverificationAndSaveDetails(reqbody);
  }

  const getKybverificationAndSaveDetails = async(reqbody:any) => {
    setUploadLoading(true);
    kybverification(reqbody)
        .then(async(res: any) => {
          setLoading(false);
          if (!res.data) {
            throw new Error('Invalid response data');
          }
          const response = res.data;
          
          
          setUploadLoading(false);
          const riskRating = Number(response.riskAssesment.totalParameter || 0);
          const body : any = {
            highestScoringResult : response.digiScreeningdata?.highestScoringResult,
            caseId : response.digiScreeningdata.caseId,
            customerId : response.digiScreeningdata.customerId,
            isMatched : response.digiScreeningdata.isMatched,
            digiScreeningPayload: response.digiScreeningPayload,
            riskAssessmentPayload: response.riskPayLoad,
            riskAssessment: response.riskAssesment,
            riskRating :  riskRating,
            riskAssessmentFormPayload : reqbody.riskAssessmentFormPayload,
            dob: reqbody.dob,
            typeOfEntity: reqbody.typeOfEntity,
            typeOfBusiness: reqbody.typeOfBusiness
          };
          
          if(reqbody.natureofBusiness){
            body["natureofBusiness"] = reqbody.natureofBusiness;
            body["natureofBusinessTypeId"] = businessNatureTypeId;
          }
          if(reqbody.countryofIncorporation){
            body["countryofIncorporationTypeId"] = countryofIncorporationTypeId;
            body["countryofIncorporation"] = reqbody.countryofIncorporation;
          }
          if(reqbody.profession){
            body["profession"] = reqbody.profession;
            body["professionTypeId"] = professionTypeId;
          }
          if(reqbody.residenceStatus){
            body["residenceStatusTypeId"] = residenceStatusTypeId;
            body["residenceStatus"] = reqbody.residenceStatus;
          }  

          setDropDownValue(riskRating);
          if (response && response?.digiScreeningPayload) {
              setFormValues(searchAgainForm,response?.digiScreeningPayload)
          }
          setDigiScreeningPayload(response?.digiScreeningPayload);
          setRiskAssessment(response?.riskAssesment);
  
          if (reqbody && reqbody?.reqType === "search_again") {
            setSearchAgianKybModal(false);

            setSearchAgainResponse({...body, fatf : reqbody.fatf,
              fatfTypeId:reqbody.fatfTypeId});
          } else {
            await saveDataIntoDatabase(body);
          }
         
        })
      .catch(() => {
        message.error("Could not fetch details. Please try again later");
        setUploadLoading(false);
        setLoading(false);
      });
  };

  const saveDataIntoDatabase = async (body: any) => {
    finishSupplier(userAlias, body).then(() => {
      message.success("Verified successfully.");
      getSellerDetails();
    }).catch(() => {
      setUploadLoading(false);
      setLoading(false);
      message.error("Something went wrong. Please try again later");
    });
  }

  const handlePDFView = (url: any) => {
    setImagUrl(url);
    setverifyVisible(true);
  }

  return (
    <div className="m-main-body-section">
      <DefaultLayout
        page="seller_management"
        loading={loading}
        TitleText="KYB Details"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        headerPage={
            <div className="d-flex">
            <Image
              src={LeftArrow}
              preview={false}
              onClick={() => {
                goBack();
              }}
              className="mt-2 cursor"
            />
            <div className="ml-5">
              <b> Screening management</b>
              <Breadcrumb separator=">">
                <Breadcrumb.Item
                  onClick={() => {
                    navigate(Dashboard);
                  }}
                  className="cursor"
                >
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="cursor"
                  onClick={() => {
                    navigate(SelllerManagementList);
                  }}
                >
                  Management
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="cursor"
                  onClick={() => {
                    navigate(SelllerManagementList);
                  }}
                >
                  Screening management
                </Breadcrumb.Item>
                <Breadcrumb.Item>Screening details</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >

    <Col className="mt-4 screening-header-title">
        <div className="titleText">DIGI screening details</div>
        <SecondaryOutLineButton
          children="Search again"
          className="px-3 search-btn"
          onClick={() => { setSearchAgianKybModal(true) }}
        /> 
      </Col>
      
  <Card className="mb-4 mt-3 details-card">
    {/* Verify KYB Card */}
    <Form form={form} scrollToFirstError  onFinish={onFinish}>
            <div className="row">
              <div className="col-12 col-md-12 col-lg-4">
                 <div className="subText_small mb-2 mt-2">
                  Fullname <span className="red">*</span>
                </div>
                <InputText fieldname="docName" className="inputField mb-4 w-100">
                  <Tooltip
                    title={
                      form.getFieldValue("docName") !== "--"
                        ? form.getFieldValue("docName")
                        : ""
                    }
                    placement="top"
                    overlayClassName="leads-custom-tooltip"
                  >
                    <Input
                    //  style={{minWidth:'370px'}}
                      type="text"
                      readOnly={true}
                      placeholder="Enter the full name"
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
                      value={form.getFieldValue("docName")}
                      maxLength={50}
                    />
                  </Tooltip>
                </InputText>
              </div>
              
              <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                  Email <span className="red">*</span>
                </div>
                <InputText
                  fieldname="email"
                  className="inputField mb-4 w-100">
                  <Tooltip
                    title={
                      form.getFieldValue("email") !== "--"
                        ? form.getFieldValue("email")
                        : ""
                    }
                    placement="top"
                    overlayClassName="leads-custom-tooltip"
                  >
                    <Input
                      type="text"
                      placeholder="Enter the email"
                      readOnly={true}
                      prefix={
                        <span className="inputGlobe mb-0">
                          <MailOutlined className="me-3" />
                        </span>
                      }
                      value={form.getFieldValue("email")}
                      maxLength={50}
                    />
                  </Tooltip>
                </InputText>
              </div> 

              <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                  Contact Number <span className="red">*</span>
                </div>
                <InputText
                  fieldname="ContractNumber"
                  className="inputField mb-4 w-100" 
                >
                  <Tooltip
                    title={
                      form.getFieldValue("ContractNumber") !== "--"
                        ? form.getFieldValue("ContractNumber")
                        : ""
                    }
                    placement="top"
                    overlayClassName="leads-custom-tooltip"
                  >
                    <Input
                      type="text"
                      readOnly={true}
                      placeholder="Enter the contract number"
                      prefix={
                        <span className="inputGlobe">
                          <Image
                            src={User}
                            alt="Email"
                            className="me-3"
                            preview={false}
                          />
                        </span>
                      }
                      value={form.getFieldValue("ContractNumber")}
                      maxLength={50}
                    />
                  </Tooltip>
                </InputText>
              </div>

              <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                  Residence <span className="red">*</span>
                </div>
                <InputText
                  fieldname="Nationality"
                  className="inputField mb-4 w-100"
                  rules={[
                    {
                      required: true,
                      message: "Residence is required!",
                    },
                  ]}
                > 
                  <Input
                  // style={{minWidth:'370px'}}
                    type="text" 
                    placeholder="Enter the residence"
                    readOnly={true}
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={Country}
                          alt="nationality"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                  />
                </InputText>
              </div>

              <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                  Nationality <span className="red">*</span>
                </div>
                <InputText
                  fieldname="sellerNationality"
                  className="inputField mb-4 w-100"
                  rules={[
                    {
                      required: true,
                      message: "nationality is required!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter the nationality"
                    readOnly={true}
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={Country}
                          alt="nationality"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                  />
                </InputText>
              </div>

              <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                  Entity type <span className="red">*</span>
                </div>
                <InputText
                  fieldname="typeOfEntity"
                  rules={[
                    { required: true, message: "Entity type is required!" },
                  ]}
                  className="inputField mb-4 w-100"
                >
                  <Select  disabled placeholder="Select Entity type" getPopupContainer={(triggerNode) => triggerNode.parentNode}
                     onChange={(e) => { onEntityChange(e) }}>
                    <Option key="COMPANY" value="COMPANY">Company</Option>
                    <Option key="INDIVIDUAL" value="INDIVIDUAL">Individual</Option>
                  </Select>
                </InputText>
              </div>

              

              { professionTypeList?.length && form.getFieldValue("typeOfEntity") == "INDIVIDUAL" ? <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                Profession <span className="red">*</span>
                </div>
                <InputText
                  fieldname="profession"
                  rules={[
                    { required: true, message: "Profession is required!" },
                  ]}
                  className="inputField mb-4 w-100"
                >
                  <Select
                    // style={{minWidth:'370px'}}
                    placeholder="Select profession"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    disabled={isValidValue(supplierDetails?.profession)}
                  >
                    {professionTypeList?.length > 0 && professionTypeList?.map((value: any, index: any) => {
                        return (
                          <Option key={index} value={value.id} >{value.riskItem}</Option>
                        )
                    })}
                  </Select>
                </InputText>
              </div> : null}

              { form.getFieldValue("typeOfEntity") == "INDIVIDUAL" ? <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                Residence <span className="red">*</span>
                {/* Business domain  (in companystep2) */}
                </div>
                <InputText
                  fieldname="residenceStatus"
                  rules={[
                    { required: true, message: "Residence is required!" },
                  ]}
                  className="inputField mb-4 w-100">
                  <Select
                    allowClear
                    placeholder={"Residence"}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    showSearch
                    optionFilterProp="children"
                    disabled={isValidValue(supplierDetails?.residenceStatus)}
                  >
                    {residenceStatusList?.length > 0 && residenceStatusList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.id} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </div> : null }



             { incoporationCountryList?.length ? <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                Country of incorporation <span className="red">*</span>
                </div>
                <InputText
                  fieldname="countryofIncorporation"
                  rules={[
                    { required: true, message: "Country of incorporation is required!" },
                  ]}
                  className="inputField mb-4 w-100"
                >
                  <Select
                    placeholder="Select country of incorporation"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    disabled={isValidValue(supplierDetails?.countryofIncorporation)}
                  >
                    {incoporationCountryList?.length > 0 && incoporationCountryList?.map((value: any, index: any) => {
                        return (
                          <Option key={index} value={value.id} >{value.riskItem}</Option>
                        )
                    })}
                  </Select>
                </InputText>
              </div> : null}

              { form.getFieldValue("typeOfEntity") == "COMPANY" ? <div className="col-12 col-md-12 col-lg-4">
                <div className="subText_small mb-2 mt-2">
                Nature of business <span className="red">*</span>
                {/* Business domain  (in companystep2) */}
                </div>
                <InputText
                  fieldname="natureofBusiness"
                  rules={[
                    { required: true, message: "Nature of business is required!" },
                  ]}
                  className="inputField mb-4 w-100">
                  <Select
                    allowClear
                    placeholder={"Nature of business"}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    showSearch
                    optionFilterProp="children"
                    disabled={isValidValue(supplierDetails?.natureofBusiness)}
                  >
                    {businessNatureList?.length > 0 && businessNatureList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.id} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </div> : null }
              { form.getFieldValue("typeOfEntity") == "COMPANY" ?
              <div className="col-12 col-md-12 col-lg-4">
                  <div className="subText_small mb-2 mt-2">
                  Establishment date <span className="red">*</span>
                  </div>
                  <InputText
                    fieldname="dob"
                    className="inputField mb-4 w-100"
                    rules={[
                      {
                        required: true,
                        message: "Establishment date is required!",
                      },
                    ]}
                  > 
                  <DatePicker
                      placeholder="Select Establishment date"
                      value={selectedDate}
                      format={{
                        format: 'DD-MM-YYYY',
                        type: 'mask',
                      }}
                      onChange={handleDateChange}
                      disabled={supplierDetails?.dob && dayjs(supplierDetails?.dob) ? true : false}
                      disabledDate={(current:any) => {
                        const customDate = moment().format("YYYY-MM-DD");
                        return current && current > moment(customDate, "YYYY-MM-DD");
                      }}
                      className="w-100 d-flex"
                    />
                  </InputText>
                </div> : null}
            </div>
           
            {
              !supplierDetails?.customerId ?
                (<div className={Width < 992 ? "d-flex mb-4 step-control-btn":"d-flex mb-4 step-control-btn"}>
                  <Button className="rounded" loading={uploadLoading} htmlType="submit">Verify</Button>
                </div>)
                : (
                  <div className={Width < 992 ? "d-flex mb-4 step-control-btn":"d-flex mb-4 step-control-btn"}>
                    <Button className="rounded" loading={uploadLoading} htmlType="button"
                      onClick={() => { saveDataIntoDatabase(searchAgainResponse) }}>Verify</Button>
                  </div>
                )
            }
          </Form>
   </Card>
   
      <Card className="my-3 details-card">
        <div className="subText_medium border-left mb-4 sub-title-align">
          <b>Send data</b>
          <Image src={SendData} alt="sendData" preview={false} />
        </div>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center gap-5">
          {generateColumn("Threshold", digiScreeningPayload?.Threshold)}
          {generateColumn("Customer type", digiScreeningPayload?.CustomerType && digiScreeningPayload?.CustomerType == "I" ? "Individual" : digiScreeningPayload?.CustomerType == "C" ? "Company" : "")}
          {generateColumn("First name", digiScreeningPayload?.FirstName)}
          {generateColumn("Middle name", digiScreeningPayload?.MiddleName)}
          {generateColumn("Last name", digiScreeningPayload?.LastName)}
          {generateColumn("Nationality", digiScreeningPayload?.Nationality)}
          {generateColumn("Customer id", digiScreeningPayload?.CustomerId)}
          {generateColumn("Id expiry", digiScreeningPayload?.CustomerIdExpiry)}
          {generateColumn("Match category", digiScreeningPayload?.MatchCategory)}
          {generateColumn("Company code", digiScreeningPayload?.CompanyCode)}
          {generateColumn("Datasets", digiScreeningPayload?.Datasets?.length > 0 ? digiScreeningPayload?.Datasets.toString() : "---")}
           {generateColumn("Company Name", digiScreeningPayload?.CompanyName)}
        </Row>
        <Divider plain></Divider>
        <div className="subText_medium border-left mb-4 sub-title-align">
          <b>Received data</b> 
          <Image src={ReceivedData} alt="receivedData" preview={false} />
        </div>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center justify-content-between">
          {generateColumn("Is matched", kybInfo?.isMatched)}
          {generateColumn("Match score", kybInfo?.matchScore)}
          {generateColumn("Case id", kybInfo?.caseId)}
          {generateColumn("Customer id", kybInfo?.customerId)}
          {generateColumn("Id", kybInfo?.highestScoringResult?.id)}
        </Row>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center justify-content-between">
          {generateColumn("Primary name", kybInfo?.highestScoringResult?.primaryName)}
          {generateColumn("Matched name", kybInfo?.highestScoringResult?.matchedName)}
          {generateColumn("Nationality", kybInfo?.highestScoringResult?.nationality)}
          {generateColumn("Data sets", kybInfo?.highestScoringResult?.datasets?.toString())}
          {generateColumn("isPEP", kybInfo?.highestScoringResult?.isPEP && kybInfo.highestScoringResult.isPEP === true ? "True" : "False")}
        </Row>
      </Card>
      <RiskAssesmentCard riskAssessment={riskAssessment} />


      <Col className="mt-4 screening-header-title">
        <div className="titleText">Uploaded documents</div>
      </Col>
      <Card className="mb-4 mt-3 details-card">

          <div className="afterApproveCard escrow-tran-card">
          <Tabs className="d-none-res tableTab"  defaultActiveKey={userType}>
              <TabPane tab={`Approver`} key="TRUSTEE">
                  <div  className={Width < 400 ? "":"doc-block"}>
                    <div className={ "d-flex gap-4 flex-wrap moa-doc-list"} >
                        {fileList.map((fileData: any , i : number) => (
                          !fileData.approverReason ? 
                          <div key={i}  className={Width < 400 ? "":"documentcard-width"}>
                          <Card
                            className=" kybcard"
                            cover={
                              fileData.url.includes(
                                ".pdf"
                              ) ? (
                                <>
                                  <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(fileData.url) }}>
                                    <PDFPreview
                                      url={fileData.url || ''}
                                      onPreviewClick={handlePDFView}
                                    />
                                  </div>
                                </>
                              ) : (
                                <Image
                                  alt="example"
                                  src={fileData?.url}
                                  height={175}
                                />
                              )
                            }
                          >
                            <div className="d-flex justify-content-between">
                            <div>
                                <Tooltip
                                    title={
                                      fileData?.document && fileData.document.length > 20
                                        ? fileData.document
                                        : null
                                    }
                                    placement="top"
                                    overlayClassName="leads-custom-tooltip"
                                  >
                                    <div className="ellipsis-container">
                                  <span className="ant-card-meta-title">{fileData.document}</span>
                                      </div>
                                    </Tooltip> 
                                    <div>
                                      <span className="ant-card-meta-description">{`Expiry date: ` + moment(fileData?.expirydate).format("DD MMMM YYYY")}</span>
                                  </div>
                              </div>
                              <Tooltip
                                title={'Download'}
                                overlayClassName='custom-tooltip'
                                placement="left"
                              >
                                <div className="ml-2" onClick={() => {
                                  if (fileData.url) {
                                    try {
                                      downloadFile(fileData.url);
                                    } catch (error) {
                                      console.error('Download failed:', error);
                                    }
                                  }
                                }}>
                                  <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                </div>
                              </Tooltip>
                              {/* <Image
                                alt="example"
                                preview={false}
                                src={BlueEye}
                                className="cursor"
                                onClick={() => {
                                  if (fileData?.url.includes(".pdf")) {
                                    handlePDFView(fileData?.url)
                                  } else {
                                    setImagUrl(fileData?.url);
                                    setViewModal(true);
                                  }
                                }}
                              /> */}
                            </div>
                          </Card>
                          {userType == 'TRUSTEE' ? <div className="d-flex align-items-center">
                           <div className={Width < 400 ? "button-container flex-column":"button-container gap-4"}>
                           <SecondaryOutLineButton
                              children="Approve"
                              className={Width < 400 ? "mt-4":"mt-4"}
                              onClick={() => {
                                setModalTitle(fileData.document);
                                setFile(fileData.id)
                                setCommentModal(true);  
                              }}
                            />
                            <PrimaryOutLineButton
                              children="Reject"
                              className={Width < 400 ? "mt-2 reject-btn":"mt-4 reject-btn"}
                              onClick={() => {
                                setModalTitle(fileData.document);
                                SetCommentModalReject(true);
                                setFile(fileData.id)  
                              }}
                            />
                           </div>
                            
                          </div> : '' }
                        </div> :
                          <div key={i} style={{margin : '10px'}} className="documentcard-width"> <SubApproverDetails
                          modalTitle={fileData.document}
                          approverDetails={fileData}
                          proStatus={fileData.approverReason && fileData?.isCompliance ? "VERIFIED" : null }
                          uploadedFile={fileData?.url}
                          tab="approver" 
                        /></div>
                        ))}
                    </div>
                 </div>
                            </TabPane>
                            <TabPane tab={`Authorizer`} key="AUTHORIZER">
                            <div className={Width < 400 ? "":"doc-block"}>
                              <div className={ "d-flex gap-2 flex-wrap align-items-center justify-content-start moa-doc-list"} >
                                {fileList.map((fileData: any , i : number) => (
                                  !fileData.verifiedBy ? 
                                  <div key={i} className={Width < 400 ? "":"documentcard-width"}>
                                  <Card
                                    className=" kybcard"
                                    cover={
                                      fileData.url.includes(".pdf") ? ( 
                                        <>
                                          <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(fileData.url) }}>
                                            <PDFPreview
                                              url={fileData.url || ''}
                                              onPreviewClick={handlePDFView}
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <Image
                                          alt="example"
                                          src={fileData?.url}
                                          height={175}
                                        />
                                      )
                                    }
                                  >
                                    <div className="d-flex justify-content-between">
                                      <div>
                                    <Tooltip
                                    title={
                                      fileData?.document && fileData.document.length > 20
                                        ? fileData.document
                                        : null
                                    }
                                    placement="top"
                                    overlayClassName="leads-custom-tooltip"
                                  >
                                    <div className="ellipsis-container">
                                      <span className="ant-card-meta-title">{fileData.document}</span>
                                      </div>
                                    </Tooltip> 
                                    <div>
                                      <span className="ant-card-meta-description">{`Expiry date: ` + moment(fileData?.expirydate).format("DD MMMM YYYY")}</span>
                                    </div>
                                    </div>
                                      <Tooltip
                                        title={'Download'}
                                        overlayClassName='custom-tooltip'
                                        placement="left"
                                      >
                                        <div className="ml-2" onClick={() => {
                                          if (fileData.url) {
                                            try {
                                              downloadFile(fileData.url);
                                            } catch (error) {
                                              console.error('Download failed:', error);
                                            }
                                          }
                                        }}>
                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                        </div>
                                      </Tooltip>
                                      {/* <Image
                                        alt="example"
                                        preview={false}
                                        src={BlueEye}
                                        className="cursor"
                                        onClick={() => {
                                          if (fileData?.url.includes(".pdf")) {
                                            handlePDFView(fileData?.url)
                                          } else {
                                            setImagUrl(fileData?.url);
                                            setViewModal(true);
                                          }
                                        }}
                                      /> */}
                                    </div>
                                  </Card>
                                  {userType == 'AUTHORIZER' ? 
                                  <div className="d-flex align-items-center">
                                    <div className={Width < 400 ? "button-container flex-column":"button-container"}>
                                    <SecondaryOutLineButton
                                      children="Approve"
                                      // className="mt-4 mx-3"
                                      className="mt-4"
                                      onClick={() => {
                                        setModalTitle(fileData.document);
                                        setFile(fileData.id);
                                        setCommentModal(true); 
                                      }}
                                    />
                                    <PrimaryOutLineButton
                                      children="Reject"
                                      className={Width < 400 ? "mt-2":"mt-4"}
                                      onClick={() => {
                                        setModalTitle(fileData.document);
                                        SetCommentModalReject(true);
                                        setFile(fileData.id);
                                      }}
                                    />
                                    </div>
                                  </div> :
                                  ""
                                  }
                                </div> :
                                  <div key={i} style={{margin : '10px'}} className="documentcard-width"> <SubApproverDetails
                                  modalTitle={fileData.document}
                                  approverDetails={fileData}
                                  proStatus={fileData.verified }
                                  uploadedFile={fileData?.url}
                                  tab="authorizer" 
                                /></div>
                                ))}
                              </div>
                            </div>
                            </TabPane>
          </Tabs>
          </div>
      </Card>

 
        <hr className="lightgrayHr mb-4" />
              <div className="subText_medium border-left">
                <b>Checklist</b>
              </div>
              <Form>
              <Row className="mt-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                      (userType == "TRUSTEE" || userType === 'MAKER')
                      ? (supplierDetails?.trusteeKybStatus || supplierDetails?.isTrusteeKybRejected)
                      : supplierDetails?.kybStatus === "VERIFIED" ||
                        supplierDetails?.kybStatus === "REJECTED"
                      ? true
                      : false
                    }
                    checked={validDocumentVerification}
                    onClick={() => {
                      setValidDocumentVerification(!validDocumentVerification);
                    }}
                  >
                    <div className="subText mx-1 ">
                      Valid document verification 
                    </div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res  mx-4 my-2"
                    >
        
                  <TabPane tab={`Approver`} key="approver">
                    {supplierDetails?.kybStatus === "VERIFIED" || 
                      supplierDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {supplierDetails?.approverComments
                          ?.validDocumentVerificationComment
                          ? supplierDetails?.approverComments
                            ?.validDocumentVerificationComment
                          : "N/A"}
                      </div>
                    ) : (
                        <Form.Item
                          name="validDocumentVerificationApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER')? [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "validDocumentVerificationApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                            }
                          },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // }
                          ] : []}
                          className="checklist"
                        >
                    {validDocumentVerificationComment?.loaded ?
                      <TextArea
                        rows={2}
                        placeholder="Type your comment here..."
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="validDocumentVerificationApprover"
                        defaultValue={validDocumentVerificationComment?.data || ""}
                        onChange={(e)=>adjustHeightForApprover("validDocumentVerification", e?.target?.value)}
                        disabled={disable || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                      />  
                      : null }
                      </Form.Item>
                      )}
                  </TabPane>
      
                  <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {supplierDetails?.kybStatus === "VERIFIED" ||
                          supplierDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {supplierDetails?.adminComments
                                ?.validDocumentVerificationComment
                                ? supplierDetails?.adminComments
                                    ?.validDocumentVerificationComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                          name="validDocumentVerification"
                          rules={
                            ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "validDocumentVerification", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                            }
                          },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // }
                          ] : []}
                          className="checklist"
                        >
                            <TextArea
                              rows={2}
                              placeholder="Type your comment here..."
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="validDocumentVerification"
                              defaultValue={checkboxComment?.validDocumentVerification}
                              onChange={(e)=>adjustHeight("validDocumentVerification", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER'}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
              <Row className="my-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                        (userType == "TRUSTEE" || userType === 'MAKER')
                        ? (supplierDetails?.trusteeKybStatus || supplierDetails?.isTrusteeKybRejected)
                        : supplierDetails?.kybStatus === "VERIFIED" ||
                          supplierDetails?.kybStatus === "REJECTED"
                        ? true
                        : false
                    }
                    checked={nameAndIdVerification}
                    onClick={() => {
                      setNameAndIdVerification(!nameAndIdVerification);
                    }}
                  >
                    <div className="subText mx-1 ">Name & id verification</div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res  mx-4 my-2"
                    >
                  <TabPane tab={`Approver`} key="approver">
                    {supplierDetails?.kybStatus === "VERIFIED" ||
                      supplierDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {supplierDetails?.approverComments
                          ?.nameAndIdVerificationComment
                          ? supplierDetails?.approverComments
                            ?.nameAndIdVerificationComment
                          : "N/A"}
                      </div>
                    ) : (
                      <Form.Item
                          name="nameAndIdVerificationApprover"
                          rules={
                            (userType === 'TRUSTEE' || userType === 'MAKER') ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "nameAndIdVerificationApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                            }
                          },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // }
                          ] : []}
                          className="checklist"
                        >
                      {nameAndIdVerificationComment?.loaded && (
                        <TextArea
                        rows={2}
                        placeholder="Type your comment here..."
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="nameAndIdVerificationApprover"
                        defaultValue={nameAndIdVerificationComment?.data}
                        onChange={(e)=>adjustHeightForApprover("nameAndIdVerification", e?.target?.value)}
                        disabled={disable || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                      />
                      )}
                      </Form.Item>
                    )}
                  </TabPane>
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {supplierDetails?.kybStatus === "VERIFIED" ||
                          supplierDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {supplierDetails?.adminComments
                                ?.nameAndIdVerificationComment
                                ? supplierDetails?.adminComments
                                    ?.nameAndIdVerificationComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                          name="nameAndIdVerification"
                          rules={
                            ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // }
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "nameAndIdVerification", setSpecialErrors);
                            }
                          },
                          ]: []}
                          className="checklist"
                        >
                            <TextArea
                              rows={2}
                              placeholder="Type your comment here..."
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="nameAndIdVerification"
                              defaultValue={checkboxComment?.nameAndIdVerification}
                              onChange={(e)=>adjustHeight("nameAndIdVerification", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER'}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
              <Row className="my-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                      (userType == "TRUSTEE" || userType === 'MAKER')
                      ? (supplierDetails?.trusteeKybStatus || supplierDetails?.isTrusteeKybRejected)
                      : supplierDetails?.kybStatus === "VERIFIED" ||
                        supplierDetails?.kybStatus === "REJECTED"
                      ? true
                      : false
                    }
                    checked={amlScreening}
                    onClick={() => {
                      setAmlScreening(!amlScreening);
                    }}
                  >
                    <div className="subText mx-1 ">AML screening</div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res  mx-4 my-2"
                    >
                  <TabPane tab={`Approver`} key="approver">
                    {supplierDetails?.kybStatus === "VERIFIED" ||
                      supplierDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {supplierDetails?.approverComments?.amlScreeningComment
                          ? supplierDetails?.approverComments?.amlScreeningComment
                          : "N/A"}
                      </div>
                    ) : (
                      <Form.Item
                          name="amlScreeningApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER') ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // }
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "amlScreeningApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                            }
                          },
                          ] : []}
                          className="checklist"
                        >
                      {amlScreeningComment?.loaded && (
                      <TextArea
                        rows={2}
                        placeholder="Type your comment here..."
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="amlScreeningApprover"
                        defaultValue={amlScreeningComment?.data}
                        onChange={(e)=>adjustHeightForApprover("amlScreening", e?.target?.value)}
                        disabled={disable || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                      />
                      )}
                      </Form.Item>
                    )}
                  </TabPane>
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {supplierDetails?.kybStatus === "VERIFIED" ||
                          supplierDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {supplierDetails?.adminComments?.amlScreeningComment
                                ? supplierDetails?.adminComments?.amlScreeningComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                            name="amlScreening"
                            rules={
                              ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                              [
                              {
                                required: true,
                                message: "Please add some comment!",
                              },
                              // {
                              //   min: 20,
                              //   message: "Please enter minimum 20 characters"
                              // }
                              {
                                validator: async (_, value) => {
                                  await validateCommentField(value, "amlScreening", setSpecialErrors);
                                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              }
                            },
                            ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder="Type your comment here..."
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="amlScreening"
                              defaultValue={checkboxComment?.amlScreening}
                              onChange={(e)=>adjustHeight("amlScreening", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER'}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
              <Row className="my-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                      (userType == "TRUSTEE" || userType === 'MAKER')
                        ? (supplierDetails?.trusteeKybStatus || supplierDetails?.isTrusteeKybRejected)
                        : supplierDetails?.kybStatus === "VERIFIED" ||
                          supplierDetails?.kybStatus === "REJECTED"
                        ? true
                        : false
                    }
                    checked={adverseMedia}
                    onClick={() => {
                      setAdverseMedia(!adverseMedia);
                    }}
                  >
                    <div className="subText mx-1 ">Adverse media</div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res mx-4 my-2"
                    >
                      <TabPane tab={`Approver`} key="approver">
                      {supplierDetails?.kybStatus === "VERIFIED" ||
                          supplierDetails?.kybStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {supplierDetails?.approverComments?.adverseMediaComment
                            ? supplierDetails?.approverComments?.adverseMediaComment
                            : "N/A"}
                        </div>
                        ) : (
                          <Form.Item
                          name="adverseMediaApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER') ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // }
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "adverseMediaApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                            }
                          },
                          ] : []}
                          className="checklist"
                        >
                          {adverseMediaComment?.loaded && (
                            <TextArea
                              rows={2}
                              placeholder="Type your comment here..."
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="adverseMediaApprover"
                              defaultValue={adverseMediaComment?.data}
                              onChange={(e)=>adjustHeightForApprover("adverseMedia", e?.target?.value)}
                              disabled={disable || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                            />
                          )}
                          </Form.Item>
                        )}
                      </TabPane>
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {supplierDetails?.kybStatus === "VERIFIED" ||
                          supplierDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {supplierDetails?.adminComments?.adverseMediaComment
                                ? supplierDetails?.adminComments?.adverseMediaComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                            name="adverseMedia"
                            rules={
                              ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                              [
                              {
                                required: true,
                                message: "Please add some comment!",
                              },
                              // {
                              //   min: 20,
                              //   message: "Please enter minimum 20 characters"
                              // }
                              {
                                validator: async (_, value) => {
                                  await validateCommentField(value, "adverseMedia", setSpecialErrors);
                                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              }
                            },
                            ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder="Type your comment here..."
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="adverseMedia"
                              defaultValue={checkboxComment?.adverseMedia}
                              onChange={(e)=>adjustHeight("adverseMedia", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER'}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
              {/* Politically exposed */}
              <Row className="mt-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                    (userType == "TRUSTEE" || userType === 'MAKER')
                      ? (supplierDetails?.trusteeKybStatus || supplierDetails?.isTrusteeKybRejected)
                      : supplierDetails?.kybStatus === "VERIFIED" ||
                        supplierDetails?.kybStatus === "REJECTED"
                      ? true
                      : false
                    }
                    checked={PoliticallyPerson}
                    onClick={() => {
                      setPoliticallyPerson(!PoliticallyPerson);
                    }}
                  >
                    <div className="subText mx-1 ">
                    Politically exposed person
                    </div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res  mx-4 my-2"
                    >
                  <TabPane tab={`Approver`} key="approver">
                    {supplierDetails?.kybStatus === "VERIFIED" ||
                      supplierDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {supplierDetails?.approverComments
                          ?.PoliticallyExposedPersonComment
                          ? supplierDetails?.approverComments
                            ?.PoliticallyExposedPersonComment
                          : "N/A"}
                      </div>
                    ) : (
                      <Form.Item
                      name="PoliticallyExposedPersonCommentApprover"
                      rules={
                        (userType === "TRUSTEE" || userType === 'MAKER') ?
                        [
                        {
                          required: true,
                          message: "Please add some comment!",
                        },
                        // {
                        //   min: 20,
                        //   message: "Please enter minimum 20 characters"
                        // }
                        {
                          validator: async (_, value) => {
                            await validateCommentField(value, "PoliticallyExposedPersonCommentApprover", setSpecialErrors);
                            if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                        }
                      },
                      ] : []}
                      className="checklist"
                    >
                      {politicallyExposedPersonComment?.loaded && (
                        <TextArea
                          rows={2}
                          placeholder="Type your comment here..."
                          className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                          // onInput={handleInput}
                          id="PoliticallyExposedPersonCommentApprover"
                          defaultValue={politicallyExposedPersonComment?.data}
                          onChange={(e)=>adjustHeightForApprover("PoliticallyExposedPersonComment", e?.target?.value)}
                          disabled={disable || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                        />
                      )}
                      </Form.Item>
                    )}
                  </TabPane>
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {supplierDetails?.kybStatus === "VERIFIED" ||
                          supplierDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {supplierDetails?.adminComments
                                ?.PoliticallyExposedPersonComment
                                ? supplierDetails?.adminComments
                                    ?.PoliticallyExposedPersonComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                      name="PoliticallyExposedPersonComment"
                      rules={
                        ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                        [
                        {
                          required: true,
                          message: "Please add some comment!",
                        },
                        // {
                        //   min: 20,
                        //   message: "Please enter minimum 20 characters"
                        // }
                        {
                          validator: async (_, value) => {
                            await validateCommentField(value, "PoliticallyExposedPersonComment", setSpecialErrors);
                            if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                        }
                      },
                      ] : []}
                      className="checklist"
                    >
                            <TextArea
                              rows={2}
                              placeholder="Type your comment here..."
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="PoliticallyExposedPersonComment"
                              defaultValue={checkboxComment?.PoliticallyExposedPersonComment}
                              onChange={(e)=>adjustHeight("PoliticallyExposedPersonComment", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER'}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
               {/*>Other comments/notes */}
          <Row className="my-4">
            <div className="w-100">
              <Checkbox
                disabled={
                (userType == "TRUSTEE" || userType === 'MAKER')
                  ? (supplierDetails?.trusteeKybStatus || supplierDetails?.isTrusteeKybRejected)
                  : supplierDetails?.kybStatus === "VERIFIED" ||
                    supplierDetails?.kybStatus === "REJECTED"
                  ? true
                  : false
                }
                checked={otherComment}
                onClick={() => {
                  setOtherComment(!otherComment);
                }}
              >
                <div className="subText mx-1 ">Other comments/notes</div>
              </Checkbox>
              <div className="afterApproveCard">
                <Tabs
                  defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) ? "authorizer" : "approver"}
                  className="d-none-res mx-4 my-2"
                >
                  <TabPane tab={`Approver`} key="approver">
                    {supplierDetails?.kybStatus === "VERIFIED" ||
                      supplierDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {supplierDetails?.approverComments?.otherCommentAndNotes
                          ? supplierDetails?.approverComments
                            ?.otherCommentAndNotes
                          : "N/A"}
                      </div>
                    ) : (
                        <Form.Item
                          name="otherCommentAndNotesApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER') ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // }
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "otherCommentAndNotesApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                            }
                          },
                          ] : []}
                          className="checklist"
                        >
                          {otherCommentAndNotesComment?.loaded && (
                            <TextArea
                              rows={2}
                              placeholder="Type your comment here..."
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="otherCommentAndNotesApprover"
                              defaultValue={otherCommentAndNotesComment?.data}
                              onChange={(e)=>adjustHeightForApprover("otherCommentAndNotes", e?.target?.value)}
                              disabled={disable || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                            />
                          )}
                      </Form.Item>
                    )}
                  </TabPane>
                  <TabPane tab={`Authorizer`} key="authorizer">
                    <div className="w-100">
                      {supplierDetails?.kybStatus === "VERIFIED" ||
                        supplierDetails?.kybStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {supplierDetails?.adminComments?.otherCommentAndNotes
                            ? supplierDetails?.adminComments?.otherCommentAndNotes
                            : "N/A"}
                        </div>
                      ) : (
                        <Form.Item
                          name="otherCommentAndNotes"
                          rules={
                            ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // }
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "otherCommentAndNotes", setSpecialErrors);
                            }
                          },
                          ] : []}
                          className="checklist"
                        >
                        <TextArea
                          rows={2}
                          placeholder="Type your comment here..."
                          className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                          // onInput={handleInput}
                          id="otherCommentAndNotes"
                          defaultValue={checkboxComment?.otherCommentAndNotes}
                          onChange={(e)=>adjustHeight("otherCommentAndNotes", e?.target?.value)}
                          disabled={disable || userType == "TRUSTEE" || userType === 'MAKER'}
                        />
                        </Form.Item>
                      )}
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Row>
          </Form>
              <hr className="lightgrayHr mb-4" />
              <div className="subText_medium border-left mt-4">
                <b>Client risk rating</b>
              </div>
              <Row className="mt-3">
                <Radio.Group
                  disabled={
                    (userType == "TRUSTEE" || userType === 'MAKER')
                      ? (supplierDetails?.trusteeKybStatus || supplierDetails?.isTrusteeKybRejected)
                      : supplierDetails?.kybStatus === "VERIFIED" ||
                        supplierDetails?.kybStatus === "REJECTED"
                      ? true
                      : false
                    }
                  onChange={handleDropdownChange}
                  value={dropDownValue}
                  className="mt-3 mb-4"
                >
                  {/* <Radio value={1}>Low risk</Radio>
                  <Radio value={2}>Medium risk</Radio>
                  <Radio value={3}>High risk</Radio> */}
                  <Radio value={0}>Low risk</Radio>
                  <Radio value={1}>Medium risk</Radio>
                  <Radio value={2}>High risk</Radio>
                </Radio.Group>
              </Row>
              
        {supplierDetails?.trusteeComment ?
          <div>
            <hr className="lightgrayHr mb-4" />
            <div className="subText_medium border-left">
              <b>Approver Comment</b>
            </div>
            <div>
              <div className="finalCommentTime stepDetails_medium_sub my-3">
                {moment(supplierDetails?.verifiedTime).format(
                  "DD MMMM YYYY hh:mm A"
                )}
              </div>
              <div className="stepDetails_medium_sub">
                {supplierDetails?.trusteeComment}
              </div>
            </div>
          </div> : null
        }

        {supplierDetails?.kybStatus == "VERIFIED" ||
          supplierDetails?.kybStatus == "REJECTED" ? (
          <div>
            {" "}
            <hr className="lightgrayHr mb-4" />
            <div className="subText_medium border-left">
              <b>Authorizer comment</b>
            </div>
            <div>
              <div className="finalCommentTime stepDetails_medium_sub my-3">
                {moment(supplierDetails?.updatedAt).format(
                  "DD MMMM YYYY hh:mm A"
                )}
              </div>
              <div className="stepDetails_medium_sub">
                {supplierDetails?.kybStatus == "REJECTED" ? supplierDetails?.reason : supplierDetails?.comment}
              </div>
            </div>
          </div>
        ) : null}
              
              {(supplierDetails?.kybStatus != "VERIFIED" &&
              supplierDetails?.kybStatus != "REJECTED" && (userType =="TRUSTEE" || userType === 'MAKER')  && (supplierDetails?.trusteeKybStatus!=true && supplierDetails?.isTrusteeKybRejected != true)) ||(supplierDetails?.kybStatus != "VERIFIED" &&
              supplierDetails?.kybStatus != "REJECTED" && userType !="TRUSTEE" && userType !== 'MAKER')? (
                <Row className="center_res btn-groups">
                    <Button
                      className={`${isAllChecklistChecked() && !Object.values(specialErrors).some(error => error) ? "rounded" : "rounded disabled"}`}
                      htmlType="submit"
                      onClick={() => {
                        if (isAllChecklistChecked() && !Object.values(specialErrors).some(error => error) ) openApproveModal();
                      }}
                      loading={loading}
                    >
                      Approve { form.getFieldValue("typeOfEntity") == "INDIVIDUAL" ? "KYC" : "KYB"}
                    </Button> 
                    <Button
                      className={isAllChecklistChecked() ? "rounded_reject_light" : 'rounded_reject_light disabled'}
                      onClick={() => {
                        if (isAllChecklistChecked()) openRejectModal();
                      }}
                      loading={loading}
                    >
                      Reject { form.getFieldValue("typeOfEntity") == "INDIVIDUAL" ? "KYC" : "KYB"}
                    </Button> 
                </Row>
              ) : 
           null
            }

      </DefaultLayout>

{/* Upload Documents */}
    <Modal
        open={uploadModal}
        footer={false}
        className="classification-modal"
        title={
          <span className="change-client-classification ml-4">
            Upload Documents
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Row gutter={16} className="mt-3">
              <Col span={24}>
              <div className="doc-block w-100">
                    <div className={ "d-flex  moa-doc-list flex-column"}>
                      <>
                      <p className="seller-text-category" style={{marginLeft:'0px'}}>Document name</p>
                           <Input placeholder="Enter document name." value={text} type="text" className="mb-3" onChange={(e) => setText(e.target.value)} style={{background:'#fafafa'}}/>
                         
                      </>
                    </div>
                  </div>
              </Col>
              <Col span={24}>
              <div>
                          { uploadedFile?.url ? <Card
                            className=" kybcard" 
                            cover={
                              uploadedFile?.url.includes(
                                ".pdf"
                              ) ? (
                                <>
                                  <div className="admin-panel-pdf-preview">
                                    <Document
                                      file={uploadedFile?.url}
                                      externalLinkRel="_blank"
                                    >
                                      <Page pageNumber={1} width={175} />
                                    </Document>
                                  </div>
                                </>
                              ) : (
                                <Image
                                  alt="example"
                                  src={uploadedFile?.url}
                                  height={175}
                                />
                              )
                            }
                          >
                          </Card> : <>
                          <div className="enter-text-category d-flex mb-2 m-0 p-0">Document
                            <Tooltip
                              title={
                                <span className="response-tooltip">
                                  Emirates ID or Passport is required
                                </span>
                              }
                              overlayClassName='custom-tooltip'
                              placement="top"
                            >
                              <img src={infoIcon} className="ms-1" />
                            </Tooltip>
                          </div>
                          <Dragger {...propss} className="moa-document d-block">
                           <div style={{ marginTop: (fileList && fileList?.length > 0 || typeof fileList === 'object') ? -12 : 27 }}>
                              <Image src={PlusUpload} alt="passport" preview={false} />
                              <div className="mt-3 subText_xs overflowText_twoLines w-upload">
                                {fileList?.some((file: any) => file.status === 'REJECTED') ? (
                                  <span className="rejectReasonText">Re-upload</span>
                                ) : (
                                  "Document"
                                )}
                              </div>
                            </div>
                            </Dragger>
                          </> }
                        </div>            
              </Col>

              <Col span={24}>
              <div className="">
                <Button
                  key="button"
                  type="primary"
                  htmlType="button"
                  className="modal-button mt-5"
                  loading={loader}
                  onClick={() => {
                    
                    onUploadDocument();
                    // updateKyb

                    
                  }}
                >
                  Submit
                </Button> 
                <Button
                  key="cancel"
                  type="primary"
                  className="modal-button-cancel mt-5 mx-2"
                  onClick={() => {
                    setUploadModal(false)
                    
                  }}
                >
                  Cancel
                </Button>
               </div>
              </Col>

            </Row>
                 

        
      </Modal>


      {/* Approve kyb */}
      <Modal
        open={ApproveModal}
        footer={false}
        className="classification-modal"
        title={
          <span className="change-client-classification">
            Approve { form.getFieldValue("typeOfEntity") === "INDIVIDUAL" ? "KYC" : "KYB"}
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={() => verifySupplier("approved")}
        >
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              // {
              //   min:20,
              //   message:"Please enter minimum 20 characters"
              // }
              {
                validator: async (_, value) => {
                  await validatePopupCommentFields(value);
                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}`));
                },
              },
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              // onInput={handleInput}
              placeholder="Please enter your comment"
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit 
            </Button>
            <Button
              key="cancel"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
      {/* Reject Kyb */}
      <Modal
        open={RejectModal}
        footer={false}
        className="classification-modal"
        title={
          <span className="change-client-classification errMsg">
            Reject { form.getFieldValue("typeOfEntity") === "INDIVIDUAL" ? "KYC" : "KYB"}
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={() => verifySupplier("rejected")}
        >
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              // {
              //   min:20,
              //   message:"Please enter minimum 20 characters"
              // }
              {
                validator: async (_, value) => {
                  await validatePopupCommentFields(value);
                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}`));
              }
            },
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              placeholder="Please enter your comment"
              // onInput={handleInput}
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
              loading={loading}
            >
              Submit 
            </Button>
            <Button
              key="cancel"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>



      {/* approve document */}
      <Modal
        open={CommentModal}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification">
            {modalTitle}
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={commentForm}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={handleApprove}
        >
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              // {
              //   min:20,
              //   message:"Please enter minimum 20 characters"
              // }
              {
                validator: async (_, value) => {
                  await validatePopupCommentFields(value);
                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}`));
              }
            },
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              placeholder="Please enter your comment"
              // onInput={handleInput} 
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit
            </Button>
            <Button
              key="submit"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
      {/* Reject document */}
      <Modal
        open={CommentModalReject}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification errMsg">
            Reject {modalTitle}
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={commentForm}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={handleReject}
        >
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              // {
              //   min:20,
              //   message:"Please enter minimum 20 characters"
              // }
              {
                validator: async (_, value) => {
                  await validatePopupCommentFields(value);
                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}`));
              }
            },
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              placeholder="Please enter your comment"
              // onInput={handleInput}
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="">
            <Button
              key="submit_rj_approve"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit
            </Button>
            <Button
              key="submit_rj_cancel"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal className="kyc-search-again"
        title={
          <div>
            Screening details
          </div>
        }
        width={800}
        open={searchAgianKybModal}
        footer={false}
        onCancel={() => setSearchAgianKybModal(false)}
        closable={true}
      >
        <Form scrollToFirstError form={searchAgainForm} onFinish={getAndSaveSearchAgainDetails}>
          <div>
            <Row gutter={16}>
              <Col  xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Threshold<span className="red">*</span></p>
                <InputText
                  fieldname="Threshold"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: true,
                      message: "Threshold is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Threshold number" type="number" />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">First Name<span className="red">*</span></p>
                <InputText
                  fieldname="FirstName"
                  className="inputField w-100 error-input"
                   rules={[
                    {
                      required: true,
                      message: "First name is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter first name." />
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Middle Name</p>
                <InputText
                  fieldname="MiddleName"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter middle name." />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Last Name<span className="red">*</span></p>
                <InputText
                  fieldname="LastName"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: true,
                      message: "Last name is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter last name." />
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Nationality</p>
                <InputText
                  fieldname="Nationality"
                  className="inputField w-100 error-input"
                >
                  <Select
                    placeholder="Select nationality *"
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.riskItem} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </Col>

            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Customer Id Number</p>
                <InputText
                  fieldname="CustomerIdNumber"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter customer Id number." />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Customer Id Expiry</p>
                <InputText
                  fieldname="CustomerIdExpiry"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter customer Id expiry." />
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Match Category</p>
                <InputText
                  fieldname="MatchCategory"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter match category." />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Company Code</p>
                <InputText
                  fieldname="CompanyCode"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter company code." />
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Datasets<span className="red">*</span></p>
                <InputText
                  fieldname="Datasets"
                  rules={[{ required: true, message: "Datasets are required!" }]}
                  className="modal_inputField select"
                >
                  <Select
                    placeholder="Select datasets"
                    mode="multiple"
                    allowClear
                    maxTagCount="responsive"
                    className="datasets-custom-menu"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    onChange={(e) => { setDatasetValue(e) }}
                  >
                    {
                      datasetsOptions?.map((item: any) => (
                        <Option key={item} value={item}>
                          {item}
                        </Option>
                      ))
                    }
                  </Select>
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Is FATF Monitoring<span className="red">*</span></p>
                <InputText
                  fieldname="fatf"
                  rules={[
                    { required: true, message: "Is the country subject to increased monitoring by FATF?" },
                  ]}
                  className="modal_inputField select"
                >
                  <Select
                    placeholder="Is FATF Monitoring *"
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {fatfList?.length > 0 && fatfList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.id} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </Col>
            </Row>
          </div>
          <div className="d-flex my-4">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
              loading={loading}
            >
              Search
            </Button>
            <Button
              key="cancel"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => setSearchAgianKybModal(false)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal >
      <Modal
        open={viewModal}
        footer={false}
        className="modal-box "
        title={
          <span className="change-client-classification">
            Preview
            <hr className="lightgrayHr" />
          </span>
        }
        centered
        width={520}
        onCancel={() => setViewModal(false)}
      >
        <div className="text-center">
            <Image
              src={imagUrl}
              preview={false}
              alt="preview"
              className="max-h-460 my-3"
            />
        </div>
        <Button
          type="primary"
          className="docudownloadBtn"
          onClick={() => {
            // downloadFile();
            downloadFile(imagUrl)
          }}
        >
          Download
        </Button>
      </Modal>

      {imagUrl.includes(".pdf") && 
            <DisputePdfViewModal
            isverifyVisible={isverifyVisible}
            setverifyVisible={setverifyVisible}
            imagUrl={imagUrl}
            setImagUrl={setImagUrl}
          />} 
     
      </div>
  )
};

export default SupplierGuestDetails;
