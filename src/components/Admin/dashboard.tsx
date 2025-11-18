import { Col, Image, Popover, Row, Select, Table, Tabs, Spin } from "antd";
import TabPane from "antd/lib/tabs/TabPane";
import download from "../../assets/img/Download.svg";
import Money from "../../assets/img/Money.svg";
import Uparrow from "../../assets/img/uparrow.svg";
import Downarrow from "../../assets/img/downarrow.svg";
import Chart1 from "../../assets/img/Chart1.svg";
import Chart2 from "../../assets/img/Chart3.svg";
import CardUser from "../../assets/img/cardUser.svg";
import WeeklyReport from "./WeeklyReport";
import AnnualSalesReport from "./AnnualSalesReport";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Card } from "react-bootstrap";
import { ViewButton } from "../ui-elements/ButtonRepo";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  adminDashboardData,
  adminWeeklyReportGraph,
  fetchAllUsers,
  getGraphDataByYear,
  getTxnList,
  yearlyGraphData,
} from "../../services/admin";
import {
  USER_STATUS_TEXT,
  USER_TYPE_TEXT,
  amountFormat,
} from "../Common/Constants";
import moment from "moment";
import {
  EscrowTransactionList,
  TransactionDetail,
  UserManagementList,
  UserInfo
} from "../Common/RouteConst";
import DefaultLayout from "../Common/DefaultLayout";
const Dashboard = () => {
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [weeklyGraphData, setWeeklyGraphData] = useState<any>([]);
  const [OnBoardUsers, setOnBoardUsers] = useState([]);
  const [tab, setTab] = useState("today");
  const [overallCount, setOverallCount] = useState<any>({});
  const [yearList, setYearList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [graphLoader, setGraphLoader] = useState(false);
  const [reportLoader, setreportLoader] = useState(true);
  const [amountList, setAmountList] = useState<{ AED: number[]; USD: number[] }>({
  AED: [],
  USD: [],
});

  const [tableData, setTableData] = useState([]);
  const [tableDataCount, setTableDataCount] = useState<any>({});
  const [transactionTabCount, setTransactionTabCount] = useState<any>({});
  const [Year, setYear] = useState("");
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingFunds, setLoadingFunds] = useState(false);
  const [loadingPlatformfee, setLoadingPlatformfee] = useState(false);
  const [loadingOnboardUsers, setLoadingOnboardUsers] = useState(false);
  const [loadingCreated, setLoadingCreated] = useState(false);
  const [currencyValue, setCurrencyValue] = useState({ AED: "AED", USD: "USD" });
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
const YEAR = () =>{
  const year:any = [{ value: "", label: "Select year", disabled: true }];
  const currentYear = new Date()
  const fullYear =currentYear.getFullYear()+5;
  for (let i = 2021; i <= fullYear; i++) {
    year.push({ value: i, label: i })
  }
  return year;
}
  const navigate = useNavigate();
  useEffect(() => {
    setLoadingTransactions(true);
    setLoadingUsers(true);
    setLoadingFunds(true);
    setLoadingPlatformfee(true);
    adminWeeklyReportGraph().then((response: any) => {
      setLoading(false);
      setWeeklyGraphData(response?.data);
      setLoadingTransactions(false);
      setLoadingUsers(false);
      setLoadingFunds(false);
      setLoadingPlatformfee(false);
      setreportLoader(false)
    });
    fetchAnnualTransaction();
    dashboardData(tab);
    fetchOnboardUsers("all");
    fetchTransactions("all");
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, [tab]);
  const fetchOnboardUsers = (value: string) => {
    setLoadingOnboardUsers(true)
    fetchAllUsers(0, 5, value, "sortByAgreementId", "DESC").then((res: any) => {
      setLoading(false);
      setLoadingOnboardUsers(false)
      setOnBoardUsers(res?.data?.data);
      const count = {
        all: res?.data?.count,
        customer: res?.data?.userCount,
        client: res?.data?.clientCount,
        approver: res?.data?.trusteeCount,
        admin: res?.data?.adminCount,
        authorizer: res?.data?.authorizerCount,
      };
      setTableDataCount(count);
    });
  };
  const fetchTransactions = (value: string) => {
    setLoadingCreated(true);
    getTxnList(0, 5, value).then((res: any) => {
      try {
       setCurrencyValue({
    AED: res?.data?.AED ?? "AED",
    USD: res?.data?.USD ?? "USD"
  });
} catch (error) {
  setCurrencyValue({ AED: "AED", USD: "USD" });
  console.error("Error setting currency:", error);
}
      setLoadingCreated(false);
      setTableData(res?.data?.data.slice(0, 5));      
      const count = {
        all: res?.data?.count,
        pending: res?.data?.pendingCount,
        completed: res?.data?.completedCount,
        inprogress: res?.data?.progressCount,
        rejected: res?.data?.rejectedCount,
      };
      setTransactionTabCount(count);
    });
  };

  async function downloadSVG(chartId: any) {
    const chartInstance = (window as any).Apex._chartInstances.find(
      (chart: any) => {
        return chart.id === chartId;
      }
    );
    const base64 = await chartInstance.chart.dataURI();
    const downloadLink = document.createElement("a");
    downloadLink.href = base64.imgURI;
    downloadLink.download = "weeklyreport.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const fetchAnnualTransaction = () => {
    setYear("");
    setGraphLoader(true)
    yearlyGraphData().then((response: any) => {      
      setLoading(false);
      setGraphLoader(false)
      const years: any = [];
      const AEDAmounts: number[] = [];
      const USDAmounts: number[] = [];
      response?.data?.map((item: any) => {   
        years.push(item.label);
      AEDAmounts.push(item?.AEDtransaction? item.AEDtransaction: 0);
      USDAmounts.push(item?.USDtransaction? item.USDtransaction: 0);
      });
      setYearList(years);
      setAmountList({
      AED: AEDAmounts,
      USD: USDAmounts,
    });
    });
  };

  const dashboardData = (tab: string) => {
    adminDashboardData(tab).then((response: any) => {      
      setOverallCount(response?.data);
    });
  };
  const fetchAnnualTransactionByYear = (year: string) => {
    getGraphDataByYear({ year: year }).then((response: any) => {
      const years: any = [];
      const AEDAmounts: any[] = [];
      const USDAmounts: any[] = [];

      const data = response?.data
      data?.map((item: any) => { 
        item.totalCurrency.forEach((monthItem: any) => {
          years.push(monthItem.label); 
          AEDAmounts.push(monthItem.transaction ?? 0);
         });
        
          item.USDtransaction.forEach((monthItem: any) => {
            USDAmounts.push(monthItem.transaction ?? 0);
          });
       
      });
      setYearList(years);
       setAmountList({
      AED: AEDAmounts,
      USD: USDAmounts,
    });
    });
    adminDashboardData(tab).then((response: any) => {
      setOverallCount(response?.data);
    });
  };
  const onTabchange = (tabValue: string) => {
    setTab(tabValue);
    dashboardData(tabValue);
  };  
  const columns = [
    {
      title: "User id",
      dataIndex: "userAlias",
      sorter: false,
      width: 120,
      render: (text: string, record: any) => (
        <span
          className="cursor hyperLink"
          onClick={() => navigate(UserInfo + "/" + record?.userAlias)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "User details",
      dataIndex: "email",
      sorter: false,
      width: 130,
      render: (text: any, value: any) => {
        return (
          <>
            <span className="counterparty-name">
              <Popover content={value?.name ? value?.name : ""} placement="bottom">
                <span className="counterparty-name">
                  {value?.name && value?.name.split(" ")?.[0] || "--"}
                </span>
              </Popover>
            </span>
            <br />
            <span className="counterparty-email">
              <Popover content={text} placement="bottom">
                <span  className={Width > 768 ? "inline overflowText" : ""}>
                  {text || "--"}
                </span>
              </Popover>
            </span>
          </>
        );
      },
    },
    {
      title: "Added on",
      dataIndex: "createAt",
      sorter: false,
      width: 120,
      render: (text: string) => {
        return <span>{moment(text).format("DD MMMM YYYY")}</span>;
      },
    },
    {
      title: "Type",
      dataIndex: "userType",
      sorter: false,
      width: 100,
      render: (text: any) => {
        return <span>{USER_TYPE_TEXT[text] || "--"}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      width: 100,
      render: (text: string) => {
        return (
          <span className="status capitalize">
            <span
              className={USER_STATUS_TEXT[text]
                .toLowerCase()
                .split(" ")
                .join("_")}
            >
              {USER_STATUS_TEXT[text]}
            </span>
          </span>
        );
      },
    },
  ];

  const transcolumns: object[] = [
    {
      title: "Id",
      dataIndex: "agreementId",
      sorter: false,
      render: (text: string, values: any) => {
        return (
          <span
            className="cursor hyperLink"
            onClick={() => {
              navigate(TransactionDetail + "/" + values?.aliasName);
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Added on",
      dataIndex: "createAt",
      sorter: false,
      render: (text: string) => {
        return <span>{moment(text).format("DD MMMM YYYY")}</span>;
      },
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      render: (text: any) => (
        <>
          <Popover content={text?.name} placement="bottom">
            <span className="counterparty-name">
              {text?.name?.split(" ")?.[0]}
            </span>
          </Popover>
        </>
      ),
      sorter: false,
    },
    {
      title: "Counter party",
      dataIndex: "counterpartyDetails",
      render: (text: any) => (
        <>
          <Popover content={text?.name} placement="bottom">
            <span className="counterparty-name">
              {text?.name?.split(" ")?.[0] || "--"}
            </span>
          </Popover>
        </>
      ),
      sorter: false,
    },
    {
      title: "Amount",
      dataIndex: "invoiceAmount",
      render: (text: number, values: any) => (
        <div className="invoiceAmt">
          <span className="fw-4">{values?.currency} </span> <span> {text.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      ),
      sorter: false,
    },
    {
      title: "Status",
      dataIndex: "contractAction",
      render: (text: any) => (
        <div className="status">
         <span className={text?.toLowerCase().split(" ").join("")}>
          {text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase()}
        </span>
        </div>
      ),
      sorter: false,
    },
  ];

  return (
    <div className="scrollbar-container">
    <DefaultLayout page="dashboard" loading={loading} >
      <Row>
        <Col span={Width > 991 ? 18 : 24} className="dashboardTabs noScroll escrow-tran-card">
          {/* Tabs */}
          <Tabs
            defaultActiveKey={tab}
            className="tableTab px-3"
            onChange={(value) => onTabchange(value)}
          >
            <TabPane tab={`Today`} key="today"></TabPane>
            <TabPane tab={`This week`} key="week"></TabPane>
            <TabPane tab={`This month`} key="month"></TabPane>
            <TabPane tab={`This year`} key="year"></TabPane>
          </Tabs>
          {/* cards */}
          <Row className="mt-3">
            <Col span={Width > 1300 ? 6 : 12}>
              <Card className="dashboardcard mr-4 card-space">
                <div className="cardsec">
                  <Image src={Money} preview={false} />
                  {loadingTransactions ? (
                    <>
                      <div className="mt-2"><Spin/></div>
                      <div className="mt-2">Please wait...</div>
                    </>
                  ) : (
                  <div className="number mt-2">
                    {overallCount?.totalTransaction}
                  </div>
                  )}
                  <div className="total mt-2 break">Total transactions</div>
                  <div>
                    <ArrowRightOutlined
                      className="arrowright mt-2"
                      onClick={() => {
                        navigate(EscrowTransactionList);
                      }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={Width > 1300 ? 6 : 12}>
              <Card className="dashboardcard2 card-space">
                {" "}
                <div>
                  <Image src={CardUser} preview={false} />
                  {loadingUsers ? (
                    <>
                      <div className="mt-2"><Spin/></div>
                      <div className="mt-2">Please wait...</div>
                    </>
                  ) : (
                  <div className="number mt-2 bluecard-number">{overallCount?.totalUsers}</div>
                  )}
                  <div className="total mt-2">Total users</div>
                  <div>
                    <ArrowRightOutlined
                      className="arrowright mt-2"
                      onClick={() => {
                        navigate(UserManagementList);
                      }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={Width > 1300 ? 12 : 24} className={Width > 1300 ? "" : "mt-3"}>
              <Card className="dashboardcard3">
                <div className="cardsec">
                  <Row className="p-4" gutter={[24,24]}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} className="mb-4">
                      <div className="total mt-2">
                        Total funds
                        added
                      </div>
                      {loadingFunds ? (
                      <>
                        <div className="mt-2"><Spin/></div>
                        <div className="mt-2">Please wait...</div>
                      </>
                      ) : (
                        <>
                      <div className="number mt-4 bluecard-number">
                        {/* {amountFormat("AED", overallCount?.totalFunds)} */}
                        {overallCount?.totalFunds !== undefined ? amountFormat(currencyValue.AED, overallCount.totalFunds) : "-"}
                      </div>
                      <div className="number mt-2 bluecard-number">
                        {/* {amountFormat("AED", overallCount?.totalFunds)} */}
                        {overallCount?.USDtotalFunds !== undefined ? amountFormat(currencyValue.USD, overallCount.USDtotalFunds) : "-"}
                      </div>
                      </>
                      )}
                      
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} className="pl-15">
                      <div className="total mt-2">
                        Total platform
                        fees
                      </div>
                      {loadingPlatformfee ? (
                        <>
                          <div className="mt-2"><Spin/></div>
                          <div className="mt-2">Please wait...</div>
                        </>
                      ) : (
                        <>
                      <div className="number mt-4 mb-1 bluecard-number">
                        {amountFormat(currencyValue.AED, overallCount?.totalPlateformFee)}
                      </div>
                      <div className="number mt-2 mb-1 bluecard-number">
                        {amountFormat(currencyValue.USD, overallCount?.USDtotalPlateformFee)}
                      </div>
                      </>
                      )}
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
          {/* Weekly Report */}
          <div className="cardborder mt-4 p-4">
            <div className="endtoend">
              <div className="titleText">Weekly transaction report</div>
              <Image
                preview={false}
                src={download}
                height={27}
                width={29}
                className="cursor"
                onClick={() => {
                  downloadSVG("WeeklyReport");
                }}
              />
            </div>
              <WeeklyReport graphData={weeklyGraphData?.[0]?.data } loader={reportLoader} />
          </div>
        </Col>
        <Col
          span={Width > 991 ? 6 : 24}
          className={Width > 991 ? "pl-1" : "mt-5"}
        >
          <div className={Width > 1340 ? "titleText mb-5" : "titleText mb-4"}>Transaction status</div>
          {!reportLoader ? <div
            className={Width > 1340 ? "status-card py-2" : "status-card pt-2"}
          >
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-12 col-xl-12">
            <div
              className={Width > 1340 ? "sidecard mb-3" : "sidecard"}
            >
              <div className="number">
                {weeklyGraphData?.[0]?.totalTodayTrans}
              </div>
              <div className="total mt-1">Today’s transaction</div>
              <div className={`weeklyGraphData?.[0]?.yesterdayPercentage >= 0 ?"up":"down","endtoend","d-flex"`} >
                <div>
                  <Image
                    src={weeklyGraphData?.[0]?.yesterdayPercentage >= 0 ? Uparrow : Downarrow}
                    alt="uparrow"
                    preview={false}
                    className=""
                    height={12}
                    width={12}
                  />{" "}
                  {Math.abs(parseFloat(weeklyGraphData?.[0]?.yesterdayPercentage))}%
                   <span className="secondaryText mx-2">Yesterday</span>
                </div>
                <div>
                  <Image src={Chart1} alt="chart" preview={false} />
                </div>
              </div>
            </div>
            </div>
             <div className="col-sm-6  col-md-6 col-lg-12 col-xl-12">
            <div className={Width > 1200 ? "sidecard mb-3" : "sidecard mb-2"}>
              <div className="number">
                {weeklyGraphData?.[0]?.totalWeekTrans}
              </div>
              <div className="total mt-1">This week’s transaction</div>
              <div className={`weeklyGraphData?.[0]?.weekPercentage >= 0 ?"up":"down","endtoend","d-flex"`} >
                <div>
                  <Image
                    src={weeklyGraphData?.[0]?.weekPercentage >= 0 ? Uparrow : Downarrow}
                    alt="uparrow"
                    preview={false}
                    className=""
                    height={12}
                    width={12}
                  />{" "}
                  {Math.abs(parseFloat(weeklyGraphData?.[0]?.weekPercentage))}% <span className="secondaryText mx-2">Last week</span>
                </div>
                <div>
                  <Image src={Chart2} alt="chart" preview={false} />
                </div>
              </div>
            </div>
            </div>
              <div className="col-sm-6 col-md-6 col-lg-12 col-xl-12">
            <div className={Width > 1200 ? "sidecard mb-3" : "sidecard mb-2"}>
              <div className="number">
                {weeklyGraphData?.[0]?.totalMonthTrans}
              </div>
              <div className="total mt-1">This month’s transaction</div>
              <div className={`weeklyGraphData?.[0]?.monthPercentage >= 0 ?"up":"down","endtoend","d-flex"`} >
                <div>
                  <Image
                    src={weeklyGraphData?.[0]?.monthPercentage >= 0 ? Uparrow : Downarrow}
                    alt="uparrow"
                    preview={false}
                    className=""
                    height={12}
                    width={12}
                  />{" "}
                  {Math.abs(parseFloat(weeklyGraphData?.[0]?.monthPercentage))}% <span className="secondaryText mx-2">Last month</span>
                </div>
                <div>
                  <Image src={Chart1} alt="chart" preview={false} />
                </div>
              </div>
            </div>
            </div>
             <div className="col-sm-6  col-md-6 col-lg-12 col-xl-12">
            <div className="sidecard mb-3">
              <div className="number">
                {weeklyGraphData?.[0]?.totalYearTrans}
              </div>
              <div className="total mt-1">This year’s transaction</div>
              <div className={`weeklyGraphData?.[0]?.yearPercentage >= 0 ?"up":"down","endtoend","d-flex"`} >
                <div>
                  <Image
                    src={weeklyGraphData?.[0]?.yearPercentage >= 0 ? Uparrow : Downarrow}
                    alt="uparrow"
                    className=""
                    height={12}
                    width={12}
                    preview={false}
                  />{" "}
                  {Math.abs(parseFloat(weeklyGraphData?.[0]?.yearPercentage))}%  <span className="secondaryText mx-2">Last year</span>
                </div>
                <div>
                  <Image src={Chart1} alt="chart" preview={false} />
                </div>
              </div>
            </div>
            </div>
            </div>
          </div> :<div className="spinner"><Spin className="mainloader pdf" /></div>}
        </Col>
      </Row>
      <div>
        <div className="cardborder mt-4">
          <div className="endtoend">
            <div className="titleText">Annual sales report</div>
            <div className={Width > 580 ? "d-flex gap-4 justify-content-center align-items-center" : "d-flex gap-1 justify-content-center align-items-end flex-column"}>
              <ViewButton
                children="Refresh"
                className="orangeText"
                onClick={() => {
                  fetchAnnualTransaction();
                }}
              />
              <Select
                className="linebarselect"
                defaultValue={Year}
                value={Year}
                style={{ width: 150 }}
                options={YEAR()}
                onChange={(value: string) => {
                  fetchAnnualTransactionByYear(value);
                  setYear(value);
                }}
                showSearch
                allowClear={!!Year}
                optionFilterProp="label"
              />
            </div>
          </div>
          <AnnualSalesReport xaxis={yearList} yaxis={amountList} loader={graphLoader} currency={currencyValue}/>
        </div>
      </div>
      <Row className={Width > 991 ? "endtoend dashboardTabs" : "dashboardTabs noScroll"}>
        {Width > 767 ? (
        <>
        <Col
          span={Width > 991 ? 11 : 24}
          className="cardborder p-0 py-4 mt-4 createdTransaction"
        >
          <Card className="noBorder transparent mt-6 kyc-table-list-card-wrap escrow-tran-card">
          <div
            className={Width > 1150 ? "endtoend mb-4 mx-4" : "endtoend mb-4 p-2"}
          >
            <div className="titleText break">Onboarded users</div>
            <Link to={UserManagementList} className="view-all">
              View all <ArrowRightOutlined />
            </Link>
          </div>
          {/* {Width > 991 ? ( */}
          <Tabs
            defaultActiveKey="all"
            className="tableTab px-3 "
            onChange={(value: string) => {
              fetchOnboardUsers(value?.toUpperCase());
            }}
          >
            <TabPane tab={`All (${tableDataCount?.all})`} key="all"></TabPane>

            <TabPane
              tab={`Customer (${tableDataCount?.customer})`}
              key="user"
            ></TabPane>
            <TabPane
              tab={`Approver (${tableDataCount?.approver})`}
              key="trustee"
            ></TabPane>
            <TabPane
              tab={`Client (${tableDataCount?.client})`}
              key="client"
            ></TabPane>
          </Tabs>
          {/* ) : (
                  <Select
                    placeholder="All"
                    className="tabSelect"
                    onChange={(value: string) => {
                      fetchOnboardUsers(value?.toUpperCase());
                    }}
                  >
                    <Option value="all">{`All (${tableDataCount?.all})`}</Option>
                    <Option value="pending">{`Customer (${tableDataCount?.customer})`}</Option>
                    <Option value="rejected">{`Approver (${tableDataCount?.approver})`}</Option>
                    <Option value="completed">
                      {`Client (${tableDataCount?.client})`}
                    </Option>
                  </Select>
                )} */}
          <Table
            columns={columns}
            dataSource={OnBoardUsers}
            pagination={false}
            className="mt-6 w-100 paymentLogTable"
            scroll={{ x: 992 }}
            loading={loadingOnboardUsers}
          />
          </Card>
        </Col>
        </>
        ) : "" }
        {Width < 768 ? (
        <>
         <Card className="noBorder transparent mt-6 kyc-table-list-card-wrap escrow-tran-card">
          <div
            className={Width > 1150 ? "endtoend mb-4 mx-4" : "endtoend mb-2 p-2"}
          >
            <div className="titleText break">Onboarded Users</div>
            <Link to={UserManagementList} className="view-all">
              View all <ArrowRightOutlined />
            </Link>
          </div>
          <div  id="paymentLogTab" className="w-100 endtoend">
            <div className="d-flex disputeTabs">
            <Tabs
              defaultActiveKey="all"
              className="tableTab overflow-auto "
              onChange={(value: string) => {
                fetchOnboardUsers(value?.toUpperCase());
              }}
            >
              <TabPane tab={`All (${tableDataCount?.all})`} key="all"></TabPane>
              <TabPane
                tab={`Customer (${tableDataCount?.customer})`}
                key="user"
              ></TabPane>
              <TabPane
                tab={`Approver (${tableDataCount?.approver})`}
                key="trustee"
              ></TabPane>
              <TabPane
                tab={`Client (${tableDataCount?.client})`}
                key="client"
              ></TabPane>
            </Tabs>
            </div>
          </div>

          {OnBoardUsers.length > 0 ? (
            <>
            <div className="paymentLog-mobile-view">
                {OnBoardUsers.map((user: any, index: any) => (
                  <div key={index} className="mobile-card row">
                    {columns.map((column:any, columnIndex:any) => (
                      <div
                        key={`${user.userAlias}-${columnIndex}`}
                        className="sub-body col-6 col-sm-4"
                      >
                        <div className="mobile-header dashboard-mobile-header">{column?.title}</div>
                        <div className="mobile-data">{column.render ? column.render(user[column.dataIndex], user) : user[column.dataIndex]}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <Table
                columns={columns}
                dataSource={OnBoardUsers}
                loading={loadingOnboardUsers}
                className="mt-6 w-100 paymentLogTable"
                scroll={{ x: 992 }}
              />
            </>
          ):(
            ""
          )}
          </Card>
          </>
        ): ("")
          }
        
        {Width > 767 ? (
        <>
        <Col
          span={Width > 991 ? 11 : 24}
          className="cardborder p-0 py-4 createdTransaction mt-4"
        >
          <Card className="noBorder transparent mt-6 kyc-table-list-card-wrap escrow-tran-card">
            <div
              className={Width > 1150 ? "endtoend mb-4 mx-4" : "endtoend mb-4 p-2"}
            >
              <div className="titleText break">Created transactions</div>
              <Link to={EscrowTransactionList} className="view-all">
                View all <ArrowRightOutlined />
              </Link>
            </div>
          {/* {Width > 991 ? ( */}
          <Tabs
            defaultActiveKey="all"
            className="tableTab px-3"
            onChange={(value: string) => {
              fetchTransactions(value);
            }}
          >
            <TabPane
              tab={`All (${transactionTabCount?.all})`}
              key="all"
            ></TabPane>

            <TabPane
              tab={`Pending  (${transactionTabCount?.pending})`}
              key="pending"
            ></TabPane>
            <TabPane
              tab={`Reject  (${transactionTabCount?.rejected})`}
              key="rejected"
            ></TabPane>
            <TabPane
              tab={`In progress  (${transactionTabCount?.inprogress})`}
              key="inprogress"
            ></TabPane>
            <TabPane
              tab={`Completed  (${transactionTabCount?.completed})`}
              key="completed"
            ></TabPane>
          </Tabs>
          {/* ) : (
                  <Select
                    placeholder="All"
                    className="tabSelect"
                    onChange={(value) => fetchTransactions(value)}
                  >
                    <Option value="all">{`All (${transactionTabCount?.all})`}</Option>
                    <Option value="pending">{`Reject  (${transactionTabCount?.rejected})`}</Option>
                    <Option value="rejected">{`Reject  (${transactionTabCount?.rejected})`}</Option>
                    <Option value="inprogress">{`In Progress  (${transactionTabCount?.inprogress})`}</Option>
                    <Option value="completed">
                      {`Completed  (${transactionTabCount?.completed})`}
                    </Option>
                  </Select>
                )} */}
          <Table
            columns={transcolumns}
            dataSource={tableData}
            pagination={false}
            className="mt-6 w-100 paymentLogTable"
            scroll={{ x: 992 }}
            loading={loadingCreated}
          />
        </Card>
        </Col>
      </>
        ): (
          ""
        )}
      {Width < 768 ? (
        <>
        <Card className="noBorder transparent mt-6 kyc-table-list-card-wrap escrow-tran-card">
        <div
          className={Width > 1150 ? "endtoend mb-4 mx-4" : "endtoend mb-2 p-2"}
        >
          <div className="titleText break">Created Transactions</div>
            <Link to={EscrowTransactionList} className="view-all">
              View All <ArrowRightOutlined />
            </Link>
          </div>
          <div  id="paymentLogTab" className="w-100 endtoend">
            <div className="d-flex disputeTabs">
              <Tabs
                defaultActiveKey="all"
                className="tableTab overflow-auto"
                onChange={(value: string) => {
                  fetchTransactions(value);
                }}
              >
                <TabPane
                  tab={`All (${transactionTabCount?.all})`}
                  key="all"
                ></TabPane>

                <TabPane
                  tab={`Pending  (${transactionTabCount?.pending})`}
                  key="pending"
                ></TabPane>
                <TabPane
                  tab={`Reject  (${transactionTabCount?.rejected})`}
                  key="rejected"
                ></TabPane>
                <TabPane
                  tab={`In Progress  (${transactionTabCount?.inprogress})`}
                  key="inprogress"
                ></TabPane>
                <TabPane
                  tab={`Completed  (${transactionTabCount?.completed})`}
                  key="completed"
                ></TabPane>
              </Tabs>
          </div>  
          </div>
        {transcolumns.length > 0 ? (
            <>
              <div className="paymentLog-mobile-view">
                {tableData.map((transaction: any, index: any) => (
                  <div key={index} className="mobile-card row">
                    {transcolumns.map((column:any, columnIndex:any) => (
                      <div
                        key={`${transaction.transactionId}-${columnIndex}`}
                        className="sub-body col-6 col-sm-4"
                      >
                        <div className="mobile-header dashboard-mobile-header">{column.title}</div>
                        <div className="mobile-data">{column.render ? column.render(transaction[column.dataIndex], transaction) : transaction[column.dataIndex]}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <Table
                columns={transcolumns}
                dataSource={tableData}
                loading={loadingCreated}
                className="mt-6 w-100 paymentLogTable"
                scroll={{ x: 992 }}
              />
            </>
          ) : (
            ""
            )}
          </Card>
          </>
          ) :
          ("")
          }
      </Row>
    </DefaultLayout>
    </div>
  );
};

export default Dashboard;
