import React, { useCallback, useState } from 'react'
import { View, FlatList } from 'react-native'
import { Button, Card, Chip, List, Searchbar,Text } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { ToastShowParamsCustomType } from '../../../Helpers/Toast/ToastDto'
import { UserBarcodeLoginDto } from './Dtos/userBarcodeLogin'
import { GetEntryExitUserLogout, UpdateEntryExitUser } from './Requests/AdminBarcodeStore'
import { ResponseStatus } from '../../../ServiceResults/serviceResult'
import { useFocusEffect } from '@react-navigation/native'

export default function UserLoginComponent() {
  const [users, setUsers] = useState<UserBarcodeLoginDto[]>([])
  const [searchUsers, setSearchUsers] = useState<UserBarcodeLoginDto[]>([])
  const [search, setSearch] = React.useState('');
  const [crudStatus, setCrudStatus] = useState<boolean>(false)

  useFocusEffect(
    useCallback(
      () => {
        const userBarcodeLogoutAsync = async () => {
          let getBarcodeUsers = await GetEntryExitUserLogout()
          if (getBarcodeUsers?.responseStatus === ResponseStatus.IsSuccess) {
            setUsers(getBarcodeUsers.results)
            setSearchUsers(getBarcodeUsers.results)
          }
          else if (getBarcodeUsers?.responseStatus === ResponseStatus.IsWarning) {
            setUsers([])
            setSearchUsers([])
            setTimeout(() => {
              Toast.show({ text1: "Kullancı Çıkışı", text2: getBarcodeUsers?.responseMessage, type: 'info' })
            }, 1500);
          }
          else {
            Toast.show({ text1: "Kullancı Çıkışı", text2: getBarcodeUsers?.responseMessage })
            setUsers([])
            setSearchUsers([])
          }
        }
        userBarcodeLogoutAsync()
      },
      [crudStatus],
    )
  )

  const handleSearch = () => {
    let filteredUsers = users.filter(user =>
      user.userDto.firstName.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
      user.userDto.lastName.toLowerCase().trim().includes(search.toLowerCase().trim()))
    setSearchUsers(filteredUsers)
  }
  const handleClearSearch = () => { setSearchUsers(users) }

  return (
      <Card style={{ flex:1, elevation: 24, backgroundColor: '#E7C5BC' }}>
        <Card.Title subtitleStyle={{ color: 'gray' }} titleStyle={{ fontWeight: 'bold', color: 'black' }} title="KULLANICI ÇIKIŞI ONAYLAMA ALANI" subtitle="Çıkışının onaylanmasını istediğiniz kişiyi seçin" />
          {
            searchUsers?.length === 0 ?
              <View style={{ height:'100%',justifyContent: 'center', alignItems: 'center' }}>
                <Chip icon="information" >Gösterilecek Veri Yok</Chip>
              </View> :
              <FlatList
                ListHeaderComponent={
                  <Searchbar
                    placeholder="Cihaz adı ara . . ."
                    onChangeText={setSearch}
                    value={search}
                    style={{ marginVertical: 20 }}
                    onIconPress={handleSearch}
                    onClearIconPress={handleClearSearch}
                  />
                }
                data={searchUsers}
                style={{paddingVertical: 2,backgroundColor: '#C5D6E9', padding: 10,borderRadius:10  }}
                renderItem={({ item, index }) => <UserLoginItem userDto={item} index={index + 1} setCrudStatus={setCrudStatus} crudStatus={crudStatus} key={item.userDto.id}/>}
                keyExtractor={item => item.userDto.id.toString()}
              />
          }
      </Card>
  )
}
type UserBarcodeLoginProps = { userDto: UserBarcodeLoginDto, index: number, crudStatus: boolean, setCrudStatus: React.Dispatch<React.SetStateAction<boolean>> }
const UserLoginItem: React.FC<UserBarcodeLoginProps> = ({ userDto, index, crudStatus, setCrudStatus }) => {
  const handleUpdate = async (value: boolean) => {
    Toast.show({
      text1: "Kullanıcı Çıkış İşlemleri Onaylama Ekranı",
      text2: "Kullanıcının çıkış yapmasını istediğinizden emin misiniz ?",
      text1Style: { backgroundColor: 'yellow' },
      type: 'customToast',
      autoHide: false,  // ekranda duruyor
      props: {
        okButtonText: "Onayla",
        cancelButtonText: "İptal Et",
        onCancelPress: () => {
          Toast.hide()
          Toast.show({ text1: "Çıkış işlemi iptal edildi", type: 'error' })
        },
        onOkPress: async () => {
          userDto = { ...userDto, isApproval: value }
          const responseUpdateBarcodeUser = await UpdateEntryExitUser(userDto)
          if (responseUpdateBarcodeUser?.responseStatus === ResponseStatus.IsSuccess) {
            Toast.show({ text1: "Çıkış Onayı", text2: responseUpdateBarcodeUser?.responseMessage })
            setCrudStatus(!crudStatus)
          }
          else {
            Toast.show({ text1: "Çıkış Onayı", text2: responseUpdateBarcodeUser?.responseMessage, type: "error" })
          }
        },
      }
    } as ToastShowParamsCustomType)
  }

  return <List.Item
    title={`${userDto.userDto.firstName} ${userDto.userDto.lastName}`}
    key={index}
    titleStyle={{ fontSize: 14, width: "100%", }}
    style={{ paddingRight: 0, paddingVertical: 1 }} // Yüksekliği azaltmak için
    right={(id) => (
      <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
        <Button
          mode="text"
          textColor='white'
          style={{ height: 40 }}
          buttonColor={"green"}
          onPress={() => { handleUpdate(false) }} // giriş işleminde true gönderildi çıkış işleminde false gönderildi
        >
          Çıkış Yap
        </Button>
      </View>
    )}
  />
}
