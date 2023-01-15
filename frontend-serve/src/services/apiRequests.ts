import fetchWrapper from '../utils/fetchWrapper';

const baseURL = `http://localhost:${import.meta.env.VITE_API_PORT || '3001'}`;

// USER REQUESTS
export const userLogin = async (body: object) => {
  return await fetchWrapper.post(`${baseURL}/login`, body);
};

export const userRegister = async (body: object) => {
  return await fetchWrapper.post(`${baseURL}/register`, body);
};

// ACCOUNT REQUESTS
export const accountById = async (id: string, token: string) => {
  return await fetchWrapper.get(`${baseURL}/account/${id}`, token);
};

// TRANSACTION REQUESTS
export const allTransactions = async (token: string) => {
  return await fetchWrapper.get(`${baseURL}/transactions`, token);
};

export const cashInTransactions = async (token: string) => {
  return await fetchWrapper.get(`${baseURL}/transactions/cashin`, token);
};

export const cashOutTransactions = async (token: string) => {
  return await fetchWrapper.get(`${baseURL}/transactions/cashout`, token);
};

export const createTransaction = async (body: object, token: string) => {
  return await fetchWrapper.post(`${baseURL}/transactions/new`, body, token);
};
