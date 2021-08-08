import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth:sessionToken';

export let setToken = (userToken: string) => {
  AsyncStorage.setItem(TOKEN_KEY, userToken);
};

export let getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export let removeToken = async () => {
  return await AsyncStorage.removeItem(TOKEN_KEY);
};
