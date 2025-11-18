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
  Tabs,
} from "antd";
import { useNavigate } from "react-router-dom";
import HistoryIcon from "../../assets/img/transHistory.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { Dashboard, KYBManagementList } from "../Common/RouteConst";
import emptyCard from "../../assets/img/emptyCard.svg";

import "../../assets/scss/custom.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  getContractListByContractStatus,
  getWalletTotalAmountAndCount,
  getWalletTransactionList,
} from "../../services/user";
import { getLocalStorage } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [Width, setWidth] = useState<any>(document?.body?.clientWidth);
  const [page, setPage] = useState<any>(10);
  const [current, setCurrent] = useState<any>(1);
  const [loading, setLoading] = useState<any>(false);
  const [walletTransaction, setWalletTransaction] = useState<any>([]);
  const [count, setCount] = useState({
    all: 0,
    bank: 0,
    escrow: 0,
  });
  const [walletAmountAndCount, setWalletAmountAndCount] = useState<any>([]);
  const [blockedAmount, setBlockedAmount] = useState<any>(0);
  const [spinLoading, setSpinLoading] = useState<any>(false);
  const [Tableloading, setTableloading] = useState<any>(false);
  const [totalPage, setTotalPage] = useState<any>(0);
  const [tab, setTab]= useState<any>("");
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  const columns: object[] = [
    {
      title: "Account Id",
      dataIndex: "VirtualAccountId",
      sorter: false,
      width: 150,
      render: (text: any, value: any) => {
        return <span>{value?.AccountType === "BANK" ? value?.AccountAlias : text }</span>;
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
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      sorter: false,
      width: 100,
      render: (text: string) => {
        return <span>{parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
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
        return <span>{text=== "C" ? "Credit" : text} </span>;
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
    walletTransactionList();
    totalAmountAndCount();
    getBlockedAmount();
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  
  }, []);
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";

  const walletTransactionList = (accountType = "ALL",currentPage = 0,limit=10) => {
    !currentPage && setSpinLoading(true);
    setTableloading(true);
    getWalletTransactionList(userAlias, accountType || "ALL",'ALL', currentPage > 0 ? currentPage - 1 : currentPage,limit)
      .then((response) => {
        setSpinLoading(false);
        setTableloading(false);
        setWalletTransaction(response.data?.VATransactionList?.data);
        setTotalPage(response.data?.VATransactionList?.lastPage*limit);
        setCount({
          all: response.data?.VATransactionList?.count,
          bank: response.data?.VATransactionList?.bankCount,
          escrow: response.data?.VATransactionList?.escrowCount,
        });
      })
      .catch(() => {
        setLoading(false);
        setWalletTransaction([]);
      });
  };

  const totalAmountAndCount = () => {
    setLoading(true);
    getWalletTotalAmountAndCount(userAlias)
      .then((response) => {
        setLoading(false);
        setWalletAmountAndCount(response.data?.walletTransaction);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getBlockedAmount = () => {
    getContractListByContractStatus(userAlias, "2")
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          const blockedContracts = response.data.filter(
            (contract: any) =>
              contract.transactions[0]?.paymentStatus === "INACTIVE"
          );
          // setBlockedTransactions(blockedContracts);
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
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    walletTransactionList(tab,0,value);
  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrent(1);
    walletTransactionList(tabValue,0,page);
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    walletTransactionList(tab,pageno,page);
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
        page="transactionhistory"
        TitleText="Transaction History"
        TitleImage={HistoryIcon}
        loading={loading}
        headerPage={
          <div className={Width > 767 ? "d-flex":"d-flex mt-4"}>
          <Image
            src={HistoryIcon}
            preview={false}
            className="mt-2 cursor"
          />
          <div className="mx-3">
            <b> Transaction history</b>
            <Breadcrumb separator=">">
              <Breadcrumb.Item
                onClick={() => {
                  navigate(Dashboard);
                }}
                className="cursor"
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="cursor"
                onClick={() => {
                  navigate(KYBManagementList);
                }}
              >
                Transaction history
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      }
      >
              <Row className="mt-0 dashboardTabs">
                <Tabs onChange={onTabChange} defaultActiveKey={tab}>
                  <TabPane tab={`All (${count?.all})`} key="ALL"></TabPane>
                  <TabPane tab={`Bank (${count?.bank})`} key="BANK"></TabPane>
                  <TabPane
                    tab={`Escrow (${count?.escrow})`}
                    key="ESCROW"
                  ></TabPane>
                </Tabs> 
              </Row>
              <Row gutter={[16,16]}>
                <Col span={Width > 1024 ? 6 :Width < 680 ? 24 : 12}>
                  <Card className="balance_card">
                    <div className="balance px-4 pt-4">Balance amount</div>
                    {spinLoading ? (
                      <>
                        <div className="px-4 pt-1 pb-3"><Spin/></div>
                        <div className="balance px-4 pb-3">Please wait...</div>
                      </>
                      ) : (
                    <div className="bal_amount px-4 pb-4">
                      AED {walletAmountAndCount?.balanceAmount &&
                      parseFloat(walletAmountAndCount.balanceAmount) >= 0
                        ? parseFloat(
                            walletAmountAndCount.balanceAmount
                          ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : 0}
                    </div>
                      )}
                  </Card>
                </Col>
                <Col span={Width > 1024 ? 6 :Width < 680 ? 24 : 12}>
                  <Card className="balance_card">
                    <div className="balance px-4 pt-4">Available amount</div>
                    {spinLoading ? (
                      <>
                        <div className="px-4 pt-1 pb-3"><Spin/></div>
                        <div className="balance px-4 pb-3">Please wait...</div>
                      </>
                      ) : (
                    <div className="bal_amount px-4 pb-4">
                      AED {walletAmountAndCount?.availableAmount &&
                      parseFloat(walletAmountAndCount.availableAmount) >= 0
                        ? parseFloat(
                            walletAmountAndCount.availableAmount
                          ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : 0}
                    </div>
                      )}
                  </Card>
                </Col>
                <Col span={Width > 1024 ? 6 :Width < 680 ? 24 : 12}>
                  <Card className="blocked_card">
                    <div className="blocked px-4 pt-4">Blocked amount</div>
                    {spinLoading ? (
                      <>
                        <div className="px-4 pt-1 pb-3"><Spin/></div>
                        <div className="px-4 pb-3">Please wait...</div>
                      </>
                      ) : (
                    <div className="blocked_amount px-4 pb-4">
                      {blockedAmount >= 0 ? `AED ${blockedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'AED 0.00'}
                    </div>
                      )}
                  </Card>
                </Col>
                <Col span={Width > 1024 ? 6 :Width < 680 ? 24 : 12}>
                  <Card className="blocked_card">
                    <div className="blocked px-4 pt-4">Total count</div>
                    {spinLoading ? (
                      <>
                        <div className="px-4 pt-1 pb-3"><Spin/></div>
                        <div className="px-4 pb-3">Please wait...</div>
                      </>
                      ) : (
                    <div className="blocked_amount px-4 pb-4">
                      {walletAmountAndCount.totalCount
                        ? walletAmountAndCount.totalCount
                        : 0}
                    </div>
                      )}
                  </Card>
                </Col>
              </Row>
              <Row className={Width > 679 ? "mt-4" : "mt-2"}>
                <Col span={24}>
                    {walletTransaction?.length > 0 ? <>                    
                      <div className="paymentLog-mobile-view">
                        {walletTransaction.map((txn: any, index:any) => (
                          <div key={index} className="mobile-card row">
                            {columns.map((column:any, index:any) => (
                              <div key={`${txn.transactionNo}-${index}`} className="sub-body col-6 col-sm-4">
                                <div className="sub">
                                  <div className="mobile-header">
                                    {column.title}
                                  </div>
                                  <div className="mobile-data">{column.render ? column.render(txn[column.dataIndex], txn) : txn[column.dataIndex]}</div>
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
                      /></> :
                      <div className="nodataCard text-center px-5">
                       <Image src={emptyCard} preview={false} className="mt-5" />
                        <p className="nodata py-5">No history found</p>
                      </div>
                    }
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
                </Col>
              </Row>
        </DefaultLayout>
        </div>
    </div>
  );
};

export default TransactionHistory;
