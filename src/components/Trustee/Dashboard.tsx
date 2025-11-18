import {
  Button,
  Card,
  Col,
  Image,
  Popover,
  Row,
  Select,
  Table,
  Spin,
  Tabs,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import {
  fetchChartData,
  fetchWeeklyReport,
  fetchdashboard,
  sortApprovedDashboardTxn,
  sortDisputeDashboardTxn,
  sortOngoingDashboardTxn,
  sortallDashboardTxn,
} from "../../services/trustee";
import {CreateEscrow, TrusteeTransaction,} from "../Common/RouteConst";
import { getCount, getLocalStorage } from "../Common/Constants";
import emptyCalls from "../../assets/img/notransaction.svg";
import { ArrowRightOutlined } from "@ant-design/icons";
import TabPane from "antd/lib/tabs/TabPane";
import Chart from "react-apexcharts";
import View from "../../assets/img/view.svg";
import { TransactionDetail } from "../Common/RouteConst";
import DefaultLayout from "../Common/DefaultLayout";

const TrusteeDashboard = ():any => {
  const navigate = useNavigate();
  const [trustee, settrustee] = useState<any>([]);
  const [approved, setapproved] = useState<any>([]);
  const [pending, setpending] = useState<any>([]);
  const [ongoing, setOngoing] = useState<any>([]);
  const [dispute, setDispute] = useState<any>([]);
  // const [onhold, setonhold] = useState<any>([]);
  // const [archived, setonarchived] = useState<any>([]);
  const [barseries, setbarseries] = useState<any>([]);
  const [barChart, setBarChart] = useState<any>([]);
  const [contractID, setcontractID] = useState("all");
  const [pieTab, setPieTab] = useState("today");
  const [pieLoading, setPieLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState({
    approved: 0,
    pending: 0,
    archived: 0,
    dispute: 0,
    ongoing: 0,
    all: 0,
  });
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;

  useEffect(() => {
    setLoading(true)
    _fetchTrusteeDashboard();
    fetchWeeklyReport(pieTab, userAlias).then((response) => {
      frameChartData(response, pieTab);
      setLoading(false)
    });
  }, []);
  const locale: any = {
    allLocale: {
      emptyText: (
        <>
          <Image src={emptyCalls} preview={false} className="mt-5" />
          <p className="nodata mt-5">No escrow transaction yet done</p>
          <Button type="primary" className="modal-button mt-3"
          onClick={() => {
            navigate(CreateEscrow);
           }}
          >
            Create Now
          </Button>
        </>
      ),
    },
  };
  const frameChartData = (chartData: any, tab: string) => {
    const approved = chartData.data.approvedCount
      ? chartData.data.approvedCount
      : 0;
    const pending = chartData.data.pendingCount ? chartData.data.pendingCount : 0;
    const archived = chartData.data.archivedCount
      ? chartData.data.archivedCount
      : 0;
    const dispute =
      chartData?.data?.disputedCount || chartData?.data?.disputeCount;
    const ongoing = chartData.data.ongoingCount ? chartData.data.ongoingCount : 0;
    const all = approved + pending + archived + ongoing;
    const data = [approved, pending, dispute, ongoing, archived];
    const noData = (item: any) => {
      return item === 0;
    };

    if (tab === "all") {
      setCount({
        approved: approved,
        pending: pending,
        archived: archived,
        dispute: dispute,
        ongoing: ongoing,
        all: all,
      });
      setBarChart(data);
    } else {
      setbarseries(data);
    }
    if (data.every(noData)) {
      setbarseries([]);
    }
  };
  const sortedColumnMap: any = {
    aliasName: "sortByAgreementId",
    date: "sortByCreateAt",
    invoiceAmount: "sortByInvoiceAmount",
    b_name: "sortByBuyer",
    s_name: "sortBySeller",
  };
  const sortingOrderMap: any = {
    ascend: "ASC",
    descend: "DESC",
  };

  const _fetchTrusteeDashboard = async (current = 1, pageSize = 5) => {
    const reqBody = {
      trusteeId: userAlias,
      id: contractID,
    };
    const chartData = await fetchChartData(reqBody);
    frameChartData(chartData, "all");

    const response = await fetchdashboard(current - 1, pageSize, reqBody);
    if (response?.status === 201 || response?.status === 200) {
      settrustee(response?.data?.data);
      const pendingd: any = [];
      const approvedd: any = [];
      const _onGoing: any = [];
      const hold: any = [];
      const archivedd: any = [];
      const dispute: any = [];

      response?.data?.data?.map((val: any) => {
        if (val.platformStatus === "0") {
          pendingd.push(val);
        }
        if (val.platformStatus === "1") {
          approvedd.push(val);
        }
        if (val.platformStatus === "2") {
          _onGoing.push(val);
        }
        if (val.platformStatus === "3") {
          archivedd.push(val);
        }
        if (val.platformStatus === "4") {
          hold.push(val);
        }
        if (Number(val.contractStatus) >= 7) {
          dispute.push(val);
        }
      });
      setapproved(approvedd);
      setpending(pendingd);
      setOngoing(_onGoing);
      // setonhold(hold);
      setDispute(dispute);
      // setonarchived(archivedd);
      setLoading(false);
    }
  };

  const categories = ["Approved", "Pending", "Dispute", "On going", "Archived"];
  const categoriesColor = [
    "#00BD71",
    "#FFC727",
    "#FF7A7A",
    "#A4C0F8",
    "#808080",
  ];

  const chartOpt: any = {
    options: {
      chart: {
        id: "basic-bar",
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        colors: ["#00BD71", "#FFC727", "#FF7A7A", "#A4C0F8", "#808080"],
      },
      legend: {
        show: true,
        position: "bottom",
        itemMargin: {
          horizontal: 20,
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          formatter: function (value: any) {
            return value;
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 20,
          borderRadiusApplication: "end",
          columnWidth: "40px",
        },
      },
    },
    series: [
      {
        name: "count",
        data: barChart.map((e: any, i: any) => {
          return {
            x: categories[i],
            y: e,
            fillColor: categoriesColor[i],
            strokeColor: categoriesColor[i],
          };
        }),
      },
    ],
  };

  const columns = [
    {
      title: "Agreement id",
      dataIndex: "agreementId",
      render: (text: any,value:any) => {
        return <Typography.Text ellipsis={true} style={{ maxWidth: 150 }} className="hyperLink" onClick={() => {
          navigate(TransactionDetail + "/" + value?.aliasName,{state:"escrow"})
        }}
        >
          {text}
          </Typography.Text>;
        },

    },
    {
      title: "Buyer",
      dataIndex: "b_name",
      render: (text: string, values: any) => (
        <>
          <span className="counterparty-name">
            <Popover content={text} placement="bottom">
              <span className="counterparty-name">{text ? text.split(" ")?.[0] : ""}</span>
            </Popover>
          </span>
          <br />
          <span className="counterparty-email">
            <Popover content={values.b_email} placement="bottom">
              <span className="Status">
                {values.b_email.slice(0, 15) +
                  (values.b_email.length > 15 ? "..." : "")}
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
            <Popover content={text} placement="bottom">
              <span className="counterparty-name">{text?.split(" ")?.[0] ?? ""}</span>
            </Popover>
          </span>
          <br />
          <span className="counterparty-email">
            <Popover content={values.s_email} placement="bottom">
              <span className="Status">
                {values.s_email.slice(0, 15) +
                  (values.s_email.length > 15 ? "..." : "")}
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
                {" "}
                {values?.currency} {parseFloat(text).toLocaleString()}
              </span>
            </span>
          </div>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "aliasName",
      render: (text: string) => (
        <div>
          <Image
            src={View}
            alt="view"
            className="cursor"
            preview={false}
            onClick={() => {
              navigate(TransactionDetail + "/" + text);
            }}
            height={16} width={22}
          />
        </div>
      ),
    },
  ];

  const pieOptions: any = {
    chart: {
      width: 380,
      type: "pie",
    },
    legend: {
      position: "bottom",
      itemMargin: {
        horizontal: 20,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (_val: string, index: any) {
        return index?.w?.config?.series[index.seriesIndex];
      },
      style: {
        fontSize: "16px",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -25,
          fontSize: 25,
        },
      },
    },

    noData: {
      text: "No transactions found!",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: -35,
      style: {
        color: "#232323",
        fontSize: "18px",
      },
    },
    colors: ["#00BD71", "#FFC727", "#FF7A7A", "#A4C0F8", "#808080"],
    labels: ["Approved", "Pending", "Dispute", "On going", "Archived"],
  };

  useEffect(() => {
    _fetchTrusteeDashboard();
    // lengthCheck();
    setLoading(true)
  }, [contractID]);

  const onTableChange = (pagination: any, contractStatus: any) => {
    setcontractID(contractStatus);
    _fetchTrusteeDashboard(pagination.current, pagination.pageSize);
  };
  const sortDashboardAllTxn = (
    paginate: any,
    filter: any,
    sort: any,
    userType: any
  ) => {
    const reqBody = {
      trusteeId: userAlias,
      id: "all",
      filter: filter,
      userType: userType,
    };
    setLoading(true);
    sortallDashboardTxn(
      paginate?.current - 1 || 0,
      paginate?.pageSize || 5,
      sortedColumnMap?.[sort?.field] || "sortByAgreementId",
      sortingOrderMap?.[sort?.order] || "DESC",
      reqBody || {}
    ).then((response) => {
      setLoading(false);
      settrustee(response?.data?.data);
      const pendingd = getCount(response?.data?.data, "0")
        ? getCount(response?.data?.data, "0")
        : [];
      setpending(pendingd);
    });
  };
  const sortDashboardOngoingTxn = (
    paginate: any,
    filter: any,
    sort: any,
    userType: any
  ) => {
    const reqBody = {
      trusteeId: userAlias,
      id: "2",
      filter: filter,
      userType: userType,
    };
    setLoading(true);
    sortOngoingDashboardTxn(
      paginate?.current - 1 || 0,
      paginate?.pageSize || 5,
      sortedColumnMap?.[sort?.field] || "sortByAgreementId",
      sortingOrderMap?.[sort?.order] || "DESC",
      reqBody || {}
    ).then((response) => {
      setLoading(false);
      settrustee(response?.data?.data);
      const ongoingd = getCount(response?.data?.data, "2")
        ? getCount(response?.data?.data, "2")
        : [];
      setOngoing(ongoingd);
    });
  };
  const sortDashboardDisputeTxn = (
    paginate: any,
    filter: any,
    sort: any,
    userType: string
  ) => {
    const reqBody = {
      trusteeId: userAlias,
      id: "dispute",
      filter: filter,
      userType: userType,
    };
    setLoading(true);
    sortDisputeDashboardTxn(
      paginate?.current - 1 || 0,
      paginate?.pageSize || 5,
      sortedColumnMap?.[sort?.field] || "sortByAgreementId",
      sortingOrderMap?.[sort?.order] || "DESC",
      reqBody || {}
    ).then((response) => {
      setLoading(false);
      settrustee(response?.data?.data);
      const dispute = getCount(response?.data?.data, "dispute")
        ? getCount(response?.data?.data, "dispute")
        : [];
      setDispute(dispute);
    });
  };

  const sortDashboardApprovedTxn = (
    paginate: any,
    filter: any,
    sort: any,
    userType: string
  ) => {
    const reqBody = {
      trusteeId: userAlias,
      id: "1",
      filter: filter,
      userType: userType,
    };
    setLoading(true);
    sortApprovedDashboardTxn(
      paginate?.current - 1 || 0,
      paginate?.pageSize || 5,
      sortedColumnMap?.[sort?.field] || "sortByAgreementId",
      sortingOrderMap?.[sort?.order] || "DESC",
      reqBody || {}
    ).then((response) => {
      setLoading(false);
      settrustee(response?.data?.data);
      const approvedd = getCount(response?.data?.data, "1")
        ? getCount(response?.data?.data, "1")
        : [];
      setapproved(approvedd);
    });
  };
  const onTableChangeForAllSort = (
    paginate: any,
    filter: any,
    sort: any,
    contractId: string
  ) => {
    sortDashboardAllTxn(paginate, filter, sort, contractId);
  };
  const onTableChangeForOngoingSort = (
    paginate: any,
    filter: any,
    sort: any,
    contractStatus: any
  ) => {
    sortDashboardOngoingTxn(paginate, filter, sort, contractStatus);
  };
  const onTableChangeForDisputeSort = (
    paginate: any,
    filter: any,
    sort: any,
    contractStatus: any
  ) => {
    sortDashboardDisputeTxn(paginate, filter, sort, contractStatus);
  };
  const onTableChangeForApprovedSort = (
    paginate: any,
    filter: any,
    sort: any,
    contractStatus: any
  ) => {
    sortDashboardApprovedTxn(paginate, filter, sort, contractStatus);
  };

  // const lengthCheck = () => {
  //   if (ongoing.length === 0) {
  //     console.log("empty");
  //   } else {
  //     console.log("didint work");
  //   }
  // };
  const navigateToescrow = (tab:any) => {
    navigate(TrusteeTransaction, {
      state:{
        tab:tab
      }
    })
  }

  const callback = (key: any) => {
    setcontractID(key);
    setLoading(true);
  };
  const changePieChart = (value: any) => {
    setPieLoading(true);
    setPieTab(value);
    fetchWeeklyReport(value, userAlias).then((response: any) => {
      setPieLoading(false);
      frameChartData(response, value);
    });
  };
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="dashboard"
        // loading={loading}
      >
              <div className="bg-gray">
                <Row
                  gutter={16}
                  className="mt-lg-0 mt-md-0 mt-3 agreement-status"
                >
                  <Col md={12} className="w-100">
                    <Card className="mb-3 h-100 p-4">
                      <div className="titleText mb-5">Agreement status</div>
                      {loading ? (
                        <div>
                          <Spin size="default" className="spin-overlay" />
                        </div>
                      ) : null}
                      <Chart
                        options={chartOpt.options}
                        series={chartOpt.series}
                        type="bar"
                        width={"100%"}
                        height={330}
                        className="trustee-chart"
                      />
                      <div className="apexcharts-legend apexcharts-align-center apx-legend-position-bottom mt-4">
                        {categoriesColor?.map((color, index) => {
                          return (
                            <>
                              <div className="apexcharts-legend-series">
                                {" "}
                                <span
                                  className="apexcharts-legend-marker"
                                  style={{
                                    display: "inline-block",
                                    height: "12px",
                                    width: "12px",
                                    background: `${color}`,
                                    color: `${color}`,
                                    borderRadius: "50%",
                                  }}
                                ></span>{" "}
                                <span className="mr-4 apexcharts-legend-text">
                                  {categories[index]}
                                </span>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </Card>
                  </Col>
                  <Col md={12} className="w-100 mt-lg-0 mt-md-0 mt-3 createdTransaction my-md-3">
                    <Card className="mb-3 h-100 p-4 pie-tabs trustee-tabs escrow-tran-card">
                      <div className="titleText mb-5">
                        Weekly agreement report
                      </div>
                      <Select
                        defaultValue="Today"
                        style={{ width: "100%" }}
                        onChange={(value) => {
                          changePieChart(value);
                        }}
                        className="mt-3 mb-4 d-none-dropdown"
                        options={[
                          { value: "today", label: "Today" },
                          { value: "week", label: "This Week" },
                          { value: "month", label: "This Month" },
                          { value: "year", label: "This Year" },
                        ]}
                      />
                      <Chart
                        options={pieOptions}
                        series={barseries}
                        type="pie"
                        width={"100%"}
                        height={330}
                        className="d-none-dropdown"
                      />
                      {pieLoading && (
                        <div className="pieLoader">
                          <Spin className="center" />
                        </div>
                      )}
                      <div className="d-flex disputeTabs">
                        <Tabs
                          defaultActiveKey="pie1"
                          className="d-none-res tableTab w-100"
                          onChange={(value) => {
                            changePieChart(value);
                          }}
                        >
                          <TabPane tab={`Today`} key="today">
                            <Chart
                              options={pieOptions}
                              series={barseries}
                              type="pie"
                              width={"100%"}
                              height={330}
                            />
                          </TabPane>
                          <TabPane tab={`This week`} key="week">
                            <Chart
                              options={pieOptions}
                              series={barseries}
                              type="pie"
                              width={"100%"}
                              height={330}
                            />
                          </TabPane>
                          <TabPane tab={`This month`} key="month">
                            <Chart
                              options={pieOptions}
                              series={barseries}
                              type="pie"
                              width={"100%"}
                              height={330}
                            />
                          </TabPane>
                          <TabPane tab={`This year`} key="year">
                            <Chart
                              options={pieOptions}
                              series={barseries}
                              type="pie"
                              width={"100%"}
                              height={330}
                            />
                          </TabPane>
                        </Tabs>
                      </div>
                    </Card>
                  </Col>

                  <Col md={24} className="my-md-3 createdTransaction mt-3">
                    <Card className="trustee-tabs escrow-tran-card">
                      <div className="titleText p-4">Assigned agreement</div>
                      <div className="d-flex disputeTabs p-4">
                        <Tabs
                          defaultActiveKey="all"
                          onChange={callback}
                          className="tableTab w-100"
                        >
                          <TabPane
                            tab={`All agreements (${count?.all})`}
                            key="all"
                          >
                            <Table
                              columns={columns}
                              dataSource={trustee}
                              pagination={false}
                              onChange={(paginate, filter, sort) =>
                                onTableChangeForAllSort(
                                  paginate,
                                  filter,
                                  sort,
                                  "all"
                                )
                              }
                              className="mt-2 assignedTable"
                              locale={locale.allLocale}
                              loading={loading}
                              scroll={{ x: 'max-content' }}
                            />
                            {count?.all > 5 ? (
                              <div
                                className="float-end my-4 view-all mx-4 cursor"
                                onClick={()=>{navigateToescrow('Approved')}}
                              >
                                View All <ArrowRightOutlined />
                              </div>
                            ) : (
                              ""
                            )}
                          </TabPane>

                          <TabPane
                            tab={`Approved (${count?.approved})`}
                            key="1"
                          >
                            <Table
                              columns={columns}
                              dataSource={approved}
                              // onChange={(e) => onTableChange(e, '1')}
                              onChange={(paginate, filter, sort) =>
                                onTableChangeForApprovedSort(
                                  paginate,
                                  filter,
                                  sort,
                                  "1"
                                )
                              }
                              pagination={false}
                              className="mt-2 assignedTable"
                              locale={locale.allLocale}
                              loading={loading}
                              scroll={{ x: 'max-content' }}
                            />
                            <div
                              // to="/trustee/viewTransaction?q=approved"
                              onClick={()=>{navigateToescrow('Approved')}}
                              className="float-end my-4 view-all mx-4 cursor"
                            >
                              View All <ArrowRightOutlined />
                            </div>
                          </TabPane>
                          <TabPane tab={`Pending (${count?.pending})`} key="0">
                            <Table
                              columns={columns}
                              dataSource={pending}
                              onChange={(e) => onTableChange(e, "0")}
                              pagination={false}
                              className="mt-2 assignedTable"
                              locale={locale.allLocale}
                              loading={loading}
                              scroll={{ x: 'max-content' }}
                            />
                            <div
                              onClick={()=>{navigateToescrow('Pending')}}
                              className="float-end my-4 view-all mx-4 cursor"
                            >
                              View All <ArrowRightOutlined />
                            </div>
                          </TabPane>
                          <TabPane
                            tab={`Disputed (${count?.dispute})`}
                            key="dispute"
                          >
                            <Table
                              columns={columns}
                              dataSource={dispute}
                              onChange={(paginate, filter, sort) =>
                                onTableChangeForDisputeSort(
                                  paginate,
                                  filter,
                                  sort,
                                  "dispute"
                                )
                              }
                              pagination={false}
                              className="mt-2 assignedTable"
                              locale={locale.allLocale}
                              loading={loading}
                              scroll={{ x: 'max-content' }}
                            />
                            <div
                             onClick={()=>{navigateToescrow('Disputed')}}
                              className="float-end my-4 view-all mx-4 cursor"
                            >
                              View All <ArrowRightOutlined />
                            </div>
                          </TabPane>
                          <TabPane tab={`On going (${count?.ongoing})`} key="2">
                            <Table
                              columns={columns}
                              dataSource={ongoing}
                              onChange={(paginate, filter, sort) =>
                                onTableChangeForOngoingSort(
                                  paginate,
                                  filter,
                                  sort,
                                  "2"
                                )
                              }
                              pagination={false}
                              className="mt-2 assignedTable"
                              locale={locale.allLocale}
                              loading={loading}
                              scroll={{ x: 'max-content' }}
                            />
                            <div
                              className="float-end my-4 view-all mx-4 cursor"
                              onClick={()=>{navigateToescrow('Ongoing')}}
                            >
                              View All <ArrowRightOutlined />
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
              </DefaultLayout>
      </div>
    </div>
  );
};

export default TrusteeDashboard;
