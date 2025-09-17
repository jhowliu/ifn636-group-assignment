const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authChain');
const { auctionValidationChain } = require('../middleware/auctionValidationChain');
const {
  createAuction,
  updateAuction,
  getUserAuctions,
  deleteAuction,
} = require('../controllers/userAuctionController')

router.get('/', requireAuth, getUserAuctions);
router.post('/', auctionValidationChain, createAuction);
router.put('/:id', requireAuth, updateAuction);
router.delete('/:id', requireAuth, deleteAuction);

module.exports = router;