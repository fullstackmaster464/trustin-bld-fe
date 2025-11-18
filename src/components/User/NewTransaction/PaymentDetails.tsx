import { Card, Col, Image, Popover, Row, message } from "antd";
import { useEffect, useRef, useState } from "react";
import GrayInfo from '../../../assets/img/info_light.svg'
import { PLATFORM_CHARGE_APPLIED_ON, TRANSACTION_TYPE, getLocalStorage, modifyCresetUserType } from "../../Common/Constants";
import { getUserPlatformFees } from "../../../services/admin";
import BankIcon from '../../../assets/img/bankIcon.svg'
import { CalculateTransactionFee, calculateUserPlatformFee } from "../../Common/InvoiceCalculations";
import OnlinePaymentIcon from "../../../assets/img/onlinepaymentblue.svg";
import { getForexExchangeRate } from "../../../services/user";
// import { LoadingOutlined } from "@ant-design/icons";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const PaymentDetails = (props: any):any => {
  const { formValues, setPlatformCharge, taxDetails,  setTaxDetails, setSellerAmount, setBuyerAmount,EscrowAdvisorFee, setInvoiceCalculations, hasAdvisor, buyerCommissionPercent, buyerPercent, advisorFeeType , hideSellerAmount } = props;
  // const [data, setData] = useState({
  //   selfCurrency: "",
  //   otherCurrency: "",
  //   platformCharge: "",
  //   conversionRate: "",
  // });
  // const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
