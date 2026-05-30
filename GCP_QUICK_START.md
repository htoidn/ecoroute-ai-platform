# GCP Deployment - Quick Start (30 minutes)

## 🎯 End Goal
- Frontend: GitHub Pages (✅ already setup)
- Backend: GCP Cloud Run
- AI Service: GCP Cloud Run
- Database: GCP Cloud SQL

---

## ⚡ Quick Commands

### 1. GCP Initial Setup (5 min)
```bash
# Install Google Cloud CLI
brew install --cask google-cloud-sdk
gcloud init
gcloud auth login

# Enable services
gcloud services enable run.googleapis.com sql-component.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com

# Set project ID
gcloud config set project YOUR_PROJECT_ID
```

### 2. Database Setup (5 min)
```bash
# Create PostgreSQL instance
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

### 3. Docker Registry Setup (3 min)
```bash
# Create Artifact Registry
gcloud artifacts repositories create ecoroute-repo \
  --repository-format docker \
  --location us-central1

# Configure Docker auth
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### 4. Build & Push Images (10 min)
```bash
cd /Users/hdee/development/git/ecoroute-ai-platform

# Replace YOUR_PROJECT_ID with actual ID
PROJECT_ID=$(gcloud config get-value project)

# Push AI service
docker build -t us-central1-docker.pkg.dev/$PROJECT_ID/ecoroute-repo/ai-service:latest ./ai-service
docker push us-central1-docker.pkg.dev/$PROJECT_ID/ecoroute-repo/ai-service:latest

# Push backend
docker build -t us-central1-docker.pkg.dev/$PROJECT_ID/ecoroute-repo/backend:latest ./backend
docker push us-central1-docker.pkg.dev/$PROJECT_ID/ecoroute-repo/backend:latest
```

### 5. Deploy AI Service (2 min)
```bash
gcloud run deploy ecoroute-ai-service \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/ecoroute-repo/ai-service:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --allow-unauthenticated \
  --set-env-vars="PORT=8000"
```

**Save the AI Service URL you get** (like: `https://ecoroute-ai-service-XXXXX-uc.a.run.app`)

### 6. Deploy Backend (2 min)
```bash
# Get database connection name
SQL_CONNECTION=$(gcloud sql instances describe ecoroute-postgres --format='value(connectionName)')
AI_SERVICE_URL="YOUR_AI_SERVICE_URL_FROM_STEP_5"

gcloud run deploy ecoroute-backend \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/ecoroute-repo/backend:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --allow-unauthenticated \
  --add-cloudsql-instances $SQL_CONNECTION \
  --set-env-vars="SPRING_DATASOURCE_URL=jdbc:postgresql://127.0.0.1:5432/ecoroute,SPRING_DATASOURCE_USERNAME=ecoroute_user,SPRING_DATASOURCE_PASSWORD=YOUR_SECURE_PASSWORD,AI_SERVICE_URL=$AI_SERVICE_URL,SPRING_PROFILES_ACTIVE=gcp"
```

**Save the Backend URL you get** (like: `https://ecoroute-backend-XXXXX-uc.a.run.app`)

### 7. Update & Deploy Frontend (3 min)
```bash
# Update backend URL in frontend
echo "VITE_API_URL=YOUR_BACKEND_URL_FROM_STEP_6" >> /Users/hdee/development/git/ecoroute-ai-platform/frontend/.env.production

# Push to main (auto-deploys to GitHub Pages)
cd /Users/hdee/development/git/ecoroute-ai-platform
git add frontend/.env.production
git commit -m "Update backend URL for GCP deployment"
git push origin main
```

---

## ✅ Verify Everything Works

```bash
# Test AI Service
curl https://ecoroute-ai-service-XXXXX-uc.a.run.app/health

# Test Backend
curl https://ecoroute-backend-XXXXX-uc.a.run.app/api/destinations

# Test Frontend (open in browser)
https://htoidn.github.io/ecoroute-ai-platform
```

---

## 🔑 Important Notes

- Replace `YOUR_PROJECT_ID` with your actual GCP project ID
- Replace `YOUR_SECURE_PASSWORD` with a strong password
- Cloud Run free tier: 2M requests/month
- Database free tier: limited to db-f1-micro
- Estimated cost: $0-20/month

---

## 📋 Environment Variables Summary

| Service | Variable | Value |
|---------|----------|-------|
| Backend | SPRING_DATASOURCE_URL | jdbc:postgresql://127.0.0.1:5432/ecoroute |
| Backend | SPRING_DATASOURCE_USERNAME | ecoroute_user |
| Backend | SPRING_DATASOURCE_PASSWORD | YOUR_SECURE_PASSWORD |
| Backend | AI_SERVICE_URL | https://ecoroute-ai-service-XXXXX-uc.a.run.app |
| Frontend | VITE_API_URL | https://ecoroute-backend-XXXXX-uc.a.run.app |

---

## ⏱️ Timeline
- ⏱️ 5 min: GCP setup
- ⏱️ 5 min: Database
- ⏱️ 3 min: Registry
- ⏱️ 10 min: Build & push
- ⏱️ 2 min: AI Service
- ⏱️ 2 min: Backend
- ⏱️ 3 min: Frontend
- **Total: ~30 minutes**

Ready? Let's deploy! 🚀
