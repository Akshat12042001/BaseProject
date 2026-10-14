import * as Yup from 'yup';

const fields = {
  email: {
    label: 'LABELS.EMAIL_ADDRESS',
    placeholder: 'PLACEHOLDERS.ENTER_YOUR_EMAIL',
    type: 'email',
  },
  password: {
    label: 'LABELS.PASSWORD',
    placeholder: 'PLACEHOLDERS.ENTER_YOUR_PASSWORD',
    type: 'password',
    isPassword: true,
  },
  firstName: {
    label: 'LABELS.FIRST_NAME',
    placeholder: 'PLACEHOLDERS.ENTER_YOUR_FIRST_NAME',
    type: 'firstName',
  },
  lastName: {
    label: 'LABELS.LAST_NAME',
    placeholder: 'PLACEHOLDERS.ENTER_YOUR_LAST_NAME',
    type: 'lastName',
  },
  phone: {
    label: 'LABELS.PHONE',
    placeholder: 'PLACEHOLDERS.ENTER_YOUR_PHONE',
    type: 'phone',
    keyboardType: 'phone-pad',
    maxLength: 10,
  },
  city: {
    label: 'LABELS.CITY',
    placeholder: 'PLACEHOLDERS.ENTER_YOUR_CITY',
    type: 'city',
  },
  confirmPassword: {
    label: 'LABELS.CONFIRM_PASSWORD',
    placeholder: 'PLACEHOLDERS.ENTER_YOUR_CONFIRM_PASSWORD',
    type: 'confirmPassword',
    isPassword: true,
  },
};

const schemas = {
  stringRequired: Yup.string().required('ERRORS.REQUIRED'),
  stringRequired2: Yup.string()
    .trim()
    .min(2, 'ERRORS.MUST_BE_AT_LEAST_2_CHARACTERS')
    .required('ERRORS.REQUIRED'),
  stringOptional: Yup.string().trim().optional().nullable(),
  email: Yup.string()
    .required('ERRORS.EMAIL_IS_REQUIRED')
    .test('valid-email', 'ERRORS.EMAIL_IS_INVALID', function (value) {
      if (!value) return false;
      if (value.length < 2) return true;
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }),
  emailOptional: Yup.string()
    .test('valid-email', 'ERRORS.EMAIL_IS_INVALID', function (value) {
      if (!value) return true;
      if (value.length < 2) return true;
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    })
    .optional(),
  phoneRequired: Yup.string()
    .length(10, 'ERRORS.PHONE_MUST_BE_10_DIGITS')
    .required('ERRORS.REQUIRED'),
  phoneOptional: Yup.string()
    .length(10, 'ERRORS.PHONE_MUST_BE_10_DIGITS')
    .optional()
    .nullable(),
  pincode: Yup.string()
    .matches(/\b\d{5}\b/g, 'ERRORS.PINCODE_IS_NOT_VALID')
    .required('ERRORS.REQUIRED')
    .nullable(),
  numberInput: Yup.number().optional(),
  oldPassword: Yup.string().required('ERRORS.REQUIRED'),
  password: Yup.string()
    .min(8, 'ERRORS.MUST_BE_AT_LEAST_8_CHARACTERS')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
      'ERRORS.PASSWORD_LONG',
    )
    .required('ERRORS.REQUIRED'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'ERRORS.PASSWORD_MUST_MATCH')
    .min(8, 'ERRORS.MUST_BE_AT_LEAST_8_CHARACTERS')
    .required('ERRORS.REQUIRED'),
  newPassword: Yup.string()
    .min(8, 'ERRORS.MUST_BE_AT_LEAST_8_CHARACTERS')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
      'ERRORS.PASSWORD_LONG',
    )
    .required('ERRORS.REQUIRED'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), ''], 'ERRORS.PASSWORD_MUST_MATCH')
    .min(8, 'ERRORS.MUST_BE_AT_LEAST_8_CHARACTERS')
    .required('ERRORS.REQUIRED'),
  currentPassword: Yup.string().required('ERRORS.REQUIRED'),
  dateRequired: Yup.mixed()
    .nullable()
    .test('required-date', 'ERRORS.REQUIRED', value => {
      if (!value) {
        return false;
      }

      const date = value instanceof Date ? value : new Date(value);
      return !Number.isNaN(date.getTime());
    }),
};

