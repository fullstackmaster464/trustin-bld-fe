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
    Spin
  } from "antd";
import { useNavigate } from "react-router-dom";
import KYCImage from "../../assets/img/Headers/KYC_management.svg";
import View from "../../assets/img/view.svg";
import { useEffect, useState } from "react";
import timeicon from "../../assets/img/time_icon.svg";
import tickicon from "../../assets/img/tick_icon.svg";
import {  Dashboard, SelllerManagementDetails } from "../Common/RouteConst";
import Download_Blue from "../../assets/img/download_blue.svg";
import Search from "../../assets/img/search.svg";
import { getSellersList } from "../../services/cheque";
import emptyCard from "../../assets/img/emptyCard.svg";
import { ENTITY_TYPE, FilterType } from "../Common/Constants";
import moment from "moment";
import { downloadDetails } from "../../services/admin";
import DefaultLayout from "../Common/DefaultLayout";

import filterIcon from "../../assets/img/filter.svg";
import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";

import KybKycMobileResponsiveCard from "../Admin/KybKycMobileResponsiveCard";
import FilterCard, { FilterOptions } from "../Admin/FilterCard";
import TabPane from "antd/lib/tabs/TabPane";
import { useDebounce } from "./hook";
  
  const SellerManagementList = ():any => {
    const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [selected, setSelected] = useState(false);
    const [selectedUserAlias, setSelectedUserAlias] = useState([]);
    const [index, setIndex] = useState<any>();
    
    const [totalPage, setTotalPage] = useState(0);
    const [KybList, setKybList] = useState<any>([]);
    const [tab, setTab] = useState("ALL");
    const [downloading, setDownloading] = useState(false)
    const [loading, setLoading] = useState(false);
    // const [searchedKey, setSearchedKey] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [validationOnFilter, setValidationOnFilter] = useState<string>("");
    const [Width, setWidth] = useState(document?.body?.clientWidth)
    const [searchedKey, setSearchedKey] = useState<string | FilterOptions | any>("");

    const [allCount, setAllCount] = useState({
      all: 0,
      rejected: 0,
      verified: 0,
      pending: 0,
      hold:0,
      expired: 0
    });
    
    

    const setWidthVal = () =>{
      setWidth(document.body.clientWidth);
    }
    // const handleChange = (value: number) => {
    //   setPageSize(value);
    //   setCurrent(1)
    //   if (Object.keys(searchedKey)?.length > 0) {
    //     setValidationOnFilter("");
    //   }else if(searchedKey?.length> 0) {
    //     onSearch(searchedKey)
    //   }else{
    //     fetchSellerVerificationList({
    //       page: current - 1,
    //       limit: value,
    //       status: tab,
    //     });
    //   }
    // };
    
    const debouncedSearch = useDebounce((search: string) => {
      if (search) {
        setLoading(true);
        setSearchedKey(search);
        fetchSellerVerificationList({
          page: current - 1,
          limit: pageSize,
          status: 'ALL',
          search: search
        });
      } else {
        setSearchedKey('')
        fetchSellerVerificationList({
          page: current - 1,
          limit: pageSize,
          status: tab
        });
      }
    }, 500)
    
    // const onTabChange = (tabValue: string) => {
    //   setTab(tabValue);
    //   setCurrent(1)
    //   setSelected(false)
    //   setSelectedUserAlias([])
    //   setSelectAll(false)
    //   setIndex('')
    //   if (typeof searchedKey === 'object' && Object.keys(searchedKey)?.length > 0) {
    //     // handleApplyFilter(searchedKey, current, pageSize)
    //     setValidationOnFilter("");
    //   } else if (typeof searchedKey === 'string' &&  searchedKey?.length > 0) {
    //     onSearch(searchedKey)
    //   } else {
    //     fetchSellerVerificationList({
    //       page: current - 1,
    //       limit: pageSize,
    //       status: tabValue,
    //     });
    //   }
    // };  
    // const onChangePage = (pageno: number) => {
    //   setCurrent(pageno);
    //   if (typeof searchedKey === 'object' &&  Object.keys(searchedKey)?.length > 0) {
    //     // handleApplyFilter(searchedKey, pageno, pageSize)
    //     setValidationOnFilter("");
    //   } else if (typeof searchedKey === 'string' &&  searchedKey?.length > 0) {
    //     onSearch(searchedKey)
    //   } else {
    //     fetchSellerVerificationList({
    //       page: pageno,
    //       limit: pageSize,
    //       status: tab,
    //     });
    //   }
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

    const downloadUserDetails = (index: number, status:string) => {    
      let url = ""
      if (index === 0 || selectAll === true) {
        url = REACT_APP_SERVER_URL + `/api/v1/ekyc/kyb/downloadList?type=${status}&entityType=COMPANY`;
      } else if (index != 0 || selectAll === false) {
        setDownloading(true);
        url = REACT_APP_SERVER_URL + "/api/v1/ekyc/kyb/downloadList?id="+ selectedUserAlias;
      }
      setDownloading(true);
      
      downloadDetails(url)
        .then((response:any) => {
          setDownloading(false);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'KycDetails.xlsx');
          document.body.appendChild(link);
          link.click();
        }).catch(err =>{
          if(err){
            message.error("Something went wrong! Please try again later.")
            setDownloading(false);
          }
        })
    };
    const download = (id:any)=>{
      let url = "";
      url =
      REACT_APP_SERVER_URL + "/api/v1/ekyc/kyb/downloadList?id=" +id;
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
          if (err) {
            message.error("Something went wrong! Please try again later.");
          }
        });
    }
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
      pageSize: pageSize,
      current: current,
      style: { display: "none" },
    };
  
    const columns: object[] = [
      {
        title: "Name",
        dataIndex: "name",
        sorter: false,
        width:200,
        render: (text:any,record: { userAlias: string }) =>{    
          return <div 
          className={`hyperLink ${text?.length * 7 > 100 ? 'signature-overflowtext' : ''}`} 
          onClick={() => {
            navigate(SelllerManagementDetails + "/" + record.userAlias);
          }}>
            <Tooltip
            title={text?.length * 7 > 100 ? text : null}
            overlayClassName='custom-tooltip'
          >
            <span>{text}</span>
          </Tooltip>
          </div>
        }
      },

      {
        title: "Date",
        dataIndex: "createAt",
        sorter: false,
        width:150,
        render: (text: string) => {
          return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
        },
      },
      {
        title: "Email id",
        dataIndex: "email",
        sorter: false,
        width:250,
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
        title: "Entity type",
        dataIndex: "typeOfEntity",
        sorter: false,
        render: (text: string) => {
          {console.log("text",text)
          }
          return <span>{ENTITY_TYPE[text]}</span>;
        },
        width:150
      },
      {
        title: "Status",
        dataIndex: "kybStatus",
        sorter: false,
        width:180,
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
            ):text === "REJECTED" ? 
              (
                <div className="rejected capitalize">
                    <Image src={timeicon} preview={false} />
                    <span className="mx-2">{text?.toLowerCase()}</span>
                </div>
            ):text === "EXPIRED" ? 
              (
                <div className="rejected capitalize">
                    <Image src={timeicon} preview={false} />
                    <span className="mx-2">{text?.toLowerCase()}</span>
                </div>
            ):
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
        dataIndex: "userAlias",
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
                onClick={()=>{ 
                  navigate(SelllerManagementDetails + '/' + text) 
              }}
              />
              </Col>
            </div>
          );
        },
      },
    ];
    const rowSelection:any = {
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

    const fetchSellerVerificationList = (options: {
      limit?: number,
      page?: number,
      status?: string,
      startDate?: string,
      endDate?: string,
      email?: string,
      search?: string,
    }) => {
      setLoading(true)
      getSellersList(options)
        .then((response) => {
          setLoading(false);
          const { data } = response;
          const { count, rejectedCount, verifiedCount, pendingCount, holdCount, expiredCount } = data;
          setKybList(data.data);
          setAllCount({
            all: count,
            rejected: rejectedCount,
            verified: verifiedCount,
            pending: pendingCount,
            hold: holdCount,
            expired: expiredCount,
          });

          // Map of status -> total count
          const statusToCountMap: Record<string, number | undefined> = {
            PENDING: pendingCount,
            VERIFIED: verifiedCount,
            REJECTED: rejectedCount,
            HOLD: holdCount,
            EXPIRED: expiredCount,
          };
          const totalCount = options?.status ? statusToCountMap[options?.status?.toUpperCase()] ?? count : count;
          setTotalPage(totalCount);
        })
        .catch((e) => {
          setLoading(false)
          console.log('e', e)
          message.error("Could not fetch details. Please try again later")
        });
    };
    useEffect(() => {      
      fetchSellerVerificationList({
        page: 0,
        limit: 10,
        status: 'ALL'
      });
    }, []);
    const onSearch = (search: string) => {    
      if (search) {
        setSearchedKey(search)
      } else {
        setSearchedKey('')
      }
      debouncedSearch(search)
    }

    // const handleApplyFilter_old = (filterOptions: FilterOptions) => {
    //   setShowFilter(false);
    //   fetchSellerVerificationList({
    //     page: 0,
    //     limit: pageSize,
    //     status: filterOptions.customStatus,
    //     email: filterOptions.emailAddress && filterOptions.emailAddress != "" ? filterOptions.emailAddress : undefined,
    //     startDate: filterOptions.startDate?.toLocaleString(),
    //     endDate: filterOptions.endDate?.toLocaleString(),
    //   })
    //   setCurrent(1)
    // };

    const handleResetAllClick = () => {
      setSearchedKey(""); 
      setTab('ALL')
      setCurrent(1)
      setPageSize(10)
      fetchSellerVerificationList({
        page: 0,
        limit: 10,
        status: 'ALL',
      });
    }
    
    useEffect(() => {
      window.addEventListener('resize', ()=>{
        setWidthVal()
      });
      return () => window.removeEventListener('resize', setWidthVal);
    }, []);

    const handleApplyFilter = (filterOptions: FilterOptions) => {
      setSearchedKey(filterOptions);
      setCurrent(1);
      fetchData(0, pageSize, filterOptions, tab);
    };

    const fetchData = (
      page: number,
      limit: number,
      searchOrFilter: string | FilterOptions | null,
      status: string
    ) => {
      if (typeof searchOrFilter === "object" && searchOrFilter !== null && Object.keys(searchOrFilter).length > 0) {
        const options = searchOrFilter;
        fetchSellerVerificationList({
          page,
          limit,
          status: options.customStatus,
          email: options.emailAddress || undefined,
          startDate: options.startDate?.toLocaleString(),
          endDate: options.endDate?.toLocaleString(),
        });
        setValidationOnFilter("");
      } else if (typeof searchOrFilter === "string" && searchOrFilter.length > 0) {
        onSearch(searchOrFilter);
      } else {
        fetchSellerVerificationList({
          page,
          limit,
          status,
        });
      }
    };

    const onChangePage = (pageNo: number) => {
      setCurrent(pageNo);
      fetchData(pageNo - 1, pageSize, searchedKey, tab);
    };

    const onTabChange = (tabValue: string) => {
      setTab(tabValue);
      setCurrent(1);
      setSelected(false);
      setSelectedUserAlias([]);
      setSelectAll(false);
      setIndex("");
      fetchData(0, pageSize, searchedKey, tabValue);
    };

    const handleChange = (newPageSize: number) => {
      setPageSize(newPageSize);
      setCurrent(1);
      fetchData(0, newPageSize, searchedKey, tab);
    };

    return (
      <div className="fullHeight m-main-body-section">
        <DefaultLayout
          page="seller_management"
          // loading={loading}
          TitleText="Screening management"
          TitleImage={KYCImage}
          headerPage={
            <div className="d-flex">
              <Image src={KYCImage} preview={false} className="mt-2" alt="kybimage" />
              <div className="ml-5">
                <b> Screening management</b>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item
                    onClick={() => {
                      navigate(Dashboard);
                    }}
                    className="cursor"
                  >
                    Dashboard
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Management</Breadcrumb.Item>
                  <Breadcrumb.Item>Screening management</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          }
        >
        <Card className="noBorder transparent kyc-table-list-card-wrap escrow-tran-card">
          <div className={Width > 767 ? "w-100 endtoend kyc-bottom-header mb-4" : "w-100 endtoend flex-column-reverse gap-2"}>
            {(typeof searchedKey === 'object' || searchedKey == '') ?
              <div className={Width > 767 ? "d-block dashboardTabs w-100" : "d-block dashboardTabs justify-content-between w-100"}>
                <Tabs
                  defaultActiveKey="ALL"
                  className="d-none-res tableTab"
                  onChange={onTabChange}
                  activeKey={tab}
                >
                  <TabPane
                    tab={`All (${allCount?.all})`}
                    key="ALL"
                  ></TabPane>
                  <TabPane
                    tab={`Pending (${allCount?.pending})`}
                    key="pending"
                  ></TabPane>
                  <TabPane
                    tab={`Verified (${allCount?.verified})`}
                    key="verified"
                  ></TabPane>
                  <TabPane
                    tab={`Rejected (${allCount?.rejected})`}
                    key="rejected"
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
              </div> :
              <div></div>
            }
              <div className="d-flex search-blocks inputFilter justify-content-between">
                <div className="d-flex w-100">
                  <Input
                    className="search-input-additem"
                    placeholder="Search"
                    prefix={
                      <Image src={Search} alt="search" preview={false} />
                    }
                    value={(typeof searchedKey === "string")? searchedKey:""}
                    onInput={(e: any) => {
                      onSearch(e.target.value);
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
              <FilterCard 
                handleApplyFilter={handleApplyFilter}
                setLoading={setLoading}
                fetchSellerVerificationList={fetchSellerVerificationList}
                filterType={FilterType.KYC}
                setSearchedKey={setSearchedKey}
                setCurrent={setCurrent}
                setPage={setPageSize}
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
               {KybList && KybList?.length > 0 ? (
                <KybKycMobileResponsiveCard KybList={KybList} download={download} setSelected={setSelected} selectedUserAlias={selectedUserAlias} setSelectedUserAlias={setSelectedUserAlias} selectAll={selectAll} setSelectAll={setSelectAll} />
               ) : 
               <div className="itemTypes-mobile-view text-center">
                {loading ? (
                   <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "60vh" }}>
                    <Spin size="large" className="mainloader" />
                    </div>
                  ) : (
                 locale.allLocale.emptyText )}
               </div>}
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
                            pageSize={pageSize}
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
    );
  };
  
  
  export default SellerManagementList;
