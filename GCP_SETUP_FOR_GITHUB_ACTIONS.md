# GCP Setup for GitHub Actions Automation

This guide explains how to set up GitHub Actions to automatically build, push, and deploy your services to GCP.

---

## Overview

When you push to `main`, GitHub Actions will:
1. Build Docker images for backend and AI service
2. Push them to GCP Artifact Registry
3. Deploy them to Cloud Run
4. Update your frontend configuration
5. All in ~10 minutes, fully automated!

---

## Prerequisites

Before setting up workflows, you need:
1. GCP project created
2. Service Account with proper permissions
3. GitHub repository secrets configured

---

## Step 1: Create GCP Service Account

### 1.1 Create Service Account
```bash
# Set your project ID
export PROJECT_ID=$(gcloud config get-value project)

# Create service account
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer"

# Get service account email
export SERVICE_ACCOUNT_EMAIL=$(gcloud iam service-accounts list --filter="displayName:GitHub" --format='value(email)')

echo "Service Account: $SERVICE_ACCOUNT_EMAIL"
```

### 1.2 Grant Necessary Permissions

```bash
# Cloud Run admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/run.admin"

# Artifact Registry writer
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/artifactregistry.writer"

# Cloud SQL client (for connection)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/cloudsql.client"

# Service Account user
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/iam.serviceAccountUser"
```

### 1.3 Create and Download Key

```bash
# Create key file
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=$SERVICE_ACCOUNT_EMAIL

# Show content (you'll need to copy this)
cat gcp-key.json
```

**Important**: Save the `gcp-key.json` file securely. You'll use it in the next step.

---

## Step 2: Add GitHub Repository Secrets

Go to your GitHub repository settings and add these secrets:

### 2.1 Add GCP Credentials
1. Go to: `https://github.com/htoidn/ecoroute-ai-platform/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `GCP_SA_KEY`
4. Value: Paste the entire contents of `gcp-key.json`
5. Click "Add secret"

### 2.2 Add Project Configuration
Add these secrets with your actual values:

| Name | Value | Example |
|------|-------|---------|
| `GCP_PROJECT_ID` | Your GCP project ID | `ecoroute-ai-project-123` |
| `GCP_REGION` | GCP region | `us-central1` |
| `GCP_ARTIFACT_REGISTRY` | Registry location | `us-central1-docker.pkg.dev` |
| `GCP_ARTIFACT_REPO` | Repository name | `ecoroute-repo` |
| `CLOUD_SQL_CONNECTION_NAME` | SQL connection string | `project:us-central1:ecoroute-postgres` |
| `DATABASE_PASSWORD` | PostgreSQL password | `your-secure-password` |

### 2.3 GitHub Token (Automatic)
`GITHUB_TOKEN` is automatically available in GitHub Actions - no need to add.

---

## Step 3: Verify Secrets Are Added

```bash
# Verify by going to:
https://github.com/htoidn/ecoroute-ai-platform/settings/secrets/actions

# You should see:
# ✓ GCP_SA_KEY
# ✓ GCP_PROJECT_ID
# ✓ GCP_REGION
# ✓ GCP_ARTIFACT_REGISTRY
# ✓ GCP_ARTIFACT_REPO
# ✓ CLOUD_SQL_CONNECTION_NAME
# ✓ DATABASE_PASSWORD
```

---

## Step 4: How to Find Your Values

### Get Project ID
```bash
gcloud config get-value project
```

### Get Cloud SQL Connection Name
```bash
gcloud sql instances describe ecoroute-postgres --format='value(connectionName)'
```

### Get Artifact Registry Name
```bash
gcloud artifacts repositories list --format='value(name)'
```

---

## Step 5: Workflow Triggers

The workflows will automatically run on:

### On Every Push to Main
- ✅ Builds both images
- ✅ Pushes to Artifact Registry
- ✅ Deploys to Cloud Run
- ✅ Updates frontend config

### On Pull Request to Main
- ✅ Builds both images (for testing)
- ❌ Does NOT deploy to GCP

### Manual Trigger (Optional)
- You can trigger manually via GitHub Actions tab

---

## Step 6: Monitor Deployments

### View Workflow Status
1. Go to: `https://github.com/htoidn/ecoroute-ai-platform/actions`
2. Click on the workflow run
3. Watch build and deployment progress
4. View logs for any errors

### View Cloud Run Status
```bash
# View backend logs
gcloud run logs read ecoroute-backend --limit 50

# View AI service logs
gcloud run logs read ecoroute-ai-service --limit 50
```

---

## Troubleshooting

### "Permission denied" Error
**Problem**: Service account doesn't have required permissions
**Solution**: 
```bash
# Re-run the grant permissions step
# Make sure all roles are added
```

### "Authentication failed"
**Problem**: GCP_SA_KEY secret is invalid
**Solution**:
1. Download fresh key: `gcloud iam service-accounts keys create gcp-key.json --iam-account=...`
2. Update GCP_SA_KEY secret in GitHub

### Build fails locally but works in actions
**Problem**: Your local Docker build has issues
**Solution**:
1. Test build locally first
2. Check Dockerfile exists
3. Verify all dependencies are listed

### Deployment succeeds but service doesn't work
**Problem**: Environment variables not set correctly
**Solution**:
1. Check GitHub Actions logs for deployed env vars
2. View Cloud Run service configuration
3. Verify secrets match what service expects

---

## Security Best Practices

✅ **DO:**
- Rotate service account keys regularly
- Use GitHub repository secrets (not environment variables)
- Restrict service account to minimum permissions needed
- Review logs for unusual activity

❌ **DON'T:**
- Commit `gcp-key.json` to repository
- Share secrets in pull requests
- Use production passwords in code
- Give service account excessive permissions

---

## Next Steps

1. ✅ Create service account (Step 1)
2. ✅ Add GitHub secrets (Step 2)
3. ✅ Deploy workflows (provided in separate files)
4. ✅ Push to main and watch it deploy automatically!

Your infrastructure will be managed entirely through GitHub Actions - no manual `gcloud` commands needed after this setup!

---

## Useful Commands

```bash
# List service accounts
gcloud iam service-accounts list

# View service account permissions
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --format='table(bindings.role)' \
  --filter="bindings.members:github-actions-deployer"

# Rotate service account key
gcloud iam service-accounts keys list --iam-account=$SERVICE_ACCOUNT_EMAIL
gcloud iam service-accounts keys create gcp-key-new.json --iam-account=$SERVICE_ACCOUNT_EMAIL

# Delete old key (after updating GitHub secret)
gcloud iam service-accounts keys delete KEY_ID --iam-account=$SERVICE_ACCOUNT_EMAIL
```

---

## Complete Checklist

- [ ] GCP project created
- [ ] Service account created
- [ ] Service account permissions granted
- [ ] Service account key downloaded
- [ ] GCP_SA_KEY added to GitHub secrets
- [ ] GCP_PROJECT_ID added to GitHub secrets
- [ ] GCP_REGION added to GitHub secrets
- [ ] GCP_ARTIFACT_REGISTRY added to GitHub secrets
- [ ] GCP_ARTIFACT_REPO added to GitHub secrets
- [ ] CLOUD_SQL_CONNECTION_NAME added to GitHub secrets
- [ ] DATABASE_PASSWORD added to GitHub secrets
- [ ] Workflows deployed to repository
- [ ] First push to main triggers workflows
- [ ] Services deployed successfully
- [ ] Frontend connects to backend
- [ ] All tests pass

**Estimated time**: 15-20 minutes for setup
