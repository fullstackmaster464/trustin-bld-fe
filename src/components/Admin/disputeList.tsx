import {
  Breadcrumb,
  Card,
  Image,
  Input,
  Pagination,
  Select,
  Table,
  Tabs,
  message,
  notification,
  Tooltip,
  Typography,
  Modal,
  Spin
} from "antd";
import { useNavigate } from "react-router-dom";
import EscrowImg from "../../assets/img/Headers/Dispute_management.svg";
import View from "../../assets/img/view.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import { DisputeManagementDetails } from "../Common/RouteConst";
import Search from "../../assets/img/search.svg";
import moment from "moment";
import { getAllDisputeList } from "../../services/transaction";
import { searchDisputed } from "../../services/admin";
import DefaultLayout from "../Common/DefaultLayout";
import emptyCard from "../../assets/img/emptyCard.svg"; 
import PDF from "../../assets/img/pdf.svg";
import { createPdf } from "../User/NewTransaction/pdfGeneratorHelper";
const DisputeList = ():any => {
  const navigate = useNavigate();
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [allCount, setAllCount] = useState({
    all: 0,
    disputed: 0,
    partial: 0,
    completed: 0,
    resolved: 0,
  });
  const [totalPage, setTotalPage] = useState(0);
  const [DisputeList, setDisputeList] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line prefer-const
  let [searchedKey, setSearchedKey] = useState("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [Width, setWidth] = useState(document?.body?.clientWidth)
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);

  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1)
    
    if(searchedKey?.length > 0){
      onSearch(searchedKey, 1, value)
    }else{
      fetchDisputeList(1, value, tab);
    }
  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrent(1)
    if(searchedKey?.length > 0){
      onSearch(searchedKey, current, page)
    }else{
      fetchDisputeList(1, page, tabValue);
    }
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    if(searchedKey?.length > 0){
      onSearch(searchedKey, pageno, page)
    }else{
      fetchDisputeList(pageno, page, tab);
    }
  };

  const openNotification = (msg = "") => {
    notification.error({
      message: "Error",
      description: msg ? msg : "Something went wrong",
    });
  };

  const viewPdf = (UrlData: any) => {
    setIsPdfModalOpen(true);
    createPdf(UrlData)
    .then(async (res) => {
      const pdf: any = await res;
      setPdfUrl(pdf.blobUrl);
    })
    .catch(() => {
      setIsPdfModalOpen(false);
      message.error(
        "Oops! Could not view the invoice. Please try again later!"
      );
    });
  };

  const handleCancel = () => {
    setPdfUrl("");
    setIsPdfModalOpen(false);
  };

  const itemRender :any = (_: any, type: string, originalElement: HTMLElement) => {
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
      title: "Transaction id",
      dataIndex: "agreementId",
      sorter: false,
      width: 200,
      render: (text: any,values:any) => {
        return <Typography.Text ellipsis={true} style={{ maxWidth: 150 }}  className="hyperLink" onClick={
          () =>{ navigate(DisputeManagementDetails + "/" + values?.aliasName)}
        }>{text}</Typography.Text>;
        },
        },
    {
      title: "Buyer",
      dataIndex: "createdBy",
      sorter: false,
      width: 150,
      render: (text: any) => {
        return <span className="tableWordWrap">
          <Tooltip
            title={text?.name && text?.name.length * 7 > 136 ? text?.name : null}
            overlayClassName='custom-tooltip'
          >
            <span>{text?.name || "--"}</span>
          </Tooltip>  
        </span>;
      },
    },
    {
      title: "Seller",
      dataIndex: "counterpartyDetails",
      sorter: false,
      width: 150,
      render: (text: any) => {
        return <span className="tableWordWrap">
          <Tooltip
            title={text?.name.length * 7 > 136 ? text?.name : null}
            overlayClassName='custom-tooltip'
          >
            <span>{text?.name}</span>
          </Tooltip>
        </span>;
      },
    },

    {
      title: "Date",
      dataIndex: "disputeDate",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Dispute type",
      dataIndex: "disputeType",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return <span className="tableWordWrap">
          <Tooltip
            title={text.length * 7 > 120 ? text : null}
            overlayClassName='custom-tooltip'
          >
            <span>{text}</span>
          </Tooltip>
        </span>;
      },
    },
    {
      title: "Status",
      dataIndex: "disputeStatus",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return (
          <span className="status capitalize">
            <span
              className={
                text != null
                  ? text?.toLowerCase()?.split(" ")?.join("_")
                  : "disputed"
              }
            >
              {text != null ? text?.split("_")?.join(" ") : "Disputed"}
            </span>
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "aliasName",
      sorter: false,
      width: 50,
      render: (text: string, value: any) => {
        return (
          <div className="text-center action-mobile-view d-flex gap-3">
            <Image src={View} alt="view" preview={false} className="cursor icon-default-size" onClick={()=>navigate(DisputeManagementDetails + "/" + text)} height={16} width={22} />
            {text != "Send" &&(
              <Image
                src={PDF}
                alt="view"
                preview={false}
                className="cursor icon-default-size" 
                onClick={() => viewPdf({ contractId: value.aliasName })}
              />
            )}
          </div>
        );
      },
    },
  ];

  const fetchDisputeList = (
    current: number,
    page: number,
    userType: string
  ) => {
    setLoading(true)
    getAllDisputeList(current || 1, page || 10, userType || "all", "sortByAgreementId", "DESC")
      .then((response: any) => {
        setLoading(false)
        setDisputeList(response?.data?.data);
        setAllCount({
          all: response.data.count,
          disputed: response?.data?.disputeCount,
          partial: response?.data?.partialRefundCount,
          completed: response?.data?.completeRefundCount,
          resolved: response?.data?.resolvedCount,
        });
        setTotalPage(response.data.lastPage * page);
      })
      .catch(() => {
        setLoading(false)
        message.error("Could not fetch details. Please try again later")
      });
  };
  useEffect(() => {
    fetchDisputeList(current, page, "all");
  }, []);

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

  const onSearch = (e: string, currentPage: number, page: number) => {
    if (e.length === 0) {
      searchedKey = "";
    } 
    if (e) {
      setSearchedKey(e);
      const reqBody = { key: e};
   
    setLoading(true);
    searchDisputed(
      currentPage > 0 ? currentPage - 1 : 0,
      page || 10,
      "ALL",
      'sortByAgreementId',
      "DESC",
      reqBody
    )
      .then((response) => {
        setLoading(false);
        if (response?.status === 201 || response?.status === 200) {
          setDisputeList(response?.data?.data);
          setAllCount({
            all: response.data.count,
            disputed: 0,
            partial: 0,
            completed: 0,
            resolved: 0,
          });
         setTotalPage(response.data.lastPage * page);
         
        }
      })
      .catch((error) => {
        setLoading(false);
        openNotification(error?.message);
      });
    }
    else{
      setSearchedKey('');
      fetchDisputeList(current, page, "all");
    }
  };

  return (
    <div>
      <div className="scrollbar-container fullHeight">
      <DefaultLayout
        page="dispute_management"
        // loading={loading}
        TitleText="Dispute Management"
        TitleImage={EscrowImg}
        headerPage={
          <div className="d-flex">
            <Image
              src={EscrowImg}
              preview={false}
              className="mt-2"
              alt="escrowimage"
            />
            <div className="ml-5">
              <b> Dispute management</b>
              <Breadcrumb separator=">">
                <Breadcrumb.Item
                >
                  Management
                </Breadcrumb.Item>
                <Breadcrumb.Item>Dispute Management</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
              <Card className="noBorder transparent kyc-table-list-card-wrap escrow-tran-card">
                <div className="d-block disputeTabs w-100 scrollAble">
                <div className={Width > 767 ? "w-100 endtoend kyc-bottom-header mb-4" : "w-100 flex-column-reverse endtoend gap-2"}>
                    <Tabs
                      defaultActiveKey="all"
                      className="tableTab overflow-auto"
                      onChange={onTabChange}
                    >
                      <TabPane
                        tab={`All (${allCount?.all})`}
                        key="all"
                      ></TabPane>
                      <TabPane
                        tab={`Disputed (${allCount?.disputed})`}
                        key="disputed"
                      ></TabPane>
                      <TabPane
                        tab={`Partial refund generated (${allCount?.partial})`}
                        key="partial"
                      ></TabPane>
                      <TabPane
                        tab={`Complete refund generated (${allCount?.completed})`}
                        key="completed"
                      ></TabPane>
                      <TabPane
                        tab={`Resolved (${allCount?.resolved})`}
                        key="resolved"
                      ></TabPane>
                    </Tabs>
                  <Input
                    className="search-input-additem"
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
                  </div>
                </div>
                {DisputeList.length > 0 ? (
                <>
                <div className="paymentLog-mobile-view mt-3">
                  {DisputeList?.map((dispute: any, index:any) =>( 
                    <div key={index} className="mobile-card row">
                      {columns?.map((column:any, index:any) =>(
                        <div key={`${dispute.aliasName}-${index}`} className="sub-body col-6 col-sm-4">
                          <div className="mobile-header">
                            {column?.title}
                          </div>
                          <div className="">{column?.render(dispute[column.dataIndex],dispute)}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <Table
                  columns={columns}
                  dataSource={DisputeList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-3 paymentLogTable"
                  scroll={{ x: 400 }}
                  rowKey={(record: any) => {
                    return record.userAlias;
                  }}
                  locale={locale.allLocale}
                /> 
                </> 
                ):(
                <Table
                columns={columns}
                dataSource={DisputeList}
                pagination={pagination}
                loading={loading}
                className="mt-3"
                scroll={{ x: 400 }}
                rowKey={(record: any) => {
                  return record.userAlias;
                }}
                locale={locale.allLocale}
              />
              )}   
              {DisputeList?.length > 0 ? (
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
            <Modal
              title={<div className="titleText mt-3 mb-5">Contract Details PDF</div>}
              centered
              open={isPdfModalOpen}
              onCancel={handleCancel}
              footer={false}
              width={"80%"}
            >
              {!pdfUrl ? (
                <div
                  className="d-flex align-items-center justify-content-center w-100"
                  style={{ height: "60vh" }}
                >
                  <Spin size="large" className="mainloader pdf" />
                </div>
              ) : (
                <>
              <object
                data={pdfUrl}
                type="application/pdf"
                width="100%"
                height="450"
                useMap="invoice-details"
              >
                <p>Your browser does not support viewing PDFs {" "}
                
                </p>
                </object>
                <div className="text-center mt-3">
                  <a href={pdfUrl} download="contract-details.pdf">
                  <button className="btn btn-primary">
                    Download the PDF
                    </button>
                  </a>
              </div>
              </>
              )}
            </Modal>
            </div>
  );
};

export default DisputeList;