export default {
  SIGNUP: {
    fields: [
      fields.firstName,
      fields.lastName,
      fields.email,
      fields.phone,
      fields.password,
      fields.confirmPassword,
      fields.city,
    ],
    schema: Yup.object().shape({
      firstName: schemas.stringRequired,
      lastName: schemas.stringOptional,
      email: schemas.email,
      phone: schemas.phoneRequired,
      password: schemas.stringRequired,
      confirmPassword: schemas.stringRequired,
      city: schemas.stringRequired,
    }),
  },
  LOGIN: {
    fields: [fields.email, fields.password],
    schema: Yup.object().shape({
      email: schemas.email,
      password: schemas.stringRequired,
    }),
  },
  LOGIN_WITH_OTP: {
    fields: [fields.email],
    schema: Yup.object().shape({
      email: schemas.email,
    }),
  },
  FORGOT_PASSWORD: {
    fields: [fields.email],
    schema: Yup.object().shape({
      email: schemas.email,
    }),
  },
  CREATE_BOOKING: {
    fields: [
      {
        label: 'CREATE_BOOKING.FULL_NAME',
        placeholder: 'CREATE_BOOKING.FULL_NAME_PLACEHOLDER',
        type: 'fullName',
      },
      {
        label: 'CREATE_BOOKING.EMAIL',
        placeholder: 'CREATE_BOOKING.EMAIL_PLACEHOLDER',
        type: 'email',
        keyboardType: 'email-address',
      },
      {
        label: 'CREATE_BOOKING.PHONE',
        placeholder: 'CREATE_BOOKING.PHONE_PLACEHOLDER',
        type: 'phone',
        keyboardType: 'phone-pad',
        maxLength: 10,
      },
      {
        label: 'CREATE_BOOKING.BOOKING_AMOUNT',
        placeholder: 'CREATE_BOOKING.BOOKING_AMOUNT_PLACEHOLDER',
        type: 'bookingAmount',
        keyboardType: 'decimal-pad',
      },
      {
        label: 'CREATE_BOOKING.ADVANCE_PAYMENT',
        placeholder: 'CREATE_BOOKING.ADVANCE_PAYMENT_PLACEHOLDER',
        type: 'advancePayment',
        keyboardType: 'decimal-pad',
      },
    ],
    schema: Yup.object().shape({
      homestayId: schemas.stringRequired,
      homestayTitle: schemas.stringOptional,
      checkIn: schemas.dateRequired,
      checkOut: schemas.dateRequired,
      fullName: schemas.stringRequired2,
      email: schemas.emailOptional,
      phone: schemas.phoneRequired,
      bookingAmount: Yup.string()
        .required('ERRORS.REQUIRED')
        .test('positive-amount', 'ERRORS.REQUIRED', value => Number(value) > 0),
      advancePayment: Yup.string()
        .optional()
        .nullable()
        .test(
          'not-greater-than-booking-amount',
          'ERRORS.ADVANCE_EXCEEDS_BOOKING_AMOUNT',
          function (value) {
            if (value == null || String(value).trim() === '') {
              return true;
            }

            const advanceAmount = Number(value);
            const bookingAmount = Number(this.parent.bookingAmount);

            if (Number.isNaN(advanceAmount)) {
              return true;
            }

            return advanceAmount <= bookingAmount;
          },
        ),
    }),
  },
  CREATE_INVOICE: {
    fields: [
      {
        label: 'CREATE_INVOICE.PAYMENT_TERMS',
        placeholder: 'CREATE_INVOICE.PAYMENT_TERMS_PLACEHOLDER',
        type: 'paymentTerms',
      },
      {
        label: 'CREATE_INVOICE.FROM',
        placeholder: 'CREATE_INVOICE.FROM_PLACEHOLDER',
        type: 'fromAddress',
      },
      {
        label: 'CREATE_INVOICE.BILL_TO',
        placeholder: 'CREATE_INVOICE.BILL_TO_PLACEHOLDER',
        type: 'billTo',
      },
      {
        label: 'CREATE_INVOICE.NOTES',
        placeholder: 'CREATE_INVOICE.NOTES_PLACEHOLDER',
        type: 'notes',
      },
    ],
    schema: Yup.object().shape({
      checkIn: schemas.dateRequired,
      checkOut: schemas.dateRequired,
      paymentTerms: schemas.stringRequired,
      fromAddress: schemas.stringRequired,
      selectedFromPropertyId: Yup.mixed().nullable().optional(),
      billTo: schemas.stringRequired2,
      notes: schemas.stringOptional,
      taxRate: schemas.stringOptional,
      discountRate: schemas.stringOptional,
      amountPaid: schemas.stringOptional,
      lineItems: Yup.array()
        .test(
          'has-valid-line-item',
          'CREATE_INVOICE.ITEMS_REQUIRED',
          items =>
            Array.isArray(items) &&
            items.some(
              item =>
                String(item?.name || '').trim() &&
                Number(item?.quantity) > 0 &&
                Number(item?.amount) > 0,
            ),
        )
        .required('CREATE_INVOICE.ITEMS_REQUIRED'),
    }),
  },
  CREATE_MENU: {
    fields: [
      {
        label: 'CREATE_MENU.MENU_NAME',
        placeholder: 'CREATE_MENU.MENU_NAME_PLACEHOLDER',
        type: 'menuName',
      },
      {
        label: 'CREATE_MENU.TAGLINE',
        placeholder: 'CREATE_MENU.TAGLINE_PLACEHOLDER',
        type: 'tagline',
      },
      {
        label: 'CREATE_MENU.ORDERS_PHONE',
        placeholder: 'CREATE_MENU.ORDERS_PHONE_PLACEHOLDER',
        type: 'ordersPhone',
        keyboardType: 'phone-pad',
        maxLength: 10,
      },
      {
        label: 'CREATE_MENU.KITCHEN_HOURS',
        placeholder: 'CREATE_MENU.KITCHEN_HOURS_PLACEHOLDER',
        type: 'kitchenHours',
      },
    ],
    schema: Yup.object().shape({
      selectedTemplate: schemas.stringRequired,
      menuName: schemas.stringRequired2,
      tagline: schemas.stringOptional,
      ordersPhone: schemas.phoneRequired,
      kitchenHours: schemas.stringRequired,
      logoUrl: schemas.stringOptional,
      categories: Yup.array()
        .test(
          'has-category-with-item',
          'CREATE_MENU.CATEGORIES_REQUIRED',
          categories =>
            Array.isArray(categories) &&
            categories.some(
              category =>
                String(category?.name || '').trim() &&
                Array.isArray(category?.items) &&
                category.items.some(item => String(item?.name || '').trim()),
            ),
        )
        .required('CREATE_MENU.CATEGORIES_REQUIRED'),
    }),
  },
  CREATE_LISTING: {
    schema: Yup.object().shape({
      propertyTitle: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.TITLE_REQUIRED')
        .min(10, 'CREATE_LISTING.ERRORS.TITLE_MIN'),
      description: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.DESCRIPTION_REQUIRED')
        .min(50, 'CREATE_LISTING.ERRORS.DESCRIPTION_MIN')
        .max(2000, 'CREATE_LISTING.ERRORS.DESCRIPTION_MAX'),
      addressLine1: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.ADDRESS_REQUIRED')
        .min(10, 'CREATE_LISTING.ERRORS.ADDRESS_MIN'),
      addressLine2: schemas.stringOptional,
      city: Yup.string().trim().required('CREATE_LISTING.ERRORS.CITY_REQUIRED'),
      state: Yup.string().trim().required('CREATE_LISTING.ERRORS.STATE_REQUIRED'),
      postalCode: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.POSTAL_REQUIRED')
        .matches(/^\d{6}$/, 'CREATE_LISTING.ERRORS.POSTAL_INVALID'),
      propertyType: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.PROPERTY_TYPE_REQUIRED'),
      guests: Yup.string()
        .trim()
        .required('ERRORS.REQUIRED')
        .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
      bedrooms: Yup.string()
        .trim()
        .required('ERRORS.REQUIRED')
        .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
      beds: Yup.string()
        .trim()
        .required('ERRORS.REQUIRED')
        .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
      bathrooms: Yup.string()
        .trim()
        .required('ERRORS.REQUIRED')
        .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
      entireDescription: Yup.string().trim().max(500).optional(),
      rentalOptions: Yup.array().of(
        Yup.object().shape({
          id: Yup.string(),
          name: Yup.string()
            .trim()
            .required('CREATE_LISTING.ERRORS.OPTION_NAME_REQUIRED'),
          bedrooms: Yup.string()
            .trim()
            .required('ERRORS.REQUIRED')
            .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
          beds: Yup.string()
            .trim()
            .required('ERRORS.REQUIRED')
            .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
          pricePerNight: Yup.string()
            .trim()
            .required('CREATE_LISTING.ERRORS.OPTION_PRICE_REQUIRED')
            .matches(/^\d+(\.\d{1,2})?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
          offSeasonPrice: Yup.string()
            .trim()
            .matches(/^(\d+(\.\d{1,2})?)?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
          units: Yup.string()
            .trim()
            .required('ERRORS.REQUIRED')
            .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
          maxGuests: Yup.string()
            .trim()
            .required('ERRORS.REQUIRED')
            .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
          bathrooms: Yup.string()
            .trim()
            .required('ERRORS.REQUIRED')
            .matches(/^[1-9]\d*$/, 'CREATE_LISTING.ERRORS.COUNT_MIN'),
          description: Yup.string().trim().max(500).optional(),
          attachedBathroom: Yup.boolean(),
          hasBalcony: Yup.boolean(),
        }),
      ),
      houseRules: schemas.stringOptional,
      cancellationPolicy: schemas.stringOptional,
    }),
  },
  CREATE_LISTING_QUESTIONS: {
    schema: Yup.object().shape({
      distanceFromTown: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.DISTANCE_REQUIRED')
        .matches(/^\d+$/, 'CREATE_LISTING.ERRORS.DISTANCE_INVALID'),
      distanceUnit: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.UNIT_REQUIRED'),
      offRoad: Yup.boolean(),
      walkingDistance: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.WALKING_REQUIRED')
        .matches(/^\d+$/, 'CREATE_LISTING.ERRORS.DISTANCE_INVALID'),
      walkingUnit: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.UNIT_REQUIRED'),
      privateParking: Yup.boolean(),
      stairClimb: Yup.boolean(),
      suitableFor: Yup.array()
        .of(Yup.string())
        .min(1, 'CREATE_LISTING.ERRORS.SUITABLE_FOR_REQUIRED'),
    }),
  },
  CREATE_LISTING_PRICING: {
    schema: Yup.object().shape({
      pricePerDay: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.PRICE_PER_DAY_REQUIRED')
        .matches(/^\d+(\.\d{1,2})?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
      weeklyStays: Yup.boolean(),
      pricePerWeek: Yup.string().when('weeklyStays', {
        is: true,
        then: schema =>
          schema
            .trim()
            .required('CREATE_LISTING.ERRORS.PRICE_PER_WEEK_REQUIRED')
            .matches(/^\d+(\.\d{1,2})?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
        otherwise: schema => schema,
      }),
      monthlyStays: Yup.boolean(),
      pricePerMonth: Yup.string().when('monthlyStays', {
        is: true,
        then: schema =>
          schema
            .trim()
            .required('CREATE_LISTING.ERRORS.PRICE_PER_MONTH_REQUIRED')
            .matches(/^\d+(\.\d{1,2})?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
        otherwise: schema => schema,
      }),
      offSeasonPrices: Yup.boolean(),
      offSeasonPricePerDay: Yup.string().when('offSeasonPrices', {
        is: true,
        then: schema =>
          schema
            .trim()
            .required('CREATE_LISTING.ERRORS.OFF_SEASON_DAY_REQUIRED')
            .matches(/^\d+(\.\d{1,2})?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
        otherwise: schema => schema,
      }),
      offSeasonPricePerMonth: Yup.string().when('offSeasonPrices', {
        is: true,
        then: schema =>
          schema
            .trim()
            .required('CREATE_LISTING.ERRORS.OFF_SEASON_MONTH_REQUIRED')
            .matches(/^\d+(\.\d{1,2})?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
        otherwise: schema => schema,
      }),
      cleaningFee: Yup.string()
        .trim()
        .matches(/^(\d+(\.\d{1,2})?)?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
      securityDeposit: Yup.string()
        .trim()
        .matches(/^(\d+(\.\d{1,2})?)?$/, 'CREATE_LISTING.ERRORS.AMOUNT_INVALID'),
      minimumStay: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.MINIMUM_STAY_REQUIRED'),
      checkInTime: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.CHECK_IN_TIME_REQUIRED'),
      checkOutTime: Yup.string()
        .trim()
        .required('CREATE_LISTING.ERRORS.CHECK_OUT_TIME_REQUIRED'),
    }),
  },
};
