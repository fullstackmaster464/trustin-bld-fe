import instance, { getNormalizedQueryString } from "./axios";
import Tesseract from 'tesseract.js';

const uri = {
  userSignup: "/api/v1/users/registerV2",
  userLogin: "/api/v1/users/loginV2",
  updateUserName: "/api/v1/users/update-name",
  forgotPassword: "api/v1/users/forgotPassword",
  confirmOTP: "api/v1/users/confirmOTP",
  verifyOTP: "api/v1/users/verifyOtp",
  resendOTP: "api/v1/users/generateOtp",
  getCategories: "/api/v1/meta/itemtypesandcategories",
  getUserContractList: "/api/v1/contracts/all",
  getUserDraftContractList: "/api/v1/contracts/draftcontract",
  searchManagementdata: "/api/v1/admin/user/search",
  getCountriesList: "/api/v1/reference-data/countries",
  getCitiesList: "/api/v1/reference-data/cities",
  getReferenceDataList: "/api/v1/reference-data/bank?countryCode=",
  getReferenceDataListV2: "/api/v1/reference-data/banksV2",
  addUserBankDetails: "/api/v1/bank",
  editUserBankDetails: "/api/v1/bank/",
  deleteUserBankDetails: "/api/v1/bank/",
  getBankDetails: "/api/v1/bank/userAlias/",
  getBankTransStatementFilter: "/api/v1/bank/filter/userAlias/",
  downloadBankStatementPDF: "/api/v1/bank/statement/pdf/",
  addUserBank: "/api/v1/common/addBankDetails",
  setPrimaryAc: "/api/v1/common/setPrimary/",
  getUserBankDetails: "/api/v1/common/fetchBankDetails/",
  getAllCountry: "/api/v1/meta/countries",
  getContractsDetails: "/api/v1/contracts/contractDetails/",
  getInvoicePdf: "/api/v1/contracts/getInvoicePdf/",
  getArchivedList: 'api/v1/contracts/archival',
  updateKyb: 'api/v1/ekyc/update',
  createKyb: 'api/v1/ekyc/create',
  updateKybAddress: 'api/v1/ekyc/updateAddress',
  updateRepresentative: 'api/v1/ekyc/updateRepresentative',
  updateBeneficialOwner: 'api/v1/ekyc/updateBeneficialOwner',
  updateShareHolder: 'api/v1/ekyc/updateShareHolder',
  deleteMoaDocument: 'api/v1/ekyc/deleteMoaDocument',
  updateDocuments: 'api/v1/ekyc/updateDocuments',
  updateFinal: 'api/v1/ekyc/updateFinal',
  updateFinalV2 : 'api/v1/ekyc/updateFinalV2',
  userKycStatus: 'api/v1/ekyc/fetchJobIdFromFile',
  deleteDocument: '/api/v1/ekyc/file/',
  deleteShareHolderDocument: '/api/v1/ekyc/file/shareHolder',
  deleteShareHolderRepresentativeDocument: '/api/v1/ekyc/file/shareHolder-representative',
  deleteShareholderAddressProof: '/api/v1/ekyc/delete-shareholder-address-proof/',
  envStatus:'api/v1/docusign/envelope/details',
  uploadSignedDoc:'api/v1/docusign/envelope/details/combined',
  createContract: '/api/v1/contracts',
  createEscrowTransaction: '/api/v1/contracts/create',
  createCheques: '/api/v1/cheque/create',
  updateDocusign:'api/v1/contracts/updateDocusign',
  createEnvelope:'api/v1/docusign/envelope',
  virtualAccountAndAddress: '/api/v1/users/checkVAAdd/',
  uploadPdf:'api/v1/contracts/uploadPdf',
  updateContract:'api/v1/contracts/update/',
  getWalletTransactionList: '/api/v1/users/',
  getWalletTransactionCount: '/api/v1/users/',
  getWalletTotalAmountAndCount: '/api/v1/users/',
  getUserContractListByContractStatus: '/api/v1/contracts/getContractListByContractStatus/',
  saveDispute: 'api/v1/dispute/updateDispute',
  getAllNotifications: 'api/v1/notification/',
  updateNotifications: 'api/v1/notification/update',
  updateNotificationsByAlias: 'api/v1/notification/updateAlias',
  checkoutRazorPayPayment: 'api/v1/payment/checkout/razorpay',
  confirmRazorPayPayment: 'api/v1/payment/confirm/razorpay',
  assignTrustee: 'api/v1/payment/assign-trustee',
  emailAfterDocVerify: 'api/v1/contracts/emailAfterVerifyDoc/',
  emailAfterDocReject: 'api/v1/contracts/emailAfterRejectDoc/',
  emailAfterReleaseAdd: 'api/v1/release/emailAfterAddRelease/',
  emailAfterPendingKyc: 'api/v1/release/emailAfterPendingKyc/',
  emailAfterNotCom: 'api/v1/release/emailAfterNotCompliance/',
  emailForNotAddedBank: 'api/v1/release/emailForNotAddedBank/',
  emailAfterOnlinePayment: 'api/v1/payment/emailAfterByOnline/',
  emailForInvalidAgreement: 'api/v1/contracts/emailForInvalidContract/',
  emailForApprovalTrustee: 'api/v1/trustee/emailForApprovalTrustee/',
  getPaymentOptions: '/api/v1/payment/methods',
  checkoutWireTransfer: 'api/v1/payment/checkout/wiretransfer',
  confirmWireTransfer: 'api/v1/payment/confirm/wiretransfer',
  addFundsEmailToApprover: '/api/v1/contracts/addFundsEmailToApprover/',
  addFundsApprover: 'api/v1/trustee/addFunds/',
  blockOrUnblockFunds: 'api/v1/contracts/blockOrUnBlockFunds/',
  fetchBankDetailsByUserAlias: 'api/v1/bank/userAlias/',
  deleteSignatureFile : '/api/v1/uploads/deleteDocument',
  downloadUserCSV: 'api/v1/admin/downloadUserDetails/',
  addUserAddress: 'api/v1/address/',
  getUserAddress: 'api/v1/users/address/',
  updateUserAddress: 'api/v1/users/address/',
  escrowAdvisorUserList:'api/v1/users/escrowadvisor/',
  supportandHelp:'api/v1/support',
  verifyUser: "api/v1/users/verifyUser",
  verifyUserByEmail: "api/v1/users/verify-email",
  verifyUserByEmail2: "api/v1/users/verify-email2",
  reSendVerificationCode: "api/v1/users/generate-verification-code",
  getUserEmail: "api/v1/users/get-user/email",
  verifyEmailLogin: "api/v1/users/verify-email-login",
  getUaepgsBankList: 'api/v1/reference-data/uaepgs-bank-list',
  getPaymentLogsByTransactionAlias : 'api/v1/payment/paymentLogs/',
  getGuestUser: "api/v1/users/guest",
  getCurrencyList: "api/v1/meta/currencies",
  getForexExchangeRate: "api/v1/reference-data/forex-rate",
  updateContractPayoutAccount: "api/v1/contracts/update/payout-account",
  inviteuser: "api/v1/users/import"
};

