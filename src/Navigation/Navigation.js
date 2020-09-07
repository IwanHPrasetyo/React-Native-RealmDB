import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Contact from '../Pages/Contact/Contact';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ContactList" component={Contact} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
