import dayjs from "dayjs";


export const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.]{1}[a-zA-Z]{2,}$/;
export const MobilNumberRegex = /[^0-9]/gi;
export const validateMobileNumber = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
export const OnlyText = /[^a-z ]/gi;
export const UpperCase = new RegExp("(?=.*[A-Z])");
export const LowerCase = new RegExp("(?=.*[a-z])");
export const SpecialCharater = new RegExp("(?=.*[!@#$%^&*])");
export const maximum8Char = new RegExp("(?=.{8,})");
export const containNumber = new RegExp("(?=.*[0-9])");
export const onlyNumberRegex = /^\d+$/;
export const docRegex:any = "[a-zA-Z0-9.!@#$%/^&*)(+=._-]+(s[A-Za-z]+)?";
export const allowOnlyNumberRegex = /\D/g;
export const alphanumericRegex = /^\[a-zA-Z0-9]*$/;
export const acceptedFileTypes = ['image/png','image/jpg','image/jpeg','application/pdf'];
export const acceptedSignatureFileTypes = ['image/png','image/jpg','image/jpeg'];
export const acceptedDocsFileTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',                   // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel',             // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint',        // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'text/plain',                           // .txt
];

export const getLocalStorage = (name: any) => {
  return localStorage.getItem(name);
};
export const setLocalStorage = (name: string, value: any) => {
  localStorage.setItem(name, value);
};
export const sortedColumn : {[key:string]: any} = {
  name: "sortByName",
  email: "sortByEmail",
  createdOn: "sortByCreateAt",
  userAlias: "sortByUserId",
  userType: "sortByUserType",
  status: "sortByStatus",
};
export const sortingOrder : {[key:string]: any} = {
  ascend: "ASC",
  descend: "DESC",
};

export const MC_TYPE : {[key:string]: any} = {
    REQUEST: "REQUEST",
    RECEIVE: "RECEIVE",
}

export const CHEQUE_USER_TYPE_TEXT : {[key:string]: any} = {
  BUYER: "Buyer",
  SELLER: "Seller",
  BUYERPOA: "Buyer's POA",
  SELLERPOA: "Seller's POA",
  BROKER: "Broker",
}

export const USER_TYPE_TEXT : {[key:string]: any} = {
  TRUSTEE: "Approver",
  USER: "User",
  CLIENT_ADMIN: "Client",
  SENIOR_MANAGMENT:"Senior managment",
  ADMIN:'Admin',
  AUTHORIZER:'Authorizer',
  BUYER: "BUYER",
  SELLER: "SELLER",
  BUYERPOA: "BUYERPOA",
  SELLERPOA: "SELLERPOA",
  BROKER: "BROKER",
  ESCROW_ADVISOR: "ESCROW_ADVISOR",
  MAKER: "MAKER",
  CHECKER: "CHECKER",
  GUEST_SELLER: "Guest Seller",
  GUEST: "Guest",
  TENENT: "TENENT",
  PLANNER: "PLANNER",
  CONTRACTOR: "CONTRACTOR"
};


export const USER_STATUS_TEXT : {[key:string]: any} = {
  active: "Active",
  suspended: "In-active",
};

export const ENTITY_TYPE : {[key:string]: any} = {
  INDIVIDUAL: "Individual",
  COMPANY: "Company",
  PARTNERSHIP: "Partnership",
  NON_PROFIT_ORGANIZATION: "Non-profit organisation",
};
export const statusStyle : {[key:string]: any} = {
  Drafted: {
    color: "#3A37EE",
  },
  "In progress": {
    color: "#D89003",
  },
  Accepted: {
    color: "#0F930C",
  },

  Active: {
    color: "#07B653",
  },
  Pending: {
    color: " #FF8900",
  },
  Completed: {
    color: "#6E941E",
  },
  "Fund added": {
    color: "#FF6600",
  },
  "Payment initiated": {
    color: "#11A4E2",
  },
  "Release pending": {
    color: "#153F7C",
  },
  "Initiate pending": {
    color: "#153F7C",
  },
  Rejected: {
    color: "#F46A6A",
  },
  Invalid: {
    color: "#AA4040",
  },
  Expired: {
    color: "#888888",
  },
  Disputed: {
    color: "#FF0000",
  },

  "Refund Generated": {
    color: "#CD2706",
  },

  Refunded: {
    color: "#008631",
  },
  Verified: {
    color: "#378E0E",
  },
  Resolved: {
    color: "#2A7C5F",
  },
  "Complete refund generated": {
    color: "#ff720f",
  },
  "Partial refund generated": {
    color: "#cd9b06",
  },
  "Signature pending": {
    color: "#153F7C",
  },
};

