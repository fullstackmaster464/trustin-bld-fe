import  { useEffect, useState } from 'react'
import DefaultLayout from '../Common/DefaultLayout'
import {
    Breadcrumb,
    Button,
    Card,
    Image,
    Input,
    Modal,
    Pagination,
    Select,
    Table,
    Tabs,
    message,
  } from "antd";
import Search from "../../assets/img/search.svg";
import emptyCard from "../../assets/img/emptyCard.svg";
import View from "../../assets/img/view.svg";
import { useNavigate } from "react-router-dom";
import { EditSupport, SupportHelp, ViewSupport } from '../Common/RouteConst';
import {  deleteSupport, getSupportByUserAlias,searchSupportList} from '../../services/admin';
import moment from 'moment';
import TabPane from 'antd/lib/tabs/TabPane';
import Editicon from "../../assets/img/EditIcon.svg";
import Itemdelete from "../../assets/img/ItemDeleteIcon.svg";
import Warning from "../../assets/img/warningicon.svg";
import { getLocalStorage } from './Constants';
import SupportIcon from "../../assets/img/supportList.svg"

const SupportAndHelpList = ():any => {
    const navigate = useNavigate();
    const [page, setPage] = useState(10);
    const [current, setCurrent] = useState(1);
    const [supportList, setSupportList] = useState<any>([]);
    const [count, setCount] = useState(0);
    const [Width, setWidth] = useState(document?.body?.clientWidth)
    const [, setTotalPage] = useState(0);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [supportId, setSupportId] = useState<any>({});
    const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
    const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
    const [tableloading, setTableLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const setWidthVal = () =>{
      setWidth(document.body.clientWidth);
    }

    useEffect(() => {
        fetchSupportList(current,page)
        window.addEventListener('resize', ()=>{
          setWidthVal()
        });
        return () => window.removeEventListener('resize', setWidthVal);
    
    }, [])

    const fetchSupportList=(
        current: number,
        pageSize: number,
    )=>{
      setLoading(true)
      getSupportByUserAlias(current - 1 || 0,
                pageSize || 10,userAlias).then((res:any)=>{
                    setSupportList(res?.data?.data)
                    setCount(res?.data?.count);
                    setTotalPage(res?.data?.lastPage * page);
                    setLoading(false)
                    setTableLoading(false);

            }).catch(() => {
              setTableLoading(false);
              setLoading(false);
                message.error("Oops! Could not fetch details. Please try again later!");
              });
    }

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

    const columns: any = [
        {
          title: "Title",
          dataIndex: "id",
          sorter: false,
          width:200,
          render: (text: string,value: any) => {
            return <span className='hyperLink' onClick={() => {
              navigate(`${ViewSupport}/${text}/${value.photoId}`); 
            }}> {value.title}</span>;
          },
        },
        {
          title: "Type of issue",
          dataIndex: "issuename",
          sorter: false,
          width: 240,
          render: (text: string) => {
            return <span>{text}</span>;
          },
        },
       
        {
          title: "Added on",
          dataIndex: "createAt",
          sorter: false,
          width: 200,
          render: (text: string) => {
            return <span>{moment(new Date(text)).format("DD-MMM-YYYY")}</span>;
          },
        },
        {
            title: "Action",
            dataIndex: "id",
            sorter: false,
            width: 80,
            render: (text: string, value: any) => {
              return (
                <div className="d-flex gap-3">
                   <div>
                   <Image
                     src={View}
                     alt="view"
                     preview={false}
                     className="cursor"
                     height={16} width={22}
                     onClick={() => {
                      navigate(ViewSupport+"/"+text+"/"+value.photoId)
                    }}
                    />
                   </div>
                  <div>
                      <Image
                        src={Editicon}
                        alt="edit"
                        preview={false}
                        className="cursor"
                        height={17}
                        width={17}
                        onClick={() => {
                          navigate(EditSupport+"/"+text+"/"+value.photoId)
                        }}
                      />
                    </div>
                    <div>
                      <Image
                        src={Itemdelete}
                        alt="delete"
                        preview={false}
                        className="cursor"
                        height={17}
                        width={15.11}
                        onClick={() => {
                          setSupportId(value)
                          setIsDeleteModalVisible(true);
                        }}
                      />
                    </div>
                </div>
              );
            },
          },
      ];
     
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
      const pagination: object = {
        pageSize: page,
        current: current,
        style: { display: "none" },
      };

      const handleChange = (value: number) => {
        setPage(value);
        setCurrent(1);
        fetchSupportList(1, value);
      };

      const onChangePage = (pageno: number) => {
        setCurrent(pageno);
        fetchSupportList(pageno, page);
      };

    const onSearch = (e: any) => {
      setLoading(true);
      if (e?.target?.value) {
        const reqBody = { key: e?.target?.value,
          sortByTitle: e?.target?.value,
          sortByTypeOfIssue: e?.target?.value,
          userAlias:userAlias
         };
        searchSupportList(
          current > 0 ? current - 1 : 0 || 0,
          page || 10,
          reqBody
        )
          .then((response:any) => {
            setLoading(false);
            setSupportList(response.data.data);
            setCount(response?.data?.count);
            setTotalPage(response?.data?.lastPage * page);
          })
          .catch(() => {
            setLoading(false);
            message.error("Could not fetch details. Please try again later");
          });
      } else {
        fetchSupportList(1, page);
      }
    };

    const handleCancel = () => {
        setIsDeleteModalVisible(false);
    }; 

    const removeSupport = () => {
      deleteSupport(supportId?.id ).then(()=>{
       setIsDeleteModalVisible(false),
       setSupportId({})
       fetchSupportList(current,page)
      })
    }
    
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
        <DefaultLayout
          page="supportlist"
          // loading={loading}
          TitleText="Support list"
          TitleImage={SupportIcon}
          headerPage={
            <div className="d-flex">
              <Image
                src={SupportIcon}
                preview={false}
                alt="management"
                className="mt-2"
              />
              <div className="ml-5">
                <b>Support list</b>
                <Breadcrumb separator=">">
                  {/* <Breadcrumb.Item
                    onClick={() => {
                      navigate(Dashboard);
                    }}
                    className="cursor"
                  >
                    Dashboard
                  </Breadcrumb.Item> */}
                  {/* <Breadcrumb.Item className="breadcrumb-title-text">Support list</Breadcrumb.Item> */}
                </Breadcrumb>
              </div>
            </div>
          }
        >
          <Card className="noBorder transparent mt-6 pt-3">
                <div id = "paymentLogTab" className=" w-100 endtoend">
                  <div className="d-flex overflow-auto w-100 disputeTabs">
                  <Tabs defaultActiveKey="all" className="tableTab mt-6">
                      <TabPane tab={`All (${count})`} key="all"></TabPane>
                    </Tabs>
                  </div>
                  <div className="d-flex search-addBtn">
                  {Width < 768 && userType !== "SUPPORT_ENGINEER"? 
                    <Button
                    className="addBtn add-support"
                    onClick={() => {
                      navigate(SupportHelp)
                    }}
                  >
                    New Request
                  </Button> : "" }
                  </div>
                  <div className="d-flex">
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
                      onInput={(e) => {
                        onSearch(e);
                      }}
                      
                    />
                    {Width > 767 && userType !== "SUPPORT_ENGINEER"? 
                    <Button
                    className="add-support addBtn "
                    onClick={() => {
                      navigate(SupportHelp)
                    }}
                  >
                    New Request
                  </Button>:""}  
                  </div>
                </div>

                {supportList.length > 0  && tableloading == false  ?(
                  <> 
                    <div className="paymentLog-mobile-view">
                    {supportList
                      .slice((current - 1) * page, current * page) 
                      .map((payment: any, index: any) => (
                        <div key={index} className="mobile-card row">
                          {columns.map((column: any, colIndex: any) => (
                            <div
                              key={`${payment.transactionNo}-${colIndex}`}
                              className="sub-body col-6 col-sm-4"
                            >
                              <div className="sub">
                                <div className="mobile-header">{column.title}</div>
                                <div className="mobile-data">
                                  {column.render(payment[column.dataIndex], payment)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>

                      <Table
                        columns={columns}
                        dataSource={supportList}
                        pagination={pagination}
                        loading={loading}
                        className="mt-6 w-100 paymentLogTable"
                        scroll={{ x: 992 }}
                        locale={locale.allLocale}
                      />   
                  </>
                  ):(
                    <Table
                    columns={columns}
                    dataSource={supportList}
                    pagination={pagination}
                    loading={loading}
                    className="mt-6 w-100 paymentLogTable"
                    scroll={{ x: 992 }}
                    locale={locale.allLocale}
                  />
                )}
               {supportList?.length > 0 ? (
                <div className="w-100 endtoend mt-2 pagination-range">
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
                  {count > page && Math.ceil(count / page) > 1 && (
                    <div className="right" style={{ textAlign: 'center' }}>
                      <Pagination
                        current={current}
                        pageSize={page}
                        total={count}
                        onChange={onChangePage}
                        itemRender={itemRender}
                        showLessItems = {true}
                        responsive
                        size="small"
                      />
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
              </Card>
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
                    width={Width > 650 ? 600 : 400}
                  >
                    <p className="sub-text fw-400 center">
                      Are you sure you
                      want to delete this request?
                    </p>
                    <div className="d-flex center">
                      <Button
                        className="modal-button mx-3 my-4"
                        htmlType="submit"
                        onClick={() => removeSupport()}
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

        </DefaultLayout>
      </div>
    </div>
  );
}

export default SupportAndHelpList
