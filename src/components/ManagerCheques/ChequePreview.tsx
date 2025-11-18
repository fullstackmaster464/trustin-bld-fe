import { Card, Col, Image, Popover, Row, Tooltip } from "antd";
import MoveTo from "../../assets/img/moveTo.svg";
import WhiteUserFull from "../../assets/img/WhiteUserFull.svg";
import WhiteEmail from "../../assets/img/white_email.svg";
import Globe from "../../assets/img/white_globe.svg";
import Payment from "../../assets/img/white_payment.svg";
import Create from "../../assets/img/createEscrow.svg";
import Doc from "../../assets/img/grayDoc.svg";
import Flag from "../../assets/img/whiteFlag.svg";
import Suitcase from "../../assets/img/sellerJob.svg";
import {
  capitalizeFirst,
  getFormattedValue,
  MC_TYPE, 
  moneyFormat,
  USER_TYPE_TEXT,
} from "../Common/Constants";
import CustomContractDetails from "./customContractList";
import PDFPreview from "../Common/PdfPreviewIcon";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import GrayInfo from "../../assets/img/info_light.svg";
import Doc_large from "../../assets/img/Doc_large.svg";
import UserHalf from "../../assets/img/userHalf.svg";
import Cheque from "../../assets/img/Cheque.svg";
import CommentImg from "../../assets/img/Comment.svg";
import moment from "moment";
import { InfoCircleOutlined } from "@ant-design/icons";
import CountryInfoItem from "../Common/CountryInfoItem";

