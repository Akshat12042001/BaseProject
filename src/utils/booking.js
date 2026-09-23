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
