// models/SalesInvoice.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  desc: String,
  qty: Number,
  unitPrice: Number,
});

const SalesInvoiceSchema = new mongoose.Schema({
  buyerName: String,
  buyerAddress: String,
  buyerNTN: String,
  buyerSTRN: String,
  supplierName: String,
  supplierAddress: String,
  supplierNTN: String,
  supplierSTRN: String,
  items: [ItemSchema],
  date: String,
  gstRate: Number,
  subtotal: Number,
  gst: Number,
  total: Number,
  amountInWords: String,
  invoiceNo: String
}, { timestamps: true });

module.exports = mongoose.model('SalesInvoice', SalesInvoiceSchema);
