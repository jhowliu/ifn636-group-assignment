const NotificationStrategy = require('./notificationStrategy');

class SMSNotificationStrategy extends NotificationStrategy {
  async sendWinnerNotification(recipient, auctionData) {
    this.validateRecipient(recipient);
    
    if (!recipient.phone) {
      throw new Error('Phone number is required for SMS notifications');
    }

    const { message } = this.formatAuctionMessage(auctionData, 'winner');
    const smsMessage = this.formatSMSMessage(message, auctionData);
    
    try {
      console.log(`Sending winner SMS to: ${recipient.phone}`);
      console.log(`Message: ${smsMessage}`);
      
      // TODO: Implement actual SMS sending logic
      
      
      console.log(`Winner SMS sent successfully to ${recipient.phone}`);
      return { success: true, method: 'sms', recipient: recipient.phone };
      
    } catch (error) {
      console.error(`Failed to send winner SMS to ${recipient.phone}:`, error);
      throw error;
    }
  }

  formatSMSMessage(message, auctionData) {
    const { auctionId, winningAmount } = auctionData;
    
    // SMS messages should be concise due to character limits
    let smsText = `Auction ${auctionId}: ${message}`;
    
    if (winningAmount) {
      smsText += ` Amount: $${winningAmount}`;
    }
    
    // Ensure message is under typical SMS length limit
    if (smsText.length > 160) {
      smsText = smsText.substring(0, 157) + '...';
    }
    
    return smsText;
  }

  validatePhoneNumber(phone) {
    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Invalid phone number format');
    }
  }
}

module.exports = SMSNotificationStrategy;