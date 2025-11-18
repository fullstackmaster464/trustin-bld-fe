import EscrowTransationHistorySteps from "./EscrowTransactionHistorySteps";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  Image,
  Modal,
  Popover,
  Row,
  Steps,
  Tooltip,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DisputeManagementList,
  EscrowTransactionList,
  Resolve_Dispute,
} from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import MoveTo from "../../assets/img/moveTo.svg";
import WhiteUserFull from "../../assets/img/WhiteUserFull.svg";
import WhiteEmail from "../../assets/img/white_email.svg";
import Email from "../../assets/img/Email_outline.svg";
import Globe from "../../assets/img/white_globe.svg";
import Payment from "../../assets/img/white_payment.svg";
import PaymentGray from "../../assets/img/gray_payment.svg";
import UserFull from "../../assets/img/User_Full.svg";
import Reason from "../../assets/img/refundReason.svg";
import Refund from "../../assets/img/refund.svg";
import Job from "../../assets/img/job_white.svg";
import BlueEye from "../../assets/img/blueEye.svg";
import Clock from "../../assets/img/clock_light.svg";
import Doc from "../../assets/img/grayDoc.svg";
import Id from "../../assets/img/id.svg";
import Suitcase from "../../assets/img/sellerJob.svg";
import Success from "../../assets/img/success.svg";
import Reject from "../../assets/img/reject.svg";
import TransactioType from "../../assets/img/transactionType.svg";
import bankAcc from '../../assets/img/bankacc.svg'

import { useEffect, useState } from "react";
import {
  UpdateFileStatus,
  emailAfterRejectDoc,
  emailAfterVerifyDoc,
  getContractDetails,
  getContractHistory,
  getItemTypeCategoryByItemAlias,
  getPaymentDetails,
  getTxnData,
  verifyContract,
  getTransactionListToVerify,
  virtualAccountDetails,
  getVaTransactionListByContractAlias
} from "../../services/admin";
import moment from "moment";
import {
  PLATFORM_CHARGE_TYPE,
  TXN_STATUS,
  USER_TYPE_TEXT,
  getLocalStorage,
  modifyCresetUserType,
  moneyFormat,
  ordinalSuffixOf,
  toTitleCase,
} from "../Common/Constants";
import TextArea from "antd/es/input/TextArea";
import {
  MainButtonRound,
  SecondaryOutLineButton,
} from "../ui-elements/ButtonRepo";
import DefaultLayout from "../Common/DefaultLayout";
import CustomContractDetails from "../User/NewTransaction/customContractList";
import { BoldText } from "../ui-elements/TextRepo";
import { getlocalBankDetails } from "../../services/user";
import { CalculateTransactionFee } from "../Common/InvoiceCalculations";
import DisputePdfViewModal from "../Models/DisputePdfViewModal";
import Title from "antd/lib/typography/Title";

