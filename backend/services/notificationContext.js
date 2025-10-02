const EmailNotificationStrategy = require('./strategies/emailNotificationStrategy');
const SMSNotificationStrategy = require('./strategies/smsNotificationStrategy');

// This is strategy context, maintaining all strategies here.
// We can just call this context to send notification with specified method.
class NotificationContext {
  constructor() {
    this.strategies = {
      email: new EmailNotificationStrategy(),
      sms: new SMSNotificationStrategy()
    };
  }

  setStrategy(strategyType) {
    if (!this.strategies[strategyType]) {
      throw new Error(`Notification strategy '${strategyType}' not found`);
    }
    this.currentStrategy = this.strategies[strategyType];
    return this;
  }

  addStrategy(name, strategy) {
    this.strategies[name] = strategy;
  }

  async sendWinnerNotification(recipient, auctionData, method = 'email') {
    if (!this.currentStrategy) {
      this.currentStrategy = this.strategies[method];
    }
    
    if (!this.currentStrategy) {
      throw new Error(`Notification strategy '${method}' not found`);
    }

    return await this.currentStrategy.sendWinnerNotification(recipient, auctionData);
  }

  getAvailableStrategies() {
    return Object.keys(this.strategies);
  }
}

module.exports = NotificationContext;