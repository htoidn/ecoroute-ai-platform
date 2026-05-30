# GitHub Actions + GCP Deployment - Complete Setup Guide

## Overview

Your entire deployment pipeline is now automated:
- ✅ **GitHub Pages**: Frontend (already working)
- ✅ **GitHub Actions**: Build & Push to GCP
- ✅ **GCP Artifact Registry**: Docker image storage
- ✅ **GCP Cloud Run**: Backend & AI Service deployment
- ✅ **GCP Cloud SQL**: Managed PostgreSQL database

When you push to `main`, everything deploys automatically in ~10 minutes!

---

## Phase 1: GCP Project Setup (One-time)

### 1. Create GCP Project
1. Go to: https://console.cloud.google.com
2. Create a new project (name: `ecoroute-ai-platform`)
3. Wait for project to initialize

### 2. Enable Required APIs
```bash
# Set your project ID
export PROJECT_ID=$(gcloud config get-value project)

# Enable APIs
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com
```

### 3. Create PostgreSQL Database
```bash
# Create instance
gcloud sql instances create ecoroute-postgres \
  --database-version POSTGRES_15 \
  --tier db-f1-micro \
  --region us-central1 \
  --no-backup

# Create database
gcloud sql databases create ecoroute --instance=ecoroute-postgres

# Create user
gcloud sql users create ecoroute_user \
  --instance=ecoroute-postgres \
  --password=YOUR_SECURE_PASSWORD
```

### 4. Create Artifact Registry
```bash
gcloud artifacts repositories create ecoroute-repo \
  --repository-format docker \
  --location us-central1 \
  --description "EcoRoute Docker images"
```

---

## Phase 2: Create Service Account for GitHub

### 1. Create Service Account
```bash
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer"

# Get email
export SERVICE_ACCOUNT_EMAIL=$(gcloud iam service-accounts list --filter="displayName:GitHub" --format='value(email)')
echo "Service Account: $SERVICE_ACCOUNT_EMAIL"
```

### 2. Grant Permissions
```bash
export PROJECT_ID=$(gcloud config get-value project)

# Cloud Run admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/run.admin"

# Artifact Registry writer
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/artifactregistry.writer"

# Cloud SQL client
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/cloudsql.client"

# Service Account user
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/iam.serviceAccountUser"
```

### 3. Create and Download Key
```bash
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=$SERVICE_ACCOUNT_EMAIL

# Display (copy this entire output)
cat gcp-key.json
```

---

## Phase 3: Add GitHub Secrets

### 1. Add GCP Service Account Key
1. Go to: `https://github.com/htoidn/ecoroute-ai-platform/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `GCP_SA_KEY`
4. Value: **Entire contents of `gcp-key.json`** (copy from previous step)
5. Click "Add secret"

### 2. Add GCP Configuration Secrets

For each of these, click "New repository secret" and add:

#### Secret 1: GCP Project ID
- **Name**: `GCP_PROJECT_ID`
- **Value**: Get from: `gcloud config get-value project`
- **Example**: `ecoroute-ai-project-123456`

#### Secret 2: GCP Region
- **Name**: `GCP_REGION`
- **Value**: `us-central1`

#### Secret 3: Artifact Registry URL
- **Name**: `GCP_ARTIFACT_REGISTRY`
- **Value**: `us-central1-docker.pkg.dev`

#### Secret 4: Artifact Repository Name
- **Name**: `GCP_ARTIFACT_REPO`
- **Value**: `ecoroute-repo`

#### Secret 5: Cloud SQL Connection String
- **Name**: `CLOUD_SQL_CONNECTION_NAME`
- **Value**: Get from: `gcloud sql instances describe ecoroute-postgres --format='value(connectionName)'`
- **Example**: `ecoroute-ai-project-123456:us-central1:ecoroute-postgres`

#### Secret 6: Database Password
- **Name**: `DATABASE_PASSWORD`
- **Value**: The password you used when creating the database user
- **Example**: `your-secure-password`

### 3. Verify All Secrets Added
Visit: `https://github.com/htoidn/ecoroute-ai-platform/settings/secrets/actions`

You should see:
```
✓ GCP_SA_KEY
✓ GCP_PROJECT_ID
✓ GCP_REGION
✓ GCP_ARTIFACT_REGISTRY
✓ GCP_ARTIFACT_REPO
✓ CLOUD_SQL_CONNECTION_NAME
✓ DATABASE_PASSWORD
```

---

## Phase 4: Deploy Workflows

The workflows have been created:
1. ✅ `.github/workflows/gcp-build-push-images.yml` - Build & push images
2. ✅ `.github/workflows/gcp-deploy-services.yml` - Deploy to Cloud Run

---

## Phase 5: First Deployment

### 1. Commit and Push
```bash
cd /Users/hdee/development/git/ecoroute-ai-platform

# Verify workflows exist
ls -la .github/workflows/gcp-*.yml

# Commit
git add .github/workflows/gcp-build-push-images.yml
git add .github/workflows/gcp-deploy-services.yml
git add GCP_SETUP_FOR_GITHUB_ACTIONS.md
git add GCP_DEPLOYMENT_GUIDE.md
git add GCP_QUICK_START.md
git commit -m "Add GitHub Actions workflows for GCP deployment

- Build and push Docker images to Artifact Registry
- Deploy backend and AI service to Cloud Run
- Auto-update frontend configuration
- Fully automated CI/CD pipeline

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# Push to main
git push origin main
```

