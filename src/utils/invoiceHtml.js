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
  value && moment(value).isValid() ? moment(value).format('MMM D, YYYY') : '-';

const formatAmount = value => {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getBusinessName = value => String(value ?? '').split('\n')[0].trim();

const createLogoMarkup = (logoUrl, businessName) =>
  logoUrl
    ? `<img class="brand-logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(businessName || 'Homestay logo')}" />`
    : '';

const createItemRows = items =>
  items
    .map(item => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.price) || 0;
      const amount = Number(item.total) || rate * quantity;

      return `
        <tr>
          <td class="col-item">${escapeHtml(item.name)}</td>
          <td class="col-qty">${quantity}</td>
          <td class="col-rate">${formatAmount(rate)}</td>
          <td class="col-amount amount-bold">${formatAmount(amount)}</td>
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
    <div class="summary-row">
      <span>Discount (${Number(discountRate) || 0}%)</span>
      <span>${formatAmount(discount.price)}</span>
    </div>
  `;
};

const createNotesSection = notes => {
  if (!String(notes || '').trim()) {
    return '';
  }

  return `
    <section class="notes">
      <div class="notes-label">Notes</div>
      <p>${formatText(notes)}</p>
    </section>
  `;
};

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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 13px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice {
            display: flex;
            flex-direction: column;
            min-height: 297mm;
            padding: 28px 36px 24px;
            width: 210mm;
          }

          .header {
            align-items: flex-start;
            display: flex;
            justify-content: space-between;
            margin-bottom: 36px;
          }

          .brand-logo {
            display: block;
            height: auto;
            max-height: 42px;
            max-width: 160px;
            object-fit: contain;
          }

          .business-name {
            color: #111111;
            font-size: 14px;
            font-weight: 400;
            margin-top: 10px;
          }

          .invoice-heading {
            text-align: right;
          }

          .invoice-heading h1 {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
            line-height: 1;
            margin: 0;
          }

          .invoice-number {
            color: #8a8a8a;
            font-size: 13px;
            margin-top: 8px;
          }

          .meta-section {
            border-bottom: 1px solid #e8e8e8;
            display: grid;
            gap: 24px;
            grid-template-columns: 1fr 1fr;
            margin-bottom: 0;
            padding-bottom: 22px;
          }

          .bill-to-label {
            color: #8a8a8a;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.8px;
            margin-bottom: 6px;
            text-transform: uppercase;
          }

          .bill-to-name {
            font-size: 16px;
            font-weight: 700;
          }

          .meta-right {
            text-align: right;
          }

          .meta-row {
            color: #111111;
            display: flex;
            font-size: 13px;
            justify-content: flex-end;
            margin-bottom: 6px;
          }

          .meta-row span:first-child {
            color: #8a8a8a;
            margin-right: 10px;
            min-width: 108px;
            text-align: right;
          }

          .meta-row span:last-child {
            min-width: 120px;
            text-align: right;
          }

          .balance-highlight {
            border-top: 1px solid #e8e8e8;
            margin-top: 10px;
            padding-top: 12px;
          }

          .balance-highlight .meta-row span:first-child {
            color: #8a8a8a;
            font-size: 12px;
          }

          .balance-highlight .balance-amount {
            font-size: 18px;
            font-weight: 700;
          }

          .items-table {
            border-collapse: collapse;
            margin-top: 0;
            width: 100%;
          }

          .items-table thead th {
            border-bottom: 1px solid #e8e8e8;
            color: #8a8a8a;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.8px;
            padding: 14px 0 10px;
            text-transform: uppercase;
          }

          .items-table tbody td {
            border-bottom: 1px solid #e8e8e8;
            font-size: 14px;
            padding: 16px 0;
            vertical-align: top;
          }

          .col-item {
            text-align: left;
            width: 42%;
          }

          .col-qty {
            text-align: center;
            width: 16%;
          }

          .col-rate,
          .col-amount {
            text-align: right;
            width: 21%;
          }

          .amount-bold {
            font-weight: 700;
          }

          .summary {
            margin-left: auto;
            margin-top: 18px;
            width: 280px;
          }

          .summary-row {
            display: flex;
            font-size: 14px;
            justify-content: space-between;
            margin-bottom: 8px;
          }

          .summary-row span:first-child {
            color: #111111;
          }

          .summary-divider {
            border-top: 1px solid #e8e8e8;
            margin: 10px 0 12px;
          }

          .summary-row.total-row,
          .summary-row.balance-row {
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .notes {
            margin-top: 36px;
          }

          .notes-label {
            color: #8a8a8a;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.8px;
            margin-bottom: 6px;
            text-transform: uppercase;
          }

          .notes p {
            color: #444444;
            font-size: 13px;
            margin: 0;
            white-space: normal;
          }

          .powered-by {
            color: #9a9a9a;
            font-size: 11px;
            font-style: italic;
            margin-top: auto;
            padding-top: 48px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <main class="invoice">
          <header class="header">
            <div class="brand">
              ${createLogoMarkup(homestayLogo, businessName)}
              ${businessName ? `<div class="business-name">${formatText(businessName)}</div>` : ''}
            </div>
            <div class="invoice-heading">
              <h1>INVOICE</h1>
              <div class="invoice-number"># ${escapeHtml(invoice?.invoiceNo)}</div>
            </div>
          </header>

          <section class="meta-section">
            <div>
              <div class="bill-to-label">Bill To</div>
              <div class="bill-to-name">${formatText(invoice?.to)}</div>
            </div>
            <div class="meta-right">
              <div class="meta-row">
                <span>Date</span>
                <span>${formatDate(invoice?.createdAt)}</span>
              </div>
              <div class="meta-row">
                <span>Payment Terms</span>
                <span>${formatText(invoice?.payment_terms) || '-'}</span>
              </div>
              <div class="meta-row">
                <span>Due Date</span>
                <span>${formatDate(invoice?.checkOut)}</span>
              </div>
              <div class="balance-highlight">
                <div class="meta-row">
                  <span>Balance Due</span>
                  <span class="balance-amount">${formatAmount(invoice?.amountDue)}</span>
                </div>
              </div>
            </div>
          </section>

          <table class="items-table">
            <thead>
              <tr>
                <th class="col-item">Item</th>
                <th class="col-qty">Quantity</th>
                <th class="col-rate">Rate</th>
                <th class="col-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${createItemRows(items)}
            </tbody>
          </table>

          <section class="summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${formatAmount(invoice?.subTotal)}</span>
            </div>
            <div class="summary-row">
              <span>Tax (${Number(invoice?.taxRate) || 0}%)</span>
              <span>${formatAmount(invoice?.gst)}</span>
            </div>
            ${createDiscountRow(invoice?.discount)}
            <div class="summary-divider"></div>
            <div class="summary-row total-row">
              <span>Total</span>
              <span>${formatAmount(invoice?.total)}</span>
            </div>
            <div class="summary-row balance-row">
              <span>Balance Due</span>
              <span>${formatAmount(invoice?.amountDue)}</span>
            </div>
          </section>

          ${createNotesSection(invoice?.notes)}

          <footer class="powered-by">Powered by Boonies</footer>
        </main>
      </body>
    </html>
  `;
};

export default createInvoiceHtml;
