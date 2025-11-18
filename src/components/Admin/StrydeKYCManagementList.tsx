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
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import KYCImage from "../../assets/img/Headers/KYC_management.svg";
import View from "../../assets/img/view.svg";
// import Download from "../../assets/img/download.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import timeicon from "../../assets/img/time_icon.svg";
import tickicon from "../../assets/img/tick_icon.svg";
import {  StrydeKYCDetails } from "../Common/RouteConst";
// import Download_Blue from "../../assets/img/download_blue.svg";
import Search from "../../assets/img/search.svg";
import { ENTITY_TYPE, FilterType, getLocalStorage, } from "../Common/Constants";
import moment from "moment";
import { downloadDetails, getStrydeListByEntityType, syncStrydeDetails } from "../../services/admin";
import emptyCard from "../../assets/img/emptyCard.svg";
import DefaultLayout from "../Common/DefaultLayout";
import KybKycMobileResponsiveCard from "./KybKycMobileResponsiveCard";
import filterIcon from "../../assets/img/filter.svg";
import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import FilterCard from "./FilterCard";
import AWSS3ConfigModal from "../Models/AWSS3ConfigModal";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";

const StrydeKYCManagementList = (): any => {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL || '';
  if (!REACT_APP_SERVER_URL) {
    console.error('REACT_APP_SERVER_URL environment variable is not set');
  }
  const navigate = useNavigate();
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  // const [selected, setSelected] = useState(false);
  const [selectedUserAlias, setSelectedUserAlias] = useState([]);
  // const [index, setIndex] = useState<any>();
  const [allCount, setAllCount] = useState({
    all: 0,
    rejected: 0,
    verified: 0,
    pending: 0,
    hold: 0
  });
  const [totalPage, setTotalPage] = useState(0);
  const [KybList, setKybList] = useState<any>([]);
  const [tab, setTab] = useState("ALL");
  // const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [searchedKey, setSearchedKey] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const typeOfEntity = "INDIVIDUAL";
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [validationOnFilter, setValidationOnFilter] = useState<string>("");
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [searchInput, setSearchInput] = useState("");

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  }
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1)
    if (typeof searchedKey === "object" && Object.keys(searchedKey)?.length > 0) {
      handleApplyFilter(searchedKey, 1, value)
      setValidationOnFilter("");
    } else if (typeof searchedKey === "string" && searchedKey?.length > 0) {
      onSearch(searchedKey, 1, value)
    } else {
      fetchKybList(typeOfEntity,1, value, tab, "", "", "");
    }

  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrent(1)
    // setSelected(false)
    setSelectedUserAlias([])
    setSelectAll(false)
    // setIndex('')
    if (Object.keys(searchedKey)?.length > 0) {
      handleApplyFilter(searchedKey, current, page)
      setValidationOnFilter("");
    } else if (searchedKey?.length > 0) {
      onSearch(searchedKey, current, page)
    } else {
      fetchKybList(typeOfEntity,1, page, tabValue, "", "", "");
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
      fetchKybList(typeOfEntity,pageno, page, tab, "", "", "");
    }
  };
  // const downloadUserDetails = (index: number, status: string) => {
  //   let url = ""
  //   if (index === 0 || selectAll === true) {
  //     url = REACT_APP_SERVER_URL + `/api/v1/ekyc/kyb/downloadList?type=${status}&entityType=INDIVIDUAL`;
  //   } else if (index != 0 || selectAll === false) {
  //     setDownloading(true);
  //     url = REACT_APP_SERVER_URL + "/api/v1/ekyc/kyb/downloadList?id=" + selectedUserAlias;
  //   }
  //   setDownloading(true);

  //   downloadDetails(url)
  //     .then((response: any) => {
  //       if (!response.data || response.data.size === 0) {
  //         throw new Error('Empty response received for download');
  //       }
  //       setDownloading(false);
  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', 'KycDetails.xlsx');
  //       document.body.appendChild(link);
  //       link.click();
  //     }).catch(err => {
  //       if (err) {
  //         message.error("Something went wrong! Please try again later.")
  //         setDownloading(false);
  //       }
  //     })
  // };

  const locale = {
    allLocale: {
      emptyText: (
     <>
       <div className="nodataCard text-center px-5">
          <Image src={emptyCard} preview={false} className="mt-5" />
          <p className="nodata py-5">No Data Found</p>
        </div>
      </> 
      ),
    },
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
        link.setAttribute("download", "KycDetails.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.error('Download failed:', err);
        message.error(err?.data?.message || "Failed to download. Please try again later.");
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
      dataIndex: "repName",
      sorter: false,
      width: 200,
      render: (text: any, values: any) => {
        return <div
          className={`hyperLink ${text?.length * 7 > 100 ? 'signature-overflowtext' : ''}`}
          onClick={() => {
            navigate(StrydeKYCDetails + '/' + values?.aliasName)
          }}>
          <Tooltip
            title={text?.length * 7 > 100 ? text : null}
            overlayClassName='custom-tooltip'
          >
            <span>{text || "--"}</span>
          </Tooltip>
        </div>
      }
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
      render: (email: string) => (
        <div className={` ${email?.length * 7 > 200 ? 'overflowText' : ''}`}>
          <Tooltip
            title={email?.length * 7 > 200 ? email : null}
            overlayClassName='custom-tooltip'
          >
            <span>{email}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Contact number",
      dataIndex: "contactNumber",
      sorter: false,
      width: 200
    },
    {
      title: "Entity type",
      dataIndex: "entityType",
      sorter: false,
      render: (text: string) => {
        return <span>{ENTITY_TYPE[text]}</span>;
      },
      width: 150
    },
    {
      title: "Status",
      dataIndex: "verificationStatus",
      sorter: false,
      width: 180,
      render: (text: string) => {
        return (
          <span
            className="status"
          >
            {text === "VERIFIED" ? (
              <div className="active capitalize">
                <Image src={tickicon} preview={false} />
                <span className="mx-2">{text?.toLowerCase()}</span>
              </div>
            )
              : text === "PENDING" ? (
                <div className="status-pending capitalize">
                  <Image src={timeicon} preview={false} />
                  <span className="mx-2">{text?.toLowerCase()}</span>
                </div>
              ) : text === "REJECTED" ?
                (
                  <div className="rejected capitalize">
                    <Image src={timeicon} preview={false} />
                    <span className="mx-2">{text?.toLowerCase()}</span>
                  </div>
                ) :
                (
                  <div className="hold capitalize">
                    <Image src={timeicon} preview={false} />
                    <span className="mx-2">{text?.toLowerCase()}</span>
                  </div>
                )
            }
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "aliasName",
      sorter: false,
      width: 100,
      render: (text: string) => {
        return (
          <div className="d-flex">
            <Col className="mx-0">
              <Image
                src={View}
                alt="view"
                preview={false}
                className="cursor icon-default-size"
                onClick={() => { navigate(StrydeKYCDetails + '/' + text) }}
              />
            </Col>
            {/* <Col>
              <Image
                src={Download}
                alt="download"
                preview={false}
                className="cursor mx-3 icon-default-size"
                onClick={() => { download(text) }}
              />
            </Col> */}
          </div>
        );
      },
    },
  ];
  // const rowSelection: any = {
  //   selectedRowKeys: selectedUserAlias,
  //   onChange: (selectedRowKeys: [], selectedRows: []) => {
  //     // setSelectedRowKeys(selectedRowKeys);
  //     // setSelectedRows(selectedRows);
  //     setSelected(selectedRows?.length > 0 ? true : false);
  //     if (selectedRowKeys.length < 10 && selectedRowKeys.length !== 0) {
  //       setSelectedUserAlias(selectedRowKeys);
  //     } else if (selectedRowKeys.length === 0) {
  //       setSelectedUserAlias([]);
  //       setIndex('');
  //     } else {
  //       setSelectedUserAlias(selectedRowKeys);
  //     }
  //   },
  //   onSelect: (_record: [], _selected: boolean, selectedRows: []) => {
  //     setSelected(selectedRows?.length > 0 ? true : false);
  //   },
  //   onSelectAll: (_selected: boolean, selectedRows: []) => {
  //     setSelected(selectedRows?.length > 0 ? true : false);
  //   },
  // };
  const fetchKybList = (
    typeOfEntity: any,
    current: number,
    page: number,
    status:string,
    startDate: string,
    endDate: string,
    search: any
  ) => {
    setLoading(true)
    getStrydeListByEntityType(
      typeOfEntity || 'INDIVIDUAL',
      current || 1,
      page || 10,
      status || "ALL",
      startDate,
      endDate,
      search
    ).then((response) => {
      setLoading(false);
      setKybList(response.data.data);
      setTotalPage(response.data.lastPage * page);
      setAllCount({
        all: response.data.count,
        rejected: response.data.rejectedCount,
        verified: response.data.verifiedCount,
        pending: response.data.pendingCount,
        hold: response.data.holdCount
      });
    })
      .catch(() => {
        setLoading(false)
        message.error("Could not fetch details. Please try again later")
      });
    
  };
  useEffect(() => {
    fetchKybList(typeOfEntity,current, page, "ALL","", "", "");
  }, []);
  const onSearch = (e: string, currentPage: number, page: number) => {
    if (e) {
      setLoading(true);
      setSearchedKey(e);
      fetchKybList(typeOfEntity, currentPage > 0 ? currentPage : 1,  page || 10, "ALL", "", "", e);
    } else {
      setSearchedKey('')
      fetchKybList(typeOfEntity,1, 10, tab, "", "", "");
    }
  }

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
      fetchKybList(typeOfEntity, pageNo || 1, limit || 10, reqbody?.status, reqbody.startDate, reqbody.endDate, reqbody.email);
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
    fetchKybList(typeOfEntity,1, 10, "ALL","", "", "");
  }

  useEffect(() => {
    fetchKybList(typeOfEntity,current, page, "ALL","", "", "");
    window.addEventListener('resize', () => {
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    // values["entityType"] = "INDIVIDUAL";
    await syncStrydeDetails(values).then(() => {
      setIsModalVisible(false);
      fetchKybList(typeOfEntity,current, page, "ALL", "", "", "");
    }).catch((error: any) => {
      if (error?.data?.statusCode === 409) {
        message.error(error?.data?.error?.message)
      } else {
        message.error("Could not fetch details. Please try again later.")
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div className="fullHeight m-main-body-section scrollbar-container">
      <DefaultLayout
        page="stryde_kyc_management"
        // loading={loading}
        TitleText="Stryde KYC Management"
        TitleImage={KYCImage}
        headerPage={
          <div className="d-flex">
            <Image src={KYCImage} preview={false} className="mt-2" alt="kybimage" />
            <div className="ml-5">
              <b>Stryde management</b>
              <Breadcrumb separator=">">
                {/* <Breadcrumb.Item
                    onClick={() => {
                      navigate(Dashboard);
                    }}
                  >
                    Dashboard
                  </Breadcrumb.Item> */}
                <Breadcrumb.Item>Management</Breadcrumb.Item>
                <Breadcrumb.Item>Stryde KYC management</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
        <Card className="noBorder transparent kyc-table-list-card-wrap escrow-tran-card">
          <div className={Width > 1330 ? "w-100 endtoend kyc-bottom-header mb-4" : "w-100 endtoend flex-column-reverse gap-2"}>
            {(typeof searchedKey === 'object' || searchedKey == '') ?
              <div className={Width > 1330 ? "d-block disputeTabs w-100 scrollAble" : "d-block disputeTabs w-100 scrollAble mt-2"}>
                <Tabs
                  defaultActiveKey="ALL"
                  className="d-none-res tableTab"
                  onChange={onTabChange}
                >
                  <TabPane
                    tab={`All (${allCount?.all})`}
                    key="ALL"
                  ></TabPane>
                  <TabPane
                    tab={`Rejected (${allCount?.rejected})`}
                    key="REJECTED"
                  ></TabPane>
                  <TabPane
                    tab={`Pending (${allCount?.pending})`}
                    key="PENDING"
                  ></TabPane>
                  <TabPane
                    tab={`Verified (${allCount?.verified})`}
                    key="VERIFIED"
                  ></TabPane>
                  <TabPane
                    tab={`Hold (${allCount?.hold})`}
                    key="HOLD"
                  ></TabPane>
                </Tabs>
              </div> :
              <div></div>
            }
            <div className="d-flex search-blocks inputFilter justify-content-between">
              <div className={userType === "SUPPORT_ENGINEER" ? "d-none":"d-flex w-100"}>
                <SecondaryOutLineButton
                  children="AWS S3 Configuration"
                  className="w-auto"
                  onClick={() => { handleOpenModal(); }}
                />
              </div>
              <div className="d-flex w-100">
                <Input
                  className="stryde-input-search"
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
                {/* {Width > 475 ?
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
                  : ""} */}
              </div>
              {/* {Width < 476 ?
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
                : ""} */}
            </div>
          </div>
          {showFilter && (
            <FilterCard handleApplyFilter={(e) => { handleApplyFilter(e, 1, 10) }}
              setLoading={setLoading}
              fetchKybList={fetchKybList}
              filterType={FilterType.KYC}
              setSearchedKey={setSearchedKey}
              type={"strydeKyc"}
              setCurrent={setCurrent}
              setPage={setPage}
            />
          )}
          {validationOnFilter ? <p className="text-danger">{validationOnFilter}</p> : ""}
          <div className="custome-table-wrapper">
            <Table
              columns={columns}
              dataSource={KybList}
              pagination={pagination}
              loading={loading}
              className="mt-3"
              scroll={{ x: 400 }}
              locale={locale.allLocale}
              // rowSelection={rowSelection}
              rowKey={(record: any) => {
                return record.userAlias;
              }}
              onHeaderRow={(_columns) => {
                return {
                  onClick: () => {
                    // setIndex(index);
                  },
                };
              }}
            />
          </div>
          <div className="mobile-view-listing">
            {KybList && KybList?.length > 0 ? (
              <KybKycMobileResponsiveCard KybList={KybList} download={download} setSelected={false} selectedUserAlias={selectedUserAlias} setSelectedUserAlias={setSelectedUserAlias} selectAll={selectAll} setSelectAll={setSelectAll} type={"strydeKyc"}/>
             ) : 
               <div className="itemTypes-mobile-view text-center">
                {loading ? (
                   <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "60vh" }}>
                    <Spin size="large" className="mainloader" />
                    </div>
                  ) : (
                 locale.allLocale.emptyText )}
               </div>
               }
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
              <div className="right" style={{ textAlign: 'center' }}>
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
      {/* AWS S3 Configuration */}
      <AWSS3ConfigModal
        visible={isModalVisible}
        onCancel={handleCancelModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};


export default StrydeKYCManagementList;
