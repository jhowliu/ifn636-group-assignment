const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  auctionId: { type: mongoose.Schema.Types.ObjectId, Ref: 'Auction', required: true },
  eventAt: { type: Date, required: true },
  hasBids: { type: Boolean, default: false},
  winningAmount: { type: Number, required: true, min: 0 },
  winnerId: { type: mongoose.Schema.Types.ObjectId, Ref: 'User' },
  winnerName: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);