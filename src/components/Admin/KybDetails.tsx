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
import CompanyIcon from "../../assets/img/company_gray.svg";
import Email from "../../assets/img/Email_outline.svg";
import Phone_Dark from "../../assets/img/kyb_phone_white.svg";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Phone from "../../assets/img/Phone.svg";
import { KYBManagementList, TransactionDetail } from "../Common/RouteConst";
// import Flag from "../../assets/img/flag.svg";
import Meta from "antd/es/card/Meta";
import TabPane from "antd/lib/tabs/TabPane";
import moment from "moment";
import { useEffect, useState } from "react";
import { default as Flag, default as Globe_dark } from "../../assets/img/Country.svg";
import orangeTick from "../../assets/img/orange_tick.svg";
import Globe from "../../assets/img/crossGlobe_white.svg";
import EmailIcon from "../../assets/img/Email.svg";
import DocIcon from "../../assets/img/grayDoc.svg";
import Individual from "../../assets/img/Individual.svg";
import JobIcon from "../../assets/img/job_gray.svg";
import Job from "../../assets/img/job_white.svg";
import Company from "../../assets/img/kyb_company_white.svg";
import Location from "../../assets/img/kyb_location_white.svg";
import Nation from "../../assets/img/Nation.svg";
import emptyCalls from "../../assets/img/notransaction.svg";
import {
  createPlatformFees,
  updatePlatformFees,
  createVirtualAccount,
  downloadDetails,
  downloadKybDetails,
  fetchKybDetails,
  filteredTransaction,
  getRiskConfiguration,
  holdKyc,
  updateKybKycRiskClassification,
  verifyKyb,
  verifyKybDocument,
  virtualAccountDetails,
  getUserPlatformFees,
  getAllUserPlatformFeesByUserAlias,
} from "../../services/admin";
import ApproverDetails from "../Common/ApproverDetails";
import {
  COMPANY_ROLE,
  // CONTRACT_STATUS,
  contractStatusMap,
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
  VALID_CURRENCY
} from "../Common/Constants";
import {
  PrimaryOutLineButton,
  SecondaryOutLineButton,
} from "../ui-elements/ButtonRepo";
import { NormalText } from "../ui-elements/TextRepo";
import ModalCreateEscrowAccount from "./ModalCreateEscrowAccount";
// @ts-ignore
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import multiDownload from "multi-download";
import { Document, Page } from "react-pdf";
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
import { CommentModalForm } from "./CommentModalForm";
import FilterCard from "./FilterCard";
import RiskAssesmentCard from "./RiskAssesmentCard";
import SearchAgainKybKycModal from "./SearchAgainKybKycModal";
import VerifyKybKycCard from "./VerifyKybKycCard";
import PlatformFeesModal from "../Common/PlatformFeesModal";
import { PlatformFeesSection } from "./PlatformFeesSection";
const { TextArea } = Input;
const { Text } = Typography;
interface ShareHolder {
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  Gender?: string;
  shareholdingsPercentage?: number;
  designation?: string;
  moduleForSanctionScreening?: string;
  beneficialOwnerDob?: Date;
  beneficialOwnerNationality?: string;
  aliasName?: string | null; 
  trusteeComment?: string | null; 
  endComment?: string | null; 
  riskClassification?: string; 
  trusteeAdverseMediaComment?: string | null; 
  trusteeAmlScreeningComment?: string | null; 
  trusteeNameAndIdVerificationComment?: string | null; 
  trusteeValidDocumentVerificationComment?: string | null; 
  trusteeOtherCommentAndNotes?: string | null; 
  adverseMediaComment?: string | null; 
  amlScreeningComment?: string | null; 
  nameAndIdVerificationComment?: string | null; 
  validDocumentVerificationComment?: string | null; 
  otherCommentAndNotes?: string | null; 
  docExpiryDate?: Date | null; 
  isDocExpired?: boolean; 
  docNumber?: string | null; 
  type?: string;
  frontStatus?: string; 
  frontUrl?: string; 
  backStatus?: string; 
  backUrl?: string; 
  CompnayName?: string; 
  companyShareholdingDateOfIncorporation?: any; 
  companyShareholdingsPercentage?: string; 
  companyShareholdingCountryOfIncorporation?: string; 
  companyShareholdingCountryOfIncorporationTypeId?: number; 
  docStatus?: string; 
  docUrl?: string; 
}
interface RepresentativeDetails {
  documentNationality?: string,
  fatf?: number,
  nationality?: string,
  repDocNumber?: string,
  repExpiryDate?: any,
  representativeName?: string,
  roleType?: any,
  sharedOwnership?: boolean
  representativeShare?: any
  isCorporateShareholder?: any
}
const AdminKYBDetails = ():any => {
  const navigate = useNavigate();
  const [classificationModalVisible, setClassificationModalVisible] =
    useState(false);
  const [CommentModal, setCommentModal] = useState(false);
  const [CommentModalReject, SetCommentModalReject] = useState(false);
  const [CommentModalData, setCommentModalData] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [form] = Form.useForm();
   const [repCmtForm] = Form.useForm();
   const [shareholderCmtForm] = Form.useForm();
  const [dropDownValue, setDropDownValue] = useState<any>(0);
  const [comment, setComment] = useState("");
  const [ApproveModal, setApproveModal] = useState(false);
  const [RejectModal, setRejectModal] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false); 
  const [downloadOption, setDownloadOption] = useState(3);
  const [checkboxComment, setCheckboxComment] = useState<any>({});
  const [checkboxCommentApprover, setCheckboxCommentApprover] = useState<any>({});

  const [checkboxCommentRepresentative, setCheckboxCommentRepresentative] = useState<any>({});
  const [checkboxCommentApproverRepresentative, setCheckboxCommentApproverRepresentative] = useState<any>({});

  const [checkboxCommentShareholder, setCheckboxCommentShareholder] = useState<any>({});
  const [checkboxCommentApproverShareholder, setCheckboxCommentApproverShareholder] = useState<any>({});

  const [KYBDetails, setKYBDetails] = useState<any>({});
  const [representativeAsShareholderIndex, setRepresentativeAsShareholderIndex] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [isRepresentativeFront, setIsRepresentativeFront] = useState(false);
  const [isRepresentativeBack, setIsRepresentativeBack] = useState(false);
  const [isRepresentativeAddress, setIsRepresentativeAddress] = useState(false);

  const [nameAndIdVerification, setNameAndIdVerification] = useState(false);
  const [nameAndIdVerificationRepresentative, setNameAndIdVerificationRepresentative] = useState(false);
  const [nameAndIdVerificationShareholder, setNameAndIdVerificationShareholder] = useState(false);

  const [validDocumentVerification, setValidDocumentVerification] =useState(false);
  const [validDocumentVerificationRepresentative, setValidDocumentVerificationRepresentative] =useState(false);
  const [validDocumentVerificationShareholder, setValidDocumentVerificationShareholder] =useState(false);

  const [amlScreening, setAmlScreening] = useState(false);
  const [amlScreeningRepresentative, setAmlScreeningRepresentative] = useState(false);
  const [amlScreeningShareholder, setAmlScreeningShareholder] = useState(false);

  const [adverseMedia, setAdverseMedia] = useState(false);
  const [adverseMediaRepresentative, setAdverseMediaRepresentative] = useState(false);
  const [adverseMediaShareholder, setAdverseMediaShareholder] = useState(false);

  const [PoliticallyPerson, setPoliticallyPerson] = useState(false);
  const [holdModal, setHoldModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Representative"); 
  const [activeShareholderTab, setActiveShareholderTab] = useState('1');

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

  const [otherComment, setOtherComment] = useState<boolean>(false);
  const [otherCommentRepresentative, setOtherCommentRepresentative] = useState<boolean>(false);
  const [otherCommentShareholder, setOtherCommentShareholder] = useState<boolean>(false);

  const [shareHoldersPayload, setShareHoldersPayload] = useState<ShareHolder[]>([]);
  const [disable, setDisable] = useState<boolean>(false);
  const [countryList, setCountryList] = useState([]);
  const [shareholderAuthorizationFileList, setShareholderAuthorizationFileList] = useState<any[]>([]);
  const [shareholderRepresentativeFileList, setShareholderRepresentativeFileList] = useState<any[]>([]);
  const [shareholderAddressFileList, setShareholderAddressFileList] = useState<any[]>([]);
  const [CommentModalKey, setCommentModalKey] = useState("");
  const [loader, setLoader] = useState(false);
  const [kybFATCAPayload, setKybFATCAPayload] = useState<any>({});
  const [kybFATCAColtrollersPayload, setKybFATCAColtrollersPayload] = useState<any>([]);
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [isAllMoaDocApproved, setIsAllMoaDocApproved] = useState<boolean>(false);
  const [isAllShareholderVerified, setIsAllShareholderVerified] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const [frmEscrow] = Form.useForm();
  const [createVirtualAccountModal, setCreateVirtualAccountModal] = useState<boolean>(false);
  const [createVirtualAccnt, setCreateVirtualAccount] = useState<boolean>(false);
  const [onSuccessCreateVA, setOnSuccessCreateVA] = useState<boolean>(false);
  const [representativeDetails, setRepresentativeDetails] = useState<RepresentativeDetails>({});
  const [shareHoldingCompanyDigiScreeningPayload, setShareHoldingCompanyDigiScreeningPayload] = useState({});
  const [shareHoldingCompanyDigiScreeningResponse, setShareHoldingCompanyDigiScreeningResponse] = useState({});
  const [validCurrencyList, setValidCurrencyList] = useState<any>(VALID_CURRENCY);
    // const [countryofIncorporationTypeId, setCountryofIncorporationTypeId] = useState("")
  const isApprover = ['TRUSTEE','MAKER'].includes(userType);
  const isAuthorizer = ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType);
 // const [countryofIncorporationTypeId, setCountryofIncorporationTypeId] = useState("")
  const [countryofIncorporationTypeList, setCountryofIncorporationTypeList] = useState<any>([]);
  const [specialErrors, setSpecialErrors] = useState<Record<string, boolean>>({});
  
  const [formDocumentApprove] = Form.useForm();
  const [formDocumentReject] = Form.useForm();
  const [formApproveKYB] = Form.useForm();
  const [formRejectKYB] = Form.useForm();
  const [formHoldKYB] = Form.useForm();

  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState<any>(10);

  const [current, setCurrent] = useState<any>(1);
  const [virtualAccountData, setVirtualAccountData] = useState<any>([]);
  const [country, setCountry] = useState("");
  const [bankActiveTab, setBankActiveTab] = useState("kybDetails");
  const [userBankList, setUserBankList] = useState<any>([]);
  const [Tableloading, setTableloading] = useState<any>(false);
  const [contractList, setContractList] = useState([]);
  const [contractTotalPage, setContractTotalPage] = useState(0);
  const [walletTransaction, setWalletTransaction] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>(0);
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
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    if (!isApprover && userAlias) {
      const user = userAlias ?? "";
      virtualAccountDetails(user)
        .then((resp: any) => {
          const vaDetails = resp?.data?.VADetails || [];
          if (vaDetails?.length > 0) {
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
            setValidCurrencyList([...VALID_CURRENCY])
            setCreateVirtualAccount(true)
          }
        })
        .catch((err: any) => {
          if (err?.data?.statusCode === 404) {
            setCreateVirtualAccount(true);
          } else {
            message.error("Failed to fetch escrow account data.");
          }
        })
    }
    getKybdetails();
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
  
  useEffect(() => {
    if ((bankActiveTab === "bankDetails" || !createVirtualAccnt) && userAlias) {
      const user = userAlias;
      setLoading(true);
  
      virtualAccountDetails(user)
        .then(async (res) => {
          const vaDetails = res?.data?.VADetails;
  
          if (!vaDetails || vaDetails.length === 0) {
            message.warning("Please verify KYB and create escrow account");
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
          if ((status === 404 || errData?.message === "Account not found")) {
            if (KYBDetails?.kybStatus === "VERIFIED") {
              message.warning("Please create an escrow account.");
            } 
          } else {
            message.error("Could not fetch details. Please try again later");
          }
        });    
        getBankList(user);          
    }
  }, [userAlias, bankActiveTab]);

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
      render: (text: string, record: any) => {
        const currency = record.Currency || "AED";
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

  const onBankActiveTab = (key: string) => {
    if (key === "bankDetails" && (KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "PENDING")) {
      message.warning("Please verify KYB details before accessing Bank Details.");
      return;
    }
    setBankActiveTab(key);
    setBankActiveTab(key);
    setSelectedWalletTxnIds([]);
    setSelectedUserAlias([]);
    setSelected(false);
  };
  
  const fetchcontractList = (pageNo: number, limit: number, tabValue: string) => {
    setTableloading(true);
    getContractList(userAlias, pageNo > 0 ? pageNo - 1 : 0, limit, tabValue)
      .then((res: any) => {
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
        setWalletTransaction(response.data?.VATransactionList?.data);
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
    walletTransactionList(pageno - 1, page); 
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
    fetchcontractList(1, 10, "all");
  }, []);
  
  const [searchKey, setSearchKey] = useState<any>({});
  const [validationOnFilter, setValidationOnFilter] = useState("");

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
       if (
         filterOptions.transId !== undefined &&
         filterOptions.transId !== ""
       ) {
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
           setContractTotalPage(res?.data?.count || 0);
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
      url += `?accountType=ALL&accountAlias=ALL&page=0&limit=10&typeOfEntity=COMPANY&id=${encodeURIComponent(ids)}`;
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
      url += `?id=${selectedUserAlias.join(",")}&userAlias=${userAlias}&typeOfEntity=COMPANY`;
    } else {
      url += `?userAlias=${userAlias}&typeOfEntity=COMPANY`;
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

  const handleResetFilter = () => {
    setShowFilter(false);
    setSearchKey({});
    setValidationOnFilter("");
    setCurrent(1);
    fetchcontractList(1, 10, "all");
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

  useEffect(() => {
    const rejectedReason:any = [{ rejectReason: [] }];
    if (
      KYBDetails?.basic?.[0].typeOfEntity != "INDIVIDUAL" &&
      KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.status === "REJECTED"
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Business registration proof",
        reason: KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.reason,
      });
    }

    if (
      KYBDetails?.basic?.[0].typeOfEntity != "INDIVIDUAL" &&
      (KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.status ===
        "REJECTED" ||
        KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.isCompliance ===
          "false")
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Operating address proof",
        reason: KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.reason,
      });
    }

    if (
      KYBDetails?.documents?.[0]?.repDocFront?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.repDocFront?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: `${
          DOCUMENT_TYPE[KYBDetails?.documents?.[0]?.repDocType]
        } Front`,
        reason: KYBDetails?.documents?.[0]?.repDocFront?.[0]?.reason,
      });
    }
    if (
      KYBDetails?.documents?.[0]?.repDocBack?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.repDocBack?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: `${
          DOCUMENT_TYPE[KYBDetails?.documents?.[0]?.repDocType]
        } back`,
        reason: KYBDetails?.documents?.[0]?.repDocBack?.[0]?.reason,
      });
    }
    if (
      KYBDetails?.documents?.[0]?.repAddProof?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.repAddProof?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Address proof",
        reason: KYBDetails?.documents?.[0]?.repAddProof?.[0]?.reason,
      });
    }
    if (
      KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Authorization document",
        reason: KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.reason,
      });
    }

    if (
      KYBDetails?.documents?.[0]?.vatDoc?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.vatDoc?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "VAT Document",
        reason: KYBDetails?.documents?.[0]?.vatDoc?.[0]?.reason,
      });
    }

    if (
      KYBDetails?.documents?.[0]?.otherDoc?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.otherDoc?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Other Document",
        reason: KYBDetails?.documents?.[0]?.otherDoc?.[0]?.reason,
      });
    }
    if (KYBDetails?.moaDocuments?.length > 0) {
      const allVerified = KYBDetails?.moaDocuments?.every((doc: any) => isApprover ? doc?.isCompliance == true : doc?.status === 'VERIFIED');
      setIsAllMoaDocApproved(allVerified); 
    }
  
    if (KYBDetails && (KYBDetails?.shareholderDocuments || KYBDetails?.representativeShareholderDocuments || KYBDetails?.shareholderAddressDocFileList)) {
      // const allShareholderDocsArr = KYBDetails?.shareholderDocuments?.flatMap((doc: any) => Object?.values(doc)?.flat());
      // const allRepresentativeShareholderDocArr = KYBDetails?.representativeShareholderDocuments?.flatMap((doc: any) => Object?.values(doc)?.flat());
      // const allShareholderDocVerified = allShareholderDocsArr && allShareholderDocsArr?.every((doc: any) => {
      //   return isApprover ? doc?.isCompliance === true : doc?.status === 'VERIFIED'
      // });
      // const allRepresentativeShareholderDocVerified = allRepresentativeShareholderDocArr && allRepresentativeShareholderDocArr?.every((doc: any) => {
      //   return isApprover ? doc?.isCompliance === true : doc?.status === 'VERIFIED'
      // });
      // if (allShareholderDocVerified && allRepresentativeShareholderDocVerified) {
      //   setIsAllShareholderVerified(true);
      // }
      setIsAllShareholderVerified(isAllDocumentApproved(KYBDetails))
    }
    if (
      KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Shareholding Trade License Document",
        reason: KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.reason,
      });
    }
    if (
      KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Shareholding Moa Document",
        reason: KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.reason,
      });
    }
      if (
      KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Shareholding Company Address Document",
        reason: KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.reason,
      });
    }
    if (
      KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.status === "REJECTED" ||
      KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.isCompliance === false
    ) {
      rejectedReason[0].rejectReason.push({
        kybdoctype: "Shareholding Other Document",
        reason: KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.reason,
      });
    }

  }, [KYBDetails]);

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

  const downloadKYBDetails = () => {
    const files = [];
    const data = KYBDetails?.documents?.[0];
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
    if (data?.authorizationDoc?.[0]?.url) {
      files.push(data?.authorizationDoc?.[0]?.url);
    }
    if (data?.vatDoc?.[0]?.url) {
      files.push(data?.vatDoc?.[0]?.url);
    }
    if (data?.otherDoc?.[0]?.url) {
      files.push(data?.otherDoc?.[0]?.url);
    }
    if (data?.shareHoldingMoaDoc?.[0]?.url) {
      files.push(data?.shareHoldingMoaDoc?.[0]?.url);
    }
    if (data?.shareHoldingCompanyAddressDoc?.[0]?.url) {
      files.push(data?.shareHoldingCompanyAddressDoc?.[0]?.url);
    }
    if (data?.shareHoldingTradeLicenseDoc?.[0]?.url) {
      files.push(data?.shareHoldingTradeLicenseDoc?.[0]?.url);
    }
    if (data?.shareHoldingOtherDoc?.[0]?.url) {
      files.push(data?.shareHoldingOtherDoc?.[0]?.url);
    }
    if (data?.moaDocuments?.[0]?.url) {
      files.push(data?.moaDocuments?.[0]?.url);
    }
    if (KYBDetails?.representativeShareholderDocuments) {
      KYBDetails.representativeShareholderDocuments.forEach((doc: any) => {
        Object.values(doc).forEach((docArray: any) => {
          docArray.forEach((docItem: any) => {
            if (docItem?.url) files.push(docItem.url);
          });
        });
      });
    }
    setLoader(true);
    if ( downloadOption == 1) {
      downloadKybDetails(userAlias).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "KYBDetails.xlsx");
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
        link.setAttribute("download", "KYBDetails.xlsx");
        document.body.appendChild(link);
        link.click();
        setDownloadModal(false);
        setLoader(false);
      });
      multiDownload(files);
    }
  };

  const setAllCheckboxComments = (data:any) => {
    if(isApprover && (data?.isTrusteeKybRejected === true || data?.trusteeKybStatus === true || !isVerificationPending(data))){
      setDisable(true)
    } else if((data?.kybStatus === "VERIFIED" || data?.kybStatus === "REJECTED" || data?.kybStatus === "EXPIRED" || !isVerificationPending(data) ) ){
      setDisable(true)
    } else{
      setDisable(false)
    }
    const comments = {
      amlScreening: data?.adminComments?.amlScreeningComment,
      adverseMedia: data?.adminComments?.adverseMediaComment,
      nameAndIdVerification:
        data?.adminComments?.nameAndIdVerificationComment,
      validDocumentVerification:
        data?.adminComments?.validDocumentVerificationComment,
        otherCommentAndNotes: data?.adminComments?.otherCommentAndNotes,
    };

    const repComments = {
      amlScreening: data?.adminRepresentativeComments?.amlScreeningComment,
      adverseMedia: data?.adminRepresentativeComments?.adverseMediaComment,
      nameAndIdVerification:
        data?.adminRepresentativeComments?.nameAndIdVerificationComment,
      validDocumentVerification:
        data?.adminRepresentativeComments?.validDocumentVerificationComment,
        otherCommentAndNotes: data?.adminRepresentativeComments?.otherCommentAndNotes,
    };

    const shareComments = {
      amlScreening: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'amlScreeningComment'),
      adverseMedia: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'adverseMediaComment'),
      nameAndIdVerification: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'nameAndIdVerificationComment'),
      validDocumentVerification:getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'validDocumentVerificationComment'),
      otherCommentAndNotes: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'otherCommentAndNotes'),
    };

    // let shareComments = {
    //   amlScreening: data?.adminShareholderComments?.amlScreeningComment,
    //   adverseMedia: data?.adminShareholderComments?.adverseMediaComment,
    //   nameAndIdVerification:
    //     data?.adminShareholderComments?.nameAndIdVerificationComment,
    //   validDocumentVerification:
    //     data?.adminShareholderComments?.validDocumentVerificationComment,
    //   otherCommentAndNotes: data?.adminShareholderComments?.otherCommentAndNotes,
    // };

    // approver comments
    const commentsApprover = {
      amlScreening: data?.approverComments?.amlScreeningComment,
      adverseMedia: data?.approverComments?.adverseMediaComment,
      nameAndIdVerification:
        data?.approverComments?.nameAndIdVerificationComment,
      validDocumentVerification:
        data?.approverComments?.validDocumentVerificationComment,
      otherCommentAndNotes: data?.approverComments?.otherCommentAndNotes,
    };

    const repCommentsApprover = {
      amlScreening: data?.approverRepresentativeComments?.amlScreeningComment,
      adverseMedia: data?.approverRepresentativeComments?.adverseMediaComment,
      nameAndIdVerification:
        data?.approverRepresentativeComments?.nameAndIdVerificationComment,
      validDocumentVerification:
        data?.approverRepresentativeComments?.validDocumentVerificationComment,
      otherCommentAndNotes: data?.approverRepresentativeComments?.otherCommentAndNotes,
    };

    const shareCommentsApprover = {
      amlScreening: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'trusteeAmlScreeningComment'),
      adverseMedia: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'trusteeAdverseMediaComment'),
      nameAndIdVerification: getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeNameAndIdVerificationComment'),
      validDocumentVerification:getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeValidDocumentVerificationComment'),
      otherCommentAndNotes: getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeOtherCommentAndNotes'),
    };

    // let shareCommentsApprover = {
    //   amlScreening: data?.approverShareholderComments?.amlScreeningComment,
    //   adverseMedia: data?.approverShareholderComments?.adverseMediaComment,
    //   nameAndIdVerification:
    //     data?.approverShareholderComments?.nameAndIdVerificationComment,
    //   validDocumentVerification:
    //     data?.approverShareholderComments?.validDocumentVerificationComment,
    //   otherCommentAndNotes: data?.approverShareholderComments?.otherCommentAndNotes,
    // };
    repCmtForm.setFieldsValue({
      validDocumentVerificationApprover: repCommentsApprover?.validDocumentVerification,
      amlScreeningApprover: repCommentsApprover?.amlScreening,
      adverseMediaApprover: repCommentsApprover?.adverseMedia,
      nameAndIdVerificationApprover: repCommentsApprover?.nameAndIdVerification,
      otherCommentAndNotesApprover: repCommentsApprover?.otherCommentAndNotes,
    });

    repCmtForm.setFieldsValue({
      validDocumentVerification: repComments?.validDocumentVerification,
      amlScreening: repComments?.amlScreening,
      adverseMedia: repComments?.adverseMedia,
      nameAndIdVerification: repComments?.nameAndIdVerification,
      otherCommentAndNotes: repComments?.otherCommentAndNotes,
    });

    shareholderCmtForm.setFieldsValue({
      validDocumentVerificationApprover: shareCommentsApprover?.validDocumentVerification,
      amlScreeningApprover: shareCommentsApprover?.amlScreening,
      adverseMediaApprover: shareCommentsApprover?.adverseMedia,
      nameAndIdVerificationApprover: shareCommentsApprover?.nameAndIdVerification,
      otherCommentAndNotesApprover: shareCommentsApprover?.otherCommentAndNotes,
    });
    shareholderCmtForm.setFieldsValue({
      validDocumentVerification: shareComments?.validDocumentVerification,
      amlScreening: shareComments?.amlScreening,
      adverseMedia: shareComments?.adverseMedia,
      nameAndIdVerification: shareComments?.nameAndIdVerification,
      otherCommentAndNotes: shareComments?.otherCommentAndNotes,
    });

    setCheckboxComment(comments);
    setCheckboxCommentApprover(commentsApprover);
    setCheckboxCommentRepresentative(repComments);
    setCheckboxCommentApproverRepresentative(repCommentsApprover);
    setCheckboxCommentShareholder(shareComments);
    setCheckboxCommentApproverShareholder(shareCommentsApprover);
  }

  const setClassification = (data: any) => {
    let classification = data?.clientClassification;
    if (activeTab === 'Representative') {
      classification = Number(data?.representativeClassification ?? classification)
    } else if (activeTab === 'Shareholder') {
      // classification = Number(data?.shareholderClassification ?? classification)
      classification = Number(getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'riskClassification'))
    } else {
      classification = Number(classification)
    }
    let riskScore = 0;
    if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.LOW_RISK) {
      riskScore = 1;
    } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.MEDIUM_RISK){
      riskScore = 2;
    } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.HIGH_RISK){
      riskScore = 3;
    }
    if (classification && !isNaN(classification) && classification  !== riskScore) {
      riskScore = classification;
    }
    if (riskScore > 0) {
      setDropDownValue(riskScore);
    }
  }

  const setShareholderCheckBox = (data: any) => {
    if (activeTab === 'Shareholder') {
      if (isApprover) {

        setValidDocumentVerificationShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeValidDocumentVerificationComment'));
        setNameAndIdVerificationShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeNameAndIdVerificationComment'));
        setAmlScreeningShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeAmlScreeningComment'));
        setAdverseMediaShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeAdverseMediaComment'));
        setOtherCommentShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeOtherCommentAndNotes'));
      } else {
        setValidDocumentVerificationShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'validDocumentVerificationComment'));
            setNameAndIdVerificationShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'nameAndIdVerificationComment'));
            setAmlScreeningShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'amlScreeningComment'));
            setAdverseMediaShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'adverseMediaComment'));
            setOtherCommentShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'otherCommentAndNotes'));
      }
    }
  }
  const getRepresentativeAsShareHolderIndex = (representative: any, shareholders: any[]) => {
    let index;
    for (let i = 0; i < shareholders.length; i++) {
      const shareholder = shareholders[i];
      
      let isRepresentativeAsShareholder = shareholder.docNumber === representative.repDocNumber;

      isRepresentativeAsShareholder &&= dayjs.utc(shareholder.docExpiryDate).format("YYYY-MM-DD") === dayjs.utc(representative.repExpiryDate).format("YYYY-MM-DD");

      isRepresentativeAsShareholder &&= shareholder.shareholdingsPercentage === representative.representativeShare;

      isRepresentativeAsShareholder &&= dayjs.utc(shareholder.beneficialOwnerDob).format("YYYY-MM-DD") === dayjs.utc(representative.representativeDob).format("YYYY-MM-DD");

      isRepresentativeAsShareholder &&= shareholder.beneficialOwnerDocNationality === representative.repDocType;

      isRepresentativeAsShareholder &&= 
        representative.representativeName.toLowerCase().includes(shareholder.FirstName.toLowerCase()) || 
          representative.representativeName.toLowerCase().includes(shareholder.LastName.toLowerCase());
      
      if (isRepresentativeAsShareholder) {
        index = i + 1;
        break;
      } 
    }

    return index;
  }

  const getKybdetails = (isUpload="") => {
    fetchKybDetails(userAlias,true).then(async (response: any) => {
      const data = response?.data?.data?.[0];  
      

      if(data?.representative) {
        const repDetails = Array.isArray(data?.representative) ? data?.representative[0] : data?.representative;
        setRepresentativeDetails(repDetails);
      }
      setKYBDetails(data);
      setRepresentativeAsShareholderIndex(getRepresentativeAsShareHolderIndex(data.representative[0], data.shareholdersPayload))

      // let classification = data?.clientClassification;
      // if (activeTab === 'Representative') {
      //   classification = Number(data?.representativeClassification ?? classification)
      // } else if (activeTab === 'Shareholder') {
      //   classification = Number(data?.shareholderClassification ?? classification)
      // } else {
      //   classification = Number(classification)
      // }
      setClassification(data);

      if (data?.userAlias) {
        const res = await getUserPlatformFees(data.userAlias, TRANSACTION_TYPE.ESCROW);
        const feesData = res?.data;
        
        if (feesData) {
          setPlatformFeesExists(feesData);  
        } else {
          setPlatformFeesExists(null);
        }
      }

      if(isUpload == "") {
        // admin comments
        setAllCheckboxComments(data);
        
        // checkbox data          
        if((!isApprover &&  data?.adminComments !== null && (data?.adminComments ? Object.keys(data?.adminComments).length > 0 : true)) 
          || (isApprover && data?.approverComments !== null && (data?.approverComments ? Object.keys(data?.approverComments).length > 0 : true))){
          // setDropDownValue(classification);
          setPoliticallyPerson(data?.PoliticallyExposedPerson);
        }
        if(isApprover) {
          if (data?.approverRepresentativeComments) {
            setValidDocumentVerificationRepresentative(!!data?.approverRepresentativeComments?.validDocumentVerificationComment);
            setNameAndIdVerificationRepresentative(!!data?.approverRepresentativeComments?.nameAndIdVerificationComment);
            setAmlScreeningRepresentative(!!data?.approverRepresentativeComments?.amlScreeningComment);
            setAdverseMediaRepresentative(!!data?.approverRepresentativeComments?.adverseMediaComment);
            setOtherCommentRepresentative(!!data?.approverRepresentativeComments?.otherCommentAndNotes);
          }
          if (data?.approverShareholderComments || data?.shareholdersPayload) {
            setValidDocumentVerificationShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeValidDocumentVerificationComment'));
            setNameAndIdVerificationShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeNameAndIdVerificationComment'));
            setAmlScreeningShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeAmlScreeningComment'));
            setAdverseMediaShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeAdverseMediaComment'));
            setOtherCommentShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'trusteeOtherCommentAndNotes'));
            // setValidDocumentVerificationShareholder(!!data?.approverShareholderComments?.validDocumentVerificationComment);
            // setNameAndIdVerificationShareholder(!!data?.approverShareholderComments?.nameAndIdVerificationComment);
            // setAmlScreeningShareholder(!!data?.approverShareholderComments?.amlScreeningComment);
            // setAdverseMediaShareholder(!!data?.approverShareholderComments?.adverseMediaComment);
            // setOtherCommentShareholder(!!data?.approverShareholderComments?.otherCommentAndNotes);
          }
          if (data?.approverComments) {
            setValidDocumentVerification(!!data?.approverComments?.validDocumentVerificationComment);
            setNameAndIdVerification(!!data?.approverComments?.nameAndIdVerificationComment);
            setAmlScreening(!!data?.approverComments?.amlScreeningComment);
            setAdverseMedia(!!data?.approverComments?.adverseMediaComment);
            setOtherComment(!!data?.approverComments?.otherCommentAndNotes);
          }
        } else {
          if (data?.adminRepresentativeComments) {
            setValidDocumentVerificationRepresentative(!!data?.adminRepresentativeComments?.validDocumentVerificationComment);
            setNameAndIdVerificationRepresentative(!!data?.adminRepresentativeComments?.nameAndIdVerificationComment);
            setAmlScreeningRepresentative(!!data?.adminRepresentativeComments?.amlScreeningComment);
            setAdverseMediaRepresentative(!!data?.adminRepresentativeComments?.adverseMediaComment);
            setOtherCommentRepresentative(!!data?.adminRepresentativeComments?.otherCommentAndNotes);
          }
          if (data?.adminShareholderComments || data?.shareholdersPayload) {
            setValidDocumentVerificationShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'validDocumentVerificationComment'));
            setNameAndIdVerificationShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'nameAndIdVerificationComment'));
            setAmlScreeningShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'amlScreeningComment'));
            setAdverseMediaShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'adverseMediaComment'));
            setOtherCommentShareholder(!!getShareholderComment(data?.shareholdersPayload, activeShareholderTab, 'otherCommentAndNotes'));
            // setValidDocumentVerificationShareholder(!!data?.adminShareholderComments?.validDocumentVerificationComment);
            // setNameAndIdVerificationShareholder(!!data?.adminShareholderComments?.nameAndIdVerificationComment);
            // setAmlScreeningShareholder(!!data?.adminShareholderComments?.amlScreeningComment);
            // setAdverseMediaShareholder(!!data?.adminShareholderComments?.adverseMediaComment);
            // setOtherCommentShareholder(!!data?.adminShareholderComments?.otherCommentAndNotes);
          }
          if (data?.adminComments) {
            setValidDocumentVerification(!!data?.adminComments?.validDocumentVerificationComment);
            setNameAndIdVerification(!!data?.adminComments?.nameAndIdVerificationComment);
            setAmlScreening(!!data?.adminComments?.amlScreeningComment);
            setAdverseMedia(!!data?.adminComments?.adverseMediaComment);
            setOtherComment(!!data?.adminComments?.otherCommentAndNotes);
          }
        }
      }
      // let riskScore = 0;
      // if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.LOW_RISK) {
      //   riskScore = 1;
      // } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.MEDIUM_RISK){
      //   riskScore = 2;
      // } else if (data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.HIGH_RISK){
      //   riskScore = 3;
      // }
      // if (classification && !isNaN(classification) && classification  !== riskScore) {
      //   riskScore = classification;
      // }
      // if (riskScore > 0) {
      //   setDropDownValue(riskScore);
      // }

      setShareHoldersPayload(data?.shareholdersPayload);
      if (data?.kybInfo?.length > 0) {
        setKybInfo(data?.kybInfo[0]);
        setDigiScreeningPayload(data?.digiScreeningPayload);
        setRiskAssessment(data?.riskAssessment);
        setKybBasic({...data?.basic?.[0],representativeName:data?.representative?.[0]?.representativeName});
        setRiskAssessmentPayload(data?.riskAssessmentPayload);
        setRiskAssessmentFormPayload(data?.riskAssessmentFormPayload);
        setShareholderAuthorizationFileList(data?.shareholderDocuments);
        setShareholderRepresentativeFileList(data?.representativeShareholderDocuments);
        setShareholderAddressFileList(data?.shareholderAddressProofDocuments);
      }

      if (data?.kybFATCAPayload && Object.keys(data?.kybFATCAPayload)?.length > 0) {
        setKybFATCAPayload(data?.kybFATCAPayload);
      }
      if (data?.kybFATCAColtrollersPayload?.length > 0) {
        setKybFATCAColtrollersPayload(data?.kybFATCAColtrollersPayload)
      }
      if (data?.representative?.[0]?.isCorporateShareholder) {
        setShareHoldingCompanyDigiScreeningPayload(data?.shareHoldingCompanyDigiScreeningPayload);
        setShareHoldingCompanyDigiScreeningResponse(data?.shareHoldingCompanyDigiScreeningResponse);
      }
    });
  };

  useEffect(() =>{
    setAllCheckboxComments(KYBDetails)
    setClassification(KYBDetails);
    setShareholderCheckBox(KYBDetails)
  }, [activeTab, activeShareholderTab, KYBDetails]);

  
  const approveKYB = (type: string) => {
    setLoading(true);
    const adminCompanyComments = {
      adverseMediaComment: checkboxComment.adverseMedia,
      amlScreeningComment: checkboxComment.amlScreening,
      nameAndIdVerificationComment: checkboxComment.nameAndIdVerification,
      PoliticallyExposedPersonComment:
        checkboxComment?.PoliticallyExposedPersonComment,
      validDocumentVerificationComment:
        checkboxComment.validDocumentVerification,
        otherCommentAndNotes:checkboxComment.otherCommentAndNotes,
    }
    const approverCompanyComments = {
      adverseMediaComment: checkboxCommentApprover.adverseMedia,
      amlScreeningComment: checkboxCommentApprover.amlScreening,
      nameAndIdVerificationComment:
        checkboxCommentApprover.nameAndIdVerification,
      validDocumentVerificationComment:
        checkboxCommentApprover.validDocumentVerification,
      PoliticallyExposedPersonComment:
        checkboxCommentApprover?.PoliticallyExposedPersonComment,
        otherCommentAndNotes:checkboxCommentApprover.otherCommentAndNotes,
    }
     const adminRepresentativeComments = {
        adverseMediaComment: checkboxCommentRepresentative.adverseMedia,
        amlScreeningComment: checkboxCommentRepresentative.amlScreening,
        nameAndIdVerificationComment: checkboxCommentRepresentative.nameAndIdVerification,
        PoliticallyExposedPersonComment:
          checkboxCommentRepresentative?.PoliticallyExposedPersonComment,
        validDocumentVerificationComment:
          checkboxCommentRepresentative.validDocumentVerification,
          otherCommentAndNotes:checkboxCommentRepresentative.otherCommentAndNotes,
      }
     const approverRepresentativeComments = {
        adverseMediaComment: checkboxCommentApproverRepresentative.adverseMedia,
        amlScreeningComment: checkboxCommentApproverRepresentative.amlScreening,
        nameAndIdVerificationComment:
          checkboxCommentApproverRepresentative.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentApproverRepresentative.validDocumentVerification,
        PoliticallyExposedPersonComment:
          checkboxCommentApproverRepresentative?.PoliticallyExposedPersonComment,
          otherCommentAndNotes:checkboxCommentApproverRepresentative.otherCommentAndNotes,
      }
    const adminShareholderComments = {
        adverseMediaComment: checkboxCommentShareholder.adverseMedia,
        amlScreeningComment: checkboxCommentShareholder.amlScreening,
        nameAndIdVerificationComment: checkboxCommentShareholder.nameAndIdVerification,
        PoliticallyExposedPersonComment:
          checkboxCommentShareholder?.PoliticallyExposedPersonComment,
        validDocumentVerificationComment:
          checkboxCommentShareholder.validDocumentVerification,
          otherCommentAndNotes:checkboxCommentShareholder.otherCommentAndNotes,
      }
     const approverShareholderComments = {
        adverseMediaComment: checkboxCommentApproverShareholder.adverseMedia,
        amlScreeningComment: checkboxCommentApproverShareholder.amlScreening,
        nameAndIdVerificationComment:
          checkboxCommentApproverShareholder.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentApproverShareholder.validDocumentVerification,
        PoliticallyExposedPersonComment:
          checkboxCommentApproverShareholder?.PoliticallyExposedPersonComment,
          otherCommentAndNotes:checkboxCommentApproverShareholder.otherCommentAndNotes,
      }

    const reqBody:any = {
      userAlias: userAlias,
      type: "approved",
      alias: currentUserAlias,
      validDocumentVerification:
        validDocumentVerification === undefined
          ? KYBDetails?.validDocumentVerification === true
            ? true
            : false
          : validDocumentVerification,
      validDocumentVerificationRepresentative: validDocumentVerificationRepresentative === undefined
      ? KYBDetails?.validDocumentVerification === true
        ? true
        : false
      : validDocumentVerificationRepresentative,
      validDocumentVerificationShareholder: validDocumentVerificationShareholder === undefined
      ? KYBDetails?.validDocumentVerification === true
        ? true
        : false
      : validDocumentVerificationShareholder,
      nameAndIdVerification:
        nameAndIdVerification === undefined
          ? KYBDetails?.nameAndIdVerification === true
            ? true
            : false
          : nameAndIdVerification,
      nameAndIdVerificationRepresentative: nameAndIdVerificationRepresentative === undefined
      ? KYBDetails?.nameAndIdVerification === true
        ? true
        : false
      : nameAndIdVerificationRepresentative,
      nameAndIdVerificationShareholder: nameAndIdVerificationShareholder === undefined
      ? KYBDetails?.nameAndIdVerification === true
        ? true
        : false
      : nameAndIdVerificationShareholder,
      amlScreening:
        amlScreening === undefined
          ? KYBDetails?.amlScreening === true
            ? true
            : false
          : amlScreening,
      amlScreeningRepresentative: amlScreeningRepresentative === undefined
      ? KYBDetails?.amlScreening === true
        ? true
        : false
      : amlScreeningRepresentative,
      amlScreeningShareholder: amlScreeningShareholder === undefined
      ? KYBDetails?.amlScreening === true
        ? true
        : false
      : amlScreeningShareholder,
      adverseMedia:
        adverseMedia === undefined
          ? KYBDetails?.adverseMedia === true
            ? true
            : false
          : adverseMedia,
      adverseMediaRepresentative: adverseMediaRepresentative === undefined
      ? KYBDetails?.adverseMedia === true
        ? true
        : false
      : adverseMediaRepresentative,
      adverseMediaShareholder: adverseMediaShareholder === undefined
      ? KYBDetails?.adverseMedia === true
        ? true
        : false
      : adverseMediaShareholder,
      representativeClassification: KYBDetails?.representativeClassification,
      shareholderClassification: KYBDetails?.shareholderClassification,
      clientClassification:KYBDetails?.clientClassification,
      PoliticallyExposedPerson:
        PoliticallyPerson === undefined
          ? KYBDetails?.PoliticallyExposedPerson === true
            ? true
            : false
          : PoliticallyPerson,
      otherComment:
        otherComment === undefined
          ? KYBDetails?.otherComment === true
            ? true
            : false
          : otherComment,
          otherCommentRepresentative: otherCommentRepresentative === undefined
          ? KYBDetails?.otherComment === true
            ? true
            : false
          : otherCommentRepresentative,
          otherCommentShareholder: otherCommentShareholder === undefined
          ? KYBDetails?.otherComment === true
            ? true
            : false
          : otherCommentShareholder,
      // Checkbox textarea values
      adminComments: adminCompanyComments,
      approverComments: approverCompanyComments,
      adminRepresentativeComments: adminRepresentativeComments,
      approverRepresentativeComments: approverRepresentativeComments,
      adminShareholderComments: adminShareholderComments,
      approverShareholderComments: approverShareholderComments,
      trusteeRepresentativeComment: KYBDetails.trusteeRepresentativeComment,
      trusteeShareholderComment: KYBDetails.trusteeShareholderComment,
      trusteeComment: KYBDetails.trusteeComment,
      representativeComment: KYBDetails.representativeComment,
      shareholderComment: KYBDetails.shareholderComment,
      comment: KYBDetails.comment,
      shareholderSortId : activeTab === 'Shareholder' ? activeShareholderTab : null
    };
            
      if (activeTab === 'Representative') {
        if (isApprover) {
          reqBody.trusteeRepresentativeComment = comment;
          if (representativeAsShareholderIndex != null) {
            approverShareholderComments.adverseMediaComment = checkboxCommentApproverRepresentative.adverseMedia;
            approverShareholderComments.amlScreeningComment = checkboxCommentApproverRepresentative.amlScreening;
            approverShareholderComments.nameAndIdVerificationComment = checkboxCommentApproverRepresentative.nameAndIdVerification;
            approverShareholderComments.validDocumentVerificationComment = checkboxCommentApproverRepresentative.validDocumentVerification;
            approverShareholderComments.PoliticallyExposedPersonComment = checkboxCommentApproverRepresentative.PoliticallyExposedPersonComment;
            approverShareholderComments.otherCommentAndNotes = checkboxCommentApproverRepresentative.otherCommentAndNotes;
            reqBody.trusteeShareholderComment = comment;
            reqBody.shareholderSortId = representativeAsShareholderIndex;
          }
        } else {
          reqBody.representativeComment = comment;
          if (representativeAsShareholderIndex != null) { 
            adminShareholderComments.adverseMediaComment = checkboxCommentRepresentative.adverseMedia;
            adminShareholderComments.amlScreeningComment = checkboxCommentRepresentative.amlScreening;
            adminShareholderComments.nameAndIdVerificationComment = checkboxCommentRepresentative.nameAndIdVerification;
            adminShareholderComments.validDocumentVerificationComment = checkboxCommentRepresentative.validDocumentVerification;
            adminShareholderComments.PoliticallyExposedPersonComment = checkboxCommentRepresentative.PoliticallyExposedPersonComment;
            adminShareholderComments.otherCommentAndNotes = checkboxCommentRepresentative.otherCommentAndNotes;
            reqBody.shareholderComment = comment;
            reqBody.shareholderSortId = representativeAsShareholderIndex;
          }
        }
        if (dropDownValue) {
          reqBody.representativeClassification = dropDownValue;
          if (representativeAsShareholderIndex != null) {
            reqBody.shareholderSortId = representativeAsShareholderIndex;
          }
        }
    } else if (activeTab === 'Shareholder') {
      if (isApprover) {
        reqBody.trusteeShareholderComment = comment;
      } else {
        reqBody.shareholderComment = comment;
      }
      if (dropDownValue) {
        reqBody.shareholderClassification = dropDownValue;
      }
    } else {
      if (isApprover) {
        reqBody.trusteeComment = comment;
      } else {
        reqBody.comment = comment;
      }
      if (dropDownValue) {
        reqBody.clientClassification = dropDownValue;
      }
    }
    if (type == "hold") {
      reqBody["type"] = "hold";
      holdKyc(reqBody)
        .then((res: any) => {
          setLoading(false);
          if (res?.status === 201 || res?.status == 200) {
            // setSuccessModal(true);
            handleModalCancel();
            getKybdetails();
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later");
        });
    } else {
      verifyKyb(reqBody)
        .then((res) => {
          setLoading(false);
          if (res.status === 201 || res.status == 200) {
            // setSuccessModal(true);
            setCreateVirtualAccount(true);
            handleModalCancel();
            getKybdetails();
            
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later");
        });
    }
  };
  const isAllChecklistChecked = () => {
    let check = true;
    let representativeCheck:boolean = validDocumentVerificationRepresentative;
    representativeCheck &&= nameAndIdVerificationRepresentative;
    representativeCheck &&= amlScreeningRepresentative;
    representativeCheck &&= adverseMediaRepresentative;
    representativeCheck &&= otherCommentRepresentative;

    const repCondA = checkboxCommentRepresentative?.amlScreening &&
    checkboxCommentRepresentative?.adverseMedia &&
    checkboxCommentRepresentative?.nameAndIdVerification &&
    checkboxCommentRepresentative?.validDocumentVerification &&
    checkboxCommentRepresentative?.otherCommentAndNotes
    const repCondB = checkboxCommentApproverRepresentative?.amlScreening &&
    checkboxCommentApproverRepresentative?.adverseMedia &&
    checkboxCommentApproverRepresentative?.nameAndIdVerification &&
    checkboxCommentApproverRepresentative?.validDocumentVerification &&
    checkboxCommentApproverRepresentative?.otherCommentAndNotes;

    if (isApprover) {
      representativeCheck &&= repCondA || repCondB;
    } else {
      representativeCheck &&= repCondA;
    }

    let shareholderCheck:boolean = validDocumentVerificationShareholder;
    shareholderCheck &&= nameAndIdVerificationShareholder;
    shareholderCheck &&= amlScreeningShareholder;
    shareholderCheck &&= adverseMediaShareholder;
    shareholderCheck &&= otherCommentShareholder;

    const shrCondA = checkboxCommentShareholder?.amlScreening &&
    checkboxCommentShareholder?.adverseMedia &&
    checkboxCommentShareholder?.nameAndIdVerification &&
    checkboxCommentShareholder?.validDocumentVerification &&
    checkboxCommentShareholder?.otherCommentAndNotes;
    const shrCondB = checkboxCommentApproverShareholder?.amlScreening &&
    checkboxCommentApproverShareholder?.adverseMedia &&
    checkboxCommentApproverShareholder?.nameAndIdVerification &&
    checkboxCommentApproverShareholder?.validDocumentVerification &&
    checkboxCommentApproverShareholder?.otherCommentAndNotes

    if (isApprover) {
      shareholderCheck &&= shrCondA || shrCondB;
    } else {
      shareholderCheck &&= shrCondA;
    }
    shareholderCheck &&= isAllShareholderVerified;

    let companyCheck = validDocumentVerification;
    companyCheck &&= nameAndIdVerification;
    companyCheck &&= amlScreening;
    companyCheck &&= adverseMedia;
    companyCheck &&= otherComment;

    const comCondA = checkboxComment?.amlScreening &&
    checkboxComment?.adverseMedia &&
    checkboxComment?.nameAndIdVerification &&
    checkboxComment?.validDocumentVerification &&
    checkboxComment?.otherCommentAndNotes;
    const comCondB = checkboxCommentApprover?.amlScreening &&
    checkboxCommentApprover?.adverseMedia &&
    checkboxCommentApprover?.nameAndIdVerification &&
    checkboxCommentApprover?.validDocumentVerification &&
    checkboxCommentApprover?.otherCommentAndNotes
    if (isApprover) {
      companyCheck &&= comCondA || comCondB;  
    } else {
      companyCheck &&= comCondA;  
    }
    if (activeTab === 'Company') {
      check = representativeCheck && shareholderCheck && companyCheck;     
    } else if (activeTab === 'Shareholder') {
      check = representativeCheck && shareholderCheck;
    } else {
      check = representativeCheck;
    }
    return check;    
  };

  const isAllDocumentApproved = (data:any) => {
    const documentsObj = data?.documents?.[0]
    let isBusinessDocVerified = !!(documentsObj?.businessRegProof?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.businessRegProof?.[0]?.isCompliance === true));
    isBusinessDocVerified &&= !!(!(documentsObj?.vatDoc?.length > 0 )||documentsObj?.vatDoc?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.vatDoc?.[0]?.isCompliance === true));
    isBusinessDocVerified &&= !!(!(documentsObj?.otherDoc?.length > 0) || documentsObj?.otherDoc?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.otherDoc?.[0]?.isCompliance === true));
    let isRepDocVerified = !!(documentsObj?.repDocFront?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.repDocFront?.[0]?.isCompliance === true));
    isRepDocVerified &&= !!(documentsObj?.repDocBack?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.repDocBack?.[0]?.isCompliance === true));
    isRepDocVerified &&= !!(!(documentsObj?.repAddProof?.length > 0) || documentsObj?.repAddProof?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.repAddProof?.[0]?.isCompliance === true));
    isRepDocVerified &&= !!(!(documentsObj?.authorizationDoc?.length > 0) || documentsObj?.authorizationDoc?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.authorizationDoc?.[0]?.isCompliance === true));
    let isShareHolderDocVerified = true;
    // let isShareholdingDocVerified = false;
    if (representativeDetails?.isCorporateShareholder === true) {
      if (activeTab === 'Shareholder' && data?.shareholdersPayload?.[parseInt(activeShareholderTab) - 1]?.CompnayName) { //check if the current share holder is company
        isShareHolderDocVerified &&= !!(documentsObj?.shareHoldingTradeLicenseDoc?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.shareHoldingTradeLicenseDoc?.[0]?.isCompliance === true));
        isShareHolderDocVerified &&= !!(documentsObj?.shareHoldingMoaDoc?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.shareHoldingMoaDoc?.[0]?.isCompliance === true));
        isShareHolderDocVerified &&= !!(documentsObj?.shareHoldingCompanyAddressDoc?.[0]?.status === "VERIFIED" || (isApprover && documentsObj?.shareHoldingCompanyAddressDoc?.[0]?.isCompliance === true));
      }
    }
    if (data?.representative?.[0]?.sharedOwnership || data?.representative?.[0]?.representativeShare > 0) {
      if (data.shareholderDocuments?.length) {
        // isShareHolderDocVerified = true;
        for (let i = 0; i < data.shareholderDocuments.length; i++) {
          if (data.shareholderDocuments[i]) {
            for (const j in data.shareholderDocuments[i]) {
              const tmpKey = j.replace('shareholder_','');
              if (activeShareholderTab === tmpKey) { //check for current shareholder's documents
                const shareholderDocument = data.shareholderDocuments[i]?.[j]?.[0];
                isShareHolderDocVerified &&= !!(shareholderDocument?.status === 'VERIFIED' || (isApprover && shareholderDocument?.isCompliance === true));
              }
            }
          }
        }
        for (let i = 0; i < data.representativeShareholderDocuments?.length; i++) {
          if (data.representativeShareholderDocuments[i]) {
            for (const j in data.representativeShareholderDocuments[i]) {
              const tmpKey = j.replace('representativeShareholderId_','');
              if (activeShareholderTab === tmpKey) { //check for current shareholder's documents
                const repShareholderDocument = data.representativeShareholderDocuments[i]?.[j]?.[0];
                isShareHolderDocVerified &&= !!(repShareholderDocument?.status === 'VERIFIED' || (isApprover && repShareholderDocument?.isCompliance === true));
              }
            }
          }
        }
      }
      if (data.shareholderAddressProofDocuments?.length) {
        for (let i = 0; i < data.shareholderAddressProofDocuments?.length; i++) {
          if (data.shareholderAddressProofDocuments[i]) {
            for (const j in data.shareholderAddressProofDocuments[i]) {
              const tmpKey = j.replace('addressProof_', '');
              if (activeShareholderTab === tmpKey) { //check for current shareholder's documents
                const shareholderAddressDocument = data.shareholderAddressProofDocuments[i]?.[j]?.[0];
                isShareHolderDocVerified &&= !!(shareholderAddressDocument?.status === 'VERIFIED' || (isApprover && shareholderAddressDocument?.isCompliance === true));
              }
            }
          }
        }
      }
    } else {
      isShareHolderDocVerified = true;
    }
    if ( (activeTab != 'Company' || isBusinessDocVerified && isShareHolderDocVerified && isRepDocVerified) 
      && (activeTab != 'Representative'|| isRepDocVerified) 
      && (activeTab != 'Shareholder' ||  (isShareHolderDocVerified  && isRepDocVerified))
    ) {     
      return true;
    } else {
      return false;
    }
  }

  const handleDownload = (url: string, isPDF: any) => {
    if (!url) {
      message.error("Download failed: File URL is missing");
      return;
    }
    try {
      const link = document.createElement("a");
      link.href = url;
    
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

      if (isPDF) {
        link.download = "document.pdf";
      } else {
        link.download = "image.jpg";
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error("Download failed. Please try again.");
      console.error("Download error:", error);
    }
  };
  
  const isVerificationPending = (data?: any) => {
    if (!data) {
      data = KYBDetails
    }
    const repCmts = isApprover ? data?.approverRepresentativeComments : data?.adminRepresentativeComments;
    // const shrCmts = isApprover ? data?.approverShareholderComments : data?.adminShareholderComments;
    let shrCmts:any = {};
    if (isApprover) {
      shrCmts = {
        validDocumentVerificationComment: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'trusteeValidDocumentVerificationComment'),
        nameAndIdVerificationComment: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'trusteeNameAndIdVerificationComment'),
        amlScreeningComment: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'trusteeAmlScreeningComment'),
        adverseMediaComment: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'trusteeAdverseMediaComment'),
        otherCommentAndNotes:getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'trusteeOtherCommentAndNotes'),
      }
    } else {
      shrCmts = {
        validDocumentVerificationComment: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'validDocumentVerificationComment'),
        nameAndIdVerificationComment: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'nameAndIdVerificationComment'),
        amlScreeningComment: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'amlScreeningComment'),
        adverseMediaComment: getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'adverseMediaComment'),
        otherCommentAndNotes:getShareholderComment(data?.shareholdersPayload,activeShareholderTab,'otherCommentAndNotes'),
      }
    }
    const cmts = isApprover ? data?.approverComments : data?.adminComments;
    let crtCmts = cmts;
    let check = true;
    let validDocumentationVerificationCheck = false;
    let nameAndIdVerificationCheck = false;
    let amlScreeningCheck = false;
    let adverseMediaCheck = false;
    let otherCommentCheck = false;
    if (activeTab === 'Representative') {
      crtCmts = repCmts;
      validDocumentationVerificationCheck = !!data.validDocumentVerificationRepresentative;
      nameAndIdVerificationCheck = !!data.nameAndIdVerificationRepresentative;
      amlScreeningCheck = !!data.amlScreeningRepresentative;
      adverseMediaCheck = !!data.adverseMediaRepresentative;
      otherCommentCheck = !!data.otherCommentRepresentative;
    } else if (activeTab === 'Shareholder') {
      crtCmts = shrCmts;
      validDocumentationVerificationCheck = !!shrCmts.validDocumentVerificationComment;
      nameAndIdVerificationCheck = !!shrCmts.nameAndIdVerificationComment;
      amlScreeningCheck = !!shrCmts.amlScreeningComment;
      adverseMediaCheck = !!shrCmts.adverseMediaComment;
      otherCommentCheck = !!shrCmts.otherCommentAndNotes;
      
      // validDocumentationVerificationCheck = !!data.validDocumentVerificationShareholder;
      // nameAndIdVerificationCheck = !!data.nameAndIdVerificationShareholder;
      // amlScreeningCheck = !!data.amlScreeningShareholder;
      // adverseMediaCheck = !!data.adverseMediaShareholder;
      // otherCommentCheck = !!data.otherCommentShareholder;
    } else {
      crtCmts = cmts;
      validDocumentationVerificationCheck = !!data.validDocumentVerification;
      nameAndIdVerificationCheck = !!data.nameAndIdVerification;
      amlScreeningCheck = !!data.amlScreening;
      adverseMediaCheck = !!data.adverseMedia;
      otherCommentCheck = !!data.otherComment;
      check &&= isAllMoaDocApproved;
    }
    if (isApprover) {
      check &&= !!(crtCmts?.validDocumentVerificationComment || validDocumentationVerificationCheck);
      check &&= !!(crtCmts?.nameAndIdVerificationComment || nameAndIdVerificationCheck);
      check &&= !!(crtCmts?.amlScreeningComment || amlScreeningCheck);
      check &&= !!(crtCmts?.adverseMediaComment || adverseMediaCheck);
      check &&= !!(crtCmts?.otherCommentAndNotes || otherCommentCheck);
    } else {
      check &&= !!(crtCmts?.validDocumentVerificationComment && validDocumentationVerificationCheck);
      check &&= !!(crtCmts?.nameAndIdVerificationComment && nameAndIdVerificationCheck);
      check &&= !!(crtCmts?.amlScreeningComment && amlScreeningCheck);
      check &&= !!(crtCmts?.adverseMediaComment && adverseMediaCheck);
      check &&= !!(crtCmts?.otherCommentAndNotes && otherCommentCheck);
    }
    check &&= isAllDocumentApproved(data);
    return !check;
  }

  const rejectKYB = () => {
  
    const rejectAdminCompanyComments = {
        adverseMediaComment: checkboxComment.adverseMedia,
        amlScreeningComment: checkboxComment.amlScreening,
        nameAndIdVerificationComment: checkboxComment.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxComment.validDocumentVerification,
          otherCommentAndNotes:checkboxComment.otherCommentAndNotes,
      }
    const rejectApproverCompanyComments = {
        adverseMediaComment: checkboxCommentApprover.adverseMedia,
        amlScreeningComment: checkboxCommentApprover.amlScreening,
        nameAndIdVerificationComment:
          checkboxCommentApprover.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentApprover.validDocumentVerification,
          otherCommentAndNotes:checkboxCommentApprover?.otherCommentAndNotes,
      }
  
    const rejectAdminRepresentativeComments = {
        adverseMediaComment: checkboxCommentRepresentative.adverseMedia,
        amlScreeningComment: checkboxCommentRepresentative.amlScreening,
        nameAndIdVerificationComment: checkboxCommentRepresentative.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentRepresentative.validDocumentVerification,
          otherCommentAndNotes:checkboxCommentRepresentative.otherCommentAndNotes,
      }
     const rejectApproverRepresentativeComments = {
        adverseMediaComment: checkboxCommentApproverRepresentative.adverseMedia,
        amlScreeningComment: checkboxCommentApproverRepresentative.amlScreening,
        nameAndIdVerificationComment:
          checkboxCommentApproverRepresentative.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentApproverRepresentative.validDocumentVerification,
          otherCommentAndNotes:checkboxCommentApproverRepresentative?.otherCommentAndNotes,
      }

     const rejectAdminShareholderComments = {
        adverseMediaComment: checkboxCommentShareholder.adverseMedia,
        amlScreeningComment: checkboxCommentShareholder.amlScreening,
        nameAndIdVerificationComment: checkboxCommentShareholder.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentShareholder.validDocumentVerification,
          otherCommentAndNotes:checkboxCommentShareholder.otherCommentAndNotes,
      }
     const rejectApproverShareholderComments = {
        adverseMediaComment: checkboxCommentApproverShareholder.adverseMedia,
        amlScreeningComment: checkboxCommentApproverShareholder.amlScreening,
        nameAndIdVerificationComment:
          checkboxCommentApproverShareholder.nameAndIdVerification,
        validDocumentVerificationComment:
          checkboxCommentApproverShareholder.validDocumentVerification,
          otherCommentAndNotes:checkboxCommentApproverShareholder?.otherCommentAndNotes,
      }
      
    setLoading(true);
    const reqBody:any = {
      userAlias: userAlias,
      rejectedReason: comment,
      representativeClassification: KYBDetails.representativeClassification,
      shareholderClassification: KYBDetails.shareholderClassification,
      clientClassification: KYBDetails.clientClassification,
      type: "rejected",
      userType: userType,
      alias: currentUserAlias,
      validDocumentVerification:
        validDocumentVerification === undefined
          ? KYBDetails?.validDocumentVerification === true
            ? true
            : false
          : validDocumentVerification,
          validDocumentVerificationRepresentative: validDocumentVerificationRepresentative === undefined
          ? KYBDetails?.validDocumentVerification === true
            ? true
            : false
          : validDocumentVerificationRepresentative,
          validDocumentVerificationShareholder: validDocumentVerificationShareholder === undefined
          ? KYBDetails?.validDocumentVerification === true
            ? true
            : false
          : validDocumentVerificationShareholder,
      nameAndIdVerification:
        nameAndIdVerification === undefined
          ? KYBDetails?.nameAndIdVerification === true
            ? true
            : false
          : nameAndIdVerification,
          nameAndIdVerificationRepresentative: nameAndIdVerificationRepresentative === undefined
          ? KYBDetails?.nameAndIdVerification === true
            ? true
            : false
          : nameAndIdVerificationRepresentative,
          nameAndIdVerificationShareholder: nameAndIdVerificationShareholder === undefined
          ? KYBDetails?.nameAndIdVerification === true
            ? true
            : false
          : nameAndIdVerificationShareholder,
      amlScreening:
        amlScreening === undefined
          ? KYBDetails?.amlScreening === true
            ? true
            : false
          : amlScreening,
          amlScreeningRepresentative: amlScreeningRepresentative === undefined
          ? KYBDetails?.amlScreening === true
            ? true
            : false
          : amlScreeningRepresentative,
          amlScreeningShareholder: amlScreeningShareholder === undefined
          ? KYBDetails?.amlScreening === true
            ? true
            : false
          : amlScreeningShareholder,
      adverseMedia:
        adverseMedia === undefined
          ? KYBDetails?.adverseMedia === true
            ? true
            : false
          : adverseMedia,
          adverseMediaRepresentative: adverseMediaRepresentative === undefined
          ? KYBDetails?.adverseMedia === true
            ? true
            : false
          : adverseMediaRepresentative,
          adverseMediaShareholder: adverseMediaShareholder === undefined
          ? KYBDetails?.adverseMedia === true
            ? true
            : false
          : adverseMediaShareholder,
      PoliticallyExposedPerson:
        PoliticallyPerson === undefined
          ? KYBDetails?.PoliticallyExposedPerson === true
            ? true
            : false
          : PoliticallyPerson,

          otherComment:
          otherComment === undefined
            ? KYBDetails?.otherComment === true
              ? true
              : false
            : otherComment,
            otherCommentRepresentative: otherCommentRepresentative === undefined
            ? KYBDetails?.otherComment === true
              ? true
              : false
            : otherCommentRepresentative,
            otherCommentShareholder: otherCommentShareholder === undefined
            ? KYBDetails?.otherComment === true
              ? true
              : false
            : otherCommentShareholder,
      // Checkbox textarea values
      adminComments: rejectAdminCompanyComments,
      approverComments: rejectApproverCompanyComments,
      adminRepresentativeComments: rejectAdminRepresentativeComments,
      approverRepresentativeComments: rejectApproverRepresentativeComments,
      adminShareholderComments: rejectAdminShareholderComments,
      approverShareholderComments: rejectApproverShareholderComments,
      trusteeRepresentativeComment: KYBDetails.trusteeRepresentativeComment,
      trusteeShareholderComment: KYBDetails.trusteeShareholderComment,
      trusteeComment: KYBDetails.trusteeComment,
      representativeComment: KYBDetails.representativeComment,
      shareholderComment: KYBDetails.shareholderComment,
      comment: KYBDetails.comment,
      shareholderSortId : activeTab === 'Shareholder' ? activeShareholderTab : null
    };

    if (activeTab === 'Representative') {
      if (isApprover) {
        reqBody.trusteeRepresentativeComment = comment;
        if (representativeAsShareholderIndex != null) {
          rejectApproverShareholderComments.adverseMediaComment = checkboxCommentApproverRepresentative.adverseMedia;
          rejectApproverShareholderComments.amlScreeningComment = checkboxCommentApproverRepresentative.amlScreening;
          rejectApproverShareholderComments.nameAndIdVerificationComment = checkboxCommentApproverRepresentative.nameAndIdVerification;
          rejectApproverShareholderComments.validDocumentVerificationComment = checkboxCommentApproverRepresentative.validDocumentVerification;
          rejectApproverShareholderComments.otherCommentAndNotes = checkboxCommentApproverRepresentative.otherCommentAndNotes;
          reqBody.trusteeShareholderComment = comment;
        }

      } else {
        reqBody.representativeComment = comment;
        if (representativeAsShareholderIndex != null) {
          rejectAdminRepresentativeComments.adverseMediaComment = checkboxCommentRepresentative.adverseMedia;
          rejectAdminRepresentativeComments.amlScreeningComment = checkboxCommentRepresentative.amlScreening;
          rejectAdminRepresentativeComments.nameAndIdVerificationComment = checkboxCommentRepresentative.nameAndIdVerification;
          rejectAdminRepresentativeComments.validDocumentVerificationComment = checkboxCommentRepresentative.validDocumentVerification;
          rejectAdminRepresentativeComments.otherCommentAndNotes = checkboxCommentRepresentative.otherCommentAndNotes;
          reqBody.shareholderComment = comment;
        }        
      }
      if (dropDownValue) {
        reqBody.representativeClassification = dropDownValue;
        if (representativeAsShareholderIndex != null) {
          reqBody.shareholderSortId = representativeAsShareholderIndex;
        }
      }
   } else if (activeTab === 'Shareholder') {
      if (isApprover) {
        reqBody.trusteeShareholderComment = comment;
      } else {
        reqBody.shareholderComment = comment;
      }
      if (dropDownValue) {
        reqBody.shareholderClassification = dropDownValue;
      }
    } else {
      if (isApprover) {
        reqBody.trusteeComment = comment;
      } else {
        reqBody.comment = comment;
      }
      if (dropDownValue) {
        reqBody.clientClassification = dropDownValue;
      }
    }
    verifyKyb(reqBody)
      .then((res) => {
        setLoading(false);
        if (res.status === 201 || res.status == 200) {
          handleModalCancel();
          getKybdetails();
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
    setHoldModal(false);
    form.resetFields();
    setCreateVirtualAccountModal(false);
    frmEscrow.resetFields();
    formDocumentApprove.resetFields();
    formDocumentReject.resetFields();
    formApproveKYB.resetFields();
    formRejectKYB.resetFields();
    formHoldKYB.resetFields();
    setComment("");
    setCommentModalKey("");
  };
  
  const handleReject = async () => {
    const obj = {
      userAlias: userAlias,
      [CommentModalData]: false,
      key:CommentModalKey,
      [['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? 'reason' : 'approverReason']: comment,
      alias: currentUserAlias,
      isRejected: true,
    };
    const resp = await verifyKybDocument(obj);
    if (resp.status === 200 || resp.status === 201) {
      if(representativeAsShareholderIndex != null) {
        if(isRepresentativeFront && shareholderAuthorizationFileList?.length > 0) {
          await verifyKybDocument({
            userAlias: userAlias,
            shareholderAuthorizationDocStatus: false,
            key: `shareholder_${representativeAsShareholderIndex}`,
            [['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? 'reason' : 'approverReason']: comment,
            alias: currentUserAlias,
            isRejected: true
          });
          setIsRepresentativeFront(false);
          
        } else if(isRepresentativeBack && shareholderRepresentativeFileList?.length > 0) {
          await verifyKybDocument({
            userAlias: userAlias,
            representativeShareholderIdStatus: false,
            key: `representativeShareholderId_${representativeAsShareholderIndex}`,
            [['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? 'reason' : 'approverReason']: comment,
            alias: currentUserAlias,
            isRejected: true
          });
          setIsRepresentativeBack(false);
        } else if(isRepresentativeAddress && shareholderAddressFileList?.length > 0) {
          await verifyKybDocument({
            userAlias: userAlias,
            shareholderAddressProofIdStatus: false,
            key:KYBDetails?.shareholderAddressProofDoc[`addressProof_${representativeAsShareholderIndex}`],
            [['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? 'reason' : 'approverReason']: comment,
            alias: currentUserAlias,
            isRejected: true
          });
          setIsRepresentativeAddress(false);
        }
      }
      handleModalCancel();
      getKybdetails("upload");
    }
  };
  

  const handleApprove = async () => {
    try {
      const obj = {
        userAlias: userAlias,
        [CommentModalData]: true,
        key:CommentModalKey,
        [['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? 'reason' : 'approverReason']: comment,
        alias: currentUserAlias,
      };

      const resp = await verifyKybDocument(obj);
      if (resp.status === 200 || resp.status === 201) {
        if(representativeAsShareholderIndex != null) {
          if(isRepresentativeFront) {
            await verifyKybDocument({
              userAlias: userAlias,
              shareholderAuthorizationDocStatus: true,
              key: `shareholder_${representativeAsShareholderIndex}`,
              [['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? 'reason' : 'approverReason']: comment,
              alias: currentUserAlias
            });
            setIsRepresentativeFront(false);
            
          } else if(isRepresentativeBack) {
            await verifyKybDocument({
              userAlias: userAlias,
              representativeShareholderIdStatus: true,
              key: `representativeShareholderId_${representativeAsShareholderIndex}`,
              [['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? 'reason' : 'approverReason']: comment,
              alias: currentUserAlias
            });
            setIsRepresentativeBack(false);
          } else if(isRepresentativeAddress) {
            await verifyKybDocument({
              userAlias: userAlias,
              shareholderAddressProofIdStatus: true,
              key:KYBDetails?.shareholderAddressProofDoc[`addressProof_${representativeAsShareholderIndex}`],
              [['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? 'reason' : 'approverReason']: comment,
              alias: currentUserAlias
            });
            setIsRepresentativeAddress(false);
          }
        }
        handleModalCancel();
        getKybdetails("upload");
      }
    }catch(error){
      console.log("error",error);
      message.error("Something went wrong. Please try again.");
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
        if(activeTab === "Company"){
          setValidDocumentVerification(true);
        }
        if(activeTab === "Representative"){
          setValidDocumentVerificationRepresentative(true);
        }
        if(activeTab === "Shareholder"){
          setValidDocumentVerificationShareholder(true);
        }
        break;
      case "nameAndIdVerification":
         if(activeTab === "Company"){
          setNameAndIdVerification(true);
        }
        if(activeTab === "Representative"){
          setNameAndIdVerificationRepresentative(true);
        }
        if(activeTab === "Shareholder"){
          setNameAndIdVerificationShareholder(true);
        }
        break;
      case "amlScreening":
         if(activeTab === "Company"){
          setAmlScreening(true)
        }
        if(activeTab === "Representative"){
          setAmlScreeningRepresentative(true);
        }
        if(activeTab === "Shareholder"){
          setAmlScreeningShareholder(true);
        }
        break;
      case "adverseMedia":
        if(activeTab === "Company"){
          setAdverseMedia(true)
        }
        if(activeTab === "Representative"){
          setAdverseMediaRepresentative(true);
        }
        if(activeTab === "Shareholder"){
          setAdverseMediaShareholder(true);
        }
        break;
      case "otherCommentAndNotes":
        if(activeTab === "Company"){
          setOtherComment(true)
        }
        if(activeTab === "Representative"){
          setOtherCommentRepresentative(true);
        }
        if(activeTab === "Shareholder"){
          setOtherCommentShareholder(true);
        }
        break;
                    
      default:
        break;
    }
  }
  const updateComment = (id: any, event:any) => {
    if(['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType)) {      
      if(activeTab === "Company"){
        const comments = { ...checkboxComment };
        comments[id] = event?.target?.value;
        setCheckboxComment(comments);
        checkCommentsCheckbox(id);
      } else if(activeTab === "Representative"){
        const commentsRep = { ...checkboxCommentRepresentative };
        commentsRep[id] = event?.target?.value;
        setCheckboxCommentRepresentative(commentsRep);
        checkCommentsCheckbox(id);
      } else if(activeTab === "Shareholder"){
        const commentsShare = { ...checkboxCommentShareholder };
        commentsShare[id] = event?.target?.value;
        setCheckboxCommentShareholder(commentsShare);
        checkCommentsCheckbox(id);
      }
    }
  };
  const updateApproverComment = (id: string, value: string) => {
    if(isApprover){    
      if(activeTab === "Company"){
        const comments = { ...checkboxCommentApprover };
        comments[id] = value;
        setCheckboxCommentApprover(comments);
        checkCommentsCheckbox(id)
      } else if(activeTab === "Representative"){
        const commentsApRep = { ...checkboxCommentApproverRepresentative };
        commentsApRep[id] = value;
        setCheckboxCommentApproverRepresentative(commentsApRep);
        checkCommentsCheckbox(id);
      } else if(activeTab === "Shareholder"){
        const commentsApShare = { ...checkboxCommentApproverShareholder };
        commentsApShare[id] = value;
        setCheckboxCommentApproverShareholder(commentsApShare);
        checkCommentsCheckbox(id);
      }
    }
  };
  // const handleInput = (e:any) => {
  //   const regex = /^[A-Za-z,.\- ]*$/; 
  //   const currentValue = e.target.value;
  //   if (!regex.test(currentValue)) {
  //     e.preventDefault();
  //     e.target.value = currentValue.slice(0, -1); 
  //   } 
  //   // else {
  //   //   updateComment("validDocumentVerification", currentValue);
  //   // }
  // };

  const handleDropdownChange = (e: any) => {
    setDropDownValue(e.target.value);
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
    navigate(KYBManagementList);
  };

  const getRiskConfigurationDetails = async() => {
    setLoading(true);
   await getRiskConfiguration({ RiskCategory: "C" })
      .then((response) => {
        if (response?.data?.status === 201 || response?.data?.status === 200) {
          setLoading(false);
          setRiskDetails(response?.data?.result);
          if (response?.data?.result && response?.data?.result?.length) {
            const result = response?.data?.result
            const graphicRiskIndex = result.findIndex((d:any) => d.riskCategory == 'Geographic Risk')
            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes']?.map((r:any) => {
                if (r?.riskType == 'Is any of the above country subject to increased monitoring by FATF') {
                  setFatfTypeId(r?.id)
                  setFatfList(r?.riskItems || [])
                }
                if (r?.riskType == 'Nationality Partner 1') {
                  setCountryList(r?.riskItems || []);
                }
                if (r?.riskType == 'Country of Incorporation') {
                  // setCountryofIncorporationTypeId(r?.id)
                  setCountryofIncorporationTypeList(r?.riskItems || [])
                }
              })
            }
            return result
          }
        }
      }).catch((error) => {
        setLoading(false);
        message.error(error?.error?.message ? error?.error?.message : "Something went wrong");
      });
  }

  const handleRiskClassificationSubmit = async () => {
    try {
      setLoading(true);
      const reqBody:any = {
        userAlias: userAlias,
        userType: userType,
        alias: currentUserAlias,
        shareholderSortId: activeTab === 'Shareholder' ? activeShareholderTab : null
      };
      if (activeTab === 'Representative') {
        reqBody.representativeComment = comment;
        reqBody.representativeClassification = dropDownValue;
      } else if (activeTab === 'Shareholder') {
        reqBody.shareholderComment = comment;
        reqBody.shareholderClassification = dropDownValue;
      } else {
        reqBody.comment = comment;
        reqBody.clientClassification = dropDownValue;
      }
      const res = await updateKybKycRiskClassification(reqBody);

      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        handleModalCancel();
        getKybdetails();
        message.success(res?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      message.error("Oops! Something went wrong. Please try again later");
    }
  }
  
  const findObjectByKey = (arr: any, key: string) => {
    return arr.find((obj: any) => key in obj) || {};
  }
  const generateDynamicKey = (key: string, keyNumber: string) => {
    return `${key}${keyNumber}`;
  }

  const renderMultipleJurisdictionRows = () => {
    const rows = [];
    for (let i = 0; i < parseInt(kybFATCAPayload?.kybNumberOfCountry ?? 0); i++) {
      rows.push(
        <>
          <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
            <Col>
              <Space direction="vertical">
                <Text type="secondary">
                  <b>Please let us know your other jurisdiction if any.</b>
                </Text>
                <Text>
                  <b>
                    {toTitleCase( kybFATCAPayload?.[`anotherjurisdictionCountry_${i}`]) ?? '---'}
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
                    {toTitleCase(kybFATCAPayload?.[`hasMultipleKybTIN_${i}`]) ?? '---'}
                  </b>
                </Text>
              </Space>
            </Col>
          </Row>
          {kybFATCAPayload?.[`hasMultipleKybTIN_${i}`] === 'yes' && (
            <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary">
                    <b>Tax identification number</b>
                  </Text>
                  <Text>
                    <b>
                      {kybFATCAPayload?.[`multipleKybTinNo_${i}`] ?? '---'}
                    </b>
                  </Text>
                </Space>
              </Col>
            </Row>
          )}
          {kybFATCAPayload?.[`hasMultipleKybTIN_${i}`] === 'no' && (
            <Row key={i} className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary">
                    <b>Reason for no TIN Number</b>
                  </Text>
                  <Text>
                    <b>
                      {kybFATCAPayload?.[`multipleKybNoTinReason_${i}`] === "countryNotissueTINs"
                        ? "Country/ Jurisdiction does not issue TINs." : kybFATCAPayload?.[`multipleKybNoTinReason_${i}`] === "countryNotRequirToProvideTIN"
                          ? "Country/ Jurisdiction does not require me to provide TIN." : kybFATCAPayload?.[`multipleKybNoTinReason_${i}`] === "unableToObtainTIN"
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


  const onTabChange = (key: string) => {    
    setActiveTab(key);
  };
   

  const onShareholderTabChange = (key: string) => {
    setActiveShareholderTab(key);
  }
  
  const repDocType = DOCUMENT_TYPE[
    KYBDetails?.documents?.[0]?.repDocType
  ] ?? 'Emirates ID'

  const verificationPendingCheck = isVerificationPending(KYBDetails);
  
  const items: any['items'] = [
    {
      key: 'Representative', 
      label: 'Representative details',
      children: (
      <>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="endtoend">
          <Col xs={24} sm={24} md={24} lg={24} className="bg-admin-card-col8 kyb-business-details-card">
            <Card className="p-4 h-100">
              {" "}
              <div>
                <div className="titleText fs-3 my-4">Representative details</div>
                <div className="titleText">
                  {KYBDetails?.representative?.[0]?.representativeName}
                </div>
                <div className="subtext kyb-business-subtext mt-3 ">
                  {
                    COMPANY_ROLE[
                    KYBDetails?.representative?.[0]?.roleType
                    ]
                  }
                </div>
              </div>
              <hr className=" subText mt-4" />
              <div className="card-items row mb-3 row-gap-2">
                <div className="col-sm-6 col-lg-6 col-xl-3">
                  <div className={`subtext align-items-start ${KYBDetails?.basic?.[0]?.email?.length * 7 > 200 ? 'overflowText-bankDetails' : ""}`}>
                    <Image src={Email} alt="email" preview={false}  className="representative-email-icon"/>
                    <Tooltip
                      title={KYBDetails?.basic?.[0]?.email?.length * 7 > 200 ? KYBDetails?.basic?.[0]?.email : null}
                      overlayClassName="custom-tooltip"
                      placement="topLeft"
                    >
                      <span className="ml-4">
                        {KYBDetails?.basic?.[0]?.email || "-"}
                      </span>
                    </Tooltip>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-6 col-xl-3">
                  <div className="subtext d-flex align-items-start">
                    <Image src={Globe_dark} alt="country" preview={false} />
                    <span className="mx-2">
                      {KYBDetails?.basic?.[0]?.countryName ?? KYBDetails?.basic?.[0]?.country}
                    </span>
                    <div className="mx-2">
                      {/* <div className="flag px-1">
                        <Image className="d-flex"
                          src={Flag}
                          preview={false}
                          height={12}
                          width={22}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-6 col-xl-3">
                  <div className="subtext d-flex align-items-start">
                    <Image src={Phone_Dark} alt="phone" preview={false} />
                    <span className="ml-4 overflowText">
                      {KYBDetails?.basic?.[0]?.contactNumber}
                    </span>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-6 col-xl-3">
                  <div className="subtext d-flex">
                    <Image src={CompanyIcon} alt="type" preview={false} />
                    <span className="ml-4 overflowText">
                      {ENTITY_TYPE[KYBDetails?.basic?.[0]?.typeOfEntity]}
                    </span>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-6 col-xl-3">
                  <div className="subtext">
                    {/* <Image src={CompanyIcon} alt="type" preview={false} /> */}
                    Shareholding percentage
                    <span className="ml-4">
                      <b>
                    {KYBDetails?.representative?.[0]?.representativeShare}%
                    </b>
                    </span>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-6 col-xl-3">
                  Do you own or control 25% or more of the business?{" "}
                  <span className="mx-2 cursor">
                    <b>
                      {" "}
                      {KYBDetails?.representative?.[0]?.sharedOwnership
                        ? "Yes"
                        : "No"}
                    </b>
                  </span>
                </div>
              </div>
              <div className="subText_medium border-left mt-4">
                <b>Representative</b>
              </div>
              {KYBDetails?.documentAccuracyPercentage > 0 && (
                  <>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center justify-content-between">
                      <Col xs={24} sm={24} md={12} lg={8}>
                        <Space className="d-flex flex-wrap">
                          <Text type="secondary"> <b>Document accuracy percentage as per OCR</b></Text>
                          <Text className="doc-accuracy-percentage"> <b>{KYBDetails?.documentAccuracyPercentage ? Math.round(KYBDetails?.documentAccuracyPercentage) + "%" : "---"}</b> </Text>
                        </Space>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={8}>
                        <Space className="d-flex flex-wrap">
                          <Text type="secondary"> <b>ID Number</b></Text>
                          <Text > <b>{KYBDetails?.representative?.[0]?.repDocNumber ? KYBDetails?.representative?.[0]?.repDocNumber : "---"}</b> </Text>
                        </Space>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={8}>
                        <Space className="d-flex flex-wrap">
                          <Text type="secondary"> <b>ID Expiry Date</b></Text>
                          <Text > <b>{KYBDetails?.representative?.[0]?.repExpiryDate ? dayjs.utc(KYBDetails?.representative?.[0]?.repExpiryDate).format('DD-MM-YYYY') : "---"}</b> </Text>
                        </Space>
                      </Col>
                    </Row>
                  </>
                )}  
              <Row gutter={20}>
                {KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url ? (
                  <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                    <div className="afterApproveCard">
                      {KYBDetails?.documents?.[0]?.repDocFront?.[0]
                        ?.isCompliance != null ||
                        ['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.repDocFront?.[0]?.status)? (
                        <Tabs
                          defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                          className="d-none-res "
                        >
                          {KYBDetails?.documents?.[0]?.repDocFront?.[0]
                            ?.isCompliance != null ? (
                            <TabPane tab={`Approver`} key="approver">
                              {KYBDetails?.documents?.[0]?.repDocFront?.[0]
                                ?.isCompliance == null ? (
                                <div>
                                  <Card
                                    className=" kybcard"
                                    cover={
                                      KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url.includes(
                                        ".pdf"
                                      ) ? (
                                        // <embed
                                        //   onClick={() =>
                                        //     window.open(
                                        //       KYBDetails?.documents?.[0]
                                        //         ?.repDocFront?.[0]?.url,
                                        //       "_blank",
                                        //       "rel=noopener noreferrer"
                                        //     )
                                        //   }
                                        //   className="w-100 cursor h-175"
                                        //   src={
                                        //     KYBDetails?.documents?.[0]
                                        //       ?.repDocFront?.[0]?.url
                                        //   }
                                        // />
                                        <>
                                          <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repDocFront[0].url) }}>
                                            <PDFPreview
                                              url={KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url || ''}
                                              onPreviewClick={handlePDFView}
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <Image
                                          alt="example"
                                          src={
                                            KYBDetails?.documents?.[0]
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
                                          {repDocType + " front"}
                                          <Tooltip
                                            title={'Download'}
                                            overlayClassName='custom-tooltip'
                                            placement="left"
                                          >
                                            <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url && handleDownload(KYBDetails.documents[0].repDocFront[0].url,KYBDetails.documents[0].repDocFront[0].url.includes(".pdf"))} >
                                              <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                            </div>
                                          </Tooltip>
                                        </div>
                                        </>
                                      } 
                                    />
                                  </Card>

                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle(
                                        repDocType + " front"
                                      );
                                      setCommentModal(true);
                                      setCommentModalData("repDocFrontStatus");
                                      setIsRepresentativeFront(true);
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle(
                                        repDocType + " front"
                                      );
                                      SetCommentModalReject(true);
                                      setCommentModalData("repDocFrontStatus");
                                      setIsRepresentativeFront(true);
                                    }}
                                  />
                                </div>
                              ) : (
                                <ApproverDetails
                                  modalTitle={
                                   repDocType + " front"
                                  }
                                  approverDetails={
                                    KYBDetails?.documents?.[0]?.repDocFront?.[0]
                                  }
                                  uploadedFile={
                                    KYBDetails?.documents?.[0]?.repDocFront?.[0]
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
                            { !['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.repDocFront?.[0]
                              ?.status) ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      // <embed
                                      //   onClick={() =>
                                      //     window.open(
                                      //       KYBDetails?.documents?.[0]
                                      //         ?.repDocFront?.[0]?.url,
                                      //       "_blank",
                                      //       "rel=noopener noreferrer"
                                      //     )
                                      //   }
                                      //   className="w-100 cursor h-175"
                                      //   src={
                                      //     KYBDetails?.documents?.[0]
                                      //       ?.repDocFront?.[0]?.url
                                      //   }
                                      // />
                                      <>
                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repDocFront[0].url) }}>
                                          <PDFPreview
                                            url={KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url || ''}
                                            onPreviewClick={handlePDFView}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
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
                                        {repDocType + " front"} 
                                        <Tooltip
                                          title={'Download'}
                                          overlayClassName='custom-tooltip'
                                          placement="left"
                                        >
                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url && handleDownload(KYBDetails.documents[0].repDocFront[0].url,KYBDetails.documents[0].repDocFront[0].url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                      </>
                                    } 
                                  />
                                </Card>
                                {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                  <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle(
                                       repDocType + " front"  
                                    );
                                    setIsRepresentativeFront(true);
                                    setCommentModal(true);
                                    setCommentModalData("repDocFrontStatus");
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  onClick={() => {
                                    setModalTitle(
                                      repDocType + " front"
                                    );
                                    setIsRepresentativeFront(true);
                                    SetCommentModalReject(true);
                                    setCommentModalData("repDocFrontStatus");
                                  }}
                                />
                                </>)}
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle={
                                  repDocType + " front"
                                }
                                approverDetails={
                                  KYBDetails?.documents?.[0]?.repDocFront?.[0]
                                }
                                uploadedFile={
                                  KYBDetails?.documents?.[0]?.repDocFront?.[0]
                                    ?.url
                                }
                                tab="admin"
                              />
                            )}
                          </TabPane>
                        </Tabs>
                      ) : KYBDetails?.documents?.[0]?.repDocFront?.[0]
                        ?.status != "VERIFIED" &&
                        KYBDetails?.documents?.[0]?.repDocFront?.[0]?.status !=
                        "REJECTED" ? (
                        <div className="afterApproveCard-img-card">
                          <Card
                            className=" kybcard"
                            cover={
                              KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url.includes(
                                ".pdf"
                              ) ? (
                                // <embed
                                //   onClick={() =>
                                //     window.open(
                                //       KYBDetails?.documents?.[0]
                                //         ?.repDocFront?.[0]?.url,
                                //       "_blank",
                                //       "rel=noopener noreferrer"
                                //     )
                                //   }
                                //   className="w-100 cursor h-175"
                                //   src={
                                //     KYBDetails?.documents?.[0]?.repDocFront?.[0]
                                //       ?.url
                                //   }
                                // />
                                <>
                                  <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repDocFront[0].url) }}>
                                  <PDFPreview
                                    url={KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url || ''}
                                    onPreviewClick={handlePDFView}
                                  />
                                  </div>
                                </>
                              ) : (
                                <Image
                                  alt="example"
                                  src={
                                    KYBDetails?.documents?.[0]?.repDocFront?.[0]
                                      ?.url
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
                                  {repDocType + " front"}
                                  <Tooltip
                                    title={'Download'}
                                    overlayClassName='custom-tooltip'
                                    placement="left"
                                  >
                                    <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url && handleDownload(KYBDetails.documents[0].repDocFront[0].url,KYBDetails.documents[0].repDocFront[0].url.includes(".pdf"))} >
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
                               repDocType + " front"
                              );
                              setCommentModal(true);
                              setCommentModalData("repDocFrontStatus");
                              setIsRepresentativeFront(true);
                            }}
                          />
                          <PrimaryOutLineButton
                            children="Reject"
                            className="mt-4 mx-3"
                            onClick={() => {
                              setModalTitle(
                                repDocType + " front"
                              );
                              SetCommentModalReject(true);
                              setCommentModalData("repDocFrontStatus");
                              setIsRepresentativeFront(true);
                            }}
                          />
                          </div>
                        </div>
                      ) : (
                        <ApproverDetails
                          modalTitle={
                          repDocType + " front"
                          }
                          approverDetails={
                            KYBDetails?.documents?.[0]?.repDocFront?.[0]
                          }
                          uploadedFile={
                            KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url
                          }
                          tab="admin"
                        />
                      )}
                    </div>
                  </Col>
                ) : null}
                {KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url ? (
                  <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                    <div className="afterApproveCard">
                      {KYBDetails?.documents?.[0]?.repDocBack?.[0]
                        ?.isCompliance != null ||
                        ['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.repDocBack?.[0]?.status)? (
                        <Tabs
                          defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                          className="d-none-res "
                        >
                          {KYBDetails?.documents?.[0]?.repDocBack?.[0]
                            ?.isCompliance != null ? (
                            <TabPane tab={`Approver`} key="approver">
                              {KYBDetails?.documents?.[0]?.repDocBack?.[0]
                                ?.isCompliance == null ? (
                                <div>
                                  <Card
                                    className=" kybcard"
                                    cover={
                                      KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url.includes(
                                        ".pdf"
                                      ) ? (
                                        // <embed
                                        //   onClick={() =>
                                        //     window.open(
                                        //       KYBDetails?.documents?.[0]
                                        //         ?.repDocBack?.[0]?.url,
                                        //       "_blank",
                                        //       "rel=noopener noreferrer"
                                        //     )
                                        //   }
                                        //   className="w-100 cursor h-175"
                                        //   src={
                                        //     KYBDetails?.documents?.[0]
                                        //       ?.repDocBack?.[0]?.url
                                        //   }
                                        // />
                                        <>
                                          <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repDocBack[0].url) }}>
                                            <PDFPreview
                                              url={KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url || ''}
                                              onPreviewClick={handlePDFView}
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <Image
                                          alt="example"
                                          src={
                                            KYBDetails?.documents?.[0]
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
                                          {repDocType + " back"}
                                          <Tooltip
                                            title={'Download'}
                                            overlayClassName='custom-tooltip'
                                            placement="left"
                                          >
                                            <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url && handleDownload(KYBDetails.documents[0].repDocBack[0].url,KYBDetails.documents[0].repDocBack[0].url.includes(".pdf"))} >
                                              <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                            </div>
                                          </Tooltip>
                                        </div>
                                        </>
                                      } 
                                    />
                                  </Card>
                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle(
                                        repDocType + " back"
                                      );
                                      setCommentModal(true);
                                      setCommentModalData("repDocBackStatus");
                                      setIsRepresentativeBack(true);
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle(
                                        repDocType + " back"
                                      );
                                      SetCommentModalReject(true);
                                      setCommentModalData("repDocBackStatus");
                                      setIsRepresentativeBack(true);
                                    }}
                                  />
                                </div>
                              ) : (
                                <ApproverDetails
                                  modalTitle={
                                  repDocType + " back"
                                  }
                                  approverDetails={
                                    KYBDetails?.documents?.[0]?.repDocBack?.[0]
                                  }
                                  uploadedFile={
                                    KYBDetails?.documents?.[0]?.repDocBack?.[0]
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
                            {
                              !['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.repDocBack?.[0]
                                ?.status) ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      // <embed
                                      //   onClick={() =>
                                      //     window.open(
                                      //       KYBDetails?.documents?.[0]
                                      //         ?.repDocBack?.[0]?.url,
                                      //       "_blank",
                                      //       "rel=noopener noreferrer"
                                      //     )
                                      //   }
                                      //   className="w-100 cursor h-175"
                                      //   src={
                                      //     KYBDetails?.documents?.[0]
                                      //       ?.repDocBack?.[0]?.url
                                      //   }
                                      // />
                                      <>
                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repDocBack[0].url) }}>
                                          <PDFPreview
                                            url={KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url || ''}
                                            onPreviewClick={handlePDFView}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
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
                                        {repDocType + " back"}
                                        <Tooltip
                                          title={'Download'}
                                          overlayClassName='custom-tooltip'
                                          placement="left"
                                        >
                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url && handleDownload(KYBDetails.documents[0].repDocBack[0].url,KYBDetails.documents[0].repDocBack[0].url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                      </>
                                    } 
                                  />
                                </Card>
                            {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle(
                                     repDocType + " back"
                                    );
                                    setIsRepresentativeBack(true);
                                    setCommentModal(true);
                                    setCommentModalData("repDocBackStatus");
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  onClick={() => {
                                    setModalTitle(
                                      repDocType + " back"
                                    );
                                    setIsRepresentativeBack(true);
                                    SetCommentModalReject(true);
                                    setCommentModalData("repDocBackStatus");
                                  }}
                                />
                              </>)}
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle={
                                  repDocType + " back"
                                }
                                approverDetails={
                                  KYBDetails?.documents?.[0]?.repDocBack?.[0]
                                }
                                uploadedFile={
                                  KYBDetails?.documents?.[0]?.repDocBack?.[0]
                                    ?.url
                                }
                                tab="admin"
                              />
                            )}
                          </TabPane>
                        </Tabs>
                      ) : KYBDetails?.documents?.[0]?.repDocBack?.[0]?.status !=
                        "VERIFIED" &&
                        KYBDetails?.documents?.[0]?.repDocBack?.[0]?.status !=
                        "REJECTED" ? (
                        <div className="afterApproveCard-img-card">
                          <Card
                            className=" kybcard"
                            cover={
                              KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url.includes(
                                ".pdf"
                              ) ? (
                                // <embed
                                //   onClick={() =>
                                //     window.open(
                                //       KYBDetails?.documents?.[0]
                                //         ?.repDocBack?.[0]?.url,
                                //       "_blank",
                                //       "rel=noopener noreferrer"
                                //     )
                                //   }
                                //   className="w-100 cursor h-175"
                                //   src={
                                //     KYBDetails?.documents?.[0]?.repDocBack?.[0]
                                //       ?.url
                                //   }
                                // />
                                <>
                                  <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repDocBack[0].url) }}>
                                    <PDFPreview
                                      url={KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url || ''}
                                      onPreviewClick={handlePDFView}
                                    />
                                  </div>
                                </>
                              ) : (
                                <Image
                                  alt="example"
                                  src={
                                    KYBDetails?.documents?.[0]?.repDocBack?.[0]
                                      ?.url
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
                                  {repDocType + " back"} 
                                  <Tooltip
                                    title={'Download'}
                                    overlayClassName='custom-tooltip'
                                    placement="left"
                                  >
                                    <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url && handleDownload(KYBDetails.documents[0].repDocBack[0].url,KYBDetails.documents[0].repDocBack[0].url.includes(".pdf"))} >
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
                                repDocType + " back"
                              );
                              setCommentModal(true);
                              setCommentModalData("repDocBackStatus");
                              setIsRepresentativeBack(true);
                            }}
                          />
                          <PrimaryOutLineButton
                            children="Reject"
                            className="mt-4 mx-3"
                            onClick={() => {
                              setModalTitle(
                               repDocType + " back"
                              );
                              SetCommentModalReject(true);
                              setCommentModalData("repDocBackStatus");
                              setIsRepresentativeBack(true);
                            }}
                          />
                          </div>
                        </div>
                      ) : (
                        <ApproverDetails
                          modalTitle={
                            repDocType + " back"
                          }
                          approverDetails={
                            KYBDetails?.documents?.[0]?.repDocBack?.[0]
                          }
                          uploadedFile={
                            KYBDetails?.documents?.[0]?.repDocBack?.[0]?.url
                          }
                          tab="admin"
                        />
                      )}
                    </div>
                  </Col>
                ) : null}
                {KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url ? (
                  <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                    <div className="afterApproveCard">
                      {KYBDetails?.documents?.[0]?.repAddProof?.[0]
                        ?.isCompliance != null ||
                        KYBDetails?.documents?.[0]?.repAddProof?.[0]?.status ==
                        "VERIFIED" ||
                        KYBDetails?.documents?.[0]?.repAddProof?.[0]?.status ==
                        "REJECTED" ? (
                        <Tabs
                          defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                          className="d-none-res "
                        >
                          {KYBDetails?.documents?.[0]?.repAddProof?.[0]
                            ?.isCompliance != null ? (
                            <TabPane tab={`Approver`} key="approver">
                              {KYBDetails?.documents?.[0]?.repAddProof?.[0]
                                ?.isCompliance == null ? (
                                <div>
                                  <Card
                                    className=" kybcard"
                                    cover={
                                      KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url.includes(
                                        ".pdf"
                                      ) ? (
                                        // <embed
                                        //   onClick={() =>
                                        //     window.open(
                                        //       KYBDetails?.documents?.[0]
                                        //         ?.repAddProof?.[0]?.url,
                                        //       "_blank",
                                        //       "rel=noopener noreferrer"
                                        //     )
                                        //   }
                                        //   className="w-100 cursor h-175"
                                        //   src={
                                        //     KYBDetails?.documents?.[0]
                                        //       ?.repAddProof?.[0]?.url
                                        //   }
                                        // />
                                        <>
                                          <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repAddProof[0].url) }}>
                                            <PDFPreview
                                              url={KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url || ''}
                                              onPreviewClick={handlePDFView}
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <Image
                                          alt="example"
                                          src={
                                            KYBDetails?.documents?.[0]
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
                                            <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url && handleDownload(KYBDetails.documents[0].repAddProof[0].url,KYBDetails.documents[0].repAddProof[0].url.includes(".pdf"))} >
                                              <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                            </div>
                                          </Tooltip>
                                        </div>
                                        </>
                                      } 
                                    />
                                  </Card>
                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle("Address proof");
                                      setCommentModal(true);
                                      setCommentModalData("repAddProofStatus");
                                      setIsRepresentativeAddress(true);
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle("Address proof");
                                      SetCommentModalReject(true);
                                      setCommentModalData("repAddProofStatus");
                                      setIsRepresentativeAddress(true);
                                    }}
                                  />
                                </div>
                              ) : (
                                <ApproverDetails
                                  modalTitle="Address proof"
                                  approverDetails={
                                    KYBDetails?.documents?.[0]?.repAddProof?.[0]
                                  }
                                  uploadedFile={
                                    KYBDetails?.documents?.[0]?.repAddProof?.[0]
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
                            {KYBDetails?.documents?.[0]?.repAddProof?.[0]
                              ?.status != "VERIFIED" &&
                              KYBDetails?.documents?.[0]?.repAddProof?.[0]
                                ?.status != "REJECTED" ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      // <embed
                                      //   onClick={() =>
                                      //     window.open(
                                      //       KYBDetails?.documents?.[0]
                                      //         ?.repAddProof?.[0]?.url,
                                      //       "_blank",
                                      //       "rel=noopener noreferrer"
                                      //     )
                                      //   }
                                      //   className="w-100 cursor h-175"
                                      //   src={
                                      //     KYBDetails?.documents?.[0]
                                      //       ?.repAddProof?.[0]?.url
                                      //   }
                                      // />
                                      <>
                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repAddProof[0].url) }}>
                                          <PDFPreview
                                            url={KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url || ''}
                                            onPreviewClick={handlePDFView}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
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
                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url && handleDownload(KYBDetails.documents[0].repAddProof[0].url,KYBDetails.documents[0].repAddProof[0].url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                      </>
                                    } 
                                  />
                                </Card>
                                {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle("Address proof");
                                      setCommentModal(true);
                                      setCommentModalData("repAddProofStatus");
                                      setIsRepresentativeAddress(true);
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle("Address proof");
                                      SetCommentModalReject(true);
                                      setCommentModalData("repAddProofStatus");
                                      setIsRepresentativeAddress(true);
                                    }}
                                  />
                                </>)}
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle="Address proof"
                                approverDetails={
                                  KYBDetails?.documents?.[0]?.repAddProof?.[0]
                                }
                                uploadedFile={
                                  KYBDetails?.documents?.[0]?.repAddProof?.[0]
                                    ?.url
                                }
                                tab="admin"
                              />
                            )}
                          </TabPane>
                        </Tabs>
                      ) : KYBDetails?.documents?.[0]?.repAddProof?.[0]
                        ?.status != "VERIFIED" &&
                        KYBDetails?.documents?.[0]?.repAddProof?.[0]?.status !=
                        "REJECTED" ? (
                        <div className="afterApproveCard-img-card">
                          <Card
                            className=" kybcard"
                            cover={
                              KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url.includes(
                                ".pdf"
                              ) ? (
                                // <embed
                                //   onClick={() =>
                                //     window.open(
                                //       KYBDetails?.documents?.[0]
                                //         ?.repAddProof?.[0]?.url,
                                //       "_blank",
                                //       "rel=noopener noreferrer"
                                //     )
                                //   }
                                //   className="w-100 cursor h-175"
                                //   src={
                                //     KYBDetails?.documents?.[0]?.repAddProof?.[0]
                                //       ?.url
                                //   }
                                // />
                                <>
                                  <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].repAddProof[0].url) }}>
                                    <PDFPreview
                                      url={KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url || ''}
                                      onPreviewClick={handlePDFView}
                                    />
                                  </div>
                                </>
                              ) : (
                                <Image
                                  alt="example"
                                  src={
                                    KYBDetails?.documents?.[0]?.repAddProof?.[0]
                                      ?.url
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
                                    <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url && handleDownload(KYBDetails.documents[0].repAddProof[0].url,KYBDetails.documents[0].repAddProof[0].url.includes(".pdf"))} >
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
                                setIsRepresentativeAddress(true);
                              }}
                            />
                            <PrimaryOutLineButton
                              children="Reject"
                              className="mt-4 mx-3"
                              onClick={() => {
                                setModalTitle("Address proof");
                                SetCommentModalReject(true);
                                setCommentModalData("repAddProofStatus");
                                setIsRepresentativeAddress(true);
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <ApproverDetails
                          modalTitle="Address proof"
                          approverDetails={
                            KYBDetails?.documents?.[0]?.repAddProof?.[0]
                          }
                          uploadedFile={
                            KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url
                          }
                          tab="admin"
                        />
                      )}
                    </div>
                  </Col>
                ) : null}
                {KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url ? (
                  <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                    <div className="afterApproveCard">
                      {KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                        ?.isCompliance != null ||
                        KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.status ==
                        "VERIFIED" ||
                        KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.status ==
                        "REJECTED" ? (
                        <Tabs
                          defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                          className="d-none-res "
                        >
                          {KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                            ?.isCompliance != null ? (
                            <TabPane tab={`Approver`} key="approver">
                              {KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                                ?.isCompliance == null ? (
                                <div>
                                  <Card
                                    className=" kybcard"
                                    cover={
                                      KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url.includes(
                                        ".pdf"
                                      ) ? (
                                        // <embed
                                        //   onClick={() =>
                                        //     window.open(
                                        //       KYBDetails?.documents?.[0]
                                        //         ?.authorizationDoc?.[0]?.url,
                                        //       "_blank",
                                        //       "rel=noopener noreferrer"
                                        //     )
                                        //   }
                                        //   className="w-100 cursor h-175"
                                        //   src={
                                        //     KYBDetails?.documents?.[0]
                                        //       ?.authorizationDoc?.[0]?.url
                                        //   }
                                        // />
                                        <>
                                          <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].authorizationDoc[0].url) }}>
                                            <PDFPreview
                                              url={KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url || ''}
                                              onPreviewClick={handlePDFView}
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <Image
                                          alt="example"
                                          src={
                                            KYBDetails?.documents?.[0]
                                              ?.authorizationDoc?.[0]?.url
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
                                          {"Authorization document"}
                                          <Tooltip
                                            title={'Download'}
                                            overlayClassName='custom-tooltip'
                                            placement="left"
                                          >
                                            <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].authorizationDoc[0].url,KYBDetails.documents[0].authorizationDoc[0].url.includes(".pdf"))} >
                                              <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                            </div>
                                          </Tooltip>
                                        </div>
                                        </>
                                      } 
                                    />
                                  </Card>
                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle("Authorization document");
                                      setCommentModal(true);
                                      setCommentModalData("authorizationDocStatus");
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle("Authorization document");
                                      SetCommentModalReject(true);
                                      setCommentModalData("authorizationDocStatus");
                                    }}
                                  />
                                </div>
                              ) : (
                                <ApproverDetails
                                  modalTitle="Authorization document"
                                  approverDetails={
                                    KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                                  }
                                  uploadedFile={
                                    KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
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
                            {KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                              ?.status != "VERIFIED" &&
                              KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                                ?.status != "REJECTED" ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      // <embed
                                      //   onClick={() =>
                                      //     window.open(
                                      //       KYBDetails?.documents?.[0]
                                      //         ?.authorizationDoc?.[0]?.url,
                                      //       "_blank",
                                      //       "rel=noopener noreferrer"
                                      //     )
                                      //   }
                                      //   className="w-100 cursor h-175"
                                      //   src={
                                      //     KYBDetails?.documents?.[0]
                                      //       ?.authorizationDoc?.[0]?.url
                                      //   }
                                      // />
                                      <>
                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].authorizationDoc[0].url) }}>
                                          <PDFPreview
                                            url={KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url || ''}
                                            onPreviewClick={handlePDFView}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
                                            ?.authorizationDoc?.[0]?.url
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
                                        {"Authorization document"}
                                        <Tooltip
                                          title={'Download'}
                                          overlayClassName='custom-tooltip'
                                          placement="left"
                                        >
                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].authorizationDoc[0].url,KYBDetails.documents[0].authorizationDoc[0].url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                      </>
                                    } 
                                  />
                                </Card>
                                {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle("Authorization document");
                                      setCommentModal(true);
                                      setCommentModalData("authorizationDocStatus");
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle("Authorization document");
                                      SetCommentModalReject(true);
                                      setCommentModalData("authorizationDocStatus");
                                    }}
                                  />
                                </>)}
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle="Authorization document"
                                approverDetails={
                                  KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                                }
                                uploadedFile={
                                  KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                                    ?.url
                                }
                                tab="admin"
                              />
                            )}
                          </TabPane>
                        </Tabs>
                      ) : KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                        ?.status != "VERIFIED" &&
                        KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.status !=
                        "REJECTED" ? (
                        <div className="afterApproveCard-img-card">
                          <Card
                            className=" kybcard"
                            cover={
                              KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url.includes(
                                ".pdf"
                              ) ? (
                                // <embed
                                //   onClick={() =>
                                //     window.open(
                                //       KYBDetails?.documents?.[0]
                                //         ?.authorizationDoc?.[0]?.url,
                                //       "_blank",
                                //       "rel=noopener noreferrer"
                                //     )
                                //   }
                                //   className="w-100 cursor h-175"
                                //   src={
                                //     KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                                //       ?.url
                                //   }
                                // />
                                <>
                                  <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].authorizationDoc[0].url) }}>
                                    <PDFPreview
                                      url={KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url || ''}
                                      onPreviewClick={handlePDFView}
                                    />
                                  </div>
                                </>
                              ) : (
                                <Image
                                  alt="example"
                                  src={
                                    KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                                      ?.url
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
                                  {"Authorization document"}
                                  <Tooltip
                                    title={'Download'}
                                    overlayClassName='custom-tooltip'
                                    placement="left"
                                  >
                                    <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].authorizationDoc[0].url,KYBDetails.documents[0].authorizationDoc[0].url.includes(".pdf"))} >
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
                                setModalTitle("Authorization document");
                                setCommentModal(true);
                                setCommentModalData("authorizationDocStatus");
                              }}
                            />
                            <PrimaryOutLineButton
                              children="Reject"
                              className="mt-4 mx-3"
                              onClick={() => {
                                setModalTitle("Authorization document");
                                SetCommentModalReject(true);
                                setCommentModalData("authorizationDocStatus");
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <ApproverDetails
                          modalTitle="Authorization document"
                          approverDetails={
                            KYBDetails?.documents?.[0]?.authorizationDoc?.[0]
                          }
                          uploadedFile={
                            KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url
                          }
                          tab="admin"
                        />
                      )}
                    </div>
                  </Col>
                ) : null}
              </Row>
              <hr className="lightgrayHr" />
              <Form form={repCmtForm}>
                <Row className="mt-3">
                  <div className="w-100">
                    <Checkbox
                      disabled={
                        isApprover
                          ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                          : KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                            ? true
                            : false
                            || userType === "SUPPORT_ENGINEER"
                      }
                      checked={validDocumentVerificationRepresentative}
                      onClick={() => {
                        setValidDocumentVerificationRepresentative(!validDocumentVerificationRepresentative);
                      }}
                    >
                      <div className="subText mx-1 ">
                        Valid document verification
                      </div>
                    </Checkbox>
                    <div className="afterApproveCard">
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res  mx-4 my-2"
                      >
                        <TabPane tab={`Approver`} key="approver">
                          {KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYBDetails?.approverRepresentativeComments
                                ?.validDocumentVerificationComment
                                ? KYBDetails?.approverRepresentativeComments
                                  ?.validDocumentVerificationComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                              name="validDocumentVerificationApprover"
                              rules={
                                isApprover ?
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
                                        await validateCommentField(value, "validDocumentVerificationApprover", setSpecialErrors);
                                        if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                          return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                                      },
                                    },
                                  ] : []}
                              className="checklist w-100"
                            >
                              <TextArea
                                rows={2}
                                placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                                className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                                // onInput={handleInput}
                                id="validDocumentVerificationApprover"
                                onChange={(e) => updateApproverComment("validDocumentVerification", e?.target?.value)}
                                defaultValue={checkboxCommentApproverRepresentative?.validDocumentVerification}
                                disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                              />
                            </Form.Item>
                          )}
                        </TabPane>
                        <TabPane tab={`Authorizer`} key="authorizer">
                          <div className="w-100">
                            {KYBDetails?.kybStatus === "VERIFIED" ||
                              KYBDetails?.kybStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {KYBDetails?.adminRepresentativeComments
                                  ?.validDocumentVerificationComment
                                  ? KYBDetails?.adminRepresentativeComments
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
                                  defaultValue={checkboxCommentRepresentative?.validDocumentVerification}
                                  disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                  onChange={(e:any) => updateComment("validDocumentVerification", e)}
                                />
                              </Form.Item>
                            )}
                          </div>
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </Row>
                <Row className="my-4">
                  <div className="w-100">
                    <Checkbox
                      disabled={
                        isApprover
                          ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                          : KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                            ? true
                            : false
                            || userType === "SUPPORT_ENGINEER"
                      }
                      checked={nameAndIdVerificationRepresentative}
                      onClick={() => {
                        setNameAndIdVerificationRepresentative(!nameAndIdVerificationRepresentative);
                      }}
                    >
                      <div className="subText mx-1 ">Name & id verification</div>
                    </Checkbox>
                    <div className="afterApproveCard">
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res  mx-4 my-2"
                      >
                        <TabPane tab={`Approver`} key="approver">
                          {KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYBDetails?.approverRepresentativeComments
                                ?.nameAndIdVerificationComment
                                ? KYBDetails?.approverRepresentativeComments
                                  ?.nameAndIdVerificationComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                              name="nameAndIdVerificationApprover"
                              rules={
                                isApprover ?
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
                                defaultValue={checkboxCommentApproverRepresentative?.nameAndIdVerification}
                                onChange={(e) => updateApproverComment("nameAndIdVerification", e?.target?.value)}
                                disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                              />
                            </Form.Item>
                          )}
                        </TabPane>
                        <TabPane tab={`Authorizer`} key="authorizer">
                          <div className="w-100">
                            {KYBDetails?.kybStatus === "VERIFIED" ||
                              KYBDetails?.kybStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {KYBDetails?.adminRepresentativeComments
                                  ?.nameAndIdVerificationComment
                                  ? KYBDetails?.adminRepresentativeComments
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
                                    ] : []}
                                className="checklist"
                              >
                                <TextArea
                                  rows={2}
                                  placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                                  className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                                  // onInput={handleInput}
                                  id="nameAndIdVerification"
                                  defaultValue={checkboxCommentRepresentative?.nameAndIdVerification}
                                  onChange={(e:any) => updateComment("nameAndIdVerification", e)}
                                  disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                />
                              </Form.Item>
                            )}
                          </div>
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </Row>
                <Row className="my-4">
                  <div className="w-100">
                    <Checkbox
                      disabled={
                        isApprover
                          ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                          : KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                            ? true
                            : false
                            || userType === "SUPPORT_ENGINEER"
                      }
                      checked={amlScreeningRepresentative}
                      onClick={() => {
                        setAmlScreeningRepresentative(!amlScreeningShareholder);
                      }}
                    >
                      <div className="subText mx-1 ">AML screening</div>
                    </Checkbox>
                    <div className="afterApproveCard">
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res  mx-4 my-2"
                      >
                        <TabPane tab={`Approver`} key="approver">
                          {KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYBDetails?.approverRepresentativeComments?.amlScreeningComment
                                ? KYBDetails?.approverRepresentativeComments
                                  ?.amlScreeningComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                              name="amlScreeningApprover"
                              rules={
                                isApprover ?
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
                                defaultValue={checkboxCommentApproverRepresentative?.amlScreening}
                                onChange={(e) => updateApproverComment("amlScreening", e?.target?.value)}
                                disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                              />
                            </Form.Item>
                          )}
                        </TabPane>
                        <TabPane tab={`Authorizer`} key="authorizer">
                          <div className="w-100">
                            {KYBDetails?.kybStatus === "VERIFIED" ||
                              KYBDetails?.kybStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {KYBDetails?.adminRepresentativeComments?.amlScreeningComment
                                  ? KYBDetails?.adminRepresentativeComments?.amlScreeningComment
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
                                  defaultValue={checkboxCommentRepresentative?.amlScreening}
                                  onChange={(e:any) =>updateComment("amlScreening",e)}
                                  disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                />
                              </Form.Item>
                            )}
                          </div>
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </Row>
                <Row className="my-4">
                  <div className="w-100">
                    <Checkbox
                      disabled={
                        isApprover
                          ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                          : KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                            ? true
                            : false
                            || userType === "SUPPORT_ENGINEER"
                      }
                      checked={adverseMediaRepresentative}
                      onClick={() => {
                        setAdverseMediaRepresentative(!adverseMediaRepresentative);
                      }}
                    >
                      <div className="subText mx-1 ">Adverse media</div>
                    </Checkbox>
                    <div className="afterApproveCard">
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res mx-4 my-2"
                      >
                        <TabPane tab={`Approver`} key="approver">
                          {KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYBDetails?.approverRepresentativeComments?.adverseMediaComment
                                ? KYBDetails?.approverRepresentativeComments
                                  ?.adverseMediaComment
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                              name="adverseMediaApprover"
                              rules={
                                isApprover ?
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
                                defaultValue={checkboxCommentApproverRepresentative?.adverseMedia}
                                onChange={(e) => updateApproverComment("adverseMedia", e?.target?.value)}
                                disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                              />
                            </Form.Item>
                          )}
                        </TabPane>
                        <TabPane tab={`Authorizer`} key="authorizer">
                          <div className="w-100">
                            {KYBDetails?.kybStatus === "VERIFIED" ||
                              KYBDetails?.kybStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {KYBDetails?.adminRepresentativeComments?.adverseMediaComment
                                  ? KYBDetails?.adminRepresentativeComments?.adverseMediaComment
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
                                  defaultValue={checkboxCommentRepresentative?.adverseMedia}
                                  onChange={(e:any) =>updateComment("adverseMedia", e)}
                                  disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                                />
                              </Form.Item>
                            )}
                          </div>
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </Row>
                <Row className="my-4">
                  <div className="w-100">
                    <Checkbox
                      disabled={
                        isApprover
                          ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                          : KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                            ? true
                            : false
                             || userType === "SUPPORT_ENGINEER"
                      }
                      checked={otherCommentRepresentative}
                      onClick={() => {
                        setOtherCommentRepresentative(!otherCommentRepresentative);
                      }}
                    >
                      <div className="subText mx-1 ">Other comments/notes</div>
                    </Checkbox>
                    <div className="afterApproveCard">
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res mx-4 my-2"
                      >
                        <TabPane tab={`Approver`} key="approver">
                          {KYBDetails?.kybStatus === "VERIFIED" ||
                            KYBDetails?.kybStatus === "REJECTED" ? (
                            <div className="commentBox mt-2 mx-2">
                              {KYBDetails?.approverRepresentativeComments?.otherCommentAndNotes
                                ? KYBDetails?.approverRepresentativeComments
                                  ?.otherCommentAndNotes
                                : "N/A"}
                            </div>
                          ) : (
                            <Form.Item
                              name="otherCommentAndNotesApprover"
                              rules={
                                isApprover ?
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
                                defaultValue={checkboxCommentApproverRepresentative?.otherCommentAndNotes}
                                onChange={(e) => updateApproverComment("otherCommentAndNotes", e?.target?.value)}
                                disabled={!isApprover || disable  || userType === "SUPPORT_ENGINEER"}
                              />
                            </Form.Item>
                          )}
                        </TabPane>
                        <TabPane tab={`Authorizer`} key="authorizer">
                          <div className="w-100">
                            {KYBDetails?.kybStatus === "VERIFIED" ||
                              KYBDetails?.kybStatus === "REJECTED" ? (
                              <div className="commentBox mt-2 mx-2">
                                {KYBDetails?.adminRepresentativeComments?.otherCommentAndNotes
                                  ? KYBDetails?.adminRepresentativeComments?.otherCommentAndNotes
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
                                  defaultValue={checkboxCommentRepresentative?.otherCommentAndNotes}
                                  onChange={(e:any) =>updateComment("otherCommentAndNotes", e)}
                                  disabled={isApprover || disable  || userType === "SUPPORT_ENGINEER"}
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
            </Card>
          </Col>
        </Row>
     
        </>
        ),
    },
    {
      key: 'Shareholder',
      label: 'Shareholder details',
      children: (
        <>
          <Card className="my-3 details-card">
            {shareHoldersPayload && shareHoldersPayload?.length > 0 && (
              <Row>
                <div className="titleText fs-3 my-4">Shareholder details</div>
                <Tabs
                  className="w-100 custom-tabs"
                  type="card"
                  onChange={onShareholderTabChange}
                  items={shareHoldersPayload?.map((elem: any, i) => {
                    const hasCorporateShareHolder = representativeDetails && representativeDetails?.isCorporateShareholder == true && (representativeDetails?.representativeShare > 0 && i == 1 || representativeDetails?.representativeShare == 0 && i == 0);
                    const id = String(i + 1);
                    let shareholderDocArr: any, repShareholderDynamicKey: any, repShareholderDocArr: any, shareholderDynamicKey: any,addressProofShareholderDynamicKey:any,addressProofShareholderDocArr:any;
                    if (!hasCorporateShareHolder) {
                      shareholderDynamicKey = generateDynamicKey("shareholder_", id);
                      shareholderDocArr = findObjectByKey(shareholderAuthorizationFileList, shareholderDynamicKey)[shareholderDynamicKey];
                      repShareholderDynamicKey = generateDynamicKey("representativeShareholderId_", id);
                      repShareholderDocArr = findObjectByKey(shareholderRepresentativeFileList, repShareholderDynamicKey)[repShareholderDynamicKey];
                      addressProofShareholderDynamicKey = generateDynamicKey("addressProof_", id);
                      addressProofShareholderDocArr = findObjectByKey(shareholderAddressFileList, addressProofShareholderDynamicKey)[addressProofShareholderDynamicKey];
                    }

                    
                    return {
                      label: <span className="shareholder_tab">{`Shareholder ${id}`}</span>,
                      key: id,
                      children: (<>
                        {(hasCorporateShareHolder) ? (
                          <>
                            <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center justify-content-between">
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Company name</b></Text>
                                  <Text> <b>{elem?.CompnayName ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Date of incorporation</b></Text>
                                  <Text> <b>
                                    {elem?.companyShareholdingDateOfIncorporation ? dayjs.utc(elem?.companyShareholdingDateOfIncorporation).format("DD-MM-YYYY") : "---"}
                                    </b> 
                                  </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Country of incorporation</b></Text>
                                  <Text> <b>{countryofIncorporationTypeList &&  countryofIncorporationTypeList?.length>0 &&countryofIncorporationTypeList?.find((item:any) => item?.id == elem?.companyShareholdingCountryOfIncorporation)?.riskItem || '---'}</b> 
                                  </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Percentage of shareholdings</b></Text>
                                  <Text> <b>{elem?.companyShareholdingsPercentage ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                            </Row>
                            <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center">
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Trade license no.</b></Text>
                                  <Text>
                                    <b>
                                      {elem?.docNumber
                                        ? elem.docNumber
                                        : KYBDetails?.representative?.[0]?.repDocNumber
                                        ? KYBDetails.representative[0].repDocNumber
                                        : "---"}
                                    </b>
                                  </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Trade license expiry date</b></Text>
                                  <Text>
                                    <b>
                                      {elem?.docExpiryDate
                                        ? dayjs.utc(elem.docExpiryDate).format("DD-MM-YYYY")
                                        : KYBDetails?.representative?.[0]?.repExpiryDate
                                        ? dayjs.utc(KYBDetails.representative[0].repExpiryDate).format("DD-MM-YYYY")
                                        : "---"}
                                    </b> 
                                  </Text>
                                </Space>
                              </Col>
                            </Row>
                            <Row  gutter={20}>
                              {KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url ? (
                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                                  <div className="afterApproveCard">
                                    {KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]
                                      ?.isCompliance != null || 
                                      ['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]
                                        ?.status) ? (
                                      <Tabs
                                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                                        className="d-none-res "
                                      >

                                        {KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]
                                          ?.isCompliance != null ? (
                                          <TabPane tab={`Approver`} key="approver">
                                            {KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]
                                              ?.isCompliance == null ? (
                                              <div>
                                                <Card
                                                  className=" kybcard"
                                                  cover={
                                                    KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url.includes(
                                                      ".pdf"
                                                    ) ? (
                                                      <>
                                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url) }}>
                                                          <PDFPreview
                                                            url={KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url || ''}
                                                            onPreviewClick={handlePDFView}
                                                          />
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <Image
                                                        alt="example"
                                                        src={
                                                          KYBDetails?.documents?.[0]
                                                            ?.shareHoldingTradeLicenseDoc?.[0]?.url
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
                                                        {"Trade license proof"}
                                                        <Tooltip
                                                          title={'Download'}
                                                          overlayClassName='custom-tooltip'
                                                          placement="left"
                                                        >
                                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url,KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url.includes(".pdf"))} >
                                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                          </div>
                                                        </Tooltip>
                                                      </div>
                                                      </>
                                                    } 
                                                  />
                                                </Card>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("Trade licence proof");
                                                    setCommentModal(true);
                                                    setCommentModalData(
                                                      "shareHoldingTradeLicenseDocStatus"
                                                    );
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("Trade licence proof");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData(
                                                      "shareHoldingTradeLicenseDocStatus"
                                                    );
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <ApproverDetails
                                                modalTitle="Trade licence proof"
                                                approverDetails={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingTradeLicenseDoc?.[0]
                                                }
                                                uploadedFile={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingTradeLicenseDoc?.[0]?.url
                                                }
                                                tab="approver"
                                              />
                                            )}
                                          </TabPane>
                                        ) : (
                                          ""
                                        )}

                                        <TabPane tab={`Authorizer`} key="authorizer">
                                          {
                                            !['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]
                                              ?.status) ? (
                                            <div>
                                              <Card
                                                className=" kybcard"
                                                cover={
                                                  KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url.includes(
                                                    ".pdf"
                                                  ) ? (
                                                    <>
                                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url) }}>
                                                        <PDFPreview
                                                          url={KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url || ''}
                                                          onPreviewClick={handlePDFView}
                                                        />
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <Image
                                                      alt="example"
                                                      src={
                                                        KYBDetails?.documents?.[0]
                                                          ?.shareHoldingTradeLicenseDoc?.[0]?.url
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
                                                      {"Trade license proof"}
                                                      <Tooltip
                                                        title={'Download'}
                                                        overlayClassName='custom-tooltip'
                                                        placement="left"
                                                      >
                                                        <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url,KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url.includes(".pdf"))} >
                                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                        </div>
                                                      </Tooltip>
                                                    </div>
                                                    </>
                                                  } 
                                                />
                                              </Card>
                                              {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("Trade licence proof");
                                                    setCommentModal(true);
                                                    setCommentModalData(
                                                      "shareHoldingTradeLicenseDocStatus"
                                                    );
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("Trade licence proof");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData(
                                                      "shareHoldingTradeLicenseDocStatus"
                                                    );
                                                  }}
                                                />
                                              </>)}
                                            </div>
                                          ) : (
                                            <ApproverDetails
                                              modalTitle="Trade licence proof"
                                              approverDetails={
                                                KYBDetails?.documents?.[0]
                                                  ?.shareHoldingTradeLicenseDoc?.[0]
                                              }
                                              uploadedFile={
                                                KYBDetails?.documents?.[0]
                                                  ?.shareHoldingTradeLicenseDoc?.[0]?.url
                                              }
                                              tab="admin"
                                            />
                                          )}
                                        </TabPane>
                                      </Tabs>
                                    ) : !['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]
                                      ?.status) ? (
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url.includes(
                                              ".pdf"
                                            ) ? (
                                              <>
                                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url) }}>
                                                  <PDFPreview
                                                    url={KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url || ''}
                                                    onPreviewClick={handlePDFView}
                                                  />
                                                </div>
                                              </>
                                            ) : (
                                              <Image
                                                alt="example"
                                                src={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingTradeLicenseDoc?.[0]?.url
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
                                                {"Trade license proof"}
                                                <Tooltip
                                                  title={'Download'}
                                                  overlayClassName='custom-tooltip'
                                                  placement="left"
                                                >
                                                  <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url,KYBDetails.documents[0].shareHoldingTradeLicenseDoc[0].url.includes(".pdf"))} >
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
                                              setModalTitle("Trade licence proof");
                                              setCommentModal(true);
                                              setCommentModalData("shareHoldingTradeLicenseDocStatus");
                                            }}
                                          />
                                          <PrimaryOutLineButton
                                            children="Reject"
                                            className="mt-4 mx-3"
                                            onClick={() => {
                                              setModalTitle("Trade licence proof");
                                              SetCommentModalReject(true);
                                              setCommentModalData("shareHoldingTradeLicenseDocStatus");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <ApproverDetails
                                        modalTitle="Trade licence proof"
                                        approverDetails={
                                          KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]
                                        }
                                        uploadedFile={
                                          KYBDetails?.documents?.[0]?.shareHoldingTradeLicenseDoc?.[0]
                                            ?.url
                                        }
                                        tab="admin"
                                      />
                                    )}
                                  </div>
                                </Col>
                              ) : null}
                              {KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url ? (
                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                                  <div className="afterApproveCard">
                                    {KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                      ?.isCompliance != null ||
                                      KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                        ?.status == "VERIFIED" ||
                                      KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                        ?.status == "REJECTED" ? (
                                      <Tabs
                                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                                        className="d-none-res "
                                      >

                                        {KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                          ?.isCompliance != null ? (
                                          <TabPane tab={`Approver`} key="approver">
                                            {KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                              ?.isCompliance == null ? (
                                              <div>
                                                <Card
                                                  className=" kybcard"
                                                  cover={
                                                    KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url.includes(
                                                      ".pdf"
                                                    ) ? (
                                                      <>
                                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingMoaDoc[0].url) }}>
                                                          <PDFPreview
                                                            url={KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url || ''}
                                                            onPreviewClick={handlePDFView}
                                                          />
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <Image
                                                        alt="example"
                                                        src={
                                                          KYBDetails?.documents?.[0]
                                                            ?.shareHoldingMoaDoc?.[0]?.url
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
                                                        {"MOA proof"}
                                                        <Tooltip
                                                          title={'Download'}
                                                          overlayClassName='custom-tooltip'
                                                          placement="left"
                                                        >
                                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingMoaDoc[0].url,KYBDetails.documents[0].shareHoldingMoaDoc[0].url.includes(".pdf"))} >
                                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                          </div>
                                                        </Tooltip>
                                                      </div>
                                                      </>
                                                    } 
                                                  />
                                                </Card>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("MOA proof");
                                                    setCommentModal(true);
                                                    setCommentModalData(
                                                      "shareHoldingMoaDocStatus"
                                                    );
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("MOA proof");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData(
                                                      "shareHoldingMoaDocStatus"
                                                    );
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <ApproverDetails
                                                modalTitle="MOA proof"
                                                approverDetails={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingMoaDoc?.[0]
                                                }
                                                uploadedFile={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingMoaDoc?.[0]?.url
                                                }
                                                tab="approver"
                                              />
                                            )}
                                          </TabPane>
                                        ) : (
                                          ""
                                        )}

                                        <TabPane tab={`Authorizer`} key="authorizer">
                                          {KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                            ?.status != "VERIFIED" &&
                                            KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                              ?.status != "REJECTED" ? (
                                            <div>
                                              <Card
                                                className=" kybcard"
                                                cover={
                                                  KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url.includes(
                                                    ".pdf"
                                                  ) ? (
                                                    <>
                                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingMoaDoc[0].url) }}>
                                                        <PDFPreview
                                                          url={KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url || ''}
                                                          onPreviewClick={handlePDFView}
                                                        />
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <Image
                                                      alt="example"
                                                      src={
                                                        KYBDetails?.documents?.[0]
                                                          ?.shareHoldingMoaDoc?.[0]?.url
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
                                                      {"MOA proof"}
                                                      <Tooltip
                                                        title={'Download'}
                                                        overlayClassName='custom-tooltip'
                                                        placement="left"
                                                      >
                                                        <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingMoaDoc[0].url,KYBDetails.documents[0].shareHoldingMoaDoc[0].url.includes(".pdf"))} >
                                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                        </div>
                                                      </Tooltip>
                                                    </div>
                                                    </>
                                                  } 
                                                />
                                              </Card>
                                              {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("MOA proof");
                                                    setCommentModal(true);
                                                    setCommentModalData(
                                                      "shareHoldingMoaDocStatus"
                                                    );
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("MOA proof");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData(
                                                      "shareHoldingMoaDocStatus"
                                                    );
                                                  }}
                                                />
                                              </>)}
                                            </div>
                                          ) : (
                                            <ApproverDetails
                                              modalTitle="MOA proof"
                                              approverDetails={
                                                KYBDetails?.documents?.[0]
                                                  ?.shareHoldingMoaDoc?.[0]
                                              }
                                              uploadedFile={
                                                KYBDetails?.documents?.[0]
                                                  ?.shareHoldingMoaDoc?.[0]?.url
                                              }
                                              tab="admin"
                                            />
                                          )}
                                        </TabPane>
                                      </Tabs>
                                    ) : KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                      ?.status != "VERIFIED" &&
                                      KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                        ?.status != "REJECTED" ? (
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url.includes(
                                              ".pdf"
                                            ) ? (
                                              <>
                                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingMoaDoc[0].url) }}>
                                                  <PDFPreview
                                                    url={KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url || ''}
                                                    onPreviewClick={handlePDFView}
                                                  />
                                                </div>
                                              </>
                                            ) : (
                                              <Image
                                                alt="example"
                                                src={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingMoaDoc?.[0]?.url
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
                                                {"MOA proof"}
                                                <Tooltip
                                                  title={'Download'}
                                                  overlayClassName='custom-tooltip'
                                                  placement="left"
                                                >
                                                  <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingMoaDoc[0].url,KYBDetails.documents[0].shareHoldingMoaDoc[0].url.includes(".pdf"))} >
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
                                              setModalTitle("MOA proof");
                                              setCommentModal(true);
                                              setCommentModalData("shareHoldingMoaDocStatus");
                                            }}
                                          />
                                          <PrimaryOutLineButton
                                            children="Reject"
                                            className="mt-4 mx-3"
                                            onClick={() => {
                                              setModalTitle("MOA proof");
                                              SetCommentModalReject(true);
                                              setCommentModalData("shareHoldingMoaDocStatus");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <ApproverDetails
                                        modalTitle="MOA proof"
                                        approverDetails={
                                          KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                        }
                                        uploadedFile={
                                          KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]
                                            ?.url
                                        }
                                        tab="admin"
                                      />
                                    )}
                                  </div>
                                </Col>
                              ) : null}
                                     {KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url ? (
                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                                  <div className="afterApproveCard">
                                    {KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                      ?.isCompliance != null ||
                                      KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                        ?.status == "VERIFIED" ||
                                      KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                        ?.status == "REJECTED" ? (
                                      <Tabs
                                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                                        className="d-none-res "
                                      >

                                        {KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                          ?.isCompliance != null ? (
                                          <TabPane tab={`Approver`} key="approver">
                                            {KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                              ?.isCompliance == null ? (
                                              <div>
                                                <Card
                                                  className=" kybcard"
                                                  cover={
                                                    KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url.includes(
                                                      ".pdf"
                                                    ) ? (
                                                      <>
                                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url) }}>
                                                          <PDFPreview
                                                            url={KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url || ''}
                                                            onPreviewClick={handlePDFView}
                                                          />
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <Image
                                                        alt="example"
                                                        src={
                                                          KYBDetails?.documents?.[0]
                                                            ?.shareHoldingCompanyAddressDoc?.[0]?.url
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
                                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url,KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url.includes(".pdf"))} >
                                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                          </div>
                                                        </Tooltip>
                                                      </div>
                                                      </>
                                                    } 
                                                  />
                                                </Card>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("Address proof");
                                                    setCommentModal(true);
                                                    setCommentModalData(
                                                      "shareHoldingCompanyAddressDocStatus"
                                                    );
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("Address proof");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData(
                                                      "shareHoldingCompanyAddressDocStatus"
                                                    );
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <ApproverDetails
                                                modalTitle="Address proof"
                                                approverDetails={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingCompanyAddressDoc?.[0]
                                                }
                                                uploadedFile={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingCompanyAddressDoc?.[0]?.url
                                                }
                                                tab="approver"
                                              />
                                            )}
                                          </TabPane>
                                        ) : (
                                          ""
                                        )}

                                        <TabPane tab={`Authorizer`} key="authorizer">
                                          {KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                            ?.status != "VERIFIED" &&
                                            KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                              ?.status != "REJECTED" ? (
                                            <div>
                                              <Card
                                                className=" kybcard"
                                                cover={
                                                  KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url.includes(
                                                    ".pdf"
                                                  ) ? (
                                                    <>
                                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url) }}>
                                                        <PDFPreview
                                                          url={KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url || ''}
                                                          onPreviewClick={handlePDFView}
                                                        />
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <Image
                                                      alt="example"
                                                      src={
                                                        KYBDetails?.documents?.[0]
                                                          ?.shareHoldingCompanyAddressDoc?.[0]?.url
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
                                                        <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url,KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url.includes(".pdf"))} >
                                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                        </div>
                                                      </Tooltip>
                                                    </div>
                                                    </>
                                                  } 
                                                />
                                              </Card>
                                              {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("Address proof");
                                                    setCommentModal(true);
                                                    setCommentModalData(
                                                      "shareHoldingCompanyAddressDocStatus"
                                                    );
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("Address proof");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData(
                                                      "shareHoldingCompanyAddressDocStatus"
                                                    );
                                                  }}
                                                />
                                              </>)}
                                            </div>
                                          ) : (
                                            <ApproverDetails
                                              modalTitle="Address proof"
                                              approverDetails={
                                                KYBDetails?.documents?.[0]
                                                  ?.shareHoldingCompanyAddressDoc?.[0]
                                              }
                                              uploadedFile={
                                                KYBDetails?.documents?.[0]
                                                  ?.shareHoldingCompanyAddressDoc?.[0]?.url
                                              }
                                              tab="admin"
                                            />
                                          )}
                                        </TabPane>
                                      </Tabs>
                                    ) : KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                      ?.status != "VERIFIED" &&
                                      KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                        ?.status != "REJECTED" ? (
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url.includes(
                                              ".pdf"
                                            ) ? (
                                              <>
                                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url) }}>
                                                  <PDFPreview
                                                    url={KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url || ''}
                                                    onPreviewClick={handlePDFView}
                                                  />
                                                </div>
                                              </>
                                            ) : (
                                              <Image
                                                alt="example"
                                                src={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingCompanyAddressDoc?.[0]?.url
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
                                                  <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url,KYBDetails.documents[0].shareHoldingCompanyAddressDoc[0].url.includes(".pdf"))} >
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
                                              setCommentModalData("shareHoldingCompanyAddressDocStatus");
                                            }}
                                          />
                                          <PrimaryOutLineButton
                                            children="Reject"
                                            className="mt-4 mx-3"
                                            onClick={() => {
                                              setModalTitle("Address proof");
                                              SetCommentModalReject(true);
                                              setCommentModalData("shareHoldingCompanyAddressDocStatus");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <ApproverDetails
                                        modalTitle="Address proof"
                                        approverDetails={
                                          KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                        }
                                        uploadedFile={
                                          KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]
                                            ?.url
                                        }
                                        tab="admin"
                                      />
                                    )}
                                  </div>
                                </Col>
                              ) : null}
                              {KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url ? (
                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                                  <div className="afterApproveCard">
                                    {KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                      ?.isCompliance != null ||
                                      KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                        ?.status == "VERIFIED" ||
                                      KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                        ?.status == "REJECTED" ? (
                                      <Tabs
                                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                                        className="d-none-res "
                                      >

                                        {KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                          ?.isCompliance != null ? (
                                          <TabPane tab={`Approver`} key="approver">
                                            {KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                              ?.isCompliance == null ? (
                                              <div>
                                                <Card
                                                  className=" kybcard"
                                                  cover={
                                                    KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url.includes(
                                                      ".pdf"
                                                    ) ? (
                                                      <>
                                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingOtherDoc[0].url) }}>
                                                          <PDFPreview
                                                            url={KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url || ''}
                                                            onPreviewClick={handlePDFView}
                                                          />
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <Image
                                                        alt="example"
                                                        src={
                                                          KYBDetails?.documents?.[0]
                                                            ?.shareHoldingOtherDoc?.[0]?.url
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
                                                        {"Other document"}
                                                        <Tooltip
                                                          title={'Download'}
                                                          overlayClassName='custom-tooltip'
                                                          placement="left"
                                                        >
                                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingOtherDoc[0].url,KYBDetails.documents[0].shareHoldingOtherDoc[0].url.includes(".pdf"))} >
                                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                          </div>
                                                        </Tooltip>
                                                      </div>
                                                      </>
                                                    } 
                                                  />
                                                </Card>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("Other document");
                                                    setCommentModal(true);
                                                    setCommentModalData(
                                                      "shareHoldingOtherDocStatus"
                                                    );
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("Other document");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData(
                                                      "shareHoldingOtherDocStatus"
                                                    );
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <ApproverDetails
                                                modalTitle="Other document"
                                                approverDetails={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingOtherDoc?.[0]
                                                }
                                                uploadedFile={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingOtherDoc?.[0]?.url
                                                }
                                                tab="approver"
                                              />
                                            )}
                                          </TabPane>
                                        ) : (
                                          ""
                                        )}

                                        <TabPane tab={`Authorizer`} key="authorizer">
                                          {KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                            ?.status != "VERIFIED" &&
                                            KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                              ?.status != "REJECTED" ? (
                                            <div>
                                              <Card
                                                className=" kybcard"
                                                cover={
                                                  KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url.includes(
                                                    ".pdf"
                                                  ) ? (
                                                    <>
                                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingOtherDoc[0].url) }}>
                                                        <PDFPreview
                                                          url={KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url || ''}
                                                          onPreviewClick={handlePDFView}
                                                        />
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <Image
                                                      alt="example"
                                                      src={
                                                        KYBDetails?.documents?.[0]
                                                          ?.shareHoldingOtherDoc?.[0]?.url
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
                                                      {"Other document"}
                                                      <Tooltip
                                                        title={'Download'}
                                                        overlayClassName='custom-tooltip'
                                                        placement="left"
                                                      >
                                                        <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingOtherDoc[0].url,KYBDetails.documents[0].shareHoldingOtherDoc[0].url.includes(".pdf"))} >
                                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                        </div>
                                                      </Tooltip>
                                                    </div>
                                                    </>
                                                  } 
                                                />
                                              </Card>
                                              {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("Other document");
                                                    setCommentModal(true);
                                                    setCommentModalData(
                                                      "shareHoldingOtherDocStatus"
                                                    );
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("Other document");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData(
                                                      "shareHoldingOtherDocStatus"
                                                    );
                                                  }}
                                                />
                                              </>)}
                                            </div>
                                          ) : (
                                            <ApproverDetails
                                              modalTitle="Other document"
                                              approverDetails={
                                                KYBDetails?.documents?.[0]
                                                  ?.shareHoldingOtherDoc?.[0]
                                              }
                                              uploadedFile={
                                                KYBDetails?.documents?.[0]
                                                  ?.shareHoldingOtherDoc?.[0]?.url
                                              }
                                              tab="admin"
                                            />
                                          )}
                                        </TabPane>
                                      </Tabs>
                                    ) : KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                      ?.status != "VERIFIED" &&
                                      KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                        ?.status != "REJECTED" ? (
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url.includes(
                                              ".pdf"
                                            ) ? (
                                              <>
                                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].shareHoldingOtherDoc[0].url) }}>
                                                  <PDFPreview
                                                    url={KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url || ''}
                                                    onPreviewClick={handlePDFView}
                                                  />
                                                </div>
                                              </>
                                            ) : (
                                              <Image
                                                alt="example"
                                                src={
                                                  KYBDetails?.documents?.[0]
                                                    ?.shareHoldingOtherDoc?.[0]?.url
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
                                                {"Other document"}
                                                <Tooltip
                                                  title={'Download'}
                                                  overlayClassName='custom-tooltip'
                                                  placement="left"
                                                >
                                                  <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].shareHoldingOtherDoc[0].url,KYBDetails.documents[0].shareHoldingOtherDoc[0].url.includes(".pdf"))} >
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
                                              setModalTitle("Other document");
                                              setCommentModal(true);
                                              setCommentModalData("shareHoldingOtherDocStatus");
                                            }}
                                          />
                                          <PrimaryOutLineButton
                                            children="Reject"
                                            className="mt-4 mx-3"
                                            onClick={() => {
                                              setModalTitle("Other document");
                                              SetCommentModalReject(true);
                                              setCommentModalData("shareHoldingOtherDocStatus");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <ApproverDetails
                                        modalTitle="Other document"
                                        approverDetails={
                                          KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                        }
                                        uploadedFile={
                                          KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]
                                            ?.url
                                        }
                                        tab="admin"
                                      />
                                    )}
                                  </div>
                                </Col>
                              ) : null}
                            </Row>
                          </>
                        ) : (
                          <>
                            <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center justify-content-between">
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>First name</b></Text>
                                  <Text> <b>{elem?.FirstName ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Middle name</b></Text>
                                  <Text> <b>{elem?.MiddleName ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Last name</b></Text>
                                  <Text> <b>{elem?.LastName ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Gender</b></Text>
                                  <Text> <b>{elem?.Gender ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                            </Row>
                            <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center justify-content-between">
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Percentage of shareholdings</b></Text>
                                  <Text> <b>{elem?.shareholdingsPercentage ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Designation</b></Text>
                                  <Text> <b>{elem?.designation ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Date of birth</b></Text>
                                  <Text> <b>{elem?.beneficialOwnerDob ? dayjs.utc(elem?.beneficialOwnerDob).format("DD-MM-YYYY") : "---"}</b> </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>Nationality</b></Text>
                                  <Text> <b>{elem?.beneficialOwnerNationality ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                            </Row>
                            <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center">
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>ID Number</b></Text>
                                  <Text> <b>{elem?.docNumber ?? "---"}</b> </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12} md={12} lg={6}>
                                <Space direction="vertical">
                                  <Text type="secondary"> <b>ID Expiry Date</b></Text>
                                  <Text> <b>{elem?.docExpiryDate ? dayjs.utc(elem.docExpiryDate).format('DD-MM-YYYY') : "---"}</b> </Text>
                                </Space>
                              </Col>
                            </Row>
                              <Row  gutter={20}>
                              {shareholderAuthorizationFileList?.length > 0 && (shareholderDocArr && shareholderDocArr?.[0]?.url) ? (
                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                                  <div className="afterApproveCard">
                                    {shareholderDocArr?.[0]?.isCompliance != null ||
                                      ['VERIFIED','REJECTED','EXPIRED'].includes(shareholderDocArr?.[0]?.status) ? (
                                      <Tabs
                                        defaultActiveKey={['ADMIN', 'SENIOR_MANAGEMENT', 'AUTHORIZER', 'CHECKER'].includes(userType) ? "authorizer" : "approver"}
                                        className="d-none-res "
                                      >
                                        {shareholderDocArr?.[0]
                                          ?.isCompliance != null ? (
                                          <TabPane tab={`Approver`} key="approver">
                                            {shareholderDocArr?.[0]
                                              ?.isCompliance == null ? (
                                              <div>
                                                <Card
                                                  className=" kybcard"
                                                  cover={
                                                    shareholderDocArr?.[0]?.url.includes(
                                                      ".pdf"
                                                    ) ? (
                                                      <>
                                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(shareholderDocArr?.[0]?.url) }}>
                                                          <Document
                                                            file={shareholderDocArr?.[0]?.url}
                                                            externalLinkRel="_blank"
                                                          >
                                                            <Page pageNumber={1} width={175} />
                                                          </Document>
                                                          <div className="hover-overlay">
                                                            <div>
                                                              <div className="center">
                                                                <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                              </div>
                                                              <div>
                                                                <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <Image
                                                        alt="example"
                                                        src={
                                                          shareholderDocArr?.[0]?.url
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
                                                        {DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front"}
                                                        <Tooltip
                                                          title={'Download'}
                                                          overlayClassName='custom-tooltip'
                                                          placement="left"
                                                        >
                                                          <div className="ml-2" onClick={() => handleDownload(shareholderDocArr?.[0]?.url, shareholderDocArr?.[0]?.url.includes(".pdf"))} >
                                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                          </div>
                                                        </Tooltip>
                                                      </div>
                                                      </>
                                                    } 
                                                  />
                                                </Card>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front");
                                                    setCommentModal(true);
                                                    setCommentModalData("shareholderAuthorizationDocStatus");
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle(DOCUMENT_TYPE[
                                                      elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"
                                                    ] + " front");
                                                    SetCommentModalReject(true);
                                                    setCommentModalKey(generateDynamicKey("shareholder_", id));
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <ApproverDetails
                                                modalTitle={DOCUMENT_TYPE[
                                                  elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"
                                                ] + " front"}
                                                approverDetails={
                                                  shareholderDocArr?.[0]
                                                }
                                                uploadedFile={
                                                  shareholderDocArr?.[0]
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
                                          { !['VERIFIED','REJECTED','EXPIRED'].includes(shareholderDocArr?.[0]?.status) ? (
                                            <div>
                                              <Card
                                                className=" kybcard"
                                                cover={
                                                  shareholderDocArr?.[0]?.url.includes(
                                                    ".pdf"
                                                  ) ? (
                                                    <>
                                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(shareholderDocArr?.[0]?.url) }}>
                                                        <Document
                                                          file={shareholderDocArr?.[0]?.url}
                                                          externalLinkRel="_blank"
                                                        >
                                                          <Page pageNumber={1} width={175} />
                                                        </Document>
                                                        <div className="hover-overlay">
                                                          <div>
                                                            <div className="center">
                                                              <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                            </div>
                                                            <div>
                                                              <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <Image
                                                      alt="example"
                                                      src={
                                                        shareholderDocArr?.[0]?.url
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
                                                      {DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front"}
                                                      <Tooltip
                                                        title={'Download'}
                                                        overlayClassName='custom-tooltip'
                                                        placement="left"
                                                      >
                                                        <div className="ml-2" onClick={() => handleDownload(shareholderDocArr?.[0]?.url, shareholderDocArr?.[0]?.url.includes(".pdf"))} >
                                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                        </div>
                                                      </Tooltip>
                                                    </div>
                                                    </>
                                                  } 
                                                />
                                              </Card>
                                              {['ADMIN', 'SENIOR_MANAGEMENT', 'AUTHORIZER', 'CHECKER'].includes(userType) && (<>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front");
                                                    setCommentModal(true);
                                                    setCommentModalData("shareholderAuthorizationDocStatus");
                                                    setCommentModalKey(generateDynamicKey("shareholder_", id));
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData("shareholderAuthorizationDocStatus");
                                                    setCommentModalKey(generateDynamicKey("shareholder_", id));
                                                  }}
                                                />
                                              </>)}
                                            </div>
                                          ) : (
                                            <ApproverDetails
                                              modalTitle={DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front"}
                                              approverDetails={
                                                shareholderDocArr?.[0]
                                              }
                                              uploadedFile={
                                                shareholderDocArr?.[0]
                                                  ?.url
                                              }
                                              tab="admin"
                                            />
                                          )}
                                        </TabPane>
                                      </Tabs>
                                    ) : 
                                    !['VERIFIED','REJECTED','EXPIRED'].includes(shareholderDocArr?.[0]?.status) ? (
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            shareholderDocArr?.[0]?.url.includes(
                                              ".pdf"
                                            ) ? (
                                              <>
                                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(shareholderDocArr?.[0]?.url) }}>
                                                  <Document
                                                    file={shareholderDocArr?.[0]?.url}
                                                    externalLinkRel="_blank"
                                                  >
                                                    <Page pageNumber={1} width={175} />
                                                  </Document>
                                                  <div className="hover-overlay">
                                                    <div>
                                                      <div className="center">
                                                        <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                      </div>
                                                      <div>
                                                        <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <Image
                                                alt="example"
                                                src={
                                                  shareholderDocArr?.[0]
                                                    ?.url
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
                                                {DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front"}
                                                <Tooltip
                                                  title={'Download'}
                                                  overlayClassName='custom-tooltip'
                                                  placement="left"
                                                >
                                                  <div className="ml-2" onClick={() => handleDownload(shareholderDocArr?.[0]?.url, shareholderDocArr?.[0]?.url.includes(".pdf"))} >
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
                                              setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front");
                                              setCommentModal(true);
                                              setCommentModalData("shareholderAuthorizationDocStatus");
                                              setCommentModalKey(generateDynamicKey("shareholder_", id));
                                            }}
                                          />
                                          <PrimaryOutLineButton
                                            children="Reject"
                                            className="mt-4 mx-3"
                                            onClick={() => {
                                              setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front");
                                              SetCommentModalReject(true);
                                              setCommentModalData("shareholderAuthorizationDocStatus");
                                              setCommentModalKey(generateDynamicKey("shareholder_", id));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <ApproverDetails
                                        modalTitle={DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " front"}
                                        approverDetails={
                                          shareholderDocArr?.[0]
                                        }
                                        uploadedFile={
                                          shareholderDocArr?.[0]?.url
                                        }
                                        tab="admin"
                                      />
                                    )}
                                  </div>
                                </Col>
                              ) : null}

                              {shareholderRepresentativeFileList?.length > 0 && (repShareholderDocArr && repShareholderDocArr?.[0]?.url) ? (
                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                                  <div className="afterApproveCard">
                                    {repShareholderDocArr?.[0]?.isCompliance != null ||
                                      ['VERIFIED','REJECTED','EXPIRED'].includes(repShareholderDocArr?.[0]?.status) ? (
                                      <Tabs
                                        defaultActiveKey={['ADMIN', 'SENIOR_MANAGEMENT', 'AUTHORIZER', 'CHECKER'].includes(userType) ? "authorizer" : "approver"}
                                        className="d-none-res "
                                      >
                                        {repShareholderDocArr?.[0]
                                          ?.isCompliance != null ? (
                                          <TabPane tab={`Approver`} key="approver">
                                            {repShareholderDocArr?.[0]
                                              ?.isCompliance == null ? (
                                              <div>
                                                <Card
                                                  className="kybcard"
                                                  cover={
                                                    repShareholderDocArr?.[0]?.url.includes(
                                                      ".pdf"
                                                    ) ? (
                                                      <>
                                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(repShareholderDocArr?.[0]?.url) }}>
                                                          <Document
                                                            file={repShareholderDocArr?.[0]?.url}
                                                            externalLinkRel="_blank"
                                                          >
                                                            <Page pageNumber={1} width={175} />
                                                          </Document>
                                                          <div className="hover-overlay">
                                                            <div>
                                                              <div className="center">
                                                                <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                              </div>
                                                              <div>
                                                                <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <Image
                                                        alt="example"
                                                        src={
                                                          repShareholderDocArr?.[0]?.url
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
                                                        {DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back"}
                                                        <Tooltip
                                                          title={'Download'}
                                                          overlayClassName='custom-tooltip'
                                                          placement="left"
                                                        >
                                                          <div className="ml-2" onClick={() => handleDownload(repShareholderDocArr?.[0]?.url, repShareholderDocArr?.[0]?.url.includes(".pdf"))} >
                                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                          </div>
                                                        </Tooltip>
                                                      </div>
                                                      </>
                                                    } 
                                                  />
                                                </Card>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back");
                                                    setCommentModal(true);
                                                    setCommentModalData("representativeShareholderIdStatus");
                                                    setCommentModalKey(generateDynamicKey("representativeShareholderId_", id));
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData("representativeShareholderIdStatus");
                                                    setCommentModalKey(generateDynamicKey("representativeShareholderId_", id));
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <ApproverDetails
                                                modalTitle={DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back"}
                                                approverDetails={
                                                  repShareholderDocArr?.[0]
                                                }
                                                uploadedFile={
                                                  repShareholderDocArr?.[0]
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
                                          {
                                          !['VERIFIED','REJECTED','EXPIRED'].includes(repShareholderDocArr?.[0]?.status) ? (
                                            <div>
                                              <Card
                                                className=" kybcard"
                                                cover={
                                                  repShareholderDocArr?.[0]?.url.includes(
                                                    ".pdf"
                                                  ) ? (
                                                    <>
                                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(repShareholderDocArr?.[0]?.url) }}>
                                                        <Document
                                                          file={repShareholderDocArr?.[0]?.url}
                                                          externalLinkRel="_blank"
                                                        >
                                                          <Page pageNumber={1} width={175} />
                                                        </Document>
                                                        <div className="hover-overlay">
                                                          <div>
                                                            <div className="center">
                                                              <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                            </div>
                                                            <div>
                                                              <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <Image
                                                      alt="example"
                                                      src={
                                                        repShareholderDocArr?.[0]?.url
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
                                                      {DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back"} 
                                                      <Tooltip
                                                        title={'Download'}
                                                        overlayClassName='custom-tooltip'
                                                        placement="left"
                                                      >
                                                        <div className="ml-2" onClick={() => handleDownload(repShareholderDocArr?.[0]?.url, repShareholderDocArr?.[0]?.url.includes(".pdf"))} >
                                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                        </div>
                                                      </Tooltip>
                                                    </div>
                                                    </>
                                                  } 
                                                />
                                              </Card>
                                              {(userType === 'ADMIN' || userType === 'SENIOR_MANAGMENT' || userType === 'AUTHORIZER' || userType === 'CHECKER') && (<>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back");
                                                    setCommentModal(true);
                                                    setCommentModalData("representativeShareholderIdStatus");
                                                    setCommentModalKey(generateDynamicKey("representativeShareholderId_", id));
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData("representativeShareholderIdStatus");
                                                    setCommentModalKey(generateDynamicKey("representativeShareholderId_", id));
                                                  }}
                                                />
                                              </>)}
                                            </div>
                                          ) : (
                                            <ApproverDetails
                                              modalTitle={DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back"}
                                              approverDetails={
                                                repShareholderDocArr?.[0]
                                              }
                                              uploadedFile={
                                                repShareholderDocArr?.[0]
                                                  ?.url
                                              }
                                              tab="admin"
                                            />
                                          )}
                                        </TabPane>
                                      </Tabs>
                                    ) : !['VERIFIED','REJECTED','EXPIRED'].includes(repShareholderDocArr?.[0]?.status) ? (
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            repShareholderDocArr?.[0]?.url.includes(
                                              ".pdf"
                                            ) ? (
                                              <>
                                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(repShareholderDocArr?.[0]?.url) }}>
                                                  <Document
                                                    file={repShareholderDocArr?.[0]?.url}
                                                    externalLinkRel="_blank"
                                                  >
                                                    <Page pageNumber={1} width={175} />
                                                  </Document>
                                                  <div className="hover-overlay">
                                                    <div>
                                                      <div className="center">
                                                        <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                      </div>
                                                      <div>
                                                        <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <Image
                                                alt="example"
                                                src={
                                                  repShareholderDocArr?.[0]
                                                    ?.url
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
                                                {DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back"}
                                                <Tooltip
                                                  title={'Download'}
                                                  overlayClassName='custom-tooltip'
                                                  placement="left"
                                                >
                                                  <div className="ml-2" onClick={() => handleDownload(repShareholderDocArr?.[0]?.url, repShareholderDocArr?.[0]?.url.includes(".pdf"))} >
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
                                              setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back");
                                              setCommentModal(true);
                                              setCommentModalData("representativeShareholderIdStatus");
                                              setCommentModalKey(generateDynamicKey("representativeShareholderId_", id));
                                            }}
                                          />
                                          <PrimaryOutLineButton
                                            children="Reject"
                                            className="mt-4 mx-3"
                                            onClick={() => {
                                              setModalTitle(DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back");
                                              SetCommentModalReject(true);
                                              setCommentModalData("representativeShareholderIdStatus");
                                              setCommentModalKey(generateDynamicKey("representativeShareholderId_", id));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <ApproverDetails
                                        modalTitle={DOCUMENT_TYPE[elem?.beneficialOwnerDocNationality ?? "NATIONAL_ID"] + " back"}
                                        approverDetails={
                                          repShareholderDocArr?.[0]
                                        }
                                        uploadedFile={
                                          repShareholderDocArr?.[0]?.url
                                        }
                                        tab="admin"
                                      />
                                    )}
                                  </div>
                                </Col>
                              ) : null}

                               {shareholderAddressFileList?.length > 0 && (addressProofShareholderDocArr && addressProofShareholderDocArr?.[0]?.url) ? (
                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="my-4">
                                  <div className="afterApproveCard">
                                    {addressProofShareholderDocArr?.[0]?.isCompliance != null ||
                                      ['VERIFIED','REJECTED','EXPIRED'].includes(addressProofShareholderDocArr?.[0]?.status) ? (
                                      <Tabs
                                        defaultActiveKey={['ADMIN', 'SENIOR_MANAGEMENT', 'AUTHORIZER', 'CHECKER'].includes(userType) ? "authorizer" : "approver"}
                                        className="d-none-res "
                                      >
                                        {addressProofShareholderDocArr?.[0]
                                          ?.isCompliance != null ? (
                                          <TabPane tab={`Approver`} key="approver">
                                            {addressProofShareholderDocArr?.[0]
                                              ?.isCompliance == null ? (
                                              <div>
                                                <Card
                                                  className="kybcard"
                                                  cover={
                                                    addressProofShareholderDocArr?.[0]?.url.includes(
                                                      ".pdf"
                                                    ) ? (
                                                      <>
                                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(addressProofShareholderDocArr?.[0]?.url) }}>
                                                          <Document
                                                            file={addressProofShareholderDocArr?.[0]?.url}
                                                            externalLinkRel="_blank"
                                                          >
                                                            <Page pageNumber={1} width={175} />
                                                          </Document>
                                                          <div className="hover-overlay">
                                                            <div>
                                                              <div className="center">
                                                                <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                              </div>
                                                              <div>
                                                                <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </>
                                                    ) : (
                                                      <Image
                                                        alt="example"
                                                        src={
                                                          addressProofShareholderDocArr?.[0]?.url
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
                                                        {"Address Proof"}
                                                        <Tooltip
                                                          title={'Download'}
                                                          overlayClassName='custom-tooltip'
                                                          placement="left"
                                                        >
                                                          <div className="ml-2" onClick={() => handleDownload(addressProofShareholderDocArr?.[0]?.url, addressProofShareholderDocArr?.[0]?.url.includes(".pdf"))} >
                                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                          </div>
                                                        </Tooltip>
                                                      </div>
                                                      </>
                                                    } 
                                                  />
                                                </Card>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("Address Proof");
                                                    setCommentModal(true);
                                                    setCommentModalData("shareholderAddressProofIdStatus");
                                                    setCommentModalKey(addressProofShareholderDocArr?.[0]?.id);
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("Address Proof");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData("shareholderAddressProofIdStatus");
                                                    setCommentModalKey(addressProofShareholderDocArr?.[0]?.id);
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <ApproverDetails
                                                modalTitle={"Address Proof"}
                                                approverDetails={
                                                  addressProofShareholderDocArr?.[0]
                                                }
                                                uploadedFile={
                                                  addressProofShareholderDocArr?.[0]
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
                                          {
                                          !['VERIFIED','REJECTED','EXPIRED'].includes(addressProofShareholderDocArr?.[0]?.status) ? (
                                            <div>
                                              <Card
                                                className=" kybcard"
                                                cover={
                                                  addressProofShareholderDocArr?.[0]?.url.includes(
                                                    ".pdf"
                                                  ) ? (
                                                    <>
                                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(addressProofShareholderDocArr?.[0]?.url) }}>
                                                        <Document
                                                          file={addressProofShareholderDocArr?.[0]?.url}
                                                          externalLinkRel="_blank"
                                                        >
                                                          <Page pageNumber={1} width={175} />
                                                        </Document>
                                                        <div className="hover-overlay">
                                                          <div>
                                                            <div className="center">
                                                              <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                            </div>
                                                            <div>
                                                              <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <Image
                                                      alt="example"
                                                      src={
                                                        addressProofShareholderDocArr?.[0]?.url
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
                                                      {"Address Proof"} 
                                                      <Tooltip
                                                        title={'Download'}
                                                        overlayClassName='custom-tooltip'
                                                        placement="left"
                                                      >
                                                        <div className="ml-2" onClick={() => handleDownload(addressProofShareholderDocArr?.[0]?.url, addressProofShareholderDocArr?.[0]?.url.includes(".pdf"))} >
                                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                                        </div>
                                                      </Tooltip>
                                                    </div>
                                                    </>
                                                  } 
                                                />
                                              </Card>
                                              {(userType === 'ADMIN' || userType === 'SENIOR_MANAGMENT' || userType === 'AUTHORIZER' || userType === 'CHECKER') && (<>
                                                <SecondaryOutLineButton
                                                  children="Approve"
                                                  className="mt-4"
                                                  onClick={() => {
                                                    setModalTitle("Address Proof");
                                                    setCommentModal(true);
                                                    setCommentModalData("shareholderAddressProofIdStatus");
                                                    setCommentModalKey(addressProofShareholderDocArr?.[0]?.id);
                                                  }}
                                                />
                                                <PrimaryOutLineButton
                                                  children="Reject"
                                                  className="mt-4 mx-3"
                                                  onClick={() => {
                                                    setModalTitle("Address Proof");
                                                    SetCommentModalReject(true);
                                                    setCommentModalData("shareholderAddressProofIdStatus");
                                                    setCommentModalKey(addressProofShareholderDocArr?.[0]?.id);
                                                  }}
                                                />
                                              </>)}
                                            </div>
                                          ) : (
                                            <ApproverDetails
                                              modalTitle={"Address Proof"}
                                              approverDetails={
                                                addressProofShareholderDocArr?.[0]
                                              }
                                              uploadedFile={
                                                addressProofShareholderDocArr?.[0]
                                                  ?.url
                                              }
                                              tab="admin"
                                            />
                                          )}
                                        </TabPane>
                                      </Tabs>
                                    ) : !['VERIFIED','REJECTED','EXPIRED'].includes(addressProofShareholderDocArr?.[0]?.status) ? (
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            addressProofShareholderDocArr?.[0]?.url.includes(
                                              ".pdf"
                                            ) ? (
                                              <>
                                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(addressProofShareholderDocArr?.[0]?.url) }}>
                                                  <Document
                                                    file={addressProofShareholderDocArr?.[0]?.url}
                                                    externalLinkRel="_blank"
                                                  >
                                                    <Page pageNumber={1} width={175} />
                                                  </Document>
                                                  <div className="hover-overlay">
                                                    <div>
                                                      <div className="center">
                                                        <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                                      </div>
                                                      <div>
                                                        <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <Image
                                                alt="example"
                                                src={
                                                  addressProofShareholderDocArr?.[0]
                                                    ?.url
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
                                                {"Address Proof"}
                                                <Tooltip
                                                  title={'Download'}
                                                  overlayClassName='custom-tooltip'
                                                  placement="left"
                                                >
                                                  <div className="ml-2" onClick={() => handleDownload(addressProofShareholderDocArr?.[0]?.url, addressProofShareholderDocArr?.[0]?.url.includes(".pdf"))} >
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
                                              setModalTitle("Address Proof");
                                              setCommentModal(true);
                                              setCommentModalData("shareholderAddressProofIdStatus");
                                              setCommentModalKey(addressProofShareholderDocArr?.[0]?.id);
                                            }}
                                          />
                                          <PrimaryOutLineButton
                                            children="Reject"
                                            className="mt-4 mx-3"
                                            onClick={() => {
                                              setModalTitle("Address Proof");
                                              SetCommentModalReject(true);
                                              setCommentModalData("shareholderAddressProofIdStatus");
                                              setCommentModalKey(addressProofShareholderDocArr?.[0]?.id);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <ApproverDetails
                                        modalTitle={"Address Proof"}
                                        approverDetails={
                                          addressProofShareholderDocArr?.[0]
                                        }
                                        uploadedFile={
                                          addressProofShareholderDocArr?.[0]?.url
                                        }
                                        tab="admin"
                                      />
                                    )}
                                  </div>
                                </Col>
                              ) : null}

                            </Row>
                          </>
                        )}
                        <hr className="lightgrayHr" />
                        <ShareholderComments
                          userType={userType}
                          shareholdersPayload={shareHoldersPayload}
                          shareholderId={id}
                          updateComment={updateComment}
                          updateApproverComment={updateApproverComment}
                          disable={disable}
                          isApprover={isApprover}
                          KYBDetails={KYBDetails}
                          validDocumentVerificationShareholder={validDocumentVerificationShareholder}
                          setValidDocumentVerificationShareholder={setValidDocumentVerificationShareholder}
                          nameAndIdVerificationShareholder={nameAndIdVerificationShareholder}
                          setNameAndIdVerificationShareholder={setNameAndIdVerificationShareholder}
                          amlScreeningShareholder={amlScreeningShareholder}
                          setAmlScreeningShareholder={setAmlScreeningShareholder}
                          adverseMediaShareholder={adverseMediaShareholder}
                          setAdverseMediaShareholder={setAdverseMediaShareholder}
                          otherCommentShareholder={otherCommentShareholder}
                          setOtherCommentShareholder={setOtherCommentShareholder}
                          shareholderCmtForm={shareholderCmtForm}
                          specialErrors={specialErrors}
                          setSpecialErrors={setSpecialErrors}
                        />
                      </>),
                    };
                  })}
                />
              </Row>
            )}
            
            
            {/* old comments code */}
          </Card>     
        </>
      ),
    },
    {
      key: 'Company',
      label: 'Company Details',
      children: (
        <>
      <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="endtoend">
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className="bg-admin-card kyc-user-details-card" style={{borderRadius:"0px"}}>
            <Col span={24} className="bg-admin-card-m-col p-0">
              <Row className="justify-content-between w-100 gap-4" gutter={{ xs: 100, sm: 50, md: 50, lg: 50 }}>
                <Col>
                  <div className="title_white">Business details</div>
                </Col>
                <Col>
                  <Button
                    className="kyb-company-card-btn mt--30"
                    onClick={() => {
                      setDownloadModal(true);
                    }}
                  >
                    Download
                  </Button>
                </Col>
              </Row>

              <Row className="w-100 row">
                <Col className="col-md-4 col-lg-4 col-xl-4 col-sm-6">
                  <div className="subtext_white mt-4 d-flex">
                    <Image src={Company} alt="company" preview={false} />
                    <div className="px-3">
                    <div className="subtext_white d-flex">
                      <Tooltip
                        title={KYBDetails?.business?.[0]?.businessName || "--"}
                        overlayClassName="custom-tooltip custom-tooltip-inner"
                        placement="topLeft"
                        arrow={false}  
                      >
                        <span className="ml-2 overflowText-escrowadvisor">
                          {KYBDetails?.business?.[0]?.businessName || "--"}
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                  </div>
                </Col>
                <Col className="col-md-4 col-lg-4 col-xl-4 col-sm-6">
                  <div className="subtext_white mt-3 d-flex">
                    <Image src={Job} alt="job" preview={false} />
                    <div className="px-3">
                      {KYBDetails?.business?.[0]?.typeOfBusiness}
                    </div>
                  </div>
                </Col>
                <Col className="col-md-4 col-lg-4 col-xl-4 col-sm-6">
                  <div className="subtext_white mt-3 d-flex">
                    <Image src={Location} alt="location" preview={false} />
                    <div className="px-3">
                      {KYBDetails?.business?.[0]?.companyAddress1}
                    </div>
                  </div>
                </Col>
                <Col className="col-md-4 col-lg-4 col-xl-4 col-sm-6">
                  <div className="subtext_white mt-3 d-flex mb-3 url-text-block">
                    <Image src={Globe} alt="website" preview={false} />
                    <div className="px-3 url-text">
                      {KYBDetails?.business?.[0]?.websiteUrl || "-"}
                    </div>
                  </div>
                </Col>
                <Col className="col-md-4 col-lg-4 col-xl-4 col-sm-6">
                <div className="subtext_white mt-3 d-flex mb-3 url-text-block">
                 <Image src={Nation} alt="country" preview={false} className="me-2"/>
                    <span className="mx-2 overflowText">
                    {KYBDetails?.business?.[0]?.companyCountry || "--"}
                    </span>
                    <div>
                    <div className="px-1 bluecard-flag">
                      {KYBDetails?.business?.[0]?.companyCountry ? (
                        <span
                          className={`fi fi-${KYBDetails?.business?.[0]?.companyCountry
                            ?.slice(0, 2)
                            ?.toLowerCase()}`}
                        />
                      ) : (
                        "--"
                      )}
                  </div>
                   </div>
                </div>
              </Col>
                <Col className="col-md-4 col-lg-4 col-xl-4 col-sm-6">
                  <div className="subtext_white mt-3 d-flex mb-3 url-text-block">
                    <Image src={Phone} alt="phone" preview={false} />
                    <div className="px-3 url-text">
                      {KYBDetails?.business?.[0]?.phoneNumber}
                    </div>
                  </div>
                </Col>

                <Col className="col-md-4 col-lg-4 col-xl-4 col-sm-6">
                  <div className="subtext_white mt-3 d-flex mb-3 url-text-block">
                    <span>TRN</span>
                    <div className="px-3 url-text">
                      {KYBDetails?.business?.[0]?.trnNumber || "---"}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <div className="subtext_white mt-4 endtoend bg-admin-card-subtext-wrap">
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} className="mt-0 bg-admin-card-col8 kyb-business-details-card">
          <Card className="p-4 h-100" style={{borderRadius:"0 0 30px 30px"}}>
            <div className="subText_medium border-left">
              <b>Business</b>
            </div>
            {KYBDetails?.documentAccuracyPercentage > 0 && (
              <>
                <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center ">
                  <Col xs={24} sm={24} md={12} lg={8}>
                    <Space className="d-flex flex-wrap">
                      <Text type="secondary"> <b>Document accuracy percentage as per OCR</b></Text>
                      <Text className="doc-accuracy-percentage"> <b>{KYBDetails?.documentAccuracyPercentage ? Math.round(KYBDetails?.documentAccuracyPercentage) + "%" : "---"}</b> </Text>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8}>
                    <Space className="d-flex flex-wrap">
                      <Text type="secondary"> <b>Trade license number</b></Text>
                      <Text > <b>{KYBDetails?.business?.[0]?.tradeLicenseNumber ? KYBDetails?.business?.[0]?.tradeLicenseNumber : "---"}</b> </Text>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8}>
                    <Space className="d-flex flex-wrap">
                      <Text type="secondary"> <b>Trade license expiry date</b></Text>
                      <Text > <b>{KYBDetails?.business?.[0]?.tradeLicenseExpiryDate && dayjs.utc(KYBDetails?.business?.[0]?.tradeLicenseExpiryDate).isValid() ? dayjs.utc(KYBDetails?.business?.[0]?.tradeLicenseExpiryDate).format('DD-MM-YYYY') : "---"}</b> </Text>
                    </Space>
                  </Col>
                </Row>
              </>
            )}  
            <Row gutter={20}>
              {KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url ? (
                <Col sm={24} md={12} lg={8} xl={8} className="my-4">
                  <div className="afterApproveCard">
                    {KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                      ?.isCompliance != null ||
                      ['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                        ?.status) ? (
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res "
                      >

                        {KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                          ?.isCompliance != null ? (
                          <TabPane tab={`Approver`} key="approver">
                            {KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                              ?.isCompliance == null ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      <>
                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].businessRegProof[0].url) }}>
                                          <PDFPreview
                                            url={KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url || ''}
                                            onPreviewClick={handlePDFView}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
                                            ?.businessRegProof?.[0]?.url
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
                                        {"Trade license proof"}
                                        <Tooltip
                                          title={'Download'}
                                          overlayClassName='custom-tooltip'
                                          placement="left"
                                        >
                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url && handleDownload(KYBDetails.documents[0].businessRegProof[0].url,KYBDetails.documents[0].businessRegProof[0].url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                      </>
                                    } 
                                  />
                                </Card>
                                <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle("Trade licence proof");
                                    setCommentModal(true);
                                    setCommentModalData(
                                      "businessRegProofStatus"
                                    );
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  onClick={() => {
                                    setModalTitle("Trade licence proof");
                                    SetCommentModalReject(true);
                                    setCommentModalData(
                                      "businessRegProofStatus"
                                    );
                                  }}
                                />
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle="Trade licence proof"
                                approverDetails={
                                  KYBDetails?.documents?.[0]
                                    ?.businessRegProof?.[0]
                                }
                                uploadedFile={
                                  KYBDetails?.documents?.[0]
                                    ?.businessRegProof?.[0]?.url
                                }
                                tab="approver"
                              />
                            )}
                          </TabPane>
                        ) : (
                          ""
                        )}

                        <TabPane tab={`Authorizer`} key="authorizer">
                          {
                          !['VERIFIED','REJECTED','EXPIRED'].includes(KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                            ?.status )  ? (
                            <div>
                              <Card
                                className=" kybcard"
                                cover={
                                  KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url.includes(
                                    ".pdf"
                                  ) ? (
                                    // <embed
                                    //   onClick={() =>
                                    //     window.open(
                                    //       KYBDetails?.documents?.[0]
                                    //         ?.businessRegProof?.[0]?.url,
                                    //       "_blank",
                                    //       "rel=noopener noreferrer"
                                    //     )
                                    //   }
                                    //   className="w-100 cursor h-175"
                                    //   src={
                                    //     KYBDetails?.documents?.[0]
                                    //       ?.businessRegProof?.[0]?.url
                                    //   }
                                    // />
                                    <>
                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].businessRegProof[0].url) }}>
                                        <PDFPreview
                                          url={KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url || ''}
                                          onPreviewClick={handlePDFView}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <Image
                                      alt="example"
                                      src={
                                        KYBDetails?.documents?.[0]
                                          ?.businessRegProof?.[0]?.url
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
                                      {"Trade license proof"}
                                      <Tooltip
                                        title={'Download'}
                                        overlayClassName='custom-tooltip'
                                        placement="left"
                                      >
                                        <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url && handleDownload(KYBDetails.documents[0].businessRegProof[0].url,KYBDetails.documents[0].businessRegProof[0].url.includes(".pdf"))} >
                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                        </div>
                                      </Tooltip>
                                    </div>
                                    </>
                                  } 
                                />
                              </Card>
                              {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle("Trade licence proof");
                                    setCommentModal(true);
                                    setCommentModalData(
                                      "businessRegProofStatus"
                                    );
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  onClick={() => {
                                    setModalTitle("Trade licence proof");
                                    SetCommentModalReject(true);
                                    setCommentModalData(
                                      "businessRegProofStatus"
                                    );
                                  }}
                                />
                              </>)}
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle="Trade licence proof"
                              approverDetails={
                                KYBDetails?.documents?.[0]
                                  ?.businessRegProof?.[0]
                              }
                              uploadedFile={
                                KYBDetails?.documents?.[0]
                                  ?.businessRegProof?.[0]?.url
                              }
                              tab="admin"
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    ) : KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                      ?.status != "VERIFIED" &&
                      KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                        ?.status != "REJECTED" ? (
                      <div className="afterApproveCard-img-card">
                        <Card
                          className=" kybcard"
                          cover={
                            KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url.includes(
                              ".pdf"
                            ) ? (
                              // <embed
                              //   onClick={() =>
                              //     window.open(
                              //       KYBDetails?.documents?.[0]
                              //         ?.businessRegProof?.[0]?.url,
                              //       "_blank",
                              //       "rel=noopener noreferrer"
                              //     )
                              //   }
                              //   className="w-100 cursor h-175"
                              //   src={
                              //     KYBDetails?.documents?.[0]
                              //       ?.businessRegProof?.[0]?.url
                              //   }
                              // />
                              <>
                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].businessRegProof[0].url) }}>
                                  <PDFPreview
                                    url={KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url || ''}
                                    onPreviewClick={handlePDFView}
                                  />
                                </div>
                              </>
                            ) : (
                              <Image
                                alt="example"
                                src={
                                  KYBDetails?.documents?.[0]
                                    ?.businessRegProof?.[0]?.url
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
                                {"Trade license proof"}
                                <Tooltip
                                  title={'Download'}
                                  overlayClassName='custom-tooltip'
                                  placement="left"
                                >
                                  <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url && handleDownload(KYBDetails.documents[0].businessRegProof[0].url,KYBDetails.documents[0].businessRegProof[0].url.includes(".pdf"))} >
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
                              setModalTitle("Trade licence proof");
                              setCommentModal(true);
                              setCommentModalData("businessRegProofStatus");
                            }}
                          />
                          <PrimaryOutLineButton
                            children="Reject"
                            className="mt-4 mx-3"
                            onClick={() => {
                              setModalTitle("Trade licence proof");
                              SetCommentModalReject(true);
                              setCommentModalData("businessRegProofStatus");
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <ApproverDetails
                        modalTitle="Trade licence proof"
                        approverDetails={
                          KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                        }
                        uploadedFile={
                          KYBDetails?.documents?.[0]?.businessRegProof?.[0]
                            ?.url
                        }
                        tab="admin"
                      />
                    )}
                  </div>
                </Col>
              ) : null}
              {/* {KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url ? (
                <Col sm={24} md={12} lg={8} xl={8} className="my-4">
                  <div className="afterApproveCard">
                    {KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                      ?.isCompliance != null ||
                      KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                        ?.status == "VERIFIED" ||
                      KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                        ?.status == "REJECTED" ? (
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res "
                      >
                        {KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                          ?.isCompliance != null ? (
                          <TabPane tab={`Approver`} key="approver">
                            {KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                              ?.isCompliance == null ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      // <embed
                                      //   onClick={() =>
                                      //     window.open(
                                      //       KYBDetails?.documents?.[0]
                                      //         ?.businessAddProof?.[0]?.url,
                                      //       "_blank",
                                      //       "rel=noopener noreferrer"
                                      //     )
                                      //   }
                                      //   className="w-100 cursor h-175"
                                      //   src={
                                      //     KYBDetails?.documents?.[0]
                                      //       ?.businessAddProof?.[0]?.url
                                      //   }
                                      // />
                                      <>
                                        <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(KYBDetails.documents[0].businessAddProof[0].url) }}>
                                          <Document
                                            file={KYBDetails.documents[0].businessAddProof[0].url}
                                            externalLinkRel="_blank"
                                          >
                                            <Page pageNumber={1} width={175} />
                                          </Document>
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
                                            ?.businessAddProof?.[0]?.url
                                        }
                                        height={175}
                                      />
                                    )
                                  }
                                >
                                  <Meta title="MOA proof" />
                                </Card>
                                <div className="d-flex align-items-center">
                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle("MOA proof");
                                      setCommentModal(true);
                                      setCommentModalData(
                                        "businessAddProofStatus"
                                      );
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle("MOA proof");
                                      SetCommentModalReject(true);
                                      setCommentModalData(
                                        "businessAddProofStatus"
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle="MOA proof"
                                approverDetails={
                                  KYBDetails?.documents?.[0]
                                    ?.businessAddProof?.[0]
                                }
                                uploadedFile={
                                  KYBDetails?.documents?.[0]
                                    ?.businessAddProof?.[0]?.url
                                }
                                tab="approver"
                              />
                            )}
                          </TabPane>
                        ) : (
                          ""
                        )}

                        <TabPane tab={`Authorizer`} key="authorizer">
                          {KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                            ?.status != "VERIFIED" &&
                            KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                              ?.status != "REJECTED" ? (
                            <div>
                              <Card
                                className=" kybcard"
                                cover={
                                  KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url.includes(
                                    ".pdf"
                                  ) ? (
                                    // <embed
                                    //   onClick={() =>
                                    //     window.open(
                                    //       KYBDetails?.documents?.[0]
                                    //         ?.businessAddProof?.[0]?.url,
                                    //       "_blank",
                                    //       "rel=noopener noreferrer"
                                    //     )
                                    //   }
                                    //   className="w-100 cursor h-175"
                                    //   src={
                                    //     KYBDetails?.documents?.[0]
                                    //       ?.businessAddProof?.[0]?.url
                                    //   }
                                    // />
                                    <>
                                      <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(KYBDetails.documents[0].businessAddProof[0].url) }}>
                                        <Document
                                          file={KYBDetails.documents[0].businessAddProof[0].url}
                                          externalLinkRel="_blank"
                                        >
                                          <Page pageNumber={1} width={175} />
                                        </Document>
                                      </div>
                                    </>
                                  ) : (
                                    <Image
                                      alt="example"
                                      src={
                                        KYBDetails?.documents?.[0]
                                          ?.businessAddProof?.[0]?.url
                                      }
                                      height={175}
                                    />
                                  )
                                }
                              >
                                <Meta title="MOA proof" />
                              </Card>
                              <div className="d-flex align-items-center">
                                {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                  <SecondaryOutLineButton
                                    children="Approve"
                                    className="mt-4"
                                    onClick={() => {
                                      setModalTitle("MOA proof");
                                      setCommentModal(true);
                                      setCommentModalData(
                                        "businessAddProofStatus"
                                      );
                                    }}
                                  />
                                  <PrimaryOutLineButton
                                    children="Reject"
                                    className="mt-4 mx-3"
                                    onClick={() => {
                                      setModalTitle("MOA proof");
                                      SetCommentModalReject(true);
                                      setCommentModalData(
                                        "businessAddProofStatus"
                                      );
                                    }}
                                  />
                                </>)}
                              </div>
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle="MOA proof"
                              approverDetails={
                                KYBDetails?.documents?.[0]
                                  ?.businessAddProof?.[0]
                              }
                              uploadedFile={
                                KYBDetails?.documents?.[0]
                                  ?.businessAddProof?.[0]?.url
                              }
                              tab="admin"
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    ) : KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                      ?.status != "VERIFIED" &&
                      KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                        ?.status != "REJECTED" ? (
                      <div className="afterApproveCard-img-card">
                        <Card
                          className=" kybcard"
                          cover={
                            KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url.includes(
                              ".pdf"
                            ) ? (
                              // <embed
                              //   onClick={() =>
                              //     window.open(
                              //       KYBDetails?.documents?.[0]
                              //         ?.businessAddProof?.[0]?.url,
                              //       "_blank",
                              //       "rel=noopener noreferrer"
                              //     )
                              //   }
                              //   className="w-100 cursor h-175"
                              //   src={
                              //     KYBDetails?.documents?.[0]
                              //       ?.businessAddProof?.[0]?.url
                              //   }
                              // />
                              <>
                                <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(KYBDetails.documents[0].businessAddProof[0].url) }}>
                                  <Document
                                    file={KYBDetails.documents[0].businessAddProof[0].url}
                                    externalLinkRel="_blank"
                                  >
                                    <Page pageNumber={1} width={175} />
                                  </Document>
                                </div>
                              </>
                            ) : (
                              <Image
                                alt="example"
                                src={
                                  KYBDetails?.documents?.[0]
                                    ?.businessAddProof?.[0]?.url
                                }
                                height={175}
                              />
                            )
                          }
                        >
                          <Meta title="MOA proof" />
                        </Card>
                        <div className="d-flex align-items-center">
                          <SecondaryOutLineButton
                            children="Approve"
                            className="mt-4"
                            onClick={() => {
                              setModalTitle("MOA proof");
                              setCommentModal(true);
                              setCommentModalData("businessAddProofStatus");
                            }}
                          />
                          <PrimaryOutLineButton
                            children="Reject"
                            className="mt-4 mx-3"
                            onClick={() => {
                              setModalTitle("MOA proof");
                              SetCommentModalReject(true);
                              setCommentModalData("businessAddProofStatus");
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <ApproverDetails
                        modalTitle="MOA proof"
                        approverDetails={
                          KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                        }
                        uploadedFile={
                          KYBDetails?.documents?.[0]?.businessAddProof?.[0]
                            ?.url
                        }
                        tab="admin"
                      />
                    )}
                  </div>
                </Col>
              ) : null} */}
              {KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url ? (
                <Col sm={24} md={12} lg={8} xl={8} className="my-4">
                  <div className="afterApproveCard">
                    {KYBDetails?.documents?.[0]?.vatDoc?.[0]
                      ?.isCompliance != null ||
                      KYBDetails?.documents?.[0]?.vatDoc?.[0]
                        ?.status == "VERIFIED" ||
                      KYBDetails?.documents?.[0]?.vatDoc?.[0]
                        ?.status == "REJECTED" ? (
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res "
                      >

                        {KYBDetails?.documents?.[0]?.vatDoc?.[0]
                          ?.isCompliance != null ? (
                          <TabPane tab={`Approver`} key="approver">
                            {KYBDetails?.documents?.[0]?.vatDoc?.[0]
                              ?.isCompliance == null ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      <>
                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].vatDoc[0].url) }}>
                                          <PDFPreview
                                            url={KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url || ''}
                                            onPreviewClick={handlePDFView}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
                                            ?.vatDoc?.[0]?.url
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
                                        {"VAT document"}
                                        <Tooltip
                                          title={'Download'}
                                          overlayClassName='custom-tooltip'
                                          placement="left"
                                        >
                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].vatDoc[0].url,KYBDetails.documents[0].vatDoc[0].url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                      </>
                                    } 
                                  />
                                </Card>
                                <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle("VAT Documents");
                                    setCommentModal(true);
                                    setCommentModalData(
                                      "vatDocStatus"
                                    );
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  disabled={ userType === "SUPPORT_ENGINEER"}
                                  onClick={() => {
                                    setModalTitle("VAT Documents");
                                    SetCommentModalReject(true);
                                    setCommentModalData(
                                      "vatDocStatus"
                                    );
                                  }}
                                />
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle="VAT Documents"
                                approverDetails={
                                  KYBDetails?.documents?.[0]
                                    ?.vatDoc?.[0]
                                }
                                uploadedFile={
                                  KYBDetails?.documents?.[0]
                                    ?.vatDoc?.[0]?.url
                                }
                                tab="approver"
                              />
                            )}
                          </TabPane>
                        ) : (
                          ""
                        )}

                        <TabPane tab={`Authorizer`} key="authorizer">
                          {KYBDetails?.documents?.[0]?.vatDoc?.[0]
                            ?.status != "VERIFIED" &&
                            KYBDetails?.documents?.[0]?.vatDoc?.[0]
                              ?.status != "REJECTED" ? (
                            <div>
                              <Card
                                className=" kybcard"
                                cover={
                                  KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url.includes(
                                    ".pdf"
                                  ) ? (
                                    <>
                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].vatDoc[0].url) }}>
                                        <PDFPreview
                                          url={KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url || ''}
                                          onPreviewClick={handlePDFView}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <Image
                                      alt="example"
                                      src={
                                        KYBDetails?.documents?.[0]
                                          ?.vatDoc?.[0]?.url
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
                                      {"VAT document"}
                                      <Tooltip
                                        title={'Download'}
                                        overlayClassName='custom-tooltip'
                                        placement="left"
                                      >
                                        <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].vatDoc[0].url,KYBDetails.documents[0].vatDoc[0].url.includes(".pdf"))} >
                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                        </div>
                                      </Tooltip>
                                    </div>
                                    </>
                                  } 
                                />
                              </Card>
                              {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle("VAT Documents");
                                    setCommentModal(true);
                                    setCommentModalData(
                                      "vatDocStatus"
                                    );
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  onClick={() => {
                                    setModalTitle("VAT Documents");
                                    SetCommentModalReject(true);
                                    setCommentModalData(
                                      "vatDocStatus"
                                    );
                                  }}
                                />
                              </>)}
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle="VAT Documents"
                              approverDetails={
                                KYBDetails?.documents?.[0]
                                  ?.vatDoc?.[0]
                              }
                              uploadedFile={
                                KYBDetails?.documents?.[0]
                                  ?.vatDoc?.[0]?.url
                              }
                              tab="admin"
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    ) : KYBDetails?.documents?.[0]?.vatDoc?.[0]
                      ?.status != "VERIFIED" &&
                      KYBDetails?.documents?.[0]?.vatDoc?.[0]
                        ?.status != "REJECTED" ? (
                      <div className="afterApproveCard-img-card">
                        <Card
                          className=" kybcard"
                          cover={
                            KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url.includes(
                              ".pdf"
                            ) ? (
                              <>
                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].vatDoc[0].url) }}>
                                  <PDFPreview
                                    url={KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url || ''}
                                    onPreviewClick={handlePDFView}
                                  />
                                </div>
                              </>
                            ) : (
                              <Image
                                alt="example"
                                src={
                                  KYBDetails?.documents?.[0]
                                    ?.vatDoc?.[0]?.url
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
                                {"VAT document"}
                                <Tooltip
                                  title={'Download'}
                                  overlayClassName='custom-tooltip'
                                  placement="left"
                                >
                                  <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].vatDoc[0].url,KYBDetails.documents[0].vatDoc[0].url.includes(".pdf"))} >
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
                              setModalTitle("VAT Documents");
                              setCommentModal(true);
                              setCommentModalData("vatDocStatus");
                            }}
                          />
                          <PrimaryOutLineButton
                            children="Reject"
                            className="mt-4 mx-3"
                            onClick={() => {
                              setModalTitle("VAT Documents");
                              SetCommentModalReject(true);
                              setCommentModalData("vatDocStatus");
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <ApproverDetails
                        modalTitle="VAT Documents"
                        approverDetails={
                          KYBDetails?.documents?.[0]?.vatDoc?.[0]
                        }
                        uploadedFile={
                          KYBDetails?.documents?.[0]?.vatDoc?.[0]
                            ?.url
                        }
                        tab="admin"
                      />
                    )}
                  </div>
                </Col>
              ) : null}
            {/* </Row>
            <Row gutter={20}> */}
              {KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url ? (
                <Col sm={24} md={12} lg={8} xl={8} className="my-4">
                  <div className="afterApproveCard">
                    {KYBDetails?.documents?.[0]?.otherDoc?.[0]
                      ?.isCompliance != null ||
                      KYBDetails?.documents?.[0]?.otherDoc?.[0]
                        ?.status == "VERIFIED" ||
                      KYBDetails?.documents?.[0]?.otherDoc?.[0]
                        ?.status == "REJECTED" ? (
                      <Tabs
                        defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                        className="d-none-res "
                      >

                        {KYBDetails?.documents?.[0]?.otherDoc?.[0]
                          ?.isCompliance != null ? (
                          <TabPane tab={`Approver`} key="approver">
                            {KYBDetails?.documents?.[0]?.otherDoc?.[0]
                              ?.isCompliance == null ? (
                              <div>
                                <Card
                                  className=" kybcard"
                                  cover={
                                    KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url.includes(
                                      ".pdf"
                                    ) ? (
                                      <>
                                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].otherDoc[0].url) }}>
                                          <PDFPreview
                                            url={KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url || ''}
                                            onPreviewClick={handlePDFView}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
                                            ?.otherDoc?.[0]?.url
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
                                        {"Other document"}
                                        <Tooltip
                                          title={'Download'}
                                          overlayClassName='custom-tooltip'
                                          placement="left"
                                        >
                                          <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].otherDoc[0].url,KYBDetails.documents[0].otherDoc[0].url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                      </>
                                    } 
                                  />
                                </Card>
                                <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle("Other Documents");
                                    setCommentModal(true);
                                    setCommentModalData(
                                      "otherDocStatus"
                                    );
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  onClick={() => {
                                    setModalTitle("Other Documents");
                                    SetCommentModalReject(true);
                                    setCommentModalData(
                                      "otherDocStatus"
                                    );
                                  }}
                                />
                              </div>
                            ) : (
                              <ApproverDetails
                                modalTitle="Other Documents"
                                approverDetails={
                                  KYBDetails?.documents?.[0]
                                    ?.otherDoc?.[0]
                                }
                                uploadedFile={
                                  KYBDetails?.documents?.[0]
                                    ?.otherDoc?.[0]?.url
                                }
                                tab="approver"
                              />
                            )}
                          </TabPane>
                        ) : (
                          ""
                        )}

                        <TabPane tab={`Authorizer`} key="authorizer">
                          {KYBDetails?.documents?.[0]?.otherDoc?.[0]
                            ?.status != "VERIFIED" &&
                            KYBDetails?.documents?.[0]?.otherDoc?.[0]
                              ?.status != "REJECTED" ? (
                            <div>
                              <Card
                                className=" kybcard"
                                cover={
                                  KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url.includes(
                                    ".pdf"
                                  ) ? (
                                    <>
                                      <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].otherDoc[0].url) }}>
                                        <PDFPreview
                                          url={KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url || ''}
                                          onPreviewClick={handlePDFView}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <Image
                                      alt="example"
                                      src={
                                        KYBDetails?.documents?.[0]
                                          ?.otherDoc?.[0]?.url
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
                                      {"Other document"}
                                      <Tooltip
                                        title={'Download'}
                                        overlayClassName='custom-tooltip'
                                        placement="left"
                                      >
                                        <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].otherDoc[0].url,KYBDetails.documents[0].otherDoc[0].url.includes(".pdf"))} >
                                          <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                        </div>
                                      </Tooltip>
                                    </div>
                                    </>
                                  } 
                                />
                              </Card>
                              {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (<>
                                <SecondaryOutLineButton
                                  children="Approve"
                                  className="mt-4"
                                  onClick={() => {
                                    setModalTitle("Other Documents");
                                    setCommentModal(true);
                                    setCommentModalData(
                                      "otherDocStatus"
                                    );
                                  }}
                                />
                                <PrimaryOutLineButton
                                  children="Reject"
                                  className="mt-4 mx-3"
                                  onClick={() => {
                                    setModalTitle("Other Documents");
                                    SetCommentModalReject(true);
                                    setCommentModalData(
                                      "otherDocStatus"
                                    );
                                  }}
                                />
                              </>)}
                            </div>
                          ) : (
                            <ApproverDetails
                              modalTitle="Other Documents"
                              approverDetails={
                                KYBDetails?.documents?.[0]
                                  ?.otherDoc?.[0]
                              }
                              uploadedFile={
                                KYBDetails?.documents?.[0]
                                  ?.otherDoc?.[0]?.url
                              }
                              tab="admin"
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    ) : KYBDetails?.documents?.[0]?.otherDoc?.[0]
                      ?.status != "VERIFIED" &&
                      KYBDetails?.documents?.[0]?.otherDoc?.[0]
                        ?.status != "REJECTED" ? (
                      <div className="afterApproveCard-img-card">
                        <Card
                          className=" kybcard"
                          cover={
                            KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url.includes(
                              ".pdf"
                            ) ? (
                              <>
                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(KYBDetails.documents[0].otherDoc[0].url) }}>
                                  <PDFPreview
                                    url={KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url || ''}
                                    onPreviewClick={handlePDFView}
                                  />
                                </div>
                              </>
                            ) : (
                              <Image
                                alt="example"
                                src={
                                  KYBDetails?.documents?.[0]
                                    ?.otherDoc?.[0]?.url
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
                                {"Other document"}
                                <Tooltip
                                  title={'Download'}
                                  overlayClassName='custom-tooltip'
                                  placement="left"
                                >
                                  <div className="ml-2" onClick={() => KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url && handleDownload(KYBDetails.documents[0].otherDoc[0].url,KYBDetails.documents[0].otherDoc[0].url.includes(".pdf"))} >
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
                              setModalTitle("Other Documents");
                              setCommentModal(true);
                              setCommentModalData("otherDocStatus");
                            }}
                          />
                          <PrimaryOutLineButton
                            children="Reject"
                            className="mt-4 mx-3"
                            onClick={() => {
                              setModalTitle("Other Documents");
                              SetCommentModalReject(true);
                              setCommentModalData("otherDocStatus");
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <ApproverDetails
                        modalTitle="Other Documents"
                        approverDetails={
                          KYBDetails?.documents?.[0]?.otherDoc?.[0]
                        }
                        uploadedFile={
                          KYBDetails?.documents?.[0]?.otherDoc?.[0]
                            ?.url
                        }
                        tab="admin"
                      />
                    )}
                  </div>
                </Col>
              ) : null}
            </Row>
        <Row gutter={20}>
          {KYBDetails && KYBDetails?.moaDocuments && KYBDetails?.moaDocuments.map((doc:any, index:any) => {
        
        return (
          <Col sm={24} md={12} lg={8} xl={8} className="my-4" key={index}>
            <div className="afterApproveCard">
              {doc?.isCompliance != null || doc?.status === "VERIFIED" || doc?.status === "REJECTED" ? (
                <Tabs
                  defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                  className="d-none-res"
                >
                  {doc?.isCompliance != null && (
                    <TabPane tab={`Approver`} key="approver">
                      {doc?.isCompliance == null ? (
                        <div>
                          <Card
                            className="kybcard"
                            cover={
                              doc?.url.includes(".pdf") ? (
                                <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(doc.url) }}>
                                  <Document file={doc.url} externalLinkRel="_blank">
                                    <Page pageNumber={1} width={175} />
                                  </Document>
                                  <div className="hover-overlay">
                                    <div>
                                      <div className="center">
                                        <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                      </div>
                                      <div>
                                        <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Image alt="example" src={doc?.url} height={175} />
                              )
                            }
                          >
                            <Meta 
                              title={
                                <>
                                <div className="d-flex justify-content-between align-items-center">
                                  {"MOA document"}
                                  <Tooltip
                                    title={'Download'}
                                    overlayClassName='custom-tooltip'
                                    placement="left"
                                  >
                                    <div className="ml-2" onClick={() => handleDownload(doc?.url, doc?.url.includes(".pdf"))} >
                                      <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                    </div>
                                  </Tooltip>
                                </div>
                                </>
                              } 
                            />
                          </Card>
                          <SecondaryOutLineButton
                            children="Approve"
                            className="mt-4"
                            onClick={() => {
                              setModalTitle("MOA Documents");
                              setCommentModal(true);
                              setCommentModalData("moaDocStatus");
                              setCommentModalKey(generateDynamicKey("moaDoc_", doc?.id));
                            }}
                          />
                          <PrimaryOutLineButton
                            children="Reject"
                            className="mt-4 mx-3"
                            onClick={() => {
                              setModalTitle("MOA Documents");
                              SetCommentModalReject(true);
                              setCommentModalData("moaDocStatus");
                              setCommentModalKey(generateDynamicKey("moaDoc_",doc?.id));
                            }}
                          />
                        </div>
                      ) : (
                        <ApproverDetails
                          modalTitle="MOA Documents"
                          approverDetails={doc}
                          uploadedFile={doc.url}
                          tab="approver"
                        />
                      )}
                    </TabPane>
                  )}
                  <TabPane tab={`Authorizer`} key="authorizer">
                    {doc?.status !== "VERIFIED" && doc?.status !== "REJECTED" ? (
                      <div>
                        <Card
                          className="kybcard"
                          cover={
                            doc?.url.includes(".pdf") ? (
                              <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(doc.url) }}>
                                <Document file={doc.url} externalLinkRel="_blank">
                                  <Page pageNumber={1} width={175} />
                                </Document>
                                <div className="hover-overlay">
                                  <div>
                                    <div className="center">
                                      <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                                    </div>
                                    <div>
                                      <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Image alt="example" src={doc?.url} height={175} />
                            )
                          }
                        >
                          <Meta 
                            title={
                              <>
                              <div className="d-flex justify-content-between align-items-center">
                                {"MOA document"}
                                <Tooltip
                                  title={'Download'}
                                  overlayClassName='custom-tooltip'
                                  placement="left"
                                >
                                  <div className="ml-2" onClick={() => handleDownload(doc?.url, doc?.url.includes(".pdf"))} >
                                    <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                  </div>
                                </Tooltip>
                              </div>
                              </>
                            } 
                          />
                        </Card>
                        {['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) && (
                          <>
                            <SecondaryOutLineButton
                              children="Approve"
                              className="mt-4"
                              onClick={() => {
                                setModalTitle("MOA Documents");
                                setCommentModal(true);
                                setCommentModalData("moaDocStatus");
                                setCommentModalKey(generateDynamicKey("moaDoc_", doc?.id));
                              }}
                            />
                            <PrimaryOutLineButton
                              children="Reject"
                              className="mt-4 mx-3"
                              onClick={() => {
                                setModalTitle("MOA Documents");
                                SetCommentModalReject(true);
                                setCommentModalData("moaDocStatus");
                                setCommentModalKey(generateDynamicKey("moaDoc_", doc?.id));
                              }}
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <ApproverDetails
                        modalTitle="MOA Documents"
                        approverDetails={doc}
                        uploadedFile={doc.url}
                        tab="admin"
                      />
                    )}
                  </TabPane>
                </Tabs>
              ) : doc?.status !== "VERIFIED" && doc?.status !== "REJECTED" ? (
                <div className="afterApproveCard-img-card">
                  <Card
                    className="kybcard"
                    cover={
                      doc?.url.includes(".pdf") ? (
                        <div className="admin-panel-pdf-preview pdf-preview-container" onClick={() => { handlePDFView(doc.url) }}>
                          <Document file={doc.url} externalLinkRel="_blank">
                            <Page pageNumber={1} width={175} />
                          </Document>
                          <div className="hover-overlay">
                            <div>
                              <div className="center">
                                <EyeOutlined style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "400" }} />
                              </div>
                              <div>
                                <span className="hover-preview-text" style={{ color: "#FFFFFF", fontWeight: "600" }}>Preview</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Image alt="example" src={doc?.url} height={175} />
                      )
                    }
                  >
                    <Meta 
                      title={
                        <>
                        <div className="d-flex justify-content-between align-items-center">
                          {"MOA document"}
                          <Tooltip
                            title={'Download'}
                            overlayClassName='custom-tooltip'
                            placement="left"
                          >
                            <div className="ml-2" onClick={() => handleDownload(doc?.url, doc?.url.includes(".pdf"))} >
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
                        setModalTitle("MOA Documents");
                        setCommentModal(true);
                        setCommentModalData("moaDocStatus");
                        setCommentModalKey(generateDynamicKey("moaDoc_", doc?.id));
                      }}
                    />
                    <PrimaryOutLineButton
                      children="Reject"
                      className="mt-4 mx-3"
                      onClick={() => {
                        setModalTitle("MOA Documents");
                        SetCommentModalReject(true);
                        setCommentModalData("moaDocStatus");
                        setCommentModalKey(generateDynamicKey("moaDoc_", doc?.id));
                      }}
                    />
                  </div>
                </div>
                 ) : (
                <ApproverDetails
                  modalTitle="MOA Documents"
                  approverDetails={doc}
                  uploadedFile={doc.url}
                  tab="admin"
                />
              )}
            </div>
          </Col>
        );
      })}
        </Row>

 

        <hr className="lightgrayHr" />
        <Form >
        <Row className="mt-3">
          <div className="w-100">
            <Checkbox
              disabled={
                isApprover
                  ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                  : KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                    ? true
                    : false
                    || userType === "SUPPORT_ENGINEER"
              }
              checked={
                validDocumentVerification
              }
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
                defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                className="d-none-res  mx-4 my-2"
              >
                <TabPane tab={`Approver`} key="approver">
                  {KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" ? (
                    <div className="commentBox mt-2 mx-2">
                      {KYBDetails?.approverComments
                        ?.validDocumentVerificationComment
                        ? KYBDetails?.approverComments
                          ?.validDocumentVerificationComment
                        : "N/A"}
                    </div>
                  ) : (
                    <Form.Item
                      name="validDocumentVerificationApprover"
                      rules={
                        isApprover ?
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
                              validator:async (_, value) => {
                                await validateCommentField(value, "validDocumentVerificationApprover", setSpecialErrors);
                                if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                              },
                            },
                          ] : []}
                      className="checklist w-100"
                    >
                      <TextArea
                        rows={2}
                        placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                        className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                        // onInput={handleInput}
                        id="validDocumentVerificationApprover"
                        onChange={(e) => updateApproverComment("validDocumentVerification", e?.target?.value)}
                        defaultValue={checkboxCommentApprover?.validDocumentVerification}
                        disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                      />
                    </Form.Item>
                  )}
                </TabPane>
                <TabPane tab={`Authorizer`} key="authorizer">
                  <div className="w-100">
                    {KYBDetails?.kybStatus === "VERIFIED" ||
                      KYBDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYBDetails?.adminComments
                          ?.validDocumentVerificationComment
                          ? KYBDetails?.adminComments
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
                          disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                          onChange={(e:any) => updateComment("validDocumentVerification", e)}
                        />
                      </Form.Item>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Row>
        <Row className="my-4">
          <div className="w-100">
            <Checkbox
              disabled={
                isApprover
                  ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                  : KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                    ? true
                    : false
                    || userType === "SUPPORT_ENGINEER"
              }
              checked={
                nameAndIdVerification
              }
              onClick={() => {
                setNameAndIdVerification(!nameAndIdVerification);
              }}
            >
              <div className="subText mx-1 ">Name & id verification</div>
            </Checkbox>
            <div className="afterApproveCard">
              <Tabs
                defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                className="d-none-res  mx-4 my-2"
              >
                <TabPane tab={`Approver`} key="approver">
                  {KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" ? (
                    <div className="commentBox mt-2 mx-2">
                      {KYBDetails?.approverComments
                        ?.nameAndIdVerificationComment
                        ? KYBDetails?.approverComments
                          ?.nameAndIdVerificationComment
                        : "N/A"}
                    </div>
                  ) : (
                    <Form.Item
                      name="nameAndIdVerificationApprover"
                      rules={
                        isApprover ?
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
                              validator: async(_, value) => {
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
                        onChange={(e) => updateApproverComment("nameAndIdVerification", e?.target?.value)}
                        disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                      />
                    </Form.Item>
                  )}
                </TabPane>
                <TabPane tab={`Authorizer`} key="authorizer">
                  <div className="w-100">
                    {KYBDetails?.kybStatus === "VERIFIED" ||
                      KYBDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYBDetails?.adminComments
                          ?.nameAndIdVerificationComment
                          ? KYBDetails?.adminComments
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
                            ] : []}
                        className="checklist"
                      >
                        <TextArea
                          rows={2}
                          placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                          className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                          // onInput={handleInput}
                          id="nameAndIdVerification"
                          defaultValue={checkboxComment?.nameAndIdVerification}
                          onChange={(e:any) => updateComment("nameAndIdVerification", e)}
                          disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                        />
                      </Form.Item>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Row>
        <Row className="my-4">
          <div className="w-100">
            <Checkbox
              disabled={
                isApprover
                  ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                  : KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
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
                defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                className="d-none-res  mx-4 my-2"
              >
                <TabPane tab={`Approver`} key="approver">
                  {KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" ? (
                    <div className="commentBox mt-2 mx-2">
                      {KYBDetails?.approverComments?.amlScreeningComment
                        ? KYBDetails?.approverComments
                          ?.amlScreeningComment
                        : "N/A"}
                    </div>
                  ) : (
                    <Form.Item
                      name="amlScreeningApprover"
                      rules={
                        isApprover ?
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
                        onChange={(e) => updateApproverComment("amlScreening", e?.target?.value)}
                        disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                      />
                    </Form.Item>
                  )}
                </TabPane>
                <TabPane tab={`Authorizer`} key="authorizer">
                  <div className="w-100">
                    {KYBDetails?.kybStatus === "VERIFIED" ||
                      KYBDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYBDetails?.adminComments?.amlScreeningComment
                          ? KYBDetails?.adminComments?.amlScreeningComment
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
                          onChange={(e:any) =>updateComment("amlScreening",e)}
                          disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                        />
                      </Form.Item>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Row>
        <Row className="my-4">
          <div className="w-100">
            <Checkbox
              disabled={
                isApprover
                  ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                  : KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
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
                defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                className="d-none-res mx-4 my-2"
              >
                <TabPane tab={`Approver`} key="approver">
                  {KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" ? (
                    <div className="commentBox mt-2 mx-2">
                      {KYBDetails?.approverComments?.adverseMediaComment
                        ? KYBDetails?.approverComments
                          ?.adverseMediaComment
                        : "N/A"}
                    </div>
                  ) : (
                    <Form.Item
                      name="adverseMediaApprover"
                      rules={
                        isApprover ?
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
                        onChange={(e) => updateApproverComment("adverseMedia", e?.target?.value)}
                        disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                      />
                    </Form.Item>
                  )}
                </TabPane>
                <TabPane tab={`Authorizer`} key="authorizer">
                  <div className="w-100">
                    {KYBDetails?.kybStatus === "VERIFIED" ||
                      KYBDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYBDetails?.adminComments?.adverseMediaComment
                          ? KYBDetails?.adminComments?.adverseMediaComment
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
                          onChange={(e:any) =>updateComment("adverseMedia", e)}
                          disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                        />
                      </Form.Item>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Row>
        <Row className="my-4">
          <div className="w-100">
            <Checkbox
              disabled={
                isApprover
                  ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
                  : KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
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
                defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
                className="d-none-res mx-4 my-2"
              >
                <TabPane tab={`Approver`} key="approver">
                  {KYBDetails?.kybStatus === "VERIFIED" ||
                    KYBDetails?.kybStatus === "REJECTED" ? (
                    <div className="commentBox mt-2 mx-2">
                      {KYBDetails?.approverComments?.otherCommentAndNotes
                        ? KYBDetails?.approverComments
                          ?.otherCommentAndNotes
                        : "N/A"}
                    </div>
                  ) : (
                    <Form.Item
                      name="otherCommentAndNotesApprover"
                      rules={
                        isApprover ?
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
                              validator:async (_, value) => {
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
                        onChange={(e) => updateApproverComment("otherCommentAndNotes", e?.target?.value)}
                        disabled={!isApprover || disable  || userType === "SUPPORT_ENGINEER"}
                      />
                    </Form.Item>
                  )}
                </TabPane>
                <TabPane tab={`Authorizer`} key="authorizer">
                  <div className="w-100">
                    {KYBDetails?.kybStatus === "VERIFIED" ||
                      KYBDetails?.kybStatus === "REJECTED" ? (
                      <div className="commentBox mt-2 mx-2">
                        {KYBDetails?.adminComments?.otherCommentAndNotes
                          ? KYBDetails?.adminComments?.otherCommentAndNotes
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
                          onChange={(e:any) =>updateComment("otherCommentAndNotes", e)}
                          disabled={isApprover || disable  || userType === "SUPPORT_ENGINEER"}
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
          </Card>
        </Col>
      </Row>
     
      </>
      ),
    },
  ];

  const areAllCommentsFilled = (comments: Record<string, any>) =>
    Object.values(comments).every(comment =>
      typeof comment === 'string' && comment.trim() !== ''
    );

  const useShareholderEndComments = (data: any, activeShareholderTab: any) => {
    const getComment = (field: any) => getShareholderComment(data?.shareholdersPayload, activeShareholderTab, field);

    const comments = {
      amlScreening: getComment('amlScreeningComment'),
      adverseMedia: getComment('adverseMediaComment'),
      nameAndIdVerification: getComment('nameAndIdVerificationComment'),
      validDocumentVerification: getComment('validDocumentVerificationComment'),
      otherCommentAndNotes: getComment('otherCommentAndNotes'),
    };

    const approverComments = {
      amlScreening: getComment('trusteeAmlScreeningComment'),
      adverseMedia: getComment('trusteeAdverseMediaComment'),
      nameAndIdVerification: getComment('trusteeNameAndIdVerificationComment'),
      validDocumentVerification: getComment('trusteeValidDocumentVerificationComment'),
      otherCommentAndNotes: getComment('trusteeOtherCommentAndNotes'),
    };

    return {
      endComment: areAllCommentsFilled(comments) ? getComment('endComment') : '',
      approverEndComment: areAllCommentsFilled(approverComments) ? getComment('trusteeComment') : ''
    };
  };
  
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
      } else {
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
 
  let endComment = '';
  let approverEndComment = '';
  if (isApprover) {
    if (activeTab === 'Representative') {
      approverEndComment = KYBDetails?.trusteeRepresentativeComment;
      endComment = KYBDetails?.representativeComment;
      approverEndComment = KYBDetails?.trusteeRepresentativeComment;
      endComment = KYBDetails?.representativeComment;
    } else if (activeTab === 'Shareholder') {
      // approverEndComment = getShareholderComment(KYBDetails?.shareholdersPayload,activeShareholderTab, 'trusteeComment');
      // endComment = getShareholderComment(KYBDetails?.shareholdersPayload,activeShareholderTab, 'endComment');
      const { endComment: shareholderEndComment, approverEndComment: shareholderApproverEndComment } =
        useShareholderEndComments(KYBDetails, activeShareholderTab);
      endComment = shareholderEndComment;
      approverEndComment = shareholderApproverEndComment;

    } else {
      approverEndComment = KYBDetails?.trusteeComment;
      endComment = KYBDetails?.comment
    }
  } else {
    if (KYBDetails?.kybStatus == 'REJECTED') {
      endComment = KYBDetails?.reason;
    } else if (activeTab === 'Representative') {
      endComment = KYBDetails?.representativeComment ?? KYBDetails?.comment;
      approverEndComment = KYBDetails?.trusteeRepresentativeComment ?? KYBDetails?.trusteeComment;
    } else if (activeTab === 'Shareholder') {
      // endComment = getShareholderComment(KYBDetails?.shareholdersPayload,activeShareholderTab, 'endComment')
      // approverEndComment = getShareholderComment(KYBDetails?.shareholdersPayload,activeShareholderTab, 'trusteeComment')
      const { endComment: shareholderEndComment, approverEndComment: shareholderApproverEndComment } =
        useShareholderEndComments(KYBDetails, activeShareholderTab);
      endComment = shareholderEndComment;
      approverEndComment = shareholderApproverEndComment;

    } else {
      endComment = KYBDetails?.comment;
      approverEndComment = KYBDetails?.trusteeComment;
    }
  }

  const getApproverVerifiedDateTime = () => {
    const verifiedDate = KYBDetails?.verifiedDate;
    if (!verifiedDate) return KYBDetails?.updatedAt;

    if (activeTab === 'Representative') {
      if (representativeAsShareholderIndex != null) {
        const datesArray = verifiedDate?.approverShareholderVerifiedDate;
        if (Array.isArray(datesArray) && datesArray?.length > 0) {
          const earliest = datesArray.reduce((min, curr) => (curr.id < min.id ? curr : min));
          return earliest.date;
        }
        return KYBDetails?.updatedAt;
      } else {
        return verifiedDate?.approverRepresentativeVerifiedDate || KYBDetails?.updatedAt;
      }
    } else if (activeTab === 'Shareholder') {
      const dates = verifiedDate?.approverShareholderVerifiedDate;
      if (Array.isArray(dates) && dates.length > 0) {
        return dates.reduce((latest, current) =>
          moment(current.date).isAfter(moment(latest.date)) ? current : latest
        )?.date;
      }
    } else {
      return verifiedDate?.approverCompanyVerifiedDate || KYBDetails?.updatedAt;
    }

    return KYBDetails?.updatedAt;
  };

  const getAuthorizerVerifiedDateTime = () => {
    const verifiedDate = KYBDetails?.verifiedDate;
    if (!verifiedDate) return KYBDetails?.updatedAt;

    if (activeTab === 'Representative') {
      return verifiedDate?.authorizerRepresentativeVerifiedDate || KYBDetails?.updatedAt;
    } else if (activeTab === 'Shareholder') {
      const dates = verifiedDate?.authorizerShareholderVerifiedDate;
      if (Array.isArray(dates) && dates.length > 0) {
        return dates.reduce((latest, current) =>
          moment(current.date).isAfter(moment(latest.date)) ? current : latest
        )?.date;
      }
    } else {
      return verifiedDate?.authorizerCompanyVerifiedDate || KYBDetails?.updatedAt;
    }

    return KYBDetails?.updatedAt;
  };

  return (
    <div className="m-main-body-section scrollbar-container">
      <DefaultLayout
        page="kyb_management"
        loading={loading}
        TitleText="KYB Details"
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
              <b> KYB Details</b>
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
                  //   navigate(KYBManagementList);
                  // }}
                >
                  Management
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="cursor"
                  onClick={() => {
                    navigate(KYBManagementList);
                  }}
                >
                  KYB management
                </Breadcrumb.Item>
                <Breadcrumb.Item>KYB details</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
        <div className="d-flex w-100 overflow-auto dashboardTabs escrow-tran-card">
          <Tabs
            defaultActiveKey="KybDetails"
            className="tableTab overflow-auto "
            activeKey={bankActiveTab}
            onChange={onBankActiveTab}
          >
            <TabPane tab={"KYB Details"} key="kybDetails"></TabPane>
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
        {bankActiveTab === "kybDetails" &&
        <>
       <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} className="endtoend">
              <Col sm={24} md={24} lg={15}  className="w-100">
                <div className="bg-admin-card w-100 kyc-user-details-card">
                  <Col span={24} className="bg-admin-card-m-col w-100">
                    <div className="d-flex card-items-row">
                      <Col sm={24} md={24} lg={24} className="mr-25 bg-admin-card-m-col p-0">
                        <div className="title_white">
                          {KYBDetails?.business?.[0]?.businessName || "--"}
                        </div>
                        <div className="subtext_white mt-3 ">
                          {
                            COMPANY_ROLE[
                              KYBDetails?.representative?.[0]?.roleType
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
                          <Image src={EmailIcon} alt="email" preview={false} />
                          <Tooltip title={KYBDetails?.basic?.[0]?.email} overlayClassName="custom-tooltip">
                            <span className="ml-4 overflowText ">
                              {KYBDetails?.basic?.[0]?.email}
                            </span>
                          </Tooltip>
                        </div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Phone} alt="phone" preview={false} />
                          <Tooltip title={KYBDetails?.basic?.[0]?.contactNumber} overlayClassName="custom-tooltip">
                          <span className="ml-4 overflowText">
                            {KYBDetails?.basic?.[0]?.contactNumber}
                          </span>
                          </Tooltip>
                        </div>
                      </div>
                      <div>
                        <div className="subtext_white mt-3 d-flex">
                          <Image src={Nation} alt="country" preview={false} className="me-2"/>
                          <Tooltip title={KYBDetails?.basic?.[0]?.countryName ?? KYBDetails?.KYBDetails?.[0]?.country} overlayClassName="bluecard-custom-tooltip">
                          <span className="mx-2 overflowText">
                            {KYBDetails?.basic?.[0]?.country ?? KYBDetails?.KYBDetails?.[0]?.country }
                          </span>
                          </Tooltip>
                          <div>
                          <div className="px-1 bluecard-flag">
                          <span>
                          {(KYBDetails?.basic?.[0]?.country || KYBDetails?.KYBDetails?.[0]?.country)
                            ? (
                              <span
                                className={`fi fi-${String(
                                  KYBDetails?.basic?.[0]?.country || KYBDetails?.KYBDetails?.[0]?.country
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
                            {ENTITY_TYPE[KYBDetails?.basic?.[0]?.typeOfEntity]}
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
                    <Image src={DocIcon} alt="company" preview={false} />
                    <span className="px-3">
                      {KYBDetails?.representative?.[0]?.repDocNumber}
                    </span>
                    <span className="px-1 stepDetails_sub">
                      ( ID Number )
                    </span>
                  </div>
                  <div className="subText_small bold mt-3 ">
                    <Image src={JobIcon} alt="company" preview={false} />
                    <span className="px-3">
                      {KYBDetails?.representative?.[0]?.repExpiryDate ? dayjs.utc(KYBDetails?.representative?.[0]?.repExpiryDate).format("DD-MM-YYYY") : "---"}
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
          representativeDetails={representativeDetails}
          shareHoldingCompanyDigiScreeningPayload={shareHoldingCompanyDigiScreeningPayload}
          shareHoldingCompanyDigiScreeningResponse={shareHoldingCompanyDigiScreeningResponse}
        />
        {/* KYB Risk Assesment Card */}
        <RiskAssesmentCard riskAssessment={riskAssessment} />
        <Card className="mb-4 mt-3 details-card">
          <div className="subText_medium border-left">
            <b>Address Details</b>
          </div>
          <AddressDetails AddressData={KYBDetails?.business?.[0]} type="kyb" />
        </Card>
        <Card className="mb-4 mt-3 details-card">
          <div className="subText_medium border-left">
            <b>FATCA Details</b>
          </div>
          <Row className="mt-3 row">
            <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col >
                <Space direction="vertical">
                  <Text type="secondary"> <b>Are you registered or incorporated Tax resident of any other country other than UAE?</b></Text>
                  <Text> <b>{toTitleCase(kybFATCAPayload?.kybincorporatedTaxResident) ?? "---"}</b> </Text>
                </Space>
              </Col>
            </Row>
            {kybFATCAPayload?.kybincorporatedTaxResident === 'yes' && (<>
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col >
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Tax Residency country.</b></Text>
                    <Text> <b>{kybFATCAPayload?.kybTaxResidencyCountry ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col >
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Do you have a Tax identification number?</b></Text>
                    <Text> <b>{toTitleCase(kybFATCAPayload?.hasKybTIN) ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col>
                  {kybFATCAPayload?.hasKybTIN == 'yes' && (
                    <Space direction="vertical">
                      <Text type="secondary"> <b>Tax identification number</b></Text>
                      <Text> <b>{kybFATCAPayload?.kybTinNo ?? "---"}</b> </Text>
                    </Space>
                  )}
                  {kybFATCAPayload?.hasKybTIN == 'no' && (
                    <Space direction="vertical">
                      <Text type="secondary"> <b>Reason for no TIN Number</b></Text>
                      <Text> <b>{kybFATCAPayload?.kybNoTinReason === "countryNotissueTINs" ? "Country/ Jurisdiction does not issue TINs." : kybFATCAPayload?.kybNoTinReason === "countryNotRequirToProvideTIN" ? "Country/ Jurisdiction does not require me to provide TIN." : kybFATCAPayload?.kybNoTinReason === "unableToObtainTIN" ? "Unable to obtain a TIN." : ""}</b> </Text>
                    </Space>
                  )}
                </Col>
              </Row>

              <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                <Col >
                  <Space direction="vertical">
                    <Text type="secondary"> <b>Do you have multiple Jurisdiction where your company registered? </b></Text>
                    <Text> <b>{toTitleCase(kybFATCAPayload?.hasMultipleJurisdictionCompany) ?? "---"}</b> </Text>
                  </Space>
                </Col>
              </Row>
              {kybFATCAPayload?.hasMultipleJurisdictionCompany === 'yes' && (
                <>
                  <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
                    <Col >
                      <Space direction="vertical">
                        <Text type="secondary"> <b>How many country?.</b></Text>
                        <Text> <b>{kybFATCAPayload?.kybNumberOfCountry ?? "---"}</b> </Text>
                      </Space>
                    </Col>
                  </Row>
                  {renderMultipleJurisdictionRows()}
                </>
              )}
            </>)}
            <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col >
                <Space direction="vertical">
                  <Text type="secondary"> <b>Are you a Passive NFE?</b></Text>
                  <Text> <b>{toTitleCase(kybFATCAPayload?.hasPassiveNFE) ?? "---"}</b> </Text>
                </Space>
              </Col>
            </Row>
            {kybFATCAPayload?.hasPassiveNFE === 'yes' && (<>
              <div className="subText_medium border-left">
                <b>Controllers</b>
              </div>
              {(kybFATCAPayload?.isAgreeKYBFATCA && kybFATCAColtrollersPayload?.length > 0) && (
                <Tabs
                  className="w-100 kyb_tabs"
                  type="card"
                  items={kybFATCAColtrollersPayload?.map((item: any, i: any) => {
                    const id = String(i + 1);
                    return {
                      label: `Controller ${id}`,
                      key: id,
                      children: (<>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center justify-content-between">
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Full name</b></Text>
                              <Text> <b>{item?.FullName ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Date of birth</b></Text>
                              <Text> <b>{item?.controllerDob ? dayjs.utc(item?.controllerDob).format("DD-MM-YYYY") : "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Country of Birth</b></Text>
                              <Text> <b>{item?.birthCountry ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center justify-content-between">
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Current residence address </b></Text>
                              <Text> <b>{item?.currentResidenceAddress ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Country</b></Text>
                              <Text> <b>{item?.country ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Country of Tax Residence</b></Text>
                              <Text> <b>{item?.taxResidenceCountry ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="d-flex align-items-center justify-content-between">
                          <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                            <Space direction="vertical">
                              <Text type="secondary"> <b>Do you have a Tax identification number</b></Text>
                              <Text> <b>{toTitleCase(item?.hasControllerTIN) ?? "---"}</b> </Text>
                            </Space>
                          </Col>
                          {item?.hasControllerTIN === 'yes' && (
                            <Col className="mb-4" xs={24} sm={12} md={12} lg={6}>
                              <Space direction="vertical">
                                <Text type="secondary"> <b>Tax identification number</b></Text>
                                <Text> <b>{item?.controllerTinNo ?? "---"}</b> </Text>
                              </Space>
                            </Col>
                          )}
                          {item?.hasControllerTIN === 'no' && (

                            <Col xs={24} sm={12} md={12} lg={6}>
                              <Space direction="vertical">
                                <Text type="secondary"> <b>Reason for no TIN Number</b></Text>
                                <Text> <b>{item?.controllerNoTinReason === "countryNotissueTINs" ? "Country/ Jurisdiction does not issue TINs." : item?.controllerNoTinReason === "countryNotRequirToProvideTIN" ? "Country/ Jurisdiction does not require me to provide TIN." : item?.controllerNoTinReason === "unableToObtainTIN" ? "Unable to obtain a TIN." : ""}</b> </Text>
                              </Space>
                            </Col>
                          )}
                          <Col xs={24} sm={12} md={12} lg={6}></Col>
                        </Row>
                      </>),
                    };
                  })}
                />
              )}
            </>)}
            <Row className="col-md-6 mb-4 d-flex align-items-center gap-5">
              <Col>
                <Space direction="vertical">
                  <Text type="secondary"> <b>I agree to the FATCA/CRS declaration </b></Text>
                  <Text> <b> {kybFATCAPayload?.isAgreeKYBFATCA && kybFATCAPayload?.isAgreeKYBFATCA === true ? "Yes" : kybFATCAPayload?.isAgreeKYBFATCA && kybFATCAPayload?.isAgreeKYBFATCA === false ? "No" : "---"}</b>
                  </Text>
                </Space>
              </Col>
            </Row>
          </Row>
        </Card>
        {/* KYB Shareholders */}
        <Tabs  type="card" activeKey={activeTab} className="kyb_tabs" defaultActiveKey={activeTab} items={items} onChange={onTabChange}/>
        <Card className="mb-4 mt-3 details-card">
          <div className="subText_medium border-left mt-4">
            <b>Client risk rating</b>
          </div>
          <Row>
            <Radio.Group
              onChange={handleDropdownChange}
              value={dropDownValue}
              className="mt-3 client-risk-classification-radio-btn"
            >
              <Radio value={1} disabled={userType === "SUPPORT_ENGINEER"}>Low risk</Radio>
              <Radio value={2} disabled={userType === "SUPPORT_ENGINEER"}>Medium risk </Radio>
              <Radio value={3} disabled={userType === "SUPPORT_ENGINEER"}>High risk</Radio>
            </Radio.Group>
          </Row>
          {approverEndComment && (isApprover || isAuthorizer) &&
            (
              <div>
                <hr className="lightgrayHr mb-4" />
                <div className="subText_medium border-left">
                  <b>Approver Comment</b>
                </div>
                <div>
                  <div className="finalCommentTime stepDetails_medium_sub my-3">
                    {getApproverVerifiedDateTime() ? moment(getApproverVerifiedDateTime()).format("DD MMMM YYYY hh:mm A") : ""}
                  </div>
                  <div className="stepDetails_medium_sub">
                    {approverEndComment}
                  </div>
                </div>
              </div>
            )
          }
          {endComment ? (
            <>
              <div>
                <hr className="lightgrayHr mb-4" />
                <div className="subText_medium border-left">
                  <b>Authorizer Comment</b>
                </div>
                <div>
                  <div className="finalCommentTime stepDetails_medium_sub my-3">
                    {getAuthorizerVerifiedDateTime() ? moment(getAuthorizerVerifiedDateTime()).format("DD MMMM YYYY hh:mm A") : ""}
                  </div>
                  <div className="stepDetails_medium_sub">
                    {endComment}
                  </div>
                </div>
                {KYBDetails?.kybStatus === 'VERIFIED' && createVirtualAccnt && !isApprover && (
                  <Button
                    className={`${!createVirtualAccnt ? "disabled" : ""} rounded my-lg-4 w-auto mx-2 ${userType === "SUPPORT_ENGINEER" ? "d-none" : ""}`}
                    onClick={() => { setCreateVirtualAccountModal(true); }}
                  >
                    Create Escrow Account
                  </Button>
                )}
                {(isAuthorizer && KYBDetails?.kybStatus === "VERIFIED" && (!hideBtnCreatePlatformFee)) && (
                  <>
                    <Tooltip 
                      title={!platformFeesModal && "No Platform fees have been added, default applicable fees will be applied"}
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
                        userAlias={KYBDetails?.userAlias}
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
                        userAlias={KYBDetails?.userAlias}
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
          {(
            !['VERIFIED','REJECTED'].includes(KYBDetails?.kybStatus) 
            && (
              (isApprover  
              && KYBDetails?.trusteeKybStatus != true 
              && KYBDetails?.isTrusteeKybRejected === false
              ) || !isApprover
            ) && (verificationPendingCheck || activeTab === 'Company' && !isApprover)
          ) ? (
            <>
            <Row className={userType === "SUPPORT_ENGINEER"?"d-none":"center_res btn-groups"}>
                <Button
                  className={`${(activeTab != 'Company' || isAllMoaDocApproved) && isAllChecklistChecked() && isAllDocumentApproved(KYBDetails) && !Object.values(specialErrors).some(error => error) ? "rounded" : "rounded disabled"}` }
                  htmlType="submit"
                  onClick={() => {
                    if ((activeTab != 'Company' || isAllMoaDocApproved) && isAllChecklistChecked() && isAllDocumentApproved(KYBDetails) && !Object.values(specialErrors).some(error => error)) openApproveModal();
                  }}
                  loading={loading}
                >
                  Approve KYB
                </Button>
                <Button
                  className={`${isAllChecklistChecked() ? "rounded_reject_light" : 'rounded_reject_light disabled'}`}
                  onClick={() => {
                    if (isAllChecklistChecked()) openRejectModal();
                  }}
                  loading={loading}
                >
                  Reject KYB
                </Button>
                <Button
                  className="rounded_reject_light"
                  htmlType="submit"
                  onClick={() => {
                    setHoldModal(true);
                  }}
                >
                  Hold KYB
                </Button>
                  {['ADMIN', 'AUTHORIZER', 'SENIOR_MANAGMENT', 'CHECKER'].includes(userType) && (
                    <Button
                      className={KYBDetails?.trusteeKybStatus === "VERIFIED" ?"rounded mt-0 w-auto mx-2":"rounded disabled" }
                      onClick={() => { setCreateVirtualAccountModal(true); }}
                      disabled={KYBDetails?.trusteeKybStatus != "VERIFIED"}
                    >
                      Create Escrow Account
                    </Button>
                    //    <Checkbox checked={checked} onChange={(e)=>{onChange(e?.target?.checked)}}>
                    //    Create Escrow Account
                    //  </Checkbox>
                  )}
            </Row>
            </>
          ) :  
          ""}
        </Card>
        </>}
        {
          bankActiveTab === "bankDetails" && (
            <>
            {virtualAccountData && virtualAccountData.length > 0 || userBankList && userBankList.length > 0 ? (
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
                      <div className="orange-cardBankdetails mb-0">
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
              <div className="d-flex buttons-filter mb-2" style={{flexFlow: "row-reverse" }}>
                {(contractList?.length > 0 || showFilter || filterApplied) && (
                  <>
                    <Button type="default" className="filterbutton mx-2 mb-2" onClick={handleResetFilter} >
                      Reset All
                    </Button>
                    {!showFilter ? (
                      <Button
                        className="filterbutton"
                        onClick={() => setShowFilter(true)}
                      >
                        Filter
                        <Image
                          src={filterIcon}
                          alt="filter"
                          preview={false}
                          className=""
                        />
                      </Button>
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
                    onClick={downloadUserDetails}
                  >
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
                <Button
                  className="downloadBtn mt-0 mb-2"
                  loading={downloading}
                  onClick={downloadUserDetails}
                >
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
                <FilterCard handleApplyFilter={(e) => {
                    handleApplyFilter(e, 10, 1);
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
              {contractList?.length > 0 ? (
                <>
                  <div className="itemTypes-mobile-view">
                    <Checkbox checked={selectAll} className="m-2 mx-0" onChange={toggleSelectAll}>Select all </Checkbox>
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
                            <div key={`${contract.transactionNo}-${index}`} className={`sub-body ${index >= columns.length - 2 ? 'col-12' : 'col-6'} col-md-6`}>
                              <div className="sub">
                                <div className="mobile-header">
                                  {column.title}
                                  </div>
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
                      options={[{ value: 10, label: "10" }, { value: 25, label: "25" }, { value: 50, label: "50" }, { value: 100, label: "100" }]}
                    />{" "}
                    <span className="page"> Per page</span>
                  </div>
                  <div className="right" style={{textAlign: 'center'}}>
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
                    className="downloadBtn mt-0"
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
          className="px-4 py-2"
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
              //   message:"Please enter minimum 20 characters"
              // },
              {
                validator: async (_, value) => {
                  await validateCommentField(value, "comment", setSpecialErrors);
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
              placeholder="Please  your comment"
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
                handleModalCancel();
                getKybdetails();
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
        open={CommentModalReject}
        title={`Reject ${modalTitle}`}
        form={formDocumentReject}
        isErrorTitle
        comment={comment}
        onCommentChange={setComment}
        onSubmit={handleReject}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}
      />

      {/* Approve KYB */}
      <CommentModalForm
        open={ApproveModal}
        title="Approve KYB Request"
        form={formApproveKYB}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={() => approveKYB("")}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
      />

      {/* Reject KYB */}
      <CommentModalForm
        open={RejectModal}
        title="Reject KYB Request"
        isErrorTitle
        form={formRejectKYB}
        onSubmit={rejectKYB}
        comment={comment}
        onCommentChange={setComment}
        onCancel={handleModalCancel}
        maxCommentLength={KYC_KYB_COMMENT_TEXT_LIMIT.FINAL_COMMENT}
        loading={loading}
      />

      {/* Hold KYB */}
      <CommentModalForm
        open={holdModal}
        title="Hold KYB Request"
        form={formHoldKYB}
        comment={comment}
        onCommentChange={setComment}
        onSubmit={() => approveKYB("hold")}
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
            Download All KYB Information
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
          <div className="d-flex">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
              loading={loader}
              onClick={() => {
                downloadKYBDetails();
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
        headKYBModal={"KYB"}
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
        representativeDetails={representativeDetails}
        shareHoldingCompanyDigiScreeningPayload={shareHoldingCompanyDigiScreeningPayload}
        setShareHoldingCompanyDigiScreeningPayload={setShareHoldingCompanyDigiScreeningPayload}
        setShareHoldingCompanyDigiScreeningResponse={setShareHoldingCompanyDigiScreeningResponse}
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
        <div className="titleText mt-4 mb-3">
          Escrow account created successfully
        </div>
      </Modal>
    </div>
  );
};

const ShareholderComments = (props: any) => {
  // const [specialErrors, setSpecialErrors] = useState<Record<string, boolean>>({});
  const validateCommentField = (
    value: any,
    fieldName: string,
    setSpecialErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    if (!value || value.trim() === '') {
      setSpecialErrors(prev => ({ ...prev, [fieldName]: false }));
      return Promise.resolve();
    }
  
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
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

  const {
    userType,
    shareholdersPayload,
    updateComment,
    shareholderId,
    updateApproverComment,
    disable,
    isApprover, 
    KYBDetails, 
    validDocumentVerificationShareholder,
    setValidDocumentVerificationShareholder,
    nameAndIdVerificationShareholder,
    setNameAndIdVerificationShareholder,
    amlScreeningShareholder,
    setAmlScreeningShareholder,
    adverseMediaShareholder,
    setAdverseMediaShareholder,
    otherCommentShareholder,
    setOtherCommentShareholder,
    shareholderCmtForm,
    specialErrors,
    setSpecialErrors,
  } = props
  return (<Form form={shareholderCmtForm}>
    <Row className="mt-3">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
              : KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={validDocumentVerificationShareholder}
          onClick={() => {
            setValidDocumentVerificationShareholder(!validDocumentVerificationShareholder);
          }}
        >
          <div className="subText mx-1 ">
            Valid document verification
          </div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
            className="d-none-res  mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                    {/* {KYBDetails?.approverShareholderComments
                    ?.validDocumentVerificationComment
                    ? KYBDetails?.approverShareholderComments
                      ?.validDocumentVerificationComment
                    : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'trusteeValidDocumentVerificationComment',true)}
                </div>
              ) : (
                <Form.Item
                  name="validDocumentVerificationApprover"
                  rules={
                    isApprover ?
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
                          validator: async(_, value) => {
                            await validateCommentField(value, "validDocumentVerificationApprover", setSpecialErrors);
                            if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                          },
                        },
                      ] : []}
                    validateStatus={specialErrors["validDocumentVerificationApprover"] ? "error" : ""}
                  className="checklist w-100"
                >
                  <TextArea
                    rows={2}
                    placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                    className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                    // onInput={handleInput}
                    id="validDocumentVerificationApprover"
                    onChange={(e) => updateApproverComment("validDocumentVerification", e?.target?.value)}
                    defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'trusteeValidDocumentVerificationComment')}
                    // defaultValue={checkboxCommentApproverShareholder?.validDocumentVerification}
                    disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {KYBDetails?.kybStatus === "VERIFIED" ||
                  KYBDetails?.kybStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {/* {KYBDetails?.adminShareholderComments
                      ?.validDocumentVerificationComment
                      ? KYBDetails?.adminShareholderComments
                        ?.validDocumentVerificationComment
                      : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'validDocumentVerificationComment',true)}
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
                    validateStatus={specialErrors["validDocumentVerification"] ? "error" : ""}
                  >
                    <TextArea
                      rows={2}
                      placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                      className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                      // onInput={handleInput}
                      id="validDocumentVerification"
                      // defaultValue={checkboxCommentShareholder?.validDocumentVerification}
                      defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'validDocumentVerificationComment')}
                      disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                      onChange={(e:any) => updateComment("validDocumentVerification", e)}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
    <Row className="my-4">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
              : KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={nameAndIdVerificationShareholder}
          onClick={() => {
            setNameAndIdVerificationShareholder(!nameAndIdVerificationShareholder);
          }}
        >
          <div className="subText mx-1 ">Name & id verification</div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
            className="d-none-res  mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {/* {KYBDetails?.approverShareholderComments
                    ?.nameAndIdVerificationComment
                    ? KYBDetails?.approverShareholderComments
                      ?.nameAndIdVerificationComment
                    : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'trusteeNameAndIdVerificationComment', true)}
                </div>
              ) : (
                <Form.Item
                  name="nameAndIdVerificationApprover"
                  rules={
                    isApprover ?
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
                          validator: async(_, value) => {
                            await validateCommentField(value, "nameAndIdVerificationApprover", setSpecialErrors);
                            if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                          },
                        },
                      ] : []}
                  className="checklist"
                  validateStatus={specialErrors["validDocumentVerification"] ? "error" : ""}
                >
                  <TextArea
                    rows={2}
                    placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                    className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                    // onInput={handleInput}
                    id="nameAndIdVerificationApprover"
                    // defaultValue={checkboxCommentApproverShareholder?.nameAndIdVerification}
                    defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'trusteeNameAndIdVerificationComment')}
                    onChange={(e) => updateApproverComment("nameAndIdVerification", e?.target?.value)}
                    disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {KYBDetails?.kybStatus === "VERIFIED" ||
                  KYBDetails?.kybStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {/* {KYBDetails?.adminShareholderComments
                      ?.nameAndIdVerificationComment
                      ? KYBDetails?.adminShareholderComments
                        ?.nameAndIdVerificationComment
                      : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'nameAndIdVerificationComment',true)}
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
                        ] : []}
                    className="checklist"
                    validateStatus={specialErrors["nameAndIdVerification"] ? "error" : ""}
                  >
                    <TextArea
                      rows={2}
                      placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                      className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                      // onInput={handleInput}
                      id="nameAndIdVerification"
                      // defaultValue={checkboxCommentShareholder?.nameAndIdVerification}
                      defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'nameAndIdVerificationComment')}
                      onChange={(e:any) => updateComment("nameAndIdVerification", e)}
                      disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
    <Row className="my-4">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
              : KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={amlScreeningShareholder}
          onClick={() => {
            setAmlScreeningShareholder(!amlScreeningShareholder);
          }}
        >
          <div className="subText mx-1 ">AML screening</div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
            className="d-none-res  mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {/* {KYBDetails?.approverShareholderComments?.amlScreeningComment
                    ? KYBDetails?.approverShareholderComments
                      ?.amlScreeningComment
                    : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'trusteeAmlScreeningComment', true)}
                </div>
              ) : (
                <Form.Item
                  name="amlScreeningApprover"
                  rules={
                    isApprover ?
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
                  validateStatus={specialErrors["amlScreeningApprover"] ? "error" : ""}
                >
                  <TextArea
                    rows={2}
                    placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                    className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                    // onInput={handleInput}
                    id="amlScreeningApprover"
                    // defaultValue={checkboxCommentApproverShareholder?.amlScreening}
                    defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'trusteeAmlScreeningComment')}
                    onChange={(e) => updateApproverComment("amlScreening", e?.target?.value)}
                    disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER"}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {KYBDetails?.kybStatus === "VERIFIED" ||
                  KYBDetails?.kybStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {/* {KYBDetails?.adminShareholderComments?.amlScreeningComment
                      ? KYBDetails?.adminShareholderComments?.amlScreeningComment
                      : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'amlScreeningComment',true)}
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
                    validateStatus={specialErrors["amlScreening"] ? "error" : ""}
                  >
                    <TextArea
                      rows={2}
                      placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                      className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                      // onInput={handleInput}
                      id="amlScreening"
                      // defaultValue={checkboxCommentShareholder?.amlScreening}
                      defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'amlScreeningComment')}
                      onChange={(e:any) =>updateComment("amlScreening",e)}
                      disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
    <Row className="my-4">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover 
                // || userType === "SUPPORT_ENGINEER"
              ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected 
              : KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={adverseMediaShareholder}
          onClick={() => {
            setAdverseMediaShareholder(!adverseMediaShareholder);
          }}
        >
          <div className="subText mx-1 ">Adverse media</div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
            className="d-none-res mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {/* {KYBDetails?.approverShareholderComments?.adverseMediaComment
                    ? KYBDetails?.approverShareholderComments
                      ?.adverseMediaComment
                    : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'trusteeAdverseMediaComment', true)}
                </div>
              ) : (
                <Form.Item
                  name="adverseMediaApprover"
                  rules={
                    isApprover ?
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
                  validateStatus={specialErrors["adverseMediaApprover"] ? "error" : ""}
                >
                  <TextArea
                    rows={2}
                    placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                    className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                    // onInput={handleInput}
                    id="adverseMediaApprover"
                    // defaultValue={checkboxCommentApproverShareholder?.adverseMedia}
                    defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'trusteeAdverseMediaComment')}
                    onChange={(e) => updateApproverComment("adverseMedia", e?.target?.value)}
                    disabled={!isApprover || disable || userType === "SUPPORT_ENGINEER" }
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {KYBDetails?.kybStatus === "VERIFIED" ||
                  KYBDetails?.kybStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {/* {KYBDetails?.adminShareholderComments?.adverseMediaComment
                      ? KYBDetails?.adminShareholderComments?.adverseMediaComment
                      : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'adverseMediaComment',true)}
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
                            validator:async (_, value) => {
                              await validateCommentField(value, "adverseMedia", setSpecialErrors);
                              if (!value || value.length <= KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.CHECKLIST_COMMENT}`));
                            },
                          },
                        ] : []}
                    className="checklist"
                    validateStatus={specialErrors["adverseMedia"] ? "error" : ""}
                  >
                    <TextArea
                      rows={2}
                      placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                      className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                      // onInput={handleInput}
                      id="adverseMedia"
                      // defaultValue={checkboxCommentShareholder?.adverseMedia}
                      defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'adverseMediaComment')}
                      onChange={(e:any) =>updateComment("adverseMedia", e)}
                      disabled={isApprover || disable || userType === "SUPPORT_ENGINEER"}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
    <Row className="my-4">
      <div className="w-100">
        <Checkbox
          disabled={
            isApprover
              ? KYBDetails?.trusteeKybStatus || KYBDetails?.isTrusteeKybRejected
              : KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" || KYBDetails?.kybStatus === "EXPIRED"
                ? true
                : false
                || userType === "SUPPORT_ENGINEER"
          }
          checked={otherCommentShareholder}
          onClick={() => {
            setOtherCommentShareholder(!otherCommentShareholder);
          }}
        >
          <div className="subText mx-1 ">Other comments/notes</div>
        </Checkbox>
        <div className="afterApproveCard">
          <Tabs
            defaultActiveKey={['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER','CHECKER'].includes(userType) ? "authorizer" : "approver"}
            className="d-none-res mx-4 my-2"
          >
            <TabPane tab={`Approver`} key="approver">
              {KYBDetails?.kybStatus === "VERIFIED" ||
                KYBDetails?.kybStatus === "REJECTED" ? (
                <div className="commentBox mt-2 mx-2">
                  {/* {KYBDetails?.approverShareholderComments?.otherCommentAndNotes
                    ? KYBDetails?.approverShareholderComments
                      ?.otherCommentAndNotes
                    : "N/A"} */}
                  {getShareholderComment(shareholdersPayload,shareholderId,'trusteeOtherCommentAndNotes',true)}
                </div>
              ) : (
                <Form.Item
                  name="otherCommentAndNotesApprover"
                  rules={
                    isApprover ?
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
                  validateStatus={specialErrors["otherCommentAndNotesApprover"] ? "error" : ""}
                >
                  <TextArea
                    rows={2}
                    placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                    className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                    // onInput={handleInput}
                    id="otherCommentAndNotesApprover"
                    // defaultValue={checkboxCommentApproverShareholder?.otherCommentAndNotes}
                    defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'trusteeOtherCommentAndNotes')}
                    onChange={(e) => updateApproverComment("otherCommentAndNotes", e?.target?.value)}
                    disabled={!isApprover || disable  || userType === "SUPPORT_ENGINEER"}
                  />
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab={`Authorizer`} key="authorizer">
              <div className="w-100">
                {KYBDetails?.kybStatus === "VERIFIED" ||
                  KYBDetails?.kybStatus === "REJECTED" ? (
                  <div className="commentBox mt-2 mx-2">
                    {/* {KYBDetails?.adminShareholderComments?.otherCommentAndNotes
                      ? KYBDetails?.adminShareholderComments?.otherCommentAndNotes
                      : "N/A"} */}
                    {getShareholderComment(shareholdersPayload,shareholderId,'otherCommentAndNotes',true)}
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
                    validateStatus={specialErrors["otherCommentAndNotes"] ? "error" : ""}
                  >
                    <TextArea
                      rows={2}
                      placeholder={userType === "SUPPORT_ENGINEER" ? "No comment added..." :"Type your comment here..."}
                      className="checklisttextarea mt-2 mx-2 pt-2 scroll-thin"
                      // onInput={handleInput}
                      id="otherCommentAndNotes"
                      // defaultValue={checkboxCommentShareholder?.otherCommentAndNotes}
                      defaultValue={getShareholderComment(shareholdersPayload,shareholderId,'otherCommentAndNotes')}
                      onChange={(e:any) =>updateComment("otherCommentAndNotes", e)}
                      disabled={isApprover || disable  || userType === "SUPPORT_ENGINEER"}
                    />
                  </Form.Item>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Row>
  </Form>)
}

function getShareholderComment (shareholderData:any, shareholderId: string, commentKey: string, showNA = false) {
  return shareholderData?.[parseInt(shareholderId) - 1]?.[commentKey] ?? (showNA ? 'N/A' : '');
}

export default AdminKYBDetails;
