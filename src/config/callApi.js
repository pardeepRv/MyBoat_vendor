import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../Constants/config";
// declare api
const API = "https://freshandfine.xyz/app/webservice";

export const CallApi = async (method, apiPath, params) => {
  let token = await AsyncStorage.getItem("token");
  const url = `${API + apiPath}`;
  let options = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: params,
  };
  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      // console.log(JSON.stringify(response, null, 4));
      return res;
    })
    .catch((err) => {
      return { message: err, type: "danger" };
    });
};

export const getPermission = async (used_id) => {
  new Promise(function (resolve, reject) {
    let url = config.apiUrl + "/get-permissions.php?user_id_post=" + used_id;
    axios
      .get(url)
      .then((res) => {
        resolve(res);
        if (res?.data?.success === "true") {
        console.log(res, "res getting permission");
        } else {
          reject(false);
        }
      })
      .catch((err) => console.log(err));
  });
};
