const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { placeBid, getBidsForAuction } = require('../controllers/bidController');

router.post('/:id/bids', protect, placeBid);
router.get('/:id/bids', getBidsForAuction);

module.exports = router;