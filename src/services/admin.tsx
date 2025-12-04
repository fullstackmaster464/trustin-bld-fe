/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import instance from "./axios";

const uri = {
  getUsersList: "api/v1/users/admin/all",
  getusermanagementFilter:"api/v1/users/admin/filter",
  updateUserStatus: "/api/v1/users/trustee",
  getuserDetail: "/api/v1/users/trustee/",
  getVirtualAccountsList: "/api/v1/virtual-account/all",
  virtualAccountDetails: "/api/v1/virtual-account/details/",
  virtualAccountSearch: "/api/v1/virtual-account/search/",
  getUserDetails: "api/v1/users/",
  updateProfile: "api/v1/users/",
  getLoggers: "api/v1/logger/",
  weeklyReportAdmin: "api/v1/admin/transacton/weeklyReport",
  fetchAllItemCategories: "/api/v1/meta/itemCategories/all",
  overallStateCount: "api/v1/admin/stats/",
  yearlyGraphData: "api/v1/admin/transacton/yearWiseReport",
  getTxnList: "api/v1/admin/contract/all",
  getGraphDataByYear: "api/v1/admin/transacton/yearlyReport",
  fetchKybDetails: "api/v1/ekyc/",
  verifyKybDoc: "api/v1/ekyc/verifyDocuments",
  verifyDuplicateDocuments: "api/v1/ekyc/verifyDuplicateDocuments",
  verifyKyb: "api/v1/ekyc/updateKyb", 
  updateKyb:"api/v1/ekyc/updateKyb",
  updateKybKycRiskClassification: "api/v1/ekyc/updateKybKycRiskClassification",
  downloadkybDetails: "/api/v1/ekyc/kyb/download?id=",
  getItemTypes: "/api/v1/meta/itemTypes/all",
  searchItemType: "api/v1/meta/itemTypes/search",
  searchRSItemType: "api/v1/meta/realestatetype/search",
  searchCategoryType: "api/v1/meta/itemCategories/search",
  searchRSCategoryType: "api/v1/meta/realestatecategory/search",
  ItemTypeChanges: "api/v1/meta/itemtype",
  EditItemType: "api/v1/meta/itemType",
  deleteItemCategory: "/api/v1/meta/itemCategory/",
  updateItemCategoryStatus: "/api/v1/meta/itemCategory",
  createItemTypeCategory: "/api/v1/meta/itemCategory",
  getSingleDynamicField: "/api/v1/meta/itemCategory/",
  allItemType: "/api/v1/meta/itemtypesandcategories",
  allItemtypesandcategories: "/api/v1/meta/allItemtypesandcategories/",
  scheduleDetails: "api/v1/admin/enterprise/contactById",
  scheduledMeeting: "api/v1/admin/enterprise/contactScheduledMeeting",
  clientFeedback: "api/v1/admin/enterprise/clientIsInterested",
  getAllValidationType: "/api/v1/meta/regexValues",
  createDynamicField: '/api/v1/meta/dynamicInputFields',
  deleteItemTypeInputField: '/api/v1/meta/deleteInputFields',
  searchKybList: '/api/v1/ekyc/search',
  getPaymentDetails: 'api/v1/contracts/payment/',
  updateContract: 'api/v1/contracts/update/',
  getTxnDetails: 'api/v1/contracts/transaction/',
  getContractDetails: '/api/v1/contracts/',
  getContractHistoryByContractAlias: '/api/v1/contract-history/',
  verifyContract: '/api/v1/contracts/verifyContract',
  approveDocument:"api/v1/contracts/approveDocuments",
  getVerifyContract: "api/v1/users/",
  getUserByAlias: 'api/v1/users/trustee/',
  refundGenerate: "api/v1/payment/refund/razorpay",
  disputeResolved: "api/v1/dispute/resolveDispute",
  remarkAdd: "api/v1/dispute/addRemarks",
  searchDisputed: "api/v1/dispute/search",
  fetchBankDetailsByUserAlias: 'api/v1/bank/userAlias/',
  partialRefund: "api/v1/admin/partialRefund",
  partialRefundV2: "api/v1/admin/partialRefundV2",
  milestoneRefund: "api/v1/admin/milestoneRefund",
  milestoneRefundV2: "api/v1/admin/milestoneRefundV2",
  updateExpiry: "api/v1/admin/removeExpiry",
  getFiltereTxndData: "api/v1/admin/transaction/filter",
  fetchDynamicInputFields: '/api/v1/meta/itemtypeinputfields/',
  getItemTypeCategoryByItemAlias: '/api/v1/meta/itemCategory/',
  getrealestateCategoryByItemAlias: '/api/v1/meta/getrealestatecategory/',
  getRSTypeByCatAlias: '/api/v1/meta/getrealestatetypebycategory/',
  convertCurrency: '/api/v1/meta/currencyRates',
  getCommonPdf: "/api/v1/contracts/getPdf",
  getVirtualAccountPDF: "/api/v1/virtual-account/pdf/",
  getPaymentReceiptPDF: "/api/v1/payment/pdf/",
  holdKYC:"api/v1/ekyc/holdKyb",
  updateImageStatus: 'api/v1/contracts/updateimagestatus',
  emailAfterDocVerify: 'api/v1/contracts/emailAfterVerifyDoc/',
  emailAfterDocReject: 'api/v1/contracts/emailAfterRejectDoc/',
  searchAggrement:'api/v1/admin/contract/search',
  getPaymentLog: '/api/v1/payment/paymentLog',
  paymentLogFilter: '/api/v1/payment/filter',
  uaepgsUrl: 'api/v1/reference-data/uaepgs',
  getPaymentLogByAlias:'api/v1/paymentLog/',
  getRiskConfiguration:"api/v1/ekyc/risk-configuration",
  getKyc: "api/v1/ekyc/get-kyc",
  saveKyc: "api/v1/ekyc/save-kyc",
  getRiskAssessment: "api/v1/ekyc/risk-assessment",
  saveDigiScreeningHistory: "api/v1/ekyc/digiScreeningHistory/create",
  markCompliance: "api/v1/admin/compliance",
  complianceRejectReason: "api/v1/admin/reason-for-rejection",
  getPartialRefund: "api/v1/admin/payment/",
  custumerSearch: "api/v1/admin/enterprise/search",
  getSupportlist: "api/v1/support/getSupport",
  searchSupport:"api/v1/support/search",
  UpdateSupportList: "api/v1/support",
  deleteSupportList: "api/v1/support",
  getSupportbyuserAlias :"api/v1/support",
  getSupportbyid :"api/v1/support",
  getTypeOfIssue: "/api/v1/meta/typeOfIssue/all",
  EditTypeOfIssue: "api/v1/meta/type-of-issue",
  TypeOfissue: "api/v1/meta/type-of-issue",
  TypeOfIssueChanges: "api/v1/meta/type-of-issue",
  searchTypeOfissue: "api/v1/meta/type-of-issue/search",
  getUaepgsFormDataUrl: 'api/v1/reference-data/uaepgs/form-data',
  ItemTypeFilter : "api/v1/meta/itemcategory/filter",
  getPaymentMethods: 'api/v1/payment/methods',
  getAllPaymentMethods: 'api/v1/payment/allMethods',
  createPaymentMethods: 'api/v1/payment/create-payment',
  editPaymentMethods: 'api/v1/payment/update-method',
  ItemCategoryFilter : "api/v1/meta/itemTypes/filter",
  getItemCategoryByEntityType:  "api/v1/meta/itemTypes",
  createVirtualAccount: 'api/v1/contracts/create-virtual/account',
  getVaTransactionListByContractAlias: 'api/v1/contracts/vaTransactionListByContractAlias/',
  getManagementUserList: "api/v1/users/get-management/user-list",
  resendOtp: 'api/v1/users/resendOtp',
  syncStrydeDetails: 'api/v1/stryde/sync',
  getStrydeListByEntityType: 'api/v1/stryde/',
  getsyncStrydeDetailsByAlias: 'api/v1/stryde/',
  verifyStrydeByAlias: 'api/v1/stryde/',
  verifyStrydeDocumentByAlias: 'api/v1/stryde/',
  updateClientClassificationByAlias: 'api/v1/stryde/',
  getStrydeDigiscreening: 'api/v1/stryde/',
  getStrydeDigiscreeningSave: 'api/v1/stryde/',

  createRealEstateCategory: "api/v1/meta/realestatecategory/",
  updateRealEstateCategory: "api/v1/meta/realestatecategory/",
  getRealEstateCategory: "api/v1/meta/realestatecategory",
  deleteRealEstateCategory: "api/v1/meta/realestatecategory/",
  realestatetypecategory : "api/v1/meta/realestatetypecategory",

  createRealEstateType: "api/v1/meta/realestatetype",
  updateRealEstateType: "api/v1/meta/realestatetype/",
  getRealEstateType: "api/v1/meta/realestatetype/",
  deleteRealEstateType: "api/v1/meta/realestatetype/",
  createOrUpdatePlatformFees: "/api/v1/meta/user-platform-fees",
  getUserPlatformFeeList: "/api/v1/meta/user-platform-fee-list",
  unblockUser :"api/v1/admin/unblock"
};

