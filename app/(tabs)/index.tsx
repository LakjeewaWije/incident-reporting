import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import StoreState from '../store/item.interface';
import useItemStore from '../store/useItemStore';

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
          style={{ height: 200, resizeMode: 'cover', borderRadius: 10 }}
          source={{
            uri: imageUri,
          }}
        />
      </>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.location}>{location}</Text>
      <Text style={styles.location}>{date}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20 }}>Incidents Reported</Text>
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
    // justifyContent: 'center',
    // alignItems: 'center',
  },
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
});
