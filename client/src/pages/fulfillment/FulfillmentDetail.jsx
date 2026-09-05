import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Warehouse, CheckCircle2, Split, Edit, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const FulfillmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderId] = useState(id || 'q-1042');
  const [customerName] = useState('Acme Corp');
  const [status, setStatus] = useState('Split Pending');
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Table dataset matching Wireframe 8
  const [splitRows, setSplitRows] = useState([
    { warehouse: 'Main Warehouse', qtyFulfilled: 18, estShipments: 1, cost: 42 },
    { warehouse: 'East Depot', qtyFulfilled: 6, estShipments: 1, cost: 29 }
  ]);

  // Fetch live order detail if available
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/fulfillment/orders/${orderId}`);
        if (res.data && res.data.data) {
          if (res.data.data.status) setStatus(res.data.data.status);
        }
      } catch (err) {
        console.error('Fetch fulfillment detail error:', err);
      }
    };
    fetchDetail();
  }, [orderId]);

  const handleAcceptSuggestedSplit = async () => {
    try {
      await api.post(`/fulfillment/orders/${orderId}/allocate`, { status: 'Split Allocated' }).catch(() => null);
      setStatus('Split Allocated');
      toast.success(`Accepted suggested split allocation for ${orderId.toUpperCase()}!`);
    } catch (err) {
      toast.error('Failed to update split allocation');
    }
  };

  const handleQtyChange = (index, value) => {
    const newQty = Math.max(0, parseInt(value) || 0);
    const updated = [...splitRows];
    updated[index].qtyFulfilled = newQty;
    updated[index].cost = Math.round(newQty * 2.3 + (newQty > 0 ? 15 : 0));
    setSplitRows(updated);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <div>
        <button
          onClick={() => navigate('/fulfillment')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Fulfillment & Stock List
        </button>

        {/* Page Title & Subtitle matching Wireframe 8 */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Fulfillment Detail: {orderId.toUpperCase()} ({customerName})
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Opened by clicking an order row on the Fulfillment list
        </p>
      </div>

      {/* Main Table matching Wireframe 8 */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Warehouse</th>
                <th className="py-3 px-4">Qty Fulfilled</th>
                <th className="py-3 px-4">Est. Shipments</th>
                <th className="py-3 px-4">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {splitRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)] flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-[var(--teal)] shrink-0" />
                    {row.warehouse}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">
                    {isManualOverride ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={row.qtyFulfilled}
                          onChange={(e) => handleQtyChange(idx, e.target.value)}
                          className="w-20 px-2 py-1 border border-[var(--steel-line)] rounded font-mono text-xs"
                        />
                        <span className="text-[var(--text-muted)] text-xs">units</span>
                      </div>
                    ) : (
                      <span>{row.qtyFulfilled} units</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{row.estShipments}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">${row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yellow Callout Banner matching Wireframe 8 */}
      <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs">
        <div>
          "Consolidate Remaining Backorder" prompt appears automatically once East Depot restocks.
        </div>
      </div>

      {/* Action Buttons matching Wireframe 8 */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        {status === 'Split Allocated' ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Suggested Split Allocation Accepted & Confirmed
          </div>
        ) : (
          <button
            onClick={handleAcceptSuggestedSplit}
            className="px-6 py-2.5 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <Split className="w-4 h-4" /> Accept Suggested Split
          </button>
        )}

        <button
          onClick={() => {
            setIsManualOverride(!isManualOverride);
            toast(isManualOverride ? 'Manual override mode disabled' : 'Manual override mode enabled — Edit quantities in table above');
          }}
          className={`px-6 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 ${
            isManualOverride
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-white border-[var(--steel-line)] text-[var(--text)] hover:bg-slate-50'
          }`}
        >
          <Edit className="w-4 h-4" /> {isManualOverride ? 'Done Overriding' : 'Manual Override'}
        </button>
      </div>
    </div>
  );
};

export default FulfillmentDetail;
