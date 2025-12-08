import {
  AuthTitle,
  BoldText,
  SmallText,
} from "../../ui-elements/TextRepo";
import {
  Button,
  Checkbox,
  Collapse,
  Form,
  Image,
  Modal,
  Popover,
  Row,
  message,
  notification,
} from "antd";

// import * as ibantools from "ibantools";
import {
  SecondaryOutLineButton,
  ViewButton,
} from "../../ui-elements/ButtonRepo";
import { useEffect, useRef, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import Doc from "../../../assets/img/grayDoc.svg";
// import TermsandConditions from '../../../components/Cms-Pages/T&C';
import Download from "../../../assets/img/download.svg";
import TextArea from "antd/lib/input/TextArea";
import Alerts from "../../utilities/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ACTION_WISE_URI_TEXT,
  getLocalStorage,
  ordinalSuffixOf,
  toTitleCase,
  USER_TYPE_TEXT,
} from "../../Common/Constants";
import {
  acceptContractStatus,
  changeContractStatus,
  rejectContractStatus,
  sendDocumentContractAPI,
} from "../../../services/transaction";
import { Dashboard, EscrowTermsandCondition, SuccessTxn } from "../../Common/RouteConst";
import {
  checkEnvStatus,
  createEnvelopeApi,
  deleteSignFile,
  getAllCountries,
  getContractsDetails,
  getlocalBankDetails,
  updateDocusign,
  uploadSignedDoc,
} from "../../../services/user";
import Signature from "../Signature";
import approved from "../../../assets/img/Successpopupicon.svg";
import VerifyModel from "../../Models/VerifyModel";
import UploadModel from "../../Models/UploadModel";
import View from "../../../assets/img/view.svg";
import Warning from "../../../assets/img/warningicon.svg"
import BlueEye from "../../../assets/img/blueEye.svg";
import rejected from "../../../assets/img/reject.svg";
import { getUserData } from "../../../services/admin";
import DeleteIcon from "../../../assets/img/delete.svg"
import EmailIcon from "../../../assets/img/Emailfill.svg"
import dropdownIcon from "../../../assets/img/dropdown.svg"
import SourceOfFunds from "./SourceOfFunds";
import AddBankAccountModal from "../AddBankAccountModal";
import PayoutAccount from "./PayoutAccount";
 
const { Panel } = Collapse;

