const BaseHandler = require('./BaseHandler');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

class AuthHandler extends BaseHandler {
  constructor(options = {}) {
    super();
    this.requireAuth = options.requireAuth || false;
  }

  canHandle(request) {
    return this.requireAuth || request.headers.authorization;
  }

  async process(request, response) {
    const token = this.extractToken(request);

    if (!token) {
      if (this.requireAuth) {
        this.sendError(response, 401, 'Access denied. No token provided.');
        return;
      }
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        this.sendError(response, 401, 'Token is not valid. User not found.');
        return;
      }

      request.user = user;
      console.log(`User authenticated: ${user.name} (${user.email})`);

    } catch (error) {
      this.sendError(response, 401, 'Token is not valid.');
      return;
    }
  }

  extractToken(request) {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  canContinueOnError(error) {
    return !this.requireAuth;
  }
}

module.exports = AuthHandler;