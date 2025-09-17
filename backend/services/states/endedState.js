const AuctionState = require('./auctionState');

class EndedState extends AuctionState {
  canPlaceBid() {
    throw new Error('Cannot place bid on ended auction');
  }

  canUpdate() {
    throw new Error('Cannot update ended auction');
  }

  canDelete() {
    throw new Error('Cannot delete ended auction');
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
    throw new Error('Cannot update ended auction');
  }

  processDelete(userId) {
    throw new Error('Cannot delete ended auction');
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