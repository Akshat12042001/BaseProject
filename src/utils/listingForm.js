import moment from 'moment';

const formatPropertyType = type =>
  String(type || '')
    .split('_')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const TIME_FORMAT = 'hh:mm A';

const PROPERTY_TYPE_TITLES = {
  entire_home: 'Entire Home',
  private_room: 'Private Room',
  homestay: 'Homestay',
  villa: 'Villa',
  cottage: 'Cottage',
  apartment: 'Apartment',
  farmstay: 'Farmstay',
  guest_house: 'Guest House',
};

const DISTANCE_UNITS = {
  km: 'kilometers',
  kilometer: 'kilometers',
  kilometers: 'kilometers',
  m: 'meters',
  meter: 'meters',
  meters: 'meters',
};

const SUITABLE_FOR_IDS = {
  couples: 'couples',
  families: 'families',
  'group of friends': 'group-of-friends',
};

const questionById = questions =>
  (Array.isArray(questions) ? questions : []).reduce((lookup, question) => {
    if (question?.id) {
      lookup[question.id] = question;
    }
    return lookup;
  }, {});

const asDigits = value => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return String(value).replace(/[^\d]/g, '');
};

const formatAmount = value => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const amount = Number(value);
  return Number.isNaN(amount) ? String(value) : amount.toFixed(2);
};

const formatListingTime = value => {
  if (!value) {
    return '';
  }

  const parsed = moment(String(value), ['HH:mm:ss', 'HH:mm', TIME_FORMAT], true);
  return parsed.isValid() ? parsed.format(TIME_FORMAT) : '';
};

const distanceUnit = value =>
  DISTANCE_UNITS[String(value || '').trim().toLowerCase()] || '';

const propertyTypeTitle = value => {
  const raw = String(value || '').trim();

  if (!raw) {
    return '';
  }

  const slug = raw.toLowerCase().replace(/[\s-]+/g, '_');
  return PROPERTY_TYPE_TITLES[slug] || formatPropertyType(raw);
};

const suitableForIds = question =>
  (question?.selectedOptions || [])
    .map(option => {
      const title = typeof option === 'string' ? option : option?.title || option?.id;
      return SUITABLE_FOR_IDS[String(title || '').trim().toLowerCase()] || '';
    })
    .filter(Boolean);

const formatPhotos = images => {
  const photos = (Array.isArray(images) ? images : [])
    .filter(image => image?.imageUrl)
    .slice()
    .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0))
    .map((image, index) => ({
      id: image.id || `${image.imageUrl}-${index}`,
      uri: image.imageUrl,
      name: image.caption || `Image ${index + 1}`,
      type: 'image/jpeg',
      featured: Boolean(image.isPrimary),
      existing: true,
    }));

  if (photos.length && !photos.some(photo => photo.featured)) {
    photos[0] = {...photos[0], featured: true};
  }

  return photos;
};

const isEntireLabel = label => /entire/i.test(String(label || ''));

const formatRentalOptions = rooms => {
  const list = Array.isArray(rooms) ? rooms : [];
  const additional = list.filter(room => !isEntireLabel(room?.label));

  return additional.map((room, index) => ({
    id: room.id || `option-${index}`,
    name: room.label || '',
    bedrooms: asDigits(room.bedrooms) || '1',
    beds: asDigits(room.beds) || '1',
    pricePerNight: formatAmount(room.roomPrice) || '0',
    offSeasonPrice: formatAmount(room.offSeasonRoomPrice),
    units: asDigits(room.quantity) || '1',
    maxGuests: asDigits(room.guests) || '1',
    bathrooms: asDigits(room.bathrooms) || '1',
    description: room.description || '',
    attachedBathroom: Boolean(room.attachedBathroom),
    hasBalcony: Boolean(room.hasBalcony),
  }));
};

