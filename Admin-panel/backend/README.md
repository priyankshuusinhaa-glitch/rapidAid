# RapidAid Admin Panel Backend

A comprehensive Node.js backend for the RapidAid Ambulance Management System Admin Panel.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with configurable expiration
- **Role-Based Access Control** (RBAC) with 5 user roles
- **Password Security** with bcrypt hashing and salt rounds
- **Account Lockout** after 5 failed login attempts (2-hour lock)
- **Input Validation** with express-validator
- **Secure Password Change** functionality

### 👥 User Management
- **Complete CRUD Operations** for users
- **Advanced Search & Filtering** with pagination
- **Role Management** with hierarchy enforcement
- **Status Management** (active/blocked)
- **User Statistics** and analytics
- **Prevent Self-Deletion/Blocking**

### 🛡️ Security Features
- **Rate Limiting** for login attempts
- **Account Lockout Protection**
- **Role Hierarchy Enforcement**
- **Input Sanitization**
- **Error Handling** without information leakage

## 🏗️ Architecture

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
