import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Platform, StyleSheet, Text } from 'react-native';
// import { Button } from '@react-navigation/elements';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../Navigator/navigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { Button, Chip, DataTable, DefaultTheme, IconButton, List } from 'react-native-paper';
import { GetPersonnelIO } from './Requests/personnelStore';
import { EntryExitExpandDto, EntryExitTypeDto, initialEntryExitExpandDto, initialEntryExitTypeDto, PersonnelDto } from './Dtos/PersonnelDto';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { InputOrOutStatus } from '../../Enums/EntryExitEnum';
import { DataGridDto, initialDataGridDto, PaginationDto } from '../../Helpers/DataGrid/DataGridDto';
import { EntryExitEnum } from '../../Enums/EntryExitEnum';
import { EntranceOrExitTypeEnum } from '../../Enums/EntranceTypeEnum';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from '../../Helpers/DatePicker/DatePicker';
import TimePickerRangeModal from '../Stores/timePickerRangeModal';
import { HelperTextDto, initialHelperTextDto } from '../Admin/AddUser/Dtos/userDto';
import { initialTimeDto, TimeDto } from '../../Helpers/DataGrid/CrudTimeDto';

export default function HomeComponent() {
  type NavigationProps = DrawerNavigationProp<DrawerParamList, 'Profile', 'Home'>;
  const navigation = useNavigation<NavigationProps>();
  const loginState = useSelector((state: RootState) => state.login)
  const screenOrientation = useSelector((state: RootState) => state.screenOrientationSlice)
  const [datas, setDatas] = useState<DataGridDto<PersonnelDto>>({ ...initialDataGridDto, pagination: { ...initialDataGridDto.pagination, loginDto: loginState } })
  const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });  // Tarih Aralığı değişkeni
  const [helperTextDto, setHelperTextDto] = useState<HelperTextDto>(initialHelperTextDto)
  const [entryExitTime, setEntryExitTime] = useState<TimeDto>(initialTimeDto)  // Saat değişkeni
  const [filterStatus, setfilterStatus] = useState<Boolean>(false)  // filtrelemeden sonra GetPersonnelIO yu tekrar tetiklemek için 
  const [entryExitType, setEntryExitType] = useState<EntryExitTypeDto>(initialEntryExitTypeDto) // Giriş ve Çıkış tipi(Admin Onay,Biyometrik,Barkod) değişkeni
  const [expand, setExpand] = useState<EntryExitExpandDto>(initialEntryExitExpandDto)

  const [infoMessage, setInfoMessage] = useState<boolean>(false)
  const handleExpand = (value: EntryExitExpandDto) => {
    setExpand(prev => ({ ...prev, accordionEntryType: value.accordionEntryType, accordionExitType: value.accordionExitType }))
  }
  if (infoMessage) {
    setTimeout(() => {
      setInfoMessage(false)
    }, 15000);
  }

  useFocusEffect(
    React.useCallback(() => {
      const paginationDto: PaginationDto = { ...datas.pagination, loginDto: loginState, filterDto: !filterStatus ? null : { ...datas.pagination.filterDto, dateRangeDto: range, entryTypeEnum: entryExitType.entryTypeEnum, exitTypeEnum: entryExitType.exitTypeEnum, timeDto: entryExitTime } }
      let getPersonnels = async () => {
        let response = await GetPersonnelIO(paginationDto)
        if (response?.responseStatus === ResponseStatus.IsSuccess) {
          setDatas(response?.result)
          const filterDto = response.result.pagination.filterDto;
          if (filterDto) {
            setEntryExitType(prev => ({ ...prev, entryTypeEnum: filterDto.entryTypeEnum, exitTypeEnum: filterDto.exitTypeEnum }))
          }
        }
        else if (response?.responseStatus === ResponseStatus.IsWarning) {
          setDatas(response?.result)
          Toast.show({
            text1: "Uyarı !",
            type: 'info',
            text2: response.responseMessage
          })
        }
      }
      getPersonnels()
      return () => {
        if (filterStatus) {
          setfilterStatus(false);
          setEntryExitTime(initialTimeDto)
          setEntryExitType(initialEntryExitTypeDto)
          setHelperTextDto(initialHelperTextDto)
          setRange({ startDate: undefined, endDate: undefined })
          setDatas(prev => ({ ...prev, pagination: { ...prev.pagination, filterDto: null } }))
        }
      }
    }, [datas.pagination.page, datas.pagination.pageSize, loginState.userDto?.id, filterStatus])
  );

  const handleRemoveFilterDisabled = () => {
    if (entryExitType.entryTypeEnum === EntranceOrExitTypeEnum.Default && entryExitType.exitTypeEnum === EntranceOrExitTypeEnum.Default && entryExitTime.startDate === null && entryExitTime.endDate === null && !(range.startDate) && !(range.endDate)) {
      return true
    }
    return false
  }
  const handleFilter = async () => {
    setDatas(prev => ({
      ...prev, pagination: {
        ...prev.pagination,
        filterDto: {
          ...prev.pagination.filterDto, entryTypeEnum: entryExitType.entryTypeEnum, exitTypeEnum: entryExitType.exitTypeEnum,
          dateRangeDto: { ...prev.pagination.filterDto?.dateRangeDto, startDate: range.startDate, endDate: range.endDate },
          timeDto: { startDate: entryExitTime.startDate, endDate: entryExitTime.endDate }
        }
      }
    }))
    setfilterStatus(!filterStatus)
  }

  useEffect(() => {
    if (loginState.userDto?.id != 0 && loginState.userDto?.id != null) {
      setDatas({
        ...initialDataGridDto,
        pagination: {
          ...initialDataGridDto.pagination,
          loginDto: loginState
        }
      })
    }
  }, [loginState.userDto?.id])

  const styles = StyleSheet.create({
    dataTable: {
      backgroundColor: 'white',
      borderRadius: 10,
      ...Platform.select({
        ios: {                      // iOS için gölge
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 5,           // Android için gölge
        },
      }),
    },
  });

  const handlePagination = (value: number, pageOrPageSize: string) => {
    if (pageOrPageSize === "page") {
      setDatas(prev => ({
        ...prev,
        pagination: {
          ...prev?.pagination,
          page: value,
        }
      }))
    }
    else if (pageOrPageSize === 'pageSize') {
      setDatas(prev => ({
        ...prev,
        pagination: {
          ...prev?.pagination,
          pageSize: value
        }
      }))
    }
  }

  const handleInputOutIcon = (item: PersonnelDto, value: string) => {
    if (screenOrientation.isPortrait) {                                     // Telefon dikey ise
      if (item.entrance && value === "giriş") {
        return <IconButton iconColor='green' icon={'door-open'} />
      }
      else if (item.exit && value === 'çıkış') {
        return <IconButton iconColor='red' icon={'door-closed-lock'} />
      }
      else {
        return <Text></Text>
      }
    }
    else {                                                                // Telefon yatay ise
      if (item.entrance && value === "giriş") {
        return <Text>{InputOrOutStatus.Input}</Text>
      }
      else if (item.exit && value === "çıkış") {
        return <Text>{InputOrOutStatus.Out}</Text>
      }
      else {
        return <Text></Text>
      }
    }
  }

  const handleEntranceType = (item: PersonnelDto, value: EntryExitEnum) => {
    if (value === EntryExitEnum.Entreance) {  // Giriş sütunu 
      if (item.entrance && item.entranceTypeEnum === EntranceOrExitTypeEnum.Barcode) {
        return screenOrientation.isPortrait ? <IconButton iconColor={'green'} icon={'qrcode-scan'} /> : <Text>Barkod</Text>
      }
      if (item.entrance && item.entranceTypeEnum === EntranceOrExitTypeEnum.Biometric) {
        return screenOrientation.isPortrait ? <IconButton iconColor={"green"} icon={'fingerprint'} /> : <Text>Biyometrik</Text>
      }
      if (item.entrance && item.entranceTypeEnum === EntranceOrExitTypeEnum.AdminApprove) {
        return screenOrientation.isPortrait ? <IconButton iconColor={"green"} icon={'account-lock-open'} /> : <Text>Admin Onayı</Text>
      }
    }
    if (value === EntryExitEnum.Exit) {   // Çıkış sütunu 
      if (item.exit && item.exitTypeEnum === EntranceOrExitTypeEnum.Barcode) {
        return screenOrientation.isPortrait ? <IconButton iconColor={"red"} icon={'qrcode-scan'} /> : <Text>Barkod</Text>
      }
      if (item.exit && item.exitTypeEnum === EntranceOrExitTypeEnum.Biometric) {
        return screenOrientation.isPortrait ? <IconButton iconColor={"red"} icon={'fingerprint'} /> : <Text>Biyometrik</Text>
      }
      if (item.exit && item.exitTypeEnum === EntranceOrExitTypeEnum.AdminApprove) {
        return screenOrientation.isPortrait ? <IconButton iconColor={"red"} icon={'account-lock-outline'} /> : <Text>Admin Onayı</Text>
      }
    }
  }

  return (
    <View style={{ margin: 10 }}>
      <ScrollView >
        <List.Section title="Giriş Çıkış Bilgilerini Filtreleme Alanı"
          titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
          style={{ borderRadius: 30, backgroundColor: "#B1CDD1" }}
        >
          <LinearGradient colors={['white', '#B3CDD8', 'white', '#B3CDD8']} >
            <List.Accordion
              expanded={expand.accordionEntryType}
              style={{ backgroundColor: '#ACC8E5' }}
              title={entryExitType.entryTypeEnum === EntranceOrExitTypeEnum.AdminApprove ? "Admin Onay" : entryExitType.entryTypeEnum === EntranceOrExitTypeEnum.Barcode ? "Barkod" : entryExitType.entryTypeEnum === EntranceOrExitTypeEnum.Biometric ? "Biyometrik" : "Giriş Tipini Seçin . . ."}
              onPress={() => { handleExpand({ ...expand, accordionEntryType: !expand.accordionEntryType }) }}  // Giriş Accordion
              left={props => <List.Icon {...props} color={"green"} icon="card-account-details" />}>
              <List.Item title="Admin Onayı" left={(props) => <List.Icon {...props} icon="account-key-outline" />}
                style={[{ borderRadius: 30, marginTop: 5 }, entryExitType.entryTypeEnum === EntranceOrExitTypeEnum.AdminApprove ? { backgroundColor: '#73D897' } : ""]}
                onPress={() => {
                  setEntryExitType({ ...entryExitType, entryTypeEnum: EntranceOrExitTypeEnum.AdminApprove })
                  handleExpand({ ...expand, accordionEntryType: false })                     // Giriş 
                }}
              />
              <List.Item title="Biyometrik" left={(props) => <List.Icon {...props} icon="fingerprint" />}
                onPress={() => {
                  setEntryExitType({ ...entryExitType, entryTypeEnum: EntranceOrExitTypeEnum.Biometric })
                  handleExpand({ ...expand, accordionEntryType: false })                     // Giriş 
                }}
                style={[{ borderRadius: 30 }, entryExitType.entryTypeEnum === EntranceOrExitTypeEnum.Biometric ? { backgroundColor: '#73D897' } : ""]}
              />
              <List.Item title="Barkod" left={(props) => <List.Icon {...props} icon="qrcode-scan" />}
                onPress={() => {
                  setEntryExitType({ ...entryExitType, entryTypeEnum: EntranceOrExitTypeEnum.Barcode })
                  handleExpand({ ...expand, accordionEntryType: false })                     // Giriş 
                }}
                style={[{ borderRadius: 30 }, entryExitType.entryTypeEnum === EntranceOrExitTypeEnum.Barcode ? { backgroundColor: '#73D897' } : ""]}
              />
            </List.Accordion>

            <List.Accordion
              expanded={expand.accordionExitType}
              style={{ backgroundColor: '#ACC8E5', marginTop: 5 }}
              title={entryExitType.exitTypeEnum === EntranceOrExitTypeEnum.AdminApprove ? "Admin Onay" : entryExitType.exitTypeEnum === EntranceOrExitTypeEnum.Barcode ? "Barkod" : entryExitType.exitTypeEnum === EntranceOrExitTypeEnum.Biometric ? "Biyometrik" : "Çıkış Tipini Seçin . . ."}
              onPress={() => { handleExpand({ ...expand, accordionExitType: !expand.accordionExitType }) }}   // Çıkış Accordion
              left={props => <List.Icon {...props} color={"red"} icon="card-account-details" />}>
              <List.Item title="Admin Onayı" left={(props) => <List.Icon {...props} icon="account-key-outline" />}
                style={[{ borderRadius: 30, marginTop: 5 }, entryExitType.exitTypeEnum === EntranceOrExitTypeEnum.AdminApprove ? { backgroundColor: '#73D897' } : ""]}
                onPress={() => {
                  setEntryExitType({ ...entryExitType, exitTypeEnum: EntranceOrExitTypeEnum.AdminApprove })
                  handleExpand({ ...expand, accordionExitType: false })                        // Çıkış
                }}
              />
              <List.Item title="Biyometrik" left={(props) => <List.Icon {...props} icon="fingerprint" />}
                style={[{ borderRadius: 30 }, entryExitType.exitTypeEnum === EntranceOrExitTypeEnum.Biometric ? { backgroundColor: '#73D897' } : ""]}
                onPress={() => {
                  setEntryExitType({ ...entryExitType, exitTypeEnum: EntranceOrExitTypeEnum.Biometric })
                  handleExpand({ ...expand, accordionExitType: false })                        // Çıkış
                }}
              />
              <List.Item title="Barkod" left={(props) => <List.Icon {...props} icon="qrcode-scan" />}
                style={[{ borderRadius: 30 }, entryExitType.exitTypeEnum === EntranceOrExitTypeEnum.Barcode ? { backgroundColor: '#73D897' } : ""]}
                onPress={() => {
                  setEntryExitType({ ...entryExitType, exitTypeEnum: EntranceOrExitTypeEnum.Barcode })
                  handleExpand({ ...expand, accordionExitType: false })                        // Çıkış
                }}
              />
            </List.Accordion>

            <View style={{ backgroundColor: '#ACC8E5', marginVertical: 5 }}>
              <DatePicker range={range} setRange={setRange} />
              <TimePickerRangeModal helperTextTimeDto={helperTextDto} setHelperTextTimeDto={setHelperTextDto} reset setStoreTime={setEntryExitTime} storeTime={entryExitTime} />
              <IconButton
                icon="information-outline"
                selected
                // iconColor={!isActive ? 'red' : 'green'}
                style={{ margin: 0, padding: 0 }}
                size={24}
                onPress={() => {
                  setInfoMessage(true)
                }}
              />
              {infoMessage && <Text style={{ backgroundColor: '#FFB800', marginTop: 5, borderRadius: 10, margin: 5, padding: 10 }} >{"Sadece başlangıç saatini veya bitiş saatini seçerseniz seçtğiniz saate ait olan veriler gösterilir ama ikisini seçerseniz o aralıkta yer alan verileri getirir "}</Text>}
            </View>

            <View style={{ alignItems: 'center', marginVertical: 5, flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <Button style={{ width: 'auto' }} icon="filter-plus" mode="contained" onPress={() => handleFilter()}>
                Filtrele
              </Button>
              <Button style={[{ width: 'auto' }, !handleRemoveFilterDisabled() ? { backgroundColor: "#FFB800" } : {}]} icon="filter-remove" mode="contained"
                disabled={handleRemoveFilterDisabled()}
                onPress={() => {
                  setEntryExitType({ entryTypeEnum: EntranceOrExitTypeEnum.Default, exitTypeEnum: EntranceOrExitTypeEnum.Default })
                  setRange({ startDate: undefined, endDate: undefined })
                  setEntryExitTime(initialTimeDto)
                  setfilterStatus(false)
                }}>
                Filtreleri Kaldır
              </Button>
            </View>

          </LinearGradient>

        </List.Section>
        {<DataTable style={styles.dataTable} >
          <DataTable.Header style={{ backgroundColor: '#a9d6e5' }}>
            {/* <DataTable.Title style={{ flex: 1 }}><Text style={{color:'black'}}>Id</Text></DataTable.Title> */}
            <DataTable.Title style={{ flex: 1 }}><Text numberOfLines={1} ellipsizeMode='tail' style={{ color: 'black' }}>Giriş Durumu</Text></DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}><Text numberOfLines={1} ellipsizeMode='tail' style={{ color: 'black' }}>Giriş Tipi</Text></DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}><Text style={{ color: 'black' }}>Giriş Tarihi</Text></DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}><Text style={{ color: 'black' }}>Çıkış Durumu</Text></DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}><Text style={{ color: 'black' }}>Çıkış Tipi</Text></DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}><Text style={{ color: 'black' }}>Çıkış Tarihi</Text></DataTable.Title>
          </DataTable.Header>
          {datas?.inputs?.map((item, index) => (
            <DataTable.Row key={index}>
              {/* {!screenOrientation.isPortrait ? <DataTable.Cell style={{ flex: 1 }}><Text>{item.id}</Text></DataTable.Cell> : <></>} */}
              <DataTable.Cell style={{ flex: 1 }}>{handleInputOutIcon(item, 'giriş')}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}>{handleEntranceType(item, EntryExitEnum.Entreance)}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}><Text>{item.dateRangeDto.startDate ? moment(item.dateRangeDto.startDate).format('DD.MM.YYYY HH:mm') : ""}</Text></DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}>{handleInputOutIcon(item, 'çıkış')}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}>{handleEntranceType(item, EntryExitEnum.Exit)}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}><Text>{item.dateRangeDto.endDate ? moment(item.dateRangeDto.endDate).format('DD.MM.YYYY HH:mm') : ""}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}
          <DataTable.Pagination
            page={datas.pagination.page}                                                    // sayfayı gösteriyor(0 dan başlıyor)
            numberOfPages={Math.ceil(datas.pagination.total / datas.pagination.pageSize)}   // sayfa Numarası
            onPageChange={(page) => handlePagination(page, 'page')}                         // sayfalama işlemi metodu
            label={`${datas.pagination.from}-${datas.pagination.to} of ${datas.pagination.total}`}                        // 3 - 4 of 4 ( 3. veri dahil ile 4. veri dahil arasındaki verileri gösteriyor ) Toplam veri sayısı
            numberOfItemsPerPageList={[1, 2, 4, 6, 8, 10, 50]}                              // sayfada kaç veri göstereceksin
            numberOfItemsPerPage={datas.pagination.pageSize}                                // sayfada gösterilecek olan veri sayısı
            onItemsPerPageChange={(pageSize) => { handlePagination(pageSize, 'pageSize') }} // sayfada kaç veri göstereceksin
            showFastPaginationControls                                                      // En başa( |< ) ve en sona( >| ) götüren ifadeler
            selectPageDropdownLabel={'Satır sayısı seç'}
            theme={theme}
          />
        </DataTable>}
      </ScrollView>
    </View>

  )
}

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#843DFD', // Burada primary rengini değiştirerek etki edebilirsin
    text: 'black',   // Metin rengini değiştirmek için
  },
};
