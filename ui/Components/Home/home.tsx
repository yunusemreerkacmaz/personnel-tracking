import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Platform, StyleSheet, Dimensions, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../Navigator/navigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { DataTable, DefaultTheme, IconButton } from 'react-native-paper';
import { GetPersonnelIO } from './Requests/personnelStore';
import { PersonnelDto } from './Dtos/PersonnelDto';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { InputOrOutStatus } from '../../Enums/barcodeStatusEnum';
import { DataGridDto, initialDataGridDto } from '../../Helpers/DataGrid/DataGridDto';

export default function HomeComponent() {
  type NavigationProps = DrawerNavigationProp<DrawerParamList, 'Profile', 'Home'>;
  const navigation = useNavigation<NavigationProps>();
  const loginState = useSelector((state: RootState) => state.login)
  const [datas, setDatas] = useState<DataGridDto<PersonnelDto>>({
    ...initialDataGridDto,
    pagination: { ...initialDataGridDto.pagination, loginDto: loginState }
  })

      const screenOrientation = useSelector((state: RootState) => state.screenOrientationSlice)
  


  useFocusEffect(
    React.useCallback(() => {
      datas.pagination.loginDto = loginState
      GetPersonnelIO(datas.pagination).then(response => {
        if (response?.responseStatus === ResponseStatus.IsSuccess) {
          setDatas(response?.result)
        }
        else if (response?.responseStatus === ResponseStatus.IsWarning) {
          Toast.show({
            text1: "Uyarı !",
            type: 'info',
            text2: response.responseMessage
          })
        }
      })
    }, [datas.pagination.page, datas.pagination.pageSize, loginState.userDto?.id])
  );

  useEffect(() => {
    if (loginState.userDto?.id != 0 && loginState.userDto?.id != null) {
      setDatas(initialDataGridDto)
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


  return (
    <View style={{ margin: 10 }}>
      <ScrollView >
        {datas.inputs && <DataTable style={styles.dataTable} >
          <DataTable.Header style={{ backgroundColor: '#a9d6e5' }}>
            {/* <DataTable.Title style={{ flex: 1 }}><Text style={{color:'black'}}>Id</Text></DataTable.Title> */}
            <DataTable.Title style={{ flex: 1 }} ><Text numberOfLines={1} ellipsizeMode='tail' style={{ color: 'black' }}>Giriş Durumu</Text></DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}><Text style={{ color: 'black' }}>Giriş Tarihi</Text></DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}><Text style={{ color: 'black' }}>Çıkış Durumu</Text></DataTable.Title>
            <DataTable.Title style={{ flex: 1 }}><Text style={{ color: 'black' }}>Çıkış Tarihi</Text></DataTable.Title>
          </DataTable.Header>
          {datas?.inputs?.map((item, index) => (
            <DataTable.Row key={index}>
              {/* <DataTable.Cell style={{ flex: 1 }}><Text>{item.id}</Text></DataTable.Cell> */}
              <DataTable.Cell style={{ flex: 1 }}>{handleInputOutIcon(item, 'giriş')}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}><Text>{item.dateRangeDto.startDate ? moment(item.dateRangeDto.startDate).format('DD.MM.YYYY HH:mm') : ""}</Text></DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}>{handleInputOutIcon(item, 'çıkış')}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 1 }}><Text>{item.dateRangeDto.endDate ? moment(item.dateRangeDto.endDate).format('DD.MM.YYYY HH:mm') : ""}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}
          <DataTable.Pagination
            page={datas.pagination.page}                                                    // sayfayı gösteriyor(0 dan başlıyor)
            numberOfPages={Math.ceil(datas.pagination.total / datas.pagination.pageSize)}   // sayfa Numarası
            onPageChange={(page) => handlePagination(page, 'page')}                         // sayfalama işlemi metodu
            label={`${datas.pagination.from}-${datas.pagination.to} of ${datas.pagination.total}`}                        // 3 - 4 of 4 ( 3. veri dahil ile 4. veri dahil arasındaki verileri gösteriyor ) Toplam veri sayısı
            numberOfItemsPerPageList={[1, 2, 4, 6, 8, 10, 15]}                              // sayfada kaç veri göstereceksin
            numberOfItemsPerPage={datas.pagination.pageSize}                                // sayfada gösterilecek olan veri sayısı
            onItemsPerPageChange={(pageSize) => { handlePagination(pageSize, 'pageSize') }} // sayfada kaç veri göstereceksin
            showFastPaginationControls                                                      // En başa( |< ) ve en sona( >| ) götüren ifadeler
            selectPageDropdownLabel={'Satır sayısı seç'}
            theme={theme}

          />
        </DataTable>}
        <Button style={{ marginTop: 50 }} onPress={() => navigation.navigate('Profile')}>
          Profil sayfasına Git
        </Button>
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
