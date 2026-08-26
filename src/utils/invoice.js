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
  metadata = {},
  from,
  to,
  paymentTerms,
  lineItems,
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
}) => ({
  ...(id ? metadata : {}),
  id,
  from,
  to,
  shippedTo: to,
  payment_terms: paymentTerms,
  billItems: lineItems
    .filter(item => item.name.trim())
    .map(item => {
      const price = Number(item.amount) || 0;
      const quantity = Number(item.quantity) || 0;
      const billItem = {
        name: item.name.trim(),
        price,
        quantity,
        total: price * quantity,
      };

      return item.billId
        ? {
            id: item.id,
            billId: item.billId,
            ...billItem,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }
        : billItem;
    }),
  taxRate: Number(taxRate) || 0,
  discount: {
    isOpen: Boolean(Number(discountRate)),
    name: `${Number(discountRate) || 0}%`,
    price: Number(discountAmount) || 0,
  },
  shipping: {
    isOpen: false,
    name: '',
    price: 0,
  },
  subTotal: subtotal,
  gst: taxAmount,
  total,
  amountPaid: Number(amountPaid) || 0,
  amountDue: balanceDue,
  notes,
  terms: '',
  checkIn: checkIn?.toISOString() || null,
  checkOut: checkOut?.toISOString() || null,
});

const parseDiscountRate = (discount, subTotal) => {
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
      billId: item.billId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
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
