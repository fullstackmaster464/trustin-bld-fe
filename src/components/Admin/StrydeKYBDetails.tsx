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
  Popover,
  Tabs,
  message,
  Typography,
  Tooltip
} from "antd";
import { useNavigate } from "react-router-dom";
import {  StrydeKYBManagementList } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Email from "../../assets/img/Email_outline.svg";
// import Phone from "../../assets/img/Phone.svg";
import Phone_Dark from "../../assets/img/kyb_phone_white.svg";
import EntitytypeIcon from "../../assets/img/company_gray.svg";
// import Flag from "../../assets/img/flag.svg";
import Company from "../../assets/img/kyb_company_white.svg";
// import Globe from "../../assets/img/crossGlobe_white.svg";
import Globe_dark from "../../assets/img/Country.svg"
import Job from "../../assets/img/job_white.svg";
import Location from "../../assets/img/kyb_location_white.svg";
import Phone from "../../assets/img/Phone.svg";
import Emailicon from "../../assets/img/Email.svg";
import Nation from "../../assets/img/Nation.svg";
import Individual from "../../assets/img/Individual.svg";
import download from "../../assets/img/Download.svg";
import Meta from "antd/es/card/Meta";
import {
  PrimaryOutLineButton,
  SecondaryOutLineButton,
} from "../ui-elements/ButtonRepo";
import { useEffect, useState } from "react";
import ApproverDetails from "../Common/ApproverDetails";
import { NormalText } from "../ui-elements/TextRepo";
import {
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
  toTitleCase,
} from "../Common/Constants";
import TabPane from "antd/lib/tabs/TabPane";
import moment from "moment";
// @ts-ignore
// import multiDownload from "multi-download";
import DefaultLayout from "../Common/DefaultLayout";
const { TextArea } = Input;
import ResyncStrydeKybKycCard from "./ResyncStrydeKybKycCard";
import RiskAssesmentCard from "./RiskAssesmentCard";
import SearchAgainStrydeKybKycModal from "./SearchAgainStrydeKybKycModal";
import dayjs from "dayjs";
const { Text } = Typography;
import { Document, Page } from "react-pdf";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import { getAllCountries } from "../../services/masterData";
import { CommentModalForm } from "./CommentModalForm";
// import AddressDetails from "./AddressDetails";


