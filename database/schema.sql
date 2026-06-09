CREATE DATABASE IF NOT EXISTS sample;
USE sample;

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL, -- URL for avatar image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    assigned_to INT,
    difficulty INT CHECK (difficulty BETWEEN 1 AND 5),
    start_time DATETIME DEFAULT NULL,
    end_time DATETIME DEFAULT NULL,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL
);

-- Contributions Table
CREATE TABLE IF NOT EXISTS contributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    employee_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Collaborations Table
CREATE TABLE IF NOT EXISTS collaborations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    employee1 INT,
    employee2 INT,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (employee1) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (employee2) REFERENCES employees(id) ON DELETE CASCADE
);

-- Commits Table (GitHub-style commit tracking)
CREATE TABLE IF NOT EXISTS commits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    commit_hash VARCHAR(40) NOT NULL,
    message VARCHAR(500) NOT NULL,
    repo_name VARCHAR(255) NOT NULL,
    branch VARCHAR(100) DEFAULT 'main',
    additions INT DEFAULT 0,
    deletions INT DEFAULT 0,
    committed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- SEED DATA

-- Employees (10 employees across different roles)
INSERT INTO employees (name, role) VALUES 
('Alice Johnson', 'Frontend Developer'),
('Bob Smith', 'Backend Developer'),
('Charlie Brown', 'UI/UX Designer'),
('Diana Prince', 'Project Manager'),
('Ethan Hunt', 'QA Engineer'),
('Fiona Garcia', 'Full Stack Developer'),
('George Kumar', 'DevOps Engineer'),
('Hannah Lee', 'Data Analyst'),
('Ivan Petrov', 'Mobile Developer'),
('Julia Chen', 'Technical Writer');

-- Tasks (20 tasks with varied statuses, difficulties, and assignments)
INSERT INTO tasks (title, assigned_to, difficulty, start_time, end_time, status) VALUES 
('Design Login Page', 3, 3, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 2 HOUR, 'Completed'),
('Setup Database Schema', 2, 4, NOW() - INTERVAL 10 HOUR, NOW() - INTERVAL 6 HOUR, 'Completed'),
('Implement API Auth', 2, 5, NOW() - INTERVAL 2 HOUR, NULL, 'In Progress'),
('Create Dashboard Components', 1, 3, NOW() - INTERVAL 3 HOUR, NULL, 'In Progress'),
('Test User Registration', 5, 2, NULL, NULL, 'Pending'),
('Fix Navbar Responsiveness', 1, 2, NOW() - INTERVAL 24 HOUR, NOW() - INTERVAL 20 HOUR, 'Completed'),
('Write API Documentation', 10, 3, NOW() - INTERVAL 8 HOUR, NOW() - INTERVAL 4 HOUR, 'Completed'),
('Optimize SQL Queries', 2, 4, NOW() - INTERVAL 6 HOUR, NULL, 'In Progress'),
('Design Icon Set', 3, 2, NOW() - INTERVAL 48 HOUR, NOW() - INTERVAL 40 HOUR, 'Completed'),
('Deploy to Staging', 7, 5, NOW() - INTERVAL 4 HOUR, NOW() - INTERVAL 1 HOUR, 'Completed'),
('Build Notification System', 6, 4, NOW() - INTERVAL 12 HOUR, NULL, 'In Progress'),
('Create Analytics Dashboard', 8, 5, NOW() - INTERVAL 20 HOUR, NOW() - INTERVAL 10 HOUR, 'Completed'),
('Setup CI/CD Pipeline', 7, 4, NOW() - INTERVAL 36 HOUR, NOW() - INTERVAL 28 HOUR, 'Completed'),
('Implement Push Notifications', 9, 3, NOW() - INTERVAL 5 HOUR, NULL, 'In Progress'),
('Write Unit Tests for Auth', 5, 3, NOW() - INTERVAL 15 HOUR, NOW() - INTERVAL 11 HOUR, 'Completed'),
('Design Onboarding Flow', 3, 3, NULL, NULL, 'Pending'),
('Refactor User Service', 6, 4, NOW() - INTERVAL 30 HOUR, NOW() - INTERVAL 24 HOUR, 'Completed'),
('Create Employee Report Page', 1, 3, NOW() - INTERVAL 9 HOUR, NOW() - INTERVAL 5 HOUR, 'Completed'),
('Build Export CSV Feature', 8, 2, NOW() - INTERVAL 3 HOUR, NULL, 'In Progress'),
('Review Security Audit', 4, 5, NULL, NULL, 'Pending');

