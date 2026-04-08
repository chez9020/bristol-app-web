---
description: Deploy the Bristol App to Google Cloud Run
---

## Prerequisites (run once, one-time setup)

Make sure gcloud CLI is installed and authenticated:

```
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

Verify you're using the right project:

```
gcloud config get project
```

---

## Deploy Steps

### Step 1 — Build the React frontend

Run from the `frontend/` folder:

```
npm run build
```

### Step 2 — Deploy to Cloud Run

Run from the **project root** (`bristol-app-web/`), where the Dockerfile is:

```
gcloud run deploy bristol-app --source . --region northamerica-south1 --allow-unauthenticated --memory 512Mi --cpu 1 --max-instances 10 --concurrency 80
```

What this command does:

- Uploads your code to Google Cloud Build
- Builds the Docker image (Node → Python, two stages)
- Pushes the image to Artifact Registry automatically
- Deploys it to Cloud Run in Mexico region
- Returns the public URL of your app

---

## Re-deploy after changes (day-to-day flow)

Every time you make changes and want to push to production:

```
cd c:\Users\ejjommz\Documents\apps\bristol-app-web\frontend
npm run build
cd ..
gcloud run deploy bristol-app --source . --region northamerica-south1 --allow-unauthenticated
```

---

## Useful commands

Check the status of your service:

```
gcloud run services describe bristol-app --region northamerica-south1
```

View live logs (useful for debugging):

```
gcloud run services logs read bristol-app --region northamerica-south1 --limit 50
```

Open the app URL directly:

```
gcloud run services describe bristol-app --region northamerica-south1 --format="value(status.url)"
```
