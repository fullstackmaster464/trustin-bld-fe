import { 
  Button,
  Image,
  Modal,
  Pagination,
  Select,
  Spin,
  Table,
  Tabs,
  Typography,
  message,
  Popover,
  Tooltip
} from "antd";
import { WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon } from "react-share";
import { useNavigate } from "react-router-dom";
import emptyCalls from "../../assets/img/notransaction.svg";
import View from "../../assets/img/view.svg";
import PDF from "../../assets/img/pdf.svg";
import Doc from "../../assets/img/documentdark.svg";
import DocDisabled from "../../assets/img/doc.svg";
import Share from "../../assets/img/share.svg";
import siteLogo from "../../assets/img/bld-market-logo.jpg";
import { useEffect, useState } from "react";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import managercheque from "../../assets/img/managerchequeGray.svg"
import {
  CHEQUE_STATUS,
  USER_TYPE_TEXT,
  getLocalStorage, 
} from "../Common/Constants";
import TabPane from "antd/lib/tabs/TabPane";
import {
  getAdvanceChequeList,
  getInvoicePdf,
  getPdf,
} from "../../services/cheque";
import moment from "moment";
import {
  ChequeDetails,
  CreateCheque,
  EditCheque, 
} from "../Common/RouteConst";
import jsPDF from "jspdf"; 
import DefaultLayout from "../Common/DefaultLayout";
import { NormalText } from "../ui-elements/TextRepo";
import Alerts from "../utilities/Alert"; 


