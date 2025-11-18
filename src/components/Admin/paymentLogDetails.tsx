import {
  Breadcrumb,
  Col,
  Image,
  Pagination,
  Row,
  Select,
  Table,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Dashboard, PaymentList } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import MoveTo from "../../assets/img/moveTo.svg";
import WhiteUserFull from "../../assets/img/WhiteUserFull.svg";
import Email from "../../assets/img/white_email.svg";
import Globe from "../../assets/img/white_globe.svg";
import Payment from "../../assets/img/white_payment.svg";
import Job from "../../assets/img/job_white.svg";
import Secure from "../../assets/img/secure100.svg";
import emptyCalls from "../../assets/img/nodata.svg";
import { useEffect, useState } from "react";
import { getPaymentLogByAlias} from "../../services/admin";
import DefaultLayout from "../Common/DefaultLayout";

const PaymentLogDetails = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [totalPage] = useState(0);
  const goBack = () => {
    navigate(PaymentList);
  };
  const pagination: object = {
    pageSize: page,
    current: current,
    style: { display: "none" },
  };
  const locale = {
    allLocale: {
      emptyText: (
        <>
          <Image src={emptyCalls} preview={false} className="mt-5" />
          <p className="nodata my-5">No Data Found</p>
        </>
      ),
    },
  };

  
  const [logDetails, setPaymentLogDetails] = useState<any>({});
  const userAlias = window?.location?.pathname.split("/").pop();

  useEffect(() => {
    console.log('alias==>',userAlias)
    getPaymentLogByAlias(userAlias).then((res:any) => {
      setPaymentLogDetails(res);
      console.log('payment Log ==>', logDetails);

    })
  })

  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1)
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    setCurrent(1)
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
  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      render: () => {
        return <span>TRUST-1869</span>;
      },
    },
    {
      title: "Mode",
      dataIndex: "mode",
      render: () => {
        return <span>Full Payment </span>;
      },
    },
    {
      title: "Added on date",
      dataIndex: "added_on_date",
      render: () => {
        return <span>15 Aug 2023 </span>;
      },
    },
    {
      title: "Payment Mode",
      dataIndex: "payment_mode",
      render: () => {
        return <span>Credit card</span>;
      },
    },
    {
      title: "Particulars",
      dataIndex: "particulars",
      render: () => {
        return <span>credited to TrustIn account</span>;
      },
    },
    {
      title: "Credit",
      dataIndex: "credit",
      render: () => {
        return <span>AED 7000</span>;
      },
    },
    {
      title: "Deposit",
      dataIndex: "deposit",
      render: () => {
        return <span>AED 7000</span>;
      },
    },
  ];
  const data = [
    {
      key: 1,
      transaction_id: "",
      added_by: "",
      added_on_date: "",
      particular_details: "",
      mode: "",
      amount: "",
    },
  ];
  return (
    <div className="scrollbar-container">
       <DefaultLayout
        page="payment"
        TitleText="Payment History"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        loading={false}
        headerPage={
          <div className="d-flex">
                  <Image
                    src={LeftArrow}
                    preview={false}
                    onClick={() => {
                      goBack();
                    }}
                    className="mt-2 cursor"
                  />
                  <div className="ml-5">
                    <b> Payment History</b>
                    <Breadcrumb separator=">">
                      <Breadcrumb.Item
                        onClick={() => {
                          navigate(Dashboard);
                        }}
                        className="cursor"
                      >
                        Dashboard
                      </Breadcrumb.Item>
                      <Breadcrumb.Item
                        className="cursor"
                        onClick={() => {
                          navigate(PaymentList);
                        }}
                      >
                        Payment log
                      </Breadcrumb.Item>
                      <Breadcrumb.Item className="cursor">
                        Payment history
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                </div>
              }
      >
            <Row className="endtoend">
              <Col span={18}>
                <div className="bg-admin-card ">
                  <div className="endtoend px-5 pt-4 ">
                    <div className="title_white ">TRUST-1872</div>
                    <div className="d-flex">
                      <Image src={Job} alt="box" preview={false} />
                      <div className="whiteTitle18 px-3">29-Sep-2027</div>
                    </div>
                  </div>
                  <hr className=" w-100 opacity-50 mt-4" />
                  <Col>
                    <div className="px-5 endtoend mx-2">
                      <div className="">
                        <div className="buyerBox">From Buyer</div>
                        <div className="d-flex my-3">
                          <Image
                            src={WhiteUserFull}
                            alt="box"
                            preview={false}
                          />
                          <div className="whiteTitle18 px-3">kamal Sinha</div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Email} alt="box" preview={false} />
                          <div className="whiteTitle18 px-3">
                            seller123@yopmail.com
                          </div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Globe} alt="box" preview={false} />
                          <div className="whiteTitle18 px-3">India</div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Payment} alt="box" preview={false} />
                          <div className="whiteTitle18 bold px-3">
                            AED 4,000
                          </div>
                        </div>
                      </div>
                      <div className="ml--10">
                        <Image src={MoveTo} alt="move" preview={false} />
                      </div>
                      <div className="">
                        <div className="buyerBox">To Seller</div>
                        <div className="d-flex my-3">
                          <Image
                            src={WhiteUserFull}
                            alt="box"
                            preview={false}
                          />
                          <div className="whiteTitle18 px-3">Javed habib</div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Email} alt="box" preview={false} />
                          <div className="whiteTitle18 px-3">
                            Habibj@yopmail.com
                          </div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Globe} alt="box" preview={false} />
                          <div className="whiteTitle18 px-3">UAE</div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Payment} alt="box" preview={false} />
                          <div className="whiteTitle18 bold px-3">
                            AED 4,000
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </div>
              </Col>
              <Col span={5}>
                <Image
                  src={Secure}
                  alt="secure"
                  preview={false}
                  height={"345px"}
                />
              </Col>
            </Row>
            <Row>
              <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                className="mt-5 w-100"
                scroll={{ x: 992 }}
                locale={locale.allLocale}
              />
                {PaymentList?.length > 0 ? (
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
            </Row>
            </DefaultLayout>
          </div>
  );
};

export default PaymentLogDetails;
