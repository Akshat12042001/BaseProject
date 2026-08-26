import Share from 'react-native-share';
import {makeFoodMenuPdfRequest} from '../api/common';

const arrayBufferToBase64 = buffer => {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });

  return global.btoa(binary);
};

const getFileName = menu => {
  const identifier = menu?.title || 'menu';
  return `menu-${String(identifier).replace(/[^a-zA-Z0-9-_]/g, '-')}`;
};

export const previewMenuPdf = async (menuPayload, title = 'Menu preview') => {
  const pdfBuffer = await makeFoodMenuPdfRequest(menuPayload);

  if (!pdfBuffer?.byteLength) {
    throw new Error('Menu PDF could not be generated');
  }

  const base64 = arrayBufferToBase64(pdfBuffer);
  const fileName = getFileName(menuPayload);

  await Share.open({
    title,
    subject: menuPayload?.title || 'Menu',
    url: `data:application/pdf;base64,${base64}`,
    type: 'application/pdf',
    filename: `${fileName}.pdf`,
    failOnCancel: false,
  });

  return pdfBuffer;
};

export default previewMenuPdf;
