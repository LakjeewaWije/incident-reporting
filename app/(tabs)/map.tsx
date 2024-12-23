import { View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useEffect, useRef, useState } from 'react';
import useAppStore from '../store/useAppStore';
import AppStoreState from '../store/app.interface';
import StoreState from '../store/item.interface';
import useItemStore from '../store/useItemStore';
import * as Location from 'expo-location';
import NoInternetOverlay from '../components/noInternetOverlay';
export default function Tab() {
  const _location = useAppStore((state: AppStoreState) => state.location);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const addLocation = useAppStore((state: AppStoreState) => state.addLocation);
  const items = useItemStore((state: StoreState) => state.items);
  const [htmlContent, setHtmlContent] = useState('')

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
  }, []);
  // const [template,setTemplate] = useState('')
  useEffect(() => {
    const incPins = generateMarkersScript(items)

    setNewMap(incPins)
  }, [items]);

  const generateMarkersScript = (itemsArray: any) => {
    return itemsArray.map((item: any, index: any) => `
      L.marker([${item.location.lat}, ${item.location.lon}]).addTo(map)
        .bindPopup('${item.title}');
    `).join('');
  };

  const setNewMap = (pins: any) => {
    const htmlContentDefault = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leaflet Map</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <style>
        #map {
          width: 100%;
          height: 100%;
          position: absolute;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          var map = L.map('map').setView([${_location.coords.latitude}, ${_location.coords.longitude}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          var greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          L.marker([${_location.coords.latitude}, ${_location.coords.longitude}],{icon: greenIcon}).addTo(map)
            .bindPopup('Your Location')
            .openPopup();
            ${pins}
        });
      </script>
    </body>
    </html>
  `;

    setHtmlContent(htmlContentDefault)
  }

  // const htmlContentDefault = `
  //   <!DOCTYPE html>
  //   <html>
  //   <head>
  //     <title>Leaflet Map</title>
  //     <meta charset="utf-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
  //     <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  //     <style>
  //       #map {
  //         width: 100%;
  //         height: 100%;
  //         position: absolute;
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <div id="map"></div>
  //     <script>
  //       document.addEventListener("DOMContentLoaded", function() {
  //         var map = L.map('map').setView([53.35767190124344, -6.242885361773875], 13);
  //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //           maxZoom: 19,
  //         }).addTo(map);
  //         L.marker([${location.coords.latitude}, ${location.coords.longitude}]).addTo(map)
  //           .bindPopup('Your Location')
  //           .openPopup();
  //           ${otherPins}

  //       });
  //     </script>
  //   </body>
  //   </html>
  // `;
  return (
    <View style={styles.container}>
      {location ?
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.map}
        />
        : <View style={styles.locationServiceMsgContainer}>
          <Text style={styles.locationServiceMessage}>Please Allow Location Services To Continue, Go to settings and turn on location services</Text>
        </View>}
        {/* <NoInternetOverlay /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationServiceMsgContainer: { flex: 1, justifyContent: "center", alignItems: "center", },
  locationServiceMessage: {
    color: 'red', fontSize: 20, textAlign: 'center',
    borderWidth: 1, padding: 10, borderColor: '#FF4500', borderRadius: 10, backgroundColor: '#fff'
  }
});
