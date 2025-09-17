const UserDecorator = require('./userDecorator');

class ProfileUserDecorator extends UserDecorator {
  getUserInfo() {
    const baseInfo = super.getUserInfo();
    return {
      ...baseInfo,
      address: this.userComponent.user.address || null,
      university: this.userComponent.user.university || null,
    };
  }
}

module.exports = ProfileUserDecorator;