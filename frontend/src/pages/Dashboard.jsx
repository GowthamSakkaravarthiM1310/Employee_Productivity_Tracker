import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { CheckCircle, Users, FileText, Share2, ClipboardList, TrendingUp } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        activeEmployees: 0,
        contributions: 0,
        collaborations: 0
    });
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/dashboard');
                setStats(res.data.stats);

                const employees = res.data.charts.tasksPerEmployee || [];
                setChartData({
                    labels: employees.map(e => e.name),
                    datasets: [
                        {
                            label: 'Tasks Assigned',
                            data: employees.map(e => e.task_count),
                            backgroundColor: 'rgba(99, 102, 241, 0.6)',
                            borderColor: 'rgb(99, 102, 241)',
                            borderWidth: 1,
                            borderRadius: 6,
                            borderSkipped: false,
                        },
                    ],
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#94a3b8', font: { family: 'Inter' } }
            },
            tooltip: {
                backgroundColor: '#1e2433',
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255,255,255,0.06)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
            }
        },
        scales: {
            x: {
                ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
                grid: { color: 'rgba(255,255,255,0.04)' },
                border: { color: 'rgba(255,255,255,0.06)' }
            },
            y: {
                ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
                grid: { color: 'rgba(255,255,255,0.04)' },
                border: { color: 'rgba(255,255,255,0.06)' }
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                Loading Dashboard...
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Dashboard Overview</h2>
                    <p className="text-sm text-text-muted mt-1">Track your team's productivity at a glance</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass-light">
                    <TrendingUp size={16} className="text-accent-400" />
                    <span className="text-sm text-text-secondary font-medium">Real-time Data</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card title="Total Tasks" value={stats.totalTasks} icon={ClipboardList} colorClass="bg-blue-100 text-blue-600" />
                <Card title="Completed" value={stats.completedTasks} icon={CheckCircle} colorClass="bg-green-100 text-green-600" />
                <Card title="Employees" value={stats.activeEmployees} icon={Users} colorClass="bg-purple-100 text-purple-600" />
                <Card title="Contributions" value={stats.contributions} icon={FileText} colorClass="bg-yellow-100 text-yellow-600" />
                <Card title="Collaborations" value={stats.collaborations} icon={Share2} colorClass="bg-pink-100 text-pink-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass-light rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Tasks per Employee</h3>
                    <p className="text-xs text-text-muted mb-6">Workload distribution across the team</p>
                    <div className="h-72">
                        {chartData && <Bar options={chartOptions} data={chartData} />}
                    </div>
                </div>

                {/* Why This Matters Panel */}
                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 shadow-xl shadow-primary-900/30">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-5">Why This Solution Matters</h3>
                        <ul className="space-y-4">
                            {[
                                ['Measures real', 'work output', ', not hours.'],
                                ['Improves', 'transparency', ' in SMEs.'],
                                ['Encourages', 'fair evaluation', '.'],
                                ['Builds', 'trust', ', not fear.'],
                            ].map(([pre, bold, post], i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="mt-0.5 text-accent-400 flex-shrink-0" size={18} />
                                    <span className="text-sm text-white/90">
                                        {pre} <strong className="text-white">{bold}</strong>{post}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
