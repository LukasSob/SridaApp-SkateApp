import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';


const EventOverlay = ({ eventData, onClose }) => {
  const overlayRef = useRef(null);


  // --------------------------------------------
  // handle the overlay open and close animations
  // --------------------------------------------
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.animate('fadeInUp', 500);
    }
  }, []);

  const handleCloseOverlay = () => {
    if (overlayRef.current) {
      overlayRef.current.animate('fadeOutDown', 500).then(onClose);
    }
  };
  // --------------------------------------------

  // -----------------------------------------------------------------------------------
  // handle the increase of spot interests (adding when an interested button is clicked)
  // -----------------------------------------------------------------------------------
  const increaseInterested = () => {
    eventData.interested = eventData.interested + 1;
  };
  // -----------------------------------------------------------------------------------

  return (
    <OverlayContainer>
      <StyledAnimatableOverlay ref={overlayRef}>
        <CloseButton onPress={handleCloseOverlay}>
          <CloseButtonText>X</CloseButtonText>
        </CloseButton>
        <Title>{eventData.name || "Event Details"}</Title>
        <Body>
          <ContentContainer>
          <RowContainer>
              {eventData.coverImage && (
                <Image
                  source={{ uri: eventData.coverImage }}
                  style={{ width: 120, height: 120, marginVertical: 10 }}
                  resizeMode="cover"
                />
              )}
              <ColumnContainer>
                <SubTitle>Date & Time: {eventData.date} at {eventData.time}</SubTitle>
                <SubTitle>Event Location: {eventData.location}</SubTitle>
              </ColumnContainer>
            </RowContainer>
            <Box></Box>
            <TextContainer>
              <RowContainer>
                <InformationText>Name:</InformationText>
                <InformationText>{eventData.name}</InformationText>
              </RowContainer>

              <RowContainer>
              <InformationText>Type: </InformationText>
              <InformationText>{eventData.type}</InformationText>
              </RowContainer>

              <RowContainer>
              <InformationText>Description:</InformationText>
              <Description>{eventData.description}</Description>
              </RowContainer>
            </TextContainer>
              <SectionButton onPress={increaseInterested}>
                <Title>Interested</Title>
              </SectionButton>
              <SubTitle>{eventData.interested} people interested</SubTitle>
          </ContentContainer>
        </Body>
      </StyledAnimatableOverlay>
    </OverlayContainer>
  );
};

  // ------------------------------------------------------------ //
 // -----------              Containers              ----------- //
// ------------------------------------------------------------ //

const OverlayContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  flex: 1;
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
  flex: 1;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Body = styled.ScrollView`
  background: #477399;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4%;
  margin-top: 4%;
`;

const ColumnContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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

const TextContainer = styled.View`
  padding: 10px;
`;

const ContentContainer = styled.View`
`;

  // ------------------------------------------------------ //
 // -----------              Text              ----------- //
// ------------------------------------------------------ //

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: white;
  text-align: center;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: white;
  margin-bottom: 10px;
  align-self: center;
  justify-content: space-between;
`;

const InformationText = styled.Text`
  font-size: 18px;
  color: white;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 50px;
  flex-wrap: wrap;
  align-self: end;
  justify-content: end;
`;

const Description = styled.Text`
  font-size: 12px;
  padding-right: 120px;
  color: white;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 50px;
  flex-wrap: wrap;
  align-self: center;
  justify-content: center;
`;

const CloseButtonText = styled.Text`
  color: #000;
  font-size: 26px;
`;

  // --------------------------------------------------------- //
 // -----------              Buttons              ----------- //
// --------------------------------------------------------- //

const CloseButton = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  border-radius: 10px;
  z-index: 10;
`;

const SectionButton = styled(TouchableOpacity)`
  padding: 10px;
`;

export default EventOverlay;
