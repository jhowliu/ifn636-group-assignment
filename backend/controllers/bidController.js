const mongoose = require('mongoose');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const auctionId = req.params.id;
    const bidderId = req.user.id;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({
        success: false,
        error: 'Auction not found'
      });
    }

    if (auction.seller.toString() === bidderId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot bid on your own auction'
      });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Auction is not active'
      });
    }

    if (new Date() > auction.endDate) {
      await Auction.findByIdAndUpdate(auctionId, { status: 'ended' });
      return res.status(400).json({
        success: false,
        error: 'Auction has ended'
      });
    }

    if (amount <= auction.currentPrice) {
      return res.status(400).json({
        success: false,
        error: `Bid must be higher than current price of $${auction.currentPrice}`
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newBid = new Bid({
        auction: auctionId,
        bidder: bidderId,
        amount
      });

      await newBid.save({ session });

      await Auction.findByIdAndUpdate(
        auctionId,
        {
          currentPrice: amount,
          $inc: { totalBids: 1 }
        },
        { session }
      );

      await session.commitTransaction();

      const populatedBid = await Bid.findById(newBid._id)
        .populate('bidder', 'name')
        .populate('auction', 'title');

      res.status(201).json({
        success: true,
        data: populatedBid,
        message: 'Bid placed successfully'
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
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