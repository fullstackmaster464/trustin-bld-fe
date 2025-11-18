import { NormalText, AuthTitle } from "../ui-elements/TextRepo";
import {
  Breadcrumb,
  Card,
  Col,
  Descriptions,
  Divider,
  Radio,
  Row,
  Button,
  Modal,
  message,
  Image,
  notification,
  Spin,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  // addFundsEmailToApprover,
  assignTrustee,
  blockOrUnblockFunds,
  checkoutRazorpayPayment,
  checkoutWireTransfer,
  confirmRazorpayPayment,
  emailAfterOnlinePayment,
  getCitiesList,
  getContractListByContractStatus,
  getWalletTotalAmountAndCount,
  getlocalBankDetails
} from "../../services/user";
import Logo from "../../assets/img/Logo.svg";
import rejected from "../../assets/modals/rejected.gif";
import SuccessFund from "../../assets/img/Successpopupicon.svg";
import SuccessIcon from "../../assets/img/success_icon.svg";
import InprogressIcon from "../../assets/img/in-progress.svg";
import FailedIcon from "../../assets/img/failed.svg";
import {
  PLATFORM_CHARGE_TYPE,
  USER_TYPE_TEXT,
  getLocalStorage,
  moneyFormat,
  ordinalSuffixOf,
} from "../Common/Constants";
import { getPaymentDetails, getPaymentMethodsList, getTransactionLinkList, virtualAccountDetails } from "../../services/admin";
import { MainButtonRound } from "../ui-elements/ButtonRepo";
import {
  Dashboard,
  TransactionDetail,
  WireTransfer,
  NetBankPayment,
} from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import DefaultLayout from "../Common/DefaultLayout";
// import { LoadingOutlined } from "@ant-design/icons";
import { addFundsByUser } from "../../services/transaction";
// import Alerts from "../utilities/Alert";
import { CalculateTransactionFee } from "../Common/InvoiceCalculations";
import TransactionAlert from "./TransactionAlert";