export const formatListingFormData = listing => {
  const questions = questionById(listing?.listingQuestions);
  const distance = questions.distance_from_main_town || {};
  const walking = questions.walking_distance_from_parking || {};
  const parking = questions.parking;
  const amenities = Array.isArray(listing?.amenities) ? listing.amenities : [];
  const rooms = Array.isArray(listing?.rooms) ? listing.rooms : [];
  const entireRoom = rooms.find(room => isEntireLabel(room?.label)) || rooms[0];
  const propertyType = propertyTypeTitle(listing?.propertyType);

  return {
    basicInfo: {
      propertyTitle: listing?.title || '',
      description: listing?.description || '',
      addressLine1: listing?.addressLine1 || '',
      addressLine2: listing?.addressLine2 || '',
      city: listing?.city || '',
      state: listing?.state || '',
      postalCode: asDigits(listing?.postalCode),
      propertyType,
      latitude:
        listing?.latitude === null || listing?.latitude === undefined
          ? ''
          : String(listing.latitude),
      longitude:
        listing?.longitude === null || listing?.longitude === undefined
          ? ''
          : String(listing.longitude),
      guests: asDigits(listing?.maxGuests),
      bedrooms: asDigits(listing?.totalBedrooms),
      beds: asDigits(listing?.totalBeds ?? entireRoom?.beds) || '1',
      bathrooms: asDigits(listing?.totalBathrooms),
      entireDescription: entireRoom?.description || '',
      rentalOptions: /entire/i.test(propertyType)
        ? formatRentalOptions(rooms)
        : [],
      houseRules: listing?.houseRules || '',
      cancellationPolicy: listing?.cancellationPolicyId || 'none',
    },
    questions: {
      distanceFromTown: asDigits(distance.answer),
      distanceUnit: distanceUnit(distance.distanceType) || 'kilometers',
      offRoad: Boolean(questions.off_road?.booleanAnswer),
      walkingDistance: asDigits(walking.answer),
      walkingUnit: distanceUnit(walking.distanceType) || 'meters',
      privateParking: parking ? parking.booleanAnswer === false : false,
      stairClimb: Boolean(questions.stairs_access?.booleanAnswer),
      suitableFor: suitableForIds(questions.suitable_for),
    },
    pricing: {
      pricePerDay: formatAmount(listing?.pricePerDay),
      weeklyStays: Boolean(listing?.isWeeklyAvailable),
      pricePerWeek: formatAmount(listing?.pricePerWeek),
      monthlyStays: Boolean(listing?.isMonthlyAvailable),
      pricePerMonth: formatAmount(listing?.pricePerMonth),
      offSeasonPrices: [
        listing?.offSeasonPricePerDay,
        listing?.offSeasonPricePerWeek,
        listing?.offSeasonPricePerMonth,
      ].some(price => price !== null && price !== undefined && price !== ''),
      offSeasonPricePerDay: formatAmount(listing?.offSeasonPricePerDay),
      offSeasonPricePerMonth: formatAmount(listing?.offSeasonPricePerMonth),
      cleaningFee: formatAmount(listing?.cleaningFee),
      securityDeposit: formatAmount(listing?.securityDeposit),
      minimumStay: listing?.minStayDuration || '',
      checkInTime: formatListingTime(listing?.checkInTime),
      checkOutTime: formatListingTime(listing?.checkOutTime),
    },
    amenities: {
      amenities: amenities
        .map(amenity => amenity?.id)
        .filter(Boolean),
    },
    addOns: {
      kitchenAccess: Boolean(listing?.isKitchenAvailable),
      foodServices: Boolean(listing?.isFoodAvailable),
      vegetarian: Boolean(listing?.isVegetarian),
      nonVegetarian: Boolean(listing?.isNonVegetarian),
      mealPlan: Boolean(listing?.isMealPlan),
      petFriendly: Boolean(listing?.isPet),
      instantBooking: Boolean(listing?.instantBooking),
    },
    photos: formatPhotos(listing?.images),
  };
};

const PROPERTY_TYPE_SLUGS = Object.entries(PROPERTY_TYPE_TITLES).reduce(
  (lookup, [slug, title]) => {
    lookup[title.toLowerCase()] = slug;
    return lookup;
  },
  {},
);

const SUITABLE_FOR_TITLES = {
  couples: 'Couples',
  families: 'Families',
  'group-of-friends': 'Group of Friends',
};

const toNumber = value => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const amount = Number(value);
  return Number.isNaN(amount) ? null : amount;
};

const toCount = value => {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
};

