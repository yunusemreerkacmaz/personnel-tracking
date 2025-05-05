import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import Navigator from './navigator'
import Toast, { BaseToast, ToastConfigParams } from 'react-native-toast-message'
import { Portal } from 'react-native-paper'

interface ToastCustomProps {
  onOkPress?: () => void;       // burayı ben ekledim 
  onCancelPress?: () => void;   // burayı ben ekledim 
  okButtonText: string
  cancelButtonText: string
}
type ToastCustomType = ToastConfigParams<ToastCustomProps>;

export default function NavigationContainerLayout() {

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={[styles.toastStyle, { height: 'auto', backgroundColor: '#4CAF50' }]} // Arka plan rengini değiştir
        text1Style={styles.text1}
        text2Style={styles.text2}
        text2NumberOfLines={5}
        contentContainerStyle={{ margin: 10 }}
      />
    ),
    error: (props: any) => (
      <BaseToast
        {...props}
        style={[styles.toastStyle, { height: 'auto', backgroundColor: '#F44336', elevation: 10 }]} // Hata mesajları için renk
        text1Style={styles.text1}
        text2Style={styles.text2}
        text2NumberOfLines={5}
        contentContainerStyle={{ margin: 10 }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={[styles.toastStyle, { height: 'auto', backgroundColor: '#EECA2A' }]} // Hata mesajları için renk
        text1Style={styles.text1}
        text2Style={styles.text2}
        text2NumberOfLines={5}
        contentContainerStyle={{ margin: 10 }}
      />
    ),
    customToast: (customProps: ToastCustomType) => {
      const { props,text1,text2 } = customProps
      return <View style={[customStyle.container]}>
        <Text style={customStyle.text1}>{text1}</Text>
        {text2 && <Text style={customStyle.text2}>{text2}</Text>}
        <View style={{ flexDirection: 'row', gap: 10, margin: 20 }}>
          <TouchableOpacity onPress={props?.onOkPress} style={customStyle.buttonOK}>
            <Text style={{ fontWeight: 'bold' }}>{props.okButtonText}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props?.onCancelPress} style={customStyle.buttonCancel}>
            <Text style={{ fontWeight: 'bold' }}>{props.cancelButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    },
  };

  const customStyle = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E1D7D7',
      borderRadius: 20,
      padding: 20,
      width: '70%',
      top: '60%'
    },
    buttonOK: {
      padding: 10,
      backgroundColor: '#48CC41',
      color: 'black',
      borderRadius: 5,
    },
    buttonCancel: {
      padding: 10,
      backgroundColor: '#D00E0E', // #007BFF
      color: 'black',
      borderRadius: 5,
    },
    text1: {
      fontSize: 26,
      fontWeight: 'bold',
      color: 'black', // Başlık rengi
      margin:10
    },
    text2: {
      fontSize: 14,
      color: 'black', // Alt metin rengi
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      padding: 10,
      backgroundColor: '#007BFF',
      color: 'black',
      borderRadius: 5,
    },
    toastStyle: {
      borderLeftColor: '#007BFF', // Yan çubuğun rengini değiştir
    },
    text1: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black', // Başlık rengi
    },
    text2: {
      fontSize: 14,
      color: 'black', // Alt metin rengi
    },
  });

  return (
    <NavigationContainer>
      {<Navigator />}
      <Portal>
        <Toast
          position='top'
          bottomOffset={20}
          config={toastConfig}
        />
      </Portal>
    </NavigationContainer>
  )
}
