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
        .test(
          'positive-amount',
          'ERRORS.REQUIRED',
          value => Number(value) > 0,
        ),
      advancePayment: Yup.string().optional().nullable(),
    }),
  },
};