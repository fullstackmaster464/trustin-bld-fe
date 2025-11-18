import { AuthTitle } from "../ui-elements/TextRepo";
import {
  Card,
  Col,
  Divider,
  Radio,
  Row,
  Button,
  Modal,
  message,
  Image,
  notification,
  Spin,
  Descriptions,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getlocalBankDetails,
  getWalletTotalAmountAndCount
} from "../../services/user";
import SuccessFund from "../../assets/img/Successpopupicon.svg";
import {
  getLocalStorage,
  moneyFormat
} from "../Common/Constants";
import { getPaymentMethodsList, virtualAccountDetails } from "../../services/admin";
import { MainButtonRound } from "../ui-elements/ButtonRepo";
import { ChequeDetails, ChequeNetBanking, Cheques, } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import DefaultLayout from "../Common/DefaultLayout";
import { getChequeDetails, paymentInitiate } from "../../services/cheque";
import TransactionAlert from "../User/TransactionAlert";
import SuccessIcon from "../../assets/img/success_icon.svg";
import InprogressIcon from "../../assets/img/in-progress.svg";
import FailedIcon from "../../assets/img/failed.svg"; 


const AddFunds = (): JSX.Element => {

  const [paymentOptions, setPaymentOptions] = useState([]);
  const [paymentLoaded, isPaymentLoaded] = useState<boolean>(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<any>("Bank Transfer");
  
  const [loading, setLoading] = useState(true);
  const [virtualAccountsDetails, setVirtualAccountsDetails] = useState<any>([]);  
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  
  const [bankAccountDetails, setBankAccountDetails] = useState<any>({});
  const [walletAmountAndCount,setWalletAmountAndCount] = useState<any>({})
  const [addFundModal, setAddFundModal] = useState<any>(false);
  const [escrowFundModal, setEscrowFundModal] = useState(false);
  const [chequeDetail, setchequeDetail] = useState<any>();
  const [blockModal, setBlockModal] = useState(false);
  const [fundAddedSuccessModal, setFundAddedSuccessModal] = useState<any>(false)
  const [alertStatus, setAlertStatus] = useState<any>();
  const [txnMessage, setTxnMessage] = useState("");
  const [txnStatus, setTxnStatus] = useState("");
  const [copySuccess, setCopySuccess] = useState(''); 

  const navigate = useNavigate();
  const { chequeAlias } = useParams();
  const location = useLocation();
  const {responseStatus,responseMessage, txnRefNumber } = location.state || {};
  

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
  
  const handleOk = () => {
    setEscrowFundModal(false);
  };

  const handleCancel = () => {
    setEscrowFundModal(false);
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
      const resMessage = responseStatus == '000' ? "Transaction has been successfully done." : responseMessage
      setTxnMessage(resMessage);
    } 
  }, [location?.state]);

    

  useEffect(() => { 
    
    // Remove one payment option if chequeDetail.transactionType is "RECEIVE"
    if (chequeDetail?.transactionType === "RECEIVE" && paymentOptions.length > 1) {
      const filteredOptions = paymentOptions.filter((option: any) => option.name !== 'Net Banking Transfer');
      setPaymentOptions(filteredOptions);
    }
  }, [paymentLoaded,chequeDetail]);

  
  
  useEffect(() => {
    getPaymentMethodsList()
        .then((methodResponse: any) => {
          let filteredMethods = [];
          filteredMethods = methodResponse.data.data;
          
          setPaymentOptions(filteredMethods);
          isPaymentLoaded(true);
        })
        .catch((error) => {
          console.log("error", error);
          openNotification("NO PAYMENT OPTIONS FOUND");
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
            setBankAccountDetails({});
          }) 
        getChequeDetails(chequeAlias, userAlias)
          .then(async(chequeResponse: any) => {
           const cheque =  chequeResponse?.data;
           
           
            setchequeDetail(cheque);

            const aliasName = cheque?.transactionType !== "RECEIVE" ? cheque?.buyerAlias : cheque?.sellerAlias;
            const currency = cheque?.currency;
            virtualAccountDetails(aliasName, currency)
            .then((response) => {  
              
              setVirtualAccountsDetails(response?.data?.VADetails);
               getWalletTotalAmountAndCount(aliasName,currency)
              .then((response) => {
                setWalletAmountAndCount(response.data?.walletTransaction);
              })
              .catch((err: any) => {
                if(err.status == 404){
                  message.warning(err.data.error);
                }
              });
            })
            .catch((error : any) => {
              console.log("Error!", error);
              if(error.status == 404){
                message.warning(error.data.error);
              }
            });
            if(cheque?.isPaymentInitialized){
              setFundAddedSuccessModal(true)
            }
            
        }).finally(() => setLoading(false));
  },[]);
  
  const choosePaymentOption = (e: any) => {
    console.log(e.target.value)
    setSelectedPaymentOption(e.target.value);
  };

  const goBack = () => {
    navigate(ChequeDetails + "/" + chequeAlias);
  };

  const userData = JSON.parse(getLocalStorage("auth")!);
  
  const addFundBankTransfer = async () => {  
    if(!Object.keys(walletAmountAndCount).length || !walletAmountAndCount?.availableAmount) {
      // message.warning( "Insufficient fund!");
      setEscrowFundModal(true);
      return;
    }
    if(Number(chequeDetail?.buyerAmount) > Number(walletAmountAndCount?.availableAmount ?? 0)) {
      // message.warning( "Insufficient fund!" );
      setEscrowFundModal(true);
      return;
    }
    const currentPath = location.pathname + location.search;
    localStorage.setItem('beforeReturnUrlPath', currentPath);
    
    setAddFundModal(true);
  };
  
  const addFundByNetBankingTransfer = async () => {  
    navigate(Cheques + "/" + chequeAlias + ChequeNetBanking, {
      state: {
        chequeAlias: chequeAlias,
        userAlias: userAlias,
        totalAmount: chequeDetail?.invoiceAmount,
      }
    });
    
    const currentPath = location.pathname + location.search;
    localStorage.setItem('beforeReturnUrlPath', currentPath);
  };
  
  const addFunds = async () => {

    setLoading(true);
 

    const userAlias = chequeDetail?.transactionType === "RECEIVE"  ? chequeDetail?.sellerAlias : chequeDetail?.buyerAlias;
    const payLoad = {
      chequeAlias : chequeAlias,
      userAlias: userAlias,
      amount : chequeDetail?.buyerAmount,
      name : userData?.name
    };
    
 
    const response = await paymentInitiate(payLoad);
    setLoading(false);
    setAddFundModal(false);
    if (response?.status === 200 || response?.status == 201) {
      setFundAddedSuccessModal(true);
    }else{
      message.error("Something went wrong!");
    } 
  }
  
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
  
  return (
    <div className="">
    <DefaultLayout
        page="cheque"
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
                    </div>
                  </div>
                }
              >
              <Row gutter={16}>
                <div className="txn-message">
                  <Col md={6} xs={24} className="titleText mb-4 px-3">
                    {chequeDetail?.agreementId}
                  </Col> 
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

              <Row gutter={16} className="paymentSummery">
                <Col md={14} xs={24} className="mb-2">
                {moneyFormat(
                        chequeDetail?.currency,
                        parseFloat(chequeDetail?.buyerAmount)
                      ) ? <Card className="grayCard p-4">


                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        Name
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {virtualAccountsDetails[0]?.name}
                      </div>
                    </div>

                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        Number
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {virtualAccountsDetails[0]?.number}
                      </div>
                    </div>

                    <div className="endtoend py-2">
                      <div className="stepDetails_medium_sub">
                        IBAN
                      </div>
                      <div className="subText_small fw-400 text-right">
                        {virtualAccountsDetails[0]?.iban}
                      </div>
                    </div>
 
                      
                                        <div className="endtoend py-2">
                                          <div className="stepDetails_medium_sub">
                                            Agreement Amount
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
                                            Total TrustIn Fees{" "}
                                            {`(${chequeDetail?.platformFeePercent}) + ${chequeDetail?.vatChargePercent ?? process.env.COUNTRY_VAT}% VAT`}
                                          </div>
                                          <div className="subText_small fw-400 text-right">
                                            {moneyFormat(
                                              chequeDetail?.currency,
                                              Number(chequeDetail?.platformFee)
                                            )}
                                            +
                                            {moneyFormat(
                                              chequeDetail?.currency,
                                              Number(chequeDetail?.vatFee)
                                            )}
                                          </div>
                                        </div> 
                                        {
                                          chequeDetail?.transactionType === "RECEIVE" ? 
                                           <div className="endtoend py-2">
                                              <div className="stepDetails_medium_sub">
                                                TrustIn platform fees to be paid by seller
                                              </div>
                                              <div className="subText_small fw-400 text-right">
                                                {moneyFormat(
                                                  chequeDetail?.currency,
                                                  chequeDetail?.buyerFees ? chequeDetail?.buyerFees : 0
                                                )}
                                              </div>
                                            </div> : 
                                             <div className="endtoend py-2">
                                          <div className="stepDetails_medium_sub">
                                            TrustIn platform fees to be paid by buyer ({chequeDetail?.buyerFeesPercent}%)
                                          </div>
                                          <div className="subText_small fw-400 text-right">
                                            {moneyFormat(
                                              chequeDetail?.currency,
                                              chequeDetail?.buyerFees ? chequeDetail?.buyerFees : 0
                                            )}
                                          </div>
                                        </div>
                                        }
                                       
                                       
                                        <hr className="lightgrayHr" />  
                                      
  
                    <>
                    <div className="endtoend py-2">
                      <div className="subText_small fw-400">
                        Total amount to be added
                      </div>
                      <div className="subText_small fw-400 text-right">
                      {moneyFormat(
                          chequeDetail?.currency,
                          chequeDetail?.buyerAmount
                        )}
                      </div>
                    </div>
                    </>
                  </Card>:<Spin className="mainloader spinner" />}
                </Col>
                <Col md={10} xs={24} className="mb-2">
                  <Card className="payment-options h-100 payment-card paymentMethods p-4">
                    <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={10} className="availableFunds-col">
                        <div className="subText_small fw-light ">Available Funds</div>
                        <div className="subText ms-auto">
                          {moneyFormat(
                            chequeDetail?.currency,
                            (parseFloat(Number(walletAmountAndCount?.availableAmount) > 0 ? walletAmountAndCount?.availableAmount : 0).toFixed(2))
                          )}
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={14} className="addFundsBtn-col" >
                        {/* <Button className="addFundsBtn" onClick={handleClick} disabled>
                          +Add Funds to Escrow Account
                        </Button> */}
                      </Col>
                    </Row>
                      <>
                      <Divider />
                      <Radio.Group className="w-100 mb-4" value={selectedPaymentOption}>
                        {paymentOptions?.map((item: any, index: any) => {
                          return (
                            <div key={index}>
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
                                  {selectedPaymentOption === "Net Banking Transfer" && (
                                     <div className="">
                                     <div className="subText_xs w-100 paymentMethods pl-5">
                                       <p>Note: Extra charge of {process.env.UAEPGS_PLATFORM_FEE} {chequeDetail?.currency} + {process.env.COUNTRY_VAT}% vat is applied on selecting net banking transfer.</p>
                                     </div>
                                   </div>
                                  )
                                  }
                            </>)}
                            </div>
                          );
                        })}
                      </Radio.Group>
                      <div className="titleText mb-4 ml-25px">
                          {moneyFormat(
                            chequeDetail?.currency,
                            chequeDetail?.buyerAmount
                          )}
                        </div>
                      {responseStatus == null && !chequeDetail?.isPaymentInitialized ? <div className="makePayment">
                        <MainButtonRound
                          children="Make Payment"
                          className="w-100 "
                          onClick={() => {
                            if(selectedPaymentOption === 'Bank Transfer') {
                              addFundBankTransfer()
                            } else if (selectedPaymentOption === 'Net Banking Transfer') {
                              addFundByNetBankingTransfer()
                            }
                          }}
                        />
                      </div> : null 
                      }
                    </>
                  </Card>
                </Col>
              
              </Row>
              </DefaultLayout>
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
            open={escrowFundModal}
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
                <p className="subText_xs" >{virtualAccountsDetails?.length > 0 ? virtualAccountsDetails[0]?.name : "--"}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Bank Name">
                <p className="subText_xs">{bankAccountDetails?.institutionName ?? 'Emirates ENBD'}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Account No">
                <p className="subText_xs">{virtualAccountsDetails?.length > 0 ? virtualAccountsDetails[0]?.number : "--"}</p>
              </Descriptions.Item>
              <Descriptions.Item label="IBAN No">
                <p className="subText_xs">{virtualAccountsDetails?.length > 0 ? virtualAccountsDetails[0]?.iban : "--"}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Swift Code">
                <p className="subText_xs">{bankAccountDetails?.routingCode || "--"}</p>
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                <p className="subText_xs">{virtualAccountsDetails?.length > 0 ? virtualAccountsDetails[0]?.address?.countryCode || "--" : "--"}</p>
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
            title={
              <div className="d-flex escrow_title titleText" style={{ alignItems: "center", gap: "5px" }}>
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
                Balance in escrow account
              </div>
              <div className="subText_small fw-400 text-right">
                {moneyFormat(
                  chequeDetail?.currency,
                  parseFloat(walletAmountAndCount?.availableAmount ?? 0).toFixed(2)
                )}
              </div>
            </div>
            <div className="endtoend py-2">
              <div className="stepDetails_medium_sub">
                Funds to be added to the transaction
              </div>
              <div className="subText_small fw-400 text-right">
                {moneyFormat(
                  chequeDetail?.currency,
                  chequeDetail?.buyerAmount
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
                onClick={() => { setAddFundModal(false) }}>
                Cancel
              </Button>
            </div>
          </Row>
          </Modal>          
          <Modal
        open={fundAddedSuccessModal}
        onCancel={() => {setFundAddedSuccessModal(!fundAddedSuccessModal); goBack();   }    }
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
    </div>
  );
};
export default AddFunds;
