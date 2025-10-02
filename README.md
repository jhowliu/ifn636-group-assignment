# Auction Platform

A MERN stack auction platform that enables users to create, manage, and participate in real-time auctions. Users can register, bid, and track auctions seamlessly through a responsive web interface.



## Features

### User Management
- User registration and authentication
- Secure login/logout with JWT tokens

### Auction Management
- Create new auctions
- View all available auctions
- Automated winner declaration scheduling
- Auction management

### Bidding System
- Real-time bidding on auctions
- Winner determination 

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework

## Project Structure

```
auction-platform/
├── backend/                # Express.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   └── test/             # Backend tests
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── context/      # React context
│   └── public/           # Static assets
└── package.json          # Root package configuration
```


## Prerequisites

Please install the following software and create accounts:

- **Node.js** - [https://nodejs.org/en](https://nodejs.org/en)
- **Git** - [https://git-scm.com/](https://git-scm.com/)
- **VS Code** - [https://code.visualstudio.com/](https://code.visualstudio.com/)
- **MongoDB Account** - [https://account.mongodb.com/account/login](https://account.mongodb.com/account/login)
- **GitHub Account** - [https://github.com/signup?source=login](https://github.com/signup?source=login)

## Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install-all
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### User Credentials
```
email:test@gmail.com
password:test

email:jhowliu@gmail.com
password:test
```
