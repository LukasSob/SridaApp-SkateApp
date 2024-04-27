import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import mapStyle from '../components/MapStyle';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import PinOverlay from '../components/PinOverlay';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9); // Generate a random string
};

export default function HomeScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const overlayRef = useRef(null);
  const mapRef = useRef(null);

  const [spotName, setSpotName] = useState('');
  const [spotType, setSpotType] = useState('');
  const [spotDescription, setSpotDescription] = useState('');
  const [spotImages, setSpotImages] = useState([]);


  const [markers, setMarkers] = useState([]);

useEffect(() => {
  (async () => {
    try {
      let savedMarkers = await AsyncStorage.getItem('markers');
      if (savedMarkers) {
        setMarkers(JSON.parse(savedMarkers));
      }
    } catch (e) {
      console.error('Failed to load markers');
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    } else {
      Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 10 }, setLocation);
    }
    const fetchMarkers = async () => {
      const savedMarkers = await AsyncStorage.getItem('markers');
      if (savedMarkers) {
          const markersArray = JSON.parse(savedMarkers);
          console.log("Loaded markers with images:", markersArray);
          setMarkers(markersArray);
      }
  };

  fetchMarkers();
  })();
}, []);

const handleLongPress = (event) => {
  const { coordinate } = event.nativeEvent;
  setUserMarker({
      id: 'temp', // Temporary ID for the marker
      coordinate: coordinate, // Use the coordinates from the long press event
      name: 'Selected Location', // Optional: Name for the temporary marker
      description: 'This is the selected location', // Optional: Description
  });
  setShowButtons(true); // Optionally show buttons to add or remove the marker
};

  const handleAddMarker = () => {
    setShowOverlay(true);
  };

  const handleRemoveMarker = () => {
    setUserMarker(null);
    setShowOverlay(false);
    setShowButtons(false);
  };

  const handleCloseOverlay = () => {
    if (overlayRef.current) {
      overlayRef.current.animate('fadeOutDown', 500).then(() => {
        setShowOverlay(false);
      });
    }
  };

  const handleSpotPress = (marker) => {
    const fullSpotInfo = markers.find(m => m.id === marker.id);
    setSelectedSpot(fullSpotInfo);
  };

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
        alert("Permission to access camera roll is required!");
        return;
    }
    pickImage();
};

const getPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
  }
  return true;
};

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
  });

  console.log("Image Picker Full Result:", JSON.stringify(result, null, 2));  // Provides a formatted view

  if (result.cancelled) {
      console.log("Image picking was cancelled.");
      return;
  }

  // Checking if assets exists and has at least one item
  if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (!uri) {
          console.error("No URI found in the assets.");
          return;
      }
      setSpotImages(currentImages => [...currentImages, uri]);
  } else {
      console.error("No assets found in the result.");
  }
};


const handleSubmit = async () => {
  const newMarker = {
    id: generateUniqueId(),
    coordinate: userMarker.coordinate,
    name: spotName || 'Unnamed Spot',
    type: spotType || 'No Type',
    description: spotDescription || 'No Description',
    images: spotImages
  };

  const newMarkers = [...markers, newMarker];
  setMarkers(newMarkers);
  setUserMarker(null);
  await AsyncStorage.setItem('markers', JSON.stringify(newMarkers));
  setShowOverlay(false);
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
    {markers.map((marker) => (
  <Marker
    key={marker.id}
    coordinate={marker.coordinate}
    title={marker.name}
    description={marker.description}
    onPress={() => handleSpotPress(marker)} // Add this line
  />
))}
    {userMarker && (
      <Marker
        key={userMarker.id}
        coordinate={userMarker.coordinate}
        title={userMarker.name || "New Marker"}
        description={userMarker.description || "No description provided"}
      />
    )}
  </StyledMapView>
)}
        {showButtons && (
          <ButtonContainer>
            <Button onPress={handleAddMarker}>
              <ButtonText>+</ButtonText>
            </Button>
            <Button onPress={handleRemoveMarker}>
              <ButtonText>-</ButtonText>
            </Button>
          </ButtonContainer>
        )}
        {selectedSpot && (
  <PinOverlay
    spotInfo={selectedSpot}
    onClose={() => setSelectedSpot(null)} // Change to this
  />
)}
        {showOverlay && (
          <StyledAnimatableOverlay
            ref={overlayRef} // Set the ref here
          >
            <TitleContainer>
              <TitleText>Add Spot</TitleText>
            </TitleContainer>
            <CloseButton onPress={handleCloseOverlay}>
              <CloseButtonText>X</CloseButtonText>
            </CloseButton>
            <Text>Provide Spot Information</Text>
            <Body>
        <RowContainer>
          <InputLabel>Spot Name:</InputLabel>
          <InputField
            placeholder="Enter spot name..."
            value={spotName}
            onChangeText={setSpotName}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Spot Type:</InputLabel>
          <InputField
            placeholder="Enter spot type..."
            value={spotType}
            onChangeText={setSpotType}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Description:</InputLabel>
          <InputField
            placeholder="Spot Description..."
            multiline
            numberOfLines={4}
            value={spotDescription}
            onChangeText={setSpotDescription}
          />
        </RowContainer>

        <RowContainer>
        <TouchableOpacity onPress={handleAddImage}>
    <ButtonText>Add Image</ButtonText>
</TouchableOpacity>
        </RowContainer>

        <SubmitButtonContainer>
          <SubmitButton onPress={handleSubmit}>
            <ButtonText>Submit Spot</ButtonText>
          </SubmitButton>
        </SubmitButtonContainer>
      </Body>
          </StyledAnimatableOverlay>
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

// Styled MapView
const StyledMapView = styled(MapView)`
  flex: 1;
`;

// Error Message Text
const ErrorMsg = styled.Text`
  color: #ff0000;
`;

// Button Container
const ButtonContainer = styled.View`
  position: absolute;
  right: 10px;
  top: 50%;
`;

// Buttons and Text within Buttons
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

// Styled Overlay with Animatable
const StyledAnimatableOverlay = styled(Animatable.View).attrs({
  animation: "fadeInUp",
  duration: 500,
  useNativeDriver: true
})`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 1%;
  background-color: #477399;
  padding: 20px;
  padding-top: 40px;
  align-items: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

// Title Container inside Overlay
const TitleContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
`;

// Title Text
const TitleText = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 18px;
`;

// Close Button
const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 10px;
  margin-top: 10px;
  background-color: #ff0000;
  border-radius: 10px;
`;

const CloseButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;

// Input Fields to Add Spot Info

const Body = styled.ScrollView`
  margin-bottom: -10%;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between; /* Align items evenly */
  margin-bottom: 15%;
  margin-top: 15%;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  width: 30%; /* Set a specific width for the labels */
  color: #f7f7ff;
`;

const InputField = styled.TextInput.attrs({
  placeholderTextColor: '#fff', // Placeholder text color
})`
  height: 40px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  color: #fff; /* Text color */
  width: 60%; /* Adjust the width of the input fields */
`;

const SubmitButton = styled(TouchableOpacity)`
  border-width: 1px;
  border-color: #ccc;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 150px;
  background-color: #495867;
  border-radius: 5px;
  align-self: center;
`;

const SubmitButtonContainer = styled.View`
  align-items: center; 
`;

