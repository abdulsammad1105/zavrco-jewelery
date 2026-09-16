import emailjs from '@emailjs/nodejs';
import { formatOrderId } from './order-id';

export async function sendOrderConfirmationEmail(order: any) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn('EmailJS skipped: Missing one or more environment variables.');
    return;
  }

  const customerEmail = String(order.customerEmail || order.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    console.log('EmailJS skipped: No valid customer email provided.');
    return;
  }

  let formattedItems = '';
  if (Array.isArray(order.items)) {
    formattedItems = order.items
      .map((item: any) => `${item.name || item.title} × ${item.quantity || item.units || 1}`)
      .join('\n');
  } else if (typeof order.items === 'string') {
    formattedItems = order.items;
  } else {
    formattedItems = 'N/A';
  }

  const rawId = order.id ?? order.order_id;
  const formattedId = typeof rawId === 'number' ? formatOrderId(rawId) : (rawId || 'N/A');

  const rawTotal = order.total ?? order.order_total;
  const totalNumber = typeof rawTotal === 'number' ? rawTotal : parseFloat(rawTotal);
  const formattedTotal = !Number.isNaN(totalNumber)
    ? `Rs. ${totalNumber.toLocaleString('en-PK')}`
    : (rawTotal || 'N/A');

  const templateVars = {
    to_email: customerEmail,
    to_name: order.customerName || order.name || 'Valued Customer',
    order_id: formattedId,
    order_total: formattedTotal,
    order_items: formattedItems,
    order_status: order.status || 'pending',
    customer_address: order.address || order.shippingAddress || order.customer_address || 'N/A',
    payment_method: order.paymentMethod || order.payment_method || 'Cash on Delivery',
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateVars, {
      publicKey,
      privateKey,
    });
    console.log('Order confirmation email sent successfully:', response.status, response.text);
  } catch (error: any) {
    const status = error?.status ?? 'unknown';
    const text = error?.text ?? error?.message ?? String(error);
    console.error('Failed to send order confirmation email:', { status, text, templateVars: { ...templateVars, to_email: customerEmail } });
  }
}