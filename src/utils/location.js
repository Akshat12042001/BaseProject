const NOMINATIM_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'BooniesHostApp/1.0',
};

const joinParts = (...parts) =>
  parts
    .map(part => String(part || '').trim())
    .filter(Boolean)
    .join(', ');

export const formatLocationAddress = payload => {
  const address = payload?.address || {};
  const road = joinParts(address.house_number, address.road);
  const locality =
    address.suburb ||
    address.neighbourhood ||
    address.village ||
    address.hamlet ||
    address.county ||
    '';
  const city =
    address.city ||
    address.town ||
    address.municipality ||
    address.village ||
    address.county ||
    '';
  const state = address.state || address.region || '';
  const postalCode = String(address.postcode || '').replace(/[^\d]/g, '').slice(0, 6);
  const addressLine1 =
    road ||
    locality ||
    payload?.name ||
    String(payload?.display_name || '')
      .split(',')
      .slice(0, 2)
      .join(',')
      .trim();
  const addressLine2 = road && locality && locality !== city ? locality : '';

  return {
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    latitude: Number(payload?.lat),
    longitude: Number(payload?.lon),
  };
};

export const reverseGeocodeLocation = async (latitude, longitude) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=18&lat=${encodeURIComponent(
      latitude,
    )}&lon=${encodeURIComponent(longitude)}`,
    {headers: NOMINATIM_HEADERS},
  );

  if (!response.ok) {
    throw new Error('REVERSE_GEOCODE_FAILED');
  }

  const payload = await response.json();
  return formatLocationAddress(payload);
};

export const searchLocation = async query => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(
      query,
    )}`,
    {headers: NOMINATIM_HEADERS},
  );

  if (!response.ok) {
    throw new Error('SEARCH_FAILED');
  }

  const results = await response.json();
  return Array.isArray(results) ? results[0] : null;
};
