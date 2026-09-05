import React, { useState } from 'react';
import { TrendingUp, PieChart, ShieldAlert, Warehouse, Activity, Info } from 'lucide-react';

// Sleek Interactive Area & Bar Trend Chart (Paper Theme)
export const AreaTrendChart = ({ title = "Quarterly Deal Pipeline Trend ($)", data = [] }) => {
  const [metric, setMetric] = useState('REVENUE'); // 'REVENUE' | 'MARGIN'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const defaultData = [
    { label: 'Q1 2025', val: 42000, margin: 38, color: '#2F6F5E' },
    { label: 'Q2 2025', val: 68000, margin: 42, color: '#2F6F5E' },
    { label: 'Q3 2025', val: 95000, margin: 35, color: '#B8863B' },
    { label: 'Q4 2025', val: 124000, margin: 44, color: '#2F6F5E' },
    { label: 'Q1 2026', val: 158000, margin: 48, color: '#2F6F5E' }
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const maxValue = Math.max(...chartData.map((d) => (metric === 'REVENUE' ? d.val : d.margin || 50)), 100);

  return (
    <div className="panel-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--paper-dim)] pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--teal)]" />
          <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[#2F6F5E]/10 text-[var(--teal)] rounded-full border border-[#2F6F5E]/20">
            +24.6% YoY Growth
          </span>
          <div className="flex bg-[var(--paper-dim)] p-0.5 rounded-lg border border-[var(--steel-line)] text-xs">
            <button
              onClick={() => setMetric('REVENUE')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                metric === 'REVENUE' ? 'bg-[var(--ink)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Pipeline ($)
            </button>
            <button
              onClick={() => setMetric('MARGIN')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                metric === 'MARGIN' ? 'bg-[var(--ink)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Margin (%)
            </button>
          </div>
        </div>
      </div>

      {/* SVG Bar + Area Glow Overlay */}
      <div className="relative h-48 w-full pt-6 pb-2 px-2 flex items-end gap-3 border-b border-[var(--paper-dim)]">
        {chartData.map((item, idx) => {
          const currentVal = metric === 'REVENUE' ? item.val : item.margin || 30;
          const heightPercent = Math.round((currentVal / maxValue) * 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative cursor-pointer"
            >
              {/* Floating Tooltip */}
              {isHovered && (
                <div className="absolute -top-10 z-20 px-3 py-1.5 rounded-xl bg-[var(--ink)] text-white text-xs font-mono shadow-xl border border-white/20 flex flex-col items-center whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                  <span className="font-bold">
                    {metric === 'REVENUE' ? `$${(currentVal / 1000).toFixed(1)}k` : `${currentVal}% Margin`}
                  </span>
                  <span className="text-[10px] text-slate-300">{item.label}</span>
                </div>
              )}

              {/* Bar Container - Slim & Elegant Bar Width */}
              <div className="w-7 sm:w-9 max-w-[34px] bg-[var(--paper-dim)]/80 rounded-t-lg overflow-hidden flex flex-col justify-end h-full max-h-[140px] relative border border-[var(--steel-line)]/40 shadow-xs">
                <div
                  className={`w-full transition-all duration-500 rounded-t-lg ${
                    isHovered ? 'brightness-125 shadow-md scale-y-[1.02]' : 'opacity-90'
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: item.color || (metric === 'REVENUE' ? 'var(--teal)' : 'var(--gold)')
                  }}
                >
                  <div className="w-full h-1 bg-white/40 rounded-t-lg"></div>
                </div>
              </div>

              {/* Label */}
              <span className={`text-[11px] font-mono transition-colors font-semibold ${
                isHovered ? 'text-[var(--teal)] scale-105' : 'text-[var(--text-muted)]'
              }`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1 font-medium">
        <span>Quarterly Breakdown</span>
        <span>Target: <strong>$150,000 / QTR</strong></span>
      </div>
    </div>
  );
};

// Donut / Ring Progress Breakdown Chart with Centered Risk Gauge
export const DonutProgressChart = ({ title = "Discount Risk Level Distribution", items = [] }) => {
  const defaultItems = [
    { label: 'Low Risk (< 8%)', value: 65, color: '#2F6F5E', count: '14 Quotes' },
    { label: 'Medium Risk (8 - 15%)', value: 22, color: '#B8863B', count: '5 Quotes' },
    { label: 'High Risk / Flagged (> 15%)', value: 13, color: '#9E2A2B', count: '3 Quotes' }
  ];

  const chartItems = items.length > 0 ? items : defaultItems;

  return (
    <div className="panel-card space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--paper-dim)] pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[var(--gold)]" />
          <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">Real-time Governance</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* SVG Ring Visual */}
        <div className="sm:col-span-5 flex justify-center relative py-2">
          <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center shadow-inner bg-[#FAF9F5] relative">
            <ShieldAlert className="w-6 h-6 text-[var(--gold)] mb-0.5 animate-pulse" />
            <span className="text-lg font-bold font-mono text-[var(--text)]">18.5</span>
            <span className="text-[9px] font-bold tracking-wider text-[var(--rust)] uppercase">High Risk</span>
          </div>
        </div>

        {/* Legend Progress Bars */}
        <div className="sm:col-span-7 space-y-3">
          {chartItems.map((item, idx) => (
            <div key={idx} className="space-y-1 group">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[var(--text)] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.label}
                </span>
                <span className="font-mono text-[var(--text-muted)] group-hover:text-[var(--text)]">
                  {item.value}% <span className="text-[10px] opacity-70">({item.count})</span>
                </span>
              </div>
              <div className="w-full bg-[var(--paper-dim)] h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: item.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Horizontal Warehouse Stock Level Breakdown Bar Chart
export const HorizontalBarChart = ({ title = "Multi-Depot Fulfillment Readiness", data = [] }) => {
  const defaultData = [
    { label: 'Main Warehouse (Laptop Pro 14)', val: 22, max: 40, status: '22 Avail', color: '#2F6F5E' },
    { label: 'East Depot (Laptop Pro 14)', val: 4, max: 10, status: '4 Low Stock', color: '#B8863B' },
    { label: 'Main Warehouse (Docking Station)', val: 53, max: 65, status: '53 Ready', color: '#2F6F5E' },
    { label: 'West Hub (Server Node)', val: 7, max: 15, status: '7 Avail', color: '#94A3B8' }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="panel-card space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--paper-dim)] pb-3">
        <div className="flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-[var(--teal)]" />
          <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
        </div>
        <span className="text-xs font-mono text-[var(--teal)] font-semibold">Live Inventory Sync</span>
      </div>

      <div className="space-y-3.5">
        {chartData.map((item, idx) => {
          const widthPercent = Math.round((item.val / (item.max || 100)) * 100);

          return (
            <div key={idx} className="space-y-1 group">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[var(--text)]">{item.label}</span>
                <span className="font-mono text-xs font-bold" style={{ color: item.color }}>
                  {item.status || `${item.val} units`}
                </span>
              </div>
              <div className="w-full bg-[var(--paper-dim)] h-3 rounded-lg overflow-hidden border border-[var(--steel-line)]/50">
                <div
                  className="h-full rounded-lg transition-all duration-700 group-hover:brightness-110"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: item.color || 'var(--teal)'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
