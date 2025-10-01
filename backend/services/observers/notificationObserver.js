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
        notificationContext.setStrategy('email');
        await notificationContext.sendWinnerNotification(winner, auctionData);
        
        // Send winner notification via SMS if phone number is available
        if (winner.phone) {
          notificationContext.setStrategy('sms');
          await notificationContext.sendWinnerNotification(winner, auctionData);
        }
      }
    } catch (error) {
      console.error('Error in NotificationObserver:', error);
    }
  }
}

module.exports = NotificationObserver;