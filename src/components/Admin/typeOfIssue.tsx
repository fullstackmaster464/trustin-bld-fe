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
  } from "antd";
  import Editicon from "../../assets/img/EditIcon.svg";
  import Itemdelete from "../../assets/img/ItemDeleteIcon.svg";
  import TabPane from "antd/lib/tabs/TabPane";
  import { useEffect, useState } from "react";
  import itemtypeIcon from "../../assets/img/typeofissuebg.svg";
  import Search from "../../assets/img/search.svg";
  import moment from "moment";
  import {
      TypeofIssueStatus,
    createTypeOfIssue,
    deleteTypeOfIssue,
    editTypeofissue,
    getTypeOfIssueList,
    searchTypeOfIssue,
  } from "../../services/admin";
  import "../../assets/scss/custom.scss";
  import Warning from "../../assets/img/warningicon.svg";
  import { USER_STATUS_TEXT, getLocalStorage } from "../Common/Constants";
  import DefaultLayout from "../Common/DefaultLayout";
  import emptyCard from "../../assets/img/emptyCard.svg"; 

const TypeOfIssue = ():any => {
    const [IssueList, setIssueList] = useState<any>([]);
    const [page, setPage] = useState(10);
    const [count, setCount] = useState(0);
    const [current, setCurrent] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [issueDetails, setIssueDetails] = useState<any>({});
    const [createError, setcreateError] = useState("");
    const [index, setIndex] = useState<any>();
    const [issueUpdatedValue, setIssueUpdatedValue] = useState("");
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [searchedKey, setSearchedKey] = useState("");
    const [loading, setLoading] = useState(false);

    const { TextArea } = Input;
    const [Width, setWidth] = useState(document?.body?.clientWidth);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    const adminAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
    const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;
  
    const handleChange = (value: number) => {
      setPage(value);
      setCurrent(1);
      if (searchedKey?.length > 0) {
        onSearch(searchedKey, 1, value);
      } else {
        fetchTypeOfIssue(1, value);
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
      setIssueUpdatedValue(e.target.value);
      setcreateError("");
    };
  
    const onChangePage = (pageno: number) => {
      setCurrent(pageno);
      if (searchedKey?.length > 0) {
        onSearch(searchedKey, pageno, page);
      } else {
        fetchTypeOfIssue(pageno, page);
      }
    };
    const updateTypeOfIssue = () => {
      const params = {
        aliasName: issueDetails?.aliasName,
        typeofissue: issueUpdatedValue,
      };
      editTypeofissue(params).then(() => {
        const list = [...IssueList];
        list[index].name = issueUpdatedValue;
        setIssueList([...list]);
        setIssueDetails({});
        setIsEditModalVisible(false);
        setIssueUpdatedValue("");
        setIndex("");
      });
    };
  
    const createNewTypeOfIssue = () => {
      if (!issueUpdatedValue) {
        setcreateError("Please type of issue name");
      } else {
        const params = {
          createdBy: adminAlias,
          typeofissue: issueUpdatedValue,
        };
        createTypeOfIssue(params).then(() => {
          fetchTypeOfIssue(current, page);
          setIssueDetails({});
          setIsAddModalVisible(false);
          setIssueUpdatedValue("");
          setcreateError("");
        })
        .catch((error) => {
          if (error?.response && error?.response?.status === 409) {
            setcreateError("An error occurred while creating the type of issue"); 
          } else {
            setcreateError("type of issue name already exists");
          }
        });
      }
    };
    const removeTypeOfIssue = () => {
        deleteTypeOfIssue(issueDetails?.aliasName).then(() => {
        fetchTypeOfIssue(current, page);
        setIssueDetails({});
        setIsDeleteModalVisible(false);
        setIndex("");
      });
    };
    const updateStatus = (values: any, status: string, index: number) => {
      const params = {
        status: status,
        aliasName: values?.aliasName,
      };
      setLoading(true);
      TypeofIssueStatus(params).then(() => {
        setLoading(false);
        const list: any = [...IssueList];
        list[index].status = status;
        setIssueList([...list]);
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
        title: "Type of issue",
        dataIndex: "name",
        sorter: false,
        width: 230,
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
              {isSmallScreen ? (
                <>
                <div>
                  <span className="edit-text cursor">
                    Edit
                  </span>
                  <Image
                    src={Editicon}
                    alt="edit"
                    preview={false}
                    className="cursor mx-2"
                    height={17}
                    width={17}
                    onClick={() => {
                      if(UserType === "SUPPORT_ENGINEER"){
                        setIsEditModalVisible(false)
                      }
                      else{
                      setIsEditModalVisible(true);
                      setIssueDetails(value);
                      setIssueUpdatedValue(text);
                      setIndex(index);
                      }
                    }}
                  />
                </div>
                <div className="mx-4">
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
                      if(UserType === "SUPPORT_ENGINEER"){
                        setIsDeleteModalVisible(false)
                      }
                      else{
                      setIssueDetails(value);
                      setIsDeleteModalVisible(true);
                      setIssueUpdatedValue(text);
                      setIndex(index);
                      }
                    }}
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
                  setIssueDetails(value);
                  setIssueUpdatedValue(text);
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
                  setIssueDetails(value);
                  setIsDeleteModalVisible(true);
                  setIssueUpdatedValue(text);
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
        title: "Type of issue",
        dataIndex: "name",
        sorter: false,
        width: 230,
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
    
    const fetchTypeOfIssue = (current: number, page: number) => {
      setLoading(true);
      getTypeOfIssueList(current > 0 ? current - 1 : 0, page || 10)
        .then((response) => {
          setLoading(false);
          setIssueList(response.data.data);
          setCount(response?.data?.count);
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
      fetchTypeOfIssue(current, page);
      window.addEventListener('resize', ()=>{
        setWidthVal()
      });
      return () => window.removeEventListener('resize', setWidthVal);
  
    }, []);
  
    const onSearch = (e: string, currentPage: number, page: number) => {
      setLoading(true);
      if (e) {
        setSearchedKey(e);
        const reqBody = { key: e };
        searchTypeOfIssue(currentPage > 0 ? currentPage - 1 : 0, page || 10, reqBody)
          .then((response) => {
            setLoading(false);
            setIssueList(response.data.data);
            setCount(response?.data?.count);
            setTotalPage(response?.data?.lastPage * page);
          })
          .catch(() => {
            setLoading(false);
            message.error("Could not fetch details. Please try again later");
          });
      } else {
        setSearchedKey("");
        fetchTypeOfIssue(1, page);
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
  
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="config_issue"
        // loading={loading}
        TitleText="Type of issue"
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
            <b>Type of issue</b>
            <Breadcrumb separator=">">
              <Breadcrumb.Item
                // onClick={() => {
                //   navigate(Dashboard);
                // }}
              >
                Configuration
              </Breadcrumb.Item>
              <Breadcrumb.Item>Type of issue</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      }
      >
              <Card className="noBorder transparent mt-6">
                <div  id="paymentLogTab" className="w-100 endtoend">
                  <div className="d-flex disputeTabs">
                    <Tabs defaultActiveKey="all" className="tableTab mt-6">
                      <TabPane tab={`All (${count})`} key="all"></TabPane>
                    </Tabs>
                  </div>
                  <div className="d-flex search-addBtn">
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
                    { UserType !== "SUPPORT_ENGINEER" &&
                    <Button
                      className="add-itemtype-issue addBtn"
                      onClick={() => {
                        setIsAddModalVisible(true);
                      }}
                    >
                      + Add New Issue
                    </Button>
                     }
                  </div>
                </div>
                {IssueList && IssueList?.length > 0 ? (
                  <>
                  {UserType !== "SUPPORT_ENGINEER" ? 
                    <div className="itemTypes-mobile-view">
                      {IssueList.map((itemtype: any, Index: any) => (
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
                </div>:
                <div className="itemTypes-mobile-view">
                {IssueList.map((itemtype: any, Index: any) => (
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
                  dataSource={IssueList}
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
                  dataSource={IssueList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 w-100"
                  scroll={{ x: 992 }}
                  locale={locale.allLocale}
                /> 
              )} 
                {IssueList?.length > 0 ? (
                      <div className="w-100 endtoend my-2 pagination-range">
                        <div className="show">
                          Show
                          <Select
                            defaultValue={page}
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
                      Deleting type of issue will delete all the dynamic input
                      fields linked with that type of issue Are you sure you want to
                      delete this issue?
                    </p>
                    <div className="d-flex center">
                      <Button
                        className="modal-button mx-3 my-4"
                        htmlType="submit"
                        onClick={() => removeTypeOfIssue()}
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
                    title={<p className="large-title">Add type of issue</p>}
                    className="modal-box"
                    open={isAddModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={handleCancel}
                  >
                    <hr className="break-line" />
                    <div>
                      <p className="enter-text">Enter type of issue</p>
                      <TextArea
                        rows={4}
                        placeholder="Type your issue name here"
                        className="modalTextArea mt-2 pt-2 "
                        value={issueUpdatedValue}
                        onChange={handleInputChange}
                      />
                      {createError &&
                        <p className="errMsg">{createError}</p>
                      }
                    </div>
                    <div className={Width < 992 ? "d-flex w-100 my-4 justify-content-center":"d-flex my-4 "}>
                      {issueUpdatedValue ? (
                        <Button
                          className="modal-button"
                          htmlType="submit"
                          onClick={() => {
                            createNewTypeOfIssue();
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
                          setcreateError("")
                          setIssueUpdatedValue("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Modal>
                  <Modal
                    title={<p className="large-title">Edit type of issue</p>}
                    className="modal-box"
                    open={isEditModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={handleCancel}
                  >
                    <hr className="break-line" />
                    <div>
                      <p className="enter-text">Edit type of issue</p>
                      <TextArea
                        rows={4}
                        placeholder="Write your reason here"
                        className="modalTextArea mt-2 pt-2 "
                        value={issueUpdatedValue}
                        onInput={(e: any) => {
                          setIssueUpdatedValue(e.target.value);
                        }}
                      />
                      {!issueUpdatedValue ? (
                        <p className="errMsg">Please type issue name</p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className={Width < 992 ? "d-flex w-100 my-4 justify-content-center gap-3":"d-flex my-4 gap-3"}>
                      {issueUpdatedValue &&
                      issueDetails?.name != issueUpdatedValue ? (
                        <Button
                          className="modal-button"
                          htmlType="submit"
                          onClick={() => {
                            updateTypeOfIssue();
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
                        onClick={() =>{setIsEditModalVisible(false),setIssueUpdatedValue("")}}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Modal>
              </Card>
              </DefaultLayout>
            </div>
            </div>
  )
}

export default TypeOfIssue
