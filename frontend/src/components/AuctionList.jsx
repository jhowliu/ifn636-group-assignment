import AuctionCard from './AuctionCard';

const AuctionList = ({ auctions }) => {

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {auctions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">No auctions found</div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {auctions.map((auction) => (
              <AuctionCard
                key={auction._id}
                auction={auction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionList;