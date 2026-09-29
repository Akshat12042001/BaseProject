import moment from 'moment';
import {COLORS} from '../constants';

export const getDefaultCheckOutDate = checkIn =>
  moment(checkIn).add(1, 'day').startOf('day').toDate();

export const getHomestayCalendarQueryRange = () => ({
  from: moment().format('YYYY-MM-DD'),
  to: moment().add(12, 'months').format('YYYY-MM-DD'),
});

export const getUnavailableDateStrings = response => {
  const items = Array.isArray(response?.unavailableDates)
    ? response.unavailableDates
    : [];

  return items.map(item => item?.date).filter(Boolean);
};

const toDateString = value => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return String(value.date || value.blockedDate || '').slice(0, 10);
};

export const getBlockedDateStrings = response => {
  const source = response?.data ?? response ?? {};
  const items = Array.isArray(source)
    ? source
    : source.blockedDates ||
      source.dates ||
      source.unavailableDates ||
      [];

  return items.map(toDateString).filter(Boolean);
};

export const getDateStringsInRange = (from, to) => {
  if (!from || !to) {
    return [];
  }

  const dates = [];
  const cursor = moment(from).startOf('day');
  const end = moment(to).startOf('day');

  if (!cursor.isValid() || !end.isValid() || cursor.isAfter(end, 'day')) {
    return [];
  }

  while (cursor.isSameOrBefore(end, 'day')) {
    dates.push(cursor.format('YYYY-MM-DD'));
    cursor.add(1, 'day');
  }

  return dates;
};

export const excludeStayDatesFromUnavailable = (
  unavailableDates = [],
  checkIn,
  checkOut,
) => {
  const stayDates = new Set(getDateStringsInRange(checkIn, checkOut));

  if (!stayDates.size) {
    return unavailableDates;
  }

  return unavailableDates.filter(date => !stayDates.has(date));
};

export const isUnavailableDate = (dateString, unavailableDates) =>
  unavailableDates.includes(dateString);

export const getNextAvailableDateAfter = (
  startDate,
  unavailableDates,
  maxDays = 90,
) => {
  let candidate = moment(startDate).startOf('day');

  for (let day = 0; day < maxDays; day += 1) {
    const dateString = candidate.format('YYYY-MM-DD');
    if (!isUnavailableDate(dateString, unavailableDates)) {
      return candidate.toDate();
    }
    candidate = candidate.add(1, 'day');
  }

  return moment(startDate).toDate();
};

export const buildBookingCalendarMarkedDates = ({
  selectedDateString,
  unavailableDates = [],
}) => {
  const marked = {};

  unavailableDates.forEach(date => {
    marked[date] = {
      disabled: true,
      disableTouchEvent: true,
      textColor: COLORS.GREYSCALE_500,
    };
  });

  if (selectedDateString) {
    marked[selectedDateString] = {
      ...(marked[selectedDateString] || {}),
      selected: true,
      selectedColor: COLORS.LOGIN_PRIMARY,
      selectedTextColor: COLORS.WHITE,
      disabled: false,
      disableTouchEvent: false,
    };
  }

  return marked;
};

export const resolveDefaultCheckOutDate = (checkIn, unavailableDates = []) =>
  getNextAvailableDateAfter(
    getDefaultCheckOutDate(checkIn),
    unavailableDates,
  );

export const findListingByTitle = (listings, title) => {
  const normalizedTitle = String(title || '').trim().toLowerCase();

  if (!normalizedTitle) {
    return null;
  }

  return (
    listings.find(
      listing =>
        String(listing?.title || '').trim().toLowerCase() === normalizedTitle,
    ) || null
  );
};

export const splitGuestFullName = fullName => {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return {firstName: '', lastName: ''};
  }

  if (parts.length === 1) {
    return {firstName: parts[0], lastName: ''};
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

export const formatGuestPhoneForApi = phone => {
  const digits = String(phone || '').replace(/\D/g, '');

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  if (String(phone || '').trim().startsWith('+')) {
    return String(phone).trim();
  }

  return digits ? `+91${digits.slice(-10)}` : '';
};

export const formatGuestPhoneForForm = phone => {
  const digits = String(phone || '').replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(-10);
  }

  return digits.slice(-10);
};

