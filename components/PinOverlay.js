// PinOverlay.js
import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal, Linking, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

const PinOverlay = ({ spotInfo, onClose, addReviewToMarker }) => {
  const overlayRef = useRef(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newReview, setNewReview] = useState('');

  const images = spotInfo.images?.map(uri => ({ url: uri })) || [];

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setImageModalVisible(true);
  };

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

  const handleAddReview = () => {
    if (newReview.trim()) {
      addReviewToMarker(spotInfo.id, newReview);
      setNewReview('');  // Clear the input after submitting
    }
  };

  const openMap = (coordinates) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${spotInfo.coordinate.latitude},${spotInfo.coordinate.longitude}`;
    Linking.openURL(url);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <Title>Location</Title>
            <LocationContainer>
              <Icon name="place" size={25} color="#fff" />
              {/* Check if an address is available, otherwise fallback to coordinates */}
              <LocationText>
                {spotInfo.address || `${spotInfo.coordinate.latitude} ${spotInfo.coordinate.longitude}`}
                {console.log("Current spotInfo:", spotInfo)}
              </LocationText>
              <TouchableOpacity onPress={() => openMap(spotInfo.coordinate.latitude, spotInfo.coordinate.longitude)}>
                <Text style={{ color: '#fff', fontSize: 21 }}>Open in Maps</Text>
              </TouchableOpacity>
            </LocationContainer>
            <Title>Pictures</Title>
            <ImagesContainer>
              {spotInfo.images && spotInfo.images.map((imageUri, index) => (
                <TouchableOpacity key={index} onPress={() => openImageModal(index)}>
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: 100, height: 100, margin: 5 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ImagesContainer>

          </>
        );
      case 'reviews':
        return (
          <>
            <Description>{spotInfo.reviews.length} reviews</Description>
            {spotInfo.reviews.map((review, index) => (<>
              <Box></Box>
              <ReviewBy>Anonymous</ReviewBy>
              <ReviewText key={index}>{review}</ReviewText>
            </>

            ))}
            <ReviewInput
              onChangeText={text => setNewReview(text)}
              value={newReview}
              placeholder="Write a review..."
              placeholderTextColor="white"
            />
            <TouchableOpacity onPress={handleAddReview}>
              <ButtonText>Submit Review</ButtonText>
            </TouchableOpacity>
          </>
        );
      case 'about':
        return (
          <>
            <Title>About This Spot</Title>
            {spotInfo.name && (
              <>
                <ButtonContainer>
                  <SubTitle>Name</SubTitle>
                  <Text style={{ color: 'white', fontSize: 18 }}>
                    {spotInfo.name}
                  </Text>
                </ButtonContainer>
              </>
            )}
            <Spacing></Spacing>
            {spotInfo.type && (
              <>
                <ButtonContainer>
                  <SubTitle>Type</SubTitle>
                  <Text style={{ color: 'white', fontSize: 18 }}>
                    {spotInfo.type}
                  </Text>
                </ButtonContainer>
              </>
            )}
            <Spacing></Spacing>
            {spotInfo.description && (
              <>
                <ButtonContainer>
                  <SubTitle>Description</SubTitle>
                  <Text style={{ color: 'white', fontSize: 18 }}>
                    {spotInfo.description}
                  </Text>
                </ButtonContainer>
              </>
            )}
            <Spacing></Spacing>
            {spotInfo.coordinate && (
              <>
                <ButtonContainer>
                  <SubTitle>Coordinates</SubTitle>
                  <Text style={{ color: 'white', fontSize: 12 }}>
                    Latitude {spotInfo.coordinate.latitude}
                    {"\n"}
                    Longitude {spotInfo.coordinate.longitude}
                  </Text>
                </ButtonContainer>
              </>
            )}
            <Spacing></Spacing>
          </>
        );
      default:
        return <Description>{spotInfo.description}</Description>;
    }
  };

  return (
    <>
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
      <Modal visible={imageModalVisible} transparent={true}>
        <ImageViewer imageUrls={images} index={currentImageIndex} onSwipeDown={() => setImageModalVisible(false)} enableSwipeDown={true} />
      </Modal>
    </>
  );
};

const ImagesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  border-radius: 2px;
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

const Spacing = styled.View`
margin-bottom: 30px;
`;


const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const SubTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
  text-align: center;
`;

const Description = styled.Text`
  flex: 1;
  font-size: 16px;
  margin-top: 10px;
  color: white;
  align-items: center;
  text-align: center;
  align-self: center;
`;


const Box = styled.View`
  width: 100%;
  height: 1px;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
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
  padding: 5px;
  border-radius: 10px;
  z-index: 10;
`;

const CloseButtonText = styled.Text`
  color: #000;
  font-size: 26px;
`;

const SectionButton = styled(TouchableOpacity)`
  padding: 10px;
`;

const ContentContainer = styled.View`
  padding: 20px;
`;

const LocationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
`;

const LocationText = styled.Text`
  margin-left: 10px;
  flex: 1;
`;

const ReviewBy = styled.Text`
  flex: 1;
`;

const ReviewText = styled.Text`
  margin-left: 10px;
  color: white;
  padding: 10px;
  margin-bottom: 5px;
`;

const ReviewInput = styled.TextInput`
height: 40px;
borderColor: #fff; 
borderWidth: 1px;
margin: 10px;
color: #fff;
padding: 10px;
`;


export default PinOverlay;
