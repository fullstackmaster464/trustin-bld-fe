import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tabs,
  message,
  Typography,
  Tooltip
} from "antd";
import { useNavigate } from "react-router-dom";
import {  StrydeKYCManagementList } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Phone from "../../assets/img/Phone.svg";
import Email from "../../assets/img/Email.svg";
import Nation from "../../assets/img/Nation.svg";
import Individual from "../../assets/img/Individual.svg";
import download from "../../assets/img/Download.svg";
// import Flag from "../../assets/img/flag.svg";
// import Job from "../../assets/img/job_gray.svg";
// import Doc from "../../assets/img/grayDoc.svg";
import Meta from "antd/es/card/Meta";
import {
  PrimaryOutLineButton,
  SecondaryOutLineButton,
} from "../ui-elements/ButtonRepo";
import { useEffect, useState } from "react";
import ApproverDetails from "../Common/ApproverDetails";
import { NormalText } from "../ui-elements/TextRepo";
import {
  downloadKybDetails,
  // getRiskConfiguration,
  getsyncStrydeDetailsByAlias,
  updateClientClassificationByAlias,
  verifyStrydeByAlias,
  verifyStrydeDocumentByAlias,
} from "../../services/admin";
import {
  COMPANY_ROLE,
  DOCUMENT_TYPE,
  ENTITY_TYPE,
  KYC_KYB_COMMENT_TEXT_LIMIT,
  RISK_ASSESSMENT_FINAL_RISK_SCORE,
  getLocalStorage,
} from "../Common/Constants";
import TabPane from "antd/lib/tabs/TabPane";
import moment from "moment";
// @ts-ignore
import multiDownload from "multi-download";
import ResyncStrydeKybKycCard from "./ResyncStrydeKybKycCard";
import RiskAssesmentCard from "./RiskAssesmentCard";
import SearchAgainStrydeKybKycModal from "./SearchAgainStrydeKybKycModal";
import DefaultLayout from "../Common/DefaultLayout";
import { Document, Page } from "react-pdf";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import { getAllCountries } from "../../services/masterData";
import { CommentModalForm } from "./CommentModalForm";
// import AddressDetails from "./AddressDetails";
const { Text } = Typography;
const { TextArea } = Input;

