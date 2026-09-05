import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper-dim)] p-4">
      <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-lg border border-[var(--steel-line)]">
        <div className="w-10 h-10 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[var(--text)] text-xs font-bold tracking-wider uppercase font-mono">
          Loading DealFlow360...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