export const registerUser = async (reqBody: any) => {
  return await instance.post(uri.userSignup, reqBody);
};

export const loginUser = async (reqBody: any) => {
  return await instance.post(uri.userLogin, reqBody);
};

export const forgotPassword = async (email: object) => {
  return await instance.post(uri.forgotPassword, email);
};

export const confirmOTP = async (requestBody: any) => {
  return await instance.post(uri.confirmOTP, requestBody);
};

export const verifyOtp = async (requestBody: any) => {
  return await instance.post(uri.verifyOTP, requestBody);
};

export const resendOtp = async (requestBody: any) => {
  return await instance.post(uri.resendOTP, requestBody);
};
export const getAllItem = async () => {
  return await instance.get(uri.getCategories);
};

export const getContractList = async (
  userId:any = null,
  current = 0,
  pageSize = 10,
  contractStatus = "",
  sortBy = "sortByAgreementId",
  orderBy = "DESC"
) => {
  const filter =
  contractStatus == "all" 
  ? null
  : contractStatus.toUpperCase();
  return await instance.get(
    uri.getUserContractList +
      `?userId=${userId}&page=${current}&limit=${pageSize}&status=${contractStatus}&contractStartedBy=${filter}&${sortBy}=${orderBy}`
  );
};

export const getDraftContractList = async (
  userId:any = null,
  current = 0,
  pageSize = 10,
  sortBy = "sortByAgreementId",
  orderBy = "DESC"
) => {
  return await instance.get(
    uri.getUserDraftContractList +
      `?userId=${userId}&page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`
  );
};
export const searchManagementdata = async (
  current = 1,
  pageSize = 10,
  sortBy = "sortByAgreementId",
  orderBy = "DESC",
  reqBody: object
) => {
  return await instance.post(
    uri.searchManagementdata +
      `?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,
    reqBody
  );
};
export const getCountriesList = async () => {
  return await instance.get(uri.getCountriesList);
};

export const getReferenceDataList = async (option: string) => {
  return await instance.get(uri.getReferenceDataList + option);
};

export const getReferenceDataListV2 = async (option: {
  countryCode: string,
  cityCode: string,
  search?: string
}) => {
  const normalizedQueryOptions = getNormalizedQueryString(option);
  const queryString = normalizedQueryOptions ? `?${normalizedQueryOptions}` : ""
  return await instance.get(uri.getReferenceDataListV2 + queryString);
};

export const addUserBankDetails = async (reqbody: object) => {
  return await instance.post(uri.addUserBankDetails, reqbody);
};

export const editUserBankDetails = async (
  bankAlias: string,
  reqbody: object
) => {
  return await instance.post(uri.editUserBankDetails + bankAlias, reqbody);
};

export const deleteUserBankDetails = async (bankAlias: string) => {
  return await instance.delete(uri.deleteUserBankDetails + bankAlias);
};

export const getlocalBankDetails = async (userAlias: string) => {
  return await instance.get(uri.getBankDetails + userAlias);
};
export const addBank = async (reqbody: object) => {
  return await instance.post(uri.addUserBank, reqbody);
};
export const getBankDetails = async (reqBody: object) => {
  return await instance.get(uri.getUserBankDetails + reqBody);
};
export const setPrimaryBankAc = async (userAlias: any, id: any) => {
  return await instance.get(uri.setPrimaryAc + userAlias + "/" + id);
};

export const getAllCountries = async () => {
  return await instance.get(uri.getAllCountry);
};
export const getContractsDetails = async (UrlData: string, contractType?: string): Promise<any> => {
  let url = uri.getContractsDetails + UrlData;
  if (contractType) {
    url += `?contractType=${contractType}`;
  }
  return await instance.get(url);
};
export const getInvoicePdf = async (UrlData: string) => {
  return await instance.get(uri.getInvoicePdf + UrlData);
};
export const getArchivedList = async (
  userId = null,
  current = 0,
  pageSize = 10,
  contractStatus = null,
  sortBy = null,
  orderBy = null
) => {
  return await instance.get(uri.getArchivedList + `?userId=${userId}&page=${current}&limit=${pageSize}&status=${contractStatus}&${sortBy}=${orderBy}`);
};

export const getFilteredBankTransactions = async (
  userAlias: string,
  accountNo: string,
  currency: string,
  startDate: string,
  endDate: string,
  page: number,
  limit: number,
) => {
  const url = `${uri.getBankTransStatementFilter}${userAlias}?accountNo=${accountNo}&currency=${currency}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;
  return await instance.get(url);  
};

export const downloadBankStatementPDF = async ({
  userAlias,
  accountNo, 
  bankAlias,
  currency,
  startDate,
  endDate,
  page, 
  limit 
}: {
  userAlias: string,
  accountNo: string,
  bankAlias: string,
  currency: string,
  startDate: string,
  endDate: string,
  page?: number,
  limit?: number,
}) => {
  const url = `${uri.downloadBankStatementPDF}${userAlias}?accountNo=${accountNo}&bankAlias=${bankAlias}&currency=${currency}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;
  
  const response = await instance.get(url, {
    responseType: 'blob',
  });

  return response;
};


export const updateKyb = async (requestBody:object) => {
  return await instance.post(uri.updateKyb, requestBody);
};
export const getCitiesList = async (countryCode:string, cityName = '') => {
  if (!countryCode) {
    return {status: 400, data: {citiesList:[]}}
  }
  if (countryCode === 'UAE') {
    countryCode = 'AE';
  } else if (countryCode === 'USA') {
    countryCode = 'US'
  } else if (countryCode === 'IND') {
    countryCode = 'IN';
  }
  let url = uri.getCitiesList+ `?countryCode=${countryCode}`;
  if (cityName.trim().length > 0) {
    url += `&cityName=${cityName}`;
  }
  return await instance.get(url)
}
export const userKyc = async (requestBody:object) => {
  return await instance.post(uri.userKycStatus, requestBody)
};
export const deleteFile = async (payload:any) => {
  const  {id,userAlias,docType} = payload
    return await instance.delete(`${uri.deleteDocument}${id}/${userAlias}/${docType}`);
};
export const deleteShareHolderFile = async (payload:any) => {
    return await instance.post(`${uri.deleteShareHolderDocument}`,{ ...payload });
};
export const deleteShareHolderRepresentativeFile = async (payload:any) => {
    return await instance.post(`${uri.deleteShareHolderRepresentativeDocument}`,{ ...payload });
};
export const deleteShareholderAddressProof = async (payload: {
  id: number;
  userAlias: string;
  docType: string;
  shareholderKey: string;
}) => {
  const { id, userAlias, docType, shareholderKey } = payload;

  return await instance.delete(
    `${uri.deleteShareholderAddressProof}${id}/${userAlias}/${docType}`,
    { params: { shareholderKey } }
  );
};

export const checkEnvStatus = async (id:any) => {
  return await instance.post(uri.envStatus,{id});
};

export const uploadSignedDoc = async (requestBody:object)=>{
  return await instance.post(uri.uploadSignedDoc,requestBody) 
}
export const createTransaction = async (requestBody:object) => {
  return await instance.post(uri.createContract, requestBody);
};
export const createEscrowTransaction = async (requestBody: any) => {
  return await instance.post(uri.createEscrowTransaction, requestBody);
};
export const updateDocusign = async (requestBody:object) => {
  return await instance.post(uri.updateDocusign, requestBody);
};
export const createEnvelopeApi = async (payload:object) => {
  return await instance.post(uri.createEnvelope,payload);
};
export const virtualAccountAndAddress = async (userAlias:string) => {
  return await instance.get(uri.virtualAccountAndAddress + userAlias);
};
export const uploadPDFApi = async (requestBody:FormData)=>{
  return await instance.post(uri.uploadPdf,requestBody) 
}

export const getWalletTransactionCount = async (userAlias: string) => {
  const url = uri.getWalletTransactionCount + userAlias + `/transactioncount`
  return await instance.get(url);
};

export const getWalletTransactionList = async (userAlias: string, accountType: string, accountAlias: string, current: any, pageSize: any, currency ?:string) => {
  let url;
  if(currency) {
    url = uri.getWalletTransactionList + userAlias + `/transactions?accountType=${accountType}&accountAlias=${accountAlias}&page=${current}&limit=${pageSize}&currency=${currency}`
  } else {
    url = uri.getWalletTransactionList + userAlias + `/transactions?accountType=${accountType}&accountAlias=${accountAlias}&page=${current}&limit=${pageSize}`
  }
  return await instance.get(url);
};

export const getUaepgsTransactionList = async (userAlias:string) => {
  return await instance.get(uri.getWalletTransactionList + userAlias + `/UAEPGSTransactions`);
};

export const getWalletTotalAmountAndCount = async (userAlias:string, currency?:string) => {
  let url;
  if(currency) {
    url = uri.getWalletTotalAmountAndCount + userAlias + `/wallet?currency=${currency}`
  } else {
    url = uri.getWalletTotalAmountAndCount + userAlias + `/wallet`
  }
  return await instance.get(url);
};
export const getContractListByContractStatus = async (userAlias:string, contractStatus:string) => {
  return await instance.get(uri.getUserContractListByContractStatus + userAlias + `?contractStatus=${contractStatus}`)
}

export const updateContract = async (reqBody:any, aliasName : string) => {
  return await instance.put(uri.updateContract + `${aliasName}`, reqBody)
};

export const saveDispute = async (reqBody:any) => {
  return await instance.post(uri.saveDispute, reqBody)
};
export const updateNotifications = async (reqBody:any) => {
  return await instance.put(uri.updateNotifications, reqBody)
};
export const updateNotificationsByAlias = async (reqBody:any) => {
  return await instance.put(uri.updateNotificationsByAlias, reqBody)
};
export const getAllNotifications = async (userAlias:any) => {
  return await instance.get(uri.getAllNotifications + userAlias)
}
export const createKyb = async (requestBody: any) => {
  return await instance.post(uri.createKyb, requestBody);
};
export const updateKybAddress = async (requestBody: any) => {
  return await instance.put(uri.updateKybAddress, requestBody);
};
export const updateRepresentative = async (requestBody: any) => {
  return await instance.put(uri.updateRepresentative, requestBody);
};
export const updateBeneficialOwner = async (requestBody: any) => {
  return await instance.put(uri.updateBeneficialOwner, requestBody);
};
export const updateShareHolder = async (requestBody: any) => {
  return await instance.put(uri.updateShareHolder, requestBody);
};
export const updateDocuments = async (requestBody:object)=>{
  return await instance.post(uri.updateDocuments,requestBody) 
}
export const updateFinal = async (requestBody: any) => {
  return await instance.put(uri.updateFinal, requestBody);
};

export const updateFinalV2 = async (requestBody: any) => {
  return await instance.put(uri.updateFinalV2, requestBody);
};
export const updateUserName = async (requestBody: any) => {
  return await instance.put(uri.updateUserName, requestBody);
};
export const checkoutRazorpayPayment = async (requestBody:any) => {
  return await instance.post(uri.checkoutRazorPayPayment, requestBody);
};

export const confirmRazorpayPayment = async (requestBody:any) => {
  return await instance.post(uri.confirmRazorPayPayment, requestBody);
};
export const assignTrustee = async (requestBody:any) => {
  return await instance.post(uri.assignTrustee, requestBody);
};
export const emailAfterVerifyDoc = async (idOfContract:any, docForEmail:any, userType:any) => {
  return await instance.get(uri.emailAfterDocVerify + idOfContract + '/' + docForEmail + '/' + userType);
};

export const emailAfterReleaseDoc = async (idOfContract:any) => {
  return await instance.get(uri.emailAfterReleaseAdd + idOfContract);
};

export const emailAfterRejectDoc = async (idOfContract:any, docForEmail:any, reason:any, userType:any) => {
  return await instance.get(uri.emailAfterDocReject + idOfContract + '/' + docForEmail + '/' + reason + '/' + userType);
};

export const emailAfterKycPending = async (contractAlias:any) => {
  return await instance.get(uri.emailAfterPendingKyc + contractAlias);
};

export const emailAfterNotCompliant = async (contractAlias:any) => {
  return await instance.get(uri.emailAfterNotCom + contractAlias);
};

export const emailForBankNotAdded = async (contractAlias:any) => {
  return await instance.get(uri.emailForNotAddedBank + contractAlias);
};
export const emailForTrusteeApproval = async (contractAlias:any) => {
  return await instance.get(uri.emailForApprovalTrustee + contractAlias);
};

export const emailAfterOnlinePayment = async (contractAlias:any) => {
  return await instance.get(uri.emailAfterOnlinePayment + contractAlias);
};
export const getPaymentOptions = async () => {
  return await instance.get(uri.getPaymentOptions);
};
export const checkoutWireTransfer = async (requestBody:any) => {
  return await instance.post(uri.checkoutWireTransfer, requestBody);
};

export const confirmWireTransfer = async (requestBody:any) => {
  return await instance.post(uri.confirmWireTransfer, requestBody);
};
export const addFundsEmailToApprover = async(contractId:any) => {
  return await instance.post(uri.addFundsEmailToApprover + contractId);
}
export const addFundsByApprover = async(contractId:any, amount:any) => {
  return await instance.post(uri.addFundsApprover + contractId +`?buyerAmount=${amount}`)
}
export const blockOrUnblockFunds = async(transactionAlias:any,action:any) => {
  return await instance.post(uri.blockOrUnblockFunds + transactionAlias + `?action=${action}`)
}

export const fetchBankDetailsByUserAlias = async (userAlias: any) => {
  return await instance.get(uri.fetchBankDetailsByUserAlias + userAlias?.id);
}
export const deleteSignFile = async (payload:any) => {
    return await instance.post(uri.deleteSignatureFile,payload);
};

export const getUserNameFromDocument = (data: any) => {
  let name = '';

  for (let i = 0; i < data.length; i++) {
      if (data[i].startsWith('Name:')) {
          name = data[i].split(': ')[1]; // Splitting to get the name after "Name: "
          break;
      }
  }
  return name;
}

export const getUserNationalityFromDocument = (data: any) => {
  let name = '';

  for (let i = 0; i < data.length; i++) {
      if (data[i].startsWith('Nationality:')) {
          name = data[i].split(': ')[1]; // Splitting to get the name after "Name: "
          break;
      }
  }
  return name;
}

export const getUserNameFromPassport = (dataArray: any) => {
  // Search for any label containing "Given names" using a regular expression
  // const givenNamesLabelIndex = dataArray.findIndex((label: any) => label.toLowerCase().includes('given name'));
  const labelNamesVariations = ["given name", "name(s)", "name / nom"];
  const givenNamesLabelIndex = dataArray.findIndex((label: any) => {
    const lowerCaseLabel = label.toLowerCase().trim();
    return labelNamesVariations.some((variation: any) => lowerCaseLabel.includes(variation));
  });
  const surnameLabelIndex = dataArray.findIndex((label: any) => label.toLowerCase().includes('surname'))
  let name;

  if (givenNamesLabelIndex !== -1 && givenNamesLabelIndex < dataArray.length - 1) {
    // Extract given names from the label using regex
    if (["Sex", "sex", "Personal No."].includes(dataArray[givenNamesLabelIndex + 1])) {
      name = dataArray[givenNamesLabelIndex + 2] + ' ';
    } else {
      name = dataArray[givenNamesLabelIndex + 1] + ' ';
    }
  } 
  if (surnameLabelIndex !== -1 && surnameLabelIndex < dataArray.length - 1) {
    if (["Passport No", "passport no", "Passport No."].includes(dataArray[surnameLabelIndex + 1])) {
      name += dataArray[surnameLabelIndex + 2];
    } else {
      name += dataArray[surnameLabelIndex + 1];
    }
  } else {
    return null; // Given names label not found or no value found after the label
  }
  return name;
}



export const downloadUserCSV = async (requestBody:any) => {
  return await instance.get(uri.downloadUserCSV + `?id=${requestBody}`)
};

export const addUserAddress =async (reqBody: any) => {
  return await instance.post(uri.addUserAddress, reqBody)
}

export const getUserAddress =async (userAlias: any) => {
  return await instance.get(uri.getUserAddress + userAlias)
}

export const updateUserAddress =async (userAlias: any,reqBody:any) => {
  return await instance.put(uri.updateUserAddress + userAlias, reqBody)
}
//ESCROW_ADVISOR 
export const getEscrowUserList =async (userAlias: any,
  current = 0,
  pageSize = 10,) => {
  return await instance.get(uri.escrowAdvisorUserList + userAlias+`?page=${current}&limit=${pageSize}`)
}

export const createSupport = async(reqBody: any)=>{
  return await instance.post(uri.supportandHelp, reqBody)
}

export const deleteMoaDocument = async (requestBody: any) => {
  return await instance.delete(uri.deleteMoaDocument, { data: requestBody });
};

export const userVerify = async (userAlias: any) => {
  return await instance.get(uri.verifyUser + `?userAlias=${userAlias}`);
};

export const verifyUserByEmail = async (requestBody: any) => {
  return await instance.post(uri.verifyUserByEmail, requestBody);
};

export const verifyEmailLogin = async (requestBody: any) => {
  return await instance.post(uri.verifyEmailLogin, requestBody);
};

export const reSendVerificationCode = async (requestBody: any) => {
  return await instance.post(uri.reSendVerificationCode, requestBody);
};

export const getIdNumberFromDocument = (data: any) => {
  let idNumber = '';
  const idRegex = /\b\d{3}-\d{4}-\d{7}-\d\b/;

  for (let i = 0; i < data.length; i++) {
    const match = data[i].match(idRegex);
    if (match) {
      idNumber = match[0];
      break;
    }
  }

  idNumber = idNumber.replace(/-/g, '');

  return idNumber;
};
export const getUserEmail = async (userAlias : any) => {
  return await instance.get(uri.getUserEmail + `?userAlias=${userAlias}`);
};
export const verifyUserByEmail2 = async (requestBody: any) => {
  return await instance.post(uri.verifyUserByEmail2, requestBody);
};

export const getUserPassportNumber = (dataArray: any) => {
  const labelDocumentNumberVariations = ["document no.", "passport no", "passport no."];
  const givenDocumentNumberLabelIndex = dataArray.findIndex((label: any) => {
    const lowerCaseLabel = label.toLowerCase().trim();
    return labelDocumentNumberVariations.some((variation: any) => lowerCaseLabel.includes(variation));
  });
  let idNumber;
  if (givenDocumentNumberLabelIndex !== -1 && givenDocumentNumberLabelIndex < dataArray.length - 1) {
    if (["IND","ind"].includes(dataArray[givenDocumentNumberLabelIndex + 2])) {
      idNumber = dataArray[givenDocumentNumberLabelIndex + 3];
    } else {
      idNumber = dataArray[givenDocumentNumberLabelIndex + 2];
    }
  } else {
    return null;
  }
  return idNumber;
}

export const readImageData = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const extractTextFromImage = async (imageData: any): Promise<any> => {
  const { data: { text, confidence } } = await Tesseract.recognize(
    imageData,
    'eng', // English language
    // { logger: m => console.log(m) } // Optional logger function
  );

  return {
    text: text.trim(),
    averageAccuracy: confidence // This might be the average confidence across all recognized text
  };
};

 export const extractTextFromCanvas = async (canvas: HTMLCanvasElement) => {
    const { data: { text, confidence } } = await Tesseract.recognize(
      canvas,
      'eng'
    );
    return { text: text.trim(), averageAccuracy: confidence };
  };

export const getCompanyNameFromDocument = (data: any): string => {
  const regex = /[^a-zA-Z0-9\s]/g;
  const patterns = {
    companyName: /^Company Name:?/,
    operatingName: /^OPERATING\s+NAME\s+/i,
    tradingName: /^Trading Name:?/,
    tradeName: /^Trade Name:?/,
  };

  const extractCompanyName = (line: string, pattern: RegExp): string => {
    const match:any = line.match(pattern);
    return match ? match?.input.replace(pattern, '').trim() : '';
  };

  const relevantLine = data.find((line:any) =>
    patterns.companyName.test(line) ||
    patterns.operatingName.test(line) ||
    patterns.tradingName.test(line) ||
    patterns.tradeName.test(line)
  );

  if (relevantLine) {

    if (patterns.companyName.test(relevantLine)) {
      return data[data.indexOf(relevantLine) + 1]?.replace(regex, "") || '';
    }
    if (patterns.operatingName.test(relevantLine)) {
      return extractCompanyName(relevantLine, patterns.operatingName)?.replace(regex, "");
    }
    if (patterns.tradingName.test(relevantLine)) {
      return data[data.indexOf(relevantLine) + 1]?.replace(regex, "") || '';
    }
    if (patterns.tradeName.test(relevantLine)) {
      const index = data.indexOf(relevantLine);
      return  (data[index + 1] === ":" ? data[index + 2]?.replace(regex, "") : data[index + 1]?.replace(regex, "")) || '';
    }
  }

  return '';
};

export const getUaepgsBankList = async (entityType: any) => {
  return await instance.get(uri.getUaepgsBankList + `?entityType=${entityType}`);
};

export const getPaymentLogsByTransactionAlias = async (transactionAlias: string) => {
  return await instance.get(uri.getPaymentLogsByTransactionAlias + transactionAlias)
}

export const getGuestUser = async (userAlias: string) => {
  return await instance.get(uri.getGuestUser + `/${userAlias}`)
}

export const getCurrencyList = async () => {
  return await instance.get(uri.getCurrencyList)
}

export const getForexExchangeRate = async (queryOptions: {
  sourceCurrencyCode: string
  destinationCurrencyCode: string
  srcAmount: string
}) => {
  return await instance.get(uri.getForexExchangeRate + `?sourceCurrencyCode=${queryOptions.sourceCurrencyCode}&destinationCurrencyCode=${queryOptions.destinationCurrencyCode}&srcAmount=${queryOptions.srcAmount}`)
}

export const updateContractPayoutAccount = async (body: {
  contractAlias: string;
  bankAlias: string;
}) => {
  return await instance.post(uri.updateContractPayoutAccount, body)
}




export const inviteUser = async (requestBody: any): Promise<any> => {
  return await instance.post(uri.inviteuser, requestBody);
};