const ChequePreview = (props: any) => {
  const {
    chequeDetail,
    partyDetails,
    counterDetails,
    bankDetails,
    BuyerCountry,
    customAttachUrl,
    customAttachmentUrls,
    fileList2,
    invoiceCalculations,
    taxDetails,
    signature,
    preparedCheques,
    formValues,
    itemdetails,
    party,
    counterParty,
    sourceOfFundUrls,
    countryList
  } = props;

  const [imagUrl, setImagUrl] = useState<any>("");
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);

  const handlePDFView = (url: any) => {
    if (url) {
      setImagUrl(url);
      setverifyVisible(true);
    }
  };

  
  const contractStartedBy = chequeDetail?.contractStartedBy == "BUYER" ? USER_TYPE_TEXT.BUYER : 
                            chequeDetail?.contractStartedBy == "BUYERPOA" ? "POA of Buyer" :
                            chequeDetail?.contractStartedBy == "SELLER" ? USER_TYPE_TEXT.SELLER :
                            chequeDetail?.contractStartedBy == "SELLERPOA" ? "POA of Seller" : null;
                             
  
       

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };

  useEffect(() => {
    const textContainer: any = document.getElementById("textContainer");
    const readMoreButton: any = document.getElementById("readMoreButton");

    if (
      textContainer &&
      readMoreButton &&
      textContainer.textContent.length > 180
    ) {
      const truncatedText = textContainer.textContent.slice(0, 180);
      textContainer.innerHTML = truncatedText;
      readMoreButton.style.display = "inline";
    }

    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  const CustomTooltip = ({
    text = "",
    maxLength = 75,
    overlayClassName = "",
  }) => {
    const truncatedText =
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    return (
      <Tooltip title={text} overlayClassName={overlayClassName}>
        <span className="Status">{truncatedText}</span>
      </Tooltip>
    );
  };

  interface IBlock {
    preparty: string;
    party: string;
    name: string;
    email: string;
    countryAlias: string;
    countryNationality: string;
    currency: string;
    amount: string;
    entityType: string;
  }

  const Blocks = ({
    preparty,
    party,
    name,
    email,
    countryAlias,
    countryNationality,
    currency,
    amount,
    entityType
  }: IBlock) => {
    return (
      <>
        <div className="buyerBox">
          {preparty} {party}
        </div>
        <div className="d-flex my-3">
          <Image src={WhiteUserFull} alt="box" preview={false} />
          <div className="whiteTitle18 px-3">{name}</div>
        </div>
        <div className="d-flex my-3">
          <Image src={WhiteEmail} alt="box" preview={false} />
          <div className="whiteTitle18 px-3">{email}</div>
        </div>
        <div className="d-flex my-3">
          <Image src={Globe} alt="box" preview={false} />
          <div className="whiteTitle18 ps-3 noWrap overflowText">
            <Tooltip
              title={countryAlias && countryAlias.length * 7 > 136 ? countryAlias : null}
              overlayClassName='custom-tooltip'
            >
              {countryAlias}
            </Tooltip>
          </div>
          <Tooltip
            title={"Residance country"}
            overlayClassName="custom-tooltip signupTooltip"
          >
            <span className="nationality_info">
              <InfoCircleOutlined />
            </span>
          </Tooltip>
        </div>
        {entityType === "INDIVIDUAL" ? 
        (
        <div className="d-flex my-3">
          <Image src={Flag} alt="box" preview={false} />                           
          <div className="whiteTitle18 ps-3 noWrap overflowText">
            <Tooltip
              title={countryNationality && countryNationality.length * 7 > 136 ? countryNationality : null}
              overlayClassName='custom-tooltip'
            >
              {countryNationality}
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
        </div>):null}
        <div className="d-flex my-3">
          <Image src={Payment} alt="box" preview={false} />
          <div className="whiteTitle18 bold px-3">
            {moneyFormat(currency, amount)}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="">
      <div className="d-flex mb-3">
        <Image
          src={Create}
          preview={false}
          className="mt-2 mb-2"
          alt="escrowimage"
        />
        <span className="mx-3 mt-1 welcome">
          <b>Agreement details preview</b>
        </span>
      </div>
      <Row className="endtoend" gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
        <Col span={24}>
          <div className="bg-admin-card seller-bg-admin-card">
            {formValues.transactionType === "RECEIVE" ? (
              <Row
                gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}
                className=" endtoend four-buyer-block form-body"
              >
                   <Col xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          span={12}
                          className="columnData">
                          <>
                         <div className="mb-3">
                          <div className="d-flex response-bluecard">
                               <div className="bluecard-smallbox">
                                    <img src={WhiteUserFull} alt="box"/>
                                    <p className="mt-2 mb-0">
                                      {party ?? "Seller"}
                                    </p>
                                  </div>

                          <div className="d-flex flex-column w-100 flex-fill mx-md-3 align-items-center justify-content-center bluecard-smallbox-inner-section">
                            <div
                              className="whiteTitle18 px-3 fs-5 text-break text-wrap mb-2 w-100 gap-2"
                              style={{ fontSize: "20px" }}
                            >
                              {partyDetails.name}
                            </div>
                            <div className="d-flex justify-content-between align-items-start flex-wrap w-100 px-3 gap-2 gap-md-3">
                              <div className="d-flex flex-wrap align-items-center gap-2">
                                <div className="d-flex align-items-center gap-1">
                                  <Image src={WhiteEmail} alt="email" preview={false} />
                                  <Tooltip
                                    title={
                                      partyDetails.email && partyDetails.email.length < 36
                                        ? partyDetails.email
                                        : null
                                    }
                                    placement="top"
                                    overlayClassName="leads-custom-tooltip"
                                  >
                                    <span
                                      className={
                                        Width > 640
                                          ? "whiteTitle18 px-2"
                                          : "whiteTitle18 px-2 noWrap signature-overflowtext"
                                      }
                                    >
                                      {partyDetails.email}
                                    </span>
                                  </Tooltip>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                  <Image src={Globe} alt="country" preview={false} />
                                  <span className="whiteTitle18 px-2">{partyDetails.countryAlias}</span>
                                </div>
                               {partyDetails?.entityType === "INDIVIDUAL" &&
                          (partyDetails?.kycNationality || partyDetails?.nationalityName) ? (
                            <div className="d-flex align-items-center gap-1">
                              <Image src={Flag} alt="nationality" preview={false} />
                              <span className="whiteTitle18 px-2">
                                {partyDetails.kycNationality ?? partyDetails.nationalityName}
                              </span>
                            </div>
                          ) : null}
                              </div>
                              <div className="d-flex align-items-center gap-2 mt-1 mt-sm-0">
                                <Image src={Payment} alt="payment" preview={false} />
                                <span className="whiteTitle18 px-2">
                                  {moneyFormat(chequeDetail.currency, chequeDetail?.buyerAmount)}
                                </span>
                              </div>
                            </div>
                          </div>
                            </div> 
                         </div>


                         <div className="my-3">
                          <div className="d-flex response-bluecard">
                                  <div className="bluecard-smallbox">
                                    <img src={WhiteUserFull} alt="box"/>
                                    <p className="mt-2 mb-0"> {counterParty ??"Buyer"}</p>
                                   </div>

                                  <div className="d-flex flex-column flex-md-row my-0 align-items-start align-items-md-center w-100">
                                        <div className="flex-fill mx-md-3 bluecard-smallbox-inner-section">
                                          <div className="whiteTitle18 px-3 fs-5 text-break text-wrap mb-2">
                                            {counterDetails.name}
                                          </div>
                                          <div className="d-flex flex-column flex-sm-row mx-3 flex-wrap gap-2">
                                            <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0">
                                              <Image src={WhiteEmail} alt="box" preview={false} />
                                              <span className="whiteTitle18 px-2 text-break text-wrap">{counterDetails.email}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                              <Image src={Globe} alt="box" preview={false} />
                                              <span className="whiteTitle18 px-2 text-break text-wrap">{counterDetails.countryAlias}</span>
                                            </div>
                                            {counterDetails?.entityType === "INDIVIDUAL" ? 
                                            (<div className="d-flex my-3">
                                              <Image src={Flag} alt="box" preview={false} />
                                              <span className="whiteTitle18">{counterDetails.kycNationality ?? counterDetails.nationalityName}</span>
                                            </div>) : null}
                                          
                                          </div>
                                        </div>
                                      </div> 
                            </div> 
                         </div>
                          </>
                        </Col>

              </Row>
            ) : (
              <>
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
                      <Blocks
                        preparty={"From"}
                        party={party}
                        name={partyDetails.name}
                        email={partyDetails.email}
                        // countryAlias={
                        //   BuyerCountry ? BuyerCountry : partyDetails?.countryAlias
                        // }
                        // countryNationality={
                        //   partyDetails?.kycNationality ?  partyDetails?.kycNationality : partyDetails?.nationalityName
                        // }
                        countryAlias={getFormattedValue([BuyerCountry, partyDetails?.countryAlias, partyDetails?.countryName ])}
                        countryNationality={getFormattedValue([partyDetails?.kycNationality , partyDetails?.nationalityName ])}
                        currency={chequeDetail.currency}
                        amount={
                          [USER_TYPE_TEXT.BUYER,USER_TYPE_TEXT.BUYERPOA].includes(chequeDetail?.contractStartedBy)
                            ? chequeDetail.buyerAmount
                            : chequeDetail.sellerAmount
                        }
                        entityType={partyDetails?.entityType}
                      />
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
                      span={chequeDetail?.contractStatus === "2" ? 7 : 12}
                      className="columnData"
                    >
                      <Blocks
                        preparty={"To"}
                        party={counterParty}
                        name={counterDetails.name}
                        email={counterDetails.email}
                        // countryAlias={counterDetails?.countryAlias}
                        // countryNationality={counterDetails?.kycNationality ?? counterDetails?.nationalityName}
                        countryAlias={getFormattedValue([counterDetails?.countryAlias, counterDetails?.countryName ])}
                        countryNationality={getFormattedValue([counterDetails?.kycNationality, counterDetails?.nationalityName ])}
                        currency={chequeDetail.currency}
                        amount={
                          [USER_TYPE_TEXT.BUYER,USER_TYPE_TEXT.BUYERPOA].includes(chequeDetail?.contractStartedBy)
                            ? chequeDetail.sellerAmount
                            : chequeDetail.buyerAmount
                        }
                        entityType={counterDetails.entityType}
                      />
                    </Col>
                  </>
                </Row>

            </> 
            ) 
          }
          </div>


            {
              chequeDetail?.partyPoaEmail || chequeDetail?.counterPoaEmail ? 
              <div className="mt-4">
                <div className="bg-admin-card seller-bg-admin-card">
                <Row gutter={{ xs: 25, sm: 25, md: 12, lg: 12 }} className="gap-3 endtoend four-buyer-block form-body">
              {
               ["SELLERPOA","SELLER"].includes(chequeDetail?.contractStartedBy) ? 
                  <>
                   
                  {chequeDetail?.counterPoaEmail ?  
                    <Col 
                      span={chequeDetail?.contractStatus === "2" ? 7 : 24}
                    >
                      <div className="d-flex response-bluecard">
                          <div className="bluecard-smallbox">
                            <img src={WhiteUserFull} alt="box"/>
                            <p className="mt-2 mb-0">Seller</p>
                          </div>
                          <div className="d-flex flex-column flex-md-row my-0 align-items-start align-items-md-center w-100 ">
                              <div className="flex-fill mx-md-3 bluecard-smallbox-inner-section">
                                <div className="whiteTitle18 px-3 fs-5 text-break text-wrap">{chequeDetail?.counterPoaContactName}</div>
                                <div className="d-flex flex-column flex-sm-row mx-3 pt-2 flex-wrap gap-1">
                                  <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0 gap-2">
                                    <Image src={WhiteEmail} alt="box" preview={false} />
                                    <Tooltip
                                      title={
                                        chequeDetail?.counterPoaEmail && chequeDetail?.counterPoaEmail.length < 36
                                          ? chequeDetail?.counterPoaEmail
                                          : null
                                      }
                                      placement="top"
                                      overlayClassName="leads-custom-tooltip"
                                    >
                                      <span className={Width > 640 ? "whiteTitle18 px-2" : "whiteTitle18 px-2 noWrap signature-overflowtext"}>{chequeDetail?.counterPoaEmail}</span>
                                    </Tooltip>
                                  </div> 
                                </div>
                                    <CountryInfoItem
                                      icon={Globe}
                                      tooltipLabel="Residance country"
                                      countryName={chequeDetail?.counterPoaCountry}
                                      countryList={countryList}
                                    />
                                    {chequeDetail?.counterPoaTypeOfEntity === "INDIVIDUAL" ? (
                                      <CountryInfoItem
                                        icon={Flag}
                                        tooltipLabel="Nationality"
                                        countryName={chequeDetail?.counterPoaNationality}
                                        countryList={countryList}
                                      />
                                    ) : null} 
                                    
                              </div>
                          </div>
                      </div>
                      </Col> : null }

                       {chequeDetail?.partyPoaEmail ? 
                      <Col 
                      span={chequeDetail?.contractStatus === "2" ? 7 : 24}
                      >
                      <div className="d-flex response-bluecard">
                          <div className="bluecard-smallbox">
                            <img src={WhiteUserFull} alt="box"/>
                            <p className="mt-2 mb-0">Buyer</p>
                          </div>
                          <div className="d-flex flex-column flex-md-row my-0 align-items-start align-items-md-center w-100">
                              <div className="flex-fill mx-md-3 bluecard-smallbox-inner-section">
                                <div className="whiteTitle18 px-3 fs-5 text-break text-wrap">{chequeDetail?.partyPoaContactName}</div>
                                <div className="d-flex flex-column flex-sm-row mx-3 pt-2 flex-wrap gap-1">
                                  <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0 gap-2">
                                    <Image src={WhiteEmail} alt="box" preview={false} />
                                    <Tooltip
                                      title={
                                        chequeDetail?.partyPoaEmail && chequeDetail?.partyPoaEmail.length < 36
                                          ? chequeDetail?.partyPoaEmail
                                          : null
                                      }
                                      placement="top"
                                      overlayClassName="leads-custom-tooltip"
                                    >
                                      <span className={Width > 640 ? "whiteTitle18 px-2" : "whiteTitle18 px-2 noWrap signature-overflowtext"}>{chequeDetail?.partyPoaEmail}</span>
                                    </Tooltip>
                                  </div>
                                </div>
                                    <CountryInfoItem
                                      icon={Globe}
                                      tooltipLabel="Residance country"
                                      countryName={chequeDetail?.partyPoaCountry}
                                      countryList={countryList}
                                    />
                                    {chequeDetail?.partyPoaTypeOfEntity === "INDIVIDUAL" ? (
                                      <CountryInfoItem
                                        icon={Flag}
                                        tooltipLabel="Nationality"
                                        countryName={chequeDetail?.partyPoaNationality}
                                        countryList={countryList}
                                      />
                                    ) : null} 
                              </div>
                          </div>
                      </div>
                      </Col>
                  : null}
                      </> : 
                 <>
                    {chequeDetail?.partyPoaEmail ? 
                      <Col 
                      span={chequeDetail?.contractStatus === "2" ? 7 : 24}
                      className="columnData">
                      <div className="d-flex">
                          <div className="bluecard-smallbox">
                            <img src={WhiteUserFull} alt="box"/>
                            <p className="mt-2 mb-0">Buyer</p>
                          </div>
                          <div className="d-flex flex-column flex-md-row my-0 align-items-start align-items-md-center w-100">
                              <div className="flex-fill mx-md-3">
                                <div className="whiteTitle18 px-3 fs-5 text-break text-wrap">{chequeDetail?.partyPoaContactName}</div>
                                <div className="d-flex flex-column flex-sm-row mx-3 pt-2 flex-wrap gap-1">
                                  <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0 gap-2">
                                    <Image src={WhiteEmail} alt="box" preview={false} />
                                    <Tooltip
                                      title={
                                        chequeDetail?.partyPoaEmail && chequeDetail?.partyPoaEmail.length < 36
                                          ? chequeDetail?.partyPoaEmail
                                          : null
                                      }
                                      placement="top"
                                      overlayClassName="leads-custom-tooltip"
                                    >
                                      <span className={Width > 640 ? "whiteTitle18 px-2" : "whiteTitle18 px-2 noWrap signature-overflowtext"}>{chequeDetail?.partyPoaEmail}</span>
                                    </Tooltip>
                                  </div>
                                </div>
                                    <CountryInfoItem
                                      icon={Globe}
                                      tooltipLabel="Residance country"
                                      countryName={chequeDetail?.partyPoaCountry}
                                      countryList={countryList}
                                    />
                                    {chequeDetail?.partyPoaTypeOfEntity === "INDIVIDUAL" ? (
                                      <CountryInfoItem
                                        icon={Flag}
                                        tooltipLabel="Nationality"
                                        countryName={chequeDetail?.partyPoaNationality}
                                        countryList={countryList}
                                      />
                                    ) : null} 
                                  </div> 
                          </div>
                      </div>
                      </Col>
                  : null}
                  {chequeDetail?.counterPoaEmail ?  
                    <Col
                      span={chequeDetail?.contractStatus === "2" ? 7 : 24}
                      className="columnData">
                      <div className="d-flex">
                          <div className="bluecard-smallbox">
                            <img src={WhiteUserFull} alt="box"/>
                            <p className="mt-2 mb-0">Seller</p>
                          </div>
                          <div className="d-flex flex-column flex-md-row my-0 align-items-start align-items-md-center w-100">
                              <div className="flex-fill mx-md-3">
                                <div className="whiteTitle18 px-3 fs-5 text-break text-wrap">{chequeDetail?.counterPoaContactName}</div>
                                <div className="d-flex flex-column flex-sm-row mx-3 pt-2 flex-wrap gap-1">
                                  <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0 gap-2">
                                    <Image src={WhiteEmail} alt="box" preview={false} />
                                    <Tooltip
                                      title={
                                        chequeDetail?.counterPoaEmail && chequeDetail?.counterPoaEmail.length < 36
                                          ? chequeDetail?.counterPoaEmail
                                          : null
                                      }
                                      placement="top"
                                      overlayClassName="leads-custom-tooltip"
                                    >
                                      <span className={Width > 640 ? "whiteTitle18 px-2" : "whiteTitle18 px-2 noWrap signature-overflowtext"}>{chequeDetail?.counterPoaEmail}</span>
                                    </Tooltip>
                                  </div> 
                                </div>
                                 <CountryInfoItem
                                      icon={Globe}
                                      tooltipLabel="Residance country"
                                      countryName={chequeDetail?.counterPoaCountry}
                                      countryList={countryList}
                                    />
                                    {chequeDetail?.counterPoaTypeOfEntity === "INDIVIDUAL" ? (
                                      <CountryInfoItem
                                        icon={Flag}
                                        tooltipLabel="Nationality"
                                        countryName={chequeDetail?.counterPoaNationality}
                                        countryList={countryList}
                                      />
                                    ) : null} 
                              </div>
                          </div>
                      </div>
                      </Col> : null }
                      </>
              
              }


              
                </Row> 
                </div>
              </div>
              : null
            } 


            <div className="mt-4">
              <Card className="px-4">
              <div className="stepDetails mb-4 mt-3">Category details</div>
              <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Suitcase} alt="user" preview={false} className="seller-detials-icons"/>
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Item categories</div>
                      <div className="stepDetails_medium fw-400 ">
                        {itemdetails.itemCategory}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Suitcase} alt="user" preview={false} className="seller-detials-icons"/>
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">
                        Item type
                      </div>
                      <div className="stepDetails_medium fw-400">
                        {itemdetails.itemType}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Suitcase} alt="user" preview={false} className="seller-detials-icons"/>
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Item name</div>
                      <div className="stepDetails_medium fw-400">
                        {itemdetails.itemName}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Doc} alt="user" preview={false} className="doc-img seller-detials-icons" />
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">
                        Product description
                      </div>
                      <div className="stepDetails_medium fw-400 product-details-word-wrap">
                        {itemdetails.description ? itemdetails.description : "" }
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              </Card>
            </div>



          {
            formValues?.transactionType === MC_TYPE.RECEIVE ?
            <div className="mt-4">
              <Card className="px-4">
              <div className="stepDetails mb-4 mt-3 text-break text-wrap">{chequeDetail?.contractStartedBy == "SELLERPOA" ? "Seller's POA" : "Seller"} bank details</div>
              <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={UserHalf} alt="user" preview={false} className="seller-detials-icons"/>
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">
                        Name (as per bank account)
                         </div>
                      <div className="stepDetails_medium fw-400 text-break text-wrap">
                        {bankDetails.name}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Suitcase} alt="user" preview={false} className="seller-detials-icons"/>
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">
                        Number
                      </div>
                      <div className="stepDetails_medium fw-400 text-break text-wrap">
                        {bankDetails.IbanNumber}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Suitcase} alt="user" preview={false} className="seller-detials-icons"/>
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Bank name</div>
                      <div className="stepDetails_medium fw-400 text-break text-wrap">
                        {bankDetails.institutionName}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Doc} alt="user" preview={false} className="seller-detials-icons"/>
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Routing code</div>
                      <div className="stepDetails_medium fw-400 text-break text-wrap">
                        {bankDetails?.routingCode ?? "-"}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                  <div className="d-flex">
                    <Image src={Doc} alt="user" preview={false} className="seller-detials-icons"/>
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Routing scheme</div>
                      <div className="stepDetails_medium fw-400 text-break text-wrap">
                        {bankDetails?.routingScheme ?? "-"}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              </Card>
            </div>
            : ""
            }

          <div className="mt-4">
            <Card className="paymentCard p-2">
              <Row
                gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}
                justify="space-between"
              >
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="stepDetails mt-3">Payment details</div>
                </Col>
              </Row>
              <hr className="lightgrayHr" />
              {/* {taxDetails?.plateformFees || taxDetails?.vatCharges ? */}
              {formValues.transactionType === "RECEIVE" ?  
             
              <table className="w-100 paymentTable">
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Agreement amount</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(
                        chequeDetail.invoiceAmount
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      {
                        <>
                          TrustIn fees ({chequeDetail.platformPercent}) + (
                          {taxDetails?.vatCharges ?? process.env.COUNTRY_VAT})%
                          VAT
                          <Popover
                            className="ms-2"
                            placement="bottom"
                            content="VAT is applicable on transaction fee only"
                          >
                            <Image
                              src={GrayInfo}
                              alt="info icon"
                              preview={false}
                              height={16}
                              width={16}
                            />
                          </Popover>
                        </>
                      }
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(
                        invoiceCalculations.platformFee
                      ).toLocaleString()} ${chequeDetail.currency} + ${Number(
                        invoiceCalculations.vatFee
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                {/* <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      TrustIn platform fees to be paid by Seller 
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${invoiceCalculations.buyerTransactionFee} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                      
                { formValues?.transactionType !== MC_TYPE.RECEIVE ?
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      Amount to be paid by Seller
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(
                        invoiceCalculations.buyerAmount
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>*/}
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Amount to be received by {chequeDetail?.contractStartedBy == "SELLERPOA" ? "Seller's POA" : "Seller"}</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(
                        invoiceCalculations.sellerAmount
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr> 
                <tr>
                  <td className="p-2">
                    <div className="titleText fw-400">Total amount</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="mainTitle">
                      {`${Number(
                        invoiceCalculations.totalAmount
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
              </table> : 
               <table className="w-100 paymentTable">
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">Agreement amount</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(
                        chequeDetail.invoiceAmount
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      {
                        <>
                          TrustIn fees ({chequeDetail.platformPercent}) + (
                          {taxDetails?.vatCharges ?? process.env.COUNTRY_VAT})%
                          VAT
                          <Popover
                            className="ms-2"
                            placement="bottom"
                            content="VAT is applicable on transaction fee only"
                          >
                            <Image
                              src={GrayInfo}
                              alt="info icon"
                              preview={false}
                              height={16}
                              width={16}
                            />
                          </Popover>
                        </>
                      }
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(
                        invoiceCalculations.platformFee
                      ).toLocaleString()} ${chequeDetail.currency} + ${Number(
                        invoiceCalculations.vatFee
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      TrustIn platform fees to be paid by{" "} {party && party.toLowerCase().includes("poa") ? "POA of" : ""} buyer ({chequeDetail.buyerPercent}%)
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${invoiceCalculations.buyerTransactionFee} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      TrustIn platform fees to be paid by  {" "} {counterParty && counterParty.toLowerCase().includes("poa") ? "POA of" : ""} seller ({chequeDetail.sellerPercent}%)
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${invoiceCalculations.sellerTransactionFee} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      Amount to be paid by {" "}  {party && party.toLowerCase().includes("poa") ? "POA of" : ""} buyer
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(
                        invoiceCalculations.buyerAmount
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 ">
                    <div className="subText_small">
                      Amount to be received by {" "} {counterParty && counterParty.toLowerCase().includes("poa") ? "POA of" : ""} seller
                    </div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="subText_small">
                      {`${Number(
                        invoiceCalculations.sellerAmount
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <div className="titleText fw-400">Total amount</div>
                  </td>
                  <td className="p-2 text-end ">
                    <div className="mainTitle">
                      {`${Number(
                        invoiceCalculations.totalAmount
                      ).toLocaleString()} ${chequeDetail.currency}`}
                    </div>
                  </td>
                </tr>
               </table>
               
              }
 

            </Card>


           
            

            {preparedCheques.length ? (
              <div>
                <hr className="lightgrayHr" />
                <Card className="paymentCard p-2">
                  <div className="stepDetails mt-3">Cheques details</div>

                  <div className="cheque-grid">
                    {preparedCheques.length === 0 ? (
                      <div className="no-cheques-container">
                        <Image
                          src={Doc_large}
                          alt="No cheques"
                          preview={false}
                          style={{ width: 64, height: 64, opacity: 0.5 }}
                        />
                        <div className="no-cheques-text">
                          No manager cheques have been added yet
                        </div>
                        {/* <Button 
                                    type="primary" 
                                    onClick={() => setShowAddChequeModal(true)}
                                    className="modal-button w-auto"
                                  >
                                    + Add New Cheque
                                  </Button> */}
                      </div>
                    ) : (
                      preparedCheques.map((cheque: any, index: any) => (
                        <Card
                          key={index}
                          className="afterApproveCard cheque-card min-height-300"
                          title={
                            <div className="end-to-end">
                              <span>Cheque {index + 1} </span>
                            </div>
                          }
                        >
                          <div className="cheque-details">
                            <div className="detail-row">
                              <Popover
                                content="Beneficiary Name"
                                placement="topLeft"
                                overlayClassName="info-popover"
                              >
                                <Image
                                  src={UserHalf}
                                  alt="user"
                                  preview={false}
                                  className="px-1 min-width-25"
                                />
                              </Popover>
                              <span className="stepDetails_sub mb-2 mx-1 mt-1">
                                {cheque.beneficiaryName}
                              </span>
                            </div>

                            <div className="detail-row">
                              <Popover
                                content="Cheque Amount"
                                placement="topLeft"
                                overlayClassName="info-popover"
                              >
                                <Image
                                  src={Cheque}
                                  alt="cheque"
                                  preview={false}
                                  className="px-1 min-width-25"
                                />
                              </Popover>
                              <span className="stepDetails_sub mb-2 mx-1 mt-1">
                                {moneyFormat(
                                  chequeDetail.currency,
                                  cheque.amount
                                )}
                              </span>
                            </div>

                            <div className="detail-row">
                              <Image
                                src={CommentImg}
                                alt="company"
                                preview={false}
                                className="px-1 min-width-25"
                              />
                              <div className="stepDetails_sub mx-1">
                                <span
                                  id="textContainer"
                                  className="ellipsis-text"
                                >
                                  <CustomTooltip
                                    text={cheque.comment ?? "--"}
                                    maxLength={75}
                                    overlayClassName="custom-tooltip custom-tooltip-inner"
                                  />
                                </span>
                                <span
                                  id="readMoreButton"
                                  style={{ display: "none" }}
                                >
                                  {" "}
                                  <Popover
                                    placement="top"
                                    className="commentPopover cursor"
                                    content={cheque.comment ?? "--"}
                                    trigger="click"
                                  >
                                    ... Read more
                                  </Popover>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              ""
            )}
            {fileList2?.length && fileList2?.length > 0 ? (
              <>
                <hr className="lightgrayHr" />
                <div style={{ paddingLeft: "10px" }}>
                  <div className="stepDetails mt-3">
                    {" "}
                    {counterParty} {" "}
                    documents
                  </div>
                  <Card className="grayCard pt-3">
                    <div
                      className={
                        Width > 767
                          ? "d-flex gap-4 flex-wrap"
                          : "d-flex gap-4 flex-wrap"
                      }
                    >
                      {fileList2?.map((file: any) => {
                        return file.url.includes(".pdf") ? (
                          <div className="img_wrapper">
                            <div
                              className="signature-image m admin-panel-pdf-preview pdf-preview-adjust"
                              onClick={() => handlePDFView(file?.url)}
                              style={{ maxHeight: "126px" }}
                            >
                              <PDFPreview
                                url={file.url || ""}
                                onPreviewClick={() => handlePDFView(file.url)}
                              />
                            </div>
                            <div>
                              <span className="px-1">Document </span>
                              <span className="text-success mb-2 ml-3rem">
                                <Tooltip
                                  title={
                                    file.document && file.document.length > 50
                                      ? file.document
                                      : null
                                  }
                                  placement="top"
                                  overlayClassName="leads-custom-tooltip"
                                >
                                  <div className="managerchque-ellipsis-container">
                                    {file.document}
                                  </div>
                                </Tooltip> 
                              </span>
                            </div>
                            <div>
                              <span className="px-1">Expiry date </span>
                              <span className="text-danger mb-2 ml-3rem">
                                {moment(file?.expirydate).format("DD-MM-YYYY")}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="img_wrapper">
                              <div className="signature-image m admin-panel-pdf-preview">
                                <Image
                                  preview={true}
                                  className="signature-image preview-card-width"
                                  src={file.url}
                                ></Image>
                              </div>
                              <div>
                                <span className="px-1">Document </span>
                                <span className="text-success mb-2 ml-3rem">
                                  <Tooltip
                                    title={
                                      file.document && file.document.length > 50
                                        ? file.document
                                        : null
                                    }
                                    placement="top"
                                    overlayClassName="leads-custom-tooltip"
                                  >
                                    <div className="managerchque-ellipsis-container">
                                      {file.document}
                                    </div>
                                  </Tooltip> 
                                </span>
                              </div>
                              <div>
                                <span className="px-1">Expiry date </span>
                                <span className="text-danger mb-2 ml-3rem">
                                  {file?.expirydate
                                    ? moment(file.expirydate).format(
                                        "DD-MM-YYYY"
                                      )
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              </>
            ) : null}

            {(chequeDetail?.customPoint &&
              Object.keys(chequeDetail?.customPoint).length > 0) ||
            customAttachmentUrls?.length ? (
              <>
                <hr className="lightgrayHr" />
                <Card className="grayCard p-3">
                  <div className="stepDetails my-3">
                    <CustomContractDetails
                      customFieldList={chequeDetail?.customPoint}
                      customAttachUrl={customAttachUrl}
                      customAttachmentUrls={customAttachmentUrls}
                      transactionpreview="true"
                    />
                  </div>
                </Card>
              </>
            ) : (
              ""
            )}
          </div>
          {sourceOfFundUrls?.length ? (
            <>
              <hr className="lightgrayHr" />
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
            </>
          ) : null}
       
          {signature ? (
            <>
           <hr className="lightgrayHr" />
            <Card className="grayCard p-3">
              <div className="stepDetails my-3">
                {capitalizeFirst(contractStartedBy)}{" sign"}
              </div>
              {/* <Image src={signature} alt="from Sign" height={100} width={150} /> */}
              {signature &&
              typeof signature === "string" &&
              signature.includes(".pdf") ? (
                <div className="signature-image m admin-panel-pdf-preview">
                  <Document file={signature} externalLinkRel="_blank">
                    <Page pageNumber={1} width={50} />
                  </Document>
                </div>
              ) : (
                <Image
                  className="signature-image m"
                  src={signature}
                  preview={false}
                ></Image>
              )}
            </Card>
            </>
          ) : (
            ""
          )}
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

export default ChequePreview;
