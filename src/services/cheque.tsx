import instance from "./axios";

const uri = {
  createCheque: '/api/v1/cheque',
  createReceiveFund: '/api/v1/cheque/receive-fund',
  getInvoicePdf: "/api/v1/cheque/getInvoicePdf/",
  getPdf: "/api/v1/cheque/getPdf/",
  getSellersList : '/api/v1/seller-verification/list',
  fetchsvDetails: "api/v1/seller-verification/getDetails/",
  finishsupplierVerification: "api/v1/seller-verification/update/",
  finishsupplierVerificationStatus: "api/v1/seller-verification/update-status/",
  updateCheque: "api/v1/cheque/",
  finishsupplierverifydoc: "api/v1/seller-verification/verifydoc/",
  kybverification:"api/v1/ekyc/kybverification",
  getChequeList: "/api/v1/cheque/all",
  getAdvanceChequeList: "/api/v1/cheque/all-advance",
  getAdminChequeList: "/api/v1/cheque/admin-all",
  getAdminAdvanceChequeList: "/api/v1/cheque/admin-all-advance",
  searchMCAggrement: "/api/v1/cheque/search",
  getChequeDetails: '/api/v1/cheque/',
  getDraftChequeDetails: '/api/v1/cheque/draftCheque/',
  getChequeHistoryDetails: '/api/v1/cheque-history/',
  getSellerVerificationLogs: '/api/v1/seller-verification-log/',
  paymentInitiate: "api/v1/cheque/initiatePayment",
  requestCheque: "api/v1/cheque/requestCheque",
  getSearchUserDetails: "api/v1/users/search-seller/",
  updateFile: "api/v1/cheque/updateFile",
  updateSellerFile: "api/v1/cheque/updateSellerFile",
  chequeVerification: "api/v1/cheque/cheque-verification",
  insertMultiCheque: "api/v1/cheque-detail/insert-multiple/",
  receiveFundMC: "api/v1/cheque-detail/receive-funds/",
  deleteCheque: "api/v1/cheque-detail/",
  insertCheque: "api/v1/cheque-detail/insert/",
  updateChequeDetail: "api/v1/cheque-detail/",
  vaTransaction: "api/v1/va-transaction/block/",
  getTxnDetails: 'api/v1/cheque/transaction/details/',
  getDraftTxnDetails: 'api/v1/cheque/draftcheque/',
  acceptTransaction: 'api/v1/cheque/accept-transaction/',
  updateCheques: 'api/v1/cheque/updateCheque/',
};

export const getTxnData = async (chequeId: any): Promise<any> => {
  const url = uri.getTxnDetails + chequeId;
  return await instance.get(url);
};

export const getDraftTxnData = async (aliasName: any): Promise<any> => {
  const url = uri.getDraftTxnDetails + aliasName;
  return await instance.get(url);
};
 
export const getList = async (userId:any = null,userType : string,current = 0,pageSize = 10,contractStatus = "",sortBy = "sortByAgreementId", orderBy = "DESC") => {
  const filter = contractStatus == "all" || contractStatus == "draft" ? contractStatus : contractStatus.toUpperCase();
  const url = `?userId=${userId}&userType=${userType}&page=${current}&limit=${pageSize}&contractStartedBy=${filter}&${sortBy}=${orderBy}`
  return await instance.get(uri.getChequeList + url);
};

export const getAdvanceChequeList = async (userId:any = null,userType : string,current = 0,pageSize = 10,contractStatus = "",sortBy = "sortByAgreementId", orderBy = "DESC") => {
  const filter = contractStatus == "all" || contractStatus == "draft" ? contractStatus : contractStatus.toUpperCase();
  const url = `?userId=${userId}&userType=${userType}&page=${current}&limit=${pageSize}&contractStartedBy=${filter}&${sortBy}=${orderBy}`
  return await instance.get(uri.getAdvanceChequeList + url);
};


export const getAdminList = async (userId:any = null,userType : string,current = 0,pageSize = 10,contractStatus = "",sortBy = "sortByAgreementId", orderBy = "DESC") => {
  return await instance.get(uri.getAdminChequeList + `?userId=${userId}&userType=${userType}&page=${current}&limit=${pageSize}&status=${contractStatus}&${sortBy}=${orderBy}`);
};

export const getAdminAdvanceChequeList = async (userId:any = null,userType : string,current = 0,pageSize = 10,contractStatus = "",sortBy = "sortByAgreementId", orderBy = "DESC") => {
  return await instance.get(uri.getAdminAdvanceChequeList + `?userId=${userId}&userType=${userType}&page=${current}&limit=${pageSize}&status=${contractStatus}&${sortBy}=${orderBy}`);
};

