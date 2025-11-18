import {
  Breadcrumb,
  Button,
  Card,
  Image,
  Pagination,
  Select,
  Table,
  message,
  Tooltip
} from "antd";
import { useNavigate } from "react-router-dom";
import Management from "../../assets/img/Headers/User_management.svg";
import View from "../../assets/img/view.svg";
import Download_Blue from "../../assets/img/download_blue.svg";
import { useEffect, useState } from "react";
import emptyCard from "../../assets/img/emptyCard.svg";
import { Dashboard, UserInfo } from "../Common/RouteConst";
import {
  downloadDetails,
  fetchAllUsers,
} from "../../services/admin";
import {
  USER_STATUS_TEXT,
  sortedColumn,
  sortingOrder,
} from "../Common/Constants";
import moment from "moment";
import DefaultLayout from "../Common/DefaultLayout";
import UserMobileResponsiveCard from "../Admin/UserMobileResponsiveCard";

const AddUser = () => {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const navigate = useNavigate();
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState(false);
  const [index, setIndex] = useState<any>();
  const [totalPage, setTotalPage] = useState(0);
  const [selectedUserAlias, setSelectedUserAlias] = useState([]);
  const [UserList, setUserList] = useState<any>([]);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  const tab = "CUSTOMER";
  
  useEffect(() => {
    fetchUsersList(current, page, "USER", {});
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);

  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    fetchUsersList(1, value, tab, {});
  };

  const onChangePage = (pageno: number) => {
    setCurrent(pageno);    
    fetchUsersList(pageno, page, tab, {});
  };
  const downloadUserDetails = (index: number, status: string) => {
    let url = "";
    if (index === 0 || selectAll === true) {
      url =
        REACT_APP_SERVER_URL +
        `/api/v1/admin/downloadUserDetails?type=${status}`;
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
      render: (text: string | any[], record: { userAlias: string; }) => (
        <div className={`hyperLink ${text?.length > 15 ? 'signature-overflowtext' : ''}`} onClick={() => navigate(UserInfo + "/" + record?.userAlias)}>
          <Tooltip 
            title={text?.length > 15 ? text : null}
            overlayClassName="custom-tooltip"
          >
            <div className="overflowText">
              <span>{text}</span>
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Email address",
      dataIndex: "email",
      sorter: false,
      width: 240,
      render: (email: string) => (
        <div
          className={`${
            email?.length * 7 > 200 ? 'overflowText' : ''
          }`}
        >
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
                navigate(UserInfo + "/" + text);
              }}
              height={16} width={22}
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
    page: number,
    userType: string,
    sort: any
  ) => {
    setLoading(true);
    fetchAllUsers(
      current - 1 || 0,
      page || 10,
      userType?.toUpperCase() || "USER",//"CUSTOMER",
      sortedColumn?.[sort?.field] || "sortByAgreementId",
      sortingOrder?.[sort?.order] || "DESC"
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

  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="user_management"
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
                      <b> User management</b>
                      <Breadcrumb separator=">">
                        <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                          className="cursor"
                        >
                          Dashboard
                        </Breadcrumb.Item>
                        <Breadcrumb.Item className="cursor">
                          Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>User management</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <Card className="noBorder transparent mt-6 kyc-table-list-card-wrap escrow-tran-card">
                <div className={Width > 767 ? "w-100 endtoend kyc-bottom-header mb-4" : "w-100 endtoend flex-column-reverse gap-2"}>
                  <div className="d-flex search-blocks">
                    {" "}
                    <Button
                      className="downloadBtn mt-0 mx-3"
                      hidden={selected ? false : true}
                      loading={downloading}
                      onClick={() => {
                        downloadUserDetails(index, tab.toUpperCase());
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
                    
                  </div>
                </div>
                <div className="custome-table-wrapper">
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
                    locale={locale.allLocale}
                  />
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

export default AddUser;
