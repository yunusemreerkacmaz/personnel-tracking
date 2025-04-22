import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react'
import { FlatList, View } from 'react-native'
import { Button, Card, List, Searchbar, Text } from 'react-native-paper'
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { DeleteDevice, getDevices } from './Requests/deviceInfoStore';
import { UserDto } from '../Admin/AddUser/Dtos/userDto';

export default function ChangeDeviceToken() {
  const [search, setSearch] = React.useState('');
  const [deviceUsers, setDeviceUsers] = useState<UserDto[]>([])
  const [approvedStatus, setApprovedStatus] = useState<boolean>(false)

  const handleSearch = () => {
  }

  useFocusEffect(
      useCallback(
          () => {
              let getDeviceUsers = async () => {
                  var response = await getDevices()
                  if (response?.responseStatus === ResponseStatus.IsSuccess) {
                    setDeviceUsers(response.results)
                  }
                  else if (response?.responseStatus === ResponseStatus.IsWarning) {
                      Toast.show({ text1: "Try Catch'e düştü kontrol et", text2: response?.responseMessage, type: 'info' })
                  }
              }
              getDeviceUsers();
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
              <Card.Title subtitleStyle={{ color: 'gray' }} titleStyle={{ fontWeight: 'bold', color: 'black' }} title="CİHAZ SİLME ALANI" subtitle="Cihazını silmek istediğiniz kişiyi seçin" />
              <Card.Content style={{ height: '90%', backgroundColor: '#C5D6E9' }}>
                  {
                      deviceUsers?.length === 0 ?
                          <View style={{ flex:1,justifyContent: 'center', alignItems: 'center' }}>
                              <Text>Gösterilecek Veri yok</Text>
                          </View> :
                          <FlatList
                              data={deviceUsers}
                              style={{ paddingVertical: 2 }}
                              renderItem={({ item, index }) => <DeviceItem userDto={item} index={index + 1} setApprovedStatus={setApprovedStatus} approvedStatus={approvedStatus} />}
                              keyExtractor={item => item.id.toString()}
                          />
                  }
              </Card.Content>
          </Card>
      </View>
  )
}
type DeviceItemProps = { userDto: UserDto, index: number, approvedStatus: boolean, setApprovedStatus: React.Dispatch<React.SetStateAction<boolean>> }
const DeviceItem: React.FC<DeviceItemProps> = ({ userDto, index, setApprovedStatus, approvedStatus }) => {
    const handleDeleteDevice = async () => {
        const deleteDevice = await DeleteDevice(userDto.id)
        if (deleteDevice?.responseStatus === ResponseStatus.IsSuccess) {
                setApprovedStatus(!approvedStatus)
            Toast.show({ text1: "Cihaz Onayı", text2: deleteDevice.responseMessage,visibilityTime:10000 })
        }
        else if(deleteDevice?.responseStatus === ResponseStatus.IsWarning){
          Toast.show({ text1: "Cihaz Onayı", text2: deleteDevice.responseMessage })
        }
        else {
            Toast.show({ text1: "Cihaz Onayı", text2: deleteDevice?.responseMessage })
        }
    }
    return <List.Item
        title={`${userDto.firstName} ${userDto.lastName}`}
        key={index}
        //   titleStyle={[{ justifyContent: 'center', alignItems: 'center' }, userDto.id === user.storeDto.id ? { color: 'green', fontWeight: 'bold' } : { color: 'gray' }]}
        style={{ justifyContent: 'center', alignItems: 'center', minWidth: '100%', paddingVertical: 1, }} // Yüksekliği azaltmak için
        right={(id) => (
            <Button
                  // icon={'close' }
                mode="contained"
                  buttonColor="red"
                onPress={handleDeleteDevice}>
                {/* {user.storeDto.id === storeDto.id ? "Seçildi" : "Seç"} */}
                Sil
            </Button>
        )}
    />
}
