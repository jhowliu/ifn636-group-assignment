import { Link } from 'react-router-dom';

const AuctionMgmtItem = ({ auction, onDelete }) => {
  const canEditAuction = (auction) => {
    return auction.totalBids === 0;
  };

  const canDeleteAuction = (auction) => {
    return auction.totalBids === 0;
  };

  const getAuctionStatus = (auction) => {
    if (!auction || !auction.startDate || !auction.endDate) return 'Unknown';
    
    const now = new Date();
    const startDate = new Date(auction.startDate);
    const endDate = new Date(auction.endDate);
    
    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Ended';
    return 'Active';
  };

  const canEdit = canEditAuction(auction);
  const canDelete = canDeleteAuction(auction);
  const status = getAuctionStatus(auction);

  return (
    <div key={auction._id} className='bg-gray-50'>
      {/* Auction display */}
      <div className="bg-white rounded-lg shadow-lg p-8 relative">
        {/* Action buttons - positioned at top right */}
        <div className="absolute top-6 right-6 flex gap-2">
          {canEdit && (
            <Link
              to={`/auctions/${auction._id}/edit`}
              className="w-8 h-8 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit auction"
            >
              <i className="fas fa-edit"></i>
            </Link>
          )}
          
          {canDelete && (
            <button
              onClick={() => onDelete(auction)}
              className="w-8 h-8 flex items-center text-gray-400 hover:text-red-600 transition-colors"
              title="Delete auction"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          
          {!canEdit && !canDelete && (
            <div className="w-8 h-8 flex items-center justify-center text-gray-300" title="Cannot edit (has bids)">
              <i className="fas fa-lock"></i>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image gallery */}
          <div className="">
            {auction.images && auction.images.length > 0 ? (
              <img
                alt={auction.title}
                src={auction.images[0]}
                className="w-full h-auto object-contain rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          {/* Auction info */}
          <div className="space-y-6 pr-20">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-4xl font-thin text-gray-800">{auction.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === 'Active' ? 'bg-green-100 text-green-800' :
                  status === 'Ended' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 font-thin break-words">{auction.description || 'No description available'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-light text-gray-800">Starting Price</h4>
                  <p className="text-lg font-thin text-green-600">${auction.startingPrice}</p>
                </div>
                <div>
                  <h4 className="font-light text-gray-800">Current Bids</h4>
                  <p className="text-lg font-thin text-blue-600">{auction.totalBids || 0}</p>
                </div>
              </div>

              <div>
                <div className="text-sm font-light text-gray-500">
                  <strong>Start:</strong> {new Date(auction.startDate).toLocaleString()}
                </div>
                <div className="text-sm font-light text-gray-500">
                  <strong>End:</strong> {new Date(auction.endDate).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionMgmtItem;