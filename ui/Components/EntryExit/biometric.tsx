import React, { useCallback, useState } from 'react'
import { Avatar, Card, IconButton, Text } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { ResponseStatus, ServiceResult } from '../../ServiceResults/serviceResult';
import { NavigationProps } from '../../Navigator/navigator';
import { EntryExitEnum } from '../../Enums/EntryExitEnum';
import { EntryExitDto } from './Dtos/EntryExitDto';
import { entryExitReadStore } from './Requests/entryExitStore';

type CheckDeviceBiometric = {
    isActive: boolean | null,
    text: string
}
export default function BiometricComponent() {
    const dispatch = useDispatch<AppDispatch>()
    const loginState = useSelector((state: RootState) => state.login)
    const locationState = useSelector((state: RootState) => state.location)
    const [checkDeviceBiometric, setCheckDeviceBiometric] = useState<CheckDeviceBiometric>({ text: "", isActive: null })
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<any>();
    const entryExitState = useSelector((state: RootState) => state.entryExit)

    console.log("bio bar---------- ", entryExitState.biometricEnum, entryExitState.barcodeReadEnum);

    useFocusEffect(
        useCallback(
            () => {
                if (route.params?.trigger) {
                    handlefingerPrint(); // fonksiyonunu burada çağır
                    navigation.setParams({ trigger: null } as any);
                }
                return () => {
                    setCheckDeviceBiometric({ isActive: null, text: "" })
                }
            },
            [route.params?.trigger],
        )
    )

    const biometricCheckDevice = async () => {

        const hasHardware = await LocalAuthentication.hasHardwareAsync(); // Parmak izi donanımı var mı?
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();   // Telefona eklenen parmak izi var mı ?
        const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync(); // Cihaz hangi türden biyometrik doğrulamayı destekliyor(donanımı olabilir ama aktif olarak kullanılmayabilir)   --->  [1,2]

        const ishaveFingerPrint = authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        const ishaveFacialRecognition = authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
        const ishaveIris = authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)

        if (!hasHardware) {
            setCheckDeviceBiometric({ isActive: false, text: "Cihazınızda parmak izi,yüz okuma veya iris okuma donanımı yok" })
        }
        else if (!isEnrolled) {
            setCheckDeviceBiometric({ isActive: false, text: "Cihazınızda parmak izi,yüz okuma ve iris okuma özelliği mevcut ancak sisteme eklenmediğinden kullanılamaz" })
        }
        else if (ishaveFingerPrint && ishaveFacialRecognition && ishaveIris) {
            setCheckDeviceBiometric({ isActive: true, text: "Cihazınızda parmak izi,yüz okuma ve iris okuma özelliği var" })
        }
        else if (ishaveFingerPrint && ishaveFacialRecognition) {
            setCheckDeviceBiometric({ isActive: true, text: "Cihazınızda parmak izi ve yüz okuma özelliği var" })
        }
        else if (ishaveFingerPrint) {
            setCheckDeviceBiometric({ isActive: true, text: "Cihazınızda parmak izi okuma özelliği var" })

        }
        else if (ishaveFacialRecognition) {
            setCheckDeviceBiometric({ isActive: true, text: "Cihazınızda yüz okuma özelliği var" })

        }
        else if (ishaveIris) {
            setCheckDeviceBiometric({ isActive: true, text: "Cihazınızda iris okuma özelliği var" })

        }
        else {
            setCheckDeviceBiometric({ isActive: false, text: "Cihazınızda herhangi bir okuma özelliği yok" })
        }
    }

    const handlefingerPrint = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync(); // Parmak izi donanımı var mı?
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();   // Telefona eklenen parmak izi var mı ?
        const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync(); // Cihaz hangi türden biyometrik doğrulamayı destekliyor(donanımı olabilir ama aktif olarak kullanılmayabilir)   --->  [1,2]

        const ishaveFingerPrint = authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        const ishaveFacialRecognition = authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
        const ishaveIris = authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)

        if (hasHardware && isEnrolled && (ishaveFingerPrint || ishaveFacialRecognition || ishaveIris)) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Yüzünüzü,irisinizi tanıtın veya parmak izini kullanın',
                cancelLabel: 'İPTAL ET',
                disableDeviceFallback: true  // Sadece iOS da çalışır Eğer kullanıcı biyometrik doğrulamada başarısız olursa (parmak izi yada yüz tanıma), iOS’un şifre ile giriş yapmasına izin vermez.Yani sadece biyometrik kimlik doğrulama yapılır, şifre ekranı hiç açılmaz.
            });

            let dto: EntryExitDto = { ...entryExitState, barcodeReadEnum: null, userId: loginState.userDto.id, roleId: loginState.roleDto.id, locationDto: { latitude: locationState.coords.latitude, longitude: locationState.coords.longitude, areaControl: null } }

            if (result.success) {                                                           // Biyometrik okuma işlemi

                if (entryExitState.barcodeReadEnum || entryExitState.biometricEnum) {
                    console.log("bio - barkod = ", entryExitState.biometricEnum, entryExitState.barcodeReadEnum);

                    if ((entryExitState.barcodeReadEnum === EntryExitEnum.Entreance && entryExitState.biometricEnum === EntryExitEnum.Exit) || (entryExitState.barcodeReadEnum === EntryExitEnum.Exit && entryExitState.biometricEnum === EntryExitEnum.Entreance) || (entryExitState.biometricEnum === EntryExitEnum.Default && entryExitState.barcodeReadEnum === EntryExitEnum.Default)) {
                        dto = { ...dto, biometricEnum: EntryExitEnum.Entreance }
                        console.log("1.Aşama");

                    }
                    else if (entryExitState.barcodeReadEnum === EntryExitEnum.Entreance || entryExitState.biometricEnum === EntryExitEnum.Entreance) {
                        dto = { ...dto, biometricEnum: EntryExitEnum.Exit }
                        console.log("2.Aşama");
                    }
                    else if (entryExitState.barcodeReadEnum === EntryExitEnum.Exit || entryExitState.biometricEnum === EntryExitEnum.Exit) {
                        dto = { ...dto, biometricEnum: EntryExitEnum.Entreance }
                        console.log("3.Aşama");
                    }
                    else {
                        dto = { ...dto, biometricEnum: EntryExitEnum.Default }
                        console.log("4.Aşama");
                    }
                }

                const response = await dispatch(entryExitReadStore(dto))
                let responsePayload = response.payload as ServiceResult<EntryExitDto>;
                if (responsePayload.responseStatus === ResponseStatus.IsSuccess) {
                    console.log("responsePayload = ", responsePayload);

                    Toast.show({ text1: 'Biyometrik Okuma İşlemi', text2: responsePayload.responseMessage })
                }
                else if (responsePayload.responseStatus === ResponseStatus.IsWarning) {
                    Toast.show({ text1: 'Biyometrik Okuma İşlemi', text2: responsePayload.responseMessage, type: 'info' })
                }
                else {
                    Toast.show({ text1: 'Biyometrik Okuma İşlemi', text2: responsePayload.responseMessage, type: 'error' })
                }
                console.log('Giriş başarılı');
            }
            else {
                console.log('Giriş başarısız');
            }
        }
        else {
            console.log('Parmak izi kullanılamıyor');
        }
    }

    const LeftContent = (props: any) => <Avatar.Icon {...props} icon={checkDeviceBiometric.isActive === null ? "cellphone-cog" : checkDeviceBiometric.isActive === true ? "cellphone-check" : "cellphone-remove"} />
    return (
        <Card style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
            <Card.Title title="Biyometrik Aktiflik Durumu" titleStyle={{ fontWeight: 'bold' }}
                subtitle={checkDeviceBiometric.isActive === null ? "Cihazı Kontrol Et" : checkDeviceBiometric.isActive === true ? "Giriş için biyometrik Kullanılabilir" : "Giriş için biyometrik Kullanılamaz"}
                subtitleStyle={checkDeviceBiometric.isActive === null ? { color: '#ECB125' } : checkDeviceBiometric.isActive === true ? { color: "#0CB13E" } : { color: '#B51B1B' }}
                left={LeftContent} />
            <Card.Content>
                <Text>Cihazınızın hangi biyometrik okumaları desteklediğini öğrenmek için aşağıdaki ikona tıklayın </Text>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton
                        icon={checkDeviceBiometric.isActive === null ? "cellphone-cog" : checkDeviceBiometric.isActive === true ? "cellphone-check" : "cellphone-remove"}
                        iconColor={checkDeviceBiometric.isActive === true ? "#70e000" : checkDeviceBiometric.isActive === false ? "#a7333f" : "#ECB125"}
                        size={50}
                        onPress={() => biometricCheckDevice()}
                    />
                </View>
            </Card.Content>
            {checkDeviceBiometric.isActive != null &&
                <Card.Actions style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1, padding: 20, backgroundColor: '#ACC8E5', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>{checkDeviceBiometric.text}</Text>
                    </View>
                </Card.Actions>}
        </Card>
    )
}
