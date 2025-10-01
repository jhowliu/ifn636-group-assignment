const CreateAuctionOperation = require('../services/templates/createAuctionOperation');
const UpdateAuctionOperation = require('../services/templates/updateAuctionOperation');
const DeleteAuctionOperation = require('../services/templates/deleteAuctionOperation');
const Auction = require('../models/Auction');

const createOperation = new CreateAuctionOperation();
const updateOperation = new UpdateAuctionOperation();
const deleteOperation = new DeleteAuctionOperation();

// POST auctions
// create auction items
const createAuction = async (req, res) => {
  return await createOperation.execute(req, res);
};

// users/aunctions
// listing all aunction items that user created
const getUserAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({seller: req.user.id}).populate('seller', 'name').sort({ ['createdAt']: -1 })
    res.json({
        success: true,
        data: auctions,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } 
}

const updateAuction = async (req, res) => {
  return await updateOperation.execute(req, res);
};

const deleteAuction = async (req, res) => {
  return await deleteOperation.execute(req, res);
};

module.exports = {
  createAuction,
  getUserAuctions,
  updateAuction,
  deleteAuction
};