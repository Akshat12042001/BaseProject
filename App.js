import React, { useEffect } from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import {getStore, getPersistor} from './src/redux/index';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {StyledText, CustomToast} from './src/components/atoms';
import i18n from './src/translations';
import ToastManager from 'toastify-react-native';
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';
import { reset } from './src/redux/auth/auth.reducer';

// translations
const ii8 = i18n;

const toastConfig = {
  customSuccess: ({text1, text2, hide}) => (
    <CustomToast text1={text1} text2={text2} hide={hide} variant="success" />
  ),
  customError: ({text1, text2, hide}) => (
    <CustomToast text1={text1} text2={text2} hide={hide} variant="error" />
  ),
};

const App = () => {
  const store = getStore();
  const persistor = getPersistor();

  useEffect(() => {
    // store.dispatch(reset());
  }, [])
  

  const onBeforeLift = () => {
    //Do some stuff that when redux has initialized
  };

  return (
    <SafeAreaProvider>
      <AutocompleteDropdownContextProvider>
        <Provider store={store}>
          <PersistGate
            loading={<StyledText>Loading...</StyledText>}
            persistor={persistor}
            onBeforeLift={onBeforeLift}>
            <ToastManager
              animationStyle="fade"
              showCloseIcon={false}
              config={toastConfig}
              duration={2000}
            />
            <AppNavigator />
          </PersistGate>
        </Provider>
      </AutocompleteDropdownContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
