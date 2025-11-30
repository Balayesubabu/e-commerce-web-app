# MERN E-Commerce Deployment Guide

## Backend Deployment (Render)

1. **Create account** at https://render.com
2. **Connect your GitHub repo**
3. **Create new Web Service:**
   - Name: `mern-backend`
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
4. **Set Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/clothingdb
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

## Frontend Deployment (Vercel)

1. **Create account** at https://vercel.com
2. **Import your GitHub repo**
3. **Configure build settings:**
   - Framework: Create React App
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
4. **Set Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-render-backend.onrender.com/api
   ```
5. **Deploy**

## After Deployment

- Update frontend `REACT_APP_API_URL` to point to your Render backend URL
- Update backend `FRONTEND_URL` to point to your Vercel frontend URL
- Test API connectivity in browser DevTools Network tab
