import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import mapStyle from '../components/MapStyle';
import * as Location from 'expo-location';
import OverlayComponent from '../components/Overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

export default function HomeScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [permanentMarkers, setPermanentMarkers] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }

        const storedMarkers = await AsyncStorage.getItem('permanentMarkers');
        if (storedMarkers) {
          setPermanentMarkers(JSON.parse(storedMarkers));
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
    setShowOverlay(true);
  };

  const handleRemoveMarker = () => {
    setUserMarker(null);
    setShowOverlay(false);
  };

  const handleAddPermanentMarker = (spotId) => {
    if (userMarker) {
      setPermanentMarkers([...permanentMarkers, { id: spotId, coordinate: userMarker }]);
      AsyncStorage.setItem('permanentMarkers', JSON.stringify([...permanentMarkers, { id: spotId, coordinate: userMarker }]));
      setShowOverlay(false); // Close the overlay after adding permanent marker
      setShowButtons(false); // Hide the buttons
    }
  };
  
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleMarkerPress = async (markerId) => {
    try {
      // Retrieve the information associated with the marker's ID
      const spotInfo = await AsyncStorage.getItem(markerId);
      if (spotInfo) {
        // Display the information to the user
        console.log(JSON.parse(spotInfo));
        // You can set the retrieved information to a state variable
        // and display it in your UI
      }
    } catch (error) {
      console.error('Error retrieving spot information:', error);
    }
  };
  
  return (
    <Container>
      <Header navigation={navigation} />
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
            {permanentMarkers.map((marker, index) => (
              marker.coordinate && <Marker key={index} coordinate={marker.coordinate} onPress={() => handleMarkerPress(marker.id)} />
            ))}
            {userMarker && <Marker coordinate={userMarker} />}
          </StyledMapView>
        )}
        {userMarker && showButtons && (
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
      {showOverlay && (
        <OverlayComponent
          isVisible={showOverlay}
          handleCloseOverlay={handleCloseOverlay}
          handleAddPermanentMarker={handleAddPermanentMarker}
          animationType="slideInDown"
          animationDuration={200}
        />
      )}
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
