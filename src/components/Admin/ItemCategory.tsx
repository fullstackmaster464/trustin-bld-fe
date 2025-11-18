import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Image,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tabs,
  Switch,
  Modal,
  Form,
  message,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import View from "../../assets/img/view.svg";
import Editicon from "../../assets/img/EditIcon.svg";
import Itemdelete from "../../assets/img/ItemDeleteIcon.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import { FieldManagement } from "../Common/RouteConst";
import itemtypeIcon from "../../assets/img/itemtypesbg.svg";
import Search from "../../assets/img/search.svg";
import moment from "moment";
import Warning from "../../assets/img/warningicon.svg";
import filterIcon from "../../assets/img/filter.svg";
import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import "../../assets/scss/custom.scss";
import {
  createItemTypeCategory,
  deleteItemCategory,
  getItemCategoryList,
  getItemCategoryListByEntityType,
  getItemTypeFilter,
  getItemTypeList,
  searchCategoryType,
  updateItemCategoryStatus,
} from "../../services/admin";
import { PLATFORM_CHARGE_TYPE, USER_STATUS_TEXT, getLocalStorage } from "../Common/Constants";
// import { Option } from "antd/lib/mentions";
import DefaultLayout from "../Common/DefaultLayout";
import emptyCard from "../../assets/img/emptyCard.svg"; 
import FormItem from "antd/es/form/FormItem";
const ItemCategory = ():any => {
  const navigate = useNavigate();
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [count, setCount] = useState({
    all:0,
    individual: 0,
    company: 0
  });
  const [ItemCategoryList, setItemCategoryList] = useState<any>([]);
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isReloadModalVisible, setIsReloadModalVisible] = useState(false);
  const [itemDetails, setItemDetails] = useState<any>({});
  const [index, setIndex] = useState<any>();
  const [CurrentCategory, setCurrentCategory] = useState("");
  const [Width, setWidth] = useState(document?.body?.clientWidth)
  const [form] = Form.useForm();
  const [itemTypeList, setItemTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [searchedKey, setSearchedKey] = useState<any>("");
  const [plateformFees, setPlateformFees] = useState("");
  const [minimumPlatformCharge, setMinimumPlatformCharge] = useState("");
  const [minimumInvoiceAmount, setMinimumInvoiceAmount] = useState("");
  const [platformChargeType, setPlatformChargeType] = useState("PERCENT");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [vatCharges, setVatCharges] = useState("");
  const [initialValues, setInitialValues] = useState({ 
    plateformFees: "",
    vatCharges: "",
    minimumInvoiceAmount: "",
    minimumPlatformCharge:"",
    platformChargeType:""
  });
  const { Option } = Select;

  useEffect(() => {
    if (isEditModalVisible && itemDetails) {
      setPlateformFees(itemDetails?.plateformFees);
      setVatCharges(itemDetails?.vatCharges);
      setMinimumPlatformCharge(itemDetails?.minimumPlatformCharge)
      setPlatformChargeType(itemDetails?.platformChargeType)
      setMinimumInvoiceAmount(itemDetails?.minimumInvoiceAmount)
      setInitialValues({
        plateformFees: itemDetails?.plateformFees,
        vatCharges: itemDetails?.vatCharges,
        minimumInvoiceAmount: itemDetails?.minimumInvoiceAmount,
        minimumPlatformCharge:itemDetails?.minimumPlatformCharge,
        platformChargeType:itemDetails?.platformChargeType
      });
    }
    form.setFieldValue("platformChargeType","PERCENT")
  }, [isEditModalVisible, itemDetails]);
  const handlePlateformFeesChange = (e:any) => setPlateformFees(e.target.value);
  const handleVatChargesChange = (e:any) => setVatCharges(e.target.value);
  const handleminimumPlatformChargeChange = (e:any) => setMinimumPlatformCharge(e.target.value);
  const handleminimumInvoiceAmountChange = (e:any) => setMinimumInvoiceAmount(e.target.value);
  const handlePlatformChargeType = (e:any) => {
    setPlatformChargeType(e);
  }
  const handleChange = (value: number) => {
    
    setPage(value);
    setCurrent(1);
    if (typeof searchedKey === 'string' && searchedKey?.length > 0) {
      onSearch(searchedKey, 1, value);
    } else if (typeof searchedKey === "object" && Object.keys(searchedKey)?.length > 0 && (searchedKey.name || searchedKey.itemCategory || searchedKey.status)) {
      handleFilterApply(searchedKey,1,value)
    } else {
      fetchItemCategory(1, value);
    }
  };
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    if (typeof searchedKey === "object" && Object.keys(searchedKey)?.length > 0) {
      handleFilterApply(searchedKey,pageno,page)
    } else if (typeof searchedKey === 'string' && searchedKey?.length > 0) {
      onSearch(searchedKey, pageno, page);
    } else {
      fetchItemCategory(pageno, page);
    }
  };
  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsReloadModalVisible(false);
  };
  const onFinish = (values: any) => {
    values["createdBy"] = userAlias;
    createItemTypeCategory(values)
      .then((response) => {
        if (response?.status === 201) {
          setIsAddModalVisible(false);
          fetchItemCategory(1, page);
          form.resetFields()
        }
        form.resetFields();
      })
      .catch((error) => {
        if (error?.response && error?.response?.status === 409) {
          message.error("Oops! Could not create item. Please try again later");
        } else {
          setErrorMessage("Item type already exists!");
        }
      });
  };
  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCategory(e.target.value);
    setErrorMessage("");
  };
  const handleItemTypeChange = () => {
      setErrorMessage("");
  };
  const removeItemType = () => {
    deleteItemCategory(itemDetails?.aliasName).then(() => {
      fetchItemCategory(current, page);
      setItemDetails({});
      setIsReloadModalVisible(false);
      setIndex("");
    });
  };
  const updateItemName = () => {
    const params = {
      itemCategoryAlias: itemDetails?.aliasName,
      itemCategoryName: CurrentCategory,
      itemTypeAlias: itemDetails?.itemTypeAlias?.aliasName,
      minimumInvoiceAmount: minimumInvoiceAmount,
      minimumPlatformCharge:minimumPlatformCharge,
      platformChargeType:platformChargeType,
      plateformFees: plateformFees,
      vatCharges: vatCharges,
    };
    updateItemCategoryStatus(params)
      .then(() => {
        setIndex("");
        setCurrentCategory("");
        setItemDetails({});
        fetchItemCategory(1, page);
        handleCancel();
      })
      .catch((error) => {
        if (error?.response && error?.response?.status === 400) {
          message.error("Oops! Could not create item. Please try again later");
        } else {
          setEditErrorMessage("Item type name already exists!");
        }
      });
  };

  const handleEntityType = (type:any) => {
    getItemCategoryListByEntityType(type)
      .then((response: any) => {
        setItemTypeList(response?.data);
      })
      .catch(() => {
        message.error("Oops! Could not fetch list. Please try again later!");
      });
  }

  const updateStatus = (values: any, status: string, index: number) => {
    const params = {
      status: status,
      itemCategoryAlias: values?.aliasName,
    };
    updateItemCategoryStatus(params).then(() => {
      const list: any = [...ItemCategoryList];
      list[index].status = status;
      setItemCategoryList([...list]);
    });
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
  const columns: object[] = [
    {
      title: "Item type",
      dataIndex: "name",
      sorter: false,
      render: (text: any) => {
        return <Typography.Text ellipsis={true} style={{ width: 180 }}>{text}</Typography.Text>;
        },
},
    {
      title: "Item category",
      dataIndex: "itemcategoryname",
      sorter: false,
      render: (_: any, record: any) => {
        const itemCategoryName = record?.itemcategoryname || record?.itemTypeAlias?.name;
        return <Typography.Text ellipsis={true} style={{ width: 180 }}>{itemCategoryName}</Typography.Text>;
      },
    },
    {
      title: "Entity type",
      dataIndex: "entitytype",
      sorter: false,
      width: 150,
      render: (_: any, record: any) => {
        const entityType = record?.entityType || record?.entitytype;
        return <div>{entityType || "--"}</div>;
      },
    },
    {
      title: "Trustee required",
      dataIndex: "trusteeVerificationRequire",
      sorter: false,
      width: 180,
      render: (text: string) => {
        return <div className="capitalize">{text}</div>;
      },
    },
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      width: 180,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return (
          <div className="status">
            <span className={USER_STATUS_TEXT[text].toLowerCase()}>
              {USER_STATUS_TEXT[text]}
            </span>
          </div>
        );
      },
    },
    {
      title: "Change status",
      dataIndex: "status",
      sorter: false,
      width: 150,
      render: (text: string, value: object, index: number) => {
        return (
          <div className="text-center action-mobile-view">
            {text === "active" ? (
              <Switch
                defaultChecked={true}
                onClick={() => {
                  updateStatus(value, "suspended", index);
                }}
              />
            ) : (
              <Switch
                defaultChecked={false}
                onClick={() => {
                  updateStatus(value, "active", index);
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "aliasName",
      sorter: false,
      width: 150,
      render: (text: string, value: any) => {
        return (
          <div className="d-flex gap-3">
            <Image
              src={View}
              alt="view"
              preview={false}
              className="cursor"
              onClick={() => {
                navigate(FieldManagement + "/" + text);
              }}
              height={16}
              width={22}
            />
            <Image
              src={Itemdelete}
              alt="delete"
              preview={false}
              className="cursor"
              height={17}
              width={15.11}
              onClick={() => {
                setIsReloadModalVisible(true);
                setItemDetails(value);
              }}
            />
            <Image
              src={Editicon}
              alt="edit"
              preview={false}
              className="cursor"
              height={17}
              width={17}
              onClick={() => {
                setIsEditModalVisible(true);
                setItemDetails(value);
                setCurrentCategory(value?.name);
                setIndex(index);
              }}
            />
          </div>
        );
      },
    },
  ];
  const SupportEngineercolumns: object[] = [
    {
      title: "Item type",
      dataIndex: "name",
      sorter: false,
      render: (text: any) => {
        return <Typography.Text ellipsis={true} style={{ width: 180 }}>{text}</Typography.Text>;
        },
},
    {
      title: "Item category",
      dataIndex: "itemcategoryname",
      sorter: false,
      render: (_: any, record: any) => {
        const itemCategoryName = record?.itemcategoryname || record?.itemTypeAlias?.name;
        return <Typography.Text ellipsis={true} style={{ width: 180 }}>{itemCategoryName}</Typography.Text>;
      },
    },
    {
      title: "Entity type",
      dataIndex: "entitytype",
      sorter: false,
      width: 150,
      render: (_: any, record: any) => {
        const entityType = record?.entityType || record?.entitytype;
        return <div>{entityType || "--"}</div>;
      },
    },
    {
      title: "Trustee required",
      dataIndex: "trusteeVerificationRequire",
      sorter: false,
      width: 180,
      render: (text: string) => {
        return <div className="capitalize">{text}</div>;
      },
    },
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      width: 180,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return (
          <div className="status">
            <span className={USER_STATUS_TEXT[text].toLowerCase()}>
              {USER_STATUS_TEXT[text]}
            </span>
          </div>
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
            <Image
              src={View}
              alt="view"
              preview={false}
              className="cursor"
              onClick={() => {
                navigate(FieldManagement + "/" + text);
              }}
              height={16}
              width={22}
            />
          </div>
        );
      },
    },
  ];
  const onTabChange = (entityType ="") => {
    setLoading(true)
    getItemCategoryListByEntityType(entityType).then((res : any)=> {
      setLoading(false)
      setItemCategoryList(res.data);
      setCurrent(current);
    })
  }
  const handleTabChange = (key: string) => {
    setCurrent(1);
    setActiveTab(key)
    let entityType = '';

    if (key === 'individual') {
      entityType = 'INDIVIDUAL';
    } else if (key === 'company') {
      entityType = 'COMPANY';
    }

    if (searchedKey) {
      onSearch(searchedKey, 1, page);
    } else if (entityType) {
      onTabChange(entityType);
    } else {
      fetchItemCategory(1, page);
    }
  };
  
  const fetchItemCategory = (current: number, page: number, entityType = "") => {
    setLoading(true);
    getItemCategoryList(current > 0 ? current - 1 : 0 || 0, page || 10, entityType)
      .then((response) => {
        setLoading(false);
        setItemCategoryList(response.data.data);
        setCount({
          all: response?.data?.allCount,
          individual: response?.data?.individualCount,
          company: response?.data?.companyCount,
        });
        setTotalPage(response?.data?.lastPage * page);
      })
      .catch(() => {
        setLoading(false);
        message.error("Could not fetch details. Please try again later");
      });
    getItemTypeList(current > 0 ? current - 1 : 0, page || 10)
      .then((response) => {
        setLoading(false);
        setItemTypeList(response.data.data);
      })
      .catch(() => {
        setLoading(false);
        message.error("Could not fetch details. Please try again later");
      });
  };
  const onSearch = (e: string, currentPage: number, page: number, entityType="") => {
    setLoading(true);
    if (e) {
      setSearchedKey(e);
      const reqBody = { key: e };
      searchCategoryType(currentPage > 0 ? currentPage - 1 : 0, page || 10, reqBody)
        .then((response) => {
          setLoading(false);
          setItemCategoryList(response.data.data);
          setCount({
            all: response?.data?.allCount ?? response?.data?.count,
            individual: response?.data?.individualCount || 0,
            company: response?.data?.companyCount || 0,
          });
          setTotalPage(response?.data?.lastPage * page);
          setCurrent(currentPage);
          setActiveTab("all")
        })
        .catch(() => {
          setLoading(false);
          message.error("Could not fetch details. Please try again later");
        });
    } else {
      setSearchedKey("");
      fetchItemCategory(1, page, entityType);
    }
  };
  useEffect(() => {
    fetchItemCategory(current, page);
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);

  }, []);
  const locale = {
    allLocale: {
      emptyText: (
        <>
          <div className="nodataCard text-center px-5">
            <Image src={emptyCard} preview={false} className="mt-5" />
            <p className="nodata py-5">No data found</p>
          </div>
        </>
      ),
    },
  };

  const handleResetAllClick = () => {
    form.resetFields();
    setActiveTab("all")
    setSearchedKey("")
    fetchItemCategory(current, page);
  }
const handleFilterApply = (e:any, current :number, pageSize:number) =>{
  setLoading(true)
  setSearchedKey(e)
  getItemTypeFilter(current > 0 ? current -1 : 0,
    pageSize || 10,e).then((res)=>{
      setLoading(false)
      setItemCategoryList(res.data.data);
      setCount({
        all: res?.data?.count,
        individual: res?.data?.individualCount,
        company: res?.data?.companyCount,
      });
          setTotalPage(res?.data?.lastPage * pageSize);
          setCurrent(current);
    })
}
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="config_category"
        // loading={loading}
        TitleText="Item Types"
        TitleImage={itemtypeIcon}
        headerPage={
          <div className="d-flex">
                    <div>
                      <Image
                        src={itemtypeIcon}
                        preview={false}
                        className="mb-2"
                        alt="itemtype-image"
                      />
                    </div>
                    <div className="ml-5">
                      <b>Item types</b>
                      <Breadcrumb separator=">">
                        <Breadcrumb.Item
                          // onClick={() => {
                          //   navigate(Dashboard);
                          // }}
                        >
                          Configuration
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Item types</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <Card className="noBorder transparent mt-6">
                <div className={Width > 1300 ? "w-100 endtoend" : "w-100 endtoend flex-column-reverse"}>
                  <div className={Width > 1300 ? "d-flex dashboardTabs" : "d-flex dashboardTabs justify-content-between"}>
                    <Tabs defaultActiveKey="all" activeKey={activeTab} className="tableTab mt-6" onChange={handleTabChange}>
                      <TabPane tab={`All (${count?.all})`} key="all"></TabPane>
                      <TabPane tab={`Individual (${count?.individual})`} key="individual"></TabPane>
                      <TabPane tab={`Corporate (${count?.company})`} key="company"></TabPane>
                    </Tabs>
                    {Width < 768 && UserType !== "SUPPORT_ENGINEER"? 
                    <Button
                      className="add-itemtype mx-3"
                      onClick={() => {
                        setIsAddModalVisible(true);
                      }}
                    >
                      + Add New Item
                    </Button> : "" }
                  </div>
                  <div className={Width > 767 ? "d-flex justify-content-end" :"d-flex flex-column my-2"}>
                    <Input
                      className="search-input-additem ml-3 px-3" 
                      placeholder="Search"
                      prefix={
                        <Image
                          src={Search}
                          alt="search"
                          className=""
                          preview={false}
                        />
                      }
                      value={typeof searchedKey === 'string' ? searchedKey : ""}
                      onInput={(e:any) => {
                        onSearch(e.target.value, 1, page);
                      }}
                    />
                    <div className={Width >767 ? "d-flex buttons-filter" : "d-flex buttons-filter justify-content-between w-100"}>
                    {!showFilter ? (
                      <>
                        <Button
                          className="filterbutton"
                          onClick={() => {setShowFilter(!showFilter),
                            form.resetFields()
                          }}
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
                      <Button className="filterbutton_selected text-center mx-2">
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
                  </div> 
                    {Width > 767 && UserType !== "SUPPORT_ENGINEER" ? 
                    <Button
                      className="add-itemtype"
                      onClick={() => {
                        setIsAddModalVisible(true);
                      }}
                    >
                      + Add New Item
                    </Button> : "" }
                  </div>
                </div>
                {showFilter &&  <>
                  <div className="filter-container mb-4 mt-3">
                    <Card className="grayCard p-3 filter-card">
                      <div className="bold-text">Filters</div>
                        <Form form={form} onFinish={(e)=>{handleFilterApply(e,1,page)}}>
                          <Row gutter={[24,16]}>
                              <Col  xl={6} lg={6} md={24} xs={24} >
                                <FormItem
                                  name="name"
                                  className="inputField mb-4 itemtype-filter-input"
                                >
                                  <Input
                                    placeholder="Item type"
                                  />
                              </FormItem>
                            </Col>
                            <Col  xl={6} lg={6} md={24} xs={24} >
                              <FormItem
                                name="itemCategory"
                                className="inputField mb-4 itemtype-filter-input"
                              >
                                <Select placeholder="Select item category">
                                  {itemTypeList.map((category:any) => (
                                    <Option key={category.aliasName} value={category.name}>
                                      {category.name}
                                    </Option>
                                  ))}
                                </Select>
                              </FormItem>
                            </Col>
                            <Col xl={6} lg={6} md={24} xs={24}>
                            <Form.Item
                              name="entityType"
                              className="entity-type"
                            >
                              <Select
                                className="w-100"
                                placeholder="Select entity type"
                              >
                                <Option value="INDIVIDUAL" > INDIVIDUAL </Option>
                                <Option value="COMPANY" > COMPANY </Option>
                              </Select>
                              </Form.Item>
                            </Col>
                            <Col xl={6} lg={6} md={24} xs={24}>
                                <FormItem
                                  name="status"
                                  className="inputField mb-4 itemtype-filter-input"
                                >
                                 <Select
                                placeholder="Select status"
                                className=""
                              >
                                <Option value="active" > Active </Option>
                                <Option value="suspended" > In-active </Option>
                              </Select>
                              </FormItem>
                            </Col>
                            <Col>
                              <div className="d-flex">
                                <div className="text-right">
                                  <Button
                                    className="rounded min-width-17 px-4 mt-0"
                                    htmlType="submit"
                                  >
                                    Apply
                                  </Button>
                                </div>
                                <div className="text-right mx-3">
                                  <Button type="default" className="white-no-border-button pt-0" onClick={handleResetAllClick}>
                                    Reset All
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                    </Card>
                  </div>
                </>}
                {ItemCategoryList.length > 0 ? (
                <>
                {UserType !== "SUPPORT_ENGINEER" ? 
                <div className="paymentLog-mobile-view mt-3">
                  {ItemCategoryList?.map((itemCategory: any, index:any) =>( 
                    <div key={index} className="mobile-card row">
                      {columns?.map((column:any, index:any) =>(
                        <div key={`${itemCategory.aliasName}-${index}`} className="sub-body col-6 col-sm-4">
                          <div className="mobile-header">
                            {column?.title}
                          </div>
                          <div className="">{column?.render(itemCategory[column.dataIndex],itemCategory)}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>:
                <div className="paymentLog-mobile-view mt-3">
                {ItemCategoryList?.map((itemCategory: any, index:any) =>( 
                  <div key={index} className="mobile-card row">
                    {SupportEngineercolumns?.map((column:any, index:any) =>(
                      <div key={`${itemCategory.aliasName}-${index}`} className="sub-body col-6 col-sm-4">
                        <div className="mobile-header">
                          {column?.title}
                        </div>
                        <div className="">{column?.render(itemCategory[column.dataIndex],itemCategory)}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>}
                <Table
                  columns={UserType ==="SUPPORT_ENGINEER"? SupportEngineercolumns :columns}
                  dataSource={ItemCategoryList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 paymentLogTable"
                  scroll={{ x: 1400 }}
                  rowKey={(record: any) => {
                    return record.aliasName;
                  }}
                  locale={locale.allLocale}
                />
                </>
                ):(
                  <Table
                  columns={UserType ==="SUPPORT_ENGINEER"? SupportEngineercolumns :columns}
                  dataSource={ItemCategoryList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 "
                  scroll={{ x: 1400 }}
                  rowKey={(record: any) => {
                    return record.aliasName;
                  }}
                  locale={locale.allLocale}
                />
                )}
                  {ItemCategoryList ?.length > 0 ? (
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
                    title={<p className="large-title">Add new item types</p>}
                    className="add-item-category-modal d-flex center"
                    open={isAddModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={() => setIsAddModalVisible(false)}
                  >
                    <hr className="break-line" />
                    <Form scrollToFirstError onFinish={onFinish} form={form}>
                      <div>
                  <Row>
                    <Col span={24}>
                      <p className="enter-text-category">Entity Type</p>

                      <Form.Item
                        name="entityType"
                        className="entity-type"
                      >
                        <Select
                          className="w-100"
                          placeholder="Select entity type"
                          onChange={(e: any) => { handleEntityType(e) }}
                        >
                          <Option value="INDIVIDUAL" > INDIVIDUAL </Option>
                          <Option value="COMPANY" > COMPANY </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                        <Row gutter={16}>
                          <Col span={Width > 991 ? 12 : 24}>
                            <p className="enter-text-category">Category name</p>
                            <Form.Item
                              className="modal_inputField select"
                              name="itemTypeAlias"
                              rules={[
                                {
                                  required: true,
                                  message: "Item category is required!",
                                },
                              ]}
                            >
                              <Select
                                className=""
                                placeholder="Select item category"
                                onChange={handleItemTypeChange} 
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                filterOption={(inputValue: any, item: any) =>
                                  item?.label.toLowerCase().includes(inputValue.toLowerCase())
                                }
                              >
                                {itemTypeList.map((item: any) => {
                                  return (
                                    <Option
                                      key={item.aliasName}
                                      value={item.aliasName}
                                      label={item.name}
                                    >
                                      <Row className="px-2">
                                        <Col>
                                          {item?.name} 
                                        </Col>
                                      </Row>
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={Width > 991 ? 12 : 24}>
                            <p className="enter-text-category">Item type name</p>
                            <Form.Item
                              name="itemCategory"
                              className="inputField w-100 error-input"
                              rules={[
                                {
                                  required: true,
                                  message: "Item type is required!",
                                },
                                {
                                  whitespace: true,
                                  message: "Enter valid item type!",
                                },
                              ]}
                            >
                              <Input placeholder="Enter item type name" onInput={handleCategoryNameChange}></Input>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16} className="mt-3">
                        <Col span={Width > 991 ? 12 : 24}>
                            <p className="enter-text-category">Platform charge type</p>
                            <Form.Item
                              name= "platformChargeType"
                              className="modal_inputField select"
                              initialValue={platformChargeType}
                              rules={[
                                {
                                  required: true,
                                  message: "Platform charge type is required!",
                                },
                              ]}
                            >
                              <Select
                                className=""
                                placeholder="Select platform charge type"
                                onChange={(e: any) => handlePlatformChargeType(e)} 
                              >
                                <Option value="FIXED" > Fixed </Option>
                                <Option value="PERCENT" > Percent </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={Width > 991 ? 12 : 24}>
                            <p className="enter-text-category">Platform fees</p>
                            <Form.Item
                              className="inputField w-100 error-input"
                              name="plateformFees"
                              rules={[
                                {
                                  whitespace: true,
                                  message: "Enter platform fees!",
                                },
                              ]}
                            >
                              <Input placeholder="Enter platform fees"></Input>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16} className="mt-3">
                          { platformChargeType === PLATFORM_CHARGE_TYPE.PERCENT && (
                          <Col span={Width > 991 ? 12 : 24}>
                            <p className="enter-text-category">Minimum platform fees</p>
                            <Form.Item
                              className="inputField w-100 error-input"
                              name="minimumPlatformCharge"
                            >
                              <Input placeholder="Enter minimum platform fees"></Input>
                            </Form.Item>
                          </Col>
                          )}
                          <Col span={Width > 991 ? 12 : 24}>
                            <p className="enter-text-category">VAT charges</p>
                            <Form.Item
                              className="inputField w-100 error-input"
                              name="vatCharges"
                              rules={[
                                {
                                  whitespace: true,
                                  message: "Enter VAT charges!",
                                },
                              ]}
                            >
                              <Input placeholder="Enter VAT charges"></Input>
                            </Form.Item>
                          </Col>
                          <Col span={Width > 991 ? 12 : 24}>
                            <p className="enter-text-category">Minimum agreement amount</p>
                            <Form.Item
                              className="inputField w-100 error-input"
                              name="minimumInvoiceAmount"
                            >
                              <Input placeholder="Enter minimum agreement amount"></Input>
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                      {errorMessage && (
                        <p className="errMsg mx-2">{errorMessage}</p>
                      )}
                      <div className={Width > 991 ?"d-flex my-4" :"d-flex my-4 justify-content-center"}>
                        <Button
                          className="modal-button mx-3"
                          key="submit"
                          htmlType="submit"
                        >
                          Save
                        </Button>
                        <Button
                          className="modal-button-cancel"
                          onClick={() => {
                            setIsAddModalVisible(false);
                            form.resetFields();
                            setErrorMessage("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </Modal>
                  <Modal
                    title={<p className="large-title">Edit item types</p>}
                    className="add-item-category-modal d-flex center"
                    open={isEditModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={handleCancel}
                  >
                    <hr className="break-line" />
                    <Row gutter={16} className="mt-3">
                      <Col span={Width > 991 ? 12 : 24}>
                        <p className="enter-text-category">Item category</p>
                        <Form.Item name="title" className="modal_inputField">
                          <Select
                            placeholder={itemDetails?.itemcategoryname}
                            disabled
                          ></Select>
                        </Form.Item>
                      </Col>
                      <Col span={Width > 991 ? 12 : 24}>
                        <p className="enter-text-category">Item type name</p>
                        <Form.Item className="inputField w-100 error-input">
                          <Input 
                            placeholder="Item type name" 
                            value={CurrentCategory}
                            onInput={handleCategoryNameChange} 
                            maxLength={50}>
                          </Input>
                          </Form.Item>
                          {!CurrentCategory ? (
                            <p className="errMsg">Please enter item type name</p>
                            ) : (
                              ""
                          )} 
                      </Col>
                    </Row>
                    <Row gutter={16} className="mt-3">
                        <Col span={Width > 991 ? 12 : 24}>
                            <p className="enter-text-category">Platform charge type</p>
                            <Form.Item
                              className="modal_inputField select"
                              rules={[
                                {
                                  required: true,
                                  message: "Platform charge type is required!",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Select platform charge type"
                                onChange={(e:any)=>{handleItemTypeChange(),setPlatformChargeType(e);}} 
                                value={platformChargeType}
                              >
                                <Option value="FIXED" > Fixed </Option>
                                <Option value="PERCENT" > Percent </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                      <Col span={Width > 991 ? 12 : 24}>
                        <p className="enter-text-category">Platform fees</p>
                        <Form.Item className="inputField w-100 error-input">
                          <Input
                            placeholder="Enter platform fees"
                            value={plateformFees}
                            onInput={handlePlateformFeesChange}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16} className="mt-3">
                      {platformChargeType === PLATFORM_CHARGE_TYPE.PERCENT && ( 
                        <Col span={Width > 991 ? 12 : 24}>
                          <p className="enter-text-category">Minimum platform fees</p>
                          <Form.Item
                            className="inputField w-100 error-input"
                          >
                            <Input 
                            placeholder="Enter minimum platform fees" 
                            value={minimumPlatformCharge}
                            onChange={handleminimumPlatformChargeChange}>
                            </Input>
                          </Form.Item>
                        </Col>
                      )}
                      <Col span={Width > 991 ? 12 : 24}>
                        <p className="enter-text-category">VAT charges</p>
                        <Form.Item className="inputField w-100 error-input">
                          <Input
                            placeholder="Enter VAT charges"
                            value={vatCharges}
                            onInput={handleVatChargesChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={Width > 991 ? 12 : 24}>
                        <p className="enter-text-category">Minimum agreement amount</p>
                        <Form.Item
                          className="inputField w-100 error-input"
                        >
                          <Input 
                          placeholder="Enter minimum agreement amount" 
                          value={minimumInvoiceAmount}
                          onChange={handleminimumInvoiceAmountChange}>
                          </Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    {editErrorMessage && <p className="errMsg mx-2">{editErrorMessage}</p>}
                    <div className={Width > 991 ?"d-flex my-4 gap-3" :"d-flex my-4 justify-content-center gap-3"}>
                    {(CurrentCategory &&
                      itemDetails?.name != CurrentCategory) || (plateformFees && initialValues?.plateformFees != plateformFees) ||
                      (vatCharges && initialValues?.vatCharges != vatCharges) || (initialValues?.minimumInvoiceAmount != minimumInvoiceAmount) || ( initialValues?.minimumPlatformCharge != minimumPlatformCharge) || (platformChargeType && initialValues?.platformChargeType != platformChargeType) || ((initialValues?.minimumPlatformCharge != minimumPlatformCharge) && (minimumPlatformCharge === PLATFORM_CHARGE_TYPE.PERCENT && minimumPlatformCharge && initialValues?.minimumPlatformCharge != minimumPlatformCharge)) ? (
                        <Button
                          className="modal-button"
                          htmlType="submit"
                          onClick={() => {
                            updateItemName();
                          }}
                        >
                          Update
                        </Button>
                      ) : (
                        <Button className="modal-button disabled">
                          Update
                        </Button>
                      )}
                      <Button
                        className="modal-button-cancel"
                        onClick={() => {
                          setIsEditModalVisible(false);
                          form.resetFields();
                          setEditErrorMessage("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Modal>
                  {/* Delete  */}
                  <Modal
                    title={
                      <div className="modal-title">
                        <div className="warning-icon center mt-4">
                          <Image
                            src={Warning}
                            alt="Warning"
                            preview={false}
                            height={68}
                            width={75}
                          />
                        </div>

                        <div className="warning-text center bold">Warning!</div>
                      </div>
                    }
                    className="modal-box center"
                    open={isReloadModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={handleCancel}
                    width={Width > 650 ? 600 : 400}
                  >
                    <p className="sub-text fw-400 center">
                      Deleting item type will delete all the dynamic input
                      fields linked with that item type Are you sure you
                      want to delete this item type?
                    </p>
                    <div className="d-flex center">
                      <Button
                        className="modal-button mx-3 my-4"
                        htmlType="submit"
                        onClick={() => removeItemType()}
                      >
                        Delete
                      </Button>
                      <Button
                        className="modal-button-cancel my-4"
                        onClick={() => handleCancel()}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Modal>
              </Card>
              </DefaultLayout>
            </div>
    </div>
  );
};

export default ItemCategory;
