# RapidAid Backend API Documentation

## 🚑 Emergency Ambulance Booking System - Backend

A comprehensive Node.js backend API for managing emergency ambulance services, built with Express.js, MongoDB, and Socket.io for real-time features.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Data Flow & Form Handling](#data-flow--form-handling)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [Real-time Features](#real-time-features)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Testing](#testing)

---

## 🎯 Overview

The RapidAid backend provides a complete API for managing emergency ambulance services including:

- **User Management**: Registration, authentication, and profile management
- **Ambulance Management**: Fleet tracking, availability, and location updates
- **Booking System**: Emergency booking requests and dispatch management
- **Driver Management**: Driver profiles, assignments, and tracking
- **Real-time Tracking**: Live ambulance location updates via Socket.io
- **Analytics**: Service statistics and performance metrics
- **OTP System**: Email-based verification and notifications

---

## ✨ Features

### 🔐 Authentication & User Management
- **Multi-role System**: SuperAdmin, Manager, HelplineOperator, Dispatcher, User, Driver
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Profile Management**: Complete user profile creation and updates
- **Role-based Access Control**: Different permissions for different roles

### 🚑 Ambulance Management
- **Fleet Management**: Add, update, and manage ambulance fleet
- **Real-time Location Tracking**: Live GPS coordinates via Socket.io
- **Availability Status**: Track ambulance availability (available, busy, maintenance)
- **Regional Management**: Organize ambulances by service regions
- **Equipment Tracking**: Monitor medical equipment and supplies

### 📱 Booking System
- **Emergency Booking**: Quick emergency ambulance requests
- **Booking Management**: Track booking status and history
- **Dispatch System**: Assign ambulances to emergency calls
- **Fare Calculation**: Dynamic pricing based on distance and urgency
- **Booking Analytics**: Track service metrics and performance

### 👨‍⚕️ Driver Management
- **Driver Profiles**: Complete driver information and credentials
- **License Management**: Track driver licenses and certifications
- **Assignment System**: Assign drivers to specific ambulances
- **Performance Tracking**: Monitor driver performance and ratings
- **Emergency Contacts**: Driver emergency contact information

### 📊 Analytics & Reporting
- **Service Statistics**: Track booking volumes and response times
- **Performance Metrics**: Monitor system performance and efficiency
- **User Analytics**: Track user engagement and service usage
- **Revenue Analytics**: Monitor fare collection and financial metrics

### 🔔 OTP & Notifications
- **Email OTP**: Secure email-based verification system
- **Notification System**: Automated email notifications
- **Rate Limiting**: Prevent OTP abuse and spam
- **OTP Management**: Track and manage OTP usage

---

## 🔄 Data Flow & Form Handling

### 📝 **Form Data Processing Explained**

When you fill out a registration form, here's exactly what happens to your data:

#### 1. **Frontend Form Submission**
```javascript
// Frontend sends data via POST request
const formData = {
  name: "John Doe",
  email: "john@example.com", 
  password: "password123",
  phone: "+1234567890",
  role: "User"
};

// Data is sent to backend API
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

#### 2. **Backend Data Processing**
```javascript
// authController.js - register function
const register = async (req, res) => {
  // ✅ Data comes in req.body (NOT in URL)
  console.log('Registration request body:', req.body);
  
  // Extract data from request body
  const { name, email, password, role = 'User' } = req.body;
  
  // Additional fields from form
  const userData = {
    name,
    email, 
    password,
    role,
    phone: req.body.phone  // ✅ Phone number from form
  };
  
  // Driver-specific fields (if registering as driver)
  if (role === 'Driver') {
    userData.driverLicense = req.body.driverLicense;
    userData.vehicleRegistration = req.body.vehicleRegistration;
    userData.emergencyContactName = req.body.emergencyContactName;
    userData.emergencyContactPhone = req.body.emergencyContactPhone;
  }
  
  // ✅ Data is saved to MongoDB database
  const user = await User.create(userData);
};
```

#### 3. **Data Validation**
```javascript
// validation.js - validateRegistration middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  // ... more validations
];
```

#### 4. **Database Storage**
```javascript
// User.js - User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['SuperAdmin', 'Manager', 'HelplineOperator', 'Dispatcher', 'User', 'Driver'], default: 'User' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  // Driver-specific fields
  driverLicense: { type: String },
  vehicleRegistration: { type: String },
  emergencyContactName: { type: String },
  emergencyContactPhone: { type: String },
  lastLogin: { type: Date },
}, { timestamps: true });

