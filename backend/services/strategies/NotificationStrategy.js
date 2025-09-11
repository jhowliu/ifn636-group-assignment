class NotificationStrategy {
  async sendWinnerNotification(recipient, auctionData) {
    throw new Error('sendWinnerNotification method must be implemented by subclasses');
  }

  async sendNoBidsNotification(recipient, auctionData) {
    throw new Error('sendNoBidsNotification method must be implemented by subclasses');
  }

  validateRecipient(recipient) {
    if (!recipient) {
      throw new Error('Recipient information is required');
    }
  }

  formatAuctionMessage(auctionData, messageType) {
    const { auctionId, winningAmount } = auctionData;
    
    switch (messageType) {
      case 'winner':
        return {
          subject: `Congratulations! You won auction ${auctionId}`,
          message: `You have won the auction with a bid of $${winningAmount}. Please proceed with payment.`
        };
      case 'noBids':
        return {
          subject: `Auction ${auctionId} ended with no bids`,
          message: `Your auction ${auctionId} has ended without receiving any bids.`
        };
      default:
        return {
          subject: `Auction ${auctionId} update`,
          message: 'Auction status has been updated.'
        };
    }
  }
}

module.exports = NotificationStrategy;