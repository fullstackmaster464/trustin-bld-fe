import {
  Breadcrumb,
  Card,
  Col,
  Row,
  Image,
  notification,
  Spin,
  Select,
  Form,
  message,
  Input,
  Popover,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  PLATFORM_CHARGE_TYPE,
  UAEPGS_LIMIT,
  getLocalStorage,
  moneyFormat,
} from "../Common/Constants";
import { getPaymentDetails, getTransactionLinkList, getUaepgsFormDataUrl, virtualAccountDetails } from "../../services/admin";

import {
  Dashboard,
  TransactionDetail,

} from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import GrayInfo from '../../assets/img/info_light.svg';
import DefaultLayout from "../Common/DefaultLayout";
import { CalculateTransactionFee } from "../Common/InvoiceCalculations";
import TextArea from "antd/es/input/TextArea";
import { getUaepgsBankList } from "../../services/user";

const { Option } = Select;
const NetBankPayment = ():any => {
  const [paymentData, setPaymentData] = useState<any>({});
  const [payDetail, setPayDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const [didsubmit, setdidsubmit] = useState<any>("DEFAULT");
  const [description, setDescription] = useState<any>();
  const [selectedBankId, setBankId] = useState<any>();
  const [bankList, setBankList] = useState([]);
  const [virtualAccountsDetails, setVirtualAccountsDetails] = useState<any>([]);
  const [hasAdvisor, setHasAdvisor] = useState<any>(false);
  const [handleSubmitButton,setHandleSubmitButton] = useState<any>(false);
  const [selectedAmount,setSelectedAmount] = useState<any>();
  const [amountError, setAmountError] = useState<any>(false);
  const [descriptionError, setDescriptionError] = useState<any>(false);
  const [amountErrorMessage, setAmountErrorMessage] = useState<any>(false);
  const entityType = JSON.parse(getLocalStorage("auth")!)?.entityType;
  const [requiredAmountToBeAdded, setRequiredAmountToBeAdded] = useState<any>();
  const navigate = useNavigate();
  React.useEffect(() => {
    return () => {
      // unblock();
      setdidsubmit(0);
    };
  }, [didsubmit]);
  const location = useLocation();
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
    const handleWheel = (e:any) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  
  const getVaTransactionList= async (milestoneAlias: string, amount: any) => {
    try {
      if(!milestoneAlias) {
        return;
      }
      const response = await getTransactionLinkList(milestoneAlias);
      const transactionLinks = response?.data?.VATransactionLinkList ?? [];
      const totalAmount = transactionLinks && transactionLinks?.length > 0 ? transactionLinks.reduce((sum: any, element: any) => sum + Number(element?.Amount || 0), 0) : 0;
      const totalMilestoneAmount = Number(amount || 0);
      const requiredAmount = totalMilestoneAmount - totalAmount;
      setRequiredAmountToBeAdded(requiredAmount.toFixed(2));
    }catch(error: any) {
      const errorMessage = error?.data?.message || error?.data?.[0]?.message || error?.error || "Internal server error";
      openNotification(errorMessage)
    }
  }

  useEffect(() => {
    setLoading(true);
    getPaymentDetails(location?.state?.contractid)
      .then((response) => {
        setLoading(false);
        setPaymentData(response.data);
        const milestone = response.data.milestoneList.filter((item: any) => item.isActive === true)[0];
        const txnAliasList: any = [];
        response.data.milestoneList?.map((txn: any) =>
          txnAliasList.push(txn.aliasName)
        );
        const hasAdvisorAlias = response.data?.escrowAdvisorAlias && ![response.data?.buyerAlias,response.data?.sellerAlias].includes(response.data?.escrowAdvisorAlias);
        setHasAdvisor(hasAdvisorAlias);
        const data: any = CalculateTransactionFee({
          invoiceAmount: response.data?.invoiceAmount,
          transactionAmount: location?.state?.totalAmount,
          plateformFees:  response.data?.platformCharge,
          vatCharges:  response.data?.vatCharges,
          platformChargeType: response.data?.platformChargeType !== null ? response.data?.platformChargeType : PLATFORM_CHARGE_TYPE.PERCENT,
          buyerPercent: response.data?.buyerPercent,
          sellerPercent: response.data?.sellerPercent,
          hasAdvisor: hasAdvisorAlias,
          escrowCommission: response.data?.escrowAdvisorCommission,
          buyerCommissionPercent: response.data?.buyerCommissionPercent,
          sellerCommissionPercent: response.data?.sellerCommissionPercent,
          minimumPlatformCharge: response.data?.minimumPlatformCharge,
          entityType: response.data?.itemCategoryEntityType 
        })
        getVaTransactionList(location?.state?.transactionId, data.buyerAmount);
        setPayDetail({
          amount: location?.state?.totalAmount,
          invoiceAmount: response.data.invoiceAmount,
          payAmount: data.buyerAmount,
          currency: response.data.currency,
          transactionAlias: txnAliasList,
          contractAlias: response.data.aliasName,
          agreementId: response.data.agreementId,
          platformCharge: data.platformFee,
          vatCharges: data.vatFee,
          platformChargeType: response.data.platformChargeType,
          buyerDetail: location.state.buyerDetail,
          totalPayment: milestone?.totalTransactionAmount,
          netBankingVatCharges: response?.data?.vatCharges,
          platformPercent: data?.platformPercent,
          advisorFee: data?.buyerAdvisorFee
        });
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.data?.message || error?.data?.[0]?.message || error?.error || "Internal server error";
        openNotification(errorMessage);
      });
    getUaepgsBankList(entityType)
    .then((response) => {
      if(response?.status === 200 || response?.status === 201) {
        setBankList(response?.data?.bankList);
      }
    }) 
    .catch((error) => {
      const errorMessage = error?.data?.message || error?.data?.[0]?.message || error?.error || "Internal server error";
      openNotification(errorMessage);
    })
  }, [location?.state?.contractid]);

  useEffect(()=> {
    if(userAlias && paymentData?.currency) {
      virtualAccountDetails(userAlias, paymentData?.currency)
      .then((response) => {
        setVirtualAccountsDetails(response?.data?.VADetails);
      })
      .catch((error) => {
        const errorMessage = error?.data?.message || error?.data?.[0]?.message || error?.error || "Internal server error";
        openNotification(errorMessage);
      });
    }
  }, [userAlias, paymentData])

  const goBack = () => {
    navigate(TransactionDetail + "/" + location?.state?.contractid);
  };

  const validateDescription = (e: any) => {
    const result: string = e.target.value || "";
    const trimmedDesc: string = result.trim();
    setDescription(trimmedDesc);
  };

  const validateAmount = (e: any) => {
    const amount = e.target.value;
    if(amount > parseFloat(payDetail?.payAmount)) {
      setAmountErrorMessage("Amount must be less than or equal to total amount");
      setAmountError(true);
    } else if(amount < 0) {
      setAmountErrorMessage("Amount must be greater than 0");
      setAmountError(true);
    } else {
      setAmountErrorMessage("");
      setAmountError(false);
    }
    setSelectedAmount(amount);
  }

  const onBankSelect = (bankId: any) => {
    setBankId(bankId);
  };

  const handelSubmit = async (event:any) => {
    event.preventDefault();
    if (selectedBankId) {
      let desc: any = description;
      let userSelectedAmount: any = selectedAmount;
      if(!description) {
        desc = paymentData?.agreementId
      } else {
        if(description.length > UAEPGS_LIMIT.DESCRIPTION_MAX_LENGTH) {
          setDescriptionError(true);
          return;
        } else{
          setDescriptionError(false);
        }
      }
      if(!selectedAmount) {
        const defaultAmount = Number(requiredAmountToBeAdded ?? 0);
        userSelectedAmount = defaultAmount > 0 ? defaultAmount : 0;
      } else if(selectedAmount > parseFloat(payDetail?.payAmount)) {
        message.error("Amount must be less than or equal to total amount");
        return;
      } else if(selectedAmount < 0) {
        message.error("Amount must be greater than 0")
        return;
      }
      const netbankingVatCharge = (Number(process.env.UAEPGS_PLATFORM_FEE) * Number(process.env.COUNTRY_VAT))/100;
      userSelectedAmount = Number(userSelectedAmount || 0 ) + Number(process.env.UAEPGS_PLATFORM_FEE) + netbankingVatCharge;

      setHandleSubmitButton(true);
      const formData = new FormData(event.target);
      let orignalAmount = Number(userSelectedAmount) * 100;
      const checkDecimal = Number.isInteger(orignalAmount);
      if(!checkDecimal) {
        orignalAmount = Math.round(orignalAmount)
      }
      const amount = orignalAmount.toString();
      const billReference = paymentData?.agreementId.replace(/-/g, '.');
      // const contractAlias = payDetail?.contractAlias.toString().replace(/-/g, '.')
      const productId = entityType === "COMPANY" ? "CORP" : "RETL";
      // const transactionId = location?.state?.transactionId ?? "";
      formData.append('pp_Amount', amount);
      formData.append('pp_Description', desc);
      formData.append('pp_BillReference', billReference);
      formData.append('pp_BankID', selectedBankId);
      formData.append('pp_ProductID', productId);
      formData.append('ppmpf_1', userAlias);
      formData.append('ppmpf_2', virtualAccountsDetails[0]?.number);
      // formData.append('ppmpf_3', transactionId);

      const formsData:any = {};
      formData.forEach((value, key) => {
        formsData[key] = value;
      });
      console.log("formsData",formsData);      
      
      const uaepgsFormData = await getUaepgsFormDataUrl(formsData)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        setHandleSubmitButton(false);
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
      // START - Currency testing in staging    // TODO-Will remove after flow working
      console.log("uaepgsFormData",uaepgsFormData);      
      // END 
      await document.getElementById("pp_SecureHash")?.setAttribute("value", uaepgsFormData?.pp_SecureHash.toUpperCase());
      await document.getElementById("pp_TxnDateTime")?.setAttribute("value", uaepgsFormData?.pp_TxnDateTime);
      await document.getElementById("pp_TxnRefNo")?.setAttribute("value", uaepgsFormData?.pp_TxnRefNo);
      await document.getElementById("pp_Language")?.setAttribute("value", uaepgsFormData?.pp_Language);
      await document.getElementById("pp_MerchantID")?.setAttribute("value", uaepgsFormData?.pp_MerchantID);
      await document.getElementById("pp_Password")?.setAttribute("value", uaepgsFormData?.pp_Password);
      await document.getElementById("pp_ProductID")?.setAttribute("value", uaepgsFormData?.pp_ProductID);
      await document.getElementById("pp_ReturnURL")?.setAttribute("value", uaepgsFormData?.pp_ReturnURL);
      await document.getElementById("pp_TxnCurrency")?.setAttribute("value", uaepgsFormData?.pp_TxnCurrency);
      await document.getElementById("pp_TxnExpiryDateTime")?.setAttribute("value", uaepgsFormData?.pp_TxnExpiryDateTime);
      await document.getElementById("pp_TxnType")?.setAttribute("value", uaepgsFormData?.pp_TxnType);
      await document.getElementById("pp_Version")?.setAttribute("value", uaepgsFormData?.pp_Version);
      await document.getElementById("pp_BankID")?.setAttribute("value", selectedBankId);
      await document.getElementById("pp_Amount")?.setAttribute("value", amount);
      await document.getElementById("pp_Description")?.setAttribute("value", desc);
      await document.getElementById("pp_BillReference")?.setAttribute("value", billReference);
      await document.getElementById("ppmpf_1")?.setAttribute("value", userAlias);
      await document.getElementById("ppmpf_2")?.setAttribute("value", virtualAccountsDetails[0]?.number);      
      // await document.getElementById("ppmpf_3")?.setAttribute("value", transactionId);
      
      // Submit on getting response
      event.target.submit();
    } else {
      setHandleSubmitButton(false);
      if (!selectedBankId) {
        message.error("Please select bank");
      }
    }
  };

  const handleInputValidation = (e: any) => {
    const value = e?.target?.value.trim();
    if (value.includes(".")) {
      const parts = value.split(".");
      if (parts[1]?.length > 1) {
        e.target.value = `${parts[0]}.${parts[1].substring(0, 2)}`;
      } 
    }
    setdidsubmit(1);
  };

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
        <Row>
          <Col className="titleText mb-4">
            {paymentData.agreementId}
          </Col>
        </Row>
        <div className="">
          <div className="subText_xs w-100 paymentMethods pl-5">
            <p>Note: Extra charge of {process.env.UAEPGS_PLATFORM_FEE} {paymentData?.currency} + {process.env.COUNTRY_VAT}% vat is applied on every transaction.</p>
          </div>
        </div>
        {/* <form action="https://pgt.cbuaepay.ae/PGCustomerPortal/transactionmanagement/merchantform" method="POST" onSubmit={handelSubmit}> */}
        <Row gutter={24} className="paymentSummery">
          <Col md={12} xs={24} lg={8} className="mb-2">
            <div className="makePayment justify-content-start">
                <div className="w-100">
                  <div className="w-100-res input-form-field">
                    <p className="enter-text-category ms-0">Choose bank</p>
                    <Form.Item
                      name="bankId"
                      required
                      rules={[
                        {
                          required: true,
                          message: "Bank is required!",
                        },
                      ]}
                      className="modal_inputField w-100 select"
                    >
                      <Select showSearch placeholder="Select bank"
                          className="w-100 paymentOption"
                          onChange={(bankId) => {
                            onBankSelect(bankId);
                            setdidsubmit(1);
                          }}
                          optionFilterProp="children"
                          allowClear>
                           {bankList && bankList.map((bank: any, index: any) => (
                            <Option key={index} value={bank?.bankId}>{bank?.name}</Option>
                           ))}
                          </Select>
                    </Form.Item>
                  </div>
                  <div>
                    <div className="stepDetails fw-400  mt-3">
                      <span className="stepDetails fw-400 mb-2 mt-3">Enter amount</span>
                      <Popover
                        className="ms-2"
                        placement="bottom"
                        content="If no value entered total amount is considered for net banking"
                      >
                        <Image src={GrayInfo} alt="info icon" preview={false} height={16} width={16} />
                      </Popover>
                    </div>
                    <Form.Item
                      name="selectedAmount"
                      className="inputField w-100  error-input"
                      rules={[
                        {
                          validator(_, value) {
                             if (parseFloat(value) > payDetail?.payAmount) {
                              return Promise.reject(`Amount must be less than or equal to total amount`);
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter amount you wish to add (optional)"
                        type={"number"}
                        pattern="[0-9]*"
                        maxLength={45}
                        onKeyDown={(e: any) => {
                          if (e.key === "+" || e.key === "-") {
                            e.preventDefault();
                          }
                        }}
                        onInput={(e: any) => {
                          handleInputValidation(e);
                        }}
                        onChange={(e) => validateAmount(e)}
                      />
                    </Form.Item>
                    {amountError && (
                      <p className="errMsg mx-2">Note: {amountErrorMessage}</p>
                    )}
                  </div>
                  <div>
                    <div className="stepDetails fw-400 mb-2 mt-3">
                      <span className="stepDetails fw-400 mb-2 mt-3">Description</span>
                      {/* <span className="stepDetails_medium_sub"> (Optional)</span> */}
                    </div>
                    <Form.Item
                      name="desc"
                      className="inputField w-100 mt-5 error-input"
                    >
                      <TextArea
                        rows={5}
                        placeholder="Write your description here (optional)"
                        maxLength={UAEPGS_LIMIT.DESCRIPTION_MAX_LENGTH}
                        onInput={() => {
                          setdidsubmit(1);
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          const trimmedDesc = value.trim();
                          if (trimmedDesc.length <= UAEPGS_LIMIT.DESCRIPTION_MAX_LENGTH) {
                            setDescriptionError(false);
                            validateDescription(e);
                          } else {
                            setDescriptionError(true);
                          }
                        }}
                      />
                    </Form.Item>
                    {descriptionError && (
                      <p className="errMsg mx-2 mt-5">Note: Maximum characters allowed: {UAEPGS_LIMIT.DESCRIPTION_MAX_LENGTH}</p>
                    )}
                  </div>
                </div>
              </div>
          </Col>
          <Col  md={12} xs={24} lg={10}>
            {moneyFormat(
              paymentData?.currency,
              parseFloat(paymentData?.totalPayment)
            ) ? <Card className="grayCard p-md-4">
              <div className="endtoend py-2">
                <div className="stepDetails_medium_sub">
                  Amount payable
                </div>
                <div className="subText_small fw-400 text-right">
                  {moneyFormat(
                    paymentData.currency,
                    parseFloat(payDetail?.amount).toFixed(2)
                    )}
                </div>
              </div>
              <div className="endtoend py-2">
                <div className="stepDetails_medium_sub">
                Total TrustIn Trade Fees{" "}
                        {`(${payDetail.platformPercent})`}
                </div>
                <div className="subText_small fw-400 text-right">
                {moneyFormat(
                  paymentData.currency,
                  payDetail.platformCharge
                )}
                </div>
              </div>
              <div className="endtoend py-2">
                <div className="stepDetails_medium_sub">
                {`${paymentData.vatCharges || process.env.COUNTRY_VAT}% VAT`}
                </div>
                <div className="subText_small fw-400 text-right">
                {moneyFormat(
                  paymentData.currency,
                  payDetail.vatCharges
                )}
                </div>
              </div>
              {hasAdvisor && 
                <div className="endtoend py-2">
                  <div className="stepDetails_medium_sub">
                  Escrow advisor fee (Inclusive of VAT)
                  </div>
                  <div className="subText_small fw-400 text-right">
                  {moneyFormat(
                    paymentData.currency,
                    payDetail?.advisorFee
                  )}
                  </div>
                </div>
              }
              <hr className="lightgrayHr" />
              <div className="endtoend py-2">
                <div className="subText_small fw-400">
                  Total amount
                </div>
                <div className="subText_small fw-400 text-right">
                  {moneyFormat(
                    paymentData.currency,
                    payDetail?.payAmount
                  )}
                </div>
              </div>
              <div className="endtoend py-2">
                <div className="subText_small fw-400">
                  Amount left to be added
                </div>
                <div className="subText_small fw-400 text-right">
                  {moneyFormat(
                    paymentData.currency,
                    requiredAmountToBeAdded
                  )}
                </div>
              </div>
            </Card> : <Spin className="mainloader spinner" />}
          </Col>
        </Row>
        <form action={process.env.UAEPGS_POSTING_URL} method="POST" onSubmit={handelSubmit}>
          <Row className="row">
            <Col className="col-md-4">
              <div className="payment-btn">
                <button type="submit" className={`mb-2 border-none proceedPay-btn ${handleSubmitButton === true ? "disabled": ""}`} disabled={handleSubmitButton}>Proceed to pay</button>
              </div>
            </Col>
          </Row>
          <div className="uaepgs-form">
            <input name="pp_Version" id="pp_Version" type="hidden" value="" /> <br></br>
            <input name="pp_TxnType" id="pp_TxnType" type="hidden" value="" /> <br></br>
            <input name="pp_MerchantID" id="pp_MerchantID" type="hidden" value="" /> <br></br>
            <input name="pp_Language" id="pp_Language" type="hidden" value="" /> <br></br>
            <input name="pp_Password" id="pp_Password" type="hidden" value="" /> <br></br>
            <input name="pp_BankID" id="pp_BankID" type="hidden" value="" /> <br></br>
            <input name="pp_ProductID" id="pp_ProductID" type="hidden" value="" /> <br></br>
            <input name="pp_TxnRefNo" id="pp_TxnRefNo" type="hidden" value="" /><br></br>
            <input name="pp_Amount" id="pp_Amount" type="hidden" value="" /> <br></br>
            <input name="pp_TxnCurrency" id="pp_TxnCurrency" type="hidden" value="" /> <br></br>
            <input name="pp_TxnDateTime" id="pp_TxnDateTime" type="hidden" value="" /><br></br>
            <input name="pp_TxnExpiryDateTime" id="pp_TxnExpiryDateTime" type="hidden" value="" /> <br></br>
            <input name="pp_BillReference" id="pp_BillReference" type="hidden" value="" /> <br></br>
            <input name="pp_Description" type="hidden" id="pp_Description" value="" /> <br></br>
            <input name="pp_ReturnURL" type="hidden" id="pp_ReturnURL" value="" /> <br></br>
            <input name="ppmpf_1" id="ppmpf_1" type="hidden" value="" /> <br></br>
            <input name="ppmpf_2" id="ppmpf_2" type="hidden" value="" /> <br></br>
            {/* <input name="ppmpf_3" id="ppmpf_3" type="hidden" value="" /> <br></br> */}
            <input name="pp_SecureHash" id="pp_SecureHash" type="hidden" value="" /> <br></br>
          </div>
        </form>
      </DefaultLayout>
    </div>
  );
};
export default NetBankPayment;
