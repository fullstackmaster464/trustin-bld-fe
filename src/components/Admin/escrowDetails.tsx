import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Form,
    Image,
    Modal,
    Radio,
    Row,
    Spin,
    Tooltip,
    message,
  } from "antd";
  import { useNavigate } from "react-router-dom";
  import { EscrowAccountsList } from "../Common/RouteConst";
  import LeftArrow from "../../assets/img/leftArrow.svg";
  // import ProfileImage from "../../assets/img/profileImg.svg";
  import Email from "../../assets/img/Email.svg";
  import Phone from "../../assets/img/Phone.svg";
  import Nation from "../../assets/img/Nation.svg";
  import Individual from "../../assets/img/Individual.svg";
  import Flag from "../../assets/img/Country.svg";
  import Job from "../../assets/img/job_gray.svg";
  import Doc from "../../assets/img/grayDoc.svg";
  import Hands from "../../assets/img/hands.svg";
  import Payment from "../../assets/img/white_payment.svg";
  import WhiteTick from "../../assets/img/white_tick.svg";
  import WhiteReject from "../../assets/img/white_reject.svg";
  import sidebarUser from "../../assets/img/gray_user.svg";
  import BankAcc from "../../assets/img/bankacc.svg";
  import currency from "../../assets/img/currencysymbol.svg";
  import { useEffect, useState } from "react";
  import { NormalText } from "../ui-elements/TextRepo";
import { fetchKybDetails, getVirtualAccountPDF, virtualAccountDetails } from "../../services/admin";
import { DOCUMENT_TYPE, moneyFormat } from "../Common/Constants";
import moment from "moment";
import DefaultLayout from "../Common/DefaultLayout";
import jsPDF from "jspdf";
import siteLogo from "../../assets/img/currentLogo.png";
// @ts-ignore
import multiDownload from "multi-download"; 
import { getWalletTotalAmountAndCount } from "../../services/user";
  const EscrowInfo = ():any => {
  const navigate = useNavigate();
  const [downloadModal, setDownloadModal] = useState(false);
  const [form] = Form.useForm();
  const [virtualAccountData, setVirtualAccountData] = useState<any>([]);
  const [downloadOption, setDownloadOption] = useState(3);
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [kycData, setKycData] = useState<any>([]);
  const userAlias = window?.location?.pathname.split("/").pop();
  const [Width, setWidth] = useState(document?.body?.clientWidth);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  useEffect(() => {
    const handleResize = () => setWidthVal();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  
  }, [])

  
  useEffect(() => {
    if(userAlias) {
      const user = userAlias ?? "";
      virtualAccountDetails(user)
        .then(async res => {
          const vaDetails = res?.data?.VADetails;
          setVirtualAccountData(res?.data?.VADetails)
          setCountry(res?.data?.VADetails?.[0]?.address?.countryCode);
          const updatedVAWithBalance = await Promise.all(
            vaDetails.map(async (account: any) => {
              try {
                const balanceRes = await getWalletTotalAmountAndCount(userAlias, account.currency);
                return {
                  ...account,
                  balanceAmount: balanceRes?.data?.walletTransaction?.balanceAmount || 0,
                };
              } catch {
                return {
                  ...account,
                  balanceAmount: 0,
                };
              }
            })
          );
          setVirtualAccountData(updatedVAWithBalance);
        })
        .catch(() => {
          message.error("Could not fetch details. Please try again later")
        });

      fetchKybDetails(userAlias)
        .then(res => {
          setKycData(res?.data?.data?.[0]);
        })
        .catch(() => {
          message.error("Could not fetch details. Please try again later")
        })
    }
  }, [userAlias]);
    const handleModalCancel = () => {
      setDownloadModal(false);
      setIsPdfModalOpen(false);
      form.resetFields()
    };

    const goBack = () => {
      navigate(EscrowAccountsList);
    };
    
const createVirtualAccountDetailsPdf: any = async (
  userAlias: string,
  currency: string
) => {
  const res = await getVirtualAccountPDF(userAlias, currency);
  const doc: any = new jsPDF({ orientation: "portrait" });
  let data;
  let pdfBlob;
  // Generate the PDF content
  await doc.html(res.data, {
    callback: async function (doc: any) {
      const internalWidth = doc.internal.pageSize.getWidth();
      // const internalHeight = doc.internal.pageSize.getHeight()
      doc.setPage(1);
      // Add the header
      doc.addImage(siteLogo, "PNG", 8, 4, 40, 10.25);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 102, 0);
      doc.setFontSize(18);
      doc.text("Bank Account", internalWidth - 60, 12);

      // Add the footer
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 51, 153);
      doc.setFontSize(12);
      doc.text(
        "This is system generated digital document, for more information please visit www.trustin.ae",
        20,
        doc.internal.pageSize.height - 120
      );
      pdfBlob = await doc.output("blob");

      const blobUrl = URL.createObjectURL(pdfBlob);
      data = blobUrl;
    },
    align: "center",
    margin: [14, 10, 10, 10],
    showHead: "everyPage",
    autoPaging: "text",
    x: 0,
    y: 0,
  });

  return { blobData: pdfBlob, blobUrl: data };
};

