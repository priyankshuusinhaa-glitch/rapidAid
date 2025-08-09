# RapidAid Backend API

A comprehensive backend API for the RapidAid Ambulance Management System built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: CRUD operations for users with different roles
- **Driver Management**: Manage drivers, their status, and performance
- **Ambulance Management**: Track ambulances, their locations, and availability
- **Real-time Updates**: Socket.io integration for live tracking
- **Error Handling**: Comprehensive error handling and validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **Validation**: Express-validator

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/rapidaid
   JWT_SECRET=your_jwt_secret_key
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_email_password
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user profile | Private |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users (with pagination) | Manager+ |
| GET | `/api/users/:id` | Get user by ID | Manager+ |
| PUT | `/api/users/:id` | Update user | Manager+ |
| DELETE | `/api/users/:id` | Delete user | SuperAdmin |
| PATCH | `/api/users/:id/status` | Toggle user status | Manager+ |

### Drivers

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/drivers` | Get all drivers (with pagination) | Manager+ |
| GET | `/api/drivers/:id` | Get driver by ID | Manager+ |
| POST | `/api/drivers` | Create new driver | Manager+ |
| PUT | `/api/drivers/:id` | Update driver | Manager+ |
| DELETE | `/api/drivers/:id` | Delete driver | Manager+ |
| PATCH | `/api/drivers/:id/status` | Toggle driver status | Manager+ |
| GET | `/api/drivers/:id/performance` | Get driver performance | Manager+ |

### Ambulances

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/ambulances` | Get all ambulances (with pagination) | Manager+ |
| GET | `/api/ambulances/available` | Get available ambulances | Dispatcher+ |
| GET | `/api/ambulances/region` | Get ambulances by region | Dispatcher+ |
| GET | `/api/ambulances/:id` | Get ambulance by ID | Manager+ |
| POST | `/api/ambulances` | Create new ambulance | Manager+ |
| PUT | `/api/ambulances/:id` | Update ambulance | Manager+ |
| DELETE | `/api/ambulances/:id` | Delete ambulance | Manager+ |
| PATCH | `/api/ambulances/:id/location` | Update ambulance location | Driver |

## Role-Based Access Control

### Roles Hierarchy

1. **SuperAdmin**: Full access to all features
2. **Manager**: User and driver management, ambulance management
3. **HelplineOperator**: Support and communication features
4. **Dispatcher**: Manual ride assignment and ambulance tracking
5. **User**: Basic user features

### Access Levels

- **Public**: No authentication required
- **Private**: Authentication required
- **Manager+**: Manager, SuperAdmin access
- **Dispatcher+**: Dispatcher, Manager, SuperAdmin access
- **SuperAdmin**: Only SuperAdmin access

## Request/Response Examples

### Register User

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Manager"
}
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Manager",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Manager",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Users (with pagination)

**Request:**
```bash
GET /api/users?page=1&limit=10&search=john&role=Manager&status=active
Authorization: Bearer <token>
```

**Response:**
```json
{
  "users": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Manager",
      "status": "active",
      "createdAt": "2023-01-15T10:30:00.000Z"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": ["Additional error details"] // Optional
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `MAIL_HOST` | SMTP host for email | No | - |
| `MAIL_PORT` | SMTP port for email | No | - |
| `MAIL_USER` | SMTP username | No | - |
| `MAIL_PASS` | SMTP password | No | - |
| `PORT` | Server port | No | 5000 |

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middlewares
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js          # Express app setup
├── server.js           # Server entry point
├── package.json
└── README.md
```

### Running Tests

```bash
npm test
```

### Code Style

The project follows standard JavaScript/Node.js conventions and uses ESLint for code quality.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
