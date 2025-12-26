# How to Deploy Ghostwriter's Ink to Vercel

Since I cannot run the deployment commands for you, here is a quick guide to deploy your app for free using Vercel. It will take about 2-3 minutes.

## 1. Create a GitHub Repository
1. Go to [GitHub.com](https://github.com/new).
2. Create a **new repository** (e.g., `ghostwriters-ink`).
3. Open your terminal in the project folder and run these commands to push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ghostwriters-ink.git
   git push -u origin main
   ```
   *(Replace `YOUR_USERNAME` with your actual GitHub username)*

## 2. Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** -> **"Project"**.
3. Select the **`ghostwriters-ink`** repository you just created.
4. Click **Import**.

## 3. Configure Environment Variables (Optional)
**Note**: The app now supports entering the API Key directly in the browser!
- If you set this variable, users won't be asked for a key (good for personal use).
- If you **don't** set it, any visitor will be asked to enter their own Google Gemini API Key.

1. On the "Configure Project" screen, look for **"Environment Variables"**.
2. (Optional) Add the following variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *(Paste your Google Gemini API Key)*
3. Click **Add**.

## 4. Finish
1. Click **Deploy**.
2. Wait about a minute. Vercel will build your site.
3. Once done, you will get a public URL (e.g., `https://ghostwriters-ink.vercel.app`).
4. **Done!** Your app is now live and can be shared with anyone.

---
**Note on Security**: Since this is a client-side app, your API key is technically exposed in the browser's network requests. For a personal project or demo, this is acceptable, but for a commercial product, you should eventually move the API calls to a backend server.
