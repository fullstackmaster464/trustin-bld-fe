import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  Image,
  Modal,
  Popover,
  Row,
  Select,
  Spin,
  Steps,
  Tooltip,
  message,
  notification
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import EscrowTransationHistorySteps from "./EscrowTransactionHistorySteps";
// @ts-ignore
import OTPInput from "otp-input-react";
import Email from "../../assets/img/Email_outline.svg";
import Flag from "../../assets/img/whiteFlag.svg";
import Globe from "../../assets/img/white_globe.svg";
import Payment from "../../assets/img/white_payment.svg";
import UserFull from "../../assets/img/User_Full.svg";
import WhiteUserFull from "../../assets/img/WhiteUserFull.svg";
import bankAcc from '../../assets/img/bankacc.svg';
import BlueEye from "../../assets/img/blueEye.svg";
import Clock from "../../assets/img/clock_light.svg";
import Doc from "../../assets/img/grayDoc.svg";
import Id from "../../assets/img/id.svg";
import Job from "../../assets/img/job_white.svg";
import LeftArrow from "../../assets/img/leftArrow.svg";
import MoveTo from "../../assets/img/moveTo.svg";
import Refund from "../../assets/img/refund.svg";
import Reason from "../../assets/img/refundReason.svg";
import Reject from "../../assets/img/reject.svg";
import Suitcase from "../../assets/img/sellerJob.svg";
import WarningIcon from "../../assets/img/warningicon.svg";
import Success from "../../assets/img/success.svg";
import thank_you from "../../assets/img/thank_you.svg";
import TransactioType from "../../assets/img/transactionType.svg";
import WhiteEmail from "../../assets/img/white_email.svg";
import { AddFund, Dashboard, EditEscrow, Resolve_Dispute, TransactionDetail } from "../Common/RouteConst";
import PDFPreview from "../Common/PdfPreviewIcon";



import { InfoCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import {
  getContractDetails,
  getContractHistory,
  getItemTypeCategoryByItemAlias,
  getPaymentDetails,
  getTransactionListToVerify,
  getTxnData,
  getUserByAlias,
  getUserData,
  getUserPlatformFees,
  verifyContract,
  virtualAccountDetails
} from "../../services/admin";
import {
  addFundsByApprover,
  addReleaseV2Data,
  blockOrUnblockFunds,
  generateContractOtp,
  getAllDisputesList,
  initiatePayment,
  verifyContractOtp
} from "../../services/transaction";
import {
  ACTION_LABEL,
  AuthUserTypes,
  PLATFORM_CHARGE_APPLIED_ON,
  TRANSACTION_TYPE,
  TXN_STATUS,
  USER_TYPE_TEXT,
  contractStatusMap,
  getLocalStorage,
  modifyCresetUserType,
  moneyFormat,
  ordinalSuffixOf,
  toTitleCase,
  setLocalStorage,
  getFormattedValue
} from "../Common/Constants";
import { AuthTitle, BoldText, NormalText, SmallText } from "../ui-elements/TextRepo";

import SuccessFund from "../../assets/img/Successpopupicon.svg";
import rejected from "../../assets/img/reject.svg";
import { emailAfterKycPending, emailAfterNotCompliant, emailAfterReleaseDoc, emailForBankNotAdded, emailForTrusteeApproval, getContractListByContractStatus, getForexExchangeRate, getPaymentLogsByTransactionAlias, getWalletTotalAmountAndCount, getlocalBankDetails, saveDispute, updateContract, updateContractPayoutAccount } from "../../services/user";
import DefaultLayout from "../Common/DefaultLayout";
import { CalculateTransactionFee, calculateUserPlatformFee } from "../Common/InvoiceCalculations";
import DisputePdfViewModal from "../Models/DisputePdfViewModal";
import TrusteeReleaseCondition from "../Trustee/TrusteeReleaseCondition";
import PaymentReleaseCondition from "../User/NewTransaction/PaymentReleaseCondition";
import CustomContractDetails from "../User/NewTransaction/customContractList";
import { LinkButton, MainButtonRound, SecondaryOutLineButton, ViewButton } from "../ui-elements/ButtonRepo";
import { InputText } from "../ui-elements/InputsRepo";
import Alerts from "../utilities/Alert";
import AdminReleaseCondition from "./AdminReleaseCondition";
import SourceOfFundDetails from "../User/NewTransaction/sourceOfFundDetails";
import UpdatePayoutAccountModal from "./UpdatePayoutAccountModal";
import Meta from "antd/es/card/Meta";

const TransactionDetails = ():any => {
  const navigate = useNavigate();
  const { Panel } = Collapse;
  // const antIcon = <LoadingOutlined style={{ fontSize: 30, color:"#013399" }} spin />;
  const id = window?.location?.pathname.split("/").pop();
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const userData = JSON.parse(getLocalStorage("auth")!);
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [contractStatus, setcontractStatus] = useState<any>({});
  const [kycVerified, setKycVerified] = useState(false);
  const [File, setFile] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [fromParty, setFromParty] = useState<any>({});
  const [toParty, setToParty] = useState<any>({});
  const [categoryDetails, setCategoryDetails] = useState<any>({});
  const [activePayment, setActivePayment] = useState(0);
  const [paymentComplete, setPaymentComplete] = useState(true);
  const [trustinAlias, settrustinAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [contractHistory, setContractHistory] = useState<any>({});
  const [contractDetail, setContractDetail] = useState<any>({});
  const [customAttachURL, setCustomAttachURL] = useState<any>("");
  const [customAttachmentUrls, setCustomAttachmentUrls] = useState<any>([]);
  const [isVerifyModal, setIsVerifyModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contractList, setContractList] = useState([]);
  const [fundAddedSuccessModal, setFundAddedSuccessModal] = useState<boolean>(false);
  const [fundAddedErrorModal, setFundAddedErrorModal] = useState<boolean>(false);
  const [fundAddedErrorModalMsg, setFundAddedErrorModalMsg] = useState<string>("");
  const [unBlockModal, setUnBlockModal] = useState(false);
  const [unBlockFailureModal, setUnBlockFailureModal] = useState(false);
  const [buyerDetail, setBuyerDetail] = useState<any>({});
  const [btnText, setBtnText] = useState<any>("");
  const params = useLocation();
  const [messageVisible, setMessageVisible] = useState<any>(false);
  const [disputeList,setDisputeList] = useState<any>();
  const UserEmail = JSON.parse(getLocalStorage("auth")!)?.email;
  const contractId = window?.location?.pathname.split("/").pop();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [trusteeDetails, setTrusteeDetails] = useState<any>({});
  const [taxDetails,setTaxDetails]= useState<any>({});
  const [vATransactions, setVATransactions] = useState<any>();
  const [walletAmountAndCount, setWalletAmountAndCount] = useState<any>([]);
  const [customContractList, setCustomContractList] = useState<any>();
  const [invoiceCal, setInvoiceCal] = useState<any>([]);
  const [milestoneCal, setmilestoneCal] = useState<any>([]);
  const [escrowAdvisorDetails, setEscrowAdvisorDetails] = useState<any>();
  const [otpModal, setOtpModal] = useState<any>();
  const [error, setError] = useState<any>({ status: false, message: "" });
  const [success, setSuccess] = useState<any>({ status: false, message: "" });
  const [btnLoader, setBtnLoader] = useState<any>(false);
  const [resendbtnLoader, setResendBtnLoader] = useState<any>(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOTP]= useState<any>("");
  const [otpError, setOtpError] = useState("");
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [btnStatus, setBtnStatus] = useState("")
  const careEmailAddress = process.env.CARE_EMAIL;
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const [releaseStatusMsg, setReleaseStatusMsg] = useState("");
  const [releaseVisible, setReleaseVisible] = useState(false);
  const [releaseModal,setReleaseModal] = useState(false);
  const [showTrusteeApproval, setShowTrusteeApproval] = useState(false);
  // const [primaryAccount,setPrimaryAccount] = useState<any>("");
  const [sellerBankDetails, setSellerBankDetails] = useState<any>(null);
  const [escrowAdvisorBankDetails, setEscrowAdvisorBankDetails] = useState<any>(null);
  const [inProgressPaymentLogList, setInProgressPaymentLogList] = useState<any>([]);
  const [buyervirtualAccount, setBuyerVirtualAccount] = useState<any>([]);
  const [inProgressPaymentRelease, setInProgressPaymentRelease] = useState<boolean>(false);
  const [popupAmount, setPopupAmount] = useState<any>();
  const [commonErrorModal, setCommonErrorModal] = useState<boolean>(false);
  const [commonErrorMessage, setCommonErrorMessage] = useState<string>("");
  const releaseStatusList = [
    "INITIATED",
    "KYC_NOT_COMPLETED",
    "NOT_COMPLIANT",
    "BANK_NOT_ADDED",
    "INSUFFICIENT_FUNDS",
    "INITIATE_PAYMENT_PENDING"
  ];
  const [blueCardLoader, setBlueCardLoader] = useState<any>(true);
  const [payoutAccount, setPayoutAccount] = useState<any>(null);
  const [forexExchangeRate, setForexExchangeRate] = useState<number | undefined>();
  const [isForexExchangeRateLoading, setIsForexExchangeRateLoading] = useState(false);
  const [bankAccountList, setBankAccountList] = useState<any>([])
  const [openUpdatePayoutAccountModal, setOpenUpdatePayoutAccountModal] = useState<boolean>(false);
  let sellerMilestoneAmount = 0;
  let allMilestonePlatformFee = 0;

  const masterDocument : string = process.env.TRUSTIN_CRESET_MASTER_DOC_LINK || "";
  const CRESET_USERS = process.env.CRESET_USERS ? process.env.CRESET_USERS.split(',').map(user => user.trim()): [];

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
    if (
      !["5", "9", "10"].includes(paymentDetails?.contractStatus ?? "") &&
      paymentDetails?.currency != null && 
      (payoutAccount?.accountCurrency ?? payoutAccount?.currency) != null && 
      paymentDetails?.currency !== (payoutAccount?.accountCurrency ?? payoutAccount?.currency) &&  
      (userAlias === paymentDetails?.sellerAlias || [
        "TRUSTEE",
        "ADMIN",
        "AUTHORIZER",
        "SENIOR_MANAGMENT"]
       .includes(userType)
      )
    ) {
      setIsForexExchangeRateLoading(true);
      getForexExchangeRate({sourceCurrencyCode: paymentDetails?.currency, destinationCurrencyCode: payoutAccount?.accountCurrency ?? payoutAccount?.currency, srcAmount: "1"}).then((response: any) => {
        setForexExchangeRate(response.data.sell.amount);
      }).finally(() => {
        setIsForexExchangeRateLoading(false)
      })
    }
  }, [payoutAccount?.accountCurrency, payoutAccount?.currency, paymentDetails?.currency])

  const { Step } = Steps;
  const openNotification = (msg = "") => {
    notification.info({
      message: "Error",
      description: msg ? msg : "Please sign document",
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    });
  };

  const getBankList = (data:any) =>{
    setLoading(false)
    if(data.sellerAlias){
      getlocalBankDetails(data.sellerAlias)
      // getlocalBankDetails(paymentDetails.escrowAdvisorAlias)
      .then((response) => {
        setLoading(false)
        // setUserBankList(response?.data?.bankDetails);
        response?.data?.bankDetails?.find((item:any) => {   
          if (item.isPrimary) {
            setSellerBankDetails(item)
          }
        });
      })
      .catch(() => {
      setLoading(false)
      });
    }
    if(data.buyerAlias && data?.currency){
      virtualAccountDetails(data.buyerAlias, data?.currency)
      .then((response:any) => {
        setLoading(false)
        setBuyerVirtualAccount(response?.data?.VADetails);
      })
      .catch(() => {
        setLoading(false)
      });
    }
    totalAmountAndCount(data.buyerAlias, data.currency);

    if(data.escrowAdvisorAlias){
      getlocalBankDetails(data.escrowAdvisorAlias)
      .then((response) => {
        setLoading(false)
        // setEscrowBankList(response?.data?.bankDetails);
        response?.data?.bankDetails?.find((item:any) => {
          if (item.isPrimary) {
            setEscrowAdvisorBankDetails(item)
          }
        });
      })
      .catch(() => {
        setLoading(false)
      });
    }
  }

  const totalAmountAndCount = (userAlias: string, currency: string) => {
    getWalletTotalAmountAndCount(userAlias, currency)
      .then((response) => {
        const walletData = response.data?.walletTransaction;
        if (walletData) {
          setWalletAmountAndCount(walletData);
        }
      })
      .catch(() => {
        setWalletAmountAndCount([]);
        setLoading(false);
      });
  };   
    // getlocalBankDetails(paymentDetails.sellerAlias)
  




  useEffect(() => {
    if (otp?.length < 4 && otp != "") {
      setOtpError("Enter Valid code!");
    } else {
      setOtpError("");
    }
  }, [otp]);  

  const { state } = useLocation();
  const timeOutCallback = useCallback(() => {
    setTimer((currTimer: number) =>  currTimer!= 0 ? currTimer - 1 : currTimer);
  }, []);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
    if (timer == 0) {
      setSuccess({ status: false, message: "" });
    }
  }, [timer, timeOutCallback]);

  const resendOTP = () => {
    setResendBtnLoader(true);
    if (timer === 0) {
      generateContractOtp(paymentDetails,userAlias)
        .then(() => {
          setSuccess({
            status: true,
            message: "OTP has been sent to your email",
          });
          setTimer(60);
          setTimeout(() => {
            setSuccess({
              status: false,
              message: "",
            });
          }, 5000);
          setResendBtnLoader(false);
          setError({ status: false, message: "" });
        })
        .catch((err: any) => {
          setSuccess({ status: false, message: "" });
          setResendBtnLoader(false);
          setError({
            status: true,
            message: err.data.message
          });
        });
    }
  };

  const onFinishOtp = async () => {
    setBtnLoader(true)
    verifyContractOtp({...state, aliasName: paymentDetails?.aliasName, otp})
    .then(async (response: any) => {
        setBtnLoader(false);
      if ([201, 200].includes(response.status)) {
        setOtpModal(false)
        if(btnStatus === "initiate_payment") {
          releasePayment()
        } else if(btnStatus === "raise_dispute") {
          showModal();
        }
      }
    })
    .catch((err: any) => {
      setOTP("");
        setBtnLoader(false);
        setError({
            status: true,
            message: err.data.message
        });
        setSuccess({ status: false, message: "" })
    });
  };

  const releasePayment = async () => {
    const contractDetails = {...paymentDetails}
    setLoading(true);
    const milestonrelease = contractDetails?.milestoneList;
    if (milestonrelease.length === 0) {
      openNotification("NO ACTIVE MILESTONE");
      return false;
    }

    const bankResponse = await getlocalBankDetails(String(contractDetails?.sellerAlias));
    if (!payoutAccount && bankResponse?.data?.bankDetails?.length === 0 ) {
      setReleaseVisible(true);
      setReleaseModal(false);
      // alert('NO PRIMARY BANK ADDED')
      setLoading(false)
      emailForBankNotAdded(contractDetails?.aliasName)
        .then(() => {
          setReleaseStatusMsg("BANK_NOT_ADDED");
        })
        .catch(() => {
          openNotification("No BANK DETAILS FOUND FOR SELLER");
        });
      return false;
    }

    if(contractDetails?.contractStartedBy === USER_TYPE_TEXT?.ESCROW_ADVISOR) {
      const advisorBankResponse = await getlocalBankDetails(String(contractDetails?.escrowAdvisorAlias));
      if (advisorBankResponse?.data?.bankDetails?.length === 0 ) {
        setReleaseVisible(true);
        setReleaseModal(false);
        // alert('NO PRIMARY BANK ADDED')
        setLoading(false)
        setReleaseStatusMsg("BANK_NOT_ADDED");
        openNotification("No BANK DETAILS FOUND FOR ESCROW ADVISOR");
        return false;
      }
    }

    let releaseStatus: any;
    let Obj: any ={};

    milestonrelease.map((milestone: any) => {
      if (milestone.isActive && milestone.documentStatus !== "VERIFIED") {
        openNotification("YOUR DOCUMENT IS NOT VERIFIED");
        return false;
      } else if(milestone.isActive){
        Obj = {
          contractAlias: String(contractDetails?.aliasName),
          userAlias: String(contractDetails?.sellerAlias),
          transactionAlias: String(milestone?.aliasName),
          contractId: String(contractDetails?.agreementId),
          transactionID: String(milestone?.id),
          userId: String(contractDetails?.sellerAlias),
          amount: String(milestone?.transactionAmount),
          notes: "Test",
        };
        releaseStatus = milestone.releaseStatus;
      }
    })
    if(!releaseStatus && ((!contractDetail?.isAgreementFull && userAlias === contractDetails?.buyerAlias) || (contractDetail?.isAgreementFull && (['AUTHORIZER','TRUSTEE']).includes(userType))) ) {
      await initiatePayment(Obj)
      .then((response: any) => {
        if (response?.status === 200 || response?.status === 201 ) {
          setLoading(false);

          setReleaseModal(false); 
          setReleaseVisible(true);
          setReleaseStatusMsg("INITIATED");
          setTimeout(() => {
            // navigate(Dashboard);
             window?.location?.reload();
          }, 3000);
        } else {
          openNotification("THERE WAS SOME ISSUE WHILE PROCESSING YOUR REQUEST");
          return false;
        }
      })
      .catch((error: any) => {
        setLoading(false)
        if (releaseStatusList.includes(error?.data)) {
          if (error.data === "KYC_NOT_COMPLETED") {
            emailAfterKycPending(contractDetails?.aliasName)
              .then(() => {
                setReleaseStatusMsg(error?.data);
              })
              .catch((err) => {
                console.log("Error", err);
                openNotification("COMPLETE THE KYC PROCESS TO RELEASE PAYMENT ")
              });
          } else {
            setReleaseStatusMsg(error?.data)
          }
        }
        else {
          setReleaseVisible(true);
          setReleaseStatusMsg("Bad Request")
        }

        setReleaseModal(false);
        return false;
      });
    } else {
      if( paymentDetails?.sourceOfFunds && paymentDetails?.sourceOfFunds?.length > 0 && paymentDetails.sourceOfFundStatus !== "APPROVED") {
        setReleaseModal(false);
        setCommonErrorModal(true);
        setCommonErrorMessage("Please approve source of fund documents to continue with release payment.");
        return false;
      }
      setInProgressPaymentRelease(true);
      await addReleaseV2Data(Obj)
        .then((response) => {
          setInProgressPaymentRelease(false);
          if (response?.status === 200 || response?.status === 201 ) {
            setLoading(false);
            setReleaseVisible(true);
            emailAfterReleaseDoc(Obj.contractAlias);
            setReleaseModal(false)
            setReleaseStatusMsg("SUCCESS");
            setTimeout(() => {
              // setReleaseStatusMsg("INITIATED");
              // navigate(Dashboard);
               window?.location?.reload();
            }, 3000);
          } else {
            setReleaseModal(false)
            openNotification("THERE WAS SOME ISSUE WHILE PROCESSING YOUR REQUEST");
            return false;
          }
        })
        .catch((error: any) => {
          setLoading(false);
          setReleaseModal(false);
          setInProgressPaymentRelease(false);
          if (releaseStatusList.includes(error?.data?.message ? error?.data?.message : error?.data.length > 0 ? error?.data?.[0]?.message : error?.data)) {
            setReleaseVisible(true);
            if (error.data === "KYC_NOT_COMPLETED") {
              emailAfterKycPending(contractDetails?.aliasName)
                .then(() => {
                  setReleaseStatusMsg(error?.data);
                })
                .catch((err) => {
                  console.log("Error", err);
                  openNotification("COMPLETE THE KYC PROCESS TO RELEASE PAYMENT ")
                });
            } else if (error.data === "NOT_COMPLIANT") {
              emailAfterNotCompliant(contractDetails?.aliasNam)
                .then(() => {
                  setReleaseStatusMsg(error?.data)
                })
                .catch(() => {
                  openNotification("RELEASE PAYMENT, IF ALL STEPS ARE FULFILLED")
                });
            }  else {
              setReleaseStatusMsg(error?.data?.message)
            }
          }
          else {
            setReleaseVisible(true);
            setReleaseStatusMsg("Bad Request")
          }
          return false;
        });
    }
    if (milestonrelease[0]?.trusteeApproveStatus !== "1" && milestonrelease[0]?.releaseStatus === "1") {
      setLoading(false);
      setShowTrusteeApproval(true);
      //mail add trustee
      emailForTrusteeApproval(contractDetails?.aliasNam);
      setReleaseModal(false)
      return false;
    }
  }

  const updateContracts = (event: any)=>{
    const payload = { isAgreementFull: event.target.checked};
    updateContract(payload,contractDetail.aliasName)
      .then(() => {
        setTimeout(() => {
          window?.location?.reload();
        }, 1000);
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
  }

  const addFundsApprover = (contractId: string, transactionAlias: string, buyerAmount: string) => {
    setLoading(true);
    addFundsByApprover(contractId, buyerAmount, transactionAlias, userAlias)
      .then((response: any) => {
        setLoading(false);
        if([200,201].includes(response?.status)) {
          setFundAddedSuccessModal(true);
        } else {
          console.log("response add funds", response)
          setFundAddedErrorModal(true);
          setFundAddedErrorModalMsg(response?.data?.error);
        }
      }) 
      .catch((error: any) => {
        setLoading(false);
        const errorMessage = error?.data?.message || error?.data?.[0]?.message || error?.data?.error || "Internal server error";
        setFundAddedErrorModal(true);
        setFundAddedErrorModalMsg(errorMessage);
      })
  }
  
  const openViewModal = (url: string) => {
    if (url) {
      setFile(url);
      setViewModal(true);
    } else {
      message.error("Oops! Could not open the file.");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setMessageVisible(false);
    setIsVerifyModal(false);
    handleCloseModalTriggerButton();
    form.setFieldsValue({ disputeTypeAlias: null, description: null });
  };

  const setErrorModal = () => {
    setError({ status: false, message: "" })
    navigate(Dashboard);
  }

  const onFinish = (values: any) => {
    setLoading(true);
    values["contractAlias"] = contractDetail?.aliasName;
    values["initiatedBy"] = userAlias;
    saveDispute(values)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          setLoading(false)
          setMessageVisible(true);
          getContractStages()
          _fetchPaymentConditions()
          setTimeout(() => {
            setMessageVisible(false);
            setIsModalVisible(false);
            form.setFieldsValue({ disputeTypeAlias: null, description: null });
            navigate(TransactionDetail + "/" + paymentDetails?.aliasName);
          }, 2000);
        }
      })
      .catch((error) => {
        if (error?.data?.message) {
          openNotification(error.data.message);
        } else if (error?.data) {
          const errorMsg: any = error?.data[0].message;
          openNotification(errorMsg);
        } else if (error?.error) {
          openNotification(error.error);
        } else {
          openNotification("Internal server error");
        }
      });
  };

  const generateOTP =  () => {
    setLoading(true);
    handleCloseModalTriggerButton();
    generateContractOtp(paymentDetails,userAlias)
    .then(()=> {
      setLoading(false);
      setTimer(60);
      setOtpModal(true);

    })
    .catch(() =>{
      message.error("Error generating OTP. Please try again later")
    })
  }
  const initializePayment = () => {
    setOTP("");
    generateOTP();
    setBtnStatus("initiate_payment");
  };

  const raiseDispute = () => {
    setOTP("");
    generateOTP();
    setBtnStatus("raise_dispute");
  }

  const kycModalView = () => {
    setReleaseVisible(false);
  };
  
  const handleVisible= () => {
    setReleaseVisible(false);
    setReleaseModal(false);
  }

  const handleShowTrusteeApproval = () =>{
    setShowTrusteeApproval(false)
  }

  const _fetchPaymentConditions = async () => {
    try {
      const resp = await getPaymentDetails(contractId)
      const obj = {...resp?.data}
      if(obj.isContractVerify && obj.verifyBy){
        // fetch verified user details
        await getUserByAlias(obj.verifyBy)
        .then((res) => {
          obj.verifyByName = res.data.data.userDetails.name;
          obj.verifyByEmail = res.data.data.userDetails.email;
          obj.verifyDate = moment(paymentDetails.verifyDate).format('LLL');
      })
      }
      setPaymentDetails(
        obj,
      );

      setCustomContractList(resp?.data?.customPoint)
      setCustomAttachURL(obj?.customAttach?.url)
      const response = await getContractDetails(
        contractId,
        userData.userAlias
      );   
      setLoading(false)
      setContractDetail(
        response?.data,
      );
       if (obj?.customAttachments?.length) {
        setCustomAttachmentUrls(obj?.customAttachments.map((elem:any) => elem.url));
      } else {
        if (obj?.customAttach?.url) {//for older entries
          setCustomAttachmentUrls([obj?.customAttach?.url]);
        }
      }
      //  let advisorStatus = true;
      //   if (response?.data?.escrowAdvisorAlias
      //     && ![response?.data?.buyerAlias, response?.data?.sellerAlias].includes(contractDetail?.escrowAdvisorAlias)) {
      //     if (response?.data?.escrowAdvisorDetails?.userType !== 'ESCROW_ADVISOR'
      //       || !response?.data?.escrowAdvisorDetails?.ekycStatus) { //check if advisor has joined or not 
      //       advisorStatus = false;
      //     }
      //   }

      // if (resp?.data?.isMilestone) {
      //   //to do
      // } else {
      //   const milestone = obj?.milestoneList?.[0];
      //   const contractStatusNum = Number(obj?.contractStatus);
      //   const isEligibleForPayment =
      //     typeof obj?.isCompliance !== 'boolean' &&
      //     advisorStatus && obj?.contractStatus !== "-1" &&
      //     !obj?.isDispute &&
      //     !(obj?.disputeDetails?.isGenerated && obj?.contractStatus === "8") &&
      //     ![-2, -1, 5, 6].includes(contractStatusNum) &&
      //     !obj?.isExpired &&
      //     milestone?.isCompliance === null &&
      //     milestone?.transactionStatus === "ACTIVE" &&
      //     milestone?.approveStatus === "1" &&
      //     milestone?.trusteeApproveStatus === "1";
      //   const showInitiateButton =
      //     isEligibleForPayment && milestone?.releaseStatus === null && obj?.isAgreementFull && obj?.isAuthorizerPaymentInitiate;

      //   if (showInitiateButton && isAuthorizer) {
      //     console.log('Line No. => 712 ==> showInitiateButton',showInitiateButton);
      //     releasePayment();
      //   }
      // }
      setBlueCardLoader(false);
      setBtnText(ACTION_LABEL[response?.data?.contractAction]);
      setBuyerDetail({
        name: response?.data?.buyerDetails.name ?? '',
        email: response?.data?.buyerDetails?.email ?? '',
      });      
      setcontractStatus(response?.data?.contractStatus);
      if (response?.data?.buyerAlias === userAlias) {
        setFromParty({
          userAlias: response?.data?.buyerAlias,
          userType: USER_TYPE_TEXT.BUYER,
          subuserType: toTitleCase(response?.data?.subContractParty),
          name: response?.data?.buyerDetails.name ?? '',
          email: response?.data?.buyerDetails?.email ?? '',
          entityType: response?.data?.buyerDetails?.entityType || "INDIVIDUAL",
          // country: response?.data?.buyerDetails?.companyCountry  ?? response?.data?.buyerDetails?.countryAlias ?? '',
          // nationality: formatTitleCase(response?.data?.buyerDetails?.entityType === "COMPANY" ? response?.data?.buyerDetails?.nationality : response?.data?.buyerDetails?.kycNationality)
           country:getFormattedValue([response?.data?.buyerDetails?.companyCountry, response?.data?.buyerDetails?.countryAlias ]),
            nationality:getFormattedValue([response?.data?.buyerDetails?.nationality, response?.data?.buyerDetails?.kycNationality, response?.data?.buyerDetails?.companyCountry]),
        });
      
        setToParty({
          userAlias: response?.data?.sellerAlias,
          userType: USER_TYPE_TEXT.SELLER,
          subuserType: toTitleCase(response?.data?.subContractCounterParty),
          name: response?.data?.sellerDetails.name ?? '',
          email: response?.data?.sellerDetails?.email ?? '',
          entityType: response?.data?.sellerDetails?.entityType || "INDIVIDUAL",
          // country: response?.data?.sellerDetails?.companyCountry ?? response?.data?.sellerDetails?.countryAlias ?? '',
          // nationality: formatTitleCase(response?.data?.sellerDetails?.entityType === "COMPANY" ? response?.data?.sellerDetails?.nationality : response?.data?.sellerDetails?.kycNationality)
           country:getFormattedValue([response?.data?.sellerDetails?.companyCountry, response?.data?.sellerDetails?.countryAlias]),
            nationality:getFormattedValue([response?.data?.sellerDetails?.nationality, response?.data?.sellerDetails?.kycNationality, response?.data?.sellerDetails?.companyCountry]),
        });
      } else {
        setFromParty({
          userAlias: response?.data?.sellerAlias,
          userType: USER_TYPE_TEXT.SELLER,
          subuserType: toTitleCase(response?.data?.subContractParty),
          name: response?.data?.sellerDetails.name ?? '',
          email: response?.data?.sellerDetails?.email ?? '',
          entityType: response?.data?.sellerDetails?.entityType || "INDIVIDUAL",
          // country: response?.data?.sellerDetails?.companyCountry ?? response?.data?.sellerDetails?.countryAlias ?? '',
          // nationality: formatTitleCase(response?.data?.sellerDetails?.entityType === "COMPANY" ? response?.data?.sellerDetails?.nationality : response?.data?.sellerDetails?.kycNationality)
          country: getFormattedValue([response?.data?.sellerDetails?.companyCountry, response?.data?.sellerDetails?.countryAlias]),
          nationality: getFormattedValue([response?.data?.sellerDetails?.nationality, response?.data?.sellerDetails?.kycNationality,response?.data?.sellerDetails?.companyCountry]),
        });
       
        setToParty({
          userAlias: response?.data?.buyerAlias,
          userType: USER_TYPE_TEXT.BUYER,
          subuserType: toTitleCase(response?.data?.subContractCounterParty),
          name: response?.data?.buyerDetails.name ?? '',
          email: response?.data?.buyerDetails?.email ?? '',
          entityType: response?.data?.buyerDetails?.entityType || "INDIVIDUAL",
          // country: response?.data?.buyerDetails?.companyCountry ?? response?.data?.buyerDetails?.countryAlias ?? '',
          // nationality: formatTitleCase(response?.data?.buyerDetails?.entityType === "COMPANY" ? response?.data?.buyerDetails?.nationality : response?.data?.buyerDetails?.kycNationality)
          country: getFormattedValue([response?.data?.buyerDetails?.companyCountry, response?.data?.buyerDetails?.countryAlias]),
          nationality: getFormattedValue([response?.data?.buyerDetails?.nationality, response?.data?.buyerDetails?.kycNationality, response?.data?.buyerDetails?.companyCountry]),
        });
      }
      if (response?.data?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(obj)) {
        setEscrowAdvisorDetails({
          userType: USER_TYPE_TEXT.ESCROW_ADVISOR,
          name: response?.data?.escrowAdvisorDetails.name ?? '',
          email: response?.data?.escrowAdvisorDetails?.email ?? '',
          entityType: response?.data?.escrowAdvisorDetails?.entityType || "INDIVIDUAL",
          // country: response?.data?.escrowAdvisorDetails?.companyCountry ?? response?.data?.escrowAdvisorDetails?.countryAlias ?? '',
          // nationality: formatTitleCase(response?.data?.escrowAdvisorDetails?.entityType === "COMPANY" ? response?.data?.escrowAdvisorDetails?.nationality : response?.data?.escrowAdvisorDetails?.kycNationality)
          country: getFormattedValue([response?.data?.escrowAdvisorDetails?.companyCountry, response?.data?.escrowAdvisorDetails?.countryAlias]),
          nationality: getFormattedValue([response?.data?.escrowAdvisorDetails?.nationality, response?.data?.escrowAdvisorDetails?.kycNationality, response?.data?.escrowAdvisorDetails?.companyCountry]),
        });
      }
    } catch (err) {
      console.log('_fetchPaymentConditions:::::::::::::::>>>err: ',err);
    }
  };

  const formatReleaseDate = (releaseDate: any, status: any) => {
    return status === TXN_STATUS.RELEASED
      ? ` completed on ${moment(releaseDate).format("DD-MM-YYYY")}`
      : ` yet to be released on ${moment(releaseDate).format("DD-MM-YYYY")}`;
  };
  useEffect(() => {
    getUserData(UserEmail)
      .then((response: any) => {
        setKycVerified(response?.data?.ekycStatus);
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later!");
      });
  }, []);
  useEffect(() => {
    getContractStages()
  }, []);

  const getContractStages = () =>{
    if (!id) {
      return;
    }
    getContractHistory(id)
      .then((response) => {
          setLoading(false);
          const historyList: any = {};
          const history: any = {};
          response.data.map(
            (item: any) =>
            { 
              let contractAction = item.contractAction
              if (contractAction === "DOCUMENT APPROVED" && item?.role !== 'TRUSTEE') {
                contractAction = 'DOCUMENT APPROVED ADMIN';
              }
              historyList[contractAction.split(" ").join("_")] = {
                name: item.name,
                updatedAt: item.updatedAt,
                transactionAlias: item.transactionAlias,
                updatedBy:item?.updatedBy,
                role: item?.role
              };
              history[item?.transactionAlias] =  item.transactionAlias !== null ? {...history[item.transactionAlias],[contractAction.split(" ").join("_")] :{
                name: item.name,
                updatedAt: item.updatedAt,
                transactionAlias: item.transactionAlias,
                updatedBy: item?.updatedBy,
                role: item?.role
              }}: "";
              return item;
            }
          );
          const contractHistoryList = {...historyList,...history}
          setContractHistory(contractHistoryList);
        }
      )
      .catch(() => {
        setLoading(false);
        message.error("Could not fetch details. Please try again later!");
      });
  }
 
  const onVerifyFinish = (values: any) => {
    modalHeader == "Approve contract"
      ? (values.status = "APPROVE")
      : (values.status = "REJECT");
    values.userAlias = userAlias;
    values.contractId = contractDetail?.aliasName;
    verifyContract(values)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          setIsVerifyModal(false);
          form.setFieldsValue({ reasonComment: null });
          window?.location?.reload();
        }
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
  };
  const showVerifyModal = (value: string) => {
    setIsVerifyModal(true);
    if (value) {
      setModalHeader(value);
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };

  const unblockFunds = async (transactionAlias: any, action: any) => {
    setLoading(true);
    await blockOrUnblockFunds(transactionAlias, action)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          setLoading(false);
          setUnBlockModal(true);
          setTimeout(() => {
            setUnBlockModal(false);
            navigate(TransactionDetail + "/" + contractDetail?.aliasName);
          }, 3000);
        }
      })
      .catch(() => {
        setLoading(false);
        setUnBlockFailureModal(true);
      });
  };
  const addFund = (contractId: any, userAlias: any) => {
    navigate(AddFund + "/" + contractId, {
      state: {
        contractid: contractId,
        userAlias: userAlias,
        buyerDetail: buyerDetail,
      },
    });
  };
  
  const onUpdatePayoutAccountSubmit = (selectedAccount: any) => {
    setLoading(true);
    updateContractPayoutAccount({
      contractAlias: contractDetail?.aliasName,
      bankAlias: selectedAccount.aliasName,
    }).then(() => {
      getPaymentDetails(id).then(async (response: any) => {
        const data = response?.data;
        setPaymentDetails(data);
      }).finally(() => setLoading(false));
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (paymentDetails && paymentDetails?.contractStatus === "2") {
     getBankList(paymentDetails)
      getContractListByContractStatus(
        paymentDetails?.buyerAlias,
        paymentDetails?.contractStatus
      )
        .then((response: any) => {
          if (response?.data.length > 0) {
            setContractList(response?.data);
          }
        })
        .catch(() => {
          message.error("Could not fetch details. Please try again later!");
        });
    } 
    if(paymentDetails?.aliasName) {
      getTransactionDetails(paymentDetails?.invoiceAmount, paymentDetails?.aliasName, paymentDetails);
      paymentDetails.milestoneList?.map((item: any) => {
          getTransactionDetails(item?.transactionAmount, item?.aliasName, paymentDetails);
      })
    }

    if(paymentDetails?.itemCategoryAlias) {
      getItemTypeCategoryByItemAlias(paymentDetails?.itemCategoryAlias)
      .then((responseData: any) => {
        setTaxDetails({
          "plateformFees": responseData?.data?.plateformFees,
          "vatCharges": responseData?.data?.vatCharges
        })
      })
      .catch((error: any) => {
        if (error?.data?.message) {
          openNotification(error.data.message);
        } else if (error?.data) {
          const errorMsg: any = error?.data[0].message;
          openNotification(errorMsg);
        } else if (error?.error) {
          openNotification(error.error);
        } else {
          openNotification("Internal server error");
        }
      });
    }
  }, [paymentDetails]);



  useEffect(() => {
    getAllDisputesList()
      .then((response: any) => {
        setDisputeList(response?.data?.data);

      })
      .catch((error) => {
        setError({ status: true, message: error?.data?.error });
      });
  }, [contractId]);
  
  useEffect(() => {
    if (!["5", "9", "10"].includes(paymentDetails?.contractStatus ?? "") && userAlias === paymentDetails?.sellerAlias) {
      getlocalBankDetails(userAlias)
        .then((response) => {
          setBankAccountList(response.data.bankDetails);
          form.setFieldsValue({
            payout_account: response.data.bankDetails?.[0]?.aliasName,
          });
        })
        .catch(() => {
          message.error("Could not fetch details. Please try again later!");
        });
    }
  }, [paymentDetails?.contractStatus, paymentDetails?.sellerAlias]);
  
  useEffect(() => {
  
    setLoading(true);
    getPaymentDetails(id).then(async (response: any) => {
      setLoading(false);
      const data = response?.data;
      setPaymentDetails(data);  
       getBankList(data);
      setActivePayment(data?.milestoneList?.length > 0 ? data?.milestoneList?.length - 1 : 0);
      setCustomContractList(data?.customPoint)
      setCustomAttachURL(data?.customAttach?.url)
      if (data?.customAttachments.length) {
        setCustomAttachmentUrls(data?.customAttachments.map((elem:any) => elem.url));
      } else {
        if (data?.customAttach?.url) {//for older entries
          setCustomAttachmentUrls([data?.customAttach?.url]);
        }
      }
      const milestones = data?.milestoneList;
      milestones?.map((item: any) => {
        if (item.paymentStatus !== "COMPLETED") {
          setPaymentComplete(false);
        }
      });
      if(milestones?.length > 1) {
        for (let i = 0; i < milestones?.length; i++) {
          if (milestones[i]?.paymentStatus == null || ["INPROGRESS", "ACTIVE", "INACTIVE"]?.includes(milestones[i]?.paymentStatus)) {
            setActivePayment(i);
            break;
          }
        }
      } else {
          setActivePayment(0);
      }
      if(data?.isContractVerify && data.verifyBy) {
        getUserByAlias(data.verifyBy).then((res) => {
          setcontractStatus(res?.data?.data?.userDetails);
        });
      }
    });
    getTxnData(id).then((response: any) => {
      setCategoryDetails(response?.data);
    });
    getContractDetails(id, userAlias).then((response: any) => {
      setContractDetail(response?.data);
      setBlueCardLoader(false);
      setBtnText(ACTION_LABEL[response?.data?.contractAction]);

      setBuyerDetail({
        name: response?.data?.buyerDetails.name,
        email: response?.data?.buyerDetails?.email,
      });
            
      if (response?.data?.buyerAlias === userAlias) {
        setFromParty({
          userType: "Buyer",
          subuserType : toTitleCase(response?.data?.subContractParty),
          userAlias: response?.data?.buyerAlias,
          name: response?.data?.buyerDetails.name,
          email: response?.data?.buyerDetails?.email,
          entityType: response?.data?.buyerDetails?.entityType || "INDIVIDUAL",
          country: response?.data?.buyerDetails?.companyCountry  ?? response?.data?.buyerDetails?.countryAlias ?? '',
          nationality: formatTitleCase(response?.data?.buyerDetails?.entityType === "COMPANY" ? response?.data?.buyerDetails?.nationality : response?.data?.buyerDetails?.kycNationality)
        });
        setToParty({
          userType: "Seller",
          subuserType: toTitleCase(response?.data?.subContractCounterParty),
          userAlias: response?.data?.sellerAlias,
          name: response?.data?.sellerDetails.name,
          email: response?.data?.sellerDetails?.email,
          entityType: response?.data?.sellerDetails?.entityType || "INDIVIDUAL",
          country: response?.data?.sellerDetails?.companyCountry ?? response?.data?.sellerDetails?.countryAlias ?? '',
          nationality: formatTitleCase(response?.data?.sellerDetails?.entityType === "COMPANY" ? response?.data?.sellerDetails?.nationality : response?.data?.sellerDetails?.kycNationality)
        });
      } else {         
        setFromParty({
          userType: "Seller",
          subuserType: toTitleCase(response?.data?.subContractParty),
          userAlias: response?.data?.sellerAlias,
          name: response?.data?.sellerDetails.name,
          email: response?.data?.sellerDetails?.email,
          entityType: response?.data?.sellerDetails?.entityType || "INDIVIDUAL",
          country: response?.data?.sellerDetails?.companyCountry ?? response?.data?.sellerDetails?.countryAlias ?? '',
          nationality: formatTitleCase(response?.data?.sellerDetails?.entityType === "COMPANY" ? response?.data?.sellerDetails?.nationality : response?.data?.sellerDetails?.kycNationality)
        });
        setToParty({
          userType: "Buyer",
          subuserType: toTitleCase(response?.data?.subContractCounterParty),
          userAlias: response?.data?.buyerAlias,
          name: response?.data?.buyerDetails.name,
          email: response?.data?.buyerDetails?.email,
          entityType: response?.data?.buyerDetails?.entityType || "INDIVIDUAL",
          country: response?.data?.buyerDetails?.companyCountry  ?? response?.data?.buyerDetails?.countryAlias ?? '',
          nationality: formatTitleCase(response?.data?.buyerDetails?.entityType === "COMPANY" ? response?.data?.buyerDetails?.nationality : response?.data?.buyerDetails?.kycNationality)
        });
      }
      if(response?.data?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(response?.data)) {
        setEscrowAdvisorDetails({
          userType: USER_TYPE_TEXT.ESCROW_ADVISOR,
          name: response?.data?.escrowAdvisorDetails.name,
          email: response?.data?.escrowAdvisorDetails?.email,
          entityType: response?.data?.escrowAdvisorDetails?.entityType || "INDIVIDUAL",
          country: response?.data?.escrowAdvisorDetails?.companyCountry ?? response?.data?.escrowAdvisorDetails?.countryAlias ?? '',
          nationality: formatTitleCase(response?.data?.escrowAdvisorDetails?.entityType === "COMPANY" ? response?.data?.escrowAdvisorDetails?.nationality : response?.data?.escrowAdvisorDetails?.kycNationality)
        });
      }
      if (response?.data?.trusteeId) {
        settrustinAlias(response?.data?.trusteeId)
        getUserByAlias(response?.data?.trusteeId).then((resp: any) => {
          setTrusteeDetails({
            name: "TrustIn",
            email: resp?.data?.data?.userDetails?.email
          })
        })
      }
    });
    
  }, []);

  useEffect(() => {
    const milestonePaymentLogs: any = [];
    if(paymentDetails?.milestoneList?.length > 0 &&  paymentDetails?.contractStatus === "2") {
      const milestoneList = paymentDetails?.milestoneList ?? []
      for (const milestone of milestoneList) {
        if(milestone?.paymentStatus !== "COMPLETED") {
          getPaymentLogsByTransactionAlias(milestone?.aliasName)
            .then((response: any) => {
              const paymentLogs = response?.data?.paymentLogs ?? []
              if(paymentLogs?.length > 0 ) {
                for(const log of paymentLogs) {
                  if(['Net Banking Transfer',"Bank Transfer"]?.includes(log?.paymentMethod) && log?.paymentStatus === "INPROGRESS"){
                    const findmilestone = milestonePaymentLogs.length > 0 && milestonePaymentLogs.includes(milestone?.aliasName);
                    if(!findmilestone) milestonePaymentLogs.push(milestone?.aliasName);
                  }
                }
                if(milestonePaymentLogs?.length > 0 ) {
                  // console.log(milestonePaymentLogs)
                  setInProgressPaymentLogList([...inProgressPaymentLogList, ...milestonePaymentLogs])
                }
              }
            })
            .catch((error: any)=> {
              const errorMessage = error?.data?.message || error?.data?.[0]?.message || error?.error || "Internal server error";
              openNotification(errorMessage);
            })
            // console.log("setInProgressPaymentLogList",inProgressPaymentLogList);
        }
      }
    }
    
  },[paymentDetails]);

  const milestone: any = [];
  const getTransactionDetails = async (transactionAmount: any, trxnAlias: any, paymentData: any) => {
    let platformFee: any, vatCharge: any, platformChargeType, platformChargeAppliedOn;

    if (paymentData?.platformCharge && paymentData?.platformCharge !== null && paymentData?.vatCharges && paymentData?.vatCharges !== null) {
      platformFee = paymentData?.platformCharge;
      vatCharge = paymentData?.vatCharges;
      platformChargeType = paymentData?.platformChargeType;
      setTaxDetails((prev: any) => ({
        ...prev,
        platformChargeType: paymentData?.platformChargeType,
        plateformFees: paymentData?.platformCharge,
        vatCharges: paymentData?.vatCharges,
        minimumPlatformFee: paymentData?.minimumPlatformCharge,
        platformChargeAppliedOn: paymentData?.platformChargeAppliedOn
      }));
      setLocalStorage("counterUserAlias", paymentData?.sellerAlias);
    } else {
      // if (paymentData?.plaformFeeType === PLAFORM_FEE_TYPE.FIXED_USER_PLATFORM_FEES) {
        // User-specific fees
        const { data: userPlatformCharge } = await getUserPlatformFees(paymentData?.buyerAlias, TRANSACTION_TYPE.ESCROW);
        const { data: counterUserPlatformCharge } = await getUserPlatformFees(paymentData?.sellerAlias, TRANSACTION_TYPE.ESCROW);
         const { data:fixPlatformCharge } = await getItemTypeCategoryByItemAlias(
            paymentData?.itemCategoryAlias
          );
        setLocalStorage("counterUserAlias", paymentData?.sellerAlias);
        if (userPlatformCharge && counterUserPlatformCharge) {
          const buyerAmount = calculateUserPlatformFee(userPlatformCharge, paymentData?.invoiceAmount);
          const sellerAmount = calculateUserPlatformFee(counterUserPlatformCharge, paymentData?.invoiceAmount);
          if (buyerAmount >= sellerAmount && userPlatformCharge) {
            platformFee = Number(userPlatformCharge.platformFees);
            platformChargeType = userPlatformCharge.platformChargeType;
            vatCharge = fixPlatformCharge?.vatCharges ?? null;
            platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.BUYER;
          } else {
            platformFee = Number(counterUserPlatformCharge.platformFees);
            platformChargeType = counterUserPlatformCharge.platformChargeType;
            vatCharge = fixPlatformCharge?.vatCharges ?? null;
            platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.SELLER;
          }
        } else if (userPlatformCharge?.platformFees) {
          platformFee = Number(userPlatformCharge.platformFees);
          platformChargeType = userPlatformCharge.platformChargeType;
          vatCharge = fixPlatformCharge?.vatCharges ?? null;
          platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.BUYER;
        } else if (counterUserPlatformCharge?.platformFees) {
          platformFee = Number(counterUserPlatformCharge?.platformFees);
          platformChargeType = counterUserPlatformCharge?.platformChargeType;
          vatCharge = fixPlatformCharge?.vatCharges ?? null;
          platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.SELLER;
        } else {
          // Default: category-level fees
          platformFee = fixPlatformCharge?.plateformFees ?? null;
          vatCharge = fixPlatformCharge?.vatCharges ?? null;
          platformChargeType = fixPlatformCharge?.platformChargeType
        }

        setTaxDetails({...taxDetails,platformChargeAppliedOn})
    }
  
    const data: any = await CalculateTransactionFee({
      invoiceAmount: paymentData?.invoiceAmount,
      transactionAmount: transactionAmount,
      plateformFees: platformFee,
      platformChargeType: platformChargeType,
      vatCharges: vatCharge,
      buyerPercent: paymentData?.buyerPercent,
      sellerPercent: paymentData?.sellerPercent,
      hasAdvisor: hasAdvisor(paymentData),
      escrowCommission: paymentData?.escrowAdvisorCommission,
      buyerCommissionPercent: paymentData?.buyerCommissionPercent,
      sellerCommissionPercent: paymentData?.sellerCommissionPercent,
      minimumPlatformCharge: paymentData?.minimumPlatformCharge,
      entityType: paymentData?.itemCategoryEntityType
    })
    if(paymentData?.aliasName == trxnAlias) {
      setInvoiceCal(data)
    } else{
      milestone[trxnAlias] = data     
      setmilestoneCal(milestone)
    }    
  }

  useEffect(() => {
    if(contractHistory && paymentDetails?.buyerAlias) {
      const milestoneTxnToVerify = paymentDetails?.milestoneList?.find((milestone: any) => milestone?.paymentStatus === "COMPLETED" && !milestone?.isTransactionVerified);
      if(milestoneTxnToVerify?.aliasName) {
        getTransactionListToVerify("ESCROW",milestoneTxnToVerify?.aliasName)
        .then((res: any) => {
          if (res?.data?.VATransactionList?.length > 0) {
            res.data.VATransactionList = res.data.VATransactionList.map((elem:any) => {
              if (elem.PaymentMode === 'TRANSFER') {
                elem.TransactionInformation = paymentDetails.agreementId;
              }
              return elem;
            })
            setVATransactions(res?.data?.VATransactionList);
          }
        }) .catch(() => {
          openNotification("NO TRANSACTIONS FOUND");
        })
      }
    }
  }, [contractHistory, paymentDetails])

  const hasAdvisor = (data:any) => {
    const check = data?.escrowAdvisorAlias && ![data?.buyerAlias,data?.sellerAlias].includes(data?.escrowAdvisorAlias)
    return check
  }

  
  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = File;
    link.setAttribute("download", "file");
    document.body.appendChild(link);
    link.click();
  };

  const displayMasterDoc = () => {
    // Both buyerAlias and sellerAlias must be present in CRESET_USERS array
    if (!CRESET_USERS || !Array.isArray(CRESET_USERS) || !masterDocument) return false;
    const { buyerAlias, sellerAlias } = contractDetail || {};
    return (
      buyerAlias &&
      sellerAlias &&
      CRESET_USERS.includes(buyerAlias) &&
      CRESET_USERS.includes(sellerAlias)
    );
  };

  

 

  const isValidStatus = (status: any) => {
    return status !== undefined && status !== null && status !== '' && !isNaN(status);
  };

  const getContractStatusForBlueCard = (contractDetail:any) => {
    if (contractDetail?.isExpired) {
        return "( Expired )";
    }
    if (contractDetail?.isArchive) {
        return "( Archived )";
    }
    if (contractDetail?.contractStatus && isValidStatus(contractDetail.contractStatus)) {
        return `( ${contractStatusMap[contractDetail.contractStatus]} )`;
    }
    return "";
};

