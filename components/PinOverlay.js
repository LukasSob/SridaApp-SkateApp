// PinOverlay.js
import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

const PinOverlay = ({ spotInfo, onClose }) => {
  const overlayRef = useRef(null);
  const [activeSection, setActiveSection] = useState('overview');

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

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <Description>{spotInfo.description}</Description>
            <ImagesContainer>
              {spotInfo.images && spotInfo.images.map((imageUri, index) => (
                <Image
                key={index}
                source={{ uri: imageUri }}
                style={{ width: 100, height: 100, margin: 5 }}
                resizeMode="cover"
            />
              ))}
            </ImagesContainer>
          </>
        );
      case 'reviews':
        return <Text>Reviews content here...</Text>; // Replace with actual content
      case 'about':
        return <Text>About content here...</Text>; // Replace with actual content
      default:
        return <Description>{spotInfo.description}</Description>;
    }
  };

  return (
    <OverlayContainer>
      <StyledAnimatableOverlay ref={overlayRef}>
        <CloseButton onPress={handleCloseOverlay}>
          <CloseButtonText>X</CloseButtonText>
        </CloseButton>
        <Title>{spotInfo.name}</Title>
        <Text style={{ color: 'white' }}>Type: {spotInfo.type}</Text>
        <Body>
          <ButtonContainer>
            <SectionButton onPress={() => setActiveSection('overview')}>
              <ButtonText>Overview</ButtonText>
            </SectionButton>
            <Title>|</Title>
            <SectionButton onPress={() => setActiveSection('reviews')}>
              <ButtonText>Reviews</ButtonText>
            </SectionButton>
            <Title>|</Title>
            <SectionButton onPress={() => setActiveSection('about')}>
              <ButtonText>About</ButtonText>
            </SectionButton>
          </ButtonContainer>
          <ContentContainer>
            {renderContent()}
          </ContentContainer>
        </Body>
        {/* Render images if any */}
      </StyledAnimatableOverlay>
    </OverlayContainer>
  );
};

const ImagesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
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
  top: 1%;
  background-color: #477399;
  padding: 20px;
  padding-top: 40px;
  flex: 1;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const OverlayContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Body = styled.ScrollView`
  background: #477399;
  margin-bottom: -10%;
`;


const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const Description = styled.Text`
  font-size: 16px;
  margin-top: 10px;
  color: white;
`;

const Box = styled.View`
  width: 100%;
  height: 40px;
  background-color: #495867;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #f7f7ff;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
`;

const CloseButton = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff0000;
  padding: 10px;
  border-radius: 10px;
  z-index: 10;
`;

const CloseButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;

const SectionButton = styled(TouchableOpacity)`
  padding: 10px;
`;

const ContentContainer = styled.View`
  padding: 20px;
`;


export default PinOverlay;
