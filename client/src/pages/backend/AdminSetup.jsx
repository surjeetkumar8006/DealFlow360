import React from 'react';
import { Settings, Shield, Package, Home, Layers } from 'lucide-react';

const AdminSetup = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Admin Backend Configuration</h1>
        <p className="text-slate-500 text-sm mt-1">Configure discount ceilings, price lists, approval chains, warehouses, and subscription rules</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="card-container">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Discount Tier Ceilings</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Bronze: 5% | Silver: 10% | Gold: 15% | Platinum: 20%</p>
          <button className="text-xs text-blue-600 font-semibold hover:underline">Edit Ceilings →</button>
        </div>

        <div className="card-container">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span>Category Ceilings</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Hardware: 15% | Services: 10% | Subscriptions: 12%</p>
          <button className="text-xs text-blue-600 font-semibold hover:underline">Configure Rules →</button>
        </div>

        <div className="card-container">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
            <Home className="w-5 h-5 text-blue-600" />
            <span>Warehouses & Stock</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Main Warehouse, East Depot, West Hub</p>
          <button className="text-xs text-blue-600 font-semibold hover:underline">Manage Inventory →</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