const StrydeKYCDetails = (): any => {
  const navigate = useNavigate();
  const [classificationModalVisible, setClassificationModalVisible] =
    useState(false);
  const [CommentModal, setCommentModal] = useState(false);
  const [CommentModalReject, SetCommentModalReject] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [form] = Form.useForm();
  const [cmtForm] = Form.useForm();
  const [dropDownValue, setDropDownValue] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [ApproveModal, setApproveModal] = useState(false);
  const [RejectModal, setRejectModal] = useState(false);
  const [isAllDocUpdated, setIsAllDocUpdated] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadOption, setDownloadOption] = useState(3);
  const [checkboxComment, setCheckboxComment] = useState<any>({});
  const [checkboxCommentApprover, setCheckboxCommentApprover] = useState<any>({});
  const [stryedKYCDetails, setStryedKYCDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [nameAndIdVerification, setNameAndIdVerification] = useState(false);
  const [validDocumentVerification, setValidDocumentVerification] =
    useState(false);
  const [amlScreening, setAmlScreening] = useState(false);
  const [adverseMedia, setAdverseMedia] = useState(false);
  const [PoliticallyPerson, setPoliticallyPerson] = useState(false);
  const [holdModal, setHoldModal] = useState(false);
  const strydeAlias: any = window?.location?.pathname.split("/").pop();
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const currentUserAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias
  const [searchKybModal, setSearchKybModal] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState({});
  const [digiScreeningPayload, setDigiScreeningPayload] = useState({});
  const [digiScreeningResult, setDigiScreeningResult] = useState({});
  const [formCheckKyB] = Form.useForm();
  const [riskAssessmentPayload, setRiskAssessmentPayload] = useState({});
  const [otherComment, setOtherComment] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [countryList, setCountryList] = useState([]);
  const [brithPlaceList, setBrithPlaceList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [kycFATCACountries, setKycFATCACountries] = useState<any>([]);
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const isApprover = ['TRUSTEE', 'APPROVER', 'MAKER'].includes(userType);
  const isAuthorizer = ['ADMIN', 'SENIOR_MANAGEMENT', 'AUTHORIZER', 'CHECKER'].includes(userType);
  const [fileId, setFileId] = useState<number>();
  const [strydeResyncPayload, setStrydeResyncPayload] = useState({trustinContractId:"", strydeUserId:""});

  const [formStryedDocumentApprove] = Form.useForm();
  const [formStryedDocumentReject] = Form.useForm();
  const [formStryedApproveKYC] = Form.useForm();
  const [formStryedRejectKYC] = Form.useForm();
  const [formStryedHoldKYC] = Form.useForm();

  useEffect(() => {
    getStryedKycDetails();
    // getRiskConfigurationDetails();
  }, [strydeAlias]);

  useEffect(() => {
    getCountryList();
  }, []);

  useEffect(() =>{
    setAllCheckboxComments(stryedKYCDetails)
  }, [stryedKYCDetails]);

  const handleDownload = async (url: string, isPDF: any) => {
    if (!url) {
      message.error("Unable to download: Document URL is missing");
      return;
    }

    const popup: Window | null = window.open("", "_blank")
    if (popup) {
      if (isPDF) {
        const sanitizedUrl = new URL(url).toString();
        const iframeHTML = `
        <iframe src="${sanitizedUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
        `;
        const fallbackHTML = `
          <p style="margin-top: 10px;font-size: 25px">
            Your browser does not support viewing PDFs. 
            <a href="${url}" download="document.pdf" style="color: blue; text-decoration: underline;">Click here to download</a>.
          </p>
        `;
        const canEmbedPDF = document.createElement("iframe").src !== "";
        popup.document.write(canEmbedPDF ? iframeHTML : fallbackHTML);
      } else {
        const imgHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 400px;" />`;
        popup.document.write(imgHTML);
      }
    }
    
    const link = document.createElement("a");
    link.href = url;
  
    if (isPDF) {
      link.download = "document.pdf";
    } else {
      link.download = "image.jpg";
    }
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDocumentButton = (
    title: string,
    fileId: any,
    isApprove: boolean
  ) => {
    setModalTitle(
     title
    );
    if (isApprove) {
      setCommentModal(true);
    } else {
      SetCommentModalReject(true);
    }
    setFileId(fileId)
  };

  const downloadKYCDetails = () => {
    const files = [];
    const data = stryedKYCDetails?.documents;
    if (data?.repDocFront?.url) {
      files.push(data?.repDocFront?.url);
    }
    if (data?.repDocBack?.url) {
      files.push(data?.repDocBack?.url);
    }
    if (data?.repAddProof?.url) {
      files.push(data?.repAddProof?.url);
    }
    if (data?.businessAddProof?.url) {
      files.push(data?.businessAddProof?.url);
    }
    if (data?.businessRegProof?.url) {
      files.push(data?.businessRegProof?.url);
    }
    setLoader(true);
    if (downloadOption == 1) {
      downloadKybDetails(strydeAlias).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "stryedKYCDetails.xlsx");
        document.body.appendChild(link);
        link.click();
        setDownloadModal(false);
        setLoader(false);
      });
    }
    if (downloadOption == 2) {
      multiDownload(files);
      setDownloadModal(false);
      setLoader(false);
    }
    if (downloadOption == 3) {
      downloadKybDetails(strydeAlias).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "stryedKYCDetails.xlsx");
        document.body.appendChild(link);
        link.click();
        setDownloadModal(false);
        setLoader(false);
      });
      multiDownload(files);
    }
  };
  const getStryedKycDetails = (isUpload = "") => {
    getsyncStrydeDetailsByAlias(strydeAlias).then((response: any) => {
      if (response?.status === 201 || response?.status === 200) {
        const data = response?.data;
        setStrydeResyncPayload({trustinContractId:data?.trustinContractId, strydeUserId:data?.strydeUserId})
        if ((userType === "TRUSTEE" || userType === 'MAKER') && (['VERIFIED', 'REJECTED'].includes(data?.trusteeVerificationStatus) || (data?.verificationStatus === "VERIFIED" ||
          data?.verificationStatus === "REJECTED"))) {
          setDisable(true)
        } else if (userType !== "TRUSTEE" && userType !== 'MAKER' && (data?.verificationStatus === "VERIFIED" ||
          data?.verificationStatus === "REJECTED")) {
          setDisable(true)
        } else {
          setDisable(false)
        }
        setStryedKYCDetails(data);
     
        if (isUpload == "") {
        
           // admin comments
           const comments = {
            amlScreening: data?.repAmlScreeningComment,
            adverseMedia: data?.repAdverseMediaComment,
            nameAndIdVerification: data?.repNameAndIdVerificationComment,
            validDocumentVerification: data?.repValidDocumentVerificationComment,
            politicallyExposedComment: data?.repPoliticallyExposedComment,
            otherCommentAndNotes: data?.repOtherCommentAndNotes,
          };
      
          // approver comments
          const commentsApprover = {
            amlScreening: data?.trusteeRepAmlScreeningComment,
            adverseMedia: data?.trusteeRepAdverseMediaComment,
            nameAndIdVerification: data?.trusteeRepNameAndIdVerificationComment,
            validDocumentVerification: data?.trusteeRepValidDocumentVerificationComment,
            politicallyExposedComment: data?.trusteeRepPoliticallyExposedComment,
            otherCommentAndNotes: data?.trusteeRepOtherCommentAndNotes,
          };
          setCheckboxComment(comments);
          setCheckboxCommentApprover(commentsApprover);
          cmtForm.setFieldsValue({
            validDocumentVerificationApprover: commentsApprover?.validDocumentVerification,
            amlScreeningApprover: commentsApprover?.amlScreening,
            adverseMediaApprover: commentsApprover?.adverseMedia,
            nameAndIdVerificationApprover: commentsApprover?.nameAndIdVerification,
            politicallyExposedCommentApprover: commentsApprover?.politicallyExposedComment,
            otherCommentAndNotesApprover: commentsApprover?.otherCommentAndNotes,
          });
          cmtForm.setFieldsValue({
            validDocumentVerification: comments?.validDocumentVerification,
            amlScreening: comments?.amlScreening,
            adverseMedia: comments?.adverseMedia,
            nameAndIdVerification: comments?.nameAndIdVerification,
            politicallyExposedComment: comments?.politicallyExposedComment,
            otherCommentAndNotes: comments?.otherCommentAndNotes,
          });
      
          // checkbox data
          if (isApprover) {
            setAmlScreening(!!commentsApprover.amlScreening);
            setValidDocumentVerification(!!commentsApprover.validDocumentVerification);
            setAdverseMedia(!!commentsApprover.adverseMedia);
            setNameAndIdVerification(!!commentsApprover.nameAndIdVerification);
            setPoliticallyPerson(!!commentsApprover.politicallyExposedComment);
            setOtherComment(!!commentsApprover.otherCommentAndNotes);
            setDropDownValue(Number(data?.trusteeRepClientClassification));
          } else {
            setAmlScreening(!!comments.amlScreening);
            setValidDocumentVerification(!!comments.validDocumentVerification);
            setAdverseMedia(!!comments.adverseMedia);
            setNameAndIdVerification(!!comments.nameAndIdVerification);
            setPoliticallyPerson(!!comments.politicallyExposedComment);
            setOtherComment(!!comments.otherCommentAndNotes);
            setDropDownValue(Number(data?.repClientClassification));
          }
        }
        if (isAuthorizer) {
          if (data.repDocFront?.verified === "VERIFIED" && (data.repDocType === 'PASSPORT' && !data.repDocBack || data.repDocBack?.verified === "VERIFIED")) {            
            setIsAllDocUpdated(true);
          }
        }
        if (userType === "TRUSTEE" || userType === 'MAKER') {
          if (data.repDocFront?.isCompliance === true &&  (data.repDocType === 'PASSPORT' && !data.repDocBack || data.repDocBack?.isCompliance === true)) {
            setIsAllDocUpdated(true);
          }
        }


        let riskScore = 0;
        if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.LOW_RISK) {
          riskScore = 1;
        } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.MEDIUM_RISK) {
          riskScore = 2;
        } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.HIGH_RISK) {
          riskScore = 3;
        }
        if (data?.clientClassification && !isNaN(parseInt(data?.clientClassification)) && parseInt(data?.clientClassification) !== riskScore) {
          riskScore = parseInt(data?.clientClassification);
        }
        if (riskScore > 0) {
          setDropDownValue(riskScore);
        }

        if (typeof data?.riskAssessment === 'object' && Object.keys(data?.riskAssessment)?.length > 0 && data?.riskAssessment) {
          setRiskAssessment(data?.riskAssessment);
        }
        if (typeof data?.digiScreeningPayload === 'object' && Object.keys(data?.digiScreeningPayload)?.length > 0 && data?.digiScreeningPayload) {
          setDigiScreeningPayload(data?.digiScreeningPayload);
        }
        if (typeof data?.digiScreeningPayload === 'object' && Object.keys(data?.digiScreeningPayload)?.length > 0 && data?.digiScreeningPayload) {
          setDigiScreeningPayload(data?.digiScreeningPayload);
        }
        if (typeof data?.digiScreeningResult === 'object' && Object.keys(data?.digiScreeningResult)?.length > 0 && data?.digiScreeningResult) {
          setDigiScreeningResult(data?.digiScreeningResult);
        }
        if (typeof data?.riskAssessmentPayload === 'object' && Object.keys(data?.riskAssessmentPayload)?.length > 0 && data?.riskAssessmentPayload) {
          setRiskAssessmentPayload(data?.riskAssessmentPayload);
        }
        if (typeof data?.riskAssessmentPayload === 'object' && Object.keys(data?.riskAssessmentPayload)?.length > 0 && data?.riskAssessmentPayload) {
          setRiskAssessmentPayload(data?.riskAssessmentPayload);
        }
        if (data?.fatcaCountries?.length > 0) {
          setKycFATCACountries(data?.fatcaCountries);
        }
        // setAllCheckboxComments(data)
      }
      const res = response?.data;
  return res
    }).then((res:any)=>{
      setAllCheckboxComments(res)
    });
  };

  const getReqBodyForApproveRejectHoldStryde = () => {
    const commonProperties = {
      alias: currentUserAlias,
      type: 0,
      isRejected: false,
      isHold: false,
      comment,
      clientClassification: dropDownValue ?? stryedKYCDetails?.clientClassification,
    };
    const approverComments = isApprover
      ? {
        adverseMediaComment: checkboxCommentApprover.adverseMedia,
        amlScreeningComment: checkboxCommentApprover.amlScreening,
        nameAndIdVerificationComment: checkboxCommentApprover.nameAndIdVerification,
        politicallyExposedComment: checkboxCommentApprover?.politicallyExposedComment,
        validDocumentVerificationComment: checkboxCommentApprover.validDocumentVerification,
        otherCommentAndNotes: checkboxCommentApprover.otherCommentAndNotes,
      }
      : {
        adverseMediaComment: checkboxComment.adverseMedia,
        amlScreeningComment: checkboxComment.amlScreening,
        nameAndIdVerificationComment: checkboxComment.nameAndIdVerification,
        politicallyExposedComment: checkboxComment?.politicallyExposedComment,
        validDocumentVerificationComment: checkboxComment.validDocumentVerification,
        otherCommentAndNotes: checkboxComment.otherCommentAndNotes,
      };

    return { ...commonProperties, ...approverComments };
  };

  const isValueExist = (value: any): boolean => {
    return value !== null && value !== undefined;
  };

  const checkLength = (checkboxObj: any): boolean => {
    return Object.values(checkboxObj).every(
      (value: any) =>
        isValueExist(value) &&
        (typeof value !== 'string' || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT)
    );
  };

  const approveKYC = async () => {
    setLoading(true);
    const reqBody = getReqBodyForApproveRejectHoldStryde();
    await verifyStryde(reqBody)
  };

  const rejectKYC = async () => {
    setLoading(true);
    let reqBody = getReqBodyForApproveRejectHoldStryde()
    reqBody = { ...reqBody, isRejected: true }
    await verifyStryde(reqBody)
  };

  const holdKYC = async () => {
    setLoading(true);
    let reqBody = getReqBodyForApproveRejectHoldStryde()
    reqBody = { ...reqBody, isHold: true }
    await verifyStryde(reqBody)
  };

  const verifyStryde = async (reqBody: any) => {
    await verifyStrydeByAlias(strydeAlias, reqBody).then((res: any) => {
      setLoading(false);
      if (res.status === 201 || res.status == 200) {
        getStryedKycDetails();
        handleModalCancel();
      }
    })
  }

  const verifyStrydeDocument = async (reqBody: any) => {
    await verifyStrydeDocumentByAlias(strydeAlias, reqBody).then((res: any) => {
      setLoading(false);
      if (res.status === 201 || res.status == 200) {
        getStryedKycDetails();
        handleModalCancel();
      }
    })
  }

  const isAllChecklistChecked = () => {
    let check = validDocumentVerification &&
      nameAndIdVerification &&
      amlScreening &&
      adverseMedia &&
      PoliticallyPerson &&
      otherComment;
    const condA = checkboxComment?.amlScreening &&
      checkboxComment?.adverseMedia &&
      checkboxComment?.nameAndIdVerification &&
      checkboxComment?.validDocumentVerification &&
      checkboxComment?.politicallyExposedComment &&
      checkboxComment?.otherCommentAndNotes;
    const condB = checkboxCommentApprover?.amlScreening &&
      checkboxCommentApprover?.adverseMedia &&
      checkboxCommentApprover?.nameAndIdVerification &&
      checkboxCommentApprover?.validDocumentVerification &&
      checkboxCommentApprover?.politicallyExposedComment &&
      checkboxCommentApprover?.otherCommentAndNotes;

    const condALength = checkLength(checkboxComment);
    const condBLength = checkLength(checkboxCommentApprover);

    if (isApprover) {
      check &&=(condA && condALength) || (condB && condBLength);
    } else {
      check &&= condA && condALength;
    }
    return (
      validDocumentVerification &&
      nameAndIdVerification &&
      amlScreening &&
      adverseMedia &&
      PoliticallyPerson &&
      otherComment &&
      check
    );
  };

  const handleModalCancel = () => {
    setClassificationModalVisible(false);
    setCommentModal(false);
    setApproveModal(false);
    setRejectModal(false);
    setDownloadModal(false);
    SetCommentModalReject(false);
    setSearchKybModal(false);
    setHoldModal(false);
    form.resetFields();
    formStryedDocumentApprove.resetFields();
    formStryedDocumentReject.resetFields();
    formStryedApproveKYC.resetFields();
    formStryedRejectKYC.resetFields();
    formStryedHoldKYC.resetFields();
    setComment("");
    setFileId(0);
  };

  const handleReject = async () => {
    const obj = {
      alias: currentUserAlias,
      isApprove: false,
      comment: comment,
      fileId: fileId,
    };
    await verifyStrydeDocument(obj);
  };

  const handleApprove = async () => {
    const obj = {
      alias: currentUserAlias,
      isApprove: true,
      comment: comment,
      fileId: fileId,
    };
    await verifyStrydeDocument(obj);
  };

  const openApproveModal = () => {
    setApproveModal(true);
  };

  const openRejectModal = () => {
    setRejectModal(true);
  };

  const checkCommentsCheckbox = (id: any) => {
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
      case "politicallyExposedComment":
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
    if (isAuthorizer) {
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
    if (userType === 'TRUSTEE' || userType === 'MAKER') {
      // const element = document.getElementById(id + 'Approver')!;
      // element.style.height = "1px";
      // element.style.height = 25 + element.scrollHeight + "px";
      const comments = { ...checkboxCommentApprover };
      comments[id] = value;
      setCheckboxCommentApprover(comments);
      checkCommentsCheckbox(id)
    }
  };

  const handleDropdownChange = (e: any) => {
    setDropDownValue(e?.target?.value);
    if (disable) {
      openClassificationModal();
      form.setFieldValue("title", e.target.value);
    }
  };

  const handleComment = (event: any, maxLimit: number) => {
    const input = event.target.value;

    if (input.length <= maxLimit) {
      setComment(input);
    }
  };

  const openClassificationModal = () => {
    setClassificationModalVisible(true);
  };

  const goBack = () => {
    navigate(StrydeKYCManagementList);
  };

  // const getRiskConfigurationDetails = async () => {
  //   setLoading(true);
  //   await getRiskConfiguration({ RiskCategory: "I" })
  //     .then((response) => {
  //       if (response?.data?.status === 201 || response?.data?.status == 200) {
  //         setLoading(false);
  //         if (response?.data?.result && response?.data?.result?.length) {
  //           const result = response?.data?.result
  //           const graphicRiskIndex = result.findIndex((d: any) => d.riskCategory == 'Geographic Risk')
  //           if (graphicRiskIndex > -1) {
  //             result[graphicRiskIndex]['riskTypes']?.map((r: any) => {
  //               if (r?.riskType == 'Nationality') {
  //                 setCountryList(r?.riskItems || [])
  //                 setBrithPlaceList(r?.riskItems || [])
  //               }
  //             })
  //           }
  //           return result
  //         }
  //       }
  //     }).catch((error) => {
  //       setLoading(false);
  //       message.error(error?.error?.message ? error?.error?.message : "Something went wrong")
  //     });
  // }
  
  const getCountryList = () => {
    getAllCountries()
      .then((response: any) => {
        setCountryList(response?.data)
        setBrithPlaceList(response?.data)
      })
      .catch(() => {
        message.error("Could not fetch country. Please try again later");
      });
  };
  const handleInput = (e: any) => {
    const regex = /^[A-Za-z,.\- ]*$/;
    const currentValue = e.target.value;
    if (!regex.test(currentValue)) {
      e.preventDefault();
      e.target.value = currentValue.slice(0, -1);
    }
    // else {
    //   adjustHeight("validDocumentVerification", currentValue);
    // }
  };

  useEffect(() => {
    const rejectedReason: any = [{ rejectReason: [] }];
    if (
      stryedKYCDetails?.repDocFront?.verified === "REJECTED" ||
      stryedKYCDetails?.repDocFront?.isCompliance === "false"
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: `${DOCUMENT_TYPE[stryedKYCDetails?.repDocType]} Front`,
        reason: stryedKYCDetails?.repDocFront?.reason,
      });
    }
    if (
      stryedKYCDetails?.repDocBack?.verified === "REJECTED" ||
      stryedKYCDetails?.repDocBack?.isCompliance === "false"
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: `${DOCUMENT_TYPE[stryedKYCDetails?.repDocType]
          } back`,
        reason: stryedKYCDetails?.repDocBack?.reason,
      });
    }

    if (
      stryedKYCDetails?.repAddProof?.status === "REJECTED" ||
      stryedKYCDetails?.repAddProof?.isCompliance === "false"
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Address proof",
        reason: stryedKYCDetails?.repAddProof?.reason,
      });
    }

    // setRejectedReason(rejectedReason);
  }, [stryedKYCDetails]);

  const handleRiskClassificationSubmit = async () => {
    try {
      setLoading(true);
      const reqBody = {
        alias: currentUserAlias,
        type: 0,
        comment: comment,
        clientClassification: dropDownValue,
      };

      const res = await updateClientClassificationByAlias(strydeAlias, reqBody);

      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        handleModalCancel();
        getStryedKycDetails();
        message.success("Risk classification successfully saved");
      }
    } catch (error) {
      setLoading(false);
      message.error("Oops! Something went wrong. Please try again later");
    }
  }

  // const renderMultipleTaxResidencyRows = () => {
  //   const rows = [];
  //   for (let i = 0; i < parseInt(kycFATCACountries?.kycNumberOfCountry ?? 0); i++) {
  //     rows.push(
  //       <>
  //         <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
  //           <Col>
  //             <Space direction="vertical">
  //               <Text type="secondary">
  //                 <b>Please let us know your other tax residency.</b>
  //               </Text>
  //               <Text>
  //                 <b>
  //                   {toTitleCase(kycFATCACountries?.[`hasMultipleTaxResidencyKycCountry_${i}`]) ?? '---'}
  //                 </b>
  //               </Text>
  //             </Space>
  //           </Col>
  //         </Row>
  //         <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
  //           <Col>
  //             <Space direction="vertical">
  //               <Text type="secondary">
  //                 <b>Do you have a Tax identification number? </b>
  //               </Text>
  //               <Text>
  //                 <b>
  //                   {toTitleCase(kycFATCACountries?.[`hasMultipleKycTIN_${i}`]) ?? '---'}
  //                 </b>
  //               </Text>
  //             </Space>
  //           </Col>
  //         </Row>
  //         {kycFATCACountries?.[`hasMultipleKycTIN_${i}`] === 'yes' && (
  //           <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
  //             <Col>
  //               <Space direction="vertical">
  //                 <Text type="secondary">
  //                   <b>Tax identification number</b>
  //                 </Text>
  //                 <Text>
  //                   <b>
  //                     {kycFATCACountries?.[`multipleKycTinNo_${i}`] ?? '---'}
  //                   </b>
  //                 </Text>
  //               </Space>
  //             </Col>
  //           </Row>
  //         )}
  //         {kycFATCACountries?.[`hasMultipleKycTIN_${i}`] === 'no' && (
  //           <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
  //             <Col>
  //               <Space direction="vertical">
  //                 <Text type="secondary">
  //                   <b>Reason for no TIN Number</b>
  //                 </Text>
  //                 <Text>
  //                   <b>
  //                     {kycFATCACountries?.[`multipleKycNoTinReason_${i}`] === "countryNotissueTINs"
  //                       ? "Country/ Jurisdiction does not issue TINs." : kycFATCACountries?.[`multipleKycNoTinReason_${i}`] === "countryNotRequirToProvideTIN"
  //                         ? "Country/ Jurisdiction does not require me to provide TIN." : kycFATCACountries?.[`multipleKycNoTinReason_${i}`] === "unableToObtainTIN"
  //                           ? "Unable to obtain a TIN." : ""}
  //                   </b>
  //                 </Text>
  //               </Space>
  //             </Col>
  //           </Row>
  //         )}
  //       </>
  //     );
  //   }
  //   return rows;
  // };


  const handlePDFView = (url: any) => {
    if (url) {
      setImagUrl(url);
      setverifyVisible(true)
    }
  }

  const setAllCheckboxComments = (data:any) => {
    if (isApprover && (['VERIFIED', 'REJECTED'].includes(data?.trusteeVerificationStatus) || (['VERIFIED', 'REJECTED'].includes(data?.verificationStatus)))) {
      setDisable(true)
    } else if (!isApprover && (['VERIFIED', 'REJECTED'].includes(data?.verificationStatus))) {
      setDisable(true)
    } else {
      setDisable(false)
    }
     // admin comments
     const comments = {
      amlScreening: data?.repAmlScreeningComment,
      adverseMedia: data?.repAdverseMediaComment,
      nameAndIdVerification: data?.repNameAndIdVerificationComment,
      validDocumentVerification: data?.repValidDocumentVerificationComment,
      politicallyExposedComment: data?.repPoliticallyExposedComment,
      otherCommentAndNotes: data?.repOtherCommentAndNotes,
    };

    // approver comments
    const commentsApprover = {
      amlScreening: data?.trusteeRepAmlScreeningComment,
      adverseMedia: data?.trusteeRepAdverseMediaComment,
      nameAndIdVerification: data?.trusteeRepNameAndIdVerificationComment,
      validDocumentVerification: data?.trusteeRepValidDocumentVerificationComment,
      politicallyExposedComment: data?.trusteeRepPoliticallyExposedComment,
      otherCommentAndNotes: data?.trusteeRepOtherCommentAndNotes,
    };
    cmtForm.setFieldsValue({
      validDocumentVerificationApprover: commentsApprover?.validDocumentVerification,
      amlScreeningApprover: commentsApprover?.amlScreening,
      adverseMediaApprover: commentsApprover?.adverseMedia,
      nameAndIdVerificationApprover: commentsApprover?.nameAndIdVerification,
      politicallyExposedCommentApprover: commentsApprover?.politicallyExposedComment,
      otherCommentAndNotesApprover: commentsApprover?.otherCommentAndNotes,
    });
    cmtForm.setFieldsValue({
      validDocumentVerification: comments?.validDocumentVerification,
      amlScreening: comments?.amlScreening,
      adverseMedia: comments?.adverseMedia,
      nameAndIdVerification: comments?.nameAndIdVerification,
      politicallyExposedComment: comments?.politicallyExposedComment,
      otherCommentAndNotes: comments?.otherCommentAndNotes,
    });
    setCheckboxComment(comments);
    setCheckboxCommentApprover(commentsApprover);

    // checkbox data
    if (isApprover) {
      setAmlScreening(!!commentsApprover.amlScreening);
      setValidDocumentVerification(!!commentsApprover.validDocumentVerification);
      setAdverseMedia(!!commentsApprover.adverseMedia);
      setNameAndIdVerification(!!commentsApprover.nameAndIdVerification);
      setPoliticallyPerson(!!commentsApprover.politicallyExposedComment);
      setOtherComment(!!commentsApprover.otherCommentAndNotes);
      setDropDownValue(Number(data?.trusteeRepClientClassification));
    } else {
      setAmlScreening(!!comments.amlScreening);
      setValidDocumentVerification(!!comments.validDocumentVerification);
      setAdverseMedia(!!comments.adverseMedia);
      setNameAndIdVerification(!!comments.nameAndIdVerification);
      setPoliticallyPerson(!!comments.politicallyExposedComment);
      setOtherComment(!!comments.otherCommentAndNotes);
      setDropDownValue(Number(data?.repClientClassification));
    }
  }

  const generateFatcaRow = (label: any, value: any) => {
    return (
      <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
        <Col>
          <Space direction="vertical">
            <Text type="secondary">
              <b>{label}</b>
            </Text>
            <Text>
              <b>{value ?? "---"}</b>
            </Text>
          </Space>
        </Col>
      </Row>
    );
  };
  return (
    <div className="m-main-body-section scrollbar-container">
      <DefaultLayout
        page="stryde_kyc_management"
        loading={loading}
        TitleText="Stryde KYC Details"
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
              <b>Stryde KYC details</b>
              <Breadcrumb separator=">">
                {/* <Breadcrumb.Item
                  onClick={() => {
                    navigate(Dashboard);
                  }}
                  className="cursor"
                >
                  Dashboard
                </Breadcrumb.Item> */}
                <Breadcrumb.Item
                  className="cursor"
                  onClick={() => {
                    navigate(StrydeKYCManagementList);
                  }}
                >
                  Management
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="cursor"
                  onClick={() => {
                    navigate(StrydeKYCManagementList);
                  }}
                >
                  Stryde KYC management
                </Breadcrumb.Item>
                <Breadcrumb.Item>Stryde KYC details</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="endtoend">
          <Col sm={24} md={24} lg={15} className="w-100">
            <div className="bg-admin-card w-100 kyc-user-details-card">
              <Col span={24} className="bg-admin-card-m-col w-100">
                <div className="d-flex card-items-row">
                  <Col sm={24} md={24} lg={24} className="mr-25 bg-admin-card-m-col p-0">
                    <div className="title_white">
                      {stryedKYCDetails?.repName}
                    </div>
                    <div className="subtext_white mt-3 ">
                      {
                        COMPANY_ROLE[stryedKYCDetails?.repRole]
                      }
                    </div>
                    <hr className="my-4" />
                  </Col>
                </div>
                <div className="d-flex flex-wrap">
                  <div className="mr-20">
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Email} alt="email" preview={false} />
                      <Tooltip title={stryedKYCDetails?.email} overlayClassName="custom-tooltip">
                        <span className="ml-4 overflowText ">
                          {stryedKYCDetails?.email}
                        </span>
                      </Tooltip>
                    </div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Phone} alt="phone" preview={false} />
                      <span className="ml-4 overflowText">
                        {stryedKYCDetails?.contactNumber}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Nation} alt="country" preview={false} />
                      <span className="ms-3 overflowText">
                        {stryedKYCDetails?.countryName ?? stryedKYCDetails?.country}
                      </span>
                      <div className="mx-2">
                      <div className="px-1 bluecard-flag">
                      {(stryedKYCDetails?.country) ? (
                            <span
                              className={`fi fi-${String(stryedKYCDetails.country).toLowerCase()}`}
                            />
                          ) : "--"}
                          </div>
                          </div>
                    </div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Individual} alt="type" preview={false} />
                      <span className="ml-4 overflowText">
                        {ENTITY_TYPE[stryedKYCDetails?.entityType]}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
              <div className="subtext_white  endtoend">
                <div></div>
                {/* <Button
                  className="downloadCard mt-3"
                  onClick={() => {
                    setDownloadModal(true);
                  }}
                >
                  Download
                </Button> */}
              </div>
            </div>
          </Col>
          {/* <Col sm={24} md={24} lg={9} className="bg-admin-card-col8 w-100">
            <Card className="p-4 detailsCard">
              {" "}
              <div className="titleText">Other details</div>
              <div className="subText_small bold mt-4">
                <Image src={Doc} alt="company" preview={false} />
                <span className="px-3">
                  {stryedKYCDetails?.representative?.repDocNumber}
                </span>
                <span className="px-1 stepDetails_sub">
                  ( Document number )
                </span>
              </div>
              <div className="subText_small bold mt-3 ">
                <Image src={Job} alt="company" preview={false} />
                <span className="px-3">
                  {moment(
                    stryedKYCDetails?.representative?.repExpiryDate
                  ).format("DD-MM-YYYY")}
                </span>
                <span className="px-1 stepDetails_sub">
                  ( Expiry date )
                </span>
              </div>
            </Card>
          </Col> */}
        </Row>
        {/* Verify KYC Card */}
        <ResyncStrydeKybKycCard
          setSearchKybModal={setSearchKybModal}
          digiScreeningPayload={digiScreeningPayload}
          digiScreeningResult={digiScreeningResult}
          strydeAlias={strydeAlias}
          entityType={stryedKYCDetails?.entityType}
          formCheckKyB={formCheckKyB}
          riskAssessment={riskAssessment}
          riskAssessmentPayload={riskAssessmentPayload}
          strydeResyncPayload={strydeResyncPayload}
        />

        {/* KYC Risk Assesment Card */}
        <RiskAssesmentCard riskAssessment={riskAssessment} />
        <Card className="my-5 details-card">
          <div className="titleText mb-5">Document details</div>
          {stryedKYCDetails?.documentAccuracyPercentage && (
            <>
              <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center justify-content-between">
                <Col xs={24} sm={24} md={12} lg={8}>
                  <Space className="d-flex flex-wrap">
                    <Text type="secondary"> <b>Document accuracy percentage as per OCR</b></Text>
                    <Text className="doc-accuracy-percentage"> <b>{stryedKYCDetails?.documentAccuracyPercentage ? stryedKYCDetails?.documentAccuracyPercentage + "%" : "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
            </>
          )}
          <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
            <Col xs={24} sm={24} md={12} lg={8} className="my-4">
              <div className="afterApproveCard">
                {stryedKYCDetails?.repDocFront?.isCompliance != null ||
                  ['VERIFIED', 'REJECTED', 'EXPIRED'].includes(stryedKYCDetails?.repDocFront?.verified) ? (
                  <Tabs
                    defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                    className="d-none-res">
                    {stryedKYCDetails?.repDocFront?.isCompliance != null ? (
                      <TabPane tab={`Approver`} key="approver">
                        <ApproverDetails
                          modalTitle={
                            DOCUMENT_TYPE[
                            stryedKYCDetails?.repDocType
                            ] + " front"
                          }
                          approverDetails={
                            stryedKYCDetails?.repDocFront
                          }
                          uploadedFile={
                            stryedKYCDetails?.repDocFront?.url
                          }
                          tab="approver"
                        />
                      </TabPane>
                    ) : (
                      ""
                    )}
                    
                    <TabPane tab={`Authorizer`} key="authorizer">
                      {!['VERIFIED', 'REJECTED', 'EXPIRED'].includes(stryedKYCDetails?.repDocFront?.verified) ? (
                        <DocumentCard 
                          docType={stryedKYCDetails?.repDocType+'_FRONT'}
                          url={stryedKYCDetails?.repDocFront?.url}
                          handleDownload={handleDownload}
                          handlePDFView={handlePDFView}
                          fileId={stryedKYCDetails?.repDocFront?.id}
                          handleDocumentButton={handleDocumentButton}
                          userType={userType}
                          showButtons={isAuthorizer}
                        />
                      ) : (
                        <ApproverDetails
                          modalTitle={
                            DOCUMENT_TYPE[
                            stryedKYCDetails?.repDocType
                            ] + " front"
                          }
                          approverDetails={
                            stryedKYCDetails?.repDocFront
                          }
                          uploadedFile={
                            stryedKYCDetails?.repDocFront
                              ?.url
                          }
                          tab="admin"
                        />
                      )}
                    </TabPane>
                  </Tabs>
                ) : !['VERIFIED', 'REJECTED', 'EXPIRED'].includes(stryedKYCDetails?.repDocFront?.verified) ? (
                  <DocumentCard 
                    docType={stryedKYCDetails?.repDocType+'_FRONT'}
                    url={stryedKYCDetails?.repDocFront?.url}
                    handleDownload={handleDownload}
                    handlePDFView={handlePDFView}
                    fileId={stryedKYCDetails?.repDocFront?.id}
                    handleDocumentButton={handleDocumentButton}
                    userType={userType}
                    showButtons={true}
                  />
                ) : (
                  <ApproverDetails
                    modalTitle={
                      DOCUMENT_TYPE[
                      stryedKYCDetails?.repDocType
                      ] + " front"
                    }
                    approverDetails={
                      stryedKYCDetails?.repDocFront
                    }
                    uploadedFile={
                      stryedKYCDetails?.repDocFront?.url
                    }
                    tab="admin"
                  />
                )}
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} className="my-4">
              <div className="afterApproveCard">
                {stryedKYCDetails?.repDocBack
                  ?.isCompliance != null ||
                  ['VERIFIED', 'REJECTED', 'EXPIRED'].includes(stryedKYCDetails?.repDocBack?.verified) ? (
                  <Tabs
                    defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                    className="d-none-res ">
                    {stryedKYCDetails?.repDocBack?.isCompliance != null ? (
                      <TabPane tab={`Approver`} key="approver">
                        <ApproverDetails
                          modalTitle={
                            DOCUMENT_TYPE[
                            stryedKYCDetails?.repDocType
                            ] + " back"
                          }
                          approverDetails={
                            stryedKYCDetails?.repDocBack
                          }
                          uploadedFile={
                            stryedKYCDetails?.repDocBack
                              ?.url
                          }
                          tab="approver"
                        />
                      </TabPane>
                    ) : (
                      ""
                    )}

                    <TabPane tab={`Authorizer`} key="authorizer">
                      {!['VERIFIED', 'REJECTED', 'EXPIRED'].includes(stryedKYCDetails?.repDocBack?.verified) ? (
                        <DocumentCard 
                          docType={stryedKYCDetails?.repDocType+'_BACK'}
                          url={stryedKYCDetails?.repDocBack?.url}
                          handleDownload={handleDownload}
                          handlePDFView={handlePDFView}
                          fileId={stryedKYCDetails?.repDocBack?.id}
                          handleDocumentButton={handleDocumentButton}
                          userType={userType}
                          showButtons={isAuthorizer}
                        />
                      ) : (
                        <ApproverDetails
                          modalTitle={
                            DOCUMENT_TYPE[
                            stryedKYCDetails?.repDocType
                            ] + " back"
                          }
                          approverDetails={
                            stryedKYCDetails?.repDocBack
                          }
                          uploadedFile={
                            stryedKYCDetails?.repDocBack?.url
                          }
                          tab="admin"
                        />
                      )}
                    </TabPane>
                  </Tabs>
                ) : !['VERIFIED', 'REJECTED', 'EXPIRED'].includes(stryedKYCDetails?.repDocBack?.verified) ? (
                  <DocumentCard 
                    docType={stryedKYCDetails?.repDocType+'_BACK'}
                    url={stryedKYCDetails?.repDocBack?.url}
                    handleDownload={handleDownload}
                    handlePDFView={handlePDFView}
                    fileId={stryedKYCDetails?.repDocBack?.id}
                    handleDocumentButton={handleDocumentButton}
                    userType={userType}
                    showButtons={true}
                  />
                ) : (
                  <ApproverDetails
                    modalTitle={
                      DOCUMENT_TYPE[
                      stryedKYCDetails?.repDocType
                      ] + " back"
                    }
                    approverDetails={
                      stryedKYCDetails?.repDocBack
                    }
                    uploadedFile={
                      stryedKYCDetails?.repDocBack?.url
                    }
                    tab="admin"
                  />
                )}
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} className="my-4">
              {stryedKYCDetails?.repAddProof?.url && (
                <div className="afterApproveCard">
                  {stryedKYCDetails?.repAddProof
                    ?.isCompliance != null ||
                    stryedKYCDetails?.repAddProof?.status ==
                    "VERIFIED" ||
                    stryedKYCDetails?.repAddProof?.status ==
                    "REJECTED" ? (
                    <Tabs
                      defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                      className="d-none-res ">
                      {stryedKYCDetails?.repAddProof
                        ?.isCompliance != null ? (
                        <TabPane tab={`Approver`} key="approver">
                          {stryedKYCDetails?.repAddProof
                            ?.isCompliance == null ? (
                            <DocumentCard 
                              docType="ADDRESS"
                              url={stryedKYCDetails?.repAddProof?.url}
                              handleDownload={handleDownload}
                              handlePDFView={handlePDFView}
                              fileId={stryedKYCDetails?.repAddProof?.id}
                              handleDocumentButton={handleDocumentButton}
                              userType={userType}
                              showButtons={true}
                            />
                          ) : (
                            <ApproverDetails
                              modalTitle="Address proof"
                              approverDetails={
                                stryedKYCDetails?.repAddProof
                              }
                              uploadedFile={
                                stryedKYCDetails?.repAddProof
                                  ?.url
                              }
                              tab="approver"
                            />
                          )}
                        </TabPane>
                      ) : (
                        ""
                      )}

                      <TabPane tab={`Authorizer`} key="authorizer">
                        {stryedKYCDetails?.repAddProof
                          ?.status != "VERIFIED" &&
                          stryedKYCDetails?.repAddProof
                            ?.status != "REJECTED" ? (
                          <DocumentCard 
                            docType="ADDRESS"
                            url={stryedKYCDetails?.repAddProof?.url}
                            handleDownload={handleDownload}
                            handlePDFView={handlePDFView}
                            fileId={stryedKYCDetails?.repAddProof?.id}
                            handleDocumentButton={handleDocumentButton}
                            userType={userType}
                            showButtons={isAuthorizer}
                          />
                        ) : (
                          <ApproverDetails
                            modalTitle="Address proof"
                            approverDetails={
                              stryedKYCDetails?.repAddProof
                            }
                            uploadedFile={
                              stryedKYCDetails?.repAddProof
                                ?.url
                            }
                            tab="admin"
                          />
                        )}
                      </TabPane>
                    </Tabs>
                  ) : stryedKYCDetails?.repAddProof?.status !=
                    "VERIFIED" &&
                    stryedKYCDetails?.repAddProof?.status !=
                    "REJECTED" ? (
                    <DocumentCard 
                      docType="ADDRESS"
                      url={stryedKYCDetails?.repAddProof?.url}
                      handleDownload={handleDownload}
                      handlePDFView={handlePDFView}
                      fileId={stryedKYCDetails?.repAddProof?.id}
                      handleDocumentButton={handleDocumentButton}
                      userType={userType}
                      showButtons={true}
                    />
                  ) : (
                    <ApproverDetails
                      modalTitle="Address proof"
                      approverDetails={
                        stryedKYCDetails?.repAddProof
                      }
                      uploadedFile={
                        stryedKYCDetails?.repAddProof?.url
                      }
                      tab="admin"
                    />
                  )}
                </div>
              )}

            </Col>
          </Row>
          {/* <hr className="lightgrayHr mb-4" />
          <div className="subText_medium border-left">
            <b>Address Details</b>
          </div>
          <AddressDetails AddressData={stryedKYCDetails?.addressDetails} type="kyc" /> */}
          <hr className="lightgrayHr mb-4" />

          <div className="subText_medium border-left">
            <b>FATCA Details</b>
          </div>
          <Row className="mt-3 row">
            {/* <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary"> <b>Are you a Tax resident of any other country other than UAE?</b></Text>
                  <Text> <b>{toTitleCase(kycFATCACountries?.kycTaxResident) ?? "---"}</b> </Text>
                </Space>
              </Col>
            </Row> */}
            {generateFatcaRow("Are you a Tax resident of any other country other than UAE?", kycFATCACountries && kycFATCACountries?.length > 0 ? "Yes" : "No")}
            {kycFATCACountries && kycFATCACountries?.length > 0 && (<>
              {kycFATCACountries.map((elem: any) => {
                return (<>
                  {generateFatcaRow("Tax Residency country.", elem?.country)}
                  {generateFatcaRow("Do you have a Tax identification number?", elem?.hasTin ? "Yes" : "No")}
                  {elem?.hasTin ? (
                    generateFatcaRow("Tax identification number", elem?.tinNumber)
                  ) : (
                    generateFatcaRow("Reason for no TIN Number", elem?.noTinReason)
                  )}
                </>)
              })}
            
            {/* {kycFATCACountries?.kycTaxResident === 'yes' && (<>
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col>
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Tax Residency country</b></Text>
                    <Text> <b>{kycFATCACountries?.kycTaxResidencyCountry ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col>
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Do you have a Tax identification number? </b></Text>
                    <Text> <b>{toTitleCase(kycFATCACountries?.hasKycTIN) ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              {kycFATCACountries?.hasKycTIN === 'yes' && (<>
                <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                  <Col>
                    <Space direction="vertical">
                      <Text type="secondary"> <b>Tax identification number </b></Text>
                      <Text> <b>{kycFATCACountries?.kycTinNo ?? "---"}</b> </Text>
                    </Space>
                  </Col>
                </Row>
              </>)}
              {kycFATCACountries?.hasKycTIN === 'no' && (<>
                <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                  <Col>
                    <Space direction="vertical">
                      <Text type="secondary"> <b>Reason for no TIN Number</b></Text>
                      <Text> <b>{kycFATCACountries?.kycNoTinReason === "countryNotissueTINs" ? "Country/ Jurisdiction does not issue TINs." : kycFATCACountries?.kycNoTinReason === "countryNotRequirToProvideTIN" ? "Country/ Jurisdiction does not require me to provide TIN." : kycFATCACountries?.kycNoTinReason === "unableToObtainTIN" ? "Unable to obtain a TIN." : ""}</b> </Text>
                    </Space>
                  </Col>
                </Row>
              </>)}
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col>
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Do you have multiple Tax Residency?</b></Text>
                    <Text> <b>{toTitleCase(kycFATCACountries?.hasMultipleTaxResidentKyc) ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              {kycFATCACountries?.hasMultipleTaxResidentKyc === 'yes' && (<>
                <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                  <Col >
                    <Space direction="vertical">
                      <Text type="secondary"> <b>How many country?</b></Text>
                      <Text> <b>{kycFATCACountries?.kycNumberOfCountry ?? "---"}</b> </Text>
                    </Space>
                  </Col>
                </Row>
                {renderMultipleTaxResidencyRows()}
              </>)} */}
             </>)}
          </Row>

          <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
            <Col>
              <Space direction="vertical">
                <Text type="secondary"> <b>I agree to the FATCA/CRS declaration </b></Text>
                <Text> <b> {stryedKYCDetails?.isFatcaAgree && stryedKYCDetails?.isFatcaAgree === true ? "Yes" : stryedKYCDetails?.isFatcaAgree && stryedKYCDetails?.isFatcaAgree === false ? "No" : "---"}</b>
                </Text>
              </Space>
            </Col>
          </Row>
          <hr className="lightgrayHr mb-4" />
          <div className="subText_medium border-left">
            <b>Checklist</b>
          </div>
          <Form form={cmtForm}>
            <Row className="mt-5">
              <div className="w-100">
                <Checkbox
                  disabled={
                    (userType == "TRUSTEE" || userType === 'MAKER')
                      ? (['VERIFIED', 'REJECTED'].includes(stryedKYCDetails?.trusteeVerificationStatus))
                      : stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED"
                        ? true
                        : false
                        || userType === "SUPPORT_ENGINEER"
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
                    defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                    className="d-none-res  mx-4 my-2"
                  >

                    <TabPane tab={`Approver`} key="approver">
                      {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {stryedKYCDetails?.trusteeRepValidDocumentVerificationComment
                            ? stryedKYCDetails?.trusteeRepValidDocumentVerificationComment
                            : "N/A"}
                        </div>
                      ) : (
                        <Form.Item
                          name="validDocumentVerificationApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER') ? [
                              {
                                required: true,
                                message: "Please add some comment!",
                              },
                              {
                                min: 20,
                                message: "Please enter minimum 20 characters"
                              },
                              {
                                validator: (_, value) => {
                                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                },
                              }
                            ] : []}
                          className="checklist"
                        >
                          <TextArea
                            rows={2}
                            placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                            className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                            // onInput={handleInput}
                            id="validDocumentVerificationApprover"
                            value={checkboxCommentApprover?.validDocumentVerification}
                            onChange={(e) => adjustHeightForApprover("validDocumentVerification", e?.target?.value)}
                            disabled={disable || userType==="SUPPORT_ENGINEER" || (isAuthorizer)}
                          />
                        </Form.Item>
                      )}
                    </TabPane>

                    <TabPane tab={`Authorizer`} key="authorizer">
                      <div className="w-100">
                        {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                          stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                          <div className="commentBox mt-2 mx-2">
                            {stryedKYCDetails?.repValidDocumentVerificationComment
                              ? stryedKYCDetails?.repValidDocumentVerificationComment
                              : "N/A"}
                          </div>
                        ) : (
                          <Form.Item
                            name="validDocumentVerification"
                            rules={
                              isAuthorizer ?
                                [
                                  {
                                    required: true,
                                    message: "Please add some comment!",
                                  },
                                  {
                                    min: 20,
                                    message: "Please enter minimum 20 characters"
                                  },
                                  {
                                    validator: (_, value) => {
                                      if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                    },
                                  }
                                ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="validDocumentVerification"
                              value={checkboxComment?.validDocumentVerification}
                              onChange={(e) => adjustHeight("validDocumentVerification", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER' || userType === "SUPPORT_ENGINEER"}
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
                      ? (['VERIFIED', 'REJECTED'].includes(stryedKYCDetails?.trusteeVerificationStatus))
                      : stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED"
                        ? true
                        : false
                        || userType === "SUPPORT_ENGINEER"
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
                    defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                    className="d-none-res  mx-4 my-2"
                  >
                    <TabPane tab={`Approver`} key="approver">
                      {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {stryedKYCDetails?.trusteeRepNameAndIdVerificationComment
                            ? stryedKYCDetails?.trusteeRepNameAndIdVerificationComment
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
                                  min: 20,
                                  message: "Please enter minimum 20 characters"
                                },
                                {
                                  validator: (_, value) => {
                                    if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                  },
                                }
                              ] : []}
                          className="checklist"
                        >
                          <TextArea
                            rows={2}
                            placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                            className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                            // onInput={handleInput}
                            id="nameAndIdVerificationApprover"
                            value={checkboxCommentApprover?.nameAndIdVerification}
                            onChange={(e) => adjustHeightForApprover("nameAndIdVerification", e?.target?.value)}
                            disabled={disable || userType === "SUPPORT_ENGINEER" || (isAuthorizer)}
                          />
                        </Form.Item>
                      )}
                    </TabPane>
                    <TabPane tab={`Authorizer`} key="authorizer">
                      <div className="w-100">
                        {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                          stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                          <div className="commentBox mt-2 mx-2">
                            {stryedKYCDetails?.repNameAndIdVerificationComment
                              ? stryedKYCDetails?.repNameAndIdVerificationComment
                              : "N/A"}
                          </div>
                        ) : (
                          <Form.Item
                            name="nameAndIdVerification"
                            rules={
                              isAuthorizer ?
                                [
                                  {
                                    required: true,
                                    message: "Please add some comment!",
                                  },
                                  {
                                    min: 20,
                                    message: "Please enter minimum 20 characters"
                                  },
                                  {
                                    validator: (_, value) => {
                                      if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                    },
                                  }
                                ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="nameAndIdVerification"
                              value={checkboxComment?.nameAndIdVerification}
                              onChange={(e) => adjustHeight("nameAndIdVerification", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER' || userType === "SUPPORT_ENGINEER"}
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
                      ? (['VERIFIED', 'REJECTED'].includes(stryedKYCDetails?.trusteeVerificationStatus))
                      : stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED"
                        ? true
                        : false
                        || userType === "SUPPORT_ENGINEER"
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
                    defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                    className="d-none-res  mx-4 my-2"
                  >
                    <TabPane tab={`Approver`} key="approver">
                      {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {stryedKYCDetails?.trusteeRepAmlScreeningComment
                            ? stryedKYCDetails?.trusteeRepAmlScreeningComment
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
                                {
                                  min: 20,
                                  message: "Please enter minimum 20 characters"
                                },
                                {
                                  validator: (_, value) => {
                                    if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                  },
                                }
                              ] : []}
                          className="checklist"
                        >
                          <TextArea
                            rows={2}
                            placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                            className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                            // onInput={handleInput}
                            id="amlScreeningApprover"
                            value={checkboxCommentApprover?.amlScreening}
                            onChange={(e) => adjustHeightForApprover("amlScreening", e?.target?.value)}
                            disabled={disable || userType === "SUPPORT_ENGINEER" || (isAuthorizer)}
                          />
                        </Form.Item>
                      )}
                    </TabPane>
                    <TabPane tab={`Authorizer`} key="authorizer">
                      <div className="w-100">
                        {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                          stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                          <div className="commentBox mt-2 mx-2">
                            {stryedKYCDetails?.repAmlScreeningComment
                              ? stryedKYCDetails?.repAmlScreeningComment
                              : "N/A"}
                          </div>
                        ) : (
                          <Form.Item
                            name="amlScreening"
                            rules={
                              isAuthorizer ?
                                [
                                  {
                                    required: true,
                                    message: "Please add some comment!",
                                  },
                                  {
                                    min: 20,
                                    message: "Please enter minimum 20 characters"
                                  },
                                  {
                                    validator: (_, value) => {
                                      if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                    },
                                  }
                                ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="amlScreening"
                              value={checkboxComment?.amlScreening}
                              onChange={(e) => adjustHeight("amlScreening", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER' || userType === "SUPPORT_ENGINEER"}
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
                      ? (['VERIFIED', 'REJECTED'].includes(stryedKYCDetails?.trusteeVerificationStatus))
                      : stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED"
                        ? true
                        : false
                        || userType === "SUPPORT_ENGINEER"
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
                    defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                    className="d-none-res mx-4 my-2"
                  >
                    <TabPane tab={`Approver`} key="approver">
                      {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {stryedKYCDetails?.trusteeRepAdverseMediaComment
                            ? stryedKYCDetails?.trusteeRepAdverseMediaComment
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
                                {
                                  min: 20,
                                  message: "Please enter minimum 20 characters"
                                },
                                {
                                  validator: (_, value) => {
                                    if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                  },
                                }
                              ] : []}
                          className="checklist"
                        >
                          <TextArea
                            rows={2}
                            placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                            className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                            // onInput={handleInput}
                            id="adverseMediaApprover"
                            value={checkboxCommentApprover?.adverseMedia}
                            onChange={(e) => adjustHeightForApprover("adverseMedia", e?.target?.value)}
                            disabled={disable || userType === "SUPPORT_ENGINEER" || (isAuthorizer)}
                          />
                        </Form.Item>
                      )}
                    </TabPane>
                    <TabPane tab={`Authorizer`} key="authorizer">
                      <div className="w-100">
                        {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                          stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                          <div className="commentBox mt-2 mx-2">
                            {stryedKYCDetails?.repAdverseMediaComment
                              ? stryedKYCDetails?.repAdverseMediaComment
                              : "N/A"}
                          </div>
                        ) : (
                          <Form.Item
                            name="adverseMedia"
                            rules={
                              isAuthorizer ?
                                [
                                  {
                                    required: true,
                                    message: "Please add some comment!",
                                  },
                                  {
                                    min: 20,
                                    message: "Please enter minimum 20 characters"
                                  },
                                  {
                                    validator: (_, value) => {
                                      if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                    },
                                  }
                                ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="adverseMedia"
                              value={checkboxComment?.adverseMedia}
                              onChange={(e) => adjustHeight("adverseMedia", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER' || userType === "SUPPORT_ENGINEER"}
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
                      ? (["VERIFIED", "REJECTED"].includes(stryedKYCDetails?.trusteeVerificationStatus))
                      : stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED"
                        ? true
                        : false
                        || userType === "SUPPORT_ENGINEER"
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
                    defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                    className="d-none-res  mx-4 my-2"
                  >
                    <TabPane tab={`Approver`} key="approver">
                      {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {stryedKYCDetails?.trusteeRepPoliticallyExposedComment
                            ? stryedKYCDetails?.trusteeRepPoliticallyExposedComment
                            : "N/A"}
                        </div>
                      ) : (
                        <Form.Item
                          name="politicallyExposedCommentApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER') ?
                              [
                                {
                                  required: true,
                                  message: "Please add some comment!",
                                },
                                {
                                  min: 20,
                                  message: "Please enter minimum 20 characters"
                                },
                                {
                                  validator: (_, value) => {
                                    if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                  },
                                }
                              ] : []}
                          className="checklist"
                        >
                          <TextArea
                            rows={2}
                            placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                            className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                            // onInput={handleInput}
                            id="politicallyExposedCommentApprover"
                            value={checkboxCommentApprover?.politicallyExposedComment}
                            onChange={(e) => adjustHeightForApprover("politicallyExposedComment", e?.target?.value)}
                            disabled={disable || userType === "SUPPORT_ENGINEER" || (isAuthorizer)}
                          />
                        </Form.Item>
                      )}
                    </TabPane>
                    <TabPane tab={`Authorizer`} key="authorizer">
                      <div className="w-100">
                        {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                          stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                          <div className="commentBox mt-2 mx-2">
                            {stryedKYCDetails?.repPoliticallyExposedComment
                              ? stryedKYCDetails?.repPoliticallyExposedComment
                              : "N/A"}
                          </div>
                        ) : (
                          <Form.Item
                            name="politicallyExposedComment"
                            rules={
                              isAuthorizer ?
                                [
                                  {
                                    required: true,
                                    message: "Please add some comment!",
                                  },
                                  {
                                    min: 20,
                                    message: "Please enter minimum 20 characters"
                                  },
                                  {
                                    validator: (_, value) => {
                                      if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                    },
                                  }
                                ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="politicallyExposedComment"
                              value={checkboxComment?.politicallyExposedComment}
                              onChange={(e) => adjustHeight("politicallyExposedComment", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER' || userType === "SUPPORT_ENGINEER"}
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
                      ? (['VERIFIED', 'REJECTED'].includes(stryedKYCDetails?.trusteeVerificationStatus))
                      : stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED"
                        ? true
                        : false
                        || userType === "SUPPORT_ENGINEER"
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
                    defaultActiveKey={(isAuthorizer) ? "authorizer" : "approver"}
                    className="d-none-res mx-4 my-2"
                  >
                    <TabPane tab={`Approver`} key="approver">
                      {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                        stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {stryedKYCDetails?.trusteeRepOtherCommentAndNotes
                            ? stryedKYCDetails?.trusteeRepOtherCommentAndNotes
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
                                {
                                  min: 20,
                                  message: "Please enter minimum 20 characters"
                                },
                                {
                                  validator: (_, value) => {
                                    if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                  },
                                }
                              ] : []}
                          className="checklist"
                        >
                          <TextArea
                            rows={2}
                            placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                            className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                            // onInput={handleInput}
                            id="otherCommentAndNotesApprover"
                            value={checkboxCommentApprover?.otherCommentAndNotes}
                            onChange={(e) => adjustHeightForApprover("otherCommentAndNotes", e?.target?.value)}
                            disabled={disable || userType==="SUPPORT_ENGINEER" ||(isAuthorizer)}
                          />
                        </Form.Item>
                      )}
                    </TabPane>
                    <TabPane tab={`Authorizer`} key="authorizer">
                      <div className="w-100">
                        {stryedKYCDetails?.verificationStatus === "VERIFIED" ||
                          stryedKYCDetails?.verificationStatus === "REJECTED" ? (
                          <div className="commentBox mt-2 mx-2">
                            {stryedKYCDetails?.repOtherCommentAndNotes
                              ? stryedKYCDetails?.repOtherCommentAndNotes
                              : "N/A"}
                          </div>
                        ) : (
                          <Form.Item
                            name="otherCommentAndNotes"
                            rules={
                              isAuthorizer ?
                                [
                                  {
                                    required: true,
                                    message: "Please add some comment!",
                                  },
                                  {
                                    min: 20,
                                    message: "Please enter minimum 20 characters"
                                  },
                                  {
                                    validator: (_, value) => {
                                      if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                    },
                                  }
                                ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="otherCommentAndNotes"
                              value={checkboxComment?.otherCommentAndNotes}
                              onChange={(e) => adjustHeight("otherCommentAndNotes", e?.target?.value)}
                              disabled={disable || userType == "TRUSTEE" || userType === 'MAKER' || userType === "SUPPORT_ENGINEER"}
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
          <div className="subText_medium border-left mt-4"
          >
            <b>Client risk rating</b>
          </div>
          <Row className="mt-3">
            <Radio.Group
              onChange={handleDropdownChange}
              value={Number(dropDownValue)}
              className="mt-3 mb-4 client-risk-classification-radio-btn"
            >
              <Radio value={1} disabled={userType === "SUPPORT_ENGINEER"}>Low risk</Radio>
              <Radio value={2} disabled={userType === "SUPPORT_ENGINEER"}>Medium risk</Radio>
              <Radio value={3} disabled={userType === "SUPPORT_ENGINEER"}>High risk</Radio>
            </Radio.Group>
          </Row>
          {isAuthorizer && stryedKYCDetails?.trusteeRepComment && stryedKYCDetails?.trusteeRepComment != null && stryedKYCDetails?.trusteeRepComment != undefined &&
            (
              <div>
                <hr className="lightgrayHr mb-4" />
                <div className="subText_medium border-left">
                  <b>Approver Comment</b>
                </div>
                <div>
                  <div className="finalCommentTime stepDetails_medium_sub my-3">
                    {moment(stryedKYCDetails?.trusteeRepUpdatedAt).format(
                      "DD MMMM YYYY hh:mm A"
                    )}
                  </div>
                  <div className="stepDetails_medium_sub">
                    {stryedKYCDetails?.trusteeRepComment}
                  </div>
                </div>
              </div>
            )
          }
          {stryedKYCDetails?.verificationStatus == "VERIFIED" ||
            stryedKYCDetails?.verificationStatus == "REJECTED" ? (
            <div>
              {" "}
              <hr className="lightgrayHr mb-4" />
              <div className="subText_medium border-left">
                <b>Authorizer Comment</b>
              </div>
              <div>
                <div className="finalCommentTime stepDetails_medium_sub my-3">
                  {moment(stryedKYCDetails?.updatedAt).format(
                    "DD MMMM YYYY hh:mm A"
                  )}
                </div>
                <div className="stepDetails_medium_sub">
                  {stryedKYCDetails?.verificationStatus == "REJECTED" ? stryedKYCDetails?.reason : stryedKYCDetails?.repComment}
                </div>
              </div>
            </div>
          ) : null}
          {(stryedKYCDetails?.verificationStatus != "VERIFIED" &&
            stryedKYCDetails?.verificationStatus != "REJECTED" && 
            (userType == "TRUSTEE" || userType === 'MAKER') && 
            (!['VERIFIED', 'REJECTED'].includes(stryedKYCDetails?.trusteeVerificationStatus))) || (stryedKYCDetails?.verificationStatus != "VERIFIED" &&
              stryedKYCDetails?.verificationStatus != "REJECTED" && userType != "TRUSTEE" && userType !== 'MAKER') ? (
            <Row className={userType === "SUPPORT_ENGINEER"?"d-none":"center_res btn-groups"}>
              <Button
                className={`${isAllDocUpdated && isAllChecklistChecked() ? "rounded" : "rounded disabled"}`}
                htmlType="submit"
                onClick={() => {
                  if (isAllDocUpdated && isAllChecklistChecked())
                    openApproveModal();
                }}
                loading={loading}
              >
                Approve KYC
              </Button>
              <Button
                className={isAllChecklistChecked() ? "rounded_reject_light" : 'rounded_reject_light disabled'}
                onClick={() => {
                  if (isAllChecklistChecked()) openRejectModal();
                }}
                loading={loading}
              >
                Reject KYC
              </Button>
              <Button
                className="rounded_reject_light"
                htmlType="submit"
                onClick={() => {
                  setHoldModal(true);
                }}
              >
                Hold KYC
              </Button>
            </Row>
          ) :
            <>
              {(stryedKYCDetails?.verificationStatus != "VERIFIED" &&
                stryedKYCDetails?.verificationStatus != "REJECTED" && (userType == "TRUSTEE" || userType === 'MAKER')) ?
                <div>
                  <hr className="lightgrayHr mb-4" />
                  <div className="subText_medium border-left">
                    <b>Approver Comment</b>
                  </div>
                  <div>
                    <div className="finalCommentTime stepDetails_medium_sub my-3">
                      {moment(stryedKYCDetails?.trusteeRepUpdatedAt).format(
                        "DD MMMM YYYY hh:mm A"
                      )}
                    </div>
                    <div className="stepDetails_medium_sub">
                      {stryedKYCDetails?.trusteeRepComment}
                    </div>
                  </div>
                </div> : null
              }
            </>
          }

        </Card>
      </DefaultLayout>
      {/* change client risk */}
      <Modal
        open={classificationModalVisible}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification">
            Change client classification
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
          onFinish={() => { handleRiskClassificationSubmit() }}
        >
          <div className="subText mb-3 ">Client Classification *</div>

          <Form.Item name="title" className="modal_inputField select"
            rules={[
              {
                required: true,
                message: "Please select a risk level.",
              },
              {
                validator(_, value) {
                  if ((parseInt(value) === 0)) {
                    return Promise.reject("Please select a risk level.")
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Select
              onChange={(e) => setDropDownValue(e)}
              defaultValue={dropDownValue > 0 ? dropDownValue : null}
              placeholder="Please select a risk level"
            >
              <Select.Option value={1}>Low risk</Select.Option>
              <Select.Option value={2}>Medium risk</Select.Option>
              <Select.Option value={3}>High risk</Select.Option>
            </Select>
          </Form.Item>
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              {
                min: 20,
                message: "Please enter minimum 20 characters"
              },
              {
                validator: (_, value) => {
                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.RISK_CHANGE_COMMENT) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.RISK_CHANGE_COMMENT}`));
                },
              }
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              showCount
              placeholder="Please enter your comment"
              onInput={handleInput}
              onChange={(e) => {
                handleComment(e, KYC_KYB_COMMENT_TEXT_LIMIT.RISK_CHANGE_COMMENT);
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
                getStryedKycDetails();
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Approve Document */}
      <CommentModalForm
        open={CommentModal} title={modalTitle}
        form={formStryedDocumentApprove}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={handleApprove}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}
      />

      {/* Reject Document */}
      <CommentModalForm
        open={CommentModalReject} title={`Reject ${modalTitle}`}
        form={formStryedDocumentReject}
        isErrorTitle
        comment={comment}
        onCommentChange={setComment}
        onSubmit={handleReject}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}
      />

      {/* Approve KYC */}
      <CommentModalForm
        open={ApproveModal} title="Approve KYC Request"
        form={formStryedApproveKYC}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={approveKYC}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
      />

      {/* Reject KYC */}
      <CommentModalForm
        open={RejectModal} title="Reject KYC Request"
        isErrorTitle
        form={formStryedRejectKYC}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={rejectKYC}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
        loading={loading}
      />

      {/* Hold KYC */}
      <CommentModalForm
        open={holdModal}
        title="Hold KYC Request"
        form={formStryedHoldKYC}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={holdKYC}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
      />
      {/* Download option */}
      <Modal
        open={downloadModal}
        footer={false}
        className="classification-modal"
        title={
          <span className="change-client-classification ml-4">
            Download All KYC Information
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <div className="stepDetails fw-400 mx-3 py-2 modal-word-wrap">
          <p>Choose which data you want to download now?</p>
        </div>
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
        >
          <Radio.Group defaultValue="3" buttonStyle="solid" className="mx-3">
            <Row>
              <Radio
                value="1"
                onClick={() => {
                  setDownloadOption(1);
                }}
              >
                <NormalText children="Download information" />
              </Radio>
            </Row>
            <Row>
              <Radio
                value="2"
                onClick={() => {
                  setDownloadOption(2);
                }}
              >
                <NormalText children="Download attached files" />
              </Radio>
            </Row>
            <Row>
              <Radio
                value="3"
                onClick={() => {
                  setDownloadOption(3);
                }}
              >
                <NormalText children="Download Above Both" />
              </Radio>
            </Row>
          </Radio.Group>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
              loading={loader}
              onClick={() => {
                downloadKYCDetails();
              }}
            >
              Download
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

      {/*Stryde KYC Search again Modal */}
      <SearchAgainStrydeKybKycModal
        headKYBModal={"KYC"}
        searchKybModal={searchKybModal}
        setSearchKybModal={setSearchKybModal}
        strydeAlias={strydeAlias}
        formCheckKyB={formCheckKyB}
        entityType={stryedKYCDetails?.entityType}
        setDropDownValue={setDropDownValue}
        digiScreeningPayload={digiScreeningPayload}
        setDigiScreeningPayload={setDigiScreeningPayload}
        setDigiScreeningResult={setDigiScreeningResult}
        setRiskAssessment={setRiskAssessment}
        setRiskAssessmentPayload={setRiskAssessmentPayload}
        countryList={countryList}
        brithPlaceList={brithPlaceList}
      />

      <PdfPreviewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
    </div>
  );
};

const DocumentCard = (props: any): any => {
  const {
    url,
    handleDownload,
    handlePDFView,
    docType,
    fileId,
    handleDocumentButton,
    userType,
    showButtons
  }: any = props;

  let title = ''
  let buttonTitle = '';
  if (docType === 'ADDRESS') {
    title = 'Address Proof'
    buttonTitle = 'Address proof';
  } else if (docType === 'PASSPORT_FRONT') {
    title = DOCUMENT_TYPE.PASSPORT + ' Front';
    buttonTitle = DOCUMENT_TYPE.PASSPORT + ' front Proof';
  } else if (docType === 'PASSPORT_BACK') {
    title = DOCUMENT_TYPE.PASSPORT + ' Back';
    buttonTitle = DOCUMENT_TYPE.PASSPORT + ' back Proof';
  } else if (docType === 'EMIRATES_ID_FRONT') {
    title = DOCUMENT_TYPE.EMIRATES_ID + ' Front';
    buttonTitle = DOCUMENT_TYPE.EMIRATES_ID + ' front Proof';
  } else if (docType === 'EMIRATES_ID_BACK') {
    title = DOCUMENT_TYPE.EMIRATES_ID + ' Back';
    buttonTitle = DOCUMENT_TYPE.EMIRATES_ID + ' back Proof';
  } else if (docType === 'NATIONAL_ID_FRONT') {
    title = DOCUMENT_TYPE.NATIONAL_ID + ' Front';
    buttonTitle = DOCUMENT_TYPE.NATIONAL_ID + ' front Proof';
  } else if (docType === 'NATIONAL_ID_BACK') {
    title = DOCUMENT_TYPE.NATIONAL_ID + ' Back';
    buttonTitle = DOCUMENT_TYPE.NATIONAL_ID + ' back Proof';
  }

  if (!url) {
    return;
  }

  return <div>
    <Card
      className="kybcard"
      cover={
        url && url.includes(
          ".pdf"
        ) ? (
          <>
            <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(url) }}>
              <Document
                file={url}
                externalLinkRel="_blank"
              >
                <Page pageNumber={1} width={175} />
              </Document>
            </div>
          </>
        ) : (
          <div className="card-img-body">
            <Image
              alt="example"
              src={
                url
              }
              height={175}
            />
          </div>
        )
      }
    >
      <Meta
        title={
          <div className="d-flex justify-content-between align-items-center">
            {title}
            {url && <Tooltip
              title={'Download'}
              overlayClassName='custom-tooltip'
              placement="left"
            >
              <div className="ml-2" onClick={() => url && handleDownload(url,url && url.includes(".pdf"))} >
                <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
              </div>
            </Tooltip>}
          </div>
        }
      />
    </Card>
    {showButtons && <div
      className={
        userType === "SUPPORT_ENGINEER" ? "d-none" : "d-flex align-items-center"
      }
    >
      <SecondaryOutLineButton
        children="Approve"
        className="mt-4"
        onClick={() => {
          handleDocumentButton(buttonTitle, fileId, true);
        }}
      />
      <PrimaryOutLineButton
        children="Reject"
        className="mt-4 mx-3"
        onClick={() => {
          handleDocumentButton(buttonTitle, fileId, false);
        }}
      />
    </div>}
  </div>
}

export default StrydeKYCDetails;
