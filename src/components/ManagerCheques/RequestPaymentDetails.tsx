import { Card, Col, Image, Popover, Row, message } from "antd";
import { useEffect, useRef, useState } from "react";
import GrayInfo from '../../assets/img/info_light.svg'
import { PLATFORM_CHARGE_APPLIED_ON, PLATFORM_CHARGE_TYPE, TRANSACTION_TYPE, getLocalStorage, modifyCresetUserType } from "../Common/Constants";
import { convertCurrency, getUserPlatformFees } from "../../services/admin";
import BankIcon from '../../assets/img/bankIcon.svg'
import { CalculateTransactionFee, calculateUserPlatformFee } from "../Common/InvoiceCalculations";
import OnlinePaymentIcon from "../../assets/img/onlinepaymentblue.svg";
// import { LoadingOutlined } from "@ant-design/icons";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const RequestPaymentDetails = (props: any):any => {
  const { formValues, setPlatformCharge, taxDetails,setTaxDetails, setBuyerAmount,EscrowAdvisorFee, setInvoiceCalculations, hasAdvisor, buyerCommissionPercent, buyerPercent, advisorFeeType, sellerAlias } = props;
  // const [data, setData] = useState({
  //   selfCurrency: "",
  //   otherCurrency: "",
  //   platformCharge: "",
  //   conversionRate: "",
  // });
  // const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

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
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const entityType = local ? JSON.parse(local)?.entityType : "";
 
  let EscrowAdvisorFees = formValues?.escrowAdvisorCommission ? formValues?.escrowAdvisorCommission : EscrowAdvisorFee ?? '0.00';
  const AdvisorFeeType = formValues?.advisorFeeType ? formValues?.advisorFeeType : advisorFeeType ?? 'FIXED';
  if (AdvisorFeeType === 'PERCENT') {
    EscrowAdvisorFees = Number(EscrowAdvisorFees) * Number(formValues?.invoiceAmount ) * 0.01
  }
  const BuyerCommissionPercent = formValues?.buyerCommissionPercent ? formValues?.buyerCommissionPercent : buyerCommissionPercent ?? 100
  const SellerCommissionPercent = 100 - BuyerCommissionPercent//formValues?.sellerCommissionPercent || 0;
  const BuyerPercent = formValues?.buyerPercent != null ? formValues?.buyerPercent : buyerPercent ?? 100 
  // let BuyerPercent = !formValues?.buyerPercent ? 100 : formValues?.buyerPercent
  const SellerPercent = 100 - BuyerPercent
  const hasTaxDetailsSet = useRef({
    isSet: false,
    invoiceAmount: formValues?.invoiceAmount ?? 0
  });
 
   
  // const SellerPercent = formValues?.sellerPercent || 0
  useEffect(() => {
    // setActiveTab("otherCurrency");
    if (formValues?.invoiceAmount) {
      convertCurrency(userAlias, formValues.currency)
        .then(async(res) => {
          // setData({
          //   selfCurrency: res.data.selfCurrency,
          //   otherCurrency: res.data.otherCurrency,
          //   platformCharge: taxDetails?.plateformFees,
          //   conversionRate: res.data.rate,
          // });
          const [userPlatformCharge, sellerPlatformCharge]:any = await Promise.all([
            getUserPlatformFees(userAlias, TRANSACTION_TYPE.MC),
            sellerAlias ? getUserPlatformFees(sellerAlias, TRANSACTION_TYPE.MC) : Promise.resolve({}),
          ]);

          let taxDetailsObj = taxDetails;
          if (userPlatformCharge?.status === 200 && userPlatformCharge?.data && sellerPlatformCharge?.status === 200 && sellerPlatformCharge?.data) {
            const buyerAmount = calculateUserPlatformFee(userPlatformCharge?.data, formValues?.invoiceAmount);
            const sellerAmount = calculateUserPlatformFee(sellerPlatformCharge?.data, formValues?.invoiceAmount);
            if (buyerAmount >= sellerAmount && userPlatformCharge?.data) {
              taxDetailsObj = {
                platformChargeType: userPlatformCharge.data.platformChargeType,
                platformFees: userPlatformCharge.data.platformFees,
                platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
              };
            } else {
              taxDetailsObj = {
                ...taxDetails,
                platformChargeType: sellerPlatformCharge.data.platformChargeType,
                platformFees: sellerPlatformCharge.data.platformFees,
                platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
              };
            }
          }else if (sellerPlatformCharge?.status === 200 && sellerPlatformCharge?.data) {
            taxDetailsObj = {
              platformChargeType: sellerPlatformCharge?.data?.platformChargeType,
              platformFees: sellerPlatformCharge?.data?.platformFees,
              platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
            };
          } else if (userPlatformCharge?.status === 200 && userPlatformCharge?.data) {
            taxDetailsObj = {
              platformChargeType: userPlatformCharge.data.platformChargeType,
              platformFees: userPlatformCharge.data.platformFees,
              platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
            };
          }
          if (hasTaxDetailsSet.current.isSet === false || formValues?.invoiceAmount !== hasTaxDetailsSet.current.invoiceAmount) {
            setTaxDetails((prev: any) => ({
              ...prev,
              platformChargeType: taxDetailsObj?.platformChargeType,
              plateformFees: taxDetailsObj?.platformFees,
              platformChargeAppliedOn: taxDetailsObj?.platformChargeAppliedOn
            }));
            hasTaxDetailsSet.current ={
              isSet: true,
              invoiceAmount: formValues?.invoiceAmount
            };
          }

          setPlatformCharge(taxDetailsObj?.platformFees ?? taxDetails?.plateformFees);
          const data = CalculateTransactionFee({
            invoiceAmount: formValues?.invoiceAmount,
            transactionAmount: formValues?.invoiceAmount,
            plateformFees: taxDetailsObj?.platformFees ?? taxDetails?.plateformFees,
            platformChargeType: taxDetailsObj?.platformChargeType ?? taxDetails?.platformChargeType ? taxDetails?.platformChargeType : PLATFORM_CHARGE_TYPE.PERCENT,
            vatCharges: taxDetailsObj?.vatCharges ?? taxDetails?.vatCharges,
            buyerPercent: BuyerPercent,
            sellerPercent: SellerPercent,
            hasAdvisor: hasAdvisor,
            escrowCommission: EscrowAdvisorFees,
            buyerCommissionPercent: BuyerCommissionPercent,
            sellerCommissionPercent: SellerCommissionPercent,
            minimumPlatformCharge: taxDetails?.minimumPlatformFee,
            entityType: entityType
          })

          setInvoiceCalculations(data); 
          setShowData({
            currency: res.data.otherCurrency,
            invoiceAmount: formValues?.invoiceAmount,
            // buyerCommissionPercent: BuyerCommissionPercent, //by default all fee will be paid by buyer
            // sellerCommissionPercent: SellerCommissionPercent,

            // staging code 
            // buyerPercent: (!formValues?.buyerPercent && !formValues?.sellerPercent) ? 100 : Number(formValues?.buyerPercent || 0),
            // sellerPercent: Number(formValues?.sellerPercent || 0),

            buyerPercent: (formValues?.transactionType !=="RECEIVE" && !formValues?.buyerPercent && !formValues?.sellerPercent) ? 100 : Number(formValues?.buyerPercent || 0),
            sellerPercent: Number(formValues?.transactionType === "RECEIVE" ? 100 : formValues?.sellerPercent || 0),
            escrowAdvisorCommission: EscrowAdvisorFees || 0,
            platformFees: data.platformFee,
            otherCharge: data.vatFee,
            totalAmount: data.totalAmount,
            buyerAmount: data.buyerAmount,
            sellerTransactionFee: data.sellerTransactionFee,
            sellerAmount: data.sellerAmount,
            buyerTransactionFee: data.buyerTransactionFee,
            buyerAdvisorFee: data.buyerAdvisorFee,
            sellerAdvisorFee: data.sellerAdvisorFee,
            minimumPlatformCharge: data.minimumPlatformCharge,
            platformPercent: data.platformPercent
          });
        })
        .catch(() => {
          message.error("Oops! Something went wrong. Please try again later!");
        });
    }
  },
  [
    formValues?.invoiceAmount,
    formValues?.buyerPercent,
    formValues.currency,
    formValues.buyerCommissionPercent,
    EscrowAdvisorFees,
    sellerAlias,
    setTaxDetails,
    formValues?.sellerPercent,
    userAlias,
    taxDetails,
    setPlatformCharge,
    BuyerPercent,
    SellerPercent,
    hasAdvisor,
    BuyerCommissionPercent,
    SellerCommissionPercent,
    entityType,
    setInvoiceCalculations
  ]);

  useEffect(() => {
    if(showData?.buyerAmount !==""){
      setBuyerAmount(showData.buyerAmount);
    }
  }, [showData]);
   
     
  

  return formValues?.invoiceAmount ? (
    <div className="position-relative">
        <hr className="lightgrayHr" />
        <div className="titleText mb-4 mt-4">Payment information</div>
      {
        formValues?.transactionType ==  "RECEIVE" ? 
        <>
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
                  {/* <tr>
                    <td className="p-2 ">
                      <div className="subText_small">Trustin platform fee to be paid by Seller</div>
                    </td>
                    <td className="p-2 text-end ">
                      <div className="subText_small">
                        {`${isNaN(showData?.buyerTransactionFee) ? "0.00" : showData.buyerTransactionFee} ${showData.currency}`}
                      </div>
                    </td>
                  </tr>   */}
                  {/* <tr>
                    <td className="p-2 ">
                      <div className="subText_small">Amount to be paid by seller </div>
                    </td>
                    <td className="p-2 text-end ">
                      <div className="subText_small">
                        {`${isNaN(showData?.buyerAmount) ? "0.00" : Number(showData?.buyerAmount).toLocaleString()} ${showData.currency}`}
                      </div>
                    </td>
                  </tr> */}
                  <tr>
                    <td className="p-2 ">
                      <div className="subText_small">Amount to be received by {formValues?.userType == "SELLERPOA" ? "Seller's POA" : "Seller" }  </div>
                    </td>
                    <td className="p-2 text-end ">
                      <div className="subText_small">
                        {`${Number(showData.sellerAmount).toLocaleString()} ${showData.currency}`}
                      </div>
                    </td>
                  </tr>
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
              </Card>
              </Col>
          </Row>
          <ul className="stepDetails_medium_sub my-4">
            <li>
              Total amount to be transferred to the bank account.
            </li>
            <li>
            Amount transferred to trustIn (excluding escrow fees) will be safeguarded in UAE central bank, authorised bank until your vendor has 
  provided fulfilment proof and you instruct TrustIn to release the payment.
            </li>
            <li>
            We will notify both the parties by email on every action and steps. Involved parties can track the live status on the platform as well.
            </li>
          </ul>
      </> :
        <> 
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
                      <div className="subText_small">Trustin platform fee to be paid by { formValues?.isPartyPoa ? `POA of` : "" } {modifyCresetUserType(userAlias,'buyer')}  ({BuyerPercent}%)</div>
                    </td>
                    <td className="p-2 text-end ">
                      <div className="subText_small">
                        {`${isNaN(showData?.buyerTransactionFee) ? "0.00" : showData.buyerTransactionFee} ${showData.currency}`}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 ">
                      <div className="subText_small">Trustin platform fee to be paid by { formValues?.isCounterPoa ? `POA of` : "" } {modifyCresetUserType(userAlias,'seller')}  ({SellerPercent}%)</div>
                    </td>
                    <td className="p-2 text-end ">
                      <div className="subText_small">
                        {`${isNaN(showData?.sellerTransactionFee) ? "0.00" : showData.sellerTransactionFee} ${showData.currency}`}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 ">
                      <div className="subText_small">Amount to be paid by  { formValues?.isPartyPoa ? `POA of ` : "" } {modifyCresetUserType(userAlias,'buyer')}  </div>
                    </td>
                    <td className="p-2 text-end ">
                      <div className="subText_small">
                        {`${isNaN(showData?.buyerAmount) ? "0.00" : Number(showData?.buyerAmount).toLocaleString()} ${showData.currency}`}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 ">
                      <div className="subText_small">Amount to be received by { formValues?.isCounterPoa ? `POA of` : "" } {modifyCresetUserType(userAlias,'seller')} </div>
                    </td>
                    <td className="p-2 text-end ">
                      <div className="subText_small">
                        {`${Number(showData.sellerAmount).toLocaleString()} ${showData.currency}`}
                      </div>
                    </td>
                  </tr>
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
        </>
      }
    </div>
  ) : null;
};

export default RequestPaymentDetails;