const ChequeList = ():any => {
  const navigate = useNavigate();
  const [chequeList, setChequeList] = useState([]);
  const [tab, setTab] = useState("all");
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
  const [loading, setLoading] = useState(true); 
  const [shareModal, setShareModal] = useState<any>(false);
  const [contractDetailsLink, setContractDetailsLink] = useState<any>("");

  const [copySuccess, setCopySuccess] = useState<any>({
    status: false,
    message: ""
  });
  const [count, setCount] = useState({
    all: 0,
    draft: 0,
    buyer: 0,
    seller: 0, 
  });
  
  // const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  const handleCancel = () => {
    setPdfUrl("");
    setIsInvoiceModalOpen(false);
    setIsPdfModalOpen(false);
  };

  // useEffect(() => {
  //   fetchList(1, 10, "all");
  // }, []);

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
            doc.addImage(siteLogo, "PNG", 4, 10, 20, 10.5);
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
        margin: [20, 0, 20, 0],
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
    .then(async (res :any) => {
      const pdf: any = await res;
      setPdfUrl(pdf.blobUrl);
    })
    .catch(() => {
      // setIsPdfModalOpen(false);
      message.error(
        "Oops! Could not view the invoice. Please try again later!"
      );
    });
  };

  const createPdf = async (response: object|any, tab = "_self"):Promise<any> => {
    try {
      // let url;
      const local = getLocalStorage("auth");
      const userAlias = local ? JSON.parse(local)?.userAlias : "";
      response.userAlias = userAlias;
      const res = await getPdf(response);
      const doc:any = new jsPDF({compress:true, orientation:'portrait'});
      let totalPages = 0;
      let data;
      let pdfBlob;
      // Generate the PDF content
     await doc.html(res.data, {
        callback: async function (doc: any) {
        // Set the total number of pages once the PDF content is rendered
          totalPages = doc?.internal.getNumberOfPages();
          const internalWidth = doc.internal.pageSize.getWidth()
          const internalHeight = doc.internal.pageSize.getHeight()
          // Iterate over each page and add the header and footer
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            // Add the header
            doc.addImage(siteLogo, "PNG", 8, 10, 40, 10.25);
            doc.setFont('helvetica','bold');
            doc.setTextColor(255,102,0)
            doc.setFontSize(18);
            doc.text("Agreement Details",internalWidth - 60,18)
            // Add the footer
            // Calculate the position for each line of the footer
            const positionX = internalWidth / 2;
            const positionY = internalHeight - 10;
            doc.setFontSize(10);
            doc.setTextColor(115);
            doc.setFont('helvetica', 'normal');
            doc.text("© Copyright " + new Date().getFullYear() + " TrustIn", positionX - 45, positionY, { align: 'left'});
            doc.setTextColor(208,208,208);
            doc.text(" | ", positionX - 4, positionY, { align: 'left'});
            doc.setTextColor(115);
            doc.text("Email us: care@trustin.ae", positionX, positionY, { align: 'left'});
            doc.text("TrustIn Limited,512, 11th floor, Al Sarab Tower, ADGM Square, Al Maryah Island, Abu Dhabi-UAE.", positionX, positionY + 5, { align: 'center' });
            doc.setTextColor(0,55,149);
            doc.text(i.toString(), internalWidth - 12, positionY + 5);
          }
          pdfBlob = await doc.output('blob');
  
          const blobUrl = URL.createObjectURL(pdfBlob);
          data=blobUrl;
          // url = blobUrl
          if(tab !== 'no'){
            // window.open(blobUrl, tab);
          }
        },
        align: 'left',
        margin: [25, 10, 25, 10],
        showHead: "everyPage",
        autoPaging: 'text',
        x: 0,
        y: 0
      });
  
      return {blobData:pdfBlob, blobUrl:data}
    } catch (error) {
      return error;
    }
  };
  

  const detailView = (transaction:any) => { 
    if (transaction?.chequeStatus == "0" && 
      ((transaction?.contractStartedBy == USER_TYPE_TEXT.BUYER && userAlias == transaction.buyerAlias) ||
      (transaction?.contractStartedBy == USER_TYPE_TEXT.SELLER && userAlias == transaction.sellerAlias) ||
      ((transaction?.contractStartedBy == USER_TYPE_TEXT.BUYERPOA) &&( userAlias == transaction.sellerAlias|| userAlias == transaction.buyerAlias )))) {
      navigate(EditCheque + "/" + transaction?.aliasName,{state:{value:"draft"}}); // TODO
    } else {
      navigate(ChequeDetails + "/" + transaction?.aliasName)
    }
  }

  // view invoices
  const viewInvoice = (UrlData: any) => {
    setInvoiceDetails("");
    setIsInvoiceModalOpen(true);
    
    
    createInvoicePdf(UrlData)
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

  const fetchList = (pageNo: number, limit: number, tabValue: string) => {
    getAdvanceChequeList(userType === 'USER' ? userAlias : null,userType, pageNo > 0 ? pageNo - 1 : 0, limit, tabValue)
      .then((res: any) => {
        
        const count =  res?.data.allCount;
        const buyerCount = res?.data.buyerCount;
        const sellerCount = res?.data.sellerCount;
        
 
        
        setChequeList(res?.data?.data);
        setTotalPage(res?.data?.allCount);  
 

        setCount({
          all: count,
          draft: res?.data.draftCount,
          buyer: buyerCount,
          seller: sellerCount,
        });
        let total = 0;
        if (tabValue === 'all') total = res.data.allCount || 0;
        else if (tabValue === 'buyer') total = res.data.buyerCount || 0;
        else if (tabValue === 'seller') total = res.data.sellerCount || 0;
        else if (tabValue === 'draft') total = res.data.draftCount || 0; 
        setTotalPage(total);
      })
      .catch(() => {
        message.error("Oops! Could not fetch details. Please try again later!");
      }).finally(() => {
        setTableLoading(false);
        setLoading(false)
      });
  };
  const columns: object[] = [
    {
      title: "Cheque id",
      dataIndex: "agreementId",
      sorter: false,
      render: (text: any, values: any) => {
        return (
          <Typography.Text ellipsis={true} style={{ width: 150 }}>
            <span className="hyperLink" onClick={() => detailView( values )}>{text}</span>
          </Typography.Text>
        );
      },
    },
    {
      title: "My role",
      dataIndex: "userAlias",
      sorter: false,
      render: (_text: string, value: any) => {
        // return LoginUserAlias == value.sellerAlias
        //   ? "SELLER"
        //   : LoginUserAlias == value.buyerAlias
        //   ? "BUYER"
        //   : "";
        return <span>{value?.loggedInRole || "--"}</span>
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
      title: "Counter party",
      dataIndex: "counterpartyDetails",
      sorter: false,
      render: (text: any) => {
        const displayText = text?.companyname ? text?.companyname : text?.name;
        const shouldWrap = displayText?.length * 7 > 180;
    
        return (
          <div className={shouldWrap ? 'tableWordWrap' : ''}>
            <Tooltip
              title={shouldWrap ? displayText : null}
              overlayClassName="custom-tooltip"
              placement="topLeft"
            >
              <span>{displayText}</span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Email address",
      dataIndex: "counterpartyDetails",
      sorter: false,
      render: (text: any) => {
        return  userType === USER_TYPE_TEXT?.ESCROW_ADVISOR ? <span>{text?.name}</span> : <Typography.Text style={{ width: 200 }}>{text?.email}</Typography.Text>;
        },
    },
    {
      title: "Status",
      dataIndex: "chequeAction",
      sorter: false,
      width: 200,
      render: (text: string) => {
        return (
          <span className="status">
            <span
              className={
                (text && CHEQUE_STATUS[text])
                  ? CHEQUE_STATUS[text].toLowerCase().split(" ").join("_")
                  : ""
              }
            >
              {text ? CHEQUE_STATUS[text] : ""}
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
      title: "Action",
      dataIndex: "chequeAction",
      sorter: false,
      render: (text: string, values: any) => {
        return ( 
          <div className="text-center Nocursor dashboard-action">  
            <div className="d-flex">
              <img
                src={View}
                alt="view"
                
                // preview={false}
                className="cursor h-auto"
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
                    viewInvoice({ chequeId: values.aliasName });
                  }}  
                />
              ) : (
                <Popover 
                  content="Invoice will be generated upon transaction completion"
                  placement="bottomLeft"
                    overlayClassName="custom-popover"
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
                  onClick={() => viewPdf({ chequeId: values.aliasName })}
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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get("tab") || "all";
    setTab(tabParam);
    fetchList(current, page, tabParam);
  }, [location.search, current, page]);

  const onTabchange = (tabValue: string) => {    
    setTab(tabValue);
    setLoading(true);
    setCurrent(1);
    fetchList(1, page, tabValue);
     navigate(`${location.pathname}?tab=${tabValue}`, { replace: true });
  };
  const pagination: object = {
    pageSize: page,
    current: current,
    style: { display: "none" },
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    fetchList(pageno, page, tab);
  };
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    fetchList(1, value, tab);
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

   
  return ( 
    <>
    
    <DefaultLayout
          page="cheque"
          loading={loading}
          TitleText="Manager Cheques"
          TitleImage={managercheque}
          headerPage={
            <div className="d-flex">
              <Image src={managercheque}  preview={false} className="mt-2" alt="kybimage" />
              <div className="ml-5">
                <b>Manager Cheques</b>
              </div>
            </div>
          }>
                <div className="dashboardTabs pt-15 userDashboardTab scrollable-container">
                    <div className="d-flex endtoend w-100 escrow-tran-card">
                      {/* {Width > 767 ?  */}
                      <div className="d-flex w-100 overflow-auto dashboardTabs escrow-tran-card">
                      <Tabs
                        // defaultActiveKey={tab}
                         activeKey={tab}
                        // className="d-none-res"
                        className="tableTab overflow-auto w-100"
                        onChange={onTabchange}
                      >
                        <TabPane
                          tab={`All (${count?.all})`}
                          key="all"
                        ></TabPane>
                        <TabPane
                          tab={`Buyer / BuyerPOA (${count?.buyer})`}
                          key="buyer"
                        ></TabPane>
                        <TabPane
                          tab={`Seller / SellerPOA (${count?.seller})`}
                          key="seller"
                        ></TabPane>
                        
                         {/* <TabPane
                          tab={`Draft (${count?.draft})`}
                          key="draft"
                        ></TabPane> */}
                         
                                                
                      </Tabs>
                      </div> 
                      <div className="addBtn mt-0">
                        <Button
                          className="rounded mt-0 w-auto trns-btn"
                          onClick={() => {
                            navigate(CreateCheque);
                          }}>
                          New Transaction
                        </Button>
                     </div>
                    </div>
                    {chequeList?.length > 0 && tableloading == false  ? (
                    <>
                      <div className="paymentLog-mobile-view">
                        {chequeList.map((contract: any, index:any) => (
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
                        dataSource={chequeList}
                        pagination={pagination}
                        className="mt-6 w-100 userDashboard paymentLogTable"
                        scroll={{ x: 1140 }}
                        loading={loading}
                      />
                    </>) : 
                    chequeList?.length == 0 && tableloading == false  ? 
                    <div className="nodataCard mt-3 text-center" style={{height : "100%"}}>
                    <Image src={emptyCalls} preview={false} className="mt-5" />
                    <p className="nodata mt-5">No transaction yet done</p>
                    {userType == 'USER' ?
                    <Button
                      type="primary"
                      className="modal-button mt-3 mb-5"
                      onClick={() => {
                        navigate(CreateCheque);
                      }}
                    >
                      Create Now
                    </Button> : null }
                  </div> : ""}
                    {chequeList?.length > 0 ? (
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
                          <span className="page"> Per page </span>
                        </div>
                        <div className="right" style={{textAlign: 'center'}}>
                          <Pagination
                            current={current}
                            pageSize={page}
                            onChange={onChangePage}
                              total={(totalPage || 1)}
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
          <object
            data={invoiceDetails}
            type="application/pdf"
            width="100%"
            height="450"
          >
            <p>Your browser does not support viewing PDFs {" "}
              <a href={invoiceDetails} download="contract-details.pdf">
                Download the PDF
              </a>.
            </p>
          </object>
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
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="450"
          >
            <p>Your browser does not support viewing PDFs {" "}
              <a href={pdfUrl} download="contract-details.pdf">
                Download the PDF
              </a>.
            </p>
          </object>
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
            <Button onClick={copyToClipboard} className="modal-button m-2">Copy link</Button>
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
      </>
     
  );
};

export default ChequeList;
