import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { GitCommit, GitBranch, Plus, Minus, Clock } from 'lucide-react';

const Commits = () => {
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommits = async () => {
            try {
                const res = await api.get('/commits');
                setCommits(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCommits();
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);

        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const commitTypeConfig = {
        'feat': { bg: 'bg-accent-500/15', text: 'text-accent-400', border: 'border-accent-500/20' },
        'fix': { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20' },
        'refactor': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/20' },
        'test': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20' },
        'docs': { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/20' },
        'ci': { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/20' },
        'chore': { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/20' },
    };

    const getCommitType = (message) => {
        const match = message.match(/^(\w+):/);
        return match ? match[1] : 'commit';
    };

    const getTypeStyle = (type) => {
        return commitTypeConfig[type] || { bg: 'bg-surface-700', text: 'text-text-secondary', border: 'border-white/[0.06]' };
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

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-text-secondary">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                Loading Commits...
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <GitCommit size={24} /> Commit History
                    </h2>
                    <p className="text-sm text-text-muted mt-1">{commits.length} commits across all repos</p>
                </div>
            </div>

            {/* Commit Timeline */}
            <div className="space-y-3">
                {commits.map((commit) => {
                    const type = getCommitType(commit.message);
                    const typeStyle = getTypeStyle(type);
                    return (
                        <div key={commit.id}
                            className="glass-light rounded-2xl p-4 hover:scale-[1.003] transition-all duration-200 group">
                            <div className="flex items-start gap-4">
                                {/* Commit Icon */}
                                <div className="mt-1 flex-shrink-0">
                                    <div className="h-9 w-9 rounded-xl bg-primary-500/10 border border-primary-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <GitCommit size={17} className="text-primary-400" />
                                    </div>
                                </div>

                                {/* Commit Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                                            {type}
                                        </span>
                                        <p className="text-sm font-semibold text-text-primary truncate">
                                            {commit.message.replace(/^\w+:\s*/, '')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-text-muted mt-2 flex-wrap">
                                        {/* Author */}
                                        <span className="flex items-center gap-1.5">
                                            <div className={`h-5 w-5 rounded-md bg-gradient-to-br ${getInitialColor(commit.employee_name)} flex items-center justify-center text-white text-[9px] font-bold`}>
                                                {commit.employee_name.charAt(0)}
                                            </div>
                                            <span className="text-text-secondary">{commit.employee_name}</span>
                                        </span>

                                        {/* Repo */}
                                        <span className="font-mono px-2 py-0.5 rounded-md bg-surface-800 text-text-secondary border border-white/[0.06]">
                                            {commit.repo_name}
                                        </span>

                                        {/* Branch */}
                                        <span className="flex items-center gap-1 text-text-muted">
                                            <GitBranch size={12} />
                                            <span className="font-mono">{commit.branch}</span>
                                        </span>

                                        {/* Hash */}
                                        <span className="font-mono text-primary-400">
                                            {commit.commit_hash.substring(0, 7)}
                                        </span>

                                        {/* Time */}
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {formatDate(commit.committed_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Additions / Deletions */}
                                <div className="flex items-center gap-3 text-xs font-mono flex-shrink-0">
                                    <span className="flex items-center gap-0.5 text-accent-400">
                                        <Plus size={14} />
                                        {commit.additions}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-red-400">
                                        <Minus size={14} />
                                        {commit.deletions}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Commits;
