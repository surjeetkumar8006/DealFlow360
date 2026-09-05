import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, Package, Split, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const FulfillmentSplitting = () => {
  const navigate = useNavigate();

  // Stock inventory dataset matching Wireframe 7
  const [stockInventory, setStockInventory] = useState([
    { id: 'st-1', warehouse: 'Main Warehouse', product: 'Laptop Pro 14', inStock: 40, reserved: 18, available: 22 },
    { id: 'st-2', warehouse: 'East Depot', product: 'Laptop Pro 14', inStock: 10, reserved: 6, available: 4 },
    { id: 'st-3', warehouse: 'Main Warehouse', product: 'Docking Station', inStock: 65, reserved: 12, available: 53 }
  ]);

  // Orders awaiting fulfillment dataset matching Wireframe 7
  const [orders, setOrders] = useState([
    { id: 'q-1042', orderNumber: 'Q-1042', customer: 'Acme Corp', status: 'Split Pending', warehouses: 'Main + East Depot' },
    { id: 'q-1030', orderNumber: 'Q-1030', customer: 'Zenith Co', status: 'Backorder', warehouses: 'East Depot' }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFulfillmentData = async () => {
      try {
        setLoading(true);
        const [stockRes, ordersRes] = await Promise.all([
          api.get('/fulfillment/stock').catch(() => null),
          api.get('/fulfillment/orders').catch(() => null)
        ]);

        if (stockRes && stockRes.data && stockRes.data.data) {
          setStockInventory(stockRes.data.data);
        }
        if (ordersRes && ordersRes.data && ordersRes.data.data) {
          setOrders(ordersRes.data.data);
        }
      } catch (err) {
        console.error('Fulfillment fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFulfillmentData();
  }, []);

  const handleRowClick = (orderId) => {
    navigate(`/fulfillment/${orderId}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Subtitle matching Wireframe 7 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Fulfillment and Stock (List)
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Live stock per warehouse, plus every order that still needs fulfilling
        </p>
      </div>

      {/* Table 1: Warehouse Stock Table matching Wireframe 7 */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Warehouse</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4 text-right">In Stock</th>
                <th className="py-3 px-4 text-right">Reserved</th>
                <th className="py-3 px-4 text-right">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {stockInventory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)] flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-[var(--teal)] shrink-0" />
                    {row.warehouse}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">{row.product}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-[var(--text)]">{row.inStock}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[var(--text-muted)]">{row.reserved}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#2F6F5E]">{row.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Orders Awaiting Fulfillment matching Wireframe 7 */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-semibold text-[var(--teal)] flex items-center gap-2">
          <Package className="w-4.5 h-4.5" /> Orders Awaiting Fulfillment
        </h2>

        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Warehouses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {orders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => handleRowClick(ord.id)}
                    className="hover:bg-amber-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-[var(--teal)] group-hover:underline flex items-center justify-between">
                      <span>{ord.orderNumber}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--teal)] ml-2" />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[var(--text)]">{ord.customer}</td>
                    <td className="py-3.5 px-4 font-mono">
                      {ord.status === 'Split Pending' ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#B8863B]/10 text-[var(--gold)] border border-[#B8863B]/20">
                          {ord.status}
                        </span>
                      ) : ord.status === 'Backorder' ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[var(--rust)]/10 text-[var(--rust)] border border-[var(--rust)]/20">
                          {ord.status}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#2F6F5E]/10 text-[var(--teal)] border border-[#2F6F5E]/20">
                          {ord.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text)]">{ord.warehouses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Yellow Callout Banner matching Wireframe 7 */}
      <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs">
        <div>
          Click an order row to open its warehouse split detail.
        </div>
      </div>
    </div>
  );
};

export default FulfillmentSplitting;
