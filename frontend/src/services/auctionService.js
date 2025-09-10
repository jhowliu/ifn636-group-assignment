import axiosInstance from '../axiosConfig';

const USER_API_BASE = '/api/users/auctions';
const API_BASE = '/api/auctions';

const getToken = () => {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = JSON.parse(raw);
  return user?.token
};

const auctionService = {
  // Auction CRUD operations
  createAuction: async (auctionData) => {
    const response = await axiosInstance.post(USER_API_BASE, auctionData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  getUserAuctions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`${USER_API_BASE}?${queryString}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  getAuctions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`${API_BASE}?${queryString}`);
    return response.data;
  },

  getAuctionById: async (id) => {
    const response = await axiosInstance.get(`${API_BASE}/${id}`);
    return response.data;
  },

  updateAuction: async (id, updateData) => {
    const response = await axiosInstance.put(`${USER_API_BASE}/${id}`, updateData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  deleteAuction: async (id) => {
    const response = await axiosInstance.delete(`${USER_API_BASE}/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },
};

export default auctionService;