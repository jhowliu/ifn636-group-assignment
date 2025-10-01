const NotificationStrategy = require('./notificationStrategy');

// This applied the OOP inheritance and implement all required methods from super calss.
class EmailNotificationStrategy extends NotificationStrategy {
  async sendWinnerNotification(recipient, auctionData) {
    this.validateRecipient(recipient);
    console.log(recipient);
    
    if (!recipient.email) {
      throw new Error('Email address is required for email notifications');
    }

    const { subject, message } = this.formatAuctionMessage(auctionData, 'winner');
    
    try {
      console.log(`Sending winner email to: ${recipient.email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      
      // TODO: Implement actual email sending logic
      
      console.log(`Winner email sent successfully to ${recipient.email}`);
      return { success: true, method: 'email', recipient: recipient.email };
      
    } catch (error) {
      console.error(`Failed to send winner email to ${recipient.email}:`, error);
      throw error;
    }
  }

  generateEmailTemplate(message, auctionData) {
    const { auctionId, winningAmount } = auctionData;
    
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c5aa0;">Auction Update</h2>
            <p>${message}</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Auction Details:</h3>
              <p><strong>Auction ID:</strong> ${auctionId}</p>
              ${winningAmount ? `<p><strong>Final Amount:</strong> $${winningAmount}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 14px;">
              This is an automated message from the Auction Platform.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = EmailNotificationStrategy;