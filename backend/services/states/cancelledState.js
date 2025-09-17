const AuctionState = require('./auctionState');

class CancelledState extends AuctionState {
  canPlaceBid() {
    throw new Error('Cannot place bid on cancelled auction');
  }

  canUpdate() {
    throw new Error('Cannot update cancelled auction');
  }

  canDelete() {
    return true;
  }

  canEnd() {
    throw new Error('Cannot end cancelled auction');
  }

  canCancel() {
    throw new Error('Auction is already cancelled');
  }

  getValidTransitions() {
    return [];
  }

  processBid(bidAmount, bidderId) {
    throw new Error('Cannot place bid on cancelled auction');
  }

  processUpdate(updates, userId) {
    throw new Error('Cannot update cancelled auction');
  }

  processDelete(userId) {
    this.validateDelete(userId);
    
    if (!this.canDelete()) {
      throw new Error('Cannot delete auction in current state');
    }

    return {
      isValid: true,
      message: 'Cancelled auction can be deleted'
    };
  }

  getAuctionSummary() {
    return {
      status: 'cancelled',
      cancelledDate: this.ctx.auction.updatedAt,
      totalBids: this.ctx.auction.totalBids,
      reason: 'Auction was cancelled by seller'
    };
  }
}

module.exports = CancelledState;