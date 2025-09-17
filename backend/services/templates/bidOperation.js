const AuctionOperationTemplate = require('./auctionOperationTemplate');
const mongoose = require('mongoose');
const Bid = require('../../models/Bid');
const Auction = require('../../models/Auction');

class BidOperation extends AuctionOperationTemplate {
  async validateState() {
    const { amount } = this.req.body;
    const bidderId = this.req.user.id;
    
    return this.auctionContext.validateBid(amount, bidderId);
  }

  async performOperation() {
    const { amount } = this.req.body;
    const bidderId = this.req.user.id;
    const auctionId = this.auction._id;

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

  handleError(error) {
    if (error.message === 'Auction has ended') {
      // Update auction status if needed
      const auctionId = this.req.params.id;
      if (auctionId) {
        Auction.findByIdAndUpdate(auctionId, { status: 'ended' }).catch(console.error);
      }
    }
    return super.handleError(error);
  }

  logOperation(result) {
    console.log(`Bid of $${this.req.body.amount} placed on auction ${this.auction._id} by user ${this.req.user.id}`);
  }
}

module.exports = BidOperation;