const buildRoomsFromForm = (basicInfo, pricing) => {
  const pricePerDay = toNumber(pricing?.pricePerDay);
  const offSeasonPrice = pricing?.offSeasonPrices
    ? toNumber(pricing?.offSeasonPricePerDay)
    : null;
  const guests = toCount(basicInfo?.guests);
  const bedrooms = toCount(basicInfo?.bedrooms);
  const bathrooms = toCount(basicInfo?.bathrooms);
  const beds = toCount(basicInfo?.beds) || 1;
  const isEntire = /entire/i.test(String(basicInfo?.propertyType || ''));

  const primaryRoom = {
    label: isEntire ? 'Entire Homestay' : 'Private Room',
    description: isEntire ? basicInfo?.entireDescription || '' : '',
    beds,
    bedrooms,
    guests,
    bathrooms,
    quantity: 1,
    roomPrice: pricePerDay,
    offSeasonRoomPrice: offSeasonPrice,
    attachedBathroom: false,
    hasBalcony: false,
  };

  if (!isEntire) {
    return [primaryRoom];
  }

  const additionalRooms = (basicInfo?.rentalOptions || []).map(option => {
    const room = {
      label: option.name || '',
      description: option.description || '',
      beds: toCount(option.beds) || 1,
      bedrooms: toCount(option.bedrooms) || 1,
      guests: toCount(option.maxGuests) || 1,
      bathrooms: toCount(option.bathrooms) || 1,
      quantity: toCount(option.units) || 1,
      roomPrice: toNumber(option.pricePerNight) ?? 0,
      offSeasonRoomPrice: toNumber(option.offSeasonPrice),
      attachedBathroom: Boolean(option.attachedBathroom),
      hasBalcony: Boolean(option.hasBalcony),
    };
    const optionId = option.id;
    const isClientId =
      !optionId ||
      /^option-\d+$/.test(String(optionId)) ||
      /^\d+-[a-z0-9]+$/i.test(String(optionId));

    return isClientId ? room : {...room, id: optionId};
  });

  return [primaryRoom, ...additionalRooms];
};

const toApiTime = value => {
  if (!value) {
    return '';
  }

  const parsed = moment(String(value), [TIME_FORMAT, 'HH:mm:ss', 'HH:mm'], true);
  return parsed.isValid() ? parsed.format('HH:mm:ss') : String(value);
};

const toDistanceType = unit => (unit === 'meters' ? 'm' : 'km');

const propertyTypeSlug = title => {
  const normalized = String(title || '').trim().toLowerCase();
  return PROPERTY_TYPE_SLUGS[normalized] || normalized.replace(/[\s-]+/g, '_');
};

const originalQuestion = (listing, id) =>
  (Array.isArray(listing?.listingQuestions) ? listing.listingQuestions : []).find(
    question => question?.id === id,
  ) || {};

