import {
  AuthTitle,
  BoldText,
  CardHeadText,
  NormalText,
  SmallText,
} from "../ui-elements/TextRepo";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Upload,
  message,
  Select,
  notification,
  Card
} from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// @ts-ignore
import OTPInput from "otp-input-react";
import React, { useCallback, useEffect, useRef, useState } from "react"; 
import {
  approveDocument,
  complianceRejectReason,
  disputeResolved,
  markCompliance,
  remarkAdd,
  submitPartialRefundV2,
} from "../../services/admin";
import { fetchBankDetailsByUserAlias } from "../../services/user";
import Doc from "../../assets/img/grayDoc.svg";
import  DashboardImg from "../../assets/img/dashboard.svg";
import  reject from "../../assets/img/reject.svg";
import documentverified from "../../assets/modals/documentverified.gif";
import rejected from "../../assets/modals/rejected.gif";
import { DateWithUtcOffset, acceptedFileExtension, beforeUploadFile, getLocalStorage, moneyFormat, ordinalSuffixOf, toTitleCase } from "../Common/Constants";
import { CloudDownloadOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { AiOutlineEye } from "react-icons/ai";
import { DisputeManagementList, TransactionDetail } from "../Common/RouteConst";
import PendingStateComponent from "./PendingStateComponent";
import VerifyModal from '../Models/VerifyModel';
import Suitcase from "../../assets/img/sellerJob.svg";
import bankAcc from '../../assets/img/bankacc.svg';
import addUserIcon from "../../assets/img/userHalf.svg";
import { MainButtonRound, ViewButton } from "../ui-elements/ButtonRepo";
import Alerts from "../utilities/Alert";
import { generateContractOtp, verifyContractOtp } from "../../services/transaction";
import Title from "antd/es/typography/Title";

const { Panel } = Collapse;
const { TextArea } = Input;
const AdminReleaseCondition = (props: object|any):any => {
  // TODO: Check for non-compliance of transaction and show not compliant
  const {
    title, 
    contractDetail, 
    paymentData,
    _fetchPaymentConditions, 
    getPaymentDetails, 
    releaseModal, 
    setReleaseModal,
    releasePayment,
    inProgressPaymentRelease,
    payoutAccount
  } = props;
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);
  const [remarkModal, setRemarkModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [docName, setDocName] = useState("")
  const [isCompliant, setIsCompliant] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [resolveDisputeModal, setResolveDisputeModal] = useState(false);
  const [resolveModel, setResolveModel] = useState(false);
  const [remarkSuccessModal, setRemarkSuccessModal] = useState(false);
  const [numPages, setNumPages] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [generateRefundSuccessModal, setGenerateRefundSuccessModal] =
    useState(false);
  const [partialRefund, setpartialRefund] = useState(false);
  const { contractId } = useParams();
  const navigate = useNavigate();
  const authData = JSON.parse(getLocalStorage("auth")!);
  const userData = authData;
  const userAlias = authData?.userAlias;
  const userType = authData?.userType;
  const [isFile, setFileName] = useState();
  const [form] = Form.useForm();
  const [refundDisputed, setRefundDisputed] = useState(false);
  const [buyerBankDetails, setBuyerBankDetails] = useState([]);
  const [bankDetails, setBankDetails] = useState<any>([]);
  const [sellerBankDetails, setSellerBankDetails] =useState<any>([]);
  const [generateRefundFailureModal,setGenerateRefundFailureModal] = useState(false);
  const [sellerRefundModal,setSellerRefundModal] = useState(false);
  const [yesBtnLoading, setYesbtnLoading] = useState(false);
  // const [modalHeader, setModalHeader] = useState("");
  const [contractRejectModal, setIsContractRejectModal] = useState<boolean>(false);
  const [charges,setCharges] = useState({
    platformFees: "",
    vatCharges: "",
    buyerTransactionFee: "",
    sellerTransactionFee: "",

  })
  
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [approvedModal, setApprovedModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [onholdModal, setOnholdModal] = useState(false);
  const [buttonRequired, setButtonRequired] = useState('');
  const [imageData, setimageData] = useState({});
  const [isverifyVisible, setverifyVisible] = useState(false);
  const [docForEmail, setDocForEmail] = useState('');
  const [isVerified,setIsVerified]= useState<boolean>(true)
  // const [showApproveReject, setShowApproveReject] = useState(false);
  const UserEmail = JSON.parse(getLocalStorage("auth")!)?.email;
  const [otpModal, setOtpModal] = useState<any>();
  const [error, setError] = useState<any>({ status: false, message: "" });
  const [success, setSuccess] = useState<any>({ status: false, message: "" });
  const [btnLoader, setBtnLoader] = useState<any>(false);
  const [resendbtnLoader, setResendBtnLoader] = useState<any>(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOTP]= useState<any>("");
  const [otpError, setOtpError] = useState("");
  const [btnStatus, setBtnStatus] = useState("");
  const [activeMilestoneData, setActiveMilestoneData] = useState<any>();
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, [])

  const handleVerify = (txnID: any, imgUrl: any, key: any, imageId: any, docName: any) => {
    setLoading(true);
    const obj = {
      id: imageId,
      txn_ID: txnID,
      img_Url: imgUrl,
      key_d: key
    };
    setimageData(obj);
    setverifyVisible(true);
    setDocForEmail(docName)
    setButtonRequired('');
    setLoading(false);
  };

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
  
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const [triggerEvent, setTriggerEvent] = useState<boolean>(() => location.state?.triggerButton === true || location.state?.triggerButton === "true");
  
  useEffect(() => {
    if (triggerEvent) {
      const timeout = setTimeout(() => {
        if (buttonRef.current) {
          const event = new MouseEvent("click", { bubbles: true, cancelable: true });
          buttonRef.current.dispatchEvent(event);
        }
        setTriggerEvent(false);
        navigate(location.pathname, { replace: true });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [triggerEvent]);
          
  const { Option } = Select;

  const showModal = (url: any, name: any) => {
    setIsModalVisible(true);
    setDocUrl(url);
    setDocName(name)
  };
  const downloadFile = (url: string | undefined) =>{
    const link = document.createElement("a");
    link.href =url ? url : docUrl;
    link.setAttribute("download", docName);
    document.body.appendChild(link);
    link.click();
  }

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
  });
  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };
  useEffect(() => {
    if(paymentData?.milestoneList) {
      const _isCompliance = paymentData?.milestoneList?.filter(
        (item: { transactionStatus: string; }) => item.transactionStatus === "ACTIVE"
      )?.[0]?.isCompliance;
      setIsCompliant(_isCompliance);
      const platformFee = (((Number(paymentData?.invoiceAmount) * Number(paymentData?.platformCharge)) / 100)).toFixed(2);
      const vatCharge = (((((Number(paymentData?.invoiceAmount) * Number(paymentData?.platformCharge)) / 100) * Number(paymentData?.vatCharges)) / 100)).toFixed(2);
      setCharges({
        platformFees: platformFee,
        vatCharges: vatCharge,
        buyerTransactionFee: (((Number(platformFee) + Number(vatCharge)) * Number(paymentData?.buyerPercent)) / 100).toFixed(2),
        sellerTransactionFee: (((Number(platformFee) + Number(vatCharge)) * Number(paymentData?.sellerPercent)) / 100).toFixed(2)
      })
      // let totalCharge = ((Number((paymentData?.invoiceAmount * Number(paymentData?.platformCharge)) / 100) +
      //   Number((((paymentData?.invoiceAmount * Number(paymentData?.platformCharge)) / 100) * Number(paymentData?.vatCharges)) / 100)) + Number(paymentData?.invoiceAmount)).toFixed(2);
      const activeMilestone = paymentData?.milestoneList?.filter((item: any) => item?.isActive === true);

      // let verifiedDoc = [];
      // let verifiedDocCount = 0;
      // let totalDocCount = 0;
      setActiveMilestoneData(activeMilestone?.[0]);
      // activeMilestone?.[0]?.documentList?.map((outerItem: any) => {
        // totalDocCount++;
        // verifiedDoc = paymentData?.filelist?.filter((innerItem: any) =>
        //   (outerItem.aliasName === innerItem.inputfileid && innerItem.verified === "VERIFIED" && ['AUTHORIZER','SENIOR_MANAGEMENT'].includes(innerItem.verifyRole)))?.[0];
        // if (verifiedDoc) {
        //   verifiedDocCount++;
        // }
      // });
      // if (verifiedDocCount === totalDocCount && verifiedDocCount !== 0 && totalDocCount !== 0 && activeMilestone?.[0]?.approveStatus !== '1') {
      //   setShowApproveReject(true);
      // }
      // if (paymentData?.contractStatus === "1" || paymentData?.contractStatus === "-1") {
      //   setShowApproveReject(false);
      // }
    }
  }, [paymentData]);

  const onFinish = (values: { isCompliant: any; }) => {
    setLoading(true);    
    // let activeTransaction = paymentData?.milestoneList?.filter(
    //   (item: { transactionStatus: string; }) => item.transactionStatus === "ACTIVE"
    // )?.[0];
  
    // if(activeTransaction?.releaseStatus == 1) {
      if (values.isCompliant) {
        markCompliance({
          isCompliance: values.isCompliant,
          txnAlias: paymentData?.milestoneList?.filter(
            (item: { transactionStatus: string; }) => item.transactionStatus === "ACTIVE"
          )?.[0]?.aliasName,
          complianceBy: userData?.userAlias,
        })
        .then(() => {
          setIsCompliant(true);
          setReleaseModal(true);
        })
        .catch((error) => {
          setLoading(false);
          if (error?.data?.message) {
            openNotification(error.data.message);
          } else if (error?.data) {
            // let errorMsg: any = Object.values(error?.data)[0].message;
            const errorMsg: any = error?.data[0].message;
            openNotification(errorMsg);
          } else if (error?.error) {
            openNotification(error.error);
          } else {
            openNotification("Internal server error");
          }
        });
      } else {
        setShowRejectModal(true);
        setLoading(false);
      }
    // } else {
    //   setInitiatePaymentModel(true);
    //   setLoading(false);
    // }
  };

  const handleApprove = () => {
    setShowReasonModal(true);
    setShowRejectModal(false);
  };

  const generateRefund = () => {
    setLoading(true);
    const formData: any = new FormData();
    const formValue = form.getFieldsValue();
    formData.append("contractId", contractId);
    formData.append("refundReason", formValue.reason);
    formData.append("refundPercentage", 100);
    formData.append("buyerAmount", formValue.buyerBank ? paymentData?.invoiceAmount : 0);
    formData.append("sellerAmount", formValue.sellerBank ? paymentData?.invoiceAmount : 0);
    formData.append(
      "scheduledDate",
      DateWithUtcOffset(formValue.scheduledDate)
    );
    formData.append("isMilestone", paymentData?.isMilestone);
    formData.append("totalInvoiceAmount", paymentData?.invoiceAmount);
    formData.append("file", isFile);
    formData.append("buyerBankAlias", formValue?.buyerBank);
    formData.append("sellerBankAlias", formValue?.sellerBank);
    formData.append("currency", paymentData?.currency)
    submitPartialRefundV2(formData)
      .then((response: any) => {
        if ([200,201].includes(response?.status)) {
          setLoading(false);
          form.setFieldsValue({ scheduledDate: null });
          setGenerateRefundSuccessModal(true);
          setTimeout(() => {
            navigate(TransactionDetail + contractId);
          }, 3000);
        }
      })
      .catch((error) => {
        setLoading(false);
        setGenerateRefundFailureModal(true)
        console.log("Error!", error);
      });
  };
  // const uploadButton4 = (
  //   <div className="dispute-upload text-center p-2">
  //       <div className="d-flex mt-3">
  //         <Image
  //           src={Tick}
  //           alt="circle"
  //           className="tick_upload w-100"
  //           preview={false}
  //         />
  //       </div>
  //     <div>
  //       <Image src={UploadFile} alt="passport" preview={false} />
  //       <div className="mt-3 subText_xs overflowText_twoLines w-upload">
  //         Click here upload
  //       </div>
  //     </div>
  //   </div>
  // );
  const resolveDispute = (values: { resolveReason: string | Blob; }) => {
    setLoading(true);
    const formData: any = new FormData();
    formData.append("contractId", contractId);
    formData.append("resolveReason", values?.resolveReason);
    formData.append("file", isFile);
    disputeResolved(formData)
      .then((response) => {
        setLoading(false);
        if ([200,201].includes(response?.status)) {
          setResolveDisputeModal(true);
          setTimeout(() => {
            navigate(TransactionDetail + contractId);
          }, 3000);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error!", error);
      });
  };
  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };
  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };
  const addRemark = (values: { name: any; }) => {
    setLoading(true);
    const reqBody = {
      contractId: contractId,
      txnAlias: paymentData?.milestoneList?.filter(
        (item: { transactionStatus: string; }) => item.transactionStatus === "ACTIVE"
      )?.[0]?.aliasName,
      name: values.name,
    };
    remarkAdd(reqBody)
      .then((response) => {
        if ([200,201].includes(response?.status)) {
          setLoading(false);
          form.setFieldsValue({ name: null });
          setRemarkSuccessModal(true);
          setTimeout(() => {
            navigate(TransactionDetail + contractId);
          }, 3000);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error!", error);
      });
  };
  const submitReason = (values: { rejectReason: any; }) => {
    complianceRejectReason({
      txnAliasName:
        paymentData?.milestoneList[0]?.documentList[0]?.transactionAlias,
      reason: values?.rejectReason,
      userAlias: userData?.userAlias,
      agreementId: contractDetail?.agreementId,
      contractId: contractId,
    })
      .then(() => {
        setIsCompliant(false);
        setTimeout(() => {     
          window?.location?.reload();
          // navigate(TransactionDetail + '/' + contractId);
        }, 2000);
      })
      .catch((error) => {
        console.log("error", error);
      }).finally(() => {

        setLoading(false);
        setShowReasonModal(false);
        setShowRejectSuccess(true);
      });
  };

  useEffect(()=> {
    getPartialDispute();
  },[paymentData])
  
  const getPartialDispute = async () => {
    setLoading(true);
    if(paymentData?.buyerAlias) {
      const buyerAlias = {
        id: String(paymentData?.buyerAlias)
      }
      await fetchBankDetailsByUserAlias(buyerAlias)
        .then((response) => {
          setLoading(false);
          if ([200,201].includes(response?.status)) {
            setBuyerBankDetails(response?.data?.bankDetails);
            form.setFieldsValue({ buyerName: response?.data?.bankDetails?.[0]?.name });
          }
        }).catch(() => {
          setLoading(false);
          openNotification("BANK DETAILS NOT FOUND")
        })
      const sellerAlias = {
        id: String(paymentData?.sellerAlias)
      }
      await fetchBankDetailsByUserAlias(sellerAlias)
        .then((response) => {
          setLoading(false);
          if ([200,201].includes(response?.status)) {
            const bankList = response?.data?.bankDetails || [];
            const primaryAccount = bankList.find((acc: { isPrimary: any; }) => acc.isPrimary) || bankList[0];
            if(primaryAccount){
              setSellerBankDetails(primaryAccount);
              form.setFieldsValue({ sellerName: primaryAccount?.name });
            }
          }
        }).catch(() => {
          setLoading(false);
          openNotification("BANK DETAILS NOT FOUND")
        })
    }
  };

  const onFinishRefund = () => {
    setLoading(true);
    const formData: any = new FormData();
    const formValue = form.getFieldsValue();
    formData.append("contractId", contractId);
    formData.append("refundReason", formValue.reason);
    formData.append("refundPercentage", formValue.amountPercent);
    formData.append("buyerAmount", formValue.amount);
    formData.append("sellerAmount", formValue.sellerAmount);
    formData.append(
      "scheduledDate",
      DateWithUtcOffset(formValue.scheduledDate)
    );
    formData.append("isMilestone", paymentData?.isMilestone);
    formData.append("totalInvoiceAmount", paymentData?.invoiceAmount);
    formData.append("file", isFile);
    formData.append("buyerBankAlias", formValue.selectedBuyerBank);
    formData.append("sellerBankAlias", formValue.selectedSellerBank);
    formData.append("currency", paymentData?.currency)

    submitPartialRefundV2(formData)
      .then((response: any) => {
        setLoading(false);
        if ([200,201].includes(response?.status)) {
          setTimeout(() => {
            navigate(DisputeManagementList);
          }, 3000);
        }
        setGenerateRefundSuccessModal(true);
      })
      .catch((error: any) => {
        setLoading(false);
        setGenerateRefundFailureModal(true);
        console.log("Error!", error);
      });
  };

  const changeAmountValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = e.target.value.replace(/[^0-9.]/gi, "");
    form.setFieldsValue({ amountPercent: percent });
    const invoice = paymentData?.invoiceAmount
    const index = (invoice * Number(percent)) / 100;
    const buyerAmount = index.toFixed(2);
    const buyerAmountWithFee = (index + Number(charges.buyerTransactionFee)).toFixed(2);
    form.setFieldsValue({
      amount: buyerAmount,
      amountWithFee: buyerAmountWithFee
    });
    const sellerAmount = invoice - index;
    form.setFieldsValue({
      sellerAmount: sellerAmount.toFixed(2),
      sellerAmountwithFee: sellerAmount.toFixed(2)
    })
  };

  const changePercentValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = e.target.value.replace(/[^0-9.]/gi, "");
    form.setFieldsValue({ amount: percent });
    const index = ((Number(percent) / paymentData?.invoiceAmount) * 100).toFixed(2);
    form.setFieldsValue({
      amountPercent: index,
    });
  };

  const changeHandler = (e: { target: { files: string | any[]; }; }) => {
    if (e.target.files.length > 0) {
      const files = e.target.files;
      if (e.target.files[0].size > 1e6) {
        message.error("Please upload the file less than 2mb!");
        form.resetFields(["file"]);
        return false;
      }
      else {
        setFileName(files[0]);
      }
      // setFileName(files[0]);
    }
  };

  useEffect(() => {
    if(inProgressPaymentRelease === true) {
      setReleaseModal(true);
      setLoading(true);
    }
  },[inProgressPaymentRelease])

  const onReset = () => {
    form.resetFields();
  };

  const getBankDetails = async (userAlias: any) => {
    const bankAlias = {
      id: String(userAlias)
    }
    await fetchBankDetailsByUserAlias(bankAlias)
      .then((response) => {
        if ([200,201]?.includes(response?.status)) {
          setBankDetails(response?.data?.bankDetails);
          form.setFieldsValue({ name: response?.data?.bankDetails?.[0]?.name });
        }
      }).catch((err) => {
        console.log("buyer bank details ", err)
      })
  }

  const changePlatformStatus = (status: string, reason: string) => {
    setLoading(true);
    approveDocument({
      userAlias: userAlias,
      platformStatus: status,
      contractAlias: paymentData?.aliasName,
      transactionAlias: paymentData?.milestoneList?.filter((item: any) => item?.isActive === true)?.[0].aliasName,
      isMilestone: paymentData?.isMilestone,
      rejectedReason: reason ?? ""
    })
      .then(() => {
        setLoading(false)
        if (status === "1") {
          setApprovedModal(true);
        } else if (status === "2") {
          setRejectModal(true);
        } else if (status === "4") {
          setOnholdModal(true)
        }
        setTimeout(() => {
          // navigate(EscrowTransactionList);
          window?.location?.reload();
        }, 3000);
      })
      .catch((error: any) => {
        setLoading(false)
        console.log("Error: ", error);
        openNotification(`UNABLE TO ${status === '1'? "APPROVE" : "REJECT" } CONTRACT`)
      })
  };
  let advisorStatus = true;
  if (contractDetail.escrowAdvisorAlias 
    && ![contractDetail?.buyerAlias, contractDetail?.sellerAlias].includes(contractDetail?.escrowAdvisorAlias)) {
      if (contractDetail?.escrowAdvisorDetails?.userType !== 'ESCROW_ADVISOR' 
        || !contractDetail?.escrowAdvisorDetails?.ekycStatus) { //check if advisor has joined or not 
          advisorStatus = false;
      }
  }

  const generateOTP =  () => {
    if (!paymentData || !userAlias) {
      message.error("Required data is missing");
      setYesbtnLoading(false);
      return;
    }
    setLoading(true);
    generateContractOtp(paymentData,userAlias)
    .then(()=> {
      setLoading(false);
      setYesbtnLoading(false);
      setTimer(60);
      setOtpModal(true);

    })
    .catch(() =>{
      message.error("Error generating OTP. Please try again later");
      setYesbtnLoading(false);
    })
  }

  // const handleRejectModal = () => {
  //   setModalHeader("Reject contract");
  //   setIsContractRejectModal(true);
  // }

  const rejectContract =(values: any) => {
    const reason = values?.rejectReason ?? ""
    changePlatformStatus('2', reason);
  }

  const relasePay = () => {
    setYesbtnLoading(true);
    setOTP("");
    generateOTP();
    setBtnStatus("releasepayment");
  }

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
    const timeoutId = timer > 0 ? setTimeout(timeOutCallback, 1000) : undefined;
    if (timer == 0) {
      setSuccess({ status: false, message: "" });
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timer, timeOutCallback]);

  const resendOTP = () => {
    setResendBtnLoader(true);
    if (timer === 0) {
      generateContractOtp(paymentData,userAlias)
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
    setBtnLoader(true);
    verifyContractOtp({...state, aliasName: paymentData?.aliasName, otp})
    .then(async (response: any) => {
        setBtnLoader(false);
      if ([201, 200].includes(response.status)) {
        setOtpModal(false)
        if(btnStatus === "releasepayment") {
          releasePayment();
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

  const validatePopupCommentFields = (value: string, maxCommentLength: number) => {
    if (!value || value.trim() === "") {
      return Promise.reject(new Error("Please enter reason !"));
    }
    const allowedChars = /^[a-zA-Z0-9\s,\/#?\-\.]*$/;
    if (!allowedChars.test(value)) {
      return Promise.reject(
        new Error("Only letters, numbers, spaces, and , - ? # / . are allowed")
      );
    }
    if (value.trim().length < 20) {
      return Promise.reject(new Error("Please enter minimum 20 characters"));
    }
    if (value.trim().length > maxCommentLength) {
      return Promise.reject(
        new Error(`Maximum characters allowed: ${maxCommentLength}`)
      );
    }
    return Promise.resolve();
  }

  return (
    <>
      <div className="stepDetails mt-3 release-payment-text">{title}</div>
      {paymentData?.isMilestone ? (
        // In case of milestone
        <Collapse defaultActiveKey={paymentData?.milestoneList?.map((item: any) => item.isActive).indexOf(true)} expandIconPosition={"right"} ghost className="mt-4">
          {paymentData?.milestoneList?.map((data: any, index: number) => {
            return (
              <Panel
                header={`${ordinalSuffixOf(index + 1)} Milestone - ${data.name
                  }`}
                key={index}
                className="border-bottom payment-condition"
              >
                {data?.documentList?.map((data2: { name: any; aliasName: any; }, index: React.Key | null | undefined) => {
                  return (
                    <div className="milestone-docs d-flex justify-content-between align-items-center w-100 position-relative mb-2 responsive-items" key={index}>
                      <span className="d-flex align-items-center w-auto">
                        <Image src={Doc} alt="Document" preview={false} className="text-muted fs-20x file-img"/>
                        <div className="mx-3" style={{maxWidth:"870px", minWidth:"100px"}}>
                            <div className="stepDetails_medium_sub">
                                {toTitleCase(data2?.name)}
                            </div>
                        </div>
                      </span>
                      {paymentData?.filelist.filter(
                        (val: { inputfileid: any; }) => val.inputfileid == data2.aliasName
                      ).length > 0
                        ? paymentData?.filelist.map((val: { inputfileid: any; url: any; verified:any}) => {
                          if (val.inputfileid === data2.aliasName) {
                            if (['AUTHORIZER','SENIOR_MANAGEMENT'].includes(userType) && val.verified) {
                              return (
                                <>
                                  <PendingStateComponent
                                    handleVerify={handleVerify}
                                    val={val}
                                    data2={data2}
                                    setButtonRequired={setButtonRequired}
                                    loading={loading}
                                  />                                  
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <div className="d-flex w-100 justify-content-end">
                                    <Button
                                        className="rounded mt-0"
                                        htmlType="submit"
                                        onClick={() => { showModal(val.url, data2?.name); }}
                                        > View
                                    </Button>
                                  </div>
                                </>
                              );
                            }
                          }
                        })
                        : null}
                    </div>
                  );
                })}
                {/* {
                  showApproveReject && data.transactionStatus === "ACTIVE" && <div className=''>
                    <Divider />
                    <Form>
                      <div className="d-inline-flex justify-content-center w-100">
                        <Button className="modal-button mx-2" onClick={() => changePlatformStatus('1','')} loading={loading}>Approve</Button>
                        <Button className=" modal-button-cancel mx-2" onClick={() => handleRejectModal()} loading={loading}>Reject</Button>
                      </div>
                    </Form>
                  </div>
                } */}
                {!isCompliant 
                  && data.transactionStatus === "ACTIVE" 
                  && data.trusteeApproveStatus === "1" 
                  && data.approveStatus === '1' 
                  && advisorStatus ?
                  (data.releaseStatus === null ? 
                    (paymentData?.isAgreementFull ? (
                      <>
                        {/* <Divider />
                        <div className="text-center mb-2">
                          <Button
                            type="primary"
                            className="mx-2 modal-button initiate-payment"
                            onClick={() => releasePayment()}
                            loading={loading}
                          >
                            Initiate Payment
                          </Button>
                        </div> */}
                        {releasePayment()}
                      </>
                    ) : null) : (
                      <>
                        <Divider />
                        {paymentData?.isDispute ? null : (
                          <>
                            {(paymentData?.disputeDetails?.isGenerated &&
                              paymentData?.contractStatus === "8") ||
                              paymentData.contractStatus === "6" ? null : (
                              <Form
                                scrollToFirstError
                                onFinish={onFinish}
                                form={form}
                              >
                                <NormalText
                                  children={"Is this escrow transaction compliant?"}
                                ></NormalText>
                                <Form.Item name="isCompliant">
                                  <Radio.Group name="radiogroup">
                                    <Radio value={true}>Yes</Radio>
                                    <Radio value={false}>No</Radio>
                                  </Radio.Group>
                                </Form.Item>
                                <div style={{ textAlign: "center" }}>
                                  <Button
                                    htmlType={"submit"}
                                    loading={loading}
                                    className="modal-button"
                                  >
                                    Submit
                                  </Button>
                                </div>
                              </Form>
                            )}
                          </>
                        )}
                      </>
                    )
                  )
                  : null
                }
                {paymentData?.isDispute ? null : (
                      <>
                        {paymentData?.contractStatus !== "5" && data?.isCompliance && data?.paymentReleaseTransferStatus !== "IN_PROGRESS" &&  data?.transactionStatus === "ACTIVE" && inProgressPaymentRelease === false &&
                  <>
                  <Divider />
                    <div className="text-center ">
                      <Button
                        ref={buttonRef}
                        className={`modal-button w-auto ${inProgressPaymentRelease ? "disabled" : ''}`}
                        onClick={() => { setReleaseModal(true); } }
                        disabled= {inProgressPaymentRelease}
                      >
                        Release Payment
                      </Button>
                    </div>
                  </>
                }
                {
                  paymentData?.contractStatus !== "5" && data?.isCompliance && data?.paymentReleaseTransferStatus === "IN_PROGRESS" &&  data?.transactionStatus === "ACTIVE" && inProgressPaymentRelease === false ?
                  <>
                    <Title level={5} className="release-pay-progress">Payment release in Progress...</Title>
                  </>
                  : null
                }
                </> )}
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        // In case of no milestone
        <>
            {paymentData?.milestoneList?.map((data: { documentList: any[]; }) => {
              return data?.documentList?.map((data2: { name: any; aliasName: any; }, index: React.Key | null | undefined) => {
                return (
                  <div
                    className="d-inline-flex milestone-docs align-items-center w-100 position-relative endtoend mb-2 mt-3"
                    key={index}
                  >
                    <span className="d-flex align-items-center w-auto">
                      <Image src={Doc} alt="Document" preview={false} className="text-muted fs-20x file-img" />
                      <div className="mx-3" style={{maxWidth:"870px", minWidth:"100px"}}>
                        <div className="stepDetails_medium_sub docName-wrap">
                            {toTitleCase(data2?.name)}
                        </div>
                      </div>
                    </span>
                    {paymentData?.filelist.filter(
                      (val: { inputfileid: any; }) => val.inputfileid == data2.aliasName
                    ).length > 0
                      ? paymentData?.filelist.map((val: { inputfileid: any; url: any; verified:any}) => {
                        
                        if (val.inputfileid === data2.aliasName) {
                          if (['AUTHORIZER','SENIOR_MANAGEMENT'].includes(userType) && val.verified) {
                            return (
                              <>
                                <PendingStateComponent
                                  handleVerify={handleVerify}
                                  val={val}
                                  data2={data2}
                                  setButtonRequired={setButtonRequired}
                                  loading={loading}
                                />                                  
                              </>
                            );
                          } else {
                            return (
                              <>
                                <Button
                                className={Width > 550 ? "modal-button mt-0" :"modal-button mt-3 mx-auto"}
                                htmlType="submit"
                                onClick={() => { showModal(val.url, data2?.name); }}>
                                  View
                                </Button>
                              </>
                            );
                          }
                        }
                      })
                      : null}
                  </div>
                );
              });
            })}
            {/* {
              showApproveReject && !paymentData?.isMilestone && <div className=''>
                <hr className="lightgrayHr" />
                <Form>
                  <div className="d-inline-flex justify-content-center w-100">
                    <Button className="rounded mt-0 mb-1" onClick={() => changePlatformStatus('1','')}>Approve</Button>
                    <Button className="rounded_cancel_btn mx-2 mt-0 mb-1" onClick={() => handleRejectModal()}>Reject</Button>
                  </div>
                </Form>
              </div>
            } */}
            {typeof isCompliant !== 'boolean' && paymentData?.contractStatus !== "-1" && advisorStatus && (
              <>
                <Divider />
                {paymentData?.isDispute ? null : (
                  <>
                    {(paymentData?.disputeDetails?.isGenerated &&
                      paymentData?.contractStatus === "8") ||
                      [-2,-1,5,6].includes(Number(paymentData?.contractStatus))||
                      paymentData?.isExpired === true ? null : paymentData
                        ?.milestoneList?.[0]?.isCompliance === null &&
                        paymentData?.milestoneList?.[0]?.transactionStatus ===
                        "ACTIVE" && paymentData?.milestoneList?.[0]?.approveStatus === "1" && paymentData?.milestoneList?.[0]?.trusteeApproveStatus === "1" ? 
                        paymentData?.milestoneList?.[0]?.releaseStatus === null ? paymentData?.isAgreementFull ? (
                          // <div className="text-center mb-2">
                          //   <Button
                          //     type="primary"
                          //     className="mx-2 modal-button initiate-payment"
                          //     onClick={() => releasePayment()}
                          //     loading={loading}
                          //   >
                          //     Initiate Payment
                          //   </Button>
                          // </div>
                          releasePayment()
                        ) : null : (
                          <Form onFinish={onFinish} scrollToFirstError form={form}>
                            <NormalText
                              children={"Is this escrow transaction compliant?"}
                            ></NormalText>
                            <Form.Item name="isCompliant">
                              <Radio.Group name="radiogroup">
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                              </Radio.Group>
                            </Form.Item>
                            <div style={{ textAlign: "center" }}>
                              <Button
                                htmlType={"submit"}
                                loading={loading}
                                className="modal-button mb-2"
                              >
                                Submit
                              </Button>
                            </div>
                          </Form>
                        ): null}
                  </>
                )}
              </>
            )}
            {isCompliant && paymentData?.contractStatus !== "-1" && (
              <>
                <Divider />
                {paymentData?.isDispute && inProgressPaymentRelease === false   ? null : (
                  <>
                    {[-2,-1,5,6,8].includes(Number(paymentData?.contractStatus)) ||
                      paymentData?.isExpired === true  ? null :
                      paymentData?.milestoneList?.[0]?.transactionStatus === "INACTIVE" || paymentData?.milestoneList?.[0]?.paymentReleaseTransferStatus === "IN_PROGRESS" ? null :
                      (paymentData?.milestoneList?.[0]?.trusteeApproveStatus === null || paymentData?.milestoneList?.[0]?.trusteeApproveStatus === '0') ? null : (
                          <div className="text-center mb-2">
                            <Button
                              ref={buttonRef}
                              className="modal-button w-auto"
                              onClick={() => { setReleaseModal(true); } }
                            >
                              Release Payment
                            </Button>
                          </div>
                        )}
                  </>
                )}
              </>
            )}
            {
              isCompliant && paymentData?.contractStatus !== "-1" && paymentData?.milestoneList?.[0]?.paymentReleaseTransferStatus === "IN_PROGRESS" ?
              <>
                <Title level={4} className="release-pay-progress">Payment release in Progress...</Title>
              </>
              : null
            }
        </>
      )}
      {
        <div>
          {paymentData?.contractStatus === "-1" && paymentData?.rejecteReason && (
            <>
              <BoldText children="Rejected reason: " />
              <SmallText
                children={`${paymentData?.rejecteReason}`}
                className="mt-1 info-text"
              />
            </>
          )}
        </div>
      }

      {paymentData?.isDispute && (
        <>
          <div className="stepDetails mt-3">Dispute resolution</div>
          <Row gutter={{ md: 36, sm: 16, xs: 16 }} className="admin-release mt-2">
            <Col md={12} sm={12} xs={24}>
              <NormalText children="Dispute initiated by" className="" />
              <SmallText
                children={` ${paymentData?.disputeDetails?.initiatedBy}`}
                className="info-text"
                style={{ color: "#687173", marginBottom: "5px" }}
              />
              <NormalText
                children={paymentData?.disputeDetails?.initiatedByName}
                className=" fw-5 mb-1"
              />
              <NormalText
                children={paymentData?.disputeDetails?.initiatedByEmail}
                className="info-text mb-1"
              />
            </Col>
            <Col md={12} sm={12} xs={24}>
              <NormalText children="Dispute reason" className="" />
              <SmallText
                children={paymentData?.disputeDetails?.type}
                className=" info-text mb-1 "
                style={{ color: "#ff6600" }}
              />
              <SmallText children="" className=" mb-1" />
              <NormalText children="Description" className="mb-1" />
              {paymentData?.disputeDetails?.description}
            </Col>

            <Col md={12} sm={12} xs={24} className='my-1'>
              <NormalText children="Refund % " className="" />
            </Col>

            <Col md={12} sm={12} xs={24} className='my-1'>
              <SmallText
                children={paymentData?.disputeDetails?.refundPercentage}
                className="info-text mb-1 "
                style={{ color: "#ff6600" }}
              />
            </Col>

            <Col md={12} sm={12} xs={24} className='my-1'>
              <NormalText children="Refund Amount" className="mb-1" />
            </Col>

            <Col md={12} sm={12} xs={24} className='my-1'>
              {paymentData?.disputeDetails?.refundAmount}
            </Col>

            <Col md={12} sm={12} xs={24} className='my-1'>
              <NormalText children="Refund Reason" className="mb-1" />
            </Col>

            <Col md={12} sm={12} xs={24} className='my-1'>
              {paymentData?.disputeDetails?.refundReason}
            </Col>
            <br/>

            <Col md={12} sm={12} xs={24} className='my-1'>
              <NormalText children="Attachment" className="" />
            </Col>

            <Col md={12} sm={12} xs={24} className='my-1'>
              {paymentData?.disputeDetails?.file &&  <Button className='blue-status eye px-3' onClick={()=>setRefundDisputed(true)}> <span className="eyeicon"><AiOutlineEye /></span>View</Button>  }
            </Col>
          </Row>
        </>
      )}

      {paymentData?.isContractVerify && paymentData.contractStatus == "-1" && false && (
        <>
          <Row gutter={{ md: 36, sm: 16, xs: 16 }} className="admin-release mt-2">
            <Col md={12} xs={24}>
              <BoldText children="Contract Rejected By" className="" />
              <NormalText
                children={paymentData?.verifyByName}
                className=" fw-5 mb-1"
              />
              <NormalText
                children={paymentData?.verifyByEmail}
                className="info-text mb-1"
              />
              <NormalText
                children={paymentData?.verifyDate}
                className="info-text mb-1"
              />
            </Col>

            <Col md={12} xs={24} className='my-1'>
              <BoldText children="Refund Amount" className="mb-1" />
              {paymentData?.invoiceAmount} 
            </Col>

            <Col md={12} xs={24} className='my-1'>
              <BoldText children="Refund Reason" className="mb-1" />
              {paymentData?.reasonComment}
            </Col>
            <br/>

            <Divider />
            <Col span={24} className="text-center mt-3">
              {paymentData?.releaseStatus ? undefined : (
                <>
                  <Button
                    children="Generate Refund"
                    onClick={() => {
                      setRefundModal(true);
                      getBankDetails(paymentData?.buyerAlias);
                    }}
                    className="dawnload-btn btn-sm  shadow-sm mt-4-res"
                  />
                </>
              )}
            </Col>
          </Row>
        </>
      )}     
      {
        !advisorStatus && (
          <>
            <Divider />
            <span style={{color: 'red'}}
              children={"NOTE: Payment would not be released until escrow advisor joins the platform"}
            ></span>
          </>
        )
      } 

      <Modal
        className="text-center modal-box"
        centered
        destroyOnClose={true}
        onCancel={() => setResolveModel(!resolveModel)}
        open={resolveModel}
        width={410}
        footer={false}
      >
        <AuthTitle
          children="Please enter reason for resolve dispute"
          className="modals mt-4 pb-1"
        />
        <Form scrollToFirstError onFinish={resolveDispute}>
          <Form.Item
            name="resolveReason"
            className="inputField"
            rules={[
              {
                whitespace: true,
                required: true,
                message: "Please enter reason for resolve",
              },
            ]}
          >
            <TextArea rows={3} placeholder="Enter reason/description" />
          </Form.Item>
          <Form.Item name='file' getValueFromEvent={changeHandler}
            rules={[
              {
                required: true,
                message: "Upload file",
              }

            ]}
            className="input-bg py-4"
          >
            <Upload
              beforeUpload={(file:any) => {
                const checkBeforeUpload = beforeUploadFile(file, "")
                return checkBeforeUpload;
              }}
               accept={acceptedFileExtension}
              maxCount={1}
              className="mb-4"
              listType="picture"
            >
              <Button icon={<UploadOutlined />} className="blue-status">Upload (File upto 5MB)</Button>
            </Upload>
          </Form.Item>
          <div className="ant-modal-footer modalFooter">
            <Button
              key="cancel"
              className="modal-button-cancel"
              onClick={() => {
                setResolveModel(false);
              }}
            >
              Cancel
            </Button>
            <Button key="submit" htmlType="submit" type="primary" className="modal-button" style={{height:"40px"}}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        className="text-center modal-box"
        centered
        open={partialRefund}
        onOk={() => setpartialRefund(false)}
        onCancel={() => setpartialRefund(false)}
        footer={false}
        width={550}
      >
        <AuthTitle children="Partial refund" className="mb-4" />
        <Form form={form} scrollToFirstError onFinish={onFinishRefund} >
          <Form.Item
          labelCol={{ span: 24 }}
          className="partial-inputField"
            name="reason"
            rules={[
              {
                required: true,
                message: "Please enter reason!",
              },
              {
                whitespace: true,
                message: "Invalid reason!",
              },
            ]}
          >
            <TextArea rows={2} placeholder="Enter reason/description" />
          </Form.Item>

          <Form.Item name='file' getValueFromEvent={changeHandler}
            rules={[
              {
                required: true,
                message: "Upload file",
              }
            ]}
            labelCol={{ span: 24 }}
            className="input-bg py-4 w-100"
          >
            <Upload
              beforeUpload={(file:any) => {
                const checkBeforeUpload = beforeUploadFile(file, "")
                return checkBeforeUpload;
              }}
               accept={acceptedFileExtension}
              maxCount={1}
              listType='picture'
            >
              <Button icon={<UploadOutlined />}>Click to Upload (File upto 2MB)</Button>
            </Upload>
          </Form.Item>
          <div className="d-flex justify-content-between my-2">
            <NormalText className="invoice_amount">
              Total agreement amount
            </NormalText>
            <NormalText className="invoice_amount">{paymentData?.currency} {paymentData?.invoiceAmount}</NormalText>
          </div>
          <div className="d-flex justify-content-between my-2">
            <NormalText className="invoice_amount">
              TrustIn fees ({paymentData?.platformCharge}%) + {paymentData?.vatCharges}% VAT
            </NormalText>
            <NormalText className="invoice_amount">{paymentData?.currency} {charges.platformFees} + {paymentData?.currency} {charges.vatCharges}</NormalText>
          </div>
          <div className="d-flex justify-content-between my-2">
            <NormalText className="invoice_amount">
              Buyer transaction fees
            </NormalText>
            <NormalText className="invoice_amount">{paymentData?.currency} {charges.buyerTransactionFee}</NormalText>
          </div>
          <div className="d-flex justify-content-between my-2">
            <NormalText className="invoice_amount">
              Seller transaction fees
            </NormalText>
            <NormalText className="invoice_amount">{paymentData?.currency} {charges.sellerTransactionFee}</NormalText>
          </div>
          <div className="justify-content-between">
            <Form.Item labelCol={{ span: 24 }}
              className="partial-inputField"
              name="buyerName"
              label="Buyer Name"
            >
              <Input autoComplete="off" type="text" placeholder="Buyer name" disabled></Input>
            </Form.Item>
          </div>
          <div className="justify-content-between">
            {/* <NormalText className="invoice_amount"></NormalText> */}
            <Form.Item
              labelCol={{ span: 24 }}
              className="partial-inputField"
              name="amountPercent"
              label="Buyer Percentage"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
                {
                  validator(_, value) {
                    if (parseFloat(value) === 0) {
                      return Promise.reject("Please enter valid percent!")
                    } else if (parseFloat(value) > 100) {
                      return Promise.reject("Percent exceeds 100%")
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input autoComplete="off"
                placeholder="Enter buyer percentage"
                maxLength={6}
                onChange={(e) => changeAmountValue(e)}
                onInput={(e: any) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(0, e.target.maxLength);
                }}
                type="number"
                suffix={"%"}

              />
            </Form.Item>
          </div>
          <div className="justify-content-between ">
            <Form.Item
             labelCol={{ span: 24 }}
             className="partial-inputField"
              name="amount"
              label="Buyer amount"
              rules={[
                {
                  required: true,
                  message: "Enter amount",
                },
                {
                  validator(_, value) {
                    if ((parseFloat(value) === 0) || (parseFloat(value) > paymentData?.invoiceAmount)) {
                      return Promise.reject("Amount must be greater than 0")
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input autoComplete="off"
                placeholder="Enter buyer amount"
                maxLength={10}
                onChange={(e) => changePercentValue(e)}
                onInput={(e: any) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(0, e.target.maxLength);
                }}
                type="number"
              />
            </Form.Item>
          </div>
          <div className="justify-content-between ">
            <Form.Item
              labelCol={{ span: 24 }}
              className="partial-inputField"
              name="amountWithFee"
              label="Buyer amount with fee"
              rules={[
                {
                  required: true,
                  message: "Enter amount",
                },
                {
                  validator(_, value) {
                    if ((parseFloat(value) === 0) || (parseFloat(value) > paymentData?.invoiceAmount)) {
                      return Promise.reject("Amount must be greater than 0")
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input autoComplete="off"
                placeholder="Amount with transaction fee"
                maxLength={10}
                onChange={(e) => changePercentValue(e)}
                onInput={(e: any) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(0, e.target.maxLength);
                }}
                type="number"
              />
            </Form.Item>
          </div>
          <div className="justify-content-between">
            <Form.Item
             labelCol={{ span: 24 }}
             className="partial-inputField"
              name="selectedBuyerBank"
              label="Buyer bank"
              rules={[
                {
                  required: true,
                  message: "Select Bank Account",
                },
              ]}
            >
              <Select showSearch placeholder="Select buyer bank account"
                allowClear
                optionFilterProp="children"
                >
                {buyerBankDetails?.length > 0 &&
                  buyerBankDetails.map((bank: any) => (
                    <Option key={bank?.aliasName} value={bank?.aliasName} label={bank?.aliasName}>{bank?.institutionName} - {bank?.number}</Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <div className="justify-content-between">
            <Form.Item
             labelCol={{ span: 24 }}
             className="partial-inputField"
              name="sellerName"
              label="Seller Name"
            >
              <Input autoComplete="off" type="text" placeholder="Seller Name" disabled></Input>
            </Form.Item>
          </div>
          <div className="justify-content-between ">
            <Form.Item
             labelCol={{ span: 24 }}
             className="partial-inputField"
              name="sellerAmount"
              label="Seller amount"
              rules={[
                {
                  required: true,
                  message: "Enter amount",
                },
                {
                  validator(_, value) {
                    if ((parseFloat(value) === 0) || (parseFloat(value) > paymentData?.invoiceAmount)) {
                      return Promise.reject("Amount must be greater than 0")
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input autoComplete="off"
                placeholder="Enter seller amount"
                maxLength={10}
                onChange={(e) => changePercentValue(e)}
                onInput={(e: any) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(0, e.target.maxLength);
                }}
                type="number"
                disabled
              />
            </Form.Item>
          </div>
          <div className="justify-content-between ">
            <Form.Item
             labelCol={{ span: 24 }}
             className="partial-inputField"
              name="sellerAmountwithFee"
              label="Seller amount with fee"
              rules={[
                {
                  required: true,
                  message: "Enter amount",
                },
                {
                  validator(_, value) {
                    if ((parseFloat(value) === 0) || (parseFloat(value) > paymentData?.invoiceAmount)) {
                      return Promise.reject("Amount must be greater than 0")
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input autoComplete="off"
                placeholder="Amount with transaction fee"
                maxLength={10}
                onChange={(e) => changePercentValue(e)}
                onInput={(e: any) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(0, e.target.maxLength);
                }}
                type="number"
                disabled
              />
            </Form.Item>
          </div>
          <Form.Item
            labelCol={{ span: 24 }}
            className="partial-inputField"
            name="selectedSellerBank"
            label="Seller bank"
            rules={[
              {
                required: true,
                message: "Select bank account",
              },
            ]}
          >
            <Select showSearch placeholder="Select seller bank account"
              allowClear
              optionFilterProp="children" >
              {sellerBankDetails.length > 0 &&
                sellerBankDetails.map((bank: any) => (
                  <Option key={bank?.aliasName} value={bank?.aliasName} label={bank?.aliasName}>{bank?.institutionName} - {bank?.number}</Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            name="scheduledDate"
            className="partial-inputField"
            rules={[
              {
                required: true,
                message: "Enter Schedule Date",
              },
            ]}
          >
            <DatePicker
              format={{
                format: 'DD-MM-YYYY',
                type: 'mask',
              }}
              disabledDate={(current: any) =>
                current.isBefore(moment().subtract(1, "day"))
              }
            />
          </Form.Item>
          <div className="ant-modal-footer modalFooter">
            <Button 
              key="cancel"
              className="modal-button-cancel"
              onClick={() => {
                setpartialRefund(false);
                onReset();
              }}
            >
              Cancel
            </Button>
            <Button key="submit" htmlType="submit" type="primary" loading={loading} className="modal-button" style={{height:"40px"}}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        className="modals"
        width={500}
        destroyOnClose={true}
        onCancel={() => setIsModalVisible(false)}
        open={isModalVisible}
        footer={false}
      >
        {docUrl?.split(".").pop() === "pdf" ? ( <>
          <Document
            file={docUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            externalLinkRel="_blank"
            className="w-100"
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <div className='text-center mt-3'>
            <Button children="Previous"  onClick={previousPage} className="modal-button w-45 me-3" />
            <Button children="Next" disabled={pageNumber >= numPages} onClick={nextPage} className="modal-button w-45" />
          </div>
      </>
        ) : (
          <Image preview={false} src={docUrl} className="modalImg"></Image>
        )}
        <Button
          className="float docudownloadBtn mt-2"
          onClick={() => downloadFile(docUrl)}
        >
          <CloudDownloadOutlined className="my-float downloadText" />
          <span className="downloadText">Download</span>
        </Button>
      </Modal>

      <Modal
        className="text-center modal-box"
        centered
        destroyOnClose={true}
        onCancel={() => setShowRejectModal(!showRejectModal)}
        open={showRejectModal}
        width={410}
        footer={false}
      >
        <AuthTitle children="Not Compliant ?" className="modals mt-4 mb-2" />
        <NormalText
          children="Are you sure you want to mark this escrow transaction as 'Not Compliant' ?"
        />
        <div className="">
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            className="modal-button mt-lg-5 mt-4"
            onClick={() => {
              handleApprove();
            }}
          >
            Yes
          </Button>
          <Button
            key="submit"
            type="primary"
            className="modal-button-cancel mt-lg-5 mx-2 mt-3"
            onClick={() => {
              setShowRejectModal(false)
            }}
          >
            No
          </Button>
        </div>
      </Modal>
      <Modal
        className="text-center modal-box modal_inputField"
        centered
        destroyOnClose={true}
        onCancel={() => setShowReasonModal(!showReasonModal)}
        open={showReasonModal}
        width={410}
        footer={false}
      >
        <AuthTitle
          children="Please enter reason for non-compliance"
          className="modals mt-4 pb-1"
        />
        <Form scrollToFirstError onFinish={submitReason}>
          <Form.Item
            name="rejectReason"
            rules={[
              {
                validator: (_, value) => validatePopupCommentFields(value, 500),
              },
            ]}
          >
            <TextArea rows={3} placeholder="Enter reason..." className="modalTextArea mt-4 pt-2" />
          </Form.Item>
          <div className="ant-modal-footer modalFooter center">
            <Button key="submit" htmlType="submit" type="primary" className="modal-button mt-5">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        className="text-center modal-box"
        centered
        destroyOnClose={true}
        onCancel={() => setShowSuccessModal(!showSuccessModal)}
        open={showSuccessModal}
        width={410}
        footer={false}
      >
        <AuthTitle
          children="Escrow transaction compliant!"
          className="modals  mt-4 pb-1"
        />
        <NormalText
          children="This escrow transaction is marked as compliant successfully"
        />
      </Modal>
      <Modal
        className="text-center modal-text"
        centered
        destroyOnClose={true}
        onCancel={() => setShowRejectSuccess(!showRejectSuccess)}
        open={showRejectSuccess}
        width={410}
        footer={false}
      >
        <AuthTitle
          children="This escrow transaction has been marked non-compliant!"
          className="modals mt-2 pb-1"
        />
      </Modal>

      <Modal
        className="modal-box text-center"
        centered
        destroyOnClose={true}
        onCancel={() => setRefundModal(!refundModal)}
        open={refundModal}
        width={410}
        footer={false}
      >
        <CardHeadText children="Please select a date to refund" />
        <Form form={form} scrollToFirstError onFinish={generateRefund}>
          <Form.Item
            name="reason"
            className="inputField"
            rules={[
              {
                required: true,
                message: "Please enter reason!",
              },
              {
                whitespace: true,
                message: "Invalid reason!",
              },
            ]}
          >
            <TextArea rows={2} placeholder="Enter reason/description" />
          </Form.Item>
          <Form.Item name='file' getValueFromEvent={changeHandler}
           className="input-bg py-4"
            rules={[
              {
                required: true,
                message: "Upload file",
              }
            ]}
          >
            <Upload
              beforeUpload={(file:any) => {
                const checkBeforeUpload = beforeUploadFile(file, "")
                return checkBeforeUpload;
              }}
               accept={acceptedFileExtension}
              maxCount={1}
              listType='picture'
            >
              <Button icon={<UploadOutlined />}>Click to Upload (File upto 2MB)</Button>
            </Upload>
          </Form.Item>
          <div className="justify-content-between">
            <Form.Item labelCol={{ span: 24 }}
              className="inputField"
              name="name"
              label="Buyer Name"
            >
              <Input autoComplete="off" type="text" placeholder="Buyer Name" disabled></Input>
            </Form.Item>
          </div>
          <div className="justify-content-between">
            <Form.Item
              labelCol={{ span: 24 }}
              className="inputField"
              name="buyerBank"
              label="Buyer Bank"
              rules={[
                {
                  required: true,
                  message: "Select Bank Account",
                },
              ]}
            >
              <Select showSearch placeholder="Select Buyer Bank Account"
                allowClear
                optionFilterProp="children"
                >
                {bankDetails?.length > 0 &&
                  bankDetails.map((bank: any) => (
                    <Option key={bank?.aliasName} value={bank?.aliasName} label={bank?.aliasName}>{bank?.institutionName} - {bank?.number}</Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            labelCol={{ span: 24 }}
            name="scheduledDate"
            rules={[
              {
                required: true,
                message: "Please select a date to generate refund",
              },
            ]}
          >
            <DatePicker
              format={{
                format: 'DD-MM-YYYY',
                type: 'mask',
              }}
              disabledDate={(current: any) =>
                current.isBefore(moment().subtract(1, "day"))
              }
            />
          </Form.Item>
          <div className="ant-modal-footer modalFooter">
            <Button
              key="cancel"
              className="modal-button-cancel"
              onClick={()=>{setRefundModal(false)}}
            >
              Cancel
            </Button>
            <Button loading={loading} key="submit" htmlType="submit" type="primary" className="modal-button" style={{height:"40px"}}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        className="text-center modal-box"
        centered
        destroyOnClose={true}
        onCancel={() => setSellerRefundModal(!sellerRefundModal)}
        open={sellerRefundModal}
        width={410}
        footer={false}
      >
        <CardHeadText children="Please select a date to refund" />
        <Form form={form} scrollToFirstError onFinish={generateRefund}>
          <Form.Item
          labelCol={{ span: 24 }}
          className="inputField"
            name="reason"
            rules={[
              {
                required: true,
                message: "Please enter reason!",
              },
              {
                whitespace: true,
                message: "Invalid reason!",
              },
            ]}
          >
            <TextArea rows={2} placeholder="Enter reason/description" />
          </Form.Item>
          <Form.Item name='file' getValueFromEvent={changeHandler}
            rules={[
              {
                required: true,
                message: "Upload file",
              }

            ]}
            className="input-bg py-4"
          >
            <Upload
              beforeUpload={(file:any) => {
                const checkBeforeUpload = beforeUploadFile(file,"")
                return checkBeforeUpload;
              }}
               accept={acceptedFileExtension}
              maxCount={1}


              listType='picture'
            >
              <Button icon={<UploadOutlined />}>Click to Upload (File upto 2MB)</Button>
            </Upload>
          </Form.Item>
          <div className="justify-content-between">
            <Form.Item labelCol={{ span: 24 }}
              className="inputField"
              name="name"
              label="Seller Name"
            >
              <Input autoComplete="off" type="text" placeholder="Seller Name" disabled></Input>
            </Form.Item>
          </div>
          <div className="justify-content-between">
            <Form.Item
            labelCol={{ span: 24 }}
              className="partial-inputField"
              name="sellerBank"
              label="Seller Bank"
              rules={[
                {
                  required: true,
                  message: "Select Bank Account",
                },
              ]}
            >
              <Select showSearch placeholder="Select Seller Bank Account"
                allowClear
                optionFilterProp="children"
                >
                {bankDetails?.length > 0 &&
                  bankDetails.map((bank: any) => (
                    <Option key={bank?.aliasName} value={bank?.aliasName} label={bank?.aliasName}>{bank?.institutionName} - {bank?.number}</Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            labelCol={{ span: 24 }}
            name="scheduledDate"
            rules={[
              {
                required: true,
                message: "Please select a date to generate refund",
              },
            ]}
          >
            <DatePicker
              format={{
                format: 'DD-MM-YYYY',
                type: 'mask',
              }}
              disabledDate={(current: any) =>
                current.isBefore(moment().subtract(1, "day"))
              }
            />
          </Form.Item>
          <div className="ant-modal-footer modalFooter">
            <Button
              key="cancel"
              className="modal-button-cancel"
              onClick={()=>setSellerRefundModal(false)}
            >
              Cancel
            </Button>
            <Button loading={loading} key="submit" htmlType="submit" type="primary" className="modal-button" style={{height:"40px"}}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={generateRefundSuccessModal}
        onCancel={() =>
          setGenerateRefundSuccessModal(!generateRefundSuccessModal)
        }
        footer={false}
        className="modal-box"
        width={410}
      >
        <div className="text-center">
          <Image
            src={documentverified}
            alt="nothing"
            preview={false}
            style={{
              height: "80px",
              width: "80px",
            }}
          />
          <AuthTitle
            children="Refund has generated successfully!"
          />
        </div>
      </Modal>

      <Modal
        open={generateRefundFailureModal}
        onCancel={() =>
          setGenerateRefundFailureModal(!generateRefundFailureModal)
        }
        footer={false}
        className="modal-box"
        width={410}
      >
          <AuthTitle
            children="There is a issue in processing the refund. Please try again later."
            className="text-center"
          />
      </Modal>
      <Modal
        open={resolveDisputeModal}
        onCancel={() => setResolveDisputeModal(!resolveDisputeModal)}
        footer={false}
        className="modal-box"
        width={410}
      >
        <div className="text-center">
          <Image
            src={documentverified}
            alt="nothing"
            preview={false}
            style={{
              height: "80px",
              width: "80px",
            }}
          />
          <AuthTitle
            children="Dispute has resolved successfully!"
          />
          </div>
      </Modal>

      <Modal
        className="text-center modal-box"
        centered
        destroyOnClose={true}
        onCancel={() => setRemarkModal(!remarkModal)}
        open={remarkModal}
        width={410}
        footer={false}
      >
        <CardHeadText children="Add remark" />
        <Form form={form} scrollToFirstError onFinish={addRemark}>
          <Form.Item
            labelCol={{ span: 24 }}
            name="name"
            rules={[
              {
                required: true,
                message: "Please add a remark",
              },
            ]}
          >
            <Input placeholder="Enter remark" />
          </Form.Item>
          <div className="ant-modal-footer modalFooter">
            <Button 
              key="cancel"
              className="cancel"
              onClick={()=>setRemarkModal(false)}
            >
              Cancel
            </Button>
            <Button loading={loading} key="submit" htmlType="submit" type="primary" className="reject_btn" style={{height:"40px"}}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={remarkSuccessModal}
        onCancel={() => setRemarkSuccessModal(!remarkSuccessModal)}
        footer={false}
        className="modal-box"
        width={410}
      >
        <div className="text-center">
          <Image
            src={documentverified}
            alt="nothing"
            preview={false}
            style={{
              height: "80px",
              width: "80px",
            }}
          />
          <AuthTitle
            children="Remark has been added successfully!"
          />
        </div>
      </Modal>

      <Modal
        className="modals"
        width={500}
        destroyOnClose={true}
        onCancel={() => setRefundDisputed(false)}
        open={refundDisputed}
        footer={false}
      >
          <Image preview={false} src={paymentData?.disputeDetails?.file} height={500}></Image>
          <Button
                className="float docudownloadBtn"
                onClick={() => downloadFile(paymentData?.disputeDetails?.file)}
              >
                <CloudDownloadOutlined className="my-float downloadText" />
                <span className="downloadText">Download</span>
              </Button>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        title={<p className="large-title">Release payment</p>}
        width={500}
        centered
        open={releaseModal}
        footer={false}
        closable={false}
        className="modal-box text-center"
        onCancel={() => setReleaseModal(false)}
      >
        <div>    
        <Image src={rejected} alt="" width={"100px"} height={"100px"} preview={false}/>
        <Card className="p-3 mt-2 payment-transaction-details-card">
            <>
            <div className="stepDetails mb-2">Pay details  </div>

             <Row gutter={[24, 24]} style={{alignContent:'center'}}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="d-flex align-items-baseline">
                    <Image src={addUserIcon} alt="user" preview={false} height={20} width={20} />
                    <div className="mx-2">
                      <div className="stepDetails_medium_sub" style={{textAlign : 'left'}}>Name</div>
                      <div className="stepDetails_medium fw-400 capitalize" >{payoutAccount?.name ?? sellerBankDetails?.name}</div>
                    </div>
                  </div>
                </Col>
             </Row>
              <Row gutter={[24, 24]}> 
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                  <div className="d-flex align-items-baseline">
                    <Image src={Suitcase} alt="user" preview={false} style={{maxWidth:"20px", minWidth:"20px"}}/>
                    <div className="mx-2">
                      <div className="stepDetails_medium_sub"  style={{textAlign : 'left'}}>Number</div>
                      <div className="stepDetails_medium fw-400 capitalize">{payoutAccount?.number ?? sellerBankDetails?.number}</div>
                    </div>
                  </div>
                </Col> 
              </Row>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="d-flex align-items-baseline">
                    <Image src={bankAcc} alt="user" preview={false} height={20} width={20} />
                    <div className="mx-2">
                      <div className="stepDetails_medium_sub" style={{textAlign : 'left'}}>Bank name</div>
                      <div className="stepDetails_medium fw-400 capitalize" >{payoutAccount?.institutionName ?? sellerBankDetails?.institutionName}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          </Card>  
        <NormalText
          children={`Do you want to release payment of ${moneyFormat(contractDetail?.currency,Number(activeMilestoneData?.buyerTransactionAmount ?? 0))} ?`}
          className="mb-4 mt-3"
        />        
            <div className="ant-modal-footer modalFooter center">
          <Button loading={yesBtnLoading} onClick={() => {
                    relasePay();
                  }} type="primary" className="modal-button">
            Yes
          </Button>
        <Button
            key="cancel"
            className="modal-button-cancel"
            onClick={() => {
              setReleaseModal(false);
            }}
            disabled = {inProgressPaymentRelease}
          >
            No
          </Button>
        </div>
        </div>
      </Modal>
      <Modal
        className="text-center modals"
        centered
        visible={approvedModal}
        width={410}
        footer={null}
      >
        <Image className="mb-1" src={DashboardImg} preview={false} style={{ height: '56px', width: '56px', borderRadius: '50%' }} />
        <AuthTitle children='TrustIn escrow transaction approved!' className="mt-2" />
      </Modal>
      <Modal
        className="text-center modals"
        centered
        visible={rejectModal}
        width={410}
        footer={null}
      >
        <Image className="mb-1" src={reject} preview={false} style={{ height: '56px', width: '56px', borderRadius: '50%', opacity: '0.5' }} />
        <AuthTitle children={<>TrustIn <br /> escrow transaction rejected!</>} className="mt-2" />
      </Modal>
      <Modal
        className="text-center modals"
        centered
        visible={onholdModal}
        width={410}
        footer={null}
      >
        <Image className="mb-1" src={reject} preview={false} style={{ height: '56px', width: '56px', borderRadius: '50%', opacity: '0.5' }} />
        <AuthTitle children={<>TrustIn <br /> escrow transaction on hold!</>} className="mt-2" />
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
            children={<>4 digits OTP has been sent on <span className="email">{UserEmail}</span></>} />
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
      <Modal
        open={contractRejectModal}
        onCancel={() => {
          setIsContractRejectModal(false);
        }}
        footer={false}
        title={
          <span
            className={"change-client-classification errMsg"}
          >
            {/* {modalHeader} */}
            <hr className="lightgrayHr mb-3" />
          </span>
        }
        centered
        width={520}
        className="modal-box"
      >
        <Form scrollToFirstError onFinish={rejectContract} form={form}>
          <p className="enter-text mb-4">Enter comment below</p>
          <Form.Item
            name="rejectReason"
            rules={[
              {
                required: true,
                message: "Please enter reason !",
              },
              {
                whitespace: true,
                message: "Invalid reason!",
              },
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
                  setIsContractRejectModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Row>
        </Form>
      </Modal>
      <VerifyModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imageData={imageData}
        _fetchPaymentConditions={_fetchPaymentConditions}
        docForEmail={docForEmail}
        idOfContract=''
        stateData={userData}
        buttonRequired={buttonRequired}
         _getPaymentDetails={getPaymentDetails}
         isVerified={isVerified}
         setIsVerified={setIsVerified}
      />      
    </>
  );
};

export default AdminReleaseCondition;
