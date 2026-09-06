const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Quotation = require('../models/Quotation');
const Invoice = require('../models/Invoice');
const seedProducts = require('./seedProducts');

const seedCustomersData = [
  { name: 'Acme Corp', email: 'contact@acme.com', companyName: 'Acme Corp', tier: 'Silver', phone: '+1-555-0101', creditLimit: 75000 },
  { name: 'Delta LLC', email: 'info@deltallc.com', companyName: 'Delta LLC', tier: 'Bronze', phone: '+1-555-0102', creditLimit: 25000 },
  { name: 'Test', email: 'admin@testcorp.com', companyName: 'Test Corp', tier: 'Gold', phone: '+1-555-0103', creditLimit: 100000 },
  { name: 'Beta Industries', email: 'procurement@betaind.com', companyName: 'Beta Industries', tier: 'Gold', phone: '+1-555-0104', creditLimit: 150000 },
  { name: 'New Prod.', email: 'orders@newprod.com', companyName: 'New Prod. Inc', tier: 'Gold', phone: '+1-555-0105', creditLimit: 120000 },
  { name: 'Nova Retail', email: 'supply@novaretail.com', companyName: 'Nova Retail', tier: 'Gold', phone: '+1-555-0106', creditLimit: 90000 },
  { name: 'Zenith Co', email: 'billing@zenithco.com', companyName: 'Zenith Co', tier: 'Silver', phone: '+1-555-0107', creditLimit: 60000 },
  { name: 'Orion Ltd', email: 'deals@orionltd.com', companyName: 'Orion Ltd', tier: 'Gold', phone: '+1-555-0108', creditLimit: 200000 }
];

const seedQuotationsData = [
  // Draft (3)
  {
    quoteNumber: 'Q-1002',
    customerName: 'Delta LLC',
    customerTier: 'Bronze',
    salesRep: 'Rahul Sharma',
    priceList: 'Standard Retail 2026',
    totalAmount: 3200,
    discountPercentage: 4,
    riskScore: 2.1,
    riskLevel: 'LOW',
    status: 'DRAFT',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-11', product: 'Standard Support Package', qty: 1, price: 3200, discount: 4, limit: 5 }
    ]
  },
  {
    quoteNumber: 'Q-1003',
    customerName: 'Beta Industries',
    customerTier: 'Gold',
    salesRep: 'Rahul Sharma',
    priceList: 'Enterprise Partner 2026',
    totalAmount: 24148,
    discountPercentage: 18,
    riskScore: 18.5,
    riskLevel: 'HIGH',
    status: 'PENDING_APPROVAL',
    ceilingViolation: 'Setup Service discount given is 18% (Allowed Gold tier ceiling is 15%). Exceeds threshold by 3 points.',
    lineItems: [
      { id: 'l-12', product: 'Enterprise Server Node', qty: 1, price: 15000, discount: 15, limit: 15 },
      { id: 'l-13', product: 'Onsite Setup Service', qty: 1, price: 11156, discount: 18, limit: 15 }
    ]
  },
  {
    quoteNumber: 'Q-1001',
    customerName: 'Acme Corp',
    customerTier: 'Silver',
    salesRep: 'Surjeet Kumar',
    priceList: 'Standard Enterprise 2026',
    totalAmount: 12400,
    discountPercentage: 8,
    riskScore: 4.2,
    riskLevel: 'LOW',
    status: 'DRAFT',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-10', product: 'Cloud Workstation License (Monthly)', qty: 10, price: 1240, discount: 8, limit: 15 }
    ]
  },

  // Pending Approval (2)
  {
    quoteNumber: 'Q-9635',
    customerName: 'Test',
    customerTier: 'Gold',
    salesRep: 'Surjeet Kumar',
    priceList: 'Enterprise Partner 2026',
    totalAmount: 34600,
    discountPercentage: 12,
    riskScore: 9.5,
    riskLevel: 'MEDIUM',
    status: 'PENDING_APPROVAL',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-96', product: 'Enterprise Server Node Cluster', qty: 2, price: 17300, discount: 12, limit: 15 }
    ]
  },
  {
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    customerTier: 'Silver',
    salesRep: 'Surjeet Kumar',
    priceList: 'Standard Enterprise 2026',
    totalAmount: 2970,
    discountPercentage: 14,
    riskScore: 18.5,
    riskLevel: 'HIGH',
    status: 'PENDING_APPROVAL',
    ceilingViolation: 'Onsite Setup Service discount 18% exceeds line limit ceiling of 10% by 8 points.',
    lineItems: [
      { id: 'l-1', product: 'Laptop Pro 14', qty: 2, price: 1200, discount: 12, limit: 15 },
      { id: 'l-2', product: 'Onsite Setup Service', qty: 1, price: 450, discount: 18, limit: 10 },
      { id: 'l-3', product: 'Docking Station', qty: 1, price: 180, discount: 10, limit: 15 }
    ]
  },

  // Approved (2)
  {
    quoteNumber: 'Q-6685',
    customerName: 'New Prod.',
    customerTier: 'Gold',
    salesRep: 'Priya Verma',
    priceList: 'Enterprise Partner 2026',
    totalAmount: 34600,
    discountPercentage: 10,
    riskScore: 6.2,
    riskLevel: 'LOW',
    status: 'APPROVED',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-66', product: 'High Performance Infrastructure Package', qty: 1, price: 34600, discount: 10, limit: 15 }
    ]
  },
  {
    quoteNumber: 'Q-1004',
    customerName: 'Nova Retail',
    customerTier: 'Gold',
    salesRep: 'Priya Verma',
    priceList: 'Standard Retail 2026',
    totalAmount: 9750,
    discountPercentage: 10,
    riskScore: 5.5,
    riskLevel: 'LOW',
    status: 'APPROVED',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-14', product: 'POS Hardware Terminal', qty: 5, price: 1950, discount: 10, limit: 15 }
    ]
  },

  // Negotiation (1)
  {
    quoteNumber: 'Q-1005',
    customerName: 'Zenith Co',
    customerTier: 'Silver',
    salesRep: 'Surjeet Kumar',
    priceList: 'Standard Enterprise 2026',
    totalAmount: 15300,
    discountPercentage: 12,
    riskScore: 11.2,
    riskLevel: 'MEDIUM',
    status: 'NEGOTIATION',
    ceilingViolation: 'Portal negotiation active: Customer requested 12% discount.',
    lineItems: [
      { id: 'l-15', product: 'Storage Array Appliance', qty: 2, price: 7650, discount: 12, limit: 10 }
    ]
  },

  // Confirmed (1)
  {
    quoteNumber: 'Q-1006',
    customerName: 'Orion Ltd',
    customerTier: 'Gold',
    salesRep: 'Priya Verma',
    priceList: 'Enterprise Partner 2026',
    totalAmount: 41000,
    discountPercentage: 15,
    riskScore: 9.8,
    riskLevel: 'MEDIUM',
    status: 'CONFIRMED',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-16', product: 'Data Center Infrastructure Bundle', qty: 1, price: 41000, discount: 15, limit: 15 }
    ]
  }
];

