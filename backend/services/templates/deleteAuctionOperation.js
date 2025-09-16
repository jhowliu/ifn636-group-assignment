const AuctionOperationTemplate = require('./auctionOperationTemplate');
const Auction = require('../../models/Auction');

class DeleteAuctionOperation extends AuctionOperationTemplate {
  validatePermissions(auction, req) {
    console.log(auction.seller.id, req.user.id, auction.seller)
    if (auction.seller.id !== req.user.id) {
      throw new Error('Not authorized to delete this auction');
    }
  }

  async validateState(auctionContext, req) {
    return auctionContext.validateDelete(req.user.id);
  }

  async performOperation(auction, auctionContext, req) {
    await Auction.findByIdAndDelete(auction._id);

    return {
      data: null,
      message: 'Auction deleted successfully'
    };
  }

  logOperation(auction, req, result) {
    console.log(`Auction ${auction._id} deleted by user ${req.user.id}`);
  }
}

module.exports = DeleteAuctionOperation;