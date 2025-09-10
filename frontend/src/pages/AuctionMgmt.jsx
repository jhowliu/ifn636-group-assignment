import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import auctionService from '../services/auctionService';
import AuctionMgmtItem from '../components/AuctionMgmtItem';

const AuctionMgmt = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, auction: null });

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchUserAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await auctionService.getUserAuctions();
        if (response.success) {
          setAuctions(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAuctions();
  }, [user, navigate, authLoading]);

  const handleDelete = async (auctionId) => {
    try {
      const response = await auctionService.deleteAuction(auctionId);
      if (response.success) {
        setAuctions(auctions.filter(auction => auction._id !== auctionId));
        setDeleteModal({ show: false, auction: null });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete auction');
    }
  };

  const openDeleteModal = (auction) => {
    setDeleteModal({ show: true, auction });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, auction: null });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="gray-50 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Auctions</h1>
            <Link
              to="/auctions/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Auction
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {auctions.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first auction</p>
              <Link
                to="/auctions/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Auction
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {auctions.map((auction) => (
                <AuctionMgmtItem 
                  key={auction._id} 
                  auction={auction} 
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.auction?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.auction._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionMgmt;