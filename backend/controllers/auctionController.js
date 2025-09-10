const Auction = require('../models/Auction');

const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({})
      .populate('seller', 'name')
      .populate('winner', 'name')
      .sort({ ['endDate']: -1 })

    res.json({
      success: true,
      data: auctions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// auctions/:id
// auction item details 
const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('winner', 'name');

    if (!auction) {
      return res.status(404).json({
        success: false,
        error: 'Auction not found'
      });
    }

    res.json({
      success: true,
      data: auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


module.exports = {
  getAuctions,
  getAuctionById,
};