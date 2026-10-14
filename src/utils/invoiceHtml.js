import moment from 'moment';

const PAGE_HEIGHT_PX = 1100;

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

const formatAmountFixed = value => {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getBusinessName = value => String(value ?? '').split('\n')[0].trim();

const getDensityClass = (itemCount, notes) => {
  const notesLength = String(notes || '').trim().length;

  if (itemCount > 14 || notesLength > 500) {
    return 'density-dense';
  }

  if (itemCount > 8 || notesLength > 220) {
    return 'density-compact';
  }

  return '';
};

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
          <td class="col-rate">${formatAmountFixed(rate)}</td>
          <td class="col-amount">${formatAmountFixed(amount)}</td>
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
      <span class="summary-label">Discount (${Number(discountRate) || 0}%)</span>
      <span class="summary-value">${formatAmountFixed(discount.price)}</span>
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
  const densityClass = getDensityClass(items.length, invoice?.notes);

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

          html,
          body {
            margin: 0;
            padding: 0;
            width: 210mm;
            background: #ffffff;
            color: #111111;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 13px;
            line-height: 1.45;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice {
            display: flex;
            flex-direction: column;
            min-height: 297mm;
            padding: 28px 32px 24px;
            width: 210mm;
          }

          .header {
            align-items: flex-start;
            display: flex;
            justify-content: space-between;
            margin-bottom: 32px;
          }

          .brand {
            flex: 1;
            margin-right: 16px;
          }

          .brand-logo {
            display: block;
            height: auto;
            margin-bottom: 10px;
            max-height: 40px;
            max-width: 160px;
            object-fit: contain;
          }

          .business-name {
            color: #111111;
            font-size: 13px;
            font-weight: 500;
            line-height: 1.4;
          }

          .invoice-heading {
            text-align: right;
          }

          .invoice-heading h1 {
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 1px;
            line-height: 1;
            margin: 0 0 6px;
          }

          .invoice-number {
            color: #6b7280;
            font-size: 13px;
          }

          .meta-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 28px;
          }

          .bill-to-block {
            flex: 1;
            margin-right: 24px;
          }

          .bill-to-label {
            color: #9ca3af;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.8px;
            margin-bottom: 8px;
            text-transform: uppercase;
          }

          .bill-to-name {
            font-size: 15px;
            font-weight: 700;
          }

          .meta-right {
            min-width: 200px;
          }

          .meta-row {
            display: flex;
            font-size: 12px;
            justify-content: space-between;
            margin-bottom: 8px;
          }

          .meta-row .meta-label {
            color: #9ca3af;
            margin-right: 20px;
            white-space: nowrap;
          }

          .meta-row .meta-value {
            color: #111111;
            font-weight: 500;
            text-align: right;
          }

          .balance-block {
            border-top: 1px solid #e5e7eb;
            margin-top: 8px;
            padding-top: 12px;
          }

          .balance-label {
            color: #9ca3af;
            display: block;
            font-size: 12px;
            margin-bottom: 2px;
          }

          .balance-amount {
            color: #111111;
            font-size: 18px;
            font-weight: 700;
          }

          .items-table {
            border-collapse: collapse;
            margin-top: 4px;
            width: 100%;
          }

          .items-table thead th {
            border-bottom: 1px solid #e5e7eb;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.6px;
            padding: 10px 8px;
            text-transform: uppercase;
          }

          .items-table tbody td {
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
            padding: 14px 8px;
            vertical-align: top;
          }

          .col-item {
            text-align: left;
            width: 44%;
          }

          .col-qty {
            text-align: center;
            width: 16%;
          }

          .col-rate {
            color: #6b7280;
            text-align: right;
            width: 20%;
          }

          .col-amount {
            font-weight: 700;
            text-align: right;
            width: 20%;
          }

          .summary {
            margin-left: auto;
            margin-top: 20px;
            width: 240px;
          }

          .summary-row {
            display: flex;
            font-size: 13px;
            justify-content: space-between;
            margin-bottom: 8px;
          }

          .summary-label {
            color: #9ca3af;
            margin-right: 24px;
            white-space: nowrap;
          }

          .summary-value {
            color: #111111;
            min-width: 100px;
            text-align: right;
          }

          .summary-row.muted .summary-value {
            color: #9ca3af;
          }

          .summary-divider {
            background: #e5e7eb;
            height: 1px;
            margin: 8px 0 12px;
          }

          .summary-row.total-row {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .summary-row.total-row .summary-label,
          .summary-row.total-row .summary-value {
            color: #111111;
          }

          .notes {
            margin-top: 28px;
          }

          .notes-label {
            color: #9ca3af;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.6px;
            margin-bottom: 6px;
            text-transform: uppercase;
          }

          .notes p {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
            margin: 0;
            white-space: normal;
          }

          .powered-by {
            color: #9ca3af;
            font-size: 11px;
            margin-top: auto;
            padding-top: 40px;
            text-align: center;
          }

          .density-compact .header {
            margin-bottom: 20px;
          }

          .density-compact .invoice-heading h1 {
            font-size: 22px;
          }

          .density-compact .items-table tbody td {
            font-size: 12px;
            padding: 10px 6px;
          }

          .density-compact .items-table thead th {
            font-size: 9px;
            padding: 8px 6px;
          }

          .density-compact .summary-row,
          .density-compact .meta-row {
            font-size: 12px;
            margin-bottom: 4px;
          }

          .density-compact .notes {
            margin-top: 16px;
          }

          .density-compact .powered-by {
            padding-top: 20px;
          }

          .density-dense .header {
            margin-bottom: 14px;
          }

          .density-dense .brand-logo {
            max-height: 32px;
          }

          .density-dense .invoice-heading h1 {
            font-size: 20px;
          }

          .density-dense .business-name,
          .density-dense .bill-to-name {
            font-size: 12px;
          }

          .density-dense .items-table thead th {
            font-size: 9px;
            padding: 6px 4px;
          }

          .density-dense .items-table tbody td {
            font-size: 11px;
            padding: 7px 4px;
          }

          .density-dense .summary-row,
          .density-dense .meta-row,
          .density-dense .notes p,
          .density-dense .balance-label {
            font-size: 11px;
            margin-bottom: 3px;
          }

          .density-dense .balance-amount {
            font-size: 15px;
          }

          .density-dense .summary-row.total-row {
            font-size: 12px;
          }

          .density-dense .notes {
            margin-top: 12px;
          }

          .density-dense .powered-by {
            font-size: 10px;
            padding-top: 12px;
          }
        </style>
      </head>
      <body>
        <main class="invoice ${densityClass}">
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
            <div class="bill-to-block">
              <div class="bill-to-label">Bill To</div>
              <div class="bill-to-name">${formatText(invoice?.to)}</div>
            </div>
            <div class="meta-right">
              <div class="meta-row">
                <span class="meta-label">Date</span>
                <span class="meta-value">${formatDate(invoice?.createdAt)}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Payment Terms</span>
                <span class="meta-value">${formatText(invoice?.payment_terms) || '-'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Due Date</span>
                <span class="meta-value">${formatDate(invoice?.checkOut)}</span>
              </div>
              <div class="balance-block">
                <span class="balance-label">Balance Due</span>
                <span class="balance-amount">${formatAmountFixed(invoice?.amountDue)}</span>
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
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">${formatAmountFixed(invoice?.subTotal)}</span>
            </div>
            <div class="summary-row muted">
              <span class="summary-label">Tax (${Number(invoice?.taxRate) || 0}%)</span>
              <span class="summary-value">${formatAmountFixed(invoice?.gst)}</span>
            </div>
            ${createDiscountRow(invoice?.discount)}
            <div class="summary-divider"></div>
            <div class="summary-row total-row">
              <span class="summary-label">Total</span>
              <span class="summary-value">${formatAmountFixed(invoice?.total)}</span>
            </div>
            <div class="summary-row total-row">
              <span class="summary-label">Balance Due</span>
              <span class="summary-value">${formatAmountFixed(invoice?.amountDue)}</span>
            </div>
          </section>

          ${createNotesSection(invoice?.notes)}

          <footer class="powered-by">Powered by Boonies</footer>
        </main>
        <script>
          (function () {
            var pageHeight = ${PAGE_HEIGHT_PX};
            var root = document.documentElement;
            var invoice = document.querySelector('.invoice');

            if (!invoice) {
              return;
            }

            root.style.zoom = '1';
            invoice.style.minHeight = '0';
            var contentHeight = invoice.scrollHeight;
            invoice.style.minHeight = '';

            if (contentHeight > pageHeight) {
              root.style.zoom = String(Math.max(0.35, pageHeight / contentHeight));
            }
          })();
        </script>
      </body>
    </html>
  `;
};

export default createInvoiceHtml;
