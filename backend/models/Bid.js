const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  bidTime: { type: Date, default: Date.now }
}, {
  timestamps: true
});

bidSchema.index({ auction: 1, bidTime: -1 });
bidSchema.index({ bidder: 1 });

module.exports = mongoose.model('Bid', bidSchema);