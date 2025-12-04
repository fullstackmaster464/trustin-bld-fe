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
  Tabs,
  message,
  Tooltip,
  Modal,
  Row,
  Form,
  Col,
  Upload
} from "antd";
import { useNavigate } from "react-router-dom";
import Management from "../../assets/img/Headers/User_management.svg";
import View from "../../assets/img/view.svg";
import Download from "../../assets/img/download.svg";
import Download_Blue from "../../assets/img/download_blue.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import Search from "../../assets/img/search.svg";
import emptyCard from "../../assets/img/emptyCard.svg";
import Trio from "../../assets/img/trio.svg";
import { UserInfo } from "../Common/RouteConst";
import {
  downloadDetails,
  fetchAllUsers,
  getuserFilter,
  unblockUser,
  updateUserStatus,
} from "../../services/admin";
import {
  FilterType,
  DEFAULT_COUNTRY_CODE,
  MobilNumberRegex,
  OnlyText,
  USER_STATUS_TEXT,
  emailRegex,
  getLocalStorage,
  setLocalStorage,
  sortedColumn,
  sortingOrder,
} from "../Common/Constants";
import moment from "moment";
import { getAllCountries, inviteUser, registerUser, searchManagementdata } from "../../services/user";
import DefaultLayout from "../Common/DefaultLayout";
import UserMobileResponsiveCard from "./UserMobileResponsiveCard";
import filterIcon from "../../assets/img/filter.svg"; 


// import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import FilterCard from "./FilterCard";

// import { InputText } from "../ui-elements/InputsRepo";
import { Option } from "antd/lib/mentions";
import PhoneCode from "../Common/PhoneCode";
import Role from "../../assets/img/job_light.svg";
import EmailGray from "../../assets/img/Email_outline.svg";
import UserFull from "../../assets/img/User_Full.svg";
// import specialization from "../../assets/img/spl.svg";
import SuccessIcon from "../../assets/img/Successpopupicon.svg";
import Country from "../../assets/img/Country.svg";
import modalcloseicon from "../../assets/img/modalclose.svg"
import { UploadOutlined } from "@ant-design/icons";

