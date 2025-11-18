import HistorySteps from "./HistorySteps";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col, 
  Image,
  Modal,
  Row,
  message, 
  Tooltip,
  Input, 
  Form,
  Upload,
  Spin,
  Popover,
  UploadProps,
  Checkbox, 
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Page } from "react-pdf"; 
// @ts-ignore 
import Pdf from "../../assets/img/pdfview.svg";
import LeftArrow from "../../assets/img/leftArrow.svg";
import MoveTo from "../../assets/img/moveTo.svg";
import WhiteUserFull from "../../assets/img/WhiteUserFull.svg";
import Delete from "../../assets/img/delete.svg";
import PlusUpload from "../../assets/img/PlusUpload.svg";
import Tick from "../../assets/img/circle_orange.svg";
import Doc_large from "../../assets/img/Doc_large.svg"; 
import WhiteEmail from "../../assets/img/white_email.svg";
import Globe from "../../assets/img/white_globe.svg";
import Flag from "../../assets/img/whiteFlag.svg";
import Payment from "../../assets/img/white_payment.svg";
import Job from "../../assets/img/job_white.svg";
import UserHalf from "../../assets/img/userHalf.svg";
import Cheque from "../../assets/img/Cheque.svg";
import Reference from "../../assets/img/Reference.svg";
import CommentImg from "../../assets/img/Comment.svg";
import Suitcase from "../../assets/img/sellerJob.svg";
import Doc from "../../assets/img/doc.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import EditIcon from "../../assets/img/EditIcon.svg";
import { useEffect, useState } from "react";
import Itemdelete from "../../assets/img/ItemDeleteIcon.svg";
import Warning from "../../assets/img/warningicon.svg";
import { virtualAccountDetails } from "../../services/admin";
import moment from "moment";
import { 
  AuthUserTypes,
  CHEQUE_USER_TYPE_TEXT,
  MC_TYPE,
  PLATFORM_CHARGE_APPLIED_ON,
  USER_TYPE_TEXT,
  acceptedFileExtension, 
  beforeUploadFile, 
  contractStatusMap,
  getFormattedValue,
  getLocalStorage,
  moneyFormat,
  toTitleCase,  
} from "../Common/Constants"; 
import {  AdminChequeList, ChequeAddFund , Cheques, EditCheque, EscrowTermsandCondition } from "../Common/RouteConst";

import { AuthTitle, BoldText, NormalText, SmallText } from "../ui-elements/TextRepo";
import approved from "../../assets/img/Successpopupicon.svg";
import rejected from "../../assets/img/reject.svg";
import DefaultLayout from "../Common/DefaultLayout";
import CustomChequeDetails from "./customCheque"; 

import { acceptTransaction, deleteCheque, getChequeDetails, getChequeHistoryDetails, insertCheque, insertMultiCheque,  receiveFundMC,  updateChequeDetail } from "../../services/cheque";
import TextArea from "antd/es/input/TextArea";
import rejects from "../../assets/modals/rejected.gif"; 
import PDFPreview from "../Common/PdfPreviewIcon";
import PdfPreviewModal from "../Models/PdfPreviewModal";
// import Delete from "../../assets/img/delete.svg";
import { deleteSignFile } from "../../services/user";
import Dragger from "antd/es/upload/Dragger"; 
import CounterSignature from "./CounterSignature";
import { SecondaryOutLineButton, ViewButton } from "../ui-elements/ButtonRepo";
import SellerDocuments from "./sellerDocument"; 
import ChequeDocument from "./chequeDocument";
import ChequeDetailCard from "./ChequeDetailCard";
import SourceOfFundDetails from "../User/NewTransaction/sourceOfFundDetails";
import SourceOfFunds from "../User/NewTransaction/SourceOfFunds";
import Meta from "antd/lib/card/Meta";
import CountryInfoItem from "../Common/CountryInfoItem";

