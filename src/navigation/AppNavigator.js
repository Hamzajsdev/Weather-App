import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import Homescreen from '../screen/Homescreen';

const Stack=createNativeStackNavigator()
const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen 
            name='Homescreen'
            component={Homescreen}
            options={{headerShown:false}}
            />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator