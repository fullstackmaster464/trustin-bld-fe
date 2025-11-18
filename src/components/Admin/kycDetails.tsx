import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography
} from "antd";
import { useNavigate } from "react-router-dom";
import Email from "../../assets/img/Email.svg";
import Individual from "../../assets/img/Individual.svg";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Nation from "../../assets/img/Nation.svg";
import Phone from "../../assets/img/Phone.svg";
import { KYCManagementList, TransactionDetail } from "../Common/RouteConst";
// import Flag from "../../assets/img/flag.svg";
import Meta from "antd/es/card/Meta";
import TabPane from "antd/lib/tabs/TabPane";
import moment from "moment";
import { useEffect, useState } from "react";
import Flag from "../../assets/img/Country.svg";
import Doc from "../../assets/img/grayDoc.svg";
import Job from "../../assets/img/job_gray.svg";
import emptyCalls from "../../assets/img/notransaction.svg";
import orangeTick from "../../assets/img/orange_tick.svg";
import {
  createPlatformFees,
  createVirtualAccount,
  downloadDetails,
  downloadKybDetails,
  fetchKybDetails,
  filteredTransaction,
  getAllUserPlatformFeesByUserAlias,
  getRiskConfiguration,
  getUserPlatformFees,
  holdKyc,
  updateKybKycRiskClassification,
  updatePlatformFees,
  verifyKyb,
  verifyKybDocument,
  virtualAccountDetails,
} from "../../services/admin";
import ApproverDetails from "../Common/ApproverDetails";
import {
  COMPANY_ROLE,
  contractStatusMap,
  // CONTRACT_STATUS,
  DOCUMENT_TYPE,
  ENTITY_TYPE,
  FilterType,
  getLocalStorage,
  KYC_KYB_COMMENT_TEXT_LIMIT,
  moneyFormat,
  RISK_ASSESSMENT_FINAL_RISK_SCORE,
  toTitleCase,
  TRANSACTION_TYPE,
  USER_TYPE_TEXT,
  VALID_CURRENCY,
} from "../Common/Constants";
import {
  PrimaryOutLineButton,
  SecondaryOutLineButton,
} from "../ui-elements/ButtonRepo";
import { NormalText } from "../ui-elements/TextRepo";
import ModalCreateEscrowAccount from "./ModalCreateEscrowAccount";
// @ts-ignore
import dayjs from "dayjs";
import multiDownload from "multi-download";
import download from "../../assets/img/Download.svg";
import Download_Blue from "../../assets/img/download_blue.svg";
import filterIcon from "../../assets/img/filter.svg";
import Trio from "../../assets/img/trio.svg";
import closeIcon from "../../assets/img/whiteclose.svg";
import { getContractList, getlocalBankDetails, getWalletTotalAmountAndCount, getWalletTransactionList } from "../../services/user";
import DefaultLayout from "../Common/DefaultLayout";
import PDFPreview from "../Common/PdfPreviewIcon";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import AddressDetails from "./AddressDetails";
import FilterCard from "./FilterCard";
import RiskAssesmentCard from "./RiskAssesmentCard";
import SearchAgainKybKycModal from "./SearchAgainKybKycModal";
import VerifyKybKycCard from "./VerifyKybKycCard";
import { CommentModalForm } from "./CommentModalForm";
import PlatformFeesModal from "../Common/PlatformFeesModal";
import { PlatformFeesSection } from "./PlatformFeesSection";

const { Text } = Typography;
const { TextArea } = Input;

const AdminKYCDetails = ():any => {
  const navigate = useNavigate();
  const [classificationModalVisible, setClassificationModalVisible] =
    useState(false);
  const [CommentModal, setCommentModal] = useState(false);
  const [CommentModalReject, SetCommentModalReject] = useState(false);
  const [CommentModalData, setCommentModalData] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [form] = Form.useForm();
  const [dropDownValue, setDropDownValue] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [ApproveModal, setApproveModal] = useState(false);
  const [RejectModal, setRejectModal] = useState(false);
  const [isAllDocUpdated, setIsAllDocUpdated] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadOption, setDownloadOption] = useState(3);
  const [checkboxComment, setCheckboxComment] = useState<any>({});
  const [checkboxCommentApprover, setCheckboxCommentApprover] = useState<any>({});
  const [KYCDetails, setKYCDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [nameAndIdVerification, setNameAndIdVerification] = useState(false);
  const [validDocumentVerification, setValidDocumentVerification] =
    useState(false);
  const [amlScreening, setAmlScreening] = useState(false);
  const [adverseMedia, setAdverseMedia] = useState(false);
  // const [successModal, setSuccessModal] = useState(false);
  const [PoliticallyPerson, setPoliticallyPerson] = useState(false);
  const [holdModal, setHoldModal] = useState(false);
  const userAlias = window?.location?.pathname.split("/").pop();
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const currentUserAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias

  const [searchKybModal, setSearchKybModal] = useState(false);
  const [kybInfo, setKybInfo] = useState({});
  const [kybBasic, setKybBasic] = useState({});
  const [riskDetails, setRiskDetails] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState({});
  const [digiScreeningPayload, setDigiScreeningPayload] = useState({});
  const [formCheckKyB] = Form.useForm();
  const [fatfList, setFatfList] = useState([]);
  const [fatfTypeId, setFatfTypeId] = useState(0)
  const [riskAssessmentFormPayload, setRiskAssessmentFormPayload] = useState({});
  const [riskAssessmentPayload, setRiskAssessmentPayload] = useState({});
  const [datasetsOptions, setDatasetsOptions] = useState([]);
  // const [rejectedReason, setRejectedReason] = useState<any>([]);
  const [otherComment, setOtherComment] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const [countryList, setCountryList] = useState([]);
  const [brithPlaceList, setBrithPlaceList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [kycFATCAPayload, setKycFATCAPayload] = useState<any>({});
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const isApprover = ['TRUSTEE','APPROVER','MAKER'].includes(userType);
  // const isAuthorizer = ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType);
  const [frmEscrow] = Form.useForm();
  const [createVirtualAccountModal, setCreateVirtualAccountModal] = useState<boolean>(false);
  const [createVirtualAccnt, setCreateVirtualAccount] = useState<boolean>(false);
  const [onSuccessCreateVA, setOnSuccessCreateVA] = useState<boolean>(false);
  const [validCurrencyList, setValidCurrencyList] = useState<any>([]); 
  const [specialErrors, setSpecialErrors] = useState<Record<string, boolean>>({});
   const [filterApplied, setFilterApplied] = useState(false);

  const [formDocumentApprove] = Form.useForm();
  const [formDocumentReject] = Form.useForm();
  const [formApproveKYC] = Form.useForm();
  const [formRejectKYC] = Form.useForm();
  const [formHoldKYC] = Form.useForm();
  const [showFilter, setShowFilter] = useState(false);
  const [Tableloading, setTableloading] = useState<any>(false);

  const [virtualAccountData, setVirtualAccountData] = useState<any>([]);
  const [country, setCountry] = useState("");
  const [bankActiveTab, setBankActiveTab] = useState("kycDetails");
  const [userBankList, setUserBankList] = useState<any>([]);
  const [walletTransaction, setWalletTransaction] = useState<any>([]);
  const [page, setPage] = useState<any>(10);
  const [current, setCurrent] = useState<any>(1);
  const [totalPage, setTotalPage] = useState<any>(0);

  const [contractList, setContractList] = useState([]);
  const [contractTotalPage, setContractTotalPage] = useState(0);

  const [searchKey, setSearchKey] = useState<any>({});
  const [validationOnFilter, setValidationOnFilter] = useState("");
  const [selectedCurrencyMap, setSelectedCurrencyMap] = useState<{ [key: string]: string }>({});
  const ENABLE_USD_CURRENCY = process.env.ENABLE_USD_CURRENCY;
  const [selectedUserAlias, setSelectedUserAlias] = useState<any>([]);
  const [selected, setSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [selectAllWallet, setSelectAllWallet] = useState(false);
  const [selectedWalletTxnIds, setSelectedWalletTxnIds] = useState<any[]>([]);
  const [selectedWalletTxns, setSelectedWalletTxns] = useState<any[]>([]);
  const [platformFeesModal, setPlatformFeesModal] = useState(false);
  const [platformFeesData, setPlatformFeesData] = useState<any>(null);
  const [platformFeesExists, setPlatformFeesExists] = useState<any>(null);
  const [userPlatformFeeList, setUserPlatformFeesList] = useState<any>(null);
  const [hideBtnCreatePlatformFee, setHideBtnCreatePlatformFee] = useState<boolean>(false);
  // const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    
    if(userType !== 'TRUSTEE' && userType != 'MAKER' && userAlias) {
      const user = userAlias ?? ""
      virtualAccountDetails(user)
        .then((resp: any) => {
          
          const vaDetails = resp?.data?.VADetails || [];
          if(vaDetails?.length > 0) {
            // Extract existing currencies from VADetails
            const existingCurrencies = new Set(vaDetails.map((va: { currency: any; }) => va.currency));

            // Find missing currencies
            const missingCurrency = VALID_CURRENCY.filter(currency => !existingCurrencies.has(currency));

            if (missingCurrency.length > 0) {
                setValidCurrencyList(missingCurrency);
                setCreateVirtualAccount(true);
            } else {
              setCreateVirtualAccount(false);
            }
          } else {
            setValidCurrencyList(VALID_CURRENCY);
            setCreateVirtualAccount(true)
          }
        })
        .catch((err: any) => {
          console.log("err",err);
          
          if(err?.data?.statusCode === 404) {
            setValidCurrencyList(VALID_CURRENCY);
            setCreateVirtualAccount(true);
          }else {
            message.error("Failed to fetch escrow account data.");
          }
        })
    }
    getKycdetails();
    getRiskConfigurationDetails();
    getUserPlatformFeeList(userAlias);
  }, [userAlias, createVirtualAccnt]);

  const getUserPlatformFeeList = (userAlias: any) => {
    getAllUserPlatformFeesByUserAlias(userAlias).then((response: any) => {
      setLoading(false);
      const hasEscrow = response?.data?.some((fee:any) => fee.transactionType === "ESCROW");
      const hasMC = response?.data?.some((fee:any )=> fee.transactionType === "MC");

      const hideTrustButton = hasEscrow && hasMC;
      setHideBtnCreatePlatformFee(hideTrustButton);
      setUserPlatformFeesList(response?.data || []);
      setPlatformFeesData(response.data?.[0]);
    }).catch(() => {
      setLoading(false);
      message.error("Could not fetch details. Please try again later");
    });
  }
    
  const fetchcontractList = (pageNo: number, limit: number, tabValue: string) => {
    setTableloading(true);
    getContractList(userAlias, pageNo > 0 ? pageNo - 1 : 0, limit, tabValue)
      .then((res: any) => {
        setTableloading(false);
        if (!res?.data) {
            setContractList([]);
            setContractTotalPage(0);
            setTableloading(false);
            return;
        }
        const filteredContracts = res?.data?.data?.filter(
          (contract: { contractStatus: string }) => contract.contractStatus !== "0"
        ) ?? [];
        setContractList(filteredContracts);   
        setContractTotalPage(res?.data?.count || 0);        
        setTableloading(false);
      })
      .catch(() => {
        setTableloading(false);
        message.error("Oops! Could not fetch details. Please try again later!");
      });     
  };

  const handleCurrencyChange = (bankId: string, value: string) => {
    setSelectedCurrencyMap(prev => ({
      ...prev,
      [bankId]: value
    }));
  };

  const onChangePageContract = (pageno: number) => {
    setCurrent(pageno);
    if (typeof searchKey === "object" && Object.keys(searchKey)?.length > 0) {
      handleApplyFilter(searchKey, page, pageno);
      setValidationOnFilter("");
    } else {
      fetchcontractList(pageno, page, "all");
    }
  };

  const handlePlatformFeesSubmit = async (payload: any) => {
    setLoading(true);
    if (payload) {
      try {
        let response;
        if (payload.id) {
          response = await updatePlatformFees(payload.id, payload);
        } else {
          response = await createPlatformFees(payload);
        }
        setLoading(false);
        if (response.status === 200 || response.status === 201) {
          setPlatformFeesData(response.data);
          getUserPlatformFeeList(userAlias);
        } 
      } catch (err) {
        console.error("Error while saving platform fees", err);
        setLoading(false);
      }
    }
    setPlatformFeesModal(false);
  };

  const handleChangeContract = (value: number) => {
    setPage(value);
    setCurrent(1);
    if (typeof searchKey === "object" && Object.keys(searchKey)?.length > 0) {
      handleApplyFilter(searchKey, value, 1);
      setValidationOnFilter("");
    } else {
      fetchcontractList(1, value, "all");
    }
  };

  useEffect(() => {
    fetchcontractList(1, 10, "all");
  }, []);

  const handleApplyFilter = (
    filterOptions: any,
    limit: number,
    pageNo: number
  ) => {
    setShowFilter(false);
    setTableloading(true);
    setFilterApplied(true);
    if (
      (filterOptions.startDate?.length > 0) ||
      (filterOptions.endDate?.length > 0) ||
      (filterOptions.emailAddress?.length > 0) ||
      (filterOptions.customStatus?.length > 0) ||
      (filterOptions.status?.length > 0) ||
      (filterOptions.transId?.length > 0)
    ) {
      setValidationOnFilter("");
      let reqbody: any = {};

      if (
        filterOptions.customStatus !== undefined &&
        filterOptions.customStatus !== ""
      ) {
        reqbody.status = filterOptions.customStatus?.toLowerCase();
      }
      if (filterOptions.status !== undefined && filterOptions.status !== "") {
        if (!reqbody.status) {
          reqbody.status = filterOptions.status?.toLowerCase();
        }
      }
      if (
        (filterOptions.startDate !== undefined &&
          filterOptions.startDate?.length > 0) ||
        (filterOptions.endDate !== undefined &&
          filterOptions.endDate?.length > 0)
      ) {
        reqbody = {
          ...reqbody,
          startDate: filterOptions.startDate,
          endDate: filterOptions?.endDate,
        };
      }
      if (filterOptions.transId !== undefined && filterOptions.transId !== "") {
        reqbody = { ...reqbody, transId: filterOptions.transId };
      }
      if (
        filterOptions.emailAddress !== undefined &&
        filterOptions.emailAddress !== ""
      ) {
        reqbody = { ...reqbody, email: filterOptions.emailAddress.trim() };
      }

      if (userAlias) {
        reqbody.userAlias = userAlias;
      }
      reqbody.isSingleUser = true;

      setSearchKey(reqbody);

      filteredTransaction(reqbody, limit, pageNo)
        .then((res: any) => {
          const filteredData = res?.data?.data || [];

          const mappedData = filteredData.map((item: any) => ({
            agreementId: item.agreementid,
            aliasName: item.aliasname,
            createAt: item.createat,
            counterpartyDetails: item.counterpartyDetails,
            contractStatus: item.contractstatus,
            totalInvoiceAmount: item.totalInvoiceAmount,
            currency: item.currency,
            sellerAlias: item.selleralias,
            buyerAlias: item.buyeralias,
            escrowAdvisorAlias: item.escrowAdvisorAlias || "",
          }));

          setContractList(mappedData || []);
          // setContractTotalPage(res?.data?.count || 0);
          setContractTotalPage(res?.data.lastPage * page ||0);
          setTableloading(false);
        })
        .catch(() => {
          message.error("Failed to fetch filtered transactions");
          setTableloading(false);
        });
    } else {
      setValidationOnFilter("Selected filter is blank or invalid!");
      setTableloading(false);
    }
  };  

  const handleResetFilter = () => {
    setShowFilter(false);
    setSearchKey({});
    setValidationOnFilter("");
    setCurrent(1);
    fetchcontractList(1, 10, "all");
  };

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  useEffect(() => {
    fetchcontractList(current, page, "all");
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);

  }, []);

  const toggleSelectAllWallet = () => {
    if (selectAllWallet) {
      setSelectedWalletTxnIds([]);
      setSelectedWalletTxns([]);
      setSelected(false);
    } else {
      const allIds = walletTransaction.map((txn: { id: any; }) => txn.id);
      setSelectedWalletTxnIds(allIds);
      setSelectedWalletTxns([...walletTransaction]);
      setSelected(true);
    }
    setSelectAllWallet(!selectAllWallet);
  };

  const onWalletCheckboxChange = (transactionId: any, rowData: any) => {
    const isSelected = selectedWalletTxnIds.includes(transactionId);
    let newSelectedKeys, newSelectedRows;

    if (isSelected) {
      newSelectedKeys = selectedWalletTxnIds.filter((id) => id !== transactionId);
      newSelectedRows = selectedWalletTxns.filter((row) => row.id !== transactionId);
    } else {
      newSelectedKeys = [...selectedWalletTxnIds, transactionId];
      newSelectedRows = [...selectedWalletTxns, rowData];
    }

    setSelectedWalletTxnIds(newSelectedKeys);
    setSelectedWalletTxns(newSelectedRows);
    setSelected(newSelectedKeys.length > 0);
    setSelectAllWallet(newSelectedKeys.length === walletTransaction.length);
  };

  const downloadWalletDetails = () => {
    let url = `${process.env.REACT_APP_SERVER_URL}/api/v1/users/${userAlias}/download-payment-logs`;

    if (selected && selectedWalletTxnIds.length > 0) {
      const ids = selectedWalletTxnIds.join(",");
      url += `?accountType=ALL&accountAlias=ALL&page=0&limit=10&typeOfEntity=INDIVIDUAL&id=${encodeURIComponent(ids)}`;
    } else {
      message.warning("Please select transactions to download.");
      return;
    }

    setDownloading(true);

    downloadDetails(url)
      .then((response: any) => {
        setDownloading(false);
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", "PaymentLogs.xlsx");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => {
        setDownloading(false);
        console.error("Download failed:", err);
        message.error("Something went wrong! Please try again later.");
      });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUserAlias([]);
      setSelectedRows([]);
      setSelected(false)
    } else {
      const allUserAliases = contractList.map((item: any) => item.aliasName);
      setSelectedUserAlias(allUserAliases);
      setSelectedRows([...contractList]);
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
    setSelectAll(updatedSelectedUserAlias.length === contractList.length);
  };

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

  const downloadUserDetails = () => {
    let url = `${process.env.REACT_APP_SERVER_URL}/api/v1/admin/downloadTransaction`;

    if (selected && selectedUserAlias.length > 0) {
      url += `?id=${selectedUserAlias.join(",")}&userAlias=${userAlias}&typeOfEntity=INDIVIDUAL`;
    } else {
      url += `?userAlias=${userAlias}&typeOfEntity=INDIVIDUAL`;
    }

    setDownloading(true);

    downloadDetails(url)
      .then((response: any) => {
        setDownloading(false);
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", "EscrowTransactions.xlsx");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => {
        setDownloading(false);
        console.error("Download failed:", err);
        message.error("Something went wrong! Please try again later.");
      });
  };

  const detailView = (transaction:any) => {
    navigate(TransactionDetail + "/" + transaction?.aliasName)
  }

  const columns: object[] = [
    {
      title: "Transaction id",
      dataIndex: "agreementId",
      sorter: false,
      render: (text: any, values: any) => {
        return (
          <Typography.Text ellipsis={true} style={{ width: 120 }}>
            <span className="hyperLink" onClick={() => detailView( values )}>{text}</span> <br />
            <span className="text-muted fs-12x">
              {values?.isMilestone &&
              values?.contractStatus !== "0" &&
              values?.contractStatus !== "1" &&
              values?.activeMilestone
                ? `M${values?.activeMilestone} : ${
                    values?.activeMilestone
                      ? values?.transactions[values?.activeMilestone - 1].name
                      : ""
                  }`
                : ``}
            </span>
          </Typography.Text>
        );
      },
    },
    {
      title: "My role",
      dataIndex: "agreementId", 
      render: (_text: string, value: any) => {
        return userAlias === value.sellerAlias
          ? "SELLER"
          : userAlias === value.buyerAlias
          ? "BUYER"
          : userAlias === value.escrowAdvisorAlias
          ? "ESCROW ADVISOR"
          : "N/A";
      },
    },    
    {
      title: "Date",
      dataIndex: "createAt",
      sorter: false,
      render: (text: string) => {
        return <span>{moment(new Date(text)).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: userType === USER_TYPE_TEXT?.ESCROW_ADVISOR ? "Buyer" : "Counterparty",
      dataIndex: "counterpartyDetails",
      sorter: false,
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
      title: userType === USER_TYPE_TEXT?.ESCROW_ADVISOR ? "Seller" : "Email address",
      dataIndex:  userType === USER_TYPE_TEXT?.ESCROW_ADVISOR ? "sellerDetails" : "counterpartyDetails",
      sorter: false,
      render: (text: any) => {
        return  userType === USER_TYPE_TEXT?.ESCROW_ADVISOR ? <span>{text?.name}</span> : <Typography.Text style={{ width: 200 }}>{text?.email}</Typography.Text>;
        },
    },
    {
      title: "Status",
      dataIndex: "contractStatus",
      sorter: false,
      width: 200,
      render: (text: string) => {
        let displayText = "";
        let statusClass = "";
    
        if (text === "0") {
          displayText = "Drafted";
          statusClass = "drafted"; 
        } else {
          const statusKey = (text || "").replace(/\s+/g, "_").toUpperCase();
          displayText = contractStatusMap[statusKey] || text || "";
          statusClass = displayText.toLowerCase().replace(/\s+/g, "_");
        }
    
        return (
          <span className="status">
            <span className={statusClass}>{displayText}</span>
          </span>
        );
      },
    },        
    {
      title: "Amount",
      dataIndex: "totalInvoiceAmount",
      sorter: false,
      width: 200,
      render: (text: string, value: any) => {
        return <b>{value?.currency + " " + parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>;
      },
    },
  ];
  
  const getBankList = (user: string) => {
    getlocalBankDetails(user)
      .then((response) => {
        setLoading(false);
        setUserBankList(response?.data?.bankDetails || []);
      })
      .catch(() => {
        setLoading(false);
        message.error("Could not fetch details. Please try again later");
      });
  };  

  const walletTransactionList = (currentPage = 0, limit = 10) => {
    setTableloading(true);
    if (!userAlias) {
      console.error('User alias is missing');
      return;
    }
    getWalletTransactionList(
      userAlias,
      "ALL",
      "ALL",
      currentPage,
      limit
    )
      .then((response) => {
        setTableloading(false);
        setWalletTransaction(response.data?.VATransactionList?.data || []);
        setTotalPage(response.data?.VATransactionList?.escrowCount || 0);
      })
      .catch(() => {
        setTableloading(false);
        setWalletTransaction([]);
        setTotalPage(0);
      });
  };

  const pagination: object = {
    pageSize: page,
    current: current,
    style: { display: "none" },
  };

  const handleChange = (value: number) => {
    setPage(value);
    setCurrent(1);
    walletTransactionList(0, value);  
  };  

  const onChangePage = (pageno: number) => {
    setCurrent(pageno);
    walletTransactionList(pageno -1, page);  
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

  useEffect(() => {
    if (userAlias) {
      walletTransactionList(0, 10); 
    }
  }, [userAlias]);

  const Paylogcolumns: object[] = [
    {
      title: "Account Id",
      dataIndex: "VirtualAccountId",
      sorter: false,
      // width: 150,
      render: (text: any) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Type",
      dataIndex: "AccountType",
      sorter: false,
      // width: 100,
    },
    {
      title: "Booking Date",
      dataIndex: "createAt",
      sorter: false,
      // width: 100,
      render: (_text: string, record: any) => {
        const dateStr = record.createAt || record.BookingDateTime || "";
        const date = moment(dateStr, ["DD/MM/YY", moment.ISO_8601], true);
        return <span>{date.isValid() ? date.format("DD-MM-YYYY") : "-"}</span>;
      }, 
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      sorter: false,
      // width: 100,
      render: (text: string, record: any) => {
        const currency = record?.Currency || "AED"
        return (
          <span>
            {currency}{" "}
            {parseFloat(text).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
    {
      title: "Charges",
      dataIndex: "PaymentCharges",
      sorter: false,
      // width: 100,
      render: (text: string) => {
        if(!text) return <Typography.Text ellipsis={true}  className="overflowText">--</Typography.Text>;
        const isPointValue = Number(text) % 1 !== 0;
        const formattedAmount = isPointValue ? ` ${parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ` ${parseFloat(text).toLocaleString()}`;
        return <span>{formattedAmount}</span>;
      },
    },
    {
      title: "Indicator",
      dataIndex: "CreditDebitIndicator",
      sorter: false,
      // width: 100,
      render: (text: string) => {
        return <span>{text === "C" ? "Credit" : text} </span>;
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      sorter: false,
      // width: 100,
      render: (text: any) => {
        return (
          <div className="status capitalize">
            <span className={text.toLowerCase()}>{text}</span>
          </div>
        );
      },
    },
    {
      title: "Payment Mode",
      dataIndex: "PaymentMode",
      sorter: false,
      // width: 150,
    },
  ];
    
  useEffect(() => {
    if ((bankActiveTab === "bankDetails" || !createVirtualAccnt) && userAlias) {
      const user = userAlias;
      setLoading(true);
  
      virtualAccountDetails(user)
        .then(async (res) => {
          const vaDetails = res?.data?.VADetails;
  
          if (!vaDetails || vaDetails.length === 0) {
            message.warning("Please verify KYC and create escrow account");
            setLoading(false);
            return;
          }
  
          setCountry(vaDetails[0]?.address?.countryCode);
  
          const updatedVAWithBalance = await Promise.all(
            vaDetails.map(async (account: any) => {
              try {
                const balanceRes = await getWalletTotalAmountAndCount(userAlias, account.currency);
                return {
                  ...account,
                  balanceAmount: balanceRes?.data?.walletTransaction?.balanceAmount || 0,
                };
              } catch {
                return {
                  ...account,
                  balanceAmount: 0,
                };
              }
            })
          );
  
          setVirtualAccountData(updatedVAWithBalance);
          setLoading(false);
        })
        .catch((error) => {     
          setLoading(false);   
          const status = error?.status;
          const errData = error?.data;
          if (status === 404 || errData?.message === "Account not found") {
            if (KYCDetails?.kybStatus === "VERIFIED") {
              message.warning("Please create an escrow account.");
            }
          } else {
            message.error("Could not fetch details. Please try again later");
          }
        });    
        getBankList(user);          
    }
  }, [userAlias, bankActiveTab]);

  const onBankActiveTab = (key: string) => {
    if (key === "bankDetails" && (KYCDetails?.kybStatus === "REJECTED" || KYCDetails?.kybStatus === "PENDING")) {
      message.warning("Please verify KYC details before accessing Bank Details.");
      return;
    }
    setBankActiveTab(key);
    setSelectedWalletTxnIds([]);
    setSelectedUserAlias([]);
    setSelected(false);
  };
  

  const validateCommentField = (
    value: any,
    fieldName: string,
    setSpecialErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    if (!value || value.trim() === '') {
      setSpecialErrors(prev => ({ ...prev, [fieldName]: false }));
      return Promise.resolve();
    }
  
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value))  {
      setSpecialErrors(prev => ({ ...prev, [fieldName]: true }));
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
  
    if (value.length < 20) {
      setSpecialErrors(prev => ({ ...prev, [fieldName]: true }));
      return Promise.reject(new Error("Please enter minimum 20 characters"));
    }
    
    setSpecialErrors(prev => ({ ...prev, [fieldName]: false }));
    return Promise.resolve();
  };
   
  const validatePopupCommentFields = (value: any) => {
    if (!value || value.trim() === '') {
      return Promise.reject(new Error("Please add some comment!"));
    }
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    if (value.length < 20) {
      return Promise.reject(new Error("Please enter minimum 20 characters"));
    }
    return Promise.resolve();
  };

  const handleDownload = (url: string, isPDF: any) => {
    if (!url) {
      message.error("Unable to download: Document URL is missing");
      return;
    }
    const popup: Window | null = window.open("", "_blank")
    if (popup) {
      if (isPDF) {
        const sanitizedUrl = new URL(url).toString();
        const iframeHTML = `
        <iframe src="${sanitizedUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
        `;
        const fallbackHTML = `
          <p style="margin-top: 10px;font-size: 25px">
            Your browser does not support viewing PDFs. 
            <a href="${url}" download="document.pdf" style="color: blue; text-decoration: underline;">Click here to download</a>.
          </p>
        `;
        const canEmbedPDF = document.createElement("iframe").src !== "";
        popup.document.write(canEmbedPDF ? iframeHTML : fallbackHTML);
      } else {
        const imgHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 400px;" />`;
        popup.document.write(imgHTML);
      }
    }
    
    const link = document.createElement("a");
    link.href = url;
  
    if (isPDF) {
      link.download = "document.pdf";
    } else {
      link.download = "image.jpg";
    }
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadKYCDetails = () => {
    const files = [];
    const data = KYCDetails?.documents?.[0];
    if (data?.repDocFront?.[0]?.url) {
      files.push(data?.repDocFront?.[0]?.url);
    }
    if (data?.repDocBack?.[0]?.url) {
      files.push(data?.repDocBack?.[0]?.url);
    }
    if (data?.repAddProof?.[0]?.url) {
      files.push(data?.repAddProof?.[0]?.url);
    }
    if (data?.businessAddProof?.[0]?.url) {
      files.push(data?.businessAddProof?.[0]?.url);
    }
    if (data?.businessRegProof?.[0]?.url) {
      files.push(data?.businessRegProof?.[0]?.url);
    }
    setLoader(true);
    if ( downloadOption == 1) {
      downloadKybDetails(userAlias).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "KYCDetails.xlsx");
        document.body.appendChild(link);
        link.click();
        setDownloadModal(false);
        setLoader(false);
      });
    }
    if (downloadOption == 2) {
      multiDownload(files);
      setDownloadModal(false);
      setLoader(false);
    }
    if(downloadOption == 3){
      downloadKybDetails(userAlias).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "KYCDetails.xlsx");
        document.body.appendChild(link);
        link.click();
        setDownloadModal(false);
        setLoader(false);
      });
      multiDownload(files);
    }
  };
  const getKycdetails = (isUpload="") => {
    fetchKybDetails(userAlias,true).then(async (response: any) => {
      const data = response?.data?.data?.[0];      
      if((userType==="TRUSTEE" || userType === 'MAKER') && (data?.trusteeKybStatus === true ||  data?.isTrusteeKybRejected === true)){
        setDisable(true)
    } else if(data?.kybStatus === "VERIFIED" ||
    data?.kybStatus === "REJECTED" || data?.kybStatus === "EXPIRED"){
      setDisable(true)
    } else{
      setDisable(false)
    }
      setKYCDetails(data);
      if (data?.userAlias) {
        const res = await getUserPlatformFees(data.userAlias, TRANSACTION_TYPE.ESCROW);
        const feesData = res?.data;
        if (feesData) {
          setPlatformFeesExists(feesData);  
        } else {
          setPlatformFeesExists(null);
        }
      }
      if(isUpload == ""){
        // admin comments
        const comments = {
          amlScreening: data?.adminComments?.amlScreeningComment,
          adverseMedia: data?.adminComments?.adverseMediaComment,
          nameAndIdVerification:
            data?.adminComments?.nameAndIdVerificationComment,
          validDocumentVerification:
            data?.adminComments?.validDocumentVerificationComment,
            PoliticallyExposedPersonComment:
            data?.adminComments?.PoliticallyExposedPersonComment,
            otherCommentAndNotes: data?.adminComments?.otherCommentAndNotes,
        };

        // approver comments
        const commentsApprover = {
          amlScreening: data?.approverComments?.amlScreeningComment,
          adverseMedia: data?.approverComments?.adverseMediaComment,
          nameAndIdVerification:
            data?.approverComments?.nameAndIdVerificationComment,
          validDocumentVerification:
            data?.approverComments?.validDocumentVerificationComment,
            PoliticallyExposedPersonComment:
            data?.approverComments?.PoliticallyExposedPersonComment,
            otherCommentAndNotes: data?.approverComments?.otherCommentAndNotes,
        };

        setCheckboxComment(comments);
        setCheckboxCommentApprover(commentsApprover);

        // checkbox data
        if (isApprover) {
          setAmlScreening(!!commentsApprover.amlScreening);
          setValidDocumentVerification(!!commentsApprover.validDocumentVerification);
          setAdverseMedia(!!commentsApprover.adverseMedia);
          setNameAndIdVerification(!!commentsApprover.nameAndIdVerification);
          setPoliticallyPerson(!!commentsApprover.PoliticallyExposedPersonComment);
          setOtherComment(!!commentsApprover.otherCommentAndNotes);
        } else {
          setAmlScreening(!!comments.amlScreening);
          setValidDocumentVerification(!!comments.validDocumentVerification);
          setAdverseMedia(!!comments.adverseMedia);
          setNameAndIdVerification(!!comments.nameAndIdVerification);
          setPoliticallyPerson(!!comments.PoliticallyExposedPersonComment);
          setOtherComment(!!comments.otherCommentAndNotes);
        }
        setDropDownValue(Number(data?.clientClassification));
      }

      if (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) {
        if (data.documents?.[0]?.repDocFront?.[0]?.status === "VERIFIED" && data.documents?.[0]?.repDocBack?.[0]?.status === "VERIFIED" && data?.documents?.[0]?.repAddProof?.[0]?.status === "VERIFIED") {
          setIsAllDocUpdated(true);
        }
      }
      if (userType === "TRUSTEE" || userType === 'MAKER') {
        if (data.documents?.[0]?.repDocFront?.[0]?.isCompliance === true && data.documents?.[0]?.repDocBack?.[0]?.isCompliance === true && data?.documents?.[0]?.repAddProof?.[0]?.isCompliance === true) {
          setIsAllDocUpdated(true);
        }
      }


      let riskScore = 0;
      if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.LOW_RISK) {
        riskScore = 1;
      } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.MEDIUM_RISK){
        riskScore = 2;
      } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.HIGH_RISK){
        riskScore = 3;
      }
      if (data?.clientClassification && !isNaN(parseInt(data?.clientClassification)) && parseInt(data?.clientClassification)  !== riskScore) {
        riskScore = parseInt(data?.clientClassification);
      }
      if (riskScore > 0) {
        setDropDownValue(riskScore);
      }
    
      if (data?.kybInfo?.length > 0) {
        setKybInfo(data?.kybInfo[0]);
        setDigiScreeningPayload(data?.digiScreeningPayload);
        setRiskAssessment(data?.riskAssessment);
        setKybBasic({...data?.basic?.[0],representativeName:data?.representative?.[0]?.representativeName});
        setRiskAssessmentPayload(data?.riskAssessmentPayload);
        setRiskAssessmentFormPayload(data?.riskAssessmentFormPayload);
      }
      if (Object.keys(data?.kycFATCAPayload)?.length > 0) {
        setKycFATCAPayload(data?.kycFATCAPayload);
      }
    });
  };

  // const isValueExist = (value: any): boolean => {
  //   return value !== null && value !== undefined;
  // };

  //  const checkLength = (checkboxObj: any): boolean => {
  //    return Object.values(checkboxObj).every(
  //      (value: any) =>
  //        isValueExist(value) &&
  //      (typeof value !== 'string' || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT)
  //    );
  //  };

  const approveKYC = (type:any) => {  
    setLoading(true);
    const reqBody:any = {
      userAlias: userAlias,
      type: "approved",
      [(userType === "TRUSTEE" || userType === 'MAKER') ? 'trusteeComment' : 'comment']: comment,
      alias: currentUserAlias,
      validDocumentVerification:
        validDocumentVerification === undefined
          ? KYCDetails?.validDocumentVerification === true
            ? true
            : false
          : validDocumentVerification,
      nameAndIdVerification:
        nameAndIdVerification === undefined
          ? KYCDetails?.nameAndIdVerification === true
            ? true
            : false
          : nameAndIdVerification,
      amlScreening:
        amlScreening === undefined
          ? KYCDetails?.amlScreening === true
            ? true
            : false
          : amlScreening,
      adverseMedia:
        adverseMedia === undefined
          ? KYCDetails?.adverseMedia === true
            ? true
            : false
          : adverseMedia,
      clientClassification:
        dropDownValue === undefined
          ? KYCDetails?.clientClassification
            ? KYCDetails?.clientClassification
            : ""
          : dropDownValue,
      PoliticallyExposedPerson:
        PoliticallyPerson === undefined
          ? KYCDetails?.PoliticallyExposedPerson === true
            ? true
            : false
          : PoliticallyPerson,

          otherComment:
          otherComment === undefined
            ? KYCDetails?.otherComment === true
              ? true
              : false
            : otherComment,
      // Checkbox textarea values
      adminComments: {
        adverseMediaComment: checkboxComment.adverseMedia,
        amlScreeningComment: checkboxComment.amlScreening,
        nameAndIdVerificationComment: checkboxComment.nameAndIdVerification,
        PoliticallyExposedPersonComment:
          checkboxComment?.PoliticallyExposedPersonComment,
        validDocumentVerificationComment:
          checkboxComment.validDocumentVerification,
          otherCommentAndNotes:checkboxComment.otherCommentAndNotes,
      },
      approverComments: {
        adverseMediaComment: checkboxCommentApprover.adverseMedia,
        amlScreeningComment: checkboxCommentApprover.amlScreening,
        nameAndIdVerificationComment:
          checkboxCommentApprover.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentApprover.validDocumentVerification,
          PoliticallyExposedPersonComment:
          checkboxCommentApprover?.PoliticallyExposedPersonComment,
          otherCommentAndNotes:checkboxCommentApprover?.otherCommentAndNotes,
      },
    };
    // if (userType == "TRUSTEE") {
    //   reqBody["trusteeComment"] = checkboxComment?.trusteeComment;
    // }

    if (type != "hold") {
      verifyKyb(reqBody)
        .then((res) => {
          setLoading(false);
          if (res.status === 201 || res.status == 200) {
            // setSuccessModal(true);
              getKycdetails();
              setCreateVirtualAccount(true);
              handleModalCancel();
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later");
        });
    }
    if (type == "hold") {
      reqBody["type"] = "hold";
      holdKyc(reqBody)
        .then((res: any) => {
          setLoading(false);
          if (res?.status === 201 || res?.status == 200) {
            // setSuccessModal(true);
            getKycdetails();
            handleModalCancel();
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later");
        });
    }
  };

  const isAllChecklistChecked = () => {
    let  check = validDocumentVerification &&
    nameAndIdVerification &&
    amlScreening &&
    adverseMedia &&
    PoliticallyPerson &&
    otherComment;
    const condA = checkboxComment?.amlScreening &&
    checkboxComment?.adverseMedia &&
    checkboxComment?.nameAndIdVerification &&
    checkboxComment?.validDocumentVerification &&
    checkboxComment?.PoliticallyExposedPersonComment &&
    checkboxComment?.otherCommentAndNotes;
    const condB = checkboxCommentApprover?.amlScreening &&
    checkboxCommentApprover?.adverseMedia &&
    checkboxCommentApprover?.nameAndIdVerification &&
    checkboxCommentApprover?.validDocumentVerification &&
    checkboxCommentApprover?.PoliticallyExposedPersonComment &&
    checkboxCommentApprover?.otherCommentAndNotes;

    if (isApprover) {
      check &&= condA || condB;
    } else {
      check &&= condA;
    }

    return (
      validDocumentVerification &&
      nameAndIdVerification &&
      amlScreening &&
      adverseMedia &&
      PoliticallyPerson &&
      otherComment &&
      check
    );
  };

  const rejectKYC = () => {
    setLoading(true);
    const reqBody = {
      userAlias: userAlias,
      rejectedReason: comment,
      clientClassification:dropDownValue,
      type: "rejected",
      userType: userType,
      alias: currentUserAlias,
      [(userType === "TRUSTEE" || userType === 'MAKER') ? 'trusteeComment' : 'comment']: comment,
      validDocumentVerification:
        validDocumentVerification === undefined
          ? KYCDetails?.validDocumentVerification === true
            ? true
            : false
          : validDocumentVerification,
      nameAndIdVerification:
        nameAndIdVerification === undefined
          ? KYCDetails?.nameAndIdVerification === true
            ? true
            : false
          : nameAndIdVerification,
      amlScreening:
        amlScreening === undefined
          ? KYCDetails?.amlScreening === true
            ? true
            : false
          : amlScreening,
      adverseMedia:
        adverseMedia === undefined
          ? KYCDetails?.adverseMedia === true
            ? true
            : false
          : adverseMedia,
      PoliticallyExposedPerson:
        PoliticallyPerson === undefined
          ? KYCDetails?.PoliticallyExposedPerson === true
            ? true
            : false
          : PoliticallyPerson,

          otherComment:
          otherComment === undefined
            ? KYCDetails?.otherComment === true
              ? true
              : false
            : otherComment,
      // Checkbox textarea values
      adminComments: {
        adverseMediaComment: checkboxComment.adverseMedia,
        amlScreeningComment: checkboxComment.amlScreening,
        nameAndIdVerificationComment: checkboxComment.nameAndIdVerification,
        PoliticallyExposedPersonComment:
          checkboxComment?.PoliticallyExposedPersonComment,
        validDocumentVerificationComment:
          checkboxComment.validDocumentVerification,
          otherCommentAndNotes:checkboxComment.otherCommentAndNotes,
      },
      approverComments: {
        adverseMediaComment: checkboxCommentApprover.adverseMedia,
        amlScreeningComment: checkboxCommentApprover.amlScreening,
        nameAndIdVerificationComment:
          checkboxCommentApprover.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentApprover.validDocumentVerification,
          PoliticallyExposedPersonComment:
          checkboxCommentApprover?.PoliticallyExposedPersonComment,
          otherCommentAndNotes:checkboxCommentApprover?.otherCommentAndNotes,
      },
    };    
    verifyKyb(reqBody)
      .then((res) => {
        setLoading(false);
        if (res.status === 201 || res.status == 200) {
          getKycdetails();
          handleModalCancel();
        }
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Something went wrong. Please try again later");
      });
  };

  const handleModalCancel = () => {
    setClassificationModalVisible(false);
    setCommentModal(false);
    setApproveModal(false);
    setRejectModal(false);
    setDownloadModal(false);
    SetCommentModalReject(false);
    setSearchKybModal(false);
    setHoldModal(false);
    setCreateVirtualAccountModal(false);
    form.resetFields();
    formDocumentApprove.resetFields();
    formDocumentReject.resetFields();
    formApproveKYC.resetFields();
    formRejectKYC.resetFields();
    formHoldKYC.resetFields();
    frmEscrow.resetFields();
    formDocumentApprove.resetFields();
    formDocumentReject.resetFields();
    formApproveKYC.resetFields();
    formRejectKYC.resetFields();
    formHoldKYC.resetFields();
    setComment("");
  };
  const handleReject = async () => {
    const obj = {
      userAlias: userAlias,
      [CommentModalData]: false,
      [(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) ? 'reason' : 'approverReason']: comment,
      alias: currentUserAlias,
      isRejected: true,
    };
    const resp = await verifyKybDocument(obj);
    if (resp.status === 201 || resp.status === 200) {
      handleModalCancel();
      getKycdetails("upload");
    }
  };
  
  const handleApprove = async () => {
    const obj = {
      userAlias: userAlias,
      [CommentModalData]: true,
      [(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) ? 'reason' : 'approverReason']: comment,
      alias: currentUserAlias,
    }; 
    
    const resp = await verifyKybDocument(obj);
    if (resp.status === 200 || resp.status === 201) {
      handleModalCancel();
      getKycdetails("upload");
    }
  };
  const openApproveModal = () => {
    setApproveModal(true);
  };

  const openRejectModal = () => {
    setRejectModal(true);
  };
  const checkCommentsCheckbox = (id:any) =>{
    switch (id) {
      case "validDocumentVerification":
        setValidDocumentVerification(true)
        break;
      case "nameAndIdVerification":
        setNameAndIdVerification(true)
        break;
      case "amlScreening":
        setAmlScreening(true)
        break;
      case "adverseMedia":
        setAdverseMedia(true)
        break;
      case "PoliticallyExposedPersonComment":
        setPoliticallyPerson(true)
        break;
      case "otherCommentAndNotes":
        setOtherComment(true)
        break;
                    
      default:
        break;
    }

  }
  const adjustHeight = (id: string, value: string) => {
    if(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)){
    // const element = document.getElementById(id)!;
    // element.style.height = "1px";
    // element.style.height = 25 + element.scrollHeight + "px";
    const comments = { ...checkboxComment };
    comments[id] = value;
    setCheckboxComment(comments);
    checkCommentsCheckbox(id)
    }
  };
   
  const adjustHeightForApprover = (id: string, value: string) => {
    if(userType === 'TRUSTEE' || userType === 'MAKER'){
    // const element = document.getElementById(id+'Approver')!;
    // element.style.height = "auto";
    // element.style.height =  element.scrollHeight + "px";
    const comments = { ...checkboxCommentApprover };
    comments[id] = value;
    setCheckboxCommentApprover(comments);
    checkCommentsCheckbox(id)
    }

    
  };

  const handleDropdownChange = (e: any) => {
    setDropDownValue(e?.target?.value);
    if(disable){
      openClassificationModal();
      form.setFieldValue("title", e.target.value);
    }
  };

  const handleComment = (event: any) => {
    setComment(event.target.value);
  };

  const openClassificationModal = () => {
    setClassificationModalVisible(true);
  };

  const goBack = () => {
    navigate(KYCManagementList);
  };

  const getRiskConfigurationDetails = async() => {
    setLoading(true);
   await getRiskConfiguration({ RiskCategory: "I" })
      .then((response) => {
        if (response?.data?.status === 201 || response?.data?.status == 200) {
          setLoading(false);
          setRiskDetails(response?.data?.result);
          if (response?.data?.result && response?.data?.result?.length) {
            const result = response?.data?.result
            const graphicRiskIndex = result.findIndex((d:any) => d.riskCategory == 'Geographic Risk')
            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes']?.map((r:any) => {
                if (r?.riskType == 'Is the country subject to increased monitoring by FATF') {
                  setFatfTypeId(r?.id)
                  setFatfList(r?.riskItems || [])
                }
                if (r?.riskType == 'Nationality') {
                  setCountryList(r?.riskItems || [])
                  setBrithPlaceList(r?.riskItems || [])
                }
              })
            }
            return result
          }
        }
      }).catch((error) => {
        setLoading(false);
        message.error(error?.error?.message ? error?.error?.message : "Something went wrong")
      });
  }

  // const handleInput = (e:any) => {
  //   const regex = /^[A-Za-z,.\- ]*$/; 
  //   const currentValue = e.target.value;
  //   if (!regex.test(currentValue)) {
  //     e.preventDefault();
  //     e.target.value = currentValue.slice(0, -1); 
  //   } 
  //   // else {
  //   //   adjustHeight("validDocumentVerification", currentValue);
  //   // }
  // };

  useEffect(() => {
    const rejectedReason:any = [{ rejectReason:[] }];
    if (
      KYCDetails?.documents?.[0]?.repDocFront?.[0]?.status === "REJECTED" ||
      KYCDetails?.documents?.[0]?.repDocFront?.[0]?.isCompliance === "false"
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: `${DOCUMENT_TYPE[KYCDetails?.documents?.[0]?.repDocType]} Front`,
        reason: KYCDetails?.documents?.[0]?.repDocFront?.[0]?.reason,
      });
    }
    if (
      KYCDetails?.documents?.[0]?.repDocBack?.[0]?.status === "REJECTED" ||
      KYCDetails?.documents?.[0]?.repDocBack?.[0]?.isCompliance === "false"
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: `${
          DOCUMENT_TYPE[KYCDetails?.documents?.[0]?.repDocType]
        } back`,
        reason: KYCDetails?.documents?.[0]?.repDocBack?.[0]?.reason,
      });
    }

    if (
      KYCDetails?.documents?.[0]?.repAddProof?.[0]?.status === "REJECTED" ||
      KYCDetails?.documents?.[0]?.repAddProof?.[0]?.isCompliance === "false"
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Address proof",
        reason: KYCDetails?.documents?.[0]?.repAddProof?.[0]?.reason,
      });
    }
    
    // setRejectedReason(rejectedReason);
  }, [KYCDetails]);

  const handleRiskClassificationSubmit = async () => {
    try {
      setLoading(true);
      const reqBody = {
        userAlias: userAlias,
        comment: comment,
        clientClassification: dropDownValue,
        userType: userType,
        alias: currentUserAlias
      };

      const res = await updateKybKycRiskClassification(reqBody);

      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        handleModalCancel();
        getKycdetails();
        message.success(res?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      message.error("Oops! Something went wrong. Please try again later");
    }
  }

  const renderMultipleTaxResidencyRows = () => {
    const rows = [];
    for (let i = 0; i < parseInt(kycFATCAPayload?.kycNumberOfCountry ?? 0); i++) {
      rows.push(
        <>
          <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
            <Col>
              <Space direction="vertical">
                <Text type="secondary">
                  <b>Please let us know your other tax residency.</b>
                </Text>
                <Text>
                  <b>
                    {toTitleCase(kycFATCAPayload?.[`hasMultipleTaxResidencyKycCountry_${i}`]) ?? '---'}
                  </b>
                </Text>
              </Space>
            </Col>
          </Row>
          <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
            <Col>
              <Space direction="vertical">
                <Text type="secondary">
                  <b>Do you have a Tax identification number? </b>
                </Text>
                <Text>
                  <b>
                    {toTitleCase(kycFATCAPayload?.[`hasMultipleKycTIN_${i}`]) ?? '---'}
                  </b>
                </Text>
              </Space>
            </Col>
          </Row>
          {kycFATCAPayload?.[`hasMultipleKycTIN_${i}`] === 'yes' && (
            <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary">
                    <b>Tax identification number</b>
                  </Text>
                  <Text>
                    <b>
                      {kycFATCAPayload?.[`multipleKycTinNo_${i}`] ?? '---'}
                    </b>
                  </Text>
                </Space>
              </Col>
            </Row>
          )}
          {kycFATCAPayload?.[`hasMultipleKycTIN_${i}`] === 'no' && (
            <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary">
                    <b>Reason for no TIN Number</b>
                  </Text>
                  <Text>
                    <b>
                      {kycFATCAPayload?.[`multipleKycNoTinReason_${i}`] === "countryNotissueTINs"
                        ? "Country/ Jurisdiction does not issue TINs." : kycFATCAPayload?.[`multipleKycNoTinReason_${i}`] === "countryNotRequirToProvideTIN"
                          ? "Country/ Jurisdiction does not require me to provide TIN." : kycFATCAPayload?.[`multipleKycNoTinReason_${i}`] === "unableToObtainTIN"
                            ? "Unable to obtain a TIN." : ""}
                    </b>
                  </Text>
                </Space>
              </Col>
            </Row>
          )}
        </>
      );
    }
    return rows;
  };


  const handlePDFView = (url: any) => {
    if (url) {
      setImagUrl(url);
      setverifyVisible(true)
    }
  }

  const createVirtualAcc = async (values:any) => {
    setLoader(true);
    const reqObject: any = {
      userAlias,
      userType,
      enrollBy: values?.enrollBy,
      currency: values?.currency
    }
    if (values?.comment) {
      reqObject.comment = values?.comment
    }

    createVirtualAccount(reqObject).then((response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        setLoader(false);
        setCreateVirtualAccountModal(false);
        setCreateVirtualAccount(false);
        setOnSuccessCreateVA(true);
        const newVirtualAcc = {
          ...response.data, 
          currency: values?.currency,
          comment: values?.comment,
          enrollBy: values?.enrollBy,
        };
        setVirtualAccountData((prev: any) => [...prev, newVirtualAcc]);
      }  else {
        setLoader(false);
        setCreateVirtualAccountModal(false);
        message.error("Error creating escrow account.")
      }
    }).catch(() => {
      setLoader(false);
      setCreateVirtualAccountModal(false);
      message.error("Error creating escrow account.")
    }).finally(() => {
      setLoader(false);
    });
  }

  return (
    <div className="m-main-body-section scrollbar-container">
       <DefaultLayout
        page="kyc_management"
        loading={loading}
        TitleText="KYC Details"
        TitleImage={LeftArrow}
        backtoDashboard={true}
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
                    <b> KYC Details</b>
                    <Breadcrumb separator=">">
                      {/* <Breadcrumb.Item
                        onClick={() => {
                          navigate(Dashboard);
                        }}
                        className="cursor"
                      >
                        Dashboard
                      </Breadcrumb.Item> */}
                      <Breadcrumb.Item
                        // className="cursor"
                        // onClick={() => {
                        //   navigate(KYCManagementList);
                        // }}
                      >
                        Management
                      </Breadcrumb.Item>
                      <Breadcrumb.Item
                        className="cursor"
                        onClick={() => {
                          navigate(KYCManagementList);
                        }}
                      >
                        KYC management
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>KYC details</Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                </div>
              }
      >
                <div className="d-flex w-100 overflow-auto dashboardTabs escrow-tran-card">
                  <Tabs
                    defaultActiveKey="KycDetails"
                    className="tableTab overflow-auto "
                    activeKey={bankActiveTab}
                    onChange={onBankActiveTab}
                  >
                    <TabPane tab={"KYC Details"} key="kycDetails"></TabPane>
                    <TabPane
                      tab={"Bank Details"}
                      key="bankDetails"
                    ></TabPane>
                    <TabPane
                      tab={"Escrow Transaction"}
                      key="escrowTrans"
                    ></TabPane>
                    <TabPane
                      tab={"Payment Logs"}
                      key="paymentLogs"
                    ></TabPane>
                  </Tabs>
                </div>
                {bankActiveTab === "kycDetails" &&
                <>
            <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} className="endtoend">
              <Col sm={24} md={24} lg={15}  className="w-100">
                <div className="bg-admin-card w-100 kyc-user-details-card">
                  <Col span={24} className="bg-admin-card-m-col w-100">
                    <div className="d-flex card-items-row">
                      <Col sm={24} md={24} lg={24} className="mr-25 bg-admin-card-m-col p-0">
                        <div className="title_white">
                          {KYCDetails?.representative?.[0]?.representativeName}
                        </div>
                        <div className="subtext_white mt-3 ">
                          {
                            COMPANY_ROLE[
                              KYCDetails?.representative?.[0]?.roleType
                            ]
                          }
                        </div>
                        <hr className="my-4" />
                      </Col>
                      {/* <Col span={5}>
                        <Image
                          src={ProfileImage}
                          alt="profile"
                          preview={false}
                        />
                      </Col> */}
                    </div>
                    <div className="d-flex flex-wrap">
                      <div className="mr-20">
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Email} alt="email" preview={false} />
                          <Tooltip title={KYCDetails?.basic?.[0]?.email} overlayClassName="custom-tooltip">
                            <span className="ml-4 overflowText ">
                              {KYCDetails?.basic?.[0]?.email}
                            </span>
                          </Tooltip>
                        </div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Phone} alt="phone" preview={false} />
                          <span className="ml-4 overflowText">
                            {KYCDetails?.basic?.[0]?.contactNumber}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Nation} alt="country" preview={false} className="me-3"/>
                          <Tooltip
                              title={KYCDetails?.basic?.[0]?.countryName ?? KYCDetails?.basic?.[0]?.country ?.length * 7 > 100 ? KYCDetails?.basic?.[0]?.countryName ?? KYCDetails?.basic?.[0]?.country  : null}
                              overlayClassName='bluecard-custom-tooltip'
                            >
                          <span className="overflowText">
                            {KYCDetails?.basic?.[0]?.country ?? KYCDetails?.basic?.[0]?.country }
                          </span>
                          </Tooltip>
                          <div>
                          <div className="px-1 bluecard-flag">
                          <span>
                          {(KYCDetails?.basic?.[0]?.country || KYCDetails?.KYCDetails?.[0]?.country)
                            ? (
                              <span
                                className={`fi fi-${String(
                                  KYCDetails?.basic?.[0]?.country || KYCDetails?.KYCDetails?.[0]?.country
                                ).toLowerCase()}`}
                              />
                            )
                            : "--"}
                        </span>
                          </div>
                          </div>
                        </div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Individual} alt="type" preview={false} />
                          <span className="ml-4 overflowText">
                            {ENTITY_TYPE[KYCDetails?.basic?.[0]?.typeOfEntity]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <div className="subtext_white  endtoend">
                    <div></div>
                    <Button
                      className="downloadCard mt-3"
                      onClick={() => {
                        setDownloadModal(true);
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </Col>
              <Col sm={24} md={24} lg={9} className="bg-admin-card-col8 w-100">
                <Card className="p-4 detailsCard">
                  {" "}
                  <div className="titleText">Other details</div>
                  <div className="subText_small bold mt-4">
                    <Image src={Doc} alt="company" preview={false} />
                    <span className="px-3">
                      {KYCDetails?.representative?.[0]?.repDocNumber}
                    </span>
                    <span className="px-1 stepDetails_sub">
                      ( ID Number )
                    </span>
                  </div>
                  <div className="subText_small bold mt-3 ">
                    <Image src={Job} alt="company" preview={false} />
                    <span className="px-3">
                      {KYCDetails?.representative?.[0]?.repExpiryDate ? moment.utc(
                      KYCDetails?.representative?.[0]?.repExpiryDate
                      ).format("DD-MM-YYYY") : "---"}
                    </span>
                    <span className="px-1 stepDetails_sub">
                      ( ID Expiry Date )
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>
            {/* Verify KYC Card */}
            <VerifyKybKycCard
             setSearchKybModal={setSearchKybModal}
             kybInfo={kybInfo}
             digiScreeningPayload={digiScreeningPayload}
             userAlias={userAlias}
             formCheckKyB={formCheckKyB}
             riskAssessment={riskAssessment}
             riskAssessmentFormPayload={riskAssessmentFormPayload}
             riskAssessmentPayload={riskAssessmentPayload}
             setDatasetsOptions={setDatasetsOptions}
            />
            
            {/* KYC Risk Assesment Card */}
            <RiskAssesmentCard riskAssessment={riskAssessment}/>
            <Card className="my-5 details-card">
              <div className="titleText mb-5">Document details</div>
                {KYCDetails?.documentAccuracyPercentage > 0 && (
                  <>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center">
                      <Col xs={24} sm={24} md={12} lg={8}>
                        <Space className="d-flex flex-wrap">
                          <Text type="secondary"> <b>Document accuracy percentage as per OCR</b></Text>
                          <Text className="doc-accuracy-percentage"> <b>{KYCDetails?.documentAccuracyPercentage ? Math.round(KYCDetails?.documentAccuracyPercentage) + "%" : "---"}</b> </Text>
                        </Space>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={8}>
                        <Space className="d-flex flex-wrap">
                          <Text type="secondary"> <b>ID Number</b></Text>
                          <Text > <b>{KYCDetails?.representative?.[0]?.repDocNumber ? KYCDetails?.representative?.[0]?.repDocNumber : "---"}</b> </Text>
                        </Space>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={8}>
                        <Space className="d-flex flex-wrap">
                          <Text type="secondary"> <b>ID Expiry Date</b></Text>
                          <Text > <b>{KYCDetails?.representative?.[0]?.repExpiryDate ? dayjs.utc(KYCDetails?.representative?.[0]?.repExpiryDate).format('DD-MM-YYYY') : "---"}</b> </Text>
                        </Space>
                      </Col>
                    </Row>
                  </>
                )}  
              <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }}>
                <Col xs={24} sm={24} md={12} lg={8} className="my-4">
                  <div className="afterApproveCard">
                    {KYCDetails?.documents?.[0]?.repDocFront?.[0]
                      ?.isCompliance != null ||
                      ['VERIFIED','REJECTED','EXPIRED'].includes(KYCDetails?.documents?.[0]?.repDocFront?.[0]?.status) ? (
                      <Tabs 
                        defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"} 
                        className="d-none-res">
                        {KYCDetails?.documents?.[0]?.repDocFront?.[0]
                          ?.isCompliance != null ? (
                          <TabPane tab={`Approver`} key="approver">
                            <ApproverDetails
                              modalTitle={
                                DOCUMENT_TYPE[
                                  KYCDetails?.documents?.[0]?.repDocType
                                ] + " front"
                              }
                              approverDetails={
                                KYCDetails?.documents?.[0]?.repDocFront?.[0]
                              }
                              uploadedFile={
                                KYCDetails?.documents?.[0]?.repDocFront?.[0]
                                  ?.url
                              }
                              tab="approver"
                            />
                          </TabPane>
                        ) : (
                          ""
                        )}

                        <TabPane tab={`Authorizer`} key="authorizer">
                          {!['VERIFIED','REJECTED','EXPIRED'].includes(KYCDetails?.documents?.[0]?.repDocFront?.[0]?.status) ? (
                            <div>
                              <Card
                                className=" kybcard"
                                cover={
                                  KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url.includes(
                                    ".pdf"
                                  ) ? (
                                    <>
                                    <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url) }}>
                                      <PDFPreview
                                        url={KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url || ''}
                                        onPreviewClick={handlePDFView}
                                      />
                                    </div>
                                  </>
                                  ) : (
                                    <Image
                                      alt="example"
                                      src={
                                        KYCDetails?.documents?.[0]
                                          ?.repDocFront?.[0]?.url
                                      }
                                      height={175}
                                    />
                                  )
                                }
                              >
                                <Meta 
                                  title={
                                    <>
                                    <div className="d-flex justify-content-between align-items-center">
                                      {DOCUMENT_TYPE[KYCDetails?.documents?.[0]?.repDocType] + " Front"}
                                      <Tooltip
                                        title={'Download'}
                                        overlayClassName='custom-tooltip'
                                        placement="left"
                                      >
                                        <div className="ml-2" onClick={() => KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url && handleDownload(KYCDetails.documents[0].repDocFront[0].url,KYCDetails.documents[0].repDocFront[0].url.includes(".pdf"))} >
                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                        </div>
                                      </Tooltip>
                                    </div>
                                    </>
                                  } 
                                />
                              </Card>
                              {(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) && (<>
                                <div className="d-flex align-items-center">
                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle(
                                        DOCUMENT_TYPE[
                                          KYCDetails?.documents?.[0]?.repDocType
                                        ] + " front Proof"
                                      );
                                      setCommentModal(true);
                                      setCommentModalData("repDocFrontStatus");
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle(
                                        DOCUMENT_TYPE[
                                          KYCDetails?.documents?.[0]?.repDocType
                                        ] + " front Proof"
                                      );
                                      SetCommentModalReject(true);
                                      setCommentModalData("repDocFrontStatus");
                                    }}
                                  />
                                </div>
                              </>)}
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle={
                                DOCUMENT_TYPE[
                                  KYCDetails?.documents?.[0]?.repDocType
                                ] + " front"
                              }
                              approverDetails={
                                KYCDetails?.documents?.[0]?.repDocFront?.[0]
                              }
                              uploadedFile={
                                KYCDetails?.documents?.[0]?.repDocFront?.[0]
                                  ?.url
                              }
                              tab="admin"
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    ) : !['VERIFIED','REJECTED','EXPIRED'].includes(KYCDetails?.documents?.[0]?.repDocFront?.[0]?.status) ? (
                      <div>
                        <Card
                          className="kybcard"
                          cover={
                            KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url.includes(
                              ".pdf"
                            ) ? (
                              <>
                              <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url) }}>
                                <PDFPreview
                                  url={KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url || ''}
                                  onPreviewClick={handlePDFView}
                                />
                              </div>
                            </>
                            ) : (
                              <div className="card-img-body">
                              <Image
                                alt="example"
                                src={
                                  KYCDetails?.documents?.[0]?.repDocFront?.[0]
                                    ?.url
                                }
                                height={175}
                              />
                              </div>
                            )
                          }
                        >
                          <Meta 
                            title={
                              <>
                              <div className="d-flex justify-content-between align-items-center">
                                {DOCUMENT_TYPE[KYCDetails?.documents?.[0]?.repDocType] + " Front"}
                                <Tooltip
                                  title={'Download'}
                                  overlayClassName='custom-tooltip'
                                  placement="left"
                                >
                                  <div className="ml-2" onClick={() => KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url && handleDownload(KYCDetails.documents[0].repDocFront[0].url,KYCDetails.documents[0].repDocFront[0].url.includes(".pdf"))} >
                                    <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                  </div>
                                </Tooltip>
                              </div>
                              </>
                            } 
                          />
                        </Card>
                        <div className={userType === "SUPPORT_ENGINEER"?"d-none": "d-flex align-items-center"}>
                          <SecondaryOutLineButton
                            children="Approve"
                            className="mt-4"
                            onClick={() => {
                              setModalTitle(
                                DOCUMENT_TYPE[
                                  KYCDetails?.documents?.[0]?.repDocType
                                ] + " front Proof"
                              );
                              setCommentModal(true);
                              setCommentModalData("repDocFrontStatus");
                            }}
                          />
                          <PrimaryOutLineButton
                            children="Reject"
                            className="mt-4 mx-3"
                            onClick={() => {
                              setModalTitle(
                                DOCUMENT_TYPE[
                                  KYCDetails?.documents?.[0]?.repDocType
                                ] + " front Proof"
                              );
                              SetCommentModalReject(true);
                              setCommentModalData("repDocFrontStatus");
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <ApproverDetails
                        modalTitle={
                          DOCUMENT_TYPE[
                            KYCDetails?.documents?.[0]?.repDocType
                          ] + " front"
                        }
                        approverDetails={
                          KYCDetails?.documents?.[0]?.repDocFront?.[0]
                        }
                        uploadedFile={
                          KYCDetails?.documents?.[0]?.repDocFront?.[0]?.url
                        }
                        tab="admin"
                      />
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} className="my-4">
                  <div className="afterApproveCard">
                    {KYCDetails?.documents?.[0]?.repDocBack?.[0]
                      ?.isCompliance != null ||
                      ['VERIFIED','REJECTED','EXPIRED'].includes(KYCDetails?.documents?.[0]?.repDocBack?.[0]?.status) ? (
                      <Tabs 
                        defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                        className="d-none-res ">
                        {KYCDetails?.documents?.[0]?.repDocBack?.[0]?.isCompliance != null ? (
                          <TabPane tab={`Approver`} key="approver">
                            <ApproverDetails
                              modalTitle={
                                DOCUMENT_TYPE[
                                  KYCDetails?.documents?.[0]?.repDocType
                                ] + " back"
                              }
                              approverDetails={
                                KYCDetails?.documents?.[0]?.repDocBack?.[0]
                              }
                              uploadedFile={
                                KYCDetails?.documents?.[0]?.repDocBack?.[0]
                                  ?.url
                              }
                              tab="approver"
                            />
                          </TabPane>
                        ) : (
                          ""
                        )}

                        <TabPane tab={`Authorizer`} key="authorizer">
                          {!['VERIFIED','REJECTED','EXPIRED'].includes(KYCDetails?.documents?.[0]?.repDocBack?.[0]?.status) ? (
                            <div>
                              <Card
                                className=" kybcard"
                                cover={
                                  KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url.includes(
                                    ".pdf"
                                  ) ? (
                                    <>
                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url) }}>
                                        <PDFPreview
                                          url={KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url || ''}
                                          onPreviewClick={handlePDFView}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <Image
                                      alt="example"
                                      src={
                                        KYCDetails?.documents?.[0]
                                          ?.repDocBack?.[0]?.url
                                      }
                                      height={175}
                                    />
                                  )
                                }
                              >
                                <Meta 
                                  title={
                                    <>
                                    <div className="d-flex justify-content-between align-items-center">
                                      {DOCUMENT_TYPE[KYCDetails?.documents?.[0]?.repDocType] + " back"}
                                      <Tooltip
                                        title={'Download'}
                                        overlayClassName='custom-tooltip'
                                        placement="left"
                                      >
                                        <div className="ml-2" onClick={() => KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url && handleDownload(KYCDetails.documents[0].repDocBack[0].url,KYCDetails.documents[0].repDocBack[0].url.includes(".pdf"))} >
                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                        </div>
                                      </Tooltip>
                                    </div>
                                    </>
                                  } 
                                />
                              </Card>
                              {(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) && (<>
                                <div className="d-flex align-items-center">
                              <SecondaryOutLineButton
                                children="Approve"
                                className="mt-4"
                                onClick={() => {
                                  setModalTitle(
                                    DOCUMENT_TYPE[
                                      KYCDetails?.documents?.[0]?.repDocType
                                    ] + " back proof"
                                  );
                                  setCommentModal(true);
                                  setCommentModalData("repDocBackStatus");
                                }}
                              />
                              <PrimaryOutLineButton
                                children="Reject"
                                className="mt-4 mx-3"
                                onClick={() => {
                                  setModalTitle(
                                    DOCUMENT_TYPE[
                                      KYCDetails?.documents?.[0]?.repDocType
                                    ] + " back proof"
                                  );
                                  SetCommentModalReject(true);
                                  setCommentModalData("repDocBackStatus");
                                }}
                              />
                              </div>
                                </>)}
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle={
                                DOCUMENT_TYPE[
                                  KYCDetails?.documents?.[0]?.repDocType
                                ] + " back"
                              }
                              approverDetails={
                                KYCDetails?.documents?.[0]?.repDocBack?.[0]
                              }
                              uploadedFile={
                                KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url
                              }
                              tab="admin"
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    ) : !['VERIFIED','REJECTED','EXPIRED'].includes( KYCDetails?.documents?.[0]?.repDocBack?.[0]?.status) ? (
                      <div>
                        <Card
                          className=" kybcard"
                          cover={
                            KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url.includes(
                              ".pdf"
                            ) ? (
                              <>
                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url) }}>
                                  <PDFPreview
                                    url={KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url || ''}
                                    onPreviewClick={handlePDFView}
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="card-img-body">
                                <Image
                                  alt="example"
                                  src={
                                    KYCDetails?.documents?.[0]?.repDocBack?.[0]
                                      ?.url
                                  }
                                  height={175}
                                />
                              </div>
                            )
                          }
                        >
                          <Meta 
                            title={
                              <>
                              <div className="d-flex justify-content-between align-items-center">
                                {DOCUMENT_TYPE[KYCDetails?.documents?.[0]?.repDocType] + " back"}
                                <Tooltip
                                  title={'Download'}
                                  overlayClassName='custom-tooltip'
                                  placement="left"
                                >
                                  <div className="ml-2" onClick={() => KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url && handleDownload(KYCDetails.documents[0].repDocBack[0].url,KYCDetails.documents[0].repDocBack[0].url.includes(".pdf"))} >
                                    <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                  </div>
                                </Tooltip>
                              </div>
                              </>
                            } 
                          />
                        </Card>
                        <div className={userType === "SUPPORT_ENGINEER"?"d-none": "d-flex align-items-center"}>
                        <SecondaryOutLineButton
                          children="Approve"
                          className="mt-4"
                          onClick={() => {
                            setModalTitle(
                              DOCUMENT_TYPE[
                                KYCDetails?.documents?.[0]?.repDocType
                              ] + " back proof"
                            );
                            setCommentModal(true);
                            setCommentModalData("repDocBackStatus");
                          }}
                        />
                        <PrimaryOutLineButton
                          children="Reject"
                          className="mt-4 mx-3"
                          onClick={() => {
                            setModalTitle(
                              DOCUMENT_TYPE[
                                KYCDetails?.documents?.[0]?.repDocType
                              ] + " back proof"
                            );
                            SetCommentModalReject(true);
                            setCommentModalData("repDocBackStatus");
                          }}
                        />
                      </div>
                      </div>
                    ) : (
                      <ApproverDetails
                        modalTitle={
                          DOCUMENT_TYPE[
                            KYCDetails?.documents?.[0]?.repDocType
                          ] + " back"
                        }
                        approverDetails={
                          KYCDetails?.documents?.[0]?.repDocBack?.[0]
                        }
                        uploadedFile={
                          KYCDetails?.documents?.[0]?.repDocBack?.[0]?.url
                        }
                        tab="admin"
                      />
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} className="my-4">
                  { KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url && (
                    <div className="afterApproveCard">
                    {KYCDetails?.documents?.[0]?.repAddProof?.[0]
                      ?.isCompliance != null ||
                    KYCDetails?.documents?.[0]?.repAddProof?.[0]?.status ==
                      "VERIFIED" ||
                    KYCDetails?.documents?.[0]?.repAddProof?.[0]?.status ==
                      "REJECTED" ? (
                      <Tabs 
                        defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                        className="d-none-res ">
                        {KYCDetails?.documents?.[0]?.repAddProof?.[0]
                          ?.isCompliance != null ? (
                          <TabPane tab={`Approver`} key="approver">
                            {KYCDetails?.documents?.[0]?.repAddProof?.[0]
                              ?.isCompliance == null ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      // <embed
                                      //   onClick={() =>
                                      //     window.open(
                                      //       KYCDetails?.documents?.[0]
                                      //         ?.repAddProof?.[0]?.url,
                                      //       "_blank",
                                      //       "rel=noopener noreferrer"
                                      //     )
                                      //   }
                                      //   className="w-100 cursor h-300"
                                      //   src={
                                      //     KYCDetails?.documents?.[0]
                                      //       ?.repAddProof?.[0]?.url
                                      //   }
                                      // />
                                      <>
                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url) }}>
                                        <PDFPreview
                                          url={KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url || ''}
                                          onPreviewClick={handlePDFView}
                                        />
                                      </div>
                                    </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYCDetails?.documents?.[0]
                                            ?.repAddProof?.[0]?.url
                                        }
                                        height={175}
                                      />
                                    )
                                  }
                                >
                                  <Meta 
                                    title={
                                      <>
                                      <div className="d-flex justify-content-between align-items-center">
                                        {"Address proof"}
                                        <Tooltip
                                          title={'Download'}
                                          overlayClassName='custom-tooltip'
                                          placement="left"
                                        >
                                          <div className="ml-2" onClick={() => KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url && handleDownload(KYCDetails.documents[0].repAddProof[0].url,KYCDetails.documents[0].repAddProof[0].url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                      </>
                                    } 
                                  />
                                </Card>
                                <div className={userType === "SUPPORT_ENGINEER"?"d-none": "d-flex align-items-center"}>
                                <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle("Address proof");
                                    setCommentModal(true);
                                    setCommentModalData("repAddProofStatus");
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  onClick={() => {
                                    setModalTitle("Address proof");
                                    SetCommentModalReject(true);
                                    setCommentModalData("repAddProofStatus");
                                  }}
                                />
                              </div>
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle="Address proof"
                                approverDetails={
                                  KYCDetails?.documents?.[0]?.repAddProof?.[0]
                                }
                                uploadedFile={
                                  KYCDetails?.documents?.[0]?.repAddProof?.[0]
                                    ?.url
                                }
                                tab="approver"
                              />
                            )}
                          </TabPane>
                        ) : (
                          ""
                        )}

                        <TabPane tab={`Authorizer`} key="authorizer">
                          {KYCDetails?.documents?.[0]?.repAddProof?.[0]
                            ?.status != "VERIFIED" &&
                          KYCDetails?.documents?.[0]?.repAddProof?.[0]
                            ?.status != "REJECTED" ? (
                            <div>
                              <Card
                                className=" kybcard"
                                cover={
                                  KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url.includes(
                                    ".pdf"
                                  ) ? (
                                    // <embed
                                    //   onClick={() =>
                                    //     window.open(
                                    //       KYCDetails?.documents?.[0]
                                    //         ?.repAddProof?.[0]?.url,
                                    //       "_blank",
                                    //       "rel=noopener noreferrer"
                                    //     )
                                    //   }
                                    //   className="w-100 cursor h-300"
                                    //   src={
                                    //     KYCDetails?.documents?.[0]
                                    //       ?.repAddProof?.[0]?.url
                                    //   }
                                    // />
                                    <>
                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url) }}>
                                        <PDFPreview
                                          url={KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url || ''}
                                          onPreviewClick={handlePDFView}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <Image
                                      alt="example"
                                      src={
                                        KYCDetails?.documents?.[0]
                                          ?.repAddProof?.[0]?.url
                                      }
                                      height={175}
                                    />
                                  )
                                }
                              >
                                <Meta 
                                  title={
                                    <>
                                    <div className="d-flex justify-content-between align-items-center">
                                      {"Address proof"}
                                      <Tooltip
                                        title={'Download'}
                                        overlayClassName='custom-tooltip'
                                        placement="left"
                                      >
                                        <div className="ml-2" onClick={() => KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url && handleDownload(KYCDetails.documents[0].repAddProof[0].url,KYCDetails.documents[0].repAddProof[0].url.includes(".pdf"))} >
                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                        </div>
                                      </Tooltip>
                                    </div>
                                    </>
                                  } 
                                />
                              </Card>
                              {(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) && (<>
                                <div className="d-flex align-items-center">
                              <SecondaryOutLineButton
                                children="Approve"
                                className="mt-4"
                                onClick={() => {
                                  setModalTitle("Address proof");
                                  setCommentModal(true);
                                  setCommentModalData("repAddProofStatus");
                                }}
                              />
                              <PrimaryOutLineButton
                                children="Reject"
                                className="mt-4 mx-3"
                                onClick={() => {
                                  setModalTitle("Address proof");
                                  SetCommentModalReject(true);
                                  setCommentModalData("repAddProofStatus");
                                }}
                              />
                              </div>
                                </>)}
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle="Address proof"
                              approverDetails={
                                KYCDetails?.documents?.[0]?.repAddProof?.[0]
                              }
                              uploadedFile={
                                KYCDetails?.documents?.[0]?.repAddProof?.[0]
                                  ?.url
                              }
                              tab="admin"
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    ) : KYCDetails?.documents?.[0]?.repAddProof?.[0]?.status !=
                        "VERIFIED" &&
                      KYCDetails?.documents?.[0]?.repAddProof?.[0]?.status !=
                        "REJECTED" ? (
                      <div>
                        <Card
                          className=" kybcard"
                          cover={
                            KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url.includes(
                              ".pdf"
                            ) ? (
                              // <embed
                              //   onClick={() =>
                              //     window.open(
                              //       KYCDetails?.documents?.[0]?.repAddProof?.[0]
                              //         ?.url,
                              //       "_blank",
                              //       "rel=noopener noreferrer"
                              //     )
                              //   }
                              //   className="w-100 cursor h-300"
                              //   src={
                              //     KYCDetails?.documents?.[0]?.repAddProof?.[0]
                              //       ?.url
                              //   }
                              // />
                                <>
                                  <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url) }}>
                                    <PDFPreview
                                      url={KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url || ''}
                                      onPreviewClick={handlePDFView}
                                    />
                                  </div>
                                </>
                            ) : (
                              <div className="card-img-body">
                                <Image
                                  alt="example"
                                  src={
                                    KYCDetails?.documents?.[0]?.repAddProof?.[0]
                                      ?.url
                                  }
                                  height={175}
                                />
                              </div>
                            )
                          }
                        >
                          <Meta 
                            title={
                              <>
                              <div className="d-flex justify-content-between align-items-center">
                                {"Address proof"}
                                <Tooltip
                                  title={'Download'}
                                  overlayClassName='custom-tooltip'
                                  placement="left"
                                >
                                  <div className="ml-2" onClick={() => KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url && handleDownload(KYCDetails.documents[0].repAddProof[0].url,KYCDetails.documents[0].repAddProof[0].url.includes(".pdf"))} >
                                    <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                  </div>
                                </Tooltip>
                              </div>
                              </>
                            } 
                          />
                        </Card>
                        <div className={userType === "SUPPORT_ENGINEER"?"d-none": "d-flex align-items-center"}>
                        <SecondaryOutLineButton
                          children="Approve"
                          className="mt-4"
                          onClick={() => {
                            setModalTitle("Address proof");
                            setCommentModal(true);
                            setCommentModalData("repAddProofStatus");
                          }}
                        />
                        <PrimaryOutLineButton
                          children="Reject"
                          className="mt-4 mx-3"
                          onClick={() => {
                            setModalTitle("Address proof");
                            SetCommentModalReject(true);
                            setCommentModalData("repAddProofStatus");
                          }}
                        />
                      </div>
                      </div>
                    ) : (
                      <ApproverDetails
                        modalTitle="Address proof"
                        approverDetails={
                          KYCDetails?.documents?.[0]?.repAddProof?.[0]
                        }
                        uploadedFile={
                          KYCDetails?.documents?.[0]?.repAddProof?.[0]?.url
                        }
                        tab="admin"
                      />
                    )}
                  </div>
                  )}
                  
                </Col>

 
              </Row>
              <hr className="lightgrayHr mb-4" />
              <div className="subText_medium border-left">
            <b>Address Details</b>
          </div>
              <AddressDetails AddressData={KYCDetails?.addressDetails?.[0]} type="kyc" />
              <hr className="lightgrayHr mb-4" />

          <div className="subText_medium border-left">
            <b>FATCA Details</b>
          </div>
          <Row className="mt-3 row">
            <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary"> <b>Are you a Tax resident of any other country other than UAE?</b></Text>
                  <Text> <b>{toTitleCase(kycFATCAPayload?.kycTaxResident) ?? "---"}</b> </Text>
                </Space>
              </Col>
            </Row>
            {kycFATCAPayload?.kycTaxResident === 'yes' && (<>
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col>
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Tax Residency country</b></Text>
                    <Text> <b>{kycFATCAPayload?.kycTaxResidencyCountry ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col>
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Do you have a Tax identification number? </b></Text>
                    <Text> <b>{toTitleCase(kycFATCAPayload?.hasKycTIN) ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              {kycFATCAPayload?.hasKycTIN === 'yes' && (<>
                <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                  <Col>
                    <Space direction="vertical">
                      <Text type="secondary"> <b>Tax identification number </b></Text>
                      <Text> <b>{kycFATCAPayload?.kycTinNo ?? "---"}</b> </Text>
                    </Space>
                  </Col>
                </Row>
              </>)}
              {kycFATCAPayload?.hasKycTIN === 'no' && (<>
                <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                  <Col>
                    <Space direction="vertical">
                      <Text type="secondary"> <b>Reason for no TIN Number</b></Text>
                      <Text> <b>{kycFATCAPayload?.kycNoTinReason === "countryNotissueTINs" ? "Country/ Jurisdiction does not issue TINs." : kycFATCAPayload?.kycNoTinReason === "countryNotRequirToProvideTIN" ? "Country/ Jurisdiction does not require me to provide TIN." : kycFATCAPayload?.kycNoTinReason === "unableToObtainTIN" ? "Unable to obtain a TIN." : ""}</b> </Text>
                    </Space>
                  </Col>
                </Row>
              </>)}
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col>
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Do you have multiple Tax Residency?</b></Text>
                    <Text> <b>{toTitleCase(kycFATCAPayload?.hasMultipleTaxResidentKyc) ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              {kycFATCAPayload?.hasMultipleTaxResidentKyc === 'yes' && (<>
                <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                  <Col >
                    <Space direction="vertical">
                      <Text type="secondary"> <b>How many country?</b></Text>
                      <Text> <b>{kycFATCAPayload?.kycNumberOfCountry ?? "---"}</b> </Text>
                    </Space>
                  </Col>
                </Row>
                {renderMultipleTaxResidencyRows()}
              </>)}
            </>)}
            </Row>
            <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary"> <b>I agree to the FATCA/CRS declaration </b></Text>
                  <Text> <b> {kycFATCAPayload?.isAgreeKYCFATCA && kycFATCAPayload?.isAgreeKYCFATCA === true ? "Yes" : kycFATCAPayload?.isAgreeKYCFATCA && kycFATCAPayload?.isAgreeKYCFATCA === false ? "No" : "---"}</b>
                  </Text>
                </Space>
              </Col>
            </Row>
              <hr className="lightgrayHr mb-4" />
              <div className="subText_medium border-left">
                <b>Checklist </b>
              </div>
              <Form>
              <Row className="mt-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                      (userType == "TRUSTEE" || userType === 'MAKER')
                      ? (KYCDetails?.trusteeKybStatus || KYCDetails?.isTrusteeKybRejected)
                      : KYCDetails?.kybStatus === "VERIFIED" ||
                        KYCDetails?.kybStatus === "REJECTED" || KYCDetails?.kybStatus === "EXPIRED"
                      ? true
                      : false
                      || userType === "SUPPORT_ENGINEER"
                    }
                    checked={validDocumentVerification}
                    onClick={() => {
                      setValidDocumentVerification(!validDocumentVerification);
                    }}
                  >
                    <div className="subText mx-1 ">
                      Valid document verification 
                    </div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res  mx-4 my-2"
                    >
        
                  <TabPane tab={`Approver`} key="approver">
                    {KYCDetails?.kybStatus === "VERIFIED" ||
                      KYCDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYCDetails?.approverComments
                          ?.validDocumentVerificationComment
                          ? KYCDetails?.approverComments
                            ?.validDocumentVerificationComment
                          : "N/A"}
                      </div>
                    ) : (
                        <Form.Item
                          name="validDocumentVerificationApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER')? [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "validDocumentVerificationApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ] : []}
                          className="checklist"
                        >
                      <TextArea
                        rows={2}
                        placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="validDocumentVerificationApprover"
                        defaultValue={checkboxCommentApprover?.validDocumentVerification}
                        onChange={(e)=>adjustHeightForApprover("validDocumentVerification", e?.target?.value)}
                        disabled={userType === "SUPPORT_ENGINEER"|| disable || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                      />
                      </Form.Item>
                      )}
                  </TabPane>
      
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {KYCDetails?.kybStatus === "VERIFIED" ||
                          KYCDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYCDetails?.adminComments
                                ?.validDocumentVerificationComment
                                ? KYCDetails?.adminComments
                                    ?.validDocumentVerificationComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                          name="validDocumentVerification"
                          rules={
                            ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "validDocumentVerification", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ] : []}
                          className="checklist"
                        >
                        <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="validDocumentVerification"
                              defaultValue={checkboxComment?.validDocumentVerification}
                              onChange={(e)=>adjustHeight("validDocumentVerification", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER' || userType ==='SUPPORT_ENGINEER'}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
              <Row className="my-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                        (userType == "TRUSTEE" || userType === 'MAKER')
                        ? (KYCDetails?.trusteeKybStatus || KYCDetails?.isTrusteeKybRejected)
                        : KYCDetails?.kybStatus === "VERIFIED" ||
                          KYCDetails?.kybStatus === "REJECTED" || KYCDetails?.kybStatus === "EXPIRED"
                        ? true
                        : false
                        || userType === "SUPPORT_ENGINEER"
                    }
                    checked={nameAndIdVerification}
                    onClick={() => {
                      setNameAndIdVerification(!nameAndIdVerification);
                    }}
                  >
                    <div className="subText mx-1 ">Name & id verification</div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res  mx-4 my-2"
                    >
                  <TabPane tab={`Approver`} key="approver">
                    {KYCDetails?.kybStatus === "VERIFIED" ||
                      KYCDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYCDetails?.approverComments
                          ?.nameAndIdVerificationComment
                          ? KYCDetails?.approverComments
                            ?.nameAndIdVerificationComment
                          : "N/A"}
                      </div>
                    ) : (
                      <Form.Item
                          name="nameAndIdVerificationApprover"
                          rules={
                            (userType === 'TRUSTEE' || userType === 'MAKER') ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "nameAndIdVerificationApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ] : []}
                          className="checklist"
                        >
                      <TextArea
                        rows={2}
                        placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="nameAndIdVerificationApprover"
                        defaultValue={checkboxCommentApprover?.nameAndIdVerification}
                        onChange={(e)=>adjustHeightForApprover("nameAndIdVerification", e?.target?.value)}
                        disabled={disable|| userType === "SUPPORT_ENGINEER" || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                      />
                      </Form.Item>
                    )}
                  </TabPane>
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {KYCDetails?.kybStatus === "VERIFIED" ||
                          KYCDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYCDetails?.adminComments
                                ?.nameAndIdVerificationComment
                                ? KYCDetails?.adminComments
                                    ?.nameAndIdVerificationComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                          name="nameAndIdVerification"
                          rules={
                            ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "nameAndIdVerification", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ]: []}
                          className="checklist"
                        >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="nameAndIdVerification"
                              defaultValue={checkboxComment?.nameAndIdVerification}
                              onChange={(e)=>adjustHeight("nameAndIdVerification", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER' || userType === "SUPPORT_ENGINEER"}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
              <Row className="my-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                      (userType == "TRUSTEE" || userType === 'MAKER')
                      ? (KYCDetails?.trusteeKybStatus || KYCDetails?.isTrusteeKybRejected)
                      : KYCDetails?.kybStatus === "VERIFIED" ||
                        KYCDetails?.kybStatus === "REJECTED" || KYCDetails?.kybStatus === "EXPIRED"
                      ? true
                      : false
                      || userType === "SUPPORT_ENGINEER"
                    }
                    checked={amlScreening}
                    onClick={() => {
                      setAmlScreening(!amlScreening);
                    }}
                  >
                    <div className="subText mx-1 ">AML screening</div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res  mx-4 my-2"
                    >
                  <TabPane tab={`Approver`} key="approver">
                    {KYCDetails?.kybStatus === "VERIFIED" ||
                      KYCDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYCDetails?.approverComments?.amlScreeningComment
                          ? KYCDetails?.approverComments?.amlScreeningComment
                          : "N/A"}
                      </div>
                    ) : (
                      <Form.Item
                          name="amlScreeningApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER') ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "amlScreeningApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ] : []}
                          className="checklist"
                        >
                      <TextArea
                        rows={2}
                        placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="amlScreeningApprover"
                        defaultValue={checkboxCommentApprover?.amlScreening}
                        onChange={(e)=>adjustHeightForApprover("amlScreening", e?.target?.value)}
                        disabled={disable || userType === "SUPPORT_ENGINEER"|| (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                      />
                      </Form.Item>
                    )}
                  </TabPane>
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {KYCDetails?.kybStatus === "VERIFIED" ||
                          KYCDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYCDetails?.adminComments?.amlScreeningComment
                                ? KYCDetails?.adminComments?.amlScreeningComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                            name="amlScreening"
                            rules={
                              ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                              [
                              {
                                required: true,
                                message: "Please add some comment!",
                              },
                              // {
                              //   min: 20,
                              //   message: "Please enter minimum 20 characters"
                              // },
                              {
                                validator: async (_, value) => {
                                  await validateCommentField(value, "amlScreening", setSpecialErrors);
                                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                },
                              },
                            ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="amlScreening"
                              defaultValue={checkboxComment?.amlScreening}
                              onChange={(e)=>adjustHeight("amlScreening", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER'|| userType === "SUPPORT_ENGINEER"}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
              <Row className="my-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                      (userType == "TRUSTEE" || userType === 'MAKER')
                        ? (KYCDetails?.trusteeKybStatus || KYCDetails?.isTrusteeKybRejected)
                        : KYCDetails?.kybStatus === "VERIFIED" ||
                          KYCDetails?.kybStatus === "REJECTED" || KYCDetails?.kybStatus === "EXPIRED"
                        ? true
                        : false
                        || userType === "SUPPORT_ENGINEER"
                    }
                    checked={adverseMedia}
                    onClick={() => {
                      setAdverseMedia(!adverseMedia);
                    }}
                  >
                    <div className="subText mx-1 ">Adverse media</div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res mx-4 my-2"
                    >
                      <TabPane tab={`Approver`} key="approver">
                      {KYCDetails?.kybStatus === "VERIFIED" ||
                          KYCDetails?.kybStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {KYCDetails?.approverComments?.adverseMediaComment
                            ? KYCDetails?.approverComments?.adverseMediaComment
                            : "N/A"}
                        </div>
                        ) : (
                          <Form.Item
                          name="adverseMediaApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER') ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "adverseMediaApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ] : []}
                          className="checklist"
                        >
                          <TextArea
                            rows={2}
                            placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                            className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                            // onInput={handleInput}
                            id="adverseMediaApprover"
                            defaultValue={checkboxCommentApprover?.adverseMedia}
                            onChange={(e)=>adjustHeightForApprover("adverseMedia", e?.target?.value)}
                            disabled={disable|| userType === "SUPPORT_ENGINEER" || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                          />
                          </Form.Item>
                        )}
                      </TabPane>
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {KYCDetails?.kybStatus === "VERIFIED" ||
                          KYCDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYCDetails?.adminComments?.adverseMediaComment
                                ? KYCDetails?.adminComments?.adverseMediaComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                            name="adverseMedia"
                            rules={
                              ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                              [
                              {
                                required: true,
                                message: "Please add some comment!",
                              },
                              // {
                              //   min: 20,
                              //   message: "Please enter minimum 20 characters"
                              // },
                              {
                                validator: async (_, value) => {
                                  await validateCommentField(value, "adverseMedia", setSpecialErrors);
                                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                },
                              },
                            ] : []}
                            className="checklist"
                          >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="adverseMedia"
                              defaultValue={checkboxComment?.adverseMedia}
                              onChange={(e)=>adjustHeight("adverseMedia", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER'|| userType === "SUPPORT_ENGINEER"}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
              {/* Politically exposed */}
          <Row className="mt-5">
                <div className="w-100">
                  <Checkbox
                    disabled={
                    (userType == "TRUSTEE" || userType === 'MAKER')
                      ? (KYCDetails?.trusteeKybStatus || KYCDetails?.isTrusteeKybRejected)
                      : KYCDetails?.kybStatus === "VERIFIED" ||
                        KYCDetails?.kybStatus === "REJECTED" || KYCDetails?.kybStatus === "EXPIRED"
                      ? true
                      : false
                      || userType === "SUPPORT_ENGINEER"
                    }
                    checked={PoliticallyPerson}
                    onClick={() => {
                      setPoliticallyPerson(!PoliticallyPerson);
                    }}
                  >
                    <div className="subText mx-1 ">
                    Politically exposed person
                    </div>
                  </Checkbox>
                  <div className="afterApproveCard">
                    <Tabs
                      defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType))?"authorizer":"approver"}
                      className="d-none-res  mx-4 my-2"
                    >
                  <TabPane tab={`Approver`} key="approver">
                    {KYCDetails?.kybStatus === "VERIFIED" ||
                      KYCDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYCDetails?.approverComments
                          ?.PoliticallyExposedPersonComment
                          ? KYCDetails?.approverComments
                            ?.PoliticallyExposedPersonComment
                          : "N/A"}
                      </div>
                    ) : (
                      <Form.Item
                      name="PoliticallyExposedPersonCommentApprover"
                      rules={
                        (userType === "TRUSTEE" || userType === 'MAKER') ?
                        [
                        {
                          required: true,
                          message: "Please add some comment!",
                        },
                        // {
                        //   min: 20,
                        //   message: "Please enter minimum 20 characters"
                        // },
                        {
                          validator: async (_, value) => {
                            await validateCommentField(value, "PoliticallyExposedPersonCommentApprover", setSpecialErrors);
                            if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                          },
                        },
                      ] : []}
                      className="checklist"
                    >
                      <TextArea
                        rows={2}
                        placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="PoliticallyExposedPersonCommentApprover"
                        defaultValue={checkboxCommentApprover?.PoliticallyExposedPersonComment}
                        onChange={(e)=>adjustHeightForApprover("PoliticallyExposedPersonComment", e?.target?.value)}
                        disabled={disable|| userType === "SUPPORT_ENGINEER" || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                      />
                      </Form.Item>
                    )}
                  </TabPane>
                      <TabPane tab={`Authorizer`} key="authorizer">
                        <div className="w-100">
                          {KYCDetails?.kybStatus === "VERIFIED" ||
                          KYCDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYCDetails?.adminComments
                                ?.PoliticallyExposedPersonComment
                                ? KYCDetails?.adminComments
                                    ?.PoliticallyExposedPersonComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                      name="PoliticallyExposedPersonComment"
                      rules={
                        ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                        [
                        {
                          required: true,
                          message: "Please add some comment!",
                        },
                        // {
                        //   min: 20,
                        //   message: "Please enter minimum 20 characters"
                        // },
                        {
                          validator: async (_, value) => {
                            await validateCommentField(value, "PoliticallyExposedPersonComment", setSpecialErrors);
                            if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                          },
                        },
                      ] : []}
                      className="checklist"
                    >
                            <TextArea
                              rows={2}
                              placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                              className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                              // onInput={handleInput}
                              id="PoliticallyExposedPersonComment"
                              defaultValue={checkboxComment?.PoliticallyExposedPersonComment}
                              onChange={(e)=>adjustHeight("PoliticallyExposedPersonComment", e?.target?.value)}
                              disabled={disable || userType === "TRUSTEE" || userType === 'MAKER' || userType === "SUPPORT_ENGINEER"}
                            />
                            </Form.Item>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              </Row>
               {/*>Other comments/notes */}
          <Row className="my-4">
            <div className="w-100">
              <Checkbox
                disabled={
                (userType == "TRUSTEE" || userType === 'MAKER')
                  ? (KYCDetails?.trusteeKybStatus || KYCDetails?.isTrusteeKybRejected)
                  : KYCDetails?.kybStatus === "VERIFIED" ||
                    KYCDetails?.kybStatus === "REJECTED" || KYCDetails?.kybStatus === "EXPIRED"
                  ? true
                  : false
                  || userType === "SUPPORT_ENGINEER"
                }
                checked={otherComment}
                onClick={() => {
                  setOtherComment(!otherComment);
                }}
              >
                <div className="subText mx-1 ">Other comments/notes</div>
              </Checkbox>
              <div className="afterApproveCard">
                <Tabs
                  defaultActiveKey={(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) ? "authorizer" : "approver"}
                  className="d-none-res mx-4 my-2"
                >
                  <TabPane tab={`Approver`} key="approver">
                    {KYCDetails?.kybStatus === "VERIFIED" ||
                      KYCDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYCDetails?.approverComments?.otherCommentAndNotes
                          ? KYCDetails?.approverComments
                            ?.otherCommentAndNotes
                          : "N/A"}
                      </div>
                    ) : (
                        <Form.Item
                          name="otherCommentAndNotesApprover"
                          rules={
                            (userType === "TRUSTEE" || userType === 'MAKER') ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "otherCommentAndNotesApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ] : []}
                          className="checklist"
                        >
                      <TextArea
                        rows={2}
                        placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="otherCommentAndNotesApprover"
                        defaultValue={checkboxCommentApprover?.otherCommentAndNotes}
                        onChange={(e)=>adjustHeightForApprover("otherCommentAndNotes", e?.target?.value)}
                        disabled={disable|| userType === "SUPPORT_ENGINEER" || (['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) }
                      />
                      </Form.Item>
                    )}
                  </TabPane>
                  <TabPane tab={`Authorizer`} key="authorizer">
                    <div className="w-100">
                      {KYCDetails?.kybStatus === "VERIFIED" ||
                        KYCDetails?.kybStatus === "REJECTED" ? (
                        <div className="commentBox mt-2 mx-2">
                          {KYCDetails?.adminComments?.otherCommentAndNotes
                            ? KYCDetails?.adminComments?.otherCommentAndNotes
                            : "N/A"}
                        </div>
                      ) : (
                        <Form.Item
                          name="otherCommentAndNotes"
                          rules={
                            ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ?
                            [
                            {
                              required: true,
                              message: "Please add some comment!",
                            },
                            // {
                            //   min: 20,
                            //   message: "Please enter minimum 20 characters"
                            // },
                            {
                              validator: async (_, value) => {
                                await validateCommentField(value, "otherCommentAndNotes", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ] : []}
                          className="checklist"
                        >
                        <TextArea
                          rows={2}
                          placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                          className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                          // onInput={handleInput}
                          id="otherCommentAndNotes"
                          defaultValue={checkboxComment?.otherCommentAndNotes}
                          onChange={(e)=>adjustHeight("otherCommentAndNotes", e?.target?.value)}
                          disabled={disable || userType == "TRUSTEE" || userType === 'MAKER'|| userType === "SUPPORT_ENGINEER"}
                        />
                        </Form.Item>
                      )}
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Row>
          </Form>
              <hr className="lightgrayHr mb-4" />
              <div className="subText_medium border-left mt-4"
              >
                <b>Client risk rating</b>
              </div>
              <Row className="mt-3">
                <Radio.Group
                  onChange={handleDropdownChange}
                  value={dropDownValue}
                  className="mt-3 mb-4 client-risk-classification-radio-btn"
                >
                  <Radio value={1} disabled={userType === "SUPPORT_ENGINEER"}>Low risk</Radio>
                  <Radio value={2} disabled={userType === "SUPPORT_ENGINEER"}>Medium risk</Radio>
                  <Radio value={3} disabled={userType === "SUPPORT_ENGINEER"}>High risk</Radio>
                </Radio.Group>
              </Row>
          {KYCDetails?.trusteeComment &&
            (
              <div>
                <hr className="lightgrayHr mb-4" />
                <div className="subText_medium border-left">
                  <b>Approver Comment</b>
                </div>
                <div>
                  <div className="finalCommentTime stepDetails_medium_sub my-3">
                    {KYCDetails?.verifiedDate?.approverRepresentativeVerifiedDate ? moment(KYCDetails?.verifiedDate?.approverRepresentativeVerifiedDate).format(
                      "DD MMMM YYYY hh:mm A"
                    ) : moment(KYCDetails?.updatedAt).format(
                      "DD MMMM YYYY hh:mm A")}
                  </div>
                  <div className="stepDetails_medium_sub">
                    {KYCDetails?.trusteeComment}
                  </div>
                </div>
              </div>
            )
          }
          {KYCDetails?.kybStatus == "VERIFIED" ||
            KYCDetails?.kybStatus == "REJECTED" ? (
            <>
              <div>
                {" "}
             
                <hr className="lightgrayHr mb-4" />
                <div className="subText_medium border-left">
                  <b>Authorizer Comment</b>
                </div>
                <div>
                  <div className="finalCommentTime stepDetails_medium_sub my-3">
                    {KYCDetails?.verifiedDate?.authorizerRepresentativeVerifiedDate ? moment(KYCDetails?.verifiedDate?.authorizerRepresentativeVerifiedDate).format(
                      "DD MMMM YYYY hh:mm A"
                    ) : moment(KYCDetails?.updatedAt).format(
                      "DD MMMM YYYY hh:mm A")}
                  </div>
                  <div className="stepDetails_medium_sub">
                    {KYCDetails?.kybStatus == "REJECTED" ? KYCDetails?.reason : KYCDetails?.comment}
                  </div>
                </div>
                {KYCDetails?.kybStatus === "VERIFIED" && createVirtualAccnt && !isApprover && (
                  <Button
                    className="rounded my-lg-4 w-auto mx-2"
                    onClick={() => { setCreateVirtualAccountModal(true); }}
                  >
                    Create Escrow Account
                  </Button>
                )}
                {(!isApprover && KYCDetails?.kybStatus === "VERIFIED" && (!hideBtnCreatePlatformFee)) && (
                  <>
                    <Tooltip 
                      title={!platformFeesModal && "No platform fees have been added. Default applicable fees or item-type-specific platform fees will be applied."}
                    >
                      <Button
                        type="primary"
                        className="rounded mt-4 mb-2"
                        onClick={() => setPlatformFeesModal(true)}
                      >
                        {(platformFeesExists || platformFeesData) ? "Update Platform Fees" : "Apply Platform Fees"}
                      </Button>
                    </Tooltip>
      
                    {platformFeesModal && (
                      <PlatformFeesModal
                        id={platformFeesData?.id}               
                        userAlias={KYCDetails?.userAlias}
                        createdBy={currentUserAlias}
                        updatedBy={currentUserAlias}
                        initialValues={platformFeesData}  
                        onSubmit={handlePlatformFeesSubmit}
                        onCancel={() => setPlatformFeesModal(false)}
                        hideBtnCreatePlatformFee= {hideBtnCreatePlatformFee}
                       
                      />
                    )}
                  </>
                )}
                {(virtualAccountData && virtualAccountData.length > 0) &&
                  <>
                    <hr className="lightgrayHr mt-0" />
                    <div className="subText_medium border-left">
                      <b>Escrow Accounts</b>
                    </div>
                    {virtualAccountData.map((vaData: any, index: number) => ( 
                      <div key={index} className="mb-3"> 
                        <Row className="my-2 row-gap-0" gutter={[24, 24]}>
                          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                            <Space direction="vertical">
                              <Text type="secondary">
                                <b>Enroll By:</b>
                              </Text>
                              <Text>
                                <b>{vaData?.enrollBy || 'N/A'}</b>
                              </Text>
                            </Space>
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                            <Space direction="vertical">
                              <Text type="secondary">
                                <b>Comment:</b>
                              </Text>
                              <Text>
                                <b>{vaData?.comment || 'N/A'}</b>
                              </Text>
                            </Space>
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                            <Space direction="vertical">
                              <Text type="secondary">
                                <b>Currency:</b>
                              </Text>
                              <Text>
                                <b>{vaData?.currency || 'N/A'}</b>
                              </Text>
                            </Space>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </>
                }
             
                    <>
                      {userPlatformFeeList?.length > 0 &&
                        userPlatformFeeList?.map((platformFees: any, index: number) => (
                        <>
                          {(virtualAccountData && virtualAccountData?.length == 0) && <hr className="lightgrayHr mt-0" />}
                          <PlatformFeesSection
                            key={index}
                            platformFees={platformFees}
                            onTitleClick={(fees) => {
                              setPlatformFeesData(fees);
                              setPlatformFeesModal(true);
                            }}
                          />
                        </>
                        ))
                      }

                      {platformFeesModal && (
                        <PlatformFeesModal
                          id={platformFeesData?.id}
                          userAlias={KYCDetails?.userAlias}
                          createdBy={currentUserAlias}
                          updatedBy={currentUserAlias}
                          initialValues={platformFeesData}
                          onSubmit={handlePlatformFeesSubmit}
                          onCancel={() => setPlatformFeesModal(false)}
                          hideBtnCreatePlatformFee= {hideBtnCreatePlatformFee}
                      
                        />
                      )}
                    </>

              </div>

            </>
          ) : null}
              
              {(KYCDetails?.kybStatus != "VERIFIED" &&
              KYCDetails?.kybStatus != "REJECTED" && (userType =="TRUSTEE" || userType === 'MAKER')  && (KYCDetails?.trusteeKybStatus!=true && KYCDetails?.isTrusteeKybRejected != true)) ||(KYCDetails?.kybStatus != "VERIFIED" &&
              KYCDetails?.kybStatus != "REJECTED" && userType !="TRUSTEE" && userType !== 'MAKER')? (
                <Row className="center_res btn-groups">
                    <Button
                      className={`${isAllDocUpdated && isAllChecklistChecked() && KYCDetails?.kybStatus !== "EXPIRED"  &&  !Object.values(specialErrors).some(error => error) ? "rounded" : "rounded disabled"}` || (userType === "SUPPORT_ENGINEER"?"d-none": "")}
                      htmlType="submit"
                      onClick={() => {
                        if (isAllDocUpdated && isAllChecklistChecked() && KYCDetails?.kybStatus !== "EXPIRED" &&  !Object.values(specialErrors).some(error => error)) openApproveModal();
                      }}
                      loading={loading}
                    >
                      Approve KYC
                    </Button>
                    <Button
                      className={`${isAllChecklistChecked() ? "rounded_reject_light" : 'rounded_reject_light disabled'}`|| (userType === "SUPPORT_ENGINEER"?"d-none": "")}
                      onClick={() => {
                        if (isAllChecklistChecked()) openRejectModal();
                      }}
                      loading={loading}
                    >
                      Reject KYC
                    </Button>
                    <Button
                      className={userType === "SUPPORT_ENGINEER"?"d-none": "rounded_reject_light"}
                      htmlType="submit"
                      onClick={() => {
                        setHoldModal(true);
                      }}
                    >
                    
                      Hold KYC
                    </Button>
                    {['ADMIN', 'AUTHORIZER', 'SENIOR_MANAGMENT', 'CHECKER'].includes(userType) && (
                  <Button
                    className={KYCDetails?.kybStatus === "VERIFIED" ?"rounded mt-0 w-auto mx-2":"rounded disabled" }
                    onClick={() => { setCreateVirtualAccountModal(true); }}
                    disabled={KYCDetails?.kybStatus != "VERIFIED"}
                  >
                    Create Escrow Account
                  </Button>
                  //    <Checkbox checked={checked} onChange={(e)=>{onChange(e?.target?.checked)}}>
                  //    Create Escrow Account
                  //  </Checkbox>
                )}
                    
                </Row>
              ) : 
              ""
            }
            
            </Card>
          </>}

            {
              bankActiveTab === "bankDetails" && (
                <>
                {(virtualAccountData && virtualAccountData.length > 0) || (userBankList && userBankList.length > 0) ? (
                  <Row className="endtoend equal-height-row" gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
                    {virtualAccountData && virtualAccountData.length > 0 && virtualAccountData.map((vaData: any) => (
                      <Col xs={24} sm={24} md={24} lg={24} xl={12} key={vaData?.id} className="mb-3">
                        <div className="bg-admin-card seller-bg-admin-card mb-0">
                          <div className="title_white">
                            <div className="capitalize text-end mb-3">
                              {vaData?.status}
                            </div>
                            <div className="title_white">Escrow Bank Account</div>
                            <div className="d-flex align-items-center justify-content-between flex-wrap row">
                              <div className="kybkyc-bankdetails col-8">
                                {vaData?.name}
                              </div>
                              <div className="kybkyc-bankdetails-number col-4 d-flex justify-content-end">
                                <span className="me-2">
                                  {country === "AE" ? "UAE" : country}
                                </span>
                                {country ? <span className={`fi fi-${country.toLowerCase()} `} /> 
                                : <Image src={Flag}  preview={false}  height={22}
                                width={22}/> }
                              </div>
                            </div>
                          </div>
                          <hr className=" w-100 opacity-50" />
                          <div className="row">
                            <div className="col">
                              <div className="kybkyc-bankdetails-text">
                                Account number
                              </div>
                              <div className="kybkyc-bankdetails-number">
                                <div>{vaData?.number}</div>
                              </div>
                            </div>
                            <div className="col">
                              <div className="kybkyc-bankdetails-text">
                                IBAN Number
                              </div>
                              <div className="d-flex kybkyc-bankdetails-number">
                                {/* <div className="overflowText">{vaData?.iban}</div> */}
                                <div className={`${vaData?.iban?.length * 7 > 100 ? 'overflowText-bankDetails' : ''}`}>
                                  <Tooltip
                                    title={vaData?.iban?.length * 7 > 100 ? vaData?.iban : null}
                                    overlayClassName='custom-tooltip'
                                  >
                                    <span>{vaData?.iban}</span>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Col className="d-flex flex-wrap justify-content-between p-0">
                            <div className="d-block mt-3">
                              <div className="kybkyc-bankdetails-text">
                                Balance Amount
                              </div>
                              <div className="kybkyc-bankdetails-number">
                              {moneyFormat(
                                vaData?.currency,
                                parseFloat(vaData?.balanceAmount || 0).toFixed(2)
                              )}
                              </div>
                            </div>
                            <div className="mt-4">
                              <PrimaryOutLineButton className="w-auto" onClick={() => setBankActiveTab("escrowTrans")}>
                                Escrow Transaction
                              </PrimaryOutLineButton>
                            </div>
                          </Col>
                        </div>
                      </Col>
                    ))}
                    {userBankList && userBankList.length > 0 && userBankList.map((data: any) => {
                      const selectedCurrency = selectedCurrencyMap[data.id] || data.currency;
                      
                      const currencyData = selectedCurrency === "USD" && ENABLE_USD_CURRENCY !== "false" ? data?.usdTransfers : {
                        currency: data?.currency,
                        todaysTransactions: data?.todaysTransactions,
                        totalTransactions: data?.totalTransactions,
                        successTransactions: data?.successTransactions,
                        failedTransaction: data?.failedTransaction,
                      };

                      return (
                        <Col xs={24} sm={24} md={24} lg={24} xl={12} key={data?.id} className="mb-3">
                          <div className="orange-cardBankdetails mb-0 pb-4">
                            <div className="d-flex justify-content-between">
                            
                              <Select
                                defaultValue={data.currency}
                                style={{ width: 120 }}
                                onChange={(value) => handleCurrencyChange(data.id, value)}
                                className="mb-3"
                              >
                                {data.currency && 
                                  <option value={data.currency}>{data.currency}</option>
                                }
                                {data.usdTransfers && ENABLE_USD_CURRENCY !== "false" && (
                                  <option value="USD">USD</option>
                                )}
                              </Select>
                              <div className="capitalize title_white mb-3">
                                {data?.status}
                              </div>
                            </div>
                            <div className="title_white">Bank Account</div>
                            <div className="d-flex align-items-center justify-content-between flex-wrap row">
                              <div style={{ fontSize: "18px" }} className="col-8">
                                {data?.name}
                              </div>
                              <div className="kybkyc-bankdetails-number col-4 d-flex justify-content-end">
                                <span className="me-2">
                                  {data?.countryCode === "AE" ? "UAE" : data?.countryCode}</span>
                                  {data?.countryCode ? <span className={`fi fi-${data?.countryCode.toLowerCase()} imgKybKyc `} style={{fontSize: '20px'}} />
                                    : <Image src={Flag}  preview={false}  height={12} width={22}/>
                                  }
                              </div>
                              <div className="mt-2 col-6">
                                <div className="kybkyc-bankdetails-transaction">IBAN Number</div>
                                <div style={{ fontSize: "16px" }}>{data?.number}</div>
                              </div>
                            </div>
                            <hr className=" w-100 opacity-50 mt-0" />
                            <div className="d-flex justify-content-between flex-wrap" style={{ gap: "18px" }}>
                              <div>
                                <div className="kybkyc-bankdetails-transaction">Today&apos;s Transaction</div>
                                <Tooltip
                                  title={
                                    currencyData?.todaysTransactions &&
                                    currencyData.todaysTransactions.toString().length > 4
                                      ? moneyFormat(currencyData.currency, parseFloat(currencyData.todaysTransactions || 0).toFixed(2))
                                      : null
                                  }
                                  overlayClassName="custom-tooltip"
                                >
                                  <div className="kybkyc-bankdetails-number amountNumber-ellipsis">
                                    {moneyFormat(currencyData.currency, parseFloat(currencyData.todaysTransactions || 0).toFixed(2))}
                                  </div>
                                </Tooltip>
                              </div>
                              <div>
                                <div className="kybkyc-bankdetails-transaction">Total Transactions</div>
                                <Tooltip
                                  title={
                                    currencyData?.totalTransactions &&
                                    currencyData.totalTransactions.toString().length > 4
                                      ? moneyFormat(currencyData.currency, parseFloat(currencyData.totalTransactions || 0).toFixed(2))
                                      : null
                                  }
                                  overlayClassName="custom-tooltip"
                                >
                                  <div className="kybkyc-bankdetails-number amountNumber-ellipsis">
                                    {moneyFormat(currencyData.currency, parseFloat(currencyData.totalTransactions || 0).toFixed(2))}
                                  </div>
                                </Tooltip>
                              </div>
                              <div>
                                <div className="kybkyc-bankdetails-transaction">Institution Type</div>
                                <div className="kybkyc-bankdetails-number">{data?.institutionType?.toUpperCase()}</div>
                              </div>
                              <div>
                                <div className="kybkyc-bankdetails-transaction">Successful Transaction</div>
                                <Tooltip
                                  title={
                                    currencyData?.successTransactions &&
                                    currencyData.successTransactions.toString().length > 4
                                      ? moneyFormat(currencyData.currency, parseFloat(currencyData.successTransactions || 0).toFixed(2))
                                      : null
                                  }
                                  overlayClassName="custom-tooltip"
                                >
                                  <div className="kybkyc-bankdetails-number amountNumber-ellipsis">
                                    {moneyFormat(currencyData.currency, parseFloat(currencyData.successTransactions || 0).toFixed(2))}
                                  </div>
                                </Tooltip>
                              </div>
                              <div className="mb-3">
                                <div className="kybkyc-bankdetails-transaction">Failed Transaction</div>
                                <Tooltip
                                  title={
                                    currencyData?.failedTransaction &&
                                    currencyData.failedTransaction.toString().length > 4
                                      ? moneyFormat(currencyData.currency, parseFloat(currencyData.failedTransaction || 0).toFixed(2))
                                      : null
                                  }
                                  overlayClassName="custom-tooltip"
                                >
                                  <div className="kybkyc-bankdetails-number amountNumber-ellipsis">
                                    {moneyFormat(currencyData.currency, parseFloat(currencyData.failedTransaction || 0).toFixed(2))}
                                  </div>
                                </Tooltip>
                              </div>
                              <div className="d-flex flex-wrap justify-content-end">
                                <PrimaryOutLineButton className="w-auto" onClick={() => setBankActiveTab("escrowTrans")}>
                                  Escrow Transaction
                                </PrimaryOutLineButton>
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                ) : (
                  <Card>
                    <div className="nodataCard mt-3 text-center">
                      <Image src={emptyCalls} preview={false} className="mt-5" />
                      <p className="nodata mt-5">No Escrow or Bank accounts created</p>
                    </div>
                  </Card>
                )}
                </>
              )
            }
    
            {
              bankActiveTab === "escrowTrans" && (
                  <>
                    <div className="d-flex buttons-filter mb-2" style={{flexFlow: "row-reverse"}}>
                      {(contractList?.length > 0 || showFilter || filterApplied) && (
                        <>
                      {!showFilter ? (
                        <>
                          <Button type="default" className="filterbutton mx-2" onClick={handleResetFilter} >
                            Reset All
                          </Button>
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
                            onClick={() => setShowFilter(false)}
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
                    </>
                  )}

                  {Width > 475 && selected && (
                    <Button 
                    className="downloadBtn mt-0 me-2" 
                    loading={downloading} 
                    onClick={downloadUserDetails}>
                      {!downloading && (
                        <span className="d-flex py-1 center">
                          <Image 
                          src={Download_Blue} 
                          alt="download" 
                          className="px-2" 
                          height={20} 
                          width={35} 
                          preview={false} 
                          />
                          Download All
                        </span>
                      )}
                    </Button>
                  )}
                </div>

                {Width < 476 && selected && (
                  <Button className="downloadBtn mt-0 mb-2" loading={downloading} onClick={downloadUserDetails}>
                    {!downloading && (
                      <span className="d-flex py-1 center">
                        <Image 
                        src={Download_Blue} 
                        alt="download" 
                        className="px-2" 
                        height={20} 
                        width={35} 
                        preview={false} 
                        />
                        Download All
                      </span>
                    )}
                  </Button>
                )}

                {showFilter && (
                  <FilterCard
                    handleApplyFilter={(e) => {
                      handleApplyFilter(e, 10, 1);
                      setFilterApplied(true);
                    }}
                    setLoading={setTableloading}
                    fetchcontractList={fetchcontractList}
                    filterType={FilterType.CONTRACT_LIST}
                    setSearchedKey={setSearchKey}
                    setCurrent={setCurrent}
                    setPage={setPage}
                  />
                )}

                {validationOnFilter && <p className="text-danger">{validationOnFilter}</p>}

                {contractList.length > 0 ? (
                  <>
                    <div className="itemTypes-mobile-view">
                      <Checkbox checked={selectAll} className="m-2 mx-0" onChange={toggleSelectAll}>
                        Select all
                      </Checkbox>
                      {contractList.map((contract: any, index:any) => (
                        <div className="mobile-card row" key={index}>
                          <Col xs={2} sm={2}>
                            <Checkbox
                              className="mt-2"
                              type="checkbox"
                              checked={selectedUserAlias.includes(contract.aliasName)}
                              onChange={() => onCheckboxChange(contract.aliasName, contract)}
                            />
                          </Col>
                          <div key={index}>
                            {columns.map((column:any, index:any) => (
                              <div
                                key={`${contract.transactionNo}-${index}`}
                                className={`sub-body ${index >= columns.length - 2 ? "col-12" : "col-6"} col-md-6`}
                              >
                                <div className="sub">
                                  <div className="mobile-header">{column.title}</div>
                                  <div className="mobile-data">{column.render(contract[column.dataIndex], contract)}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Table
                      columns={columns}
                      dataSource={contractList}
                      pagination={false}
                      className="mt-6 w-100 userDashboard paymentLogTable"
                      scroll={{ x: 1140 }}
                      loading={Tableloading}
                      rowSelection={rowSelection}
                      rowKey={(record: any) => record.aliasName}
                    />
                  </>
                ) : (
                  <Card>
                    <div className="nodataCard mt-3 text-center">
                      <Image src={emptyCalls} preview={false} className="mt-5" />
                      <p className="nodata mt-5">No escrow transaction yet done</p>
                    </div>
                  </Card>
                )}
                {contractList?.length > 0 && contractTotalPage > 10 && (
                  <div className="w-100 endtoend my-2 pagination-range">
                    <div className="show">
                      Show
                      <Select
                        defaultValue={10}
                        style={{ width: 70 }}
                        onChange={handleChangeContract}
                        className="mx-2 pageRange"
                        options={[
                          { 
                            value: 10,
                            label: "10" 
                          },
                          { value: 25, 
                            label: "25" 
                          },
                          { value: 50, 
                            label: "50" 
                          },
                          { value: 100, 
                            label: "100" 
                          },
                        ]}
                      />{" "}
                      <span className="page"> Per page</span>
                    </div>
                    <div className="right" style={{ textAlign: "center" }}>
                      <Pagination
                        current={current}
                        pageSize={page}
                        onChange={onChangePageContract}
                        total={contractTotalPage || 1}
                        itemRender={itemRender}
                        showLessItems={true}
                        responsive
                        size="small"
                      />
                    </div>
                  </div>
                )}
              </>
            )
          }
    
            {
              bankActiveTab === "paymentLogs" && (
                <>
                  {walletTransaction?.length > 0 ? (
                <>
                  <div className="d-flex flex-end mb-2">
                    {Width > 475 ? (
                      <Button
                        className="downloadBtn mt-0 me-2"
                        hidden={selectedWalletTxnIds?.length > 0 ? false : true}
                        loading={downloading}
                        onClick={() => downloadWalletDetails()} 
                      >
                        {!downloading ? (
                          <span className="d-flex py-1 center">
                            <Image
                              src={Download_Blue}
                              alt="download"
                              className="px-2"
                              height={20}
                              width={35}
                              preview={false}
                            />
                            Download All
                          </span>
                        ) : ""}
                      </Button>
                    ) : ""}
                    {Width < 476 ? (
                      <Button
                        className="downloadBtn mt-0 mb-2"
                        hidden={selectedWalletTxnIds?.length > 0 ? false : true}
                        loading={downloading}
                        onClick={() => downloadWalletDetails()}
                      >
                        {!downloading ? (
                          <span className="d-flex py-1 center">
                            <Image
                              src={Download_Blue}
                              alt="download"
                              className="px-2"
                              height={20}
                              width={35}
                              preview={false}
                            />
                            Download All
                          </span>
                        ) : ""}
                      </Button>
                    ) : ""}
                  </div>

                  <div className="paymentLog-mobile-view">
                    <Checkbox
                      checked={selectAllWallet}
                      className="m-2 mx-0"
                      onChange={toggleSelectAllWallet}
                    >
                      Select all
                    </Checkbox>

                    {walletTransaction.map((txn: any, index: any) => (
                      <div key={index} className="mobile-card row">
                        <Col xs={2} sm={2}>
                          <Checkbox
                            checked={selectedWalletTxnIds.includes(txn.id)}
                            onChange={() => onWalletCheckboxChange(txn.id, txn)}
                          />
                        </Col>
                        {Paylogcolumns.map((column: any, index: any) => (
                          <div
                            key={`${txn.transactionNo}-${index}`}
                            className="sub-body col-6 col-sm-4"
                          >
                            <div className="sub">
                              <div className="mobile-header">
                                {column.title}
                              </div>
                              <div className="mobile-data">
                                {column.render
                                  ? column.render(txn[column.dataIndex], txn)
                                  : txn[column.dataIndex]}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <Table
                    columns={Paylogcolumns}
                    dataSource={walletTransaction}
                    className="mt-6 paymentLogTable"
                    scroll={{ x: 1200 }}
                    pagination={pagination}
                    loading={Tableloading}
                    rowKey={"id"}
                    rowSelection={{
                      selectedRowKeys: selectedWalletTxnIds,
                      onChange: (keys, rows) => {
                        setSelectedWalletTxnIds(keys);
                        setSelectedWalletTxns(rows);
                        setSelected(keys.length > 0);
                        setSelectAllWallet(keys.length === walletTransaction.length);
                      },
                    }}
                  />
                </>
              ) : (
                <div className="nodataCard text-center px-5">
                  <Image src={emptyCalls} preview={false} className="mt-5" />
                  <p className="nodata py-5">No history found</p>
                </div>
              )}
              {walletTransaction?.length > 0 ? (
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
                  <div className="right" style={{ textAlign: "center" }}>
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
              </>
              )
            }
            </DefaultLayout>
      {/* change client risk */}
      <Modal
        open={classificationModalVisible}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification">
            Change client classification
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={() => {handleRiskClassificationSubmit()}}
        >
          <div className="subText mb-3 ">Client Classification *</div>

          <Form.Item name="title" className="modal_inputField select"
          rules={[
            {
              required: true,
              message: "Please select a risk level.",
            },
            {
              validator(_, value) {
                if ((parseInt(value) === 0)) {
                  return Promise.reject("Please select a risk level.")
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
          >
            <Select
              onChange={(e)=> setDropDownValue(e)}
              defaultValue={dropDownValue > 0 ? dropDownValue: null}
              placeholder="Please select a risk level"
            >
              <Select.Option value={1}>Low risk</Select.Option>
              <Select.Option value={2}>Medium risk</Select.Option>
              <Select.Option value={3}>High risk</Select.Option>
            </Select>
          </Form.Item>
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              // {
              //   min:20,
              //   message:"Please enter minimum 20 characters sa"
              // },
              {
                validator: async (_, value) => {
                  await validatePopupCommentFields(value);
                  if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.RISK_CHANGE_COMMENT) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.RISK_CHANGE_COMMENT}`));
                },
              },
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              placeholder="Please enter your comment"
              // onInput={handleInput}
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="popup-res-btns d-flex gap-2">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit
            </Button>
            <Button
              key="submit"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                getKycdetails();
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Approve Document */}
      <CommentModalForm
        open={CommentModal}
        title={modalTitle}
        form={formDocumentApprove}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={handleApprove}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}
      />

      {/* Reject Document */}
      <CommentModalForm
        open={CommentModalReject} title={`Reject ${modalTitle}`}
        form={formDocumentReject}
        isErrorTitle
        comment={comment}
        onCommentChange={setComment}
        onSubmit={handleReject}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}
      />

      {/* Approve KYC */}
      <CommentModalForm
        open={ApproveModal}
        title="Approve KYC Request"
        form={formApproveKYC}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={approveKYC}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
      />

      {/* Reject KYC */}
      <CommentModalForm
        open={RejectModal}
        title="Reject KYC Request"
        isErrorTitle
        form={formRejectKYC}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={rejectKYC}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
        loading={loading}
      />

      {/* Hold KYC */}
      <CommentModalForm
        open={holdModal}
        title="Hold KYC Request"
        form={formHoldKYC}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={() => approveKYC("hold")}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
      />

      {/* Download option */}
      <Modal
        open={downloadModal}
        footer={false}
        className="classification-modal"
        title={
          <span className="change-client-classification ml-4">
            Download All KYC Information
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <div className="stepDetails fw-400 mx-3 py-2 modal-word-wrap">
         <p> Choose which data you want to download now?</p>
        </div>
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
        >
          <Radio.Group defaultValue="3" buttonStyle="solid" className="mx-3">
            <Row>
              <Radio
                value="1"
                onClick={() => {
                  setDownloadOption(1);
                }}
              >
                <NormalText children="Download information" />
              </Radio>
            </Row>
            <Row>
              <Radio
                value="2"
                onClick={() => {
                  setDownloadOption(2);
                }}
              >
                <NormalText children="Download attached files" />
              </Radio>
            </Row>
            <Row>
              <Radio
                value="3"
                onClick={() => {
                  setDownloadOption(3);
                }}
              >
                <NormalText children="Download Above Both" />
              </Radio>
            </Row>
          </Radio.Group>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
              loading={loader}
              onClick={() => {
                downloadKYCDetails();
              }}
            >
              Download
            </Button>
            <Button
              key="cancel"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>

      {/* KYC Search again Modal */}
      <SearchAgainKybKycModal
        headKYBModal={"KYC"}
        searchKybModal={searchKybModal}
        setSearchKybModal={setSearchKybModal}
        kybInfo={kybInfo}
        setKybInfo={setKybInfo}
        digiScreeningPayload={digiScreeningPayload}
        setDigiScreeningPayload={setDigiScreeningPayload}
        riskDetails={riskDetails}
        userAlias={userAlias}
        formCheckKyB={formCheckKyB}
        setRiskAssessment={setRiskAssessment}
        datasetsOptions={datasetsOptions}
        setDatasetsOptions={setDatasetsOptions}
        fatfTypeId={fatfTypeId}
        fatfList={fatfList}
        riskAssessmentFormPayload={riskAssessmentFormPayload}
        setRiskAssessmentFormPayload={setRiskAssessmentFormPayload}
        setRiskAssessmentPayload={setRiskAssessmentPayload}
        kybBasic={kybBasic}
        setDropDownValue={setDropDownValue}
        countryList={countryList}
        brithPlaceList={brithPlaceList}
      />

      <PdfPreviewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />

      {/**Create Escrow Account */}
      <ModalCreateEscrowAccount
        open={createVirtualAccountModal}
        onCancel={handleModalCancel}
        onSubmit={createVirtualAcc}
        frmEscrow={frmEscrow}
        loading={loader}
        validCurrencyList={validCurrencyList}
      />

      <Modal
        className="text-center modals"
        width={410}
        centered
        open={onSuccessCreateVA}
        onOk={() => setOnSuccessCreateVA(false)}
        onCancel={() => setOnSuccessCreateVA(false)}
        footer={null}
        maskClosable={false}
      >

        <div className="d-flex justify-content-center align-items-center">
        <Image src={orangeTick} preview={false} className="mt-2 orangeTick-completed"/>
        </div>
        <div className="titleText mt-3 mb-3">
          Escrow account created successfully
        </div>
      </Modal>
    </div>
  );
};

export default AdminKYCDetails;
