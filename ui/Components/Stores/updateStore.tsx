import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Modal, View } from 'react-native'
import { Card, IconButton, List, Searchbar, Button, TextInput, HelperText, Avatar, Text, Tooltip, Switch, Chip } from 'react-native-paper'
import { HelperTextStoreDto, initialStoreDto, StoreDto, StoreLocationDto } from './Dtos/storeDto';
import { GetStores, UpdateStore } from './Requests/storeRequest';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import Toast from 'react-native-toast-message';
import TimePickerRangeModal from './timePickerRangeModal'
import { StoreMapView } from './storeMapView';
import { CrudEnum } from '../../Enums/ComponentEnum';
import { HelperTextTimeDto, initialHelperTextTimeDto, initialTimeDto, TimeDto } from '../../Helpers/DataGrid/CrudTimeDto';

export default function UpdateStoreComponent() {
  const [stores, setStores] = useState<StoreDto[]>([])
  const [search, setSearch] = React.useState('');
  const [visible, setVisible] = useState<"map" | "time" | "default">("default")
  const [selectedValue, setSelectedValue] = useState<StoreDto>(initialStoreDto)
  const [crudStatus, setCrudStatus] = useState<"update" | "delete" | "default">("default")
  const [searchStores, setSearchStores] = useState<StoreDto[]>([])

  useEffect(() => {
    let getStoreAsync = async () => {
      let response = await GetStores();
      if (response?.responseStatus === ResponseStatus.IsSuccess) {
        setStores(response?.results)
        setSearchStores(response.results)
      }
    }
    crudStatus === "default" && getStoreAsync()
    return () => {
      setCrudStatus("default")
    }
  }, [crudStatus])

  const handleSearch = () => {
    let filterStore = stores.filter(store => store.storeName.toLowerCase().trim().includes(search.toLowerCase().trim()))
    setSearchStores(filterStore)
  }

  const handleSearchClear = () => { setSearchStores(stores) }

  const handleVisible = useCallback(
    (value: 'map' | 'time' | 'default') => {
      setVisible(value)
    },
    [setVisible],
  )

  type ItemProps = { storeItemDto: StoreDto, index: number };
  const StoreItem: React.FC<ItemProps> = ({ storeItemDto, index }) => (
    <List.Item
      title={storeItemDto.storeName}
      key={storeItemDto.id}
      titleStyle={{ paddingBottom: 2, color: 'black' }}
      style={{ paddingVertical: 0, paddingRight: 0, justifyContent: 'center', alignItems: 'flex-start' }} // Yüksekliği azaltmak için
      contentStyle={{ alignItems: 'flex-start', justifyContent: 'center' }}
      right={() => (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <IconButton                                                   // Harita Güncelleme 
            icon="map-marker-radius"
            selected
            size={24}
            style={{ margin: 0 }}
            onPress={() => {
              setSelectedValue(storeItemDto)
              handleVisible('map')
            }} />
          <IconButton                                                  // Kurum(Mağaza) adı ve saati Güncelleme alanı 
            icon="store-edit"
            selected
            iconColor={"#B772E6"}
            style={{ margin: 0 }}
            size={24}
            onPress={() => {
              setSelectedValue(storeItemDto)
              handleVisible('time')
            }} />
          <Tooltip
            titleMaxFontSizeMultiplier={5}
            enterTouchDelay={10}
            leaveTouchDelay={2000}
            title={storeItemDto.isActive ?
              "Mağaza aktif olarak kullanılıyor" :
              "Mağaza aktif olarak kullanılmıyor"}
          >
            <IconButton
              icon="information-outline"
              selected
              style={{ margin: 0 }}
              iconColor={storeItemDto.isActive ? 'green' : 'red'}
              size={24}
              onPress={() => {
              }} />
          </Tooltip>
        </View>
      )}
      left={() => <Text style={{ marginTop: 8, fontWeight: 'bold', color: 'black' }} variant="titleMedium">{index + 1 + ")"}</Text>}
    />
  );
  return (
    <Card style={{ flex: 1, backgroundColor: '#E7C5BC', elevation: 24, margin: 10, marginTop: 0 }}>
      <Card.Title subtitleStyle={{ color: 'gray' }} titleStyle={{ fontWeight: 'bold', color: 'black' }} title="KURUM GÜNCELLEME ALANI" subtitle="Güncellenmesini istediğiniz kurumu seçin" />
      <FlatList
        data={searchStores}
        style={{ paddingVertical: 2, backgroundColor: '#C5D6E9', padding: 10 }}
        renderItem={({ item, index }) => <StoreItem storeItemDto={item} index={index} key={index} />}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <Searchbar
            placeholder="Kurum adı ara . . ."
            onChangeText={setSearch}
            value={search}
            style={{ marginVertical: 20 }}
            onIconPress={handleSearch}
            onClearIconPress={handleSearchClear}
          />
        }
      />
      <Card.Actions style={{ padding: 0 }}>
        {visible === "map" && <StoreMapView data={selectedValue} setVisible={setVisible} visible={visible} proccess={CrudEnum.UpdateStore} setCrudStatus={setCrudStatus} key={selectedValue.id} setFormHelperText={undefined} />}
        {visible === "time" && <EditStoreTimeAndName visible={visible} setVisible={setVisible} selectedValue={selectedValue} setStores={setStores} setCrudStatus={setCrudStatus} />}
      </Card.Actions>
    </Card>
  )
}

