import {
  Breadcrumb,
  Card,
  Modal,
  Image,
  Pagination,
  Select,
  Table,
  Tabs,
  message,
  // Button,
  Tooltip,
  Typography,
  Button,
  Form,
  Col,
  Row,
  Input,
  Spin
} from "antd";
import PaymentLogIcon from "../../assets/img/Headers/Payment_log.svg";
import emptyCalls from "../../assets/img/nodata.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import { getPaymentLog, getPaymentLogFilter, getPaymentReceiptPDF, uaepgsPayment } from "../../services/admin";
import moment from "moment";
import DefaultLayout from "../Common/DefaultLayout";
import siteLogo from "../../assets/img/currentLogo.png";
import filterIcon from "../../assets/img/filter.svg";
import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import FormItem from "antd/es/form/FormItem";
// import axios from "axios";
// import { PAYMENT_STATUS } from "../Common/Constants";
import Doc from "../../assets/img/documentdark.svg";
import jsPDF from "jspdf";

const PaymentLog = ():any => {
  const [page, setPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [current, setCurrent] = useState(1);
  const [tab, setTab] = useState("all");
  const [PaymentList, setPaymentList] = useState<any>([]);
  const [count, setCount] = useState({ all: 0, initiated: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [isUaepgsModalVisible, setIsUaepgsModalVisible] = useState(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth)
  const [form] = Form.useForm();
  const [searchedKey, setSearchedKey] = useState<any>("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
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

  useEffect(() => {
    PaymentLogsList( current, page, "ALL" );
  }, []);

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
          "Payment receipt will be created once the payment is completed."
        );
      } else {
        message.error(
          "Oops! Could not view the payment receipt. Please try again later!"
        );
      }
    });
  };

  const handleCancel = () => {
    setIsUaepgsModalVisible(false);
    setIsPdfModalOpen(false);
  };
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);

    if (Object.keys(searchedKey)?.length > 0) {
      handleFilterApply(searchedKey, pageno, page);
    } else {  
    PaymentLogsList(pageno, page, tab);
    }
  };

  
  const onTabChange = (tabValue: string) => {
    setShowFilter(false);
    setTab(tabValue);
    setCurrent(1);
    PaymentLogsList(1, page, tabValue);
  };

  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    PaymentLogsList(1, value, tab);
  };
  
  const PaymentLogsList = (current: any, pageSize: any, paymentStatus = "ALL") => {
    setLoading(true);
    getPaymentLog(
      current - 1 || 0,
      pageSize || 10,
      paymentStatus || 'ALL'
    ).then(response => {
      
      setLoading(false);
      setPaymentList(response.data.paymentLogData.data)
      setTotalPage(response.data.paymentLogData.lastPage * pageSize);
      setCount({
        all: response.data.paymentLogData.count,
        initiated: response.data.paymentLogData.initiatedCount,
        completed: response.data.paymentLogData.completedCount,
      });
    })
    .catch(() => {
      setLoading(false);
      message.error("Could not fetch details. Please try again later")
  });
  }

  useEffect(() => {
    PaymentLogsList(current, page);
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);

  }, []);
  const itemRender:any = (_: any, type: string, originalElement: HTMLElement) => {
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

  const columns = [
    {
        title: 'Transaction id', 
        dataIndex: 'transactionNo',
        render: (text: any) => {
          // return <Link to="/admin/payment-log-detail"><span>{`TRUST - ${record.id}`}</span></Link>
          if(!text) return <Typography.Text ellipsis={Width > 767 ? true : false}  style={{ width: 150 }} className={Width >767 ? "overflowText" : "text-break"}>--</Typography.Text>;
          return (
          <>
            <Tooltip
              title={text}
              overlayClassName='custom-tooltip'
            >
              <Typography.Text  ellipsis={Width > 767 ? true : false} style={{ width: 150 }} className={Width >767 ? "overflowText" : "text-break"}>{text}</Typography.Text>
            </Tooltip>
          </>
          )
        }
    },
    {
      title: 'Agreement id',
      dataIndex: 'agreementId',
      render: (text: any) => {
        // return <Link to="/admin/payment-log-detail"><span>{`TRUST - ${record.id}`}</span></Link>
        if(!text) return <Typography.Text ellipsis={true} style={{ width: 150 }} className={Width >767 ? "overflowText" : "text-break"}>--</Typography.Text>;
        return (
        <>
          <Tooltip
            title={text?.length * 7 > 140 ? text : null}
            overlayClassName='custom-tooltip'
          >
            <Typography.Text ellipsis={true} style={{ width: 150 }} className={Width >767 ? "overflowText" : "text-break"}>{text}</Typography.Text>
          </Tooltip>
        </>
        )
      }
    },
    {
      title: 'From user info',
      dataIndex: 'fromEmail',
      render: (_text: string, record: any) => {
        const name = (record?.fromName ?? '').trim() || '--';
        const email = (record?.fromEmail ?? '').trim() || '--';
        const isWide = Width > 767;
        return (
          <div className="from-user-info">
            <Tooltip
              title={name !== '--' && name.length * 7 > 140 ? name : null}
              overlayClassName="custom-tooltip"
            >
              <Typography.Text
                className={Width >767 ? "overflowText" : "text-break truncate"}
                style={{ maxWidth: 180, display: 'block' }}
                ellipsis={isWide}
              >
                {name}
              </Typography.Text>
            </Tooltip>
            <Tooltip
              title={email !== '--' && email.length * 7 > 140 ? email : null}
              overlayClassName="custom-tooltip"
            >
              <Typography.Text
               className={Width >767 ? "overflowText-payLog" : "text-break"}
                style={{ maxWidth: 180, display: 'block' }}
                ellipsis={isWide}
              >
                {email}
              </Typography.Text>
            </Tooltip>
            </div>
          );
        },
    },
    {
        title: 'To user info',
        dataIndex: 'toEmail',
        render: (text: any, values: any) => {   
          if(!text) return <Typography.Text  ellipsis={Width > 767 ? true : false} style={{ width: 150 }} className="overflowText">--</Typography.Text>;       
          return (
          <>
              <div  className={Width >767 ? "counterparty-name table-text overflowText" : "counterparty-name table-text"}>
                <Tooltip
                  title={values?.toName?.length * 7 > 140 ? values?.toName : null}
                  overlayClassName='custom-tooltip'
                >
                  <div className={Width >767 ? "overflowText-payLog" : "text-break"}>
                    <span>{values?.toName}</span>
                  </div>
                </Tooltip>
              </div>
  
            <div className="counterparty-email table-text">
                <div className={Width >767 ? "Status overflowText" : "Status"}>
                  <Tooltip
                    title={text?.length * 7 > 140 ? text : null}
                    overlayClassName='custom-tooltip'
                  >
                    <div className={Width >767 ? "overflowText-payLog" : "text-break"}>
                      <span>{text}</span>
                    </div>
                  </Tooltip>                  
                </div>
            </div>
          </>
        )}
      },
      {
        title: 'Payment status',
        dataIndex: 'paymentStatus',
        render: (text: any) => {
          if(!text) return <Typography.Text ellipsis={true} style={{ width: 150 }} className="overflowText">--</Typography.Text>;
          const capitalize = (text: any) => {
            if (!text) return "";
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
          };
          return <Typography.Text ellipsis={true} style={{ width: 150 }}>  {capitalize(text)}</Typography.Text>;
          },
      },
      {
        title: 'From account',
        dataIndex: 'fromAccountNo',
        render: (text: any) => {
          if (!text) {
            return (
              <Typography.Text ellipsis style={{ width: 150 }} className="overflowText">
                --
              </Typography.Text>
            );
          }          
          return (
            <div className="account-text-wrapper">
              <Tooltip
                title={text?.length > 20 ? text : null} 
                overlayClassName="custom-tooltip"
              >
                <div className={Width >767 ? "overflowText-payLog" : "text-break"} style={{ maxWidth: 150 }}>
                  <span>{text}</span>
                </div>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: 'To account',
        dataIndex: 'toAccountNo',
        render: (text: any) => {
          if (!text) {
            return (
              <Typography.Text ellipsis style={{ width: 200 }} className="overflowText">
                --
              </Typography.Text>
            );
          }
          return (
            <div className="account-text-wrapper">
              <Tooltip
                title={text?.length > 20 ? text : null} 
                overlayClassName="custom-tooltip"
              >
                <div className={Width >767 ? "overflowText-payLog" : "text-break"} style={{ maxWidth: 200 }}>
                  <span>{text}</span>
                </div>
              </Tooltip>
            </div>
          );
        },
      },    
      {
        title: 'Payment method',
        dataIndex: 'paymentMethod',
        render: (text: any) => {
          if(!text) return <Typography.Text ellipsis={true} style={{ width: 150 }} className="overflowText">--</Typography.Text>;
          return <Typography.Text ellipsis={true} style={{ width: 150 }}>{text}</Typography.Text>;
          },
      },
      {
        title: 'Mode',
        dataIndex: 'paymentMode',
        render: (text: any) => {
          if(!text) return <Typography.Text ellipsis={true} style={{ width: 150 }} className="overflowText">--</Typography.Text>;
            return <span>{text}</span>
        }
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        render: (text: any, value : any) => {
          if(!text) return <Typography.Text ellipsis={true} style={{ width: 150 }} className="overflowText">--</Typography.Text>;
          const isPointValue = Number(text) % 1 !== 0;
          const formattedAmount = isPointValue ? `${value?.currency ?? "AED" } ${parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${value?.currency ?? "AED" } ${parseFloat(text).toLocaleString()}`;
          return <span>{formattedAmount}</span>;
        }
    },
    {
      title: 'Charges',
      dataIndex: 'paymentCharges',
      render: (text: any, value : any) => {
        if(!text) return <Typography.Text ellipsis={true} style={{ width: 100 }} className="overflowText">--</Typography.Text>;
        const isPointValue = Number(text) % 1 !== 0;
        const formattedAmount = isPointValue ? `${value?.currency ?? "AED" } ${parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${value?.currency ?? "AED" } ${parseFloat(text).toLocaleString()}`;
        return <span>{formattedAmount}</span>;
      },
    },
    {
      title: 'Created on',
      dataIndex: 'createAt',
      render: (text: any) => {
        if(!text) return <Typography.Text ellipsis={true} style={{ width: 100 }} className="overflowText">--</Typography.Text>;
          const formattedDate = moment(text).format('DD-MM-YYYY').toLowerCase();
          return <Typography.Text ellipsis={true} style={{ width: 100 }} >{formattedDate || 'N/A'}</Typography.Text>
      }
    },
    {
      title:'Action',
      dataIndex:'aliasName',
      render:(_text: string, values: any) =>{
        return (
          <Tooltip
            title="Download/View payment receipt"
            overlayClassName="custom-tooltip"
          >
            <Image
              src={Doc}
              alt="view"
              preview={false}
              className="cursor"
              onClick={() => {
                viewPdf(values.transactionNo)
              }}
            />
          </Tooltip>
        )
      }
    }
  ];

const locale = {
  allLocale: {
    emptyText: (
      <>
        <div className="nodataCard text-center px-5">
          <Image src={emptyCalls} preview={false} className="mt-5" />
          <p className="nodata py-5">No data found</p>
        </div>
      </>
    ),
  },
};

async function handelSubmit (event:any) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const formsData:any = {};
  formData.forEach((value, key) => {
    formsData[key] = value;
  });

  const encryptedString = await uaepgsPayment(formsData)
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        message.error("Oops! Could not create item. Please try again later")
      });

  console.log("encryptedString:---------",encryptedString.gen_hmac.toUpperCase());
  
  document.getElementById("pp_SecureHash")?.setAttribute("value", encryptedString.gen_hmac.toUpperCase());
  document.getElementById("pp_TxnDateTime")?.setAttribute("value", encryptedString.pp_TxnDateTime);
  document.getElementById("pp_TxnRefNo")?.setAttribute("value", encryptedString.pp_TxnRefNo);
    console.log("secure hash:---------",document.getElementById("pp_SecureHash"));
    
  event.target.submit(); // Submit on getting response
}
const handleResetAllClick = () => {
  form.resetFields();
  setSearchedKey("");
  setCurrent(1);
  setPage(10);
  PaymentLogsList(current, page,tab);
}

