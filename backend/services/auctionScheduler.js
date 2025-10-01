const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const EventEmitter = require('./eventEmitter');
const AuctionContext = require('./auctionContext');

// our scheudlar service. this also applied the singleton pattern,
// preventing concurrency problems if there are more than one instances.
class AuctionTimerService extends EventEmitter {
  constructor() {
    super();
    if (AuctionTimerService.instance) {
      return AuctionTimerService.instance;
    }
    
    this._intervalId = null;
    this._isRunning = false;
    this._checkInterval = 60000;
    AuctionTimerService.instance = this;
  }

  static getInstance() {
    if (!AuctionTimerService.instance) {
      AuctionTimerService.instance = new AuctionTimerService();
    }
    return AuctionTimerService.instance;
  }

  async checkEndedAuctions() {
    try {
      const now = new Date();
      const endedAuctions = await Auction.find({
        status: 'active',
        endDate: { $lte: now }
      });
      console.log("check ended auctions", endedAuctions);

      for (const auction of endedAuctions) {
        await this.declareAuctionWinner(auction._id);
      }

      if (endedAuctions.length > 0) {
        console.log(`Processed ${endedAuctions.length} ended auctions`);
      }
    } catch (error) {
      console.error('Error checking ended auctions:', error);
    }
  }

  async declareAuctionWinner(auctionId) {
    try {
      const auction = await Auction.findById(auctionId);
      
      if (!auction) {
        return;
      }

      const auctionContext = new AuctionContext(auction);
      
      try {
        const state = auctionContext.getState();
        if (!state.canEnd(auction)) {
          return;
        }
      } catch (stateError) {
        console.log(`Cannot end auction ${auctionId}: ${stateError.message}`);
        return;
      }

      const highestBid = await Bid.findOne({ auction: auctionId })
        .sort({ amount: -1 })
        .populate('bidder', 'name email');

      const updateData = { 
        status: 'ended',
        endDate: new Date()
      };
      
      if (highestBid) {
        updateData.winner = highestBid.bidder._id;
        updateData.currentPrice = highestBid.amount;
        console.log(`Auction ${auctionId} ended. Winner: ${highestBid.bidder.name} with bid $${highestBid.amount}`);
      } else {
        console.log(`Auction ${auctionId} ended with no bids`);
      }

      auctionContext.validateTransition('ended');
      await Auction.findByIdAndUpdate(auctionId, updateData);
      
      const auctionEndData = {
        auctionId,
        winner: highestBid?.bidder,
        winningAmount: highestBid?.amount,
        hasBids: !!highestBid
      };
      // send the 'auctionEnded' event to observers to execute what they need to do.
      this.emit('auctionEnded', auctionEndData);
      
      return auctionEndData;
      
    } catch (error) {
      console.error(`Error declaring winner for auction ${auctionId}:`, error);
      throw error;
    }
  }

  start() {
    if (this._isRunning) {
      console.log('Auction scheduler is already running');
      return;
    }

    console.log('Auction scheduler started - checking every minute');
    this._intervalId = setInterval(() => {
      this.checkEndedAuctions();
    }, this._checkInterval);
    this._isRunning = true;
  }

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
      this._isRunning = false;
      console.log('Auction scheduler stopped');
    }
  }

  setCheckInterval(interval) {
    if (interval > 0) {
      this._checkInterval = interval;
      if (this._isRunning) {
        this.stop();
        this.start();
      }
    }
  }

  isRunning() {
    return this._isRunning;
  }
}

const startAuctionScheduler = () => {
  const timerService = AuctionTimerService.getInstance();
  timerService.start();
};

const checkEndedAuctions = async () => {
  const timerService = AuctionTimerService.getInstance();
  return await timerService.checkEndedAuctions();
};

const declareAuctionWinner = async (auctionId) => {
  const timerService = AuctionTimerService.getInstance();
  return await timerService.declareAuctionWinner(auctionId);
};

module.exports = {
  AuctionTimerService,
  checkEndedAuctions,
  startAuctionScheduler,
  declareAuctionWinner,
};