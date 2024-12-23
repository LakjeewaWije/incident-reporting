import { View, Text, StyleSheet, FlatList, Image, Dimensions, Pressable, ImageBackground } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import StoreState from '../store/item.interface';
import useItemStore from '../store/useItemStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Location from 'expo-location';
import useAppStore from '../store/useAppStore';
import AppStoreState from '../store/app.interface';
import BarChartExample from '../components/barChart';
import { useNavigation } from 'expo-router';
import NoInternetOverlay from '../components/noInternetOverlay';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
type ItemProps = {
  title: string,
  locationData: any,
  imageUri: string,
  date: string,
  id: string,
  desc: string
};

export default function Tab() {
  const navigation: any = useNavigation();
  const [permissionML, requestMLPermission] = MediaLibrary.usePermissions();
  const items = useItemStore((state: StoreState) => state.items);
  const _location = useAppStore((state: AppStoreState) => state.location);
  const addLocation = useAppStore((state: AppStoreState) => state.addLocation);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    async function getCurrentLocation() {
      // AsyncStorage.clear();
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);
      addLocation(location);
    }

    getCurrentLocation()
  }, [])

  useEffect(() => {
    console.log(items)
  }, [items]);

  const Item = ({ title, locationData, imageUri, date, id, desc }: ItemProps) => (
    <Pressable style={styles.item} onPress={() =>
      navigation.navigate('itemDetails', { title, location: locationData?.display_name, imageUri, date, id, desc })
    }>
      <View style={styles.itemImageWrap}>
        <ImageBackground
          style={styles.itemImage}
          source={{ uri: imageUri }}
          imageStyle={{ borderRadius: 10 }} // Ensures the image itself has rounded corners
        >
          {/* You can add other components inside the ImageBackground */}
          {/* <Text style={styles.textOverlay}>Your content here</Text> */}
        </ImageBackground>
      </View>
      <View style={styles.itemDesc}>
        <Text numberOfLines={1} style={[styles.title, { maxWidth: windowWidth * 0.56 }]}>{title}</Text>
        <Text numberOfLines={3} style={[styles.location, { maxWidth: windowWidth * 0.56 }]}><FontAwesome size={20} name={'map-pin'} color={'#32CD32'} />{"  " + locationData?.display_name}</Text>
        <Text style={[styles.time, { maxWidth: windowWidth * 0.56 }]}>{date}</Text>
      </View>
    </Pressable>
  );
  return (
    <>
      <View style={styles.container}>
        {location ?
          <View style={{ flex: 1, }}>
            <View style={[styles.incidentBarCard, { height: windowHeight * 0.35 }]}>
              <Text style={styles.heading}>Incidents Reported - {items.length}</Text>
              <BarChartExample />
            </View>

            {items.length > 0 ?
              <FlatList
                data={items}
                renderItem={({ item }: any) => <Item
                  title={item.title}
                  locationData={item.location}
                  id={item.id}
                  imageUri={item.imageUri}
                  date={item.date}
                  desc={item.desc}
                />
                }
                keyExtractor={item => item.id}
              />
              :
              <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
                <Text style={styles.noIncidentMessage}>No incidents reported</Text>
              </View>
            }

          </View>
          :
          <View style={styles.allowLocationMessageContainer}>
            <Text style={styles.locationServiceMessage}>Please Allow Location Services To Continue, Go to settings and turn on location services</Text>
          </View>
        }
      </View>
      {/* <NoInternetOverlay /> */}
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  incidentBarCard: {
    height: 300, backgroundColor: '#F8F8F8', borderRadius: 10, shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginHorizontal: 16,
    elevation: 3,
    marginBottom: 10
  },
  heading: { fontSize: 20, backgroundColor: '#2563eb', padding: 10, color: '#fff', borderTopRightRadius: 10, borderTopLeftRadius: 10 },
  item: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    // Shadow for iOS 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android 
    elevation: 5,
    display: 'flex',
    flexDirection: 'row'
  },
  noIncidentMessage: {
    color: 'gray', fontSize: 20, textAlign: 'center',
    borderWidth: 1, padding: 10, borderColor: 'gray', borderRadius: 10, backgroundColor: '#fff'
  },
  allowLocationMessageContainer: { flex: 1, justifyContent: "center", alignItems: "center", },
  locationServiceMessage: {
    color: 'red', fontSize: 20, textAlign: 'center',
    borderWidth: 1, padding: 10, borderColor: '#FF4500', borderRadius: 10, backgroundColor: '#fff'
  },
  itemImageWrap: { borderRadius: 10, overflow: 'hidden', flex: 1 },
  itemImage: {
    flex: 1,
    justifyContent: 'center',
  },
  itemDesc: { flex: 2.4, gap: 2, backgroundColor: 'transparent', flexWrap: 'wrap', paddingLeft: 8 },
  title: {
    fontSize: 20,
  },
  location: {
    fontSize: 12,
    color: '#71797E'
  },
  time: {
    fontSize: 11,
    color: '#2563eb'
  },
});
