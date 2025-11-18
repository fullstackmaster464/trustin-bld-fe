import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
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
import EscrowImg from "../../assets/img/escrowaccountbg.svg";
import View from "../../assets/img/view.svg";
import Download from "../../assets/img/download.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import { EscrowInfo } from "../Common/RouteConst";
import Download_Blue from "../../assets/img/download_blue.svg";
import Search from "../../assets/img/search.svg";
import moment from "moment";
import { downloadDetails, fetchallVirtualAccounts,searchVirtualAccount } from "../../services/admin";
import DefaultLayout from "../Common/DefaultLayout";
import emptyCard from "../../assets/img/emptyCard.svg";
import { getWalletTotalAmountAndCount } from "../../services/user";
const EscrowAccountList = ():any => {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [selectedUserAlias, setSelectedUserAlias] = useState<any>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(false);
  const [index, setIndex] = useState<any>();
  const [allCount, setAllCount] = useState({
    all: 0,
    active: 0,
    archive: 0,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [escrowAccountsList, setEscrowAccountsList] = useState<any>([]);
  const [tab, setTab] = useState("all");
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedKey, setSearchedKey] = useState('');
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
    if (searchedKey?.length > 0) {
      onSearch(searchedKey, 1, value)
    } else {
      fetchEscrowAccountsList(1, value, tab);
    }
  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrentPage(1);
    setSelected(false);
    setSelectedUserAlias([]);
    setIndex("");
    if (searchedKey?.length > 0) {
      onSearch(searchedKey, 1, pageSize);
    } else {
      fetchEscrowAccountsList(1, pageSize, tabValue);
    }
  };

  const onChangePage = (page: number) => {
    setCurrentPage(page);
    if (searchedKey?.length > 0) {
      onSearch(searchedKey, page, pageSize);
    } else {
      fetchEscrowAccountsList(page, pageSize, tab);
    }
  };
const downloadUserDetails = (index: number, status: string) => {
    let url = "";
    if (index === 0 || selectAll === true) {
      url =
        REACT_APP_SERVER_URL +
        `/api/v1/virtual-account/downloadVAList?type=${status}`;
    } else if (index != 0 || selectAll === false) {
      url =
        REACT_APP_SERVER_URL +
        "/api/v1/virtual-account/downloadVAList?id=" +
        selectedUserAlias;
    }

    setDownloading(true);
    downloadDetails(url)
      .then((response: any) => {
        setDownloading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Virtual Account.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        setDownloading(false);
        if (err) {
          message.error("Something went wrong! Please try again later.");
          setDownloading(false);
        }
      });     
  };
  const download = (id:any)=>{
    const url = REACT_APP_SERVER_URL +
    "/api/v1/virtual-account/downloadVAList?id=" +id;
    downloadDetails(url)
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Virtual Account.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        setDownloading(false);
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
const columns: object[] = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: false,
      render:(text:any,values:any) => {
        return ( 
        <div className={`hyperLink d-block ${text.length * 7 > 100 ? 'signature-overflowtext' : ''}`} onClick={() => {
          navigate(EscrowInfo + "/" + values?.userAlias);
        }}>  
          <Tooltip
            title={text.length * 7 > 100 ? text : null}
            overlayClassName='custom-tooltip'
          >
            <span className="m-0 p-0">{text}</span>
          </Tooltip>
        </div> )
      }
    },
    {
      title: "Email id",
      dataIndex: "emails",
      sorter: false,
      render: (text: any) => (
        <div className={`${text?.[0]?.address.length * 7 > 180 ? 'tableWordWrap' : ''}`}>
          <Tooltip
            title={text?.[0]?.address}
            overlayClassName="custom-tooltip"
          >
            <span>{text?.[0]?.address}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phones",
      sorter: false,
      render: (text: any) => {
        return <span>{text?.[0]?.number}</span>;
      },
    },
    {
      title: "Account number",
      dataIndex: "number",
      sorter: false,
      render: (text: any) => {
        return  <span>{text}</span>;
        },

    },
    {
      title: "Added on",
      dataIndex: "createAt",
      sorter: false,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Account type",
      dataIndex: "vaType",
      sorter: false,
    },
    {
      title: "Balance",
      dataIndex: "usdBalance",
      sorter: false,
      render: (_: any, record: any) => {
        const balances = [
          { label: "AED", value: record?.aedBalance },
          { label: "USD", value: record?.usdBalance },
        ];
        return (
          <div>
            {balances.map((bal, index) => (
              <span key={index} className="d-block">
                {bal.label} {bal.value?.toFixed(2)}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      render: (text: string) => {
        return (
          <span className="status capitalize">
            <span className={text?.toLowerCase()?.split(" ")?.join("_")}>
              {text}
            </span>
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "userAlias",
      sorter: false,
      render: (text: string) => {
        return (
          <div className="d-flex action-column-btn-group">
            <Image
              src={View}
              alt="view"
              preview={false}
              className="cursor icon-default-size"
              onClick={() => {
                navigate(EscrowInfo + "/" + text);
              }}
            />
            <Image
              src={Download}
              alt="download"
              preview={false}
              className="cursor icon-default-size"
              onClick={()=>{download(text)}}
            />
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
        setIndex("");
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
  const fetchEscrowAccountsList = async (page: number, pageSize: number, userType: string) => {
    try {
      setLoading(true);
      setEscrowAccountsList([]);

      let currentPage = page - 1;
      const uniqueList: any[] = [];
      const seen = new Set<string>();
      let lastResponse: any = null; 
      while (uniqueList.length < pageSize) {
        const response: any = await fetchallVirtualAccounts(currentPage, pageSize, userType || "");
        lastResponse = response; 
        const list: any[] = response?.data?.VAList?.data || [];
        if (list.length === 0) break;
        for (const account of list) {
          if (!account?.userAlias || seen.has(account.userAlias)) continue;
          seen.add(account.userAlias);
          uniqueList.push(account);
          if (uniqueList.length >= pageSize) break;
        }
        currentPage++;
      }
      const accountBalAmount = await Promise.all(
        uniqueList.map(async (account: any) => {
          let usdBalance = 0;
          let aedBalance = 0;
          try {
            const usdRes = await getWalletTotalAmountAndCount(account.userAlias, "USD");
            usdBalance = usdRes?.data?.walletTransaction?.balanceAmount || 0;
          } catch { usdBalance = 0;}
          try {
            const aedRes = await getWalletTotalAmountAndCount(account.userAlias, "AED");
            aedBalance = aedRes?.data?.walletTransaction?.balanceAmount || 0;
          } catch {aedBalance = 0;}
          return { ...account, usdBalance, aedBalance };
        })
      );
      setEscrowAccountsList(accountBalAmount);
      setTotalRecords(lastResponse?.data?.VAList?.count || accountBalAmount.length);

      setAllCount({
        all: lastResponse?.data?.VAList?.count || 0,
        active: lastResponse?.data?.VAList?.activeCount || 0,
        archive: lastResponse?.data?.VAList?.suspendedCount || 0,
      });

    } catch (error) {
      setEscrowAccountsList([]);
      setTotalRecords(0);
      message.error("Could not fetch details. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async (key: string, page: number, pageSize: number) => {
    if (key) {
      setLoading(true);
      setSearchedKey(key);
      const reqBody = { key };
      try {
        const response = await searchVirtualAccount(page - 1, pageSize, "sortByName", "DESC", reqBody);
        let list = response?.data?.data || [];
        const seen = new Set();
        list = list.filter((account: any) => {
          if (!account?.userAlias) return false;
          if (seen.has(account.userAlias)) return false;
          seen.add(account.userAlias);
          return true;
        });
        const accountBalAmount = await Promise.all(
          list.map(async (account: any) => {
            let usdBalance = 0;
            let aedBalance = 0;
            try {
              const usdRes = await getWalletTotalAmountAndCount(account.userAlias, "USD");
              usdBalance = usdRes?.data?.walletTransaction?.balanceAmount || 0;
            } catch {
              usdBalance = 0;
            }
            try {
              const aedRes = await getWalletTotalAmountAndCount(account.userAlias, "AED");
              aedBalance = aedRes?.data?.walletTransaction?.balanceAmount || 0;
            } catch {
              aedBalance = 0;
            }
            return {
              ...account,
              usdBalance,
              aedBalance,
            };
          })
        );

        setEscrowAccountsList(accountBalAmount);
        setTotalRecords(response?.data?.count || 0);
        setAllCount({
          all: response?.data?.count || 0,
          active: response?.data?.activeCount || 0,
          archive: response?.data?.suspendedCount || 0,
        });
      } catch (error) {
        setEscrowAccountsList([]);
        setTotalRecords(0);
        message.error("Could not fetch details. Please try again later");
      } finally {
        setLoading(false);
      }
    } else {
      setSearchedKey("");
      fetchEscrowAccountsList(1, pageSize, tab);
    }
  };

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

  useEffect(() => {
    fetchEscrowAccountsList(1, pageSize, "");
  }, []);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUserAlias([]);
      setSelectedRows([]);
      setSelected(false)
    } else {
      const allUserAliases = escrowAccountsList.map((item: any) => item.userAlias);
      setSelectedUserAlias(allUserAliases);
      setSelectedRows([...escrowAccountsList]);
      setSelected(true);
    }
    setSelectAll(!selectAll);
  };

  const onCheckboxChange = (userAlias: string, rowData: any) => {
    const updatedSelectedUserAlias = [...selectedUserAlias];
    const updatedSelectedRows = [...selectedRows];

    const isSelected = updatedSelectedUserAlias.includes(userAlias);

    if (isSelected) {
      const index = updatedSelectedUserAlias.indexOf(userAlias);
      if (index !== -1) {
        updatedSelectedUserAlias.splice(index, 1);
      }
      const rowIndex = updatedSelectedRows.findIndex((row) => row.userAlias === userAlias);
      if (rowIndex !== -1) {
        updatedSelectedRows.splice(rowIndex, 1);
      }
    } else {
      updatedSelectedUserAlias.push(userAlias);
      updatedSelectedRows.push(rowData);
    }
    updatedSelectedUserAlias?.length > 0 ? setSelected(true) : setSelected(false)
    setSelectedUserAlias(updatedSelectedUserAlias);
    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedUserAlias.length === escrowAccountsList.length);
  };

  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
        <DefaultLayout
          page="escrow_accounts"
          TitleText="Escrow Accounts"
          TitleImage={EscrowImg}
          headerPage={
            <div className="d-flex">
              <Image src={EscrowImg} preview={false} className="mt-3" alt="escrowimage" />
              <div className="ml-5">
                <b>Escrow accounts</b>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item>Escrow</Breadcrumb.Item>
                  <Breadcrumb.Item>Escrow accounts</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          }
        >
          <Card className="noBorder transparent">
            <div className="w-100 endtoend filter-wrap">
              <div className="d-flex dashboardTabs w-60 scrollAble">
                {!searchedKey ? (
                  <Tabs
                    defaultActiveKey="all"
                    className="d-none-res tableTab"
                    onChange={onTabChange}
                  >
                    <TabPane tab={`All (${allCount?.all})`} key="" />
                    <TabPane tab={`Active (${allCount?.active})`} key="active" />
                    <TabPane tab={`Archived (${allCount?.archive})`} key="suspended" />
                  </Tabs>
                ) : (
                  ""
                )}
              </div>
              <div className="d-flex search-blocks">
                <Button
                  className="downloadBtn mt-0 mx-2"
                  hidden={!selected}
                  loading={downloading}
                  onClick={() => downloadUserDetails(index, tab.toUpperCase())}
                >
                  {!downloading ? (
                    <span className="d-flex py-1">
                      <Image
                        src={Download_Blue}
                        alt="download"
                        className="px-2"
                        height={20}
                        width={35}
                        preview={false}
                      />
                      Download All
                    </span>
                  ) : (
                    ""
                  )}
                </Button>
                <Input
                  className="searchInput ml-2 px-3"
                  placeholder="Search"
                  prefix={<Image src={Search} alt="search" className="" preview={false} />}
                  onInput={(e: any) => {
                    setCurrentPage(1);
                    onSearch(e.target.value, 1, pageSize);
                  }}
                />
              </div>
            </div>

            {escrowAccountsList?.length > 0 ? (
              <>
                <div className="itemTypes-mobile-view">
                  <Checkbox checked={selectAll} onChange={toggleSelectAll}>
                    Select all
                  </Checkbox>
                  {escrowAccountsList.map((accountslist: any, Index: any) => (
                    <div className="mobile-card row" key={Index}>
                      <Col xs={2} sm={2}>
                        <Checkbox
                          className="mt-2"
                          type="checkbox"
                          checked={selectedUserAlias.includes(accountslist.userAlias)}
                          onChange={() => onCheckboxChange(accountslist.userAlias, accountslist)}
                        />
                      </Col>
                      <div className="mobile-card row col-10 col-sm-10">
                        {columns.map((column:any, index:any) => (
                          <div
                            key={`${accountslist.name}-${index}`}
                            className="sub-body col-6 col-sm-4"
                          >
                            <div className="mobile-header">{column.title}</div>
                            <div className="mobile-data">
                              {column.render
                                ? column.render(accountslist[column.dataIndex], accountslist)
                                : accountslist[column.dataIndex]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Table
                  columns={columns}
                  dataSource={escrowAccountsList}
                  pagination={false}
                  loading={loading}
                  className="mt-3 paymentLogTable"
                  scroll={{ x: 1200 }}
                  rowSelection={rowSelection}
                  rowKey={(record: any) => record.userAlias}
                  onHeaderRow={(_columns, index) => ({
                    onClick: () => setIndex(index),
                  })}
                  locale={locale.allLocale}
                />
              </>
            ) : (
              <>
              <div className="itemTypes-mobile-view text-center">
              {loading ? (
               <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "60vh" }}>
                <Spin size="large" className="mainloader" />
              </div>
              ) : (
                locale.allLocale.emptyText
              )}
            </div>
              <Table
                columns={columns}
                dataSource={escrowAccountsList}
                pagination={false}
                loading={loading}
                className="mt-3 paymentLogTable"
                scroll={{ x: 1200 }}
                rowSelection={rowSelection}
                rowKey={(record: any) => record.userAlias}
                onHeaderRow={(_columns, index) => ({
                  onClick: () => setIndex(index),
                })}
                locale={locale.allLocale}
              />
              </>
            )}

            {escrowAccountsList?.length > 0 ? (
              <div className="w-100 endtoend my-2 pagination-range">
                <div className="show">
                  Show
                  <Select
                    value={pageSize}
                    style={{ width: 70 }}
                    onChange={handlePageSizeChange}
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
                  />
                  <span className="page">Per page</span>
                </div>
                <div className="right" style={{ textAlign: "center" }}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    onChange={onChangePage}
                    total={totalRecords}
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

export default EscrowAccountList;