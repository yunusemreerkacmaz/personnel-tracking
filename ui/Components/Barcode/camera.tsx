import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppDispatch, RootState } from '../../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { BarcodeDto } from './Dtos/barcodeDto';
import { ResponseStatus, ServiceResult } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../Navigator/navigator';
import { Button, IconButton } from 'react-native-paper';
import { BarcodeReadEnum, BarcodeDataEnum } from '../../Enums/barcodeStatusEnum';
import * as SecureStore from 'expo-secure-store';
import { DeviceTokenEnum } from '../../Enums/JwtTokenEnum';
import { barcodeReadStore } from './Requests/barcodeStore';
import { ToastShowParamsCustomType } from '../../Helpers/Toast/ToastDto';

type NavigationProps = DrawerNavigationProp<DrawerParamList>;

export default function BarcodeComponent() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const dispatch = useDispatch<AppDispatch>()
  const loginState = useSelector((state: RootState) => state.login)
  const barcodeState = useSelector((state: RootState) => state.barcode)
  const navigationCamera = useNavigation<NavigationProps>();
  const [isProcessing, setIsProcessing] = useState(false);
  const locationState = useSelector((state: RootState) => state.location)

  useFocusEffect(
    React.useCallback(() => {
      setIsProcessing(false)
    }, [])
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Kamera Açılmadan Giriş İşlemi Yapamazsınız</Text>
        <Button icon="camera" mode="contained" onPress={requestPermission}>
          Kameranın açılmasına izin ver
        </Button>
      </View>
    );
  }

  const toggleCameraFacing = () => { setFacing(current => (current === 'back' ? 'front' : 'back')); }   // Kamera değiştirme
  const retryScannedStart = () => { setIsProcessing(false) }                                            // Camera taramasını tekrar başlat

  const handlebarcodeScanned = async ({ bounds, data }: BarcodeScanningResult) => {
    if (data && permission.granted) {
      let barcode: BarcodeDto = {
        data: data,
        id: barcodeState.id != 0 ? barcodeState.id : 0,
        locationDto: { areaControl: locationState.areaControl, latitude: locationState.coords.latitude, longitude: locationState.coords.longitude },
        barcodeReadEnum: data.trim() == BarcodeDataEnum.InputData.trim() ? BarcodeReadEnum.Entreance : data.trim() == BarcodeDataEnum.OutData.trim() ? BarcodeReadEnum.Exit : BarcodeReadEnum.Default,
        loginDto: loginState,
        storeDto: barcodeState.storeDto,
        loading: barcodeState.loading,
        deviceId: barcodeState.deviceId,
        qrCodeVisibleState: false
      }
      if (!isProcessing) {
        setIsProcessing(true)
        try {
          const responseRead = await dispatch(barcodeReadStore(barcode));
          if (responseRead.meta.requestStatus === "fulfilled") {
            const payloadRead = responseRead.payload as ServiceResult<BarcodeDto>;
            if (payloadRead.responseStatus === ResponseStatus.IsWarning) {
              if (payloadRead.result && payloadRead.result.data === "isUserOffShift") {
                Toast.show({
                  text1: "Çıkış Onayı",
                  text2: payloadRead.responseMessage,
                  text1Style: { backgroundColor: 'yellow' },
                  type: 'customToast',
                  autoHide: false,  // ekranda duruyor
                  props: {
                    okButtonText: "Çıkış Yap",
                    cancelButtonText: "İptal Et",
                    onCancelPress: () => Toast.hide(),
                    onOkPress: async () => {
                      let newBarCodeDto: BarcodeDto = { ...barcode, data: "isUserOffShift" }
                      const responseRead = await dispatch(barcodeReadStore(newBarCodeDto));  // vardiya dışında çıkış modalı
                      if (responseRead.meta.requestStatus === "fulfilled") {
                        let responseReadDto = responseRead.payload as ServiceResult<BarcodeDto>;
                        if (responseReadDto.responseStatus === ResponseStatus.IsSuccess) {
                          Toast.show({
                            text1: "Uyarı",
                            text2: responseReadDto.responseMessage,
                            text1Style: { backgroundColor: 'yellow' },
                            type: 'info',
                          })
                          setTimeout(() => {
                            navigationCamera.navigate('Profile')
                          }, 1000);
                        }
                        else {
                          Toast.show({
                            text1: "Hata Oluştu",
                            type: 'error'
                          })
                        }
                      }
                    },
                  }
                } as ToastShowParamsCustomType)
              }
              else {
                Toast.show({
                  text1: "Uyarı",
                  text2: payloadRead.responseMessage,
                  text1Style: { backgroundColor: 'yellow' },
                  type: 'info'
                })
                setTimeout(() => {
                  navigationCamera.navigate('Profile')
                }, 1000);
              }
            }
            else if (payloadRead.responseStatus === ResponseStatus.IsSuccess) {
               await SecureStore.setItemAsync(DeviceTokenEnum.key, DeviceTokenEnum.value, {
                keychainAccessible: SecureStore.WHEN_UNLOCKED, // Daha geniş erişim
              })
              Toast.show({
                text1: "İşlem Başarılı",
                text2: payloadRead.responseMessage,
                text1Style: { backgroundColor: 'green' },
                type: 'success'
              })
              setTimeout(() => {
                navigationCamera.navigate('Profile')
              }, 1000);
            }
            else {
              Toast.show({
                text1: "Hata Oluştu",
                text2: payloadRead.responseMessage,
                type: 'error'
              })
            }
          }
          else {
            Toast.show({
              text1: "Barkod Bilgileri Doldurulamadı",
              type: 'error'
            })
          }
        } catch (error) {
          console.log("errr = ", error);

          Toast.show({
            text1: "Barkode Okuma Hatası",
            type: 'error'
          })
        }
      }
    }
    else {
      Toast.show({
        text1: "Barkod Okunamadı",
        type: 'error'
      })
    }
  }

  return (
    <View style={styles.container}>
      {<CameraView
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={isProcessing ? undefined : handlebarcodeScanned}
      >
        <View style={styles.overlay}>
          <IconButton style={{ margin: 10 }} size={40} icon={'arrow-left'} iconColor='#D0E0F1' onPress={() => {
            navigationCamera.navigate('Home')
          }} />

          <View style={styles.buttonContainer}>
            <Button style={styles.button} icon="autorenew" mode="contained" onPress={toggleCameraFacing}>
              Kamerayı Çevir
            </Button>

            <Button style={styles.button} icon="data-matrix-scan" mode="contained" onPress={retryScannedStart}>
              Tarayamayı Yeniden başlat
            </Button>

          </View>
        </View>
      </CameraView>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    // flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    margin: 20
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D0E0F1',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Alan dışını karartma
  },
  scanBox: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
});
