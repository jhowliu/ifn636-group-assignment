const mongoose = require("mongoose");

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this._isConnected = false;
    this._connection = null;
    DatabaseConnection.instance = this;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect() {
    if (this._isConnected && this._connection) {
      console.log("Database already connected");
      return this._connection;
    }

    try {
      this._connection = await mongoose.connect(process.env.MONGO_URI);
      this._isConnected = true;
      console.log("MongoDB connected successfully");
      
      this._setupEventListeners();
      return this._connection;
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      this._isConnected = false;
      this._connection = null;
      process.exit(1);
    }
  }

  _setupEventListeners() {
    mongoose.connection.on('disconnected', () => {
      this._isConnected = false;
      this._connection = null;
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on('error', (error) => {
      console.error("MongoDB connection error:", error.message);
      this._isConnected = false;
      this._connection = null;
    });
  }

  async disconnect() {
    if (this._isConnected && this._connection) {
      await mongoose.disconnect();
      this._isConnected = false;
      this._connection = null;
      console.log("MongoDB disconnected successfully");
    }
  }

  getConnection() {
    return this._connection;
  }

  isConnected() {
    return this._isConnected;
  }
}

const connectDB = async () => {
  const dbInstance = DatabaseConnection.getInstance();
  return await dbInstance.connect();
};

module.exports = { DatabaseConnection, connectDB };