useEffect(() => {
  if(paymentDetails && paymentDetails?.isMilestone===true ){
     paymentDetails?.milestoneList?.forEach((item:any)=>{ 
      if(item?.transactionStatus === "ACTIVE" && item?.releaseStatus === null && item?.buyerTransactionAmount){
        setPopupAmount(item?.buyerTransactionAmount)
      }
  })
  }
}, [paymentDetails])

  useEffect(() => {
    const primaryAccount = bankAccountList?.find((account: any) => account.isPrimary);
    if (!payoutAccount) {
      setPayoutAccount(primaryAccount);
    }
    if(paymentDetails && paymentDetails?.isMilestone === true ){
      paymentDetails?.milestoneList?.forEach((item:any)=>{ 
        if(item?.isActive == true && item?.payoutAccount) {
          setPayoutAccount(item?.payoutAccount)
        }
      })
    } else {
      if (paymentDetails?.milestoneList?.[0]?.payoutAccount) {
        setPayoutAccount(paymentDetails?.milestoneList?.[0]?.payoutAccount)
      }
    }
  }, [
    bankAccountList,
    paymentDetails?.isMilestone,
    paymentDetails?.milestoneList?.[0]?.payoutAccount,
    paymentDetails?.milestoneList
  ])

 // Reusable function to update location state
  const updateLocationState = useCallback((newState: Partial<typeof state>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        ...newState,
      },
    });
  }, [navigate, state]);


  // Modal close handler
  const handleCloseModalTriggerButton = () => {
    updateLocationState({ triggerButton: false });
  };

  const handlePDFView =(url:string)=>{
    setImagUrl(url);
    setverifyVisible(true);
  }

  const getLabel = () => {
    return contractDetail.contractStartedBy == USER_TYPE_TEXT.BUYER ? contractDetail.subContractCounterParty : contractDetail.subContractParty;
  }
  

  return (
    <div className="scrollbar-container">
        <DefaultLayout    
              page={
                params?.state?.pagefrom
                  ? params.state.pagefrom
                  : userType === "USER"
                  ? "dashboard"
                  : "escrow_transaction"
              }
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
                      className="mt-2 cursor"
                    />
                    <div className="ml-5">
                      <b> Agreement details</b>
                      <Breadcrumb separator=">">
                        {/* <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                          className="cursor"
                        >
                          Dashboard
                        </Breadcrumb.Item> */}
                        <Breadcrumb.Item className="breadcrumb-title-text">
                          Agreement details
                        </Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
              >
              <Row className="endtoend" gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16} span={Width >= 992 ? 16 : 24}>
                  <div className="bg-admin-card seller-bg-admin-card">
                  {blueCardLoader ? (
                      <>
                        <div className="whiteTitle18 d-flex align-items-center justify-content-center w-100"><Spin/></div>
                        <div className="whiteTitle18 mt-2 d-flex align-items-center justify-content-center w-100">Please wait...</div>
                      </>
                      ):(<>
                    <div  className={Width > 700 ? "endtoend" :""}>
                      <div className={Width > 700 ? "title_white d-flex flex-wrap align-items-center justify-content-between res-trans-id":"title_white res-trans-id d-flex flex-wrap align-items-center"}>
                       <span className="me-2"> {paymentDetails?.agreementId}</span>  <span className="contractStatusMap">
                          {getContractStatusForBlueCard(contractDetail)}
                        </span>
                      </div>
                      <div  className={Width > 700 ? "d-flex" :"d-flex mt-2"}>
                        <Image src={Job} alt="box" preview={false} />
                        <div className="whiteTitle18 px-3">
                          {moment(paymentDetails?.createdAt).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
                      </div>
                    </div>
                    <hr className=" w-100 opacity-50 mt-4" />
                    <Row gutter={{ xs: 25, sm: 25, md: 12, lg: 12 }} className=" endtoend four-buyer-block form-body">
                        {
                          contractDetail?.contractStatus === "2" ? (
                            <>
                              <Col xs={24} sm={24} md={6} lg={6} xl={6} span={contractDetail?.contractStatus === "2" ? 7 : 12}  className="columnData">
                              <div className="buyerBox">
                                {modifyCresetUserType(fromParty.userAlias,fromParty.userType.toUpperCase())}
                              </div>
                              <div className="d-flex my-3">
                                <Image
                                  src={WhiteUserFull}
                                  alt="box"
                                  preview={false}
                                />
                                <div className="whiteTitle18 px-3 noWrap overflowText">
                                  {/* {fromParty.name} */}
                                  <Tooltip
                                    title={fromParty.name}
                                    overlayClassName='custom-tooltip'
                                  >
                                    <span>{fromParty.name}</span>
                                  </Tooltip> 
                                </div>
                              </div>
                              <div className="d-flex my-3">
                                <Image src={WhiteEmail} alt="box" preview={false} />
                                <div className="whiteTitle18 px-3 noWrap overflowText">
                                  {/* {fromParty.email} */}
                                  <Tooltip
                                    title={fromParty.email}
                                    overlayClassName='custom-tooltip'
                                  >
                                    <span>{fromParty.email}</span>
                                  </Tooltip> 
                                </div>
                              </div>
                              <div className="d-flex my-3">
                                <Image src={Globe} alt="box" preview={false} />
                                <div className="whiteTitle18 ps-3 noWrap overflowText">
                                  <Tooltip
                                      title={fromParty.country && fromParty.country.length * 7 > 136 ? fromParty.country : null}
                                      overlayClassName='custom-tooltip'
                                    >
                                    {fromParty.country}
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
                            {fromParty.entityType !== "COMPANY" && (
                              <div className="d-flex my-3">
                                <Image src={Flag} alt="box" preview={false} />
                                <div className="whiteTitle18 ps-3 noWrap overflowText">
                                  <Tooltip
                                      title={fromParty.nationality && fromParty.nationality.length * 7 > 136 ? fromParty.nationality : null}
                                      overlayClassName='custom-tooltip'
                                    >
                                    {fromParty.nationality || "--"}
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
                            )}
                              <div className="d-flex my-3">
                                <Image src={Payment} alt="box" preview={false} />
                                <div className="whiteTitle18 bold px-3">
                                    {moneyFormat(
                                      paymentDetails?.currency,
                                      (Number(invoiceCal?.[`${fromParty.userType?.toLowerCase()}Amount`] || 0)).toFixed(2)
                                    )}
                                </div>
                              </div>
                              </Col>
                              <Col xs={24} sm={24} md={3} lg={3} xl={3} className="mb-3">
                                <div >
                                  <Image src={MoveTo} alt="move" preview={false} />
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={6} lg={6} xl={6} span={contractDetail?.contractStatus === "2" ? 7 : 12}  className="columnData">
                                <div className="buyerBox">{modifyCresetUserType(toParty.userAlias,toParty.userType.toUpperCase())}</div>
                                <div className="d-flex my-3 align-items-baseline">
                                  <Image
                                    src={WhiteUserFull}
                                    alt="box"
                                    preview={false}
                                  />
                                  <div className="whiteTitle18 px-3 noWrap overflowText">
                                    {/* {toParty.name} */}
                                    <Tooltip
                                      title={toParty.name}
                                      overlayClassName='custom-tooltip'
                                    >
                                      <span>{toParty.name}</span>
                                    </Tooltip> 
                                  </div>
                                </div>
                                <div className="d-flex my-3 align-items-baseline">
                                  <Image src={WhiteEmail} alt="box" preview={false} />
                                  <div className="whiteTitle18 px-3 noWrap overflowText">
                                    {/* {toParty.email} */}
                                    <Tooltip
                                      title={toParty.email}
                                      overlayClassName='custom-tooltip'
                                    >
                                      <span>{toParty.email}</span>
                                    </Tooltip>
                                  </div>
                                </div>
                                <div className="d-flex my-3 align-items-baseline">
                                  <Image src={Globe} alt="box" preview={false} />
                                  <div className="whiteTitle18 ps-3 noWrap overflowText">
                                  <Tooltip
                                      title={toParty.country && toParty.country.length * 7 > 136 ? toParty.country : null}
                                      overlayClassName='custom-tooltip'
                                    >
                                    {toParty.country}
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
                                {toParty.entityType !== "COMPANY" &&  (
                                 <div className="d-flex my-3 align-items-baseline">
                                  <Image src={Flag} alt="box" preview={false} />
                                  <div className="whiteTitle18 ps-3 noWrap overflowText">
                                    <Tooltip
                                        title={toParty.nationality && toParty.nationality.length * 7 > 136 ? toParty.nationality : null}
                                        overlayClassName='custom-tooltip'
                                      >
                                      {toParty.nationality || "--"}
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
                                )}
                                <div className="d-flex my-3 align-items-baseline">
                                  <Image src={Payment} alt="box" preview={false} />
                                  <div className="whiteTitle18 bold px-3">
                                      {moneyFormat(
                                      paymentDetails?.currency,
                                      (Number(invoiceCal?.[`${toParty.userType?.toLowerCase()}Amount`] || 0)).toFixed(2)
                                    )}
                                  </div>
                                </div>
                              </Col>
                              {contractDetail?.trusteeId === null && (contractDetail?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(contractDetail)) && (
                                <Col xs={24} sm={24} md={8} lg={8} xl={8}  className="columnData">
                                  <div className="buyerBox noWrap">ESCROW ADVISOR</div>
                                  <div className="d-flex my-3 align-items-baseline">
                                    <Image
                                      src={WhiteUserFull}
                                      alt="box"
                                      preview={false}
                                    />
                                    <div className="whiteTitle18 px-3">
                                      {/* {escrowAdvisorDetails?.name} */}
                                      <Tooltip
                                        title={escrowAdvisorDetails?.name && escrowAdvisorDetails?.name.length * 7 > 136 ? escrowAdvisorDetails?.name : null}
                                        overlayClassName='custom-tooltip custom-tooltip-inner'
                                      >
                                        <span className="overflowText-escrowadvisor">{escrowAdvisorDetails?.name}</span>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className="d-flex my-3 align-items-baseline">
                                    <Image src={WhiteEmail} alt="box" preview={false} />
                                    <div className="whiteTitle18 px-3 noWrap overflowText">
                                      {/* {escrowAdvisorDetails?.email} */}
                                      <Tooltip
                                        title={escrowAdvisorDetails?.email}
                                        overlayClassName='custom-tooltip'
                                      >
                                        <span>{escrowAdvisorDetails?.email}</span>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className="d-flex my-3 align-items-baseline">
                                    <Image src={Globe} alt="box" preview={false} />
                                    <div className="whiteTitle18 ps-3 noWrap overflowText">
                                      <Tooltip
                                        title={escrowAdvisorDetails?.country && escrowAdvisorDetails?.country.length * 7 > 136 ? escrowAdvisorDetails?.country : null}
                                        overlayClassName='custom-tooltip'
                                      >
                                        {escrowAdvisorDetails?.country}
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
                                {escrowAdvisorDetails.entityType !== "COMPANY" && (
                                  <div className="d-flex my-3 align-items-baseline">
                                    <Image src={Flag} alt="box" preview={false} />
                                    <div className="whiteTitle18 ps-3 noWrap overflowText">
                                      <Tooltip
                                          title={escrowAdvisorDetails?.nationality && escrowAdvisorDetails?.nationality.length * 7 > 136 ? escrowAdvisorDetails?.nationality : null}
                                          overlayClassName='custom-tooltip'
                                        >
                                        {escrowAdvisorDetails?.nationality || "--"}
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
                                    )}
                                  <div className="d-flex my-3 align-items-baseline">
                                    <Image src={Payment} alt="box" preview={false} />
                                    <div className="whiteTitle18 bold px-3">
                                      {moneyFormat(
                                        paymentDetails?.currency,
                                        (Number(paymentDetails?.escrowAdvisorCommission || 0)).toFixed(2)
                                      )}
                                    </div>
                                  </div>
                              </Col> )}
                              {contractDetail?.contractStartedBy !== USER_TYPE_TEXT.ESCROW_ADVISOR && contractDetail?.trusteeId !== null && (
                              <Col xs={24} sm={24} md={7} lg={7} xl={7}  className="columnData">
                                  <div className="buyerBox">CASE OFFICER</div>
                                  <div className="d-flex my-3 align-items-baseline">
                                    <Image
                                      src={WhiteUserFull}
                                      alt="box"
                                      preview={false}
                                    />
                                    <div className="whiteTitle18 px-3 noWrap overflowText">
                                      {/* {trusteeDetails?.name} */}
                                      <Tooltip
                                        title={trusteeDetails?.name && trusteeDetails?.name.length * 7 > 136 ? trusteeDetails?.name : null}
                                        overlayClassName='custom-tooltip'
                                      >
                                        <span>{trusteeDetails?.name}</span>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className="d-flex my-3 align-items-baseline">
                                    <Image src={WhiteEmail} alt="box" preview={false} />
                                    <div className="whiteTitle18 px-3 noWrap overflowText">
                                      {/* {careEmailAddress} */}
                                      <Tooltip
                                        title={careEmailAddress}
                                        overlayClassName='custom-tooltip'
                                      >
                                        <span>{careEmailAddress || "--"}</span>
                                      </Tooltip>
                                    </div>
                                  </div>
                              </Col> )}
                            </>
                          ): (
                            <>
                              <Col xs={24} sm={24} md={6} lg={6} xl={6} span={contractDetail?.contractStatus === "2" ? 7 : 12}  className="columnData">
                            <div className="buyerBox" style={{ textTransform: 'capitalize' }}>
                              {modifyCresetUserType(fromParty.userAlias,fromParty.subuserType.toUpperCase())}
                            </div>
                            <div className="d-flex my-3">
                              <Image
                                src={WhiteUserFull}
                                alt="box"
                                preview={false}
                              />
                              <div className="textContainer px-3 whiteTitle18">
                                {/* {fromParty.name} */}
                                <Tooltip
                                  title={fromParty.name}
                                  overlayClassName='custom-tooltip-bg'
                                >
                                  <span className="ellipsisText">{fromParty.name}</span>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="d-flex my-3">
                              <Image src={WhiteEmail} alt="box" preview={false} />
                              <div className="whiteTitle18 px-3 noWrap overflowText">
                                {/* {fromParty.email} */}
                                <Tooltip
                                  title={fromParty.email}
                                  overlayClassName='custom-tooltip'
                                >
                                  <span>{fromParty.email}</span>
                                </Tooltip> 
                              </div>
                            </div>
                            <div className="d-flex my-3">
                              <Image src={Globe} alt="box" preview={false} />
                              <div className="whiteTitle18 ps-3 noWrap overflowText">
                                <Tooltip
                                    title={fromParty.country && fromParty.country.length * 7 > 136 ? fromParty.country : null}
                                    overlayClassName='custom-tooltip'
                                  >
                                  {fromParty.country}
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
                            {fromParty.entityType !== "COMPANY" && (
                            <div className="d-flex my-3">
                              <Image src={Flag} alt="box" preview={false} />
                              <div className="whiteTitle18 ps-3 noWrap overflowText">
                                <Tooltip
                                  title={fromParty.nationality && fromParty.nationality.length * 7 > 136 ? fromParty.nationality : null}
                                  overlayClassName='custom-tooltip'
                                  >
                                  {fromParty.nationality || "--"}
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
                             )}
                            <div className="d-flex my-3">
                              <Image src={Payment} alt="box" preview={false} />
                              <div className="whiteTitle18 bold px-3">
                                {moneyFormat(
                                  paymentDetails?.currency,
                                  (Number(invoiceCal?.[`${fromParty.userType?.toLowerCase()}Amount`] || 0)).toFixed(2)
                                )}
                              </div>
                            </div>
                              </Col>
                              <Col xs={24} sm={24} md={2} lg={2} xl={2} className="mb-3">
                                <div >
                                  <Image src={MoveTo} alt="move" preview={false} />
                                </div>
                              </Col>
                              <Col xs={24} sm={24} md={6} lg={6} xl={6} span={contractDetail?.contractStatus === "2" ? 7 : 12}  className="columnData">
                                <div className="buyerBox" style={{ textTransform: 'capitalize' }}>{modifyCresetUserType(toParty.userAlias,toParty.subuserType.toUpperCase())}</div>
                                <div className="d-flex my-3">
                                  <Image
                                    src={WhiteUserFull}
                                    alt="box"
                                    preview={false}
                                  />
                                  <div className="textContainer px-3 whiteTitle18">
                                      <Tooltip
                                        title={toParty.name}
                                        overlayClassName="custom-tooltip-bg"
                                      >
                                        <span className="ellipsisText">{toParty.name}</span>
                                      </Tooltip>
                                    </div>

                                </div>
                                <div className="d-flex my-3">
                                  <Image src={WhiteEmail} alt="box" preview={false} />
                                  <div className="whiteTitle18 px-3 noWrap overflowText">
                                    {/* {toParty.email} */}
                                    <Tooltip
                                      title={toParty.email}
                                      overlayClassName='custom-tooltip'
                                    >
                                      <span>{toParty.email}</span>
                                    </Tooltip>
                                  </div>
                                </div>
                                <div className="d-flex my-3">
                                  <Image src={Globe} alt="box" preview={false} />                          
                                  <div className="whiteTitle18 ps-3 noWrap overflowText">
                                  <Tooltip
                                      title={toParty.country && toParty.country.length * 7 > 136 ? toParty.country : null}
                                      overlayClassName='custom-tooltip'
                                    >
                                    {toParty.country}
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
                                {toParty.entityType !== "COMPANY" &&  (
                                <div className="d-flex my-3">
                                  <Image src={Flag} alt="box" preview={false} />                          
                                  <div className="whiteTitle18 ps-3 noWrap overflowText">
                                  <Tooltip
                                      title={toParty.nationality && toParty.nationality.length * 7 > 136 ? toParty.nationality : null}
                                      overlayClassName='custom-tooltip'
                                    >
                                    {toParty.nationality || "--"}
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
                                </div>)}
                                <div className="d-flex my-3">
                                  <Image src={Payment} alt="box" preview={false} />
                                  <div className="whiteTitle18 bold px-3">
                                    {moneyFormat(
                                      paymentDetails?.currency,
                                      (Number(invoiceCal?.[`${toParty.userType?.toLowerCase()}Amount`] || 0)).toFixed(2)
                                    )}
                                  </div>
                                </div>
                              </Col>
                              {(contractDetail?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                <Col xs={24} sm={24} md={8} lg={8} xl={8}  className="columnData">
                                <div className="buyerBox noWrap">ESCROW ADVISOR</div>
                                <div className="d-flex my-3 align-items-baseline">
                                  <Image
                                    src={WhiteUserFull}
                                    alt="box"
                                    preview={false}
                                  />
                                  <div className="whiteTitle18 ps-3">
                                    {/* {escrowAdvisorDetails?.name} */}
                                    <Tooltip
                                      title={escrowAdvisorDetails?.name && escrowAdvisorDetails?.name.length * 7 > 136 ? escrowAdvisorDetails?.name : null}
                                      overlayClassName='custom-tooltip  custom-tooltip-inner'
                                    >
                                      <span className="overflowText-escrowadvisor">{escrowAdvisorDetails?.name}</span>
                                    </Tooltip>
                                  </div>
                                </div>
                                <div className="d-flex my-3 align-items-baseline">
                                  <Image src={WhiteEmail} alt="box" preview={false} />
                                  <div className="whiteTitle18 ps-3 noWrap overflowText">
                                    {/* {escrowAdvisorDetails?.email} */}
                                    <Tooltip
                                      title={escrowAdvisorDetails?.email}
                                      overlayClassName='custom-tooltip'
                                    >
                                      <span>{escrowAdvisorDetails?.email}</span>
                                    </Tooltip>
                                  </div>
                                </div>
                                <div className="d-flex my-3 align-items-baseline">
                                  <Image src={Globe} alt="box" preview={false} />
                                  <div className="whiteTitle18 ps-3">
                                    {escrowAdvisorDetails?.country}
                                  </div>
                                </div>
                                {escrowAdvisorDetails.entityType !== "COMPANY"  && (
                                 <div className="d-flex my-3 align-items-baseline">
                                  <Image src={Flag} alt="box" preview={false} />
                                  <div className="whiteTitle18 ps-3 noWrap overflowText">
                                    <Tooltip
                                      title={escrowAdvisorDetails?.nationality && escrowAdvisorDetails?.nationality.length * 7 > 136 ? escrowAdvisorDetails?.nationality : null}
                                      overlayClassName='custom-tooltip'
                                      >
                                      {escrowAdvisorDetails?.nationality || "--"}
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
                                </div>)}
                                <div className="d-flex my-3 align-items-baseline">
                                  <Image src={Payment} alt="box" preview={false} />
                                  <div className="whiteTitle18 bold px-3">
                                    {moneyFormat(
                                      paymentDetails?.currency,
                                      (Number(paymentDetails?.escrowAdvisorCommission || 0)).toFixed(2)
                                    )}
                                  </div>
                                </div>
                            </Col>
                              )
                              }
                            </>
                          )
                        }
                    </Row>
                    </>)}
                    {contractDetail?.contractStatus === "2" && contractDetail?.trusteeId !== null && (contractDetail?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(contractDetail)) && ( <>
                      <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className=" endtoend four-buyer-block form-body">
                        <>
                          <Col xs={24} sm={24} md={10} lg={10} xl={10}  className="columnData">
                            <div className="buyerBox noWrap">ESCROW ADVISOR</div>
                            <div className="d-flex my-3 align-items-baseline">
                              <Image
                                src={WhiteUserFull}
                                alt="box"
                                preview={false}
                              />
                              <div className="whiteTitle18 px-3 noWrap overflowText">
                                {/* {escrowAdvisorDetails?.name} */}
                                <Tooltip
                                  title={escrowAdvisorDetails?.name && escrowAdvisorDetails?.name.length * 7 > 136 ? escrowAdvisorDetails?.name : null}
                                  overlayClassName='custom-tooltip'
                                >
                                  <span>{escrowAdvisorDetails?.name}</span>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="d-flex my-3 align-items-baseline">
                              <Image src={WhiteEmail} alt="box" preview={false} />
                              <div className="whiteTitle18 px-3 noWrap overflowText">
                                {/* {escrowAdvisorDetails?.email} */}
                                <Tooltip
                                  title={escrowAdvisorDetails?.email && escrowAdvisorDetails?.email.length * 7 > 136 ? escrowAdvisorDetails?.email : null}
                                  overlayClassName='custom-tooltip'
                                >
                                  <span>{escrowAdvisorDetails?.email}</span>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="d-flex my-3 align-items-baseline">
                              <Image src={Globe} alt="box" preview={false} />
                              <div className="whiteTitle18 ps-3 noWrap overflowText">
                                <Tooltip
                                  title={escrowAdvisorDetails?.country && escrowAdvisorDetails?.country.length * 7 > 136 ? escrowAdvisorDetails?.country : null}
                                  overlayClassName='custom-tooltip'
                                >
                                  {escrowAdvisorDetails?.country}
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
                            <div className="d-flex my-3 align-items-baseline">
                              <Image src={Payment} alt="box" preview={false} />
                              <div className="whiteTitle18 bold px-3">
                                {moneyFormat(
                                  paymentDetails?.currency,
                                  (Number(paymentDetails?.escrowAdvisorCommission || 0)).toFixed(2)
                                )}
                              </div>
                            </div>
                        </Col> 
                        {/* <Col xs={24} sm={24} md={7} lg={7} xl={7}  className="columnData">
                            <div className="buyerBox">Case officer2</div>
                            <div className="d-flex my-3 align-items-baseline">
                              <Image
                                src={WhiteUserFull}
                                alt="box"
                                preview={false}
                              />
                              <div className="whiteTitle18 px-3">
                                {trusteeDetails?.name}
                              </div>
                            </div>
                            <div className="d-flex my-3 align-items-baseline">
                              <Image src={WhiteEmail} alt="box" preview={false} />
                              <div className="whiteTitle18 px-3">
                                {careEmailAddress}
                              </div>
                            </div>
                        </Col>  */}
                        </>
                      </Row>
                      </>
                    )}
                  </div>
                  {Width <= 991 ? 
                  <Col span={24} className="p-0">
                  <div className="mb-3">
                    {(paymentDetails?.contractStartedBy === "BUYER" && paymentDetails?.buyerAlias === userAlias || paymentDetails?.contractStartedBy === "SELLER" && paymentDetails?.sellerAlias === userAlias ) && paymentDetails?.contractStatus === "1" &&
                      <SecondaryOutLineButton
                      className={"w-100 mx-0"}
                      children="Edit"
                      htmlType="submit"
                      loading={loading}
                      onClick={() => {
                        navigate(EditEscrow + "/" +paymentDetails?.aliasName);

                      }}
                    />
                       }
                  </div>
                  <Card className="px-2 detailsCard h-auto stages-timeline-card">
                    <div className="stepDetails mb-4 mt-2 mx-2">Stages</div>
                    <EscrowTransationHistorySteps
                      screen={'transactionDetails'}
                      contractHistory={contractHistory}
                      contractDetail={contractDetail}
                      trustinAlias={trustinAlias}
                      paymentDetails={paymentDetails}
                      getPaymentDetails={_fetchPaymentConditions}
                      taxDetails = {taxDetails}
                      setTaxDetails = {setTaxDetails}
                      getContractStages={getContractStages}
                      _fetchPaymentConditions={_fetchPaymentConditions}
                      Width={Width}
                    />
                  </Card>
                </Col> : ""}


                {(userType === "TRUSTEE" || userType === "ADMIN" || userType === "AUTHORIZER" || userType === "SENIOR_MANAGMENT" || (userType === "USER")) && (
                  <div className="mt-4">
                    <Card className="px-4">
                      <div className="stepDetails">
                        {(sellerBankDetails || payoutAccount) && (
                          <Card className="noBorder mt-6 p-4 mb-3 status"  style={{height:'auto'}}>
                            <div  className="row endtoend">
                              <div  className="col titleText capitalize">
                                {/* {userBankList[0]?.institutionName.toLowerCase()} */}
                                {
                                  (userType === "USER" && Number(contractDetail.contractStatus) >= 2) ?
                                   <div className={Width > 600 ? "d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3" :"d-flex justify-content-between align-items-center flex-wrap mb-3 gap-3"}>
                                     <div className="stepDetails">Payout Account&apos;s Details</div>
                                     {payoutAccount && <SecondaryOutLineButton
                                       children="Update Payout account"
                                       className="w-auto"
                                       onClick={() => {
                                         setOpenUpdatePayoutAccountModal(true)
                                       }}
                                     />}
                                   </div> : 
                                   <h5>{modifyCresetUserType(paymentDetails?.sellerAlias, 'Seller')}&apos;s Bank Details</h5>
                                }
                              </div>
                            </div>
                            <Row className="mt-1" gutter={[24, 24]}>
                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">{(payoutAccount?.type ?? sellerBankDetails?.type) === "IBAN" ? "IBAN" : "Account number"}</div>
                                <div className="subText_xs overflowText">
                                  <Popover content={payoutAccount?.number ?? sellerBankDetails?.number} trigger="hover">
                                    {payoutAccount?.number ?? sellerBankDetails?.number} 
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Bank name</div>
                                <div className="subText_xs capitalize responsive-text">
                                  <Popover content={payoutAccount?.institutionName ?? sellerBankDetails?.institutionName} trigger="hover">
                                    {payoutAccount?.institutionName ?? sellerBankDetails?.institutionName}
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Routing code</div>
                                <div className="subText_xs overflowText">
                                  <Popover content={payoutAccount?.routingCode ?? sellerBankDetails?.routingCode} trigger="hover">
                                    {payoutAccount?.routingCode ?? sellerBankDetails?.routingCode}
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Routing scheme</div>
                                <div className="subText_xs overflowText">
                                  <Popover content={payoutAccount?.routingScheme ?? sellerBankDetails?.routingScheme} trigger="hover">
                                    {payoutAccount?.routingScheme ?? sellerBankDetails?.routingScheme}
                                  </Popover>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        )}
                        {userType !== "USER" && buyervirtualAccount && buyervirtualAccount.length > 0 && (
                              <><hr className="lightgrayHr"></hr>
                            <Card className="noBorder mt-6 p-4 mb-3">
                          <Row className="endtoend">
                            <Col className="titleText capitalize" span={Width < 650 ? 24 : 14}>
                              <h5 className="escrow-bankdetails-text">Escrow Account Details</h5>
                            </Col>
                          </Row>

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
                        )}
                       {userType !== "USER" && process.env.ENABLE_ESCROW_ADVISOR=='true'&&escrowAdvisorBankDetails&& (
                          <><hr className="lightgrayHr"/>
                          <Card className="noBorder mt-6 p-4 mb-3 status ant-bank-card" style={{height:'auto'}}>
                            <Row className="endtoend">
                              <Col className="titleText capitalize" span={Width < 650 ? 24 : 14}>
                                {/* {escrowBankList[0]?.institutionName.toLowerCase()} */}
                                <h5 className="escrow-bankdetails-text">Escrow advisor Bank Details</h5>
                              </Col>
                            </Row>
                            <Row className="mt-4" gutter={[24, 24]}>
                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">IBAN</div>
                                <div className="subText_xs overflowText">
                                  <Popover content={escrowAdvisorBankDetails?.number} trigger="hover">
                                    {escrowAdvisorBankDetails?.number}
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Bank name</div>
                                <div className="subText_xs capitalize responsive-text">
                                  <Popover content={escrowAdvisorBankDetails?.institutionName} trigger="hover">
                                    {escrowAdvisorBankDetails?.institutionName}
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Routing code</div>
                                <div className="subText_xs">
                                  <Popover content={escrowAdvisorBankDetails?.routingCode} trigger="hover">
                                    {escrowAdvisorBankDetails?.routingCode}
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Routing scheme</div>
                                <div className="subText_xs overflowText">
                                  <Popover content={escrowAdvisorBankDetails?.routingScheme} trigger="hover">
                                    {escrowAdvisorBankDetails?.routingScheme}
                                  </Popover>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                          </>
                        )}
                      </div>
                    </Card>
                  </div>
                )}

                {(userType === "USER" && userAlias === paymentDetails.buyerAlias) && (
                  <div className="mt-4">
                    <Card className="px-4">
                      <div className="stepDetails">
                        {buyervirtualAccount && buyervirtualAccount.length > 0 && (
                        <>
                          <Card className="noBorder mt-6 p-4 mb-3">
                          <Row className="endtoend">
                            <Col className="titleText capitalize" span={Width < 650 ? 24 : 14}>
                              <h5 className="escrow-bankdetails-text">Escrow Account Details</h5>
                            </Col>
                          </Row>

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
                        )}
                      </div>
                    </Card>
                  </div>
                )}
                  <div className="mt-4">
                    <Card className="px-4">
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
                              <div className="stepDetails_medium fw-400 ">
                                {categoryDetails?.itemType}
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
                              <div className="stepDetails_medium fw-400">
                                {categoryDetails?.itemCategory}
                              </div>
                            </div>
                          </div>
                        </Col>
                        {categoryDetails?.dynamicInputFields?.length > 0 && categoryDetails?.dynamicInputFields.map((inputField: any,index:any) => (
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
                        )) }
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                          <div className="d-flex">
                            <Image src={Suitcase} alt="user" preview={false} />
                            <div className="mx-3">
                              <div className="stepDetails_medium_sub">
                                Item name
                              </div>
                              <div className="stepDetails_medium fw-400">
                                {categoryDetails?.itemName}
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                          <div className="d-flex">
                            <Image src={Doc} alt="user" preview={false} className="doc-img"/>
                            <div className="mx-3">
                              <div className="stepDetails_medium_sub">
                                Product description
                              </div>
                              <div className="stepDetails_medium fw-400 product-details-word-wrap">
                                {categoryDetails?.description
                                  ? categoryDetails?.description
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <hr className="lightgrayHr" />
                      <Row  gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} justify="space-between">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}><div className="stepDetails mt-3 mb-3">Payment details</div></Col>
                      <div>{paymentDetails?.buyerAlias === userAlias &&
                        userType === "USER" &&
                        !paymentComplete &&
                        paymentDetails?.milestoneList[activePayment]?.paymentStatus !==
                          "INACTIVE" &&
                        (parseInt(paymentDetails?.contractStatus) === 2 ||
                          parseInt(paymentDetails?.contractStatus) === 3 ||
                          parseInt(paymentDetails?.contractStatus) === 7) && (
                          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mt-2">
                            {paymentDetails?.isDispute === true ||
                            paymentDetails?.isExpired == true ? (
                              <Button
                                onClick={() => addFund(contractId, userAlias)}
                                disabled={true}
                                type="primary"
                                className="modal-button mb-3 w-auto disabled"
                              >
                                {`+ Add ${
                                  activePayment > 0
                                    ? ordinalSuffixOf(activePayment + 1)
                                    : ""
                                } Fund`}
                              </Button>
                            ) : (((paymentDetails?.sourceOfFunds?.length > 0 && paymentDetails.sourceOfFundStatus === "APPROVED") || 
                              (!paymentDetails.sourceOfFunds && paymentDetails.sourceOfFundStatus === null)) &&
                              <>
                                {parseInt(paymentDetails?.contractStatus) ===
                                  2 &&  paymentDetails?.milestoneList[activePayment]?.paymentStatus ==
                                  null && paymentDetails?.milestoneList[activePayment]?.paymentStatus !== "INACTIVE" &&
                                contractList.length > 1 &&
                                paymentDetails?.isDispute === false ? (
                                  <Button
                                    type="primary"
                                    className={`modal-button mb-3 w-auto ${
                                      !kycVerified ||
                                      (activePayment > 0
                                        && (paymentDetails?.milestoneList[activePayment - 1]?.paymentStatus !== "COMPLETED" ||
                                        paymentDetails?.milestoneList[ activePayment - 1]?.paymentStatus ==="INACTIVE" ||
                                        paymentDetails?.milestoneList[activePayment - 1]?.transactionStatus !== "RELEASED")) ||
                                        (inProgressPaymentLogList?.length > 0 && inProgressPaymentLogList.includes(paymentDetails?.milestoneList[activePayment]?.aliasName))
                                        ? "disabled"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      addFund(contractId, userAlias)
                                    }
                                    disabled={
                                      !kycVerified ||
                                      (activePayment > 0
                                        && ((paymentDetails?.milestoneList[activePayment - 1]?.paymentStatus !== "COMPLETED" || 
                                          paymentDetails?.milestoneList[activePayment-1]?.paymentStatus ==="INACTIVE" )||
                                          paymentDetails?.milestoneList[activePayment - 1]?.transactionStatus !== "RELEASED")) || 
                                          (inProgressPaymentLogList?.length > 0 && inProgressPaymentLogList.includes(paymentDetails?.milestoneList[activePayment]?.aliasName))
                                    }
                                  >
                                    Manage Funds
                                  </Button>
                                ) : ( <> 
                                  {!paymentDetails?.isDispute && !paymentDetails?.isExpired &&
                                  <Button
                                    type="primary"
                                    className={`modal-button mb-3 w-auto ${
                                      !kycVerified || (activePayment > 0
                                        && (paymentDetails?.milestoneList[activePayment - 1]?.paymentStatus !== "COMPLETED" ||
                                        paymentDetails?.milestoneList[ activePayment - 1]?.paymentStatus ==="INACTIVE" ||
                                        paymentDetails?.milestoneList[activePayment - 1]?.transactionStatus !== "RELEASED")) ||
                                        (inProgressPaymentLogList?.length > 0 && inProgressPaymentLogList.includes(paymentDetails?.milestoneList[activePayment]?.aliasName))
                                        ? "disabled"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      addFund(contractId, userAlias)
                                    }
                                    disabled={!kycVerified || (activePayment > 0
                                      && ((paymentDetails?.milestoneList[activePayment - 1]?.paymentStatus !== "COMPLETED" || 
                                        paymentDetails?.milestoneList[activePayment-1]?.paymentStatus ==="INACTIVE" )||
                                        paymentDetails?.milestoneList[activePayment - 1]?.transactionStatus !== "RELEASED")) ||
                                        (inProgressPaymentLogList?.length > 0 && inProgressPaymentLogList.includes(paymentDetails?.milestoneList[activePayment]?.aliasName))
                                    }
                                  >
                                    {`+ Add ${
                                      activePayment > 0
                                        ? ordinalSuffixOf(activePayment + 1)
                                        : ""
                                    } Fund`}
                                  </Button> 
                                }</>
                                )}
                              </>
                            )}
                          </Col>
                        )}
                      {paymentDetails?.buyerAlias === userAlias &&
                        userType === "USER" &&
                        !paymentComplete &&
                        paymentDetails?.milestoneList[0]?.paymentStatus ===
                          "INACTIVE" && (
                          <>
                            <Col span={16} className="text-end mt-2">
                              <Button
                                type="primary"
                                className="modal-button mb-3 w-auto"
                                onClick={() =>
                                  unblockFunds(
                                    paymentDetails?.milestoneList[0]?.aliasName,
                                    "UNBLOCK"
                                  )
                                }
                                disabled={!kycVerified}
                              >
                                Unblock
                              </Button>
                            </Col>
                          </>
                        )}
                        {userType && paymentDetails?.buyerAlias !== userAlias &&
                        userType === "TRUSTEE" &&
                        contractList.length > 1 && 
                            paymentDetails?.milestoneList[0] 
                                ?.paymentStatus === "INACTIVE" &&
                              !paymentComplete &&
                              !fundAddedSuccessModal ? (
                                <>
                              <Col span={24} className="text-end mt-2">
                                <Button
                                  disabled
                                  className="modal-button mb-3"
                                >
                                  Blocked
                                </Button>
                              </Col>
                          </>
                        ): ( ((paymentDetails?.sourceOfFunds?.length > 0 && paymentDetails.sourceOfFundStatus === "APPROVED") || 
                        (!paymentDetails.sourceOfFunds && paymentDetails.sourceOfFundStatus === null)) && userType && ['TRUSTEE','AUTHORIZER'].includes(userType) &&
                          parseInt(paymentDetails?.contractStatus) === 2 && paymentDetails?.milestoneList[activePayment]?.paymentStatus ==
                            null && paymentDetails?.milestoneList[activePayment]?.paymentStatus !== "INACTIVE" &&
                          contractList.length > 1 &&
                          paymentDetails?.isDispute === false  && (
                            <Button
                              type="primary"
                              className={`modal-button mb-3 w-auto ${(activePayment > 0
                                  && (paymentDetails?.milestoneList[activePayment - 1]?.paymentStatus !== "COMPLETED" ||
                                  paymentDetails?.milestoneList[ activePayment - 1]?.paymentStatus ==="INACTIVE" ||
                                  paymentDetails?.milestoneList[activePayment - 1]?.transactionStatus !== "RELEASED"))
                                  ? "disabled"
                                  : ""
                              }`}
                              onClick={() =>
                                addFundsApprover(paymentDetails?.aliasName, paymentDetails?.milestoneList[activePayment]?.aliasName, paymentDetails?.milestoneList[activePayment]?.buyerTransactionAmount)
                              }
                              disabled={(activePayment > 0
                                && ((paymentDetails?.milestoneList[activePayment - 1]?.paymentStatus !== "COMPLETED" || 
                                  paymentDetails?.milestoneList[activePayment-1]?.paymentStatus ==="INACTIVE" )||
                                  paymentDetails?.milestoneList[activePayment - 1]?.transactionStatus !== "RELEASED"))
                              }
                            >
                              {`+ Add ${
                                activePayment > 0
                                  ? ordinalSuffixOf(activePayment + 1)
                                  : ""
                              } Fund`}
                            </Button> 
                          )
                        )}</div>
                      </Row>
                      {paymentDetails?.isMilestone && paymentDetails?.depositeFullFund === true && paymentDetails?.milestoneList[0].paymentStatus !== "COMPLETED" && userAlias === paymentDetails.buyerAlias &&( <>
                        <div>
                          <div className="subText_xs w-100 paymentMethods pl-5">
                            <p>Note: Please deposite full fund before you start with first milestone as per {paymentDetails?.contractStartedBy === "BUYER" ? modifyCresetUserType(paymentDetails?.buyerAlias,'buyer') : modifyCresetUserType(paymentDetails?.sellerAlias,'seller')} request.</p>
                          </div>
                        </div>
                        </>
                      )}
                      {paymentDetails?.isMilestone && (
                        <Col span={24} className="mt-4 payment-in-milestone step-title-container">
                          <BoldText
                            children="Milestones funds"
                            className="text-muted"
                          />
                          <Col span={24} className="res_step">
                            <Steps
                              progressDot
                              current={activePayment || 0}
                              direction="vertical"
                            >
                              {paymentDetails?.milestoneList?.map(
                                (data: any, index: any) => {
                                  sellerMilestoneAmount +=  data?.sellerReceivableAmount && data?.sellerReceivableAmount !== null ? Number(data?.sellerReceivableAmount) : Number(milestoneCal?.[data?.aliasName]?.sellerAmount);
                                  const buyerAmount = data?.buyerTransactionAmount !== null ? Number(data?.buyerTransactionAmount) : Number(milestoneCal?.[data?.aliasName]?.buyerAmount)
                                  // const totalCalculatedAmount = Number(milestoneCal[data?.aliasName]?.totalAmount)
                                  let totalPlatformFee: any = Number(milestoneCal[data?.aliasName]?.platformFee) + Number(milestoneCal[data?.aliasName]?.vatFee)
                                  allMilestonePlatformFee += totalPlatformFee;
                                  // if (totalCalculatedAmount && totalCalculatedAmount !== buyerAmount) {
                                  //   const roundingError = buyerAmount - totalCalculatedAmount;
                                  //   totalPlatformFee += roundingError;
                                  // }
                                  const totalContractFee = Number(invoiceCal?.platformFee) + Number(invoiceCal?.vatFee);
                                  let sellerAmount: any = data?.sellerReceivableAmount && data?.sellerReceivableAmount !== null ? Number(data?.sellerReceivableAmount) : Number(milestoneCal?.[data?.aliasName]?.sellerAmount);
                                  if(index === paymentDetails?.milestoneList?.length - 1) {
                                    if(Number(sellerMilestoneAmount) > Number(invoiceCal.sellerAmount)) {
                                      sellerAmount = (Number(invoiceCal.sellerAmount) - (Number(sellerMilestoneAmount) - Number(milestoneCal?.[data?.aliasName]?.sellerAmount))).toFixed(2) 
                                    } else if(Number(sellerMilestoneAmount) < Number(invoiceCal.sellerAmount)) {
                                      sellerAmount = (Number(milestoneCal?.[data?.aliasName]?.sellerAmount) + (Number(invoiceCal.sellerAmount) - Number(sellerMilestoneAmount))).toFixed(2) 
                                    } 

                                    if(Number(allMilestonePlatformFee) > Number(totalContractFee)) {
                                      totalPlatformFee = Number(totalContractFee) - (Number(allMilestonePlatformFee) - Number(totalPlatformFee))
                                    } else if(Number(allMilestonePlatformFee) < Number(totalContractFee)) {
                                      totalPlatformFee = Number(totalPlatformFee) + (Number(totalContractFee) - Number(allMilestonePlatformFee))
                                    }
                                  }
                                  return (
                                    <Step
                                      key={index}
                                      title={
                                        <div className="d-flex justify-content-between align-items-center gap-3">
                                          <span>
                                          {`${ordinalSuffixOf(
                                            index + 1
                                          )} 
                                          milestone 
                                          `
                                          // (${isFloat(milestoneCal[data.aliasName]?.milestonePercent) ? Number(milestoneCal[data.aliasName]?.milestonePercent).toFixed(2) : milestoneCal[data.aliasName]?.milestonePercent}%)
                                          }
                                          </span>
                                          <p className="fw-5 mt-1 mb-0 milestone-amount">
                                            {moneyFormat(
                                              paymentDetails.currency,
                                              data?.buyerTransactionAmount !== null ? Number(data?.buyerTransactionAmount) : Number(milestoneCal?.[data.aliasName] ? milestoneCal[data.aliasName]?.buyerAmount : 0)
                                            )}
                                          </p>
                                        </div>
                                      }
                                      className={data?.transactionStatus === "RELEASED" ? "completed" : data?.isActive === true ? "inprogress" : "inactive" }
                                      description={
                                        <>
                                          <Collapse
                                            defaultActiveKey={paymentDetails?.milestoneList
                                              ?.map((item: any) => item.isActive)
                                              .indexOf(true)}
                                            expandIconPosition={"right"}
                                            ghost
                                          >
                                            <Panel
                                              header={`${data.name} ${formatReleaseDate(
                                                data.releasedDate,
                                                data.transactionStatus
                                              )}`}
                                              key={index}
                                              className="border-bottom payment-condition"
                                            >
                                              {<div>
                                                {data?.paymentStatus !== "COMPLETED" &&
                                                <div>
                                                  <div className="endtoend py-2 gap-3">
                                                  <b className="subText_small">Amount to be transferred to {modifyCresetUserType(paymentDetails?.buyerAlias,'buyer')}&apos;s escrow account
                                                  </b>
                                                  <b className="subText_small text-end">
                                                    {moneyFormat(
                                                      paymentDetails?.currency,
                                                      buyerAmount
                                                    )}
                                                  </b>
                                                </div>
                                                <div className="endtoend py-2 gap-3">
                                                    <b className="subText_small">Amount to be received by {modifyCresetUserType(paymentDetails?.sellerAlias,'seller')}&apos;s bank account</b>
                                                    <b className="subText_small text-end">
                                                      <div>
                                                        {moneyFormat(
                                                          paymentDetails?.currency,
                                                          sellerAmount
                                                        )}
                                                      </div>
                                                      {forexExchangeRate && (payoutAccount?.accountCurrency ?? payoutAccount?.currency) != null && paymentDetails?.currency !== (payoutAccount?.accountCurrency ?? payoutAccount?.currency) ? 
                                                      <div style={{fontSize: "14px"}}>
                                                        {!isForexExchangeRateLoading ? `(${Number((Number(sellerAmount) * Number(forexExchangeRate)).toFixed(2)).toLocaleString()} ${payoutAccount?.accountCurrency ?? payoutAccount?.currency})` : 'Calculating...'}
                                                      </div>  : null}
                                                    </b>
                                                  </div>
                                                  {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                                    <div className="endtoend py-2 gap-3">
                                                      <b className="subText_small">Amount to be received by escrow advisor&apos;s bank account</b>
                                                      <b className="subText_small text-end">
                                                        {moneyFormat(
                                                          paymentDetails?.currency,
                                                          Number(Number(milestoneCal?.[data?.aliasName]?.buyerAdvisorFee) + Number(milestoneCal?.[data?.aliasName]?.sellerAdvisorFee)).toFixed(2)
                                                        )}
                                                      </b>
                                                    </div>
                                                  )}
                                                  <div className="endtoend py-2 gap-3">
                                                    <b className="subText_small">Amount to be received by TrustIn Platform</b>
                                                    <b className="subText_small text-end">
                                                      {moneyFormat(
                                                        paymentDetails?.currency,
                                                        (totalPlatformFee).toFixed(2)
                                                      )}
                                                    </b>
                                                  </div>
                                            </div>
                                              }
                                              {data?.paymentStatus === "COMPLETED" && data.transactionStatus !== "RELEASED" &&
                                                <div>
                                                  <div className="endtoend py-2 gap-3">
                                                  <b className="subText_small">Amount to be transferred to {modifyCresetUserType(paymentDetails?.buyerAlias,'buyer')}&apos;s escrow account
                                                  </b>
                                                  <b className="subText_small text-end">
                                                    {moneyFormat(
                                                      paymentDetails?.currency,
                                                      buyerAmount
                                                    )}
                                                  </b>
                                                </div>
                                                <div className="endtoend py-2 gap-3">
                                                    <b className="subText_small">Amount to be received by {modifyCresetUserType(paymentDetails?.sellerAlias,'seller')}&apos;s bank account</b>
                                                    <b className="subText_small text-end">
                                                      {moneyFormat(
                                                        paymentDetails?.currency,
                                                        milestoneCal[data?.aliasName]?.sellerAmount
                                                      )}
                                                    </b>
                                                  </div>
                                                  {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                                    <div className="endtoend py-2 gap-3">
                                                      <b className="subText_small">Amount to be received by escrow advisor&apos;s bank account</b>
                                                      <b className="subText_small text-end">
                                                        {moneyFormat(
                                                          paymentDetails?.currency,
                                                          Number(Number(milestoneCal?.[data?.aliasName]?.buyerAdvisorFee) + Number(milestoneCal?.[data?.aliasName]?.sellerAdvisorFee)).toFixed(2)
                                                        )}
                                                      </b>
                                                    </div>
                                                  )}
                                                  <div className="endtoend py-2 gap-3">
                                                    <b className="subText_small">Amount to be received by TrustIn Platform</b>
                                                    <b className="subText_small text-end">
                                                      {moneyFormat(
                                                        paymentDetails?.currency,
                                                        (Number(milestoneCal[data?.aliasName]?.platformFee) + Number(milestoneCal[data?.aliasName]?.vatFee)).toFixed(2)
                                                      )}
                                                    </b>
                                                  </div>
                                            </div>
                                              }
                                              {data?.paymentStatus === "COMPLETED" && data?.transactionStatus === "RELEASED" && (
                                                <>
                                                  <div className="endtoend py-2 gap-3">
                                                    <b className="subText_small">Amount to be received by {modifyCresetUserType(paymentDetails?.sellerAlias,'seller')}&apos;s bank account</b>
                                                    <b className="subText_small text-end">
                                                      {moneyFormat(
                                                        paymentDetails?.currency,
                                                        sellerAmount
                                                      )}
                                                    </b>
                                                  </div>
                                                  {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                                    <div className="endtoend py-2 gap-3">
                                                      <b className="subText_small">Amount to be received by escrow advisor&apos;s bank account</b>
                                                      <b className="subText_small text-end">
                                                        {moneyFormat(
                                                          paymentDetails?.currency,
                                                          Number(Number(milestoneCal?.[data?.aliasName]?.buyerAdvisorFee) + Number(milestoneCal?.[data?.aliasName]?.sellerAdvisorFee)).toFixed(2)
                                                        )}
                                                      </b>
                                                    </div>
                                                  )}
                                                  <div className="endtoend py-2 gap-3">
                                                    <b className="subText_small">Amount to be received by TrustIn Platform</b>
                                                    <b className="subText_small text-end">
                                                      {moneyFormat(
                                                        paymentDetails?.currency,
                                                        (Number(milestoneCal[data?.aliasName]?.platformFee) + Number(milestoneCal[data?.aliasName]?.vatFee)).toFixed(2)
                                                      )}
                                                    </b>
                                                  </div>
                                                </>
                                              )
                                              }
                                              </div>
                              }
                                            </Panel>
                                          </Collapse>
                                          {/* <p className="position-absolute top-0 end-0 fw-5 mt-1">
                                            {moneyFormat(
                                              paymentDetails.currency,
                                              data?.buyerTransactionAmount !== null ? Number(data?.buyerTransactionAmount) : Number(milestoneCal?.[data.aliasName] ? milestoneCal[data.aliasName]?.buyerAmount : 0)
                                            )}
                                          </p> */}
                                        </>
                                      }
                                    />
                                  );
                                }
                              )}
                            </Steps>
                          </Col>
                        </Col>
                      )}
                      <hr className="lightgrayHr" />
                      <Card className="grayCard payments-details-cards">
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                            Available amount
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency, walletAmountAndCount?.availableAmount || 0
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                            Agreement amount
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              paymentDetails?.invoiceAmount
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2 gap-3">
                          <div className="stepDetails_medium_sub">
                            Total TrustIn fees ({invoiceCal?.platformPercent}) +{" "}
                          {paymentDetails?.vatCharges ?? process.env.COUNTRY_VAT}% VAT
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              Number(invoiceCal?.platformFee ? invoiceCal?.platformFee : 0))
                            }{" "}
                            +{" "}
                            {moneyFormat(
                              paymentDetails?.currency,
                              Number(invoiceCal?.vatFee ? invoiceCal?.vatFee : 0)
                            )}
                          </div>
                        </div>
                        {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT?.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                        <><div className="endtoend py-2 gap-3">
                          <div className="stepDetails_medium_sub">
                            Transaction fees for escrow advisor
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              (Number(paymentDetails?.escrowAdvisorCommission || 0)).toFixed(2)
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                          Escrow advisor fees to be paid by {modifyCresetUserType(paymentDetails?.buyerAlias,'buyer')} ({Number(paymentDetails?.buyerCommissionPercent || 0)}%)
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              invoiceCal?.buyerAdvisorFee || 0
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                          Escrow advisor fees to be paid by {modifyCresetUserType(paymentDetails?.sellerAlias,'seller')} ({Number(paymentDetails?.sellerCommissionPercent || 0)}%)
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              invoiceCal?.sellerAdvisorFee || 0
                            )}
                          </div>
                        </div>
                        </>
                        )}
                        <div className="endtoend py-2 gap-3">
                          <div className="stepDetails_medium_sub">
                            TrustIn platform fees to be paid by {toTitleCase(USER_TYPE_TEXT.TENENT)} ({paymentDetails?.buyerPercent}%)
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              Number(invoiceCal?.buyerTransactionFee)
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2 gap-3">
                          <div className="stepDetails_medium_sub">
                          TrustIn platform fees to be paid by {toTitleCase(getLabel())} ({paymentDetails?.sellerPercent}%)
                          </div>
                          <div className="subText_small fw-400 text-right">
                            <div>
                              {moneyFormat(
                                paymentDetails?.currency,
                                Number(invoiceCal?.sellerTransactionFee)
                              )}
                            </div>
                            {forexExchangeRate && (payoutAccount?.accountCurrency ?? payoutAccount?.currency) != null && paymentDetails?.currency !== (payoutAccount?.accountCurrency ?? payoutAccount?.currency) ? 
                            <div style={{fontSize: "14px"}}>
                              {!isForexExchangeRateLoading ? `(${Number((Number(invoiceCal?.sellerTransactionFee) * Number(forexExchangeRate)).toFixed(2)).toLocaleString()} ${payoutAccount?.accountCurrency ?? payoutAccount?.currency})` : 'Calculating...'}
                            </div>  : null}
                          </div>
                        </div>
                        <div className="endtoend py-2 gap-3">
                          <div className="stepDetails_medium_sub">
                          Amount to be paid by {toTitleCase(USER_TYPE_TEXT.TENENT)}
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              Number(invoiceCal?.buyerAmount)
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2 gap-3">
                          <div className="stepDetails_medium_sub">
                          Amount to be received by {toTitleCase(getLabel())}
                          </div>
                          <div className="subText_small fw-400 text-right">
                            <div>
                              {moneyFormat(
                                paymentDetails?.currency,
                                Number(invoiceCal?.sellerAmount)
                              )}
                            </div>
                            {forexExchangeRate && (payoutAccount?.accountCurrency ?? payoutAccount?.currency) != null && paymentDetails?.currency !== (payoutAccount?.accountCurrency ?? payoutAccount?.currency) ? 
                            <div style={{fontSize: "14px"}}>
                              {!isForexExchangeRateLoading ? `(${Number((Number(invoiceCal?.sellerAmount) * Number(forexExchangeRate)).toFixed(2)).toLocaleString()} ${payoutAccount?.accountCurrency ?? payoutAccount?.currency})` : 'Calculating...'}
                            </div>  : null}
                          </div>
                        </div>
                        <div className="endtoend py-2 gap-3">
                          <div className="stepDetails_medium_sub">
                            Total agreement amount
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              paymentDetails?.totalInvoiceAmount !== null ? Number(paymentDetails?.totalInvoiceAmount) : Number(invoiceCal?.totalAmount)
                            )}
                          </div>
                        </div>
                        {paymentDetails?.milestoneList?.map((item:any,index:any)=>(
                          <>
                          <div key={index} className="w-100">
                            {(item?.isActive === true || item?.transactionStatus === "RELEASED") && 
                            <>
                            <hr className="lightgrayHr" />
                            {paymentDetails?.isMilestone &&
                            <p>{`${ordinalSuffixOf(index + 1)} milestone - ${item.name}`}</p> }
                            {item?.paymentStatus !== "COMPLETED" &&
                              <div className="endtoend py-2">
                                <b className="subText_small">Amount to be transferred by {toTitleCase(USER_TYPE_TEXT.TENENT)} to their escrow account</b>
                                <b className="subText_small text-end">
                                  {moneyFormat(
                                      paymentDetails?.currency,
                                      item?.buyerTransactionAmount !== null ? Number(item?.buyerTransactionAmount) : Number(milestoneCal?.[item?.aliasName]?.buyerAmount)
                                  )}
                                </b>
                              </div>
                            }
                            {item?.paymentStatus === "COMPLETED"  && item.transactionStatus !== "RELEASED" &&
                              <div className="endtoend py-2">
                                <b className="subText_small">Amount successfully transferred to {toTitleCase(USER_TYPE_TEXT.TENENT)}&apos;s escrow account</b>
                                <b className="subText_small text-end">
                                  {moneyFormat(
                                      paymentDetails?.currency,
                                      item?.buyerTransactionAmount !== null ? Number(item?.buyerTransactionAmount) : Number(milestoneCal?.[item?.aliasName]?.buyerAmount)
                                  )}
                                </b>
                              </div>
                            } 
                            {item?.paymentStatus === "COMPLETED" && item?.transactionStatus === "RELEASED" && (
                              <>
                                <div className="endtoend py-2">
                                  <b className="subText_small">Amount is successfully transferred to {toTitleCase(getLabel())}&apos;s bank</b>
                                  <b className="subText_small text-end">
                                    {moneyFormat(
                                        paymentDetails?.currency,
                                        milestoneCal[item?.aliasName]?.sellerAmount
                                    )}
                                  </b>
                                </div>
                                {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                  <div className="endtoend py-2">
                                    <b className="subText_small">Amount is successfully transferred to escrow advisor&apos;s bank</b>
                                    <b className="subText_small text-end">
                                      {moneyFormat(
                                          paymentDetails?.currency,
                                          Number(Number(milestoneCal?.[item?.aliasName]?.buyerAdvisorFee) + Number(milestoneCal?.[item?.aliasName]?.sellerAdvisorFee)).toFixed(2)
                                      )}
                                    </b>
                                  </div>
                                )}
                                <div className="endtoend py-2">
                                  <b className="subText_small">Amount is successfully transferred to trustin platform</b>
                                  <b className="subText_small text-end">
                                    {moneyFormat(
                                        paymentDetails?.currency,
                                        Number(Number(milestoneCal[item?.aliasName]?.platformFee) + Number(milestoneCal[item?.aliasName]?.vatFee)).toFixed(2)
                                    )}
                                  </b>
                                </div>
                              </>
                             )
                            }
                            {(['AUTHORIZER', 'TRUSTEE', 'SENIOR_MANAGMENT', 'ADMIN']).includes(userType) && paymentDetails?.platformChargeAppliedOn != null && paymentDetails?.platformChargeAppliedOn != PLATFORM_CHARGE_APPLIED_ON.DEFAULT ?
                              <>
                                <div className="endtoend py-2">
                                  <b className="subText_small">User Platform charges are applied of {toTitleCase(paymentDetails?.platformChargeAppliedOn)}</b>
                                  <b className="subText_small text-end">
                                    {paymentDetails?.platformChargeAppliedOn == PLATFORM_CHARGE_APPLIED_ON.BUYER ? contractDetail?.buyerDetails?.name : contractDetail?.sellerDetails?.name}
                                  </b>
                                </div>
                                
                              </>
                              : null}
                            </>}
                            </div>
                          </>))
                        }

                    
                      </Card> 
                       {(customContractList && Object.keys(customContractList).length > 0 
                          || customAttachURL 
                          || customAttachmentUrls.length
                        ) ? <>
                          <hr className="lightgrayHr" /> 
                          <CustomContractDetails customFieldList= {customContractList} customAttachUrl={customAttachURL} customAttachmentUrls={customAttachmentUrls}/> 
                          </> : ""
                        }

                        { 
                          userType == 'USER' ? (
                          <div className={`w-100 ${!contractDetail?.isAgreementFull ? 'd-none' : ''}`}>
                          <div style={{padding : "0.5rem"}}>
                              <hr className="lightgrayHr" />
                              <div className="checkbox-contain"> 
                              <Checkbox style={{ flexShrink: 0 }} disabled={contractDetail?.isAgreementFull} checked={contractDetail?.isAgreementFull}  onChange={(event) => { updateContracts(event); }}/>
                                <SmallText
                                  className="formSubText forgetpassword"
                                    children={
                                      <>
                                        I, hereby authorize Trustin Limited to release the payment to the {toTitleCase(getLabel())} at the time of fulfilment of the escrow conditions. 
                                      </>
                                    }
                                    style={{ marginLeft: "8px", textAlign: "start", flex: 1 }} 
                                  />
                                </div>
                              </div>
                            </div>
                          ) : ''
                        }                                    

                        <Card className="grayCard p-3 mb-5"> 
                        {paymentDetails?.buyerAlias !== userAlias &&
                          userType === "TRUSTEE" ? (
                            <TrusteeReleaseCondition
                              title="Release Payment: Required Documents"
                              getPaymentDetails={_fetchPaymentConditions}
                              paymentData={paymentDetails}
                              setPaymentData={setPaymentDetails}
                              _fetchPaymentConditions={_fetchPaymentConditions}
                              releasePayment={releasePayment}
                            />
                          ) : paymentDetails?.buyerAlias !== userAlias && (userType === "AUTHORIZER" ||
                          userType === "SENIOR_MANAGMENT") && (!["SUCCESS", "INITIATED"].includes(releaseStatusMsg)) ? (
                            <AdminReleaseCondition
                              title="Release Payment: Required Documents"
                              contractDetail={contractDetail}
                              paymentData={paymentDetails}
                              releaseModal={releaseModal}
                              setReleaseModal={setReleaseModal}
                              getPaymentDetails={_fetchPaymentConditions}
                              _fetchPaymentConditions={_fetchPaymentConditions}
                              releasePayment={releasePayment}
                              inProgressPaymentRelease={inProgressPaymentRelease}
                              payoutAccount={payoutAccount}
                            />
                          ) : (
                            <PaymentReleaseCondition
                              contractDetail={contractDetail}
                              contractStatus={contractStatus}
                              btnText={btnText}
                              getPaymentDetails={_fetchPaymentConditions}
                              paymentData={paymentDetails}
                              setPaymentData={setPaymentDetails}
                              _fetchPaymentConditions={_fetchPaymentConditions}
                              title="Release Payment: Required Documents"
                              initiatePayment={initializePayment}
                              paymentDetails={paymentDetails}
                              payoutAccount={payoutAccount}
                              setPayoutAccount={setPayoutAccount}
                              bankAccountList={bankAccountList}
                              setBankAccountList={setBankAccountList}
                            />
                          )
                        }
                        {paymentDetails.sourceOfFundStatus === "REJECTED" && !["TRUSTEE","APPROVER","AUTHORIZER","SENIOR_MANAGMENT"].includes(userType) && 
                          <div className="mt-1">
                            <p style={{ color: "red", margin: "-16px 0px 16px" }} className="mt-2">
                              Note: The contract has been rejected following a review that revealed certain issues within the submitted source of fund documents.
                            </p>
                          </div>
                        }
                        </Card>                    

                      {paymentDetails?.isDispute || paymentDetails?.disputeDetails !== null ? (
                        <div>
                          <hr className="lightgrayHr" />
                          <div className="stepDetails mb-4 mt-4">
                            Dispute resolution
                          </div>
                          <Row>
                          <Col span={Width > 550 ? 12 : 24}>
                          <div className={Width > 550 ? "d-flex" :"d-flex mt-2"}>
                              <Image
                                src={UserFull}
                                alt="user"
                                preview={false}
                              />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Name (type)
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {
                                    paymentDetails?.disputeDetails
                                      ?.initiatedByName
                                  }{" "}
                                  <span className="stepDetails_medium_sub">
                                    ({modifyCresetUserType(paymentDetails?.buyerAlias,'buyer')})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={Width > 550 ? 12 : 24}>
                            <div className={Width > 550 ? "d-flex" :"d-flex mt-2"}>
                              <Image src={Email} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Email address
                                </div>
                                <div className="stepDetails_medium fw-400 dispute-resolution-text">
                                  {
                                    paymentDetails?.disputeDetails
                                      ?.initiatedByEmail
                                  }
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={Width > 550 ? 12 : 24}>
                          <div className={Width > 550 ? "d-flex my-4" :"d-flex mt-2"}>
                              <Image src={Reason} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Reason
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {paymentDetails?.disputeDetails?.type}
                                </div>
                              </div>
                            </div>   
                          </Col>
                          <Col span={Width > 550 ? 12 : 24}>
                          <div className={Width > 550 ? "d-flex my-4" :"d-flex mt-2"}>
                              <Image
                                src={Doc}
                                height={18}
                                width={18}
                                alt="user"
                                preview={false}
                              />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Description
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {paymentDetails?.disputeDetails?.description}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                          <div className={Width > 767 ? "d-flex w-100" : "d-flex flex-column w-100 "}>
                            <div className="labelTab my-3">Refund details</div>
                            {paymentDetails?.disputeDetails?.isGenerated ? (
                              false
                            ) : userType == "ADMIN" ? (
                              <div className={Width > 767 ? "d-flex my-3" : "d-flex flex-column w-100 "}>
                                <div
                                  className={Width >767 ? "secondaryLink cursor mx-5":"secondaryLink cursor mx-0 mb-3"}
                                  onClick={() => {
                                    navigate(
                                      Resolve_Dispute +
                                        id +
                                        "?type=generaterefund"
                                    );
                                  }}
                                >
                                  Generate refund
                                </div>
                                <div
                                  className={Width >767 ? "secondaryLink cursor":"secondaryLink cursor mb-3"}
                                  onClick={() => {
                                    navigate(
                                      Resolve_Dispute +
                                        id +
                                        "?type=partialrefund"
                                    );
                                  }}
                                >
                                  Partial refund
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <Row>
                            <Col span={Width > 550 ? 12 : 24}>
                            <div className="d-flex ">
                              <Image src={Refund} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Refund amount & %
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {paymentDetails?.disputeDetails
                                    ?.refundAmount > 0 ? (
                                    <span>
                                      {paymentDetails?.currency +
                                        " " +
                                        parseFloat(paymentDetails?.disputeDetails
                                          ?.refundAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      <span className="stepDetails_medium_sub">
                                        (
                                        {
                                          paymentDetails?.disputeDetails
                                            ?.refundPercentage
                                        }
                                        %)
                                      </span>
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </div>
                            </div>
                            </Col>
                            <Col span={Width > 550 ? 12 : 24}>
                            <div className="d-flex ">
                              <Image src={Reason} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                {paymentDetails?.disputeDetails?.refundReason && paymentDetails?.disputeDetails?.refundReason !== null ? "Refund reason" : paymentDetails?.disputeDetails?.resolveReason && paymentDetails?.disputeDetails?.resolveReason !== null  ? "Resolve reason" : "" }
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {paymentDetails?.disputeDetails?.refundReason
                                    ? paymentDetails?.disputeDetails
                                        ?.refundReason
                                    : paymentDetails?.disputeDetails?.resolveReason && paymentDetails?.disputeDetails?.resolveReason !== null  ? paymentDetails?.disputeDetails?.resolveReason : "-"}
                                </div>
                              </div>
                            </div>
                            </Col>
                          </Row>
                          <div className="labelTab my-4">Attachments</div>
                          <div className="d-flex mb-4">
                            <Image src={Id} alt="id" preview={false} />
                            <div
                              className="subText_small fw-400 text-right mx-3 cursor"
                              onClick={() => {
                                if(paymentDetails?.disputeDetails?.file.includes(".pdf")){
                                   setverifyVisible(true)
                                   setImagUrl(paymentDetails?.disputeDetails?.file)
                                }
                                else{
                                  openViewModal(
                                    paymentDetails?.disputeDetails?.file
                                  );
                                }
                              }}
                            >
                              View
                              <Image
                                src={BlueEye}
                                alt="id"
                                className="px-2 pr-25"
                                preview={false}
                              />
                            </div>
                          </div>
                          {paymentDetails?.disputeDetails?.isGenerated ? (
                            false
                          ) : userType == "ADMIN" ? (
                            <Row className="center_res my-3">
                              <div className={Width > 550 ? "d-flex  mb-3" : "d-flex flex-column mb-3 gap-3"}>
                                <Button
                                  className="rounded w-auto mx-2 mt-0"
                                  htmlType="submit"
                                  onClick={() => {
                                    navigate(
                                      Resolve_Dispute +
                                        id +
                                        "?type=releasepayment"
                                    );
                                  }}
                                >
                                  Release Payment
                                </Button>
                                <Button
                                  className="rounded_blue_outline w-auto mx-2 mt-0"
                                  onClick={() => {
                                    navigate(
                                      Resolve_Dispute +
                                        id +
                                        "?type=resolvedispute"
                                    );
                                  }}
                                >
                                  Resolve Dispute
                                </Button>
                              </div>
                            </Row>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : null}
                    </Card>
                    {["TRUSTEE","APPROVER","AUTHORIZER","SENIOR_MANAGMENT"].includes(userType) && !["0","1"].includes(paymentDetails?.contractStatus) &&
                      paymentDetails?.sourceOfFunds && paymentDetails?.sourceOfFunds?.length > 0 &&
                     (
                      <>
                        <Card className="payments-details-cards mt-4 p-3 mb-5"> 
                        <div className="stepDetails mt-3" style={{whiteSpace: "wrap"}}>Source of funds</div>
                        <SourceOfFundDetails 
                          contractAlias={paymentDetails?.aliasName}
                          contractType="CONTRACT"
                          getPaymentDetails={_fetchPaymentConditions}
                        />
                        </Card>
                      </>
                    )}
                    {vATransactions && (
                      userType === "TRUSTEE") &&
                      !paymentDetails?.isDispute && 
                      contractHistory &&
                      contractHistory["ADD_FUND"] && 
                      paymentDetails?.milestoneList?.map((milestone: any) => ( 
                      milestone?.isActive && milestone.paymentStatus === "COMPLETED" && !milestone.isTransactionVerified ? (
                        <>
                          <Card className="p-3 mt-4 payment-transaction-details-card">
                            <>
                            <div className="stepDetails mb-4 mt-4">Payment transaction details</div>
                            <div className="h-175 max-h-460 mb-4 overflow-y-scroll scrollbar-container">
                            {vATransactions.map((item: any) => (
                            <><Row>
                              <Col span={12}>
                                <div className="d-flex align-items-baseline">
                                  <Image
                                    src={Suitcase}
                                    alt="user"
                                    preview={false} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      From Account
                                    </div>
                                    <div className="stepDetails_medium fw-400">
                                      {item?.fromAccountHolderName ?? "--"}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-4 align-items-baseline">
                                  <Image
                                    src={Suitcase}
                                    alt="user"
                                    preview={false} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      From Account no
                                    </div>
                                    <div className="stepDetails_medium fw-400">
                                      {item?.fromAccountNo ?? "--"}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-4 align-items-baseline">
                                  <Image
                                    src={Suitcase}
                                    alt="user"
                                    preview={false} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      To Account type
                                    </div>
                                    <div className="stepDetails_medium fw-400 capitalize">
                                      {item?.AccountType?.toLowerCase()}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-4 align-items-baseline">
                                  <Image
                                    src={Clock}
                                    alt="user"
                                    preview={false}
                                    height={18}
                                    width={18} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      Added on
                                    </div>
                                    <div className="stepDetails_medium fw-400 capitalize">
                                      {moment(
                                        item?.createAt
                                      ).format("DD-MM-YYYY")}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-4 align-items-baseline">
                                  <Image
                                    src={TransactioType}
                                    alt="user"
                                    preview={false}
                                    className="transaction-info-icon"
                                    />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                    Transaction information
                                    </div>
                                    <div className="stepDetails_medium fw-400 capitalize">
                                      {item?.TransactionInformation}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col span={12}>
                              <div className="d-flex align-items-baseline">
                                  <Image
                                    src={Suitcase}
                                    alt="user"
                                    preview={false} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      From Bank
                                    </div>
                                    <div className="stepDetails_medium fw-400">
                                      {item?.fromAccountBankName ?? "--"}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-4 align-items-baseline">
                                  <Image
                                    src={Suitcase}
                                    alt="user"
                                    preview={false} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      Amount
                                    </div>
                                    <div className="stepDetails_medium fw-400">
                                      {item?.Currency +
                                        " " +
                                        parseFloat(item?.Amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-4 align-items-baseline">
                                  <Image
                                    src={Suitcase}
                                    alt="user"
                                    preview={false} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      To Account no
                                    </div>
                                    <div className="stepDetails_medium fw-400">
                                      {item?.VirtualAccountId}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-4 align-items-baseline">
                                  <Image
                                    src={Doc}
                                    alt="user"
                                    preview={false}
                                    height={20}
                                    width={20} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      Payment mode
                                    </div>
                                    <div className="stepDetails_medium fw-400 capitalize">
                                      {item?.PaymentMode?.toLowerCase()}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-4 align-items-baseline">
                                  <Image
                                    src={bankAcc}
                                    alt="user"
                                    preview={false}
                                    height={20}
                                    width={20} />
                                  <div className="mx-2">
                                    <div className="stepDetails_medium_sub">
                                      Bank reference number
                                    </div>
                                    <div className="stepDetails_medium fw-400 capitalize">
                                      {item?.BankReferenceNumber}
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row><Divider /></>
                          ))}
                          </div>
                          </>
                          <Row className="center_res">
                            <div className={Width > 400 ? "d-flex mb-4 gap-3" : "d-flex mb-4 flex-column justify-content-center align-items-center gap-3"}>
                              <Button
                                className="rounded mt-0"
                                htmlType="submit"
                                onClick={() => {
                                  showVerifyModal("Approve contract");
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                className="rounded_cancel_btn  mt-0"
                                onClick={() => {
                                  showVerifyModal("Reject contract");
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          </Row>
                          </Card>
                        </>
                      ): null))}


                      {
                        displayMasterDoc() ? 
                        <Card className="p-4 mt-4">
                              <div className="stepDetails mb-4">Master Contract</div>
                                <Row gutter={{ md: 36, sm: 16, xs: 16 }} className="mb-2 m-0">
                                  <Card
                                        className=" kybcard"
                                        cover={
                                          <>
                                              <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(masterDocument) }}>
                                                <PDFPreview
                                                  url={masterDocument}
                                                  onPreviewClick={handlePDFView}
                                                />
                                              </div>
                                            </>
                                        }
                                        >
                                        <Meta 
                                          title={
                                          <>
                                          <div className="d-flex justify-content-between align-items-center gap-2">
                                            Document 1
                                          </div>
                                          </>
                                          } 
                                        />
                                      </Card>
                                   </Row>
                            </Card>
                     : null }

                     
                        
                    { paymentDetails?.isContractVerify? ( <>
                      <Card className="px-4 mt-4">
                        <div className="stepDetails my-4">Contract status</div>
                        {paymentDetails?.milestoneList?.map((milestone: any, index: number) => ( milestone?.isTransactionVerified ? (<>
                          <div className="stepDetails_medium_sub">
                            {milestone?.name} transaction status & reason
                          </div>
                          <div className="status my-2">
                            
                            {(paymentDetails.contractStatus != "-1" || milestone?.transactionStatus === "RELEASED") && milestone?.isCompliance !== false ? (
                              <div>
                                <Image
                                  src={Success}
                                  alt="company"
                                  preview={false}
                                  className="px-1"
                                />
                                <span className="active">Verified</span>
                              </div>
                            ) : (
                              <div>
                                <Image
                                  src={Reject}
                                  alt="company"
                                  preview={false}
                                  className="px-1"
                                />
                                <span className="pending">Rejected</span>
                              </div>
                            )}
                          </div>
                          <div className="subText_xs mb-2">
                            {milestone?.isCompliance === false ? milestone?.notCompliantReason : milestone?.approveStatus === "2" || milestone?.trusteeApproveStatus === "2" ? milestone?.rejectReason : milestone?.reasonComment}
                          </div>
                          {[AuthUserTypes.TRUSTEE, AuthUserTypes.AUTHORIZER,AuthUserTypes.ADMIN].includes(userType) &&
                          <>
                            <div>
                              {paymentDetails?.approverOptaionfile?.length > 0  && milestone.approveDoc !== null && milestone.approveDoc !='' &&
                              <>
                                <div className="stepDetails_medium_sub">Approver optional Comments & document</div>
                                {paymentDetails.approverOptaionfile?.map((item:any)=>(
                                <>
                                  
                                    {milestone.approveDoc == item.id &&
                                    <>
                                      <div className="d-flex w-100 my-1 gap-2">
                                        <Image src={Doc} alt="id" className="d-flex my-1" preview={false} height={16} width= {22}/>
                                        <span>{item?.inputfileid}</span>
                                        <Popover content={<>Click this icon to <br />preview attached file</>} placement="bottomLeft">
                                          <span className="pt-1"  onClick={() => {
                                            if(item?.url?.includes(".pdf")){
                                              setverifyVisible(true)
                                              setImagUrl(item?.url)
                                            }
                                            else{
                                              openViewModal(
                                              item?.url
                                              );
                                            }
                                          }}> 
                                            <Image src={BlueEye} alt="id" className="d-flex" preview={false} height={16} width= {22} style={{cursor:'pointer'}}/>
                                          </span>
                                        </Popover>
                                        </div>
                                        <div className="subText_xs mb-2">
                                          <span>Approver comment : {milestone.approveComment}</span>
                                        </div>
                                      </>
                                    }
                                </>
                                )) }
                              </>
                              }
                            </div>
                          </>
                          }
                          {paymentDetails?.milestoneList?.length > 1 && index < paymentDetails?.milestoneList?.length-1 && <hr className="lightgrayHr" />}
                        </> ) : null ))}
                        </Card>
                        </>
                      ) : null}
                  </div>
                  {Width <= 991 ? <Col span={24} className="p-0"> 
                  <div className="d-flex justify-content-end pb-3 pt-3">
                  {paymentDetails?.milestoneList?.map((item: any, index: number) => {
                    if (
                      item?.paymentStatus === "COMPLETED" &&
                      userType === "USER" &&
                      paymentDetails?.isDispute === false &&
                      item?.transactionStatus !== "RELEASED"  &&
                      item?.isActive === true 
                    ) {
                      return (
                        <>
                        {paymentDetails?.disputeDetails?.isGenerated ? null : (
                          <Button
                            type="primary"
                            className="mx-2 modal-button-cancel w-auto"
                            onClick={() => {raiseDispute()}}
                          >Raise Dispute</Button>
                        )}
                      </>
                    );
                  }
                  if ( item?.paymentStatus === "COMPLETED" &&
                      userType === "USER" &&
                      paymentDetails?.isDispute === true &&
                      index === 0
                      ) {
                        return (
                          <>
                            <p
                              children="Escrow Transaction Disputed "
                              className=" mb-0"
                              style={{ fontSize: "20px", color: "#ff6600" }}
                            />
                          </>
                        );
                      }
                    })}
                    </div>            
                 </Col> : ""}
                </Col>
                
                {Width >= 992 ?
                 <Col xs={24} sm={24} md={24} lg={8} xl={8} span={8}>
                <div className="mb-3">
                {(paymentDetails?.contractStartedBy === "BUYER" && paymentDetails?.buyerAlias === userAlias || paymentDetails?.contractStartedBy === "SELLER" && paymentDetails?.sellerAlias === userAlias )  && paymentDetails?.contractStatus === "1" &&
                    
                      <SecondaryOutLineButton
                      className={"w-100 mx-0"}
                      children="Edit"
                      htmlType="submit"
                      loading={loading}
                      onClick={() => {
                        navigate(EditEscrow + "/" +paymentDetails?.aliasName);

                      }}
                    /> 
                       }
                </div>
                  <Card className="px-2 detailsCard h-auto stages-timeline-card">
                    <div className="stepDetails mb-4 mt-2 mx-2">Stages</div>
                    <EscrowTransationHistorySteps
                      screen={'transactionDetails'}
                      contractHistory={contractHistory}
                      trustinAlias={trustinAlias}
                      contractDetail={contractDetail}
                      paymentDetails={paymentDetails}
                      getPaymentDetails = {_fetchPaymentConditions}
                      taxDetails = {taxDetails}
                      setTaxDetails = {setTaxDetails}
                      Width={Width}
                      getContractStages={getContractStages}
                      _fetchPaymentConditions={_fetchPaymentConditions}
                      checked={contractDetail?.isAgreementFull}
                    />
                  </Card>
                  <div className="d-flex justify-content-end pb-3 pt-3">
                  {paymentDetails?.milestoneList?.map((item: any, index: number) => {
                    if (
                      item?.paymentStatus === "COMPLETED" &&
                      userType === "USER" &&
                      paymentDetails?.isDispute === false &&
                      item?.transactionStatus !== "RELEASED"  &&
                      item?.isActive === true 
                    ) {
                      return (
                        <>
                        {/* {paymentDetails?.disputeDetails?.isGenerated ? null : (
                          <Button
                            type="primary"
                            className="mx-2 modal-button-cancel w-auto"
                            onClick={() => {raiseDispute()}}
                          >Raise Dispute</Button>
                        )} */}
                        {(!paymentDetails?.disputeDetails?.isGenerated &&
                          ((paymentDetails.contractStatus !== "-1" && milestone?.transactionStatus !== "RELEASED") && milestone?.isCompliance !== false)) && (
                          <Button
                            type="primary"
                            className="mx-2 modal-button-cancel w-auto"
                            onClick={() => { raiseDispute(); }}
                          >
                            Raise Dispute
                          </Button>
                        )}
                        
                      </>
                    );
                  }
                    if ( item?.paymentStatus === "COMPLETED" &&
                      userType === "USER" &&
                      paymentDetails?.isDispute === true && paymentDetails?.disputeDetails?.disputeStatus === null &&
                      index === 0
                      ) {
                        return (
                          <>
                            <p
                              children="Escrow Transaction Disputed"
                              className=" mb-0"
                              style={{ fontSize: "20px", color: "#ff6600" }}
                            />
                          </>
                        );
                      }
                      else if(item?.paymentStatus === "COMPLETED" &&
                        userType === "USER" &&
                        paymentDetails?.isDispute === true && paymentDetails?.disputeDetails?.disputeStatus === "COMPLETED REFUNDED" &&
                        index === 0){
                          return (
                            <>
                              <p
                                children="Complete refund generated"
                                className=" mb-0"
                                style={{ fontSize: "20px", color: "#ff6600" }}
                              />
                            </>
                          );
                        }
                        else if(item?.paymentStatus === "COMPLETED" &&
                          userType === "USER" &&
                          paymentDetails?.isDispute === true && paymentDetails?.disputeDetails?.disputeStatus === "PARTIAL REFUNDED" &&
                          index === 0){
                            return (
                              <>
                                <p
                                  children="Partial refund generated"
                                  className=" mb-0"
                                  style={{ fontSize: "20px", color: "#ff6600" }}
                                />
                              </>
                            );
                          }
                    })}
                    </div>
                </Col> : ""}
              </Row>
              </DefaultLayout>
      <Modal
        open={fundAddedSuccessModal}
        onCancel={() => setFundAddedSuccessModal(!fundAddedSuccessModal)}
        footer={false}
        className="modal-box"
        width={410}
      >
        <div className="text-center p-3">
          <div className="mb-4">
            <Image src={SuccessFund} alt="" height={"80px"} preview={false} />
          </div>
          <AuthTitle
            children="Funds added successfully to contract"
            className="text-center"
          />
        </div>
      </Modal>
      <Modal
        open={fundAddedErrorModal}
        onCancel={() => setFundAddedErrorModal(!fundAddedErrorModal)}
        footer={false}
        className="modal-box"
        width={410}
      >
        <div className="text-center p-3">
          <div className="mb-4">
            <Image src={Reject} alt="" height={"80px"} preview={false} />
          </div>
          <AuthTitle
            children={fundAddedErrorModalMsg && fundAddedErrorModalMsg != "" ? fundAddedErrorModalMsg : 
                        "Unable to add funds to the contract.Please try again later"}
            className="text-center"
          />
        </div>
      </Modal>
      <Modal
        open={unBlockModal}
        onCancel={() => setUnBlockModal(!unBlockModal)}
        footer={false}
        className="modal-box text-center"
        width={410}
      >
        <div className="text-center p-3">
          <div className="mb-4">
            <Image src={SuccessFund} alt="" height={"80px"} preview={false} />
          </div>
          <AuthTitle
            children="Successfully unblocked adding funds to contract"
            className="mt-4"
          />
        </div>
      </Modal>
      <Modal
        open={unBlockFailureModal}
        onCancel={() => setUnBlockFailureModal(!unBlockFailureModal)}
        footer={false}
        className="modal-box"
        width={410}
      >
        <div className="text-center p-3">
          <div className="mb-4">
            <Image
              src={rejected}
              alt=""
              height={50}
              width={50}
              preview={false}
            />
          </div>
          <AuthTitle children="Couldn't unblock adding funds" />
        </div>
      </Modal>
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
              src={File}
              preview={false}
              alt="preview"
              className="max-h-460 my-3"
            />
        </div>
        <Button
          type="primary"
          className="docudownloadBtn"
          onClick={() => {
            downloadFile();
            // downloadFile(imageData.img_Url)
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
      <Modal
        className="text-center modals"
        width={410}
        centered
        open={releaseVisible}
        onOk={() => setReleaseVisible(false)}
        onCancel={() => setReleaseVisible(false)}
        footer={null}
        maskClosable={false}
      >
        {releaseStatusMsg === "SUCCESS" && (
          <>
            <Image
              className="mb-2"
              src={thank_you}
              preview={false}
              style={{ height: "100px", width: "100px", borderRadius: "50%" }}
            />
            <AuthTitle children="Congratulations!" />
            <NormalText
              children="This escrow transaction is marked as compliant successfully and Payment release is in Progress"
              className="my-3"
            />
          </>
        )}
        {releaseStatusMsg === "INITIATED" && (
          <>
            <Image
              className="mb-2"
              src={thank_you}
              preview={false}
              style={{ height: "100px", width: "100px", borderRadius: "50%" }}
            />
            <AuthTitle children="Thank you for choosing TrustIn" />
            <NormalText
              children={
              <>Payment {
                paymentDetails?.milestoneList.length > 1 ? 
                <> {moneyFormat(
                  paymentDetails?.currency,
                  Number(popupAmount)
                )}</>
                :
                <>{moneyFormat(
                  paymentDetails?.currency,
                  Number(invoiceCal?.buyerAmount)
                )}
                </>} will be released into {modifyCresetUserType(paymentDetails?.sellerAlias,'seller')}&#39;s account within 2-5 working days.
              </>}
              className="my-3"
            />
            <LinkButton
              children="Track payment status"
              className="modals-link"
            />
            {/* <Link to="/" className='Track-payment-link mx-2' > Track Payment status</Link> */}
          </>
        )}
        {releaseStatusMsg === "KYC_NOT_COMPLETED" && (
          <>
            <Image
              className="mb-2"
              src={Reject}
              preview={false}
              style={{ height: "56px", width: "56px", borderRadius: "50%" }}
            />
            <AuthTitle children="KYC Not Completed" />
            <NormalText children="Your payment can not be released because your KYC not verified" />
            <NormalText
              children="To complete KYC click the below button"
              className="mb-2 "
            />
            <div className="d-flex justify-content-center mt-4">
              <SecondaryOutLineButton
                children="Cancel"
                className=" me-3"
                onClick={handleVisible}
              />
              <MainButtonRound children=" KYC" onClick={kycModalView} />
            </div>
          </>
        )}
        {releaseStatusMsg === "NOT_COMPLIANT" && (
          <>
            {/* <CardHeadText children="Payment Release Conditions" /> */}
            <Image
              className="mb-2"
              src={Reject}
              preview={false}
              style={{ height: "56px", width: "56px", borderRadius: "50%" }}
            />
            <AuthTitle children="Release payment is pending" />
            {/* <NormalText children="Your payment can not be released because your agreement is not compliant" />
            <NormalText children="Fund added by you will be refunded in your bank account within 2-3 working days" /> */}
            <NormalText children="Release payment, " />
            <NormalText children="if all steps are fulfilled" />
            <LinkButton
              children="Cancel"
              onclick={handleVisible}
              className="modals-link m-3"
            />
          </>
        )}
        {releaseStatusMsg === "BANK_NOT_ADDED" && (
          <>
            <Image
              className="mb-2"
              src={Reject}
              preview={false}
              style={{ height: "56px", width: "56px", borderRadius: "50%" }}
            />
            <AuthTitle children="Bank Not Added" />
            <NormalText children="Please add a bank account to receive and release the payments" />
            <NormalText children="Bank not added" />
            <Button
              onClick={handleVisible}
              className="modals-link "
            >Cancel</Button>
          </>
        )}
        {releaseStatusMsg === "Bad Request" && (
          <>
            <Image
              className="mb-2"
              src={Reject}
              preview={false}
              style={{ height: "56px", width: "56px", borderRadius: "50%" }}
            />
            <AuthTitle children="Release payment pending" />
            <NormalText children="There was an error processing your release payment request. Please try after some time" />
            <Button
              onClick={handleVisible}
              className="modal-button-cancel mt-4"
            >Cancel</Button>
          </>
        )}
        {releaseStatusMsg === "INSUFFICIENT_FUNDS" && (
          <>
            <Image
              className="mb-2"
              src={Reject}
              preview={false}
              style={{ height: "56px", width: "56px", borderRadius: "50%" }}
            />
            <AuthTitle children="Insufficient funds" />
            <NormalText children={`Email sent successfully to ${modifyCresetUserType(paymentDetails?.buyerAlias,'buyer')} for add Funds remainder`} />
            <Button
              onClick={handleVisible}
              className="modals-link"
            >Cancel</Button>
          </>
        )}
        {releaseStatusMsg === "INITIATE_PAYMENT_PENDING" && (
          <>
            <Image
              className="mb-2"
              src={Reject}
              preview={false}
              style={{ height: "56px", width: "56px", borderRadius: "50%" }}
            />
            <AuthTitle children="Initiate payment pending" />
            <NormalText children={`Please check with ${modifyCresetUserType(paymentDetails?.buyerAlias,'buyer')} for payment initiation.`} />
            <Button
              onClick={handleVisible}
              className="modals-link"
            >Cancel</Button>
          </>
        )}
      </Modal>
      <Modal
        className="text-center modals"
        width={410}
        centered
        open={showTrusteeApproval}
        onOk={() => setShowTrusteeApproval(false)}
        onCancel={() => setShowTrusteeApproval(false)}
        footer={null}
        maskClosable={false}
      >
        <>
          <Image
            className="mb-2"
            src={Reject}
            preview={false}
            style={{ height: "56px", width: "56px", borderRadius: "50%" }}
          />
          <AuthTitle children="Authorizer approval pending" />
          <NormalText children="Payment initiated. Authorizer approval is in progress , we will inform you once escrow transaction approved" />
          {/* <NormalText children="Not approved by trustee" /> */}
          <LinkButton
            // children="Cancel"
            onclick={handleShowTrusteeApproval}
            className="modals-link"
          />
        </>
      </Modal>
      <Modal
        open={isVerifyModal}
        onCancel={() => {
          setIsVerifyModal(false);
        }}
        footer={false}
        title={
          <span
            className={
              modalHeader == "Approve contract"
                ? "change-client-classification"
                : "change-client-classification errMsg"
            }
          >
            {modalHeader}
            <hr className="lightgrayHr mb-3" />
          </span>
        }
        centered
        width={520}
        className="modal-box"
      >
        <Form scrollToFirstError onFinish={onVerifyFinish} form={form}>
          <p className="enter-text mb-4">Enter comment below</p>
          <Form.Item
            name="reasonComment"
            rules={[
              {
                required: true,
                message: "Please enter reason !",
              },
              {
                whitespace: true,
                message: "Invalid reason!",
              },
              {
                min: 20,
                message: "Please enter minimum 20 characters"
              }
            ]}
            className="modal_inputField"
          >
            <TextArea
              rows={4}
              placeholder="Write your reason here"
              className="modalTextArea mt-4 pt-2"
            />
          </Form.Item>
          <Row className="center_res">
            <div className="d-flex mt-5 mb-3">
              <Button className="rounded mt-0" htmlType="submit">
                Submit
              </Button>
              <Button
                className="rounded_cancel_btn mx-3 mt-0"
                onClick={() => {
                  setIsVerifyModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Row>
        </Form>
      </Modal>
      <Modal
        open={error.status}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={() => setErrorModal()}
        footer={false}
        className="text-center modal-box"
        width={410}
      >
        <Image
          className="mb-2"
          src={rejected}
          preview={false}
          style={{ height: "100px", width: "130px", borderRadius: "50%" }}
        />
        <AuthTitle children={"Warning"} />
        <BoldText style={{ color: "red" }} children={error.message} />
      </Modal>
      <Modal
        open={commonErrorModal}
        onCancel={() => setCommonErrorModal(!commonErrorModal)}
        footer={false}
        className="modal-box"
        width={410}
      >
        <div className="text-center p-3">
          <div className="mb-4">
            <Image src={WarningIcon} alt="" height={"80px"} preview={false} />
          </div>
          <AuthTitle
            children={commonErrorMessage}
            className="text-center"
          />
        </div>
      </Modal>
      <Modal
        open={messageVisible}
        onCancel={handleCancel}
        width={410}
        footer={false}
        className="modal-box"
      >
        <div className="text-center">
          <AuthTitle
            className=" mt-3 mb-0"
            children="Sit relax"
          />

          <NormalText className="message-para text-center"
            children="Our team will coordinate with you within 48-72 hours" />
        </div>
      </Modal>
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={520}
        className="modal-box"
      >
        <Form onFinish={onFinish} scrollToFirstError form={form} className="m-2 ">
          <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }}>
            <Col span={24} className="space-arr mb-5 mt-3">
              <InputText
                fieldname="disputeTypeAlias"
                className="mb-4 query_type"
                rules={[
                  {
                    required: true,
                    message: "Please add a type of item!",
                  },
                ]}
              >
                <Select className="selct-form-field" allowClear showSearch optionFilterProp="children" placeholder="Select query type">
                  {disputeList && disputeList.map((item: any) => {
                    return (
                      <Option key={item.aliasName}>{item.name}</Option>
                    );
                  })}
                </Select>
              </InputText>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <InputText
                fieldname="description"
                className="modal_inputField"
                rules={[
                  {
                    required: true,
                    message: "Please add a category!",
                  },
                  {
                    whitespace: true,
                    message: "Invalid description!",
                  },
                  {
                    min: 20,
                    message: "Please enter minimum 20 characters"
                  },
                  {
                    max: 300,
                    message: "Description cannot exceed 300 characters"
                  }
                ]}
              >
                <TextArea rows={4} placeholder="Please provide a detailed explanation of the dispute" className="modalTextArea  mt-2 p-2" />
              </InputText>
            </Col>
          </Row>
          <div className="ant-modal-footer modalFooter mt-5 gap-2 d-flex justify-content-end">
          <Button
              key="cancel"
              className="modal-button-cancel"
              onClick={()=>handleCancel()}
              style={{width:'140px'}}
            >
              Cancel
            </Button>
            <Button loading={loading} htmlType="submit" type="primary" className="modal-button">
              Save
            </Button>
          </div>

        </Form>
      </Modal>
      <Modal
        open={otpModal}
        onOk={() => setOtpModal(false)}
        onCancel={() => setOtpModal(false)}
        footer={false}
        width={520}
        className="modal-box"
      >
        <>
        <div className="text-center">
          <AuthTitle
            className=" mt-3 mb-0"
            children="OTP verification"
          />

          <NormalText className="formSubText mt-3 text-center"
            children={<>4 digits OTP has been sent on <span className="email">{fromParty?.email === UserEmail ? fromParty?.email : toParty?.email}</span></>} />
        </div>
        <Form
          className="mx-auto justify-content-center auth-form-width"
          scrollToFirstError
          onFinish={onFinishOtp}
        >
          {error.status && (
            <Alerts
              className="my-4 px-3"
              showIcon
              description={
                error.message || "Something went wrong. Please try again!"
              }
              type="error"
            />
          )}

          {success.status && (
            <Alerts
              className="my-4 px-3"
              showIcon
              description={success.message || "Success!"}
              type="success"
            />
          )}
          <OTPInput
            value={otp}
            onChange={setOTP}
            autoFocus
            OTPLength={4}
            otpType="number"
            className="otpfield mt-5 center"
            disabled={timer < 1 ? true : false}
          />
          <div className="errMsg mb-4">{otpError}</div>
          <div className="d-flex">
            <MainButtonRound
              loading={btnLoader}
              children="Verify"
              className="w-100 mb-2 signup-btn"
              htmlType="submit"
              disabled={timer < 1 || otp?.length < 4}
            />
          </div>
          <SmallText
            children={"Didn't received OTP?"}
            style={{ textAlign: "center", paddingTop: "10%" }}
          />
          <SmallText
            className="user-text otp-message orangeText"
            children={
              <>
                {timer ? (
                  <span>
                    {" "}
                    Resend OTP in <span>{timer}</span> seconds
                  </span>
                ) : (
                  <ViewButton
                    children="Resend"
                    disabled={timer}
                    onClick={() => resendOTP()}
                    loading={resendbtnLoader}
                  />
                )}
              </>
            }
            style={{ textAlign: "center" }}
          />
        </Form>
        </>
      </Modal>
      <UpdatePayoutAccountModal 
        visible={openUpdatePayoutAccountModal} 
        onCancel={() => setOpenUpdatePayoutAccountModal(false)} 
        onUpdate={onUpdatePayoutAccountSubmit} 
        bankAccountList={bankAccountList}
        payoutAccount={payoutAccount}
        loading={loading}
      />
    </div>
  );
};

export default TransactionDetails;


function formatTitleCase(str = "") {
  if (!str) return "";

  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

