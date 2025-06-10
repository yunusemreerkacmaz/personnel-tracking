import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../Navigator/navigator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Store/store';
import { ResponseStatus, ServiceResult } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Avatar, Card, Chip, DataTable, DefaultTheme, Icon, List, MD2Colors, MD3Colors } from 'react-native-paper';
import {  InputOrOutStatus } from '../../Enums/EntryExitEnum';
import { LinearGradient } from 'expo-linear-gradient';
import { deviceInfoStore, CheckDevice } from '../Device/Requests/deviceInfoStore';
import { ScrollView } from 'react-native-gesture-handler';
import LocationComponent from '../../Location';
import { initialDeviceInformationDto } from '../Device/Dtos/DeviceInformationDto';
import { GenderEnum } from '../../Enums/GenderEnum';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceTokenEnum } from '../../Enums/JwtTokenEnum';
import { DeviceDto } from '../Device/Dtos/DeviceDto';
import { EntryExitEnum } from '../../Enums/EntryExitEnum';
import { entryExitCheckStore } from '../EntryExit/Requests/entryExitStore';
import { EntryExitDto } from '../EntryExit/Dtos/EntryExitDto';
import { iconVisibleStatus } from '../EntryExit/Requests/entryExitSlice';
import Animated, { BounceInDown, BounceInRight, BounceInUp, ReduceMotion } from 'react-native-reanimated';

