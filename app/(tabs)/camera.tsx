import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as MediaLibrary from 'expo-media-library';
import StoreState from '../store/item.interface';
import useItemStore from '../store/useItemStore';
import { format } from 'date-fns';

export default function Tab() {

  const items = useItemStore((state: StoreState) => state.items);
  const addItem = useItemStore((state: StoreState) => state.addItem);

  const cameraRef: any = useRef(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [title, onChangeTitle] = useState('');
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
      date : formattedDate + ' ' + formattedTime,
      id: asset.id
    }
    addItem(item);
    onChangeTitle('')
    setModalVisible(!modalVisible)
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <FontAwesome size={30} name="rotate-right" color={'gray'} />
            </TouchableOpacity>
          </View>
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <FontAwesome size={70} name="circle" color={'white'} />
            </TouchableOpacity>
          </View>
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFlash}>
              <FontAwesome size={35} name="flash" color={flash == 'on' ? 'yellow' : 'gray'} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={[styles.centeredView,]}>
          <ImageBackground resizeMode="contain" source={{ uri: image }} style={[styles.modalView]}>
            <TouchableOpacity style={{
              position: 'absolute', top: '8%', left: '5%',
              backgroundColor: '#FF6347',
              padding: 10, borderRadius: 10
            }}
              onPress={() => setModalVisible(!modalVisible)}>
              <FontAwesome size={30} name="close" color={'white'} />
            </TouchableOpacity>

            {/* <View style={{
              position: 'absolute', bottom: '20%', left: '5%',
              backgroundColor: 'white', borderRadius: 10
            }}> */}
            <TextInput
              style={styles.input}
              onChangeText={onChangeTitle}
              value={title}
              placeholder="Enter Incident Title"
              placeholderTextColor="#888"
            />
            {/* </View> */}
            <TouchableOpacity style={[{
              position: 'absolute', top: '20%', right: '5%',
              
              padding: 10, borderRadius: 10
            },title.length > 0 ? {backgroundColor: '#32CD32'}:{backgroundColor: '#D3D3D3'}]}
            disabled={title.length == 0}
              onPress={() => reportIncident()}>
              <FontAwesome size={30} name="check-circle" color={'white'} />
            </TouchableOpacity>
          </ImageBackground >
        </View>

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
    padding: 5,
    // flex: 1,
    // alignSelf: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'pink'
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
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
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
    // margin: 12,
    width: '70%',
    borderWidth: 1,
    padding: 10,
    position: 'absolute', top: '20%', left: '5%',
    backgroundColor: 'white', borderRadius: 10
  },

});