const PaymentReleaseCondition =(props: object|any):any => {
  const {
    title,
    contractDetail,
    btnText,
    paymentData,
    _fetchPaymentConditions,
    getPaymentDetails,
    initiatePayment,
    paymentDetails,
    payoutAccount, 
    setPayoutAccount,
    bankAccountList,
    setBankAccountList
  } = props;
  const [signature, setSignature] = useState("");
  const [signatureId, setSignatureId] = useState("");
  const [acceptModal, setAcceptModal] = useState(false);
  const [rejectedModal, setRejectedModal] = useState<any>(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [isDeleteFileModalVisible, setIsDeleteFileModalVisible] = useState(false);
  const [isverifyVisible, setverifyVisible] = useState(false);
  const [buttonRequired, setButtonRequired] = useState("");
  const [imageData, setimageData] = useState<any>({});
  const [uploadData, setUploadData] = useState<any>({});
  const [docForEmail, setDocForEmail] = useState("");
  const [idOfContract, setIdOfContract] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [uploadFinishModal, setUploadFinishModal] = useState(false);
  const [contractErrorModel, setContractErrorModel] = useState(false);
  const [contractErrorMessage, setContractErrorMessage] = useState("");
  const [envelopId, setenvelopId] = useState("");
  const [buttonStatus, setButtonStatus] = useState("accept");
  const [docDeleteSuccess, setDocDeleteSuccess] = useState(false);
  const [sendEmailLoading, setSendEmailLoading] = useState({
    loading: false,
  });
  const [showRejectWarning, setShowRejectWarning] = useState(false);
  const uploadSuccess = localStorage.getItem("fileUpload");
  const [docuSignInfoPopup,setDocuSignInfoPopup] = useState<any>(false)
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [openAddBankAccountModal, setOpenAddBankAccountModal] = useState<any>(false);
  const [form] = Form.useForm();
  const UserAlias = JSON.parse(getLocalStorage("auth")!);
  const [docusignStatus, setDocusignStatus] = useState<string | null>(null);
  const [isDeletes,setIsDeletes]= useState<boolean>(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [downloadVisible, setDownloadVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  
  const [sourceOfFundIds, setSourceOfFundIds] = useState<any>([]);
  const [sourceOfFundUrls, setSourceOfFundUrls] = useState<any>([]);

  const [isVerified,setIsVerified]= useState<boolean>(false)
  const fullPath = window.location.pathname;
  const basePath = "/transaction-details/";
  if (!fullPath.includes(basePath)) {
     console.error("Invalid path structure");
     return;
  }
  const pathAfterBase = fullPath.replace(basePath, "");
  const contractId = pathAfterBase.split("&")[0];
  if (!contractId) {
    console.error("Failed to extract valid contractId from URL");
    return;
  }
  // const contractId = window?.location?.pathname.split("/").pop();
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  useEffect(() => {
    getContract(contractId)
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, [])
  const getContract =(id:any) => {
    getContractsDetails(id).then((res:any)=>{
      setDocusignStatus(res?.data?.contractDetails?.getContractDetails?.toSign);      
    }).catch(()=>{
      message.error("Could not fetch contract details. Please try again later!")
    })
  }

  const navigate = useNavigate();
  const userDetails = JSON.parse(getLocalStorage("auth")!);
  const userData = {
    state: {
      name: JSON.parse(getLocalStorage("auth")!)?.name,
      userAlias: JSON.parse(getLocalStorage("auth")!)?.userAlias,
      email: JSON.parse(getLocalStorage("auth")!)?.email,
    },
  };
  const downloadFile = (url: any) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template.xlsx");
    document.body.appendChild(link);
    link.click();
  };
  const handleAction = async (
    contractId: any,
    action: any,
    userAlias: any,
    remarks = ""
  ) => {
    if (action === "REJECT") {
      if (
        contractDetail.contractStartedBy === "SELLER" &&
        contractDetail.buyerDetails.currency !== contractDetail.currency
      ) {
        action = "INVALID";
      }
      if (
        contractDetail.contractStartedBy === "BUYER" &&
        contractDetail.sellerDetails.currency !== contractDetail.currency
      ) {
        action = "INVALID";
      }
      _fetchPaymentConditions()
    }
    if (action == "ACCEPT_REJECT") {
      if(userAlias === contractDetail?.sellerAlias) {
        const bankResponse = await getlocalBankDetails(String(userAlias));
        if (bankResponse?.data?.bankDetails?.length === 0 ) {
          setLoading(false);
          setOpenAddBankAccountModal(true);
          return false;
        }
      }
      const body: any = {
        remarks: remarks,
        toSign: signatureId,
      };

      if(paymentDetails?.contractStartedBy === "SELLER") {
        if(!sourceOfFundIds.length){
          message.error("Please upload source of funds documents.");  
          setLoading(false);
          return
        }
        body["sourceOfFunds"] = sourceOfFundIds;
      }
      
      if(paymentDetails?.contractStartedBy === "BUYER") {
          body["payoutAccountAlias"] = payoutAccount?.aliasName;
      }
 
      acceptContractStatus(contractId, userAlias, body)
        .then(() => {
          _fetchPaymentConditions()
          setLoading(false);
          if (action === "ACCEPT_REJECT") {
            setAcceptModal(true);
            setTimeout(() => {
              navigate(Dashboard,{state:{"isAccountOpened" :true}});

            }, 3000);
          }
        })
        .catch((error) => {
          setLoading(false);
          setContractErrorModel(true);
          if(error?.status === 400) {
            setContractErrorMessage("There is an issue while processing your request. Please try again later")
          } else if (error?.data?.message) {
            setContractErrorMessage(error.data.message);
          } else if (error?.data) {
            // let errorMsg = Object.values(error?.data)[0].message;
            const errorMsg: any = error?.data[0].message;
            setContractErrorMessage(errorMsg);
          } else if (error?.error) {
            setContractErrorMessage(error.error);
          } else {
            setContractErrorMessage("An unexpected error occurred. Please try again.");
          }
        });
    } else {
      if(action === "REJECT") {
        rejectContractStatus(contractId, userAlias, remarks)
        .then(() => {
          _fetchPaymentConditions()
          setLoading(false);
          setRejectedModal(true);
          setTimeout(() => {
            navigate(Dashboard);
          }, 3000);
        })
        .catch((error) => {
          setLoading(false);
          setContractErrorModel(true);
          if(error?.status === 400) {
            setContractErrorMessage("There is an issue while processing your request. Please try again later")
          } else if (error?.data?.message) {
            setContractErrorMessage(error.data.message);
          } else if (error?.data) {
            const errorMsg: any = error?.data[0].message;
            setContractErrorMessage(errorMsg);
          } else if (error?.error) {
            setContractErrorMessage(error.error);
          } else {
            setContractErrorMessage("Internal server error");
          }
        });
      } else {
        changeContractStatus(
          contractId,
          ACTION_WISE_URI_TEXT[action],
          userAlias,
          remarks
        )
        .then(() => {
          _fetchPaymentConditions()
          setLoading(false);
          if (action === "SEND") {
            navigate(SuccessTxn, {
              state: {
                contractId: contractId,
                url: `${window.location.protocol}//${window.location.host}/transaction-details/${contractId}&src=sharing`,
                userAlias: userAlias,
              },
            });
          }
        })
        .catch((error: any) => {
          setLoading(false);
          setContractErrorModel(true);
          if(error?.status === 400) {
            setContractErrorMessage("There is an issue while processing your request. Please try again later")
          } else if (error?.data?.message) {
            setContractErrorMessage(error.data.message);
          } else if (error?.data) {
            const errorMsg: any = error?.data[0]?.message;
            setContractErrorMessage(errorMsg);
          } else if (error?.error) {
            setContractErrorMessage(error?.error);
          } else {
            setContractErrorMessage("Internal server error");
          }
        });
      }
    }    
  };
  
  const checkFiles = () => {
    const files = paymentData?.filelist;
    if (
      files?.length == paymentData?.milestoneList?.[0]?.documentList?.length
    ) {
      const checkURL = (data: any) => {
        return data?.url != "" || data?.url != null;
      };
      const allfiles = files?.every(checkURL);
      if (allfiles === true) {
        setUploadFinishModal(true);
        localStorage.removeItem("fileUpload");
      }
    }
  };
  const createEnvelope = () => {
    const payload = {
      uri: paymentData.pdfId,
      email: userData.state.email,
      name: userData.state.name,
      transactionId: paymentData.aliasName,
      data: "toEnvelope",
    };
    createEnvelopeApi(payload)
      .then((res: any) => {
        setenvelopId(res.data.envelopeId);
      })
      .catch(() => {});
  };
  const openNotification = (msg = "") => {
    notification.error({
      message: "error",
      description: msg ? msg : "Please sign document",
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    });
  };
  
  const onAddBankAccountSuccess = () => {
    getlocalBankDetails(userAlias)
      .then((response) => {
        setBankAccountList(response.data.bankDetails);
        const primaryAccount = response.data.bankDetails?.find((account: any) => account.isPrimary);
        form.setFieldsValue({
          payout_account: primaryAccount?.aliasName,
        });
        setPayoutAccount(primaryAccount);
      })
      .catch();
  }

  const changeStatusHandler = async () => {
    setLoading(true);
    try {
      const res = await checkEnvStatus(envelopId);
      if (res.data.status === "completed") {
        updateDocusign({
          contractId,
          userAlias: userData.state.userAlias,
          statusId: 2,
        })
          .then(() => {
            uploadSignedDoc({ id: envelopId, contractId })
              .then(() => {
                setLoading(false);
                setAcceptModal(true);
                setTimeout(()=> {
              
                  navigate(Dashboard,{state:{"isAccountOpened" :true}});

                },3000)
              })
              .catch(() => {
                setLoading(false);
                openNotification("Some thing went's wrong");
              });
          })
          .catch((error: any) => {
            setLoading(false);
            setContractErrorModel(true);
            if (error?.data?.message) {
              setContractErrorMessage(error.data.message);
            } else if (error?.data) {
              // let errorMsg: any = Object.values(error?.data)[0].message;
              const errorMsg: any = error?.data[0].message;
              setContractErrorMessage(errorMsg);
            } else if (error?.error) {
              setContractErrorMessage(error.error);
            } else {
              setContractErrorMessage("Internal server error");
            }
            console.log("Error", error);
          });
      } else {
        openNotification("P:anylease sign document");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const onFinish = () => {
    if (buttonStatus === "sign") {
      createEnvelope();
      return;
    }
    if(!signatureId){
      message.error("Please upload signature.");  
      return
    }
    if (envelopId) {
      changeStatusHandler();
      return;
    }
    if(!envelopId || (envelopId && docusignStatus !== null)) {
    setLoading(true);
    // if ( contractDetail.contractAction === "ACCEPT_REJECT" 
    //   && ((contractDetail.contractStartedBy === "SELLER" && contractDetail.buyerDetails.currency !== contractDetail.currency) || (contractDetail.contractStartedBy === "BUYER" && contractDetail.sellerDetails.currency !== contractDetail.currency))
    // ) {
    //   handleAction(contractId, "INVALID", userData.state.userAlias);
    // } else {
    //   handleAction(
    //     contractId,
    //     contractDetail.contractAction,
    //     userData.state.userAlias
    //   );
    // }
    handleAction(contractId, contractDetail.contractAction, userData.state.userAlias);
  }
  };
  useEffect(() => {
    if (
      uploadSuccess !== null &&
      uploadSuccess !== undefined &&
      uploadSuccess == "true"
    ) {
      checkFiles();
    }
  }, [uploadSuccess]);
  useEffect(() => {
    return () => {
      localStorage.removeItem("fileUpload");
    };
  }, []);
  useEffect(()=>{
if(uploadFinishModal == true){
  getPaymentDetails()
}
  },[uploadFinishModal])

  const handleVerify = (
    txnID: any,
    imgUrl: any,
    key: any,
    imageId: any,
    docName: any
  ) => {
    setLoading(true)
    const obj = {
      id: imageId,
      txn_ID: txnID,
      img_Url: imgUrl,
      key_d: key
    };

    setimageData(obj);
    setverifyVisible(true);
    setDocForEmail(docName);
    setButtonRequired("");
    setLoading(false)
  };
  
  const handleUpload = (txnID: any, docName: any) => {
    setLoading(true);
    const obj = { txn_ID: txnID };
    setUploadData(obj);
    setisModalVisible(true);
    setDocForEmail(docName);
    setIdOfContract(contractId);
    setLoading(false)
  };

  const openTnC = () => {
    // setVisible(true);
    window.open(EscrowTermsandCondition,'_blank')
  };

  const submitReason = (values: any) => {
    handleAction(
      contractId,
      "REJECT",
      userData.state.userAlias,
      values?.rejectReason
    );
  };

  // to send document and contract detail email.
  const sendEmailHandler = async (data: any, value: any) => {
    setSendEmailLoading({ 
      loading: true 
    });
    const loadingMessage = message.loading("Sending Email", 0);

    try {
      const payload:any = {
        contractId,
        userAlias: userData.state.userAlias,
        email: userData.state.email,
        name: userData.state.name,
        docId:value?.inputfileid,
      };
      if(paymentData?.isMilestone){
        payload["milestoneAlias"] = data?.aliasName
      }

      await sendDocumentContractAPI(payload);

      message.success("Email Sent Successfully");
    } catch (error: any) {
      message.error(error?.data?.message || "Something went wrong");
    } finally {
      setSendEmailLoading({ loading: false });
      loadingMessage();
    }
  };
 

  const isEmailDisabled = (file: any) => {
    if(file?.sentMailAt){
      const sentDate = new Date(file?.sentMailAt);
      if (!isNaN(sentDate.getTime())) {
        const now = Date.now();
        const diffInHours = (now - sentDate.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24;
      }
    }
    return false;
  };

  const onclickDocusignPopup = () => {
    setDocuSignInfoPopup(false);
  }

  useEffect(() => {
    getAllCountries()
      .then((response: any) => {
        getUserData(UserAlias?.email)
          .then((res: any) => {
            const countryName = response?.data.filter(
              (country: any) => country.isoCode === res?.data?.countryAlias
            )[0]?.name;
            const currencySymbol = response?.data.filter(
              (country: any) => country.isoCode === res?.data?.countryAlias
            )[0]?.currency?.isoCode;
            form.setFieldsValue({ countryIsoCode: countryName });
            form.setFieldsValue({ currency: currencySymbol });
          })
      })
  }, []);

   //handle delete button
   const handleDeletebutton = ()=>{
    if(contractDetail?.buyerDetails?.email === userData.state.email || paymentData?.filelist[0]?.verified==="VERIFIED"){
        setIsVerified(true)
        setIsDeletes(false) 
      }
      else if(userDetails.userType === "ADMIN"){
        setIsVerified(true)
        setIsDeletes(false); 
      }
      else{
        setIsVerified(false)
        setIsDeletes(false); 

      }
   }
   const handleDeletebuttons = () => {
    setIsDeletes(true); 
  };


   let advisorStatus = true;
   if (contractDetail.escrowAdvisorAlias 
     && ![contractDetail?.buyerAlias, contractDetail?.sellerAlias].includes(contractDetail?.escrowAdvisorAlias)) {
       if (contractDetail?.escrowAdvisorDetails?.userType !== 'ESCROW_ADVISOR' 
         || !contractDetail?.escrowAdvisorDetails?.ekycStatus) { //check if advisor has joined or not 
           advisorStatus = false;
       }
   }

   const deleteDoc = (id: any) =>{
    const deleteFileLoading= message.loading('Deleting file', 0)
    deleteSignFile({fileID: id}).then(()=>{
      getPaymentDetails();
      setDocDeleteSuccess(true)
      setIsDeleteFileModalVisible(false)
      deleteFileLoading()
      message.success('File deleted successfully')
    }).catch((err:any)=>{
      if(err)
        deleteFileLoading()
        message.error('Unable to delete file. Please try again later!')
        setIsDeleteFileModalVisible(false)
    })
  }

  const buttonRef = useRef<HTMLButtonElement | null>(null);
    const location = useLocation();
    const triggerevent =location.state?.triggerButton

    useEffect(() => {
        // Check if the trigger condition is passed via state
        if (triggerevent) {
          setTimeout(() => {
            if (buttonRef.current ) {
                const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                buttonRef.current.dispatchEvent(event);
            }
        }, 1000);
        }
        else {
          console.warn('buttonRef is null');
      }
    }, [triggerevent]);
  return (
    <>
      <hr className="lightgrayHr" />
      <div className="stepDetails mt-3" style={{whiteSpace: "wrap"}}>{title}</div>
      {paymentData?.isMilestone ? (
        // In case of milestone
        <Collapse
          defaultActiveKey={paymentData?.milestoneList
            ?.map((item: any) => item.isActive)
            .indexOf(true)}
          expandIconPosition={"right"}
          ghost
          className="mt-4"
        >
          {paymentData?.milestoneList?.map((data: any, index: any) => {
            return (
              <Panel
                header={`${ordinalSuffixOf(index + 1)} milestone - ${
                  data.name
                }`}
                key={index}
                className="border-bottom payment-condition"
              >
                {data?.documentList?.map((data2: any, index: any) => {
                  return (
                    <div
                      className={Width > 1200 ?"d-inline-flex align-items-center w-100 position-relative mb-2 mt-3" : "d-flex flex-column w-100 position-relative mb-2 mt-3"}
                      key={index}
                    >
                      
                      <span className={Width  > 1200 ? "d-inline-flex align-items-center w-auto" :"d-flex align-items-center w-auto"}>
                      {/* <FiFileText className="me-2 text-muted fs-20x" /> */}
                      <Image src={Doc} preview={false } className="text-muted fs-20x file-img"/>
                      <div className="mx-3" style={{maxWidth:"870px", minWidth:"100px"}}>
                            <div className="stepDetails_medium_sub">
                                {toTitleCase(data2?.name)}
                            </div>
                        </div>
                    </span>
                      {paymentData?.filelist.filter(
                        (val: any) => val.inputfileid == data2.aliasName
                      ).length > 0
                        ? paymentData?.filelist.map((val: any) => {
                         
                            if (val.inputfileid === data2.aliasName) {
                              return (
                                <>
                                <div className="d-flex  align-items-center w-100">
                                <div className={Width > 425 ? "d-flex align-items-center w-100" : "d-flex flex-column align-items-start w-100"}>
                                  <div className="d-inline-flex align-items-center w-auto position-relative endtoend mt-2 gap-2">
                                  <Popover
                                    content={
                                      <>
                                        Click this icon to <br />
                                        preview attached file
                                      </>
                                    }
                                     placement="bottom"
                                    trigger="hover"
                                    open={popoverVisible === val.id}
                                    onOpenChange={(visible) => setPopoverVisible(visible ? val.id : null)}
                                  >
                                   <span
                                      className="preview-file cursor"
                                      onClick={() => {
                                        setPopoverVisible(false);
                                        handleVerify(
                                          data2.aliasName,
                                          val.url,
                                          val.key,
                                          val.id,
                                          data2.name
                                        );
                                        setButtonRequired("d-none");
                                        handleDeletebutton()
                                      }}
                                    >
                                      <Image
                                        src={BlueEye}
                                        alt="id"
                                        className="d-flex"
                                        preview={false}
                                        height={16}
                                        width= {22} 
                                      />
                                    </span>
                                    
                                  </Popover>
                                  {contractDetail?.contractStatus != "-1" 
                                  &&(contractDetail?.buyerAlias !== userData?.state?.userAlias)
                                  ?
                                    <Popover
                                      content={
                                        <>
                                          Click this icon to <br/>
                                          delete attached file
                                        </>
                                      }
                                       placement="bottom"
                                      trigger={"hover"}
                                      open={deleteVisible === val.id}
                                      onOpenChange={(visible) => setDeleteVisible(visible ? val.id : null)}
                                    >
                                      <span
                                        className="preview-file cursor"
                                        onClick={() => {
                                          setDeleteVisible(false)
                                          const obj = {
                                            id: val.id,
                                            txn_ID: data2.aliasName,
                                            img_Url: val.url,
                                            key_d: val.key
                                          };
                                          setimageData(obj);
                                          setIsDeleteFileModalVisible(true)
                                        }}
                                      >
                                        <Image className="d-flex" src={DeleteIcon} height={16} width={22} preview={false} />
                                      </span>
                                  </Popover>
                                 : ""}
                                  <Popover
                                    content={
                                      <>
                                        Click this icon to <br />
                                        download attached file
                                      </>
                                    }
                                     placement="bottom"
                                    trigger={"hover"}
                                    open={downloadVisible === val.id}
                                    onOpenChange={(visible) => setDownloadVisible(visible ? val.id : null)}
                                  >
                                    <span
                                      className="preview-file cursor"
                                      onClick={() => {
                                        setDownloadVisible(false)
                                        downloadFile(val.url);
                                        setButtonRequired("d-none");
                                      }}
                                    >
                                      <Image className="d-flex" src={Download} height={16} width={22} preview={false} />
                                    </span>
                                  </Popover>
                                  {contractDetail?.contractStatus != "-1" ?
                                    <Popover
                                      content={
                                        <>
                                          Click this icon to <br />
                                          email attached file
                                        </>
                                      }
                                      placement="bottom"
                                      trigger={"hover"}
                                      open={emailVisible === val.id}
                                      onOpenChange={(visible) => setEmailVisible(visible ? val.id : null)}
                                    > 
                                      <span
                                        className={`preview-file ${isEmailDisabled(val) ? 'email-icon-disabled' : ''}`}
                                        onClick={()=> {
                                          if (!isEmailDisabled(val)) {
                                            setEmailVisible(false);
                                            sendEmailHandler(data,val)
                                          }
                                        }}
                                      >
                                        <Image className="d-flex" src={EmailIcon} height={16} width={22} preview={false} />
                                      </span>
                                    </Popover>
                                 : ""}
                                </div>
                                  <div className={Width > 425 ? "w-100 d-flex justify-content-end mt-2" : "w-100 d-flex justify-content-start mt-2"}>
                                  {
                                    // If the status is null, it means document has already been uploaded, buyer will verify and seller will see the option to re-upload.
                                    !val.verified && (
                                      <>
                                        {contractDetail?.sellerDetails
                                          ?.email === userData.state.email && (
                                          <div className="d-flex align-items-center">
                                            <Button
                                              className="blue-status modal-button disabled "
                                              disabled
                                            >
                                              Uploaded
                                            </Button>
                                          </div>
                                        )}
                                        {contractDetail?.buyerDetails?.email ===
                                          userData.state.email && (
                                          <>
                                            <Button
                                            ref={buttonRef}
                                            loading={loading}
                                              onClick={() =>{
                                                handleVerify(
                                                  data2.aliasName,
                                                  val.url,
                                                  val.key,
                                                  val.id,
                                                  data2.name
                                                );
                                              handleDeletebutton()}
                                              }
                                              className="blue-status modal-button"
                                            >
                                              {" "}
                                              Verify
                                            </Button>
                                          </>
                                        )}
                                      </>
                                    )
                                  }                                
                                  {
                                    val.verified === "VERIFIED" && (
                                      <>
                                        <span className="green-status">
                                          Verified{" "}
                                          {val.verifyRole === "TRUSTEE" &&
                                            "by approver"}
                                          {val.verifyRole === "AUTHORIZER" &&
                                            "by authorizer"}
                                          {val.verifyRole === "SENIOR_MANAGEMENT" &&
                                            "by senior manager"}
                                        </span>
                                      </>
                                    )
                                  }
                                  {
                                    val.verified === "REJECTED" &&
                                      contractDetail?.sellerDetails?.email ===
                                        userData.state.email && (
                                        <>
                                        <div className="d-flex align-items-center">
                                          <Popover
                                            title="Rejected Reason"
                                            content={
                                              <>
                                                {val.verifyRole === "TRUSTEE" &&
                                                  "Rejected by approver because "}
                                                {val?.rejectedReason}
                                              </>
                                            }
                                            placement="bottom"
                                            className="mt-3"
                                          >
                                            <span className="ms-2 fs-12x rejected-because">
                                              Remarks{" "}
                                              <InfoCircleOutlined className="fs-14x ms-1" />
                                            </span>
                                          </Popover>
                                          <span className="rejectedreasontext mx-4 mt-3">
                                            (Reason : {val?.reason})
                                          </span>
                                          <Button
                                          loading={loading}
                                            onClick={() =>
                                              handleUpload(
                                                data2.aliasName,
                                                data2.name
                                              )
                                            }
                                            className="float-end blue-status modal-button"
                                          >
                                            {" "}
                                            Reupload
                                          </Button>
                                          </div>
                                        </>
                                      )
                                  }
                                  {val.verified === "REJECTED" &&
                                    contractDetail?.buyerDetails?.email ===
                                      userData.state.email && (
                                      <>
                                        <Popover
                                          title="Rejected Reason"
                                          content={val?.rejectedReason}
                                          placement="bottom"
                                        >
                                          <span className="ms-2 fs-12x rejected-because">
                                            Remarks{" "}
                                            <InfoCircleOutlined className="fs-14x ms-1" />
                                          </span>
                                        </Popover>
                                        <span className="rejectedreasontext mx-4 ">
                                          (Reason : {val?.reason})
                                        </span>
                                        <span className="red-status mb-2">
                                          Rejected{" "}
                                          {val.verifyRole === "TRUSTEE" &&
                                            "by approver"}
                                        </span>
                                      </>
                                    )}
                                    </div>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          })
                        : contractDetail?.sellerDetails?.email ===
                            userData.state.email &&
                          data?.paymentStatus === "COMPLETED" &&
                          paymentData?.isContractVerify &&
                          data?.isTransactionVerified &&
                          data?.isActive && (
                            <>
                              <>
                                {paymentData?.isDispute ||
                                paymentData?.disputeDetails
                                  ?.isGenerated || contractDetail?.contractStatus == "-1" ? null : (
                                    <div className={Width > 1200 ? "w-100 d-flex align-items-center justify-content-end" : "w-100 d-flex align-items-center justify-content-center mt-2"}>
                                      <Button
                                      ref={buttonRef}
                                      loading={loading}
                                        onClick={() =>
                                          handleUpload(data2.aliasName, data2.name)
                                        }
                                        disabled={false}
                                        className="float-end blue-status modal-button"
                                      >
                                        {" "}
                                       Upload  
                                      </Button>
                                  </div>
                                )}
                              </>
                            </>
                          )}
                    </div>
                  );
                })}
                { !contractDetail?.isAgreementFull ?   <div className="center mt-4">
                  {(data.isActive && !paymentData?.disputeDetails?.isGenerated &&
                    paymentData?.filelist?.length > 0 &&
                    userType === "USER" &&
                    userAlias === paymentDetails?.buyerAlias &&
                    paymentData?.filelist?.[0]?.verified === "VERIFIED" &&
                    data.trusteeApproveStatus === "1" &&
                    data.approveStatus === '1' &&
                    data.releaseStatus !== "1" &&
                    parseInt(contractDetail?.contractStatus) < 7) && (
                      <Button
                        type="primary"
                        className="mx-2 modal-button initiate-payment"
                        onClick={() => initiatePayment()}
                        loading={loading}
                      >
                        Initiate Payment
                      </Button>
                    )
                  }
                </div> : ''}
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        // In case of no milestone
        <>
           {docDeleteSuccess && (
            <Alerts
              className="mb-1 px-3"
              showIcon
              closable
              description="File deleted successfully"
              type="success"
            />
          )}
            {paymentData?.milestoneList?.map((data: any) => {
              return data?.documentList?.map((data2: any, index: any) => {
                return (
                  <div
                    className={Width > 1200 ?"d-inline-flex align-items-start w-100 position-relative mb-2 mt-3" : "d-flex flex-column  w-100 position-relative mb-2 mt-3"}
                    key={index}
                  >
                    <span className={Width  > 1200 ? "d-inline-flex align-items-start w-auto" :"d-flex align-items-start w-auto"}>
                      {/* <FiFileText className="me-2 text-muted fs-20x" /> */}
                      <Image src={Doc} preview={false } className="text-muted fs-20x" style={{width:'18px',height:'auto'}}/>
                      <div className="mx-3 " style={{minWidth:"100px", maxWidth:"870px"}}>
                            <div className="stepDetails_medium_sub product-details-word-wrap">
                                {toTitleCase(data2?.name)}
                    
                            </div>
                        </div>
                    </span>
                    {paymentData?.filelist.filter(
                      (val: any) => val.inputfileid == data2.aliasName
                    ).length > 0
                      ? paymentData?.filelist.map((val: any) => {
                          if (val.inputfileid === data2.aliasName) {
                            return (
                              <>
                            <div className="d-flex align-items-start w-100">
                            <div className={Width > 425 ? "d-flex align-items-start w-100" : "d-flex flex-column align-items-start w-100"}>
                              
                            <div className="dropdown dropdown-end res-dropdown">
                              <button
                                className="btn p-0 border-0 bg-transparent"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ boxShadow: "none" }}
                              >
                                <Image src={dropdownIcon} alt="dropdown_icon" preview={false} />
                              </button>
                              <ul className="dropdown-menu">
                                <li><Popover
                                  content={
                                    <>
                                      Click this icon to <br/>
                                      preview attached file
                                    </>
                                  }
                                   placement="bottom"
                                  trigger="hover"
                                  open={popoverVisible === val.id}
                                  onOpenChange={(visible) => setPopoverVisible(visible ? val.id : null)}
                                >
                                  <a
                                    className="preview-file cursor dropdown-item text-start d-flex justify-content-start algin-items-center" href="#"
                                    onClick={() => {
                                      setPopoverVisible(false);
                                      handleVerify(
                                        data2.aliasName,
                                        val.url,
                                        val.key,
                                        val.id,
                                        data2.name
                                      );
                                      setButtonRequired("d-none");
                                     handleDeletebutton()
                                    }}
                                  >
                                    <Image className="" src={View} height={16} width={22} preview={false} />
                                    <span className="ms-2">View</span>
                                  </a>
                                </Popover></li>
                                 <li>{contractDetail?.sellerDetails
                                          ?.email === userData.state.email && (
                                <Popover
                                  content={
                                    <>
                                      Click this icon to <br/>
                                      delete attached file
                                    </>
                                  }
                                   placement="bottom"
                                  trigger={"hover"}
                                  open={deleteVisible === val.id}
                                  onOpenChange={(visible) => setDeleteVisible(visible ? val.id : null)}
                                >
                                  <a
                                    className="preview-file cursor dropdown-item text-start d-flex justify-content-start algin-items-center" href="#"
                                    onClick={() => {
                                      setDeleteVisible(false)
                                      handleVerify(
                                        data2.aliasName,
                                        val.url,
                                        val.key,
                                        val.id,
                                        data2.name
                                      );
                                      setButtonRequired("d-none");
                                    //  handleDeletebutton()
                                    handleDeletebuttons()
                                    }}
                                  >
                                    <Image className="" src={DeleteIcon} height={16} width={22} preview={false} />
                                    <span className="ms-2">Delete</span>
                                  </a>
                                </Popover>
                                          )}</li>
                      <li><Popover
                                  content={
                                    <>
                                      Click this icon to <br />
                                      download attached file
                                    </>
                                  }
                                   placement="bottom"
                                  trigger={"hover"}
                                  open={downloadVisible === val.id}
                                  onOpenChange={(visible) => setDownloadVisible(visible ? val.id : null)}
                                >                                  
                                  <a
                                    className="preview-file cursor dropdown-item text-start d-flex justify-content-start algin-items-center" href="#"
                                    onClick={() => {
                                      setDownloadVisible(false)
                                      downloadFile(val.url);
                                      setButtonRequired("d-none");
                                    }}
                                  >
                                    <Image  src={Download} height={16} width={22} preview={false} />
                                    <span className="ms-2">Download</span>
                                  </a>
                                </Popover></li>
                              <li>{contractDetail?.contractStatus != "-1" ? 
                                
                                // <Button
                                //   className="blue-status ms-2 zindex-0 modal-button w-auto mx-2"
                                //   onClick={() => sendEmailHandler(data,val)}
                                //   loading={sendEmailLoading.loading}
                                // >
                                //   Send Email
                                // </Button>
                                <Popover
                                  content={
                                    <>
                                      Click this icon to <br />
                                      email attached file
                                    </>
                                  }
                                   placement="bottom"
                                  trigger={"hover"}
                                  open={emailVisible === val.id}
                                  onOpenChange={(visible) => setEmailVisible(visible ? val.id : null)}
                                >                                  
                                  <a
                                    className={
                                      `preview-file cursor dropdown-item text-start d-flex justify-content-start algin-items-center ${isEmailDisabled(val) ? 'email-icon-disabled' : ''}`
                                    }
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (!isEmailDisabled(val)) {
                                        setEmailVisible(false);
                                        sendEmailHandler(data, val)
                                      }
                                    }}
                                  >
                                    <Image  src={EmailIcon} height={16} width={18} preview={false}
                                    loading={sendEmailLoading.loading ? "eager" : "lazy"}/>
                                    <span className="ms-2">Send an Email</span>
                                  </a>
                                </Popover>
                                
                                : ""}</li>
                    </ul>
                  </div>
                              <div className="d-inline-flex align-items-center w-auto position-relative endtoend gap-2 res-pay-icons">
                                <Popover
                                  content={
                                    <>
                                      Click this icon to 
                                      preview attached file
                                    </>
                                  }
                                   placement="bottom"
                                >
                                  <span
                                    className="preview-file cursor"
                                    onClick={() => {
                                      handleVerify(
                                        data2.aliasName,
                                        val.url,
                                        val.key,
                                        val.id,
                                        data2.name
                                      );
                                      setButtonRequired("d-none");
                                     handleDeletebutton()
                                    }}
                                  >
                                    <Image className=" mt-1" src={View} height={16} width={22} preview={false} />
                                  </span>
                                </Popover>
                                 {contractDetail?.sellerDetails
                                          ?.email === userData.state.email && (
                                <Popover
                                  content={
                                    <>
                                      Click this icon to <br/>
                                      delete attached file
                                    </>
                                  }
                                  placement="bottom"
                                  trigger={"hover"}
                                  open={deleteVisible === val.id}
                                  onOpenChange={(visible) => setDeleteVisible(visible ? val.id : null)}
                                >
                                  <span
                                    className="preview-file cursor"
                                    onClick={() => {
                                      handleVerify(
                                        data2.aliasName,
                                        val.url,
                                        val.key,
                                        val.id,
                                        data2.name
                                      );
                                      setButtonRequired("d-none");
                                    //  handleDeletebutton()
                                    handleDeletebuttons()
                                    }}
                                  >
                                    <Image className=" mt-1" src={DeleteIcon} height={16} width={22} preview={false} />

                                  </span>
                                </Popover>
                                          )}
                                <Popover
                                  content={
                                    <>
                                      Click this icon to <br />
                                      download attached file
                                    </>
                                  }
                                   placement="bottom"
                                >                                  
                                  <span
                                    className="preview-file cursor"
                                    onClick={() => {
                                      downloadFile(val.url);
                                      setButtonRequired("d-none");
                                    }}
                                  >
                                    <Image  src={Download} height={16} width={22} preview={false} />
                                  </span>
                                </Popover>
                                {contractDetail?.contractStatus != "-1" ? 
                                
                                // <Button
                                //   className="blue-status ms-2 zindex-0 modal-button w-auto mx-2"
                                //   onClick={() => sendEmailHandler(data,val)}
                                //   loading={sendEmailLoading.loading}
                                // >
                                //   Send Email
                                // </Button>
                                <Popover
                                  content={
                                    <>
                                      Click this icon to <br />
                                      email attached file
                                    </>
                                  }
                                   placement="bottom"
                                >                                  
                                  <span
                                    className={`preview-file ${isEmailDisabled(val) ? 'email-icon-disabled' : ''}`}
                                  >
                                    <Image  src={EmailIcon} height={16} width={18} preview={false}  onClick={() => !isEmailDisabled(val) && sendEmailHandler(data, val)}
                                    loading={sendEmailLoading.loading ? "eager" : "lazy"}/>
                                  </span>
                                </Popover>
                                
                                : ""}
                              </div>
                              <div className={Width > 425 ? "w-100 d-flex justify-content-end" : "w-100 d-flex justify-content-start mt-2"}>
                                {
                                  // If the status is null, it means document has already been uploaded, buyer will verify and seller will see the option to re-upload.
                                  !val.verified &&
                                    contractDetail?.contractStatus === "2" && (
                                      <>
                                        {contractDetail?.sellerDetails
                                          ?.email === userData.state.email && (
                                          <div className={Width > 550 ? "d-flex align-items-center gap-2": "mt-3" }>
                                            <Button
                                              className="blue-status modal-button disabled zindex-0"
                                              disabled
                                            >
                                              Uploaded 
                                            </Button>
                                           
                                          </div>
                                        )}
                                        {contractDetail?.buyerDetails?.email ===
                                          userData.state.email && (
                                          <>
                                            <Button
                                            ref={buttonRef}
                                              onClick={() =>{
                                                handleVerify(
                                                  data2.aliasName,
                                                  val.url,
                                                  val.key,
                                                  val.id,
                                                  data2.name
                                                );
                                                handleDeletebutton()
                                              }}
                                              className="blue-status modal-button"
                                            >
                                              {" "}
                                              Verify
                                            </Button>
                                          </>
                                        )}
                                      </>
                                    )
                                }
                                {
                                  // If the status is verified, seller and buyer both will see it as verified.
                                  val.verified === "VERIFIED" && (
                                    <>
                                      <span className="green-status">
                                        Verified{" "}
                                        {val.verifyRole === "TRUSTEE" &&
                                          "by approver"}
                                        {val.verifyRole === "AUTHORIZER" &&
                                            "by authorizer"}
                                          {val.verifyRole === "SENIOR_MANAGEMENT" &&
                                            "by senior manager"}
                                      </span>
                                    </>
                                  )
                                }
                                {
                                  // If the status is rejected, buyer will see rejected and seller will see the option to reupload along with rejected.
                                  val.verified === "REJECTED" &&
                                    contractDetail?.sellerDetails?.email ===
                                      userData.state.email && (
                                      <>
                                      <div className="d-flex align-items-center">
                                        <Popover
                                          title="Rejected Reason"
                                          content={
                                            <>
                                              {val.verifyRole === "TRUSTEE" &&
                                                "Rejected by approver because "}
                                              {val?.rejectedReason}
                                            </>
                                          }
                                          placement="bottomLeft"
                                        >
                                          <span className="ms-2 fs-12x rejected-because">
                                            Remarks{" "}
                                            <InfoCircleOutlined className="fs-14x ms-1" />
                                          </span>
                                        </Popover>
                                        <span className="rejectedreasontext mx-4">
                                          (Reason : {val?.reason})
                                        </span>
                                        <Button
                                        loading={loading}
                                          onClick={() =>
                                            handleUpload(
                                              data2.aliasName,
                                              data2.name
                                            )
                                          }
                                          className="float-end blue-status modal-button"
                                        >
                                          Reupload
                                        </Button>
                                        </div>
                                      </>
                                    )
                                }
                                {val.verified === "REJECTED" &&
                                  contractDetail?.buyerDetails?.email ===
                                    userData.state.email && (
                                    <>
                                      <Popover
                                        title="Rejected Reason"
                                        content={
                                          <>
                                            {val.verifyRole === "TRUSTEE" &&
                                              "Rejected by approver because "}
                                            {val?.rejectedReason}
                                          </>
                                        }
                                        placement="bottomLeft"
                                      >
                                        <span className="ms-2 fs-12x rejected-because">
                                          Remarks{" "}
                                          <InfoCircleOutlined className="fs-14x ms-1" />
                                        </span>
                                      </Popover>
                                      <span className="rejectedreasontext mx-4 ">
                                        (Reason : {val?.reason})
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                              </>
                            );
                          }
                        })
                      : paymentData.isContractVerify && contractDetail?.sellerDetails?.email ===
                          userData.state.email &&
                        data?.paymentStatus === "COMPLETED" && (
                          <>
                            {paymentData?.isDispute ||
                            paymentData?.disputeDetails?.isGenerated || contractDetail?.contractStatus == "-1" ? null : (
                              <div className={Width > 1200 ? "w-100 d-flex align-items-center justify-content-end" : "w-100 d-flex align-items-center justify-content-center mt-2"}>
                              <Button 
                              id="upload"
                              loading={loading}
                              ref={buttonRef}
                                onClick={() =>{ 
                                
                                  handleUpload(data2.aliasName, data2.name);
                                }}
                                className="float-end blue-status mb-2 div-end modal-button"
                              >
                                Upload
                              </Button>
                              </div>
                            )}
                          </>
                        )}
                  </div>
                );
              });
            })}
            { !contractDetail?.isAgreementFull ?
            <div className="center mt-4">
              {(!paymentData?.disputeDetails?.isGenerated &&
                paymentData?.filelist?.length > 0 &&
                userType === "USER" &&
                userAlias === paymentDetails?.buyerAlias &&
                paymentData?.filelist?.[0]?.verified === "VERIFIED" &&
                paymentData?.milestoneList?.[0]?.trusteeApproveStatus === "1" &&
                paymentData?.milestoneList?.[0]?.approveStatus === "1" &&
                paymentData?.releaseStatus !== "1" &&
                parseInt(contractDetail?.contractStatus) < 7) && (
                  <Button
                    type="primary"
                    className="mx-2 modal-button initiate-payment"
                    onClick={() => initiatePayment()}
                    loading={loading}
                  >
                    Initiate Payment
                  </Button>
                )
              }
            </div> : ''}
        </>
      )}
      {paymentData?.isExpired === false && ( paymentData.updatedBy !== userData?.state?.userAlias && paymentData?.contractStatus === "1") &&(
        <div className="">
          {btnText === "Accept" && (
            <>
              <Form onFinish={onFinish} className="mt-5" form={form} >
                <>
                  {paymentData?.isMilestone ? null : <hr className="lightgrayHr" />}
                  
                  {paymentData?.contractStartedBy === USER_TYPE_TEXT.SELLER && userAlias == contractDetail?.buyerAlias && 
                  <>
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
                    <hr className="lightgrayHr" />
                  </>
                  }
                  {paymentData?.contractStartedBy === USER_TYPE_TEXT.BUYER && userAlias === paymentData?.sellerAlias && 
                  <>
                    <PayoutAccount
                      payoutAccount={payoutAccount} 
                      setPayoutAccount={setPayoutAccount} 
                      form={form} 
                      setOpenAddBankAccountModal={setOpenAddBankAccountModal}
                      bankAccountList={bankAccountList}
                    />
                    <hr className="lightgrayHr" />
                  </>
                  }
                  <Signature
                    signature={signature}
                    setSignature={setSignature}
                    signatureId={signatureId}
                    setSignatureId={setSignatureId}
                    setLoading={setLoading}
                    name="toSign"
                    signatureReq={true}
                    contractExist={true}
                    envolopeId={envelopId}
                  />
                </>
                <hr className="lightgrayHr" />
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
                <div className={Width > 400 ? "d-flex gap-3": "d-flex gap-2 flex-column"}>
                  {btnText === "Accept" && (
                      <Button
                      key="submit"
                      style={{width:'140px'}}
                      type="primary"
                      className={Width > 400 ? "modal-button-cancel mt-2": "modal-button-cancel mt-2 w-auto"}
                      onClick={() => {
                        setShowRejectWarning(true)
                      }}
                      loading={loading}
                    >
                      Reject
                    </Button>
                  )}
                  {(btnText === "Accept" || btnText === "Send") && (
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        onClick={() => setButtonStatus("accept")}
                        className={Width > 400 ? "modal-button mt-2": "modal-button mt-2 w-auto"}
                      >
                        {btnText}
                      </Button>
                  )}
                </div>
              </Form>
            </>
          )}
        </div>
      )}
      {
        <div>
          {paymentData?.contractStatus === "-1" &&
            paymentData?.rejecteReason && (
              <>
              <div className="my-3">
                <div className="stepDetails_medium_sub">Rejected reason: </div> 
                <div className="subText_xs bold fw-400 mt-2">
                  {paymentData?.rejecteReason}
                </div>
              </div>
              </>
            )}
        </div>
      }
      {
        !advisorStatus && (
          <div className="mt-3">
           
            <span style={{color: 'red'}}
              children={"NOTE: Payment would not be released until escrow advisor joins the platform"}
            ></span>
          </div>
        )
      }

      <UploadModel
        transactionId={uploadData.txn_ID}
        setisModalVisible={setisModalVisible}
        isModalVisible={isModalVisible}
        _fetchPaymentConditions={_fetchPaymentConditions}
        docForEmail={docForEmail}
        getPaymentDetails={getPaymentDetails}
      />

      <VerifyModel
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        docDeleteSuccess={docDeleteSuccess}
        setDocDeleteSuccess={setDocDeleteSuccess}
        imageData={imageData}
        _fetchPaymentConditions={_fetchPaymentConditions}
        docForEmail={docForEmail}
        idOfContract={idOfContract}
        stateData={userDetails}
        buttonRequired={buttonRequired}
        _getPaymentDetails={getPaymentDetails}
        isVerified={isVerified}
        isDeletes={isDeletes}
        setIsDeletes={setIsDeletes} 

      />

      <Modal
        className="text-center modal-box"
        centered
        open={acceptModal}
        width={410}
        footer={null}
      >
        <Image
          className="mb-1"
          src={approved}
          preview={false}
          style={{ height: "56px", width: "56px", borderRadius: "50%" }}
        />
        <AuthTitle
          children="TrustIn escrow transaction accepted!"
          className="mt-2"
        />
      </Modal>

      <Modal
        className="text-center modal-box"
        centered
        open={rejectedModal}
        width={410}
        footer={null}
      >
        <Image className="mb-1" src={rejected} preview={false} style={{ height: '56px', width: '56px', borderRadius: '50%', opacity: '0.5' }} />
        <AuthTitle
          children={
            <>
              TrustIn <br /> escrow transaction rejected!
            </>
          }
          className="mt-2"
        />
      </Modal>
      <Modal
        className="text-center modal-box"
        centered
        open={contractErrorModel}
        onCancel={() => setContractErrorModel(false)}
        width={410}
        footer={null}
      >
        <Image className="mb-1" src={rejected} preview={false} style={{ height: '56px', width: '56px', borderRadius: '50%' }} />
        <AuthTitle children={contractErrorMessage} className="mt-2" />
      </Modal>
      {/* <Modal
        title="General Terms and conditions"
        centered
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={800}
        bodyStyle={{ overflowY: 'scroll' }}
        footer={false}
        wrapClassName="termsOfUse w-100"
        zIndex="99"
        className='modal-box'
      >
        <TermsandConditions />
      </Modal> */}
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
        open={uploadFinishModal}
        onCancel={() => {
          setUploadFinishModal(false);
        }}
        width={500}
        footer={false}
        className="modal-box"
      >
        <div>
          <AuthTitle
            children={
              <Image
                className="mb-1"
                src={approved}
                preview={false}
                style={{ height: "80px", width: "80px", borderRadius: "50%" }}
              />
            }
            className=" mt-3 mb-3"
            style={{ textAlign: "center" }}
          />

          <AuthTitle
            children="Success!"
            className=" mt-3 mb-4"
            style={{ textAlign: "center",fontSize:'30px' }}
          />

          <p className="message-para text-center success-text">
            Dear Customer, Your documents have been uploaded for review. Please
            wait until the documents got verified.
          </p>
        </div>
      </Modal>

      <Modal
        open={docuSignInfoPopup}
        footer={false}
        className="text-center modal-box"
        width={500}
        closable={false}
      >
        <Image
          src={Warning}
          alt="Warning"
          preview={false}
          height={68}
          width={75}
        />
        <AuthTitle children={"Warning!"}  style={{
          marginTop: "12px",
          fontSize: "32px",
          fontWeight: "400px",
          color: "red",
        }}/>
        <BoldText children="Please check your email for signing contract document After signing the document you can click on Accept button to continue with contract." />
       
        <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-4"
              onClick={()=>{onclickDocusignPopup()}}
            >
              Ok
            </Button>
          
          </div>
      </Modal>
      <AddBankAccountModal open={openAddBankAccountModal} setOpen={setOpenAddBankAccountModal} onSuccess={onAddBankAccountSuccess}/>

      <Modal
        title={
          <div className="modal-title">
            <div className="warning-icon center mt-4">
              <Image
                src={Warning}
                alt="Warning"
                preview={false}
                height={68}
                width={75}
              />
            </div>
            <div className="warning-text center bold">Warning!</div>
          </div>
        }
        className="modal-box center"
        open={isDeleteFileModalVisible}
        footer={null}
        closable={false}
        onCancel={() => setIsDeleteFileModalVisible(false)}
        width={Width > 767 ? 500 : 400}
      >
        <p className="sub-text fw-400 center mx-5">
        Are you sure you want to delete this ID Proof?
        </p>
        <div className="d-flex center">
          <Button
            className="rounded mx-3 my-4"
            htmlType="submit"
            onClick={() => deleteDoc(imageData.id)}
          >
            Delete
          </Button>
          <Button
            className="rounded_cancel_btn my-4"
            onClick={() => setIsDeleteFileModalVisible(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PaymentReleaseCondition;
