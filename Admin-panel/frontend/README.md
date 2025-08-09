# RapidAid Frontend - Admin Panel

A React-based admin panel for the RapidAid Ambulance Management System.

## Features

- **Authentication**: Login/logout with JWT tokens
- **User Management**: CRUD operations for users with role-based access
- **Driver Management**: Manage drivers, assign ambulances, track status
- **Ambulance Management**: Track ambulances, update locations, manage assignments
- **Dashboard**: Overview statistics and quick actions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## Usage

### 1. First Time Setup

1. **Start your backend server** (make sure it's running on port 5000)
2. **Create a test user** using the backend API:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin User",
       "email": "admin@rapidaid.com",
       "password": "password123",
       "role": "SuperAdmin"
     }'
   ```

### 2. Login

1. Open `http://localhost:3000` in your browser
2. Use the credentials:
   - **Email**: admin@rapidaid.com
   - **Password**: password123

### 3. Features to Test

#### Dashboard
- View system statistics
- Test API health check
- Quick navigation to other sections

#### User Management
- View all users
- Add new users
- Edit existing users
- Block/unblock users
- Delete users (SuperAdmin only)

#### Driver Management
- View all drivers
- Add new drivers
- Assign ambulances to drivers
- Toggle driver status (online/offline)
- Edit driver information

#### Ambulance Management
- View all ambulances
- Add new ambulances
- Assign drivers to ambulances
- Update ambulance locations
- Check available ambulances

## API Integration

The frontend communicates with the backend API endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/me`
- **Users**: `/api/users/*`
- **Drivers**: `/api/drivers/*`
- **Ambulances**: `/api/ambulances/*`

## Role-Based Access

The frontend respects the role-based access control:

- **SuperAdmin**: Full access to all features
- **Manager**: User and driver management
- **HelplineOperator**: Limited access
- **Dispatcher**: Ambulance tracking and assignment
- **User**: Basic access

## Testing Checklist

Use this checklist to verify all functionalities:

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Logout functionality
- [ ] Token persistence across page refresh

### User Management
- [ ] View users list
- [ ] Add new user
- [ ] Edit existing user
- [ ] Block/unblock user
- [ ] Delete user (SuperAdmin only)
- [ ] Role-based access restrictions

### Driver Management
- [ ] View drivers list
- [ ] Add new driver
- [ ] Edit driver information
- [ ] Assign ambulance to driver
- [ ] Toggle driver status
- [ ] Delete driver

### Ambulance Management
- [ ] View ambulances list
- [ ] Add new ambulance
- [ ] Edit ambulance information
- [ ] Assign driver to ambulance
- [ ] Update ambulance location
- [ ] Check available ambulances
- [ ] Delete ambulance

### Dashboard
- [ ] View statistics
- [ ] API health check
- [ ] Quick navigation buttons

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure backend is running on port 5000
   - Check if MongoDB is connected
   - Verify API endpoints are working

2. **Authentication Issues**
   - Clear browser localStorage
   - Check if JWT token is valid
   - Verify user credentials

3. **CORS Errors**
   - Backend should have CORS enabled
   - Check if proxy is configured correctly

### Development

- **Hot Reload**: Changes will automatically reload the page
- **Console Logs**: Check browser console for errors
- **Network Tab**: Monitor API requests in browser dev tools

## Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build` folder.

## Contributing

1. Follow React best practices
2. Use consistent code formatting
3. Test all functionality before committing
4. Update documentation for new features
