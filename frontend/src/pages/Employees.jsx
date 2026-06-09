import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { User, Award, Plus, X } from 'lucide-react';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', role: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.role.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/employees', formData);
            setFormData({ name: '', role: '' });
            setShowModal(false);
            setLoading(true);
            await fetchEmployees();
        } catch (err) {
            console.error(err);
            alert('Failed to add employee');
        } finally {
            setSubmitting(false);
        }
    };

    const getScoreColor = (score) => {
        if (score > 5) return 'bg-accent-500/15 text-accent-400 border border-accent-500/20';
        if (score > 2) return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
        return 'bg-red-500/15 text-red-400 border border-red-500/20';
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
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                Loading Employees...
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <User size={24} /> Employees & Productivity
                    </h2>
                    <p className="text-sm text-text-muted mt-1">{employees.length} team members</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    <Plus size={18} /> Add Employee
                </button>
            </div>

            {/* Employee Table */}
            <div className="glass-light rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Completed Tasks</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Total Hours</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Productivity Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${getInitialColor(emp.name)} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                                                {emp.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-semibold text-text-primary">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-text-secondary px-2.5 py-1 rounded-lg bg-surface-800 border border-white/[0.06]">{emp.role}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-medium tabular-nums">{emp.completed_count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary tabular-nums">{emp.total_hours || 0} hrs</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-lg ${getScoreColor(emp.productivity_score)}`}>
                                            {emp.productivity_score || 0}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-surface-900 border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                <div className="h-8 w-8 bg-primary-500/15 rounded-lg flex items-center justify-center">
                                    <Plus size={16} className="text-primary-400" />
                                </div>
                                Add New Employee
                            </h3>
                            <button onClick={() => setShowModal(false)} className="h-8 w-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-800 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.08] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                >
                                    <option value="">Select a role...</option>
                                    <option value="Frontend Developer">Frontend Developer</option>
                                    <option value="Backend Developer">Backend Developer</option>
                                    <option value="Full Stack Developer">Full Stack Developer</option>
                                    <option value="UI/UX Designer">UI/UX Designer</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="QA Engineer">QA Engineer</option>
                                    <option value="DevOps Engineer">DevOps Engineer</option>
                                    <option value="Data Analyst">Data Analyst</option>
                                    <option value="Mobile Developer">Mobile Developer</option>
                                    <option value="Technical Writer">Technical Writer</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.1] text-text-secondary font-semibold text-sm hover:bg-surface-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting || !formData.name.trim() || !formData.role}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-primary-600/30">
                                    {submitting ? 'Adding...' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
