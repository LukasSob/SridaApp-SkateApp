import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventOverlay from '../components/EventOverlay';

function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef(null);

  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCoverImage, setEventCoverImage] = useState(null);
  const [interested] = useState(0);

  useEffect(() => {
    const loadEvents = async () => {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) setEvents(JSON.parse(storedEvents));
    };

    loadEvents();
  }, []);

  const saveEvents = async (newEvents) => {
    await AsyncStorage.setItem('events', JSON.stringify(newEvents));
  };


  
  // ----------------------------------
  // handle permission and image picker
  // ----------------------------------
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
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image Picker Full Result:", JSON.stringify(result, null, 2));

    if (result.cancelled) {
      console.log("Image picking was cancelled.");
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (!uri) {
        console.error("No URI found in the assets.");
        return;
      }
      setEventCoverImage(result.assets[0].uri);
    } else {
      console.error("No assets found in the result.");
    }
  };
  // ----------------------------------



  // ---------------------------------------------------------------
  // handle open overlay animation and showcase of event information
  // ---------------------------------------------------------------
  const handleAddEvent = () => {
    setShowOverlay(true);
    if (overlayRef.current) {
      overlayRef.current.fadeInUp(500);
    }
  };

  const handleEventClick = (event) => {
    setCurrentEvent(event);
  };
  // ---------------------------------------------------------------



  // ----------------------------------------------------
  // handle close overlay for the close animation to work
  // ----------------------------------------------------
  const handleCloseOverlay = () => {
    if (overlayRef.current) {
      overlayRef.current.animate('fadeOutDown', 500).then(() => {
        setShowOverlay(false);
        setCurrentEvent(null)
      });
    }
  };
  // ----------------------------------------------------


  // ---------------------------
  // handle the event submission
  // ---------------------------
  const handleSubmit = () => {
    const newEvent = {
      name: eventName,
      type: eventType,
      location: eventLocation,
      date: eventDate,
      time: eventTime,
      description: eventDescription,
      coverImage: eventCoverImage,
      interested: interested
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    handleCloseOverlay();
  };
  // ---------------------------

  return (
    <Container>
      <Body>
        <View>
          <Header navigation={navigation} />
          <RowStyle>
            <TouchButton onPress={() => handleAddEvent()}>
              <Icon>
                <Ionicons name="add" size={24} color="white" />
              </Icon>
            </TouchButton>
          </RowStyle>
          <DivideHeader />
        </View>
        <EventContainer>
          {events.map((event, index) => (
            <EventBox key={index} onPress={() => handleEventClick(event)}>
              {event.coverImage && (
                <Image
                  source={{ uri: event.coverImage }}
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
              )}
              <EventDetails>
                <Text style={{ fontWeight: 'bold' }}>Event: {event.name}</Text>
                <Text>Type: {event.type}</Text>
                <Text>Location: {event.location}</Text>
                <Text>Date: {event.date} at {event.time}</Text>
                <Text>Description: {event.description}</Text>
              </EventDetails>
            </EventBox>
          ))}
          <Title>- End of Events -</Title>
          <DivideHeader></DivideHeader>
        </EventContainer>
      </Body>
      {currentEvent && (
        <EventOverlay 
          eventData={currentEvent} 
          onClose={() => setCurrentEvent(null)} 
        />
      )}
      {showOverlay && (
        <StyledAnimatableOverlay
          ref={overlayRef}
        >
          <TitleContainer>
            <Title>Create Event</Title>
          </TitleContainer>
          <CloseButton onPress={handleCloseOverlay}>
            <CloseButtonText>X</CloseButtonText>
          </CloseButton>
          <SubTitle>Provide Event Information</SubTitle>
          <Box></Box>
          <ContainerBody>
            <RowContainer>
              <InputLabel>Event Name:</InputLabel>
              <InputField
                placeholder="Enter event name..."
                value={eventName}
                onChangeText={setEventName}
              />
            </RowContainer>

            <RowContainer>
              <InputLabel>Event Type:</InputLabel>
              <InputField
                placeholder="Enter event type..."
                value={eventType}
                onChangeText={setEventType}
              />
            </RowContainer>

            <RowContainer>
              <InputLabel>Event Location:</InputLabel>
              <InputField
                placeholder="Enter event location..."
                value={eventLocation}
                onChangeText={setEventLocation}
              />
            </RowContainer>

            <RowContainer>
              <InputLabel>Event Date:</InputLabel>
              <InputField
                placeholder="Enter event date..."
                value={eventDate}
                onChangeText={setEventDate}
              />
            </RowContainer>

            <RowContainer>
              <InputLabel>Event Time:</InputLabel>
              <InputField
                placeholder="Enter event time..."
                value={eventTime}
                onChangeText={setEventTime}
              />
            </RowContainer>

            <RowContainer>
              <InputLabel>Description:</InputLabel>
              <InputField
                placeholder="Event Description..."
                multiline
                numberOfLines={4}
                value={eventDescription}
                onChangeText={setEventDescription}
              />
            </RowContainer>

            <RowContainer>
              <InputLabel>Cover Image:</InputLabel>
              <Btn onPress={handleAddImage}>
                <ButtonText>Submit Image</ButtonText>
              </Btn>
            </RowContainer>

            <SubmitButtonContainer>
              <SubmitButton onPress={handleSubmit}>
                <ButtonText>Submit Spot</ButtonText>
              </SubmitButton>
            </SubmitButtonContainer>
          </ContainerBody>
        </StyledAnimatableOverlay>
      )}
    </Container>

  );
}

  // ------------------------------------------------------------ //
 // -----------              Containers              ----------- //
