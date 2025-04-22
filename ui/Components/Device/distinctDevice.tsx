import React, { useCallback, useState } from 'react'
import { FlatList, View } from 'react-native'
import { Button, Card, List, Searchbar,Text } from 'react-native-paper';
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
import { BarcodeDto, initialBarcodeState } from '../Barcode/Dtos/barcodeDto';

export default function DistinctDevice() {
    const [search, setSearch] = React.useState('');
    const [distinctDeviceUsers, setDistinctDeviceUsers] = useState<DeviceDto[]>([])
    const [approvedStatus, setApprovedStatus] = useState<boolean>(false)

    const handleSearch = () => {
    }
    useFocusEffect(
        useCallback(
            () => {
                let getDistinctDeviceUsers = async () => {
                    var response = await getDistinctDevices()
                    response?.results && setDistinctDeviceUsers(response.results)
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
        <View style={{ width: '95%', height: '85%' }}>
            <Searchbar
                placeholder="Cihaz adı ara . . ."
                onChangeText={setSearch}
                value={search}
                style={{ marginVertical: 20 }}
                onIconPress={handleSearch}
            />
            <Card style={{ backgroundColor: '#E7C5BC', maxHeight: '90%', elevation: 24 }}>
                <Card.Title subtitleStyle={{ color: 'gray' }} titleStyle={{ fontWeight: 'bold', color: 'black' }} title="YENİ CİHAZ ONAYLAMA ALANI" subtitle="Cihazını onaylanmasını istediğiniz kişiyi seçin" />
                <Card.Content style={{ height: '90%', backgroundColor: '#C5D6E9' }}>
                    {
                        distinctDeviceUsers?.length === 0 ?
                            <View style={{ flex:1,justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Gösterilecek Veri yok</Text>
                            </View> :
                            <FlatList
                                data={distinctDeviceUsers}
                                style={{ paddingVertical: 2 }}
                                renderItem={({ item, index }) => <DeviceItem deviceDto={item} index={index + 1} setApprovedStatus={setApprovedStatus} approvedStatus={approvedStatus} />}
                                keyExtractor={item => item.id.toString()}
                            />
                    }
                </Card.Content>
            </Card>
        </View>
    )
}
type DeviceItemProps = { deviceDto: DeviceDto, index: number, approvedStatus: boolean, setApprovedStatus: React.Dispatch<React.SetStateAction<boolean>> }
const DeviceItem: React.FC<DeviceItemProps> = ({ deviceDto, index, setApprovedStatus, approvedStatus }) => {
  const dispatch = useDispatch<AppDispatch>()

    const handleUpdateDevice = async (value:boolean) => {
        
        deviceDto={...deviceDto,tokenDeletionStatus:value ? true: false}
        const updateDevice = await UpdateDevice(deviceDto)
        if (updateDevice?.responseStatus === ResponseStatus.IsSuccess) {
            console.log("******************* deviceToken = ",deviceDto.deviceToken);
            
            setTimeout(() => {
                setApprovedStatus(!approvedStatus)
            }, 1500);
            dispatch(barcodeSlice.actions.barcodeVisible({...initialBarcodeState,qrCodeVisibleState:false}))
            Toast.show({ text1: "Cihaz Onayı", text2: updateDevice.responseMessage })
            await AsyncStorage.removeItem(DeviceTokenEnum.key).then(async () => {
                await AsyncStorage.setItem(DeviceTokenEnum.key, deviceDto.deviceToken)
            })
        }
        else {
            dispatch(barcodeSlice.actions.barcodeVisible({...initialBarcodeState,qrCodeVisibleState:true}))
            Toast.show({ text1: "Cihaz Onayı", text2: updateDevice?.responseMessage })
            setApprovedStatus(!approvedStatus)
        }
    }
    return <List.Item
        title={`${deviceDto.userDto.firstName} ${deviceDto.userDto.lastName}`}
        key={index}
        //   titleStyle={[{ justifyContent: 'center', alignItems: 'center', }]}
        style={{ justifyContent: 'center', alignItems: 'center', minWidth: '100%', paddingVertical: 1 }} // Yüksekliği azaltmak için
        right={(id) => (
           <View style={{flexDirection:'row', justifyContent:'center', gap:10}}>
             <Button
                //   icon={user.id === storeDto.id ? 'check' : ""}
                mode="text"
                textColor='white'
                  buttonColor={"green"}
                onPress={()=>{
                    handleUpdateDevice(true)
                }}>
                {/* {user.storeDto.id === storeDto.id ? "Seçildi" : "Seç"} */}
                Onayla
            </Button>
            <Button
                //   icon={user.id === storeDto.id ? 'check' : ""}
                mode="text"
                textColor='white'
                  buttonColor={"#AE1D1D"}
                  onPress={()=>{
                    handleUpdateDevice(false)
                  }}
                >
                {/* {user.storeDto.id === storeDto.id ? "Seçildi" : "Seç"} */}
                Reddet
            </Button>
           </View>
            
        )}
    />
}
