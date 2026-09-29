import {generatePDF} from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import createDealSummaryHtml from './dealSummaryHtml';

const getFileName = data => {
  const identifier =
    data?.propertyName || data?.title || data?.id || Date.now();
  return `deal-summary-${String(identifier).replace(/[^a-zA-Z0-9-_]/g, '-')}`;
};

const getFileUrl = filePath =>
  filePath.startsWith('file://') ? filePath : `file://${filePath}`;

export const getDealSummaryShareTitle = (homestayName = '') => {
  const name = String(homestayName || '').trim() || 'Booking';
  return `Deal Summary - ${name}`;
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
  const {fileName, filePath} = await generateDealSummaryPdf(data);
  const shareTitle =
    title || getDealSummaryShareTitle(data?.propertyName || data?.title);

  await Share.open({
    title: shareTitle,
    subject: shareTitle,
    url: getFileUrl(filePath),
    type: 'application/pdf',
    filename: `${fileName}.pdf`,
    failOnCancel: false,
  });

  return filePath;
};

export default shareDealSummary;
