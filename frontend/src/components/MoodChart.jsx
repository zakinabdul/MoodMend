import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodChart = ({ data }) => {
    if (!data || data.length < 2) return null;

    // Transform data for chart if needed, or assume data is ready
    // Reverse to show chronological left-to-right if the feed is desc
    const chartData = [...data].reverse().map(item => ({
        date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: item.mood_score
    }));

    return (
        <div className="w-full h-64 mt-8 glass-card">
            <h3 className="text-lg font-serif text-eco-moss mb-4">Mood Fluctuations</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#3A5A40"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#3A5A40"
                        domain={[-1, 1]}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#E07A5F"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#E07A5F', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MoodChart;
