# EcoRoute AI Platform - GCP Deployment Guide

## Architecture Overview

Your full-stack application will be deployed on GCP using:

- **Frontend**: GitHub Pages (already set up)
- **Backend**: Cloud Run (Java/Spring Boot)
- **AI Service**: Cloud Run (Python)
- **Database**: Cloud SQL (PostgreSQL)
- **Image Registry**: Artifact Registry or Container Registry

---

## Prerequisites

1. **GCP Account**: https://cloud.google.com (free tier available)
2. **Google Cloud CLI**: `gcloud` command-line tool
3. **Docker**: Already have it locally
4. **Project Setup**:
   - Create a new GCP Project
   - Enable APIs: Cloud Run, Cloud SQL, Artifact Registry
   - Set up billing account

---

## Step 1: Initial GCP Setup

### 1.1 Install Google Cloud CLI
```bash
# Download from: https://cloud.google.com/sdk/docs/install
# Or use Homebrew (macOS)
brew install --cask google-cloud-sdk

# Initialize
gcloud init

# Authenticate
gcloud auth login

# Set default project
gcloud config set project YOUR_PROJECT_ID
```

### 1.2 Enable Required APIs
```bash
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudkms.googleapis.com \
  compute.googleapis.com
```

### 1.3 Create Cloud SQL PostgreSQL Instance
```bash
gcloud sql instances create ecoroute-postgres \
  --database-version POSTGRES_15 \
  --tier db-f1-micro \
  --region us-central1 \
  --no-backup
```

### 1.4 Create Database & User
```bash
# Create database
gcloud sql databases create ecoroute \
  --instance=ecoroute-postgres

# Create user
gcloud sql users create ecoroute_user \
  --instance=ecoroute-postgres \
  --password=YOUR_SECURE_PASSWORD
```

---

## Step 2: Set Up Artifact Registry

### 2.1 Create Registry
```bash
gcloud artifacts repositories create ecoroute-repo \
  --repository-format docker \
  --location us-central1 \
  --description "EcoRoute Docker images"
```

### 2.2 Configure Docker Authentication
```bash
# Set up authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

---

## Step 3: Build & Push Docker Images to GCP

### 3.1 Build and Push AI Service
```bash
cd /Users/hdee/development/git/ecoroute-ai-platform

# Tag AI service image
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/ecoroute-repo/ai-service:latest ./ai-service

# Push to Artifact Registry
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/ecoroute-repo/ai-service:latest
```

### 3.2 Build and Push Backend Service
```bash
# Tag backend image
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/ecoroute-repo/backend:latest ./backend

# Push to Artifact Registry
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/ecoroute-repo/backend:latest
```

---

## Step 4: Deploy AI Service to Cloud Run

```bash
gcloud run deploy ecoroute-ai-service \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/ecoroute-repo/ai-service:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --timeout 3600 \
  --allow-unauthenticated \
  --set-env-vars="PORT=8000"
```

**Note**: You'll get a service URL like:
```
https://ecoroute-ai-service-XXXXX-uc.a.run.app
```

---

## Step 5: Deploy Backend to Cloud Run

### 5.1 Get Cloud SQL Connection String
```bash
# Get instance connection name
gcloud sql instances describe ecoroute-postgres --format='value(connectionName)'

# Output: PROJECT_ID:us-central1:ecoroute-postgres
```

### 5.2 Deploy Backend
```bash
# Set environment variables for backend
export AI_SERVICE_URL="https://ecoroute-ai-service-XXXXX-uc.a.run.app"
export SQL_CONNECTION_NAME="PROJECT_ID:us-central1:ecoroute-postgres"

gcloud run deploy ecoroute-backend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/ecoroute-repo/backend:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --timeout 3600 \
  --allow-unauthenticated \
  --add-cloudsql-instances $SQL_CONNECTION_NAME \
  --set-env-vars="SPRING_DATASOURCE_URL=jdbc:postgresql://127.0.0.1:5432/ecoroute,SPRING_DATASOURCE_USERNAME=ecoroute_user,SPRING_DATASOURCE_PASSWORD=YOUR_SECURE_PASSWORD,AI_SERVICE_URL=$AI_SERVICE_URL,SPRING_PROFILES_ACTIVE=gcp"
```

**You'll get a backend URL like**:
```
https://ecoroute-backend-XXXXX-uc.a.run.app
```

---

## Step 6: Update Frontend to Use Cloud Backend

Update your frontend environment variables to point to cloud backend:

```bash
# frontend/.env.production
VITE_API_URL=https://ecoroute-backend-XXXXX-uc.a.run.app
```

Rebuild and push to main:
```bash
cd frontend
npm run build:gh-pages
git add .env.production
git commit -m "Update backend URL for GCP deployment"
git push origin main
```

---

## Step 7: Verify Deployment

### 7.1 Test AI Service
```bash
curl https://ecoroute-ai-service-XXXXX-uc.a.run.app/health
```

### 7.2 Test Backend
```bash
curl https://ecoroute-backend-XXXXX-uc.a.run.app/api/destinations
```

### 7.3 Test Frontend
Visit: `https://htoidn.github.io/ecoroute-ai-platform`

---

## Important: Dockerfiles Must Be Updated for GCP

### AI Service Dockerfile Adjustments
Make sure `ai-service/Dockerfile` has:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Listen on port 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Backend Dockerfile Adjustments
Make sure `backend/Dockerfile` has:
```dockerfile
FROM eclipse-temurin:21-jre-alpine
COPY build/libs/ecoroute-backend*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## Cost Estimates (GCP Free Tier Eligible)

- **Cloud Run**: 2M requests/month free
- **Cloud SQL**: db-f1-micro free tier (limited)
- **Artifact Registry**: 0.50 GB free storage
- **Total estimated monthly cost**: $0-20 (depends on usage)

---

## Scaling & Advanced Options

### Auto-scaling
Cloud Run auto-scales based on traffic - no additional config needed.

### Custom Domain
```bash
gcloud run services update ecoroute-backend \
  --platform managed \
  --region us-central1 \
  --update-env-vars CUSTOM_DOMAIN=api.yourdomain.com
```

### Database Backups
```bash
gcloud sql backups create \
  --instance ecoroute-postgres
```

---

## Troubleshooting

**"Build failed"**
- Check Dockerfile syntax
- Verify dependencies are correct
- Test locally first: `docker build .`

**"Service won't start"**
- Check logs: `gcloud run logs read ecoroute-backend --limit 50`
- Verify environment variables
- Check database connection

**"Database connection error"**
- Verify Cloud SQL Proxy is running
- Check connection string format
- Verify user/password credentials

---

## Complete Deployment Checklist

- [ ] GCP project created
- [ ] Required APIs enabled
- [ ] Cloud SQL PostgreSQL created
- [ ] Artifact Registry set up
- [ ] Docker images built and pushed
- [ ] AI Service deployed to Cloud Run
- [ ] Backend deployed to Cloud Run
- [ ] Frontend environment variables updated
- [ ] All services tested and working
- [ ] Frontend pushed to main (auto-deploys)

---

## Deployed URLs

| Service | URL |
|---------|-----|
| Frontend | https://htoidn.github.io/ecoroute-ai-platform |
| Backend API | https://ecoroute-backend-XXXXX-uc.a.run.app |
| AI Service | https://ecoroute-ai-service-XXXXX-uc.a.run.app |

---

## Next Steps

1. Complete prerequisites and GCP account setup
2. Run steps 1-5 above
3. Update frontend with backend URL
4. Test all three services
5. Monitor costs in GCP Console

Estimated time: 30-45 minutes for complete setup
