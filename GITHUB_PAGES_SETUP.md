# GitHub Pages & Frontend Deployment Setup Guide

## Part 1: Check Your Frontend Build Status in GitHub

### Method 1: View GitHub Actions Status

**Step 1: Go to Your Repository**
```
https://github.com/YOUR_USERNAME/ecoroute-ai-platform
```

**Step 2: Click on "Actions" Tab**
- Located at the top navigation bar
- Shows all workflow runs

**Step 3: Check Build Status**
- Look for your latest commit/branch build
- You should see three jobs:
  - ✅ Backend
  - ✅ Frontend
  - ✅ AI Service
- Green checkmark = Success
- Red X = Failed

**Step 4: Click on Frontend Job to See Details**
- Shows full build logs
- Look for:
  - `npm install` - Dependency installation
  - `tsc -b` - TypeScript compilation
  - `vite build` - Build output generation
  - Final status: **✓ built in XXms**

### Method 2: Check Merge PR Status

**When creating a Pull Request:**
1. Go to Pull Requests tab
2. Click on your PR (e.g., hotfix → develop)
3. Scroll down to see "Checks" section
4. Shows all GitHub Actions running
5. All three must be ✅ green before merging

### Method 3: Check Build Badge

Add a badge to your README to show build status:

```markdown
## CI/CD Status

[![Frontend Build](https://github.com/YOUR_USERNAME/ecoroute-ai-platform/actions/workflows/main.yml/badge.svg)](https://github.com/YOUR_USERNAME/ecoroute-ai-platform/actions)
```

---

## Part 2: Setup FREE Website on GitHub Pages

### What is GitHub Pages?

- **Free static website hosting** directly from your GitHub repository
- Perfect for React/Vue/Angular frontends
- Automatic HTTPS enabled
- Custom domain support
- No server costs

### Types of GitHub Pages Sites

1. **Project Site** (for one repository) - `https://YOUR_USERNAME.github.io/ecoroute-ai-platform`
2. **User/Organization Site** (one per account) - `https://YOUR_USERNAME.github.io`

We'll set up a **Project Site** for your ecoroute-ai-platform.

---

## Step-by-Step Setup

### Step 1: Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR_USERNAME/ecoroute-ai-platform`
2. Click **Settings** (gear icon) at top right
3. In left sidebar, click **Pages** (under "Code and automation")
4. Under **Source**, select dropdown
5. Choose **Deploy from a branch**
6. Select branch: **main** (or **gh-pages** if you have one)
7. Select folder: **/root** (or **/docs** if you put build there)
8. Click **Save**

**Check the Result:**
- Green checkmark appears
- Your site URL: `https://YOUR_USERNAME.github.io/ecoroute-ai-platform`

### Step 2: Build Frontend for Production

Before pushing, ensure your frontend is built for production:

```bash
# Navigate to frontend directory
cd /Users/hdee/development/git/ecoroute-ai-platform/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Output folder: ./dist/
```

This creates a `dist` folder with optimized files ready to deploy.

### Step 3: Option A - Deploy Using GitHub Actions (Recommended)

**Create a GitHub Actions workflow for automatic deployment:**

1. Create file: `.github/workflows/deploy.yml`

2. Add this content:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    defaults:
      run:
        working-directory: ./frontend
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm install
      
      - name: Build frontend
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
          cname: yourdomain.com  # Only if using custom domain
```

3. Push this file to your repository
4. GitHub Actions will automatically deploy when you push to `main`

### Step 4: Option B - Manual Deployment (Simpler)

If you prefer manual control:

1. Build your project locally:
```bash
cd frontend
npm install
npm run build
```

2. Create or update `gh-pages` branch with build files:
```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

3. Add to `frontend/package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 5: Update vite.config.ts (Important!)

For project site (not user site), add base path:

```typescript
// frontend/vite.config.ts
export default {
  base: '/ecoroute-ai-platform/',  // Add this line
  plugins: [react()],
  // ... rest of config
}
```

This ensures all assets load correctly from the `/ecoroute-ai-platform/` subdirectory.

---

## Verify Your Website is Live

### Check Status

1. Go to your repository Settings → Pages
2. You should see a green checkmark with URL:
   ```
   Your site is live at https://YOUR_USERNAME.github.io/ecoroute-ai-platform
   ```

3. Click the URL to visit your live website!

### View Deployment History

1. In Settings → Pages
2. Scroll down to "Deployments"
3. Shows all past deployments with timestamps
4. Click on any deployment to see details

### Troubleshooting

**"Build fails after deployment"**
- Check GitHub Actions logs for errors
- Verify `npm install` and `npm run build` work locally first
- Check that vite.config.ts has correct base path

**"Website shows 404 errors"**
- Make sure base path in vite.config.ts matches your repository name
- Check that dist folder has index.html

**"Styles/Images not loading"**
- Check browser console (F12) for 404 errors
- Update asset paths to be relative, not absolute
- Ensure base path is correct in vite.config.ts

---

## Custom Domain Setup (Optional)

If you want `ecoroute.com` instead of `github.io`:

1. Buy domain from DNS provider (GoDaddy, Namecheap, etc.)
2. Settings → Pages → Custom domain
3. Enter: `ecoroute.com`
4. Your DNS provider will show instructions
5. Update DNS records pointing to GitHub

---

## Your Deployment Checklist

- [ ] Frontend builds locally without errors (`npm run build` works)
- [ ] vite.config.ts has correct base path: `/ecoroute-ai-platform/`
- [ ] GitHub Pages enabled in Settings → Pages
- [ ] Deploy workflow created or manual setup done
- [ ] Website URL: https://YOUR_USERNAME.github.io/ecoroute-ai-platform
- [ ] Visit URL and verify it works
- [ ] Check browser console for any errors (F12)
- [ ] Test responsive design on mobile

---

## Quick Summary

| Step | Action | URL |
|------|--------|-----|
| 1 | Enable GitHub Pages | Settings → Pages |
| 2 | Update vite.config.ts | Add base path |
| 3 | Create deploy workflow | .github/workflows/deploy.yml |
| 4 | Push to main branch | GitHub Actions deploys automatically |
| 5 | View live site | https://YOUR_USERNAME.github.io/ecoroute-ai-platform |

---

## Advanced: Monitor Deployment Status

**Real-time deployment status:**
1. Repository → Actions tab
2. Click "Deploy Frontend to GitHub Pages" workflow
3. Shows:
   - Build status (npm install, build)
   - Deployment progress
   - Logs for debugging

**Environment status:**
1. Settings → Environments
2. Shows "Production" environment
3. Displays last deployment time
4. Active URL for production site

---

## Next Steps After Deployment

1. ✅ Test your website thoroughly
2. ✅ Check all pages load correctly
3. ✅ Test API calls to backend (if backend also deployed)
4. ✅ Check responsive design on mobile
5. ✅ Share URL with others: `https://YOUR_USERNAME.github.io/ecoroute-ai-platform`

Congratulations! Your EcoRoute AI frontend is now live on the internet! 🚀

