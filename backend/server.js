const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// HELPER: Calculate Productivity Score
const calculateScore = (completedTasksCount, totalDifficulty, totalHours) => {
    if (!totalHours || totalHours === 0) return 0;
    // Formula: (Tasks Completed * Difficulty) / Time Spent
    // Here we use Average Difficulty for the formula to make sense or Sum of Difficulty? 
    // Spec says: (Task Completed * Difficulty) / Time Spent. 
    // Assuming "Task Completed" is count, but "Difficulty" varies. 
    // Let's interpret as: Sum(Difficulty of Completed Tasks) / Total Time Spent.
    // That basically means "Difficulty Points per Hour".
    return (totalDifficulty / totalHours).toFixed(2);
};

// ROUTES

// 1. DASHBOARD STATS
app.get('/api/dashboard', async (req, res) => {
    try {
        const [taskStats] = await db.query(`
            SELECT 
                COUNT(*) as total_tasks,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks
            FROM tasks
        `);

        const [empStats] = await db.query(`SELECT COUNT(*) as active_employees FROM employees`);

        const [contributions] = await db.query(`SELECT COUNT(*) as count FROM contributions`);

        const [collaborations] = await db.query(`SELECT COUNT(*) as count FROM collaborations`);

        // Charts Data
        const [tasksPerEmp] = await db.query(`
            SELECT e.name, COUNT(t.id) as task_count 
            FROM employees e 
            LEFT JOIN tasks t ON e.id = t.assigned_to 
            GROUP BY e.id
        `);

        res.json({
            stats: {
                totalTasks: taskStats[0].total_tasks,
                completedTasks: taskStats[0].completed_tasks,
                activeEmployees: empStats[0].active_employees,
                contributions: contributions[0].count,
                collaborations: collaborations[0].count
            },
            charts: {
                tasksPerEmployee: tasksPerEmp
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 2. EMPLOYEES (with Score)
app.get('/api/employees', async (req, res) => {
    try {
        // Fetch employees and their completed task stats
        const [rows] = await db.query(`
            SELECT 
                e.id, 
                e.name, 
                e.role, 
                COUNT(t.id) as completed_count,
                SUM(t.difficulty) as total_difficulty,
                SUM(TIMESTAMPDIFF(HOUR, t.start_time, t.end_time)) as total_hours
            FROM employees e
            LEFT JOIN tasks t ON e.id = t.assigned_to AND t.status = 'Completed'
            GROUP BY e.id
        `);

        const employees = rows.map(emp => ({
            ...emp,
            productivity_score: calculateScore(emp.completed_count, emp.total_difficulty || 0, emp.total_hours || 0)
        }));

        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/employees', async (req, res) => {
    const { name, role } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO employees (name, role) VALUES (?, ?)`,
            [name, role]
        );
        res.json({ id: result.insertId, name, role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. TASKS
app.get('/api/tasks', async (req, res) => {
    try {
        const [tasks] = await db.query(`
            SELECT t.*, e.name as assigned_to_name 
            FROM tasks t 
            LEFT JOIN employees e ON t.assigned_to = e.id
            ORDER BY t.created_at DESC
        `);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    const { title, assigned_to, difficulty, start_time, end_time, status } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO tasks (title, assigned_to, difficulty, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, assigned_to, difficulty, start_time || null, end_time || null, status || 'Pending']
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status, end_time } = req.body;
    try {
        await db.query(`UPDATE tasks SET status = ?, end_time = ? WHERE id = ?`, [status, end_time, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. CONTRIBUTIONS
app.get('/api/contributions', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, e.name as employee_name, t.title as task_title 
            FROM contributions c
            JOIN employees e ON c.employee_id = e.id
            JOIN tasks t ON c.task_id = t.id
            ORDER BY c.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/contributions', async (req, res) => {
    const { task_id, employee_id, notes } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO contributions (task_id, employee_id, notes) VALUES (?, ?, ?)`,
            [task_id, employee_id, notes]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. COLLABORATIONS
app.get('/api/collaborations', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, e1.name as emp1_name, e2.name as emp2_name, t.title as task_title 
            FROM collaborations c
            JOIN employees e1 ON c.employee1 = e1.id
            JOIN employees e2 ON c.employee2 = e2.id
            JOIN tasks t ON c.task_id = t.id
            ORDER BY c.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/collaborations', async (req, res) => {
    const { task_id, employee1, employee2, note } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO collaborations (task_id, employee1, employee2, note) VALUES (?, ?, ?, ?)`,
            [task_id, employee1, employee2, note]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. COMMITS
app.get('/api/commits', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, e.name as employee_name 
            FROM commits c
            JOIN employees e ON c.employee_id = e.id
            ORDER BY c.committed_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/commits', async (req, res) => {
    const { employee_id, commit_hash, message, repo_name, branch, additions, deletions, committed_at } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO commits (employee_id, commit_hash, message, repo_name, branch, additions, deletions, committed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [employee_id, commit_hash, message, repo_name, branch || 'main', additions || 0, deletions || 0, committed_at || new Date()]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
