# Smart Job Tracker

A full-stack job tracker project for portfolio and GitHub. It includes a React frontend and an Express backend with file-based storage, so you can run it without MongoDB.

## Features
- Add jobs
- Update job status
- Delete jobs
- Dashboard stats
- Search and filter
- Clean UI for portfolio/demo

## Tech Stack
- Frontend: React, Axios, CSS
- Backend: Node.js, Express, CORS
- Storage: JSON file

## Project Structure
- `client` - React app
- `server` - Express API

## Run Locally

### 1. Backend
```bash
cd server
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend
```bash
cd client
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## GitHub Upload Commands
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/job-tracker-mern.git
git push -u origin main
```

## Resume Project Description
Built a full-stack Job Tracker application using React and Node.js with REST APIs for job management, status tracking, search, and dashboard analytics. Designed a clean responsive interface and integrated backend data persistence for real-world workflow simulation.
