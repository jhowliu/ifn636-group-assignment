import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuctionList from '../components/AuctionList';
import auctionService from '../services/auctionService';

const Tasks = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await auctionService.getAuctions() 
        setAuctions(response.data);
      } catch (error) {
        alert('Failed to fetch auctions.');
      }
    };

    fetchAuctions();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      {!user && (
        <div className="bg-blue-50 border-t">
          <div className="max-w-xl mx-auto px-6 py-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Ready to start bidding?
              </h2>
              <p className="text-blue-700 mb-4">
                Join our community to place bids and create your own auctions
              </p>
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 "
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 "
                >
                  Register 
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Auctions</h1>
              <p className="text-gray-600 mt-1">
                Discover amazing items and place your bids
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuctionList
        auctions={auctions}
      />
      {/* Call to Action for Non-logged in users */}
    </div>
  );
};

export default Tasks;
