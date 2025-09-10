const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number, default: function() { return this.startingPrice; }},
  category: { type: String, required: true, enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Art', 'Other']},
  images: [{ type: String }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'ended', 'cancelled'], default: 'active' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalBids: { type: Number, default: 0 }
}, {
  timestamps: true
});

auctionSchema.index({ endDate: 1 });
auctionSchema.index({ category: 1 });
auctionSchema.index({ status: 1 });

module.exports = mongoose.model('Auction', auctionSchema);