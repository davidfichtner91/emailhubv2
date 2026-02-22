# Email Hub — Setup Guide

## Project structure

```
emailhub/
  index.html              ← the app
  netlify.toml            ← tells Netlify where functions live
  functions/
    push-campaign.js      ← server-side Klaviyo API calls
  README.md
```

---

## First-time setup

### 1. Create a private GitHub repo

1. Go to github.com → New repository
2. Name it `emailhub` (or anything you like)
3. Set it to **Private**
4. Don't add a README (you have this one)
5. Create repository

### 2. Push this folder to GitHub

Open Terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/emailhub.git
git push -u origin main
```

### 3. Connect to Netlify

1. Go to app.netlify.com
2. Click **Add new site → Import an existing project**
3. Choose **GitHub**, find your `emailhub` repo
4. Build settings — leave everything blank (no build command needed)
5. Click **Deploy site**

### 4. Add API keys as environment variables

In Netlify: **Site configuration → Environment variables → Add variable**

Add one variable per store:

| Key                  | Value                        |
|----------------------|------------------------------|
| `KLAVIYO_KEY_US`     | your US store private API key |
| `KLAVIYO_KEY_UK`     | your UK store private API key |
| `KLAVIYO_KEY_CZ`     | your CZ store private API key |
| `KLAVIYO_KEY_DE`     | your DE store private API key |
| `KLAVIYO_KEY_EU`     | your EU store private API key |
| `KLAVIYO_KEY_SG`     | your SG store private API key |

After adding variables, click **Trigger deploy** to redeploy with the new keys.

### 5. Done

Open your Netlify URL — the app is live and API calls will work.

---

## Updating the app

Any time you change a file:

```bash
git add .
git commit -m "describe your change"
git push
```

Netlify auto-deploys within ~30 seconds.

---

## API key format

Klaviyo private keys start with `pk_`. 

To create one: Klaviyo → Settings → API Keys → Create Private API Key  
Required scope: **Campaigns → Full Access**