export const fetchAllUsers = async (
  current = 0,
  pageSize = 10,
  userType = "ALL",
  sortBy = "",
  orderBy = ""
) => {

  return await instance.get(
    uri.getUsersList +
      `?page=${current}&limit=${pageSize}&userType=${userType}&${sortBy}=${orderBy}`
  );
};

export const downloadDetails = async (url: string) => {
  return await instance.get(url, {
    responseType: "blob",
  });
};

export const updateUserStatus = async (requestBody: any) => {
  return await instance.put(uri.updateUserStatus, requestBody);
};
export const fetchallVirtualAccounts = async (
  current = 0,
  pageSize = 10,
  status = ""
) => {
  if (status !== "")
    return await instance.get(
      uri.getVirtualAccountsList +
        `?page=${current}&limit=${pageSize}&status=${status}`
    );
  else
    return await instance.get(
      uri.getVirtualAccountsList + `?page=${current}&limit=${pageSize}`
    );
};

export const virtualAccountDetails = async (userAlias: string, currency?:string) => {
  let url = "";
  if(currency) {
    url = uri.virtualAccountDetails + userAlias + `?currency=${currency}`
  } else{
    url = uri.virtualAccountDetails + userAlias
  }
  return await instance.get(url);
};

export const getUserData = async (userEmail: string) => {
  return await instance.get(uri.getUserDetails + userEmail);
};

