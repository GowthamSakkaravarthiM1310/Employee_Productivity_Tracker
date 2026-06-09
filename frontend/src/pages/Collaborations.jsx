import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Users2, Plus, X, ArrowLeftRight } from 'lucide-react';

const Collaborations = () => {
    const [collabs, setCollabs] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newCollab, setNewCollab] = useState({ task_id: '', employee1: '', employee2: '', note: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resCollab, resTasks, resEmp] = await Promise.all([
                api.get('/collaborations'),
                api.get('/tasks'),
                api.get('/employees')
            ]);
            setCollabs(resCollab.data);
            setTasks(resTasks.data);
            setEmployees(resEmp.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/collaborations', newCollab);
            setShowForm(false);
            setNewCollab({ task_id: '', employee1: '', employee2: '', note: '' });
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
                        <Users2 size={24} /> Team Collaborations
                    </h2>
                    <p className="text-sm text-text-muted mt-1">{collabs.length} collaboration records</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-200 hover:scale-105 active:scale-95">
                    {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? 'Close' : 'Record Collaboration'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass-light rounded-2xl p-6 space-y-4 animate-scale-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Task</label>
                            <select required
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                value={newCollab.task_id} onChange={e => setNewCollab({ ...newCollab, task_id: e.target.value })}>
                                <option value="">Select Task</option>
                                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Collaborator 1</label>
                            <select required
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                value={newCollab.employee1} onChange={e => setNewCollab({ ...newCollab, employee1: e.target.value })}>
                                <option value="">Select Employee</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Collaborator 2</label>
                            <select required
                                className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                value={newCollab.employee2} onChange={e => setNewCollab({ ...newCollab, employee2: e.target.value })}>
                                <option value="">Select Employee</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-1.5">Collaboration Details</label>
                        <input type="text" required
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                            placeholder="What did they work on together?"
                            value={newCollab.note} onChange={e => setNewCollab({ ...newCollab, note: e.target.value })} />
                    </div>
                    <button type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg shadow-purple-600/20 transition-all">
                        Record Collaboration
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collabs.map(c => (
                    <div key={c.id} className="glass-light rounded-2xl p-5 hover:scale-[1.01] transition-all duration-200 border-t-2 border-purple-500/50">
                        <h4 className="font-bold text-sm text-text-primary truncate mb-4">{c.task_title}</h4>
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
                                <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${getInitialColor(c.emp1_name)} flex items-center justify-center text-white text-xs font-bold`}>
                                    {c.emp1_name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-primary-300">{c.emp1_name}</span>
                            </div>
                            <ArrowLeftRight size={16} className="text-text-muted" />
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-500/10 border border-accent-500/20">
                                <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${getInitialColor(c.emp2_name)} flex items-center justify-center text-white text-xs font-bold`}>
                                    {c.emp2_name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-accent-300">{c.emp2_name}</span>
                            </div>
                        </div>
                        <p className="mt-4 text-text-muted text-sm italic text-center">"{c.note}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collaborations;