const DisputeDetails = ():any => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = window?.location?.pathname.split("/").pop();
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [disputeTransferStatus, setDisputeTransferStatus] = useState<"IN_PROGRESS" | "FAILED" | "SUCCESS" | undefined>();
  const [File, setFile] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [fromParty, setFromParty] = useState<any>({});
  const [toParty, setToParty] = useState<any>({});
  const [categoryDetails, setCategoryDetails] = useState<any>({});
  const [loader, setLoader] = useState(true);
  const [contractHistory, setContractHistory] = useState<any>({});
  const [contractDetail, setContractDetail] = useState<any>({});
  const [vATransactions, setVATransactions] = useState<any>();
  const [isVerifyModal, setIsVerifyModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [isverifyVisible, setverifyVisible] = useState(false);
  const [isPDFView, setIsPDFView] = useState(false);
  const [imageData] = useState<any>({});
  const [docForEmail] = useState("");
  const [buttonRequired] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [form] = Form.useForm();
  const [customContractList, setCustomContractList] = useState<any>();
  const [customAttachURL, setCustomAttachURL] = useState<any>("");
  const [customAttachmentUrls, setCustomAttachmentUrls] = useState<any>([]);
  const [taxDetails,setTaxDetails]= useState<any>({});
  const [activePayment, setActivePayment] = useState(0);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [invoiceCal, setInvoiceCal] = useState<any>([]);
  const [milestoneCal, setmilestoneCal] = useState<any>([]);
  const [sellerBankDetails, setSellerBankDetails] = useState<any>(null);
  const [escrowAdvisorBankDetails, setEscrowAdvisorBankDetails] = useState<any>(null);
  const [buyervirtualAccount, setBuyerVirtualAccount] = useState<any>([]);
  const [toBuyerAccount, setToBuyerAccount] = useState<any>({
    account: "",
    amount: 0,
  });
  const [toSellerAccount, setToSellerAccount] = useState<any>({
    account: "",
    amount: 0,
  });
  const [toPlatformAccount, setToPlatformAccount] = useState<any>({
    account: "",
    amount: 0,
  });
  const [toAdvisorAccount, setToAdvisorAccount] = useState<any>({
    account: "",
    amount: 0,
  });
  const [imagUrl, setImagUrl] = useState<any>("");
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, [])
  const { Step } = Steps;
  const { Panel } = Collapse;
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
  };
  const handleApprove = async () => {
    const obj = {
      TxnId: imageData.txn_ID,
      imageKey: imageData.key_d,
      imageID: imageData.id,
      status: "VERIFIED",
      userAlias: userAlias,
      userType: userType,
      docName: docForEmail,
    };

    const resp = await UpdateFileStatus(obj);

    if (resp.status === 200 || resp.status === 201) {
      setverifyVisible(false);
    }
    await emailAfterVerifyDoc(userAlias, docForEmail, userType);
  };

  const handleReject = async (reason: string) => {
    const obj = {
      TxnId: imageData.txn_ID,
      imageKey: imageData.key_d,
      imageID: imageData.id,
      status: "REJECTED",
      userAlias: userAlias,
      userType: userType,
      reason: reason,
      docName: docForEmail,
    };

    const resp = await UpdateFileStatus(obj);
    setverifyVisible(false);
    setShowRejectReason(false);

    if (resp.status === 200 || resp.status === 201) {
      setverifyVisible(false);
    }
    await emailAfterRejectDoc(userAlias, docForEmail, reason, userType);
  };

  const onFinish = (values: any) => {
    handleReject(values?.rejectReason);
  };

  const handleCancel = () => {
    setverifyVisible(!isverifyVisible);
    setShowRejectReason(false);
  };

  const openViewModal = (url: string) => {
    if (url) {
      setFile(url);
      setViewModal(true);
    } else {
      message.error("Oops! Could not open the file.");
    }
  };
  useEffect(() => {
    if (id) {
      getContractHistory(id)
      .then((response) => {
          // setLoading(false);
          const historyList: any = {};
          const history: any = {};
          response.data.map(
            (item: any) =>
            { 
              let contractAction = item.contractAction
              if (contractAction === "DOCUMENT APPROVED" && item?.role !== 'TRUSTEE') {
                contractAction = 'DOCUMENT APPROVED ADMIN';
              }
              historyList[contractAction?.split(" ").join("_")] = {
                 name: item.name ?? '',
                 updatedAt: item.updatedAt ?? new Date().toISOString(),
                 transactionAlias: item.transactionAlias ?? null,
                  updatedBy: item?.updatedBy ?? '',
                 role: item?.role ?? ''
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
        // setLoading(false);
        message.error("Could not fetch details. Please try again later!");
      });
    }
  }, [id]);

  const onVerifyFinish = (values: any) => {
    modalHeader == "Approve Contract"
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
        message.error("Something went wrong. Please try again later");
      });
  };
  const showVerifyModal = (value: string) => {
    setIsVerifyModal(true);
    if (value) {
      setModalHeader(value);
    }
  };
 
  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = File;
    link.setAttribute("download", "file");
    document.body.appendChild(link);
    link.click();
  };
  const goBack = () => {
    navigate(DisputeManagementList);
  };


  useEffect(() => {
    if(contractHistory && paymentDetails?.buyerAlias) {
    getTransactionListToVerify("ESCROW",paymentDetails?.aliasName)
    .then((res: any) => {
      setVATransactions(res?.data?.VATransactionList?.data);
    }) .catch(() => {
      message.error("NO TRANSACTIONS FOUND");
    })
  }
  if(paymentDetails?.aliasName) {
    getBankList(paymentDetails);
    getTransactionDetails(paymentDetails?.invoiceAmount, paymentDetails?.aliasName);
    paymentDetails.milestoneList?.map((item: any) => {
        getTransactionDetails(item?.transactionAmount, item?.aliasName);
    })
  }
  }, [contractHistory, paymentDetails])

  const milestoneAmount: any = [];
  const getTransactionDetails = async(txnAmount: any, txnAlias: any) => {
    const data = CalculateTransactionFee({
      invoiceAmount: paymentDetails?.invoiceAmount,
      transactionAmount: txnAmount, 
      plateformFees: paymentDetails?.platformCharge, 
      platformChargeType: paymentDetails?.platformChargeType ? paymentDetails?.platformChargeType : PLATFORM_CHARGE_TYPE.PERCENT, 
      vatCharges: paymentDetails?.vatCharges, 
      buyerPercent: paymentDetails?.buyerPercent, 
      sellerPercent: paymentDetails?.sellerPercent, 
      contractStartedBy: paymentDetails?.contractStartedBy,
      hasAdvisor: hasAdvisor(paymentDetails),
      escrowCommission: paymentDetails?.escrowAdvisorCommission,
      buyerCommissionPercent: paymentDetails?.buyerCommissionPercent,
      sellerCommissionPercent: paymentDetails?.sellerCommissionPercent,
      minimumPlatformCharge: paymentDetails?.minimumPlatformCharge,
      entityType: paymentDetails?.itemCategoryEntityType
    })
    if(paymentDetails?.aliasName == txnAlias) {
      setInvoiceCal(data)
    } else{
      milestoneAmount[txnAlias] = data;
      setmilestoneCal(milestoneAmount)
    }
  }
  const formatReleaseDate = (releaseDate: any, status: any) => {
    return status === TXN_STATUS.RELEASED
      ? ` completed on ${moment(releaseDate).format("DD-MM-YYYY")}`
      : ` yet to be released on ${moment(releaseDate).format("DD-MM-YYYY")}`;
  };

  const getBankList = (data:any) =>{
    if(data.sellerAlias){
      getlocalBankDetails(data.sellerAlias)
      .then((response) => {
        response?.data?.bankDetails?.find((item:any) => {   
          if (item.isPrimary) {
            setSellerBankDetails(item)
          }
        });
      })
      .catch(() => {
        message.error("Seller bank details not found");
      });
    }
    if(data.buyerAlias && data?.currency){
      virtualAccountDetails(data.buyerAlias, data?.currency)
      .then((response:any) => {
        setBuyerVirtualAccount(response?.data?.VADetails);
      })
      .catch(() => {
        message.error("Escrow account details not found");
      });
    }

    if(data.escrowAdvisorAlias){
      getlocalBankDetails(data.escrowAdvisorAlias)
      .then((response) => {
        response?.data?.bankDetails?.find((item:any) => {
          if (item.isPrimary) {
            setEscrowAdvisorBankDetails(item)
          }
        });
      })
      .catch(() => {
        message.error("Advisor bank details not found")
      });
    }
  }

  useEffect(() => {
    //Enter only if dispute refund completed
    if (["9", "10"].includes(paymentDetails?.contractStatus)) {
      getVaTransactionListByContractAlias(paymentDetails?.aliasName)
      .then((response: any) => {
        if (!response?.data?.vaTransactionList) {
          message.error("Transaction list not found");
          return;
        }
        const trxnList = response?.data?.vaTransactionList || [];

        const buyerTransactionComments = [
          "DISPUTE_FULL_REFUND",
          "DISPUTE_BUYER_PARTIAL_REFUND",
          "DISPUTE_COMPLETED_MILESTONES_REFUND",
          "BUYER_PARTIAL_REFUND",
          "BUYER_COMPLETE_REFUND",
          "COMPLETED_MILESTONE_REFUND",
        ];

        const sellerTransactionComments = [
          "DISPUTE_PAYMENT_RELEASE",
          "DISPUTE_SELLER_PARTIAL_REFUND",
          "SELLER_PARTIAL_REFUND",
          "SELLER_COMPLETE_REFUND",
        ];
        
        const platformTransactionComments = [
          "DISPUTE_PLATFORM_FEE_RELEASE",
          "DISPUTE_COMPLETED_MILESTONES_PLATFORM_FEE_RELEASE",
          "PLATFORM_RELEASE_DISPUTE",
          "COMPLETED_MILESTONE_PLATFORM_RELEASE",
        ];

        const advisorTransactionComments = [
          "DISPUTE_ADVISOR_FEE_RELEASE"
        ];

        let buyerAccount = "";
        let platformAccount = "";
        let sellerAccount = "";
        let buyerAmount = 0;
        let platformAmount = 0;
        let sellerAmount = 0;
        for(const eachTrxn of trxnList) {
          if (buyerTransactionComments.includes(eachTrxn.TransactionComment)) {
            buyerAccount = eachTrxn.AccountAlias;
            buyerAmount += Number(eachTrxn?.Amount || 0);
          } else if (sellerTransactionComments.includes(eachTrxn.TransactionComment)) {
            sellerAccount = eachTrxn.AccountAlias;
            sellerAmount += Number(eachTrxn?.Amount || 0);
          } else if (platformTransactionComments.includes(eachTrxn.TransactionComment)) {
            platformAccount = eachTrxn.AccountAlias;
            platformAmount += Number(eachTrxn?.Amount || 0);
          } else if (advisorTransactionComments.includes(eachTrxn.TransactionComment)) {
            setToAdvisorAccount({
              account: eachTrxn.AccountAlias,
              amount: Number(eachTrxn?.Amount || 0).toFixed(2)
            })
          }
        }

        setToBuyerAccount({
          account: buyerAccount,
          amount: buyerAmount.toFixed(2)
        });

        setToSellerAccount({
          account: sellerAccount,
          amount: sellerAmount.toFixed(2)
        })

        setToPlatformAccount({
          account: platformAccount,
          amount: platformAmount.toFixed(2)
        })
      })
      .catch((error: any) => {
        console.log("dispute error", error);
        message.error("Couldn't fetch transaction details for dispute.");
      })
    }
  }, [paymentDetails])

  useEffect(() => {
    setLoader(true)
    getPaymentDetails(id).then((response: any) => {
      const data = response?.data;
      setPaymentDetails(data);
      let disputeTransferStatus: any;
      if (data.disputeTransferStatus === "FAILED") {
        disputeTransferStatus = "FAILED";
      } else if (data.disputeTransferStatus === "IN_PROGRESS" && disputeTransferStatus !== "FAILED") {
        disputeTransferStatus = "IN_PROGRESS";
      } else if (data.disputeTransferStatus === "COMPLETED" && disputeTransferStatus !== "FAILED" && disputeTransferStatus !== "IN_PROGRESS") {
        disputeTransferStatus = "COMPLETED";
      }
      if (disputeTransferStatus) {
        setDisputeTransferStatus(disputeTransferStatus)
      }
      setCustomContractList(data?.customPoint)
      setCustomAttachURL(data?.customAttach?.url)
      if (data?.customAttachments) {
        setCustomAttachmentUrls(data?.customAttachments.map((elem:any) => elem.url));
      } else {
        if (data?.customAttach?.url) {//for older entries
          setCustomAttachmentUrls([data?.customAttach?.url]);
        }
      }
      setActivePayment(data?.milestoneList?.length);
      const milestones = data?.milestoneList;
      
      for (let i = 0; i < milestones?.length; i++) {
        if (milestones[i].paymentStatus == null) {
          setActivePayment(i);
          break;
        }
      }

      getItemTypeCategoryByItemAlias(data?.itemCategoryAlias)
      .then((responseData: any) => {
        setTaxDetails({
          "plateformFees": responseData?.data?.plateformFees,
          "vatCharges": responseData?.data?.vatCharges
        })
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        if (error?.data?.message) {
          message.error(error.data.message);
        } else if (error?.data) {
          const errorMsg: any = error?.data[0].message;
          message.error(errorMsg);
        } else if (error?.error) {
          message.error(error.error);
        } else {
          message.error("Internal server error");
        }
      });
    });
    getTxnData(id).then((response: any) => {
      setCategoryDetails(response?.data);
    });
    getContractDetails(id, userAlias).then((response: any) => {
      setLoader(false)
      setContractDetail(response?.data);
      if (response?.data?.contractStartedBy === USER_TYPE_TEXT.BUYER) {
        setFromParty({
          userType: "Buyer",
          name: response?.data?.buyerDetails.name,
          email: response?.data?.buyerDetails?.email,
          country: response?.data?.buyerDetails?.countryAlias,
        });
        setToParty({
          userType: "Seller",
          name: response?.data?.sellerDetails.name,
          email: response?.data?.sellerDetails?.email,
          country: response?.data?.sellerDetails?.countryAlias,
        });
      } else {
        setFromParty({
          userType: "Seller",
          name: response?.data?.sellerDetails.name,
          email: response?.data?.sellerDetails?.email,
          country: response?.data?.sellerDetails?.countryAlias,
        });
        setToParty({
          userType: "Buyer",
          name: response?.data?.buyerDetails.name,
          email: response?.data?.buyerDetails?.email,
          country: response?.data?.buyerDetails?.countryAlias,
        });
      }
    });
  }, []);

  const hasAdvisor = (data:any) => {
    const check = data?.escrowAdvisorAlias && ![data?.buyerAlias,data?.sellerAlias].includes(data?.escrowAdvisorAlias)
    return check
  }

  const isFloat = (n:any) => {
    return Number(n) === n && n % 1 !== 0;
  }

  const validateBank = async(key: any) => {
    setLoader(true)
    let hasBuyerBank: any = false;
    let hasSellerBank: any = false;
    if(key === "generaterefund" || key === "partialrefund") {
       await getlocalBankDetails(paymentDetails?.buyerAlias)
      .then((response : any) => {
        if(response?.data?.bankDetails?.length > 0) {
        hasBuyerBank = true;
        } else{
          message.error("Buyer bank details not found")
        }
      }).catch(()=> {
        message.error("Buyer bank details not found")
      })
    } 
    if(key === "releasepayment" || key === "partialrefund") {
      await getlocalBankDetails(paymentDetails?.sellerAlias)
      .then((response: any) => {
        if(response?.data?.bankDetails?.length >0) {
        hasSellerBank = true;
        } else {
          message.error("Seller bank details not found")
        }
      }).catch(()=> {
        message.error("Seller bank details not found")
      })
    } 
    setLoader(false)
    if((key === "generaterefund" && hasBuyerBank ===  true) || (key === "releasepayment" && hasSellerBank ===  true) || (key === "partialrefund" && hasBuyerBank ===  true && hasSellerBank ===  true)){
      navigate(
        Resolve_Dispute +
        id +
        "?type=" + key
      );
    }
  }
  return (
    <div className="scrollbar-container">
      <DefaultLayout
        page={location?.state == "escrow" ? "escrow_transaction" : "dispute_management"}
        loading={loader}
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
              <b> Agreement Details</b>
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
                    if (location?.state == 'escrow') {
                      navigate(EscrowTransactionList);
                    }
                    else {
                      navigate(DisputeManagementList);
                    }
                  }}
                >
                  {location?.state == 'escrow' ? "Escrow Transaction" : "Dispute Management"}
                </Breadcrumb.Item>
                <Breadcrumb.Item className="cursor">
                  Agreement Details
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
        <Row className="endtoend" gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
          <Col xs={24} sm={24} md={24} lg={16}>
            <div className="bg-admin-card seller-bg-admin-card">
              <div className="endtoend ">
                <div className="title_white ">
                  {paymentDetails?.agreementId}
                </div>
                <div className="d-flex">
                  <Image src={Job} alt="box" preview={false} />
                  <div className="whiteTitle18 px-3">
                    {moment(paymentDetails?.createdAt).format(
                      "DD-MM-YYYY"
                    )}
                  </div>
                </div>
              </div>
              <hr className=" w-100 opacity-50 mt-4" />
              <Col className="form-body" span={24}>
                <div className="endtoend">
                  <div className="">
                    <div className="buyerBox">
                      From {fromParty.userType}
                    </div>
                    <div className="d-flex my-3">
                      <Image
                        src={WhiteUserFull}
                        alt="box"
                        preview={false}
                      />
                      <div className="whiteTitle18 px-3">
                        {fromParty.name}
                      </div>
                    </div>
                    <div className="d-flex my-3">
                      <Image src={WhiteEmail} alt="box" preview={false} style={{minWidth:'20px', maxWidth:'20px'}}/>
                      <div className="whiteTitle18 px-3 noWrap overflowText">
                         <Tooltip title={fromParty.email} overlayClassName='custom-tooltip'>
                         <span>{fromParty.email}</span>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="d-flex my-3">
                      <Image src={Globe} alt="box" preview={false} />
                      <div className="whiteTitle18 px-3">
                        {fromParty.country}
                      </div>
                    </div>
                    <div className="d-flex my-3">
                      <Image src={Payment} alt="box" preview={false} />
                      <div className="whiteTitle18 bold px-3">
                        {paymentDetails?.currency +
                          " " +
                          paymentDetails?.invoiceAmount}
                      </div>
                    </div>
                  </div>
                  <div className="mx-2 ltr-img">
                    <Image src={MoveTo} alt="move" preview={false} style={{minWidth:'20px', maxWidth:'20px'}}/>
                  </div>
                  <div className="">
                    <div className="buyerBox">To {toParty.userType}</div>
                    <div className="d-flex my-3">
                      <Image
                        src={WhiteUserFull}
                        alt="box"
                        preview={false}
                      />
                      <div className="whiteTitle18 px-3">
                      <Tooltip
                      title={
                        <span className="response-tooltip">
                          {toParty.name}
                        </span>
                      }
                      overlayClassName="custom-tooltip info-icon"
                      placement="top"
                      overlayInnerStyle={{}}
                      arrow={false} 
                    >
                    <span className="dispute-ellipsis-text">
                        {toParty.name}
                      </span>
                    </Tooltip>
                      </div>
                    </div>
                    <div className="d-flex my-3">
                      <Image src={WhiteEmail} alt="box" preview={false} style={{minWidth:'18px', maxWidth:'18px'}}/>
                     <div className="whiteTitle18 px-3 noWrap overflowText">
                       <Tooltip title={toParty.email} overlayClassName='custom-tooltip'>
                        <span>{toParty.email}</span>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="d-flex my-3">
                      <Image src={Globe} alt="box" preview={false} />
                      <div className="whiteTitle18 px-3">
                        {toParty.country}
                      </div>
                    </div>
                    <div className="d-flex my-3">
                      <Image src={Payment} alt="box" preview={false} />
                      <div className="whiteTitle18 bold px-3">
                        {paymentDetails?.currency +
                          " " +
                          paymentDetails?.invoiceAmount}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </div>
            <div className="my-4">
            {Width <= 991 ? 
              <Col xs={24} sm={24} md={24} lg={24} className="mb-4">
                <Card className="px-2 detailsCard h-auto stages-timeline-card">
                  <div className="stepDetails mb-4 mt-2 mx-2">Stages</div>
                  <EscrowTransationHistorySteps
                    screen={'disputDetails'}
                    contractHistory={contractHistory}
                    contractDetail={contractDetail}
                    paymentDetails={paymentDetails}
                    taxDetails={taxDetails}
                  />
                </Card>
              </Col> : null}
              {(userType === "TRUSTEE" || userType === "ADMIN" || userType === "AUTHORIZER" || userType === "SENIOR_MANAGMENT") && (
                  <div className="mt-4 mb-4">
                    <Card className="px-4">
                      <div className="stepDetails">
                        {sellerBankDetails && (
                          <Card className="noBorder mt-6 p-4 mb-3 status ant-bank-card" style={{height:'auto'}}>
                            <Row className="endtoend">
                              <Col className="titleText capitalize" span={Width < 650 ? 24 : 14}>
                                {/* {userBankList[0]?.institutionName.toLowerCase()} */}
                                <h5>{modifyCresetUserType(paymentDetails?.sellerAlias, 'Seller')}&apos;s Bank Details</h5>
                              </Col>
                            </Row>
                            <Row className="mt-4" gutter={[24, 24]}>
                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">{sellerBankDetails?.type === "IBAN" ? "IBAN" : "Account number"}</div>
                                <div className="subText_xs overflowText">
                                  <Popover content={sellerBankDetails?.number} trigger="hover">
                                    {sellerBankDetails?.number}
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Bank name</div>
                                <div className="subText_xs capitalize responsive-text">
                                  <Popover content={sellerBankDetails?.institutionName} trigger="hover">
                                    {sellerBankDetails?.institutionName}
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Routing code</div>
                                <div className="subText_xs overflowText">
                                  <Popover content={sellerBankDetails?.routingCode} trigger="hover">
                                    {sellerBankDetails?.routingCode}
                                  </Popover>
                                </div>
                              </Col>

                              <Col span={Width > 650 ? 12 : 12} className="col-padding">
                                <div className="small-text-light">Routing scheme</div>
                                <div className="subText_xs overflowText">
                                  <Popover content={sellerBankDetails?.routingScheme} trigger="hover">
                                    {sellerBankDetails?.routingScheme}
                                  </Popover>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        )}
                          {buyervirtualAccount && buyervirtualAccount.length > 0 && (
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
                       {process.env.ENABLE_ESCROW_ADVISOR=='true'&&escrowAdvisorBankDetails&& (
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
                          </Card></>
                        )}
                      </div>
                    </Card>
                  </div>
                )}
              <Card className="px-4">
                <div className="stepDetails mb-4 mt-3">
                  Category details
                </div>
                <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <div className="d-flex">
                      <Image src={Suitcase} alt="user" preview={false} />
                      <div className="mx-3">
                        <div className="stepDetails_medium_sub">
                          Item categories
                        </div>
                        <div className="stepDetails_medium fw-400">
                          {categoryDetails?.itemType}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex my-4">
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
                  {categoryDetails?.dynamicInputFields?.length > 0 && categoryDetails?.dynamicInputFields.map((inputField: any, index: string) => (
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
                  <Col xs={24} sm={24} md={12} lg={12}>
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
                    <div className="d-flex mt-4">
                      <Image src={Doc} alt="user" preview={false} />
                      <div className="mx-3">
                        <div className="stepDetails_medium_sub">
                          Product description
                        </div>
                        <div className="stepDetails_medium fw-400">
                          {categoryDetails?.description
                            ? categoryDetails?.description
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <hr className="lightgrayHr" />
                <div className="stepDetails mt-3">Payment details</div>
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
                            return (
                              <Step
                                key={index}
                                title={
                                  <div className="d-flex justify-content-between align-items-center gap-3">
                                    <span>
                                      {`${ordinalSuffixOf(
                                        index + 1
                                      )} milestone (${isFloat(milestoneCal[data.aliasName]?.milestonePercent) ? Number(milestoneCal[data.aliasName]?.milestonePercent).toFixed(2) : milestoneCal[data.aliasName]?.milestonePercent}%)`}
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
                                        {
                                          <div>
                                            {data?.paymentStatus !== "COMPLETED" &&
                                            <div>
                                              <div className="endtoend py-2">
                                                <b className="subText_small">Amount to be transferred to {modifyCresetUserType(paymentDetails?.buyerAlias,'buyer')}&apos;s escrow account</b>
                                                <b className="subText_small text-end">
                                                  {moneyFormat(
                                                    paymentDetails?.currency,
                                                    data?.buyerTransactionAmount !== null ? Number(data?.buyerTransactionAmount) : Number(milestoneCal?.[data?.aliasName]?.buyerAmount)
                                                  )}
                                                </b>
                                              </div>
                                              <div className="endtoend py-2">
                                                <b className="subText_small">Amount to be received by {modifyCresetUserType(paymentDetails?.sellerAlias,'seller')}&apos;s bank account</b>
                                                <b className="subText_small text-end">
                                                  {moneyFormat(
                                                    paymentDetails?.currency,
                                                    milestoneCal[data?.aliasName]?.sellerAmount
                                                  )}
                                                </b>
                                              </div>
                                              {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                                <div className="endtoend py-2">
                                                  <b className="subText_small">Amount to be received by escrow advisor&apos;s bank account</b>
                                                  <b className="subText_small text-end">
                                                    {moneyFormat(
                                                      paymentDetails?.currency,
                                                      Number(Number(milestoneCal?.[data?.aliasName]?.buyerAdvisorFee) + Number(milestoneCal?.[data?.aliasName]?.sellerAdvisorFee)).toFixed(2)
                                                    )}
                                                  </b>
                                                </div>
                                              )}
                                              <div className="endtoend py-2">
                                                <b className="subText_small">Amount to be received by TrustIn Platform</b>
                                                <b className="subText_small text-end">
                                                  {moneyFormat(
                                                    paymentDetails?.currency,
                                                    Number(Number(milestoneCal[data?.aliasName]?.platformFee) + Number(milestoneCal[data?.aliasName]?.vatFee)).toFixed(2)
                                                  )}
                                                </b>
                                              </div>
                                            </div>
                                            }
                                            {data?.paymentStatus === "COMPLETED" && data.transactionStatus !== "RELEASED" &&
                                              <div>
                                                <div className="endtoend py-2">
                                                <b className="subText_small">Amount to be transferred to {modifyCresetUserType(paymentDetails?.buyerAlias,'buyer')}&apos;s escrow account
                                                </b>
                                                <b className="subText_small text-end">
                                                  {moneyFormat(
                                                    paymentDetails?.currency,
                                                    data?.buyerTransactionAmount !== null ? Number(data?.buyerTransactionAmount) : Number(milestoneCal?.[data?.aliasName]?.buyerAmount)
                                                  )}
                                                </b>
                                              </div>
                                              <div className="endtoend py-2">
                                                <b className="subText_small">Amount to be received by {modifyCresetUserType(paymentDetails?.sellerAlias,'seller')}&apos;s bank account</b>
                                                <b className="subText_small text-end">
                                                  {moneyFormat(
                                                    paymentDetails?.currency,
                                                    milestoneCal[data?.aliasName]?.sellerAmount
                                                  )}
                                                </b>
                                              </div>
                                              {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                                <div className="endtoend py-2">
                                                  <b className="subText_small">Amount to be received by escrow advisor&apos;s bank account</b>
                                                  <b className="subText_small text-end">
                                                    {moneyFormat(
                                                      paymentDetails?.currency,
                                                      Number(Number(milestoneCal?.[data?.aliasName]?.buyerAdvisorFee) + Number(milestoneCal?.[data?.aliasName]?.sellerAdvisorFee)).toFixed(2)
                                                    )}
                                                  </b>
                                                </div>
                                              )}
                                              <div className="endtoend py-2">
                                                <b className="subText_small">Amount to be received by TrustIn Platform</b>
                                                <b className="subText_small text-end">
                                                  {moneyFormat(
                                                    paymentDetails?.currency,
                                                    Number(Number(milestoneCal[data?.aliasName]?.platformFee) + Number(milestoneCal[data?.aliasName]?.vatFee)).toFixed(2)
                                                  )}
                                                </b>
                                              </div>
                                            </div>
                                            }
                                            {data?.paymentStatus === "COMPLETED" && data?.transactionStatus === "RELEASED" && (
                                            <>
                                              <div className="endtoend py-2">
                                                <b className="subText_small">Amount to be received by {modifyCresetUserType(paymentDetails?.sellerAlias,'seller')}&apos;s bank account</b>
                                                <b className="subText_small text-end">
                                                  {moneyFormat(
                                                    paymentDetails?.currency,
                                                    milestoneCal[data?.aliasName]?.sellerAmount
                                                  )}
                                                </b>
                                              </div>
                                              {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                                <div className="endtoend py-2">
                                                  <b className="subText_small">Amount to be received by escrow advisor&apos;s bank account</b>
                                                  <b className="subText_small text-end">
                                                    {moneyFormat(
                                                      paymentDetails?.currency,
                                                      Number(Number(milestoneCal?.[data?.aliasName]?.buyerAdvisorFee) + Number(milestoneCal?.[data?.aliasName]?.sellerAdvisorFee)).toFixed(2)
                                                    )}
                                                  </b>
                                                </div>
                                              )}
                                              <div className="endtoend py-2">
                                                <b className="subText_small">Amount to be received by TrustIn Platform</b>
                                                <b className="subText_small text-end">
                                                  {moneyFormat(
                                                    paymentDetails?.currency,
                                                    Number(Number(milestoneCal[data?.aliasName]?.platformFee) + Number(milestoneCal[data?.aliasName]?.vatFee)).toFixed(2)
                                                  )}
                                                </b>
                                              </div>
                                            </>)
                                            }
                                          </div>
                                        }
                                      </Panel>
                                    </Collapse>
                                      
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
                            Agreement amount
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              paymentDetails?.invoiceAmount
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                            Total TrustIn fees (
                              {invoiceCal?.platformPercent}) +{" "}
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
                        {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT?.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && ( <>
                        <div className="endtoend py-2">
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
                          Escrow advisor fees to be paid by buyer ({Number(paymentDetails?.buyerCommissionPercent || 0)}%)
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
                          Escrow advisor fees to be paid by seller ({Number(paymentDetails?.sellerCommissionPercent || 0)}%)
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
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                            TrustIn platform fees to be paid by buyer ({paymentDetails?.buyerPercent}%)
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              invoiceCal?.buyerTransactionFee
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                            TrustIn platform fees to be paid by seller ({paymentDetails?.sellerPercent}%)
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              invoiceCal?.sellerTransactionFee
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                          Amount to be paid by {modifyCresetUserType(paymentDetails?.buyerAlias, 'buyer')}
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              Number(invoiceCal?.buyerAmount)
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2">
                          <div className="stepDetails_medium_sub">
                          Amount to be received by {modifyCresetUserType(paymentDetails?.sellerAlias, 'seller')}
                          </div>
                          <div className="subText_small fw-400 text-right">
                            {moneyFormat(
                              paymentDetails?.currency,
                              Number(invoiceCal?.sellerAmount)
                            )}
                          </div>
                        </div>
                        <div className="endtoend py-2">
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
                            {(item?.isActive === true || item?.transactionStatus === "RELEASED" || item?.transactionStatus === "REFUNDED") && <>
                            <hr className="lightgrayHr" />
                            {paymentDetails?.isMilestone &&
                            <p>{`${ordinalSuffixOf(index + 1)} milestone - ${item.name}`}</p> }
                            {item?.paymentStatus !== "COMPLETED" &&
                              <div className="endtoend py-2">
                                <b className="subText_small">Amount to be transferred by buyer to his escrow account</b>
                                <b className="subText_small text-end">
                                  {moneyFormat(
                                      paymentDetails?.currency,
                                      item?.buyerTransactionAmount !== null ? Number(item?.buyerTransactionAmount) : Number(milestoneCal?.[item?.aliasName]?.buyerAmount)
                                  )}
                                </b>
                              </div>
                            }
                            {item?.paymentStatus === "COMPLETED"  && item.transactionStatus !== "REFUNDED" &&
                              <div className="endtoend py-2">
                                <b className="subText_small">Amount successfully transferred to buyer&apos;s escrow account</b>
                                <b className="subText_small text-end">
                                  {moneyFormat(
                                      paymentDetails?.currency,
                                      item?.buyerTransactionAmount !== null ? Number(item?.buyerTransactionAmount) : Number(milestoneCal?.[item?.aliasName]?.buyerAmount)
                                  )}
                                </b>
                              </div>
                            } 
                            {item?.paymentStatus === "COMPLETED" && item?.transactionStatus === "REFUNDED" && (
                              <>
                                {paymentDetails?.contractStatus === "9" && (
                                  <div className="endtoend py-2">
                                    <b className="subText_small">Amount is successfully refunded to {Number(paymentDetails?.disputeDetails.sellerAmount) > 0 ? "seller" : "buyer"}&apos;s bank</b>
                                    <b className="subText_small text-end">
                                      {item.releaseStatus === "1" && item.releasedAmount != null && item.releasedAmount != "" ?
                                        <>
                                          {moneyFormat(
                                            paymentDetails?.currency,
                                            Number(paymentDetails?.disputeDetails?.buyerAmount) > 0
                                              ? (Number(item.transactionAmount) - Number(milestoneCal?.[item?.aliasName]?.buyerTransactionFee)).toFixed(2)
                                              : (Number(item.transactionAmount) - Number(milestoneCal?.[item?.aliasName]?.sellerTransactionFee)).toFixed(2)
                                          )}
                                        </>  
                                      : 
                                        <>
                                          {moneyFormat(
                                            paymentDetails?.currency,
                                            Number(paymentDetails?.disputeDetails?.buyerAmount) > 0
                                              ? Number(paymentDetails?.disputeDetails?.buyerAmount || 0)
                                              : Number(paymentDetails?.disputeDetails?.sellerAmount || 0)
                                          )}
                                        </>
                                      }
                                    </b>
                                  </div>
                                )}
                                {paymentDetails?.contractStatus === "10" && ( <>
                                  <div className="endtoend py-2">
                                    <b className="subText_small">Amount is successfully refunded to seller&apos;s bank</b>
                                    <b className="subText_small text-end">
                                      {item.releaseStatus === "1" && item.releasedAmount != null && item.releasedAmount != "" ?
                                        <>
                                          {moneyFormat(
                                            paymentDetails?.currency,
                                              (((Number(item.transactionAmount) 
                                                * (100 - paymentDetails?.disputeDetails?.refundPercentage)) / 100)
                                                - Number(milestoneCal?.[item?.aliasName]?.sellerTransactionFee)
                                              ).toFixed(2)
                                          )}
                                        </>  
                                      : 
                                        <>
                                          {moneyFormat(
                                              paymentDetails?.currency,
                                              paymentDetails?.disputeDetails?.sellerAmount
                                          )}
                                        </>
                                      }
                                    </b>
                                  </div>
                                  <div className="endtoend py-2">
                                  <b className="subText_small">Amount is successfully refunded to buyer&apos;s bank</b>
                                  <b className="subText_small text-end">
                                    {item.releaseStatus === "1" && item.releasedAmount != null && item.releasedAmount != "" ?
                                      <>
                                        {moneyFormat(
                                          paymentDetails?.currency,
                                            (((Number(item.transactionAmount) 
                                              * (paymentDetails?.disputeDetails?.refundPercentage)) / 100
                                            ) - Number(milestoneCal?.[item?.aliasName]?.buyerTransactionFee)).toFixed(2)
                                        )}
                                      </>  
                                    : 
                                      <>
                                        {moneyFormat(
                                            paymentDetails?.currency,
                                            Number(paymentDetails?.disputeDetails?.buyerAmount)
                                        )}  
                                      </>
                                    }
                                  </b>
                                </div>
                                </>)}
                                {(paymentDetails?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || hasAdvisor(paymentDetails)) && (
                                  <div className="endtoend py-2">
                                    <b className="subText_small">Amount is successfully refunded to escrow advisor&apos;s bank</b>
                                    <b className="subText_small text-end">
                                      {moneyFormat(
                                          paymentDetails?.currency,
                                          Number(Number(milestoneCal?.[item?.aliasName]?.buyerAdvisorFee) + Number(milestoneCal?.[item?.aliasName]?.sellerAdvisorFee)).toFixed(2)
                                      )}
                                    </b>
                                  </div>
                                )}
                                <div className="endtoend py-2">
                                  <b className="subText_small">Amount is successfully refunded to trustin platform</b>
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
                            </>}
                            </div>
                          </>))
                        }
                </Card>
                {customContractList && Object.keys(customContractList).length > 0 ? <>
                  <hr className="lightgrayHr" /> 
                  <CustomContractDetails customFieldList= {customContractList} customAttachUrl={customAttachURL} customAttachmentUrls={customAttachmentUrls}/> 
                  </> : ""
                }
                <hr className="lightgrayHr" /> 
                <div className="stepDetails mb-4 mt-3 modal-word-wrap">
                Release Payment: Required Documents
                </div>
                {paymentDetails?.isMilestone ?
                  <Collapse defaultActiveKey={paymentDetails?.milestoneList?.map((item: any) => item.isActive).indexOf(true)} expandIconPosition={"right"} ghost className="mt-4">
                    {paymentDetails?.milestoneList?.map((data: any, index: any) => {
                      return (
                        <Panel header={`${ordinalSuffixOf(index + 1)} Milestone - ${data.name}`}
                          key={index}
                          className="border-bottom payment-condition"
                        >
                          {data?.documentList?.map((data2: any, index: any) => {
                            return (
                              <div
                              className={Width > 1200 ?"d-inline-flex align-items-center w-100 position-relative mb-2 mt-3" : "d-flex flex-column  w-100 position-relative mb-2 mt-3"}
                                key={index}
                              >
                                <span className={Width  > 1200 ? "d-flex align-items-center w-20" :"d-flex align-items-center"}>
                                  <Image src={Doc} alt="Document" preview={false} height={20} width={20} />
                                  <div className="mx-3">
                                      <div className="stepDetails_medium_sub">
                                          {toTitleCase(data2?.name)}
                                      </div>
                                  </div>
                               </span>

                              {paymentDetails?.filelist.filter(
                                (val: { inputfileid: any; }) => val.inputfileid == data2.aliasName
                              ).length > 0
                                ? paymentDetails?.filelist.map((val: { inputfileid: any; url: any; }) => {
                                  if (val.inputfileid === data2.aliasName) {
                                    return (
                                      <>
                                      <div className="d-flex w-100 justify-content-end">
                                        <Button
                                        className={Width > 550 ? "modal-button mt-0" :"modal-button mt-3 mx-auto"}
                                        htmlType="submit"
                                        onClick={() => { 
                                          if(val.url.includes(".pdf")){
                                            setIsPDFView(true)
                                            setImagUrl(val.url)
            
                                          }
                                          else{

                                          openViewModal(val.url); }}}
                                        >
                                          View
                                      </Button>
                                      </div>
                                      </>
                                    );
                                  }
                                })
                                : null}
                                  
                                </div>

                            );
                          })}
                        </Panel>
                      );
                    })}
                  </Collapse>
                  : paymentDetails?.milestoneList?.[0]?.documentList?.map(
                    (_item: any, index: number) => {
                      return (
                        <div className="d-inline-flex align-items-center w-100 position-relative endtoend mb-2 mt-3"  key={index}>
                          <div className="d-flex">
                            <Image src={Doc} alt="Document" preview={false} height={20} width={20} />
                            <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                    {toTitleCase(_item?.name)}
                                </div>
                            </div>
                          </div>
                          {paymentDetails?.filelist.filter(
                            (val: { inputfileid: any; }) => val.inputfileid == _item.aliasName
                            ).length > 0 ? paymentDetails?.filelist.map((val: { inputfileid: any; url: any; }) => {
                                  if (val.inputfileid === _item.aliasName) {
                                    return (
                                      <>
                                        <Button
                                        className={Width > 550 ? "modal-button mt-0" :"modal-button mt-3 mx-auto"}
                                        htmlType="submit"
                                        onClick={() => { 
                                          if(val.url.includes(".pdf")){
                                            setIsPDFView(true)
                                            setImagUrl(val.url)
            
                                          }
                                          else{

                                          openViewModal(val.url); }}}>
                                          
                                          View
                                      </Button>
                                      </>
                                    );
                                  }
                                })
                                : null}
                          <div>
                          </div>
                        </div>
                      );
                    }
                  )}
                {paymentDetails?.isDispute || paymentDetails?.disputeDetails !== null ? (
                  <div>
                    <hr className="lightgrayHr" />
                    <div className="stepDetails mb-4 mt-4">
                      Dispute resolution
                    </div>
                    <div className="labelTab mb-3">Initiate By</div>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                      <Col sm={24} md={12} lg={12}>
                        <div>
                          <div className="d-flex">
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
                                  (buyer)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex my-4">
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
                        </div>
                      </Col>
                      <Col sm={24} md={12} lg={12}>
                        <div>
                          <div className="d-flex">
                            <Image src={Email} alt="user" preview={false} />
                            <div className="mx-3">
                              <div className="stepDetails_medium_sub">
                                Email address
                              </div>
                              <div className="stepDetails_medium fw-400 product-details-word-wrap">
                                {
                                  paymentDetails?.disputeDetails
                                    ?.initiatedByEmail
                                }
                              </div>
                            </div>
                          </div>
                          <div className="d-flex my-4">
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
                        </div></Col>
                    </Row>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                        <Col xs={24} sm={24} md={12} lg={12} className="mb-3">
                        <div className="labelTab mb-4">Resolution details</div>
                        </Col>
                        {paymentDetails?.isDispute ?
                        <Col xs={24} sm={24} md={12} lg={12} className="mb-3">
                        {paymentDetails?.disputeDetails?.isGenerated && disputeTransferStatus != "FAILED"? (
                            false
                          ) : (
                            <div className={userType === "SUPPORT_ENGINEER"?"d-none":"d-flex"}>
                              <div
                                className="secondaryLink cursor mr-5"
                                onClick={() => {
                                  validateBank("generaterefund")
                                }}
                              >
                                Generate refund
                              </div>
                              <div
                                className="secondaryLink cursor"
                                onClick={() => {
                                  validateBank("partialrefund")
                                }}
                              >
                                Partial refund
                              </div>
                            </div>
                          )}
                        </Col>
                        : ""}
                      </Row>
                      <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                        <Col sm={24} md={12} lg={12}>
                        <div className="d-flex ">
                            <Image src={Refund} alt="user" preview={false} />
                            <div className="mx-3">
                              <div className="stepDetails_medium_sub">
                                Resolution amount
                              </div>
                              <div className="stepDetails_medium fw-400">
                                {paymentDetails?.currency} {paymentDetails?.invoiceAmount}
                                {/* {paymentDetails?.disputeDetails?.refundAmount >
                                  0 ? (
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
                                )} */}
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm={24} md={12} lg={12}>
                        <div className="d-flex ">
                            <Image src={Reason} alt="user" preview={false} />
                            <div className="mx-3">
                              <div className="stepDetails_medium_sub">
                              {paymentDetails?.disputeDetails?.refundReason && paymentDetails?.disputeDetails?.refundReason !== null ? "Resolution reason" : paymentDetails?.disputeDetails?.resolveReason && paymentDetails?.disputeDetails?.resolveReason !== null  ? "Resolve reason" : "" }
                              </div>
                              <div className="stepDetails_medium fw-400">
                                {paymentDetails?.disputeDetails?.refundReason
                                  ? paymentDetails?.disputeDetails?.refundReason
                                  : paymentDetails?.disputeDetails?.resolveReason && paymentDetails?.disputeDetails?.resolveReason !== null ? paymentDetails?.disputeDetails?.resolveReason : "-"}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <hr className="lightgrayHr" /> 
                      { ["9", "10"].includes(paymentDetails?.contractStatus) && ( <>
                        {toBuyerAccount.account != "" ? <>
                        <div className="pb-2 px-4 subText">{`To Buyer (${paymentDetails?.disputeDetails
                                          ?.refundPercentage}%)`}</div>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                          <Col sm={24} md={12} lg={12}>
                            <div className="d-flex">
                              <Image src={bankAcc} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Account
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {toBuyerAccount.account || ""}
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col sm={24} md={12} lg={12}>
                            <div className="d-flex">
                              <Image src={PaymentGray} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                 Amount
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {paymentDetails?.currency} {(toBuyerAccount.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <hr className="lightgrayHr" /> 
                        </>
                        : null}
                        {toSellerAccount.account != "" ? <>
                        <div className="pb-2 px-4 subText">{`To Seller (${
                          paymentDetails?.disputeDetails
                          ?.refundPercentage === "100" ? paymentDetails?.disputeDetails
                          ?.refundPercentage : (100 - Number(paymentDetails?.disputeDetails
                            ?.refundPercentage))
                        }%)`}</div>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                          <Col sm={24} md={12} lg={12}>
                            <div className="d-flex">
                              <Image src={bankAcc} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Account
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {toSellerAccount.account || ""}
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col sm={24} md={12} lg={12}>
                            <div className="d-flex">
                              <Image src={PaymentGray} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                 Amount
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {paymentDetails?.currency} {(toSellerAccount.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <hr className="lightgrayHr" /> 
                        </>
                        : null }
                        {toPlatformAccount.account != "" ? <>
                        <div className="pb-2 px-4 subText">To Platform</div>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                          <Col sm={24} md={12} lg={12}>
                            <div className="d-flex">
                              <Image src={bankAcc} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Account
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {toPlatformAccount.account || ""}
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col sm={24} md={12} lg={12}>
                            <div className="d-flex">
                              <Image src={PaymentGray} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                 Amount
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {paymentDetails?.currency} {(toPlatformAccount.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <hr className="lightgrayHr" /> 
                        </>
                        : null }
                        {toAdvisorAccount.account != "" ? <>
                        <div className="pb-2 px-4 subText">To Advisor</div>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                          <Col sm={24} md={12} lg={12}>
                            <div className="d-flex">
                              <Image src={bankAcc} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                  Account
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {toAdvisorAccount.account || ""}
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col sm={24} md={12} lg={12}>
                            <div className="d-flex">
                              <Image src={PaymentGray} alt="user" preview={false} />
                              <div className="mx-3">
                                <div className="stepDetails_medium_sub">
                                 Amount
                                </div>
                                <div className="stepDetails_medium fw-400">
                                  {paymentDetails?.currency} {(toAdvisorAccount.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <hr className="lightgrayHr" /> 
                        </>
                        : null }
                        </> )
                      }
                      <div className="labelTab my-4">Attachments</div>
                        <div className="d-flex mb-4">
                          <Image src={Id} alt="id" preview={false} />
                          <div
                            className="px-3 subText_small fw-400 text-right mx-3 cursor"
                            onClick={() => {
                              if(paymentDetails?.disputeDetails?.file.includes(".pdf")){
                                setIsPDFView(true)
                                setImagUrl(paymentDetails?.disputeDetails?.file)
                             }
                             else{
                               openViewModal(
                                 paymentDetails?.disputeDetails?.file
                               );
                             }
                            }}
                          >
                          {paymentDetails?.disputeDetails?.file !== null ? <>
                            View
                            <Image
                              src={BlueEye}
                              alt="id"
                              className="px-2 pr-25"
                              preview={false}
                            />
                            </> : "-"}
                          </div>
                        </div>
                        {
                          disputeTransferStatus === "IN_PROGRESS" ? 
                            <Title level={5} style={{ marginBottom: "24px" }}>Dispute Transfers in Progress...</Title>
                          : null
                        }
                        {/* {
                          disputeTransferStatus === "FAILED" ? 
                          <Button
                            className="modal-button w-auto"
                            style={{ marginBottom: "24px" }}
                            onClick={() => {}}
                          >
                            Retry failed Transfers
                          </Button>
                          : null
                        } */}
                        {/* <div className="labelTab my-4">Authorizer remark</div> 
                        <div className="d-flex mb-4">
                          {/* <Image
                            src={Message}
                            alt="chat"
                            preview={false}
                            className="min-width-17"
                          />
                          <div className="px-3 subText_xs">
                            {paymentDetails.contractStatus !== "8" ||
                              "9" ||
                              ("10" && (
                                <LinkButton
                                  className="ms-2"
                                  // onclick={() => setRemarkModal(true)}
                                  children="Add Remarks"
                                />

                              ))}
                          </div>
                          {paymentDetails?.disputeDetails?.adminRemarks?.length === 0 ? '-' : (
                            <>
                              {paymentDetails?.disputeDetails?.adminRemarks.map(
                                (data: any, index: number) => {
                                  return (
                                    <div>{index + 1}.{" "}{data?.remarks_name}</div>
                                  );
                                }
                              )}
                            </>
                          )}
                        </div> */}
                        {paymentDetails?.disputeDetails?.isGenerated && disputeTransferStatus != "FAILED" ? (
                          false
                        ) : (paymentDetails?.isDispute ?
                          <Row className={userType === "SUPPORT_ENGINEER"?"d-none":"center_res relese-payment-row"}>
                            <Col span={24} className="dispute-control-btn-group">
                            <Button
                                className="rounded w-auto"
                                htmlType="submit"
                                onClick={() => {
                                  validateBank("releasepayment")
                                }}
                              >
                                Release Payment
                              </Button>
                              <Button
                                className="rounded_blue_outline w-auto"
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
                            </Col>
                          </Row> : ""
                        )}
                      </div>
                    ) : null}
                    </Card>
                    {vATransactions && (userType === "ADMIN" ||
                      userType === "TRUSTEE" ||
                      userType === "AUTHORIZER" ||
                      userType === "SENIOR_MANAGMENT") &&
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
                                      Account type
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
                                    height={20}
                                    width={20} />
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
                                      Account no
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
                            <div className="d-flex mb-4">
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
                                className="rounded_cancel_btn mx-3 mt-0"
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
                    {paymentDetails.isContractVerify ? (
                      <Card className="px-4 my-4">
                        <div className="stepDetails my-4">Contract status</div>
                        {paymentDetails?.milestoneList?.map((milestone: any, index: number) => ( milestone?.isTransactionVerified ? (<>
                        <div className="stepDetails_medium_sub">
                          {milestone?.name} transaction status & reason
                        </div>
                        <div className="status my-2">
                          {paymentDetails.contractStatus != "-1" ? (
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
                        <div className="subText_xs">
                          {milestone?.reasonComment}
                        </div>
                        {paymentDetails?.milestoneList?.length > 1 && index < paymentDetails?.milestoneList?.length-1 && <hr className="lightgrayHr" />}
                          </> ) : null ))}
                      </Card>
                    ) : null}
                  </div>
              </Col>
              {Width >= 991 ? 
              <Col xs={24} sm={24} md={24} lg={8} className="mb-4">
                <Card className="px-2 detailsCard h-auto stages-timeline-card">
                  <div className="stepDetails mb-4 mt-2 mx-2">Stages</div>
                  <EscrowTransationHistorySteps
                    screen={'disputDetails'}
                    contractHistory={contractHistory}
                    contractDetail={contractDetail}
                    paymentDetails={paymentDetails}
                    taxDetails={taxDetails}
                  />
                </Card>
              </Col> : ""}
            </Row>
          </DefaultLayout>
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
            isverifyVisible={isPDFView}
            setverifyVisible={setIsPDFView}
            imagUrl={imagUrl}
            setImagUrl={setImagUrl}
          />}
          <Modal
            open={isVerifyModal}
            onCancel={() => {
              setIsVerifyModal(false);
            }}
            footer={false}
            title={
              <span
                className={
                  modalHeader == "Approve Contract"
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
                  <Button className="modal-button" htmlType="submit">
                    Submit
                  </Button>
                  <Button
                    className="modal-button-cancel mx-3"
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
            className="modal-box"
            width={500}
            destroyOnClose={true}
            onCancel={() => handleCancel()}
            open={isverifyVisible}
            footer={false}
          >
            <Form
              scrollToFirstError
              onFinish={onFinish}
              form={form}
              {...layout}
              className={`w-100 ${buttonRequired}`}
            >
              {showRejectReason && (
                <Form.Item
                  labelCol={{ span: 24 }}
                  name="rejectReason"
                  label="Please enter reason for rejection"
                  className={`w-100 ${buttonRequired}`}
                  rules={[
                    {
                      required: true,
                      message: "Please enter reason for rejection!",
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    className="w-100"
                    placeholder="Type your reason here..."
                  />
                </Form.Item>
              )}
              {showRejectReason ? (
                <div className="text-center">
                  <MainButtonRound
                    key="submit"
                    htmlType="submit"
                    children="Submit"
                  />
                </div>
              ) : (
                <div
                  className={`d-flex justify-content-center mt-4  ${buttonRequired}`}
                >
                  <SecondaryOutLineButton
                    key="reject"
                    onClick={() => setShowRejectReason(true)}
                    children="Reject"
                    className="me-3"
                  />
                  <MainButtonRound
                    key="accept"
                    onClick={() => handleApprove()}
                    children="Approve"
                    className="theme-button"
                  />
                </div>
              )}
            </Form>
          </Modal>
        </div>
        );
};

        export default DisputeDetails;
