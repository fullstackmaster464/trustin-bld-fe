import { useEffect, useState } from 'react'
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
import ChatComment from "../../assets/img/ChatComment.svg";
import { useNavigate } from "react-router-dom";
import { ViewSupport } from '../Common/RouteConst';
import { getSupportList, searchSupportList, UpdateSupport } from '../../services/admin';
import moment from 'moment';
import TabPane from 'antd/lib/tabs/TabPane';
import TextArea from 'antd/es/input/TextArea';
import { getLocalStorage, KYC_KYB_COMMENT_TEXT_LIMIT } from '../Common/Constants';
import SupportIcon from "../../assets/img/supportlistbg.svg"

const SupportList = ():any => {
    const navigate = useNavigate();
    const [page, setPage] = useState(10);
    const [current, setCurrent] = useState(1);
    const [supportList, setSupportList] = useState<any>([]);
    const [count, setCount] = useState(0);
    const [Width, setWidth] = useState(document?.body?.clientWidth)
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [isCommentModal, setIsCommentModal] = useState(false);
    const [isCommentValid, setIsCommentValid] = useState(true);
    const [commentValue, setCommentValue] = useState("");
    const [commentError, setCommentError] = useState<string | null>(null);
    const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
    const userType = JSON.parse(getLocalStorage("auth")!)?.userType;

    const setWidthVal = () =>{
      setWidth(document.body.clientWidth);
    }

    const validatePopupCommentFields = (value: string) => {
      if (!value || value.trim() === "") {
        return Promise.reject(new Error("Please enter reason!"));
      }
      const allowedChars = /^[a-zA-Z0-9\s,\/#?\-\.]*$/;
      if (!allowedChars.test(value)) {
        return Promise.reject(
          new Error("Only letters, numbers, spaces, and , - ? # / . are allowed")
        );
      }
      if (value.trim().length < 20) {
        return Promise.reject(new Error("Please enter minimum 20 characters"));
      }
       if (value.trim().length > KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT) {
          return Promise.reject(
            new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}`)
          );
        }
      return Promise.resolve();
    };

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
            getSupportList(current - 1 || 0,
                pageSize || 10,).then((res:any)=>{
                    setSupportList(res?.data?.data)
                    setCount(res?.data?.count);
                    setTotalPage(res?.data?.lastPage * page);
                    setLoading(false)

            }).catch(() => {
              setLoading(false)
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
        title: "Name",
        dataIndex: "name",
        sorter: false,
        width:200,
        render: (text: string, record: any) => {
          return (
            <span className="cursor hyperLink" onClick={() => navigate(ViewSupport + "/" + record.id + "/" + record.photoId)}>
              {text}
            </span>
          );
        },
      },
      {
        title: "Email",
        dataIndex: "email",
        sorter: false,
        width:250,
        render: (text: string) => {
          return <span>{text}</span>;
        },
      },
        {
          title: "Title",
          dataIndex: "title",
          sorter: false,
          width:200,
          render: (text: string) => {
            return <span>{text}</span>;
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
                <div className="d-flex">
                   <div>
                   <Image
                     src={View}
                     alt="view"
                     preview={false}
                     className="cursor"
                     onClick={() => {
                      navigate(ViewSupport+"/"+text+"/"+value.photoId)
                     }}
                     height={16} width={22}
                    />
                   </div>
                   <div className='px-2'>
                   <Image
                     src={ChatComment}
                     alt="view"
                     preview={false}
                     className="cursor"
                     onClick={() => {
                      setIsCommentModal(true);
                      setId(value?.id)

                     }}
                     height={16} width={22}
                    />
                    {/* <CommentOutlined /> */}
                   </div>
                </div>
              );
            },
          },
      ];
      const supportEngineercolumns: any = [
        {
          title: "Name",
          dataIndex: "name",
          sorter: false,
          width:200,
          render: (text: string, record: any) => {
            return (
              <span className="cursor hyperLink" onClick={() => navigate(ViewSupport + "/" + record.id + "/" + record.photoId)}>
                {text}
              </span>
            );
          },
        },
        {
          title: "Email",
          dataIndex: "email",
          sorter: false,
          width:250,
          render: (text: string) => {
            return <span>{text}</span>;
          },
        },
          {
            title: "Title",
            dataIndex: "title",
            sorter: false,
            width:200,
            render: (text: string) => {
              return <span>{text}</span>;
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
                  <div className="d-flex">
                     <div>
                     <Image
                       src={View}
                       alt="view"
                       preview={false}
                       className="cursor"
                       onClick={() => {
                        navigate(ViewSupport+"/"+text+"/"+value.photoId)
                       }}
                       height={16} width={22}
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
          sortByTypeOfIssue: e?.target?.value
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
    
    const handleAddComment = () => {
      validatePopupCommentFields(commentValue)
        .then(() => {
          const requestBody = {
            adminComments:commentValue,
            userAlias:userAlias,
            id:id
          };
          UpdateSupport(requestBody)
            .then(() => {
              setIsCommentModal(false);
              setCommentValue("");
              setIsCommentValid(true);
              setCommentError(null);
              message.success("Comment added successfully");
            })
            .catch(() => {
              message.error("Oops! Something went wrong. Please try again later");
            });
        })
        .catch((error) => {
          setIsCommentValid(false);
          setCommentError(error.message);
        });
    }

   const handleCommentChange = (e: any) => {
      const value = e.target.value;
      setCommentValue(value);
      validatePopupCommentFields(value)
        .then(() => {
          setIsCommentValid(true);
          setCommentError(null);
        })
        .catch((error) => {
          setIsCommentValid(false);
          setCommentError(error.message);
        });
    };

    return (
        <div className="scrollbar-container">
          <div className="fullHeight">
            <DefaultLayout
              page="support"
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
                    <div className={Width > 767 ? "w-100 endtoend" : "d-flex w-100 endtoend flex-column-reverse"}>
                      <div className={Width > 767 ? "d-flex dashboardTabs" : "d-flex supportlist-tab dashboardTabs justify-content-between"}>
                        <Tabs defaultActiveKey="all" className="tableTab mt-6">
                          <TabPane tab={`All (${count})`} key="all" className=''></TabPane>
                        </Tabs>
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
                      </div>
                    </div>

                    {supportList.length > 0 ?(
                      <> 
                        {userType !== "SUPPORT_ENGINEER" ? 
                          <div className="paymentLog-mobile-view">
                            {supportList.map((payment: any, index:any) => (
                              
                              <div key={index} className="mobile-card row">
                                {columns.map((column:any, index:any) => (
                                   <div key={`${payment.transactionNo}-${index}`} className="sub-body col-6 col-sm-4">
                                    <div className="sub">
                                      <div className="mobile-header">
                                        {column.title}
                                      </div>
                                      <div className="mobile-data">{column.render(payment[column.dataIndex], payment)}</div>
                                    </div>
                                 </div>
                                ))}
                              </div>
                            ))}
                          </div>:
                          <div className="paymentLog-mobile-view">
                          {supportList.map((payment: any, index:any) => (
                            
                            <div key={index} className="mobile-card row">
                              {supportEngineercolumns.map((column:any, index:any) => (
                                 <div key={`${payment.transactionNo}-${index}`} className="sub-body col-6 col-sm-4">
                                  <div className="sub">
                                    <div className="mobile-header">
                                      {column.title}
                                    </div>
                                    <div className="mobile-data">{column.render(payment[column.dataIndex], payment)}</div>
                                  </div>
                               </div>
                              ))}
                            </div>
                          ))}
                        </div>
                          }
                          <Table
                            columns={userType === "SUPPORT_ENGINEER" ? supportEngineercolumns :columns}
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
                        <div className="right" style={{ textAlign: 'center' }}>
                          <Pagination
                            current={current}
                            pageSize={page}
                            onChange={onChangePage}
                            total={totalPage || 1}
                            itemRender={itemRender}
                            showLessItems = {true}
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

          <Modal
            title={<p className="large-title">Add Comment</p>}
            className="modal-box"
            open={isCommentModal}
            footer={null}
            closable={false}
            onCancel={() => { 
              setIsCommentModal(false);
              setCommentValue("");
              setIsCommentValid(true);
              setCommentError(null);
            }}
          >
            <hr className="break-line" />
            <div>
              <p className="enter-text">Admin Comment</p>
              <TextArea
                rows={4}
                placeholder="Write your reason here"
                className={`modalTextArea mt-2 pt-2 ${!isCommentValid ? 'error' : ''}`}
                value={commentValue}
                // maxLength={maxCommentLength}
                onInput={handleCommentChange}
              />
              <div className="d-flex justify-content-between mt-1">
              <div>
                  {commentError && (
                <p className="errMsg">{commentError}</p>
              )}
              </div>
              <div>
                  <span>
                     {`${commentValue.length} / 500`}
                </span>
              </div>
              </div>
              
            </div>
            <div className={Width < 992 ? "d-flex w-100 my-4 justify-content-center gap-3" : "d-flex my-4 gap-3"}>
                <Button
                  className="modal-button"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                  onClick={() => {
                    handleAddComment()
                  }}
                >
                  Submit
                </Button>
              <Button
                className="modal-button-cancel"
                onClick={() => {
                  setIsCommentModal(false);
                  setCommentValue("");
                  setIsCommentValid(true);
                  setCommentError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
    );
}

export default SupportList