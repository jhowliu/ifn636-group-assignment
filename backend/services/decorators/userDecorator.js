const UserComponent = require('./userComponent');

class UserDecorator extends UserComponent {
  constructor(userComponent) {
    super();
    if (new.target === UserDecorator) {
      throw new Error('UserDecorator is abstract and cannot be instantiated directly');
    }
    this.userComponent = userComponent;
  }

  getUserInfo() {
    return this.userComponent.getUserInfo();
  }
}

module.exports = UserDecorator;