// ------------------------------------------------------------ //

const Container = styled.View`
  flex: 1;
  background: #010020;
`;

const Body = styled.ScrollView`
  background: #477399;
  height: 100%;
  width: 100%;
  position: absolute;
`;

const ContainerBody = styled.ScrollView`
`;

const EventContainer = styled.View`
padding: 10px;
`;

const EventDetails = styled.View`
  flex: 1;
`;

const RowStyle = styled.View`
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center; 
  align-items: center;
`;

const DivideHeader = styled.View`
  background: #fff;
  height: 1px;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
`;

const StyledAnimatableOverlay = styled(Animatable.View).attrs({
  animation: "fadeInUp",
  duration: 500,
  useNativeDriver: true
})`
position: absolute;
left: 0;
right: 0;
bottom: 0;
top: 15%;
background-color: #477399;
padding: 20px;
padding-top: 40px;
align-items: center;
border-top-left-radius: 20px;
border-top-right-radius: 20px;
`;

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

const Box = styled.View`
  width: 80%;
  height: 1px;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  align-self: center;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15%;
  margin-top: 15%;
`;

  // ------------------------------------------------------ //
 // -----------              Text              ----------- //
// ------------------------------------------------------ //

const Title = styled.Text`
  font-size: 18px;
  color: white;
  margin-top: 30px;
  margin-bottom: 5px;
  text-align: center;
`;

const SubTitle = styled.Text`
  font-size: 13px;
  color: #999;
  margin-top: 20px;
  align-items: center;
  text-align: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const CloseButtonText = styled.Text`
  color: #000;
  font-size: 26px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  width: 30%; 
  color: #f7f7ff;
`;

  // --------------------------------------------------------- //
 // -----------              Buttons              ----------- //
// --------------------------------------------------------- //

const InputField = styled.TextInput.attrs({
  placeholderTextColor: '#fff',
})`
  height: 40px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  color: #fff; 
  width: 60%; 
`;

const EventBox = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
`;

const Btn = styled(TouchableOpacity)`
  border-width: 1px;
  border-color: #ccc;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 150px;
  background-color: #556;
  border-radius: 5px;
  align-self: center;
`;

const TouchButton = styled.TouchableOpacity`
  align-items: center;
`;

const CloseButton = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  border-radius: 10px;
  z-index: 10;
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


const Icon = styled.View`
  background-color: #333;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

export default EventsScreen;