export const getLoggers = async (userAlias: string) => {
  return await instance.get(uri.getLoggers + userAlias);
};

export const updateUserProfile = async (requestBody: object) => {
  return await instance.put(uri.updateProfile, requestBody);
};

export const resendOtp = async (requestBody: object) => {
  return await instance.post(uri.resendOtp, requestBody);
};
export const adminWeeklyReportGraph = async () => {
  return await instance.get(uri.weeklyReportAdmin);
};
export const getItemCategoryList = async (
  current: number,
  pageSize: number,
  entityType = ""
) => {
  return await instance.get(
    uri.fetchAllItemCategories + `?page=${current}&limit=${pageSize}&entityType=${entityType}`
  );
};
export const adminDashboardData = async (time: string) => {
  return await instance.get(uri.overallStateCount + time);
};

export const yearlyGraphData = async () => {
  return await instance.get(uri.yearlyGraphData);
};
export const getTxnList = async (
  current: number,
  pageSize: number,
  contractStatus: string
) => {
  return await instance.get(
    uri.getTxnList + `?page=${current}&limit=${pageSize}&status=${contractStatus}`
  );
};
export const getGraphDataByYear = async (reqBody: object) => {
  return await instance.post(uri.getGraphDataByYear, reqBody);
};

export const getuserDetail = async (userAlias: any) => {
  return await instance.get(uri.getuserDetail + userAlias);
};

export const fetchKybDetails = async (userAlias: any, calculateOcr = false) => {
  let url = uri.fetchKybDetails + userAlias;

  if (calculateOcr) {
    url += `?ocr=1`;
  }
  return await instance.get(url);
};
export const fetchKybSummary = async (userAlias: any) => {
  const url = uri.fetchKybDetails + userAlias + '/summary';
  return await instance.get(url);
}
export const verifyKybDocument = async (reqBody: object) => {
  return await instance.put(uri.verifyKybDoc, reqBody);
};

export const verifyDuplicateDocuments = async (fileid: any,reqBody: object) => {
  return await instance.put(uri.verifyDuplicateDocuments+ `/${fileid}`, reqBody);
};


