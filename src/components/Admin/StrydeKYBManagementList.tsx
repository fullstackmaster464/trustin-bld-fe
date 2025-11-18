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
import Kybimage from "../../assets/img/Headers/KYB_management.svg";
import View from "../../assets/img/view.svg";
// import Download from "../../assets/img/download.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import timeicon from "../../assets/img/time_icon.svg";
import tickicon from "../../assets/img/tick_icon.svg";
import { StrydeKYBDetails } from "../Common/RouteConst";
// import Download_Blue from "../../assets/img/download_blue.svg";
import Search from "../../assets/img/search.svg";
import { ENTITY_TYPE, FilterType, getLocalStorage } from "../Common/Constants";
import moment from "moment";
import { downloadDetails, getStrydeListByEntityType,  syncStrydeDetails } from "../../services/admin";
import DefaultLayout from "../Common/DefaultLayout";
import KybKycMobileResponsiveCard from "./KybKycMobileResponsiveCard";
import filterIcon from "../../assets/img/filter.svg";
import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import FilterCard from "./FilterCard";
import emptyCard from "../../assets/img/emptyCard.svg";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import AWSS3ConfigModal from "../Models/AWSS3ConfigModal";

const StrydeKYBManagementList = (): any => {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [selectedUserAlias, setSelectedUserAlias] = useState([]);
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  // const [selected, setSelected] = useState(false);
  // const [index, setIndex] = useState<any>();
  const [selectAll, setSelectAll] = useState(false);
  const [allCount, setAllCount] = useState({
    all: 0,
    rejected: 0,
    verified: 0,
    pending: 0,
    hold: 0
  });
  const [totalPage, setTotalPage] = useState(0);
  const [KybList, setKybList] = useState([]);
  const [tab, setTab] = useState("all");
  // const [downloading, setDownloading] = useState(false)
  const [searchedKey, setSearchedKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [validationOnFilter, setValidationOnFilter] = useState<string>("");
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const typeOfEntity = "COMPANY";
  const [searchInput, setSearchInput] = useState("");

  const setWidthVal = () => {
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
      fetchKybList(typeOfEntity, 1, value, tab, "", "", "");
    }
  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrent(1)
    // setSelected(false)
    setSelectedUserAlias([])
    // setIndex("");
    setSelectAll(false)
    if (Object.keys(searchedKey)?.length > 0) {
      handleApplyFilter(searchedKey, current, page)
      setValidationOnFilter("");
    } else if (searchedKey?.length > 0) {
      onSearch(searchedKey, current, page)
    }
    else {
      fetchKybList(typeOfEntity,1, page, tabValue, "", "", "");
    }
  };

  const onSearch = (e: string, currentPage: number, page: number) => {
    console.log('onSearch----------->>>e: ',e);
    console.log('onSearch----------->>>currentPage: ',currentPage);
    console.log('onSearch----------->>>page: ',page);
    if (e) {
      setSearchedKey(e);
      setLoading(true)
      fetchKybList(typeOfEntity, currentPage > 0 ? currentPage : 1,  page || 10, "ALL", "", "", e);
    } else {
      setSearchedKey('')
      fetchKybList(typeOfEntity,1, 10, tab, "", "", "");
    }
  };
  const onChangePage = (pageno = 1) => {
    setCurrent(pageno);
    console.log('onChangePage----------->>>pageno: ',pageno);
    console.log('onChangePage----------->>>page: ',page);
    console.log('onChangePage----------->>>tab: ',tab);
    console.log('onChangePage----------->>>searchedKey: ',searchedKey);
    if (typeof searchedKey === 'string' && searchedKey?.length > 0) {
      onSearch(searchedKey, pageno, page)
    } else if (typeof searchedKey === "object" && Object.keys(searchedKey)?.length > 0) {
      console.log('onChange------->>in if')
      handleApplyFilter(searchedKey, pageno, page)
      setValidationOnFilter("");
    } else {
      // fetchKybList(typeOfEntity,1, 10, tab, "", "", "");
      fetchKybList(typeOfEntity,pageno, page, tab, "", "", "");
    }
  };
  // const downloadUserDetails = (index: number, status: string) => {
  //   let url = ""
  //   if (index === 0 || selectAll === true) {
  //     url = REACT_APP_SERVER_URL + `/api/v1/ekyc/kyb/downloadList?type=${status}&entityType=COMPANY`;
  //   } else if (index != 0 || selectAll === false) {
  //     url = REACT_APP_SERVER_URL + "/api/v1/ekyc/kyb/downloadList?id=" + selectedUserAlias;
  //   }
  //   setDownloading(true);
  //   downloadDetails(url)
  //     .then((response: any) => {
  //       setDownloading(false);
  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', 'KybDetails.xlsx');
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

//   {
//     "createAt": "2024-11-20T11:15:02.459Z",
//     "aliasName": "2eb5b1d8-abaa-4105-a1d6-4a78081bb1d9",
//     "entityType": "COMPANY",
//     "businessName": "Red Inc",
//     "email": "red@yopmail.com",
//     "contactNumber": "9876543210",
//     "repName": "Aaron Davis",
//     "verificationStatus": null
// }
  const columns: object[] = [
    {
      title: "Name",
      dataIndex: "repName",
      sorter: false,
      width: 200,
      render: (text: string, values: any) => (
        <div
          className={`hyperLink ${text?.length * 7 > 100 ? 'signature-overflowtext' : ''}`}
          onClick={() => navigate(StrydeKYBDetails + '/' + values?.aliasName)}
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
      dataIndex: "businessName",
      sorter: false,
      width: 230,
      render: (businessName: string) => (
        <div
          className={`${businessName?.length * 7 > 180 ? 'overflowText' : ''}`}
        >
          <Tooltip
            title={businessName?.length * 7 > 180 ? businessName : null}
            overlayClassName='custom-tooltip'
          >
            <span>{businessName}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "entityType",
      dataIndex: "entityType",
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
                onClick={() => { navigate(StrydeKYBDetails + '/' + text) }}
              />
            </Col>
            {/* <Col>
              <Image
                src={Download}
                alt="download"
                preview={false}
                className="cursor icon-default-size mx-3"
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
  // const fetchKybList = (
  //   current: number,
  //   page: number,
  //   userType: string,
  //   sort: any
  // ) => {
  //   setLoading(true)
  //   getKybList(
  //     current - 1 || 0,
  //     page || 10,
  //     userType || "ALL",
  //     sortedColumn?.[sort?.field] || "sortByAgreementId",
  //     sortingOrder?.[sort?.order] || "DESC"
  //   )
  //     .then((response) => {
  //       setLoading(false);
  //       setKybList(response.data.data);
  //       setTotalPage(response.data.lastPage * page);
  //       setAllCount({
  //         all: response.data.count,
  //         rejected: response.data.rejectedCount,
  //         verified: response.data.verifiedCount,
  //         pending: response.data.pendingCount,
  //         hold: response.data.holdCount
  //       });
  //     })
  //     .catch(() => {
  //       message.error("Could not fetch details. Please try again later")
  //     });
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
      typeOfEntity || 'COMPANY',
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
    fetchKybList(typeOfEntity,current, page, "ALL", "", "", "");
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
      
      fetchKybList(typeOfEntity, pageNo || 1, limit || 10, reqbody?.status, reqbody.startDate, reqbody.endDate, reqbody.email);
      setSearchedKey(reqbody);
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
    fetchKybList(typeOfEntity,1, 10,"ALL","", "", "");
  }

  useEffect(() => {
    fetchKybList(typeOfEntity,current, page,"ALL","", "", "");
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

  const handleSubmit = async(values: any) => {
    await syncStrydeDetails(values).then(() => {
      setIsModalVisible(false);
      fetchKybList(typeOfEntity,current, page,"ALL","", "", "");
    }).catch((error:any) => {
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
        page="stryde_kyb_management"
        // loading={loading}
        TitleText="Stryde KYB Management"
        TitleImage={Kybimage}
        headerPage={
          <div className="d-flex">
            <Image src={Kybimage} preview={false} className="mt-2" alt="kybimage" />
            <div className="ml-5">
              <b>Stryde KYB management</b>
              <Breadcrumb separator=">">
                {/* <Breadcrumb.Item
                  onClick={() => {
                    navigate(Dashboard);
                  }}
                >
                  Dashboard
                </Breadcrumb.Item> */}
                <Breadcrumb.Item>Management</Breadcrumb.Item>
                <Breadcrumb.Item>Stryde KYB management</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
        <Card className="noBorder transparent kyc-table-list-card-wrap escrow-tran-card">
          <div className={Width > 1350 ? "w-100 endtoend kyc-bottom-header mb-4" : "w-100 endtoend flex-column-reverse gap-2 mt-3"}>
            {(typeof searchedKey === 'object' || searchedKey == '') ? (
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
                    tab={`Verified (${allCount?.verified})`}
                    key="VERIFIED"
                  ></TabPane>
                  <TabPane
                    tab={`Pending (${allCount?.pending})`}
                    key="PENDING"
                  ></TabPane>
                  <TabPane
                    tab={`Hold (${allCount?.hold})`}
                    key="HOLD"
                  ></TabPane>
                </Tabs>
              </div>
            ) : <div></div>}
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
              filterType={FilterType.KYB}
              setSearchedKey={setSearchedKey}
              type={"strydeKyb"}
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
              // rowSelection={rowSelection}
              locale={locale.allLocale}
              rowKey={(record: any) => {
                return record.aliasName;
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
            <KybKycMobileResponsiveCard KybList={KybList} download={download} setSelected={false} selectedUserAlias={selectedUserAlias} setSelectedUserAlias={setSelectedUserAlias} selectAll={selectAll} setSelectAll={setSelectAll} type={"strydeKyb"}/>
            ) :
            <div className="itemTypes-mobile-view text-center">
              {loading ? (
               <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "60vh" }}>
                <Spin size="large" className="mainloader" />
              </div>
              ) : (
                locale.allLocale.emptyText
              )}
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
          )}      </Card>
      </DefaultLayout>
      {/* AWS S3 Configuration */}
      <AWSS3ConfigModal
        visible={isModalVisible}
        onCancel={handleCancelModal}
        onSubmit={handleSubmit}
      />
    </div >
  );
};


export default StrydeKYBManagementList;
