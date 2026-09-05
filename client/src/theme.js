// Global theme color palette and design system constants
// Extracted directly from DealFlow360 Excalidraw UI Wireframes

export const THEME = {
  header: {
    dark: 'bg-[#18181b] text-white', // Dark header for Auth / Login wireframe
    blue: 'bg-[#1d4ed8] text-white', // Deep Blue Header for Sales Dashboard & Internal App
  },
  button: {
    primary: 'bg-[#1d63ed] hover:bg-[#1d4ed8] text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 font-medium px-4 py-2 rounded-lg shadow-sm transition-all',
    pillActive: 'bg-white text-[#1d4ed8] font-semibold px-4 py-1.5 rounded-full shadow-sm text-sm',
    pillInactive: 'text-blue-100 hover:text-white hover:bg-white/10 font-medium px-4 py-1.5 rounded-full border border-blue-400/40 text-sm transition-all',
  },
  card: {
    bg: 'bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all rounded-xl p-5',
    mutedBg: 'bg-slate-100/90 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all rounded-xl p-5',
  },
  bannerNote: 'bg-[#fef9c3] border border-[#fde047] text-[#713f12] rounded-xl p-3.5 text-xs sm:text-sm font-medium shadow-sm',
  text: {
    heading: 'text-slate-900 font-bold',
    body: 'text-slate-700',
    muted: 'text-slate-500',
    blueLink: 'text-[#2563eb] hover:underline font-medium',
  },
  statusBadges: {
    approved: 'bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-semibold',
    pending: 'bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-semibold',
    rejected: 'bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-xs font-semibold',
    draft: 'bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-0.5 rounded-full text-xs font-semibold',
  }
};
