const express = require('express');
const router = express.Router();
const { getAuctions, getAuctionById } = require('../controllers/auctionController');

router.get('/', getAuctions);
router.get('/:id', getAuctionById)

module.exports = router;