console.warn(setPlatformCharge);

  const [showData, setShowData] = useState<any>({
    platformPercent: "",
    currency: "",
    amount: "",
    platformFees: "",
    totalAmount: "",
    otherCharge: "",
    buyerAmount: "",
    sellerAmount: "",
    invoiceAmount: 0,
    escrowAdvisorCommission: 0,
    buyerCommissionAmount: 0,
    sellerCommissionAmount: 0
  });

  const [forexExchangeRate, setForexExchangeRate] = useState<number | undefined>();
  const [isForexExchangeRateLoading, setIsForexExchangeRateLoading] = useState(false);
  
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const counterUserAlias = getLocalStorage("counterUserAlias") ? getLocalStorage("counterUserAlias") : "";
  const entityType = local ? JSON.parse(local)?.entityType : "";

  let EscrowAdvisorFees = formValues?.escrowAdvisorCommission ? formValues?.escrowAdvisorCommission : EscrowAdvisorFee ?? '0.00';
  const AdvisorFeeType = formValues?.advisorFeeType ? formValues?.advisorFeeType : advisorFeeType ?? 'FIXED';
  if (AdvisorFeeType === 'PERCENT') {
    EscrowAdvisorFees = Number(EscrowAdvisorFees) * Number(formValues?.invoiceAmount ) * 0.01
  }

  const BuyerCommissionPercent = formValues?.buyerCommissionPercent ? formValues?.buyerCommissionPercent : buyerCommissionPercent ?? 100
  const SellerCommissionPercent = 100 - BuyerCommissionPercent//formValues?.sellerCommissionPercent || 0;
  const BuyerPercent = formValues?.buyerPercent != null ? formValues?.buyerPercent : buyerPercent ?? 100 
  // const BuyerPercent = !formValues?.buyerPercent ? 100 : formValues?.buyerPercent
  const SellerPercent = 100 - BuyerPercent
  const hasTaxDetailsSet = useRef({
    isSet: false,
    invoiceAmount: formValues?.invoiceAmount ?? 0
  });
  // const SellerPercent = formValues?.sellerPercent || 0
  useEffect(() => {
    // setActiveTab("otherCurrency");
    if (formValues?.invoiceAmount) {
      getUserPlatformFees(userAlias, TRANSACTION_TYPE.ESCROW).then(async(res) => {
        const { data: counterUserPlatformCharge }: any = counterUserAlias ? await getUserPlatformFees(counterUserAlias, TRANSACTION_TYPE.ESCROW) : {};
        const userPlatformCharge = res.data;
        
        let platformFeePercent, platformChargeType, platformChargeAppliedOn;
        const minimumPlatformFee = taxDetails?.minimumPlatformFee;
        const vatPercent = Number(taxDetails?.vatCharges ?? process.env.COUNTRY_VAT)

        if (userPlatformCharge && counterUserPlatformCharge) {
          const buyerAmount = calculateUserPlatformFee(userPlatformCharge, formValues?.invoiceAmount);
          const sellerAmount = calculateUserPlatformFee(counterUserPlatformCharge, formValues?.invoiceAmount);
          if (buyerAmount >= sellerAmount && userPlatformCharge) {
            platformFeePercent = Number(userPlatformCharge.platformFees);
            platformChargeType = userPlatformCharge.platformChargeType;
            platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.BUYER;
          } else {
            platformFeePercent = Number(counterUserPlatformCharge.platformFees);
            platformChargeType = counterUserPlatformCharge.platformChargeType;
            platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.SELLER;
          }
        } else if (userPlatformCharge?.platformFees) {
          platformFeePercent = Number(userPlatformCharge.platformFees);
          platformChargeType = userPlatformCharge.platformChargeType;
          platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.BUYER;
        } else if (counterUserPlatformCharge?.platformFees) {
          platformFeePercent = Number(counterUserPlatformCharge?.platformFees);
          platformChargeType = counterUserPlatformCharge?.platformChargeType;
          platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.SELLER;
        } else {
          // Default: category-level fees
          platformFeePercent = Number(taxDetails?.plateformFees ?? taxDetails?.platformFees);
          platformChargeType = taxDetails?.platformChargeType,
          platformChargeAppliedOn = PLATFORM_CHARGE_APPLIED_ON.DEFAULT;
        }

        if (hasTaxDetailsSet.current.isSet === false || formValues?.invoiceAmount !== hasTaxDetailsSet.current.invoiceAmount) {
          setTaxDetails((prev: any) => ({
            ...prev,
            platformChargeType: platformChargeType ?? prev?.platformChargeType,
            plateformFees: platformFeePercent ?? prev?.plateformFees,
            platformChargeAppliedOn
          }));
          hasTaxDetailsSet.current ={
            isSet: true,
            invoiceAmount: formValues?.invoiceAmount
          };
        }

        const data = CalculateTransactionFee({
          transactionAmount: formValues?.invoiceAmount,
          invoiceAmount: formValues?.invoiceAmount,
          plateformFees: platformFeePercent,
          platformChargeType,
          vatCharges: vatPercent,
          buyerPercent: BuyerPercent,
          sellerPercent: SellerPercent,
          hasAdvisor: hasAdvisor,
          escrowCommission: EscrowAdvisorFees,
          buyerCommissionPercent: BuyerCommissionPercent,
          sellerCommissionPercent: SellerCommissionPercent,
          minimumPlatformCharge: minimumPlatformFee ?? taxDetails?.minimumPlatformFee,
          entityType: entityType
        });
        setInvoiceCalculations(data);
        setShowData({
          ...showData,
          platformFees: data.platformFee,
          otherCharge: data.vatFee,
          invoiceAmount: formValues?.invoiceAmount,
          totalAmount: data.totalAmount,
          buyerAmount: data.buyerAmount,
          sellerTransactionFee: data.sellerTransactionFee,
          sellerAmount: data.sellerAmount,
          buyerTransactionFee: data.buyerTransactionFee,
          buyerAdvisorFee: data.buyerAdvisorFee,
          sellerAdvisorFee: data.sellerAdvisorFee,
          minimumPlatformCharge: data.minimumPlatformCharge,
          platformPercent: data.platformPercent,
          currency: formValues?.currency
        });
          if (formValues.currency != null && formValues.payoutCurrency != null && formValues.currency !== formValues.payoutCurrency) {
            setIsForexExchangeRateLoading(true);
            getForexExchangeRate({sourceCurrencyCode: formValues.currency, destinationCurrencyCode: formValues.payoutCurrency, srcAmount: "1"}).then((response: any) => {
              setForexExchangeRate(response.data.sell.amount);
            }).finally(() => {
              setIsForexExchangeRateLoading(false)
            })
          }
      })
        .catch(() => {
          message.error("Oops! Something went wrong. Please try again later!");
        });
    }
  }, [
    formValues?.invoiceAmount,
    formValues?.buyerPercent,
    formValues?.currency,
    formValues?.buyerCommissionPercent,
    EscrowAdvisorFees,
    taxDetails,
    formValues?.payoutCurrency
  ]);
  useEffect(() => {
    if(showData?.buyerAmount !==""){
      setBuyerAmount(showData.buyerAmount);
    }
    if(showData?.sellerAmount !==""){
      setSellerAmount(showData.sellerAmount);
    }
  }, [showData]);
  // const onCurrencyChange = (value: string) => {
  //   if (value === "otherCurrency") {
  //     setActiveTab("otherCurrency");
  //     setShowData({
  //       currency: data.otherCurrency,
  //       invoiceAmount: formValues?.invoiceAmount,
  //       platformFees: parseFloat(
  //         (formValues?.invoiceAmount * data.platformCharge) / 100
  //       ).toFixed(2),
  //       otherCharge: parseFloat(
  //         (0.05 * formValues?.invoiceAmount * data.platformCharge) / 100
  //       ).toFixed(2),
  //       totalAmount: parseFloat(
  //         formValues?.invoiceAmount * (1 + (data.platformCharge / 100) * 1.05)
  //       ).toFixed(2),
  //     });
  //   } else if (value === "selfCurrency") {
  //     setActiveTab("selfCurrency");
  //     setShowData({
  //       currency: data.selfCurrency,
  //       invoiceAmount: parseFloat(
  //         formValues?.invoiceAmount * data.conversionRate
  //       ).toFixed(2),
  //       platformFees: parseFloat(
  //         (formValues?.invoiceAmount *
  //           data.conversionRate *
  //           data.platformCharge) /
  //           100
  //       ).toFixed(2),
  //       otherCharge: parseFloat(
  //         (0.05 *
  //           formValues?.invoiceAmount *
  //           data.conversionRate *
  //           data.platformCharge) /
  //           100
  //       ).toFixed(2),
  //       totalAmount: parseFloat(
  //         formValues?.invoiceAmount *
  //           (1 + (data.platformCharge / 100) * 1.05) *
  //           data.conversionRate
  //       ).toFixed(2),
  //     });
  //   }
  // };

  return formValues?.invoiceAmount ? (
    <>
      <div className="position-relative">
        {/* <div className={loading ? `loading-area` : ''}>
          <Spin
            size="large"
            className="ant-spin-lg"
            spinning={loading}
            indicator={antIcon}
          />
        </div> */}
        <hr className="lightgrayHr" />
        <div className="titleText mb-4 mt-4">Payment information</div>
        <Row gutter={[24,24]}>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <Card className="paymentCard p-2">
              <table className="w-100 paymentTable">
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Agreement amount</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                    {`${Number(showData.invoiceAmount).toLocaleString()} ${showData.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      {
                        <>
                          TrustIn fees ({showData?.platformPercent ? showData?.platformPercent : 0}) + (
                          {taxDetails?.vatCharges ?? process.env.COUNTRY_VAT})% VAT
                          <Popover
                            className="ms-2"
                            placement="bottom"
                            content="VAT is applicable on transaction fee only"
                          >
                            <Image src={GrayInfo} alt="info icon" preview={false} height={16} width={16} />
                          </Popover>
                        </>
                      }
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${isNaN(showData.platformFees) ? "0.00" : Number(showData.platformFees).toFixed(2).toLocaleString() } ${showData.currency} + ${isNaN(showData.otherCharge) ? "0.00" : Number(showData.otherCharge).toFixed(2).toLocaleString()} ${showData.currency}`}
                    </div>
                  </td>
                </tr>
               { hasAdvisor ?  (
                <>
                 <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Escrow advisor fee (Inclusive of VAT)</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${EscrowAdvisorFees} ${showData.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Escrow advisor fee to be paid by buyer ({BuyerCommissionPercent}%)</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${showData.buyerAdvisorFee} ${showData.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Escrow advisor fee to be paid by {modifyCresetUserType(userAlias,'seller')} ({SellerCommissionPercent}%)</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${showData.sellerAdvisorFee} ${showData.currency}`}
                    </div>
                  </td>
                </tr>
                </>
                ): null}
                 <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Trustin platform fee to be paid by {modifyCresetUserType(userAlias,'buyer')} ({BuyerPercent}%)</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${isNaN(showData?.buyerTransactionFee) ? "0.00" : showData.buyerTransactionFee} ${showData.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Trustin platform fee to be paid by {modifyCresetUserType(userAlias,'seller')} ({SellerPercent}%)</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${isNaN(showData?.sellerTransactionFee) ? "0.00" : showData.sellerTransactionFee} ${showData.currency}`}
                    </div>
                    {forexExchangeRate && formValues.payoutCurrency != null && formValues.currency !== formValues.payoutCurrency ? 
                    <div style={{fontSize: "14px"}}>
                      {!isForexExchangeRateLoading ? `(${Number((Number(showData.sellerTransactionFee) * Number(forexExchangeRate)).toFixed(2)).toLocaleString()} ${formValues.payoutCurrency})` : 'Calculating...'}
                    </div>  : null}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Amount to be paid by  {modifyCresetUserType(userAlias,'buyer')}</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${isNaN(showData?.buyerAmount) ? "0.00" : Number(showData?.buyerAmount).toLocaleString()} ${showData.currency}`}
                    </div>
                  </td>
                </tr>
                {
                 hideSellerAmount ? null : 
                 <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Amount to be received by {modifyCresetUserType(userAlias,'seller')}</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(showData.sellerAmount).toLocaleString()} ${showData.currency}`}
                    </div>
                    {forexExchangeRate && formValues.payoutCurrency != null && formValues.currency !== formValues.payoutCurrency ? 
                    <div style={{fontSize: "14px"}}>
                      {!isForexExchangeRateLoading ? `(${Number((Number(showData.sellerAmount) * Number(forexExchangeRate)).toFixed(2)).toLocaleString()} ${formValues.payoutCurrency})` : 'Calculating...'}
                    </div>  : null}
                  </td>
                </tr>
                
                }
                
                <tr>
                  <td className="p-2">
                    <div className="titleText fw-400">Total amount</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="mainTitle">
                      {`${isNaN(showData?.totalAmount) ?  Number(showData.invoiceAmount).toLocaleString() : Number(showData.totalAmount).toLocaleString()} ${showData.currency}`}
                    </div>
                  </td>
                </tr>
              </table>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Card className="paymentCard p-3">
            <div className="subText_small fw-400">Accepted payment methods</div>
                      <div className="d-flex mt-4 justify-content-start align-items-start">
                        <Image src={BankIcon} preview={false} alt="bank icon" />
                        <div>
            <div className="mainTitle_sub mx-3">Bank transfer</div>
                        </div>
                      </div>
                      <div className="d-flex mt-2 justify-content-start align-items-start">
                        <Image src={OnlinePaymentIcon} preview={false} alt="bank icon" style={{height:'20px',width:'20px'}}/>
                        <div>
                       <div className="mainTitle_sub" style={{paddingLeft:'14px'}}>Online Payments [UAEPGS]</div>
                        </div>
                      </div>
            </Card>
            </Col>
        </Row>
        <ul className="stepDetails_medium_sub my-4">
          <li>
            Total amount to be transferred to the escrow account.
          </li>
          <li>
          Amount transferred to trustIn (excluding escrow fees) will be safeguarded in UAE central bank, authorised bank until your vendor has 
provided fulfilment proof and you instruct TrustIn to release the payment.
          </li>
          <li>
          We will notify both the parties by email on every action and steps. Involved parties can track the live status on the platform as well.
          </li>
        </ul>
      </div>
    </>
  ) : null;
};

export default PaymentDetails;
