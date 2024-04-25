import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import AddEvent from './screens/AddEvent';
import EventInfo from './screens/EventInfo';
import AddSpot from './screens/AddSpot';
import * as Location from 'expo-location';

const Stack = createStackNavigator();
Location.installWebGeolocationPolyfill();

const Ops = { 
  headerTintColor: '#f7f7ff', // Set the color of the header text
  headerTitle: 'Srida',
  headerStyle: {
    backgroundColor: '#495867', // Set the background color of the header
  },
  headerBackTitle: 'Back', // Set the back button title to "Back"
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Disable header for Home screen
        />
        <Stack.Screen
          name="Events"
          component={EventsScreen}
          options={{ headerShown: false }} // Disable header for Events screen
        />
        <Stack.Screen name="AddEvent" component={AddEvent} options={Ops}/>
        <Stack.Screen name="EventInfo" component={EventInfo} options={Ops}/>
        <Stack.Screen name="AddSpot" component={AddSpot} options={Ops}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