export const verifyKyb = async (requestBody: object) => {
  return await instance.put(uri.verifyKyb, requestBody);
};

export const updateKyb = async (userAlias: any, reqBody:object) => {
  return await instance.put(uri.updateKyb+ `/${userAlias}`, reqBody);
}; 

export const createPlatformFees = async (reqBody: any) => {
  return await instance.post(uri.createOrUpdatePlatformFees, reqBody);
};

export const updatePlatformFees = async (id: number | string, reqBody: any) => {
  return await instance.put(uri.createOrUpdatePlatformFees + `/${id}`, reqBody);
};

export const getUserPlatformFees = (userAlias: string, transactionType: string) => {
  return instance.get(uri.createOrUpdatePlatformFees + `/${userAlias}?transactionType=${transactionType}`);
};

export const getAllUserPlatformFeesByUserAlias = (userAlias: string) => {
  return instance.get(uri.getUserPlatformFeeList + `/${userAlias}`);
};

export const updateKybKycRiskClassification = async (requestBody: object) => {
  return await instance.put(uri.updateKybKycRiskClassification, requestBody);
};

export const downloadKybDetails = async (userAlias: any) => {
  return await instance.get(uri.downloadkybDetails + userAlias, {
    responseType: "blob",
  });
};

export const getItemTypeList = async (current: number, pageSize: number) => {
  return await instance.get(
    uri.getItemTypes + `?page=${current}&limit=${pageSize}`
  );
};
export const searchItemType = async (
  current = 1,
  pageSize = 10,
  reqBody: object
) => {
  return await instance.post(
    uri.searchItemType + `?page=${current}&limit=${pageSize}`,
    reqBody
  );
};
export const searchCategoryType = async (
  current = 1,
  pageSize = 10,
  reqBody: object
) => {
  return await instance.post(
    uri.searchCategoryType + `?page=${current}&limit=${pageSize}`,
    reqBody
  );
};



export const searchRSItemType = async (
  current = 1,
  pageSize = 10,
  reqBody: object
) => {
  return await instance.post(
    uri.searchRSItemType + `?page=${current}&limit=${pageSize}`,
    reqBody
  );
};

export const searchRSCategoryType = async (
  current = 1,
  pageSize = 10,
  reqBody: object
) => {
  return await instance.post( uri.searchRSCategoryType + `?page=${current}&limit=${pageSize}`,reqBody);
};



export const createItemType = async (reqBody: object) => {
  return await instance.post(uri.ItemTypeChanges, reqBody);
};
export const updateItemTypeStatus = async (reqBody: object) => {
  return await instance.put(uri.ItemTypeChanges, reqBody);
};
export const deleteItemType = async (aliasName: string) => {
  return await instance.delete(uri.ItemTypeChanges + "/" + aliasName);
};
export const editItemType = async (reqBody: object) => {
  return await instance.put(uri.EditItemType, reqBody);
};

export const deleteItemCategory = async (aliasName: string) => {
  return await instance.delete(uri.deleteItemCategory + aliasName);
};
export const updateItemCategoryStatus = async (reqBody: object) => {
  return await instance.put(uri.updateItemCategoryStatus, reqBody);
};
export const createItemTypeCategory = async (reqBody: object) => {
  return await instance.post(uri.createItemTypeCategory, reqBody);
};
export const getSingleDynamicField = async (dynamicInputId: any) => {
  return await instance.get(uri.getSingleDynamicField + dynamicInputId);
};

export const getAllRSType = async (entityType: any) => {
  return await instance.get(uri.allItemType + `?entityType=${entityType}`);
};

export const getAllItemType = async (entityType: any) => {
  return await instance.get(uri.allItemType + `?entityType=${entityType}`);
};
export const getAllItemtypesandCategories = async () => {
  return await instance.get(uri.allItemtypesandcategories);
};

