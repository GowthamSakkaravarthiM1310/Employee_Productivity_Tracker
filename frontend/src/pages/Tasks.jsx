import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { CheckSquare, Plus, X, Clock, AlertCircle, CheckCircle2, Play } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', assigned_to: '', difficulty: 3 });
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (err) { console.error(err); }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask);
            setShowForm(false);
            setNewTask({ title: '', assigned_to: '', difficulty: 3 });
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const endTime = status === 'Completed' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;
            await api.put(`/tasks/${id}`, { status, end_time: endTime });
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const statusConfig = {
        'Completed': { color: 'bg-accent-500/15 text-accent-400 border-accent-500/20', icon: CheckCircle2 },
        'In Progress': { color: 'bg-primary-500/15 text-primary-400 border-primary-500/20', icon: Clock },
        'Pending': { color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: AlertCircle },
    };

    const difficultyBar = (level) => (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= level ? 'bg-primary-400' : 'bg-surface-700'}`} />
            ))}
        </div>
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                Loading Tasks...
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <CheckSquare size={24} /> Tasks
                    </h2>
                    <p className="text-sm text-text-muted mt-1">{tasks.length} total tasks</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-600/20 transition-all duration-200 hover:scale-105 active:scale-95">
                    {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Close' : 'New Task'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreateTask} className="glass-light rounded-2xl p-6 space-y-4 animate-scale-in">
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-1.5">Task Title</label>
                        <input type="text" required
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                            placeholder="Enter task title..."
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Assign To</label>
                            <select required
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                value={newTask.assigned_to}
                                onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}>
                                <option value="">Select Employee</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Difficulty (1-5)</label>
                            <input type="number" min="1" max="5" required
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                value={newTask.difficulty}
                                onChange={e => setNewTask({ ...newTask, difficulty: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-emerald-600 hover:from-accent-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-accent-600/20 transition-all">
                        Create Task
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map(task => {
                    const config = statusConfig[task.status] || statusConfig['Pending'];
                    const StatusIcon = config.icon;
                    return (
                        <div key={task.id} className="glass-light rounded-2xl p-5 hover:scale-[1.01] transition-all duration-200 group">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-base text-text-primary leading-snug pr-2">{task.title}</h3>
                                {difficultyBar(task.difficulty)}
                            </div>
                            <p className="text-sm text-text-muted">
                                Assigned to: <span className="font-medium text-text-secondary">{task.assigned_to_name || 'Unassigned'}</span>
                            </p>
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/[0.04]">
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border flex items-center gap-1.5 ${config.color}`}>
                                    <StatusIcon size={13} />
                                    {task.status}
                                </span>
                                <div className="flex gap-2">
                                    {task.status === 'Pending' && (
                                        <button onClick={() => handleStatusUpdate(task.id, 'In Progress')}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-primary-500/15 text-primary-400 hover:bg-primary-500/25 border border-primary-500/20 transition-colors flex items-center gap-1">
                                            <Play size={11} /> Start
                                        </button>
                                    )}
                                    {task.status !== 'Completed' && (
                                        <button onClick={() => handleStatusUpdate(task.id, 'Completed')}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-accent-500/15 text-accent-400 hover:bg-accent-500/25 border border-accent-500/20 transition-colors flex items-center gap-1">
                                            <CheckCircle2 size={11} /> Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tasks;
