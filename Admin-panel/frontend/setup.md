# Quick Setup Guide

## Step 1: Start Backend
```bash
cd backend
npm run dev
```
Backend should be running on http://localhost:5000

## Step 2: Create Test User
Use Postman or curl to create a test user:

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

## Step 3: Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will open on http://localhost:3000

## Step 4: Login
- Email: admin@rapidaid.com
- Password: password123

## Test All Features:
1. **Dashboard**: Check statistics and API health
2. **Users**: Add, edit, delete users
3. **Drivers**: Add drivers, assign ambulances
4. **Ambulances**: Add ambulances, update locations

## Troubleshooting:
- If backend shows "undefined" for MONGO_URI, check your .env file
- If frontend can't connect, ensure backend is running on port 5000
- Clear browser cache if you see authentication issues
