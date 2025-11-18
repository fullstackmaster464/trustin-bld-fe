import {
    Breadcrumb,
    Image,
    Table,
  } from "antd";
  import emptyCalls from "../../assets/img/notransaction.svg";
  import BankIcon from "../../assets/img/onlinepayhead.svg";
  import { useEffect, useState } from "react";
  import "../../assets/scss/custom.scss";
  import "../../assets/scss/custom.scss";
  import {
      UAEPGS_STATUS,
    getLocalStorage,
  } from "../Common/Constants";
  import {
    getUaepgsTransactionList,
  } from "../../services/user";
  import DefaultLayout from "../Common/DefaultLayout";
  const UAEPGSTransactionList = ():any => {
    const [uaepgsList, setUaepgsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
    useEffect(() => {
      fetchUaepgsList();
    }, []);
  
    const fetchUaepgsList = () => {
      setLoading(true);
      getUaepgsTransactionList(userAlias).then(
        (res: any) => {
            console.log("res:--",res);
            
          setLoading(false);
          setUaepgsList(res?.data?.UAEPGSTransactionList?.data.reverse());
        }
      );
    };

    const getDate = (date:any) => {
        const year = date.substr(0, 4);
        const month = date.substr(4, 2);
        const day = date.substr(6, 2);
        
        return `${day}-${month}-${year}`;
    }

    const columns: object[] = [
        {
            title: 'Transaction number',
            dataIndex: 'pp_TxnRefNo',
            key: 'pp_TxnRefNo',
          },
          {
            title: 'Transaction date',
            dataIndex: 'pp_TxnDateTime',
            render: (text: string) => {
                return <span>{getDate(text)}</span>;
              },
          },
          {
            title: 'Retrieval reference number',
            dataIndex: 'pp_RetreivalReferenceNo',
            key: 'pp_RetreivalReferenceNo',
            render: (text:string) => (text !== undefined && text !== null) ? text : '--',
          },
          {
            title: 'Contract reference number',
            dataIndex: 'pp_BillReference',
            render: (text: string) => {
              return <span>{text.includes(".") ? text.replace('.','-') : text}</span>;
            },
          },
          {
            title: 'Amount',
            dataIndex: 'pp_Amount',
            key: 'pp_Amount',
          },
          {
            title: 'Currency',
            dataIndex: 'pp_TxnCurrency',
            key: 'pp_TxnCurrency',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (text: string) => {
                return (
                  <span className="status">
                    <span
                      className={
                        (text && UAEPGS_STATUS[text])
                          ? UAEPGS_STATUS[text].toLowerCase().split(" ").join("_")
                          : ""
                      }
                    >
                      {text ? UAEPGS_STATUS[text] : ""}
                    </span>
                  </span>
                );
              },
          },
          {
            title: 'Transaction type',
            dataIndex: 'pp_TxnType',
            key: 'pp_TxnType',
          },
    ];   
  
    //rendering column for mobile view
    const renderColumn = (column: any, record: any) => {
      if (typeof column.render === "function") {
        return column.render(record[column.dataIndex], record);
      } else {
        return record[column.dataIndex];
      }
    };
  
    return (
      <div>
        <div className="fullHeight scrollbar-container">
        <DefaultLayout
          page="uaepgshistory"
          TitleText="Online payments"
          TitleImage={BankIcon}
          loading={loading}
          headerPage={
            <div className="d-flex">
                <Image
                src={BankIcon}
                preview={false}
                className="mt-2"
                alt="escrowimage"
                />
                <div className="ml-5">
                <b> Online payments</b>
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
                    Online payments
                    </Breadcrumb.Item>
                </Breadcrumb>
                </div>
            </div>
            }
        >              
        <div className="dashboardTabs scrollable-container">
            {uaepgsList.length > 0 ?(<>
            <div className="archived-mobile-view">
                {uaepgsList.map((contract: any, index: any) => (
                <div key={index} className="mobile-card row">
                    {columns.map((column: any, columnIndex: any) => (
                    <div key={columnIndex} className="sub-body col-6 col-sm-4">
                        <div className="sub">
                        <div className="mobile-header word-break">{column.title}</div>
                        <div className="mobile-data">{renderColumn(column, contract)}</div>
                        </div>
                    </div>
                    ))}
                </div>
                ))}
            </div>
            <Table
                columns={columns}
                dataSource={uaepgsList}
                className="mt-6 w-100 paymentLogTable"
                scroll={{ x: 400 }}
                loading={loading}
            /> 
            </>):
            <div className="nodataCard mt-3 text-center">
                <Image src={emptyCalls} preview={false} className="mt-5" />
                <p className="nodata mt-5 pb-4 textOverflow">No online payments yet done</p>
            </div>
            }
        </div>
        </DefaultLayout>
        </div>
        </div>
    );
  };
  
  export default UAEPGSTransactionList;
  