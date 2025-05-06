import React, { useCallback, useState } from 'react'
import { FlatList, Modal, View, StyleSheet } from 'react-native'
import { Button, Card, Chip, IconButton, List, MD2Colors, Searchbar, Text } from 'react-native-paper';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import { useFocusEffect } from '@react-navigation/native';
import { DeviceDto } from './Dtos/DeviceDto';
import Toast from 'react-native-toast-message';
import { getDistinctDevices, UpdateDevice } from './Requests/deviceInfoStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceTokenEnum } from '../../Enums/JwtTokenEnum';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Store/store';
import { barcodeSlice } from '../Barcode/Requests/barcodeSlice';
import { initialBarcodeState } from '../Barcode/Dtos/barcodeDto';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ToastShowParamsCustomType } from '../../Helpers/Toast/ToastDto';

export default function DistinctDevice() {  // Cihaz Onayla 
    const [search, setSearch] = React.useState('');
    const [searchUsers, setSearchUsers] = useState<DeviceDto[]>([])
    const [distinctDeviceUsers, setDistinctDeviceUsers] = useState<DeviceDto[]>([])
    const [approvedStatus, setApprovedStatus] = useState<boolean>(false)

    const handleSearch = () => {
        let filteredUsers = distinctDeviceUsers.filter(user =>
            user.userDto.firstName.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
            user.userDto.lastName.toLowerCase().trim().includes(search.toLowerCase().trim()))
        setSearchUsers(filteredUsers)
    }
    const handleClearSearch = () => { setSearchUsers(distinctDeviceUsers) }
    useFocusEffect(
        useCallback(
            () => {
                let getDistinctDeviceUsers = async () => {
                    var response = await getDistinctDevices()
                    response?.results && setDistinctDeviceUsers(response.results)
                    response?.results && setSearchUsers(response.results)
                    if (response?.responseStatus === ResponseStatus.IsSuccess) {
                    }
                    else if (response?.responseStatus === ResponseStatus.IsWarning) {
                        Toast.show({ text1: "Try Catch'e düştü kontrol et", text2: response?.responseMessage, type: 'info' })
                    }
                }
                getDistinctDeviceUsers();
            },
            [approvedStatus],
        )
    )

    return (
        <Card style={{ flex: 1, elevation: 24, backgroundColor: '#E7C5BC', margin: 10, marginTop: 0 }}>
            <Card.Title subtitleStyle={{ color: 'gray' }} titleStyle={{ fontWeight: 'bold', color: 'black' }} title="YENİ CİHAZ ONAYLAMA ALANI" subtitle="Cihazını onaylanmasını istediğiniz kişiyi seçin" />
            {
                distinctDeviceUsers?.length === 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Gösterilecek Veri yok</Text>
                    </View> :
                    <FlatList
                        ListHeaderComponent={
                            <Searchbar
                                placeholder="Cihaz adı ara . . ."
                                onChangeText={setSearch}
                                value={search}
                                style={{ marginVertical: 5 }}
                                onIconPress={handleSearch}
                                onClearIconPress={handleClearSearch}
                            />
                        }
                        data={searchUsers}
                        style={{ paddingVertical: 2, backgroundColor: '#C5D6E9', padding: 10 }}
                        renderItem={({ item, index }) => <DeviceItem deviceDto={item} index={index + 1} setApprovedStatus={setApprovedStatus} approvedStatus={approvedStatus} />}
                        keyExtractor={item => item.id.toString()}
                    />
            }
        </Card>
    )
}
type DeviceItemProps = { deviceDto: DeviceDto, index: number, approvedStatus: boolean, setApprovedStatus: React.Dispatch<React.SetStateAction<boolean>> }
const DeviceItem: React.FC<DeviceItemProps> = ({ deviceDto, index, setApprovedStatus, approvedStatus }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [modalVisible, setModalVisible] = useState(false);

    const handleUpdateDevice = async (value: boolean) => {
        Toast.show({
            text1: "Cihaz İşlemleri Onaylama Ekranı",
            text2: "Cihaz onaylamak istediğinizden emin misiniz ?",
            text1Style: { backgroundColor: 'yellow' },
            type: 'customToast',
            autoHide: false,  // ekranda duruyor
            props: {
                okButtonText: "Onayla",
                cancelButtonText: "İptal Et",
                onCancelPress: () => {
                    Toast.hide()
                    Toast.show({ text1: "Cihaz Onayla işlemi iptal edildi", type: 'error' })
                },
                onOkPress: async () => {
                    deviceDto = { ...deviceDto, tokenDeletionStatus: value ? true : false }
                    const updateDevice = await UpdateDevice(deviceDto)
                    if (updateDevice?.responseStatus === ResponseStatus.IsSuccess) {
                        setApprovedStatus(!approvedStatus)
                        dispatch(barcodeSlice.actions.barcodeVisible({ ...initialBarcodeState, qrCodeVisibleState: false }))
                        Toast.show({ text1: "Cihaz Onayı", text2: updateDevice.responseMessage })
                        await AsyncStorage.removeItem(DeviceTokenEnum.key).then(async () => {
                            await AsyncStorage.setItem(DeviceTokenEnum.key, deviceDto.deviceToken)
                        })
                    }
                    else {
                        dispatch(barcodeSlice.actions.barcodeVisible({ ...initialBarcodeState, qrCodeVisibleState: true }))
                        Toast.show({ text1: "Cihaz Onayı", text2: updateDevice?.responseMessage })
                        setApprovedStatus(!approvedStatus)
                    }
                },
            }
        } as ToastShowParamsCustomType)
    }

    return <List.Item
        title={`${deviceDto.userDto.firstName} ${deviceDto.userDto.lastName}`}
        key={index}
        titleStyle={{ fontSize: 14, width: "100%", }}
        style={{ paddingRight: 0, paddingVertical: 1 }} // Yüksekliği azaltmak için
        right={(id) => (
            <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
                <DistinctDeviceInformationModal modalVisible={modalVisible} setModalVisible={setModalVisible} deviceDto={deviceDto}
                    children={
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <IconButton
                                icon="information"
                                iconColor={MD2Colors.yellow800}
                                size={28}
                                onPress={() => setModalVisible(!modalVisible)}
                            />
                        </View>
                    }
                />
                <Button
                    mode="text"
                    textColor='white'
                    style={{ height: 40 }}
                    buttonColor={"green"}
                    onPress={() => { handleUpdateDevice(true) }}
                >
                    Onayla
                </Button>
                <Button
                    mode="text"
                    textColor='white'
                    buttonColor={"#AE1D1D"}
                    style={{ height: 40 }}
                    onPress={() => { handleUpdateDevice(false) }}
                >
                    Reddet
                </Button>
            </View>
        )}
    />
}
type DistrinctDeviceInfoProps = { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, deviceDto: DeviceDto, children: any }
const DistinctDeviceInformationModal: React.FC<DistrinctDeviceInfoProps> = ({ modalVisible, setModalVisible, deviceDto, children }) => {
    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalView: {
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            width: '85%',
            height: 300,
            maxHeight: '100%',
            flexShrink: 1,
            flexWrap: 'wrap',
            padding: 15,
            alignItems: 'center',
            alignSelf: 'center', // Ortalamayı garanti altına alır
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        textStyle: {
            fontWeight: 'bold',
        },
        modalText: {
            marginBottom: 15,
            textAlign: 'center',
        },
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <IconButton
                                    icon="close-circle"
                                    iconColor={MD2Colors.red800}
                                    size={25}
                                    onPress={() => setModalVisible(!modalVisible)}
                                />
                            </View>
                            <View style={{ flex: 10, width: '100%' }}>
                                <Chip style={{ marginVertical: 10 }} mode='flat' icon="information">Personnel Cihaz Bilgileri</Chip>
                                <Chip mode='outlined' style={{ flex: 1 }}>
                                    <View style={{ gap: 20, height: '100%' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.textStyle}>Adı Soyadı</Text>
                                            </View>
                                            <View style={{ width: '55%' }}>
                                                <Text>{` :  ${deviceDto.userDto.firstName ? deviceDto.userDto.firstName : "İsim Yok"} ${deviceDto.userDto.lastName ? deviceDto.userDto.lastName : "Soyadı Yok"}`}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.textStyle}>Eski Cihaz Markası</Text>
                                            </View>
                                            <View style={{ width: '55%', }}>
                                                <Text>{` :  ${deviceDto.deviceBrand ? deviceDto.deviceBrand : "Yok"}`}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.textStyle}>Eski Cihaz Modeli</Text>
                                            </View>
                                            <View style={{ width: '55%', }}>
                                                <Text>{` :  ${deviceDto.deviceModelName ? deviceDto.deviceModelName : "Yok"}`}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.textStyle}>Yeni Cihaz Markası</Text>

                                            </View>
                                            <View style={{ width: '55%' }}>
                                                <Text>{` :  ${deviceDto.distinctDeviceBrand ? deviceDto.distinctDeviceBrand : "Yok"}`}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.textStyle}>Yeni Cihaz Modeli</Text>
                                            </View>
                                            <View style={{ width: '55%' }}>
                                                <Text>{` :  ${deviceDto.distinctDeviceModelName ? deviceDto.distinctDeviceModelName : "Yok"}`}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Chip>
                            </View>
                        </View>
                    </View>
                </Modal>
                {children}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
