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
  Modal,
  message,
  Spin,
  Checkbox,
  Col,
  Tooltip,
  Typography,
  Popover,
  Row,
  Progress,
  Form,
  Upload
} from "antd";
import { useNavigate } from "react-router-dom";
import EscrowTransactionIcon from "../../assets/img/Headers/Escrow_transactions.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import View from "../../assets/img/view.svg";
import Reload from "../../assets/img/reload.svg";
import filterIcon from "../../assets/img/filter.svg";
import siteLogo from "../../assets/img/currentLogo.png";
import Trio from "../../assets/img/trio.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useRef, useEffect, useState } from "react";
import { TransactionDetail } from "../Common/RouteConst";
import Download_Blue from "../../assets/img/download_blue.svg";
import modalcloseicon from "../../assets/img/modalclose.svg"
import Search from "../../assets/img/search.svg";
import AddBtn from "../../assets/img/addbtn.svg"
import UploadCsv from "../../assets/img/upload_csv.svg"
import moment from "moment";
import {
  downloadDetails,
  filteredTransaction,
  getTxnList,
  searchAggrement,
  updateExpiry,
} from "../../services/admin";
import Warning from "../../assets/img/warningicon.svg";
import "../../assets/scss/custom.scss";
import FilterCard from "./FilterCard";
import "../../assets/scss/custom.scss";
import PDF from "../../assets/img/pdf.svg";
import Doc from "../../assets/img/documentdark.svg";
import DocDisabled from "../../assets/img/doc.svg";
import { getInvoicePdf, importContract, } from "../../services/user";
// import { LoadingOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import DefaultLayout from "../Common/DefaultLayout";
import CsvFile from "../../assets/img/csvfile.svg"
import emptyCard from "../../assets/img/emptyCard.svg"; 
import { FilterType, getLocalStorage } from "../Common/Constants";
import { createPdf } from "../User/NewTransaction/pdfGeneratorHelper";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
const EscrowTransactionDetails = ():any => {
  const navigate = useNavigate();
  const [selectedUserAlias, setSelectedUserAlias] = useState<any>([]);
  const [EscrowAccountsList, setEscrowAccountsList] = useState<any>([]);
  const [page, setPage] = useState(10);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState(false);
  const [index, setIndex] = useState<any>();
  const [validationOnFilter, setValidationOnFilter] = useState("");
  const [allCount, setAllCount] = useState({
    all: 0,
    pending: 0,
    expired: 0,
    completed: 0,
    inprogress: 0,
    reject: 0,
    archived: 0,
  });
  const [Width, setWidth] = useState(document?.body?.clientWidth)
  const [totalPage, setTotalPage] = useState(0);
  const [tab, setTab] = useState("all");
  const [downloading, setDownloading] = useState(false);
  const [isReloadModalVisible, setIsReloadModalVisible] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [reopenData, setReopenData] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState<any>({});
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [searchInput, setSearchInput] = useState("");
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [form] = Form.useForm();

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  // const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
  // const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const showReloadModal = (value: object) => {
    setIsReloadModalVisible(true);
    setReopenData(value);
  };
  const handleCancel = () => {
    setPdfUrl("");
    setIsInvoiceModalOpen(false);
    setIsPdfModalOpen(false);
  };
  const handleReloadConfirmation = () => {
    updateExpiry(reopenData?.aliasName)
      .then(() => {
        setIsReloadModalVisible(false);
        fetchEscrowTransactionList(current, page, "expired");
      })
      .catch(() => {
        message.error("Something went wrong. Please try again later")
      });
  };
  const createInvoicePdf:any = async (response: any) => {
    try {
      const res = await getInvoicePdf(response);
      const doc:any = new jsPDF({ orientation: "portrait" });
      let data;
      let pdfBlob;
      let totalPages = 0;
      // Generate the PDF content
      await doc.html(res.data, {
        callback: async function (doc:any) {
          totalPages = doc?.internal.getNumberOfPages();
          // Add the footer
          // Calculate the position for each line of the footer
          const imgWidth = 8;
          const imgHeight = 12; 
          const imgX = 5;
          const imgY = doc.internal.pageSize.height - 15; 
          const positionX = imgWidth + imgX + 5;
          const positionY = doc.internal.pageSize.getHeight() - 10;
          const footer_img = 'https://i.ibb.co/xGGhWmv/endIcon.png';
          const internalWidth = doc.internal.pageSize.getWidth();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.addImage(siteLogo, "PNG", 4, 10, 40, 10.5);
            doc.setFont('helvetica','bold');
            doc.setTextColor(255,102,0)
            doc.setFontSize(18);
            doc.text("Tax Invoice",internalWidth - 40,17)

            doc.setFontSize(8);
            doc.setTextColor(115);
            doc.setFont("helvetica", "normal");
            doc.text("© Copyright " + new Date().getFullYear() + " TrustIn", positionX, positionY, { align: 'left'});
            doc.setTextColor(255,102,0);
            doc.text(" | ", positionX + 32, positionY, { align: 'left'});
            doc.setTextColor(115);
            doc.text("Email us: care@trustin.ae", positionX + 35, positionY, { align: 'left'});
            doc.text("TrustIn Limited, 512, 11th floor, AI Sarab Tower, ADGM Square, AI Maryah Island, Abu Dhabi-UAE, ", positionX, positionY + 5, { align: 'left' });
            doc.addImage(footer_img, 'JPEG', imgX, imgY, imgWidth, imgHeight);
          }
      
          pdfBlob = await doc.output("blob");
      
          const blobUrl = URL.createObjectURL(pdfBlob);
          data = blobUrl;
        },
        align: "left",
        // margin: [0, 0, 10, 0],
        margin: [18, 0, 18, 0],
        showHead: "everyPage",
        autoPaging: 'text',
        x: 0,
        y: 0,
      });

      return { blobData: pdfBlob, blobUrl: data };
    } catch (error) {
      return error;
    }
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

  // view invoices
  const viewInvoice = (UrlData: any) => {
    setLoader(true);
    setInvoiceDetails("");
    setIsInvoiceModalOpen(true);

    createInvoicePdf(UrlData?.aliasName)
      .then(async (res:any) => {
        const pdf = await res;
        setInvoiceDetails(pdf.blobUrl);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
        setIsInvoiceModalOpen(false);
        message.error(
          "Oops! Could not view the invoice. Please try again later!"
        );
      });
  };
  const handleReloadModalClose = () => {
    setIsReloadModalVisible(false);
  };

  const handleApplyFilter = (filterOptions: any,limit:number, pageNo:number) => {
    setShowFilter(false);
    if (
      (filterOptions.startDate && filterOptions.startDate?.length > 0) ||
      (filterOptions.endDate && filterOptions.endDate?.length > 0) ||
      (filterOptions.emailAddress && filterOptions.emailAddress?.length > 0) ||
      (filterOptions.customStatus && filterOptions.customStatus?.length > 0) ||
      (filterOptions.status && filterOptions.status?.length > 0) ||
      (filterOptions.transId && filterOptions.transId?.length > 0)
    ) {
      setValidationOnFilter("");
      let reqbody = {};
      
      if (filterOptions.customStatus !== undefined && filterOptions.customStatus !== "") {
        reqbody = { status: filterOptions.customStatus?.toLowerCase() }
      }
      if (filterOptions.status !== undefined && filterOptions.status !== "") {
        reqbody = { status: filterOptions.status?.toLowerCase() }
      }
      if ((filterOptions.startDate !== undefined && filterOptions.startDate?.length > 0) || (filterOptions.endDate !== undefined && filterOptions.endDate?.length > 0)) {
        reqbody = { ...reqbody, startDate: filterOptions.startDate, endDate: filterOptions?.endDate }
      }
      if (filterOptions.transId !== undefined && filterOptions.transId !== "") {
        reqbody = { ...reqbody, transId: filterOptions.transId }
      }
      if (filterOptions.emailAddress !== undefined && filterOptions.emailAddress !== "") {
        reqbody = { ...reqbody, email: filterOptions.emailAddress.trim() }
      }
      setSearchKey(reqbody);
      filteredTransaction(reqbody, limit, pageNo)
        .then((response: any) => {
          setLoading(false);
          setAllCount({
            all: response?.data?.count,
            pending: response?.data?.pendingCount,
            expired: response?.data?.expiredCount,
            completed: response?.data?.completedCount,
            inprogress: response?.data?.progressCount,
            reject:  response?.data?.rejectedCount,
            archived:  response?.data?.archivedCount,
          });
          setTotalPage(response.data.lastPage * page);
          setEscrowAccountsList(response?.data?.data?.map((elem: any)=>{
            if (elem?.agreementid) {
              const obj={ agreementId: elem?.agreementid,createAt:elem?.createat,invoiceAmount:elem?.invoiceamount, ...elem}
              return obj
            }
          }));
        })
    } else if(
      (!filterOptions.startDate || filterOptions.startDate?.length === 0) &&
      (!filterOptions.endDate || filterOptions.endDate?.length === 0) &&
      (!filterOptions.emailAddress || filterOptions.emailAddress?.length === 0) &&
      (!filterOptions.customStatus || filterOptions.customStatus?.length === 0) &&
      (!filterOptions.transId || filterOptions.transId?.length === 0)
    ) {
      setValidationOnFilter("Selected filter is blank or invalid!");
    }
  };

  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    if (typeof searchKey=== "object" && Object.keys(searchKey)?.length >0) {
      handleApplyFilter(searchKey, value,1)
      setValidationOnFilter("");
    }else if(searchedKey?.length>0 ){
      onSearch(searchedKey, 1, value);
    }
    else{
      fetchEscrowTransactionList(1, value, tab);
    }
  };
  const onTabChange = (tabValue: string) => {
    setTab(tabValue);
    setCurrent(1);
    if (Object.keys(searchKey)?.length >0) {
      handleApplyFilter(searchKey,page,current)
      setValidationOnFilter("");
    }else if(searchedKey?.length>0 ){
      onSearch(searchedKey, current, page);
    }else{
      fetchEscrowTransactionList(1, page, tabValue);
    }
  };
  const onChangePage = (pageno: number) => {
    setSelected(false);
    setSelectedUserAlias([]);
    setIndex('');
    setCurrent(pageno);
    if (typeof searchKey=== "object" && Object.keys(searchKey)?.length >0) {
      handleApplyFilter(searchKey,page,pageno)
      setValidationOnFilter("");
    }else if(searchedKey?.length>0 ){
      onSearch(searchedKey, pageno, page);
    }else{
      fetchEscrowTransactionList(pageno, page, tab);
    }
  };

  const downloadUserDetails = (index: number, status: string) => {
    let url = "";
    if (index === 0 || selectAll === true) {
      url =
        process.env.REACT_APP_SERVER_URL +
        `/api/v1/admin/downloadTransaction?type=${status}`;
    } else if (index != 0 || selectAll === false) {
      url =
        process.env.REACT_APP_SERVER_URL +
        "/api/v1/admin/downloadTransaction?id=" +
        selectedUserAlias;
    }
    setDownloading(true);

    downloadDetails(url)
      .then((response: any) => {
        setDownloading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "User.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        setDownloading(false);
        if (err) {
          message.error("Something went wrong! Please try again later.");
        }
      });
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

  const ColumnComponent = (props:any) => {
    const {text} =  props;
    const nameRef = useRef<any>(null);
    const emailRef = useRef<any>(null);
    const [isNameOverflowing, setIsNameOverflowing] = useState(false);
    const [isEmailOverflowing, setIsEmailOverflowing] = useState(false);
  
    useEffect(() => {
      const isNameOverflowing = nameRef.current.scrollWidth > nameRef.current.clientWidth;
      setIsNameOverflowing(isNameOverflowing);
  
      const isEmailOverflowing = emailRef.current.scrollWidth > emailRef.current.clientWidth;
      setIsEmailOverflowing(isEmailOverflowing);
    }, [text]);
  
    return (
      <div>
        <div className="overflowText" ref={nameRef}>
          {isNameOverflowing ? (
            <Tooltip 
              title={text?.companyname ? text?.companyname : text?.name}
              overlayClassName="custom-tooltip"
            >
              <div className="overflowText">
                <span>{text?.companyname ? text?.companyname : text?.name}</span>
              </div>
            </Tooltip>
          ) : (
            text?.companyname ? text?.companyname : text?.name
          )}
        </div>
        <div className="overflowText" ref={emailRef}>
          {isEmailOverflowing ? (
            <Tooltip 
              title={text?.email}
              overlayClassName="custom-tooltip"
            >
              <span>{text?.email}</span>
            </Tooltip>
          ) : (
            text?.email
          )}
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "Transaction Id",
      dataIndex: "agreementId",
      sorter: false,
      width: 150,
      render:(text:any,value:any) => {
        return <Typography.Text ellipsis={true} style={{ maxWidth: 150 }} className="hyperLink" onClick={() => {
          navigate(TransactionDetail + "/" + value?.aliasName,{state:"escrow"})
        }}>
        { text }</Typography.Text>
      }
    },
    {
      title: "Created On",
      dataIndex: "createAt",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      sorter: false,
      width: 150,
      render: (text: any) => <ColumnComponent text={text} />
    },
    {
      title: "Counterparty",
      dataIndex: "counterpartyDetails",
      sorter: false,
      width: 130,
      render: (text: any) => <ColumnComponent text={text} />,
    },
    {
      title: "Amount",
      dataIndex: "totalInvoiceAmount",
      sorter: false,
      width: 130,
      render: (text: string, values: any) => {
        return (
          <span>
            {text ? values?.currency + '\u00A0' + parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "contractAction",
      sorter: false,
      width: 150,
      render: (text: string) => {
        return (
          <div className="status">
            <span className={text?.toLowerCase()?.split(" ")?.join("")}>
              {text?.toLowerCase() == "invalid" ? "Rejected" : text}
            </span>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "active",
      sorter: false,
      width: 150,
      render: (text: string, value: any) => {
        return (
          <div className="endtoend">
            <div className="d-flex align-items-center gap-2">
            <div className="icon-container d-flex align-items-center gap-3">
            {value?.contractAction == "Expired" || value?.isExpired ? (
              <>
              <Image
                src={Reload}
                alt="reload"
                preview={false}
                className="cursor icon-default-size"
                onClick={() => {
                  showReloadModal(value);
                }}
              />
              </>
            ) : (
              ""
            )}
            <Image
              src={View}
              alt="view"
              preview={false}
              className="cursor icon-default-size"              
              onClick={() =>
                navigate(TransactionDetail + "/" + value?.aliasName,{state:"escrow"})
              }
            />
            
           {(value?.contractStatus >= 5) ? (
              <Image
                src={Doc}
                alt="view"
                preview={false}
                className="cursor icon-default-size" 
                onClick={() => {
                  viewInvoice(value);
                }}
              />
              ) : (
                <Popover
                  content="Invoice will be generated upon transaction completion"
                  placement="bottomLeft"
                >
                  <Image
                    src={DocDisabled}
                    alt="view"
                    preview={false}
                    className="icon-default-size" 
                  />
                </Popover>
              )
            }
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
            <div className={userType ==="SUPPORT_ENGINEER"? "d-none":"button-container d-flex align-items-center"}>
            {(Array.isArray(value?.transactions) && (value?.isMilestone 
              ? value?.transactions?.some((milestone: { approveStatus: string; releaseStatus: string; transactionStatus: string; isCompliance: boolean }) => 
                  milestone.approveStatus === "1" && 
                  milestone.releaseStatus === "1" && 
                  milestone.transactionStatus !== "RELEASED" &&
                  milestone.isCompliance
                ) 
              : value?.transactions?.[0]?.approveStatus === "1" &&
                value?.transactions?.[0]?.releaseStatus === "1" &&
                value?.transactions?.[0]?.transactionStatus !== "RELEASED" &&
                value?.transactions?.[0]?.isCompliance
              ) && value?.contractAction === "In Progress" && (
              <Button
                className="add-itemtype w-100"
                onClick={() => navigate(TransactionDetail + "/" + value?.aliasName, { state: { triggerButton: "true" } })}
              >
                <div>Verify & Release</div>
              </Button>)
            )}
          </div>
          </div>
          </div>
        );
      },
    },
  ];
  const rowSelection:any = {
    selectedRowKeys: selectedUserAlias,
    onChange: (selectedRowKeys: [], selectedRows: []) => {
      // setSelectedRowKeys(selectedRowKeys);
      // setSelectedRows(selectedRows);
      setSelected(selectedRows?.length > 0 ? true : false);
      if (selectedRowKeys.length < 10 && selectedRowKeys.length !== 0) {
        setSelectedUserAlias(selectedRowKeys);
      } else if (selectedRowKeys.length === 0) {
        setSelectedUserAlias([]);
        setIndex("");
      } else {
        setSelectedUserAlias(selectedRowKeys);
      }
    },
    onSelect: (_record: [], _selected: boolean, selectedRows: []) => {
      setSelected(selectedRows?.length > 0 ? true : false);
    },
    onSelectAll: (_selected: boolean, selectedRows: []) => {
      setSelected(selectedRows?.length > 0 ? true : false);
    },
  };
  const fetchEscrowTransactionList = (
    current: number,
    page: number,
    userType: string
  ) => {
    setLoading(true)
    getTxnList(current - 1 || 0, page || 10, userType || "all")
      .then((response) => {
        setLoading(false)
        setEscrowAccountsList(response.data.data);
        setTotalPage(response.data.lastPage * page);
        setAllCount({
          all: response.data.count,
          pending: response.data.pendingCount,
          reject: response.data.rejectedCount,
          inprogress: response.data.progressCount,
          completed: response.data.completedCount,
          expired: response.data.expiredCount,
          archived:  response?.data?.archivedCount,
        });
      })
      .catch(() => {
        setLoading(false)
        message.error("Could not fetch details. Please try again later")
      });
  };
  const [searchedKey, setSearchedKey] = useState("");
  // const [searchObj, setSearchObj] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   sortBy: null,
  //   orderBy: null,
  // });

  const onSearch = (e: string, currentPage: number, pageNo: number) => {
    if (e?.length === 0) {
      setSearchedKey("");
      fetchEscrowTransactionList(1, pageNo,"all");
    } else {
      setSearchedKey(e || searchedKey);
      const reqBody = { key: e || searchedKey };
      setLoading(true);
      searchAggrement(
        currentPage || 0,
        pageNo || 10,
        "sortByAgreementId",
        "DESC",
        reqBody
      )
        .then((response) => {
          setLoading(false);
          if (response?.status === 201 || response?.status === 200) {
            // setSearchObj({
            //   current:currentPage || 0,
            //   pageSize: page || 10,
            //   sortBy: sort?.field,
            //   orderBy: sort?.order,
            // });
            setEscrowAccountsList(response?.data?.data);
            setAllCount({
              all: response?.data?.count,
              pending: 0,
              expired: 0,
              completed: 0,
              inprogress: 0,
              reject:  0,
              archived:0,
            });
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
    fetchEscrowTransactionList(current, page, "all");
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
            <p className="nodata py-5">No Data Found</p>
          </div>
        </>
      ),
    },
  };
  
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUserAlias([]);
      setSelectedRows([]);
      setSelected(false)
    } else {
      const allUserAliases = EscrowAccountsList.map((item: any) => item.aliasName);
      setSelectedUserAlias(allUserAliases);
      setSelectedRows([...EscrowAccountsList]);
      setSelected(true)
    }
    setSelectAll(!selectAll);
  };

  const onCheckboxChange = (aliasName: string, rowData: any) => {
    const updatedSelectedUserAlias = [...selectedUserAlias];
    const updatedSelectedRows = [...selectedRows];

    const isSelected = updatedSelectedUserAlias.includes(aliasName);

    if (isSelected) {
      const index = updatedSelectedUserAlias.indexOf(aliasName);
      if (index !== -1) {
        updatedSelectedUserAlias.splice(index, 1);
      }
      const rowIndex = updatedSelectedRows.findIndex((row) => row.aliasName === aliasName);
      if (rowIndex !== -1) {
        updatedSelectedRows.splice(rowIndex, 1);
      }
    } else {
      updatedSelectedUserAlias.push(aliasName);
      updatedSelectedRows.push(rowData);
    }
    updatedSelectedUserAlias?.length > 0 ? setSelected(true) : setSelected(false)
    setSelectedUserAlias(updatedSelectedUserAlias);
    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedUserAlias.length === EscrowAccountsList.length);
  };

  const handleResetAllClick = () => {
    setSearchInput("");
    setSearchedKey(""); 
    setCurrent(1);
    setPage(10);
    fetchEscrowTransactionList(1, 10, "all");
  }
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleDownloadSampleFile = () => {
    const link = document.createElement("a");
    link.href = "/import-user-sample.xlsx"; 
    link.download = "import-user-sample.xlsx";
    link.click();
  };


 const onFinishUpload = async () => {
  if (!uploadedFile) {
    message.warning("Please select an Excel file before submitting!");
    return;
  }
  try {
    setBtnLoader(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    const res = await importContract(formData, (progressEvent: any) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setUploadProgress(percent);
      }
    });
    if (res?.data?.errors && res?.data?.errors?.length) {
      message.error(res?.data?.message || "Some rows failed to import");
      return;
    }
    message.success("Contracts imported successfully!");
    setIsUploadModalVisible(false);
    setUploadedFile(null);
    form.resetFields();
    setUploadProgress(0);
    // fetchEscrowTransactionList(1, page, tab);
    fetchEscrowTransactionList(current, page, tab);
    // fetchEscrowTransactionList(current, page, "all");
  } catch (e: any) {
    console.error(e);
    message.error(
      e?.response?.data?.message || "Upload failed! Please try again."
    );
  } finally {
    setBtnLoader(false);
  }
};
  
  

  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="escrow_transaction"
        // loading={loading}
        TitleText="Escrow Transactions"
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
              <b> Escrow transactions</b>
              <Breadcrumb separator=">">
                <Breadcrumb.Item
                  // onClick={() => {
                  //   navigate(Dashboard);
                  // }}
                >
                  Escrow
                </Breadcrumb.Item>
                <Breadcrumb.Item>Escrow transactions</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
              <Card className="noBorder transparent mt-6 kyc-table-list-card-wrap escrow-tran-card">
                <div className={Width > 1190 ? "w-100 endtoend kyc-bottom-header mb-4" : "w-100 endtoend flex-column-reverse gap-3"}>
                  <div className={Width > 767 ? "d-block dashboardTabs w-100" : "d-block dashboardTabs justify-content-between w-100"}>
                    <Tabs
                      defaultActiveKey="all"
                      className="d-none-res tableTab "
                      onChange={onTabChange}
                    >
                      <TabPane
                        tab={`All (${allCount?.all})`}
                        key="all"
                      ></TabPane>
                      <TabPane
                        tab={`Pending (${allCount?.pending})`}
                        key="pending"
                      ></TabPane>
                      <TabPane
                        tab={`Rejected (${allCount?.reject})`}
                        key="rejected"
                      ></TabPane>
                      <TabPane
                        tab={`In-progress (${allCount?.inprogress})`}
                        key="inprogress"
                      ></TabPane>
                      <TabPane
                        tab={`Completed (${allCount?.completed})`}
                        key="completed"
                      ></TabPane>
                      <TabPane
                        tab={`Expired (${allCount?.expired})`}
                        key="expired"
                      ></TabPane>
                      <TabPane
                        tab={`Archived (${allCount?.archived})`}
                        key="archived"
                      ></TabPane>
                    </Tabs>
                  </div>
             <div className={Width > 1190 ? "d-flex justify-content-start align-items-center" : "d-flex justify-content-end align-items-center"}>
              <Button className="add-new-user"  onClick={() => setIsUploadModalVisible(true)}>
                <Image 
                  src={AddBtn} 
                  alt="addBtn" 
                  className="add-btn"   
                  preview={false}
                />
                <span className="pe-2">Upload Document</span>
              </Button>
                  </div>
                  <div className="d-flex inputFilter justify-content-between">
                    <div className="d-flex w-100">
                      <Input
                        className={Width > 1190 ? "search-input-additem ml-2 px-3" : "search-input-additem m-0 px-3 "}
                        placeholder="Search"
                        value={searchInput}
                        prefix={
                          <Image
                            src={Search}
                            alt="search"
                            className=""
                            preview={false}
                          />
                        }
                        onInput={(e: any) => {
                          const val = e.target.value;
                          setSearchInput(val);
                          onSearch(val, 1, page);
                        }}
                      />
                    </div>
                    <div className="d-flex buttons-filter">
                  {!showFilter ? (
                    <>
                      <Button
                        className="filterbutton"
                        onClick={() => setShowFilter(!showFilter)}
                      >
                        Filter
                        <Image
                          src={filterIcon}
                          alt="filter"
                          preview={false}
                          className=""
                        />
                      </Button>
                      <Button type="default" className="filterbutton mx-2" onClick={handleResetAllClick}>
                        Reset All
                      </Button>
                    </>
                  ) : (
                      <Button className="filterbutton_selected text-center">
                        <span className="mx-2 mt-1">Filter</span>
                        <Image
                          src={closeIcon}
                          alt="filter"
                          preview={false}
                          height={28}
                          width={28}
                          className="px-1 close-icon"
                          onClick={() => setShowFilter(!showFilter)}
                        />
                        <div className="drop-icon">
                          <Image
                            src={Trio}
                            alt="filter"
                            preview={false}
                            height={28}
                            width={28}
                            className="px-1"
                          />
                        </div>
                      </Button>
                    )}
                    {Width > 475 ?
                    <Button
                      className="downloadBtn mt-0"
                      hidden={selected ? false : true}
                      loading={downloading}
                      onClick={() => { downloadUserDetails(index, tab.toUpperCase()) }}
                    >
                      {!downloading ? <span className=" d-flex py-1 center">
                        <Image
                          src={Download_Blue}
                          alt="dowload"
                          className="px-2"
                          height={20}
                          width={35}
                          preview={false}
                        />
                        Download All
                      </span> : ""}
                    </Button>
                    :""}
                    </div>
                    {Width < 476 ?
                    <Button
                      className="downloadBtn mt-0"
                      hidden={selected ? false : true}
                      loading={downloading}
                      onClick={() => { downloadUserDetails(index, tab.toUpperCase()) }}
                    >
                      {!downloading ? <span className=" d-flex py-1 center">
                        <Image
                          src={Download_Blue}
                          alt="dowload"
                          className="px-2"
                          height={20}
                          width={35}
                          preview={false}
                        />
                        Download All
                      </span> : ""}
                    </Button>
                    :""}
                  </div>
              </div>
                {showFilter && (
                  <FilterCard handleApplyFilter={(e) => { handleApplyFilter(e, 10, 1) }}
                    setLoading={setLoading}
                    fetchEscrowTransactionList={fetchEscrowTransactionList}
                    filterType={FilterType.ESCROW_TRANSACTION}
                    setSearchedKey={setSearchedKey}
                    setCurrent={setCurrent}
                    setPage={setPage}
                  />
                )}
                {validationOnFilter ? <p className="text-danger">{validationOnFilter}</p> : ""}
                {EscrowAccountsList.length > 0 ? (
                 <>
                 <div className="itemTypes-mobile-view">
                    <Checkbox checked={selectAll} onChange={toggleSelectAll}>Select all </Checkbox>
                   {EscrowAccountsList.map((accountslist: any, Index: any) => (
                     <div className="mobile-card row" key={Index}>
                      <Col xs={2} sm={2}>
                      <Checkbox
                        className="mt-2"
                        type="checkbox"
                        checked={selectedUserAlias.includes(accountslist.aliasName)}
                        onChange={() => onCheckboxChange(accountslist.aliasName, accountslist)}
                      />
                      </Col>
                      <div className="mobile-card row col-10 col-sm-10">
                       {columns.map((column:any, index:any) => (
                         <div key={`${accountslist.name}-${index}`} className="sub-body col-6 col-sm-4">
                           <div className="mobile-header">
                             {column.title}
                           </div>
                         <div className="mobile-data action-mobile-data">{column.render ? column.render(accountslist[column.dataIndex],accountslist) : accountslist[column.dataIndex]}</div>
                       </div>
                     ))}
                   </div></div>
                 ))}
               </div>
                <Table
                  columns={columns}
                  dataSource={EscrowAccountsList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 w-100 paymentLogTable"
                  scroll={{ x: 992 }}
                  rowSelection={rowSelection}
                  rowKey={(record: any) => {
                    return record.aliasName;
                  }}
                  onHeaderRow={(_columns, index) => {
                    return {
                      onClick: () => {
                        setIndex(index);
                      },
                    };
                  }}
                  locale={locale.allLocale}
                />
                </>
                ): (
                  <Table
                  columns={columns}
                  dataSource={EscrowAccountsList}
                  pagination={pagination}
                  loading={loading}
                  className="mt-6 w-100"
                  scroll={{ x: 992 }}
                  rowSelection={rowSelection}
                  rowKey={(record: any) => {
                    return record.aliasName;
                  }}
                  onHeaderRow={(_columns, index) => {
                    return {
                      onClick: () => {
                        setIndex(index);
                      },
                    };
                  }}
                  locale={locale.allLocale}
                />
                )} 
              {EscrowAccountsList?.length > 0 ? (
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
                  open={isReloadModalVisible}
                  onOk={handleReloadModalClose}
                  footer={null}
                  closable={false}
                  onCancel={handleReloadModalClose}
                  width={410}
                >
                  <p className="sub-text fw-400 center">
                    Are you sure to mark this transaction as reopened?
                  </p>
                  <div className="d-flex my-4 center">
                    <Button
                      className="rounded mx-3 mt-3"
                      htmlType="submit"
                      onClick={() => {
                        handleReloadConfirmation();
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      className="rounded_cancel_btn"
                      onClick={() => setIsReloadModalVisible(false)}
                    >
                      No
                    </Button>
                  </div>
                </Modal>
              </Card>
              </DefaultLayout>
            </div>
        {/* upload modal */}
        <Modal
          title={
          <div className="d-flex justify-content-between align-items-center">
            <p className="large-title mb-0">Upload user</p>
            <img
              src={modalcloseicon}
              alt="close-icon"
              className="cursor"
              onClick={() => {
                setIsUploadModalVisible(false);
                setUploadedFile(null);
              }}
            />
          </div>
        }
        className="add-item-category-modal upload-user-modal"
        open={isUploadModalVisible}
        footer={null}
        closable={false}
        onCancel={() => {
          setIsUploadModalVisible(false);
          setUploadedFile(null);
        }}
      >
        <div className="modal-body-wrapper">
          <hr className="break-line" />
          <Form form={form} onFinish={onFinishUpload} className="center-form">
            <div className="upload-instructions text-center mb-3">
              <Image src={UploadCsv} alt="upload_csv" preview={false} className="mb-3" />
              <p className="upload-preview-text mb-1">Choose a file or drag & drop it here.</p>
              <p className="upload-preview-text-inner mb-1">Excel formats up to 50MB</p>

              <span
                onClick={handleDownloadSampleFile}
                className="download-sample-link d-flex justify-content-center align-items-center cursor-pointer mb-3"
              >
                Download Sample Excel File
              </span>
              <Form.Item
                name="file"
                className="text-center upload-form-item d-flex justify-content-center align-items-center bg-white"
                style={{ background: "#fff" }}
              >
                <Upload
                  beforeUpload={() => false}
                  accept=".xlsx,.xls"
                  maxCount={1}
                  onChange={(info) => {
                    if (info.file) {
                      setUploadedFile(info.file as any);
                      form.setFieldsValue({ file: info.file });
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />} className="upload-csv-btn">
                    Upload Excel File
                  </Button>
                </Upload>
              </Form.Item>
            </div>
            {uploadedFile && (
              <div className="csv-preview-wrapper mb-4">
                <div className="csv-static-preview">
                  <div className="file-info-wrapper">
                    <div className="left">
                      <Image src={CsvFile} alt="csvfile" preview={false} />
                      <div className="file-text">
                        <span className="file-name">{uploadedFile.name}</span>
                        <span className="file-size">{formatFileSize(uploadedFile.size)}</span>
                      </div>
                    </div>

                    <DeleteOutlined
                      className="delete-icon cursor-pointer"
                      onClick={() => {
                        setUploadedFile(null);
                        form.setFieldsValue({ file: undefined });
                        setUploadProgress(0);
                      }}
                    />
                  </div>

                  {uploadProgress > 0 && (
                    <div className="progress-wrapper">
                      <Progress
                        percent={uploadProgress}
                        strokeWidth={15}
                        strokeLinecap="butt"
                        style={{ position: "relative" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            <hr className="break-line" />
            <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
              <Col
                span={24}
                className={
                  Width > 420
                    ? "w-100 d-flex align-items-center justify-content-between flex-wrap"
                    : "w-100 d-flex align-items-center justify-content-between flex-wrap flex-column gap-3"
                }
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={btnLoader}
                  className="submit-sheet-button"
                >
                  Submit sheet
                </Button>

                <Button
                  className="rounded_cancel_btn mx-3 mt-0"
                  onClick={() => {
                    form.resetFields();
                    setUploadedFile(null);
                  }}
                >
                  Clear
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>              
      <Modal
        title={<div className="titleText mt-3 mb-5">Invoice details PDF</div>}
        centered
        width={"80%"}
        open={isInvoiceModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        {!invoiceDetails ? (
          <div
            className="d-flex align-items-center justify-content-center w-100"
            style={{ height: "60vh" }}
          >
            <Spin size="large" className="mainloader pdf" />
          </div>
        ) : (
          <>
            <object
              data={invoiceDetails}
              type="application/pdf"
              width="100%"
              height="450"
              useMap="invoice-details"
            >
              <p>Your browser does not support viewing PDFs {" "}
              
              </p>
              </object>
              <div className="text-center mt-3">
                <a href={typeof invoiceDetails === 'string' ? invoiceDetails : '#'} download="invoice-details.pdf">
                <button className="btn btn-primary">
                  Download the PDF
                  </button>
                </a>
            </div>
            </>
        )}
      </Modal>
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
  );
};

export default EscrowTransactionDetails;