export const buildListingUpdatePayload = (form, listing) => {
  const basicInfo = form?.basicInfo || {};
  const questions = form?.questions || {};
  const pricing = form?.pricing || {};
  const amenityIds = form?.amenities?.amenities || [];
  const addOns = form?.addOns || {};
  const offRoad = originalQuestion(listing, 'off_road');
  const offSeasonEnabled = Boolean(pricing.offSeasonPrices);
  const cancellationPolicyId =
    basicInfo.cancellationPolicy && basicInfo.cancellationPolicy !== 'none'
      ? basicInfo.cancellationPolicy
      : null;

  return {
    title: basicInfo.propertyTitle || '',
    description: basicInfo.description || '',
    propertyType: propertyTypeSlug(basicInfo.propertyType),
    addressLine1: basicInfo.addressLine1 || '',
    addressLine2: basicInfo.addressLine2 || '',
    city: basicInfo.city || '',
    state: basicInfo.state || '',
    country: listing?.country || 'India',
    postalCode: String(basicInfo.postalCode || ''),
    pricePerDay: toNumber(pricing.pricePerDay),
    pricePerWeek: toNumber(pricing.pricePerWeek),
    pricePerMonth: toNumber(pricing.pricePerMonth),
    isWeeklyAvailable: Boolean(pricing.weeklyStays),
    isMonthlyAvailable: Boolean(pricing.monthlyStays),
    offSeasonPricePerDay: offSeasonEnabled
      ? toNumber(pricing.offSeasonPricePerDay)
      : null,
    offSeasonPricePerWeek: offSeasonEnabled
      ? toNumber(listing?.offSeasonPricePerWeek)
      : null,
    offSeasonPricePerMonth: offSeasonEnabled
      ? toNumber(pricing.offSeasonPricePerMonth)
      : null,
    maxGuests: toCount(basicInfo.guests),
    totalBedrooms: toCount(basicInfo.bedrooms),
    totalBathrooms: toCount(basicInfo.bathrooms),
    amenityIds,
    rooms: buildRoomsFromForm(basicInfo, pricing),
    cleaningFee: toNumber(pricing.cleaningFee) ?? 0,
    securityDeposit: toNumber(pricing.securityDeposit) ?? 0,
    minStayDuration: pricing.minimumStay || '',
    checkInTime: toApiTime(pricing.checkInTime),
    checkOutTime: toApiTime(pricing.checkOutTime),
    cancellationPolicyId,
    isKitchenAvailable: Boolean(addOns.kitchenAccess),
    isFoodAvailable: Boolean(addOns.foodServices),
    isPet: Boolean(addOns.petFriendly),
    instantBooking: Boolean(addOns.instantBooking),
    listingQuestions: [
      {
        id: 'distance_from_main_town',
        question:
          originalQuestion(listing, 'distance_from_main_town').question ||
          'Distance from Bus Stand / Main Town',
        type: 'text',
        icon:
          originalQuestion(listing, 'distance_from_main_town').icon ||
          'LocationOnIcon',
        placeholder:
          originalQuestion(listing, 'distance_from_main_town').placeholder ||
          '6 km',
        enabled: true,
        inputtype: 'number',
        distanceType: toDistanceType(questions.distanceUnit),
        answer: String(questions.distanceFromTown || ''),
        booleanAnswer: false,
        selectedOptions: [],
      },
      {
        id: 'off_road',
        question: offRoad.question || 'Off-road / Kacha Road',
        type: 'boolean',
        icon: offRoad.icon || 'TerrainIcon',
        enabled: true,
        booleanAnswer: Boolean(questions.offRoad),
        inputtype: 'number',
        distanceType: offRoad.distanceType || 'km',
        subQuestion: {
          question: offRoad.subQuestion?.question || 'Distance of off-road',
          type: 'text',
          placeholder: offRoad.subQuestion?.placeholder || '2 km',
          answer: offRoad.subQuestion?.answer || '',
        },
        selectedOptions: [],
        answer: '',
      },
      {
        id: 'walking_distance_from_parking',
        question:
          originalQuestion(listing, 'walking_distance_from_parking').question ||
          'Walking Distance from Parking',
        type: 'text',
        icon:
          originalQuestion(listing, 'walking_distance_from_parking').icon ||
          'DirectionsWalkIcon',
        inputtype: 'number',
        placeholder:
          originalQuestion(listing, 'walking_distance_from_parking').placeholder ||
          '100 m',
        distanceType: toDistanceType(questions.walkingUnit),
        enabled: true,
        answer: String(questions.walkingDistance || ''),
        booleanAnswer: false,
        selectedOptions: [],
      },
      {
        id: 'parking',
        question: originalQuestion(listing, 'parking').question || 'Parking',
        type: 'boolean',
        icon: originalQuestion(listing, 'parking').icon || 'LocalParking',
        enabled: true,
        label: originalQuestion(listing, 'parking').label || 'Public / Private',
        booleanAnswer: !questions.privateParking,
        selectedOptions: [],
        answer: '',
      },
      {
        id: 'stairs_access',
        question:
          originalQuestion(listing, 'stairs_access').question ||
          'Stair climb required',
        type: 'boolean',
        icon: originalQuestion(listing, 'stairs_access').icon || 'SignpostIcon',
        enabled: true,
        booleanAnswer: Boolean(questions.stairClimb),
        selectedOptions: [],
        answer: '',
      },
      {
        id: 'suitable_for',
        question:
          originalQuestion(listing, 'suitable_for').question || 'Suitable For',
        type: 'multi',
        icon: originalQuestion(listing, 'suitable_for').icon || 'GroupIcon',
        options: originalQuestion(listing, 'suitable_for').options || [
          'Couples',
          'Families',
          'Group of Friends',
        ],
        selectedOptions: (questions.suitableFor || [])
          .map(option => SUITABLE_FOR_TITLES[option] || option)
          .filter(Boolean),
        enabled: true,
        booleanAnswer: false,
        answer: '',
      },
    ],
  };
};

