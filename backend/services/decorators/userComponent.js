class UserComponent {
  constructor() {
    if (new.target === UserComponent) {
      throw new Error('UserComponent is abstract and cannot be instantiated directly');
    }
  }

  getUserInfo() {
    throw new Error('getUserInfo method must be implemented');
  }
}

module.exports = UserComponent;