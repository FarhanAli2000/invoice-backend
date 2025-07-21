const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Invoice = require('./models/Invoice');
const salesInvoiceRoutes = require('./routes/salesInvoice');

const app = express();
const port = 3000;

const mongoURI = 'mongodb+srv://syedfarhanali2760:JfQ2REFeRQ0mkTjV@cluster0.d61fczm.mongodb.net/invoiceDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

const cors = require('cors');

app.use(cors({
  origin: ['https://invoice-frontend-coral.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api/sales-invoice', salesInvoiceRoutes);

function convertToWords(amount) {
  return 'Four Hundred Fifty Eight Thousand Eight Hundred Fifty Rupees Only';
}

app.post('/api/invoice', async (req, res) => {
  const {
    supplierName, supplierAddress, supplierNTN, supplierSTRN,
    buyerName, buyerAddress, buyerNTN, buyerSTRN,
    items, date, gstRate
  } = req.body;

  if (!supplierName || !supplierAddress || !buyerName || !items || items.length === 0) {
    return res.status(400).json({ error: "Supplier name, address, buyer name, and at least one item are required!" });
  }

  const rate = gstRate || 15;
  let subtotal = 0;
  let gst = 0;

  const updatedItems = items.map((item) => {
    const itemTotal = item.qty * item.unitPrice;
    const itemGST = itemTotal * (rate / 100);
    const itemInclusive = itemTotal + itemGST;

    subtotal += itemTotal;
    gst += itemGST;

    return {
      ...item,
      gstValue: itemGST,
      inclusiveTotal: itemInclusive
    };
  });

  const total = subtotal + gst;

  const invoiceData = {
    invoiceNo: `INV-${Date.now()}`,
    date,
    supplierName, supplierAddress, supplierNTN, supplierSTRN,
    buyerName, buyerAddress, buyerNTN, buyerSTRN,
    items: updatedItems,
    subtotal,
    gst,
    total,
    gstRate: rate,
    amountInWords: convertToWords(total)
  };

  try {
    const savedInvoice = await Invoice.create(invoiceData);
    res.json(savedInvoice);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