-- Contributions (12 detailed contributions across different employees and tasks)
INSERT INTO contributions (task_id, employee_id, notes) VALUES 
(1, 3, 'Created high-fidelity mockups in Figma with dark-mode variant.'),
(2, 2, 'Designed normalized schema for users, tasks, and contributions tables.'),
(6, 1, 'Fixed mobile menu collapse issue using CSS grid and media queries.'),
(9, 3, 'Created 24 SVG icons for sidebar, navbar, and status indicators.'),
(7, 10, 'Wrote comprehensive API docs covering all 5 endpoints with examples.'),
(10, 7, 'Configured Docker containers and Nginx reverse proxy for staging.'),
(12, 8, 'Built interactive charts with Chart.js showing weekly productivity trends.'),
(13, 7, 'Set up GitHub Actions workflow with automated testing and deployment.'),
(15, 5, 'Wrote 18 unit tests covering login, signup, and token refresh flows.'),
(17, 6, 'Refactored user service into modular layers: controller, service, repository.'),
(18, 1, 'Built responsive employee report page with sortable columns and filters.'),
(11, 6, 'Implemented real-time WebSocket notifications for task status changes.');

-- Collaborations (8 team collaborations across various tasks)
INSERT INTO collaborations (task_id, employee1, employee2, note) VALUES 
(3, 2, 1, 'Paired on JWT token structure and secure cookie implementation.'),
(1, 3, 4, 'Reviewed login page design requirements and accessibility standards.'),
(10, 7, 2, 'Coordinated database migration strategy for staging deployment.'),
(12, 8, 1, 'Integrated analytics dashboard charts with frontend components.'),
(11, 6, 9, 'Synced notification system design between web and mobile platforms.'),
(13, 7, 5, 'Configured test pipeline stages and code coverage thresholds.'),
(17, 6, 2, 'Discussed service layer patterns and dependency injection approach.'),
(14, 9, 3, 'Collaborated on push notification UI design for mobile app.');

-- Commits (15 GitHub-style commits across employees)
INSERT INTO commits (employee_id, commit_hash, message, repo_name, branch, additions, deletions, committed_at) VALUES 
(1, 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', 'feat: add responsive dashboard layout with grid system', 'csehack/frontend', 'main', 245, 32, NOW() - INTERVAL 2 HOUR),
(1, 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', 'fix: resolve navbar collapse on mobile viewport', 'csehack/frontend', 'fix/navbar', 18, 7, NOW() - INTERVAL 20 HOUR),
(2, 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', 'feat: implement JWT auth middleware with refresh tokens', 'csehack/backend', 'feature/auth', 312, 5, NOW() - INTERVAL 3 HOUR),
(2, 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3', 'refactor: optimize SQL queries with indexing', 'csehack/backend', 'main', 47, 89, NOW() - INTERVAL 8 HOUR),
(3, 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4', 'feat: design new icon set for sidebar navigation', 'csehack/design-system', 'main', 180, 0, NOW() - INTERVAL 40 HOUR),
(3, 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5', 'feat: add login page mockup with dark mode styles', 'csehack/frontend', 'feature/login', 156, 12, NOW() - INTERVAL 4 HOUR),
(5, 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6', 'test: add unit tests for authentication flow', 'csehack/backend', 'test/auth', 290, 15, NOW() - INTERVAL 12 HOUR),
(6, 'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7', 'refactor: modularize user service into layered architecture', 'csehack/backend', 'refactor/user-service', 420, 310, NOW() - INTERVAL 26 HOUR),
(6, 'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8', 'feat: build real-time notification system with WebSocket', 'csehack/backend', 'feature/notifications', 198, 22, NOW() - INTERVAL 10 HOUR),
(7, 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9', 'ci: setup GitHub Actions CI/CD pipeline', 'csehack/devops', 'main', 85, 0, NOW() - INTERVAL 30 HOUR),
(7, 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0', 'feat: configure Docker and Nginx for staging deploy', 'csehack/devops', 'feature/staging', 134, 28, NOW() - INTERVAL 2 HOUR),
(8, 'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', 'feat: create analytics dashboard with Chart.js', 'csehack/frontend', 'feature/analytics', 350, 45, NOW() - INTERVAL 14 HOUR),
(9, 'a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', 'feat: implement push notification handler for mobile', 'csehack/mobile', 'feature/push', 210, 30, NOW() - INTERVAL 5 HOUR),
(10, 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', 'docs: write comprehensive API documentation', 'csehack/docs', 'main', 480, 0, NOW() - INTERVAL 6 HOUR),
(4, 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', 'chore: update project roadmap and sprint planning docs', 'csehack/docs', 'main', 65, 20, NOW() - INTERVAL 1 HOUR);
