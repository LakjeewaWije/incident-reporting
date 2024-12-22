import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import StoreState from '../store/item.interface';
import useItemStore from '../store/useItemStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Location from 'expo-location';
import useAppStore from '../store/useAppStore';
import AppStoreState from '../store/app.interface';
type ItemProps = {
  title: string,
  locationData: any,
  imageUri: string,
  date: string,
  id: string
};
export default function Tab() {
  const items = useItemStore((state: StoreState) => state.items);
  const _location = useAppStore((state: AppStoreState) => state.location);
  const addLocation = useAppStore((state: AppStoreState) => state.addLocation);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  useEffect(() => {
    async function getCurrentLocation() {

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

    console.log("$%$%$%$%$%$%$%$%$%$%%%$%$%$%$%$%$% "+items[0]?.location)
  }, [items]);

  const Item = ({ title, locationData, imageUri, date, id }: ItemProps) => (
    <View style={styles.item}>
      <>
        <Image
          style={{ height: 300, resizeMode: 'center', borderRadius: 10 }}
          source={{
            uri: imageUri,
          }}
        />
      </>
      <View style={{display:'flex',gap:8}}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.location}><FontAwesome size={20} name={'map-pin'} color={'#32CD32'} />{"  " + locationData.display_name}</Text>
      <Text style={styles.time}>{date}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      {location ?
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Incidents Reported</Text>
          <FlatList
            data={items}
            renderItem={({ item }: any) => <Item
              title={item.title}
              locationData={item.location}
              id={item.id}
              imageUri={item.imageUri}
              date={item.date}
            />
            }
            keyExtractor={item => item.id}
          />
        </View>
        :
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center",}}>
          <Text style={{color:'red',fontSize:20,textAlign:'center',
            borderWidth:1,padding:10,borderColor: '#FF4500',borderRadius:10,backgroundColor:'#FFB07A'
          }}>Please Allow Location Services To Continue, Go to settings and turn on location services</Text>
          </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  heading: { fontSize: 20, backgroundColor: '#32CD32', padding: 10, color: 'white', borderRadius: 10 },
  item: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    // Shadow for iOS 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android 
    elevation: 5
  },
  title: {
    fontSize: 32,
  },
  location: {
    fontSize: 18,
  },
  time: {
    fontSize: 15,
    color: 'gray'
  },
});