type EditStoreTimeAndNameProps = {
  visible: "map" | "time" | "default",
  setVisible: React.Dispatch<React.SetStateAction<"map" | "time" | "default">>,
  setStores: React.Dispatch<React.SetStateAction<StoreDto[]>>,
  selectedValue: StoreDto,
  setCrudStatus: React.Dispatch<React.SetStateAction<"default" | "update" | "delete">>
}

const EditStoreTimeAndName = (props: EditStoreTimeAndNameProps) => {
  const { selectedValue, setStores, setVisible, visible, setCrudStatus } = props
  const [storeName, setStoreName] = useState<string>(selectedValue.storeName)
  const [storeTime, setStoreTime] = useState<TimeDto>(selectedValue.storeTime)
  const [reset, setReset] = useState<boolean>(false)
  const [storeLocation, setStoreLocation] = useState<StoreLocationDto>(selectedValue.storeLocation)
  const [formHelperText, setFormHelperText] = useState<HelperTextStoreDto>({ storeName: false, latitude: false, longitude: false })
  const [helperTextTimeDto, setHelperTextTimeDto] = useState<HelperTextTimeDto>(initialHelperTextTimeDto)
  const [isActive, setIsActive] = React.useState(false);
  const [infoMessage, setInfoMessage] = useState<boolean>(false)

  const onToggleSwitch = () => {
    setIsActive(!isActive);
  };

  if (infoMessage) {
    setTimeout(() => {
      setInfoMessage(false)
    }, 3000);
  }

  useEffect(() => {
    setStoreLocation(selectedValue.storeLocation)
    setStoreName(selectedValue.storeName)
    setStoreTime(selectedValue.storeTime)
    setIsActive(selectedValue.isActive)
  }, [selectedValue])

  const handleVisible = useCallback(
    () => {
      setVisible("default")
      setStoreLocation(selectedValue.storeLocation)
      setStoreName(selectedValue.storeName)
      setStoreTime(selectedValue.storeTime)
    },
    [setVisible],
  )

  const handleUpdate = async () => {
    if (!(storeName)) {
      setFormHelperText(prev => ({ ...prev, storeName: true }))
    }
    else if (!(storeTime.startDate)) {
      setFormHelperText(prev => ({ ...prev, startDate: true }))
    }
    else if (!(storeTime.endDate)) {
      setFormHelperText(prev => ({ ...prev, endDate: true }))
    }
    else {
      const updateDto: StoreDto = { ...selectedValue, storeName: storeName, storeTime: storeTime, storeLocation: storeLocation, isActive: isActive }
      const response = await UpdateStore(updateDto)
      if (response?.responseStatus === ResponseStatus.IsSuccess) {
        setStores(prev => prev.map(x => x.id === selectedValue.id ? { ...x, storeName: storeName, storeTime: storeTime } : x))
        setVisible("default")
        Toast.show({ text1: response.responseMessage, type: 'success' })
        setReset(false)
      }
      else {
        Toast.show({ text1: response?.responseMessage, type: 'error' })
      }
      setCrudStatus('update')
    }
  }

  const saveDisabledStatus = () => {
    if (storeName === selectedValue.storeName && storeTime.startDate === selectedValue.storeTime.startDate && storeTime.endDate === selectedValue.storeTime.endDate && selectedValue.isActive === isActive) {
      return true
    }
    else if (storeName === "" || storeTime.startDate === null || storeTime.endDate === null) {
      return true
    }
    else {
      return false
    }
  }

  const handleReset = () => {
    setStoreName("")
    setStoreTime(initialTimeDto)
    setReset(true)
    setIsActive(selectedValue.isActive)
    setFormHelperText(prev => ({
      ...prev,
      endDate: false,
      startDate: false,
      storeName: false
    }))
  }

  const handleStoreNameChange1 = useCallback((text: string) => {
    if (text) {
      setFormHelperText(prev => ({ ...prev, storeName: false }))
    }
    else {
      setFormHelperText(prev => ({ ...prev, storeName: true }))
    }
    setStoreName(text)
  }, [setStoreName, setFormHelperText]);

  const LeftContent = (props: any) => <Avatar.Icon size={55} icon="store-marker" />

  return <Modal
    animationType="slide"
    transparent={true}
    visible={visible === "time"}
    onRequestClose={handleVisible}
  >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Card elevation={5} style={{ justifyContent: 'center', margin: 10, height: 400, width: '95%' }} >
        <Card.Title titleStyle={{ marginLeft: 20, fontWeight: 'bold' }} style={{ marginBottom: 20, overflow: 'visible' }} subtitleStyle={{ marginLeft: 20, opacity: 0.5, flexWrap: 'wrap', overflow: 'visible' }} title="Güncelleme Alanı" subtitle="Kurum adını ve Çalışma saatini Güncelle" left={LeftContent} right={() => (
          <IconButton
            icon="close"
            selected
            iconColor={'red'}
            size={24}
            onPress={() => {
              setVisible("default")
              setStoreName(selectedValue.storeName)
              setStoreTime(selectedValue.storeTime)
              setStoreLocation(selectedValue.storeLocation)
              setFormHelperText({
                // endDate: false,
                latitude: false,
                longitude: false,
                // startDate: false,
                storeName: false
              })
              setReset(false)
            }} />
        )} />
        <Card.Content>
          <TextInput
            label="Kurum Adı"
            value={storeName}
            onBlur={() => { storeName && setFormHelperText({ ...formHelperText, storeName: storeName === "" ? true : false }) }}
            onChangeText={handleStoreNameChange1}
          />
          {formHelperText.storeName && <HelperText type="error" visible={formHelperText.storeName}>Lütfen Kurumu Seçin</HelperText>}
          {<TimePickerRangeModal setStoreTime={setStoreTime} storeTime={storeTime} reset={reset} helperTextTimeDto={helperTextTimeDto} setHelperTextTimeDto={setHelperTextTimeDto} />}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 0, marginVertical: 0 }}>
            <Switch value={isActive} trackColor={{ true: "#79AB54", false: "#D5819A" }} thumbColor={isActive ? "green" : "red"} color={isActive ? "green" : "red"} onValueChange={onToggleSwitch} />
            <Text style={[{ fontWeight: 'bold', fontSize: 18 }, isActive ? { color: 'green' } : { color: 'red' }]}>{isActive ? "Aktif" : "Pasif"}</Text>
            <IconButton
              icon="information-outline"
              selected
              iconColor={!isActive ? 'red' : 'green'}
              style={{ margin: 0, padding: 0 }}
              size={24}
              onPress={() => {
                setInfoMessage(true)
              }}
            />
          </View>
          {infoMessage && <Chip style={{ backgroundColor: '#ACC8E5', marginTop: 15 }} icon="information" >{isActive ? "Kurumun Çalışma Durumu aktif" : "Kurumun Çalışma Durumu pasif"}</Chip>}
        </Card.Content>
        <Card.Actions>
          <Button disabled={saveDisabledStatus()} onPress={handleReset}>Sıfırla</Button>
          <Button buttonColor='green' onPress={handleUpdate} disabled={saveDisabledStatus()}>Kaydet</Button>
        </Card.Actions>
      </Card>
    </View>
  </Modal>
}



