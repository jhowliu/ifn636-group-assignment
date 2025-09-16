const AuthHandler = require('./chain/AuthHandler');

const createAuthChain = (requireAuth = true) => {
  const authHandler = new AuthHandler({ requireAuth });

  return async (req, res, next) => {
    try {
      await authHandler.handle(req, res, next);
    } catch (error) {
      console.error('Auth chain error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Authentication error',
          timestamp: new Date().toISOString()
        });
      }
    }
  };
};

const requireAuth = createAuthChain(true);

module.exports = {
  requireAuth,
  createAuthChain
};