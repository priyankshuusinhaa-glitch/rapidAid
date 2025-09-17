# RapidAid Backend - Render Deployment Guide

## 🚀 Deploying RapidAid Backend to Render

This guide will help you deploy the RapidAid backend API to Render.com.

### Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a MongoDB database (free tier available)

### Step 1: Prepare Your Repository

The following files are already configured for Render deployment:

- ✅ `render.yaml` - Render configuration file
- ✅ `.env.example` - Environment variables template
- ✅ `package.json` - Updated with production scripts
- ✅ `server.js` - Main server file

### Step 2: Set Up MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your actual password

### Step 3: Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Login to Render**
   - Go to [render.com](https://render.com)
   - Sign in with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Admin-panel/backend` folder as the root directory

3. **Configure Service Settings**
   ```
   Name: rapidaid-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: Admin-panel/backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rapidaid?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=https://your-frontend-domain.onrender.com
   ADMIN_FRONTEND_URL=https://your-admin-frontend-domain.onrender.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ADMIN_EMAIL=admin@rapidaid.com
   ADMIN_PASSWORD=admin123
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)

#### Option B: Using render.yaml (Infrastructure as Code)

1. **Push render.yaml to your repository**
2. **Create Service from YAML**
   - In Render dashboard, click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect and use the `render.yaml` file

### Step 4: Configure Database

1. **Create MongoDB Database**
   - In Render dashboard, go to "Databases"
   - Click "New +" → "Database"
   - Choose MongoDB
   - Name: `rapidaid-db`
   - Plan: Free

2. **Update Environment Variables**
   - Go to your web service
   - Update `MONGO_URI` with the database connection string from Render

### Step 5: Test Your Deployment

1. **Check Service Status**
   - Your service URL will be: `https://rapidaid-backend.onrender.com`
   - Check the logs for any errors

2. **Test API Endpoints**
   ```bash
   # Health check
   curl https://rapidaid-backend.onrender.com/api/health
   
   # Test authentication
   curl -X POST https://rapidaid-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@rapidaid.com","password":"admin123"}'
   ```

### Step 6: Configure Frontend URLs

Update your frontend applications to use the deployed backend:

```javascript
// In your frontend .env files
REACT_APP_API_URL=https://rapidaid-backend.onrender.com
```

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | `your_email@gmail.com` |
| `EMAIL_PASS` | SMTP password | `your_app_password` |
| `FRONTEND_URL` | User frontend URL | `https://your-frontend.onrender.com` |
| `ADMIN_FRONTEND_URL` | Admin frontend URL | `https://your-admin.onrender.com` |

### Troubleshooting

#### Common Issues:

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings in MongoDB Atlas

3. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names

4. **CORS Issues**
   - Update `FRONTEND_URL` and `ADMIN_FRONTEND_URL` with correct domains

#### Logs and Debugging:

- View logs in Render dashboard
- Check "Events" tab for deployment issues
- Use `console.log()` statements for debugging

### Production Considerations

1. **Security**
   - Use strong JWT secrets
   - Enable HTTPS (automatic on Render)
   - Set up proper CORS origins

2. **Performance**
   - Consider upgrading to paid plan for better performance
   - Implement caching strategies
   - Monitor resource usage

3. **Monitoring**
   - Set up health checks
   - Monitor API response times
   - Track error rates

### Next Steps

1. Deploy your frontend applications
2. Set up custom domains (optional)
3. Configure SSL certificates (automatic on Render)
4. Set up monitoring and alerts

### Support

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Deployment URL**: `https://rapidaid-backend.onrender.com`  
**Admin Login**: `admin@rapidaid.com` / `admin123`
