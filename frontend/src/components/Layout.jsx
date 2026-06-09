import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, FileText, Users2, GitCommit, Menu, X, Activity } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
            ${active
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-800'
            }`}
    >
        <Icon size={19} className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : ''}`} />
        <span>{label}</span>
        {active && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}
    </Link>
);

const Layout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/employees', label: 'Employees', icon: Users },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/contributions', label: 'Contributions', icon: FileText },
        { path: '/collaborations', label: 'Collaborations', icon: Users2 },
        { path: '/commits', label: 'Commits', icon: GitCommit },
    ];

    const currentPage = navItems.find(item => item.path === location.pathname);

    return (
        <div className="flex h-screen bg-surface-950 overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-surface-900 border-r border-white/[0.06] flex flex-col transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/20">
                        <Activity size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-text-primary tracking-tight">
                            Productivity<span className="text-primary-400">Hub</span>
                        </h1>
                        <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">Employee Tracker</p>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-text-muted hover:text-text-primary transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-4 py-4 border-t border-white/[0.06]">
                    <div className="glass-light rounded-xl p-3">
                        <p className="text-xs text-text-muted">CSE Hackathon 2026</p>
                        <p className="text-[10px] text-text-muted mt-0.5">v1.0.0 • Outcome-based Tracking</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="bg-surface-900/80 backdrop-blur-xl border-b border-white/[0.06] z-10 sticky top-0">
                    <div className="flex items-center justify-between px-6 py-3.5">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-text-muted hover:text-text-primary transition-colors">
                                <Menu size={22} />
                            </button>
                            <div>
                                <h2 className="text-lg font-semibold text-text-primary">
                                    {currentPage?.label || 'Dashboard'}
                                </h2>
                                <p className="text-xs text-text-muted hidden sm:block">Employee Productivity Tracker</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 border border-white/[0.06]">
                                <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                                <span className="text-xs text-text-secondary font-medium">System Online</span>
                            </div>
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-600/20 cursor-pointer hover:scale-105 transition-transform">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in" />
            )}
        </div>
    );
};

export default Layout;
