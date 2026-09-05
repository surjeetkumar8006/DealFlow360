const mongoose = require('mongoose');
const env = require('../config/env');
const Product = require('../models/Product');

const seedProductsData = [
  {
    name: 'Laptop Pro 14',
    sku: 'SKU-LAP-14',
    category: 'Hardware',
    variants: '3(size)',
    price: '$1,200',
    listPrice: 1200,
    costPrice: 800,
    unit: 'Each',
    taxRate: 15,
    status: 'Active',
    description: 'High-performance enterprise laptop workstation with M3 Pro chip, 16GB RAM, 512GB SSD.',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 42,
    attributes: { color: 'Space Gray', ram: '16GB', storage: '512GB' }
  },
  {
    name: 'Onsite Setup Service',
    sku: 'SKU-SRV-SET',
    category: 'Services',
    variants: '-',
    price: '$450',
    listPrice: 450,
    costPrice: 200,
    unit: 'Each',
    taxRate: 18,
    status: 'Active',
    description: 'Professional white-glove setup, network integration, and system migration.',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 100,
    attributes: { engineerLevel: 'Senior', SLA: '24 Hours' }
  },
  {
    name: 'Docking Station',
    sku: 'SKU-ACC-DOC',
    category: 'Hardware',
    variants: '3(color)',
    price: '$180',
    listPrice: 180,
    costPrice: 100,
    unit: 'Each',
    taxRate: 15,
    status: 'Active',
    description: 'Thunderbolt 4 dual 4K dock station with 96W power delivery.',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 65,
    attributes: { color: 'Black, Silver, Space Gray' }
  },
  {
    name: 'Care Plan 3 years',
    sku: 'SKU-SUB-CARE3',
    category: 'Subscription',
    variants: '-',
    price: '$40/month',
    listPrice: 40,
    costPrice: 10,
    unit: 'Recurring',
    taxRate: 18,
    status: 'Active',
    description: '3-year extended warranty, hardware replacement guarantee, and 24/7 priority support.',
    isSubscription: true,
    recurring: 'Monthly',
    quantityOnHand: 999,
    attributes: { responseTime: '2 Hours', tier: 'Gold Enterprise' }
  },
  {
    name: 'Enterprise Cloud Backup Subscription',
    sku: 'SKU-SUB-CLOUD',
    category: 'Subscription',
    variants: '-',
    price: '$150/month',
    listPrice: 150,
    costPrice: 40,
    unit: 'Recurring',
    taxRate: 18,
    status: 'Active',
    description: 'Automated end-to-end encrypted cloud backup with unlimited retention for up to 50 users.',
    isSubscription: true,
    recurring: 'Monthly',
    quantityOnHand: 999,
    attributes: { storage: '10TB', encryption: 'AES-256' }
  },
  {
    name: 'UltraWide 34-Inch Curved Monitor',
    sku: 'SKU-MON-34',
    category: 'Hardware',
    variants: '2(stand)',
    price: '$750',
    listPrice: 750,
    costPrice: 500,
    unit: 'Each',
    taxRate: 18,
    status: 'Active',
    description: 'WQHD 144Hz IPS display with ergonomic stand and USB-C connectivity.',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 28,
    attributes: { resolution: '3440x1440', panel: 'IPS' }
  },
  {
    name: 'Network Security Gateway Firewall',
    sku: 'SKU-HW-NET-FW',
    category: 'Hardware',
    variants: '-',
    price: '$2,100',
    listPrice: 2100,
    costPrice: 1400,
    unit: 'Each',
    taxRate: 18,
    status: 'Active',
    description: 'Next-generation enterprise firewall with deep packet inspection and intrusion prevention.',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 15,
    attributes: { throughput: '10 Gbps', VPN: 'SSL/IPsec' }
  },
  {
    name: '24/7 Managed IT Support Retainer',
    sku: 'SKU-SRV-IT247',
    category: 'Services',
    variants: '-',
    price: '$1,200/month',
    listPrice: 1200,
    costPrice: 600,
    unit: 'Monthly',
    taxRate: 18,
    status: 'Active',
    description: 'Dedicated IT helpdesk engineer, proactive monitoring, and monthly security audit.',
    isSubscription: true,
    recurring: 'Monthly',
    quantityOnHand: 50,
    attributes: { coverage: '24/7 Global', channels: 'Phone, Chat, Ticket' }
  }
];

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments().catch(() => 0);
    if (count === 0) {
      console.log('Seeding initial products into MongoDB collection...');
      await Product.insertMany(seedProductsData);
      console.log(`Successfully seeded ${seedProductsData.length} products into MongoDB!`);
    } else {
      console.log(`MongoDB already contains ${count} products. Skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};

const runStandaloneSeed = async () => {
  try {
    console.log('Connecting to MongoDB for standalone seed...');
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('Connected to MongoDB. Wiping existing products & reseeding...');
    await Product.deleteMany({});
    await Product.insertMany(seedProductsData);
    console.log(`Successfully seeded ${seedProductsData.length} products into MongoDB!`);
    process.exit(0);
  } catch (err) {
    console.error('Standalone seed failed:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  runStandaloneSeed();
}

module.exports = seedProducts;
