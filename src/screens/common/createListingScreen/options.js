export const PROPERTY_TYPES = [
  {id: 'entire_home', title: 'Entire Home'},
  {id: 'private_room', title: 'Private Room'},
];

export const isEntireHomeType = value => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

  return normalized === 'entire_home' || normalized === 'entire_homestay';
};

export const createEmptyRentalOption = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  bedrooms: '1',
  beds: '1',
  pricePerNight: '0',
  offSeasonPrice: '',
  units: '1',
  maxGuests: '1',
  bathrooms: '1',
  description: '',
  attachedBathroom: false,
  hasBalcony: false,
});

export const DISTANCE_UNITS = [
  {id: 'kilometers', title: 'Kilometers'},
  {id: 'meters', title: 'Meters'},
];

export const WALKING_DISTANCE_UNITS = [
  {id: 'meters', title: 'Meters'},
  {id: 'kilometers', title: 'Kilometers'},
];

export const SUITABLE_FOR_OPTIONS = [
  {id: 'couples', title: 'Couples'},
  {id: 'families', title: 'Families'},
  {id: 'group-of-friends', title: 'Group of Friends'},
];

export const MINIMUM_STAY_OPTIONS = [
  {id: 'daily', title: 'Daily'},
  {id: 'weekly', title: 'Weekly'},
  {id: 'monthly', title: 'Monthly'},
];
