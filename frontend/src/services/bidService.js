import axiosInstance from '../axiosConfig';

const getToken = () => {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = JSON.parse(raw);
  return user?.token;
};

const bidService = {
  placeBid: async (auctionId, amount) => {
    const response = await axiosInstance.post(`/api/auctions/${auctionId}/bids`, 
      { amount }, 
      {
        headers: { Authorization: `Bearer ${getToken()}` }
      }
    );
    return response.data;
  },

  getBidsForAuction: async (auctionId) => {
    const response = await axiosInstance.get(`/api/auctions/${auctionId}/bids`);
    return response.data;
  }
};

export default bidService;