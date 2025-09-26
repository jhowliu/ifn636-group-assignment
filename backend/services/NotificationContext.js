const EmailNotificationStrategy = require('./strategies/emailNotificationStrategy');
const SMSNotificationStrategy = require('./strategies/smsNotificationStrategy');

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
    const strategy = this.strategies[method];
    
    if (!strategy) {
      throw new Error(`Notification strategy '${method}' not found`);
    }

    return await strategy.sendWinnerNotification(recipient, auctionData);
  }

  async sendNoBidsNotification(recipient, auctionData, method = 'email') {
    const strategy = this.strategies[method];
    
    if (!strategy) {
      throw new Error(`Notification strategy '${method}' not found`);
    }

    return await strategy.sendNoBidsNotification(recipient, auctionData);
  }

  getAvailableStrategies() {
    return Object.keys(this.strategies);
  }
}

module.exports = NotificationContext;