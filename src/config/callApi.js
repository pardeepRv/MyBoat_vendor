import AsyncStorage from '@react-native-async-storage/async-storage';
// declare api
const API = 'https://freshandfine.xyz/app/webservice';

export const CallApi = async (method, apiPath, params) => {
  let token = await AsyncStorage.getItem('token');
  const url = `${API + apiPath}`;
  let options = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: params,
  };
  return fetch(url, options)
    .then(res => res.json())
    .then(res => {
      // console.log(JSON.stringify(response, null, 4));
      return res;
    })
    .catch(err => {
      return {message: err, type: 'danger'};
    });
};
