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

  const [pressTimer, setPressTimer] = useState(null);
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


  useEffect(() => {
    // Clean up the timer when the component unmounts
    return () => clearTimeout(pressTimer);
  }, [pressTimer]);

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

  const handlePressTimer = () => {
    // Set a timer for 20 seconds
    const timer = setTimeout(async () => {
      await AsyncStorage.clear();
      console.log("AsyncStorage Cleared", "All data has been removed. Restart App To See Full Changes.");
    }, 10000);
    setPressTimer(timer);
  };

  const handlePressOut = () => {
    // Clear the timer if the user releases the press
    clearTimeout(pressTimer);

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

  const handleSpotPress = (markerId) => {
    const fullSpotInfo = markers.find(m => m.id === markerId.id);
    if (fullSpotInfo) {
      setSelectedSpot(fullSpotInfo);
    } else {
      console.log("No spot found with the given ID:", markerId);
    }
  };

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    pickImage();
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

  const addReviewToMarker = (markerId, review) => {
    const updatedMarkers = markers.map(marker => {
      if (marker.id === markerId) {
        return { ...marker, reviews: [...marker.reviews, review] };
      }
      return marker;
    });

    setMarkers(updatedMarkers);
    // Optionally update AsyncStorage with new marker data
    AsyncStorage.setItem('markers', JSON.stringify(updatedMarkers));
  };

  const handleSubmit = async () => {
    const newMarker = {
      id: generateUniqueId(),
      coordinate: userMarker.coordinate,
      name: spotName || 'Unnamed Spot',
      type: spotType || 'No Type',
      description: spotDescription || 'No Description',
      images: spotImages,
      reviews: []  // Initialize with an empty array
    };

    const newMarkers = [...markers, newMarker];
    setMarkers(newMarkers);
    setUserMarker(null); // Reset userMarker
    await AsyncStorage.setItem('markers', JSON.stringify(newMarkers));
    setShowOverlay(false);
  };


  return (
    <Container>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={handlePressTimer}
        onPressOut={handlePressOut}>
        <Header navigation={navigation} />
      </TouchableOpacity>
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
            onClose={() => setSelectedSpot(null)}
            addReviewToMarker={addReviewToMarker}  // Passing the function to add reviews
          />
        )}
        {showOverlay && (
          <StyledAnimatableOverlay
            ref={overlayRef} // Set the ref here
          >
            <TitleContainer>
              <Title>Add Spot</Title>
            </TitleContainer>
            <CloseButton onPress={handleCloseOverlay}>
              <CloseButtonText>X</CloseButtonText>
            </CloseButton>
            <SubTitle>Provide Spot Information</SubTitle>
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
                <InputLabel>Spot Images:</InputLabel>
                <Btn title="Pick images" onPress={pickImage} />
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

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: white;
  margin-top: 20px;
  align-items: center;
  text-align: center;
`;

const Btn = styled.Button`
  height: 50px;
  width: 150px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: absolute;
  left: 150px;
  top: 150px;
  z-index: 9999;
  background: #333;
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
  background-color: 'grey';
  border-radius: 5px;
  align-self: center;
`;

const SubmitButtonContainer = styled.View`
  align-items: center; 
`;

