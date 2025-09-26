class AuctionState {
  constructor(auctionCtx) {
    this.ctx = auctionCtx
    if (new.target === AuctionState) {
      throw new Error('AuctionState is abstract and cannot be instantiated directly');
    }
  }

  canPlaceBid(bid) {
    throw new Error('canPlaceBid method must be implemented by subclasses');
  }

  canUpdate() {
    throw new Error('canUpdate method must be implemented by subclasses');
  }

  canDelete() {
    throw new Error('canDelete method must be implemented by subclasses');
  }

  canEnd() {
    throw new Error('canEnd method must be implemented by subclasses');
  }

  canCancel() {
    throw new Error('canCancel method must be implemented by subclasses');
  }

  getValidTransitions() {
    throw new Error('getValidTransitions method must be implemented by subclasses');
  }

  validateBid(bidAmount, bidderId) {
    if (!this.ctx.auction) {
      throw new Error('Auction not found');
    }

    if (this.ctx.auction.seller.id === bidderId) {
      throw new Error('Cannot bid on your own auction');
    }

    if (bidAmount <= this.ctx.auction.currentPrice) {
      throw new Error(`Bid must be higher than current price of $${this.ctx.auction.currentPrice}`);
    }
  }

  validateUpdate(userId) {
    if (!this.ctx.auction) {
      throw new Error('Auction not found');
    }

    if (this.ctx.auction.seller.id !== userId) {
      throw new Error('Not authorized to update this auction');
    }
  }

  validateDelete(userId) {
    if (!this.ctx.auction) {
      throw new Error('Auction not found');
    }

    if (this.ctx.auction.seller.id !== userId) {
      throw new Error('Not authorized to delete this auction');
    }
  }

  isDateExpired() {
    return new Date() > this.ctx.auction.endDate;
  }
}

module.exports = AuctionState;