// ✅ Password is automatically hashed before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});
```

### 🔍 **Where Your Form Data Goes:**

1. **Frontend Form** → **HTTP POST Request Body** → **Backend API**
2. **Backend Validation** → **Data Processing** → **MongoDB Database**
3. **Database Storage** → **Response to Frontend** → **User Profile Created**

### 📊 **Data Storage Locations:**

- **User Profiles**: `users` collection in MongoDB
- **Ambulance Data**: `ambulances` collection
- **Bookings**: `bookings` collection
- **Driver Info**: `drivers` collection
- **OTP Records**: `otps` collection

---

## 🔐 Authentication & Security
- **JWT-based Authentication** with configurable expiration
- **Role-Based Access Control** (RBAC) with 5 user roles
- **Password Security** with bcrypt hashing and salt rounds
- **Account Lockout** after 5 failed login attempts (2-hour lock)
- **Input Validation** with express-validator

---

## 🛠 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user profile | Private |
| PUT | `/change-password` | Change user password | Private |
| POST | `/refresh-token` | Refresh JWT token | Private |
| POST | `/logout` | User logout | Private |

### 👥 User Management (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all users (paginated) | Manager+ |
| GET | `/stats/overview` | Get user statistics | Manager+ |
| GET | `/:id` | Get user by ID | Manager+ |
| POST | `/` | Create new user | Manager+ |
| PUT | `/:id` | Update user | Manager+ |
| DELETE | `/:id` | Delete user | SuperAdmin |
| PUT | `/:id/toggle-status` | Toggle user status | Manager+ |

### 🚑 Ambulance Management (`/api/ambulances`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all ambulances | Manager+ |
| GET | `/available` | Get available ambulances | Public |
| GET | `/region/:region` | Get ambulances by region | Manager+ |
| GET | `/:id` | Get ambulance by ID | Manager+ |
| POST | `/` | Create new ambulance | Manager+ |
| PUT | `/:id` | Update ambulance | Manager+ |
| DELETE | `/:id` | Delete ambulance | Manager+ |
| PUT | `/:id/location` | Update ambulance location | Driver+ |

### 📱 Booking Management (`/api/booking`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all bookings | Manager+ |
| GET | `/stats/overview` | Get booking statistics | Manager+ |
| GET | `/user/:userId` | Get user bookings | Private |
| GET | `/:id` | Get booking by ID | Manager+ |
| POST | `/` | Create new booking | Private |
| PUT | `/:id` | Update booking | Manager+ |
| PUT | `/:id/status` | Update booking status | Manager+ |
| DELETE | `/:id` | Cancel booking | Private |

### 👨‍⚕️ Driver Management (`/api/drivers`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all drivers | Manager+ |
| GET | `/stats/overview` | Get driver statistics | Manager+ |
| GET | `/available` | Get available drivers | Manager+ |
| GET | `/:id` | Get driver by ID | Manager+ |
| POST | `/` | Create new driver | Manager+ |
| PUT | `/:id` | Update driver | Manager+ |
| DELETE | `/:id` | Delete driver | Manager+ |
| PUT | `/:id/status` | Update driver status | Manager+ |

### 💰 Fare Management (`/api/fares`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all fares | Manager+ |
| GET | `/stats/overview` | Get fare statistics | Manager+ |
| GET | `/history` | Get fare history | Manager+ |
| POST | `/calculate` | Calculate fare | Private |
| POST | `/` | Create new fare | Manager+ |
| PUT | `/:id` | Update fare | Manager+ |

### 📊 Analytics (`/api/analytics`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/dashboard` | Get dashboard analytics | Manager+ |
| GET | `/bookings` | Get booking analytics | Manager+ |
| GET | `/revenue` | Get revenue analytics | Manager+ |
| GET | `/performance` | Get performance metrics | Manager+ |