const MakePayment = ():any => {
  const [paymentData, setPaymentData] = useState<any>({});
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [payDetail, setPayDetail] = useState<any>({}); 
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<any>("Bank Transfer");
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [activePayment, setActivePayment] = useState(0);
  const [loading, setLoading] = useState(false);
  const [virtualAccountsDetails, setVirtualAccountsDetails] = useState<any>([]);  
  const [bankAccountDetails, setBankAccountDetails] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [contractList, setContractList] = useState([]);
  const [emailSentModal, setEmailSentModal] = useState(false);
  // const [emailSentFailureModal, setEmailSentFailureModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockFailureModal, setBlockFailureModal] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [walletAmountAndCount,setWalletAmountAndCount] = useState<any>({})
  const [addFundModal, setAddFundModal] = useState<any>(false);
  const [activeTransaction, setActiveTransaction] = useState<any>();
  const [fundAddedSuccessModal, setFundAddedSuccessModal] = useState<any>(false)
  const [invoiceCal, setInvoiceCal] = useState<any>([]);
  const [milestoneCal, setmilestoneCal] = useState<any>([]);
  const navigate = useNavigate();
  const contractId = window?.location?.pathname.split("/").pop();
  const [alertStatus, setAlertStatus] = useState<any>();
  const [txnMessage, setTxnMessage] = useState("");
  const [txnStatus, setTxnStatus] = useState("");
  const [confirmBtn, setConfirmBtn] = useState<boolean>(false);
  const [isFirstMilestone, setIsFirstMilestone] = useState<boolean>(false);
  const [addFundmsg, setAddFundmsg] = useState("");
  const local = getLocalStorage("auth");
  const entityType = local ? JSON.parse(local)?.entityType : "";
  const location = useLocation();
  const [copySuccess, setCopySuccess] = useState('');
  const [ requiredAmount, setRequiredAmount ] = useState<any>();
  // eslint-disable-next-line prefer-const
  let {responseStatus,responseMessage, txnRefNumber } = location.state || {};


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 1500); 
      },
      () => {
        setCopySuccess('Failed to copy!');
      }
    );
  };


  const openNotification = (msg = "") => {
    notification.info({
      message: "Error",
      description: msg ? msg : "Try again later!",
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    });
  };

  useEffect(() => {
    const status = responseStatus === '200' || responseStatus === '000' ? "success" : 
                 responseStatus === '199' || responseStatus === '210' ? "warning" : "error"
    setAlertStatus(status);
    if(responseStatus === '404') {
        setTxnMessage("Couldn't fetch transaction details. Please contact administrator for more details")
    } else {
      const getTxnStatus = responseStatus === '200' || responseStatus === '000' ? "In-progress" : 
                  responseStatus === '199' || responseStatus === '210' ? "Pending" : "Failed"
      setTxnStatus(getTxnStatus);
      responseMessage = responseStatus == '000' ? "Transaction has been successfully done." : responseMessage
      setTxnMessage(responseMessage);
    } 
  }, [location?.state]);

  useEffect(() => {
    setActivePayment(paymentData?.milestoneList?.length);
    const milestones = paymentData?.milestoneList;

    for (let i = 0; i < milestones?.length; i++) {
      if (milestones[i]?.paymentStatus == null || milestones[i]?.paymentStatus === "INPROGRESS" || milestones[i]?.paymentStatus === "ACTIVE" || milestones[i]?.paymentStatus === "INACTIVE") {
        setActivePayment(i);
        break;
      }
    }
    if (paymentData && paymentData?.contractStatus === "2") {
      getContractListByContractStatus(userAlias, paymentData?.contractStatus)
        .then((response) => {
          if (response?.data.length > 0) {
            setContractList(response?.data);
          }
        })
        .catch((error) => {
          console.log('makepayment::::::::::errror: ',error);
        });
    }


    getWalletTotalAmountAndCount(userAlias, paymentData?.currency)
      .then((response) => {
        setWalletAmountAndCount(
            response.data?.walletTransaction
        );
      }).catch((error) => {
        if(error?.status === 404) {
          setWalletAmountAndCount({"balanceAmount": 0})
        }else if (error?.data?.message) {
          openNotification(error.data.message);
        } else if (error?.data) {
          const errorMsg: any = error?.data[0]?.message;
          openNotification(errorMsg);
        } else if (error?.error) {
          openNotification(error.error);
        } else {
          openNotification("Internal server error");
        }
      });
    
    if(paymentData?.milestoneList) {
      const transaction = paymentData?.milestoneList?.filter((item: any) => item.isActive === true)?.[0];
      setActiveTransaction(transaction);
    }
    if(paymentData?.aliasName) {
      getTransactionDetails(paymentData, paymentData?.aliasName, paymentData?.invoiceAmount);
      paymentData.milestoneList?.map((item: any) => {
        if(item?.buyerTransactionAmount === null && item?.totalTransactionAmount === null) {
          getTransactionDetails(paymentData, item?.aliasName, item?.transactionAmount);
        }
      })
    }
  }, [paymentData]);

  const milestoneAmount: any = [];
  const getTransactionDetails = async(paymentDetails: any, txnAlias: any, txnAmount: any) => {
    const data = CalculateTransactionFee({
      invoiceAmount: paymentDetails?.invoiceAmount,
      transactionAmount: txnAmount, 
      plateformFees: paymentDetails?.platformCharge, 
      platformChargeType: paymentDetails?.platformChargeType ? paymentDetails?.platformChargeType : PLATFORM_CHARGE_TYPE.PERCENT, 
      vatCharges: paymentDetails?.vatCharges, 
      buyerPercent: paymentDetails?.buyerPercent, 
      sellerPercent: paymentDetails?.sellerPercent, 
      hasAdvisor: paymentDetails?.escrowAdvisorAlias && ![paymentDetails?.buyerAlias,paymentDetails?.sellerAlias].includes(paymentDetails?.escrowAdvisorAlias),
      escrowCommission: paymentDetails?.escrowAdvisorCommission,
      buyerCommissionPercent: paymentDetails?.buyerCommissionPercent,
      sellerCommissionPercent: paymentDetails?.sellerCommissionPercent,
      minimumPlatformCharge: paymentDetails?.minimumPlatformCharge,
      entityType: paymentDetails?.itemCategoryEntityType 
    })
    if(paymentData?.aliasName == txnAlias) {
      if(payDetail?.payAmount === null) {
        payDetail.payAmount = data?.buyerAmount
      }
      setInvoiceCal(data)
    } else{
      milestoneAmount[txnAlias] = data;
      setmilestoneCal(milestoneAmount)
    }
  }

  function loadScript(src: any) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const amount = payDetail.payAmount.toFixed(2) * 100; //inr*100 in paisa
    const currency = payDetail.currency;
    const name = "";
    const description = "web_order";
    const email = "";
    const mobile = "";
    let receipt = "";
    for (let i = 0; i < payDetail.transactionAlias.length; i++) {
      if (receipt == "") {
        receipt = receipt + payDetail.transactionAlias[i];
      } else {
        receipt = receipt + "," + payDetail.transactionAlias[i];
      }
    }
    receipt = payDetail.contractAlias + "::" + receipt;

    const paymentMethod = selectedPaymentOption; //based on user selection

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const checkoutRequestObj = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      paymentMethod: paymentMethod,
    };

    const checkOutResponse = await checkoutRazorpayPayment(checkoutRequestObj);
    if (!checkOutResponse.data) {
      alert("Server error. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_0Aicw0RU9dNeRp", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: name,
      description: description,
      image: { Logo },
      order_id: checkOutResponse.data.id,
      handler: async function (responseV2: any) {
        const data = {
          orderCreationId: checkOutResponse.data.id,
          razorpayPaymentId: responseV2.razorpay_payment_id,
          razorpayOrderId: responseV2.razorpay_order_id,
          razorpaySignature: responseV2.razorpay_signature,
          receipt: receipt,
        };

        const confirmResponse = await confirmRazorpayPayment(data);
        if (confirmResponse.data) {
          assignTrustee({
            contract_id: payDetail.contractAlias,
            userType: "TRUSTEE",
            active: "active",
          }).then(() => {});
          message.success("Funds are added successfully!");
          emailAfterOnlinePayment(location?.state?.contractid)
            .then(() => {})
            .catch((error) => {
              console.log("Error!", error);
            });
          setTimeout(() => {
            navigate(Dashboard);
          }, 2000);
        } else {
          message.error("Something went wrong!");
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: mobile,
      },
      notes: {
        address: "NA",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  }
  useEffect(() => {
    setLoading(true);
    
    getPaymentDetails(location?.state?.contractid)
      .then((response) => {
        setLoading(false);
        setPaymentData(response.data);        
        const txnAliasList: any = [];
        let payAmount: any;
        let amount = 0;
        let checkCompletedPayment = false;
        response?.data?.milestoneList?.map((txn: any) =>{
          if(txn?.paymentStatus === "COMPLETED" && !checkCompletedPayment){
            checkCompletedPayment = true;
          }
          txnAliasList.push(txn.aliasName)
        });
        if(!checkCompletedPayment && response?.data?.depositeFullFund) {
          setConfirmBtn(false);
          payAmount = response?.data?.buyerTotalAmount;
          amount = response?.data?.invoiceAmount;
          setIsFirstMilestone(true);
        } else {
          const milestone = response?.data?.milestoneList?.find((milestone: any) => milestone?.isActive === true)
          payAmount = milestone?.buyerTransactionAmount
          amount = milestone?.transactionAmount;
          
        }
        setPayDetail({
          invoiceAmount: amount,
          payAmount: payAmount,
          currency: response.data.currency,
          paymentFor: "",
          transactionAlias: txnAliasList,
          contractAlias: response.data.aliasName,
          agreementId: response.data.agreementId,
          platformCharge: response.data.platformCharge,
          platformChargeType: response.data.platformChargeType,
          paymentMethod: selectedPaymentOption,
          buyerDetail: location.state.buyerDetail,
        });
        return response.data.currency;
      })
      .then(async (currency :string)=>{
          try {
              await getPaymentMethods(currency);
            } catch (error) {
              setLoading(false);
              const errorMessage = "Failed to load payment methods";
              openNotification(errorMessage);
            }
      })
      .catch((error) => {
        setLoading(false);
        if (error?.data?.message) {
          openNotification(error.data.message);
        } else if (error?.data) {
          const errorMsg: any = error?.data[0]?.message;
          openNotification(errorMsg);
        } else if (error?.error) {
          openNotification(error.error);
        } else {
          openNotification("Internal server error");
        }
        console.log("Error", error);
      });
      getlocalBankDetails(userAlias).then((response) => {
        if (response?.data?.bankDetails) {
          const bankDetails = response.data.bankDetails.find((elem:any) => elem.isPrimary);
          if (bankDetails) {
            setBankAccountDetails(bankDetails);
          }
        }
      }).catch(err => {
        console.log("Error!", err);
      }) 
  }, [location?.state?.contractid]);

  useEffect(()=> {
  if(userAlias && paymentData?.currency) {
    virtualAccountDetails(userAlias, paymentData?.currency)
      .then((response) => {
        setVirtualAccountsDetails(response?.data?.VADetails);
        getCountryName(response?.data?.VADetails?.address?.countryCode);
      })
      .catch((error) => {
        const errorMessage = error?.data?.message || error?.data?.[0]?.message || error?.error || "Internal server error";
        openNotification(errorMessage);
      });
    }
  }, [userAlias,paymentData])

  const getPaymentMethods = async(currency :string) => {
    try {
      
      const paymentList = await getPaymentMethodsList();
      if(paymentList?.data?.data && paymentList?.data?.data?.length > 0 ) {
        let filteredMethods = paymentList.data.data;
        if ((entityType === "COMPANY" && process.env.ENABLE_UAEPGS_CORPORATE_FLOW !== "true") || currency === "USD"){
            filteredMethods = paymentList.data.data.filter((method:any) => method.name !== 'Net Banking Transfer');
        }
        setPaymentOptions(filteredMethods);
      }
    } catch (error) {
      console.log("error", error);
      openNotification("NO PAYMENT OPTIONS FOUND");
    }
  }
 

  const handlePay = (
    paymentFor: any,
    payAmount: any,
    invoiceAmount: any,
    transactionAlias: any
  ) => {
    setPaymentMethod(true);
    if (transactionAlias.length === 1 || (paymentData?.depositeFullFund === true && isFirstMilestone)) {
      setPayDetail((prevState: any) => ({
        ...prevState,
        ...paymentData,
        payAmount: payAmount,
        invoiceAmount: invoiceAmount,
        paymentFor: paymentFor,
        transactionAlias: transactionAlias[0],
        paymentMethod: selectedPaymentOption,
      }));
    } else {
      setPayDetail((prevState: any) => ({
        ...prevState,
        ...paymentData,
        payAmount: payAmount,
        invoiceAmount: invoiceAmount,
        paymentFor: paymentFor,
        transactionAlias: transactionAlias,
        paymentMethod: selectedPaymentOption,
      }));
    }
  };
  const getCountryName = (code: any) => {
    let name = "";
    getCitiesList(code)
      .then((response) => {
        if (response?.status === 200) {
          name = response.data.citiesList[0]?.countryName ?? '';
          setCountryName(name);
        }
      })
      .catch((err) => {
        console.log('getCountryName:::::::>>>err: ',err);
      });
  };

  const choosePaymentOption = (e: any) => {
    setSelectedPaymentOption(e.target.value);
  };

  const goBack = () => {
    navigate(TransactionDetail + "/" + location?.state?.contractid);
  };
  const confirmPayment = async () => {
    const currentPath = location.pathname + location.search;
    localStorage.setItem('beforeReturnUrlPath', currentPath);

    if (selectedPaymentOption === "Online") {
      displayRazorpay();
    } else if (selectedPaymentOption === "Wire Transfer") {
      const requestBody = {
        amount: payDetail.payAmount.toFixed(2),
        paymentMethod: selectedPaymentOption,
        contractAlias: payDetail.contractAlias,
        transactions: payDetail.transactionAlias,
        currency: payDetail.currency,
      };
      checkoutWireTransfer(requestBody)
        .then((response) => {
          if (response?.status === 201 || response?.status === 200) {
            navigate(WireTransfer, {
              state: {
                payDetail: {
                  ...payDetail,
                  paymentMethod: selectedPaymentOption,
                  paymentLogId: response.data?.paymentLogId,
                },
              },
            });
          } else {
            message.error(response.data.message);
          }
        })
        .catch(() => {
          message.error("Something went wrong!");
        });
    } else if (selectedPaymentOption === "Bank Transfer") {
      let amount: any;
      if(paymentData?.depositeFullFund && isFirstMilestone) {
        amount = paymentData?.buyerTotalAmount || 0;
      } else {
        const response = await getTransactionLinkList(activeTransaction?.aliasName);
        const transactionLinks = response?.data?.VATransactionLinkList ?? [];
        const totalAmount = transactionLinks && transactionLinks?.length > 0 ? transactionLinks.reduce((sum: any, element: any) => sum + Number(element?.Amount || 0), 0) : 0;
        amount = (Number(activeTransaction?.buyerTransactionAmount) - Number(totalAmount)).toFixed(2) ;
      }
      if(Number(walletAmountAndCount?.availableAmount) >= Number(amount)) {
        setRequiredAmount(amount);
        setAddFundModal(true);
      } else if (virtualAccountsDetails[0]?.status) {
        showModal();
      } else {
        message.error("Something went wrong!");
      } 
    } else if (selectedPaymentOption === "Net Banking Transfer") {
      navigate(NetBankPayment + "/" + contractId, {
        state: {
          contractid: contractId,
          userAlias: userAlias,
          totalAmount: payDetail?.invoiceAmount,
          transactionId: activeTransaction?.aliasName
        }
      });
    } else {
      message.info(
        "Only wire transfer and Online payment is available for now. Stay tuned for other payment options!"
      );
    }
  };
  const paymentGrid2 = { lg: 10, md: 12, xs: 10 };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
    navigate(Dashboard);
  };
  const handleCancel = () => {
    setOpen(false);
  };


  const blockFunds = async (action: any) => {
    setLoading(true);
    await blockOrUnblockFunds(paymentData.milestoneList?.[0]?.aliasName, action)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          setLoading(false);
          setBlockModal(true);
          setTimeout(() => {
            navigate(TransactionDetail + "/" + location?.state?.contractid);
          }, 3000);
        }
      })
      .catch(() => {
        setLoading(false);
        setFailureMessage("Couldn't block adding funds to contract");
        setBlockFailureModal(true);
      });
  };
  
  const addFunds = async () => {
    setLoading(true);
    const buyerAmount = activeTransaction?.buyerTransactionAmount ?? milestoneCal[activeTransaction?.aliasName].buyerAmount
    await addFundsByUser(location?.state?.contractid, buyerAmount, activeTransaction?.aliasName)
    .then(() => {
      setLoading(false);
      setAddFundmsg("Fund added successfully");
      setAddFundModal(false);
      setFundAddedSuccessModal(true);
      setTimeout(()=>{
          navigate(TransactionDetail + "/" + location?.state?.contractid);
      },3000)
    })
    .catch((err: any) => {
      setLoading(false);
      message.error(err?.data?.error)
    })
  }

  const handleClick = () => {
    setSelectedPaymentOption("Bank Transfer");
  }

  return (
    <div className="scrollbar-container">
  <DefaultLayout
        page="dashboard"
        TitleText="Payment Summary"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        loading={loading}
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
                      <b> Payment Summary</b>
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
                          onClick={() => {
                            goBack();
                          }}
                          className="cursor"
                        >
                          Transaction Details
                        </Breadcrumb.Item>
                        <Breadcrumb.Item className="cursor">
                          Payment Summary
                        </Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
              >
              <Row gutter={16}>
                <div className="txn-message">
                  <Col md={6} xs={24} className="titleText mb-4 px-3">
                    {paymentData.agreementId}
                  </Col>
                  {/* <Col md={10} xs={24} className="txn-content">
                  <div>
                    {responseStatus && (
                        <Alerts
                          className="responsive"
                          showIcon
                          description={
                            <div className="stepDetails_medium">
                              {responseStatus !== '404' && ( <>
                                <p>Transaction Status : {txnStatus}</p>
                                <p>Transaction Reference No : {txnRefNumber}</p>
                              </>)}
                              <p>{txnMessage}</p>
                            </div>
                          }
                          type={alertStatus && alertStatus !== "" ? alertStatus : responseStatus === '404'? 'error' : 'info'}
                        />
                    )}
                  </div>
                  </Col> */}
                </div>
              </Row>
              {responseStatus && (
                    <TransactionAlert
                      icon={alertStatus === 'success' ? SuccessIcon : alertStatus === 'warning' ? InprogressIcon : FailedIcon}
                      alertType={alertStatus === 'success' ? "successful" : alertStatus === 'warning' ? "progress" : "failed" }
                      message={txnMessage}
                      status={txnStatus}
                      transactionRef={txnRefNumber}
                      copySuccess={copySuccess}
                      handleCopy={handleCopy}
                    />
                  )}

              {paymentData?.isMilestone && paymentData?.depositeFullFund === true && paymentData?.milestoneList[0].paymentStatus !== "COMPLETED" && userAlias === paymentData.buyerAlias &&( <>
                <div className="">
                  <div className="subText_xs w-100 paymentMethods pl-5">
                    <p>Note: Please deposite full fund before you start with first milestone as per {paymentData?.contractStartedBy === "BUYER" ? 'buyer' : 'seller'} request.</p>
                  </div>
                </div>
                </>
              )}
              <Row gutter={16} className="paymentSummery">
                <Col md={14} xs={24} className="mb-2">
                {moneyFormat(
                        paymentData?.currency,
                        parseFloat(paymentData?.totalPayment)
                      ) ? <Card className="grayCard p-4">
                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        Agreement Amount
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {moneyFormat(
                          paymentData.currency,
                          paymentData.invoiceAmount
                        )}
                      </div>
                    </div>
                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        Total TrustIn Fees{" "}
                        {`(${invoiceCal.platformPercent}) + ${paymentData.vatCharges ?? process.env.COUNTRY_VAT}% VAT`}
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {moneyFormat(
                          paymentData.currency,
                          Number(invoiceCal?.platformFee)
                        )}
                        +
                        {moneyFormat(
                          paymentData.currency,
                          Number(invoiceCal?.vatFee)
                        )}
                      </div>
                    </div>
                    {(paymentData?.contractStartedBy === USER_TYPE_TEXT?.ESCROW_ADVISOR || (paymentData?.escrowAdvisorAlias && ![paymentData?.buyerAlias,paymentData?.sellerAlias].includes(paymentData?.escrowAdvisorAlias)) ) && (<>
                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        Transaction fees for escrow advisor
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {moneyFormat(
                          paymentData?.currency,
                          (Number(paymentData?.escrowAdvisorCommission || 0)).toFixed(2)
                        )}
                      </div>
                    </div>
                    <div className="endtoend py-2">
                    <div className="stepDetails_medium_sub">
                    Escrow advisor fees to be paid by buyer ({Number(paymentData?.buyerCommissionPercent || 0)}%)
                    </div>
                    <div className="subText_small fw-400 text-right">
                      {moneyFormat(
                        paymentData?.currency,
                        invoiceCal.buyerAdvisorFee
                      )}
                    </div>
                  </div> </>
                    )}
                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        TrustIn platform fees to be paid by buyer ({paymentData?.buyerPercent}%)
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {moneyFormat(
                          paymentData.currency,
                          invoiceCal?.buyerTransactionFee ? invoiceCal?.buyerTransactionFee : 0
                        )}
                      </div>
                    </div>
                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        Discount on trustIn platform fees if added in one time
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {moneyFormat(
                          paymentData.currency,
                          paymentData.discountFee
                        )}
                      </div>
                    </div>
                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        Amount to be transferred to Escrow Account
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {moneyFormat(
                          paymentData.currency,
                          paymentData?.buyerTotalAmount !== null ? Number(paymentData?.buyerTotalAmount) : invoiceCal?.buyerAmount ? invoiceCal?.buyerAmount : 0
                        )}
                      </div>
                    </div>
                    <hr className="lightgrayHr" />
                    {(paymentData?.milestoneList && paymentData?.milestoneList.length > 0 && paymentData?.milestoneList?.filter(
                      (item: any) => item.paymentStatus && item.paymentStatus === "COMPLETED")?.length === 0) && (
                    <>
                      <div className="endtoend py-2">
                        <div className="subText_small fw-400">
                          Total amount to be added
                        </div>
                        <div className="subText_small fw-400 text-right">
                          {moneyFormat(
                            paymentData.currency,
                            paymentData?.buyerTotalAmount !== null ? Number(paymentData?.buyerTotalAmount) : invoiceCal?.buyerAmount ? invoiceCal?.buyerAmount : 0
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        {(alertStatus && alertStatus !== null ? alertStatus === "error" ? true : false : true ) && ( <>
                          {userAlias === paymentData?.buyerAlias && userType === "USER" && contractList && contractList.length > 1 && (
                          <>
                            <Button
                              type="primary"
                              className="modal-button-cancel  my-2 mx-2"
                              onClick={() => blockFunds("BLOCK")}
                            >
                              Block
                            </Button>
                          </>
                          )}
                          <Button
                            type="primary"
                            className="outline-button my-2 mx-2"
                            onClick={() =>
                              handlePay(
                                "Total Amount",
                                paymentData?.buyerTotalAmount !== null ? Number(paymentData?.buyerTotalAmount) : invoiceCal?.buyerAmount ? invoiceCal?.buyerAmount : 0,
                                paymentData.invoiceAmount,
                                paymentData.milestoneList?.map(
                                  (txn: any) => txn.aliasName
                                )
                              )
                            }
                          >
                            Confirm
                          </Button>
                        </> )}
                      </div>
                      <hr className="lightgrayHr" />
                    </>
                    )}
                    {(alertStatus && alertStatus !== null ? alertStatus === "error" ? true : false : true ) && (paymentData?.isMilestone && (!paymentData?.depositeFullFund || isFirstMilestone === false)) && (
                      <>
                        <Row gutter={16} className="payment-summary d-flex justify-content-between align-items-center">
                          {paymentData.milestoneList?.map(
                            (item: any, index: any) => {
                              return (
                                <Row key={index} className="display-contents">
                                  <Col  md={14} xs={24} className="align-self-center mb-4">
                                    <NormalText className="m-0 stepDetails_medium_sub">{`${ordinalSuffixOf(
                                      index + 1
                                    )} Milestone amount to be added`}</NormalText>
                                  </Col>
                                  <Col
                                    {...paymentGrid2}
                                    md={14} xs={24}
                                    className="d-flex justify-content-between mb-4"
                                  >
                                    <NormalText className="subText_small fw-400 text-right m-1 align-self-center noWrap">
                                      {moneyFormat(
                                        paymentData.currency,
                                        item?.buyerTransactionAmount !== null ? item?.buyerTransactionAmount : Number(milestoneCal[item.aliasName].buyerAmount)
                                      )}
                                    </NormalText>
                                    <Button
                                      type="primary"
                                      className={`modal-button ${!(index === activePayment) || confirmBtn ? 'disabled' : ''}`}
                                      disabled={!(index === activePayment) || confirmBtn}
                                      onClick={() =>
                                        handlePay(
                                          `${ordinalSuffixOf(
                                            index + 1
                                          )} Milestone`,
                                          activeTransaction?.buyerTransactionAmount !== null ? activeTransaction?.buyerTransactionAmount : Number(milestoneCal[item?.aliasName]?.buyerAmount),
                                          item.transactionAmount,
                                          [item.aliasName]
                                        
                                        )}
                                      >
                                      Confirm
                                    </Button>
                                  </Col>
                                </Row>
                              );
                            }
                          )}
                        </Row>
                      </>
                    )}
                  </Card>:<Spin className="mainloader spinner" />}
                </Col>
                <Col md={10} xs={24} className="mb-2">
                  <Card className="payment-options h-100 payment-card paymentMethods p-4">
                    <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={10} className="availableFunds-col">
                        <div className="subText_small fw-light ">Available funds</div>
                        <div className="subText ms-auto">
                          {moneyFormat(
                            paymentData.currency,
                            (parseFloat(Number(walletAmountAndCount?.availableAmount) > 0 ? walletAmountAndCount?.availableAmount : 0).toFixed(2))
                          )}
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={14} className="addFundsBtn-col" >
                        <Button className="addFundsBtn break h-auto" onClick={handleClick} disabled>
                          +Add Funds to Escrow Account
                        </Button>
                      </Col>
                    </Row>
                    {((alertStatus && alertStatus !== null ? alertStatus === "error" ? true : false : true ) && (!paymentData?.milestoneList?.filter((item: any) => item.paymentStatus === "COMPLETED")?.length &&
                      userAlias === paymentData?.buyerAlias &&
                      userType === "USER" &&
                      contractList &&
                      contractList.length > 1) || paymentMethod) &&<>
                      <Divider />
                      <Radio.Group className="w-100" value={selectedPaymentOption}>
                          {paymentOptions?.map((item: any) => {
                            return (
                              <>
                                {item?.name === "Bank Transfer" ? (<>
                                  <Radio
                                    value={item.name}
                                    className="w-100 paymentOption"
                                    onClick={choosePaymentOption}
                                  >
                                    <div className={`subText_small my-2 ${selectedPaymentOption === item?.name ? "fw-medium" : "fw-light"}`}>
                                      By {item.name}

                                      
                                    </div>
                                    </Radio>
                                    {selectedPaymentOption === "Bank Transfer" && (
                                      <p className="subText_xs ps-4 text-black iban-text">
                                        <span>IBAN No: </span>
                                        {virtualAccountsDetails[0]?.iban}
                                      </p>
                                    )}
                              </>):(<>
                                <Radio
                                    value={item.name}
                                    className="w-100 paymentOption"
                                    onClick={choosePaymentOption}
                                  >
                                    <div className={`subText_small my-2 ${selectedPaymentOption === item?.name ? "fw-medium" : "fw-light"}`}>
                                      By {item.name}
                                    </div>
                                    </Radio>
                              </>)}
                              </>
                            );
                          })}
                      </Radio.Group>
                      {selectedPaymentOption === "Net Banking Transfer" && (
                         <div className="">
                         <div className="subText_xs w-100 paymentMethods pl-5">
                           <p>Note: Extra charge of {process.env.UAEPGS_PLATFORM_FEE} {paymentData?.currency} + {process.env.COUNTRY_VAT}% vat is applied on selecting net banking transfer.</p>
                         </div>
                       </div>
                      )
                      }
                      <Divider />
                      <div className="titleText mb-4">
                        {moneyFormat(
                          payDetail?.currency,
                          payDetail?.payAmount
                        )}
                      </div>
                      <div className="makePayment d-flex justify-content-start align-items-center w-50">
                        <MainButtonRound
                          children="Make Payment"
                          className="w-100 makepayment-button"
                          onClick={() => confirmPayment()}
                        />
                      </div>
                    </>}
                  </Card>
                </Col>
              
              </Row>
              </DefaultLayout>
        <Modal
          open={emailSentModal}
          onCancel={() => setEmailSentModal(!emailSentModal)}
          footer={false}
          width={410}
          className="modal-box"
        >
          <>
          <div className="text-center p-3">
          <div className="mb-4">
            <Image src={SuccessFund} alt="" height={"80px"} preview={false} />
          </div>
            <AuthTitle
              children="Email sent successfully to approver."
              className="text-center"
            />
            </div>
          </>
        </Modal>
        {/* <Modal
          open={emailSentFailureModal}
          onCancel={() => setEmailSentFailureModal(!emailSentFailureModal)}
          footer={false}
          width={410}
          className="modal-box"
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
          {failureMessage === "" ? (
            <AuthTitle children="Couldn't add funds to contract" />
          ) : (
            <AuthTitle children={failureMessage} className="text-center" />
          )}
        </div>
        </Modal> */}
        <Modal
          open={blockModal}
          onCancel={() => setBlockModal(!blockModal)}
          footer={false}
          width={410}
          className="modal-box"
        >
          <>
          <div className="text-center p-3">
          <div className="mb-4">
            <Image src={SuccessFund} alt="" height={"80px"} preview={false} />
          </div>
          <AuthTitle
            children="Successfully blocked adding funds to contract"
            className="mt-4"
          />
        </div>
          </>
        </Modal>
        <Modal
          open={blockFailureModal}
          onCancel={() => setBlockFailureModal(!blockFailureModal)}
          footer={false}
          width={410}
          className="modal-box"
        >
          <>
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
            {failureMessage === "" ? (
              <AuthTitle children="Couldn't block adding funds to contract" />
            ) : (
              <AuthTitle children={failureMessage} className="text-center" />
            )}
          </div> 
         </>
        </Modal>
        <Modal
            title={
              <div
                className="d-flex escrow_title titleText"
                style={{ alignItems: "center", gap: "5px" }}
              >
                {/* <BankOutlined
                  style={{
                    display: "inline",
                    position: "relative",
                    fontSize: "25px",
                    paddingRight: "10px",
                  }}
                /> */}
                Add Funds
              </div>
            }
            open={addFundModal}
            onOk={()=>setAddFundModal(false)}
            onCancel={()=>setAddFundModal(false)}
            okButtonProps={{
              disabled: false,
            }}
            footer={false}
            width={540}
            // className="modal-box"
          >
            <div className="endtoend py-2">
              <div className="stepDetails_medium_sub">
                Available balance in escrow account
              </div>
              <div className="subText_small fw-400 text-right">
                {moneyFormat(
                  paymentData?.currency,
                  parseFloat(walletAmountAndCount?.availableAmount).toFixed(2)
                )}
              </div>
            </div>
            <div className="endtoend py-2">
              <div className="stepDetails_medium_sub">
                Funds to be added to the contract
              </div>
              <div className="subText_small fw-400 text-right">
                {moneyFormat(
                  paymentData?.currency,
                  requiredAmount ?? activeTransaction?.buyerTransactionAmount
                )}
              </div>
            </div>
            <Row className="center_res">
            <div className="d-flex mt-5 mb-3">
              <Button className="rounded mt-0" onClick={() => addFunds()} loading={loading}>
                Add Funds
              </Button>
              <Button
                className="rounded_cancel_btn mx-3 mt-0"
                onClick={() => {
                  setAddFundModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Row>
          </Modal>
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
            children={addFundmsg !== "" && addFundmsg !== null ? addFundmsg : "Fund added successfully"}
            className="text-center"
          />
          
        </div>
      </Modal>
        <>
          {/* <Button type="primary" onClick={showModal}>
          Open Modal with customized button props
        </Button> */}
          {/* <CheckCircleFilled /> */}
          <Modal
            title={
              <div
                className="d-flex escrow_title titleText"
                style={{ alignItems: "center", gap: "5px" }}
              >
                {/* <BankOutlined
                  style={{
                    display: "inline",
                    position: "relative",
                    fontSize: "25px",
                    paddingRight: "10px",
                  }}
                /> */}
                Escrow Account Details
              </div>
            }
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{
              disabled: false,
            }}
            footer={false}
            width={540}
            // className="modal-box"
          >
            <div className="mt-4">
              <div className="info subText_xs">
                <p className="m-0">Please add funds to the following escrow account.</p>
              </div>
            </div>
            <Descriptions
              layout="vertical"
              className="pt-4"
              column={2}
            >
              <Descriptions.Item label="Name on the Bank Account">
                <p className="subText_xs" >{virtualAccountsDetails[0]?.name}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Bank Name">
                <p className="subText_xs">{bankAccountDetails?.institutionName ?? 'Emirates ENBD'}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Account No">
                <p className="subText_xs">{virtualAccountsDetails[0]?.number}</p>
              </Descriptions.Item>
              <Descriptions.Item label="IBAN No">
                <p className="subText_xs">{virtualAccountsDetails[0]?.iban}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Swift Code">
                <p className="subText_xs">{bankAccountDetails?.routingCode || "--"}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                <p className="subText_xs">{countryName || virtualAccountsDetails[0]?.address?.countryCode || "--"}</p>
              </Descriptions.Item>
            </Descriptions>

            <div className="modalFooter">
              <Button
                type="default"
                className="reject_btn accept_btn"
                onClick={() => handleOk()}
              >
                Ok
              </Button>
            </div>
          </Modal>
        </>
    </div>
  );
};
export default MakePayment;
