import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Filter, TrendingUp, ShieldCheck, BarChart3, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { AreaTrendChart, DonutProgressChart, HorizontalBarChart } from '../../components/common/Charts';

const TEAM_PERFORMANCE_DATA = [
  { team: 'Enterprise Sales', repCount: 14, quotes: 68, avgTime: '4.2 hrs', winRate: '64%', revenue: '$184,500' },
  { team: 'SMB Sales', repCount: 22, quotes: 52, avgTime: '7.8 hrs', winRate: '48%', revenue: '$72,000' },
  { team: 'EMEA Region', repCount: 8, quotes: 28, avgTime: '5.1 hrs', winRate: '56%', revenue: '$48,000' },
];

const ReportsAnalytics = () => {
  const [filters, setFilters] = useState({
    period: 'This Month',
    salesTeam: 'All Teams',
    approvalStatus: 'All Statuses',
    product: 'All Products'
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    toast.success(`Filter updated: ${field} = ${value}`);
  };

  const handleExportPDF = () => {
    toast.success('Exporting report as PDF document...');
  };

  const handleExportXLS = () => {
    toast.success('Exporting analytics report as Excel spreadsheet (.xlsx)...');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Admin / Reporting Dashboard (Optional)
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Sales trends, approval bottlenecks and platform usage
        </p>
      </div>

      {/* 4 Filter Input Controls */}
      <div className="panel-card p-4 sm:p-5 space-y-3">
        <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Filter className="w-3.5 h-3.5 text-[var(--teal)]" /> Filter Dashboard Data
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Period Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">Period</label>
            <select
              value={filters.period}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Year-to-Date">Year-to-Date</option>
            </select>
          </div>

          {/* Sales Team Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">Sales Team</label>
            <select
              value={filters.salesTeam}
              onChange={(e) => handleFilterChange('salesTeam', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            >
              <option value="All Teams">All Teams</option>
              <option value="Enterprise Sales">Enterprise Sales</option>
              <option value="SMB Sales">SMB Sales</option>
              <option value="EMEA Region">EMEA Region</option>
            </select>
          </div>

          {/* Approval Status Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">Approval Status</label>
            <select
              value={filters.approvalStatus}
              onChange={(e) => handleFilterChange('approvalStatus', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Product Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text)]">Product</label>
            <select
              value={filters.product}
              onChange={(e) => handleFilterChange('product', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            >
              <option value="All Products">All Products</option>
              <option value="Laptop Pro 14">Laptop Pro 14</option>
              <option value="Care Plan 2yr">Care Plan 2yr</option>
              <option value="Cloud Server Node">Cloud Server Node</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Quotes Created */}
        <div className="panel-card space-y-1 border-l-4 border-[var(--teal)]">
          <div className="text-sm font-semibold text-[var(--text)]">Quotes Created</div>
          <div className="text-2xl font-bold font-mono text-[var(--text)]">148</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">148 this month</div>
        </div>

        {/* Card 2: Avg Approval Time */}
        <div className="panel-card space-y-1 border-l-4 border-[var(--gold)]">
          <div className="text-sm font-semibold text-[var(--text)]">Avg Approval Time</div>
          <div className="text-2xl font-bold font-mono text-[var(--gold)]">6.4 hrs</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">6.4 hours</div>
        </div>

        {/* Card 3: Top Upsold Product */}
        <div className="panel-card space-y-1 border-l-4 border-[var(--rust)]">
          <div className="text-sm font-semibold text-[var(--text)]">Top Upsold Product</div>
          <div className="text-xl font-bold text-[var(--text)]">Care Plan 2yr</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">Care Plan 2yr (34% attachment rate)</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-b border-[var(--paper-dim)] pb-6">
        <button
          onClick={handleExportPDF}
          className="px-5 py-2.5 bg-[var(--paper-dim)] border border-[var(--steel-line)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text)] text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs"
        >
          <FileText className="w-4 h-4 text-rose-600" />
          Export PDF
        </button>

        <button
          onClick={handleExportXLS}
          className="px-5 py-2.5 bg-[var(--paper-dim)] border border-[var(--steel-line)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text)] text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Export XLS
        </button>
      </div>

      {/* Analytics Charts & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <AreaTrendChart title="Sales Trends & Revenue Pipeline Breakdown ($)" />
        </div>
        <div>
          <DonutProgressChart title="Approval Governance Adherence (%)" />
        </div>
      </div>

      {/* Warehouse Dispatch Velocity & Team Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HorizontalBarChart title="Fulfillment Center Dispatch Velocity" />
        </div>

        <div className="lg:col-span-2 panel-card space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--paper-dim)] pb-3">
            <h3 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--teal)]" /> Sales Team Performance Breakdown
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">Real-Time Aggregation</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Sales Team</th>
                  <th className="py-3 px-4">Reps</th>
                  <th className="py-3 px-4">Quotes Created</th>
                  <th className="py-3 px-4">Avg Approval Time</th>
                  <th className="py-3 px-4">Win Rate</th>
                  <th className="py-3 px-4">Pipeline Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {TEAM_PERFORMANCE_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.team}</td>
                    <td className="py-3.5 px-4 text-[var(--text)]">{row.repCount} Reps</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.quotes}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--gold)]">{row.avgTime}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">{row.winRate}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--text)]">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;


