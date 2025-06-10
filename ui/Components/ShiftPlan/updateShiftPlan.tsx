import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import { Avatar, Card, Divider, IconButton, List, Searchbar, Text } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import { GetShiftPlans } from './Requests/store';
import { TableBodyDto } from './Dtos/shipPlanDto';
import UpdateShiftPlanModal from './updateShiftPlanModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import Toast from 'react-native-toast-message';
import Animated, { Easing, FlipInEasyX, ReduceMotion, withTiming } from 'react-native-reanimated';

export default function UpdateShiftPlan() {
  const [searchShipPlans, setSearchShipPlans] = useState<TableBodyDto[]>([])
  const [searchUValue, setSearchValue] = useState("");
  const loginState = useSelector((state: RootState) => state.login)
  const [shiftPlans, setShiftPlans] = useState<TableBodyDto[]>([])
  

  useFocusEffect(
    React.useCallback(() => {
      let getPersonnels = async () => {
        let response = await GetShiftPlans()
        if (response?.responseStatus === ResponseStatus.IsSuccess) {
          setShiftPlans(response.results)
        }
        else if (response?.responseStatus === ResponseStatus.IsWarning) {
          Toast.show({
            text1: "Uyarı !",
            type: 'info',
            text2: response.responseMessage
          })
        }
      }
      getPersonnels()
    }, [loginState.userDto.id])
  );


  const handleSearch = async () => {
    let searchValues = shiftPlans.filter(x => x.firstName && x.firstName.toLowerCase().trim().includes(searchUValue.toLowerCase().trim()) ||  x.lastName &&  x.lastName.toLowerCase().trim().includes(searchUValue.toLowerCase().trim()))
    setSearchShipPlans(searchValues)
  }
  const handleClear = async () => { setSearchShipPlans(shiftPlans) }
  const UpdateUserLeftContent = (props: any) => <Avatar.Icon {...props} color='#5a189a' icon="account" />
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {
        shiftPlans.length > 0 ?
          <Card elevation={5} style={{ flex: 1, marginTop: 10, margin: 10, backgroundColor: '#343a40' }}>
            <Card.Title subtitleStyle={{ opacity: 0.5, color: 'white' }} titleStyle={{ fontWeight: 'bold', color: 'white' }} title="VARDİYA GÜNCELLE" subtitle="Güncelleyeceğin vardiyayı seç" left={UpdateUserLeftContent} />
            <Divider />
            <FlatList
              ListHeaderComponent={
                <Searchbar
                  placeholder="Vardiya Ara..."
                  placeholderTextColor={"white"}
                  onChangeText={setSearchValue}
                  value={searchUValue}
                  onIconPress={async () => { await handleSearch() }}
                  onClearIconPress={async () => { await handleClear() }}
                  style={{ margin: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#ACC8E5', backgroundColor: '#6c757d' }}
                  showDivider
                />
              }
              data={shiftPlans}
              style={{ width: '100%' }}
              renderItem={({ item, index }) => <ShiftPlanItem key={index} shiftPlanItem={item} />}
              keyExtractor={item => item.id.toString()}
            />
          </Card> :
          <Text>Gösterilecek Veri Yok</Text>
      }
    </View>
  );
}

type ShiftPlantemProps = { shiftPlanItem: TableBodyDto, };

const ShiftPlanItem: React.FC<ShiftPlantemProps> = React.memo(({ shiftPlanItem }) => {                // Kişi listesi
  const [visible, setVisible] = useState<boolean>(false)
  const handleOpenModal = () => setVisible(true)
  const handleCloseModal = () => setVisible(false)

  return <>
    <Animated.View style={{ minWidth: '100%', justifyContent: 'center', height: 45 }}
    entering={FlipInEasyX.delay(100*(shiftPlanItem.id))}
    >
      <List.Item
        title={`${shiftPlanItem.id} ${shiftPlanItem.shiftPlanName}`}
        key={shiftPlanItem.id}
        titleStyle={{ justifyContent: 'center', color: 'white' }}
        style={{ flex: 1, justifyContent: 'center' }} // Yüksekliği azaltmak için
        right={() => (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton
              icon="card-plus"
              selected
              iconColor={"#fb8500"}
              size={24}
              onPress={() => {
                handleOpenModal()
              }} />
          </View>
        )}
      />
      <Divider style={{ backgroundColor: '#34a0a4' }} />
      {visible && <UpdateShiftPlanModal shiftPlanItem={shiftPlanItem} visible={visible} handleCloseModal={handleCloseModal} />}
    </Animated.View>
  </>
});
