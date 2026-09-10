import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TicketStats } from '../../types';
import { Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface AnalyticsStripProps {
  stats: TicketStats;
}

export const AnalyticsStrip: React.FC<AnalyticsStripProps> = ({ stats }) => {
  const statusData = [
    { name: 'Open', value: stats.openCount, color: '#FF4400' },
    { name: 'In Progress', value: stats.inProgressCount, color: '#2563EB' },
    { name: 'Closed', value: stats.closedCount, color: '#16A34A' },
  ];

  return (
    <section className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FF4400] rounded-sm"></span>
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-[#111827] dark:text-[#F9FAFB]">
            ANALYTICS & THROUGHPUT STRIP
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#4B5563] dark:text-[#9CA3AF]">
          LAST 14 DAYS REAL-TIME
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Tickets-over-time (Line / Area chart) */}
        <div className="lg:col-span-6 p-4 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wide text-[#111827] dark:text-[#F9FAFB]">
                INCIDENT VOLUME OVER TIME
              </h3>
              <p className="text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
                Created vs. Resolved cadence
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-[#111827] dark:text-[#F9FAFB]">
                <span className="w-2 h-2 rounded-full bg-[#FF4400]"></span>
                Created
              </span>
              <span className="flex items-center gap-1 text-[#111827] dark:text-[#F9FAFB]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                Closed
              </span>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyTrend} margin={{ top: 8, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4400" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FF4400" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#6B7280', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: '#6B7280', fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 rounded border border-[#E5E7EB] dark:border-[#262B35] bg-[#111827] text-white text-xs font-mono">
                          <p className="font-bold border-b border-gray-700 pb-1 mb-1">{label}</p>
                          <p className="text-[#FF7744]">
                            Created: {payload[0]?.value}
                          </p>
                          <p className="text-[#4ADE80]">
                            Closed: {payload[1]?.value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#FF4400"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
                <Area
                  type="monotone"
                  dataKey="closed"
                  stroke="#16A34A"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorClosed)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Breakdown (Donut + Legend) */}
        <div className="lg:col-span-3 p-4 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wide text-[#111827] dark:text-[#F9FAFB]">
              STATUS DISTRIBUTION
            </h3>
            <p className="text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
              Pipeline state proportions
            </p>
          </div>

          <div className="flex items-center justify-center my-1 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={56}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="px-2 py-1 rounded bg-[#111827] text-white text-xs font-mono">
                          {data.name}: {data.value} tickets
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#E5E7EB] dark:border-[#262B35] text-[11px] font-mono">
            <div>
              <div className="flex items-center gap-1 text-[#FF4400] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4400]"></span>
                Open
              </div>
              <div className="font-bold text-sm text-[#111827] dark:text-[#F9FAFB]">
                {stats.openCount}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                Prog.
              </div>
              <div className="font-bold text-sm text-[#111827] dark:text-[#F9FAFB]">
                {stats.inProgressCount}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#16A34A] dark:text-[#4ADE80] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                Closed
              </div>
              <div className="font-bold text-sm text-[#111827] dark:text-[#F9FAFB]">
                {stats.closedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card: Average Resolution Time */}
        <div className="lg:col-span-3 p-4 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wide text-[#111827] dark:text-[#F9FAFB]">
                RESOLUTION VELOCITY
              </h3>
              <Clock className="w-4 h-4 text-[#FF4400]" />
            </div>
            <p className="text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
              Average time to resolved state
            </p>
          </div>

          <div className="my-2">
            <div className="font-mono font-extrabold text-3xl text-[#111827] dark:text-[#F9FAFB] tracking-tight">
              {stats.avgResolutionHours}
              <span className="text-sm font-semibold ml-1 text-[#4B5563] dark:text-[#9CA3AF]">
                HOURS
              </span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-mono text-[#16A34A] dark:text-[#4ADE80] mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>-2.4 hrs faster vs. target SLA</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#E5E7EB] dark:border-[#262B35] text-[11px] font-mono">
            <div className="flex justify-between items-center">
              <span className="text-[#4B5563] dark:text-[#9CA3AF]">SLA Compliance:</span>
              <span className="font-semibold text-[#111827] dark:text-[#F9FAFB]">98.6%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#4B5563] dark:text-[#9CA3AF]">First Response:</span>
              <span className="font-semibold text-[#111827] dark:text-[#F9FAFB]">14 mins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
