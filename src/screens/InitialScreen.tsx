import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {useAuth} from '../context/AuthContext';
import {Alert} from 'react-native';
import AuthScreen from './AuthScreen';
import HomeStack from '../navigations/HomeStack';

const InitialScreen = () => {
  const {user, setUser} = useAuth();
  const getAuthState = async () => {
    try {
      const value = await AsyncStorage.getItem('@authState');
      if (value != null) {
        setUser(!!value);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong!');
    }
  };

  useEffect(() => {
    getAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !user ? <AuthScreen /> : <HomeStack />;
};

export default InitialScreen;