const ChequeDetails = ():any => {
  const navigate = useNavigate();  
  // const antIcon = <LoadingOutlined style={{ fontSize: 30, color:"#013399" }} spin />;
  const { chequeAlias: id} = useParams();
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const userData = JSON.parse(getLocalStorage("auth")!); 
  const [fromParty, setFromParty] = useState<any>({});
  const [toParty, setToParty] = useState<any>({});
  const [bankDetails, setBankDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [chequeHistory, setContractHistory] = useState<any>({});
  const [chequeDetail, setChequeDetail] = useState<any>({});
  const [customAttachmentUrls, setCustomAttachmentUrls] = useState<any>([]);   
  const [imagUrl, setImagUrl] = useState<any>("");  
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false); 
  const [isUserVerifiedCheckModal, setIsUserVerifiedCheckModal] = useState<boolean>(false);
  const [unverifiedUsers, setUnverifiedUsers] = useState<string[]>([]);
    
  const [taxDetails,setTaxDetails]= useState<any>({});
  const [customContractList, setCustomContractList] = useState<any>(); 
  const [error, setError] = useState({ status: false, message: "" });
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [currentChequeDetail, setCurrentChequeDetail] = useState<any>({})
  const [viewChequeDetail, setViewChequeDetail] = useState(false)
  const [chequeDocumentIsLoading, setChequeDocumentIsLoading] = useState(true)
  // const [primaryAccount,setPrimaryAccount] = useState<any>("");
  
  const [counterParty, setCounterParty] = useState<any>();
  const [sellerVerificationHistory, setSellerVerificationHistory] = useState<any>([]);

  const [disableBtn, setDisableBtn] = useState<boolean>(false); 
  const [releaseModal,setReleaseModal] = useState(false);
  

  const [deletechequeModel,setDeletechequeModel] = useState(false);
  const [selectedCheque,setSelectedCheque] = useState<number>(-1);
  
  const [showAddChequeModal, setShowAddChequeModal] = useState(false);
  const [isSellerVerified, setIsSellerVerified] = useState(false);
  const [loader, setLoader] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [uploadedChequeFile, setUploadedChequeFile] = useState<any>(null);

  const [form] = Form.useForm();
  const [feesForm] = Form.useForm();

  const [managerChequeList, setManagerChequeList] = useState<any>([]);

  const [sourceOfFundIds, setSourceOfFundIds] = useState<any>([]);
  const [sourceOfFundUrls, setSourceOfFundUrls] = useState<any>([]);

  const [signature, setSignature] = useState("");
  const [signatureId, setSignatureId] = useState("");
  const [buttonStatus, setButtonStatus] = useState("accept");
  const [showRejectWarning, setShowRejectWarning] = useState(false);
  const [afterModal, setAfterModal] = useState(false);
  const [afterText, setAftertext] = useState("");

  const [buyervirtualAccount, setBuyerVirtualAccount] = useState<any>([]);

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  useEffect(() => {
    const textContainer:any = document.getElementById("textContainer");
    const readMoreButton:any = document.getElementById("readMoreButton");

    if (textContainer && textContainer.textContent.length > 180) {
      const truncatedText = textContainer.textContent.slice(0, 180);
      textContainer.innerHTML = truncatedText;
      readMoreButton.style.display = "inline";
    }  

    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  const local = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  
   
  const getContractStages = () => {
    if (!id) {
      return;
    }
    getChequeHistoryDetails(id, userAlias)
      .then((response) => {
          const historyList: any = {};
          response.data.map((item: any) => {
              const chequeAction = item.chequeAction
              historyList[chequeAction.split(" ").join("_")] = {
                name: item.name,
                updatedAt: item.updatedAt, 
                updatedBy:item?.updatedBy,
                comment: item?.comment,
                role: item?.role,
                userrole: item?.userrole,
              }; 
              return item;
            }
          );
          setContractHistory(historyList);
       })
       .catch(() => {
        message.error("Could not fetch details. Please try again later!");
       });
  }

  const CustomTooltip = ({
    text = "",
    maxLength = 75,
    overlayClassName = "",
  }) => {
    const truncatedText =
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  
    return (
      <Tooltip title={text} overlayClassName={overlayClassName}>
        <span className="Status">{truncatedText}</span>
      </Tooltip>
    );
  };
  
  // const goBack = () => {
  //   if([AuthUserTypes.TRUSTEE,AuthUserTypes.AUTHORIZER,AuthUserTypes.ADMIN].includes(userType)) {
  //     navigate(AdminChequeList, { replace: true });
  //   } else {
  //     navigate(AdminChequeList, { replace: true });
  //   }
  // };
      const goBack = () => {
      if (userType === "USER") {
        navigate(Cheques, { replace: true });
      } else if ([AuthUserTypes.TRUSTEE, AuthUserTypes.AUTHORIZER, AuthUserTypes.ADMIN].includes(userType)) {
        navigate(AdminChequeList, { replace: true });
      } else {
      navigate(AdminChequeList, { replace: true });
      }
    };
  
  const addFund = (id: any, userAlias: any) => {
    
    if(chequeDetail?.buyerAlias !== userAlias && chequeDetail?.transactionType !== "RECEIVE"){
      message.warning("You are not authorized to perform this operation.")
      return;
    }
    navigate(Cheques + "/" + id + ChequeAddFund, {
      state: {
        contractId: id,
        userAlias: userAlias,
        buyerDetail: toParty
      },
      replace: true
    });
  };


  const onEditTransaction = () => {
    if(id){
      navigate(`${EditCheque}/${id}`, { replace: true });
    }
  }
 
  const handlePDFView = (url: any) => {
    if (url) {
      setImagUrl(url);
      setverifyVisible(true);
    }
  };
 
    
  const uploadProps: UploadProps = {
    name: "file",
    headers: { authorization: `Bearer ${Token}` },
    action: `${REACT_APP_SERVER_URL}/api/v1/contracts/uploadSignature`,
    accept: acceptedFileExtension,
    beforeUpload: (file) => {
      const validationResult = beforeUploadFile(file, "");
      if (validationResult === true) {
        setLoader(true);
        return true;
      }
      message.error(validationResult);
      return Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      const { status, response } = info.file;
      if (status === 'done') {
        setUploadedChequeFile(response);
        setLoader(false);
      } else if (status === 'error') {
        setLoader(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  }



  const deleteDocument = (fileID: number) => {
    setLoader(true)
    setDisableBtn(true);
    deleteSignFile({ fileID })
      .then(() => {
        setUploadedChequeFile(null)
      })
      .catch(() => message.error('Error deleting file'))
      .finally(() => {
        setDisableBtn(false)
        setLoader(false)
      })
  }

  
  const editChequeDetals = (i : number ) => {
    const cheque =  managerChequeList[i];
    
    setShowAddChequeModal(true)
    setSelectedCheque(i);
    form.setFieldsValue({
      beneficiaryName : cheque?.beneficiaryName,
      amount : cheque?.amount,
      comment : cheque?.comment,
      buyerRequested : cheque?.buyerRequested,
      referenceNumber : cheque?.referenceNumber,
      chequeNumber : cheque?.chequeNumber,
    });
    if(cheque?.document){
      setUploadedChequeFile(cheque?.document);
    }
    
  }

  const preRemoveChequeItem = (i :number ) => {
    setDeletechequeModel(true);
    setSelectedCheque(i);
  }

  const removeChequeItem = () => {
    
    setRemainingAmount((prev) => prev + Number(managerChequeList[selectedCheque].amount))
    setManagerChequeList((prev: any[]) => {
      const newChequeList = [...prev]
      newChequeList.splice(selectedCheque, 1)
      return newChequeList
    });
    

    const selectedChequeDetails = managerChequeList[selectedCheque];
    
    deleteCheque(selectedChequeDetails.chequeId)
          .then((data)=>{ console.log("data",data)})
          .catch(() => message.error('Error deleting file'))
          .finally(() => {
            setDeletechequeModel(false);
            setDisableBtn(false);
          }
        )
  }
     
  
  const onSaveCheque =  async (value : any) => {
    
    if(selectedCheque != -1){
      const cheque =  managerChequeList[selectedCheque];
      const payLoad = {
        userAlias : userAlias,
        amount : Number(value.amount),
        document : `${uploadedChequeFile?.id}`,
        comment : value.comment,
        beneficiaryName : value.beneficiaryName,
        chequeNumber : value.chequeNumber,
        referenceNumber : value.referenceNumber, 
        buyerRequested : cheque.buyerRequested,
       }
    
        setDisableBtn(true);
        updateChequeDetail(cheque.chequeId, payLoad).then((response)=> {
          console.log("response ",response);
          getChequeDetail();
          setShowAddChequeModal(false);
          form.resetFields();
          setUploadedChequeFile(null);
        }).catch((error) => {
          console.log('error', error)
          setError({status: true, message: error?.data?.error || 'Error releasing payment'})
        })
        .finally(() => {
          setReleaseModal(false);
          setDisableBtn(false);
        })
    }else{
      const payLoad = {
        userAlias : userAlias,
        amount : Number(value.amount),
        document : `${uploadedChequeFile?.id}`,
        comment : value.comment,
        beneficiaryName : value.beneficiaryName,
        referenceNumber : value.referenceNumber, 
        chequeNumber : value.chequeNumber,
       }
    
        setDisableBtn(true);
        insertCheque(id, payLoad).then((response)=> {
          console.log("response ",response);
          getChequeDetail();
          setShowAddChequeModal(false);
          form.resetFields();
          setUploadedChequeFile(null);
        }).catch((error) => {
          console.log('error', error)
          setError({status: true, message: error?.data?.error || 'Error releasing payment'})
        })
        .finally(() => {
          setReleaseModal(false);
          setDisableBtn(false);
        })
    }
  }

  const precompleteTransaction =  async () => {
    const unverifiedUsers: string[] = [];

    if (
      chequeDetail?.partyPoaAlias &&
      chequeDetail?.partyPoaDetails?.kybStatus !== "VERIFIED"
    ) {
      unverifiedUsers.push(`Buyer: ${chequeDetail?.partyPoaDetails?.email}`);
    }

    if (
      chequeDetail?.counterPoaAlias &&
      chequeDetail?.counterPoaDetails?.kybStatus !== "VERIFIED"
    ) {
      unverifiedUsers.push(`Seller: ${chequeDetail?.counterPoaDetails?.email}`);
    }

    if (unverifiedUsers.length > 0) {
      setUnverifiedUsers(unverifiedUsers);
      setIsUserVerifiedCheckModal(true);
      return;
    }
    
     
    if(chequeDetail.transactionType === MC_TYPE.RECEIVE && chequeDetail?.buyerDetails?.userType === "GUEST_SELLER" && !isSellerVerified){
        message.error('Buyer is not verified.');
        return;
    }
    if(chequeDetail.transactionType !== MC_TYPE.RECEIVE && chequeDetail?.sellerDetails?.userType === "USER" && !chequeDetail?.counterAccepted){
      message.warning('Transaction is not accepted.');
      return;
    }
    if(chequeDetail.transactionType !== MC_TYPE.RECEIVE && chequeDetail?.sellerDetails?.userType === "GUEST_SELLER" && chequeDetail?.sellerDetails?.kybStatus !== "VERIFIED"){
        message.warning('Verifications pending.');
        return;
    }

    if(managerChequeList.map((a:any)=>a.document).includes(null)){
      message.error('Please upload cheque documents.');
      return;
    }
    
    if(!chequeDetail.isApproverVerified || !chequeDetail.isAuthorizerVerified){
      message.warning('Transaction verification pending.')
      return;
    }

    if(!chequeDetail.isPaymentInitialized){
      message.warning('Funds need to be added to the transaction before proceeding.')
      return;
    }
    
    const totalAmountChequeCreated = managerChequeList.reduce((val: number, cheque: any) => val += Number(cheque.amount) ?? 0, 0)
    const sellerAmount = Number(chequeDetail?.sellerAmount ?? 0);
    const epsilon = 0.001; // Small tolerance for floating point comparison
    if (Math.abs(totalAmountChequeCreated - sellerAmount) > epsilon) {
      message.warning('Total cheque amount must be equal to amount to be released!')
      return;
    }
    setReleaseModal(true);
  }

  const completeTransaction =  async () => {
    
    const { chequeBankAmount, chequePlatformFees } = feesForm.getFieldsValue();
     const payLoad = {
      userAlias : userAlias,
      name : userData?.name,
      currency : chequeDetail.currency,
      chequeBankAmount : chequeBankAmount ? Number(chequeBankAmount) : 0,
      chequePlatformFees : chequePlatformFees ? Number(chequePlatformFees) : 0
     }
    
    
    
     if(chequeDetail?.transactionType === MC_TYPE.RECEIVE){ 
        setDisableBtn(true);
        receiveFundMC(id, payLoad).then(()=>{
          message.success('Transaction completed.'); 
          getChequeDetail();
        }).catch((error :any) => { 
          setError({status: true, message: error?.data?.error || 'Error releasing payment'})
        })
        .finally(() => {
          setReleaseModal(false);
          setDisableBtn(false);
        })
     } else {
        setDisableBtn(true);
        insertMultiCheque(id, payLoad).then(()=>{
          message.success('Transaction completed.'); 
          getChequeDetail();
        }).catch((error :any) => { 
          setError({status: true, message: error?.data?.error || 'Error releasing payment'})
        })
        .finally(() => {
          setReleaseModal(false);
          setDisableBtn(false);
        })
     }
  }
    
  useEffect(() => {
    getChequeDetail();
  },[]);

  
    

  const getChequeDetail = async() => {
    getChequeDetails(id, userAlias)
    .then(async(response: any) => {
      const cheque = response?.data;

      
      console.log("cheque",cheque);
      
      setChequeDetail(cheque);
      
      if(cheque?.sellerAlias) {
        setCounterParty(cheque.sellerDetails);
      }
      if (cheque?.customAttachments.length) {
        setCustomAttachmentUrls(cheque?.customAttachments);
      }
      if (cheque?.customPoint) {
        setCustomContractList(cheque?.customPoint);
      } 
      
      

      if (cheque?.chequeDetails && cheque?.chequeDetails.length) {
         const managerCheques = cheque?.chequeDetails.map((details : any, i : number)=>{
          return { 
            id : i+1, 
            chequeId : details.id,
            beneficiaryName: details.beneficiaryName,
            referenceNumber: details.referenceNumber,
            chequeNumber: details.chequeNumber,
            amount : details.amount, 
            comment : details.comment , 
            buyerRequested : details.buyerRequested, 
            document: details.document
              ? {
                  id: details.document.id,
                  url: details.document.url,
                  inputfileid: details.document.inputfileid || details.document.name || "Document",
                }
              : null
          };
         }); 
         
         
         setManagerChequeList([]);
         setManagerChequeList(managerCheques);

        
         const chequeAddedAmount = managerCheques.reduce((val: number, cheque: any) => val + Number(cheque.amount ?? 0), 0);
         setRemainingAmount((Number(cheque.sellerAmount) ?? 0) - chequeAddedAmount);
       }else{
         setRemainingAmount((Number(cheque.sellerAmount) ?? 0));
       }
       
       
      const fromParty = {
        userType: USER_TYPE_TEXT.BUYER,
        userAlias: cheque.buyerAlias,
        name: cheque.buyerDetails?.name,
        email: cheque.buyerDetails?.email,
        entityType: cheque?.buyerDetails?.entityType || "INDIVIDUAL",
        // country: cheque.buyerDetails?.companyCountry ?? cheque.buyerDetails?.countryAlias,
        // nationality: formatTitleCase(cheque?.buyerDetails?.nationalityName ?? cheque.buyerDetails?.nationality ?? cheque.buyerDetails?.kycNationality) 
        country: getFormattedValue([cheque?.buyerDetails?.companyCountry, cheque?.buyerDetails?.countryAlias, cheque?.buyerDetails?.country]),
        nationality: getFormattedValue([
          cheque?.buyerDetails?.nationalityName, cheque?.buyerDetails?.nationality, cheque?.buyerDetails?.kycNationality
        ]),
      }
      const toParty = {
        userType: USER_TYPE_TEXT.SELLER,
        userAlias: cheque.sellerAlias,
        name: cheque?.sellerDetails.name,
        email: cheque?.sellerDetails?.email,
        entityType: cheque?.sellerDetails?.entityType || "INDIVIDUAL",
        // country: cheque?.sellerDetails?.country ?? cheque?.sellerDetails?.countryAlias,
        // nationality: formatTitleCase(cheque?.sellerDetails?.nationality ?? cheque?.sellerDetails?.kycNationality ?? cheque?.sellerDetails?.sellerNationalityName ?? cheque?.sellerDetails?.sellerNationality ?? cheque?.sellerDetails?.nationalityName),
        country: getFormattedValue([cheque?.sellerDetails?.country, cheque?.sellerDetails?.countryAlias, cheque?.sellerDetails?.companyCountry,]),
        nationality: getFormattedValue([
          cheque?.sellerDetails?.nationality,
          cheque?.sellerDetails?.kycNationality, cheque?.sellerDetails?.sellerNationalityName, cheque?.sellerDetails?.sellerNationality, cheque?.sellerDetails?.nationalityName
        ]),
        displayInfo: true,
        isUserOnboarded: [AuthUserTypes.USER, AuthUserTypes.GUEST].includes(cheque?.sellerDetails?.userType)
      }

       
       if(cheque.contractStartedBy === USER_TYPE_TEXT.BUYER){
          fromParty["userType"] = CHEQUE_USER_TYPE_TEXT.BUYER;
          setFromParty(fromParty);
          if(cheque.isCounterPoa){
            toParty["userType"] = CHEQUE_USER_TYPE_TEXT.SELLERPOA;
          }else{
            toParty["userType"] = CHEQUE_USER_TYPE_TEXT.SELLER;
          }
          setToParty(toParty)
       }else if(cheque.contractStartedBy === USER_TYPE_TEXT.BUYERPOA){
          fromParty["userType"] = CHEQUE_USER_TYPE_TEXT.BUYERPOA;
          setFromParty(fromParty);
          if(cheque.isCounterPoa){
            toParty["userType"] = CHEQUE_USER_TYPE_TEXT.SELLERPOA;
          }else{
             toParty["userType"] = CHEQUE_USER_TYPE_TEXT.SELLER;
          }
          setToParty(toParty)
       }else if(cheque.contractStartedBy === USER_TYPE_TEXT.SELLER){
          toParty["userType"] = CHEQUE_USER_TYPE_TEXT.SELLER;
          if(cheque.isPartyPoa){
            fromParty["userType"] = CHEQUE_USER_TYPE_TEXT.BUYERPOA;
          }else{
            fromParty["userType"] = CHEQUE_USER_TYPE_TEXT.BUYER;
          }
          setFromParty(fromParty);
          setToParty(toParty)
       }else if(cheque.contractStartedBy === USER_TYPE_TEXT.SELLERPOA){
            toParty["userType"] = CHEQUE_USER_TYPE_TEXT.SELLERPOA;
            setToParty(toParty);
            if(cheque.isPartyPoa){
              fromParty["userType"] = CHEQUE_USER_TYPE_TEXT.BUYERPOA;
            }else{
              fromParty["userType"] = CHEQUE_USER_TYPE_TEXT.BUYER;
            }
            setFromParty(fromParty);
       }
       let userAliasEscrow = '';
        if (cheque?.transactionType == "RECEIVE") {
          
          if(cheque?.payoutAccount_aliasName){
            setBankDetails({
              name: cheque?.payoutAccount_name,
              number: cheque?.payoutAccount_number,
              institutionName: cheque?.payoutAccount_institutionName,
              routingCode: cheque?.payoutAccount_routingCode,
              routingScheme: cheque?.payoutAccount_routingScheme
            });
          } else {
            setBankDetails({
              name: cheque?.bankDetails?.name,
              number: cheque?.bankDetails?.number,
              institutionName: cheque?.bankDetails?.institutionName,
              routingCode: cheque?.bankDetails?.routingCode,
              routingScheme: cheque?.bankDetails?.routingScheme
            });
          }
          setFromParty((prev : any) => ({ 
            ...prev,
            displayInfo: true,
            isUserOnboarded : [AuthUserTypes.USER,AuthUserTypes.GUEST].includes(cheque?.buyerDetails?.userType)
          }));
          getPayeeStages(cheque?.buyerDetails?.sellerLogs);
          setIsSellerVerified(cheque?.buyerDetails?.ekycStatus);

            userAliasEscrow = cheque.sellerAlias;
        } else {
          getPayeeStages(cheque?.sellerDetails?.sellerLogs);
          setIsSellerVerified(cheque?.sellerDetails?.ekycStatus);

          userAliasEscrow = cheque.buyerAlias;
        }
        getContractStages();
        getVAAccount(userAliasEscrow,cheque.currency);
    }).finally(() => setLoading(false));
  }

  const getVAAccount =  (userAlias : string, currency: string) => {
      virtualAccountDetails(userAlias, currency)
          .then((response:any) => { 
            setBuyerVirtualAccount(response?.data?.VADetails);
          })
          .catch((e : any) => {
            console.log("e",e);
          });
  }
   

const getPayeeStages = async(logs:any[]) => {
  if (logs?.length) {
      const historyList : any = {}; 
      logs.forEach((item: any) => {
          const key = `${item.role}_${item.verificationStatus}`;
          if (!historyList[key] || item.id > historyList[key].id) {
            historyList[key] = {
              id:item.id,
              name: item.name,
              updatedAt: item.updatedAt,
              supplierAlias: item.supplierAlias,
              updatedBy: item.updatedBy,
              role: item.role,
              aliasName: item.aliasName,
          }
        }
      });
      setSellerVerificationHistory(historyList);
    } 
  }

  const isValidStatus = (status: any) => {
    return status !== undefined && status !== null && status !== '' && !isNaN(status);
  };  

  const getContractStatusForBlueCard = (chequeDetail:any) => {
    if (chequeDetail?.isExpired) {
        return "( Expired )";
    }
    if (chequeDetail?.isArchive) {
        return "( Archived )";
    }
    if (chequeDetail?.chequeStatus && isValidStatus(chequeDetail.chequeStatus) && contractStatusMap[chequeDetail.chequeStatus]) {
        return `( ${contractStatusMap[chequeDetail.chequeStatus]} )`;
    }
    return "";
 };


 const displaySignature = () => {
  if(chequeDetail?.transactionType !== "RECEIVE") {
      if([USER_TYPE_TEXT.BUYER, USER_TYPE_TEXT.BUYERPOA].includes(chequeDetail.contractStartedBy) && userAlias == chequeDetail.sellerAlias){
        return true;
      }else if([USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA].includes(chequeDetail.contractStartedBy) && userAlias == chequeDetail.buyerAlias){
        return true;
      }
    }
    return false;
  }

  const displayEscrowBlock = () => {
    if(userType !== 'USER') return true;
    if(chequeDetail?.transactionType !== "RECEIVE") {
      return chequeDetail.buyerAlias == userAlias;
    }else{
      return chequeDetail.sellerAlias == userAlias;
    }
  }

 const displayFundBtn = () => {
  if(chequeDetail?.transactionType !== "RECEIVE") {
    const isSoFExistOrVerified = !chequeDetail.sourceOfFunds || 
        (chequeDetail.sourceOfFunds && chequeDetail?.sourceOfFunds?.length > 0 && chequeDetail.sourceoffundstatus === "APPROVED")
    if(counterParty?.userType == 'GUEST_SELLER'){
      return userAlias == chequeDetail.buyerAlias && userType == 'USER' && !chequeDetail?.isPaymentInitialized && isSellerVerified && isSoFExistOrVerified;
    }else if(counterParty?.userType == 'USER'){
      return  userAlias == chequeDetail.buyerAlias && userType == 'USER' && !chequeDetail?.isPaymentInitialized && !!chequeDetail.counterAccepted && isSoFExistOrVerified;
    }
    return false
  }else{
    if(!chequeDetail?.isPaymentInitialized &&  !chequeDetail?.allocatedFund && userAlias == chequeDetail.sellerAlias){
      return true;
    }
    return false;
  }
 }

 
  const handleOk = () => { };
    
  const closeErrorModal = () => {
    setError({ status: false, message: "" })
  }


  const openTnC = () => {
    // setVisible(true);
    window.open(EscrowTermsandCondition,'_blank')
  };

  const submitReason = (values: any) => {
    const rejectPayLoad = {
      chequeStatus : "-1", 
      rejectReason : values?.rejectReason,
      name : userData.name,
      chequeAction : "REJECT",
      userAlias : userAlias,
    } 

    setLoader(true);
    acceptTransaction(id,rejectPayLoad).then((data)=>{
      console.log("data",data);
      if(data.data.statusCode == 202) {
        setAfterModal(true);
        if(buttonStatus == 'accept') {
          setAftertext("TrustIn transaction accepted!")
        } else {
          setAftertext("TrustIn transaction rejected!")
        } 
      }
      setLoader(false);
    }).catch((e)=>{
      console.log("e",e);
      message.error("Something went wrong!");
    })

  };

  const onFinish = () => {
  
    const acceptPayLoad: any = {
      toSign : signatureId,
      chequeStatus : "2",
      name : userData.name,
      chequeAction : "ACCEPT",
      userAlias : userAlias,
    }
    if(!signatureId){
        message.error("Please upload signature.");  
        return
    }
    if([USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA].includes(chequeDetail?.contractStartedBy) && userAlias === chequeDetail.buyerAlias) {
      if(!sourceOfFundIds.length){
        message.error("Please upload source of funds documents.");  
        return
      }
      acceptPayLoad["sourceOfFunds"] = sourceOfFundIds || [];
    }
    
    setLoader(true);
    acceptTransaction(id,acceptPayLoad).then((data)=>{
      console.log("data",data);
      if(data.data.statusCode == 202){
        setAfterModal(true);
        if(buttonStatus == 'accept'){
          setAftertext("TrustIn transaction accepted!")
        }else{
          setAftertext("TrustIn transaction rejected!")
        }
        setTimeout(() => {
          goBack();  
        }, 1000);
      }
      setLoader(false);
    }).catch((e)=>{
      console.log("e",e);
      message.error("Something went wrong!");
    })
  };
 

  interface IBlock {
    party : string,
    name : string,
    email : string,
    countryAlias : string,
    nationality: string,
    currency : string,
    amount : string,
    displayInfo ?: boolean,
    isUserOnboarded ?: boolean,
    entityType: string,
  }

  const Blocks = ({party, name, email, countryAlias, nationality, currency, amount , displayInfo, isUserOnboarded, entityType  }: IBlock ) => {
    return <>
            <div className="buyerBox">
                       {party}
                       </div>
                       <div className="d-flex my-3">
                         <Image
                           src={WhiteUserFull}
                           alt="box"
                           preview={false}
                         />
                         <div className="whiteTitle18 ps-3 noWrap overflowText">
                           {/* {fromParty.name} */}
                           <Tooltip
                             title={name && name.length * 7 > 136 ? name : null}
                             overlayClassName='custom-tooltip'
                           >
                             <span>{name}</span>
                           </Tooltip> 
                         </div>
                         {
                          displayInfo ? 
                          <Tooltip
                            title={isUserOnboarded  ? "Seller is a registered platform user" : "Seller is a screening-only user"}
                            overlayClassName="custom-tooltip signupTooltip"
                          >
                            <span className="nationality_info">
                              <InfoCircleOutlined />
                            </span>
                          </Tooltip> :
                          null
                         }
                         
                       </div>
                       <div className="d-flex my-3">
                         <Image src={WhiteEmail} alt="box" preview={false} />
                         <div className="whiteTitle18 px-3 noWrap overflowText">
                           {/* {fromParty.email} */}
                           <Tooltip
                             title={email}
                             overlayClassName='custom-tooltip'
                           >
                             <span>{email}</span>
                           </Tooltip> 
                         </div>
                       </div>
                       <div className="d-flex my-3">
                         <Image src={Globe} alt="box" preview={false} />
                         <div className="whiteTitle18 ps-3 noWrap overflowText">
                           <Tooltip
                               title={countryAlias && countryAlias.length * 7 > 136 ? countryAlias : null}
                               overlayClassName='custom-tooltip'
                             >
                             {countryAlias}
                           </Tooltip>
                         </div>
                          <Tooltip
                            title={"Residence country"}
                            overlayClassName="custom-tooltip signupTooltip"
                          >
                            <span className="nationality_info">
                              <InfoCircleOutlined />
                            </span>
                          </Tooltip>
                       </div>
                      {entityType !== "COMPANY" ? (
                       <div className="d-flex my-3">
                         <Image src={Flag} alt="box" preview={false} />
                         <div className="whiteTitle18 ps-3 noWrap overflowText">
                           <Tooltip
                               title={nationality && nationality.length * 7 > 136 ? nationality : null}
                               overlayClassName='custom-tooltip'
                             >
                             {nationality || "--"}
                           </Tooltip>
                         </div>
                          <Tooltip
                            title={"Nationality"}
                            overlayClassName="custom-tooltip signupTooltip"
                          >
                            <span className="nationality_info">
                              <InfoCircleOutlined />
                            </span>
                          </Tooltip>
                       </div>
                       ):null}
                       <div className="d-flex my-3">
                         <Image src={Payment} alt="box" preview={false} />
                         <div className="whiteTitle18 bold px-3">
                             {moneyFormat(
                               currency,
                               (Number(amount)).toFixed(2)
                             )}
                         </div>
                       </div>

                             
          </>
  }

  

return (
  <div className="scrollbar-container">
      <DefaultLayout
          page="cheque"
            loading={loading}
            TitleText="Agreement Details"
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
                    className="mt-2 cursor-pointer"
                  />
                  <div className="ml-5">
                    <b> Agreement details</b>
                    <Breadcrumb separator=">">
                      <Breadcrumb.Item className="breadcrumb-title-text">
                        Agreement details
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                </div>
              }
            >
              {/* counterParty */}
            <Row className="endtoend" gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
              <Col xs={24} sm={24} md={24} lg={16} xl={16} span={Width >= 992 ? 16 : 24}>
                <div className="bg-admin-card seller-bg-admin-card">
                  <>
               <div className={Width > 700 ? "endtoend" :""}>
                     <div className={Width > 700 ? "title_white d-flex flex-wrap align-items-center justify-content-between res-trans-id":"title_white res-trans-id d-flex flex-wrap align-items-center"}>
                       <span className="me-2">{chequeDetail?.agreementId} </span>  <span className="contractStatusMap">
                           {getContractStatusForBlueCard(chequeDetail)}
                        </span>
                      </div>
                    <div className={Width > 700 ? "d-flex" :"d-flex mt-2"}>
                      <Image src={Job} alt="box" preview={false} className="pe-2"/>
                      <div className="whiteTitle18 px-3">
                        {moment(chequeDetail?.createAt).format(
                          "DD-MM-YYYY"
                        )}
                      </div>
                    </div>
                  </div>
                  <hr className=" w-100 opacity-50 mt-4" />
                  {
                    chequeDetail?.transactionType === 'RECEIVE' ? 
                   <Row gutter={{ xs: 25, sm: 25, md: 12, lg: 12 }} className=" endtoend four-buyer-block form-body">
                         <Col xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          span={chequeDetail?.contractStatus === "2" ? 7 : 12}
                          className="columnData">
                          <>
                         <div>
                          <div className="d-flex">
                              <div className="bluecard-smallbox">
                                <img src={WhiteUserFull} alt="box"/>
                                <p>
                                  {chequeDetail?.counterPoaAlias ? "Seller's POA" : "Seller" }
                                 </p>
                              </div>
                               <div className="container m-auto">
                      <div className="row align-items-center my-0 w-100">
                        <div className="col-12 col-xl-7 col-lg-12">
                          <div className="whiteTitle18  px-md-3 px-1 fs-5 text-break text-wrap pb-2">{toParty.name}</div>
                          <div className="d-flex flex-column flex-sm-column mx-1 mx-md-3 flex-wrap gap-2">
                            <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0">
                              <Image src={WhiteEmail} alt="box" preview={false} />
                              <span className="whiteTitle18 px-2 text-break text-wrap">{toParty.email}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <Image src={Globe} alt="box" preview={false} />
                              <span className="whiteTitle18 px-2 text-break text-wrap">{toParty.country}</span>
                            </div>
                          </div>
                        </div>
                      <div className="col-12 col-xl-5 col-lg-12 mt-2 mt-md-0 md-mx-2">
                      <div className="d-flex align-items-center justify-content-lg-start justify-content-xl-end mx-md-0 mt-md-2">
                        <Image src={Payment} alt="box" preview={false} className="amount-icon"/>
                        <span className="px-2 bluebox-amount">
                          {moneyFormat(chequeDetail.currency, chequeDetail?.buyerAmount)}
                        </span>
                      </div>
                    </div>
                      </div>
                             </div>
                          </div>
                        </div>
                            <div className="my-3">
                                <div className="d-flex">
                               <div className="bluecard-smallbox">
                                      <img src={WhiteUserFull} alt="box"/>
                                      <p>
                                        {chequeDetail?.partyPoaAlias ?  "Buyer's POA" : "Buyer"}
                                      </p>
                                    </div>
                                <div className="d-flex flex-column flex-md-row my-0 align-items-start align-items-md-center w-100">
                                      <div className="flex-fill mx-md-3">
                                        <div className="whiteTitle18 px-3 fs-5 text-break text-wrap pb-2">
                                          {fromParty.name}
                                          {
                                              fromParty?.displayInfo ? 
                                              <Tooltip
                                                title={fromParty?.isUserOnboarded  ? "Buyer is a registered platform user" : "Buyer is a screening-only user"}
                                                overlayClassName="custom-tooltip signupTooltip"
                                              >
                                                <span className="nationality_info">
                                                  <InfoCircleOutlined />
                                                </span>
                                              </Tooltip> :
                                              null
                                            }
                                        </div>
                                        <div  className="d-flex flex-column flex-sm-column mx-3 flex-wrap gap-2">
                                          <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0">
                                            <Image src={WhiteEmail} alt="box" preview={false} />
                                            <span className="whiteTitle18 px-2 text-break text-wrap">{fromParty.email}</span>
                                          </div>
                                          <div className="d-flex align-items-center">
                                            <Image src={Globe} alt="box" preview={false} />
                                            <span className="whiteTitle18 px-2 text-break text-wrap">{fromParty.country}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                          </>
                        </Col>
                </Row>
                   :<Row gutter={{ xs: 25, sm: 25, md: 12, lg: 12 }} className=" endtoend four-buyer-block form-body">
                      { ( [USER_TYPE_TEXT.BUYER, USER_TYPE_TEXT.BUYERPOA].includes(chequeDetail.contractStartedBy)) ? 
                       <>
                       <Col xs={24} sm={10} md={6} lg={10} xl={8} span={chequeDetail?.chequeStatus === "2" ? 7 : 12}  className="columnData">
                          <Blocks
                            party={fromParty.userType}
                            name={fromParty.name}
                            email={fromParty.email}
                            amount={chequeDetail?.buyerAmount}
                            currency={chequeDetail?.currency}
                            countryAlias={fromParty.country}
                            nationality={fromParty.nationality}
                            entityType={fromParty.entityType}
                            />
                       </Col>
                       <Col xs={24} sm={4} md={3} lg={4} xl={3} className="mb-3">
                         <div >
                           <Image src={MoveTo} alt="move" preview={false} />
                         </div>
                       </Col>
                       <Col xs={24} sm={10} md={6} lg={10} xl={8} span={chequeDetail?.chequeStatus === "2" ? 7 : 12}  className="columnData">
                       <Blocks party={toParty.userType}
                            name={toParty.name}
                            email={toParty.email}
                            amount={chequeDetail?.sellerAmount}
                            currency={chequeDetail?.currency}
                            countryAlias={toParty.country}
                            nationality={toParty.nationality}
                            displayInfo={toParty.displayInfo}
                            isUserOnboarded={toParty.isUserOnboarded}
                            entityType={toParty.entityType}
                            />
                       </Col>
                     </>
                      : 
                      <>
                      <Col xs={24} sm={10} md={6} lg={10} xl={8} span={chequeDetail?.chequeStatus === "2" ? 7 : 12}  className="columnData">
                      <Blocks party={toParty.userType}
                           name={toParty.name}
                           email={toParty.email}
                           amount={chequeDetail?.sellerAmount}
                           currency={chequeDetail?.currency}
                           countryAlias={toParty.country}
                           nationality={toParty.nationality}
                            entityType={toParty.entityType}
                           />
                      </Col>
                      <Col xs={24} sm={4} md={3} lg={4} xl={3} className="mb-3">
                        <div >
                          <Image src={MoveTo} alt="move" preview={false} />
                        </div>
                      </Col>
                      <Col xs={24} sm={10} md={6} lg={10} xl={8} span={chequeDetail?.chequeStatus === "2" ? 7 : 12}  className="columnData">
                      <Blocks
                           party={fromParty.userType}
                           name={fromParty.name}
                           email={fromParty.email}
                           amount={chequeDetail?.buyerAmount}
                           currency={chequeDetail?.currency}
                           countryAlias={fromParty.country}
                           nationality={fromParty.nationality}
                           entityType={fromParty.entityType}
                           />
                      </Col>
                    </>
                      }
                  </Row>
                    }
                  </>
                </div>
          
                {
                  chequeDetail?.partyPoaAlias || chequeDetail?.counterPoaAlias ? 
                  <div className="mt-4">
                    <div className="bg-admin-card seller-bg-admin-card">
                    <Row className="gap-3 endtoend four-buyer-block form-body">
                    { chequeDetail?.partyPoaAlias ? 
                         <Col 
                          span={chequeDetail?.contractStatus === "2" ? 7 : 24}>
                          <div className="d-flex mb-3">
                              <div className="bluecard-smallbox">
                                <img src={WhiteUserFull} alt="box"/>
                                <p className="mt-2 mb-0">Buyer</p>
                              </div>
                              <div className="d-flex flex-column flex-md-row my-0 align-items-start align-items-md-center w-100">
                                  <div className="flex-fill mx-md-3">
                                    <div className="whiteTitle18 px-3 fs-5 text-break text-wrap">{chequeDetail?.partyPoaDetails.name}</div>
                                    <div className="d-flex flex-column flex-sm-row mx-3 py-1 flex-wrap gap-1 mt-2">
                                      <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0 gap-1">
                                        <Image src={WhiteEmail} alt="box" preview={false} />
                                        <Tooltip
                                          title={
                                            chequeDetail?.partyPoaDetails.email && chequeDetail?.partyPoaDetails.email.length < 36
                                              ? chequeDetail?.partyPoaDetails.email
                                              : null
                                          }
                                          placement="top"
                                          overlayClassName="leads-custom-tooltip"
                                        >
                                          <span className={Width > 640 ? "whiteTitle18 px-2" : "whiteTitle18 px-2 noWrap signature-overflowtext"}>{chequeDetail?.partyPoaDetails.email}</span>
                                        </Tooltip>
                                      </div>
                                    </div>
                              <CountryInfoItem
                                icon={Globe}
                                tooltipLabel="Residance country"
                                countryName={getFormattedValue([chequeDetail?.partyPoaDetails?.country, chequeDetail?.partyPoaDetails?.countryAlias, chequeDetail?.partyPoaDetails?.country])}
                              />
                              {[chequeDetail?.partyPoaDetails?.entityType, chequeDetail?.partyPoaDetails?.typeOfEntity].includes("INDIVIDUAL") ? (
                                <CountryInfoItem
                                  icon={Flag}
                                  tooltipLabel="Nationality"
                                  countryName={getFormattedValue([chequeDetail?.partyPoaDetails?.nationality, chequeDetail?.partyPoaDetails?.nationalityName, chequeDetail?.partyPoaDetails?.sellerNationality, chequeDetail?.partyPoaDetails?.sellerNationalityName])}
                                />
                              ) : null}
                                </div>
                              </div>
                          </div>
                          </Col>
                      : null }
                    {
                     chequeDetail?.counterPoaAlias ?  
                        <Col span={chequeDetail?.contractStatus === "2" ? 7 : 24}>
                          <div className="d-flex">
                              <div className="bluecard-smallbox">
                                <img src={WhiteUserFull} alt="box"/>
                                <p className="mt-2 mb-0">Seller</p>
                              </div>
                              <div className="d-flex flex-column flex-md-row my-0 align-items-start align-items-md-center w-100">
                                  <div className="flex-fill mx-md-3">
                                    <div className="whiteTitle18 px-3 fs-5 text-break text-wrap">{chequeDetail?.counterPoaDetails.name}</div>
                                    <div className="d-flex flex-column flex-sm-row mx-3 py-1 flex-wrap gap-1 mt-2">
                                      <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0 gap-2">
                                        <Image src={WhiteEmail} alt="box" preview={false} />
                                        <Tooltip
                                          title={
                                            chequeDetail?.counterPoaDetails.email && chequeDetail?.counterPoaDetails.email.length < 36
                                              ? chequeDetail?.counterPoaDetails.email
                                              : null
                                          }
                                          placement="top"
                                          overlayClassName="leads-custom-tooltip"
                                        >
                                          <span className={Width > 640 ? "whiteTitle18 px-2" : "whiteTitle18 px-2 noWrap signature-overflowtext"}>{chequeDetail?.counterPoaDetails.email}</span>
                                        </Tooltip>
                                      </div>
                                     
                                    </div>
                                <CountryInfoItem
                                  icon={Globe}
                                  tooltipLabel="Residance country"
                                  countryName={getFormattedValue([chequeDetail?.counterPoaDetails?.country, chequeDetail?.counterPoaDetails?.countryAlias, chequeDetail?.counterPoaDetails?.country])}
                                />
                                {[chequeDetail?.counterPoaDetails?.entityType, chequeDetail?.counterPoaDetails?.typeOfEntity].includes("INDIVIDUAL") ? (
                                  <CountryInfoItem
                                    icon={Flag}
                                    tooltipLabel="Nationality"
                                    countryName={getFormattedValue([chequeDetail?.counterPoaDetails?.nationality, chequeDetail?.counterPoaDetails?.nationalityName, chequeDetail?.counterPoaDetails?.sellerNationality, chequeDetail?.counterPoaDetails?.sellerNationalityName])}
                                  />
                                ) : null}
                                  </div>
                              </div>
                          </div>
                          </Col> : null }
                    </Row> 
                    </div>
                  </div>
                 : null
                }
                 
                   {Width < 991 && 
                  <Col xs={24} sm={24} md={24} lg={8} xl={8} span={8}>
                     <div className="flex-end mb-3">
                      { id && chequeDetail?.chequeStatus === "1" && ((chequeDetail?.buyerAlias == userAlias && ["BUYER", "BUYERPOA"].includes(chequeDetail?.contractStartedBy)) 
                        || (chequeDetail?.sellerAlias == userAlias && ["SELLER", "SELLERPOA"].includes(chequeDetail?.contractStartedBy))) ?  
                      <SecondaryOutLineButton
                          className={"w-100 mx-0"}
                          disabled={disableBtn}
                          children="Edit"
                          htmlType="submit"
                          loading={loading}
                          onClick={() => {
                            onEditTransaction()
                          }}
                        /> 
                      : "" 
                      }
                  </div>
                    <Card className="px-2 detailsCard h-auto stages-timeline-card">
                      <div className="stepDetails mb-4 mt-2 mx-2">Stages</div>
                      <HistorySteps
                        screen={'transactionDetails'}
                        chequeHistory={chequeHistory}
                        chequeDetail={chequeDetail} 
                        taxDetails = {taxDetails}
                        setTaxDetails = {setTaxDetails}
                        counterParty = {counterParty} 
                        Width={Width}
                        getContractStages={getContractStages}
                        sellerVerificationHistory={sellerVerificationHistory}
                      />
                    </Card>
                  </Col>
                }


                <div className="mt-4">
                  <Card className="px-4">
                    {/* <Card className="px-4"> */}
                    <div className="stepDetails mb-4 mt-3">
                      Category details 
                    </div>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={Suitcase} alt="user" preview={false} />
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Item categories
                            </div>
                            <div className="stepDetails_medium fw-400">
                              {chequeDetail?.itemCategoryName}
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={Suitcase} alt="user" preview={false} />
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Item type
                            </div>
                            <div className="stepDetails_medium fw-400 ">
                                {chequeDetail?.itemTypeName}
                            </div>
                          </div>
                        </div>
                      </Col>
                       {/* {categoryDetails?.dynamicInputFields?.length > 0 && categoryDetails?.dynamicInputFields.map((inputField: any,index:any) => (
                        <Col key={index} xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                          <div className="d-flex">
                            <Image src={Doc} alt="user" preview={false} />
                            <div className="mx-3">
                              <div className="stepDetails_medium_sub">
                                {inputField?.name}
                              </div>
                              <div className="stepDetails_medium fw-400">
                                {inputField?.value}
                              </div>
                            </div>
                          </div>
                        </Col>
                      )) }  */}
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={Suitcase} alt="user" preview={false} />
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Item name
                            </div>
                            <div className="stepDetails_medium fw-400">
                              {chequeDetail?.itemName}
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={Doc} alt="user" preview={false} className="doc-img"/>
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Description
                            </div>
                            <div className="stepDetails_medium fw-400">
                              {chequeDetail?.description ?? "-"}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                        {
                          displayEscrowBlock()  ? 
                      
                      <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-4">
                          <><hr className="lightgrayHr"></hr>
                            <Card className="noBorder mt-6 p-2 mb-3">
                          <div className="stepDetails mb-4 mt-3">
                          Escrow Account Details
                          </div>
                         

                          <Row className="mt-4" gutter={[24, 24]}>
                            <Col xs={24} md={12} lg={12} xl={8} className="col-padding">
                              <div className="small-text-light">Name on the bank account</div>
                              <div className="subText_xs overflowText">
                                <Popover content={buyervirtualAccount[0]?.name} trigger="hover">
                                  {buyervirtualAccount[0]?.name || "--"}
                                </Popover>
                              </div>
                            </Col>
                            <Col xs={24} md={12} lg={12} xl={8} className="col-padding">
                              <div className="small-text-light">Account number</div>
                              <div className="subText_xs overflowText">
                                <Popover content={buyervirtualAccount[0]?.number} trigger="hover">
                                  {buyervirtualAccount[0]?.number || "--"}
                                </Popover>
                              </div>
                            </Col>
                            <Col xs={24} md={12} lg={12} xl={8} className="col-padding">
                              <div className="small-text-light">IBAN number</div>
                              <div className="subText_xs overflowText">
                                <Popover content={buyervirtualAccount[0]?.iban} trigger="hover" placement="topRight">
                                  {buyervirtualAccount[0]?.iban || "--"} 
                                </Popover>
                              </div>
                            </Col>
                            <Col xs={24} md={12} lg={12} xl={8} className="col-padding">
                              <div className="small-text-light">Country</div>
                              <div className="subText_xs overflowText">
                                <Popover content={buyervirtualAccount[0]?.address?.countryCode} trigger="hover">
                                  {buyervirtualAccount[0]?.address?.countryCode || "--"} 
                                </Popover>
                              </div>
                            </Col>
                            <Col xs={24} md={12} lg={12} xl={8} className="col-padding">
                              <div className="small-text-light">Status</div>
                              <div className="subText_xs capitalize overflowText">
                                <Popover content={buyervirtualAccount[0]?.status} trigger="hover">
                                  {buyervirtualAccount[0]?.status || "--"}
                                </Popover>
                              </div>
                            </Col>
                          </Row>
                          </Card>
                          </>
                      </Col>
                      </Row>
                       : "" }
                    
                        {
                           

                          chequeDetail?.transactionType === MC_TYPE.RECEIVE ? 
                          <>
                          <hr className="lightgrayHr" />
                          <div className="stepDetails mb-4 mt-3">
                            {chequeDetail?.counterPoaAlias ? "Seller's POA" : "Seller" } bank details
                          </div>
                            <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={UserHalf} alt="user" preview={false} />
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                                Name (as per bank account)
                            </div>
                            <div className="stepDetails_medium fw-400 ">
                                {bankDetails?.name}
                            </div>
                          </div>
                        </div>
                      </Col> 
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={Suitcase} alt="user" preview={false} />
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Number
                            </div>
                            <div className="stepDetails_medium fw-400">
                              {bankDetails?.number}
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={Suitcase} alt="user" preview={false} className="doc-img"/>
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Bank name
                            </div>
                            <div className="stepDetails_medium fw-400">
                              {bankDetails?.institutionName ?? "-"}
                            </div>
                          </div>
                        </div>
                      </Col>
                       <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={Doc} alt="user" preview={false} className="doc-img"/>
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Routing code
                            </div>
                            <div className="stepDetails_medium fw-400">
                              {bankDetails?.routingCode ?? "-"}
                            </div>
                          </div>
                        </div>
                      </Col>
                       <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                        <div className="d-flex">
                          <Image src={Doc} alt="user" preview={false} className="doc-img"/>
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Routing scheme
                            </div>
                            <div className="stepDetails_medium fw-400">
                              {bankDetails?.routingScheme ?? "-"}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                          </> : null
                        }

                    <hr className="lightgrayHr" /> 
                    <div style={{ display: "flex", justifyContent: "space-between" }} className="align-items-center">
                      <div className="stepDetails mt-3 mb-3">Payment details </div>
                      {  displayFundBtn() ?  
                          <Button
                            onClick={() => addFund(id, userAlias)}
                            type="primary"
                            className="modal-button ml-3 w-auto"
                          >
                            {`+ Add Fund`}
                          </Button> 
                      : ""} 
                    </div>

                      {
                        chequeDetail?.transactionType === "RECEIVE" ?
                   <Card className="grayCard payments-details-cards">
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Agreement amount
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            chequeDetail?.invoiceAmount
                          )}
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Total TrustIn fees ({chequeDetail?.platformFeePercent}) +{" "}
                        {chequeDetail?.vatChargePercent ?? process.env.COUNTRY_VAT}% VAT
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.platformFee ?? 0))
                          }{" "}
                          +{" "}
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.vatFee ? chequeDetail?.vatFee : 0)
                          )}

                          
                        </div>
                      </div>
                      {/* <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          TrustIn platform fees to be paid by seller
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.buyerFees)
                          )}
                        </div>
                      </div>
                     */}
                      {/* <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                        Amount to be paid by seller
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.buyerAmount)
                          )}
                        </div>
                      </div> */}
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                        Amount to be received by 
                        { chequeDetail?.contractStartedBy == 'SELLERPOA' ? " Seller's POA" : " Seller" }
                        
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.sellerAmount)
                          )}
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Total agreement amount
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            chequeDetail?.totalInvoiceAmount !== null ? Number(chequeDetail?.totalInvoiceAmount) : 0
                          )}
                        </div>
                      </div> 
                    </Card>
                        : 
                     
                    <Card className="grayCard payments-details-cards">
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Agreement amount
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            chequeDetail?.invoiceAmount
                          )}
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Total TrustIn fees ({chequeDetail?.platformFeePercent}) +{" "}
                        {chequeDetail?.vatChargePercent ?? process.env.COUNTRY_VAT}% VAT
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.platformFee ?? 0))
                          }{" "}
                          +{" "}
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.vatFee ? chequeDetail?.vatFee : 0)
                          )}
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          TrustIn platform fees to be paid by {fromParty?.userType} ({chequeDetail?.buyerFeesPercent}%)
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.buyerFees)
                          )}
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          TrustIn platform fees to be paid by {toParty?.userType} ({chequeDetail?.sellerFeesPercent}%)
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.sellerFees)
                          )}
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                        Amount to be paid by {fromParty?.userType}
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.buyerAmount)
                          )}
                        </div>
                      </div>
                      {/* <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                        Amount to be received by seller
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            Number(chequeDetail?.sellerAmount)
                          )}
                        </div>
                      </div> */}
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Total agreement amount
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            chequeDetail?.currency,
                            chequeDetail?.totalInvoiceAmount !== null ? Number(chequeDetail?.totalInvoiceAmount) : 0
                          )}
                        </div>
                      </div>
                    </Card>
                    }
              {(['AUTHORIZER', 'TRUSTEE', 'SENIOR_MANAGMENT', 'ADMIN']).includes(userType) && chequeDetail?.platformChargeAppliedOn != null && chequeDetail?.platformChargeAppliedOn != PLATFORM_CHARGE_APPLIED_ON.DEFAULT ?
                <>
                  <div className="endtoend py-2" style={{marginLeft:"15px", marginRight:"15px"}}>
                    <b className="subText_small">User Platform charges are applied of {toTitleCase(chequeDetail?.platformChargeAppliedOn)}</b>
                    <b className="subText_small text-end">
                      {chequeDetail?.platformChargeAppliedOn == PLATFORM_CHARGE_APPLIED_ON.BUYER ? chequeDetail?.buyerDetails?.name : chequeDetail?.sellerDetails?.name}
                    </b>
                  </div>

                </>
                : null}
                    {[USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA].includes(chequeDetail?.contractStartedBy) && chequeDetail.transactionType != "RECEIVE"  && userAlias == chequeDetail.buyerAlias && chequeDetail?.chequeStatus === "1" && 
                      <>
                        <hr className="lightgrayHr" />
                        <SourceOfFunds
                          setSourceOfFundIds={setSourceOfFundIds}
                          sourceOfFundIds={sourceOfFundIds}
                          setSourceOfFundUrls={setSourceOfFundUrls}
                          sourceOfFundUrls={sourceOfFundUrls}
                          setLoading={setLoading}
                        />
                        <Row>
                        <ul className="stepDetails_medium_sub mt-4">
                          <li>
                            This is required to comply with financial regulations. Please upload Bank Account Statements showing the source of funds for this transaction.
                          </li>
                        </ul>
                      </Row>
                      </>
                    }
                    {
                      displaySignature() ? 
                      <>
                      { !chequeDetail?.counterAccepted && chequeDetail.chequeStatus != "-1"  ?
                      <>
                        <hr className="lightgrayHr" />
                          <Form onFinish={onFinish} className="mt-5">
                            <>
                              <CounterSignature
                                signature={signature}
                                setSignature={setSignature}
                                signatureId={signatureId}
                                setSignatureId={setSignatureId}
                                name="toSign"
                                signatureReq={true}
                                contractExist={true} 
                              />
                            </>
                           
                            <Form.Item
                              name="agreement"
                              valuePropName="checked"
                              className="inputField w-100 radioInput"
                              rules={[
                                {
                                  validator: (_, value) =>
                                    value
                                      ? Promise.resolve()
                                      : Promise.reject(
                                          new Error(
                                            "Please accept the escrow terms and conditions!"
                                          )
                                        ),
                                },
                              ]}
                            >
                            <Checkbox className="mt-1 ">
                              <SmallText
                                className="formSubText forgetpassword"
                                children={
                                <>
                                  I agree to TrustIn&apos;s{" "} 
                                  <ViewButton
                                    className="mb-0 acceptTerms"
                                    children="Escrow Terms & Conditions"
                                    onClick={openTnC}
                                  />
                                </>}
                              />
                              </Checkbox>
                            </Form.Item>
                            <div className="d-flex gap-3">
                            <Button
                                    key="submit"
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    onClick={() => setButtonStatus("accept")}
                                    className="modal-button mt-2"
                                  >
                                    Accept
                                  </Button>
                            <Button
                                  key="submit"
                                  style={{width:'140px'}}
                                  type="primary"
                                  className="modal-button-cancel mt-2"
                                  onClick={() => {
                                    setButtonStatus("reject")
                                    setShowRejectWarning(true)
                                  }}
                                  loading={loading}
                                >
                                  Reject
                                </Button>
                            
                            </div>
                          </Form>
                          </>
                        : "" 
                       }
                       </>
                      : 
                      ""
                   }
                   
                  
                   
                    { chequeDetail?.transfersStatus === "COMPLETED" ? (
                      (userType == "TRUSTEE" || userType == "AUTHORIZER" || userType == "ADMIN") ? 
                        <Card className="grayCard payments-details-cards">
                          <>
                            <div className="endtoend py-2">
                              <div className="stepDetails_medium_sub">
                                Bank fees
                              </div>
                              <div className="subText_small fw-400 text-right">
                                {moneyFormat(
                                  chequeDetail?.currency,
                                  chequeDetail?.chequeBankAmount
                                )}
                              </div>
                            </div>
                            <div className="endtoend py-2">
                              <div className="stepDetails_medium_sub">
                                Trustin fees
                              </div>
                              <div className="subText_small fw-400 text-right">
                                {moneyFormat(
                                  chequeDetail?.currency,
                                  chequeDetail?.chequePlatformFees
                                )}
                              </div>
                            </div>
                          </>
                        </Card>
                      : null
                    ) : null }

                    { chequeDetail?.chequeStatus === "5" ? (
                      <ChequeDocument documents={chequeDetail.chequeDocuments} chequeDetail={chequeDetail} getChequeDetail={getChequeDetail}/>
                    ) : null }
                       
                       <br/> 

                  {( chequeDetail?.sellerDetails?.userType === AuthUserTypes.GUEST_SELLER && chequeDetail?.sellerDetails?.uploadedDocuments && chequeDetail?.sellerDetails?.uploadedDocuments.length > 0) ?
                      <>
                         <hr className="lightgrayHr" />
                        <div className="stepDetails mt-3 mb-3">Seller Documents</div>
                       
                        <SellerDocuments id={id} chequeDetail={chequeDetail}  customAttachmentUrls={chequeDetail?.sellerDetails?.uploadedDocuments} getChequeDetail={getChequeDetail} />
                    </> : null
                    }
                    <div>
                    <hr className="lightgrayHr" />
                      <div className="stepDetails mt-3 mb-3">Contract documents</div>
                      {(customContractList && Object.keys(customContractList).length > 0  || customAttachmentUrls.length) ? <>
                         <CustomChequeDetails id={id} chequeDetail={chequeDetail} customFieldList={customContractList} customAttachmentUrls={customAttachmentUrls} getChequeDetail={getChequeDetail} /> 
                         </> : ""
                       }
                    </div>
                    {chequeDetail.sourceoffundstatus === "REJECTED" && 
                      <div className="my-5">
                        <p style={{ color: "red", margin: "-16px 0px 16px" }} className="mt-2">
                          Note: The contract has been rejected following a review that revealed certain issues within the submitted source of fund documents.
                        </p>
                      </div>
                    }

                    {(!["TRUSTEE","APPROVER","AUTHORIZER","SENIOR_MANAGMENT"].includes(userType) && chequeDetail.sourceOfFunds && chequeDetail.sourceoffundstatus != "REJECTED" && chequeDetail.sourceOfFunds.length > 0) ? (
                      <>
                        <div className="stepDetails mt-3 mb-3">Source of funds</div>

                        <div className="mangercheque-doc-block">
                          <div className={ "d-flex gap-5 flex-wrap moa-doc-list"} >
                            {chequeDetail?.sourceOfFunds.map((sourceDoc: any, i : number) => ( 
                              <div key={sourceDoc?.url || i} className="documentcard-width" style={{ width : "100%" }}>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    sourceDoc?.url?.toLowerCase().endsWith(".pdf") ? (
                                      <>
                                        <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(sourceDoc.url) }}>
                                          <PDFPreview
                                            url={sourceDoc?.url || ''}
                                            onPreviewClick={handlePDFView}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={sourceDoc?.url}
                                        height={175}
                                      />
                                    )
                                  }
                                >
                                  <div className="d-flex justify-content-between">
                                    <Meta title={sourceDoc?.document ?? `Document ${i+1}`}/>
                                  </div>
                                </Card>
                              </div> 
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null}

                    {["TRUSTEE","APPROVER","AUTHORIZER","SENIOR_MANAGMENT"].includes(userType) &&
                       ((counterParty?.userType == 'USER' && !["0","1"].includes(chequeDetail?.chequeStatus)) || (counterParty?.userType == 'GUEST_SELLER' && !["0"].includes(chequeDetail?.chequeStatus)) ) &&
                      chequeDetail?.sourceOfFunds && chequeDetail?.sourceOfFunds?.length > 0 &&
                     (
                      <>
                        <hr className="lightgrayHr" /> 
                        {/* <Card className="payments-details-cards mt-4 p-3 mb-5">  */}
                        <div className="stepDetails mt-3 mb-3" style={{whiteSpace: "wrap"}}>Source of funds</div>
                        <SourceOfFundDetails 
                          contractAlias={chequeDetail?.aliasName}
                          contractType="CHEQUE"
                          getPaymentDetails={getChequeDetail}
                        />
                        {/* </Card> */}
                      </>
                    )}


                     {/* Add option to prepare cheque after transaction creation by buy */}
                       { chequeDetail && chequeDetail?.chequeStatus !== "5" && ((chequeDetail?.contractStartedBy === "BUYER" && chequeDetail?.buyerAlias == userAlias) || (chequeDetail?.contractStartedBy === "SELLER" && chequeDetail?.sellerAlias == userAlias)) ?
                        <>
                          <hr className="lightgrayHr" />
                          <ChequeDetailCard chequeDetail={chequeDetail} getChequeDetail={getChequeDetail}/>
                        </>
                        :
                      <>
                          {["TRUSTEE" , "AUTHORIZER"].includes(userType) && (!chequeDetail?.transfersStatus || chequeDetail?.transfersStatus === 'FAILED') ? 
                          <div className="mt-4">
                            { !["-1","5"].includes(chequeDetail?.chequeStatus) &&
                              <>
                                <hr className="lightgrayHr"/>
                           
                                  <div className="stepDetails mt-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <span className="modal-word-wrap">Prepare manager&apos;s cheques</span>
                                    { remainingAmount > 0 ? 
                                      <Button 
                                        type="primary" 
                                        onClick={() =>  {
                                          setShowAddChequeModal(true);
                                          setSelectedCheque(-1);
                                          form.resetFields();
                                          setUploadedChequeFile(null)
                                        }}
                                        className="modal-button w-auto"
                                      >
                                        + Add New Cheque
                                      </Button>
                                      : null
                                    }
                                  </div>
                                  <div className="cheque-grid">
                                    {managerChequeList.length === 0 ? (
                                      <div className="no-cheques-container">
                                        <Image
                                          src={Doc_large}
                                          alt="No cheques"
                                          preview={false}
                                          style={{ width: 64, height: 64, opacity: 0.5 }}
                                        />
                                        <div className="no-cheques-text">
                                          No manager cheques have been added yet
                                        </div>
                                      </div>
                                    ): managerChequeList.map((cheque: any, index: any) => (
                                      <Card key={cheque.id} className="afterApproveCard cheque-card min-height-300" title={
                                        <div className="end-to-end">
                                          <span>Cheque {index + 1}</span>
                                          <div className="cheque-card-action-div">
                                          {cheque?.document ? 
                                            <Image
                                                src={BlueEye}
                                                alt="view" 
                                                preview={false} 
                                                className="cheque-card-action-item"
                                                onClick={() => {
                                                  setChequeDocumentIsLoading(true);
                                                  if(cheque?.document?.url?.includes('.pdf')){
                                                    setImagUrl(cheque.document?.url);
                                                    setverifyVisible(true)
                                                  }else{
                                                    setCurrentChequeDetail(cheque.document);
                                                    setViewChequeDetail(true);  
                                                  }
                                                  setChequeDocumentIsLoading(false);
                                                  // setCurrentChequeDetail(cheque.document) //
                                                  // setViewChequeDetail(true)
                                                }}
                                              /> : null }
                                              
                                                <Image 
                                                  src={EditIcon} 
                                                  alt="edit" 
                                                  preview={false} 
                                                  className="cheque-card-action-item"
                                                  onClick={() => editChequeDetals(index)}
                                                /> 
                                              {!cheque?.buyerRequested ? 
                                                <Image 
                                                  src={Itemdelete} 
                                                  alt="delete" 
                                                  preview={false} 
                                                  className="cheque-card-action-item"
                                                  onClick={() => preRemoveChequeItem(index)}
                                                /> : ""}
                                          </div>
                                        </div>
                                      }>
                                        <div className="cheque-preview">
                                          {cheque.document ? (
                                            cheque.document.inputfileid?.includes('.pdf') ? (
                                              <Document file={cheque.document.url}>
                                                <Page pageNumber={1} width={200} />
                                              </Document>
                                            ) : (
                                              <Image 
                                                src={cheque.document.url} 
                                                alt="cheque preview" 
                                                preview={false}
                                                className="cheque-image"
                                              />
                                            )
                                          ) : (
                                            <div className="no-preview">
                                              {/* <FileOutlined /> */}
                                              <div>No Preview</div>
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="cheque-details">                            
                                          <div className="detail-row">
                                            <Popover 
                                              content="Beneficiary Name" 
                                              placement="topLeft"
                                              overlayClassName="info-popover"
                                            >
                                              
                                                <Image
                                                  src={UserHalf}
                                                  alt="user"
                                                  preview={false}
                                                  className="px-1 min-width-25"
                                                />
                                            </Popover>
                                            <span className="stepDetails_sub mb-2 mx-1 mt-1">{cheque.beneficiaryName}</span>
                                          </div>
                                          
                                          <div className="detail-row">
                                            <Popover 
                                              content="Cheque Amount" 
                                              placement="topLeft"
                                              overlayClassName="info-popover"
                                            >
                                              <Image
                                                src={Cheque}
                                                alt="cheque"
                                                preview={false}
                                                className="px-1 min-width-25"
                                              />
                                            </Popover>
                                            <span className="stepDetails_sub mb-2 mx-1 mt-1">{moneyFormat(chequeDetail?.currency, cheque.amount)}</span>
                                          </div>
                                          
                                          {
                                      cheque.referenceNumber ?  
                                          <div className="detail-row">
                                            <Popover 
                                              content="Reference Number" 
                                              placement="topLeft"
                                              overlayClassName="info-popover"
                                            >
                                              <Image
                                                src={Reference}
                                                alt="reference no."
                                                preview={false}
                                                className="px-1 min-width-25"
                                              />
                                            </Popover>
                                            <span className="stepDetails_sub mb-2 mx-1 mt-1">{cheque.referenceNumber}</span>
                                          </div>
                                          : null }

                                      {
                                        cheque.chequeNumber ?  
                                          <div className="detail-row">
                                            <Popover 
                                              content="Cheque Number" 
                                              placement="topLeft"
                                              overlayClassName="info-popover"
                                            >
                                              <Image
                                                src={Reference}
                                                alt="cheque no."
                                                preview={false}
                                                className="px-1 min-width-25"
                                              />
                                            </Popover>
                                            <span className="stepDetails_sub mb-2 mx-1 mt-1">{cheque.chequeNumber}</span>
                                          </div>
                                      : null }
                                          
                                          
                                          <div className="detail-row">
                                                <div className="d-flex">
                                            <Image
                                              src={CommentImg}
                                              alt="company"
                                              preview={false}
                                              className="px-1 min-width-25"
                                            />
                                            <div className="stepDetails_sub_comments mx-1">
                                              <span id="textContainer"> 
                                                  {
                                              cheque?.comment ?  
                                              <CustomTooltip
                                                  text={cheque?.comment}
                                                  maxLength={50}
                                                  overlayClassName="custom-tooltip custom-tooltip-inner"
                                                />
                                              : 'N/A'
                                              }
                                              </span>
                                              <span id="readMoreButton" style={{ display: "none" }}>
                                                {" "}
                                                <Popover
                                                  placement="top"
                                                  className="commentPopover cursor"
                                                  content={cheque.comment ? cheque.comment : 'N/A'}
                                                  trigger="click"
                                                >
                                                  ... Read more
                                                </Popover>
                                              </span>
                                            </div>
                                          </div>
                                          </div>
                                          </div>
                                        </Card>
                                      ))}
                                  </div>  
                                  <div className="d-flex justify-content-between align-items-center mb-2 mt-4 flex-wrap gap-3">
                                    <div className="remaining-amount">
                                      <span className="stepDetails_medium_sub ">Remaining amount: </span>
                                      <span className={`${remainingAmount >= 0 ? 'subText_small fw-400' : 'text-danger'}`}>
                                        {moneyFormat(
                                          chequeDetail?.currency,
                                          remainingAmount.toFixed(2)
                                        )}
                                      </span>
                                    </div>

                                    {(managerChequeList.length > 0 && userType === AuthUserTypes.AUTHORIZER) ? <Button 
                                      type="primary" 
                                      onClick={() => precompleteTransaction()}
                                      className="modal-button w-auto mb-3"
                                    >
                                      Complete transaction
                                    </Button> : null }
                                  </div>
                              
                                </>
                              }

                              { 
                              chequeDetail?.chequeStatus == "5" || (chequeDetail?.transfersStatus != null && chequeDetail?.transfersStatus !== 'FAILED')? 
                                <>
                                { managerChequeList.length ? 
                                <>
                                <hr className="lightgrayHr"/>
                                <Card className="px-4">
                                <div className="stepDetails mt-3"> Prepared manager&apos;s cheques </div>
                                  <div className="cheque-grid">
                                    {managerChequeList.map((cheque: any, index: any) => (
                                      <Card key={index} className="afterApproveCard cheque-card min-height-300" title={
                                        <div className="end-to-end">
                                          <span>Cheque {index + 1}</span>
                                          <div className="cheque-card-action-div">
                                            <Image
                                              src={BlueEye}
                                              alt="view"
                                              preview={false}
                                              className="cheque-card-action-item"
                                              onClick={() => {
                                                setCurrentChequeDetail(cheque.document)
                                                setViewChequeDetail(true)
                                              }}
                                            />
                                          </div>
                                        </div>
                                      }>
                                        <div className="cheque-preview">
                                          {cheque.document ? (
                                            cheque.document.inputfileid?.includes('.pdf') ? (
                                              <Document file={cheque.document.url}>
                                                <Page pageNumber={1} width={200} />
                                              </Document>
                                            ) : (
                                              <Image
                                                src={cheque.document.url}
                                                alt="cheque preview"
                                                preview={false}
                                                className="cheque-image"
                                              />
                                            )
                                          ) : (
                                            <div className="no-preview">
                                              {/* <FileOutlined /> */}
                                              <div>No Preview</div>
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="cheque-details">
                                          <div className="detail-row">
                                            <Popover
                                              content="Beneficiary Name"
                                              placement="topLeft"
                                              overlayClassName="info-popover"
                                            >
                                              <Image
                                                src={UserHalf}
                                                alt="user"
                                                preview={false}
                                                className="px-1 min-width-25"
                                              />
                                            </Popover>
                                            <span className="stepDetails_sub mx-1">{cheque.beneficiaryName}</span>
                                          </div>
                                          
                                          <div className="detail-row">
                                            <Popover
                                              content="Cheque Amount"
                                              placement="topLeft"
                                              overlayClassName="info-popover"
                                            >
                                              <Image
                                                src={Cheque}
                                                alt="cheque"
                                                preview={false}
                                                className="px-1 min-width-25"
                                              />
                                            </Popover>
                                            <span className="stepDetails_sub mx-1">{moneyFormat(chequeDetail?.currency, cheque.amount)}</span>
                                          </div>
                                          
                                          <div className="detail-row">
                                            <Popover
                                              content="Reference Number"
                                              placement="topLeft"
                                              overlayClassName="info-popover"
                                            >
                                              <Image
                                                src={Reference}
                                                alt="reference no."
                                                preview={false}
                                                className="px-1 min-width-25"
                                              />
                                            </Popover>
                                            <span className="stepDetails_sub mx-1">{cheque.referenceNumber}</span>
                                          </div>

                                          {
                                            cheque?.chequeNumber ? 
                                                <div className="detail-row">
                                                <Popover
                                                  content="Cheque number" 
                                                  placement="topLeft"
                                                  overlayClassName="info-popover"
                                                >
                                                  <Image
                                                    src={Reference}
                                                    alt="user"
                                                    preview={false}
                                                    className="px-1 min-width-25"
                                                  />
                                                </Popover>
                                                <span className="stepDetails_sub mx-1">{cheque.chequeNumber}</span>
                                              </div>
                                            : null
                                          }
                                          
                                          <div className="detail-row">
                                            <div className="d-flex">
                                            <Image
                                              src={CommentImg}
                                              alt="company"
                                              preview={false}
                                              className="px-1 min-width-25"
                                            />
                                            <div className="stepDetails_sub_comments mx-1">
                                              <span id="textContainer"> 
                                                  {
                                              cheque?.comment ?  
                                              <CustomTooltip
                                                  text={cheque?.comment}
                                                  maxLength={50}
                                                  overlayClassName="custom-tooltip custom-tooltip-inner"
                                                />
                                              : 'N/A'
                                              }
                                              </span>
                                              <span id="readMoreButton" style={{ display: "none" }}>
                                                {" "}
                                                <Popover
                                                  placement="top"
                                                  className="commentPopover cursor"
                                                  content={cheque.comment ? cheque.comment : 'N/A'}
                                                  trigger="click"
                                                >
                                                  ... Read more
                                                </Popover>
                                              </span>
                                            </div>
                                          </div>
                                          </div>
                                        </div>
                                      </Card>
                                  ))}
                                  </div>
                                  </Card> </> : "" }
                              </>  : ""
                              }
                          </div> 
                          : <>
                              { managerChequeList.length ? <>
                                <hr className="lightgrayHr" />
                                <div className="stepDetails mt-3"> Cheque details </div>
                                <div className="cheque-grid">
                                  {managerChequeList.map((cheque: any, index: any) => (
                                    <Card key={index} className="afterApproveCard cheque-card min-height-300" title={
                                      <div className="end-to-end">
                                        <span>Cheque {index+1} </span> 
                                        { cheque.document ? 
                                            <div className="cheque-card-action-div">
                                              <Image
                                                src={BlueEye}
                                                alt="view"
                                                preview={false}
                                                className="cheque-card-action-item"
                                                onClick={() => {
                                                  
                                                  if(cheque.document.url?.includes('.pdf')){
                                                    setImagUrl(cheque.document?.url);
                                                    setverifyVisible(true)
                                                  }else{
                                                    setCurrentChequeDetail(cheque.document);
                                                    setViewChequeDetail(true);  
                                                  }
                                                }}
                                              />
                                            </div> : null
                                            }
                                      </div>
                                    }>  


                                      <div className="cheque-details">
                                        <div className="detail-row">
                                          <Popover
                                            content="Beneficiary Name"
                                            placement="topLeft"
                                            overlayClassName="info-popover"
                                          >
                                            <Image
                                              src={UserHalf}
                                              alt="user"
                                              preview={false}
                                              className="px-1 min-width-25"
                                            />
                                          </Popover>
                                          <span className="stepDetails_sub mx-1">{cheque.beneficiaryName}</span>
                                        </div>
                                          
                                        <div className="detail-row">
                                          <Popover
                                            content="Cheque Amount"
                                            placement="topLeft"
                                            overlayClassName="info-popover"
                                          >
                                            <Image
                                              src={Cheque}
                                              alt="cheque"
                                              preview={false}
                                              className="px-1 min-width-25"
                                            />
                                          </Popover>
                                          <span className="stepDetails_sub mx-1">{moneyFormat(chequeDetail?.currency, cheque.amount)}</span>
                                        </div>
                                            
                                    {
                                      cheque?.referenceNumber ? 

                                      <div className="detail-row">
                                      <Popover
                                        content="Reference number" 
                                        placement="topLeft"
                                        overlayClassName="info-popover"
                                      >
                                        <Image
                                          src={Reference}
                                          alt="user"
                                          preview={false}
                                          className="px-1 min-width-25"
                                        />
                                      </Popover>
                                      <span className="stepDetails_sub mx-1">{cheque.referenceNumber}</span>
                                    </div> : null
                                    }
                                      

                                      {
                                      cheque?.chequeNumber ? 
                                          <div className="detail-row">
                                          <Popover
                                            content="Cheque number" 
                                            placement="topLeft"
                                            overlayClassName="info-popover"
                                          >
                                            <Image
                                              src={Reference}
                                              alt="user"
                                              preview={false}
                                              className="px-1 min-width-25"
                                            />
                                          </Popover>
                                          <span className="stepDetails_sub mx-1">{cheque.chequeNumber}</span>
                                        </div>
                                      : null
                                    }
                                       

                                        <div className="detail-row">
                                        <div className="d-flex">
                                          <Image
                                            src={CommentImg}
                                            alt="company"
                                            preview={false}
                                            className="px-1 min-width-25"
                                          />
                                          <div className="stepDetails_sub_comments mx-1">
                                            <span id="textContainer"> 
                                                {
                                            cheque?.comment ?  
                                            <CustomTooltip
                                                text={cheque?.comment}
                                                maxLength={50}
                                                overlayClassName="custom-tooltip custom-tooltip-inner"
                                              />
                                            : '--'
                                            }
                                            </span>
                                            <span id="readMoreButton" style={{ display: "none" }}>
                                              {" "}
                                              <Popover
                                                placement="top"
                                                className="commentPopover cursor"
                                                content={cheque.comment ? cheque.comment : '--'}
                                                trigger="click"
                                              >
                                                ... Read more
                                              </Popover>
                                            </span>
                                          </div>
                                        </div>
                                          
                                        </div>
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              </> : "" }
                        </>
                        }
                    </>
                  }

            </Card>
          </div>
        </Col>        
              {Width >= 992 ?
               <Col xs={24} sm={24} md={24} lg={8} xl={8} span={8}> 
                  <div className="flex-end">
                      { id 
                        && chequeDetail?.chequeStatus === "1" 
                        && ((chequeDetail?.buyerAlias == userAlias && ["BUYER", "BUYERPOA"].includes(chequeDetail?.contractStartedBy)) 
                        || (chequeDetail?.sellerAlias == userAlias && ["SELLER", "SELLERPOA"].includes(chequeDetail?.contractStartedBy))) ?  
                      <SecondaryOutLineButton
                          className={"w-100 mx-0"}
                          disabled={disableBtn}
                          children="Edit"
                          htmlType="submit"
                          loading={loading}
                          onClick={() => {
                            onEditTransaction()
                          }}
                        /> 
                      : "" 
                      }
                  </div>
                <Card className="px-2 detailsCard h-auto stages-timeline-card">
                  <div className="stepDetails mb-4 mt-2 mx-2">Stages</div>
                  <HistorySteps
                    screen={'transactionDetails'}
                    chequeHistory={chequeHistory}
                    chequeDetail={chequeDetail} 
                    taxDetails = {taxDetails}
                    setTaxDetails = {setTaxDetails}
                    counterParty = {counterParty} 
                    Width={Width}
                    getContractStages={getContractStages}
                    sellerVerificationHistory={sellerVerificationHistory}
                    isSellerVerified={isSellerVerified}
                  />
                </Card>
              </Col> : ""}
            </Row>
            </DefaultLayout>
    <Modal
      open={error.status}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={() => closeErrorModal()}
      footer={false}
      className="text-center modal-box"
      width={410}
    >
      <Image
        className="mb-4 modal-image"
        src={rejected}
        preview={false}
        width={"40px"} height={"40px"}
      />
      <AuthTitle children={"Warning"} className="mt-3 mb-3"/>
      <BoldText style={{ color: "red" }} children={error.message} />
    </Modal> 


  {/* delete confirmation modal */}
 <Modal
      title={<p className="large-title">Delete prepared cheque </p>}
      width={500}
      centered
      open={deletechequeModel}
      footer={false}
      closable={false}
      className="modal-box text-center"
      onCancel={() => setDeletechequeModel(false)}>
      <div>
      <Image src={rejects} alt="" width={"100px"} height={"100px"} preview={false}/>
        <div className="modal-content-margin">
        <NormalText 
            className="mb-5">
            {`Do you want to delete prepared cheque ?`} 
        </NormalText>
             </div>
              <div className="ant-modal-footer modalFooter center">
                <Button loading={disableBtn} disabled={disableBtn} onClick={() => { removeChequeItem() }} type="primary" className="modal-button">
                  Yes 
                </Button>
              <Button loading={disableBtn} disabled={disableBtn}
                  key="cancel"
                  className="modal-button-cancel"
                  onClick={() => {
                    setDeletechequeModel(false);
                  }}
                >
                  No
                </Button>
              </div>
      </div>
    </Modal>
    

   {/* Confirmation modal */}
   <Modal
      title={<p className="large-title flex-justify-start">Complete transaction</p>}
      width={500}
      centered
      open={releaseModal}
      footer={false}
      closable={false}
      className="modal-box text-center"
      onCancel={() => setReleaseModal(false)}>
        <Form form={feesForm} onFinish={completeTransaction}>
          <div>
            <Card className="p-3 mt-0 payment-transaction-details-card" style={{ width: "100%" }}>
              <Row gutter={[16, 16]} className="mt-3">
                 <Col xs={24}>
                  <p className="add-cheque-category flex-justify-start">
                    Bank fees (optional)
                  </p>
                  <Form.Item
                    name="chequeBankAmount"
                    className="inputField w-100 error-input"
                    dependencies={['chequePlatformFees']}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && value < 0) {
                            return Promise.reject("Value must be positive.");
                          }
                          const platformFees = feesForm.getFieldValue("chequePlatformFees");
                          if (value && platformFees && (Number(value) + Number(platformFees)) !== Number(chequeDetail.totalPlatformFees)) {
                              // We validate this in the Trustin fees field instead
                              return Promise.resolve();    
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter bank fees"
                      suffix={<span className="custom-suffix">{chequeDetail?.currency}</span>}
                    />
                  </Form.Item>
                </Col>
                 <Col xs={24}>
                  <p className="add-cheque-category flex-justify-start">
                    Trustin fees <span className="red">*</span>
                  </p>
                  <Form.Item
                    name="chequePlatformFees"
                    className="inputField w-100 error-input"
                    dependencies={['chequeBankAmount']}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && value < 0) {
                            return Promise.reject("Value must be positive.");
                          }
                          const bankFees = feesForm.getFieldValue("chequeBankAmount") || 0;
                          const totalFees = Number(chequeDetail?.totalPlatformFees || 0);
                          if (totalFees !== 0 && (Number(value) + Number(bankFees)) !== totalFees) {
                            return Promise.reject("Sum of Bank fees and Trustin fees must match the total platform fees.");
                          }
                          if (totalFees == 0 && (Number(value) + Number(bankFees)) !== totalFees) {
                            return Promise.reject("Sum of Bank fees and Trustin fees must match the total platform fees.");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Trustin fees"
                      suffix={<span className="custom-suffix">{chequeDetail?.currency}</span>}
                    />
                  </Form.Item>
                </Col>
               
              </Row>
            </Card>
            <div className="modal-content-margin"></div>
            <div className="ant-modal-footer modalFooter center">
              <Button key="complete" htmlType="submit" loading={disableBtn} disabled={disableBtn} type="primary" className="modal-button">
                Submit
              </Button>
              <Button
                loading={disableBtn}
                disabled={disableBtn}
                key="cancel"
                className="modal-button-cancel"
                onClick={() => {
                  setReleaseModal(false);
                }}
              >
                No
              </Button>
            </div>
          </div>
        </Form>
    </Modal>
 

    <PdfPreviewModal
      isverifyVisible={isverifyVisible}
      setverifyVisible={setverifyVisible}
      imagUrl={imagUrl}
      setImagUrl={setImagUrl}
    />
    
    <Modal
      open={viewChequeDetail}
      footer={false}
      className="modal-box"
      title={
        <span className="change-client-classification">
          Cheque preview
          <hr className="lightgrayHr" />
        </span>
      }
      centered
      width={520}
      onCancel={() => {
        setChequeDocumentIsLoading(false)
        setViewChequeDetail(false)
      }}
    >
      <div className="text-center">
      {chequeDocumentIsLoading && <Spin size="small" className="spin-overlay"/>} 
        {(currentChequeDetail.uploadedFile || []).includes(".pdf") ? (
          <>
           <PdfPreviewModal
            isverifyVisible={isverifyVisible}
            setverifyVisible={setverifyVisible}
            imagUrl={imagUrl}
            setImagUrl={setImagUrl}
          />
          </>
        ) : (
          <Image
            src={currentChequeDetail.url}
            preview={true}
            alt="preview"
            className="max-h-460 my-3"
            onLoad={() => setChequeDocumentIsLoading(false)} 
          />
        )}
      </div>
      {/* <Button type="primary" className="docudownloadBtn" onClick={() =>{downloadFile()}}>Download</Button> */}
    </Modal>
    
    {/* Add Cheque Modal */}
    <Modal
      title={
        <span className="change-client-classification">
        {selectedCheque >= 0 ?  "Edit" :"Add"  } Cheque
          <hr className="lightgrayHr" />
        </span>
      }
      open={showAddChequeModal}
      onCancel={() => {
        setShowAddChequeModal(false);
        form.resetFields();
        setUploadedChequeFile(null);
      }}
      footer={false}
      width={800}
      centered
      className="modal-box"
    >
      <Form
        form={form}
        onFinish={(values) => {
          onSaveCheque(values);
        }}
      >
        <Row gutter={16} className="mt-3">
          <Col xs={24} sm={12}>
            <p className="add-cheque-category">Beneficiary Name <span className="red">*</span></p>
            <Form.Item
              name="beneficiaryName"
              className="inputField w-100 error-input"
              rules={[{ required: true, message: 'Please enter beneficiary name' }]}
            >
              <Input placeholder="Enter beneficiary name"  />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <p className="add-cheque-category">Amount <span className="red">*</span></p>
            <Form.Item
              name="amount"
              className="inputField w-100 error-input"
              rules={[
                { required: true, message: 'Please enter amount' },
                {
                  validator: (_, value) => {
                    const filteredList = managerChequeList.filter((_:any,index:number)=> index != selectedCheque);
                    let validateAmount = chequeDetail.sellerAmount;
                    if(filteredList.length){
                      const totalUsed = filteredList.map((detail :any)=>parseFloat(detail.amount)).reduce((a:number,b:number)=> a+b, 0);
                      validateAmount = parseFloat((parseFloat(validateAmount) - parseFloat(totalUsed)).toFixed(2));
                    }
                    if (value && value <= 0) {
                      return Promise.reject('Amount must be greater than 0');
                    }
                    if(parseFloat(value) > parseFloat(validateAmount)){
                      return Promise.reject(`Amount cannot exceed remaining amount (${moneyFormat(chequeDetail?.currency, parseFloat(validateAmount).toFixed(2))})`);
                    }
                    // if (value > remainingAmount) {
                    //   return Promise.reject(`Amount cannot exceed remaining amount (${moneyFormat(chequeDetail?.currency, remainingAmount.toFixed(2))})`);
                    // }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                type="number"
                placeholder="Enter amount" 
                suffix={
                  <span className="custom-suffix">
                    {chequeDetail?.currency}
                  </span>
                }
              />
              </Form.Item>
            <Form.Item name="buyerRequested" className="d-none"></Form.Item>
          </Col>
    
          <Col xs={24} sm={12}>
            <p className="add-cheque-category">Reference Number<span className="red">*</span> </p>
            <Form.Item
              name="referenceNumber"
              className="inputField w-100 error-input"
              rules={[{ required: true, message: 'Please enter reference number' }]}
            >
              <Input placeholder="Enter reference number" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <p className="add-cheque-category">Cheque Number</p>
            <Form.Item
              name="chequeNumber"
              className="inputField w-100 error-input">
              <Input placeholder="Enter cheque number" />
            </Form.Item>
          </Col>
     
          <Col xs={24} sm={12}>
            <p className="add-cheque-category">Upload cheque document <span className="red">*</span></p>
            <div className="mangercheque-doc-block">
              <div className="d-flex moa-doc-list flex-column" style={{ "width": "158px" }}>
                {uploadedChequeFile ? (
                  <ul className="moa-doc-list-ul mb-0 ">
                    <li className="moa-document-image-block subText_xs">
                      <div>
                        <div className="endtoend mt-3">
                          <Image
                            src={Tick}
                            alt="circle"
                            className="tick_upload"
                            preview={false}
                          />
                        </div>
                        <div style={{ marginTop: -12 }}>
                          <Image src={Doc_large} alt="document" preview={false} />
                          <div className="mt-3 subText_xs overflowText_twoLines w-upload">
                            {uploadedChequeFile.inputfileid || "Document"}
                          </div>
                        </div>
                      </div>
                    </li>
                    <div className="d-flex moa-doc-list document-actions">
                      <div 
                        className="blue_text cursor" 
                        onClick={() => {
                          if(uploadedChequeFile.url?.includes('.pdf')){
                            setImagUrl(uploadedChequeFile?.url);
                            setverifyVisible(true)
                          }else{
                            setCurrentChequeDetail(uploadedChequeFile);
                            setViewChequeDetail(true);  
                          }
                        }}
                      >
                        <Image 
                          preview={false} 
                          src={uploadedChequeFile?.url?.includes('.pdf') ? Pdf : BlueEye} 
                          alt="view" 
                        />
                        <span className="px-1">View</span>
                      </div>
                      <div 
                        className="delete-action cursor" 
                        onClick={() => {
                          if (!loader) {
                            if (uploadedChequeFile?.id) {
                              deleteDocument(uploadedChequeFile.id)
                            }
                          }
                        }}
                      >
                        <Image
                          src={Delete}
                          alt="Delete"
                          preview={false}
                          className="cursor"
                        />
                      </div>
                    </div>
                  </ul>
                ) : (
                  <Dragger
                    {...uploadProps}
                    className="moa-document d-block"
                  >
                    <div >
                       <Image src={PlusUpload} alt="passport" preview={false} />
                       <div>
                        Cheque
                      </div>
                    </div>
                  </Dragger>
                )}
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <p className="add-cheque-category">Comment</p>
            <Form.Item
              name="comment"
              className="inputField w-100 error-input commentError"
              rules={[
                {
                  min: 20,
                  message: "Please enter minimum 20 characters"
                },
                {
                  max: 500,
                  message: "Comment cannot exceed 500 characters"
                }
              ]}
            >
              <TextArea rows={3} placeholder="Enter comment" />
            </Form.Item>
          </Col>
    
          <Col span={24}>
            <div className="d-flex justify-content-end mt-4">
              <Button
                type="primary"
                htmlType="submit"
                className="modal-button w-auto"
                loading={loader}
                disabled={!uploadedChequeFile}
              >
                {selectedCheque >= 0 ?  "Update" :"Add"  } cheque
              </Button>
              <Button
                key="cancel"
                className="modal-button-cancel w-auto mx-2"
                onClick={() => {
                  setShowAddChequeModal(false);
                  form.resetFields();
                  setUploadedChequeFile(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>


      <Modal
        title={
          <div className="modal-title">
            <div className="warning-icon center mt-4">
              <Image src={Warning} alt="Warning" preview={false} height={68} width={75} />
            </div>
            <div className="warning-text center">Warning!</div>
          </div>
        }
        className="modal-box center"
        open={isUserVerifiedCheckModal}
        footer={null}
        closable={false}
        width={410}
      >
        <div className="d-flex sub-text fw-400 flex-column center gap-2">
          {unverifiedUsers.map((email, index) => (
            <div
              key={index}
              className="noWrap center"
            >
              {email} — <span className="text-gray-500">Verification pending</span>
            </div>
          ))}
        </div>
        <div className="d-flex my-4 center">
          <Button
            className="rounded mx-3 mt-3"
            onClick={() => setIsUserVerifiedCheckModal(false)}
          >
            Ok
          </Button>
        </div>
      </Modal>



    <Modal
        className="modal-box reject-box"
        centered
        destroyOnClose={true}
        onCancel={() => setShowRejectWarning(!showRejectWarning)}
        open={showRejectWarning}
        width={410}
        footer={false}
        closable={false}
      >
        <AuthTitle
          children="Please enter reason for rejection..."
          className="modals mt-4 pb-1 "
        />
        <Form onFinish={submitReason}>
          <Form.Item
            name="rejectReason"
            rules={[
              {
                whitespace: true,
                required: true,
                message: "Please enter reason for rejection!",
              },
            ]}
            className="inputField invoice-input py-4"
          >
            <TextArea rows={3} placeholder="Enter reason..." />
          </Form.Item>

          <div className="ant-modal-footer modalFooter">
            <SecondaryOutLineButton
              key="cancel"
              className="cancel"
              onClick={() => setShowRejectWarning(!showRejectWarning)}
            >
              Cancel
            </SecondaryOutLineButton>
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              // loading={loading}
              className="modal-button"
              style={{ height: "46px", width: "115px" }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Modal>


      <Modal
        className="text-center modal-box"
        centered
        open={afterModal}
        width={410}
        onCancel={goBack}
        footer={null}
      >
        <Image
          className="mb-1"
          src={buttonStatus == 'accept' ? approved : rejected}
          preview={false}
          style={{ height: "56px", width: "56px", borderRadius: "50%" }}
        />
        <AuthTitle
          children={afterText}
          className="mt-2"
        />
      </Modal> 
  </div>
);
};

export default ChequeDetails;
