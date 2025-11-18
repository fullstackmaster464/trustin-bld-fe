import {
  Image,
  Modal,
  Pagination,
  Popover,
  Select,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import View from "../../assets/img/view.svg";
import PDF from "../../assets/img/pdf.svg";
import disabledPdf from "../../assets/img/pdf_gray.svg";
import emptyCart from "../../assets/img/nodata.svg";
import { useEffect, useState } from "react";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import moment from "moment";
import { TransactionDetail } from "../Common/RouteConst";
import { pendingTrusteeTxn, searchTrusteeTxn } from "../../services/trustee";
import { createPdf } from "../User/NewTransaction/pdfGeneratorHelper";
import { getLocalStorage } from "../Common/Constants";

const ArchivedTransaction = ({ searchedKey, setSearchedKey }: any) => {
  const navigate = useNavigate();
  const [contractList, setContractList] = useState([]);
  const [page, setPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias

  const handleCancel = () => {
    setPdfUrl("");
    setIsPdfModalOpen(false);
  };
  useEffect(() => {
    pendingTxn(1, 10);
  }, []);
  const locale = {
    allLocale: {
      emptyText: (
        <>
          <Image src={emptyCart} preview={false} className="mt-5" />
          <p className="nodata my-5">No pending transaction found</p>
        </>
      ),
    },
  };
  const columns = [
    {
      title: "Transaction id",
      sorter: false,
      render: (text: any) => {
        return <Typography.Text ellipsis={true} style={{ maxWidth: 150 }} className="hyperLink" onClick={() => { navigate(TransactionDetail + "/" + text?.aliasName, { state: { pagefrom: 'transaction' } }) }}>
          {text?.agreementId}
        </Typography.Text>
      }
    },
    {
      title: "Date",
      dataIndex: "createAt",
      render: (text: string) => (
        <span className="date">
          {moment(new Date(text)).format("DD-MM-YYYY")}
        </span>
      ),
      sorter: false,
    },
    {
      title: "Buyer",
      dataIndex: "b_name",
      render: (text: string, values: any) => (
        <>
          <span className="counterparty-name">
            <Popover content={text} placement="bottom">
              {/* <span className="counterparty-name">{!!text ? text.split(" ")?.[0]:""}</span> */}
              <span className="counterparty-name">{text?.split(" ")?.[0] || ""}</span>
            </Popover>
          </span>
          <br />
          <span className="counterparty-email">
            <Popover content={values.b_email} placement="bottom">
              <span className="Status">
                {values.b_email.slice(0, 15) +
                  (values.b_email.length > 15 ? "..." : "")}
              </span>
            </Popover>
          </span>
        </>
      ),
    },
    {
      title: "Seller",
      dataIndex: "s_name",
      render: (text: string, values: any) => (
        <>
          <span className="counterparty-name">
            <Popover content={text} placement="bottom">
              {/* <span className="counterparty-name">{!!text ? text.split(" ")?.[0]:""}</span> */}
              <span className="counterparty-name">{text?.split(" ")?.[0] || ""}</span>
            </Popover>
          </span>
          <br />
          <span className="counterparty-email">
            <Popover content={values.s_email} placement="bottom">
              <span className="Status">
                {values.s_email.slice(0, 15) +
                  (values.s_email.length > 15 ? "..." : "")}
              </span>
            </Popover>
          </span>
        </>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalInvoiceAmount",
      render: (text: string, values: any) => (
        <>
          <div>
            <span className="invoiceAmt">
              <span className="fw-4"></span>{" "}
              <span>
                {values?.currency} {parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </span>
          </div>
        </>
      ),
      sorter: false,
    },
    {
      title: "Status",
      dataIndex: "contractStatus",
      render: (text: string, values: any) => (
        <>
          <div className="text-center d-flex status">
            {(values && values?.isExpired == true) ? (
              <span className="expired">Expired</span>
            ) : (values && values?.isArchive === true) ? (
              <span className="archived">Archived</span>
            )
              : text === "7" ? (
                <span className="disputed">Disputed</span>
              ) : text === "8" ? (
                <span className="active">Refund Generated</span>
              ) : text === "9" ? (
                <span className="completed_refunded">
                  Complete refund generated
                </span>
              ) : text === "10" ? (
                <span className="partial_refunded">Partial refund generated</span>
              ) : (text === "-1" || text === "-2") ? (
                <span className="rejected">Rejected</span>
              ) : (text === "5") ? (
                <span className="completed">Completed</span>
              ) :
                (text === "2" || text === "3" || text === "4"
                ) ? (
                  <span className="inprogress">In progress</span>
                ) : (text === "1") ? (
                  <span className="pending">Pending</span>
                ) :
                  (
                    <span className="sent">Verify</span>
                  )}
          </div>
        </>
      ),
      sorter: false,
    },

    {
      title: "Action",
      dataIndex: "pdfId",
      render: (text: string, values: any) => {
        return (
          <>
            <div className="text-center d-flex status gap-3">
              <Image src={View} alt="view" preview={false} className="cursor" onClick={() => { navigate(TransactionDetail + "/" + values?.aliasName, { state: { pagefrom: 'transaction' } }) }} height={16} width={22} />
              {text != null ? (
                <Image
                  src={PDF}
                  preview={false}
                  alt="view Pdf"
                  className="cursor"
                  onClick={() => viewPdf({ contractId: values.aliasName })}
                  style={{minWidth:'20px',maxWidth:'20px'}}
                />
              ) : (
                <Popover
                  content="Unfortunately, the PDF documents for this contract is not accessible or unavailable"
                  placement="bottomLeft"
                >
                  <Image
                    src={disabledPdf}
                    preview={false}
                    alt="view Pdf"
                    // className="px-3"
                    style={{minWidth:'20px',maxWidth:'20px'}}
                  />
                </Popover>
              )}
            </div>
          </>
        );
      },
    },
  ];

  const viewPdf = (UrlData: any) => {
    setLoader(true);
    setIsPdfModalOpen(true);
    createPdf(UrlData)
      .then(async (res) => {
        const pdf: any = await res;
        setPdfUrl(pdf.blobUrl);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
        setIsPdfModalOpen(false);
        message.error(
          "Oops! Could not view the invoice. Please try again later!"
        );
      });
  };

  const pendingTxn = (
    current: number,
    page: number,
  ) => {
    setLoading(true);
    pendingTrusteeTxn(
      current || 1,
      page || 10,
      "sortByAgreementId",
      "DESC",
      { id: "archived", trusteeId: userAlias }
    )
      .then((response) => {
        setLoading(false);
        setContractList(response.data.data);
        setTotalPage(response.data.lastPage * page);
      })
      .catch(() => {
        setLoading(false);
        message.error("Could not fetch list. Please try again later!")
      });
  };

  const pagination: object = {
    pageSize: page,
    current: current,
    style: { display: "none" },
  };
  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    if (searchedKey?.length > 0) {
      onSearch(searchedKey, pageno, page);
    } else {
      pendingTxn(pageno, page);
    }
  };
  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    if (searchedKey?.length > 0) {
      onSearch(searchedKey, 1, value);
    } else {
      pendingTxn(1, value);
    }
  };
  const itemRender: any = (_: any, type: string, originalElement: HTMLElement) => {
    if (type === "prev") {
      return <a className="prev_nxt mx-4">Prev</a>;
    }
    if (type === "next") {
      return <a className="prev_nxt mx-4">Next</a>;
    }
    return originalElement;
  };

  const onSearch = (searchedKey: string, currentPage: number, pageNo: number) => {
    if (searchedKey?.length === 0) {
      setSearchedKey("");
      pendingTxn(1, pageNo);
    } else {
      // searchedKey = searchedKey;
      searchedKey = searchedKey.toLowerCase();
      setSearchedKey(searchedKey || searchedKey);
      const reqBody = { key: searchedKey || searchedKey };
      setLoading(true);
      searchTrusteeTxn(
        currentPage || 0,
        pageNo || 10,
        "sortByAgreementId",
        "DESC",
        reqBody
      )
        .then((response) => {
          setLoading(false);
          if (response?.status === 201 || response?.status === 200) {
            setLoading(false);
            setContractList(response.data.data);
            setTotalPage(response.data.lastPage * page);
          }
        })
        .catch((err: any) => {
          setLoading(false);
          if (err) {
            message.error(
              err?.error?.message ? err?.error?.message : "Something went wrong!"
            );
          }
        });
    }
  };

  useEffect(() => {
    if (searchedKey?.length > 0) {
      onSearch(searchedKey, 1, page);
    } else {
      pendingTxn(1, page);
    }
  }, [searchedKey]);

  return (
    <div>
      <div className="fullHeight">
        <Table
          columns={columns}
          dataSource={contractList}
          pagination={pagination}
          loading={loading}
          className="mt-3"
          scroll={{ x: 400 }}
          locale={locale.allLocale}
        />
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
            <div className="right" style={{ textAlign: 'center' }}>
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
        <Modal
          title={<div className="titleText mt-3 mb-5">Contract details PDF</div>}
          centered
          open={isPdfModalOpen}
          onCancel={handleCancel}
          footer={false}
          width={"80%"}
        >
          {!pdfUrl || loader ? (
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
    </div>
  );
};

export default ArchivedTransaction;
