import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';

const CreateEventScreen = () => {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const handleSubmit = () => {
    // Handle event submission logic here
    // You can send the event details to a server, save them locally, etc.
    console.log('Event submitted:', {
      eventName,
      eventType,
      eventLocation,
      eventDate,
      eventTime,
      eventDescription,
    });
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
  margin-bottom: -10%;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10%;
  margin-top: 30px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  width: 25%; /* Set a specific width for the labels */
  margin-right: 7%;
  margin-left: 10%;
  
  color: #f7f7ff;
`;

const InputField = styled.TextInput.attrs({
  placeholderTextColor: '#fff', // Placeholder text color
})`
  flex: 1;
  height: 40px;
  border-width: 1px;
  margin-right: 10%;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  color: #fff; /* Text color */
`;

const Placeholder = styled.Text`
  color: #999; /* Placeholder text color */
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

export default CreateEventScreen;
