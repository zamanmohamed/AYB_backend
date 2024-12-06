const jsPDF = require('jspdf');

const generateInvoice = async (order) => {
  const doc = new jsPDF();
  doc.text(`Order ID: ${order._id}`, 10, 10);
  doc.text(`Product: ${order.product.name}`, 10, 20);
  doc.text(`Quantity: ${order.quantity}`, 10, 30);
  doc.text(`Total: $${order.product.price * order.quantity}`, 10, 40);
  
  const invoice = `invoices/${order._id}.pdf`;
  doc.save(invoice);
  
  return invoice;
};

module.exports = { generateInvoice };
