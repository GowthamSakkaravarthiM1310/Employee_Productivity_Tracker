import React, { useEffect, useState } from 'react';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import api from '../utils/api';

const CopilotTaskAgent = () => {
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, taskRes] = await Promise.all([
                    api.get('/employees'),
                    api.get('/tasks')
                ]);
                setEmployees(empRes.data);
                setTasks(taskRes.data);
            } catch (err) {
                console.error('Failed to load data for copilot:', err);
            }
        };
        fetchData();
    }, []);

    // Provide employee context to the copilot
    useCopilotReadable({
        description: "List of all employees in the system with their IDs, names, and roles",
        value: employees.map(e => ({ id: e.id, name: e.name, role: e.role }))
    });

    // Provide task context to the copilot
    useCopilotReadable({
        description: "List of all current tasks with their IDs, titles, assigned employee names, difficulty, and status",
        value: tasks.map(t => ({
            id: t.id,
            title: t.title,
            assigned_to: t.assigned_to_name || 'Unassigned',
            difficulty: t.difficulty,
            status: t.status
        }))
    });

    // Action: Create a new task
    useCopilotAction({
        name: "createTask",
        description: "Create a new task and assign it to an employee. Use this when the user wants to create, add, or assign a task. Ask the user for the task title if not provided. Match employee names to their IDs from the employee list.",
        parameters: [
            {
                name: "title",
                type: "string",
                description: "The title/name of the task to create",
                required: true,
            },
            {
                name: "assigned_to",
                type: "number",
                description: "The employee ID to assign the task to. Look up from the employee list.",
                required: true,
            },
            {
                name: "difficulty",
                type: "number",
                description: "Difficulty level from 1 (easy) to 5 (very hard). Default to 3 if user doesn't specify.",
                required: true,
            },
            {
                name: "status",
                type: "string",
                description: "Task status: 'Pending', 'In Progress', or 'Completed'. Default to 'Pending'.",
                required: false,
            },
        ],
        handler: async ({ title, assigned_to, difficulty, status }) => {
            try {
                const response = await api.post('/tasks', {
                    title,
                    assigned_to,
                    difficulty: Math.min(5, Math.max(1, difficulty)),
                    status: status || 'Pending',
                    start_time: status === 'In Progress' ? new Date().toISOString() : null,
                    end_time: null,
                });

                // Refresh task list after creation
                const taskRes = await api.get('/tasks');
                setTasks(taskRes.data);

                const emp = employees.find(e => e.id === assigned_to);
                return `Task "${title}" has been created and assigned to ${emp ? emp.name : 'employee #' + assigned_to} with difficulty ${difficulty}. Status: ${status || 'Pending'}.`;
            } catch (err) {
                return `Failed to create task: ${err.message}`;
            }
        },
    });

    // Action: Add a contribution
    useCopilotAction({
        name: "addContribution",
        description: "Log a contribution or work note for an employee on a specific task. Use when user wants to record what someone did on a task.",
        parameters: [
            {
                name: "task_id",
                type: "number",
                description: "The task ID to log the contribution for. Look up from the task list.",
                required: true,
            },
            {
                name: "employee_id",
                type: "number",
                description: "The employee ID who made the contribution. Look up from the employee list.",
                required: true,
            },
            {
                name: "notes",
                type: "string",
                description: "Description of the contribution or work done",
                required: true,
            },
        ],
        handler: async ({ task_id, employee_id, notes }) => {
            try {
                await api.post('/contributions', { task_id, employee_id, notes });
                const emp = employees.find(e => e.id === employee_id);
                const task = tasks.find(t => t.id === task_id);
                return `Contribution logged: "${notes}" by ${emp ? emp.name : 'employee'} on task "${task ? task.title : '#' + task_id}".`;
            } catch (err) {
                return `Failed to add contribution: ${err.message}`;
            }
        },
    });

    // Action: Update task status
    useCopilotAction({
        name: "updateTaskStatus",
        description: "Update the status of an existing task. Use when user wants to mark a task as completed, in progress, or pending.",
        parameters: [
            {
                name: "task_id",
                type: "number",
                description: "The ID of the task to update. Look up from the task list.",
                required: true,
            },
            {
                name: "status",
                type: "string",
                description: "New status: 'Pending', 'In Progress', or 'Completed'",
                required: true,
            },
        ],
        handler: async ({ task_id, status }) => {
            try {
                const end_time = status === 'Completed' ? new Date().toISOString() : null;
                await api.put(`/tasks/${task_id}`, { status, end_time });

                // Refresh tasks
                const taskRes = await api.get('/tasks');
                setTasks(taskRes.data);

                const task = tasks.find(t => t.id === task_id);
                return `Task "${task ? task.title : '#' + task_id}" status updated to "${status}".`;
            } catch (err) {
                return `Failed to update task: ${err.message}`;
            }
        },
    });

    // Action: Add a new employee
    useCopilotAction({
        name: "addEmployee",
        description: "Add a new employee to the system. Use when user wants to add or register a new team member.",
        parameters: [
            {
                name: "name",
                type: "string",
                description: "Full name of the new employee",
                required: true,
            },
            {
                name: "role",
                type: "string",
                description: "Job role. Common roles: Frontend Developer, Backend Developer, Full Stack Developer, UI/UX Designer, Project Manager, QA Engineer, DevOps Engineer, Data Analyst, Mobile Developer, Technical Writer",
                required: true,
            },
        ],
        handler: async ({ name, role }) => {
            try {
                await api.post('/employees', { name, role });

                // Refresh employee list
                const empRes = await api.get('/employees');
                setEmployees(empRes.data);

                return `Employee "${name}" added with role "${role}".`;
            } catch (err) {
                return `Failed to add employee: ${err.message}`;
            }
        },
    });

    return null; // This is a logic-only component
};

export default CopilotTaskAgent;
