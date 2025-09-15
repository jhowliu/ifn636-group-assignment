const AuctionOperationTemplate = require('./auctionOperationTemplate');
const mongoose = require('mongoose');
const Bid = require('../../models/Bid');
const Auction = require('../../models/Auction');

class BidOperation extends AuctionOperationTemplate {
  async validateState(auctionContext, req) {
    const { amount } = req.body;
    const bidderId = req.user.id;
    
    return auctionContext.validateBid(amount, bidderId);
  }

  async performOperation(auction, auctionContext, req) {
    const { amount } = req.body;
    const bidderId = req.user.id;
    const auctionId = auction._id;

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

      return {
        data: populatedBid,
        message: 'Bid placed successfully'
      };

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  handleError(res, error) {
    if (error.message === 'Auction has ended') {
      // Update auction status if needed
      const auctionId = res.req.params.id;
      if (auctionId) {
        Auction.findByIdAndUpdate(auctionId, { status: 'ended' }).catch(console.error);
      }
    }
    return super.handleError(res, error);
  }

  logOperation(auction, req, result) {
    console.log(`Bid of $${req.body.amount} placed on auction ${auction._id} by user ${req.user.id}`);
    console.log(JSON.stringify(result));
  }
}

module.exports = BidOperation;