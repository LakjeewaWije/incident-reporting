import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ItemDetails: React.FC = () => {
  const { title, location, imageUri, date, id, desc }: any = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={{ borderRadius: 10, overflow: 'hidden' }}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <Text style={styles.subtitle}>Description</Text>
      <Text style={styles.details}>{desc}</Text>
      <Text style={styles.subtitle}>Location</Text>
      <Text style={styles.details}>{location}</Text>
      <Text style={styles.subtitle}>Date</Text>
      <Text style={styles.details}>{date}</Text>
      {/* <Text style={styles.subtitle}>ID</Text>
      <Text style={styles.details}>{id}</Text> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    // backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    // width: '100%',
    height: 400,
    marginBottom: 20,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 20,
  },
});

export default ItemDetails;
