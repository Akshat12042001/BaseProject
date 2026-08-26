import ReactNativeBlobUtil from 'react-native-blob-util';
import {makeFoodMenuPdfRequest} from '../api/common';

const arrayBufferToBase64 = buffer => {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });

  return global.btoa(binary);
};

export const getMenuPdfFileName = menu => {
  const identifier = menu?.title || 'menu';
  return `menu-${String(identifier).replace(/[^a-zA-Z0-9-_]/g, '-')}.pdf`;
};

export const createMenuPdfFile = async menuPayload => {
  const pdfBuffer = await makeFoodMenuPdfRequest(menuPayload);

  if (!pdfBuffer?.byteLength) {
    throw new Error('Menu PDF could not be generated');
  }

  const fileName = getMenuPdfFileName(menuPayload);
  const filePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`;
  const base64 = arrayBufferToBase64(pdfBuffer);

  await ReactNativeBlobUtil.fs.writeFile(filePath, base64, 'base64');

  return filePath;
};

export const getMenuPdfUri = filePath =>
  filePath.startsWith('file://') ? filePath : `file://${filePath}`;
