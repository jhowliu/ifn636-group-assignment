const AuctionOperationTemplate = require('./auctionOperationTemplate');
const Auction = require('../../models/Auction');

class CreateAuctionOperation extends AuctionOperationTemplate {
  async loadAuction(req) {
    // Override: No need to load existing auction for create operation
    return null;
  }

  requiresExistingAuction() {
    // Override: Create operation doesn't require existing auction
    return false;
  }

  async validateState(auctionContext, req) {
    // Create operation doesn't need state validation
    // Basic validation can be done here if needed
    const { title, description, startingPrice, category, startDate, endDate } = req.body;
    
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

  async performOperation(auction, auctionContext, req) {
    const { title, description, startingPrice, category, startDate, endDate, images } = req.body;
    
    const newAuction = new Auction({
      title,
      description,
      startingPrice,
      category,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      images: images || [],
      seller: req.user.id
    });

    const savedAuction = await newAuction.save();
    const populatedAuction = await Auction.findById(savedAuction._id)
      .populate('seller', 'name email');
    
    return {
      data: populatedAuction,
      message: 'Auction created successfully'
    };
  }

  sendSuccessResponse(res, result) {
    return res.status(201).json({
      success: true,
      data: result.data,
      message: result.message
    });
  }

  logOperation(auction, req, result) {
    console.log(`New auction created: ${result.data._id} by user ${req.user.id}`);
  }
}

module.exports = CreateAuctionOperation;