const UserManagement = ():any => {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const enableAdvisor = process.env.ENABLE_ESCROW_ADVISOR === 'true';
  const navigate = useNavigate();
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState(false);
  const [index, setIndex] = useState<any>();
  const [allCount, setAllCount] = useState({
    all: 0,
    customer: 0,
    approver: 0,
    client: 0,
    admin: 0,
    authorizer: 0,
    seniorManagement: 0,
    escrowAdvisor:0,
  });
  const [totalPage, setTotalPage] = useState(0);
  const [selectedUserAlias, setSelectedUserAlias] = useState([]);
  const [UserList, setUserList] = useState<any>([]);
  const [tab, setTab] = useState("all");
  const [downloading, setDownloading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [validationOnFilter, setValidationOnFilter] = useState<string>("");
  const [searchedKey, setSearchedKey] = useState('');
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  };
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [btnLoader, setBtnLoader] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });
  const [callingCode, setCallingCode] = useState<any>();
  const [messagedata, setMessageData] = useState("");
  const [countryCodes, setCountryCodes] = useState<any>([]);
  // const [Specialization, setSpecialization] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [unblockModal, setUnblockModal] = useState(false);
  const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;

  useEffect(() => {
    fetchAllUsers(current, page, "all");
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);

  }, []);

  const handleResetAllClick = () => {
    setSearchKey("");
    setSearchedKey("");
    setValidationOnFilter("");
    setCurrent(1);
    setPage(10);
    fetchUsersList(1, 10, "all", {});
  };
  
  const handleApplyFilter = (filterOptions: any,pageno:any,page:any) => {
    const status = (filterOptions?.customStatus && filterOptions.customStatus?.length > 0) ? filterOptions.customStatus :
    filterOptions?.status
    if (
      (filterOptions.startDate && filterOptions.startDate?.length > 0) ||
      (filterOptions.endDate && filterOptions.endDate?.length > 0) ||
      (filterOptions.emailAddress && filterOptions.emailAddress?.length > 0) ||
      (status && status?.length > 0)
    ) {
      setValidationOnFilter("");
      const reqBody: any = {
        // typeOfEntity: 'COMPANY',
        ...(filterOptions.startDate && { startDate: filterOptions.startDate }),
        ...(filterOptions.endDate && { endDate: filterOptions.endDate }),
        ...(filterOptions.emailAddress && { email: filterOptions.emailAddress.trim() }),
        ...(status && { status: status }),
      };
  
      setSearchedKey(reqBody);
      setLoading(true);

      getuserFilter(reqBody, pageno - 1 || 0, page)
        .then((response: any) => {
          setLoading(false);
          setUserList(response?.data?.data || []);
          setTotalPage((response?.data?.lastPage || 0) * page);
          setCurrent(pageno);
        })
        .catch(() => {
          setLoading(false);
          message.error("Failed to apply filter. Please try again.");
        });
    } else {
      setValidationOnFilter("Selected filter is blank or invalid!");
    }
  };
  
  // const getSpecialization = () => {
  //   getAllItem().then((res: any) => {
  //     setSpecialization(res?.data);
  //   });
  // };

  const closemodal = () => {
    setModalVisible(false);
    setIsAddModalVisible(false);
    fetchUsersList(current, page, "all", {});
  };

  useEffect(() => {
    setLoading(true);
    getAllCountries()
      .then((response: any) => {
        setLoading(false);
        setCountryCodes(response?.data);  
      })
      .catch(() => {
        setLoading(false);
        setIsAddModalVisible(false);
        message.error("Could not fetch details. Please try again later");
      });
    // getSpecialization();
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);

  }, []);

  const onFinish = (values: any) => {
    setBtnLoader(true);
    if (!error?.status) {
      values["adminAlias"] = JSON.parse(getLocalStorage("auth")!)?.userAlias;
      values["clientAlias"] = "TRUST";
      values["userType"] = values?.role;
      values["contactNumber"] = values?.mobile;
      registerUser(values)
        .then((response) => {
          if (response?.data?.statusCode === 201) {
            setBtnLoader(false);
            setIsAddModalVisible(false);
            setModalVisible(values?.name);
            setLocalStorage("userVerificationToken", JSON.stringify(response?.data?.verifyToken));
            setTimeout(() => {
              form.resetFields();
            }, 2000);
            setCallingCode("")
          }
        })
        .catch((error) => {
          setBtnLoader(false);
          message.error(
            error?.data?.message.includes("already")
              ? "This Email is already registered. Please Use another Email."
              : error?.data?.message
          );
        });
    }
  };

  const handeRoleChange = (value: any) => {
    form.setFieldsValue({
      role: value,
    });
    setError({ status: false, message: "" });
  };

  const handleCountryChange = (value: any) => {
    form.setFieldsValue({
      countryAlias: value,
    });
    setCallingCode(
      countryCodes.filter((item: any) => item.isoCode === value)[0]?.callingCode
    );
    setError({ status: false, message: "" });
  };

  const handleUserChange = () => {
    setError({ status: false, message: "" });
  };

  // const handelSpecializationChange = (value: any) => {
  //   form.setFieldsValue({
  //     specialization: value,
  //   });
  //   setError({ status: false, message: "" });
  // };
  
  const twoFunction = (e: any) => {
    handleUserChange();
    const result: string = e.target.value.replace(OnlyText, "");
    form.setFieldsValue({ name: result });
    setMessageData(result);
  };

  const validateContactNumber = (_rule: any, value: string) => {
    return new Promise((resolve: any, reject: any) => {
      if (!value) {
        return reject("Mobile number is required!");
      }

      const validNumber = value.replace(MobilNumberRegex, '');
      if (callingCode === DEFAULT_COUNTRY_CODE) {
        if (!validNumber.startsWith('5')) {
          return reject("UAE numbers should start with 5");
        }
      }

      if (validNumber.length < 7) {
        return reject("Enter valid mobile number!!");
      }

      resolve(); 
    });
  };

  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };
  const validateNumber = () => {
    const value = form.getFieldValue("mobile");
    const numbers = value.replace(MobilNumberRegex, "");
    form.setFieldValue("mobile", numbers);
  };

  const handleBlur = (e:any) => {
    let newValue = e.target.value;
    if(newValue.startsWith('0')){
        newValue = newValue.substring(1);
       }
    form.setFieldValue("mobile", newValue);
  };

  const searchTable = (value: string, currentPage: number, page: number) => {
    const params = {
      key: value,
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
    if (typeof searchedKey === "object" && Object.keys(searchedKey)?.length >0) {
      handleApplyFilter(searchedKey,1,value)
      setValidationOnFilter("");
    }else if (typeof searchKey === "string" && searchKey?.length > 0) {
      searchTable(searchKey, 1, value);
    }else {
      fetchUsersList(1, value, tab, {});
    }
    
  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrent(1);
    fetchUsersList(1, page, tabValue, {});
    setSelected(false);
    setSelectAll(false);
    setSelectedUserAlias([]);
    setIndex("");
  };

  const onChangePage = (pageno: number) => {   
    setCurrent(pageno);   
    if (typeof searchedKey === "object" && Object.keys(searchedKey)?.length > 0) {
      handleApplyFilter(searchedKey,pageno,page)
      setValidationOnFilter("");
    }else if (typeof searchKey === "string" &&  searchKey?.length > 0) {
      searchTable(searchKey, pageno, page);
    }else {
      fetchUsersList(pageno, page, tab, {});
    }
  };
  const updateStatus = (values: any, status: string, index: number) => {
    const params = {
      status: status,
      userAlias: values?.userAlias,
      userType: tab.toUpperCase(),
    };
    updateUserStatus(params).then(() => {
      const list: any = [...UserList];
      list[index].status = status;
      setUserList([...list]);
    });
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
      render: (text: string | any[], record: { userAlias: string; }) => (
        <div className={`hyperLink ${text?.length > 15 ? 'signature-overflowtext' : ''}`} onClick={() => navigate(UserInfo + "/" + record?.userAlias)}>
          <Tooltip 
            title={text?.length > 15 ? text : null}
            overlayClassName="custom-tooltip"
          >
            <div className="overflowText">
            <span>{text ? text : "--"}</span> 
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
      title: "Active/In-active",
      dataIndex: "status",
      sorter: false,
      width: 200,
      render: (text: string, value: object, index: number) => {
        return (
          <div className="text-center mx-2">
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
          </div>
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
  const SupportEngineerColumns: any = [
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
            <span>{text ? text : "--"}</span> 
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
      // setSelectedRows(selectedRows);
      setSelected(selectedRows?.length > 0 ? true : false);
    },
    onSelectAll: (_selected: boolean, selectedRows: []) => {
      // setSelectedRows(selectedRows);
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
      userType?.toUpperCase() || "ALL",
      sortedColumn?.[sort?.field] || "sortByAgreementId",
      sortingOrder?.[sort?.order] || "DESC"
    )
      .then((response) => {
        setLoading(false);
        setUserList(response.data.data);
        setTotalPage(response.data.lastPage * page);
        if (userType?.toUpperCase() === "ALL") {
          setAllCount({
            all: response.data.count,
            customer: response.data.userCount,
            approver: response.data.trusteeCount,
            client: response.data.clientCount,
            admin: response.data.adminCount,
            authorizer: response.data.authorizerCount,
            seniorManagement: response?.data?.seniorManagmentCount,
            escrowAdvisor:response?.data?.escrowAdvisor,
          });
        }
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Could not fetch details. Please try again later!");
      });
  };

  useEffect(() => {
    if (searchKey == "") {
      fetchUsersList(current, page, "all", {});
    }
  }, [searchKey]);

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

  const handleUnblockUser = async (values: any) => {
    setLoading(true);
    try {
      const res = await unblockUser({ email: values.email });
      if (res.data.statusCode === 200) {
        message.success(res.data.message);
        setUnblockModal(false);
        form.resetFields();
        fetchAllUsers(current, page, tab);
      } else {
        message.error(res.data.message || "Something went wrong. Please try again later");
      }
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to unblock user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

 const onFinishUpload = async (values: any) => {
  try {
    setBtnLoader(true);
    const formData = new FormData();
    formData.append("file", values.file);

    const res = await inviteUser(formData);
    
    setIsUploadModalVisible(false);
    if(res?.data?.errors && res?.data?.errors?.length){
      message.error(res?.data?.message);
      return;
    }
    fetchUsersList(current, page, "all", {});
    message.success("Imported successfully!");
  } catch (e) {
    console.error(e);
    message.error("Upload failed!");
  } finally {
    setBtnLoader(false);
  }
 };





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
                      <b> User management</b>
                      <Breadcrumb separator=">">
                        {/* <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                          className="cursor"
                        >
                          Dashboard
                        </Breadcrumb.Item> */}
                        <Breadcrumb.Item>
                          Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>User management</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <Card className="noBorder transparent kyc-table-list-card-wrap escrow-tran-card">
                <div className={Width > 1124 ? "w-100 endtoend kyc-bottom-header mb-4" : "w-100 endtoend flex-column-reverse gap-2 mt-3"}>
                  <div className={Width > 767 ? "d-block dashboardTabs w-100" : "d-block dashboardTabs justify-content-between w-100"}>
                    {!searchKey ? (
                      <Tabs
                        defaultActiveKey="all"
                        className="tableTab"
                        onChange={onTabChange}
                      >
                        <TabPane
                          tab={`All (${allCount?.all})`}
                          key="all"
                        ></TabPane>
                        <TabPane
                          tab={`Admin (${allCount?.admin})`}
                          key="admin"
                        ></TabPane>
                        <TabPane
                          tab={`Customer (${allCount?.customer})`}
                          key="user"
                        ></TabPane>
                        <TabPane
                          tab={`Approver (${allCount?.approver})`}
                          key="trustee"
                        ></TabPane>
                        <TabPane
                          tab={`Authorizer (${allCount?.authorizer})`}
                          key="authorizer"
                        ></TabPane>
                        <TabPane
                          tab={`Senior management (${allCount?.seniorManagement})`}
                          key="senior_managment"
                        ></TabPane>
                        {enableAdvisor && <TabPane
                          tab={`Escrow advisor (${allCount?.escrowAdvisor})`}
                          key="escrow_advisor"
                        ></TabPane>}
                      </Tabs>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="d-flex">
                    {UserType !== "SUPPORT_ENGINEER"  &&
                  <>
                    <Button
                      className="add-itemtype mx-3"
                      onClick={() => {
                        setIsAddModalVisible(true);
                      }}
                    >
                      + Add New User
                    </Button>
                    <Button
                      className="add-itemtype mx-3"
                      onClick={() => {
                        setIsUploadModalVisible(true);
                      }}
                    >
                      + Upload
                    </Button>
                   </> 
                    }
                    <Button
                      className="downloadBtn mx-3"
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
                    <Input
                      className="search-input-additem w-100"
                      placeholder="Search"
                      value={searchKey}
                      prefix={
                        <Image
                          src={Search}
                          alt="search"
                          className=""
                          preview={false}
                        />
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        searchTable(val, 1, page);
                        setSearchKey(val);
                      }}
                    />
                  </div>
                  <div className={Width > 992 ? "d-flex buttons-filter": "d-flex buttons-filter justify-content-end"}>
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
                        />
                      </Button>
                      <Button type="default" className="filterbutton mx-2" onClick={handleResetAllClick}>
                        Reset All
                      </Button>
                    </>
                  ) : (
                    <Button className={Width > 992 ? "filterbutton_selected text-center": "filterbutton_selected text-center mb-3"}>
                      <span className="mt-1">Filter</span>
                      <Image
                        src={closeIcon}
                        alt="filter"
                        preview={false}
                        height={28}
                        width={28}
                        className="px-1"
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
                  </div>
                </div>
                {showFilter && (
                  <FilterCard handleApplyFilter={(e) => { handleApplyFilter(e,1,10) }}
                    setLoading={setLoading}
                    fetchUsersList={fetchUsersList}
                    filterType={FilterType.STATUS}
                    setSearchedKey={setSearchedKey}
                    setCurrent={setCurrent}
                    setPage={setPage}
                  />
                )}
                {validationOnFilter ? <p className="text-danger">{validationOnFilter}</p> : ""}
                <div className="flex-end">
                  <Button
                    className="modal-button d-flex w-auto"
                    onClick={() => setUnblockModal(true)}
                  >
                    Unblock User
                  </Button>
                </div>
                <div className="custome-table-wrapper">
                  {UserList.length > 0 ? (
                  <Table
                    columns={UserType === "SUPPORT_ENGINEER" ? SupportEngineerColumns : columns}
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
                  ):(
                  <Table
                  columns={UserType === "SUPPORT_ENGINEER" ? SupportEngineerColumns : columns}
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
                  )}
                </div>
                <div className="mobile-view-listing">
              {UserList && UserList?.length > 0 && (
                  <UserMobileResponsiveCard UserList={UserList} setSelected={setSelected} selectedUserAlias={selectedUserAlias} setSelectedUserAlias={setSelectedUserAlias} selectAll={selectAll} setSelectAll={setSelectAll} columns={UserType === "SUPPORT_ENGINEER" ? SupportEngineerColumns : columns}
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
                  <Modal
                   title={
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="large-title mb-0">Add new user</p>
                      <img
                        src={modalcloseicon}
                        alt="close-icon"
                      className="cursor"
                        onClick={() => setIsAddModalVisible(false)}
                      />
                    </div>
                  }
                    className="add-item-category-modal d-flex center"
                    open={isAddModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={() => setIsAddModalVisible(false)}
                  >
                    
                    <hr className="break-line" />
                    <Form onFinish={onFinish} form={form}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        className="country-selection mb-4 modal_inputField select add-user-form-field add-user-select"
                        name="role"
                        rules={[
                          {
                            required: true,
                            message: "Role is required!",
                          },
                        ]}
                       
                        children={
                          <div>
                            <span className="global">
                              <Image
                                preview={false}
                                src={Role}
                                alt="role"
                                className="prefix"
                              />
                            </span>
                            <Select
                              className="selct-form-field"
                              placeholder="Role"
                              onChange={handeRoleChange}
                              allowClear
                            >
                              <Option value="TRUSTEE">Approver</Option>
                              <Option value="AUTHORIZER">Authorizer</Option>
                              <Option value="SENIOR_MANAGMENT">
                                Senior managment
                              </Option>
                              <Option value="MAKER">Maker</Option>
                              <Option value="CHECKER">Checker</Option>
                              <Option value="SUPPORT_ENGINEER">Support engineer</Option>
                            </Select>
                          </div>
                        }
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        name="name"
                        className="inputField w-100"
                        rules={[
                          {
                            required: true,
                            message: "Name is required!",
                          },
                          {
                            whitespace: true,
                            message: "Enter valid name!",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Name"
                          prefix={
                            <Image
                              src={UserFull}
                              preview={false}
                              alt="name"
                              className="pe-3"
                            />
                          }
                          onChange={twoFunction}
                          value={messagedata}
                          maxLength={50}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        name="email"
                        className="inputField mb-4 add-user-form-field w-100"
                        rules={[
                          {
                            required: true,
                            message: "Email is required!",
                          },
                          {
                            pattern: emailRegex,
                            message: "Enter valid email!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Email"
                          prefix={
                            <Image
                              src={EmailGray}
                              preview={false}
                              alt="name"
                              className="pe-3"
                            />
                          }
                          onChange={handleUserChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        className="country-selection modal_inputField select mb-4 add-user-form-field add-user-select"
                        name="countryAlias"
                        rules={[
                          {
                            required: true,
                            message: "Country is required!",
                          },
                        ]}
                      >
                        <span className="global">
                          <Image
                            preview={false}
                            src={Country}
                            alt="country"
                            className="prefix"
                          />
                        </span>
                        <Select
                          className="selct-form-field"
                          placeholder="Country"
                          onChange={handleCountryChange}
                          showSearch
                          optionFilterProp="children"
                          allowClear
                        >
                          {countryCodes.map((item: any, index:any) => {
                            return item?.currency?.status == "active" ? (
                              <Option
                                key={index + "countrycode"}
                                value={item?.isoCode}
                              >
                                {item?.name}
                              </Option>
                            ) : null;
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        name="mobile"
                        className="inputField w-100 add-user-form-field add-user-select"
                        rules={[
                          {
                            validator: validateContactNumber,
                          },
                        ]}
                      >
                        <Input
                          addonBefore={<PhoneCode callingCode={callingCode}/>}
                          className="inputField"
                          placeholder="Mobile number"
                          maxLength={10}
                          onBlur={handleBlur}
                          onKeyPress={(e) => {
                            checkNumberInput(e);
                            handleBlur(e);
                          }}
                          onChange={() => {
                            validateNumber();
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <InputText
                        fieldname="specialization"
                        className="country-selection modal_inputField select special mb-4 add-user-form-field add-user-select"
                        rules={[
                          {
                            required: true,
                            message: "Specialization is required!",
                          },
                        ]}
                      >
                        <span className="global center">
                          <Image
                            src={specialization}
                            preview={false}
                            className="prefix"
                          />
                        </span>
                        <Select
                        className="selct-form-field p-1"
                          placeholder="Specialization"
                          onChange={handelSpecializationChange}
                          mode="multiple"
                          allowClear
                          showSearch
                          optionFilterProp="children"
                        >
                          {Specialization?.map((item: any) => {
                            return (
                              <Option
                                key={item?.aliasName}
                                value={item?.aliasName}
                              >
                                {item?.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </InputText>
                    </Col> */}
                  </Row>
                  <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} >
                    <Col span={24} className="my-4 w-100 d-flex align-items-center">
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        loading={btnLoader}
                        className="modal-button w-auto "
                      >
                        Add New User
                      </Button>
                      <Button
                        className="rounded_cancel_btn mx-3 mt-0"
                        onClick={() => {
                          form.resetFields();
                          setCallingCode("");
                          setError({ status: false, message: "" });
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>    
                </Modal>


          <Modal title={
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="large-title mb-0">Upload user</p>
                      <img
                        src={modalcloseicon}
                        alt="close-icon"
                      className="cursor"
                        onClick={() => setIsUploadModalVisible(false)}
                      />
                    </div>
                  }
                    className="add-item-category-modal d-flex center"
                    open={isUploadModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={() => setIsUploadModalVisible(false)}
                  >
                    
                    <hr className="break-line" />
                    <Form onFinish={onFinishUpload} form={form}>
                      <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item
                        name="file"
                        valuePropName="file"
                        rules={[
                          {
                            required: true,
                            message: "CSV file is required!",
                          },
                        ]}
                      >
                        <Upload
                          beforeUpload={() => false} // prevents auto upload
                          accept=".csv"
                          maxCount={1}
                          onChange={(info) => form.setFieldsValue({ file: info.file })}
                        >
                          <Button icon={<UploadOutlined />}>Upload CSV File</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
 
                  </Row>
                  <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} >
                    <Col span={24} className="my-4 w-100 d-flex align-items-center">
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        loading={btnLoader}
                        className="modal-button w-auto "
                      >
                        Submit sheet
                      </Button>
                      <Button
                        className="rounded_cancel_btn mx-3 mt-0"
                        onClick={() => {
                          form.resetFields(); 
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>    
                </Modal>


                <Modal
                  open={modalVisible}
                  footer={false}
                  closable={false}
                  className="modal-box success"
                  centered
                  width={500}
                  onCancel={closemodal}
                >
                  <div className="text-center">
                    <Image
                      src={SuccessIcon}
                      alt="success"
                      preview={false}
                      className="mt-5"
                    />

                    <div className="titleText mt-5 mb-3">
                      {modalVisible + " "} added successfully
                    </div>
                    <Button
                      className="rounded_blue_outline btn-OK mb-4"
                      onClick={closemodal}
                    >
                      Ok
                    </Button>
                  </div>
                </Modal>
                <Modal
                  open={unblockModal}
                  footer={false}
                  centered
                  className="classification-modal"
                  title={
                    <span
                      className={`change-client-classification`}
                    >
                      Unblock User
                      <hr className="lightgrayHr" />
                    </span>
                  }
                  onCancel={() => {
                    setUnblockModal(false); 
                    form.resetFields(); 
                  }}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUnblockUser}
                    scrollToFirstError
                    className="py-2"
                    name="unblock_user_form"
                  >
                    <div className="subText">Email address</div>
                    <Form.Item
                      name="email"
                      className="inputField mt-2 error-input w-100"
                      rules={[
                          {
                            required: true,
                            message: "Email is required!",
                          },
                          {
                            pattern: emailRegex,
                            message: "Enter valid email!",
                          },
                        ]}
                    >
                      <Input
                        placeholder="Please enter email address"
                        className="modalTextArea"
                      />
                    </Form.Item>
            
                    <div>
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="modal-button mt-2"
                      >
                        Unblock
                      </Button>
                      <Button
                        key="cancel"
                        type="primary"
                        onClick={() => {
                          setUnblockModal(false); 
                          form.resetFields();
                        }}
                        className="modal-button-cancel mx-2 mt-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Modal>
              </Card>
              </DefaultLayout>
            </div>
    </div>
  );
};

export default UserManagement;