export const buildDirectBookingNote = t =>
  `${t('CREATE_BOOKING.NOTE_LINE_1')}\n\n${t('CREATE_BOOKING.NOTE_LINE_2')}\n\n${t('CREATE_BOOKING.NOTE_LINE_3')}`;

export const buildDirectBookingPayload = ({
  homestayId,
  fullName,
  email,
  phone,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  pets,
  bookingAmount,
  advancePayment,
  breakfastIncluded,
  dinnerIncluded,
  note,
}) => {
  const {firstName, lastName} = splitGuestFullName(fullName);
  const trimmedEmail = String(email || '').trim();

  return {
    homestayId,
    guest: {
      phone: formatGuestPhoneForApi(phone),
      firstName,
      lastName,
      ...(trimmedEmail ? {email: trimmedEmail} : {}),
    },
    terms: {
      checkIn: moment(checkIn).format('YYYY-MM-DD'),
      checkOut: moment(checkOut).format('YYYY-MM-DD'),
      guests: Number(adults) || 0,
      children: Number(childrenCount) || 0,
      pets: Number(pets) || 0,
      offeredPrice: Number(bookingAmount) || 0,
      advancePayment: Number(advancePayment) || 0,
      isBreakfastIncluded: !!breakfastIncluded,
      isDinnerIncluded: !!dinnerIncluded,
    },
    note,
  };
};

export const buildUpdateHostBookingPayload = ({
  homestayId,
  fullName,
  email,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  pets,
  bookingAmount,
  advancePayment,
  breakfastIncluded,
  dinnerIncluded,
  note,
}) => {
  const {firstName, lastName} = splitGuestFullName(fullName);

  return {
    guest: {
      firstName,
      lastName,
      email: String(email || '').trim(),
    },
    terms: {
      checkIn: moment(checkIn).format('YYYY-MM-DD'),
      checkOut: moment(checkOut).format('YYYY-MM-DD'),
      guests: Number(adults) || 0,
      children: Number(childrenCount) || 0,
      pets: Number(pets) || 0,
      offeredPrice: Number(bookingAmount) || 0,
      advancePayment: Number(advancePayment) || 0,
      isBreakfastIncluded: !!breakfastIncluded,
      isDinnerIncluded: !!dinnerIncluded,
    },
    homestayId,
    note,
  };
};

export const formatHostDirectBooking = booking => {
  const terms = booking?.currentTerms || {};
  const guest = booking?.guest || {};
  const homestay = booking?.conversation?.homestay || {};

  return {
    id: String(booking?.id || ''),
    homestayTitle: homestay?.title || '',
    guestName: [guest?.firstName, guest?.lastName].filter(Boolean).join(' '),
    guestPhone: guest?.phone || '',
    checkIn: terms?.checkIn || '',
    checkOut: terms?.checkOut || '',
    offeredPrice: Number(terms?.offeredPrice) || 0,
    adults: Number(terms?.guests) || 0,
  };
};

export const formatPreviewBookingDate = date => {
  if (!date) {
    return '';
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  const parsed = moment(date);

  if (!parsed.isValid()) {
    return '';
  }

  return `${parsed.date()} ${months[parsed.month()]} ${parsed.year()}`;
};

export const formatPreviewBookingTime = time => {
  if (!time) {
    return '';
  }

  const parsed = moment(time, ['HH:mm:ss', 'HH:mm', 'h:mm a'], true);
  return parsed.isValid() ? parsed.format('h:mm a') : String(time);
};

export const formatPreviewPersonName = person =>
  [person?.firstName, person?.lastName].filter(Boolean).join(' ');

export const formatPreviewPropertyAddress = homestay =>
  [
    homestay?.addressLine1,
    homestay?.addressLine2,
    homestay?.city,
    homestay?.state,
    homestay?.country,
  ]
    .map(part => String(part || '').trim())
    .filter(Boolean)
    .join(', ');

export const formatPreviewPropertyType = type =>
  String(type || '')
    .split('_')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const parsePreviewBookingNote = note => {
  const parts = String(note || '')
    .split(/\n\n+/)
    .map(part => part.trim())
    .filter(Boolean);

  if (!parts.length) {
    return {noteLines: [], noteClosing: ''};
  }

  const noteLines = [];
  const closingParts = [];

  parts.forEach(part => {
    if (/^\d+[).]/.test(part)) {
      noteLines.push(part);
      return;
    }
    closingParts.push(part);
  });

  return {
    noteLines,
    noteClosing: closingParts.join('\n\n'),
  };
};

