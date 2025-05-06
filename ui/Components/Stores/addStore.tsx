import React, { useCallback, useState } from 'react'
import { Avatar, Button, Card, TextInput, Chip, HelperText } from 'react-native-paper';
import { initialStoreDto, StoreDto } from './Dtos/storeDto';
import TimePickerRangeModal from './timePickerRangeModal';
import { StoreMapView } from './storeMapView';
import { View } from 'react-native';
import { AddNewStore } from './Requests/storeRequest';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { CrudEnum } from '../../Enums/ComponentEnum';
import { HelperTextTimeDto, initialHelperTextTimeDto, initialTimeDto, TimeDto } from '../../Helpers/DataGrid/CrudTimeDto';
import { ScrollView } from 'react-native-gesture-handler';

export default function AddStoreComponent() {
    const [data, setData] = useState<StoreDto>(initialStoreDto)
    const [storeTime, setStoreTime] = useState<TimeDto>(initialTimeDto)
    const [reset, setReset] = useState<boolean>(false)
    const [visible, setVisible] = useState<"map" | "time" | "default">("default")
    const [helperTextTimeDto, setHelperTextTimeDto] = useState<HelperTextTimeDto>(initialHelperTextTimeDto)
    const [formHelperText, setFormHelperText] = useState({ storeName: false, latitude: false, longitude: false })

    useFocusEffect(
        useCallback(
            () => {
                setFormHelperText({
                    latitude: false,
                    longitude: false,
                    storeName: false
                })
                setHelperTextTimeDto(initialHelperTextTimeDto)
            },
            [reset],
        )
    )

    const saveDisabledStatus = () => {
        if (data.storeLocation.latitude !== initialStoreDto.storeLocation.latitude && data.storeLocation.longitude != initialStoreDto.storeLocation.longitude && data.storeName && storeTime.startDate && storeTime.endDate) {
            return false
        }
        else {
            return true
        }
    }
    const handleResetDisabled = () => {
        if (data.storeName || data.storeLocation.latitude !== initialStoreDto.storeLocation.latitude || data.storeLocation.longitude != initialStoreDto.storeLocation.longitude || storeTime.startDate || storeTime.endDate) {
            return false
        }
        else {
            return true
        }
    }

    const handlePress = async () => {
        let addDataDto: StoreDto = { ...data, storeTime: storeTime, }
        const response = await AddNewStore(addDataDto)
        if (response?.responseStatus === ResponseStatus.IsSuccess) {
            setData(initialStoreDto)
            Toast.show({
                text1: response.responseMessage,
                type: 'success'
            })
            setReset(false)
        }
        else {
            Toast.show({
                text1: response?.responseMessage,
                type: 'error'
            })
        }
    }

    const handleReset = () => {
        setData(initialStoreDto)
        setStoreTime(initialTimeDto)
        setReset(true)
        setFormHelperText(prev => ({ ...prev, latitude: false, longitude: false, endDate: false, startDate: false, storeName: false }))
    }

    const handleShowMap = () => { setVisible("map") }

    const LeftContent = (props: any) => <Avatar.Icon size={55} icon="store-marker" />
    return (
        <ScrollView style={{ width: '100%' }}>
            <Card elevation={5} style={{ flex: 1, justifyContent: 'center', margin: 10 }}>
                <Card.Title titleStyle={{ marginLeft: 20, fontWeight: 'bold' }} style={{ marginBottom: 20 }} subtitleStyle={{ marginLeft: 20, opacity: 0.5 }} title="Lokasyon Ekle" subtitle="Kurum Adı ve Lokasyon Ekleme Alanı" left={LeftContent} />
                <Card.Content style={{ flex: 1 }}>
                    <TextInput
                        label="Kurum Adı"
                        value={data.storeName}
                        onBlur={() => { data.storeName && setFormHelperText({ ...formHelperText, storeName: data.storeName === "" ? true : false }) }}
                        onChangeText={text => {
                            setData({ ...data, storeName: text })
                            if (text) {
                                setFormHelperText(prev => ({ ...prev, storeName: false }))
                            }
                            else {
                                setFormHelperText(prev => ({ ...prev, storeName: true }))
                            }
                        }}
                    />
                    {formHelperText.storeName && <HelperText type="error" visible={formHelperText.storeName}>Lütfen Kurumu Seçin</HelperText>}
                    <Chip textStyle={{ color: 'red' }} style={{ backgroundColor: '#ACC8E5', marginTop: 15 }} icon="map-marker-radius" onPress={handleShowMap}>{visible === "map" ? "Kurum konumunu kapat" : "Kurum konumu ekle"}</Chip>
                    {formHelperText.latitude && formHelperText.longitude && <HelperText type="error" visible={formHelperText.latitude && formHelperText.longitude}>Lütfen Kurumu Seçin</HelperText>}
                    <TimePickerRangeModal storeTime={storeTime} setStoreTime={setStoreTime} reset={reset} helperTextTimeDto={helperTextTimeDto} setHelperTextTimeDto={setHelperTextTimeDto} />
                </Card.Content>
                <Card.Actions style={{ flex: 1 }}>
                    <Button disabled={handleResetDisabled()} onPress={handleReset}>Sıfırla</Button>
                    <Button buttonColor='green' onPress={handlePress} disabled={saveDisabledStatus()}>Kaydet</Button>
                </Card.Actions>
            </Card>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {visible === "map" && <StoreMapView visible={visible} setVisible={setVisible} data={data} proccess={CrudEnum.AddStore} key={data.id} setFormHelperText={setFormHelperText} setData={setData} />}
            </View>
        </ScrollView>
    )
}
