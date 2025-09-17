const UserComponent = require('./userComponent');

class BasicUser extends UserComponent {
  constructor(user) {
    super();
    this.user = user;
  }

  getUserInfo() {
    return {
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
    };
  }
}

module.exports = BasicUser;