const NotificationContext = require('../notificationContext');

class NotificationObserver {
  static async handleAuctionEnd(auctionData) {
    const { auctionId, winner, winningAmount, hasBids } = auctionData;
    const notificationContext = new NotificationContext();
    
    try {
      if (hasBids && winner) {
        console.log(`Sending winner notification to ${winner.name} for auction ${auctionId}`);
        console.log(`Winning amount: $${winningAmount}`);
        
        // Send winner notification via email
        await notificationContext.sendWinnerNotification(winner, auctionData, 'email');
        
        // Send winner notification via SMS if phone number is available
        if (winner.phone) {
          await notificationContext.sendWinnerNotification(winner, auctionData, 'sms');
        }
      }
    } catch (error) {
      console.error('Error in NotificationObserver:', error);
    }
  }
}

module.exports = NotificationObserver;