export const buildListingCreatePayload = form => {
  const basicInfo = form?.basicInfo || {};
  const questions = form?.questions || {};
  const pricing = form?.pricing || {};
  const amenityIds = form?.amenities?.amenities || [];
  const addOns = form?.addOns || {};
  const offSeasonEnabled = Boolean(pricing.offSeasonPrices);
  const cancellationPolicyId =
    basicInfo.cancellationPolicy && basicInfo.cancellationPolicy !== 'none'
      ? basicInfo.cancellationPolicy
      : null;

  return {
    title: basicInfo.propertyTitle || '',
    description: basicInfo.description || '',
    propertyType: propertyTypeSlug(basicInfo.propertyType),
    addressLine1: basicInfo.addressLine1 || '',
    city: basicInfo.city || '',
    state: basicInfo.state || '',
    country: 'India',
    postalCode: String(basicInfo.postalCode || ''),
    latitude: toNumber(basicInfo.latitude),
    longitude: toNumber(basicInfo.longitude),
    pricePerDay: toNumber(pricing.pricePerDay),
    pricePerWeek: toNumber(pricing.pricePerWeek),
    pricePerMonth: toNumber(pricing.pricePerMonth),
    isWeeklyAvailable: Boolean(pricing.weeklyStays),
    isMonthlyAvailable: Boolean(pricing.monthlyStays),
    offSeasonPricePerDay: offSeasonEnabled
      ? toNumber(pricing.offSeasonPricePerDay)
      : null,
    offSeasonPricePerWeek: null,
    offSeasonPricePerMonth: offSeasonEnabled
      ? toNumber(pricing.offSeasonPricePerMonth)
      : null,
    maxGuests: toCount(basicInfo.guests),
    totalBedrooms: toCount(basicInfo.bedrooms),
    totalBathrooms: toCount(basicInfo.bathrooms),
    amenityIds,
    rooms: buildRoomsFromForm(basicInfo, pricing),
    minStayDuration: pricing.minimumStay || '',
    checkInTime: toApiTime(pricing.checkInTime),
    checkOutTime: toApiTime(pricing.checkOutTime),
    cancellationPolicyId,
    isKitchenAvailable: Boolean(addOns.kitchenAccess),
    isFoodAvailable: Boolean(addOns.foodServices),
    isPet: Boolean(addOns.petFriendly),
    instantBooking: Boolean(addOns.instantBooking),
    listingQuestions: [
      {
        id: 'distance_from_main_town',
        question: 'Distance from Bus Stand / Main Town',
        type: 'text',
        icon: 'LocationOnIcon',
        placeholder: '6 km',
        enabled: false,
        inputtype: 'number',
        distanceType: toDistanceType(questions.distanceUnit),
        answer: String(questions.distanceFromTown || ''),
      },
      {
        id: 'off_road',
        question: 'Off-road / Kacha Road',
        type: 'boolean',
        icon: 'TerrainIcon',
        enabled: false,
        booleanAnswer: Boolean(questions.offRoad),
        inputtype: 'number',
        distanceType: 'km',
        subQuestion: {
          question: 'Distance of off-road',
          type: 'text',
          placeholder: '2 km',
          answer: '1',
        },
      },
      {
        id: 'walking_distance_from_parking',
        question: 'Walking Distance from Parking',
        type: 'text',
        icon: 'DirectionsWalkIcon',
        inputtype: 'number',
        placeholder: '100 m',
        distanceType: toDistanceType(questions.walkingUnit),
        enabled: false,
        answer: String(questions.walkingDistance || ''),
      },
      {
        id: 'parking',
        question: 'Parking',
        type: 'boolean',
        icon: 'LocalParking',
        enabled: false,
        label: 'Public / Private',
        booleanAnswer: !questions.privateParking,
      },
      {
        id: 'stairs_access',
        question: 'Stair climb required',
        type: 'boolean',
        icon: 'SignpostIcon',
        enabled: false,
        booleanAnswer: Boolean(questions.stairClimb),
      },
      {
        id: 'suitable_for',
        question: 'Suitable For',
        type: 'multi',
        icon: 'GroupIcon',
        options: ['Couples', 'Families', 'Group of Friends'],
        selectedOptions: (questions.suitableFor || [])
          .map(option => SUITABLE_FOR_TITLES[option] || option)
          .filter(Boolean),
        enabled: true,
      },
    ],
  };
};