export const getPreviewBookingNote = response => {
  const offers = Array.isArray(response?.offers) ? response.offers : [];
  const latestOffer =
    offers.find(offer => offer?.isLatest) || offers[offers.length - 1];

  if (latestOffer?.note) {
    return latestOffer.note;
  }

  const actions = Array.isArray(response?.actions) ? response.actions : [];
  return actions.find(action => action?.note)?.note || '';
};

export const formatBookingPreviewResponse = response => {
  const payload = response?.data || response;
  if (!payload?.id && !payload?.currentTerms && !payload?.conversation) {
    return null;
  }

  const terms = payload?.currentTerms || {};
  const guest = payload?.guest || {};
  const host = payload?.host || {};
  const homestay = payload?.conversation?.homestay || {};
  const images = Array.isArray(homestay?.images) ? homestay.images : [];
  const offeredPrice = Number(terms?.offeredPrice) || 0;
  const advancePayment = Number(terms?.advancePayment) || 0;
  const {noteLines, noteClosing} = parsePreviewBookingNote(
    getPreviewBookingNote(payload),
  );

  return {
    title: homestay?.title || '',
    propertyName: homestay?.title || '',
    propertyAddress: formatPreviewPropertyAddress(homestay),
    propertyImageUrl: images[0]?.imageUrl || '',
    propertyType: formatPreviewPropertyType(homestay?.propertyType),
    bedrooms: homestay?.totalBedrooms,
    bathrooms: homestay?.totalBathrooms,
    logoUrl: host?.homestayLogo?.logo || '',
    guest: {
      name: formatPreviewPersonName(guest),
      email: guest?.email || '',
      phone: guest?.phone || '',
    },
    host: {
      name: formatPreviewPersonName(host),
      email: host?.email || '',
      phone: host?.phone || '',
    },
    checkIn: {
      date: formatPreviewBookingDate(terms?.checkIn),
      time: formatPreviewBookingTime(homestay?.checkInTime),
    },
    checkOut: {
      date: formatPreviewBookingDate(terms?.checkOut),
      time: formatPreviewBookingTime(homestay?.checkOutTime),
    },
    occupancy: {
      adults: Number(terms?.guests) || 0,
      children: Number(terms?.children) || 0,
      pets: Number(terms?.pets) || 0,
    },
    inclusions: {
      breakfast: !!terms?.isBreakfastIncluded,
      dinner: !!terms?.isDinnerIncluded,
    },
    pricing: {
      offeredPrice,
      advancePayment,
      balanceDue: Math.max(0, offeredPrice - advancePayment),
    },
    noteLines,
    noteClosing,
  };
};

export const formatBookingEditFormData = response => {
  const payload = response?.data || response;
  if (!payload?.id && !payload?.currentTerms && !payload?.conversation) {
    return null;
  }

  const terms = payload?.currentTerms || {};
  const guest = payload?.guest || {};
  const homestay = payload?.conversation?.homestay || {};
  const checkInString = terms?.checkIn || '';
  const checkOutString = terms?.checkOut || '';
  const checkIn = checkInString
    ? moment(checkInString).startOf('day').toDate()
    : null;
  const checkOut = checkOutString
    ? moment(checkOutString).startOf('day').toDate()
    : null;
  const offeredPrice = terms?.offeredPrice;
  const advancePayment = terms?.advancePayment;

  return {
    bookingId: String(payload?.id || ''),
    homestayId: String(homestay?.id || ''),
    homestayTitle: homestay?.title || '',
    checkInString,
    checkOutString,
    formValues: {
      homestayId: String(homestay?.id || ''),
      homestayTitle: homestay?.title || '',
      checkIn,
      checkOut,
      fullName: formatPreviewPersonName(guest),
      email: guest?.email || '',
      phone: formatGuestPhoneForForm(guest?.phone),
      bookingAmount:
        offeredPrice == null || offeredPrice === ''
          ? ''
          : String(offeredPrice),
      advancePayment:
        advancePayment == null || advancePayment === ''
          ? ''
          : String(advancePayment),
    },
    adults: Math.max(1, Number(terms?.guests) || 1),
    children: Number(terms?.children) || 0,
    pets: Number(terms?.pets) || 0,
    breakfastIncluded: !!terms?.isBreakfastIncluded,
    dinnerIncluded: !!terms?.isDinnerIncluded,
  };
};

