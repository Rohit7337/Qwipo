import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// customers
export const getCustomers = (params={}) => api.get("/customers", { params });
export const getCustomer  = (id) => api.get(`/customers/${id}`);
export const createCustomer = (payload) => api.post("/customers", payload);
export const updateCustomer = (id, payload) => api.put(`/customers/${id}`, payload);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// addresses
export const getAddresses = (customerId) => api.get(`/customers/${customerId}/addresses`);
export const addAddress   = (customerId, payload) => api.post(`/customers/${customerId}/addresses`, payload);
export const updateAddress = (addressId, payload) => api.put(`/addresses/${addressId}`, payload);
export const deleteAddress = (addressId) => api.delete(`/addresses/${addressId}`);
