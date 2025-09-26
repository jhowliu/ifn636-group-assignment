const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authChain');
const { placeBid, getBidsForAuction } = require('../controllers/bidController');

router.post('/:id/bids', requireAuth, placeBid);
router.get('/:id/bids', getBidsForAuction);

module.exports = router;