import React from 'react';
import { IconType } from 'react-icons';

interface StatItem {
    label: string;
    value: string | number;
}

interface GameStatCardProps {
    title: string;
    icon: IconType; // Use React Icons
    stats: StatItem[];
    gradientFrom?: string;
    gradientTo?: string;
    onClick?: () => void;
}

const GameStatCard: React.FC<GameStatCardProps> = ({ 
    title, 
    icon: Icon, 
    stats, 
    gradientFrom = 'from-blue-500', 
    gradientTo = 'to-purple-600',
    onClick
}) => {
    return (
        <div 
            onClick={onClick}
            className={`cursor-pointer group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6`}
        >
            {/* Header Background Gradient */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}></div>
            
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-90 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white text-xl" />
                </div>
                {/* Arrow Icon for interactivity hint */}
                <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>

            <div className="space-y-3">
                {stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{stat.label}</span>
                        <span className="font-semibold text-gray-800">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameStatCard;
