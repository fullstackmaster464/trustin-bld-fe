import {
  Button,
    Image,
    Modal,
    Pagination,
    Popover,
    Select,
    Spin,
    Table,
    Typography,
    message,
  } from "antd";
  import { useNavigate } from "react-router-dom";
  import View from "../../assets/img/view.svg";
  import PDF from "../../assets/img/pdf.svg";
  // import disabledPdf from "../../assets/img/pdf_gray.svg";
  import Doc from "../../assets/img/documentdark.svg";
  import DocDisabled from "../../assets/img/doc.svg";
  import emptyCart from "../../assets/img/nodata.svg";
  import { useEffect, useState } from "react";
  import "../../assets/scss/custom.scss";
  import "../../assets/scss/custom.scss";
  import moment from "moment";
  import { TransactionDetail } from "../Common/RouteConst";
  import { pendingTrusteeTxn, searchTrusteeTxn } from "../../services/trustee";
  import { createPdf } from "../User/NewTransaction/pdfGeneratorHelper";
  import { getInvoicePdf } from "../../services/user";
  import jsPDF from "jspdf";
  import siteLogo from "../../assets/img/bld-market-logo.jpg";
  
  const AllTransaction = ({searchedKey, setSearchedKey}: object|any):any => {
    const navigate = useNavigate();
    const [contractList, setContractList] = useState<any>([]);
    const [page, setPage] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [current, setCurrent] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState("");
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
    const handleCancel = () => {
      setPdfUrl("");
      setIsPdfModalOpen(false);
      setIsInvoiceModalOpen(false);
    };

    
    useEffect(() => {
      pendingTxn(1, 10);
    }, []);

    // useEffect(() => {
    //  getPaymentDetails(id).then(async (response: any) => {
       
    //      const data = response?.data;
    //      setPaymentDetails(data);  
    //  }).catch((err)=>{
    //   console.log(err)
    //  })
    // }, []);
    const locale = {
      allLocale: {
        emptyText: (
          <>
            <Image src={emptyCart} preview={false} className="mt-5" />
            <p className="nodata my-5">No pending transaction found</p>
          </>
        ),
      },
    };
    const columns = [
      {
        title: "Transaction id",
        // dataIndex: "agreementId",
        sorter: false,
        render:(text:any) => {
          return <Typography.Text ellipsis={true} style={{ maxWidth: 150 }} className="hyperLink" onClick={()=>{navigate(TransactionDetail+ "/" + text?.aliasName,{state:{pagefrom:'transaction'}})}}>
            {text?.agreementId}
          </Typography.Text>
        }
      },
      {
        title: "Date",
        dataIndex: "createAt",
        render: (text: string) => (
          <span className="date">
            {moment(new Date(text)).format("DD-MM-YYYY")}
          </span>
        ),
        sorter: false,
      },
      {
        title: "Buyer",
        dataIndex: "b_name",
        render: (text: string, values: any) => (
          <>
            <span className="counterparty-name">
              <Popover content={text || "N/A"} placement="bottom">
                <span className="counterparty-name"> {text ? text.split(" ")?.[0] : "N/A"}</span>
              </Popover>
            </span>
            <br />
            <span className="counterparty-email">
              <Popover content={values.b_email || "N/A"}  placement="bottom">
                <span className="Status">
                {values.b_email 
                  ? values.b_email.slice(0, 15) + (values.b_email.length > 15 ? "..." : "")
                  : "N/A"
                }
                </span>
              </Popover>
            </span>
          </>
        ),
      },
      {
        title: "Seller",
        dataIndex: "s_name",
        render: (text: string, values: any) => (
          <>
            <span className="counterparty-name">
              <Popover content={text || "N/A"} placement="bottom">
                <span className="counterparty-name"> {text ? text.split(" ")?.[0] : "N/A"}</span>
              </Popover>
            </span>
            <br />
            <span className="counterparty-email">
              <Popover content={values.s_email || "N/A"} placement="bottom">
                <span className="Status">
                {values.s_email 
                  ? values.s_email.slice(0, 15) + (values.s_email.length > 15 ? "..." : "")
                  : "N/A"
                }
                </span>
              </Popover>
            </span>
          </>
        ),
      },
      {
        title: "Amount",
        dataIndex: "totalInvoiceAmount",
        render: (text: string, values: any) => (
          <>
            <div>
              <span className="invoiceAmt">
                <span className="fw-4"></span>{" "}
                <span>
                  {values?.currency} {parseFloat(text)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </span>
            </div>
          </>
        ),
        sorter: false,
      },
      {
        title: "Status",
        dataIndex: "contractStatus",
        render: (text: string,values: any) => (
          <>
            <div className="text-center d-flex status">
              {(values && values?.isExpired == true) ? (
                <span className="expired">Expired</span>
              ) : (values && values?.isArchive === true) ? (
                <span className="archived">Archived</span>
              )
                : text === "7" ? (
                  <span className="disputed">Disputed</span>
                ) : text === "8" ? (
                  <span className="active">Refund Generated</span>
                ) : text === "9" ? (
                  <span className="completed_refunded">
                    Complete refund generated
                  </span>
                ) : text === "10" ? (
                  <span className="partial_refunded">Partial refund generated</span>
                ) : (text === "-1" || text === "-2") ? (
                  <span className="rejected">Rejected</span>
                ) : (text === "5") ? (
                  <span className="completed">Completed</span>
                ) :
                  (text === "2" || text === "3" || text === "4"
                  ) ? (
                    <span className="inprogress">In progress</span>
                  ) : (text === "1") ? (
                    <span className="pending">Pending</span>
                  ) :
                    (
                      <span className="sent">Verify</span>
                    )}
            </div>
          </>
        ),
        sorter: false,
      },
  
      {
        title: "Action",
        dataIndex: "pdfId",
        render: (text: string, values: any) => {
          return (
            <>
              <div className="text-center d-flex status">
              <div className="d-flex align-items-center gap-2">
              <div className="icon-container d-flex align-items-center gap-3">
                <Image 
                  src={View} alt="view" 
                  preview={false} 
                  className="cursor icon-default-size"
                  onClick={()=>{navigate(TransactionDetail+ "/" + values?.aliasName,{state:{pagefrom:'transaction'}})}} 
                />
                {(values.contractStatus >= 5)? (
                  <img
                    src={Doc}
                    alt="view"
                    className="cursor icon-default-size"
                    onClick={() => {
                      viewInvoicePdf(values);
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
                      className="icon-default-size"
                    />
                  </Popover>
                )}

                {/* UNDER OBSERVATIONS  */}
                 <Popover content={text != null ? "View Pdf" : ""} placement="bottomLeft">
                  <Image
                      src={PDF}
                      preview={false}
                      alt="view Pdf"
                      className="cursor icon-default-size"
                      onClick={() => viewPdf({ contractId: values.aliasName })}
                    />
                  </Popover>
                {/* {text != null ? (
                  <Image
                    src={PDF}
                    preview={false}
                    alt="view Pdf"
                    className="cursor icon-default-size"
                    onClick={() => viewPdf({ contractId: values.aliasName })}
                  />
                ) : (
                  <Popover
                    content="Unfortunately, the PDF documents for this contract is not accessible or unavailable"
                    placement="bottomLeft"
                  >
                    <Image
                      src={disabledPdf}
                      preview={false}
                      height={20}
                      width={20}
                      alt="view Pdf"
                    />
                  </Popover>
                )} */}
                </div>
                <div className="button-container d-flex align-items-center">
                {values?.isMilestone
                  ? values?.transactions?.some(
                      (milestone: { documentStatus: string; trusteeApproveStatus: any }) =>
                        milestone.documentStatus === "VERIFIED" && milestone.trusteeApproveStatus === null
                    ) && (
                      <Button
                        className="add-itemtype"
                        onClick={() =>
                          navigate(TransactionDetail + "/" + values?.aliasName, {
                            state: { triggerButton: "true" },
                          })
                        }
                      >
                        <div> Verify & Release </div>
                      </Button>
                    )
                  : values?.transactions?.[0]?.documentStatus === "VERIFIED" &&
                    values?.transactions?.[0]?.trusteeApproveStatus === null && (
                      <Button
                        className="add-itemtype w-auto"
                        onClick={() =>
                          navigate(TransactionDetail + "/" + values?.aliasName, {
                            state: { triggerButton: "true" },
                          })
                        }
                      >
                        <div> Verify & Release </div>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        },
      },
    ];

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
    
    const viewInvoicePdf = (UrlData: any) => {
      setLoader(true);
      setInvoiceDetails("");
      setIsInvoiceModalOpen(true);
      createInvoicePdf(UrlData?.aliasName)
      .then(async (res) => {
        const pdf: any = await res;
        setInvoiceDetails(pdf.blobUrl);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
        setIsInvoiceModalOpen(false);
        message.error(
          "Oops! Could not view the invoice. Please try again later!"
        );
      });
    };
  
    const viewPdf = (UrlData: any) => {
      setLoader(true);
      setIsPdfModalOpen(true);
      createPdf(UrlData)
      .then(async (res) => {
        const pdf: any = await res;
        setPdfUrl(pdf.blobUrl);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
        setIsPdfModalOpen(false);
        message.error(
          "Oops! Could not view the invoice. Please try again later!"
        );
      });
    };
  
    const pendingTxn = (
      current: number,
      page: number,
    ) => {
      setLoading(true);
      pendingTrusteeTxn(
        current || 1,
        page || 10,
        "sortByAgreementId",
        "DESC",
        { id: "all" }
      )
        .then((response) => {
          setLoading(false);
          // setContractList(response.data.data);
          const draftedContracts = response.data.data.filter(
            (contract: { contractStatus: string; }) => contract.contractStatus !== "0"
          );
          setContractList(draftedContracts);
          // setCount({ all: response.data.count });
          setTotalPage(response.data.lastPage * page);
        })
        .catch(() => {
          setLoading(false);
          message.error("Could not fetch list. Please try again later!")
        });
    };
  
    const pagination: object = {
      pageSize: page,
      current: current,
      style: { display: "none" },
    };
    const onChangePage = (pageno: number) => {
      setCurrent(pageno);
      if (searchedKey?.length > 0) {
        onSearch(searchedKey, pageno, page);
      } else {
        pendingTxn(pageno, page);
      }
    };
    const handleChange = (value: number) => {
      setPage(value);
      setCurrent(1);
      if (searchedKey?.length > 0) {
        onSearch(searchedKey, 1, value);
      } else {
        pendingTxn(1, value);
      }
    };
    const itemRender:any = (_: any, type: string, originalElement: HTMLElement) => {
      if (type === "prev") {
        return <a className="prev_nxt mx-4">Prev</a>;
      }
      if (type === "next") {
        return <a className="prev_nxt mx-4">Next</a>;
      }
      return originalElement;
    };
    
    const onSearch = (searchedKey: string, currentPage: number, pageNo: number) => {
      if (searchedKey?.length === 0) {
        setSearchedKey("");
        pendingTxn(1,pageNo);
      } else {
        // eslint-disable-next-line no-self-assign
        searchedKey = searchedKey;
        setSearchedKey(searchedKey || searchedKey);
        const reqBody = { key: searchedKey || searchedKey };
        setLoading(true);
        searchTrusteeTxn(
          currentPage || 0,
          pageNo || 10,
          "sortByAgreementId",
          "DESC",
          reqBody
        )
          .then((response) => {
            setLoading(false);
            if (response?.status === 201 || response?.status === 200) {
              setLoading(false);
              setContractList(response.data.data);
              setTotalPage(response.data.lastPage * page);
            }
          })
          .catch((err: any) => {
            setLoading(false);
            if (err) {
              message.error(
                err?.error?.message ? err?.error?.message : "Something went wrong!"
              );
            }
          });
      }
    };
  
    useEffect(() => {
      if (searchedKey?.length > 0) {
        onSearch(searchedKey, 1, page);
      } else {
        pendingTxn(1, page);
      }
    }, [searchedKey]);

    return (
      <div>
        <div className="fullHeight">
                <Table
                  columns={columns}
                  dataSource={contractList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-3"
                  scroll={{ x: 400 }}
                  locale={locale.allLocale}
                />
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
            {!pdfUrl || loader ? (
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
                useMap="invoice-details"
              >
                <p>Your browser does not support viewing PDFs {" "}
                
                </p>
                </object>
                <div className="text-center mt-3">
                  <a href={pdfUrl} download="contract-details.pdf">
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
  
  export default AllTransaction;
  