const viewPdf = async (
  userAlias: any,
  currency = "AED",
  isPdfPreview = true
) => {
  setPdfLoading(true);
  setIsPdfModalOpen(true);
  createVirtualAccountDetailsPdf(userAlias, currency)
    .then(async (res: any) => {
      const pdf: any = await res;
      setPdfUrl(pdf.blobUrl);
      if (!isPdfPreview) {
        const link = document.createElement("a");
        link.href = pdf.blobUrl;
        link.setAttribute("download", "EscrowAccountDetails.pdf");
        document.body.appendChild(link);
        link.click();
      }
      setPdfLoading(false);
      setLoading(false);
      setDownloadModal(false);
    })
    .catch(() => {
      setPdfLoading(false);
      setIsPdfModalOpen(false);
      setLoading(false);
      message.error(
        "Oops! Could not view the account details. Please try again later!"
      );
    });
};

const downloadEscrowDetails = async () => {
  const files = [];
  const data = kycData?.documents?.[0];
  if (data?.repDocFront?.[0]?.url) {
    files.push(data?.repDocFront?.[0]?.url);
  }
  if (data?.repDocBack?.[0]?.url) {
    files.push(data?.repDocBack?.[0]?.url);
  }
  if (data?.repAddProof?.[0]?.url) {
    files.push(data?.repAddProof?.[0]?.url);
  }
  if (data?.businessAddProof?.[0]?.url) {
    files.push(data?.businessAddProof?.[0]?.url);
  }
  if (data?.businessRegProof?.[0]?.url) {
    files.push(data?.businessRegProof?.[0]?.url);
  }
  if (data?.authorizationDoc?.[0]?.url) {
    files.push(data?.authorizationDoc?.[0]?.url);
  }
  setLoading(true);
  if (downloadOption == 1) {
    // downloadKybDetails(userAlias).then((response) => {
    //   const url = window.URL.createObjectURL(new Blob([response.data]));
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", "EscrowAccountDetails.xlsx");
    //   document.body.appendChild(link);
    //   link.click();
    //   setDownloadModal(false);
    //   setLoading(false);
    // });
    await viewPdf(userAlias);
  }
  if (downloadOption == 2) {
    multiDownload(files);
    setDownloadModal(false);
    setLoading(false);
  }
  if (downloadOption == 3) {
    await multiDownload(files);
    await viewPdf(userAlias, "", false);
    setDownloadModal(false);
    setLoading(false);
    setPdfLoading(false);
    setIsPdfModalOpen(false);
  }
};

    return (
      <div className="escrow-details-resposive scrollbar-container">
          <DefaultLayout
        page="escrow_accounts"
        TitleText="Escrow Accounts"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        loading={false}
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
              <b> Escrow accounts</b>
              <Breadcrumb separator=">">
                <Breadcrumb.Item
                  // onClick={() => {
                  //   navigate(Dashboard);
                  // }}
                  // className="cursor"
                >
                  Escrow
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="cursor"
                  onClick={() => {
                    navigate(EscrowAccountsList);
                  }}
                >
                  Escrow accounts
                </Breadcrumb.Item>
                <Breadcrumb.Item className="cursor">
                Escrow account information
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
              <Row className="" gutter={[16,16]}>
                <Col span={24}>
                  <Card className="bg-admin-card p-4">
                    <Col span={24}>
                        <Col span={24} className="">
                          {
                            virtualAccountData[0]?.originalName ? 
                          <>
                          <div className="title_white mt-3">{virtualAccountData[0]?.originalName}</div>
                          <div className="title_white mt-3" style={{fontSize : '20px'}}>
                            Name as per account : {virtualAccountData[0]?.name}
                            </div>
                          </>
                       : <>
                          <div className="title_white mt-3">{virtualAccountData[0]?.name}</div> 
                          </>  }
                          <hr className="my-4" />
                       </Col>
                        <div  className={Width >
                          767 ? "row mb-3" : "row mb-2"}>
                          <div className="col-md-4">
                              <div className={Width >
                                767 ? "subtext_white d-flex" : "subtext_white d-flex mb-3"}>
                                <Image src={Email} alt="email" preview={false} className="icon-default-size" />
                                <Tooltip
                                    title={virtualAccountData?.[0]?.emails?.[0]?.address}
                                    overlayClassName="custom-tooltip"
                                    placement="topLeft"
                                    >
                                    <span className="ml-4 overflowText userinfo">
                                    {virtualAccountData?.[0]?.emails?.[0]?.address}
                                    </span>
                                </Tooltip>
                              </div>
                          </div>
                          <div className="col-md-4">
                              <div className={Width >
                          767 ? "subtext_white d-flex" : "subtext_white d-flex mb-3"}>
                                <Image src={Phone} alt="phone" preview={false} className="icon-default-size" />
                                <span className="ml-4 overflowText userinfo">
                                {virtualAccountData?.[0]?.phones?.[0]?.number}
                                </span>
                              </div>
                          </div>
                           <div className="col-md-4">
                              <div className={Width >
                                767 ? "subtext_white d-flex" : "subtext_white d-flex mb-3"}>
                                <Image src={Nation} alt="country" preview={false} className="icon-default-size" />
                                <span className="ml-4 overflowText userinfo">{virtualAccountData[0]?.address?.countryCode}</span>
                                <div className="mx-1">
                                    <div className="px-1 bluecard-flag">
                                      <span>
                                          {country ? <span className={`fi fi-${country.toLowerCase()} `} /> 
                                          : 
                                          <Image src={Flag}  preview={false}  height={12}
                                            width={22}/>
                                          }               
                                      </span>
                                    </div>
                                </div>
                              </div>
                          </div>
                         
                        </div>
                        <div className="row">
                          
                          <div className="col-md-4">
                              <div className={Width >
                                767 ? "subtext_white d-flex" : "subtext_white mb-4 d-flex"}>
                                <Image src={Individual} alt="type" preview={false} className="icon-default-size" />
                                <span className="ml-4 overflowText userinfo">{kycData?.basic?.[0]?.typeOfEntity === "INDIVIDUAL" ? "Individual" : "Company"}</span>
                              </div>
                          </div>
                          <div className="col-md-4">
                              {virtualAccountData?.map(
                              (item: {currency: string;
                              balanceAmount: string;},index: number) => (
                              <div
                                key={index}
                                className={Width >
                                767 ? "subtext_white d-flex align-items-center mb-2" : "subtext_white d-flex align-items-center mb-2"}
                                >
                                {index === 0 && (
                                <Image
                                    src={Payment}
                                    alt="box"
                                    preview={false}
                                    className="icon-default-size me-3"
                                    />
                                )}
                                {index !== 0 && <div style={{ width: "32px" }} className="me-2" />} 
                                <span className="overflowText userinfo">
                                {moneyFormat(item.currency, parseFloat(item.balanceAmount || "0").toFixed(2))}
                                </span>
                              </div>
                              )
                              )}
                          </div>
                          <div className="col-md-4 flex-end">
                              <Button className="downloadCard mt-2" onClick={()=>{setDownloadModal(true)}}>Download</Button>
                          </div>
                        </div>
                    </Col>
                  </Card>
                </Col>
              </Row>
              <div className="titleText mt-4 mb-3">Escrow account details</div>
            <Card className="p-3">
              {virtualAccountData?.length > 0 &&
                virtualAccountData.map((vaData: any, index: number) => (
                  <div key={index}>
                    <Row gutter={[16, 16]} className="mb-3">
                      <Col xs={24} sm={12} md={8} lg={12} xl={8}>
                        <div className="d-flex align-items-start">
                          <Image src={BankAcc} alt="Account Number" preview={false} className="icon-default-size me-2 mt-1" />
                          <div>
                            <div className="stepDetails_medium_sub">Account Number</div>
                            <div className="subText_small fw-400">{vaData?.number || "-"}</div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={12} xl={8}>
                        <div className="d-flex align-items-start">
                          <Image src={BankAcc} alt="IBAN" preview={false} className="icon-default-size me-2 mt-1" />
                          <div>
                            <div className="stepDetails_medium_sub">IBAN Number</div>
                            <div className="subText_small fw-400">
                              <Tooltip
                                title={vaData?.iban || "-"}
                                overlayClassName="custom-tooltip"
                                placement="topLeft"
                              >
                                <span>{vaData?.iban || "-"}</span>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={12} xl={8}>
                        <div className="d-flex align-items-start">
                          <Image src={currency} alt="Currency" preview={false} className="icon-default-size me-2 mt-1" />
                          <div>
                            <div className="stepDetails_medium_sub">Currency</div>
                            <div className="subText_small fw-400">{vaData?.currency || "-"}</div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={12} xl={8}>
                        <div className="d-flex align-items-start">
                          <Image src={currency} alt="Balance" preview={false} className="icon-default-size me-2 mt-1" />
                          <div>
                            <div className="stepDetails_medium_sub">Balance</div>
                            <div className="subText_small fw-400">
                              {moneyFormat(
                                vaData?.currency,
                                parseFloat(vaData?.balanceAmount || 0).toFixed(2)
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={12} xl={8}>
                        <div className="d-flex align-items-start">
                          <Image src={Hands} alt="Account Type" preview={false} className="icon-default-size me-2 mt-1" />
                          <div>
                            <div className="stepDetails_medium_sub">Account Type</div>
                            <div className="subText_small fw-400">{vaData?.vaType || "-"}</div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} sm={12} md={8} lg={12} xl={8}>
                        <div className="d-flex align-items-start">
                          <Image src={Job} alt="Added On" preview={false} className="icon-default-size me-2 mt-1" />
                          <div>
                            <div className="stepDetails_medium_sub">Added On</div>
                            <div className="subText_small fw-400">
                              {vaData?.createAt ? moment(vaData?.createAt).format("DD-MM-YYYY") : "-"}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {index < virtualAccountData.length - 1 && <hr className="my-3 lightgrayHr" />}
                  </div>
                ))}
            </Card>
              <div className="titleText mt-4 mb-3">{kycData?.basic?.[0]?.typeOfEntity === "INDIVIDUAL" ? "Kyc" : "Kyb"} details</div>
              <Card className="p-3">
                <Row className="endtoend">
                {/* <div className="endtoend"> */}
                  <Col className="col-12 col-xl-3 col-lg-4 col-md-4 col-sm-6 ">
                  <div className="d-flex">
                    <Image src={sidebarUser} alt="user" preview={false} className="icon-default-size" />
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Name on document</div>
                      <div className="subText_small fw-400">{kycData?.basic?.[0]?.name || '-'}</div>
                    </div>
                    </div>
                  </Col>
                  <Col className="col-12 col-xl-2 col-lg-4 col-md-4 col-sm-6 ">
                  <div className="d-flex">
                    <Image src={Doc} alt="user" preview={false} className="icon-default-size" />
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Document</div>
                      <div className="subText_small fw-400">{kycData?.documents?.[0]?.repDocType ? DOCUMENT_TYPE[kycData?.documents[0].repDocType] : '-'}</div>
                    </div>
                  </div>
                  </Col>
                  <Col className="col-12 col-xl-3 col-lg-4 col-md-4 col-sm-6 ">
                  <div className="d-flex">
                    <Image src={Doc} alt="user" preview={false} className="icon-default-size" />
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Document id number</div>
                      <div className="subText_small fw-400 doc_id_wordbreak">{kycData?.representative?.[0]?.repDocNumber}</div>
                    </div>
                  </div>
                  </Col>
                  <Col className="col-12 col-xl-2 col-lg-4 col-md-4 col-sm-6 ">
                  <div className="d-flex">
                    <Image src={Job} alt="user" preview={false} className="icon-default-size" />
                    <div className="mx-3">
                      <div className="stepDetails_medium_sub">Expiry date</div>
                      <div className="subText_small fw-400">{moment(kycData?.representative?.[0]?.repExpiryDate).format('DD-MM-YYYY')}</div>
                    </div>
                  </div>
                  </Col>
                  <Col className="col-12 col-xl-2 col-lg-4 col-md-4 col-sm-6 ">
                  {kycData?.kybStatus == 'VERIFIED'? 
                  <div className="d-flex mt-2 verified py-1 px-3">
                    <Image src={WhiteTick} alt="user" preview={false} className="icon-default-size" />
                    <div className="px-2">
                     Verified
                    </div>
                  </div>
                  :
                  <div className="d-flex mt-2 not-verified py-1 px-2">
                  <Image src={WhiteReject} alt="user" preview={false} className="icon-default-size" />
                  <div className="px-1">
                   Not verified
                  </div>
                </div>}
                </Col>
                </Row>

                {/* </div> */}
              </Card> 
              </DefaultLayout> 
  
        <Modal
          open={downloadModal}
          footer={false}
          className="classification-modal"
          title={
            <span className="change-client-classification ml-4">
              Download all KYC information
              <hr className="lightgrayHr" />
            </span>
          }
          centered
        >
          <div className="stepDetails fw-400 mx-3 py-2 modal-word-wrap">
            <p>Choose which data you want to download now?</p>
          </div>
          <Form
            form={form}
            scrollToFirstError
            layout="vertical"
            name="form_in_modal"
            className="py-2"
          >
           <Radio.Group defaultValue="3" buttonStyle="solid" className="mx-3">
            <Row>
              <Radio
                value="1"
                onChange={(e) => setDownloadOption(e.target.value)}
              >
                <NormalText children="Download Account Details as PDF" />
              </Radio>
            </Row>
            <Row>
              <Radio
                value="2"
                onChange={(e) => setDownloadOption(e.target.value)}
              >
                <NormalText children="Download attached files" />
              </Radio>
            </Row>
            <Row>
              <Radio
                value="3"
                onChange={(e) => setDownloadOption(e.target.value)}
              >
                <NormalText children="Download above both" />
              </Radio>
            </Row>
          </Radio.Group>
            <div className="">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                className="modal-button mt-5"
                loading={loading}
                onClick={() => {
                  downloadEscrowDetails();
                }}

              >
                Download
              </Button>
              <Button
                key="cancel"
                type="primary"
                className="modal-button-cancel mt-5 mx-2"
                onClick={() => {
                  handleModalCancel();
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
          <Modal
        title={<div className="titleText mt-3 mb-5">Escrow account details PDF</div>}
        centered
        open={isPdfModalOpen}
        onCancel={handleModalCancel}
        footer={false}
        width={"80%"}
      >
        {!pdfUrl || pdfLoading? (
          <div
            className="d-flex align-items-center justify-content-center w-100"
            style={{ height: "60vh" }}
          >
            <Spin size="large" className="mainloader pdf" />
          </div>
        ) : (
          <>
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="550"
            >
              <p>Your browser does not support viewing PDFs. Please download the file to view it. {" "}
              
              </p>
              </object>
              <div className="text-center mt-3">
                <a href={pdfUrl} download="escrow-account-details.pdf">
                <button className="btn btn-primary">
                  Download the PDF
                  </button>
                </a>
            </div>
          </>
        )}
      </Modal>
  </div>
    );
  };
  export default EscrowInfo;
  