import * as React from 'react';
import {  Provider as StoreProvider  } from 'react-redux';
import { Store } from './Store/store';
import { DefaultTheme, Modal, PaperProvider,Text } from 'react-native-paper';
import NavigationContainerLayout from './Navigator/navigationContainerLayout';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native';

export default function App() {
  
  return (
    <StoreProvider store={Store}>
      <PaperProvider  theme={DefaultTheme}>
        <NavigationContainerLayout/>
      </PaperProvider>
    </StoreProvider>
  );
}