export const formatBookingInvoicePrefill = (
  response,
  propertyOptions = [],
  roomRentPendingLabel = 'Room Rent Pending',
) => {
  const payload = response?.data || response;
  if (!payload?.id && !payload?.currentTerms && !payload?.conversation) {
    return null;
  }

  const terms = payload?.currentTerms || {};
  const guest = payload?.guest || {};
  const homestay = payload?.conversation?.homestay || {};
  const offeredPrice = Number(terms?.offeredPrice) || 0;
  const advancePayment = Number(terms?.advancePayment) || 0;
  const pendingAmount = Math.max(0, offeredPrice - advancePayment);
  const guestName = formatPreviewPersonName(guest);
  const billTo = guestName;

  const normalizedTitle = String(homestay?.title || '')
    .trim()
    .toLowerCase();
  const matchedProperty = propertyOptions.find(
    property =>
      String(property?.title || '')
        .trim()
        .toLowerCase() === normalizedTitle,
  );

  const fromAddress =
    matchedProperty?.title || String(homestay?.title || '').trim();

  const lineItems =
    offeredPrice > advancePayment && pendingAmount > 0
      ? [
          {
            id: '1',
            serverId: null,
            name: roomRentPendingLabel,
            quantity: '1',
            amount: String(pendingAmount),
          },
        ]
      : [{id: '1', serverId: null, name: '', quantity: '', amount: ''}];

  return {
    checkIn: terms?.checkIn
      ? moment(terms.checkIn).startOf('day').toDate()
      : null,
    checkOut: terms?.checkOut
      ? moment(terms.checkOut).startOf('day').toDate()
      : null,
    fromAddress,
    selectedFromPropertyId: matchedProperty?.id || null,
    billTo,
    amountPaid: '',
    notes: '',
    lineItems,
    nextItemId: lineItems.length + 1,
  };
};

export const formatHostDirectBookings = response => {
  const bookings = Array.isArray(response?.data) ? response.data : [];
  return bookings.map(formatHostDirectBooking);
};

export const BOOKING_LIST_FILTER_SCOPE = {
  ACTIVE_UPCOMING: 'activeUpcoming',
  ALL: 'all',
};

export const getHostDirectBookingsQueryParams = ({
  page = 1,
  limit = 10,
  search = '',
  checkInFrom = null,
  checkOutFrom = null,
  isActiveUpcoming = true,
} = {}) => {
  const params = {page, limit};

  const trimmedSearch = String(search || '').trim();
  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  if (checkInFrom) {
    params.checkInFrom = moment(checkInFrom).format('YYYY-MM-DD');
  }

  if (checkOutFrom) {
    params.checkOutFrom = moment(checkOutFrom).format('YYYY-MM-DD');
  } else if (isActiveUpcoming) {
    params.checkOutFrom = moment().format('YYYY-MM-DD');
  }

  if (isActiveUpcoming) {
    params.sortBy = 'checkIn';
    params.sortOrder = 'asc';
  }

  return params;
};

export const formatHostListingsDropdown = response => {
  const listings = Array.isArray(response?.data) ? response.data : [];

  return listings
    .filter(
      listing =>
        listing?.title && String(listing?.status || '').toLowerCase() === 'active',
    )
    .map(listing => ({
      id: String(listing.id),
      title: listing.title,
      maxGuests: Number(listing.maxGuests) || 1,
    }));
};