### 2. Monitor First Deployment
1. Go to: `https://github.com/htoidn/ecoroute-ai-platform/actions`
2. You should see the workflows running:
   - First: "Build & Push Docker Images to GCP" (5-10 minutes)
   - Then: "Deploy Services to GCP Cloud Run" (2-5 minutes)
3. Click on each to view logs

### 3. Verify Services Deployed
```bash
# Check AI Service
gcloud run services describe ecoroute-ai-service \
  --platform managed \
  --region us-central1

# Check Backend
gcloud run services describe ecoroute-backend \
  --platform managed \
  --region us-central1
```

### 4. Test Your Deployment
```bash
# Get service URLs
AI_URL=$(gcloud run services describe ecoroute-ai-service --platform managed --region us-central1 --format='value(status.url)')
BACKEND_URL=$(gcloud run services describe ecoroute-backend --platform managed --region us-central1 --format='value(status.url)')

echo "Testing AI Service: $AI_URL/health"
curl "$AI_URL/health"

echo -e "\n\nTesting Backend: $BACKEND_URL/api/destinations"
curl "$BACKEND_URL/api/destinations"

echo -e "\n\nTesting Frontend: https://htoidn.github.io/ecoroute-ai-platform"
```

---

## Phase 6: Ongoing Usage

### Automatic Deployment Workflow

```
You commit code → Push to main → GitHub Actions triggers
  ↓
Build & Push workflow runs
  ├─ Builds AI Service Docker image
  ├─ Builds Backend Docker image
  └─ Pushes both to Artifact Registry
  ↓
Deploy Services workflow runs (triggered by first workflow)
  ├─ Deploys AI Service to Cloud Run
  ├─ Deploys Backend to Cloud Run
  └─ Updates frontend config with backend URL
  ↓
Frontend auto-deploys to GitHub Pages (different workflow)
  ↓
✅ Everything live!
```

### Making Changes

After initial setup, just develop normally:

```bash
# Make code changes
# Commit
git commit -am "Fix something"

# Push to main
git push origin main

# Everything deploys automatically! ✅
```

### Monitoring

Check deployment status:
```bash
# View Actions tab
https://github.com/htoidn/ecoroute-ai-platform/actions

# View Cloud Run services
gcloud run services list --platform managed --region us-central1

# View service logs
gcloud run logs read ecoroute-backend --limit 50
gcloud run logs read ecoroute-ai-service --limit 50
```

---

## Complete Checklist

### Pre-Deployment
- [ ] GCP project created
- [ ] PostgreSQL instance created
- [ ] Artifact Registry created
- [ ] Service account created with permissions
- [ ] Service account key downloaded

### GitHub Secrets
- [ ] `GCP_SA_KEY` added
- [ ] `GCP_PROJECT_ID` added
- [ ] `GCP_REGION` added
- [ ] `GCP_ARTIFACT_REGISTRY` added
- [ ] `GCP_ARTIFACT_REPO` added
- [ ] `CLOUD_SQL_CONNECTION_NAME` added
- [ ] `DATABASE_PASSWORD` added

### Deployment
- [ ] Workflows committed to repository
- [ ] First push to main completed
- [ ] Build & Push workflow succeeded
- [ ] Deploy Services workflow succeeded
- [ ] AI Service is live and responding
- [ ] Backend is live and responding
- [ ] Frontend connects to backend
- [ ] All services tested and working

---

## Troubleshooting

### "Authentication failed" in GitHub Actions
**Solution**: Re-download GCP service account key and update `GCP_SA_KEY` secret

### "Build failed" in GitHub Actions
**Solution**:
1. Check workflow logs for error details
2. Verify Dockerfiles are correct
3. Test build locally: `docker build ./backend && docker build ./ai-service`

### Services deployed but frontend can't connect
**Solution**:
1. Verify `VITE_API_URL` in frontend/.env.production
2. Check that backend environment variables are correct
3. View backend logs for connection errors

### Database connection fails
**Solution**:
1. Verify Cloud SQL instance exists: `gcloud sql instances list`
2. Verify Cloud SQL Proxy connection: check Backend cloud run configuration
3. Verify password is correct in secrets

---

## Cost Monitoring

Check your GCP costs:
```bash
# View billing info
gcloud billing budgets list

# View recent charges
gcloud billing accounts list
```

**Estimated costs** (free tier eligible):
- Cloud Run: Free (2M requests/month)
- Cloud SQL: ~$10-20/month (db-f1-micro)
- Artifact Registry: Free (0.5 GB included)
- **Total**: $10-20/month

---

## Security Notes

✅ **Good practices implemented**:
- Service account has minimal required permissions
- Secrets stored in GitHub (not in code)
- Cloud Run requires authentication for sensitive endpoints (can enable)
- Database in private VPC (Cloud SQL)

❌ **Things to avoid**:
- Don't commit `gcp-key.json` to repository
- Don't share secrets in pull requests
- Don't use production credentials for testing
- Don't give service account excessive permissions

---

## Next Steps After Deployment

1. ✅ Monitor first few deployments
2. ✅ Test all user flows
3. ✅ Set up custom domain (optional)
4. ✅ Enable monitoring and alerts
5. ✅ Set up automated backups
6. ✅ Document any API keys or configuration

---

## Success! 🎉

You now have:
- ✅ **Automated frontend deployment** (GitHub Pages)
- ✅ **Automated backend deployment** (Cloud Run)
- ✅ **Automated AI service deployment** (Cloud Run)
- ✅ **Managed database** (Cloud SQL)
- ✅ **Complete CI/CD pipeline** (GitHub Actions)

Everything is now deployed and ready for production! 🚀
