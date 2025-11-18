import axios from 'axios';
import { getLocalStorage } from '../components/Common/Constants';

const BASE_URL = process.env.REACT_APP_SERVER_URL;
const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 100000,
    maxContentLength: 1000,
    maxRedirects: 2,

})

instance.interceptors.request.use((req:any) => {
    return req;
});

instance.interceptors.request.use((config:any) => {
    const token = JSON.parse(getLocalStorage('auth')!)?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return Promise.resolve(config);
}, function (error:any) {
    handleLogError(error); 
    return Promise.reject(error);
}
);

instance.interceptors.response.use((response:any) => {
    return response;
}, function (error:any) { 
    handleLogError(error); 

    return Promise.reject(error.response);
});
const handleLogError = (error:any) => {
    if (error.response) { 
        if (error.response.data?.code === "TOKEN_EXPIRED") {
            localStorage.clear();
            window.location.href = '/session-expired';
            // window.location.href = '/session';
        }
    }
}

export function getNormalizedQueryString<T extends Record<string, unknown>>(query: T): string {
    const normalizedParams = new URLSearchParams();

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  return normalizedParams.toString();
}

export default instance;
