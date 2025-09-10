const validateAuctionData = (req, res, next) => {
  const { title, description, startingPrice, category, startDate, endDate } = req.body;
  const errors = [];

  // Required fields validation
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!startingPrice || startingPrice < 0) {
    errors.push('Starting price must be a positive number');
  }

  if (!category) {
    errors.push('Category is required');
  }

  if (!startDate) {
    errors.push('Start date is required');
  }

  if (!endDate) {
    errors.push('End date is required');
  }

  // Date validation
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      errors.push('Start date must be in the future');
    }

    if (end <= start) {
      errors.push('End date must be after start date');
    }

    const minDuration = 1 * 60 * 1000; // 1 hour
    if (end - start < minDuration) {
      errors.push('Auction must run for at least 1 minute');
    }
  }

  // Category validation
  const allowedCategories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Art', 'Other'];
  if (category && !allowedCategories.includes(category)) {
    errors.push('Invalid category');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', ')
    });
  }

  next();
};

module.exports = {
  validateAuctionData,
};