import Share from 'react-native-share';
import {createMenuPdfFile, getMenuPdfFileName, getMenuPdfUri} from './menuPdf';

export const shareMenuPdf = async (menuPayload, title = 'Share menu') => {
  const filePath = await createMenuPdfFile(menuPayload);

  await Share.open({
    title,
    subject: menuPayload?.title || 'Menu',
    url: getMenuPdfUri(filePath),
    type: 'application/pdf',
    filename: getMenuPdfFileName(menuPayload),
    failOnCancel: false,
  });

  return filePath;
};

export default shareMenuPdf;
