# GitHub Hosting Guide

This project is a full-stack charity platform. GitHub is used for source control and repository management, but the actual live application should be deployed to hosting services for the frontend and backend.

## Recommended production architecture

- Frontend: Vercel or Netlify
- Backend API: Render, Railway, or Fly.io
- Database: MongoDB Atlas
- Version control: GitHub

This is the cleanest setup because the frontend is a Vite React app and the backend is an Express API.

---

## 1) Prepare the GitHub repository

1. Create a new repository on GitHub.
2. Push the project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. Keep your environment variables out of GitHub.
   - Use `.env` locally only.
   - Add `.env` to `.gitignore`.

---

## 2) Frontend hosting

### Option A: Vercel (recommended)

1. Go to https://vercel.com
2. Sign in with GitHub.
3. Import the repository.
4. Set the project root to the `client` folder.
5. Use these settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

Set environment variables in Vercel:

```env
VITE_API_URL=https://your-backend-url.com/api
```

If your frontend uses a direct API URL, make sure the app points to the deployed backend domain.

### Option B: Netlify

1. Connect the GitHub repo.
2. Set the base directory to `client`.
3. Build command:

```bash
npm run build
```

4. Publish directory:

```bash
dist
```

5. Add environment variable:

```env
VITE_API_URL=https://your-backend-url.com/api
```

### Option C: GitHub Pages

GitHub Pages is suitable only for static frontend hosting. This project is not a pure static site because it includes a Node/Express API and database-backed features.

Use GitHub Pages only if you plan to host the frontend as a static demo and keep the backend elsewhere.

---

## 3) Backend hosting

### Recommended: Render

1. Create a new Web Service on Render.
2. Connect the GitHub repository.
3. Set the service root to the `server` folder.
4. Build command:

```bash
npm install
```

5. Start command:

```bash
npm start
```

Add these environment variables in Render:

```env
PORT=5001
CLIENT_URL=https://your-frontend-url
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_secure_secret
COMPLIANCE_API_URL=https://your-compliance-provider.example.com/api/verification
COMPLIANCE_API_KEY=your_provider_key
```

The backend should expose the API on a live URL such as:

```text
https://your-app-name.onrender.com
```

Then update the frontend URL to call that backend.

---

## 4) MongoDB Atlas setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Whitelist your deployment IPs.
4. Copy the connection string.
5. Add it to the backend environment variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

---

## 5) Environment variable checklist

### Frontend

```env
VITE_API_URL=https://your-backend-url.com/api
```

### Backend

```env
PORT=5001
CLIENT_URL=https://your-frontend-url
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
COMPLIANCE_API_URL=https://your-compliance-provider.example.com/api/verification
COMPLIANCE_API_KEY=your_key
```

Do not commit these to GitHub.

---

## 6) Important note about GitHub hosting

GitHub is excellent for repository hosting and collaboration, but GitHub itself is not a full runtime host for this app.

This project needs:
- a frontend host for the React app
- a backend host for Express
- a MongoDB database

That is why the recommended production setup is:

GitHub + Vercel/Netlify + Render + MongoDB Atlas

---

## 7) Production deployment flow

1. Push code to GitHub.
2. Connect repo to Vercel/Netlify for frontend deployment.
3. Connect repo to Render for backend deployment.
4. Set environment variables on both deployments.
5. Test login, donations, volunteer workflows, and verification submissions.
6. Confirm the frontend uses the live backend URL and not localhost.

---

## 8) Useful commands

### Local development

```bash
npm run install:all
npm run dev
```

### Client only

```bash
cd client
npm run build
```

### Server only

```bash
cd server
npm start
```

---

## 9) Final recommendation

For a production-ready charity platform like this, the best path is:

- GitHub for code hosting
- Vercel for the frontend
- Render for the API
- MongoDB Atlas for the database

This gives you a clean, scalable, and low-maintenance deployment setup.
