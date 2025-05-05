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
                <Button mode='contained' onPress={() => { setReloadLocation(!reloadLocation) }}> Konumu Tekrar Ara</Button>
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
