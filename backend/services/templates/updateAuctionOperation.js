const AuctionOperationTemplate = require('./auctionOperationTemplate');
const Auction = require('../../models/Auction');

class UpdateAuctionOperation extends AuctionOperationTemplate {
  validatePermissions(auction, req) {
    if (auction.seller.toString() !== req.user.id) {
      throw new Error('Not authorized to update this auction');
    }
  }

  async validateState(auctionContext, req) {
    return auctionContext.validateUpdate(req.body, req.user.id);
  }

  async performOperation(auction, auctionContext, req) {
    const allowedUpdates = ['title', 'startingPrice', 'currentPrice', 'description', 'images', 'endDate'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
        if (field === 'startingPrice') {
          updates['currentPrice'] = req.body[field];
        }
      }
    });

    const updatedAuction = await Auction.findByIdAndUpdate(
      auction._id,
      updates,
      { new: true, runValidators: true }
    ).populate('seller', 'name email');

    return {
      data: updatedAuction,
      message: 'Auction updated successfully'
    };
  }

  logOperation(auction, req, result) {
    const updatedFields = Object.keys(req.body).join(', ');
    console.log(`Auction ${auction._id} updated by user ${req.user.id}. Fields: ${updatedFields}`);
  }
}

module.exports = UpdateAuctionOperation;