const seedInvoicesData = [
  {
    invoiceNumber: 'INV-1006',
    customer: 'Orion Ltd',
    amount: '$41,000',
    numericAmount: 41000,
    status: 'Unpaid',
    dueDate: 'Sep 25',
    createdDate: 'Aug 24, 2026',
    orderRef: 'Q-1006',
    deliveryStatus: 'Order Confirmed - Split Allocation Pending',
    items: [
      { product: 'Data Center Infrastructure Bundle', qty: 1, price: '$41,000' }
    ]
  },
  {
    invoiceNumber: 'INV-1042',
    customer: 'Acme Corp',
    amount: '$2,730',
    numericAmount: 2730,
    status: 'Unpaid',
    dueDate: 'Sep 10',
    createdDate: 'Aug 20, 2026',
    orderRef: 'Q-1042',
    deliveryStatus: 'Split Allocated (East Depot + Main Warehouse)',
    items: [
      { product: 'Laptop Pro 14', qty: 2, price: '$2,280' },
      { product: 'Onsite Setup Service', qty: 1, price: '$450' }
    ]
  },
  {
    invoiceNumber: 'INV-1043',
    customer: 'Acme Corp',
    amount: '$46',
    numericAmount: 46,
    status: 'Paid',
    dueDate: 'Sep 15',
    createdDate: 'Aug 15, 2026',
    orderRef: 'Q-1042 (Recurring)',
    deliveryStatus: 'Digital Service Active',
    items: [
      { product: 'Care Plan 2yr (Monthly Subscription)', qty: 1, price: '$46' }
    ]
  },
  {
    invoiceNumber: 'INV-1038',
    customer: 'Nova Retail',
    amount: '$9,750',
    numericAmount: 9750,
    status: 'Paid',
    dueDate: 'Aug 30',
    createdDate: 'Aug 15, 2026',
    orderRef: 'Q-1004',
    deliveryStatus: 'Fully Delivered (West Hub)',
    items: [
      { product: 'POS Hardware Terminal', qty: 5, price: '$9,750' }
    ]
  },
  {
    invoiceNumber: 'INV-1035',
    customer: 'Beta Industries',
    amount: '$1,200',
    numericAmount: 1200,
    status: 'Unpaid',
    dueDate: 'Oct 05',
    createdDate: 'Aug 22, 2026',
    orderRef: 'Q-1039',
    deliveryStatus: 'Partial Delivery (East Depot)',
    items: [
      { product: 'Support SLA (Quarterly)', qty: 1, price: '$1,200' }
    ]
  }
];

const seedAllData = async () => {
  try {
    console.log('Seeding products...');
    await seedProducts();

    const customerCount = await Customer.countDocuments().catch(() => 0);
    if (customerCount === 0) {
      console.log('Seeding initial customers into MongoDB...');
      await Customer.insertMany(seedCustomersData);
      console.log(`Successfully seeded ${seedCustomersData.length} customers into MongoDB!`);
    }

    const quotationCount = await Quotation.countDocuments().catch(() => 0);
    if (quotationCount === 0) {
      console.log('Seeding initial quotations into MongoDB...');
      await Quotation.insertMany(seedQuotationsData);
      console.log(`Successfully seeded ${seedQuotationsData.length} quotations into MongoDB!`);
    }

    const invoiceCount = await Invoice.countDocuments().catch(() => 0);
    if (invoiceCount === 0) {
      console.log('Seeding initial invoices into MongoDB...');
      await Invoice.insertMany(seedInvoicesData);
      console.log(`Successfully seeded ${seedInvoicesData.length} invoices into MongoDB!`);
    }
  } catch (err) {
    console.error('Error during master DB seed:', err.message);
  }
};

module.exports = seedAllData;