export const enterpriseUserCallsStatus : {[key:string]: any} = {
  NOT_DONE: "Not Done",
  CANCELLED: "Cancelled",
  CLIENT_INTERESTED: "Client Intrested",
  CLIENT_NOT_INTERESTED: "Client Not Intrested",
  DONE: "Done",
  SCHEDULED: "Scheduled",
  RESCHEDULED: "Re-scheduled",
};

export const estimateTxn : {[key:string]: any} = {
  EXTRA_SMALL: "Less than AED 1000 per month",
  SMALL: "AED 1001-AED 10,000 per month",
  MEDIUM: "AED 10,001-100,000 per month",
  LARGE: "AED 100,001-AED 1,000,000 per month",
  EXTRA_LARGE: "More than AED 1,000,000 per month",
  DOMESTIC: "Domestic transactions only",
  INTERNATIONAL: "International transactions only",
  BOTH: "Both domestic & international transactions",
  TRANSACTION_INITIAL: "Just starting out", 
  TRANSACTION_MEDIUM: "AED 0 - AED 20000", 
  TRANSACTION_LARGE: "AED 20000-AED 100000 or more",
};

export const companySize : {[key:string]: any} = {
  EXTRA_SMALL: "Less than 10 members",
  SMALL: "11-25 members",
  MEDIUM: "26-50 members",
  LARGE: "51-100 members",
  EXTRA_LARGE: "More than 100 members",
};

export const amountFormat = (currency: string | null, amount: number) => {
   let formattedAmount;
  if (amount > 999 && amount < 1000000) {
    formattedAmount = `${(amount / 1000).toFixed(1)}K`;
  } else if (amount > 1000000 && amount < 1000000000) {
    formattedAmount = `${(amount / 1000000).toFixed(1)}M`; 
  } else if (amount > 1000000000) {
    formattedAmount = `${(amount / 1000000000).toFixed(1)}B`;
      } else {
        formattedAmount = `${amount}`;
      }
      return currency ? `${currency} ${formattedAmount}` : formattedAmount;
    };
    export const amountFormatWithoutCurrency = (amount: number) => {
      return amountFormat(null, amount);
};
// export const amountFormatWithoutCurrency = ( amount: number) => {
//   if (amount > 999 && amount < 1000000) {
//     return ` ${(amount / 1000).toFixed(1) + "K"}`;
//   } else if (amount > 1000000 && amount < 1000000000) {
//     return ` ${(amount / 1000000).toFixed(1) + "M"}`; 
//   } else if (amount > 1000000000) {
//     return ` ${(amount / 1000000000).toFixed(1) + "B"}`;
//   } else if (amount < 1000) {
//     return ` ${amount}`; 
//   }
// };
export const getCount = (array:any, status:any) => {
  return array.filter((val:any) => {
      return val.platformStatus === status;
  });
}
export const DOCUMENT_TYPE : {[key:string]: any} = {
  PASSPORT: "Passport",
  DRIVING_LICENSE: "Driving license",
  NATIONAL_ID: "National id",
  EMIRATES_ID: "Emirates id",
};

export const CHEQUE_STATUS : {[key:string]: any} = {
  DRAFT: "Drafted",
  PENDING: "Pending",
  FUND_ADDED: "In progress",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
}

export const CONTRACT_STATUS : {[key:string]: any} = {
  REJECTED: "Rejected",
  SEND: "Drafted",
  SENT: "Pending",
  ACCEPT_REJECT: "Pending",
  ADD_FUND: "In progress",
  FUND_PENDING: "In progress",
  IN_PROGRESS: "In progress",
  FUND_ADDED: "Fund added",
  UPLOAD_DOC: "In progress",
  DOC_PENDING: "In progress",
  RELEASE_PAYMENT: "Release pending",
  DOC_UPLOADED: "In progress",
  VERIFY_DOC: "In progress",
  RELEASE_PENDING: "Release pending",
  COMPLETED: "Completed",
  INVALID: "Invalid",
  DISPUTED: "Disputed",
  EXPIRED: "Expired",
  REFUND_GENERATED: "Refund generated",
  Resolved: "Resolved",
  Refunded: "Refund generated",
  Partial_Refunded: "Partial refund generated",
  Completed_Refunded: "Complete refund generated",
  COMPLETED_REFUNDED: "Complete refund generated",
  PARTIAL_REFUNDED: "Partial refund generated",
  INITIATE_PAYMENT: "Initiate pending",
  PAYMENT_INITIATED: "Payment initiated",
  SIGNATURE_PENDING:"Signature pending",
  PENDING:'Pending',
  VERIFICATION_PENDING: 'Pending',
  DRAFT: "Drafted"
};

