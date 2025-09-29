const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./services/databaseService');
const { AuctionTimerService, startAuctionScheduler } = require('./services/auctionScheduler.js');
const NotificationObserver = require('./services/observers/notificationObserver');
const AnalyticsObserver = require('./services/observers/analyticsObserver');
const PaymentObserver = require('./services/observers/paymentObserver');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', ' http://13.55.32.254:5001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auctions', require('./routes/bidRoutes'), require('./routes/auctionRoutes'));
app.use('/api/users/auctions', require('./routes/userAuctionRoutes'));

const setupAuctionObservers = () => {
  const timerService = AuctionTimerService.getInstance();
  
  timerService.on('auctionEnded', NotificationObserver.handleAuctionEnd);
  timerService.on('auctionEnded', AnalyticsObserver.handleAuctionEnd);
  timerService.on('auctionEnded', PaymentObserver.handleAuctionEnd);
  
  console.log('Auction observers configured successfully');
};

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // Setup observers before starting the scheduler
    setupAuctionObservers();
    // If the file is run directly, start the server
    startAuctionScheduler();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app
