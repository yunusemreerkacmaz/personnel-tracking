import React, { LegacyRef, useCallback, useEffect, useRef, useState } from 'react';
import MapView, { Callout, CalloutSubview, Circle, MapCallout, MapMarker, Marker, MarkerAnimated, Polygon, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Region, UrlTile } from 'react-native-maps';
import { Modal, ScrollView, StyleSheet, View, Text, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { initialStoreLocationDto, StoreDto, StoreLocationDto } from './Dtos/storeDto';
import { Badge, Button, IconButton, PaperProvider, Portal, Provider, Searchbar, Tooltip } from 'react-native-paper';
import Toast, { BaseToast } from 'react-native-toast-message';
import axios from 'axios';
import { CrudEnum } from '../../Enums/ComponentEnum';
import { UpdateStore } from './Requests/storeRequest';
import { ResponseStatus } from '../../ServiceResults/serviceResult';
import Slider from '@react-native-community/slider';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export interface IProps {
  setVisible: React.Dispatch<React.SetStateAction<"map" | "time" | "default">>
  visible: "map" | "time" | "default"
  data: StoreDto
  proccess: CrudEnum
  setCrudStatus?: React.Dispatch<React.SetStateAction<"default" | "update" | "delete">>
  setFormHelperText?: React.Dispatch<React.SetStateAction<{
    storeName: boolean;
    startDate: boolean;
    endDate: boolean;
    latitude: boolean;
    longitude: boolean;
  }>>
  setData?: React.Dispatch<React.SetStateAction<StoreDto>>
}

export const StoreMapView = (props: IProps) => {
  const { visible, setVisible, data, proccess, setCrudStatus, setFormHelperText, setData } = props;
  const { storeLocation, radius } = data
  const [region, setRegion] = useState<StoreLocationDto>(storeLocation)
  const [zoom, setZoom] = useState<StoreLocationDto>(storeLocation)
  const [circleDimension, setCircleDimension] = useState<number>(radius ?? 0)
  const [changeMapType, setChangeMapType] = useState<number>(1)
  const mapRef = useRef<MapView | null>(null)
  // const markerRef = useRef<MapMarker | null>(null)
  const [visibleCallout, setvisibleCallout] = useState<boolean>(false)

  // const handleMapPress = (event: any) => {                            // Tıklandığında Konum ayarlama
  //   const { latitude, longitude } = event.nativeEvent.coordinate;
  //   setRegion(prev => ({
  //     ...prev,
  //     latitude: latitude,
  //     longitude: longitude,
  //   }))
  //   setshow(true)
  // }

  const handleRegionChangeComplete = (newRegion: Region) => {         // Zooom ayarlama 
    const { latitudeDelta, longitudeDelta } = newRegion
    setZoom(prev => ({ ...prev, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta }))
  }

  // const handleRemoveMarkerPress = () => {                                // Marker kaldırma fonksiyonu
  //   setshow(true)                                                       // burayı false yaparsan ekrandan yer imini kaldırır
  //   setRegion(prev => ({ ...prev, latitudeDelta: zoom.latitudeDelta, longitudeDelta: zoom.longitudeDelta }))
  // };

  const waitTwoSeconds = () => {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    map: {
      flex: 1,
      width: '95%',
      height: 'auto',
      maxHeight: '90%',
      minHeight: 130,
      borderRadius: 30,
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={visible === "map"}
          onRequestClose={() => {
            setVisible("default")
            setRegion(prev => ({ ...prev, latitudeDelta: zoom.latitudeDelta, longitudeDelta: zoom.longitudeDelta }))
          }}>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', height: 'auto', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#EEEBB1', borderRadius: 30, alignItems: 'center', justifyContent: 'flex-start' }}>
                <Slider
                  style={{ width: 170, backgroundColor: '#E6E7BF', borderRadius: 30 }}
                  minimumValue={0}
                  value={circleDimension}
                  maximumValue={200}
                  minimumTrackTintColor="#B5E994"
                  maximumTrackTintColor="#000000"
                  step={1}
                  onSlidingComplete={value => setCircleDimension(value)}
                  lowerLimit={1}
                  upperLimit={1000}
                />
                <Badge size={30}>{circleDimension}</Badge>
              </View>

              <Tooltip title="Mağaza konumuna git" titleMaxFontSizeMultiplier={10}
              >
                <IconButton
                  icon="store-marker"
                  selected
                  iconColor={'#B5E994'}
                  size={30}
                  onPress={() => {
                    mapRef.current?.animateToRegion(region)
                  }} />
              </Tooltip>

              <IconButton
                icon="mapbox"
                selected
                iconColor={'#741D9D'}
                size={30}
                onPress={() => {
                  setChangeMapType(x => x + 1)
                  if (changeMapType == 3) {
                    setChangeMapType(1)
                  }
                }} />

              <IconButton
                icon="close"
                selected
                iconColor={'red'}
                size={30}
                onPress={() => {
                  setVisible("default")
                  setRegion(prev => ({ ...prev, latitude: region.latitude, longitude: region.longitude, latitudeDelta: zoom.latitudeDelta, longitudeDelta: zoom.longitudeDelta }))
                  setFormHelperText && setFormHelperText(prev => ({ ...prev, latitude: data.storeLocation.latitude != initialStoreLocationDto.latitude ? false : true, longitude: data.storeLocation.longitude != initialStoreLocationDto.longitude ? false : true }))
                }} />

            </View>
            <SearchComponent setRegion={setRegion} zoom={zoom} />
            <MapView
              style={styles.map}
              ref={mapRef}
              showsMyLocationButton
              showsUserLocation
              showsBuildings
              showsIndoors
              showsTraffic
              showsScale
              showsCompass
              // provider={PROVIDER_DEFAULT}                                // Varsayılan haritayı gjöster ayrıca burda  provider_google da yapabilirsin ama api key lazım
              provider={PROVIDER_GOOGLE}
              mapType={changeMapType === 1 ? "standard" : changeMapType === 2 ? "hybrid" : changeMapType === 3 ? "satellite" : "terrain"}
              // onPress={handleMapPress}
              region={{
                latitude: region.latitude,
                latitudeDelta: region.latitudeDelta,
                longitude: region.longitude,
                longitudeDelta: region.longitudeDelta
              }}
              onRegionChangeComplete={handleRegionChangeComplete}       // yeni region'ın delta değerleri 
            >
              <Marker
                draggable
                title={data.storeName}
                subtitleVisibility='visible'
                titleVisibility='visible'
                description={`${data.storeTime.startDate} - ${data.storeTime.endDate}`}
                key={data.id}
                onPress={async () => {
                  setvisibleCallout(true)
                  // await waitTwoSeconds()  // 2 saniye beklet
                  // setvisibleCallout(false)
                }}
                coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                // onPress={handleRemoveMarkerPress}
                onDragEnd={(e) => {
                  setRegion({
                    ...region, latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude,
                    latitudeDelta: zoom.latitudeDelta, longitudeDelta: zoom.longitudeDelta
                  })
                  Toast.show({ text1: 'Koordinatlar alındı', text2: 'Güncelleme yapabilirsiniz', type: 'info' })
                }}
              >
                <Callout tooltip style={{ width: 500, height: 500 }}
                  onTouchEnd={() => {
                    setvisibleCallout(false)
                  }}>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visibleCallout}
                    onRequestClose={() => { setvisibleCallout(false) }}
                  >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', elevation: 5 }}>
                      <View style={{ padding: 5, backgroundColor: '#E77171', top: 70, borderRadius: 20 }}>
                        <Text style={{ fontSize: 15 }}>yer imini  değiştirmek için basılı tut</Text>
                      </View>
                    </View>
                  </Modal>
                </Callout>
              </Marker>
              <Circle center={{
                latitude: region.latitude,
                longitude: region.longitude
              }}
                radius={circleDimension}
                strokeColor='red'
                fillColor='#E2E2CC'
                strokeWidth={5}
                style={{ opacity: 0.1 }}
              />
            </MapView>
            <Button mode='contained' style={{ marginVertical: 10 }}
              disabled={
                region.latitude === storeLocation.latitude &&
                region.longitude === storeLocation.longitude &&
                circleDimension === radius

              }
              onPress={async () => {
                if (proccess === CrudEnum.UpdateStore) {
                  let updateDto: StoreDto = {
                    ...data,
                    radius: circleDimension,
                    storeLocation: {
                      ...region,
                      latitudeDelta: zoom.latitudeDelta,
                      longitudeDelta: zoom.longitudeDelta,
                      latitude: region.latitude,
                      longitude: region.longitude
                    }
                  }
                  let response = await UpdateStore(updateDto)
                  if (response?.responseStatus === ResponseStatus.IsSuccess) {
                    setCrudStatus && setCrudStatus('update')
                    Toast.show({ text1: response?.responseMessage, type: "success" })
                  }
                  else {
                    Toast.show({ text1: response?.responseMessage, type: "error" })
                  }
                }
                else {
                  if (storeLocation.latitude != region.latitude || storeLocation.longitude != region.longitude) {
                    setData && setData(prev => ({
                      ...prev,
                      radius: circleDimension,
                      storeLocation: {
                        ...prev.storeLocation,
                        latitude: region.latitude,
                        longitude: region.longitude,
                        latitudeDelta: zoom.latitudeDelta,
                        longitudeDelta: zoom.longitudeDelta
                      }
                    }))
                  }
                  setFormHelperText && setFormHelperText(prev => ({ ...prev, latitude: false, longitude: false }))
                }
                setVisible("default")
              }}>
              {proccess === CrudEnum.AddStore ? "Ekle" : "Güncelle"}
            </Button>
          </View>
          {visible === "map" && <Toast type='error' config={{
            error: (props: any) => (
              <BaseToast
                {...props}
                style={[{ borderLeftColor: '#007BFF', }, { backgroundColor: '#F44336', zIndex: 9999999999999, elevation: 10 }]} // Hata mesajları için renk
                text1Style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'black', // Başlık rengi
                }}
                text2Style={{
                  fontSize: 14,
                  color: 'black', // Alt metin rengi
                }}
                text2NumberOfLines={2}
              />
            ),
            info: (props: any) => (
              <BaseToast
                {...props}
                style={{ height: 'auto', backgroundColor: '#EECA2A' }} // Hata mesajları için renk
                text1Style={{ fontSize: 16 }}
                text2Style={{ fontSize: 16, color: 'black' }}
                text2NumberOfLines={5}
                contentContainerStyle={{ margin: 10 }}
              />
            ),
          }} />}
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
type SearchProps = {
  setRegion: React.Dispatch<React.SetStateAction<StoreLocationDto>>
  zoom: StoreLocationDto
}
const SearchComponent = (props: SearchProps) => {
  const { setRegion, zoom } = props
  const [searchText, setSearchText] = useState("");

  const handleSearchLocation = async () => {
    setRegion(prev => ({
      ...prev,
      latitudeDelta: zoom.latitudeDelta,
      longitudeDelta: zoom.longitudeDelta
    }))
    if (searchText) {
      try {
        const response1 = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json`,
          {
            headers: { "User-Agent": "Mozilla/5.0" },
          }
        );
        if (response1.status === 200) {
          const data1 = await response1.data[0]
          if (data1.lat && data1.lon) {
            setRegion(prev => ({
              ...prev,
              latitude: parseFloat(data1.lat),
              longitude: parseFloat(data1.lon),
            }))
          }
          else {
            Toast.show({ text1: "Konum bulunamadı", type: 'error' })
          }
        }
        else {
          const response2 = await fetch(
            `https://geocode.maps.co/search?q=${encodeURIComponent(searchText)}&format=json`
          );
          if (!response2.ok) {
            Toast.show({ text1: "Haritada Arama Sınırlandırması", text2: "Belirli bir süreye kadar arama yapılamaz!", type: "error", text1Style: { flex: 1, zIndex: 999999 } })
          }
          const data2 = await response2.json();
          if (data2.length > 0) {
            const location = data2[0];
            if (location.lat && location.lon) {
              setRegion(prev => ({
                ...prev,
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon),
              }))
            }
            else {
              Toast.show({ text1: "Konum bulunamadı", type: 'error' })
            }

          } else {
            Toast.show({ text1: "Konum Bulunamadı!", text2: "Lütfen geçerli bir adres girin.", type: "error" })
          }
        }
      } catch (error) {
        Toast.show({ text1: "Hata", text2: "Konum aranırken bir hata oluştu.", type: "error" })
        console.log("Hata", "Konum aranırken bir hata oluştu.");
      }
    }
    else {
      Toast.show({ text1: "Hata", text2: "Boş bir arama yapılamaz", type: "error" })
    }
  };

  return <Searchbar
    placeholder="Konum girin (örn: Ankara, Berlin)"
    onChangeText={setSearchText}
    value={searchText}
    onIconPress={async () => { await handleSearchLocation() }}
    style={{ marginBottom: 20, width: '95%' }}
  />
};


