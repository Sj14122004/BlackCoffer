import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/data";

export const getData = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getIntensityBySector = async (params = {}) => {
  const response = await axios.get(`${API_URL}/intensity-by-sector`, { params });
  return response.data;
};

export const getLikelihoodByTopic = async (params = {}) => {
  const response = await axios.get(`${API_URL}/likelihood-by-topic`, { params });
  return response.data;
};

export const getRelevanceByCountry = async (params = {}) => {
  const response = await axios.get(`${API_URL}/relevance-by-country`, { params });
  return response.data;
};

export const getIntensityByYear = async (params = {}) => {
  const response = await axios.get(`${API_URL}/intensity-by-year`, { params });
  return response.data;
};

export const getSummary = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/summary`, { params: filters });
  return response.data;
};

export const getCountryAnalysis = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/country-analysis`, { params: filters });
  return response.data;
};

export const getFilterOptions = async () => {
  const response = await axios.get(`${API_URL}/filter-options`);
  return response.data;
};