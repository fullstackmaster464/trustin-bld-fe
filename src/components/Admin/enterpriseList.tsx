    import {
        Breadcrumb,
        Card,
        Image,
        Pagination,
        Select,
        Table,
        Tabs,
        Typography,
        message,
    } from "antd";
    import { useNavigate } from "react-router-dom";
    import EscrowTransactionIcon from "../../assets/img/Headers/EnterpriseHeader.svg";
    import View from "../../assets/img/view.svg";
    import emptyCalls from "../../assets/img/nodata.svg";
    import TabPane from "antd/lib/tabs/TabPane";
    import { useEffect, useState } from "react";
    import { Dashboard, EnterpriseCallDetails,  } from "../Common/RouteConst";
    import moment from "moment";
    import "../../assets/scss/custom.scss";
    import "../../assets/scss/custom.scss";
    import {  getEnterpriseList } from "../../services/transaction";
    import { enterpriseUserCallsStatus } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
    
    const EnterpriseList = () => {
        const navigate = useNavigate();
        const [enterpriseList, setEnterpriseList] = useState([]);
        const [page, setPage] = useState(10);
        const [current, setCurrent] = useState(1);
        const [allCount, setAllCount] = useState({
        pending: 0,
        scheduled: 0,
        rescheduled: 0,
        interested: 0,
        closed:0
        });
        const [totalPage, setTotalPage] = useState(0);
        const [loading, setLoading] = useState(false);
        const [tab, setTab] = useState("pending");  
        const handleChange = (value: number) => {
        setPage(value);
        setCurrent(1)
        fetchCallList(1, value, tab);
        };
        const onTabChange = (tabValue: string) => {
        setTab(tabValue);
        setCurrent(1)
        fetchCallList(1, page, tabValue);
        };
        const onChangePage = (pageno: number) => {
        setCurrent(pageno);
        fetchCallList(pageno, page, tab);
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
        const columns: object[] = [
        {
            title: "Name",
            dataIndex: "name",
            sorter: false,
            width: 100,
            render: (text: string) => {
                return <span>{text}</span>;
            },
        },
        {
            title: "Date",
            dataIndex: "createAt",
            sorter: false,
            width: 100,
            render: (text: string) => {
            return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
            },
        },
        {
            title: "Email address",
            dataIndex: "email",
            sorter: false,
            width: 150,
            render: (text: any) => {
                return <Typography.Text ellipsis={true} style={{ width: 150 }}>{text}</Typography.Text>;
                }, 
        },
        {
            title: "Status",
            dataIndex: "status",
            sorter: false,
            width: 100,
            render: (text: any) => {
            return <div className="status"><span className={text.toLowerCase()}>{enterpriseUserCallsStatus?.[text]}</span></div>;
            },
        },
        {
            title: "Contact",
            dataIndex: "contactNumber",
            sorter: false,
            width: 100,
        },
        {
            title: "Action",
            dataIndex: "aliasName",
            sorter: false,
            width: 50,
            render: (value:any) => {
            return (
                <div className="text-center">
                <Image src={View} alt="view" preview={false} className="cursor icon-default-size" onClick={()=>navigate(EnterpriseCallDetails+'/'+value)}/>
                </div>
            );
            },
        },
        ];
        const fetchCallList = (
        current: number,
        page: number,
        userType: string,
        ) => {
            setLoading(true)
            getEnterpriseList(current > 0 ? current - 1 : 0 || 0, page || 10, userType || "pending")
            .then((response) => {
                setLoading(false)
            const List = response.data
            setEnterpriseList(List.data);
            setAllCount({
                pending: List?.pendingCount,
                scheduled: List?.scheduledCount,
                rescheduled: List?.rescheduledCount,
                interested: List?.interestedCount,
                closed:List?.closedCount
              })
              setTotalPage(List?.lastPage * page)
            })
            .catch(() => {
                setLoading(false)
                message.error("Could not fetch details. Please try again later")
            });
        };
        useEffect(() => {
        fetchCallList(current, page, "pending");
        }, []);
        return (
            <div className="scrollbar-container">
            <div className="fullHeight">
            <DefaultLayout
        page="enquiry_enterprise"
        // loading={loading}
        TitleText="Enterprise"
        TitleImage={EscrowTransactionIcon}
        headerPage={
            <div className="d-flex">
            <Image
                src={EscrowTransactionIcon}
                preview={false}
                className="mt-2"
                alt="escrowimage"
            />
            <div className="ml-5">
                <b> Enterprise</b>
                <Breadcrumb separator=">">
                <Breadcrumb.Item
                    onClick={() => {
                    navigate(Dashboard);
                    }}
                >
                    Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item>Enterprise call scheduler list</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            </div>
        }
      >
                    <Card className="noBorder transparent mt-6">
                    <div className="w-100 endtoend">
                        <div className="d-flex disputeTabs overflow-auto">
                        <Tabs
                            defaultActiveKey="pending"
                            className="d-none-res tableTab mt-6"
                            onChange={onTabChange}
                        >
                            <TabPane tab={`Pending (${allCount?.pending})`} key="pending"></TabPane>
                            <TabPane tab={`Scheduled (${allCount?.scheduled})`} key="scheduled"></TabPane>
                            <TabPane tab={`Rescheduled (${allCount?.rescheduled})`} key="rescheduled"></TabPane>
                            <TabPane tab={`Interested (${allCount?.interested})`} key="interested"></TabPane>
                            <TabPane tab={`Closed (${allCount?.closed})`} key="closed"></TabPane>
                        </Tabs>
                        </div>
                    </div>
                    {enterpriseList.length > 0 ?
                    <Table
                        columns={columns}
                        dataSource={enterpriseList}
                        pagination={pagination}
                        loading={loading}
                        className="mt-6"
                        scroll={{ x: 400 }}
                    />:
                     <div className="nodataCard text-center px-5">
                      <Image src={emptyCalls} preview={false} className="mt-5" />
                      <p className="nodata py-5">No Data Found</p>
                     </div> 
                    }
                                        {enterpriseList?.length > 0 ? (
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
    
    export default EnterpriseList;
    