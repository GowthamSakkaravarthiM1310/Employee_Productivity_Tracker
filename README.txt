CSEHACKATHON - Employee Productivity Tracker
============================================

A professional web application to track employee productivity based on outcomes, not surveillance.

FOLDER STRUCTURE
----------------
/backend  - Node.js + Express API
/frontend - React + Vite Frontend
/database - MySQL Schema and Seed Data

PREREQUISITES
-------------
- Node.js (v14 or higher)
- MySQL Server

HOW TO RUN
----------

1. DATABASE SETUP
   - Open your MySQL client (e.g., MySQL Workbench, command line).
   - Create a new database named `cseh_db`.
   - Run the script in `database/schema.sql` to create tables and insert seed data.
   - Update `backend/db.js` with your MySQL credentials if they differ from default (user: root, pass: password).

2. BACKEND SETUP
   - Open a terminal.
   - Navigate to the backend folder:
     cd backend
   - Install dependencies:
     npm install
   - Start the server:
     npm start
   - Server runs on http://localhost:5000

3. FRONTEND SETUP
   - Open a NEW terminal.
   - Navigate to the frontend folder:
     cd frontend
   - Install dependencies:
     npm install
   - Start the development server:
     npm run dev
   - Open the link shown (usually http://localhost:5173) in your browser.

FEATURES
--------
- Dashboard with key metrics and charts.
- Task Management (Assign, Track Time, Difficulty).
- Employee List with Productivity Scores.
- Contributions & Collaboration tracking.
- Light/Dark Mode Toggle.

TECH STACK
----------
- Frontend: React, Vite, TailwindCSS
- Backend: Node.js, Express
- Database: MySQL
