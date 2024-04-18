import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import mapStyle from '../components/MapStyle';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

export default function HomeScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }

        Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 10 }, (location) => {
          setLocation(location);
        });
      } catch (error) {
        console.error('Error fetching location:', error.message);
        setErrorMsg(error.message);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <BlurView tint="dark" intensity={100} style={[StyleSheet.absoluteFill, styles.blurBackground]} />
        <Text style={styles.headerTitle}>Srida</Text>
        <View style={styles.box}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Text style={styles.button}>Srida Map</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.button}>Events</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            style={styles.map}
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
          >
          </MapView>
        )}
      </View>
      {errorMsg && <Text>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white color
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure the header is above the map
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 50,
  },
  box: {
    width: '70%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white color
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
