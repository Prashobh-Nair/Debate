# Deployment & API Key Guide

When deploying this project (to Vercel, Netlify, Render, etc.), you shouldn't upload your literal `.env` file because putting API keys on GitHub can lead to them being compromised and terminated. 

Instead, follow these steps:

## 1. Commit Your Code Safely
Your actual `.env` file is already added to `.gitignore`, meaning it **will not** be uploaded to GitHub.
If you have previously committed your `.env` file by mistake, its history might still be on GitHub. If your key gets revoked, simply generate a new key and update your local `.env`. do **NOT** try to commit the new key to GitHub!

## 2. Generate New API Keys
Because your old key was terminated, you must create a new one from your AI provider (e.g., OpenRouter or Qubrid) and update your local `.env` file:
```env
OPENROUTER_API_KEY=your_new_key_here
PORT=3001
QUBRID_API_KEY=your_new_key_here
```

## 3. Configure Environment Variables in Production
When hosting your website, you must provide the API keys to the hosting provider's dashboard directly.

**For Vercel:**
1. Go to your Project Settings > **Environment Variables**.
2. Add the variables defined in `.env.example`:
   - Key: `OPENROUTER_API_KEY` | Value: `your_new_key`
   - Key: `QUBRID_API_KEY` | Value: `your_new_key`
3. Hit Save and trigger a new deployment.

**For Netlify / Render / Heroku / etc.:**
Look for the "Environment Variables" or "Config Vars" section in the project settings and copy the keys identically to how they appear in `.env.example`.

By injecting the variables through the hosting platform, your code can read them securely through `process.env` without ever exposing them to the public internet or your GitHub repository!
