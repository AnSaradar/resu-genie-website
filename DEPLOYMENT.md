# Vercel Deployment Guide for Resu-Genie Frontend

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Backend API**: Your FastAPI backend should be deployed and accessible

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Navigate to your project root
cd "E:\Personal Projects\resu-genie"

# Add all files to git
git add .

# Commit your changes
git commit -m "Add Vercel deployment configuration"

# Push to GitHub
git push origin frontend-requirements-enhancements
```

### 1.2 Verify Configuration Files
Make sure these files are in your `resu-genie-website` directory:
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `package.json` - Contains build scripts
- ✅ `vite.config.ts` - Updated to use environment variables

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Your Repository**
   - Connect your GitHub account if not already connected
   - Select your `resu-genie` repository
   - Choose the `frontend-requirements-enhancements` branch

3. **Configure Project Settings**
   - **Framework Preset**: Select "Vite"
   - **Root Directory**: Set to `resu-genie-website`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Environment Variables**
   - Go to "Environment Variables" section
   - Add the following:
     ```
     VITE_API_BASE_URL = https://your-backend-api.com
     ```
   - Replace `https://your-backend-api.com` with your actual backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Frontend Directory**
   ```bash
   cd "E:\Personal Projects\resu-genie\resu-genie-website"
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_BASE_URL
   # Enter your backend URL when prompted
   ```

## Step 3: Configure Environment Variables

### Production Environment Variables
In your Vercel dashboard, set these environment variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_API_BASE_URL` | `https://your-backend-api.com` | Your FastAPI backend URL |

### Example Backend URLs:
- **Heroku**: `https://your-app-name.herokuapp.com`
- **Railway**: `https://your-app-name.railway.app`
- **DigitalOcean**: `https://your-app-name.ondigitalocean.app`
- **Custom Domain**: `https://api.yourdomain.com`

## Step 4: Verify Deployment

1. **Check Build Logs**
   - Go to your Vercel dashboard
   - Click on your project
   - Check the "Functions" tab for any build errors

2. **Test Your Application**
   - Visit your deployed URL
   - Test all major functionality:
     - User registration/login
     - Resume generation
     - API connectivity

3. **Check Network Tab**
   - Open browser dev tools
   - Verify API calls are going to the correct backend URL

## Step 5: Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your Vercel project settings
   - Click "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Add CNAME record pointing to your Vercel deployment
   - Wait for DNS propagation

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check `package.json` has correct build script
   - Verify all dependencies are listed
   - Check for TypeScript errors

2. **API Calls Fail**
   - Verify `VITE_API_BASE_URL` environment variable is set correctly
   - Check CORS settings on your backend
   - Ensure backend is deployed and accessible

3. **Routing Issues**
   - The `vercel.json` file includes SPA routing configuration
   - All routes should redirect to `index.html`

### Build Commands Reference:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## Environment-Specific Configuration

### Development
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Production
```bash
VITE_API_BASE_URL=https://your-production-backend.com
```

## Next Steps

1. **Monitor Performance**: Use Vercel Analytics to track performance
2. **Set up CI/CD**: Automatic deployments on git push
3. **Configure Backend**: Ensure your FastAPI backend has proper CORS settings
4. **SSL Certificates**: Vercel provides free SSL certificates automatically

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test API connectivity
4. Review CORS configuration on backend