const StrydeKYBDetails = (): any => {
  const navigate = useNavigate();
  const [classificationModalVisible, setClassificationModalVisible] =
    useState(false);
  const [CommentModal, setCommentModal] = useState(false);
  const [CommentModalReject, SetCommentModalReject] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [form] = Form.useForm();
  const [repCmtForm] = Form.useForm();
  const [dropDownValue, setDropDownValue] = useState<any>(0);
  const [comment, setComment] = useState("");
  const [ApproveModal, setApproveModal] = useState(false);
  const [RejectModal, setRejectModal] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadOption, setDownloadOption] = useState(3);
  const [checkboxComment, setCheckboxComment] = useState<any>({});
  const [checkboxCommentApprover, setCheckboxCommentApprover] = useState<any>({});
  const [checkboxCommentRepresentative, setCheckboxCommentRepresentative] = useState<any>({});
  const [checkboxCommentApproverRepresentative, setCheckboxCommentApproverRepresentative] = useState<any>({});
  const [checkboxCommentUbo, setCheckboxCommentUbo] = useState<any>({});
  const [checkboxCommentApproverUbo, setCheckboxCommentApproverUbo] = useState<any>({});
  const [strydeKYBDetails, setStrydeKYBDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [nameAndIdVerification, setNameAndIdVerification] = useState(false);
  const [nameAndIdVerificationRepresentative, setNameAndIdVerificationRepresentative] = useState(false);
  const [nameAndIdVerificationShareholder, setNameAndIdVerificationUbo] = useState(false);
  const [validDocumentVerification, setValidDocumentVerification] = useState(false);
  const [validDocumentVerificationRepresentative, setValidDocumentVerificationRepresentative] = useState(false);
  const [validDocumentVerificationShareholder, setValidDocumentVerificationUbo] = useState(false);
  const [amlScreening, setAmlScreening] = useState(false);
  const [amlScreeningRepresentative, setAmlScreeningRepresentative] = useState(false);
  const [amlScreeningShareholder, setAmlScreeningUbo] = useState(false);
  const [adverseMedia, setAdverseMedia] = useState(false);
  const [adverseMediaRepresentative, setAdverseMediaRepresentative] = useState(false);
  const [adverseMediaShareholder, setAdverseMediaUbo] = useState(false);
  const [holdModal, setHoldModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Representative");
  const [activeUboTab, setActiveUboTab] = useState('1');
  const strydeAlias: any = window?.location?.pathname.split("/").pop();
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const currentUserAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias
  const [searchKybModal, setSearchKybModal] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState({});
  const [digiScreeningPayload, setDigiScreeningPayload] = useState({});
  const [digiScreeningResult, setDigiScreeningResult] = useState({});
  const [formCheckKyB] = Form.useForm();
  // const [fatfList, setFatfList] = useState([]);
  // const [fatfTypeId, setFatfTypeId] = useState(0)


  const [riskAssessmentPayload, setRiskAssessmentPayload] = useState({});
  // const [datasetsOptions, setDatasetsOptions] = useState([]);
  const [otherComment, setOtherComment] = useState<boolean>(false);
  const [otherCommentRepresentative, setOtherCommentRepresentative] = useState<boolean>(false);
  const [otherCommentShareholder, setOtherCommentUbo] = useState<boolean>(false);
  const [uboDetails, setUboDetails] = useState<any>([]);
  const [uboPayload, setUboPayload] = useState<any>([]);
  const [uboResult, setUboResult] = useState<any>([]);
  const [disable, setDisable] = useState<boolean>(false);
  const [countryList, setCountryList] = useState([]);
  const [brithPlaceList, setBrithPlaceList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [kybFATCACountries, setKybFATCACountries] = useState<any>({});
  const [kybFATCAColtrollers, setKybFATCAColtrollers] = useState<any>([]);
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [isAllMoaDocApproved, setIsAllMoaDocApproved] = useState<boolean>(false);
  const [isAllLoaDocApproved, setIsAllLoaDocApproved] = useState<boolean>(false);
  const [isAllUboVerified, setIsAllUboVerified] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");

  // const [countryofIncorporationTypeId, setCountryofIncorporationTypeId] = useState("")
  const isApprover = ['TRUSTEE', 'MAKER'].includes(userType);
  const isAuthorizer = ['ADMIN', 'SENIOR_MANAGEMENT', 'AUTHORIZER', 'CHECKER'].includes(userType);
  // const [countryofIncorporationTypeId, setCountryofIncorporationTypeId] = useState("")
  // const [countryofIncorporationTypeList, setCountryofIncorporationTypeList] = useState<any>([]);
  const [fileId, setFileId] = useState<number>();
  const [uboAlias, setUboAlias] = useState<string>("");
  const [strydeResyncPayload, setStrydeResyncPayload] = useState({ trustinContractId: "", strydeUserId: "" });

  const [formStryedDocumentApprove] = Form.useForm();
  const [formStryedDocumentReject] = Form.useForm();
  const [formStryedApproveKYB] = Form.useForm();
  const [formStryedRejectKYB] = Form.useForm();
  const [formStryedHoldKYB] = Form.useForm();

  useEffect(() => {
    getStrydeKybDetails();
    // getRiskConfigurationDetails();
  }, [strydeAlias]);

  useEffect(() => {
    getCountryList();
  }, []);

  useEffect(() => {
    const rejectedReason: any = [{ rejectReason: [] }];
    if (
      strydeKYBDetails?.basic?.typeOfEntity != "INDIVIDUAL" &&
      strydeKYBDetails?.tradeLicense?.verified === "REJECTED"
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "Business registration proof",
        reason: strydeKYBDetails?.tradeLicense?.reason,
      });
    }

    if (
      strydeKYBDetails?.basic?.typeOfEntity != "INDIVIDUAL" &&
      (strydeKYBDetails?.businessAddProof?.status ===
        "REJECTED" ||
        strydeKYBDetails?.businessAddProof?.isCompliance ===
        "false")
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "Operating address proof",
        reason: strydeKYBDetails?.businessAddProof?.reason,
      });
    }

    if (
      strydeKYBDetails?.repDocFront?.status === "REJECTED" ||
      strydeKYBDetails?.repDocFront?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: `${DOCUMENT_TYPE[strydeKYBDetails?.repDocType]
          } Front`,
        reason: strydeKYBDetails?.repDocFront?.reason,
      });
    }
    if (
      strydeKYBDetails?.repDocBack?.status === "REJECTED" ||
      strydeKYBDetails?.repDocBack?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: `${DOCUMENT_TYPE[strydeKYBDetails?.repDocType]
          } back`,
        reason: strydeKYBDetails?.repDocBack?.reason,
      });
    }
    if (
      strydeKYBDetails?.repAddProof?.status === "REJECTED" ||
      strydeKYBDetails?.repAddProof?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "Address proof",
        reason: strydeKYBDetails?.repAddProof?.reason,
      });
    }
    if (
      strydeKYBDetails?.authorizationDoc?.status === "REJECTED" ||
      strydeKYBDetails?.authorizationDoc?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "Authorization document",
        reason: strydeKYBDetails?.authorizationDoc?.reason,
      });
    }

    if (
      strydeKYBDetails?.vatDoc?.status === "REJECTED" ||
      strydeKYBDetails?.vatDoc?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "VAT Document",
        reason: strydeKYBDetails?.vatDoc?.reason,
      });
    }

    if (
      strydeKYBDetails?.otherDoc?.status === "REJECTED" ||
      strydeKYBDetails?.otherDoc?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "Other Document",
        reason: strydeKYBDetails?.otherDoc?.reason,
      });
    }
    if (strydeKYBDetails?.moa?.length > 0) {
      const allVerified = strydeKYBDetails?.moa?.every((doc: any) => isApprover ? doc?.isCompliance == true : doc?.verified === 'VERIFIED');
      setIsAllMoaDocApproved(allVerified);
    }
    if (strydeKYBDetails?.loa?.length > 0) {
      const allVerified = strydeKYBDetails?.loa?.every((doc: any) => isApprover ? doc?.isCompliance == true : doc?.verified === 'VERIFIED');
      setIsAllLoaDocApproved(allVerified);
    }
    if (strydeKYBDetails && strydeKYBDetails?.ubo?.length > 0) {
      // const isUboVerified = strydeKYBDetails?.ubo?.every((item: any) =>
      //   isApprover ? item.docFront.isCompliance === true && item.docBack.isCompliance === true : item.docFront.verified === 'VERIFIED' && item.docBack.verified === 'VERIFIED'
      // );
      // if (isUboVerified) {
      //   setIsAllUboVerified(true);
      // }
      setIsAllUboVerified(isAllDocumentApproved(strydeKYBDetails))
    }
    if (
      strydeKYBDetails?.shareHoldingTradeLicenseDoc?.status === "REJECTED" ||
      strydeKYBDetails?.shareHoldingTradeLicenseDoc?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "Shareholding Trade License Document",
        reason: strydeKYBDetails?.shareHoldingTradeLicenseDoc?.reason,
      });
    }
    if (
      strydeKYBDetails?.shareHoldingMoaDoc?.status === "REJECTED" ||
      strydeKYBDetails?.shareHoldingMoaDoc?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "Shareholding Moa Document",
        reason: strydeKYBDetails?.shareHoldingMoaDoc?.reason,
      });
    }
    if (
      strydeKYBDetails?.shareHoldingOtherDoc?.status === "REJECTED" ||
      strydeKYBDetails?.shareHoldingOtherDoc?.isCompliance === false
    ) {
      rejectedReason[0]?.rejectReason.push({
        kybdoctype: "Shareholding Other Document",
        reason: strydeKYBDetails?.shareHoldingOtherDoc?.reason,
      });
    }

  }, [strydeKYBDetails]);

  const handleDownload = (url: string, isPDF: any) => {
    if (!url) {
      message.error("Unable to download: Document URL is missing");
      return;
    }

    try {
      const popup: Window | null = window.open("", "_blank");
      if (popup) {
        if (isPDF) {
          // Sanitize URL properly
          const sanitizedUrl = url.replace(/[<>"'&]/g, (match) => {
            return {
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;',
              '&': '&amp;'
            }[match] || '';
          });

          const iframeHTML = `
        <iframe src="${sanitizedUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
        `;
          const fallbackHTML = `
          <p style="margin-top: 10px;font-size: 25px">
            Your browser does not support viewing PDFs. 
            <a href="${sanitizedUrl}" download="document.pdf" style="color: blue; text-decoration: underline;">Click here to download</a>.
          </p>
        `;
          const canEmbedPDF = document.createElement("iframe").src !== "";
          popup.document.write(canEmbedPDF ? iframeHTML : fallbackHTML);
        } else {
          const sanitizedUrl = url.replace(/[<>"'&]/g, (match) => {
            return {
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;',
              '&': '&amp;'
            }[match] || '';
          });
          const imgHTML = `<img src="${sanitizedUrl}" alt="Preview" style="max-width: 100%; max-height: 400px;" />`;
          popup.document.write(imgHTML);
        }
      } else {
        message.warning("Popup window was blocked. Check your browser settings.");
      }
    } catch (error) {
      console.error("Error opening preview:", error);
      message.error("Failed to open preview window");
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

  const downloadKYBDetails = () => {
    const files = [];
    const data = strydeKYBDetails?.documents;
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
    if (data?.tradeLicense?.url) {
      files.push(data?.tradeLicense?.url);
    }
    if (data?.authorizationDoc?.url) {
      files.push(data?.authorizationDoc?.url);
    }
    if (data?.vatDoc?.url) {
      files.push(data?.vatDoc?.url);
    }
    if (data?.otherDoc?.url) {
      files.push(data?.otherDoc?.url);
    }
    setLoader(true);
    if (downloadOption == 1) {
      // downloadKybDetails(userAlias).then((response) => {
      //   const url = window.URL.createObjectURL(new Blob([response.data]));
      //   const link = document.createElement("a");
      //   link.href = url;
      //   link.setAttribute("download", "strydeKYBDetails?.xlsx");
      //   document.body.appendChild(link);
      //   link.click();
      //   setDownloadModal(false);
      //   setLoader(false);
      // });
    }
    // if (downloadOption == 2) {
    //   multiDownload(files);
    //   setDownloadModal(false);
    //   setLoader(false);
    // }
    // if (downloadOption == 3) {
    //   downloadKybDetails(userAlias).then((response) => {
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "strydeKYBDetails?.xlsx");
    //     document.body.appendChild(link);
    //     link.click();
    //     setDownloadModal(false);
    //     setLoader(false);
    //   });
    //   multiDownload(files);
    // }
  };

  const setAllCheckboxComments = (data: any) => {
    if (isApprover && (data?.trusteeVerificationStatus === "VERIFIED" || data?.trusteeVerificationStatus === "REJECTED" || !isVerificationPending(data))) {
      setDisable(true)
    } else if (!isApprover && (data?.verificationStatus === "VERIFIED" || data?.verificationStatus === "REJECTED" || !isVerificationPending(data))) {
      setDisable(true)
    } else {
      setDisable(false)
    }
    const repComments = {
      amlScreening: data?.repAmlScreeningComment,
      adverseMedia: data?.repAdverseMediaComment,
      nameAndIdVerification: data?.repNameAndIdVerificationComment,
      validDocumentVerification: data?.repValidDocumentVerificationComment,
      otherCommentAndNotes: data?.repOtherCommentAndNotes,
    };
    
    const uboComments = {
      amlScreening: getUboComment(data?.ubo, activeUboTab, 'amlScreeningComment'),
      adverseMedia: getUboComment(data?.ubo, activeUboTab, 'adverseMediaComment'),
      nameAndIdVerification: getUboComment(data?.ubo, activeUboTab, 'nameAndIdVerificationComment'),
      validDocumentVerification: getUboComment(data?.ubo, activeUboTab, 'validDocumentVerificationComment'),
      otherCommentAndNotes: getUboComment(data?.ubo, activeUboTab, 'otherCommentAndNotes'),
    };
    
    const comments = {
      amlScreening: data?.amlScreeningComment,
      adverseMedia: data?.adverseMediaComment,
      nameAndIdVerification: data?.nameAndIdVerificationComment,
      validDocumentVerification: data?.validDocumentVerificationComment,
      otherCommentAndNotes: data?.otherCommentAndNotes,
    };

    // approver comments

    const repCommentsApprover = {
      amlScreening: data?.trusteeRepAdverseMediaComment,
      adverseMedia: data?.trusteeRepAmlScreeningComment,
      nameAndIdVerification: data?.trusteeRepNameAndIdVerificationComment,
      validDocumentVerification: data?.trusteeRepValidDocumentVerificationComment,
      otherCommentAndNotes: data?.trusteeRepOtherCommentAndNotes,
    };

    const uboCommentsApprover = {
      validDocumentVerification: getUboComment(data?.ubo, activeUboTab, 'trusteeValidDocumentVerificationComment'),
      amlScreening: getUboComment(data?.ubo, activeUboTab, 'trusteeAmlScreeningComment'),
      adverseMedia: getUboComment(data?.ubo, activeUboTab, 'trusteeAdverseMediaComment'),
      nameAndIdVerification: getUboComment(data?.ubo, activeUboTab, 'trusteeNameAndIdVerificationComment'),
      otherCommentAndNotes: getUboComment(data?.ubo, activeUboTab, 'trusteeOtherCommentAndNotes'),
    };

    const commentsApprover = {
      amlScreening: data?.trusteeAmlScreeningComment,
      adverseMedia: data?.trusteeAdverseMediaComment,
      nameAndIdVerification: data?.trusteeNameAndIdVerificationComment,
      validDocumentVerification: data?.trusteeValidDocumentVerificationComment,
      otherCommentAndNotes: data?.trusteeOtherCommentAndNotes,
    };

    repCmtForm.setFieldsValue({
      validDocumentVerificationApprover: repCommentsApprover?.validDocumentVerification,
      amlScreeningApprover: repCommentsApprover?.amlScreening,
      adverseMediaApprover: repCommentsApprover?.adverseMedia,
      nameAndIdVerificationApprover: repCommentsApprover?.nameAndIdVerification,
      otherCommentAndNotesApprover: repCommentsApprover?.otherCommentAndNotes,
    });

    repCmtForm.setFieldsValue({
      validDocumentVerification: repComments?.validDocumentVerification,
      amlScreening: repComments?.amlScreening,
      adverseMedia: repComments?.adverseMedia,
      nameAndIdVerification: repComments?.nameAndIdVerification,
      otherCommentAndNotes: repComments?.otherCommentAndNotes,
    });


    setCheckboxCommentRepresentative(repComments);
    setCheckboxCommentApproverRepresentative(repCommentsApprover);
    setCheckboxCommentUbo(uboComments);
    setCheckboxCommentApproverUbo(uboCommentsApprover);
    setCheckboxComment(comments);
    setCheckboxCommentApprover(commentsApprover);
  }

  const setClassification = (data: any) => {
    let classification = isApprover ? data?.trusteeClientClassification : data?.clientClassification;
    if (activeTab === 'Representative') {
      classification = isApprover ? Number(data?.trusteeRepClientClassification) : Number(data?.repClientClassification)
    } else if (activeTab === 'UBO') {
      classification = isApprover ? Number(data?.ubo?.[parseInt(activeUboTab) - 1]?.["trusteeClientClassification"]) : Number(data?.ubo?.[parseInt(activeUboTab) - 1]?.["clientClassification"]);
    } else {
      classification = Number(classification)
    }
    let riskScore = 0;
    if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.LOW_RISK) {
      riskScore = 1;
    } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.MEDIUM_RISK) {
      riskScore = 2;
    } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.HIGH_RISK) {
      riskScore = 3;
    }
    if (classification && !isNaN(classification) && classification !== riskScore) {
      riskScore = parseInt(classification);
    }
    if (riskScore > 0) {
      setDropDownValue(riskScore);
    }
  }

  const setUboCheckBox = (data: any) => {
    if (activeTab === 'UBO') {
      if (isApprover) {
        setValidDocumentVerificationUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeValidDocumentVerificationComment'));
        setNameAndIdVerificationUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeNameAndIdVerificationComment'));
        setAmlScreeningUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeAmlScreeningComment'));
        setAdverseMediaUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeAdverseMediaComment'));
        setOtherCommentUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeOtherCommentAndNotes'));
      } else {
        setValidDocumentVerificationUbo(!!getUboComment(data?.ubo, activeUboTab, 'validDocumentVerificationComment'));
        setNameAndIdVerificationUbo(!!getUboComment(data?.ubo, activeUboTab, 'nameAndIdVerificationComment'));
        setAmlScreeningUbo(!!getUboComment(data?.ubo, activeUboTab, 'amlScreeningComment'));
        setAdverseMediaUbo(!!getUboComment(data?.ubo, activeUboTab, 'adverseMediaComment'));
        setOtherCommentUbo(!!getUboComment(data?.ubo, activeUboTab, 'otherCommentAndNotes'));
      }
    }
  }

  const getStrydeKybDetails = (isUpload = "") => {
    getsyncStrydeDetailsByAlias(strydeAlias).then((response: any) => {
      if (response?.status === 201 || response?.status === 200) {
        const data = response?.data;
        setStrydeResyncPayload({ trustinContractId: data?.trustinContractId, strydeUserId: data?.strydeUserId })
        setStrydeKYBDetails(data);
        setClassification(data);
        if (isUpload == "") {
          // admin comments
          setAllCheckboxComments(data);

          // checkbox data          
          if (isApprover && data?.trusteeRepClientClassification) {
            setDropDownValue(data?.trusteeRepClientClassification);
          }
          // if (!isApprover && data?.repClientClassification) {
          //   setDropDownValue(Number(data?.repClientClassification));
          // }
          if (isApprover) {
            if (data?.trusteeRepValidDocumentVerificationComment) {
              setValidDocumentVerificationRepresentative(!!data?.trusteeRepValidDocumentVerificationComment);
            }
            if (data?.trusteeRepNameAndIdVerificationComment) {
              setNameAndIdVerificationRepresentative(!!data?.trusteeRepNameAndIdVerificationComment);
            }
            if (data?.trusteeRepAmlScreeningComment) {
              setAmlScreeningRepresentative(!!data?.trusteeRepAmlScreeningComment);
            }
            if (data?.trusteeRepAdverseMediaComment) {
              setAdverseMediaRepresentative(!!data?.trusteeRepAdverseMediaComment);
            }
            if (data?.trusteeRepOtherCommentAndNotes) {
              setOtherCommentRepresentative(!!data?.trusteeRepOtherCommentAndNotes);
            }
            if (data?.ubo) {
              setValidDocumentVerificationUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeValidDocumentVerificationComment'));
              setNameAndIdVerificationUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeNameAndIdVerificationComment'));
              setAmlScreeningUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeAmlScreeningComment'));
              setAdverseMediaUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeAdverseMediaComment'));
              setOtherCommentUbo(!!getUboComment(data?.ubo, activeUboTab, 'trusteeOtherCommentAndNotes'));
            }
            if (data?.trusteeValidDocumentVerificationComment) {
              setValidDocumentVerification(!!data?.trusteeValidDocumentVerificationComment);
            }
            if (data?.trusteeNameAndIdVerificationComment) {
              setNameAndIdVerification(!!data?.trusteeNameAndIdVerificationComment);
            }
            if (data?.trusteeAmlScreeningComment) {
              setAmlScreening(!!data?.trusteeAmlScreeningComment);
            }
            if (data?.trusteeAdverseMediaComment) {
              setAdverseMedia(!!data?.trusteeAdverseMediaComment);
            }
            if (data?.trusteeOtherCommentAndNotes) {
              setOtherComment(!!data?.trusteeOtherCommentAndNotes);
            }
          } else {
            if (data?.repValidDocumentVerificationComment) {
              setValidDocumentVerificationRepresentative(!!data?.repValidDocumentVerificationComment);
            }
            if (data?.repNameAndIdVerificationComment) {
              setNameAndIdVerificationRepresentative(!!data?.repNameAndIdVerificationComment);
            }
            if (data?.repAmlScreeningComment) {
              setAmlScreeningRepresentative(!!data?.repAmlScreeningComment);
            }
            if (data?.repAdverseMediaComment) {
              setAdverseMediaRepresentative(!!data?.repAdverseMediaComment);
            }
            if (data?.repOtherCommentAndNotes) {
              setOtherCommentRepresentative(!!data?.repOtherCommentAndNotes);
            }
            
            if (data?.ubo) {
              setValidDocumentVerificationUbo(!!getUboComment(data?.ubo, activeUboTab, 'validDocumentVerificationComment'));
              setNameAndIdVerificationUbo(!!getUboComment(data?.ubo, activeUboTab, 'nameAndIdVerificationComment'));
              setAmlScreeningUbo(!!getUboComment(data?.ubo, activeUboTab, 'amlScreeningComment'));
              setAdverseMediaUbo(!!getUboComment(data?.ubo, activeUboTab, 'adverseMediaComment'));
              setOtherCommentUbo(!!getUboComment(data?.ubo, activeUboTab, 'otherCommentAndNotes'));
            }
            if (data?.validDocumentVerificationComment) {
              setValidDocumentVerification(!!data?.validDocumentVerificationComment);
            }
            if (data?.nameAndIdVerificationComment) {
              setNameAndIdVerification(!!data?.nameAndIdVerificationComment);
            }
            if (data?.otherCommentAndNotes) {
              setOtherComment(!!data?.otherCommentAndNotes);
            }
            if (data?.adverseMediaComment) {
              setAdverseMedia(!!data?.adverseMediaComment);
            }
            if (data?.amlScreeningComment) {
              setAmlScreening(!!data?.amlScreeningComment);
            }
          }
        }
        setUboDetails(data?.ubo);
        if (data?.kybInfo?.length > 0) {
          setDigiScreeningPayload(data?.digiScreeningPayload);
          setRiskAssessment(data?.riskAssessment);
          setRiskAssessmentPayload(data?.riskAssessmentPayload);
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
          setKybFATCACountries(data?.fatcaCountries);
        }
        if (data?.fatcaControllers?.length > 0) {
          setKybFATCAColtrollers(data?.fatcaControllers)
        }
      }

    });
  };

  useEffect(() => {
    setAllCheckboxComments(strydeKYBDetails)
    setClassification(strydeKYBDetails);
    setUboCheckBox(strydeKYBDetails)
  }, [activeTab, activeUboTab]);




  const isAllChecklistChecked = () => {
    let check = true;
    let representativeCheck: boolean = validDocumentVerificationRepresentative;
    representativeCheck &&= nameAndIdVerificationRepresentative;
    representativeCheck &&= amlScreeningRepresentative;
    representativeCheck &&= adverseMediaRepresentative;
    representativeCheck &&= otherCommentRepresentative;
    const repCondA = checkboxCommentRepresentative?.amlScreening &&
      checkboxCommentRepresentative?.adverseMedia &&
      checkboxCommentRepresentative?.nameAndIdVerification &&
      checkboxCommentRepresentative?.validDocumentVerification &&
      checkboxCommentRepresentative?.otherCommentAndNotes
    const repCondB = checkboxCommentApproverRepresentative?.amlScreening &&
      checkboxCommentApproverRepresentative?.adverseMedia &&
      checkboxCommentApproverRepresentative?.nameAndIdVerification &&
      checkboxCommentApproverRepresentative?.validDocumentVerification &&
      checkboxCommentApproverRepresentative?.otherCommentAndNotes;

    const repCondALength = checkLength(checkboxCommentRepresentative);
    const repCondBLength = checkLength(checkboxCommentApproverRepresentative);
    if (isApprover) {
      representativeCheck &&= ((repCondA && repCondALength) || (repCondB && repCondBLength));
    } else {
      representativeCheck &&= repCondA && repCondALength;
    }
    let uboCheck: boolean = validDocumentVerificationShareholder;
    uboCheck &&= nameAndIdVerificationShareholder;
    uboCheck &&= amlScreeningShareholder;
    uboCheck &&= adverseMediaShareholder;
    uboCheck &&= otherCommentShareholder;

    const shrCondA = checkboxCommentUbo?.amlScreening &&
      checkboxCommentUbo?.adverseMedia &&
      checkboxCommentUbo?.nameAndIdVerification &&
      checkboxCommentUbo?.validDocumentVerification &&
      checkboxCommentUbo?.otherCommentAndNotes;
    const shrCondB = checkboxCommentApproverUbo?.amlScreening &&
      checkboxCommentApproverUbo?.adverseMedia &&
      checkboxCommentApproverUbo?.nameAndIdVerification &&
      checkboxCommentApproverUbo?.validDocumentVerification &&
      checkboxCommentApproverUbo?.otherCommentAndNotes

    const uboCondALength = checkLength(checkboxCommentUbo);
    const uboCondBLength = checkLength(checkboxCommentApproverUbo);

    if (isApprover) {
      uboCheck &&= ((shrCondA && uboCondALength) || (shrCondB && uboCondBLength));
    } else {
      uboCheck &&= shrCondA && uboCondALength;
    }
    uboCheck &&= isAllUboVerified;
    let companyCheck = validDocumentVerification;
    companyCheck &&= nameAndIdVerification;
    companyCheck &&= amlScreening;
    companyCheck &&= adverseMedia;
    companyCheck &&= otherComment;

    const comCondA = checkboxComment?.amlScreening &&
      checkboxComment?.adverseMedia &&
      checkboxComment?.nameAndIdVerification &&
      checkboxComment?.validDocumentVerification &&
      checkboxComment?.otherCommentAndNotes;
    const comCondB = checkboxCommentApprover?.amlScreening &&
      checkboxCommentApprover?.adverseMedia &&
      checkboxCommentApprover?.nameAndIdVerification &&
      checkboxCommentApprover?.validDocumentVerification &&
      checkboxCommentApprover?.otherCommentAndNotes

    const comCondALength = checkLength(checkboxComment);
    const comCondBLength = checkLength(checkboxCommentApprover);

    if (isApprover) {
      companyCheck &&= ((comCondA && comCondALength) || (comCondB && comCondBLength));
    } else {
      companyCheck &&= comCondA && comCondALength;
    }
    if (activeTab === 'Company') {
      check = representativeCheck && uboCheck && companyCheck;
    } else if (activeTab === 'UBO') {
      check = representativeCheck && uboCheck;
    } else {
      check = representativeCheck;
    }
    return check;
  };

  const isAllDocumentApproved = (data: any) => {
    let isBusinessDocVerified = !!(data?.tradeLicense?.verified === "VERIFIED" || (isApprover && data?.tradeLicense?.isCompliance === true));
    isBusinessDocVerified &&= !!(!(data?.otherDoc?.length > 0) || data?.otherDoc?.[0]?.verified === "VERIFIED" || (isApprover && data?.otherDoc?.[0]?.isCompliance === true));
    let isRepDocVerified = !!(data?.repDocFront?.verified === "VERIFIED" || (isApprover && data?.repDocFront?.isCompliance === true));
    if (data?.repDocType !== 'PASSPORT' || data?.repDocBack) {
      isRepDocVerified &&= !!(data?.repDocBack?.verified === "VERIFIED" || (isApprover && data?.repDocBack?.isCompliance === true));
    }
    let isUboDocVerified = true;

    if (data?.ubo) {
      if (data.ubo?.length) {
        // const isUboVerified = data?.ubo?.every((item: any) =>
        //   isApprover ? item.docFront.isCompliance === true && item.docBack.isCompliance === true : item.docFront.verified === 'VERIFIED' && item.docBack.verified === 'VERIFIED'
        // );
        // isUboDocVerified &&= !!(isUboVerified);
        const activeIdx = parseInt(activeUboTab) - 1;
        if (data.ubo[activeIdx]) {
          isUboDocVerified &&= !!(data.ubo[activeIdx]?.docFront?.verified === 'VERIFIED' || (isApprover && data.ubo[activeIdx]?.docFront?.isCompliance === true));
          if (data.ubo[activeIdx]?.docType !== 'PASSPORT' || data.ubo[activeIdx]?.docBack) {
            isUboDocVerified &&= !!(data.ubo[activeIdx]?.docBack?.verified === 'VERIFIED' || (isApprover && data.ubo[activeIdx]?.docBack?.isCompliance === true));
          }
        }
      }
    } else {
      isUboDocVerified = true;
    }
    if ((activeTab != 'Company' || isBusinessDocVerified && isUboDocVerified && isRepDocVerified)
      && (activeTab != 'Representative' || isRepDocVerified)
      && (activeTab != 'UBO' || (isUboDocVerified && isRepDocVerified))
    ) {
      return true;
    } else {
      return false;
    }
  }

  const isVerificationPending = (data?: any) => {
    if (!data) {
      data = strydeKYBDetails
    }
    let repCmts : any = {};
    let uboCmts: any = {};
    let cmts : any = {};
    let adminRepCmts:any = {};
    let adminUboCmts: any = {};
    let adminCmts: any = {};
    if (isApprover) {
       
      repCmts = {
        validDocumentVerificationComment: data?.trusteeRepValidDocumentVerificationComment,
        nameAndIdVerificationComment: data?.trusteeRepNameAndIdVerificationComment,
        amlScreeningComment: data?.trusteeRepAmlScreeningComment,
        adverseMediaComment: data?.trusteeRepAdverseMediaComment,
        otherCommentAndNotes: data?.trusteeRepOtherCommentAndNotes,
      }
     
      uboCmts = {
        validDocumentVerificationComment: getUboComment(data?.ubo, activeUboTab, 'trusteeValidDocumentVerificationComment'),
        nameAndIdVerificationComment: getUboComment(data?.ubo, activeUboTab, 'trusteeNameAndIdVerificationComment'),
        amlScreeningComment: getUboComment(data?.ubo, activeUboTab, 'trusteeAmlScreeningComment'),
        adverseMediaComment: getUboComment(data?.ubo, activeUboTab, 'trusteeAdverseMediaComment'),
        otherCommentAndNotes: getUboComment(data?.ubo, activeUboTab, 'trusteeOtherCommentAndNotes'),
      }

      cmts = {
        validDocumentVerificationComment: data?.trusteeValidDocumentVerificationComment,
        nameAndIdVerificationComment: data?.trusteeNameAndIdVerificationComment,
        amlScreeningComment: data?.trusteeAmlScreeningComment,
        adverseMediaComment: data?.trusteeAdverseMediaComment,
        otherCommentAndNotes: data?.trusteeOtherCommentAndNotes,
      }
    }
    adminRepCmts = {
      validDocumentVerificationComment: data?.repValidDocumentVerificationComment,
      nameAndIdVerificationComment: data?.repNameAndIdVerificationComment,
      amlScreeningComment: data?.repAmlScreeningComment,
      adverseMediaComment: data?.repAdverseMediaComment,
      otherCommentAndNotes: data?.repOtherCommentAndNotes,
    }
   
    adminUboCmts = {
      validDocumentVerificationComment: getUboComment(data?.ubo, activeUboTab, 'validDocumentVerificationComment'),
      nameAndIdVerificationComment: getUboComment(data?.ubo, activeUboTab, 'nameAndIdVerificationComment'),
      amlScreeningComment: getUboComment(data?.ubo, activeUboTab, 'amlScreeningComment'),
      adverseMediaComment: getUboComment(data?.ubo, activeUboTab, 'adverseMediaComment'),
      otherCommentAndNotes: getUboComment(data?.ubo, activeUboTab, 'otherCommentAndNotes'),
    }
   
    adminCmts = {
      validDocumentVerificationComment: data?.validDocumentVerificationComment,
      nameAndIdVerificationComment: data?.nameAndIdVerificationComment,
      amlScreeningComment: data?.amlScreeningComment,
      adverseMediaComment: data?.adverseMediaComment,
      otherCommentAndNotes: data?.otherCommentAndNotes,
    }
    
    let crtCmts:any = {};
    
    let check = true;
    let validDocumentationVerificationCheck = false;
    let nameAndIdVerificationCheck = false;
    let amlScreeningCheck = false;
    let adverseMediaCheck = false;
    let otherCommentCheck = false;
    if (activeTab === 'Representative') {
      crtCmts = isApprover ? repCmts : adminRepCmts;
      validDocumentationVerificationCheck = !!adminRepCmts.validDocumentVerificationComment;
      nameAndIdVerificationCheck = !!adminRepCmts.nameAndIdVerificationComment;
      amlScreeningCheck = !!adminRepCmts.amlScreeningComment;
      adverseMediaCheck = !!adminRepCmts.adverseMediaComment;
      otherCommentCheck = !!adminRepCmts.otherCommentAndNotes;
    } else if (activeTab === 'UBO') {
      crtCmts = isApprover ? uboCmts : adminUboCmts;
      validDocumentationVerificationCheck = !!adminUboCmts.validDocumentVerificationComment;
      nameAndIdVerificationCheck = !!adminUboCmts.nameAndIdVerificationComment;
      amlScreeningCheck = !!adminUboCmts.amlScreeningComment;
      adverseMediaCheck = !!adminUboCmts.adverseMediaComment;
      otherCommentCheck = !!adminUboCmts.otherCommentAndNotes;
    } else {
      crtCmts = isApprover ? cmts : adminCmts;
      validDocumentationVerificationCheck = !!adminCmts.validDocumentVerificationComment;
      nameAndIdVerificationCheck = !!adminCmts.nameAndIdVerificationComment;
      amlScreeningCheck = !!adminCmts.amlScreeningComment;
      adverseMediaCheck = !!adminCmts.adverseMediaComment;
      otherCommentCheck = !!adminCmts.otherCommentAndNotes;
      check &&= isAllMoaDocApproved;
      check &&= isAllLoaDocApproved;
    }
    if (isApprover) {
      check &&= !!(crtCmts?.validDocumentVerificationComment || validDocumentationVerificationCheck);
      check &&= !!(crtCmts?.nameAndIdVerificationComment || nameAndIdVerificationCheck);
      check &&= !!(crtCmts?.amlScreeningComment || amlScreeningCheck);
      check &&= !!(crtCmts?.adverseMediaComment || adverseMediaCheck);
      check &&= !!(crtCmts?.otherCommentAndNotes || otherCommentCheck);
    } else {
      check &&= !!(crtCmts?.validDocumentVerificationComment && validDocumentationVerificationCheck);
      check &&= !!(crtCmts?.nameAndIdVerificationComment && nameAndIdVerificationCheck);
      check &&= !!(crtCmts?.amlScreeningComment && amlScreeningCheck);
      check &&= !!(crtCmts?.adverseMediaComment && adverseMediaCheck);
      check &&= !!(crtCmts?.otherCommentAndNotes && otherCommentCheck);
    }
    check &&= isAllDocumentApproved(data);
    return !check;
  }


  const handleModalCancel = () => {
    setClassificationModalVisible(false);
    setCommentModal(false);
    setApproveModal(false);
    setRejectModal(false);
    setDownloadModal(false);
    SetCommentModalReject(false);
    setHoldModal(false);
    form.resetFields();
    formStryedDocumentApprove.resetFields();
    formStryedDocumentReject.resetFields();
    formStryedApproveKYB.resetFields();
    formStryedRejectKYB.resetFields();
    formStryedHoldKYB.resetFields();
    setComment("");
    setFileId(0);
  };

  const handleReject = async () => {
    // type: 0 = representative, 1 = ubo, 2 = company
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

  const getCommentFields = (tab: string, isApprover: boolean) => {
    const commentMap = {
      adverseMediaComment:
        tab === 'Representative' ? (isApprover ? checkboxCommentApproverRepresentative.adverseMedia : checkboxCommentRepresentative.adverseMedia) :
          tab === 'UBO' ? (isApprover ? checkboxCommentApproverUbo.adverseMedia : checkboxCommentUbo.adverseMedia) :
            (isApprover ? checkboxCommentApprover.adverseMedia : checkboxComment.adverseMedia),

      amlScreeningComment:
        tab === 'Representative' ? (isApprover ? checkboxCommentApproverRepresentative.amlScreening : checkboxCommentRepresentative.amlScreening) :
          tab === 'UBO' ? (isApprover ? checkboxCommentApproverUbo.amlScreening : checkboxCommentUbo.amlScreening) :
            (isApprover ? checkboxCommentApprover.amlScreening : checkboxComment.amlScreening),

      nameAndIdVerificationComment:
        tab === 'Representative' ? (isApprover ? checkboxCommentApproverRepresentative.nameAndIdVerification : checkboxCommentRepresentative.nameAndIdVerification) :
          tab === 'UBO' ? (isApprover ? checkboxCommentApproverUbo.nameAndIdVerification : checkboxCommentUbo.nameAndIdVerification) :
            (isApprover ? checkboxCommentApprover.nameAndIdVerification : checkboxComment.nameAndIdVerification),

      validDocumentVerificationComment:
        tab === 'Representative' ? (isApprover ? checkboxCommentApproverRepresentative.validDocumentVerification : checkboxCommentRepresentative.validDocumentVerification) :
          tab === 'UBO' ? (isApprover ? checkboxCommentApproverUbo.validDocumentVerification : checkboxCommentUbo.validDocumentVerification) :
            (isApprover ? checkboxCommentApprover.validDocumentVerification : checkboxComment.validDocumentVerification),

      otherCommentAndNotes:
        tab === 'Representative' ? (isApprover ? checkboxCommentApproverRepresentative.otherCommentAndNotes : checkboxCommentRepresentative.otherCommentAndNotes) :
          tab === 'UBO' ? (isApprover ? checkboxCommentApproverUbo.otherCommentAndNotes : checkboxCommentUbo.otherCommentAndNotes) :
            (isApprover ? checkboxCommentApprover.otherCommentAndNotes : checkboxComment.otherCommentAndNotes),
    };

    return commentMap;
  };

  const getReqBodyForApproveRejectHoldStryde = () => {
    let type = 0;
    let clientClassification = '';
    let commentFields = {};

    switch (activeTab) {
      case 'Representative':
        type = 0;
        commentFields = getCommentFields('Representative', isApprover);
        clientClassification = dropDownValue ?? strydeKYBDetails.repClientClassification;
        break;
      case 'UBO':
        type = 1;
        commentFields = getCommentFields('UBO', isApprover);
        clientClassification = dropDownValue ?? strydeKYBDetails.shareholderClassification;
        break;
      case 'Company':
        type = 2;
        commentFields = getCommentFields('Company', isApprover);
        clientClassification = dropDownValue ?? strydeKYBDetails.clientClassification;
        break;
      default:
        commentFields = getCommentFields('Representative', isApprover);
        clientClassification = dropDownValue ?? strydeKYBDetails.repClientClassification;
        break;
    }

    return {
      alias: currentUserAlias,
      type: type,
      comment: comment,
      uboAlias: uboAlias ? uboAlias : (activeTab == "UBO") ? strydeKYBDetails?.ubo?.[parseInt(activeUboTab) - 1]?.["aliasName"] : "",
      isRejected: false,
      isHold: false,
      clientClassification: clientClassification,
      ...commentFields,
    };
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

  const approveKYB = async () => {
    setLoading(true);
    const reqBody = getReqBodyForApproveRejectHoldStryde()
    await verifyStryde(reqBody)
  };
  const rejectKYB = async () => {
    setLoading(true);
    let reqBody = getReqBodyForApproveRejectHoldStryde()
    reqBody = { ...reqBody, isRejected: true }
    await verifyStryde(reqBody)
  };
  const holdKYB = async () => {
    setLoading(true);
    let reqBody = getReqBodyForApproveRejectHoldStryde()
    reqBody = { ...reqBody, isHold: true }
    await verifyStryde(reqBody)
  };

  const verifyStryde = async (reqBody: any) => {
    await verifyStrydeByAlias(strydeAlias, reqBody).then((res: any) => {
      setLoading(false);
      if (res.status === 201 || res.status == 200) {
        setUboAlias("");
        // setSuccessModal(true);
        getStrydeKybDetails();
        handleModalCancel();
      }
    })
  }
  const verifyStrydeDocument = async (reqBody: any) => {
    await verifyStrydeDocumentByAlias(strydeAlias, reqBody).then((res: any) => {
      setLoading(false);
      if (res.status === 201 || res.status == 200) {
        getStrydeKybDetails();
        handleModalCancel();
      }
    })
  }
  const openApproveModal = () => {
    setApproveModal(true);
  };

  const openRejectModal = () => {
    setRejectModal(true);
  };
  const checkCommentsCheckbox = (id: any) => {
    switch (id) {
      case "validDocumentVerification":
        if (activeTab === "Company") {
          setValidDocumentVerification(true);
        }
        if (activeTab === "Representative") {
          setValidDocumentVerificationRepresentative(true);
        }
        if (activeTab === "UBO") {
          setValidDocumentVerificationUbo(true);
        }
        break;
      case "nameAndIdVerification":
        if (activeTab === "Company") {
          setNameAndIdVerification(true);
        }
        if (activeTab === "Representative") {
          setNameAndIdVerificationRepresentative(true);
        }
        if (activeTab === "UBO") {
          setNameAndIdVerificationUbo(true);
        }
        break;
      case "amlScreening":
        if (activeTab === "Company") {
          setAmlScreening(true)
        }
        if (activeTab === "Representative") {
          setAmlScreeningRepresentative(true);
        }
        if (activeTab === "UBO") {
          setAmlScreeningUbo(true);
        }
        break;
      case "adverseMedia":
        if (activeTab === "Company") {
          setAdverseMedia(true)
        }
        if (activeTab === "Representative") {
          setAdverseMediaRepresentative(true);
        }
        if (activeTab === "UBO") {
          setAdverseMediaUbo(true);
        }
        break;
      case "otherCommentAndNotes":
        if (activeTab === "Company") {
          setOtherComment(true)
        }
        if (activeTab === "Representative") {
          setOtherCommentRepresentative(true);
        }
        if (activeTab === "UBO") {
          setOtherCommentUbo(true);
        }
        break;

      default:
        break;
    }
  }
  const updateComment = (id: any, event: any, uboAlias?: any) => {
    if (!isApprover) {
      if (activeTab === "Company") {
        setUboAlias("");
        const comments = { ...checkboxComment };
        comments[id] = event?.target?.value;
        setCheckboxComment(comments);
        checkCommentsCheckbox(id);
      } else if (activeTab === "Representative") {
        setUboAlias("");
        const commentsRep = { ...checkboxCommentRepresentative };
        commentsRep[id] = event?.target?.value;
        setCheckboxCommentRepresentative(commentsRep);
        checkCommentsCheckbox(id);
      } else if (activeTab === "UBO") {
        setUboAlias(uboAlias)
        const commentsShare = { ...checkboxCommentUbo };
        commentsShare[id] = event?.target?.value;
        setCheckboxCommentUbo(commentsShare);
        checkCommentsCheckbox(id);
      }
    }
  };
  const updateApproverComment = (id: string, value: string, uboAlias?: any) => {
    if (isApprover) {
      if (activeTab === "Company") {
        setUboAlias("");
        const comments = { ...checkboxCommentApprover };
        comments[id] = value;
        setCheckboxCommentApprover(comments);
        checkCommentsCheckbox(id)
      } else if (activeTab === "Representative") {
        setUboAlias("");
        const commentsApRep = { ...checkboxCommentApproverRepresentative };
        commentsApRep[id] = value;
        setCheckboxCommentApproverRepresentative(commentsApRep);
        checkCommentsCheckbox(id);
      } else if (activeTab === "UBO") {
        setUboAlias(uboAlias)
        const commentsApShare = { ...checkboxCommentApproverUbo };
        commentsApShare[id] = value;
        setCheckboxCommentApproverUbo(commentsApShare);
        checkCommentsCheckbox(id);
      }
    }
  };
  const handleInput = (e: any) => {
    const regex = /^[A-Za-z,.\- ]*$/;
    const currentValue = e.target.value;
    if (!regex.test(currentValue)) {
      e.preventDefault();
      e.target.value = currentValue.slice(0, -1);
    }
    // else {
    //   updateComment("validDocumentVerification", currentValue);
    // }
  };

  const handleDropdownChange = (e: any) => {
    setDropDownValue(e.target.value);
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
    navigate(StrydeKYBManagementList);
  };

  // const getRiskConfigurationDetails = async () => {
  //   setLoading(true);
  //   await getRiskConfiguration({ RiskCategory: "C" })
  //     .then((response) => {
  //       if (response?.data?.status === 201 || response?.data?.status === 200) {
  //         setLoading(false);
  //         if (response?.data?.result && response?.data?.result?.length) {
  //           const result = response?.data?.result
  //           const graphicRiskIndex = result.findIndex((d: any) => d.riskCategory == 'Geographic Risk')
  //           if (graphicRiskIndex > -1) {
  //             result[graphicRiskIndex]['riskTypes']?.map((r: any) => {
  //               if (r?.riskType == 'Nationality Partner 1') {
  //                 setCountryList(r?.riskItems || []);
  //                 setBrithPlaceList(r?.riskItems || [])
  //               }
  //             })
  //           }
  //           return result
  //         }
  //       }
  //     }).catch((error) => {
  //       setLoading(false);
  //       message.error(error?.error?.message ? error?.error?.message : "Something went wrong");
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
  const handleRiskClassificationSubmit = async () => {
    try {
      setLoading(true);
      let type = 0;
      if (activeTab === 'Representative') {
        type = 0;
      } else if (activeTab === 'UBO') {
        type = 1;
      } else {
        type = 2;
      }
      const reqBody = {
        alias: currentUserAlias,
        type: type,
        uboAlias: uboAlias ? uboAlias : (activeTab == "UBO") && strydeKYBDetails?.ubo?.[parseInt(activeUboTab) - 1]?.["aliasName"],
        comment: comment,
        clientClassification: dropDownValue,
      };
      const res = await updateClientClassificationByAlias(strydeAlias, reqBody);
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        handleModalCancel();
        getStrydeKybDetails();
        message.success("Risk classification successfully saved");
      }
    } catch (error) {
      setLoading(false);
      message.error("Oops! Something went wrong. Please try again later");
    }
  }

  const renderMultipleJurisdictionRows = () => {
    const rows = [];
    for (let i = 0; i < parseInt(kybFATCACountries?.kybNumberOfCountry ?? 0); i++) {
      rows.push(
        <>
          <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
            <Col>
              <Space direction="vertical">
                <Text type="secondary">
                  <b>Please let us know your other jurisdiction if any.</b>
                </Text>
                <Text>
                  <b>
                    {toTitleCase(kybFATCACountries?.[`anotherjurisdictionCountry_${i}`]) ?? '---'}
                  </b>
                </Text>
              </Space>
            </Col>
          </Row>
          <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
            <Col>
              <Space direction="vertical">
                <Text type="secondary">
                  <b>Do you have a Tax identification number? </b>
                </Text>
                <Text>
                  <b>
                    {toTitleCase(kybFATCACountries?.[`hasMultipleKybTIN_${i}`]) ?? '---'}
                  </b>
                </Text>
              </Space>
            </Col>
          </Row>
          {kybFATCACountries?.[`hasMultipleKybTIN_${i}`] === 'yes' && (
            <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary">
                    <b>Tax identification number</b>
                  </Text>
                  <Text>
                    <b>
                      {kybFATCACountries?.[`multipleKybTinNo_${i}`] ?? '---'}
                    </b>
                  </Text>
                </Space>
              </Col>
            </Row>
          )}
          {kybFATCACountries?.[`hasMultipleKybTIN_${i}`] === 'no' && (
            <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary">
                    <b>Reason for no TIN Number</b>
                  </Text>
                  <Text>
                    <b>
                      {kybFATCACountries?.[`multipleKybNoTinReason_${i}`] === "countryNotissueTINs"
                        ? "Country/ Jurisdiction does not issue TINs." : kybFATCACountries?.[`multipleKybNoTinReason_${i}`] === "countryNotRequirToProvideTIN"
                          ? "Country/ Jurisdiction does not require me to provide TIN." : kybFATCACountries?.[`multipleKybNoTinReason_${i}`] === "unableToObtainTIN"
                            ? "Unable to obtain a TIN." : ""}
                    </b>
                  </Text>
                </Space>
              </Col>
            </Row>
          )}
        </>
      );
    }
    return rows;
  };

  const handlePDFView = (url: any) => {
    if (url) {
      setImagUrl(url);
      setverifyVisible(true)
    }
  }


  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  const onUboTabChange = (key: string) => {
    setActiveUboTab(key);
  }

  const repDocType = DOCUMENT_TYPE[
    strydeKYBDetails?.repDocType
  ] ?? 'Emirates ID'

  const verificationPendingCheck = isVerificationPending(strydeKYBDetails);

  const items: any['items'] = [
    {
      key: 'Representative',
      label: 'Representative details',
      children: (
        <>
          <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="endtoend">
            <Col xs={24} sm={24} md={24} lg={24} className="bg-admin-card-col8 kyb-business-details-card">
              <Card className="p-4 h-100">
                {" "}
                <div>
                  <div className="titleText fs-3 my-4">Representative details</div>
                  <div className="titleText">
                    {strydeKYBDetails?.repName}
                  </div>
                  <div className="subtext kyb-business-subtext mt-3 ">
                    {
                      COMPANY_ROLE[strydeKYBDetails?.repRole]
                    }
                  </div>
                </div>
                <hr className=" subText mt-4" />
                <div className="card-items row mb-3 row-gap-2">
                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    <div className="subtext d-flex">
                      <Image src={Email} alt="email" preview={false} />
                      <span className="ml-4 ">
                        {strydeKYBDetails?.email}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    <div className="subtext d-flex align-items-center">
                      <Image src={Globe_dark} alt="country" preview={false} />
                      <span className="mx-2 overflowText">
                        {strydeKYBDetails?.repNationality ?? strydeKYBDetails?.country}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    <div className="subtext d-flex">
                      <Image src={Phone_Dark} alt="phone" preview={false} />
                      <span className="ml-4 overflowText">
                        {strydeKYBDetails?.contactNumber}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    <div className="subtext d-flex">
                      <Image src={EntitytypeIcon} alt="type" preview={false} />
                      <span className="ml-4 overflowText">
                        {ENTITY_TYPE[strydeKYBDetails?.entityType]}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    <div className="subtext d-flex">
                      Shareholding percentage 
                      <Popover content={`${strydeKYBDetails?.repShares} %`}>    
                      <span className="ml-4 overflowText userinfo cursor">
                        {strydeKYBDetails?.repShares} %
                      </span>
                      </Popover>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    <div className="subtext d-flex">
                      Representative dob
                      <Popover content={strydeKYBDetails?.repDob ? dayjs(strydeKYBDetails?.repDob).format("DD-MM-YYYY") : "--"}>    
                      <span className="ml-4 overflowText userinfo cursor">
                        {strydeKYBDetails?.repDob ? dayjs(strydeKYBDetails?.repDob).format("DD-MM-YYYY") : "--"}
                      </span>
                      </Popover>
                    </div>
                  </div>

                  <div className="col-sm-6 col-lg-4 col-xl-3">
                    Representative role
                    <span className="mx-2 cursor">
                      <b>
                        {" "}
                        {strydeKYBDetails?.repRole}
                      </b>
                    </span>
                  </div>
                </div>
                <div className="subText_medium border-left mt-4">
                  <b>Representative</b>
                </div>
                <Row gutter={20}>
                  {strydeKYBDetails?.repDocFront?.url ? (
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} className="my-4">
                      <div className="afterApproveCard">
                        {strydeKYBDetails?.repDocFront?.isCompliance != null ||
                          strydeKYBDetails?.repDocFront?.verified ==
                          "VERIFIED" ||
                          strydeKYBDetails?.repDocFront?.verified ==
                          "REJECTED" ? (
                          <Tabs
                            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                            className="d-none-res "
                          >
                            {strydeKYBDetails?.repDocFront?.isCompliance != null ? (
                              <TabPane tab={`Approver`} key="approver">
                                {strydeKYBDetails?.repDocFront?.isCompliance == null ? (
                                  <DocumentCard
                                    url={strydeKYBDetails?.repDocFront?.url}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    docType={strydeKYBDetails?.repDocType+'_FRONT'}
                                    fileId={strydeKYBDetails?.repDocFront?.id}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                    showButtons={true}
                                  />
                                ) : (
                                  <ApproverDetails
                                    modalTitle={
                                      repDocType + " front"
                                    }
                                    approverDetails={
                                      strydeKYBDetails?.repDocFront
                                    }
                                    uploadedFile={
                                      strydeKYBDetails?.repDocFront?.url
                                    }
                                    tab="approver"
                                  />
                                )}
                              </TabPane>
                            ) : (
                              ""
                            )}

                            <TabPane tab={`Authorizer`} key="authorizer">
                              {strydeKYBDetails?.repDocFront
                                ?.verified != "VERIFIED" &&
                                strydeKYBDetails?.repDocFront
                                  ?.verified != "REJECTED" ? (
                                  <DocumentCard
                                    url={strydeKYBDetails?.repDocFront?.url}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    docType={strydeKYBDetails?.repDocType+'_FRONT'}
                                    fileId={strydeKYBDetails?.repDocFront?.id}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                    showButtons={isAuthorizer}
                                  />
                              ) : (
                                <ApproverDetails
                                  modalTitle={
                                    repDocType + " front"
                                  }
                                  approverDetails={
                                    strydeKYBDetails?.repDocFront
                                  }
                                  uploadedFile={
                                    strydeKYBDetails?.repDocFront
                                      ?.url
                                  }
                                  tab="admin"
                                />
                              )}
                            </TabPane>
                          </Tabs>
                        ) : strydeKYBDetails?.repDocFront
                          ?.verified != "VERIFIED" &&
                          strydeKYBDetails?.repDocFront?.status !=
                          "REJECTED" ? (
                          <div className="afterApproveCard-img-card">
                            <DocumentCard
                              url={strydeKYBDetails?.repDocFront?.url}
                              handleDownload={handleDownload}
                              handlePDFView={handlePDFView}
                              docType={strydeKYBDetails?.repDocType+'_FRONT'}
                              fileId={strydeKYBDetails?.repDocFront?.id}
                              handleDocumentButton={handleDocumentButton}
                              userType={userType}
                              showButtons={true}
                            />
                          </div>
                        ) : (
                          <ApproverDetails
                            modalTitle={
                              repDocType + " front"
                            }
                            approverDetails={
                              strydeKYBDetails?.repDocFront
                            }
                            uploadedFile={
                              strydeKYBDetails?.repDocFront?.url
                            }
                            tab="admin"
                          />
                        )}
                      </div>
                    </Col>
                  ) : null}
                  {strydeKYBDetails?.repDocBack?.url ? (
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} className="my-4">
                      <div className="afterApproveCard">
                        {strydeKYBDetails?.repDocBack?.isCompliance != null ||
                          strydeKYBDetails?.repDocBack?.verified ==
                          "VERIFIED" ||
                          strydeKYBDetails?.repDocBack?.verified ==
                          "REJECTED" ? (
                          <Tabs
                            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                            className="d-none-res "
                          >
                            {strydeKYBDetails?.repDocBack?.isCompliance != null ? (
                              <TabPane tab={`Approver`} key="approver">
                                {strydeKYBDetails?.repDocBack?.isCompliance == null ? (
                                  <DocumentCard
                                    url={strydeKYBDetails?.repDocBack?.url}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    docType={strydeKYBDetails?.repDocType+'_BACK'}
                                    fileId={strydeKYBDetails?.repDocBack?.id}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                    showButtons={true}
                                  />
                                ) : (
                                  <ApproverDetails
                                    modalTitle={
                                      repDocType + " back"
                                    }
                                    approverDetails={
                                      strydeKYBDetails?.repDocBack
                                    }
                                    uploadedFile={
                                      strydeKYBDetails?.repDocBack?.url
                                    }
                                    tab="approver"
                                  />
                                )}
                              </TabPane>
                            ) : (
                              ""
                            )}

                            <TabPane tab={`Authorizer`} key="authorizer">
                              {strydeKYBDetails?.repDocBack
                                ?.verified != "VERIFIED" &&
                                strydeKYBDetails?.repDocBack
                                  ?.verified != "REJECTED" ? (
                                  <DocumentCard
                                    url={strydeKYBDetails?.repDocBack?.url}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    docType={strydeKYBDetails?.repDocType+'_BACK'}
                                    fileId={strydeKYBDetails?.repDocBack?.id}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                    showButtons={isAuthorizer}
                                  />
                              ) : (
                                <ApproverDetails
                                  modalTitle={
                                    repDocType + " back"
                                  }
                                  approverDetails={
                                    strydeKYBDetails?.repDocBack
                                  }
                                  uploadedFile={
                                    strydeKYBDetails?.repDocBack
                                      ?.url
                                  }
                                  tab="admin"
                                />
                              )}
                            </TabPane>
                          </Tabs>
                        ) : strydeKYBDetails?.repDocBack
                          ?.verified != "VERIFIED" &&
                          strydeKYBDetails?.repDocBack?.status !=
                          "REJECTED" ? (
                          <div className="afterApproveCard-img-card">
                            <DocumentCard
                              url={strydeKYBDetails?.repDocBack?.url}
                              handleDownload={handleDownload}
                              handlePDFView={handlePDFView}
                              docType={strydeKYBDetails?.repDocType+'_BACK'}
                              fileId={strydeKYBDetails?.repDocBack?.id}
                              handleDocumentButton={handleDocumentButton}
                              userType={userType}
                              showButtons={true}
                            />
                          </div>
                        ) : (
                          <ApproverDetails
                            modalTitle={
                              repDocType + " back"
                            }
                            approverDetails={
                              strydeKYBDetails?.repDocBack
                            }
                            uploadedFile={
                              strydeKYBDetails?.repDocBack?.url
                            }
                            tab="admin"
                          />
                        )}
                      </div>
                    </Col>
                  ) : null}
                </Row>
                <hr className="lightgrayHr" />
                <Form form={repCmtForm}>
                  <Row className="mt-3">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
                              ? true
                              : false
                              || userType === "SUPPORT_ENGINEER"
                        }
                        checked={validDocumentVerificationRepresentative}
                        onClick={() => {
                          setValidDocumentVerificationRepresentative(!validDocumentVerificationRepresentative);
                        }}
                      >
                        <div className="subText mx-1 ">
                          Valid document verification
                        </div>
                      </Checkbox>
                      <div className="afterApproveCard">
                        <Tabs
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res  mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails?.trusteeRepValidDocumentVerificationComment
                                  ? strydeKYBDetails?.trusteeRepValidDocumentVerificationComment
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="validDocumentVerificationApprover"
                                rules={
                                  isApprover ?
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
                                className="checklist w-100"
                              >
                                <TextArea
                                  rows={2}
                                  placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                                  className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                                  // onInput={handleInput}
                                  id="validDocumentVerificationApprover"
                                  onChange={(e) => updateApproverComment("validDocumentVerification", e?.target?.value)}
                                  defaultValue={checkboxCommentApproverRepresentative?.validDocumentVerification}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails?.repValidDocumentVerificationComment
                                    ? strydeKYBDetails?.repValidDocumentVerificationComment
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
                                    defaultValue={checkboxCommentRepresentative?.validDocumentVerification}
                                    disabled={isApprover || disable|| userType === "SUPPORT_ENGINEER"}
                                    onChange={(e: any) => updateComment("validDocumentVerification", e)}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Row>
                  <Row className="my-4">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
                              ? true
                              : false
                              || userType === "SUPPORT_ENGINEER"
                        }
                        checked={nameAndIdVerificationRepresentative}
                        onClick={() => {
                          setNameAndIdVerificationRepresentative(!nameAndIdVerificationRepresentative);
                        }}
                      >
                        <div className="subText mx-1 ">Name & id verification</div>
                      </Checkbox>
                      <div className="afterApproveCard">
                        <Tabs
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res  mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails?.trusteeRepNameAndIdVerificationComment
                                  ? strydeKYBDetails?.trusteeRepNameAndIdVerificationComment
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="nameAndIdVerificationApprover"
                                rules={
                                  isApprover ?
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
                                  defaultValue={checkboxCommentApproverRepresentative?.nameAndIdVerification}
                                  onChange={(e) => updateApproverComment("nameAndIdVerification", e?.target?.value)}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails?.repNameAndIdVerificationComment
                                    ? strydeKYBDetails?.repNameAndIdVerificationComment
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
                                    defaultValue={checkboxCommentRepresentative?.nameAndIdVerification}
                                    onChange={(e: any) => updateComment("nameAndIdVerification", e)}
                                    disabled={isApprover || disable||userType==="SUPPORT_ENGINEER"}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Row>
                  <Row className="my-4">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
                              ? true
                              : false
                              || userType === "SUPPORT_ENGINEER"
                        }
                        checked={amlScreeningRepresentative}
                        onClick={() => {
                          setAmlScreeningRepresentative(!amlScreeningShareholder);
                        }}
                      >
                        <div className="subText mx-1 ">AML screening</div>
                      </Checkbox>
                      <div className="afterApproveCard">
                        <Tabs
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res  mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails?.trusteeRepAmlScreeningComment
                                  ? strydeKYBDetails?.trusteeRepAmlScreeningComment
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="amlScreeningApprover"
                                rules={
                                  isApprover ?
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
                                  defaultValue={checkboxCommentApproverRepresentative?.amlScreening}
                                  onChange={(e) => updateApproverComment("amlScreening", e?.target?.value)}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails?.repAmlScreeningComment
                                    ? strydeKYBDetails?.repAmlScreeningComment
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
                                    defaultValue={checkboxCommentRepresentative?.amlScreening}
                                    onChange={(e: any) => updateComment("amlScreening", e)}
                                    disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Row>
                  <Row className="my-4">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
                              ? true
                              : false
                              || userType === "SUPPORT_ENGINEER"
                        }
                        checked={adverseMediaRepresentative}
                        onClick={() => {
                          setAdverseMediaRepresentative(!adverseMediaRepresentative);
                        }}
                      >
                        <div className="subText mx-1 ">Adverse media</div>
                      </Checkbox>
                      <div className="afterApproveCard">
                        <Tabs
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails?.trusteeRepAdverseMediaComment
                                  ? strydeKYBDetails?.trusteeRepAdverseMediaComment
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="adverseMediaApprover"
                                rules={
                                  isApprover ?
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
                                  defaultValue={checkboxCommentApproverRepresentative?.adverseMedia}
                                  onChange={(e) => updateApproverComment("adverseMedia", e?.target?.value)}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails?.repAdverseMediaComment
                                    ? strydeKYBDetails?.repAdverseMediaComment
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
                                    defaultValue={checkboxCommentRepresentative?.adverseMedia}
                                    onChange={(e: any) => updateComment("adverseMedia", e)}
                                    disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Row>
                  <Row className="my-4">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
                              ? true
                              : false
                              || userType === "SUPPORT_ENGINEER"
                        }
                        checked={otherCommentRepresentative}
                        onClick={() => {
                          setOtherCommentRepresentative(!otherCommentRepresentative);
                        }}
                      >
                        <div className="subText mx-1 ">Other comments/notes</div>
                      </Checkbox>
                      <div className="afterApproveCard">
                        <Tabs
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails?.trusteeRepOtherCommentAndNotes
                                  ? strydeKYBDetails?.trusteeRepOtherCommentAndNotes
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="otherCommentAndNotesApprover"
                                rules={
                                  isApprover ?
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
                                  defaultValue={checkboxCommentApproverRepresentative?.otherCommentAndNotes}
                                  onChange={(e) => updateApproverComment("otherCommentAndNotes", e?.target?.value)}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails?.repOtherCommentAndNotes
                                    ? strydeKYBDetails?.repOtherCommentAndNotes
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
                                    defaultValue={checkboxCommentRepresentative?.otherCommentAndNotes}
                                    onChange={(e: any) => updateComment("otherCommentAndNotes", e)}
                                    disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
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
              </Card>
            </Col>
          </Row>

        </>
      ),
    },
    {
      key: 'UBO',
      label: 'UBO details',
      children: (
        <>
          <Card className="my-3 details-card">
            {uboDetails && uboDetails?.length > 0 && (
              <Row>
                <div className="titleText fs-3 my-4">UBO details</div>
                <Tabs
                  className="w-100 custom-tabs"
                  type="card"
                  onChange={onUboTabChange}
                  items={uboDetails?.map((elem: any, i: any) => {
                    const id = String(i + 1);
                    return {
                      label: <span className="shareholder_tab">{`UBO ${id}`}</span>,
                      key: id,
                      children: (<>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center justify-content-between">
                          <Col xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Name</b></Text>
                              <Text> <b>{elem?.name ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Percentage of shareholdings</b></Text>
                              <Text> <b>{elem?.shares ?? "---"}</b> </Text>
                            </Space>
                          </Col>

                          <Col xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Date of birth</b></Text>
                              <Text> <b>{elem?.dob ? dayjs(elem?.dob).format("DD-MM-YYYY") : "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Nationality</b></Text>
                              <Text> <b>{elem?.nationality ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                        </Row>
                        <Row className="gap-4">
                          {elem?.docFront?.url ? (
                            <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                              <div className="afterApproveCard">
                                {elem?.docFront
                                  ?.isCompliance != null ||
                                  elem?.docFront
                                    ?.verified == "VERIFIED" ||
                                  elem?.docFront
                                    ?.verified == "REJECTED" ? (
                                  <Tabs
                                    defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                                    className="d-none-res "
                                  >
                                    {elem?.docFront
                                      ?.isCompliance != null ? (
                                      <TabPane tab={`Approver`} key="approver">
                                        {elem?.docFront
                                          ?.isCompliance == null ? (
                                          <DocumentCard
                                            url={elem?.docFront?.url}
                                            docType="FRONT"
                                            fileId={elem?.docFront?.id}
                                            showButtons={true}
                                            handleDownload={handleDownload}
                                            handlePDFView={handlePDFView}
                                            handleDocumentButton={handleDocumentButton}
                                            userType={userType}
                                          />
                                        ) : (
                                          <ApproverDetails
                                            modalTitle="Front proof"
                                            approverDetails={elem?.docFront}
                                            uploadedFile={elem?.docFront?.url}
                                            tab="approver"
                                          />
                                        )}
                                      </TabPane>
                                    ) : (
                                      ""
                                    )}

                                    <TabPane tab={`Authorizer`} key="authorizer">
                                      {elem?.docFront
                                        ?.verified != "VERIFIED" &&
                                        elem?.docFront
                                          ?.verified != "REJECTED" ? (
                                        <DocumentCard
                                          url={elem?.docFront?.url}
                                          docType="FRONT"
                                          fileId={elem?.docFront?.id}
                                          showButtons={isAuthorizer}
                                          handleDownload={handleDownload}
                                          handlePDFView={handlePDFView}
                                          handleDocumentButton={handleDocumentButton}
                                          userType={userType}
                                        />
                                      ) : (
                                        <ApproverDetails
                                          modalTitle="Front proof"
                                          approverDetails={
                                            elem?.docFront
                                          }
                                          uploadedFile={
                                            elem?.docFront?.url
                                          }
                                          tab="admin"
                                        />
                                      )}
                                    </TabPane>
                                  </Tabs>
                                ) : elem?.docFront
                                  ?.verified != "VERIFIED" &&
                                  elem?.docFront
                                    ?.verified != "REJECTED" ? (
                                  
                                  <div className="afterApproveCard-img-card">
                                    <DocumentCard
                                      url={elem?.docFront?.url}
                                      docType="FRONT"
                                      fileId={elem?.docFront?.id}
                                      showButtons={true}
                                      handleDownload={handleDownload}
                                      handlePDFView={handlePDFView}
                                      handleDocumentButton={handleDocumentButton}
                                      userType={userType}
                                    />
                                  </div>
                                ) : (
                                  <ApproverDetails
                                    modalTitle="Front proof"
                                    approverDetails={
                                      elem?.docFront
                                    }
                                    uploadedFile={
                                      elem?.docFront
                                        ?.url
                                    }
                                    tab="admin"
                                  />
                                )}
                              </div>
                            </Col>
                          ) : null}
                          {elem?.docBack?.url ? (
                            <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                              <div className="afterApproveCard">
                                {elem?.docBack?.isCompliance != null ||
                                  elem?.docBack?.verified == "VERIFIED" ||
                                  elem?.docBack?.verified == "REJECTED" ? (
                                  <Tabs
                                    defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                                    className="d-none-res "
                                  >
                                    {elem?.docBack?.isCompliance != null ? (
                                      <TabPane tab={`Approver`} key="approver">
                                        {elem?.docBack?.isCompliance == null ? (
                                          <DocumentCard
                                            url={elem?.docBack?.url}
                                            docType="BACK"
                                            fileId={elem?.docBack?.id}
                                            showButtons={true}
                                            handleDownload={handleDownload}
                                            handlePDFView={handlePDFView}
                                            handleDocumentButton={handleDocumentButton}
                                            userType={userType}
                                          />
                                        ) : (
                                          <ApproverDetails
                                            modalTitle="Back proof"
                                            approverDetails={elem?.docBack}
                                            uploadedFile={elem?.docBack?.url}
                                            tab="approver"
                                          />
                                        )}
                                      </TabPane>
                                    ) : (
                                      ""
                                    )}
                                    <TabPane tab={`Authorizer`} key="authorizer">
                                      {elem?.docBack?.verified != "VERIFIED" &&
                                        elem?.docBack?.verified != "REJECTED" ? (
                                        <DocumentCard
                                          url={elem?.docBack?.url}
                                          docType="BACK"
                                          fileId={elem?.docBack?.id}
                                          showButtons={isAuthorizer}
                                          handleDownload={handleDownload}
                                          handlePDFView={handlePDFView}
                                          handleDocumentButton={handleDocumentButton}
                                          userType={userType}
                                        />
                                      ) : (
                                        <ApproverDetails
                                          modalTitle="Back proof"
                                          approverDetails={
                                            elem?.docBack
                                          }
                                          uploadedFile={
                                            elem?.docBack?.url
                                          }
                                          tab="admin"
                                        />
                                      )}
                                    </TabPane>
                                  </Tabs>
                                ) : elem?.docBack?.verified != "VERIFIED" &&
                                  elem?.docBack?.verified != "REJECTED" ? (
                                  <div className="afterApproveCard-img-card">
                                    <DocumentCard
                                      url={elem?.docBack?.url}
                                      docType="BACK"
                                      fileId={elem?.docBack?.id}
                                      showButtons={true}
                                      handleDownload={handleDownload}
                                      handlePDFView={handlePDFView}
                                      handleDocumentButton={handleDocumentButton}
                                      userType={userType}
                                    />
                                  </div>
                                ) : (
                                  <ApproverDetails
                                    modalTitle="Back proof"
                                    approverDetails={
                                      elem?.docBack
                                    }
                                    uploadedFile={
                                      elem?.docBack
                                        ?.url
                                    }
                                    tab="admin"
                                  />
                                )}
                              </div>
                            </Col>
                          ) : null}
                        </Row>

                        <hr className="lightgrayHr" />
                        <UboComments
                          userType={userType}
                          uboDetails={uboDetails}
                          uboId={id}
                          uboAaliasName={elem?.aliasName}
                          updateComment={updateComment}
                          updateApproverComment={updateApproverComment}
                          disable={disable}
                          isApprover={isApprover}
                          isAuthorizer={isAuthorizer}
                          strydeKYBDetails={strydeKYBDetails}
                          validDocumentVerificationShareholder={validDocumentVerificationShareholder}
                          setValidDocumentVerificationUbo={setValidDocumentVerificationUbo}
                          nameAndIdVerificationShareholder={nameAndIdVerificationShareholder}
                          setNameAndIdVerificationUbo={setNameAndIdVerificationUbo}
                          amlScreeningShareholder={amlScreeningShareholder}
                          setAmlScreeningUbo={setAmlScreeningUbo}
                          adverseMediaShareholder={adverseMediaShareholder}
                          setAdverseMediaUbo={setAdverseMediaUbo}
                          otherCommentShareholder={otherCommentShareholder}
                          setOtherCommentUbo={setOtherCommentUbo}
                        />
                      </>),
                    };
                  })}
                />
              </Row>
            )}
          </Card>
        </>
      ),
    },
    {
      key: 'Company',
      label: 'Company Details',
      children: (
        <>
          <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="endtoend">
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className="bg-admin-card kyc-user-details-card" style={{ borderRadius: "0px" }}>
                <Col span={24} className="bg-admin-card-m-col p-0">
                  <Row className="justify-content-between w-100 gap-4" gutter={{ xs: 100, sm: 50, md: 50, lg: 50 }}>
                    <Col>
                      <div className="title_white">Business details</div>
                    </Col>
                    <Col>
                      {/* <Button
                        className="kyb-company-card-btn mt--30"
                        onClick={() => {
                          setDownloadModal(true);
                        }}
                      >
                        Download
                      </Button> */}
                    </Col>
                  </Row>

                  <Row gutter={{ xs: 100, sm: 50, md: 50, lg: 50 }} className="w-100 row">
                    <Col className="col-md-4">
                      <div className="subtext_white mt-4 d-flex">
                        <Image src={Company} alt="company" preview={false} />
                        <div className="px-3">
                          {strydeKYBDetails?.businessName}
                        </div>
                      </div>
                    </Col>
                    <Col className="col-md-4">
                      <div className="subtext_white mt-3 d-flex">
                        <Image src={Job} alt="company" preview={false} />
                        <div className="px-3">
                          {strydeKYBDetails?.nature}
                        </div>
                      </div>

                    </Col>
                    <Col className="col-md-4">
                      <div className="subtext_white mt-3 d-flex">
                        <Image src={Location} alt="company" preview={false} />
                        <div className="px-3">
                          {strydeKYBDetails?.address1 + ", " + strydeKYBDetails?.address2}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <div className="subtext_white mt-4 endtoend bg-admin-card-subtext-wrap">
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} className="mt-0 bg-admin-card-col8 kyb-business-details-card">
              <Card className="p-4 h-100" style={{ borderRadius: "0 0 30px 30px" }}>
                <div className="subText_medium border-left">
                  <b>Business</b>
                </div>
                <Row gutter={20}>
                  {strydeKYBDetails?.tradeLicense?.url ? (
                    <Col sm={24} md={12} lg={12} xl={8} className="my-4">
                      <div className="afterApproveCard">
                        {strydeKYBDetails?.tradeLicense
                          ?.isCompliance != null ||
                          strydeKYBDetails?.tradeLicense
                            ?.verified == "VERIFIED" ||
                          strydeKYBDetails?.tradeLicense
                            ?.verified == "REJECTED" ? (
                          <Tabs
                            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                            className="d-none-res "
                          >
                            {strydeKYBDetails?.tradeLicense
                              ?.isCompliance != null ? (
                              <TabPane tab={`Approver`} key="approver">
                                {strydeKYBDetails?.tradeLicense
                                  ?.isCompliance == null ? (
                                  <DocumentCard
                                    url={strydeKYBDetails?.tradeLicense?.url}
                                    docType="TRADE"
                                    fileId={strydeKYBDetails?.tradeLicense?.id}
                                    showButtons={true}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                  />
                                ) : (
                                  <ApproverDetails
                                    modalTitle="Trade licence proof"
                                    approverDetails={
                                      strydeKYBDetails?.tradeLicense
                                    }
                                    uploadedFile={
                                      strydeKYBDetails?.tradeLicense?.url
                                    }
                                    tab="approver"
                                  />
                                )}
                              </TabPane>
                            ) : (
                              ""
                            )}

                            <TabPane tab={`Authorizer`} key="authorizer">
                              {strydeKYBDetails?.tradeLicense
                                ?.verified != "VERIFIED" &&
                                strydeKYBDetails?.tradeLicense
                                  ?.verified != "REJECTED" ? (
                                <DocumentCard
                                  url={strydeKYBDetails?.tradeLicense?.url}
                                  docType="TRADE"
                                  fileId={strydeKYBDetails?.tradeLicense?.id}
                                  showButtons={isAuthorizer}
                                  handleDownload={handleDownload}
                                  handlePDFView={handlePDFView}
                                  handleDocumentButton={handleDocumentButton}
                                  userType={userType}
                                />
                              ) : (
                                <ApproverDetails
                                  modalTitle="Trade licence proof"
                                  approverDetails={
                                    strydeKYBDetails?.tradeLicense
                                  }
                                  uploadedFile={
                                    strydeKYBDetails?.tradeLicense?.url
                                  }
                                  tab="admin"
                                />
                              )}
                            </TabPane>
                          </Tabs>
                        ) : strydeKYBDetails?.tradeLicense
                          ?.verified != "VERIFIED" &&
                          strydeKYBDetails?.tradeLicense
                            ?.verified != "REJECTED" ? (
                          <div className="afterApproveCard-img-card">
                            <DocumentCard
                              url={strydeKYBDetails?.tradeLicense?.url}
                              docType="TRADE"
                              fileId={strydeKYBDetails?.tradeLicense?.id}
                              showButtons={true}
                              handleDownload={handleDownload}
                              handlePDFView={handlePDFView}
                              handleDocumentButton={handleDocumentButton}
                              userType={userType}
                            />
                          </div>
                        ) : (
                          <ApproverDetails
                            modalTitle="Trade licence proof"
                            approverDetails={
                              strydeKYBDetails?.tradeLicense
                            }
                            uploadedFile={
                              strydeKYBDetails?.tradeLicense
                                ?.url
                            }
                            tab="admin"
                          />
                        )}
                      </div>
                    </Col>
                  ) : null}
                  {strydeKYBDetails?.vatDoc?.url ? (
                    <Col sm={24} md={12} lg={12} xl={8} className="my-4">
                      <div className="afterApproveCard">
                        {strydeKYBDetails?.vatDoc
                          ?.isCompliance != null ||
                          strydeKYBDetails?.vatDoc
                            ?.status == "VERIFIED" ||
                          strydeKYBDetails?.vatDoc
                            ?.status == "REJECTED" ? (
                          <Tabs
                            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                            className="d-none-res "
                          >

                            {strydeKYBDetails?.vatDoc
                              ?.isCompliance != null ? (
                              <TabPane tab={`Approver`} key="approver">
                                {strydeKYBDetails?.vatDoc
                                  ?.isCompliance == null ? (
                                  <DocumentCard
                                    url={strydeKYBDetails?.vatDoc?.url}
                                    docType="VAT"
                                    fileId={strydeKYBDetails?.vatDocStatus?.id}
                                    showButtons={true}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                  />
                                ) : (
                                  <ApproverDetails
                                    modalTitle="VAT Documents"
                                    approverDetails={
                                      strydeKYBDetails?.documents
                                        ?.vatDoc
                                    }
                                    uploadedFile={
                                      strydeKYBDetails?.documents
                                        ?.vatDoc?.url
                                    }
                                    tab="approver"
                                  />
                                )}
                              </TabPane>
                            ) : (
                              ""
                            )}

                            <TabPane tab={`Authorizer`} key="authorizer">
                              {strydeKYBDetails?.vatDoc
                                ?.status != "VERIFIED" &&
                                strydeKYBDetails?.vatDoc
                                  ?.status != "REJECTED" ? (
                                <DocumentCard
                                  url={strydeKYBDetails?.vatDoc?.url}
                                  docType="VAT"
                                  fileId={strydeKYBDetails?.vatDocStatus?.id}
                                  showButtons={isAuthorizer}
                                  handleDownload={handleDownload}
                                  handlePDFView={handlePDFView}
                                  handleDocumentButton={handleDocumentButton}
                                  userType={userType}
                                />
                              ) : (
                                <ApproverDetails
                                  modalTitle="VAT Documents"
                                  approverDetails={
                                    strydeKYBDetails?.documents
                                      ?.vatDoc
                                  }
                                  uploadedFile={
                                    strydeKYBDetails?.documents
                                      ?.vatDoc?.url
                                  }
                                  tab="admin"
                                />
                              )}
                            </TabPane>
                          </Tabs>
                        ) : strydeKYBDetails?.vatDoc
                          ?.status != "VERIFIED" &&
                          strydeKYBDetails?.vatDoc
                            ?.status != "REJECTED" ? (
                          <div className="afterApproveCard-img-card">
                            <DocumentCard
                              url={strydeKYBDetails?.vatDoc?.url}
                              docType="VAT"
                              fileId={strydeKYBDetails?.vatDocStatus?.id}
                              showButtons={true}
                              handleDownload={handleDownload}
                              handlePDFView={handlePDFView}
                              handleDocumentButton={handleDocumentButton}
                              userType={userType}
                            />
                          </div>
                        ) : (
                          <ApproverDetails
                            modalTitle="VAT Documents"
                            approverDetails={
                              strydeKYBDetails?.vatDoc
                            }
                            uploadedFile={
                              strydeKYBDetails?.vatDoc
                                ?.url
                            }
                            tab="admin"
                          />
                        )}
                      </div>
                    </Col>
                  ) : null}
                  {strydeKYBDetails?.otherDocs?.[0]?.url ? (
                    <Col sm={24} md={12} lg={12} xl={8} className="my-4">
                      <div className="afterApproveCard">
                        {strydeKYBDetails?.otherDocs?.[0]
                          ?.isCompliance != null ||
                          strydeKYBDetails?.otherDocs?.[0]
                            ?.verified == "VERIFIED" ||
                          strydeKYBDetails?.otherDocs?.[0]
                            ?.verified == "REJECTED" ? (
                          <Tabs
                            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                            className="d-none-res "
                          >

                            {strydeKYBDetails?.otherDocs?.[0]
                              ?.isCompliance != null ? (
                              <TabPane tab={`Approver`} key="approver">
                                {strydeKYBDetails?.otherDocs?.[0]
                                  ?.isCompliance == null ? (
                                  <DocumentCard
                                    url={strydeKYBDetails?.otherDocs?.[0]?.url}
                                    docType="OTHER"
                                    fileId={strydeKYBDetails?.otherDocs?.[0]?.id}
                                    showButtons={true}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                  />
                                ) : (
                                  <ApproverDetails
                                    modalTitle="Other Documents"
                                    approverDetails={
                                      strydeKYBDetails?.otherDocs?.[0]
                                    }
                                    uploadedFile={
                                      strydeKYBDetails?.otherDocs?.[0].url
                                    }
                                    tab="approver"
                                  />
                                )}
                              </TabPane>
                            ) : (
                              ""
                            )}

                            <TabPane tab={`Authorizer`} key="authorizer">
                              {strydeKYBDetails?.otherDocs?.[0]
                                ?.verified != "VERIFIED" &&
                                strydeKYBDetails?.otherDocs?.[0]
                                  ?.verified != "REJECTED" ? (
                                <DocumentCard
                                  url={strydeKYBDetails?.otherDocs?.[0]?.url}
                                  docType="OTHER"
                                  fileId={strydeKYBDetails?.otherDocs?.[0]?.id}
                                  showButtons={isAuthorizer}
                                  handleDownload={handleDownload}
                                  handlePDFView={handlePDFView}
                                  handleDocumentButton={handleDocumentButton}
                                  userType={userType}
                                />
                              ) : (
                                <ApproverDetails
                                  modalTitle="Other Documents"
                                  approverDetails={
                                    strydeKYBDetails?.otherDocs?.[0]
                                  }
                                  uploadedFile={
                                    strydeKYBDetails?.otherDocs?.[0]?.url
                                  }
                                  tab="admin"
                                />
                              )}
                            </TabPane>
                          </Tabs>
                        ) : strydeKYBDetails?.otherDocs?.[0]
                          ?.verified != "VERIFIED" &&
                          strydeKYBDetails?.otherDoc
                            ?.verified != "REJECTED" ? (
                          <div className="afterApproveCard-img-card">
                            <DocumentCard
                              url={strydeKYBDetails?.otherDocs?.[0]?.url}
                              docType="OTHER"
                              fileId={strydeKYBDetails?.otherDocs?.[0]?.id}
                              showButtons={true}
                              handleDownload={handleDownload}
                              handlePDFView={handlePDFView}
                              handleDocumentButton={handleDocumentButton}
                              userType={userType}
                            />
                          </div>
                        ) : (
                          <ApproverDetails
                            modalTitle="Other Documents"
                            approverDetails={
                              strydeKYBDetails?.otherDocs?.[0]
                            }
                            uploadedFile={
                              strydeKYBDetails?.otherDocs?.[0]
                                ?.url
                            }
                            tab="admin"
                          />
                        )}
                      </div>
                    </Col>
                  ) : null}
                </Row>
                <Row gutter={20}>
                  {strydeKYBDetails && strydeKYBDetails?.moa && strydeKYBDetails?.moa.map((doc: any, index: any) => {
                    return (
                      <Col sm={24} md={12} lg={12} xl={8} className="my-4" key={index}>
                        <div className="afterApproveCard">
                          {doc?.isCompliance != null || doc?.verified === "VERIFIED" || doc?.verified === "REJECTED" ? (
                            <Tabs
                              defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                              className="d-none-res"
                            >
                              {doc?.isCompliance != null && (
                                <TabPane tab={`Approver`} key="approver">
                                  {doc?.isCompliance == null ? (
                                    <DocumentCard
                                      url={doc?.url}
                                      docType="MOA"
                                      fileId={doc?.id}
                                      showButtons={true}
                                      handleDownload={handleDownload}
                                      handlePDFView={handlePDFView}
                                      handleDocumentButton={handleDocumentButton}
                                      userType={userType}
                                    />
                                  ) : (
                                    <ApproverDetails
                                      modalTitle="MOA Documents"
                                      approverDetails={doc}
                                      uploadedFile={doc.url}
                                      tab="approver"
                                    />
                                  )}
                                </TabPane>
                              )}
                              <TabPane tab={`Authorizer`} key="authorizer">
                                {doc?.verified !== "VERIFIED" && doc?.verified !== "REJECTED" ? (
                                  <DocumentCard
                                    url={doc?.url}
                                    docType="MOA"
                                    fileId={doc?.id}
                                    showButtons={isAuthorizer}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                  />
                                ) : (
                                  <ApproverDetails
                                    modalTitle="MOA Documents"
                                    approverDetails={doc}
                                    uploadedFile={doc.url}
                                    tab="admin"
                                  />
                                )}
                              </TabPane>
                            </Tabs>
                          ) : doc?.verified !== "VERIFIED" && doc?.verified !== "REJECTED" ? (
                            <div className="afterApproveCard-img-card">
                              <DocumentCard
                                url={doc?.url}
                                docType="MOA"
                                fileId={doc?.id}
                                showButtons={true}
                                handleDownload={handleDownload}
                                handlePDFView={handlePDFView}
                                handleDocumentButton={handleDocumentButton}
                                userType={userType}
                              />
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle="MOA Documents"
                              approverDetails={doc}
                              uploadedFile={doc.url}
                              tab="admin"
                            />
                          )}
                        </div>
                      </Col>
                    );
                  })}
                </Row>

                <Row gutter={20}>
                  {strydeKYBDetails && strydeKYBDetails?.loa && strydeKYBDetails?.loa.map((doc: any, index: any) => {
                    return (
                      <Col sm={24} md={12} lg={12} xl={8} className="my-4" key={index}>
                        <div className="afterApproveCard">
                          {doc?.isCompliance != null || doc?.verified === "VERIFIED" || doc?.verified === "REJECTED" ? (
                            <Tabs
                              defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                              className="d-none-res"
                            >
                              {doc?.isCompliance != null && (
                                <TabPane tab={`Approver`} key="approver">
                                  {doc?.isCompliance == null ? (
                                    <DocumentCard
                                      url={doc?.url}
                                      docType="LOA"
                                      fileId={doc?.id}
                                      showButtons={true}
                                      handleDownload={handleDownload}
                                      handlePDFView={handlePDFView}
                                      handleDocumentButton={handleDocumentButton}
                                      userType={userType}
                                    />
                                  ) : (
                                    <ApproverDetails
                                      modalTitle="LOA Documents"
                                      approverDetails={doc}
                                      uploadedFile={doc.url}
                                      tab="approver"
                                    />
                                  )}
                                </TabPane>
                              )}
                              <TabPane tab={`Authorizer`} key="authorizer">
                                {doc?.verified !== "VERIFIED" && doc?.verified !== "REJECTED" ? (
                                  <DocumentCard
                                    url={doc?.url}
                                    docType="LOA"
                                    fileId={doc?.id}
                                    showButtons={isAuthorizer}
                                    handleDownload={handleDownload}
                                    handlePDFView={handlePDFView}
                                    handleDocumentButton={handleDocumentButton}
                                    userType={userType}
                                  />
                                ) : (
                                  <ApproverDetails
                                    modalTitle="LOA Documents"
                                    approverDetails={doc}
                                    uploadedFile={doc.url}
                                    tab="admin"
                                  />
                                )}
                              </TabPane>
                            </Tabs>
                          ) : doc?.verified !== "VERIFIED" && doc?.verified !== "REJECTED" ? (
                            <div className="afterApproveCard-img-card">
                              <DocumentCard
                                url={doc?.url}
                                docType="LOA"
                                fileId={doc?.id}
                                showButtons={true}
                                handleDownload={handleDownload}
                                handlePDFView={handlePDFView}
                                handleDocumentButton={handleDocumentButton}
                                userType={userType}
                              />
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle="LOA Documents"
                              approverDetails={doc}
                              uploadedFile={doc.url}
                              tab="admin"
                            />
                          )}
                        </div>
                      </Col>
                    );
                  })}
                </Row>
                <hr className="lightgrayHr" />
                <Form >
                  <Row className="mt-3">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
                              ? true
                              : false
                              ||userType === "SUPPORT_ENGINEER"
                        }
                        checked={
                          validDocumentVerification
                        }
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
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res  mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails
                                  ?.trusteeValidDocumentVerificationComment
                                  ? strydeKYBDetails
                                    ?.trusteeValidDocumentVerificationComment
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="validDocumentVerificationApprover"
                                rules={
                                  isApprover ?
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
                                className="checklist w-100"
                              >
                                <TextArea
                                  rows={2}
                                  placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                                  className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                                  // onInput={handleInput}
                                  id="validDocumentVerificationApprover"
                                  onChange={(e) => updateApproverComment("validDocumentVerification", e?.target?.value)}
                                  defaultValue={checkboxCommentApprover?.validDocumentVerification}
                                  disabled={!isApprover || disable }
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails
                                    ?.validDocumentVerificationComment
                                    ? strydeKYBDetails
                                      ?.validDocumentVerificationComment
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
                                    defaultValue={checkboxComment?.validDocumentVerification}
                                    disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                    onChange={(e: any) => updateComment("validDocumentVerification", e)}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Row>
                  <Row className="my-4">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
                              ? true
                              : false
                              || userType === "SUPPORT_ENGINEER"
                        }
                        checked={
                          nameAndIdVerification
                        }
                        onClick={() => {
                          setNameAndIdVerification(!nameAndIdVerification);
                        }}
                      >
                        <div className="subText mx-1 ">Name & id verification</div>
                      </Checkbox>
                      <div className="afterApproveCard">
                        <Tabs
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res  mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails
                                  ?.trusteeNameAndIdVerificationComment
                                  ? strydeKYBDetails
                                    ?.trusteeNameAndIdVerificationComment
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="nameAndIdVerificationApprover"
                                rules={
                                  isApprover ?
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
                                  defaultValue={checkboxCommentApprover?.nameAndIdVerification}
                                  onChange={(e) => updateApproverComment("nameAndIdVerification", e?.target?.value)}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails
                                    ?.nameAndIdVerificationComment
                                    ? strydeKYBDetails
                                      ?.nameAndIdVerificationComment
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
                                    defaultValue={checkboxComment?.nameAndIdVerification}
                                    onChange={(e: any) => updateComment("nameAndIdVerification", e)}
                                    disabled={isApprover || disable || userType==="SUPPORT_ENGINEER"}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Row>
                  <Row className="my-4">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
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
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res  mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails?.trusteeAmlScreeningComment
                                  ? strydeKYBDetails
                                    ?.trusteeAmlScreeningComment
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="amlScreeningApprover"
                                rules={
                                  isApprover ?
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
                                  defaultValue={checkboxCommentApprover?.amlScreening}
                                  onChange={(e) => updateApproverComment("amlScreening", e?.target?.value)}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails?.amlScreeningComment
                                    ? strydeKYBDetails?.amlScreeningComment
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
                                    defaultValue={checkboxComment?.amlScreening}
                                    onChange={(e: any) => updateComment("amlScreening", e)}
                                    disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Row>
                  <Row className="my-4">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
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
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails?.trusteeAdverseMediaComment
                                  ? strydeKYBDetails
                                    ?.trusteeAdverseMediaComment
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="adverseMediaApprover"
                                rules={
                                  isApprover ?
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
                                  defaultValue={checkboxCommentApprover?.adverseMedia}
                                  onChange={(e) => updateApproverComment("adverseMedia", e?.target?.value)}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails?.adverseMediaComment
                                    ? strydeKYBDetails?.adverseMediaComment
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
                                    defaultValue={checkboxComment?.adverseMedia}
                                    onChange={(e: any) => updateComment("adverseMedia", e)}
                                    disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </div>
                  </Row>
                  <Row className="my-4">
                    <div className="w-100">
                      <Checkbox
                        disabled={
                          isApprover
                            ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
                            : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED"
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
                          defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
                          className="d-none-res mx-4 my-2"
                        >
                          <TabPane tab={`Approver`} key="approver">
                            {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                              strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {strydeKYBDetails?.trusteeOtherCommentAndNotes
                                  ? strydeKYBDetails
                                    ?.trusteeOtherCommentAndNotes
                                  : "N/A"}
                              </div>
                            ) : (
                              <Form.Item
                                name="otherCommentAndNotesApprover"
                                rules={
                                  isApprover ?
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
                                  defaultValue={checkboxCommentApprover?.otherCommentAndNotes}
                                  onChange={(e) => updateApproverComment("otherCommentAndNotes", e?.target?.value)}
                                  disabled={!isApprover || disable}
                                />
                              </Form.Item>
                            )}
                          </TabPane>
                          <TabPane tab={`Authorizer`} key="authorizer">
                            <div className="w-100">
                              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                                <div className="commentBox mt-2 mx-2">
                                  {strydeKYBDetails?.otherCommentAndNotes
                                    ? strydeKYBDetails?.otherCommentAndNotes
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
                                    defaultValue={checkboxComment?.otherCommentAndNotes}
                                    onChange={(e: any) => updateComment("otherCommentAndNotes", e)}
                                    disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
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
              </Card>
            </Col>
          </Row>

        </>
      ),
    },
  ];
  

  const generateFatcaColumn = (label: any, value: any) => {
    return (
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
    );
  };

  let endComment = '';
  let approverEndComment = '';
  if (isApprover) {
    if (activeTab === 'Representative') {
      endComment = strydeKYBDetails?.trusteeRepComment ?? strydeKYBDetails?.trusteeComment;
    } else if (activeTab === 'UBO') {
      endComment = getUboComment(strydeKYBDetails?.ubo, activeUboTab, 'trusteeComment')
    } else {
      endComment = strydeKYBDetails?.trusteeComment;
    }
  } else {
    if (strydeKYBDetails?.verificationStatus == 'REJECTED') {
      endComment = strydeKYBDetails?.comment;
    } else if (activeTab === 'Representative') {
      endComment = strydeKYBDetails?.repComment ?? strydeKYBDetails?.comment;
      approverEndComment = strydeKYBDetails?.trusteeRepComment ?? strydeKYBDetails?.trusteeComment;
    } else if (activeTab === 'UBO') {
      endComment = getUboComment(strydeKYBDetails?.ubo, activeUboTab, 'endComment')
      approverEndComment = getUboComment(strydeKYBDetails?.ubo, activeUboTab, 'trusteeComment')
    } else {
      endComment = strydeKYBDetails?.comment;
      approverEndComment = strydeKYBDetails?.trusteeComment;
    }
  }
  return (
    <div className="m-main-body-section scrollbar-container">
      <DefaultLayout
        page="stryde_kyb_management"
        loading={loading}
        TitleText="Stryde KYB Details"
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
              <b>Stryde KYB details</b>
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
                    navigate(StrydeKYBManagementList);
                  }}
                >
                  Management
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="cursor"
                  onClick={() => {
                    navigate(StrydeKYBManagementList);
                  }}
                >
                  Stryde KYB management
                </Breadcrumb.Item>
                <Breadcrumb.Item>Stryde KYB details</Breadcrumb.Item>
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
                      {strydeKYBDetails?.repName}
                    </div>
                    <div className="subtext_white mt-3 ">
                      {
                        COMPANY_ROLE[strydeKYBDetails?.repRole]
                      }
                    </div>
                    <hr className="my-4" />
                  </Col>
                </div>
                <div className="d-flex flex-wrap">
                  <div className="mr-20">
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Emailicon} alt="email" preview={false} />
                      <Tooltip title={strydeKYBDetails?.email} overlayClassName="custom-tooltip">
                        <span className="ml-4 overflowText ">
                          {strydeKYBDetails?.email}
                        </span>
                      </Tooltip>
                    </div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Phone} alt="phone" preview={false} />
                      <span className="ml-4 overflowText">
                        {strydeKYBDetails?.contactNumber}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Nation} alt="country" preview={false} />
                      <span className="ms-3 overflowText">
                        {strydeKYBDetails?.countryName ?? strydeKYBDetails?.country}
                      </span>
                      <div className="mx-2">
                        <div className="px-1 bluecard-flag">
                          {(strydeKYBDetails?.country) ? (
                            <span
                              className={`fi fi-${String(strydeKYBDetails.country).toLowerCase()}`}
                            />
                          ) : "--"}
                        </div>
                      </div>
                    </div>
                    <div className="subtext_white mt-3 d-flex">
                      <Image src={Individual} alt="type" preview={false} />
                      <span className="ml-4 overflowText">
                        {ENTITY_TYPE[strydeKYBDetails?.entityType]}
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
        </Row>
        {/* Verify KYC Card */}
        <ResyncStrydeKybKycCard
          setSearchKybModal={setSearchKybModal}
          digiScreeningPayload={digiScreeningPayload}
          digiScreeningResult={digiScreeningResult}
          strydeAlias={strydeAlias}
          entityType={strydeKYBDetails?.entityType}
          formCheckKyB={formCheckKyB}
          riskAssessment={riskAssessment}
          riskAssessmentPayload={riskAssessmentPayload}
          uboDetails={uboDetails}
          uboPayload={uboPayload}
          uboResult={uboResult}
          strydeResyncPayload={strydeResyncPayload}
        />

        {/* KYB Risk Assesment Card */}
        <RiskAssesmentCard riskAssessment={riskAssessment} />
        {/* <Card className="mb-4 mt-3 details-card">
          <div className="subText_medium border-left">
            <b>Address Details</b>
          </div>
          <AddressDetails AddressData={strydeKYBDetails?.business} type="kyb" />
        </Card> */}
        <Card className="mb-4 mt-3 details-card">
          <div className="subText_medium border-left">
            <b>FATCA Details</b>
          </div>
          <Row className="mt-3 row">
            <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              {generateFatcaColumn("Are you registered or incorporated Tax resident of any other country other than UAE?", kybFATCACountries && kybFATCACountries?.length > 0 ? "Yes" : "No")}
            </Row>
            
            {kybFATCACountries && kybFATCACountries?.length > 0 && (<>
              {kybFATCACountries.map((elem: any) => {
                return (<>
                  <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                    {generateFatcaColumn("Tax Residency country.", elem?.country)}
                  </Row>
                  <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                    {generateFatcaColumn("Do you have a Tax identification number?", elem?.hasTin ? "Yes" : "No")}
                  </Row>
                  {elem?.hasTin ? (
                    <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                      {generateFatcaColumn("Tax identification number", elem?.tinNumber)}
                    </Row>
                  ) : (
                    <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                      {generateFatcaColumn("Reason for no TIN Number", elem?.noTinReason)}
                    </Row>
                  )}
                </>)
              })}


              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col >
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Do you have multiple Jurisdiction where your company registered? </b></Text>
                    <Text> <b>{kybFATCACountries?.length > 0 ? "Yes" : "No"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              {kybFATCACountries?.hasMultipleJurisdictionCompany === 'yes' && (
                <>
                  <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                    <Col >
                      <Space direction="vertical">
                        <Text type="secondary"> <b>How many country?.</b></Text>
                        <Text> <b>{kybFATCACountries?.kybNumberOfCountry ?? "---"}</b> </Text>
                      </Space>
                    </Col>
                  </Row>
                  {renderMultipleJurisdictionRows()}
                </>
              )}
            </>)}
            <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col >
                <Space direction="vertical">
                  <Text type="secondary"> <b>Are you a Passive NFE?</b></Text>
                  <Text> <b>{strydeKYBDetails?.isPassiveNfe ? "Yes" : "No"}</b> </Text>
                </Space>
              </Col>
            </Row>
            {strydeKYBDetails?.isPassiveNfe && (<>
              <div className="subText_medium border-left">
                <b>Controllers</b>
              </div>
              {(strydeKYBDetails?.isFatcaAgree && kybFATCAColtrollers?.length > 0) && (
                <Tabs
                  className="w-100"
                  type="card"
                  items={kybFATCAColtrollers?.map((item: any, i: any) => {
                    const id = String(i + 1);
                    return {
                      label: `Controller ${id}`,
                      key: id,
                      children: (<>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center justify-content-between">
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Full name</b></Text>
                              <Text> <b>{item?.name ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Date of birth</b></Text>
                              <Text> <b>{item?.dob ? dayjs(item?.dob).format("DD-MM-YYYY") : "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Country of Birth</b></Text>
                              <Text> <b>{item?.birthCountry ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center justify-content-between">
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Current residence address </b></Text>
                              <Text> <b>{item?.address ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Country</b></Text>
                              <Text> <b>{item?.country ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Country of Tax Residence</b></Text>
                              <Text> <b>{item?.taxCountry ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center justify-content-between">
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Do you have a Tax identification number</b></Text>
                              <Text> <b>{toTitleCase(item?.tinNumber) ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          {item?.hasControllerTIN === 'yes' && (
                            <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                              <Space direction="vertical">
                                <Text type="secondary"> <b>Tax identification number</b></Text>
                                <Text> <b>{item?.tinNumber ?? "---"}</b> </Text>
                              </Space>
                            </Col>
                          )}
                          {item?.hasControllerTIN === 'no' && (

                            <Col xs={24} sm={12} md={12} lg={6}>
                              <Space direction="vertical">
                                <Text type="secondary"> <b>Reason for no TIN Number</b></Text>
                                <Text> <b>{item?.noTinReason === "countryNotissueTINs" ? "Country/ Jurisdiction does not issue TINs." : item?.controllerNoTinReason === "countryNotRequirToProvideTIN" ? "Country/ Jurisdiction does not require me to provide TIN." : item?.controllerNoTinReason === "unableToObtainTIN" ? "Unable to obtain a TIN." : ""}</b> </Text>
                              </Space>
                            </Col>
                          )}
                          <Col xs={24} sm={12} md={12} lg={6}></Col>
                        </Row>
                      </>),
                    };
                  })}
                />
              )}
            </>)}
            <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary"> <b>I agree to the FATCA/CRS declaration </b></Text>
                  <Text> <b> {strydeKYBDetails?.isFatcaAgree && strydeKYBDetails?.isFatcaAgree === true ? "Yes" : strydeKYBDetails?.isFatcaAgree && strydeKYBDetails?.isFatcaAgree === false ? "No" : "---"}</b>
                  </Text>
                </Space>
              </Col>
            </Row>
          </Row>
        </Card>
        {/* KYB UBO */}
        <Tabs type="card" activeKey={activeTab} className="kyb_tabs" defaultActiveKey={activeTab} items={items} onChange={onTabChange} />
        <Card className="mb-4 mt-3 details-card">
          <div className="subText_medium border-left mt-4">
            <b>Client risk rating</b>
          </div>
          <Row>
            <Radio.Group
              onChange={handleDropdownChange}
              value={Number(dropDownValue)}
              className="mt-3 client-risk-classification-radio-btn"
            >
              <Radio value={1} disabled={userType === "SUPPORT_ENGINEER"}>Low risk</Radio>
              <Radio value={2} disabled={userType === "SUPPORT_ENGINEER"}>Medium risk </Radio>
              <Radio value={3} disabled={userType === "SUPPORT_ENGINEER"}>High risk</Radio>
            </Radio.Group>
          </Row>
          {isAuthorizer && approverEndComment && approverEndComment != null && approverEndComment != undefined &&
            (
              <div>
                <hr className="lightgrayHr mb-4" />
                <div className="subText_medium border-left">
                  <b>Approver Comment</b>
                </div>
                <div>
                  <div className="finalCommentTime stepDetails_medium_sub my-3">
                    {moment(strydeKYBDetails?.trusteeRepUpdatedAt).format(
                      "DD MMMM YYYY hh:mm A"
                    )}
                  </div>
                  <div className="stepDetails_medium_sub">
                    {approverEndComment}
                  </div>
                </div>
              </div>
            )}
          {['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.verificationStatus) ? (
            <div>
              <hr className="lightgrayHr mb-4" />
              <div className="subText_medium border-left">
                <b>Authorizer Comment</b>
              </div>
              <div>
                <div className="finalCommentTime stepDetails_medium_sub my-3">
                  {moment(strydeKYBDetails?.updatedAt).format(
                    "DD MMMM YYYY hh:mm A"
                  )}
                </div>
                <div className="stepDetails_medium_sub">
                  <p>{endComment}</p>
                </div>
              </div>
            </div>
          ) : null}
          {(
            !['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.verificationStatus)
            && (
              (isApprover
                && !['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
              ) || !isApprover
            ) && verificationPendingCheck
          ) ? (
            <Row className={userType === "SUPPORT_ENGINEER"?"d-none":"center_res btn-groups"}>
              <Button
                className={`${(activeTab != 'Company' || isAllMoaDocApproved || isAllLoaDocApproved) && isAllChecklistChecked() && isAllDocumentApproved(strydeKYBDetails) ? "rounded" : "rounded disabled"}`}
                htmlType="submit"
                onClick={() => {
                  if ((activeTab != 'Company' || isAllMoaDocApproved || isAllLoaDocApproved) && isAllChecklistChecked() && isAllDocumentApproved(strydeKYBDetails)) openApproveModal();
                }}
                loading={loading}
              >
                Approve KYB
              </Button>
              <Button
                className={isAllChecklistChecked() ? "rounded_reject_light" : 'rounded_reject_light disabled'}
                onClick={() => {
                  if (isAllChecklistChecked()) openRejectModal();
                }}
                loading={loading}
              >
                Reject KYB
              </Button>
              <Button
                className="rounded_reject_light"
                htmlType="submit"
                onClick={() => {
                  setHoldModal(true);
                }}
              >
                Hold KYB
              </Button>
            </Row>
          ) : <>
            {(
              !['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
              && isApprover
            ) ?
              (<div>
                <hr className="lightgrayHr mb-4" />
                <div className="subText_medium border-left">
                  <b>Approver Comment</b>
                </div>
                <div>
                  <div className="finalCommentTime stepDetails_medium_sub my-3">
                    {moment(strydeKYBDetails?.trusteeRepUpdatedAt).format(
                      "DD MMMM YYYY hh:mm A"
                    )}
                  </div>
                  <div className="stepDetails_medium_sub">
                    {endComment}
                  </div>
                </div>
              </div>) : (!['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.verificationStatus)
                && !isApprover) ?
                <div>
                  <hr className="lightgrayHr mb-4" />
                  <div className="subText_medium border-left">
                    <b>Authorizer Comment</b>
                  </div>
                  <div>
                    <div className="finalCommentTime stepDetails_medium_sub my-3">
                      {moment(strydeKYBDetails?.updatedAt).format(
                        "DD MMMM YYYY hh:mm A"
                      )}
                    </div>
                    <div className="stepDetails_medium_sub">
                      {endComment}
                    </div>
                  </div>
                </div> : null
            }
          </>}
        </Card>
      </DefaultLayout>
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
          className="px-4 py-2"
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
              placeholder="Please  your comment"
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
                getStrydeKybDetails();
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
        open={CommentModal}
        title={modalTitle}
        form={formStryedDocumentApprove}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={handleApprove}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}
      />

      {/* Reject Document */}
      <CommentModalForm
        open={CommentModalReject}
        title={`Reject ${modalTitle}`}
        form={formStryedDocumentReject}
        isErrorTitle
        comment={comment}
        onCommentChange={setComment}
        onSubmit={handleReject}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}
      />

      {/* Approve KYB */}
      <CommentModalForm
        open={ApproveModal}
        title="Approve KYB Request"
        form={formStryedApproveKYB}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={approveKYB}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
      />

      {/* Reject KYB */}
      <CommentModalForm
        open={RejectModal}
        title="Reject KYB Request"
        isErrorTitle
        form={formStryedRejectKYB}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={rejectKYB}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
        loading={loading}
      />

      {/* Hold KYB */}
      <CommentModalForm
        open={holdModal}
        title="Hold KYB Request"
        form={formStryedHoldKYB}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={holdKYB}
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
            Download All KYB Information
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <div className="stepDetails fw-400 mx-3 py-2">
          Choose which data you want to download now?
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
                downloadKYBDetails();
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

      {/* KYB Search again Modal */}
      <SearchAgainStrydeKybKycModal
        headKYBModal={"KYB"}
        searchKybModal={searchKybModal}
        setSearchKybModal={setSearchKybModal}
        strydeAlias={strydeAlias}
        formCheckKyB={formCheckKyB}
        entityType={strydeKYBDetails?.entityType}
        setDropDownValue={setDropDownValue}
        digiScreeningPayload={digiScreeningPayload}
        setDigiScreeningPayload={setDigiScreeningPayload}
        setDigiScreeningResult={setDigiScreeningResult}
        setRiskAssessment={setRiskAssessment}
        setRiskAssessmentPayload={setRiskAssessmentPayload}
        countryList={countryList}
        brithPlaceList={brithPlaceList}
        uboDetails={uboDetails}
        setUboPayload={setUboPayload}
        setUboResult={setUboResult}
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

const UboComments = (props: any) => {
  const {
    userType,
    uboDetails,
    updateComment,
    uboId,
    uboAaliasName,
    updateApproverComment,
    disable,
    isApprover,
    isAuthorizer,
    strydeKYBDetails,
    validDocumentVerificationShareholder,
    setValidDocumentVerificationUbo,
    nameAndIdVerificationShareholder,
    setNameAndIdVerificationUbo,
    amlScreeningShareholder,
    setAmlScreeningUbo,
    adverseMediaShareholder,
    setAdverseMediaUbo,
    otherCommentShareholder,
    setOtherCommentUbo
  } = props

  return (<Form>
    <Row className="mt-3">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
              : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED"
                ? true
                : false

                || userType === "SUPPORT_ENGINEER"
          }
          checked={validDocumentVerificationShareholder}
          onClick={() => {
            setValidDocumentVerificationUbo(!validDocumentVerificationShareholder);
          }}
        >
          <div className="subText mx-1 ">
            Valid document verification
          </div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
            className="d-none-res  mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {getUboComment(uboDetails, uboId, 'trusteeValidDocumentVerificationComment', true)}
                </div>
              ) : (
                <Form.Item
                  name="validDocumentVerificationApprover"
                  rules={
                    isApprover ?
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
                  className="checklist w-100"
                >
                  <TextArea
                    rows={2}
                    placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                    className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                    id="validDocumentVerificationApprover"
                    onChange={(e) => updateApproverComment("validDocumentVerification", e?.target?.value, uboAaliasName)}
                    defaultValue={getUboComment(uboDetails, uboId, 'trusteeValidDocumentVerificationComment')}
                    disabled={!isApprover || disable}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                  strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {getUboComment(uboDetails, uboId, 'validDocumentVerificationComment', true)}
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
                      id="validDocumentVerification"
                      defaultValue={getUboComment(uboDetails, uboId, 'validDocumentVerificationComment')}
                      disabled={isApprover || disable || userType==="SUPPORT_ENGINEER"}
                      onChange={(e: any) => updateComment("validDocumentVerification", e, uboAaliasName)}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
    <Row className="my-4">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
              : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={nameAndIdVerificationShareholder}
          onClick={() => {
            setNameAndIdVerificationUbo(!nameAndIdVerificationShareholder);
          }}
        >
          <div className="subText mx-1 ">Name & id verification</div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
            className="d-none-res  mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {getUboComment(uboDetails, uboId, 'trusteeNameAndIdVerificationComment', true)}
                </div>
              ) : (
                <Form.Item
                  name="nameAndIdVerificationApprover"
                  rules={
                    isApprover ?
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
                    id="nameAndIdVerificationApprover"
                    defaultValue={getUboComment(uboDetails, uboId, 'trusteeNameAndIdVerificationComment')}
                    onChange={(e) => updateApproverComment("nameAndIdVerification", e?.target?.value, uboAaliasName)}
                    disabled={!isApprover || disable}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                  strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {getUboComment(uboDetails, uboId, 'nameAndIdVerificationComment', true)}
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
                      id="nameAndIdVerification"
                      defaultValue={getUboComment(uboDetails, uboId, 'nameAndIdVerificationComment')}
                      onChange={(e: any) => updateComment("nameAndIdVerification", e, uboAaliasName)}
                      disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
    <Row className="my-4">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
              : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={amlScreeningShareholder}
          onClick={() => {
            setAmlScreeningUbo(!amlScreeningShareholder);
          }}
        >
          <div className="subText mx-1 ">AML screening</div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
            className="d-none-res  mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {getUboComment(uboDetails, uboId, 'trusteeAmlScreeningComment', true)}
                </div>
              ) : (
                <Form.Item
                  name="amlScreeningApprover"
                  rules={
                    isApprover ?
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
                    id="amlScreeningApprover"
                    defaultValue={getUboComment(uboDetails, uboId, 'trusteeAmlScreeningComment')}
                    onChange={(e) => updateApproverComment("amlScreening", e?.target?.value, uboAaliasName)}
                    disabled={!isApprover || disable}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                  strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {getUboComment(uboDetails, uboId, 'amlScreeningComment', true)}
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
                      id="amlScreening"
                      defaultValue={getUboComment(uboDetails, uboId, 'amlScreeningComment')}
                      onChange={(e: any) => updateComment("amlScreening", e, uboAaliasName)}
                      disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
    <Row className="my-4">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
              : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={adverseMediaShareholder}
          onClick={() => {
            setAdverseMediaUbo(!adverseMediaShareholder);
          }}
        >
          <div className="subText mx-1 ">Adverse media</div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
            className="d-none-res mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {getUboComment(uboDetails, uboId, 'trusteeAdverseMediaComment', true)}
                </div>
              ) : (
                <Form.Item
                  name="adverseMediaApprover"
                  rules={
                    isApprover ?
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
                    id="adverseMediaApprover"
                    defaultValue={getUboComment(uboDetails, uboId, 'trusteeAdverseMediaComment')}
                    onChange={(e) => updateApproverComment("adverseMedia", e?.target?.value, uboAaliasName)}
                    disabled={!isApprover || disable}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                  strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {getUboComment(uboDetails, uboId, 'adverseMediaComment', true)}
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
                      id="adverseMedia"
                      defaultValue={getUboComment(uboDetails, uboId, 'adverseMediaComment')}
                      onChange={(e: any) => updateComment("adverseMedia", e, uboAaliasName)}
                      disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
    <Row className="my-4">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? ['VERIFIED', 'REJECTED'].includes(strydeKYBDetails?.trusteeVerificationStatus)
              : strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={otherCommentShareholder}
          onClick={() => {
            setOtherCommentUbo(!otherCommentShareholder);
          }}
        >
          <div className="subText mx-1 ">Other comments/notes</div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={isAuthorizer ? "authorizer" : "approver"}
            className="d-none-res mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {getUboComment(uboDetails, uboId, 'trusteeOtherCommentAndNotes', true)}
                </div>
              ) : (
                <Form.Item
                  name="otherCommentAndNotesApprover"
                  rules={
                    isApprover ?
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
                    id="otherCommentAndNotesApprover"
                    defaultValue={getUboComment(uboDetails, uboId, 'trusteeOtherCommentAndNotes')}
                    onChange={(e) => updateApproverComment("otherCommentAndNotes", e?.target?.value, uboAaliasName)}
                    disabled={!isApprover || disable}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {strydeKYBDetails?.verificationStatus === "VERIFIED" ||
                  strydeKYBDetails?.verificationStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {getUboComment(uboDetails, uboId, 'otherCommentAndNotes', true)}
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
                      id="otherCommentAndNotes"
                      defaultValue={getUboComment(uboDetails, uboId, 'otherCommentAndNotes')}
                      onChange={(e: any) => updateComment("otherCommentAndNotes", e, uboAaliasName)}
                      disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
  </Form>)
}

function getUboComment(uboData: any, uboId: string, commentKey: string, showNA = false) {
  return uboData?.[parseInt(uboId) - 1]?.[commentKey] ?? (showNA ? 'N/A' : '');
}

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
  switch(docType) {
    case 'FRONT':  
      title = 'Front proof'
      buttonTitle = 'Front proof';
      break;
    case 'BACK':
      title = 'Back proof'
      buttonTitle = 'Back proof';
      break;
    case 'TRADE':
      title = 'Trade licence proof'
      buttonTitle = 'Trade licence proof';
      break;
    case 'VAT':
      title = 'VAT Document'
      buttonTitle = 'VAT Document';
      break;
    case 'OTHER':
      title = 'Other Document'
      buttonTitle = 'Other Document';
      break;
    case 'MOA':
      title = 'MOA Document'
      buttonTitle = 'MOA Document';
      break;
    case 'LOA':
      title = 'LOA Document'
      buttonTitle = 'LOA Document';
      break;
    case 'ADDRESS':
      title = 'Address Proof'
      buttonTitle = 'Address proof';
      break;
    case 'PASSPORT_FRONT':
      title = DOCUMENT_TYPE.PASSPORT + ' Front';
      buttonTitle = DOCUMENT_TYPE.PASSPORT + ' front Proof';
      break;
    case 'PASSPORT_BACK':
      title = DOCUMENT_TYPE.PASSPORT + ' Back';
      buttonTitle = DOCUMENT_TYPE.PASSPORT + ' back Proof';
      break
    case 'EMIRATES_ID_FRONT':
      title = DOCUMENT_TYPE.EMIRATES_ID + ' Front';
      buttonTitle = DOCUMENT_TYPE.EMIRATES_ID + ' front Proof'
      break
    case 'EMIRATES_ID_BACK':
      title = DOCUMENT_TYPE.EMIRATES_ID + ' Back';
      buttonTitle = DOCUMENT_TYPE.EMIRATES_ID + ' back Proof';
      break
    case 'NATIONAL_ID_FRONT':
      title = DOCUMENT_TYPE.NATIONAL_ID + ' Front';
      buttonTitle = DOCUMENT_TYPE.NATIONAL_ID + ' front Proof';
      break
    case 'NATIONAL_ID_BACK':
      title = DOCUMENT_TYPE.NATIONAL_ID + ' Back';
    buttonTitle = DOCUMENT_TYPE.NATIONAL_ID + ' back Proof';
      break
  }

  if (!url) {
    return null;
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
              <div className="ml-2" onClick={() => url && handleDownload(url,url.includes(".pdf"))} >
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

export default StrydeKYBDetails;
