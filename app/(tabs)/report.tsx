import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, ImageBackground, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as MediaLibrary from 'expo-media-library';
import StoreState from '../store/item.interface';
import useItemStore from '../store/useItemStore';
import { format } from 'date-fns';
import IconButton from '../components/iconButton';
import * as Location from 'expo-location';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from 'expo-router';
import NoInternetOverlay from '../components/noInternetOverlay';

export default function Tab() {
  const headerHeight = useHeaderHeight();
  const items = useItemStore((state: StoreState) => state.items);
  const addItem = useItemStore((state: StoreState) => state.addItem);
  const navigation: any = useNavigation();
  const cameraRef: any = useRef(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [title, onChangeTitle] = useState('');
  const [desc, onChangeDesc] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionML, requestMLPermission] = MediaLibrary.usePermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string>('');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    console.log(items)
  }, [items]);

  if (!permission || !permissionML) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!permissionML.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to save images to gallery</Text>
        <Button onPress={requestMLPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCameraFlash() {
    setFlash(current => (current === 'on' ? 'off' : 'on'));
  }

  const takePicture = () => {
    if (cameraRef.current) {
      const start = Date.now();

      cameraRef.current
        ?.takePictureAsync({
          skipProcessing: true,
        })
        .then(async (photoData: any) => {
          setImage(photoData.uri)
          setModalVisible(true);
        });
    }
  };

  const reportIncident = async () => {

    setIsLoading(true)
    // Save the image to the media library const 
    const asset = await MediaLibrary.createAssetAsync(image);
    const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
    const date = new Date()
    // Format date as YYYY-MM-DD 
    const formattedDate = format(date, 'yyyy-MM-dd');
    // Format time as HH:mm and am/pm 
    const formattedTime = format(date, 'hh:mm a');

    let location = await Location.getCurrentPositionAsync({});

    location = await fetchAddressDetails(location.coords.latitude, location.coords.longitude)


    const item = {
      imageUri: assetInfo.localUri,
      location: location,
      title: title,
      desc: desc,
      date: formattedDate + ' ' + formattedTime,
      id: asset.id
    }
    addItem(item);
    setModalVisibility()
    setIsLoading(false)
    navigation.navigate('index')
  }

  const setModalVisibility = () => {
    onChangeTitle('')
    onChangeDesc('')
    setModalVisible(!modalVisible)
  }

  const fetchAddressDetails = async (latitude: any, longitude: any) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching address details:', error); return null;
    }
  };
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <View style={styles.btnView}>
            <IconButton size={30} icon="rotate-right" color='gray' style={styles.button} onPress={toggleCameraFacing} />
          </View>
          <View style={styles.btnView}>
            <IconButton size={70} icon="circle" color='white' style={styles.button} onPress={takePicture} />
          </View>
          <View style={styles.btnView}>
            <IconButton size={35} icon="flash" color={flash == 'on' ? 'yellow' : 'gray'} style={styles.button} onPress={toggleCameraFlash} />
          </View>
        </View>
      </CameraView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisibility()
        }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.centeredView, { paddingTop: headerHeight }]}>
          <View style={styles.modalView}>
            <View style={{ borderRadius: 10, overflow: 'hidden', width: 'auto', height: 'auto' }}>
              <Image
                style={{ width: windowWidth / 3 * 2, height: '100%' }}
                source={{ uri: image }}
              />
            </View>
          </View>

          <View style={[styles.modalViewDec]}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeTitle}
              value={title}
              placeholder="Enter Incident Title"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeDesc}
              value={desc}
              placeholder="Enter Incident Description"
              placeholderTextColor="#888"
            />
            <Text style={styles.locationDesc}>Location will be recorded to ensure the accuracy and authenticity of the provided details.</Text>

            <View style={styles.modalBtnView}>
              <IconButton disabled={isLoading} size={35} icon="close" color={'white'}
                style={styles.closeModalBtn}
                onPress={setModalVisibility} />

              <TouchableOpacity style={[{
                padding: 10, borderRadius: 10
              }, (title.length > 0 && desc.length > 0 && !isLoading) ? { backgroundColor: '#32CD32' } : { backgroundColor: '#D3D3D3' }]}
                disabled={title.length == 0 || desc.length == 0 || isLoading}
                onPress={() => reportIncident()}>
                <FontAwesome size={30} name="check-circle" color={'white'} />
              </TouchableOpacity>
            </View>
          </View >
        </KeyboardAvoidingView>
      </Modal>
      {/* <NoInternetOverlay /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    bottom: '5%'
    // margin: 64,
  },
  btnView: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  button: {
    padding: 5
  },
  closeModalBtn: {
    backgroundColor: '#FF6347',
    padding: 10, borderRadius: 10
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  centeredView: {
    flex: 1,
    // marginTop:97,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 2,
    width: '100%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    // justifyContent: 'center',
    // overflow: 'hidden',
    padding: 5
  },
  modalImage: {
    height: 300, width: 300, resizeMode: 'center'

  },
  modalViewDec: {
    flex: 3,
    gap: 10,
    padding: '2%',
    width: '100%',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    shadowColor: '#000',
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    width: '90%',
    borderWidth: 1,
    padding: 10,
    borderColor: '#32CD32',
    backgroundColor: 'white', borderRadius: 10
  },
  locationDesc: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    padding: 10, borderWidth: 1, borderRadius: 10,
    borderColor: '#32CD32',
    backgroundColor: '#32CD32'
  },
  modalBtnView: { display: 'flex', flexDirection: 'row', gap: 50 }
});

