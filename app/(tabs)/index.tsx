import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import StoreState from '../store/item.interface';
import useItemStore from '../store/useItemStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type ItemProps = {
  title: string,
  location: string,
  imageUri: string,
  date: string,
  id: string
};
export default function Tab() {
  const items = useItemStore((state: StoreState) => state.items);

  useEffect(() => {
    console.log(items)
  }, [items]);

  const Item = ({ title, location, imageUri, date, id }: ItemProps) => (
    <View style={styles.item}>
      <>
        <Image
          style={{ height: 300, resizeMode: 'center', borderRadius: 10 }}
          source={{
            uri: imageUri,
          }}
        />
      </>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.location}><FontAwesome size={20} name={'map-pin'} color={'#32CD32'} />{"  " + location}</Text>
      <Text style={styles.time}>{date}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>Incidents Reported</Text>
        <FlatList
          data={items}
          renderItem={({ item }: any) => <Item
            title={item.title}
            location={item.location}
            id={item.id}
            imageUri={item.imageUri}
            date={item.date}
          />
          }
          keyExtractor={item => item.id}
        />
      </View>
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
    fontSize: 20,
  },
  time: {
    fontSize: 15,
    color: 'gray'
  },
});
