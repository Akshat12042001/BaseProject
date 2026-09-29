const DEFAULT_LOGO_URL = 'https://www.boonies.in/Final-boonies-logo.png';

const escapeHtml = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const displayValue = value => {
  if (value === 0) {
    return '0';
  }

  const text = String(value ?? '').trim();
  return text || '—';
};

const formatInr = value => {
  const amount = Number(value) || 0;
  return `INR ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatStayCell = (date, time) => {
  const dateText = displayValue(date);
  const timeText = String(time || '').trim();
  const line = timeText ? `${dateText}, ${timeText}` : dateText;
  return `<div class="cell-primary">${escapeHtml(line)}</div>`;
};

const createFieldBlock = (label, valueHtml) => `
  <div class="field">
    <div class="field-label">${escapeHtml(label)}</div>
    <div class="field-value">${valueHtml}</div>
  </div>
`;

const createNoteMarkup = (noteLines = [], noteClosing = '') => {
  const lines = [
    ...(Array.isArray(noteLines) ? noteLines : []),
    noteClosing,
  ]
    .map(line => String(line || '').trim())
    .filter(Boolean);

  if (!lines.length) {
    return '';
  }

  const body = lines
    .map(line => `<p>${escapeHtml(line)}</p>`)
    .join('');

  return `
    <section class="note">
      <div class="note-title">Note :</div>
      <div class="note-body">${body}</div>
    </section>
  `;
};

export const createDealSummaryHtml = data => {
  const propertyName = displayValue(data?.propertyName || data?.title);
  const logoUrl = DEFAULT_LOGO_URL;
  const propertyImageUrl = data?.propertyImageUrl || '';
  const propertyAddress = String(data?.propertyAddress || '').trim();
  const guest = data?.guest || {};
  const host = data?.host || {};
  const checkIn = data?.checkIn || {};
  const checkOut = data?.checkOut || {};
  const occupancy = data?.occupancy || {};
  const inclusions = data?.inclusions || {};
  const pricing = data?.pricing || {};

  const adults = Number(occupancy.adults) || 0;
  const children = Number(occupancy.children) || 0;
  const pets = Number(occupancy.pets) || 0;
  const breakfastLabel = inclusions.breakfast ? 'Breakfast' : 'No Breakfast';
  const dinnerLabel = inclusions.dinner ? 'Dinner' : 'No Dinner';

  const offeredPrice = Number(pricing.offeredPrice) || 0;
  const advancePayment = Number(pricing.advancePayment) || 0;
  const balanceDue =
    pricing.balanceDue != null
      ? Number(pricing.balanceDue) || 0
      : Math.max(0, offeredPrice - advancePayment);

  const guestContact = [guest.email, guest.phone]
    .map(value => String(value || '').trim())
    .filter(Boolean)
    .map(value => `<div>${escapeHtml(value)}</div>`)
    .join('') || '<div>—</div>';

  const hostContact = [host.email, host.phone]
    .map(value => String(value || '').trim())
    .filter(Boolean)
    .map(value => `<div>${escapeHtml(value)}</div>`)
    .join('') || '<div>—</div>';

  const propertyImageMarkup = propertyImageUrl
    ? `<img class="property-image" src="${escapeHtml(propertyImageUrl)}" alt="${escapeHtml(propertyName)}" />`
    : `<div class="property-image placeholder"></div>`;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Deal Summary - ${escapeHtml(propertyName)}</title>
        <style>
          @page {
            size: A4;
            margin: 14mm 12mm 12mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
          }

          body {
            color: #1f2937;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 12px;
            line-height: 1.45;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .document {
            display: flex;
            flex-direction: column;
            min-height: 0;
            width: 100%;
            padding: 8px 10px 0;
          }

          .brand {
            text-align: center;
            margin-bottom: 12px;
            padding-top: 4px;
          }

          .brand-logo {
            display: inline-block;
            height: 36px;
            max-width: 160px;
            object-fit: contain;
          }

          .property-card {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            background: #ffffff;
            padding: 16px;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }

          .property-top {
            display: table;
            width: 100%;
            table-layout: fixed;
          }

          .property-image-cell,
          .property-copy-cell {
            display: table-cell;
            vertical-align: top;
          }

          .property-image-cell {
            width: 168px;
            padding-right: 16px;
          }

          .property-copy-cell {
            padding-top: 2px;
            padding-left: 2px;
          }

          .property-image {
            width: 168px;
            height: 118px;
            border-radius: 10px;
            object-fit: cover;
            background: #eef2f0;
            display: block;
          }

          .property-image.placeholder {
            width: 168px;
            height: 118px;
          }

          .eyebrow {
            color: #8ea0b2;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin: 0 0 6px;
          }

          .property-title {
            color: #163a5f;
            font-size: 20px;
            font-weight: 700;
            line-height: 1.25;
            margin: 0 0 8px;
          }

          .property-address {
            color: #6b7280;
            font-size: 11px;
            line-height: 1.5;
            margin: 0;
          }

          .specs {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-top: 14px;
            border: 1px solid #e8edf2;
            border-radius: 10px;
            background: #f7f9fb;
            overflow: hidden;
          }

          .spec {
            display: table-cell;
            width: 33.33%;
            padding: 10px 12px;
            vertical-align: top;
          }

          .spec + .spec {
            border-left: 1px solid #e8edf2;
          }

          .spec-label {
            color: #8ea0b2;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            margin-bottom: 4px;
          }

          .spec-value {
            color: #111827;
            font-size: 13px;
            font-weight: 700;
          }

          .field {
            margin-bottom: 8px;
          }

          .field:last-child {
            margin-bottom: 0;
          }

          .field-label {
            color: #8ea0b2;
            font-size: 10px;
            font-weight: 600;
            margin-bottom: 2px;
          }

          .field-value {
            color: #111827;
            font-size: 12px;
            line-height: 1.45;
          }

          .field-value .strong {
            font-size: 13px;
            font-weight: 700;
          }

          .people-wrap {
            position: relative;
            margin: 0 0 10px;
            page-break-inside: avoid;
          }

          .people-wrap::before {
            content: 'BOONIES';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(-20deg);
            font-size: 48px;
            font-weight: 800;
            letter-spacing: 0.12em;
            color: rgba(22, 58, 95, 0.045);
            white-space: nowrap;
            pointer-events: none;
            z-index: 0;
          }

          .people-table {
            position: relative;
            z-index: 1;
            width: 100%;
            border-collapse: collapse;
          }

          .people-cell {
            width: 50%;
            padding: 0;
            border: none;
            vertical-align: top;
            background: transparent;
          }

          .people-gap {
            width: 10px;
            border: none;
            padding: 0;
            background: transparent;
          }

          .people-card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: #f8fafc;
            padding: 12px;
          }

          .section {
            margin-bottom: 10px;
            page-break-inside: avoid;
          }

          .section-heading {
            display: table;
            margin: 0 0 6px;
          }

          .section-accent,
          .section-title {
            display: table-cell;
            vertical-align: middle;
          }

          .section-accent {
            width: 4px;
            height: 14px;
            border-radius: 2px;
            background: #1e4b7a;
          }

          .section-title {
            padding-left: 8px;
            color: #163a5f;
            font-size: 14px;
            font-weight: 700;
          }

          table.data-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #d7e0ea;
            border-radius: 8px;
            overflow: hidden;
          }

          table.data-table thead th {
            background: #163a5f;
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-align: left;
            padding: 8px 10px;
          }

          table.data-table tbody td {
            padding: 8px 10px;
            vertical-align: top;
            border-top: 1px solid #e5e7eb;
            color: #374151;
            font-size: 11px;
            background: #ffffff;
          }

          .stay-table th,
          .stay-table td {
            width: 25%;
          }

          .cell-primary {
            color: #111827;
            font-weight: 700;
            font-size: 11px;
            line-height: 1.4;
          }

          .cell-stack {
            color: #4b5563;
            font-size: 11px;
            line-height: 1.45;
          }

          .pricing-table th:last-child,
          .pricing-table td:last-child {
            text-align: right;
            white-space: nowrap;
            width: 28%;
          }

          .pricing-table thead th {
            padding: 6px 10px;
            font-size: 9px;
          }

          .pricing-table tbody td {
            padding: 6px 10px;
            font-size: 11px;
          }

          .pricing-table tbody tr:last-child td {
            background: #eaf3fb;
            color: #163a5f;
            font-weight: 700;
          }

          .amount {
            font-weight: 700;
            color: #111827;
          }

          .balance-amount {
            color: #1e4b7a;
            font-weight: 800;
            font-size: 12px;
          }

          .note {
            border: 1px solid #f3d7a6;
            border-left: 5px solid #d97706;
            border-radius: 10px;
            background: #fff8e8;
            padding: 10px 12px;
            margin-top: 2px;
            margin-bottom: 10px;
          }

          .note-title {
            color: #9a3412;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .note-body p {
            margin: 0 0 4px;
            color: #92400e;
            font-size: 11px;
            line-height: 1.45;
          }

          .note-body p:last-child {
            margin-bottom: 0;
          }

          .footer {
            margin-top: 8px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 11px;
            font-style: italic;
            page-break-inside: avoid;
            page-break-before: avoid;
          }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="brand">
            <img class="brand-logo" src="${escapeHtml(logoUrl)}" alt="Boonies" />
          </div>

          <section class="property-card">
            <div class="property-top">
              <div class="property-image-cell">
                ${propertyImageMarkup}
              </div>
              <div class="property-copy-cell">
                <div class="eyebrow">PROPERTY DETAILS</div>
                <h1 class="property-title">${escapeHtml(propertyName)}</h1>
                ${
                  propertyAddress
                    ? `<p class="property-address">${escapeHtml(propertyAddress)}</p>`
                    : ''
                }
              </div>
            </div>
            <div class="specs">
              <div class="spec">
                <div class="spec-label">PROPERTY TYPE</div>
                <div class="spec-value">${escapeHtml(displayValue(data?.propertyType))}</div>
              </div>
              <div class="spec">
                <div class="spec-label">BEDROOMS</div>
                <div class="spec-value">${escapeHtml(displayValue(data?.bedrooms))}</div>
              </div>
              <div class="spec">
                <div class="spec-label">BATHROOMS</div>
                <div class="spec-value">${escapeHtml(displayValue(data?.bathrooms))}</div>
              </div>
            </div>
          </section>

          <div class="people-wrap">
            <table class="people-table">
              <tr>
                <td class="people-cell">
                  <div class="people-card">
                    <div class="eyebrow">GUEST DETAILS</div>
                    ${createFieldBlock(
                      'Guest Name',
                      `<div class="strong">${escapeHtml(displayValue(guest.name))}</div>`,
                    )}
                    ${createFieldBlock('Contact', guestContact)}
                  </div>
                </td>
                <td class="people-gap"></td>
                <td class="people-cell">
                  <div class="people-card">
                    <div class="eyebrow">HOST DETAILS</div>
                    ${createFieldBlock(
                      'Host Name',
                      `<div class="strong">${escapeHtml(displayValue(host.name))}</div>`,
                    )}
                    ${createFieldBlock('Contact', hostContact)}
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <section class="section">
            <div class="section-heading">
              <div class="section-accent"></div>
              <div class="section-title">Stay Details</div>
            </div>
            <table class="data-table stay-table">
              <thead>
                <tr>
                  <th>CHECK-IN</th>
                  <th>CHECK-OUT</th>
                  <th>OCCUPANCY</th>
                  <th>INCLUSIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${formatStayCell(checkIn.date, checkIn.time)}</td>
                  <td>${formatStayCell(checkOut.date, checkOut.time)}</td>
                  <td>
                    <div class="cell-stack">
                      <div>${adults} Adults</div>
                      <div>${children} Children</div>
                      <div>${pets} Pets</div>
                    </div>
                  </td>
                  <td>
                    <div class="cell-stack">
                      <div>${escapeHtml(breakfastLabel)}</div>
                      <div>${escapeHtml(dinnerLabel)}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="section">
            <div class="section-heading">
              <div class="section-accent"></div>
              <div class="section-title">Pricing Summary</div>
            </div>
            <table class="data-table pricing-table">
              <thead>
                <tr>
                  <th>PAYMENT ITEM</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Offered Stay Price</td>
                  <td class="amount">${formatInr(offeredPrice)}</td>
                </tr>
                <tr>
                  <td>Advance Payment</td>
                  <td class="amount">${formatInr(advancePayment)}</td>
                </tr>
                <tr>
                  <td>Balance Due at Check-in</td>
                  <td class="balance-amount">${formatInr(balanceDue)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          ${createNoteMarkup(data?.noteLines, data?.noteClosing)}

          <div class="footer">Powered By Boonies</div>
        </div>
      </body>
    </html>
  `;
};

export default createDealSummaryHtml;
