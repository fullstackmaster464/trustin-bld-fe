import { Col, Popover, Row, Table, Tabs } from "antd";
import TabPane from "antd/lib/tabs/TabPane";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchAllUsers,
} from "../../services/admin";
import {
  USER_STATUS_TEXT,
  USER_TYPE_TEXT
} from "../Common/Constants";
import moment from "moment";
import {
  UserManagementList,
  UserInfo,
} from "../Common/RouteConst";
import DefaultLayout from "../Common/DefaultLayout";
const KycKybDashboard = () => {
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [OnBoardUsers, setOnBoardUsers] = useState([]);
  const [tableDataCount, setTableDataCount] = useState<any>({});
  const [loadingOnboardUsers, setLoadingOnboardUsers] = useState(false);

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  
  const navigate = useNavigate();
  useEffect(() => {
    fetchOnboardUsers("USER");
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);
  const fetchOnboardUsers = (value: string) => {
    setLoadingOnboardUsers(true);
    fetchAllUsers(0, 5, value, "sortByAgreementId", "DESC").then((res: any) => {
      setLoadingOnboardUsers(false);
      setOnBoardUsers(res?.data?.data);
      let count = {
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
                  {value?.name && value?.name.split(" ")?.[0]}
                </span>
              </Popover>
            </span>
            <br />
            <span className="counterparty-email">
              <Popover content={text} placement="bottom">
                <span className="inline overflowText">
                  {text}
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
        return <span>{USER_TYPE_TEXT[text]}</span>;
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

  return (
    <div className="scrollbar-container">
    <DefaultLayout page="dashboard" loading={loadingOnboardUsers}>
      <Row className={"dashboardTabs"}>
        {Width > 767 ? (
          <>
            <Col
              span={24}
              className="cardborder p-0 py-4 mt-4 createdTransaction"
            >
              <div
                className={
                  Width > 1150 ? "endtoend mb-4 mx-4" : "endtoend mb-4 p-2"
                }
              >
                <div className="titleText break">Onboarded users</div>
                <Link to={UserManagementList} className="view-all">
                  View all <ArrowRightOutlined />
                </Link>
              </div>
              {/* {Width > 991 ? ( */}
              <Table
                columns={columns}
                dataSource={OnBoardUsers}
                pagination={false}
                className="mt-6 w-100 paymentLogTable"
                scroll={{ x: 992 }}
                loading={loadingOnboardUsers}
              />
            </Col>
          </>
        ) : (
          ""
        )}
        {Width < 768 ? (
          <>
            <Card className="noBorder transparent w-100 mt-5">
              <div
                className={
                  Width > 1150 ? "endtoend mb-4 mx-4" : "endtoend mb-2 p-2"
                }
              >
                <div className="titleText break">Onboarded Users</div>
                <Link to={UserManagementList} className="view-all">
                  View all <ArrowRightOutlined />
                </Link>
              </div>
              <div id="paymentLogTab" className="w-100 endtoend">
                <div className="d-flex disputeTabs">
                  <Tabs
                    defaultActiveKey="user"
                    className="tableTab overflow-auto "
                    onChange={(value: string) => {
                      fetchOnboardUsers(value?.toUpperCase());
                    }}
                  >
                    <TabPane
                      tab={`All (${tableDataCount?.all})`}
                      key="CUSTOMER"
                    ></TabPane>
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
                        {columns.map((column: any, columnIndex: any) => (
                          <div
                            key={`${user.userAlias}-${columnIndex}`}
                            className="sub-body col-6 col-sm-4"
                          >
                            <div className="mobile-header">{column?.title}</div>
                            <div className="mobile-data">
                              {column.render
                                ? column.render(user[column.dataIndex], user)
                                : user[column.dataIndex]}
                            </div>
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
              ) : (
                ""
              )}
            </Card>
          </>
        ) : (
          ""
        )}
      </Row>
    </DefaultLayout>
    </div>
  );
};

export default KycKybDashboard;
