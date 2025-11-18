import {
  Alert,
  Button,
  Image,
  Modal,
  Pagination,
  Select,
  Spin,
  Table,
  Typography,
  message,
  Popover
} from "antd";
import { WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon } from "react-share";
import { useNavigate } from "react-router-dom";
import emptyCalls from "../../assets/img/notransaction.svg";
import View from "../../assets/img/view.svg";
import PDF from "../../assets/img/pdf.svg";
import Doc from "../../assets/img/documentdark.svg";
import DocDisabled from "../../assets/img/doc.svg";
import Share from "../../assets/img/share.svg";
import siteLogo from "../../assets/img/currentLogo.png";
import { useEffect, useState } from "react";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import {
  CONTRACT_STATUS,
  USER_TYPE_TEXT,
  getLocalStorage,
  setLocalStorage,
} from "../Common/Constants";
import {
  getContractList,
  getInvoicePdf,
} from "../../services/user";
import moment from "moment";
import {
  AdminProfile,
  EditEscrow,
  KYBVerificatioStep2,
  TransactionDetail,
  VerificationStep1,
} from "../Common/RouteConst";
import jsPDF from "jspdf";
// import { LoadingOutlined } from "@ant-design/icons";
import { getLoggers, getUserData } from "../../services/admin";
import DefaultLayout from "../Common/DefaultLayout";
import { createPdf } from "../User/NewTransaction/pdfGeneratorHelper";
import { NormalText } from "../ui-elements/TextRepo";
import Alerts from "../utilities/Alert";

