import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  message,
  Pagination,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import { Option } from "antd/lib/mentions";
import HistoryIcon from "../../assets/img/bankaccountsbg.svg";
import emptyCard from "../../assets/img/emptyCard.svg";

import { CloudDownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import "../../assets/scss/custom.scss";
import {
  downloadBankStatementPDF,
  getFilteredBankTransactions,
  getlocalBankDetails,
  getWalletTransactionList,
} from "../../services/user";
import { getLocalStorage } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";

const BankTransactionHistory = ():any => {
  const [Width, setWidth] = useState<any>(document?.body?.clientWidth);
  const [page, setPage] = useState<any>(10);
  const [current, setCurrent] = useState<any>(1);
  const [loading, setLoading] = useState<any>(false);
  const [walletTransaction, setWalletTransaction] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [spinLoading, setSpinLoading] = useState<any>(false);
  const [Tableloading, setTableloading] = useState<any>(false);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [selectedAccount, setSelectedAccount] = useState<any>("ALL");
  const [selectedBankAlias, setSelectedBankAlias] = useState<string>("");
  const [bankAccountList, setBankAccountList] = useState<any>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [currency, setCurrency] = useState<string>("");

  const isEnableUsdCurrency = process.env.ENABLE_USD_CURRENCY;
  
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  const columns: object[] = [
    {
      title: "Account Id",
      dataIndex: "AccountAlias",
      sorter: false,
      width: 150,
      render: (text: any) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Type",
      dataIndex: "AccountType",
      sorter: false,
      width: 100,
    },
    {
      title: "Booking Date",
      dataIndex: "createAt",
      sorter: false,
      width: 100,
      render: (_text: string, record: any) => {
        const dateStr = record.createAt || record.BookingDateTime || "";
        // If BookingDateTime is in "DD/MM/YYYY" format, return as is
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(record.BookingDateTime)) {
          return <span>{record.BookingDateTime}</span>;
        }
        const date = moment(dateStr, ["DD/MM/YY", moment.ISO_8601], true);
        return <span>{date.isValid() ? date.format("DD-MM-YYYY") : "-"}</span>;
      }      
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      sorter: false,
      width: 100,
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
      title: "Currency",
      dataIndex: "Currency",
      sorter: false,
      width: 100,
    },
    {
      title: "Indicator",
      dataIndex: "CreditDebitIndicator",
      sorter: false,
      width: 100,
      render: (text: string) => {
        return <span>{text === "C" ? "Credit" : text} </span>;
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      width: 100,
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
      width: 150,
    },
  ];

  useEffect(() => {
    getBankList();
    walletTransactionList();
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";

  const getBankList = () => {
    setLoading(true);
    getlocalBankDetails(userAlias)
      .then((response) => {
        setLoading(false);
        const bankDetails = response?.data?.bankDetails || [];
        
        const uniqueAccounts = bankDetails.filter(
          (account: { number: any; }, index: any, self: any[]) =>
            index === self.findIndex((a) => a.number === account.number)
        );
        setBankAccountList(uniqueAccounts);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const walletTransactionList = (
    accountAlias = "ALL",
    currentPage = 0,
    limit = 10
  ) => {
    !currentPage && setSpinLoading(true);
    setTableloading(true);
    getWalletTransactionList(
      userAlias,
      "BANK",
      accountAlias,
      currentPage > 0 ? currentPage - 1 : currentPage,
      limit
    )
      .then((response) => {
        setSpinLoading(false);
        setTableloading(false);
        
        setWalletTransaction(response.data?.VATransactionList?.data);
        setTotalCount(response.data?.VATransactionList?.bankCount);
        setTotalPage(response.data?.VATransactionList?.lastPage * limit);
      })
      .catch(() => {
        setLoading(false);
        setWalletTransaction([]);
      });
  };

  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    walletTransactionList(selectedAccount, 0, value);
  };

  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    walletTransactionList(selectedAccount, pageno, page);
  };

  const handleAccountChange = (value: any) => {
    setCurrent(1);
    setSelectedAccount(value);
    const selectedBank = bankAccountList.find((acc: any) => acc.number === value);
    setSelectedBankAlias(selectedBank?.aliasName || "");    
    walletTransactionList(value, 0, page);
  };
  const handleCurrencyChange = (value: any) => {
    setCurrency(value);   
    setCurrent(1);
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
  
  const handleFilter = async () => {
    if (!startDate || !endDate) return;

    if (selectedAccount === "ALL" || !selectedAccount) {
      return message.warning("Please select bank account to apply filter")
    }
    if (currency === "" || !currency) {
      return message.warning("Please select currency to apply filter")
    }
  
    setTableloading(true);
  
    try {
      const res = await getFilteredBankTransactions(
        userAlias,
        selectedAccount,
        currency,
        startDate,
        endDate,
        0,
        page
      );
      
      setWalletTransaction(res?.data?.data);
      setIsFilterApplied(true);      
      setTotalCount(res.data?.count || 0);
      setTotalPage((res.data?.lastPage || 1) * page);
      setCurrent(1);
    } catch (error: any) {
      setWalletTransaction([]);
      setIsFilterApplied(false);
      if (error?.status === 404) {
        message.info("No transactions found in the selected date range.");
        setTotalCount(0);
        setTotalPage(0);
      } else {
        message.error("An error occurred while fetching filtered transactions.");
      }
    } finally {
      setTableloading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setStartDate(null);
    setEndDate(null);
    setSelectedAccount("ALL");
    setCurrency("");
    setCurrent(1);
    setIsFilterApplied(false);
    walletTransactionList("ALL", 0, page);
  };  

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      return message.warning("Please select a valid date range before downloading.");
    }

    if (selectedAccount === "ALL") {
      return message.warning("Please select a specific bank account to download.");
    }
    if (currency === "") {
      return message.warning("Please select a specific currency to download.");
    }

    const alias = selectedAccount === "ALL" ? "" : selectedAccount
    const formattedStart = dayjs(startDate, "DD-MM-YYYY").format("YYYY-MM-DD");
    const formattedEnd = dayjs(endDate, "DD-MM-YYYY").format("YYYY-MM-DD");

    try {
      setTableloading(true);
      const response = await downloadBankStatementPDF({
        userAlias,
        bankAlias: selectedBankAlias,
        accountNo: alias,
        currency,
        startDate: formattedStart,
        endDate: formattedEnd,
      });      

      if (response?.status === 200) {
        setTableloading(false);

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Bank_Statement_${formattedStart}_to_${formattedEnd}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setTableloading(false);
        message.error("Failed to download the statement.");
      }
    } catch (error) {
      message.error("Failed to download the statement.");
    } finally {
      setTableloading(false);
    }
  };  

  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
        <DefaultLayout
          page="transactionhistory_bank"
          TitleText="Bank Transaction History"
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
                <b> Bank account transaction history</b>
                <Breadcrumb separator=">">
                  {/* <Breadcrumb.Item
                    onClick={() => {
                      navigate(Dashboard);
                    }}
                    className="cursor"
                  >
                    Dashboard
                  </Breadcrumb.Item> */}
                  <Breadcrumb.Item className="breadcrumb-title-text">
                    Transaction history
                  </Breadcrumb.Item>
                  <Breadcrumb.Item
                    // onClick={() => {
                    //   navigate(KYBManagementList);
                    // }}
                  >
                    Bank account transaction history
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={Width > 1024 ? 8 : Width < 680 ? 24 : 12}>
              <Card className="blocked_card">
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
                    {totalCount ?? 0}
                  </div>
                )}
              </Card>
            </Col>
            <Col span={Width > 1024 ? 8 : Width < 680 ? 24 : 12}>
              <Card className="grayCard p-4">
                <Row gutter={[16, 16]}>
                  {/* Select Bank Account */}
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div className="input-form-field w-100">
                      <div className="subText_small mb-2">Select Bank Account</div>
                      <Select
                        placeholder="Select bank account"
                        onChange={handleAccountChange}
                        value={selectedAccount}
                        className="w-100"
                      >
                        <Option key="ALL" value="ALL">All</Option>
                        {bankAccountList.map((elem: any, index: any) => (
                          <Option key={index} value={elem.number}>
                            {elem.number}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  {/* Select Currency */}
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div className="input-form-field w-100">
                      <div className="subText_small mb-2">Select Currency</div>
                      <Select
                        placeholder="Select currency"
                        onChange={handleCurrencyChange}
                        value={currency}
                        className="w-100"
                      >
                        <Option key="AED" value="AED">AED</Option>
                        {isEnableUsdCurrency == "true" &&
                          (<Option key="USD" value="USD">USD</Option>)
                        }
                      </Select>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Form
            layout="inline"
            className="mt-3 w-100"
            onFinish={handleFilter}
            form={form}
            initialValues={{ startDate: null, endDate: null }}
          >
            <Row>
              <Col span={Width > 1024 ? 8 : Width < 680 ? 24 : 12}>
                <Form.Item
                  name="startDate"
                  className="mb-3"
                  rules={[
                    {
                      required: true ,
                      message: "Start date is required!",
                    },
                    {
                      validator: (_:any, value:any) => {
                        const start = dayjs(value, 'DD-MM-YYYY');
                        const end = dayjs(endDate, 'DD-MM-YYYY');
                        if (!endDate || !value || start.isBefore(end, 'day') || start.isSame(end, 'day')) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject('Start date must be smaller than end date');
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker
                    placeholder="Select start date"
                    className="dateField-bank"
                    format="DD-MM-YYYY"
                    onChange={(_date, dateString: any) => setStartDate(dateString)}
                    disabledDate={(current:any) => {
                      const customDate = moment().format("YYYY-MM-DD");
                      return current && current > moment(customDate, "YYYY-MM-DD");
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={Width > 1024 ? 8 : Width < 680 ? 24 : 12}>
                <Form.Item
                  name="endDate"
                  className="mb-3"
                  rules={[
                    { required: true, message: "End date is required!" },
                    {
                      validator: (_:any, value:any) => {
                        const start = dayjs(startDate, 'DD-MM-YYYY');
                        const end = dayjs(value, 'DD-MM-YYYY');                   
                        if (!startDate || !value || start.isBefore(end, 'day') || start.isSame(end, 'day')) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject('End date must be greater than start date');
                        }
                      }
                    }
                  ]}
                >
                  <DatePicker
                    placeholder="Select end date"
                    className="dateField-bank"
                    format="DD-MM-YYYY"
                    onChange={(_date, dateString: any) => setEndDate(dateString)}
                    disabledDate={(current:any) => {
                      const customDate = moment().format("YYYY-MM-DD");
                      return current && current > moment(customDate, "YYYY-MM-DD");
                    }}
                  />
                </Form.Item>
              </Col>
              <Col>
                <div className="d-flex">
                  <div className="text-right">
                    <Button
                      className="rounded min-width-17 px-4 mt-0"
                      htmlType="submit"
                    >
                      Apply
                    </Button>
                  </div>
                  <div className="text-right ms-2">
                    <Button type="default" className="white-no-border-button pt-0" onClick={handleReset}>
                      Reset All
                    </Button>
                  </div>
                  {
                    isFilterApplied && (
                      <>
                        <div className={Width < 425 ? "w-100 mt-2 d-block" : "mb-3 mx-2 d-inline-block"} onClick={handleDownload}>
                          <SecondaryOutLineButton className="w-auto">
                            <CloudDownloadOutlined className="downloadText me-2" />
                            <span className="downloadText">Download</span>
                          </SecondaryOutLineButton>
                        </div>
                      </>
                    )
                  }
                </div>
              </Col>
            </Row>
          </Form>

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
                    scroll={{ x: 400 }}
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
        </DefaultLayout>
      </div>
    </div>
  );
};

export default BankTransactionHistory;
