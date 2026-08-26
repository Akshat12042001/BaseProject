import moment from 'moment';

const escapeHtml = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const formatText = value => escapeHtml(value).replace(/\n/g, '<br />');

const formatDate = value =>
  value && moment(value).isValid() ? moment(value).format('MMM DD, YYYY') : '-';

const formatAmount = value => {
  const amount = Number(value) || 0;
  return `Rs ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const createItemRows = items =>
  items
    .map(item => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.price) || 0;
      const amount = Number(item.total) || rate * quantity;

      return `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${quantity}</td>
          <td>${formatAmount(rate)}</td>
          <td>${formatAmount(amount)}</td>
        </tr>
      `;
    })
    .join('');

const createDiscountRow = discount => {
  if (!discount?.isOpen) {
    return '';
  }

  const discountRate = String(discount.name || '').replace('%', '').trim();

  return `
    <div class="total-row">
      <span>Discount (${Number(discountRate) || 0}%):</span>
      <span>${formatAmount(discount.price)}</span>
    </div>
  `;
};

const BOONIES_LOGO_URL = 'https://www.boonies.in/Final-boonies-logo.png';

const getBusinessName = value => String(value ?? '').split('\n')[0].trim();

const createLogoMarkup = logoUrl =>
  logoUrl
    ? `<img class="homestay-logo" src="${escapeHtml(logoUrl)}" alt="Homestay logo" />`
    : '';

export const createInvoiceHtml = invoice => {
  const items = Array.isArray(invoice?.billItems) ? invoice.billItems : [];
  const businessName = getBusinessName(invoice?.from);
  const homestayLogo = invoice?.homestayLogo || '';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice #${escapeHtml(invoice?.invoiceNo)}</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #ffffff;
            color: #111111;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.45;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice {
            display: flex;
            flex-direction: column;
            min-height: 297mm;
            padding: 16mm 18mm;
            position: relative;
            width: 210mm;
          }

          .invoice-content {
            position: relative;
            z-index: 1;
          }

          .watermark {
            left: 50%;
            opacity: 0.06;
            pointer-events: none;
            position: absolute;
            top: 52%;
            transform: translate(-50%, -50%);
            width: 220px;
            z-index: 0;
          }

          .header {
            align-items: flex-start;
            display: flex;
            justify-content: space-between;
          }

          .brand {
            max-width: 52%;
          }

          .homestay-logo {
            display: block;
            height: auto;
            margin-bottom: 10px;
            max-height: 56px;
            max-width: 180px;
            object-fit: contain;
          }

          .business-name {
            font-size: 18px;
            font-weight: 700;
          }

          .invoice-heading {
            text-align: right;
          }

          .invoice-heading h1 {
            font-size: 32px;
            line-height: 1;
            margin: 0 0 8px;
          }

          .invoice-number {
            font-size: 13px;
          }

          .details {
            display: grid;
            gap: 24px;
            grid-template-columns: 1fr 1.1fr;
            margin-top: 38px;
          }

          .label {
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .detail-row {
            display: grid;
            gap: 16px;
            grid-template-columns: 1fr 1fr;
            margin-bottom: 10px;
          }

          .detail-row span:first-child {
            text-align: right;
          }

          .detail-row span:last-child {
            text-align: right;
          }

          .balance-row {
            background: #f1f1f1;
            font-weight: 700;
            padding: 6px 10px;
          }

          table {
            border-collapse: collapse;
            margin-top: 48px;
            width: 100%;
          }

          th {
            background: #434343;
            color: #ffffff;
            font-size: 11px;
            padding: 8px 10px;
            text-align: left;
          }

          td {
            padding: 8px 10px;
            vertical-align: top;
          }

          th:nth-child(1),
          td:nth-child(1) {
            width: 38%;
          }

          th:nth-child(2),
          td:nth-child(2) {
            width: 18%;
          }

          th:nth-child(3),
          td:nth-child(3),
          th:nth-child(4),
          td:nth-child(4) {
            width: 22%;
          }

          .totals {
            margin-left: auto;
            margin-top: 28px;
            width: 42%;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }

          .grand-total {
            font-weight: 700;
            margin-top: 18px;
          }

          .additional-info {
            margin-top: 64px;
          }

          .info-section {
            margin-bottom: 30px;
          }

          .info-section h2 {
            font-size: 12px;
            margin: 0 0 8px;
          }

          .info-section p {
            margin: 0;
            white-space: normal;
          }

          .powered-by {
            color: #666666;
            font-size: 11px;
            margin-top: auto;
            padding-top: 48px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <main class="invoice">
          <img
            class="watermark"
            src="${escapeHtml(BOONIES_LOGO_URL)}"
            alt="Boonies watermark"
          />

          <div class="invoice-content">
          <header class="header">
            <div class="brand">
              ${createLogoMarkup(homestayLogo)}
              <div class="business-name">${formatText(businessName)}</div>
            </div>
            <div class="invoice-heading">
              <h1>INVOICE</h1>
              <div class="invoice-number"># ${escapeHtml(invoice?.invoiceNo)}</div>
            </div>
          </header>

          <section class="details">
            <div>
              <div class="label">Bill To:</div>
              <div>${formatText(invoice?.to)}</div>
            </div>
            <div>
              <div class="detail-row">
                <span>Date:</span>
                <span>${formatDate(invoice?.createdAt)}</span>
              </div>
              <div class="detail-row">
                <span>Payment Terms:</span>
                <span>${formatText(invoice?.payment_terms) || '-'}</span>
              </div>
              <div class="detail-row">
                <span>Due Date:</span>
                <span>${formatDate(invoice?.checkOut)}</span>
              </div>
              <div class="detail-row balance-row">
                <span>Balance Due:</span>
                <span>${formatAmount(invoice?.amountDue)}</span>
              </div>
            </div>
          </section>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${createItemRows(items)}
            </tbody>
          </table>

          <section class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatAmount(invoice?.subTotal)}</span>
            </div>
            <div class="total-row">
              <span>Tax (${Number(invoice?.taxRate) || 0}%):</span>
              <span>${formatAmount(invoice?.gst)}</span>
            </div>
            ${createDiscountRow(invoice?.discount)}
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>${formatAmount(invoice?.total)}</span>
            </div>
          </section>

          <section class="additional-info">
            <div class="info-section">
              <h2>Notes</h2>
              <p>${formatText(invoice?.notes) || '-'}</p>
            </div>
          </section>
          </div>

          <footer class="powered-by">Powered by Boonies</footer>
        </main>
      </body>
    </html>
  `;
};

export default createInvoiceHtml;
