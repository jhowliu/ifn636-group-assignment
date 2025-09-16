const Auction = require('../../models/Auction');
const AuctionContext = require('../auctionContext');

class AuctionOperationTemplate {
  constructor() {
    if (new.target === AuctionOperationTemplate) {
      throw new Error('AuctionOperationTemplate is abstract and cannot be instantiated directly');
    }
    this.req = null;
    this.res = null;
    this.auction = null;
    this.auctionContext = null;
  }

  async execute(req, res) {
    try {
      this.req = req;
      this.res = res;
      
      this.auction = await this.loadAuction();
      
      if (!this.auction && this.requiresExistingAuction()) {
        return this.handleNotFound();
      }

      if (this.auction) {
        this.auctionContext = new AuctionContext(this.auction);
      }
      
      this.validatePermissions();
      
      await this.validateState();
      
      const result = await this.performOperation();
      
      this.logOperation(result);
      
      return this.sendSuccessResponse(result);
      
    } catch (error) {
      return this.handleError(error);
    }
  }

  async loadAuction() {
    if (!this.req.params.id) {
      return null;
    }
    
    return await Auction.findById(this.req.params.id)
      .populate('seller', 'name email')
      .populate('winner', 'name');
  }

  requiresExistingAuction() {
    // Default: operations require existing auction
    // CreateOperation should override this to return false
    return true;
  }

  validatePermissions() {
    // Default: no permission validation
    // Subclasses can override this
  }

  async validateState() {
    // Default: no state validation
    // Subclasses must implement specific validation
    throw new Error('validateState method must be implemented by subclasses');
  }

  async performOperation() {
    // Abstract method - must be implemented by subclasses
    throw new Error('performOperation method must be implemented by subclasses');
  }

  handleNotFound() {
    return this.res.status(404).json({
      success: false,
      error: 'Auction not found'
    });
  }

  handleError(error) {
    const statusCode = this.getErrorStatusCode(error);
    return this.res.status(statusCode).json({
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

  sendSuccessResponse(result) {
    return this.res.json({
      success: true,
      data: result.data,
      message: result.message || 'Operation completed successfully'
    });
  }

  logOperation(result) {
    const operationName = this.constructor.name.replace('Operation', '');
    console.log(`${operationName} operation performed by user ${this.req.user?.id}`);
  }

  getOperationName() {
    return this.constructor.name.replace('Operation', '').toLowerCase();
  }
}

module.exports = AuctionOperationTemplate;