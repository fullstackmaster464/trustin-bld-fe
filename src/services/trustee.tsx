import instance from './axios';

const uri = {
    gettransactionlist: '/api/v1/trustee/fetchDashboard',
    getchartData: '/api/v1/trustee/fetchChartData',
    getprofile: '/api/v1/users/',
    getOtherProfiles: '/api/v1/trustee/getOtherprofiles',
    getDashboard: '/api/v1/trustee/getDashboard',
    updateProfile: '/api/v1/trustee/updateprofile',
    changePlatformStatus: '/api/v1/trustee/changePlatformStatus',
    getWeeklyReport:'/api/v1/trustee/approverStats',
    getContractsDetails: '/api/v1/contracts/contractDetails/',
    searchTrusteeTxn: '/api/v1/trustee/search/',
};

export const getDashboard = async (current = 0, pageSize = null,reqBody:object) => {
    return await instance.post(uri.getDashboard+`?page=${current}&limit=${pageSize}`, reqBody);
};

export const sortAllDashboardTxn = async (current = 0, pageSize = 10,sortBy = null, orderBy = null,reqBody:object) => {
    return await instance.post(uri.getDashboard+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody);
};
export const sortallDashboardTxn = async (current = 0, pageSize = 10,sortBy = null, orderBy = null,reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody);
};

export const sortOngoingDashboardTxn = async (current = 0, pageSize = 10,sortBy = null, orderBy = null,reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody);
};

export const sortDisputeDashboardTxn = async (current = 0, pageSize = 10,sortBy = null, orderBy = null,reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody);
};

export const sortApprovedDashboardTxn = async (current = 0, pageSize = 10,sortBy = null, orderBy = null,reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody);
};

export const fetchdashboard = async (current = 1, pageSize = 10,reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}`, reqBody);
};

export const fetchChartData = async (reqBody:object) => {
    return await instance.post(uri.getchartData, reqBody)
};

export const fetchprofileData = async (reqBody:any) => {
    return await instance.get(uri.getprofile + reqBody.email)
};

export const updateProfile = async (reqBody:any) => {
    return await instance.post(uri.updateProfile + reqBody.email)
};

export const updatePlatformStatus = async (reqBody:object) => {
    return await instance.post(uri.changePlatformStatus, reqBody)
};
export const pendingTrusteeTxn = async (current = 0, pageSize = 10,sortBy = "", orderBy = "",reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody)
};
export const DisputeTrusteeTxn = async (current = 0, pageSize = 10,sortBy = "", orderBy = "",reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody)
};

export const allTxn = async (current = 0, pageSize = 10,sortBy = "", orderBy = "",reqBody:object) => {
    return await instance.post(uri.getDashboard+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody)
};

export const approvedTrusteeTxn = async (current = 0, pageSize = 10,sortBy = "", orderBy = "",reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody)
};
export const ongoingTrusteeTxn = async (current = 1, pageSize = 10,sortBy = "", orderBy = "",reqBody:object) => {
    return await instance.post(uri.gettransactionlist+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody)
};
export const fetchWeeklyReport = async (type:string,userAlias:string) => {
    return await instance.get(uri.getWeeklyReport+`/${type}?userId=${userAlias}`)
};

export const getContractsDetails = async (UrlData:any) => {
    return await instance.get(`${uri.getContractsDetails}${UrlData.contractId}`)
  }

  export const searchTrusteeTxn = async (current = 0, pageSize = 10,sortBy = "sortByAgreementId", orderBy = "DESC",reqBody:object) => {
    return await instance.post(uri.searchTrusteeTxn+`?page=${current}&limit=${pageSize}&${sortBy}=${orderBy}`,reqBody)
};