export const createRealEstateCategory = async (data: any) => {
  return await instance.post(uri.createRealEstateCategory, data);
};
export const updateRealEstateCategory = async (aliasname: string, data: any) => {
  return await instance.put(`${uri.updateRealEstateCategory}${aliasname}`, data);
};
export const getRealEstateCategory = async (aliasname: string, page = 0, limit = 10) => {
  return await instance.get(`${uri.getRealEstateCategory}${aliasname}?page=${page}&limit=${limit}`);
};
export const getRealEstateCategoryByEntity = async (page = 0, limit = 10, entityType : string) => {
  return await instance.get(`${uri.getRealEstateCategory}?page=${page}&limit=${limit}&entityType=${entityType}`);
};
export const realestatetypecategory = async (entityType: string) => {
  return await instance.get(`${uri.realestatetypecategory}?entityType=${entityType}`);
};

export const deleteRealEstateCategory = async (aliasname: string) => {
  return await instance.delete(`${uri.deleteRealEstateCategory}${aliasname}`);
};

// Real Estate Type APIs
export const createRealEstateType = async (data: any) => {
  return await instance.post(uri.createRealEstateType, data);
};
export const updateRealEstateType = async (aliasname: string, data: any) => {
  return await instance.put(`${uri.updateRealEstateType}${aliasname}`, data);
};
export const getRealEstateType = async (aliasname: string, page = 0, limit = 10) => {
  return await instance.get(`${uri.getRealEstateType}${aliasname}?page=${page}&limit=${limit}`);
};
export const getRealEstateTypeByEntity = async (page = 0, limit = 10, entityType : string) => {
  return await instance.get(`${uri.getRealEstateType}?page=${page}&limit=${limit}&entityType=${entityType}`);
};
export const deleteRealEstateType = async (aliasname: string) => {
  return await instance.delete(`${uri.deleteRealEstateType}${aliasname}`);
};

export const scheduleDetails = async (reqBody: object) => {
  return await instance.post(uri.scheduleDetails, reqBody);
};

export const scheduledMeeting = async (reqBody: object) => {
  return await instance.post(uri.scheduledMeeting, reqBody);
};
export const custumerSearch = async (
  current = 1,
  pageSize = 10,
  sortBy = null,
  orderBy = null,
  reqBody:any
) => {
  return await instance.post(
    uri.custumerSearch +
      `?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,
    reqBody
  );
};
export const clientFeedback = async (reqBody: object) => {
  return await instance.post(uri.clientFeedback, reqBody);
};
export const getAllValidationType = async () => {
  return await instance.get(uri.getAllValidationType);
};
export const createDynamicField = async (requestBody:object) => {
  return await instance.post(uri.createDynamicField, requestBody);
};

export const getSubFieldsData = async (aliasName:string) => {
  return await instance.get(uri.createDynamicField+'/'+aliasName);
};

export const updateDynamicField = async (requestBody:object) => {
  return await instance.put(uri.createDynamicField, requestBody);
};
export const deleteItemTypeInputField = async (aliasName:string) => {
  return await instance.post(uri.deleteItemTypeInputField, {
    aliasName: aliasName,
  });
};

export const approveDocument = async (reqBody: any) => {
  return await instance.post(uri.approveDocument, reqBody)
}

export const searchList = async (
  current = 1,
  pageSize = 10,
  sortBy = 'sortByAgreementId',
  orderBy = 'DESC',
  reqBody:object
) => {
  return await instance.post(
    uri.searchKybList +
    `?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,
    reqBody
  );
};

export const searchAggrement = async (
  current = 1,
  pageSize = 10,
  sortBy = 'sortByAgreementId',
  orderBy = 'DESC',
  reqBody:object
) => {
  return await instance.post(
    uri.searchAggrement +
      `?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,
    reqBody
  );
};
export const searchVirtualAccount = async (
  current = 1,
  pageSize = 10,
  sortBy = 'sortByAgreementId',
  orderBy = 'DESC',
  reqBody:object
) => {
  return await instance.post(
    uri.virtualAccountSearch +
      `?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,
    reqBody
  );
};

export const getPaymentDetails = async (contractId: any, contractType?: string): Promise<any> => {
  let url = uri.getPaymentDetails + contractId;
  if (contractType) {
    url += `?contractType=${contractType}`;
  }
  return await instance.get(url);
};

export const getTxnData = async (contractId: any, contractType?: string): Promise<any> => {
  let url = uri.getTxnDetails + contractId;
  if (contractType) {
    url += `?contractType=${contractType}`;
  }
  return await instance.get(url);
};

