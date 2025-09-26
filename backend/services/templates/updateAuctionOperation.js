const AuctionOperationTemplate = require('./auctionOperationTemplate');
const Auction = require('../../models/Auction');

class UpdateAuctionOperation extends AuctionOperationTemplate {
  validatePermissions() {
    if (this.auction.seller.toString() !== this.req.user.id) {
      throw new Error('Not authorized to update this auction');
    }
  }

  async validateState() {
    return this.auctionContext.validateUpdate(this.req.body, this.req.user.id);
  }

  async performOperation() {
    const allowedUpdates = ['title', 'startingPrice', 'currentPrice', 'description', 'images', 'endDate'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (this.req.body[field] !== undefined) {
        updates[field] = this.req.body[field];
        if (field === 'startingPrice') {
          updates['currentPrice'] = this.req.body[field];
        }
      }
    });

    const updatedAuction = await Auction.findByIdAndUpdate(
      this.auction._id,
      updates,
      { new: true, runValidators: true }
    ).populate('seller', 'name email');

    return {
      data: updatedAuction,
      message: 'Auction updated successfully'
    };
  }

  logOperation(result) {
    const updatedFields = Object.keys(this.req.body).join(', ');
    console.log(`Auction ${this.auction._id} updated by user ${this.req.user.id}. Fields: ${updatedFields}`);
  }
}

module.exports = UpdateAuctionOperation;