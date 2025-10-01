const Analytics = require("../../models/Analytics");

class AnalyticsObserver {
  static async handleAuctionEnd(auctionData) {
    const { auctionId, winner, winningAmount, hasBids } = auctionData;
    
    try {
      const analyticsData = new Analytics({
        eventType: 'auction_ended',
        auctionId,
        eventAt: new Date().toISOString(),
        hasBids,
        winningAmount: winningAmount || 0,
        winnerId: winner?._id || null,
        winnerName: winner?.name || null
      });

      const savedAnalytics = await analyticsData.save();
      console.log(`Recording auction for ${auctionId}:`, savedAnalytics);
    } catch (error) {
      console.error('Error in AnalyticsObserver:', error);
    }
  }
}

module.exports = AnalyticsObserver;