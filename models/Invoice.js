const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  qty: Number,
  desc: String,
  unitPrice: Number,
  gstValue: Number,
  inclusiveTotal: Number
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: String,
  date: String,
  supplierName: String,
  supplierAddress: String,
  supplierNTN: String,
  supplierSTRN: String,
  buyerName: String,
  buyerAddress: String,
  buyerNTN: String,
  buyerSTRN: String,
  items: [ItemSchema],
  subtotal: Number,
  gst: Number,
  total: Number,
  gstRate: Number,
  amountInWords: String
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
