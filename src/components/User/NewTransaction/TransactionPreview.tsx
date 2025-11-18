import { Card, Col, Image, Popover, Row, Steps, Tooltip } from "antd";
import MoveTo from "../../../assets/img/moveTo.svg";
import WhiteUserFull from "../../../assets/img/WhiteUserFull.svg";
import WhiteEmail from "../../../assets/img/white_email.svg";
import Globe from "../../../assets/img/white_globe.svg";
import Payment from "../../../assets/img/white_payment.svg";
import Doc from "../../../assets/img/grayDoc.svg";
import Create from "../../../assets/img/createEscrow.svg";
import Suitcase from "../../../assets/img/sellerJob.svg";
import Flag from "../../../assets/img/whiteFlag.svg";
import {
  TXN_STATUS,
  USER_TYPE_TEXT,
  getLocalStorage,
  modifyCresetUserType,
  moneyFormat,
  ordinalSuffixOf,
  toTitleCase,
} from "../../Common/Constants";
import { BoldText } from "../../ui-elements/TextRepo";
import CustomContractDetails from "./customContractList";
import { useEffect, useState } from "react";
import { getDynamicInputFields } from "../../../services/admin";
import dayjs from "dayjs";
import { Document, Page } from "react-pdf";
import GrayInfo from '../../../assets/img/info_light.svg';
import PDFPreview from "../../Common/PdfPreviewIcon";
import PdfPreviewModal from "../../Models/PdfPreviewModal";
import { getForexExchangeRate } from "../../../services/user";
import { InfoCircleOutlined } from "@ant-design/icons";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TransactionPreview = (props: any): any => {
  const { contractDetail, escrowAdvisorDetails, sourceOfFundUrls, taxDetails, buyerDetails, sellerDetails, categoryName, itemName, signature, BuyerCountry, invoiceCalculations, customAttachUrl, customAttachmentUrls, payoutAccount } = props;

  const { Step } = Steps;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const activePayment = contractDetail?.milestoneCount;
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [DynamicInputFields, setDynamicInputFields] = useState<any>({});
  const [imagUrl, setImagUrl] = useState<any>("");
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const buyerCommissionPercent = !contractDetail?.buyerCommissionPercent ? 100 : contractDetail?.buyerCommissionPercent;
  const sellerCommissionPercent = contractDetail?.sellerCommissionPercent || 0;
  const [forexExchangeRate, setForexExchangeRate] = useState<number | undefined>();
  const [isForexExchangeRateLoading, setIsForexExchangeRateLoading] = useState(false);
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  const getDynamicLabel = () => {
    if (contractDetail?.dynamicInputFields?.length > 0) {
      const data: any = [];
      getDynamicInputFields(contractDetail?.itemCategoryAlias)
        .then((res: any) => {
          for (
            let i = 0;
            i <= contractDetail?.dynamicInputFields?.length;
            i++
          ) {
            for (let j = 0; j < res?.data?.length; j++) {
              if (
                contractDetail?.dynamicInputFields[i]?.aliasName ===
                res?.data[j]?.aliasName
              ) {
                data.push({
                  label: res?.data[j]?.name,
                  value: contractDetail?.dynamicInputFields?.[i]?.value,
                });
              }
            }
          }
          setDynamicInputFields(data);
        })
        .catch(() => {
          return false;
        });
    }
  };


  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  useEffect(() => {
    getDynamicLabel();
  }, [])
  
  const handlePDFView = (url: any) => {
    if (url) {
      setImagUrl(url);
      setverifyVisible(true);
    }
  };

  const formatReleaseDate = (releaseDate: any, status: any) => {
    return status === TXN_STATUS.RELEASED
      ? ` completed on ${dayjs(releaseDate).format("DD-MM-YYYY")}`
      : ` yet to be released on ${dayjs(releaseDate).format("DD-MM-YYYY")}`;
  };

  useEffect(() => { 
    if (payoutAccount?.currency != null && payoutAccount?.accountCurrency != null && payoutAccount?.currency !== payoutAccount?.accountCurrency) {
      setIsForexExchangeRateLoading(true);
      getForexExchangeRate({sourceCurrencyCode: payoutAccount?.currency, destinationCurrencyCode: payoutAccount?.accountCurrency, srcAmount: "1"}).then((response: any) => {
        setForexExchangeRate(response.data.sell.amount);
      }).finally(() => {
        setIsForexExchangeRateLoading(false)
      })
    }
  }, [payoutAccount?.currency, payoutAccount?.accountCurrency])  

  return (
    <div className="">
      <div className="d-flex">
        <Image
          src={Create}
          preview={false}
          className="mt-2 mb-2"
          alt="escrowimage"
        />
        <span className="mx-3 mt-1 mb-5 welcome">
          <b>Agreement details preview</b>
        </span>
      </div>
      <Row className="endtoend" gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
        <Col span={24}>
          <div className="bg-admin-card seller-bg-admin-card">
            <Row
              gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}
              className=" endtoend four-buyer-block form-body"
            >
              <>
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={7}
                  xl={7}
                  span={12}
                  className="columnData"
                >
                  <div className="buyerBox capitalize">
                    From {contractDetail?.contractStartedBy !== "ESCROW_ADVISOR" ? modifyCresetUserType(userAlias, toTitleCase(contractDetail?.contractStartedBy.toLowerCase())) : modifyCresetUserType(userAlias, "Buyer")}
                  </div>
                  <div className="d-flex my-3">
                    <Image src={WhiteUserFull} alt="box" preview={false} />
                    <div className="whiteTitle18 px-3">{buyerDetails?.name}</div>
                  </div>
                  <div className="d-flex my-3">
                    <Image src={WhiteEmail} alt="box" preview={false} />
                    <div className="whiteTitle18 px-3">{buyerDetails?.email}</div>
                  </div>
                  <div className="d-flex my-3">
                    <Image src={Globe} alt="box" preview={false} />
                    <div className="whiteTitle18 ps-3 noWrap overflowText">
                      <Tooltip
                        title={
                          (BuyerCountry ? BuyerCountry : buyerDetails?.countryAlias) &&
                          (BuyerCountry?.length || buyerDetails?.countryAlias?.length) * 7 > 136
                            ? BuyerCountry || buyerDetails?.countryAlias
                            : null
                        }
                        overlayClassName='custom-tooltip'
                      >
                        {BuyerCountry ? BuyerCountry : buyerDetails?.countryAlias}
                      </Tooltip>
                    </div>
                    <Tooltip
                      title={"Residance"}
                      overlayClassName="custom-tooltip signupTooltip"
                    >
                      <span className="nationality_info">
                        <InfoCircleOutlined />
                      </span>
                    </Tooltip>
                  </div>
                  <div className="d-flex my-3">
                    <Image src={Flag} alt="box" preview={false} />                           
                    <div className="whiteTitle18 ps-3 noWrap overflowText">
                      <Tooltip
                        title={
                          (buyerDetails?.kycNationality?.length || buyerDetails?.nationalityName?.length) * 7 > 136
                            ? (buyerDetails?.kycNationality || buyerDetails?.nationalityName)
                            : null
                        }
                        overlayClassName='custom-tooltip'
                      >
                        {buyerDetails?.kycNationality || buyerDetails?.nationalityName}
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
                  <div className="d-flex my-3">
                    <Image src={Payment} alt="box" preview={false} />
                    <div className="whiteTitle18 bold px-3">
                      {moneyFormat(
                        contractDetail.currency ?? "AED",
                        contractDetail?.contractStartedBy === 'SELLER' ? isNaN(Number(invoiceCalculations?.sellerAmount)) ? 0 : Number(invoiceCalculations?.sellerAmount) : isNaN(Number(invoiceCalculations?.buyerAmount)) ? 0 : Number(invoiceCalculations?.buyerAmount)
                      )}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={3} lg={3} xl={3} className="mb-3">
                  <div>
                    <Image src={MoveTo} alt="move" preview={false} />
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={7}
                  xl={7}
                  span={contractDetail?.contractStatus === "2" ? 7 : 12}
                  className="columnData"
                >
                  <div className="buyerBox">
                    To {contractDetail?.contractStartedBy !== "ESCROW_ADVISOR" ? contractDetail?.contractStartedBy === "BUYER" ? modifyCresetUserType(userAlias, "Seller") : modifyCresetUserType(userAlias, "Buyer") : modifyCresetUserType(userAlias, "Seller")}
                  </div>
                  <div className="d-flex my-3">
                    <Image src={WhiteUserFull} alt="box" preview={false} />
                    <div className="whiteTitle18 px-3">
                      {sellerDetails?.name}
                    </div>
                  </div>
                  <div className="d-flex my-3">
                    <Image src={WhiteEmail} alt="box" preview={false} />
                    <div className="whiteTitle18 px-3">
                      {sellerDetails?.email}
                    </div>
                  </div>
                  <div className="d-flex my-3">
                    <Image src={Globe} alt="box" preview={false} />
                    <div className="whiteTitle18 ps-3 noWrap overflowText">
                      <Tooltip
                        title={sellerDetails?.countryAlias && sellerDetails?.countryAlias.length * 7 > 136 ? sellerDetails?.countryAlias : null}
                        overlayClassName='custom-tooltip'
                      >
                        {sellerDetails?.countryAlias}
                      </Tooltip>
                    </div>
                    <Tooltip
                      title={"Residance Country"}
                      overlayClassName="custom-tooltip signupTooltip"
                    >
                      <span className="nationality_info">
                        <InfoCircleOutlined />
                      </span>
                    </Tooltip>
                  </div>
                  <div className="d-flex my-3">
                    <Image src={Flag} alt="box" preview={false} />                           
                    <div className="whiteTitle18 ps-3 noWrap overflowText">
                      <Tooltip
                        title={
                          (sellerDetails?.kycNationality?.length || sellerDetails?.nationalityName?.length) * 7 > 136
                            ? (sellerDetails?.kycNationality || sellerDetails?.nationalityName)
                            : null
                        }
                        overlayClassName='custom-tooltip'
                      >
                        {sellerDetails?.kycNationality || sellerDetails?.nationalityName}
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
                  <div className="d-flex my-3">
                    <Image src={Payment} alt="box" preview={false} />
                    <div className="whiteTitle18 bold px-3">
                      {moneyFormat(
                        contractDetail.currency ?? "AED",
                        contractDetail?.contractStartedBy === 'SELLER' ? Number(invoiceCalculations?.buyerAmount) : Number(invoiceCalculations?.sellerAmount)
                      )}
                    </div>
                  </div>
                </Col>
                {(userType === "ESCROW_ADVISOR" || contractDetail?.advisorContactEmail) ? <Col xs={24} sm={24} md={7} lg={7} xl={7} className="columnData">
                  <div className="buyerBox">Escrow advisor</div>
                  <div className="d-flex my-3 align-items-baseline">
                    <Image
                      src={WhiteUserFull}
                      alt="box"
                      preview={false}
                    />
                    <div className="whiteTitle18 px-3">
                      {escrowAdvisorDetails?.name}
                    </div>
                  </div>
                  <div className="d-flex my-3 align-items-baseline">
                    <Image src={WhiteEmail} alt="box" preview={false} />
                    <div className="whiteTitle18 px-3">
                      {escrowAdvisorDetails?.email}
                    </div>
                  </div>
                  <div className="d-flex my-3">
                    <Image src={Globe} alt="box" preview={false} />
                    <div className="whiteTitle18 px-3">
                      {escrowAdvisorDetails?.countryAlias}
                    </div>
                  </div>
                  <div className="d-flex my-3">
                    <Image src={Payment} alt="box" preview={false} />
                    <div className="whiteTitle18 bold px-3">
                      {moneyFormat(
                        contractDetail.currency,
                        Number(contractDetail?.escrowAdvisorCommission)
                      )}
                    </div>
                  </div>
                </Col> : ""}
              </>
            </Row>
          </div>
          <div className="mt-4">
            <Card className="px-4">
              <div className="stepDetails mb-4 mt-3">Category details</div>
              <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Suitcase} alt="user" preview={false} />
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Item categories</div>
                      <div className="stepDetails_medium fw-400 ">
                        {itemName}
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
                        {categoryName}
                      </div>
                    </div>
                  </div>
                </Col>
                {DynamicInputFields?.length > 0 &&
                  DynamicInputFields.map((inputField: any, index: number) => (
                    <Col
                      key={index}
                      xs={24}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className="mb-4"
                    >
                      <div className="d-flex">
                        <Image src={Doc} alt="user" preview={false} />
                        <div className="mx-3">
                          <div className="stepDetails_medium_sub">
                            {inputField?.label}
                          </div>
                          <div className="stepDetails_medium fw-400">
                            {inputField?.value}
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Suitcase} alt="user" preview={false} />
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Item name</div>
                      <div className="stepDetails_medium fw-400">
                        {contractDetail?.name}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Doc} alt="user" preview={false} className="doc-img" />
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">
                        Product description
                      </div>
                      <div className="stepDetails_medium fw-400 product-details-word-wrap">
                        {contractDetail?.description
                          ? contractDetail?.description
                          : "-"}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
            {/* <hr className="lightgrayHr" /> */}
            <Row
              gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}
              justify="space-between"
            >
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="stepDetails mt-3">Payment details</div>
              </Col>
            </Row>
            {contractDetail?.isMilestone && (
              <Col span={24} className="mt-4 payment-in-milestone">
                <BoldText children="Milestones funds" className="text-muted" />
                <Col span={24} className="res_step">
                  <Steps
                    progressDot
                    current={activePayment || 0}
                    direction="vertical"
                  >
                    {contractDetail?.milestoneList?.map(
                      (data: any, index: any) => {
                        return (
                          <Step
                            key={index}
                            title={`${ordinalSuffixOf(index + 1)} milestone`}
                            // title={`${ordinalSuffixOf(index + 1)} milestone (${data?.amountPercent || 0}%)`}
                            description={
                              <>
                                {`${data.name} ${formatReleaseDate(
                                  data.releaseDate,
                                  data.transactionStatus
                                )}`}
                                <p className={Width > 550 ? "position-absolute top-0 end-0 fw-5" : "position-relative top-0 end-0 fw-5"}>
                                  {moneyFormat(
                                    contractDetail.currency,
                                    Number(data?.amount || 0)
                                  )}
                                </p>
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
            {/* {taxDetails?.plateformFees || taxDetails?.vatCharges ? */}

            <Card className="paymentCard p-2">
              <table className="w-100 paymentTable">
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Agreement amount</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(contractDetail?.invoiceAmount ? contractDetail?.invoiceAmount : 0).toLocaleString()} ${contractDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      {
                        <>
                          TrustIn fees ({ invoiceCalculations?.platformPercent ?? 0 }) + (
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
                      {`${isNaN(Number(invoiceCalculations?.platformFee)) ? "0.00" : Number(invoiceCalculations?.platformFee).toLocaleString()} ${contractDetail.currency} + ${isNaN(Number(invoiceCalculations?.vatFee)) ? "0.00" : Number(invoiceCalculations?.vatFee).toLocaleString()} ${contractDetail.currency}`}
                    </div>
                  </td>
                </tr>
                {(userType === USER_TYPE_TEXT.ESCROW_ADVISOR || contractDetail?.advisorContactEmail) ? (
                  <>
                    <tr>
                      <td className="p-2 ">
                        <div className="subText_small">Escrow advisor fee (Inclusive of VAT)</div>
                      </td>
                      <td className="p-2 text-end ">
                        <div className="subText_small">
                          {`${contractDetail?.escrowAdvisorCommission} ${contractDetail.currency}`}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 ">
                        <div className="subText_small">Escrow advisor fee to be paid by {modifyCresetUserType(userAlias, 'buyer')} ({(buyerCommissionPercent || 0)}%)</div>
                      </td>
                      <td className="p-2 text-end ">
                        <div className="subText_small">
                          {`${invoiceCalculations?.buyerAdvisorFee} ${contractDetail.currency}`}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 ">
                        <div className="subText_small">Escrow advisor fee to be paid by {modifyCresetUserType(userAlias, 'seller')} ({(sellerCommissionPercent || 0)}%)</div>
                      </td>
                      <td className="p-2 text-end ">
                        <div className="subText_small">
                          {`${invoiceCalculations?.sellerAdvisorFee} ${contractDetail.currency}`}
                        </div>
                      </td>
                    </tr>
                  </>
                ) : null}
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">TrustIn platform fees to be paid by {modifyCresetUserType(userAlias, 'buyer')} ({isNaN(contractDetail.buyerPercent) ? "0.00" : contractDetail.buyerPercent}%)</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${isNaN(invoiceCalculations?.buyerTransactionFee) ? "0.00" : invoiceCalculations?.buyerTransactionFee} ${contractDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">TrustIn platform fees to be paid by {modifyCresetUserType(userAlias, 'seller')} ({isNaN(contractDetail.sellerPercent) ? "0.00" : contractDetail.sellerPercent}%)</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${isNaN(invoiceCalculations.sellerTransactionFee) ? "0.00" : invoiceCalculations.sellerTransactionFee} ${contractDetail.currency}`}
                    </div>
                    {forexExchangeRate && payoutAccount?.accountCurrency != null && payoutAccount?.currency !== payoutAccount?.accountCurrency ? 
                    <div style={{fontSize: "14px"}}>
                      {!isForexExchangeRateLoading ? `(${Number((Number(invoiceCalculations?.sellerTransactionFee) * Number(forexExchangeRate)).toFixed(2)).toLocaleString()} ${payoutAccount?.accountCurrency})` : 'Calculating...'}
                    </div>  : null}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Amount to be paid by {modifyCresetUserType(userAlias, 'buyer')}</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${isNaN(Number(invoiceCalculations.buyerAmount)) ? "0.00" : Number(invoiceCalculations.buyerAmount).toLocaleString()} ${contractDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Amount to be received by {modifyCresetUserType(userAlias, 'seller')}</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${isNaN(Number(invoiceCalculations.sellerAmount)) ? "0.00" : Number(invoiceCalculations.sellerAmount).toLocaleString()} ${contractDetail.currency}`}
                    </div>
                    {forexExchangeRate && payoutAccount?.accountCurrency != null && payoutAccount?.currency !== payoutAccount?.accountCurrency ? 
                    <div style={{fontSize: "14px"}}>
                      {!isForexExchangeRateLoading ? `(${Number((Number(invoiceCalculations?.sellerAmount) * Number(forexExchangeRate)).toFixed(2)).toLocaleString()} ${payoutAccount?.accountCurrency})` : 'Calculating...'}
                    </div>  : null}
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <div className="titleText fw-400">Total amount</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="mainTitle">
                      {`${isNaN(Number(invoiceCalculations.totalAmount)) ?
                        (isNaN(Number(contractDetail?.invoiceAmount)) ? "0.00" :
                          Number(contractDetail.invoiceAmount).toLocaleString())
                        : Number(invoiceCalculations.totalAmount).toLocaleString()} 
    ${contractDetail.currency}`}
                    </div>
                  </td>
                </tr>
              </table>
            </Card>
            <Row className="mx-4 mt-4 green-status">{contractDetail?.buyerAlias !== userAlias &&
              userType === "USER" &&
              contractDetail?.milestoneList?.[activePayment > 0 ? activePayment - 1 : 0]?.paymentStatus ===
              "COMPLETED" && (
                <>
                  <Col span={12}>
                    {" "}
                    {/* <BoldText
                      className="invoice-amount"
                      children="Total amount paid by buyer"
                    /> */}
                  </Col>
                  <Col span={12}>
                    {" "}
                    <BoldText
                      children={`${moneyFormat(
                        contractDetail?.currency ? contractDetail?.currency : "AED",
                        (Number(contractDetail?.milestoneList?.[activePayment > 0 ? activePayment - 1 : 0]?.transactionAmount) + Number(contractDetail?.escrowAdvisorCommission ? (Number(contractDetail?.escrowAdvisorCommission) * Number(contractDetail?.buyerCommissionPercent)) / 100 : 0) +
                          (((Number((contractDetail?.milestoneList?.[activePayment > 0 ? activePayment - 1 : 0]?.transactionAmount * taxDetails?.plateformFees) / 100)) + Number((((((contractDetail?.milestoneList?.[activePayment > 0 ? activePayment - 1 : 0]?.transactionAmount * taxDetails?.plateformFees) / 100) *
                            taxDetails?.vatCharges) / 100)))) * Number(contractDetail.buyerPercent)) / 100).toFixed(2))
                        }`}
                      className="text-end"
                    />
                  </Col>
                </>
              )}
            </Row>
            {(contractDetail?.customPoint &&
              Object.keys(contractDetail?.customPoint).length > 0 || customAttachmentUrls?.length) ? (
              <>
                <hr className="lightgrayHr" />
                <CustomContractDetails
                  customFieldList={contractDetail?.customPoint}
                  customAttachUrl={customAttachUrl}
                  customAttachmentUrls={customAttachmentUrls}
                  transactionpreview="true"
                />
              </>
            ) : (
              ""
            )}
            <hr className="lightgrayHr" />
            {!contractDetail?.isMilestone ?
              <Card className="grayCard p-3">
                <div className="stepDetails mt-3" style={{ whiteSpace: "wrap" }}>Release Payment: Conditions & Required Documents</div>
                {contractDetail?.documentList?.length > 0 && contractDetail?.documentList?.map((data: any, index: any) => {
                  return (
                    <div
                      className={
                        Width > 1200
                          ? "d-inline-flex align-items-center w-100 position-relative mb-2 mt-3"
                          : "d-flex flex-column  w-100 position-relative mb-2 mt-3"
                      }
                      key={index}
                    >
                      <span
                        className={
                          Width > 1200
                            ? "d-inline-flex align-items-start w-100"
                            : "d-flex align-items-start w-100"
                        }
                      >
                        {/* <FiFileText className="me-2 text-muted fs-20x" /> */}
                        <Image
                          src={Doc}
                          preview={false}
                          className="text-muted fs-20x preview-file-img"
                          alt="Document file"
                        />
                        <div className="mx-3">
                          <div className="stepDetails_medium_sub product-details-word-wrap">
                            {toTitleCase(data)}
                          </div>
                        </div>
                      </span>
                    </div>
                  );
                })}
                <hr className="lightgrayHr" />
              </Card>
              :
              <Card className="grayCard p-3 ">
                <div className="stepDetails mt-3" style={{ whiteSpace: "wrap" }}>Release Payment: Conditions & Required Documents</div>
                {contractDetail?.milestoneList?.map((data: any, indexList: any) => {
                  return <div
                    className={Width > 1200 ? "align-items-center w-100 position-relative mb-2 mt-3" : "d-flex flex-column  w-100 position-relative mb-2 mt-3"}
                    key={indexList}
                  >
                    <div>{ordinalSuffixOf(indexList + 1)} milestone - {
                      data.name
                    }</div>
                    {data?.document?.map((data2: any, index: any) => {
                      return (
                        <div key={index}>
                          <span className={Width > 1200 ? "d-inline-flex align-items-center w-100" : "d-flex align-items-center w-100"}>
                            {/* <FiFileText className="me-2 text-muted fs-20x" /> */}
                            <Image src={Doc} preview={false} className="text-muted fs-20x file-img" />
                            <div className="mx-3 ">
                              <div className="stepDetails_medium_sub">
                                {toTitleCase(data2)}
                              </div>
                            </div>
                          </span>
                        </div>
                      )
                    })
                    }
                    <hr className="lightgrayHr" />
                  </div>
                })
                }
              </Card>
            }
          </div>
          {userType === "BUYER" ? null : sourceOfFundUrls?.length ? (
            <Card className="grayCard p-3 py-0">
              <div className="stepDetails my-3">Source of funds</div>
              <div className="d-flex flex-wrap gap-2">
                {sourceOfFundUrls.map((url: string, index: number) => (
                  <div key={index} className="mb-3">
                    {url.toLowerCase().includes(".pdf") ? (
                      <div className="signature-image m admin-panel-pdf-preview pdf-preview-adjust">
                        <PDFPreview
                          url={url}
                          onPreviewClick={() => handlePDFView(url)}
                        />
                      </div>
                    ) : (
                      <Image
                        className="signature-image m"
                        src={url}
                        preview={true}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
          {userType === "ESCROW_ADVISOR" ? "" : signature ? 
              <Card className="grayCard p-3 pt-0">
                <div className="stepDetails my-3">
                  {contractDetail?.contractStartedBy ? modifyCresetUserType(userAlias, toTitleCase(contractDetail?.contractStartedBy.toLowerCase())) + " sign" : `${modifyCresetUserType(userAlias, 'seller')} sign`} </div>
                {/* <Image src={signature} alt="from Sign" height={100} width={150} /> */}
                {signature && typeof signature === 'string' && signature.includes(".pdf") ? (
                  <div className="signature-image m admin-panel-pdf-preview">
                    <Document
                      file={signature}
                      externalLinkRel="_blank"
                    >
                      <Page pageNumber={1} width={50} />
                    </Document>
                  </div>
                ) : (
                  <Image
                    className="signature-image m"
                    src={signature}
                    preview={true}
                  ></Image>
                )}
              </Card> : ""
            }
        </Col>
      </Row>
      <PdfPreviewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
    </div>
  );
};

export default TransactionPreview;
