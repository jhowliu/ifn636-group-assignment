const AuctionState = require('./auctionState');

class ActiveState extends AuctionState {
  canPlaceBid(bid) {
    if (this.isDateExpired()) {
      throw new Error('Auction has ended');
    }
    return true;
  }

  canUpdate() {
    if (this.ctx.auction.totalBids > 0) {
      throw new Error('Cannot update auction with existing bids');
    }
    return true;
  }

  canDelete() {
    if (this.ctx.auction.totalBids > 0) {
      throw new Error('Cannot delete auction with existing bids');
    }
    return true;
  }

  canEnd() {
    return true;
  }

  canCancel() {
    if (this.ctx.auction.totalBids > 0) {
      throw new Error('Cannot cancel auction with existing bids');
    }
    return true;
  }

  getValidTransitions() {
    return ['ended', 'cancelled'];
  }

  processBid(bidAmount, bidderId) {
    this.validateBid(bidAmount, bidderId);
    
    if (!this.canPlaceBid()) {
      throw new Error('Cannot place bid in current auction state');
    }

    return {
      isValid: true,
      message: 'Bid can be placed'
    };
  }

  processUpdate(updates, userId) {
    this.validateUpdate(userId);
    
    if (!this.canUpdate()) {
      throw new Error('Cannot update auction in current state');
    }

    return {
      isValid: true,
      message: 'Auction can be updated'
    };
  }

  processDelete(userId) {
    this.validateDelete(userId);
    
    if (!this.canDelete()) {
      throw new Error('Cannot delete auction in current state');
    }

    return {
      isValid: true,
      message: 'Auction can be deleted'
    };
  }
}

module.exports = ActiveState;