const UserDashboard = ():any => {
  const navigate = useNavigate();
  const [contractList, setContractList] = useState([]);
  const [page, setPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [current, setCurrent] = useState(1);
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [tableloading, setTableLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState("");
  const [kycState, setKycState] = useState("");
  const [loading, setLoading] = useState(false); 
  const [shareModal, setShareModal] = useState<any>(false);
  const [contractDetailsLink, setContractDetailsLink] = useState<any>("");
  const [loggerDetails, setLoggerDetails] = useState<any>();
  const [copySuccess, setCopySuccess] = useState<any>({
    status: false,
    message: ""
  });
 
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const isKycVerified = local ? JSON.parse(local)?.isKycVerified : "";
  // const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  const handleCancel = () => {
    setPdfUrl("");
    setIsInvoiceModalOpen(false);
    setIsPdfModalOpen(false);
  };

  
  const checkLogger = () => {
    
    getLoggers(userAlias).then((res)=>{
      if(res.data && res.data.length){
        const failureCase = res.data.filter((a : any)=>a.statusCode === '400');
        if(failureCase.length){
          setLoggerDetails(failureCase[failureCase.length-1].message)
        }
      }
    })
  }
  const checkKycStatus = () => {
    getUserData(email)
      .then((res) => {
        setKycState(res?.data?.ekycState);
        if (!res?.data?.ekycStatus) {
          if (res?.data?.ekycState === "INITIATED") {
            if (res?.data?.userType === USER_TYPE_TEXT.ESCROW_ADVISOR) {
              const localStroragevalue = JSON.parse(getLocalStorage("auth")!);
              localStroragevalue.entityType = 'company';
              localStroragevalue.step = 2;
              setLocalStorage('auth',JSON.stringify(localStroragevalue));
              navigate(KYBVerificatioStep2);
            } else {
              navigate(VerificationStep1);
            }
            checkLogger();
          }
        }
      })
      .catch(() => {
        message.error("Oops! Could not fetch details. Please try again later!");
      });
  };

  useEffect(() => {
    checkKycStatus();
    fetchcontractList(1, 10, "escrow_advisor");
  }, []);
  const createInvoicePdf = async (response: string) => {
    try {
      const res = await getInvoicePdf(response);
      const doc: any = new jsPDF({ orientation: "portrait" });
      let data;
      let pdfBlob;
      let totalPages = 0;
      // Generate the PDF content
      await doc.html(res.data, {
        callback: async function (doc: any) {
          
          totalPages = doc?.internal.getNumberOfPages();
          const imgWidth = 8;
          const imgHeight = 12; 
          const imgX = 5;
          const imgY = doc.internal.pageSize.height - 15; 
          const positionX = imgWidth + imgX + 5;
          const positionY = doc.internal.pageSize.getHeight() - 10;
          const footer_img = 'https://i.ibb.co/xGGhWmv/endIcon.png';
          const internalWidth = doc.internal.pageSize.getWidth()
          for (let i = 1; i <= totalPages; i++) {
            
            doc.setPage(i);
            doc.addImage(siteLogo, "PNG", 4, 10, 40, 10.5);
            doc.setFont('helvetica','bold');
            doc.setTextColor(255,102,0)
            doc.setFontSize(18);
            doc.text("Tax Invoice",internalWidth - 40,17)

            doc.setFontSize(8);
            doc.setTextColor(115);
            doc.setFont("helvetica", "normal");
            doc.text("© Copyright " + new Date().getFullYear() + " TrustIn", positionX, positionY, { align: 'left'});
            doc.setTextColor(255,102,0);
            doc.text(" | ", positionX + 32, positionY, { align: 'left'});
            doc.setTextColor(115);
            doc.text("Email us: care@trustin.ae", positionX + 35, positionY, { align: 'left'});
            doc.text("TrustIn Limited, 512, 11th floor, AI Sarab Tower, ADGM Square, AI Maryah Island, Abu Dhabi-UAE, ", positionX, positionY + 5, { align: 'left' });
            doc.addImage(footer_img, 'JPEG', imgX, imgY, imgWidth, imgHeight);
          }

          pdfBlob = await doc.output("blob");

          const blobUrl = URL.createObjectURL(pdfBlob);
          data = blobUrl;
        },
        align: "left",
        // margin: [0, 0, 10, 0],
        margin: [18, 0, 18, 0],
        showHead: "everyPage",
        autoPaging: 'text',
        x: 0,
        y: 0,
      });

      return { blobData: pdfBlob, blobUrl: data };
    } catch (error) {
      return error;
    }
  };
  const viewPdf = (UrlData: any) => {
    // showPdfModal(true);
    setIsPdfModalOpen(true);
    createPdf(UrlData)
    .then(async (res) => {
      const pdf: any = await res;
      setPdfUrl(pdf.blobUrl);
    })
    .catch(() => {
      setIsPdfModalOpen(false);
      message.error(
        "Oops! Could not view the invoice. Please try again later!"
      );
    });
  };

  const detailView = (transaction:any) => {
    if (
      transaction?.contractStatus == "0" ||
      transaction?.contractStatus == "12"
    ) {
      navigate(EditEscrow + "/" + transaction?.aliasName);
    } else {
      navigate(TransactionDetail + "/" + transaction?.aliasName);
    }
  }

  // view invoices
  const viewInvoice = (UrlData: any) => {
    setInvoiceDetails("");
    setIsInvoiceModalOpen(true);
    createInvoicePdf(UrlData?.aliasName)
      .then(async (res) => {
        const pdf: any = await res;
        setInvoiceDetails(pdf.blobUrl);
      })
      .catch(() => {
        setIsInvoiceModalOpen(false);
        message.error(
          "Oops! Could not view the invoice. Please try again later!"
        );
      });
  };

  const fetchcontractList = (pageNo: number, limit: number, tabValue: string) => {
    getContractList(userAlias, pageNo > 0 ? pageNo - 1 : 0, limit, tabValue)
      .then((res: any) => {
        setTableLoading(false);
        setContractList(res?.data?.data);
        setTotalPage(res?.data?.lastPage * page);
        setLoading(false)
      })
      .catch(() => {
        setTableLoading(false);
        message.error("Oops! Could not fetch details. Please try again later!");
      });
  };
  const columns: object[] = [
    {
      title: "Transaction id",
      dataIndex: "agreementId",
      sorter: false,
      render: (text: any, values: any) => {
        return (
          <Typography.Text ellipsis={true} style={{ width: 150 }}>
            <span className="hyperLink" onClick={() => detailView( values )}>{text}</span> <br />
            <span className="text-muted fs-12x">
              {values?.isMilestone &&
              values?.contractStatus !== "0" &&
              values?.contractStatus !== "1" &&
              values?.activeMilestone
                ? `M${values?.activeMilestone} : ${
                    values?.activeMilestone
                      ? values?.transactions[values?.activeMilestone - 1].name
                      : ""
                  }`
                : ``}
            </span>
          </Typography.Text>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Buyer",
      dataIndex: "counterpartyDetails",
      sorter: false,
      render: (text: any) => {
        return <span>{text?.name}</span>;
      },
    },
    {
      title: "Seller",
      dataIndex:  "sellerDetails",
      sorter: false,
      render: (text: any) => {
        return  <span>{text?.name}</span>;
        },
    },
    {
      title: "Status",
      dataIndex: "contractAction",
      sorter: false,
      width: 200,
      render: (text: string) => {
        return (
          <span className="status">
            <span
              className={
                (text && CONTRACT_STATUS[text])
                  ? CONTRACT_STATUS[text].toLowerCase().split(" ").join("_")
                  : ""
              }
            >
              {text ? CONTRACT_STATUS[text] : ""}
            </span>
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "totalInvoiceAmount",
      sorter: false,
      width: 200,
      render: (text: string, value: any) => {
        return <b>{value?.currency + " " + parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>;
      },
    },
    {
      title: "Your fee",
      dataIndex: "escrowAdvisorCommission",
      sorter: false,
      width: 200,
      render: (text: string, value: any) => {
        return <b>{value?.currency + " " + parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>;
      },
    },
    {
      title: "Action",
      dataIndex: "contractAction",
      sorter: false,
      render: (text: string, values: any) => {
        return (
          <div className="text-center Nocursor dashboard-action">
            <div className="d-flex">
              <div>
                <img
                  src={View}
                  alt="view"
                  // preview={false}
                  className="cursor mt-1 "
                  onClick={() => detailView( values )}
                  height={16}
                  width={22}
                />

                {text === 'COMPLETED' ? ( 
                  <img
                    src={Doc}
                    alt="view"
                    // preview={false}
                    className="cursor px-3"
                    onClick={() => {
                      viewInvoice(values);
                    }}  
                  />
                ) : (
                  <Popover 
                    content="Invoice will be generated upon transaction completion"
                    placement="bottomLeft"
                  >
                    <img
                      src={DocDisabled}
                      alt="view"
                      // preview={false}
                      className="px-3"
                    />
                  </Popover>
                )}
                
                {text !== "SEND" && text !== "DRAFT" && text !== "INVALID" && (
                  <img
                    src={PDF}
                    alt="view"
                    // preview={false}
                    className="cursor"
                    onClick={() => viewPdf({ contractId: values.aliasName })}
                    style={{paddingRight: "3px"}}
                  />
                )}

                <img
                  src={Share}
                  alt="Share"
                  // preview={false}
                  className="cursor"
                  onClick={() => {
                    shareContractLink(values.aliasName);
                  }}                  
                />
                {/* {text !== "SEND" && values.pdfId == null && (
                  <Popover
                    content="Unfortunately, the PDF documents for this contract is not accessible or unavailable"
                    placement="bottomLeft"
                  >
                    <Image
                      src={disabledPdf}
                      alt="view"
                      preview={false}
                      className="cursor"
                    />
                  </Popover>
                )} */}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const shareContractLink = (contractAlias: any) => {
    const contractLink = `${window.location.protocol}//${window.location.host}/transaction-details/${contractAlias}`
    setShareModal(true);
    setContractDetailsLink(contractLink);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractDetailsLink).then(() => {
      setCopySuccess({
        status: true,
        message: "URL copied to clipboard successfully."
      })
    }, () => {
      alert('Failed to copy URL.');
    });
  };

  const handleShareClose = () => {
    setShareModal(false);
    setContractDetailsLink("");
    setCopySuccess({
      status: false,
      message: ""
    })
  }

  const pagination: object = {
    pageSize: page,
    current: current,
    style: { display: "none" },
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    fetchcontractList(pageno, page, 'escrow_advisor');
  };
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    fetchcontractList(1, value, 'escrow_advisor');
  };
  const itemRender: any = (
    _: any,
    type: string,
    originalElement: HTMLElement
  ) => {
    if (type === "prev") {
      return <a className="prev_nxt mx-4">Prev</a>;
    }
    if (type === "next") {
      return <a className="prev_nxt mx-4">Next</a>;
    }
    return originalElement;
  };

  const backToKycKyb = () => {
    if(userType === "USER") {
      navigate(VerificationStep1);
    } else if(userType === USER_TYPE_TEXT.ESCROW_ADVISOR) {
      const localStroragevalue = JSON.parse(getLocalStorage("auth")!);
      localStroragevalue.entityType = "company";
      localStroragevalue.step = 2;
      setLocalStorage('auth',JSON.stringify(localStroragevalue));
      navigate(KYBVerificatioStep2)
    }
  };

  const backToProfile = () => {
    if(userType === "USER") {
      navigate(AdminProfile);
    } 
  };

  return (
    <div className="ms-4">
          <DefaultLayout
        page="dashboard"
        loading={tableloading}
        headerPage=''
      >
                {isKycVerified == true ? (
                  <div className="dashboardTabs pt-15 userDashboardTab scrollable-container">
                    <div className="d-flex endtoend w-100 ">
                    </div>
                    {contractList?.length > 0 && tableloading == false  ?(
                    <>
                      <div className="paymentLog-mobile-view">
                        {contractList.map((contract: any, index:any) => (
                          
                          <div key={index} className="mobile-card row">
                            {columns.map((column:any, index:any) => (
                               <div key={`${contract.transactionNo}-${index}`} className="sub-body col-6 col-sm-4">
                                <div className="sub">
                                  <div className="mobile-header">
                                    {column.title}
                                  </div>
                                  <div className="mobile-data">{column.render(contract[column.dataIndex], contract)}</div>
                                </div>
                             </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <Table
                        columns={columns}
                        dataSource={contractList}
                        pagination={pagination}
                        className="mt-6 w-100 userDashboard paymentLogTable"
                        scroll={{ x: 1140 }}
                        loading={loading}
                      />
                    </>) : 
                    contractList?.length == 0 && tableloading == false ? 
                    <div className="nodataCard mt-3 text-center">
                    <Image src={emptyCalls} preview={false} className="mt-5" />
                    <p className="nodata mt-5">No escrow transaction yet</p>
                  </div> : ""}
                    {contractList?.length > 0 ? (
                      <div className="w-100 endtoend my-2 pagination-range">
                        <div className="show">
                          Show
                          <Select
                            defaultValue={10}
                            style={{ width: 70 }}
                            onChange={handleChange}
                            className="mx-2 pageRange"
                            options={[
                              {
                                value: 10,
                                label: "10",
                              },
                              {
                                value: 25,
                                label: "25",
                              },
                              {
                                value: 50,
                                label: "50",
                              },
                              {
                                value: 100,
                                label: "100",
                              },
                            ]}
                          />{" "}
                          <span className="page"> Per page</span>
                        </div>
                        <div className="right" style={{textAlign: 'center'}}>
                          <Pagination
                            current={current}
                            pageSize={page}
                            onChange={onChangePage}
                            total={totalPage || 1}
                            itemRender={itemRender}
                            showLessItems={true}
                            responsive
                            size="small"
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : isKycVerified === false ? (
                  <Alert
                    className="mt-5"
                    type="warning"
                    banner
                    message={
                      kycState === "APPROVAL_PENDING" ? (
                        <div className="">
                          Dear customer, your KYC/KYB information and documents
                          have been submitted successfully. Kindly bear with us
                          , you will be informed shortly with an update.
                          <span
                            className="cursor link"
                            onClick={() => {
                              backToKycKyb()
                            }}
                          >
                            Click here
                          </span>{" "}
                          to update details
                        </div>
                      ) : (
                          (kycState == "INITIATED" || kycState === "HOLD") ? (
                          <div className="">
                            Dear customer, your profile verification is
                            pending.Please complete KYC/KYB to create an escrow
                            transaction and complete the transaction process.
                            <span
                              className="cursor link"
                              onClick={() => {
                                backToKycKyb()
                              }}
                            >
                              Click here
                            </span>{" "}
                            to update details
                          </div>
                        ) : (kycState == 'COMPLETED') ? (
                          <div className="">
                            Dear customer, your documents are expired. Please update the documents to create an escrow
                            transaction and complete the transaction process.
                            <span
                              className="cursor link"
                              onClick={() => {
                                backToProfile()
                              }}
                            >
                              Click here
                            </span>{" "}
                            to update details
                          </div>
                        ) :
                        (
                          ""
                        )
                      )
                    }
                  />
                ) : (
                  ""
                )}
                { loggerDetails ? <Alert className="mt-5"
                type="error"
                banner
                message={'Your KYC/KYB verification is not completed, Please try verification process again, ' + loggerDetails}></Alert> : '' } 
</DefaultLayout>

      <Modal
        title={<div className="titleText mt-3 mb-5">Invoice details PDF</div>}
        centered
        width={"80%"}
        open={isInvoiceModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        {!invoiceDetails ? (
          <div
            className="d-flex align-items-center justify-content-center w-100"
            style={{ height: "60vh" }}
          >
            <Spin size="large" className="mainloader pdf" />
          </div>
        ) : (
          <>
            <object
              data={invoiceDetails}
              type="application/pdf"
              width="100%"
              height="450"
              useMap="invoice-details"
            >
              <p>Your browser does not support viewing PDFs {" "}
              
              </p>
              </object>
              <div className="text-center mt-3">
                <a href={typeof invoiceDetails === 'string' ? invoiceDetails : '#'} download="invoice-details.pdf">
                <button className="btn btn-primary">
                  Download the PDF
                  </button>
                </a>
            </div>
            </>
        )}
      </Modal>
      <Modal
        title={<div className="titleText mt-3 mb-5">Contract details PDF</div>}
        centered
        open={isPdfModalOpen}
        onCancel={handleCancel}
        footer={false}
        width={"80%"}
      >
        {!pdfUrl ? (
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
            height="450"
          >
            <p>Your browser does not support viewing PDFs {" "}
             
            </p>
          </object>
          <div className="text-center mt-3">
             <a href={pdfUrl} download="contract-details.pdf">
                Download the PDF
              </a>
          </div>
          </>
        )}
      </Modal>

      <Modal
        open={shareModal}
        confirmLoading={loading}
        onCancel={handleShareClose}
        footer={false}
        className="text-center modal-box"
        width={500}
      >
        <div className="my-4">
        <>
          {copySuccess.status && (
            <Alerts
              className="my-4 px-3"
              showIcon
              description={copySuccess.message || "Success!"}
              type="success"
            />
          )}
          <div className="m-2">
            <div className="d-flex align-items-center justify-content-center w-100 border p-2">
              <span>{contractDetailsLink}</span>
            </div>
            <Button onClick={copyToClipboard} className="modal-button m-2">copy link</Button>
          </div>
          <NormalText children={"or share via..."} />
          <EmailShareButton url={contractDetailsLink} className="p-2">
            <EmailIcon size={40} round={true}/>
          </EmailShareButton>
          <WhatsappShareButton url={contractDetailsLink} className="p-2">
            <WhatsappIcon size={40} round={true}/>
          </WhatsappShareButton>
        </>
        </div>
      </Modal>
    </div>
  );
};

export default UserDashboard;
