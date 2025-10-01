const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./services/databaseService');
const { AuctionTimerService, startAuctionScheduler } = require('./services/auctionScheduler.js');
const NotificationObserver = require('./services/observers/notificationObserver');
const AnalyticsObserver = require('./services/observers/analyticsObserver');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auctions', require('./routes/bidRoutes'), require('./routes/auctionRoutes'));
app.use('/api/users/auctions', require('./routes/userAuctionRoutes'));

// register the observers to listen "auction ended" event
// for example: when auction ended, the handler will be execute immediately.
// so, with this pattern, we don't need to maintain execution logic after auction ended everytime.
const setupAuctionObservers = () => {
  const timerService = AuctionTimerService.getInstance();
  
  timerService.on('auctionEnded', NotificationObserver.handleAuctionEnd);
  timerService.on('auctionEnded', AnalyticsObserver.handleAuctionEnd);
  
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
