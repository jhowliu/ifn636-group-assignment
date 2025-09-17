const AuthHandler = require('./chain/AuthHandler');
const ValidationHandler = require('./chain/ValidationHandler');

const createAuctionValidationChain = () => {
  const authHandler = new AuthHandler({ requireAuth: true });
  const validationHandler = new ValidationHandler({
    title: {
      required: true,
      type: 'string',
      minLength: 3,
      maxLength: 100
    },
    description: {
      required: true,
      type: 'string',
      minLength: 10,
      maxLength: 1000
    },
    startingPrice: {
      required: true,
      type: 'number',
      min: 0.01
    },
    category: {
      required: true,
      type: 'string',
      enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Art', 'Other']
    },
    startDate: {
      required: true,
      custom: (value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return 'Invalid start date format';
        }
        if (date < new Date()) {
          return 'Start date cannot be in the past';
        }
        return null;
      }
    },
    endDate: {
      required: true,
      custom: (value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return 'Invalid end date format';
        }
        return null;
      }
    }
  });

  // Set up the chain: auth -> validation
  authHandler.setNext(validationHandler);

  return async (req, res, next) => {
    try {
      await authHandler.handle(req, res, next);
    } catch (error) {
      console.error('Auction validation chain error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Server error',
          timestamp: new Date().toISOString()
        });
      }
    }
  };
};

const auctionValidationChain = createAuctionValidationChain();

module.exports = {
  auctionValidationChain,
  createAuctionValidationChain
};