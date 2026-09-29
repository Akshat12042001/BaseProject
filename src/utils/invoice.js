import moment from 'moment';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const parseDate = value => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatCurrency = value => {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatCurrencyWithDecimals = value => {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatMenuBillItems = response => {
  const items = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : [];

  return items
    .filter(item => item?.name)
    .map((item, index) => ({
      id: `${String(item.name).toLowerCase()}-${index}`,
      title: item.name,
      amount: Number(item.price) || 0,
    }));
};

export const formatFoodMenuItems = response => {
  const menus = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : [];

  return menus.flatMap(menu =>
    (menu?.sections || []).flatMap(section =>
      (section?.items || [])
        .filter(item => item?.id && item?.name)
        .map(item => ({
          id: String(item.id),
          title: item.name,
          amount: Number(item.price) || 0,
        })),
    ),
  );
};

export const formatPropertyFromAddress = property => {
  const lines = [
    property.title,
    [property.addressLine1, property.addressLine2].filter(Boolean).join(', '),
    [property.city, property.state, property.postalCode].filter(Boolean).join(', '),
    property.country,
  ].filter(Boolean);

  return lines.join('\n');
};

export const formatActiveProperties = response => {
  const properties = Array.isArray(response?.data) ? response.data : [];

  return properties
    .filter(
      property =>
        String(property?.status || '').toLowerCase() === 'active' && property?.title,
    )
    .map(property => ({
      id: String(property.id),
      title: property.title,
      from: formatPropertyFromAddress(property),
    }));
};

export const buildInvoicePayload = ({
  id = '',
  from,
  to,
  paymentTerms,
  lineItems,
  deletedLineItems = [],
  taxRate,
  discountRate,
  discountAmount,
  subtotal,
  taxAmount,
  total,
  amountPaid,
  balanceDue,
  notes,
  checkIn,
  checkOut,
  metadata = {},
  status = '',
  isUpdate = false,
}) => {
  const mapBillItem = (item, index, {deleted = false} = {}) => {
    const price = Number(item.amount ?? item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const serverId = item.serverId || null;
    const payload = {
      name: String(item.name || '').trim(),
      quantity,
      price,
      total: price * quantity,
      sortOrder:
        item.sortOrder === null || item.sortOrder === undefined
          ? index
          : Number(item.sortOrder) || 0,
    };

    if (serverId) {
      payload.id = serverId;
      if (item.billId) {
        payload.billId = item.billId;
      }
      if (item.createdAt) {
        payload.createdAt = item.createdAt;
      }
      if (item.updatedAt) {
        payload.updatedAt = item.updatedAt;
      }
    }

    if (deleted) {
      payload.mode = 'delete';
    }

    return payload;
  };

  const activeItems = lineItems
    .filter(item => String(item.name || '').trim())
    .map((item, index) => mapBillItem(item, index));

  const removedItems = (deletedLineItems || [])
    .filter(item => item?.serverId)
    .map((item, index) =>
      mapBillItem(item, item.sortOrder ?? index, {deleted: true}),
    );

  const payload = {
    id: id || '',
    from: String(from || '').trim(),
    to: String(to || '').trim(),
    payment_terms: String(paymentTerms || '').trim(),
    billItems: [...activeItems, ...removedItems],
    taxRate: Number(taxRate) || 0,
    discount: {
      rate: Number(discountRate) || 0,
      price: Number(discountAmount) || 0,
    },
    subTotal: Number(subtotal) || 0,
    gst: Number(taxAmount) || 0,
    total: Number(total) || 0,
    amountPaid: Number(amountPaid) || 0,
    amountDue: Number(balanceDue) || 0,
    notes: String(notes || ''),
    checkIn: checkIn ? moment(checkIn).format('YYYY-MM-DD') : '',
    checkOut: checkOut ? moment(checkOut).format('YYYY-MM-DD') : '',
  };

  if (!isUpdate) {
    return payload;
  }

  return {
    ...payload,
    invoiceNo: metadata.invoiceNo,
    hostId: metadata.hostId,
    status: status || metadata.status || '',
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
  };
};

const parseDiscountRate = (discount, subTotal) => {
  if (discount?.rate != null && discount?.rate !== '') {
    return String(discount.rate);
  }

  const name = String(discount?.name || '').trim();
  const parsedName = Number(name.replace('%', ''));

  if (name && !Number.isNaN(parsedName)) {
    return String(parsedName);
  }

  const discountPrice = Number(discount?.price) || 0;
  const subtotalAmount = Number(subTotal) || 0;

  if (subtotalAmount > 0 && discountPrice) {
    return String((discountPrice / subtotalAmount) * 100);
  }

  return '';
};

export const formatBillDetails = response => {
  const bill = response?.data || response || {};
  const billItems = Array.isArray(bill.billItems) ? bill.billItems : [];
  const subTotal = Number(bill.subTotal) || 0;

  return {
    id: bill.id || '',
    status: bill.status || '',
    from: bill.from || '',
    to: bill.to || bill.shippedTo || '',
    paymentTerms: bill.payment_terms || bill.paymentTerms || '',
    lineItems: billItems.map((item, index) => ({
      id: String(item.id || `bill-item-${index + 1}`),
      serverId: item.id || null,
      billId: item.billId || '',
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || '',
      sortOrder: item.sortOrder ?? index,
      name: item.name || '',
      quantity:
        item.quantity === null || item.quantity === undefined
          ? ''
          : String(item.quantity),
      amount:
        item.price === null || item.price === undefined
          ? ''
          : String(item.price),
    })),
    taxRate:
      bill.taxRate === null || bill.taxRate === undefined
        ? ''
        : String(bill.taxRate),
    discountRate: parseDiscountRate(bill.discount, subTotal),
    amountPaid:
      bill.amountPaid === null || bill.amountPaid === undefined
        ? ''
        : String(bill.amountPaid),
    notes: bill.notes || '',
    checkIn: parseDate(bill.checkIn),
    checkOut: parseDate(bill.checkOut),
    metadata: {
      invoiceNo: bill.invoiceNo,
      hostId: bill.hostId,
      status: bill.status,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
    },
  };
};

const DEFAULT_BILL_LOGO_URL = 'https://www.boonies.in/Final-boonies-logo.png';

const formatBillPreviewDate = value => {
  if (!value) {
    return '';
  }

  const date = moment(value);
  return date.isValid() ? date.format('MMM D, YYYY') : '';
};

export const formatBillPreview = (response, {homestayLogo} = {}) => {
  const bill = response?.data || response || {};
  const billItems = Array.isArray(bill.billItems) ? bill.billItems : [];
  const discount = bill.discount || {};
  const discountPrice = Number(discount.price) || 0;
  const discountRate =
    discount.rate != null && discount.rate !== ''
      ? Number(discount.rate) || 0
      : Number(String(discount.name || '').replace('%', '')) || 0;
  const from = String(bill.from || '').trim();
  const invoiceNo = bill.invoiceNo || '';

  return {
    id: bill.id || '',
    invoiceNo,
    title: invoiceNo ? `Bill #${invoiceNo}` : 'Bill',
    logoUrl: String(homestayLogo || '').trim() || DEFAULT_BILL_LOGO_URL,
    businessName: from.split('\n')[0].trim(),
    to: bill.to || bill.shippedTo || '',
    createdAt: formatBillPreviewDate(bill.createdAt),
    paymentTerms: bill.payment_terms || bill.paymentTerms || '',
    dueDate: formatBillPreviewDate(bill.checkOut),
    amountDue: Number(bill.amountDue) || 0,
    items: billItems.map((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.price) || 0;

      return {
        id: String(item.id || `bill-item-${index + 1}`),
        name: item.name || '',
        quantity,
        rate,
        amount: Number(item.total) || rate * quantity,
      };
    }),
    subTotal: Number(bill.subTotal) || 0,
    taxRate: Number(bill.taxRate) || 0,
    gst: Number(bill.gst) || 0,
    discount:
      discountPrice > 0
        ? {
            rate: discountRate,
            price: discountPrice,
          }
        : null,
    total: Number(bill.total) || 0,
    notes: bill.notes || '',
  };
};

export const formatShortDate = (value, includeYear = false) => {
  const date = parseDate(value);
  if (!date) {
    return '';
  }

  const formattedDate = `${String(date.getUTCDate()).padStart(2, '0')} ${
    MONTHS[date.getUTCMonth()]
  }`;

  return includeYear
    ? `${formattedDate} ${date.getUTCFullYear()}`
    : formattedDate;
};

export const formatDateRange = (checkIn, checkOut) =>
  `${formatShortDate(checkIn)} – ${formatShortDate(checkOut, true)}`;

export const getStayNights = (checkIn, checkOut) => {
  const startDate = parseDate(checkIn);
  const endDate = parseDate(checkOut);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return startDate && endDate
    ? Math.max(
        0,
        Math.round(
          (endDate.getTime() - startDate.getTime()) / millisecondsPerDay,
        ),
      )
    : 0;
};

export const getInitials = name => {
  const words = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length > 1) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return words[0]?.slice(0, 2).toUpperCase() || '--';
};

export const formatInvoiceStatus = status => {
  const normalizedStatus = String(status || 'draft').toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
};
