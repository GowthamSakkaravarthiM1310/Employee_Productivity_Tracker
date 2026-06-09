import React from 'react';

const Card = ({ title, value, icon: Icon, colorClass }) => {
    const colorMap = {
        'blue': { bg: 'bg-primary-500/10', text: 'text-primary-400', border: 'border-primary-500/20' },
        'green': { bg: 'bg-accent-500/10', text: 'text-accent-400', border: 'border-accent-500/20' },
        'purple': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
        'yellow': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
        'pink': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
    };

    // Extract color from colorClass
    const colorKey = colorClass?.includes('blue') ? 'blue'
        : colorClass?.includes('green') ? 'green'
        : colorClass?.includes('purple') ? 'purple'
        : colorClass?.includes('yellow') ? 'yellow'
        : colorClass?.includes('pink') ? 'pink'
        : 'blue';

    const colors = colorMap[colorKey];

    return (
        <div className={`glass-light rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 group cursor-default border ${colors.border}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wide">{title}</p>
                    <h3 className="text-3xl font-bold text-text-primary mt-2 tabular-nums">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}>
                    {Icon && <Icon size={22} className={colors.text} />}
                </div>
            </div>
        </div>
    );
};

export default Card;