export const searchMCAggrement = async (
  current = 1,
  pageSize = 10,
  sortBy = 'sortByAgreementId',
  orderBy = 'DESC',
  reqBody:object
) => {
  return await instance.post(
    uri.searchMCAggrement +
      `?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,
    reqBody
  );
};



export const getChequeDetails = async (chequeId:any, userAlias:string) => {
  return await instance.get(uri.getChequeDetails + chequeId + '/' + userAlias);
};

export const getDraftChequeDetails = async (chequeId:any, userAlias:string) => {
  return await instance.get(uri.getDraftChequeDetails + chequeId + '/' + userAlias);
};

export const createCheque = async (requestBody: any) => {
  return await instance.post(uri.createCheque, requestBody);
};


export const createReceiveFund = async (requestBody: any) => {
  return await instance.post(uri.createReceiveFund, requestBody);
};

export const fetchSellerVrfnDetails = async (userAlias: any) => {
  return await instance.get(uri.fetchsvDetails + userAlias);
};

export const finishSupplier = async (userAlias: any,reqBody : any) => {
  return await instance.put(uri.finishsupplierVerification + userAlias, reqBody);
};

export const updateSupplier = async (userAlias: any,reqBody : any) => {
  return await instance.put(uri.finishsupplierVerificationStatus + userAlias, reqBody);
};

export const updateCheque = async (chequeAlias: any, reqBody : any) => {
  return await instance.patch(uri.updateCheque + chequeAlias, reqBody);
};
export const updateCheques = async (chequeAlias: string, reqBody : any) => {
  return await instance.patch(uri.updateCheques + chequeAlias, reqBody);
};

export const finishsupplierverifydoc = async (reqBody : any) => {
  return await instance.post(uri.finishsupplierverifydoc, reqBody);
};

export const getSearchUserData = async (userEmail: string) => {
  return await instance.get(uri.getSearchUserDetails + userEmail?.toLowerCase());
};

export const getSellersList = async (options: {
  limit?: number,
  page?: number,
  status?: string,
  startDate?: string,
  endDate?: string,
  email?: string,
  search?: string,
}): Promise<any> => {
  const params = new URLSearchParams();

  if (options.page !== undefined) {
    params.append('page', options.page.toString());
  }
  if (options.limit !== undefined) {
    params.append('limit', options.limit.toString());
  }
  if (options.status !== undefined) {
    params.append('status', options.status);
  }
  if (options.startDate) {
    params.append('startDate', options.startDate);
  }
  if (options.endDate) {
    params.append('endDate', options.endDate);
  }
  if (options.email) {
    params.append('email', options.email);
  }
  if (options.search) {
    params.append('search', options.search);
  }

  return await instance.get(uri.getSellersList + '?' + params.toString());
};


export const getInvoicePdf = async (UrlData: any) => {
  return await instance.post(uri.getInvoicePdf , UrlData);
};

export const getPdf = async (UrlData: string) => {
  return await instance.post(uri.getPdf , UrlData);
};



export const kybverification = async (reqBody:object) => {
  return await instance.post(uri.kybverification, reqBody);
};


export const getChequeHistoryDetails = async (chequeId:any, userAlias:string) => {
  return await instance.get(uri.getChequeHistoryDetails + chequeId + '/' + userAlias);
};

export const getSellerVerificationLogs = async (supplierAlias:string) => {
  return await instance.get(uri.getSellerVerificationLogs + supplierAlias);
}

export const updateFile = async(id : any,chequeAlias : string, payLoad : any) => {
  return await instance.post(uri.updateFile+ '/' + id + '/' + chequeAlias, payLoad);
}

export const updateSellerFile = async(id : any, payLoad : any) => {
  return await instance.post(uri.updateSellerFile+ '/' + id , payLoad);
}


export const chequeVerification = async(aliasName : any,payLoad : any) => {
  return await instance.post(uri.chequeVerification+ '/' + aliasName, payLoad);
}

export const paymentInitiate = async(payLoad : any) => {
  return await instance.post(uri.paymentInitiate, payLoad);
}

export const requestCheque = async(payLoad : any) => {
  return await instance.post(uri.requestCheque, payLoad);
}

export const insertMultiCheque = async (chequeId:any, payLoad : any) => {
  return await instance.post(uri.insertMultiCheque + chequeId,payLoad);
};

export const receiveFundMC = async (chequeId:any, payLoad : any) => {
  return await instance.post(uri.receiveFundMC + chequeId,payLoad);
};

export const insertCheque = async (chequeId:any, payLoad : any) => {
  return await instance.post(uri.insertCheque + chequeId,payLoad);
};

export const updateChequeDetail = async (id:any, payLoad : any) => {
  return await instance.put(uri.updateChequeDetail + id,payLoad);
};

export const deleteCheque = async (chequeId:any) => {
  return await instance.delete(uri.deleteCheque + chequeId);
};


export const getblockAmount = async (userAlias:string) => {
  return await instance.get(uri.vaTransaction + userAlias );
}


export const acceptTransaction = async (chequeId:any, payLoad : any) => {
  return await instance.post(uri.acceptTransaction + chequeId, payLoad);
}