export const contractStatusMap:  Record<any, string> = {
  "-1": "Rejected",
  "-2": "Rejected",
  "1": "Pending",
  "2": "In progress",
  "3": "In progress",
  "4": "In progress",
  "5": "Completed",
  "7": "Disputed",
  "8": "Refund Generated",
  "9": "Complete refund generated",
  "10": "Partial refund generated"
};

export const contractStatusMapFilter = [
  {id:"rejected", value: "Rejected"},
  {id:"pending", value: "Pending"},
  {id:"inprogress", value: "In progress"},
  {id:"completed", value: "Completed"},
  {id:"disputed", value: "Disputed"},
  {id:"partialrefundgenerated", value: "Partial Refund Generated"},
  {id:"completerefundgenerated", value: "Complete Refund Generated"},
  {id:"refundgenerated", value: "Refund Generated"},
  {id:"expired", value: "Expired"},
  {id:"archived", value: "Archived"}
];

export const COMPANY_ROLE : {[key:string]: any} = {
  DIRECTOR: "Director",
  AUTHORIZED_REPRESENTIVE: "Authorized representative",
  BENEFICIAL_OWNER: "Beneficial owner",
};

export const inputType : {[key:string]: any} = [
  { name: "String", value: "STRING" },
  { name: "Number", value: "NUMBER" },
  { name: "Decimal", value: "FLOAT" },
  { name: "Date", value: "DATE" },
];
export const moneyFormat = (currency:any, amount:any) => {
  return `${currency} ${parseFloat(amount).toLocaleString('en-US')}`
};

