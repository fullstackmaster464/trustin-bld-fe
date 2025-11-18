import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Image,
  Input,
  Pagination,
  Select,
  Table,
  Tabs,
  message,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import Kybimage from "../../assets/img/Headers/KYB_management.svg";
import View from "../../assets/img/view.svg";
import Download from "../../assets/img/download.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import timeicon from "../../assets/img/time_icon.svg";
import tickicon from "../../assets/img/tick_icon.svg";
import { AdminKYBDetail } from "../Common/RouteConst";
import Download_Blue from "../../assets/img/download_blue.svg";
import Search from "../../assets/img/search.svg";
import { getKybList, getKybVerificationFilter } from "../../services/transaction";
import { ENTITY_TYPE, FilterType, sortedColumn, sortingOrder } from "../Common/Constants";
import moment from "moment";
import { downloadDetails, searchList } from "../../services/admin";
import DefaultLayout from "../Common/DefaultLayout";
import KybKycMobileResponsiveCard from "./KybKycMobileResponsiveCard";
import filterIcon from "../../assets/img/filter.svg";
import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import FilterCard from "./FilterCard";

const KYBManagementList = ():any => {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [selectedUserAlias, setSelectedUserAlias] = useState([]);
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState(false);
  const [index, setIndex] = useState<any>();
  const [selectAll, setSelectAll] = useState(false);
  const [allCount, setAllCount] = useState({
    all: 0,
    rejected: 0,
    verified: 0,
    pending: 0,
    hold:0,
    expired: 0
  });
  const [totalPage, setTotalPage] = useState(0);
  const [KybList, setKybList] = useState([]);
  const [tab, setTab] = useState("all");
  const [downloading, setDownloading] = useState(false)
  const [searchedKey, setSearchedKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [validationOnFilter, setValidationOnFilter] = useState<string>("");
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [searchInput, setSearchInput] = useState("");

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    if (typeof searchedKey === "object" && Object.keys(searchedKey)?.length > 0) {
      handleApplyFilter(searchedKey, 1, value)
      setValidationOnFilter("");
    } else if (typeof searchedKey === "string" && searchedKey?.length > 0) {
      onSearch(searchedKey, 1, value)
    } else {
      fetchKybList(1, value, tab, {});
    }
  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrent(1)
    setSelected(false)
    setSelectedUserAlias([])
    setIndex("");
    setSelectAll(false)
    if (Object.keys(searchedKey)?.length > 0) {
      handleApplyFilter(searchedKey, current, page)
      setValidationOnFilter("");
    } else if (searchedKey?.length > 0) {
      onSearch(searchedKey, current, page)
    } 
    else {
      fetchKybList(1, page, tabValue, {});
    }
  };

  const onSearch = (e: string, currentPage: number, page: number) => {
    if (e) {
      setSearchedKey(e);
      const reqBody = { key: e, typeOfEntity: "COMPANY" };
      setLoading(true)
      searchList(
        currentPage > 0 ? currentPage - 1 : 0,
        page || 10,
        "sortByAgreementId",
        "DESC",
        reqBody
      )
        .then((response: any) => {
          setLoading(false)
          setKybList(response.data.data);
          setTotalPage(response.data.lastPage * page);
          setAllCount({
            all: response.data.count,
            rejected: 0,
            verified: 0,
            pending: 0,
            hold:0,
            expired: 0
          });
        }).catch((err: any) => {
          message.error(
            err?.error ? err?.error : "Something went wrong!"
          );
        })
    } else {
      setSearchedKey('')
      fetchKybList(1, page, tab, {});
    }
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    if (typeof searchedKey === "object" && Object.keys(searchedKey)?.length > 0) {
      handleApplyFilter(searchedKey, pageno, page)
      setValidationOnFilter("");
    } else if (typeof searchedKey === "string" && searchedKey?.length > 0) {
      onSearch(searchedKey, pageno, page)
    } else {
      fetchKybList(pageno, page, tab, {});
    }
  };
  const downloadUserDetails = (index: number, status: string) => {
    let url = ""
    if (index === 0 || selectAll === true) {
      url = REACT_APP_SERVER_URL + `/api/v1/ekyc/kyb/downloadList?type=${status}&entityType=COMPANY`;
    } else if (index != 0 || selectAll === false) {
      url = REACT_APP_SERVER_URL + "/api/v1/ekyc/kyb/downloadList?id=" + selectedUserAlias;
    }
    setDownloading(true);
    downloadDetails(url)
      .then((response: any) => {
        setDownloading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'KybDetails.xlsx');
        document.body.appendChild(link);
        link.click();
      }).catch(err => {
        if (err) {
          message.error("Something went wrong! Please try again later.")
          setDownloading(false);
        }
      })
  };
  const download = (id: any) => {
    let url = "";
    url =
      REACT_APP_SERVER_URL + "/api/v1/ekyc/kyb/downloadList?id=" + id;
    downloadDetails(url)
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "KybDetails.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        if (err) {
          message.error("Something went wrong! Please try again later.");
        }
      });
  }
  const itemRender: any = (_: any, type: string, originalElement: HTMLElement) => {
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

  const columns: object[] = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: false,
      width: 200,
      render: (text: string,values:any) => (
        <div
          className={`hyperLink ${text?.length * 7 > 100 ? 'signature-overflowtext' : ''}`} 
          onClick={() => navigate(AdminKYBDetail + '/' + values?.userAlias)}
        >
          <Tooltip
            title={text?.length * 7 > 100 ? text : null}
            overlayClassName='custom-tooltip'
          >
            <span>{text || "--"}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Company name",
      dataIndex: "companyName",
      sorter: false,
      width: 230,
      render: (companyName: string) => (
        <div
          className={`${companyName?.length * 7 > 180 ? 'overflowText' : ''}`}
        >
          <Tooltip
            title={companyName?.length * 7 > 180 ? companyName : null}
            overlayClassName='custom-tooltip'
          >
            <span>{companyName || "--"}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "typeOfEntity",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return <span>{ENTITY_TYPE[text]}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Email id",
      dataIndex: "email",
      sorter: false,
      width: 250,
      render: (email: string) => {
        return <div className={` ${email?.length * 7 > 200 ? 'overflowText' : ''}`}>
          <Tooltip
            title={email?.length * 7 > 200 ? email : null}
            overlayClassName='custom-tooltip'
          >
            <span>{email}</span>
          </Tooltip>
        </div>; 
      },
    },
    {
      title: "Mobile",
      dataIndex: "contactNumber",
      sorter: false,
      width: 150
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      width: 180,
      render: (text: string) => {
        let statusClass = 'hold';
          let statusIcon = timeicon;
          if (text === 'VERIFIED') {
            statusClass = 'active';
            statusIcon = tickicon;
          } else if (text === 'PENDING') {
            statusClass = 'status-pending';
          } else if (text === 'EXPIRED') {
            statusClass = 'status-pending';
          } else if (text === 'REJECTED') {
            statusClass = 'rejected';
          } else {
            statusClass = 'hold';
          }
        return (
          <span
            className="status"
          >
           {
            <div className={`${statusClass} capitalize`}>
              <Image src={statusIcon} preview={false} />
              <span className="mx-2">{text?.toLowerCase()}</span>
            </div>
          }
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "userAlias",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return (
          <div className="d-flex">
              <Col className="mx-3">
            <Image
              src={View}
              alt="view"
              preview={false}
              className="cursor icon-default-size"
              onClick={() => { navigate(AdminKYBDetail + '/' + text) }}
            />
            </Col>
            {/* <Image
              src={Edit}
              alt="edit"
              preview={false}
              className="cursor"
              height={20}
              width={20}
            /> */}
            <Col>
            <Image
              src={Download}
              alt="download"
              preview={false}
              className="cursor icon-default-size mx-3"
              onClick={() => { download(text) }}
            />
            </Col>
          </div>
        );
      },
    },
  ];
  const rowSelection: any = {
    selectedRowKeys: selectedUserAlias,
    onChange: (selectedRowKeys: [], selectedRows: []) => {
      // setSelectedRowKeys(selectedRowKeys);
      // setSelectedRows(selectedRows);
      setSelected(selectedRows?.length > 0 ? true : false);
      if (selectedRowKeys.length < 10 && selectedRowKeys.length !== 0) {
        setSelectedUserAlias(selectedRowKeys);
      } else if (selectedRowKeys.length === 0) {
        setSelectedUserAlias([]);
        setIndex('');
      } else {
        setSelectedUserAlias(selectedRowKeys);
      }
    },
    onSelect: (_record: [], _selected: boolean, selectedRows: []) => {
      setSelected(selectedRows?.length > 0 ? true : false);
    },
    onSelectAll: (_selected: boolean, selectedRows: []) => {
      setSelected(selectedRows?.length > 0 ? true : false);
    },
  };
  const fetchKybList = (
    current: number,
    page: number,
    userType: string,
    sort: any
  ) => {
    setLoading(true)
    getKybList(
      current - 1 || 0,
      page || 10,
      userType || "ALL",
      sortedColumn?.[sort?.field] || "sortByAgreementId",
      sortingOrder?.[sort?.order] || "DESC"
    )
      .then((response) => {
        setLoading(false);
        setKybList(response.data.data);
        setTotalPage(response.data.lastPage * page);
        setAllCount({
          all: response.data.count,
          rejected: response.data.rejectedCount,
          verified: response.data.verifiedCount,
          pending: response.data.pendingCount,
          hold:response.data.holdCount,
          expired: response.data.expiredCount
        });
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later")
      });
  };
  useEffect(() => {
    fetchKybList(current, page, "all", {});
  }, []);

  
  const handleApplyFilter = (filterOptions: any, pageNo: any, limit: any) => {
    setShowFilter(false);
    if (
      (filterOptions.startDate && filterOptions.startDate?.length > 0) ||
      (filterOptions.endDate && filterOptions.endDate?.length > 0) ||
      (filterOptions.emailAddress && filterOptions.emailAddress?.length > 0) ||
      (filterOptions.customStatus && filterOptions.customStatus?.length > 0) ||
      (filterOptions.status && filterOptions.status?.length > 0)
    ) {
      setValidationOnFilter("");
      let reqbody: any = {};

      if (filterOptions) {
        reqbody = { typeOfEntity: 'COMPANY' };
      }
      if (filterOptions.customStatus !== undefined && filterOptions.customStatus !== "") {
        reqbody = { ...reqbody, status: filterOptions.customStatus }
      }
      if (filterOptions.status !== undefined && filterOptions.status !== "") {
        reqbody = { ...reqbody, status: filterOptions.status }
      }
      if ((filterOptions.startDate !== undefined && filterOptions.startDate?.length > 0) || (filterOptions.endDate !== undefined && filterOptions.endDate?.length > 0)) {
        reqbody = { ...reqbody, startDate: filterOptions.startDate, endDate: filterOptions?.endDate }
      }

      if (filterOptions.emailAddress !== undefined && filterOptions.emailAddress !== "") {
        reqbody = { ...reqbody, email: filterOptions.emailAddress.trim() }
      }

      setSearchedKey(reqbody);
      getKybVerificationFilter(reqbody, pageNo - 1 || 0, limit || 10)
        .then((response: any) => {
          setLoading(false);
          setKybList(response?.data?.data);
          setTotalPage(response?.data?.lastPage * limit);
          setAllCount({
            all: response?.data?.count,
            rejected:  response?.data?.rejectedCount,
            verified:  response?.data?.verifiedCount,
            pending: response?.data?.pendingCount,
            hold: response?.data?.holdCount,
            expired: response?.data?.expiredCount
          });

        })
    } else if (
      (!filterOptions.startDate || filterOptions.startDate?.length === 0) &&
      (!filterOptions.endDate || filterOptions.endDate?.length === 0) &&
      (!filterOptions.emailAddress || filterOptions.emailAddress?.length === 0) &&
      (!filterOptions.customStatus || filterOptions.customStatus?.length === 0)
    ) {
      setValidationOnFilter("Selected filter is blank or invalid!");
    }
  };

  const handleResetAllClick = () => {
    setSearchInput("");
    setSearchedKey(""); 
    setCurrent(1);
    setPage(10);
    fetchKybList(1, 10, "all", {});
  }

  useEffect(() => {
    fetchKybList(current, page, "all", {});
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);

  return (
    <div className="fullHeight m-main-body-section scrollbar-container">
      <DefaultLayout
        page="kyb_management"
        // loading={loading}
        TitleText="KYB Management"
        TitleImage={Kybimage}
        headerPage={
          <div className="d-flex">
            <Image src={Kybimage} preview={false} className="mt-2" alt="kybimage" />
            <div className="ml-5">
              <b> KYB management</b>
              <Breadcrumb separator=">">
                {/* <Breadcrumb.Item
                  onClick={() => {
                    navigate(Dashboard);
                  }}
                >
                  Dashboard
                </Breadcrumb.Item> */}
                <Breadcrumb.Item>Management</Breadcrumb.Item>
                <Breadcrumb.Item>KYB management</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
      <Card className="noBorder transparent kyc-table-list-card-wrap escrow-tran-card">
        <div className={Width > 767 ? "w-100 endtoend kyc-bottom-header mb-4" : "w-100 endtoend flex-column-reverse gap-2"}>         
          {(typeof searchedKey === 'object' || searchedKey == '' )? (
            <div className={Width > 767 ? "d-block dashboardTabs w-100" : "d-block dashboardTabs justify-content-between w-100"}>
            <Tabs
              defaultActiveKey="all"
              className="d-none-res tableTab"
              onChange={onTabChange}
            >
              <TabPane
                tab={`All (${allCount?.all})`}
                key="all"
              ></TabPane>
              <TabPane
                tab={`Rejected (${allCount?.rejected})`}
                key="rejected"
              ></TabPane>
              <TabPane
                tab={`Verified (${allCount?.verified})`}
                key="verified"
              ></TabPane>
              <TabPane
                tab={`Pending (${allCount?.pending})`}
                key="pending"
              ></TabPane>
              <TabPane
                tab={`Hold (${allCount?.hold})`}
                key="hold"
              ></TabPane>
              <TabPane
                tab={`Expired (${allCount?.expired})`}
                key="expired"
              ></TabPane>
            </Tabs>
          </div>
          ) : <div></div>}
          <div className="d-flex search-blocks inputFilter justify-content-between">
              <div className="d-flex w-100">
                <Input
                  className="search-input-additem"
                  placeholder="Search"
                  value={searchInput}
                  prefix={
                    <Image src={Search} alt="search" preview={false} />
                  }
                  onInput={(e: any) => {
                    const val = e.target.value;
                    setSearchInput(val);
                    onSearch(val, 1, page);
                  }}
                />
              </div>
              <div className="d-flex buttons-filter">
              {!showFilter ? (
                <>
                  <Button
                    className="filterbutton"
                    onClick={() => setShowFilter(!showFilter)}
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
                </>
              ) : (
                <Button className="filterbutton_selected text-center">
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
              {Width > 475 ?
                <Button
                  className="downloadBtn mt-0"
                  hidden={selected ? false : true}
                  loading={downloading}
                  onClick={() => { downloadUserDetails(index, tab.toUpperCase()) }}
                >
                  {!downloading ? <span className=" d-flex py-1 center">
                    <Image
                      src={Download_Blue}
                      alt="dowload"
                      className="px-2"
                      height={20}
                      width={35}
                      preview={false}
                    />
                    Download All
                  </span> : ""}
                </Button>
                :""}
                </div>
                {Width < 476 ?
                <Button
                  className="downloadBtn mt-0"
                  hidden={selected ? false : true}
                  loading={downloading}
                  onClick={() => { downloadUserDetails(index, tab.toUpperCase()) }}
                >
                  {!downloading ? <span className=" d-flex py-1 center">
                    <Image
                      src={Download_Blue}
                      alt="dowload"
                      className="px-2"
                      height={20}
                      width={35}
                      preview={false}
                    />
                    Download All
                  </span> : ""}
                </Button>
              :""}
          </div>
        </div>
          {showFilter && (
            <FilterCard handleApplyFilter={(e) => { handleApplyFilter(e, 1, 10) }}
              setLoading={setLoading}
              fetchKybList={fetchKybList}
              filterType={FilterType.KYB}
              setSearchedKey={setSearchedKey}
              setCurrent={setCurrent}
              setPage={setPage}
            />
          )}
          {validationOnFilter ? <p className="text-danger">{validationOnFilter}</p> : ""}
        <div className="custome-table-wrapper">
          <Table
            columns={columns}
            dataSource={KybList}
            loading={loading}
            pagination={pagination}
            className="mt-3"
            scroll={{ x: 400 }}
            rowSelection={rowSelection}
            rowKey={(record: any) => {
              return record.userAlias;
            }}
            onHeaderRow={(_columns, index) => {
              return {
                onClick: () => {
                  setIndex(index);
                },
              };
            }}
          />
        </div>
          <div className="mobile-view-listing">
            {KybList && KybList?.length > 0 && (
              <KybKycMobileResponsiveCard KybList={KybList} download={download} setSelected={setSelected} selectedUserAlias={selectedUserAlias} setSelectedUserAlias={setSelectedUserAlias} selectAll={selectAll} setSelectAll={setSelectAll} />
            )}
          </div>
          {KybList?.length > 0 ? (
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
                    )}      </Card>
    </DefaultLayout>
    </div >
  );
};


export default KYBManagementList;
