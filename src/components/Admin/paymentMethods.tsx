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
  import TabPane from "antd/lib/tabs/TabPane";
  import { useEffect, useState } from "react";
  import itemtypeIcon from "../../assets/img/paymentmethodsbg.svg";
  import moment from "moment";
  import {
    PaymentMethodsStatus,
    createPaymentMethods,
    getAllPaymentMethodsList,
  } from "../../services/admin";
  import "../../assets/scss/custom.scss";
  import { USER_STATUS_TEXT, getLocalStorage } from "../Common/Constants";
  import DefaultLayout from "../Common/DefaultLayout";
  import emptyCard from "../../assets/img/emptyCard.svg"; 

const PaymentMethods = ():any => {
    const [PaymentMethodList, setPaymentMethodList] = useState<any>([]);
    const [page, setPage] = useState(10);
    const [count, setCount] = useState(0);
    const [current, setCurrent] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [createError, setcreateError] = useState("");
    const [methodNameUpdatedValue, setMethodNameUpdatedValue] = useState("");
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { TextArea } = Input;
    const [Width, setWidth] = useState(document?.body?.clientWidth);
    const adminAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
    const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;

    const handleChange = (value: number) => {
      setPage(value);
      setCurrent(1);
      fetchPaymentMethods(1, value);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMethodNameUpdatedValue(e.target.value);
      setcreateError("");
    };
  
    const onChangePage = (pageno: number) => {
      setCurrent(pageno);
      fetchPaymentMethods(pageno, page);
    };
  
    const createNewPaymentMethod = () => {
      if (!methodNameUpdatedValue) {
        setcreateError("Please type of issue name");
      } else {
        const params = {
          createdBy: adminAlias,
          name: methodNameUpdatedValue,
        };
        createPaymentMethods(params).then(() => {
          fetchPaymentMethods(current, page);
          setIsAddModalVisible(false);
          setMethodNameUpdatedValue("");
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

    const updateStatus = (values: any, status: string, index: number) => {
      const params = {
        status: status,
        id: values?.id,
      };
      setLoading(true);
      PaymentMethodsStatus(params).then(() => {
        setLoading(false);
        const list: any = [...PaymentMethodList];
        list[index].status = status;
        setPaymentMethodList([...list]);
      });
    };

    const handleCancel = () => {
      setIsAddModalVisible(false);
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
        title: "Name",
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
      }
    ];
    const supportEngineeercolumns = [
      {
        title: "Name",
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
    
    
    const fetchPaymentMethods = (current: number, page: number) => {
      setLoading(true);
      getAllPaymentMethodsList(current > 0 ? current - 1 : 0, page || 10)
        .then((response) => {
          setLoading(false);
          setPaymentMethodList(response.data.data);
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
      fetchPaymentMethods(current, page);
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
  
  return (
    <div>
      <div className="fullHeight ms-4">
      <DefaultLayout
        page="config_payment_methods"
        // loading={loading}
        TitleText="Payment Methods"
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
            <b>Payment Methods</b>
            <Breadcrumb separator=">">
              <Breadcrumb.Item
                // onClick={() => {
                //   navigate(Dashboard);
                // }}
              >
                Configuration
              </Breadcrumb.Item>
              <Breadcrumb.Item>Payment Methods</Breadcrumb.Item>
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
                  { UserType !== "SUPPORT_ENGINEER" &&
                  <div className="d-flex search-addBtn">                    
                    <Button
                      className="add-itemtype-issue addBtn"
                      onClick={() => {
                        setIsAddModalVisible(true);
                      }}
                    >
                      + Add Payment Method
                    </Button>
                  </div>
                  }
                </div>
                
                {PaymentMethodList && PaymentMethodList?.length > 0 ? (
                  <>
                  {UserType !== "SUPPORT_ENGINEER"?
                    <div className="itemTypes-mobile-view">
                      {PaymentMethodList.map((itemtype: any, Index: any) => (
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
                {PaymentMethodList.map((itemtype: any, Index: any) => (
                  <div className="mobile-card row" key={Index}>
                    {supportEngineeercolumns.map((column, index) => (
                      <div key={`${itemtype.name}-${index}`} className="sub-body col-6 col-sm-4">
                        <div className="mobile-header">
                          {column.title}
                        </div>
                        <div className="mobile-data">{column.render ? column.render(itemtype[column.dataIndex]) : itemtype[column.dataIndex]}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
                  }
                <Table
                  columns={UserType==="SUPPORT_ENGINEER" ? supportEngineeercolumns :columns}
                  dataSource={PaymentMethodList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 w-100 paymentLogTable"
                  scroll={{ x: 992 }}
                  locale={locale.allLocale}
                /> 
              </>
              ):(
              <Table
              columns={UserType==="SUPPORT_ENGINEER" ? supportEngineeercolumns :columns}
                  dataSource={PaymentMethodList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 w-100"
                  scroll={{ x: 992 }}
                  locale={locale.allLocale}
                /> 
              )} 
                {PaymentMethodList?.length > 0 ? (
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
                  {/* Create new method */}
                  <Modal
                    title={<p className="large-title">Add payment method</p>}
                    className="modal-box"
                    open={isAddModalVisible}
                    footer={null}
                    closable={false}
                    onCancel={handleCancel}
                  >
                    <hr className="break-line" />
                    <div>
                      <p className="enter-text">Enter type of payment method</p>
                      <TextArea
                        rows={4}
                        placeholder="Type your method name here"
                        className="modalTextArea mt-2 pt-2 "
                        value={methodNameUpdatedValue}
                        onChange={handleInputChange}
                      />
                      {createError &&
                        <p className="errMsg">{createError}</p>
                      }
                    </div>
                    <div className={Width < 992 ? "d-flex w-100 my-4 justify-content-center":"d-flex my-4 "}>
                      {methodNameUpdatedValue ? (
                        <Button
                          className="modal-button"
                          htmlType="submit"
                          onClick={() => {
                            createNewPaymentMethod();
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
                          setMethodNameUpdatedValue("")
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
  )
}

export default PaymentMethods
