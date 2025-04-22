import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync, reverseGeocodeAsync } from 'expo-location';
import { AppDispatch, RootState } from '../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { locationStore } from './Requests/locationStore';
import { ActivityIndicator, Button, List, MD2Colors, MD3Colors } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { LocationSliceDto } from './Dtos/locationDto';
import { locationSlice } from './locationSlice';
import { ScrollView } from 'react-native-gesture-handler';
import { theme } from '../Components/Home/home';

export default function LocationComponent() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>()
  const [reloadLocation, setReloadLocation] = useState(false) // tekrar konum arama
  const [expanded, setExpanded] = React.useState(false);
  const locationState = useSelector((state: RootState) => state.location)
  const barcodeState = useSelector((state: RootState) => state.barcode)
  // const [areaControl, setAreaControl] = useState<boolean>(false)
  
  // async function calculateDistance(lat1: number | undefined, lon1: number | undefined, lat2: number, lon2: number | undefined) {
  //   const R = 6371000; // Dünya'nın yarıçapı (metre cinsinden)
  //   const toRadians = (degree: number) => (degree * Math.PI) / 180;

  //   const dLat = lat1 && lat2 && toRadians(lat2 - lat1);
  //   const dLon = lon1 && lon2 && toRadians(lon2 - lon1);

  //   const a = dLat && dLon &&
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(toRadians(lat1)) *
  //     Math.cos(toRadians(lat2)) *
  //     Math.sin(dLon / 2) *
  //     Math.sin(dLon / 2);

  //     console.log("a = ",a);
      

  //   const c = a && 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return c && R * c; // Mesafeyi metre cinsinden döndürür
  // }

  // const isWithinArea = async () => {
  //   //  Kullanıcı konumunu al

  //   const deviceLatitude = locationState?.coords.latitude;
  //   const deviceLongitude = locationState?.coords.longitude;

  //   console.log("deviceLatitude = ",deviceLatitude);
  //   console.log("deviceLongitude = ",deviceLongitude);


  //   // const deviceLatitude= 40.040375 // alan içinde bir konum(örnek kod)
  //   // const deviceLongitude = 32.908079; // alan içinde bir konum(örnek kod)


  //   if (deviceLatitude && deviceLongitude) {
  //     //  Alanı tanımla (Modalife konumu )

  //     // const areaCenterLatitude = 40.04144575513158 // Alanın merkez noktası
  //     // const areaCenterLongitude = 32.908030908625896;
  //     // const areaRadius = 5000; // 5000 metre (5 km)

  //     const areaCenterLatitude = barcodeState.storeDto.storeLocation.latitude;
  //     const areaCenterLongitude = barcodeState.storeDto.storeLocation.longitude;
  //     const areaRadius = barcodeState.storeDto.radius

  //     //  Cihazın alan içinde olup olmadığını kontrol et

  //     const distance = await calculateDistance(
  //       deviceLatitude,
  //       deviceLongitude,
  //       areaCenterLatitude,
  //       areaCenterLongitude
  //     );
  //     console.log("distance = ",distance);
  //     console.log("areaRadius = ",areaRadius);
  //     console.log("areaCenterLatitude = ",areaCenterLatitude);
  //     console.log("areaCenterLongitude = ",areaCenterLongitude);

  //     let locationSliceDto: LocationSliceDto = {
  //       areaControl: false,
  //       coords: locationState.coords,
  //       mocked: locationState.mocked,
  //       timestamp: locationState.timestamp,
  //       address: locationState.address
  //     }

  //     if (distance && areaRadius && distance <= areaRadius) {
  //       // locationState.areaControl = true
  //       locationSliceDto.areaControl=true
  //       dispatch(locationStore(locationSliceDto))

  //       console.log("Cihaz belirlenen alan içinde.");
  //       return false;
  //     }
  //     else {
  //       console.log(`distance = ${distance} ----- area = ${areaRadius}`);
  //       console.log("Cihaz belirlenen alanın dışında.");
  //       if (barcodeState.data.trim() == BarcodeDataEnum.InputData.trim() || barcodeState.data.trim() === BarcodeDataEnum.OutData.trim()) {
  //         locationSliceDto.areaControl=false
  //         dispatch(locationStore(locationSliceDto))
  //       }
  //       // Toast.show({
  //       //   text1: 'Barkod Okuma',
  //       //   text2: 'Barkod okuma işlemi şirket dışında yapılamaz',
  //       //   type: 'error',
  //       // })
  //       return true
  //     }
  //   }
  //   else {
  //     return false
  //   }
  // }

  // useEffect(() => {
  //   isWithinArea().then(response => {
  //     setAreaControl(response)
  //   });
  // },
  //   [locationState.coords.longitude, locationState.coords.latitude,barcodeState.storeDto.radius]
  // )

  useEffect(() => {
    async function getCurrentLocation() {
      dispatch(locationSlice.actions.locationReset())

      // if (Platform.OS === 'android' && !Device.isDevice) {
      //   setErrorMsg(
      //     'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
      //   );
      //   return;
      // }
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await getCurrentPositionAsync({
        accuracy: Accuracy.Highest
      });

      let address = await reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude })
      let locationSliceDto: LocationSliceDto = {
        areaControl: barcodeState.locationDto.areaControl ?? false,
        coords: location.coords,
        mocked: location.mocked,
        timestamp: location.timestamp,
        address: address
      }
      dispatch(locationStore(locationSliceDto))
    }
    getCurrentLocation();
  }, [reloadLocation]);

  const handleExpand = () => setExpanded(!expanded);

  const LocationInfo = () => (
    <List.Section style={{ marginTop: 0, justifyContent: 'center', borderRadius: 20 }}>
      <List.Accordion
        title="Konum Bilgilerim"
        titleStyle={{color:'#55B8E6'}}
        style={{ backgroundColor: '#D1C0F1', borderRadius: 30, marginVertical:0,marginHorizontal:10, paddingLeft: 23 }}
        left={props => <List.Icon  {...props} icon="google-maps" color={MD3Colors.primary50} />}
        expanded={expanded}
        onPress={handleExpand}
        theme={theme}
        >
        <LinearGradient
          colors={['#E65656', '#CA84E4', '#ACC8E5']}
          style={{ height: 350, width: '95%', borderRadius: 30, opacity: 0.85, alignSelf: 'center',marginTop:10 }}
        >
          <ScrollView>
            <List.Item
              title={"Ülke"}
              titleStyle={{ fontWeight: 'bold',color:'black'}}
              description={locationState.address.flatMap(x => x.country)}
              descriptionStyle={{ fontStyle: 'italic',color:'gray'}}
              left={() => <List.Icon color={'red'} icon="cog-outline" />}
            />
            <List.Item
              title={"İl"}
              titleStyle={{ fontWeight: 'bold',color:'black'}}
              description={locationState.address.flatMap(x => x.region)}
              descriptionStyle={{ fontStyle: 'italic',color:'gray' }}
              left={() => <List.Icon color={'red'} icon="cog-outline" />}
            />
            <List.Item
              title={"İlçe"}
              titleStyle={{ fontWeight: 'bold',color:'black' }}
              description={locationState.address.flatMap(x => x.subregion)}
              descriptionStyle={{ fontStyle: 'italic',color:'gray' }}
              left={() => <List.Icon color={'red'} icon="cog-outline" />}
            />
            <List.Item
              title={"Posta Kodu"}
              titleStyle={{ fontWeight: 'bold',color:'black' }}
              description={locationState.address.flatMap(x => x.postalCode)}
              descriptionStyle={{ fontStyle: 'italic',color:'gray' }}
              left={() => <List.Icon color={'red'} icon="cog-outline" />}
            />
            <List.Item
              title={"Tam Adres"}
              titleStyle={{ fontWeight: 'bold',color:'black' }}
              description={locationState.address.flatMap(x => x.formattedAddress)}
              descriptionStyle={{ fontStyle: 'italic',color:'gray' }}
              left={() => <List.Icon color={'red'} icon="cog-outline" />}
            />
            <List.Item
              title={""}
              titleStyle={{ fontWeight: 'bold',color:'black' }}
              description={""}
              descriptionStyle={{ fontStyle: 'italic',color:'gray' }}
              style={{ marginBottom: 50 }}
              left={() => (
                <Button mode='contained' onPress={() => { setReloadLocation(!reloadLocation) }}> Kounumu Tekrar Ara</Button>
              )}
            />
          </ScrollView>
        </LinearGradient>
      </List.Accordion>
    </List.Section>
  )
  return (
    <View >
      {!locationState.coords.latitude && locationState.coords.longitude ?
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text > Addres Aranıyor Lütfen Bekleyin </Text>
          <ActivityIndicator size={'large'} animating={true} color={MD2Colors.red800} />
        </View>
        :
        <LocationInfo />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
