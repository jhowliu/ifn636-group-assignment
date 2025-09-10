const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

const checkEndedAuctions = async () => {
  try {
    const now = new Date();
    const endedAuctions = await Auction.find({
      status: 'active',
      endDate: { $lte: now }
    });

    for (const auction of endedAuctions) {
      await declareAuctionWinner(auction._id);
    }

    if (endedAuctions.length > 0) {
      console.log(`Processed ${endedAuctions.length} ended auctions`);
    }
  } catch (error) {
    console.error('Error checking ended auctions:', error);
  }
};

const declareAuctionWinner = async (auctionId) => {
  try {
    const auction = await Auction.findById(auctionId);
    
    if (!auction || auction.status !== 'active') {
      return;
    }

    const highestBid = await Bid.findOne({ auction: auctionId })
      .sort({ amount: -1 })
      .populate('bidder', 'name');

    const updateData = { 
      status: 'ended',
      endDate: new Date()
    };
    
    if (highestBid) {
      updateData.winner = highestBid.bidder._id;
      updateData.currentPrice = highestBid.amount;
      console.log(`Auction ${auctionId} ended. Winner: ${highestBid.bidder.name} with bid $${highestBid.amount}`);
    } else {
      console.log(`Auction ${auctionId} ended with no bids`);
    }

    await Auction.findByIdAndUpdate(auctionId, updateData);
    
    return {
      auctionId,
      winner: highestBid?.bidder,
      winningAmount: highestBid?.amount,
      hasBids: !!highestBid
    };
    
  } catch (error) {
    console.error(`Error declaring winner for auction ${auctionId}:`, error);
    throw error;
  }
};

const startAuctionScheduler = () => {
  console.log('Auction scheduler started - checking every minute');
  setInterval(checkEndedAuctions, 60000);
};

module.exports = {
  checkEndedAuctions,
  startAuctionScheduler,
  declareAuctionWinner
};