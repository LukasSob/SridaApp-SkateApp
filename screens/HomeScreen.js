import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import mapStyle from '../components/MapStyle';
import * as Location from 'expo-location';

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

export default function HomeScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [permanentMarker, setPermanentMarker] = useState(null);
  const mapRef = useRef(null);

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

  const handleLongPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setUserMarker(coordinate);
  };

  const handleAddMarker = () => {
    setPermanentMarker(userMarker);
  };

  const handleRemoveMarker = () => {
    setPermanentMarker(null);
    setUserMarker(null);
  };

  return (
    <Container>
      <Header navigation={navigation} />
      <Overlay></Overlay>
      <MapContainer>
        {location && (
          <StyledMapView
            ref={mapRef}
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onLongPress={handleLongPress}
          >
            {permanentMarker && <Marker coordinate={permanentMarker} />}
            {userMarker && !permanentMarker && <Marker coordinate={userMarker} />}
          </StyledMapView>
        )}
        {userMarker && !permanentMarker && (
          <ButtonContainer>
            <Button onPress={handleAddMarker}>
              <ButtonText>+</ButtonText>
            </Button>
            <Button onPress={handleRemoveMarker}>
              <ButtonText>-</ButtonText>
            </Button>
          </ButtonContainer>
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
  flex: 1;
`;

const Overlay = styled.View`
  flex: 1;
  position: 'absolute';
  left: 0px;
  top: 0;
  backgroundColor: 'transparent';
  width: width;
`;

const ErrorMsg = styled.Text`
  color: #ff0000;
`;

const ButtonContainer = styled.View`
  position: absolute;
  right: 10px;
  top: 50%;
`;

const Button = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  background-color: #495867;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 24px;
`;
