import {
  Breadcrumb,
  Card,
  Col,
  Image,
  Pagination,
  Row,
  Select,
  Table,
  Spin,
  Typography,
  Modal,
  Tooltip,
  message,
  Tabs
} from "antd";
import HistoryIcon from "../../assets/img/escrowaccountbg.svg";
import emptyCard from "../../assets/img/emptyCard.svg";


import "../../assets/scss/custom.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  getContractListByContractStatus,
  getWalletTotalAmountAndCount,
  getWalletTransactionCount,
  getWalletTransactionList,
} from "../../services/user";
import { getPaymentReceiptPDF } from "../../services/admin";
import jsPDF from "jspdf";
import siteLogo from "../../assets/img/currentLogo.png";
import { getLocalStorage, VALID_CURRENCY } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
import Doc from "../../assets/img/documentdark.svg";
import { getblockAmount } from "../../services/cheque";
import TabPane from "antd/es/tabs/TabPane";

const EscrowTransactionHistory = ():any => {
  const [Width, setWidth] = useState<any>(document?.body?.clientWidth);
  const [page, setPage] = useState<any>(10);
  const [current, setCurrent] = useState<any>(1);
  const [loading, setLoading] = useState<any>(false);
  const [walletTransaction, setWalletTransaction] = useState<any>([]);
  const [walletAmountAndCount, setWalletAmountAndCount] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [blockedAmount, setBlockedAmount] = useState<any>(0);
  const [spinLoading, setSpinLoading] = useState<any>(false);
  const [Tableloading, setTableloading] = useState<any>(false);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [currencyList, setCurrencyList] = useState(VALID_CURRENCY);
  const [currentTab, setCurrentTab] = useState<string>();
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };

  const [pdfUrl, setPdfUrl] = useState("");

    const createPaymentReceiptPdf:any = async (transactionNo: string) => {
      const res = await getPaymentReceiptPDF(transactionNo);
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
          doc.text("Payment Receipt",internalWidth - 60,12)

          // Add the footer
          doc.setFont('helvetica','normal');
          doc.setTextColor(0, 51, 153)
          doc.setFontSize(12);
          doc.text("This is a system-generated digital document. For more information, visit www.trustin.ae",22, doc.internal.pageSize.height - 30)
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

    const viewPdf = (transactionNo: string) => {
      setPdfLoading(true);
      setIsPdfModalOpen(true);
      createPaymentReceiptPdf(transactionNo)
      .then(async (res: any) => {
        setPdfLoading(false);
        const pdf: any = await res;
        setPdfUrl(pdf.blobUrl);
      })
      .catch((error: any) => {
        setPdfLoading(false);
        setIsPdfModalOpen(false);
        if(error?.data?.error) {
          message.error(
            "Payment receipt not found!"
          );  
        } else {
          message.error(
            "Oops! Could not view the payment receipt. Please try again later!"
          );
        }
      });
    };
  const columns: object[] = [
    {
      title: "Account Id",
      dataIndex: "VirtualAccountId",
      sorter: false,
      // width: 150,
      render: (text: any) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Type",
      dataIndex: "AccountType",
      sorter: false,
      // width: 100,
    },
    {
      title: "Booking Date",
      dataIndex: "createAt",
      sorter: false,
      // width: 100,
      render: (text: string, value : any) => {
        const date = value?.BookingDateTime ? value?.BookingDateTime : text;
        return <span>{moment.utc(new Date(date)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      sorter: false,
      // width: 100,
      render: (text: string) => {
        return (
          <span>
            {parseFloat(text).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      title: "Charges",
      dataIndex: "PaymentCharges",
      sorter: false,
      // width: 100,
      render: (text: string) => {
        if(!text) return <Typography.Text ellipsis={true}  className="overflowText">--</Typography.Text>;
        const isPointValue = Number(text) % 1 !== 0;
        const formattedAmount = isPointValue ? ` ${parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ` ${parseFloat(text).toLocaleString()}`;
        return <span>{formattedAmount}</span>;
      },
    },
    {
      title: "Indicator",
      dataIndex: "CreditDebitIndicator",
      sorter: false,
      // width: 100,
      render: (text: string) => {
        return <span>{text === "C" ? "Credit" : text} </span>;
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      // width: 100,
      render: (text: any) => {
        return (
          <div className="status capitalize">
            <span className={text.toLowerCase()}>{text}</span>
          </div>
        );
      },
    },
    {
      title: "Payment Mode",
      dataIndex: "PaymentMode",
      sorter: false,
      // width: 150,
    },
    {
      title: "Action",
      dataIndex: "PDFAction",
      sorter: false,
      render:(_text: string, values: any) => {
        return (
          <div className="text-center Nocursor dashboard-action">
            <div className="d-flex">
              <Tooltip
                title="Download/View payment receipt"
                overlayClassName="leads-custom-tooltip"
              >
                <img
                  src={Doc}
                  alt="view"
                  // preview={false}
                  className="cursor px-3"
                  onClick={() => {
                    let id = values.BankReferenceNumber;
                    if(values.CreditDebitIndicator ==  "Credit" || values.CreditDebitIndicator ==  "C") id = values.NotificationId;
                    viewPdf(id)
                  }}
                />
              </Tooltip>
            </div>
          </div>
        )}
      }
  ];
  const handleCancel = () => {
    setIsPdfModalOpen(false)
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  },[])

  useEffect(() => {
    walletTransactionCount();
  }, []);

  const walletTransactionCount = async () => {
    const counts = await getWalletTransactionCount(userAlias);
    const finalList = [];
    if(!counts.data){
      setCurrencyList([]);
      return;
    }
    if(!counts.data.aedCount && !counts.data.usdCount){
      setCurrencyList([]);
      return;
    }
    if(counts.data.aedCount != 0) {
      finalList.push("AED");
    }
    if(counts.data.usdCount != 0) {
      finalList.push("USD");
    }
    setCurrencyList(finalList);
    setCurrentTab(finalList[0]);
    setCurrentTab(finalList.length > 0 ? finalList[0] : "AED");
  }

  useEffect(() => {
    walletTransactionList(0,10,currentTab);
    totalAmountAndCount();
    getBlockedAmount();
    getChequeBlockedAmount();
  }, [currentTab]);

  const walletTransactionList = (currentPage = 0, limit = 10, currency = 'AED') => {
    !currentPage && setSpinLoading(true);
    setTableloading(true);
    getWalletTransactionList(
      userAlias,
      "ESCROW",
      "ALL",
      currentPage > 0 ? currentPage - 1 : currentPage,
      limit,
      currency
    )
      .then((response) => {
        console.log("VATransactionList==>",response.data?.VATransactionList);

        setSpinLoading(false);
        setTableloading(false);
        setWalletTransaction(response.data?.VATransactionList?.data);
        setTotalPage(response.data?.VATransactionList?.lastPage * limit);
        setTotalCount(response.data?.VATransactionList?.escrowCount ?? 0);
      })
      .catch(() => {
        setLoading(false);
        setWalletTransaction([]);
      });
  };

  const totalAmountAndCount = () => {
    getWalletTotalAmountAndCount(userAlias, currentTab)
      .then((response) => {
        setWalletAmountAndCount(response.data?.walletTransaction);
      })
      .catch(() => {
        setWalletAmountAndCount([]);
        setLoading(false);
      });
  };

  const getBlockedAmount = () => {
    getContractListByContractStatus(userAlias, "2")
      .then((response) => { 
        if (!response || !response.data) {
          return;
        }
        if (response.status === 201 || response.status === 200) {
          const blockedContracts = response.data.filter(
            (contract: any) =>
              contract.transactions[0]?.paymentStatus === "INACTIVE"
          );
          if (blockedContracts.length > 0) {
            let amount = 0;
            blockedContracts.map(
              (contract: any) => (amount += Number(contract?.invoiceAmount))
            );
            setBlockedAmount(amount);
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getChequeBlockedAmount = () => {
    getblockAmount(userAlias)
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          const { blockAmount } = response.data?.walletTransaction as any;
          setBlockedAmount(blockedAmount +  Number(blockAmount));
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };
  
  const onTabChange= (tabValue: any) => {
    setCurrentTab(tabValue);
  }
 
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    walletTransactionList(0, value, currentTab);
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    walletTransactionList(pageno, page, currentTab);
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

  const pagination: object = {
    pageSize: page,
    current: current,
    style: { display: "none" },
  };
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
        <DefaultLayout
          page="transactionhistory_escrow"
          TitleText="Escrow Transaction History"
          TitleImage={HistoryIcon}
          loading={loading}
          headerPage={
            <div className={Width > 767 ? "d-flex" : "d-flex mt-4"}>
              <Image
                src={HistoryIcon}
                preview={false}
                className="mt-2 cursor header-icon"
              />
              <div className="mx-3">
                <b> Escrow account transaction history</b>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item className="breadcrumb-title-text">
                    Transaction history
                  </Breadcrumb.Item>
                  <Breadcrumb.Item
                    // onClick={() => {
                    //   navigate(KYBManagementList);
                    // }}
                  >
                    Escrow account transaction history
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          }
        >
          <div  className={Width > 991 ? "dashboardTabs pt-15 userDashboardTab " : "pt-2 userDashboardTab"}>
            <div  className={Width > 991 ? "d-flex endtoend w-100 escrow-tran-card create-transaction-resbtn" : "d-flex endtoend w-100 escrow-tran-card"}>
              {/* {Width > 767 ?  */}
              <div className={Width > 991 ? "d-flex w-100 overflow-auto res-escrow-history-tabs escrow-tran-card" : "d-flex w-100 overflow-auto res-escrow-history-tabs  res-escrow-history escrow-tran-card pt-0 mt-0"}>
              <Tabs
                defaultActiveKey={currencyList[0]}
                // className="d-none-res"
                className="tableTab overflow-auto w-100"
                onChange={onTabChange}
              >
                {currencyList.map((currency: string) => (
                  <TabPane
                    tab={currency}
                    key={currency}
                  ></TabPane>
                ))}
              </Tabs>
              </div> 
            </div>
          </div>
                    
          <div className="row g-3">
            <div className="col-md-6 col-lg-6 col-xl-3">
              <Card className="balance_card h-100">
                <div className="balance px-4 pt-4">Balance amount</div>
                {spinLoading ? (
                  <>
                    <div className="px-4 pt-1 pb-3">
                      <Spin />
                    </div>
                    <div className="balance px-4 pb-3">Please wait...</div>
                  </>
                ) : (
                   <>
                    <div className="bal_amount px-4 balance-amount-wordwrap">
                    {`${currentTab || ""}  `}
                  </div>
                  <div className="bal_amount px-4 pb-4 balance-amount-wordwrap">
                    {walletAmountAndCount?.balanceAmount &&
                    parseFloat(walletAmountAndCount.balanceAmount) >= 0
                      ? parseFloat(
                        walletAmountAndCount.balanceAmount
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      :  "0.00"}
                  </div>
                </>
                )}
              </Card>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <Card className="balance_card h-100">
                <div className="balance px-4 pt-4">Available amount</div>
                {spinLoading ? (
                  <>
                    <div className="px-4 pt-1 pb-3">
                      <Spin />
                    </div>
                    <div className="balance px-4 pb-3">Please wait...</div>
                  </>
                ) : (
                  <>
                    <div className="bal_amount px-4 balance-amount-wordwrap">
                       {`${currentTab || ""}  `}
                    </div>
                    <div className="bal_amount px-4 pb-4 balance-amount-wordwrap">
                    {walletAmountAndCount?.availableAmount &&
                    parseFloat(walletAmountAndCount.availableAmount) >= 0
                      ? parseFloat(
                          walletAmountAndCount.availableAmount
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </div>
                  </>
                )}
              </Card>
            </div>
            <Col className="col-md-6 col-lg-6 col-xl-3">
              <Card className="blocked_card h-100">
                <div className="blocked px-4 pt-4">Blocked amount</div>
                {spinLoading ? (
                  <>
                    <div className="px-4 pt-1 pb-3">
                      <Spin />
                    </div>
                    <div className="px-4 pb-3">Please wait...</div>
                  </>
                ) : (
                  <>
                    <div className="blocked_amount px-4 balance-amount-wordwrap">
                       {`${currentTab || ""}  `}
                    </div>
                    <div className="blocked_amount px-4 pb-4">
                   {blockedAmount >= 0
                      ? `${blockedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "0.00"}
                  </div>
                  </>
                )}
              </Card>
            </Col>
            <Col className="col-md-6 col-lg-6 col-xl-3">
              <Card className="blocked_card h-100">
                <div className="blocked px-4 pt-4">Total count</div>
                {spinLoading ? (
                  <>
                    <div className="px-4 pt-1 pb-3">
                      <Spin />
                    </div>
                    <div className="px-4 pb-3">Please wait...</div>
                  </>
                ) : (
                  <div className="blocked_amount px-4 pb-4">
                    {totalCount}
                  </div>
                )}
              </Card>
            </Col>
          </div>
          <Row className={Width > 679 ? "mt-4" : "mt-2"}>
            <Col span={24}>
              {walletTransaction?.length > 0 ? (
                <>
                  <div className="paymentLog-mobile-view">
                    {walletTransaction.map((txn: any, index: any) => (
                      <div key={index} className="mobile-card row">
                        {columns.map((column: any, index: any) => (
                          <div
                            key={`${txn.transactionNo}-${index}`}
                            className="sub-body col-6 col-sm-4"
                          >
                            <div className="sub">
                              <div className="mobile-header">
                                {column.title}
                              </div>
                              <div className="mobile-data">
                                {column.render
                                  ? column.render(txn[column.dataIndex], txn)
                                  : txn[column.dataIndex]}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <Table
                    columns={columns}
                    dataSource={walletTransaction}
                    pagination={pagination}
                    className="mt-6 paymentLogTable"
                    scroll={{ x: 1200 }}
                    loading={Tableloading}
                  />
                </>
              ) : (
                <div className="nodataCard text-center px-5">
                  <Image src={emptyCard} preview={false} className="mt-5" />
                  <p className="nodata py-5">No history found</p>
                </div>
              )}
              {walletTransaction?.length > 0 ? (
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
                  <div className="right" style={{ textAlign: "center" }}>
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
            </Col>
          </Row>
          <Modal
            title={<div className="titleText mt-3 mb-5">Payment receipt PDF</div>}
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
                    <a href={pdfUrl} download="payment-receipt.pdf">
                    <button className="btn btn-primary">
                      Download the PDF
                      </button>
                    </a>
                </div>
              </>
            )}
          </Modal>
        </DefaultLayout>
      </div>
    </div>
  );
};

export default EscrowTransactionHistory;
