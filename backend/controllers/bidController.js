const BidOperation = require('../services/templates/BidOperation');
const Bid = require('../models/Bid');

const bidOperation = new BidOperation();

const placeBid = async (req, res) => {
  return await bidOperation.execute(req, res);
};

const getBidsForAuction = async (req, res) => {
  try {
    const auctionId = req.params.id;

    const bids = await Bid.find({ auction: auctionId })
      .populate('bidder', 'name')
      .sort({ bidTime: -1 })

    const total = await Bid.countDocuments({ auction: auctionId });

    res.json({
      success: true,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  placeBid,
  getBidsForAuction,
};