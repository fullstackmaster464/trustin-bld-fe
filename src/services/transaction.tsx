import instance from "./axios";

const uri = {
  fetchContractDetails: "api/v1/contracts/user/",
  getKybList: "api/v1/ekyc/list-all",
  getAllDisputeList: "api/v1/dispute/all",
  getCallsDetails: "api/v1/admin/enterprise/contactList",
  scheduleDetails: "api/v1/admin/enterprise/contactById",
  scheduledMeeting: "api/v1/admin/enterprise/contactScheduledMeeting",
  getEnterpriseList: "api/v1/admin/enterprise/enterpriseList",
  clientFeedback: "api/v1/admin/enterprise/clientIsInterested",
  getEnterpriseCallsDetails: "api/v1/admin/enterpriseCallsDetails",
  sendDocumentContract:'api/v1/contracts/sendEmail',
  updatetransaction: 'api/v1/contracts/updateTransaction',
  emailAfterUploadDoc: 'api/v1/contracts/emailAfterUploadDoc/',
  emailAfterDocVerify: 'api/v1/contracts/emailAfterVerifyDoc/',
  emailAfterDocReject: 'api/v1/contracts/emailAfterRejectDoc/',
  updateImageStatus: 'api/v1/contracts/updateimagestatus',
  addFundsApprover: 'api/v1/trustee/addFunds/',
  blockOrUnblockFunds: 'api/v1/contracts/blockOrUnBlockFunds/',
  changeContractStatus: 'api/v1/contracts/',
  acceptContractStatus: 'api/v1/contracts/accept/',
  rejectContractStatus: 'api/v1/contracts/reject/',
  addRelease: 'api/v1/release/addRelease',
  addReleaseV2: 'api/v1/release/addReleaseV2',
  initiatePayment: 'api/v1/release/initiatePayment',
  getAllDisputesList: 'api/v1/dispute/disputeType',
  addFundsByUser: 'api/v1/contracts/addFundsByUser/',
  addFundsUsingNetBanking: 'api/v1/contracts/addFundsUsingNetBanking',
  getKybVerificationFilter: "api/v1/ekyc/kybVerification/filter",
  generateContractOtp: "api/v1/contracts/generateContractOtp",
  verifyContractOtp: "api/v1/contracts/verifyContractOtp",
  approveSourceOfFundDocument: "api/v1/contracts/approveSourceOfFundDocuments",
  getContractSofDetails: "api/v1/contracts/getSourceOfFundDocuments/",
};

export const fetchContractDetails = async (contractAlias: object|any, userType = ''):Promise<any> => {
  let url = uri.fetchContractDetails + contractAlias;
  if (userType) {
    url += '?userType='+userType
  }
  return await instance.get(url);
};


export const getKybList = async (
  current = 0,
  pageSize = 10,
  status = "all",
  sortBy = null,
  orderBy = null,
  entityType = null
):Promise<any> => {
  return await instance.get(
    uri.getKybList +
      `?page=${current}&limit=${pageSize}&status=${status}&${sortBy}=${orderBy}&entityType=${entityType}`
  );
};

export const getKybVerificationFilter = async (reqBody:object,page:number, limit:number,):Promise<any> => {
  return await instance.post(
    uri.getKybVerificationFilter + `?page=${page}&limit=${limit}`,
    reqBody
  );
};

export const getAllDisputeList = async (
  current = 1,
  pageSize = 10,
  userType = "all",
  sortBy = "",
  orderBy = ""
):Promise<any> => {
  return await instance.get(
    uri.getAllDisputeList +
      `?page=${current}&limit=${pageSize}&status=${userType}&${sortBy}=${orderBy}`
  );
};

export const getAllCallsDetails = async (
  current = 0,
  pageSize = 10,
  callType = "all",
  sortBy = null,
  orderBy = null
):Promise<any> => {
  return await instance.get(
    uri.getCallsDetails +
      `?page=${current}&limit=${pageSize}&status=${callType}&${sortBy}=${orderBy}`
  );
};

export const scheduleDetails = async (reqBody: object):Promise<any> => {
  return await instance.post(uri.scheduleDetails, reqBody);
};
export const scheduledMeeting = async (reqBody: |object|any):Promise<any> => {
  return await instance.post(uri.scheduledMeeting, reqBody);
};

export const clientFeedback = async (reqBody: object):Promise<any> => {
  return await instance.post(uri.clientFeedback, reqBody);
};

