const AuctionOperationTemplate = require('./auctionOperationTemplate');
const Auction = require('../../models/Auction');

class DeleteAuctionOperation extends AuctionOperationTemplate {
  validatePermissions() {
    if (this.auction.seller.id !== this.req.user.id) {
      throw new Error('Not authorized to delete this auction');
    }
  }

  async validateState() {
    return this.auctionContext.validateDelete(this.req.user.id);
  }

  // Main business logic here
  async performOperation() {
    await Auction.findByIdAndDelete(this.auction._id);

    return {
      data: null,
      message: 'Auction deleted successfully'
    };
  }

  logOperation(result) {
    console.log(`Auction ${this.auction._id} deleted by user ${this.req.user.id}`);
  }
}

module.exports = DeleteAuctionOperation;