export const getContractDetails = async (contractId: any, userAlias: string, contractType?: string): Promise<any> => {
  let url = `${uri.getContractDetails}${contractId}/${userAlias}`;
  if (contractType) {
    url += `?contractType=${contractType}`;
  }
  return await instance.get(url);
};

export const getContractHistory = async (contractAlias:string) => {
  return await instance.get(uri.getContractHistoryByContractAlias + contractAlias);
}

export const verifyContract = async (reqBody:object) => {
  return await instance.put(uri.verifyContract, reqBody)
};
export const getTransactionListToVerify = async (accountType:string, transactionAlias: string) => {
  return await instance.get(
    `${uri.getVerifyContract}${"vatransaction"}/${accountType}/${transactionAlias}`
  );
};

export const getTransactionLinkList = async (transactionAlias: string) => {
  return await instance.get(
    `${uri.getVerifyContract}${"vaTransactionLinks"}/${transactionAlias}`
  );
};
export const getUserByAlias = async (userAlias:string) => {
  return await instance.get(uri.getUserByAlias + userAlias)
};
export const refundGenerate = async (reqBody:object) => {
  return await instance.post(uri.refundGenerate, reqBody);
};

export const disputeResolved = async (reqBody:object) => {
  return await instance.post(uri.disputeResolved, reqBody);
};
export const searchDisputed = async (
  current = 0,
  pageSize = 10,
  userType = "ALL",
  sortBy = 'sortByAgreementId',
  orderBy = 'DESC',
  reqBody:object
) => {
  return await instance.post(
    uri.searchDisputed +
      `?page=${current}&limit=${pageSize}&status=${userType}&${sortBy}=${orderBy}`,
    reqBody
  );
};
export const remarkAdd = async (reqBody:object) => {
  return await instance.post(uri.remarkAdd, reqBody);
};
export const fetchBankDetailsByUserAlias = async (userAlias:string) => {
  return await instance.get(uri.fetchBankDetailsByUserAlias + userAlias);
}
export const submitPartialRefund = async (reqBody:object) => {
  return await instance.post(uri.partialRefund, reqBody);
};
export const submitPartialRefundV2 = async (reqBody:object) => {
  return await instance.post(uri.partialRefundV2, reqBody);
};
export const submitMilestoneRefund = async (reqBody:object) => {
  return await instance.post(uri.milestoneRefund, reqBody);
};
export const submitMilestoneRefundV2 = async (reqBody:object) => {
  return await instance.post(uri.milestoneRefundV2, reqBody);
};
export const updateExpiry = async (contractAlias:string) => {
  return await instance.put(uri.updateExpiry, { contractAlias: contractAlias });
};
export const filteredTransaction = async (reqBody:object, limit:number, page:number) => {
  return await instance.post(
    uri.getFiltereTxndData + `?limit=${limit}&page=${page}`,
    reqBody
  );
};
export const getDynamicInputFields = async (itemCategoryAlias:string) => {
  return await instance.get(uri.fetchDynamicInputFields + itemCategoryAlias);
};
export const getItemTypeCategoryByItemAlias = async (itemCategory:string) => {
  return await instance.get(uri.getItemTypeCategoryByItemAlias + itemCategory);
};
export const getRSCategoryByItemAlias = async (itemCategory:string) => {
  return await instance.get(uri.getrealestateCategoryByItemAlias + itemCategory);
};
export const getRSTypeByCatAlias = async (itemCategory:string) => {
  return await instance.get(uri.getRSTypeByCatAlias + itemCategory);
};
export const convertCurrency = async (userAlias:string, convertCurrency:string) => {
  return await instance.get(uri.convertCurrency + `?userAlias=${userAlias}&convertCurrency=${convertCurrency}`);
};
export const getCommonPdf = async (reqBody:any) => {
  return await instance.post(uri.getCommonPdf, reqBody);
};

export const getPaymentReceiptPDF = async (transactionNo: any) => {
  return await instance.get(`${uri.getPaymentReceiptPDF}${transactionNo}`);
};

export const getVirtualAccountPDF = async (userAlias: any, currency: string) => {
  return await instance.get(`${uri.getVirtualAccountPDF}${userAlias}?currency=${currency}`);
};


export const holdKyc = async (reqBody:object) => {
  return await instance.put(uri.holdKYC, reqBody);
};

