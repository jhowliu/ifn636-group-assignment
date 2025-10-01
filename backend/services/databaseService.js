const mongoose = require("mongoose");

// singleton pattern to reuse the same instance for server
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this._connection = null;
    DatabaseConnection.instance = this;
  }

  static getInstance() {
    // check if singleton instance is exist
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect() {
    if (this._connection) {
      console.log("Database already connected");
      return this._connection;
    }

    try {
      this._connection = await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully");
      return this._connection;
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      this._connection = null;
      process.exit(1);
    }
  }

  getConnection() {
    return this._connection;
  }
}

const connectDB = async () => {
  const dbInstance = DatabaseConnection.getInstance();
  return await dbInstance.connect();
};

module.exports = { DatabaseConnection, connectDB };