export const ordinalSuffixOf = (i:any) => {
  const j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

export const ACTION_LABEL : {[key:string]: any} = {
  SENT: "Sent",
  ACCEPT_REJECT: "Accept",
  SEND: "Send",
  ADD_FUND: "Add fund",
  FUND_PENDING: "Fund pending",
  FUND_ADDED: "Fund added",
  UPLOAD_DOC: "Upload document",
  DOC_PENDING: "Doc pending",
  RELEASE_PAYMENT: "Release payment",
  REJECTED: "Rejected",
  DOC_UPLOADED: "Doc uploaded",
  VERIFY_DOC: "Verify document",
  RELEASE_PENDING: "Release pending",
  COMPLETED: "Completed",
  INVALID: "Invalid",
  INITIATE_PAYMENT: "Initiate payment",
  PAYMENT_INITIATED: "Payment initiated",
  SIGNATURE_PENDING:"Signature pending",
  EXPIRED:"Expired",
  VERIFICATION_PENDING: "Verification pending"
};
export const TXN_STATUS: {[key:string]: any} = {
  INITIATED: "INITIATED",
  UNVERIFIED: "UNVERIFIED",
  COMPLETED: "COMPLETED",
  RELEASED: "RELEASED",
};
export const ACTION_WISE_URI_TEXT: {[key:string]: any}  = {
  ACCEPT_REJECT: "accept",
  SEND: "send",
  REJECT: "reject",
  INVALID: "invalid",
};
export const toTitleCase = (text = ""): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const capitalizeFirst = (str: string) => {
  if (!str) return "";
  let formatted = str.replace(/_/g, " ").trim().toLowerCase();

  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

  //"POA" always appears in uppercase
  formatted = formatted.replace(/\bpoa\b/gi, "POA");

  return formatted;
};

export const PAYMENT_STATUS: any = {
  INITIATED: "Initiated",
  UNVERIFIED: "unverified",
  COMPLETED: "Completed",
};
export const COMMON_DATA_SETS_ARR = ['ALL', 'PEP', 'PEP-LINKED', 'SAN', 'SAN-CURRENT', 'SAN-FORMER', 'INS', 'RRE', 'POI', 'REL',]
export const INDIVIDUALS_DATA_SETS_ARR = ['PEP-CURRENT', 'PEP-FORMER', 'DD']
export const CORPORATES_DATA_SETS_ARR = ['SOE', 'SOE-CURRENT', 'SOE-FORMER']

export const DEFAULT_COUNTRY = "AE";
export const DEFAULT_COUNTRY_UAE = "UAE";
export const DEFAULT_COUNTRY_NAME = "United Arab Emirates";
export const DEFAULT_COUNTRY_CODE = "+971";


export const RISK_ASSESSMENT_FINAL_RISK_SCORE: any = {
  LOW_RISK: "Low Risk",
  MEDIUM_RISK: "Medium Risk",
  HIGH_RISK: "High Risk",
};
export const DEFAULT_COUNTRY_OF_INCORPORATION = "Within UAE";

export const KYB_VERIFICATION_STEPS_TITLE: any = {
 BASIC_INFORMATION: "Basic information",
 REPRESENTATIVE_OWNERS: "Representative & owners",
 BENEFICIAL_OWNERS: "Shareholders",
 BUSINESS_DETAILS: "Business details",
 REQUIRED_DOCUMENTS: "Required documents",
 FATCA_SELF_CERTIFICATION_FORM : "FATCA Self-Certification",
}

export const KYC_VERIFICATION_STEPS_TITLE: any = {
  BASIC_INFORMATION: "Basic information",
  ADDRESS_DETAILS: " Address details",
  REQUIRED_DOCUMENTS: "Required documents",
  FATCA_SELF_CERTIFICATION_FORM : "FATCA Self-Certification",
}

export const  FilterType = {
  ESCROW_TRANSACTION : "escrowTransactionFilter",
  CONTRACT_LIST : "CONTRACT_LIST",
  KYC : "kycFilter",
  KYB : "kybFilter",
  USERS : "usersFilter",
  STATUS: "status"
}

export const TRANSACTIONS_FILTER_STATUS_ARR=[
  {id:"Pending",value:"Pending"},
  {id:"Rejected",value:"Rejected"},
  {id:"Inprogress",value:"In-progress"},
  {id:"Completed",value:"Completed"},
  {id:"Expired",value:"Expired"},
  {id:"Archived",value:"Archived"},
]

export const KYC_KYB_FILTER_STATUS_ARR=[
  {id:"PENDING",value:"Pending"},
  {id:"VERIFIED",value:"Verified"},
  {id:"REJECTED",value:"Rejected"},
  {id:"HOLD",value:"Hold"}
]
 
export const PLATFORM_CHARGE_TYPE = {
  PERCENT: "PERCENT",
  FIXED: "FIXED"
}

export enum PLATFORM_CHARGE_APPLIED_ON {
    BUYER = 'BUYER',
    SELLER = 'SELLER',
    DEFAULT = 'DEFAULT'
}
export const MINIMUM_INVOICE_AMOUNT = 1000

export const DateWithUtcOffset = (selectedDate: any) => {
  const date: any = dayjs();
  const utcOffset: any = date.utcOffset();
  const newDate = dayjs.utc(selectedDate,"DD-MM-YYYY").utcOffset(utcOffset).format();
  return newDate;
}

export const DateWithUtcOffset2 = (selectedDate: any) => { 
  const date = dayjs.utc(selectedDate,"DD-MM-YYYY").format();
  return date;
}

export const acceptedFileExtension = ".png,.jpg,.jpeg,.pdf";
export const acceptedSignatureFileExtension = ".png,.jpg,.jpeg";


export const beforeUploadFile = (file:any, docName: any) => {   
  const isJpgOrPng: boolean = acceptedFileTypes.includes(file?.type); 
  if (!isJpgOrPng) {
    // message.error("You can only upload Image(JPEG,JPG,PNG) or PDF file!");
    return "You can only upload JPEG,JPG,PNG or PDF file!";
  }
  
  const fileSize = file.size / 1024 / 1024 <= 5;
  const moaFilesize = file.size / 1024 / 1024 <= 5;
  const isLt5M: boolean = docName === "MOA"? moaFilesize: fileSize;
  
  if(docName === "MOA" &&!isLt5M){
    return "File must be smaller than 5mb";
  }
  
  if (docName !== "MOA" && !isLt5M) {
    // message.error("File must smaller than 2MB!");
    return "File must be smaller than 5mb";
  }

  if(isLt5M && isJpgOrPng){
    return true
  }
}

export const UAEPGS_STATUS : {[key:string]: any} = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
  INITIATED: "Initiated",
  INPROGRESS: "In-progress"
}

export const beforeUploadSignatureFile = (file:any) => {
  const isJpgOrPng: boolean = acceptedSignatureFileTypes.includes(file?.type);            
  if (!isJpgOrPng) {
    return "You can only upload JPEG,JPG,PNG file!";
  }
  
  const fileSize = file.size / 1024 / 1024 <= 5;
  if(fileSize){
    return true
  } else {
    return "File size must be less than 5 MB"
  }
}

