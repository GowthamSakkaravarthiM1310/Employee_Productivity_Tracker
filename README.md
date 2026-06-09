# ProductivityHub: Employee Productivity Tracker

ProductivityHub is a modern, full-stack web application designed to track, measure, and analyze employee productivity based on outcomes and deliverables rather than just hours worked. It provides a comprehensive dashboard, task management, contribution logging, and collaboration tracking with a sleek, professional dark-themed UI.

## Features

- **Dashboard:** Get a high-level overview of team performance, total tasks, completed tasks, and active employees with interactive charts.
- **Employee Management:** Add and track employees, their roles, and their calculated productivity scores.
- **Task Tracking:** Assign tasks with difficulty levels, track status (Pending, In Progress, Completed), and monitor completion times.
- **Contributions:** Log individual contributions to specific tasks with detailed notes.
- **Collaborations:** Record when team members work together on tasks, fostering a collaborative environment.
- **Commit History:** Track code commits across repositories, associating them with employees and tasks.
- **Professional UI:** A fully responsive, dark-themed interface built with Tailwind CSS v4, featuring glassmorphism, fluid animations, and high-contrast accessibility.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS v4, Chart.js, Lucide Icons, React Router
- **Backend:** Node.js, Express.js
- **Database:** MySQL

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server

## Setup and Installation

### 1. Database Setup

1. Create a MySQL database named `sample`.
2. Execute the provided `schema.sql` (located in the root or `backend` folder) to create the necessary tables and seed initial data.
3. Ensure your MySQL server is running on the default port (3306) or update the database configuration in the backend.

### 2. Backend Setup

1. Navigate to the root directory (where `server.js` is located).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the database credentials in `db.js` if necessary (default: user `root`, password `password`).
4. Start the backend server:
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5174`.

## Project Structure

- `/frontend`: React application containing pages, components, context, and styling.
- `server.js`: Express backend server handling API routes.
- `db.js`: Database connection configuration.
- `schema.sql`: SQL script for database structure and sample data.

## License

This project was built for the CSE Hackathon 2026.