### 🔔 OTP Management (`/api/otp`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/generate` | Generate OTP | Private |
| POST | `/verify` | Verify OTP | Public |
| POST | `/regenerate` | Regenerate OTP | Private |
| GET | `/` | Get OTP info | Private |
| GET | `/stats` | Get OTP statistics | Manager+ |
| POST | `/test-email` | Test email configuration | Manager+ |
| POST | `/resend` | Resend OTP email | Private |

---

## 🗄 Database Models

### 👤 User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  role: String (enum: ['SuperAdmin', 'Manager', 'HelplineOperator', 'Dispatcher', 'User', 'Driver']),
  status: String (enum: ['active', 'blocked']),
  driverLicense: String, // Driver-specific
  vehicleRegistration: String, // Driver-specific
  emergencyContactName: String, // Driver-specific
  emergencyContactPhone: String, // Driver-specific
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 🚑 Ambulance Model
```javascript
{
  vehicleNumber: String (required, unique),
  type: String (enum: ['Basic', 'Advanced', 'Critical Care']),
  status: String (enum: ['available', 'busy', 'maintenance']),
  currentLocation: {
    type: 'Point',
    coordinates: [Number, Number] // [longitude, latitude]
  },
  assignedDriver: ObjectId (ref: 'Driver'),
  equipment: [String],
  capacity: Number,
  region: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 📱 Booking Model
```javascript
{
  user: ObjectId (ref: 'User', required),
  ambulance: ObjectId (ref: 'Ambulance'),
  driver: ObjectId (ref: 'Driver'),
  pickupLocation: {
    address: String,
    coordinates: [Number, Number]
  },
  destination: {
    address: String,
    coordinates: [Number, Number]
  },
  status: String (enum: ['pending', 'confirmed', 'dispatched', 'in_progress', 'completed', 'cancelled']),
  urgency: String (enum: ['low', 'medium', 'high', 'critical']),
  fare: Number,
  estimatedTime: Number, // in minutes
  actualTime: Number, // in minutes
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/developerrapidaid/RapidAid.git
cd RapidAid/Admin-panel/backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Start Production Server**
```bash
npm start
```

---

## 🔧 Environment Variables

### Required Variables
```bash
# Database
MONGO_URI=mongodb://localhost:27017/rapidaid

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ADMIN_FRONTEND_URL=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin User
ADMIN_EMAIL=admin@rapidaid.com
ADMIN_PASSWORD=admin123
```

---

## 🧪 Testing

### Run Tests
```bash
# Run authentication tests
npm test

# Run specific test
node test-auth.js
```

### Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# User registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# User login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📞 Support & Contact

- **Repository**: [https://github.com/developerrapidaid/RapidAid](https://github.com/developerrapidaid/RapidAid)
- **Documentation**: See `RENDER_DEPLOYMENT.md` for deployment guide
- **Issues**: Report bugs via GitHub Issues

---

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ for Emergency Healthcare Services**

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business services
│   ├── utils/           # Utility functions
│   └── app.js          # Express app setup
├── server.js            # Server entry point
└── package.json
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Logging**: Morgan
- **Real-time**: Socket.io
- **Email**: Nodemailer

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Admin-panel/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/rapidaid
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   
   # Email Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-app-password
   
   # Security
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔐 Authentication System

### User Roles & Hierarchy

```
SuperAdmin (Highest)
├── Manager
│   ├── HelplineOperator
│   └── Dispatcher
└── User (Lowest)
```

### Role Permissions

| Role | Users | Drivers | Ambulances | Bookings | System |
|------|-------|---------|------------|----------|---------|
| SuperAdmin | Full Access | Full Access | Full Access | Full Access | Full Access |
| Manager | Full Access | Full Access | Full Access | Full Access | Limited |
| HelplineOperator | View Only | View Only | View Only | View Only | None |
| Dispatcher | View Only | View Only | Full Access | Full Access | None |
| User | Own Profile | None | None | Own Bookings | None |

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | User login | Public |
| `GET` | `/api/auth/me` | Get current user | Private |
| `PUT` | `/api/auth/change-password` | Change password | Private |
| `POST` | `/api/auth/refresh` | Refresh token | Private |
| `POST` | `/api/auth/logout` | User logout | Private |

### User Management Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/users` | Get all users (paginated) | Manager+ |
| `GET` | `/api/users/stats/overview` | Get user statistics | Manager+ |
| `POST` | `/api/users` | Create new user | Manager+ |
| `GET` | `/api/users/:id` | Get user by ID | Manager+ |
| `PUT` | `/api/users/:id` | Update user | Manager+ |
| `DELETE` | `/api/users/:id` | Delete user | SuperAdmin |
| `PATCH` | `/api/users/:id/status` | Toggle user status | Manager+ |

## 🔒 Security Features

### Password Security
- **Minimum Length**: 6 characters
- **Hashing**: bcrypt with 12 salt rounds
- **Automatic Hashing**: On password change
- **Secure Comparison**: Using bcrypt.compare

### Account Protection
- **Failed Login Attempts**: Tracked and limited
- **Account Lockout**: After 5 failed attempts
- **Lockout Duration**: 2 hours
- **Automatic Reset**: On successful login

### Input Validation
- **Email Format**: RFC compliant validation
- **Name Length**: 2-50 characters
- **Phone Format**: International format support
- **Role Validation**: Enum-based validation
- **Status Validation**: Active/Blocked only

## 📊 Database Models

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (enum: SuperAdmin, Manager, HelplineOperator, Dispatcher, User),
  status: String (enum: active, blocked),
  phone: String (optional, validated),
  avatar: String (optional),
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  timestamps: true
}
```

## 🚨 Error Handling

### Standard Error Responses
```json
{
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Validation message"
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (No/Invalid Token)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found
- `423` - Locked (Account Locked)
- `500` - Internal Server Error

## 🔧 Configuration

### JWT Configuration
- **Secret**: Environment variable `JWT_SECRET`
- **Expiration**: 7 days (configurable)
- **Algorithm**: HS256

### MongoDB Configuration
- **Connection**: Environment variable `MONGO_URI`
- **Options**: Automatic indexing, connection pooling
- **Validation**: Schema-level validation

### Security Configuration
- **CORS**: Enabled for development
- **Rate Limiting**: Built into User model
- **Input Sanitization**: Automatic with express-validator

## 🧪 Testing

### Test User Creation
```bash
# Create SuperAdmin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@rapidaid.com",
    "password": "password123",
    "role": "SuperAdmin"
  }'
```

### Test Login
```bash
# Login with created user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rapidaid.com",
    "password": "password123"
  }'
```

## 🚀 Deployment

### Production Considerations
1. **Change JWT Secret**: Use strong, unique secret
2. **Environment Variables**: Set all required env vars
3. **Database**: Use production MongoDB instance
4. **HTTPS**: Enable SSL/TLS
5. **Rate Limiting**: Implement additional rate limiting
6. **Logging**: Configure production logging
7. **Monitoring**: Add health checks and monitoring

### Environment Variables
```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://production-db:27017/rapidaid
JWT_SECRET=your_production_secret_key
```

## 📝 Development Guidelines

### Code Style
- **ES6+**: Use modern JavaScript features
- **Async/Await**: Prefer over callbacks
- **Error Handling**: Always use try-catch
- **Validation**: Validate all inputs
- **Documentation**: Comment complex logic

### Best Practices
- **Security First**: Validate and sanitize all inputs
- **Error Handling**: Never expose internal errors
- **Logging**: Log errors for debugging
- **Testing**: Test all endpoints
- **Documentation**: Keep API docs updated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a production-ready authentication system with enterprise-level security features. Make sure to customize the configuration according to your specific requirements.