export const UpdateFileStatus = async (requestBody:object) => {
  return await instance.post(uri.updateImageStatus, requestBody);
};
export const emailAfterVerifyDoc = async (idOfContract:string, docForEmail:string, userType:string) => {
  return await instance.get(uri.emailAfterDocVerify + idOfContract + '/' + docForEmail + '/' + userType);
};
export const emailAfterRejectDoc = async (idOfContract:string, docForEmail:string, reason:string, userType:string) => {
  return await instance.get(uri.emailAfterDocReject + idOfContract + '/' + docForEmail + '/' + reason + '/' + userType);
};

export const getPaymentLog = async ( current = 0, pageSize = 10, paymentStatus: any = null) => {
  return await instance.get(uri.getPaymentLog + 
    `?page=${current}&limit=${pageSize}&paymentStatus=${paymentStatus}`
    )
}

export const uaepgsPayment = async (reqBody:object) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  return await instance.post(uri.uaepgsUrl, reqBody, { headers });
};

export const getPaymentLogByAlias = async (paymentLogAlias:any) => {
  return await instance.get(uri.getPaymentLogByAlias + paymentLogAlias)
}

export const getRiskConfiguration = async (reqBody:object) => {
  return await instance.post(uri.getRiskConfiguration, reqBody);
};
export const getKyc = async (reqBody:object) => {
  return await instance.post(uri.getKyc, reqBody);
};
export const saveKyc = async (reqBody:object) => {
  return await instance.post(uri.saveKyc, reqBody);
};
export const getRiskAssessment = async (reqBody:object) => {
  return await instance.post(uri.getRiskAssessment, reqBody);
};
export const saveDigiScreeningHistory = async (reqBody:object) => {
  return await instance.post(uri.saveDigiScreeningHistory, reqBody);
};
export const markCompliance = async (requestBody: object) => {
  return await instance.post(uri.markCompliance, requestBody);
};

export const complianceRejectReason = async (requestBody: object) => {
  return await instance.post(uri.complianceRejectReason, requestBody);
};

export const getPartialData = async (contractId: any) => {
  return await instance.get(uri.getPartialRefund + `${contractId}`);
};
//Type of issue
export const getSupportList = async (current = 0, pageSize = 10) => {
  return await instance.get(uri.getSupportlist+ `?page=${current}&limit=${pageSize}`);
};

export const getTypeOfIssueList = async (current: number, pageSize: number) => {
  return await instance.get(
    uri.getTypeOfIssue + `?page=${current}&limit=${pageSize}`
  );
};

export const editTypeofissue = async (reqBody: object) => {
  return await instance.put(uri.EditTypeOfIssue, reqBody);
};

export const createTypeOfIssue = async (reqBody: object) => {
  return await instance.post(uri.TypeOfissue, reqBody);
};

export const deleteTypeOfIssue = async (aliasName: string) => {
  return await instance.delete(uri.TypeOfIssueChanges + "/" + aliasName);
};

export const TypeofIssueStatus = async (reqBody: object) => {
  return await instance.put(uri.EditTypeOfIssue, reqBody);
};
export const searchTypeOfIssue = async (
  current = 1,
  pageSize = 10,
  reqBody: object
) => {
  return await instance.post(
    uri.searchTypeOfissue + `?page=${current}&limit=${pageSize}`,
    reqBody
  );
};
export const searchSupportList = async (
  current = 1,
  pageSize = 10,
  reqBody: object
) => {
  return await instance.post(
    uri.searchSupport + `?page=${current}&limit=${pageSize}`,
    reqBody
    );
  }

export const UpdateSupport = async (reqBody:any) =>{
  return await instance.put(
  uri.UpdateSupportList , reqBody);
}
export const deleteSupport = async (id:any) =>{
  return await instance.delete(
  uri.deleteSupportList+"/"+id);
}
export const getSupportByUserAlias = async (current = 0, pageSize = 10,userAlias:any) => {
  return await instance.get(uri.getSupportbyuserAlias+ '/'+userAlias+`?page=${current}&limit=${pageSize}`);
};
export const getSupportById = async (id:any,queryid:any) => {
  return await instance.get(uri.getSupportbyid+ '/getOne/'+id+`?photoId=${queryid}`);
};
export const getUaepgsFormDataUrl = async (reqBody:object) => {
  return await instance.post(uri.getUaepgsFormDataUrl, reqBody);
};
//Item Type filter

export const getItemTypeFilter = async (current = 0, pageSize = 10,reqBody:object) => {
  return await instance.post(uri.ItemTypeFilter+ `?page=${current}&limit=${pageSize}`,reqBody);
};

//Item Category filter
export const getItemCategoryFilter = async (current = 0, pageSize = 10,reqBody:object) => {
  return await instance.post(uri.ItemCategoryFilter+ `?page=${current}&limit=${pageSize}`,reqBody);
}
//paymentLog filter
export const getPaymentLogFilter = async (current = 0, pageSize = 10,reqBody:object) => {
  return await instance.post(uri.paymentLogFilter+ `?page=${current}&limit=${pageSize}`,reqBody);
};

export const getAllPaymentMethodsList = async (current: number, pageSize: number) => {
  return await instance.get(
    uri.getAllPaymentMethods + `?page=${current}&limit=${pageSize}`
  );
};

export const getuserFilter = async (reqBody:object,page:number, limit:number,):Promise<any> => {
  return await instance.post(
    uri.getusermanagementFilter + `?page=${page}&limit=${limit}`,
    reqBody
  );
};

export const getPaymentMethodsList = async () => {
  return await instance.get(uri.getPaymentMethods);
};

export const createPaymentMethods = async (reqBody: object) => {
  return await instance.post(uri.createPaymentMethods, reqBody);
};

export const PaymentMethodsStatus = async (reqBody: object) => {
  return await instance.put(uri.editPaymentMethods, reqBody);
};

export const getItemCategoryListByEntityType = async (entityType: string) => {
  return await instance.get(
    uri.getItemCategoryByEntityType + `?entityType=${entityType}`
  );
};

export const createVirtualAccount = async (requestBody:any) => {
  return await instance.post(uri.createVirtualAccount, requestBody);
};

export const getManagementUserList = async () => {
  return await instance.get(uri.getManagementUserList );
};

export const syncStrydeDetails = async (reqBody: object): Promise<any> => {
  return await instance.post(uri.syncStrydeDetails, reqBody);
};

export const getStrydeListByEntityType = async (
  entityType: string,
  page = 1,
  limit = 10,
  status = "",
  startDate = "",
  endDate = "",
  search = ""
): Promise<any> => {

  const url = `${uri.getStrydeListByEntityType}?entityType=${entityType}&page=${page}&limit=${limit}&status=${status}&startDate=${startDate}&endDate=${endDate}&search=${search}`;
  return await instance.get(url);
};

export const getsyncStrydeDetailsByAlias = async (alias: string): Promise<any> => {
  return await instance.get(uri.getsyncStrydeDetailsByAlias + alias);
};

export const verifyStrydeByAlias = async (strydeAlias: string, requestBody: any): Promise<any> => {
  return await instance.put(uri.verifyStrydeByAlias + strydeAlias + "/verify", requestBody);
};
export const verifyStrydeDocumentByAlias = async (strydeAlias: string, requestBody: any): Promise<any> => {
  return await instance.put(uri.verifyStrydeDocumentByAlias + strydeAlias + "/verify-document", requestBody);
};
export const updateClientClassificationByAlias = async (strydeAlias: string, requestBody: any): Promise<any> => {
  return await instance.put(uri.updateClientClassificationByAlias + strydeAlias + "/update-classification", requestBody);
};
export const getStrydeDigiscreening = async (strydeAlias: string, requestBody: any): Promise<any> => {
  return await instance.post(uri.getStrydeDigiscreening + strydeAlias + "/digi-screening", requestBody);
};
export const getStrydeDigiscreeningSave = async (strydeAlias: string, requestBody: any): Promise<any> => {
  return await instance.post(uri.getStrydeDigiscreeningSave + strydeAlias + "/digi-screening-save", requestBody);
};

export const getVaTransactionListByContractAlias = async (contractAlias: string): Promise<any> => {
  return await instance.get(uri.getVaTransactionListByContractAlias + contractAlias);
}
//unblock User
export const unblockUser = async (requestBody: any): Promise<any> => {
  return await instance.put(uri.unblockUser, requestBody);
};

