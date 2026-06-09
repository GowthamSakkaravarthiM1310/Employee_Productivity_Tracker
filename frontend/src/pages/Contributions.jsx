import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { FileText, Plus, X, MessageSquare, Calendar } from 'lucide-react';

const Contributions = () => {
    const [contributions, setContributions] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newContrib, setNewContrib] = useState({ task_id: '', employee_id: '', notes: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resContrib, resTasks, resEmp] = await Promise.all([
                api.get('/contributions'),
                api.get('/tasks'),
                api.get('/employees')
            ]);
            setContributions(resContrib.data);
            setTasks(resTasks.data);
            setEmployees(resEmp.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/contributions', newContrib);
            setShowForm(false);
            setNewContrib({ task_id: '', employee_id: '', notes: '' });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const getInitialColor = (name) => {
        const colors = [
            'from-primary-500 to-primary-700',
            'from-accent-500 to-emerald-700',
            'from-purple-500 to-purple-700',
            'from-pink-500 to-rose-700',
            'from-amber-500 to-orange-700',
            'from-cyan-500 to-blue-700',
        ];
        return colors[(name || '').charCodeAt(0) % colors.length];
    };

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <FileText size={24} /> Contributions Log
                    </h2>
                    <p className="text-sm text-text-muted mt-1">{contributions.length} contributions recorded</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-500 to-emerald-600 hover:from-accent-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-accent-600/20 transition-all duration-200 hover:scale-105 active:scale-95">
                    {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Close' : 'Log Contribution'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass-light rounded-2xl p-6 space-y-4 animate-scale-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Task</label>
                            <select required
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                value={newContrib.task_id} onChange={e => setNewContrib({ ...newContrib, task_id: e.target.value })}>
                                <option value="">Select Task</option>
                                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Employee</label>
                            <select required
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                value={newContrib.employee_id} onChange={e => setNewContrib({ ...newContrib, employee_id: e.target.value })}>
                                <option value="">Select Employee</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-1.5">Contribution Notes</label>
                        <textarea required rows="3"
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none"
                            placeholder="Describe what was accomplished..."
                            value={newContrib.notes} onChange={e => setNewContrib({ ...newContrib, notes: e.target.value })} />
                    </div>
                    <button type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-lg shadow-primary-600/20 transition-all hover:shadow-primary-600/30">
                        Submit Contribution
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {contributions.map(c => (
                    <div key={c.id} className="glass-light rounded-2xl p-5 hover:scale-[1.005] transition-all duration-200 border-l-4 border-accent-500">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${getInitialColor(c.employee_name)} flex items-center justify-center text-white text-xs font-bold`}>
                                        {c.employee_name.charAt(0)}
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-primary-400">{c.employee_name}</span>
                                        <span className="text-text-muted text-sm mx-2">on</span>
                                        <span className="text-sm font-semibold text-text-primary">{c.task_title}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 ml-11">
                                    <MessageSquare size={14} className="text-text-muted mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-text-secondary leading-relaxed">{c.notes}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-text-muted flex-shrink-0">
                                <Calendar size={12} />
                                {new Date(c.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contributions;
