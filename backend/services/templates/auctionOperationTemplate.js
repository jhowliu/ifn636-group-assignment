const Auction = require('../../models/Auction');
const AuctionContext = require('../auctionContext');

class AuctionOperationTemplate {
  constructor() {
    if (new.target === AuctionOperationTemplate) {
      throw new Error('AuctionOperationTemplate is abstract and cannot be instantiated directly');
    }
  }

  async execute(req, res) {
    try {
      const auction = await this.loadAuction(req);
      
      if (!auction && this.requiresExistingAuction()) {
        return this.handleNotFound(res);
      }

      let auctionContext = null;
      if (auction) {
        auctionContext = new AuctionContext(auction);
      }
      
      this.validatePermissions(auction, req);
      
      await this.validateState(auctionContext, req);
      
      const result = await this.performOperation(auction, auctionContext, req);
      
      this.logOperation(auction, req, result);
      
      return this.sendSuccessResponse(res, result);
      
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async loadAuction(req) {
    if (!req.params.id) {
      return null;
    }
    
    return await Auction.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('winner', 'name');
  }

  requiresExistingAuction() {
    // Default: operations require existing auction
    // CreateOperation should override this to return false
    return true;
  }

  validatePermissions(auction, req) {
    // Default: no permission validation
    // Subclasses can override this
  }

  async validateState(auctionContext, req) {
    // Default: no state validation
    // Subclasses must implement specific validation
    throw new Error('validateState method must be implemented by subclasses');
  }

  async performOperation(auction, auctionContext, req) {
    // Abstract method - must be implemented by subclasses
    throw new Error('performOperation method must be implemented by subclasses');
  }

  handleNotFound(res) {
    return res.status(404).json({
      success: false,
      error: 'Auction not found'
    });
  }

  handleError(res, error) {
    const statusCode = this.getErrorStatusCode(error);
    return res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }

  getErrorStatusCode(error) {
    if (error.message.includes('Not authorized')) {
      return 403;
    }
    if (error.message.includes('not found')) {
      return 404;
    }
    if (error.message.includes('Cannot') || error.message.includes('Invalid')) {
      return 400;
    }
    return 500;
  }

  sendSuccessResponse(res, result) {
    return res.json({
      success: true,
      data: result.data,
      message: result.message || 'Operation completed successfully'
    });
  }

  getOperationName() {
    return this.constructor.name.replace('Operation', '').toLowerCase();
  }
}

module.exports = AuctionOperationTemplate;