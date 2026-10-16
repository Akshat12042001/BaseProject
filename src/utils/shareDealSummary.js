import {Platform} from 'react-native';
import {generatePDF} from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import createDealSummaryHtml from './dealSummaryHtml';
import {successToast} from './alerts';

const sanitizeShareName = value =>
  String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ');

const getBookingShareName = (guestName, propertyName) => {
  const guest = sanitizeShareName(guestName) || 'Guest';
  const property = sanitizeShareName(propertyName);

  return property ? `${guest} - ${property}` : guest;
};

const getFileName = data =>
  getBookingShareName(
    data?.guest?.name,
    data?.propertyName || data?.title,
  );

const getFileUrl = filePath =>
  filePath.startsWith('file://') ? filePath : `file://${filePath}`;

const formatShareAmount = value => {
  const amount = Number(value) || 0;

  if (Number.isInteger(amount)) {
    return `Rs ${amount}`;
  }

  return `Rs ${amount.toFixed(2).replace(/\.00$/, '')}`;
};

export const getDealSummaryShareTitle = (guestName = '', propertyName = '') =>
  getBookingShareName(guestName, propertyName);

const formatOccupancyLine = occupancy => {
  const adults = Number(occupancy?.adults) || 0;
  const children = Number(occupancy?.children) || 0;
  const pets = Number(occupancy?.pets) || 0;
  const parts = [
    `${adults} Adult${adults === 1 ? '' : 's'}`,
    `${children} Child${children === 1 ? '' : 'ren'}`,
  ];

  if (pets > 0) {
    parts.push(`${pets} Pet${pets === 1 ? '' : 's'}`);
  }

  return parts.join(', ');
};

const formatInclusionsLine = inclusions => {
  const parts = [];

  if (inclusions?.breakfast) {
    parts.push('Breakfast');
  }
  if (inclusions?.dinner) {
    parts.push('Dinner');
  }

  return parts.length ? parts.join(', ') : 'None';
};

export const getBookingShareMessage = data => {
  const guestName = String(data?.guest?.name || '').trim();
  const unit = String(data?.propertyName || data?.title || '').trim();
  const checkInDate = String(data?.checkIn?.date || '').trim();
  const checkOutDate = String(data?.checkOut?.date || '').trim();
  const checkInTime = String(data?.checkIn?.time || '').trim();
  const checkOutTime = String(data?.checkOut?.time || '').trim();
  const total = Number(data?.pricing?.offeredPrice) || 0;
  const advance = Number(data?.pricing?.advancePayment) || 0;
  const balanceDue =
    data?.pricing?.balanceDue != null
      ? Number(data.pricing.balanceDue) || 0
      : Math.max(0, total - advance);
  const greeting = guestName ? `Hi ${guestName},` : 'Hi,';
  const checkInLine = [checkInDate, checkInTime].filter(Boolean).join(', ');
  const checkOutLine = [checkOutDate, checkOutTime].filter(Boolean).join(', ');

  return `${greeting}

Your booking is confirmed.

Property: ${unit || '—'}
Check-in: ${checkInLine || '—'}
Check-out: ${checkOutLine || '—'}
Guests: ${formatOccupancyLine(data?.occupancy)}
Inclusions: ${formatInclusionsLine(data?.inclusions)}

Total: ${formatShareAmount(total)}
Advance paid: ${formatShareAmount(advance)}
Balance due at check-in: ${formatShareAmount(balanceDue)}

Please note:
1) All guests need to share a valid ID card at check-in.
2) Any damage to the property or its contents will be charged in full for repair or replacement.

Please treat the space with care and respect. Thank you for understanding.`;
};

export const generateDealSummaryPdf = async data => {
  const fileName = getFileName(data);

  const pdf = await generatePDF({
    html: createDealSummaryHtml(data),
    fileName,
    base64: false,
    width: 595,
    height: 842,
    padding: 0,
    bgColor: '#FFFFFF',
    shouldPrintBackgrounds: true,
  });

  if (!pdf?.filePath) {
    throw new Error('Deal summary PDF could not be generated');
  }

  return {
    fileName,
    filePath: pdf.filePath,
  };
};

export const shareDealSummary = async (data, title) => {
  const message = getBookingShareMessage(data);
  const {fileName, filePath} = await generateDealSummaryPdf(data);
  const shareTitle =
    title ||
    getDealSummaryShareTitle(
      data?.guest?.name,
      data?.propertyName || data?.title,
    );
  const pdfUrl = getFileUrl(filePath);

  try {
    Clipboard.setString(message);
  } catch {
    // Clipboard is optional; share should still open.
  }

  // Keep share options simple. activityItemSources + a toast before open
  // can prevent the iOS share sheet from presenting.
  await Share.open({
    title: shareTitle,
    subject: shareTitle,
    message: Platform.OS === 'ios' ? undefined : message,
    url: pdfUrl,
    type: 'application/pdf',
    filename: `${fileName}.pdf`,
    failOnCancel: false,
  });

  successToast('Booking message copied — paste it in the chat');

  return filePath;
};

export default shareDealSummary;
