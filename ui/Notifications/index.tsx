import React, { useEffect, useState } from 'react'
import { Button, IconButton, Modal, Text } from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { AppDispatch, RootState } from '../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationCrudStatusAndDataDto, NotificationDto } from './Dtos/NotificationDto';
import { useNavigation } from '@react-navigation/native';
import { sendMessage } from './Requests/notificationStore';
import { messageReceived } from './notificationSlice';
import { NotificationTypeEnum } from '../Enums/NotificationTypeEnum';

interface IProps {
    visibleNotification: boolean,
    closeNotificationList: () => void
    tempMessages: NotificationDto[]
    setTempMessages: React.Dispatch<React.SetStateAction<NotificationDto[]>>
}
export default function index(props: IProps) {
    const { closeNotificationList, visibleNotification, tempMessages, setTempMessages } = props
    const notifications = useSelector((state: RootState) => state.websocket)
    const dispatch = useDispatch<AppDispatch>()
    const [triggerUpdate, setTriggerUpdate] = useState<boolean>(false)
    const navigation = useNavigation<any>()

    useEffect(() => {
        if (tempMessages.length === 0 && notifications.messages.length > 0) {
            setTempMessages(notifications.messages)
        }
    }, [tempMessages])

    const handleClose = async () => {
        if (tempMessages.length > 0) {
            let updatedDatas = tempMessages.filter(x => x.updateStatus === true)
            if (updatedDatas.length > 0) {
                let dto: NotificationCrudStatusAndDataDto = {
                    crudStatus: NotificationTypeEnum.UpdateNotifies,
                    notifications: updatedDatas
                }
                await dispatch(sendMessage(JSON.stringify(dto)))
                dispatch(messageReceived(tempMessages))
            }
        }
    }

    return (
        <Modal visible={visibleNotification} onDismiss={closeNotificationList}
            contentContainerStyle={{
                display: 'flex',
                // flex: 1,
                height: '90%',
                justifyContent: 'flex-start',
                backgroundColor: 'white',
                padding: 20,
                margin: 20,
                marginTop: 50,
                borderRadius: 20
            }}
            >
            <View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', maxHeight: '98%' }}>
                <Text style={{ marginBottom: 20, fontWeight: 'bold',color:'black' }} variant="titleLarge">Bildirimler</Text>
                {tempMessages.length === 0 && <Text style={{ marginBottom: 10 }} variant="titleSmall">Bildirim Yok</Text>}
                <FlatList
                    data={tempMessages}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) =>
                        <Button
                            key={item.id}
                            mode='contained'
                            style={{ backgroundColor: '#CDD9E6', marginBottom: 20, width: '100%', opacity: item.readStatus ? 0.5 : 1 }}
                            contentStyle={{ justifyContent: 'flex-start', paddingVertical: 10 }}
                            onPress={() => {
                                let updatedNotification: NotificationDto = { ...item }

                                if (item.readStatus === false) {
                                    setTempMessages(prevTempMessages => prevTempMessages.map(row => row.id == item.id ?
                                        { ...row, updateStatus: true, readStatus: true } : row))
                                    setTriggerUpdate(!triggerUpdate)
                                    updatedNotification = { ...updatedNotification, readStatus: true, updateStatus: true }
                                }
                                closeNotificationList()
                                navigation.navigate('NavigationStack', { updatedNotify: updatedNotification });
                            }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                                <View style={{ paddingRight: 20 }}>
                                    <Text variant='titleMedium' style={{color:'black'}}>{item.messageDto.header}</Text>
                                    {typeof item.messageDto.body ==="string" ? <Text style={{color:'gray'}}>{item.messageDto.body}</Text> : <Text>{"..."}</Text>}
                                </View>
                                <IconButton
                                    size={20}
                                    iconColor={"#24BFE2"}
                                    style={{ backgroundColor: !item.readStatus ? 'green' : "#95D388" }}
                                    icon={item.readStatus ? "check-all" : "check"}
                                    onPress={() => {
                                        setTempMessages(prevTempMessages => prevTempMessages.map(row => row.id == item.id ?
                                            { ...row, readStatus: !row.readStatus, updateStatus: !row.updateStatus } : row))
                                    }}
                                />
                            </View>
                        </Button>
                    }
                />
                <Button style={{ marginTop: 20, backgroundColor: 'red' }} mode='contained' onPress={async () => {
                    closeNotificationList();
                    handleClose()
                }}>Kapat</Button>
            </View>
        </Modal>
    )
}
