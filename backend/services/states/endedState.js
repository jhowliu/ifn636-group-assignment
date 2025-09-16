const AuctionState = require('./auctionState');

class EndedState extends AuctionState {
  canPlaceBid() {
    throw new Error('Cannot place bid on ended auction');
  }

  canUpdate() {
    if (this.ctx.auction.totalBids === 0 && !this.ctx.auction.winner) {
      return true
    }
    throw new Error('Cannot update ended auction');
  }

  canDelete() {
    if (this.ctx.auction.totalBids === 0 && !this.ctx.auction.winner) {
      return true;
    }
    throw new Error('Cannot delete ended auction with bids or winner');
  }

  canEnd() {
    throw new Error('Auction is already ended');
  }

  canCancel() {
    throw new Error('Cannot cancel ended auction');
  }

  getValidTransitions() {
    return [];
  }

  processBid(bidAmount, bidderId) {
    throw new Error('Cannot place bid on ended auction');
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

  getAuctionSummary() {
    return {
      status: 'ended',
      endDate: this.ctx.auction.endDate,
      finalPrice: this.ctx.auction.currentPrice,
      totalBids: this.ctx.auction.totalBids,
      hasWinner: !!this.ctx.auction.winner,
      winner: this.ctx.auction.winner
    };
  }
}

module.exports = EndedState;