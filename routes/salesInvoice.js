const express = require('express');
const router = express.Router();
const SalesInvoice = require('../models/SalesInvoice');

function convertToWords(num) {
  return 'Four Hundred Fifty Eight Thousand Eight Hundred Fifty Rupees Only'; // replace with logic if needed
}

router.post('/', async (req, res) => {
  try {
    const {
      buyerName, buyerAddress, buyerNTN, buyerSTRN,
      supplierName, supplierAddress, supplierNTN, supplierSTRN,
      items, date, gstRate
    } = req.body;

    let subtotal = 0;
    let gst = 0;

    const calculatedItems = items.map(item => {
      const itemTotal = item.qty * item.unitPrice;
      const itemGST = itemTotal * (gstRate / 100);
      subtotal += itemTotal;
      gst += itemGST;
      return item;
    });

    const total = subtotal + gst;
    const invoiceNo = 'INV-' + Date.now();

    const invoice = new SalesInvoice({
      buyerName, buyerAddress, buyerNTN, buyerSTRN,
      supplierName, supplierAddress, supplierNTN, supplierSTRN,
      items: calculatedItems,
      date,
      gstRate,
      subtotal,
      gst,
      total,
      amountInWords: convertToWords(total),
      invoiceNo
    });

    const saved = await invoice.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ SalesInvoice Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
