import {
  Breadcrumb,
  Button,
  Image,
  Pagination,
  Select,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import emptyCalls from "../../assets/img/notransaction.svg";
import View from "../../assets/img/view.svg";
import BankIcon from "../../assets/img/archived.svg";
import { useEffect, useState } from "react";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import {
  CONTRACT_STATUS,
  getLocalStorage,
  USER_TYPE_TEXT,
} from "../Common/Constants";
import {
  getArchivedList,
} from "../../services/user";
import moment from "moment";
import { TransactionDetail } from "../Common/RouteConst";
import {CreateEscrow,} from "../Common/RouteConst";
import DefaultLayout from "../Common/DefaultLayout";
const ArchivedTransaction = ():any => {
  const navigate = useNavigate();
  const [contractList, setContractList] = useState([]);
  const [page, setPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(getLocalStorage("auth")!)
  const userAlias = userData?.userAlias;
  const userType = userData?.userType;
  useEffect(() => {
    fetchcontractList(1, 10);
  }, []);

  const fetchcontractList = (page: number, limit: number) => {
    setLoading(true);
    getArchivedList(userAlias, page > 0 ? page - 1 : 0, limit).then(
      (res: any) => {
        setLoading(false);
        setContractList(res?.data?.data);
        setTotalPage(res?.data?.archivalCount);
      }
    );
  };
  const columns: object[] = [
    {
      title: "Transaction id",
      dataIndex: "agreementId",
      sorter: false,
      width: 150,
      render: (text:any,values:any) =>{ 
        return (    
          <Typography.Text ellipsis={true} style={{ maxWidth: 150 }} className="hyperLink" onClick={() => {
          navigate(TransactionDetail + "/" + values?.aliasName);
        }}>
          {text}
        </Typography.Text>
        )
      }
    },
    {
      title: "My role",
      dataIndex: "contractStartedBy",
      sorter: false,
      width: 100,
    },
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      width: 160,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Counterparty",
      dataIndex: "counterpartyDetails",
      sorter: false,
      width: 150,
      render: (text: any) => {
        const displayText = text?.companyname ? text?.companyname : text?.name;
        const shouldWrap = displayText?.length * 7 > 180;
        return (
          <div className={shouldWrap ? 'tableWordWrap' : ''}>
            <Tooltip
              title={shouldWrap ? displayText : null}
              overlayClassName="custom-tooltip"
              placement="topLeft"
            >
              <span>{displayText}</span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Email address",
      dataIndex: "counterpartyDetails",
      sorter: false,
      width: 250,
      render: (text: any) => {
        return <Typography.Text style={{ width: 250 }}>{text?.email}</Typography.Text>;
        },
    },
    {
      title: "Status",
      dataIndex: "contractAction",
      sorter: false,
      width: 120,
      render: (text: string) => {
        const upperText =text.toUpperCase().split(" ").join("_"); 
        return (
          <span className="status">

            <span
              className={
                (upperText && CONTRACT_STATUS[upperText])
                  ? CONTRACT_STATUS[upperText]?.toLowerCase().split(" ").join("_")
                  : ""
              }
            >
              {upperText ? CONTRACT_STATUS[upperText] : ""}
            </span>
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "invoiceAmount",
      sorter: false,
      width: 150,
      render: (text: string, value: any) => {
        return <b>{value?.currency + " " + parseFloat(text).toLocaleString()}</b>;
      },
    },

    {
      title: "Action",
      dataIndex: "aliasName",
      sorter: false,
      width: 100,
      render: (text: string) => {
        return (
          <div>
            <Image
              src={View}
              alt="view"
              preview={false}
              className="cursor"
              onClick={() => {
                navigate(TransactionDetail + "/" + text);
              }}
              height={16} width={22}
            />
          </div>
        );
      },
    },
  ];

  // const onTabchange = (tabValue: string) => {
  //   setTab(tabValue);
  //   setCurrent(1);
  //   fetchcontractList(1, page);
  // };
  const pagination: object = {
    pageSize: page,
    current: current,
    style: { display: "none" },
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    fetchcontractList(pageno, page);
  };
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    fetchcontractList(1, value);
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

  //rendering column for mobile view
  const renderColumn = (column: any, record: any) => {
    if (typeof column.render === "function") {
      return column.render(record[column.dataIndex], record);
    } else {
      return record[column.dataIndex];
    }
  };

  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="archived"
        TitleText="Archived escrow transaction"
        TitleImage={BankIcon}
        loading={loading}
        headerPage={
          <div className="d-flex">
                    <Image
                      src={BankIcon}
                      preview={false}
                      className="mt-2 header-icon"
                      alt="escrowimage"
                    />
                    <div className="ml-5">
                      <b> Archived escrow transaction</b>
                      <Breadcrumb separator=">">
                        {/* <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                          className="cursor"
                        >
                          Dashboard
                        </Breadcrumb.Item> */}
                        <Breadcrumb.Item className="breadcrumb-title-text">
                          Archived escrow transaction
                        </Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >              
              <div className="dashboardTabs scrollable-container">
                {contractList.length > 0 ?(<>
                  <div className="archived-mobile-view">
                    {contractList.map((contract: any, index: any) => (
                      <div key={index} className="mobile-card row">
                        {columns.map((column: any, columnIndex: any) => (
                          <div key={columnIndex} className="sub-body col-6 col-sm-4">
                            <div className="sub">
                              <div className="mobile-header">{column.title}</div>
                              <div className="mobile-data">{renderColumn(column, contract)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <Table
                    columns={columns}
                    dataSource={contractList}
                    pagination={pagination}
                    className="mt-6 w-100 paymentLogTable"
                    scroll={{ x: 400 }}
                    loading={loading}
                  /> 
                </>):
                  <div className="nodataCard mt-3 text-center">
                    <Image src={emptyCalls} preview={false} className="mt-5" />
                    {
                      userType === USER_TYPE_TEXT.ESCROW_ADVISOR ? <p className="nodata mt-5">No escrow transaction yet</p>
                      : <>
                      <p className="nodata mt-5 not-done-text">No escrow transaction yet done</p>
                      <Button
                        type="primary"
                        className="modal-button mt-3 mb-5"
                        onClick={() => {
                          navigate(CreateEscrow);
                        }}
                      >
                        Create Now
                      </Button>
                    </>
                    }
                  </div>
                }
                {contractList?.length > 0 ? (
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
                    <div className="right">
                      <Pagination
                        current={current}
                        pageSize={page}
                        onChange={onChangePage}
                        total={totalPage || 1}
                        itemRender={itemRender}
                        responsive
                        size="small"
                        showLessItems = {true}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              </DefaultLayout>
            </div>
            </div>
  );
};

export default ArchivedTransaction;
