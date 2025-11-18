import {
  Breadcrumb,
  Button,
  Card,
  Image,
  Input,
  Pagination,
  Select,
  Table,
  Tabs,
  Switch,
  Modal,
  message,
  Row,
  Col,
  Form,
} from "antd";
import { Option } from "antd/lib/mentions";
import Editicon from "../../assets/img/EditIcon.svg";
import Itemdelete from "../../assets/img/ItemDeleteIcon.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import itemtypeIcon from "../../assets/img/itemcategorybg.svg";
import filterIcon from "../../assets/img/filter.svg";
import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import Search from "../../assets/img/search.svg";
import moment from "moment";
import {
  createItemType,
  deleteItemType,
  editItemType,
  getAllItemType,
  getItemCategoryFilter,
  getItemTypeList,
  searchItemType,
  updateItemTypeStatus,
} from "../../services/admin";
import "../../assets/scss/custom.scss";
import Warning from "../../assets/img/warningicon.svg";
import { USER_STATUS_TEXT, getLocalStorage } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
import emptyCard from "../../assets/img/emptyCard.svg"; 
import FormItem from "antd/es/form/FormItem";
const ItemTypes = ():any => {
  const [ItemTypeList, setItemTypeList] = useState<any>([]);
  const [page, setPage] = useState(10);
  const [count, setCount] = useState({
    all:0,
    individual: 0,
    company: 0
  });
  const [current, setCurrent] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [totalPage, setTotalPage] = useState(0);
  const [itemDetails, setItemDetails] = useState<any>({});
  const [index, setIndex] = useState<any>();
  const [ItemUpdatedValue, setItemUpdatedValue] = useState("");
  const[entityValue, setEntityValue] = useState<any>("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [searchedKey, setSearchedKey] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const adminAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;
  
  const [form] = Form.useForm();
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    if (typeof searchedKey === 'string' && searchedKey?.length > 0) {
      onSearch(searchedKey, 1, value);
    } 
    else if (Object.keys(searchedKey)?.length > 0 && (searchedKey.name || searchedKey.entityType || searchedKey.status)) {
      handleFilterApply(searchedKey,1,value)
    }else {
      fetchItemType(1, value);
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItemUpdatedValue(e.target.value);
  };

  const handleEntityType = (e:any)=>{
    setEntityValue(e)
  }
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    if (Object.keys(searchedKey)?.length > 0) {
      handleFilterApply(searchedKey,pageno,page)
    }
    else if (searchedKey?.length > 0) {
      onSearch(searchedKey, pageno, page);
    } else {
      fetchItemType(pageno, page);
    }
  };
  const updateItemTypeName = () => {
    const params = {
      itemTypeAlias: itemDetails?.aliasName,
      itemType: ItemUpdatedValue,
      entityType : entityValue
    };
    editItemType(params).then(() => {
      fetchItemType(current, page);
      const list = [...ItemTypeList];
      list[index].name = ItemUpdatedValue;
      fetchItemType(current, page);
      setItemTypeList([...list]);
      setItemDetails({});
      setIsEditModalVisible(false);
      setItemUpdatedValue("");
      setEntityValue("")
      setIndex("");
    }).catch((error:any)=>{
      const err = error?.data?.error?.message
      message.error(err)
     
    });
  };

  const createNewItemType = () => {
    if (!ItemUpdatedValue) {
      message.error("Please type item name");
    } else {
      const params = {
        createdBy: adminAlias,
        itemType: ItemUpdatedValue,
        entityType : entityValue
      };
      createItemType(params).then(() => {
        fetchItemType(current, page);
        setItemDetails({});
        setIsAddModalVisible(false);
        setItemUpdatedValue("");
        setEntityValue("")
        form.resetFields()
      })
      .catch((error) => {
        const err = error?.data?.error?.message
        if (error?.response && error?.response?.status === 409) {
          message.error("An error occurred while creating the item category")
          message.error("check")
        } else {
          message.error(err)
        }
      });
    }
  };
  const removeItemType = () => {
    deleteItemType(itemDetails?.aliasName).then(() => {
      fetchItemType(current, page);
      setItemDetails({});
      setIsDeleteModalVisible(false);
      setIndex("");
    });
  };
  const updateStatus = (values: any, status: string, index: number) => {
    const params = {
      status: status,
      itemTypeAlias: values?.aliasName,
    };
    setLoading(true);
    updateItemTypeStatus(params).then(() => {
      setLoading(false);
      const list: any = [...ItemTypeList];
      list[index].status = status;
      setItemTypeList([...list]);
    });
  };
  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
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

  const columns = [
    {
      title: "Item Category",
      dataIndex: "name",
      sorter: false,
      width: 230,
    },
    {
      title: "Entity Type",
      dataIndex: "entityType",
      sorter: false,
      width: 230,
      render: (text:any) => text || "--", 
    },
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      width: 230,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>
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
          <div className="mx-3">
            {text === "active" ? (
              <Switch
                checked={true}
                onClick={() => {
                  updateStatus(value, "suspended", index);
                }}
              />
            ) : (
              <Switch
                checked={false}
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
      dataIndex: "name",
      sorter: false,
      width: 80,
      
      render: (text: string, value: any, index: number) => {

        return (
          <div className="d-flex">
            {/* <Image src={View} alt="view" preview={false} className="cursor" /> */}
            {isSmallScreen  ? (
              <>
              <div>
                <span className="edit-text cursor" >
                  Edit
                </span>
                <Image
                  src={Editicon}
                  alt="edit"
                  preview={false}
                  className= "cursor mx-2"
                  height={17}
                  width={17}
                  onClick={() => {
                    setIsEditModalVisible(true);
                    setItemDetails(value);

                    setItemUpdatedValue(text);
                    setEntityValue(value.entityType)
                    setIndex(index);}
                  }
                />
              </div>
              <div className="mx-4" >
                <span className="delete-text cursor">
                  Delete
                </span>
                <Image
                  src={Itemdelete}
                  alt="delete"
                  preview={false}
                  className="cursor mx-2"
                  height={17}
                  width={15.11}
                  onClick={() => {
                    setItemDetails(value);
                    setIsDeleteModalVisible(true);
                    setItemUpdatedValue(text);
                    setIndex(index);
                    }
                  }
                />
              </div>
              </>
            ):(
            <>
         
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
                setItemUpdatedValue(text);
                setEntityValue(value.entityType)
                setIndex(index);
              }}
            />
            <Image
              src={Itemdelete}
              alt="delete"
              preview={false}
              className="cursor mx-3"
              height={17}
              width={15.11}
              onClick={() => {
                setItemDetails(value);
                setIsDeleteModalVisible(true);
                setItemUpdatedValue(text);
                setIndex(index);
              }}
            />
            </>
            )}
          </div>
        );
      },
    },
  ];
  const SupportEngineercolumns = [
    {
      title: "Item Category",
      dataIndex: "name",
      sorter: false,
      width: 230,
    },
    {
      title: "Entity Type",
      dataIndex: "entityType",
      sorter: false,
      width: 230,
      render: (text:any) => text || "--", 
    },
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      width: 230,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>
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
   
  ];
  const fetchItemType = (current: number, page: number) => {
    setLoading(true);
    getItemTypeList(current > 0 ? current - 1 : 0, page || 10)
      .then((response) => {
        setLoading(false);
        setItemTypeList(response.data.data);
        setCount({
          all: response?.data?.count,
          individual: response?.data?.individualCount,
          company: response?.data?.companyCount,
        });
        setTotalPage(response?.data?.lastPage * page);
      })
      .catch(() => {
        setLoading(false);
        message.error("Could not fetch details. Please try again later");
      });
  };
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  useEffect(() => {
    fetchItemType(current, page);
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);

  }, []);

  const onTabChange = (entityType: any) => {
    setLoading(true)
    getAllItemType(entityType).then((res : any)=> {
      setLoading(false)
      setItemTypeList(res.data);
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
      fetchItemType(1, page);
    }
  };

  const onSearch = (e: string, currentPage: number, page: number) => {
    setLoading(true);
    if (e) {
      setSearchedKey(e);
      const reqBody = { key: e };
      searchItemType(currentPage > 0 ? currentPage - 1 : 0, page || 10, reqBody)
        .then((response) => {
          setLoading(false);
          setItemTypeList(response.data.data);
          setCount({
            all: response?.data?.count,
            individual:0,
            company:0,
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
      fetchItemType(1, page);
    }
  };

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
// filter 
const handleFilterApply = (e:any, current :number, pageSize:number) =>{
  setLoading(true)
  setSearchedKey(e)
  getItemCategoryFilter(current > 0 ? current -1 : 0,
    pageSize || 10,e).then((res : any)=>{
      setLoading(false)
      setItemTypeList(res.data.data);
      setCount({
        all: res?.data?.count,
        individual: res?.data?.individualCount,
        company: res?.data?.companyCount,
      });
          setTotalPage(res?.data?.lastPage * pageSize);
          setCurrent(current);
          setActiveTab("all")
    })
}

const handleResetAllClick = () => {
  form.resetFields()
  setSearchedKey("")
  fetchItemType(current, page);
  setActiveTab("all")
}
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="config_type"
        // loading={loading}
        TitleText="Item Categories"
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
            <b>Item categories</b>
            <Breadcrumb separator=">">
              <Breadcrumb.Item
                // onClick={() => {
                //   navigate(Dashboard);
                // }}
              >
                Configuration
              </Breadcrumb.Item>
              <Breadcrumb.Item>Item categories</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      }
      >
              <Card className="noBorder transparent mt-6">
                <div className={Width > 1300 ? "w-100 endtoend" : "w-100 endtoend flex-column-reverse"}>
                  <div className={Width > 1300 ? "d-flex dashboardTabs" : "d-flex dashboardTabs justify-content-between"}>
                    <Tabs defaultActiveKey="all" activeKey={activeTab} onChange={handleTabChange} className="tableTab mt-6">
                      <TabPane tab={`All (${count.all})`} key="all"></TabPane>
                      <TabPane tab={`Individual (${count.individual})`} key="individual"></TabPane>
                      <TabPane tab={`Corporate (${count.company})`} key="company"></TabPane>
                    </Tabs>
                    {Width < 768 && UserType !== "SUPPORT_ENGINEER" ? 
                    <Button
                    className="add-itemtype"
                      onClick={() => {
                        setIsAddModalVisible(true);
                      }}
                    >
                      + Add New Item
                    </Button> : "" }

                  </div>
                  <div className={Width > 767 ? "d-flex justify-content-end" :"d-flex flex-column my-2"}>
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
                      className="add-itemtype addBtn"
                      onClick={() => {
                        setIsAddModalVisible(true);
                      }}
                     
                    >
                      + Add New Item 
                    </Button>: "" }
                  </div>
                </div>
                {showFilter &&  <>
                  <div className="filter-container mb-4 mt-3">
                    <Card className="grayCard p-3 filter-card">
                      <div className="bold-text">Filters</div>
                        <Form form={form} onFinish={(e)=>{handleFilterApply(e,1,page)}}>
                          <Row gutter={[24,24]}>
                            <Col  xl={8} lg={12} md={24} xs={24} >
                                <FormItem
                                  name="name"
                                  className="inputField mb-4 itemtype-filter-input"
                                >
                                  <Select placeholder="Select item category">
                                    {ItemTypeList.map((categoryName: any) => (
                                      <Option key={categoryName.aliasName} value={categoryName.name}>
                                        {categoryName.itemcategoryname}
                                      </Option>
                                    ))}
                                  </Select>
                              </FormItem>
                            </Col>
                            <Col xl={8} lg={12} md={24} xs={24}>
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
                            <Col xl={8} lg={12} md={24} xs={24}>
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
                              <div className="d-flex justify-content-end">
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
                {ItemTypeList.length > 0 ? (
                  <>
                  {UserType !== "SUPPORT_ENGINEER" ? 
                  <div className="itemTypes-mobile-view">
                      {ItemTypeList.map((itemtype: any, Index: any) => (
                        <div className="mobile-card row" key={Index}>
                          {columns.map((column, index) => (
                            <div key={`${itemtype.name}-${index}`} className="sub-body col-6 col-sm-4">
                              <div className="mobile-header">
                                {column.title}
                              </div>
                              <div className="mobile-data">{column.render ? column.render(itemtype[column.dataIndex],itemtype,Index) : itemtype[column.dataIndex]}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div> :
                <div className="itemTypes-mobile-view">
                {ItemTypeList.map((itemtype: any, Index: any) => (
                  <div className="mobile-card row" key={Index}>
                    {SupportEngineercolumns.map((column, index) => (
                      <div key={`${itemtype.name}-${index}`} className="sub-body col-6 col-sm-4">
                        <div className="mobile-header">
                          {column.title}
                        </div>
                        <div className="mobile-data">{column.render ? column.render(itemtype[column.dataIndex]) : itemtype[column.dataIndex]}</div>
                  </div>
                   ))}
                  </div>
                  ))}
                </div>}
                    
                <Table
                  columns={UserType ==="SUPPORT_ENGINEER"? SupportEngineercolumns :columns}
                  dataSource={ItemTypeList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 w-100 paymentLogTable"
                  scroll={{ x: 992 }}
                  locale={locale.allLocale}
                /> 
              </>
              ):(
              <Table
                  columns={UserType ==="SUPPORT_ENGINEER"? SupportEngineercolumns :columns}
                  dataSource={ItemTypeList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 w-100"
                  scroll={{ x: 992 }}
                  locale={locale.allLocale}
                /> 
              )} 
                {ItemTypeList?.length > 0 ? (
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
                  {/* Delete Item */}
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
                    open={isDeleteModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={handleCancel}
                    width={Width < 650 ? 400 : 600}
                  >
                    <p className="sub-text fw-400 center">
                      Deleting item category will delete all the dynamic input
                      fields linked with that item category Are you sure you want to
                      delete this item category?
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
                  {/* Create new item */}
                  <Modal
                    title={<p className="large-title">Add item category</p>}
                    className="modal-box"
                    open={isAddModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={handleCancel}
                  >
                    <hr className="break-line" />
                    <div>
                      <p className="enter-text">Enter item category</p>
                      <TextArea
                        rows={4}
                        placeholder="Type your item name here"
                        className="modalTextArea mt-2 pt-2 "
                        value={ItemUpdatedValue}
                        onChange={handleInputChange}
                      />
                      {/* {createError &&
                        <p className="errMsg">{createError}</p>
                      } */}
                      <Form form={form}>
                     <Row gutter={16} className="mt-3">
                        <Col span={24}>
                            <p className="enter-text-category">Entity type</p>
                              <Form.Item
                              name="entityType"
                              className="entity-type"
                              >
                              <Select
                                className="w-100"
                                placeholder="Select entity type"
                                onChange={(e:any)=>{handleEntityType(e)}}
                                defaultActiveFirstOption={entityValue}
                              >
                                <Option value="INDIVIDUAL" > INDIVIDUAL </Option>
                                <Option value="COMPANY" > COMPANY </Option>
                              </Select>
                              </Form.Item>
                          </Col>
                      </Row>
                      </Form>
                    </div>
                    <div className={Width < 992 ? "d-flex w-100 mt-5 mb-3 justify-content-center":"d-flex mt-5 mb-3 "}>
                      {ItemUpdatedValue !=="" && entityValue !=="" ? (
                        <Button
                          className="modal-button"
                          htmlType="submit"
                          onClick={() => {
                            createNewItemType();
                          }}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button className="modal-button disabled">
                          Submit
                        </Button>
                      )}
                      <Button
                        className="modal-button-cancel ml-3"
                        onClick={() => {
                          setIsAddModalVisible(false)
                          setItemUpdatedValue("")
                          setEntityValue("")
                          form.resetFields()
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Modal>
                  <Modal
                    title={<p className="large-title">Edit item category</p>}
                    className="modal-box"
                    open={isEditModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={handleCancel}
                  >
                    <hr className="break-line" />
                    <div>
                      <p className="enter-text">Edit item category</p>
                      <TextArea
                        rows={4}
                        placeholder="Write your reason here"
                        className="modalTextArea mt-2 pt-2 "
                        value={ItemUpdatedValue}
                        onInput={(e: any) => {
                          setItemUpdatedValue(e.target.value);
                        }}
                      />
                      {!ItemUpdatedValue ? (
                        <p className="errMsg">Please type item name</p>
                      ) : (
                        ""
                      )}
                      <Row gutter={16} className="mt-3">
                        <Col span={24}>
                            <p className="enter-text-category">Entity type</p>
                              <Select
                                className="w-100"
                                placeholder="Select platform charge type"
                                value={entityValue}
                                onChange={(e:any)=>{handleEntityType(e)}}
                               
                              >
                                <Option value="INDIVIDUAL" > INDIVIDUAL </Option>
                                <Option value="COMPANY" > COMPANY </Option>
                              </Select>
                          </Col>
                      </Row>
                    </div>
                    <div className={Width < 992 ? "d-flex w-100 my-4 justify-content-center gap-3":"d-flex my-4 gap-3"}>
                      {ItemUpdatedValue &&
                      itemDetails?.name != ItemUpdatedValue || itemDetails?.entityType != entityValue? (
                        <Button
                          className="modal-button"
                          htmlType="submit"
                          onClick={() => {
                            updateItemTypeName();
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
                        style={{width:'140px'}}
                        onClick={() => {
                             setIsEditModalVisible(false);
                             setItemUpdatedValue("");
                            setEntityValue("");
                          }}
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

export default ItemTypes;
