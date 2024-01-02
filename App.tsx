import React, {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {config} from '@gluestack-ui/config';
import {GluestackUIProvider, Box} from '@gluestack-ui/themed';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/context/AuthContext';
import InitialScreen from './src/screens/InitialScreen';
import {PostProvider} from './src/context/PostContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthProvider>
        <PostProvider>
          <NavigationContainer>
            <GluestackUIProvider config={config}>
              <Box
                style={{
                  backgroundColor: isDarkMode ? Colors.black : Colors.white,
                }}
                height="100%">
                <InitialScreen />
              </Box>
            </GluestackUIProvider>
          </NavigationContainer>
        </PostProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;
