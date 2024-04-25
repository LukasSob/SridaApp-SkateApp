import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9); // Generate a random string
};



const OverlayComponent = ({ isVisible, handleCloseOverlay, handleAddPermanentMarker, animationType, animationDuration }) => {
  const [spotName, setSpotName] = useState('');
  const [spotType, setSpotType] = useState('');
  const [spotDescription, setSpotDescription] = useState('');

  const handleSubmit = async () => {
    try {
      const spotId = generateUniqueId(); // Generate a unique ID for the spot
  
      // Construct the spot object
      const spot = {
        id: spotId,
        name: spotName,
        type: spotType,
        description: spotDescription,
      };
  
      // Store the spot in AsyncStorage if needed
      await AsyncStorage.setItem(`spot_${spotId}`, JSON.stringify(spot));
  
      // Call the callback function to add permanent marker with spot ID
      handleAddPermanentMarker(spotId);
  
      // Close the overlay
      handleCloseOverlay();
    } catch (error) {
      console.error('Error submitting spot:', error);
    }
  };
  


  return (
    <StyledAnimatedView
      isVisible={isVisible}
      animation={animationType}
      duration={animationDuration}
      easing="ease-out"
      useNativeDriver
    >
      <TopBar>
        <OverlayText></OverlayText>
        <OverlayText>Add Spot</OverlayText>
        <CloseButton onPress={handleCloseOverlay}>
          <CloseButtonText>X</CloseButtonText>
        </CloseButton>
      </TopBar>
      <Body>
        <RowContainer>
          <InputLabel>Event Name:</InputLabel>
          <InputField
            placeholder="Enter spot name..."
            value={spotName}
            onChangeText={setSpotName}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Event Type:</InputLabel>
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

        <ButtonContainer>
          <SubmitButton onPress={handleSubmit}>
            <ButtonText>Submit Spot</ButtonText>
          </SubmitButton>
        </ButtonContainer>
      </Body>
    </StyledAnimatedView>
  );
};

const StyledAnimatedView = styled(Animatable.View)`
  background-color: rgba(86, 86, 86, 0.9);
  position: absolute;
  left: 0;
  right: 0;
  top: 17%;
  bottom: -100%;
  justify-content: flex-start;
  align-items: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const OverlayText = styled.Text`
  color: white;
  font-size: 18px;
  text-align: center; /* Align the text to the center */
`;

const CloseButton = styled.TouchableOpacity``;

const CloseButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
`;

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

const ButtonContainer = styled.View`
  align-items: center; 
`;

const ButtonText = styled.Text`
  color: #f7f7ff;
  font-size: 16px;
  font-weight: bold;
`;

export default OverlayComponent;
