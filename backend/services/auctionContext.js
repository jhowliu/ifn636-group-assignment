const ActiveState = require('./states/ActiveState');
const EndedState = require('./states/EndedState');

class AuctionContext {
  constructor(auction) {
    this.auction = auction;
    this.states = {
      active: new ActiveState(this),
      ended: new EndedState(this),
    };
  }

  getState() {
    const state = this.states[this.auction.status];
    if (!state) {
      throw new Error(`Invalid auction status: ${this.auction.status}`);
    }
    return state;
  }

  validateBid(bidAmount, bidderId) {
    const state = this.getState();
    return state.processBid(bidAmount, bidderId);
  }

  validateUpdate(updates, userId) {
    const state = this.getState();
    return state.processUpdate(updates, userId);
  }

  validateDelete(userId) {
    const state = this.getState();
    return state.processDelete(userId);
  }

  canTransitionTo(newStatus) {
    const currentState = this.getState();
    const validTransitions = currentState.getValidTransitions();
    return validTransitions.includes(newStatus);
  }

  validateTransition(newStatus) {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Invalid state transition from ${this.auction.status} to ${newStatus}`);
    }
    return true;
  }

  getAuctionSummary() {
    const state = this.getState();
    if (typeof state.getAuctionSummary === 'function') {
      return state.getAuctionSummary();
    }
    
    return {
      status: this.auction.status,
      currentPrice: this.auction.currentPrice,
      totalBids: this.auction.totalBids
    };
  }

  getAvailableActions() {
    const state = this.getState();
    const actions = [];

    try {
      if (state.canPlaceBid()) actions.push('bid');
    } catch (e) {}

    try {
      if (state.canUpdate()) actions.push('update');
    } catch (e) {}

    try {
      if (state.canDelete()) actions.push('delete');
    } catch (e) {}

    try {
      if (state.canEnd()) actions.push('end');
    } catch (e) {}

    try {
      if (state.canCancel()) actions.push('cancel');
    } catch (e) {}

    return actions;
  }
}

module.exports = AuctionContext;