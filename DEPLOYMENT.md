# Deployment Guide: GitHub → GCP Cloud Run (Free Tier)

This guide walks you through deploying the OmniCore ERP app to GCP Cloud Run using GitHub Actions for automated CI/CD.

## Prerequisites

1. **GitHub Account** - Create one at https://github.com
2. **GCP Account** - Free tier eligible at https://cloud.google.com/free
3. **Local Git** - Initialized in this project directory
4. **gcloud CLI** - Installed locally (for manual testing)

## Step 1: Initialize Git & Push to GitHub

```bash
# Initialize git (run from project root)
git init
git add .
git commit -m "Initial commit: OmniCore ERP application"

# Create repository on GitHub
# Visit: https://github.com/new
# Create a repo named "omnicore-erp" (or your preferred name)
# Do NOT initialize with README, .gitignore, or license

# Link and push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/omnicore-erp.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up GCP Project

```bash
# Create a new GCP project
gcloud projects create omnicore-erp-prod --name="OmniCore ERP"

# Set project as default
gcloud config set project omnicore-erp-prod

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable cloudkms.googleapis.com

# Create Artifact Registry repository
gcloud artifacts repositories create omnicore-erp \
  --repository-format=docker \
  --location=us-central1 \
  --description="OmniCore ERP Docker images"
```

## Step 3: Configure GitHub-GCP Integration (Workload Identity)

This uses Workload Identity Federation for secure, keyless authentication.

```bash
# Create a service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deploy SA"

# Grant Cloud Run Deploy permissions
gcloud projects add-iam-policy-binding omnicore-erp-prod \
  --member=serviceAccount:github-actions@omnicore-erp-prod.iam.gserviceaccount.com \
  --role=roles/run.admin

# Grant Artifact Registry permissions
gcloud projects add-iam-policy-binding omnicore-erp-prod \
  --member=serviceAccount:github-actions@omnicore-erp-prod.iam.gserviceaccount.com \
  --role=roles/artifactregistry.writer

# Set up Workload Identity Provider
gcloud iam workload-identity-pools create github \
  --project=omnicore-erp-prod \
  --location=global \
  --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc github \
  --project=omnicore-erp-prod \
  --location=global \
  --workload-identity-pool=github \
  --display-name="GitHub" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --issuer-uri=https://token.actions.githubusercontent.com \
  --attribute-condition="assertion.repository_owner == 'YOUR_GITHUB_USERNAME'"

# Get the Workload Identity Provider resource name
gcloud iam workload-identity-pools providers describe github \
  --project=omnicore-erp-prod \
  --location=global \
  --workload-identity-pool=github \
  --format='value(name)'
# Output: projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github

# Grant the service account permission to use Workload Identity
gcloud iam service-accounts add-iam-policy-binding github-actions@omnicore-erp-prod.iam.gserviceaccount.com \
  --project=omnicore-erp-prod \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/YOUR_GITHUB_USERNAME/omnicore-erp"
```

## Step 4: Add GitHub Secrets

In GitHub repository settings → Secrets and variables → Actions, add:

1. **GCP_PROJECT_ID**
   - Value: `omnicore-erp-prod`

2. **WIF_PROVIDER**
   - Value: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github`
   - (Replace PROJECT_NUMBER with your actual project number from `gcloud projects describe omnicore-erp-prod --format='value(projectNumber)'`)

3. **WIF_SERVICE_ACCOUNT**
   - Value: `github-actions@omnicore-erp-prod.iam.gserviceaccount.com`

4. **GEMINI_API_KEY**
   - Value: Your actual Gemini API key from https://aistudio.google.com/app/apikey
   - ⚠️ Keep this secret!

5. **APP_URL** (optional, for production URLs)
   - Value: Will be your Cloud Run URL after first deployment

## Step 5: Configure Cloud Run Autoscaling (Free Tier)

```bash
# Set up Cloud Run with free tier limits
# Free tier includes: 2 million requests/month, 360,000 GB-seconds/month

gcloud run deploy omnicore-erp \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --max-instances=1 \
  --memory=512Mi \
  --cpu=1
```

## Step 6: Deploy via GitHub Actions

Push code to trigger automatic deployment:

```bash
git add .
git commit -m "Set up GCP deployment"
git push origin main
```

Monitor deployment:
- Go to: `https://github.com/YOUR_USERNAME/omnicore-erp/actions`
- Watch the "Build and Deploy to Cloud Run" workflow
- Once complete, your app URL will be displayed

## Step 7: Verify Deployment

```bash
# Get service URL
gcloud run services describe omnicore-erp --region=us-central1 --format='value(status.url)'

# Test the service
curl https://omnicore-erp-XXXXXX.run.app
```

## Manual Deployment (Alternative)

If GitHub Actions fails:

```bash
# Build locally
docker build -t us-central1-docker.pkg.dev/omnicore-erp-prod/omnicore-erp/omnicore-erp:latest .

# Push to Artifact Registry
docker push us-central1-docker.pkg.dev/omnicore-erp-prod/omnicore-erp/omnicore-erp:latest

# Deploy
gcloud run deploy omnicore-erp \
  --image=us-central1-docker.pkg.dev/omnicore-erp-prod/omnicore-erp/omnicore-erp:latest \
  --region=us-central1 \
  --allow-unauthenticated
```

## GCP Free Tier Limits & Recommendations

**Monthly Quota (Free):**
- 2 million requests
- 360,000 GB-seconds (compute)
- 1 GB Cloud Storage (for logs)

**To stay under free tier:**
- Set `--max-instances=1` to avoid auto-scaling charges
- Keep memory at 512MB minimum
- Monitor usage in: GCP Console → Cloud Run → Metrics
- Set up budget alerts: GCP Console → Billing → Budgets

## Monitoring & Logs

```bash
# View recent logs
gcloud run logs read omnicore-erp --region=us-central1 --limit=50

# Stream logs (live)
gcloud run logs read omnicore-erp --region=us-central1 --follow
```

## Troubleshooting

**Build fails in GitHub Actions:**
- Check `.github/workflows/deploy.yml` for typos
- Verify all secrets are set correctly
- Run `npm run lint && npm run build` locally first

**Cloud Run deployment fails:**
- Check logs: `gcloud run logs read omnicore-erp --region=us-central1`
- Verify Docker image built successfully
- Ensure PORT environment variable is set to 3000

**App doesn't start:**
- Check that Dockerfile exposes port 3000
- Verify `serve` package is installed
- Test locally: `npm run build && serve -s dist -l 3000`

**Gemini API errors:**
- Verify GEMINI_API_KEY secret is set in GitHub
- Check API key is valid at https://aistudio.google.com/app/apikey
- Ensure Gemini API is enabled in GCP project

## Cost Tracking

Monitor costs here: https://console.cloud.google.com/billing/

Free tier typically covers:
- Small to medium apps with typical traffic
- Development and testing environments
- Low concurrent user loads

## Next Steps

1. ✅ Set up project locally with git
2. ✅ Create GitHub repository
3. ✅ Configure GCP project and Workload Identity
4. ✅ Add GitHub Secrets
5. ✅ Push to main branch to trigger deployment
6. ✅ Verify deployment and test app
7. Monitor usage and set up budget alerts