export const modifyCresetUserType = (userAlias:string, userType: string) => {
  if (!userAlias || !userType) {
    return userType;
  }
  const specialUsers = process.env.SPECIAL_USER_ALIASES ? process.env.SPECIAL_USER_ALIASES.split(','): [];
  let modifiedUserType = userType; 
  switch(userType) {
    case 'buyer': modifiedUserType = 'investor';break;
    case 'Buyer': modifiedUserType = 'Investor';break;
    case 'BUYER': modifiedUserType = 'INVESTOR';break;
    case 'seller': modifiedUserType = 'funder';break;
    case 'Seller': modifiedUserType = 'Funder';break;
    case 'SELLER': modifiedUserType = 'FUNDER';break;
    case 'broker': modifiedUserType = 'broker';break;
    case 'BROKER': modifiedUserType = 'BROKER';break;
  }
  if (specialUsers.includes(userAlias)) {
    return modifiedUserType;
  } else {
    return userType;
  }
}

export const VALID_CURRENCY = ['AED','USD']

export enum AuthUserTypes {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  TRUSTEE = 'TRUSTEE',
  USER = 'USER',
  GUEST = 'GUEST',
  GUEST_SELLER = 'GUEST_SELLER',
  SUBADMIN = 'SUBADMIN',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  AUTHORIZER = 'AUTHORIZER',
  SENIOR_MANAGMENT = 'SENIOR_MANAGMENT',
  ESCROW_ADVISOR = 'ESCROW_ADVISOR',
  CHECKER = 'CHECKER',
  MAKER = 'MAKER',
  SUPPORT_ENGINEER ="SUPPORT_ENGINEER"
}

export const KYC_KYB_COMMENT_TEXT_LIMIT = {
  FINAL_COMMENT: 1000,
  DOCUMENT_COMMENT: 500,
  CHECKLIST_COMMENT: 750,
  RISK_CHANGE_COMMENT: 750
}

export const MANAGER_CHEQUE = {
  FINAL_COMMENT_MAX_LENGTH: 1000,
  DOCUMENT_COMMENT_MAX_LENGTH: 500,
};

export const UAEPGS_LIMIT ={
  DESCRIPTION_MAX_LENGTH: 200
};

export const beforeUploadSourceOfFundsFile = (file:any) => {   
  const isJpgOrPng: boolean = acceptedFileTypes.includes(file?.type); 
  if (!isJpgOrPng) {
    return "You can only upload JPEG,JPG,PNG or PDF file!";
  }
  
  const fileSize = file.size / 1024 / 1024 <= 10;
  const isLt10M: boolean = fileSize;
  
  if (!isLt10M) {
    return "File must be smaller than 10MB!";
  }

  if (isLt10M && isJpgOrPng){
    return true
  }
}

export enum PLAFORM_FEE_TYPE {
    FIXED_USER_PLATFORM_FEES = 'FIXED_USER_PLATFORM_FEES',
    DEFAULT = 'DEFAULT'
}

export enum TRANSACTION_TYPE {
  ESCROW = "ESCROW",
  MC = "MC",
}

/**
 * Utility to check if a value is a valid non-empty string or number.
 */
export function isValidValue(value: unknown): value is string | number {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return !isNaN(value) && isFinite(value);
  }

  return false;
}

export const selectPreferredValue = (
  values: Array<string | undefined | null>
): string => {
  const validValues = values?.filter(Boolean).map(v => v!.trim()) as string[];
  if (!validValues.length) return "";

  // Prefer full names (>2 chars)
  const fullName = validValues.find(v => v.length > 2);
  if (fullName) return fullName;

  // Fall back to ISO (2-char codes)
  const iso = validValues.find(v => v.length === 2);
  return iso || "";
};

export const getFormattedValue = (
  values: Array<string | undefined | null>
): string => {
  const selected = selectPreferredValue(values);
  if (!selected) return "";

  return selected.length === 2
    ? selected.toUpperCase()
    : toTitleCase(selected);
};

/**
 * Finds a country's name by ISO code or calling code.
 *
 * @param countryList - Array of country objects
 * @param value - ISO code (e.g., "IN") or calling code (e.g., "+91")
 * @returns The matched country's name or an empty string if not found
 */
export function findCountryName(
  countryList: any[],
  value: string
): string {
  if (!Array.isArray(countryList) || !value?.trim()) return "";

  const normalizedValue = value.trim().replace(/\s+/g, "").toUpperCase();

  const country = countryList.find((c) => {
    const isoMatch = c.isoCode?.toUpperCase() === normalizedValue || c.symbol?.toUpperCase() === normalizedValue;
    const callMatch = c.callingCode?.replace(/\s+/g, "") === normalizedValue;
    return isoMatch || callMatch;
  });

  return country?.name?.trim() ?? "";
}

