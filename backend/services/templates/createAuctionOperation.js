const AuctionOperationTemplate = require('./auctionOperationTemplate');
const Auction = require('../../models/Auction');

class CreateAuctionOperation extends AuctionOperationTemplate {
  async loadAuction() {
    // Override: No need to load existing auction for create operation
    return null;
  }

  requiresExistingAuction() {
    // Override: Create operation doesn't require existing auction
    return false;
  }

  async validateState() {
    // Create operation doesn't need state validation
    // Basic validation can be done here if needed
    const { title, description, startingPrice, category, startDate, endDate } = this.req.body;
    
    if (!title || !description || !startingPrice || !category || !startDate || !endDate) {
      throw new Error('Missing required fields');
    }

    if (startingPrice < 0) {
      throw new Error('Starting price must be non-negative');
    }

    if (new Date(endDate) <= new Date(startDate)) {
      throw new Error('End date must be after start date');
    }
  }

  // Main business logic here
  async performOperation() {
    const { title, description, startingPrice, category, startDate, endDate, images } = this.req.body;
    
    const newAuction = new Auction({
      title,
      description,
      startingPrice,
      category,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      images: images || [],
      seller: this.req.user.id
    });

    const savedAuction = await newAuction.save();
    const populatedAuction = await Auction.findById(savedAuction._id)
      .populate('seller', 'name email');
    
    return {
      data: populatedAuction,
      message: 'Auction created successfully'
    };
  }

  sendSuccessResponse(result) {
    return this.res.status(201).json({
      success: true,
      data: result.data,
      message: result.message
    });
  }

  logOperation(result) {
    console.log(`New auction created: ${result.data._id} by user ${this.req.user.id}`);
  }
}

module.exports = CreateAuctionOperation;