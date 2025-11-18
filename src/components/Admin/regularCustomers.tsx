import {
  Breadcrumb,
  Card,
  Image,
  Input,
  Pagination,
  Select,
  Table,
  Tabs,
  message,
  Tooltip
} from "antd";
import { useNavigate } from "react-router-dom";
import RegularCustomerIcon from "../../assets/img/Headers/Regular_customers.svg";
import View from "../../assets/img/view.svg";
import emptyCalls from "../../assets/img/emptyCalls.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import { RegularCustomDetail } from "../Common/RouteConst";
import moment from "moment";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import { getAllCallsDetails } from "../../services/transaction";
import { enterpriseUserCallsStatus } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
import Search from "../../assets/img/search.svg";
import { custumerSearch } from "../../services/admin";
const RegularCustomers = ():any => {
  const navigate = useNavigate();
  const [customersList, setRegularCustomersList] = useState<any>([]);
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [allCount, setAllCount] = useState({
    pending: 0,
    scheduled: 0,
    rescheduled: 0,
    interested: 0,
    closed: 0,
  });
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("pending");
  // eslint-disable-next-line prefer-const
  let [searchedKey, setSearchedKey] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    fetchCustomersList(1, value, tab);
  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrent(1);
    fetchCustomersList(1, page, tabValue);
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    fetchCustomersList(pageno, page, tab);
  };
  const sortedColumnMap:any = {
    "name": "sortByName",
    "email": "sortByEmail",
    "date": "sortByCreatedBy",
    "createAt": "sortByCreateAt",
    "aliasName": "sortByAliasName",
    "contactNumber": "sortByContactNumber",
    "status": "sortByStatus"
};
const sortingOrderMap:any = {
    "ascend": "ASC",
    "descend": "DESC"
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
  const locale = {
    allLocale: {
      emptyText: (
        <>
          <Image src={emptyCalls} preview={false} />
          <p className="nodata my-5">No Call Schedulers Found</p>
        </>
      ),
    },
  };
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: false,
      width: 100,
      render: (text:any,value:any) => {
        return <div className="hyperLink overflowText" onClick={() => navigate(RegularCustomDetail + "/" + value?.aliasName)}>
          <Tooltip
            title={text.length * 7 > 100 ? text : null}
            overlayClassName='leads-custom-tooltip'
          >
            <div className="overflowText">
              <span>{text}</span>
            </div>
          </Tooltip>
        </div>
      }
    },
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      width: 100,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Email address",
      dataIndex: "email",
      sorter: false,
      width: 150,
      render: (email: string) => {
        return <div className="overflowText">
          <Tooltip
            title={email.length * 7 > 120 ? email : null}
            overlayClassName='leads-custom-tooltip'
          >
            <div className="overflowText">
              <span>{email}</span>
            </div>
          </Tooltip>
        </div>; 
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      width: 100,
      render: (text: any) => {
        return (
          <div className="status">
            <span className={text.toLowerCase()}>
              {enterpriseUserCallsStatus?.[text]}
            </span>
          </div>
        );
      },
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      sorter: false,
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "aliasName",
      sorter: false,
      width: 50,
      render: (text: string) => {
        return (
          <>
          {isSmallScreen ? (
            <div className="">
              View
              <Image
                src={View}
                alt="view"
                preview={false}
                className="cursor mx-4"
                height={16}
                width={22}
                onClick={() => navigate(RegularCustomDetail + "/" + text)}
              />
            </div>
          ) : (
            <div className="mx-2">
              <Image
                src={View}
                alt="view"
                preview={false}
                className="cursor"
                height={16}
                width={22}
                onClick={() => navigate(RegularCustomDetail + "/" + text)}
              />
            </div>
          )}
        </>
        );
      },
    },
  ];
  const fetchCustomersList = (
    current: number,
    page: number,
    userType: string
  ) => {
    setLoading(true);
    getAllCallsDetails(
      current > 0 ? current - 1 : 0 || 0,
      page || 10,
      userType || "pending"
    )
      .then((response) => {
        setLoading(false);
        const List = response.data;
        setRegularCustomersList(List?.data);
        setAllCount({
          pending: List?.pendingCount,
          scheduled: List?.scheduledCount,
          rescheduled: List?.rescheduledCount,
          interested: List?.interestedCount,
          closed: List?.closedCount,
        });
        setTotalPage(List?.lastPage * page);
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Something went wrong. Please try again later");
      });
  };
  useEffect(() => {
    fetchCustomersList(current, page, "pending");
  }, []);
  const onSearch = (e: string, currentPage: number, page: number,sort:any) => {
    if (e.length === 0) {
      searchedKey = "";
    }
    setLoading(true);
    if (e) {
      setSearchedKey(e);
      const reqBody = { key: e};
      custumerSearch(currentPage > 0 ? currentPage - 1 : 0,
        page || 10,
        sortedColumnMap?.[sort?.field] || "sortByAgreementId",
        sortingOrderMap?.[sort?.order] || "DESC",
        reqBody) 
        .then((response:any) => {
          setLoading(false);
          setRegularCustomersList(response?.data?.data);
          setTotalPage(response?.data?.lastPage * page);
        })
        .catch(() => {
          setLoading(false);
          message.error("Could not fetch details. Please try again later");
        });
    }
    else{
      setSearchedKey('');
      fetchCustomersList(1, page, tab);
    }
  };
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="enquiry_regular"
        // loading={loading}
        TitleText="Leads"
        TitleImage={RegularCustomerIcon}
        headerPage={
          <div className="d-flex">
                      <Image
                        src={RegularCustomerIcon}
                        preview={false}
                        className="mt-2"
                        alt="escrowimage"
                      />
                      <div className="ml-5">
                        <b> Leads</b>
                        <Breadcrumb separator=">">
                          <Breadcrumb.Item
                            // onClick={() => {
                            //   navigate(Dashboard);
                            // }}
                          >
                            Enquiry
                          </Breadcrumb.Item>
                          <Breadcrumb.Item>Leads</Breadcrumb.Item>
                        </Breadcrumb>
                      </div>
                    </div>
                  }
      >
              <Card className="noBorder transparent mt-6">
                <div className="w-100 endtoend">
                {searchedKey == '' ? (
                  <div className="d-flex disputeTabs overflow-auto">
                    <Tabs
                      defaultActiveKey="pending"
                      className="tableTab mt-6"
                      onChange={onTabChange}
                    >
                      <TabPane
                        tab={`Pending (${allCount?.pending})`}
                        key="pending"
                      ></TabPane>
                      <TabPane
                        tab={`Scheduled (${allCount?.scheduled})`}
                        key="scheduled"
                      ></TabPane>
                      <TabPane
                        tab={`Rescheduled (${allCount?.rescheduled})`}
                        key="rescheduled"
                      ></TabPane>
                      <TabPane
                        tab={`Interested (${allCount?.interested})`}
                        key="interested"
                      ></TabPane>
                      <TabPane
                        tab={`Closed (${allCount?.closed})`}
                        key="closed"
                      ></TabPane>
                    </Tabs>
                  </div>):<div></div>}
                  <Input
                      className="search-input-additem addBtn ml-3 px-3"
                      placeholder="Search"
                      prefix={
                        <Image
                          src={Search}
                          alt="search"
                          className=""
                          preview={false}
                        />
                      }
                      onInput={(e: any) => {
                        onSearch(e.target.value, 1, page,sortingOrderMap);
                      }}
                    />
                </div>
                {customersList.length > 0 ? (
                  <>
                    <div className="paymentLog-mobile-view">
                      {customersList.map((customers: any, Index: any) => (
                        <div className="mobile-card row" key={Index}>
                          {columns.map((column, index) => (
                            <div key={`${customers.Name}-${index}`} className="sub-body col-6 col-sm-4">
                              <div className="mobile-header">
                                {column.title}
                              </div>
                              <div className="mobile-data">{column.render ? column.render(customers[column.dataIndex],customers) : customers[column.dataIndex]}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <Table
                  columns={columns}
                  dataSource={customersList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 paymentLogTable"
                  scroll={{ x: 1200 }}
                  locale={locale.allLocale}
                />
                </>
                ):(
                  <Table
                  columns={columns}
                  dataSource={customersList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6"
                  scroll={{ x: 1200 }}
                  locale={locale.allLocale}
                />
                )}
                  {customersList?.length > 0 ? (
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
                </Card>
                </DefaultLayout>
              </div>
      </div>
  );
};

export default RegularCustomers;
