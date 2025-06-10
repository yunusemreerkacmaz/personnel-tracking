import React, { useCallback, useState } from 'react'
import { View } from 'react-native';
import { Avatar, Button, Card, HelperText, List, MD3Colors, RadioButton, Snackbar, Text, TextInput } from 'react-native-paper';
import { AddUserDto, HelperTextDto, initialAddUserDto, initialHelperTextDto } from './Dtos/userDto';
import { ResponseStatus } from '../../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import { GenderEnum } from '../../../Enums/GenderEnum';
import { useFocusEffect } from '@react-navigation/native';
import { initialRoleDto, RoleDto } from '../AddRole/Dtos/roleDto';
import { AddUser, GetUsers } from './Requests/userStore';
import { ScrollView } from 'react-native-gesture-handler';
import { GetRoles } from '../AddRole/Requests/roleStore';
import { GetStores } from '../../Stores/Requests/storeRequest';
import { initialFilterDto, initialStoreDto, StoreDto, StoreFilterDto } from '../../Stores/Dtos/storeDto';
import TimePickerRangeModal from '../../Stores/timePickerRangeModal';
import { HelperTextTimeDto, initialHelperTextTimeDto, initialTimeDto, TimeDto } from '../../../Helpers/DataGrid/CrudTimeDto';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AddUserComponent() {
  const [user, setUser] = useState<AddUserDto>(initialAddUserDto)
  const [searchRoles, setSearchRoles] = useState<RoleDto[]>([])
  const [formHelperText, setFormHelperText] = useState<HelperTextDto>(initialHelperTextDto)
  const [searchRoleValue, setSearchRoleValue] = useState("");
  const [roles, setRoles] = useState<RoleDto[]>([])
  const [users, setUsers] = useState<AddUserDto[]>([])
  const [stores, setStores] = useState<StoreDto[]>([])
  const [searchStores, setSearchStores] = useState<StoreDto[]>([])
  const [filter, setfilter] = useState<StoreFilterDto>(initialFilterDto)
  const [userExpandListAction, setuserExpandListAction] = useState<boolean>(false)
  const [storeExpandListAction, setStoreExpandListAction] = useState<boolean>(false)
  const [reset, setReset] = useState<boolean>(false)
  const [shiftTime, setShiftTime] = useState<TimeDto>(initialTimeDto)
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false)
  const [helperTextTimeDto, setHelperTextTimeDto] = useState<HelperTextTimeDto>(initialHelperTextTimeDto)

  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const handleUserExpand = () => setuserExpandListAction(!userExpandListAction)
  const handleStoreExpand = () => { setStoreExpandListAction(!storeExpandListAction); setSnackbarVisible(false) }
  const AddUserLeftContent = (props: any) => <Avatar.Icon {...props} color='green' icon="account" />

  useFocusEffect(
    useCallback(
      () => {
        setUser(initialAddUserDto)
        setFormHelperText(initialHelperTextDto)
      },
      [],
    )
  );

  if (formHelperText.storeDto) {  // Cisniyet bilgileri Kurum seç içinde olduğunda kurum seçilmediğinde kurum seç açık kalsın ve formtext içinde gözüksün
    if (!storeExpandListAction) {
      handleStoreExpand()
    }
  }

  useFocusEffect(
    useCallback(
      () => {
        let temp = true
        const getRoles = async () => {
          if (temp) {
            const responseRoles = await GetRoles()
            if (responseRoles?.responseStatus === ResponseStatus.IsSuccess) {
              setRoles(responseRoles?.results)
              setSearchRoles(responseRoles?.results)
            }
          }
        }
        const getUsers = async () => {
          if (temp) {
            const responseUsers = await GetUsers()
            if (responseUsers?.responseStatus === ResponseStatus.IsSuccess) {
              setUsers(responseUsers?.results)
            }
          }
        }

        let getStoreAsync = async () => {
          if (temp) {
            const response = await GetStores();
            if (response?.responseStatus === ResponseStatus.IsSuccess) {
              setStores(response?.results)
              setSearchStores(response?.results)
            }
            else {
              Toast.show({ text1: response?.responseMessage, type: "error" })
            }
          }
        }
        getStoreAsync()
        getRoles();
        getUsers();
        return () => {
          temp = false
        }
      },
      [],
    )
  )

  const handleAddUser = async (userDto: AddUserDto) => {
    let dto: AddUserDto = { ...userDto, shiftTime: shiftTime, phoneNumber: userDto.phoneNumber.replaceAll(" ", "") }
    const response = await AddUser(dto);
    if (response?.responseStatus === ResponseStatus.IsSuccess) {
      setUsers(response.results)
      setUser(initialAddUserDto)
      setReset(true)
      Toast.show({
        text1: response.responseMessage,
        type: 'success'
      })
    }
    else if (response?.responseStatus === ResponseStatus.IsWarning) {
      Toast.show({
        text1: response.responseMessage,
        type: 'info'
      })
    }
    else {
      Toast.show({
        text1: response?.responseMessage,
        type: 'error'
      })
    }
  }

  const handleChange = (value: any, textName: 'userName' | 'password' | 'firstName' | 'lastName' | 'gender' | 'email' | 'storeDto' | 'roleDto' | 'phoneNumber') => {
    if (typeof value === "string") {
      if (value === "") {
        setFormHelperText({ ...formHelperText, [textName]: true })
      }
      else if (textName === "phoneNumber") {
        const regex = /^(?:\+90|0)?\s?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;                         // +90 532 123 45 67  ,  0543 321 12 00    ,  543 321 12 00  bu tipte olanları kabul eder
        let isValidPhoneNumber = value.match(regex)                                             // numara geçerliyse false değilse true
        setFormHelperText({ ...formHelperText, [textName]: !isValidPhoneNumber })
      }
      else {
        setFormHelperText({ ...formHelperText, [textName]: false })
      }
    }
    else {
      if (value.id === 0) {
        setFormHelperText({ ...formHelperText, [textName]: true })
      }
      else {
        setFormHelperText({ ...formHelperText, [textName]: false })
      }
    }

    switch (textName) {
      case 'userName':
        setUser({ ...user, userName: value })
        break;

      case 'password':
        setUser({ ...user, password: value })
        break;

      case 'firstName':
        setUser({ ...user, firstName: value })
        break;

      case 'lastName':
        setUser({ ...user, lastName: value })
        break;

      case 'gender':
        setUser({ ...user, gender: value })
        break;

      case 'email':
        setUser({ ...user, email: value })
        break;

      case 'storeDto':
        setUser({ ...user, storeDto: value })
        break;

      case 'roleDto':
        setUser({ ...user, roleDto: value })
        break;

      case 'phoneNumber':
        setUser({ ...user, phoneNumber: value })
        break;

      default:
        break;
    }
  }

  type StoreItemProps = { storeDto: StoreDto }
  const StoreItem: React.FC<StoreItemProps> = ({ storeDto }) => (
    <List.Item
      title={storeDto.storeName}
      key={storeDto.id}
      titleStyle={[{ justifyContent: 'center', alignItems: 'center' }, storeDto.id === user.storeDto.id ? { color: 'green', fontWeight: 'bold' } : { color: 'gray' }]}
      style={{ justifyContent: 'center', alignItems: 'center', minWidth: '100%', paddingVertical: 1, }} // Yüksekliği azaltmak için
      right={(id) => (
        <Button
          icon={user.storeDto.id === storeDto.id ? 'check' : ""}
          mode="contained"
          buttonColor={user.storeDto.id === storeDto.id ? "green" : "gray"}
          onPress={() => {
            if (user.storeDto.id == storeDto.id) {
              handleChange(initialStoreDto, 'storeDto')
            }
            else {
              handleChange(storeDto, 'storeDto')
              handleStoreExpand()
              onToggleSnackBar()
              setShiftTime(prev => ({
                ...prev,
                startDate: storeDto.storeTime.startDate,
                endDate: storeDto.storeTime.endDate,
              }))
            }
          }}>
          {user.storeDto.id === storeDto.id ? "Seçildi" : "Seç"}
        </Button>
      )}
    />
  )

  type RoleItemProps = { roleDto: RoleDto };
  const RoleItem: React.FC<RoleItemProps> = ({ roleDto }) => (
    <List.Item
      title={roleDto.roleName}
      key={roleDto.id}
      titleStyle={[{ justifyContent: 'center', alignItems: 'center' }, roleDto.id === user.roleDto.id ? { color: 'green', fontWeight: 'bold' } : { color: 'gray' }]}
      style={{ paddingVertical: 1, justifyContent: 'center', alignItems: 'center', minWidth: '100%' }} // Yüksekliği azaltmak için
      right={(id) => (
        <Button
          icon={user.roleDto.id === roleDto.id ? 'check' : ""}
          mode="contained"
          buttonColor={user.roleDto.id === roleDto.id ? "green" : "gray"}
          onPress={() => {
            if (user.roleDto.id === roleDto.id) {
              handleChange(initialRoleDto, 'roleDto')
            }
            else {
              handleChange(roleDto, 'roleDto')

              handleUserExpand()
            }
          }}>
          {user.roleDto.id === roleDto.id ? "Seçildi" : "Seç"}
        </Button>
      )}
    />
  );

  return (
    <ScrollView style={{marginTop:8}}>
      <Card elevation={5} style={{ flex: 1, justifyContent: 'center', alignItems: 'center',borderRadius:20 }}>
        <LinearGradient colors={['black', '#3F638C']} style={{ width: '100%', height: '100%', borderRadius: 20 }}>
          <Card.Title subtitleStyle={{ opacity: 0.5,color:"white" }} titleStyle={{ fontWeight: 'bold',color:"#64ff70" }} title="KULLANICI BİLGİLERİNİ EKLE" subtitle="Kullanıcı Bilgilerini Girin" left={AddUserLeftContent} />
          <Card.Content style={{ minWidth: '80%' }}>
            <Animated.View 
            entering={FadeIn.delay(200).duration(1000)}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                onBlur={() => { user.userName && setFormHelperText({ ...formHelperText, userName: user.userName === "" ? true : false }) }}
                mode='outlined'
                onChangeText={text => { handleChange(text, 'userName') }}
                value={user.userName}
                label="Kullanıcı adı girin . . ."
                style={{ width: 350, minWidth: '75%', height: 40 }}
                error={formHelperText.userName}
              />
              {formHelperText.userName && <HelperText type="error" visible={formHelperText.userName}>Lütfen Kullanıcı Adı Girin</HelperText>}
              <TextInput
                onBlur={() => { user.password && setFormHelperText({ ...formHelperText, password: user.password === "" ? true : false }) }}
                mode='outlined'
                onChangeText={text => { handleChange(text, 'password') }}
                value={user.password}
                label="Şifre girin . . ."
                style={{ width: 350, minWidth: '75%', height: 40 }}
                error={formHelperText.password}
              />
              {formHelperText.password && <HelperText type="error" visible={formHelperText.password}>Lütfen Şifre Girin</HelperText>}
              <TextInput
                onBlur={() => { user.firstName && setFormHelperText({ ...formHelperText, firstName: user.firstName === "" ? true : false }) }}
                mode='outlined'
                onChangeText={text => { handleChange(text, 'firstName') }}
                value={user.firstName}
                label="Adı girin . . ."
                style={{ width: 350, minWidth: '75%', height: 40 }}
                error={formHelperText.firstName}
              />
              {formHelperText.firstName && <HelperText type="error" visible={formHelperText.firstName}>Lütfen Adı Girin</HelperText>}
              <TextInput
                onBlur={() => { user.lastName && setFormHelperText({ ...formHelperText, lastName: user.lastName === "" ? true : false }) }}
                mode='outlined'
                onChangeText={text => { handleChange(text, 'lastName') }}
                value={user.lastName}
                label="Soyadı girin . . ."
                style={{ width: 350, minWidth: '75%', height: 40 }}
                error={formHelperText.lastName}
              />
              {formHelperText.lastName && <HelperText type="error" visible={formHelperText.lastName}>Lütfen Soyadı Girin</HelperText>}
              <TextInput
                onBlur={() => { user.email && setFormHelperText({ ...formHelperText, email: user.email === "" ? true : false }) }}
                mode='outlined'
                onChangeText={text => { handleChange(text, 'email') }}
                value={user.email}
                label="Email girin . . ."
                style={{ width: 350, minWidth: '75%', height: 40 }}
                error={formHelperText.email}
              />
              {formHelperText.email && <HelperText type="error" visible={formHelperText.email}>Lütfen Email Girin</HelperText>}
              <TextInput
                onBlur={() => { user.email && setFormHelperText({ ...formHelperText, phoneNumber: user.phoneNumber === "" ? true : false }) }}
                mode='outlined'
                onChangeText={text => { handleChange(text, 'phoneNumber') }}
                value={user.phoneNumber}
                label="Telefon numarası girin . . ."
                style={{ width: 350, minWidth: '75%', height: 40 }}
                error={formHelperText.phoneNumber}
                keyboardType='phone-pad'
                textContentType='telephoneNumber'

              />
              {formHelperText.phoneNumber && <HelperText type="error" visible={formHelperText.phoneNumber}>Lütfen geçerli bir telefon numarası girin</HelperText>}
              <List.Section style={{ width: 350, minWidth: '75%', maxWidth: '100%', display: 'flex', alignItems: 'flex-start' }}>
                <List.Accordion
                  expanded={userExpandListAction}
                  onPress={handleUserExpand}
                  style={{
                    width: '100%',
                    minWidth: '100%',
                    height: 40, // Yüksekliği sınırla
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 0, // Varsayılan iç boşluğu kaldır
                  }}
                  title={user.roleDto.id > 0 ? user.roleDto.roleName : "Yetki Seç . . ."}
                  titleStyle={{
                    fontSize: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    lineHeight: 30, // Yüksekliğe uygun satır yüksekliği
                  }}
                >
                  <List.Item style={{ minWidth: '100%', maxWidth: '75%', justifyContent: 'center' }} title=""
                    left={() =>
                      <TextInput
                        value={searchRoleValue}
                        placeholder='Ara'
                        style={{ width: 350, height: 40, minWidth: '70%' }}
                        onChangeText={(text) => {
                          if (text != "") {
                            setSearchRoles(roles.filter(x => x.roleName.trim().toLowerCase().includes(text.trim().toLowerCase())))
                          }
                          else {
                            setSearchRoles(roles)
                          }
                          setSearchRoleValue(text)
                        }}
                      />
                    }
                  />
                  <List.Item
                    title=""
                    style={{
                      minWidth: '100%',
                      maxWidth: '75%',
                      width: '100%',
                      margin: 0,
                      padding: 0,
                      backgroundColor: '#D8D8D8'
                    }}
                    left={() => (
                      <ScrollView
                        style={{
                          maxHeight: 200,
                          width: '100%',
                          minWidth: '100%',
                          maxWidth: '100%',
                          margin: 0,
                          padding: 0
                        }}
                      >
                        {searchRoles.map(item => (
                          <RoleItem key={item.id.toString()} roleDto={item} />
                        ))}
                      </ScrollView>
                    )} />
                </List.Accordion>
              </List.Section>
              {formHelperText.roleDto && <HelperText type="error" visible={formHelperText.roleDto}>Lütfen Yetkiyi Seçin</HelperText>}
              <List.Section style={{ width: 350, minWidth: '75%', maxWidth: '100%', display: 'flex', alignItems: 'flex-start', marginTop: 1 }}>
                <List.Accordion
                  expanded={storeExpandListAction}
                  onPress={handleStoreExpand}
                  style={{
                    width: '100%',
                    minWidth: '100%',
                    height: 40, // Yüksekliği sınırla
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 0, // Varsayılan iç boşluğu kaldır
                  }}
                  title={user.storeDto.storeName && user.storeDto.storeTime.startDate && user.storeDto.storeTime.endDate ? `${user.storeDto.storeName} (${user.storeDto.storeTime.startDate.substring(0, 5)} - ${user.storeDto.storeTime.endDate.substring(0, 5)}) ` : "Kurum Seç . . ."}
                  titleStyle={{
                    fontSize: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    lineHeight: 30, // Yüksekliğe uygun satır yüksekliği
                  }}
                >
                  {formHelperText.storeDto && <HelperText type="error" visible={formHelperText.storeDto}>Lütfen Kurumu Seçin</HelperText>}

                  <List.Item style={{ minWidth: '100%', maxWidth: '75%' }} title=""
                    left={() =>
                      <TextInput
                        value={filter.searchValue}
                        placeholder='Ara'
                        style={{ width: 350, height: 40, minWidth: '70%' }}
                        onChangeText={(text) => {
                          if (text != "") {
                            setSearchStores(stores.filter(x => x.storeName.trim().toLowerCase().includes(text.trim().toLowerCase())))
                          }
                          else {
                            setSearchStores(stores)
                          }
                          setfilter(prev => ({ ...prev, searchValue: text }))
                        }}
                      />
                    }
                  />
                  <List.Item
                    title=""
                    style={{
                      padding: 0,
                      margin: 0,
                      width: '100%',
                      maxWidth: '100%',
                      minWidth: '100%',
                      backgroundColor: '#D8D8D8'
                    }} //backgroundColor: '#D8D8D8'
                    left={() => (
                      <ScrollView
                        style={{
                          maxHeight: 200,
                          width: '100%',
                          minWidth: '100%',
                          maxWidth: '100%',
                          margin: 0,
                          padding: 0
                        }}>
                        {searchStores.map(item => (
                          <StoreItem key={item.id.toString()} storeDto={item}
                          />
                        ))}
                      </ScrollView>
                    )} />
                </List.Accordion>
                <List.Item
                  title=""
                  style={{ minWidth: '100%', maxWidth: '75%', height: 120 }}
                  left={() =>
                    <View style={{ width: '55%' }}>
                      <TimePickerRangeModal setStoreTime={setShiftTime} storeTime={shiftTime} reset={reset} helperTextTimeDto={helperTextTimeDto} setHelperTextTimeDto={setHelperTextTimeDto} />
                    </View>
                  }
                  right={() =>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '45%' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '20%', marginVertical: 20 }}>
                        <RadioButton
                          value={user.gender}
                          uncheckedColor={formHelperText.gender ? 'red' : "#34a0a4"}
                          color={MD3Colors.primary70}
                          status={user.gender === GenderEnum.Man ? 'checked' : 'unchecked'}
                          onPress={() => {
                            handleChange(GenderEnum.Man, 'gender')
                          }}
                        />
                        <List.Icon color={MD3Colors.primary70} icon="human-male" />
                        <Text style={[{color:"#dee2e6"},user.gender === GenderEnum.Man ? { fontWeight: 'bold', fontSize: 18 } : ""]}>Erkek</Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '20%' }}>
                        <RadioButton
                          value={user.gender}
                          color={MD3Colors.tertiary70}
                          uncheckedColor={formHelperText.gender ? 'red' : "#34a0a4"}
                          status={user.gender === GenderEnum.Woman ? 'checked' : 'unchecked'}
                          onPress={() => {
                            handleChange(GenderEnum.Woman, 'gender')
                          }}
                        />
                        <List.Icon color={MD3Colors.tertiary70} icon="human-female" />
                        <Text style={[{color:"#dee2e6"},user.gender === GenderEnum.Woman ? { fontWeight: 'bold', fontSize: 18 } : ""]}>Kadın</Text>
                      </View>
                      {formHelperText.gender && <HelperText type="error" visible={formHelperText.gender}>Lütfen Cinsiyet Girin</HelperText>}

                    </View>

                  }
                />
              </List.Section>
              <Snackbar
                visible={snackbarVisible}
                onDismiss={onDismissSnackBar}
                duration={75000}
                style={{ flexDirection: 'column', alignItems: 'center', padding: 0, margin: 0 }}
                action={{
                  label: 'Kapat',
                  icon: "close",
                  mode: "contained",
                  elevation: 5,
                  style: { marginBottom: 15 },
                  onPress: () => {
                    // Do something
                  },
                }}
              >
                Personelin vardiyası seçtiğiniz mağazanın saati ile aynıysa başlangıç ve bitiş saatini doldurmanıza gerek yok
              </Snackbar>
            </Animated.View>
          </Card.Content>
          <Card.Actions style={{ backgroundColor: '#E0E2E4', height: 'auto', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Button
                buttonColor='green'
                mode='contained'
                disabled={
                  user.firstName === "" ||
                  user.lastName === "" ||
                  user.userName === "" ||
                  user.password === "" ||
                  user.gender === "" ||
                  user.roleDto === initialRoleDto ||
                  user.storeDto === initialStoreDto
                }
                onPress={async () => {
                  await handleAddUser(user)
                }}
              >Ekle</Button>
            </View>
          </Card.Actions>
        </LinearGradient>
      </Card>
    </ScrollView>
  )
}