export const getEnterpriseList = async (
  current = 0,
  pageSize = 10,
  callType = "all",
  sortBy = "sortByAgreementId",
  orderBy = "DESC"
):Promise<any> => {
  return await instance.get(
    uri.getEnterpriseList +
      `?page=${current}&limit=${pageSize}&status=${callType}&${sortBy}=${orderBy}`
  );
};
export const getEnterpriseCallsDetails = async (reqBody: object):Promise<any> => {
  return await instance.post(uri.getEnterpriseCallsDetails, reqBody);
};
export const sendDocumentContractAPI = async (payload: object|any):Promise<any> => {
  return await instance.post(uri.sendDocumentContract,payload);
};
export const updatetransactionId = async (requestBody: object|any):Promise<any> => {
  return await instance.put(uri.updatetransaction, requestBody);
};
export const emailAfterUploadDoc = async (contractId: object|any, docForEmail: object|any):Promise<any> => {
  return await instance.get(uri.emailAfterUploadDoc + contractId + '/' + docForEmail);
};
export const UpdateFileStatus = async (requestBody: object|any):Promise<any> => {
  return await instance.post(uri.updateImageStatus, requestBody);
};
export const emailAfterRejectDoc = async (idOfContract: object|any, docForEmail: object|any, reason: object|any, userType: object|any):Promise<any> => {
  return await instance.get(uri.emailAfterDocReject + idOfContract + '/' + docForEmail + '/' + reason + '/' + userType);
};
export const emailAfterVerifyDoc = async (idOfContract:object|any, docForEmail:object|any, userType:object|any):Promise<any> => {
  return await instance.get(uri.emailAfterDocVerify + idOfContract + '/' + docForEmail + '/' + userType);
};
export const addFundsByApprover = async(contractId:string|any, amount:string|any, txnAlias: string|any, userAlias: string|any):Promise<any> => {
  return await instance.post(uri.addFundsApprover + contractId +`?buyerAmount=${amount}&txnAlias=${txnAlias}&userAlias=${userAlias}`)
}

export const blockOrUnblockFunds = async(transactionAlias:object|any,action:object|any):Promise<any> => {
  return await instance.post(uri.blockOrUnblockFunds + transactionAlias + `?action=${action}`)
}
export const changeContractStatus = async (contractId:object|any, action:object|any, userAlias:object|any, remarks:object|any,toSign=''):Promise<any> => {
  return await instance.post(`${uri.changeContractStatus}${contractId}?action=${action}&userAlias=${userAlias}`, { rejectReason: remarks={remarks,toSign}});
};

export const acceptContractStatus = async (contractId:object|any, userAlias:object|any, body: any):Promise<any> => {
  return await instance.put(`${uri.acceptContractStatus}${contractId}?userAlias=${userAlias}`, { rejectReason: body});
};

export const rejectContractStatus = async (contractId:object|any, userAlias:object|any, remarks:object|any,toSign=''):Promise<any> => {
  return await instance.put(`${uri.rejectContractStatus}${contractId}?userAlias=${userAlias}`, { rejectReason: remarks={remarks,toSign}});
};

export const addReleaseData = async (requestBody: object|any):Promise<any> => {
  return await instance.post(uri.addRelease, requestBody);
};

export const addReleaseV2Data = async (requestBody: object|any):Promise<any> => {
  return await instance.post(uri.addReleaseV2, requestBody);
};

export const initiatePayment = async (requestBody: object|any):Promise<any> => {
  return await instance.post(uri.initiatePayment, requestBody);
};

export const getAllDisputesList = async ():Promise<any> => {
  return await instance.get(uri.getAllDisputesList)
};

export const addFundsByUser = async(contractId:object|any, amount:object|any, txnAlias: object|any):Promise<any> => {
  return await instance.post(uri.addFundsByUser + contractId +`?buyerAmount=${amount}&txnAlias=${txnAlias}`)
}

export const addFundsUsingNetBanking = async(txnRefNumber: object|any):Promise<any> => {
  return await instance.post(uri.addFundsUsingNetBanking +`?txnRefNumber=${txnRefNumber}`)
}

export const generateContractOtp = async(contractDetail: object|any, userAlias: object|any):Promise<any> => {
  return await instance.post(uri.generateContractOtp, {...contractDetail, userAlias})
}

export const verifyContractOtp = async(contractDetail: object|any):Promise<any> => {
  return await instance.post(uri.verifyContractOtp,contractDetail)
}

export const getContractSoFDetails = async ( aliasName: string, contractType: string) : Promise<any> => {
  return await instance.get(uri.getContractSofDetails + aliasName + '/' + contractType)
}

export const approveSourceOfFundDocument = async(
  body : {
    approvedBy: string,
    comment: string,
    status: string,
    fileId: number,
    contractAlias: string
  }
):Promise<any> => {
  return await instance.post(uri.approveSourceOfFundDocument, body)
}