const handleFilterApply = (e:any, current :number, pageSize:number) =>{
  setLoading(true)
  setSearchedKey(e)
  getPaymentLogFilter(current > 0 ? current -1 : 0,
    pageSize || 10,e).then((res)=>{
      setLoading(false)
      setPaymentList(res.data.data);
      setCount({
        all: res?.data?.count,
        initiated:0,
        completed:0,
      });
          setTotalPage(res?.data?.lastPage * pageSize);
          setCurrent(current);
    })
}
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="payment"
        TitleText="Payment Log"
        TitleImage={PaymentLogIcon}
        // loading={loading}
        headerPage={
          <div className="d-flex">
                    <Image
                      src={PaymentLogIcon}
                      preview={false}
                      className="mt-2"
                      alt="escrowimage"
                    />
                    <div className="ml-5">
                      <b> Payment logs</b>
                      <Breadcrumb separator=">">
                        {/* <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                        >
                          Dashboard
                        </Breadcrumb.Item> */}
                        {/* <Breadcrumb.Item className="breadcrumb-title-text">Payment logs</Breadcrumb.Item> */}
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <Card className="noBorder transparent mt-6">
                <div id = "paymentLogTab" className=" w-100 endtoend">
                  <div className="d-flex overflow-auto w-100 disputeTabs dashboardTabs escrow-tran-card">
                  <Tabs
                      defaultActiveKey="all"
                      className="tableTab overflow-auto"
                      onChange={onTabChange}
                    >
                      <TabPane
                        tab={`All fund (${count?.all})`}
                        key="ALL"
                      ></TabPane>
                      <TabPane
                        tab={`Initiated fund (${count?.initiated})`}
                        key="INITIATED"
                      ></TabPane>
                      <TabPane
                        tab={`Completed fund (${count?.completed})`}
                        key="COMPLETED"
                      ></TabPane>
                    </Tabs>
                  </div>
                  {/* <div className="addBtn">
                    <Button
                      className="add-itemtype float-right"
                      onClick={() => {
                        setIsUaepgsModalVisible(true);
                      }}
                    >
                      + Add Uaepgs 
                    </Button>
                  </div> */}
                </div>
                <div className="d-flex justify-content-end">
                    {!showFilter ? (
                      <div  className={Width >767 ? "d-flex buttons-filter my-3 float-end" : "d-flex buttons-filter justify-content-end w-100 my-3"}>
                        <Button
                          className="filterbutton"
                          onClick={() => {setShowFilter(!showFilter),
                            form.resetFields()
                          }}
                        >
                          Filter
                        <Image
                           src={filterIcon}
                           alt="filter"
                           preview={false}
                           className=""
                        />
                        </Button>
                        <Button type="default" className="filterbutton mx-2" onClick={handleResetAllClick}>
                            Reset All
                        </Button>
                      </div>
                    ) : (
                      <Button className="filterbutton_selected text-center mx-2">
                        <span className="mx-2 mt-1">Filter</span>
                        <Image
                          src={closeIcon}
                          alt="filter"
                          preview={false}
                          height={28}
                          width={28}
                          className="px-1 close-icon"
                          onClick={() => setShowFilter(!showFilter)}
                        />
                        <div className="drop-icon">
                          <Image
                            src={Trio}
                            alt="filter"
                            preview={false}
                            height={28}
                            width={28}
                            className="px-1"
                          />
                        </div>
                      </Button>
                      )}  
                  </div>
                  {showFilter &&  <>
                  <div className="filter-container mb-4 mt-3">
                    <Card className="grayCard p-3 filter-card">
                      <div className="bold-text">Filters</div>
                        <Form form={form} onFinish={(e)=>{handleFilterApply(e,1,page)}}>
                          <Row gutter={[24,16]}>
                              <Col  xl={6} lg={6} md={24} xs={24} >
                                <FormItem
                                  name="agreementId"
                                  className="inputField mb-4 itemtype-filter-input"
                                >
                                  <Input
                                    placeholder="Enter agreement id / email / account no."
                                  />
                              </FormItem>
                            </Col>
                            <Col xl={6} lg={6} md={24} xs={24} >
                              <div className="d-flex">
                                <div className="text-right">
                                  <Button
                                    className="rounded min-width-17 px-4 mt-0"
                                    htmlType="submit"
                                  >
                                    Apply
                                  </Button>
                                </div>
                                <div className="text-right mx-3">
                                  <Button type="default" className="white-no-border-button pt-0" onClick={handleResetAllClick}>
                                    Reset All
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                    </Card>
                  </div>
                </>}
                {PaymentList.length > 0 ?(
                  <> 
                      <div className="paymentLog-mobile-view">
                        {PaymentList.map((payment: any, index:any) => (
                          
                          <div key={index} className="mobile-card row">
                            {columns.map((column, index) => (
                               <div key={`${payment.transactionNo}-${index}`} className="sub-body col-6 col-sm-4">
                                <div className="sub">
                                  <div className="mobile-header">
                                    {column.title}
                                  </div>
                                  <div className="mobile-data">{column.render(payment[column.dataIndex], payment)}</div>
                                </div>
                             </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <Table
                        columns={columns}
                        dataSource={PaymentList}
                        pagination={pagination}
                        loading={loading}
                        className="mt-6 w-100 paymentLogTable scrollBarTop"
                        scroll={{ x: 2000 }}
                        locale={locale.allLocale}
                      />   
                  </>
                  ):(
                    <Table
                    columns={columns}
                    dataSource={PaymentList}
                    pagination={pagination}
                    loading={loading}
                    className="mt-6 w-100"
                    scroll={{ x: 992 }}
                    locale={locale.allLocale}
                  />   
                )}
                {PaymentList?.length > 0 ? (
                  <div className="w-100 endtoend mt-2 pagination-range">
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
                    <div className="right" style={{ textAlign: 'center' }}>
                      <Pagination
                        current={current}
                        pageSize={page}
                        onChange={onChangePage}
                        total={totalPage || 1}
                        itemRender={itemRender}
                        showLessItems = {true}
                        responsive
                        size="small"
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Card>
              <Modal
                title={<p className="large-title">Online payment form</p>}
                className="add-uaepgs-modal d-flex center"
                open={isUaepgsModalVisible}
                footer={null}
                closable={false}
                onCancel={handleCancel}
              >
                <hr className="break-line" />
                <form action="https://pgt.cbuaepay.ae/PGCustomerPortal/transactionmanagement/merchantform" method="POST" onSubmit={handelSubmit}>
                  <div className="uaepgs-form">
                  <span className="uaepgs-span">pp_Version :</span> <input name="pp_Version" id="pp_Version"  value="1.1" /> <br></br>
                  <span className="uaepgs-span">pp_TxnType :</span> <input name="pp_TxnType" id="pp_TxnType"  value="DD" /> <br></br>
                  <span className="uaepgs-span">pp_MerchantID :</span><input name="pp_MerchantID" id="pp_MerchantID"  value="Test7399012009" /> <br></br>
                  </div>
                  <div className="uaepgs-form">
                  <span className="uaepgs-span">pp_Language :</span> <input name="pp_Language" id="pp_Language"  value="EN" /> <br></br>
                  <span className="uaepgs-span">pp_Password :</span><input name="pp_Password" id="pp_Password" value="45wwxv8e3z"/> <br></br>
                  <span className="uaepgs-span">pp_BankID : </span><input name="pp_BankID" id="pp_BankID"  value="0005" /> <br></br>
                  </div>
                  <div className="uaepgs-form">
                  <span className="uaepgs-span">pp_ProductID :</span> <input name="pp_ProductID" id="pp_ProductID"  value="RETL" /> <br></br>
                  <span className="uaepgs-span">pp_TxnRefNo : </span><input name="pp_TxnRefNo" id="pp_TxnRefNo"  value="" /><br></br>
                  <span className="uaepgs-span">pp_Amount : </span><input name="pp_Amount" id="pp_Amount"  value="100" /> <br></br>
                  </div>
                  <div className="uaepgs-form">
                  <span className="uaepgs-span">pp_TxnCurrency : </span><input name="pp_TxnCurrency" id="pp_TxnCurrency"  value="AED" /> <br></br>
                  <span className="uaepgs-span">pp_TxnDateTime : </span><input name="pp_TxnDateTime" id="pp_TxnDateTime"  value="" /><br></br>
                  <span className="uaepgs-span">pp_TxnExpiryDateTime : </span><input name="pp_TxnExpiryDateTime" id="pp_TxnExpiryDateTime"  value="-1" /> <br></br>
                  </div>
                  <div className="uaepgs-form">
                  <span className="uaepgs-span">pp_BillReference : </span><input name="pp_BillReference" id="pp_BillReference"  value="S5PQR4106110785397" /> <br></br>
                  <span className="uaepgs-span">pp_Description : </span><input name="pp_Description" id="pp_Description"  value="TEST" /> <br></br>
                  <span className="uaepgs-span">pp_ReturnURL : </span> <input name="pp_ReturnURL" id="pp_ReturnURL"  value="https://stageapi.trustintrade.ae/v1/netbanking" /> <br></br>
                  </div>
                  {/* TEST UAEPGS */}
                  {/* t6v44u698w&10000&0005&S5PQR4106110785397&TEST&EN&Test7399012009&45wwxv8e3z&RETL&https://stageapi.trustintrade.ae/v1/netbanking&AED&20230928195002&-1&T20150222091951&DD&1.1&1&2&3&4&5&1&2&3&4&5 */}
                  {/* t6v44u698w&10000&0005&S5PQR4106110785397&TEST&EN&Test7399012009&45wwxv8e3z&RETL&https://stageapi.trustintrade.ae/v1/netbanking&AED&20240208195002&-1&T20150222091956&DD&1.1 */}
                  <input name="pp_SecureHash" id="pp_SecureHash" type="hidden" value="" /> <br></br>
                  {/* <input name="pp_SecureHash" id="pp_SecureHash" type="hidden" value="921029d21ceec87921ae1641304d50d47c46b2a4a37abb6ff7a15bea2f28346d" /> <br></br> */}
                  <input type="submit" />
                </form>
              </Modal>
              <Modal
                title={<div className="titleText mt-3 mb-5">Payment receipt PDF</div>}
                centered
                open={isPdfModalOpen}
                onCancel={handleCancel}
                footer={false}
                width={"80%"}
              >
               {!pdfUrl || pdfLoading ? (
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

export default PaymentLog;
