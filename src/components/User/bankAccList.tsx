import { Breadcrumb, Button, Card, Col, Image, Modal, Popover, Row, Spin, Tooltip, message } from "antd";
import { useNavigate } from "react-router-dom";
import BankIcon from "../../assets/img/Headers/bankIcon.svg";
import Shield from "../../assets/img/bankShield.svg";
import NoBank from "../../assets/img/nobanks.svg";
import { useEffect, useState } from "react";
import { AddBank, EditBank } from "../Common/RouteConst";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import { CloudDownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { getVirtualAccountPDF, virtualAccountDetails } from "../../services/admin";
import { getLocalStorage } from "../Common/Constants";
import Edit from "../../assets/img/edit.svg";
import Delete from "../../assets/img/delete.svg";
import Warning from "../../assets/img/warningicon.svg";
import {
  deleteUserBankDetails,
  getlocalBankDetails,
  setPrimaryBankAc,
} from "../../services/user";
// import moment from "moment";
import DefaultLayout from "../Common/DefaultLayout";
import jsPDF from "jspdf";
import siteLogo from "../../assets/img/currentLogo.png";

const BankAccountList = ():any => {
  const navigate = useNavigate();
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const [loading, setLoading] = useState(false);
  const [userBankList, setUserBankList] = useState<any>([]);
  const [primaryAccount, setPrimaryAccount] = useState<any>("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [virtualAccount, setVirtualAccount] = useState<any>([]);
  const [bankAlias, setBankAlias] = useState<any>("");
  const [currentPrimary, setCurrentPrimary] = useState<any>(0);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isPrimaryModal, setisPrimaryModal] = useState(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);

  const createVirtualAccountDetailsPdf:any = async (userAlias: string, currency: string) => {
      const res = await getVirtualAccountPDF(userAlias, currency);
      const doc:any = new jsPDF({ orientation: "portrait" });
      let data;
      let pdfBlob;
      // Generate the PDF content
      await doc.html(res.data, {
        callback: async function (doc:any) {
        const internalWidth = doc.internal.pageSize.getWidth()
        // const internalHeight = doc.internal.pageSize.getHeight()
          doc.setPage(1);
          // Add the header
          doc.addImage(siteLogo, "PNG", 8, 4, 40, 10.25);
          doc.setFont('helvetica','bold');
          doc.setTextColor(255,102,0)
          doc.setFontSize(18);
          doc.text("Bank Account",internalWidth - 60,12)

          // Add the footer
          doc.setFont('helvetica','normal');
          doc.setTextColor(0, 51, 153)
          doc.setFontSize(12);
          doc.text("This is system generated digital document, for more information please visit www.trustin.ae",20, doc.internal.pageSize.height - 100)
          pdfBlob = await doc.output("blob");
      
          const blobUrl = URL.createObjectURL(pdfBlob);
          data = blobUrl;
        },
        align: "center",
        margin: [14, 10, 10, 10],
        showHead: "everyPage",
        autoPaging: 'text',
        x: 0,
        y: 0,
      });

      return { blobData: pdfBlob, blobUrl: data };
  };
  
  const viewPdf = (userAlias: any, currency: string) => {
    setPdfLoading(true);
    setIsPdfModalOpen(true);
    createVirtualAccountDetailsPdf(userAlias, currency)
    .then(async (res: any) => {
      setPdfLoading(false);
      const pdf: any = await res;
      setPdfUrl(pdf.blobUrl);
    })
    .catch(() => {
      setPdfLoading(false);
      setIsPdfModalOpen(false);
      message.error(
        "Oops! Could not view the account details. Please try again later!"
      );
    });
  };

  // const getDate = (data: number) => {
  //   const date = moment(new Date(data * 1)).format("DD-MM-YYYY");
  //   return date;
  // };
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  useEffect(() => {
    setLoading(true)
    try {
      virtualAccountDetails(userAlias)
      .then((response:any) => {
        setLoading(false)
        setVirtualAccount(response?.data?.VADetails);
      })
      .catch(() => {
        setLoading(false)
      });
      getBankList();

    } catch (err:any) {
      if(err)
      message.error("Oops! Could not fetch details. Please try again later!");

    }
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);

  }, [userAlias]);
  const getBankList = () =>{
    setLoading(true)
    getlocalBankDetails(userAlias)
    .then((response) => {
      setLoading(false)
      setUserBankList(response?.data?.bankDetails);
      response?.data?.bankDetails?.find((item:any) => {
        if (item.isPrimary) {
          setPrimaryAccount(item.id);
        }
      });
    })
    .catch(() => {
      setLoading(false)
    });
  }

  const deleteBankAccount = () => {
    deleteUserBankDetails(bankAlias).then(() => {
      setIsDeleteModalVisible(false);
      getBankList()
      
    });
  };
  const handleCancel = ()=>{
    setIsDeleteModalVisible(false);
    setisPrimaryModal(false)
    setIsPdfModalOpen(false)
  }
  const changePrimary = () => {
    setPrimaryBankAc(userAlias, currentPrimary)
      .then(() => {
        setPrimaryAccount(currentPrimary);
        setCurrentPrimary(0);
        setisPrimaryModal(false)
        message.success('Your primary account changed successfully!')
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
  };

  const manualBankDetailsTooltip = (
  <div style={{ maxWidth: 280 }}>
    <p><strong>Manually Entered Bank Details</strong></p>
    <ul style={{ paddingLeft: 20, marginTop: 4 }}>
      <li>Bank name, routing code, and scheme have been entered manually</li>
      <li>Please ensure all details are accurate and valid</li>
      <li>Incorrect information may delay or block the payment</li>
      <li>Where possible, prefer selecting from the bank dropdown for verified details</li>
    </ul>
  </div>
);


  // const handleApproveDelete = () => {
  //   deleteUserBankDetails(bankAlias)
  //     .then((response) => {
  //       if (response?.status === 201 || 200) {
  //         setshowDeleteConfirmation(false);
  //         setIsModalVisible(true);

  //         setTimeout(() => {
  //           let list = [...userBankList];
  //           list.splice(index, 1);
  //           setUserBankList([...list]);
  //           setIsModalVisible(false);
  //           setIndex(null);
  //         }, 3000);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err) {
  //         setshowDeleteConfirmation(true);
  //       }
  //     });
  // };
  // const handleApproveCancel = () => {
  //   setshowDeleteConfirmation(false);
  //   setCurrentPrimary("");
  // };
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="bank"
        loading={loading}
        headerPage={
          <div className="d-flex">
                    <Image
                      src={BankIcon}
                      preview={false}
                      className="mt-2"
                      alt="escrowimage"
                    />
                    <div className="ml-5">
                      <b> Bank account</b>
                      <Breadcrumb separator=">">
                        {/* <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                          className="cursor"
                        >
                          Dashboard
                        </Breadcrumb.Item> */}
                        <Breadcrumb.Item className="breadcrumb-title-text">Bank account</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
        TitleText="Bank Account"
        TitleImage={BankIcon}
      >
    
              {Width < 991 && (userBankList.length > 0 || virtualAccount.length > 0) ?
               <div className="d-flex justify-content-end">
                  <SecondaryOutLineButton
                    children="Add More Bank Account"
                    className="mb-3 w-auto "
                    onClick={() => {
                       navigate(AddBank);
                    }}
                  />
                </div> : ""}
              {userBankList.length > 0 || virtualAccount.length > 0 ? (
                <Row className="endtoend">  
                  <Col span={Width > 991 ? 16 : 24 }>
                    {userBankList?.map((data: any, index: string) => {                      
                      return (
                        <Card key={index} className="noBorder mt-6 p-4 mb-3 status ant-bank-card ">
                          <Row className="endtoend" gutter={[16, 16]} align="middle" justify="space-between">
                            <Col xs={24} sm={24} md={14} lg={12} className="titleText capitalize">
                              {data?.institutionName?.toLowerCase() || "--"}
                            </Col>
                            <Col className={Width < 768 ? "d-flex justify-content-start w-100 gap-3 mt-1" :"d-flex justify-content-end align-items-baseline gap-3"} span={Width < 650 ? 24 :  10  } >
                            {data?.isDetailsManualInput ? 
                            <Tooltip
                              title={manualBankDetailsTooltip}
                              overlayClassName="custom-tooltip signupTooltip"
                              placement="topLeft"
                            >
                              <span>
                                <InfoCircleOutlined />
                              </span>
                            </Tooltip>
                            : null}
                            
                            {data?.id == primaryAccount ? <div className="active bold">Primary</div> : 
                            <Button className="cursor w-auto setas-primary" onClick={()=>{setCurrentPrimary(data?.id); setisPrimaryModal(true)}}>Set as primary</Button>}
                            <Image src={Edit} alt="edit" preview={false} className="cursor banklist-image" onClick={()=>{navigate(EditBank+data?.id)}} />
                            <Image src={Delete} alt="delete" preview={false} onClick={()=>{setIsDeleteModalVisible(true);setBankAlias(data?.aliasName)}} className="cursor banklist-image" />
                          
                            </Col>
                          </Row>
                          <Row className="mt-4" gutter={[24,24]}>
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">
                                Name (as per bank account) 
                              </div>
                              <div className="subText_xs">
                                <Popover content={data?.name}  trigger="hover"  >
                                {data?.name}
                                </Popover>
                              </div>
                            </Col>
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">
                                {data?.type === "IBAN" ? "IBAN" : "Account number"}
                              </div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.number}  trigger="hover" >
                                  {data?.number}
                                </Popover>
                              </div>
                            </Col>
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">Currency</div>
                              <div className="subText_xs capitalize overflowText">
                                <Popover content={data?.city}  trigger="hover" >
                                  {data?.accountCurrency ?? "--"}
                                </Popover> 
                              </div>
                            </Col>
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">
                                Institution type
                              </div>
                              <div className="subText_xs capitalize overflowText">
                                <Popover content={data?.institutionType.toLowerCase()}  trigger="hover"  >
                                  {data?.institutionType.toLowerCase()}
                                </Popover>
                              </div>
                            </Col>
                          {/* </Row>
                          <Row className="mt-4"> */}
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">Country</div>
                              <div className="subText_xs capitalize overflowText">
                                <Popover content={data?.country}  trigger="hover" >
                                  {data?.country}
                                </Popover> 
                              </div>
                            </Col>
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">City</div>
                              <div className="subText_xs capitalize overflowText">
                                <Popover content={data?.city}  trigger="hover" >
                                  {data?.city ?? "--"}
                                </Popover> 
                              </div>
                            </Col>
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">Bank name</div>
                              <div className="subText_xs capitalize overflowText">
                                <Popover content={data?.institutionName}  trigger="hover" >
                                  {data?.institutionName}
                                </Popover> 
                              </div>
                            </Col>
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">
                                Routing code
                              </div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.routingCode}  trigger="hover" >
                                  {data?.routingCode}
                                </Popover>
                              </div>
                            </Col>
                            <Col span={Width > 650 ?8 : 12} className="col-padding">
                              <div className="small-text-light">
                                Routing scheme
                              </div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.routingScheme}  trigger="hover"  >
                                  {data?.routingScheme}
                                </Popover>
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      );
                    })}
                    {virtualAccount?.map((data: any, index: string) => {
                      return (
                        <Card key={index} className="noBorder mt-6 p-4 mb-3">
                          <div className="titleText">
                             <Row  gutter={[16, 16]} align="middle" justify="space-between" className="gap-2">
                               <Col className="titleText capitalize">
                            <div className="titleText">
                              Escrow bank account
                            </div>
                            </Col>
                            <Col className={Width < 600 ? "d-flex justify-content-start w-100 gap-3 mt-1" :"d-flex justify-content-end align-items-baseline gap-3"} >
                            <SecondaryOutLineButton className="mb-2 w-auto" onClick={()=> viewPdf(userAlias,data?.currency)}>
                              <CloudDownloadOutlined className="downloadText mx-2" />
                              <span className="downloadText">Download AC Details</span>
                            </SecondaryOutLineButton>
                            </Col>
                            </Row>
                          </div>
                          <Row className="mt-4" gutter={[24,24]}>
                            <Col span={Width > 650 ?8 :12} className="col-padding">
                              <div className="small-text-light">
                                Name on the bank account
                              </div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.name}  trigger="hover">
                                  {data?.name}
                                </Popover>
                              </div>
                            </Col>
                              <Col span={Width > 650 ?8 :12} className="col-padding">
                              <div className="small-text-light">
                                Original name
                              </div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.originalName || data?.name}  trigger="hover">
                                  {data?.originalName || data?.name}
                                </Popover>
                              </div>
                            </Col>
                            
                            <Col span={Width > 650 ?8 :12} className="col-padding">
                              <div className="small-text-light">
                                Account number
                              </div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.number}  trigger="hover">
                                  {data?.number}
                                </Popover>
                              </div>
                            </Col>
                            <Col span={Width > 650 ? 8 :12} className="col-padding">
                              <div className="small-text-light">
                                IBAN number
                              </div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.iban}  trigger="hover" placement="topRight">
                                  {data?.iban}
                                </Popover>
                              </div>
                            </Col>
                          {/* </Row>
                          <Row className="mt-4"> */}
                            <Col span={Width > 650 ? 8 :12} className="col-padding">
                              <div className="small-text-light">Country</div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.address?.countryCode}  trigger="hover"  >
                                  {data?.address?.countryCode}
                                </Popover>
                              </div>
                            </Col>
                            <Col span={Width > 650 ? 8 :12} className="col-padding">
                              <div className="small-text-light">Currency</div>
                              <div className="subText_xs overflowText">
                                <Popover content={data?.currency}  trigger="hover"  >
                                  {data?.currency}
                                </Popover>
                              </div>
                            </Col>
                            <Col span={Width > 650 ? 8 :12} className="col-padding">
                              <div className="small-text-light">Status</div>
                              <div className="subText_xs capitalize overflowText">
                                <Popover content={data?.status}  trigger="hover" >
                                  {data?.status}
                                </Popover>
                              </div>
                            </Col>
                            {/* <Col span={Width > 650 ?8 :12} className="col-padding">
                              <div className="small-text-light">
                                Validate until
                              </div>
                              <div className="subText_xs overflowText">
                                <Popover content={getDate(data?.expiresOn)}  trigger="hover"  >
                                  {getDate(data?.expiresOn)}
                                </Popover>
                              </div>
                            </Col> */}
                          </Row>
                        </Card>
                      );
                    })}
                    
                  </Col>
                  <Col span={Width > 991 ? 7 : 24} className={Width > 767 ? "" : "mb-3"}>
                    <Card className="noBorder mt-6 p-3 text-center ant-bank-card  order-2">
                      <Image
                        src={Shield}
                        preview={false}
                        alt="secure"
                        className="mb-4"
                      />
                      <div className="stepDetails">Security assurance</div>
                      <div className=" mb-4  stepDetails_medium_sub">
                        Your informtion security is our top most priority. So
                        that you make payment safely.
                      </div>
                    </Card>
                    {Width >= 991 ? 
                    <div className="d-flex justify-content-center">
                    <SecondaryOutLineButton
                        children="Add More Bank Account"
                        className="mt-3 w-auto mx-auto"
                        onClick={() => {
                          navigate(AddBank);
                        }}
                      />
                      </div> : ""}
                  </Col>
                </Row>
              ) : (
                <Card className="noBorder mt-6 p-4 ant-bank-card h-100">
                  <div className="text-center mt-4">
                    <Image src={NoBank} preview={false} alt="bank" />
                    <p className="nodata mt-5">Bank account not yet added</p>
                    <Button
                      type="primary"
                      className="modal-button w-auto mt-3 mb-5"
                      onClick={()=>{
                        navigate(AddBank)
                      }}
                    >
                      + Add Bank Account
                    </Button>
                  </div>
                </Card>
              )}
              </DefaultLayout>
      <Modal
        title={
          <div className="modal-title">
            <div className="warning-icon center mt-4">
              <Image
                src={Warning}
                alt="Warning"
                preview={false}
                height={68}
                width={75}
              />
            </div>

            <div className="warning-text center bold">Warning!</div>
          </div>
        }
        className="modal-box center"
        open={isDeleteModalVisible}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        width={Width > 767 ? 600 : 500}
      >
        <p className="sub-text fw-400 center mx-5">
          Are you sure you want to delete this bank account?
        </p>
        <div className="d-flex center">
          <Button
            className="rounded mx-3 my-4"
            htmlType="submit"
            onClick={() => deleteBankAccount()}
          >
            Delete
          </Button>
          <Button
            className="rounded_cancel_btn my-4"
            onClick={() => setIsDeleteModalVisible(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        title={
          <div className="modal-title">
            <div className="warning-icon center mt-4">
              {/* <Image
                src={Warning}
                alt="Warning"
                preview={false}
                height={68}
                width={75}
              /> */}
            </div>

            <div className="welcome view-all center bold">Confirmation</div>
          </div>
        }
        className="modal-box center"
        open={isPrimaryModal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        width={Width > 767 ? 600 : 500}
      >
        <p className="sub-text fw-400 center mx-5">
          Are you sure you want to change this bank account as a primary account?
        </p>
        <div className="d-flex center">
          <Button
            className="rounded mx-3 my-4"
            htmlType="submit"
            onClick={() => changePrimary()}
          >
            Change
          </Button>
          <Button
            className="rounded_cancel_btn my-4"
            onClick={() => setisPrimaryModal(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        title={<div className="titleText mt-3 mb-5">Escrow account details PDF</div>}
        centered
        open={isPdfModalOpen}
        onCancel={handleCancel}
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
              <p>Your browser does not support viewing PDFs {" "}
              
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
    </div>
  );
};

export default BankAccountList;
