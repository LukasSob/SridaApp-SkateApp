import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import styled from 'styled-components/native';
//import Header from '../components/Header';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import mapStyle from '../components/MapStyle';
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
    <Container>
      <MapContainer>
        {location && (
          <StyledMapView
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
          />
        )}
      </MapContainer>
      {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f7f7ff;
`;

const MapContainer = styled.View`
  flex: 1;
`;

const StyledMapView = styled(MapView)`
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').height}px;
`;

const ErrorMsg = styled.Text`
  color: #ff0000;
`;

export { Container, MapContainer, StyledMapView, ErrorMsg };
