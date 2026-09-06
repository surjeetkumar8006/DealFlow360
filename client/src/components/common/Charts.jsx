import React, { useState } from 'react';
import { TrendingUp, PieChart, ShieldAlert, Warehouse, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

// Sleek Interactive Bar Chart with Gridlines & Overhead Value Badges
export const AreaTrendChart = ({ title = "Quarterly Deal Pipeline Trend ($)", data = [] }) => {
  const [metric, setMetric] = useState('REVENUE'); // 'REVENUE' | 'MARGIN'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const defaultData = [
    { label: 'Draft Deals', val: 15600, margin: 38, color: '#64748B' },
    { label: 'Pending Appr.', val: 50900, margin: 42, color: '#475569' },
    { label: 'Approved', val: 97500, margin: 45, color: '#0F172A' },
    { label: 'Confirmed/Neg.', val: 78000, margin: 48, color: '#1E293B' }
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const maxValue = Math.max(...chartData.map((d) => (metric === 'REVENUE' ? d.val : d.margin || 50)), 100);

  return (
    <div className="panel-card space-y-5">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg border border-slate-300 shadow-2xs">
            <TrendingUp className="w-4 h-4 text-slate-800" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
            <span className="text-xs text-slate-500 font-medium">Real-time pipeline breakdown & stage volume</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 text-xs font-extrabold bg-white text-slate-800 rounded-full border border-slate-300 shadow-2xs">
            +24.6% YoY Growth
          </span>
          <div className="flex bg-white p-1 rounded-xl border border-slate-300 text-xs shadow-2xs">
            <button
              onClick={() => setMetric('REVENUE')}
              className={`px-3.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                metric === 'REVENUE'
                  ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pipeline ($)
            </button>
            <button
              onClick={() => setMetric('MARGIN')}
              className={`px-3.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                metric === 'MARGIN'
                  ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Margin (%)
            </button>
          </div>
        </div>
      </div>

      {/* Chart Visual Container with Y-Axis Gridlines & Overhead Labels (Soft Grey Background behind lines) */}
      <div className="relative h-56 w-full pt-8 pb-3 px-3 flex items-end gap-4 sm:gap-6 border border-slate-200 bg-slate-50/80 rounded-xl shadow-2xs">
        {/* Subtle Horizontal Reference Gridlines */}
        <div className="absolute inset-x-3 top-8 bottom-10 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-300 w-full flex justify-between">
            <span className="text-[9px] font-mono text-slate-500 -mt-2.5">$100k</span>
          </div>
          <div className="border-b border-dashed border-slate-300 w-full flex justify-between">
            <span className="text-[9px] font-mono text-slate-500 -mt-2.5">$75k</span>
          </div>
          <div className="border-b border-dashed border-slate-300 w-full flex justify-between">
            <span className="text-[9px] font-mono text-slate-500 -mt-2.5">$50k</span>
          </div>
          <div className="border-b border-dashed border-slate-300 w-full flex justify-between">
            <span className="text-[9px] font-mono text-slate-500 -mt-2.5">$25k</span>
          </div>
        </div>

        {/* Columns */}
        {chartData.map((item, idx) => {
          const currentVal = metric === 'REVENUE' ? item.val : item.margin || 30;
          const heightPercent = Math.max(Math.round((currentVal / maxValue) * 100), 12);
          const isHovered = hoveredIdx === idx;
          const formattedVal = metric === 'REVENUE' ? `$${(currentVal / 1000).toFixed(1)}k` : `${currentVal}%`;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative cursor-pointer z-10"
            >
              {/* Solid Executive Bar (Badge mounts directly on bar top) */}
              <div className="w-full max-w-[44px] flex flex-col justify-end h-[140px] relative">
                <div
                  className={`w-full transition-all duration-500 rounded-t-lg shadow-sm relative flex justify-center ${
                    isHovered ? 'brightness-110 shadow-md scale-y-[1.02]' : 'opacity-95'
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: item.color || (metric === 'REVENUE' ? '#0F172A' : '#334155')
                  }}
                >
                  <div className="w-full h-1 bg-white/30 rounded-t-lg"></div>

                  {/* Overhead Value Pill Badge mounted directly above bar top */}
                  <div
                    className={`absolute -top-7 px-2 py-0.5 rounded-md text-[10.5px] font-extrabold font-mono transition-all duration-200 shadow-2xs border whitespace-nowrap z-20 ${
                      isHovered
                        ? 'bg-slate-900 text-white border-slate-900 scale-105'
                        : 'bg-white text-slate-800 border-slate-300'
                    }`}
                  >
                    {formattedVal}
                  </div>
                </div>
              </div>

              {/* Stage Title Label */}
              <span
                className={`text-[11.5px] font-semibold transition-colors truncate max-w-full text-center ${
                  isHovered ? 'text-slate-950 font-extrabold' : 'text-slate-700'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer KPI */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Quarterly Live Pipeline Breakdown
        </span>
        <span className="font-mono text-slate-800">
          Target: <strong className="text-slate-950">$150,000 / QTR</strong>
        </span>
      </div>
    </div>
  );
};

// Sleek Governance Adherence Interactive SVG Pie / Donut Chart
export const DonutProgressChart = ({ title = "Discount Risk Governance", items = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const defaultItems = [
    { label: 'Bronze Tier (≤5%)', value: 38, color: '#0F172A', status: 'Compliant' },
    { label: 'Silver Tier (≤10%)', value: 32, color: '#2563EB', status: 'Optimal' },
    { label: 'Gold Tier (≤15%)', value: 30, color: '#D97706', status: 'Optimal' }
  ];

  const chartItems = items.length > 0 ? items : defaultItems;
  const totalVal = chartItems.reduce((sum, item) => sum + (item.value || 0), 0) || 1;

  // SVG parameters for donut pie geometry
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.32
  let accumulatedPercent = 0;

  return (
    <div className="panel-card space-y-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg border border-slate-300">
            <PieChart className="w-4 h-4 text-slate-800" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
            <span className="text-xs text-slate-500 font-medium">Blended risk & tier limits</span>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded">
          Real-time Audit
        </span>
      </div>

      {/* Main Visual Content Grid: Donut Pie + Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
        {/* Interactive SVG Pie Donut Visual */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center py-2 relative">
          <div className="w-36 h-36 relative flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
              {chartItems.map((item, idx) => {
                const percent = (item.value || 0) / totalVal;
                const strokeDasharray = `${percent * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedPercent * circumference;
                accumulatedPercent += percent;
                const isHovered = hoveredIndex === idx;

                return (
                  <circle
                    key={idx}
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={item.color || '#334155'}
                    strokeWidth={isHovered ? 24 : 18}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer origin-center"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Info Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-lg font-extrabold font-mono text-slate-950 leading-tight">
                {hoveredIndex !== null ? `${chartItems[hoveredIndex].value}%` : '94.6%'}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                {hoveredIndex !== null ? chartItems[hoveredIndex].label.split(' ')[0] : 'Compliance'}
              </span>
            </div>
          </div>
        </div>

        {/* Legend Tier Items */}
        <div className="sm:col-span-7 space-y-2.5">
          {chartItems.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-slate-100 border-slate-400 shadow-2xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold gap-2">
                  <span className="text-slate-900 flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="font-mono text-slate-900 font-extrabold shrink-0 bg-white px-2 py-0.5 rounded border border-slate-300 text-[11px] shadow-2xs">
                    {item.value}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Horizontal Multi-Depot Fulfillment Readiness Matrix
export const HorizontalBarChart = ({ title = "Multi-Depot Fulfillment Readiness", data = [] }) => {
  const defaultData = [
    { label: 'Main Warehouse', product: 'Laptop Pro 14', val: 22, max: 40, status: '22 Avail', color: '#0F172A', tag: 'Optimal' },
    { label: 'East Depot', product: 'Onsite Setup Service', val: 4, max: 10, status: '4 Low Stock', color: '#64748B', tag: 'Low Stock' },
    { label: 'Main Warehouse', product: 'Docking Station', val: 53, max: 65, status: '53 Ready', color: '#1E293B', tag: 'Optimal' },
    { label: 'West Hub', product: 'Enterprise Server Node', val: 7, max: 15, status: '7 Avail', color: '#475569', tag: 'Optimal' }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="panel-card space-y-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-lg border border-slate-300">
            <Warehouse className="w-4 h-4 text-slate-800" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
            <span className="text-xs text-slate-500 font-medium">Warehouse dispatch & stock allocation</span>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-800 bg-white border border-slate-300 px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Sync
        </span>
      </div>

      {/* Stock Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {chartData.map((item, idx) => {
          const widthPercent = Math.round((item.val / (item.max || 100)) * 100);
          const isLow = item.val <= 5 || (item.tag || '').toLowerCase().includes('low');

          return (
            <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5 hover:border-slate-300 transition-all shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Warehouse className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">{item.product || item.label}</div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase font-mono ${
                    isLow
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {item.status || `${item.val} Units`}
                </span>
              </div>

              {/* Progress Meter Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                  <span>Stock Capacity</span>
                  <span>{widthPercent}% ({item.val}/{item.max || 100})</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300/60">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: item.color || '#0F172A'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

