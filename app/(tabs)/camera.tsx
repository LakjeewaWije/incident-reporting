import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, ImageBackground, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as MediaLibrary from 'expo-media-library';
import StoreState from '../store/item.interface';
import useItemStore from '../store/useItemStore';
import { format } from 'date-fns';
import IconButton from '../components/iconButton';

export default function Tab() {

  const items = useItemStore((state: StoreState) => state.items);
  const addItem = useItemStore((state: StoreState) => state.addItem);

  const cameraRef: any = useRef(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [title, onChangeTitle] = useState('');
  const [desc, onChangeDesc] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionML, requestMLPermission] = MediaLibrary.usePermissions();
  const [modalVisible, setModalVisible] = useState(false);
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

          console.log(`Delay after takePictureAsync: ${Date.now() - start} ms`);
          setImage(photoData.uri)
          setModalVisible(true);
          console.log(photoData.uri);
        });
    }
  };

  const reportIncident = async () => {


    // Save the image to the media library const 
    const asset = await MediaLibrary.createAssetAsync(image);
    const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
    console.log("ASSET ", asset)
    console.log("assetInfo ", assetInfo);
    const date = new Date()
    // Format date as YYYY-MM-DD 
    const formattedDate = format(date, 'yyyy-MM-dd');
    // Format time as HH:mm and am/pm 
    const formattedTime = format(date, 'hh:mm a');
    const item = {
      imageUri: assetInfo.localUri,
      location: 'at talbot',
      title: title,
      desc: desc,
      date: formattedDate + ' ' + formattedTime,
      id: asset.id
    }
    addItem(item);
    setModalVisibility()
  }

  const setModalVisibility = () => {
    onChangeTitle('')
    onChangeDesc('')
    setModalVisible(!modalVisible)
  }

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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.centeredView]}>
          <View style={styles.modalView}>
            <Image
              style={styles.modalImage}
              source={{
                uri: image,
              }}
            />
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
            <Text style={styles.locationDesc}>Location will be fetched by app from the point of incident to verify the reliability</Text>

            <View style={styles.modalBtnView}>
              <IconButton size={35} icon="close" color={'white'} style={styles.closeModalBtn} onPress={setModalVisibility} />

              <TouchableOpacity style={[{
                padding: 10, borderRadius: 10
              }, (title.length > 0 && desc.length > 0) ? { backgroundColor: '#32CD32' } : { backgroundColor: '#D3D3D3' }]}
                disabled={title.length == 0 || desc.length == 0}
                onPress={() => reportIncident()}>
                <FontAwesome size={30} name="check-circle" color={'white'} />
              </TouchableOpacity>
            </View>
          </View >
        </KeyboardAvoidingView>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 2,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    height: 300, width: 300, resizeMode: 'center', borderRadius: 10, overflow: 'hidden'

  },
  modalViewDec: {
    flex: 1.7,
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
    textAlign: 'center',
    padding: 10, borderWidth: 1, borderRadius: 10,
    borderColor: '#32CD32',
    backgroundColor: '#32CD32'
  },
  modalBtnView: { display: 'flex', flexDirection: 'row', gap: 50 }
});

