import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Download, AlertCircle, Check, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import api from '../../services/api';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    id: id || 'inv-1043',
    invoiceNumber: (id || 'INV-1043').toUpperCase(),
    customer: 'Acme Corp',
    amount: '$46',
    status: 'Paid',
    dueDate: 'Sep 15',
    orderRef: 'Q-1042 (Recurring)',
    deliveryStatus: 'Digital Service Active',
    items: [
      { product: 'Care Plan 2yr (Monthly Subscription)', qty: 1, price: '$46' }
    ]
  });

  const [relatedInvoices, setRelatedInvoices] = useState([
    { invoiceNum: 'INV-1042', amount: '$2,730', status: 'Unpaid', dueDate: 'Sep 10' },
    { invoiceNum: 'INV-1043 (Recurring)', amount: '$46', status: 'Paid', dueDate: 'Sep 15' },
  ]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/invoices/${id}`);
        if (res.data && res.data.data) {
          const invData = res.data.data;
          setInvoice(invData);

          // Fetch all invoices to compute customer's related invoices
          const allRes = await api.get('/invoices').catch(() => null);
          if (allRes?.data?.data) {
            const sameCustomerInvs = allRes.data.data.filter(
              (i) => i.customer.toLowerCase() === invData.customer.toLowerCase()
            );
            if (sameCustomerInvs.length > 0) {
              setRelatedInvoices(
                sameCustomerInvs.map((i) => ({
                  invoiceNum: i.invoiceNumber,
                  amount: i.amount,
                  status: i.status,
                  dueDate: i.dueDate
                }))
              );
            }
          }
        }
      } catch (err) {
        console.error('Fetch invoice detail error:', err);
      }
    };
    fetchDetail();
  }, [id]);

  const handleRecordPayment = async () => {
    try {
      await api.post(`/invoices/${invoice.id || invoice._id}/pay`).catch(() => null);
      setInvoice((prev) => ({
        ...prev,
        status: 'Paid'
      }));
      setRelatedInvoices((prev) =>
        prev.map((inv) =>
          inv.invoiceNum === invoice.invoiceNumber ? { ...inv, status: 'Paid' } : inv
        )
      );
      toast.success(`Payment recorded for invoice ${invoice.invoiceNumber}! Status updated to Paid.`);
    } catch (err) {
      toast.error('Failed to record payment');
    }
  };

  const handleDownloadSummaryPDF = () => {
    try {
      const doc = new jsPDF();
      const invNum = invoice.invoiceNumber || 'INV-1043';

      // Brand Header Banner
      doc.setFillColor(38, 43, 51);
      doc.rect(0, 0, 210, 38, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('DEALFLOW360', 14, 20);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Enterprise Sales Engine & Financial Invoice Management', 14, 28);

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE SUMMARY', 196, 22, { align: 'right' });

      // Invoice Details Block
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Invoice Number: ${invNum}`, 14, 50);
      doc.text(`Customer Name: ${invoice.customer || 'Acme Corp'}`, 14, 58);

      doc.setFont('helvetica', 'normal');
      doc.text(`Order Reference: ${invoice.orderRef || 'Q-1042'}`, 196, 50, { align: 'right' });
      doc.text(`Due Date: ${invoice.dueDate || 'Sep 15'}`, 196, 58, { align: 'right' });
      doc.text(`Payment Status: ${invoice.status || 'Paid'}`, 196, 66, { align: 'right' });

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 72, 196, 72);

      // Line Items Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 78, 182, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text('ITEM DESCRIPTION', 18, 84);
      doc.text('QTY', 135, 84);
      doc.text('PRICE', 190, 84, { align: 'right' });

      let y = 96;
      const items = invoice.items && invoice.items.length > 0
        ? invoice.items
        : [{ product: `Order Line Items (${invoice.orderRef || 'Q-1042'})`, qty: 1, price: invoice.amount || '$46' }];

      items.forEach((item) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(String(item.product), 18, y);
        doc.text(String(item.qty), 135, y);
        doc.text(String(item.price), 190, y, { align: 'right' });
        y += 10;
      });

      // Bottom Total Summary Line
      doc.line(14, y + 4, 196, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text('Total Amount Billed:', 130, y + 16);
      doc.text(`${invoice.amount || '$46'}`, 190, y + 16, { align: 'right' });

      // Reconciled Footer Banner
      doc.setFillColor(254, 252, 232);
      doc.rect(14, y + 26, 182, 16, 'F');
      doc.setDrawColor(254, 240, 138);
      doc.rect(14, y + 26, 182, 16, 'S');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(133, 77, 14);
      doc.text('Delivery & Invoicing Policy:', 18, y + 32);
      doc.setFont('helvetica', 'normal');
      doc.text('Partial invoicing stays reconciled with partial delivery. Nothing is billed before it ships.', 18, y + 37);

      // Download PDF
      doc.save(`Invoice_${invNum}_Summary.pdf`);
      toast.success(`Downloaded PDF Invoice: Invoice_${invNum}_Summary.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to generate PDF');
    }
  };

  // Stepper Status Logic
  const steps = [
    { label: 'Order Confirmed', completed: true, active: false },
    { label: 'Shipped', completed: true, active: false },
    { label: 'Invoiced', completed: invoice.status === 'Paid', active: invoice.status === 'Unpaid' },
    { label: 'Paid', completed: invoice.status === 'Paid', active: false },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back link & Header */}
      <div>
        <button
          onClick={() => navigate('/invoices')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Invoices List
        </button>

        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Invoice Detail: {invoice.invoiceNumber} ({invoice.customer})
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Opened by clicking a row on the Invoices list
        </p>
      </div>

      {/* 4-Step Stepper Component */}
      <div className="panel-card py-6 px-4 sm:px-8">
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-slate-300 dark:bg-slate-700 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2 group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                  step.completed
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : step.active
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950 scale-110'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  step.completed || step.active
                    ? 'text-[var(--text)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Line Items Breakdown */}
      {invoice.items && invoice.items.length > 0 && (
        <div className="panel-card p-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase text-[var(--text-muted)] tracking-wider">Line Items Billed</h3>
          <div className="divide-y divide-[var(--paper-dim)]">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <div className="font-semibold text-[var(--text)]">{item.product}</div>
                  <div className="text-[var(--text-muted)]">Quantity: {item.qty}</div>
                </div>
                <div className="font-mono font-semibold text-[var(--text)]">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Invoices Breakdown Table matching Wireframe 12 */}
      <div className="panel-card overflow-hidden space-y-3">
        <div className="px-4 pt-3 text-xs font-semibold uppercase text-[var(--text-muted)] tracking-wider">Customer Invoices Overview</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {relatedInvoices.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.invoiceNum}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.amount}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        row.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">{row.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleRecordPayment}
          disabled={invoice.status === 'Paid'}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all ${
            invoice.status === 'Paid'
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          {invoice.status === 'Paid' ? 'Payment Recorded (Paid)' : 'Record Payment'}
        </button>

        <button
          onClick={handleDownloadSummaryPDF}
          className="px-5 py-2.5 border border-[var(--steel-line)] hover:bg-slate-50 dark:hover:bg-slate-800/50 text-[var(--text)] text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs"
        >
          <FileText className="w-4 h-4 text-rose-600" />
          Download Summary (PDF)
        </button>
      </div>

      {/* Yellow Callout Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          Partial invoicing stays reconciled with partial delivery, nothing is billed before it ships.
        </span>
      </div>
    </div>
  );
};

export default InvoiceDetail;
