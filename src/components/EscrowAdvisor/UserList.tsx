import {
  Breadcrumb,
  Button,
  Card,
  Image,
  Input,
  Pagination,
  Select,
  Switch,
  Table,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import Management from "../../assets/img/Headers/User_management.svg";
import View from "../../assets/img/view.svg";
import Download from "../../assets/img/download.svg";
import Download_Blue from "../../assets/img/download_blue.svg";
import { useEffect, useState } from "react";
import Search from "../../assets/img/search.svg";
import emptyCard from "../../assets/img/emptyCard.svg";
import { Dashboard, EscrowAdvisorDetails } from "../Common/RouteConst";
import {
  downloadDetails,
  updateUserStatus,
} from "../../services/admin";
import {
  USER_STATUS_TEXT,
  getLocalStorage,
} from "../Common/Constants";
import moment from "moment";
import { getEscrowUserList, searchManagementdata } from "../../services/user";
import DefaultLayout from "../Common/DefaultLayout";
import UserMobileResponsiveCard from "../Admin/UserMobileResponsiveCard";


const UserList = () => {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState(false);
  const [index, setIndex] = useState<any>();
  const [totalPage, setTotalPage] = useState(0);
  const [selectedUserAlias, setSelectedUserAlias] = useState([]);
  const [UserList, setUserList] = useState<any>([]);
  const [downloading, setDownloading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const searchTable = (value: string, currentPage: number, page: number) => {
    let params = {
      key: value,
      userType:userType,
      userAlias:userAlias
    };
    setLoading(true);
    searchManagementdata(
      currentPage > 0 ? currentPage - 1 : 0,
      page,
      "sortByAgreementId",
      "DESC",
      params
    ).then((res: any) => {
      setLoading(false);
      setUserList(res.data.data);
      setTotalPage(res.data.lastPage * page);
    });
  };
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    if (searchKey?.length > 0) {
      searchTable(searchKey, 1, value);
    }else {
      fetchUsersList(1, value);
    }
    
  };
  // const onTabChange = (tabValue: string) => {
  //   setTab(tabValue);
  //   setCurrent(1);
  //   fetchUsersList(1, page,);
  //   setSelected(false);
  //   setSelectAll(false);
  //   setSelectedUserAlias([]);
  //   setIndex("");
  // };

  const onChangePage = (pageno: number) => {
    setCurrent(pageno);    
    if (searchKey?.length > 0) {
      searchTable(searchKey, pageno, page);
    }else {
      fetchUsersList(pageno, page);
    }
  };
  const updateStatus = (values: any, status: string, index: number) => {
    let params = {
      status: status,
      userAlias: values?.userAlias,
      userType: userType,
    };
    updateUserStatus(params).then(() => {
      let list: any = [...UserList];
      list[index].status = status;
      setUserList([...list]);
    });
  };
  const downloadUserDetails = (index: number, status: string) => {
    let url = "";
    if (index === 0 || selectAll === true) {
      url =
        REACT_APP_SERVER_URL +
        `/api/v1/admin/downloadUserDetails?type=${status}&userAlias=${userAlias}`;
    } else if (index != 0 || selectAll === false) {
      url =
        REACT_APP_SERVER_URL +
        "/api/v1/admin/downloadUserDetails?id=" +
        selectedUserAlias;
    }
    setDownloading(true);

    downloadDetails(url)
      .then((response: any) => {
        setDownloading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "User.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        if (err) {
          message.error("Something went wrong! Please try again later.");
          setDownloading(false);
        }
      });
  };
  const download = (id:any)=>{
    let url = "";
    url =
    REACT_APP_SERVER_URL +
    "/api/v1/admin/downloadUserDetails?id=" +id;
    downloadDetails(url)
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "User.xlsx");
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
    pageSize: page,
    current: current,
    style: { display: "none" },
  };

  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: false,
      width:200,
      render: (text:any,values:any) =>{     
        return <div className="hyperLink signature-overflowtext" onClick={() => {
          navigate(EscrowAdvisorDetails + "/" + values?.userAlias);
        }}>
          {text}
        </div>
      }
    },
    {
      title: "Email address",
      dataIndex: "email",
      sorter: false,
      width: 240,
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
      title: "User type",
      dataIndex: "userType",
      sorter: false,
      render: (text: string) => {
        return <span>{text==="USER" ? "CUSTOMER" :text==="TRUSTEE" ? 'APPROVER':  text}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
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
    {
      title: "Active/In-active",
      dataIndex: "status",
      sorter: false,
      width: 200,
      render: (text: any, value: object, index: number) => {
        return <Typography.Text ellipsis={true} style={{ width: 200 }} className="text-center mx-2">
          {text === "active" ? (
              <Switch
                defaultChecked={true}
                onClick={() => {
                  updateStatus(value, "suspended", index);
                }}
                className="center mx-4"
              />
            ) : (
              <Switch
                defaultChecked={false}
                onClick={() => {
                  updateStatus(value, "active", index);
                }}
                className="center mx-4"
              />
            )}
        </Typography.Text>;
        },
    },
    {
      title: "Action",
      dataIndex: "userAlias",
      sorter: false,
      width: 100,
      render: (text: string ) => {
        return (
          <div className="d-flex px-1">
            <Image
              src={View}
              alt="view"
              preview={false}
              className="cursor"
              onClick={() => {
                navigate(EscrowAdvisorDetails + "/" + text);
              }}
              height={16} width={22}
            />
            <Image
              src={Download}
              alt="view"
              preview={false}
              className="cursor mx-3"
              height={20}
              width={20}
              onClick={()=>{download(text)}}
            />
          </div>
        );
      },
    },
  ];
  const rowSelection: any = {
    selectedRowKeys: selectedUserAlias,
    onChange: (selectedRowKeys: [], selectedRows: []) => {
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
  const fetchUsersList = (
    current: number,
    pageSize: number,
  ) => {
    setLoading(true);
    getEscrowUserList(userAlias,
      current - 1 || 0,
      pageSize || 10,
    )
      .then((response) => {
        setLoading(false);
        setUserList(response.data.data);
        setTotalPage(response.data.lastPage * page);
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Could not fetch details. Please try again later!");
      });
  };

  useEffect(() => {
    if (searchKey == "") {
      fetchUsersList(current, page);
    }
  }, [searchKey]);
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="user_management"
        // loading={loading}
        TitleText="User Management"
        TitleImage={Management}
        headerPage={
          <div className="d-flex">
                    <Image
                      src={Management}
                      preview={false}
                      alt="management"
                      className="mt-2"
                    />
                    <div className="ml-5">
                      <b> User list</b>
                      <Breadcrumb separator=">">
                        <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                          className="cursor"
                        >
                          Dashboard
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>User list</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <Card className="noBorder transparent kyc-table-list-card-wrap">
                <div className="w-100 endtoend justify-content-end" >
                  <div className="d-flex search-blocks">
                    {" "}
                    <Button
                      className="downloadBtn mt-0 mx-3"
                      hidden={selected ? false : true}
                      loading={downloading}
                      onClick={() => {
                        downloadUserDetails(index, userType);
                      }}
                    >
                      {!downloading ? (
                        <span className=" d-flex py-1">
                          <Image
                            src={Download_Blue}
                            alt="dowload"
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
                      className="searchInput"
                      placeholder="Search"
                      prefix={
                        <Image
                          src={Search}
                          alt="search"
                          className=""
                          preview={false}
                        />
                      }
                      onChange={(e) => {
                        searchTable(e.target.value, 1, page);
                        setSearchKey(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="custome-table-wrapper">
                  {UserList.length > 0 ? 
                  <Table
                    columns={columns}
                    dataSource={UserList}
                    pagination={pagination}
                    loading={loading}
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
                  />:
                    <div className="nodataCard text-center px-5">
                      <Image src={emptyCard} preview={false} className="mt-5" />
                      <p className="nodata py-5">No Data Found</p>
                    </div> 
                  }
                </div>
                <div className="mobile-view-listing">
                 {UserList && UserList?.length > 0 && (
                   <UserMobileResponsiveCard UserList={UserList} setSelected={setSelected} selectedUserAlias={selectedUserAlias} setSelectedUserAlias={setSelectedUserAlias} selectAll={selectAll} setSelectAll={setSelectAll} columns={columns}
                   />
                  )}
            </div>
            {UserList?.length > 0 ? (
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

export default UserList;