export default function ProfileComponent() {
  type NavigationProps = DrawerNavigationProp<DrawerParamList, 'Home', 'Profile'>;
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>()
  const loginState = useSelector((state: RootState) => state.login)
  const deviceInfoState = useSelector((state: RootState) => state.deviceInfo)
  const [expanded, setExpanded] = React.useState(false);
  const locationState = useSelector((state: RootState) => state.location)
  const entryExitState = useSelector((state: RootState) => state.entryExit)

const [animationKey, setAnimationKey] = useState(0);

  const handleExpand = () => setExpanded(!expanded);

  const handleEntryExitCheck = async () => {
    let barcode: EntryExitDto = {
      id: entryExitState.id,
      userId: loginState.userDto.id,
      roleId: loginState.roleDto.id,
      deviceId: entryExitState.deviceId,
      locationDto: { latitude: locationState.coords.latitude, longitude: locationState.coords.latitude, areaControl: locationState.areaControl },
      barcodeReadEnum: entryExitState.barcodeReadEnum,
      biometricEnum: entryExitState.biometricEnum,
      biometricIconVisible: entryExitState.biometricIconVisible,
      qrCodeIconVisible: entryExitState.qrCodeIconVisible,
      isUserCompleteShift:entryExitState.isUserCompleteShift,
      status: entryExitState.status,
      adminApproveEnum:entryExitState.adminApproveEnum
    }

    dispatch(entryExitCheckStore(barcode)).then(response => {
      const payload = response.payload as ServiceResult<EntryExitDto>;
      if (payload.responseStatus === ResponseStatus.IsWarning && payload.result.barcodeReadEnum == EntryExitEnum.Default) {
        Toast.show({
          text1: payload.responseMessage,
          text1Style: { backgroundColor: 'green' },
          type: 'success'
        })
      }
    })
  }

  const handleCheckDevice = async () => {
    let deviceToken = await AsyncStorage.getItem(DeviceTokenEnum.key)
    let deviceDto: DeviceDto = {
      id: 0,
      deviceBrand: deviceInfoState.brand ?? "",
      deviceModelName: deviceInfoState.modelName ?? "",
      deviceToken: deviceToken ?? "",
      tokenDeletionStatus: null,
      userDto: loginState.userDto,
      isDeleted: false,
      distinctDeviceModelName: '',
      distinctDeviceBrand: ''
    }
    let checkUserDevice = await CheckDevice(deviceDto)
    if (checkUserDevice?.responseStatus === ResponseStatus.IsSuccess) {
      dispatch(iconVisibleStatus({ ...entryExitState,biometricIconVisible:false ,qrCodeIconVisible: false }))
      if (checkUserDevice.result.deviceToken) {                                                 // Cihaz önceden değiştirilmişse yeni tokenini cihaza ekle
        await AsyncStorage.removeItem(DeviceTokenEnum.key)
        await AsyncStorage.setItem(DeviceTokenEnum.key, checkUserDevice.result.deviceToken)
      }
      if (checkUserDevice.result.isDeleted) {                 // Cihazın tokeni veritabanından silinmişse telefondan da sil  
        await AsyncStorage.removeItem(DeviceTokenEnum.key)
      }
    }
    else if (checkUserDevice?.responseStatus === ResponseStatus.IsWarning) {
      dispatch(iconVisibleStatus({ ...entryExitState,biometricIconVisible:true, qrCodeIconVisible: true }))
      Toast.show({ text1: "Uyarı", text2: checkUserDevice?.responseMessage, type: 'info' })
    }
    else {
      dispatch(iconVisibleStatus({ ...entryExitState, biometricIconVisible:true, qrCodeIconVisible: true }))
      Toast.show({ text1: "Cihaz Hatası", text2: checkUserDevice?.responseMessage, type: 'error' })
    }
  }
  // const handleBiometricCheck = async () => {
  //   const hasHardware = await LocalAuthentication.hasHardwareAsync(); // Parmak izi donanımı var mı?
  //   const isEnrolled = await LocalAuthentication.isEnrolledAsync();   // Telefona eklenen parmak izi var mı ?
  //   const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync(); // Cihaz hangi türden biyometrik doğrulamayı destekliyor(donanımı olabilir ama aktif olarak kullanılmayabilir)   --->  [1,2]
  //   const ishaveFingerPrint = authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
  //   const ishaveFacialRecognition = authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
  //   const ishaveIris = authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)

  //   if (hasHardware && isEnrolled && (ishaveFingerPrint || ishaveFacialRecognition || ishaveIris)) {
  //     let dto: EntryExitDto = { ...initialEntryExitDto, roleId: loginState.roleDto.id, userId: loginState.userDto.id, locationDto: { latitude: locationState.coords.latitude, longitude: locationState.coords.longitude, areaControl: null } }

  //     const response = await dispatch(entryExitCheckStore(dto))
  //     let responsePayload = response.payload as ServiceResult<EntryExitDto>;
  //     if (responsePayload.responseStatus === ResponseStatus.IsSuccess) {
  //       // Toast.show({ text1: 'Biyometrik Okuma İşlemi', text2: responsePayload.responseMessage })
  //     }
  //     else if (responsePayload.responseStatus === ResponseStatus.IsWarning) {
  //     }
  //     else {
  //       setTimeout(() => {
  //         Toast.show({ text1: 'Biyometrik Okuma İşlemi', text2: responsePayload.responseMessage, type: 'error' })
  //       }, 1500);
  //     }
  //   }
  // }

  useFocusEffect(
  React.useCallback(() => {
    setAnimationKey(prev => prev + 1);
  }, [])
);

  useFocusEffect(
    useCallback(() => {
    
      dispatch(deviceInfoStore());
      if (loginState.isLoggedIn && loginState.userDto.id > 0 && deviceInfoState.brand && deviceInfoState.modelName) {
        if (locationState.coords.latitude && locationState.coords.longitude && deviceInfoState != initialDeviceInformationDto) {
          handleCheckDevice()
          handleEntryExitCheck()
        }
      }
    }, [deviceInfoState.brand, deviceInfoState.modelName, loginState.roleDto.id, locationState.coords.latitude, locationState.coords.longitude])
  )

  const LeftContent = (props: any) => <Avatar.Image {...props} source={loginState.userDto.gender === GenderEnum.Man ? require('../../assets/user_man_icon.png') : loginState.userDto.gender === GenderEnum.Woman ? require('../../assets/user_woman_icon.png') : ""} size={100} />
  const RightContent = () => {
    return <View style={{ justifyContent: 'center', alignItems: 'flex-end', borderRadius: 30 }}>
      <LinearGradient
        colors={['red', 'white', 'blue', "black"]}
        style={{ borderRadius: 30, opacity: 0.85, margin: 8 }}
      >
        <Chip style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF2F2F', borderRadius: 30 }}><Text style={{ fontSize: 20, fontStyle: 'italic', color: 'white' }}>Modalife</Text></Chip>
      </LinearGradient>
    </View>
  }

  const pdks = () => {
    if (entryExitState.barcodeReadEnum || entryExitState.biometricEnum || entryExitState.adminApproveEnum) {
      if ((entryExitState.barcodeReadEnum === EntryExitEnum.Entreance  && entryExitState.biometricEnum === EntryExitEnum.Exit) || (entryExitState.barcodeReadEnum === EntryExitEnum.Exit  && entryExitState.biometricEnum === EntryExitEnum.Entreance)) {
        return EntryExitEnum.Exit
      }
      else if (entryExitState.barcodeReadEnum === EntryExitEnum.Entreance  || entryExitState.biometricEnum === EntryExitEnum.Entreance || entryExitState.adminApproveEnum === EntryExitEnum.Entreance ) {
        return EntryExitEnum.Entreance
      }
      else if (entryExitState.barcodeReadEnum === EntryExitEnum.Exit || entryExitState.biometricEnum === EntryExitEnum.Exit || entryExitState.adminApproveEnum === EntryExitEnum.Exit) {
        return EntryExitEnum.Exit
      }
      else {
        return EntryExitEnum.Default
      }
    }
  }

  const EntranceOrExitStatus = () => {
    return entryExitState.status ?
      (<Chip textStyle={{ color: 'black', justifyContent: 'center', fontSize: 12 }}
        style={pdks() === EntryExitEnum.Entreance ? { backgroundColor: '#70e000' } : pdks() === EntryExitEnum.Exit ? { backgroundColor: '#a7333f' } : { backgroundColor: "#ECB125" }}
        icon={() => {
          return <Icon
            source={pdks() === EntryExitEnum.Entreance ? "check" : "close"}
            color={"black"}
            size={20}
          />
        }} >{pdks() === EntryExitEnum.Entreance ? InputOrOutStatus.Input : pdks() === EntryExitEnum.Exit ? InputOrOutStatus.Out : InputOrOutStatus.Default}
      </Chip>) :
      (<ActivityIndicator animating={true} color={MD2Colors.red800} />)
  }

  const PersonnelCardInfoComponent = () => (
    <DataTable style={{ width: '100%', height: 100 }}>
      <DataTable.Row style={{ height: 10 }}>
        <DataTable.Cell style={{ flex: 4 }} textStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>Cinsiyet</DataTable.Cell>
        <DataTable.Cell style={{ flex: 1 }} textStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>:</DataTable.Cell>
        <DataTable.Cell style={{ flex: 10 }} textStyle={{ fontSize: 13, fontStyle: 'italic', color: 'black' }}>{loginState.userDto.gender}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row>
        <DataTable.Cell style={{ flex: 4 }} textStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>Departman</DataTable.Cell>
        <DataTable.Cell style={{ flex: 1 }} textStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>:</DataTable.Cell>
        <DataTable.Cell style={{ flex: 10 }} textStyle={{ fontSize: 13, fontStyle: 'italic', color: 'black' }}>{loginState.roleDto?.roleName}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row style={{ width: '100%' }}>
        <DataTable.Cell style={{ flex: 4 }} textStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>Telefon</DataTable.Cell>
        <DataTable.Cell style={{ flex: 1 }} textStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>:</DataTable.Cell>
        <DataTable.Cell style={{ flex: 10 }} textStyle={{ fontSize: 13, fontStyle: 'italic', color: 'black' }}>{loginState.userDto.phoneNumber}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row style={{ width: '100%' }}>
        <DataTable.Cell style={{ flex: 4 }} textStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>Email</DataTable.Cell>
        <DataTable.Cell style={{ flex: 1 }} textStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>:</DataTable.Cell>
        <DataTable.Cell style={{ flex: 10 }} textStyle={{ fontSize: 13, fontStyle: 'italic', color: 'black' }}>{loginState.userDto.email}</DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#843DFD', // Burada primary rengini değiştirerek etki edebilirsin
      text: 'black',   // Metin rengini değiştirmek için
    },
  };

  const DeviceComponent = () => (
    <List.Section style={{ marginTop: 15, justifyContent: 'center', borderRadius: 30, flex: 1 }}>
      <List.Accordion
        title="Cihaz Bilgilerim"
        titleStyle={{ color: '#55B8E6' }}
        style={{ backgroundColor: '#D1C0F1', borderRadius: 30, marginVertical: 0, marginHorizontal: 10, paddingLeft: 23 }}
        left={props => <List.Icon  {...props} icon="tooltip-cellphone" color={MD3Colors.primary50} />}
        expanded={expanded}
        onPress={handleExpand}
        theme={theme}
      >
        <LinearGradient
          colors={['#E65656', '#CA84E4', '#ACC8E5']}
          style={{ height: 350, width: '95%', borderRadius: 30, opacity: 0.85, alignSelf: 'center', marginTop: 10 }}
        >
          <List.Item
            title={"Marka"}
            titleStyle={{ fontWeight: 'bold', color: 'black' }}
            description={deviceInfoState.brand}
            descriptionStyle={{ fontStyle: 'italic', color: 'gray' }}
            left={() => <List.Icon color={'red'} icon="cog-outline" />}
          />
          <List.Item
            title={"Model"}
            titleStyle={{ fontWeight: 'bold', color: 'black' }}
            description={deviceInfoState.modelName}
            descriptionStyle={{ fontStyle: 'italic', color: 'gray' }}
            left={() => <List.Icon color={'red'} icon="cog-outline" />}
          />
          <List.Item
            title={"İşletim Sistemi"}
            titleStyle={{ fontWeight: 'bold', color: 'black' }}
            description={deviceInfoState.osName}
            descriptionStyle={{ fontStyle: 'italic', color: 'gray' }}
            left={() => <List.Icon color={'red'} icon="cog-outline" />}
          />
          <List.Item
            title={"İşletim Sistemi Versiyonu"}
            titleStyle={{ fontWeight: 'bold', color: 'black' }}
            description={deviceInfoState.osVersion}
            descriptionStyle={{ fontStyle: 'italic', color: 'gray' }}
            left={() => <List.Icon color={'red'} icon="cog-outline" />}
          />
          <List.Item
            title={"Üretici"}
            titleStyle={{ fontWeight: 'bold', color: 'black' }}
            description={deviceInfoState.manufacturer}
            descriptionStyle={{ fontStyle: 'italic', color: 'gray' }}
            left={() => <List.Icon color={'red'} icon="cog-outline" />}
          />
        </LinearGradient>
      </List.Accordion>
    </List.Section>
  )
  return (
    <Animated.View entering={BounceInRight.delay(300)} key={`BounceInRight-${animationKey}`}>
      <ScrollView>
        <LinearGradient
          colors={['#a18cd1', '#fbc2eb']} // "#8172C6", '#92BBE7', "#F58484", "#FF4B4B", '#ECAFAF'
          style={{ height: 350, width: '95%', borderRadius: 30, opacity: 0.85, alignSelf: 'center', marginTop: 20 }}
        >
          <RightContent />
          <Card.Title
            title={`${loginState.userDto.firstName} ${loginState.userDto.lastName}`}
            subtitle={EntranceOrExitStatus()}
            left={LeftContent}
            style={{ padding: 20 }}
            titleStyle={{ paddingLeft: '20%', fontSize: 18, fontWeight: 'bold', color: 'black' }}
            subtitleStyle={{ paddingLeft: '20%' }}
          />
          <Card.Content style={{ borderRadius: 30, borderWidth: 0 }}>
            <PersonnelCardInfoComponent />
          </Card.Content>
        </LinearGradient>
        <Animated.View entering={BounceInUp.delay(500).duration(2000)} >
        <DeviceComponent/>
        </Animated.View>
        <Animated.View entering={BounceInDown.delay(700).duration(2500)} >
        <LocationComponent />
        </Animated.View>
      </ScrollView>
    </Animated.View>
  )
}
