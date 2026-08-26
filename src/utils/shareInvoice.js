import {generatePDF} from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import createInvoiceHtml from './invoiceHtml';

const getFileName = invoice => {
  const identifier = invoice?.invoiceNo || invoice?.id || Date.now();
  return `invoice-${String(identifier).replace(/[^a-zA-Z0-9-_]/g, '-')}`;
};

const getFileUrl = filePath =>
  filePath.startsWith('file://') ? filePath : `file://${filePath}`;

export const shareInvoice = async (invoice, title = 'Share invoice') => {
  const fileName = getFileName(invoice);
  const pdf = await generatePDF({
    html: createInvoiceHtml(invoice),
    fileName,
    width: 595,
    height: 842,
    shouldPrintBackgrounds: true,
  });

  if (!pdf?.filePath) {
    throw new Error('Invoice PDF could not be generated');
  }

  await Share.open({
    title,
    subject: `Invoice #${invoice?.invoiceNo || ''}`,
    url: getFileUrl(pdf.filePath),
    type: 'application/pdf',
    filename: `${fileName}.pdf`,
    failOnCancel: false,
  });

  return pdf;
};

export default shareInvoice;
