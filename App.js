import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native';

const BlurBackground = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Header = ({ navigation }) => {
  return (
    <Container>
      <BlurBackground tint="dark" intensity={100} />
      <HeaderTitle>Srida</HeaderTitle>
      <Box>
        <ButtonContainer>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <ButtonText>Srida Map</ButtonText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <ButtonText>Events</ButtonText>
          </TouchableOpacity>
        </ButtonContainer>
      </Box>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  flex-direction: column;
  align-items: center;
  background-color: #495867;
  z-index: 1;
`;

const HeaderTitle = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: #f7f7ff;
`;

const Box = styled.View`
  width: 70%;
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

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: ({ navigation }) => <Header navigation={navigation} />,
          }}
        />
        <Stack.Screen
          name="Events"
          component={EventsScreen}
          options={{
            header: ({ navigation }) => <Header navigation={navigation} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
