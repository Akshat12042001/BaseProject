import {Alert} from 'react-native';
import {Toast} from 'toastify-react-native';

const TOAST_POSITION = 'top';

export const showAlert = ({
  title,
  message,
  onSuccess,
  onCancel,
  isConfirmationPopup = false,
  t,
}) => {
  let buttons = [
    {
      text: t('PLACEHOLDERS.OK'),
      onPress: onSuccess,
    },
  ];

  if (isConfirmationPopup) {
    buttons = [
      {
        text: t('PLACEHOLDERS.NO'),
        onPress: onCancel,
      },
      {
        text: t('PLACEHOLDERS.YES'),
        onPress: onSuccess,
        style: 'destructive',
      },
    ];
  }

  Alert.alert(title, message, buttons);
};

export const errorToast = (title) => {
  Toast.show({type: 'customError', text1: title, position: TOAST_POSITION});
};

export const successToast = (title) => {
  Toast.show({type: 'customSuccess', text1: title, position: TOAST_POSITION});
};
