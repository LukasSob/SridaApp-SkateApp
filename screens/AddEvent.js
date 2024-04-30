import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Text, TextInput, TouchableOpacity, Button, Platform } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CreateEventScreen = () => {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCoverImage, setEventCoverImage] = useState(null);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    setEventCoverImage(pickerResult.uri);
  };

  const handleSubmit = () => {
    console.log('Event submitted:', {
      eventName,
      eventType,
      eventLocation,
      eventDate,
      eventTime,
      eventDescription,
    });
  
    // Simulate saving the event and navigating back with the new event data
    navigation.navigate('EventsScreen', { newEvent: {
      name: eventName,
      type: eventType,
      location: eventLocation,
      date: eventDate,
      time: eventTime,
      description: eventDescription
    }});
  };

  return (
    <Container>
      <Body>
        <RowContainer>
          <InputLabel>Event Name:</InputLabel>
          <InputField
            placeholder="Enter event name"
            value={eventName}
            onChangeText={setEventName}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Event Type:</InputLabel>
          <InputField
            placeholder="Enter event type"
            value={eventType}
            onChangeText={setEventType}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Location:</InputLabel>
          <InputField
            placeholder="Enter event location"
            value={eventLocation}
            onChangeText={setEventLocation}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Date:</InputLabel>
          <InputField
            placeholder="Enter event date"
            value={eventDate}
            onChangeText={setEventDate}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Time:</InputLabel>
          <InputField
            placeholder="Enter event time"
            value={eventTime}
            onChangeText={setEventTime}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Description:</InputLabel>
          <InputField
            placeholder="Event Description"
            multiline
            numberOfLines={4}
            value={eventDescription}
            onChangeText={setEventDescription}
          />
        </RowContainer>

        <RowContainer>
          <InputLabel>Cover Image:</InputLabel>
          <Button title="Pick an image" onPress={pickImage} />
        </RowContainer>

        {eventCoverImage && <Image source={{ uri: eventCoverImage }} style={{ width: 200, height: 200 }} />}

        <ButtonContainer>
          <SubmitButton onPress={handleSubmit}>
            <ButtonText>Submit Event</ButtonText>
          </SubmitButton>
        </ButtonContainer>
      </Body>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  flex: 1;
`;

const Body = styled.ScrollView`
  background: #477399;
  padding: 20px;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  width: 25%;
  color: #f7f7ff;
`;

const InputField = styled.TextInput.attrs({
  placeholderTextColor: '#fff',
})`
  flex: 1;
  height: 40px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  color: #fff;
`;

const ButtonContainer = styled.View`
  align-items: center; 
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
`;

const ButtonText = styled.Text`
  color: #f7f7ff;
  font-size: 16px;
  font-weight: bold;
`;

export default CreateEventScreen;
